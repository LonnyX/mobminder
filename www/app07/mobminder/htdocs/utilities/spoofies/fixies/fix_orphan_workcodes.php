<?php

$systemLog = 'spoofy.php';
require '../utililib.php';


//////////////////////////////////////////////////////////////////////////////// 
//
// Use this utility to clean up orphan workcodes (*wc33*)
//
// when the last expert gets deleted we end up with an orphan workcode.
// experts are removed when a resource is removed : C_dS_resource::remove()
//
// By end 2021 we noticed a bunch of workcodes having no experts attached. Those never flow down to client at /query/config.php 
//

$out = h1('Spoofy operation');

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; if($do) $do = !!$do;



	$m = 1024*3.6; // 3 Gig RAM
ini_set('memory_limit', $m.'M');
set_time_limit(180);



$out .= h1('Fix Orphans workcodes');
$out .= notice('Up to 2021/12, when the last expert gets deleted we end up with an orphan workcode');
$out .= notice('This happened on a resource deletion event. (*wc33*)');
$out .= notice('This script finds them all out and cleans up the tables ( id you use do=1 ');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING ORPHAN WORKCODEs Ids - DIAGNOSTIC PHASE
//
$cuein = microtime(true);
	
	$oneaccount = $accountId ? ' and workcodes.groupId = '.$accountId : '';
	$SQL = 'select workcodes.id as id
		from workcodes left join workexperts on workexperts.groupId = workcodes.id
		where workexperts.id is NULL '.$oneaccount.';';

	$q1 = new q($SQL);
	$wkids = $q1->ids();
	if(!$wkids) {
		$out .= h1('NO ORPHAN WORKCODE WAS FOUND');
		echo html($out);
		die();
	}
	
	$SQL = 'select workcodes.groupId as id
		from workcodes where workcodes.id in ('.$wkids.');';
	
	$q2 = new q($SQL);
	$aids = $q2->ids();
	
	
	$SQL = 'select groups.id, groups.name from groups where groups.id in ('.$aids.');';
	$q3 = new q($SQL);
	
	$q4 = new Q('select id from performances where workCodeId in ('.$wkids.')');
	$q5 = new Q('select id from archive_performances where workCodeId in ('.$wkids.')');
	
	$pids = $q4->ids(); $pcnt = $q4->cnt();
	$apids = $q5->ids(); $apcnt = $q5->cnt();
	
	while($row = $q3->result->fetch_array()) {
			$nm = $row['name'];
			$aid = $row['id'];
		$out .= h2(' - '.$aid.' '.$nm);
		
		$q6 = new Q('select id, name from workcodes where workcodes.id in ('.$wkids.') and workcodes.groupId = '.$aid.';');
		while($row = $q6->result->fetch_array()) {
				$wid = $row['id'];
				$nm = $row['name'];
				$cp = 0; if($pids) {
					$q61 = new Q('select count(1) as c from performances where id in ('.$pids.') and workCodeId = '.$wid.';'); 
					$cp = $q61->c();
					}
				$acp = 0; if($apids) {
					$q62 = new Q('select count(1) as c from archive_performances where id in ('.$apids.') and workCodeId = '.$wid.';'); 
					$acp = $q62->c();
					}
					
			$out .= microtab('['.$wid.' - '.$nm.'] -> '.$cp.' -> '.$acp);
		}
		
	}
	
	$out .= h1(' TOTAL '.$pcnt.' from performances'.' - '.$apcnt.' from archive_performances');
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>workcodes loaded in: '.$cuedelta.' mseconds</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  ACTUAL FIXING PHASE
//


if($do) {
	$out .= warning('DO mode ON, recording fixes !!');
	if($pids) { 
		$q = new Q('delete from performances where id in ('.$pids.');'); // delete references to orphan workcodes (they will not open up)
		$out .= h3(' - '.$q->hits().' removed from performances');
	}
	
	if($apids) {
		$q = new Q('delete from archive_performances where id in ('.$apids.');');
		$out .= h3(' - '.$q->hits().' removed from archive_performances');
	}
	
	$q = new Q('delete from workcodes where id in ('.$wkids.');'); // delete orphan workcodes
	$out .= h3(' - '.$q->hits().' removed from workcodes');
	
} else
	$out .= warning('Not in DO mode, the file was not written');


$out .= h2('Successful');
echo html($out);

?>