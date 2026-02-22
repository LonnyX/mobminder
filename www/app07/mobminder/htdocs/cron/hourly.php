#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
// - Scheduled communication reminders management (only daily reminders, and revivals here, H-x is managed by fivy.php cron). 
//
//


// DESIGN RULES FOR THIS FILE:
//
// This page can NOT use session variables because it is called from a cgi script on the server ( CRON task, every period of 5 minutes).
// 

// !! CHECK that sendComm is set to ZERO in table globals !! 

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page from Apache and test it

// RECOVER a MIST CRON EXECUTION : 
//
// http://be.mobminder.com/cron/hourly.php?fkt=2020-10-12%2011:00
// 
 
define('fakeTime', '2026-01-12 10:00:00'); // time and date used when crontest is true

$fakeTime = false;
if(crontest)	// when testing, we MUST use the defined faketime constant
	$fakeTime = fakeTime; 
	
// Usage example : localhost/cron/hourly.php?fkt=2016-10-23 11:00:00
// When the hourly cron FAILED to RUN in production for a given period, you need to
//
// - Set crontest to true
// - Comment the one second sleep (in this file)
// - Comment the return statement in file /../lib_mobphp/comm.php 
// - Re-execute the cron for each time slot ( 10h, 11h, 12h, ... ) in this period
//
	
if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
	$fakeTime = $_GET['fkt'];

// !! NOTE 
//
// When in CronTest mode, if you see only a given group's reminders appear on the screen echos, it's because you are logged in for this group, check the loadOnTrigger() function


$systemLog = 'hourly cron';
if(crontest||$fakeTime) { // running through Apache
	require '../classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext() used in comm.php
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/mblox.php';
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php'; // keep include sequence, check C_smsgateaway usage
	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
		echo '<body>';
		
	set_time_limit(500); // take a breath
}
else {  // when running in production
	require '/var/www/mobminder/htdocs/classes/language.php';  // NEW SERVERS
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/mblox.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php'; 
	require '/var/www/mobminder/lib_mobphp/comm.php';  // keep include sequence, check C_smsgateaway usage
	
	// require '/srv/web/be.mobminder.com/htdocs/classes/language.php'; // app01
	// require '/srv/web/be.mobminder.com/lib_mobphp/dbio.php'; 
	// require '/srv/web/be.mobminder.com/lib_mobphp/mblox.php'; 
	// require '/srv/web/be.mobminder.com/lib_mobphp/comm.php'; 
}

////////////////////////////////////

$o_dataLink_scriptExecutionStartTime = new C_date();
$archive_pivot_stamp = C_dS_system::backupPivotStamp();

////////////////////////////////////
//
//    PART 0 : PREPARE EXECUTION
//


	if($fakeTime) 
		$o_date = new C_date($fakeTime); // use simulation time
	else
		$o_date = new C_date(); // defaults to current date and time at execution start moment
	
	$nowHour = clone($o_date); $nowHour->dropMinutes(); 
	$nowHourStmp = $nowHour->getSec(); // now contains only hour information in units of seconds ( e.g. 36000 = 10am )

	// check if we did not run this cron before (some stupid google robots might call pages radomly just for the fun of scanning your server)
	
	$dS_system = new C_dS_system();
	
	if(crontest) { // CHECK EXECUTION TIME
		$tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		$br = '<br/>';
		echo '<br/>';
		echo $tab.'EXECUTING IN TEST MODE<br/>';
		echo 'SIMULATED TIME: '.$o_date->getDateTimeString().'<br/>';
		echo 'REFERENCE SCHEDULE: '.$nowHour->getTimeString().'<br/>';
		echo 'REMINDER SCHEDULE: '.$nowHourStmp.'secs or '.($nowHourStmp/3600).'h<br/>';
		echo '$testmode ? '.($testmode?'YEP':'nope').'<br/>';
		
		if($dS_system->youngestHourlyRun==$nowHour->getTstmp())
			echo $tab.'<br/><b>THIS CRON SHOULD NOT RUN AGAIN</b><br/>'; // this cron has run already for this timing
		
		echo $tab.'<br/><b>THE SYSTEM IS SET TO SEND COMMUNICATION: '.($dS_system->sendComm?'>> Y E S <<':'>> NO <<').'</b><br/>'; // this cron has run already for this timing
	} else {
		
		if($dS_system->youngestHourlyRun==$nowHour->getTstmp())
			die(); // THIS CRON HAS RUN already for this timing // this is a double screen check, because the crontab will never call twice on the same schedule
	}


////////////////////////////////////////
//
//    PART 1 : RE-ROUTE FAILED SMS
//
//

	$backHour = clone($o_date);
	$backHour->dropMinutes(); // this is the execution time of this current cron
	$backHour->hIncrement(-2); // this is the execution time of the previous cron PVH 2020-12 adjusted to be a frame with 3 hours delay, for smsmailing to have time to flow. Another solution would be to play with another priority level for smsmailing
	$backHourStamp = $backHour->getTstmp();


$o_dbAccess_sms = new C_dbAccess_sms(); // ROUTE 2
$o_dbAccess_sms->loadOnFailedForR2($backHourStamp-900, $backHourStamp+3600-900); // loads messages that were not delivered through route 2 (smsgateaway), 900 seconds = 15 minutes
if($o_dbAccess_sms->count()) {
	$shortcodegateaway = new C_mBlox_sms_http();
	foreach($o_dbAccess_sms->keyed as $smsId => $dS_sms) {
		$dS_template = new C_dS_smsTemplate($dS_sms->templateId);
		$maxlen = $dS_template->pages ? 459 : 159; // see (*m11*)
		if(crontest)
			echo '<br/>ROUTE 2: re-sending SMS with id = '.$dS_sms->id.' to number '.$dS_sms->toNumber;
		else if($dS_system->sendComm) {
			$shortcodegateaway->sendOver($dS_sms, $maxlen); 
			$dS_sms->dSsave();
		}
	}
	$o_dbAccess_sms->saveAll();
}


/////////////////////////////////////////////
//
//    PART 2 : GENERATE THIS TIME SLOT SMSs
//	
	
// STEP 0: Inventory of SCHEDULES that are taken into consideration for this script
//

$reminder_days_scheduled = Array( // only the ones used by cron task, definition? see (*triggers*)
	remind_days_eve, 
	remind_days_twodays, 
	remind_days_threedays, 
	remind_days_fourdays, 
	remind_days_oneweek, 
	remind_days_twoweeks,
	
	revival_days_one,
	revival_weeks_one,
	revival_weeks_two,
	revival_month_one,
	revival_months_two,
	revival_months_three,
	revival_months_five,
	revival_months_six,
	revival_months_nine,
	revival_months_eleven,
	revival_years_one ,
	revival_months_18,
	revival_years_two 
);
	
	
// STEP 1: Scan reminder schedules
//
foreach($reminder_days_scheduled as $reminder_schedule) { // $reminder_schedule is a triggerId
	
	
	// STEP 1: check if any template is defined on that schedule
	$byCommMedium = array();
	$byCommMedium[msg_medium_SMS] = new C_dbAccess_smsTemplates();
	$byCommMedium[msg_medium_email] = new C_dbAccess_emailTemplates();
	
	if(crontest) echo $tab.$tab.'<br/><b>Looking for templates with trigger id = '.$reminder_schedule.'</b>';
	$byCommMedium[msg_medium_SMS]->loadOnTrigger(class_resa_any, $reminder_schedule, $nowHourStmp);
	$byCommMedium[msg_medium_email]->loadOnTrigger(class_resa_any, $reminder_schedule, $nowHourStmp);

	$anySMStempl = $byCommMedium[msg_medium_SMS]->count();
	$anyEMLtempl = $byCommMedium[msg_medium_email]->count();
	
	if(!$anySMStempl) if(!$anyEMLtempl) continue; // skip to next schedule
	
	// STEP 2: define the reservations search scope
	$targetCueIn = clone($o_date); $targetCueIn->setToMidnight()->dIncrement($reminder_schedule);
	$stampSearchIn = $targetCueIn->getTstmp();
	$stampSearchOut = $stampSearchIn+86400;
	if(crontest) echo '<h1 style="color:red">TRIGGER: '.$reminder_schedule.' for reservations scheduled on: '.$targetCueIn->getDateString().' </h1>';
	
	// STEP 3: operate by communication medium
	foreach($byCommMedium as $msgMedium => $templates) { // scope to a message medium (i.e SMS, then emails)
	
		if(!$templates->count()) continue;
		if(crontest) echo '<h2 style="color:blue">'.$tab.'MEDIUM: medium '.(($msgMedium==msg_medium_SMS)?'SMS':'MAIL').'<h2>';
		
		foreach($templates->keyed as $templateId => $dS_template) { // scope to a template (i.e. an account, a given schedule)
			
			
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
			if($dS_template->filterOnLogins) if($dS_template->logins) if($dS_template->logins!=='-') $filterOnLogins = implode(',',explode('!',$dS_template->logins));
			if($dS_template->filterOnResources) if($dS_template->resources) $filterOnResources = implode(',',explode('!',$dS_template->resources));
			
			
			// STEP 3.2: check if some resa exist in the given time frame for the current group
			if($stampSearchIn < $archive_pivot_stamp) $archive = 'archive_'; else $archive = '';
			$dbAccess_reservations = new C_dbAccess_reservations($archive);
			$dbAccess_reservations->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_starting_on_frame, $filterOnResources, false /*fulldays*/, $filterOnActions, $filterOnLogins, crontest);
			
			$hits = $dbAccess_reservations->count(); 
			if(!$hits) {
				if(crontest) { echo $tab.$tab.'<b>No reservation found in time search window, let\'s skip to the next template</b>'; }
				continue;
			}
			$app = 0; // still there may be no appointments among the loaded resrvations, we will check this using $app
			
			// STEP 3.3: magnify the dS_resa objects with attributes from attendees tables
			foreach($dbAccess_reservations->keyed as $resaId => $o_dS_resa) { 
				$o_dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());
				$o_dS_resa->visitors = new C_setKeyed();
				$o_dS_resa->assess = class_resa_any;
			}
			
			// STEP 3.4: load attendees
			$o_dbAccess_attendees = new C_dbAccess_attendees($archive);
			$o_dbAccess_att_visitors = new C_dbAccess_att_visitors($archive);
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
			$presenceList = Array(); // list of visitors appearing in this template scope
			
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
					
					// for revival messages, check first that no appointment has been taken later by this visitor, that would invalidate the need for a revival
					if($reminder_schedule<0) {
						$exclude = 0; // counts how many time this visitor has appointed after the timeframe under scope
						$qv = new Q('select groupId from att_visitors where resourceId = '.$visiId.';');
						$rids = $qv->groupIds();
						if($rids) {
							$qr = new Q('select count(1) as c from reservations where id in ('.$rids.') and cueIn > '.$stampSearchOut.' and deletorId = 0;');
							$exclude = $qr->c(); // do not add this visitor to recipients because he has appointed yet in the current resa table (covers future and past 4 weeks)
						}
						if($stampSearchIn < $archive_pivot_stamp) { // also check in archive tables
							$qv = new Q('select groupId from archive_att_visitors where resourceId = '.$visiId.';');
							$rids = $qv->groupIds();
							if($rids) {
								$qr = new Q('select count(1) as c from archive_reservations where id in ('.$rids.') and cueIn > '.$stampSearchOut.' and deletorId = 0;');
								$exclude += $qr->c();
							}
						}
						if($exclude) {
							if(crontest) { echo $br.$tab.$tab.$tab.'<b>'.$dS_visitor->lastname.'</b> has appointed after the window timeframe, disqualified';	}
							continue; // do not add this visitor to recipients because he has appointed in the past, after the concerned resaId
						}
					}
					
					// check if this visitor is not yet appointed on the same day, sooner or later (in this case, he should get only one message, for the earliest appointment)
					$resa = $dbAccess_reservations->keyed[$resaId];
					
					if($dS_template->presenceList) // When on, the visitor that is twice on the planning should get a reminder only for the soonest appointment
					if(!$resa->deletorId) { // audit against presence list only if this reservation is not deleted
						if(array_key_exists($visiId,$presenceList)) { // then this visitor has appointed twice in the template scope. Only the earliest appointment should be reminded
							$otherResaId = $presenceList[$visiId];
							$otherResa = $dbAccess_reservations->keyed[$otherResaId];
								if($resa->cueIn < $otherResa->cueIn) {
									$presenceList[$visiId] = $resa->id; // keep the earliest instance as reference
									$otherResa->visitors->remove($visiId); // remove the visitor from the other reservation (keep the appointment, may be 2 visitors or more were attached to it)
									if(crontest) { echo $br.$tab.$tab.$tab.'<b>'.$dS_visitor->lastname.'</b> has appointed sooner in the same time scope, keep this one appointment';	}
								} else {
									if(crontest) { echo $br.$tab.$tab.$tab.'<b>'.$dS_visitor->lastname.'</b> has appointed later again in the same time scope, ignore this appointment';	}
									continue; // skip this visitor
								}
						}
						$presenceList[$visiId] = $resaId;
					}
					
					// add the visitor as a valid recipient for communication
					$resa->visitors->add($dS_visitor, $visiId);
					
					$has_bCals = $resa->attendees[class_bCal]->count();
					$has_fCals = $resa->attendees[class_fCal]->count();
					if($has_bCals) { $resa->assess = class_resa_appointment; $app++; }
						else if($has_fCals) $dbAccess_reservations->remove($resa->id); // car reservations, have a visitor but no bCal, we don't send communication for them
				}
			}
			
			if(crontest) { echo $br.$tab.$tab.'<b>'.$hits.' reservations were found, from which '.$app.' qualify for communication</b>';	}
			
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
				
				// Do not send communication for appointments having no visitor (they can be removed by the presenceList feature)
				if(!$o_dS_resa->visitors->count()) { if(crontest) { echo ' => has no attendee visitor'; }; continue;	}
				
				// STEP 3.9: compile the messages and send over
				if(crontest) { echo ' => => => Entering sendResaMSGs() from /libmob_php/comm.php'; }
				sendResaMSGs($o_dS_resa, $dS_template, $dS_account, $dS_system->sendComm); // crontest applies inside this function too
				
				if(!crontest) usleep(500*1000); // Keep this here, mBlox gets flooded when bursting its interface
				// if(!crontest) sleep(1); // 2020 march : spread the load onto apache as here we call our own server that holds smsgateaway
				
			} // foreach resa
			
			if(crontest) echo '<br/>';
			
		} // foreach dS_template
		
	} // foreach comm medium
	
} // foreach reminder schedule




/////////////////////////////////////////////
//
//    PART 3 : RECORD, LOG, ECHO
//	

// record the last job timing, so we assure that it doesnt run twice
//
	$dS_system->setHourlyRun($nowHour->getTstmp());

	
// echo/log some info about the execution
//
if(crontest) { // testing locally displays HTML back to client

	echo '<br/><br/>hourly cron done';
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