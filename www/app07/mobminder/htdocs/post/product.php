<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    P R O D U C T
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$prdid = $_POST['id'];
$dS_product = new C_dS_product($prdid, $accountId, $_POST);
$dS_product->dSsave();

// Experts
//
$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? false : explode('!', $bCals);
$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? false : explode('!', $uCals);
$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? false : explode('!', $fCals);

$classes = array(class_bCal => $bCals, class_uCal => $uCals, class_fCal => $fCals);
$dbAccess_productexperts = new C_dbAccess_productexperts();
if($prdid>0) $dbAccess_productexperts->deleteOnGroup($prdid);

foreach($classes as $class => $experts)
	if($experts)
		foreach($experts as $id) {
			$dS_productexpert = $dbAccess_productexperts->newVirtual();
			$dS_productexpert->resourceId = $id;
		}
$dbAccess_productexperts->saveAll($dS_product->id); // group experts by product id



// Feedback
//

echo '<code>';
echo $dbAccess_productexperts->stream();
echo '#C_dS_product'.$nl.$dS_product->stream(with_tracking).$nl;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>