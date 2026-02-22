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




set_time_limit(360); // take a breath ( allows 10min execution )

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

$out .= h1('Account identified: '.$o_dS_group->name.'');


if($do) {
	$out .= h2('YOU ARE IN DO MODE');
} else {
	$out .= h2('You are in CHECK mode');
}


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



$out .= h2('File opened: '.$filename.'');

$out .= notice('<b>First line: </b>'.$line1.'');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); };







//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING HEADERS IN THE FILE
//
// Identify and open the file


$out .= h2('File headers:');

if(0)
	$expected_headers = array('resourceId','appdate','appfrom','appto','reference','note','perfId');
else
	$expected_headers = array('resourceId','appfrom','appto','reference','note','patient','birthday','phone'); // ,'perfId'



$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

foreach($expected_headers as $header)
	if(!in_array($header,$headers)) error('Missing mandatory header: '.$header, $handle);

$position_headers = array();

$hasappdate = false; // cuein and cueout are coming like 'YYYY-MM-DD hh:mm'
foreach($expected_headers as $header) {
	$position_headers[$header] = array_keys($headers, $header); 
	$position_headers[$header] = $position_headers[$header][0];
	if($header=='appdate') $hasappdate = true; // cuein and cueout are coming like 'YYYY-MM-DD' and separated  time in 'hh:mm' and time out 'hh:mm'
}

foreach($position_headers as $header => $position)
	$out .= notice('Header: '.$header.' found at position:'.$position);

 
$ph = $position_headers;




//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

$out .= h2('File content:');

$cuein = microtime(true);

$lcount = 0; $skipcount = 0;
$lines = tolines($handle, false /* will auto detect file encoding */, false /*to lower*/); // from utililib.php


$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$lcount = count($lines);
$out .= h3('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');

	
	


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//

$out .= h2('Account visitors:');

$cuein = microtime(true); $visiTotal = 0;

$byReference = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byName = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, reference, lastname, firstname, birthday FROM visitors WHERE groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
			$r = $row['reference'];
		if($r) $byRegist[$r] = $row['id'];
		
			$l = $row['lastname'];
			$f = $row['firstname'];
			$b = $row['birthday'];
				$by = substr($b,0,4);
				$bm = substr($b,4,2);
				$bd = substr($b,6,2);
			$reference = strtolower($l.' '.$f);
		$byName[$reference] = $row['id'];
			if($b) $reference = strtolower($reference.' '.$bd.'/'.$bm.'/'.$by);
		$byReference[$r] = $row['id'];
		$visiTotal++;
		if($visiTotal<6) {
			$out .= notice('Ref:'.$reference.' -> id '.$row['id']);
		}
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$out .= h3($visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds');




//////////////////////////////////////////////////////////////////////////////// 
//
//  CLEAN UP
//


$out .= h2('Clean up:');

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

	$cuestart = microtime(true);
	$icount = 0;
	$visiId = false; $rescId = false;
	$verbose = 16;
	$matchcount = 0;
	$matchonname = 0;
	$nomatchcount = 0;
	
	
$out .= h2('Matching account visitors with appointments:');
	
foreach($lines as $x => $split) { // scans the appointments csv
		
	$resource = $split[$ph['resourceId']];  
	$cuein = $split[$ph['appfrom']]; 
	$cueout = $split[$ph['appto']];  
	$visiref = $split[$ph['reference']];  // integer patient id that was passed along with the export
	$appnote = $split[$ph['note']];   
	
	$patient = $split[$ph['patient']];   
	$birthday = $split[$ph['birthday']];   
	$phone = $split[$ph['phone']]; 
	
	$performance = 0; //$split[$ph['perfId']];  
	
	
	$visialpha = $patient.' ('.$birthday.') '.$phone.chr(10); // alphanum expression of patient that was passed along with the export
		
	if($hasappdate) { // when dates are expected like 2018-11-28, cuein = 09:15, cueout = 09:45
		$date = $split[$ph['appdate']];
			$cuein = substr($cuein,0,2).':'.substr($cuein,-2);
			$cueout = substr($cueout,0,2).':'.substr($cueout,-2);
		$datyIn = $date.' '.$cuein;
		$datyOut = $date.' '.$cueout;
	} 
	else { // when dates are expected like 2018-11-28 09:15  and  2018-11-28 09:45 
		
		$datyIn = $cuein;
		$datyOut = $cueout;
	}
	
	
	if($visiref!==''&&$visiref!=='0') {
		
		if(isset($byReference[$visiref])) { // best case
			$visiId = $byReference[$visiref];
			$matchcount++;
		} else {
			$visiId = false;
			$nomatchcount++;
		}
		
	} else $visiref = '';
	
	
		$cueIn = new C_date($datyIn); // dates are expected like 2018-11-28 09:15
		// $cueOut = clone($cueIn); $cueOut->sIncrement(60*15); // only cueIn is given in the file and all appointments are 20 minutes long
		$cueOut = new C_date($datyOut);
		
	$o_dS_reservation = new C_dS_reservation(false, $accountId);
	$o_dS_reservation->cueIn = $cueIn->getTstmp();
	$o_dS_reservation->cueOut = $cueOut->getTstmp();
	
	if(!$visiId) 
		$o_dS_reservation->note = $visialpha;
		
	if($appnote)
		$o_dS_reservation->note .= $appnote;
		
	
	if($verbose) {
		$out.= notice('<b>Appointment: </b>'.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' with vid ['.$visiId.'] perf:'.$performance); // debug
		$verbose--;
	}
			
	if($do) {
		$o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
	} else { $resaId = 99; }
		
	if(0) { // we need to match an incoming resource id with a mobminder resource id
		
		switch($resource) {
			case 'daniel': 	$rescId = 15830; break;
			case 'paul': 	$rescId = 15842; break;
			default:
				$out.= warning('Ouuups! this resource was not expected: '.$resource); $visiId = false; $rescId = false; continue;
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
	if($performance) {
		$o_dS_perf = new C_dS_performance(false, $resaId);
		$o_dS_perf->workCodeId = $performance;
		if($visiId) $o_dS_perf->visitorId = $visiId;
	}
		
	if($do) if($rescId) {
		$o_dS_attendee->dSsave();
		if($visiId) $o_dS_att_visitor->dSsave();
		if($performance) $o_dS_perf->dSsave();
	}

	$icount++;
	$visiId = false; $rescId = false; $performance = false;
		
}
$cuefinish = microtime(true);
$cuedelta = deltasec($cuestart,$cuefinish);

$out .= warning(''.$matchcount.' items have been matched with an account visitor.');
$out .= warning(''.$matchonname.' items have been matched on visitor name.');
$out .= warning(''.$nomatchcount.' items could not be matched with an account visitor.');
$out .= h3(''.$icount.' items have been inserted. Scanned in: '.$cuedelta.' seconds');



//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

if($do)
	$out .= h2('Operation SUCCESSFULL: do NOT re-execute this page.');
else 
	$out .= h2('Operation SUCCESSFULL: looks good, now execute it in do mode to save the data.');

echo html($out); // from utililib.php




?>