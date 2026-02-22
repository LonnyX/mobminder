<?php
//////////////////////////////////////////////////////////////////////////////////////////////
//
//      S M A R T   A P I    /    D E L E T E     R E S E R V A T I O N 
//
//
// Use always your login data when calling this file: 
//
// Changing a reservation note:
// 		http://localhost/api/delete/reservation.php?id=7959973&note=thenewnote&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
// 
// 
// Testing: use &web=1 to get html rendering.
//

define('local_test', false); // local test is for development. To be used in conjunction with &web=1

if(!local_test) ob_start(); // relates to (*ob1)

require '../smapplib.php';


$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
	$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
	$accountid = $context->accountid;
	$dS_account = $context->dS_account;
	$view = $context->resources->viewIds;
	
new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias


$resaId = @$_REQUEST['id']; if(!isset($resaId)) $resaId = false;
$probe = @$_REQUEST['probe']; if(!isset($probe)) $probe = false; else $probe = !!$probe;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
pad();


		

//////////////////////////////////////////////////////////////////////  ??!! Attention : effacer une réservation qui est en pre-booking ?
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	

	h3('Checking for mandatory fields');
	
		if($resaId===false) abort('5500','You must specify a reservation id');
			else if(!is_numeric($resaId)) abort('5501','You must specify a numeric integer id');
			 else indent('o reservation id :'.$resaId.'',6);


	h3('Checking optional fields');
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
			

	h3('Screening disallowed fields');

		screenTrackingFieldsOverwrite();
		
		$anydiscard = false;
		
		if(isset($_REQUEST['archived'])) {
			warning('archived field is not applicable, discarding your post for archived');
			unset($_REQUEST['archived']);
			$anydiscard = true;
		}
		
		if(isset($_REQUEST['cueIn'])) {
			warning('cueIn field is not applicable, discarding your post for cueIn');
			unset($_REQUEST['archived']);
			$anydiscard = true;
		}
		
		if(isset($_REQUEST['cueOut'])) {
			warning('cueOut field is not applicable, discarding your post for cueOut');
			unset($_REQUEST['archived']);
			$anydiscard = true;
		}
		
		if(!$anydiscard)
			indent('none',6);
		
		

	h3('Fields format/value validation');
	
		if($context->isValidReservation($resaId)) indent('o reservation id :'.$resaId.' is valid',6);
			else abort('5050','You must specify a valid reservation id');
	
		if($allok = fieldsvalidator($_REQUEST, $context)) { pad(0); indent('all fields have valid format and value range',6); }		

pad();
	
	
		
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 		D E L E T E    R E S E R V A T I O N
//

$dS_resa = new C_dS_reservation($resaId, $accountid, $_REQUEST);
$dS_resa->save(); // resa from current table have note and colors editable on delete action, no tracking

$art = $dS_resa->archived ? 'archive_' : ''; // target archives table

$attendee_impact_only = false;
	// here we study the case of a user who doesn't see all resources in the account, but wants to remove his presence from an appointment where other resources are implied
	//
if($context->is_limited_view) { // not all resources are visible by this login, see also (*lv1*)
	
	$atts_asis = new C_dbAccess_attendees($art); $atts_asis->loadOnGroup($resaId);
	$atts_as_seen = new C_dbAccess_attendees($art); $atts_as_seen->loadOnView($view, $resaId);
	$inview = Array();
	$outofview = Array();
	foreach($atts_asis->keyed as $attid=>$dS_att)
		if(array_key_exists($attid,$atts_as_seen->keyed)) $inview[] = $attid; // inview will contain at least one element, otherwise it would not appear on the login's screen
			else $outofview[] = $attid; // may contain no element in case the reservation was all contained in the login's view
	if(count($outofview)) { // in this case we remove the inview attendees and keep the reservation visible for resources out of view 
			$aids = implode(',',$inview);
		$attendee_impact_only = true;
		$attendees_deleted = new C_dbAccess_attendees($art); // for the cronofy process
		$attendees_deleted->loadOnId($aids);
		$q = new Q('delete from '.$art.'attendees where groupId = '.$resaId.' and id in ('.$aids.')');
	}
	// then we need to drop the visible attendees for this login and keep the reservation for the outer resources
	
}
	
if($attendee_impact_only) $dS_resa->dSsave(); // change tracking
	else $dS_resa->dSobsolete(); // delete tracking




//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//
//   in any case, when the user deletes a reservation, there stays nothing in his view, so we don't need to echo any dS_attendee
// 

	h2('Object deleted'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; 
span('&ltdata&gt');

		// $fieldsR = Array('id','created','creator','creatorId','changed','changer','changerId','deleted','deletorId','cueIn','cueOut','archived','note','bookingcode');
		$fieldsR = C_api::fieldslist('C_dS_reservation');	
	echo '#C_dS_reservation'.$nl.$dS_resa->addmeta_prebooking()->setstringtimeformat($utc)->stream(false, '|', $fieldsR).$nl;
	
span('&lt/data&gt');
echo '</data>'; 


$perfReport->peak('::completed');
$perfReport->dropReport();





//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


pad();
	technicalspecH1();
	
	h2('Behaviour (!important)');
	
		indent('Depending on the login\'s view, the target reservation can be deleted or it\'s resources list can be adapted. Here are the conditions:',3);
		pad(0);
		indent('Reservation goes to deleted state in these cases:',3);
		indent('o Single account.',6);
		indent('o The login has no view restriction (he sees all resources).',6);
		indent('o The login has a view restriction, but all resources of the target reservation are visible to the login.',6);
		pad(0);
		indent('Reservation resources set is adapted, only the change tracking applies:',3);
		indent('o Multi account.',6);
		indent('o The login has a view restriction (he sees a part of the resources).',6);
		indent('o Some of the resources of the target reservation are not visible to the login.',6);
		pad(0);
		indent('Here is why:',3);
		indent('When off days are applied to a group of resources by a manager or supervisor, some signle view logins might remove this off day from there calendar. Doing this they remove the off-day for the complete team. That is why we implemented the view-dependant delete.',6);
	
	pad(0);
	h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
			indent('o id: positive, must match an existing reservation.',6);
		
		h3('optional posts');
			indent('o note: alpha num text. The appointment note can be changed at deletion time.',6);
			indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
	
		h3('caution');
			indent('The deletion causes the object to be tracked (deletion time and login id) through the tracking fields (see returned objects).',6);
			indent('None of cueIn, cueOut, performance, attendees or visitors can be changed at deletion time.',6);
			indent('Editing a reservation that was deleted will cancel the deletion process and erase the deletion tracking data.',6);
			indent('A deleted reservation is considered free time on the planning.',6);
			indent('You can monitor deleted reservation on the Mobminder Web App planning screen by toggling with Ctrl+D shortcut.',6);
			
	pad();
				 
	h2('Returned objects');
	explainclass($dS_resa, $fieldsR, '|');
	
	h2('Feedback payload');
	payload();
	
pad();


//////////////////////////////////////////////////////////////////////////////////////////
//
// Echo to client side and close connexion (but keep this script running)
//
if(!local_test) { // disabled when testing, so the next section can echo on the screen

	pad();
	endrendermode();
	closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Now takes place the processing we want to do AFTER feedback has been delivered to the client side
//


$prebooking = C_dS_prebooking::is($dS_resa);

//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
//
if(!$prebooking) 
{
	require '../../../lib_cronofy/cronofymanager.php';

    $dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accountid);
	
if($attendee_impact_only)
    $dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$attendees_deleted);
else
    $dS_cronofy_manager_reservation->DeleteForAllAttendees($resaId);
	
	//reset remote ID and remote Profile-------
	//if eventuid existed in past, it has been deleted!
	if ($dS_resa->remoteProfile!=0) 
	{
		//force remoteid with '1' to know that event was an external event
		$dS_resa->remoteid='1';
    	$dS_resa->remoteProfile=0;
		$dS_resa->save();
	}
}
//bsp-end


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// notifications by SMS or emails
//



$abortnotifications = false; 

if(!$dS_account->sendSMSs&&!local_test) $abortnotifications = 'this account has a disabled communication switch';
if($prebooking) $abortnotifications = 'this reservation is on the expire list';



if($abortnotifications) warning('No notification will be sent: '.$abortnotifications);
else 
	sendEventMessages($context->dS_login, $dS_account, $resaId, action_delete, $timing_changed = false, $testmode = local_test);

pad();
endrendermode();


?>