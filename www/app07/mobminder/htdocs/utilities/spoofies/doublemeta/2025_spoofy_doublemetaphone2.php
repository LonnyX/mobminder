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
	


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
//

$do = @$_GET['do']; if(!isset($do)) $do = 0; else $do = !!$do;

echo h1('stat_genders');

echo '<div style="margin:0 5%;">';
$mio = 0;
$step = 10000;
$keepgoing = true;
while($keepgoing) {
	
	set_time_limit(120);
	
	$start = $mio * $step; 
	$q1 = new Q('select id, name from stat_genders order by id desc  limit '.$step.' offset '.$start.';');
	$sids = $q1->ids(list_as_array); // list_as_string
	$hits = $q1->hits();
	$names = $q1->idx('id','name'); // (*q02*)
	$even = $mio%2 == 0;
	$color = $even ? 'blue' : 'red';

	foreach($sids as $x => $id) {
		$name = $names[$id];
		$dmn = new DoubleMetaphone($name);
		$metaphone1 = $dmn->result['primary'];
		$metaphone2 = $dmn->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		
		if($do) $q = new Q('update stat_genders set metaphone1 = "'.$metaphone1.'", metaphone2 = "'.$metaphone2.'" WHERE id = "'.$id.'";'); // see (*gs01*)
		else warning('NOT in DO mode');
	}
	echo '<span style="font-size:90%; color:'.$color.'"> '.(++$mio*$step).' / '.'</span>';
	$keepgoing = (!!$hits); // && ($mio<3);
}
echo '</div>';


echo h1('stat_lastnames');


echo '<div style="margin:0 5%;">';
$mio = 0;
$step = 10000;
$keepgoing = true;
while($keepgoing) {
	
	set_time_limit(120);
	
	$start = $mio * $step; 
	$q1 = new Q('select id, name from stat_lastnames order by id desc  limit '.$step.' offset '.$start.';');
	$sids = $q1->ids(list_as_array); // list_as_string
	$hits = $q1->hits();
	$names = $q1->idx('id','name'); // (*q02*)
	$even = $mio%2 == 0;
	$color = $even ? 'blue' : 'red';

	foreach($sids as $x => $id) {
		$name = $names[$id];
		$dmn = new DoubleMetaphone($name);
		$metaphone1 = $dmn->result['primary'];
		$metaphone2 = $dmn->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		
		if($do) $q = new Q('update stat_lastnames set metaphone1 = "'.$metaphone1.'", metaphone2 = "'.$metaphone2.'" WHERE id = "'.$id.'";'); // see (*gs01*)
		else warning('NOT in DO mode');
	}
	echo '<span style="font-size:90%; color:'.$color.'"> '.(++$mio*$step).' / '.'</span>';
	$keepgoing = (!!$hits); // && ($mio<3);
}
echo '</div>';





//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo h2('Successful');
echo '</body></html>';

?>