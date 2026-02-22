<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    A N    H O U R L Y    U S A G E
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$hourlyId = $_POST['id'];

	$o_dS_hourlyuser = new C_dS_hourlyuser($hourlyId, $accountId, $_POST);
	$o_dS_hourlyuser->dSsave();

	echo '<code>';
	echo '#C_dS_hourlyuser'.chr(10).$o_dS_hourlyuser->stream().chr(10);
	echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
	echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_huser');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>