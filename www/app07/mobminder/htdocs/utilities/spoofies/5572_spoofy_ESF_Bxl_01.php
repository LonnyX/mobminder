<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
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



function treatbirthday($in) { // in like '16.07.00', output like '20000716'
// echo warning($in);
	if(strlen($in)!=8) return 0;
	$dd = substr($in,0,2);
	$mm = substr($in,3,2);
	$yy = substr($in,6,2);
	if($yy<=25) $yy = '20'.$yy; else $yy = '19'.$yy;
	$yyyymmdd = $yy.$mm.$dd;
// echo warning('1/'.$yyyymmdd);
	if(!is_numeric($yyyymmdd)) return 0; 
	if($yyyymmdd>'20250620') return 0; 
	if($yyyymmdd<'19250620') return 0; 
// echo warning('2/'.$yyyymmdd);
	return $yyyymmdd;
}


$mobilecountriesseen = [];
$mobilecountriescount = 0;

function mobilefromjason($jsonString) { // in like 
	global $mobilecountriescount;
	$data = json_decode($jsonString, true);

	if(json_last_error()!==JSON_ERROR_NONE) return ''; // that was no jason...

	// On accède aux valeurs
	$number  = $data['number']  ?? '';
	$country = $data['country'] ?? '';
	if($country&&$number) {
		// echo warning($country.$number);
	}
	if(!isset($mobilecountriesseen[$country])) {
		$mobilecountriesseen[$country] = 1;
		$mobilecountriescount++;
	}
}


function phonefromjason($in) { // in like 
	
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
	


set_time_limit(60);
$visiseen = [];
$visicount = 0;



//////////////////////////////////////////////////////
//
//  appointments
//
if(1){
	
	// Chemin vers le CSV
	// $csvFile = __DIR__ . '/adresses-france.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	$csvFile = 'C:/var/5572 - ESF bxl.v05.apps.csv'; // origin: https://adresse.data.gouv.fr/data/ban/adresses/latest/csv
	$csvSep = ';';
	echo h1($csvFile);

	// Tableau temporaire pour dédoublonner (clé => true)
	$visiseen = [];

	// Ouvre le fichier en lecture
	if(($handle = fopen($csvFile, 'r')) === false) {
		die("Impossible d'ouvrir le fichier $csvFile\n");
	}
	
	stream_filter_append( // read it as UTF-8
		$handle,
		'convert.iconv.windows-1252/utf-8',
		STREAM_FILTER_READ
	);
	

	// Lecture de l'en-tête pour repérer les index de colonnes
	$header = fgetcsv($handle, 0, $csvSep); // adapt ',' into ';' depending of the kind of csv
	if ($header === false) {
		die("Le fichier semble vide ou invalide\n");
	}
	$cols = array_flip($header);
	// on s'attend à trouver 'nom_voie', 'code_postal', 'nom_commune', '', ...
	foreach(['customerId','customerFields.firstName','customerFields.lastName','customerFields.landlinePhone','customerFields.mobilePhone',
				'customerFields.email', 'customerFields.birthday'] as $col) {
		if (!isset($cols[$col])) {
			die("Colonne manquante : $col\n");
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
	while((($row = fgetcsv($handle, 0, $csvSep)) !== false)&&$keepgoing) { // adapt ',' into ';' depending of the kind of csv
		
		// Récupération des valeurs et trim
		$reference 	= trim($row[$cols['customerId']]);
		$firstname 	= preg_replace('/^\d{1,4}\s+/', '', trim($row[$cols['customerFields.firstName']]));
		$lastname	= preg_replace('/^\d{1,4}\s+/', '', trim($row[$cols['customerFields.lastName']]));
			$email   	= trim($row[$cols['customerFields.email']]);
			$birthday   = trim($row[$cols['customerFields.birthday']]);
		$mobile   	= mobilefromjason(trim($row[$cols['customerFields.mobilePhone']]));
		$phone   	= phonefromjason(trim($row[$cols['customerFields.landlinePhone']]));

		// Si on ne l'a pas encore vue, on crée l'objet
		if (!isset($visiseen[$reference])) {
			
			$ds = new C_dS_visitor(0);
			$ds->reference = $reference;
			$ds->firstname = $firstname;
			$ds->lastname = $lastname;
				$ds->email = $email;
				$ds->birthday = treatbirthday($birthday);
			$ds->mobile = $mobile;
			$ds->phone = $phone;
			// $ds->save();
			$set++; $visiseen[$reference] = true; $visicount++;
		echo notice($visicount.'} '.$ds->firstname.' '.$ds->lastname.' | '.$ds->email.' -['.$ds->birthday.']- // +'.$ds->mobile.'// +'.$ds->phone);
		}
		
		if(($x%$step)==0) { // drops a screen display to echo the task progress
					$even = ($x%(2*$step))==0;
				$c = $even ? 'red' : 'blue';
			echo '<span style="font-size:90%; color:'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
			set_time_limit(260);
			// sleep(60)
		}
		
		$keepgoing = ($x++<$stop);

	}
	fclose($handle);
	echo '</div>';
}




//////////////////////////////////////////////////////
//
//  reservations
//
if(0){
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
		if (!$skip&!isset($visiseen[$keyNL])) {
			$ds = new C_dS_stat_address(0);
			$ds->street = $streetNL; $ds->city = $cityNL; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			$set++; $visiseen[$keyNL] = true;
		}	
		
		// if (!$skip&!isset($visiseen[$keyFR])) {
			// $ds = new C_dS_stat_address(0);
			// $ds->street = $streetFR; $ds->city = $cityFR; $ds->zip = $zip; $ds->country = 'be'; $ds->save();
			// $set++; $visiseen[$keyFR] = true;
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
//  
//
echo h2('Mobile countries: '.$mobilecountriescount);
foreach($mobilecountriesseen as $mobilecountry => $one) {
	echo warning($mobilecountry);
}



//////////////////////////////////////////////////////
//
//  
//



echo h2('Successful execution');

echo '</body></html>';

?>