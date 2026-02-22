<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     U S E R    A C C O U N T    M O N I T O R I N G
//
//
// 	

require '../sga_lib.php';
setrendermode('..');
$dS_login = checkcredentials();
	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Queues
//
	$qtable = C_dS_queue::$current_queues;
	
$q = new Q('select id from '.$qtable.' where parentid = '.$dS_login->id.';');
$c = $q->cnt();
if($c==0) die('error 1911'); // login has no queue
$qid = $q->ids(list_as_array);
$qids = $q->ids(list_as_string);

$queues = Array();
foreach($qid as $id) $queues[$id] = new C_dS_queue($id);

pad(); h2('Queues');
	pad();
foreach($queues as $qid => $dS_queue) {
	h3($dS_queue->name.' (id '.$qid.')',6);
	indent($dS_queue->stream(),5);
}




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites
//
pad(); h2('Satellites');

	$sats = C_dS_satellite::$current_satellites;
	
	$q = new Q('select id from '.$sats.' where parentid = '.$dS_login->id.';');
	$c = $q->cnt();
	if($c==0) warning('No satellite is assigned to your traffic'); // this queue has no satellite
	$sids = $q->ids(list_as_array);


foreach($sids as $sid) {
	
	$dS_sat = new C_dS_satellite($sid);
	pad(); h3('satellite id '.$sid.' ('.$dS_sat->operator.' '.$dS_sat->sim.')', 'color:'.$dS_sat->color.'');
	indent($dS_sat->stream(),5);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS lists
//

pad(); h2('SMSs');
$snames = getstatusarray('named');



// view by queue

$queueless = $queues[0] = new C_dS_queue(0);
$queueless->name = 'queueless messages';

foreach($queues as $qid => $dS_queue) {
	$dS_queue->magnify();
	$smscount = 0; foreach($snames as $scode => $sname) $smscount += count($dS_queue->smss[$scode]);
	
	pad(); h3('Queue '.$qid.' - '.$dS_queue->name.': '.$smscount.' items found');
	foreach($snames as $scode => $sname) {
		$c = count($dS_queue->smss[$scode]);
		if(!$c) continue;
		h4('status: '.$sname.', '.$c.' items');
		foreach($dS_queue->smss[$scode] as $x => $dS_sms )
			echo $dS_sms->stream().$nl;
		$c = 0;
	}
}
pad();


	$smss = C_dS_sms::inventory();
	$smscount = 0; foreach($snames as $scode => $sname) $smscount += count($smss[$scode]);
		
	pad(); h3('Cross queue, by status: '.$smscount);
	foreach($snames as $scode => $sname) {
		$c = count($smss[$scode]);
		if(!$c) continue;
		h4('status: '.$sname.', '.$c.' items');
		foreach($smss[$scode] as $x => $dS_sms )
			echo $dS_sms->stream().$nl;
		$c = 0;
	}

pad();
pad();
endrendermode();
?>