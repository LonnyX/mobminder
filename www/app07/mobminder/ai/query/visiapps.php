<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    V I S I T O R 'S    A P P O I N T M E N T S 
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';

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

$context = new C_apicontext($xpected_alevel, $loadcontext=1, $perfReport);
$who = $context->dS_login->firstname; // who is talking to AI


// • Leave partof=0 or omit this parameter to return the full list of written C_dS_reservation instances.
// • Set partof=1 to query only C_dS_reservation instances that are visible in the PAST.
// • Set partof=2 to query only C_dS_reservation instances that are visible in the FUTURE.
// • Set partof=-1 to query the LATEST C_dS_reservation instance, that is when the visitor came last time.
// • Set partof=-2 to query the NEXT TO START C_dS_reservation instance, that is when the visitor is planned to come next time.

$id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = '';
$partof = @$_REQUEST['partof']; if(!isset($partof)) $partof = false;
$deleted = @$_REQUEST['deleted']; if(!isset($deleted)) $deleted = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
wo_pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if(!($id))
			abort('0300','You must specify a visitor id');
		wo_indent('o id: '.$id,6);
	
	h3('Checking optional fields');
	
		if($utc) wo_indent('o utc time format: YES',6);
			else  wo_indent('o utc time format: NO',6);
			
	
		if($partof===false) {
			wo_indent('o partof: omitted, default is 0',6);
		} else
			wo_indent('o partof: '.$partof,6);
	
		if($deleted===false) {
			wo_indent('o deleted: omitted, default is without deleted items',6);
		} else
			wo_indent('o deleted: '.$deleted,6);
		
		
	h3('Screening disallowed fields');
	
		wo_indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($id)))
			abort('0302','visitor id must be numeric');
		if($partof!==false) 
			if(!(is_numeric($partof)))
			abort('0303','partof must be numeric');
		 
		
		wo_indent('all fields are made from allowed chars',6);
	
		// if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);

	
	h3('Fields format and value validation');
	
	
		$q = new Q('select id from visitors where groupId = '.$context->accountid.' and id = '.$id.' limit 1;');
		if(!$q->ids()) abort('0304','You must specify a valid C_dS_visitor->id.');
		
		$dS_visitor = new C_dS_visitor($id);
		$vname = $dS_visitor->getFullName();
		
		
		if($partof===false) {
			$partof = 0;
		} else
			if($partof < -2 || $partof > 2)
				abort('0305','partof is not in the right range [-2,-1,0,1,2], you passed:'.$partof);
		
		$now = new C_date();
		switch($partof) { 
			case -2: wo_indent('Next to start appointment.',6); break; 
			case -1: wo_indent('Last appointment.',6); break; 
			case 0: wo_indent('The visitor\'s full record track.',6); break; 
			case 1: wo_indent('Appointments from the past.',6); break; 
			case 2: wo_indent('Futur planned appointments.',6); break; 
		}
		wo_indent('Pivot time is '.$now->getDateTimeString(),6).'.';
		
		if($deleted===false) {
			$deleted = 0;
		} else
			if($deleted!=1&&$deleted!=0)  abort('0306','deleted is out of range [0,1], you passed:'.$deleted);
		
		$deleted = !!$deleted;
		
		wo_pad();
		wo_indent('all fields have valid format and value range',6);
		
		
wo_pad();


//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    D A T A 
//
	
	function queryResaIds($accId, $visiId, $view, $deleted = false, $partof = false, $archive = '') {
		
		$a = $archive;
		$view = ' and '.$a.'attendees.resourceId in ('.$view.')';
		$deleted = $deleted?'':' and deletorId = 0';
		$now = new C_date();
		
		$futureonly = '';
		$limit = '';
		if($partof==0) {
			// leave no additional filter, we return all the visitor's track record.
		} else {
		
			if($partof==2||$partof==-2) 
				$futureonly = ' and cueIn > '.$now->getTstmp();
			if($partof==1||$partof==-1) 
				$futureonly = ' and cueOut < '.$now->getTstmp();
				
			if($partof<0) $limit = ' LiMiT 1';
		}
		
		
		if($view = '') return '';
		
			$join = 'join '.$a.'att_visitors on '.$a.'att_visitors.groupId = '.$a.'reservations.id';
			$whereacc = ' '.$a.'reservations.groupId = '.$accId;
		$q = new Q('select '.$a.'reservations.id from '.$a.'reservations '.$join.' where '.$whereacc.' and '.$a.'att_visitors.resourceId = '.$visiId.$futureonly.$deleted.$limit.';');
		$aids = $q->ids();
		if(!$aids) return '';
		
			$join = 'join '.$a.'attendees on '.$a.'attendees.groupId = '.$a.'reservations.id';
		$q = new Q('select '.$a.'reservations.id from '.$a.'reservations '.$join.' where '.$a.'reservations.id in ('.$aids.')'.$view.';');
	
		return $q->ids();
	}
	
	$visiId = $id;
	$view = $context->resources->viewIds;
	
	$resaIds = queryResaIds($context->accountid, $visiId, $view, $deleted, $partof);
		
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
	
	if($partof>=-1&&$partof<=1) { // so either -1, 0 or 1 will pass here
		
		$arch_resaIds = queryResaIds($context->accountid, $visiId, $view, $deleted, $partof, 'archive_');
		
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
	
	
$resacount = $dbAccess_reservations->count();
h2('<info>number of reservations found: '.$resacount.'</info>');

$dbAccess_reservations->setstringtimeformat4AI($utc,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
$dbAccess_reservations->magnify4AI($dbAccess_attendees,$dbAccess_att_visitors,$dbAccess_performances);

$dbAccess_visitors->setAIformats($context->dS_account); // sets the phone numbers format to a readable set of subset of digits



//////////////////////////////////////////////////////////////////////////////////////////
//
//   S E T U P    U P    R E T U R N E D    F I E L D S

		$fieldsV = C_api::fieldslist('C_dS_visitor'); // those fields list are centralized in aiapilib.php in such a way that they stay coherent all over the api
		$fieldsAV = C_api::fieldslist('C_dS_att_visitor');
		$fieldsAR = C_api::fieldslist('C_dS_attendee');
		$fieldsP = C_api::fieldslist('C_dS_performance');
		$fieldsR = C_api::fieldslist('C_dS_reservation');
		// $fieldsS = Array('id','stitle');
		// $fieldsPay = C_api::fieldslist('C_dS_payment');  // ADD explainclass(), it is missing here under in the tuto
		

//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L  

	wo_pad();
	technicalspecH1();
	
	if($web) {
		h2('Input parameters');
		
			exlainloginputs(); 
			
			h3('mandatory posts');
			indent('o There is no mandatory input data for this query',6);
			
			h3('optional posts');
			indent('o from: ISO8601 date stamp. E.g. 2018-12-31. Default value: current date on account timezone. ',6);
			indent('o days: integer number of days to be queried. Default: 1 day.',6);
			indent('o rscid: valid id\'s of resource objects from the target account, separated with a ! (exclam mark). Default: all resources.',6);
			indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
		
	
		wo_pad();
	}
	
	if($web||$resacount) {
		if($web) h2('Returned objects');
		htmlvisibletag('datamodel');	

		h3('Visitors'); wo_pad();
			explainclass($dbAccess_visitors, $fieldsV, '|');

		h3('Reservations'); wo_pad();
			explainclass($dbAccess_reservations, $fieldsR, '|');
			
		htmlvisibletag('/datamodel');	
		wo_pad();
	}

	
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); wo_notice('The following blueprint is the server payload response when not in web mode.');
$date = new C_date();

if($resacount) {
	htmlvisibletag('data');

		if($jason) echo $dbAccess_visitors->jason4AI(no_tracking, $fieldsV);
		else echo $dbAccess_visitors->stream(no_alias, no_bank, no_tracking, '|', $fieldsV);
		
		if($jason) echo $dbAccess_reservations->jason4AI(no_tracking, $fieldsR);
		else echo $dbAccess_reservations->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);

	htmlvisibletag('/data');
	
	
	htmlvisibletag('guidelines');
	
		// echo 'Possible scenari:'.$nl;
		// echo '• If you were asked to OPEN the planning, ask now '.$who.' what they want you to do with the available data.'.$nl;
		// echo '• If you were asked to FIND A VISITOR in the planning, ask '.$who.' for the firstname or lastname and look up the provided C_dS_visitor\'s data. If found, report [cueIn, firstname, lastname, workcode, note].'.$nl;
		echo 'Here is an example of how to voicely report the data:'.$nl.'"';	// double quote starts here
		$read = '';
			if($deleted) $read .= 'These are the deleted planning items for visitor '.$vname.'.';
			else {
				$readpart = '';
				switch($partof) {
					case -2: $readpart = 'next to start appointment'; break;
					case -1: $readpart = 'last appointment planned'; break;
					case 0: $readpart = 'entire list of appointments'; break;
					case 1: $readpart = 'list of past appointments'; break;
					case 2: $readpart = 'list of future planned appointments'; break;
				}
				$read .= 'Here is the '.$readpart.': ';
			}
			
		echo $read;
		echo $dbAccess_reservations->read4ai($dbAccess_visitors, $context->workcodes, $includeswho = false, $inclusiveCueOut = false, $inclusiveworkcode = true, $inclusivedate = true).'" '.$nl; // double quote ends here
		

	htmlvisibletag('/guidelines');
	
	
	htmlvisibletag('instructions');
		
		// echo 'DO NOT READ the planning unless the user specifically requested to read it.'.$nl;
		echo 'Before you start speaking, double-check that your speech respects one by one each point of the provided data.'.$nl;
		echo 'Combine all information into a single continuous sentence using plain text. Avoid Markdown formatting, line breaks, or bullet points.'.$nl;
		echo 'Any question regarding data not found in <data> should be answered with "That information is not available.", do not generate nor search elsewhere for any data.'.$nl;

	htmlvisibletag('/instructions');

}
else {
	htmlvisibletag('info');
	
	switch($partof) {
		
		case -1: echo 'There is no planning item in the past for visitor '.$vname.'.'.$nl; break;
		case 1: echo 'There is no planning item in the past for visitor '.$vname.'.'.$nl; break;
		
		case -2: echo 'There is no planning item in the future for visitor '.$vname.'.'.$nl; break;
		case 2: echo 'There is no planning item in the future for visitor '.$vname.'.'.$nl; break;
		
		case 0: echo 'There is no planning item at all for visitor '.$vname.'.'.$nl; break;
	}

	htmlvisibletag('/info');
}
	



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	wo_pad();
}



endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>