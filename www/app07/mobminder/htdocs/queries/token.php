<?php
//////////////////////////////////////////////////////////////////////
//
//  T E S T   A   U R L  ( see if it is free ) 
//

require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

// Returns 0 if url does not exists, else returns loginId
$url = substr($_POST['l'],0,64); // see(*qt01*)
$ready = preg_replace('/[^a-z0-9]/','', $url); // see(*qt02*)

$perfReport->peak('::time needed to retrieve session and posted parameters');

// eresaUrl's are expected to be unique

	$idsb = 's';
	$questionmarkedsql = 'SELECT id FROM logins WHERE eresaUrl=? limit 1; -- /queries/token.php'; // prepare takes care of " " quoting, it should not be in the statement
$p = new Q( new C_preparedSQL($questionmarkedsql,$idsb), '/queries/token.php');
$r = $p->execute_prepared([&$ready]);
$id = $p->ids(list_as_string);


if(!$id) $id = '0';


echo $nl.'<in>'.$id.'</out>'.$nl;
$perfReport->peak('::echo completed');
$perfReport->dropReport();
?>