<?php
require '../classes/language.php';
$loadcontext = 1; require '../classes/ajax_session.php';


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e-RESA, check in scenario
//
//  							    STAGE 1: We receive an email 
//                                            |            
//                                            | 
//                                            | 
//                                  Authenticate (if active option)
//                                            |  
//                                            |  
//                                            | 
//       ------------------->       STAGE 2: Identification 
//      |                       /             |              \
//      |                      /              |               \
//      |                  CASE 0           CASE 1           CASE 2
//      |                    /                |                 \
//      |                   /                 |                  \
//      |      match 0 visitor                |                   \
//      |        |        |                   |                   match 2+ visitors
//      |        |        |                   |                       |
//     (1)      (1)      (2)                  |                       |
//      |        |        |                   |                       |
//      |   ask for bdate |        ---> match 1 visitor  <---       list and 
//       --<- and mobile  |       |           |              |   ask for right one
//                        |       |           |              |     or register
//                        |      (2)          |              |     a new one
//                        |       |           |              |        |
//             register a new     |           |              |        |                 
//                   visitor      |           |               --------
//                        |       |           |
//                        |       |           |
//                         --->---            |
//                                            |
//                                            |
//                                            |
//  							OBJECTIVE REACHED: 1 visitor identified
//
//


$email 	= strtolower($_POST['email']);
$mobile = @$_POST['mobile']; if(!isset($mobile)) $mobile=false; 
$bdate 	= @$_POST['bdate']; if(!isset($bdate)) $bdate=false;
$signin = @$_POST['signin']; // if defined, a token is anyway generated to the given email



// some security check
// die('error 66002'); // uncomment when testing client side response to this error code

$email = substr($email,0,64); 				// 1. limit the length to the natural max length for an email
	$mailpattern = "/[^._a-zA-Z0-9-@]/";	// 2. remove anything that is not supposed to be present in an email
$email = preg_replace($mailpattern, '', $email);				
if(!filter_var($email, FILTER_VALIDATE_EMAIL)) die('error 66001'); // 3. check the format

if($mobile) {
	$mobile = substr($mobile,0,24); 	// 1. limit the length to the natural max length for an email
		$mobilepattern = "/[^0-9+]/";	// 2. remove anything that is not supposed to be present in an email
	$mobile = preg_replace($mobilepattern, '', $mobile);				
	if(!is_numeric($mobile)) die('error 66002'); // 3. check the format
}

if($bdate) {
	$bdate = substr($bdate,0,8); 	// 1. limit the length to the natural max length for an email
		$bdatepattern = "/[^0-9]/";	// 2. remove anything that is not supposed to be present in an email
	$bdate = preg_replace($mobilepattern, '', $bdate);				
	if(!filter_var($bdate, FILTER_VALIDATE_INT)) die('error 66003'); // 3. check the format
}



$demo = $_SESSION['demo'];
if(!$email) die('no mail');

$language = $dS_login->language; // the default language for sending an email is the login language (because it defines the displayed language on the reservation page)
	// note that in case of registration, we do not know yet the visitor language
	// in case of recognition (logic here under), we will use the language of the known visitor



if(!isset($signin)) { // NOT A REGISTRATION REQUEST => based on email, mobile, birthdate, check if visitor is registered
	
	echo $nl.'email in:'.$email;
	echo $nl.'mobile in:'.($mobile===false?'-':'|'.$mobile.'|');
	echo $nl.'bdate in:'.($bdate===false?'-':'|'.$bdate.'|').$nl;
	
	
	if(!$mobile&&!$bdate) { // you are in the first stage of the identification process, only email is provided
		
		
	}
	
	// you are in the second stage of the identification process (email and mobile and birthday are provided)
	
	if($mobile) $mobile = checkMobileFormat($mobile, $dS_account->phoneRegion); 
	if(!$mobile) $mobile = false;
	
	
	$visitors = new C_dbAccess_visitors();
	$visitors->loadOnEmail($accountId, $email, $mobile);
	
	echo $nl.'possible matches:';
	$c = 1;
	
	if($demo)
		foreach($visitors->keyed as $id => $dSvisitor) {
			echo $nl.($c++).'/ '.$dSvisitor->getFullName().chr(9).' '.$dSvisitor->mobile.chr(9).' '.$dSvisitor->birthday.chr(9).' '.$dSvisitor->email;
		}
	echo $nl;
	
	$vcount = $visitors->count();
	if($vcount == 0) { echo 'none'; die( $nl.'aborting'); }
	
	if($vcount == 1) { // there is a unique match, based on mobile or email address
		$dSvisitor = $visitors->getfirst();
		$visiId = $dSvisitor->id;
	} else {
		// more than one match => then we sort of using birthday
		// check if there is a match on birthdate
		$visiId = false;
		foreach($visitors->keyed as $id => $dSvisitor)
			if(!$dSvisitor->birthday) continue; 
			else if($dSvisitor->birthday==$bdate) { $visiId = $id; break; }
		if(!$visiId) die($nl.'no birhday match');
	}
	
	// complete filling of visitor's data based on introduced data
		if($dSvisitor->birthday == 0) if($bdate) $dSvisitor->birthday = $bdate;
		if($dSvisitor->mobile == '') if($mobile) $dSvisitor->mobile = $mobile;
		if($dSvisitor->email != $email) $dSvisitor->email = strtolower($email);
		$dSvisitor->dSsave();
		$language = $dSvisitor->language;
		
	// getting here: a unique visitor match has been found
	$_SESSION['e-visi'] = $visiId;  // see (*ea02*)
}


if($dS_login->eresaAuthent) { // authentication option is active on this web page

	// make a token
	$tstmp = time();
	$token = substr($tstmp,-4);
	$_SESSION['token'] = $token;

	// send the token
				$fromail = $dS_login->email; if(!$dS_login->email) $fromail = $dS_account->email; 
			$replyto  = $dS_login->firstname.' '.$dS_login->lastname.' <'.$fromail.'>';
			$time  = new C_date();
		
			$title = $dS_account->name.', '.L::XL('e-resa-token-mail title',$language);
			$h1 = L::XL('e-resa-token-mail title',$language).': '.$token;
			$body1 = '<h3>'.L::XL('mail sent at',$language).': '.$time->getHHmmString().'</h3>';
			$body2 = '<h3>'.L::XL('your code is',$language).': '.$token.'</h3>';
			$body3 = '<h3>'.L::XL('greetings',$language).',</h3>';
			$body4 = '<h3>'.$dS_login->firstname.'&nbsp;'.$dS_login->lastname.'</h3>';
			$body5 = '';
			$body = $body1.$body2.$body3.$body4.$body5;
			
		$o_dS_system = new C_dS_system();
		if($demo) { // echo to the tester console because we are in demo mode and/or the 
			
			echo $nl.'Sending 2FA token : '.'!'.$token.'!'.$nl;
			echo 'from:'.chr(9).$replyto.$nl;
			echo 'to:'.chr(9).$email.$nl;
			echo 'title:'.chr(9).$title.$nl;
			echo 'body:'.$nl.$body1.$nl.$body2.$nl.$body3.$nl.$body4.$nl.$body5.$nl;
			
		} else { // send a mail
			
			echo $nl.'Sending 2FA token';
			echo 'from:'.chr(9).$fromail.$nl;
			echo 'to:'.chr(9).$email.$nl;
			
			// $o_dataCom_mail = new C_dataCom_mail();
			// $o_dataCom_mail->sendMail($title, $body, $email, $replyto, $dS_login->language);
			
				$html = HMTLemailDecoration($h1, $body, $dS_account);
			$emailgateaway = new C_b64_email('rdv@mobminder.com', '', ''); // New mailer 2023
			$emailgateaway->sendMail($email, 0, $replyto, $title, $html); 
		}
} else {
		echo $nl.'No authentication: Kiosk mode'.$nl;
	}

	
// stream the visitor if any found
if(!isset($signin)) {
	
	$bank = 'visiapps';
	echo '<code>';
	echo $dSvisitor->stream1(with_tracking);
	echo '</code>';
}
	
?>