<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    L O G O    D E S C R I T P I O N  
//

require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id']+0; $isnew = ($id<=0); $is_cancelled = ($id==-99999301270); // see (*ld01*)
$lid = $_POST['loginId'];




if($lid) {
	$dS_login = new C_dS_login($lid);
	if($dS_login->groupId != $accountId) die('Try to stay in your playground... <command>logoff</command>'); // 
}

$dS_logo = new C_dS_logo($id, $accountId, $_POST);


if($isnew) { // here we make sure that the file extension is a lower case string

	$filename = $dS_logo->filename; //$_POST['filename'];
	$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
	$fn = pathinfo($filename, PATHINFO_FILENAME);
	$dS_logo->filename = $fn.'.'.$ext;
	
	echo 'this file is a new to the collection:'.$nl;
	echo 'name: '.$fn.$nl;
	echo 'extn: '.$ext.$nl;
	echo '---------------------------------------'.$nl;

}


if($is_cancelled) { // cancelling the upload 
	$expected = $accountId.'_'.$lid.'_0'; $pathname_exp = C_dS_logo::$filesdir.$expected.'.'.$ext; // see (*F01*)
	$r = false; if(file_exists($pathname_exp)) $r = unlink($pathname_exp);
	
	echo $nl;
	if(!$r) echo 'there was no such file to remove'.$nl;
		else echo 'file successfully cleaned up'.$nl;
	// if(!$r) echo 'there was no such file to remove ('.$pathname_exp.')'.$nl;
		// else echo 'file successfully cleaned up ('.$pathname_exp.')'.$nl;
	echo $nl;
}
else { // confirming the upload
	$dS_logo->dSsave();
	$id = $dS_logo->id; // fresh new when the dataSet is <= 0

	if($isnew) { // check if the file has been uploaded correctly (by /post/file.php). If so, the file gets its final name here. the name includes the dS_logo->id

		echo $nl.'This is a new file upload'.$nl; 
		// right after a call to /post/file.php, the stored file in /mobfiles/_logos goes by 'aid_loginid_0.ext', e.g. 3008_8475_0.jpg, whre you pay attention to the zero _0 value
		// now that we actually confirm the upload, we can add the C_dS_logo.id that was undefined so far
		$expected = $accountId.'_'.$lid.'_0'; 		$pathname_exp = C_dS_logo::$filesdir.$expected.'.'.$ext; // see (*F01*)
		$renameto = $accountId.'_'.$lid.'_'.$id;	$pathname_rto = C_dS_logo::$filesdir.$renameto.'.'.$ext;
		$r = false;
		if(file_exists($pathname_exp)) $r = rename($pathname_exp, $pathname_rto);
		if(!$r) echo 'The new file could NOT be renamed'.$nl;
			else echo 'New file properly renamed.'.$nl;
		// if(!$r) echo 'The new file could NOT be renamed to '.$pathname_rto.$nl;
			// else echo 'New file properly renamed to '.$pathname_rto.$nl;
		echo $nl;
	}


	echo '<code>';
	echo $dS_logo->stream1(with_tracking);
	echo '</code>';
}

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'p_file');
?>