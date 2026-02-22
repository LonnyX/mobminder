<?php

$systemLog = 'spoofy.php';
require '../utililib.php';


//////////////////////////////////////////////////////////////////////////////// 
//
// Use this utility to clean up orphan performances (*wc33*)
//
// orphan performances are present in DB but link to no existing reservation anymore.
// Before using this script, use  fix_orphan_workcodes as this one will already remove performances linked to orphan workcodes
//

$out = h1('Spoofy operation');

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; if($do) $do = !!$do;



	$m = 1024*3.6; // 3 Gig RAM
ini_set('memory_limit', $m.'M');
set_time_limit(180);



$out .= h1('Fix Orphans performances');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING ORPHAN PERFORMANCE Ids - DIAGNOSTIC PHASE
//
$cuein = microtime(true);
	
// Diagnose using Navicat :
//
// select groups.id, groups.name, reservations.id, performances.groupId, performances.workCodeId
	// from performances 
	// left join reservations on performances.groupId = reservations.id
	// join workcodes on workcodes.id = performances.workCodeId
	// join groups on groups.id = workcodes.groupId
	// where reservations.id is null;
	
// select groups.id, groups.name, archive_reservations.id, archive_performances.groupId, archive_performances.workCodeId
	// from archive_performances 
	// left join archive_reservations on archive_performances.groupId = archive_reservations.id
	// join workcodes on workcodes.id = archive_performances.workCodeId
	// join groups on groups.id = workcodes.groupId
	// where archive_reservations.id is null;
	
	
$q1 = new Q('select performances.id
	from performances 
	left join reservations on performances.groupId = reservations.id
	join workcodes on workcodes.id = performances.workCodeId
	join groups on groups.id = workcodes.groupId
	where reservations.id is null;');
	
	$out .= h2('Found '.$q1->cnt().' orphan performances in current tables');
	$pids = $q1->ids();
	
$q2 = new Q('select archive_performances.id
	from archive_performances 
	left join archive_reservations on archive_performances.groupId = archive_reservations.id
	join workcodes on workcodes.id = archive_performances.workCodeId
	join groups on groups.id = workcodes.groupId
	where archive_reservations.id is null;');
	
	$out .= h2('Found '.$q2->cnt().' orphan performances in archive tables');
	$apids = $q2->ids();

	
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>perforamnces found in: '.$cuedelta.' mseconds</h2>');




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
	
} else
	$out .= warning('Not in DO mode, the file was not written');


$out .= h2('Successful');
echo html($out);

?>