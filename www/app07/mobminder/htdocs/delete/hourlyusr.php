<?php

//////////////////////////////////////////////////////////////////////
//
//    D E L E T I N G     U S A G E     O F    A N     H O U R L Y 
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];



$o_dS_hourlyuser = new C_dS_hourlyuser($id);
	$rscId = $o_dS_hourlyuser->groupId;
	$dayIn = $o_dS_hourlyuser->dayIn;
$scope = new C_hourliesScope($rscId, $dayIn);
$scope->deleteHuser();


$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers($rscId);

echo '<code>';
echo $o_dbAccess_hourliesusers->stream();
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_huser');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>