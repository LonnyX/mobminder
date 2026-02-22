<?php
//////////////////////////////////////////////////////////////////////
//
//     P O S T    T I M E    B O X I N G    C A T E G O R Y
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];

$o_dS_ = new C_dS_timeboxing($id, $accountId, $_POST);
$o_dS_->dSsave();

echo '<code>';
echo '#C_dS_timeboxing'.$nl.$o_dS_->stream(with_tracking).$nl;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_tboxing');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>