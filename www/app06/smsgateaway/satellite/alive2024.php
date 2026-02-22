<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   A L I V E S
//
//	Calls like:
//
//	http://192.168.0.37/smsgateaway/satellite/alive2024.php?cids=8932002100413934813!8932002100372910838!8932029862021146473!8932029062021259653&probe=1&web=1&csqs=10!11!12!13
//  https://smsgateaway.mobminder.com/satellite/alive2024.php?cids=8932002100450918042&probe=1&web=1
//

// push to test
// http://192.168.0.37/smsgateaway/user/push.php?qn=dev%20test%20queue&co=1111&to=32497462820&l=mob&p=spoden&web=1&bla=coucou%20bernard
//  => cids must be realistic iccid from the satellites table


require '../sga_lib.php';
$perfReport = new C_perfReport();
setrendermode('..');

if(!$web) { ob_start(); } // relates to (*ob1)

$probe = @$_REQUEST['probe']; if(!isset($probe)) $probe = false; else if($probe==1) $probe = 1; else $probe = 0; // probe must be specified like &probe=0 to prevent status change
$iccids = @$_REQUEST['cids']; if(!isset($iccids)) die('error 0100'); // sim card number ICCID
$csqs = @$_REQUEST['csqs']; if(!isset($csqs)) die('error 0101'); // carrier signal quality [99,0-31]
$recall = @$_REQUEST['recall']; if(!isset($recall)) $recall = false; else if($recall==1) $recall = 1; else $recall = 0;
	
$spliticcids = Explode('!', $iccids);
$splitcsqs = Explode('!', $csqs);

h1('Multi satellites mode');

if($web)
{
	h2('Mandatory parameters for this call: ');
	indent('o <b>cids</b>: your SIM ICCID device number list [MMCCII123456789012CMMCCII123456789012C;MMCCII123456789012].',3);
	pad(0);
	
	h2('Optional parameters for this call: ');
		indent('o <b>probe</b>: get the next SMS but leave it untouch in the queue (that is for testing purpose)',3);
		pad(0);
		
		h2('Two possible reasons exist for which you will not be served an sms in return:',3);
		indent('1- the <b>queues</b> assigned to this satellite are empty.',3);
		indent('2- <b>csq</b> is lower than 16, or is 99 (no network). Your satellite must sleep for the last time communicated lag time, then call alive.php again.',3);
		pad(0);

	h2('You have posted: ');

		indent('o <b>cids</b>: '.$iccids,3);
		if($probe!==false) indent('o <b>probe</b>: '.($probe?'(probe mode ON)':'(probe mode OFF)'),3);
		pad(0);
		
	pad(2);

}

$smslist = [];
$index=0;
foreach($spliticcids as $iccid) 
{
	$perfReport->peak('::start loop with iccid='.$iccid);

	$csq = $splitcsqs[$index];
	$index++;

	$satellite = C_dS_satellite::login($iccid,false);
	if($satellite==null) continue;

	$satid = $satellite->id;
	//$csq = $satellite->lastcsq;
	$ptmp = $satellite->lastptmp;
	$queues = $satellite->queues();

	if($web) {
		h1('Satellite: '.$satellite->name);
			
			indent('o your sms fetch count for today:'.$satellite->fetchthisday,3);
			indent('o your sms fetch count for this week:'.$satellite->fetchthisweek,3);
			indent('o your sms fetch count for this month:'.$satellite->fetchthismonth,3);
			
		h2('You are serving queues: ');
		if(count($queues)==0) indent('<b>no queue</b>',3);
		$qc = 0;
		foreach($queues as $qid => $dS_queue) indent(++$qc.'. (queue id:'.$qid.') Queue name: <b>'.$dS_queue->name.'</b>',3);
	}

	$perfReport->peak('::credentials');

	$sms = false;
	$load = $satellite->fetchthisday;
	$quota = 300; // see also (*th01*), we use diff thresholds for dashboard display and for alive.php, taking inbound into consideration 

	$recallfound =false;
	//if($csq>10 && $csq<99) if($load<$quota) { // conditions to feed the satellite
	if($csq>10 && $csq<99) if($load<$quota) { // conditions to feed the satellite
		
		// 	$csq  RSSI dBm	Condition
		//
		// 	2		-109	Marginal
		// 	3		-107	Marginal
		//	4		-105	Marginal
		// 	5		-103	Marginal
		// 	6		-101	Marginal
		// 	7		-99		Marginal
		// 	8		-97		Marginal
		// 	9		-95		Marginal
		// 	10		-93		OK
		// 	11		-91		OK
		// 	12		-89		OK
		// 	13		-87		OK
		// 	14		-85		OK
		// 	15		-83		Good
		// 	16		-81		Good
		// 	17		-79		Good
		// 	18		-77		Good
		// 	19		-75		Good
		// 	20		-73		Excellent
		// 	21		-71		Excellent
		// 	22		-69		Excellent
		// 	23		-67		Excellent
		// 	24		-65		Excellent
		// 	25		-63		Excellent
		// 	26		-61		Excellent
		// 	27		-59		Excellent
		// 	28		-57		Excellent
		// 	29		-55		Excellent
		// 	30		-53		Excellent

		// Levels of priority in serving SMSs :
		// Three parameters are taken into account for serving SMS
		//
		// 1. FIFO   <=> always serve the oldest created first
		// 2. Priority  <=> always serve the highest prirority first
		// 3. Queued or queueless  <=> always serve the queued item first, unless they are queueless and prioritized

		/*If the command returns +CSQ: 99,99, it means that the module is not detecting any signal or is not connected to the network. This could be due to several reasons:
		No network coverage: The module is in an area without network coverage.
		Configuration issue: The module is not properly configured, or the SIM card is not recognized.
		Missing or locked SIM card: If the SIM card is not inserted or is locked by a PIN code, it may prevent network detection.
		Hardware problem: The module or its antenna may be faulty.*/ 

		//recall is used just after a timeout network error occured on smsbox when calling alive.php
		//it force server to resend last 110 status sms if exists
		if($recall) {
			$sms = $satellite->feedWithRecall();
			if($sms) $recallfound=true;
			else $sms = $satellite->feed(); // pop from the queue this satellite is assigned to. Higher priority SMS will come first
		}
		else{
			$sms = $satellite->feed(); // pop from the queue this satellite is assigned to. Higher priority SMS will come first
		}
		
	}



	$perfReport->peak('::feeded');

	////////////////////////////////////////////////////////////////////////////////
	//
	// Echo to satellite
	//
		

		

	if($sms) {
		
		$sms->csq 		= $csq;
		$sms->procstmp	= $ptmp;
		
		if(!$probe) $sms->setSatellite($satellite->id); // assigns to a satellite and change status to "satellite (110)" and saves to DB
			$sublag = (int)($satellite->lag/3);
			$skew = rand(-$sublag,$sublag);
		$sms->lag = $satellite->lag+$skew;

		$sms->iccid = $iccid;
		
		$smslist[]=$sms;
		warning('There is a SMS to serve');
	}
	else {
		
		if($web) {
			if($csq<=15 || $csq==99) warning('There is currently no sufficient carrier signal quality, please re-apply your last lag');
			else if($load>=$quota) warning('Maximum load quota has been reached ('.$load.')');
			else warning('There is currently no new SMS to serve');
		}
		
	}

	unset($satellite->queues);
		


	$perfReport->peak('::streamed');





	////////////////////////////////////////////////////////////////////////////////
	//
	// Save satellite record, we made is such that it is as atomic as possible, see (*sga08*)
	//
	$sats = C_dS_satellite::$current_satellites;

	if($sms && !$recallfound)
		new Q('update '.$sats.' set lastseen = "'.C_id::tracknow().'", lastcsq = '.$csq.', fetchever=fetchever+1, fetchthishour=fetchthishour+1, fetchthisday=fetchthisday+1, fetchthisweek=fetchthisweek+1, fetchthismonth=fetchthismonth+1 where id='.$satid.';');
	else
		new Q('update '.$sats.' set	lastseen = "'.C_id::tracknow().'", lastcsq = '.$csq.' where id='.$satid.';');



	$perfReport->peak('::accounted');
		
}


////////////////////////////////////////////////////////////////////////////////
//
// Specifications
//

$idfields = Array('id');
$smsfields = Array('to','encoding','lag','bla','iccid');
$fields = array_merge($idfields, $smsfields);

		
pad(); h1('Returned objects');
$sms = new C_dS_sms(0, 0);
$sms->lag = 1;
explainclass($sms, $fields, '|');

echo '<data>#C_dS_sms'.$nl;
span('&ltdata&gt');
foreach ($smslist as $sms) echo $sms->stream(no_tracking, '|', $fields).$nl;
span('&lt/data&gt');
echo '</data>';


if($web) 
 // disabled when testing using browser mode, so the next section can echo on the screen
	$perfReport->dropReport();
else
	$perfReport->logReport('alive2024');

	////////////////////////////////////////////////////////////////////////////////
//
// Close connection ( escape from KEEP_ALIVE !! )
//
//if(!$web) { // disabled when testing using browser mode, so the next section can echo on the screen
//	
//	closeconnection();
//}

endrendermode();
?>