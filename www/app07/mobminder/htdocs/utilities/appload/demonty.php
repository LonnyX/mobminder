<?php
$systemLog = 'apps loader';
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  VARIANT OF MOBIKAP.PHP
//
//  IMPORTS APPOINTMENTS FROM A FILE - link patients through their mobile number
//
//  => delta with mobikap: timein and timeout contain both a date and time. 
//
//	following columns are expected:
//
//  appdate	appfrom	appto	lastname	firstname	mobile	phone	registration	note
//
//
//  Usage: http://localhost/utilities/mobikap.php?id=2944&rsc=9994   <= test mode
//  Usage: http://localhost/utilities/mobikap.php?id=3059&rsc=7422&cleanup=1&do=1   <= clean up and action mode
// 
//  http://be.mobminder.com/utilities/mobikap.php?id=3510&rsc=9531&do=1
//
//  The filename has a rigid format, like 2891_7160_apps.csv';
//  
//	Pre-requisites: 
//
//  1. import visitors using visiload.php
//
//	2. set this headers at the top of mobikap file and remove unnecessary columns
//
//  	appdate	text	appfrom	appto	lastname	firstname	mobile	phone	address	city	zipCode	note
//


//////////////////////////////////////////////////////
//
//  catch this script name 
//
$pathfile = $_SERVER["SCRIPT_NAME"];
$break = Explode('/', $pathfile);
$thisScript = $break[count($break) - 1]; 


//////////////////////////////////////////////////////
//
//  HTML Headers 
//
$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('mobminder appointments csv loader');
$html->pushHTML('<h1>mobminder appointments generator</h1>');



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
$out .= h1('mobminder visitors csv loader');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;
if(isset($_GET['rsc'])) $rescId = $_GET['rsc']; else $rescId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = true; else $do = false;


if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');
$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');

//

if(!$rescId) error('You need to give a resource id');

$o_dbAccess_resources = new C_dbAccess_resources($groupId); 
$rcount = $o_dbAccess_resources->count();
if (!$rcount) error('No resource found!');
	else 
		$html->pushHTML('<h2>Resources identified: '.$rcount.' resources</h2>');

$o_dS_resource = $o_dbAccess_resources->keyed[$rescId];
if (!$o_dS_resource) error('No resource found with rescId: bCal!'.$rescId);
	else 
		$html->pushHTML('<h2>Appointments are going to be created for: '.$o_dS_resource->name.'</h2>');
	
$filename = $groupId.'_'.$rescId.'_apps.csv';
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

if(!in_array('appfrom',$headers)) error('Missing mandatory header: appfrom', $handle); // time like 01/02/2018 09h00
if(!in_array('appto',$headers)) error('Missing mandatory header: appto', $handle);
if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);
if(!in_array('firstname',$headers)) error('Missing mandatory header: firstname', $handle);
if(!in_array('mobile',$headers)) error('Missing mandatory header: mobile', $handle);
// if(!in_array('phone',$headers)) error('Missing mandatory header: phone', $handle);
if(!in_array('note',$headers)) error('Missing mandatory header: note', $handle);


// mandatory fields
$ln_position = array_keys($headers, 'lastname'); 	$ln_position = $ln_position[0]; 
$fn_position = array_keys($headers, 'firstname'); 	$fn_position = $fn_position[0]; 
// $ad_position = array_keys($headers, 'appdate'); 	$ad_position = $ad_position[0]; 
$af_position = array_keys($headers, 'appfrom'); 	$af_position = $af_position[0]; 
$at_position = array_keys($headers, 'appto'); 		$at_position = $at_position[0]; 
$mb_position = array_keys($headers, 'mobile'); 		$mb_position = $mb_position[0]; 
// $ph_position = array_keys($headers, 'phone'); 		$ph_position = $ph_position[0]; 
$nt_position = array_keys($headers, 'note'); 		$nt_position = $nt_position[0]; 

// optional fields
if(in_array('address',$headers)) 	{ $as_position = array_keys($headers, 'address'); 	$as_position = $as_position[0]; } else $as_position = false;
if(in_array('city',$headers)) 		{ $cy_position = array_keys($headers, 'city'); 		$cy_position = $cy_position[0]; } else $cy_position = false;
if(in_array('zipCode',$headers)) 	{ $zp_position = array_keys($headers, 'zipCode'); 	$zp_position = $zp_position[0]; } else $zp_position = false;


// $o_dS_visitor = new C_dS_visitor(); $o_dS_defaults = $o_dS_visitor->getDefaults();
foreach($headers as $hcount => $header) {
	// if(!array_key_exists($header,$o_dS_defaults))
		// error('The following header has no correspondance in the target visitor table: '.$header, $handle);
}
$html->pushHTML('<h2>Headers are compliant with DB definitions: '.++$hcount.' columns</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//

if(0) {
	$cuein = microtime(true);
	$lcount = 0; $skipcount = 0; $ccount = $hcount-1; $table = array();
	function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
	while (!feof($handle)) {
		$line = substr(fgets($handle),0,-$crlf);
		if(substr($line,0,4)==';;;;') continue; // skips empty lines
		if(substr($line,0,1)=='D') continue; // skips mobikap header lines
		
		$lcount++; $comascount = substr_count($line, ';');
		if($comascount != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
			$skipcount++; notice('<b>Skipping line: </b>'.$lcount.' (columns count does not match:'.$ccount.' expected, '.$comascount.' found)'); continue; }; 
		// $utf8 = utf8_encode(strtolower($line)); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		// $utf8 = strtolower($line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		// $slashed = addslashes($utf8);
		
		$split = explode(';',$line);
		array_walk($split,'normal');
		$table[] = $split;
	}
	$cueout = microtime(true);
	$cuedelta = (($cueout-$cuein)*1000)|0;
	$lcount -= $skipcount;
	$html->pushHTML('<h2>The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines</h2>');
	fclose($handle);
	if(!$lcount) error('No valid lines can be inserted in the DB');

}

//////////////////


$cuein = microtime(true);
$lcount = 0; $skipcount = 0; $ccount = $hcount-1; $table = tolines($handle);


function normal(&$item, $key) { // this function is applied to each and single field (*#*)
	if(isset($item)) $item = trim($item); else $item=''; 
};

function remove_utf8_bom($text) {
	$bom = pack('H*','EFBBBF');
	$text = preg_replace("/^$bom/", '', $text);
	return $text;
}

function tolines($handle, $encoding = 'ISO-8859-1') { // the default file encoding by MS Excel when saving in csv format
	global $out;
	$lines = Array(); 
	
		$c = 0; $bunch = '';
		$filter_line 		= utf8_encode('/[^#_¿‡‚„ÁÀ»…ÈËÎÍÙˆÓÔÒ˚¸˘ˇ@ A-Za-z0-9+Ä&:;,!=\*\?\/\'\"\.\(\)\[\]\-]/');
		$filter_substitute 	= utf8_encode('_');
	
	if(!$encoding) {
		while(!feof($handle) && $c++<200) $bunch .= trim(fgets($handle)); rewind($handle); $line1 = fgets($handle);
		$encoding = mb_detect_encoding($bunch, mb_list_encodings(), true);
		$out.= notice('Detected file encoding is:'.$encoding);
		// Note about encoding:
		//   Windows .xls and .xlsx files are ISO-8859-1
		//   Flat files generated by Octopus are ASCII
		//   Backups generated by Mobminder are UTF-8
	} else {
		$out.= notice('You have specified file encoding:'.$encoding);
		if($encoding!='UTF-8' && $encoding!='ISO-8859-1' && $encoding!='ASCII') {
			$encoding ='UTF-8';
			error('Your file encoding specification is not supported, default:'.$encoding.' (it should be one of UTF-8, ISO-8859-1, ASCII)');
		}
	}
	
		// multi lines fields (mlf) are changing the pattern of having one record by line in the csv (*csv*)
		//
		// - Velden met embedded separator moeten quoted zijn. Bv: ìtekst met een ; erinî
		// - Velden met embedded double quotes moeten quoted zijn. Bv: îtekst met îîdoubleîî quotesî. Let op : de embedded quotes moeten verdubbeld worden.
		// - Velden met embedded line breaks moeten quoted zijn. Let op: line break = chr(10), niet backslash n.
		//
		// example:
		// 		id	;resources	;cueIn				;cueOut				;note
		// 		3	;EL			;2015-01-06 10:00	;2015-01-06 11:00	;MME POMEROLE NOTIFIEE
		// 		4	;EL			;2015-01-06 15:00	;2015-01-06 16:00	;M.CONDÈ
		// 		5	;PE			;2015-11-26 00:00	;2015-11-27 00:00	;"IRTS college coopÈratif
		// 		JE SUIS EN EXTERIEUR TTE LA JOURNEE
		// 		sur le thËme de ""les nouvelles figures de l'intervention sociale""
		// 		organisÈ par le collËge coopÈratif sur le site de IRTS Salliens."
		// 		6	;EL			;2015-01-07 08:30	;2015-01-07 12:30	;REUNION USAGERS
		// 		7	;EL			;2015-01-13 00:00	;2015-01-14 00:00	;BAYONA Abs
		//
		// item 5 is not following the regular pattern (one line per record)
		// mlf opens when an odd number of '"' is present and they close by the same rule. 
		// Inside an mlf double quotes are simply doubled : '""'
		//
		// see also (*as*) as how escapable characters are handled through DB and client js interface
		//
		$mlf_ongoing = false; $mlf_off = false; $mlf_start = false; $buffer = ''; $c = 0;
	while(!feof($handle)) {
		
		$line = trim(fgets($handle)); if($line=='') continue; // $lines will contains ONLY non blank lines
		if($c==0) if($encoding=='UTF-8') $line = remove_utf8_bom($line);
		$mlf_start = false; $mlf_off = false; 
		
		$dquotes = substr_count($line, '"'); $slimit = $dquotes%2; // that is 0 if 0, 2, 4 and 1 if 1, 3, 5 occurences.
		if($slimit) {
			if($mlf_ongoing) $mlf_off = true; // this line finishes an excel string (multiple lines)
			else $mlf_start = true;  // this line opens an excel string (multiple lines)
			$mlf_ongoing = !$mlf_ongoing;
		} 
		$mlf = $mlf_ongoing||$mlf_off;
		
		// ISO treatment
		$utf8 = $line; // default is UTF-8 assumed
		if($encoding!='UTF-8') $utf8 = iconv($encoding, 'UTF-8', $line);
		
		if($c<20) $out.= micro('-- line '.$c.' >'.$utf8);
		
		// $utf8 = preg_replace($filter_line, $filter_substitute, $utf8); // removes other not alphanum chars
		
		
		// utf8 treatment
		$utf8 = preg_replace("/\\s\\s+/",' ',$utf8); // reduces multiple spaces into single spaces
		
		if($mlf) {
			if($mlf_off) $utf8 = rtrim($utf8, '\"'); // removes the trailing double quote (or [double quote + ;] if a field follows) see (*t*)
			if($mlf_start) $buffer = $utf8; else $buffer .= '\n'.$utf8; // "\n" replaces the chr(10) in the stream
			if(!$mlf_off) continue; // continues filling buffer up to the expected mlf_off line
		} 
		else $buffer = $utf8; // non mlf case
		
		$buffer = mb_strtolower($buffer, 'UTF-8');
		
		if($c<20) $out.= notice(chr(9).'line '.$c.' >'.$buffer);
		
		$split = explode(';',$buffer);
		array_walk($split,'normal'); //  (*#*)
		$lines[] = $split; 
		unset($buffer); $buffer = ''; $c++;
	}
	rewind($handle);
	return $lines;
}

$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$lcount = count($table);
$out .= h2('The file has been read in: '.$cuedelta.', it counts '.$lcount.' valid lines');
fclose($handle);
if(!$lcount) error('No valid lines can be inserted in the DB');


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byMobile = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byPhone = Array(); // an array that references the visitors using their original id from (id in the migrated DB)
$byName = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, mobile, phone, lastname, firstname FROM visitors WHERE groupId = '.$groupId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
		
			$m = substr($row['mobile'],-9);
		if($m) $byMobile[$m] = $row['id'];
		
			$p = substr($row['phone'],-9);
		if($p) $byPhone[$p] = $row['id'];
		
			$l = $row['lastname'];
			$f = $row['firstname'];
			$name=strtolower($l.$f);
			$name=str_replace(' ','',$name);	
		$byName[$name] = $row['id'];
		
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>'.$visiTotal.' visitors have been loaded from mobminder in: '.$cuedelta.' mseconds</h2>');


if($do)
	$html->pushHTML('<h2>DO MODE IS ACTIVE !</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  ANNOUNCE JOB START TEST COMPLETION
//
$total = $lcount;
$from = @$_GET['f']; 	// generated by this parser when it calls itself
$limit = 2000;
if(!isset($from)) { // then this page is called for the first time, echo request for sending
	
		if($cleanup) {

			$q = new Q('select id from reservations where groupId  = '.$groupId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM reservations WHERE id IN ('.$resaIds.');');
			}
			
			// archive table
			$q = new Q('select id from archive_reservations where groupId  = '.$groupId.';');
			$resaIds = $q->ids();
			
			if($resaIds != '') {
				new Q('DELETE FROM archive_attendees WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_att_visitors WHERE groupId IN ('.$resaIds.');');
				new Q('DELETE FROM archive_reservations WHERE id IN ('.$resaIds.');');
			}
			
			$html->pushHTML('<h2>CLEAN UP COMPLETE !</h2>');
		}	
	
		$d = ''; if($do) $d = '&do=1';
		$a = $thisScript.'?id='.$groupId.'&rsc='.$rescId.'&f=1'.$d;
		
	$html->pushHTML('<h1>Ready to start the job, by bunches of '.$limit.' items</h1>');
	$html->pushHTML('<a href="'.$a.'">Click to Start creating the appointments</a>');
	$html->dropPage(); 
	die();
}

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//


//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP DATA SETS
//

$cuein = microtime(true);
$SQL = array();
$icount = 0; $iscan = 0; $to = ($from+$limit-1); $nomatch = 0; $newVisiCount = 0;
for($x = $from-1; $x<$to; $x++,$from++) { 
		
		if($from>=$lcount) break;
		$iscan++;
		$split = $table[$x];
		// $date = $split[$ad_position]; 
		$timein = $split[$af_position]; 
		$timeout = $split[$at_position]; 
		$lastname = $split[$ln_position];  
		$firstname = $split[$fn_position]; if(!$firstname) $firstname = 'inconnu';
		$mobile = preg_replace('/[^0-9]/', '', $split[$mb_position]); 
		// $phone = preg_replace('/[^0-9]/', '', $split[$ph_position]);
		$appNote = $split[$nt_position]; 
			
		if($mobile) $mobile = '32'.$mobile; else $mobile = false;
		$phone = false; // if($phone) $phone = $phone; else $phone = false;
		$name = strtolower($lastname.$firstname);
		$name = str_replace(' ','',$name);
		$visiId = false; $match = '';
		if($mobile) {
			$m = substr($mobile,-9);
			if(isset($byMobile[$m])) {
				$visiId = $byMobile[$m];
				$match = 'match on mobile';
			}
		} 
		// if(!$visiId) {
			// if($phone) {
				// $p = substr($phone,-9);
				// if(isset($byPhone[$p])) {
					// $visiId = $byPhone[$p];
					// $match = 'match on phone';
				// }
			// }
		// }
		if(!$visiId) {
			if(isset($byName[$name])) {
				$visiId = $byName[$name];
				$match = 'match on name';
			}
		}
		
		if(!$visiId) {
			notice('<b>NO MATCH: </b>'.($nomatch++).' (line '.$x.', no reference for the visitor:'.$lastname.', '.$firstname.')');
			$appNote = $lastname.', '.$firstname.' '.$mobile.' - '.$appNote;
			
			if(($lastname&&$mobile)||($lastname&&$phone)) {
				// we create a visitor based on the info given in the mobikap appointment
				
				$dS_visi = new C_dS_visitor(-$newVisiCount, $groupId);
				$dS_visi->lastname = $lastname;
				$dS_visi->firstname = $firstname;
				$dS_visi->mobile = $mobile?$mobile:'';
				$dS_visi->address = $as_position? $split[$as_position] : '';
				$dS_visi->zipCode = $zp_position? $split[$zp_position] : '';
				$dS_visi->city = 	$cy_position? $split[$cy_position] : '';
				// $dS_visi->phone = $phone;
				
				if($do) {
					$dS_visi->dSsave(); 
					$nvid = $dS_visi->id;
					if($mobile) $byMobile[$mobile] = $nvid;
						$name=strtolower($lastname.$firstname);
						$name = str_replace(' ','',$name);
					$byName[$name] = $nvid;
					$visiId = $nvid;
				}
				$newVisiCount++;
			}
		}
			$datein = substr($timein,0,10);
				$dd = substr($datein,0,2); // date is originally in the file like 01/02/2018 09h00
				$mm = substr($datein,3,2);
				$yyyy = substr($datein,-4);
				$datein = $yyyy.'-'.$mm.'-'.$dd; // like 2016-08-26
				
			$dateout = substr($timeout,0,10);
				$dd = substr($dateout,0,2); // date is originally in the file like 01/02/2018 09h00
				$mm = substr($dateout,3,2);
				$yyyy = substr($dateout,-4);
				$dateout = $yyyy.'-'.$mm.'-'.$dd; // like 2016-08-26

			$timein = str_replace('h',':',substr($timein,-5));
			$timeout = str_replace('h',':',substr($timeout,-5));
			
			$datyIn = $datein.' '.$timein;
			$datyOut = $dateout.' '.$timeout;
			
			$cueIn = new C_date($datyIn);
			$cueOut = new C_date($datyOut);
			
		$o_dS_reservation = new C_dS_reservation(false, $groupId);
		$o_dS_reservation->cueIn = $cueIn->getTstmp();
		$o_dS_reservation->cueOut = $cueOut->getTstmp();
		$o_dS_reservation->note = iconv('ISO-8859-1', 'UTF-8', $appNote);
			// notice('<b>Appointment: </b>'.$match.' => '.$cueIn->getDateTimeString().' to '.$cueOut->getDateTimeString().' with '.$name); // debug
		if($do) $o_dS_reservation->dSsave();
		$resaId = $o_dS_reservation->id;
		
		$o_dS_attendee = new C_dS_attendee(false, $resaId);
		$o_dS_attendee->resourceId = $o_dS_resource->id;
		$o_dS_attendee->resourceType = $o_dS_resource->resourceType;
		
		if($visiId) {
			$o_dS_att_visitor = new C_dS_att_visitor(false, $resaId);
			$o_dS_att_visitor->resourceId = $visiId;
			$o_dS_att_visitor->resourceType = class_visitor;
			if($do) $o_dS_att_visitor->dSsave();
		}
		
		if($do) $o_dS_attendee->dSsave();
		$icount++;
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
	notice('<b>New visitors must be created: </b>'.$newVisiCount.' in total.');

if($do) 
	$html->pushHTML('<h2>'.$icount.' items have been inserted (do not re-execute! or clean-up first), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');
else
	$html->pushHTML('<h2>'.$icount.' items have been prepared (not in do mode), '.$iscan.' were scanned. Scanned in: '.$cuedelta.' mseconds</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  L O O P I N G
//
if($from < $total) {
	$html->pushHTML('<h1>Job not complete, ready to send the next bunch, from '.$from.', '.$limit.' more items</h1>');
		$d = ''; if($do) $d = '&do=1';
		$a = $thisScript.'?id='.$groupId.'&rsc='.$rescId.'&f='.$from.$d;
	$html->pushHTML('<a href="'.$a.'">Click to Start sending next bunch</a>');
	$html->dropPage(); 
	die();
}

//////////////////////////////////////////////////////////////////////////////// 
//
//  END OF JOB
//

$html->pushHTML('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();


?>