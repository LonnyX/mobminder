<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y    /    D I S C A R D     S M S     F R O M     Q U E U E 
//
//	Put the SMS items in an idle state but does not remove them from the DB
//
//  Example of calls
//
//  localhost/smsgateaway/user/discard.php?qn=medicus		//discards all sms in the medicus queue
//  localhost/smsgateaway/user/discard.php?gr=2019052011	//discards from all queues sms having groupid 2019052011
//  localhost/smsgateaway/user/discard.php?co=999888555444	//discards a unique sms having correlator id 999888555444
//  localhost/smsgateaway/user/discard.php?gr=2019052011&qn=medicus	//discards from queue medicus sms having groupid 2019052011
//  localhost/smsgateaway/user/discard.php?qn=0		//discards queueless messages
//  localhost/smsgateaway/user/discard.php?qid=0		//discards queueless messages
//
//	&l=mob&p=spoden&web=1 are usual mandatory parameters
// 

require '../sga_lib.php';
setrendermode('..');
$dS_login = checkcredentials();
	
// filter parameters

if(isset($_REQUEST['qid'])) $qid = $_REQUEST['qid']; else $qid = false; 
if(isset($_REQUEST['qn'])) $qn = $_REQUEST['qn']; else $qn = false; 
if(isset($_REQUEST['co'])) $co = $_REQUEST['co']; else $co = false; 
if(isset($_REQUEST['gr'])) $gr = $_REQUEST['gr']; else $gr = false; 
if(isset($_REQUEST['do'])) $do = $_REQUEST['do']; else $do = 0; 


// sms values validation
if($co) if(!is_numeric($co))  die('error 1811'); // correlator is not numeric
if($qid) if(!is_numeric($qid))  die('error 1812'); // queue id is not numeric
if($gr) if(!is_numeric($gr))  die('error 1813'); // group is not numeric
if($do) if(!is_numeric($do))  die('error 1814'); // do is not numeric

if($co<0) die('error 1821'); // correlator is not unsigned
if($qid<0) die('error 1822'); // queue id is not unsigned
if($gr<0) die('error 1823'); // group is not unsigned
if($do!=1&&$do&=0) die('error 1824'); // do must be 1 or 0

	h3('Mandatory fields');
		if($qn) indent('o qn: '.$qn.' (queue name)',6);
		if($qid!==false) indent('o qid: '.$qid.' (queue id)',6);
		if($co) indent('o co: '.$co.' (user correlator)',6);
		if($gr) indent('o gr: '.$gr.' (user level 2 correlator)',6);
		indent('o do: '.$do.' (execute discard only when do = 1)',6);
	
	h3('Optional fields');
	
	
// queue validation
//

	$qtable = C_dS_queue::$current_queues;
	
if($qn) { // retrieve qid
	if($qn=='0') { 
		$qid = 0; // queueless message
	} else {
		$q = new Q('select id from '.$qtable.' where name = "'.$qn.'";');
		$c = $q->cnt();
		if($c==0) die('error 1851'); // queue name is not recognized
		if($c>1) die('error 1852'); // many queues have the same name
		$qid = $q->ids();
	}
	
} else if($qid!==false) { // call was based on a queue id, validate the queue id
		
	if($qid=='0') {
		$qid = 0;
	}
	else {
		$q = new Q('select id from '.$qtable.' where id = "'.$qid.'";');
		$c = $q->cnt();
		if($c==0) die('error 1803'); // queue id is not recognized
		$qid = $q->ids();
	}
}

if($qid) {
		$queue = new C_dS_queue($qid);
		h2('You are discarding from queue: '.$queue->name.' ');
} else if($qid===0) {
		h2('You are discarding queueless messages');
} else if($qid===false) {
		h2('You are discarding messages whatever the queue');
		
}



// collect sms objects and change their status
//


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS lists
//


$snames = getstatusarray('named');


pad(); h2('SMSs');
if($qid===false) {
	
	// change qid such that queues are only the ones belonging to connected login (do not discard in other accounts queues)
	$q = new Q('select id from queues where parentid = '.$dS_login->id.';');
	$qids = $q->ids(list_as_string);
	
	// select through correlator or group

	$smss = C_dS_sms::inventory(false, $qids, $gr, $co);
	$smscount = 0; foreach($snames as $scode => $sname) $smscount += count($smss[$scode]);
		
	pad(); h3('OVERALL: '.$smscount);
	foreach($snames as $scode => $sname) {
		$c = count($smss[$scode]);
		if(!$c) continue;
		h4('status: '.$sname.' '.$c);
		foreach($smss[$scode] as $x => $dS_sms )
			echo $dS_sms->stream().$nl;
		$c = 0;
	}
	
	
} else {
	
	// select through queue
	
	if($qid==0) {
		$queue = new C_dS_queue(0);
		$queue->name = 'queueless messages';
	}
	$queue->magnify(false, $gr);
	$smscount = 0; foreach($snames as $scode => $sname) $smscount += count($queue->smss[$scode]);
	
	pad(); h3('Queue '.$qid.' - '.$queue->name.': '.$smscount.' found');
	foreach($snames as $scode => $sname) {
		$c = count($queue->smss[$scode]);
		if(!$c) continue;
		h4('status: '.$sname.', '.$c.' items');
		foreach($queue->smss[$scode] as $x => $dS_sms )
			echo $dS_sms->stream().$nl;
		$c = 0;
	}
	$smss = $queue->smss; // as an array like smss[status_code_][dS_sms]
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Execute discard, report
//
pad(2); 

echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');
echo '#C_dS_sms'.$nl;
	foreach($snames as $scode => $sname) {
		$c = count($smss[$scode]);
		if(!$c) continue;
		foreach($smss[$scode] as $x => $dS_sms ) {
			$dS_sms->setStatus(sms_status_discarded);
			if($do) $dS_sms->save();
			echo $dS_sms->stream().$nl;
		}
	}
span('&lt/data&gt');
echo '</data>';

pad();
if(!$do) warning('<b>NOT IN DO MODE, DB WILL NOT BE UPDATED. PASS &do=1 TO ACHIEVE EFFECTIVE CHANGE.</b>');
pad();

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Specifications
//



endrendermode();
?>