<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N
//
// Dev & Test : http://localhost:8888/mobcom/assets/php/conf_email_test.php
//
// Effective sending: https://mobminder.com/assets/php/conf_email_test.php
//
//
//

require('./html_emails.php');
require('./maillib.php');



//////////////////////////////////////////////////////
//
//  Echo functions
//
$allin = microtime(true);
$out = '';
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em; font-weight:bold;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function micro($msg) { return '<p style="color:blue; padding-left:3em; font-size:80%; line-height:70%;">'.$msg.'</p>'; }
function microtab($msg) { return '<p style="color:red; padding-left:6em; font-size:75%; line-height:70%;">'.$msg.'</p>'; }
function html($content, $example = '') {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="../css/basics.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body><div class="verbose">'.$content.'</div>'.$example.'</body></html>';
		return $o;
}
$out .= h1('mobminder email sender');



$out.= notice('HOST: |'.$host.'|');
$out.= notice('images host: |'.$imageshost.'|');
$out.= notice('Environment: '.$environment.'');



$do = false; if(isset($_GET['do'])) $do = !!$_GET['do'];











	


//////////////////////////////////////////////////////////////////////////////// 
//
//  send emails
//

$fname = 'Pascal';
$lname = ' Vanhove ';
$mainTitle = 'Confirmation de votre rendez-vous';
$day = 'Vendredi';
$date = '08/04/2023';
$time = '9:00';
$address = 'Rue du Pont 132, 1000 Bruxelles';
$mailtxt = 'Cher M. Vanhove, 
<br/><br/>
Tom & Co Bruxelles est heureux de vous confirmer votre RDV du '.$day.' '.$date.' à '.$time.'. 
<br/><br/>
Nous vous attendons avec votre animal de compagnie pour les soins suivants:
<br/>
Lavage d\'un grand chien.
<br/><br/>
IMPORTANT:
<br/><br/>
Veuillez vous présenter 10 minutes avant le rendez-vous
<br/><br/>
Tom & Co Bruxelles,
<br/>+32(0)10/11.11.11
<br/>www.tomandco.com';

$addressLink = '<a href="https://www.google.com/maps/place/Av.+Louise+149,+1050+Bruxelles,+Belgium/@50.8285519,4.3597878,17z/data=!3m1!4b1!4m5!3m4!1s0x47c3c48c9d2fd31f:0x7ddeefa9560fc23f!8m2!3d50.8285519!4d4.3619765" target="_blank" style="text-decoration: underline;">';
	
$imageshost;

$logoTitle = '<img height="150" src="'.$imageshost.'/moovia.png" alt="company-logo" border="0" style="border:none; height:150px; max-height:150px;"></img>';
$thumbup = '<img src="'.$imageshost.'/thumbup.png" width="75" style="width:75px; max-width:75px;" alt="cheers" border="0" style="border:none;"></img>';	
$checkedIcon = '<img src="'.$imageshost.'/checked.png" width="60" alt="place" border="0" style="border:none; width:60px; max-width:60px; overflow:hidden;">';	
$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
$linkMob  = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
$logoMobBottom = '<a href="https://www.mobminder.com?from=mailconfirmation" target="_blank"><img width="120" src="'.$imageshost.'/mob-logo.png" style="width:120px; max-width:120px;" alt="Mobminder" border="0" style="border:none;"></a>';
$mobIcon = '<img src="'.$imageshost.'/mob-icon.png" width="60" alt="place" border="0" style="width:60px; max-width:60px; border:none;"></img>';	





// css for emails (!tricky!)
// 

$titlecolormail = '#505050';
$bgcolormail = 'white';
$txtcolormail = '#505050';
$mob_blueW = '#4477AA';
$textcolorlighter = '#707070';

$fixoldhtmltablelook = 'color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
	$font = 'font-family:Helvetica;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; line-height:130%; overflow: hidden;'; //font-family:Arial; font-size:14px; 



/////// Main communication body 
//


// Top border with logo
//

$tt = '
<table '.$fixoldhtmltablelook.' align="center">
<tr>
	<td valign="top" align="center" style="text-align:center; padding-top:1em;">
		'.$logoTitle.'
	</td>
</tr>
</table>';

// Main title
//

$t1 = '
<table '.$fixoldhtmltablelook.' style="">
<tr>
	<td valign="bottom" style="text-align:left; padding-left:2.5em; padding-right:2.5em; padding-top:0em; padding-bottom:1em;">
		<h1 style="color:'.$titlecolormail.'; font-size:1.7em; line-height:120%; white-space:normal; font-weight:bold;">
			'.$mainTitle.'
		</h1>
	</td>
	<td valign="middle" align="center" style="text-align:center; vertical-align:middle; padding-top:0em;">
	'.$checkedIcon.'
</td>	
</tr>
</table>';




// Message
//

$t4 = '
<table '.$fixoldhtmltablelook.' style="margin-bottom:1.5em;">
<tr>
	<td style="padding-right:2em; padding-left:2.5em; padding-top:1.5em; padding-bottom:1.5em; background-color:#F0F0F0;">
        <p style="color:'.$txtcolormail.'; font-size:16px;">'.$mailtxt.'</p>
	</td>
</tr>
</table>';

// Footer
//

$tfooter = '
<table '.$fixoldhtmltablelook.' align="center" style="">
<tr>
	<td valign="middle" style=" padding-right:1.5em; padding-left:1.5em; padding-top:1em; text-align: center; line-height: 90%; background-color:white;">
		<span style="color:'.$textcolorlighter.'; font-size:12px;">Propulsé par www.mobminder.com | Agenda et Rappel de Rendez-vous par SMS et Email. Politique de confidentialité
        © 2006-2022 Mobminder is a trademark of Cloud-Tech Belgium.</span>	
        <div style="overflow:hidden; padding-top:1em; padding-bottom:1em; padding-left:0em; text-align: center;">'.$logoMobBottom.'</div>
	</td>
</tr>
</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t4.$tfooter.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


$example = '';
$html = $center;
$mail = new C_b64_email('jonathan@mobminder.com', 'Hello c\'est moi', $html, true, $bgcolormail);
	
	/////////////////// dev and test of the email
	
	$out .= warning('<strong>Not in Do mode, emails will not be sent. Use &do=1 to actually send emails</strong>');
	
	$example .= '<div style="margin-top:3em;">'.$mail->getSubject().'</div>';	
	
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:3em; padding-bottom:3em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
		'.$mail->getHtmlbody().'
		</div>
		<div style="height:5em;">&nbsp;</div>
		';
	$example .= $html;
	
	
	$example .= h1('Text version for this email: ' );
	$stripped = '<div style="margin-top:3em;"><textarea rows=24 style="width:100%;">'.$mail->stripoff($html).'</textarea><br/>&nbsp;</div>';
	$example .= $stripped;
	
$mail->sendMail('jonathan@mobminder.com');


//////////////////////////////////////////////////////////////////////////////// 
//
//  ECHO OUTPUT
//


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');

echo html($out, $example);

//$mail->send();
?>