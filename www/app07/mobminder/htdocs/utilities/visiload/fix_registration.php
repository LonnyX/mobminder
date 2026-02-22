<?php

$systemLog = 'visiload';
require '../utililib.php';
ini_set('memory_limit', '1024M');

$allin = microtime(true);
 
//////////////////////////////////////////////////////////////////////////////// 
//
//  This script was written to add the registration field to an existing collection of visitors ( Titeca 2022 )
//
//  FROM .CSV FILES to a MOBMINDER ACCOUNT
//
//   Usage: http://be.mobminder.com/utilities/visiload.php?id=3143&do=1&cleanup=1


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOCATING HOST
//

	$uriandpar = explode('?',$_SERVER['REQUEST_URI']);  // http://localhost/utilities/visiload/visiload.php?id=5009
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

$gotoprod = 'https://be.mobminder.com/utilities/visiload/visiload.php'.'?'.$pars.'';





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

$positions = Array();

	if(in_array('residence',$headers)) { // match agenda resource using a name (correlators in the code below)
		$has_resc_name = true; 
		$positions['residence'] = array_search('residence', $headers);
	} else {
		error('There is no residence field: '.$filename, $handle);
	}

	if(in_array('registration',$headers)) { // match agenda resource using a name (correlators in the code below)
		$has_resc_name = true; 
		$positions['registration'] = array_search('registration', $headers);
	} else {
		error('There is no registration field: '.$filename, $handle);
	}


		
		


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//


$cuein = microtime(true);
$lcount = 0;
$lines = tolines($handle, 'ISO-8859-1'); // from utililib.php

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$lcount = count($lines);
$out .= h2('The file has been read in: '.$cuedelta.', it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');





//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING MOB VISITORS
//

$visitors_by_residence = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
if(1) {

			$cuein = microtime(true); $visiTotal = 0;
			
	$SQL = 'SELECT id, residence FROM visitors WHERE visitors.groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL); if(!$result) error('SQL failed:'.$SQL.' ');
	while ($row = $result->fetch_array()) {
		$r = $row['residence'];
		if(strpos($r, '#') !== false) { $r = explode('#',$r); $r = $r[0]; };
		$r = strtolower($r);
		$visitors_by_residence[$r] = $row['id'];
		$visiTotal++;
	}
	$result->close();
		
		$cueout = microtime(true);
		$cuedelta = (($cueout-$cuein)*1000)|0;
		$out .= h2('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');

}




//////////////////////////////////////////////////////////////////////////////// 
//
//  POST PROCESSING VISITORS ATTRIBUTES
//

$cuein = microtime(true);
$visitors = array();
$lcount = 0; $rcount = 0;
$fnposition = array_keys($headers, 'firstname'); $fnposition = $fnposition[0]; // position of firstname in the sequence of columns

$genderColumnIsAbsent = true; if(in_array('gender',$headers)) $genderColumnIsAbsent = false;

$dsVisitors = Array();
foreach($lines as $x => $split) {

	$lcount++; $underbreak = false;
	
	$residence = $split[$positions['residence']];
	$registration = $split[$positions['registration']];
	if($residence!==''&&$residence!=='0') {
		
		if(!isset($visitors_by_residence[$residence])) {
			$out .= warning('<b>unlinkable visitor: </b> line '.$x.', (no reference found for the visitor:'.$residence.')'); // continue;
			$underbreak = true;
		} else {
			$visiId = $visitors_by_residence[$residence];
			// $out .= notice('<b>Visi id : </b>'.$visiId.', registration:'.$registration);
			if($registration) {
				$rcount++;
				$dSvisitor = new C_dS_visitor($visiId);
				$dSvisitor->registration = $registration;
				if($do) {
					$dSvisitor->dSsave();
				}
			} else { $underbreak = true; $dSvisitor = false; }
		}
	}
	
	
	if($underbreak) continue;
	$dsVisitors[] = $dSvisitor; unset($dSvisitor);
}
unset($lines);

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$dsVcount = count($dsVisitors);
$out .= h2($dsVcount.' visitor objects have been opened, '.$rcount.' registration Number are fixed in: '.$cuedelta.' from '.$lcount.' lines read');


	set_time_limit(360); // take a breath ( allows 10min execution )
	
	
	

	
//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

$c = 0;
if($do) {	
	
} else {
	foreach($dsVisitors as $x => $dS) { $c++; };
	$out .= h2($c.' dataSets are ready. No WRITING to BD, you are in check mode: use &do=1 to write to DB');
}


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'seconds');

if($host=='localhost')
	$out .= hrefbutton('Go to Prod', $gotoprod);

echo html($out); // from utililib.php



?>