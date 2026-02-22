<?php
require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e-RESA, check in scenario
//
// Based on email and mobile, we retrieve a list of potential visitors for the e-resa



$email 	= strtolower($_POST['email']); 	if(!isset($email)) die('No email was passed');
$mobile = $_POST['mobile']; 			if(!isset($email)) die('No mobile was passed');

$demo = $_SESSION['demo'];
if(!$email) die('no mail');


	
	// based on email, mobile, birthdate, check if visitor is registered
	
	echo $nl.'email in:'.$email;
	echo $nl.'mobile in:'.($mobile===false?'-':'|'.$mobile.'|');
	
	
	// you are in the second stage of the identification process (email and mobile and birthday are provided)
	
	if($mobile) $mobile = checkMobileFormat($mobile, $dS_account->phoneRegion); 
	if(!$mobile) $mobile = false;
	
	
	
	$visitors = new C_dbAccess_visitors();
	$visitors->loadOnEmail($accountId, $email, $mobile);
	
	echo $nl.'possible matches:';
	$c = 1;
	$ids = Array();
	foreach($visitors->keyed as $id => $dSvisitor) {
		echo $nl.($c++).'/ '.$dSvisitor->getFullName().chr(9).' '.$dSvisitor->mobile.chr(9).' '.$dSvisitor->birthday.chr(9).' '.$dSvisitor->email;
		$ids[] = $id;
	}
	echo $nl;
	
	$vcount = $visitors->count();
	if($vcount == 0) { echo 'none'; die( $nl.'aborting'); }
	
	if($vcount == 1) { // there is a unique match, based on mobile or email address
		$dSvisitor = $visitors->getfirst();
		$visiId = $dSvisitor->id;
		
		// complete filling of visitor's data based on introduced data
			if($dSvisitor->mobile == '') if($mobile) $dSvisitor->mobile = $mobile;
			if($dSvisitor->email != $email) $dSvisitor->email = strtolower($email);
			$dSvisitor->dSsave();
	} else {
		// more than one match => then we sort of using birthday
		// check if there is a match on birthdate
		
		//$visiId = 0; // $_SESSION['e-visi'] will be defined in the next step
		
		//BSP : store all visitor ids
		$visiId = implode(',',$ids);
		//$visiId = $email."-".$mobile;
		//echo "ids=".$visiId;
	}
	
		
	// getting here: a unique visitor match has been found
	$_SESSION['e-visi'] = $visiId;
	
	echo '<code>';
	echo $visitors->stream(no_alias, no_bank, with_tracking);
	echo '</code>';
	
?>