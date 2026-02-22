<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    P L A N N I N G    I T E M S
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

$from = @$_REQUEST['from']; if(isset($from)) $from = $from; else $from = false;
$days = @$_REQUEST['days']; if(isset($days)) $days = $days; else $days = false;
$rscids = @$_REQUEST['rscids']; if(!isset($rscids)) $rscids = false; // rscid like '60215,60218'
$fulldays = @$_REQUEST['fulldays']; if(!isset($fulldays)) $fulldays = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting it as value 1
$deletd = @$_REQUEST['cancelled']; $deleted = false; if(isset($deletd)) if($deletd==1) $deleted = true; // so the only way to turn deleted on is by setting it as value 1

$partin = @$_REQUEST['part']; $part = 0; if(isset($partin)) $part = $partin; // so the only way to turn utc on is by setting it as value 1
// part can have following values :
// 0 returns the full list of appointments in the given date range
// 1 returns only appointments written in the morning (days must be 1)
// 2 returns only appointments written in the afternoon (days must be 1)
// -1 returns only the next to start appointment (from must be ignored or pointing the current calendar day)

wo_pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');

$archive_pivot_from = C_dS_system::backupPivotStamp();


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		wo_indent('There is no mandatory fields for this query',6);
		
	
	h3('Checking for optional fields');
	
	if($web) {
		if($from) indent('o from: '.$from.'',6);
			else  indent('o from: not specified (defaults to current calendar day)',6);
	
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
	
		$defaultdate = ''; if(!$days&&!$from) $defaultdate = ' (defaults to today)';
		if($days) indent('o days: '.$days.'',6);
			else  indent('o days: not specified'.$defaultdate,6);
	
		if($rscids) indent('o rscid: '.$rscids.'',6);
			else  indent('o rscid: not specified',6);
	
		if($fulldays) indent('o fulldays: YES',6);
			else  indent('o fulldays: NO',6);
	
		if($deleted) indent('o only deleted reservations',6);
			else  indent('o all not deleted reservations',6);
	
		if($part) indent('o part: '.$part.'',6);
			else  indent('o part: not specified'.$defaultdate,6);
	}
		
	h3('Screening disallowed fields');
	
		wo_indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($part)))
			abort('0602','part must be numeric');
	
		if($part < -2 || $part > 2)
			abort('0602','part is not in the right range [-2,-1,0,1,2]');
		// if($deleted!==false) 
			// if(!(is_numeric($deleted)))
			// abort('0603','deleted must be numeric');
		 
		
		wo_indent('all fields are made from allowed chars',6);
	
		// if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);

	
	h3('Fields format and value validation');
	
	
		$tz = date_default_timezone_get();
		
		if($from===false) {
			
			$date = new C_date(); $date->setToMidnight();
			wo_indent('o from: not specified. Defaults to current date ['.$date->getDateSortable().' / '.$tz.']. Defaults to the current date on the account timezone.',6);
			
		} else if(!is_numeric($from)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
			
			$from = $context->isValidDateFormat($from);
			$date = new C_date($from);
			wo_indent('o from: ISO8601 time:['.$date->getDateSortable().' / '.$tz.']',6);
			
		} else { // from was passed as a numeric value ( UNIX timecode expected , referenced to GMT 0)
			
			$date = new C_date($from);
			wo_indent('o from: unix time format:'.$from.' ['.$date->getDateSortable().' / timezone not applicable in UTC]', 6);
		}
		
			
		$fromSearchIn = $date->getTstmp(); // turns back from into a unix timestamp
		$timescope = plitems_all_after;
		$fromSearchOut = false;
		
		if(!$days&&!$from) $days = 1;
		
		if($days){ 
			$timescope = plitems_visible_on_frame;
			$todate = clone($date); 
			$todate->dIncrement($days);
			$fromSearchOut = $todate->getTstmp(); // turns back from into a unix timestamp
		}
		
		// adjusting according to the $part option parameter
		$currentdate = new C_date(); $currentdatemidnite = $currentdate->setToMidnight()->getTstmp(); $currentdate = new C_date();
		$iscurrentdatequery = $currentdatemidnite == $fromSearchIn;
		$limit = false;
		if($part == -1 && !$iscurrentdatequery) $part = 0; // you can query the next to start appointment only on the current day.
		if($days == 1) // this query targets one calendar day
			switch($part) { // part == 1 or part == 2 is applicable
				case 1: $fromSearchOut -= 43200; break; // morning appointments (an entire day is 86400 seconds)
				case 2: $fromSearchIn += 43200; break; // afternoon appointments
				case -1: $limit = 1; $fromSearchIn = $currentdate->getTstmp(); break; // ongoing appointment, applies only on current calendar date
				case -2: $limit = 1; $fromSearchIn = $currentdate->getTstmp(); $timescope = plitems_all_after; break; // next appointment, applies only on current calendar date
			}
		
		if($rscids==0) $rscids=false;
		if($rscids===false) {
			wo_indent('o resources: You have not specified a filter on resources (all resources are included by default)',6);
			$view = $context->resources->viewIds;
			$scope = $view;
		} else if($rscids!==false) { // this is how the ai uses the api when displaying only one resource
			
			// $scope = used later to define from which resources the dS_reservation's are read from
			// $view = used to define from which resources the dS_attendee's are read from
			//
			// why :
			// the smartapp reads (and displays) reservations from only one resources at a time (scope)
			// but it displays and manages the resources seen from the login's view  (view)
			
				wo_indent('o filter on resource ids: '.$rscids,6); 
				$scope = $rscids; // use this instead if resourceids arrived separated with a ! : str_replace('!',',',$rscids);
				$view = $context->rscids_view;
					$r = explode(',',$scope); // $r is an Array();
				foreach($r as $rid) 
					if($rname = $context->isValidResource($rid)) wo_indent('o resource id :'.$rid.' is an existing resource: '.$rname,9);	
					else abort('0605','You must specify valid resource ids. '.$rid.' is unknown');
			}
		
		wo_pad(0);
		wo_indent('all fields have valid format and value range',6);
		
$perfReport->peak('::time needed to validate parameters');
		
wo_pad();

//////////////////////////////////////////////////////////////////////
//
//   P R E P A R I N G    D A T A     C O L L E C T I O N  
//

$dbAccess_reservations[0] = new C_dbAccess_reservations();
$dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');



$perfReport->peak('::time needed to setup time parameters and containers');


//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    D A T A 
//
	
$resaIds = Array(); 
$visiIds = Array(); 

// note that archived reservations are stored in current table until next sunday  <=> so we should not prefix with 'if($fromSearchOut >= $archive_pivot_from)'
	$dbAccess_reservations[0]->loadOnTimeSpan($context->accountid, $fromSearchIn, $fromSearchOut, $timescope, $scope, $fulldays, false/*$actions*/, false/*$logins*/, false/*$verbose*/, $deleted, $limit);
		$current = $dbAccess_reservations[0]->count();
	$perfReport->peak('::loaded from current table reservations ($current = '.$current.' items)');

if($fromSearchIn < $archive_pivot_from)
	$dbAccess_reservations[1]->loadOnTimeSpan($context->accountid, $fromSearchIn, $fromSearchOut, $timescope, $scope, $fulldays, false/*$actions*/, false/*$logins*/, false/*$verbose*/, $deleted);

	$archived = $dbAccess_reservations[1]->count();
	$perfReport->peak('::loaded from archived table reservations ($archived = '.$archived.' items)');


$dbAccess_attendees[0] = new C_dbAccess_attendees();
$dbAccess_attendees[1] = new C_dbAccess_attendees('archive_');

$dbAccess_att_visitors[0] = new C_dbAccess_att_visitors();
$dbAccess_att_visitors[1] = new C_dbAccess_att_visitors('archive_');

$dbAccess_resaparts[0] = new C_dbAccess_resaparts();
$dbAccess_resaparts[1] = new C_dbAccess_resaparts('archive_');

$dbAccess_resa_series[0] = new C_dbAccess_resa_series();
$dbAccess_resa_series[1] = new C_dbAccess_resa_series();  // 'archive_' not yet implemented, all records are in the same table

$dbAccess_visitors[0] = new C_dbAccess_visitors();
$dbAccess_visitors[1] = new C_dbAccess_visitors();

$dbAccess_performances[0] = new C_dbAccess_performances(); 
$dbAccess_performances[1] = new C_dbAccess_performances('archive_'); 



//new dbAccess_payments in 2023/07 version
$dbAccess_payments[0] = new C_dbAccess_payments(); 
$dbAccess_payments[1] = new C_dbAccess_payments('archive_'); 


if($current) {
		$resaIds[0] = $dbAccess_reservations[0]->getIdsList();
		$serieIds[0] = $dbAccess_reservations[0]->getList('serieId', true /*excludes zeroes*/);
	if($view) $dbAccess_attendees[0]->loadOnView($view, $resaIds[0]);
		else $dbAccess_attendees[0]->loadOnGroup($resaIds[0]); // even if one single resource is displayed, the asses must be accurate and therefore we need to know all attendees in the view
	$dbAccess_att_visitors[0]->loadOnGroup($resaIds[0]);
	$dbAccess_resaparts[0]->loadOnGroup($resaIds[0]);
	$dbAccess_resa_series[0]->loadOnId($serieIds[0]);
		$visiIds[0] = $dbAccess_att_visitors[0]->getVisitorsIds();
	$dbAccess_visitors[0]->loadOnId($visiIds[0], false);
	$dbAccess_performances[0]->loadOnGroup($resaIds[0]);
	$dbAccess_payments[0]->loadOnGroup($resaIds[0]);
	$perfReport->peak('::attributes loaded from current tables ('.$current.' items)');
}
if($archived) {
		$resaIds[1] = $dbAccess_reservations[1]->getIdsList();
		$serieIds[1] = $dbAccess_reservations[1]->getList('serieId', true /*excludes zeroes*/);
	if($view) $dbAccess_attendees[1]->loadOnView($view, $resaIds[1]);
		else $dbAccess_attendees[1]->loadOnGroup($resaIds[1]);
	$dbAccess_attendees[1]->loadOnGroup($resaIds[1]);
	$dbAccess_att_visitors[1]->loadOnGroup($resaIds[1]);
	$dbAccess_resaparts[1]->loadOnGroup($resaIds[1]);
	$dbAccess_resa_series[1]->loadOnId($serieIds[1]);
		$visiIds[1] = $dbAccess_att_visitors[1]->getVisitorsIds();
	$dbAccess_visitors[1]->loadOnId($dbAccess_att_visitors[1]->getVisitorsIds(), false);
	$dbAccess_performances[1]->loadOnGroup($resaIds[1]);
	$dbAccess_payments[1]->loadOnGroup($resaIds[1]);
	
	$perfReport->peak('::attributes loaded from archive tables ('.$archived.' items)');
	
	
		$dbAccess_visitors[0]->absorb($dbAccess_visitors[1]); 
		$dbAccess_attendees[0]->absorb($dbAccess_attendees[1]);
		$dbAccess_att_visitors[0]->absorb($dbAccess_att_visitors[1]);
		$dbAccess_resaparts[0]->absorb($dbAccess_resaparts[1]);
		$dbAccess_resa_series[0]->absorb($dbAccess_resa_series[1]);
		$dbAccess_performances[0]->absorb($dbAccess_performances[1]);
		$dbAccess_reservations[0]->absorb($dbAccess_reservations[1]);
		$dbAccess_payments[0]->absorb($dbAccess_payments[1]);
}

$resacount = $dbAccess_reservations[0]->count();
$nextsearch = '';
if($resacount) { // define the next date to call on if next availabilities are required
	$lastscanneddaystamp = $dbAccess_reservations[0]->getlast()->cueIn;
	$datenext = new C_date($lastscanneddaystamp);
	$datenext->dIncrement(1);
	$nextsearch = $datenext->getDateSortable();
} else {
	$datenext = clone($date); 
	$nextsearch = $datenext->dIncrement(1)->getDateSortable();
}

$dbAccess_reservations[0]->setstringtimeformat4AI($utc,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
$dbAccess_reservations[0]->magnify4AI($dbAccess_attendees[0],$dbAccess_att_visitors[0],$dbAccess_performances[0]);

$dbAccess_visitors[0]->setAIformats($context->dS_account); // sets the phone numbers format to a readable set of subset of digits
	

// foreach($dbAccess_reservations[0]->keyed as $rid => $dS_resa) // test, remove me
	// echo $dS_resa->visitorIds;


if($resacount) if($deleted) notice('<info>number of deleted reservations found: '.$resacount.'</info>');
				else notice('<info>number of reservations found: '.$resacount.'</info>');

// we don't remove double appearances of a single performance in a one appointment
// (they are necessary in DB to track which visitor attended which performance, but are useless to the smart-app)
// The backend will solve it. 

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
			explainclass($dbAccess_visitors[0], $fieldsV, '|');

		h3('Reservations'); wo_pad();
			explainclass($dbAccess_reservations[0], $fieldsR, '|');
			
		htmlvisibletag('/datamodel');	
		wo_pad();
	}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); wo_notice('The following blueprint is the server payload response when not in web mode.');

if($resacount) {
	htmlvisibletag('data');

		if($jason) echo $dbAccess_visitors[0]->jason4AI(no_tracking, $fieldsV);
		else echo $dbAccess_visitors[0]->stream(no_alias, no_bank, no_tracking, '|', $fieldsV);
		
		if($jason) echo $dbAccess_reservations[0]->jason4AI(no_tracking, $fieldsR);
		else echo $dbAccess_reservations[0]->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);

	htmlvisibletag('/data');
	
	
	htmlvisibletag('guidelines');
	
		// echo 'Possible scenari:'.$nl;
		// echo '• If you were asked to OPEN the planning, ask now '.$who.' what they want you to do with the available data.'.$nl;
		// echo '• If you were asked to FIND A VISITOR in the planning, ask '.$who.' for the firstname or lastname and look up the provided C_dS_visitor\'s data. If found, report [cueIn, firstname, lastname, workcode, note].'.$nl;
		echo 'Here is an example of how to voicely report the data:'.$nl.'"';	// double quote starts here
		$read = '';
			if($deleted) $read .= 'These are the deleted planning items';
			else {
				$readpart = '';
				switch($part) {
					case 0: $readpart = 'entire planning'; break;
					case 1: $readpart = 'morning planning'; break;
					case 2: $readpart = 'afternoon planning'; break;
					case -1: $readpart = 'next to start calendar item'; break;
				}
				$read .= 'Here is the '.$readpart.'';
			}
			$read .= ' '.'on '.$date->getSpokenDate().', ';
			
		echo $read;
		echo $dbAccess_reservations[0]->read4ai($dbAccess_visitors[0], $context->workcodes, $includeswho = true, $inclusiveCueOut = false, $inclusiveworkcode = true, $inclusivedate = false).'" '.$nl; // double quote ends here
		

	htmlvisibletag('/guidelines');
	
	
	htmlvisibletag('instructions');
		
		// echo 'DO NOT READ the planning unless the user specifically requested to read it.'.$nl;
		echo 'Before you start speaking, double-check that your speech respects one by one each point of the provided data.'.$nl;
		echo 'Combine all information into a single continuous sentence using plain text. Avoid Markdown formatting, line breaks, or bullet points.'.$nl;
		echo 'Any question regarding data not found in <data> should be answered with "That information is not available.", do not generate nor search elsewhere for any data.'.$nl;
		echo 'In case '.$who.' wanted to identify a C_dS_visitor from the specified day, please interact with '.$who.' so to pick the right C_dS_visitor and related C_dS_reservation from the provided data.'.$nl;
		echo 'In the next interaction, if '.$who.' requests the planning for the following calendar day, call this tool again using this date as input: '.$nextsearch.'.'.$nl;

	htmlvisibletag('/instructions');

}
else {
	htmlvisibletag('info');
	
	$givendate = '('.$date->getDayString().', '.$date->getDateSortable().')';
	switch($part) {
		case 0: echo 'There is no planning items on the given date '.$givendate.'.'.$nl; break;
		case 1: echo 'There is no planning items in the morning of the given date '.$givendate.'.'.$nl; break;
		case 2: echo 'There is no planning items in the afternoon of the given date '.$givendate.'.'.$nl; break;
		case -1: echo 'There is no planning items remaining to start today.'.$nl; break;
	}
	
	echo 'If you are asked for the next calendar day, then call this tool again with this date as input: '.$nextsearch.'.'.$nl;

	htmlvisibletag('/info');
}
	


//////////////////////////////////////////////////////////////////////////////////////////
//
//   TOOL DESCRIPTION ( Only in web mode, helps integration with Open AI )

class C_AI_tool {
	
    public $name;
    public $description;
    public $parameters;
	
}

if($web) {
	htmlvisibletag('tool');

	indent('o from: ISO8601 date stamp. E.g. 2018-12-31. Default value: current date on account timezone. ',6);

	htmlvisibletag('/tool');
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
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>