<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    L O G O
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$o_dS = new C_dS_logo($id);
if($accountId != $o_dS->groupId) die ('You should delete in your own playground. <command>logoff</command>');

echo chr(10).$o_dS->stream1().chr(10);

C_dS_logo::remove($id); // that is a specific remove() function, see C_dS_logo in dbio.php

echo chr(10).'Removed.';

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'd_file');
?>