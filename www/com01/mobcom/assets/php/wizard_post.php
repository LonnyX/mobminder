<?php

require('./geo_check.php');
require('./captcha_check.php');
require('./html_emails.php');
require('../../../contracting/assets/php/dbio.php');


$session = session_start();
$from = @$_SESSION['from']; if(isset($from)) $from = $from; else $from = 'not precised'; 
$cta = @$_GET['cta']; if(isset($cta)) $cta = $cta; else $cta = 'not precised';

//////////////////////////////////// Screen spamming ///////////////


if(!isset($_POST['mobile']) || !isset($_POST['email'])) die();
if($_POST['mobile']=='') die();
if($_POST['email']=='') die();




////////////////////////////////////////////////////////////////////////////////////////////////
//


$geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );


////////////////////////////////////////////////////////////////////////////////////////////////
//
// portal
//

// Clicked CTA btn

if($cta=='tp1m') $cta = 'Main page pro plan';
if($cta=='tp2m') $cta = 'Main page premium plan';
if($cta=='tp3m') $cta = 'Main page tailor-made plan';

if($cta=='onrf') $cta = 'Features page online-reservation';
if($cta=='elpf') $cta = 'Features page electronic payment';
if($cta=='comf') $cta = 'Features page communications & reminders';
if($cta=='shf') $cta = 'Features page shared agenda';
if($cta=='ergof') $cta = 'Features page ergonomic';
if($cta=='lastf') $cta = 'Features page last CTA';

if($cta=='prp') $cta = 'Mobminder pay page pre-payment';
if($cta=='qrp') $cta = 'Mobminder pay page QR-code';
if($cta=='smp') $cta = 'Mobminder pay page softpos';
if($cta=='terp') $cta = 'Mobminder pay page terminal';
if($cta=='tp1p') $cta = 'Mobminder pay page pro&pay plan';
if($cta=='tp2p') $cta = 'Mobminder pay page premium&pay plan';
if($cta=='tp3p') $cta = 'Mobminder pay page tailor-made plan';


// geotrack

$continent	= $geo->cont;		 // see geo_check.php
$country	= $geo->coun;		 // 
$region		= $geo->rnam;		 // 
$city		= $geo->city;		 // 
$phonecc	= $geo->phoneregion; // 
$language	= $geo->language;	 // 

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

$epay 		= $_POST['epay'];  // [qrfree!qrpayconiq!terminal!softpos!prepay]

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

$name = $fname.', '.$lname;

$communication = '';
	if(strpos($comm,'r')!==false) $communication .= '- reminder ';
	if(strpos($comm,'c')!==false) $communication .= '- confirmation ';
	if(strpos($comm,'v')!==false) $communication .= '- revival ';
	if(strpos($comm,'b')!==false) $communication .= '- birthday ';

$epayment = '';
	if(strpos($epay,'qrfree')!==false) $epayment .= '- free QR code ';
	if(strpos($epay,'qrpayconiq')!==false) $epayment .= '- payconiq QR code ';
	if(strpos($epay,'terminal')!==false) $epayment .= '- terminal hardpos ';
	if(strpos($epay,'softpos')!==false) $epayment .= '- terminal softpos ';
	if(strpos($epay,'prepay')!==false) $epayment .= '- prepayment ';


if($geo->prodserver) {
// if(1) {

	// Send info in contracting DB, leads table

	$ds = new C_dS_lead(0,1);
	$ds->firstname = $fname;
	$ds->lastname = $lname;
	$ds->phoneNr = $mobile;
	$ds->email = $email;
	$ds->companyname = $company;
	$ds->speciality = $special;

	// To define language in database, depends on selected language of user -> CONTRACTING (1 = en, 2 = fr, 3 = nl & 4 = es / default = 1)
	switch ($surflang) {
		case 'en':
			$lc = 1;
			# code...
			break;
		case 'fr':
			$lc = 2;
			break;
		case 'nl':
			$lc = 3;
			break;
		case 'es':
			$lc = 4;
			break;
		default:
			$lc = 1;
			# code...
			break;
	}
	
	$ds->language = $lc;
	

	$ds->dSsave();
	//print_r($ds);

	// then let's send an email to warn us

	$to = 'Jonathan Bardo<jonathan@mobminder.com>, Pascal Vanhove<pascal@mobminder.com>, Florence Claereboudt<florence@mobminder.com>';
	$reply_email = 'Jonathan Bardo<jonathan@mobminder.com>';

	$subject = 'WIZARD ALERT : '.$name.' ('.$pro.', '.$country.')';

	$msg = "From: ".$name." <".$email.">\n\nPhone: ".$mobile." (".$phonecc." from geocheck)"
			."\nWeb origin: ".$from
			."\nWebsite CTA: ".$cta
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

	$msg .= 'Wished payment solution(s): '.$epayment."\n";


	send_email($to, $subject, $msg, $reply_email);

	
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

	echo 'wished payment solution(s): '.$epay.chr(10);

	
	if($capok)
		echo 'Captcha answer is correct'.chr(10);
	else
		echo 'Captcha answer NOK'.chr(10);
		
}

function send_email($to, $subject, $msg, $reply_email) { 
	$headers = 	"Return-Path: website@mobminder.com\r\n".
	"From: Mobminder <communication@mobminder.com>\r\n".
	"X-Mailer: Mobminder/1.0\r\n".
	"Reply-To: $reply_email\r\n".
	"Organization: http://www.mobminder.com\r\n".
	"X-Priority: 3 (Normal)\r\n".
	"Mime-Version: 1.0\r\n".
	"Content-Type: text/plain; charset=UTF-8\r\n".
	"Content-Transfer-Encoding: 8bit\r\n";
	$status = mail($to, stripslashes($subject), stripslashes($msg), $headers);
}
	echo 'POST OK'.chr(10);

	include('./wizard_mail.php');
	$mail->send();


?>