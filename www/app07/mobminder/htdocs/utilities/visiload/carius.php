<?php

$systemLog = 'visiload';

require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  VISILOAD is a script that help LOADING VISITORS 
//
//  FROM .CSV FILES to a MOBMINDER ACCOUNT
//

//
//  Usage: be.mobminder.com/utilities/visiload.php?id=3010

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
function micro($msg) { global $html; $html->pushHTML('<p style="color:blue; padding-left:3em; font-size:75%; line-height:70%;">'.$msg.'</p>'); }


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;
if(isset($_GET['fn'])) $filename = $_GET['fn']; else $filename = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = true; else $do = false;

if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');

$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');

if(!$filename) $filename = $groupId.'.txt';
if (!file_exists($filename)) error('No corresponding txt file: '.$filename);

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
//   => CARIUS TEXT EXPORT FORMAT
//
// ****** début description PATIENT
// * bloc 1 : SIGNALETIQUE
// ** ligne 1
// NOMP		40	varchar	nom du patient
// SEXE		1	varchar	1:masculin / 2:féminin
// NAIS		8	varchar	date de naissance
// ETAT_CIVIL	1	int	1:Non précisé / 2:Célibataire / 3:Marié(e) / 4:Séparé(e) / 5:Divorcé(e) / 6:Veuf(ve)

// ** ligne 2
// ADR	70	varchar	adresse du patient
// CP	8	varchar code postal
// LOC	30	varchar	localité
// PAYS	20	varchar	pays

// ** ligne 3
// NUMM		3	varchar	numéro de la mutuelle
// CODE		7	varchar	code titularité
// NUM_MUTU	20	varchar	numéro d'affilié
// VIPO		1	varchar	N:non vipo / X:Vipo
// TYPEP		1	varchar 1:Titulaire / 2:Enfant / 3:Conjoint / 4:Ascendant / 5:Non défini 
//

// * bloc 2 : SOINS  <= MOBMINDER DOES NOT CARE ABOUT THIS
// ** ligne 1
// DATEF		10	varchar	date du soin
// DENT		5	varchar	dent du soin
// CODE		13	varchar	code du soin
// MATERIAU	30	varchar	Materiau utilisé
// COMMENTAIRE	255	varchar	commentaire du soin
//
// EXAMPLE:
// 0         1         2         3         4         5         6         7         8         9         10        11
// 012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789
//
// 00001011:RICUPERO VINCENZA                       2194103031
// 00001012:Rue Victor Hugo 24                                                    4460    GRACE-HOLLOGNE                BELGIQUE            
// 00001013:130110/110510303110M18        N1
// 00001021:19940203  14   DOL                                                                                                                                                                                                                                                                                                       
// 00001021:19940209  0    PANO                                       envoyée parodontologiste                                                                                                                                                                                                                                       
// 00001021:19971117  -    301011                                     CONS   voudrait solution pour retrover mastication
// 00001021:19971117  -    307090                                     PANO   prochain r-v  expliquer projet + ext 26
// 00001021:19971121  15   304371                                     O          


$cuein = microtime(true);
$lcount = 0; $table = array();
function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
function readline($handle) {
	$line = trim(fgets($handle));
	$utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
	$slashed = strtolower($utf8);
	return $slashed;
}
while (!feof($handle)) {
	$line = readline($handle);
	if(substr($line,6,2)=='11') { // enter bloc 1 line 1, that is ALWAYS followed by bloc 1 line 2 (even if no data is in line 2)
		
		$split = Array(); // prepares a new dataset
		$name = trim(substr($line,9,40));
		$gender = trim(substr($line,49,1)); if($gender==2) $gender = 0; // in mobminder, females are 0, males are 1
		$birthday = trim(substr($line,50,8)); 
		if($birthday != '') {
			if((substr($birthday,0,4)|0)>2014) $birthday = ''; 
			if((substr($birthday,0,4)|0)<1900) $birthday = '';
		}
		
		$split['gender'] = $gender;
		$split['birthday'] = $birthday; 
		$split['lastname'] = $name;
		$split['firstname'] = 'X'; // assumes we have no firstname, only the lastname is written
		
		// while(substr_count($name, '  ')>0)
			// str_replace($name, ' ', '  '); // sometimes first and lastnames are separated by a double space;
			
		$name = preg_replace('/\s+/', ' ',$name);
		$name = str_replace('*', '',$name);
		$spaces = substr_count($name, ' ');
		if($spaces) {
			if($spaces==1) { // only one space in name field, we split confident that firstname is last, lastname is first (family name first)
			
				$names = explode(' ', $name);
				$split['lastname'] = $names[0];
				$split['firstname'] = $names[1];
				
			} else {
				$f3 = substr($name,0,3);
				$f4 = substr($name,0,4);
				$f7 = substr($name,0,7);
				$f8 = substr($name,0,8);
				
				if($spaces == 2) {
					
					if (
					 ($f3=='de ')
					||($f3=='di ')
					||($f3=='la ')
					||($f3=='el ')
					||($f4=='van ')
					||($f4=='ait ')
					||($f4=='ben ')
					||($f7=='vanden ')
					||($f7=='vander ') ) { // composed lastnames
					
					$names = explode(' ', $name);
					$split['lastname'] = $names[0].' '.$names[1];
					$split['firstname'] = $names[2];
					
					} else { // multiple surnames
						$names = explode(' ', $name);
						$split['lastname'] = array_shift($names);
						$split['firstname'] = implode(' ',$names);
					}
					
				} else if($spaces == 3) {
					
					if( ($f8=='van den ')
					  ||($f8=='van der ') ) { // composed lastnames
					
					$names = explode(' ', $name);
					$split['lastname'] = $names[0].' '.$names[1].' '.$names[2];
					$split['firstname'] = $names[3];
					
					} else { // multiple surnames
						
						$names = explode(' ', $name);
						$split['lastname'] = array_shift($names);
						$split['firstname'] = implode(' ',$names);
					
					}
					
				} else if($spaces > 3) { // the default "do something anyway" case
					
					$names = explode(' ', $name);
					$split['lastname'] = array_shift($names);
					$split['firstname'] = implode(' ',$names);
				}
			}
		}
		
		$line2 = readline($handle); // read line 2 
		
		if( strlen($split['lastname'])<3 && strlen($split['firstname'])< 2) continue;
		
		$address = trim(substr($line2,9,70));
		$zipCode = trim(substr($line2,79,8));
		$city = trim(substr($line2,87,30));
		$country = trim(substr($line2,117,20));
		
		$split['address'] = $address;
		$split['zipCode'] = $zipCode;
		$split['city'] = $city;
		$split['country'] = $country;
		
		$table[] = $split;
		$lcount++;
	}
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines</h2>');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');



//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL
//

$cuein = microtime(true);
$visitors = array();
$lcount = 0; $doublons = 0;

if(true) {
	$c = 0; foreach($table as $x => $split) {

		$lcount++; $underbreak = false;
		$dSvisitor = new C_dS_visitor(0, $groupId);
		
		$dSvisitor->gender = $split['gender'];
		$dSvisitor->birthday = $split['birthday'];
		$dSvisitor->firstname = ucwords($split['firstname']);
		$dSvisitor->lastname = ucwords($split['lastname']);
		
		$dSvisitor->address = ucwords($split['address']);
		$dSvisitor->zipCode = $split['zipCode'];
		$dSvisitor->city = ucwords($split['city']);
		$dSvisitor->country = ucwords($split['country']);
		
			$i = strtolower($dSvisitor->lastname[0]); 
		
		// REMOVING DOUBLONS
		//
		if(isset($alpha[$i]))
			foreach($alpha[$i] as &$yetpatient) { // early doublon removal
				
				$yetFN = strtolower($yetpatient->firstname);	$canFN = strtolower($dSvisitor->firstname);
				$yetLN = strtolower($yetpatient->lastname);		$canLN = strtolower($dSvisitor->lastname);
				$yetBD = $yetpatient->birthday;					$canBD = $dSvisitor->birthday;
				$yetMO = $yetpatient->mobile;					$canMO = $dSvisitor->mobile;
				
				$FNmatch = $yetFN == $canFN; // they can be both empty
				$LNmatch = $yetLN == $canLN;
				$MOmatch = $yetMO == $canMO;
				$BDmatch = $yetBD == $canBD;
				
				$initialsMatch = $yetFN[0] == $canFN[0];
				if($initialsMatch) {
					// check length
					$yln = strlen($yetFN); $cln = strlen($canFN);
					$dif = ($cln-$yln); if($dif<0) $dif = -1*$dif; // make it positive
					if($dif>2) $initialsMatch = false; // more than 2 letters difference in length: this is obviously not the same firstname
					else {
						// look closer if the firstname match is really a typo, they must have max 2 characters different
						$common = 0;
						for($yc=0; $yc<$yln; $yc++) { $yletter =$yetFN[$yc];
							for($cc=0; $cc<$cln; $cc++) { $cletter =$canFN[$cc];
								$d = ($yc-$cc); if($d<0) $d = -1*$d; // letters distance
								if($d>1) continue; // we don't want to compare letters at the beginning of one name with letters at the end of the other, we check on one letter distance
								if($yletter == $cletter) $common++;
							}
						}
						$distance = ($yln-$common); // tells how many letters are different between yet and candidate firstnames
						if($distance>2) $initialsMatch = false; // there are at least 3 letters that are different, the two firstnames are different
					}
				}
				
				$ignoring = 'DOUBLON ignoring '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
				$enriching = 'DOUBLON enriching '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
				
				if($LNmatch) {
					if($FNmatch) { // Last and first names are the same
						
						// full match
						if($MOmatch) if($BDmatch) { notice($ignoring.': full match');$doublons++; $underbreak = true;  continue; }
						
						// check cases where 3 out of 4 do match
						if($MOmatch) if($canBD=='') { notice($ignoring.': 3 match, no birthdate'); $doublons++; $underbreak = true; continue; }
						if($BDmatch) if($canMO=='') { notice($ignoring.': 3 match, no mobile'); $doublons++; $underbreak = true; continue; }
						
						if($MOmatch) if($canBD!=''&&$yetBD=='') { $yetpatient->birthday = $dSvisitor->birthday; notice($enriching.': 3 match, peeking birthdate'); $doublons++; $underbreak = true; continue; }
						if($BDmatch) if($canMO!=''&&$yetMO=='') { $yetpatient->mobile = $dSvisitor->mobile; notice($enriching.': 3 match, peeking mobile'); $doublons++; $underbreak = true; continue; }
						
					} else { // Last names are the same, but firstnames are different
						
						if($initialsMatch) { // then we may ignore a doublon, but only if mobile OR birthday exists and match
							if($canBD!='') if($BDmatch&&$MOmatch) { notice($ignoring.': initials match, birthday match'); $doublons++; $underbreak = true; continue; } // there is a birthday and they match
							if($canMO!='') if($MOmatch&&$BDmatch) { notice($ignoring.': initials match, mobile match'); $doublons++; $underbreak = true; continue; } // there is a mobile and they match
						} else {
							
							if($canMO) if($canBD) if($MOmatch) if($BDmatch) if($FNmatch) { notice($ignoring.': initials match, mobile match'); $doublons++; $underbreak = true; continue; }
						}
					}
				
				} else { // lastnames do not match, but obviously it is the same person
					
					// resolves bad encoding of lastnames
					if($canMO) if($canBD) if($MOmatch) if($BDmatch) if($FNmatch) { notice($ignoring.'Full match of fname, birthday and mobile, lastname must be bad encoded'); $doublons++; $underbreak = true; continue; }
					if($canMO=='') if($MOmatch) if($canBD) if($BDmatch) if($FNmatch) { notice($ignoring.'Full match fname and birthday, no mobile, lastname must be bad encoded'); $doublons++; $underbreak = true; continue; }
					if($canBD=='') if($BDmatch) if($canMO) if($MOmatch) if($FNmatch) { notice($ignoring.'Full match fname and mobile, no birthday, lastname must be bad encoded'); $doublons++; $underbreak = true; continue; }
				}
				
				unset($yetpatient);
			}
		
		// record the candidate
		if($underbreak) continue;
		$visitors[$c] = $dSvisitor; 
				if(!isset($alpha[$i])) $alpha[$i] = Array();
			$alpha[$i][] = &$visitors[$c]; // register this name under the alpha table (*1*)
			$c++;
		unset($dSvisitor);
	}
	unset($table);
	unset($alpha); // we keep only the visitors[] table

	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>'.$doublons.' doublons have been removed</h2>');
	$html->pushHTML('<h2>Visitor objects have been generated in: '.$cuedelta.' mseconds</h2>');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

if($do) {
	if($cleanup) {
		$cuein = microtime(true);
		 new Q('DELETE FROM visitors WHERE groupId = '.$groupId.';');
		$cuedelta = (($cueout-$cuein)*1000)|0;
		$html->pushHTML('<h2>Older visitors where cleaned up in '.$cuedelta.' mseconds</h2>');
	} else {
		$html->pushHTML('<h2>Older visitors were not cleaned up. Use &cleanup=1</h2>');
	}
	
	$cuein = microtime(true);
	mysql_select_db ('mobminder');
	foreach($visitors as $x => $dS) $dS->dSsave();
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>Visitors where inserted in BD: took '.$cuedelta.' mseconds: do NOT re-execute this page.</h2>');

} else {

	$html->pushHTML('<h2>No WRITING to BD, you are in check mode: use &do=1 to write to DB</h2>');
}


$html->pushHTML('<h2>Upload SUCCESSFULL</h2>');
$html->dropPage();



?>