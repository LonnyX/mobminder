<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    I N I T I A L I Z E     R E S O U R C E S     A N D     C O N F I G 
//

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$skeyId = $dS_accesskey->id;
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$scratch= @$_POST['scratch']; if(isset($scratch)) $scratch = !!$scratch; else $scratch = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$encod 	= @$_POST['encoding']; if(!isset($encod)) $encod = false; // encoding false leads to auto-detection of encoding

msg('Check mode: '.($check?$check:'Nope'));
msg('Clean up first: '.($clean?$clean:'Nope'));


$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines($encod);
$r = $f->csv_toResources();
$perfReport->peak('::file read');
msg('File read successfully!'); 




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//

if(!$check) {
	if($scratch) { // removes ALL agenda lines and start this account from scratch
		
		$q = new Q('select id from resources where groupId = '.$accountId.';');
		$rids = $q->ids(false);
		foreach($rids as $rid) C_dS_resource::remove($rid);
		
		msg('CLEAN UP: complete (scratch mode).');
		$perfReport->peak('::Clean up done (scratch mode)');
		
	} else
		if($clean) { // removes agenda line for those resources that are now initialized

			$rsync = new C_dbAccess_synchro_resources($skeyId);
			$rcorrl = Array(); foreach($rsync->keyed as $sync) $rcorrl[$sync->remoteId] = $sync->localId;

			if(count($rcorrl))
				foreach($r as $c => $dS_r) // remove resources if they have been synchronized yet in the past
					if(isset($rcorrl[$dS_r->remoteId])) {
						$localId = $rcorrl[$dS_r->remoteId];
						C_dS_resource::remove($localId);
					}
			
			msg('CLEAN UP: complete (clean mode).');
			$perfReport->peak('::Clean up done (clean mode)');
		}
} else {
	if($clean||$scratch) msg('Check mode! Resources have NOT been deleted from account.'); 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//
$o_dbAccess_synchro_resources = new C_dbAccess_synchro_resources();
if(!$check) {
	$rscIds = Array();
	foreach($r as $c => $dS_r) {
		if($f->remoteId) {
			$dS_s = $o_dbAccess_synchro_resources->newVirtual();
			$dS_s->groupId = $accountId;
			$dS_s->skeyId = $skeyId;
			$dS_s->remoteId = $dS_r->remoteId;
			unset($dS_r->remoteId); // mandatory before saving the dataSet
		}
		$dS_r->dSsave($accountId);
		if($f->remoteId) {
			$dS_s->localId = $dS_r->id;
			$dS_s->dSsave($accountId);
		}
		$rscIds[] = $dS_r->id;
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
	
	// the current access key should see those resources, otherwise no subsequent reservations sync will produce a result 
	if(count($rscIds)) {
		$dS_accesskey->bCals = implode('!',$rscIds);
		$dS_accesskey->dSsave();
	}
	
} else {
	msg('Check mode! The data has NOT been saved to DB.'); 
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Make it such that each login in this account has all new resources in their view
//
$akeys_currgroup = new C_dbAccess_accesskey(); 
$akeys_currgroup->loadOnAccount($accountId); // all the keys that open the current group
foreach($akeys_currgroup->keyed as $kid => $dS_k) {
	$dS_k->bCals = '';
	$dS_k->uCals = '';
	$dS_k->fCals = '';
}
if(!$check) {
	$akeys_currgroup->saveAll();
	msg('Access keys view has been fixed.'); 
} else {
	msg('Access keys views have NOT been fixed (check mode).'); 
}
	$perfReport->peak('::Access keys view has been fixed');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Return a file with local Ids
//
if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('resc');

if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = 'synchro_resources_init';
	if($check) echo 'You are in check mode: None local to remote Id reference created.';
		else echo $o_dbAccess_synchro_resources->csvstream($filename, false /*fields*/, false /* include classname */, !$web /* headers */);
if($web) echo '</file>';


msg('##0## process successful, goodbye.##');


// Or return a perf report

$perfReport->peak('::completed');
if($web) $perfReport->dropReport();


?>