<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     C M   T E L E C O M       F E E D B A C K 
//

define('localdevtest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2011-01-05 9:01:46'); 


$systemLog = 'mblox feedback';
if(localdevtest) {
	require '../../lib_mobphp/dbio.php';  
	require '../classes/cmtelecom.php';
} else {
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/htdocs/classes/cmtelecom.php';
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
//

$connect = new C_CMtelecom();
$connect->CMtelecomCalling();

?>