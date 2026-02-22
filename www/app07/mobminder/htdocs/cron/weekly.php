#!/usr/bin/php5 -q
<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// IN THIS CRON: 
//
// - Weekly archiving reservations to archive tables. The objective is to have improved quick access to present and futures items for plitems.php and search.php
// - Delete older items in various tables where their presence has obsolete relevance
// - Produce a report showing various system size


// DESIGN RULES FOR THIS FILE:
//
// This page can NOT use session variables because it is called from a cgi script on the server ( CRON task, every minute).
// 
define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page from a local browser and test it
define('fakeTime', '2024-11-17 01:00:00'); 
ini_set('memory_limit', '2048M'); // PVH 2021 : Firefox will not start if this is set to 4096M

	
	
$systemLog = 'weekly cron';
if(crontest) {
	require '../classes/language.php';  // when running it locally
	require '../../lib_mobphp/dbio.php';  // when running it locally
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
}
else{ // when running in production
	require '/var/www/mobminder/htdocs/classes/language.php';
	require '/var/www/mobminder/lib_mobphp/dbio.php';
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}
  
function mail_h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function mail_h2($t) { return '<h2 style="white-space:nowrap; color:#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function mail_p($t) { return '<p style="color:111; font-size:1em; margin:0; margin-top:0.3em;">'.$t.'</p>'; }
function mail_indent($t) { return '<p style="color:222; font-size:1em; margin-left:3em; margin-top:0.3em;">'.$t.'</p>'; }

$pad = '     ';


		if(crontest) 
			$now = new C_date(fakeTime); // use simulation time
		else
			$now = new C_date(); // defaults to current date and time
		
		
	$title = 'WEEKLY CRON STARTING: '.$now->getDateTimeString();
	$htmlOut = mail_h1($title); // this htlm verbose is used by C_dataCom_mail and used as web html rendering
	if(!crontest) echo $title.chr(10);
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// STEP 1: Archive reservations data
//
set_time_limit(720); // take a breath

	// STEP 1.0: Sanity check
	//
		// select any id that is present both in archive_reservations and in reservations, clean up from archive_reservations
		
	$q = new Q('SELECT reservations.id FROM reservations JOIN archive_reservations ON reservations.id = archive_reservations.id WHERE reservations.id >= 0;');
	$ids = $q->ids();
	$dids = $q->cnt();
	
	if($ids) { 
		// track the problem we had on may 8th 2016: INSERT INTO archive_reservations SELECT * FROM reservations WHERE reservations.archived = 2; - err#1062 -> Duplicate entry '0-3115' for key 'PRIMARY'
		// it seems that the same id '0' was in both tables, but we could not reproduce this problem based on backups... still we drop an exception in case of
		//
		// Addendum on Jan 23rd 2017: The ids that are causing the problem are id = 0, this relates to the problem of some entries inserted in the table with id = 0... problem solved in 2017
		//
		C_dS_exception::put('weekly.php ' /*class*/, 'STEP 1.0' /*function*/, 'Some ids exist in both archive and current resa tables ('.$ids.')' /*msg*/, 0 /*account id*/);
		new Q('DELETE from archive_reservations WHERE id in ('.$ids.')');
		new Q('DELETE from archive_attendees WHERE groupId in ('.$ids.')');
		new Q('DELETE from archive_att_visitors WHERE groupId in ('.$ids.')');
		new Q('DELETE from archive_performances WHERE groupId in ('.$ids.')');
		new Q('DELETE from archive_payments WHERE groupId in ('.$ids.')');
		new Q('DELETE from archive_resaparts WHERE groupId in ('.$ids.')');
		
		$htmlOut .= mail_indent('An exception was dropped, ids exist in both archive and current resa tables ('.$ids.')');
	}
	
			$j = new C_date();
		if(!crontest)  $pad.$pad.'Double ids cleanup finished, found '.$dids.' in common ('.$j->getTimeString().')'.chr(10);	
	
	
	
	// STEP 1.1: Calculate the new pivot archive date and store it in the DB
	//
		
		$archivePivot = clone($now);
		$archivePivot->wIncrement(-4); // place archive pivot date 4 weeks before now
		$archPivotStmp = $archivePivot->getMDNstmp();
		
		new Q('UPDATE globals SET backupPivot = '.$archPivotStmp.' WHERE id=1');

		
	// STEP 1.2: Turn dataSets to archive mode
	//

		new Q('UPDATE reservations 	JOIN attendees 		ON reservations.id = attendees.groupId SET attendees.archived = 2, reservations.archived = 2 WHERE cueOut < '.$archPivotStmp.' AND reservations.id > 0;');
		new Q('UPDATE att_visitors 	JOIN reservations 	ON reservations.id = att_visitors.groupId SET att_visitors.archived = 2 WHERE reservations.archived = 2;');
		new Q('UPDATE performances 	JOIN reservations 	ON reservations.id = performances.groupId SET performances.archived = 2 WHERE reservations.archived = 2;');
		new Q('UPDATE payments 		JOIN reservations 	ON reservations.id = payments.groupId SET payments.archived = 2 WHERE reservations.archived = 2;');
		new Q('UPDATE resaparts 	JOIN reservations 	ON reservations.id = resaparts.groupId SET resaparts.archived = 2 WHERE reservations.archived = 2;');
		
		
	// STEP 1.3: Copy candidates
	//	
		$q = new Q('INSERT INTO archive_reservations 	SELECT * FROM reservations 	WHERE reservations.archived = 2;'); $countResa = $q->hits();
		$q = new Q('INSERT INTO archive_attendees 		SELECT * FROM attendees 	WHERE attendees.archived = 2;'); $countAttendees = $q->hits();
		$q = new Q('INSERT INTO archive_att_visitors 	SELECT * FROM att_visitors 	WHERE att_visitors.archived = 2;'); $countAttendees = $q->hits();
		$q = new Q('INSERT INTO archive_performances 	SELECT * FROM performances 	WHERE performances.archived = 2;'); $countPerfs = $q->hits();
		$q = new Q('INSERT INTO archive_payments 		SELECT * FROM payments 		WHERE payments.archived = 2;'); $countPayments = $q->hits();
		$q = new Q('INSERT INTO archive_resaparts 		SELECT * FROM resaparts 	WHERE resaparts.archived = 2;'); $countParts = $q->hits();

		
	// STEP 1.4: Delete from native table
	//		

		new Q('DELETE FROM reservations WHERE archived = 2;');	
		new Q('DELETE FROM attendees 	WHERE archived = 2;');	
		new Q('DELETE FROM att_visitors WHERE archived = 2;');	
		new Q('DELETE FROM performances WHERE archived = 2;');	
		new Q('DELETE FROM payments 	WHERE archived = 2;');	
		new Q('DELETE FROM resaparts 	WHERE archived = 2;');
		
		
			$j = new C_date();
		if(!crontest) echo $pad.$pad.'Moved '.$countResa.' reservations to archives ('.$j->getTimeString().')'.chr(10);	


set_time_limit(399); // take a breath

			
			$j = new C_date();
		if(!crontest) echo $pad.$pad.'Archive tables optimized ('.$j->getTimeString().')'.chr(10);
		

	// STEP 1.5: Set archive tag back to 1 (indicating processed well finished)
	//		

		new Q('UPDATE archive_reservations SET archived = 1 WHERE archived =2;');	
		new Q('UPDATE archive_attendees SET archived = 1 	WHERE archived =2;');	
		new Q('UPDATE archive_att_visitors SET archived = 1 WHERE archived =2;');	
		new Q('UPDATE archive_performances SET archived = 1 WHERE archived =2;');	
		new Q('UPDATE archive_payments SET archived = 1		WHERE archived =2;');	
		new Q('UPDATE archive_resaparts SET archived = 1 	WHERE archived =2;');	
		
		
		

		$j = new C_date();
	if(!crontest) echo $pad.'Archive tables processing finished ('.$j->getTimeString().')'.chr(10);	
	
	

(361); // take a breath

		new Q('OPTIMIZE TABLE reservations, attendees, att_visitors, performances, payments, resaparts, resa_series, workcodes, workexperts, worktboxing;');
		
	if(!crontest) echo $pad.'Optimizing live reservations tables finished ('.$j->getTimeString().')'.chr(10);	
		
		
		

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// STEP 2: remove deleted reservations that are older than 2 years
//		
	
	$oldeletedPivot = clone($now);
		$delappweeks = 48;
	$oldeletedPivot->mIncrement(-$delappweeks); // place reservations drop pivot date
	$oldeletedPivot = $oldeletedPivot->getMDNstmp();
	
	
	// STEP 1.6: Turn dataSets to archive mode 
	//
set_time_limit(462); // take a breath

		new Q('UPDATE archive_reservations JOIN archive_attendees 		ON archive_reservations.id = archive_attendees.groupId 		SET archive_attendees.archived = 3, archive_reservations.archived = 3 WHERE deletorId <> 0 AND cueOut < '.$oldeletedPivot.';');
		new Q('UPDATE archive_att_visitors JOIN archive_reservations 	ON archive_reservations.id = archive_att_visitors.groupId 	SET archive_att_visitors.archived = 3 	WHERE archive_reservations.archived = 3;');
		new Q('UPDATE archive_performances JOIN archive_reservations 	ON archive_reservations.id = archive_performances.groupId 	SET archive_performances.archived = 3 	WHERE archive_reservations.archived = 3;');
		new Q('UPDATE archive_payments JOIN archive_reservations 		ON archive_reservations.id = archive_payments.groupId 		SET archive_payments.archived = 3 		WHERE archive_reservations.archived = 3;');
		new Q('UPDATE archive_resaparts JOIN archive_reservations 		ON archive_reservations.id = archive_resaparts.groupId 		SET archive_resaparts.archived = 3 		WHERE archive_reservations.archived = 3;');

	
	// STEP 1.7: Delete from archive table
	
				
		$q = new Q('DELETE FROM archive_reservations WHERE archived = 3;');	$countOldeleted = $q->hits();
		new Q('DELETE FROM archive_attendees WHERE archived = 3;');	
		new Q('DELETE FROM archive_att_visitors WHERE archived = 3;');	
		new Q('DELETE FROM archive_performances WHERE archived = 3;');	
		new Q('DELETE FROM archive_payments WHERE archived = 3;');	
		new Q('DELETE FROM archive_resaparts WHERE archived = 3;');
	//
	
	
		$j = new C_date();
	if(!crontest) echo $pad.'Archive clean-up deleted reservations finished ('.$j->getTimeString().')'.chr(10);	
	
	
	// STEP 1.8: Optimize attendees tables
	//		
		
set_time_limit(703); // take a breath

		new Q('OPTIMIZE TABLE archive_attendees, archive_att_visitors, archive_performances, archive_payments, archive_resaparts;');
		
		$j = new C_date();
	if(!crontest) echo $pad.'Archive Optimize attendees tables finished ('.$j->getTimeString().')'.chr(10);
	
	
	// STEP 1.9: Optimize reservations tables
	//		

set_time_limit(704); // take a breath		

		new Q('OPTIMIZE TABLE archive_reservations;');
		
		$j = new C_date();
	if(!crontest) echo $pad.'Archive Optimize reservations tables finished ('.$j->getTimeString().')'.chr(10);	
		
		
		
		

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  		
// STEP 3: Drop Connections monitoring
//	
set_time_limit(465); // take a breath


	$connPivot = clone($now);
		$connweeks = 2;
	$connPivot->mIncrement(-$connweeks); // place connections drop pivot date
	$connPivot = $connPivot->getMDNstmp();
	
	$q = new Q('DELETE FROM archive_connections WHERE watchdog < '.$connPivot.';'); $countCNXdrop = $q->hits();
		
	new Q('OPTIMIZE TABLE archive_connections;');
		
		$j = new C_date();
	if(!crontest) echo $pad.'Archive_connections clean-up finished ('.$j->getTimeString().')'.chr(10);	
	
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// STEP 4: Drop SMS and emails from tables when they are older than given term
//		


set_time_limit(466); // take a breath

	$smsPivot = clone($now);
		$commweeks = $smsweeks = $mailsweeks = 36; // which is 36 months
	$smsPivot->mIncrement(-$smsweeks); // place SMS drop pivot date
	$smsPivotStmp = $smsPivot->getMDNstmp();
	
	$q = new Q('DELETE FROM sms WHERE sendStamp < '.$smsPivotStmp.';'); $countSMSdrop = $q->hits();
	$q = new Q('DELETE FROM emails WHERE sendStamp < '.$smsPivotStmp.';'); $countEMAILSdrop = $q->hits();
	
		$q = new Q('SELECT comm_toggles.id as id FROM comm_toggles JOIN archive_reservations ON  comm_toggles.reservationId = archive_reservations.id WHERE cueIn < '.$smsPivotStmp.';'); 
		$tids = $q->ids();
	$countRESACOMdrop = 0;
	if($tids) {
		new Q('DELETE FROM comm_toggles WHERE id IN ('.$tids.');');
		$countRESACOMdrop = $q->hits();
	}
	
	new Q('OPTIMIZE TABLE sms, emails, comm_toggles;');
	
		$j = new C_date();
	if(!crontest) echo $pad.'Sms & emails clean-up finished ('.$j->getTimeString().')'.chr(10);	
	
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  		
// STEP 5: Drop Exceptions from Exceptions table when they are older than 1 month
//		
set_time_limit(467); // take a breath


	$excptPivot = clone($now);
		$excepweeks = 1;
	$excptPivot->mIncrement(-$excepweeks); // place Exceptions drop pivot date 4 months from now
	$excptPivotStmp = $excptPivot->getMDNstmp();
	$excptPivotDate = Date('Y-m-d H:i:s',$excptPivotStmp); 
	
	
	$q = new Q('DELETE FROM exceptions WHERE created < "'.$excptPivotDate.'";'); $countEXCPdrop = $q->hits();
	$q = new Q('DELETE FROM exceptions_smartapp WHERE created < "'.$excptPivotDate.'";'); $countEXCPdrop += $q->hits();
	
	new Q('OPTIMIZE TABLE exceptions, exceptions_smartapp;');


		$j = new C_date();
	if(!crontest) echo $pad.'Exceptions clean-up finished ('.$j->getTimeString().')'.chr(10);	
	
	
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  		
// STEP 6: Drop Exceptionnal hourlies and their unique hourlyuser when older than 1 year
//	
set_time_limit(468); // take a breath


	$exchPivot = clone($now);
		$hourlyweeks = 12;
	$exchPivot->mIncrement(-$hourlyweeks); // months increment
	$exchPivot = $exchPivot->getMDNstmp();
	
	// select only exceptionnal hourlies and their coresponding hourlyuser data
	$q1 = new Q('SELECT DISTINCT hourlyId AS id FROM hourliesusers JOIN hourlies ON hourlies.id = hourliesusers.hourlyId WHERE periodicity = 0 AND dayIn < '.$exchPivot.';');
	$hlIds = $q1->ids();
	
	$countExcHrlDrop = 0;
	if($hlIds) {
			$q = new Q('DELETE FROM shadows WHERE groupId IN ('.$hlIds.');');
			$q = new Q('DELETE FROM timeboxes WHERE groupId IN ('.$hlIds.');');
			$q = new Q('DELETE FROM hourlies WHERE id IN ('.$hlIds.');');
		
		$q = new Q('DELETE FROM hourliesusers WHERE hourlyId IN ('.$hlIds.');'); $countExcHrlDrop = $q->hits();
		
	}
	new Q('OPTIMIZE TABLE shadows, timeboxes, hourlies, hourliesusers;');
	
	

		$j = new C_date();
	if(!crontest) echo $pad.'Hourlies clean-up finished ('.$j->getTimeString().')'.chr(10);	
	



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  		
// STEP 7: Drop chats that are older than 4 years old
//	

set_time_limit(469); // take a breath

	$chatweeks = 48;
	$chatPivot = clone($now);
	$chatPivot->mIncrement(-$chatweeks); // months increment
	$chatPivot = $chatPivot->getMDNstmp();
	
	// select only exceptionnal hourlies and their coresponding hourlyuser data
	$q1 = new Q('SELECT id from archive_chat_threads where created < FROM_UNIXTIME('.$chatPivot.');'); // chats that are in archives are not live anymore and so they can be removed
	$chids = $q1->ids();
	
	
	$countChatsDrop = 0;
	if($chids) {
		
			$q = new Q('DELETE FROM archive_chat_visirefs WHERE groupId IN ('.$chids.');');
			$q = new Q('DELETE FROM archive_chat_participants WHERE groupId IN ('.$chids.');');
			$q = new Q('DELETE FROM archive_chat_phylacteries WHERE groupId IN ('.$chids.');');
		
		$q = new Q('DELETE FROM archive_chat_threads WHERE id IN ('.$chids.');'); $countChatsDrop = $q->hits();
		
	}
	$q = new Q('OPTIMIZE TABLE chat_participants, chat_phylacteries, chat_threads, chat_visirefs;');
	$q = new Q('OPTIMIZE TABLE archive_chat_participants, archive_chat_phylacteries, archive_chat_threads, archive_chat_visirefs;');
	

		$j = new C_date();
	if(!crontest) echo $pad.'Chats clean-up finished ('.$j->getTimeString().')'.chr(10);	
	




		$j = new C_date();
	if(!crontest) echo $pad.'Counting finished ('.$j->getTimeString().')'.chr(10);	
	
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// STEP Y: OPTIMIZE other tables
//

set_time_limit(670); // take a breath

	$q = new Q('OPTIMIZE TABLE resources, groups, logins, accesskeys, connections;');
	$q = new Q('OPTIMIZE TABLE exceptions, files, hourlies, shadows, details, timeboxes, timeboxings, hourliesusers, guidelines, custom_css;');

	$q = new Q('OPTIMIZE TABLE note_addressees, note_details, note_visirefs;');
	$q = new Q('OPTIMIZE TABLE task_assignees, task_descriptions, task_visirefs;');

	$q = new Q('OPTIMIZE TABLE visitors, stat_lastnames, stat_genders;');
	$q = new Q('OPTIMIZE TABLE synchro_ccss, synchro_reservations,  synchro_resources,  synchro_visitors;');



		$j = new C_date();
	if(!crontest) echo $pad.'Miscellaneous optimize tables done ('.$j->getTimeString().')'.chr(10);	
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  	
// STEP Z: Global counters
//		
	$q = new Q('SELECT COUNT(1) as c FROM groups;'); $cAccounts = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM logins;'); $cLogins = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM visitors;'); $cVisitors = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM reservations;'); $cResas = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM archive_reservations;'); $caResas = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM sms;'); $cSMS = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM workcodes;'); $cWorkcodes = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM timeboxings;'); $cTimeboxing = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM note_details;'); $cNotes = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM task_descriptions;'); $cTasks = $q->c();
	$q = new Q('SELECT COUNT(1) as c FROM chat_threads;'); $cChats = $q->c(); // number of live chats
	$q = new Q('SELECT COUNT(1) as c FROM payments;'); $cPayments = $q->c(); // number of live chats
	
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// Update some SANDBOX accounts
//
// Inside wallets that are SANDBOXES, we want appointments to stay in sight around the present.
// So, what we do, is every week push all the appointments by one week to the future.
// 

$q1 = new Q('select distinct accesskeys.accountId as id from accesskeys -- this selects only accounts in the given wallets ( identified by its loginid )
					where accesskeys.groupId IN (11707,9085,25531) -- which is a login id (11707 = Alisson from Campfire, 9085 = Bspo dev, 25531 = Tyler Durden )
				; -- /crons/weekly.php
			');
$sbaids = $q1->ids(list_as_string); // under an SQL string format

$qSanbox = new Q('update reservations set cueIn = cueIn + 604800, cueOut = cueOut + 604800 where reservations.groupId in ('.$sbaids.'); -- /crons/weekly.php');
	$qSanboxHits = $qSanbox->hits();
	
	if(!crontest) echo $pad.'Updation of SandBox wallets ('.$qSanboxHits.' reservations were moved one week ahead)'.chr(10);	
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  
// STEP X: Report
//
	
	
	$htmlOut .= mail_h2('1. Global system figures');
		$cAccounts 	= mail_p($cAccounts.' accounts');
		$cLogins 	= mail_p($cLogins.' logins');
		$cVisitors 	= mail_p($cVisitors.' visitors');
		$cResas 	= mail_p($cResas.' resas in current table');
		$caResas 	= mail_p($caResas.' resas archived');
		$cSMS 		= mail_p($cSMS.' SMSs');
		$cWorkcodes = mail_p($cWorkcodes.' workcodes');
		$cTimeboxing = mail_p($cTimeboxing.' time boxings');
		$cNotes 	= mail_p($cNotes.' notes');
		$cTasks 	= mail_p($cTasks.' tasks');
		$cChats 	= mail_p($cChats.' chats');
		$cPayments 	= mail_p($cPayments.' payments');
	$htmlOut.= mail_indent($cAccounts.$cLogins.$cVisitors.$cResas.$caResas.$cSMS.$cWorkcodes.$cTimeboxing.$cNotes.$cTasks.$cChats.$cPayments);
	
	
	
	$htmlOut .= mail_h2('2. Archiving');
		$processTimeDate 	= mail_p('Archiving cron execution time = '.$now->getDateTimeString());
		$pivotDate 		= mail_p('New archive pivot date = '.$archivePivot->getDateTimeString());
		$countResa 		= mail_p('Archived number of reservations = '.$countResa);
		$countAttendees = mail_p('Archived number of attendees = '.$countAttendees);
		$countPerfs 	= mail_p('Archived number of performances = '.$countPerfs);
		$countPayments 	= mail_p('Archived number of payments = '.$countPayments);
		$countParts 	= mail_p('Archived number of resaparts = '.$countParts);
	$archiving = $processTimeDate.$pivotDate.$countResa.$countAttendees.$countParts.$countPerfs.$countPayments;
	$htmlOut.= mail_indent($archiving);

	
	$htmlOut .= mail_h2('3. Dropping'); 	
		$countOldeleted 	= mail_p('Dropped number of old deleted archived resas = '.$countOldeleted.' (expire after '.$delappweeks.' weeks)');
		$countSMSdrop 		= mail_p('Dropped number of SMS = '.$countSMSdrop.' (expire after '.$smsweeks.' weeks)');
		$countEMAILSdrop 	= mail_p('Dropped number of EMAILs = '.$countEMAILSdrop.' (expire after '.$mailsweeks.' weeks)');
		$countRCOMdrop 		= mail_p('Dropped number of comm_toggles = '.$countRESACOMdrop.' (expire after '.$commweeks.' weeks)');
		$countEXCPdrop 		= mail_p('Dropped number of Exceptions = '.$countEXCPdrop.' (expire after '.$excepweeks.' weeks)');
		$countCNXdrop 		= mail_p('Dropped number of Connections monitoring = '.$countCNXdrop.' (expire after '.$connweeks.' weeks)');
		$countExcHrlDrop 	= mail_p('Dropped number of Exceptionnal hourlies = '.$countExcHrlDrop.' (expire after '.$hourlyweeks.' weeks)');
		$countChatsDrop 	= mail_p('Dropped number of outdated chats = '.$countChatsDrop.' (expire after '.$chatweeks.' weeks)');
	$dropping = $countOldeleted.$countSMSdrop.$countEMAILSdrop.$countRCOMdrop.$countEXCPdrop.$countCNXdrop.$countExcHrlDrop.$countChatsDrop;
	$htmlOut.= mail_indent($dropping);
	
	
	$htmlOut .= mail_h2('4. Maintaining sandbox portofolios');
		$sandbox = mail_p('Updation of SandBox wallets ('.$qSanboxHits.' reservations were moved one week ahead)');
		$sandbox .= mail_p('Account ids: '.$sbaids.'');
		$htmlOut.= mail_indent($sandbox);
	
	
	$htmlOut .= mail_h2('5. Record');
	$o_dbAccess_logins = new C_dbAccess_logins(); 
		$o_dbAccess_logins->loadOnAccessLevel(aLevel_admin);
		$o_dbAccess_logins->loadOnId(9085); // Bernard Spoden
	
		
	$from = 'MobMinder Midnight Cron <no-reply@app07.mobminder.com>';
	$emails = Array(); $emailsDisplay = '';
	if($o_dbAccess_logins->count())
		foreach ($o_dbAccess_logins->keyed as $id => $o_dS_login)
			if($o_dS_login->email) 
				if(!in_array($o_dS_login->email,$emails)) {
					$emailsDisplay .= mail_p($o_dS_login->email);
					$emails[] = $o_dS_login->email;
				}
	$htmlOut.= mail_indent($emailsDisplay);
			
	if(crontest){
		echo '<!DOCTYPE HTML>';
		echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			echo '<head>';
		echo '<body>'.$htmlOut.'</body></html>';
		die();
	}
	else {
		if(count($emails)) {
			$o_dataCom_mail = new C_dataCom_mail();
			foreach ($emails as $email)
				$o_dataCom_mail->sendMail($title, $htmlOut, $email, $from, language_code_english);
		}
		$now = new C_date();
		echo $pad.'EXECUTION FINISHED ON:'.$now->getDateTimeString().chr(10); // this echo goes to the console ( /var/log/mobminder-crons/weekly.log )
	}

	//echo jsStream($o_dbAccess_sms->stream());
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//  		
// STEP ?: Drop devices/token that are older than 1 month old
//	
$q = new Q('delete from devices where (changerId <> 0 and changed < now() - interval 30 DAY) or (changerid = 0 and created < now() - interval 30 DAY);');


?>