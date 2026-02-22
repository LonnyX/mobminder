<?php
//////////////////////////////////////////////////////////////////////
//
//  T E S T   A   F I R S T N A M E    T O    G U E S S    A   M A T C H    O N    T H E    G E N D E R   
//

ob_start(); // relates to (*ob1)
require '../classes/language.php';
require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');

if(!isset($_POST['name'])) die('You have no access to this script - (ip Banned)');
$name = reduceDiacriticsUTF8($_POST['name']);

$q = new Q('SELECT gender FROM stat_genders WHERE name="'.$name.'";');
$gender = $q->one('gender','x');

echo $gender.'##'.' Guessing on '.$name;
$perfReport->peak('::echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_gender');
?>