<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   A L I V E 
//

require '../sga_lib.php';
setrendermode('..');


$cid = @$_REQUEST['cid']; if(!isset($cid)) die('error 0700'); // sim card number ICCID
	if(!is_numeric($cid)) die('error 0701'); // ICCID must be numeric
	if($cid<'8932000000000000000' || $cid>'8932060000000000000') die('error 0702'); // invalid ICCID range
	
$csq = @$_REQUEST['csq']; if(!isset($csq)) die('error 0710'); // carrier signal quality [99,0-31]
	if(!is_numeric($csq)) die('error 0711'); // SIM must be numeric
$ptmp = @$_REQUEST['ptmp']; if(!isset($ptmp)) die('error 0720'); // processor temperature
	if(!is_numeric($ptmp)) die('error 0721'); 
$pwr = @$_REQUEST['pwr']; if(!isset($pwr)) die('error 0730'); // power level
	if(!is_numeric($pwr)) die('error 0731'); if($pwr<0||$pwr>1) die('error 0732'); // must be boolean
	
if(isset($_REQUEST['opid'])) $opid = $_REQUEST['opid']; else $opid = 0;
if(isset($_REQUEST['title'])) $title = $_REQUEST['title']; else die('error 0742');
if(isset($_REQUEST['level'])) $level = $_REQUEST['level']; else die('error 0743');
if(isset($_REQUEST['bla'])) $bla = $_REQUEST['bla']; else $bla = '';

		$sats = C_dS_satellite::$current_satellites;
	$q = new Q('select id from '.$sats.' where iccid = "'.$cid.'";'); // identify the caller
	$c = $q->cnt();
	if($c==0) die('error 0704'); // unrecognised SIM id
	if($c>1) die('error 0705');  // multiple match for this SIM
	
$satid = $q->ids();
$satellite = new C_dS_satellite($satid,0);

h2('Welcome satellite: '.$satellite->name);

h2('Mandatory parameters for this call: ');

	indent('o <b>cid</b>: your SIM ICCID device number [MMCCII123456789012C].',3);
	indent('o <b>csq</b>: your carrier signal quelity [99, 1 to 31].',3);
	indent('o <b>ptmp</b>: your processor temperature [0 to 255].',3);
	indent('o <b>pwr</b>: your power voltage state [0, 1].',3);
	indent('o <b>title</b>: title for this log.',3);
	indent('o <b>level</b>: level for this log.',3);
	pad(0);
	
h2('Optional parameters for this call: ');
	indent('o <b>opid</b>: sms operatorid, to be used when the log concerns an sms',3);
	indent('o <b>bla</b>: verbose plain text explanation for this log',3);
	pad(0);

h2('You have posted: ');

	indent('o <b>cid</b>: '.$cid,3);
	indent('o <b>csq</b>: '.$csq,3);
	if($opid) indent('o <b>opid</b>: '.$opid,3);
	indent('o <b>title</b>: '.$title,3);
	indent('o <b>level</b>: '.$level,3);
	if($bla) indent('o <b>bla</b>: '.$bla,3);
	pad(0);
	

$dS_log = new C_dS_log(0, $satellite->parentid);

$dS_log->created = C_id::tracknow();
$dS_log->smsopid = $opid;
$dS_log->satelliteid = $satellite->id;
$dS_log->csq = $csq;
$dS_log->procstmp = $ptmp;
$dS_log->rpipower = $pwr;
$dS_log->title = $title;
$dS_log->level = $level;
$dS_log->bla = $bla;

$dS_log->save();

echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
		echo $dS_log->stream1(no_tracking).$nl;
	span('&lt/data&gt');
echo '</data>';


pad(); h2('Returned objects');

explainclass($dS_log, false, '|');


endrendermode();
?>