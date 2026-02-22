<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    A V A L A B I L I T I E S 
//


ob_start(); // relates to (*cc)
require '../aiapilib.php';


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
//
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <file></file>
//





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=true, $perfReport);

$perfReport->peak('::time needed to retrieve context and posted parameters');



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking mandatory fields');
	
	
			// specify which workcode to lookup for
		$workcode 	= @$_REQUEST['workcode']; if(!isset($workcode)) $workcode = false;
		
		$bCals 		= @$_REQUEST['bCals']; if(!isset($bCals)) $bCals = false; $bCals = ($bCals=='-'||$bCals=='') ? Array() : explode('!', $bCals); // like 6312!6995!6733!6311!8758
		$uCals 		= @$_REQUEST['uCals']; if(!isset($uCals)) $uCals = false; $uCals = ($uCals=='-'||$uCals=='') ? Array() : explode('!', $uCals);
		$fCals 		= @$_REQUEST['fCals']; if(!isset($fCals)) $fCals = false; $fCals = ($fCals=='-'||$fCals=='') ? Array() : explode('!', $fCals);
		
		$cb = count($bCals); $cu = count($uCals); $cf = count($fCals);
			
		if($workcode) {
			
			if(!is_numeric($workcode)) abort('0402','You must specify a numeric workcode id');
			wo_indent('You have specified workcode id '.$workcode,6);
			
			if($cb||$cu||$cf) {
				wo_indent('You have specified an additional filter on :',6);
				if($cb) wo_indent('o bCals: '.implode(', ',$bCals),9);
				if($cu) wo_indent('o uCals: '.implode(', ',$uCals),9);
				if($cf) wo_indent('o fCals: '.implode(', ',$fCals),9);
			}
			
			
		} else { // no workcode specify what agenda lines to lookup and for what duration
			
			$staffsize 	= @$_REQUEST['staffsize']; if(!isset($staffsize)) { if(count($uCals)) $staffsize = 1; else $staffsize = false; }
			$duration 	= @$_REQUEST['duration']; if(!isset($duration)) $duration = 1; //  is a number of time slices (see time granularity in the account settings)
			$tboxing 	= @$_REQUEST['tboxing']; if(!isset($tboxing)) $tboxing = false; // like 14580!15870!10999
				if($tboxing) $tboxing = explode('!', $tboxing);
				
			if(!$bCals) abort('0400','You must specify business calendars or a workcode');
			if(!$duration) abort('0401','You must specify a duration');
		}
		

		
	h3('Checking optional fields');
	
		// Optionals
	
		$from = @$_REQUEST['from']; if(!isset($from)) $from = false;
		$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
		
		$notbefore 	= 0; // UTC format
		$tz = date_default_timezone_get();
		
		if($from===false) {
			
			$date = new C_date(); $date->setToMidnight(); // selects today / refers to account timezone setting
			wo_indent('o from: not specified. Defaults to current date ['.$date->getDateSortable().' / '.$tz.']. Defaults to the current date on the account timezone.',6);
			
		} else if(!is_numeric($from)) { // then we expect a date like 'YYYY-MM-DD' e.g. '2014-11-22', introduced with gmtshift (**GMT)
			
			$from = $context->isValidDateFormat($from);
			$date = new C_date($from); // selects today / refers to account timezone setting
			wo_indent('o from: ISO8601 time:['.$date->getDateSortable().' / '.$tz.' / timezone not applicable in UTC]',6);
			
		} else { // from was passed as a numeric value ( UNIX timecode expected , referenced to GMT 0)
			
			$date = new C_date($from);
			wo_indent('o from: UTC unix time format:'.$from.' ['.$date->getDateSortable().']', 6);
		}
		
		$notbefore = $date->getTstmp();
		
		
		if($utc) wo_indent('o utc time format: YES',6);
			else  wo_indent('o utc time format: NO',6);
		
		$ampm 		= @$_REQUEST['ampm']; if(!isset($ampm)) $ampm = false;
		$except 	= @$_REQUEST['exceptional']; if(!isset($except)) $except = false;
		
		$overdays 	= @$_REQUEST['overdays']; if(!isset($overdays)) $overdays = false;
		
		$aggregate 	= @$_REQUEST['aggregate']; if(!isset($aggregate)) $aggregate = false;
		if($aggregate)
			if(!is_numeric($aggregate)) abort('0412','You must specify a numeric aggregate ranging [0, 1, 2, 3]');
		
		$limit 		= @$_REQUEST['limit']; if(!isset($limit)) $limit = 0; // maximum wished number of returned options returned, keep in mind that when a day starts scanning, it goes to the end of the day. limit = 0 means automatic limit.
		
		wo_indent('o limit: '.($limit?$limit:'Automatic'),6);
		if(!is_numeric($limit)) abort('0413','You must specify a numeric limit');
		
		
		$sameday = @$_REQUEST['sameday']; if(!isset($sameday)) $sameday = 0; // when looking in the current day, you don't propose appointments in the coming $sameday hours
		$limitdate 	= @$_REQUEST['limitdate']; if(!isset($limitdate)) $limitdate = 0; // you do not want search results after the given date


		
	
	h3('Screening disallowed characters in fields');
	
	
		if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);

	
	h3('Fields value validation');
		$dS_workcode = false;
		if($workcode) {
			
			if(!$context->workcodes->hasKey($workcode)) abort('0420','You must specify a valid workcode id');
			$context->workcodes->magnify($context->resources, $context->workexperts, $context->worktboxings);
			
			$dS_workcode = $context->workcodes->keyed[$workcode];
			
			$b = $dS_workcode->workexperts[class_bCal]; // is an array like [ 0 => 4565, 1=>4566, 2 ... ]
			if($cb==0) $bCals = $b;  // go with all resources as defined in the workcode
			else {
				// an additional filter applies on the workcode definition
				$o = Array(); foreach($bCals as $x => $rscid) if(in_array($rscid,$b)) $o[] = $rscid;
				$bCals = $o; unset($o);
				if(!count($bCals)) abort('0431','Your filter on bCals does not belong to the workcode defined subset of resources');
			}
			
			$u = $dS_workcode->workexperts[class_uCal]; // is an array like [ 0 => 4565, 1=>4566, 2 ... ]
			if($cu==0) $uCals = $u;  // go with all resources as defined in the workcode
			else {
				// an additional filter applies on the workcode definition
				$o = Array(); foreach($uCals as $x => $rscid) if(in_array($rscid,$u)) $o[] = $rscid;
				$uCals = $o; unset($o);
				if(!count($uCals)) abort('0431','Your filter on uCals does not belong to the workcode defined subset of resources');
			}
			
			$f = $dS_workcode->workexperts[class_fCal]; // is an array like [ 0 => 4565, 1=>4566, 2 ... ]
			if($cf==0) $fCals = $f;  // go with all resources as defined in the workcode
			else {
				// an additional filter applies on the workcode definition
				$o = Array(); foreach($fCals as $x => $rscid) if(in_array($rscid,$f)) $o[] = $rscid;
				$fCals = $o; unset($o);
				if(!count($fCals)) abort('0431','Your filter on fCals does not belong to the workcode defined subset of resources');
			}
			
			$staffsize 	= $dS_workcode->staffing;
			$duration 	= $dS_workcode->duration;
			$tboxing 	= $dS_workcode->worktboxings;
			
			wo_indent('o workcode id '.$workcode.' is valid :'.$dS_workcode->name.'',6);
			
			
		} else { // validate input bCals towards allowed resources in the login view
			
			// $b = $context->resources->keyed; // is an array like [ rid => dS_resource, ... ]
			
			
			
		}
	
	
		if($limit>300) abort('0421','You must specify a numeric limit ranging [1 to 300]');
		wo_indent('o limit: '.($limit?$limit:'Automatic'),6);
	
		if($notbefore) if($notbefore<(time()-86400)) abort('0422','from parameter has an invalid value: You must specify a date in the future');
		wo_indent('o from: '.($from?$from:'undefined, searching availabilities from now onward'),6);
		
		if($aggregate) 
			if($aggregate<0 || $aggregate>3) abort('0423','You must specify aggregate ranging [0, 1]');
		$aggrebose = 'Nope';
		switch($aggregate) { case 1: $aggrebose = 'Early'; break; case 2: $aggrebose = 'Late'; break; case 3: $aggrebose = 'Early and late'; break;}
		wo_indent('o aggregate: '.$aggrebose,6);
	
	
	// convert to framework format
	$duration = $duration * C_date::getSecondsPerSlice();
	
	
	
	h3('Overview of this query parameters');
	
		// Feedback summary of parameters when in Web debug mode
		if($bCals) wo_indent('o bCals: '.implode(', ',$bCals),6);
		if($uCals) wo_indent('o uCals: '.implode(', ',$uCals),6);
		if($fCals) wo_indent('o fCals: '.implode(', ',$fCals),6);
		wo_indent('o duration: '.($duration/60).' min',6);
		wo_indent('o tboxing: '.($tboxing?implode(', ',$tboxing):'none'),6);
		wo_pad();
	

wo_pad();


//////////////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R Y

$lookup = new C_availabilities_lookup($context->dS_account, $bCals, $uCals, $staffsize, $fCals, $ampm, $tboxing, $verbose=false);
$lookup->search($duration, $notbefore, $aggregate, $sameday, $limit, $limitdate, $overdays, $except);



$performances = new C_dbAccess_performances();
if($workcode) { // then we will attach this workcode id to each of C_dS_reservation instances in $lookup->reservations when executing magnify4AI()
	foreach($lookup->reservations->keyed as $resaid => $dS_resa) {
		$dS_performance = $performances->newVirtual();
		$dS_performance->workCodeId = $workcode;
		$dS_performance->groupId = $resaid;
	}
}
$lookup->reservations->setstringtimeformat4AI($utc,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
$availabilities = new C_dbAccess_availabilities($lookup->reservations);
$availabilities->magnify4AI($lookup->attendees,$performances); 

$availacount = $availabilities->count();

$fieldsAV = C_api::fieldslist('C_dS_availability');

//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

wo_pad();
technicalspecH1();

if($web) {	
	h2('Input parameters');
	
		exlainloginputs(); 
		pad();
		
		h3('search using a workcode');
		
			h4('mandatory posts');
			indent('o workcode: a valid workcode unique id ',9);
			pad();
		
		
		h3('search using resources, duration, staffsize and duration');
		
			h4('mandatory posts');
			indent('o bCals: a valid resource unique id, or a string of valid ids like "6312!6995!6733!6311!8758"',9);
			
			
			h4('optional posts');
			indent('o uCals: a valid resource unique id',9);
			indent('o fCals: a valid resource unique id',9);
			indent('o staffsize: a numeric [1 to count(uCals)], defaults to 1',9);
			indent('o duration: a number of time slices (see time granularity in the account settings), defaults to 1',9);
			indent('o tboxing: a valid time boxing unique id or a string of valid ids like "14580!15870!10999", defaults will search considering the resources hourlies',9);
		
		
		h3('optional parameters in both modes');
				$d = new C_date();
			indent('o from: date for the start of this query in time stamp format ['.$d->getDateSortable().'] or zero. Defaults to the current time. Zero starts from current time.',6);
			indent('o limit: Tunes the number of returned availabilities. Range [1 to 300]. Defaults is automatic and depends on the number of resources implied.',6);
			indent('o aggregate: Availabilities returned are subsequent or ahead existing reservations. When the planning is empty, availabilities will stick to the beginning or the end of a hourly period or time box period:',6);
			indent('aggregate = 1 empty planning will be filled using the earliest available time slot',9);
			indent('aggregate = 2 empty planning will be filled using the latest available time slot',9);
			indent('aggregate = 3 empty planning will be filled using the earliest and latest available time slot',9);
			indent('(*1) depending on the definition of time boxes attached to the workcode and of planning hourlies.',9);
			indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',9);
			
			
		h3('caution');
			indent('o Search <font color=red>always completes an entire calendar day</font>. Specifying limit = 1 will hence return all availabilities for the given date.',6);
		
	pad();
	
	h2('Returned objects');
}	
	
	
if($web||$availacount) {
	htmlvisibletag('datamodel');	

		explainclass($availabilities, $fieldsAV, '|');

	htmlvisibletag('/datamodel');	
	
}

$nextsearch = '';
if($availacount) { // define the next date to call on if next availabilities are required
	$lastscanneddaystamp = $availabilities->getlast()->cueIn;
	$datenext = new C_date($lastscanneddaystamp);
	$datenext->dIncrement(1);
	$nextsearch = $datenext->getDateSortable();
}


//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); wo_notice('The following blueprint is the server payload response when not in web mode.'); wo_pad();
	
		$bank = '';	
		
if($availacount) {
	htmlvisibletag('data');
		
		echo $availabilities->stream(false, $bank, with_tracking, $sep = '|', $flds = $fieldsAV);
		
	htmlvisibletag('/data');

	htmlvisibletag('guidelines');
	
		// echo 'Possible scenari:'.$nl;
		// echo '• If you were asked to OPEN the planning, ask now '.$who.' what they want you to do with the available data.'.$nl;
		// echo '• If you were asked to FIND A VISITOR in the planning, ask '.$who.' for the firstname or lastname and look up the provided C_dS_visitor\'s data. If found, report [cueIn, firstname, lastname, workcode, note].'.$nl;
		
			$wk = $workcode ? 'for "'.$dS_workcode->name.'"' : '';
		echo 'Here is an example of how to voicely report the data:'.$nl;
		echo '"When looking up the agenda from '.$date->getSpokenDate().', following schedules are possible '.$wk.' : ';
		echo $availabilities->read4ai($inclusiveCueOut = false, $inclusivedate = true).'" '.$nl; // double quote ends here
		

	htmlvisibletag('/guidelines');	
	
	htmlvisibletag('prompt');
		echo 'Please respect the break times between sets of options, wait for user reaction. Go on reading only on demand.'.$nl;
		echo 'If you are asked for more availabilities further in the calendar, then call this tool again starting with this date as input: '.$nextsearch.'.'.$nl;
		echo 'If the user wants to convert a C_dS_availability into a C_dS_reservation, call our tool save_reservation with the already known [id, cueIn, cueOut, workcodeIds, resourceIds] from the chosen C_dS_availability, in this case, always ask if a visitor must be specified.'.$nl;
		
	htmlvisibletag('/prompt');
	
} else {
	
	htmlvisibletag('info');
			
		echo 'No availability was found matching the input criteria.'.$nl;
			
	htmlvisibletag('/info');
}

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
	$perf = $lookup->dropperfreport();
	pad();
}






endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>