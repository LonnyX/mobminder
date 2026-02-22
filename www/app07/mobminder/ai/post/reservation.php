<?php
//////////////////////////////////////////////////////////////////////////////////////////////
//
//         Moby   A I   A P I   /   P O S T    R E S E R V A T I O N 
//
//
// Use always your login data when calling this file: 
//
// Changing a reservation note:
// 		http://localhost/api/post/reservation.php?id=7959973&note=thenewnote&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
// 
// Changing a reservation schedule:
// 		http://localhost/api/post/reservation.php?id=7959973&cueIn=2018-04-04+10:00&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
// 
// Post a new reservation:
//		http://localhost/api/post/reservation.php?id=0&bCals=10713&cueIn=2019-01-20%2015:00&cueOut=2019-01-20%2016:00&note=coucou&lgn=moby&pwd=moby&kid=16894&web=1
// 		http://localhost/api/post/reservation.php?id=0&cueIn=2018-04-13+10:30&cueOut=2018-04-13+11:00&bCals=12469&visitors=2387596&workcodes=13905&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//      
//
//	 put it on the pre-booking queue:
// 		http://localhost/api/post/reservation.php?id=0&cueIn=2018-04-04+13:30&cueOut=2018-04-04+14:00&bCals=12469&visitors=2387596&workcodes=13905&preb=2&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//
//	Note that %2b stands for the '+' heading international mobile numbers
// 
// Testing: use &web=1 to get html rendering.
//

require '../aiapilib.php';

define('local_test', false); // echoes notifications about the sending of messages (in production: cut by the early connection cut)

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

	$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
	$who = $context->dS_login->firstname; // who is talking to AI
	$view = $context->resources->viewIds; // view is false when all resources are visible to this login, or a comalist when the view is limited
	$accId = $context->accountid;
	$dS_account = $context->dS_account;
	
if(!local_test) ob_start(); // relates to (*ob1)  // local test is for development. To be used in conjunction with &web=1
new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias


$id = @$_REQUEST['id']; if(!isset($id)) $id = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
wo_pad();


		

//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	
	//     R E C E P T I O N    O F    P O S T E D    P A R A M E T E R S 
	//

	if($id===false) abort('5500','You must specify a reservation id');
	else if(!is_numeric($id)) abort('5501','You must specify a numeric integer id');

	$resaId = $id; 
	
	$resa_as_existing = false;
	$archived = false;
	$isanewresa = ($id <= 0); $isexistingresa = !$isanewresa;
	
	
	$cueIn = @$_REQUEST['cueIn']; if(!isset($cueIn)) $cueIn = false;
	$cueOut = @$_REQUEST['cueOut']; if(!isset($cueOut)) $cueOut = false;
	
		$bCals = @$_REQUEST['bCals']; if(!isset($bCals)) $bCals = false; else if($bCals) $bCals = explode(',', $bCals); else $bCals = Array();
			$bcalscount = 0; if(is_array($bCals)) $bcalscount = count($bCals); 
			
		// xCals = false <=> nothing is changed to this set of resources
		// xCals = id!id!id <=> the specified resources will replace the current
		// xCals = '' <=> the current resources (if any) of this set will be cleared
			
		$uCals = @$_REQUEST['uCals']; if(!isset($uCals)) $uCals = false; else if($uCals) $uCals = explode(',', $uCals); else $uCals = Array();
			$ucalscount = 0; if(is_array($uCals)) $ucalscount = count($uCals); 
			
		$fCals = @$_REQUEST['fCals']; if(!isset($fCals)) $fCals = false; else if($fCals) $fCals = explode(',', $fCals); else $fCals = Array();
			$fcalscount = 0; if(is_array($fCals)) $fcalscount = count($fCals);
			
	$posted_attendees 		= array(class_bCal => $bCals		, class_uCal => $uCals		, class_fCal => $fCals);
	$count_posted_attendees = array(class_bCal => $bcalscount	, class_uCal => $ucalscount	, class_fCal => $fcalscount);
	$total_posted_attendees = $count_posted_attendees[class_bCal]+$count_posted_attendees[class_uCal]+$count_posted_attendees[class_fCal];
	
	$visitors_ids = ''; // visitors is an optional parameter, but when intentionaly set to zero, it will remove the visitors from an existing reservation.
	$visitors = @$_REQUEST['visitors']; if(!isset($visitors)) $visitors = false; if($visitors) { $visitors_ids = $visitors; $visitors = explode(',', $visitors); }
		$visicount = 0; if(is_array($visitors)) $visicount = count($visitors);
		
	
	$workcodes = @$_REQUEST['workcodes']; if(!isset($workcodes)) $workcodes = false; if($workcodes) $workcodes = explode(',', $workcodes);
		$wkcount = 0; if(is_array($workcodes)) $wkcount = count($workcodes);  
	
	
		$replan = @$_REQUEST['replan']; if(!isset($replan)) $replan = false;
	if($replan) wo_indent('o replanned reservation id: '.$replan,6);
	
		$confirmed 	= @$_POST['confirmed'];	if(isset($confirmed)) $confirmed = ($confirmed=='0') ? false : true; else $confirmed = false;
	
	
		$recurr = @$_REQUEST['recurr']; if(!isset($recurr)) $recurr = false; if($recurr) $recurr = explode(',', $recurr);
		$stitle = @$_REQUEST['stitle']; if(!isset($stitle)) $stitle = false; 
	
		$expires = @$_REQUEST['preb']; if(!isset($expires)) $expires = false;
		
		$bookingcode = @$_REQUEST['bookingcode']; if(!isset($bookingcode)) $bookingcode = false;
	
		$bank = @$_REQUEST['bank']; if(!isset($bank)) $bank = false;
	
	
		$dropfromprebooking = false;
	
	if($isanewresa) { 
		
		//     N E W     R E S E R V A T I O N    P O S T    S C R E E N I N G
		//
		
		h3('Checking for mandatory fields');
		
			$cueInShortformat = strlen($cueIn) == 10; // 'YYYY-MM-DD'
			$cueOutShortformat = strlen($cueOut) == 10; // 'YYYY-MM-DD'
			if(!$cueIn) abort('5510','missing mandatory field: cueIn');
			if($cueInShortformat) 
				if(!$cueOut) { // cueIn is like 'YYYY-MM-DD' and cueOut is omitted, that is a one day event
					$cueIn .= ' 00:00';
					$din = new C_date($cueIn);
					$dout = $din->dIncrement(1);
					$cueOut = Date('Y-m-d',$dout->t); // build a cueOut that falls on just 24h next to the cueIn, making a correct one day event span between cueIn and cueOut
				} else { // cueOut must also fit into a short format 'YYYY-MM-DD'
					
					if(!$cueOutShortformat) abort('5509','When cueIn is a single date format like "YYYY-MM-DD", then cueOut must also be a short date format.');
					$dout = new C_date($cueOut);
					$dout = $dout->dIncrement(1);
					$cueOut = Date('Y-m-d',$dout->t); // build a cueOut that falls on just 24h next to the cueIn, making a correct one day event span between cueIn and cueOut					
				}
			else 
				if(!$cueOut) abort('5511','missing mandatory field: cueOut'); // if cueIn is not a midnight datetime, then cueOut must be provided
				
			wo_indent('cueIn: '.$cueIn,6);
			wo_indent('cueOut: '.($cueOut?$cueOut:'cueIn is a midnight date'),6);
		
			if($total_posted_attendees == 0) abort('5512','for a new reservation, at least one C_dS_resource id is mandatory. Ask the user which agenda to write in.');
			
			foreach($posted_attendees as $class => $cals) {
				$t = $context->get_rclass_type($class);
				$c = $count_posted_attendees[$class];
				if($c) wo_indent('o '.$t.': '.implode(', ',$cals).' will be attached to the reservation if ids are valid',6);
					else wo_indent('o '.$t.': none (the created reservation will have no '.$t.' attached)',6);
			}
			
		
		h3('Optional fields');

			if($utc) wo_indent('o utc time format: YES',6);
				else  wo_indent('o utc time format: NO',6);
				
			if($visitors===false) wo_indent('o visitors: omited (the created reservation will have no visitor attached)',6);
				else if($visicount==0) wo_indent('o visitors: no visitor will be attached to the reservation',6);
					else wo_indent('o visitors: '.$visitors_ids.' will be attached to the reservation if ids are valid',6);
			
			if($workcodes===false) wo_indent('o workcodes: omited (the created reservation will have no performance attached)',6);
				else if($wkcount==0) wo_indent('o workcodes: the created reservation will have no performance attached',6);
					else wo_indent('o workcodes: '.implode(', ',$workcodes).' will be attached to the reservation if ids are valid',6);
		
			
			if($expires!==false) {
				
				if(!is_numeric($expires)) abort('5513','You must specify a numeric preb parameter');
				if($expires==0) {
					wo_indent('o pre-booking: preb is zero, ignored',9);
					$expires = false;
				}
				
				wo_indent('o expires: '.$expires.'min from reservation deletion',6);
			}
		
			
			if($bookingcode!==false) {
				
				if(!is_numeric($bookingcode)) abort('5514','You must specify an unsigned numeric booking code');
				
				wo_indent('o bookingcode: '.$bookingcode.'',6);
			}
		
			
			if($recurr!==false) {
				if(!isset($stitle)) abort('5515','You must specify a serie title for a new serie');

				$a = 0;
				foreach($recurr as $rcuein) {
					wo_indent('o recurrent reservation: -'.(++$a).'- '.Date('Y-m-d H:i', $context->timeStampToUTC($rcuein, $utc)),9);
				}
			}
			
			
			
			
		} else {   // case of an existing reservation
		
		
			//     E X I S T I N G     R E S E R V A T I O N    P O S T    S C R E E N I N G
			//
			
			// note that omitting parameters on an existing reservation will keep the existing attendees / performances as is
			
			// The following rule applies for visitors, attendees and performances:
			//
			// 		false 	<- was not posted, will not change anything to currently attached attendees/visitors
			// 		[an empty array] 		<- visitors will be removed if any
			// 		[2378596] 				<- a single valid visitor id (you posted '2378596')
			// 		[2378596, 2158941, ...] <- a set of valid visitor ids (you posted '2378596!2158941')
			
			
			h3('Checking for mandatory fields');
			
				$idvalid = $context->isValidReservation($resaId);
				if(!$idvalid) abort('5050','You must specify a valid reservation id');
					
				$resa_as_existing = new C_dS_reservation($resaId); // loads automatically from archive_ if necessary
				if($resa_as_existing->archived) $archived = $resaId;
				
				wo_indent('o reservation id :'.$resaId.' is valid '.($archived?'(archived)':'(live)'),6);
				
				$resa_as_existing->magnify(false /* loads all attendees, also those not in the view */, true /* inclusive workcodes */);
			
			
			
			
			h3('Optional fields');
				
				$total_attendees = 0;
				
				foreach($posted_attendees as $class => $cals) {
					$t = $context->get_rclass_type($class);
					$c = $count_posted_attendees[$class];
					
					if($cals!==false) { // the post contains ids for resources
						$total_attendees += $c;
						if($c) wo_indent('o '.$t.': '.implode(', ',$cals).' will be attached to the reservation if ids are valid',6);
							else wo_indent('o '.$t.': will be removed if any',6);
					}
					else { // ommission for this type of resources, nothing was posted
					
							$cals = $posted_attendees[$class] = $resa_as_existing->attendees[$class]->getKeysList($view); // replace empty post with existing attendees
							$c = $count_posted_attendees[$class] = count($cals);
							$total_attendees += $c;

						if($c) wo_indent('o '.$t.': omited in input parameters, attached resources remain identical for type '.$t.':'.implode(', ',$cals),6);
							else wo_indent('o '.$t.': omited in input parameters, the existing reservation had no such type attached',6);
					}
					unset($cals);
				}
				
				if($total_attendees==0) abort('5054','You have removed all attendees from this reservation. This is not allowed.');
				
			
				if($visitors===false) {
						$vs = $visitors = $resa_as_existing->visitors->getKeysList(); $visitors_ids = implode(', ',$vs);
						$c = $visicount = count($visitors);
						if($c) wo_indent('o visitors: omited in input parameters, attached visitors remain identical:'.$visitors_ids,6);
							else wo_indent('o visitors: omited in input parameters, the existing reservation had no visitors attached',6);
					}
					else if($visicount==0) wo_indent('o visitors: visitors if any will be removed from the existing reservation',6);
						else wo_indent('o visitors: '.implode(', ',$visitors).' will be attached to the reservation if ids are valid',6);
				
			
				if($workcodes===false)  {
						$wks = $workcodes = $resa_as_existing->workcodes->getKeysList();
						$c = $wkcount = count($workcodes);
						if($c) wo_indent('o workcodes: omited in input parameters, attached workcodes remain identical:'.implode(', ',$wks),6);
							else wo_indent('o workcodes: omited in input parameters, the existing reservation had no workcode attached',6);
					}
					else if($wkcount==0) wo_indent('o workcodes: workcodes if any will be removed from the existing reservation',6);
						else wo_indent('o workcodes: '.implode(', ',$workcodes).' will be attached to the reservation if ids are valid',6);
			
				if($bookingcode!==false) {
					
					if(!is_numeric($bookingcode)) abort('5514','You must specify an unsigned numeric booking code');
					wo_indent('o bookingcode: '.$bookingcode.'',6);
					
				}
				if($expires!==false) {
					
					if(!is_numeric($expires)) abort('5513','You must specify a numeric preb parameter');
					
				}
				if(!$expires) { // omitted or zero
				
					$q = new Q('select id from prebooking_delays where reservationId = '.$resaId.';');
					if($q->ids()) {
						warning('o pre-booking: reservation '.$resaId.' was found in the pre-booking delay queue. Discarding pre-booking timer.',6);
						$expires = 0; // force the drop from the queue
						$dropfromprebooking = true; // applies only for existing reservation found in the pre-booking queue
					} else {
						if($expires==0) wo_indent('o pre-booking: preb is zero but this reservation is not in the pending pre-booking queue. Discarding preb.',6);
					}
				}
				else wo_indent('o pre-booking: updating the pre-booking expire timer: '.$expires.'min',6);
				
				if(isset($stitle)) 
					wo_indent('o stitle: update the serie title to '.$stitle.'',6);
		}
		
		
		
	//     V A L U E S     V A L I D A T I O N     P O S T    S C R E E N I N G
	//
		
			
	h3('Screening disallowed fields');

		screenTrackingFieldsOverwrite();
		wo_indent('none',6);
		
		if(isset($_REQUEST['archived'])) {
			warning('archived field is not applicable, discarding your post for archived');
			unset($_REQUEST['archived']);
		}
		
		
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);
	

		
	
	h3('Fields format/value validation');
	
		$allok = fieldsvalidator($_REQUEST, $context);
		
		// check values of cueIn and cueOut
		//
		if($isanewresa&&$cueInShortformat) { // the very simple case of one day event or a serie of off days
			
			$utc_in = $context->timeStampToUTC($cueIn, $utc);
			$utc_out = $context->timeStampToUTC($cueOut, $utc);
			
		} else {
		
			$utc_in = false; $utc_out = false;
			if($cueIn) $utc_in = $context->timeStampToUTC($cueIn, $utc); else $utc_in = $resa_as_existing->cueIn;
			if($cueOut) $utc_out = $context->timeStampToUTC($cueOut, $utc); else $utc_out = $resa_as_existing->cueOut;
			
			if($cueOut && $cueIn) { // than we need to check the coherence
				if($utc_in == $utc_out) { 
					warning('cue out is equal to cue in, it gets shifted by one slice');
					$oneslice = 3600/($dS_account->timeSlice);
					$utc_out = $utc_in+$oneslice;
				}
				if($utc_out<$utc_in) { 
					warning('cue out is anterior to cue in, we are switching your values');
					$temp = $utc_out; $utc_out = $utc_in; $utc_in = temp;
				}
			}  
			else if($cueIn && !$cueOut) { // than we assume the user wants to shift the schedule but do not change the duration
				$duration = $resa_as_existing->cueOut - $resa_as_existing->cueIn;
				$utc_out = $utc_in+$duration;
			}
			else if($cueOut && !$cueIn) { // than we assume the user wants to change the duration but keeps the schedule as is
				$utc_in = $resa_as_existing->cueIn;
				if($utc_out < $utc_in) abort('5051','The new cueOut is anterior to the as is cueIn');
				if($utc_out == $utc_in) {
					warning('cue out is equal to cue in, it gets shifted by one slice');
					$oneslice = 3600/($dS_account->timeSlice);
					$utc_out = $utc_in+$oneslice;
				}
			}
		
		}
		$_REQUEST['cueIn'] = $utc_in; // the reason for this assignment is because we use $_REQUEST to populate new C_dS_reservation($resaId, $accId, $_REQUEST);
		$_REQUEST['cueOut'] = $utc_out;
			
			
		// check if the visitor ids do match real records
		//
		if($visitors) 
			if($visicount) { // we check here that visitor Ids passed belong to the right account and have valid ids
			foreach($visitors as $vid) {
				$q = new Q('select count(1) as c from visitors where groupId = '.$accId.' and id = '.$vid.' and deletorId = 0;');
				if(!$q->c()) abort('5052','You must specify a valid visitor id:'.$vid.' is unknown');
					else wo_indent('o visitor id :'.$vid.' is valid',6);
			}
			wo_pad(0);
		}
		
		// check if resource ids do match real records
		//
		
		foreach($posted_attendees as $class => $cals) {
			switch($class) { case class_bCal: $caltype = 'bCals'; break; case class_uCal: $caltype = 'uCals'; break; case class_fCal: $caltype = 'fCals'; break;}
			if($cals) {
				wo_indent('resource type: '.$caltype,6);
				$c = count($cals);
				if($c) {
					foreach($cals as $rid) 
						if($rname = $context->isValidResource($rid)) wo_indent('o resource id :'.$rid.' is an existing resource: '.$rname,12);	
						else abort('5053','You must specify valid resource ids. '.$rid.' is unknown');
					foreach($cals as $rid) 
						if($rcl = $context->isValidResourceClass($rid, $class)) wo_indent('o resource id :'.$rid.' has the right resource type: '.$class,12);	
						else abort('5054','The resource type does not match '.$rid.' is unknown in type '.$class);
				}
			}
		}
		
		// pre-booking and expiration timer
		//
		if($expires) {
			if($expires>30) abort('5555','You must specify a preb integer ranging [0,2-30]');
		} 
		
		// check if replan id is a valid reservation
		//
		if($replan)
			if($replan==$resaId) abort('5060','the replanned reservation must be different from the newly planned reservation');
				else if($context->isValidReservation($replan)) wo_indent('o reservation id :'.$id.' is valid',6);
					else abort('5061','You must specify a valid replan reservation id');

				
		// check miscellaneous fields
		//
		if($allok = fieldsvalidator($_REQUEST, $context)) { wo_pad(0); wo_indent('all fields have valid format and value range',6); }		
		
		
		
	
$perfReport->peak('::posted parameters retrieved and parsed');
wo_pad();




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// retrieve or make new reservation
//


if($archived) {
	
    // When the reservation as it was is found in the archived table: 
	//
	// => reservation is removed from archived tables, and re-recorded in the current tables, see (*21*)
    // => plitems queries are tuned to read also from current tables, even for older dates queries.
    // => next weekly cron will put this older reservation back to its place in archive tables. 
    // => the new record will get the id of the archived record, see (*23*)
    // => we copy the original creation date to the new dS_reservation, see (*22*)
    //
    $dS_reservation = new C_dS_reservation(0, $accId, $_REQUEST); // archived resa
    $dS_reservation->created = $resa_as_existing->created; // see (*22*)
    $dS_reservation->creator = $resa_as_existing->creator;
    $dS_reservation->creatorId = $resa_as_existing->creatorId;
	$dS_reservation->rversion = $resa_as_existing->rversion+1; // retrieve also the version
	
} else
    $dS_reservation = new C_dS_reservation($resaId, $accId, $_REQUEST); // resa from current table or archive table, see (*ar01)


$perfReport->peak('::Reservation');





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Prepare reservation attributes
//

$dbAccess_visitors 	= new C_dbAccess_visitors($visitors_ids);
$att_visitors 		= new C_dbAccess_att_visitors();
$attendees 			= new C_dbAccess_attendees();
$resaparts 			= new C_dbAccess_resaparts();
$performances 		= new C_dbAccess_performances();


foreach($posted_attendees as $class => $att_by_class)
    if($att_by_class)
        foreach($att_by_class as $id) {
            $dS_attendee = $attendees->newVirtual();
            $dS_attendee->resourceId = $id;
            $dS_attendee->resourceType = $class;
        }
		
if($isexistingresa) // PVH-2020-11 fix limited view resa post problem
	if($context->is_limited_view) { // add attendees that are out of view scope (complete the set with resources that are out of login's view, so they receive the expected treatment)
		
		h3('Fix limited view case');
			$as_is_attendees = new C_dbAccess_attendees($archived ? 'archive_' : '');
		$as_is_resources = $as_is_attendees->loadOnGroup($resaId)->cutToView($context->rscids_view, $invert=true)->getResourceIdsList(list_as_array);
		wo_indent('Out of view attendees: '.implode(',',$as_is_resources),6); // should restore resources eventually out of view scope BUT NOT the ones in the view scope
		$to_be_resources = $attendees->getResourceIdsList(list_as_array);
		wo_indent('Posted in view attendees: '.implode(',',$to_be_resources),6); // list of resources as passed through the POST, view limited players can only mange and post in view scope resources 
		
		$account_resources = new C_dbAccess_resources($context->accountid);
		foreach($as_is_resources as $rscid => $v)
			if(!array_key_exists($rscid,$to_be_resources)) {
				$dS_attendee = $attendees->newVirtual();
				$dS_attendee->resourceId = $rscid;
				$dS_attendee->resourceType = $account_resources->keyed[$rscid]->resourceType;
				wo_indent('- adding rscid : '.$rscid,9);
			}	
		wo_indent('Final attendees set: '.$attendees->getResourceIdsList(),6); // list of resources as passed through the POST, view limited players can only mange and post in view scope resources 
		wo_pad();
	}


// attendee visitors objects	
if($visitors)
    foreach($visitors as $vid) {
		
        // add the visitor reference
        $dS_attendee = $att_visitors->newVirtual();
        $dS_attendee->resourceId = $vid;
        $dS_attendee->resourceType = class_visitor;
    }

$perfReport->peak('::Attendees prepared');	



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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	
// Check for overloads before saving anything in DB   ( !!  script might DIE in this section  !! )
//
if(!$confirmed && !$archived && $isanewresa) { // this version of the if() will not give any warning if the reservation was already in place
// if(!$confirmed && !$archived) { // this version of the if() is fine for testing because you can re-save many times the same resa and it shows each time the warning

    // This check has two purposes
    // - in case of concurrent planning management, we want to show that so else has just created or modified a reservation that conflicts with this saving
    // - when a user overloads some resources on the planning (let's say mutliple resource type planning), he should be warned 
    //
    $i = $dS_reservation->cueIn; 
    $o = $dS_reservation->cueOut;
    $x = $dS_reservation->id; $excludethis = ''; if($x>0) $excludethis = 'AND reservations.id <> '.$x;
    $r = $attendees->getResourceIdsList();
    $SQL = 'SELECT reservations.id AS id FROM reservations 
			JOIN attendees ON attendees.groupId = reservations.id
			WHERE ( reservations.groupId = '.$context->accountid.' AND '.$i.' < cueOut AND '.$o.' > cueIn) 
				'.$excludethis.' AND reservations.deletorId = 0	AND resourceId IN ('.$r.');';

	// echo $SQL.$nl;
	$targetTable = ''; // the other alternative is 'archive_', but we check only current tables here
	$dbAccess_reservations 	= new C_dbAccess_reservations($targetTable, $SQL);
	$howmany = $dbAccess_reservations->count();
	
    if($howmany) { // report some info about what reservations we are overbooking by the execution of this script

		$resaIds = $dbAccess_reservations->getIdsList(); 
		$date = new C_date();

		$dbAccess_attendees 	= new C_dbAccess_attendees(		$targetTable, $resaIds);
		$dbAccess_att_visitors 	= new C_dbAccess_att_visitors(	$targetTable, $resaIds);
		// $dbAccess_resaparts 	= new C_dbAccess_resaparts($targetTable);
		// $dbAccess_resa_series = new C_dbAccess_resa_series($targetTable);
		$dbAccess_visitors 		= new C_dbAccess_visitors(		$dbAccess_att_visitors->getVisitorsIds());
		$dbAccess_performances 	= new C_dbAccess_performances(	$targetTable, $resaIds);

		$perfReport->peak('::overbooking - time needed to setup time parameters and containers');
	
		$dbAccess_reservations->setstringtimeformat4AI($utc,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
		$dbAccess_reservations->magnify4AI($dbAccess_attendees,$dbAccess_att_visitors,$dbAccess_performances);

		$dbAccess_visitors->setAIformats($context->dS_account); // sets the phone numbers format to a readable set of subset of digits

		htmlvisibletag('warning');
		
			echo 'A total of '.$howmany.' existing reservation'.($howmany?'s':'').' will be covered if this reservation is saved.'.$nl;
			
		htmlvisibletag('/warning');	
		
		
		htmlvisibletag('data');

			if($jason) echo $dbAccess_visitors->jason4AI(no_tracking, $fieldsV);
			else echo $dbAccess_visitors->stream(no_alias, no_bank, no_tracking, '|', $fieldsV);
			
			if($jason) echo $dbAccess_reservations->jason4AI(no_tracking, $fieldsR);
			else echo $dbAccess_reservations->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);

		htmlvisibletag('/data');
		
		
		htmlvisibletag('guidelines');
			
			echo 'Here is an example of how to voicely report this warning to '.$who.': "';
			echo 'The following reservation'.($howmany?'s':'').' are already existing at the same moment: ';
			echo $dbAccess_reservations->read4ai($dbAccess_visitors).'" '.$nl;
			
		htmlvisibletag('/guidelines');
		
		
		htmlvisibletag('prompt');
			
			echo 'Please ask '.$who.' if he confirms the recording of this reservation. If he confirms, call this tool again with exact same input but adding parameter confirmed = 1 to the call.'.$nl;
			
		htmlvisibletag('/prompt');


		die();
    }

}

$perfReport->peak('::Overload check');	


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Delete older attributes
//
$formerly_existing_attendees = false;
$formerly_existing_visitors = false;
$timing_changed = false;

if($isexistingresa) {

	// To delete event in Cronofy, we keep a copy of formerly existing attendees
    $formerly_existing_attendees = new C_dbAccess_attendees($archived ? 'archive_' : '');
	$formerly_existing_attendees->loadOnGroup($resaId); // loads only attendees that can be managed by this login, according to his view
	
    $formerly_existing_visitors = new C_dbAccess_att_visitors($archived ? 'archive_' : '');
	$formerly_existing_visitors->loadOnGroup($resaId); // loads only attendees that can be managed by this login, according to his view
	
	// timing change : we send communications and notifications only when schedule or visitors have changed
	
		$sched_change = $resa_as_existing->cueIn <> $dS_reservation->cueIn;
		$visi_change = $formerly_existing_visitors->visitors_compare($att_visitors);
	$timing_changed = !($sched_change || $visi_change);
	
	
	$resa_as_existing->dropAttributes(); // workcodes and attendees may have changed, we clean those in the login view
}




$perfReport->peak('::Removed attributes');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Save reservation
//

$dS_reservation->deleted = '0000-00-00 00:00:00'; // when saving a deleted reservation, you restore it
$dS_reservation->deletorId = 0;
$dS_reservation->rescheduled = 0;
$dS_reservation->archived = 0; // if not reset, the data set goes back to archive tables (which is not what we want, see (*21*))

if($dropfromprebooking) {
    $dS_reservation->rversion = 1;
	$dS_reservation->dSsaveAsNew();
}
else
	$dS_reservation->dSsave(); // records change tracking

if($archived) {
    $resa_as_existing->dSdelete(); // this is a real record removal from archive table, not a delete tag like you get when using dSobsolete()
    new Q('update reservations set id = '.$archived.' where id = '.$dS_reservation->id.';'); // see (*23*), the reservation as moved to the current reservations table but keeps the same id
    $dS_reservation->id = $resaId = $archived;
}
$resaId = $dS_reservation->id; // now resaId is the id of the final reservation (if it was archived or virtual)


$attendees->saveAll($resaId); // group attendees by reservation id
$att_visitors->saveAll($resaId); 


$perfReport->peak('::Saving reservation');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Performances
//


if($workcodes) foreach($workcodes as $wkid) {

    $q = new Q('select id from workcodes where id = '.$wkid.';'); if(!$q->ids()) continue; // the workcode has been deleted from the account config by another user.

    if($visitors) { // one performance for each visitor
        foreach($visitors as $visitorId) {
            $dS_performance = $performances->newVirtual();
            $dS_performance->workCodeId = $wkid;
            $dS_performance->visitorId = $visitorId;
        }
    } else { // a single performance (this is not an appointment but a time reservation)
        $dS_performance = $performances->newVirtual();
        $dS_performance->workCodeId = $wkid;
        $dS_performance->visitorId = 0;
    }
}
$performances->saveAll($resaId); // group performances by reservation id
$perfReport->peak('::Workcodes');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Treat replan
//
if($replan) { // mark the replanned reservation as rescheduled

    $dS_replaced = new C_dS_reservation($replan); // if archived, it loads from the archive table
    $dS_replaced->rescheduled = $resaId;
    $dS_replaced->dSobsolete();
    $perfReport->peak('::Replacing another resa');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Communication toggle options
//
if(1) {

    $toggles = new C_dbAccess_cToggles();

    $sms = @$_REQUEST['sms']; if(isset($sms)) $sms = ($sms=='-') ? false : explode('!', $sms); else $sms = false;
    $mails = @$_REQUEST['mails']; if(isset($mails)) $mails = ($mails=='-') ? false : explode('!', $mails); else $sms = false;

	$toggles->setbundels($accId, $resaId, $sms, $mails); // this bundle was made here (*bu1*)

    $perfReport->peak('::Communication switches (on/off)');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Recurrence - create a new serie of reservations
//
$rec_resas = new C_dbAccess_reservations();
$dS_serie = false;
$rec_resas->add($dS_reservation);
if($isanewresa)	
	if($recurr)		
		if(count($recurr)>1) {

			$dS_serie = new C_dS_resa_serie(0, $accId, $_REQUEST); // will only extract stitle from the post/get
			$dS_serie->dSsave();
			$serieId = $dS_serie->id;

			$rec_att_visitors 	= clone $att_visitors; // see (*dk01*), clones each item from the incoming list, but DO NOT EXECUTE CONSTRUCTORS >> So those copied objects are not ready for a prepared() SQL statement
			$rec_attendees 		= clone $attendees;
			$rec_performances 	= clone $performances;
			$rec_toggles 		= clone $toggles;	

			$duration = $dS_reservation->cueOut - $dS_reservation->cueIn;
			$skipfirst = 0; $dS_prev = $dS_reservation;
			$dS_prev->serieId = $serieId;
			foreach($recurr as $cueIn) {

				$cueIn = $context->timeStampToUTC($cueIn, $utc); // utc is an optional time format, received as parameter. Default = false
				$d = new C_date($cueIn);
				echo $skipfirst.': recurring appointment on '.$d->getDateTimeString().$nl;

				if(!$skipfirst++) continue;

				// snext and sprev are reservation ids, they make a linked list so to identify a serie of reservations

				$dS_resa = $rec_resas->newVirtual($dS_reservation); // clones that reservation each time
				$dS_resa->serieId = $serieId;
				$dS_resa->snext = 0; // erases the result of this (*33*) during the first iteration of this loop
				$dS_resa->cueIn = $cueIn; $dS_resa->cueOut = $cueIn+$duration;
				$dS_resa->sprev = $dS_prev->id;
				$rid = $rec_resas->save($dS_resa->id);
				$dS_prev->snext = $rid; $dS_prev->save(); // (*33*) is recorded inside the reference $dS_reservation at first body execution
				unset($dS_prev); $dS_prev = $dS_resa;

				// duplicate attributes
				$att_visitors->absorbAsNew($rec_att_visitors, $rid);
				$attendees->absorbAsNew($rec_attendees, $rid);
				$performances->absorbAsNew($rec_performances, $rid);
				if($rec_toggles->count()) foreach($rec_toggles->keyed as $tid => $dS_toggle) $dS_toggle->reservationId = $rid;
				$toggles->absorbAsNew($rec_toggles, $accId);
			}	
			$att_visitors->saveAll();
			$attendees->saveAll();
			$performances->saveAll();
			$toggles->saveAll();

			echo $nl;

			$perfReport->peak('::Recurrent reservations');
		}

if(!$isanewresa) if($dS_reservation->serieId) { // update existing serie

    $dS_serie = new C_dS_resa_serie($dS_reservation->serieId, $accId, $_POST); // will only update stitle from the post
    $dS_serie->dSsave(); 
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Pre-booking timer function. 
//
// 	When the number of minutes is over, if the pre-booking is not cancelled, the reservation is deleted
//	If the reservation exists, the timer might be updated

if($expires!==false) { // only if expires was posted
	if($rec_resas->count())
		foreach($rec_resas->keyed as $rid => $dS_resa)
			C_dS_prebooking::queue($dS_resa, $expires); // a number of minutes. After this delay, the reservation is deleted by the minute.php cron
}


if(!$isanewresa)
{
	$dbAccess_payments= new C_dbAccess_payments(); 
	$dbAccess_payments->loadOnGroup($resaId);
}



$rec_resas->setstringtimeformat4AI($utc,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
$rec_resas->magnify4AI($attendees,$att_visitors,$performances);

$resacount = $rec_resas->count();


//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

wo_pad();
	
if($web) {
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('new reservation');
		
			h4('mandatory posts');
			
				indent('o id: zero or negative, this forces the creation of a new reservation',9);
				indent('o cueIn: date and time for the start of this time reservation [2019-12-30 14:15] (*1)',9);
				indent('o cueOut: date and time for the start of this time reservation [2019-12-30 14:45] (*1)',9);
				indent('o bCals: id\'s of valid objects of this resource class, separated by ! (exclam mark) (*2)',9);
			
			h4('optional posts');
			
				indent('o uCals: id\'s of valid objects of this resource class, separated by ! (exclam mark)',9);
				indent('o fCals: id\'s of valid objects of this resource class, separated by ! (exclam mark)',9);
				indent('o visitors: id\'s of valid visitor objects, separated by ! (exclam mark)',9);
				indent('o workcodes: id\'s of valid workcode objects, separated by ! (exclam mark) (*3)',9);
				indent('o note: alpha num text',9);
				indent('o cssColor: id of a valid object of this class',9);
				indent('o cssPattern: id of a valid object of this class',9);
				indent('o cssTags: id\'s of valid objects of this class, separated by ! (exclam mark)',9);
				indent('o preb: an integer number of minutes. when the time is over, the reservation is canceled. Range [1-30]',9);
				indent('o utc: the cueIn and cueOut time is provided as Unix Time Code',9);
				
			h4('caution');
				 indent('(*1) time indications must stick to the account defined time granularity. If not they are shifted to the closest matching time. If cueOut happens to be anterior to cueIn, the values are gently switched.',9);
				 indent('(*2) one of bCals, fCals, or uCals must appear in your post.',9);
				 indent('(*3) Note that the duration of the reservation is independant of the duration specified in the workcode(s). Specifying cueIn and cueOut stays mandatory.',9);
				 indent('All id\'s are checked for validity (object instance and account property).',9);
				 indent('Disallowed characters are gently removed from posted values (&lt, &gt, ").',9);
				 indent('The complete post is scanned for SQL injection. Combinations of words like "delete * from" are suspicious and rejected.',9);
				 
				 
		
		h3('existing reservation');
		
			h4('mandatory posts');
			
				indent('o id: positive, must match an existing reservation',9);
			
			h4('optional posts');
			
				indent('o cueIn: date and time for the start of this time reservation [2019-12-30 14:15]. If cueIn is passed and cueOut omitted, the reservation is moved but its duration is unchanged',9);
				indent('o cueOut: date and time for the start of this time reservation [2019-12-30 14:45]. If cueOut is passed and cueIn omitted, the reservation duration is adapted.',9);
				indent('o bCals: if omitted, the attached resources remain like existing. If the parameter is passed empty, those resources are removed from the reservation if any were attached.',9);
				indent('o uCals: if omitted, the attached resources remain like existing. If the parameter is passed empty, those resources are removed from the reservation if any were attached.',9);
				indent('o fCals: if omitted, the attached resources remain like existing. If the parameter is passed empty, those resources are removed from the reservation if any were attached.',9);
				indent('o visitors: if omitted, the attached visitors remain like existing. If the parameter is passed empty, visitors are removed from the reservation if any were attached.',9);
				indent('o workcodes: if omitted, the attached workcodes remain like existing. If the parameter is passed empty, workcodes are removed from the reservation if any were attached.',9);
				indent('o note: alpha num text',9);
				indent('o cssColor: id of a valid object of this class',9);
				indent('o cssPattern: id of a valid object of this class',9);
				indent('o cssTags: id\'s of valid objects of this class, separated by ! (exclam mark)',9);
				indent('o preb: any re-posted reservation is discarded from the prebooking queue even if preb is omitted. Communication is sent as if the reservation was new.',9);
		
		
}
h2('Returned objects');




	if($web||$resacount) {
		if($web) h2('Returned objects');
		htmlvisibletag('datamodel');

		h3('Visitors'); wo_pad();
			explainclass($dbAccess_visitors, $fieldsV, '|');

		h3('Reservations'); wo_pad();
			explainclass($rec_resas, $fieldsR, '|');
			
		htmlvisibletag('/datamodel');
		wo_pad();
	}


//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); wo_notice('The following blueprint is the server payload response when not in web mode.');

if($resacount) {
	htmlvisibletag('data');

		if($jason) echo $dbAccess_visitors->jason4AI(no_tracking, $fieldsV);
		else echo $dbAccess_visitors->stream(no_alias, no_bank, no_tracking, '|', $fieldsV);
		
		if($jason) echo $rec_resas->jason4AI(no_tracking, $fieldsR);
		else echo $rec_resas->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);

	htmlvisibletag('/data');
	
	htmlvisibletag('info');
		if($isanewresa) echo 'The new reservation has been saved with the provided parameters.'.$nl;
		else echo 'The existing reservation has been updated with the provided parameters.'.$nl;
		
	htmlvisibletag('/info');

}
else {
	htmlvisibletag('info');
		
	echo 'No reservation was saved.'.$nl;
		
	htmlvisibletag('/info');
}
	


if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}


//////////////////////////////////////////////////////////////////////////////////////////
//
// Echo to client side and close connexion (but keep this script running)
//


if(!local_test) { // disabled when testing, so the next section can echo on the screen

	pad();
	endrendermode();
	closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
	echo 'you will never see this message at client side.';
}

C_dS_connection::poke($perfReport, 'p_resa');


// define('crontest', $web); // this prevents the comm layer to really send communication to the SMS provider



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Now takes place the processing we want to happen AFTER feedback has been delivered to the client side
//




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// notifications by SMS or emails
//

$abortnotifications = false; 

if($count_posted_attendees[class_bCal]+$count_posted_attendees[class_uCal] == 0) $abortnotifications = 'fcals only in attendees'; // In this case the reservation is only on facultative resource. 
if(!$dS_account->sendSMSs&&!local_test) $abortnotifications = 'this account has a disabled communication switch';
// if($timing_changed) $abortnotifications = 'The reservation schedule nor recepients have changed';


if($expires!==false) { // only if expires was posted
	if($expires>0) { // then do not send any communication
		$abortnotifications = 'this reservation is on the expire list';
	}
}


if($abortnotifications) warning('No notification will be sent: '.$abortnotifications);
else 
	sendEventMessages($context->dS_login, $dS_account, $resaId, action_create+action_change, $timing_changed = false, $testmode = local_test);



//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
// updated by bspoden
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if(!$expires) 
{
	require '../../../lib_cronofy/cronofymanager.php';
    $dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accId);
	$dS_resa = new C_dS_reservation($resaId);
	
	// if change, delete old event (because, attendee are deleted then created)
    if($formerly_existing_attendees) 
        $dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$formerly_existing_attendees);
	
	//reset remote id and profile, if eventuid existed in past, it has been deleted!
	if($dS_resa->remoteProfile!=0)
	{
		//force remoteid with '1' to know that event was an external event
		$dS_resa->remoteid = '1';
		$dS_resa->remoteProfile = 0;
		$dS_resa = $dS_resa->dSsave();
	}
   
    // create all, only eventid and no eventuid because eventuid has been reset in reservation
	// view is false when all resources are visible to this login, or a comalist when the view is limited
    $dS_cronofy_manager_reservation->UpsertForAttendees($dS_resa,null /*excludeCalendarId*/);
}
//bsp-end



pad();
endrendermode();

?>