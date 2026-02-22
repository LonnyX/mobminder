<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     S M S G A T E A W A Y   -    U S E R    A C C O U N T    M O N I T O R I N G
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
if($c==0) die('error 1901'); // login has no queue

$queues = C_dS_queue::loadall($dS_login->id);

pad(); h2('Queues');
	pad();
foreach($queues as $qid => $dS_queue) {
	h3($qid.' - '.$dS_queue->name,6);
	$patches = $dS_queue->patches();
	foreach($patches as $dS_patch) {
		$name = $dS_patch->satellite->name;
		$clusterop = ($dS_patch->operator==='%') ? ' * all operators * ': ' <=> '.$dS_patch->operator;
		$satop = $dS_patch->satellite->operator;
		$ninfto = $dS_patch->n_inf_to;
		$nsupto = $dS_patch->n_sup_to;
		$satim = $dS_patch->satellite->sim;
		indent('o '.$name.' '.$clusterop.'  range['.$nsupto.','.$ninfto.'] ('.$satop.' '.$satim.')',6, 'color:'.$dS_patch->satellite->color.'');
	}
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
	$satellites = Array();
	

foreach($sids as $sid) {
	
	$dS_sat = new C_dS_satellite($sid);
	$satellites[$sid] = $dS_sat; 
	
	$patches = $dS_sat->patches();
	
	pad(); h3($sid.' satellite ('.$dS_sat->operator.' '.$dS_sat->sim.')', 'color:'.$dS_sat->color.'');

	foreach($patches as $pid => $dS_patch) { // parent is a queue
		
		$name = $dS_patch->queue->name;
		$clusterop = ($dS_patch->operator==='%') ? ' * all operators * ': ' <=> '.$dS_patch->operator;
		$queueid = $dS_patch->queue->id;
		indent($queueid.' - '.$name.' '.$clusterop,6);
	}
	
}


pad();
echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
		echo '#C_dS_queue'.$nl;
		foreach($queues as $qid => $dS_queue) echo $dS_queue->stream().$nl;
		echo '#C_dS_satellite'.$nl;
		foreach($satellites as $sid => $dS_satellite) echo $dS_satellite->stream().$nl;
	span('&lt/data&gt');
echo '</data>';
pad();
pad();
endrendermode();
?>