<?php
require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';

	$visiId = @$_POST['id']; if(!isset($visiId)) die('Not allowed.'); 
	if($visiId<=0) die('Virtual id not accepted.'); 

	
	// getting here: a unique visitor match has been found
	$_SESSION['e-visi'] = $visiId;
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
	
	$resaIds = implode(',',$resaIds);

	$o_dbAccess_reservations = new C_dbAccess_reservations();
	$o_dbAccess_attendees = new C_dbAccess_attendees();
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_visitors = new C_dbAccess_visitors();
	$o_dbAccess_performances = new C_dbAccess_performances( /* resaId */ false); 

		
	
	if(count($resaIds)) {
	
		$o_dbAccess_reservations->loadOnId($resaIds);
		
		// step02: load attendees and visitors
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
		$o_dbAccess_visitors->loadOnId($o_dbAccess_att_visitors->getVisitorsIds($visiId /*exclude this id*/)); // loads other visitors invited to the reservations under scope
		$o_dbAccess_performances->loadOnGroup($resaIds);
	}

	//BSP - load prebooking for reservations IDs
	$o_dbAccess_prebookings = new C_dbAccess_prebookings();
	if($resaIds) $o_dbAccess_prebookings->loadByResaIds($resaIds); 

	$resaid4payment = @$_POST['resaid4payment']; 
	if(!isset($resaid4payment)) $resaid4payment=false;
	//echo $resaid4payment;
	if ($resaid4payment)
	{
		$payments = new C_dbAccess_payments($resaid4payment);
		if ($payments->count()==0)
		{
			//echo "count=0";
			$dS_payment=false;
		}
		else
		{
			$dS_payment = $payments->getfirst();
			//echo "found";
		}
	
	}
	else
	{
		$dS_payment=false;
	}

	////////////////////////////////////////////////////////////////
	
	// stream the visitor if any found, along with his appointments
	
	$bank = 'visiapps';
	echo '<code>';
	echo $dSvisitor->stream1(with_tracking);
	echo $o_dbAccess_visitors->stream(no_alias, no_bank, with_tracking); 
	echo $o_dbAccess_att_visitors->stream(false, $bank);
	echo $o_dbAccess_attendees->stream(false, $bank);
	echo $o_dbAccess_performances->stream(false, $bank);
	echo $o_dbAccess_reservations->stream(false, $bank);
	echo $o_dbAccess_prebookings->stream(false, $bank);
	if($dS_payment && $dS_payment->id)
	{
		echo $dS_payment->stream1(with_tracking, $bank); //with_tracking
	} 

	echo '</code>';
	
?>