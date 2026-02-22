<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    L A S T N A M E S   o n   D I G I T S, based on stat_lastnames 
//
ob_start(); // relates to (*ob1)
require '../classes/language.php';
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

// retrieve and filter input digits // see (*ls01*)

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

if(!isset($_POST['digits'])) die('You have no access to this script - (ip Banned)');
$digits = substr($_POST['digits'],0,24); // avoids any SQL injection
echo 'input digits: '.$digits.' ('.mb_strlen($digits).' chars)'.$nl;
$digits = reduceDiacriticsUTF8($digits, $firstwordonly = false, $keepspaces = false); // processes a mb_strtolower and reduces into ANSI scope any of ÀÁÂÃÄÅÆ Ç ÈÉÊË ÌÍÎÏ Ð Ñ ÒÓÔÕÖ Ø ÙÚÛÜ Ý ß àáâãäåæ ç èéêë ìíîï ñ òóôõöø ùúûü ýÿ ÐŒ œ Šš Ÿ Žž
echo 'filtered digits: '.$digits.$nl;

$lastnames = Array();

$perfReport->peak('lastnames AC:: session & parameters retrieved.');


////////// matching lastname or company name
//

$idsb = 's'; $like = '%'.$digits.'%';
	$questionmarkedsql = 'SELECT name FroM stat_lastnames WHERE reduced LIKE ? LIMIT 300; -- /queries/lastname.php'; // prepare takes care of " " quoting, it should not be in the statement
$p = new Q( new C_preparedSQL($questionmarkedsql,$idsb), '/queries/lastname.php');
$r = $p->execute_prepared([&$like]);
$names = $p->mlist('name', false);


echo 'found matches: '.$p->cnt().' names'.$nl;

////////// feedback results
//

$perfReport->peak('visitors AC::step 2 complete - data loaded.');

echo $nl;
$bank = 'ac'; // destinated to the auto complete register
	echo '<code>';
	echo '#C_lastname'.$nl;
	foreach($names as $name) echo ucwords($name).$nl;
	echo '</code>';
	
$perfReport->peak('visitors AC::step 3 complete - streamed.');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_visitors');

?>
