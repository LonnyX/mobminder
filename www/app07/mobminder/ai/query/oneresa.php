<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    O N E   R E S E R V A T I O N
//
//
//    NO KEY ID REQUIRED FOR THIS API
//    After reception of a notification on the 'reservations' channel, the app needs to switch to the right account and resource display.
//	  Based on the reservationId passed as "data" parameter, the smartapp comes query here on the meta data relating to this reservation. 
//

define('closeconn',false);

if(closeconn) ob_start(); // relates to (*cc)
require '../aiapilib.php';


//
// You need to create a login with human access leve in the Mobminder setup (manager, spervisor, operator, delegate, admin). 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/query/keys.php?lgn=h4daxa&pwd=h4daxa&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

		$login 	= $_REQUEST['lgn'];
		$pass 	= $_REQUEST['pwd'];	

		
	$dS_login = C_dS_login::logon($login, $pass);
	if(!$dS_login) abort('0006','Wrong login/pass combination');
	
	C_dbIO::logged($dS_login,'(Smartapp)'); // sign any change in DB
	
	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
	$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);

$perfReport->peak('::time needed to log in');

	$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting it as value 1

			// introduced with notifications
	$accountId 	= @$_REQUEST['accId']; if(!isset($accountId)) $accountId = false;	// reservation id that was passed through the FCM api. See (*fcm01*)
	$resaId 	= @$_REQUEST['resaId']; if(!isset($resaId)) $resaId = false;	// reservation id that was passed through the FCM api. See (*fcm01*)

	if(!$resaId) { sleep(2); die('invalid entry 001'); }
	if(!$accountId) { sleep(2); die('invalid entry 002'); }

	$dS_resa = new C_dS_reservation($resaId);
	if(!$dS_resa->id) { 
		sleep(2); die('invalid entry 003'.$resaId);
	} 
		else
		{ 	// something exists, let's verify if the passed account id is coherent
		
			if($dS_resa->groupId != $accountId) {
				sleep(2); 
				die('invalid entry 004 '.$accountId.'='.$dS_resa->groupId.'/'.$resaId);
			}
		}
	
	$visitors 		= new C_dbAccess_visitors();
	$attendees 		= new C_dbAccess_attendees();
	$att_visitors 	= new C_dbAccess_att_visitors();
	$performances 	= new C_dbAccess_performances(); 
	
	$attendees		->loadOnGroup($resaId);
	$att_visitors	->loadOnGroup($resaId);
	$visitors		->loadOnId($att_visitors->getVisitorsIds());
	$performances	->loadOnGroup($resaId);
		
		
		
$perfReport->peak('::data is loaded');




//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//

	h2('Object saved'); notice('The following blueprint is the server payload response when not in web mode.'); pad(0);

echo '<data>';
if($web) span('&ltdata&gt');

		$fieldsA = Array('groupId','resourceType','resourceId');
	echo $attendees->cutToView($context->is_limited_view?$context->rscids_view:false)->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsA);
	
		$fieldsAV = Array('groupId','resourceType','resourceId');
	echo $att_visitors->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAV);
	
		$fieldsP = Array('groupId','workCodeId');
	echo $performances->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsP);
	
		$fieldsR = C_api::fieldslist('C_dS_reservation');
	echo '#C_dS_reservation'.$nl.$dS_resa->addmeta_prebooking()->setstringtimeformat4AI($utc)->stream(no_tracking, $sep = '|', $flds = $fieldsR).$nl;
	
		$fieldsV = C_api::fieldslist('C_dS_visitor');
	echo $visitors->stream(no_alias, no_bank, no_tracking, '|', $fieldsV); 
	
if($web) span('&lt/data&gt');
echo '</data>';




//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


if($web) {
	
	pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		h4('mandatory posts');
		
		indent('o lgn: your login as chosen on the account backoffice/accesses/', 6);
		indent('o pwd: your password as chosen on the account backoffice/accesses/', 6);
		
		indent('o accId: account id (bigint(20))', 6);
		indent('o resaId: reservation id (bigint(20))', 6);
	
	pad(0);
		h4('optional posts');
		indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
						
	
	h2('Returned objects');

	explainclass($att_visitors	, $fieldsAV,'|');
	explainclass($attendees		, $fieldsA, '|');
	explainclass($performances	, $fieldsP, '|');
	explainclass($visitors		, $fieldsV, '|');
	explainclass($dS_resa		, $fieldsR, '|');

	
	pad();
}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}

endrendermode();
if(closeconn) closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE



//////////////////////////////////////////////////////////////////////////////////////////
//
//   C O N N E C T I O N    C L O S E D





	



	
	
	
	
	
	
	
	
	
	
	
	




?>