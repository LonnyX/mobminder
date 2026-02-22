<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P     A P I   /   D E L E T E      P A Y M E N T
//	  
//	only payconiq
//  not a physical delete, status is set to cancel and payconiq cancel api is called            
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
	
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);



		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// get payment
//
	$dS_payment = new C_dS_payment($paymentid,false);
	$operatorerror=false;
	
	if($dS_payment->id<=0) // if new payment => generate qrcode
	{
        abort('3400','gate::payment not found for id '+paymentid);
	}

	if($dS_payment->paymean==paymean_cash || $dS_payment->paymean==paymean_mobqrcode)
	{
		$dS_payment->transtatus = payment_status_cancelled;
		$dS_payment->dSsave(); 
	}
	else if($dS_payment->paymean==paymean_payconiq)
	{
			//do not change status because feedback from payconiq will do it
			//$dS_payment->transtatus = payment_status_cancelled;
			//$dS_payment->dSsave(); 

			//load payconiq parameters from account
			$payconiqkey = $context->dS_account->ePayconiqKey;
										
			$interface = new C_PayconiqGateaway($payconiqkey);
	
			$result = $interface->cancelPayment($dS_payment->transid);
			if(!$result)
			{
				//echo 'call payconiq delete failed';
				$msg = $interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage;
				C_dS_exception::put('smart/delete/payment.php', 'payconiq error',$msg);
				//abort('delete payconiq error');
				$operatorerror=true; //do not return payment record
			}
	}
	else if($dS_payment->paymean==paymean_softpos_softpay)
	{
		//do not change status because polling will do it
        //$dS_payment->transtatus = payment_status_cancelled;
		//$dS_payment->dSsave(); 

        $requestid=$dS_payment->transid;
        $rescancel = cancelSoftPayPayment($context->dS_account,$requestid);
		if(!$rescancel)
		{
			//abort('delete softpay error');
			$operatorerror=true; //do not return payment record
		}
	}
	/*else if($dS_payment->paymean==paymean_hardpos_done4you)
	{
		//do not change status because polling will do it
        //$dS_payment->transtatus = payment_status_cancelled;
		//$dS_payment->dSsave(); 

		$transactionID=$dS_payment->transid;
        $res = deleteGoCryptoPayment($context->dS_account,$transactionID);
        if(!$res)
        {
			//abort('delete gocrypto error');
			$operatorerror=true; //do not return payment record
        }
        //else
        //{
        //    echo 'main calling deleteGoCryptoPayment status = '.$res.'<br/>';
        //}
	}*/
	else
	{
		abort('3400','gate::paymean is not valid for paymentid : '+paymentid);
	}


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
	
	//do not return payment record
	if(!$operatorerror){
		echo '#C_dS_payment'.$nl.$dS_payment->stream(with_tracking, '|');
	}
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