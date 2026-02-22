<?php

// echo "seee this !";
// echo phpinfo();


//////////////////////////////////////////////////////////////////////////////// 
//
// 	M A I L    T H A N K S 
//
//
//
//

define("DOMPDF_ENABLE_REMOTE", false);
require '../assets/php/dompdf/autoload.inc.php';

use Dompdf\Dompdf;


// require ('../assets/php/pdf.php'); // pdf generation
require('../assets/php/_set_dev_prod.php'); // Create the path to pick the images in dev or prod
require('../assets/php/maillib.php');
unset($_SESSION['loginId']); //unconnect a potential account manager
require('../assets/php/dbio.php');

//////////////////////////////////////////////////////
//
//  Echo functions
//

$out = '';

function subject($msg) { return '<p style="color:rgba(10,30,15,0.7); font-size:1em;">'.$msg.'</p>'; }
function explain($msg) { return '<p style="color:orange; font-size:1em;">'.$msg.'</p>'; }


$webmode = 0; if(isset($_GET['web'])) if($_GET['web']=='1') $webmode = 1; //when webmode = 1 , no email is sent, when webmode = 0, an email will be send to leadid email
$webmpdf = 0; if(isset($_GET['pdf'])) if($_GET['pdf']=='1') $webmpdf = 1; //when webmpdf = 1 (and webmode = 1) download the pdf. If webmpdf != 1 (and webmode = 1) the pdf will be displayed on the screen, under the email display, in form of html
$recpt = 0; if(isset($_GET['recpt'])) $recpt = $_GET['recpt']; //when recpt=ghi or a combinaison of those letters, an email will be send to known emails
// $leadid = 1; if(isset($_POST['leadid'])) $leadid = $_POST['leadid'];
// $contid = 1; if(isset($_REQUEST['contid'])) $contid = $_REQUEST['contid'];
$lid = $_SESSION['logged_lead']; //Get from accessCodeControl.php *ids*
$contid = $_SESSION['logged_contract']; //Get from accessCodeControl.php *ids*



$dS_contract = new C_dS_contract($contid, 1, $_POST);
$lname = $dS_contract->invContactPersonLastname; //Contractors's last name
$fname =  $dS_contract->invContactPersonFirstname; //Contractor's first name
$invemail =  $dS_contract->invEmail; //Contractor's email
$birthdayContract = $dS_contract->birthdayContract; //YYYYMMDD format
$courtesy = $dS_contract->invCourtesy; //Lead's civility, retrieved from contract filled in by the account manager: M, Mme
$tncourtesy = $courtesy.'_title'; // will be used as technical names to display the right translation according to the lang
$legalform = $dS_contract->pmPp; 
	if ($legalform=='PM') $legalformTn = 'captionLP';
	else $legalformTn = 'captionNP'; // will be used in pdf as technical name to display the right translation according to the lang in _contract_pdf::X($legalformcaption,'contracting') and in _mail_summary.php::
$token = $dS_contract->accessCode;
$leadid = $dS_contract->leadid;

$dS_contract->dSsave();

$dS_lead = new C_dS_lead($leadid);
$accmid = $dS_lead->accountm; //Lead's account manager

$dS_user = new C_dS_users($accmid);
$accpicname = $dS_user->firstname.'.png'; //Account manager's picture
$accfirstname = $dS_user->firstname; //Account manager's firstname
$acclastname = $dS_user->lastname; //Account manager's lastname
$accmobile = $dS_user->mobile; //Account manager's mobile
$accemail = $dS_user->email; //Account manager's email

$birthContractYear = substr($birthdayContract, 0, 4); //YYYY
$birthContractMonth = substr($birthdayContract, -4, -2); //MM
$birthContractDay = substr($birthdayContract,-2); //DD

$stringBirthContractMonth = ''; //Prepare the string traduction of MM
if($birthContractMonth=='01') $stringBirthContractMonth = X('caption_jan','contracting');
if($birthContractMonth=='02') $stringBirthContractMonth = X('caption_feb','contracting');
if($birthContractMonth=='03') $stringBirthContractMonth = X('caption_mar','contracting');
if($birthContractMonth=='04') $stringBirthContractMonth = X('caption_apr','contracting');
if($birthContractMonth=='05') $stringBirthContractMonth = X('caption_may','contracting');
if($birthContractMonth=='06') $stringBirthContractMonth = X('caption_jun','contracting');
if($birthContractMonth=='07') $stringBirthContractMonth = X('caption_jul','contracting');
if($birthContractMonth=='08') $stringBirthContractMonth = X('caption_aug','contracting');
if($birthContractMonth=='09') $stringBirthContractMonth = X('caption_sep','contracting');
if($birthContractMonth=='10') $stringBirthContractMonth = X('caption_oct','contracting');
if($birthContractMonth=='11') $stringBirthContractMonth = X('caption_nov','contracting');
if($birthContractMonth=='12') $stringBirthContractMonth = X('caption_dec','contracting');
$convertedDate = '('.$birthContractDay.' '.$stringBirthContractMonth.' '.$birthContractYear.')'; //Ex. (01 may 2023) Will be used in the generated pdf in _contract_pdf.php


//----------------------------- 

$imageshost;

$moblogo = '<a href="https://www.mobminder.com" target="_blank"><img width="300" src="'.$imageshost.'/mob-logo.png" alt="Mobminder" border="0" style="width:300px; max-width:300px; border:none;"></a>';
$signaturepic = '<img src="'.$imageshost.'/'.$accpicname.'" width="200" style="width:200px; max-width:200px; border:none; display:block;" alt="team-picture" border="0">';
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

$subject = X('subject') ;


/////// Main communication body 
//


// Top border with logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="100%" style="text-align:center; padding-top:2.5em;">
		<div style="text-align:center;">'.$moblogo.'</div>
	</td>
</tr>
</table>';

// Main title
//

$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start: 1em; margin-block-end: 1em;">
			'.X($tncourtesy,'mailinvite').' '.$lname.',		
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

		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('paragraph_1').'</p>
		<p style="color:'.$txtcolormail.'; font-size:16px; margin-block-start: 1em; margin-block-end: 1em;">'.X('paragraph_2').'</p>
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
		<span style="color:'.$medcolor.'; font-weight:bold;font-size:13pt;">'.$accfirstname. ' '.$acclastname.'<br></span>
		<span style="color:'.$txtcolormail.';">'.X('title_signature','mailinvite').'</span><br>
		<a href="mailto:'.$accemail.'" style="color:'.$txtcolormail.'; text-decoration:none;" target="_blank"></span style="color:'.$txtcolormail.';">'.$accemail.'</span></a><br>
		<a href="tel:'.$accmobile.'" style="text-decoration:none!important; color:'.$txtcolormail.'">'.$accmobile.'</a><br>
		<div style="text-align:left; padding-top:20px;">'.$logoMobBottom.'</div>
	</td>
</tr>
</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$tt.$t1.$t2.$tsignature.'</td></tr></table>';
$center = '<center>'.$main.'</center>';





//Converting pictures to base64 encoding pdf https://stackoverflow.com/questions/37952877/adding-an-image-with-dompdf 

function imgbase64($pathimg,$width) {
	$type = pathinfo($pathimg, PATHINFO_EXTENSION);
	$data = file_get_contents($pathimg);
	$base64 = 'data:image/'.$type.';base64,'.base64_encode($data);
	$imgbase64 = '<img src="'.$base64.'" width="'.$width.'">';
	return $imgbase64;
}

$logoicon = imgbase64('../assets/imgs/icon-1.png','55');
$accman = imgbase64('../assets/imgs/emails/'.$accpicname.'','200');

$dompdf = new Dompdf();
$dompdf->setPaper('A4', 'portrait');

	$notchecked = 'color:rgba(10,30,15,0.4); text-decoration:line-through;';
$check_payplan_md = '<span style="'.$notchecked.'">'.X('caption_mensuel_prel','contracting').'</span>';
$check_payplan_ad = '<span style="'.$notchecked.'">'.X('caption_annuel_prel','contracting').'</span>';
$check_payplan_ai = '<span style="'.$notchecked.'">'.X('caption_annuel_fac','contracting').'</span>';

switch($dS_contract->paymentType) {
    case payplan_monthly_debit:
		$check_payplan_md='<span>'.X('caption_mensuel_prel','contracting').'</span><span class="checked"> x</span>';
		$check_payplan='monthly payment by direct debit';
        break;
    case payplan_annual_debit:
		$check_payplan_ad='<span>'.X('caption_annuel_prel','contracting').'</span><span class="checked"> x</span>';
		$check_payplan='annual payment by direct debit';
        break;
    case payplan_annual_invoice:
		$check_payplan_ai='<span>'.X('caption_annuel_fac','contracting').'</span><span class="checked"> x</span>';
		$check_payplan='annual payment after invoicing';
        break;
    default:
        # code...
        break;
}

$paymentsPlans = '
<div style="padding-bottom:3px;">'.$check_payplan_md.'</div>
<div style="padding-bottom:3px;">'.$check_payplan_ad.'</div>
<div>'.$check_payplan_ai.'</div>
';

$notes = '';

if ($dS_contract->invNotes != '') {
    $notes = '<div class="notes">'.$dS_contract->invNotes.'</div>';
}

require '../assets/php/_contract_pdf.php'; // this include sets $pdfbody


// Charge the HTML content
$pdfstyles ='
	<style>

		div.pdf div.page {page-break-after: always;} /*Go to the next page in pdf*/
			div.pdf.lastpage {page-break-after: avoid;} /*If not, dompdf create one more blank page. Class added to the last page*/

		div.pdf h1 {color:rgba(10,30,15,0.6); margin-top:20px; margin-bottom:8px;}

		div.pdf logo.mobminder {font-weight:bold; font-size:32px;}

		div.pdf div.content {max-height:900px; height:900px; overflow:hidden;}
			div.pdf div.firstpage div.content {height:920px; max-height:920px;} /*Pushes the content lower. If not done, the footer of the first page is higher than the others*/

		div.pdf {font-family: Calibri, sans-serif; color:rgba(10,30,15,0.7); font-size:13px;}
		div.pdf .smaller_font {font-size:12px;}

		div.pdf table {font-family: Calibri, sans-serif; color:rgba(10,30,15,0.7); font-size:13px; width: 100%; border-spacing:5px; }

		div.pdf .bold { font-weight:bolder; }

		div.pdf .center { text-align:center; }

		div.pdf .right { text-align:right; }

		div.pdf .left { text-align:left; }

		div.pdf .mob-txt-blue { color:#6897BF; 	} /* rgb(104,151,191) blue mobminder for normal sized text */

		div.pdf .mob-txt-lime { color:#B2CA2B; 	} /* rgb(178,202,43) light mobminder green adapted for printed normal sized text */

		div.pdf div.headerContract { max-height:50px; height:50px; border-bottom:0.5px solid rgba(0,0,0,.2); }

		div.pdf div.footerContract { position:relative; max-height:20px; height:20px; border-top: 0.5px solid rgba(0,0,0,.2); }

		div.pdf div.accountpic { position:absolute; bottom:20px; right:0px; } /*bottom position should match with the height of the footerContract to display the img on the line*/

		div.pdf div.notes { /*background-color:rgba(254,247,224,0.8);*/ background-color:rgba(194,226,73,0.2); border-radius:10px; padding:10px; margin-top:15px; max-height:100px; overflow:hidden; width:65%}
		
		div.pdf div.table-wrapper-35 {width:35%; float:left;}
		div.pdf div.table-wrapper-50 {width:50%; float:left;}
		div.pdf div.table-wrapper-65 {width:65%; float:left;}

		div.pdf span.field, div.pdf span.checked {color:#497EAB;} /*Adapted version (shade) of the mob-txt-blue for text to improve lisibility*/

		div.pdf ol { padding-inline-start: 30px;}

		div.pdf ul {
			margin-block-start: 0em;
			margin-block-end: 0em;
			margin-inline-start: 0px;
			margin-inline-end: 0px;
			padding-inline-start: 0px;
		}

		div.pdf ol.nostyle li{list-style:none;}

		div.pdf ul.indent-circle li {list-style:circle; margin-left:10px; padding:0;}
			div.pdf ul.indent-circle li:last-of-type {padding: 0px 0px 3px 0px;}


		div.pdf li {text-align: left; text-decoration: none !important; padding: 3px 0px;}

		div.pdf #pagination{z-index:100; color:#C3D949;}	

		div.pdf .definitions{color:rgba(87,87,131,255) !important; font-style: italic; font-weight: bold;}
				
	</style>';

$htmlpdf = '<html>'.'<head>'.$pdfstyles.'</head>'.'<body>'.$pdfbody.'</body>'.'</html>';

$dompdf->loadHtml($htmlpdf);


//-----------------------------

//////////////////////////////////////////////////////
//
//  Mode display html
//

function droppdfToClient($fileatt) {

	$len=strlen(bin2hex($fileatt))/2;

	header('Content-Description: File Transfer');
	header('Content-Type: application/octet-stream');
	// header('Content-Disposition: attachment; filename='.basename($pathname));
	header('Content-Disposition: attachment; filename=contract.pdf');
	header('Content-Transfer-Encoding: binary');
	header('Expires: 0');
	header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
	header('Pragma: public');
	header('Content-Length: ' . $len);
	ob_clean();
	flush();
	echo($fileatt);
	exit();
}

if($webmode=='1') { //We will add & webmpdf == 1 to download the pdf. Else (webmpdf != 1) the pdf will be displayed on the screen, undert the email display, in form of html

	if($webmpdf == '1') { //Download the pdf

		$dompdf->render();
		$fileatt = $dompdf->output();
		droppdfToClient($fileatt);
	}

	else { //Display email and attached pdf in html
	
		function html($content, $example = '',$pdfstyles) {
			$pathfile = $_SERVER["SCRIPT_NAME"];
			$break = Explode('/', $pathfile);
			$thisScript = $break[count($break) - 1]; 
	
			$o = '<!DOCTYPE HTML>';
			$o .= '<html>';
				$o .= '<head>';
				$o .= '<title>'.$thisScript.'</title>';
				$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
				$o .= '<link href="../assets/css/translation.css" rel="stylesheet" type="text/css">';
				$o .= '<script src="../assets/js/jquery-3.2.1.js"></script>';
				$o .= '<script src="../assets/js/moblib.js"></script>';     
				$o .= '<script src="../assets/js/xlate.js"></script>';
				$o .= $pdfstyles;
				$o .= '<head>';
				$o .= '<body><div class="wrap" style="padding:10px 100px;">'.$content.'</div>'.$example.'</body></html>';
			return $o;
		}
	
	
		$example = '';
		$html = $center;	
		/////////////////// dev and test of the email
	
		$out .= subject('<strong>Mail subject: </strong>');
		$out .= subject($subject);
		$out .= explain('web=1 displays an example of an email and the attachment in html format. web=1&pdf=1 downloads the pdf of the attachment.<br>recpt=ghi or a combination of g or/and h or/and i sends a test email to jonathan@mobminder.com and/or j-bardo@hotmail.com and/or jonbardo@icloud.com');
		
		$example ='<div style="padding-top:0em;"'.$bgcolormail.'; color:'.$medcolor.';"'.$example.'</div>';
		
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:2em; text-align:center; background-color:'.$bgcolormail.'; width:100% !important;">
		'.$html.'
		</div>
		<div style="height:5em;">&nbsp;</div>
		<div style="width:680px; padding:80px; margin:auto;">'.$pdfbody.'</div>
		';
		$example .= $html;
	
		echo html($out, $example, $pdfstyles);
		
	
		if($recpt) { // In production, send email to test the rendering
	
			if(strpos($recpt,'g')!==false) {
				$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
				$mail->sendMail('jonathan@mobminder.com');
			}
	
			if(strpos($recpt,'h')!==false) {
				$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
				$mail->sendMail('j-bardo@hotmail.com');
			}
			if(strpos($recpt,'i')!==false) {
				$mail = new C_b64_email('jonathan@mobminder.com', $subject, $html, true, $bgcolormail);
				$mail->sendMail('jonbardo@icloud.com');
			}
		}
	}
	die();
}
    
//////////////////////////////////////////////////////////////////////////////// 
//
//  send email in production environment with attached pdf
//



// $dompdf->loadHtml($html);
//<img src="../assets/imgs/icon-1.png" alt="mobminder logo"/>
// Render the PDF

$dompdf->render();
$fileatt = $dompdf->output();

if($webmpdf == '1') { //Download the pdf

	droppdfToClient($fileatt);
	
} else {

	// Send mail with pdf contract to the newbie

	// $addressee ='jonathan@mobminder.com';
	$addressee = $invemail;
	$html = $center;
	$mail = new C_b64_email($accemail, $subject, $html, true, $bgcolormail);
	$mail->addAttachedStream($fileatt,'mobminder-agreement');
	$mail->sendMail($addressee);

	// Send sumup mail with contract to the adequate account manager 


	require '../langless/_mail_summary.php';

}



?>