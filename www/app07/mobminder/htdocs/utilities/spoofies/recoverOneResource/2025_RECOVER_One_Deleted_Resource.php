<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
// Main steps:
//
// A: Retrieve an SQL Dump from /home/debien/transfer/out/
// B: Download SQL Dump to your dev
// C: RE-execute on dev so to have access to the situation just BEFORE the resource was deleted.
// D: Make the .csv files, using Navicat and the hereunder queries.
// E: Manually Remove again the resource using Setup M_RESC delete()
// F: Execute this spoofy on dev, all the appointments should be back.
// G: Transfer spoofy and csv's to the prod server
// H: Execute this spoofy on prod, all the appointments should be back. Mission accomplished.
//
//
// 
// -- this is the SQL you need to setup the 9 files needed to recover a resource that was unintentionaly removed from production
//
// -- Recover_resources.csv
//
// -- Recover_reservations.csv
// -- Recover_archive_reservations.csv
//
// -- Recover_attendees.csv
// -- Recover_archive_attendees.csv
//
// -- Recover_att_visitors.csv
// -- Recover_archive_att_visitors.csv
//
// -- Recover_performances.csv
// -- Recover_archive_performances.csv
//
// This query is also available in the Navicat mobminder DB (click "queries", then you find "RecoverFromDeletedResource"
//
// In this example, 4958 is the account id ( c_dS_group.id ) and 15976 is the C_dS_resource id

// select * from resources where id = 15976;  -- Recover_resources.csv  (only one line)

// -- This one is needed to reset the view order of the account manager (otherwise, even re-setup, the resource will not show up on the planning (becasue out of AM view).
// select * from accesskeys where accountId = 4958 and groupId = 7881;
// update accesskeys set bCals = '' where id = 47938;



// select reservations.* from reservations -- Recover_reservations.csv
  // join attendees on attendees.groupId = reservations.id
  // where reservations.groupId = 4958 and attendees.resourceId = 15976;
  

// select archive_reservations.* from archive_reservations  -- Recover_archive_reservations.csv
  // join archive_attendees on archive_attendees.groupId = archive_reservations.id
  // where archive_reservations.groupId = 4958 and archive_attendees.resourceId = 15976;
  
  

// select attendees.* from attendees where attendees.resourceId = 15976;     -- Recover_attendees.csv


// select archive_attendees.* from archive_attendees where archive_attendees.resourceId = 15976;   -- Recover_archive_attendees.csv
  


// select att_visitors.* from reservations    -- Recover_att_visitors.csv
  // join att_visitors on att_visitors.groupId = reservations.id
  // join attendees on attendees.groupId = reservations.id
  // where reservations.groupId = 4958 and attendees.resourceId = 15976;


// select archive_att_visitors.* from archive_reservations   -- Recover_archive_att_visitors.csv
  // join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
  // join archive_attendees on archive_attendees.groupId = archive_reservations.id
  // where archive_reservations.groupId = 4958 and archive_attendees.resourceId = 15976;



// select performances.* from reservations    -- Recover_performances.csv
  // join performances on performances.groupId = reservations.id
  // join attendees on attendees.groupId = reservations.id
  // where reservations.groupId = 4958 and attendees.resourceId = 15976;
  

// select archive_performances.* from archive_reservations   -- Recover_archive_performances.csv
  // join archive_performances on archive_performances.groupId = archive_reservations.id
  // join archive_attendees on archive_attendees.groupId = archive_reservations.id
  // where archive_reservations.groupId = 4958 and archive_attendees.resourceId = 15976;
		  

// select * from workexperts where resourceId = 15976;



//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function h3($t) { return '<h3 style="white-space:nowrap; color:	#333344; font-size:1.1em;">'.$t.'</h3>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }

if(function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 0);
ini_set('output_buffering', 0);


function mb_lcfirst(string $s, string $encoding = 'UTF-8'): string {
    if ($s === '') {
        return '';
    }
    $firstChar = mb_substr($s, 0, 1, $encoding);
    $then      = mb_substr($s, 1, null, $encoding);
    return mb_strtolower($firstChar, $encoding) . $then;
}


$csvsep = ',';



//////////////////////////////////////////////////////
//
//  HTML display
//



// 2) Envoi des headers pour désactiver buffering proxys / navigateurs
header('Content-Type: text/html');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');

// 3) Vider tous les buffers existants
while(ob_get_level() > 0) { ob_end_flush(); }


// 4) Activer l’implicit flush : chaque echo() se flush automatiquement
ob_implicit_flush(1);


	$pathfile = $_SERVER["SCRIPT_NAME"];
	$break = Explode('/', $pathfile);
	$thisScript = $break[count($break) - 1]; 

	$o = '<!DOCTYPE HTML>';
	$o .= '<html>';
		$o .= '<head>';
		$o .= '<title>'.$thisScript.'</title>';
		$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
		$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
		$o .= '<head>';
	$o .= '<body>';
	echo $o;
	


set_time_limit(360);


// In this function, we want to pass a class defitinition as argument into $leadclass.
// Then later in this function we want to instanciate using smth like $instance = new $leadclass();
// 

function worldChampion($leadClass,$filename,$color1='darkblue',$color2='black') {
	
	global $csvsep;
	$csvFile = __DIR__ . '/'.$filename; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	
	echo h2('Table: '.$filename);
	if(($handle = fopen($csvFile, 'r')) === false) die("Impossible d'ouvrir le fichier $csvFile\n");
	$headers = fgetcsv($handle, 0, $csvsep); // adapt ',' into ';' depending of the kind of csv
	if($headers === false) die("Le fichier semble vide ou invalide\n");
	$cols = array_flip($headers);
	
	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$stop = 100000;
	$step = 100;
	$keepgoing = true;
	$c = 1;
	$set = 0;

	// Parcours ligne par ligne
	while((($row = fgetcsv($handle, 0, $csvsep)) !== false)&&$keepgoing) { // adapt ',' into ';' depending of the kind of csv
		
		$color = $c%2 ? $color1 : $color2;
		$show = $c < 100;
		
		if($show) echo '<div style="color:'.$color.'">';
		$preset = Array();
		foreach($headers as $x => $h) {
			$preset[$h] = $row[$x];
		}
			$aid = $row[$cols['groupId']];
		$dS_r = new $leadClass(0,$aid,$preset);
		$dS_r->id = $row[$cols['id']];
		
		if($show) echo '<br/><br/>#'.$c.', id='.$dS_r->id.'<br/>';
		if($show) print_r($dS_r);
		
		if($show) echo '<span style="color:red;">';
			$dS_r->save($aid,true);
		if($show) echo '</span>';
		
		$dS_r_check = new $leadClass($dS_r->id);
		
		if($show) echo '<br/><br/>   check   id='.$dS_r->id.'<br/>';
		if($show) print_r($dS_r_check);
		
		
		if($show) echo '<br/>----------------------------------<br/>';
		if($show) echo '</div>';
		$keepgoing = ($c<$stop); 
		$c++;
	}
	fclose($handle);
	echo '</div>';
	
}


//////////////////////////////////////////////////////
//
//  Now let's execute the magic, calling the worldChampion() function for each necessary Class
//

// ( uncomment the sections you want to execute )

	// echo h1('Table: resources');
	
// worldChampion('C_dS_resource','Recover_resources.csv');



	// echo h1('Table: reservations');
// worldChampion('C_dS_reservation','Recover_reservations.csv','cyan','magenta');
	// echo h1('Table: archive_reservations');
// worldChampion('C_dS_reservation','Recover_archive_reservations.csv','cyan','orange');



	// echo h1('Table: attendees');
// worldChampion('C_dS_attendee','Recover_attendees.csv','green','blue');

	// echo h1('Table: archive_attendees');
// worldChampion('C_dS_attendee','Recover_archive_attendees.csv','green','magenta');



	// echo h1('Table: att_visitors');
// worldChampion('C_dS_att_visitor','Recover_att_visitors.csv','green','blue');

	// echo h1('Table: archive_attendees');
// worldChampion('C_dS_att_visitor','Recover_archive_att_visitors.csv','green','magenta');



	// echo h1('Table: performances');
// worldChampion('C_dS_performance','Recover_performances.csv','steelblue','orange');

	// echo h1('Table: archive_performances');
// worldChampion('C_dS_performance','Recover_archive_performances.csv','steelblue','gray');



	// echo h1('Table: workexperts');
// worldChampion('C_dS_workexpert','Recover_workexperts.csv','cyan','blue');



//////////////////////////////////////////////////////
//
//  
//


echo h2('Successful execution');


echo '</body></html>';

?>