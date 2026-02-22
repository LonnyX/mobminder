<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y   P A Y M E N T (s)
//

//require '../classes/language.php';
//$loadcontext = 1; 
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); 
$perfReport->peak('::session retrieved');

	$ids = @$_POST['ids']; if(!isset($ids)) die('EP_Err_101'); else $pids = explode('!',$ids);  // be able to treat inputs like 00001!00002!00087
	$digits = str_replace('!','',$ids); if(!is_numeric($digits)) die('EP_Err_102');
	$select = str_replace('!',',',$ids);
	
	echo 'pid\'s: '.$select.$nl.$nl;
	
	$payments = new C_dbAccess_payments();
	$payments->loadOnId($select);
	// if(count($pids)) {
		// foreach($payments->keyed as $pid => $dS_pay) {
			
		// }
	// }
	
	// $dS_resa = new C_dS_reservation($dS_payment->groupId); // payments group to a reservation
	
	$bank = 'plitems';
	echo '<code>';
	echo $payments->stream(no_alias, $bank, with_tracking);
	// echo $dS_resa->stream1(false, $bank).$nl;
	echo '</code>';
	
$perfReport->peak('::completed');
$perfReport->dropReport();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>