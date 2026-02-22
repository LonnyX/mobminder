<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	M A I L    I N V I T E
//
//
//
//

require('../assets/php/_set_dev_prod.php'); // Create the path to pick the images in dev or prod
require('../assets/php/maillib.php');
unset($_SESSION['loginId']);
require('../assets/php/dbio.php');

//////////////////////////////////////////////////////
//
//  Echo functions
//

$out = '';

function subject($msg) { return '<p style="color:rgba(10,30,15,0.7); font-size:1em;">'.$msg.'</p>'; }
function explain($msg) { return '<p style="color:orange; font-size:1em;">'.$msg.'</p>'; }

$webmode = 0; if(isset($_GET['web'])) if($_GET['web']=='1') $webmode = 1; //when webmode = 1 , no email is sent, when webmode = 0, an email will be send to leadid email
$recpt = 0; if(isset($_GET['recpt'])) $recpt = $_GET['recpt']; //when recpt=ghi or a combinaison of those letters, an email will be send to known emails
$leadid = 1; if(isset($_POST['leadid'])) $leadid = $_POST['leadid'];

$dS_lead = new C_dS_lead($leadid);
$lname = $dS_lead->lastname; //Lead's last name
$accmid = $dS_lead->accountm; //Lead's account manager
$leademail = $dS_lead->email; //Lead's email address


$dS_user = new C_dS_users($accmid);
$accpicname = $dS_user->firstname.'.png'; //Account manager's picture
$accfirstname = $dS_user->firstname; //Account manager's firstname
$acclastname = $dS_user->lastname; //Account manager's lastname
$accmobile = $dS_user->mobile; //Account manager's mobile
$accemail = $dS_user->email; //Account manager's email


$q = new Q('select id from contracts where leadid = '.$dS_lead->id.' order by created desc limit 1;');
$contractid = $q->ids(list_as_string);

$dS_contract = new C_dS_contract($contractid);
$accode = $dS_contract->accessCode; //Future customer's token (accesscode)
$courtesy = $dS_contract->invCourtesy; //Lead's civility, retrieved from contract filled in by the account manager: M, Mme, Dr or Me
$tncourtesy = $courtesy.'_title'; // will be used as technical names to display the right translation according to the lang


//----------------------------- 

$imageshost;

$moblogo = '<a href="https://www.mobminder.com" target="_blank"><img width="300" src="'.$imageshost.'/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;"></a>';
$signaturepic = '<img src="'.$imageshost.'/'.$accpicname.'" width="200" style="width:200px; max-width:200px; border:none; display:block;" alt="team-picture" border="0">';
$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
$linkMob  = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
$logoMobBottom = '<a href="https://www.mobminder.com" target="_blank"><img width="180" src="'.$imageshost.'/mob-logo.png" style="width:180px; max-width:180px;" alt="Mobminder" border="0" style="border:none;"></a>';

// css for emails (!tricky!)
// 

$mobgreenW = '#BCDC45'; 
$mob_blueW = '#4477AA';
$medcolor = '#0F64AA';
$bgcolormail = '#F5F5F7';
$txtcolormail = '#505050';
$buttoncolor = '#0F64AA';


$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
	$font = 'font-family:Helvetica;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; border-radius: 1.5em; overflow: hidden; line-height:20px;'; //font-family:Arial; font-size:14px; border-radius WITH overflow: hidden are responsible for radius (compatibility: https://www.caniemail.com/features/css-border-radius/ )

$subject = X('subject') ;

/////// Main communication body 
//


// Top border with logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="100%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$moblogo.'</div>
	</td>
</tr>
</table>';

// Main title
//


$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start: 1em; margin-block-end: 1em;">
            '.X($tncourtesy).' '.$lname.',		
        </p>
	</td>
</tr>
</table>';

// Main message 
//

$t2 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('intro').'

        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
			<li>'.X('step1').'<span style="color:'.$medcolor.'; font-weight:bold;">'.$accode.'</span></li><br>
			<li>'.X('step2').'</li><br>
			<li>'.X('step3').'</li><br>			
			<li>'.X('step4').'</li><br>
			<li>'.X('step5').'</li>
		</ul>	
	</td>			
</tr>
</table>';


// Second message
//

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; padding-bottom:20px; text-align: center;">
		<a rel="noopener" target="_blank" href="https://contracting.mobminder.com/'.$l.'/contracting.php?id='.$leadid.'" style="background-color:'.$buttoncolor.'; font-size: 18px; font-weight: bold; text-decoration: none; padding: 14px 20px; color: white; border-radius: 5px; display: inline-block;">
    		<span>'.X('caption_btn').'</span>
		</a>			
	</td>
</tr>
</table>';

$t5 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:15px; text-align:left;">
        <p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('pre_signature').'</p>
	</td>
</tr>
</table>';

// Signature
//

$tsignature = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="vertical-align:bottom">
		<div style="overflow:hidden; padding-top:0em; padding-left:1em;">'.$signaturepic.'</div>
	</td>
	<td valign="middle" style=" padding-right:1.5em; padding-left:0em; padding-top:0em;">
		<span style="color:'.$medcolor.'; font-weight:bold;font-size:13pt;">'.$accfirstname. ' '.$acclastname.'<br></span>
		<span style="color:'.$txtcolormail.';">'.X('title_signature').'</span><br>
		<a href="mailto:'.$accemail.'" style="color:'.$txtcolormail.'; text-decoration:none;" target="_blank"></span style="color:'.$txtcolormail.';">'.$accemail.'</span></a><br>
		<a href="tel:'.$accmobile.'" style="text-decoration:none!important; color:'.$txtcolormail.'">'.$accmobile.'</a><br>
		<div style="text-align:left; padding-top:20px;">'.$logoMobBottom.'</div>
	</td>
</tr>
</table>';


/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.$t4.$t5.$tsignature.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


//-----------------------------


if($webmode=='1') 
{

//////////////////////////////////////////////////////
//
//  Mode display html
//


function html($content, $example = '') {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="../assets/css/translation.css" rel="stylesheet" type="text/css">';
            $o .= '<script src="../assets/js/jquery-3.2.1.js"></script>';
            $o .= '<script src="../assets/js/moblib.js"></script>';     
            $o .= '<script src="../assets/js/xlate.js"></script>';
			$o .= '<head>';
			$o .= '<body><div class="verbose" style="padding:10px 100px;">'.$content.'</div>'.$example.'</body></html>';
		return $o;
}


$example = '';
$html = $center;	
	/////////////////// dev and test of the email


	$out .= subject('<strong>Mail subject: </strong>');
	$out .= subject($subject);
	$out .= explain('Use web=1 to display an example of an email<br>Use recpt=ghi or a combination of g or/and h or/and i to send a test email to jonathan@mobminder.com, j-bardo@hotmail.com, jonbardo@icloud.com');

    $example ='<div style="padding-top:0em;"'.$bgcolormail.'; color:'.$medcolor.';"'.$example.'</div>';
	
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:2em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
		'.$html.'
		</div>
		<div style="height:5em;">&nbsp;</div>
		';
	$example .= $html;


	echo html($out, $example);

	if($recpt) { // In production, send email to test the rendering

		if(strpos($recpt,'g')!==false) {
			$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
			$mail->sendMail('jonathan@mobminder.com');
		}

		if(strpos($recpt,'h')!==false) {
			$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
			$mail->sendMail('j-bardo@hotmail.com');
		}
		if(strpos($recpt,'i')!==false) {
			$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
			$mail->sendMail('jonbardo@icloud.com');
		}
	}


}

else { //not in a webmode
    
//////////////////////////////////////////////////////////////////////////////// 
//
//  send email in production environment
//

$addressee = $leademail;
// $addressee = 'jonathan@mobminder.com';

$html = $center;
$mail = new C_b64_email($accemail, $subject, $html, true, $bgcolormail);
$mail->sendMail($addressee);


}



?>