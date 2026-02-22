<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     P A Y C O N I Q       F E E D B A C K 
//

//DEBUG MODE
//
// 1. ngrok: (use ngrok for local callback on developement environment)
//		- execute command "ngrok http 80" or "ngrok http 192.168.0.37:80" (specify local network if necessary)
//		- copy forwarding url from ngrok console, ex : http://4be9-85-26-116-196.ngrok.io -> http://192.168.0.37:80
//		- paste forwarding url in /post/payment.php : define('payconiqcallbackurl','http://4be9-85-26-116-196.ngrok.io/be.mobminder.com/feedback/payconiq.php');
//		- check calls/connections from ngrok console 
//		- check exception table if necessary

// 2. log file: 
//		- set forcedebuglog to true for writing log information (default value is false)
//		- do not forget to create /feedback/log directory 
//		- check /feedback/log/payconiqcallback.log file 

// 3. ?web=1 (simulation test)
// 		- callback process is called with json input data for testing
//		- log file is enabled 
define('forcedebuglog',true); 
define('local_test', false);


$systemLog = 'payconiq feedback'; // used in dbio.php to identify the working process/user
require '../../lib_mobphp/dbio.php';  
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/mblox.php';
require '../../lib_mobphp/comm.php';
require '../../lib_mobphp/onlinepayment.php';
require '../classes/language.php';
require '../../lib_cronofy/cronofymanager.php';


function PayconiqDebugLog($log,$web)
{
	if($web || forcedebuglog)
	{
		$time = @date('[d/M/Y:H:i:s]');
		$result = file_put_contents('/var/log/www/payconiqcallback.log',$time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
	}
}



//load 
$body = file_get_contents('php://input');
//echo "body=".$body;

//debug mode
$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if($web) $body = '
{
	"paymentId": "ec146684fad8ccb556cdc92f",
	"reference" : "1",
	"transferAmount": 0,
	"tippingAmount": 0,
	"amount": 98,
	"totalAmount": 0,
	"description": "mon premier transfert",
	"createdAt": "2022-08-02T13:32:41.266Z",
	"expireAt": "2022-08-02T13:34:41.266Z",
	"status": "EXPIRED",
	"currency": "EUR",
	"debtor": {
		"name": "John",
		"iban": "*************12636"
	}
}
';

//check post content//////////////////////////////////////////////
if(empty($body))
{
	$msg = 'error : body is empty';
	C_dS_exception::put('feedback/payconiq.php', 'main',$msg);
	PayconiqDebugLog($msg,$web);
	if($web) die($msg); else die();
}

$result = new C_PayconiqCallbackResponse($body);
	
PayconiqDebugLog('paymentid='.$result->paymentid,$web);
PayconiqDebugLog('reference='.$result->reference,$web);
PayconiqDebugLog('status='.$result->status,$web);
PayconiqDebugLog('debtor name='.$result->debtorname,$web);
PayconiqDebugLog('debtor iban='.$result->debtoriban,$web);

//check if reference (mobminder payment id) is defined/////////////
if(empty($result->reference))
{
	$msg = 'error : reference from callback is empty';
	C_dS_exception::put('feedback/payconiq.php', 'main',$msg);
	PayconiqDebugLog($msg,$web);
	if($web) die($msg); else die();
}

$id = $result->reference;

$dS_payment = new C_dS_payment($id);
//check if payement exists//////////////////////////////////////////
if(!$dS_payment->id)
{
	$msg = 'error : payment id ('.$id.') does not exists';
	C_dS_exception::put('feedback/payconiq.php', 'main',$msg);
	PayconiqDebugLog($msg,$web);
	if($web) die($msg); else die();
} 

C_dbIO::$loggedId = $dS_payment->creatorId;

//check paymentid-reference relation////////////////////////////////
if($dS_payment->transid!=$result->paymentid)
{
	$msg = 'error : transaction id ('.$result->paymentid.') from payconiq does not match payment id from mobminder ('.$dS_payment->transid.')';
	C_dS_exception::put('feedback/payconiq.php', 'main',$msg);
	PayconiqDebugLog($msg,$web);
	if($web) die($msg); else die();
}

$dS_reservation = new C_dS_reservation($dS_payment->groupId); 
if(!$dS_reservation->id)
{
	$msg = 'error : reservation id ('.$dS_payment->groupId.') does not exists';
	C_dS_exception::put('feedback/payconiq.php', 'main',$msg);
	PayconiqDebugLog($msg,$web);
	if($web) die($msg); else die();
} 

//convert payconiq status to mobmidner payment status+++++++++++++++++
$dS_payment->transtatus = converterPayconiqtoPaymentStatus($result->status);


$dS_payment->opstatus = truncateString($result->status,32);
$dS_payment->qrcodestring='';

if($dS_payment->transtatus==payment_status_success)
{
	$dS_payment->accountholder = $result->debtorname;
	$dS_payment->accountIBAN = $result->debtoriban;
}
else
{
	PayconiqDebugLog('error',$web);

	if(isAccountIdTestForPayment($dS_reservation->groupId))
	{
		PayconiqDebugLog('client test',$web);

		$dS_payment->transtatus=payment_status_success;
		$dS_payment->opstatus ='testing account, status is set to success';
		$dS_payment->accountholder = '';
		$dS_payment->accountIBAN = '';
	}
	else
	{
		PayconiqDebugLog('client non test',$web);

		$dS_payment->accountholder = '';
		$dS_payment->accountIBAN = '';
	}
}


$dS_payment->dSsave();

//$dS_reservation->addmeta_prebooking();
//$prebooking = ($dS_reservation->prebooking!=0);

$q = new Q('select id from prebooking_delays where reservationId = '.$dS_reservation->id.';');
$prebooking = ($q->ids());


if($prebooking) //prebooking
{
	//remove prebooking information
	new Q('delete from prebooking_delays where reservationId='.$dS_reservation->id.';');
	//C_dS_prebooking::delete($dS_reservation);

	//delete (obsolete) RDV if payment has failed
	if(	$dS_payment->transtatus==payment_status_unauthorized 
		||  $dS_payment->transtatus==payment_status_expired
		||  $dS_payment->transtatus==payment_status_failed
		||  $dS_payment->transtatus==payment_status_cancelled )
	{
		$dS_reservation->dSobsolete();
	}
	else
	{
		//SEND EVENT MSG///////////////////////////////////////////////////////////////////////////////////////////////////////

		$abortnotifications = false; 

		//no need
		//if(!($bCals||$uCals)) $abortnotifications = 'fcals only in attendees'; // In this case the reservation is only on facultative resource. 
		//if(!$visitors) $abortnotifications = 'no notifications for a reservation having no visitor';

		$dS_account = new C_dS_group($dS_reservation->groupId);
		$dS_login = new C_dS_login($dS_payment->creatorId);
		
		if(!$dS_account->sendSMSs) $abortnotifications = 'this account has a disabled communication switch';

		if($abortnotifications)
			PayconiqDebugLog('No notification will be sent: '.$abortnotifications,$web);
		else 
		{
			$timing_changed = false;

			sendEventMessages($dS_login, $dS_account, $dS_reservation->id, action_create, $timing_changed, $testmode = local_test);
		}


		//CRONOFY////////////////////////////////////////////////////////////////////////


		$dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($dS_account->id);
		$dS_resa = new C_dS_reservation($dS_reservation->id);

		//reset remote id and profile, if eventuid existed in past, it has been deleted!
		if($dS_resa->remoteProfile!=0)
		{
			//force remoteid with '1' to know that event was born as an external event
			$dS_resa->remoteid = '1';
			$dS_resa->remoteProfile = 0;
			$dS_resa = $dS_resa->dSsave();
		}

		//create all, only eventid and no eventuid because eventuid has been reset in reservation
		// create all, only eventid and no eventuid because eventuid has been reset in reservation
		// view is false when all resources are visible to this login, or a comalist when the view is limited
		$dS_cronofy_manager_reservation->UpsertForAttendees($dS_resa,null /*excludeCalendarId*/);

	}

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$msg = 'Success';
PayconiqDebugLog($msg,$web);
if($web) die($msg);
?>