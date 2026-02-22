<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    P L A N N I N G    I T E M S 
//
ob_start(); // relates to (*ob1)
$loadcontext = 3; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

$days = $_POST['days'];
$rescId = $_POST['rescId'];
$fulldays = $_POST['fulldays'];
$sms = $_POST['sms']; if(!is_numeric($_REQUEST['sms'])) logoff('/ajax_session #moberr 50001a'); // when calling from list view or changes view, SMS status is displayed, so we download the SMSs at once
$peers = $_POST['peers']; if(!is_numeric($_REQUEST['sms'])) logoff('/ajax_session #moberr 50001b');

$archive_pivot_stamp = C_dS_system::backupPivotStamp();

$perfReport->peak('::time needed to retrieve session and posted parameters');

// sleep(2); // this is to test the fade and spinner effects during day skip


// step 01: R E S E R V A T I O N S
//
//

$o_dbAccess_reservations[0] = new C_dbAccess_reservations();
$o_dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');

$resaIds = Array(); 
$visiIds = Array(); 
	$o_dbAccess_sms = Array(); 
	$toggles = Array(); 

$o_dbAccess_attendees[0] = new C_dbAccess_attendees();
$o_dbAccess_attendees[1] = new C_dbAccess_attendees('archive_');

$o_dbAccess_att_visitors[0] = new C_dbAccess_att_visitors();
$o_dbAccess_att_visitors[1] = new C_dbAccess_att_visitors('archive_');

$o_dbAccess_resaparts[0] = new C_dbAccess_resaparts();
$o_dbAccess_resaparts[1] = new C_dbAccess_resaparts('archive_');

$o_dbAccess_resa_series[0] = new C_dbAccess_resa_series();
$o_dbAccess_resa_series[1] = new C_dbAccess_resa_series();  // 'archive_' not yet implemented, all records are in the same table

$o_dbAccess_visitors[0] = new C_dbAccess_visitors();
$o_dbAccess_visitors[1] = new C_dbAccess_visitors();

$o_dbAccess_performances[0] = new C_dbAccess_performances(); 
$o_dbAccess_performances[1] = new C_dbAccess_performances('archive_'); 

$o_dbAccess_goods[0] = new C_dbAccess_goods(); 
$o_dbAccess_goods[1] = new C_dbAccess_goods('archive_'); 

$o_dbAccess_payments[0] = new C_dbAccess_payments(); 
$o_dbAccess_payments[1] = new C_dbAccess_payments('archive_'); 

$o_dbAccess_prebookings[0] = new C_dbAccess_prebookings(); 
// $C_dbAccess_prebookings[1] = new C_dbAccess_prebookings('archive_'); // prebookings do not archive

$o_dbAccess_resafiles[0] = new C_dbAccess_resafiles(); 
// $o_dbAccess_resafiles[1] = new C_dbAccess_resafiles('archive_'); // prebookings do not archive

if($hasSync) { // defined in ajax_session.php
	
	echo 'Sync accesses are defined on this account: '.$hasSync.$nl;
	
	$o_dbAccess_resasyncss[0] = new C_dbAccess_synchro_reservations(); 
	$o_dbAccess_resasyncss[1] = new C_dbAccess_synchro_reservations( /* groupId */ false, 'archive_'); 

	$o_dbAccess_visisyncss[0] = new C_dbAccess_synchro_visitors(); 
	$o_dbAccess_visisyncss[1] = new C_dbAccess_synchro_visitors( /* skeyId */ false, 'archive_'); 
}

// time window definition
//
echo 'midnight reference:'.$nl;
		
$stamp = $_POST['stamp']; // a midnight stamp
C_date::setTimeParameters($dS_account);

if(!is_numeric($stamp)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
	
	$stamp = substr($stamp,0,10); // makes it much more difficult injecting an SQL :D
	$date = new C_date($stamp);
	$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $stamp); // in this case, gmtshift applies
	$stamp = $date->getTstmp(); // turns back stamp into a unix timestamp
	
	echo chr(9).'ISO8601 time stamp:'.$date->getDateTimeString().$nl;
	
} else {
	
	// $stamp is a universal integer unix timecode, referenced to GMT 0
	$date = new C_date($stamp);
	$gmtshift = 0;
	echo chr(9).'unix time stamp:'.$stamp.' = '.$date->getDateTimeString().$nl;
}

echo chr(9).'gmtshift:'.($gmtshift/3600).' hours'.$nl;
	
$stampSearchIn = $stamp;
$stampSearchOut  = $stamp+86400*$days;


$perfReport->peak('::time needed to setup time parameters and containers');

// view definitions
//

	$view = $view_resources->viewIds;
	$scope = $rescId ? $rescId : $view;
	
// if($stampSearchOut >= $archive_pivot_stamp) // archive items saved recently are in the current table up to next sunday
	$o_dbAccess_reservations[0]->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_visible_on_frame, $scope, $fulldays);
		$current = $o_dbAccess_reservations[0]->count();
	$perfReport->peak('::loaded from current table reservations ($current = '.$current.' items)');
	
if($stampSearchIn < $archive_pivot_stamp)
	$o_dbAccess_reservations[1]->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_visible_on_frame, $scope, $fulldays);
	
	$archived = $o_dbAccess_reservations[1]->count();
	$perfReport->peak('::loaded from archived table reservations ($archived = '.$archived.' items)');




if($current) {
	if($peers) $o_dbAccess_reservations[0]->loadPeers(); // if you click the technical resa when in the multiple days car reservation, even if not on planning this day, the technical resa should go open => must be downloaded
		$resaIds[0] = $o_dbAccess_reservations[0]->getIdsList();
		$serieIds[0] = $o_dbAccess_reservations[0]->getList('serieId', true /*excludes zeroes*/);
	
	if($view) $o_dbAccess_attendees[0]->loadOnView($view, $resaIds[0]);
		else $o_dbAccess_attendees[0]->loadOnGroup($resaIds[0]); // even if one single resource is displayed, the asses must be accurate and therefore we need to know all attendees in the view
	
	$o_dbAccess_att_visitors[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_resaparts[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_resa_series[0]->loadOnId($serieIds[0]);
		$visiIds[0] = $o_dbAccess_att_visitors[0]->getVisitorsIds();
	$o_dbAccess_visitors[0]->loadOnId($visiIds[0], false);
	$o_dbAccess_performances[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_goods[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_payments[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_prebookings[0]->loadByResaIds($resaIds[0]);
	
	if($hasSync) {
		$o_dbAccess_resasyncss[0]->loadOnLocalId($resaIds[0]);
		$o_dbAccess_visisyncss[0]->loadOnLocalId($visiIds[0]);
	}
	
	if($dS_account->usefiles)
		$o_dbAccess_resafiles[0]->loadByResaIds($resaIds[0]);
	
	$perfReport->peak('::loaded all attributes from current tables ('.$current.' items)');
}
if($archived) {
	if($peers) $o_dbAccess_reservations[1]->loadPeers();
		$resaIds[1] = $o_dbAccess_reservations[1]->getIdsList();
		
		$perfReport->peak('     ::getIdsList from archive_reservations');
		$serieIds[1] = $o_dbAccess_reservations[1]->getList('serieId', true /*excludes zeroes*/);
		
	
	if($view) $o_dbAccess_attendees[1]->loadOnView($view, $resaIds[1]);
		else $o_dbAccess_attendees[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_attendees ($view = '.$view.')');

		
	$o_dbAccess_att_visitors[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_att_visitors');
		
		
	$o_dbAccess_resaparts[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_resaparts');
		
		
	$o_dbAccess_resa_series[1]->loadOnId($serieIds[1]);
		$perfReport->peak('     ::loaded from series (no archive table here)');
		
		
		$visiIds[1] = $o_dbAccess_att_visitors[1]->getVisitorsIds();
	$o_dbAccess_visitors[1]->loadOnId($o_dbAccess_att_visitors[1]->getVisitorsIds(), false);
		$perfReport->peak('     ::loaded from visitors');
	
	$o_dbAccess_performances[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_performances');
		
	$o_dbAccess_goods[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_goods');
		
	$o_dbAccess_payments[1]->loadOnGroup($resaIds[1]);
		$perfReport->peak('     ::loaded from archive_payments');
	
	
	if($hasSync) {
		$o_dbAccess_resasyncss[1]->loadOnLocalId($resaIds[1]);
		$o_dbAccess_visisyncss[1]->loadOnLocalId($visiIds[1]);
	}
	
	if($dS_account->usefiles)
		$o_dbAccess_resafiles[0]->loadByResaIds($resaIds[1]); // both archive or current are together in a unique resafiles table
	
	$perfReport->peak('::loaded all attributes from archive tables ('.$archived.' items)');
}

if($gmtshift) { // this login is located on a different timezone but wants to see the agenda "as if" he was on the account timezone
	
	$o_dbAccess_reservations[0]->gmtshift($gmtshift);
	$o_dbAccess_reservations[1]->gmtshift($gmtshift);
}
	


if($sms){
	if(isset($resaIds[0])) {
		$o_dbAccess_sms[0] = new C_dbAccess_sms($resaIds[0]);
		$toggles[0] = new C_dbAccess_cToggles($resaIds[0]);
	}
	if(isset($resaIds[1])) {
		$o_dbAccess_sms[1] = new C_dbAccess_sms($resaIds[1]);
		$toggles[1] = new C_dbAccess_cToggles($resaIds[1]);
	}
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

	// notes

	$notesIds = $o_dbAccess_note_details[0]->loadOnLogin($stampSearchIn, $stampSearchOut, $loginId, $accountId);
	
	$perfReport->peak('::loading from notes table done');
	
	$o_dbAccess_note_addressees[0]->loadOnGroup($notesIds);
	$perfReport->peak('::loading from note_addressees table done');
	
	$o_dbAccess_note_visirefs[0]->loadOnGroup($notesIds);
	$perfReport->peak('::loading from note_visirefs table done');
	
	$o_dbAccess_note_visitors[0]->loadOnId($o_dbAccess_note_visirefs[0]->getList('visiId'), false);
	$perfReport->peak('::loading from note_visitors table done');
	
	
	// tasks
	
	
	$tasksIds = $o_dbAccess_task_assignees[0]->loadOnLogin($stampSearchIn, $stampSearchOut, $loginId, $accountId); 
	$perfReport->peak('::loading from task_assignees table done');
	
	$o_dbAccess_task_descriptions[0]->loadOnId($tasksIds);
	$perfReport->peak('::loading from task_descriptions table done');
	
	$o_dbAccess_task_assignees[0]->loadOnGroup($tasksIds);
	$perfReport->peak('::loading again from task_assignees table done');
	
	$o_dbAccess_task_visirefs[0]->loadOnGroup($tasksIds);
	$perfReport->peak('::loading from task_visirefs table done');
	
	$o_dbAccess_task_visitors[0]->loadOnId($o_dbAccess_task_visirefs[0]->getList('visiId'), false);
	$perfReport->peak('::loading from task_visitors table done');
	

$notescurrent = $o_dbAccess_note_details[0]->count();
$notesarchived = false; //$o_dbAccess_note_details[1]->count();

$taskscurrent = $o_dbAccess_task_descriptions[0]->count();
$tasksarchived = false; //$o_dbAccess_task_descriptions[1]->count();


$perfReport->peak('STEP 2 done:: N O T E S    &   T A S K S');

// E C H O
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//
$bank = 'plitems';
echo '<code>';
	if($current||$archived) {
		if($dS_account->usefiles) { // keep this section ahead, because C_dS_reservation drills into C_dS_resafile.ends(resa.id) from C_dS_reservation::cssclass();
			echo $o_dbAccess_resafiles[0]->stream(false, no_bank, with_tracking);
		}
	}
	///
	if($notescurrent) {
		echo $o_dbAccess_note_details[0]->stream(false, $bank);
		echo $o_dbAccess_note_addressees[0]->stream(false, $bank);
		echo $o_dbAccess_note_visirefs[0]->stream(false, $bank);
		echo $o_dbAccess_note_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($notesarchived) {
		echo $o_dbAccess_note_details[1]->stream(false, $bank);
		echo $o_dbAccess_note_addressees[1]->stream(false, $bank);
		echo $o_dbAccess_note_visirefs[1]->stream(false, $bank);
		echo $o_dbAccess_note_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if($taskscurrent) {
		echo $o_dbAccess_task_descriptions[0]->stream(false, $bank);
		echo $o_dbAccess_task_assignees[0]->stream(false, $bank);
		echo $o_dbAccess_task_visirefs[0]->stream(false, $bank);
		echo $o_dbAccess_task_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($tasksarchived) {
		echo $o_dbAccess_task_descriptions[1]->stream(false, $bank);
		echo $o_dbAccess_task_assignees[1]->stream(false, $bank);
		echo $o_dbAccess_task_visirefs[1]->stream(false, $bank);
		echo $o_dbAccess_task_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if($sms) {
		if(isset($resaIds[0])) {
			echo $o_dbAccess_sms[0]->stream();
			echo $toggles[0]->stream();
		}
		if(isset($resaIds[1])) {
			echo $o_dbAccess_sms[1]->stream();
			echo $toggles[1]->stream();
		}
	}
	if($current) { 
		echo $o_dbAccess_visitors[0]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[0]->stream(false, $bank);
		echo $o_dbAccess_att_visitors[0]->stream(false, $bank);
		echo $o_dbAccess_resaparts[0]->stream(false, $bank);
		echo $o_dbAccess_resa_series[0]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_performances[0]->stream(false, $bank);
		echo $o_dbAccess_goods[0]->stream(false, $bank);
		echo $o_dbAccess_payments[0]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_prebookings[0]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_reservations[0]->stream(false, $bank);
		
		if($hasSync) {
			echo $o_dbAccess_resasyncss[0]->stream(false);
			echo $o_dbAccess_visisyncss[0]->stream(false);
		}
	}
	if($archived) {
		echo $o_dbAccess_visitors[1]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[1]->stream(false, $bank);
		echo $o_dbAccess_att_visitors[1]->stream(false, $bank);
		echo $o_dbAccess_resaparts[1]->stream(false, $bank);
		echo $o_dbAccess_resa_series[1]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_performances[1]->stream(false, $bank);
		echo $o_dbAccess_goods[1]->stream(false, $bank);
		echo $o_dbAccess_payments[1]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_reservations[1]->stream(false, $bank);
		if($hasSync) {
			echo $o_dbAccess_resasyncss[1]->stream(false);
			echo $o_dbAccess_visisyncss[1]->stream(false);
		}
	}
echo '</code>';

$perfReport->peak('::streamed');

echo '##perfreport'.$nl;
$perfReport->peak('::echo');
$perfReport->dropReport();
$pivot = new C_date($archive_pivot_stamp);
echo $nl.$nl.'Archive pivot date = '.$pivot->getDateString().' - from archives:'.$archived.' - from current:'.$current;


closeconnection(); // escapes from Apache2 KEEP_ALIVE

C_dS_connection::poke($perfReport, 'q_plitems');
?>