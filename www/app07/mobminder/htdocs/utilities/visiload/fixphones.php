<?php
$systemLog = 'mobminder uploader';
require '../utililib.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  This spoofy re-writes (lost) visitor's mobile from a backup .csv file
//  
//	I took a backup of this account visitors and re-filled the production visitors register from the backup, using this script
//
//
//  Usage: 127.0.0.1/utilities/visiload/fixphones.php?id=4449
//



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
$do = 0; if(isset($_GET['do'])) if($_GET['do']=='1') $do = 1;



if(!$accountId) error('You need to give an account id');

$dS_account = new C_dS_group($accountId);
if($dS_account->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$dS_account->name.'</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//
// Identify and open the file

$matches = glob('./'.$accountId.'*.csv');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*apps.csv');

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

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF


foreach($headers as $hcount => $header) {}
$out .= h2('<h2>Headers: '.++$hcount.' columns</h2>');

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
$lines = tolines($handle, false /* will auto detect file encoding */, false /*to lower*/); // from utililib.php


$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines found in file');

	
	
//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING HEADERS
//

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);

C_dS_visitor::$defaults['language'] = language_code_french;
$o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	if(!array_key_exists($header,$o_dS_defaults)) {
			echo('The following header has no correspondance in the target visitor table: '.$header);
			error('The following header has no correspondance in the target visitor table: '.$header, $handle);
		}
}
$out .= h2('Headers are compliant with DB definitions: '.++$hcount.' columns');




//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$db_visitors = new C_dbAccess_visitors(false,accountId); // loads all from this account
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$visiTotal.' visitors have been loaded from mobminder.visitors in: '.$cuedelta.' mseconds</h2>');





//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

	$cuein = microtime(true);
	$icount = 0;
	$visiId = false;
	$verbose = 100;
	
foreach($lines as $x => $split) {
		
		$visiref = $split[0];  $mobile = $split[1]; $phone = $split[2];
		
		// if($cancelled == 'true') continue;
		
		if($visiref!==''&&$visiref!=='0') {
			if(!isset($byReference[$visiref])) {
				$out .= notice('<b>unlinkable line: </b>'.$x.' (no reference for the visitor:'.$visiref.')'); // continue;
			} else $visiId = $byReference[$visiref];
		}
		
		
		if($mobile) {
			$value = preg_replace('/[^0-9]/', '', $mobile); // note that heading '+' will also not pass through, so it is not necessary to have it in the csv
			if($value=='') break;
			$digits = $value;
			$l = strlen($digits);
			if(substr($digits,0,1)!='0') {
				if($l==9) if(substr($digits,0,1)=='4') $digits = $dS_account->phoneRegion.$digits; // for numbers arriving like 497401626 adding e.g. '32'.$digits
				if($l==9) if(substr($digits,0,1)=='6') $digits = $dS_account->phoneRegion.$digits; // for numbers arriving like 670082974 (France) adding e.g. '33'.$digits
				if($l==9) if(substr($digits,0,1)=='7') $digits = $dS_account->phoneRegion.$digits; // for numbers arriving like 777464840 (France) adding e.g. '33'.$digits
				$digits = '+'.$digits; // for numbers arriving like 32497401626 // adds international '+' prefix
			} // now all numbers are in a format "+32495123456"
			
			if($digits != $value) { 
				$out .= micro('<b>mobile clean up</b>, '.$value.' turned into '.$digits); 
			}
			$checked = checkMobileFormat($digits, $dS_account->phoneRegion); // accepts 0493123456 or +32493123456
			if(!$checked) { 
				$out .= warning('<b>mobile format did not pass</b>, '.$digits.' rejected.'); 
			} else $value = $checked;
			$mobile = $checked;
		}
		
		if($phone) {
			$digits = preg_replace('/[^0-9]/', '', $phone); // clean up all non figure characters
			if(substr($digits,0,1)!='0') {
				if(strlen($digits)<=9) $digits = '0'.$digits; // for numbers arriving like 26621800
				else if(substr($digits,0,1)!='+') $digits = '+'.$digits; // for numbers arriving like 3227707084
			}
			// if($digits != $value) { 
				// $out .= micro('<b>phone clean up</b>, '.$value.' turned into '.$digits); 
			// }
			$phone = $digits;
		}
		
		
		if($visiId) {
			$dS_v = new C_dS_visitor($visiId);
			if($mobile) if(!$dS_v->mobile) $dS_v->mobile = $mobile;
			if($phone) if(!$dS_v->phone) $dS_v->phone = $phone;
			$icount++;		
		}
		if($do) if($visiId) {
			$dS_v->dSsave();
		}
	
		$visiId = false; $rescId = false;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$icount.' items have been corrected. Scanned in: '.$cuedelta.' mseconds</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

if($do)
	$out .= h2('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
else 
	$out .= h2('<h2>Operation SUCCESSFULL: looks good, now execute it in do mode to save the data.</h2>');

echo html($out); // from utililib.php




?>