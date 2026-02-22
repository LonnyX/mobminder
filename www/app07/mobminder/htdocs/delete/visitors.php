<?php
///////////////////////////////////////////////////////////////////////////////////
//
//  D E L E T E     A L L     V I S I T O R S    I N    A N    A C C O U N T 
//

$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

if($accountId <> $_POST['id']) die('Sorry, you have no access here... <command>logoff</command>');
if(!supervised()) die('Sorry, no permission... <command>logoff</command>');

$q = new Q('SELECT id FROM visitors WHERE groupId IN('.$accountId.');'); // attendees group to reservations
$vids = $q->ids(false);
$vidscount = count($vids);
if($vidscount==0) die('There is none visitor in this account...');
echo $nl.'Visitors count before cleaning up:'.$vidscount;

$packed = Array();
foreach($vids as $x => $vid) { // we cannot send an SQL request with a IN() list of 5000 items, so we group ids by pack of 128 items
	$deca = $x>>7;
	if(!isset($packed[$deca])) $packed[$deca] = Array();
	$packed[$deca][] = $vid;
}
foreach($packed as $d => $pack) $packed[$d] = implode(',',$packed[$d]);
// foreach($packed as $d => $pack) echo $nl.$packed[$d];

foreach($packed as $d => $pack) {
	
	// tasks and notes and chats
	//
	new Q('DELETE FROM task_visirefs WHERE visiId IN ('.$pack.');');
	new Q('DELETE FROM note_visirefs WHERE visiId IN ('.$pack.');');
	new Q('DELETE FROM chat_visirefs WHERE visiId IN ('.$pack.');');
	new Q('DELETE FROM archive_task_visirefs WHERE visiId IN ('.$pack.');');
	new Q('DELETE FROM archive_note_visirefs WHERE visiId IN ('.$pack.');');
	new Q('DELETE FROM archive_chat_visirefs WHERE visiId IN ('.$pack.');');
	
	// reservations
	//
	new Q('DELETE FROM att_visitors WHERE resourceId IN ('.$pack.');'); // att_visitors group to reservations
	new Q('DELETE FROM archive_att_visitors WHERE resourceId IN ('.$pack.');'); // att_visitors group to reservations
	
}
	$perfReport->peak('references have been removed for each visitor');

	// visitors
	//
new Q('DELETE FROM synchro_visitors WHERE groupId = '.$accountId.';');
$d = new Q('DELETE FROM visitors WHERE groupId = '.$accountId.';');

$d = $d->hits();
$perfReport->peak($d.' visitors have been removed');
	
	
$perfReport->dropReport();
?>