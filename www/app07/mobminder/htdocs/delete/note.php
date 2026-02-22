<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    A    D A Y     N O T E  
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$noteid = $_POST['id'];
if($noteid<=0) die('Trying to delete a virtual...');

$o_dS_note_detail = new C_dS_note_detail($noteid);
if($accountId != $o_dS_note_detail->groupId) die ('You should delete in your own group. <command>logoff</command>');
echo chr(10).'C_dS_note_detail:'.chr(10).$o_dS_note_detail->stream();

// remove references to visitors
//
$o_dbAccess_note_visirefs = new C_dbAccess_note_visirefs();
$o_dbAccess_note_visirefs->deleteOnGroup($noteid);


// remove addressees
//
$o_dbAccess_note_addressees = new C_dbAccess_note_addressees();
$o_dbAccess_note_addressees->deleteOnGroup($noteid);

// remove note details
//
$o_dS_note_detail->dSdelete();

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_note');
?>