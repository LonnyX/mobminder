<?php
$systemLog = 'mobminder uploader';
require '../utililib.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  IMPORTS APPOINTMENTS USING A REFERENCE TO VISITOR PLACED IN FIELD visitors.reference
//
//  Usage: 127.0.0.1/utilities/reference_and_resource.php?id=4473
//
//  !! IMPORT VISITORS FIRST !!  <= and of course, write the visitor's correlator in the reference field
//
//
// and a rigid format
//





//////////////////////////////////////////////////////
//
//  catch this script name 
//
$pathfile = $_SERVER["SCRIPT_NAME"];
$break = Explode('/', $pathfile);
$thisScript = $break[count($break) - 1]; 



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS PARAMETERS
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
$do = 0; if(isset($_GET['do'])) if($_GET['do']=='1') $do = 1;
$cleanup = 0; if(isset($_GET['cleanup'])) if($_GET['cleanup']=='1') $cleanup = 1;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$o_dS_group->name.'</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//
// Identify and open the file

$matches = glob('./'.$accountId.'*.csv');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*apps.csv');

$filename = $matches[0];
if (!file_exists($filename)) error('No corresponding csv file: '.$filename);
$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);
$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);



$out .= h2('<h2>File opened: '.$filename.'</h2>');

$out .= notice('<b>First line: </b>'.$line1.'');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); };

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

/*
if(!in_array('cuein',$headers)) error('Missing mandatory header: appdate', $handle);
if(!in_array('cueout',$headers)) error('Missing mandatory header: appfrom', $handle);
if(!in_array('resource',$headers)) error('Missing mandatory header: appto', $handle); // must match an account resource
if(!in_array('visitor',$headers)) error('Missing mandatory header: visitorid', $handle); // this is 0 (no visitor) or a number that we will match with a visitors.reference already loaded (using visiload.php)
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);
*/

foreach($headers as $hcount => $header) {}
$out .= h2('<h2>Headers: '.++$hcount.' columns</h2>');

if($do) {
	$out .= h2('<h2>YOU ARE IN DO MODE</h2>');
} else {
	$out .= h2('<h2>You are in CHECK mode</h2>');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//


$cuein = microtime(true);

$lcount = 0; $skipcount = 0; $ccount = $hcount-1; 
$lines = tolines($handle, false /* will auto detect file encoding */, false /*to lower*/); // from utililib.php


$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('The file is empty');

	
	

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byReference = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, reference FROM visitors WHERE visitors.groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL); if(!$result) error('SQL failed:'.$SQL.' ');
	while ($row = $result->fetch_array()) {
		$r = $row['reference'];
		if(strpos($r, '#') !== false) { $r = explode('#',$r); $r = $r[0]; };
		$byReference[$r] = $row['id'];
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');





//////////////////////////////////////////////////////////////////////////////// 
//
//  CLEAN UP
//
if($cleanup) { // first pass, remove older stuff
		
	// current table
	$resas = new C_dbAccess_reservations(); $resas->loadOnGroup($accountId);
	$resaIds = $resas->getIdsList();
	
	if($resaIds != '') {
		
		new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM reservations WHERE groupId ='.$accountId.';');
	}
	
	// archive table
	$resas = new C_dbAccess_reservations('archive_'); $resas->loadOnGroup($accountId);
	$resaIds = $resas->getIdsList();
	
	if($resaIds != '') {
		
		new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM archive_reservations WHERE groupId ='.$accountId.';');
	}
	
	$out .= h2('Clean up complete');
	echo html($out); // from utililib.php
	die();
	
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

	$cuein = microtime(true);
	$icount = 0;
	$visiId = false; $rescId = false;
	$verbose = 100;
	
foreach($lines as $x => $split) {
		
		
		if(1) { // when dates are expected like 2018-11-28 09:15  and  2018-11-28 09:45
			$resource = $split[0];  $datyIn = $split[1]; $datyOut = $split[2]; $visiref = $split[3];  $appnote = $split[4];   
		} 
		else {  // when dates are expected like 2018-11-28, cuein = 09:15, cueout = 09:45 
			
			$resource = $split[0];  $date = $split[1]; $cuein = $split[2]; $cueout = $split[3];  $visiref = $split[4];  $appnote = $split[5];
			$datyIn = $date.' '.$cuein;
			$datyOut = $date.' '.$cueout;
			
			// $resource = $split[0];  $date = $split[1]; $cuein = $split[2]; // only cueIn is given in the file and all appointments are 20 minutes long
			// $visiref = $split[3]; $appnote = $split[4]; 
			// $datyIn = $date.' '.$cuein;
		}
		
		// if($cancelled == 'true') continue;
		
		if($visiref!==''&&$visiref!=='0') {
			if(!isset($byReference[$visiref])) {
				$out .= notice('<b>unlinkable line: </b>'.$x.' (no reference for the visitor:'.$visiref.')'); // continue;
				
			} else {
				$visiId = $byReference[$visiref];
				if($visiId) $appnote = ''; // usefull when appnote contains a textual reference to the visitor, comment in other cases
			}
		}
		
			$cueIn = new C_date($datyIn); // dates are expected like 2018-11-28 09:15
			$cueOut = clone($cueIn); $cueOut->sIncrement(60*15); // only cueIn is given in the file and all appointments are 20 minutes long
			// $cueOut = new C_date($datyOut);
			
		$o_dS_reservation = new C_dS_reservation(false, $accountId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		if(isset($appnote)) $o_dS_reservation->note = $appnote;
			if($verbose) {
				$out.= notice('<b>Appointment: </b>'.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString()); // debug
				$verbose--;
			}
			
	if($do) {
		$o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
	} else { $resaId = 99; }
		
		if(0) { // we need to match an incoming resource id with a mobminder resource id
			switch($resource) {
				case '15687': 	$rescId = 15687; break;
				case '15688': 	$rescId = 15688; break;
				default:
					$out.= notice('Ouuups! this resource was not expected: '.$resource); $visiId = false; $rescId = false; continue;
			}
		} else { // some clever chap has filled the csv with a mobminder id, we just pick it up
			$rescId = $resource;
		}
		
		$o_dS_attendee = new C_dS_attendee(false, $resaId);
		$o_dS_attendee->resourceId = $rescId;
		$o_dS_attendee->resourceType = class_bCal;
		
		if($visiId) { // some reservations have no visitor attached
			$o_dS_att_visitor = new C_dS_att_visitor(false, $resaId);
			$o_dS_att_visitor->resourceId = $visiId;
			$o_dS_att_visitor->resourceType = class_visitor;
		}
		
		
	if($do) if($rescId) {
		$o_dS_attendee->dSsave();
		if($visiId) $o_dS_att_visitor->dSsave();
	}
		$icount++;
		$visiId = false; $rescId = false;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$icount.' items have been inserted. Scanned in: '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

if($do)
	$out .= h2('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
else 
	$out .= h2('<h2>Operation SUCCESSFULL: looks good, now execute it in do mode to save the data.</h2>');

echo html($out); // from utililib.php




?>