<?php

define('smsFeedbackTest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2011-01-05 9:01:46'); 


$systemLog = 'smsapi feedback';
if(smsFeedbackTest) {
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
} else {
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}

$sms = new C_dataConnect_smsAPI_pl();
$sms->feedback();
unset($sms);
?>