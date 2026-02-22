<?php
$systemLog = 'spoofy.php';

  function random_bytes($length = 6)
    {
        $characters = '0123456789';
        $characters_length = strlen($characters);
        $output = '';
        for ($i = 0; $i < $length; $i++)
            $output .= $characters[rand(0, $characters_length - 1)];

        return $output;
    }
	
// require '../../../lib_mobphp/dbio.php';
require '../utililib.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//
//
// 1. synctest => utilities => uncheck check mode => remove doublons
// 2. synctest => Updates => uncheck check mode (keep clever merge) => Drop file on Clients
// 3. Finish with Visitors empty Ack




//////////////////////////////////////////////////////
//
//  
//

$do = @$_GET['do']; if(isset($do)) { if($do==1) $do = true; } else $do = false;


//////////////////////////////////////////////////////
//
//  START
//

$out = h1('Spoofy operation TITECA FIX and PREPARE SYNC');
$c = 1;

//// Diagnose visitors table
//

$out .= h1('Diagnosing patient\'s data');

$out .= h2($c++.'. Total visitors count');
$q0 = 'select count(1) as c from visitors where groupId = 3914 and mergedTo = 0;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('This account has a total of: '.$q0q->c().' patients (unmerged).',2);


$out .= h2($c++.'. Total visitors without residence info');
$q0 = 'select id, residence from visitors where groupId = 3914 and residence = "" and mergedTo = 0;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' patients found having no residence info.',2);


$out .= h2($c++.'. Total visitors with residence info');
$q0 = 'select id, residence from visitors where groupId = 3914 and residence <> "" and mergedTo = 0;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' patients found having a residence information.',2);
// $out .= notice($ids);


$out .= h2($c++.'. Total visitors with duplicate residence id');
$q0 = 'select id, mergedTo, deleted, deletorId, lastname, firstname, residence, birthday, reference, mobile, created, creator from visitors where groupId = 3914 and deletorId = 0 and residence <> "" and residence in 
	(select residence from (
		select count(1) as multi, residence from visitors where groupId = 3914 and deletorId = 0 group by residence) as counting
	where multi > 1 order by multi desc)
	order by residence desc, created desc';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' patients found having duplicate residence info (should be NONE!).',2);





//// Diagnose sync_ table
//

$out .= h1('Diagnosing synchro data');

$out .= h2($c++.'. Total synchro links count');
$q0 = 'select count(1) as c from synchro_visitors where groupId = 3914;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('This account has a total of: '.$q0q->c().' synchro links in the synchro_visitors table.',2);


$out .= h2($c++.'. Detect multiple entry for local ids in the sync table');
$q0 = 'select multi, localId from (
	select count(1) as multi, localId from synchro_visitors where skeyId = 35452 group by localId) as counting
where multi > 1 order by multi desc;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' links found having duplicate mobminder id in other link(s) (should be NONE!).',2);


$out .= h2($c++.'. Detect multiple entry for remote (SBIM) ids in the sync table');
$q0 = 'select multi, remoteId from (
	select count(1) as multi, remoteId from synchro_visitors where skeyId = 35452 group by remoteId) as counting
where multi > 1 order by multi desc;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' links found having duplicate remote id in other link(s) (should be NONE!).',2);





//// Diagnose links between sync_ table and visitors table
//

$out .= h1('Diagnosing synchro table to patients table match');

$out .= h2($c++.'. Patients having NO match in the sync_ table');
$q0 = 'select lastname, firstname, visitors.id, synchro_visitors.localId
	from visitors left join synchro_visitors on visitors.id = synchro_visitors.localId 
	where visitors.groupId = 3914 and visitors.mergedTo = 0 and synchro_visitors.localId is null;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' visitors found having no synchro_link (should be never more than a few hundreds).',2);



$out .= h2($c++.'. Links having NO match in the patients table');
$q0 = 'select lastname, firstname, visitors.id, synchro_visitors.localId
	from synchro_visitors left join visitors on visitors.id = synchro_visitors.localId 
	where synchro_visitors.groupId = 3914 and visitors.mergedTo = 0 and visitors.id is null;';
$q0q = new Q($q0);
$out .= notice($q0);
$out .= red('result: '.$q0q->cnt().' links found having no patient match (should always be ZERO).',2);





$out .= h1('Maintain and repair the sync_ table');
// repair

$out .= h2($c++.'. Rewriting sync_ table');
$ql = 'select id, residence from visitors where groupId = 3914 and residence <> "" and mergedTo = 0;';
$q = new Q($ql);
$sync_key_id = 35452;
$rwcount = 0;

if($do) {
	$qd = new Q('delete from synchro_visitors where groupId = 3914;');
	$out .= warning('<b>Clean up synchro_visitors, a total of '.$qd->hits().' have been removed</b>',0);
}
	
	
while($row = $q->result->fetch_array()) {
	
	$vid = $row['id'];
	$residence = $row['residence'];
	
	$dS_s = new C_dS_synchro_visitor(0, 3914);
	$dS_s->skeyId = $sync_key_id;
	$dS_s->localId = $vid;
	$dS_s->remoteId = $residence;
	// $out.= microtab($dS_s->skeyId.': '.$dS_s->localId.' = '.$dS_s->remoteId);
	$rwcount++;
	
	if($do) {
		$dS_s->save();
	}
}

$c = 0;
if(!$do) { 
	$out .= red('<b>NOT IN DO MODE, to rewrite the sync link, pass do=1</b>',3);
	$out .= warning('The sync_key id we will use is '.$sync_key_id.', please check it before going to do mode',3);
	$out .= warning('A total of '.$rwcount.' sync links are ready to be written',3);
}
	else { 
	$out .= red('<b>WAS  E X E C U T E D  IN DO MODE</b>');
	$out .= warning('A total of '.$rwcount.' sync links have been written',3);
	}
	
	



//////////////////////////////////////////////////////////////////////////////// 
//
// STOP
//

echo html($out);


?>