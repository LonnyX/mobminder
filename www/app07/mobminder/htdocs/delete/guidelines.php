<?php
//////////////////////////////////////////////////////////////////////
//
//    D E L E T E     G U I D E L I N E S
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$dS_guideline = new C_dS_guidelines($id);
if($accountId != $dS_guideline->groupId) die ('You should delete in your own group. <command>logoff</command>');
echo 'deleting:';
echo chr(10).'C_dS_guidelines:'.chr(10).$dS_guideline->stream().$nl;

// clean up spots where these guidelines were used
	$q = new Q('update resources set guideId = 0 where groupId = '.$accountId.' and guideId = '.$id.';');
$perfReport->peak('::done with cleaning up resources using this guide, '.$q->hits().' resources updated');

$dS_guideline->dSdelete();

echo $nl;
echo '<code>';
	echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_gdlns');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>