<?php
$systemLog = 'spoofy.php';
	
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  SPLIT AN ACCOUNT (Thanks to Alex Vanhoutte)
//
//  This script moves some resources from one group to another existing group; this means:
//	All reservations must follow
//	All visitors must be copied
//	Some workcodes should move to the new group
// 	Some time boxing should move
//	Some hourlies should move
//
//  Usage: 127.0.0.1/utilities/split.php  <= All parameters and behaviour should be set by reviewing this script
//
//  !! IMPORT VISITORS FIRST !!



//////////////////////////////////////////////////////
//
//  catch this script name 
//

$do = @$_GET['do']; if(isset($do)) { if($do==1) $do = true; } else $do = false;

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); 
$html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

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
			$o .= '<meta http-equiv="Content-Type=text/html; charset=UTF-8">';
			$o .= '<link href="./utilities.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}

set_time_limit(6000);

function dbtarget($ar='') {
	
	global $do, $out;
	$qg = new Q('select id from '.$ar.'chat_threads;');
	$cids = $qg->ids(list_as_array);

	foreach($cids as $cid) {
		
		$dS_chat = new C_dS_chat_thread($cid);
		
		$ql = 'select id, (select count(1) from '.$ar.'chat_phylacteries as mates where mates.groupId = main.groupId and mates.id < main.id) as c 
				from '.$ar.'chat_phylacteries as main
						where main.groupId = '.$cid.' and main.seqId = 0 order by main.id desc;';

		$q = new Q($ql);

		$counters = $q->idx('id','c');
		if(!count($counters)) continue;
		
		$out .= warning('CHAT:'.$dS_chat->id);
		foreach($counters as $id => $c) {
			$out .= notice('    id: '.$id.' sequence id:'.$c);
			if($do)
				new Q('update '.$ar.'chat_phylacteries set seqId = '.$c.' where id = '.$id.';');
		}
	}
}

//////////////////////////////////////////////////////
//
//  START
//

$out = h1('Spoofy operation');
$out = h2('PHP version:'.phpversion());

dbtarget();
dbtarget('archive_');

if(!$do) $out .= warning('NOT IN DO MODE');



//////////////////////////////////////////////////////////////////////////////// 
//
// STOP
//

echo html($out);


?>