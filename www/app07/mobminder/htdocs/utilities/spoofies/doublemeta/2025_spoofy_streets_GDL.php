<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
// reads natianl french data https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
// and uploads 
//



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



//////////////////////////////////////////////////////
//
//  HTML LAYOUT
//



// 2) Envoi des headers pour désactiver buffering proxys / navigateurs
header('Content-Type: text/html');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');

// 3) Vider tous les buffers existants
while (ob_get_level() > 0) { ob_end_flush(); }


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
	
echo h1('Spoofy operation');


set_time_limit(360);



//////////////////////////////////////////////////////
//
//  File reading
//


// Chemin vers le CSV
// $csvFile = __DIR__ . '/GDL_addresses.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
$csvFile = 'C:/var/GDL_addresses.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv

// Tableau temporaire pour dédoublonner (clé => true)
$seen = [];

// Ouvre le fichier en lecture
if(($handle = fopen($csvFile, 'r')) === false) { // This file is encoded in ANSI !
    die("Impossible d'ouvrir le fichier $csvFile\n");
}

// Lecture de l'en-tête pour repérer les index de colonnes
$header = fgetcsv($handle, 0, ';'); // adapt ',' into ';' depending of the kind of csv
if($header === false) {
    die("Le fichier semble vide ou invalide\n");
}

// The culprit here is that your header actually contains a hidden character ahead of “rue” (most likely a UTF-8 BOM or some other control byte)
// clean up each column name: trim whitespace + remove BOM (U+FEFF)
$header = array_map(function(string $h): string {
    $h = trim($h);
    // Remove UTF-8 BOM if present
    return preg_replace('/^\x{FEFF}/u', '', $h);
}, $header);

$cols = array_flip($header);

// on s'attend à trouver ...
foreach(['localite','code_postal','rue'] as $col) {
	// echo warning($col.' / '.$cols[$col]);
    if (!isset($cols[$col])) {
        die("Colonne manquante : $col\n");
    }
}

// this code gives this very strange error. Why can't I use the header name as an array key?
// Notice: Undefined index: localite in D:\mobdev\www\app07\mobminder\htdocs\utilities\spoofies\2025_spoofy_streets_GDL.php on line 115 


echo '<div style="margin:0 5%;">';
$mio = 0;
$stop = 100000000;
$step = 10000;
$keepgoing = true;
$x = 1;
$skipped = 0;
$set = 0;

echo h1('cleaning up stat_addresses.lu ...');
$qclean = new Q('delete from stat_addresses where country = "lu";');
echo h1('cleaning DONE');

// Parcours ligne par ligne
while((($row = fgetcsv($handle, 0, ';')) !== false)&&$keepgoing) { // adapt ',' into ';' depending of the kind of csv
	
	$skip = false;
	
    // Récupération des valeurs et trim
    $street = trim($row[$cols['rue']]);
    $zip    = trim($row[$cols['code_postal']]);
    $city   = trim($row[$cols['localite']]);

    // Si l'une des valeurs est vide, on ignore
    if ($street === '' || $zip === '' || $city === '') $skip = true;

    // Clé unique pour dédoublonner
    $key = strtolower("$street|$zip|$city");

    // Si on ne l'a pas encore vue, on crée l'objet
    if (!$skip&!isset($seen[$key])) {
		$ds = new C_dS_stat_address(0);
		$ds->street = $street;
		$ds->city = $city;
		$ds->zip = 'L'.$zip;
		$ds->country = 'lu';
		$ds->save();
		$set++;
        $seen[$key] = true;
    }	
	
	if(($x%$step)==0) {
				$even = ($x%(2*$step))==0;
			$c = $even ? 'green' : 'orange';
		echo '<span style="font-size:90%; color:'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
		set_time_limit(100);
	}
	
	$keepgoing = ($x++<$stop); // && ($mio<3);

}
fclose($handle);
echo '</div>';


	$qc = new Q('select count(*) as c from stat_addresses;');
	$qc = $qc->c();
echo h3('Total table items count:'.$qc);
echo h2('Doublons:'.$skipped);

// (éventuellement) traitement ultérieur…



//////////////////////////////////////////////////////
//
//  When stat_adresses is filled up with files from different countries government,
//  Run this SQL with Navicat, so it builds the stat_zips from the stat_addresses table.
//  ( very fast and efficient ).
//


// -- bulk-load every distinct combo of (groupId,zip,city,country,cmetaphone1,cmetaphone2)
// INSERT IGNORE INTO stat_zips(zip, city, country, cmetaphone1, cmetaphone2)
// 		SELECT DISTINCT zip, city, country, cmetaphone1, cmetaphone2 FROM stat_addresses;


echo h2('Successful');
echo '</body></html>';

?>