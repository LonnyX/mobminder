<?php

require('../maillib.php');
require('../../captcha_check.php');
//require('./geo_check.php');
//require('./html_emails.php');

$mobgreenW = '#BCDC45'; 
$mob_blueW = '#4477AA';
$titlecolormail = '#4477AA';
$bgcolormail = '#F5F5F7';//'#F3F9DF';
$txtcolormail = '#505050';
$textcolorlighter = '#707070';


$session = session_start();
$from = @$_SESSION['from']; if(isset($from)) $from = $from; else $from = 'not precised'; 

$web = false; if(isset($_GET['web'])) $web = !!$_GET['web'];

if (!$web) //send emails
{
	//////////////////////////////////// Screen spamming ///////////////
	if(!isset($_POST['mobile']) || !isset($_POST['email'])) die();
	if($_POST['mobile']=='') die();
	if($_POST['email']=='') die();

	////////////////////////////////////////////////////////////////////////////////////////////////
	//


	// $geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );


	////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// portal
	//

	// geotrack

	$continent	= 'na'; // $geo->cont;		 // see geo_check.php
	$country	= 'na'; // $geo->coun;		 // 
	$region		= 'na'; // $geo->rnam;		 // 
	$city		= 'na'; // $geo->city;		 // 
	$phonecc	= 'na'; // $geo->phoneregion; // 
	$language	= 'na'; // $geo->language;	 // 

	$pro		= $_POST['pro'];		// [ medical, freelance, medgroup, dental, industry, wellness ]
	$slice		= $_POST['slice'];		// [5, 10, 15, 20, 30, 60]
	$current	= $_POST['current'];	// [ paper, electronic ]
	$multi		= $_POST['ismulti'];	// [ single, ismulti ]
	$howmany	= $_POST['howmany'];	// [ x, 2, 3, 4, 6, 8, 10, 12, 16, 20 ]

	$fname		= $_POST['fname'];		// INPUT_ALPHA max 32 chars
	$lname		= $_POST['lname'];		// INPUT_ALPHA max 32 chars
	$company	= $_POST['company'];	// INPUT_ALPHA max 32 chars
	$special	= $_POST['special'];	// speciality, INPUT_ALPHA max 32 chars
	$mobile		= $_POST['mobile'];		// INPUT_MOBILE +32493655599
	$email		= $_POST['email'];		// INPUT_EMAIL, p@v.com

	$eresa		= $_POST['eresayesno'];	// [yes,no]
	$ownweb		= $_POST['haswebyesno'];// [yes,no]
	$url		= $_POST['webname'];	// www.domain.be

	$comm		= $_POST['comm'];		// [r!c!v!b] reminder, confirmation, revival, birthday
	$live		= $_POST['live'];		// [yes,no]

	$singdel	= $_POST['singdel'];		// [ assitant, callcenter, nope ]
	$comanaged	= $_POST['comanaged'];		// [ assitants, callcenter, nope, amongus ]

	$surflang	= $_POST['lang'];		// [ fr, en, nl ] // language as chosen by the surfer


	// captcha
	$caid		= $_POST['caid'];		// [ 0, ... 9 ], see captcha_check.php
	$cach		= $_POST['cach'];		// [ 1, ... 5 ]
	$calang		= $_POST['calang']; 	// [ fr, en, nl ]
	$surflang	= $_POST['lang'];		// [ fr, en, nl ] // language as chosen by the surfer to read the website
	$l = $surflang;


	$capok = captcha_check($caid, $cach);
	$capdetail = '(id:'.$caid.'/choice:'.$cach.')';
	$capresult = 'NOK '.$capdetail; if($capok) $capresult = 'OK '.$capdetail;


}
else //display in web page
{
	$continent	= 'na'; // $geo->cont;		 // see geo_check.php
	$country	= 'na'; // $geo->coun;		 // 
	$region		= 'na'; // $geo->rnam;		 // 
	$city		= 'na'; // $geo->city;		 // 
	$phonecc	= 'na'; // $geo->phoneregion; // 
	$language	= 'na'; // $geo->language;	 // 

	$pro		= 'medical';		// [ medical, freelance, medgroup, dental, industry, wellness ]
	$slice		= '5';		// [5, 10, 15, 20, 30, 60]
	$current	= 'paper';	// [ paper, electronic ]
	$multi		= 'single';	// [ single, ismulti ]
	$howmany	= '2';	// [ x, 2, 3, 4, 6, 8, 10, 12, 16, 20 ]

	$fname		= 'James';		// INPUT_ALPHA max 32 chars
	$lname		= 'Bond';	// INPUT_ALPHA max 32 chars
	$company	= 'MI6';	// INPUT_ALPHA max 32 chars
	$special	= 'agent';	// speciality, INPUT_ALPHA max 32 chars
	$mobile		= '+32472017763';		// INPUT_MOBILE +32493655599
	$email		= 'james.bond@mi6.uk';	// INPUT_EMAIL, p@v.com

	$eresa		= 'no';	// [yes,no]
	$ownweb		= 'no';// [yes,no]
	$url		= 'www.mi6.com';	// www.domain.be

	$comm		= 'c';		// [r!c!v!b] reminder, confirmation, revival, birthday
	$live		= 'no';		// [yes,no]

	$singdel	= 'assistant';		// [ assitant, callcenter, nope ]
	$comanaged	= 'assitants';		// [ assitants, callcenter, nope, amongus ]

	$surflang	= 'en';		// [ fr, en, nl ] // language as chosen by the surfer


	// captcha
	$caid		= '0';	// [ 0, ... 9 ], see captcha_check.php
	$cach		= '1';		// [ 1, ... 5 ]
	$calang		= 'fr';	// [ fr, en, nl ]
	$surflang	= 'fr';		// [ fr, en, nl ] // language as chosen by the surfer to read the website
	$l = $surflang;

	//$capok = captcha_check($caid, $cach);
	$capdetail = '(id:'.$caid.'/choice:'.$cach.')';
	$capresult = 'OK ';



}


$name = $fname.', '.$lname;

$communication = '';
	if(strpos($comm,'r')!==false) $communication .= 'reminder ';
	if(strpos($comm,'c')!==false) $communication .= 'confirmation ';
	if(strpos($comm,'v')!==false) $communication .= 'revival ';
	if(strpos($comm,'b')!==false) $communication .= 'birthday ';
//echo $communication."<br/>";

///////////////////////////////////////////////////////////////////////////////////////////////
// internal mail
///////////////////////////////////////////////////////////////////////////////////////////////


// if($geo->prodserver) {
if(1) {
	
	// then let's send an email to warn us

	$to = 'Jonathan Bardo<jonathan@mobminder.com>, Pascal Vanhove<pascal@mobminder.com>';
	$reply_email = 'Jonathan Bardo<jonathan@mobminder.com>';

	$subject = 'WIZARD ALERT : '.$name.' ('.$pro.', '.$country.')';

	$msg = "From: ".$name." <".$email.">\n\nPhone: ".$mobile." (".$phonecc." from geocheck)"
			."\nWeb origin: ".$from
			."\n".$continent.", ".$country.", ".$region.", ".$city." (from geocheck)"
			."\nSurf language: ".$surflang.", geocheck language: ".$language
			."\n\nCaptcha answer: ".$capresult
			."\n\n";

	$msg .= 'Prof sector: '.$pro."\n";
	$msg .= 'Name: '.$name."\n";
	$msg .= 'Speciality: '.$special."\n";
	$msg .= 'Company: '.$company."\n";
	$msg .= 'Mobile: '.$mobile."\n";
	$msg .= 'Email: '.$email."\n\n";

	$msg .= 'e-reservation: '.$eresa."\n";
		if($eresa=='yes') $msg .= '     Has own website: '.$ownweb."\n";
		if($eresa=='yes') $msg .= '     Web url: '.$url."\n";

	$msg .= "\n";
	$msg .= 'Current agenda type: '.$current."\n";
	$msg .= 'time slice: '.($slice)."min \n";
	$msg .= 'Multiagenda: '.$multi."\n";
	if($multi=='ismulti') $msg .= '    Number of agendas: '.$howmany."\n";
	
		
	$msg .= "\n";
	$msg .= 'Wished communication: '.$communication."\n";
	$msg .= 'Live agenda: '.$live."\n";
	
	$msg .= "\n";
	if($multi=='single') $msg .= 'Single delegation: '.$singdel."\n";
		else $msg .= 'Multi delegation: '.$comanaged."\n";

	sendMobinderMail($reply_email,$to,$subject,$msg,$bgcolormail);

} else {
	
	// then let's echo some data to the browser console
	echo 'from:'.$from.chr(10).chr(10);
	
	echo 'continent: '.$continent.chr(10);
	echo 'country: '.$country.chr(10);
	echo 'region: '.$region.chr(10);
	echo 'city: '.$city.chr(10);
	echo 'phonecc: '.$phonecc.chr(10);
	echo 'language: '.$language.chr(10);

	echo 'pro sector: '.$pro.chr(10);
	echo 'name: '.$name.chr(10);
	echo 'company: '.$company.chr(10);
	echo 'speciality: '.$special.chr(10);
	echo 'mobile: '.$mobile.chr(10);
	echo 'email: '.$email.chr(10);
	echo 'surflang: '.$surflang.chr(10);

	echo 'eresayesno: '.$eresa.chr(10);
	echo 'haswebyesno: '.$ownweb.chr(10);
	echo 'webname: '.$url.chr(10);
	
	echo 'email: '.$email.chr(10);
	echo 'surflang: '.$surflang.chr(10);


	echo 'current techno: '.$current.chr(10);
	echo 'multi: '.$multi.chr(10);
	echo 'number of agendas: '.$howmany.chr(10);
	echo 'time slice: '.$slice.chr(10);
	echo 'wished communication: '.$comm.chr(10);
	echo 'live agenda: '.$live.chr(10);
	
	echo 'single delegation: '.$singdel.chr(10);
	echo 'multi delegation: '.$comanaged.chr(10);
	
	if($capok)
		echo 'Captcha answer is correct'.chr(10);
	else
		echo 'Captcha answer NOK'.chr(10);
		
}

echo 'POST INTERNAL MAIL = OK'.chr(10);

////////////////////////////////////////////////////////////////////////////////////////////////
// customer mail
////////////////////////////////////////////////////////////////////////////////////////////////

	
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


$pro = X('pro_summary_'.$pro,'wizard');
if($howmany=='x') $howmany = X('wz_ismulti_tip_single','wizard');
else $howmany = $howmany.' '.X('howmany_agendas','wizard');
$slice = X('timeslice_tip_'.$slice,'wizard');
$comm = ucfirst(implode(' - ',$communication)).'.';
$eresa = X('eresa_summary_'.$eresa, 'wizard');
$live = X('live_summary_'.$live, 'wizard');


// css for emails (!tricky!)
// 


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
$html = $center;

sendMobinderMail('jonathan@mobminder.com','jonathan@mobminder.com,'.$email,X('subject_wizard', 'emails'),$html,$bgcolormail)


?>