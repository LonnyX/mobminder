<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';


//////////////////////////////////////////////////////
//
//  Purpose of this script
//


//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1>'.$t.'</h1>'; }
function h2($t) { return '<h2>'.$t.'</h2>'; }
function h3($t) { return '<h3>'.$t.'</h3>'; }
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
		$o .= '<link href="../utilities.css" rel="stylesheet" type="text/css">';
		$o .= '<head>';
	$o .= '<body>';
	echo $o;
	
echo '<h1>Re-use me as a base for writing a new Spoofy :)</h1>';

set_time_limit(360);


// In this function, we want to pass a class defitinition as argument into $leadclass.
// Then later in this function we want to instanciate using smth like $instance = new $leadclass();
// 

function worldChampion($leadClass,$filename,$color1='darkblue',$color2='black') { // example
	
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
//  
//


echo h2('Successful execution');


echo '</body></html>';

?>