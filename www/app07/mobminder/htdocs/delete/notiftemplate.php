<?php
//////////////////////////////////////////////////////////////////////
//
//    D E L E T E     N O T I F I C A T I O N      T E M P L A T E
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$dS_notif_t = new C_dS_notifTemplate($id);
if($accountId != $dS_notif_t->groupId) die ('You should delete in your own group.');

echo $nl.'C_dS_notifTemplate:'.$nl.$dS_notif_t->stream();

$targetToAccountResource = ($dS_notif_t->target == class_bCal)||($dS_notif_t->target == class_uCal)||($dS_notif_t->target == class_fCal);
$targetClass = $dS_notif_t->target;


// clean up from notifications table the references to this template
	$q = new Q('delete from notifications where groupId = '.$accountId.' and templateId = '.$id.';');
$perfReport->peak('::done with clean up from notifications table, '.$q->hits().' items removed');


// clean up from comm_toggles table references to this template (PVH: if ever possible to disable from a reservation, not planned in 2021)
	// $q = new Q('delete from comm_toggles where groupId = '.$accountId.' and templateId = '.$id.';');
// $perfReport->peak('::done with clean up from comm_toggles, '.$q->hits().' items removed');


// final deletion
$dS_notif_t->dSdelete();


// check if this template was the last to a target of type class_bCal, class_uCal, or class_fCal
$acckeys = '';
if($targetToAccountResource) { 
	
	echo $nl.'Checking for other templates with identical target...';
	$accesskeys = new C_dbAccess_accesskey();
	if($accesskeys->removeFromWatchovers($accountId, $targetClass)) // returns true when some clean up has been done in access keys
		$acckeys = $nl.$accesskeys->stream(false,'config').$nl;
}
$perfReport->peak('::done with clean up from access keys');

echo $nl;
echo '<code>';
echo $acckeys;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_emlt');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>