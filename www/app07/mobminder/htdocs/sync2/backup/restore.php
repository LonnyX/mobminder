<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    B A C K U P    R E S T O R E   t o   M O B M I N D E R
//

require '../../classes/language.php';
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';

ini_set('memory_limit', '512M');


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

msg('Check mode: '.($check?$check:'Nope'));
msg('Web render: '.($web?$web:'Nope'));

$sctxt = new C_syncContext($dS_login, $dS_accesskey);

$perfReport->peak('::time needed to retrieve context and posted parameters');


/////////////////////////////////////////////////////////////////////////////////////
//
//   R E C O R D    C H A N G E S    C O M I N G    F R O M    R E M O T E   S I D E

// note: remote side has the priority. 
// i.e: If the same item is adapted on this server and remotely, the remotely adapted data overloads the server data.


$f = new postedfile($dS_account, $dS_login->email);
if($f->present) {
	$f->tolines(); 
	if($f->isempty) { msg('The file sent was empty.'); die(); }
	
	msg('<b>Splitting into sections</b>');
	$sections = $f->csv_splitsections();

	$datasets = Array(); $a = false; $v = false;
	if(count($sections)) foreach($sections as $classname => $section) {
		msg('<b>Reading '.$classname.' section</b>');
		$section->setremoteid();
		switch($classname) {
			case 'C_dS_visitor': 	 $datasets[$classname] = $f->csv_toVisitors(false, $section); break;
			case 'C_dS_reservation': $datasets[$classname] = $f->csv_toAppointments(false, $section); break;
		}
	}
	msg('<b>File read successfully</b>');
	$perfReport->peak('::file read');
}	

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P R O C E S S     V I S I T O R S 

$v = $datasets['C_dS_visitor'];

msg('Now fixing genders...'); 
fixgenders($v, true /*preload*/, true /*verbose*/);
$perfReport->peak('::guessing visitors genders done');

$v = vpostprocess($v, $dS_accesskey, $dS_account);
$perfReport->peak('::visitors are post-processed');
	msg('...Postprocessing of visitors is done!'); 



//////////////////////////////////////////////////////////////////////////////////////////
//
//   S T O R E    V I S I T O R S    D A T A 

$visicorr = Array(); // like [remoteId => localId], localId is the new id made by saving the dS_visitor locally now
if($check) {
	
	msg('You are in check mode: <b>Visitors data was not recorded</b>.');
	foreach($v as $c => $dS_v) $visicorr[$dS_v->remoteId] = 0; // 0 is used when in check mode

} else {
	
	
	// flush older visitors
	// msg('CLEAN UP: visitors are going to be deleted.');
	// $sctxt->flush_visitors();
	// $perfReport->peak('::All visitors have been deleted from the account');
	
	// save
	foreach($v as $c => $dS_v) {
						
		$remoteId = $dS_v->remoteId;
		unset($dS_v->remoteId); // mandatory before saving the dataSet
		unset($dS_v->rcolor); // mandatory before saving the dataSet
		
		$dS_v->dSsave($accountId);
		$visicorr[$remoteId] = $dS_v->id;
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::visitors have been saved to the account');
	
}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P R O C E S S    A P P O I N T M E N T S 


msg('Now post-processing reservations...');

$a = $datasets['C_dS_reservation'];

$passed = Array(); 
foreach($a as $x => $dS_app) {
	
	
	// attendees
	$atts = $sctxt->local_rsc($dS_app->resources, $dS_app->remoteId);
	if(!$atts->count()) { msg(chr(9).'Error: This item has none matching resource in Mobminder:'.$dS_app->remoteId.', skipping'); continue; }
	$dS_app->resources = $atts; // (*sy01*)
	
	// visitors
	$attvi = new C_dbAccess_att_visitors(); 
	if($dS_app->visitors!='') {
		$visis = explode('!',$dS_app->visitors); 
		foreach($visis as $vid) { 
			if(!isset($visicorr[$vid])) { msg(chr(9).'Warning: this visitor has no sync correlator in Mobminder:'.$vid.' in item '.$dS_app->remoteId).', skipping'; continue; } // you would end up with a gray sticker on your screen because the visitor does not match
			$lvid = $visicorr[$vid];
			$v = $attvi->newVirtual(); $v->resourceId = $lvid; $v->resourceType = class_visitor; 
		}
	}
	$dS_app->visitors = $attvi;
	
	// color
	$dS_app->cssColor = $sctxt->local_ccss($dS_app->rcolor, $dS_app->remoteId);
	
	$passed[] = $dS_app;
}
$a = $passed;

msg('...Postprocessing of reservations is done!'); 
$perfReport->peak('::reservations are post-processed');



//////////////////////////////////////////////////////////////////////////////////////////
//
//   S T O R E    R E S E R V A T I O N S     D A T A 

if($check) msg('You are in check mode: <b>Reservations data was not recorded</b>.');
else {

	// Flushing the data
	//
	// msg('CLEAN UP: reservations are going to be deleted.');
	// $sctxt->flush_reservations();
	// $perfReport->peak('::All reservations have been deleted from the account');

	// Saving the data
	//
	foreach($a as $c => $dS_r) {
		
		unset($dS_r->remoteId); // mandatory before saving the dataSet
		unset($dS_r->rcolor); // mandatory before saving the dataSet
		unset($dS_r->performances); // mandatory before saving the dataSet
		
		$resources 		= $dS_r->resources; 	unset($dS_r->resources); 	// may be empty, see (*sy01*)
		$visitors 		= $dS_r->visitors; 		unset($dS_r->visitors); 	// may be empty
		
		if(!$resources->count()) continue; // the remote side has sent an appointment for a resource that is not synced according to setup, or the sent remoteId for the resource is unknown here
		if($check) continue; 
		
		$dS_r->dSsave($accountId);
		
		$resources->saveAll($dS_r->id);
		$visitors->saveAll($dS_r->id);
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All reservations have been saved to the account');
	
	msg('Reservations are included in mobminder DB'); 
	$perfReport->peak('::reservations are saved in mobminder DB');
}



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   A C K N O W L E D G M E N T
	
msg('##0## process successful, goodbye.##');


$perfReport->peak('::protocol streamed');
if($web) $perfReport->dropReport();

?>