<?php
//////////////////////////////////////////////////////////////////////
//
//  W E B   A P P  /  D E L E T E    A    R E S E R V A T I O N   
//

// SQL delete CASE: deleting all appointments that relate to a given visitor.
//
// delete from reservations using reservations left join att_visitors on (att_visitors.groupId = reservations.id) where att_visitors.resourceId = 664100;
// delete from attendees using att_visitors left join attendees on (att_visitors.groupId = attendees.groupId) where att_visitors.resourceId = 664100;
// delete from att_visitors where resourceId = 664100;


define('local_test', false);

if(!local_test) ob_start(); // relates to (*ob1)

require '../classes/language.php';
$loadcontext = 2; 
require '../classes/ajax_session.php'; 
require '../classes/connection.php'; 

if(isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
if(isset($_SESSION['e-paymean'])) unset($_SESSION['e-paymean']);
session_write_close(); 

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$id = $_POST['id'];
$archived = $_POST['archived']+0;
if($id<=0) die('Trying to delete a virtual...');

$peerId = @$_POST['peerId']; if(!isset($peerId)) $peerId = false; // e-reservation does not send peerId and removePeer parameters
$removePeer = @$_POST['removePeer']; if(!isset($removePeer)) $peerId = false;

if($archived) $targetTable = 'archive_'; else $targetTable = '';

// Reservation
//
$dS_resa = new C_dS_reservation($id, $accountId, $_POST);

if($accountId != $dS_resa->groupId) die ('You should stay in your own playground. <command>logoff</command>');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Communication toggle options
//

$toggles = new C_dbAccess_cToggles();	

	$sms = @$_POST['sms']; 		if(isset($sms)) $sms = ($sms=='-') ? false : explode('!', $sms); 			else $sms = false;
	$mails = @$_POST['mails']; 	if(isset($mails)) $mails = ($mails=='-') ? false : explode('!', $mails); 	else $mails = false;

$toggles->setbundels($accountId, $dS_resa->id, $sms, $mails);

$perfReport->peak('::Communication switches (on/off)');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// peer reservations
//

if($peerId) { 
    $o_dbAccess_attendees = new C_dbAccess_attendees($targetTable);
    $dS_resa->peerId = 0;
    $dS_peer_reservation = new C_dS_reservation($peerId);
    if($removePeer) { // the easy case, we remove everything

        $o_dbAccess_att_visitors = new C_dbAccess_att_visitors($targetTable);
        $o_dbAccess_resaparts = new C_dbAccess_resaparts($targetTable);
        $o_dbAccess_performances = new C_dbAccess_performances($targetTable);
        $toggles = new C_dbAccess_cToggles();

        // clean up peer
        $o_dbAccess_attendees->deleteOnGroup($peerId);
        $o_dbAccess_att_visitors->deleteOnGroup($peerId);
        $o_dbAccess_resaparts->deleteOnGroup($peerId);
        $o_dbAccess_performances->deleteOnGroup($peerId);
        $toggles->deleteOnResaId($peerId);
        $dS_peer_reservation->dSdelete();

    } else { // the complicated case: when removing a car resa, then also clean up the appointment from its fCal 
        // then we need to unleash the peer reservation
        $dS_peer_reservation->peerId = 0;
        $dS_peer_reservation->dSsave();
        // but also we need to remove the fCal of the peer reservation, if the peer reservation has a bCal
        $o_dbAccess_peer_attendees = new C_dbAccess_attendees($targetTable);
        $o_dbAccess_peer_attendees->loadOnGroup($peerId);
        $o_dbAccess_attendees->loadOnGroup($id);
        if($o_dbAccess_attendees->countClass(class_fCal)) // the reservation under deletion has an fCal at least					
            if($o_dbAccess_peer_attendees->countClass(class_bCal)) // the peer reservation has one bCal at least
                if($o_dbAccess_peer_attendees->countClass(class_fCal)) // and the peer resa has fCals also
                    foreach($o_dbAccess_peer_attendees->keyed as $peerAttId => $dS_peer_attendee) // scan the peer attendees
                        if($dS_peer_attendee->resourceType == class_fCal) // and only for fCals
                            foreach($o_dbAccess_attendees->keyed as $attId => $dS_attendee)
                                if($dS_peer_attendee->resourceId == $dS_attendee->resourceId) // remove from the peer the ones fCals that are common to both reservations
                                { $dS_peer_attendee->dSdelete(); }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 		D E L E T E    R E S E R V A T I O N
//



if(!$archived) $dS_resa->save(); // resa from current table have note and colors editable on delete action


$attendee_impact_only = false;
	// here we study the case of a user who doesn't see all resources in the account, but wants to remove his presence from an appointment where other resources are implied
	//
	
if($is_limited_view) { // not all resources are visible by this login, see also (*lv1*)
	
	$atts_asis = new C_dbAccess_attendees($targetTable); $atts_asis->loadOnGroup($id);
	$atts_as_seen = new C_dbAccess_attendees($targetTable); $atts_as_seen->loadOnView($view_rscs_ids_clist, $id);
	$inview = Array();
	$outofview = Array();
	foreach($atts_asis->keyed as $attid=>$dS_att)
		if(array_key_exists($attid,$atts_as_seen->keyed)) $inview[] = $attid; // inview will contain at least one element, otherwise it would not appear on the login's screen
			else $outofview[] = $attid; // may contain no element in case the reservation was all contained in the login's view
	if(count($outofview)) { // in this case we remove the inview attendees and keep the reservation visible for resources out of view 
			$aids = implode(',',$inview);
		$attendee_impact_only = true;
		$attendees_deleted = new C_dbAccess_attendees($targetTable); // for the cronofy process
		$attendees_deleted->loadOnId($aids);
		$q = new Q('delete from '.$targetTable.'attendees where groupId = '.$id.' and id in ('.$aids.')');
	}
	// then we need to drop the visible attendees for this login and keep the reservation for the outer resources
	
}

if($attendee_impact_only) $dS_resa->dSsave(); // change tracking
	else $dS_resa->dSobsolete(); // delete tracking

$perfReport->peak('::completed');
$perfReport->dropReport();



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// Echo to client side and close connexion (but keep this script running)
//
if(!local_test) { // disabled when testing, so the next section can echo on the screen

	closeconnection();
}




/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Now takes place the processing we want to do AFTER feedback has been delivered to the client side
//


C_dS_connection::poke($perfReport, 'p_resa');

	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// notifications 
//

$abortnotifications = false; 
notice(chr(10)); 
if(!$dS_account->sendSMSs) $abortnotifications = 'this account has a disabled communication switch';	

notice(chr(10)); 
if($abortnotifications) h1('No notification will be sent: '.$abortnotifications);
else 
	sendEventMessages($dS_login, $dS_account, $dS_resa->id, action_delete, $timing_changed = false, $testmode = local_test);

notice(chr(10)); 


//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
//
require '../../../lib_cronofy/cronofymanager.php';

DebugLog('delete/reservation.start');

//delete RV for all attendees--------------
$dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accountId);

if($attendee_impact_only)
    $dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$attendees_deleted);
else
    $dS_cronofy_manager_reservation->DeleteForAllAttendees($id);

//reset remote ID and remote Profile-------
//if eventuid existed in past, it has been deleted!
if($dS_resa->remoteProfile!=0) 
{
    //force remoteid with '1' to know that event was an external event
	$dS_resa->remoteid='1';
   	$dS_resa->remoteProfile=0;
	$dS_resa->save();
}
DebugLog('delete/reservation.end');
//bsp-end



?>