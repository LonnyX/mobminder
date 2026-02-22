<?php

$systemLog = 'dmarketing';
require '../../classes/language.php';
require '../../../lib_mobphp/chtml.php';
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/mblox.php';
require '../../../lib_mobphp/comm.php';

// require '../../classes/language.php';
// require '../../classes/chtml.php';
// require '../../classes/dbio.php';
// require '../../classes/smsgateaway.php';
// require '../../classes/mblox.php';
// require '../../classes/comm.php';

ini_set('memory_limit', '1024M');
set_time_limit(0); // No time limit for this script

$smsga32 = new C_smsgateaway('alphanight88','404'); // prod (*smsga01*)
$smsgaInt = new C_mBlox_sms_http(); // shortcode <=> must execute in Prod, does save the SMSs in db because feedbacks from mBlox are written there


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E : 
//
// Start with a test:
//
// 	be.mobminder.com/utilities/dmarketing.php?id=3441&pages=1&test=1
// 	be.mobminder.com/utilities/dmarketing.php?id=3441&last=500&pages=2&test=1
// 	be.mobminder.com/utilities/dmarketing.php?id=3441&date=2018-10-01&pages=2&test=1
//  http://localhost/utilities/smsmail/smsmailing_v2.php?id=3613&date=2020-03-16&to=2020-05-07
// 	be.mobminder.com/utilities/dmarketing.php?id=3279&rscid=9439&test=0  // CMA Dr Carouy
//  be.mobminder.com/utilities/dmarketing.php?id=3340&xcolor=7134 // excludes from mailing all visitors having this color ( CEL )
//  http://localhost/utilities/smsmail/smsmailing_v2.php?id=3129&date=2020-04-05&to=2020-05-03&xdel=0
//
// Go on with actual sending :
//
// 	be.mobminder.com/utilities/dmarketing.php?id=3441&last=500&pages=2
//
//   where:
//   - id is the account id (used to load a .txt file named by id.txt, this file contains the SMS message to be sent)
//   - pages (optional, defaults to 1) is the maximum number of pages in the SMS
//   - last (optional) indicates you want to send a message to e.g. the last 1000 clients who have appointed
//   - test (optional) sends SMSs to only a limited specified mobile numbers (checking the SMS text and char encoding)
//   - date (optional) sends SMSs to only those visitors who appointed from the given date
//
//   DB::globals::sendComm will determine is SMSs are actually sent or not
//
// pre-requisite: a file 2780.txt must be present in the utilities directory
// 
// template example:
//
// 		<french>{dear} {gender} {lname},
// 		nos tarifs vont légèrement augmenter cette année pour vous apporter toujours plus de services.
// 		Pour vous, tous nos tarifs ainsi que ceux de nos abonnements restent identiques jusqu’au 31 mars 2019.
// 		Code promo Sensation19. A très vite chez Sensation Spa!</french>
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
$html->pushLink('../utilities.css'		, 'stylesheet'	, 'text/css');
	$title = 'SMS marketing';
$html->pageTitle($title);
$html->pushHTML('<h1>'.$title.'</h1>');

$html->pushHTML('<p><b>ASCII encoding (_7bit = GSM-7)</b>:</p>
					<p style="padding-left:3em;">if length <= 160 then only 1 message is sent</p>
					<p style="padding-left:3em;">else send packets of 153 characters</p>
					<br/>');
					
$html->pushHTML('<p><b>UCS2 encoding (UTF-16)</b>:</p>
					<p style="padding-left:3em;">if length <=70 then only 1 message is sent</p>
					<p style="padding-left:3em;"> else send packets of 67 characters</p>
					<br/>');
					
$html->pushHTML('<p><b>UCS2 encoding (UTF-8) (not availbel today with SMS box)</b>:</p>
					<p style="padding-left:3em;">if length <=140 then only 1 message is sent</p>
					<p style="padding-left:3em;"> else send packets of 134 characters</p>
					<br/>');
					
// https://help.goacoustic.com/hc/en-us/articles/360043843154--How-character-encoding-affects-SMS-message-length


function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }





//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUT PARAMETERS
//

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false; // account number
if(isset($_GET['fmt'])) $fmt = $_GET['fmt']; else $fmt = false; // format force to ucs2, default is ascii7
	if($fmt) if($fmt<>'ucs2') $fmt = false;

if(isset($_GET['last'])) $vlast = $_GET['last']+0; else $vlast = false; // integer number of distinct visitors who took an appointment

if(isset($_GET['date'])) $date = $_GET['date']; else $date = ''; // all appointment from a given date
if(isset($_GET['to'])) $to = $_GET['to']; else $to = ''; // all appointment to a given date
if(isset($_GET['xdel'])) $xdel = $_GET['xdel']; else $xdel = 1; // xclude deleted items (default=YES)
	
if(isset($_GET['rscid'])) $rscid = $_GET['rscid']; else $rscid = false; // 6721,11212,16887,16081
	
if(isset($_GET['gdr'])) $gender = $_GET['gdr']; else $gender = false; // gender filter [false, 0, 1]

if(isset($_GET['test'])) $test = $_GET['test']; else $test = 'pvj'; // sends test SMS to Pascal Only. YOU NEED TO FORCE &test=0 for this script to send messages over the entire account register
if(isset($_GET['xcolor'])) $xcolor = $_GET['xcolor']; else $xcolor = false; // executes SMS sending over the entire query

if(isset($_GET['fid'])) $appcount = $_GET['fid']; else $appcount = false; // only those patients who have min fid appointments (combines with date, rscid)

if(isset($_GET['pages'])) $pages = $_GET['pages']+0; else $pages = 4; // max SMS pages defaults to 1

if(isset($_GET['inbound'])) $inbound = $_GET['inbound']+0; else $inbound = false; // inbound must be the id of templates_sms, answers to this campagain will be routed to eamil & auto-answered using this template spec. The template must be defined in production.

	if($pages+0!==$pages) error('parameter p (sms pages) must be 1, 2 or 3');
	$maxchars = $pages*244; if($pages==1) $maxchars = 244;

if(!$accountId) error('You need to give an account id');

$dS_system = new C_dS_system();
$dS_account = new C_dS_group($accountId);
$dbAccess_resources = new C_dbAccess_resources($accountId);

// Input parameters validation

	if($rscid) {
		if(strpos($rscid,',')!==false) $rscidA = explode(',',$rscid); else $rscidA = Array($rscid);
		foreach($rscidA as $rid)
			if(!isset($dbAccess_resources->keyed[$rid]))
				 error('The specified rscid ['.$rid.'] does not match a resource from the given account');
	}
	
	if($xcolor) {
		$q = new Q('select id from custom_css where groupId = '.$accountId.' and id = '.$xcolor.';');
		if(!$q->cnt())  error('You specified a color that does not belong to the account colors : '.$xcolor.'');
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
	$lines[] = $l;
	//if($l) $lines[] = $l;
}
rewind($handle);

// file encoding detection
$s=''; $c=0; while(!feof($handle)&&$c++<256) $s .= trim(fgets($handle)); rewind($handle);
$encoding = mb_detect_encoding($s, mb_list_encodings(), true);
$html->pushHTML('<p><b>File encoding is:<br/></b>'.$encoding.'</p>');
$html->pushHTML('<p><b>SMS encoding is:<br/></b>'.($fmt=='ucs2'?'ucs2':'ascii7').'</p>');


$dS_smst = false; 
if(0) { // this test will work only in production
	if($inbound) { 
		$dS_smst = new C_dS_smsTemplate($inbound);
		if(!$dS_smst->id) {
			$dS_smst = false;
			error('<p><b>Inbound SMS template id is invalid:<br/></b>');
		}
		if($dS_smst->groupId != $dS_account->id) {
			$dS_smst = false;
			error('<p><b>Inbound SMS template does not belong to account '.$dS_account->name.'<br/></b>');
		}
		if($dS_smst->name != 'CampagneSMS') {
			$dS_smst = false;
			error('<p><b>Inbound SMS template is not named with CampagneSMS ( found '.$dS_smst->name.' )<br/></b>');
		}
		$html->pushHTML('<p><b>Inbound SMS are routed to :<br/></b>'.'template '.$inbound.' ('.$dS_smst->name.')'.'</p>');
	}
}
	else
{
	$html->pushHTML('<p><b>Inbound SMS are routed to :<br/></b>'.'template '.$inbound.' '.'</p>');
}
$text = implode(chr(10),$lines);
if($encoding!='UTF-8') $text = utf8_encode($text);

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

function readVisitors($from=false, $lim=false) {
	
	global $accountId, $xcolor, $vlast, $date, $to, $xdel, $rscid, $appcount;
	$visitors = new C_dbAccess_visitors();
	if($appcount) $visitors->loadOnFidelity($accountId, $appcount, $date, $rscid, $from, $lim);
		else if($vlast) $visitors->loadOnLatestShow($accountId,$vlast, $from, $lim);
		else if($date) $visitors->loadOnFromAppDate($accountId, $date, $to, $xcolor, $rscid, $xdel, $from, $lim);
		else if($rscid) $visitors->loadOnlyWhoAppointedResource($accountId, $rscid, $date, $from, $lim);
		else $visitors->loadIfMobile($accountId, $from, $lim, $xcolor);
		// else $visitors->loadCustom($accountId, $from, $lim, $xcolor); // custom sql for Braffort, only people having followed a certain performance
		
	return $visitors;
}


$dS_resa = new C_dS_reservation();
$dS_resa->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());


$from = @$_GET['f']; 	// generated by parser
$limit = 10000; // number of sends in one bulk

if(!isset($from)) { // then this page is called for the first time, display some counting and request for sending
	
	
		//////////////////////////////////////////////////////////////////////////////// 
		//
		//  D I A G N O S T I C   - on First page call
		//

				$cuein = microtime(true);

		$visitors = readVisitors();
		$accountmobilescount = $visitors->countIfMobile($accountId);
		if(!$accountmobilescount) error('We found no visitors having a mobile number for this account');
		$html->pushHTML('<p>This account has '.$accountmobilescount.' visitors in total having a mobile number</p>');

				$cueout = microtime(true);
				$cuedelta = (($cueout-$cuein)*1000)|0;
		
		$html->pushHTML('<h2>Visitors extracted in '.($cuedelta/1000).' seconds</h2>');
		
		

	if($vlast||$date||$rscid||$xcolor||$appcount) {
		
		$html->pushHTML('<h2>Filters:</h2>');
		
			$total = $visitors->count();

			if($appcount) {
				$html->pushHTML('<h3 style="padding-left:6em;">You specified a filter on fidelity ( at least '.$appcount.' appointments in the past)</h3>');
				if($date) $html->pushHTML('<p style="padding-left:9em;">additional filter: appointments from '.$date.'</p>');
				if($rscid) $html->pushHTML('<p style="padding-left:9em;">additional filter: appointments for resource ids '.$rscid.'</p>');
				$html->pushHTML('<p style="padding-left:6em;">'.$total.' distinct visitors respond to this filter</p>');
			}
			else if($vlast) {
				$html->pushHTML('<h3 style="padding-left:6em;">You specified a filter on the '.$vlast.' last appointing visitors</h3>');
				$html->pushHTML('<p style="padding-left:6em;">'.$total.' distinct visitors respond to this filter</p>');
			}
			else if($date) {
				$html->pushHTML('<h3 style="padding-left:6em;">You specified a filter, visitors appointing after date '.$date.'</h3>');
				if($to) $html->pushHTML('<p style="padding-left:6em;">You specified a period, visitors appointing before date '.$to.'</p>');
				if($rscid) $html->pushHTML('<p style="padding-left:9em;">additional filter: appointments for resource ids '.$rscid.'</p>');
				if($xdel==0) $html->pushHTML('<p style="padding-left:6em;">You included deleted appointments, xdel = '.$xdel.'</p>');
				$html->pushHTML('<p style="padding-left:6em;">'.$total.' distinct visitors respond to this filter</p>');
			}
			else if($rscid) {
					$rname = ''; if(is_numeric($rscid)) $rname = $dbAccess_resources->keyed[$rscid]->name;
				$html->pushHTML('<h3>You specified a filter, visitors appointing with only this resource '.$rname.' ('.$rscid.')</h3>');
				$html->pushHTML('<p style="padding-left:6em;">'.$total.' distinct visitors respond to this filter</p>');
			}
			else if($xcolor) {
					$q = new Q('select name from custom_css where groupId = '.$accountId.' and id = '.$xcolor.';');
					$cname = $q->one('name','not found :(');
				$html->pushHTML('<h3>You specified a filter, NO visitors with the following color: '.$cname.' ('.$xcolor.')</h3>');
				$html->pushHTML('<p style="padding-left:6em;">'.$total.' distinct visitors respond to this filter</p>');
			}
		$html->pushHTML('<p>&nbsp;</p>');
	}
	
	$cuein = microtime(true);
	
	$html->pushHTML('<h2>Checking SMS message length (max length set to '.$pages.' pages or '.$maxchars.' chars)</h2>');

	$charsPerPage = ($fmt=='ucs2')?70:150; $pg1 = $charsPerPage;
	$pg2 = 2*$charsPerPage; $pg3 = 3*$charsPerPage; $pg4 = 4*$charsPerPage; $pg5 = 5*$charsPerPage; $pg6 = 6*$charsPerPage; $pg7 = 7*$charsPerPage;
	$examples = 0; $charaverage = 0; $targetscount = 0; $overpg2 = 0; $overpg3 = 0; $overpg4 = 0;  $overpg5 = 0; $overpg6 = 0; $overpg7 = 0; $msgpages = 0;
	$toolong = 0; $maxlen = 0; $bylanguage = Array(); foreach(L::$languageNames as $langcode => $langname) $bylanguage[$langcode] = 0;
	foreach($visitors->keyed as $id => $dS_visi) {
			$langcode = $dS_visi->language;
			$langname = L::$languageNames[$langcode];
			$bylanguage[$langcode]++;
			if(!isset($dS_templates[$langcode])) $langcode = language_code_french; // defaults to english is the language is not available in the templates
		$dS_visi->sms = mergeMSGtext($langcode, $dS_resa, $dS_account, $dS_templates[$langcode], $dS_visi, $dS_visi);
		$charcount = strlen($dS_visi->sms);
		$targetscount++; $charaverage += $charcount;
		if($charcount>$maxlen) $maxlen = $charcount;
		if($charcount>$pg2) $overpg2++;
		if($charcount>$pg3) $overpg3++;
		if($charcount>$pg4) $overpg4++;
		if($charcount>$pg5) $overpg5++;
		if($charcount>$pg6) $overpg6++;
		if($charcount>$pg7) $overpg7++;
		$msgpages += ($charcount/$charsPerPage);
		if($charcount>$maxchars) {
			// $html->pushHTML('<h3></h3><h3>Too long message! ('.$charcount.' chars):<b>'.$dS_visi->mobile.': '.$dS_visi->sms.'</b></h3><div>-</div>');
			$html->pushHTML('<p class="smaller">'.$examples.' :<b>'.$dS_visi->mobile.'</b>: '.$dS_visi->sms.' (<span style="color:red; font-size:bold;">'.$charcount.' chars</span>, '.$langname.').</p>');
			
			$toolong++;
		} else 
			if($examples++<30) 
				$html->pushHTML('<p class="smaller">'.$examples.' :<b>'.$dS_visi->mobile.'</b>: '.$dS_visi->sms.' ('.$charcount.' chars, '.$langname.').</p>');

	}
	if($toolong) {
		$html->pushHTML('<br/>&nbsp;<h3>We found '.$toolong.' too long messages! (exceeds max chars '.$maxchars.')</h3>');
	} else
		$html->pushHTML('<p>No message is over '.$maxchars.' characters</p>');
		
	$html->pushHTML('<br/><p>The longest message has '.$maxlen.' characters</p>');
	$html->pushHTML('<p>The message average length is '.($charaverage/$targetscount).' characters</p>');
	$html->pushHTML('<p>The number of messages over '.($pg7).' chars is '.$overpg7.' </p>');
	$html->pushHTML('<p>The number of messages over '.($pg6).' chars is '.$overpg6.' </p>');
	$html->pushHTML('<p>The number of messages over '.($pg5).' chars is '.$overpg5.' </p>');
	$html->pushHTML('<p>The number of messages over '.($pg4).' chars is '.$overpg4.' </p>');
	$html->pushHTML('<p>The number of messages over '.($pg3).' chars is '.$overpg3.' </p>');
	$html->pushHTML('<p>The number of messages over '.($pg2).' chars is '.$overpg2.' </p>');
	$html->pushHTML('<h3>The forecast number of pages is '.$msgpages.' (during low days, we have a margin of 95 x 70 = 6650 pages)</h3>');
	
	foreach(L::$languageNames as $langcode => $langname)
		if($bylanguage[$langcode]) $html->pushHTML('<p>'.$langname.': <b>'.$bylanguage[$langcode].'</b></p>');
	
	
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<p>SMSs were generated from the DB and lengths checked in '.$cuedelta.' mseconds</p>');


		$html->pushHTML('<h1>Ready to start the jobs, by bunches of '.$limit.' items</h1>');
	if(!$dS_system->sendComm)
		$html->pushHTML('<h3>This system has disabled sendComm in global settings</h3><br/>&nbsp;');
	if($test)
		$html->pushHTML('<h3>YOU ARE IN TEST MODE, SMS WILL BE SENT TO TEST MOBILES ONLY ('.$test.')</h3><br/>&nbsp;');
	
	$html->pushHTML('<a href="'.recursethis(1).'">Click to Start sending SMSs</a><br/>&nbsp;');



	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$html->pushHTML('<h2>File read and context check in '.($cuedelta/1000).' seconds</h2>');
	
	// $html->pushHTML(phpinfo());   // I used to check if the curl dll was loaded.
	// when not loaded, you can see a message in the error.log : Warning:  PHP Startup: Unable to load dynamic library 'C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-binaries\\php\\php5630vc11x86x201201220202\\ext\\php_curl.dll' - The specified module could not be found.
	
	$html->dropPage(); 	
	die();
}



function recursethis($following) { 

		// builds an url that allows executing all this in a succession of pages with 1000 sends each
		global $_SERVER, $html; 
		global $accountId,$fmt,$pages,$vlast,$test,$date,$to,$xdel,$rscid,$xcolor,$inbound,$appcount,$gender; 
		$pathfile = $_SERVER["SCRIPT_NAME"]; 
		$break = Explode('/', $pathfile);	
	$thisScript = $break[count($break) - 1]; 
	
	// $html->pushHTML('<p>recursethis: to= '.$to.', xdel= '.$xdel.'</p>');
	
		$pars = Array();
		$i = 'id='.$accountId; $pars[] = $i;
		
		if($pages!=4) 	$pars[] = 'pages='.$pages;
		if($date!='') 	$pars[] = 'date='.$date;
		if($to!='') 	$pars[] = 'to='.$to;
		if($xdel!==1) 	$pars[] = 'xdel='.$xdel;
		if($vlast) 		$pars[] = 'last='.$vlast;
		if($rscid) 		$pars[] = 'rscid='.$rscid;
		if($xcolor)		$pars[] = 'xcolor='.$xcolor;
		if($inbound) 	$pars[] = 'inbound='.$inbound;
		if($fmt) 		$pars[] = 'fmt='.$fmt;
		if($appcount) 	$pars[] = 'fid='.$appcount;
		if($gender!==false) $pars[] = 'gdr='.$gender;
		
		$t = '&test='.$test; $pars[] = 'test='.$test;
		
		$pars = implode('&',$pars);
		$url = $thisScript.'?'.$pars;
		
		$f = ''; if($following) $f = '&f='.$following;
		
		// $url = $thisScript.'?'.$i.$ft.$p.$l.$r.$d.$tod.$xd.$x.$t.$n.$fid.$f;
		
	$html->pushHTML('<p><b>recursethis: to= '.$url.$f.'</b></p>');
	
	return $url.$f;
}



//////////////////////////////////////////////////////////////////////////////// 
//
//        T H E   D I A G N O S T I C    M O D E   C O D E   S T O P S   H E R E 
//
//        S E N D I N G   S M S   U N D E R   T H I S   S E C T I O N 
//
//    (this section takes the 'from' parameter into consideration)


$cuein = microtime(true);

	$visitors = readVisitors();			
	$total = $visitors->count(); // total must be calculated on a non limited query
	unset($visitors);
	
	// now read again, only the bunch we are interested in
	$visitors = readVisitors($from-1, $limit);
	$thisbunchcount = $visitors->count();


$priority = 0;
$tid = -100000000;
function addtestrecepient($gender,$language,$firstname,$lastname,$mobile) {
	global $tid, $visitors;
	$dS = $visitors->newVirtual(); // produces negative virtual ids
	$dS->id = $tid;  // to test the forward and auto-reply feature, this needs to be the id of an existing visitor in the target account
	$dS->gender = $gender; $dS->firstname = $firstname; $dS->lastname = $lastname; $dS->mobile = $mobile; $dS->language = $language;
	$tid--;
}

if($test) { // replace the DB query with two known test mobile numbers (purpose is to check the message chars encoding)
	

	$priority = 1;
	$visitors = new C_dbAccess_visitors();
	
	if(strpos($test,'b')!==false) addtestrecepient(1 /*male*/ , 1 /*french*/, 'Bernard', 'Spoden', '32497462820');
	
	if(strpos($test,'p')!==false) addtestrecepient(1 /*male*/ , 1 /*french*/, 'Pascal', 'Vanhove', '32493655599');
	if(strpos($test,'v')!==false) addtestrecepient(0 /*female*/ , 1 /*french*/, 'Valerie', 'Janssens', '32497401626');
	if(strpos($test,'j')!==false) addtestrecepient(0 /*female*/ , 1 /*french*/, 'Jonathan', 'Bardo', '32472017763');
	
	if(strpos($test,'g')!==false) addtestrecepient(1 /*male*/ , 1 /*french*/, 'Giraud', 'Derlet', '32474374779');
	if(strpos($test,'k')!==false) addtestrecepient(1 /*male*/ , 1 /*french*/, 'Keevin', 'Pierre', '32483371160');
	if(strpos($test,'f')!==false) addtestrecepient(1 /*male*/ , 1 /*french*/, 'Florian', 'Bertrand', '32492458530');
				
	$total = $visitors->count();
}


$html->pushHTML('<h2>Candidates for this bunch:, '.$limit.' items from '.$from.', out of '.$total.' total</h2>');
$html->pushHTML('<ul>');

$examples = 0;
$testtrack = ''; if($test) $testtrack = 'TEST:'.chr(10).'.'.chr(10);
foreach($visitors->keyed as $id => $dS_visi) {
	
			if($test) $dS_visi->id = -$dS_visi->id; // makes negative virtual ids turn positive
			$langcode = $dS_visi->language;
		if(!isset($dS_templates[$langcode])) $langcode = language_code_french;
		
	$dS_visi->sms = $testtrack.mergeMSGtext($langcode, $dS_resa, $dS_account, $dS_templates[$langcode], $dS_visi, $dS_visi);

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


// set_time_limit(1800); // take a breath, ready for 30 minutes

$cuein = microtime(true);
// $smsProvider = new C_dataConnect_smsAPI_com();
// $smsProvider = new C_mBlox_sms_http();


$sendStamp = C_date::getNow();

$countOK = 0;
$skipped = 0;
$mobiles = array(); // keep track of mobiles targets already used
$limreached = 0;
$exitmode = 0;

$smsgroup = '1000'.$dS_account->id; // so we make a clear range differnce with SMS's from mobminder.sms_templates
if($inbound) $smsgroup = $inbound; // answers to this campgain will follow forward/autoanswer defined in the production template with id = $inbound


foreach($visitors->keyed as $vid => $dS_visi) {
	
	$m = $dS_visi->mobile;
	
	if(in_array($m,$mobiles)) { 
		$html->pushHTML('<h3>skipping number: '.$m.', a message was already sent to this number</h3>');
		$skipped++;
		continue; 
	} 
	else 
		$mobiles[] = $m;
	
	if($limreached++>$limit) { // trying to find why this page pushes twice the same sms bunch onto the smsgateaway
		$exitmode = 1;
		break;
	}
	
	$message = $dS_visi->sms;
	$parts = Array(); // for long messages that will require multi SMS
	if(strpos($message,'<p1>')!==false){
		$parts[] = excise($message,'p1',false); // part 1
		if(strpos($message,'<p2>')!==false) {
			$parts[] = excise($message,'p2',false); // part 2
			if(strpos($message,'<p3>')!==false) {
				$parts[] = excise($message,'p3',false); // part 3
			}
		}
	} else {
		$parts[] = $message;
	}
	
	$format = 'ascii7'; if($fmt) $format = 'ucs2';
	
	foreach($parts as $page) {  // visitor id in the correlator, see (*sc20*)
	
		$CC = substr($dS_visi->mobile,0,2);
		if($CC=='32') {
			$r = $smsga32->push('smsmailing', $smsgroup /*group*/, $dS_visi->id /*correlator*/, $m /*to*/, 360 /*lifetime*/, $format /*'ascii7' or 'ucs2'*/ /*encoding*/, $priority /*priority*/, $page);
			usleep(250*1000); // 250ms makes 4 calls per seconds or 300 calls per minute, the script must hold time out for 30minutes to cope with 9000 sms
		}
		else { // any other country codes
		
				$sendStamp = C_date::getNow();
			$sms = new C_dS_sms();
			$sms->groupId = $dS_account->id;
			$sms->text = $dS_visi->sms;
			$sms->toNumber = $dS_visi->mobile;
			$sms->replyNumber = $dS_account->smsSenderId;
			$sms->sendStamp = $sendStamp;
			
			$sms->dSsave(); $r = true;
			$r = $smsgaInt->sendOver($sms, $maxchars);
			$sms->dSsave();
			usleep(150*1000); // 80ms makes 6 calls per seconds
			
			if($r !== true) 
				$html->pushHTML('<h3>error while sending SMS to number: '.$sms->toNumber.', see exceptions</h3>');
				
			// select count(1) as scount, status from sms where groupId = 2779 and creator = "dmarketing" and created > "2021-04-14" group by status;
		}
		
	}
		// $html->pushHTML('<p style="font-size:80%; color:red;">'.$r.'<p>'); // uncomment if you whish to display the response from smsgateaway
	
	unset($parts);
	$countOK++;
}

$cueout = microtime(true);
$cuedelta = ($cueout-$cuein)|0;
$html->pushHTML('<h2>thisbunchcount: '.$thisbunchcount.'<br/>limit: '.$limit.'<br/>limreached: '.$limreached.'<br/>exit mode. '.$exitmode.'.</h2>');
$html->pushHTML('<h2>Communication: '.$countOK.'<br/>SMS sent in: '.$cuedelta.' seconds.<br/>'.$skipped.'numbers in doublon were skipped.</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  L O O P I N G
//
if($from < $total) {
	$html->pushHTML('<h1>Job not complete, ready to send the next bunch, from '.$from.', '.$limit.' more items</h1>');
	$html->pushHTML('<a href="'.recursethis($from).'">Click to continue sending next bunch</a>');
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