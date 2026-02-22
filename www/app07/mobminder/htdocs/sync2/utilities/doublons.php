<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    D O U B L O N S    R E M O V A L    U T I L I T Y 
//
//  o Removes doublons entry in a Mobminder agenda
//  o Fix genders that are wrongly encoded (optional)
//

$systemLog = 'doublons remover';

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../lib.php';

$allin = microtime(true);

ini_set('memory_limit', '1024M');
 
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);

$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;

$check		= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false; $do = !$check;
$genders	= @$_POST['genders']; if(isset($genders)) $genders = !!$genders; else $genders = genders;
$uppercase	= @$_POST['uppercase']; if(isset($uppercase)) $uppercase = !!$uppercase; else $uppercase = uppercase;

if($genders) $genders = new C_dbAccess_genders();



//////////////////////////////////////////////////////
//
//  Echo functions
//
$out = '';
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em; font-weight:bold;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function micro($msg) { return '<p style="color:blue; padding-left:3em; font-size:80%; line-height:70%;">'.$msg.'</p>'; }
function microtab($msg) { return '<p style="color:red; padding-left:6em; font-size:75%; line-height:70%;">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out .= h1('mobminder visitors doublons merger');



//////////////////////////////////////////////////////////////////////////////// 
//
//  REMOVING DOUBLONS
//

function sanitize($s) { // make a string lowercase and a-z characters, make it at least 3 chars long also. So it is ready for a good comparison
	$i = mb_strtolower($s, 'UTF-8'); 
		$i = trim(preg_replace(utf8_encode('/[^אגדחיטכךפצמןש\'a-z]/'), '', $i));
		while(mb_strlen($i, 'UTF-8')<3) $i .= '_'; // make it at least length 3
	return $i;
}

$cuein = microtime(true);

		$letters = Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '\\');
		
	$alpha = Array(); // this array will be filled with unique instances from the doublon removing process
	foreach($letters as $l) $alpha[$l] = Array();
	foreach($letters as $l1) foreach($letters as $l2) $alpha[$l1][$l2] = Array();

	$gendered_dSvs = Array(); $g = 0; // improved genders counter
	$screened_dSvs = Array(); $c = 0; // genuine unique instance counter
	$doublons_dSvs = Array(); $d = 0; // doublons counter

$dsVisitors = new C_dbAccess_visitors(false, $accountId);
	$i = $dsVisitors->count(); // initially in the DB counter
	$out .= h2($i.' visitors initially in the DB');


	set_time_limit(300);
foreach($dsVisitors->keyed as $vid => $dSvisitor) {
	
	$underbreak = false; // if underbreak goes true, dSvisitor is a doublon
	$ln = sanitize($dSvisitor->lastname);
	$fn = sanitize($dSvisitor->firstname);
	
	$l1 = mb_substr($ln,0,1,'UTF-8'); $l2 = mb_substr($ln,1,1,'UTF-8');
	
	
	$canFN = $fn;
	$canLN = $ln;
	$canBD = $dSvisitor->birthday;
	$canMO = $dSvisitor->mobile;
	
	if(isset($alpha[$l1][$l2]))
	if(count($alpha[$l1][$l2]))
		foreach($alpha[$l1][$l2] as $passed) {
			
			$yetFN = $passed->lower_firstname;
			$yetLN = $passed->lower_lastname;
			$yetBD = $passed->birthday;
			$yetMO = $passed->mobile;
			
			$FNmatch = $yetFN == $canFN; // they can be both empty
			$LNmatch = $yetLN == $canLN;
			$MOmatch = $yetMO == $canMO;
			$BDmatch = $yetBD == $canBD;
			
			$ignoring = 'DOUBLON ignoring '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
			$enriching = 'DOUBLON enriching '.$dSvisitor->firstname.' '.$dSvisitor->lastname.' ';
			
			if($LNmatch) { // LASTNAME DOES MATCH
				
				if($FNmatch) { // Last and first names are the same
					
					// full match
					if($MOmatch) if($BDmatch) { $out .= micro($ignoring.': full match'); $underbreak = true; break; }
					
					// check cases where 3 out of 4 do match
					if($MOmatch) if($canBD=='') { $out .= micro($ignoring.': 3 match, no birthdate'); $underbreak = true; break; }
					if($BDmatch) if($canMO=='') { $out .= micro($ignoring.': 3 match, no mobile'); $underbreak = true; break; }
					
					if($MOmatch) if($canBD!=''&&$yetBD=='') { $passed->birthday = $dSvisitor->birthday; $out .= micro($enriching.': 3 match, peeking birthdate'); $underbreak = true; break; }
					if($BDmatch) if($canMO!=''&&$yetMO=='') { $passed->mobile = $dSvisitor->mobile; $out .= micro($enriching.': 3 match, peeking mobile'); $underbreak = true; break; }
					
				} else { // Last names are the same, but firstnames are different
					
					$FNdistance = levenshtein($yetFN,$canFN);
					if($FNdistance<3) { // then we may ignore a doublon, but only if mobile OR birthday exists and match
						if($canBD!='') if($BDmatch&&$MOmatch) { $out .= micro($ignoring.': initials match, birthday match'); $underbreak = true; break; } // there is a birthday and they match
						if($canMO!='') if($MOmatch&&$BDmatch) { $out .= micro($ignoring.': initials match, mobile match'); $underbreak = true; break; } // there is a mobile and they match
					} else {
						// it is a different person
					}
				}
			
			} else {  // LASTNAME DOES NOT MATCH
				
				// resolves bad encoding of lastnames
				
				if($canMO) if($canBD) if($MOmatch) if($BDmatch) if($FNmatch) { 
					$out .= micro($ignoring.'Full match of fname, birthday and mobile, lastname must be bad encoded'); $underbreak = true; break; 
				}
				if($canMO=='') if($MOmatch) if($canBD) if($BDmatch) if($FNmatch) { 
					$LNdistance = levenshtein($yetLN,$canLN);
					if($LNdistance<3) { $out .= micro($ignoring.'Full match fname and birthday, no mobile, lastname must be bad encoded (levenstein='.$LNdistance.')'); $underbreak = true; break; }
				}
				if($canBD=='') if($BDmatch) if($canMO) if($MOmatch) if($FNmatch) { 
					$LNdistance = levenshtein($yetLN,$canLN);
					if($LNdistance<3) { $out .= micro($ignoring.'Full match fname and mobile, no birthday, lastname must be bad encoded (levenstein='.$LNdistance.')'); $underbreak = true; break; }
				}
			}
			
		} // loop into alpha
	
	if($underbreak)	{ 
			$d++; $i--;
			$dSvisitor->mergeTo = $passed;
			$doublons_dSvs[$vid] = $dSvisitor; unset($dSvisitor);
		continue; 
	}
	
	// else record dSvisitor as a unique instance
	
	$dSvisitor->lower_lastname = sanitize($dSvisitor->lastname);
	$dSvisitor->lower_firstname = sanitize($dSvisitor->firstname);

	if($uppercase) {
		$dSvisitor->lastname = ucwords(trim(preg_replace(utf8_encode('/[^אגדחיטכךפצמןש\'\-a-z ]/'), '', mb_strtolower($dSvisitor->lastname, 'UTF-8'))));
		$dSvisitor->firstname = ucwords(trim(preg_replace(utf8_encode('/[^אגדחיטכךפצמןש\'\-a-z ]/'), '', mb_strtolower($dSvisitor->firstname, 'UTF-8'))));
	}
	if($genders) { // fix the gender
		$gg = $genders->guess($dSvisitor->firstname, -1); // returns 0 for a female and 1 for a male, or -1 if the name could not be guessed
		if($gg <> -1) if($gg <> $dSvisitor->gender) {
			$g++; 
			$dSvisitor->gender = $gg;
			$gendered_dSvs[$dSvisitor->id] = $dSvisitor;
		}
	}
	
	$screened_dSvs[$dSvisitor->id] = $dSvisitor; 
		$alpha[$l1][$l2][] = $dSvisitor; // register this name under the alpha table (*1*)
		
		$c++; $i--;
	unset($dSvisitor);
}
unset($alpha); // we keep only the screened_dSvs[] table

$out .= h2($i.' visitors not dispatched');
$out .= h2($c.' visitors are genuine unique instances');

$out .= h2($g.' genders were fixed in genuine instances');
	$a = 0;
	foreach($gendered_dSvs as $vid => $fixed) {
		$a++;
			$gg = $fixed->gender?'MALE':'FEMALE';
			$dd = $fixed->firstname.','.$fixed->lastname.'('.$fixed->id.')';
		$out .= microtab($a.': '.$dd.' <=> '.$gg);
	}

$out .= h2($d.' visitors are doublons');
	$a = 0;
	foreach($doublons_dSvs as $vid => $doublon) {
		$a++;
			$dd = $doublon->firstname.','.$doublon->lastname.'('.$doublon->id.')';
			$gg = $doublon->mergeTo->firstname.','.$doublon->mergeTo->lastname.'('.$doublon->mergeTo->id.')';
		$out .= microtab($a.': '.$dd.' <=> '.$gg);
	}

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$out .= h2('executed in: '.$cuedelta);



//////////////////////////////////////////////////////////////////////////////// 
//
//   E N R I C H I N G     U S I N G      C R O S S     I N F O    F R O M    O T H E R    A C C O U N T S 
//

if(0) { // needs more development

	$cuein = microtime(true);
	$out .= h2('Collecting more information...');
	set_time_limit(360); // take a breath ( allows 10 more min execution )
	$c = 0;
	foreach($screened_dSvs as $x => $dS) { 
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


//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

if($do) {	
	set_time_limit(300);
	$cuein = microtime(true); $c = 0;
		foreach($screened_dSvs as $vid => $dS) { $c++; unset($dS->lower_lastname); unset($dS->lower_firstname); $dS->dSsave(); };
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c.' Fixes were written in BD: it took '.$cuedelta.'.');
		
	$cuein = microtime(true); $c = 0;
		foreach($doublons_dSvs as $vid => $dS) { // doublons need to be actually merged 
			$c++;
			$dS->mergeTo();	// dS containing a ->mergeTo attribute	
		};
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c.' Doublons were merged in BD: it took '.$cuedelta.'.');

} else {
	$c = 0; foreach($screened_dSvs as $x => $dS) { $c++; };
	$out .= h2($c.' dataSets are ready. No WRITING to BD, you are in check mode');
}


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'seconds');

echo html($out);

?>