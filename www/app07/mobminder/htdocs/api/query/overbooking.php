<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Q U E R Y    V I S I T O R 'S    A P P O I N T M E N T S 
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
// http://localhost/api/query/overbooking.php?id=0&cueIn=2018-04-04+13:30&cueOut=2018-04-04+14:00&bCals=12469&visitors=2387596&workcodes=13905&preb=2&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
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

pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

	$cueIn = @$_REQUEST['cueIn']; if(!isset($cueIn)) $cueIn = false;
	$cueOut = @$_REQUEST['cueOut']; if(!isset($cueOut)) $cueOut = false;
	$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
	
	
	$bCals = @$_REQUEST['bCals']; if(!isset($bCals)) $bCals = false; if($bCals) $bCals = explode('!', $bCals);
		$bcalscount = 0; if(is_array($bCals)) $bcalscount = count($bCals); 
		
	$uCals = @$_REQUEST['uCals']; if(!isset($uCals)) $uCals = false; if($uCals) $uCals = explode('!', $uCals);
		$ucalscount = 0; if(is_array($uCals)) $ucalscount = count($uCals); 
		
	$fCals = @$_REQUEST['fCals']; if(!isset($fCals)) $fCals = false; if($fCals) $fCals = explode('!', $fCals);
		$fcalscount = 0; if(is_array($fCals)) $fcalscount = count($fCals); 
		
	$posted_attendees 		= array(class_bCal => $bCals		, class_uCal => $uCals		, class_fCal => $fCals);
	$count_posted_attendees = array(class_bCal => $bcalscount	, class_uCal => $ucalscount	, class_fCal => $fcalscount);
	$total_posted_attendees = $count_posted_attendees[class_bCal]+$count_posted_attendees[class_uCal]+$count_posted_attendees[class_fCal];	
	
	
	$resources = @$_REQUEST['resources']; if(!isset($resources)) $resources = false; if($resources) $resources = explode('!', $resources);
	
	if($resources) { // resource ids were passed all together in @$_REQUEST['resources']
		
		$total_posted_attendees = count($resources); 
		$attendees = $resources;
		
	}
	else {	// resource ids were passed by type in @$_REQUEST['bCals,uCals,fCals']	
			
		$attendees = array();
			foreach($count_posted_attendees as $class => $att_by_class)
				if($att_by_class) foreach($att_by_class as $rid) $attendees[] = $rid;				
	}

	h3('Checking for mandatory fields');
	
		if(!$cueIn) abort('0500','missing mandatory field: cueIn');
		if(!$cueOut) abort('0501','missing mandatory field: cueOut');
		indent('cueIn: '.$cueIn,6);
		indent('cueOut: '.$cueOut,6);
	
		if($total_posted_attendees == 0) abort('0502','one of bCals, uCals or fCals is mandatory');
		
	
	
	h3('Checking optional fields');
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
		
		
	h3('Screening disallowed fields');

		indent('none',6);
		
		
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
	

		
	
	h3('Fields format/value validation');
	
		$allok = fieldsvalidator($_REQUEST, $context);
		
		// check values of cueIn and cueOut
		//
		$utc_in = $context->timeStampToUTC($cueIn, $utc);
		$utc_out = $context->timeStampToUTC($cueOut, $utc);
		
		if($utc_in == $utc_out) { 
			warning('cue out is equal to cue in, it gets shifted by one slice');
			$oneslice = 3600/($dS_account->timeSlice);
			$utc_out = $utc_in+$oneslice;
		}
		if($utc_out<$utc_in) { 
			warning('cue out is anterior to cue in, we are switching your values');
			$temp = $utc_out; $utc_out = $utc_in; $utc_in = temp;
		}
		$_REQUEST['cueIn'] = $utc_in;
		$_REQUEST['cueOut'] = $utc_out;
		$duration = $utc_out - $utc_in;
		indent('o the timeframe duration is :'.($duration/60).' minutes',6);	
		
		// check if resource ids do match real records
		//
		if($resources) { // resource ids were passed all together in @$_REQUEST['resources']
			foreach($resources as $rid)
				if($rname = $context->isValidResource($rid)) indent('o resource id :'.$rid.' is an existing resource: '.$rname,6);	
				else abort('0510','You must specify valid resource ids. '.$rid.' is unknown');
			
		} else
			foreach($posted_attendees as $class => $cals) { // resource ids were passed by type in @$_REQUEST['bCals,uCals,fCals']
		
				switch($class) { case class_bCal: $caltype = 'bCals'; break; case class_uCal: $caltype = 'uCals'; break; case class_fCal: $caltype = 'fCals'; break;}
				if($cals) {
					indent('resource type: '.$caltype,6);
					$c = count($cals);
					if($c) {
						foreach($cals as $rid) 
							if($rname = $context->isValidResource($rid)) indent('o resource id :'.$rid.' is an existing resource: '.$rname,6);	
							else abort('0511','You must specify valid resource ids. '.$rid.' is unknown');
						foreach($cals as $rid) 
							if($rcl = $context->isValidResourceClass($rid, $class)) indent('o resource id :'.$rid.' has the right resource type: '.$class,6);	
							else abort('0512','The resource type does not match '.$rid.' is unknown in type '.$class);
					}
				}
			}
		
				
		// check miscellaneous fields
		//
		if($allok = fieldsvalidator($_REQUEST, $context)) { pad(0); indent('all fields have valid format and value range',6); }		
		
		
		
		$single = $context->is_single_account;
		$accountId = $context->accountid;
		
$perfReport->peak('::posted parameters retrieved and parsed');
pad();
				




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Q U E R Y
//

		
	$resaIds = C_dbAccess_attendees::hasoverload($accountId, $utc_in, $utc_out, $attendees, $single);
	if($resaIds) warning('overload found with reservation ids:'.$resaIds);
		else indent('no overload for this timeframe and set of resources');
		
$perfReport->peak('::C_dbAccess_attendees::hasoverload');
	
	
	// step 01: fetch reservations where this visitor was invited
	$dbAccess_reservations = new C_dbAccess_reservations();
	if($resaIds) $dbAccess_reservations->loadOnIdsAndView($resaIds, $rescIds = $context->resources->viewIds);
	
$perfReport->peak('::$dbAccess_reservations->loadOnIdsAndView');


	$dbAccess_visitors = new C_dbAccess_visitors();
	$dbAccess_attendees = new C_dbAccess_attendees();
	$dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$dbAccess_performances = new C_dbAccess_performances(); 
		
	// step02: load attendees and visitors
	$dbAccess_attendees->loadOnGroup($resaIds);
	$dbAccess_att_visitors->loadOnGroup($resaIds);
	$dbAccess_visitors->loadOnId($dbAccess_att_visitors->getVisitorsIds());
	$dbAccess_performances->loadOnGroup($resaIds);
	
$perfReport->peak('::reservations attributes loaded');



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.'); pad();
	
echo '<data>';
span('&ltdata&gt');

		$fieldsV = C_api::fieldslist('C_dS_visitor',$context->dS_login->accessLevel);
	echo $dbAccess_visitors->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsV); 
	
		$fieldsAV = Array('groupId','resourceType','resourceId');
	echo $dbAccess_att_visitors->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAV);
	
		$fieldsAR = Array('groupId','resourceType','resourceId');
	echo $dbAccess_attendees->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsAR);
	
		$fieldsP = Array('groupId','workCodeId');
	echo $dbAccess_performances->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsP);
	
		$fieldsR = C_api::fieldslist('C_dS_reservation',$context->dS_login->accessLevel);
	echo $dbAccess_reservations->addmeta_prebooking()->setstringtimeformat($utc)->stream(no_alias, no_bank, no_tracking, $sep = '|', $flds = $fieldsR);

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
			indent('o cueIn: date and time for the start of this time reservation [2019-12-30 14:15] (*1)',6);
			indent('o cueOut: date and time for the start of this time reservation [2019-12-30 14:45] (*1)',6);
			indent('o one of bCals, fCals, uCals or resources must appear in your post',6);
		
		h3('optional posts');
			indent('o resources: id\'s of valid resource, separated by ! (exclam mark). This parameter allows passing resource ids without class specification.',6);
			indent('o bCals: id\'s of valid objects of this resource class, separated by ! (exclam mark)',6);
			indent('o uCals: id\'s of valid objects of this resource class, separated by ! (exclam mark)',6);
			indent('o fCals: id\'s of valid objects of this resource class, separated by ! (exclam mark)',6);
			indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',6);
	
		h3('caution');
			indent('(*1) time indications must stick to the account defined time granularity. If not they are shifted to the closest matching time. If cueOut happens to be anterior to cueIn, the values are gently switched.',6);
			indent('All id\'s are checked for validity (object instance and account property).',6);
	pad();
				 
				 
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