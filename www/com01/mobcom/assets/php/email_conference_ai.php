<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N
//
// Dev & Test : http://localhost:8888/mobcom/assets/php/email_conference_ai.php
//
// Effective sending: https://mobminder.com/assets/php/email_conference_ai.php
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
function h1($t) { return '<h1 style="white-space:nowrap; font-weight:bold; font-size:1.4em;">'.$t.'</h1>'; }
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
$lname = ' Vanhove';

$imageshost;
$imageshost='https://mobminder.com/assets/imgs/emails';


$banneremail = '<a href="https://ia.mobminder.com" target="_blank"><img src="'.$imageshost.'/banner-conference-ai.jpg" width="600" border="0" style="width:600px; max-width:600px; border:none; display:block;" alt="Votre invitation à l\'événement"></a>';
$logoTitle1 = '<a href="https://medinect.offimed.be" target="_blank"><img width="150" src="'.$imageshost.'/logomedi.jpg" alt="Medinect" border="0" style="width:150px; max-width:150px; border:none;"></a>';
$logoTitle2 = '<a href="https://www.mobminder.com" target="_blank"><img width="150" src="'.$imageshost.'/logomob.jpg" alt="Mobminder" border="0" style="width:150px; max-width:150px; border:none;"></a>';
$logoTitle3 = '<a href="https://www.burogest.be" target="_blank"><img width="150" src="'.$imageshost.'/logoburo.jpg" alt="Burogest" border="0" style="width:150px; max-width:150px; border:none;"></a>';


// css for emails (!tricky!)
// 

$mobgreenW = '#BCDC45';
$mob_blueW = '#4477AA';
$medcolor = '#00568B';
$bgcolormail = 'white';
$txtcolormail = '#505050';
$buttoncolorbg = '#C3E24A';
$buttoncolortxt = '#012C42';



$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
	$font = 'font-family:Helvetica;font-size:18px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; border-radius: 1.5em; overflow: hidden; line-height:20px;'; //font-family:Arial; font-size:14px; border-radius WITH overflow: hidden are responsible for radius (compatibility: https://www.caniemail.com/features/css-border-radius/ )



/////// Main communication body 
//


// Top banner email
//

$tbanneremail = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="100%" style="vertical-align:bottom">
		<div style="overflow:hidden; padding-top:0px; padding-left:0em;">'.$banneremail.'</div>
	</td>
</tr>
</table>';


// Dear
//

$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">
			'.$fname.' '.$lname.',<br>Cher confrère,
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
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">J’ai le plaisir de vous inviter à une conférence sur ce sujet :
		</p>

		<p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start: 2em; margin-block-end: 2em; text-align: center; margin-top:30px;">L’intelligence artificielle dans le dossier médical : <br> état de l’art et défis. 
		</p>

        <p style="color:'.$medcolor.'; font-size:18px; margin-block-start: 1.2em; margin-block-end: 0.3em; font-weight:bold;">Lieu de la conférence
		</p>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: em;">Av. des dessus de Lives 2, 5101 Namur (Bugogest Office Park)
		</span><br/>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: 1em;"><a style="color:'.$medcolor.';" href="https://www.google.com/maps?rlz=1C5CHFA_enBE968BE968&gs_lcrp=EgZjaHJvbWUqDAgAEEUYOxjjAhiABDIMCAAQRRg7GOMCGIAEMgYIARBFGDsyDQgCEC4YrwEYxwEYgAQyBggDEEUYQDIGCAQQRRg7MgYIBRBFGDwyBggGEEUYPDIGCAcQRRg9qAIAsAIA&um=1&ie=UTF-8&fb=1&gl=be&sa=X&geocode=Kdt1GQovmcFHMf28PhXzWGOs&daddr=Av.+des+dessus+de+Lives+2,+5101+Namur" target="_blank">Itinéraire</a></span>

        <p style="color:'.$medcolor.'; font-size:18px; margin-block-start: 1.2em; margin-block-end: 0.3em; font-weight:bold;">Date et heure
		</p>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: 1em;">Le mardi 04 juin 2024 à partir de 19h00
		</span>

        <p style="color:'.$medcolor.'; font-size:18px; margin-block-start: 1.2em; margin-block-end: 0.3em; font-weight:bold;">Programme
		</p>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: 1em;">
        19h00 Accueil<br/>
        19H45 Début de la conférence<br/>
		Table ronde<br/>
        Apéritif VIP<br/>
        Walking dinner<br/>
		(PAF 19 euro)<br/>
		</span>
	</td>			
</tr>
</table>';

// Warning
//

$t3 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="top" style=" padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
		<p style="text-align:left; line-height:130%; font-weight:bold; color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Les inscriptions sont ouvertes jusqu’au 24 mai (places limitées), ne tardez pas! </p>				
	</td>
</tr>
</table>';

// CTA
//

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; padding-bottom:20px; text-align: center;">
		<a rel="noopener" target="_blank" href="https://ia.mobminder.com" style="background-color:'.$buttoncolorbg.'; font-size: 20px; font-weight: bold; text-decoration: none; padding: 15px 40px; color: white; border-radius: 5px; display: inline-block;">
    		<span style="color:'.$buttoncolortxt.';">Je m\'inscris</span>
		</a>			
	</td>
</tr>
</table>';

// Info
//

$t5 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; text-align:left;">
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Pour toute question, vous pouvez appeler le <a href="tel:+3228809787" style="text-decoration:none!important; color:'.$medcolor.'">+32 2 880 97 87 </a></p>
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Ou vous adresser à <a href="mailto:AI@mobminder.com" style="color:'.$medcolor.'; text-decoration:none;" target="_blank">AI@mobminder.com</a><br><br></p>
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 0em;">Cette conférence est rendue possible grâce aux contributions de:</p>
	</td>
</tr>
</table>';


// Partners' logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
		<div style="text-align:center;">'.$logoTitle1.'</div>
	</td>
	<td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
		<div style="text-align:center;">'.$logoTitle2.'</div>
	</td>
    <td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
        <div style="text-align:center;">'.$logoTitle3.'</div>
    </td>  
</tr>
</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tbanneremail.$t1.$t2.$t3.$t4.$t5.$tt.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


$example = '';
$html = $center;
$mail = new C_b64_email('jonathan@mobminder.com', 'Dr Briganti - Intelligence artificielle', $html, true, $bgcolormail);
	
	/////////////////// dev and test of the email
	
	$out .= warning('<strong>Not in Do mode, emails will not be sent. Use &do=1 to actually send emails</strong>');
	
	$example .= '<div style="margin-top:3em;">'.$mail->getSubject().'</div>';	
	
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:2em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
		'.$mail->getHtmlbody().'
		</div>
		<div style="height:5em;">&nbsp;</div>
		';
	$example .= $html;
	
	
	$example .= h1('Text version for this email: ' );
	$stripped = '<div style="margin-top:3em;"><textarea rows=24 style="width:100%;">'.$mail->stripoff($html).'</textarea><br/>&nbsp;</div>';
	$example .= $stripped;
	
$mail->sendMail('j-bardo@hotmail.com,jonbardo@icloud.com');


//////////////////////////////////////////////////////////////////////////////// 
//
//  ECHO OUTPUT 'pascal.vanhove@skynet.be','sensasis@live.be','j-bardo@hotmail.com, jonbardo@icloud.com'
//


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');

echo html($out, $example);

//$mail->send();
?>










