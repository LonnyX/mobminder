<?php
$systemLog = 'spoofy.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out = h1('Spoofy operation');




//////////////////////////////////////////////////////
//
//  Written to tag patients in Mobminder that have no synchro link in the synchro_visitors table
//


$q = new Q('select visitors.id, remoteId, firstname, lastname, mobile, address from visitors left join synchro_visitors on synchro_visitors.localId = visitors.id 
			where visitors.groupId = 2850 and synchro_visitors.localId is NULL;');
$vids = $q->ids(); $Rvids = $q->ids(false); 
$hits = $q->hits();
$out .= h2($hits.' found visitors with no matching remoteId');

$q = new Q('update reservations 
			join att_visitors on att_visitors.groupId = reservations.id join visitors on att_visitors.resourceId = visitors.id 
			set reservations.note = CONCAT_WS(", ", visitors.lastname, visitors.firstname) where visitors.id in ('.$vids.');');

// $q = new Q('update visitors set cssPattern = 13005 where id in ('.$vids.');'); 

// $out .= warning('The css has been applied to '.$q->hits().' visitors');



$q = new Q('select visitors.id as id from visitors join att_visitors on att_visitors.resourceId = visitors.id join reservations on att_visitors.groupId = reservations.id 
			where reservations.cueIn > UNIX_TIMESTAMP("2016-05-19 03:00:00") and visitors.id in ('.$vids.');');
$vidsF = $q->ids(); $RvidsF = $q->ids(false); 

$out .= warning('Following visitors have appointed in the future: '.$vidsF);
$out .= warning('They are: '.$q->hits());




$q = new Q('select visitors.id as id from visitors join att_visitors on att_visitors.resourceId = visitors.id join reservations on att_visitors.groupId = reservations.id 
			where reservations.cueIn < UNIX_TIMESTAMP("2016-05-19 03:00:00") and visitors.id in ('.$vids.');');
$vidsP = $q->ids(); $RvidsP = $q->ids(false); 

			
$out .= warning('Following visitors have appointed in the last four weeks: '.$vidsP);
$out .= warning('They are: '.$q->hits());


$v = Array(); $x = 0;
foreach($Rvids as $vid) {
	$skip = false;
	foreach($RvidsF as $id)  if($id == $vid) { $x++; $skip = true; }
	foreach($RvidsP as $id)  if($id == $vid) { $x++; $skip = true; }
	if($skip) continue;
	$v[] = $vid;
}
$out .= warning('Excluded from deletion: '.$x.' items from the '.count($Rvids).' in $vids');
$out .= warning('Ready to delete '.count($v).' visitors');

$vi = implode(',',$v);

$q = new Q('delete from att_visitors where resourceId in ('.$vi.');');
$q = new Q('delete from visitors where id in ('.$vi.');');




//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out .= h2('Successful');
echo html($out);

?>