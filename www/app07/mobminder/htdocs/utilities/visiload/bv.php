<?php
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  IMPORTS VISITORS FOR BUROGEST
//
//  Usage: 127.0.0.1/utilities/bv.php?id=2891&sfx=_7160
//


$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('mobminder visitors csv loader');
$html->pushHTML('<h1>mobminder visitors csv loader</h1>');

function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function notice($msg) { global $html; $html->pushHTML('<p>'.$msg.'</p>'); }


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;
if(isset($_GET['sfx'])) $suffix = $_GET['sfx']; else $suffix = '';
if(isset($_GET['del'])) $delete = 1; else $delete = 0;

if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');

$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');

$filename = $groupId.$suffix.'visi.csv';
if (!file_exists($filename)) error('No corresponding csv file: '.$filename);

$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);

$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);

$html->pushHTML('<h2>File opened: '.$filename.'</h2>');

$html->pushHTML('<p><b>First line: </b>'.$line1.'</p>');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $html->pushHTML('<p>Lines are feeded with <b>CRLF</b></p>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $html->pushHTML('<p>Lines are feeded with <b>LF</b></p>'); };

$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);

$o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	if(!array_key_exists($header,$o_dS_defaults))
		error('The following header has no correspondance in the target visitor table: '.$header, $handle);
}
$html->pushHTML('<h2>Headers are compliant with DB definitions: '.++$hcount.' columns</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//
$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $ccount = $hcount-1; $table = array();
function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
while (!feof($handle)) {
	$line = substr(fgets($handle),0,-$crlf);
	$lcount++;
	if(substr_count($line, ';') != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
		$skipcount++; notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match)'); continue; }; 
	$utf8 = utf8_encode(strtolower($line)); // all the line is set to lowercase, then converted to utf8 (sequence is important)
	// $utf8 = strtolower($line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
	$slashed = addslashes($utf8);
	$split = explode(';',$slashed);
	array_walk($split,'normal');
	$table[] = $split;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount -= $skipcount;
$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines</h2>');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB', $handle);

//////////////////////////////////////////////////////////////////////////////// 
//
//  FLUSHING EXISTING VISITORS
//

if($delete) {
	new Q('DELETE FROM visitors WHERE groupId="'.$groupId.'";');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL
//


$genders = new C_dbAccess_genders();

$cuein = microtime(true);
$SQL = array();
$tracking = '"", "'.$groupId.'", NOW(), "visiload", 0, NOW(), "visiload", 0, 0, ""';
$lcount = 0;
$fnposition = array_keys($headers, 'firstname'); $fnposition = $fnposition[0]; // position of firstname in the sequence of columns

foreach($table as $x => $split) {
	$values = $tracking; $lcount++;
	$skipline = 0;
	foreach($headers as $hcount => $header) { // scans headers according to the input csv file
		$value = $split[$hcount];
		switch($header) {
			case 'gender': if($value=='') $value = $genders->guess($headers['firstname']); break;
			case 'language': if($value=='') $value = language_code_french; break;
			case 'mobile': 
				$value = checkMobileFormat($value, $o_dS_group->phoneRegion); 
				break;
			case 'lastname': 
				if($value == '') { notice('<b style="color:red;">no lastname value</b>, skipping data line '.$lcount.'...'); $skipline++; }
			case 'firstname':  
				if($value == '') { notice('<b>(no firstname value</b>, at line '.$lcount.')'); $value = 'x'; } ;
			case 'address': 
			case 'zipCode': 
			case 'city': 
			case 'country': 
			case 'birthday': 
				if($value!='') $value = ucfirst($value); else $value = ''; break;
		}
		$o_dS_defaults[$header] = $value;
	}
	$o_dS_defaults['gender'] = $genders->guess($split[$fnposition]);
	$o_dS_defaults['language'] = language_code_french;
	
	if($skipline) continue;
	
	foreach($o_dS_defaults as $field => $default) { $values .= ',"'.$default.'"'; } // make the SQL values syntax
	$SQL[] = 'INSERT INTO `visitors` VALUES ('.$values.')';
}
notice('<b>'.$lcount.' SQL instructions are ready</b>');
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>SQL has been generated in: '.$cuedelta.' mseconds</h2>');

//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL
//

$cuein = microtime(true);
mysql_select_db ('mobminder');
foreach($SQL as $x => $SQLstatement) new Q($SQLstatement);

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>SQL has been executed in: '.$cuedelta.' mseconds</h2>');

$html->pushHTML('<h2>Upload SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();












?>