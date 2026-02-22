<?php

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

require('../maillib.php');


$fname = 'Pascal';
$lname = ' Vanhove';
	
//$imageshost = getImageshost();

$logoTitle1 = '<a href="https://medinect.offimed.be" target="_blank"><img width="250" src="'.$imageshost.'/medinect-logo.png" alt="Mobminder" border="0" style="width:250px; max-width:250px; border:none;"></a>';
$logoTitle2 = '<a href="https://www.mobminder.com" target="_blank"><img width="250" src="'.$imageshost.'/mob-logo.png" alt="Mobminder" border="0" style="width:250px; max-width:250px; border:none;"></a>';
$signaturepic = '<img src="'.$imageshost.'/mediteam.jpeg" width="600" style="width:600px; max-width:600px; border:none; display:block;" alt="team-picture" border="0">';
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
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">
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
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Vous êtes un utilisateur fidèle de Medinect et nous souhaitons vous en remercier en proposant une nouvelle offre de valeur : un agenda en ligne synchronisé avec Medinect.
		Medinect a sélectionné pour vous un partenaire belge de confiance : Mobminder.
		</p>

		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Avec plus de 8000 utilisateurs actifs, nous sommes convaincus que cette nouvelle fonctionnalité d\'agenda en ligne répondra à vos besoins professionnels en vous permettant de gérer votre emploi du temps de manière plus efficace.
		</p>

		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Après ces 4 mois d’essai, un tarif préférentiel est applicable uniquement pour les utilisateurs Médinect. L’offre est limitée dans le temps. Elle est active pour les deux prochains mois. Nous vous encourageons donc à en profiter dès maintenant !
		</p>
	</td>			
</tr>
</table>';

// Summarized choices
//

$t3 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="top" style=" padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
		<p style="text-align:left; line-height:130%; font-weight:bold; color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Pour plus d’information, jetez un coup d’œil sur :</p>				
	</td>
</tr>
</table>';

// Second message
//

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; padding-bottom:20px; text-align: center;">
		<a rel="noopener" target="_blank" href="https://mobminder.com/fr/promomedinect.php?from=mailmedinect" style="background-color:'.$buttoncolor.'; font-size: 18px; font-weight: bold; text-decoration: none; padding: 14px 20px; color: white; border-radius: 5px; display: inline-block;">
    		<span>Découvrez l\'offre</span>
		</a>			
	</td>
</tr>
</table>';

$t5 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; text-align:left;">
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">Vous pouvez appeler le <a href="tel:+3228809787" style="text-decoration:none!important; color:'.$medcolor.'">+32 2 880 97 87 </a></p>
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
			<tr><td>'.$tt.$t1.$t2.$t3.$t4.$t5.$tphotosignature.'</td></tr></table>';
$center = '<center>'.$main.'</center>';
$html = $center;


///////////////////////////////////////////////////////////////////////////////////////////////////
sendMobinderMail('jonathan@mobminder.com','jonbardo@icloud.com,bspoden@gmail.com','Hello c\'est moi',$html,$bgcolormail)


?>