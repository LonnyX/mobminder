<?php
$systemLog = 'apps loader';
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  IMPORTS APPOINTMENTS FROM MOBIKAP EXPORTS - link patients through their mobile number
//
//	following columns are expected:
//
//  appdate	appfrom	appto	lastname	firstname	mobile	phone	registration	note
//
//
//  Usage: http://127.0.0.1/utilities/mobikap.php?id=2891&rsc=7160   <= test mode
//  Usage: http://127.0.0.1/utilities/mobikap.php?id=3059&rsc=7422&cleanup=1&do=1   <= clean up and action mode
// 
//  http://be.mobminder.com/utilities/mobikap.php?id=3510&rsc=9531&do=1
//
//  The filename has a rigid format, like 2891_7160_apps.csv';
//  !! IMPORT VISITORS FIRST !!

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
if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;
if(isset($_GET['rsc'])) $rescId = $_GET['rsc']; else $rescId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = true; else $do = false;


if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');
$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');

//

if(!$rescId) error('You need to give a resource id');

$o_dbAccess_resources = new C_dbAccess_resources($groupId); 
$rcount = $o_dbAccess_resources->count();
if (!$rcount) error('No resource found!');
	else 
		$html->pushHTML('<h2>Resources identified: '.$rcount.' resources</h2>');

$o_dS_resource = $o_dbAccess_resources->keyed[$rescId];
if (!$o_dS_resource) error('No resource found with rescId: bCal!'.$rescId);
	else 
		$html->pushHTML('<h2>Appointments are going to be created for: '.$o_dS_resource->name.'</h2>');
	
$filename = $groupId.'_'.$rescId.'_apps.csv';
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

if(!in_array('appfrom',$headers)) error('Missing mandatory header: appfrom', $handle);
if(!in_array('appto',$headers)) error('Missing mandatory header: appto', $handle);
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);
if(!in_array('firstname',$headers)) error('Missing mandatory header: firstname', $handle);
if(!in_array('mobile',$headers)) error('Missing mandatory header: mobile', $handle);
if(!in_array('phone',$headers)) error('Missing mandatory header: mobile', $handle);
if(!in_array('birthday',$headers)) error('Missing mandatory header: appdate', $handle);
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);

// mandatory fields
$ln_position = array_keys($headers, 'lastname'); 	$ln_position = $ln_position[0]; 
$fn_position = array_keys($headers, 'firstname'); 	$fn_position = $fn_position[0]; 
$af_position = array_keys($headers, 'appfrom'); 	$af_position = $af_position[0]; 
$at_position = array_keys($headers, 'appto'); 		$at_position = $at_position[0]; 
$mb_position = array_keys($headers, 'mobile'); 		$mb_position = $mb_position[0]; 
$ph_position = array_keys($headers, 'phone'); 		$ph_position = $ph_position[0]; 
$nt_position = array_keys($headers, 'note'); 		$nt_position = $nt_position[0]; 
$bd_position = array_keys($headers, 'birthday'); 	$bd_position = $bd_position[0]; 

// optional fields
if(in_array('address',$headers)) 	{ $as_position = array_keys($headers, 'address'); 	$as_position = $as_position[0]; } else $as_position = false;
if(in_array('city',$headers)) 		{ $cy_position = array_keys($headers, 'city'); 		$cy_position = $cy_position[0]; } else $cy_position = false;
if(in_array('zipCode',$headers)) 	{ $zp_position = array_keys($headers, 'zipCode'); 	$zp_position = $zp_position[0]; } else $zp_position = false;


foreach($headers as $hcount => $header) {
	
}
$html->pushHTML('<h2>Headers are compliant with DB definitions: '.++$hcount.' columns</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $ccount = $hcount-1; $fromfile = array();
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
	$fromfile[] = $split;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount -= $skipcount;
$fcount = count($fromfile);
$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' ('.$fcount.') valid lines</h2>');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byMobile = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byMobileCnt = Array(); 

$byPhone = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byPhoneCnt = Array(); 

$byBirthday = Array(); 
$byBirthdayCnt = Array(); 

$byName = Array();
$byNameCnt = Array(); 

	$SQL = 'SELECT id, mobile, birthday, phone, lastname, firstname FROM visitors WHERE groupId = '.$groupId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
		
			$l = $row['lastname'];
			$f = $row['firstname'];
			$initials=strtolower(substr($l,0,1).substr($f,0,1));
			
		$name=strtolower($l.$f);
		$byName[$name] = $row['id'];
		if(isset($byNameCnt[$name])) $byNameCnt[$name]++; $byNameCnt[$name] = 0; // 1 or more, it means that this lastname+firstname combination exeists more that ones in the visitors file
		
			$m = $row['mobile'];
		if($m) {
			$tag = $initials.$m;
			$byMobile[$initials.$m] = $row['id'];
			if(isset($byMobileCnt[$tag])) $byMobileCnt[$tag]++; $byMobileCnt[$tag] = 0; // 1 or more, it means that this mobile is used is many visitor files
		}
		
			$b = $row['birthday'];
		if($b) {
			$tag = $initials.$b;
			$byBirthday[$initials.$b] = $row['id'];
			if(isset($byBirthdayCnt[$tag])) $byBirthdayCnt[$tag]++; $byBirthdayCnt[$tag] = 0; // 1 or more, it means that this mobile is used is many visitor files
		}
		
		
			$p = $row['phone'];
		if($p) {
			$tag = $initials.$p;
			$byPhone[$tag] = $row['id'];
			if(isset($byPhoneCnt[$tag])) $byPhoneCnt[$tag]++; $byPhoneCnt[$tag] = 0; // 1 or more, it means that this mobile is used is many visitor files
		}
		
		
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');


if($do)
	$html->pushHTML('<h2>DO MODE IS ACTIVE !</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  ANNOUNCE JOB START TEST COMPLETION
//
$total = $lcount;
	
	if($cleanup) {
		$html->pushHTML('<h1>CLEANING UP NOW</h1>');
		
		
		$q = new Q('select id from reservations join attendees on attendees.groupId = reservations.id where groupId  = '.$groupId.' and resourceId = '.$rescId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM reservations WHERE id IN ('.$resaIds.');');
			}
			
			// archive table
			$q = new Q('select id from archive_reservations join archive_attendees on archive_attendees.groupId = archive_reservations.id where groupId  = '.$groupId.' and resourceId = '.$rescId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_reservations WHERE id IN ('.$resaIds.');');
			}
			
			$html->pushHTML('<h2>CLEAN UP COMPLETE !</h2>');
	}	
	

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

$cuein = microtime(true);
$SQL = array();
$icount = 0; $iscan = 0; $nomatch = 0; $newVisiCount = 0;
$matchtype = Array(); $matchtype['mobile'] = 0; $matchtype['birthdate'] = 0; $matchtype['phone'] = 0; $matchtype['name'] = 0;
for($x = 0; $x<$fcount; $x++) { 
		
		$iscan++;
		$split = $fromfile[$x];
		$timein = $split[$af_position]; 
		$timeout = $split[$at_position]; 
		$lastname = $split[$ln_position];  
		$firstname = $split[$fn_position]; if(!$firstname) $firstname = 'inconnu';
		$bdate = $split[$bd_position]; 
		$mobile = $split[$mb_position];  
		$phone = $split[$ph_position];  
		$appNote = $split[$nt_position]; 
		
			$visiId = false; $match = '';
			
		if($lastname) if($firstname) { // no attempt to attach to a Mob DB visitor if no both fnam and lname are specified
		
			$initials = strtolower(substr($lastname,0,1).substr($firstname,0,1));
			$name = strtolower($lastname.$firstname);
			if($mobile) { // make it comparable to mob DB format
				$mobile = preg_replace('/[^0-9]/', '', $mobile); // removes any not digits
				$mobile = $initials.'32'.substr($mobile,-9); 
			} else $mobile = false;
			
			if($bdate) { // make it comparable to mob DB format
				$bdate = $initials.$bdate; 
			} else $bdate = false;
			
			if($phone) { // make it comparable to mob DB format
				$phone = $initials.$phone; 
			} else $phone = false;
			
			
			
			if(!$visiId) {
				if($mobile) {
					if(isset($byMobile[$mobile])) {
						if($byMobileCnt[$mobile]==0) {
							$visiId = $byMobile[$mobile];
							$match = 'match on mobile'; $matchtype['mobile']++;
						}
					}
				} 
			}
			if(!$visiId) {
				if($phone) {
					if(isset($byPhone[$phone])) {
						if($byPhoneCnt[$phone]==0) {
							$visiId = $byPhone[$phone];
							$match = 'match on phone'; $matchtype['phone']++;
						}
					}
				} 
			}
			if(!$visiId) {
				if($bdate) {
					if(isset($byBirthday[$bdate])) {
						if($byBirthdayCnt[$bdate]==0) {
							$visiId = $byBirthday[$bdate];
							$match = 'match on birthdate'; $matchtype['birthdate']++;
						}
					}
				} 
			}
			
			if(!$visiId) {
				if(isset($byName[$name])) {
					if($byNameCnt[$name]==0) {
						$visiId = $byName[$name];
						$match = 'match on name'; $matchtype['name']++;
					}
				}
			}
			
		}
		
				$dd = substr($timein,0,2); // date is originally like 26-08-16
				$mm = substr($timein,3,2);
				$yyyy = '20'.substr($timein,6,2);
				$daty = $yyyy.'-'.$mm.'-'.$dd; // like 2016-08-26
			$daty = str_replace('/', '-', $daty);
			$datyIn = $daty.' '.substr($timein,-5); // catch remaining 5 chars
			$cueIn = new C_date($datyIn);
			
			
				$dd = substr($timeout,0,2); // date is originally like 26-08-16
				$mm = substr($timeout,3,2);
				$yyyy = '20'.substr($timeout,6,2);
				$daty = $yyyy.'-'.$mm.'-'.$dd; // like 2016-08-26
			$daty = str_replace('/', '-', $daty);
			$datyOut = $daty.' '.substr($timeout,-5); // catch remaining 5 chars
			$cueOut = new C_date($datyOut);
			
			if($cueOut->t == $cueIn->t) $cueOut->t += 86400;
			
		$o_dS_reservation = new C_dS_reservation(false, $groupId);
		$o_dS_reservation->cueIn = $cueIn->t;
		$o_dS_reservation->cueOut = $cueOut->t;
		$o_dS_reservation->note = iconv('ISO-8859-1', 'UTF-8', $appNote);
		if($do) $o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
		
		if($iscan < 100) { // verbose
		
			$timing = $cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' - ';
			$note = '|'.$o_dS_reservation->note.'|';
			$visitor = '<b>[no visitor]</b>'; if($visiId) {
				$v = new C_dS_visitor($visiId);
				$visitor = ' ['.$v->id.' '.$match.' - '.$v->lastname.', '.$v->firstname.'] ';
			}
			
			notice('(line '.$x.') '.$timing.$visitor.$note);
		}
		
		$o_dS_attendee = new C_dS_attendee(false, $resaId);
		$o_dS_attendee->resourceId = $o_dS_resource->id;
		$o_dS_attendee->resourceType = $o_dS_resource->resourceType;
		
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
	notice('<b>match on mobile: </b>'.$matchtype['mobile']);
	notice('<b>match on birthdate: </b>'.$matchtype['birthdate']);
	notice('<b>match on phone: </b>'.$matchtype['phone']);
	notice('<b>match on name: </b>'.$matchtype['name']);

if($do) 
	$html->pushHTML('<h2>'.$icount.' items have been inserted ( ! DO NOT RE-EXECUTE ! or clean-up first), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');
else
	$html->pushHTML('<h2>'.$icount.' items have been prepared (not in do mode), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

$html->pushHTML('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();


?>