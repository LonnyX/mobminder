<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     C O M P U T O P      F E E D B A C K 
//
////////////////////////////////////////////////////////////////////////////////////////////////////////
define('forcedebuglog',true); 
define('local_test', false);

$systemLog = 'computop feedback'; // used in dbio.php to identify the working process/user

require '../../lib_mobphp/dbio.php';  
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/mblox.php';
require '../../lib_mobphp/comm.php';
require '../../lib_mobphp/onlinepayment.php';
require '../classes/language.php';
require '../../lib_cronofy/cronofymanager.php';

function ComputopDebugLog($log,$web)
{
	if($web || forcedebuglog)
	{
		$time = @date('[d/M/Y:H:i:s]');
		$result = file_put_contents('/var/log/www/computopcallback.log',$time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
	}
}

//debug mode
$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

$accountId = @$_REQUEST['accid'];


if(isset($_REQUEST['paymean']))
	$paymean = @$_REQUEST['paymean'];
else //paymean should be passed by onlinepayment => never happens here
	$paymean = 'cards';


$dS_account = new C_dS_group($accountId);
if(!$dS_account->id)
{
	$msg = 'error : account id ('.$accountId.') does not exists';
	C_dS_exception::put('feedback/computop.php', 'main',$msg);
	ComputopDebugLog($msg,$web);
	if($web) die($msg); else die();
} 




//if($paymean=='cards')
$BlowfishPassword = $dS_account->ePayComputopFish; 
//else //bancontact // keep same credential
//$BlowfishPassword = $dS_account->ePayComputopFish; 

	
$gw = new C_ComputopGateaway($BlowfishPassword);
$response = $gw->parseResponse($_REQUEST);

$mid = $response->getMid();
$payid = $response->getPayID();
$transid = $response->getTransID();
$xid = $response->getXID();
$code = $response->getCode();  
$status = $response->getStatus();
$description = $response->getDescription();
$type = $response->getType();
$msgver = $response->getMsgver();
$mac = $response->getMAC(); 

ComputopDebugLog('mid='.$mid,$web);
ComputopDebugLog('payid='.$payid,$web);
ComputopDebugLog('transid='.$transid,$web);
ComputopDebugLog('xid='.$xid,$web);
ComputopDebugLog('code='.$code,$web);
ComputopDebugLog('status='.$status,$web);
ComputopDebugLog('description='.$description,$web);
ComputopDebugLog('type='.$type,$web);
ComputopDebugLog('msgver='.$msgver,$web);
ComputopDebugLog('mac='.$mac,$web);


//check if transid (mobminder payment id) is defined/////////////
$paymentid = $transid;
if(empty($paymentid))
{
	$msg = 'error : transid from callback is empty';
	C_dS_exception::put('feedback/computop.php', 'main',$msg);
	ComputopDebugLog($msg,$web);
	if($web) die($msg); else die();
}

$dS_payment = new C_dS_payment($paymentid);
//check if payement exists//////////////////////////////////////////
if(!$dS_payment->id)
{
	$msg = 'error : payment id ('.$id.') does not exists';
	C_dS_exception::put('feedback/computop.php', 'main',$msg);
	ComputopDebugLog($msg,$web);
	if($web) die($msg); else die();
} 

C_dbIO::$loggedId = $dS_payment->creatorId;

//check paymentid-reference relation////////////////////////////////
//not cross reference with computop

$dS_reservation = new C_dS_reservation($dS_payment->groupId); 
if(!$dS_reservation->id)
{
	$msg = 'error : reservation id ('.$dS_payment->groupId.') does not exists';
	C_dS_exception::put('feedback/computop.php', 'main',$msg);
	ComputopDebugLog($msg,$web);
	if($web) die($msg); else die();
} 

//double check between account id from feedback url and account id from reservation
if($dS_account->id!=$dS_reservation->groupId)
{
	$msg = 'error : reservation id ('.$dS_reservation->id.') is not linked to account id ('.$dS_account->id.')';
	C_dS_exception::put('feedback/computop.php', 'main',$msg);
	ComputopDebugLog($msg,$web);
	if($web) die($msg); else die();
}


//convert payconiq status to mobminder payment status+++++++++++++++++
if($code=='00000000')
{
	$dS_payment->transtatus = payment_status_success;
	$dS_payment->transid = $payid;
	$dS_payment->accountholder = '';
	$dS_payment->accountIBAN = '';
	$dS_payment->opstatus = truncateString($status.'-'.$code.'-'.$description,256);
	$dS_payment->qrcodestring='';
}
else
{
	//ComputopDebugLog('code failed',$web);

	if(isAccountIdTestForPayment($dS_account->id))
	{
		//ComputopDebugLog('account is test',$web);

		//testing account => all payments are forcedo to success! 
		$dS_payment->transtatus = payment_status_success;
		$dS_payment->transid = '';
		$dS_payment->accountholder = '';
		$dS_payment->accountIBAN = '';
		$dS_payment->opstatus = 'testing account, status is set to success';
		$dS_payment->qrcodestring='';
	}
	else
	{
		//ComputopDebugLog('account is not test',$web);

		$dS_payment->transtatus = payment_status_failed;
		$dS_payment->transid = '';
		$dS_payment->accountholder = '';
		$dS_payment->accountIBAN = '';
		$dS_payment->opstatus = truncateString($status.'-'.$code.'-'.$description,256);
		$dS_payment->qrcodestring='';
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
	if(	$dS_payment->transtatus==payment_status_failed)
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

		//$dS_account = new C_dS_group($dS_reservation->groupId); already loaded
		$dS_login = new C_dS_login($dS_payment->creatorId);
		
		if(!$dS_account->sendSMSs) $abortnotifications = 'this account has a disabled communication switch';

		if($abortnotifications)
			ComputopDebugLog('No notification will be sent: '.$abortnotifications,$web);
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
ComputopDebugLog($msg,$web);
if($web) die($msg);

?>