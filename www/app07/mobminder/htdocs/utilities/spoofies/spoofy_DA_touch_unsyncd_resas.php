<?php
$systemLog = 'spoofy.php';
require '../../../lib_mobphp/dbio.php';

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
$out = h1('Spoofy operation - DentAdmin rescue');



if(isset($_GET['do'])) $do = true; else $do = false;



//////////////////////////////////////////////////////
//
//  Written to touch reservations in Mobminder that have no synchro link in the synchro_reservations table
//

	$accountId = 4210;
	$q = new Q('select name from groups where id  = '.$accountId.';');
	$acc_name = $q->one('name','!! not found !!');

$out .= h2('Found account: '.$acc_name);

	// diagnostic

$q = new Q('select reservations.id as id from reservations
			left join synchro_reservations on synchro_reservations.localId = reservations.id
			where reservations.groupId = '.$accountId.' and reservations.created > "2021-03-31" and synchro_reservations.remoteId is NULL
			order by created desc;');
			
$rids = $q->ids(); $Rrids = $q->ids(false); 
$hits = $q->hits();
$out .= h2($hits.' found reservations with no matching remoteId');
if($hits==0) {
	$out .= h2('No intervention required.');
	echo html($out);
	die();
}

if($do) {

	$q = new Q('update reservations set changed = NOW(), changer = "mobtouch", changerId = 7881 where groupId = '.$accountId.' and id in ('.$rids.');');

	$hits = $q->hits();
	$out .= h2($hits.' reservations were touched');

} else {
	
	
	$out .= h2($hits.' dataSets are ready. No WRITING to BD, you are in check mode: use &do=1 to write to DB');
	
}

$q = new Q('select reservations.id, created, changed, changer from reservations where id in ('.$rids.');');
$c = 1;			
while($row = $q->result->fetch_array()) {
	$out .= warning($c.': '.$row['id'].' '.$row['created'].' '.$row['changed'].' '.$row['changer']);
	$c++;
}
 




//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out .= h2('Successful');
echo html($out);

?>