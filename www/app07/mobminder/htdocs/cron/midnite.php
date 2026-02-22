#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
// - Counting communication figures, and sending emails to Mobminder admins
//
//


// DESIGN RULES FOR THIS FILE:
//
// This page can NOT use session variables because it is called from a cgi script on the server ( CRON task, every minute).
// 
define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2022-05-15 0:00:00'); // watch the line where sendOver() is called !!

$systemLog = 'midnite cron';
if(crontest) {
	require '../classes/language.php';  // when running it locally
	require '../../lib_mobphp/dbio.php';  // when running it locally
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
} else {
	require '/var/www/mobminder/htdocs/classes/language.php'; // when running in production
	require '/var/www/mobminder/lib_mobphp/dbio.php'; // when running in production
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; // when running in production
}



//////////////////////////////////////////////////////
//
//  RESET DAILY CREDIT COUNTERS
//
$q = new Q('update groups set todaySMSremains = dailySMScredit;'); // see (*cr10*)
$q = new Q('update groups set todayEMLremains = dailyEMLcredit;');



//////////////////////////////////////////////////////
//
//  PREPARE COUNTERS - BY TEMPLATE
//

	$accounts = new C_dbAccess_groups();
	$accounts->loadAll();
	
	$templates = new C_dbAccess_smsTemplates();
	$templates->loadAllOrdered();
	
	
	// 1- create a structure for the counters, following status possible values
	//
	class C_smsStatusCounters {
		public $totalSMS; // total that WAS SENT on this route
		public $handled; // handled to provider, no feedback yet
		public $error; 	// problem contacting the provider
		public $dead; 	// wrong number
		public $pending;		// feedback received: queued somewhere in network	
		public $delivered;	// feedback received: delivered
		public $discarded;	// feedback received: deleted somewhere in network	
		public $routeId;
		public $routeName;
		public function __construct($routeId, $routeName) { // route line [1,2 or 3]
			$this->totalSMS 	= 0;
			$this->handled 		= 0;
			$this->error 		= 0;
			$this->dead 		= 0;
			$this->pending 		= 0;		
			$this->delivered 	= 0;
			$this->discarded 	= 0;
			$this->routeId 		= $routeId;
			$this->routeName 	= $routeName;
		}
		public function add($o_smsStatusCounters) {
			$this->totalSMS 	+= $o_smsStatusCounters->totalSMS;
			$this->handled 		+= $o_smsStatusCounters->handled;
			$this->error 		+= $o_smsStatusCounters->error;
			$this->dead 		+= $o_smsStatusCounters->dead;
			$this->pending 		+= $o_smsStatusCounters->pending;		
			$this->delivered 	+= $o_smsStatusCounters->delivered;
			$this->discarded 	+= $o_smsStatusCounters->discarded;
		}
		public function max($o_smsStatusCounters) {
			if($this->totalSMS<$o_smsStatusCounters->totalSMS) $this->totalSMS =$o_smsStatusCounters->totalSMS;
			if($this->handled<$o_smsStatusCounters->handled) $this->handled = $o_smsStatusCounters->handled;
			if($this->error<$o_smsStatusCounters->error) $this->error = $o_smsStatusCounters->error;
			if($this->dead<$o_smsStatusCounters->dead) $this->dead = $o_smsStatusCounters->dead;
			if($this->pending<$o_smsStatusCounters->pending) $this->pending = $o_smsStatusCounters->pending;		
			if($this->delivered<$o_smsStatusCounters->delivered) $this->delivered = $o_smsStatusCounters->delivered;
			if($this->discarded<$o_smsStatusCounters->discarded) $this->discarded = $o_smsStatusCounters->discarded;
		}
	}
	
	
	// 2- attach a C_smsStatusCounters to each template
	//
	foreach($templates->keyed as $tempId => $dS_template) { // add counter fields to templates
		
		$dS_template->smsStatusCounters = Array();
		$dS_template->smsStatusCounters[0] = new C_smsStatusCounters(0,'global quality');
		$dS_template->smsStatusCounters[1] = new C_smsStatusCounters(1,'Sinch UK');
		$dS_template->smsStatusCounters[2] = new C_smsStatusCounters(2,'Mobminder sms gateaway');
		$dS_template->smsStatusCounters[3] = new C_smsStatusCounters(3,'not in service');
		
		// prepare some textual information to display in figures tables
		$groupId = $dS_template->groupId;
		$dS_template->accountName = $accounts->keyed[$groupId]->name; // PVH 2021 - if cron error log reports problem here ( id 0 doesn't exist ) then go check the templates_sms table for groupId = 0 
			$schedule = 'conf';
			if($dS_template->triggerId == 99) $schedule = 'manual';
			if($dS_template->triggerId >= remind_days_eve && $dS_template->triggerId <= remind_days_twoweeks) $schedule = ($dS_template->deliveryTime/3600).' h';
		$dS_template->schedule = $schedule;
	}
	
	
	// 3- define a time window
	//
	if(crontest) 
		$date_out = new C_date(fakeTime); // use simulation time
	else
		$date_out = new C_date(); // defaults to current date and time
		
	$date_out->setToMidnight(); // now contains only date and hour information
	$date_in = new C_date($date_out);
	$date_in->dIncrement(-1);
	
	$cueIn = $date_in->getTstmp();
	$cueOut = $date_out->getTstmp();
	
	
//////////////////////////////////////////////////////
//
//  COUNT FROM DB
//
	
	// 1- SQL query function by status and route
	//
	function countOnStatus($cueIn, $cueOut, $status, $routeId, $templates) { // reports for ALL templates
		switch($routeId) {
			case 1: $prefix = ''; break;   // maintain coherence with naming of class members here (*sms01*)
			case 2: $prefix = 'r2'; break;
			case 3: $prefix = 'r3'; break;
		}
		switch($status) {
			case sms_nosms: $counter = 'totalSMS'; break;
			case sms_handled: $counter = 'handled'; break;
			case sms_error: $counter = 'error'; break;
			case sms_dead_numb: $counter = 'dead'; break;
			case sms_pending: $counter = 'pending'; break;
			case sms_delivered: $counter = 'delivered'; break;
			case sms_discarded: $counter = 'discarded'; break;
		}
		$statusField = $prefix.'status';
		if($status==sms_nosms) $whereStatus = 'AND '.$statusField.' <> '.sms_nosms.' AND '.$statusField.' <> '.sms_created; 
			else $whereStatus = 'AND '.$statusField.' = '.$status; 
		
		$SQL = 'SELECT templateId, count(1) as amount FROM sms WHERE  
			sendStamp>='.$cueIn.' AND sendStamp<'.$cueOut.' '.$whereStatus.'
			GROUP BY templateId;';
			
		$result = C_dbIO::q($SQL, 'midnite.php::countOnStatus()');
		while($row = $result->fetch_array()) {
			$templateId = $row['templateId'];
			$countSMS = $row['amount'];
			if(!isset($templates[$templateId])) continue; // template was deleted
			$templates[$templateId]->smsStatusCounters[$routeId]->{$counter} += $countSMS;
		}
		$result->close();
	}
	
	// 2- count from DB, fill the counters in C_smsStatusCounters
	//
	$statusItems = Array( sms_nosms, sms_handled, sms_error, sms_dead_numb, sms_pending, sms_delivered, sms_discarded);
	$routeItems = Array( 1, 2, 3);
	
	foreach($routeItems as $route) 
		foreach($statusItems as $status) 
			countOnStatus($cueIn, $cueOut, $status, $route, $templates->keyed);
	
	
	
	
	
	
//////////////////////////////////////////////////////
//
//  COUNT ON GLOBAL DELIVERY QUALITY (after all routes have been used)
//

	// 1- SQL query function by status and route
	//
	function countOnQuality($cueIn, $cueOut, $status, $routeId, $templates) { // reports for ALL templates

		switch($status) {
			case sms_nosms: 	$counter = 'totalSMS'; break;
			case sms_handled: 	$counter = 'handled'; break;
			case sms_error: 	$counter = 'error'; break;
			case sms_dead_numb: $counter = 'dead'; break;
			case sms_pending: 	$counter = 'pending'; break;
			case sms_delivered: $counter = 'delivered'; break;
			case sms_discarded: $counter = 'discarded'; break;
		}
		
		$whereStatus = 'AND ( (r3status = '.$status.') 
			OR (r3status = '.sms_nosms.' AND r2status = '.$status.')
			OR (r3status = '.sms_retry.' AND r2status = '.$status.')
			OR (r3status = '.sms_nosms.' AND r2status = '.sms_nosms.' AND status = '.$status.')
			OR (r3status = '.sms_retry.' AND r2status = '.sms_nosms.' AND status = '.$status.')
			)';
		if($status == sms_nosms) $whereStatus = '';
			
		$SQL = 'SELECT templateId, count(1) as amount FROM sms WHERE  
			sendStamp>='.$cueIn.' AND sendStamp<'.$cueOut.' '.$whereStatus.'
			GROUP BY templateId;';
		
		$result = C_dbIO::q($SQL, 'midnite.php::countOnQuality()');
		while($row = $result->fetch_array()) {
			$templateId = $row['templateId'];
			$countSMS = $row['amount'];
			if(!isset($templates[$templateId])) continue;
			$templates[$templateId]->smsStatusCounters[$routeId]->{$counter} += $countSMS;
		}
		$result->close();
	}

	 
	// 2- count from DB, fill the counters in C_smsStatusCounters
	//
	foreach($statusItems as $status) 
		countOnQuality($cueIn, $cueOut, $status, 0 /*quality measure*/, $templates->keyed);
			
			
	// 3- consolidate all totals by route
	//
	$routeTotals[-1] = new C_smsStatusCounters(0,'max');
	$routeTotals[0] = new C_smsStatusCounters(0,'Global quality');
	$routeTotals[1] = new C_smsStatusCounters(1,'Sinch UK');
	$routeTotals[2] = new C_smsStatusCounters(2,'Mobminder sms gateaway');
	$routeTotals[3] = new C_smsStatusCounters(3,'not activated');
	
	foreach($templates->keyed as $tempId => $dS_template) { // add counter fields to templates
		$routeTotals[-1]->max($dS_template->smsStatusCounters[0]);
		$routeTotals[0]->add($dS_template->smsStatusCounters[0]);
		$routeTotals[1]->add($dS_template->smsStatusCounters[1]);
		$routeTotals[2]->add($dS_template->smsStatusCounters[2]);
		$routeTotals[3]->add($dS_template->smsStatusCounters[3]);
	}
	
	
		
//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  DISPLAY GLOBAL FIGURES
//

function bargraph($values, $title, $legends, $colors, $scale, $hdwidth = '2em', $vdisplay = true) {
	$t = 0;
	$pc = Array();
	foreach($values as $v) $t += $v;
	foreach($values as $v) { $p = $t ? (100*$v/$t) : 1; if($p==100)$p=99; $pc[] = $p; }
	
	$tds = Array();
	$tds[] = '<td style="min-width:'.$hdwidth.'; max-width:'.$hdwidth.'; overflow:hidden; display:inline-block;"><b>'.$t.'</b></td>';
	foreach($values as $x => $v) {
		$l = $legends ? $legends[$x].':<br/>' : '';
		$vd = $vdisplay ? $v : '';
		$style = 'style="background:'.$colors[$x].'; padding:0 0.2em; text-align:right; width:'.$pc[$x].'%;"';
		$tds[] = '<td '.$style.'>'.$l.$vd.'</td>';
	}
	
	$table = '<div style="padding:1em 0 0 0;">'.$title.'</div>';
	if($scale) $s = 100*$t/$scale; else $s=10;
	$style = 'style="width:'.$s.'%; border-collapse:collapse; border-right:1px solid WhiteSmoke; border-bottom:2px solid WhiteSmoke;"';
	$table .= '<table '.$style.'><tr>'.implode('',$tds).'</tr></table>';
	return $table;
}


// STEP X: Report
//


// function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
// function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function p($t) { return '<p style="color:111; font-size:1em; margin:0; margin-top:0.3em;">'.$t.'</p>'; }
// function indent($t) { return '<div style="margin-left:4em;">'.$t.'</div>'; }

$htmlOut = '';


			$totalSMS = $routeTotals[0]->totalSMS;
			$weekday = $date_in->getDayString();
			$date = $date_in->getDateString();
		$title =  $totalSMS.' SMS sent on '.$weekday.' '.$date;
	$htmlOut .= h1($title);
	
	
$htmlOut .= h2('Global performance');

	
	$legends = Array('error','dead','pending','discarded','delivered','no feedback');
	$colors = Array('darkgrey','red','orange','salmon','palegreen','powderblue');
	$scale = $routeTotals[0]->totalSMS;
$htmlOut .= bargraph(Array(1,1,1,1,1), 'Legend', $legends, $colors, 10, '0em' /*header width*/, false /*values display*/ );	
	
	$e = $routeTotals[0]->error;
	$b = $routeTotals[0]->dead;
	$p = $routeTotals[0]->pending;
	$d = $routeTotals[0]->delivered;
	$s = $routeTotals[0]->discarded;
	$h = $routeTotals[0]->handled;
$htmlOut .= bargraph(Array($e,$b,$p,$s,$d,$h), 'All routes together', false, $colors, $scale);	
	
	$e = $routeTotals[1]->error;
	$b = $routeTotals[1]->dead;
	$p = $routeTotals[1]->pending;
	$d = $routeTotals[1]->delivered;
	$s = $routeTotals[1]->discarded;
	$h = $routeTotals[1]->handled;
$htmlOut .= bargraph(Array($e,$b,$p,$s,$d,$h), 'Route 1 quality: '.$routeTotals[1]->routeName, false, $colors, $scale);	
	
	$e = $routeTotals[2]->error;
	$b = $routeTotals[2]->dead;
	$p = $routeTotals[2]->pending;
	$d = $routeTotals[2]->delivered;
	$s = $routeTotals[2]->discarded;
	$h = $routeTotals[2]->handled;
$htmlOut .= bargraph(Array($e,$b,$p,$s,$d,$h), 'Route 2 quality: '.$routeTotals[2]->routeName, false, $colors, $scale);	
	
	$e = $routeTotals[3]->error;
	$b = $routeTotals[3]->dead;
	$p = $routeTotals[3]->pending;
	$d = $routeTotals[3]->delivered;
	$s = $routeTotals[3]->discarded;
	$h = $routeTotals[3]->handled;
$htmlOut .= bargraph(Array($e,$b,$p,$s,$d,$h), 'Route 3 quality: '.$routeTotals[3]->routeName, false, $colors, $scale);	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  
//
if(false) {

	$htmlOut .= h2('Performance by account');

	$scale = $routeTotals[-1]->totalSMS;

	$order = Array();
	foreach($templates->keyed as $tempId => $dS_template) { 
		$t = $dS_template->smsStatusCounters[0]->totalSMS;
		if($t == 0) continue;
		$order[$tempId] = $t;
	}

		function descending($a, $b) { return $b - $a; }
		uasort($order, 'descending'); 

	foreach($order as $tempId => $t) {
		$o_dS = $templates->keyed[$tempId];
		$e = $o_dS->smsStatusCounters[0]->error;
		$d = $o_dS->smsStatusCounters[0]->dead;
		$p = $o_dS->smsStatusCounters[0]->pending;
		$d = $o_dS->smsStatusCounters[0]->delivered;
		$s = $o_dS->smsStatusCounters[0]->discarded;
		$h = $o_dS->smsStatusCounters[0]->handled;
		$n = $o_dS->accountName.', '.$o_dS->name;
		$htmlOut .= bargraph(Array($e,$d,$p,$s,$d,$h), $n, false, $colors, $scale);	
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SEND FEEDBACK BY EMAIL
//
	
	$htmlOut .= h2('x. Record');
	$o_dbAccess_logins = new C_dbAccess_logins(); $o_dbAccess_logins->loadOnAccessLevel(aLevel_admin);
	$from = 'MobMinder Midnight Cron <no-reply@app01.mobminder.com>';
	$emails = Array(); $emailsDisplay = '';
	if($o_dbAccess_logins->count())
		foreach ($o_dbAccess_logins->keyed as $id => $o_dS_login)
			if($o_dS_login->email) 
				if(!in_array($o_dS_login->email,$emails)) {
					$emailsDisplay .= p($o_dS_login->email);
					$emails[] = $o_dS_login->email;
				}
	$htmlOut.= indent($emailsDisplay);
			
	if(crontest){ // testing locally displays HTML back to client
		echo '<!DOCTYPE HTML>';
		echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			echo '<head>';
		echo '<body>'.$htmlOut.'</body></html>';
	}
	else { // running in CLI mode, outputs to /var/log/mobminder-cron-midnite.log
		if(count($emails)) {
			$o_dataCom_mail = new C_dataCom_mail();
			foreach($emails as $email)
				$o_dataCom_mail->sendMail($title, $htmlOut, $email, $from, language_code_english);
		}
		$now = new C_date();
		echo 'EXECUTION FINISHED ON:'.$now->getDateTimeString().chr(10);
	}

	//echo jsStream($o_dbAccess_sms->stream());
	
	
	
//bsp-begin
/////////////////////////////////////////////////////////////////
// CALL CRONOFY MIDNITE TASKS
// created by bspoden
/////////////////////////////////////////////////////////////////
if(crontest) 
{ 
	// when running it locally
	require '../../lib_cronofy/cronofymanager.php';
	include '../cronofy/cron/midnite.php';
}
else
{  
	// when running in production
	require '/var/www/mobminder/lib_cronofy/cronofymanager.php';
	include '/var/www/mobminder/htdocs/cronofy/cron/midnite.php';
}
//bsp-end
	
?>