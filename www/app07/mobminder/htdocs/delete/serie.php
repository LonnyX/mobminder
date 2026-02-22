<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    A    S E R I E    O F     R E S E R V A T I O N S
//


// SQL delete CASE: deleting all appointments that relate to a given visitor.
//
// delete from reservations using reservations left join att_visitors on (att_visitors.groupId = reservations.id) where att_visitors.resourceId = 664100;
// delete from attendees using att_visitors left join attendees on (att_visitors.groupId = attendees.groupId) where att_visitors.resourceId = 664100;
// delete from att_visitors where resourceId = 664100;

define('local_test', false);

require '../classes/language.php';
$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 



$perfReport = new C_perfReport(); $perfReport->peak('::session and parameters retrieved');

$sid = $_POST['id'];
$side = $_POST['side']; if($side!=='future'&&$side!=='past') die('Invlaid parameter value...');
$archived = $_POST['archived']+0;

if($sid<=0) die('Trying to delete a virtual...');

if($archived) $targetTable = 'archive_'; else $targetTable = '';



// check if this relates to a specific view (we show appointments taken with resources only in the view of the surfer)
//

	$rescIds = $view_resources->viewIds; // loadcontext level should be 2
	$dS_serie = new C_dS_resa_serie($sid);
	if($accountId != $dS_serie->groupId) die ('You should stay in your own playground. <command>logoff</command>');

	$q = new Q('select id from reservations where groupId = '.$accountId.' and serieId = '.$sid.';');
	$ids_current = $q->ids();
	$q = new Q('select id from archive_reservations where groupId = '.$accountId.' and serieId = '.$sid.';');
	$ids_archive = $q->ids();
	

// step 01: fetch reservations
//

	$reservations_current = new C_dbAccess_reservations();
	if($ids_current) $reservations_current->loadOnIdsAndView($ids_current, $rescIds);

	$reservations_archive = new C_dbAccess_reservations('archive_');
	if($ids_archive) $reservations_archive->loadOnIdsAndView($ids_archive, $rescIds);

	$perfReport->peak('::reservations');
	
	

// Make reservations obsolete
//
$now = new C_date(); $nowUnix = $now->t;
echo 'Time pivot is '.$now->getDateTimeString().$nl;
function candidate($dS_resa) { 
	global $nowUnix, $side;
	switch($side) {
		case 'future': return ($dS_resa->cueIn > $nowUnix);
		case 'past':  return ($dS_resa->cueOut <= $nowUnix);
		default: return false;
	}
}

if($side=='past') 
	if($reservations_archive->count()) foreach($reservations_archive->keyed as $rid => $dS_resa) if(candidate($dS_resa)) { echo Date('Y-m-d H:i:s',$dS_resa->cueIn).$nl; $dS_resa->dSobsolete(); };
	if($reservations_current->count()) foreach($reservations_current->keyed as $rid => $dS_resa) if(candidate($dS_resa)) { echo Date('Y-m-d H:i:s',$dS_resa->cueIn).$nl; $dS_resa->dSobsolete(); };


// step LAST: feedback to client side
//

$bank = 'visiapps'; 
echo '<code>';
	echo $reservations_current->stream(false, $bank);
	echo $reservations_archive->stream(false, $bank);
echo '</code>';

$perfReport->peak('::step 3 - echo completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'q_visiapps');

?>