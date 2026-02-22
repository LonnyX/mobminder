<?php
//////////////////////////////////////////////////////////////////////
//
//     T E S T     S M S     T E M P L A T E    by   S E N D I N G    A N    S M S 
//
// Here we build a virtual context for sending a test SMS using the SW layer in comm.php
//

$loadcontext = 2;	
require '../classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext() used in comm.php
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$testwhich = $_POST['testwhich'];

$dS_resc = false;
foreach($account_resources->keyed as $rscId => $dS_resource) 
	if($dS_resource->resourceType==class_bCal) { $dS_resc = $dS_resource; break; }
if(!$dS_resc) die('This account has no bCal resource');
else echo 'Chosen bCal: '.$dS_resc->name.' ('.$dS_resc->id.')'.$nl;


$dS_resa = new C_dS_reservation(0);

	$oclock = new C_date();
	$oclock->dropMinutes();
	echo 'Fake appointment date/time is '.$oclock->getDateTimeString().$nl;
	$dS_resa->cueIn = $oclock->t;
	$dS_resa->cueOut = $oclock->t+3600;
	$dS_resa->note = 'Test Message';

	$dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());
	$dS_resa->visitors = new C_setKeyed();
	$dS_resa->assess = class_resa_appointment;
	$dS_resa->attendees[class_bCal]->add($dS_resc, $dS_resc->id);


$dS_visi = new C_dS_visitor(0, 0); // dS_login is passed as preset data for the dS_visitor
	$dS_visi->gender = $dS_login->gender;
	$dS_visi->firstname = $dS_login->firstname;
	$dS_visi->lastname = $dS_login->lastname;
	$dS_visi->mobile = $dS_login->mobile;
	$dS_visi->language = $dS_login->language;
	if(!$dS_visi->mobile) die('The login has no mobile number');

$dS_resa->visitors->add($dS_visi, $visiId = 1);


if($_POST['filterOnLogins']==0) $_POST['logins']='';
if($_POST['filterOnResources']==0) $_POST['resources']='';
if($_POST['triggerId']!=0) $_POST['deliveryDelay']=0;

$dS_template = new C_dS_smsTemplate(0, $accountId, $_POST); // note that we will not save this dS, it is simulated here only for the purpose of sending a test SMS
	$dS_template->target = reminder_target_visitor;
	$dS_template->sendComms = 1;


if($testwhich=='inautorep') $dS_template->message = $dS_template->autoreplymsg;

$messages = false;
$messages = sendResaMSGs($dS_resa, $dS_template, $dS_account, false /*the function instantiates sendComm by itself */, $forceresend = true);


	// $messages is an instance of C_dbAccess_sms
if($messages) {
	echo 'count = '.$messages->count().$nl; 
	foreach($messages->keyed as $smsid => $dS_sms) {
		echo 'recepient = '.$dS_sms->toNumber.$nl;
		echo 'message = '.$dS_sms->text.$nl;
	}
}
else echo 'no message'.$nl;
sleep(2);

$perfReport->peak('::completed');
$perfReport->dropReport();
?>