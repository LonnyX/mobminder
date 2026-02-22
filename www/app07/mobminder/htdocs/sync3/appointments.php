<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    U P D A T E    R E S E R V A T I O N S
//

require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';
require './lib.php';


ini_set('memory_limit', '1024M');
set_time_limit(60); // take a breath ( allows 1 more min execution )


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;
$keyview = new C_keyview($skeyId);


$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$xml 	= @$_POST['xml']; if(isset($xml)) $xml = !!$xml; else $xml = false;
$encod 	= @$_POST['encoding']; if(!isset($encod)) $encod = false; 	// encoding false leads to auto-detection of encoding
$forcedsynct = @$_POST['fsynct']; if(!isset($synct)) $synct = false; 		// encoding false leads to use of last recorded sync time

$session = session_start(); // when in web mode, msg() sends echos 

msg('Check mode: '.($check?$check:'Nope'));
msg('Xml feedback: '.($xml?$xml:'Nope'));
msg('Web render: '.($web?$web:'Nope'));


if($forcedsynct) {	
	msg('Forced sync time:'.$forcedsynct.' (expected format is YYYY-MM-DD hh:mm:ss)');
	$date = new C_date($forcedsynct); $datestring = $date->getDateTimeString();
	if(!$date->getTstmp()) abort('901','appointments update::The forced sync time has an invalid format or value');
		else $forcedsynct = $datestring;
}

$perfReport->peak('::time needed to retrieve context and posted parameters');


/////////////////////////////////////////////////////////////////////////////////
//
//   R E C O R D    C H A N G E S    C O M I N G    F R O M    R E M O T E   S I D E

// note: remote side has the priority. 
// i.e: If the same item is adapted on this server and remotely, the remotely adapted data overloads the server data.


$f = new postedfile($dS_account, $dS_login->email);
if($f->present) {
	$f->tolines($encod);
}

$upstreamed = Array(); // ids of upstreamed appointments (they should not be downstreamed because remote side has precedence
if(!$f->isempty) {
	
	$a = $f->csv_toAppointments($skeyId);
	msg('File read successfully!'); 
	$perfReport->peak('::file read');
	
	// Post processing for some fields
	//
	$a = apostprocess($a, $dS_accesskey, $dS_account);


	// Saving the data
	//
	msg('Going to save data to DB.'); 
	foreach($a as $c => $dS_r) {
		$existingId = $dS_r->id;
		if($f->hasRemoteId) {
			if(!$existingId) { // then this item is very new and we need to create a sync reference for it
				$dS_s = new C_dS_synchro_reservation(0, $accountId);
				$dS_s->skeyId = $dS_accesskey->id;
				$dS_s->remoteId = $dS_r->remoteId;
			}
			unset($dS_r->remoteId); // mandatory before saving the dataSet
			unset($dS_r->rcolor); // mandatory before saving the dataSet
			unset($dS_r->performances); // mandatory before saving the dataSet
		}
	// print_r($dS_r);
		
		$resources 		= $dS_r->resources; 	unset($dS_r->resources); 	// may be empty, see (*sy01*)
		$visitors 		= $dS_r->visitors; 		unset($dS_r->visitors); 	// may be empty
		
		if(!$resources->count()) continue; // the remote side has sent an appointment for a resource that is not synced according to setup, or the sent remoteId for the resource is unknown here
		if($check) continue; 
		$dS_r->dSsave($accountId);
		if($f->hasRemoteId) {
			if(!$existingId) {
				$dS_s->localId = $dS_r->id;
				$dS_s->dSsave($accountId);
			
			} else {
				// the items was existing yet, we need to wipe out its attributes and re-write the new ones
				new Q('DELETE FROM attendees WHERE groupId = '.$existingId.';');
				new Q('DELETE FROM att_visitors WHERE groupId = '.$existingId.';');
			}
		}
		$resources->saveAll($dS_r->id);
		$visitors->saveAll($dS_r->id);
		$upstreamed[] = $dS_r->id; 
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All reservations have been saved to the account');
	
	msg('Remote items are included in mobminder DB'); 
}
else msg('The provided file is empty, no change from remote side'); 

$perfReport->peak('::Remote items are included in mobminder DB');



/////////////////////////////////////////////////////////////////////////////////////
//
//   F E E D B A C K    C H A N G E S    F O U N D     A T     S E R V E R    S I D E


// step 01: fetch reservations

// $syncRscs = $keyview->get4sql(); // This is wrong, some resources might have no correlator in the sync setup window
$syncRscs = Array();
$rrscs = new C_dbAccess_synchro_resources($skeyId); // remote resources
if($rrscs->count()) foreach($rrscs->keyed as $dS_sync_rsc) if($dS_sync_rsc->remoteId) $syncRscs[] = $dS_sync_rsc->localId;
$syncRscs = implode(',',$syncRscs);
$resas = new C_dbAccess_reservations();
$resaIds = '';

$syncTime = $forcedsynct?$forcedsynct:Date('Y-m-d H:i:s',$dS_login->syncTresas);
	
if($syncRscs) {
	msg('synced resources are: '.$syncRscs);

			$joinOnAttendees = 'JOIN attendees ON attendees.groupId = reservations.id';
		$deleted = '(deletorId <> 0 AND deleted > "'.$syncTime.'")';
		$changed = '(changerId <> 0 AND changed > "'.$syncTime.'")';
		$created = '(created > "'.$syncTime.'")';
		$exclude = ''; if(count($upstreamed)) $exclude = ' AND reservations.id NOT IN ('.implode(',',$upstreamed).')';
	$where 	= 'WHERE reservations.groupId = '.$accountId.' AND resourceId IN ('.$syncRscs.') AND ('.$deleted.' OR '.$changed.' OR '.$created.') '.$exclude;
	$SQL 	= 'SELECT reservations.id AS id FROM reservations '.$joinOnAttendees.' '.$where.';';
	$q = new Q($SQL);

	$resaIds = $q->ids();
	$resas->loadOnId($resaIds);
	
	if($resaIds) msg('Ids of reservations changed at mobminder side: '.$q->ids());
	else msg('There is no change at mobminder side: sending back a [0;no data] file.');
	
} else {
	msg('this sync login has none resource correlator');
}



if($resas->count()) {

	// resa related attributes
	$attnd = new C_dbAccess_attendees(); if($resaIds) $attnd->loadOnGroup($resaIds, true /*do group => $attnd->grouped[$resaId] */);
	$attvs = new C_dbAccess_att_visitors(); if($resaIds) $attvs->loadOnGroup($resaIds, true /*do group => $attvs->grouped[$resaId] */);
	$perfs = new C_dbAccess_performances(); if($resaIds) $perfs->loadOnGroup($resaIds, true /*do group => $attvs->grouped[$resaId] */);
	
	// account related attributes
		$visiIds = $attvs->getResourceIdsList();
	$visis = new C_dbAccess_visitors(); if($visiIds) $visis->loadOnId($visiIds); // we load only those visitors who are concerned by this data exchange
	$rscs = new C_dbAccess_resources($dS_accesskey->accountId);
	$ccss = new C_dbAccess_customCss($dS_accesskey->accountId); $ccss->synchro_magnify($skeyId); // here we associate the custom ccss remoteId with the mobminder ccss ids
	$wrks = new C_dbAccess_workcodes($dS_accesskey->accountId);
	
	
	// here we associate the reservation remoteId with the mobminder reservation ids
	$rresas = new C_dbAccess_synchro_reservations(); if($resaIds) $rresas->loadOnLocalId($resaIds, $skeyId);
		foreach($resas->keyed as $rid => $resa) $resa->remoteId = 0; // if not found in sync table, the reservation is new in mobminder, otherwise it is an updated reservation that already exists at both ends
		if($rresas->count()) foreach($rresas->keyed as $dS_sync_resa) $resas->keyed[$dS_sync_resa->localId]->remoteId = $dS_sync_resa->remoteId;
	
	// here we associate the resource remoteId with the mobminder resources ids
		foreach($rscs->keyed as $rid => $dS_rsc) $dS_rsc->remoteId = 0; // 0 is default when not synced
		if($rrscs->count()) foreach($rrscs->keyed as $dS_sync_rsc) $rscs->keyed[$dS_sync_rsc->localId]->remoteId = $dS_sync_rsc->remoteId;
	
	// here we associate the visitors remoteId with the local ids
	$remvis = new C_dbAccess_synchro_visitors(); if($visiIds) $remvis->loadOnLocalId($visiIds, $skeyId); // contains sync links of visitors implicated in the current appointments scope
		if($visiIds) foreach($visis->keyed as $vid => $dS_v) $dS_v->remoteId = 0; // 0 is default when the appointment visitor is not synced
		if($remvis->count()) foreach($remvis->keyed as $dS_sync_v) $visis->keyed[$dS_sync_v->localId]->remoteId = $dS_sync_v->remoteId;
	
		
	// proceeed with catching updated stuffs
	//
	foreach($resas->keyed as $resaId => $dS) {
		
		// resources 
		$rids = Array(); $rrids = Array(); // resources ids and remote resources ids
		$rcount = 0; if(isset($attnd->grouped[$resaId])) $rcount = count($attnd->grouped[$resaId]);
		if($rcount) foreach($attnd->grouped[$resaId] as $attId => $d) { // normally, rcount is always minimum 1
			$r = $rscs->get($d->resourceId);
			$rids[] = $r->id; 
			if($r->remoteId) $rrids[] = $r->remoteId; // do not communicate about resources that are not synced
		}
		$rids = implode('!',$rids);
		if(count($rrids)) $rrids = implode('!',$rrids);	
			else continue; // in this last case, the resource(s) may not be synced to the remote side according to the sync setup (sync setup authorizes to not sync all resources)
		
		// performances note
		$perf_note = Array();
		if($dS->note=='') {
			if($wrks->count()) 
				if(count($perfs->grouped[$resaId])) {
					foreach($perfs->grouped[$resaId] as $dS_perf) {
						$dS_wrkcode = $wrks->keyed[$dS_perf->workCodeId];
						$perf_note[] = $dS_wrkcode->name;
					}
				} 
			$perf_note = implode(', ',$perf_note);  
			$dS->note = $perf_note;
		}
		
		// custom ccss 
		$rccss = ''; // remote color id
		if($dS->cssColor) { // ccount may be zero when no colour is applied
			$rccss = $ccss->get($dS->cssColor,'','remoteId'); // does not communicate about custom css that are not synced
		}	
		else 
			if($wrks->count()) if(count($perfs->grouped[$resaId])) 
				foreach($perfs->grouped[$resaId] as $dS_perf) {
					$dS_wrkcode = $wrks->keyed[$dS_perf->workCodeId];
					if($dS_wrkcode->cssColor) { $rccss = $ccss->get($dS_wrkcode->cssColor,'','remoteId'); break; }
					else { /* keep on looping, may be another perf in this reservation has a color */ }
				}
		
		// visitors
		$vids = Array(); $rvids = Array(); $vcount = 0; 
		$names_note = array();
		if(isset($attvs->grouped[$resaId])) $vcount = count($attvs->grouped[$resaId]);
		if($vcount) foreach($attvs->grouped[$resaId] as $attId => $dS_att) {
			$v = $visis->get($dS_att->resourceId);
			$vids[] = $v->id; 
			$rvids[] = $v->remoteId; 
			if($v->remoteId==0) $names_note[] = $v->getInfo(); // lastname, firstname (mobile), only when the visitor is still unknown from the remote side
		}
		$vids = implode('!',$vids);
		$rvids = implode('!',$rvids);	
		$names_note = implode('. ',$names_note); 
		if($names_note) $dS->note = $names_note.' / '.$dS->note;

		// extending the resa object with remote ids
		$dS->resources = $rids;
		$dS->remoteResources = $rrids;
		$dS->rcolor = $rccss;
		$dS->visitors = $vids;
		$dS->remoteVisitors = $rvids;
		
		// converting cues into time stamps
		$dS->cueIn = Date('Y-m-d H:i:s',$dS->cueIn);
		$dS->cueOut = Date('Y-m-d H:i:s',$dS->cueOut);
	}
}

// sync time
$now = time();
msg('Previous sync time referer: '.$syncTime);
if($forcedsynct) msg('Passed forced sync time referer: '.$datestring);
msg('New sync time: '.Date('Y-m-d H:i:s', $now).' (will be recorded at acknowledgment).');
$_SESSION['AsyncTime'] = $now; session_write_close();

if($check) msg('You are in check mode: The sync time will not be recorded.');
	else {
		// $dS_login->setsynctime('resa');
	}

// output
if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = 'update_reservations';

	$fields = Array('id','remoteId','remoteResources','cueIn','cueOut','remoteVisitors','note','deleted','rcolor');
	echo $resas->csvstream($filename, $fields, false /* include classname */, !$web /* headers */);
if($web) echo '</file>';
	
	
msg('##0## process successful, goodbye.##');


$perfReport->peak('::protocol streamed');
if($web) $perfReport->dropReport();

?>