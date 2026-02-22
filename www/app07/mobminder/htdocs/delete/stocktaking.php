<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E   a   S T O C K T A K I N G
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$sttid = $_POST['id'];
if($sttid<=0) die('Trying to delete a virtual...');

$dS_stocktaking = new C_dS_stocktaking($sttid);


$dS_product = new C_dS_product($dS_stocktaking->groupId);
$dS_product->stockremain -= $dS_stocktaking->delta;
if($dS_product->stockremain < 0) $dS_product->stockremain = 0;
if($accountId != $dS_product->groupId) die ('You should delete in your own group.');
$dS_product->dSsave();

echo $nl.'C_dS_stocktaking:'.$nl.$dS_stocktaking->stream().$nl;

// finally, remove the product
$dS_stocktaking->dSobsolete(); // updates the dataset tracking data, keeping it in DB
echo $nl.'now obsolete'.$nl.$nl;
// Feedback
//
echo '<code>';
echo '#C_dS_product'.$nl.$dS_product->stream(with_tracking).$nl;
echo '#C_dS_stocktaking'.$nl.$dS_stocktaking->stream(with_tracking).$nl;
// echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>