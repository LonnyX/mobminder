<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    F I L E 
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
if($id<=0) die('Trying to delete a virtual...');

$rid = $_POST['reservationId']; if(!is_numeric($rid)) die('Missing more data... <command>logoff</command>');

$dS_reservation = false;
if($rid) {
	$dS_reservation = new C_dS_reservation($rid);
	if($dS_reservation->groupId != $accountId) die('Try to stay in your playground... <command>logoff</command>');
	$dS_file = new C_dS_resafile($id, $accountId, $_POST);
}

echo chr(10).$dS_file->stream1().chr(10);

$ext = pathinfo($dS_file->filename, PATHINFO_EXTENSION);
$codename = C_dS_resafile::$filesdir.$accountId.'_'.$dS_file->reservationId.'_'.$dS_file->id.'.'.$ext;

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