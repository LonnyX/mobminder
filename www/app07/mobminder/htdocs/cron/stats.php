#!/usr/bin/php5 -q
<?php

///////////////////////////////////////////////////////////////////////////////////////
//
//	S T A T I S T I C S     P R E -  C A L C U L A T I O N   C R O N 
//
// 	manual usage: http://127.0.0.1/cron/stats.php?fkt=2015-12-27&xw=0
// 	manual usage: localhost/app07/mobminder/htdocs/cron/stats.php?fkt=2020-11-01&xw=0&aid=3038
// 
//  cron: must run every week on sunday after the archiving cron.
//  in manual mode, the script echoes html to the client. It can be run many times, older data is dumped and replaced by new countings
// 

ini_set('memory_limit', '2048M');
set_time_limit(300);	

if(@$_GET['fkt']) $fakeTime = $_GET['fkt']; else $fakeTime = false; // specifying faketime indicates a manual call of the script
if(@$_GET['xw']) $xweeks = $_GET['xw']; // optional: specifies the number of weeks that this script should cover
if(@$_GET['aid']) $accId = $_GET['aid']; else $accId = false; // optional: limits calculation to the given account id (easy and faster for testing purpose)

$systemLog = 'stats cron'; // include this line before requiring dbio.php
$html = false;

function mem($msg) { $mem = (intval(memory_get_usage()/1024))/1000; echo '<br/>'.$msg.':'.$mem.' Mb'; }
function title($msg) { global $html, $fakeTime; if(!$fakeTime) return; $html->pushHTML('<h1>'.$msg.'</h1>'); }
function error($msg) { global $html, $fakeTime; if(!$fakeTime) die($msg); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function section($msg) { global $html, $fakeTime; if(!$fakeTime) return; $html->pushHTML('<h2>'.$msg.'</h2>'); }
function notice($msg) { global $html, $fakeTime; if(!$fakeTime) return; $html->pushHTML('<p>'.$msg.'</p>'); }
function warning($msg) { global $html, $fakeTime; if(!$fakeTime) return; $html->pushHTML('<p style="color:orange; font-weight:bold;">'.$msg.'</p>'); }
function mhtml($msg) { global $html, $fakeTime; if(!$fakeTime) return; $html->pushHTML($msg); }
function micronos($inout, $msg='') { 
	global $html, $fakeTime; if(!$fakeTime) return;
	static $cuein = 0, $cueout = 0; 
	switch($inout) {	
		case 'in': $cuein = microtime(true); break; 
		case 'out': $cueout = microtime(true); 
			$cuedelta = (($cueout-$cuein)*1000)|0;
			$html->pushHTML('<h4>'.$msg.' '.$cuedelta.' msec'.'</h4>');
			break;
	}
}
function macronos($inout, $msg='') { 
	global $html, $fakeTime; if(!$fakeTime) return;
	static $cuein = 0, $cueout = 0; 
	switch($inout) {	
		case 'in': $cuein = microtime(true); break; 
		case 'out': $cueout = microtime(true); 
			$cuedelta = (($cueout-$cuein)*1000)|0;
			$html->pushHTML('<h4 style="font-size:120%;">'.$msg.' '.($cuedelta/1000).' seconds'.'</h4>');
			break;
	}
}


macronos('in');

	
function drop() { 
	global $html, $o_dataLink_dateExecution, $fakeTime; 
	if($fakeTime) return $html->dropPage();
	echo 'STATS COMPLETED ON:'.$o_dataLink_dateExecution->getDateTimeString().chr(10); // goes to the cron log
}

if($fakeTime) {
	require '../classes/language.php';
	require '../../lib_mobphp/chtml.php';
	require '../../lib_mobphp/dbio.php';
}
else{
	require '/var/www/mobminder/htdocs/classes/language.php'; // when running in production
	require '/var/www/mobminder/lib_mobphp/chtml.php'; // when running in production
	require '/var/www/mobminder/lib_mobphp/dbio.php'; // when running in production
}

if($fakeTime) {
	$html = new C_html();
	$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
	$html->pushMeta('Content-Style-Type'	, 'text/css');
	$html->pushMeta('Content-Script-Type'	, 'text/javascript');
	$html->pushMeta('pragma'				, 'no-cache');
	$html->pushLink('basics.css'			, 'stylesheet'	, 'text/css');
		$title = 'Mobminder statistics generator';
	$html->pageTitle($title);
	title($title);
	notice('<b>Executing in manual mode</b>');
	if($accId) notice('<b>Only this account: '.$accId.'</b>');
}

///////////////////////////////////////////////////////////////////////////////////////
//
//	S T A T    T I M E    W I N D O W
//
//
	title('Time Window');
	micronos('in');
		
	if($fakeTime)
		$o_dataLink_date = new C_date($fakeTime); // use simulation time from the _GET
	else
		$o_dataLink_date = new C_date(); // defaults to current date and time
	
	$o_dataLink_dateExecution = clone($o_dataLink_date);
	$o_dataLink_dateSunday = clone($o_dataLink_date);
	$o_dataLink_dateIn = clone($o_dataLink_date);
	$o_dataLink_dateOut = clone($o_dataLink_date);
	
	$o_dataLink_dateIn->setToMidnight()->wIncrement(-1);
	$o_dataLink_dateOut->setToMidnight()->wIncrement(0);
	
	$stmpIn = $o_dataLink_dateIn->getMDNstmp();
	$stmpOut = $o_dataLink_dateOut->getMDNstmp();
	$sunday = $o_dataLink_dateSunday->setToMidnight()->getMDNstmp();
	
	$archive_pivot_stamp = C_dS_system::backupPivotStamp();
	$archive = $stmpOut <= $archive_pivot_stamp ? 'archive_' : ''; // assuming the backup is already done for this sunday

	$o_dS_system = new C_dS_system();
	if($o_dS_system->youngestStats < $sunday) { $o_dS_system->youngestStats = $sunday; $o_dS_system->dSsave(); }
	
	notice('Loading from tables: '.($archive==''?'Current':'Archive'));
	notice('date In: '.$o_dataLink_dateIn->getDateTimeString());
	notice('date Out: '.$o_dataLink_dateOut->getDateTimeString());
	

	function resaIds($stmpIn, $stmpOut, $archive, $case, $apps = false, $accId = false) { // returns the list of reservations ids that belong to an accounting period and case
		
		$in = Date('Y-m-d',$stmpIn).' 00:00:00'; 
		$out = Date('Y-m-d',$stmpOut).' 00:00:00'; 
		$r = $archive.'reservations';
		$v = $archive.'att_visitors';
		
		$visitors = $v.' ON '.$v.'.groupId = '.$r.'.id';
		$notDeleted = 'deletorId = 0 AND ';
		
		switch($case) {
			case 'created': $catch = $notDeleted.'created < "'.$out.'" AND created >= "'.$in.'"'; break;
			case 'changed': $catch = $notDeleted.'changed < "'.$out.'" AND changed >= "'.$in.'"'; break;
			case 'corchgd': $catch = $notDeleted.'((created < "'.$out.'" AND created >= "'.$in.'") OR (changed < "'.$out.'" AND changed >= "'.$in.'"))'; break;
			case 'deleted': $catch = 'deleted < "'.$out.'" AND deleted >= "'.$in.'"'; break;
			case 'actuals': $catch = $notDeleted.'cueIn >= '.$stmpIn.' AND cueIn < '.$stmpOut; break;
			case 'offdays': 
				$in = new C_date($stmpIn); $offCues = Array();
				for($in->setToMidnight(); $in->getTstmp() <= $stmpOut; $in->dIncrement(1))  $offCues[] = $in->getTstmp();
				$offCues = implode(',',$offCues); 
				$catch = 'deletorId = 0 AND '.' cueIn IN('.$offCues.') AND cueOut IN('.$offCues.')'; 
				break;
		}
		
		if($accId) $catch .= ' AND '.$r.'.groupId = '.$accId;
		
		if($apps == true) // right join on visitor attendees table
			$SQL = 'SELECT DISTINCT '.$r.'.id, '.$r.'.groupId FROM '.$r.' RIGHT JOIN '.$visitors.' WHERE '.$catch.';';
		
		else // left join excluding on visitor attendees table
			$SQL = 'SELECT '.$r.'.id, '.$r.'.groupId FROM '.$r.' LEFT JOIN '.$visitors.' WHERE '.$v.'.groupId IS NULL AND '.$catch.';';
		
		
		$result = C_dbIO::q($SQL,'stats.php::resaIds()');
		$c = 0; $ids = Array();
		while($row = $result->fetch_array()) { $c++; $ids[] = $row['id']; }
		$result->close();
		
		$pad = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		notice($pad.'Loading reservations... <b>'.($apps?'Apps':'Evnt').'</b>, Case:<b>'.$case.'</b>'.', Total loaded:<b>'.$c.'</b> ');

		if($c) return '('.implode(',',$ids).')';
			else return false;
	}
	
	// now pre-fetch all reservations ids needed for accounting
	
	$createdResas = resaIds($stmpIn, $stmpOut, $archive, 'created', false, $accId); $createdApps = resaIds($stmpIn, $stmpOut, $archive, 'created', true, $accId);
	$changedResas = resaIds($stmpIn, $stmpOut, $archive, 'changed', false, $accId); $changedApps = resaIds($stmpIn, $stmpOut, $archive, 'changed', true, $accId);
	$corchgdResas = resaIds($stmpIn, $stmpOut, $archive, 'corchgd', false, $accId); $corchgdApps = resaIds($stmpIn, $stmpOut, $archive, 'corchgd', true, $accId);
	$deletedResas = resaIds($stmpIn, $stmpOut, $archive, 'deleted', false, $accId); $deletedApps = resaIds($stmpIn, $stmpOut, $archive, 'deleted', true, $accId);
	$actualsResas = resaIds($stmpIn, $stmpOut, $archive, 'actuals', false, $accId); $actualsApps = resaIds($stmpIn, $stmpOut, $archive, 'actuals', true, $accId);
	$offdaysResas = resaIds($stmpIn, $stmpOut, $archive, 'offdays', false, $accId); 
	
	
	micronos('out', 'Reservations identified in');
	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 D E F I N I N G    M O N I T O R I N G    M A T R I X 
//
//
if(true) {
		title('Building Monitoring Matrix');
		micronos('in');
		
		/////////////////////////////////////////////////////////////////////////
		//
		$groups = new C_dbAccess_groups(); if($accId) $groups->loadOnId($accId); else $groups->loadAll();
		notice('accounts count: '.$groups->count());
		$grpCnt = Array();
		foreach($groups->keyed as $groupId => $o_dS_group) {
			$xmon = $grpCnt[$groupId] = new C_dS_xmon_account(0, $groupId); 
			$xmon->sunday = $sunday;
		}
		unset($groups);
		
		/////////////////////////////////////////////////////////////////////////
		//
		$resources 	= new C_dbAccess_resources(); if($accId) $resources->loadOnGroup($accId); else $resources->loadAll();
		notice('resources count: '.$resources->count());
		$actuals = Array();
		foreach($resources->keyed as $rscId => $o_dS_resc) {
			$xmon = $actuals[$rscId] = new C_dS_xmon_actual(0,$o_dS_resc->groupId); 
			$xmon->sunday = $sunday;
			$xmon->resourceId = $rscId;
		}
		unset($resources);
		
		
		/////////////////////////////////////////////////////////////////////////
		//
		$logins 	= new C_dbAccess_logins(); if($accId) $logins->loadOnGroup($accId); else $logins->loadAll();
		notice('logins count: '.$logins->count());
		$actions = Array(); // like $actions[$loginId][$accountId] = $o_dS_xmon_action
		foreach($logins->keyed as $logId => $o_dS_login) $actions[$logId] = Array();
		
		foreach($logins->keyed as $logId => $o_dS_login) { // we monitor only for existing logins (some logins may have been deleted)
			$o_dbAccess_accesskey = new C_dbAccess_accesskey($logId);
			foreach($o_dbAccess_accesskey->keyed as $keyId => $o_dS_accesskey) {
				$xmon = $actions[$logId][$o_dS_accesskey->accountId] = new C_dS_xmon_action(0, $o_dS_accesskey->accountId);
				$xmon->sunday = $sunday;
				$xmon->loginId = $logId;
			}
		}
		unset($logins);
		
		
		/////////////////////////////////////////////////////////////////////////
		//
		$ccss = Array();
		$ccsses = new C_dbAccess_customCss(); if($accId) $ccsses->loadOnGroup($accId); else $ccsses->loadAll();
		foreach($ccsses->keyed as $ccssId => $o_dS_ccss) {
			$xmon = $ccss[$ccssId] = new C_dS_xmon_ccss(0,$o_dS_ccss->groupId); 
			$xmon->sunday = $sunday;
			$xmon->ccssId = $ccssId;
		}
		unset($ccsses);
		
		
		/////////////////////////////////////////////////////////////////////////
		//
		$perfs = Array();
		$workcodes = new C_dbAccess_workcodes(); if($accId) $workcodes->loadOnGroup($accId); else $workcodes->loadAll();
		foreach($workcodes->keyed as $wkcId => $o_dS) {
			$xmon = $perfs[$wkcId] = new C_dS_xmon_perfs(0,$o_dS->groupId); 
			$xmon->sunday = $sunday;
			$xmon->workCodeId = $wkcId;
		}
		unset($workcodes);
		
		
		/////////////////////////////////////////////////////////////////////////
		//
		$templates = Array();
		$smstempl 	= new C_dbAccess_smsTemplates(); if($accId) $smstempl->loadOnGroup($accId); else $smstempl->loadAll();
		foreach($smstempl->keyed as $tmplId => $o_dS_smsTempl) {
			$xmon = $templates[$tmplId] = new C_dS_xmon_sms(0,$o_dS_smsTempl->groupId); 
			$xmon->sunday = $sunday;
			$xmon->templateId = $tmplId;
		}
		unset($smstempl);
		
		micronos('out', 'Monitoring Matrix built in');
}		

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 X M O N    A C C O U N T S
//
//
		title('Accounts');
		micronos('in');
		$only1account = ''; if($accId) $only1account = ' AND groupId = '.$accId.' ';  
		
set_time_limit(301);				
if(true) {		
		section('1: Counting accounts data');
		
		
		// counting visitors with mobile
		//
		$vMobile = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM visitors WHERE mobile <> "" '.$only1account.' GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::visitors mobiles');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->visiMobile+=$row['counter']; $vMobile += $row['counter']; }
		
		// counting visitors males
		//
		$vMales = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM visitors WHERE gender = 1 '.$only1account.' GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::male visitors');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->visiMales+=$row['counter']; $vMales += $row['counter']; }
		
		// counting visitors females
		//
		$vFemales = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM visitors WHERE gender = 0 '.$only1account.' GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::female visitors');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->visiFemales+=$row['counter']; $vFemales += $row['counter']; }
		
		// counting visitors any
		//
		$vCount = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM visitors GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::visitors total');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->visiCount+=$row['counter']; $vCount += $row['counter']; }
		
		// counting logins any
		//
		$grpLogins = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM logins GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::logins total');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->loginsCount+=$row['counter']; $grpLogins += $row['counter']; }
		
		// counting resources any
		//
		$grpResources = 0;
		$SQL = 'SELECT groupId, count(1) as counter FROM resources GROUP BY groupId;';
		$result = C_dbIO::q($SQL, 'stats.php::resources total');
		while($row = $result->fetch_array())
			if(!isset($grpCnt[$row['groupId']])) continue;
				else { $grpCnt[$row['groupId']]->loginsCount+=$row['counter']; $grpResources += $row['counter']; }
				
				
		
		
		notice('visitors count: '.$vCount);
		notice('visitors with mobile count: '.$vMobile);
		notice('visitors males: '.$vMales);
		notice('visitors females: '.$vFemales);
		
		micronos('out', 'Accounts stats collected in');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 X M O N    S M S
//
//
set_time_limit(302);
if(true) {
		title('SMS traffic - by template');
		micronos('in');
	
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	COUNTING SMS
		//
		section('1: Loading and counting SMS');
		$sms = new C_dbAccess_sms(); $sms->loadOnSendStamp($stmpIn, $stmpOut);
		$r1 = 0; $r2 = 0;
		if($sms->count()) foreach($sms->keyed as $smsId => $o_dS_sms){
			$tmplId = $o_dS_sms->templateId;
			if(!isset($templates[$tmplId])) continue; else $xmon = $templates[$tmplId];
			
				if($o_dS_sms->correlator) $xmon->r1handled++;
				if($o_dS_sms->status==sms_delivered) {	$xmon->r1delivered++; $r1++; }
				if($o_dS_sms->status==sms_pending) 		$xmon->r1pending++;
				if($o_dS_sms->status==sms_discarded) 	$xmon->r1error++;
				if($o_dS_sms->status==sms_error) 		$xmon->r1error++;
				if($o_dS_sms->status==sms_dead_numb) 		$xmon->r1error++;
				if($o_dS_sms->status==sms_iso) 			$xmon->r1error++;
				if($o_dS_sms->status<=sms_handled&&$o_dS_sms->correlator) 		$xmon->r1nofeedback++;
				
			if($o_dS_sms->r2correlator) $xmon->r2handled++;
			if($o_dS_sms->r2status==sms_delivered) {$xmon->r2delivered++; $r2++; }
			if($o_dS_sms->r2status==sms_pending) 	$xmon->r2pending++;
			if($o_dS_sms->r2status==sms_discarded) 	$xmon->r2error++;
			if($o_dS_sms->r2status==sms_error) 		$xmon->r2error++;
			if($o_dS_sms->r2status==sms_dead_numb) 	$xmon->r2error++;
			if($o_dS_sms->r2status==sms_iso) 		$xmon->r2error++;
			if($o_dS_sms->r2status<=sms_handled&&$o_dS_sms->r2correlator) 	$xmon->r2nofeedback++;
		}
	
		notice('SMS count: '.$sms->count());
		notice('SMS delivered r1: '.$r1);
		notice('SMS delivered r2: '.$r2);
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	SAVING DATA
		//
		micronos('out', 'SMS stats collected in');
		unset($sms);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 X M O N    A C T U A L S
//
//
set_time_limit(303);
if(true) {
	
		title('Actuals - by resource');
		micronos('in');
		
		function byRescTime($resas, $archive, $counter) {
			
			if($resas == false) return 0;
			
			$a = $archive.'attendees';
			$r = $archive.'reservations';
			
			$SQL = 'SELECT resourceId, SUM('.$r.'.cueOut-'.$r.'.cueIn) AS totaltime FROM '.$a.' JOIN '.$r.' ON '.$r.'.id = '.$a.'.groupId WHERE '.$r.'.id IN '.$resas.' GROUP BY resourceId;'; 

			global $actuals;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::byRescTime()');
			while($row = $result->fetch_array()) {
				$resourceId = $row['resourceId'];
				$totaltime = $row['totaltime']/60; // counter is recorded in minutes
				if(!isset($actuals[$resourceId])) continue; // this resource has been removed
				$actuals[$resourceId]->{$counter} += $totaltime;
				$total += $totaltime;
			}
			return $total;
		}	
		function byRescCount($resas, $archive, $counter) {
			
			if($resas == false) return 0;
			$a = $archive.'attendees';
			
			$SQL = 'SELECT resourceId, count(1) as amount FROM '.$a.' WHERE groupId IN '.$resas.' GROUP BY resourceId;'; 

			global $actuals;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::byRescCount()');
			while($row = $result->fetch_array()) {
				$resourceId = $row['resourceId'];
				$amount = $row['amount'];
				if(!isset($actuals[$resourceId])) continue; // this resource has been removed
				$actuals[$resourceId]->{$counter} += $amount;
				$total += $amount;
			}
			return $total;
		}	
		function byLoginCount($resas, $archive, $loginIdField, $counter) {
			
			if($resas == false) return 0;
			$r = $archive.'reservations';
			
			$SQL = 'SELECT '.$loginIdField.' as loginId, groupId, count(1) as amount FROM '.$r.' WHERE id IN '.$resas.' GROUP BY loginId, groupId;';//.$loginId.';'; 
			
			global $actions;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::byLoginCount()');
			while($row = $result->fetch_array()) {
				$loginId = $row['loginId'];
				$accountId = $row['groupId'];
				$amount = $row['amount'];
				if(!isset($actions[$loginId])) continue;
				if(!isset($actions[$loginId][$accountId])) continue;
				$actions[$loginId][$accountId]->{$counter} += $amount;
				$total += $amount;
			}
			return $total;
		}		
		function perfsCount($resas, $archive, $counter) {

			if($resas == false) return 0;
			$p = $archive.'performances';
			$SQL = 'SELECT workCodeId, count(1) as amount FROM '.$p.' WHERE groupId IN '.$resas.' GROUP BY workCodeId;'; 
			
			global $perfs;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::perfsCount()');
			while($row = $result->fetch_array()) {
				$workCodeId = $row['workCodeId'];
				$amount = $row['amount'];
				if(!isset($perfs[$workCodeId])) continue;
				$perfs[$workCodeId]->{$counter} += $amount; // $counter must be 'actual' or 'action'
				$total += $amount;
			}
			
			return $total;
		}
		function ccssCount($resas, $archive, $ccssType, $counter) {
		
			if($resas == false) return 0;
			$r = $archive.'reservations';
			$SQL = 'SELECT '.$ccssType.', count(1) as amount FROM '.$r.' WHERE id IN '.$resas.' GROUP BY '.$ccssType.';'; 

			global $ccss;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::ccssCount()');
			while($row = $result->fetch_array()) {
				$ccssId = $row[$ccssType];
				$amount = $row['amount'];
				if(!isset($ccss[$ccssId])) continue;
				$ccss[$ccssId]->{$counter} += $amount;
				$total += $amount;
			}
			return $total;
		}
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	CLEAN UP DB BULLSHIT
		//  (some synchro api users do insert bullshit in our DB, here e.g. cueOut being < to cueIn )
		//
			$a = $archive.'attendees';
			$v = $archive.'att_visitors';
			$p = $archive.'resaparts';
			$f = $archive.'performances';
			$t = 'comm_toggles';
			$r = $archive.'reservations';
			
			// first, we check that all reservations under scope have a positive cueOut - cueIn 
			$q = new Q('select id from '.$r.' where cueOut <= cueIn;'); $bad = $q->ids();
			if($bad) {
				$q = new Q('update '.$r.' set peerId = 0 where peerId in ('.$bad.') ');
				$q = new Q('delete from '.$v.' where groupId in ('.$bad.') ');
				$q = new Q('delete from '.$a.' where groupId in ('.$bad.') ');
				$q = new Q('delete from '.$p.' where groupId in ('.$bad.') ');
				$q = new Q('delete from '.$f.' where groupId in ('.$bad.') ');
				$q = new Q('delete from '.$t.' where groupId in ('.$bad.') ');
				$q = new Q('delete from '.$r.' where id in ('.$bad.') '); 
			}
		
			// now there is not reservation anymore with cueOut < cueIn, we can sum up and count time spent
			
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	LOADING RESERVATIONS
		//
		section('1: Loading reservations');
		
		$cntResa = byRescCount($actualsResas, $archive, 'resaCount'); 
		$cntApps = byRescCount($actualsApps, $archive, 'appCount'); 
		$cntOffd = byRescCount($offdaysResas, $archive, 'offdayCount');
		
		$cntAppsTime = byRescTime($actualsApps, $archive, 'appTime')/60;
		$cntResaTime = byRescTime($actualsResas, $archive, 'resaTime')/60;
		$cntOffdTime = byRescTime($offdaysResas, $archive, 'offdayTime')/60/24;
		
		$cntPerfs = perfsCount($actualsApps, $archive, 'actual');
		$cntColor = ccssCount($actualsResas, $archive, 'cssColor', 'actual');
		$cntPattn = ccssCount($actualsResas, $archive, 'cssPattern', 'actual');
			
			notice('resa count: '.$cntResa.'  or elapsed time:'.$cntResaTime.' hours');
			notice('apps count: '.$cntApps.' or elapsed time:'.$cntAppsTime.' hours');
			notice('offdays count: '.$cntOffd.' or elapsed period:'.$cntOffdTime.' days');
			notice('colors count: '.$cntColor);
			notice('patterns count: '.$cntPattn);
			notice('perfs count: '.$cntPerfs);
		
			
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	CCSS ACTUALS USED ON VIVITORS
		//
		section('2: Ccss on visitors');
		$actualsCnt = Array('color'=>0, 'pattern'=>0);
		
			// actuals
		$SQLcolor = 'SELECT cssColor, count(1) as occurences FROM visitors WHERE cssColor <> 0 '.$only1account.' GROUP BY cssColor;';
		$result = C_dbIO::q($SQLcolor,'stats.php::Ccss in visitors');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssColor']])) continue;
				else { $ccss[$row['cssColor']]->actual+=$row['occurences']; $actualsCnt['color']+=$row['occurences']; }
				
		$SQLpattern = 'SELECT cssPattern, count(1) as occurences FROM visitors WHERE cssPattern <> 0 '.$only1account.' GROUP BY cssPattern;';
		$result = C_dbIO::q($SQLpattern,'stats.php::Ccss in visitors');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssPattern']])) continue;
				else { $ccss[$row['cssPattern']]->actual+=$row['occurences']; $actualsCnt['pattern']+=$row['occurences']; }
		
		
		notice('Colors in visitors, actuals: '.$actualsCnt['color']);
		notice('Pattern in visitors, actuals: '.$actualsCnt['pattern']);
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	PUSH NEW STATS IN DB
		//
			
		micronos('out', 'Actuals stats collected in');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 X M O N    A C T I O N S 
//
//
set_time_limit(304);
if(true) {
		title('Actions');
		micronos('in');
	
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	RESERVATIONS 
		//

		section('1: Counting actions on reservations');
		
		$createdResasC = byLoginCount($createdResas, $archive, 'creatorId', 'resaNew');
		$changedResasC = byLoginCount($changedResas, $archive, 'changerId', 'resaEdit');
		$deletedResasC = byLoginCount($deletedResas, $archive, 'deletorId', 'resaDel');
		
		$pad = '<span style="width:5em; display:inline-block"></span>';
			notice('<b>Reservations</b>');
			notice('<b>'.$pad.$createdResasC.'</b> Created reservations');
			notice('<b>'.$pad.$changedResasC.'</b> Changed reservations');
			notice('<b>'.$pad.$deletedResasC.'</b> Deleted reservations');
		
		$createdAppsC = byLoginCount($createdApps, $archive, 'creatorId',  'appNew');
		$changedAppsC = byLoginCount($changedApps, $archive, 'changerId',  'appEdit');
		$deletedAppsC = byLoginCount($deletedApps, $archive, 'deletorId',  'appDel');
		
			notice('<b>Appointments</b>');
			notice('<b>'.$pad.$createdAppsC.'</b> Created apps');
			notice('<b>'.$pad.$changedAppsC.'</b> Changed apps');
			notice('<b>'.$pad.$deletedAppsC.'</b> Deleted apps');
		
		$cntPerfs = perfsCount($corchgdApps, $archive, 'action');
		$cntColor = ccssCount($corchgdApps, $archive, 'cssColor', 'action');
		$cntPattn = ccssCount($corchgdApps, $archive, 'cssPattern', 'action');
		
			notice('<b>Performances and Ccss</b>');
			notice('<b>'.$pad.$cntPerfs.'</b> Applied Perfs');
			notice('<b>'.$pad.$cntColor.'</b> Applied CcssColors');
			notice('<b>'.$pad.$cntPattn.'</b> Applied CcssPatterns');


		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	NOTES AND TASKS 
		//
		section('2: Counting actions on notes');
		
		$notes_created = new C_dbAccess_note_details(); $notes_created->loadOnAction($stmpIn, $stmpOut, 'created');
		$notes_changed = new C_dbAccess_note_details(); $notes_changed->loadOnAction($stmpIn, $stmpOut, 'changed');
		$notes_deleted = new C_dbAccess_note_details(); $notes_deleted->loadOnAction($stmpIn, $stmpOut, 'deleted');
		
		notice('Created notes:'.$notes_created->count());
		notice('Changed notes:'.$notes_changed->count());
		notice('Deleted notes:'.$notes_deleted->count());
		
		foreach($notes_created->keyed as $noteId => $o_dS_note) if($o_dS_note->creatorId) {
				$loginId = $o_dS_note->creatorId; 
				$groupId = $o_dS_note->groupId;
			if(isset($actions[$loginId][$groupId])) // the login may have been deleted (the system always keeps track of the login ids in the tracking fields)
				$actions[$loginId][$groupId]->noteNew++;
		}
		foreach($notes_changed->keyed as $noteId => $o_dS_note) if($o_dS_note->changerId) {
				$loginId = $o_dS_note->changerId; 
				$groupId = $o_dS_note->groupId;
			if(isset($actions[$loginId][$groupId]))
			$actions[$loginId][$groupId]->noteEdit++;
		}
		foreach($notes_deleted->keyed as $noteId => $o_dS_note) if($o_dS_note->deletorId) { 
				$loginId = $o_dS_note->deletorId; 
				$groupId = $o_dS_note->groupId;
			if(isset($actions[$loginId][$groupId]))
			$actions[$loginId][$groupId]->noteDel++;
		}
		
			$NOTESactions = Array('color'=>0, 'pattern'=>0);
			
			///////////////////////////////////////////////////////////////////////////////////////
			//
			//	CCSS
			//
			foreach($notes_changed->keyed as $id => $o_dS) {
				if($o_dS->cssColor) if(isset($ccss[$o_dS->cssColor])) { $ccss[$o_dS->cssColor]->action++; $NOTESactions['color']++; }
				if($o_dS->cssPattern) if(isset($ccss[$o_dS->cssPattern])) { $ccss[$o_dS->cssPattern]->action++; $NOTESactions['pattern']++; }
			}
				
			foreach($notes_created->keyed as $id => $o_dS) 
				if(!isset($notes_changed->keyed[$id])) {
				if($o_dS->cssColor) if(isset($ccss[$o_dS->cssColor])) { $ccss[$o_dS->cssColor]->action++; $NOTESactions['color']++; }
				if($o_dS->cssPattern) if(isset($ccss[$o_dS->cssPattern])) { $ccss[$o_dS->cssPattern]->action++; $NOTESactions['pattern']++; }
			}
			notice('Colors in notes, actions: '.$NOTESactions['color']);
			notice('Pattern in notes, actions: '.$NOTESactions['pattern']);
		unset($notes_created, $notes_changed, $notes_deleted);
		
		
		
		section('3: Counting actions on tasks');
		
		// created / changed
		
		$tasks_created = new C_dbAccess_task_descriptions(); $tasks_created->loadOnAction($stmpIn, $stmpOut, 'created');
		$tasks_changed = new C_dbAccess_task_descriptions(); $tasks_changed->loadOnAction($stmpIn, $stmpOut, 'changed');
		$tasks_deleted = new C_dbAccess_task_descriptions(); $tasks_deleted->loadOnAction($stmpIn, $stmpOut, 'deleted');
		
		notice('Created tasks:'.$tasks_created->count());
		notice('Changed tasks:'.$tasks_changed->count());
		notice('Deleted tasks:'.$tasks_deleted->count());
		
		
		foreach($tasks_created->keyed as $taskId => $o_dS_task) if($o_dS_task->creatorId) {
				$loginId = $o_dS_task->creatorId; 
				$groupId = $o_dS_task->groupId;
			if(isset($actions[$loginId][$groupId])) // the login may have been deleted (the system always keeps track of the login ids in the tracking fields)
				$actions[$loginId][$groupId]->taskNew++;
		}
		foreach($tasks_changed->keyed as $taskId => $o_dS_task) if($o_dS_task->changerId) {
				$loginId = $o_dS_task->changerId; 
				$groupId = $o_dS_task->groupId;
			if(isset($actions[$loginId][$groupId]))
				$actions[$loginId][$groupId]->taskEdit++;
		}
		foreach($tasks_deleted->keyed as $taskId => $o_dS_task) if($o_dS_task->deletorId) { 
				$loginId = $o_dS_task->deletorId; 
				$groupId = $o_dS_task->groupId;
			if(isset($actions[$loginId][$groupId]))
				$actions[$loginId][$groupId]->taskDel++;
		}
		
		
		$assignment_assigned = new C_dbAccess_task_assignees(); $assignment_assigned->loadOnAssigned($stmpIn, $stmpOut);
		$assignment_achieved = new C_dbAccess_task_assignees(); $assignment_achieved->loadOnAchieved($stmpIn, $stmpOut);
		
		// assignments
		
		notice('Assigned tasks:'.$assignment_assigned->count());
		notice('Achieved tasks:'.$assignment_achieved->count());	
		
		$assignedIds = $assignment_assigned->getGroupIdsList();
		$achievedIds = $assignment_achieved->getGroupIdsList();
		
		if($assignedIds) {
			$tasks_assigned = new C_dbAccess_task_descriptions(); $tasks_assigned->loadOnId($assignedIds);
			foreach($assignment_assigned->keyed as $taskId => $o_dS_assgn) if($o_dS_assgn->loginId) {
				$taskGroupId = $tasks_assigned->keyed[$o_dS_assgn->groupId]->groupId; // assignments group to task_description, task_descriptions group to accountId
				$loginId = $o_dS_assgn->loginId;
				if(!isset($actions[$loginId][$taskGroupId])) continue;
				$actions[$loginId][$taskGroupId]->taskAssigned++;	
			}
		}
		
		if($achievedIds) {
			$tasks_achieved = new C_dbAccess_task_descriptions(); $tasks_achieved->loadOnId($achievedIds);
			foreach($assignment_achieved->keyed as $taskId => $o_dS_assgn) if($o_dS_assgn->loginId) {
				$taskGroupId = $tasks_achieved->keyed[$o_dS_assgn->groupId]->groupId; // assignments group to task_description, task_descriptions group to accountId
				$loginId = $o_dS_assgn->loginId;
				if(!isset($actions[$loginId][$taskGroupId])) continue;
				$actions[$loginId][$taskGroupId]->taskAchieved++;	
			}
		}
					
			///////////////////////////////////////////////////////////////////////////////////////
			//
			//	CCSS
			//
			$TASKSactions = Array('color'=>0, 'pattern'=>0); 
			
				// actions
			foreach($tasks_changed->keyed as $id => $o_dS) {
				if($o_dS->cssColor) if(isset($ccss[$o_dS->cssColor])) { $ccss[$o_dS->cssColor]->action++; $TASKSactions['color']++; }
			}
				
			foreach($assignment_assigned->keyed as $id => $o_dS) {
				if($o_dS->cssPattern) if(isset($ccss[$o_dS->cssPattern])) { $ccss[$o_dS->cssPattern]->action++; $TASKSactions['pattern']++; }
			}
			notice('Pattern in assigned tasks, actions: '.$TASKSactions['pattern']);
			notice('Colors in tasks, actions: '.$TASKSactions['color']);
			
			
	
		unset($tasks_created, $tasks_changed, $tasks_deleted, $assignment_assigned, $tasks_deleted);
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	CCSS ACTIONS ON VISITORS
		//
		section('4: Counting actions on visitors');
		
		function visiCount($stmpIn, $stmpOut, $action) {
			
			$in = Date('Y-m-d',$stmpIn); 
			$out = Date('Y-m-d',$stmpOut); 
			$v = 'visitors';
		
			switch($action) {
				case 'created' : $catch = 'created < "'.$out.'" AND created >= "'.$in.'"'; $groupBy = '.creatorId'; $select = 'creatorId'; break;
				case 'changed' : $catch = 'changed < "'.$out.'" AND changed >= "'.$in.'"'; $groupBy = '.changerId'; $select = 'changerId'; break;
				case 'deleted' : $catch = 'deleted < "'.$out.'" AND deleted >= "'.$in.'"'; $groupBy = '.deletorId'; $select = 'deletorId'; break;
			}
			
			$SQL = 'SELECT '.$select.' AS loginId, groupId, count(1) as counter FROM '.$v.' WHERE '.$catch.' GROUP BY '.$v.$groupBy.', groupId;';

			global $actions;
			$total = 0;
			$result = C_dbIO::q($SQL, 'stats.php::visiCount()');
			while($row = $result->fetch_array()) {
				$loginId = $row['loginId'];
				$accountId = $row['groupId'];
				$counter = $row['counter'];
				if(!isset($actions[$loginId])) { continue; } // the login is deleted or the visitor is created by a visiload script (loginId = 0)
				if(!isset($actions[$loginId][$accountId])) { continue; } // thiss login has no access anymore to this account
				switch($action) {
					case 'created' : $actions[$loginId][$accountId]->visiNew+=$counter; break;
					case 'changed' : $actions[$loginId][$accountId]->visiEdit+=$counter; break;
					case 'deleted' : $actions[$loginId][$accountId]->visiMerge+=$counter; break;
				}
				$total += $counter;
			}
			return $total;
		}
		
		$visiCreated = visiCount($stmpIn, $stmpOut, 'created');
		$visiChanged = visiCount($stmpIn, $stmpOut, 'changed');
		$visiDeleted = visiCount($stmpIn, $stmpOut, 'deleted');
		
			notice('<b>'.$visiCreated.'</b> Visitors created');
			notice('<b>'.$visiChanged.'</b> Visitors changed');
			notice('<b>'.$visiDeleted.'</b> Visitors deleted');
			
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	SAVING DATA
		//
		micronos('out', 'Actions stats collected in');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 X M O N    C C S S
//
//
set_time_limit(305);
if(true) {
		title('Custom CSS - by template');
		micronos('in');
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	USED ON NOTES
		//
		section('1: Ccss in notes');
		$NotesActuals = Array('color'=>0, 'pattern'=>0);
		
			// actuals
		$SQLcolor = 'SELECT cssColor, count(1) as occurences FROM note_details WHERE cssColor <> 0 GROUP BY cssColor;';
		$result = C_dbIO::q($SQLcolor, 'stats.php::Ccss in notes');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssColor']])) continue;
				else { $ccss[$row['cssColor']]->actual+=$row['occurences']; $NotesActuals['color']+=$row['occurences']; }
				
		$SQLpattern = 'SELECT cssPattern, count(1) as occurences FROM note_details WHERE cssPattern <> 0 GROUP BY cssPattern;';
		$result = C_dbIO::q($SQLpattern, 'stats.php::Ccss in notes');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssPattern']])) continue;
				else { $ccss[$row['cssPattern']]->actual+=$row['occurences']; $NotesActuals['pattern']+=$row['occurences']; }
		
		
		notice('Colors in notes, actuals: '.$NotesActuals['color']);
		notice('Pattern in notes, actuals: '.$NotesActuals['pattern']);
		
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	USED ON TASKS
		//
		section('2: Ccss in tasks');
		$tasksActuals = Array('color'=>0, 'pattern'=>0);
		
			// actuals
		$SQLcolor = 'SELECT cssColor, count(1) as occurences FROM task_descriptions WHERE cssColor <> 0 GROUP BY cssColor;';
		$result = C_dbIO::q($SQLcolor, 'stats.php::Ccss in tasks');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssColor']])) continue;
				else { $ccss[$row['cssColor']]->actual+=$row['occurences']; $tasksActuals['color']+=$row['occurences']; }
				
		$SQLpattern = 'SELECT cssPattern, count(1) as occurences FROM task_assignees WHERE cssPattern <> 0 GROUP BY cssPattern;';
		$result = C_dbIO::q($SQLpattern, 'stats.php::Ccss in tasks');
		while($row = $result->fetch_array())
			if(!isset($ccss[$row['cssPattern']])) continue;
				else { $ccss[$row['cssPattern']]->actual+=$row['occurences']; $tasksActuals['pattern']+=$row['occurences']; }
		
		
		notice('Colors in tasks, actuals: '.$tasksActuals['color']);
		notice('Pattern in assigned tasks, actuals: '.$tasksActuals['pattern']);
	
		
		///////////////////////////////////////////////////////////////////////////////////////
		//
		//	SAVING DATA
		//
		micronos('out', 'Ccss stats collected in');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	 S A V I N G    M O N I T O R I N G    M A T R I X
//
//
set_time_limit(306);
if(true) {
		title(' Saving Monitoring Matrixes');
		micronos('in');
		
		section('1: Saving group stats');
		foreach($grpCnt as $grpId => $xmon) $xmon->statSave();
		
		section('2: Saving SMS stats');
		foreach($templates as $tmplId => $xmon) $xmon->statSave();
	
		section('3: Saving ACTUALS stats');
		foreach($actuals as $rscId => $xmon) $xmon->statSave();
		
		section('4: Saving ACTIONS stats');
		foreach($actions as $logId => $accounts) foreach($accounts as $acId => $xmon) $xmon->statSave();
		
		section('5: Saving Performances stats');
		foreach($perfs as $id => $xmon) { $xmon->statSave(); }
		
		section('6: Saving Ccss stats');
		foreach($ccss as $ccssId => $xmon) { $xmon->statSave(); }
		
		micronos('out', 'Saving done in');
}

title('END OF SCRIPT');
macronos('out', 'Total execution time');

///////////////////////////////////////////////////////////////////////////////////////
//
//	LOOP OPTIONS
//
if($fakeTime) if(isset($xweeks)) if($xweeks) {

		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

	$xweeks-=1;
	$o_dataLink_dateSunday->wIncrement(-1);
	$nextTime = $o_dataLink_dateSunday->getDateSortable();
	$xaccId = ''; if($accId) $xaccId = '&aid='.$accId;
	mhtml('<br/><a href="'.$thisScript.'?fkt='.$nextTime.'&xw='.$xweeks.$xaccId.'">Click to Start generating for sunday '.$nextTime.'</a>');
}


drop();
?>
