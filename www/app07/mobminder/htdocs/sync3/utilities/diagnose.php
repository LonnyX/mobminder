<?php
require '../../../lib_mobphp/dbio.php';
require '../lib.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//         D I A G N O S E     S Y N C H R O N I S A T I O N     D A T A 
//
// This script drops its result to the be.mobminder.com/synctest.php when 
// the button Synchronisation Diagnostic "diagnose" is clicked

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;

$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$pad = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';

msg('SYNCHRO LINKS D I A G N O S T I C  - '.Date('Y-m-d H:i:s', time()));



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  V I S I T O R S 
//

msg($pad.'V I S I T O R S');


	$a = new Q('select count(1) as c from visitors where groupId = '.$accountId.';');
	$b = new Q('select count(1) as c from visitors where groupId = '.$accountId.' and deleted <> 0;');
	$cnt_visi_total = $a->c();
	$cnt_merge_total = $b->c();
msg('Number of visitors : '.$cnt_visi_total.' ('.$cnt_merge_total.' from which are merged)');


	$q = new Q('select count(1) as c from synchro_visitors where skeyId = '.$skeyId.';');
	$cnt_synchro_links = $q->c();
msg('Number of synchro links : '.($q->c()?$q->c():'NONE'));


	$q = new Q('select count(1) as c from synchro_visitors join visitors on visitors.id = synchro_visitors.localId where skeyId = '.$skeyId.';');
	$cnt_valid_links = $q->c();
msg('valid links : '.$q->c().' (localId in synchro_links having a valid localId identifier)');


	$q = new Q('select count(1) as c from synchro_visitors 
			left join visitors on visitors.id = synchro_visitors.localId 
			where skeyId = '.$skeyId.' and visitors.id IS NULL;');
msg('invalid links : '.$q->c().' (localId in synchro_links having invalid visitor identifier)');


	$l = new Q('select distinct localId as id from synchro_visitors where skeyId = '.$skeyId.';');
	$c = new Q('select count(1) as c from visitors where groupId = '.$accountId.' and id NOT IN ('.$l->ids().');');
msg('Number of visitors not represented in the synchro table: '.$c->c().' ');


	$c = new Q('select count(1) as c from synchro_visitors join visitors on visitors.id = synchro_visitors.localId 
			where skeyId = '.$skeyId.' and visitors.groupId <> '.$accountId.';');
msg('Number of localIds belonging to another account: '.$c->c().'');



	$q = new Q('SELECT remoteId, COUNT(*) as c FROM synchro_visitors join visitors on visitors.id = synchro_visitors.localId 
			WHERE skeyId = '.$skeyId.' GROUP BY remoteId HAVING c > 1;');
msg('From valid links, number of remoteId in duplicate: '.$q->cnt());


	$r = new Q('SELECT localId, COUNT(*) as c FROM synchro_visitors join visitors on visitors.id = synchro_visitors.localId 
			WHERE skeyId = '.$skeyId.' GROUP BY localId HAVING c > 1;');
msg('From valid links, number of localId in duplicate: '.$r->cnt());



if($q->cnt()) {
	
	msg('The following visitors remoteIds are in duplicate: ');
	$ids = $q->mlist('remoteId', list_as_array);
	$counts = $q->mlist('c', list_as_array);
	foreach($ids as $x => $id) { // scan the list of remoteIds found in duplicate
		$p = new Q('select localId as id from synchro_visitors join visitors on visitors.id = synchro_visitors.localId where skeyId = '.$skeyId.' and remoteId = '.$id.';');
		msg(chr(9).($x+1).' : remoteId '.$id.' appears '.$counts[$x].' times with following localIds: '.$p->ids());
		
		$v = new Q('select id, lastname, firstname from visitors where id IN ('.$p->ids().');');
		$vids = $v->ids(list_as_array);
		$lnms = $v->mlist('lastname', list_as_array);
		$fnms = $v->mlist('firstname', list_as_array);
		foreach($vids as $x => $vid) msg(chr(9).$pad.$vid.': '.$lnms[$x].','.$fnms[$x]);
	}
}

if($r->cnt()) {
	
	msg('The following visitors localIds are in duplicate: ');
	$ids = $r->mlist('localId', list_as_array);
	$counts = $r->mlist('c', list_as_array);
	foreach($ids as $x => $lid) { // scan the list of localIds found in duplicate
		$p = new Q('select remoteId as id, lastname, firstname from synchro_visitors join visitors on visitors.id = synchro_visitors.localId where skeyId = '.$skeyId.' and localId = '.$lid.';');
		$lnms = $p->mlist('lastname', list_as_array);
		$fnms = $p->mlist('firstname', list_as_array);
		
		msg(chr(9).($x+1).' : localId '.$lid.' ('.$lnms[$x].' '.$fnms[$x].') appears '.$counts[$x].' times with following remoteId\'s: '.$p->ids());
		
	}
}

if($cnt_valid_links==$cnt_synchro_links)
	if($cnt_visi_total==$cnt_synchro_links)
		msg('THIS VISITORS SYNCHRO IS PERFECTLY CLEAN');


	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  A P P O I N T M E N T S  
//
	
	
msg($pad.'A P P O I N T M E N T S ');


	$a = new Q('select count(1) as c from reservations where groupId = '.$accountId.';');
	$b = new Q('select count(1) as c from reservations where groupId = '.$accountId.' and deleted <> 0;');
	$cnt_resa_total = $a->c();
	$cnt_remv_total = $b->c();
msg('Number of reservations in the current table : '.$cnt_resa_total.' ('.$cnt_remv_total.' from which are deleted)');


	$q = new Q('select count(1) as c from synchro_reservations where skeyId = '.$skeyId.';');
	$cnt_synchro_links = $q->c();
msg('Number of synchro links : '.($q->c()?$q->c():'NONE'));


	$q = new Q('select count(1) as c from synchro_reservations join reservations on reservations.id = synchro_reservations.localId where skeyId = '.$skeyId.';');
	$cnt_valid_links = $q->c();
msg('valid links : '.$q->c().' (localId in synchro_links having a valid localId identifier)');


	$l = new Q('select distinct localId as id from synchro_reservations where skeyId = '.$skeyId.';');
	$c = new Q('select count(1) as c from reservations where groupId = '.$accountId.' and id NOT IN ('.$l->ids().');');
msg('Number of reservations not represented in the synchro table: '.$c->c().' ');


	$q = new Q('SELECT synchro_reservations.remoteId, COUNT(*) as c FROM synchro_reservations join reservations on reservations.id = synchro_reservations.localId 
			WHERE skeyId = '.$skeyId.' GROUP BY synchro_reservations.remoteId HAVING c > 1;');
msg('From valid links, number of remoteId in duplicate: '.$q->cnt());


	$r = new Q('SELECT localId, COUNT(*) as c FROM synchro_reservations join reservations on reservations.id = synchro_reservations.localId 
			WHERE skeyId = '.$skeyId.' GROUP BY localId HAVING c > 1;');
msg('From valid links, number of localId in duplicate: '.$r->cnt());




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  E X C E P T I O N S 
//


msg($pad.'E X C E P T I O N S (some might not be related to the synchro)');

	$excp = new C_dbAccess_exceptions($accountId);
	if($excp->count())
		foreach($excp->keyed as $xid => $dS_excp) {
			msg(chr(9).$dS_excp->created.' / '.$dS_excp->creator.' | '.$dS_excp->class.'::'.$dS_excp->function.', '.$dS_excp->msg.'');
		}
	


msg('##0## execution is successful, goodbye.##');

?>