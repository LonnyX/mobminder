<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    V I S I T O R  
//


ob_start();
$loadcontext = 1; 
require '../classes/ajax_session.php'; 

if (isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
session_write_close(); 


$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];
$solve = @$_POST['solve']; // solve is sent from e-reservation, it allows to merge automatically a duplicate registration onto an existing visitor's file
if(!isset($_POST['language'])) $_POST['language'] = $dS_login->language;

C_dbIO::logged($dS_login,'(eresa)'); // sign any change in DB

$dS_visitor = new C_dS_visitor($id, $accountId, $_POST);
$dS_visitor->mobile = checkMobileFormat($dS_visitor->mobile, $dS_account->phoneRegion);
$dS_visitor->email = trim(strtolower($dS_visitor->email));


if($id <= 0) if(isset($solve)) { // before recording this data, check if an existing visitor is likely to be the same person
	
	// NOTE: this functionality is not yet implemented, see dS_visitor::findclone()
	
	$dS_visisolve = $dS_visitor->findclone(); // returns false if no clone was found, returns a dS_visitor if a clone was found
	if($dS_visisolve) { $id = $dS_visisolve->id; $dS_visitor = $dS_visisolve; }
}

$dS_visitor->dSsave();

echo '<code>';
echo $dS_visitor->stream1(with_tracking);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_visitor');
closeconnection();
?>