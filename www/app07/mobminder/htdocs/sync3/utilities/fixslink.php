<?php
require '../../../lib_mobphp/dbio.php';
require '../lib.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    F I X   S Y N C H R O   L I N K S 
//

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;

$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$pad = '&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';

if($web) msg('SYNCHRO LINKS FIXING - '.Date('Y-m-d H:i:s', time()));



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 


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


///////////////////////////////////
// removing links having pointer to unknown visitors

	$q = new Q('select count(1) as c from synchro_visitors 
			left join visitors on visitors.id = synchro_visitors.localId 
			where skeyId = '.$skeyId.' and visitors.id IS NULL;');
msg('invalid links : '.$q->c().' (localId in synchro_links having invalid localId identifier)');

	$q = new Q('select synchro_visitors.id as id from synchro_visitors 
			left join visitors on visitors.id = synchro_visitors.localId 
			where skeyId = '.$skeyId.' and visitors.id IS NULL;');
	if($q->cnt()) {
		$d = new Q('delete from synchro_visitors where id IN ('.$q->ids().');');
		msg(chr(9).$q->hits().' HAVE BEEN DELETED');
	}
	else 
		msg(chr(9).'No invalid links need to be deleted');

	
///////////////////////////////////
// Trigger re-recording of visitors for which no link was found
	
	$l = new Q('select distinct localId as id from synchro_visitors where skeyId = '.$skeyId.';');
	$c = new Q('select count(1) as c from visitors where groupId = '.$accountId.' and id NOT IN ('.$l->ids().');');
msg('Number of visitors not represented in the synchro table: '.$c->c().' ');
	$h = new Q('update visitors set changed = NOW(), changer = "slink fixer", changerId = '.$dS_login->id.' where groupId = '.$accountId.' and id NOT IN ('.$l->ids().');');
msg(chr(9).$c->c().' visitors have been triggered for the next synchronization');



if($cnt_valid_links==$cnt_synchro_links)
	if($cnt_visi_total==$cnt_synchro_links)
		msg('DONE WITH VISITORS SYNCHRO LINK IS CLEAN');



msg('##0## execution is successful, goodbye.##');

?>