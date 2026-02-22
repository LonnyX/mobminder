<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    I N I T I A L I Z E     R E S E R V A T I O N S
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
$skeyId = $dS_accesskey->id;
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;


$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$format	= @$_POST['format']; if(isset($format)) $format = $format; else $format = 'csv'; // default format

msg('Check mode: '.($check?$check:'Nope'));
msg('Clean up first: '.($clean?$clean:'Nope'));

$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines();

set_time_limit(120); // take a breath ( allows 1 more min execution )

$a = $f->read_appointments();

msg('File read successfully!'); 
$perfReport->peak('::file read');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Post processing for some fields
//

set_time_limit(120); // take a breath ( allows 1 more min execution )

$a = apostprocess($a, $dS_accesskey, $dS_account);


$perfReport->peak('::Post processing done');
msg('Post processing for some fields is done fine'); 




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//

set_time_limit(120); // take a breath ( allows 1 more min execution )

if($clean) { // clean up ONLY those agendas for which we expect synchro

	$rsync = new C_dbAccess_synchro_resources($dS_accesskey->id);
	if(!$rsync->count()) abort(15, 'No Resource is expected to be synchronized');
	foreach($rsync->keyed as $rsc) {
		$rid = $rsc->localId;
		C_dS_reservation::removeResource($rid);
		C_dS_reservation::removeResource($rid, 'archive_');
	}
	
	$perfReport->peak('::All reservations have been deleted from the account');
	msg('CLEAN UP: reservations have been deleted.');
	if($f->hasRemoteId) {
		new Q('delete from synchro_reservations where groupId = '.$accountId.';');
		$perfReport->peak('::All the sync data have been deleted from the account');
		msg('CLEAN UP: sync data have been deleted.');
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//

set_time_limit(120); // take a breath ( allows 1 more min execution )

if(!$check) {
	
	foreach($a as $c => $dS_r) {
	
		if($f->hasRemoteId) {
			$dS_s = new C_dS_synchro_reservation(0, $accountId);
			$dS_s->skeyId = $dS_accesskey->id;
			$dS_s->remoteId = $dS_r->remoteId;
			unset($dS_r->remoteId); // mandatory before saving the dataSet
			unset($dS_r->rcolor); // mandatory before saving the dataSet
		}
		
		$resources 		= $dS_r->resources; 	unset($dS_r->resources); 	// may be empty, see (*sy01*)
		$visitors 		= $dS_r->visitors; 		unset($dS_r->visitors); 	// may be empty
		if(isset($dS_r->performances)) { $performances = $dS_r->performances; 	unset($dS_r->performances); }	// not implemented yet

		if(!$resources->count()) continue; // the remote side has sent an appointment for a resource that is not synced according to setup, or the sent remoteId for the resource is unknown here
		
		$dS_r->dSsave($accountId);
		
		if($f->hasRemoteId) {
			$dS_s->localId = $dS_r->id;
			$dS_s->dSsave($accountId);
		}
		$resources->saveAll($dS_r->id);
		$visitors->saveAll($dS_r->id);
		
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All reservations have been saved to the account');
} else {
	msg('Check mode! The reservations data has NOT been saved to DB.'); 
}



if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('resa');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Close and say goodbye
//

msg('##0## process successful, goodbye.##');

$perfReport->peak('::completed');
$perfReport->dropReport();


?>