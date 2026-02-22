<?php
require '../../classes/language.php';
require '../../../lib_mobphp/chtml.php';
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  S C A N     X M L     F I L E     F O R     V I S I T O R S    I M P O R T
//
//  Usage: 127.0.0.1/utilities/xml.baltes.php?fn=hadental.xml&gid=4142
//  Usage: 127.0.0.1/utilities/xml.baltes.php?fn=4146.xml&gid=4146
//
//  Last update: ready to extract patient data from a CORILUS/BALTES xml export


$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8'); //<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('Mobminder visitors XML loader');
$html->pushHTML('<h1>mobminder xml scanner & clean up</h1>');

function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function notice($msg) { global $html; $html->pushHTML('<p>'.$msg.'</p>'); }
function warning($msg) { global $html; $html->pushHTML('<p style="color:orange">'.$msg.'</p>'); }


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//

if(isset($_GET['gid'])) $groupId = $_GET['gid']; else $groupId = false;
if(isset($_GET['fn'])) $n = $_GET['fn']; else $n = '';
if(isset($_GET['del'])) $delete = 1; else $delete = 0;

if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');

$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');

$filename = $n;
if (!file_exists($filename)) error('No corresponding file: '.$filename);

$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);

$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);

$html->pushHTML('<h2>File opened: '.$filename.'</h2>');

$html->pushHTML('<p><b>First line: </b>'.$line1.'</p>');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $html->pushHTML('<p>Lines are feeded with <b>CRLF</b></p>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $html->pushHTML('<p>Lines are feeded with <b>LF</b></p>'); };



//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $table = array(); $alpha = array();
$patientsCount = 0; 
$inPatient = false; // patient file entered
	$inPersonalData = false; // patient file entered
	$inAddressData = false;
	$inPhones = false;
	$patient = false;
while (!feof($handle)) {
	$line = substr(fgets($handle),0,-$crlf);
	if($line=='</patient_medical_info>') { // ending up a patient section
		// we are leaving a patient info tag
		$display = $patient['firstname'].' '.$patient['lastname'].' '.$patient['birthday'].' '.$patient['mobile'].' '.$patient['address'];
		$candidate = false;
		if(($patient['firstname'])&&($patient['lastname'])) $candidate = $patient;
			else warning('missing first or last name at line '.$lcount.': '.$display);
		
		if($candidate) {
			$i = strtolower($patient['lastname'][0]);
			if(isset($alpha[$i]))
				foreach($alpha[$i] as $yetpatient) { // early doublon removal
					if(str_replace(' ', '', strtolower($patient['lastname']))==str_replace(' ', '', strtolower($yetpatient['lastname'])))
						if($patient['birthday']==$yetpatient['birthday'])
							if(strtolower($patient['firstname'][0])==strtolower($yetpatient['firstname'][0])) // same firstname initial
								{ $candidate = false; warning('X removing doublon for '.$patient['firstname'].' '.$patient['lastname']); }
				}
		}
		if($candidate) { 
			$table[] = $candidate; 
			$i = strtolower($patient['lastname'][0]);
			if(!isset($alpha[$i])) $alpha[$i] = Array();
			$alpha[$i][] = $candidate;
		}
		$inPatient = false;
	}
	if($line=='<patient_medical_info>') {  // starting a patient section
		$patientsCount++; $inPatient = true; 
		$patient = array('gender'=>false, 'firstname'=>false, 'lastname'=>false, 'birthday'=>'', 'mobile'=>'', 'phone'=>'', 'email'=>'', 'address'=>'', 'zipCode'=>'', 'city'=>'', 'country'=>''); }
	
	if($inPatient) {
		if($line=='</personal_data>') $inPersonalData = false;
		if($line=='<personal_data>') $inPersonalData = true;
		if($line=='</address_data>') $inAddressData = false;
		if($line=='<address_data>') $inAddressData = true;
		if($line=='</phones>') $inPhones = false;
		if($line=='<phones>') $inPhones = true;
		if($inPersonalData) {
			if(strpos($line,'<Number>')!==false) $patient['registration'] = 'd'.ucwords(strtolower(getTextBetweenTags($line,'Number')));
			if(strpos($line,'<First_name>')!==false) $patient['firstname'] = ucwords(strtolower(getTextBetweenTags($line,'First_name')));
			if(strpos($line,'<Name>')!==false) $patient['lastname'] = ucwords(strtolower(getTextBetweenTags($line,'Name')));
			if(strpos($line,'<Sexe>')!==false) {
				$v = getTextBetweenTags($line,'Sexe');
				$patient['gender'] = $v == 'Homme' ? 1 : 0;
			}
			if(strpos($line,'<Language>')!==false) {
				$v = getTextBetweenTags($line,'Language');
				$fl = substr($v,0,1);
				switch($fl) {
					case 'F': $patient['language'] = 1; break; // French ( Français)
					case 'N': $patient['language'] = 3; break;  // Dutch ( Néerlandais )
					case 'A': $patient['language'] = $v=='Anglais'?0:4; break;  // 4 is Allemand (Deutsh)
					case 'P': $patient['language'] = 2; break;  // Polish 
					default: $patient['language'] = $o_dS_group->language;
				}
				
			}
			if(strpos($line,'<Date_of_birth>')!==false) {
				$v = getTextBetweenTags($line,'Date_of_birth');
				if($v != '') {
					$split = explode('/',$v); 
					if(count($split)==3) $sortable = $split[2].$split[1].$split[0]; else $sortable = '';
					$patient['birthday'] = $sortable;
				} else 
					$patient['birthday'] = '';
			}
		}
		if($inAddressData) {
			if(strpos($line,'<Address>')!==false) $patient['address'] = ucwords(strtolower(getTextBetweenTags($line,'Address')));
			if(strpos($line,'<Postal_code>')!==false) $patient['zipCode'] = getTextBetweenTags($line,'Postal_code');
			if(strpos($line,'<City>')!==false) $patient['city'] = ucwords(strtolower(getTextBetweenTags($line,'City')));
			if(strpos($line,'<Country>')!==false) $patient['country'] = ucwords(strtolower(getTextBetweenTags($line,'Country')));
			if(strpos($line,'<Default_email_address>')!==false) $patient['email'] = ucwords(strtolower(getTextBetweenTags($line,'Default_email_address')));
		}
		if($inPhones) {
			if(strpos($line,'<Mobile>')!==false) {
				$mobile = getTextBetweenTags($line,'Mobile');
				$digits = preg_replace("/[^0-9+']/si",'',$mobile);
				$patient['mobile'] = $digits;
			}
			if(strpos($line,'<Private_phone>')!==false) {
				$phone = getTextBetweenTags($line,'Private_phone');
				$digits = preg_replace("/[^0-9+']/si",'',$phone);
				if((strlen($digits)==10)&&!$patient['mobile']) $patient['mobile'] = $digits; // sort out mobile numbers to the right field
					else $patient['phone'] = $digits;
			}
			if(strpos($line,'<Phone_at_work>')!==false) {
				$mobile = getTextBetweenTags($line,'Phone_at_work');
				$digits = preg_replace("/[^0-9+']/si",'',$mobile);
				if(!$patient['mobile']) if(strlen($digits)>=10) $patient['mobile'] = $digits;
			}
		}
	}
	$lcount++;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$lcount -= $skipcount;
$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines</h2>');
$html->pushHTML('<h2>Number of patients: '.$patientsCount.'</h2>');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB', $handle);



//////////////////////////////////////////////////////////////////////////////// 
//
//  FLUSHING EXISTING VISITORS
//

if($delete) {
	new Q('DELETE FROM visitors WHERE groupId="'.$groupId.'";');
	$html->pushHTML('<h2>Older patients are deleted</h2>');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL
//


$genders = new C_dbAccess_genders();

$o_dS_visitor = new C_dS_visitor();
$o_dS_defaults = $o_dS_visitor->getDefaults();
$o_dS_defaults['language'] = language_code_french;
if(true) {
	$cuein = microtime(true);
	$SQL = array();
	$tracking = '"", "'.$groupId.'", NOW(), "visiload", 0, NOW(), "visiload", 0, "", 0';
	$lcount = 0;

	foreach($table as $x => $patient) {
		$values = $tracking; $lcount++;
		$skipline = 0;
		foreach($patient as $member => $value) { // scans headers according to the input csv file
			$value = $patient[$member];
			switch($member) {
				case 'gender': if(($value!==1)&&($value!==0)) $value = $genders->guess($patient['firstname']); break;
				case 'language': if($value=='') $value = language_code_french; break;
				case 'mobile': 
					$value = checkMobileFormat($value, $o_dS_group->phoneRegion); 
					break;
				case 'lastname': 
					if($value == '') { notice('<b style="color:red;">no lastname value</b>, skipping data line '.$lcount.'...'); $skipline++; }
					break;
				case 'firstname':  
					if($value == '') { notice('<b>(no firstname value</b>, at line '.$lcount.')'); $value = 'x'; } ;
					break;
				case 'birthday': break;
				case 'email': break;
				case 'address': 
				case 'zipCode': 
				case 'city': 
				case 'country': 
					if($value!='') $value = ucfirst($value); else $value = ''; break;
			}
			$o_dS_defaults[$member] = addslashes(utf8_encode($value));
		}
		
		if($skipline) continue;
		
		foreach($o_dS_defaults as $field => $default) { $values .= ',"'.$default.'"'; } // make the SQL values syntax
		$SQL[] = 'INSERT INTO `visitors` VALUES ('.$values.')';
	}
	notice('<b>'.$lcount.' SQL instructions are ready</b>');
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>SQL has been generated in: '.$cuedelta.' mseconds</h2>');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL FOR FIXING EMAILS (Delescaille was uploaded when this script did not take email into cons
//

if(false) { // Kept for the sake of example
	$cuein = microtime(true);
	$SQL = array();
	$lcount = 0;

	foreach($table as $x => $patient) {
		$skipline = 0;
		$email = strtolower($patient['email']);
		if($email) {
			
			$birthday = $patient['birthday'];
			$lastname = addslashes(utf8_encode(ucfirst($patient['lastname'])));
			$firstname = addslashes(utf8_encode(ucfirst($patient['firstname'])));

			$q = new Q('SELECT id FROM visitors WHERE groupId = '.$groupId.' AND lastname = "'.$lastname.'" AND firstname = "'.$firstname.'" AND birthday = "'.$birthday.'";');
			$ids = $q->ids();
			if($ids) {
				$SQL[] = 'UPDATE `visitors` SET email = "'.$email.'" WHERE id IN ('.$ids.');';
				$lcount++;
			}
		}
	}
	notice('<b>'.$lcount.' SQL instructions are ready</b>');
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>SQL has been generated in: '.$cuedelta.' mseconds</h2>');
}



//////////////////////////////////////////////////////////////////////////////// 
//
//  EXECUTING SQL
//

$cuein = microtime(true);
// mysql_select_db ('mobminder');
foreach($SQL as $x => $SQLstatement) {
	new Q($SQLstatement);
}

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>SQL has been executed in: '.$cuedelta.' mseconds</h2>');

$html->pushHTML('<h2>Upload SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();

?>