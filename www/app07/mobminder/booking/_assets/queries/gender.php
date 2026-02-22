<?php
//////////////////////////////////////////////////////////////////////
//
//  T E S T   A   F I R S T N A M E    T O    G U E S S    A   M A T C H    O N    T H E    G E N D E R   
//

ob_start(); // relates to (*ob1)
require '../classes/language.php';
require '../classes/ajax_session.php';
require '../classes/connection.php'; 

$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');

if(!isset($_POST['name'])) die('You have no access to this script - (ip Banned)');
$name = substr($_POST['name'],0,24); // avoids any SQL injection

$name = reduceDiacriticsUTF8($name, $firstwordonly = true); // test with MéDérIC or ÀÁÂÃÄÅÆ Ç ÈÉÊË ÌÍÎÏ Ð Ñ ÒÓÔÕÖ Ø ÙÚÛÜ Ý ß àáâãäåæ ç èéêë ìíîï ñ òóôõöø ùúûü ýÿ ÐŒ œ Šš Ÿ Žž

$perfReport->peak('::_POST read');

// $q = new Q('SELECT gender FROM stat_genders WHERE name="'.$name.'";'); // see (*gs01*)
// $gender = $q->one('gender','x');

	$idsb = 's';
	$questionmarkedsql = 'SELECT gender FROM stat_genders WHERE name=?; -- /queries/gender.php'; // prepare takes care of " " quoting, it should not be in the statement
$p = new Q( new C_preparedSQL($questionmarkedsql,$idsb), '/queries/gender.php');
$r = $p->execute_prepared([&$name]);
$gender = $p->one('gender','x');

$perfReport->peak('::query completed');

echo '<in>'.$gender.'</out>'.$nl.$nl.'Guessing on '.$name; // echoes like some verbose debug##[0 or 1]## Guessing on .$name;
$perfReport->peak('::echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_gender');


?>