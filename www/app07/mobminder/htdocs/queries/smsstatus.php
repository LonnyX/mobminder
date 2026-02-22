<?php
//////////////////////////////////////////////////////////////////////
//
//  S M S   S T A T U S   ( used by smstest.js, gets an sms status by polling )
//
ob_start(); // relates to (*ob1)
$smsid = @$_POST['i'];
if(!(isset($smsid))) die('0!who are you?');

session_start();
require '../../lib_mobphp/dbio.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');


$sms = new C_dS_sms($smsid);

echo($sms->id.'!'.chr(10));
echo '<code>';
echo $sms->stream1(with_tracking).chr(10);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>