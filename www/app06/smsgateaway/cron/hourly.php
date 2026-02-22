#!/usr/bin/php5 -q
<?php

define('faketime', '2019-09-10 08:00:00'); // watch the line where sendOver() is called !!

	if(@$_GET['fkt']) // if any GET fkt (faketime) variable was passed, use it, either in production or in test mode
		$faketime = $_GET['fkt'];
	else $faketime = faketime;
	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



if(isset($_REQUEST['web'])) require '../sga_lib.php';  // when running it locally
else require '/var/www/smsgateaway/sga_lib.php'; // when running in production


$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;
setrendermode('..');


$start_time = time();
if($web) $exec_time = strtotime($faketime); else $exec_time = $start_time;

h2('Execution time: '.Date('Y-m-d H:i:s',$exec_time));



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites / updating counters
//
pad(); h2('Satellites');


// $lasthours = Array();
	$sats = C_dS_satellite::$current_satellites;
new Q('update '.$sats.' set fetchlasthour=fetchthishour, fetchthishour=0, lasthour404=thishour404, thishour404=0;');
$q = new Q('select sum(fetchlasthour) as c from '.$sats.';');	
$totalo = $q->c();

	

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Queues / updating counters
//
pad(); h2('Queues');

	$qtable = C_dS_queue::$current_queues;
new Q('update '.$qtable.' set pushlasthour=pushthishour, pushthishour=0;');
$q = new Q('select sum(pushlasthour) as c from '.$qtable.';');	
$totalq = $q->c();


	
	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$end_time = time();
$done = 'O '.Date('Y-m-d H:i:s',$end_time).' - last hour total outbound: '.$totalo.' - last hour total queued: '.$totalq;

if($web) { // testing locally displays HTML back to client
	pad(); h2($done); pad(); 
} else { // running in CLI mode, outputs to /var/log/smsga-crons/halfs.log
	echo $done.chr(10);
}
endrendermode();
?>