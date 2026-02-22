#!/usr/bin/php5 -q
<?php

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it

define('faketime', '2015-06-06 10:30:03'); // watch the line where sendOver() is called !!

	if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
		$faketime = $_GET['fkt'];
	else $faketime = faketime;
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


if(isset($_REQUEST['web'])) require '../sga_lib.php';  // when running it locally
else require '/var/www/smsgateaway/sga_lib.php'; // when running in production


$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;
setrendermode('..');


$start_time = time();
if($web) $exec_time = strtotime($faketime); else $exec_time = $start_time;

h2('Execution time: '.Date('Y-m-d H:i:s',$exec_time));





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	This process selects any sms not yet sent to a satellite and decreases the lifetime for each item
//	An item with lifetime falling to zero will turn into status 800 (expired) 
//
//

pad();
h2('Decrementing sms lifetime');


$q = new Q('select count(1) as c from sms where lifetime = 1 and status = '.sms_status_created.';');
$exp = $q->c();
$q = new Q('select count(1) as c from sms where lifetime > 1 and status = '.sms_status_created.';');
$lifetime = $q->c();

//new Q('update sms set status='.sms_status_expired.', lifetime=0 where lifetime = 1 and status = '.sms_status_created.';');
new Q('update sms set status='.sms_status_expired.', lifetime=0 where lifetime = 1 and status in ( '.sms_status_created.','.sms_status_satellite.' ) ;');
//new Q('update sms set lifetime=lifetime-1 where lifetime > 1 and status = '.sms_status_created.';');
new Q('update sms set lifetime=lifetime-1 where lifetime > 1 and status in ( '.sms_status_created.','.sms_status_satellite.' ) ;');





	notice('Number of pending sms: '.$lifetime);
	notice('Number of expired sms: '.$exp);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Read sms status from the past minute and provide them to the login owner feedback url
//
//


pad();
h2('Sending SMS status feedback to the client login feedback url');

$l = C_dS_login::loadall(); // array of instances of C_dS_login
foreach($l as $lid => $dS_login) {
	if($dS_login->feedbackurl=='') continue; // this one does not wish feedback
	$url = $dS_login->feedbackurl;
	$qids = C_dS_queue::ids($lid); // array of instances of C_dS_queue belonging to dS_login
	$cue = Date('Y-m-d H:i:s',time()-60-2); // covers past minute (any status that was changed in the past minute)
	
	h3('Client:'.$dS_login->name);
	notice('Queues:'.$qids);
	notice('Cue:'.$cue);

	
	$fields = 'id, parentid, correlator, groupid, priority, created, lifetime, status, sms.when';
	$q = new Q($sql='select '.$fields.' from sms where parentid in ('.$qids.') and sms.when > "'.$cue.'" and sms.status <> '.sms_status_discarded.';');
	
	$smss = Array();
	while($row = $q->result->fetch_array()) {
		$dS_sms = new C_dS_sms(false, false, $row); // we want to load the object but without the blabla text, so to improve the performance
		$dS_sms->id = $row['id'];
		$smss[] = $dS_sms;
		unset($dS_sms);
	}
	$idfields = Array('id','parentid');
	$smsfields = Array('correlator','groupid','priority','created','lifetime','status','when');
	$fields = array_merge($idfields, $smsfields);
	$payload = '';
	
	notice('Payload:');
	$payload .= '<data>'; // enclose the file content within the stream
		$payload .= '#C_dS_sms'.chr(10);
		foreach($smss as $dS_sms) $payload .=  $dS_sms->stream(no_tracking, '|', $fields).chr(10);
	$payload .= '</data>';
	
	if($web) notice(str_replace(chr(10),'</br>',$payload));
	
	notice('Sending to:'.$url);
	$r = false;
	$r = smsgacurl($url,Array('stream'=>$payload)); // 
	if($r===false) warning('URL curl error');
	else notice('Response from remote feedback host:<br/>'.$r);
	pad();
}




	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Finish the Cron execution and log to the /var/log/smsga-crons/minute.log

$end_time = time();
$done = 'O '.Date('Y-m-d H:i:s',$end_time).' - total sms with lifetime: '.$lifetime.', expired: '.$exp;

if($web) { // testing locally displays HTML back to client
	pad(); h2($done); pad(); 
} else { // running in CLI mode, outputs to /var/log/smsga-crons/halfs.log
	echo $done.chr(10);
}

endrendermode();
?>