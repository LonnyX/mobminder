<?php
//////////////////////////////////////////////////////////////////////
//
//     P O S T     N O T I F I C A T I O N      T E M P L A T E 
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];

if($_POST['filterOnLogins']==0) $_POST['logins']='';
if($_POST['filterOnResources']==0) $_POST['resources']='';
if($_POST['triggerId']!=0) $_POST['deliveryDelay']=0;

$o_dS_ = new C_dS_notifTemplate($id, $accountId, $_POST);
$o_dS_->dSsave();

echo '<code>';
echo '#C_dS_notifTemplate'.chr(10);
echo $o_dS_->stream().chr(10);
echo '#C_dS_group'.chr(10).$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_emlt');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>