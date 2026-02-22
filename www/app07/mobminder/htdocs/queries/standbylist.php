<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R Y     E M E R G E N C I E S
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();


	$duration 	= $_POST['duration'];
	$notbefore 	= $_POST['before']+0;
	$ampm 		= $_POST['ampm']+0;
	$staffsize 	= $_POST['staffsize']+0;
	$workcodes 	= $_POST['workcodes'];
	$tboxing 	= $_POST['tboxing'];
	$continued 	= $_POST['continued']+0;

	C_date::setTimeParameters($dS_account);

	$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? Array() : explode('!', $bCals);
	$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? Array() : explode('!', $uCals);
	$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? Array() : explode('!', $fCals);

	// convert to framework format
	$duration = $duration * C_date::getSecondsPerSlice();

	$workcodes = $workcodes=='-' ? Array() : explode('!', $workcodes);
	$tboxing = $tboxing=='-' ? Array() : explode('!', $tboxing);

	if($continued) { $swindowIn = new C_date($continued); $swindowIn->dIncrement(1); }
		else $swindowIn = new C_date($notbefore); 
	$swindowIn->setToMidnight();
	$cueFrom = $swindowIn->getTstmp();
	
// retrieve posts
$perfReport->peak('::time needed to retrieve session and posted parameters');


// check if this relates to a specific view
	$rescIds = array_merge($bCals, $uCals, $fCals);
	$rescIds = implode(',',$rescIds); echo 'rescIds are '.$rescIds.$nl;

// step 01: fetch reservations where this visitor was invited
$o_dbAccess_reservations = new C_dbAccess_reservations();
$o_dbAccess_reservations->loadOnWaitingList($cueFrom, $rescIds, $duration);
$resaIds = $o_dbAccess_reservations->getIdsList();
$perfReport->peak('::o_dbAccess_reservations');

// step02: fetch group resource attendees & visitors attendees (this overwrites step00)
$o_dbAccess_attendees = new C_dbAccess_attendees();
if($resaIds!='') $o_dbAccess_attendees->loadOnGroup($resaIds);
$perfReport->peak('::o_dbAccess_attendees');


// step02: fetch group resource attendees & visitors attendees (this overwrites step00)
$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
if($resaIds!='') $o_dbAccess_att_visitors->loadOnGroup($resaIds);
$perfReport->peak('::o_dbAccess_attendees');


// step04: fetch visitors (does not reload this visitor for which we already have the data)
$o_dbAccess_visitors = new C_dbAccess_visitors();
$o_dbAccess_visitors->loadOnId($o_dbAccess_att_visitors->getVisitorsIds(), false);
$perfReport->peak('::o_dbAccess_visitors');


// step05: fetch performances
$o_dbAccess_performances = new C_dbAccess_performances(); 
$o_dbAccess_performances->loadOnGroup($resaIds);
$perfReport->peak('::o_dbAccess_performances');


// step05: fetch payments
$o_dbAccess_payments = new C_dbAccess_payments(); 
$o_dbAccess_payments->loadOnGroup($resaIds);
$perfReport->peak('::o_dbAccess_payments');




$bank = 'standbylist';
echo '<code>';

echo $o_dbAccess_visitors->stream(no_alias, no_bank, with_tracking); 
echo $o_dbAccess_att_visitors->stream(false, $bank);
echo $o_dbAccess_attendees->stream(false, $bank);
echo $o_dbAccess_performances->stream(false, $bank);
echo $o_dbAccess_reservations->stream(false, $bank);
echo $o_dbAccess_payments->stream(false, $bank, with_tracking);

echo '</code>';

$perfReport->peak('::step 3 - echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_emerg');
?>