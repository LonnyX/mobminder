<?php
//////////////////////////////////////////////////////////////////////
//
//     P O S T    G U I D E L I N E S 
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];

$dS = new C_dS_guidelines($id, $accountId, $_POST);
$dS->dSsave();

echo '<code>';
echo '#C_dS_guidelines'.chr(10);
echo $dS->stream().chr(10);
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_gdlns');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>