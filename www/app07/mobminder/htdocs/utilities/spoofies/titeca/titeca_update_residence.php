<?php

$systemLog = 'update_residence';
require '../utililib.php';
ini_set('memory_limit', '1024M');

$allin = microtime(true);
 
//////////////////////////////////////////////////////////////////////////////// 
//
//  VISILOAD is a script that help LOADING VISITORS 
//
//  FROM .CSV FILES to a MOBMINDER ACCOUNT
//
//   Usage: http://be.mobminder.com/utilities/spoofies/titeca/titeca_update_residence.php?id=3143&do=1&cleanup=1


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOCATING HOST
//

	$uriandpar = explode('?',$_SERVER['REQUEST_URI']);  // http://localhost/utilities/utilities/spoofies/titeca/titeca_update_residence.php?id=3143&do=1&cleanup=1
$host = $_SERVER['HTTP_HOST']; // localhost
$pars = $uriandpar[1]; // id=5009
$path = $uriandpar[0]; // /utilities/visiload/visiload.php
	$subfolders = preg_split("#/#", $path); 
$sub1 = $subfolders[1];
$sub2 = isset($subfolders[2])?$subfolders[2]:'';
$sub3 = isset($subfolders[3])?$subfolders[3]:'';


$out .= h2('Executing on host: '.$host);
$out .= notice('Pars: '.$pars);
$out .= notice('Path: '.$path);
$out .= notice('sub1: '.$sub1);
$out .= notice('sub2: '.$sub2);

$gotoprod = 'https://be.mobminder.com/utilities/spoofies/titeca_update_residence.php'.'?'.$pars.'';





//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; $do = ($do && $do!=0 && $do!='0');
if(isset($_GET['nodoublons'])) $nodoublons = true; else $nodoublons = false;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');

$out .= h2('Account identified: '.$o_dS_group->name);



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//
// Identify and open the file
$matches = glob('./'.$accountId.'*.csv');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.csv, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*.csv');
$filename = $matches[0];
if (!file_exists($filename)) error('No corresponding csv file: '.$filename);

$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);
$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);

$out .= h2('File opened: '.$filename); // from utililib.php
$out .= notice('<b>First line: </b>'.$line1);


$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); };




//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING HEADERS
//

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);

C_dS_visitor::$defaults['language'] = language_code_french;
$o_dS_visitor = new C_dS_visitor(); 
$o_dS_defaults = $o_dS_visitor->getDefaults(); $o_dS_defaults['remoteId'] = 0; $o_dS_defaults['mobId'] = 0;
foreach($headers as $hcount => $header) {
	if(!array_key_exists($header,$o_dS_defaults)) {
			echo('The following header has no correspondance in the target visitor table: '.$header);
			error('The following header has no correspondance in the target visitor table: '.$header, $handle);
		}
}
$out .= h2('Headers are compliant with DB definitions: '.++$hcount.' columns');





//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//


$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $ccount = $hcount-1; 
$lines = tolines($handle, 'ISO-8859-1'); // from utililib.php


if(0) {
	while (!feof($handle)) {
		$line = substr(fgets($handle),0,-$crlf);
		$lcount++;
		if(substr_count($line, ';') != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
			$skipcount++; $out .= notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match:'.$line.')'); continue; }; 
		$utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		
		$slashed = strtolower($utf8);
		
		$split = explode(';',$slashed);
		array_walk($split,'normal'); //  (*#*)
		$table[] = $split;
	}
}

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.', it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');



	
//////////////////////////////////////////////////////////////////////////////// 
//
//  GUESSING GENDERS
//

$genders = new C_dbAccess_genders();




//////////////////////////////////////////////////////////////////////////////// 
//
//  POST PROCESSING VISITORS ATTRIBUTES
//

$cuein = microtime(true);
$visitors = array();
$lcount = 0; $doublons = 0;
$fnposition = array_keys($headers, 'firstname'); $fnposition = $fnposition[0]; // position of firstname in the sequence of columns

$genderColumnIsAbsent = true; if(in_array('gender',$headers)) $genderColumnIsAbsent = false;

$dsVisitors = Array(); $gcount = Array(); for($g = 0; $g<=5; $g++) $gcount[$g] = 0;
foreach($lines as $x => $split) {

	$lcount++; $underbreak = false;
	$vid = false;
	$remoteId = false;
	foreach($headers as $hcount => $header) {
		$value = $split[$hcount]; 
		switch($header) {
			case 'remoteId':
				if(!$value) $underbreak = true;
				else $remoteId = $value;
				break;
			case 'mobId':
				if(!$value) $underbreak = true;
				$vid = $value;
				break;
			
		}
	}
	if($underbreak) continue;
	
	$dSvisitor = new C_dS_visitor($vid);
	$dSvisitor->remoteId = $remoteId;
	$dSvisitor->residence = $remoteId;
	if($dSvisitor->id) if($dSvisitor->groupId == 3914)
		$dsVisitors[] = $dSvisitor;
	unset($dSvisitor);
}
unset($lines);

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$beforeDoublons = count($dsVisitors);
$out .= h2($beforeDoublons.' visitor objects have been generated in: '.$cuedelta.' from '.$lcount.' lines read');
$out .= notice('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;males count: '.$gcount[1].' females count '.$gcount[0]);



$noDoublon = $dsVisitors; // skips the doublon removal (skip when loading companies for outbound commercial call, names and firstname are 'x' most often)


	
//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

$c = 0;
if($do) {
	
	$cuein = microtime(true);
	foreach($noDoublon as $x => $dS) { 
		$out .= warning('<b>localId:</b>'.$dS->id.' <b>remoteId:</b>'.$dS->remoteId);
		
		$dS_syncV = new C_dS_synchro_visitor(0,3914);
		$dS_syncV->skeyId = 35452;
		$dS_syncV->localId = $dS->id;
		$dS_syncV->remoteId = $dS->remoteId;
		$dS_syncV->dSsave();
		
		unset($dS->{'remoteId'});
		$c++; $dS->dSsave(); 
		
		
	};
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c.' Visitors where written in BD: it took '.$cuedelta.' ');
	$out .= warning('<b> ! ! do NOT re-execute this page ! ! </b>');
} else {
	foreach($noDoublon as $x => $dS) { $c++; };
	$out .= h2($c.' dataSets are ready. No WRITING to BD, you are in check mode: use &do=1 to write to DB');
}


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'seconds');

if($host=='localhost')
	$out .= hrefbutton('Go to Prod', $gotoprod);

echo html($out); // from utililib.php

?>