<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T   A P I   /   Q U E R Y    V I S I T O R 'S    A P P O I N T M E N T S 
//

ob_start(); // relates to (*cc)
require '../smapplib202307.php';

//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <file></file>
//
//
// http://localhost/api/query/visiapps.php?id=2387596&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//
// 

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);


$id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = '';
$history = @$_REQUEST['history']; if(!isset($history)) $history = false;
$deleted = @$_REQUEST['deleted']; if(!isset($deleted)) $deleted = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if(!($id))
			abort('0300','You must specify a visitor id');
		indent('o id: '.$id,6);
	
	h3('Checking optional fields');
	
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
			
	
		if($history===false) {
			indent('o history: omitted, default is without history',6);
		} else
			indent('o history: '.$history,6);
	
		if($deleted===false) {
			indent('o deleted: omitted, default is without deleted items',6);
		} else
			indent('o deleted: '.$deleted,6);
		
		
	h3('Screening disallowed fields');
	
		indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($id)))
			abort('0302','visitor id must be numeric');
		if($history!==false) 
			if(!(is_numeric($history)))
			abort('0303','history must be numeric');
		 
		
		indent('all fields are made from allowed chars',6);
	
		// if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);

	
	h3('Fields format and value validation');
	
	
		$q = new Q('select id from visitors where id = '.$id.' and groupId = '.$context->accountid.';');
		if(!($q->ids())) abort('0304','You must specify a valid visitor Id');
		
		if($history===false) {
			$history = 0;
		} else
			if($history!=1&&$history!=0)  abort('0305','history is out of range [0,1], you passed:'.$history);
		
		$history = !!$history;
		if(!$history) { 
			$now = new C_date();
			indent('Showing only future appointments, pivot time is '.$now->getDateTimeString(),6);
		}
		
		if($deleted===false) {
			$deleted = 0;
		} else
			if($deleted!=1&&$deleted!=0)  abort('0306','deleted is out of range [0,1], you passed:'.$deleted);
		
		$deleted = !!$deleted;
		
		pad();
		indent('all fields have valid format and value range',6);
		
		
pad();


//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    D A T A 
//
	
	function queryResaIds($visiId, $view, $deleted = false, $history = false, $archive = '') {
		
		$a = $archive;
		$view = ' and '.$a.'attendees.resourceId in ('.$view.')';
		$deleted = $deleted?'':' and deletorId = 0';
		
		$futureonly = ''; if(!$history) {
			$now = new C_date();
			$futureonly = ' and cueIn > '.$now->getTstmp();
		}
		if($view == '') return '';
		
			$join = 'join '.$a.'att_visitors on '.$a.'att_visitors.groupId = '.$a.'reservations.id';
		$q = new Q('select '.$a.'reservations.id from '.$a.'reservations '.$join.' where '.$a.'att_visitors.resourceId = '.$visiId.$futureonly.$deleted.';');
		$aids = $q->ids();
		if(!$aids) return '';
		
			$join = 'join '.$a.'attendees on '.$a.'attendees.groupId = '.$a.'reservations.id';
		$q = new Q('select '.$a.'reservations.id from '.$a.'reservations '.$join.' where '.$a.'reservations.id in ('.$aids.')'.$view.';');
	
		return $q->ids();
	}
	
	$visiId = $id;
	$view = $context->resources->viewIds;
	
	$resaIds = queryResaIds($visiId, $view, $deleted, $history);
		
	$dbAccess_reservations 	= new C_dbAccess_reservations();
	$dbAccess_visitors 		= new C_dbAccess_visitors();
	$dbAccess_attendees 	= new C_dbAccess_attendees();
	$dbAccess_att_visitors 	= new C_dbAccess_att_visitors();
	$dbAccess_performances 	= new C_dbAccess_performances(); 

	//new dbAccess_payments in 2023/07 version
	$dbAccess_payments 		= new C_dbAccess_payments(); 
	
	
	if($resaIds) {
	
		$dbAccess_reservations	->loadOnId($resaIds);
		$dbAccess_attendees		->loadOnGroup($resaIds);
		$dbAccess_att_visitors	->loadOnGroup($resaIds);
		$dbAccess_visitors		->loadOnId($dbAccess_att_visitors->getVisitorsIds());
		$dbAccess_performances	->loadOnGroup($resaIds);
		$dbAccess_payments		->loadOnGroup($resaIds);
	}
	
	if($history) {
		
		$arch_resaIds = queryResaIds($visiId, $view, $deleted, $history, 'archive_');
		
		if($arch_resaIds) {
			
			$dbAccess_arch_reservations = new C_dbAccess_reservations('archive_');
			$dbAccess_arch_attendees 	= new C_dbAccess_attendees('archive_');
			$dbAccess_arch_att_visitors = new C_dbAccess_att_visitors('archive_');
			$dbAccess_arch_performances = new C_dbAccess_performances('archive_'); 
			$dbAccess_arch_payments 	= new C_dbAccess_payments('archive_'); 
			
			$dbAccess_arch_reservations	->loadOnId($arch_resaIds);
			$dbAccess_arch_attendees	->loadOnGroup($arch_resaIds);
			$dbAccess_arch_att_visitors	->loadOnGroup($arch_resaIds);
			$dbAccess_visitors			->loadOnId($dbAccess_arch_att_visitors->getVisitorsIds());
			$dbAccess_arch_performances	->loadOnGroup($arch_resaIds);
			$dbAccess_arch_payments		->loadOnGroup($arch_resaIds);
			
			$dbAccess_reservations	->absorb($dbAccess_arch_reservations);
			$dbAccess_attendees		->absorb($dbAccess_arch_attendees);
			$dbAccess_att_visitors	->absorb($dbAccess_arch_att_visitors);
			$dbAccess_performances	->absorb($dbAccess_arch_performances);
			$dbAccess_payments		->absorb($dbAccess_arch_payments);
		}
	}
	
if($dbAccess_visitors->count())
	foreach($dbAccess_visitors->keyed as $vid => $dS_visitor) { // PVH 2025-01 : preserve the older versions of the smartapp from the new language_code_luxembourgish and gender_code_other
		if($dS_visitor->language==language_code_luxembourgish) $dS_visitor->language=language_code_french;
		if($dS_visitor->gender==gender_code_other) $dS_visitor->gender=gender_code_female;
	}
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');
	
echo '<data>';
span('&ltdata&gt');

							 
		$fieldsV = C_api::fieldslist('C_dS_visitor');
	echo $dbAccess_visitors->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsV); 
	
		$fieldsAV = Array('groupId','resourceType','resourceId');
	echo $dbAccess_att_visitors->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAV);
	
		$fieldsAR = Array('groupId','resourceType','resourceId');
	echo $dbAccess_attendees->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAR);
	
		$fieldsP = Array('groupId','workCodeId');
	echo $dbAccess_performances->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsP);
	
		$fieldsR = C_api::fieldslist('C_dS_reservation');
	echo $dbAccess_reservations->addmeta_prebooking()->setstringtimeformat($utc)->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsR);

		$fieldsPay = C_api::fieldslist('C_dS_payment');
	echo $dbAccess_payments->stream(no_alias, no_bank, no_tracking, '|', $fieldsPay);

span('&lt/data&gt');
echo '</data>';	




//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

$perfReport->peak('::protocol streamed');

$perfReport->dropReport(); // no perf report for production




//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o id: the visitor unique id',6);
		
		h3('optional posts');
		indent('o history: includes visitor history. Range [0,1]. Default:0 (history not included)',6);
		indent('o deleted: includes deleted appointments. Range [0,1]. Default:0 (deleted items not included)',6);
		indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
	
	h2('Returned objects');

	explainclass($dbAccess_visitors		, $fieldsV, '|');
	explainclass($dbAccess_att_visitors	, $fieldsAV, '|');
	explainclass($dbAccess_attendees	, $fieldsAR, '|');
	explainclass($dbAccess_performances	, $fieldsP, '|');
	explainclass($dbAccess_reservations	, $fieldsR, '|');
	
	
	h2('Feedback payload');
	payload();
	
pad();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>