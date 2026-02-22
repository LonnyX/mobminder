<?php
$systemLog = 'apps loader';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  IMPORTS APPOINTMENTS USING A REFERENCE TO VISITOR PLACED IN FIELD REGISTRATION
//
//  Usage: 127.0.0.1/utilities/ba.php?id=2891&rid=7160&do=1&cleanup=0
//
//  !! IMPORT VISITORS FIRST !!
//
// The appointments file has a rigid filename: _2891_7160_apps.csv'
//
// and a rigid format
//
// appdate;appfrom;appto;visitorid;note     <= the sequence must be respected
// YYYY-MM-DD;hh:mm;hh:mm;visiid;whatevernote
// YYYY-MM-DD;hh:mm;hh:mm;visiid;whatevernote
// YYYY-MM-DD;hh:mm;hh:mm;visiid;whatevernote
// YYYY-MM-DD;hh:mm;hh:mm;visiid;whatevernote
// YYYY-MM-DD;hh:mm;hh:mm;visiid;whatevernote





//////////////////////////////////////////////////////
//
//  catch this script name 
//
$pathfile = $_SERVER["SCRIPT_NAME"];
$break = Explode('/', $pathfile);
$thisScript = $break[count($break) - 1]; 


//////////////////////////////////////////////////////
//
//  HTML Headers 
//
$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('mobminder appointments csv loader');
$html->pushHTML('<h1>mobminder appointments generator</h1>');



//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function notice($msg) { global $html; $html->pushHTML('<p>'.$msg.'</p>'); }



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;

if(!$accountId) error('You need to give an account id');

$dS_group = new C_dS_group($accountId);
if($dS_group->name == '') error('The account does not exists');
$html->pushHTML('<h2>Account identified: '.$dS_group->name.'</h2>');

//
if(isset($_GET['rid'])) $rescId = $_GET['rid']; else $rescId = false;

if(!$rescId) error('You need to give a resource id');

$o_dbAccess_resources = new C_dbAccess_resources($accountId); 
$rcount = $o_dbAccess_resources->count();
if (!$rcount) error('No resource found!');
	else 
		$html->pushHTML('<h2>Resources identified: '.$rcount.' resources</h2>');

$dS_resource = $o_dbAccess_resources->keyed[$rescId];
if (!$dS_resource) error('No resource found with rescId: bCal!'.$rescId);
	else 
		$html->pushHTML('<h2>Appointments are going to be created for: '.$dS_resource->name.'</h2>');
	
	
	
$filename = '_'.$accountId.'_'.$rescId.'_apps.csv';
if (!file_exists($filename)) error('No corresponding csv file: '.$filename);

$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);

$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);

$html->pushHTML('<h2>File opened: '.$filename.'</h2>');

$html->pushHTML('<p><b>First line: </b>'.$line1.'</p>');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $html->pushHTML('<p>Lines are feeded with <b>CRLF</b></p>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $html->pushHTML('<p>Lines are feeded with <b>LF</b></p>'); };

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

if(!in_array('appdate',$headers)) error('Missing mandatory header: appdate', $handle);
if(!in_array('appfrom',$headers)) error('Missing mandatory header: appfrom', $handle);
if(!in_array('appto',$headers)) error('Missing mandatory header: appto', $handle);
if(!in_array('visitorid',$headers)) error('Missing mandatory header: visitorid', $handle);
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);

// $o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	// if(!array_key_exists($header,$o_dS_defaults))
		// error('The following header has no correspondance in the target visitor table: '.$header, $handle);
}
$html->pushHTML('<h2>Headers are compliant with DB definitions: '.++$hcount.' columns</h2>');

$do = 0; if(isset($_GET['do'])) if($_GET['do']=='1') $do = 1;
if($do) {
	$html->pushHTML('<h2>YOU ARE IN DO MODE</h2>');
} else {
	$html->pushHTML('<h2>You are in CHECK mode</h2>');
}


if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;



//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $ccount = $hcount-1; $table = array();
function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
while (!feof($handle)) {
	$line = substr(fgets($handle),0,-$crlf);
	$lcount++; $comascount = substr_count($line, ';');
	if($comascount != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
		$skipcount++; notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match:'.$ccount.' expected, '.$comascount.' found)'); continue; }; 
	// $utf8 = utf8_encode(strtolower($line)); // all the line is set to lowercase, then converted to utf8 (sequence is important)
	// $utf8 = strtolower($line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
	// $slashed = addslashes($utf8);
	
	$split = explode(';',$line);
	array_walk($split,'normal');
	$table[] = $split;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount -= $skipcount;
$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines</h2>');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byRegistr = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, registration FROM visitors WHERE groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL); if(!$result) error('SQL failed:'.$SQL.' ');
	while ($row = $result->fetch_array()) {
		$r = $row['registration'];
		if(strpos($r, '#') !== false) { $r = explode('#',$r); $r = $r[0]; };
		$byRegistr[$r] = $row['id'];
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');





//////////////////////////////////////////////////////////////////////////////// 
//
//  ANNOUNCE JOB START TEST COMPLETION
//
$total = $lcount;
$from = @$_GET['f']; 	// generated by parser
$limit = 4000;
if(!isset($from)) { // then this page is called for the first time, echo request for sending
	
	$html->pushHTML('<h1>Ready to start the job, by bunches of '.$limit.' items</h1>');
	$html->pushHTML('<a href="'.$thisScript.'?id='.$accountId.'&rid='.$rescId.'&f=1&do='.$do.'&cleanup='.$cleanup.'">Click to Start creating the appointments</a>');
	$html->dropPage(); 
	die();
}

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
if($cleanup)
	if($from==1) { // first pass, remove older stuff
		
		// current table
		$resas = new C_dbAccess_reservations(); $resas->loadOnGroup($accountId);
		$resaIds = $resas->getIdsList();
		
		if($resaIds != '') {
			
			new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
			
			new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
			
			new Q('DELETE FROM reservations WHERE id IN ('.$accountId.');');
		}
		
		// archive table
		$resas = new C_dbAccess_reservations('archive_'); $resas->loadOnGroup($accountId);
		$resaIds = $resas->getIdsList();
		
		if($resaIds != '') {
			
			new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
			
			new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
			
			new Q('DELETE FROM archive_reservations WHERE id IN ('.$accountId.');');
		}
	}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

	$cuein = microtime(true);
	$SQL = array();
	$icount = 0; $iscan = 0; $to = ($from+$limit-1);
	$visiId = false;
	
for($x = $from-1; $x<$to; $x++,$from++) { 
		
		if($from>=$lcount) break;
		$iscan++;
		$split = $table[$x];
		$date = $split[0]; $timein = $split[1]; $timeout = $split[2]; $visiref = $split[3];  $appNote = $split[4]; 
		
		if($visiref!=='') {
			if(!isset($byRegistr[$visiref])) {
				notice('<b>unlinkable line: </b>'.$x.' (no reference for the visitor:'.$visiref.')'); // continue;
			} else $visiId = $byRegistr[$visiref];
		}
		
			$daty = str_replace('/', '-', $date);
			$datyIn = $daty.' '.$timein;
			$datyOut = $daty.' '.$timeout;
			$cueIn = new C_date($datyIn);
			$cueOut = new C_date($datyOut);
		$o_dS_reservation = new C_dS_reservation(false, $accountId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		$o_dS_reservation->note = $appNote;
			// notice('<b>Appointment: </b>'.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString()); // debug
		if($do) {
			$o_dS_reservation->dSsave();
			$resaId = $o_dS_reservation->id;
		} else { $resaId = 99; }
		
		$o_dS_attendee = new C_dS_attendee(false, $resaId);
		$o_dS_attendee->resourceId = $dS_resource->id;
		$o_dS_attendee->resourceType = $dS_resource->resourceType;
		
		if($visiId) { // some reservations have no visitor attached
			$o_dS_att_visitor = new C_dS_att_visitor(false, $resaId);
			$o_dS_att_visitor->resourceId = $visiId;
			$o_dS_att_visitor->resourceType = class_visitor;
		}
		if($do) {
			$o_dS_attendee->dSsave();
			if($visiId) $o_dS_att_visitor->dSsave();
		}
		$icount++;
		$visiId = false;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>'.$icount.' items have been inserted, '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  L O O P I N G
//
if($from < $total) {
	$html->pushHTML('<h1>Job not complete, ready to send the next bunch, from '.$from.', '.$limit.' more items</h1>');
	$html->pushHTML('<a href="'.$thisScript.'?id='.$accountId.'&rid='.$rescId.'&f='.$from.'&do='.$do.'">Click to Start sending next bunch</a>');
	$html->dropPage(); 
	die();
}

//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

$html->pushHTML('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();










?>