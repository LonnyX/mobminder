<?php
//////////////////////////////////////////////////////////////////////
//
//         W E B   A P P   /  P O S T    P A Y M E N T
//

/////////////////////////////////////////////////////////////////////////
//  PAYCONIQ TEST / PROD ENVIRONMENT  
//  payconiqcallbackurl must contains payconiq callback url
//	(use ngrok for local dev environment)
/////////////////////////////////////////////////////////////////////////

define('e_Pay_STUB', false); // when true, we actually do not call the provider, instead the tester must change manually the status of the payment in the mobminder.payments table

ob_start(); // relates to (*ob1)
$loadcontext = 1;
require '../classes/ajax_session.php';
require '../../lib_mobphp/softpayio.php';
require '../../lib_mobphp/gocrypto.php';
require '../../lib_mobphp/onlinepayment.php';

$perfReport = new C_perfReport(); 
$perfReport->peak('::session retrieved');

//$resaid = $_POST['gro'];
$id = $_POST['id']; if(!is_numeric($id)) die('EP_Err_000');
$bank = $_POST['bank'];
$paymean 	= $_POST['paymean']; if(!is_numeric($paymean)) die('EP_Err_001');
$amount 	= $_POST['amount'];  if(!is_numeric($amount)) die('EP_Err_002'); // amount of this transaction ( may differ from the reservation.billamount total amount to be cashed in )
$transnote 	= $_POST['transnote']; $transnote = substr($transnote,0,510);
$transtatus = $_POST['transtatus']; if(!is_numeric($transtatus)) die('EP_Err_003');
$billamount = $_POST['billamount']; if(!is_numeric($amount)) die('EP_Err_004'); // (*ep02*) total bill amount, the transaction amount may differ from this total amount (visitor paying a part of the price because they already paid a deposit)


$dS_payment = new C_dS_payment($id, false, $_POST);

if($id<=0) // new payment
{
	//   C A S H    ////////////////////////////////////////////////////////////////
	//
	if($paymean==paymean_cash)
	{	
		$dS_payment->transtatus = $transtatus; // we store the status as chosen by the user (as everything is manual for cash)
	}
	

	//   M O B   Q R   C O D E  (SEPA)  ////////////////////////////////////////////////////////////////
	//
	else if($paymean==paymean_mobqrcode) 
	{
		
		//load sepa qr code parameters from account
		$beneficiarynumber = $dS_account->ePayBenefIBAN; 
		$beneficiaryname =  $dS_account->ePayBenefName;

		$interface = new C_SepaPayment($beneficiarynumber,$beneficiaryname);
		$QrCodeString = $interface->createQrCodeString($amount,$transnote);

		if(!$QrCodeString)
		{
			//never happened
			$dS_payment->transtatus=payment_status_failed;
			$dS_payment->opstatus = truncateString($interface->lasterrorcode,32);
			C_dS_exception::put('post/payment.php', 'sepa qr code error',$interface->lasterrorcode.'-'.$interface->lasterrormessage);
		}
		else
		{
			$dS_payment->dSsave(); // this is necessary for the next statement $mobreference to contain a valid DB id reference
			$mobreference = $dS_payment->id; // we drop the payment ID in the bank transfer communication, such that the user can use it easily after
			$QrCodeString = str_replace('{pid}', 'pid'.$mobreference, $QrCodeString); // so far paymean_mobqrcode is the only one receiving {pid}, see (*ep22*)
			$dS_payment->transnote = str_replace('{pid}', 'pid'.$mobreference, $dS_payment->transnote); // see (*ep23*)
		
			$dS_payment->qrcodestring = $QrCodeString;
			$dS_payment->transtatus = payment_status_pending; // success
		}
		
	}
	
	//   P A Y C O N I Q    /////////////////////////////////////////////////////////////////////////
	//
	else if($paymean==paymean_payconiq)
	{
		
		//load payconiq parameters from account
		$payconiqkey = $dS_account->ePayconiqKey;
		// $payconiqkey = '22868856-4835-4018-9130-4c7a9442ef90'; //TODO
		
		$dS_payment->dSsave(); // this is necessary for the next statement $mobreference to contain a valid DB id reference
		$mobreference = $dS_payment->id; // payconiq feeds back this correlator when calling back on status, usefull for us
		
		if(e_Pay_STUB) { // for testing without calling any providerc
				
				// note that you need in that case to simulate by yourself the behaviour of a real payment
				// and you can do it by changing maunally the status of the mobminder.payments record
				//
				$dS_payment->qrcodestring = 'Stubbed PAYCONIQ';
				$dS_payment->transid='fakeId4theStub';
				$dS_payment->transtatus = payment_status_pending; 
				$dS_payment->opstatus = 'PENDING';

		} else { // the normal case for production
		
			$callbackurl = payconiqcallbackurl;
			$returnurl = null;
			
			$interface = new C_PayconiqGateaway($payconiqkey);
			$result = $interface->createPayment( $amount, $transnote, $mobreference, $callbackurl, $returnurl );
			if(!$result)
			{
				$dS_payment->transtatus = payment_status_failed; //error
				$dS_payment->opstatus = truncateString($interface->lasthttpcode.':'.$interface->lasterrorcode,32);
				C_dS_exception::put('post/payment.php', 'payconiq error',$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);
			}
			else
			{
				$dS_payment->qrcodestring = $result->deeplink;
				$dS_payment->transid = $result->paymentid;

				//$dS_payment->transtatus = strtolower($result->status);
				$dS_payment->transtatus = converterPayconiqtoPaymentStatus($result->status); //always PENDING in creatino
				$dS_payment->opstatus = truncateString($result->status,32);
			}
		}
	}
	
	
	//  S O F T P A Y   //////////////////////////////////////////////////////////////////////////
	//
	else if($paymean==paymean_softpos_softpay)
	{
		$dS_payment->dSsave(); // this is necessary for the next statement $mobreference to contain a valid DB id reference
		$mobreference = $dS_payment->id; // payconiq feeds back this correlator when calling back on status, usefull for us
			
		if(e_Pay_STUB) { // for testing without calling any provider
				
				// note that you need in that case to simulate by yourself the behaviour of a real payment
				// and you can do it by changing maunally the status of the mobminder.payments record
				//
				$dS_payment->qrcodestring = 'Stubbed SOFTPAY';
				$dS_payment->transid = 'fakeId4theStub';
				$dS_payment->transtatus = payment_status_pending; 
				$dS_payment->opstatus = 'PENDING';

			
		} else { // the normal case for production
		
			$res = CreateSoftPayPayment($dS_account,$amount,$mobreference);
			if(!$res)
			{
				// if softpay error, then the payment is created but directly with failed status
				$dS_payment->transtatus = payment_status_failed; //error
				$dS_payment->opstatus = 'internal error';
				//exception has been stored in database by softpay library
				//C_dS_exception::put('smart/post/payment.php', 'payconiq error',$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);
			}
			else
			{
				//echo 'main calling CreateSoftPayPayment requestId = '.$res->requestId.'<br/>';
				//echo 'main calling CreateSoftPayPayment state = '.$res->state.'<br/>';
				// $dS_payment->qrcodestring = '';
				$dS_payment->transid = $res->requestId;
				$dS_payment->transtatus = payment_status_pending; //softpay status = PROCESSING
				$dS_payment->opstatus = truncateString($res->state,32);
			}
		}
	}
	
	
	//   H A R D P O S  //////////////////////////////////////////////////////////////////////////
	//
	else if($paymean==paymean_hardpos_done4you)
	{
		$dS_payment->dSsave(); // this is necessary for the next statement $mobreference to contain a valid DB id reference
		$mobreference = $dS_payment->id; // payconiq feeds back this correlator when calling back on status, usefull for us
	
		$printSlip = false; //print or not the slip
		
		
		if(e_Pay_STUB) { // for testing without calling any provider
				
				// note that you need in that case to simulate by yourself the behaviour of a real payment
				// and you can do it by changing maunally the status of the mobminder.payments record
				//
				$dS_payment->qrcodestring = 'Stubbed HARDPAY';
				$dS_payment->transid='fakeId4theStub';
				$dS_payment->transtatus = payment_status_pending; 
				$dS_payment->opstatus = 'PENDING';

		} else { // the normal case for production
		
			$res = createGoCryptoPayment($dS_account,$amount,$mobreference,$printSlip);
			if(!$res)
			{
				$dS_payment->transtatus=payment_status_failed; //error
				$dS_payment->opstatus = 'internal error';
				
				//exception has been stored in database by softpay library
				//C_dS_exception::put('smart/post/payment.php', 'payconiq error',$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);
			}
			else
			{
				//echo 'main calling CreateSoftPayPayment requestId = '.$res->requestId.'<br/>';
				//echo 'main calling CreateSoftPayPayment state = '.$res->state.'<br/>';
				$dS_payment->transid = $res;
				$dS_payment->transtatus = payment_status_pending; //softpay status = PROCESSING
				$dS_payment->opstatus = 'IN_PROGRESS'; //truncateString($res->state,32);
			}
		}
	}
	
	else { // no paymean that we are expecting to treat
		
		die('EP_Err_009');
		
	}
}

$dS_payment->dSsave();


// now let's save the total bill amount
//
$dS_resa = new C_dS_reservation($dS_payment->groupId);
$dS_resa->billamount = $billamount;
$dS_resa->save(); // ->save() without changing the tracking fields ( ->dSsave() instead is a version that updates the tracking )


// feedback to the client
echo '<code>';
echo '#C_dS_payment#'.$bank.$nl.$dS_payment->stream(with_tracking).$nl;
echo '#C_dS_reservation#'.$bank.$nl.$dS_resa->stream(with_tracking).$nl;
echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE

?>