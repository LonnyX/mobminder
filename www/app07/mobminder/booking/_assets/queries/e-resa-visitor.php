<?php
ob_start();

require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 

if(isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
if(isset($_SESSION['e-paymean'])) unset($_SESSION['e-paymean']);
session_write_close(); 

	$visiId = @$_POST['id']; if(!isset($visiId)) die('#error e-r-v00001a');
	if($visiId<=0)  die('#error e-r-v00001b');

	if($visiId!=$_SESSION['e-visi'])  die('#error e-r-v00001c');
	
	// getting here: a unique visitor match has been found
	// $_SESSION['e-visi']= $visiId; //not used anymore! it's already set in e-resa-checkin

	
	$dSvisitor = new C_dS_visitor($visiId);
	
	// step00: fetch attendees related to this visitor (in the current table only)
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_att_visitors->loadOnResource($visiId);
	$resaIds = $o_dbAccess_att_visitors->getGroupIdsList();
	
	// check if this key relates to a specific view
	$o_dS_accesskey = new C_dS_accesskey($_SESSION['keyId']);
	$o_dbAccess_resources = new C_dbAccess_resources($accountId, $o_dS_accesskey); 
	$rescIds = $o_dbAccess_resources->viewIds;
	
	// step 01: fetch reservations where this visitor was invited
	$now = new C_date();
	$nowStamp = $now->getTstmp();
	$o_dbAccess_reservations = new C_dbAccess_reservations();
	if($resaIds) $o_dbAccess_reservations->loadOnIdsAndView($resaIds, $rescIds); 
	//if($resaIds) $o_dbAccess_reservations->loadOnIdsAndView4eResa($resaIds, $rescIds); 

	$resaIds = Array();
	if($o_dbAccess_reservations->count())
		foreach($o_dbAccess_reservations->keyed as $resaId => $o_dS_resa)
			if($o_dS_resa->cueIn > $nowStamp) $resaIds[] = $resaId;
	

	$o_dbAccess_reservations = new C_dbAccess_reservations();
	$o_dbAccess_attendees = new C_dbAccess_attendees();
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_visitors = new C_dbAccess_visitors();
	$o_dbAccess_performances = new C_dbAccess_performances(); 

	//BSP - load prebooking for reservations IDs
	$o_dbAccess_prebookings = new C_dbAccess_prebookings();
		
	if(count($resaIds)) {

		$resaIds = implode(',',$resaIds);

		$o_dbAccess_reservations->loadOnId($resaIds);
		
		// step02: load attendees and visitors
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
		$o_dbAccess_visitors->loadOnId($o_dbAccess_att_visitors->getVisitorsIds($visiId /*exclude this id*/)); // loads other visitors invited to the reservations under scope
		$o_dbAccess_performances->loadOnGroup($resaIds);

		//if($resaIds) 
		$o_dbAccess_prebookings->loadByResaIds($resaIds); 
	}

	

	$resaid4payment = @$_POST['resaid4payment']; 
	if(isset($resaid4payment)) { if(!is_numeric($resaid4payment)) die('#error e-r-v00001d'); }
	else $resaid4payment=false;
	
	//echo $resaid4payment;
	if($resaid4payment) {
		$payments = new C_dbAccess_payments('', $resaid4payment);
		if($payments->count()==0) $dS_payment=false;
		else $dS_payment = $payments->getfirst();
	}
	else
		$dS_payment=false;

	////////////////////////////////////////////////////////////////
	
	// stream the visitor if any found, along with his appointments
	
	$bank = 'visiapps';
	echo '<code>';
	
	echo $dSvisitor->stream1(with_tracking);

	echo $o_dbAccess_visitors->stream(no_alias, no_bank, with_tracking); 
	echo $o_dbAccess_att_visitors->stream(false, $bank);
	echo $o_dbAccess_attendees->stream(false, $bank);
	echo $o_dbAccess_performances->stream(false, $bank);
	
	//solution for displaying account location timezone see (*dtacc01*)
	C_date::setTimeParameters($dS_account);
	$o_dbAccess_reservations->addmeta_datetimeVerbose();
	echo $o_dbAccess_reservations->stream(false, $bank);

	echo $o_dbAccess_prebookings->stream(false, $bank);
	if($dS_payment && $dS_payment->id)
	{
		echo $dS_payment->stream1(with_tracking, $bank); //with_tracking
	} 

	echo '</code>';
	
	closeconnection();	
?>