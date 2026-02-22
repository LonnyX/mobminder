<?php

$systemLog = 'spoofy.php';
require '../utililib.php';


//////////////////////////////////////////////////////////////////////////////// 
//
// Use this utility to downsize huge .ics files that are produced by MS Outlook export tool.
//
// This utility reads an .ics file and cleans up members that are not strict ics standard.
// After clean up, the resulting file has a reasonnable size and is ready for Mobminder .ics import
//
// Here we 
// - remove any non .ics standard lines ( like huge html alternative descriptions that Outlook uses )
// - skip any event/appointment that ends before 2016
//

$out = h1('Spoofy operation - MS Outlook Giant ics files clean up');

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; if($do) $do = !!$do;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$o_dS_group->name.'</h2>');


	$m = 1024*3.6; // 3 Gig RAM
ini_set('memory_limit', $m.'M');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING FILE
//
// Identify and open the file

$matches = glob('./'.$accountId.'*.ics');
if(count($matches)>1) error('Multiple files were found have this id in header: '.$accountId.'*.ics, there should be a single file.');
if(count($matches)==0) error('No file was found having this id in header: '.$accountId.'*apps.ics');

$filename = $matches[0];
if(!file_exists($filename)) error('No corresponding ics file: '.$filename);
$handle = fopen($filename,'r');
if(!$handle) error('The file exists but could not be opened: '.$filename);
$line1 = fgets($handle);
if($line1=='') error('The file is empty: '.$filename, $handle);



$out .= h2('<h2>File opened: '.$filename.'</h2>');

$out .= notice('<b>First line: </b>'.$line1.'');

$crlf = 0;
if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
	else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); };
	
	

//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING THE FILE
//


	// $cuein = microtime(true);
	// $lcount = 0;

	// $lines = tolines($handle, 'UTF-8', false /*to lower*/); // from utililib.php

	// $cueout = microtime(true);
	// $cuedelta = (($cueout-$cuein)*1000)|0;

	// $lcount = count($lines);
	
	// $out .= h2('The file has been read in: '.$cuedelta.' mseconds, it counts '.$lcount.' valid lines');
	
// fclose($handle);
// if(!$lcount) error('No valid lines can be inserted in the DB');




//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//
//
// Note: Lines in ics standard are limited to 75 characters length + CRLF
//       When longer text must be written, the continuing of a line (or member) will start on the next line, with a TAB
//       New members will always start from the first line character


if(1) {
	$lines = Array(); // contain final result after filtering and cleaning up
	$velines = Array();
	$lcount = 0; $skipcount = 0; $multilines = 0;  $veventcount = 0; $veventskip = 0; 
	$member = false; $vevent = false; $skip = 0; $vskip = false;
		$cuein = microtime(true);
		
	while (!feof($handle)) {
		
		// $line = substr(fgets($handle),0,-$crlf); // we keep the crlf
		$newmember = false;
		$line = fgets($handle);
		$skip = 0;
		
		$chr9 = substr($line,0,1)=== chr(9);
		if(!$chr9) { // here starts a new member
			$x = explode(':',$line);
			$member = $x[0];
			$newmember = true;
		} else {} // the member stays what it was from the previous line(s)
		
		if($newmember) {
			
			if(strpos($line,'BEGIN:VEVENT')===0) { $vevent = true; $velines = Array(); }
			if(strpos($line,'END:VEVENT')===0) { 
				if(!$vskip) {
					foreach($velines as $l) $lines[] = $l; // pass that buffer into the final filtered array of line
					$veventcount++;
				} else $veventskip++;
				
				$vevent = false; $vskip = false; $velines = Array();
			}
			
			if($vevent){ // inside a VEVENT section
				if(strpos($line,'DTEND')===0) { // end time of event specification
					$x = explode(':',$line); $ln = count($x); $date = $x[--$ln]; $year = substr($date,0,4);
					if($year<2016) $vskip = true;
				}
			}
			
			if($vskip) continue; // do not waste time scanning lines while the full vevent should be skipped
			
			// remove any MS or MS Outlook bullshit private standard
			if(strpos($line,'X-MICROSOFT')===0) $skip = 1;
			if(strpos($line,'X-MS-OLK')===0) $skip = 1;
			if(strpos($line,'CLASS:')===0) $skip = 1;
			if(strpos($line,'PRIORITY:')===0) $skip = 1;
			if(strpos($line,'SEQUENCE:')===0) $skip = 1;
			if(strpos($line,'CATEGORIES:')===0) $skip = 1;
			if(strpos($line,'TRANSP:')===0) $skip = 1;
			
			if(strpos($line,'X-ALT-DESC;FMTTYPE=text/html:')===0) $skip = 1;
			if(strpos($line,'UID:')===0) $skip = 1;
			
			
		} else { // crossing multi lines member
		
			if($member == 'X-ALT-DESC;FMTTYPE=text/html') $skip = 1;
			if($member == 'UID') $skip = 1;
			if(!$skip) $multilines++;
			
		}
		if($skip) { $skipcount++; continue; }
		$lcount++;
		// $utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // converted to utf8
		
		if($vevent) $velines[] = $line;
			else $lines[] = $line;
	}
		$cueout = microtime(true);
		$cuedelta = deltasec($cuein,$cueout);
		
	$lcount = count($lines);
	$out .= h2('Lines: '.$lcount.' valid lines, multilines '.$multilines.', skipped '.$skipcount.' lines.');
	$out .= h2('Vevents: '.$veventcount.' valid events, skipped '.$veventskip.' events (occur before 2016).');
}

fclose($handle);
if(!$lcount) error('No valid lines found');





//////////////////////////////////////////////////////////////////////////////// 
//
//  Visualize a part of the result
//

foreach($lines as $x => $l) {
	
	if($x > 200) break;
	$chr9 = substr($l,0,1)=== chr(9);
	if(!$chr9) $out .= notice('<b>'.$x.'</b> '.$l.'');
		else $out .= notice('<b>ML -------------- </b> '.$l.'');
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  Save into a new file
//
	$c = str_replace('./', '', $filename);
	$s = explode('.',$c); $n = $s[0];
$newfilename = 'c_'.$n.'_clean.ics';
$out .= h2('Writing to file '.$newfilename);


if($do) {
	$handle = fopen('./'.$newfilename, "w") or die("Unable to open file!");
	foreach($lines as $x => $l) {
		fwrite($handle, $l);
	}
	fclose($handle);
} else
	$out .= warning('Not in DO mode, the file was not written');


$out .= h2('Successful');
echo html($out);

?>