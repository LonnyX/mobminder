<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   R E A D   S M S   S T A T U S 
//
//
//  Example call
//
// 
//
//  

$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if(!$web) { ob_start(); } // relates to (*ob1)
	
require '../sga_lib.php';
setrendermode('..');
$dS_login = checkcredentials();
	
// queue
$qn = false; $qid = false;
$qid = @$_REQUEST['qid']; 
if(!isset($qid)) { // you can call this interface with either queue name or queue id
	$qid = false;
	$qn = @$_REQUEST['qn']; if(!isset($qn)||$qn=='') $qn = false;
} else {
	if(!is_numeric($qid)) die('error 1601'); // queue id must be numeric
}


// sms
$co 	= @$_REQUEST['co']; if(!isset($co)) $co = false; // no correlator
$gr 	= @$_REQUEST['gr']; if(!isset($gr)) $gr = false; // group
$sn 	= @$_REQUEST['sn']; if(!isset($sn)) $sn = false; // sinds - all sms created since given date-time YYYY-MM-DD HH:MM

// sms values validation
if(!is_numeric(str_replace('!','',$co))) $co = false; // correlator is not numeric
	else $co = str_replace('!',',',$co); // make it ready for SQL query
if(strlen($sn)!=16) $sn = false; // date is not a date

if($gr) {
	if(!is_numeric($gr)) die('error 1602'); // group id is not a numeric
	if($gr<0) die('error 1611'); // group is signed
}
if($co<0) die('error 1612'); // correlator is not unsigned


	h3('Mandatory fields');
		if(!$qn&&!$co&&!$gr&!$qid) {
			indent('o one of queue name (qn), queue id (qid), correlator (co) or group (gr) is mandatory',6);
			die('error 1613');
		}
		else indent('ok',6);
	
	h3('Optional fields');
		if($gr) indent('o gr: '.$gr.' (user level 2 correlator)',6);
		if($qid) indent('o qid: '.$qid.' (queue id)',6);
		if($qn) indent('o qid: '.$qn.' (queue name)',6);
		if($co) indent('o co: '.$co.' (correlator)',6);
		if($sn) indent('o sn: '.$sn.' (since timestamp)',6);
		
	
// queue validation


	$qtable = C_dS_queue::$current_queues;

if($qn) { // retrieve qid
	if($qn=='0') { 
		$qid = 0; // queueless message
	} else {
		$q = new Q('select id from '.$qtable.' where name = "'.$qn.'";');
		$c = $q->cnt();
		if($c==0) die('error 1621'); // queue name is not recognized
		if($c>1) die('error 1622'); // many queues have the same name
		$qid = $q->ids();
	}
} else if($qid!=0) { // call was based on a queue id, validate the queue id
		$q = new Q('select id from '.$qtable.' where id = "'.$qid.'";');
		$c = $q->cnt();
		if($c==0) die('error 1623'); // queue id is not recognized
		$qid = $q->ids();
}

$queues = Array();
	
if($qid) {
	$queues[$qid] = new C_dS_queue($qid);
	h2('You are monitoring one queue: '.$queue->name.' ');
	$qid = Array(); $qid[0] = $qid;
	$qids = $qid;
	
} else {
		h2('You are monitoring over all of your queues');
		
		$q = new Q('select id from '.$qtable.' where parentid = '.$dS_login->id.';');
		$c = $q->cnt();
		if($c==0) die('error 1624'); // login has no queue
		$qid = $q->ids(list_as_array);
		$qids = $q->ids(list_as_string);

		foreach($qid as $id) $queues[$id] = new C_dS_queue($id);

		foreach($queues as $qid => $dS_queue) {
			indent($dS_queue->name.' (id '.$qid.')',6);
		}
}


		h2('Status');
		

pad(); h2('SMSs');

// load SMS according to filters

$smss = Array();

		$co = $co ? 'and correlator in ('.$co.') ' : '';
	$q = new Q($sql='select id, parentid, correlator, groupid, priority, created, lifetime, status, sms.when from sms where parentid in ('.$qids.') '.$co.';');
	
	while($row = $q->result->fetch_array()) {
		$dS_sms = new C_dS_sms(false, false, $row); // we want to load the object but without the blabla text, so to improve the performance
		$dS_sms->id = $row['id'];
		$smss[] = $dS_sms;
		unset($dS_sms);
	}
	
	
pad();		


////////////////////////////////////////////////////////////////////////////////
//
// Echo to user
//
	

	$idfields = Array('id','parentid');
	$smsfields = Array('correlator','groupid','priority','created','lifetime','status','when');
	$fields = array_merge($idfields, $smsfields);
	
echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
		echo '#C_dS_sms'.$nl;
		foreach($smss as $dS_sms) {
			echo $dS_sms->stream(no_tracking, '|', $fields).$nl;
		}
	span('&lt/data&gt');
echo '</data>';



	endrendermode();
?>