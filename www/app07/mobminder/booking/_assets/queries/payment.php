<?php


ob_start(); // relates to (*ob1)
	
//require '../classes/language.php';
//$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 

$id = @$_POST['id']; 


$dS_payment = new C_dS_payment($id);
//check if payement exists//////////////////////////////////////////

$dS_resa = new C_dS_reservation($dS_payment->groupId);

$dS_account = new C_dS_group($dS_resa->groupId);

// stream the visitor if any found, along with his appointments

$bank = 'visiapps';
echo '<code>';

//solution for displaying account location timezone see (*dtacc01*)
C_date::setTimeParameters($dS_account);
$dS_resa->addmeta_datetimeVerbose();
echo $dS_resa->stream1(false, $bank).$nl;
echo $dS_payment->stream1(with_tracking, $bank); //with_tracking
echo '</code>';

closeconnection(); 
?>