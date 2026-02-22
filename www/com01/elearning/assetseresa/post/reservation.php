<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  W E B   A P P  /  P O S T    R E S E R V A T I O N 
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// � All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// � Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium
//
define('local_test', false); // echoes notifications about the sending of messages (false -> cut by the early connection close, keep false in production)

if(!local_test) ob_start(); // relates to (*ob1)

require '../classes/language.php';

$loadcontext = 2; 
require '../classes/ajax_session.php'; 

$paymean = @$_POST['paymean']; if(!isset($paymean)) $paymean = paymean_notset;

if ($paymean!=paymean_payconiq && $paymean!=paymean_cards) session_write_close();

new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

//BSP online reservation booking only creates new reservations into database => resaId must be 0
//disable old line : $resaId = $_POST['id']+0; // added +0 to make sure we are posted a genuine entiger (problem with rows inserted with id 0)
$resaId = 0;


$bank = $_POST['bank'];
$expires = @$_REQUEST['preb']; if(!isset($expires)) $expires = false;

// C_date::setTimeParameters($dS_account); // Not needed, time is posted in UTC
$date = new C_date($_POST['cueIn']);
$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $date->getDateSortable());
if($gmtshift) { // GMT shift (**GMT)
    $_POST['cueIn'] += $gmtshift; 
    $_POST['cueOut'] += $gmtshift;
    echo 'gmtshift:'.($gmtshift/3600).' hours'.$nl;
}

$visitors 	= $_POST['visitors']; $visitors = ($visitors=='-') ? false : explode('!', $visitors);
$bCals 	= $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? false : explode('!', $bCals);
$uCals 	= $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? false : explode('!', $uCals);
$fCals 	= $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? false : explode('!', $fCals);

$workcodes = $_POST['workcodes']; $workcodes = ($workcodes=='-') ? false : explode('!', $workcodes);

//if($dS_login->accessLevel == aLevel_eresa) 
C_dbIO::logged($dS_login,'(eresa)'); // sign any change in DB

$perfReport->peak('::posts retrieved');


$dS_reservation = new C_dS_reservation($resaId, $accountId, $_POST); // resa from current table, goes back to current table

$perfReport->peak('::Reservation');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Prepare reservation attributes
//
$att_visitors = new C_dbAccess_att_visitors();
//$resaparts = new C_dbAccess_resaparts();
$performances = new C_dbAccess_performances();

$attendees = new C_dbAccess_attendees();
$classes = array(class_bCal => $bCals, class_uCal => $uCals, class_fCal => $fCals); // this is based on what was posted (eventually limited by the login's view)
foreach($classes as $class => $att_by_class)
    if($att_by_class)
        foreach($att_by_class as $id) {
            $dS_attendee = $attendees->newVirtual();
            $dS_attendee->resourceId = $id;
            $dS_attendee->resourceType = $class;
        }

// check if the visitor ids do match real records (this has been introduced after a hacking on the e-resa, where visitor id 0 was passed)
//
if($visitors) { // we check here that visitor Ids passed belong to the right account and have valid ids
    $mv = implode(',',$visitors);
    $q = new Q('select count(1) as c from visitors where groupId = '.$accountId.' and id in('.$mv.');');
    $c = $q->c();
    if(count($visitors)!=$c) die('Incoherent data <command>logoff</command>');
}

// attendee visitors objects	
if($visitors)
    foreach($visitors as $vid) {
        // check that this visitor is still active
        $q = new Q('select count(1) as c from visitors where id = '.$vid.' and deletorId = 0;');
        if(!$q->c()) continue; // This solves the very particular case where a doublon was removed but is still selected (and id posted) from the C_iACPICK control. Other similar scripts are protected against this. see (*exc10*)

        // add the visitor reference
        $dS_att_vis = $att_visitors->newVirtual();
        $dS_att_vis->resourceId = $vid;
        $dS_att_vis->resourceType = class_visitor;
    }

$perfReport->peak('::Attendees');	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	
// Check for overloads before saving anything in DB   ( !!  script might DIE in this section  !! )
//
//if(!$confirmed && !$archived) { // if confirmed is true, the user has already indicated that he accepts an overload

// This check has two purposes
// - in case of concurrent planning management, we want to show that so else has just created or modified a reservation that conflicts with this saving
// - when a user overloads some resources on the planning (let's say mutliple resource type planning), he should be warned 
//
$i = $dS_reservation->cueIn; 
$o = $dS_reservation->cueOut;
//$x = $dS_reservation->id; 
$excludethis = ''; 
//if($x>0) $excludethis = 'AND reservations.id <> '.$x;
$r = $attendees->getResourceIdsList();
$SQL = 'SELECT reservations.id AS id, creator, created, changer, changed, cueIn FROM reservations 
        JOIN attendees ON attendees.groupId = reservations.id
        WHERE ( reservations.groupId = '.$accountId.' AND '.$i.' < cueOut AND '.$o.' > cueIn) 
            '.$excludethis.' AND reservations.deletorId = 0	AND resourceId IN ('.$r.');';

$result = C_dbIO::q($SQL);
if($result->num_rows) { // report some info about what reservations we are overloading here (this protocol is read in .js see (*20*))

    $loginIds = Array(); $resaIds = Array(); $stamps = Array();

    while($row = $result->fetch_array()) { 
        if($row['changer']!='') $lId = $row['changer']; else $lId = $row['creator']; 
        $stamp = 'X';
        $create = new C_date($row['created']); $stamp = $create->getTstmp();
        $change = new C_date($row['changed']); if($row['changer']) $stamp = $change->getTstmp();
        $resaId = $row['id'];
        //echo "resaId2=".$resaId."</br>";
        $cueIn = $row['cueIn'];

        $loginIds[] = $lId; $resaIds[] = $resaId; $stamps[] = $stamp; $cueIns[] = $cueIn; 
        unset($lId, $resaId, $stamp, $cueIn);
    }

    $servernow = new C_date(); $servernow = $servernow->getTstmp();
    die('Overload!'.$servernow.'!'.implode(',',$cueIns).'!'.implode(',',$loginIds).'!'.implode(',',$stamps).'!'.implode(',',$resaIds).$nl);
}
$result->close();

//}

$perfReport->peak('::Overload check');	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Delete older attributes
//
//$formerly_existing_attendees = false;
//$formerly_existing_visitors = false;
$timing_changed = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Save reservation & attributes ( keep these lines after confirmation in case of overload )
//
$dS_reservation->deleted = '0000-00-00 00:00:00'; // when saving a deleted reservation, you restore it
$dS_reservation->deletorId = 0;
$dS_reservation->rescheduled = 0;
$dS_reservation->archived = 0; // if not reset, the data set goes back to archive tables (which is not what we want, see (*21*)
//if($parts) $dS_reservation->iscluster = 1;

$dS_reservation->dSsave(); 
$resaId = $dS_reservation->id; // now resaId is the id of the new reservation (if it was archived or virtual) // see (*23*)
//echo "resaId3=".$resaId."</br>";

$attendees->saveAll($resaId); // group attendees by reservation id
$att_visitors->saveAll($resaId); 

$perfReport->peak('::Saving reservation');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Performances
//

if($workcodes) foreach($workcodes as $id) {

    $q = new Q('select id from workcodes where id = '.$id.';'); if(!$q->ids()) continue; // the workcode has been deleted from the account config by another user.

    if($visitors) { // one performance for each visitor
        foreach($visitors as $visitorId) {
            $dS_performance = $performances->newVirtual();
            $dS_performance->workCodeId = $id;
            $dS_performance->visitorId = $visitorId;
        }
    } else { // a single performance (this is not an appointment but a time reservation)
        $dS_performance = $performances->newVirtual();
        $dS_performance->workCodeId = $id;
        $dS_performance->visitorId = 0;
    }
}
$performances->saveAll($resaId); // group performances by reservation id
$perfReport->peak('::Workcodes');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Recurrence - create a new serie of reservations
//
$rec_resas = new C_dbAccess_reservations();
//$dS_serie = false;
$rec_resas->add($dS_reservation);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Pre-booking timer function. 
//
// 	When the number of minutes is over, if the pre-booking is not cancelled, the reservation is deleted
//	If the reservation exists, the timer might be updated

if($expires!==false) { // only if expires was posted
	foreach($rec_resas->keyed as $rid => $dS_resa)
		C_dS_prebooking::queue($dS_resa, $expires); // a number of minutes. After this delay, the reservation is deleted by the minute.php cron
}

// E-PAIMENT ////////////////////////////////////////////////////////////////////////////////

require '../../../../mobminder/lib_mobphp/onlinepayment.php';

if ($paymean==paymean_payconiq || $paymean==paymean_cards)
{
    $amount = $_POST['amount'];
    $transnote = $_POST['transnote'];
    $paymentid = 0;

    $dS_payment = new C_dS_payment($paymentid, $resaId, $_POST);


    $_SESSION['e-resa'] = $resaId;
    session_write_close();
    
    //PAYCONIQ/////////////////////////////////////////////////////////////////////////
    if ($paymean==paymean_payconiq)
    {
        //first save for sending payment id to payconiq
        $dS_payment->qrcodestring = "";
        $dS_payment->transid="";
        $dS_payment->transtatus=payment_status_isnew;
        $dS_payment->opstatus = "";
        $dS_payment->dSsave();

       

        //foreach ($_SESSION as $key=>$val) echo 'session='.$key." ".$val."<br/>";

        //load payconiq parameters from account
        //$payconiqkey = '22868856-4835-4018-9130-4c7a9442ef90'; //TODO
        $payconiqkey = $dS_account->ePayconiqKey;
        $mobreference = $dS_payment->id; 	//save mobminder reference (payment id) in payconiq transaction,
                                            //will be used by callback for updating related payment
        $postfixurl = $dS_login->eresaUrl;
        $visitorid = $visitors[0];
        $r = urlencode(base64_encode($visitorid."-".$resaId));
        
        //$returnurl = payconiqbasereturnurl.$postfixurl."?r=".$r;
        //$returnurl = payconiqbasereturnurl.$postfixurl;
        $returnurl = null;

       
        //echo 'returnurl='.$returnurl;

        $interface = new C_PayconiqGateaway($payconiqkey);
        $result = $interface->createPayment(
            $amount,
            $transnote,
            $mobreference,
            $returnurl);

        if (!$result)
        {
            $dS_payment->qrcodestring = '';
            $dS_payment->transid='';
            $dS_payment->transtatus=payment_status_failed; //error
            $dS_payment->opstatus = truncateString($interface->lasthttpcode.":".$interface->lasterrorcode,32);
            C_dS_exception::put('post/payment.php', 'payconiq error',$interface->lasthttpcode.":".$interface->lasterrorcode."-".$interface->lasterrormessage);

            $dS_payment->dSsave();
            $dS_reservation->dSobsolete();

            $servernow = new C_date(); $servernow = $servernow->getTstmp();
            die('PayconiqError!'.$servernow.'!'.$interface->lasthttpcode.":".$interface->lasterrorcode."-".$interface->lasterrormessage.$nl);
        }
        else
        {
            //$dS_payment->qrcodestring = $result->deeplink;
            $dS_payment->qrcodestring = $result->universalurl;

            //echo 'deeplink='.$result->deeplink;

            $dS_payment->transid = $result->paymentid;

            //$dS_payment->transtatus= strtolower($result->status);
            $dS_payment->transtatus = converterPayconiqtoPaymentStatus($result->status); //always PENDING in creation
            $dS_payment->opstatus = truncateString($result->status,32);
            
        }
    }
    else if ($paymean==paymean_cards) //Computop
    {
        $BlowfishPassword = "6Mf_m[C72s=W*4Qe"; //$dS_account->
        $MerchantID = "done4you_test"; //$dS_account->
        //$MerchantID = "aaaaaaaaaa"; //$dS_account->
        $HmacPassword = "Yf4[*Fm7Ra6)p2_BTy9(?Me35!Nz=Aq8"; //$dS_account->
         
        $postfixurl = $dS_login->eresaUrl;
        $returnurl = computopreturnurl.$postfixurl;
        
        $dS_payment->dSsave(); //-> need of saved payment id for transid!
       
        $gw = new C_ComputopGateaway($BlowfishPassword,$MerchantID,$HmacPassword);
         
        $transid = $dS_payment->id;
        $description = "test:0000"; //use $transnote
        $timeoutsec = 240; //4minutes
        $languageIso2 = L::$languageAbrevs[$dS_login->language]; 
        $request = $gw->createRequest($transid,$amount,$description ,$returnurl,$timeoutsec,$dS_account->id,$languageIso2); 
       
            //echo 'url='.$request->Url.'</br>';
            //echo 'MerchantID='.$request->MerchantID.'</br>';
            //echo 'Len='.$request->Len.'</br>';
            //echo 'Data='.$request->Data.'</br>';
            //echo 'Language='.$request->Language.'</br>';

        $dS_payment->qrcodestring = $request->GETUrl;
        $dS_payment->transid = "";
        //$dS_payment->transtatus= strtolower($result->status);
        $dS_payment->transtatus = payment_status_pending; //always PENDING in creation
        $dS_payment->opstatus = "";
    }
    
    $dS_payment->dSsave();
}
else
{
    $dS_payment=false;   
}


// END OF E-PAIMENT /////////////////////////////////////////////////////////////////////////////////////////

echo '<code>';
echo $attendees->cutToView($is_limited_view?$view_resources->viewIds:false)->stream(no_alias, $bank);
echo $att_visitors->stream(no_alias, $bank);
echo $performances->stream(no_alias, $bank);
//echo $resaparts->stream(no_alias, $bank);
//echo $toggles->stream();
echo $rec_resas->stream(no_alias, $bank); // embraces recurrent or non recurrent dS_reservation(s)
//if($dS_serie) echo '#C_dS_resa_serie'.'#'.$bank.$nl.$dS_serie->stream(with_tracking).$nl;
if ($dS_payment)
{
    //echo '#C_dS_payment#plitems'.$nl.$dS_payment->stream(no_alias, $bank).$nl; //with_tracking
    echo $dS_payment->stream1(with_tracking, $bank); //with_tracking
}
echo '</code>';
$perfReport->peak('::completed');
$perfReport->dropReport();

if(!local_test) { // disabled when testing, so the next section can echo on the screen
	closeconnection();
}

C_dS_connection::poke($perfReport, 'p_resa');

define('crontest', local_test); // this prevents the comm layer to really send communication to the SMS provider





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Now takes place the processing we want to happen AFTER feedback has been delivered to the client side
//



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// notifications 
//

$abortnotifications = false; 
notice(chr(10));

if(!($bCals||$uCals)) $abortnotifications = 'fcals only in attendees'; // In this case the reservation is only on facultative resource. 
if(!$visitors) $abortnotifications = 'no notifications for a reservation having no visitor';
if(!$dS_account->sendSMSs) $abortnotifications = 'this account has a disabled communication switch';
// if($timing_changed) $abortnotifications = 'The reservation schedule nor recepients have changed'; // PVH 2022 this would prevent manual notifications messages to leave

if($expires!==false) { // only if expires was posted
	if($expires>0) { // then do not send any communication
		$abortnotifications = 'this reservation is on the expire list';
	}
}


notice(chr(10)); 
if($abortnotifications) h1('No notification will be sent: '.$abortnotifications);
else 
	sendEventMessages($dS_login, $dS_account, $resaId, action_create, $timing_changed, $testmode = local_test);

notice(chr(10)); 



//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
// updated by bspoden
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if ($expires==false) { // only if expires was posted
	
    require '../../../lib_cronofy/cronofymanager.php';

    DebugLog('post/reservation.start');
    $dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accountId);
    $dS_resa = new C_dS_reservation($resaId);
    DebugLog('post/reservation.2');

    // if change, delete old event (because, attendee are deleted then created)
    /*if($formerly_existing_attendees) 
    {
        DebugLog('post/reservation.before attendeedeleted');
        $dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$formerly_existing_attendees);
    }*/

    //reset remote id and profile, if eventuid existed in past, it has been deleted!
    if($dS_resa->remoteProfile!=0)
    {
        //force remoteid with '1' to know that event was born as an external event
        $dS_resa->remoteid = '1';
        $dS_resa->remoteProfile = 0;
        $dS_resa = $dS_resa->dSsave();
    }

    //create all, only eventid and no eventuid because eventuid has been reset in reservation
    DebugLog('post/reservation.3');
        // create all, only eventid and no eventuid because eventuid has been reset in reservation
        // view is false when all resources are visible to this login, or a comalist when the view is limited
    $dS_cronofy_manager_reservation->UpsertForAttendees($dS_resa,null /*excludeCalendarId*/);
    DebugLog('post/reservation.end');

}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//bsp-end

// new C_hl7_notification($accountId,$dS_resa);


?>