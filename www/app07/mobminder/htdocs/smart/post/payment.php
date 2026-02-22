<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P     A P I   /   P O S T     P A Y M E N T
//
//              
//

ob_start(); // relates to (*cc)
require '../smapplib202307.php';
require '../../../lib_mobphp/onlinepayment.php';
require '../../../lib_mobphp/softpayio.php';
require '../../../lib_mobphp/gocrypto.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$aid = $context->dS_account->id;
$lid = $context->dS_login->id;
//$cid = $context->request_cid($mandatory = true);

$perfReport->peak('::context setup');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		//indent('o cid: '.$cid.'',6);

		$paymentid = false; $paymentid = @$_REQUEST['id'];	
		if(!isset($paymentid)) abort('3400','gate::missing mandatory field id');
		indent('o payment id: '.$paymentid.'',6);
	
		$transtatus = false; $transtatus = @$_REQUEST['transtatus'];	
		if(!isset($transtatus)) abort('3401','gate::missing mandatory field transtatus');
		indent('o transtatus: '.$transtatus.'',6);
	
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);


		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// update payment
//
	$dS_payment = new C_dS_payment($paymentid,false,$_POST);


	
	if($dS_payment->id<=0) // if new payment => generate qrcode
	{
		$paymean = $_POST['paymean'];
		$amount = $_POST['amount']; // amount of this transaction ( may differ from the reservation.billamount total amount to be cashed in )
		$transnote 	= $_POST['transnote'];

		if($paymean==paymean_cards || $paymean==paymean_onlinecards || $paymean==paymean_onlinepayco)
		{
			abort('3400','payment cannot be created!');
		}
		else if($paymean==paymean_mobqrcode) 
		{
			//load sepa qr code parameters from account
			$beneficiarynumber = $context->dS_account->ePayBenefIBAN; 
			$beneficiaryname =  $context->dS_account->ePayBenefName;
	
			$interface = new C_SepaPayment($beneficiarynumber,$beneficiaryname);
			$QrCodeString = $interface->createQrCodeString($amount,$transnote);
	
			if(!$QrCodeString)
			{
				//never happened
				//$dS_payment->qrcodestring = '';
				//$dS_payment->transid='';
				$dS_payment->transtatus=payment_status_failed;
				$dS_payment->opstatus = truncateString($interface->lasterrorcode,32);
				C_dS_exception::put('smart/post/payment.php', 'sepa qr code error',$interface->lasterrorcode.'-'.$interface->lasterrormessage);
			}
			else
			{
				$dS_payment->dSsave(); // this is necessary for the next statement $mobreference to contain a valid DB id reference

				$mobreference = $dS_payment->id; // we drop the payment ID in the bank transfer communication, such that the user can use it easily after

				$QrCodeString = str_replace('{pid}', 'pid'.$mobreference, $QrCodeString);  // so far paymean_mobqrcode is the only one receiving {pid}, see (*ep22*)
				$dS_payment->transnote = str_replace('{pid}', 'pid'.$mobreference, $dS_payment->transnote); // see (*ep23*)
				$dS_payment->qrcodestring = $QrCodeString;

				//$dS_payment->transid='';
				$dS_payment->transtatus=payment_status_success; //success
				//$dS_payment->opstatus = '';
			}
		}
		//PAYCONIQ/////////////////////////////////////////////////////////////////////////
		else if($paymean==paymean_payconiq)
		{
			//first save for sending payment id to payconiq
			//$dS_payment->qrcodestring = '';
			//$dS_payment->transid='';
			$dS_payment->transtatus=payment_status_isnew;
			//$dS_payment->opstatus = '';
			$dS_payment->dSsave();

			//load payconiq parameters from account
			$payconiqkey = $context->dS_account->ePayconiqKey;
			// $payconiqkey = '22868856-4835-4018-9130-4c7a9442ef90'; //TODO
			$mobreference = $dS_payment->id; 	//save mobminder reference (payment id) in payconiq transaction,
												//will be used by callback for updating related payment
			$callbackurl = payconiqcallbackurl;
			$returnurl = null;
			
			$interface = new C_PayconiqGateaway($payconiqkey);
			$result = $interface->createPayment(
				$amount,
				$transnote,
				$mobreference,
				$callbackurl,
				$returnurl);
			if(!$result)
			{
				//$dS_payment->qrcodestring = '';
				//$dS_payment->transid='';
				$dS_payment->transtatus=payment_status_failed; //error
				$dS_payment->opstatus = truncateString($interface->lasthttpcode.':'.$interface->lasterrorcode,32);
				C_dS_exception::put('smart/post/payment.php', 'payconiq error',$interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage);

				if (!$interface->isServerAlive()) C_dS_system::providerfault('Payconiq');
			}
			else
			{
				$dS_payment->qrcodestring = $result->deeplink;
				$dS_payment->transid = $result->paymentid;

				//$dS_payment->transtatus= strtolower($result->status);
				$dS_payment->transtatus = converterPayconiqtoPaymentStatus($result->status); //always PENDING in creatino
				$dS_payment->opstatus = truncateString($result->status,32);
			}
		}
		//SOFTPAY//////////////////////////////////////////////////////////////////////////
		else if($paymean==paymean_softpos_softpay)
		{
			//first save
			//$dS_payment->qrcodestring = '';
			//$dS_payment->transid='';
			$dS_payment->transtatus=payment_status_isnew;
			//$dS_payment->opstatus = '';
			$dS_payment->dSsave();
			
			
			$res = CreateSoftPayPayment($context->dS_account,$amount,$dS_payment->id);
			if(!$res)
			{
				//if softpay error, then the payment is created but directly with failed status
				//$dS_payment->qrcodestring = '';
				//$dS_payment->transid='';
				$dS_payment->transtatus=payment_status_failed; //error
				$dS_payment->opstatus = 'internal error';
				//exception has been stored in database by softpay library
				//C_dS_exception::put('smart/post/payment.php', 'payconiq error',$interface->lasthttpcode.":".$interface->lasterrorcode."-".$interface->lasterrormessage);

				
				if (!isSoftPayServerAlive($context->dS_account)) C_dS_system::providerfault('SoftPay');
			}
			else
			{
				//echo 'main calling CreateSoftPayPayment requestId = '.$res->requestId.'<br/>';
				//echo 'main calling CreateSoftPayPayment state = '.$res->state.'<br/>';
				//$dS_payment->qrcodestring = '';
				$dS_payment->transid = $res->requestId;
				$dS_payment->transtatus = payment_status_pending; //softpay status = PROCESSING
				$dS_payment->opstatus = truncateString($res->state,32);
			}
		}
		//HARDPOS//////////////////////////////////////////////////////////////////////////
		else if($paymean==paymean_hardpos_done4you)
		{
			//first save
			//$dS_payment->qrcodestring = '';
			//$dS_payment->transid='';
			$dS_payment->transtatus=payment_status_isnew;
			//$dS_payment->opstatus = '';
			$dS_payment->dSsave();
			
			$printSlip = false; //print or not the slip
			
			$res = createGoCryptoPayment($context->dS_account,$amount,$dS_payment->id,$printSlip);
			if(!$res)
			{
				//$dS_payment->qrcodestring = '';
				//$dS_payment->transid='';
				$dS_payment->transtatus=payment_status_failed; //error
				$dS_payment->opstatus = 'internal error';
				//exception has been stored in database by softpay library
				//C_dS_exception::put('smart/post/payment.php', 'payconiq error',$interface->lasthttpcode.":".$interface->lasterrorcode."-".$interface->lasterrormessage);
				
				if (!isGoCryptoServerAlive($context->dS_account)) C_dS_system::providerfault('HardPay');
			}
			else
			{
				//echo 'main calling CreateSoftPayPayment requestId = '.$res->requestId.'<br/>';
				//echo 'main calling CreateSoftPayPayment state = '.$res->state.'<br/>';
				//$dS_payment->qrcodestring = '';
				$dS_payment->transid = $res;
				$dS_payment->transtatus = payment_status_pending; //softpay status = PROCESSING
				$dS_payment->opstatus = 'IN_PROGRESS'; //truncateString($res->state,32);
			}
		}
		else //other payment method (cash, etc)
		{
			//$dS_payment->qrcodestring='';
			//$dS_payment->transid='';
			//$dS_payment->transtatus=payment_status_success; //success no need!
			//$dS_payment->opstatus = '';
		}	
	}

	//$dS_payment->transtatus = $transtatus; //no need
	$dS_payment->dSsave(); 

	$billamount = $_POST['billamount']; // (*ep02*) total bill amount, the transaction amount may differ from this total amount (visitor paying a part of the price)
	$dS_resa = new C_dS_reservation($dS_payment->groupId);
	$dS_resa->billamount = $billamount;
	$dS_resa->save(); // saves without changing the tracking fields


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
	//echo '#C_dS_payment'.$nl.$dS_payment->stream(with_tracking).$nl;
	echo '#C_dS_payment'.$nl.$dS_payment->stream(with_tracking, '|');
	span('&lt/data&gt');
	echo '</data>';
	


//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o id: payment id',6);
		indent('o transtatus: transtatus',6);

		h3('optional posts');
		indent('o groupId: groupId',6);
		indent('o paymean: paymean',6);
		indent('o transnote: transnote',6);
		indent('o amount: amount',6);
		

	//pad(0); h2('Returned objects &ltdata&gt');


}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 



$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


?>