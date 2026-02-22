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
	
	
	$sats = C_dS_satellite::$current_satellites;
$q = new Q('select id from '.$sats.' where parentid = '.$dS_login->id.';');
$c = $q->cnt();
if($c==0) warning('No satellite is assigned to your traffic'); // this queue has no satellite
$sids = $q->ids(list_as_array);
$satellites = Array(); foreach($sids as $sid) $satellites[$sid] = new C_dS_satellite($sid);


$levelnames = C_dS_log::getlevelarray('named');

		

$sname = @$_REQUEST['snm']; if(!isset($sname)) $sname = false; // queue name filter
$level = @$_REQUEST['lvl']; if(!isset($level)) $level = false; // log criticity level filter
$flush = @$_REQUEST['flush']; if(!isset($flush)) $flush = false; // log criticity level filter
	


h2('Mandatory parameters for this call: ');

	indent('o <b>l</b>: your login',3);
	indent('o <b>p</b>: your password',3);
	pad(0);
	
h2('Optional parameters for this call: ');
	indent('o <b>snm</b>: Satellite name filter. Must match an existing satellite of yours.',3);
	indent('o <b>lvl</b>: log criticity level. Must be one of [info, warning, critical, error, failure]',3);
	indent('o <b>flush</b>: flush past logs (according to filter if defined)',3);
	pad(0);
	

h2('You have posted: ');

	indent('o <b>snm</b>: '.($sname?$sname:'none, no filter on queue name'),3);
	indent('o <b>lvl</b>: '.($level?$level:'none, no filter on log criticity level'),3);
	
	$satlid = false;
	if($sname)
		foreach($satellites as $sid => $dS_sat)
			if($dS_sat->name==$sname) { $satlid = $sid; break; }
	if(!$satlid) warning('The provided name for the satllite filter does not match any of your assigned satellites');
	
	$levelcode = false;
	if($level)
		foreach($levelnames as $lcode => $lname)
			if($lname==$level) { $levelcode = $lcode; break; }
	if(!$levelcode) warning('The provided level for criticity level filter does not match any of existing levels');
	
	
	pad(0);
	
	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Queues
//
	$qtable = C_dS_queue::$current_queues;
	
	$q = new Q('select id from '.$qtable.' where parentid = '.$dS_login->id.';');
	$c = $q->cnt();
	if($c==0) die('error 1721'); // login has no queue
	$qid = $q->ids(list_as_array);
	$qids = $q->ids(list_as_string);

	$queues = Array();
	foreach($qid as $id) $queues[$id] = new C_dS_queue($id);

// h2('Your queues');
// foreach($queues as $qid => $dS_queue) {
	// h3($dS_queue->name.' (id '.$qid.')',6);
	// indent($dS_queue->stream(),5);
// }




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites
//
pad(); h2('Satellites');


foreach($satellites as $dS_sat) {
	h3($sid.' ['.$dS_sat->name.'] ('.$dS_sat->operator.' '.$dS_sat->sim.')', 'color:'.$dS_sat->color.'');
	indent($dS_sat->stream(),6);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Log format definition
//

	pad(0);
	h2('Logs format');
	explainclass(new C_dS_log(0), false, '|');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Log lists
//

h2('Logs list');

	$logs = C_dS_log::inventory($satlid,$level);
	$logscount = 0; 
	foreach($levelnames as $lcode => $lname) 
		$logscount += count($logs[$lname]);
		
	pad(); h3('OVERALL: '.$logscount);
	foreach($levelnames as $lcode => $lname) {
		$c = count($logs[$lname]);
		if(!$c) continue;
		h4('Level: '.$lname.', '.$c.' items');
		foreach($logs[$lname] as $x => $dS_log )
			echo $dS_log->stream().$nl;
		$c = 0;
	}


pad();
pad();
pad();
endrendermode();
?>