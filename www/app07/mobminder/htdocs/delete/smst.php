<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E     S M S     T E M P L A T E
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$dS_smst = new C_dS_smsTemplate($id);
if($accountId != $dS_smst->groupId) die ('You should delete in your own group.');

echo $nl.'C_dS_smsTemplate:'.$nl.$dS_smst->stream().$nl;

$targetToAccountResource = ($dS_smst->target == class_bCal)||($dS_smst->target == class_uCal)||($dS_smst->target == class_fCal);
$targetClass = $dS_smst->target;

// clean up from sms table the references to this template
	$q = new Q('delete from sms where groupId = '.$accountId.' and templateId = '.$id.';');
$perfReport->peak('::done with clean up from sms table, '.$q->hits().' items removed');


// clean up from comm_toggles table references to this template
	$q = new Q('delete from comm_toggles where groupId = '.$accountId.' and templateId = '.$id.';');
$perfReport->peak('::done with clean up from comm_toggles, '.$q->hits().' items removed');


// final deletion
$dS_smst->dSdelete();


// check if this template was the last to a target of type class_bCal, class_uCal, or class_fCal
$acckeys = '';
if($targetToAccountResource) {
	echo $nl.'Checking for other templates with identical target...';
	$accesskeys = new C_dbAccess_accesskey();
	if($accesskeys->removeFromWatchovers($accountId, $targetClass)) // returns true when some clean up has been done in access keys
		$acckeys = $accesskeys->stream(false,'config').$nl;
}
$perfReport->peak('::done with clean up from access keys');

echo $nl;
echo '<code>';
echo $acckeys;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_smst');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>