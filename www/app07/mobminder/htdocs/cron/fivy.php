#!/usr/bin/php5 -q
<?php

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('faketime', '2023-06-27 15:35:00'); // watch the line where sendOver() is called !!

$faketime = false;
if(crontest)	// when testing, we MUST use the defined faketime constant
	$faketime = faketime;

if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
	$faketime = $_GET['fkt'];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
// - H-x reminders management
//
//

$systemLog = 'fivies cron';
if(crontest) { // when running it locally
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/mblox.php';
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
}
else {  // when running in production
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/mblox.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}

////////////////////////////////////

$o_dataLink_scriptExecutionStartTime = new C_date();

$o_date = new C_date($faketime);

	$refTime = clone($o_date); $refTime->dropSeconds(); 

$dS_system = new C_dS_system();
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(crontest) {
	$tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	$br = '<br/>';
	echo '<br/>';
	echo $tab.'EXECUTING IN TEST MODE<br/>';
	echo 'SIMULATED TIME:'.$o_date->getDateTimeString().'<br/>';
	echo 'REFERENCE TIME:'.$refTime->getTimeString().'<br/>';
	echo '<br/>';
	echo $tab.'<br/><b>THE SYSTEM IS SET TO SEND COMMUNICATION: '.($dS_system->sendComm?'>> Y E S <<':'>> NO <<').'</b><br/>'; // this cron has run already for this timing
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$q = new Q('select id from templates_sms where triggerId = '.notification_HminusX.';');
$smsTmplIds = $q->ids();

$q = new Q('select id from templates_email where triggerId = '.notification_HminusX.';');
$emailTmplIds = $q->ids();

$q = new Q('select id from templates_notif where triggerId = '.notification_HminusX.';'); //BSP
$notifTmplIds = $q->ids(); //BSP


$dS_templatesSMS = new C_dbAccess_smsTemplates(); $dS_templatesSMS->loadOnId($smsTmplIds);
$dS_templatesEMAILs = new C_dbAccess_emailTemplates(); $dS_templatesEMAILs->loadOnId($emailTmplIds);
$dS_templatesNOTIFS = new C_dbAccess_notifTemplates(); $dS_templatesNOTIFS->loadOnId($notifTmplIds); //BSP

$dS_templates = new C_dbAccess_smsTemplates();
$dS_templates->absorb($dS_templatesSMS);
$dS_templates->absorb($dS_templatesEMAILs);
$dS_templates->absorb($dS_templatesNOTIFS); //BSP

if($dS_templates->count()) // if any notification
	foreach($dS_templates->keyed as $templateId => $dS_template) { // for each template
		
		
		// STEP 3.0: check that the group is allowed sending SMS or email accordingly
		$dS_account = new C_dS_group($dS_template->groupId);
		$accountId = $dS_account->id;
		if(crontest)
			echo '<h3 style="color:green">'.$tab.$tab.'REMINDER: id '.$dS_template->id.$tab.$dS_template->deliveryTime.$tab.$dS_account->name.$tab.' Reminder name:'.$dS_template->name.'</h3>';
		if(!$dS_account->sendSMSs) {
				if(crontest) { echo $tab.$tab.'<b>This account has communication disabled... skipping</b>'; }
				continue;
			}
		$dbAccess_resources = new C_dbAccess_resources($accountId);

		
		// STEP 3.1: check template filters
		$filterOnActions = false;
		$filterOnLogins = false;
		$filterOnResources = false;
		if($dS_template->filterOnActions) $filterOnActions = $dS_template->actions;
		if($dS_template->filterOnLogins) if($dS_template->logins) $filterOnLogins = implode(explode('!',$dS_template->logins),',');
		if($dS_template->filterOnResources) if($dS_template->resources) $filterOnResources = implode(explode('!',$dS_template->resources),',');
	
	
		// STEP 2: define the reservations search scope
		$targetCueIn = clone($refTime); $targetCueIn->sIncrement($dS_template->advance*60);
		$stampSearchIn = $targetCueIn->getTstmp();
		$stampSearchOut = $stampSearchIn+1;
		if(crontest) echo '<h1 style="color:red">Advance: '.$dS_template->advance.' so for reservations scheduled on: '.$targetCueIn->getDateTimeString().' </h1>';
		
		
		// STEP 3.2: check if some resa exist in the given time frame for the current group
		$dbAccess_reservations = new C_dbAccess_reservations();
		$dbAccess_reservations->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_starting_on_frame 
			, $filterOnResources, false /*fulldays*/, $filterOnActions, $filterOnLogins, crontest);
		
		$hits = $dbAccess_reservations->count(); 
		if(!$hits) {
			if(crontest) { echo $tab.$tab.'<b>No reservation found in time search window, step to next template</b>'; }
			continue;
		} else 
			if(crontest) { echo $tab.$tab.'<b>'.$hits.' reservations are candidates so far</b>'; }
		$app = 0; // still there may be no appointments among the loaded resrvations, we will check this using $app
		
		
		// STEP 3.3: magnify the dS_resa objects with attributes from attendees tables
		foreach($dbAccess_reservations->keyed as $resaId => $o_dS_resa) { 
			$o_dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());
			$o_dS_resa->visitors = new C_setKeyed();
			$o_dS_resa->assess = class_resa_any;
		}
		
		// STEP 3.4: load attendees
		$o_dbAccess_attendees = new C_dbAccess_attendees();
		$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
		$o_dbAccess_visitors = new C_dbAccess_visitors();
			$resaIds = $dbAccess_reservations->getIdsList();
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
			$vids = $o_dbAccess_att_visitors->getVisitorsIds();
		$o_dbAccess_visitors->loadOnId($vids, false);
		
		// STEP 3.5: hook up account resource ids to the $o_dS_resa
		foreach($o_dbAccess_attendees->keyed as $attId => $dS_att)
			if(isset($dbAccess_resources->keyed[$dS_att->resourceId])) {
				$resa = $dbAccess_reservations->keyed[$dS_att->groupId];
				$resource = $dbAccess_resources->keyed[$dS_att->resourceId];
				$resa->attendees[$dS_att->resourceType]->add($resource, $dS_att->resourceId);
			}
		
		// STEP 3.6: hook up dS_visitors to the $o_dS_resa (only the ones eligible for communication)
		
		foreach($o_dbAccess_att_visitors->keyed as $attId => $dS_att) {
			
			
			$resaId = $dS_att->groupId;
			$visiId = $dS_att->resourceId;
			if(isset($o_dbAccess_visitors->keyed[$visiId])) { // this should always be the case: if an att_visitor exist, the dS_visitor should exist
					
				if(!isset($dbAccess_reservations->keyed[$resaId])) { // this should always be the case too (but this message pops up in the cron log sometimes (?!)
					$msg = 'resa id '.$resaId.' is not loaded but has a reference in att_visitors';
					if(crontest) echo '<p style="color:red"><b>'.$msg.'</b></p>';
					else echo '   ->'.$msg.chr(10); 
					continue; 
				}
				$dS_visitor = $o_dbAccess_visitors->keyed[$visiId];
				
				// check if this visitor is not yet appointed on the same day, sooner or later (in this case, he should get only one message, for the earliest appointment)
				$resa = $dbAccess_reservations->keyed[$resaId];
				
				// add the visitor as a valid recipient for communication
				$resa->visitors->add($dS_visitor, $visiId);
				
				if($resa->attendees[class_bCal]->count()) { $resa->assess = class_resa_appointment; $app++; }
					else $dbAccess_reservations->remove($resa->id); // car reservations, have a visitor but no bCal, we don't send communication for them
			}
		} // foreach visitor
		
		if(crontest) { echo $br.$tab.$tab.'<b>'.$hits.' reservations where found, from which '.$app.' qualify for communication</b>';	}
				
		if(!$app) {
			if(crontest) { echo $br.$tab.$tab.'<b>No appointment found in time search window, step to next template</b>'; }
			continue;
		}
		

		// STEP 3.7: attach watchovers to the account resources (a watchover is a login expecting notification from given agendas) 
		if($dS_template->target != class_visitor) { // templates aims account logins that are watching over the resources, 
			
			$dbAccess_resources->addWatchovers(); // hooks up logins to the resources (those logins expecting notifications)
			
		}
		
		// STEP 3.8: compile messages
		$c = 1;
		foreach($dbAccess_reservations->keyed as $resaId => $o_dS_resa) {
		
			if(crontest) echo '<br/> [ <b>'.$c++.'</b> ]  resa id '.$o_dS_resa->id.'';
			
			// Use templates ONLY for appointments (you would not like to send SMS for car reservations...)
			if($o_dS_resa->assess != class_resa_appointment) { if(crontest) { echo ' => is not an appointment (no visitor)'; }; continue;	}
			
			// Do not send communication for deleted appointments
			if($o_dS_resa->deletorId) if(!$filterOnActions) { if(crontest) { echo ' => is deleted, and there is no filter on action...'; }; continue;	}
			
			// STEP 3.9: compile the messages and send over
			sendResaMSGs($o_dS_resa, $dS_template, $dS_account, $dS_system->sendComm); // crontest applies inside this function too
			if(!crontest) sleep(1);
			
		} // foreach resa
		
		if(crontest) echo '<br/>';		
		
	} // foreach template
	

	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(crontest) { // testing locally displays HTML back to client

			echo '<br/><br/>FIVY CRON TEST - '.$faketime;
		echo '</body>';
	echo '</html>';
	
} else { // running in CLI mode, outputs to /var/log/mobminder-cron-hourly.log

		$now = new C_date();
		$delta = $now->t - $o_date->t;
		$start = 	'EXECUTION STARTED: '.$o_date->getDateTimeString();
		$done = 	'  DONE: '.$now->getDateTimeString();
		$delta = 	'  DELTA: '.$delta.'sec';
		echo $start.$done.$delta.chr(10);
}
?>