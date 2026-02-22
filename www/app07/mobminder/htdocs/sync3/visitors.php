<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S Y N C  3   /   U P D A T E    V I S I T O R S
//

require '../classes/language.php';
require '../../lib_mobphp/dbio.php'; 			
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';
require './lib.php';
require '../classes/visi_clevermatch.php';	// C_clevermatch


ini_set('memory_limit', '1024M');
set_time_limit(240); // take a breath ( allows 1 more min execution )


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
$encod 	= @$_POST['encoding']; if(!isset($encod)) $encod = false; // encoding false leads to auto-detection of encoding
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



set_time_limit(300);

$f = new postedfile($dS_account, $dS_login->email);
if($f->present) {
	$f->tolines($encod);
} else {
		msg('No file passed!'); 
}


$upstreamed = Array(); // ids of upstreamed visitors (they should not be downstreamed because remote side has precedence


/////////////////////////////////////////////////////////////////////////////////
//
//   R E C O R D    C H A N G E S    C O M I N G    F R O M    R E M O T E   S I D E

// note: remote side has the priority. 
// i.e: If the same item is adapted on this server and remotely, the remotely adapted data overloads the server data.

set_time_limit(360);

if(!$f->isempty) {

	$v = $f->csv_toVisitors($skeyId);
	msg('! File read successfully !'); 
	$perfReport->peak('::file read');
	
	fixgenders($v);
	$perfReport->peak('::guessing genders processed');
		msg('Fixing genders is done!'); 

	$v = vpostprocess($v, $dS_accesskey, $dS_account);
	$perfReport->peak('::upper case words processed');
		msg('Postprocessing is done!'); 

	// clever match is necessary when some local items are not linked yet 
	// AND when remote items could not be linked through the synchro_visitors table ( postedfile::localid_from_remoteid() )
	//
	$runclevermatch = false; 
		
		$remnew = 0; // remnew for remote new items counter
		// if items were uploaded by the remote side and if some of them have unknown remoteIds ($dS_v->id==0) then an intelligent match will be needed
	if(count($v)) foreach($v as $c => $dS_v) if($dS_v->id==0) $remnew++; // some new items arriving from remote side
	
	// foreach($v as $c => $dS_v) { // for debug purpose, list entering data
		// msg($dS_v->remoteId.', '.$dS_v->lastname.', '.$dS_v->firstname.' ');
	// }
	
	set_time_limit(245);
	
	// we need to upload the list of local candidates for a clever match. These are Mobminder items ! having no corresponding remoteId in the sync_visitors table !
	$locals = new Q('select synchro_visitors.remoteId, visitors.id, firstname, lastname, zipCode, phone, mobile, address, city, birthday, email, note, reference, residence
				from visitors 
				left join synchro_visitors on synchro_visitors.localId = visitors.id 
				where visitors.groupId = '.$accountId.' and visitors.deleted = 0 and synchro_visitors.remoteId is NULL;');
	$unlinkedlocals = $locals->cnt();
	
	if($unlinkedlocals&&$remnew) $runclevermatch = true; // all local items are linked already and if some $dS_v->id==0 occurances exist it means that they were created in the remote system only
 

	
	// Saving the data for which no clever match is needed
	//
	
	$enriching_counters = new C_dS_V_counters();
	$known = 0;
	foreach($v as $c => $r_dSv) {
		
		$newitem = !$r_dSv->id; // id is set to zero by csv_toVisitors() when the item remoteId has no match in the current sync
		
		if($newitem) if($runclevermatch) continue; // will be treated through clever match later, see (*cm02*)
		
		if($f->hasRemoteId) {
			if($newitem) { // then this item is very new and we need to create a sync reference for it  (*uv01*)
				$dS_s = new C_dS_synchro_visitor(0, $accountId);
				$dS_s->skeyId = $dS_accesskey->id;
				$dS_s->remoteId = $r_dSv->remoteId;
			} else {
				// otherwise, a local peer item exists in mobminder already (in table sync_visitors, under this skeyId)
				// in this case we want to update local items using new remote data
				//
				$known++;
				$l_dSv = new C_dS_visitor($r_dSv->id);
				C_clevermatch::clevermerge($r_dSv,$l_dSv, $check, false, $enriching_counters);
			}
		}
		
		if($check) continue; // do not save anything when in check mode
		
			unset($r_dSv->remoteId); // mandatory before saving the dataSet
			unset($r_dSv->rcolor); // mandatory before saving the dataSet
		$r_dSv->dSsave($accountId);
		$upstreamed[] = $r_dSv->id; 
		
		if($f->hasRemoteId) { // only for new items, known remote items already have a sync reference
			if($newitem) {
				$dS_s->localId = $r_dSv->id;
				$dS_s->dSsave($accountId);
			}
			if($r_dSv->mergedTo) {
				$r_dSv->mergeTo($r_dSv->mergedTo); // now actually operate the merge at DB level
			}
		}
	}
	msg('From '.$known.' known sync elements:'); 
	$enriching_counters->dropreport();
	
	if(!$check) msg('The data has been saved to DB.'); 
	$perfReport->peak('::data have been saved to the visitors table and linked');


	// Matching / saving the new data
	//
	set_time_limit(250);
	
	if($runclevermatch) {
		
		$remotes = array(); // let's gather remote items that were never matched yet
		foreach($v as $c => $dS_v) if($dS_v->id==0) { $remotes[] = $dS_v; }
		msg('Clever match is going to proceed, localy unlinked: '.$unlinkedlocals.' items, remote new items:'.$remnew);
		
		
		// $locals is a set of visitors that so far were left unmatched at Mobminder side
		// $remotes is a subset of visitors arriving from remote side that are left unmatched
		//
		
		$cmatch = new C_clevermatch($accountId, $skeyId, $locals, $remotes, $wremid = true, $check);
		$cmatch->dropreport();
		
		foreach($remotes as $c => $dS_v) $upstreamed[] = $dS_v->id; 
		
		// now remote items initially unmatched are saved and the links are created in synchro_visitors
		$perfReport->peak('::clever matched and saved to the visitors table and linked');
	} else 
		msg('No Clever match needed, localy unlinked: '.$unlinkedlocals.' items, remote new items:'.$remnew);
	
	
}

msg('upstreamed ids:'.implode(',',$upstreamed));




/////////////////////////////////////////////////////////////////////////////////////
//
//   F E E D B A C K    C H A N G E S    F O U N D     A T    L O C A L     S E R V E R    S I D E

// step 01: fetch visitors

	$archive_pivot_from = C_dS_system::backupPivotStamp();
	$lastsyncTime = $dS_login->syncTvisis;
if($lastsyncTime < $archive_pivot_from) $lastsyncTime = $archive_pivot_from; // sync scope can never go sooner than the archive_ backup pivot date (*)
	// 
	// (*) it was discovered that some sync clients never update their syncTime (by calling the acknowledge.php script). 
	// this caused the present script to increasingly return every time more and more items.
	// some queries were found ( var/log/mysql/slow-queries.log ) to last for 2 to 3 seconds and return 40.000+ items.

		$syncTime = $forcedsynct?$forcedsynct:Date('Y-m-d H:i:s',$lastsyncTime);
	$deleted = '(deletorId <> 0 AND deleted > "'.$syncTime.'")';
	$changed = '(changerId <> 0 AND changed > "'.$syncTime.'")';  // see (*cm10*)
	$created = '(created > "'.$syncTime.'")';
	$exclude = ''; if(count($upstreamed)) $exclude = ' AND id NOT IN ('.implode(',',$upstreamed).')';

		$where 	= 'WHERE groupId = '.$dS_account->id.' AND ('.$deleted.' OR '.$changed.' OR '.$created.')'.$exclude;
	$SQL 	= 'SeLeCt id FROM visitors '.$where.';'; // SeLeCt intentionaly containing uppercases/lowercases so to be identifiable as low query log
$q = new Q($SQL);
$visiIds = $q->ids();
$visis = new C_dbAccess_visitors(); $visis->loadOnId($visiIds);


// here we re-associate the remoteId with the visitors

	$ccss = new C_dbAccess_customCss($dS_accesskey->accountId); // here we associate the custom ccss remoteId with the mobminder ccss ids
	$ccss->synchro_magnify($skeyId);
	
	foreach($visis->keyed as $vid => $dS_v) { 
		$dS_v->remoteId = 0; 
		$dS_v->rcolor = $ccss->get($dS_v->cssColor,'','remoteId'); 
		if($dS_v->mergedTo) {
			$q = new Q('select remoteId as id from synchro_visitors where localId = '.$dS_v->mergedTo.' limit 1;');
			$mrid = $q->ids();
			$dS_v->mergedTo = $mrid?$mrid:0; 
		}
	}
	
	// attach visitors remote ids when they are assigned yet
	$remvis = new C_dbAccess_synchro_visitors(); if($visiIds) $remvis->loadOnLocalId($visiIds, $skeyId);
	if($remvis->count()) 
		foreach($remvis->keyed as $dS_sync_v) $visis->keyed[$dS_sync_v->localId]->remoteId = $dS_sync_v->remoteId;
	
	
//    U P D A T E    V I S I T O R S

// sync time	
$now = time();
msg('Previous sync time referer: '.$syncTime);
if($forcedsynct) msg('Passed forced sync time referer: '.$datestring);
msg('New sync time: '.Date('Y-m-d H:i:s', $now).' (will be recorded at acknowledgment).');
$_SESSION['VsyncTime'] = $now; session_write_close();


	
// output
if($web) echo '<file>'; // enclose the file content within the stream
	$filename = 'synchro_visitors';
	$fields = Array('id','remoteId','birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email','note','rcolor','company','residence','language','reference','registration','created','changed','deleted','mergedTo');
	echo $visis->csvstream($filename, $fields, false /* include classname */, !$web /* headers */);
if($web) echo '</file>';

msg('##0## process successful, goodbye.##');

 

$perfReport->peak('::protocol streamed');
if($web) '##perfreport'.chr(10);
if($web) $perfReport->dropReport(); // no perf report for production

?>