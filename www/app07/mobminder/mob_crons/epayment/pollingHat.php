#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////
//
// S O F T P A Y  &  G O C R Y P T O
// 
// H A T   P R O C E S S
// 
// callback is not implemented on server side as in payconiq paymean
// temporary solution is polling the 2 servers in realtime 
// cron hat does not directly call softpay and gocrypto server itself (=serial process)
// but it makes asynchronous calls to local php page (softpayioCronFiveMinutesThread.php) for simulating multi-thread calls (same process as init bulk in cronofy calls, =parallel process)
// each local curl will starts a curl to external serveur api.
//
//////////////////////////////////////////////////////////////////////////////////////////

define('crontest', false); 	// when maintaining this page, pass this parameter to true so you can easily call the page and test it
							//crontest only displays echo and change required libraries path
define('executionTime', crontest?1:60);	// number of polling execution to do, default = 60 because the cron runs every minute


if(crontest) echo '<br/>';

$systemLog = 'polling payment cron';
if(crontest) { // when running it locally
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/softpayio.php';
	require '../../lib_mobphp/gocrypto.php';
	require '../../lib_mobphp/onlinepayment.php';
	

	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
}
else {  // when running in production
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/softpayio.php'; 
	require '/var/www/mobminder/lib_mobphp/gocrypto.php';
	require '/var/www/mobminder/lib_mobphp/onlinepayment.php';
	//require '../dbio.php';  
	//require '../softpayio.php';
	//require '../gocrypto.php';
}


//one execution process, called X times
//$paymeans : liste of paymean separated by coma
//$transtatus : transtatus filter
//$olderminute : filter on payment older than olderminute minutes
function onePollingExecution($paymeans,$transtatus,$olderminute=0)
{
	$dS_system = new C_dS_system();
	
	$payments = new C_dbAccess_payments();
	
	$payments->loadByPaymeanAndTransStatus($paymeans,$transtatus,$olderminute);

	if($payments->count()>0)
	{
		if(crontest) echo 'pending payments = '.$payments->count().'<br/>';

		foreach($payments->keyed as $id => $dS_payment) //loop in each pending payment
		{
			if(crontest) echo 'payement id ='.$dS_payment->id.'<br/>';

			//check if alive counter is not execeeded before to call pay server
			//provider_threshold==0 => check is disabled
			
			if(C_dS_system::$provider_threshold!=0)
			{
				if(	$dS_payment->paymean == paymean_softpos_softpay 
					&& 	$dS_system->is_SoftPay_alive>C_dS_system::$provider_threshold)
				{
					if(crontest) echo 'softpos alive counter exceeded => no polling'.'<br/>';
					continue;
				}
				else if(	$dS_payment->paymean == paymean_hardpos_done4you 
							&& $dS_system->is_HardPay_alive>C_dS_system::$provider_threshold)
				{
					if(crontest) echo 'hardpos alive counter exceeded => no polling'.'<br/>';
					continue;
				}
				else if(	($dS_payment->paymean == paymean_payconiq || $dS_payment->paymean == paymean_onlinepayco) 
							&& $dS_system->is_Payconiq_alive>C_dS_system::$provider_threshold)
				{
					if(crontest) echo 'payconiq alive counter exceeded => no polling'.'<br/>';
					continue;
				}
			}
			

			usleep(10000); // wait 10.000 us = 10 ms (avoid freezing local and target server)

			$data = array(
				'paymentid' => $dS_payment->id,
			);

			//calls utf8ize else json_encode fails!
			$data = utf8ize($data);

			//asynchronous call to local page (one call by payment polling)
			$curl = curl_init();
			if(crontest)
			{
				curl_setopt($curl, CURLOPT_URL, 'http://192.168.0.37/mobminder/self/epayment/pollingThread.php');  // for local testing see (*curl 01*)
				//curl_setopt($curl, CURLOPT_URL, 'http://localhost/app05/self/epayment/pollingThread.php');  // for local testing see (*curl 01*)
			}
			else
			{
				curl_setopt($curl, CURLOPT_URL, 'https://self.mobminder.com/epayment/pollingThread.php');
			}

			curl_setopt($curl, CURLOPT_POST, 1);
			curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
			curl_setopt($curl, CURLOPT_VERBOSE, false);
			curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
			curl_setopt($curl, CURLOPT_TIMEOUT_MS, 1000);
			
			$response = curl_exec($curl);
			$httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            
			curl_close($curl);
			
            if(substr($httpStatus,0,1)!='2')
            {
				if(crontest)
                	echo 'curl returned value = '.$httpStatus.'-'.$response.'<br/>';
				else
					echo 'curl returned value = '.$httpStatus.'-'.$response.chr(10);
            }
			else
			{
				if(crontest) echo 'curl returned value = '.$httpStatus.'-'.$response.'<br/>';
			}
		}
	}
	else
	{
		if(crontest) echo 'no payment found'.'<br/>';
	}
}



$starttime = new C_date();


$timeoutminutes=10;
if(crontest) echo 'starting force payment to expired if softpay or gocrypto payment is pending for '.$timeoutminutes.' minutes<br/>';
$payments = new C_dbAccess_payments();
$payments->loadByPaymeanAndTransStatus(paymean_softpos_softpay.','.paymean_hardpos_done4you,payment_status_pending,$timeoutminutes); 
foreach($payments->keyed as $id => $dS_payment) //loop in each pending payment
{
	if(crontest) echo 'expired payment found with id ='.$dS_payment->id.' => force status to expired<br/>';
	$dS_payment->transtatus = payment_status_expired;
	$dS_payment->opstatus = 'mob timeout ('.$timeoutminutes.')';
	//$dS_payment->qrcodestring='';
	//$dS_payment->accountholder = '';
	//$dS_payment->accountIBAN = '';
	$dS_payment->dSsave();
}
$timeoutminutes=25; 
if(crontest) echo 'starting force payment to expired if payconiq payment is pending for '.$timeoutminutes.' minutes<br/>';
$payments->loadByPaymeanAndTransStatus(paymean_payconiq.','.paymean_onlinepayco,payment_status_pending,$timeoutminutes); 
foreach($payments->keyed as $id => $dS_payment) //loop in each pending payment
{
	if(crontest) echo 'expired payment found with id ='.$dS_payment->id.' => force status to expired<br/>';
	$dS_payment->transtatus = payment_status_expired;
	$dS_payment->opstatus = 'mob timeout ('.$timeoutminutes.')';
	$dS_payment->qrcodestring='';
	//$dS_payment->accountholder = '';
	//$dS_payment->accountIBAN = '';
	$dS_payment->dSsave();
}


$timeoutminutes=10; 
if(crontest) echo 'starting force payment to expired if cards payment is pending for '.$timeoutminutes.' minutes<br/>';
$payments->loadByPaymeanAndTransStatus(paymean_cards.','.paymean_onlinecards.','.paymean_onlinebcontact,payment_status_pending,$timeoutminutes); 
foreach($payments->keyed as $id => $dS_payment) //loop in each pending payment
{
	if(crontest) echo 'expired payment found with id ='.$dS_payment->id.' => force status to expired<br/>';
	$dS_payment->transtatus = payment_status_expired;
	$dS_payment->opstatus = 'mob timeout ('.$timeoutminutes.')';
	$dS_payment->qrcodestring='';
	//$dS_payment->accountholder = '';
	//$dS_payment->accountIBAN = '';
	$dS_payment->dSsave();
}


if(crontest) echo 'starting loop in pending softpay and gocryptp<br/>';


//algorithm stops after 60 sec or 60 executions
$maxExecutionTime = executionTime; // 60 seconds (1 minute)
$maxIterations = $maxExecutionTime; // Maximum number of loop iterations, same as maxExecutionTime

$startTime = microtime(true); // Get the current time in seconds with milliseconds

for ($i = 0; $i < $maxIterations; $i++) {
  
	//if(crontest) echo 'calling execution<br/>';

 	//load all pending softpay payments for softpay and gocrypto paymean, without any delay
	//no need to load paymean_onlinepayco because booking payconiq payment timeout is managed by prebooking expiration cron
	onePollingExecution(paymean_softpos_softpay.','.paymean_hardpos_done4you,payment_status_pending);
		
	//wait 1 second between 2 iterations
	sleep(1);

    // Check if the maximum execution time has been reached
    $currentTime = microtime(true);
    $elapsedTime = $currentTime - $startTime;
    
    if($elapsedTime >= $maxExecutionTime) {
        //echo "Maximum execution time reached. Loop iterations: $i";
        break;
    }
}
if(crontest) echo 'Loop completed with iterations = '.$i.'<br/>';

if(crontest) echo 'starting check payconiq pending older than 21 minutes<br/>';
onePollingExecution(paymean_payconiq.','.paymean_onlinepayco,payment_status_pending,21); //+created date older than 21 minutes (payconiq timeout is 20 minutes)

//cannot poll computop api because interface function does not exists
//if(crontest) echo 'starting check computop pending older than 6 minutes<br/>';
//onePollingExecution(paymean_cards.','.paymean_onlinecards,payment_status_pending,6); //+created date older than 21 minutes (payconiq timeout is 20 minutes)



if(crontest) echo 'end<br/>';

////////////////////////////////////////////////////////////////////////////////////////////////
$endtime = new C_date();
$delta = $endtime->t - $starttime->t;
$start = 	'EXECUTION STARTED: '.$starttime->getDateTimeString();
$done = 	'DONE: '.$endtime->getDateTimeString();
$delta = 	'DELTA: '.$delta.'sec';

if(crontest) { // testing locally displays HTML back to client
	echo '<br/><br/>TENS CRON TEST<br/>';
	echo $start.'<br/>'.$done.'<br/>'.$delta.'<br/>';
	echo '</body>';
	echo '</html>';
	
} else { // running in CLI mode, outputs to /var/log/mobminder-cron-hourly.log
	echo $start.'-'.$done.'-'.$delta.chr(10);
	//echo $done.chr(10);
}

//convert post fields to utf8 format
function utf8ize($mixed) 
{
    if(is_array($mixed)) 
    {
        foreach ($mixed as $key => $value) 
        {
            $mixed[$key] = utf8ize($value);
        }
    } 
    elseif(is_string($mixed)) 
    {
        return mb_convert_encoding($mixed, 'UTF-8', 'UTF-8');
    }
    return $mixed;
}




?>