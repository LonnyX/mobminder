<?php
$systemLog = 'apps loader';
require '../utililib.php';

set_time_limit(3600);

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

$dS_group = new C_dS_group($accountId);
if($dS_group->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$dS_group->name.'</h2>');


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

$positions['reference'] = array_search('reference', $headers);
$positions['address'] = array_search('address', $headers);
$positions['zipCode'] = array_search('zipCode', $headers);
$positions['city'] = array_search('city', $headers);

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
		$out .= warning('Line :'.$lc.' / number of fields does not match : '.$hc.','.$split[0].','.$split[1].','.$split[2].','.$split[3]);
	}
}

$icount = 0;
$xcount = 0;
	
foreach($lines as $x => $split) {
		
	$reference = $split[$positions['reference']];   
	$address = str_replace("''", "'",$split[$positions['address']]);  
	$zipCode = $split[$positions['zipCode']];  
	$city = str_replace("''", "'",$split[$positions['city']]);  

	$query = 'update visitors set address = "'.$address.'", zipCode = "'.$zipCode.'",city = "'.$city.'" where groupid = '.$accountId.' and reference = "'.$reference.'" and address = "";';

	if($do) 
	{
		$q = new Q($query);
		$out.= notice($query.' => '.$q->hits());		
	}
	else
	{
		$out.= notice($query.' => rollback');		
	}

	
	//if ($icount>10) break;

	$icount++;
}

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;




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