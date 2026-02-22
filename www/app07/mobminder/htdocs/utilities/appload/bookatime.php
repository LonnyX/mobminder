<?php
$systemLog = 'apps loader';
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  IMPORTS APPOINTMENTS FROM BOOKATIME EXPORTS - link patients through their mobile number
//
//	following columns are expected:
//
//  Début	Fin		"infos RDV"		"ref Client" 	Nom		Prénom 		Mail	Portable
//
//
//  Usage: http://127.0.0.1/utilities/smartagenda.php?id=2891&rsc=7160   <= test mode
//  Usage: http://127.0.0.1/utilities/smartagenda.php?id=3059&rsc=7422&cleanup=1&do=1   <= clean up and action mode
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

//  Début	Fin		"infos RDV"	"ref Client" Nom	Prénom Mail	Portable	registration	note

if(!in_array('Date',$headers)) error('Missing mandatory header: Début', $handle);
if(!in_array('Heure',$headers)) error('Missing mandatory header: Fin', $handle);
if(!in_array('Dauer',$headers)) error('Missing mandatory header: Infos RDV', $handle);
if(!in_array('Prénom',$headers)) error('Missing mandatory header: Ref Client', $handle);
if(!in_array('Nom',$headers)) error('Missing mandatory header: Nom', $handle);
if(!in_array('Téléphone',$headers)) error('Missing mandatory header: Prénom', $handle);


// mandatory fields
$dt_position = array_keys($headers, 'Date'); 		$dt_position = $dt_position[0]; 
$af_position = array_keys($headers, 'Heure'); 		$af_position = $af_position[0]; 
$at_position = array_keys($headers, 'Dauer'); 		$at_position = $at_position[0]; 
$fn_position = array_keys($headers, 'Prénom'); 		$fn_position = $fn_position[0]; 
$ln_position = array_keys($headers, 'Nom'); 		$ln_position = $ln_position[0]; 
$mb_position = array_keys($headers, 'Téléphone'); 	$mb_position = $mb_position[0]; 
$nt_position = array_keys($headers, 'Remarque'); 	$nt_position = $nt_position[0]; 

// optional fields
// if(in_array('address',$headers)) 	{ $as_position = array_keys($headers, 'address'); 	$as_position = $as_position[0]; } else $as_position = false;
// if(in_array('city',$headers)) 		{ $cy_position = array_keys($headers, 'city'); 		$cy_position = $cy_position[0]; } else $cy_position = false;
// if(in_array('zipCode',$headers)) 	{ $zp_position = array_keys($headers, 'zipCode'); 	$zp_position = $zp_position[0]; } else $zp_position = false;


// $o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	// if(!array_key_exists($header,$o_dS_defaults))
		// error('The following header has no correspondance in the target visitor table: '.$header, $handle);
}
$html->pushHTML('<h2>Headers are compliant with DB definitions: '.++$hcount.' columns</h2>');


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

$byMobile = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byName = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byInitals = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, mobile, lastname, firstname, registration FROM visitors WHERE groupId = '.$groupId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
			$m = $row['mobile'];
		if($m) $byMobile[$m] = substr($row['id'],-7);
			$l = $row['lastname'];
			$f = $row['firstname'];
			$r = $row['registration'];
			$name=strtolower($l.$f);
		$byName[$name] = $row['id'];
			$initals=strtolower(substr($l,0,2).substr($f,0,2));
		$byInitals[$initals] = $row['id'];
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
$from = @$_GET['f']; 	// generated by this parser when it calls itself
$limit = 2000;
if(!isset($from)) { // then this page is called for the first time, echo request for sending
	
		if($cleanup) {

		$q = new Q('select id from reservations where groupId  = '.$groupId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM reservations WHERE id IN ('.$resaIds.');');
			}
			
			// archive table
			$q = new Q('select id from archive_reservations where groupId  = '.$groupId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_reservations WHERE id IN ('.$resaIds.');');
			}
			
			$html->pushHTML('<h2>CLEAN UP COMPLETE !</h2>');
		}	
	
		$d = ''; if($do) $d = '&do=1';
		$a = $thisScript.'?id='.$groupId.'&rsc='.$rescId.'&f=1'.$d;
		
	$html->pushHTML('<h1>Ready to start the job, by bunches of '.$limit.' items</h1>');
	$html->pushHTML('<a href="'.$a.'">Click to Start creating the appointments</a>');
	$html->dropPage(); 
	die();
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

function rewritedate($adate, $afrom) {  // datetime arrives like 15/01/2016 10:30
	
	$output = '';
	$in_time = ' '.$afrom; // like ' 10:30'
	$in_date = $adate;
	
		$dd = substr($in_date,0,2); 
		$mm = substr($in_date,3,2);		
		$yyyy = '20'.substr($in_date,-2);
	
	$output = $yyyy.'-'.$mm.'-'.$dd.$in_time;
	return $output; // now like '2016-01-15 10:30'
}


$cuein = microtime(true);
$SQL = array();
$icount = 0; $iscan = 0; $to = ($from+$limit-1); $nomatch = 0; $newVisiCount = 0;
for($x = $from-1; $x<$to; $x++,$from++) { 
		
		if($from>=$lcount) break;
		$iscan++;
		$split = $table[$x];
		$adate = $split[$dt_position]; // from
		$afrom = $split[$af_position]; // from
		$aduration = $split[$at_position]; // to
		$lastname = $split[$ln_position];  
		$firstname = $split[$fn_position]; if(!$firstname) $firstname = 'inconnu';
		$mobile = $split[$mb_position];  
		$appNote = $split[$nt_position]; 
			
		if($mobile) {
			$mobile = preg_replace('/[^0-9]/', '', $mobile);
			$digits = substr($mobile,-7);
		} else $mobile = false;
		$name = strtolower($lastname.$firstname);
		$initials = strtolower(substr($lastname,0,2).substr($firstname,0,2));
		$visiId = false; $match = '';
		
		if($mobile) {
			if(isset($byMobile[$digits])) {
				$visiId = $byMobile[$digits];
				$match = 'match on mobile'; // when this match does not exist, the patient might have been removed by doublon removing process
			}
		} 
		if(!$visiId) {
			if(isset($byName[$name])) {
				$visiId = $byName[$name]; // we try to retrieve the patient form through name
				$match = 'match on name';
			}
		}
		if(!$visiId) {
			if(isset($byInitals[$initials])) {
				$visiId = $byInitals[$initials]; // we try to retrieve the patient form through name
				$match = 'match on initials';
			}
		}
		
		if(!$visiId) {
			notice('<b>NO MATCH: </b>'.($nomatch++).' (line '.$x.', no reference for the visitor:'.$lastname.', '.$firstname.')');
			$appNote = $lastname.', '.$firstname.' '.$mobile.' - '.$appNote;
			
			if(($lastname&&$firstname)) {
				// we create a visitor based on the info given in the mobikap appointment
				
				$dS_visi = new C_dS_visitor(-$newVisiCount, $groupId);
				$dS_visi->lastname = $lastname;
				$dS_visi->firstname = $firstname;
				$dS_visi->phone = $mobile?($mobile):'';
				$match = 'no match, visitor created';
				
				if($do) {
					$dS_visi->dSsave(); 
					$nvid = $dS_visi->id;
					if($mobile) $byMobile[$mobile] = $nvid;
					$name=strtolower($lastname.$firstname);
					$byName[$name] = $nvid;
					$byInitals[$initials] = $nvid;
					$visiId = $nvid;
				}
				$newVisiCount++;
			} else {
				$match = 'no match, no visitor created, see app note';
			}
		}
			
			$datyIn = rewritedate($adate, $afrom);
			
		if($icount<10) {
			notice('<b>retrieved: </b>'.$datyIn.' with:'.$lastname.', '.$firstname.' ('.$mobile.' ->'.$match.')');
		}
			
			$cueIn = new C_date($datyIn);
			$cueOut = new C_date($datyIn); $cueOut->sIncrement($aduration*60);
			
		$o_dS_reservation = new C_dS_reservation(false, $groupId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		$o_dS_reservation->note = iconv('ISO-8859-1', 'UTF-8', $appNote);
			// notice('<b>Appointment: </b>'.$match.' => '.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' with '.$name); // debug
		if($do) $o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
		
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
	notice('<b>New visitors must be created: </b>'.$newVisiCount.' in total.');

if($do) 
	$html->pushHTML('<h2>'.$icount.' items have been inserted (do not re-execute! or clean-up first), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');
else
	$html->pushHTML('<h2>'.$icount.' items have been prepared (not in do mode), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  L O O P I N G
//
if($from < $total) {
	$html->pushHTML('<h1>Job not complete, ready to send the next bunch, from '.$from.', '.$limit.' more items</h1>');
		$d = ''; if($do) $d = '&do=1';
		$a = $thisScript.'?id='.$groupId.'&rsc='.$rescId.'&f='.$from.$d;
	$html->pushHTML('<a href="'.$a.'">Click to Start sending next bunch</a>');
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