<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   A L I V E 
//
//	Calls like:

//  http://localhost/smsgateaway/satellite/alive.php?sim=32493655599&web=1
//
//  http://localhost/webapp/smsgateaway/satellite/alive.php?cid=8932029862021146473&csq=20&ptmp=50&pwr=1&ver=20200324&probe=1&web=1
//
//  => cid must be a realistic iccid from the satellites table


require '../sga_lib.php';
$perfReport = new C_perfReport();
setrendermode('..');

if(!$web) { ob_start(); } // relates to (*ob1)


$csq = @$_REQUEST['csq']; if(!isset($csq)) die('error 0110'); // carrier signal quality [99,0-31]
	if(!is_numeric($csq)) die('error 0111'); 
$ptmp = @$_REQUEST['ptmp']; if(!isset($ptmp)) die('error 0120'); // processor temperature
	if(!is_numeric($ptmp)) die('error 0121'); 
$pwr = @$_REQUEST['pwr']; if(!isset($pwr)) die('error 0130'); // power level
	if(!is_numeric($pwr)) die('error 0131');  if($pwr<0||$pwr>1) die('error 0132'); // must be boolean
$ver = @$_REQUEST['ver']; if(!isset($ver)) die('error 0140'); // software version
	if(!is_numeric($ver)) die('error 0141'); 
	if($ver!=0) if($ver<20190101||$ver>20400131) die('error 0142'); // must be a date in format [YYYYMMDD] with a right range
	
$sign = @$_REQUEST['sign']; if(!isset($sign)) $sign = 'NA'; // software version signature
	if(strlen($sign)>16) die('error 0151'); 
$sos = @$_REQUEST['sos']; if(!isset($sos)) $sos = false; if($sos) $sos = true; // sos mode, the satellite takes commands but no sms

$sat = @$_REQUEST['sat']; if(!isset($sat)) $sat = 'na'; if($sat) $sat = substr($sat,0,16); // sat controller nickname as written in the sms.cnf file
$port = @$_REQUEST['port']; if(!isset($port)) $port = 'na'; if($port) $port = substr($port,0,16); // simpool port id (is the com port id as seen by the linux on the raspberry supervisor)


$probe = @$_REQUEST['probe']; if(!isset($probe)) $probe = false; else if($probe==1) $probe = 1; else $probe = 0; // probe must be specified like &probe=0 to prevent status change


	$iccid = @$_REQUEST['cid']; if(!isset($iccid)) die('error 0100'); // sim card number ICCID

$perfReport->peak('::login with iccid='.$iccid);

$satellite = C_dS_satellite::login($iccid);
$satid = $satellite->id;
$queues = $satellite->queues();


if($web) {
	h2('Welcome satellite: '.$satellite->name);
		
		indent('o your sms fetch count for today:'.$satellite->fetchthisday,3);
		indent('o your sms fetch count for this week:'.$satellite->fetchthisweek,3);
		indent('o your sms fetch count for this month:'.$satellite->fetchthismonth,3);
		
		
	h2('You are serving queues: ');
	$qc = 0;
	foreach($queues as $qid => $dS_queue)
		indent(++$qc.'. (queue id:'.$qid.') Queue name: <b>'.$dS_queue->name.'</b>',3);
		
	h2('Mandatory parameters for this call: ');

		indent('o <b>cid</b>: your SIM ICCID device number [MMCCII123456789012C].',3);
		indent('o <b>csq</b>: your carrier signal quelity [99, 1 to 31].',3);
		indent('o <b>ptmp</b>: your processor temperature [0 to 255].',3);
		indent('o <b>pwr</b>: your power voltage state [0, 1].',3);
		indent('o <b>ver</b>: the version of the current satellite software, like [20200921].',3);
		pad(0);
		
	h2('Optional parameters for this call: ');
		indent('o <b>probe</b>: get the next SMS but leave it untouch in the queue (that is for testing purpose)',3);
		indent('o <b>sos</b>: you are able to receive a command but no sms should be feeded to you',3);
		pad(0);
		
		h4('Two possible reasons exist for which you will not be served an sms in return:',3);
		indent('1- the <b>queues</b> assigned to this satellite are empty.',3);
		indent('2- <b>csq</b> is lower than 16, or is 99 (no network). Your satellite must sleep for the last time communicated lag time, then call alive.php again.',3);
		indent('3- <b>pwr</b> the power voltage level is insufficient on the rpi.',3);
		pad(0);

	h2('You have posted: ');

		indent('o <b>cid</b>: '.$iccid,3);
		indent('o <b>csq</b>: '.$csq,3);
		indent('o <b>pwr</b>: '.$pwr,3);
		indent('o <b>ptmp</b>: '.$ptmp,3);
		indent('o <b>ver</b>: '.$ver,3);
		if($probe!==false) indent('o <b>probe</b>: '.($probe?'(probe mode ON)':'(probe mode OFF)'),3);
		if($sos!==false) indent('o <b>sos</b>: '.($sos?'(SOS mode ON)':'(SOS mode OFF)'),3);
		indent('o <b>sat</b>: '.($sat?$sat:'(empty)'),3);
		indent('o <b>port</b>: '.($port?$port:'(empty)'),3);
		pad(0);
		
		
	pad(2);
		
		// $h = new C_dS_hlr(32493655599);
		// warning($h->home);
		// $h = new C_dS_hlr(32497401626);
		// warning($h->home);
		// $h = new C_dS_hlr(37064783105);
		// warning($h->home);

}

$perfReport->peak('::credentials');

$sms = false;
$load = $satellite->fetchthisday;
$quota = 300; // see also (*th01*), we use diff thresholds for dashboard display and for alive.php, taking inbound into consideration 

if($pwr) if($csq>10 && $csq<99) if($load<$quota) if($sos==false) { // conditions to feed the satellite
	
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

	$sms = $satellite->feed(); // pop from the queue this satellite is assigned to. Higher priority SMS will come first
}



$perfReport->peak('::feeded');

////////////////////////////////////////////////////////////////////////////////
//
// Echo to satellite
//
	
	$idfields = Array('id');
	$smsfields = Array('to','encoding','lag','bla');
	$fields = array_merge($idfields, $smsfields);
	
$cmd = false;

if($sms) {
	
	$sms->csq 		= $csq;
	$sms->procstmp	= $ptmp;
	
	if(!$probe) $sms->setSatellite($satellite->id); // assigns to a satellite and change status to "satellite (110)" and saves to DB
		$sublag = (int)($satellite->lag/3);
		$skew = rand(-$sublag,$sublag);
	$sms->lag = $satellite->lag+$skew;
	
	echo '<data>'; 
		span('&ltdata&gt');
			echo $sms->stream1(no_tracking, '|', $fields).$nl;
		span('&lt/data&gt');
	echo '</data>';
}
else {
	
	if($web) {
		if($csq<=15 || $csq==99) warning('There is currently no sufficient carrier signal quality, please re-apply your last lag');
		else if($pwr==0) warning('Low power voltage on this satellite');
		else if($load>=$quota) warning('Maximum load quota has been reached ('.$load.')');
		else if($sos) warning('Yuo are in SOS mode');
		else warning('There is currently no new SMS to serve');
	}
	
	echo '<data>';
		span('&ltdata&gt');
		span('&lt/data&gt');
	echo '</data>';
}

unset($satellite->queues);
	
	
////////////////////////////////////////////////////////////////////////////////
//
// Now checking software version
//
	
	
if($ver) { // passing 0 for the version number indicates you are not interested in SW release ( case for 9 of 10 SIM868 shields in the new version running only one Raspberry for 10 shields)
	$binfile = new C_smsbox();
	$serverversion = $binfile->version();
	if($serverversion!=$ver) {
		warning('SW server version is '.$serverversion);
		warning('SW satellite version is '.$ver);
		$cmd = 'update';
	}
}
	
if(0) {
	$cmd = 'oshalt'; // full shutdown of linux after smsbox gracefull exit
	$cmd = 'osrestart'; // smsbox gracefull stop + os restart
	$cmd = 'smsboxstop'; // gracefull exit of smsbox, will be restarted by service
}

if($cmd) {
	
	echo '<command>';
		span('&ltcommand&gt');
			echo $cmd;
		span('&lt/command&gt');
	echo '</command>';
}


$perfReport->peak('::streamed');


////////////////////////////////////////////////////////////////////////////////
//
// Close connection ( escape from KEEP_ALIVE !! )
//
	
if(!$web) { // disabled when testing using browser mode, so the next section can echo on the screen
	
	closeconnection();
}



////////////////////////////////////////////////////////////////////////////////
//
// Save satellite record, we made is such that it is as atomic as possible, see (*sga08*)
//
	$sats = C_dS_satellite::$current_satellites;

if($sms)
	new Q('update '.$sats.' set
	lastseen = "'.C_id::tracknow().'", lastcsq = "'.$csq.'", lastptmp = "'.$ptmp.'", swversion = "'.$ver.'", swsignatr = "'.$sign.'", 
	fetchever=fetchever+1, fetchthishour=fetchthishour+1, fetchthisday=fetchthisday+1, fetchthisweek=fetchthisweek+1, fetchthismonth=fetchthismonth+1, 
	sat="'.$sat.'", port="'.$port.'"
	where id='.$satid.';');
else
	new Q('update '.$sats.' set
	lastseen = "'.C_id::tracknow().'", lastcsq = "'.$csq.'", lastptmp = "'.$ptmp.'", swversion = "'.$ver.'", swsignatr = "'.$sign.'", 
	sat="'.$sat.'", port="'.$port.'"
	where id='.$satid.';');



$perfReport->peak('::accounted');
	
	
if($web) { // disabled when testing using browser mode, so the next section can echo on the screen
	$perfReport->dropReport();
}
else {
	$perfReport->logReport('alive');
}

////////////////////////////////////////////////////////////////////////////////
//
// Specifications
//
	
	pad(); h2('Returned objects');
if(!$sms) { // eplainclass() needs an instance
	$sms = new C_dS_sms(0, 0);
	$sms->lag = 1;
}
	explainclass($sms, $fields, '|');

endrendermode();
?>