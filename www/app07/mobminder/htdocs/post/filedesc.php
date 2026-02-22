<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    F I L E    D E S C R I T P I O N  
//

require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id']+0; $isnew = ($id<=0); $is_cancelled = ($id==-99999301270); // see (*ld02*)
$vid = $_POST['visitorId']; if(!is_numeric($vid)) die('Missing data... <command>logoff</command>');

$dS_visitor = false;
$dS_reservation = false;
if($vid) {
	$dS_visitor = new C_dS_visitor($vid);
	if($dS_visitor->groupId != $accountId) die('Try to stay in your playground... <command>logoff</command>');
	$dS_file = new C_dS_file($id, $accountId, $_POST);
}
// else if none of resaId or visitorId is specified, we are in a shit


if($isnew) { // here we make sure that the file extension is a lower case string

	$filename = $dS_file->filename; //$_POST['filename'];
	$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
	$fn = pathinfo($filename, PATHINFO_FILENAME);
	$dS_file->filename = $fn.'.'.$ext;
	
	echo 'this is a new file to the collection:'.$nl;
	echo 'name: '.$fn.$nl;
	echo 'extn: '.$ext.$nl;
	echo '---------------------------------------'.$nl;

}


if($is_cancelled) { // cancelling the upload 
	$expected = $accountId.'_'.$vid.'_0'; $pathname_exp = C_dS_file::$filesdir.$expected.'.'.$ext; // see (*F01*)
	$r = false; if(file_exists($pathname_exp)) $r = unlink($pathname_exp);
	
	echo $nl;
	if(!$r) echo 'there was no such file to remove'.$nl;
		else echo 'file successfully cleaned up'.$nl;
	// if(!$r) echo 'there was no such file to remove ('.$pathname_exp.')'.$nl;
		// else echo 'file successfully cleaned up ('.$pathname_exp.')'.$nl;
	echo $nl;
}
else { // confirming the upload

	$dS_file->dSsave();
	$id = $dS_file->id; // fresh new when the dataSet is <= 0


	if($isnew) { // check if the file has been uploaded correctly (by /post/file.php). If so, the file gets its final name here. the name includes the dS_file->id

		echo $nl.'This is a new file upload'.$nl; 
		$expected = $accountId.'_'.$vid.'_0'; 		$pathname_exp = C_dS_file::$filesdir.$expected.'.'.$ext; // see (*F01*)
		$renameto = $accountId.'_'.$vid.'_'.$id;	$pathname_rto = C_dS_file::$filesdir.$renameto.'.'.$ext;
		$r = false;
		if(file_exists($pathname_exp)) $r = rename($pathname_exp, $pathname_rto);
		if(!$r) echo 'The new file could NOT be renamed'.$nl;
			else echo 'New file properly renamed'.$nl;
		// if(!$r) echo 'The new file could NOT be renamed to '.$pathname_rto.$nl;
			// else echo 'New file properly renamed to '.$pathname_rto.$nl;
		echo $nl;
	}


	echo '<code>';
	echo $dS_file->stream1(with_tracking);
	echo '</code>';

}

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'p_file');
?>