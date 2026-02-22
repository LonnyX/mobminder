<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    I N I T I A L I Z E     V I S I T O R S
//

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';

ini_set('memory_limit', '2048M');

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$merge 	= @$_POST['merge']; if(isset($merge)) $merge = !!$merge; else $merge = false; // when this option is on, visitors merge onto the ones present in DB
msg('Check mode: '.($check?$check:'Nope'));
msg('Clean up first: '.($clean?$clean:'Nope'));
msg('Merge init: '.($merge?'YES':'Nope'));


$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines();
$v = $f->csv_toVisitors();
$perfReport->peak('::file read');
	msg('File read successfully!'); 

fixgenders($v);
$perfReport->peak('::guessing genders processed');
	msg('Fixing genders is done!'); 
	
set_time_limit(120); // take a breath ( allows 1 more min execution )

$v = vpostprocess($v, $dS_accesskey, $dS_account); // $v contains visitors arriving from remote software
$perfReport->peak('::post process done');
	msg('Postprocessing is done!'); 



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//
$accountId = $dS_account->id;

if($clean) {
	
	if($check) {
		
		msg('CLEAN UP: set up but not executed in check mode.');
		
	} else {
		
		new Q('delete from visitors where groupId = '.$accountId.';');
		$perfReport->peak('::All visitors have been deleted from the account');
		msg('CLEAN UP: visitors have been deleted.');
		if($f->hasRemoteId) {
			new Q('delete from synchro_visitors where groupId = '.$accountId.';');
			$perfReport->peak('::All the sync data have been deleted from the account');
			msg('CLEAN UP: sync data have been deleted.');
		}
		
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//
set_time_limit(120); // take a breath ( allows 1 more min execution )

$o_dbAccess_synchro_visitors = new C_dbAccess_synchro_visitors();
if(!$check) {
	foreach($v as $c => $dS_v) {
		if($f->hasRemoteId) {
			$dS_s = $o_dbAccess_synchro_visitors->newVirtual();
			$dS_s->groupId = $accountId;
			$dS_s->skeyId = $dS_accesskey->id;
			$dS_s->remoteId = $dS_v->remoteId;
			
			unset($dS_v->remoteId); // mandatory before saving the dataSet
			unset($dS_v->rcolor); // mandatory before saving the dataSet
		}
		$dS_v->dSsave($accountId);
		if($f->hasRemoteId) {
			$dS_s->localId = $dS_v->id;
			$dS_s->dSsave($accountId);
		}
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
} else {
	msg('Check mode! The data has NOT been saved to DB.'); 
}



	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Return a file with local Ids
//
if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('visi');

if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = 'synchro_visi_init';
	if($check) echo 'You are in check mode: None local to remote Id reference created.';
		else echo $o_dbAccess_synchro_visitors->csvstream($filename);
if($web) echo '</file>';


msg('##0## process successful, goodbye.##');


// Or return a perf report

$perfReport->peak('::completed');
if($web) $perfReport->dropReport();


?>