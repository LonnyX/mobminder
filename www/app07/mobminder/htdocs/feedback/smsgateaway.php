<?php

$systemLog = 'smsgateaway feedback'; // used in dbio.php to identify the working process/user

	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/smsgateaway.php';
	
$stream = @$_REQUEST['stream'];
$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if($web) $stream = 'This is a test stream: <data>#C_dS_sms
20028767|601|5322562|0|0|2020-01-14 10:58:02|0|800|2020-01-14 10:58:02
20028768|601|5322561|0|0|2020-01-14 11:07:05|0|110|2020-01-14 11:07:05
20028769|601|5322560|0|0|2020-01-14 11:08:03|0|200|2020-01-14 11:08:03
20028770|601|5322559|0|0|2020-01-14 11:09:41|0|405|2020-01-14 11:09:41
20028771|601|1111|0|0|2020-01-14 11:14:57|0|100|2020-01-14 11:14:57
20028772|601|1111|0|0|2020-01-14 11:15:31|0|100|2020-01-14 11:15:31
20028773|601|1111|0|0|2020-01-14 11:20:12|0|100|2020-01-14 11:20:12
20028774|601|1111|0|0|2020-01-14 11:21:19|0|100|2020-01-14 11:21:19
20028775|606|111|222|0|2020-01-14 11:24:15|0|100|2020-01-14 11:24:15</data>';


function smsgastatus_to_mobstatus($smsgastatus) {
	$mobstatus = sms_nosms; // see (*mob33*)
	switch($smsgastatus) {
		case sms_status_created:	$mobstatus = sms_handled;	break;	// set by gateaway at queue input
		case sms_status_expired:	$mobstatus = sms_discarded;	break; 	// lifetime felt down to 0, status set by gateaway
		case sms_status_satellite:	$mobstatus = sms_handled;	break;	// set by gateaway at satellite request
		case sms_status_operator:	$mobstatus = sms_handled;	break;	// provided by satellite at handover to operator (opid is known at that moment)
		case sms_status_pending:	$mobstatus = sms_pending;	break; 	// provided by satellite
		case sms_status_delivered:	$mobstatus = sms_delivered;	break;	// provided by satellite
		case sms_status_error:		$mobstatus = sms_error;		break; 	// provided by satellite
		case sms_status_dead:		$mobstatus = sms_dead_numb;	break; 	// hlr lookup revealed number not in service anymore (or was never in service)
		case sms_status_discarded:	$mobstatus = sms_discarded;	break; 	// 
	}
	return $mobstatus;
}



$s = C_smsgateaway::stripstatusdata($stream); // an Array of C_smsstatus instances as per definition in smsgateaway.php


$in = count($s); // incoming status items
$up = 0; // updated status items
foreach($s as $dS_smsstatus) {
	
	if($web) $dS_smsstatus->display();
	$dS_sms = new C_dS_sms($dS_smsstatus->correlator);
	if(!$dS_sms->id) continue; // the correlator does not correspond to an SMS in the mobminder.sms DB table
	
	$dS_sms->r2status = smsgastatus_to_mobstatus($dS_smsstatus->status);
	
		$when = new C_date($dS_smsstatus->when);
	$dS_sms->r2statusChangeStamp = $when->getTstmp(); // our DB uses absolute Unix time 
	
	$dS_sms->r2correlator = $dS_smsstatus->id; // our DB uses absolute Unix time 
	
	$up++;
	$dS_sms->dSsave();
	if($web) echo $up.'<br/>';
}


echo 'OK - '.$in.' incoming items, '.$up.' updated items';

?>