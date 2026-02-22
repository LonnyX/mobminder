<?php
$key = @$_POST['k']+0;
$tom = @$_POST['t'];
$msg = @$_POST['m'];
if(!(isset($key)&&isset($tom)&&isset($msg))) die('0!who are you?');

session_start();
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/mblox.php';
require '../classes/cmtelecom.php';
$perfReport = new C_perfReport();
$perfReport->peak('::time needed to retrieve session and posted parameters');

if($key==0||$tom==''||$msg=='') { sleep(5); die('0!unusable data'); }

// You open a session using an existing key
//
$o_dS_accesskey = new C_dS_accesskey($key);
if(!$o_dS_accesskey->id) die('0!Bad key');
$loginId = $o_dS_accesskey->groupId;

// check if the login associated with this key has checked in
$loggedIn = explode(',', $_SESSION['loggedIn']);
$yet = in_array($loginId, $loggedIn);
if(!$yet) die('0!You did not log in');

$accountId = $o_dS_accesskey->accountId;

// Track the client connection
$dS_login = new C_dS_login($loginId);
$dS_group = new C_dS_group($accountId);

$mobile = checkMobileFormat($tom, $dS_group->phoneRegion);
if(!$mobile) die('0!Invalid mobile');

$connect = new C_CMtelecom();
	$sms = new C_dS_sms(0);
	$sms->groupId = $accountId;
	$sms->reservationId = 99;
	$sms->templateId = 99; // the template specifies if the message targets a visitor or a group resource
	$sms->resourceId = 99; // can be a visitor Id or a group resource Id depending on the message target
	$sms->sendStamp = C_date::getNow();
	$sms->text = $msg;
	$sms->toNumber = $mobile;
	$sms->replyNumber = 'QuickSMS';
	$sms->dSsave(); // turns the Id positive (an SMS must have an id for the dataConnect_ to work with
	
$perfReport->peak('::message is ready for sending');
	$connect->sendOver($sms);
$perfReport->peak('::sendOver function complete');
	$sms->dSsave(); // sms status turned to "transmit" by $connect is recorded in DB, now the SMS is waiting for feedback from aggregator
 
echo chr(10);
echo('!'.$sms->id.'!'.chr(10));

echo '<code>';
echo $sms->stream1(with_tracking).chr(10);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
?>