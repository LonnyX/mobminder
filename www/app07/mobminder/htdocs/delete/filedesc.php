<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    F I L E 
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$vid = $_POST['visitorId']; if(!is_numeric($vid)) die('Missing data... <command>logoff</command>');

$dS_visitor = false;
if($vid) {
	$dS_visitor = new C_dS_visitor($vid);
	if($dS_visitor->groupId != $accountId) die('Try to stay in your playground... <command>logoff</command>');
	$dS_file = new C_dS_file($id, $accountId, $_POST);
}


echo chr(10).$dS_file->stream1().chr(10);

$ext = pathinfo($dS_file->filename, PATHINFO_EXTENSION);
$codename = C_dS_file::$filesdir.$accountId.'_'.$dS_file->visitorId.'_'.$dS_file->id.'.'.$ext;

$dS_file->dSdelete(); // comment this line if you need to test without really removing stuff

$r = false;
echo chr(10);
if(file_exists($codename)) {
	echo 'The file exists.'.chr(10);
	$r = unlink($codename);   // comment this line if you need to test without really removing stuff
	if(!$r) echo 'The file could NOT be removed:'.$codename.chr(10);
		else echo 'The following file has been removed:'.$codename.chr(10);
} else {
	echo 'The file with codename '.$codename.' DOES NOT exists.'.chr(10);
}
echo chr(10);

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'd_file');
?>