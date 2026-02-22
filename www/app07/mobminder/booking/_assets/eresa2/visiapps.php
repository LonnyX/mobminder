<?php
ob_start();

require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 


if(isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
if(isset($_SESSION['e-paymean'])) unset($_SESSION['e-paymean']);
session_write_close(); 


	$vids = @$_POST['ids']; 
	if(!isset($vids)) die('Not allowed.'); 
	if($vids<=0) die('Virtual id not accepted.'); 
	
	
	$sortedvidsfrompost = explode(',',$vids);
	sort($sortedvidsfrompost);
	$sortedvidsfrompost=implode($sortedvidsfrompost);
	//echo "sortedvidsfrompost=".$sortedvidsfrompost."\n";
	
	$sortedvidsfromsession = explode(',',$_SESSION['e-visi']);
	sort($sortedvidsfromsession);
	$sortedvidsfromsession=implode($sortedvidsfromsession);
	//echo "sortedvidsfromsession=".$sortedvidsfromsession."\n";

	if($sortedvidsfrompost!=$sortedvidsfromsession) 
	{
		die('are you trying to steel data?');
	}
	
	
	// getting here: visitors have been chosen for whom the surfer intends to appoint for

	// check if this key relates to a specific view (appointments should not appear when taken in the same account on agenda lines out of this web page view)
	$o_dS_accesskey = new C_dS_accesskey($_SESSION['keyId']);
	$o_dbAccess_resources = new C_dbAccess_resources($accountId, $o_dS_accesskey); 
	$rescIds = $o_dbAccess_resources->viewIds;
	
	
	$now = new C_date();
	$nowStamp = $now->getTstmp();
	$q = new Q('select reservations.id from reservations
				join att_visitors on att_visitors.groupId = reservations.id
				join attendees on attendees.groupId = reservations.id
				where attendees.resourceId in ('.$rescIds.')
					and att_visitors.resourceId in ('.$vids.')
					and reservations.cueIn > '.$nowStamp.';');

	$resaIds = $q->ids();
	
	$o_dbAccess_reservations = new C_dbAccess_reservations();
	$o_dbAccess_attendees = new C_dbAccess_attendees();
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_performances = new C_dbAccess_performances(); 

	//BSP - load prebooking for reservations IDs
	$o_dbAccess_prebookings = new C_dbAccess_prebookings();

	if($resaIds) {
		$o_dbAccess_reservations->loadOnId($resaIds);
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
		$o_dbAccess_performances->loadOnGroup($resaIds);
		$o_dbAccess_prebookings->loadByResaIds($resaIds); 
	}

	
	// stream the visitor if any found, along with his appointments
	
	$bank = 'visiapps';
	
	echo '<code>';
	echo $o_dbAccess_att_visitors->stream(false, $bank);
	echo $o_dbAccess_attendees->stream(false, $bank);
	echo $o_dbAccess_performances->stream(false, $bank);

	//solution for displaying account location timezone see (*dtacc01*)
	C_date::setTimeParameters($dS_account);
	$o_dbAccess_reservations->addmeta_datetimeVerbose();
	echo $o_dbAccess_reservations->stream(false, $bank);
	
	echo $o_dbAccess_prebookings->stream(false, $bank);
	echo '</code>';
	
	closeconnection();
?>