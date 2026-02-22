<?php
ob_start();

require '../classes/language.php';
$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e-RESA, authentication scenario
//
//  							    STAGE 1: We receive an email 
//                                            |            
//                                            | 
//                                            | 
//                                  Authenticate (if active option)
//                                            |  
//                                            |  
//                                            | 
//                                 STAGE 2: Identification 
//
//


$email 	= strtolower($_POST['email']);

$demo = $_SESSION['demo'];
if(!$email) die('no mail');

$language = $dS_login->language; // the default language for sending an email is the login language (because it defines the displayed language on the reservation page)
	// note that in case of registration, we do not know yet the visitor language
	// in case of recognition (logic here under), we will use the language of the known visitor

	
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
			
			echo $nl.'Sending token : '.'!'.$token.'!'.$nl;
			echo 'from:'.chr(9).$replyto.$nl;
			echo 'to:'.chr(9).$email.$nl;
			echo 'title:'.chr(9).$title.$nl;
			echo 'body:'.$nl.$body1.$nl.$body2.$nl.$body3.$nl.$body4.$nl.$body5.$nl;
			
		} else { // send a mail
			
			echo $nl.'Sending token';
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

closeconnection();
?>