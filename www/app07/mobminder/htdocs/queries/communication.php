<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y   C O M M U N I C A T I O N S   F O R   A   G I V E N   R E S E R V A T I O N
//
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session');

// retrieve posts
$rid = $_POST['id'];
$bank = $_POST['bank'];

$o_dbAccess_emails = new C_dbAccess_emails($rid);
$perfReport->peak('::o_dbAccess_emails');

$o_dbAccess_sms = new C_dbAccess_sms($rid);
$perfReport->peak('::o_dbAccess_sms');

$toggles = new C_dbAccess_cToggles($rid);
$perfReport->peak('::toggles');


$dS_resa = new C_dS_reservation($rid);
$target = $dS_resa->archived ? 'archive_': '';
$attvisis = new C_dbAccess_att_visitors($target, $rid);
$visitors = new C_dbAccess_visitors($attvisis->getResourceIdsList());
$vids = $visitors->getIdsList();

$o_dbAccess_files = new C_dbAccess_files($vids);  // visitor's files
$o_dbAccess_resafiles = new C_dbAccess_resafiles($rid); // this reservation related files


echo '<code>';
echo $o_dbAccess_emails->stream(); 
echo $o_dbAccess_sms->stream();
echo $toggles->stream();
echo $o_dbAccess_files->stream(false);
echo $o_dbAccess_resafiles->stream(false);
// echo $payments->stream(false, $bank, with_tracking);
echo '</code>';

$perfReport->peak('::echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>
