<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
//  This script tries to make some clean list of streets (places) names based on the data points found in table visitors.
//  I later figured out (with the help of Martine) where to find public lists...
//  So this very interressant script is now OBSOLETE
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



//////////////////////////////////////////////////////////////////////////////// 
//
//  SETUP INITIAL ADDRESS / CITY / COUNTRY
//

if(1) {
	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$step = 10000;
	$stop = 500000;
	$keepgoing = true;

	$skipped = 0;

	$qclean = new Q('delete from stat_addresses;');

	while($keepgoing) {
		
		set_time_limit(240);
		
		$start = $mio * $step; 
		$q1 = new Q('select distinct id, address, zipCode as zip, city, country from visitors 
			where address <> "" and zipCode <> "" and city <> ""
			order by id desc limit '.$step.' offset '.$start.';');
		$vids = $q1->ids(list_as_array); // list_as_string
		$hits = $q1->hits();
		$addresses = $q1->idx('id','address'); 
		$zips = $q1->idx('id','zip'); 
		$cities = $q1->idx('id','city'); 
		$countries = $q1->idx('id','country'); 
		
		// echo h2('Offset:'.$start);
		// echo h2($hits.' found visitors');
		$even = $mio%2 == 0;
		$color = $even ? 'blue' : 'red';
		$saved = 0;

		foreach($vids as $x => $vid) {
			
			$a = $addresses[$vid];
			$z = $zips[$vid];
			$c = $cities[$vid];
			$r = $countries[$vid];
			
			if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]{4,}$/u', $z)) $z = $z; else $z = ''; // has at least two digits, and only letters/digits/spaces/hyphens → keep
			if(!$z) continue;
			
			$ca  = C_dbAccess_addresses::cleanAddress($a);
			$cc  = C_dbAccess_addresses::cleanAddress($c);
			
			
			// retrieve city and country from our stat_zips table
				$qcc = new Q('select id, city, country from stat_zips where zip = "'.$z.'" and LEFT(city,1)="'.substr($cc, 0, 1).'" limit 1;');
			$country = $qcc->one('country');
			$city = $qcc->one('city');
			if($country&&$city) {
				$r = $country;
				$cc = $city;
			}
			
			$qq = new Q('select id from stat_addresses where street = "'.$ca.'" and city = "'.$cc.'" limit 1;');
			$qqids = $qq->ids(list_as_string);
			if(!$qqids) { // create this entry as it doesn't exists yet in the table
				
				$ds = new C_dS_stat_address(0);
				$ds->street = $ca;
				$ds->city = $cc;
				$ds->zip = $z;
				$ds->country = $r;
				$ds->save();
				$saved++;
			} else
				$skipped++;
				// $q = new Q('update visitors set metaphone1 = "'.$metaphone1.'", metaphone2 = "'.$metaphone2.'",
											// metaphone3 = "'.$metaphone3.'", metaphone4 = "'.$metaphone4.'" WHERE id = "'.$vid.'";'); // see (*gs01*)
			
		}
		echo '<span style="font-size:90%; color:'.$color.'"> '.(++$mio*$step).' ['.$saved.']/ '.'</span>';
		$keepgoing = (!!$hits&&($mio*$step<$stop)); // && ($mio<3);
	}
	echo '</div>';

		$qc = new Q('select count(*) as c from stat_addresses;');
		$qc = $qc->c();
	echo h3('Total table items count:'.$qc);
	echo h2('Doublons:'.$skipped);
}



//////////////////////////////////////////////////////////////////////////////// 
//
//  REMOVES SHITTY ZIPS
//

if(0) { // handled by picking them from stats_zips
	
		$qc = new Q('select count(*) as c from stat_addresses where zip <> "";');
		$qc = $qc->c();
	echo h3('Total zip count before cleaning:'.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('select distinct zip from stat_addresses order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	echo h3('Total distinct zips count before cleaning:'.count($zips));
	
	$addrs = []; $delcount = 0;
	foreach($zips as $x => $zip) {
		if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]{4,}$/u', $zip)) $addrs[] = $zip;
		else { 
			$delcount++;
			new Q('update stat_addresses set zip = "" where zip = "'.$zip.'";'); 
			echo '<span style="font-size:90%; color:red"> / cleaned up |'.$zip.'|</span>';
		}
		
		if(($x%1000)==0) {
			echo '<div style="font-size:90%; color:green"> '.$x.' ('.$delcount.' deleted) / '.'</div>';
			set_time_limit(300);
		}
	}
	echo '</div>';
	
	echo h2('Zip lift: Done ('.count($zips).' in / out '.count($addrs).')');
	// now we have a list of distinct zips containing 2 digits at least, and at least 4 chars

	$q = new Q('select distinct zip from stat_addresses order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	echo h3('Total distinct zips count AFTER cleaning:'.count($zips));
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  LIFT UP ZIP CITIES NAMES ACCORDING TO ZIPCODE OCCURANCE
//


if(0) { // handled by first step ;)
	
		$qc = new Q('select count(*) as c from stat_addresses where city <> "";');
		$qc = $qc->c();
	echo h3('Total zip count before cleaning:'.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('select distinct zip from stat_addresses order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	
	
	$addrs = []; $delcount = 0;
	foreach($zips as $x => $zip) {
		
		
		$qf = new Q('SELECT zip, city, COUNT(*) AS occurrences FROM stat_addresses where zip = "'.$zip.'" GROUP BY zip, city order by occurrences desc limit 1;');
		$city = $qf->one('city'); // is the most represented for that zip code
		if($city) {
			$r = new Q('update stat_addresses set city = "'.$city.'" where zip = "'.$zip.'" and city <> "'.$city.'";');
			$rc = $r->hits();
			$delcount += $rc;
			if($rc) echo '<span style="font-size:90%; color:red"> &nbsp;&nbsp;&nbsp;&nbsp;/ aligned up '.$rc.' cities to |'.$city.'| where zip is '.$zip.'</span>';
		}
		
		if(($x%1000)==0) {
			echo '<div style="font-size:90%; color:blue"> '.$x.' ('.$delcount.' deleted) / '.'</div>';
			set_time_limit(300);
		}
	}
	echo '</div>';
	
	
	echo h2('Zip lift: Done ('.count($zips).' in )');

		$qc = new Q('select count(*) as c from stat_addresses where city <> "";');
		$qc = $qc->c();
	echo h3('Total cities count AFTER Cities Alignement cleaning:'.$qc);
}




//////////////////////////////////////////////////////////////////////////////// 
//
//
//  REMOVE DOUBLONS

if(0) {
		$qc = new Q('select count(*) as c from stat_addresses;');
		$qc = $qc->c();
	echo h3('Total cities count before doublons remonval: '.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('DELETE a FROM stat_addresses AS a JOIN stat_addresses AS b ON a.street = b.street
			AND a.zip = b.zip AND a.city = b.city AND a.id > b.id;');
	$hits = $q->hits(); 
	
	echo h2('Zip lift: Done ('.$hits.' in )');

		$qc = new Q('select count(*) as c from stat_addresses;');
		$qc = $qc->c();
	echo h3('Total cities count AFTER doublons remonval:'.$qc);
}


echo h2('Successful');
echo '</body></html>';

?>