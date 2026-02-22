<?php
	require '../classes/language.php';
	$loadcontext = 1; 
	require '../classes/ajax_session.php';

	//////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    e-RESA, check in scenario
	//

	$ids = $_POST['ids']; if(!isset($ids)) die('No ids were passed');
	if($ids<=0) die('Virtual id not accepted.'); 

	$resaid4payment = @$_POST['resaid4payment']; 
	if(!isset($resaid4payment)) die('No resaid4payment was passed');

	echo $nl.'ids:'.$ids;
	
	$visitors = new C_dbAccess_visitors();
	$visitors->loadOnId($ids);
	
	// ???getting here: visitors have been chosen for whom the surfer intends to appoint for

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
					and att_visitors.resourceId in ('.$ids.')
					and reservations.cueIn > '.$nowStamp.';');

	$resaIds = $q->ids();
	
	$o_dbAccess_reservations = new C_dbAccess_reservations();
	$o_dbAccess_attendees = new C_dbAccess_attendees();
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_performances = new C_dbAccess_performances( /* resaId */ false); 
	
	//BSP - load prebooking for reservations IDs
	$o_dbAccess_prebookings = new C_dbAccess_prebookings();

	if($resaIds) {
		$o_dbAccess_reservations->loadOnId($resaIds);
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
		$o_dbAccess_performances->loadOnGroup($resaIds);
		$o_dbAccess_prebookings->loadByResaIds($resaIds); 
	}

	
	
	

	$payments = new C_dbAccess_payments($resaid4payment);
	$dS_payment = $payments->getfirst();
	

	$bank = 'visiapps';

	echo '<code>';
	echo $visitors->stream(no_alias, no_bank, with_tracking);
	//echo $visitors->stream(with_tracking, $bank);
	echo $o_dbAccess_att_visitors->stream(false, $bank);
	echo $o_dbAccess_attendees->stream(false, $bank);
	echo $o_dbAccess_performances->stream(false, $bank);
	echo $o_dbAccess_reservations->stream(false, $bank);
	echo $o_dbAccess_prebookings->stream(false, $bank);
	echo $dS_payment->stream1(with_tracking, $bank); //with_tracking
	echo '</code>';
	
?>