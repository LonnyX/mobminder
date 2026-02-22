<?php
//////////////////////////////////////////////////////////////////////
//
//   D E L E T E     T I M E     B O X I N G    C A T E G O R Y 
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$dS_tb = new C_dS_timeboxing($id);
if($accountId != $dS_tb->groupId) die ('You should delete in your own group. <command>logoff</command>');


// clean up timeboxes table (they are removed from any hourly that were using timeboxes from the deleted timeboxing category)

	$q = new Q('DELETE FROM timeboxes WHERE timeboxingId = '.$dS_tb->id.';');
echo $q->hits().' references in timeboxes were cleaned up from hourlies using  timeboxing '.$dS_tb->id.$nl;

$perfReport->peak('::done with clean up from timeboxes');



	$q = new Q('DELETE FROM worktboxing WHERE timeboxingId = '.$dS_tb->id.';');
echo $q->hits().' references in worktboxing were cleaned up from workcodes using timeboxing '.$dS_tb->id.$nl;


$perfReport->peak('::done with clean up from worktboxing');



echo $nl.'C_dS_timeboxing:'.$nl.$dS_tb->stream().$nl.$nl;
$dS_tb->dSdelete();

$perfReport->peak('::completed');

echo '<code>';
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_tboxing');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>