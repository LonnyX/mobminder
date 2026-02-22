<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E   a   P R O D U C T
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$productid = $_POST['id'];
if($productid<=0) die('Trying to delete a virtual...');

$dS_product = new C_dS_product($productid);
if($accountId != $dS_product->groupId) die ('You should delete in your own group.');

echo $nl.'C_dS_product:'.$nl.$dS_product->stream().$nl;

// remove any related productexperts
$productexperts = new C_dbAccess_productexperts($productid); // product experts group to products
$productexperts->deleteAll();

$perfReport->peak('::cleaned up from productexperts');

// remove any related stocktakings
$stocktakings = new C_dbAccess_stocktakings($productid); // product experts group to products
$stocktakings->deleteAll();


$perfReport->peak('::cleaned up from stocktakings');

// remove from performances
echo $nl;

	$goods = new C_dbAccess_goods();
$goods->deleteOnproduct($productid, $accountId);

$perfReport->peak('::cleaned up from performances');

	$oldergoods = new C_dbAccess_goods('archive_');
$oldergoods->deleteOnproduct($productid, $accountId);


echo $nl;
$perfReport->peak('::cleaned up from archive performances');


// finally, remove the product
$dS_product->dSdelete();

echo '<code>';
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>