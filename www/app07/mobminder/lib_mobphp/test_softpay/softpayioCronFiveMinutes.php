#!/usr/bin/php5 -q
<?php


define('crontest', true); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
if(crontest) echo '<br/>';

$systemLog = 'softpay cron';
if(crontest) { // when running it locally
	require '../dbio.php';  
	require '../softpayio.php';
	require '../gocrypto.php';

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
}

$starttime = new C_date();

//////////////////////////////////////////////////////////////////////////////////////////
// SOFTPAY
//////////////////////////////////////////////////////////////////////////////////////////
$payments = new C_dbAccess_payments();

//load all pending softpay payments
$payments->loadByPaymeanAndTransStatus(paymean_softpos_softpay,payment_status_pending);
if($payments->count()>0)
{
	if(crontest) echo 'softpay payment found = '.$payments->count().'<br/>';
	foreach($payments->keyed as $id => $dS_payment) 
	{
		if(crontest) echo 'softpay payement id ='.$dS_payment->id.'<br/>';

		usleep(10); // = 100 curl/seconde

		C_dbIO::$loggedId = $dS_payment->creatorId;

		$dS_reservation = new C_dS_reservation($dS_payment->groupId); 
		if(!$dS_reservation->id) continue;

		$dS_account = new C_dS_group($dS_reservation->groupId);
		if(!$dS_account->id) continue;

		//call softpay get transaction api (param = softpay requestId wich is stored as transid in payment)
		$resgettrans = CheckSoftPayStatus($dS_account,$dS_payment->transid); // might take up to 100ms
		if(!$resgettrans)
		{
			if(crontest) echo 'calling softpay get transaction with error for account='.$dS_account->name.' and requestid='.$dS_payment->transid.'<br/>';
			continue;
		}

		if(crontest) echo 'calling softpay get transaction with success for account='.$dS_account->name.' and requestid='.$dS_payment->transid.'<br/>';

		$status = $resgettrans->state;

		if(crontest) echo 'CheckSoftPayStatus : softpay status = '.$status.'<br/>';

		switch($status) { 
			case softpay_state_completed: 
				if(crontest) echo 'CheckSoftPayStatus : softpay status = '.payment_status_success.'<br/>';
				$dS_payment->transtatus = payment_status_success;
				$dS_payment->accountIBAN = $resgettrans->partialPan;
				break;
			case softpay_state_declined:
			case softpay_state_cancelled:
				if(crontest) echo 'CheckSoftPayStatus : softpay status = '.payment_status_failed.'<br/>';
				$dS_payment->transtatus = payment_status_cancelled;
				break;

			case softpay_state_failed:
				if(crontest) echo 'CheckSoftPayStatus : softpay status = '.payment_status_failed.'<br/>';
				$dS_payment->transtatus = payment_status_failed;
				break;
			default: 
			//softpay_state_processing(PROCESSING) -> nothing to do
		}

		switch($status) { 
			case softpay_state_completed: 
			case softpay_state_declined:
			case softpay_state_cancelled:
			case softpay_state_failed:
				$appid = $resgettrans->appId;
				$responseCode = $resgettrans->responseCode;
				$dS_payment->opstatus = $status.(empty($appid)?'':'-'.$responseCode.'-'.$appid);
				$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
				$dS_payment->dSsave();
			default: 
			//softpay_state_processing(PROCESSING) -> nothing to do
		}
	}
}
else
{
	if(crontest) echo 'no softpay payment found'.'<br/>';
}

//////////////////////////////////////////////////////////////////////////////////////////
// GOCRYPTO
//////////////////////////////////////////////////////////////////////////////////////////

$payments = new C_dbAccess_payments();
$payments->loadByPaymeanAndTransStatus(paymean_hardpos_done4you,payment_status_pending);
if($payments->count())
{
	if(crontest) echo 'gocrypto payment found = '.$payments->count().'<br/>';
	foreach($payments->keyed as $id => $dS_payment) 
	{
		if(crontest) echo 'gocrypto payement id ='.$dS_payment->id.'<br/>';

		usleep(100);

		C_dbIO::$loggedId = $dS_payment->creatorId;

		$dS_reservation = new C_dS_reservation($dS_payment->groupId); 
		if(!$dS_reservation->id) continue;

		$dS_account = new C_dS_group($dS_reservation->groupId);
		if(!$dS_account->id) continue;

		$status = checkGoCryptoStatus($dS_account,$dS_payment->transid);
		if(!$status)
		{
			if(crontest) echo 'calling gocrypto get transaction with error for account='.$dS_account->name.' and requestid='.$dS_payment->transid.'<br/>';
			continue;
		}

		if(crontest) echo 'calling gocrypto get transaction with success for account='.$dS_account->name.' and requestid='.$dS_payment->transid.'<br/>';

		if(crontest) echo 'checkGoCryptoStatus : gocrypto status = '.$status.'<br/>';

		switch($status) { 
			case gocrypto_state_success: 
				if(crontest) echo 'checkGoCryptoStatus : gocrypto status = '.payment_status_success.'<br/>';
				$dS_payment->transtatus = payment_status_success;
				$dS_payment->accountholder = '';
				$dS_payment->accountIBAN = '';
				$dS_payment->opstatus = $status;
				$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
				$dS_payment->dSsave();
				break;
			
			case gocrypto_state_declined: 
			case gocrypto_state_terminated: 
			case gocrypto_state_aborted: 

				if(crontest) echo 'checkGoCryptoStatus : gocrypto status = '.payment_status_cancelled.'<br/>';
				$dS_payment->transtatus = payment_status_cancelled;
				$dS_payment->accountholder = '';
				$dS_payment->accountIBAN = '';
				$dS_payment->opstatus = $status;
				$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
				$dS_payment->dSsave();
				break;
				
			case gocrypto_state_expired: 
				if(crontest) echo 'checkGoCryptoStatus : gocrypto status = '.payment_status_expired.'<br/>';
				$dS_payment->transtatus = payment_status_expired;
				$dS_payment->accountholder = '';
				$dS_payment->accountIBAN = '';
				$dS_payment->opstatus = $status;
				$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
				$dS_payment->dSsave();
				break;
			
			case gocrypto_state_failed: 
			case gocrypto_state_underpaid: 
				if(crontest) echo 'checkGoCryptoStatus : gocrypto status = '.payment_status_failed.'<br/>';
				$dS_payment->transtatus = payment_status_failed;
				$dS_payment->accountholder = '';
				$dS_payment->accountIBAN = '';
				$dS_payment->opstatus = $status;
				$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
				$dS_payment->dSsave();
				break;
			default: break;
		}
	}
}
else
{
	if(crontest) echo 'no gocrypto payment found'.'<br/>';
}




////////////////////////////////////////////////////////////////////////////////////////////////
$endtime = new C_date();
$delta = $endtime->t - $starttime->t;
$start = 	'EXECUTION STARTED: '.$starttime->getDateTimeString();
$done = 	'DONE: '.$endtime->getDateTimeString();
$delta = 	'DELTA: '.$delta.'sec';

if(crontest) { // testing locally displays HTML back to client
	echo '<br/><br/>TENS CRON TEST<br/>';
	echo '</body>';
	echo '</html>';
	echo $start.'<br/>'.$done.'<br/>'.$delta.'<br/>';

} else { // running in CLI mode, outputs to /var/log/mobminder-cron-hourly.log
	echo $start.'-'.$done.'-'.$delta.chr(10);
	//echo $done.chr(10);
}


?>