<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     m B L O X      F E E D B A C K 
//

define('localdevtest', true); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2011-01-05 9:01:46'); 


$systemLog = 'CLX feedback';
if(localdevtest) {
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/mblox.php';
} else {
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/mblox.php';
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
//

die('OK');

$connect = new C_mBlox_sms_http();
$connect->mBloxCalling();

?>