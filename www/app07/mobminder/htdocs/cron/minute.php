#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
// - Time management of delayed notfication (decrementing counters), and sending those messages
//
//


define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('faketime', '2024-11-13 23:30:00'); // watch the line where sendOver() is called !!

$faketime = false;
if(crontest)	// when testing, we MUST use the defined faketime constant
	$faketime = faketime;

if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
	$faketime = $_GET['fkt'];


$systemLog = 'minute cron';
if(crontest) { // when running it locally
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/mblox.php';
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
	echo '<body>';

}
else {  // when running in production
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/mblox.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}

$starttime = new C_date($faketime);


////////////////////////////////////////////////////////////////////////////////////////////////
//


// Send delayed notifications
//

C_dbAccess_delayedNotifs::tempo(); // decrements the counters
$ripy = new C_dbAccess_delayedNotifs(0); // load items having counter arrived to zero
$ripy->sendNotifications(); // send emails or sms
$ripy->deleteAll(); // clean up treated items


// Send alerts 
//

C_dS_system::checkCredits(crontest); // checks all accounts todayEMLremains and todaySMSremains, sends an email if credit is over, see (*cr10*)





// Remove timed out pre-bookings
//


//2022-11-11 BSP /////////////////////////////////////////////////////////////////

//comment old code version:
	//C_dbAccess_prebookings::tempo(); // decrements the counters
	//$ripe = new C_dbAccess_prebookings(0); // load items having counter arrived to zero
	//$ripe->dropExpiredReservations(); // send emails or sms
	//$ripe->deleteAll(); // clean up treated items

	//new code version :
C_dbAccess_prebookings::tempo(); // decrements the counters
$ripe = new C_dbAccess_prebookings(0); // load items having counter arrived to zero

$resaids = array();
foreach($ripe->keyed as $id => $dS_prebooking) $resaids[] = $dS_prebooking->reservationId;
$ripe->dropExpiredReservations(); 


//BSP - call payconiq DELETE API for each pending payment ////////
//echo "resaids count = ".count($resaids)."</br>";
if(crontest) 	require '../../lib_mobphp/onlinepayment.php';
else 			require '/var/www/mobminder/lib_mobphp/onlinepayment.php'; 
foreach($resaids as $rid)
{
	$payments = new C_dbAccess_payments('', $rid);
	//echo "payments count = >".$payments->count()."</br>";
	if ($payments->count()>=0)
	{
		//echo "payments count >0</br>";
		$dS_resa = new C_dS_reservation($rid);
		$dS_account = new C_dS_group($dS_resa->groupId);

		foreach($payments->keyed as $id => $dS_payment) 
		{
			if ($dS_payment->transtatus==payment_status_pending || $dS_payment->transtatus==payment_status_identified)
			{
				if ($dS_payment->paymean==paymean_onlinepayco)
				{
					$payconiqkey = $dS_account->ePayconiqKey;
					//echo "payconiqkey=".$payconiqkey."</br>";

					$interface = new C_PayconiqGateaway($payconiqkey);
					$result = $interface->cancelPayment($dS_payment->transid);
					if (!$result)
					{
						//echo "call payconiq delete failed";
						C_dS_exception::put('cron/minute.php', 'payconiq error',$interface->lasthttpcode.":".$interface->lasterrorcode."-".$interface->lasterrormessage);
					}
					else
					{
						//echo "call payconiq delete ok";
					}
				}
			}
		}
	}
}
$ripe->deleteAll(); // clean up treated items
///2022-11-11 BSP END/////////////////////////////////////////////////////////////////



// Check and execute cronofy initializations
//bsp-begin
/////////////////////////////////////////////////////////////////
// CALL CRONOFY MINUTE TASKS
// created by bspoden
/////////////////////////////////////////////////////////////////
if(crontest) { // when running it locally
	require '../../lib_cronofy/cronofymanager.php';
	include '../cronofy/cron/minute.php';
	
} else {  // when running in production
	require '/var/www/mobminder/lib_cronofy/cronofymanager.php';
	include '/var/www/mobminder/htdocs/cronofy/cron/minute.php';
}
//bsp-end






////////////////////////////////////////////////////////////////////////////////////////////////
//
$endtime = new C_date($faketime);
	$o_dS_system = new C_dS_system();
	$o_dS_system->setTensRun($starttime->t);
	

if(crontest) { // testing locally displays HTML back to client

			echo '<br/><br/>TENS CRON TEST - '.$faketime;
		echo '</body>';
	echo '</html>';
	
} else { // running in CLI mode, outputs to /var/log/mobminder-cron-hourly.log

		$now = new C_date();
		$delta = $endtime->t - $starttime->t;
		$start = 	'EXECUTION STARTED: '.$starttime->getDateTimeString();
		$done = 	'  DONE: '.$endtime->getDateTimeString();
		$delta = 	'  DELTA: '.$delta.'sec';
		// echo $start.$done.$delta.chr(10);
		echo $done.chr(10);
}


?>