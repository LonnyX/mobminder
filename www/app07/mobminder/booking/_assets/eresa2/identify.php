<?php
ob_start();

require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e-RESA, check in scenario
//
// Based on email and mobile, we retrieve a list of potential visitors for the e-resa



$email 	= strtolower($_POST['email']); 	if(!isset($email)) die('No email was passed');
$mobile = $_POST['mobile']; 			if(!isset($email)) die('No mobile was passed');


//2023-03-16 - some security check -------------------------------------------------------------
$email = substr($email,0,64); // 1. limit the length to the natural max length for an email
$mailpattern = "/[^._a-zA-Z0-9-@]/"; // 2. remove anything that is not supposed to be present in an email
$email = preg_replace($mailpattern, '', $email); 
if(!filter_var($email, FILTER_VALIDATE_EMAIL)) die('error 66001'); // 3. check the format

if($mobile) {
	$mobile = substr($mobile,0,24); // 1. limit the length to the natural max length for an email
	$mobilepattern = "/[^0-9+]/"; // 2. remove anything that is not supposed to be present in an email
	$mobile = preg_replace($mobilepattern, '', $mobile); 
	if(!is_numeric($mobile)) die('error 66002'); // 3. check the format
}
//2023-03-16 - security update -------------------------------------------------------------


$demo = $_SESSION['demo'];
if(!$email) die('no mail');


	
	// based on email, mobile, birthdate, check if visitor is registered
	
	//echo $nl.'email in:'.$email;
	//echo $nl.'mobile in:'.($mobile===false?'-':'|'.$mobile.'|');
	
	
	// you are in the second stage of the identification process (email and mobile and birthday are provided)
	
	if($mobile) $mobile = checkMobileFormat($mobile, $dS_account->phoneRegion); 
	if(!$mobile) $mobile = false;
	
	
	
	$visitors = new C_dbAccess_visitors();
	$visitors->loadOnEmail($accountId, $email, $mobile);
	
	//echo $nl.'possible matches:';
	$c = 1;
	$ids = Array();
	foreach($visitors->keyed as $id => $dSvisitor) 
	{
		//echo $nl.($c++).'/ '.$dSvisitor->getFullName().chr(9).' '.$dSvisitor->mobile.chr(9).' '.$dSvisitor->birthday.chr(9).' '.$dSvisitor->email;
		$ids[] = $id;

		//echo '$dSvisitor->cssColor'.$dSvisitor->cssColor;
		//echo '$dS_login->eresaBlacklist'.$dS_login->eresaBlacklist;

		if($dSvisitor->cssColor!=0 && $dSvisitor->cssColor== $dS_login->eresaBlacklist)
		{
			die('Blacklisted!'.$nl);
		}
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

		//no need to save e-mail in session because email is already saved into single visitor (*forceemail*)
		if(isset($_SESSION['e-mail'])) unset($_SESSION['e-mail']); 
	} 
	else 
	{
		// more than one match => then we sort of using birthday
		// check if there is a match on birthdate
		
		//$visiId = 0; // $_SESSION['e-visi'] will be defined in the next step
		
		//BSP : store all visitor ids
		$visiId = implode(',',$ids);
		//$visiId = $email."-".$mobile;
		//echo "ids=".$visiId;

		//save email into session for updating visitors email if email is not set (from post/payment.php) (*forceemail*)
		$_SESSION['e-mail'] = $email; 
	}
	
		
	// getting here: a unique visitor match has been found
	$_SESSION['e-visi'] = $visiId;
	
	
	echo '<code>';
	echo $visitors->stream(no_alias, no_bank, with_tracking);
	echo '</code>';

	closeconnection();
?>