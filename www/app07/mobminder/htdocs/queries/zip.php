<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    Z I P   o n   D I G I T S, based on stat_zips 
//
ob_start(); // relates to (*ob1)
require '../classes/language.php';
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

// retrieve and filter input digits // see (*ls01*)

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

if(!isset($_POST['digits'])) die('You have no access to this script - (ip Banned)');
$digits = substr($_POST['digits'],0,32); // avoids any SQL injection
echo 'input digits: '.$digits.' ('.mb_strlen($digits).' letters)'.$nl;
$digits = reduceDiacriticsUTF8($digits, $firstwordonly = false, $keepspaces = true); // processes a mb_strtolower and reduces into ANSI scope any of ÀÁÂÃÄÅÆ Ç ÈÉÊË ÌÍÎÏ Ð Ñ ÒÓÔÕÖ Ø ÙÚÛÜ Ý ß àáâãäåæ ç èéêë ìíîï ñ òóôõöø ùúûü ýÿ ÐŒ œ Šš Ÿ Žž
echo 'filtered digits: '.$digits.$nl;

$addresses = Array();

$perfReport->peak('lastnames AC:: session & parameters retrieved.');


$zips = new C_dbAccess_zips($digits); // that loads all the possible matches

echo $nl.'found matches: '.$zips->count().' zips'.$nl;

////////// feedback results
//

$perfReport->peak('visitors AC::step 2 complete - data loaded.');

echo $nl;
$bank = 'ac'; // destinated to the auto complete register
	echo '<code>';
	echo $zips->stream(no_alias, no_bank, no_tracking); // first make client side be compatible with tracking for C_dS_resa_serie with tracking
	echo '</code>';
	
$perfReport->peak('visitors AC::step 3 complete - streamed.');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
// C_dS_connection::poke($perfReport, 'q_visitors');

?>
