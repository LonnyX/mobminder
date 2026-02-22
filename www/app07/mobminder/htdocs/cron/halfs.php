#!/usr/bin/php5 -q
<?php

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('faketime', '2019-02-08 12:30:03'); // watch the line where sendOver() is called !!

$faketime = false;
if(crontest)	// when testing, we MUST use the defined faketime constant
	$faketime = faketime;

if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
	$faketime = $_GET['fkt'];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
// - Visitor's birthday notification management
//
//

$systemLog = 'halfs cron';
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

	$refTime = clone($o_date); $refTime->dropMinutes(); $refTimeSeconds = $refTime->getSec();
	$refDay = clone($refTime); $refDay->setToMidnight(); $refDaySortable = $refDay->getBirthdaySortable();

$dS_system = new C_dS_system();
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if(crontest) {
	$tab = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
	$br = '<br/>';
	echo '<br/>';
	echo $tab.'EXECUTING IN TEST MODE<br/>';
	echo 'SIMULATED TIME: '.$o_date->getDateTimeString().'<br/>';
	echo 'REFERENCE TIME: '.$refTime->getTimeString().'<br/>';
	echo 'REFERENCE DAY: '.$refDay->getDateTimeString().' or '.$refDaySortable.'<br/>';
	echo 'REMINDER SCHEDULE: '.$refTimeSeconds.'secs or '.($refTimeSeconds/3600).'h<br/>';
	echo '<br/>';
	echo $tab.'<br/><b>THE SYSTEM IS SET TO SEND COMMUNICATION: '.($dS_system->sendComm?'>> Y E S <<':'>> NO <<').'</b><br/>'; // this cron has run already for this timing
} 

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STEP 1: select templates
//

$q = new Q('select id from templates_sms where triggerId = '.notification_onBirthday.' and deliveryTime = '.$refTimeSeconds.';');
$smsTmplIds = $q->ids();

$q = new Q('select id from templates_email where triggerId = '.notification_onBirthday.' and deliveryTime = '.$refTimeSeconds.';');
$emailTmplIds = $q->ids();

$dS_templatesSMS = new C_dbAccess_smsTemplates(); $dS_templatesSMS->loadOnId($smsTmplIds);
$dS_templatesEMAILs = new C_dbAccess_emailTemplates(); $dS_templatesEMAILs->loadOnId($emailTmplIds);

$dS_templates = new C_dbAccess_smsTemplates();
$dS_templates->absorb($dS_templatesSMS);
$dS_templates->absorb($dS_templatesEMAILs);



if($dS_templates->count()) // if any notification
	foreach($dS_templates->keyed as $templateId => $dS_template) { // template scopes on account and communication text, trigger and targets
		
		
		// STEP 3.0: check that the group is allowed sending SMS or email accordingly
		$dS_account = new C_dS_group($dS_template->groupId);
		$accountId = $dS_account->id;
		if(crontest)
			echo '<h3 style="color:green">'.$tab.$tab.'REMINDER: id '.$dS_template->id.$tab.$dS_template->deliveryTime.$tab.$dS_account->name.$tab.' Reminder name:'.$dS_template->name.'</h3>';
		if(!$dS_account->sendSMSs) {
				if(crontest) { echo $tab.$tab.'<b>This account has communication disabled... skipping</b>'; }
				continue;
			}
		
			$target = $dS_template->target; 
			$targetToAccountResource = ($target == class_bCal)||($target == class_uCal)||($target == class_fCal);
			$r1 = false;
			
		if($targetToAccountResource) {
			$dbAccess_resources = new C_dbAccess_resources($accountId);
			$dbAccess_resources->addWatchovers(); // hooks up logins to the resources (those logins expecting notifications)
												  // $dS_rsc->wologins = new C_setKeyed(); $dS_rsc->wologins->add($dS_login, $dS_login->id); 
												  // this is a weak implementation as we actually should have a check control enabling reception of notification for the birthday messages, 
												  // instead, we check if this login wants to be notified for at least one bCal calendar from this account
			
			$dbAccess_resources_tuned = new C_dbAccess_resources($accountId);
			foreach($dbAccess_resources_tuned->keyed as $rid => $dS_rsc) if($dS_rsc->resourceType == $target) $r1 = $dS_rsc;
				
			if($r1) {
				$r1->wologins = new C_setKeyed();
				foreach($dbAccess_resources->keyed as $rid => $dS_resc)
					foreach($dS_resc->wologins->keyed as $loginId => $dS_login)
						if(!isset($r1->wologins->keyed[$loginId]))
							$r1->wologins->add($dS_login, $dS_login->id);
				// we end up with a resource containing all logins having subscribed to any account resource of the type $dS_template->target
				// the idea is to allow notification of logins when a visitor reaches his birthday date
			}
		}
		
		// STEP 3.2: check if some visitor exist in the given time frame for the current group
		$dbAccess_visitors = new C_dbAccess_visitors();
		$dbAccess_visitors->loadOnBirthday($accountId, $refDaySortable);
		
		$hits = $dbAccess_visitors->count(); 
		if(!$hits) {
			if(crontest) { echo $tab.$tab.'<b>No visitor found in time search window, step to next template</b>'; }
			continue;
		} else 
			if(crontest) { echo $tab.$tab.'<b>'.$hits.' visitors are candidates so far</b>'; }
		$app = 0; // still there may be no appointments among the loaded resrvations, we will check this using $app
		
		
		
		// loop on visitors
		//
		foreach($dbAccess_visitors->keyed as $visiId => $dS_visitor) {
				
			// STEP 3.3: magnify the dS_resa object with attributes so that templates parameters can be honored
			$dS_resa = new C_dS_reservation(0, $accountId); // we are using a fake reservation
			
			$dS_resa->cueIn = $refTime->getTstmp();
			$dS_resa->cueOut = $refTime->getTstmp()+3600;
			
			$dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());
			$dS_resa->assess = class_resa_appointment;
			
			$dS_resa->visitors = new C_setKeyed();
			$dS_resa->visitors->add($dS_visitor, $visiId);
					
			// attach watchovers to the account resources (a watchover is a login expecting notification from given agendas) 
			//
			if($r1) $dS_resa->attendees[$target]->add($r1, $r1->id);
			
			
			// STEP 3.8: compile the messages and send over
			sendResaMSGs($dS_resa, $dS_template, $dS_account, $dS_system->sendComm, true /*forceresend*/); // crontest applies inside this function too
			if(!crontest) sleep(1);
				
			
			if(crontest) echo '<br/>';
		}
		
	} // foreach template
	


//bsp-begin
/////////////////////////////////////////////////////////////////
// CALL CRONOFY HALFS TASKS
// created by bspoden
/////////////////////////////////////////////////////////////////
if(crontest) 
{ 
	// when running it locally
	require '../../../lib_cronofy/cronofymanager.php';
	include '../cronofy/cron/halfs.php';
}
else
{  
	// when running in production
	require '/var/www/mobminder/lib_cronofy/cronofymanager.php';
	include '/var/www/mobminder/htdocs/cronofy/cron/halfs.php';
}
//bsp-end
	
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