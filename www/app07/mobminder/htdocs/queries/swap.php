<?php
//////////////////////////////////////////////////////////////////////
//
//  S W A P    A G E N D A S    o f    T W O    R E S O U R C E S 
//
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

$fromstamp 	= $_POST['fromstamp'];
$fromId 	= $_POST['fromId'];
$toId 		= $_POST['toId'];
$futureinc 	= $_POST['futureinc']+0;

$perfReport->peak('::session & post variables retrieved');

	$midnightStmpNext = $fromstamp + 86400;
	$singleDay = ' AND cueIn >= '.$fromstamp;
	if(!$futureinc) $singleDay .= ' AND cueOut < '.$midnightStmpNext;
	
	$SQL = 'UPDATE attendees JOIN reservations ON attendees.groupId = reservations.id
			SET attendees.resourceId = 0 WHERE attendees.resourceId = '.$fromId.$singleDay.';';
				
	new Q($SQL);
	
$perfReport->peak('::switch STEP 1 complete');

	$SQL = 'UPDATE attendees JOIN reservations ON attendees.groupId = reservations.id
			SET attendees.resourceId = '.$fromId.' WHERE attendees.resourceId = '.$toId.$singleDay.';';
				
	new Q($SQL);

$perfReport->peak('::switch STEP 2 complete');	

	$SQL = 'UPDATE attendees JOIN reservations ON attendees.groupId = reservations.id
			SET attendees.resourceId = '.$toId.' WHERE attendees.resourceId = 0'.$singleDay.';';
				
	new Q($SQL);
		
$perfReport->peak('::switch STEP 3 complete');

$perfReport->dropReport();
?>