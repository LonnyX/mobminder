<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    P L A N N I N G    I T E M S 
//
$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

$days = $_POST['days'];
$rescId = $_POST['rescId'];
$fulldays = $_POST['fulldays'];
$sms = $_POST['sms'];
$peers = $_POST['peers'];

$archive_pivot_stamp = C_dS_system::backupPivotStamp();

$perfReport->peak('::time needed to retrieve session and posted parameters');

sleep(0); // this is to test the fade and spinner effects during data fetching

// step 01: R E S E R V A T I O N S
//
//

$o_dbAccess_reservations[0] = new C_dbAccess_reservations();
$o_dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');

$o_dbAccess_attendees[0] = new C_dbAccess_attendees();
$o_dbAccess_attendees[1] = new C_dbAccess_attendees('archive_');

$o_dbAccess_att_visitors[0] = new C_dbAccess_att_visitors();
$o_dbAccess_att_visitors[1] = new C_dbAccess_att_visitors('archive_');

$o_dbAccess_resaparts[0] = new C_dbAccess_resaparts();
$o_dbAccess_resaparts[1] = new C_dbAccess_resaparts('archive_');

$o_dbAccess_visitors[0] = new C_dbAccess_visitors();
$o_dbAccess_visitors[1] = new C_dbAccess_visitors();

$o_dbAccess_performances[0] = new C_dbAccess_performances(); 
$o_dbAccess_performances[1] = new C_dbAccess_performances('archive_'); 


// time window definition
//
echo 'midnight reference:'.$nl;
		
$stamp = $_POST['stamp']; // a midnight stamp
C_date::setTimeParameters($dS_account);

if(!is_numeric($stamp)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
	$date = new C_date($stamp);
	$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $stamp); // in this case, gmtshift applies
	$stamp = $date->getTstmp(); // turns back stamp into a unix timestamp
	
	echo chr(9).'ISO8601 time stamp:'.$date->get_ISO8601_stamp().$nl;
} else {
	// $stamp is a universal integer unix timecode, referenced to GMT 0
	
	$date = new C_date($stamp);
	$gmtshift = 0;
	
	echo chr(9).'unix time stamp:'.$stamp.' = '.$date->getDateTimeString().$nl;
}

echo chr(9).'gmtshift:'.($gmtshift/3600).' hours'.$nl;
	
$stampSearchIn = $stamp;
$stampSearchOut  = $stamp+86400*$days;



// view definitions
//

	$view = $view_resources->viewIds;
	$scope = $rescId ? $rescId : $view;
	
	$o_dbAccess_reservations[0]->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_changed_on_frame, $scope, $fulldays);
	$o_dbAccess_reservations[1]->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_changed_on_frame, $scope, $fulldays);

$current = $o_dbAccess_reservations[0]->count();
$archived = $o_dbAccess_reservations[1]->count();




if($current) {
	if($peers) $o_dbAccess_reservations[0]->loadPeers(); // if you click the technical resa when in the multiple days car reservation, even if not on planning this day, the technical resa should go open => must be downloaded
	$resaIds = $o_dbAccess_reservations[0]->getIdsList();
	if($view) $o_dbAccess_attendees[0]->loadOnView($view, $resaIds);
		else $o_dbAccess_attendees[0]->loadOnGroup($resaIds); // even if one single resource is displayed, the asses must be accurate and therefore we need to know all attendees in the view
	$o_dbAccess_att_visitors[0]->loadOnGroup($resaIds);
	$o_dbAccess_resaparts[0]->loadOnGroup($resaIds);
	$o_dbAccess_visitors[0]->loadOnId($o_dbAccess_att_visitors[0]->getVisitorsIds(), false);
	$o_dbAccess_performances[0]->loadOnGroup($resaIds);
	$perfReport->peak('::loaded from current tables');
}
if($archived) {
	if($peers) $o_dbAccess_reservations[1]->loadPeers();
	$resaIds = $o_dbAccess_reservations[1]->getIdsList();
	if($view) $o_dbAccess_attendees[1]->loadOnView($view, $resaIds);
		else $o_dbAccess_attendees[1]->loadOnGroup($resaIds);
	$o_dbAccess_attendees[1]->loadOnGroup($resaIds);
	$o_dbAccess_att_visitors[1]->loadOnGroup($resaIds);
	$o_dbAccess_resaparts[1]->loadOnGroup($resaIds);
	$o_dbAccess_visitors[1]->loadOnId($o_dbAccess_att_visitors[1]->getVisitorsIds(), false);
	$o_dbAccess_performances[1]->loadOnGroup($resaIds);
	$perfReport->peak('::loaded from archive tables');
}

if($gmtshift) { // this login is located on a different timezone but wants to see the agenda "as if" he was on the account timezone
	
	$o_dbAccess_reservations[0]->gmtshift($gmtshift);
	$o_dbAccess_reservations[1]->gmtshift($gmtshift);
}
	


if($sms & isset($resaIds)) { // NOT CORRECT, $resaIds is set twice when current and archived exist together
	$o_dbAccess_sms = new C_dbAccess_sms($resaIds);
	$toggles = new C_dbAccess_cToggles($resaIds);
}

$perfReport->peak('STEP 1 done::R E S E R V A T I O N S');


// step 02: N O T E S   A N D   T A S K S 
//
//


$o_dbAccess_note_addressees[0] = new C_dbAccess_note_addressees();
// $o_dbAccess_note_addressees[1] = new C_dbAccess_note_addressees('archive_');

$o_dbAccess_note_details[0] = new C_dbAccess_note_details();
// $o_dbAccess_note_details[1] = new C_dbAccess_note_details('archive_');

$o_dbAccess_note_visirefs[0] = new C_dbAccess_note_visirefs();
// $o_dbAccess_note_visirefs[1] = new C_dbAccess_note_visirefs('archive_');

$o_dbAccess_note_visitors[0] = new C_dbAccess_visitors();



$o_dbAccess_task_assignees[0] = new C_dbAccess_task_assignees();

$o_dbAccess_task_descriptions[0] = new C_dbAccess_task_descriptions();

$o_dbAccess_task_visirefs[0] = new C_dbAccess_task_visirefs();

$o_dbAccess_task_visitors[0] = new C_dbAccess_visitors();

	echo 'Scope for notes & tasks fetching: loginId='.$loginId.', accountId='.$accountId.$nl;

	$notesIds = $o_dbAccess_note_details[0]->loadOnLogin($stampSearchIn, $stampSearchOut, $loginId, $accountId);
	$o_dbAccess_note_addressees[0]->loadOnGroup($notesIds);
	$o_dbAccess_note_visirefs[0]->loadOnGroup($notesIds);
	$o_dbAccess_note_visitors[0]->loadOnId($o_dbAccess_note_visirefs[0]->getList('visiId'), false);
	
	$tasksIds = $o_dbAccess_task_assignees[0]->loadOnLogin($stampSearchIn, $stampSearchOut, $loginId, $accountId);
	$o_dbAccess_task_descriptions[0]->loadOnId($tasksIds);
	$o_dbAccess_task_assignees[0]->loadOnGroup($tasksIds);
	$o_dbAccess_task_visirefs[0]->loadOnGroup($tasksIds);
	$o_dbAccess_task_visitors[0]->loadOnId($o_dbAccess_task_visirefs[0]->getList('visiId'), false);
	

$notescurrent = $o_dbAccess_note_details[0]->count();
$notesarchived = false; //$o_dbAccess_note_details[1]->count();

$taskscurrent = $o_dbAccess_task_descriptions[0]->count();
$tasksarchived = false; //$o_dbAccess_task_descriptions[1]->count();


$perfReport->peak('STEP 2 done:: N O T E S    &   T A S K S');

// E C H O
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//
$bankc = 'catalyst';
$bankp = 'plitems';
echo '<code>';
	///
	if($notescurrent) {
		echo $o_dbAccess_note_details[0]->stream(false, $bankp);
		echo $o_dbAccess_note_addressees[0]->stream(false, $bankp);
		echo $o_dbAccess_note_visirefs[0]->stream(false, $bankp);
		echo $o_dbAccess_note_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($notesarchived) {
		echo $o_dbAccess_note_details[1]->stream(false, $bankp);
		echo $o_dbAccess_note_addressees[1]->stream(false, $bankp);
		echo $o_dbAccess_note_visirefs[1]->stream(false, $bankp);
		echo $o_dbAccess_note_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if($taskscurrent) {
		echo $o_dbAccess_task_descriptions[0]->stream(false, $bankp);
		echo $o_dbAccess_task_assignees[0]->stream(false, $bankp);
		echo $o_dbAccess_task_visirefs[0]->stream(false, $bankp);
		echo $o_dbAccess_task_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($tasksarchived) {
		echo $o_dbAccess_task_descriptions[1]->stream(false, $bankp);
		echo $o_dbAccess_task_assignees[1]->stream(false, $bankp);
		echo $o_dbAccess_task_visirefs[1]->stream(false, $bankp);
		echo $o_dbAccess_task_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if($sms & isset($resaIds)) {
		echo $o_dbAccess_sms->stream();
		echo $toggles->stream();
	}
	if($current) { 
		echo $o_dbAccess_visitors[0]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[0]->stream(false, $bankc);
		echo $o_dbAccess_att_visitors[0]->stream(false, $bankc);
		echo $o_dbAccess_resaparts[0]->stream(false, $bankc);
		echo $o_dbAccess_performances[0]->stream(false, $bankc);
		echo $o_dbAccess_reservations[0]->stream(false, $bankc);
	}
	if($archived) {
		echo $o_dbAccess_visitors[1]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[1]->stream(false, $bankc);
		echo $o_dbAccess_att_visitors[1]->stream(false, $bankc);
		echo $o_dbAccess_resaparts[1]->stream(false, $bankc);
		echo $o_dbAccess_performances[1]->stream(false, $bankc);
		echo $o_dbAccess_reservations[1]->stream(false, $bankc);
	}
echo '</code>';

$perfReport->peak('::streamed');

echo '##perfreport'.$nl;
$perfReport->peak('::echo');
$perfReport->dropReport();
$pivot = new C_date($archive_pivot_stamp);
echo $nl.'Archive pivot date = '.$pivot->getDateString().' - from archives:'.$archived.' - from current:'.$current;

C_dS_connection::poke($perfReport, 'q_plitems');
?>