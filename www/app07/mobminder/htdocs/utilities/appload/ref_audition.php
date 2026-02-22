<?php
$systemLog = 'apps loader';
require '../utililib.php';


//////////////////////////////////////////////////////////////////////////////// 
//
//  I M P O R T S    A P P O I N T M E N T S    F R O M    A   C S V  
//
//  PVH 2024 - This file is the most advanced wrt import of appointments
//
//  This script treats with or without visitor reference (csv may contain a "visiref" column, visitors in DB contain a remote visitor reference in the "reference" field)
//	This script can treat multi-agenda. In this cas the csv must contain a "resource" column. 



////////////////////////////////////////////////////////////////////////////////
//
// C A S E    1  : csv contains no reference to visitor or resource (single account)
//
// localhost/utilities/appload/no_visi_ref.php?id=4604
//
// cuein;cueout;note
// 2019-05-14 17:20:00;2019-05-14 17:40:00;ABSIL Camille ctrl
// 2019-06-18 17:20:00;2019-06-18 17:40:00;ADRIANS Charline Controle 
// 2019-05-09 14:00:00;2019-05-09 14:20:00;ANDRIES Nathalie Pernelle nvl patiente, probleme pilule
// 2019-06-11 16:20:00;2019-06-11 16:40:00;ANNÉ Corinne Controle, HH 
// 2019-05-11 12:20:00;2019-05-11 12:40:00;ANNET Ingrid 12h30 ctrl
// 2019-05-02 16:00:00;2019-05-02 16:20:00;ARLUCIAGA Marine Controle image ovaire droit ,PVPP le rdv du 23/4 , mal noté dans son agenda 
// 2019-05-14 13:00:00;2019-05-14 13:20:00;ARNOLD Béatrice ctrl



////////////////////////////////////////////////////////////////////////////////
//
// C A S E    2  :  csv contains reference to visitor 
//
// localhost/utilities/appload/no_visi_ref.php?id=4604

// cuein;cueout;note;visiref
// 2019-05-14 17:20:00;2019-05-14 17:40:00;ABSIL Camille ctrl;1234
// 2019-06-18 17:20:00;2019-06-18 17:40:00;ADRIANS Charline Controle;3425



////////////////////////////////////////////////////////////////////////////////
//
// C A S E    3  :  csv contains reference to resource 
//
// localhost/utilities/appload/no_visi_ref.php?id=4604

// cuein;cueout;note;resource
// 2019-05-14 17:20:00;2019-05-14 17:40:00;ABSIL Camille ctrl
// 2019-06-18 17:20:00;2019-06-18 17:40:00;ADRIANS Charline Controle 


set_time_limit(60);

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
if(!$accountId) error('You need to give a valid account id');


$do = 0; if(isset($_GET['do'])) if($_GET['do']=='1') $do = 1;
$cleanup = 0; if(isset($_GET['cleanup'])) $cleanup = $_GET['cleanup'];


$dS_group = new C_dS_group($accountId);
if($dS_group->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$dS_group->name.'</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  CLEAN UP
//
if($cleanup) { // first pass, remove older stuff
		
	// current table
	
	if(is_numeric($cleanup)) 
		if($cleanup > 2000) {
			$q = new Q('select reservations.id from reservations join attendees on attendees.groupId = reservations.id where reservations.groupId = '.$accountId.' and attendees.resourceId = '.$cleanup.';');
			$qA = new Q('select archive_reservations.id from archive_reservations join archive_attendees on archive_attendees.groupId = archive_reservations.id where archive_reservations.groupId = '.$accountId.' and archive_attendees.resourceId = '.$cleanup.';');
		}
	else {
		$q = new Q('select id from reservations where groupId = '.$accountId.' and creator = "apps loader";');
		$qA = new Q('select id from archive_reservations where groupId = '.$accountId.' and creator = "apps loader";');
	}
	$resaIds = $q->ids();
	
	if($do) if($resaIds != '') {
		
		new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM performances WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM reservations WHERE groupId ='.$accountId.' and creator = "apps loader";');
		
		$out .= h2('Clean up complete on current reservations tables');
	} 

	// archive table
		
	$resaIds = $qA->ids();
	
	if($do) if($resaIds != '') {
		
		new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM archive_performances WHERE groupId IN ('.$resaIds.');');
		new Q('DELETE FROM archive_reservations WHERE groupId ='.$accountId.' and creator = "apps loader";');
		
		$out .= h2('Clean up complete on archive reservations tables');
		
	} 

	if(!$do)
		$out .= h2('ready to proceeed with Clean up of reservations tables but you are not in do mode (cleanup='.$cleanup.')');
}



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//
// Identify and open the file
$cwd = getcwd(); echo 'CWD:'.$cwd.' FROM '.dirname(__FILE__);


$matches = glob($cwd.'/'.$accountId.'*.csv');
if(count($matches)==0) error('No file was found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');

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



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING HEADERS, presence and position
//


$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF

$positions = Array();

	// resource (can be an id or a name that we match later using a switch)

	if(!in_array('resource',$headers)) $has_resc_name = false; else { // match agenda resource using a name (correlators in the code below)
		$has_resc_name = true; 
		$positions['resource'] = array_search('resource', $headers);
	}
	if(!in_array('rscid',$headers)) $has_resc_id = false; else { // match agenda resource using their mobminder id
		$has_resc_id = true; 
		$positions['rscid'] = array_search('rscid', $headers);
	}
	
	// performance (can be an id or a name that we match later using a switch)
	
	if(!in_array('performance',$headers)) $has_perf_name = false; else { // match performance using a name (correlators in the code below)
		$has_perf_name = true; 
		$positions['performance'] = array_search('performance', $headers);
	}
	if(!in_array('perfid',$headers)) $has_perf_id = false; else { //  match performance using a their mobminder id
		$has_perf_id = true; 
		$positions['perfid'] = array_search('perfid', $headers);
	}
	
	// pattern (can be an id or a name that we match later using a switch)
	
	if(!in_array('pattern',$headers)) $has_pattern_name = false; else { // match pattern using a name (correlators in the code below)
		$has_pattern_name = true; 
		$positions['pattern'] = array_search('pattern', $headers);
	}
	if(!in_array('patternid',$headers)) $has_pattern_id = false; else { //  match pattern using a their mobminder id
		$has_pattern_id = true; 
		$positions['patternid'] = array_search('patternid', $headers);
	}
	
	// custom color (can be an id or a name that we match later using a switch)
	
	if(!in_array('color',$headers)) $has_color_name = false; else { // match color using a name (correlators in the code below)
		$has_color_name = true; 
		$positions['color'] = array_search('color', $headers);
	}
	if(!in_array('colorid',$headers)) $has_color_id = false; else { //  match color using a their mobminder id
		$has_color_id = true; 
		$positions['colorid'] = array_search('colorid', $headers);
	}
	
	// a shorty note or patient name that can be inserted if the reference is not found in the visitors DB for that group
	if(!in_array('shorty',$headers)) $has_shorty = false; else { //  match performance using a their mobminder id
		$has_shorty = true; 
		$positions['shorty'] = array_search('shorty', $headers);
	}



if(!in_array('reference',$headers)) $has_visi_ref = false; else { // match visitors using a reference that was uploaded in field visitors::reference when visiload was used
	$has_visi_ref = true;
	$positions['reference'] = array_search('reference', $headers);
}

$has_note3 = false; $has_note2 = false; $has_note = false; 
if(in_array('note',$headers)) { // appointment note
	$has_note = true;
	$positions['note'] = array_search('note', $headers);
	
	if(in_array('cat',$headers)) {
		$has_note2 = true;
		$positions['cat'] = array_search('cat', $headers);
	}
	
	if(in_array('desc',$headers)) {
		$has_note3 = true;
		$positions['desc'] = array_search('desc', $headers);
	}
	
	if(in_array('empl',$headers)) {
		$has_note4 = true;
		$positions['empl'] = array_search('empl', $headers);
	}
}


$splitdatetime = false; // time is not in the same field as date
$splitduration = false;

if(in_array('datefrom',$headers)!==false) { // Ubicentrex has this
	
		$splitdatetime = true; // date and time arriving in different coloms
		$positions['datefrom'] 	= array_search('datefrom', $headers);
		$positions['dateto'] 	= array_search('dateto', $headers);
		$positions['timefrom'] 	= array_search('timefrom', $headers);
		$positions['timeto'] 	= array_search('timeto', $headers);
		
} else if(in_array('datetimein',$headers)!==false) {  // date arriving like datetimein [yyyy-mm-jj hh:mm]	datetimeout [yyyy-mm-jj hh:mm]
	
		$splitdatetime = false; // date and time arriving in different coloms
		$positions['datetimein'] 	= array_search('datetimein', $headers);
		$positions['datetimeout'] 	= array_search('datetimeout', $headers);
		
}else if(in_array('eudatetimein',$headers)!==false) {  // date arriving like eudatetimein [dd/mm/yyyy hh:mm]	eudatetimeout [dd/mm/yyyy hh:mm]
		// DoctorAnyTime has this
		// Doctena Lux has this, watch out : status column has a CANCELLED value, those appointments should not be loaded
		$splitdatetime = false; // date and time arriving in different coloms
		$positions['eudatetimein'] 	= array_search('eudatetimein', $headers);
		$positions['eudatetimeout'] = array_search('eudatetimeout', $headers);
		
} else if (in_array('appdate',$headers)!==false) { // date arriving like appdate [yyyy-mm-jj]	apptime [hh:mm]	 duration [mm], Doctolib has this export format 

		$splitduration = true;
		$splitdatetime = true; // date and time arriving in different coloms

		$positions['appdate'] 	= array_search('appdate', $headers);
		$positions['apptime'] 	= array_search('apptime', $headers);
		$positions['duration'] 	= array_search('duration', $headers); // duration is given in minutes
}



foreach($headers as $hcount => $header) {
}
$out .= h2('<h2>Headers: '.++$hcount.' columns</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//

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
$lines = tolines($handle, detect_encoding, $tolower = false); // from utililib.php


$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');

	

$lc = 0; foreach($lines as $x => $split) {
	$lc++;
	$hc = count($split);
	if(count($split)!=$hcount) {
		// $out .= warning('Line :'.$lc.' / number of fields does not match : '.$hc); // commented for Audtion Confort import
	}
}
	

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING MOB ACCOUNT META
//

$visitors_by_reference = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
if($has_visi_ref) {

			$cuein = microtime(true); $visiTotal = 0;
			
	$SQL = 'SELECT id, reference FROM visitors WHERE visitors.groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL); if(!$result) error('SQL failed:'.$SQL.' ');
	while ($row = $result->fetch_array()) {
		$r = $row['reference'];
		if(strpos($r, '#') !== false) { $r = explode('#',$r); $r = $r[0]; };
		$ref = strtolower($r);
		$ref = preg_replace('/\s+/', '', $ref); // is all lower letters and contain no spaces, see (*vl01*)
		
		$visitors_by_reference[$ref] = $row['id'];
		
		// $out .= h3('visitors_by_reference: '.$ref.' is vid '.$row['id']);
		$visiTotal++;
	}
	$result->close();
		
		$cueout = microtime(true);
		$cuedelta = (($cueout-$cuein)*1000)|0;
		$out .= h2('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');

}

$acc_workcodes = false;
if($has_perf_name||$has_perf_id) {

	$acc_workcodes = new C_dbAccess_workcodes($accountId);
	
}

$acc_colors = false;
if($has_color_name||$has_color_id) {

	$acc_colors = new C_dbAccess_customCss($accountId);
	
}

$acc_patterns = false;
if($has_pattern_name||$has_pattern_id) {

	$acc_patterns = new C_dbAccess_customCss($accountId);
	
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOCAL LIB
//

function eu_rewritedate($datetime) {  // datetime arrives like 15/01/2016 10:30  
	
	// [dd/mm/yyyy hh:mm]  // where dd and hh can be either one or two digits ( like '3/12/2016' or '9:30' )
	
	$dtsplit = explode(' ',$datetime);
	$in_date = $dtsplit[0]; // substr($datetime,0,10); // like 15/01/2016
	$in_time = $dtsplit[1]; // substr($datetime,11,5); // input like '10:30:00' turns into '10:30' (!! takes also '9:30:' from 15/01/2016 9:30:00 which is ok as the code is written ;)
	
	$hmsplit = explode(':',$in_time);
	$h = $hmsplit[0]; // substr($in_time,0,2); 
	$mn = $hmsplit[1];// substr($in_time,3,2);
	
	$hh = sprintf("%02d", $h); // makes '02'h from '2'h
	
	$output = '';
	
	$datesplit = explode('/',$in_date);
	
		$dd = $datesplit[0]; //substr($in_date,0,2); 
		$mm = $datesplit[1]; //substr($in_date,3,2);		
		$yyyy = $datesplit[2]; //substr($in_date,-4);
		
	$dd = sprintf("%02d", $dd); // makes '02'h from '2'h
	$mm = sprintf("%02d", $mm); // makes '02'h from '2'h
	
	$output = $yyyy.'-'.$mm.'-'.$dd.' '.$hh.':'.$mn;
	return $output; // now like '2016-01-15 10:30'
}

function us_rewritedate($datetime) {  // datetime arrives like 2023-01-16T13:00:00.000Z  (doctena Lux)
	
	// [dd/mm/yyyy hh:mm]
	
	$in_date = substr($datetime,0,10); // like 2023-01-16
	$in_time = substr($datetime,11,5); // like '13:00'
	
	$output = '';
	
		$dd = substr($in_date,8,2); 
		$mm = substr($in_date,5,2);		
		$yyyy = substr($in_date,0,4);
	
	$output = $yyyy.'-'.$mm.'-'.$dd.' '.$in_time;
	return $output; // now like '2016-01-15 10:30'
}



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING RESOURCE
//
if($has_resc_name) { 
	$out .= h2('<h2>Matching resources using a remote name</h2>');
}
else if(!$has_resc_id) { // expected to be a single account
	
	$q = new Q('select id from resources where groupId = '.$accountId.' limit 1;');
	$c = $q->cnt();
	if($c==0) error('This account seems to have no resource'); 
	if($c>1) error('This account seems to have many resources, you must specify resources using rescid or resource name in incoming csv'); 
	$rescId = $q->ids(); // (**01**)
	
	$dS_resource = new C_dS_resource($rescId);
	$out .= h2('<h2>Appointments will be created in agenda : '.$dS_resource->name.'</h2>');
	
} else {
	$rescId = false;
}
	

$acc_resources = new C_dbAccess_resources($accountId);
	
	


set_time_limit(60);


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

	$cuein = microtime(true);
	$icount = 0;
	$xcount = 0;
	
	$verbose = 100;
	$visilinkscounter = 0;
	
	$resccounters = Array();
function add4resc($which) {
	global $out, $resccounters;
	if(isset($resccounters[$which])) $resccounters[$which]++;
	else $resccounters[$which] = 1;
}
function displayRescCounters() {
	global $out, $resccounters;
	$out .= h2('resources linked');	
	foreach($resccounters as $rscid => $value) {
		$out .= notice('resource id '.$rscid.' counts '.$value);	
	}

}


function audition($date, $time) {
	
	// 1) Vérif format de $date : d/m/Y
    //    - jour : 01–31
    //    - mois : 01–12
    //    - année : 4 chiffres
    if (!preg_match(
        '#^(0?[1-9]|[12][0-9]|3[01])/(0?[1-9]|1[0-2])/[0-9]{4}$#',
        $date
    )) {
        return false;
    }

    // 2) Vérif format de $time : H:i:s
    //    - heure : 00–23
    //    - minutes/secondes : 00–59
    if (!preg_match(
        '#^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$#',
        $time
    )) {
        return false;
    }

    // 3) On laisse DateTime vérifier que la combinaison date+time est cohérente
    $dt = DateTime::createFromFormat('d/m/Y H:i:s', $date . ' ' . $time);
    $errors = DateTime::getLastErrors();

    if ($dt === false || $errors['warning_count'] > 0 || $errors['error_count'] > 0) {
        // ex : 31/02/2025 12:00:00 passera la regexp mais sera rejeté ici
        return false;
    }

    // 4) Format de sortie : YYYY-MM-DD HH:MM
    return $dt->format('Y-m-d H:i');
}



	
foreach($lines as $x => $split) {
		
	$visiId = false;
	$perfid = false;
	$colorid = false;
	$patternid = false;
	
	// Agenda resource association
	//
	
	if($has_resc_name) { 
		$resource = $split[$positions['resource']];   
		switch($resource) {
			case 'VIC': $rescId = 22202; break; // CB
			case 'EU': $rescId = 22203; break; 
			case 'MVH': $rescId = 22204; break; 
			case 'PD': $rescId = 22206; break; 
			case 'YL': $rescId = 22205; break; 
			
			default:
				$rescId = 11;
				$out.= warning('Ouuups! the resource name found in the csv was not expected: '.$resource);
				// $rescId = 0;
		}
		
	} else if($has_resc_id) { // the mobminder resource id is already available in the incoming csv
	
		$rescId = $split[$positions['rscid']];   
		
	} else {
		// single account, rescid was set here (**01**)
	}
	
	if(!$acc_resources->hasKey($rescId)) { // skip unmatched resources
		$out.= warning('<b>unlinkable resource: </b> line '.$x.' the provided resource id ('.$resource.') does not match any of account rescId: '.$rescId);
		continue;
	} else {
		
		add4resc($rescId); 
	}
	
	
	
	// mandatory appointment schedule
	//
	
	if($splitdatetime) { // dates and timing are not in the same field
	
		if($splitduration) { // when you have date, time and duration only (can not span over midnight)
			
			$datyIn = $split[$positions['appdate']]; // AAAA-MM-JJ
			$datyOut = $split[$positions['appdate']];
			$datyIn .= ' '.$split[$positions['apptime']]; // HH:MM
			$datyOut .= ' '.$split[$positions['apptime']]; 
		}	
		else {
			// $datyIn = $split[$positions['datefrom']]; // AAAA-MM-JJ
			// $datyOut = $split[$positions['dateto']];  
			// $datyIn .= ' '.$split[$positions['timefrom']]; // HH:MM
			// $datyOut .= ' '.$split[$positions['timeto']];  
			
			$datyIn = audition($split[$positions['datefrom']],$split[$positions['timefrom']]); // arriving as d/m/y + h:m:ss
			$datyOut = audition($split[$positions['dateto']],$split[$positions['timeto']]);
			
			if(!$datyIn) {
				$out.= warning('<b>wrong format in datefrom timefrom: </b> '.$positions['datefrom'].' '.$positions['timefrom']);
				continue;
			}
			if(!$datyOut) {
				$out.= warning('<b>wrong format in datefrom timefrom: </b> '.$positions['dateto'].' '.$positions['timeto']);
				continue;
			}
		}
		
	} else { // date and time are together in one string
		
		if(in_array('datetimein',$headers)!==false) {  	// [yyyy-mm-jj hh:mm]
		
			$cin = $split[$positions['datetimein']]; 
			$cout = $split[$positions['datetimeout']]; 
			
			$datyIn  = us_rewritedate($cin); 
			$datyOut = us_rewritedate($cout); 
		
		} else if(in_array('eudatetimein',$headers)!==false) {	// [dd/mm/yyyy hh:mm]
		
			$cin = $split[$positions['eudatetimein']];
			$cout = $split[$positions['eudatetimeout']];
			
			$datyIn  = eu_rewritedate($cin); 
			$datyOut = eu_rewritedate($cout); 
			
			// echo $datyIn.'<br/>';
			
			// $out.= notice('datyIn:'.$datyIn.', datyOut:'.$datyOut);
		}
	}
	
	$cueIn = new C_date($datyIn);
	$cueOut = new C_date($datyOut);

	if($splitdatetime)
		if($splitduration) {
			$cueOut->sIncrement(60*$split[$positions['duration']]); // duration is given in minutes
		}
	
	
	// visitors
	
	if($has_visi_ref) { // optional (but most frequent) : appointment with visitor
		
		$visiref = $split[$positions['reference']];
		$visiref = strtolower($visiref);
		$visiref = preg_replace('/\s+/', '', $visiref); // is all lower letters and contain no spaces, see (*vl01*)
		// $visiref = str_replace(' ', '', $visiref); // is all lower letters and contain no spaces, see (*vl01*)
		
		if($visiref!==''&&$visiref!=='0') {
			if(!isset($visitors_by_reference[$visiref])) {
				$shorty = ''; if($has_shorty) if($positions['shorty']) $shorty = ' [shorty:'.$split[$positions['shorty']].'] ';
				$out .= notice('<b>unlinkable visitor: </b> line '.$x.' (no reference for the visitor:'.$visiref.')'.$shorty); // continue;
				
			} else $visiId = $visitors_by_reference[$visiref];
		}
		else $visiId = 0;
	}
	
	// workcodes / performance
	
	$perfid = false;
	if($has_perf_name) { 
		$perfalias = strtolower($split[$positions['performance']]); 
		
	$perfid = 0;	
	if(strpos($perfalias, 'consultation') !== false) $perfid = 57422;
	else if(strpos($perfalias, 'enfant') !== false) $perfid = 57425;// controle enfant
	else if(strpos($perfalias, 'court') !== false) $perfid = 57424; // controle court
	else if(strpos($perfalias, 'contrôle') !== false) $perfid = 57423; // controle + us
		else if(strpos($perfalias, 'controle') !== false) $perfid = 57423; // controle + us
		else if(strpos($perfalias, 'ctrl') !== false) $perfid = 57423; // controle + us
	else if(strpos($perfalias, 'rx') !== false) $perfid = 57436;
	else if(strpos($perfalias, 'détartrage') !== false) $perfid = 57428;
		else if(strpos($perfalias, 'det') !== false) $perfid = 57428;
	else if(strpos($perfalias, 'obturation') !== false) $perfid = 57432;
		else if(strpos($perfalias, 'obt') !== false) $perfid = 57432;
	else if(strpos($perfalias, 'endo') !== false) $perfid = 57429;
	else if(strpos($perfalias, 'extraction') !== false) $perfid = 57430;
		else if(strpos($perfalias, 'ext') !== false) $perfid = 57430;
	else if(strpos($perfalias, 'urgence') !== false) $perfid = 57533;
		else if(strpos($perfalias, 'urg') !== false) $perfid = 57533;
	else if(strpos($perfalias, 'goutt') !== false) $perfid = 57431;
	else if(strpos($perfalias, 'proth') !== false) $perfid = 57435;
	else if(strpos($perfalias, 'overlay') !== false) $perfid = 57433;
	else if(strpos($perfalias, 'bridge') !== false) $perfid = 57433;
	else if(strpos($perfalias, 'implant') !== false) $perfid = 57427; // couronne sur implant
	else if(strpos($perfalias, 'couronne') !== false) $perfid = 57426;
	else if(strpos($perfalias, 'placement') !== false) $perfid = 57434; // placement implant
	else if(strpos($perfalias, 'confirmer') !== false) $perfid = 57534;
		else if(strpos($perfalias, 'à conf') !== false) $perfid = 57534;
		
		// switch($perfalias) { // this mapping is manual and should be adapted for each import

// case 'Consultation générale': 						$perfid = 54020; break;
// case 'Visite à domicile': 							$perfid = 54023; break;
// case 'Renouvellement de traitement': 				$perfid = 54031; break;
// case 'Vaccination': 								$perfid = 54035; break;
// case 'Prise de sang': 								$perfid = 54027; break;

// Consultation	57422
// Contrôle + us	57423
// Contrôle court	57424
// RX / Petit rdv	57436
// Contrôle enfant	57425
// Détartrage	57428
// Obturation	57432
// Endo	57429
// Extraction	57430
// Urgence	57533
// Gouttières Ortho	57431
// Prothèse	57435
// Couronne	57426
// Overlay	57433
// Couronne sur implant	57427
// Placement implant	57434
// A confirmer	57534
		
		
			// case '': $perfid = 0; break;
			// default:
				// $out.= notice('Ouuups! this performance name was not expected: '.$perfalias);
				// $perfid = 0;
		// }
		
	} else if($has_perf_id) { // optional
		$perfid = $split[$positions['perfid']]; // the incoming csv is foreseen with mobminder workcode id
	}
	
	if($acc_workcodes)
		if(!$acc_workcodes->hasKey($perfid)) { // skip unmatched performances	
			$perfid = false;
		}
		
	
	// color
	
	if($has_color_name) { 
		$coloralias = $split[$positions['color']];   
		switch($coloralias) { // this mapping is manual and should be adapted for each import
			case 'ABSENCE': $colorid = 27312; break;
			case 'ABSENCE - CP': $colorid = 27312; break;
			case 'ABSENCE - RTT': $colorid = 27312; break;
			case 'Arrêt maladie': $colorid = 27312; break;
			case 'VISITE PATRIMOINE': $colorid = 33178; break;
			case 'US - Rendez-Vous': $colorid = 35234; break;
			case '': $colorid = 0; break;
			default:
				$out.= notice('Ouuups! this color name was not expected: '.$perfalias);
				$colorid = 0;
		}
		
	} else if($has_color_id) { // optional
		$colorid = $split[$positions['colorid']]; // the incoming csv is foreseen with mobminder workcode id
	}
	
	if($colorid) // screen against the account existing colors
		if($acc_colors)
			if(!$acc_colors->hasKey($colorid)) { // skip unmatched colors, not existing in account config
				$out.= notice('Dropped color id '.$colorid.' this color id was not expected.');
				$colorid = false;
			} else {
				// $out.= notice('added colorid '.$colorid.'.');
			}
		
		
		
	
	// patterns
	
	if($has_pattern_name) { 
		$patternalias = $split[$positions['pattern']];   
		switch($patternalias) { // this mapping is manual and should be adapted for each import
			case '6 EDL - Annulé / reporté': 	$patternid = 45109; break;
			
			case 'EDL Dossier traité': 			$patternid = 53239; break;
			case 'Diag terminé': 				$patternid = 53240; break;
			case 'RDV annulé': 					$patternid = 53241; break;
			
			case '1 Départ DI': 				$patternid = 53244; break;
			case 'REGIE LOCATAIRE ABSENT AU RDV': 	$patternid = 53248; break;
			
			case '2 Retour DI': 				$patternid = 53245; break;
			
			case '': $patternid = 0; break;
			default:
				$out.= notice('Ouuups! this pattern name was not expected: '.$patternalias);
				$patternid = 0;
		}
		
	} else if($has_pattern_id) { // optional
		$patternid = $split[$positions['patternid']]; // the incoming csv is foreseen with mobminder workcode id
	}
	
	if($acc_patterns)
		if(!$acc_patterns->hasKey($patternid)) { // skip unmatched patterns, not existing in account config
			$patternid = false;
		}
		
		


		
		
	// now build the time reservation	
	$pivot = new C_date();
	$pivot->mIncrement(-12*12); // we limit the import to the 7 last years.
	if($cueOut->isBefore($pivot)) {
		$xcount++; // counts xcluded items
		$out.= warning('<b>TIMEFRAME EXCLUSION: </b> with:'.$rescId.' schedule:'.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString()); // debug
	}
	else {
		$dS_reservation = new C_dS_reservation(false, $accountId);
		$dS_reservation->cueIn = $cueIn->getTstmp();//+3600;
		$dS_reservation->cueOut = $cueOut->getTstmp();//+3600;
		$appnote = '';
		if(!$visiId) if($has_shorty) if($positions['shorty']) $appnote = '['.$split[$positions['shorty']].'] ';
		if($has_note) {
			// $appnote .= $split[$positions['note']];
			// if($has_note2) if($split[$positions['note2']]) $appnote .= '\n'.$split[$positions['note2']];
			// if($has_note3) if($split[$positions['note3']]) $appnote .= '\n'.$split[$positions['note3']];
			
			$dS_reservation->note = $split[$positions['note']];
			if($split[$positions['cat']]) $dS_reservation->note .= '\n'.$split[$positions['cat']];
			if($split[$positions['desc']]) $dS_reservation->note .= '\n'.$split[$positions['desc']];
			if($split[$positions['empl']]) $dS_reservation->note .= '\n'.$split[$positions['empl']];
			
			$appnote = $dS_reservation->note = $split[$positions['note']];
		}	
		if($colorid) {
			$dS_reservation->cssColor = $colorid;
		}	
		if($patternid) {
			$dS_reservation->cssPattern = $patternid;
		}	
			
		if($verbose) {
			$out.= notice('<b>Appointment: </b> with:'.$rescId.' schedule:'.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' ('.$appnote.')'); // debug
			$verbose--;
		}
				
		if($do) {
			$dS_reservation->dSsave();
			$resaId = $dS_reservation->id;
		} else { $resaId = 99; }
			
			
		
			$dS_attendee = new C_dS_attendee(false, $resaId);
			$dS_attendee->resourceId = $rescId;
			$dS_attendee->resourceType = class_bCal;
			// $out .= microtab('$dS_attendee->resourceId = '.$rescId);
		
			if($visiId) { // some reservations have no visitor attached
				$dS_att_visitor = new C_dS_att_visitor(false, $resaId);
				$dS_att_visitor->resourceId = $visiId;
				$dS_att_visitor->resourceType = class_visitor;
				$visilinkscounter++;
			}
			
			if($perfid) {
				$dS_perf = new C_dS_performance(false, $resaId);
				$dS_perf->visitorId = $visiId;
				$dS_perf->workCodeId = $perfid;
			}
			
		if($do) {
			$dS_attendee->dSsave();
			// $out .= microtab('$dS_attendee->resourceId = '.$dS_attendee->resourceId);
			if($visiId) $dS_att_visitor->dSsave();
			if($perfid) $dS_perf->dSsave();
		}
		
		$icount++;
	}
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;


	$out .= h2('<h2>'.$visilinkscounter.' visitors were linked</h2>');		

	displayRescCounters();


if($do)
	$out .= h2('<h2>'.$icount.' items have been inserted ('.$xcount.' skipped). Scanned in: '.$cuedelta.' mseconds</h2>');
else 
	$out .= h2('<h2>'.$icount.' items can be inserted ('.$xcount.'  skipped). Scanned in: '.$cuedelta.' mseconds</h2>');






//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

if($do)
	$out .= h2('<h2>Operation SUCCESSFULL:  <b> D O   N O T   re-execute this page.</b></h2>');
else 
	$out .= h2('<h2>Test SUCCESSFULL: looks good, now execute it in do mode to save the data.</h2>');

echo html($out); // from utililib.php






?>