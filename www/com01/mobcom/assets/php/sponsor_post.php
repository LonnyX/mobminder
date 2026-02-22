<?php

require('./geo_check.php');
require('./captcha_check.php');



//////////////////////////////////// Screen spamming ///////////////


if(!isset($_POST['mobile']) || !isset($_POST['email'])) die();
if($_POST['mobile']=='') die();
if($_POST['email']=='') die();


$session = session_start();
$from = @$_SESSION['from']; if(isset($from)) $from = $from; else $from = 'not precised'; 

////////////////////////////////////////////////////////////////////////////////////////////////
//


$geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );


////////////////////////////////////////////////////////////////////////////////////////////////
//
// portal
//

// geotrack

$continent	= $geo->cont;		 // see geo_check.php
$country	= $geo->coun;		 // 
$region		= $geo->rnam;		 // 
$city		= $geo->city;		 // 
$phonecc	= $geo->phoneregion; // 
$language	= $geo->language;	 // 

$frompage		= $_POST['pagename'];		// 

// surfer type in

$msg		= $_POST['msg'];		// 
$name		= $_POST['name'];		// 
$company	= $_POST['company'];	// 
$special	= $_POST['special'];	// 
$mobile		= $_POST['mobile'];		// 
$email		= $_POST['email'];		// 

// captcha
$caid		= $_POST['caid'];		// [ 0, ... 9 ], see captcha_check.php
$cach		= $_POST['cach'];		// [ 1, ... 5 ]
$calang		= $_POST['calang']; 	// [ fr, en, nl ]
$surflang	= $_POST['lang'];		// [ fr, en, nl ] // language as chosen by the surfer to read the website

// sponsor origin
$accountman		= $_POST['am'];		// [ 0, ... 9 ], see captcha_check.php
$client		    = $_POST['cl'];		// [ 1, ... 5 ]
$loginid		= $_POST['lid']; 	// [ fr, en, nl ]


$capok = captcha_check($caid, $cach);
$capdetail = '(id:'.$caid.'/choice:'.$cach.')';
$capresult = 'NOK '.$capdetail; if($capok) $capresult = 'OK '.$capdetail;



if($geo->prodserver) {
	
	// then let's send an email.

	$to = 'Jonathan Bardo<jonathan@mobminder.com>, Pascal Vanhove<pascal@mobminder.com>, Florence Claereboudt<florence@mobminder.com>';

	$subject = 'sponsorship message: '.$name.' ('.$special.', '.$company.', '.$country.')';

	$headers = 	"Return-Path: website@mobminder.com\r\n".
						"From: Mobminder <communication@mobminder.com>\r\n".
						"X-Mailer: Mobminder/1.0\r\n".
						"Reply-To: ".stripslashes($name)."<".$email.">\r\n".
						"Organization: http://www.mobminder.com\r\n".
						"X-Priority: 3 (Normal)\r\n".
						"Mime-Version: 1.0\r\n".
						"Content-Type: text/plain; charset=UTF-8\r\n".
						"Content-Transfer-Encoding: 8bit\r\n";

	
	$m = "Sponsored contact: ".$name." <".$email.">\nPhone: ".$mobile." (".$phonecc." from geocheck)"
            ."\n\nGiven by: ".$client
            ."\nLogin id: ".$loginid
            ."\nAccount manager: ".$accountman
			."\nWeb origin: ".$from
			."\n".$continent.", ".$country.", ".$region.", ".$city." (from geocheck)"
			."\n\nSurf language: ".$surflang.", geo language:".$language
			."\n\nCaptcha answer: ".$capresult
			."\n\n";
	$m .= "Message: \n\n";
	$m .= $msg."\n\n";
	$m .= "From web page: ".$frompage."\n\n";

	$status = mail($to, stripslashes($subject), stripslashes($m), $headers);	
	
	
} else {
	
	// then let's echo some data to the browser console
	echo 'from:'.$from.chr(10).chr(10);
	
	echo 'continent:'.$continent.chr(10);
	echo 'country:'.$country.chr(10);
	echo 'region:'.$region.chr(10);
	echo 'city:'.$city.chr(10);
	echo 'phonecc:'.$phonecc.chr(10);
	echo 'language:'.$language.chr(10).chr(10);;
		
}
    echo 'Message origin:'.chr(10);
    echo 'account manager:'.$accountman.chr(10);
    echo 'client name:'.$client.chr(10);
    echo 'client loginid:'.$loginid.chr(10).chr(10);

    echo 'Message:'.chr(10);
    echo 'msg:'.$msg.chr(10);
    echo 'name:'.$name.chr(10);
    echo 'company:'.$company.chr(10);
	echo 'speciality:'.$special.chr(10);
	echo 'mobile:'.$mobile.chr(10);
	echo 'email:'.$email.chr(10);
	echo 'surflang:'.$surflang.chr(10).chr(10);;

	echo 'frompage:'.$frompage.chr(10).chr(10);;

    echo 'Captcha:'.chr(10);
	echo 'caid:'.$caid.chr(10);
	echo 'cach:'.$cach.chr(10).chr(10);;
	
	if($capok)
		echo 'Captcha answer is correct'.chr(10);
	else
		echo 'Captcha answer NOK'.chr(10);



echo 'POST OK'.chr(10);


?>