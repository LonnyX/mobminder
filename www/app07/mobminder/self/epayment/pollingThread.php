<?php

//////////////////////////////////////////////////////////////////////////////////////////
//
// S O F T P A Y  &  G O C R Y P T O
// 
// C H I L D   P R O C E S S
// 
// asynchronous called by softpayioCronFiveMinutesHat.php for each payment to poll 
// parameter : paymentid
// 
//////////////////////////////////////////////////////////////////////////////////////////

//polling 


ob_start();

define('debuglog', true); // when maintaining this page, pass this parameter to true so you can easily call the page and test it


require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/softpayio.php';
require '../../lib_mobphp/gocrypto.php';
require '../../lib_mobphp/onlinepayment.php';
require '../../htdocs/lib/php/webrender.php';


closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
//sleep(5); //use a sleep(5) for checking that closeconnection by not slowing return to caller curl from pollingHat
//rmq: do not forget to adapte curl timeout value



function pollingDebugLog($id,$log)
{
    if(debuglog)
    {
        $time = @date('[d/M/Y:H:i:s]');
        $result = file_put_contents('/var/log/www/'.$id.'.log', $time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
    }
}

set_time_limit(60);

$body = file_get_contents('php://input');
if(empty($body))
{
    pollingDebugLog(-1,'error : body is empty');
}
else{

	$data = json_decode($body, true);
	//pollingDebugLog(-1,'body='.$body);

	$paymentid = $data['paymentid'];

	$dS_payment = new C_dS_payment($paymentid); 
	if(!$dS_payment->id) 
	{
		pollingDebugLog(-1,'error : payment id not found = '.$paymentid);
	}
	else{
		C_dbIO::$loggedId = $dS_payment->creatorId;

		$dS_reservation = new C_dS_reservation($dS_payment->groupId); 
		if(!$dS_reservation->id) {
			pollingDebugLog(-1,'error : reservation id '.$dS_payment->groupId.' not found for paymentid '.$paymentid);
		}
		else {

			$dS_account = new C_dS_group($dS_reservation->groupId);
			if(!$dS_account->id) {
				pollingDebugLog(-1,'error : account id not found');
			}
			else
			{
				if($dS_payment->paymean == paymean_softpos_softpay)
				{
					//////////////////////////////////////////////////////////////////////////////////////////
					// SOFTPAY
					//////////////////////////////////////////////////////////////////////////////////////////
					pollingDebugLog($paymentid,'calling softpay api...');

					//call softpay get transaction api (param = softpay requestId wich is stored as transid in payment)
					$resgettrans = CheckSoftPayStatus($dS_account,$dS_payment->transid);
					if(!$resgettrans){
						pollingDebugLog($paymentid,'calling softpay get transaction with error for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
					}
					else
					{
						$status = $resgettrans->state;

						//check if account is a test account => force failed payment to success
						if($status!=softpay_state_completed && isAccountIdTestForPayment($dS_account->id))
						{
							$status=softpay_state_completed;
							$resgettrans->responseCode = 'testing account, status is set to success';
						}


						pollingDebugLog($paymentid,'calling softpay get transaction with success for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
						pollingDebugLog($paymentid,'CheckSoftPayStatus : softpay status = '.$status);

						//first switch (target statut) : select good status (specific code)
						switch($status) { 
							case softpay_state_completed: 
								pollingDebugLog($paymentid,'CheckSoftPayStatus : softpay status = '.payment_status_success);
								$dS_payment->transtatus = payment_status_success;
								$dS_payment->accountIBAN = $resgettrans->partialPan;
								break;
							case softpay_state_declined:
							case softpay_state_cancelled:
								pollingDebugLog($paymentid,'CheckSoftPayStatus : softpay status = '.payment_status_failed);
								$dS_payment->transtatus = payment_status_cancelled;
								break;

							case softpay_state_failed:
								pollingDebugLog($paymentid,'CheckSoftPayStatus : softpay status = '.payment_status_failed);
								$dS_payment->transtatus = payment_status_failed;
								break;
							default: 
							//softpay_state_processing(PROCESSING) -> nothing to do
						}

						//second switch : update others fields and save (common code)
						switch($status) { 
							case softpay_state_completed: 
							case softpay_state_declined:
							case softpay_state_cancelled:
							case softpay_state_failed:
								$appid = $resgettrans->appId;
								$responseCode = $resgettrans->responseCode;
								$dS_payment->opstatus = $status.(empty($appid)?'':'-'.$responseCode.'-'.$appid); //appID may be empty depending of status
								$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
								$dS_payment->dSsave();
							default: 
							//softpay_state_processing(PROCESSING) -> nothing to do
						}
					}
				}
				else if($dS_payment->paymean == paymean_hardpos_done4you)
				{
					//////////////////////////////////////////////////////////////////////////////////////////
					// GOCRYPTO
					//////////////////////////////////////////////////////////////////////////////////////////
					pollingDebugLog($paymentid,'calling gocrypto api...');

					$status = checkGoCryptoStatus($dS_account,$dS_payment->transid);
					if(!$status){
						pollingDebugLog($paymentid,'calling gocrypto get transaction with error for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
					}
					else
					{	
						pollingDebugLog($paymentid,'calling gocrypto get transaction with success for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
						pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.$status);

						//check if accout is a test account => force failed payment to success
						if($status!=gocrypto_state_success && $status!=gocrypto_state_inprogress && isAccountIdTestForPayment($dS_account->id))
						{
							$status=gocrypto_state_success;
						}


						switch($status) { 
							case gocrypto_state_success: 
								pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.payment_status_success);
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

								pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.payment_status_cancelled);
								$dS_payment->transtatus = payment_status_cancelled;
								$dS_payment->accountholder = '';
								$dS_payment->accountIBAN = '';
								$dS_payment->opstatus = $status;
								$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
								$dS_payment->dSsave();
								break;
								
							case gocrypto_state_expired: 
								pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.payment_status_expired);
								$dS_payment->transtatus = payment_status_expired;
								$dS_payment->accountholder = '';
								$dS_payment->accountIBAN = '';
								$dS_payment->opstatus = $status;
								$dS_payment->opstatus = (strlen($dS_payment->opstatus) > 256) ? substr($dS_payment->opstatus, 0, 256) : $dS_payment->opstatus;
								$dS_payment->dSsave();
								break;
							
							case gocrypto_state_failed: 
							case gocrypto_state_underpaid: 
								pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.payment_status_failed);
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
				else if($dS_payment->paymean == paymean_payconiq || $dS_payment->paymean == paymean_onlinepayco)
				{
					//////////////////////////////////////////////////////////////////////////////////////////
					// PAYCONIQ, but only payment in timeout (after 5 minutes)
					//////////////////////////////////////////////////////////////////////////////////////////
					pollingDebugLog($paymentid,'calling payconiq api...');
					$payconiqkey = $dS_account->ePayconiqKey;
					$interface = new C_PayconiqGateaway($payconiqkey);
					$result = $interface->getPayment($dS_payment->transid);
					if(!$result){
						pollingDebugLog($paymentid,'calling payconiq get transaction with error for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
						pollingDebugLog($paymentid,$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);
						C_dS_exception::put('pollingThread.php', 'payconiq error',$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);
					}
					else
					{
						pollingDebugLog($paymentid,'calling payconiq get transaction with success for account='.$dS_account->name.' and requestid='.$dS_payment->transid);
						//pollingDebugLog($paymentid,'checkGoCryptoStatus : gocrypto status = '.$status);	
						//convert payconiq status to mobmidner payment status+++++++++++++++++

						
						$mobstatus = converterPayconiqtoPaymentStatus($result->status);
						if($mobstatus!=payment_status_pending && $mobstatus!=payment_status_identified)
						{
							pollingDebugLog($paymentid,'status = '.$result->status);
						
							$dS_payment->transtatus =  $mobstatus;
							$dS_payment->opstatus = truncateString($result->status,32);
							$dS_payment->qrcodestring='';

							if($dS_payment->transtatus==payment_status_success)
							{
								$dS_payment->accountholder = $result->debtorname;
								$dS_payment->accountIBAN = $result->debtoriban;
							}
							else
							{
								$dS_payment->accountholder = '';
								$dS_payment->accountIBAN = '';
							}


							$dS_payment->dSsave();
						}
					}
				}
				pollingDebugLog($paymentid,'end');
			}
		}
	}
}
//echo 'end';


?>