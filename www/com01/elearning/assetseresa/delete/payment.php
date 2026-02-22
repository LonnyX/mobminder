<?php


ob_start(); // relates to (*ob1)
require '../classes/language.php';
$loadcontext = 2; 
require '../classes/ajax_session.php'; 

if (isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
session_write_close();

//new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$paymentid = $_POST['id']+0; // added +0 to make sure we are posted a genuine entiger (problem with rows inserted with id 0)

C_dbIO::logged($dS_login,'(eresa)'); // sign any change in DB

$perfReport->peak('::posts retrieved');

// E-PAIMENT ////////////////////////////////////////////////////////////////////////////////
require '../../../../mobminder/lib_mobphp/onlinepayment.php';

$paymean = @$_POST['paymean']; if(!isset($paymean)) $paymean = paymean_notset;



//E-PAYMENT ///////////////////////////////////////////////////////////////////////////////
if ($paymean==paymean_payconiq || $paymean==paymean_cards)  //or other payment method, to implement
{
    $dS_payment = new C_dS_payment($paymentid);

    if(!$dS_payment->id)
	{
        $msg = 'payment id ('.$paymentid.') does not exists';
        C_dS_exception::put('agenda/delete/payment.php', 'payment error',$msg);
        $servernow = new C_date(); $servernow = $servernow->getTstmp();
        die('error!'.$servernow.'!'.'payment error:'.$msg.$nl);
	} 

    //PAYCONIQ/////////////////////////////////////////////////////////////////////////
    //call payconiq server for deleting transaction
    //payconiq will call callback url to update the database payment record
    if ($paymean==paymean_payconiq)
    {
        //load payconiq parameters from account
        $payconiqkey = $dS_account->ePayconiqKey;
                                    
        $interface = new C_PayconiqGateaway($payconiqkey);

        $result = $interface->cancelPayment($dS_payment->transid);
        if (!$result)
        {
            //echo 'call payconiq delete failed';
            $msg = $interface->lasthttpcode.':'.$interface->lasterrorcode.'-'.$interface->lasterrormessage;
            C_dS_exception::put('agenda/delete/payment.php', 'payconiq error',$msg);
            $servernow = new C_date(); $servernow = $servernow->getTstmp();
            die('error!'.$servernow.'!'.'payconiq error:'.$msg.$nl);
        }
    }
    //computop : paycancel not allowed
    else if ($paymean==paymean_cards)
    {
        if ($dS_payment->transtatus==payment_status_pending)
        {
            $dS_payment->transtatus = payment_status_cancelled;
            $dS_payment->opstatus = '';
            $dS_payment->qrcodestring='';
            $dS_payment->accountholder = '';
            $dS_payment->accountIBAN = '';
            $dS_payment->dSsave();
                
            $q = new Q('select id from prebooking_delays where reservationId = '.$dS_payment->groupId.';');
            $prebooking = ($q->ids());

            if($prebooking) //prebooking
            {
                new Q('delete from prebooking_delays where reservationId='.$dS_payment->groupId.';');
            
                $dS_reservation = new C_dS_reservation($dS_payment->groupId); 
                if($dS_reservation->id)
                {     
                    //$msg = "error : reservation id (".$dS_payment->groupId.") does not exists";
                    //C_dS_exception::put('delete/payment.php', 'computop error',$msg);
                    //die('error!'.$servernow.'!'.'computop error:'.$msg.$nl);

                    $dS_reservation->dSobsolete();
                } 
            }
        }
    }
}


// END OF E-PAIMENT /////////////////////////////////////////////////////////////////////////////////////////

echo '<code>';
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();

closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE

C_dS_connection::poke($perfReport, 'p_resa');


?>