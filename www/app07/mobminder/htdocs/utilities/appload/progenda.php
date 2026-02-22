<?php
$systemLog = 'apps loader';
require '../utililib.php';


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  imports APPOINTMENTS from mobikap exports - link patients through their mobile number
//
//	following columns are expected:
//
//  resourceid   appdate	appfrom	appto	lastname	firstname	mobile	phone	registration	note
//
//	resourceid is options, others are mandatory
//
//  Usage: http://localhost/utilities/mobikap.php?id=2944   <= single account, or multi with resourceid field in input file
//  Usage: http://localhost/utilities/mobikap.php?id=2944&rsc=9994   <= multi account with specific resource
//  Usage: http://localhost/utilities/mobikap.php?id=3059&rsc=7422&cleanup=1&do=1   <= clean up and action mode
// 
//  http://be.mobminder.com/utilities/mobikap.php?id=3510&rsc=9531&do=1
//
//  
//	Pre-requisites: 
//
//  1. import visitors FIRST using visiload.php, absolute pre-requisite
//
//	2. set this headers at the top of mobikap file and remove unnecessary columns
//
//  	(resourceid) appdate	appfrom	appto	lastname	firstname	mobile	phone	address	city	zipCode	note
//


//////////////////////////////////////////////////////
//
//  HTML Headers 
//
$out .= h1('mobminder appointments generator from Progenda export');




//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['rsc'])) $rescId = $_GET['rsc']; else $rescId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = true; else $do = false;

	
if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');
$out .= h2('Account identified: '.$o_dS_group->name);


$o_dbAccess_resources = new C_dbAccess_resources($accountId); 
$rcount = $o_dbAccess_resources->count();
if(!$rcount) error('No resource found!');
	else {
		$out .= h2('Resources identified: '.$rcount.' resources');
		if($rcount==1) // single account
			$rescId = $o_dbAccess_resources->last()->id;
	}

	// at this point, $rescId is either given in uri, deduced from single account, or false (in false case, it should be defined as a field in the uploaded file)
	
$infilerscid = false; if($rcount>1) if(!isset($_GET['rsc'])) $infilerscid = true;
	
// $dS_resource = $o_dbAccess_resources->keyed[$rescId];
// if (!$dS_resource) error('No resource found with rescId: bCal!'.$rescId);
	// else 
		// $out .= h2('Appointments are going to be created for: '.$dS_resource->name);
	
	
//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//

$matches = glob('./'.$accountId.'*.csv');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*.csv');
$filename = $matches[0];
if (!file_exists($filename)) error('No corresponding csv file: '.$filename);

$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);
$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);


$out .= h2('File opened: '.$filename);
$out .= notice('<b>First line: </b>'.$line1);

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); }

	

//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING HEADERS
//
	
$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

if($infilerscid) if(!in_array('resourceid',$headers)) error('Missing mandatory header: resourceid', $handle);
if(!in_array('appdate',$headers)) $appdate = false; else $appdate = true;
if(!in_array('appfrom',$headers)) error('Missing mandatory header: appfrom', $handle);
if(!in_array('appto',$headers)) error('Missing mandatory header: appto', $handle);
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);
if(!in_array('firstname',$headers)) error('Missing mandatory header: firstname', $handle);
if(!in_array('mobile',$headers)) error('Missing mandatory header: mobile', $handle);
if(!in_array('phone',$headers)) error('Missing mandatory header: mobile', $handle);
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);


// mandatory fields
if($infilerscid) {
	$rc_position = array_keys($headers, 'resourceid'); $rc_position = $rc_position[0]; 
} else $rc_position = false;
$ln_position = array_keys($headers, 'lastname'); 	$ln_position = $ln_position[0]; 
$fn_position = array_keys($headers, 'firstname'); 	$fn_position = $fn_position[0]; 
$ad_position = false; if($appdate) { array_keys($headers, 'appdate'); 	$ad_position = $ad_position[0]; }
$af_position = array_keys($headers, 'appfrom'); 	$af_position = $af_position[0]; 
$at_position = array_keys($headers, 'appto'); 		$at_position = $at_position[0]; 
$mb_position = array_keys($headers, 'mobile'); 		$mb_position = $mb_position[0]; 
$ph_position = array_keys($headers, 'phone'); 		$ph_position = $ph_position[0]; 
$nt_position = array_keys($headers, 'note'); 		$nt_position = $nt_position[0]; 

// optional fields
if(in_array('address',$headers)) 	{ $as_position = array_keys($headers, 'address'); 	$as_position = $as_position[0]; } else $as_position = false;
if(in_array('city',$headers)) 		{ $cy_position = array_keys($headers, 'city'); 		$cy_position = $cy_position[0]; } else $cy_position = false;
if(in_array('zipCode',$headers)) 	{ $zp_position = array_keys($headers, 'zipCode'); 	$zp_position = $zp_position[0]; } else $zp_position = false;


// $o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {}
$out .= h2('Headers count: '.++$hcount.' columns');


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

$cuein = microtime(true);

$lcount = 0; $skipcount = 0; $ccount = $hcount-1; 
$lines = tolines($handle); // from utililib.php

if(0) { 
$lines = array();
	while (!feof($handle)) {
		$line = substr(fgets($handle),0,-$crlf);
		if(substr($line,0,4)==';;;;') continue; // skips empty lines
		if(substr($line,0,1)=='D') continue; // skips mobikap header lines
		
		$lcount++; $comascount = substr_count($line, ';');
		if($comascount != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
			$skipcount++; notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match:'.$ccount.' expected, '.$comascount.' found)'); continue; }; 
		// $utf8 = utf8_encode(strtolower($line)); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		// $utf8 = strtolower($line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		// $slashed = addslashes($utf8);
		
		$split = explode(';',$line);
		array_walk($split,'normal');
		$lines[] = $split;
	}
}


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

	$SQL = 'SELECT id, mobile, phone, lastname, firstname FROM visitors WHERE groupId = '.$accountId.';';

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
		
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2($visiTotal.' visitors have been loaded from mobminder in: '.$cuedelta.' mseconds');


if($do)
	$out .= h2('DO MODE IS ACTIVE !');
else $out .= warning('not in do mode, use &do=1 for actual DB loading');



//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

$cuein = microtime(true);
$lcount = 0; // lines count
$icount = 0; // insert count
$novmatch = 0; $noresc = 0; $newVisiCount = 0;
foreach($lines as $x => $split) {

		$lcount++;
		
			if($infilerscid) $rscId = $split[$rc_position]; else $rscId = $rescId; // either from file or from uri parameter
			
		if(isset($o_dbAccess_resources->keyed[$rscId]))
			$dS_resource = $o_dbAccess_resources->keyed[$rscId];
		else {
			warning(($noresc++).'<b>BAD RESOURCE ID:</b>'.$rscId.' (line '.$x.', no reference for this resource)');
			continue;
		}
			
			$date = false; if($appdate) $date = $split[$ad_position]; 
			$timein = $split[$af_position]; 
			$timeout = $split[$at_position]; 
			$lastname = $split[$ln_position];  
			$firstname = $split[$fn_position]; if(!$firstname) $firstname = 'inconnu';
		$mobile = preg_replace('/[^0-9]/', '', $split[$mb_position]); // clean up field from non numeric 
		$phone = preg_replace('/[^0-9]/', '', $split[$ph_position]);
		$appNote = $split[$nt_position]; 
			
			$phoneregion = $o_dS_group->phoneRegion;
		if($mobile) $mobile = $mobile; else $mobile = false;
		if($phone) $phone = $phoneregion.$phone; else $phone = false; 
		$name = strtolower($lastname.$firstname);
		$name = str_replace(' ','',$name);
		$visiId = false; $match = '';
		if($mobile) {
			$m = substr($mobile,-9);
			if(isset($byMobile[$m])) {
				$visiId = $byMobile[$m];
				$match = 'match on mobile';
			}
		} 
		if(!$visiId) {
			if($phone) {
				$p = substr($phone,-9);
				if(isset($byPhone[$p])) {
					$visiId = $byPhone[$p];
					$match = 'match on phone';
				}
			}
		}
		if(!$visiId) {
			if(isset($byName[$name])) {
				$visiId = $byName[$name];
				$match = 'match on name';
			}
		}
		
		if(!$visiId) {
			warning(($novmatch++).'<b>NO VISITOR MATCH: </b>(line '.$x.', no reference for the visitor:'.$lastname.', '.$firstname.')');
			$appNote = $lastname.', '.$firstname.' '.$mobile.' - '.$appNote;
			
			if(($lastname&&$mobile)||($lastname&&$phone)) {
				// we create a visitor based on the info given in the mobikap appointment
				
				$dS_visi = new C_dS_visitor(-$newVisiCount, $accountId);
				$dS_visi->lastname = $lastname;
				$dS_visi->firstname = $firstname;
				$dS_visi->mobile = $mobile?$mobile:'';
				$dS_visi->address = $as_position? $split[$as_position] : '';
				$dS_visi->zipCode = $zp_position? $split[$zp_position] : '';
				$dS_visi->city = 	$cy_position? $split[$cy_position] : '';
				$dS_visi->phone = $phone;
				
				if($do) {
					$dS_visi->dSsave(); 
					$nvid = $dS_visi->id;
					if($mobile) $byMobile[$mobile] = $nvid;
						$name=strtolower($lastname.$firstname);
						$name = str_replace(' ','',$name);
					$byName[$name] = $nvid;
					$visiId = $nvid;
				}
				$newVisiCount++;
			}
		}
			if($date) {
					$dd = substr($date,0,2); // date is originally in mobikap like 26-08-16 (dd-mm-yy)
					$mm = substr($date,3,2);
					$yyyy = '20'.substr($date,-2);
					$daty = $yyyy.'-'.$mm.'-'.$dd; // like 2016-08-26
				$daty = str_replace('/', '-', $daty);
				$datyIn = $daty.' '.$timein;
				$datyOut = $daty.' '.$timeout;
				$cueIn = new C_date($datyIn);
				$cueOut = new C_date($datyOut);
				
			} else { // dates are expected like 2018-11-28 09:15
				
				$datyIn = $split[$af_position];
				$datyOut = $split[$at_position];
				
				$cueIn = new C_date($datyIn); 
				$cueOut = new C_date($datyOut);
			}
			
		$o_dS_reservation = new C_dS_reservation(false, $accountId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		$o_dS_reservation->note = $appNote; //iconv('ISO-8859-1', 'UTF-8', $appNote);
			// notice('<b>Appointment: </b>'.$match.' => '.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' with '.$name); // debug
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

	notice('<b>New visitors must be created: </b>'.$newVisiCount.' in total.');

if($do) 
	$out .= h2(''.$icount.' items have been inserted (do not re-execute! or clean-up first), '.$lcount.' lines were scanned. Scanned in: '.$cuedelta.' mseconds');
else
	$out .= h2(''.$icount.' items are prepared (not in do mode), '.$lcount.' lines were scanned. Scanned in: '.$cuedelta.' mseconds');



//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

$out .= h2('Operation SUCCESSFULL: do NOT re-execute this page.');

echo html($out); // from utililib.php


?>