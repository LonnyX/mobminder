<?php
//////////////////////////////////////////////////////////////////////
//
//     P O S T    S M S     T E M P L A T E 
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];

if($_POST['filterOnLogins']==0) $_POST['logins']='';
if($_POST['filterOnResources']==0) $_POST['resources']='';
if($_POST['triggerId']!=0) $_POST['deliveryDelay']=0;

$dS = new C_dS_smsTemplate($id, $accountId, $_POST);
$dS->dSsave();

echo '<code>';
echo '#C_dS_smsTemplate'.$nl.$dS->stream().$nl;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_smst');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>