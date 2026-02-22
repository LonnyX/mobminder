<?php
$systemLog = 'oxigen apps loader';
require './utililib.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  VARIANT OF MOBIKAP.PHP
//
//  IMPORTS APPOINTMENTS FROM A FILE - link patients through their mobile number
//
//  => delta with mobikap: timein and timeout contain both a date and time. 
//
//	following columns are expected:
//
//  appdate	appfrom	appto	lastname	firstname	mobile	phone	registration	note
//
//
//  Usage: http://localhost/utilities/mobikap.php?id=2944&rsc=9994   <= test mode
//  Usage: http://localhost/utilities/mobikap.php?id=3059&rsc=7422&cleanup=1&do=1   <= clean up and action mode
// 
//  http://be.mobminder.com/utilities/mobikap.php?id=3510&rsc=9531&do=1
//
//  The filename has a rigid format, like 2891_7160_apps.csv';
//  
//	Pre-requisites: 
//
//  1. import visitors using visiload.php
//
//	2. set this headers at the top of mobikap file and remove unnecessary columns
//
//  	appdate	text	appfrom	appto	lastname	firstname	mobile	phone	address	city	zipCode	note
//


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = true; else $do = false;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');
$out .= h2('Account identified: '.$o_dS_group->name.'');



$o_dbAccess_resources = new C_dbAccess_resources($accountId); 
$rcount = $o_dbAccess_resources->count();
if (!$rcount) error('No resource found!');
	else 
		$out .= h2('Resources identified: '.$rcount.' resources');

	
//////////////////////////////////////////////////////////////////////////////// 
//
//  CLEANUP
//

if($cleanup) { // first pass, remove older stuff
	
	// current table
	$resas = new C_dbAccess_reservations(); $resas->loadOnGroup($accountId);
	$resaIds = $resas->getIdsList();
	
	if($resaIds != '') {
		
		new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM reservations WHERE groupId = '.$accountId.';');
	}
	
	// archive table
	$resas = new C_dbAccess_reservations('archive_'); $resas->loadOnGroup($accountId);
	$resaIds = $resas->getIdsList();
	
	if($resaIds != '') {
		
		new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
		
		new Q('DELETE FROM archive_reservations WHERE groupId = '.$accountId.';');
	}
	
	
	$out .= h2('Clean up complete');
	echo html($out); // from utililib.php
	die();
}


	
//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//

$matches = glob('./'.$accountId.'apps*.csv');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*.csv');
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

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

if(!in_array('rscid',$headers)) error('Missing mandatory header: rscid', $handle);
if(!in_array('appfrom',$headers)) error('Missing mandatory header: appfrom', $handle); // time like 01/02/2018 09h00
if(!in_array('appto',$headers)) error('Missing mandatory header: appto', $handle);
if(!in_array('name',$headers)) error('Missing mandatory header: name', $handle);
if(!in_array('birthday',$headers)) error('Missing mandatory header: birthday', $handle);
if(!in_array('mobile',$headers)) error('Missing mandatory header: mobile', $handle);
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);


// mandatory fields
$nm_position = array_keys($headers, 'name'); 		$nm_position = $nm_position[0]; // concatenation of lastname and firstname
$bd_position = array_keys($headers, 'birthday'); 	$bd_position = $bd_position[0]; 
$af_position = array_keys($headers, 'appfrom'); 	$af_position = $af_position[0]; 
$at_position = array_keys($headers, 'appto'); 		$at_position = $at_position[0]; 
$mb_position = array_keys($headers, 'mobile'); 		$mb_position = $mb_position[0]; 
$nt_position = array_keys($headers, 'note'); 		$nt_position = $nt_position[0]; 
$rs_position = array_keys($headers, 'rscid'); 		$rs_position = $rs_position[0]; 

// optional fields
if(in_array('address',$headers)) 	{ $as_position = array_keys($headers, 'address'); 	$as_position = $as_position[0]; } else $as_position = false;
if(in_array('city',$headers)) 		{ $cy_position = array_keys($headers, 'city'); 		$cy_position = $cy_position[0]; } else $cy_position = false;
if(in_array('zipCode',$headers)) 	{ $zp_position = array_keys($headers, 'zipCode'); 	$zp_position = $zp_position[0]; } else $zp_position = false;


// $o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	// if(!array_key_exists($header,$o_dS_defaults))
		// error('The following header has no correspondance in the target visitor table: '.$header, $handle);
}
$out .= h2('Headers are compliant with DB definitions: '.++$hcount.' columns');


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//


$cuein = microtime(true);

$lcount = 0; $skipcount = 0; $ccount = $hcount-1; 
$lines = tolines($handle, false); // from utililib.php


$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');

	
	
//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byMobile = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byPhone = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byName = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byBday = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, mobile, phone, lastname, firstname, birthday FROM visitors WHERE groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
		
			$m = substr($row['mobile'],-9);
		if($m) $byMobile[$m] = $row['id'];
		
			$p = substr($row['phone'],-9);
		if($p) $byPhone[$p] = $row['id'];
		
			$l = $row['lastname'];
			$f = $row['firstname'];
			$name=strtolower($l.$f);
			$name=str_replace(' ','',$name);	
		$byName[$name] = $row['id'];
		
			$b = $row['birthday'];
		if($b) $byBday[$b.substr($name,0,5)] = $row['id']; // like 19701230vanho
		
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2(''.$visiTotal.' visitors have been loaded from mobminder in: '.$cuedelta.' mseconds');


if($do)
	$out .= h2('DO MODE IS ACTIVE !');




//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

$cuein = microtime(true);
$lcount = 0; // lines count
$icount = 0; // insert count
$novmatch = 0; $noresc = 0; $newVisiCount = 0;

$match_birthday = 0;
$match_name = 0;
$match_mobile = 0;
$match_total = 0;

foreach($lines as $x => $split) {

		$lcount++;
		
		$rscid = $split[$rs_position];
			
		if(isset($o_dbAccess_resources->keyed[$rscid]))
			$dS_resource = $o_dbAccess_resources->keyed[$rscid];
		else {
			warning(($noresc++).'<b>BAD RESOURCE ID:</b>'.$rscid.' (line '.$x.', no reference for this resource)');
			continue;
		}
		
		// $date = $split[$ad_position]; 
		$timein = $split[$af_position]; 
		$timeout = $split[$at_position]; 
		$fname = $split[$nm_position];  
		$birthday = $split[$bd_position]; if($birthday=='0001-01-01') $birthday=''; else $birthday = str_replace('-','',$birthday);
		$mobile = preg_replace('/[^0-9]/', '', $split[$mb_position]); 
		// $phone = preg_replace('/[^0-9]/', '', $split[$ph_position]);
		$appNote = $split[$nt_position]; 
			
		if($mobile) $mobile = '32'.$mobile; else $mobile = false;
		$phone = false; // if($phone) $phone = $phone; else $phone = false;
		$name = strtolower($fname);
		$name = str_replace(' ','',$name);
		$visiId = false; $match = '';
		
		if($birthday) {
			if(isset($byBday[$birthday.substr($name,0,5)])) {
				$visiId = $byBday[$birthday.substr($name,0,5)];
				$match = 'match on birthday';
				$match_birthday++;
				$match_total++;
			}
		}
		if(!$visiId) {
			if(isset($byName[$name])) {
				$visiId = $byName[$name];
				$match = 'match on name';
				$match_name++;
				$match_total++;
			}
		}
		if(!$visiId) {
			if($mobile) {
				$m = substr($mobile,-9);
				if(isset($byMobile[$m])) {
					$visiId = $byMobile[$m];
					$match = 'match on mobile';
				$match_mobile++;
				$match_total++;
				}
			} 
		}
		
		if(!$visiId) {
			$out .= micro('<b>NO MATCH: </b>'.($novmatch++).' (line '.$x.', no reference for the visitor:'.$name.')');
			$appNote = $name.', '.$mobile.', '.$birthday.' - '.$appNote;
			
			if(($name&&$mobile)||($name&&$birthday)) {
				// we create a visitor based on the info given in the mobikap appointment
				$out .= warning('<b>Lets create a VISITOR: </b>'.($novmatch++).' ('.$name.')');
				
				$dS_visi = new C_dS_visitor(-$newVisiCount, $accountId);
				$dS_visi->lastname = $name;
				$dS_visi->firstname = 'TBD';
				if($mobile) {
					$dS_visi->mobile = checkMobileFormat($mobile, '32');
				}
				$dS_visi->address = $as_position? $split[$as_position] : '';
				$dS_visi->zipCode = $zp_position? $split[$zp_position] : '';
				$dS_visi->city 	= 	$cy_position? $split[$cy_position] : '';
				$dS_visi->birthday = $bd_position? $split[$bd_position] : '';
				
				if($do) {
					$dS_visi->dSsave(); 
					$nvid = $dS_visi->id;
					if($mobile) $byMobile[$mobile] = $nvid;
						$name = strtolower($fname);
						$name = str_replace(' ','',$name);
					$byName[$name] = $nvid;
					$visiId = $nvid;
				}
				$newVisiCount++;
			}
		}
			
			$cueIn = new C_date($timein);
			$cueOut = new C_date($timeout);
			
		$o_dS_reservation = new C_dS_reservation(false, $accountId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		$o_dS_reservation->note = $appNote;
			$out .= micro('<b>Appointment: </b>'.$match.' => '.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' with '.$name); // debug
		if($do) $o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
		
		
		$o_dS_attendee = new C_dS_attendee(false, $resaId);
		$o_dS_attendee->resourceId = $dS_resource->id;
		$o_dS_attendee->resourceType = $dS_resource->resourceType;
		
		if($visiId) {
			$o_dS_att_visitor = new C_dS_att_visitor(false, $resaId);
			$o_dS_att_visitor->resourceId = $visiId;
			$o_dS_att_visitor->resourceType = class_visitor;
			if($do) $o_dS_att_visitor->dSsave();
		}
		
		if($do) $o_dS_attendee->dSsave();
		$icount++;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;

	$out .= notice('<b>New visitors must be created: </b>'.$newVisiCount);
	$out .= notice('<b>match on birthday: </b>'.$match_birthday);
	$out .= notice('<b>match on name: </b>'.$match_name);
	$out .= notice('<b>match on mobile: </b>'.$match_mobile);
	$out .= notice('<b>Total match: </b>'.$match_total);

if($do) 
	$out .= h2(''.$icount.' items have been inserted (do not re-execute! or clean-up first), '.$lcount.' were scanned. Scanned in: '.$cuedelta.' mseconds');
else
	$out .= h2(''.$icount.' items have been prepared (not in do mode), '.$lcount.' were scanned. Scanned in: '.$cuedelta.' mseconds');




//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

$out .= h2('Operation SUCCESSFULL: do NOT re-execute this page.');

echo html($out); // from utililib.php

?>