<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    U P D A T E    V I S I T O R S
//

require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';
require './lib.php';

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
$syncTime = Date('Y-m-d H:i:s',$dS_login->syncTvisis);

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$xml 	= @$_POST['xml']; if(isset($xml)) $xml = !!$xml; else $xml = false;

msg('Check mode: '.($check?$check:'Nope'));
msg('Xml feedback: '.($xml?$xml:'Nope'));
msg('Web render: '.($web?$web:'Nope'));

$perfReport->peak('::time needed to retrieve context and posted parameters');


/////////////////////////////////////////////////////////////////////////////////
//
//   R E C O R D    C H A N G E S    C O M I N G    F R O M    R E M O T E   S I D E

// note: remote side has the priority. 
// i.e: If the same item is adapted on this server and remotely, the remotely adapted data overloads the server data.


$f = new postedfile($dS_account, $dS_login->email);
if($f->present) {
	$f->tolines();
} else {
	msg('No file passed!'); 
}

$upstreamed = Array(); // ids of upstreamed visitors (they should not be downstreamed because remote side has precedence
if(!$f->isempty) {

	$v = $f->csv_toVisitors($dS_accesskey);
	msg('! File read successfully !'); 
	$perfReport->peak('::file read');
	
	fixgenders($v);
	$perfReport->peak('::guessing genders processed');
		msg('Fixing genders is done!'); 

	$v = vpostprocess($v, $dS_accesskey, $dS_account);
	$perfReport->peak('::upper case words processed');
		msg('Postprocessing is done!'); 
		
	
	// Saving the data
	//
	$o_dbAccess_synchro_visitors = new C_dbAccess_synchro_visitors();
	foreach($v as $c => $dS_v) {
		
		$existingId = $dS_v->id;
		if($f->hasRemoteId) {
			if(!$existingId) { // then this item is very new and we need to create a sync reference for it
				$dS_s = new C_dS_synchro_visitor(0, $accountId);
				$dS_s->skeyId = $dS_accesskey->id;
				$dS_s->remoteId = $dS_v->remoteId;
			}
			unset($dS_v->remoteId); // mandatory before saving the dataSet
			unset($dS_v->rcolor); // mandatory before saving the dataSet
		}
		
		if($check) continue; 
		$dS_v->dSsave($accountId);
		
		if($f->hasRemoteId) { // only for new items, knowns remote items already have a sync reference
			if(!$existingId) {
				$dS_s->localId = $dS_v->id;
				$dS_s->dSsave($accountId);
			}
		}
		$upstreamed[] = $dS_v->id; 
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
}

/////////////////////////////////////////////////////////////////////////////////////
//
//   F E E D B A C K    C H A N G E S    F O U N D     A T     S E R V E R    S I D E

// step 01: fetch visitors

	$deleted = '(deletorId <> 0 AND deleted > "'.$syncTime.'")';
	$changed = '(changerId <> 0 AND changed > "'.$syncTime.'")';
	$created = '(created > "'.$syncTime.'")';
	$exclude = ''; if(count($upstreamed)) $exclude = ' AND id NOT IN ('.implode(',',$upstreamed).')';

$where 	= 'WHERE groupId = '.$dS_account->id.' AND ('.$deleted.' OR '.$changed.' OR '.$created.')'.$exclude;

$SQL 	= 'SELECT id FROM visitors '.$where.';';
$q = new Q($SQL);
$visiIds = $q->ids();
$visis = new C_dbAccess_visitors(); $visis->loadOnId($visiIds);


// here we re-associate the remoteId with the visitors

	
	$ccss = new C_dbAccess_customCss($dS_accesskey->accountId); // here we associate the custom ccss remoteId with the mobminder ccss ids
	$rccss = new C_dbAccess_synchro_ccss($skeyId);
		foreach($ccss->keyed as $cid => $dS_ccss) $dS_ccss->remoteId = ''; // 0 is default when not synced
		if($rccss->count()) foreach($rccss->keyed as $dS_sync_ccss) $ccss->keyed[$dS_sync_ccss->localId]->remoteId = $dS_sync_ccss->remoteId;
	
	foreach($visis->keyed as $vid => $dS_v) { 
		$dS_v->remoteId = 0; 
		$dS_v->rcolor = $ccss->get($dS_v->cssColor,'','remoteId'); 
	}
	
	// attach visitors remote ids when they are assigned yet
	$remvis = new C_dbAccess_synchro_visitors(); if($visiIds) $remvis->loadOnLocalId($visiIds, $skeyId);
	if($remvis->count()) 
		foreach($remvis->keyed as $dS_sync_v) $visis->keyed[$dS_sync_v->localId]->remoteId = $dS_sync_v->remoteId;
	

// output
if($web) echo '<file>'; // enclose the file content within the stream
	$filename = 'synchro_visitors';
	$fields = Array('id','remoteId','birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email','note','rcolor');
	echo $visis->csvstream($filename, $fields);
if($web) echo '</file>';

msg('##0## process successful, goodbye.##');

if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('visi');
 

$perfReport->peak('::protocol streamed');
if($web) '##perfreport'.chr(10);
if($web) $perfReport->dropReport(); // no perf report for production

?>