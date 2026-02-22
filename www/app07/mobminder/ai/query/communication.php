<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   Moby  A I   A P I
//
//
//ob_start(); // relates to (*cc)

ob_start();

require '../aiapilib.php';

$perfReport = new C_perfReport();
checkRequest4sqlInjection();
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$aid = $context->dS_account->id;
$lid = $context->dS_login->id;

$perfReport->peak('::context setup');

//if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
//else indent('some characters have been removed',6);
		
$dS_system = new C_dS_system();


echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');
echo '#C_dS_system'.$nl.$dS_system->stream(no_tracking, '|');
span('&lt/data&gt');
echo '</data>';


$perfReport->peak('::completed');
$perfReport->dropReport();

closeconnection();

?>