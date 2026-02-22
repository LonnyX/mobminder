<?php

$web = 1;
require '../../smsgateaway/sga_lib.php';
setrendermode('..');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   
//
// 		PATCH TABLE GENERATOR to BUILD CLUSTER PATCH TABLE FROM ALL AVAILABLE (active) SATELLITES
//
//		mandatory include: sga_lib.php
//
// The patch routing is based on 3 parameters : operator, n_sup_to = 562 and n_inf_to = 625 (see patches table fields)
//
// A cluster patch uses all available satellites to serve a given queue, 
// 		with this specific feature : Numbers are routed according to their least significant 3 digits ( l3sd )
//		e.g. orange SIM 0493655599 <= significant least 3 digits is 599, operator = orange
//		each satellite serves numbers in its assigned range defined by fields n_sup_to and n_inf_to  (numbers superior to and numbers inferior to)
//		so, if satellite id 1001 (orange) has (n_sup_to = 562 and n_inf_to = 625), this satellite will handle traffic to 0493655599 hence l3sd is 599
//
//      e.g. if you have 5 available satellites (=SIMs) for operator orange and you run this patch generator, you get this result
//			satid 1001  - orange - n_sup_to = 0 and n_inf_to = 200
//			satid 1002  - orange - n_sup_to = 200 and n_inf_to = 400
//			satid 1003  - orange - n_sup_to = 400 and n_inf_to = 600
//			satid 1004  - orange - n_sup_to = 600 and n_inf_to = 800
//			satid 1005  - orange - n_sup_to = 800 and n_inf_to = 1000
//
// Local execution and testing :
// 
// http://localhost/webapp/smsgateaway/admin/make_sms_clusters.php?qid=620&do=0
//
// You must manually create the tables using Navicat before you execute this script.
// When your empty new tables are available, write their names in this file here (*sl01*)
// Choose a queueid, the patches table will be redefined for the selected queue id, including all enabled satellites (enable field in satellite table)
// Executing twice the same script will only repeat the layout writing and cause no side effect. 
//
//
// So when new SIM's enter production, you update 2 tables :
//
// 1. satellites_YYYY_MM  become satellites_YYY+_M+, the new one contains more SIM references, 
// 						along with vendor (operator), iccid, puk, number (sim), name, sat (which poolbox), color
// 2. patches_YYYY_MM  become patches_YYY+_M+
// 
// Just before going to production, you can retrieve the counters from the satellites_YYYY_MM table and copy them in the satellites_YYY+_M+
//
// Execute the following SQL
//
//
// update satellites_2021_10
// inner join satellites_2019_08 on satellites.iccid = satellites_2021_10.iccid
// set satellites_2021_10.fetchever = satellites_2019_08.fetchever,
// 		satellites_2021_10.fetchthishour = satellites_2019_08.fetchthishour,	
// 		satellites_2021_10.thishour404 = satellites_2019_08.thishour404,
// 		satellites_2021_10.fetchlasthour = satellites_2019_08.fetchlasthour,
// 		satellites_2021_10.lasthour404 = satellites_2019_08.lasthour404,
// 		satellites_2021_10.fetchthisday = satellites_2019_08.fetchthisday,
// 		satellites_2021_10.today404 = satellites_2019_08.today404,
// 		satellites_2021_10.fetchyesterday = satellites_2019_08.fetchyesterday,
// 		satellites_2021_10.fetchthisweek = satellites_2019_08.fetchthisweek,	
// 		satellites_2021_10.fetchlastweek = satellites_2019_08.fetchlastweek,		
// 		satellites_2021_10.fetchthismonth = satellites_2019_08.fetchthismonth,
// 		satellites_2021_10.fetchlastmonth = satellites_2019_08.fetchlastmonth
// 		where satellites_2021_10.id > 0;
//
// 
// In case you introduced/removed some queues, you can also retrieve the last state of counters using this query
//
// update queues_2021_10
// inner join queues on queues.id = queues_2021_10.id
// set queues_2021_10.pushedever = queues.pushedever,
		// queues_2021_10.pushthishour = queues.pushthishour,	
		// queues_2021_10.pushlasthour = queues.pushlasthour,
		// queues_2021_10.pushthisday = queues.pushthisday,
		// queues_2021_10.pushyesterday = queues.pushyesterday,
		// queues_2021_10.pushthisweek = queues.pushthisweek,
		// queues_2021_10.pushlastweek = queues.pushlastweek,
		// queues_2021_10.pushthismonth = queues.pushthismonth,
		// queues_2021_10.pushlastmonth = queues.pushlastmonth
		// where queues_2021_10.id > 0;





//////////////////////////////////////////////////////
//
//  Echo functions
//
$out = '';
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}



//////////////////////////////////////////////////////////////////////////////// 
//
//
//

h1('Spoofy operation - smsgateaway make patch table from available satellites');

if(isset($_GET['do'])) $do = $_GET['do']; if($do) $do = true; else $do = false;
if(isset($_GET['qid'])) $qid = $_GET['qid']; else $qid = 0;


	// $m = 1024*3.6; // 3 Gig RAM
// ini_set('memory_limit', $m.'M');


warning('Do mode : '.($do?'TRUE':'NOPE'));
warning('Queue id : '.($qid?$qid:'NOPE'));

if(!$qid) { warning('no queue specified'); die(); }

class C_patchmaker {
	
	public $patch_table;
	public $satls_table;
	public $queues_table;
	public $queueid;
	
	public $slots;
	public $operator;
	
	public function __construct($queueid,$patch_table,$satls_table,$queues_table) { // $vendors like Array('proximus','scarlet'); $operator like 'proximus'
		
		$this->patch_table = 'patches_2021_10'; 	// should point to the new 'in preparation' tables.
		$this->satls_table = 'satellites_2021_10'; 	//  Currently running tables are defined in sga_lib.php
		$this->queues_table = 'queues_2021_10'; 	// When the new tables are ready, transfer those names to the sga_lib.php (*sl01*)
		$this->queueid = $queueid;
		$this->slots = Array();
	}
	
	public function prepare($vendors,$operator) {
		
			$this->operator = $operator;
				$ops = Array();
				foreach($vendors as $x => $op) $ops[] = '"'.$op.'"';
			$ops = implode(',',$ops);
			$sql = 'select id from '.$this->satls_table.' where operator in ('.$ops.') and parentid = 900 and enabled = 1;';
			$q = new Q($sql);
			$parts = $q->cnt();
			
		notice('SQL:'.$sql);
		notice('Number of satellites:'.$parts);
			
			$top = 1000;
			$width = $top / $parts;
			
			$sats = Array(); $x = 1;
			while($row = $q->result->fetch_array()) $sats[$x++] = $row['id'];
			
		for($i=1, $x = $width, $k=0; $i < ($parts+1); $k=(int)$x, $x+=$width, $i++ ) {
				$cuein = (int)$k;
				$cueout = (int)$x;
			$this->slots[$sats[$i]] = Array($cuein,$cueout);
			// indent($i.' /x='.$x.' /k='.$k.' - from '.$cuein.' to '.$cueout);
		} $i--;
		$this->slots[$sats[$i]][1] = $top;
			
		indent('=>');
		$c = 1;
		foreach($this->slots as $id => $slot ) {
			indent($c++.'/ '.'queue '.$this->queueid.' sat '.$id.' - from '.$slot[0].' to '.$slot[1].' => '.$operator);
		}
		h3('Preparation finished.');
	}
	
	public function cleanqueue() {
		
		$q = new Q('delete from '.$this->patch_table.' where queueid = '.$this->queueid.';');
		$h = $q->hits();
		warning('Queue '.$this->queueid.' deleted, '.$h.' items removed');
		
	}
	
	public function write() {
		
		h2('Writing for operator '.$this->operator);
		$c = 0;
		foreach($this->slots as $sid => $slot ) {
			// indent('queue '.$this->queueid.' sat '.$sid.' - from '.$slot[0].' to '.$slot[1].' => '.$this->operator);
				$f = 'id,queueid,satelliteid,operator,n_sup_to,n_inf_to';
					$pid = $this->queueid*10000+$sid;
					$from = $slot[0];
					$to = $slot[1];
				$v = ''.$pid.','.$this->queueid.','.$sid.',"'.$this->operator.'",'.$from.','.$to.'';
				
			$sql = 'insert into '.$this->patch_table.' ( '.$f.' ) values ('.$v.')';
			$q = new Q($sql);
			$h = $q->hits();
			$c+=$h;
		}
		warning('Queue '.$this->queueid.', '.$c.' items inserted');
		
	}
}

$patch_table = 'patches_2021_10';
$satls_table = 'satellites_2021_10';
$queues_table = 'queues_2021_10';


h2('Proximus (inclusive Scarlet)');

	$vendors = Array('proximus','scarlet');
$proximus = new C_patchmaker($qid, $patch_table,$satls_table,$queues_table);
$proximus->prepare($vendors,'proximus');


h2('Orange');

	$vendors = Array('orange','mviking');
$orange = new C_patchmaker($qid, $patch_table,$satls_table,$queues_table);
$orange->prepare($vendors,'orange');


h2('Telenet (Base)');

	$vendors = Array('telenet');
$telenet = new C_patchmaker($qid, $patch_table,$satls_table,$queues_table);
$telenet->prepare($vendors,'telenet');






if($do) {
	
	$proximus->cleanqueue(); // valid for all operators
	
	
	$proximus->write();
	$orange->write();
	$telenet->write();
	
	h2('Do mode executed');
} else {
	h2('Check mode done');
}



//////////////////////////////////////////////////////////////////////////////// 
//
//
//


endrendermode();

?>