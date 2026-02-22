<?php



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//     S M S     T R A F F I C     M O N I T O R I N G     D A S H B O A R D
//
//
//	http://192.168.0.16/smsgateaway/dashboard/index.php?l=mob&p=spoden 	
//	http://smsgateaway.mobminder.com/dashboard/index.php?l=mob&p=spoden
//	http://smsgateaway.mobminder.com/dashboard/index.php?l=alphanight88&p=404

require '../sga_lib.php';
require '../bargraphs_lib.php';

$web=1; setrendermode('..');
$dS_login = checkcredentials();
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
$ld = '"'.$http.'://'.$host.$uri_1.'/dashboard/satsdetail.php'.'?'.$par.'"'; // is the main statement to access _logdetail.php, add a logid to this and you are fully ready to call _logdetail.php
$qu = '"'.$http.'://'.$host.$uri_1.'/dashboard/queue.php'.'?'.$par.'"'; 
$hlr = '"'.$http.'://'.$host.$uri_1.'/dashboard/hlrlookups.php'.'?'.$par.'"';

$date_in = Date('Y-m-d',time()); 		if($uri_1) $date_in = '2024-06-10'; // local mode uses fix test date
$date_out = Date('Y-m-d',time()+86400); if($uri_1) $date_out = '2024-06-11';



	$qtable = C_dS_queue::$current_queues;

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS Timely
//

pad(); h2('SMS count Timely - '.$date_in.'');
	$data = Array();
	for($c= 6; $c<23; $c++) { 
			$h_in = $date_in.' '.$c;
			$h_out = $date_in.' '.($c+1);
			$q = new Q('select count(1) as c from sms 
				join '.$qtable.' on '.$qtable.'.id = sms.parentid
				where sms.created > "'.$h_in.'" and sms.created < "'.$h_out.'"
					and '.$qtable.'.parentid = '.$dS_login->id.';');
			$v = $q->c();
			$h = $c.'h';
			$data[$h] = $v;
    	}
	$b = new C_bargraph($data, 'SMS Timely', 'csq', 'nb sms','silver', 0.5);
	echo $b->html_table_v();





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Quality delivery by status
//

pad(); 
h2('Quality delivery by operator');

	//SMS by status  (100 = pushed, 110 = satellite, 120 = operator, 200 = delivered, 404 = error, 405 = hlr Dead)
	//$q = new Q('select sms.home, sms.status, count(1) from sms where sms.created > CURRENT_DATE() and sms.home = "orange" group by home, status;');
	
	$statuslabel = 'concat(CASE sms.status WHEN 100 THEN "created" WHEN 800 THEN "expired" WHEN 110 THEN "satellite" WHEN 120 THEN "operator" WHEN 190 THEN "pending" WHEN 200 THEN "delivered" WHEN 404  THEN "error" WHEN 405 THEN "dead" WHEN 999 THEN "discarded" ELSE "unknown" END," (",sms.status,")")' ;

	$q = new Q('select sms.home, '.$statuslabel.' as status, count(1) from sms 
		join '.$qtable.' on '.$qtable.'.id = sms.parentid
		where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and sms.home = "orange" 
			and '.$qtable.'.parentid = '.$dS_login->id.' group by home, status;');

	$data = Array();
		while($row = $q->result->fetch_array()) {
			$stt = $row['status'];
			$cnt = $row['count(1)'];
			$data[$stt]= $cnt;
		}
	$b = new C_bargraph($data, 'delivery quality by status - Orange', 'Nb sms', 'Status', 'orange', 3);
	echo '<div>&nbsp;</div>';
	echo $b->html_table_h();

	//SMS by status  (100 = pushed, 110 = satellite, 120 = operator, 200 = delivered, 404 = error, 405 = hlr Dead)
	//$q = new Q('select sms.home, sms.status, count(1) from sms where sms.created > CURRENT_DATE() and sms.home = "proximus" group by home, status;');

	$q = new Q('select sms.home, '.$statuslabel.' as status, count(1) from sms 
		join '.$qtable.' on '.$qtable.'.id = sms.parentid
		where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and sms.home = "proximus" 
			and '.$qtable.'.parentid = '.$dS_login->id.' group by home, status;');
			
	$data = Array();
		while($row = $q->result->fetch_array()) {
			$stt = $row['status'];
			$cnt = $row['count(1)'];
			$data[$stt]= $cnt;
		}
	$b = new C_bargraph($data, 'delivery quality by status - Proximus', 'Nb sms', 'Status', 'mediumpurple', 3);
	echo '<div>&nbsp;</div>';
	echo $b->html_table_h();

	//SMS by status  (100 = pushed, 110 = satellite, 120 = operator, 200 = delivered, 404 = error, 405 = hlr Dead)
	//$q = new Q('select sms.home, sms.status, count(1) from sms where sms.created > CURRENT_DATE() and sms.home = "telenet" group by home, status;');
	
	$q = new Q('select sms.home, '.$statuslabel.' as status, count(1) from sms 
		join '.$qtable.' on '.$qtable.'.id = sms.parentid
		where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and sms.home = "telenet" 
			and '.$qtable.'.parentid = '.$dS_login->id.' group by home, status;');
			
	$data = Array();
		while($row = $q->result->fetch_array()) {
			$stt = $row['status'];
			$cnt = $row['count(1)'];
			$data[$stt]= $cnt;
		}
	$b = new C_bargraph($data, 'delivery quality by status - Telenet', 'Nb sms', 'Status', 'turquoise', 3);
	echo '<div>&nbsp;</div>';
	echo $b->html_table_h();





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Quality delivery by status
//

pad(); h2('Quality delivery by status');

	$q = new Q('select sms.status, count(1) as numberof, count(1)*0.05 as pricely from sms
			join '.$qtable.' on '.$qtable.'.id = sms.parentid
			where sms.created > "'.$date_in.'" and sms.created < "'.$date_out.'" and '.$qtable.'.parentid = '.$dS_login->id.' 
			group by sms.status asc;');

echo '<table class="list">';
	echo '<thead>';
		echo '<tr>'.'<th>'.'Status'.'</th>'.'<th>'.'Numberof'.'</th>'.'<th>'.'Pricely'.'</th>'.'</tr>';
	echo '</thead>';

	echo '<tbody>';
		while($row = $q->result->fetch_array()) {
			$status = $row['status'];
			$numberof = $row['numberof'];
			$pricely = $row['pricely'];
		echo '<tr>'.'<td>'.$status.'</td>'.'<td>'.$numberof.'</td>'.'<td>'.$pricely.'</td>'.'</tr>';
		}
	echo '</tbody>';
echo '</table>';




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites
//

pad(); 
//h2('Sims overview','satellite');

	$sats = C_dS_satellite::$current_satellites;

	$q = new Q('select id from '.$sats.' where parentid = '.$dS_login->id.' and enabled <> 0 order by operator desc;');
	$c = $q->cnt();
	if($c==0) {
		pad(); h2('Sims overview','satellite');
		warning('No satellite is assigned to your traffic'); // this queue has no satellite
	}
	else{
		pad(); h2('Sims overview ('.$q->cnt().')','satellite');
	}
	
	$sids = $q->ids(list_as_array);
	$satellites = Array();

    	



	//$this->lastcsq<=C_dS_satellite::$threshold_mincsq

echo '<table class="list" style="text-align:center;">';
	echo '<thead>';
		echo C_dS_satellite::gethtmlheader(); 
	echo '</thead>';

	echo '<tbody>';
		$time = date("Y-m-d H:i:s", strtotime('-90 second'));
		foreach($sids as $sid) {
			$dS_sat = new C_dS_satellite($sid);
			$satellites[$sid] = $dS_sat;
			if($dS_sat->lastseen<$time || $dS_sat->status!=30 || $dS_sat->lastcsq<=C_dS_satellite::$threshold_mincsq || $dS_sat->lastcsq>=C_dS_satellite::$threshold_maxcsq 
				|| ($dS_sat->fetchthishour<(3*$dS_sat->thishour404)) || ($dS_sat->fetchlasthour<(3*$dS_sat->lasthour404)) || ($dS_sat->fetchthisday<(3*$dS_sat->today404))
				|| $dS_sat->fetchthisday>=C_dS_satellite::$threshold_smsperday
				|| $dS_sat->fetchyesterday>=C_dS_satellite::$threshold_smsperday
			) {
				echo $dS_sat->gethtmlrow(); 
			}
			else{
				//no display
			}
		}
		foreach($satellites as $dS_sat) {
			/*if($dS_sat->lastseen>=$time && $dS_sat->status==30 && $dS_sat->lastcsq>C_dS_satellite::$threshold_mincsq && $dS_sat->lastcsq<C_dS_satellite::$threshold_maxcsq) {
				echo $dS_sat->gethtmlrow(); 
			}*/

			if($dS_sat->lastseen<$time || $dS_sat->status!=30 || $dS_sat->lastcsq<=C_dS_satellite::$threshold_mincsq || $dS_sat->lastcsq>=C_dS_satellite::$threshold_maxcsq 
				|| ($dS_sat->fetchthishour<(3*$dS_sat->thishour404)) || ($dS_sat->fetchlasthour<(3*$dS_sat->lasthour404)) || ($dS_sat->fetchthisday<(3*$dS_sat->today404))
				|| $dS_sat->fetchthisday>=C_dS_satellite::$threshold_smsperday
				|| $dS_sat->fetchyesterday>=C_dS_satellite::$threshold_smsperday
			) {
				//no display
			}
			else{
				echo $dS_sat->gethtmlrow(); 
			}

		}

	echo '</tbody>';
echo '</table>';


$js = 'onsat = function(eid) { 
					console.log(eid); 
					var href = '.$ld.'+"&satid="+eid; // eid is the log id, see (*al01*)
					window.location.href=href;
				}';
dropjs($js);





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Hlr lookups
//

pad(); h2('Hlr lookups','hlr');
 
 
 
 
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Result 1
//
	$q = new Q('select COUNT(1) as c from hlr_lookups ;');
	$count = $q->c();

echo '<table class="list">';
	echo '<thead>';
		echo '<th>'.'Count'.'</th>';
	echo '</thead>';

	echo '<tbody>';
		echo '<tr onclick="onhlr(this.id)">'.'<td>'.$count.'</td>'.'</tr>';
	echo '</tbody>';
echo '</table>';




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Result 3
//
	$q = new Q('select count(1) as count, home from hlr_lookups where error_code = 0 GROUP BY home order by count desc;');	

echo '<table class="list">';
	echo '<thead>';
		echo '<tr>'.'<th>'.'Home'.'</th>'.'<th>'.'Count'.'</th>'.'</tr>';
	echo '</thead>';

	echo '<tbody>';
		while($row = $q->result->fetch_array()) {
			$home = $row['home'];
			$count = $row['count'];
		echo '<tr onclick="onhlr(this.id)">'.'<td>'.$home.'</td>'.'<td>'.$count.'</td>'.'</tr>';
		}
	echo '</tbody>';
echo '</table>';

$js = 'onhlr = function(eid) { 
						console.log(eid); 
						var href = '.$hlr.'+"&satid="+eid; // eid is the log id, see (*al01*)
						window.location.href=href;
					}';
dropjs($js);





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Queues
//

pad(); h2('Queues','queues');

	
	$q = new Q('select id from '.$qtable.' where parentid = '.$dS_login->id.' and id < 1000 and pushedever <> 0 order by id;');
	$c = $q->cnt();
	if($c==0) warning('No queues is assigned to your traffic'); // this queue has no satellite
	
	$queids = $q->ids(list_as_array);
	$queues = Array();

echo '<table class="list">';
	echo '<thead>';
		echo C_dS_queue::gethtmlheader(); 
	echo '</thead>';

	echo '<tbody>';
		foreach($queids as $sid) {
			$dS_queue = new C_dS_queue($sid);
			$queues[$sid] = $dS_queue; 
				echo $dS_queue->gethtmlrow(); 

		}
	echo '</tbody>';
echo '</table>';

$js = 'onqueue = function(eid) { 
					console.log(eid); 
					var href = '.$qu.'+"&qid="+eid; // eid is the log id, see (*al01*)
					window.location.href=href;
				}';
dropjs($js);


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	RPIs
//

pad(); 
$q = new Q('select id from devices order by name;');
$sids = $q->ids(list_as_array);
h2('RPI overview ('.count($sids).')','rpi');
echo '<table class="list" style="text-align:center;">';
	echo '<thead>';
		echo C_dS_device::gethtmlheader(); 
	echo '</thead>';

	echo '<tbody>';
		$time = date("Y-m-d H:i:s", strtotime('-90 second'));
		$dS_devices = [];
		foreach($sids as $sid) 
		{
			$dS_device = new C_dS_device($sid);
			$dS_devices[] = $dS_device;
			echo $dS_device->gethtmlrow(); 
		}

	echo '</tbody>';
echo '</table>';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Slots by RPI
//

foreach($dS_devices as $dS_device) 
{
	pad(); 

	$time = date("Y-m-d H:i:s", strtotime('-60 second'));
	if($dS_device->lastseen<$time)
		h2('<p style="color: red;">Slots by RPI '.$dS_device->name.' ('.$dS_device->location.')</p>','slotbyrpi_'.$dS_device->name);
	else
		h2('Slots by RPI '.$dS_device->name.' ('.$dS_device->location.')','slotbyrpi_'.$dS_device->name);
	
		

	

	echo '<table class="list" style="text-align:center;">';
	echo '<thead>';
	echo C_dS_slot::gethtmlheader(); 
	echo '</thead>';
	echo '<tbody>';
	$slotids = C_dS_slot::loadbyParentId($dS_device->id);
	foreach($slotids as $slotid) 
	{
		$slot = new C_dS_slot($slotid);
		$slot->lastseen = $dS_device->lastseen; //add virtual property
		echo $slot->gethtmlrow(); 
	}
	echo '</tbody>';
	echo '</table>';
}



pad();
endrendermode();
?>