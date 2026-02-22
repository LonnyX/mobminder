<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 C O N T R A C T I N G   S I G N 
//
// Dev & Test : http://localhost:8888/mobcom/assets/php/contracting_team_mail.php
//
// Effective sending: https://mobminder.com/assets/php/contracting_team_mail.php
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

$account='Giraud';

$imageshost;

$logoTitle2 = '<a href="https://www.mobminder.com" target="_blank"><img width="300" src="'.$imageshost.'/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;"></a>';
$signaturepic = '<img src="'.$imageshost.'/jonathan.png" width="200" style="width:200px; max-width:200px; border:none; display:block;" alt="team-picture" border="0">';
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
	<td valign="middle" width="100%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$logoTitle2.'</div>
	</td>
</tr>
</table>';

// Introduction
//

$t1= '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="margin-block-start:0.5em; margin-block-end:1em;">
            Congrats! Your client '.$tncourtesy.' '.$lname.' has just signed a contract. Before forwarding to accounting, please check and complete the details.  		
        </p>
	</td>
</tr>
</table>';

$t2 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start:1em; margin-block-end: 0.5em;">
    Contract\'s note
    </p>
        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
        <li>'.$notes.'</li>       
		</ul>	
	</td>

</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start:0.5em; margin-block-end:0.5em;">
    Account
    </p>
        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
			<li>Customer number: 5000</li>
			<li>Account name: Dermoline</li>
			<li>Wallet: Giraud</li>		
			<li>Tag color: Jaune</li>
		</ul>	
	</td>			
</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start:0.5em; margin-block-end:0.5em;">
    Contact person
    </p>
        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
        <li>Name: Stankiewicz</li>
        <li>First name: Katy</li>
        <li>Civility: Mme</li>
        <li>Mobile: 0477 444 321</li>		
        <li>Email: katy@dermoline.be</li>
		</ul>	
	</td>			
</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start:0.5em; margin-block-end:0.5em;">
    Invoicing
    </p>
        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
        <li>Status: Personne physique</li>
        <li>Address: Rue de Morsaint 17</li>
        <li>Zipcode: 1390</li>
		<li>City: Grez-Doiceau</li>
		<li>Country: Belgique</li>
        <li>VAT: BE 0899.670.842</li>
		<li>IBAN: BE70 3770 7051 7825</li>
		<li>BIC: BBRUBEBB</li>
		<li>Accounting year: 1er janvier au 31 décembre</li>
        

		</ul>	
	</td>

</tr>

<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
    <p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start:0.5em; margin-block-end:0.5em;">
    Contract
    </p>
        <ul style="padding-left:1em; margin-block-start:0.5em; color:'.$txtcolormail.'; font-size:16px; list-style-type: none;">
        <li>Frequency: mensuelle</li>
        <li>Payement mode: Prélèvement</li>
        <li>Price (Excl. VAT) : 29</li>
		<li>Number of monthly SMS consuption: 100</li>
        <li>Contract anniversary: 2023/04/01</li>
		<li>Signature date: 2023/03/20</li>
		<li>Place of signature: Grez-Doiceau</li>        
		</ul>	
	</td>

</tr>


</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.'</td></tr></table>';
$center = '<center>'.$main.'</center>';


$example = '';
$html = $center;
$mail = new C_b64_email('jonathan@mobminder.com', 'Contract Tele-accueil 5584 - Monthly debit from 2023/04/01', $html, true, $bgcolormail);
	
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