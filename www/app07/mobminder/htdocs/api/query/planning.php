<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Q U E R Y    P L A N N I N G    I T E M S  ( used by Voxiness, Dietplus, h4d)
//

ob_start(); // relates to (*cc)
require '../apilib.php'; // keep ahead of includes, see (*rq01*)


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

$context = new C_apicontext(); // machine login

$from = @$_REQUEST['from']; if(isset($from)) $from = $from; else $from = false;
$days = @$_REQUEST['days']; if(isset($days)) $days = $days; else $days = 1;
$rscids = @$_REQUEST['rscid']; if(!isset($rscids)) $rscids = false;
$rsccrls = @$_REQUEST['rsccrl']; if(!isset($rsccrls)) $rsccrls = false;
$fulldays = @$_REQUEST['fulldays']; if(!isset($fulldays)) $fulldays = false;
$agr = @$_REQUEST['agr']; if(!isset($agr)) $agr = 0; if(!is_numeric($agr)) die('wrong aggregated format'); if($agr<0||$agr>1) die('wrong aggregated value');
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting it as value 1
pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');

$archive_pivot_from = C_dS_system::backupPivotStamp();


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		indent('There is no mandatory fields for this query',6);
		
	
	h3('Checking for optional fields');
	
		if($from) indent('o from: '.$from.'',6);
			else  indent('o from: not specified',6);
	
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
	
		if($days) indent('o days: '.$days.'',6);
			else  indent('o days: not specified',6);
	
		if($rscids) indent('o rscid: '.$rscids.'',6);
			else  indent('o rscid: not specified',6);
	
		if($rsccrls) indent('o rsccrl: '.$rsccrls.'',6);
			else  indent('o rsccrl: not specified',6);
	
		if($agr) indent('o aggregate format: '.$agr.'',6);
			else  indent('o aggregate format defaults to \'split data\'',6);
	
		
	h3('Screening disallowed fields');
	
		indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		// if(!(is_numeric($id)))
			// abort('0602','visitor id must be numeric');
		// if($history!==false) 
			// if(!(is_numeric($history)))
			// abort('0603','history must be numeric');
		 
		
		indent('all fields are made from allowed chars',6);
	
		// if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);

	
	h3('Fields format and value validation');
	
	
		$tz = date_default_timezone_get();
		if($from===false) {
			
			$date = new C_date(); $date->setToMidnight();
			indent('o from: not specified. Defaults to current date ['.$date->getDateSortable().' / '.$tz.']. Defaults to the current date on the account timezone.',6);
			
		} else if(!is_numeric($from)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
			
			$from = $context->isValidDateFormat($from);
			$date = new C_date($from);
			indent('o from: ISO8601 time:['.$date->getDateSortable().' / '.$tz.']',6);
			
		} else { // from was passed as a numeric value ( UNIX timecode expected , referenced to GMT 0)
			
			$date = new C_date($from);
			indent('o from: unix time format:'.$from.' ['.$date->getDateSortable().' / timezone not applicable in UTC]', 6);
		}
		
			
		$fromSearchIn = $date->getTstmp(); // turns back from into a unix timefrom
		
			$todate = clone($date); $todate->dIncrement($days);
		$fromSearchOut = $todate->getTstmp(); // turns back from into a unix timefrom
		
	
	
	
		if($rscids===false&&$rsccrls===false) {
			indent('o resources: You have not specified a filter on resources (all resources are included by default)',6);
			$view = $context->resources->viewIds;
			$scope = $view;
			
			
		} else if($rscids!==false) {
				indent('o filter on resource ids: '.$rscids,6); 
				$scope = str_replace('!',',',$rscids);
				$view = $scope;
					$r = explode(',',$scope);
				foreach($r as $rid) 
					if($rname = $context->isValidResource($rid)) indent('o resource id :'.$rid.' is an existing resource: '.$rname,9);	
					else abort('0605','You must specify valid resource ids. '.$rid.' is unknown');
			}
			else if($rsccrls!==false) { // the remote client passes correlators for resources, that he defined in the machine login on the "synchronization" tab.
				$rscids = $context->rsc_correllators->turnIntoLocalIds($rsccrls);
				$scope = $rscids;
				$view = $scope;
					$r = explode(',',$scope);
				if(count($r)==0)
					abort('0606','You must specify valid correlators. '.$rsccrls.' contains no valid resource reference.');
				
				indent('o filter on resources using correlators: '.$rsccrls.' matching local resources '.$rscids,6);
				foreach($r as $rid) 
					if($rname = $context->isValidResource($rid)) indent('o resource id :'.$rid.' is an existing resource: '.$rname,9);	
					else abort('0607','You must specify valid resource ids. '.$rid.' is unknown');
				
			}
		
		pad(0);
		indent('all fields have valid format and value range',6);
		
		
pad();

//////////////////////////////////////////////////////////////////////
//
//   P R E P A R I N G    D A T A     C O L L E C T I O N  
//

$dbAccess_reservations[0] = new C_dbAccess_reservations();
$dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');

$resaIds = Array(); 
$visiIds = Array(); 
	$dbAccess_sms = Array(); 
	$toggles = Array(); 

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



//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    D A T A 
//
	

// if($fromSearchOut >= $archive_pivot_from)  // note that archived reservations are stored in current table until next sunday
	$dbAccess_reservations[0]->loadOnTimeSpan($context->accountid, $fromSearchIn, $fromSearchOut, plitems_visible_on_frame, $scope, $fulldays);
if($fromSearchIn < $archive_pivot_from)
	$dbAccess_reservations[1]->loadOnTimeSpan($context->accountid, $fromSearchIn, $fromSearchOut, plitems_visible_on_frame, $scope, $fulldays);

$current = $dbAccess_reservations[0]->count();
$archived = $dbAccess_reservations[1]->count();



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
	$perfReport->peak('::loaded from current tables ('.$current.' items)');
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
	$perfReport->peak('::loaded from archive tables ('.$archived.' items)');
	
	
		$dbAccess_visitors[0]->absorb($dbAccess_visitors[1]); 
		$dbAccess_attendees[0]->absorb($dbAccess_attendees[1]);
		$dbAccess_att_visitors[0]->absorb($dbAccess_att_visitors[1]);
		$dbAccess_resaparts[0]->absorb($dbAccess_resaparts[1]);
		$dbAccess_resa_series[0]->absorb($dbAccess_resa_series[1]);
		$dbAccess_performances[0]->absorb($dbAccess_performances[1]);
		$dbAccess_reservations[0]->absorb($dbAccess_reservations[1]);
}


// if some remote correlators are defined for account resources, add them to the dS_attendee
//

$hc = $context->rsc_correllators->hasanyCorrelator(); // "hc stands for has correlators"
if($hc) {
	$context->rsc_correllators->magnify($dbAccess_attendees[0]); // adds a member remoteRscid to each object, according to correlators in the sync login
}

if($agr) { // aggregate pointers into C_dS_reservation->'visitorIds','workcodeIds','resourceIds'
	$dbAccess_reservations[0]->magnify4AI($dbAccess_attendees[0],$dbAccess_att_visitors[0],$dbAccess_performances[0]); // this operation adds 'visitorIds','workcodeIds','resourceIds' each of C_dS_reservation instance.
	$fieldsR = Array('id','cueIn','cueOut','billamount','note','visitorIds','workcodeIds','resourceIds');
	indent('Aggregate mode is ON',6);
	
	if($hc) {
		$context->rsc_correllators->magnifyAggregatedRemoteIds($dbAccess_reservations[0]); // replaces resourceIds by remoteIds
	}
	
} else {
	$fieldsR = C_api::fieldslist('C_dS_reservation', $context->dS_login->accessLevel);
}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');
	
echo '<data>';
span('&ltdata&gt');

		$fieldsV = Array('id','lastname','firstname','birthday','mobile','phone','registration','email','reference','zipCode');
	echo $dbAccess_visitors[0]->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsV); 

	if(!$agr) {  // pass the full split out data model
			$fieldsAV = Array('groupId','resourceType','resourceId');
		echo $dbAccess_att_visitors[0]->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAV);
		
		if($hc)  $fieldsAR = Array('groupId','resourceType','resourceId','remoteRscid');  
			else $fieldsAR = Array('groupId','resourceType','resourceId'); 
		echo $dbAccess_attendees[0]->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAR);
		
			$fieldsP = Array('groupId','workCodeId');
		echo $dbAccess_performances[0]->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsP);
		
			$fieldsS = Array('id','stitle');
		echo $dbAccess_resa_series[0]->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsS);
	}
	
	echo $dbAccess_reservations[0]->addmeta_prebooking()->setstringtimeformat($utc)->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsR);

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
		indent('o There is no mandatory input data for this query',6);
		
		h3('optional posts');
		indent('o from: ISO8601 date stamp. E.g. 2018-12-31. Default value: current date on account timezone. ',6);
		indent('o days: integer number of days to be queried. Default: 1 day.',6);
		indent('o rscid: valid id\'s of resource objects from the target account, separated with a ! (exclam mark). Default: all resources.',6);
		indent('o rsccrl: valid correlators of resource objects from the target account, separated with a ! (exclam mark). Default: all resources.',6);
		indent('note: rscids pre-empt rsccrls.',9);
		indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
	
	h2('Returned objects');

	explainclass($dbAccess_visitors[0]		, $fieldsV, '|');
	if(!$agr) {
		explainclass($dbAccess_att_visitors[0]	, $fieldsAV, '|');
		explainclass($dbAccess_attendees[0]		, $fieldsAR, '|');
		explainclass($dbAccess_performances[0]	, $fieldsP, '|');
		explainclass($dbAccess_resa_series[0]	, $fieldsS, '|');
	}
	explainclass($dbAccess_reservations[0]	, $fieldsR, '|');
	
	
	h2('Feedback payload');
	payload();
	
pad();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>