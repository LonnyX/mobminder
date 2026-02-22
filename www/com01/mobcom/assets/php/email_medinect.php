<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N
//
// Dev & Test : http://localhost:8888/mobcom/assets/php/email_medinect.php
//
// Effective sending: https://mobminder.com/assets/php/email_medinect.php
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

$fname = 'Jonathan';
$lname = ' Bardo';
	
$imageshost;

$logoTitle1 = '<a href="https://medinect.offimed.be" target="_blank"><img width="150" src="'.$imageshost.'/logomedi.jpg" alt="Logo Medinect" border="0" style="width:150px; max-width:250px; border:none;"></a>';
$logoTitle2 = '<a href="https://www.mobminder.com" target="_blank"><img width="150" src="'.$imageshost.'/logomob.jpg" alt="Logo Mobminder" border="0" style="width:150px; max-width:250px; border:none;"></a>';
$signaturepic = '<img src="'.$imageshost.'/team-medinect.png" width="600" style="width:600px; max-width:600px; border:none; display:block;" alt="team-picture" border="0">';
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



/////// Main communication body 
//


// Top border with logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="50%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$logoTitle1.'</div>
	</td>
	<td valign="middle" width="50%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$logoTitle2.'</div>
	</td>
</tr>
</table>';

// Main title
//

$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">
			'.$fname.' '.$lname.',<br>Cher utilisateur,<br>Cher confrère,
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
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">En tant qu’utilisateur de Medinect, vous bénéficiez d’un avantage exclusif sur Mobminder, l’agenda médical professionnel belge, partenaire de Medinect depuis 2018.
		</p>

		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Nous avons négocié pour vous un tarif préférentiel de 39 €/mois HTVA (au lieu de 59 €) ainsi que 4 mois d’utilisation offerts au démarrage.
		</p>

		<p style="color:'.$medcolor.'; font-weight:bold; font-size:18px; margin-block-start: 2em; margin-block-end: 2em; text-align: center; margin-top:30px;">Mobminder se distingue par plusieurs atouts appréciés des praticiens :
		</p>

        <ul style="padding-left:1em; margin-block-start:0.2em; color:'.$txtcolormail.'; font-size:16px;">
			<li style="margin-bottom:0.5em;">Synchronisation de votre agenda avec Medinect.</li>
			<li style="margin-bottom:0.5em;">Accompagnement personnalisé : une personne de contact dédiée pour la mise en place, la formation et le suivi.</li>
			<li style="margin-bottom:0.5em;">Démarrage facile : Mobminder s’adapte à vos habitudes de travail.</li>			
			<li style="margin-bottom:0.5em;">Envoi automatique de SMS de rappel et d’emails personnalisés.</li>
			<li style="margin-bottom:0.5em;">Prise de rendez-vous en ligne pour vos patients.</li>
			<li style="margin-bottom:0.5em;">Entreprise belge reconnue pour son service de qualité avec plus de 7000 utilisateurs professionnels.</li>
		</ul>
	</td>			
</tr>
</table>';


// Second message
//

$t3 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; padding-bottom:20px; text-align: center;">
		<a rel="noopener" target="_blank" href="https://mobminder.com/fr/offremedinect.php?from=mailmedinect" style="background-color:'.$buttoncolor.'; font-size: 18px; font-weight: bold; text-decoration: none; padding: 14px 20px; color: white; border-radius: 5px; display: inline-block;">
    		<span>Découvrez l\'offre</span>
		</a>			
	</td>
</tr>
</table>';

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; text-align:left;">
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Intéressé par une démonstration sans engagement ? Vous pouvez appeler le <a href="tel:+3228809787" style="text-decoration:none!important; color:'.$medcolor.'">+32 2 880 97 87 </a></p>
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Ou vous adresser à <a href="mailto:jonathan@mobminder.com" style="color:'.$medcolor.'; text-decoration:none;" target="_blank">jonathan@mobminder.com</a><br><br></p>
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Cordialement,<br>L\'équipe Medinect </p>
	</td>
</tr>
</table>';


// Signature
//

$tphotosignature = '
<table '.$fixoldhtmltablelook.'>
<tr>

	<td valign="middle" style="vertical-align:bottom">
		<div style="overflow:hidden; padding-top:50px; padding-left:0em;">'.$signaturepic.'</div>
	</td>
</tr>
</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.$t3.$t4.$tphotosignature.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


$example = '';
$html = $center;
$mail = new C_b64_email('jonathan@mobminder.com', 'Merci pour votre confiance : avantage exclusif Medinect', $html, true, $bgcolormail);
	
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
	
$mail->sendMail('jonbardo@icloud.com');


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