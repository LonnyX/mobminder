<?php
//////////////////////////////////////////////////////////////////////
//
//  T E S T   A   L O G I N  
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

// Returns loginId if dS_login->login string instance elderdly exists, else returns zero

if(!isset($_POST['l'])) die('You have no access to this script - (ip Banned)');
$login 	= $_POST['l']; $login = substr($login,0,64); // is never supposed to be longer
$id = 'x';

$perfReport->peak('::time needed to retrieve session and posted parameters');


// dS_login->login instances are expected to be unique

			$idsb = 's';
			$questionmarkedsql = 'SELECT id FROM logins WHERE login=? limit 1; -- /queries/login.php'; // prepare takes care of " " quoting, it should not be in the statement
		$p = new Q( new C_preparedSQL($questionmarkedsql,$idsb), '/queries/login.php');
		$r = $p->execute_prepared([&$login]);
		$id = $p->ids(list_as_string);
				
usleep(rand(10000, 80000)); // bots can read from login/passes validity by measuring the response time of our DB, so we here blur the timeline, see also (*lq01*)

echo $nl.'<in>'.$id.'</out>'.$nl;
$perfReport->peak('::echo completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'q_login');
?>