<?php
///////////////////////////////////////////////////////////////////////////////////
//
//        Q U E R Y    A    S E R I E     O F     A P P O I N T M E N T S 
//
ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();



// retrieve posts
$sid = @$_POST['sid']; // id of at least one appointment in the serie

if(!isset($sid)) die('error: insufficient parameters.');
if(!is_numeric($sid)) die('error: sid.');



if($sid==0) { 
	// 2020-03-06 - apache log shows memory exhausted Fatal error. 
	// drill down reveals this script is called with 'sid' = 0 when a serie appointment is opened from the visitor file tab "appointments" and if this appointment is part of a serie
	// Problem is appointments that are NOT part of a serie all have serieId = 0, which lets this script load all of them :S 
	// Before fixing the problem in client js, we avoid here any call with sid = 0 
	echo '<code></code>';
	closeconnection(); // escapes from Apache2 KEEP_ALIVE
	die('warning: zero sid');
}


$perfReport->peak('::time needed to retrieve session and posted parameters');

// check if this relates to a specific view (we show appointments taken with resources only in the view of the surfer)
//

	$rescIds = $view_resources->viewIds;
	$dS_serie = new C_dS_resa_serie($sid);


	$q = new Q($SQL='select id from reservations where groupId = '.$accountId.' and serieId = '.$sid.';'); // $accountId comes from  ajax_session.php
	$ids_current = $q->ids();
	
	// echo chr(10).$SQL.chr(10);
	$perfReport->peak('::loaded ids of serie related current reservations');
		
		
	$q = new Q($SQL='select id from archive_reservations where groupId = '.$accountId.' and serieId = '.$sid.';');
	$ids_archive = $q->ids();
	
	// echo chr(10).$SQL.chr(10);
	$perfReport->peak('::loaded ids of serie related archive reservations');
	

// step 01: fetch reservations
//

	$reservations_current = new C_dbAccess_reservations();
	if($ids_current) $reservations_current->loadOnIdsAndView($ids_current, $rescIds);
	
	$perfReport->peak('::load on view from current reservations');

	$reservations_archive = new C_dbAccess_reservations('archive_');
	if($ids_archive) {
		$reservations_archive->loadOnIdsAndView($ids_archive, $rescIds);		
	}

	$perfReport->peak('::load on view from archive reservations');
	
	
	
// step 00: fetch visitor attendees
//

	$att_visitors_current = new C_dbAccess_att_visitors();
	$att_visitors_current->loadOnGroup($ids_current);

	$att_visitors_archive = new C_dbAccess_att_visitors('archive_');
	$att_visitors_archive->loadOnGroup($ids_archive);

	$perfReport->peak('::att_visitors');

	
// step02: fetch group resource attendees & visitors attendees (this overwrites step00)
//

	$attendees_current = new C_dbAccess_attendees();
	if($ids_current!='') $attendees_current->loadOnGroup($ids_current);
	
	$attendees_archive = new C_dbAccess_attendees('archive_');
	if($ids_archive!='') $attendees_archive->loadOnGroup($ids_archive);
	$perfReport->peak('::attendees');


// step04: fetch visitors (does not reload this visitor for which we already have the data)
//

	$visitors_current = new C_dbAccess_visitors();
	$visitors_current->loadOnId($att_visitors_current->getVisitorsIds(), false);
	
	$visitors_archive = new C_dbAccess_visitors();
	$visitors_archive->loadOnId($att_visitors_archive->getVisitorsIds(), false);
	$perfReport->peak('::visitors');
	
	$visitors_current->absorb($visitors_archive);
	
	
// step05: fetch performances
//

	$performances_current = new C_dbAccess_performances(); 
	$performances_current->loadOnGroup($ids_current);
	
	$performances_archive = new C_dbAccess_performances('archive_'); 
	$performances_archive->loadOnGroup($ids_archive);
	$perfReport->peak('::performances');


	

// step LAST: feedback to client side
//

$bank = 'visiapps';
echo '<code>';

	echo '#C_dS_resa_serie'.'#'.$bank.$nl.$dS_serie->stream(with_tracking).$nl;

	echo $visitors_current->stream(no_alias, no_bank, with_tracking); 
	// echo $visitors_archive->stream(no_alias, no_bank, with_tracking);

	echo $att_visitors_current->stream(false, $bank);
	echo $att_visitors_archive->stream(false, $bank);

	echo $attendees_current->stream(false, $bank);
	echo $attendees_archive->stream(false, $bank);

	echo $performances_current->stream(false, $bank);
	echo $performances_archive->stream(false, $bank);

	echo $reservations_current->stream(false, $bank);
	echo $reservations_archive->stream(false, $bank);
	
echo '</code>';

$perfReport->peak('::step 3 - echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
// C_dS_connection::poke($perfReport, 'q_serie_apps');
?>