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
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out = h1('Spoofy operation - merged visitors fix up');


//////////////////////////////////////////////////////
//
//  Select att_visitors pointing to a merged visitor object
//

$ql = 'select lastname, firstname, visitors.deleted, att_visitors.id from att_visitors 
	join reservations on reservations.id = att_visitors.groupId
	join visitors on visitors.id = att_visitors.resourceId
	where visitors.mergedTo <> 0;';
	
$q = new Q($ql);

$ids = $q->ids();
$out .= notice($ql);
$out .= notice('result: '.$q->cnt().' items found.');
$out .= notice($ids);

$ids = $q->ids(list_as_array);
$c = 0;
if(!$do) $out .= warning('NOT IN DO MODE');

foreach($ids as $avid) {
	$av = new C_dS_att_visitor($avid);
	$v = new C_dS_visitor($av->resourceId);
	$out .= warning('-'.++$c.'-');
	$out .= notice('attendee '.$av->id.' now pointing to visitor '.$av->resourceId.' should point to visitor '.$v->mergedTo);
	
	if($do) {
		$av->resourceId = $v->mergedTo;
		$av->dSsave();
		$out .= warning('fixed');
	}
};


//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo html($out);


?>