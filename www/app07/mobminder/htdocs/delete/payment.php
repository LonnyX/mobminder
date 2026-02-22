<?php

//////////////////////////////////////////////////////////////////////
//
//    D E L E T I N G    P A Y M E N T 

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
$bank = $_POST['bank'];

	$dS_payment = new C_dS_payment($id);
	
echo '-';
print_r($dS_payment);
echo '-';

	$dS_payment->transtatus = payment_status_cancelled;
	$dS_payment->dSsave();
			
echo '<code>';
echo '#C_dS_payment#'.$bank.$nl.$dS_payment->stream(with_tracking).$nl;
echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'd_payment');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>