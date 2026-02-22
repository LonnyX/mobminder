<?php
$systemLog = 'spoofy.php';

ini_set('memory_limit', '2048M');
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
//  This script tries to make some clean list of zips based on the data points found in table visitors.
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


// 5) Parcourir chaque ligne du CSV
if(0) {
	$c = 0;
	while (($row = fgetcsv($handle)) !== false) {
		$original = $row[$addressIndex];
		$cleaned  = C_dbAccess_addresses::cleanAddress($original);

		// Pour sortir correctement en CSV (en échappant les virgules si besoin),
		// on utilise fputcsv vers un flux temporaire, puis on affiche le résultat.
		echo '<div>'.++$c.' '.$original.' >> '.$cleaned.'</div>';
	}

	fclose($handle);
}


set_time_limit(360);

// new Q('update visitors set country = "Deutschland" where country = "de";');
// new Q('update visitors set country = "Belgium" where country = "be";');
// new Q('update visitors set country = "Nederland" where country = "nl";');
// new Q('update visitors set country = "France" where country = "fr";');

// new Q('update visitors set country = "Luxembourg" where country = "lux";');
// new Q('update visitors set country = "Luxembourg" where country = "lu";');





//////////////////////////////////////////////////////////////////////////////// 
//
//  SETUP INITIAL CITY / COUNTRY
//


$qclean = new Q('delete from stat_zips;');
echo h1('stat_zips clean up done.');


echo h1('Processing zips...');

if(1) {
	echo '<div style="margin:0 5%;">';
	$mio = 0;
	$step = 10000;
	$stop = 20000;
	$keepgoing = true;

	$qz = new Q('select distinct zipCode from visitors');
	$zipCodes = $qz->mlist('zipCode', list_as_array);
	echo h3('Distinct zips count:'.count($zipCodes));
	
	$zips = [];
	$cities = [];
	$countries = [];

	$set = 0; foreach($zipCodes as $x => $zip) {

		if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]{4,}$/u', $zip)) $zip = $zip; else $zip = ''; // has at least two digits, and only letters/digits/spaces/hyphens → keep
		if(!$zip) continue;
		
		$zips[$zip] = $zip;
		
		// check most probable city associated with this zip
			$iq = 'SELECT zipCode, city FROM visitors WHERE zipCode = "'.$zip.'" and city <> "" ORDER BY RAND() LIMIT 300';
		$qf = new Q('SELECT city, COUNT(*) AS occurrences FROM ('.$iq.') AS sample GROUP BY city ORDER BY occurrences DESC LIMIT 1;'); // fetches the most visible
		$city = $qf->one('city'); // is the most represented for that zip code
		$occs = $qf->one('occurrences'); // weight
		
		if($occs>1) {
			$ccity  = C_dbAccess_addresses::cleanAddress($city); // clean city
			if($ccity) $cities[$zip] = $ccity; // so we always overload with the most probable city
		}
		
		// check most probable country associated with this zip
			$iq = 'SELECT zipCode, country FROM visitors WHERE zipCode = "'.$zip.'" and country <> "" ORDER BY RAND() LIMIT 300';
		$qf = new Q('SELECT country, COUNT(*) AS occurrences FROM ('.$iq.') AS sample GROUP BY country ORDER BY occurrences DESC LIMIT 1;'); // fetches the most visible
		$country = $qf->one('country'); // is the most represented for that zip code
		$occs = $qf->one('occurrences'); // weight
		
		
		if($occs>1) {
			$ccountry  = C_dbAccess_addresses::cleanAddress($country); // clean city
			if($ccountry) $countries[$zip] = $ccountry; // so we always overload with the most probable city
		}
		
		if(($x%100)==0) {
			$even = ($x%200)==0;
			$c = $even ? 'yellow' : 'cyan';
			echo '<span style="font-size:90%; color:"'.$c.'"> '.$x.' ('.$set.' set) / '.'</span>';
			set_time_limit(100);
		}
		$set++;
	}

	echo h3('Saving...');
	$saved = 0; foreach($zips as $x => $zip) {
		
		if(!isset($cities[$zip])) continue; // we keep only sets of 3 reliable data points
		if(!isset($countries[$zip])) continue; // we keep only sets of 3 reliable data points
		
		
		$ccity = $cities[$zip];
		$ccountry = $countries[$zip];
		
		if($ccity&&$ccountry&&$zip) {
			$ds = new C_dS_stat_zip(0);
			$ds->city = $ccity;
			$ds->zip = $zip;
			$ds->country = $ccountry;
			
			$ds->save();
			$saved++;			
		}
	}
	
	echo h3('zips table filled with '.$saved.' elements');
	echo '</div>';




	$skipped = 0;


	echo '<div style="margin:0 5%;">';
	while(0) { // $keepgoing
		
		set_time_limit(120);
		
		$start = $mio * $step; 
		$q1 = new Q('select id, zipCode as zip, city, country from visitors 
			where zipCode <> "" and city <> ""
			order by id desc limit '.$step.' offset '.$start.';');
		$vids = $q1->ids(list_as_array); // list_as_string
		$hits = $q1->hits();
		$zips = $q1->idx('id','zip'); 
		$cities = $q1->idx('id','city'); 
		$countries = $q1->idx('id','country'); 
		
		// echo h2('Offset:'.$start);
		// echo h2($hits.' found visitors');
		$even = $mio%2 == 0;
		$color = $even ? 'blue' : 'red';
		$saved = 0;
		foreach($vids as $x => $vid) {
			
			set_time_limit(10);
			
			$z = $zips[$vid];
			$c = $cities[$vid];
			$r = $countries[$vid];
			
			if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]+$/u', $z)) $z = $z; else $z = ''; // has at least two digits, and only letters/digits/spaces/hyphens → keep
	
			$cc  = C_dbAccess_addresses::cleanAddress($c); // clean city
			
			if($z&&$cc) {
				
			
				// we want to assess the most occuring city and country based on a sample of 1000 items from table stat_addresses, because this table is huge and we have enough accuracy with a 1000 items sample. Can you adapt this code? (there should be a sub query I think).
					
				$qq = new Q('select id from stat_zips where zip = "'.$z.'" and city = "'.$cc.'" limit 1;');
				$qqids = $qq->ids(list_as_string);
				if(!$qqids) { // create this entry as it doesn't exists yet in the table
					
					$ds = new C_dS_stat_zip(0);
					$ds->city = $cc;
					$ds->zip = $z;
					$ds->country = $r;
					
					$ds->save();
					$saved++;
				} else
					$skipped++;
				}
			}
		echo '<span style="font-size:90%; color:'.$color.'"> '.(++$mio*$step).' ['.$saved.']/ '.'</span>';
		$keepgoing = (!!$hits&&($mio*$step<$stop)); // && ($mio<3);
	}
	echo '</div>';

		$qc = new Q('select count(*) as c from stat_zips;');
		$qc = $qc->c();
	echo h3('Total table items count:'.$qc);
	echo h2('Doublons:'.$skipped);
}





//////////////////////////////////////////////////////////////////////////////// 
//
//  REMOVES SHITTY ZIPS
//

if(0) { // that was included in the former step ;)
	
		$qc = new Q('select count(*) as c from stat_zips where zip <> "";');
		$qc = $qc->c();
	echo h3('Total zip count before cleaning:'.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('select distinct zip from stat_zips order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	echo h3('Total distinct zips count before cleaning:'.count($zips));
	
	$addrs = []; $delcount = 0;
	foreach($zips as $x => $zip) {
		if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]{4,}$/u', $zip)) $addrs[] = $zip;
		else { 
			$delcount++;
			new Q('update stat_zips set zip = "" where zip = "'.$zip.'";'); 
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

	$q = new Q('select distinct zip from stat_zips order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	echo h3('Total distinct zips count AFTER cleaning:'.count($zips));
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  LIFT UP ZIP CITIES NAMES ACCORDING TO ZIPCODE OCCURANCE
//


if(0) {  // that was included in the first step ;)
	
		$qc = new Q('select count(*) as c from stat_zips where city <> "";');
		$qc = $qc->c();
	echo h3('Total zip count before cleaning:'.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('select distinct zip from stat_zips order by zip asc;');
	$zips = $q->mlist('zip',list_as_array); 
	
	
	$addrs = []; $delcount = 0;
	foreach($zips as $x => $zip) {
		
		
		$qf = new Q('SELECT zip, city, COUNT(*) AS occurrences FROM stat_zips where zip = "'.$zip.'" GROUP BY zip, city order by zip desc limit 1;');
		$city = $qf->one('city'); // is the most represented for that zip code
		if($city) {
			$r = new Q('update stat_zips set city = "'.$city.'" where zip = "'.$zip.'" and city <> "'.$city.'";');
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

		$qc = new Q('select count(*) as c from stat_zips where city <> "";');
		$qc = $qc->c();
	echo h3('Total cities count AFTER Cities Alignement cleaning:'.$qc);
}




//////////////////////////////////////////////////////////////////////////////// 
//
//
//  REMOVE DOUBLONS



if(0) {
		$qc = new Q('select count(*) as c from stat_zips;');
		$qc = $qc->c();
	echo h3('Total cities count before doublons remonval: '.$qc);
	
	echo '<div style="margin:0 5%;">';
	
	set_time_limit(600);
		
	$q = new Q('DELETE a FROM stat_zips AS a JOIN stat_zips AS b ON a.zip = b.zip AND a.city = b.city AND a.id > b.id;');
	$hits = $q->hits(); 
	
	echo h2('Zip lift: Done ('.$hits.' in )');

		$qc = new Q('select count(*) as c from stat_zips;');
		$qc = $qc->c();
	echo h3('Total cities count AFTER doublons remonval:'.$qc);
}


echo h2('Successful');
echo '</body></html>';

?>