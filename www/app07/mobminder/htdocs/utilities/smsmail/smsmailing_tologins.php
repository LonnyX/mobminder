<?php

$systemLog = 'dmarketing';
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E :   SEND SMS TO MOBMINDER USERs BASED ON DATA FOUND IN LOGINS
//
// Start with a test:
//
//
// Go on with actual sending :
//
// 	be.mobminder.com/utilities/dmarketing.php?id=3441
//
//   where:
//   - id is the account id (used to load a .txt file named by id.txt, this file contains the SMS message to be sent)
//
// template example:
//
// <dutch>{dear} {gender} {lname},
// ?? Het Mobminder-team wenst u alvast prachtige eindejaarsvieringen! ?
// Wilt u ook wensen naar uw {alias} smssen? Neem contact op met ons om de inhoud en uitzenddatum te bepalen ??
// </dutch>
// <english>{dear} {gender} {lname},
// ?? The Mobminder team already wishes you wonderful end-of-year celebrations! ?
// Do you wish to sms your wishes to your {alias}? Get in touch with us to fix the content and broadcast date ??
// </english>
// <french>{dear} {gender} {lname},
// ?? l'équipe de Mobminder vous souhaite d'hors et déjà de magnifiques fêtes de fin d'année! ?
// Souhaitez-vous envoyer par sms vos voeux à vos {alias}? Prenez contact pour fixer le contenu et date de diffusion ??</french>
//
//
// pre-requisite: a file 2780.txt must be present in the utilities directory
// 
//
//

//////////////////////////////////////////////////////////////////////////////// 
//
//  
//

$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('utilities.css'			, 'stylesheet'	, 'text/css');
	$title = 'mobminder direct marketing SMS generator';
$html->pageTitle($title);
$html->pushHTML('<h1>'.$title.'</h1>');

function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }





//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUT PARAMETERS
//

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['last'])) $vlast = $_GET['last']+0; else $vlast = false;
if(isset($_GET['date'])) $date = $_GET['date']; else $date = '';
if(isset($_GET['rscid'])) $rscid = $_GET['rscid']; else $rscid = false;
if(isset($_GET['test'])) $test = $_GET['test']+0; else $test = true; // sends test SMS to Pascal Only. YOU NEED TO FORCE &test=0 for this script to send messages
if(isset($_GET['xcolor'])) $xcolor = $_GET['xcolor']; else $xcolor = false; // executes SMS sending over the entire query
if(isset($_GET['pages'])) $pages = $_GET['pages']+0; else $pages = 1; // max SMS pages defaults to 1
	if($pages+0!==$pages) error('parameter p (sms pages) must be 1, 2 or 3');
	$maxchars = $pages*240; if($pages==1) $maxchars = 240;

if(!$accountId) error('You need to give an account id');

$dS_system = new C_dS_system();
$dS_account = new C_dS_group($accountId);
$dbAccess_resources = new C_dbAccess_resources($accountId);

	if($rscid) {
		if(!isset($dbAccess_resources->keyed[$rscid]))
			 error('The specified rscid does not match a resource from the given account');
	}
	
if($dS_account->name == '') error('The account does not exists');

$html->pushHTML('<h2>Account identified: '.$dS_account->name.'</h2>');
$html->pushHTML('<h3>Test mode: '.($test?'YES':'OFF! messages will actually be sent').'</h3>');





//////////////////////////////////////////////////////////////////////////////// 
//
//  OPEN FILE
//
//  we will match only the account id (2839), so the filename is free after the account id, like "3252 - account name"

$cuein = microtime(true);

$matches = glob('./'.$accountId.'*.txt');
	if(count($matches)>1) error('Multiple files were found having this id in header: '.$accountId.'*.txt, there should be a single file.');
	if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*.txt');
$filename = $matches[0];
	if (!file_exists($filename)) error('No corresponding txt file: '.$filename);

$handle = fopen($filename,'r');
	if(!$handle) error('The file exists but could not be opened: '.$filename);

$line1 = fgets($handle);
	if($line1=='') error('The file is empty: '.$filename, $handle);
	rewind($handle);

	
$html->pushHTML('<h2>File opened: '.$filename.'</h2>');





//////////////////////////////////////////////////////////////////////////////// 
//
//  READ FILE
//
//  we will match only the account id (2839), so the filename is free after the account id, like "3252 - account name"


$crlf = 0; $text = ''; $lines = Array();

if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $html->pushHTML('<p>Lines are feeded with <b>CRLF</b></p>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $html->pushHTML('<p>Lines are feeded with <b>LF</b></p>'); };

if($crlf) $line1 = substr($line1,0,-$crlf);

// lines split
while(!feof($handle)) {
	$l = trim(fgets($handle));
	if($l) $lines[] = $l;
}
rewind($handle);

// file encoding detection
$s=''; $c=0; while(!feof($handle)&&$c++<256) $s .= trim(fgets($handle)); rewind($handle);
$encoding = mb_detect_encoding($s, mb_list_encodings(), true);
$html->pushHTML('<p><b>File encoding is:<br/></b>'.$encoding.'</p>');

$text = implode(chr(10),$lines);
if($encoding!='UTF-8') $text = utf8_encode($text);

	
// $template = addslashes(utf8_encode($line1)); // strips CRLF if any
	$webview = str_replace(chr(10), '<br/>', $text);
	
$html->pushHTML('<p><b>File content:<br/></b>'.$webview.'</p>');
$html->pushHTML('<p><b>Characters in template: </b>'.strlen($text).'</p>');



function excise($string, $tagname, $default = false) // extract the piece of text between <english>bla bla</english> or <french>bla bla</french>
{
    $pattern = "#<\s*?$tagname\b[^>]*>(.*?)</$tagname\b[^>]*>#s";
    preg_match($pattern, $string, $matches);
    if(isset($matches[1])) return $matches[1];
		else return $default;
}

$templates = Array();
$default = excise($text,'english',false);
if(!$default) $default = excise($text,'french',false);
if(!$default) $default = $text; // we make sure that the full text is the default in case no <language> tag is in the text provided

foreach(L::$languageNames as $langcode => $langname) {
	$translation = excise($text,$langname,'not found');
	$html->pushHTML('<p><b>'.$langname.': <br/></b>'.$translation.'</p>');
	
	$templates[$langcode] = $translation=='not found'?$default:$translation; 
}


$dS_templates = Array();
foreach(L::$languageNames as $langcode => $langname) {
	$dS_templates[$langcode] = new C_dS_smsTemplate();
	$dS_templates[$langcode]->message = $templates[$langcode];
}


fclose($handle);
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>File read and context check in '.($cuedelta/1000).' seconds</h2>');






//////////////////////////////////////////////////////////////////////////////// 
//
//  READING FROM VISITORS TABLE IN DB
//

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds


function readVisitors($accountId, $from=false, $limit=false, $xcolor=false, $vlast=false, $date='', $rscid=false) {
	
	$visitors = new C_dbAccess_visitors();
	global $html; 
	if($from!==false) $from = ' limit '.$from.','.$limit; else $from = '';
	
	$q = '
select logins.id, logins.gender, logins.language, logins.lastname, logins.firstname, logins.email, logins.mobile, logins.profession
			, accounts.name as account, accounts.visitorAlias as alias
from logins join (

select distinct alogins.id as userloginid, accesskeys.accountId as accountId  -- we select all logins from accounts beloging to a given set of sller wallets
			from accesskeys -- seller key
	join logins on accesskeys.groupId = logins.id -- seller login
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id -- account user key
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
		and logins.id not in (-- exclude some wallets
				7874, -- Sandbox Oxteo Bernard Spoden
				-- 7896, -- Axel Boven 
				7922, -- Dietplus (Olivier Gay)
				8330, -- Keevin Burogest
				8384, -- Maxime DHoogh pages d or
				8840, -- Sandbox Offimed Medinect
				8409, -- Florence Clearebault
				8797,
				-- 8818, -- Jonathan Vandenberg CCM Online
				-- 8914, -- portefeuille Philippe Orban Octopus
				8925, -- Sandbox e-Dent
				9087, -- Mob Recycling
				9089, -- sandbox ATX DentAdmin
				9085, -- Play Off portefeuille idle
				9361, -- versusmind sandbox
				9482, -- Olivier Gay
				10444, 11808, 11809, 11707, 12079, -- h4d
				14551 -- Jean Claude Spelte - Caretel France
				) 
) as candidates on candidates.userloginid = logins.id
left join groups as accounts on accounts.id = candidates.accountId
	where logins.email <> "" 
		and logins.email NOT like "%@burogest.be" 
		and logins.email NOT like "%@caretel.be"  
		and logins.email NOT like "%@thomas-piron.eu" 
		and logins.email NOT like "%@medecinsdumonde.be" 
		and logins.email NOT like "%@esecretariat.be" 
		and logins.email NOT like "i-secretariat@%"
		and logins.email NOT like "%@laramee.be"
		and logins.email NOT like "pierrehalut@gmail.com"
		and logins.email NOT like "%@toubipbip.be"
	and logins.profession not in(	801, -- assistant
																803, -- secretary
																806, -- technician
																814 -- salesperson
															) -- see C_iPRO for professions codes list

	order by email asc '.$from.';';
	$cuein = microtime(true);
	$queried = new Q($q);
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$lcount = $queried->cnt();
	$html->pushHTML('<h2>The DB has been read in: '.$cuedelta.', it counts '.$lcount.' records</h2>');
	
	$bymobile = Array(); // contains a list of distinct email
	
	while($row = $queried->result->fetch_array()) {

		$skipit = false;
		$gender = $row['gender'];
		$fname = $row['firstname'];
		$lname = $row['lastname'];
		$mobile = $row['mobile']; if(!$mobile) $skipit = true; 
		$account = $row['account'];
		$language = $row['language'];
		$alias = $row['alias'];
		
			$fname = ucwords($fname);
			$lname = ucwords($lname);
			
		if($skipit) continue;
		if(isset($bymobile[$mobile])) continue; // this email is already included.
		$recipients[] = &$oemail; 
		$bymobile[$mobile] = 1; // have only distinct occurances of mobiles in the campaign
		
		$dS = $visitors->newVirtual();
				$dS->gender 	= $gender; 
				$dS->firstname 	= $fname; 
				$dS->lastname 	= $lname; 
				$dS->mobile 	= $mobile; 
				$dS->language 	= $language;
				$dS->id 	= 1000000-$dS->id;
		
		switch($alias) { // see (*va00*)
			case 200: $dS->alias = 'patients'; 	$dS->alias1 = 'patient'; 		break; 
			case 150: $dS->alias = 'participants';$dS->alias1 = 'participant'; 	break; 
			case 100: $dS->alias = 'clients'; 	$dS->alias1 = 'client'; 		break; 
			default: $dS->alias = 'contacts'; 	$dS->alias1 = 'contact';
		}
	}
	
	return $visitors;
}


$dS_resa = new C_dS_reservation();
$dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());


$from = @$_GET['f']; 	// generated by parser
$limit = 1000;

if(!isset($from)) { // then this page is called for the first time, display some counting and request for sending
	
	
		//////////////////////////////////////////////////////////////////////////////// 
		//
		//  D I A G N O S T I C   - on First page call
		//

		$cuein = microtime(true);

		$visitors = readVisitors($accountId, false, false, $xcolor, $vlast, $date, $rscid);
		$accountmobilescount = $visitors->countIfMobile($accountId);
			
		$total = $visitors->count();
			
		$xcludeColor = ''; if($xcolor) $xcludeColor = ' and csscolor <> '.$xcolor;


		if(!$accountmobilescount) error('We found no visitors having a mobile number for this group');
		$html->pushHTML('<p>This account has '.$accountmobilescount.' visitors in total having a mobile number</p>');

		$q = new Q('select distinct mobile from visitors where mobile <> 0 and groupId = '.$accountId.$xcludeColor.';');
		$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;'.$q->cnt().' distinct mobile numbers</p>');

		if($vlast) {
			$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;You specified a filter on the '.$vlast.' last appointing visitors</p>');
			$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;'.$total.' distinct visitors respond to this filter</p>');
		}
		else if($date) {
			$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;You specified a filter, visitors appointing after date '.$date.'</p>');
			$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;'.$total.' distinct visitors respond to this filter</p>');
		}
		else if($rscid) {
				$rname = $dbAccess_resources->keyed[$rscid]->name;
			$html->pushHTML('<h3>&nbsp;&nbsp;&nbsp;&nbsp;You specified a filter, visitors appointing with only this resource '.$rscid.' ('.$rname.')</h3>');
			$html->pushHTML('<p>&nbsp;&nbsp;&nbsp;&nbsp;'.$total.' distinct visitors respond to this filter</p>');
		}
		$cueout = microtime(true);
		$cuedelta = (($cueout-$cuein)*1000)|0;
		$html->pushHTML('<h2>Visitors extracted in '.($cuedelta/1000).' seconds</h2>');


	
	$cuein = microtime(true);
	
	$html->pushHTML('<h2>Checking SMS message length (max length set to '.$pages.' pages or '.$maxchars.' chars)</h2>');

	
	$examples = 0;
	$toolong = 0; $maxlen = 0; $bylanguage = Array(); foreach(L::$languageNames as $langcode => $langname) $bylanguage[$langcode] = 0;
	foreach($visitors->keyed as $id => $dS_visi) {
			$langcode = $dS_visi->language;
			$langname = L::$languageNames[$langcode];
			$bylanguage[$langcode]++;
			if(!isset($dS_templates[$langcode])) $langcode = language_code_french; // defaults to english is the language is not available in the templates
		$dS_visi->sms = mergeMSGtext($langcode, $dS_resa, $dS_account, $dS_templates[$langcode], $dS_visi, $dS_visi);
		$dS_visi->sms = str_replace('{alias}',$dS_visi->alias,$dS_visi->sms);
		$dS_visi->sms = str_replace('STOP','',$dS_visi->sms);
			
		$charcount = strlen($dS_visi->sms);
		if($charcount>$maxlen) $maxlen = $charcount;
		if($charcount>$maxchars) {
			// $html->pushHTML('<h3></h3><h3>Too long message! ('.$charcount.' chars):<b>'.$dS_visi->mobile.': '.$dS_visi->sms.'</b></h3><div>-</div>');
			$html->pushHTML('<p class="smaller">'.$examples.' :<b>'.$dS_visi->mobile.'</b>: '.$dS_visi->sms.' (<span style="color:red; font-size:bold;">'.$charcount.' chars</span>, '.$langname.').</p>');
			
			$toolong++;
		} else 
			if($examples++<100) 
				$html->pushHTML('<p class="smaller">'.$examples.' :<b>'.$dS_visi->mobile.'</b>: '.$dS_visi->sms.' ('.$charcount.' chars, '.$langname.').</p>');

	}
	if($toolong) {
		$html->pushHTML('<br/>&nbsp;<h3>We found '.$toolong.' too long messages! (exceeds max chars '.$maxchars.')</h3>');
	} else
		$html->pushHTML('<p>No message is over '.$maxchars.' characters</p>');
	$html->pushHTML('<p>The longest message has '.$maxlen.' characters</p>');
	
	foreach(L::$languageNames as $langcode => $langname)
		if($bylanguage[$langcode]) $html->pushHTML('<p>'.$langname.': <b>'.$bylanguage[$langcode].'</b></p>');
	
	
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<p>SMSs were generated from the DB and lengths checked in '.$cuedelta.' mseconds</p>');


	// if(!$dS_system->sendComm)
		// $html->pushHTML('<h3>This system has disabled sendComm in global settings, please change the setting and re-execute this script</h3>');
	// else {	
		$html->pushHTML('<h1>Ready to start the job, by bunches of '.$limit.' items</h1>');
	if(!$dS_system->sendComm)
		$html->pushHTML('<h3>This system has disabled sendComm in global settings</h3>');
	if($test)
		$html->pushHTML('<h3>YOU ARE IN TEST MODE, SMS WILL BE SENT TO TEST MOBILES ONLY</h3><br/>&nbsp;');
	
		$html->pushHTML('<a href="'.recursethis($accountId,1,$pages,$vlast,$test,$date,$rscid,$xcolor).'">Click to Start sending SMSs</a><br/>&nbsp;');
	// }


	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>File read and context check in '.($cuedelta/1000).' seconds</h2>');
	
	$html->dropPage(); 	
	die();
}



function recursethis($accountid,$following,$pages=1,$vlast=0,$test=1,$date='',$rscid=false, $xcolor=false) { 

		// builds an url that allows executing all this in a succession of pages with 1000 sends each
		global $_SERVER; 
		$pathfile = $_SERVER["SCRIPT_NAME"]; 
		$break = Explode('/', $pathfile);	
	$thisScript = $break[count($break) - 1]; 
		$i = 'id='.$accountid;
		$p = ''; if($pages!=1) 	$p = '&pages='.$pages;
		$d = ''; if($date!='') 	$p = '&date='.$date;
		$f = ''; if($following) $f = '&f='.$following;
		$l = ''; if($vlast) 	$l = '&last='.$vlast;
		$r = ''; if($rscid) 	$r = '&rscid='.$rscid;
		$x = ''; if($xcolor) 	$x = '&xcolor='.$xcolor;
		$t = '&test='.$test;
	$url = $thisScript.'?'.$i.$p.$l.$r.$d.$x.$t.$f;
	return $url;
}



//////////////////////////////////////////////////////////////////////////////// 
//
//        T H E   D I A G N O S T I C    M O D E   C O D E   S T O P S   H E R E 
//
//        S E N D I N G   S M S   U N D E R   T H I S   S E C T I O N 
//
//    (this section takes the 'from' parameter into consideration)


$cuein = microtime(true);

	$visitors = readVisitors($accountId, false, false, $xcolor, $vlast, $date, $rscid);			
	$total = $visitors->count(); // total must be calculated on a non limited query

	// now read again, only the bunch we are interested in
	$visitors = readVisitors($accountId, $from-1, $limit, $xcolor, $vlast, $date, $rscid);
	
	

if($test) { // replace the DB query with two known test mobile numbers (purpose is to check the message chars encoding)
	$visitors = new C_dbAccess_visitors();
	$dS = $visitors->newVirtual();
			$dS->gender = 1; $dS->firstname = 'Pascal'; $dS->lastname = 'Van de Pieperzeele'; $dS->alias = 'patients'; $dS->mobile = '32493655599'; $dS->language = 1;
	$dS = $visitors->newVirtual();
			$dS->gender = 0; $dS->firstname = 'Valerie'; $dS->lastname = 'Zorba Toritacamba'; $dS->alias = 'patients'; $dS->mobile = '32497401626'; $dS->language = 1;
			
	// $dS = $visitors->newVirtual();
			// $dS->gender = 1; $dS->firstname = 'Tammer'; $dS->lastname = 'Yildiz'; $dS->mobile = '32475669744'; $dS->language = 0;
	// $dS = $visitors->newVirtual();
			// $dS->gender = 0; $dS->firstname = 'Rashan'; $dS->lastname = 'Cakir'; $dS->mobile = '32495936738'; $dS->language = 0;
			
	$total = $visitors->count();
}


$html->pushHTML('<h2>Candidates for this bunch:, '.$limit.' items from '.$from.', out of '.$total.' total</h2>');
$html->pushHTML('<ul>');

$examples = 0;
foreach($visitors->keyed as $id => $dS_visi) {
	
			if($test) $dS_visi->id = -$dS_visi->id;
			$langcode = $dS_visi->language;
		if(!isset($dS_templates[$langcode])) $langcode = language_code_french;
	$dS_visi->sms = mergeMSGtext($langcode, $dS_resa, $dS_account, $dS_templates[$langcode], $dS_visi, $dS_visi);
	$dS_visi->sms = str_replace('{alias}',$dS_visi->alias,$dS_visi->sms);
	$dS_visi->sms = str_replace('STOP','',$dS_visi->sms);

	if($examples++<10) 
		$html->pushHTML('<li style="font-size:90%;">'.$from.':'.$dS_visi->mobile.': '.$dS_visi->sms.'</li>');
	$from++;
}
$html->pushHTML('</ul>');

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>Visitors were read from the DB in '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  S E N D I N G    S M S s
//


set_time_limit(300); // take a breath

$cuein = microtime(true);

$sendStamp = C_date::getNow();

$countOK = 0;
$skipped = 0;
$mobiles = array(); // keep track of mobiles targets already used


foreach($visitors->keyed as $vid => $dS_visi) {
	
	$m = $dS_visi->mobile;
	
	if(in_array($m,$mobiles)) { 
		$html->pushHTML('<h3>skipping number: '.$m.', a message was already sent to this number</h3>');
		$skipped++;
		continue; 
	} 
	else 
		$mobiles[] = $m;
	
	$message = $dS_visi->sms;
	$pages = Array();
	if(strpos($message,'<p1>')!==false){
		$pages[] = excise($message,'p1',false); // part 1
		if(strpos($message,'<p2>')!==false) {
			$pages[] = excise($message,'p2',false); // part 2
			if(strpos($message,'<p3>')!==false) {
				$pages[] = excise($message,'p3',false); // part 3
			}
		}
	} else {
		$pages[] = $message;
	}
	
	foreach($pages as $page) 
		$r = $smsga->push('smsmailing', $dS_account->id /*group*/, $dS_visi->id /*correlator*/, $m /*to*/, 360 /*lifetime*/, 0 /*priority*/, $page);
	

			$countOK++;
		
}

$cueout = microtime(true);
$cuedelta = ($cueout-$cuein)|0;
$html->pushHTML('<h2>Communication: '.$countOK.' SMS sent in: '.$cuedelta.' seconds. '.$skipped.' numbers in doublon were skipped.</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  L O O P I N G
//
if($from < $total) {
	$html->pushHTML('<h1>Job not complete, ready to send the next bunch, from '.$from.', '.$limit.' more items</h1>');
	$html->pushHTML('<a href="'.recursethis($accountId,$from,$pages,$vlast,$test,$date,$rscid,$xcolor).'">Click to Start sending next bunch</a>');
	$html->dropPage(); 
	die();
}

//////////////////////////////////////////////////////////////////////////////// 
//
//  
//


$html->pushHTML('<h2>Operation SUCCESSFULL and complete</h2>');
$html->pushHTML('<h3>!! do NOT re-execute this page !!</h3>');
$html->dropPage();


?>