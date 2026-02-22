<?php
//////////////////////////////////////////////////////////////////////
//
//  Q U E R Y    A    F I L E   (the browser will pop-up the "open file event")
//

$id = $_GET['id']+0; 
$_POST['k'] = @$_GET['k']; 
$_POST['b'] = @$_GET['b']; 

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$fileclass = @$_GET['c'];
switch($fileclass) { // file owner class
	
	case 'C_dS_visitor':
			$dS_file = new C_dS_file($id, $accountId, $_POST);	
			$dS_visitor = new C_dS_visitor($dS_file->visitorId);
		if($dS_visitor->groupId != $accountId) die('Try to stay in your fileground...');
		
		$filename = $dS_file->filename; // as returned to user (we return him the same filename he gave to us)
		$fname = $accountId.'_'.$dS_file->visitorId.'_'.$dS_file->id; // as extracted from our server
		$filename = str_replace(' ','_',$filename);
		
			$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
		$pathname = C_dS_file::$filesdir.$fname.'.'.$ext; // this path is relative to /query/file.php, which is where this script is executed	
		break;
	
	case 'C_dS_reservation':
			$dS_file = new C_dS_resafile($id, $accountId, $_POST);	
			$dS_reservation = new C_dS_reservation($dS_file->reservationId);
		if($dS_reservation->groupId != $accountId) die('Try to stay in your fileground...');
		
		$filename = $dS_file->filename; // as returned to user (we return him the same filename he gave to us)
		$fname = $accountId.'_'.$dS_file->reservationId.'_'.$dS_file->id; // as extracted from our server
		$filename = str_replace(' ','_',$filename);
		
			$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
		$pathname = C_dS_resafile::$filesdir.$fname.'.'.$ext; // this path is relative to /query/file.php, which is where this script is executed	
		break;
		
	case 'C_dS_logo':
		$dS_logo = new C_dS_logo($id);	
		if($dS_logo->groupId != $accountId) die('Try to stay in your logoground...');
		
		$filename = $dS_logo->filename;
		$fname = $accountId.'_'.$dS_logo->loginId.'_'.$dS_logo->id;
		$filename = str_replace(' ','_',$filename);
		
			$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
		$pathname = C_dS_logo::$filesdir.$fname.'.'.$ext; // this path is relative to /query/file.php, which is where this script is executed
		break;
}


	
// $pathname = C_dS_file::$filesdir.$fname.'.'.$ext;

if(file_exists($pathname)) {
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    // header('Content-Disposition: attachment; filename='.basename($pathname));
    header('Content-Disposition: attachment; filename='.$filename);
    header('Content-Transfer-Encoding: binary');
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($pathname));
    ob_clean();
    flush();
    readfile($pathname);
	exit();
} else {
	echo '1##'.chr(10).'The file was not found:'.$pathname;
}

$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'q_file');
?>