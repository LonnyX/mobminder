<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E     A N    A C C O U N T     R E S O U R C E  
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');
global $nl;


ini_set('memory_limit', '2048M'); // PVH 2021 : Firefox will not start if this is set to 4096M
set_time_limit(120); // take a deep breath

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$o_dS_resource = new C_dS_resource($id);
if($accountId != $o_dS_resource->groupId) die ('You should delete in your own group.');
if($dS_login->accessLevel < aLevel_seller) die ('You should delete in your own group.');

echo 'Deletion of following dS:'.$nl;
echo $nl.'C_dS_resource:'.$nl.$o_dS_resource->stream();

C_dS_resource::remove($o_dS_resource->id); // implies related reservations attendance deletion, references in views and watchover, communication, 

echo $nl;
echo '<code>';
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_rsc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>