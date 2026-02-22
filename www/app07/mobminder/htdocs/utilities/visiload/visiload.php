<?php

$systemLog = 'visiload';
require '../utililib.php';
ini_set('memory_limit', '1024M');

$allin = microtime(true);
 
//////////////////////////////////////////////////////////////////////////////// 
//
//  VISILOAD is a script that help LOADING VISITORS 
//
//  FROM .CSV FILES to a MOBMINDER ACCOUNT
//
//   Usage: http://be.mobminder.com/utilities


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
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);

C_dS_visitor::$defaults['language'] = $o_dS_group->language;
$o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	if(!array_key_exists($header,$o_dS_defaults)) { // the passed header does not match a dS_visitor header
		
		if($header=='eubirthday') { // having format dd/mm/yyyy like 13/10/1993
			// acceptable and treated later on as birthday
		}
		else
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
$lines = tolines($handle, 'ISO-8859-1', false/* not to lower*/); // from utililib.php


if(0) {
	while (!feof($handle)) {
		$line = substr(fgets($handle),0,-$crlf);
		$lcount++;
		if(substr_count($line, ';') != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
			$skipcount++; $out .= notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match:'.$line.')'); continue; }; 
		$utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		
		$slashed = mb_strtolower($utf8);
		
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

$genders = new C_dbAccess_genders(true);



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOCAL LIB
//

function eu_birthday_rewrite($date) {  // datetime arrives like 15/01/2016 as dd/mm/yyyy
	
	// [dd/mm/yyyy]
	if($date=='') return 0;
	if(strlen($date)<10) return 0;
	
	$in_date = substr($date,0,10); // like 15/01/2016
	
	$output = '';
	
		$dd = substr($in_date,0,2); 
		$mm = substr($in_date,3,2);		
		$yyyy = substr($in_date,-4);
	
	$output = $yyyy.$mm.$dd;
	return $output; // now like '20160115'
}


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
	$dSvisitor = new C_dS_visitor(0, $accountId);
	foreach($headers as $hcount => $header) {
		$value = $split[$hcount]; 
		switch($header) {
			case 'gender':
				if($value===0||$value===1) { $gcount[$value]++; /* do nothing, speed up process */ }
					else
				if(($value!=='1')&&($value!=='0')&&($value!=='2')&&($value!=='3')) {
					$g = 1;
					switch(mb_strtolower($value)) { // see .js: var gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
						
					
						case 'mr.': case 'mr': case 'm': case 'm.': case 'masculin': case 'homme': $g=1; break; // remember that the all line was set to lower case
						case 'mme.': case 'mme': case 'f': case 'v': case 'f.': case 'féminin': case 'femme': $g=0; break;
						case 'mlle': $g=4; break;
						case 'sprl': case 's.p.r.l.': case 's.p.r.l': $g=3; break;
						case 'sa': case 's.a.': case 's.a': $g=2; break;
						
						default:
							$fn = mb_strtolower($split[$fnposition]);
							// $out .= notice(' ->> going to guess on '.$fn.' (file input was '.mb_strtolower($value).')');
							$g = $genders->guess($fn); // guess based on firstname and our mobminder stats
					}
					$value = $g; $gcount[$g]++;
				}
				break;
				
			case 'language': 
				if($value=='') $value = $o_dS_group->language; 
				if($value<0) $value = $o_dS_group->language;
				if($value>9) $value = $o_dS_group->language;
				break;
			case 'mobile': 
				// $v = preg_replace('/[^0-9]/', '', $value); // note that heading '+' will also not pass through, so it is not necessary to have it in the csv
				$v = preg_replace('/[^'.filterfor(INPUT_NUMER).']/', '', $value); // note that heading '+' will also not pass through, so it is not necessary to have it in the csv
				if($v=='') { $value=''; break; }
				$digits = retrieveMobileFromDirty($v,$o_dS_group->phoneRegion);
				if(strlen($digits)!=strlen($value)) { 
					// $out .= micro('<b>mobile clean up</b>, <span style="color:red;">'.$value.'</span> turned into '.$digits); 
				}
				$checked = checkMobileFormat($digits, $o_dS_group->phoneRegion); // this function will accepts 0493123456 or +32493123456
				if(!$checked) { 
					$out .= warning('<b>mobile format did not pass</b>, '.$digits.' rejected.'); 
					$value = '';
				} else $value = $checked;
				break;
			case 'phone': 
				$digits = preg_replace('/[^0-9]/', '', $value); // clean up all non figure characters
				if($digits)
					if(substr($digits,0,1)!='0') {
						if(strlen($digits)<=9) $digits = '0'.$digits; // for numbers arriving like 26621800
						else if(substr($digits,0,1)!='+') $digits = '+'.$digits; // for numbers arriving like 3227707084
					}
				if($digits != $value) { 
					// $out .= micro('<b>phone clean up</b>, '.$value.' turned into '.$digits); 
				}
				$value = $digits;
				break;
			case 'eubirthday':
				$value = eu_birthday_rewrite($value);
				$header = 'birthday';
				// $out .= warning('<b>eubirthday:</b>, '.$value.'');
				// FALLS DOWN !
			case 'birthday':
				if(!$value) $value = 0;
				else
					if(!is_numeric($value)) {
						$out .= warning('<b>birthday format did not pass</b>, |'.$value.'| rejected.');
						$value = 0;
					}
				break;
			
			case 'address':
				$value = mb_strtolower($value);
				if($value!='') $value = ucwords($value); 
				break;
			
			case 'email': // expect and treats this kind of entry: 'stephane.cabo@gmail.com p*; olga@bgauto.be t*'
				$value = mb_strtolower($value);
				if($value!='') {
					
					$subparts = explode(' ', $value);
					// $sub1 = $subparts[1];
					// $sub2 = isset($subparts[2])?$subparts[2]:'';
					// $sub3 = isset($subparts[3])?$subparts[3]:'';
					
					$value = '';
					foreach($subparts as $x => $s) {
						$emlpattern = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z0-9-]{2,12}){1}$/';
						$isok = preg_match($emlpattern,$s);
						if(!$isok) {
							$out .= warning('<b>email format did not pass</b>, |'.$s.'| rejected.');	
						} else {
							$value = $s;
							break; // stops when finding one correct email
						}
					}
				}
				break;
				
			case 'reference': // FALLS DOWN !
				$value = str_replace('\n', '', $value); // no carriage return in single line fields (\n maintained in Notes!!)
					// $filter = utf8_encode('/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.,a-z A-Z0-9-\'\/\(\)]/');
				// $value = preg_replace($filter,'',$value);
				$value = trim($value);
				break;
				
			case 'lastname': // FALLS DOWN !
				if(strlen($value)<2) {
					$companyposition = false; 
						if(in_array('company',$headers)) { $companyposition = array_keys($headers, 'company'); $companyposition = $companyposition[0]; }
					if($companyposition) {
						$company = $split[$companyposition];
						if(!$company) {
							$out .= notice('<b>too short lastname value</b>, skipping '.$value.' data line '.$lcount.'...'); 
							$underbreak = true; break; 
						}
					}
				}
			case 'firstname':   // FALLS DOWN !
				if($value == '') { $value = 'x'; break; }
				if($header == 'firstname') if($genderColumnIsAbsent) $dSvisitor->gender = $genders->guess($value);
				
					$filter = utf8_encode('/[^_ÀáàâãäçËÈÉéèëêôóöíîïñûúùüÿ\'\.a-z A-Z-]/');
				
				$value = preg_replace($filter,'',$value);
				
			case 'zipCode':
			case 'city':
			case 'country':
			case 'residence':
			case 'company': // FALLS DOWN !
				$value = mb_strtolower($value); // So that is for Lastname and Firstname only
				$value = str_replace('\n', '', $value); // no carriage return in single line fields (\n maintained in Notes!!)
					$filter = utf8_encode('/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.,a-z A-Z0-9-\'\/\(\)]/');
				$value = preg_replace($filter,'',$value);
				if($value!='') $value = ucwords($value); 
				$value = trim($value);
				break; // See FALL DOWN, this applies to all types of fields from lastname to reference
				
			case 'note':
				// when Excel gets multi lines notes, it encloses the cell in double quotes => "line1+chr(13)+line2". We remove those addslashed quotes. If we don't, they are pushed to the DB and appear in the note on the app.
				// chr(92) is \ back slash
				// chr(34) is " double quote
				$value = trim($value,'"'); // see (*t*)
				$value = str_replace(chr(92).chr(34), '', $value); 
				$value = str_replace(chr(13), '', $value); // no carriage return in single line fields
				break;
		}
		$dSvisitor->{$header} = $value;
	}
	if($underbreak) continue;
	$dsVisitors[] = $dSvisitor; unset($dSvisitor);
}
unset($lines);

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$beforeDoublons = count($dsVisitors);
$out .= h2($beforeDoublons.' visitor objects have been generated in: '.$cuedelta.' from '.$lcount.' lines read');
$out .= notice('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;total gender guesses: '.$genders->guesscount.' from which '.$genders->nogender.' were not found and '.$genders->foundgender.' are successfully determined');
$out .= notice('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;input final males count: '.$gcount[1].', final females count '.$gcount[0]);


//////////////////////////////////////////////////////////////////////////////// 
//
//  REMOVING DOUBLONS
//

$letters = Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '\\');

$cuein = microtime(true);

	$alpha = Array();
	foreach($letters as $l) $alpha[$l] = Array();
	foreach($letters as $l1) foreach($letters as $l2) $alpha[$l1][$l2] = Array();

	$noDoublon = Array(); $c = 0;

	set_time_limit(1200); // take a breath ( allows 30min execution )

if($nodoublons) $noDoublon = $dsVisitors; // skips the doublon removal (skip when loading companies for outbound commercial call, names and firstname are 'x' most often)
else {
	
	$out .= h2('Doublons removal is enabled: ');
	foreach($dsVisitors as $x => $dSvisitor) {
	
		$underbreak = false;
		$lowerlast = mb_strtolower($dSvisitor->lastname);
		$l1 = $lowerlast[0]; 
		$l2 = $lowerlast[1]; 
		// if(isset($lowerlast[2])) $l3 = $lowerlast[2]; else $l3 = '.'; 
		
		// echo $lcount.' - '.$l1.' - '.$l2.' => '.$dSvisitor->lastname.'<br/>'; // (3rd subdivision level)
		
		$canFN = mb_strtolower($dSvisitor->firstname);
		$canLN = mb_strtolower($dSvisitor->lastname);
		$canBD = $dSvisitor->birthday;
		$canMO = $dSvisitor->mobile;
		
		if(isset($alpha[$l1][$l2]))
		if(count($alpha[$l1][$l2]))
			foreach($alpha[$l1][$l2] as &$yetpatient) {
				
				$yetFN = mb_strtolower($yetpatient->firstname);
				$yetLN = mb_strtolower($yetpatient->lastname);
				$yetBD = $yetpatient->birthday;
				$yetMO = $yetpatient->mobile;
				
				$FNmatch = $yetFN == $canFN; // they can be both empty
				$LNmatch = $yetLN == $canLN;
				$MOmatch = $yetMO == $canMO;
				$BDmatch = $yetBD == $canBD;
				
				$ignoring = 'DOUBLON ignoring '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
				$enriching = 'DOUBLON enriching '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
				
				if($LNmatch) { // LASTNAME DOES MATCH
					
					if($FNmatch) { // Last and first names are the same
						
						// full match
						if($MOmatch) if($BDmatch) { $out .= micro($ignoring.': full match');$doublons++; $underbreak = true;  continue; }
						
						// check cases where 3 out of 4 do match
						if($MOmatch) if($canBD=='') { $out .= micro($ignoring.': 3 match, no birthdate'); $doublons++; $underbreak = true; continue; }
						if($BDmatch) if($canMO=='') { $out .= micro($ignoring.': 3 match, no mobile'); $doublons++; $underbreak = true; continue; }
						
						if($MOmatch) if($canBD!=''&&$yetBD=='') { $yetpatient->birthday = $dSvisitor->birthday; $out .= micro($enriching.': 3 match, peeking birthdate'); $doublons++; $underbreak = true; continue; }
						if($BDmatch) if($canMO!=''&&$yetMO=='') { 
						
								// $digits = preg_replace('/[^0-9]/', '', $value);
								// if(!$digits) { $value = ''; break; }
								// if(substr($digits,0,1)!='0') {
									// $l = strlen($digits);
									// if($l==9) $digits = $o_dS_group->phoneRegion.$digits; // for numbers arriving like 497401626 adding e.g. '32'.$digits
									// $digits = '+'.$digits; // for numbers arriving like 32497401626
								// } // now all numbers are in a format "+32495123456"
								
								// if($digits != $value) { 
									// $out .= micro('<b>mobile clean up</b>, '.$value.' turned into '.$digits); 
								// }
								// $checked = checkMobileFormat($digits, $o_dS_group->phoneRegion); 
								// if(!$checked) { 
									// $out .= warning('<b>mobile format did not pass</b>, '.$digits.' rejected.'); 
								// } else $value = $checked;
								
							$yetpatient->mobile = preg_replace('/[^0-9]/', '', $dSvisitor->mobile); 
							$out .= micro($enriching.': 3 match, peeking mobile'); $doublons++; $underbreak = true; continue; 
						}
						
					} else { // Last names are the same, but firstnames are different
						
						$FNdistance = levenshtein($yetFN,$canFN);
						if($FNdistance<3) { // then we may ignore a doublon, but only if mobile OR birthday exists and match
							if($canBD!='') if($BDmatch&&$MOmatch) { $out .= micro($ignoring.': initials match, birthday match'); $doublons++; $underbreak = true; continue; } // there is a birthday and they match
							if($canMO!='') if($MOmatch&&$BDmatch) { $out .= micro($ignoring.': initials match, mobile match'); $doublons++; $underbreak = true; continue; } // there is a mobile and they match
						} else {
							// it is a different person
						}
					}
				
				} else {  // LASTNAME DOES NOT MATCH
					
					// resolves bad encoding of lastnames
					
					if($canMO) if($canBD) if($MOmatch) if($BDmatch) if($FNmatch) { 
						$out .= micro($ignoring.'Full match of fname, birthday and mobile, lastname must be bad encoded'); $doublons++; $underbreak = true; continue; 
					}
					if($canMO=='') if($MOmatch) if($canBD) if($BDmatch) if($FNmatch) { 
						$LNdistance = levenshtein($yetLN,$canLN);
						if($LNdistance<3) { $out .= micro($ignoring.'Full match fname and birthday, no mobile, lastname must be bad encoded (levenstein='.$LNdistance.')'); $doublons++; $underbreak = true; continue; }
					}
					if($canBD=='') if($BDmatch) if($canMO) if($MOmatch) if($FNmatch) { 
						$LNdistance = levenshtein($yetLN,$canLN);
						if($LNdistance<3) { $out .= micro($ignoring.'Full match fname and mobile, no birthday, lastname must be bad encoded (levenstein='.$LNdistance.')'); $doublons++; $underbreak = true; continue; }
					}
				}
				
				unset($yetpatient);
			}
		
		// record the candidate
		if($underbreak) continue;
		$noDoublon[$c] = $dSvisitor; 
			$alpha[$l1][$l2][] = &$noDoublon[$c]; // register this name under the alpha table (*1*)
			$c++;
		unset($dSvisitor);
	}
}
unset($alpha); // we keep only the noDoublon[] table

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$out .= h2($c.' visitors remain after '.$doublons.' doublons removing process, executed in: '.$cuedelta);



//////////////////////////////////////////////////////////////////////////////// 
//
//   E N R I C H I N G     U S I N G      C R O S S     I N F O 
//

if(0) { // needs more development

	$cuein = microtime(true);
	$out .= h2('Collecting more information...');
	set_time_limit(360); // take a breath ( allows 10 more min execution )
	$c = 0;
	foreach($noDoublon as $x => $dS) { 
		$fn = $dS->firstname;
		$ln = $dS->lastname;
		$bd = $dS->birthday;
		$q = new Q('select id, groupId, address, zipCode, city, country, mobile, phone from visitors where birthday="'.$bd.'" and lastname="'.$ln.'" and firstname="'.$fn.'" and groupId <>"'.$accountId.'"; ');
		$h = $q->hits();
		
		if($h>0) {
			$ad = $dS->address;
			$zp = $dS->zipCode;
			$ct = $dS->city;
			$cr = $dS->country;
			$mb = $dS->mobile;
			$ph = $dS->phone;
			$out .= micro($h.' matches found for '.$ln.' '.$fn.' on existing ids '.$q->ids().' - has yet ('.$ad.'|'.$zp.'|'.$ct.'|'.$cr.'|'.$mb.'|'.$ph.')');
			$cc = 0;
			while($r = $q->result->fetch_array()) {
				$ad_ = $r['address'];
				$zp_ = $r['zipCode'];
				$ct_ = $r['city'];
				$cr_ = $r['country'];
				$mb_ = $r['mobile'];
				$ph_ = $r['phone'];
				$out .= microtab('found '.++$cc.' for '.$ln.' '.$fn.' has '.'('.$ad_.'|'.$zp_.'|'.$ct_.'|'.$cr_.'|'.$mb_.'|'.$ph_.')');
			}
			$c++;
		}
	};
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c++.' visitors may already be recorded. Info collected in '.$cuedelta);
}


	set_time_limit(360); // take a breath ( allows 10min execution )
	
//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

$c = 0;
if($do) {	
	if($cleanup) {
		$cuein = microtime(true);
		
		new Q('delete att_visitors from att_visitors inner join reservations on reservations.id = att_visitors.groupId where reservations.groupId = '.$accountId.';');
		new Q('delete performances from performances inner join reservations on reservations.id = performances.groupId where reservations.groupId = '.$accountId.';');
		new Q('delete attendees from attendees inner join reservations on reservations.id = attendees.groupId where reservations.groupId = '.$accountId.';');
		new Q('delete reservations from reservations where reservations.groupId = '.$accountId.';');
		
		new Q('delete archive_att_visitors from archive_att_visitors inner join archive_reservations on archive_reservations.id = archive_att_visitors.groupId where archive_reservations.groupId = '.$accountId.';');
		new Q('delete archive_performances from archive_performances inner join archive_reservations on archive_reservations.id = archive_performances.groupId where archive_reservations.groupId = '.$accountId.';');
		new Q('delete archive_attendees from archive_attendees inner join archive_reservations on archive_reservations.id = archive_attendees.groupId where archive_reservations.groupId = '.$accountId.';');
		new Q('delete archive_reservations from archive_reservations where archive_reservations.groupId = '.$accountId.';');
		
		new Q('delete from visitors where groupId = '.$accountId.';');
		$cuedelta = deltasec($cuein,$cueout);
		$out .= h2('Older visitors where cleaned up in '.$cuedelta);
	} else {
		$out .= h2('Older visitors were not cleaned up. Use &cleanup=1');
	}
	
	$cuein = microtime(true);
	foreach($noDoublon as $x => $dS) { $c++; $dS->dSsave(); };
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c.' Visitors where inserted in BD: it took '.$cuedelta.' ');
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