<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    a    S T O C K T A K I N G 
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$sttid = $_POST['id']; $prdid = $_POST['productId'];
$dS_stocktaking = new C_dS_stocktaking($sttid, $prdid, $_POST);
$dS_stocktaking->movingtotal = $_POST['stockremain'];
$dS_stocktaking->dSsave();
$dS_product = new C_dS_product($prdid); $dS_product->stockremain = $_POST['stockremain'];
$dS_product->dSsave();


// Feedback
//
echo '<code>';
echo '#C_dS_stocktaking'.$nl.$dS_stocktaking->stream(with_tracking).$nl;
echo '#C_dS_product'.$nl.$dS_product->stream(with_tracking).$nl;
// echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>