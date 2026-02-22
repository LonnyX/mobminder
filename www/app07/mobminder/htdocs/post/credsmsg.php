<?php
////////////////////////////////////////////////////////////////////////////////////////////////
//
//     S E N D    C R E D E N T I A L S    C O P Y    T O   T H E    U S E R   L O G I N
//
//
//

$loadcontext = 1;	
require '../classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext() used in comm.php
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$medium 	= @$_POST['medium'];
$recepient 	= @$_POST['to'];
$login	 	= @$_POST['login'];
$pass 		= @$_POST['pass'];
$testmode = false;

if(!(isset($medium)&&isset($recepient)&&isset($login)&&isset($pass)))  { sleep(5); die('0!who are you?'); }


	$dSaccount = new C_dS_group($accountId);
	$dS_system = new C_dS_system();
	$SMSremainingCredit = $dS_account->todaySMSremains >= 0; // which is a boolean // see (*cr10*)
	$EMLremainingCredit = $dS_account->todayEMLremains >= 0; // which is a boolean
	

	$creditOK = false; // see (*cr10*)
	switch($medium) {  // (*mm00*)
		case 'sms': $creditOK = $SMSremainingCredit; break;
		case 'eml': $creditOK = $EMLremainingCredit; break;
	}
	$allowed = $dS_system->sendComm && $creditOK; // which is a boolean
	

if(1) { // set to 1 to test client side without sending messages all over the world :)
	switch($medium) {
		
		
		
		
		case 'sms':
		
		$shortcodegateaway = new C_mBlox_sms_http();
		
		$mobile = checkMobileFormat($recepient, $dS_account->phoneRegion);
		$sms = new C_dS_sms(0);
		
		$sms->groupId = $accountId;
		$sms->reservationId = 888;
		$sms->templateId = 10101010; // the template specifies if the message targets a visitor or a group resource
		$sms->resourceId = 20202020; // can be a visitor Id or a group resource Id depending on the message target
		$sms->sendStamp = C_date::getNow();
		$sms->text = $login.$nl.$nl.$pass;
		$sms->toNumber = $mobile;
		$sms->replyNumber = 'QuickSMS';
		$sms->dSsave(); // turns the Id positive (an SMS must have an id for the dataConnect_ to work with
		
	$perfReport->peak('::message is ready for sending to '.$mobile);
	
		if($allowed) $shortcodegateaway->sendOver($sms, 310);
		else echo 'SMS? Sorry guys...'.$nl;
		
	$perfReport->peak('::sendOver function complete');
		$sms->dSsave(); // sms status turned to "transmit" by $connect is recorded in DB, now the SMS is waiting for feedback from aggregator
		
	new Q('update groups set todaySMSremains = todaySMSremains-1 where id = '.$accountId.' and todaySMSremains >0; -- post/credsmsg.php');
	$perfReport->peak('::sms status saved');
	break;
		
		
		
		
		case 'eml': 

		// css for emails (!tricky!)
		// 

			$mobgreenW = '#BCDC45';
			$mob_blueW = '#4477AA';
			$medcolor = '#00568B';
			$bgcolormail = 'white';
			$txtcolormail = '#505050';
			$buttoncolorbg = '#C3E24A';
			$buttoncolortxt = '#012C42';
			$txtcolorwarning = 'red';

			$aname = $dSaccount->name;
				$region = $dSaccount->phoneRegion;
				$server = '';
			switch($region) {
				case 33: $server = 'fr'; break;
				default: $server = 'be';
			}
		$subject = $aname;

		$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="500"'; // Older Outlook email readers - padding in style="" are ok
			$font = 'font-family:Helvetica;font-size:18px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
		$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; border-radius: 1.5em; overflow: hidden; line-height:20px;'; //font-family:Arial; font-size:14px; border-radius WITH overflow: hidden are responsible for radius (compatibility: https://www.caniemail.com/features/css-border-radius/ )

			$imageshost='https://mobminder.com/assets/imgs/emails';
		$moblogo = '<a href="https://www.mobminder.com" target="_blank"><img width="150" src="'.$imageshost.'/logomob.jpg?v=2" alt="Mobminder" border="0" style="width:150px; max-width:200px; border:none;"></a>';

		$tt = '
		<table '.$fixoldhtmltablelook.'>
		<tr>
			<td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:0em;">
				<div style="text-align:center;">'.$moblogo.'</div>
			</td>
		</tr>
		</table>';
		
		// Main message 
		//
		$pstyle = 'font-size:18px; margin-block-start: 0em; margin-block-end: 1em; letter-spacing:.2em;';
		$tcreds = '
		<table '.$fixoldhtmltablelook.'>
		<tr>
			<td style="padding-left:2.5em; padding-right:2.5em;">
				<p style="color:'.$txtcolormail.'; '.$pstyle.'">'.$login.'</p>
				<p style="color:'.$txtcolormail.'; '.$pstyle.'">'.$pass.'</p>
				<p style="color:'.$mob_blueW.'; '.$pstyle.'"><a style="color:'.$medcolor.';" href="https://'.$server.'.mobminder.com" target="_blank">'.$server.'.mobminder.com</a></p>
			</td>			
		</tr>
		</table>';

		$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'"><tr><td>'.$tt.$tcreds.'
</td></tr></table>';

		$html = '<center>
'.$main.'
</center>';

			
		if(!$testmode) {
			$replyto = 'alert@mobminder.com';
			$emailgateaway = new C_b64_email($replyto, '', '');
			if($allowed) $emailgateaway->sendMail($recepient, 0, $replyto, $subject, $html);
			else echo 'Eml? Sorry guys...'.$nl;
		}
		else {
			echo $subject.$nl; // testmode display
			echo $html.$nl; // testmode display
		}
	new Q('update groups set todayEMLremains = todayEMLremains-1 where id = '.$accountId.' and todayEMLremains >0; -- post/credsmsg.php');
	$perfReport->peak('::email status saved');
	break;
	}
}

$perfReport->peak('::completed');
sleep(2);
$perfReport->dropReport();
?>