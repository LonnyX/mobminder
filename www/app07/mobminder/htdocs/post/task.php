<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    A   T A S K 
//

require '../classes/ajax_session.php'; session_write_close();
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$taskid = $_POST['id'];
$f4all = $_POST['f4all']+0; // changes apply to all assignees of this task
$o_dS_task_description = new C_dS_task_description($taskid, $accountId, $_POST);
$o_dS_task_description->dSsave();

///// addressees by login
//
$assignees = $_POST['assignees']; $assignees = explode('!', $assignees); // an array of login Ids, assigned to this task
$o_dbAccess_task_assignees_previous = new C_dbAccess_task_assignees();
$o_dbAccess_task_assignees = new C_dbAccess_task_assignees();
if($taskid>0) $o_dbAccess_task_assignees_previous->loadOnGroup($taskid);
foreach($assignees as $lgnId) {
	
	if($o_dS_ = $o_dbAccess_task_assignees_previous->hasLoginId($lgnId))
		$o_dbAccess_task_assignees->add($o_dS_, $o_dS_->id); // this login was already assigned, keep progress setting
	else {
		$o_dS_ = $o_dbAccess_task_assignees->newVirtual(); // this login was not assigned, make new
		$o_dS_->loginId = $lgnId;
	}
	
	if($lgnId==$loginId || $f4all) { // records the status for this login
		$o_dS_->midnOut = $_POST['midnOut'];
		$o_dS_->cssPattern = $_POST['cssPattern'];
	}
}
foreach($o_dbAccess_task_assignees_previous->keyed as $id => $o_dS_previous)
	if(!$o_dbAccess_task_assignees->hasKey($id))
		$o_dbAccess_task_assignees_previous->delete($id); // this task assignment is not in the list anymore => remove from DB


$o_dbAccess_task_assignees->saveAll($o_dS_task_description->id); // group experts by workcode id


///// references to visitors
//
$visirefs = $_POST['visiref']; $visirefs = ($visirefs=='-') ? false : explode('!', $visirefs);
$o_dbAccess_task_visirefs = new C_dbAccess_task_visirefs();
if($taskid>0) $o_dbAccess_task_visirefs->deleteOnGroup($taskid);
if($visirefs)
	foreach($visirefs as $vid) {
		// check that this visitor is still active
		$q = new Q('select count(1) as c from visitors where id = '.$vid.' and deletorId = 0;');
		if(!$q->c()) continue; // This solves the very particular case where a doublon was removed but is still selected (and id posted) from the C_iACPICK control. Other similar scripts are protected against this. see (*exc10*)
		
		// add the visitor reference
		$o_dS_ = $o_dbAccess_task_visirefs->newVirtual();
		$o_dS_->visiId = $vid;
	}
$o_dbAccess_task_visirefs->saveAll($o_dS_task_description->id); // group references by task id


///// stream
//
$bank = 'plitems';
echo '<code>';
echo '#C_dS_task_description'.'#'.$bank.$nl;
echo $o_dS_task_description->stream().$nl;
echo $o_dbAccess_task_assignees->stream(false, $bank);
echo $o_dbAccess_task_visirefs->stream(false, $bank);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_task');
?>