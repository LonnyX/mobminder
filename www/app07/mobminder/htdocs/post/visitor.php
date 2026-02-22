<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    V I S I T O R  
//

sleep(0); // this is to test the fade and spinner effects during save time

$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id']; 			if(!is_numeric($id)) die('error 66101');
$iseresa = @$_POST['iseresa']; // see (*ea03*)

$duplicates = @$_POST['duplicates']; // duplicates is not sent from e-reservation
$solve = @$_POST['solve']; // solve is sent from e-reservation, it allows to merge automatically a duplicate registration onto an existing visitor's file
if(!isset($_POST['language'])) $_POST['language'] = $dS_login->language;


$dS_visitor = new C_dS_visitor($id, $accountId, $_POST);
$dS_visitor->mobile = checkMobileFormat($dS_visitor->mobile, $dS_account->phoneRegion);
$dS_visitor->email = trim(strtolower($dS_visitor->email));


if($id <= 0) if(isset($solve)) { // before recording this data, check if an existing visitor is likely to be the same person
	
	// NOTE: this functionality is not yet implemented, see dS_visitor::findclone()
	
	$dS_visisolve = $dS_visitor->findclone(); // returns false if no clone was found, returns a dS_visitor if a clone was found
	if($dS_visisolve) { $id = $dS_visisolve->id; $dS_visitor = $dS_visisolve; }
}

$dS_visitor->dSsave();

if(isset($duplicates)) { // another (or others) file have been created for a unique person, and we need to merge them

	$duplicates = $duplicates=='-' ? Array() : explode('!', $duplicates);
	if(count($duplicates)) {
		echo 'Duplicates resolution:'.$nl;
		foreach($duplicates as $visiId) {
			
			if($visiId == $id) continue;
			$dS_duplicate = new C_dS_visitor($visiId);
			echo chr(9).'deleting id '.$visiId.', '.$dS_duplicate->lastname.$nl;
			$dS_duplicate->mergeTo($id, $dS_account, $dS_visitor);			
			
		}
		echo $nl;
	}
}

if(isset($iseresa)) { // see (*ea03*)
	echo 'visitor created from e-reservation'.$nl.$nl;
	$_SESSION['e-visi'] = $dS_visitor->id; // see (*ea02*), in case of new visitor registration, we arrive here
}
session_write_close(); 

echo '<code>';
echo $dS_visitor->stream1(with_tracking);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_visitor');
?>