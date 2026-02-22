<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I Z A R D     C O N F I R M A T I O N
//
// Dev & Test : http://http://localhost:8888/mobcom/assets/php/email_test.php
//
// Effective sending: https://mobminder.com/assets/php/email_test.php
//
//
//

require('./html_emails.php');


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


$pro		= 'dental';		// [ medical, freelance, medgroup, dental, industry, wellness ]
$slice		= '60';		// [5, 10, 15, 20, 30, 60]
$current	= 'paper';	// [ paper, electronic ]
$multi		= 'ismulti';	// [ single, ismulti ]
$howmany	= 'x';	// [ x, 2, 3, 4, 6, 8, 10, 12, 16, 20 ]

$fname		= 'Jonathan';	// INPUT_ALPHA max 32 chars
$lname		= 'Bardo';		// INPUT_ALPHA max 32 chars
$company	= 'Cloudtech';	// INPUT_ALPHA max 32 chars
$special	= 'SAAS';	// speciality, INPUT_ALPHA max 32 chars
$mobile		= '+32493655599';		// INPUT_MOBILE +32493655599
$email		= 'p@v.com';		// INPUT_EMAIL, p@v.com

$eresa		= 'no';	// [yes,no]
$ownweb		= 'no'; // [yes,no]
$url		= 'www.domain.be';	// www.domain.be

$comm		= 'r!v!b';		// [r!c!v!b] reminder, confirmation, revival, birthday
$live		= 'no';		// [yes,no]

$singdel	= 'assitant';		// [ assitant, callcenter, nope ]
$comanaged	= 'assitants';		// [ assitants, callcenter, nope, amongus ]

$surflang	= 'nl';		// [ fr, en, nl ] // language as chosen by the surfer

$l='nl'; //this lang variable MUST be declared before any query is executed

//////////////////////////////////////////////////////////////////////////////// 
//
//  display emails
//


include('./wizard_mail.php');


	
/////////////////// dev and test of the email
	
	$out .= warning('<strong>Not in Do mode, emails will not be sent. Use &do=1 to actually send emails</strong>');
	
	$example .= '<div style="margin-top:3em;">'.$mail->subject().'</div>';	
	
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:3em; padding-bottom:3em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
		'.$mail->html().'
		</div>
		<div style="height:5em;">&nbsp;</div>
		';
	$example .= $html;
	
	
	$example .= h1('Text version for this email: ' );
	$stripped = '<div style="margin-top:3em;"><textarea rows=24 style="width:100%;">'.$mail->stripoff().'</textarea><br/>&nbsp;</div>';
	$example .= $stripped;
	
//$mail->send();
 


//////////////////////////////////////////////////////////////////////////////// 
//
//  ECHO OUTPUT
//


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');

echo html($out, $example);


?>