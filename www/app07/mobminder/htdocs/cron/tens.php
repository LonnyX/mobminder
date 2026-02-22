#!/usr/bin/php5 -q
<?php

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('faketime', '2014-12-30 02:50:00'); // watch the line where sendOver() is called !!

$faketime = false;
if(crontest)	// when testing, we MUST use the defined faketime constant
	$faketime = faketime;

if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
	$faketime = $_GET['fkt'];


$systemLog = 'tens cron';
if(crontest) { // when running it locally
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
	echo '<!DOCTYPE HTML>';
	echo '<html>';
			echo '<head>';
			echo '<meta http-equiv="Content-Type"'.' content="text/html; charset=UTF-8">';
			echo '<head>';
}
else {  // when running in production
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}

$starttime = new C_date($faketime);


// Archive inactive connections
//
$now = new C_date($faketime);
C_dS_connection::timeout($now->t);

//
//
$endtime = new C_date($faketime);
	$o_dS_system = new C_dS_system();
	$o_dS_system->setTensRun($starttime->t);
	

if(crontest) { // testing locally displays HTML back to client

			echo '<br/><br/>TENS CRON TEST - '.$faketime;
		echo '</body>';
	echo '</html>';
	
} else { // running in CLI mode, outputs to /var/log/mobminder-cron-hourly.log

		$now = new C_date();
		$delta = $endtime->t - $starttime->t;
		$start = 	'EXECUTION STARTED: '.$starttime->getDateTimeString();
		$done = 	'  DONE: '.$endtime->getDateTimeString();
		$delta = 	'  DELTA: '.$delta.'sec';
		echo $start.$done.$delta.chr(10);
}
?>