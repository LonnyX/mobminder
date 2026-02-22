<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   C H E C K    P L A N N I N G    I T E M S
//
//                Returns a checksum unsigned int(64) value
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);

$perfReport->peak('::api context set up');

$from = @$_REQUEST['from']; if(isset($from)) $from = $from; else $from = false;
$days = @$_REQUEST['days']; if(isset($days)) $days = $days; else $days = false;
$rscids = @$_REQUEST['rscid']; if(!isset($rscids)) $rscids = false;
$fulldays = @$_REQUEST['fulldays']; if(!isset($fulldays)) $fulldays = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting it as value 1
pad();

$perfReport->peak('::retrieved posted parameters');

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
	
		if($fulldays) indent('o fulldays: YES',6);
			else  indent('o fulldays: NO',6);
	
		
	h3('Screening disallowed fields');
	
		indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		
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
		$timescope = plitems_all_after;
		$fromSearchOut = false;
		
		if($days){ 
			$timescope = plitems_visible_on_frame;
			$todate = clone($date); 
			$todate->dIncrement($days);
			$fromSearchOut = $todate->getTstmp(); // turns back from into a unix timefrom
		} 
		
	
	
	
		if($rscids===false) {
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
		
		pad(0);
		indent('all fields have valid format and value range',6);
		
$perfReport->peak('::time needed to validate parameters');
pad();

//////////////////////////////////////////////////////////////////////
//
//   P R E P A R I N G    D A T A     C O L L E C T I O N  
//

$dbAccess_reservations[0] = new C_dbAccess_reservations();
$dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');

$resaIds = Array(); 
$visiIds = Array(); 
 
$perfReport->peak('::time needed to setup time parameters and containers');


//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    C H E C K S U M      V A L U E
//
	
$checksum = 0;

// if($fromSearchOut >= $archive_pivot_from) // note that archived reservations are stored in current table until next sunday

	$checksum += $dbAccess_reservations[0]->planningChecksum($context->accountid, $fromSearchIn, $fromSearchOut, $timescope, $scope, $fulldays);
	
$perfReport->peak('::checksum from current table reservations ($checksum = '.$checksum.')');

if($fromSearchIn < $archive_pivot_from)
	$checksum  += $dbAccess_reservations[1]->planningChecksum($context->accountid, $fromSearchIn, $fromSearchOut, $timescope, $scope, $fulldays);

$perfReport->peak('::checksum from archived table reservations ($checksum = '.$checksum.')');





//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');
	
echo '<data>';
if($web) span('&ltdata&gt');

	echo $checksum;

if($web) span('&lt/data&gt');
echo '</data>';	

echo $nl.$nl;

echo '<pars>'; // enclose the file content within the stream
span('&ltpars&gt');

	echo 'plilag=300'.$nl; 								// rythm for calling this script
	echo 'cfvr='.$context->dS_account->cfgversion.$nl; 	// account config version, see (*cv01*)
	echo 'apvr=1.0.5'.$nl; 								// AppStore and PlayStore version number
	
span('&lt/pars&gt');
echo '</pars>';


//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}




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
		indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
	
	h2('Returned value');

		indent('When calling on a timeframe check (from+days) the returned value corresponds to the result of this DB query: (days=10)',6);
		indent('<font color=red>select sum(reservations.id * reservations.rversion) as c from reservations where reservations.groupId = 3925 and cueOut > 2020-01-15 and cueIn < 2020-01-25;</font>',6);
		
		indent('&nbsp;',6);
		indent('When calling on a timeframe with righter open end (from) the returned value corresponds to the result of this DB query:',6);
		indent('<font color=red>select sum(reservations.id * reservations.rversion) as c from reservations where reservations.groupId = 3925 and cueIn > 2020-01-15;</font>',6);
		
		indent('&nbsp;',6);
		indent('When calling with filter on resource(s) the returned value corresponds to the result of this DB query:',6);
		indent('<font color=red>select sum(reservations.id * reservations.rversion) as c from reservations join attendees on attendees.groupId = reservations.id where reservations.groupId = 3925 and cueIn > 2020-01-15 and resourceId in (11689,12773);</font>',6);
		
		indent('&nbsp;',6);
		indent('When you called _planning, you got the reservation id and the reservation version, so you are remotely able to calculate the equivalent checksum.',6);
		indent('If your checksum does not match the server checksum, then your cache needs a refresh for the given timeframe.',6);
		
	h2('Notes');
		indent('Newly created reservations start with rversion = 1',6);
		indent('Deleted reservations are included in the checksum',6);
		indent('Be cautious about reservations spreading over days, they are included in the checksum',6);
		
	
pad(5);
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>