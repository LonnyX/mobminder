<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T S    A    N E W    G R O U P    C R E A T I O N   ( from the .com wizard )
//
if(!isset($_SESSION['loginId'])) $systemLog = 'web wizard'; // identifies the caller
require '../../lib_mobphp/dbio.php';

// if(isset($_SERVER['HTTP_REFERER']))
	// echo $_SERVER['HTTP_REFERER'];
	// else echo 'HTTP_REFERER is not defined'.chr(10);
	
$error = 0;

// error = 1 email exists
// error = 9 no mobile

// echo $_SERVER['HTTP_REMOTE_ADDR'];

if(1) {

// clean up mobile from surfer fantasia encoding
		$phoneRegion = $_POST['phoneRegion'];
		$mobile = $_POST['mobile'];
		$mobile = preg_replace('/[^0-9]/', '', $mobile);
		$mlen = strlen($mobile); $mhead = substr($mobile,0,1);
		if($mhead=='0') $mobile = substr($mobile, -($mlen-1));
	$mobile = $phoneRegion.$mobile;

// used for group creation:
	$name 			= $_POST['name']; if($name=='') die('##'.chr(10).'e=0'.chr(10).'a=error'.chr(10).'b=error'.chr(10));
	$email			= $_POST['email'];
	$_POST['smsSenderId'] = $mobile;
	$timeSlice 		= $_POST['timeSlice'];
	
	
	$promoCode = $_POST['promoCode']; // comes from wizard and is empty unless you specify a promocode like www.mobminder.com/promo/playoff/gsk
	switch($promoCode) { // portfolioId is a login Id
		case 'PO2014GENE': 		$portfolioId = 9085; break; 
		case 'PO2014DERMA': 	$portfolioId = 9087; break; 
		case 'PO2014PEDI': 		$portfolioId = 9086; break; 
		
		case 'OMNIPRO': 		$portfolioId = 9088; break; 
		case 'DENTADMIM': 		$portfolioId = 9089; break; 
		case 'OCTOPUS': 		$portfolioId = 9090; break;
		
		default: $portfolioId = 7918; // that is the default portfolio for wizard created accounts
	}
	

// used for login creation:
		$_POST['gender'] -= 2; /* form writing easier in wizard.com */
	$gender 		= $_POST['gender'];
	$firstname 		= $_POST['firstname'];
	$lastname 		= $_POST['lastname'];
	$country 		= $_POST['country'];
	$email 			= $_POST['email'];	
	$language 		= 0; // english$_POST['language']; 
		switch($_POST['language']) {
			case '1': $language = 1; break; // french
			case '2': $language = 3; break; // dutch
		}
	
	// package plan
	$smsOn = 1;
	switch($_POST['packagePlan']) {
		case 'Starter': $smsOn = 0; break;
		case 'Basic': break;
		case 'Pro': break;
		case 'Premium': break;
		case 'Custom': break;
	}
	$_POST['sendSMSs'] = $smsOn;
	$_POST['package'] = $_POST['packagePlan']; // so we know what button was clicked by the surfer on the tarif page
}

if(1) {

// used for hourly creation:
	$agnames = array();
	$agcount = $_POST['agendaCount'];
	$amMin = 23; $pmMax = 0;
	$hourlies = array(); 
	for($xag = 0; $xag < $agcount ; $xag++) {
		$agnames[] = $_POST['agendaName-'.$xag];
		$hourlies[$xag] = array(
			  'x'=>array(1=>0,2=>0,3=>0,4=>0,5=>0,6=>0,7=>0)
			, 'am'=>array(1=>0,2=>0,3=>0,4=>0,5=>0,6=>0,7=>0)
			, 'pm'=>array(1=>0,2=>0,3=>0,4=>0,5=>0,6=>0,7=>0));
		for($dc = 1; $dc <= 7; $dc++) {
			$open = $hourlies[$xag]['x'][$dc] = $_POST['a'.$xag.'dc'.$dc.'x']+0; 	// e.g. $_POST[a0dc2x] = 1 indicates agenda 0 is closed on monday
			$am = $hourlies[$xag]['am'][$dc] = $_POST['a'.$xag.'dc'.$dc.'am']+0;  // e.g. $_POST[a0dc3am] = 9 indicates agenda 0 opens from 9am on tuesday
			$pm = $hourlies[$xag]['pm'][$dc] = $_POST['a'.$xag.'dc'.$dc.'pm']+0;  // e.g. $_POST[a0dc3pm] = 18 indicates agenda 0 closes at 6pm on tuesday
			if($open) {
				if($am < $amMin) $amMin = $am;
				if($pm > $pmMax) $pmMax = $pm;
			}
		}
		$rangeIn = 3600 * $amMin;
		$rangeOut = 3600 * $pmMax;
		$_POST['rangeIn'] = $rangeIn;
		$_POST['rangeOut'] = $rangeOut;
		$_POST['stiFontSize'] = ($agcount > 1)? 1 : 2; // sets the biggest font when a single agenda is created
	}
}



	//////////////////////////////////////////////////////////////////////////////////
	//
	//  meta data creation
	//
		
	// agenda time range
	

	// login
	if(1) { // find a free login in DB
		$exists = 1;
		for($postfix = 1; $exists!=0; $postfix++) {
			$candidate = $firstname.$postfix; // like [julien1, julien2, julien3, ...] up to a point we find a free login
			$q = new Q('SELECT id FROM logins WHERE login="'.$candidate.'";');
			$exists = $q->cnt();
		}
		$login = $candidate;
		$password = substr($lastname,0,1)+substr($mobile,-4);
	}
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//
	//  data sets creation
	//
	
	if(1) {
		// group
		$o_dS_group = new C_dS_group(0, 1 /* 1 is set as groupId for groups created from the  wizard */, $_POST);
			$o_dS_group->language = $language;
			$o_dS_group->dSsave();
			$groupId = $o_dS_group->id; // 1 indicates creation through this interface
		
		// login
		$o_dS_login = new C_dS_login(0, $groupId, $_POST); 
			$o_dS_login->mobile = $mobile;
			$o_dS_login->login = $login;
			$o_dS_login->password = $password;
			$o_dS_login->language = $language;
			$o_dS_login->dSsave();
			$loginId = $o_dS_login->id;
		
		// a first visitor re-using coordinates of the login (so we can send him a message)
		$o_dS_visi = new C_dS_visitor(0, $groupId, $_POST); 
			$o_dS_visi->mobile = $mobile;
			$o_dS_visi->dSsave();
			$visiId = $o_dS_visi->id;
		
		// keys
		$o_dS_accesskey = new C_dS_accesskey(); // create a key for our new account user
			$o_dS_accesskey->groupId = $loginId;
			$o_dS_accesskey->accountId = $groupId;
			$o_dS_accesskey->dSsave();
			
		$portfolioId = isset($_SESSION['loginId'])?$loginId:$portfolioId; // associate with the 
		
		$o_dS_accesskey = new C_dS_accesskey(); // create a key for administration
			$o_dS_accesskey->groupId = $portfolioId; // is a login Id
			$o_dS_accesskey->accountId = $groupId;
			$o_dS_accesskey->dSsave();
			$keyId = $o_dS_accesskey->id;
			
		// resources
		$dS_resources = array();
		for($xag=0; $xag < $agcount; $xag++) {
			$o_dS_resource = new C_dS_resource();
				$o_dS_resource->groupId = $groupId;
				$o_dS_resource->name = $agnames[$xag];
					$colors = array( 0=>152,1=>131,2=>182,3=>161,4=>121,5=>142,6=>293,7=>282,8=>292,9=>252 );
				$o_dS_resource->color = $colors[$xag];
				$o_dS_resource->dSsave();
				$dS_resources[] = $o_dS_resource;
		}
		
		// hourlies
		$dS_hourlies = array();
		for($xag=0; $xag < $agcount; $xag++) {
		
			// hourly for each resource
			$o_dS_hourly = new C_dS_hourly();
			$o_dS_hourly->groupId = $groupId;
			$o_dS_hourly->name = $agnames[$xag];
				$colorsOff 		= array( 0=>121,1=>131,2=>141,3=>151,4=>161,5=>171,6=>181,7=>102,8=>98,9=>98 );
				$colorsExcp 	= array( 0=>122,1=>132,2=>142,3=>152,4=>162,5=>172,6=>182,7=>105,8=>97,9=>97 );
				$colorsAbsent 	= array( 0=>123,1=>133,2=>143,3=>153,4=>163,5=>173,6=>183,7=>109,8=>91,9=>91 );
			$o_dS_hourly->colorOff = $colorsOff[$xag];
			$o_dS_hourly->colorExcp = $colorsExcp[$xag];
			$o_dS_hourly->colorAbsent = $colorsAbsent[$xag];
			$o_dS_hourly->dSsave();
			$dS_hourlies[] = $o_dS_hourly;
			
			// hourly usage
			$o_dS_hourlyuser = new C_dS_hourlyuser();
			$o_dS_hourlyuser->groupId = $dS_resources[$xag]->id;
			$o_dS_hourlyuser->hourlyId = $o_dS_hourly->id;
			$o_dS_hourlyuser->dayIn = 0;
			$o_dS_hourlyuser->dSsave();
			
			// shadows
			for($dc = 1; $dc <= 7; $dc++) {
			
				if($hourlies[$xag]['x'][$dc]==0) {	// then it is a closed day
						$o_dS_shadow = new C_dS_shadow(0,$o_dS_hourly->id);
						$o_dS_shadow->exceptional = shadow_offday;
						$o_dS_shadow->cueIn = 0;
						$o_dS_shadow->cueOut = 86400;
						$o_dS_shadow->dayCode = $dc;
					$o_dS_shadow->dSsave();
					
				} else {
						$o_dS_shadow = new C_dS_shadow(0,$o_dS_hourly->id);
						$o_dS_shadow->exceptional = shadow_normal;
						$o_dS_shadow->cueIn = 0;
						$o_dS_shadow->cueOut = 3600*$hourlies[$xag]['am'][$dc];
						$o_dS_shadow->dayCode = $dc;
					$o_dS_shadow->dSsave();
					
						$o_dS_shadow = new C_dS_shadow(0,$o_dS_hourly->id);
						$o_dS_shadow->exceptional = shadow_normal;
						$o_dS_shadow->cueIn = 3600*$hourlies[$xag]['pm'][$dc];
						$o_dS_shadow->cueOut = 86400;
						$o_dS_shadow->dayCode = $dc;
					$o_dS_shadow->dSsave();
				}
			}
		} // loop to next agenda
		echo 'info'.chr(10);
		echo '@@'.$keyId.chr(10); // for testing from the admin login
	}
	
	// stream back to caller
		echo '##'.chr(10); // beyond this ##, values are intended to the web wizard.com
		echo 'e='.$error.chr(10);
		echo 'a='.$login.chr(10);
		echo 'b='.$password.chr(10);
?>