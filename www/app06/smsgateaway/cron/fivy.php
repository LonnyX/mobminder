#!/usr/bin/php5 -q
<?php

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it

define('faketime', '2015-06-06 10:30:03'); // watch the line where sendOver() is called !!

	if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
		$faketime = $_GET['fkt'];
	else $faketime = faketime;
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if($web==1) require '../sga_lib.php';  // when running it locally
else require '/var/www/smsgateaway/sga_lib.php'; // when running in production


setrendermode('..');

$start_time = time();
if($web) $exec_time = strtotime($faketime); else $exec_time = $start_time;

h2('Execution time: '.Date('Y-m-d H:i:s',$exec_time));



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
//
//




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$end_time = time();
$delta = $end_time - $start_time;
$start = 	'EXECUTION STARTED: '.Date('Y-m-d H:i:s',$start_time);
$done = 	'  DONE: '.Date('Y-m-d H:i:s',$end_time);
$delta = 	'  DELTA: '.$delta.'sec';

if($web) { // testing locally displays HTML back to client

	warning($start.$nl.$done.$nl.$delta);
	
} else { // running in CLI mode, outputs to /var/log/smsga-crons/fivy.log

	echo $start.$done.$delta.chr(10);
}
endrendermode();
?>