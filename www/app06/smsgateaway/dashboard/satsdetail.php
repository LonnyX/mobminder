<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     U S E R    A C C O U N T    M O N I T O R I N G
//
//
// 	

require '../sga_lib.php';
require '../bargraphs_lib.php';
$web=1; setrendermode('..');
$dS_login = checkcredentials();


js('window.onload = function () { 
	var t = new C_iSGA("send_sms_to_sat", {lgn:"'.$dS_login->login.'", pss:"'.$dS_login->pass.'", queueto:"satellite", relpath:"../"});
	t.init();
	console.log("Page is loaded, C_iSGA is initialized") }
');

// Catching current url parameters and login pass
//
$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '';
$http = 'http';
if(isset($subfolders[1])) {
	if($subfolders[1]=='smsgateaway') { 
		$uri_1 = '/smsgateaway'; // then you are in locahost testing.
		$http = 'http';
	}
}
$par = geturiaccessparms($dS_login); // uri formatted login/pass parameters
$ld = '"'.$http.'://'.$host.$uri_1.'/dashboard/index.php'.'?'.$par.'"'; // is the main statement to access _logdetail.php, add a logid to this and you are fully ready to call _logdetail.php	

$sid = $_REQUEST['satid'];
$dS_satellite = new C_dS_satellite($sid);

$date_in = Date('Y-m-d',time()); 		if($uri_1) $date_in = '2020-12-11'; // local mode uses fix test date
$date_out = Date('Y-m-d',time()+86400); if($uri_1) $date_out = '2020-12-12';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites
//

pad(); h2('Satellite : '.$dS_satellite->name,'satellite');

	echo '<table class="list">';
		echo '<thead>';
			echo $dS_satellite->gethtmlsatheadersid();
		echo '</thead>';

		echo '<tbody>';
			echo $dS_satellite->gethtmlsatidentification();
		echo '</tbody>';

	$js = 'onsat = function(eid) { 
						console.log(eid); 
						var href = '.$ld.'+"#satellite"; // eid is the log id, see (*al01*)
						window.location.href=href;
					}';
	dropjs($js);

	echo '</table>';	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Counters
//

pad(); h2('Counters');

	echo '<table class="list" style="text-align:center;">';
		echo '<thead>';
			echo C_dS_satellite::gethtmlcountheaders(); 
		echo '</thead>';

		echo '<tbody>';
			echo $dS_satellite->gethtmlcounters();
		echo '</tbody>';
	echo '</table>';	


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS Timely
//

pad(); h2('SMS count Timely - '.$date_in.'');
	$data = Array();
	for($c= 6; $c<23; $c++) { 
			$h_in = $date_in.' '.$c;
			$h_out = $date_in.' '.($c+1);
			$q = new Q('select count(1) as c from sms where sms.created > "'.$h_in.'" and sms.created < "'.$h_out.'" and sms.satelliteid = '.$sid.'');
			$v = $q->c();
			$h = $c.'h';
			$data[$h] = $v;
    	}
	$b = new C_bargraph($data, 'SMS Timely - '.$sid.'', 'Hours', 'Nb Sms','silver',4);
	echo $b->html_table_v();
	echo '<div>&nbsp;</div>';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS Status
//

pad(); h2('SMS Status');
	//SMS by status  (100 = pushed, 110 = satellite, 120 = operator, 200 = delivered, 404 = error, 405 = hlr De ad)
	//check only one satellite
	//$q = new Q('select sms.satelliteid, sms.home, sms.status, count(1) from sms where sms.created > CURRENT_DATE() and sms.satelliteid = '.$sid.' group by home, status;');
	$sql = 'select sms.satelliteid, sms.home, sms.status, count(1) as c from sms where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and sms.satelliteid = '.$sid.' group by home, status;';
	//echo $sql;
	$q = new Q($sql);
	$data = Array();
		while($row = $q->result->fetch_array()) {
			$stt = $row['status'];
			$cnt = $row['c'];
			if(!isset($data[$stt])) $data[$stt] = 0;
			$data[$stt] += $cnt;
		}
	$b = new C_bargraph($data, 'SMS Status - Sat '.$sid.'', 'Nb sms', 'Status', $dS_satellite->color);
	echo $b->html_table_h();
	echo '<div>&nbsp;</div>';
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Signal quality by status - Graph V
//

pad(); h2('Carrier Signal Quality');
	$q = new Q('select csq, count(1) as cnt from sms 
			where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and satelliteid = '.$sid.' 
			group by csq order by csq asc;');

	$data = Array();
	while($row = $q->result->fetch_array()) {
			$csq = $row['csq'];
			$cnt = $row['cnt'];
			$data[$csq]= $cnt;
		}
	$b = new C_bargraph($data, 'Signal quality - Sat '.$sid.'', 'csq', 'nb sms');
	echo $b->html_table_v();
	echo '<div>&nbsp;</div>';
	
	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Signal quality by status - Graph V
//

pad(); h2('Send a Test SMS');


div('send_sms_to_sat','HERE'); pad();


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Signal quality by status - Graph H
//

// pad(); h2('Graph');
// 	$q = new Q('select csq, count(1) as cnt from sms 
// 			where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and satelliteid = '.$sid.' 
// 			group by csq order by csq desc;');

// 	$data = Array();
// 	while($row = $q->result->fetch_array()) {
// 			$csq = $row['csq'];
// 			$cnt = $row['cnt'];
// 			$data[$csq]= $cnt;
// 		}
// 	$b = new C_bargraph($data, 'Signal quality by status - '.$sid.'', 'csq', 'nb sms');
// 	echo $b->html_table_h();





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	LOG
//

pad(); h2('Last logs');

	$q = new Q('select id from logs where satelliteid = '.$sid.' order by created desc limit 50;');
	$c = $q->cnt();
	if($c==0) warning('No log seems to be in the log table for this satellite'); // this queue has no satellite
	
	$logids = $q->ids(list_as_array);


	echo '<table class="list" style="width:100%;">';

		echo '<thead>';
			echo C_dS_log::gethtmllogheaders(); 
		echo '</thead>';

		echo '<tbody>';
			foreach($logids as $lid) {
				$dS_log = new C_dS_log($lid);
				echo $dS_log->gethtmllogview(); 
			}
		echo '</tbody>';

	dropjs($js);

	echo '</table>';

	
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS
//

pad(); h2('Last outband Sms');

	$sql = 'select id from sms where satelliteid = '.$sid.' order by created desc limit 50;';
	// indent($sql);
	$q = new Q($sql);
	$c = $q->cnt();
	if($c==0) warning('No sms seem to be assigned to this satellite'); // this queue has no satellite
	
	$smsids = $q->ids(list_as_array);


	echo '<table class="list" style="width:100%;">';

		echo '<thead>';
			echo C_dS_sms::gethtmlsmsheaders(); 
		echo '</thead>';

		echo '<tbody>';
			foreach($smsids as $smsid) {
				$dS_sms = new C_dS_sms($smsid);
				echo $dS_sms->gethtmlsmsview(); 
			}
		echo '</tbody>';

	dropjs($js);

	echo '</table>';
	
	
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	INBOUND SMS
//

pad(); h2('Last Inbound Sms');

	$sql = 'select id from inbound where parentid = '.$sid.' order by created desc limit 50;';
	// indent($sql);
	$q = new Q($sql);
	$c = $q->cnt();
	if($c==0) warning('No inbound sms seems to have entered this satellite'); // this queue has no satellite
	
	$smsids = $q->ids(list_as_array);


	echo '<table class="list" style="width:100%;">';

		echo '<thead>';
			echo C_dS_inbound::gethtmlinboundheaders(); 
		echo '</thead>';

		echo '<tbody>';
			foreach($smsids as $smsid) {
				$dS_inbound = new C_dS_inbound($smsid);
				echo $dS_inbound->gethtmlinboundview(); 
			}
		echo '</tbody>';

	dropjs($js);

	echo '</table>';

	


?>	