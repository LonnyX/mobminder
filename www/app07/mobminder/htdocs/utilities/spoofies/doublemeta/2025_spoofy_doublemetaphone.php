<?php
$systemLog = 'spoofy.php';
require '../../../lib_mobphp/dbio.php';

ini_set('memory_limit', '2048M');

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }

if(function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 0);
ini_set('output_buffering', 0);

// 2) Envoi des headers pour désactiver buffering proxys / navigateurs
header('Content-Type: text/html');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');

// 3) Vider tous les buffers existants
while (ob_get_level() > 0) {
    ob_end_flush();
}

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


//////////////////////////////////////////////////////
//
//  Written to convert birthdates in registration field into birthdates in birthday field (for So Nice)
//

echo '<div style="margin:0 5%;">';
$mio = 0;
$step = 100000;
$keepgoing = true;
while($keepgoing) {
	
	set_time_limit(120);
	
	$start = $mio * $step; 
	$q1 = new Q('select id, lastname, firstname from visitors order by id desc  limit '.$step.' offset '.$start.';');
	$sids = $q1->ids(list_as_array); // list_as_string
	$hits = $q1->hits();
	$firstnames = $q1->idx('id','firstname'); // (*q02*)
	$lastnames = $q1->idx('id','lastname'); // (*q02*)
	// echo h2('Offset:'.$start);
	// echo h2($hits.' found visitors');
	$even = $mio%2 == 0;
	$color = $even ? 'blue' : 'red';

	foreach($sids as $x => $vid) {
		$firstname = $firstnames[$vid];
		$dmLN = new DoubleMetaphone($firstname);
		$metaphone1 = $dmLN->result['primary'];
		$metaphone2 = $dmLN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		
		$lastname = $lastnames[$vid];
		$dmLN = new DoubleMetaphone($lastname);
		$metaphone3 = $dmLN->result['primary'];
		$metaphone4 = $dmLN->result['secondary']; if($metaphone3==$metaphone4) $metaphone4 = '';
		
		
		$q = new Q('update visitors set metaphone1 = "'.$metaphone1.'", metaphone2 = "'.$metaphone2.'",
										metaphone3 = "'.$metaphone3.'", metaphone4 = "'.$metaphone4.'" WHERE id = "'.$vid.'";'); // see (*gs01*)
		
	}
	echo '<span style="font-size:90%; color:'.$color.'"> '.(++$mio*$step).' / '.'</span>';
	$keepgoing = (!!$hits); // && ($mio<3);
}
echo '</div>';

// $sids = $q->ids(false);
// $hits = $q->hits();





//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo h2('Successful');
echo '</body></html>';

?>