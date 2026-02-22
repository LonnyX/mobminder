<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    I N I T I A L I Z E     V I S I T O R S
//

// What init can do that update does not do :
// - Upload files having no remoteId
// - Reset the visitors registery
// - In case of merge init, it returns to remote side the Mominder items that could not be matched
// 
// Why init is not the update.php
// - it resets the full remoteId to mobminderId link table each time you call it(it's a refresh of the link tables)
//
// What both init/visitors.php and update.php do
// - they can clever merge the incoming data onto existing visitors
//
// 


$systemLog = 'sync visiload';

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';
require '../../classes/visi_clevermatch.php';

ini_set('memory_limit', '2048M');

$session = session_start(); 

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

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$merge 	= @$_POST['merge']; if(isset($merge)) $merge = !!$merge; else $merge = true;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$encod 	= @$_POST['encoding']; if(!isset($encod)) $encod = false; // encoding false leads to auto-detection of encoding

msg('Check mode: '.($check?'YES':'Nope'));
msg('Merge init: '.($merge?'YES':'Nope'));
msg('Clean up first: '.($clean?'YES':'Nope'));
if($merge) if($clean) msg(chr(9).'NOTE: clean up has no effect when merge mode is active');


$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines($encod);
$v = $f->read_visitors();
$perfReport->peak('::file read');
	msg('File read successfully!'); 

$wremid = $f->hasRemoteId;

fixgenders($v, true /*preload*/, true /*verbose*/);
$perfReport->peak('::guessing genders processed');
	msg('Fixing genders is done!'); 
	
set_time_limit(1200); // take a breath ( allows 1 more min execution )

$v = vpostprocess($v, $dS_accesskey, $dS_account); // $v contains visitors arriving from remote software, converted to UTF-8

// $v is now an array like  [ $x => $dS_visitor ]

$perfReport->peak('::post process done');
	msg('Postprocessing is done!'); 

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds


if($merge) { // applies when Mobminder is already in use when a remote app initiates a sync


	msg('NOW PROCEDING WITH AUTO MERGE !'); 

	// In this case there is no creation of dS_visitors from scratch, but only the dS_synchro_visitors are created after a match with existing visitors.
	//
	// 3 possible cases for visitors:
	// - (1) - The remote visitor has a unique match with a Mobminder visitor (based on first/lastname/birthday/mobile). Only the dS_synchro_visitors entry is created
	// - (2) - The remote visitor has no match in Mobminder. We create a new dS_visitor and a dS_synchro_visitors.
	// - (3) - Mobminder visitors are left with no match with remote. Those one are resolved during the first sync (see (4) )
	//
	// (4) After the "Merge init" procedure, the first app/visi sync must force a syncTime anterior to the Mobminder account creation. That will
	// 		force unmatched Mobminder visitors to create a file in the remote application. The sync is complete!
	//
	// Note that when a match is found between two records, we will enrich the Mobminder DB with missing data at our side
	
	$cuein = microtime(true);
	
	
	msg('  ...deleting previous synchro_visitors links for this key: '.$skeyId.' (login:'.$dS_login->lastname.' '.$dS_login->firstname.')'); 
	
	if(!$check)
		new Q('delete from synchro_visitors where skeyId = '.$skeyId.';');
	
	
	msg('  ...Loading local visitors register'); 
	
	
	
	$q = new Q('select id, firstname, lastname, zipCode, phone, mobile, address, city, birthday, email, note, reference, residence from visitors where groupId = '.$accountId.' and deleted = 0;');
	
		$remotes = $v;
		$locals = $q;
	$cmatch = new C_clevermatch($accountId, $skeyId, $locals, $remotes, $wremid, $check);
	$cmatch->dropreport();
	
	
	// Record sync time
	//
	if($check) msg('You are in check mode: The sync time will not be recorded.');
		else $dS_login->setsynctime('visi');
	
	
	
	// Return to remote side the Mobminder items that were not matched
	//
	$visis = $cmatch->reportunmatched(); // returns a C_dbAccess_visitors that we can stream like file. 
	
	if($web) echo '<file>'; // enclose the file content within the stream
		$filename = 'init_visitors_nomatch';
		$fields = Array('id','remoteId','birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email','note','rcolor','company','residence','language','reference','registration','created','changed','deleted','mergedTo');
		echo $visis->csvstream($filename, $fields, false /* include classname */, !$web /* headers */);
	if($web) echo '</file>';
	
	
	//
	//
	msg('&nbsp;');
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	msg('Total roundtrip: '.$cuedelta);
	$perfReport->peak('Merge Init::visitors matched with existing and synchro_visitor links made');

	msg('##0## process successful, goodbye.##');
	die();
	
	
	//
	// MERGE MODE STOPS EXECUTION HERE
	//
	////////////////////////////////////////////////////////////////////////////////////////////////////////
}


	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Code lines below are meant for from scratch initialization
//




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//

if($clean) {
	
	if($check) {
		
		msg('CLEAN UP: set up but not executed in check mode.');
		
	} else {
		
		// remove any attendees from existing appointments in this account
		new Q('delete att_visitors from att_visitors inner join visitors on visitors.id = att_visitors.resourceId where visitors.groupId = '.$accountId.';');
		new Q('delete archive_att_visitors from archive_att_visitors inner join visitors on visitors.id = archive_att_visitors.resourceId where visitors.groupId = '.$accountId.';');
		
		
		
		// remove visitors
		new Q('delete from visitors where groupId = '.$accountId.';');
		
		$perfReport->peak('::All visitors have been deleted from the account');
		msg('CLEAN UP: visitors have been deleted.');
		
			new Q('delete from synchro_visitors where groupId = '.$accountId.';');
			$perfReport->peak('::All the sync data have been deleted from the account');
			msg('CLEAN UP: sync data have been deleted.');
		
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Sanity check: avoid duplicate remoteIds in this list
//
set_time_limit(600); // take a breath ( allows 1 more min execution )

$doublons = array(); $remoteids = array(); $abortit = false; 
if($f->hasRemoteId) foreach($v as $c => $dS_v) {
	if(in_array($dS_v->remoteId,$remoteids)) {
		$abortit = true;  
		$doublons[] = $dS_v->remoteId;
	}
	$remoteids[] = $dS_v->remoteId;
}
if($abortit) {
	$doublons = implode(', ',$doublons);
	abort('901', 'your list contains duplicate remoteIds for different visitors. Review your list! Doublons: '.$doublons);
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//

set_time_limit(1600); // take a breath ( allows 1 more min execution )

$o_dbAccess_synchro_visitors = new C_dbAccess_synchro_visitors(); // for synchro links creation
if(!$check) {
	foreach($v as $c => $dS_v) {
		if($f->hasRemoteId) {
			$dS_s = $o_dbAccess_synchro_visitors->newVirtual();	// new synchro link
			$dS_s->groupId = $accountId;
			$dS_s->skeyId = $dS_accesskey->id;
			$dS_s->remoteId = $dS_v->remoteId;
			
			unset($dS_v->remoteId); // mandatory before saving the dataSet
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


//    I N I T I A L I Z E     V I S I T O R S
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Return a file with local Ids
//
if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('visi');

if($web) echo '<file>'; // enclose the filecontent within the stream, if the entering file has no remote id, the file will appear empty
	$filename = 'synchro_visi_init';
	if($check) echo 'You are in check mode: None local to remote Id reference created.';
		else echo $o_dbAccess_synchro_visitors->csvstream($filename, false /*fields*/, false /* include classname */, !$web /* headers */);
if($web) echo '</file>';


// set sync time such that the remote side can acknowledge the patients we sent to him
$now = time();
msg('New sync time: '.Date('Y-m-d H:i:s', $now).' (will be recorded at acknowledgment).');
$_SESSION['VsyncTime'] = $now; session_write_close();

msg('##0## process successful, goodbye.##');


// Or return a perf report

$perfReport->peak('::completed');
if($web) $perfReport->dropReport();


?>