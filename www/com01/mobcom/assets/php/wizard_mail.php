<?php

//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N    H T M L 
//

	
$imageshost;

$logoTitle = '<a href="https://www.mobminder.com" target="_blank"><img width="300" src="'.$imageshost.'/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;"></a>';
$thumbup = '<img src="'.$imageshost.'/thumbup.png" width="75" alt="cheers" border="0" style="width:75px; max-width:75px; border:none;">';	
$signaturepic = '<img src="'.$imageshost.'/jonathan.png" width="200" style="width:200px; max-width:200px; border:none; display:block;" alt="team-picture" border="0">';
$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
$linkMob  = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
$logoMobBottom = '<a href="https://www.mobminder.com" target="_blank"><img width="180" src="'.$imageshost.'/mob-logo.png" style="width:180px; max-width:180px;" alt="Mobminder" border="0" style="border:none;"></a>';


// Needed translations for the email
// 

$communication = Array();
if(strpos($comm,'r')!==false) $communication[] = X('comm_summary_r', 'wizard');
if(strpos($comm,'c')!==false) $communication[] = X('comm_summary_c', 'wizard');
if(strpos($comm,'v')!==false) $communication[] = X('comm_summary_v', 'wizard');
if(strpos($comm,'b')!==false) $communication[] = X('comm_summary_b', 'wizard');

$epayment = Array();
if(strpos($epay,'qrfree')!==false) $epayment[] = X('pay_qrfree','wizard');
if(strpos($epay,'qrpayconiq')!==false) $epayment[] = X('pay_qrpayconiq','wizard');
if(strpos($epay,'terminal')!==false) $epayment[] = X('pay_hardpos', 'wizard');
if(strpos($epay,'softpos')!==false) $epayment[] = X('pay_softpos', 'wizard');
if(strpos($epay,'prepay')!==false) $epayment[] = X('pay_prepay', 'wizard');


$pro = X('pro_summary_'.$pro,'wizard');
if($howmany=='x') $howmany = X('wz_ismulti_tip_single','wizard');
else $howmany = $howmany.' '.X('howmany_agendas','wizard');
$slice = X('timeslice_tip_'.$slice,'wizard');
$comm = ucfirst(implode(' - ',$communication)).'.';
$eresa = X('eresa_summary_'.$eresa, 'wizard');
$live = X('live_summary_'.$live, 'wizard');
$epay = ucfirst(implode(' - ',$epayment)).'.';



// css for emails (!tricky!)
// 

$mobgreenW = '#BCDC45'; 
$mob_blueW = '#4477AA';
$titlecolormail = '#4477AA';
$bgcolormail = '#F5F5F7';//'#F3F9DF';
$txtcolormail = '#505050';
$textcolorlighter = '#707070';


$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
	$font = 'font-family:Helvetica;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; border-radius: 1.5em; overflow: hidden;'; //font-family:Arial; font-size:14px; border-radius WITH overflow: hidden are responsible for radius (compatibility: https://www.caniemail.com/features/css-border-radius/ )


/////// Main communication body 
//


// Top border with logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="top" width="50%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$logoTitle.'</div>
	</td>
</tr>
</table>';

// Main title
//

$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
		<h1 style="color:'.$titlecolormail.'; font-size:1.7em; line-height:120%; font-weight:bold; white-space:normal; margin-block-start: 0.67em; margin-block-end: 0.67em;">
			'.X('thank_you', 'emails').' '.$fname.' '.$lname.'<br>'.X('we_prepare', 'emails').'
		</h1>
	</td>
</tr>
</table>';

// Main message 
//

$t2 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
		<p style="font-weight:bold; color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('main_msg_wizard', 'emails').'</p>
	</td>			
</tr>
</table>';

// Summarized choices
//

$t3 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-right:2em; padding-left:2.5em; padding-top:0em;">
		<p style="margin-block-end:0em; color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('options_reminder', 'emails').':</p>
		<ul style="padding-left:3em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px;">
			<li>'.$pro.'</li>
			<li>'.$howmany.' </li>
			<li>'.$slice.' </li>			
			<li>'.$comm.'</li>
			<li>'.$eresa.'</li>
			<li>'.$live.'</li>
			<li>'.$epay.'</li>
		</ul>			
	</td>
	<td align="right" valign="top" style="vertical-align:top; text-align:right;">
		'.$thumbup.'
	</td>	
</tr>
</table>';

// Second message
//

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="top" style=" padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
		<p style="text-align:left; line-height:130%; font-weight:bold; color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('contact_now', 'emails').'</p>				
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
		<span style="color:'.$mob_blueW.'; font-weight:bold;font-size:13pt;">Jonathan Bardo<br></span>
		<span style="color:'.$textcolorlighter.';">'.X('title_signature', 'emails').'<br></span>
		<a href="mailto:jonathan@mobminder.com" style="color:'.$textcolorlighter.'; text-decoration:none;" target="_blank"></span style="color:'.$txtcolormail.';">jonathan@mobminder.com</span></a><br>
		<a href="tel:+32472017763" style="text-decoration:none!important; color:'.$textcolorlighter.'">+32 472 01 77 63</a><br>
		<div style="text-align:left; padding-top:20px;">'.$logoMobBottom.'</div>
	</td>
</tr>
</table>';




/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.$t3.$t4.$tsignature.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


$example = '';
$html = $center;
$mail = new C_email('jonathan@mobminder.com,'.$email, 'jonathan@mobminder.com', X('subject_wizard', 'emails'), $html, $bgcolormail);


?>