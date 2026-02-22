<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   P U S H    S M S    I N    Q U E U E 
//
//
//  Example call
//
//  


// http://localhost/webapp/smsgateaway/user/push.php?l=alphanight88&p=404&co=10&qn=cluster2020&bla=hello&to=32493655599&web=1


$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if(!$web) { ob_start(); } // relates to (*ob1)
	
require '../sga_lib.php';

$perfReport = new C_perfReport();

setrendermode('..');
$dS_login = checkcredentials();
$perfReport->peak('::credentials');
	
// queue
$qn = false; $qid = false;
$qid = @$_REQUEST['qid']; 
if(!isset($qid)) { // you can call this interface with either queue name or queue id
	 // one queue name or qid is mandatory
	$qn = @$_REQUEST['qn']; if(!isset($qn)||$qn=='') die('error 1100'); // queue name or qid is mandatory
} else {
	if(!is_numeric($qid)) die('error 1101'); // queue id must be numeric
}

// sms
$co 	= @$_REQUEST['co']; if(!isset($co)) die('error 1110'); // no correlator
$gr 	= @$_REQUEST['gr']; if(!isset($gr)) $gr = 0; if($gr == '') $gr = 0; // defaults to zero
$to 	= @$_REQUEST['to']; if(!isset($to)) die('error 1111'); // no recipient
$bla 	= @$_REQUEST['bla']; if(!isset($bla)) die('error 1112'); if($bla=='') die('error 1113'); // no text
$lt		= @$_REQUEST['lt']; if(!isset($lt)) $lt = 0;
$pr		= @$_REQUEST['pr']; if(!isset($pr)) $pr = 0;
$enc	= @$_REQUEST['enc']; if(!isset($enc)) $enc = 'ascii7'; if($enc !== 'ascii7') if($enc !== 'ucs2') die('error 1114');


// sms values validation
if(!is_numeric($co)) $co = 0; // correlator is not numeric
if(!is_numeric($to)) die('error 1130'); // recipient number is not numeric
if(!is_numeric($lt)) die('error 1140'); // life time is not a numeric
if(!is_numeric($gr)) die('error 1150'); // group id is not a numeric

if($co<0) die('error 1121'); // correlator is not unsigned
if($to<0) die('error 1131'); // recipient number is not unsigned
if($lt<0) die('error 1141'); // life time is not a unsigned

if(substr($to,0,1)=='0') $to = '32'.substr($to,-(strlen($to)-1)); // echo '-'.$to.'-';
	
if($to<32400123456) die('error 1132'); // recipient number is out of range
if($to>32499999999) die('error 1133'); // recipient number is out of range


	h3('Mandatory fields');
		if($qn) indent('o qn: '.$qn.' (queue name)',6);
		if($qid) indent('o qid: '.$qid.' (queue name)',6);
		indent('o co: '.$co.' (user correlator)',6);
		indent('o to: '.$to.' (recipient phone number)',6);
		indent('o bla: '.$bla.' (message text)',6);
	
	
	h3('Optional fields');
		indent('o lt: '.$lt.' (life time in minutes)',6);
		indent('o pr: '.$pr.' (message priority)',6);
		indent('o gr: '.$gr.' (user level 2 correlator)',6);
		indent('o enc: '.$enc.' (encoding, can be ascii7 or ucs2)',6);
	
// queue validation

	$sats = C_dS_satellite::$current_satellites;
	$qtable = C_dS_queue::$current_queues;
	
if($qn) { // retrieve qid
	if($qn=='0') { // queueless message
		$qid = 0; 
	} 
	else if(is_numeric($qn)) { // satellite dedicated message
		$qid = $qn+0;
		$q = new Q('select id from '.$sats.' where id = "'.$qid.'";');
		$c = $q->cnt();
		if($c==0) die('error 1151'); // queue name is numeric but does not match a statellite id
	} 
	else{
		$q = new Q('select id from '.$qtable.' where name = "'.$qn.'";');
		$c = $q->cnt();
		if($c==0) die('error 1161'); // queue name is not recognized
		if($c>1) die('error 1162'); // many queues have the same name
		$qid = $q->ids();
	}
} else if($qid!=0) { // call was based on a queue id, validate the queue id
		
		if($qid < 1000) { // is a queue id
			$q = new Q('select id from '.$qtable.' where id = "'.$qid.'";');
			$c = $q->cnt();
			if($c==0) die('error 1103'); // queue id is not recognized
			$qid = $q->ids();
		} else { // is a satellite id
			$q = new Q('select id from '.$sats.' where id = "'.$qid.'";');
			$c = $q->cnt();
			if($c==0) die('error 1104'); // queue name is numeric but does not match a statellite id
			$qid = $q->ids();
		}
}

if($qid >= 1000) { // satellite dedicated message
		h2('You are pushing satellite dedicated message');
		$q = new Q('select id from '.$sats.' where id = "'.$qid.'";');
		$c = $q->cnt();
		if($c==0) die('error 1171'); // queue name is numeric but does not match a statellite id
	}
	else if($qid) {
		$queue = new C_dS_queue($qid);
		h2('You are pushing to queue: '.$queue->name.' ');
		
		$queue->pushedever++; // (*sg01*)
		$queue->pushthishour++;
		$queue->pushthisday++;
		$queue->pushthisweek++;
		$queue->pushthismonth++;
		$queue->save();
	} else {
		h2('You are pushing a queueless message'); // $qid == 0
	}


$perfReport->peak('::input validation');


$hlr = new C_dS_hlr($to);



$perfReport->peak('::hlr instance');

$sms = new C_dS_sms(0, $qid); // 0 produces an insert in sms table when ->save() function is called

$sms->correlator = $co;
$sms->groupid = $gr;
$sms->to = $to;
$sms->mod1000 = $to%1000; // this is an indexed derived value, used by the satellite::feed() function, considering patches.n_inf_to and patches.n_sup.to
$sms->bla = $bla;
$sms->lifetime = $lt;
$sms->priority = $pr;
$sms->encoding = $enc;
$sms->home = $hlr->operator; // in case the hlr lookup service never responds, our SMS gets anyway a chance to be routed to a cluster


$perfReport->peak('::sms instance');


echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
		echo '#C_dS_sms'.$nl.$sms->stream().$nl;
	span('&lt/data&gt');
echo '</data>';


$perfReport->peak('::stream echo');

$sms->save(); // now the sms is available for a satellite to pick it up
$smsid = $sms->id;
$ms_push = $perfReport->getlaptime();

$perfReport->peak('::sms saved');
$perfReport->dropReport();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// Close connexion (but keep this script running)
//
// Why ? 
// So you can allow the user to shoot all his push requests in a short time window. We treat their hlr in background. 
//
//



$perfReport = new C_perfReport(); // appoint another counter for the hlr processing time

if(!$web) { // disabled when testing using browser mode, so the next section can echo on the screen
	
	closeconnection();

}


$perfReport->peak('::connexion closed');


    set_time_limit(60); // for hlr_lookup to have time to operate
//
// hlr lookups take like 1,5 seconds (*), that is why they are here after the connexion close.
// (*) 12 seconds in extreme cases have been observed
//
		$new = $hlr->isnew()?'YES':'No';
		$exp = $hlr->isexpired()?'YES':'No';
	
	h2('HLR lookup for: '.$hlr->mobile);
	$hlr->update(); // contains a potential time consuming curl to hlr webservice
	warning('new: '.$new);
	warning('expired: '.$exp);
	warning($hlr->home);

$perfReport->peak('::hlr updated');

	// track ms performance
	$sms = new C_dS_sms($smsid);
	$sms->ms_push = $ms_push;
	$sms->ms_hlr = $perfReport->getlaptime(); 
	$sms->save(); // now the sms is available for a satellite to pick it up
	
$perfReport->peak('::SMS updated with lag time');

if($web) $perfReport->dropReport();

	endrendermode();
?>