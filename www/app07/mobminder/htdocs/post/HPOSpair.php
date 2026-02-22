<?php
//////////////////////////////////////////////////////////////////////
//
//    P A I R   H P O S   D E V I C E
//
// HPOS = Hardware Point Of Sale (or more concretely a payment terminal)
//

//require '../classes/language.php';
$loadcontext = 1; 
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
require '../../lib_mobphp/onlinepayment.php';
require '../../lib_mobphp/softpayio.php';
require '../../lib_mobphp/gocrypto.php';
$perfReport = new C_perfReport(); 
$perfReport->peak('::session retrieved');

	$id = @$_POST['id']; if(!isset($id)) die('Not allowed.'); 
	if(!is_numeric($id)) die('Bad format for id not accepted.'); 
	
	$tab = $_POST['tabs']; // can be 0 or 1, see (*hp10*)
	if(!isset($tab)) die('Bad tab.');
	
	if($tab==0) { // pairing, see (*hp10*)
		
		$name = @$_POST['name']; if(!isset($name)) die('Bad name.'); $name = substr($name, 0, 64);
		$otp = @$_POST['otp']; if(!isset($otp)) die('Error.'); $otp = substr($otp, 0, 8);
	
		$res = initializeTerminal($dS_account,$otp,$name); // dS_account comes initialized with ajax_session.php and $loadcontext = 1;
		if($res) echo 'terminal initialized with success'.$nl; 
		else echo 'failed to initialize terminal'.$nl; 
		
		// $dS_account->ePayHardPayClientId = 'PAIRED'; // For testing purpose
		// $dS_account->ePayHardPayClientSecret = 'PAIRED'; 
		// $dS_account->ePayHardPayToken = 'PAIRED';
		
	} else if($tab==1) { // unpairing
		
		$res = resetTerminal($dS_account);
        if($res) echo 'terminal reset with success'.$nl; 
        else echo 'failed to reset terminal'.$nl;
		
		// $dS_account->ePayHardPayClientId = '';  // For testing purpose
		// $dS_account->ePayHardPayClientSecret = ''; 
		// $dS_account->ePayHardPayToken = '';
	}
	
	sleep(1);
	echo $nl;
	echo '<code>';
	echo '#C_dS_group'.$nl.$dS_account->stream(with_tracking).$nl;
	echo '</code>';
	
$perfReport->peak('::completed');
$perfReport->dropReport();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>