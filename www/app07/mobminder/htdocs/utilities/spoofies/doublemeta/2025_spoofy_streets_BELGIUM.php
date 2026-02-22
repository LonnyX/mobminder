<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
// Data origin: national belgian data https://opendata.bosa.be/index.fr.html
// there are three files to retrieve:
// 
// Brussels_postal_street.csv
// Wallonia_postal_street.csv
// Flanders_postal_street.csv  qui se trouvent dan ce zip :postalstreets-latest.zip
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
//  HTML display
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
	


set_time_limit(360);
$seen = [];
echo h1('cleaning up stat_addresses.be ...');
$qclean = new Q('delete from stat_addresses where country = "be";');
echo h1('cleaning DONE');




//////////////////////////////////////////////////////
//
//  BRUSSELS - File reading
//
if(1){
	
	// Chemin vers le CSV
	// $csvFile = __DIR__ . '/adresses-france.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	$csvFile = 'C:/var/Brussels_postal_street.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	
	echo h1($csvFile);

	// Tableau temporaire pour dédoublonner (clé => true)
	$seen = [];

	// Ouvre le fichier en lecture
	if(($handle = fopen($csvFile, 'r')) === false) {
		die("Impossible d'ouvrir le fichier $csvFile\n");
	}

	// Lecture de l'en-tête pour repérer les index de colonnes
	$header = fgetcsv($handle, 0, ','); // adapt ',' into ';' depending of the kind of csv
	if ($header === false) {
		die("Le fichier semble vide ou invalide\n");
	}
	$cols = array_flip($header);
	// on s'attend à trouver 'nom_voie', 'code_postal', 'nom_commune', '', ...
	foreach(['street_nl','street_fr','postal_id','city_nl','city_fr'] as $col) {
		if (!isset($cols[$col])) {
			die("Colonne manquante 1 : $col\n");
		}
	}

	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$stop = 100000;
	$step = 1000;
	$keepgoing = true;
	$x = 1;
	$set = 0;

	// Parcours ligne par ligne
	while((($row = fgetcsv($handle, 0, ',')) !== false)&&$keepgoing) { // adapt ',' into ';' depending of the kind of csv
		
		$skip = false;
		
		// Récupération des valeurs et trim
		$streetNL = trim($row[$cols['street_nl']]);
		$streetFR = trim($row[$cols['street_fr']]);
		$zip      = trim($row[$cols['postal_id']]);
		$cityNL   = trim($row[$cols['city_nl']]);
		$cityFR   = trim($row[$cols['city_fr']]);

		// Si l'une des valeurs est vide, on ignore
		if (($streetNL === '' && $streetFR === '') || $zip === '' || ($cityNL === '' && $cityFR === '')) $skip = true;

		// Clé unique pour dédoublonner
		// $keyNL = mb_strtolower("$streetNL|$zip|$cityNL", 'UTF-8');
		// $keyFR = mb_strtolower("$streetFR|$zip|$cityFR", 'UTF-8');
		$keyNL = strtolower("$streetNL|$zip|$cityNL");
		$keyFR = strtolower("$streetFR|$zip|$cityFR");

		// Si on ne l'a pas encore vue, on crée l'objet
		if (!$skip&!isset($seen[$keyNL])) {
			$ds = new C_dS_stat_address(0);
			$ds->street = $streetNL; $ds->city = $cityNL; $ds->zip = $zip; $ds->country = 'be-nl'; $ds->save();
			$set++; $seen[$keyNL] = true;
		}	
		
		if (!$skip&!isset($seen[$keyFR])) {
			$ds = new C_dS_stat_address(0);
			$ds->street = $streetFR; $ds->city = $cityFR; $ds->zip = $zip; $ds->country = 'be-fr'; $ds->save();
			$set++; $seen[$keyFR] = true;
		}	
		
		if(($x%$step)==0) {
					$even = ($x%(2*$step))==0;
				$c = $even ? 'red' : 'blue';
			echo '<span style="font-size:90%; color:'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
			set_time_limit(100);
		}
		
		$keepgoing = ($x++<$stop); // && ($mio<3);

	}
	fclose($handle);
	echo '</div>';
}



//////////////////////////////////////////////////////
//
//  WALLONIA - File reading
//
if(1){
	// Chemin vers le CSV
	// $csvFile = __DIR__ . '/adresses-france.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	$csvFile = 'C:/var/Wallonia_postal_street.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	echo h1($csvFile);

	// Tableau temporaire pour dédoublonner (clé => true)
	$seen = [];

	// Ouvre le fichier en lecture
	if(($handle = fopen($csvFile, 'r')) === false) {
		die("Impossible d'ouvrir le fichier $csvFile\n");
	}

	// Lecture de l'en-tête pour repérer les index de colonnes
	$header = fgetcsv($handle, 0, ',');
	if ($header === false) {
		die("Le fichier semble vide ou invalide\n");
	}
	$cols = array_flip($header);
	// on s'attend à trouver 'nom_voie', 'code_postal', 'nom_commune'
	foreach(['street_nl','street_fr','postal_id','city_nl','city_fr'] as $col) {
		if (!isset($cols[$col])) {
			die("Colonne manquante 2 : $col\n");
		}
	}

	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$stop = 100000;
	$step = 1000;
	$keepgoing = true;
	$x = 1;
	$set = 0;

	// Parcours ligne par ligne
	while((($row = fgetcsv($handle, 0, ',')) !== false)&&$keepgoing) {
		
		$skip = false;
		
		// Récupération des valeurs et trim
		// $streetNL = trim($row[$cols['street_nl']]);
		$streetFR = trim($row[$cols['street_fr']]);
		$zip    = trim($row[$cols['postal_id']]);
		// $cityNL   = trim($row[$cols['city_nl']]);
		$cityFR   = trim($row[$cols['city_fr']]);

		// Si l'une des valeurs est vide, on ignore
		if($streetFR === '' || $zip === '' || $cityFR === '') $skip = true;

		// Clé unique pour dédoublonner
		// $keyNL = mb_strtolower("$streetNL|$zip|$cityNL", 'UTF-8');
		// $keyFR = mb_strtolower("$streetFR|$zip|$cityFR", 'UTF-8');
		$keyFR = strtolower("$streetFR|$zip|$cityFR");

		// Si on ne l'a pas encore vue, on crée l'objet
		// if (!$skip&!isset($seen[$keyNL])) {
			// $ds = new C_dS_stat_address(0);
			// $ds->street = $streetNL; $ds->city = $cityNL; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			// $set++; $seen[$keyNL] = true;
		// }	
		
		if (!$skip&!isset($seen[$keyFR])) {
			$ds = new C_dS_stat_address(0);
			$ds->street = $streetFR; $ds->city = $cityFR; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			$set++; $seen[$keyFR] = true;
		}	
		
		if(($x%$step)==0) {
					$even = ($x%(2*$step))==0;
				$c = $even ? 'red' : 'blue';
			echo '<span style="font-size:90%; color:'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
			set_time_limit(100);
		}
		
		$keepgoing = ($x++<$stop); // && ($mio<3);

	}
	fclose($handle);
	echo '</div>';
}



//////////////////////////////////////////////////////
//
//  FLANDERS - File reading
//
if(1){
	// Chemin vers le CSV
	// $csvFile = __DIR__ . '/adresses-france.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	$csvFile = 'C:/var/Flanders_postal_street.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	echo h1($csvFile);

	// Tableau temporaire pour dédoublonner (clé => true)

	// Ouvre le fichier en lecture
	if(($handle = fopen($csvFile, 'r')) === false) {
		die("Impossible d'ouvrir le fichier $csvFile\n");
	}

	// Lecture de l'en-tête pour repérer les index de colonnes
	$header = fgetcsv($handle, 0, ',');
	if ($header === false) {
		die("Le fichier semble vide ou invalide\n");
	}
	$cols = array_flip($header);
	// on s'attend à trouver 'nom_voie', 'code_postal', 'nom_commune'
	foreach(['street_nl','street_fr','postal_id','city_nl','city_fr'] as $col) {
		if (!isset($cols[$col])) {
			die("Colonne manquante 3: $col\n");
		}
	}

	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$stop = 100000;
	$step = 1000;
	$keepgoing = true;
	$x = 1;
	$set = 0;

	// Parcours ligne par ligne
	while((($row = fgetcsv($handle, 0, ',')) !== false)&&$keepgoing) {
		
		$skip = false;
		
		// Récupération des valeurs et trim
		$streetNL = trim($row[$cols['street_nl']]);
		// $streetFR = trim($row[$cols['street_fr']]);
		$zip    = trim($row[$cols['postal_id']]);
		$cityNL   = trim($row[$cols['city_nl']]);
		// $cityFR   = trim($row[$cols['city_fr']]);

		// Si l'une des valeurs est vide, on ignore
		if($streetNL === '' || $zip === '' || $cityNL === '') $skip = true;

		// Clé unique pour dédoublonner
		// $keyNL = mb_strtolower("$streetNL|$zip|$cityNL", 'UTF-8');
		$keyNL = strtolower("$streetNL|$zip|$cityNL");
		// $keyFR = mb_strtolower("$streetFR|$zip|$cityFR", 'UTF-8');

		// Si on ne l'a pas encore vue, on crée l'objet
		if (!$skip&!isset($seen[$keyNL])) {
			$ds = new C_dS_stat_address(0);
			$ds->street = $streetNL; $ds->city = $cityNL; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			$set++; $seen[$keyNL] = true;
		}	
		
		// if (!$skip&!isset($seen[$keyFR])) {
			// $ds = new C_dS_stat_address(0);
			// $ds->street = $streetFR; $ds->city = $cityFR; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			// $set++; $seen[$keyFR] = true;
		// }	
		
		if(($x%$step)==0) {
					$even = ($x%(2*$step))==0;
				$c = $even ? 'red' : 'blue';
			echo '<span style="font-size:90%; color:'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
			set_time_limit(100);
		}
		
		$keepgoing = ($x++<$stop); // && ($mio<3);

	}
	fclose($handle);
	echo '</div>';
}





//////////////////////////////////////////////////////
//
//  When stat_adresses is filled up with files from different countries government,
//  Run this SQL with Navicat, so it builds the stat_zips from the stat_addresses table.
//  ( very fast and efficient ).
//


// -- bulk-load every distinct combo of (groupId,zip,city,country,cmetaphone1,cmetaphone2)
//
// delete from stat_zips;
//
// INSERT IGNORE INTO stat_zips(zip, city, country, cmetaphone1, cmetaphone2)
// 		SELECT DISTINCT zip, city, country, cmetaphone1, cmetaphone2 FROM stat_addresses;
//
// All together that takes 8s to execute in 2025, with Fr, Be and Gdl in the database.





//////////////////////////////////////////////////////
//
//  
//


echo h2('Successful execution');

	$qc = new Q('select count(*) as c from stat_addresses;');
	$qc = $qc->c();
echo h3('Total table items count:'.$qc);

echo '</body></html>';

?>