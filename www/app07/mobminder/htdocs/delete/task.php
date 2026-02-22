<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    A    T A S K
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$taskid = $_POST['id'];
if($taskid<=0) die('Trying to delete a virtual...');

$o_dS_task_description = new C_dS_task_description($taskid);
if($accountId != $o_dS_task_description->groupId) die ('You should delete in your own group. <command>logoff</command>');
echo chr(10).'C_dS_task_description:'.chr(10).$o_dS_task_description->stream();

// remove references to visitors
//
$o_dbAccess_task_visirefs = new C_dbAccess_task_visirefs();
$o_dbAccess_task_visirefs->deleteOnGroup($taskid);


// remove assignees
//
$o_dbAccess_task_assignees = new C_dbAccess_task_assignees();
$o_dbAccess_task_assignees->deleteOnGroup($taskid);


// remove description
//
$o_dS_task_description->dSdelete();

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_task');
?>