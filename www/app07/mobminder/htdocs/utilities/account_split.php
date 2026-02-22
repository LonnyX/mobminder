<?php
$systemLog = 'split.php';
require '../../lib_mobphp/dbio.php';

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
$out = h1('Split operation');


//////////////////////////////////////////////////////
//
//  Parameters
//

$originGroup = 2784; // group from which we move the stuff
$targetGroup = 3038; // create this group first !!!

$movingRescs = Array(6722,6721,6307,6906); 					$mRscs = implode(',',$movingRescs);

$movingWrkcs = Array(3033,2972,2970,2967,2969,2756); 		$mWrkcs = implode(',',$movingWrkcs);
$movingTboxs = Array(1000076,1000077); 						$mTboxs = implode(',',$movingTboxs);
$movingHourl = Array(6307,6548,6549,6675,6748);  			$mHourl = implode(',',$movingHourl);
$movingCcss = Array(3277,3276,3278,3280,3324,1642);  		$mCcss = implode(',',$movingCcss);

$sharedWrkcs = Array(3811); 		$shWrkcs = implode(',',$sharedWrkcs);
$sharedCcss = Array(1069,1399,1334,1313,1182,1477,1537,3279,1137,1148,1149,1127,1128,1331);  		$shCcss = implode(',',$sharedCcss);
	

// TBD !!! <= check that users from the originGroup have accesskeys with views including movingRescs !! that should be cleaned up
	

//////////////////////////////////////////////////////////////////////////////// 
//
//  Identifying visitors that are exclusive to those resources
//

	$q = new Q('SELECT DISTINCT att_visitors.resourceId as vId FROM att_visitors 
		JOIN attendees ON attendees.groupId = att_visitors.groupId 
		WHERE attendees.resourceId IN('.$mRscs.');');

	$own_vIds = $q->mlist('vId'); $ownV = $q->mlist('vId', false); // own visitors just move to the new 'target group'
	echo '.1.<br/>';
	
	$out .= notice('visitors appointed only by moving resources:'.$q->cnt());
		
	$q = new Q('SELECT DISTINCT att_visitors.resourceId as vId FROM att_visitors 
		JOIN attendees ON attendees.groupId = att_visitors.groupId 
		WHERE att_visitors.resourceId IN('.$own_vIds.')
			AND attendees.resourceId NOT IN ('.$mRscs.')
		;');
		
	$shared_vIds = $q->mlist('vId'); $sharedV = $q->mlist('vId', false); // shared visitors must be duplicated and their references adapted
	echo '.2.<br/>';
	
	$out .= notice('visitors appointed shared with other resources:'.$q->cnt());
		
			// archives

	$q = new Q('SELECT DISTINCT archive_att_visitors.resourceId as vId FROM archive_att_visitors 
		JOIN archive_attendees ON archive_attendees.groupId = archive_att_visitors.groupId 
		WHERE archive_attendees.resourceId IN('.$mRscs.');');

	$own_vIdsA = $q->mlist('vId'); $ownVA = $q->mlist('vId', false); // own visitors just move to the new 'target group'
	echo '.3.<br/>';

	$out .= notice('Archives: visitors appointed only by moving resources:'.$q->cnt());
		
	$q = new Q('SELECT DISTINCT archive_att_visitors.resourceId as vId FROM archive_att_visitors 
		JOIN archive_attendees ON archive_attendees.groupId = archive_att_visitors.groupId 
		WHERE archive_att_visitors.resourceId IN('.$own_vIdsA.')
			AND archive_attendees.resourceId NOT IN ('.$mRscs.')
		;');
		
	$shared_vIdsA = $q->mlist('vId'); $sharedVA = $q->mlist('vId', false); // shared visitors must be duplicated and their references adapted
	echo '.4.<br/>';

	$out .= notice('Archives: visitors appointed shared with other resources:'.$q->cnt());


	// combine the lists of visitors
$allOwnV = array_merge($ownV, $ownVA); $allOwnVids = implode(',',$allOwnV);
$allSharedV = array_merge($sharedV, $sharedVA); $allSharedVids = implode(',',$allSharedV);

$movingV = Array(); // We keep only distinct moving visitors (that are not shared at all with non moving resources)
foreach($allOwnV as $vid)
	if(!in_array($vid,$allSharedV))
		if(!in_array($vid,$movingV))
			$movingV[] = $vid;
$movingVids = implode(',',$movingV);
			
//////////////////////////////////////////////////////////////////////////////// 
//
//  Reservations
//

	
	$q = new Q('SELECT DISTINCT reservations.id as rId FROM reservations 
		JOIN attendees ON attendees.groupId = reservations.id 
		WHERE attendees.resourceId IN('.$mRscs.')
		;');
	
$moving_resaIds = $q->mlist('rId');

$out .= notice('number of current reservations for moving resources:'.$q->cnt());
	
		// archives
		
	$q = new Q('SELECT DISTINCT archive_reservations.id as rId FROM archive_reservations 
		JOIN archive_attendees ON archive_attendees.groupId = archive_reservations.id 
		WHERE archive_attendees.resourceId IN('.$mRscs.')
		;');
		
$moving_resaIdsA = $q->mlist('rId');

$out .= notice('number of archived reservations for moving resources:'.$q->cnt());


//////////////////////////////////////////////////////////////////////////////// 
//
//  Moving operation
//
if(1) {

	// resources
	$q = new Q('UPDATE resources SET groupId = '.$targetGroup.' WHERE id IN('.$mRscs.');');

	$out .= warning('resources have moved');

	// own visitors
	$q = new Q('UPDATE visitors SET groupId = '.$targetGroup.' WHERE id IN('.$movingVids.');');

	$out .= warning('visitors have moved');
	
}

if(1) {

	// shared visitors

foreach($allSharedV as $vid) {
	$o = new C_dS_visitor($vid); // note that the visitors table is unique
	$c = new C_dS_visitor(0,$targetGroup,$o);
	$id = $c->dSsave()->id;
	
	new Q('UPDATE att_visitors SET resourceId = '.$id.' WHERE resourceId = '.$vid.' AND groupId IN('.$moving_resaIds.');');
	new Q('UPDATE archive_att_visitors SET resourceId = '.$id.' WHERE resourceId = '.$vid.' AND groupId IN('.$moving_resaIdsA.');');
}
$out .= warning('shared visitors have been duplicated');
	

	// reservations
$q = new Q('UPDATE reservations SET groupId = '.$targetGroup.' WHERE id IN('.$moving_resaIds.');');
$q = new Q('UPDATE archive_reservations SET groupId = '.$targetGroup.' WHERE id IN('.$moving_resaIdsA.');');

$out .= warning('reservations have moved');



	// attributes
$q = new Q('UPDATE timeboxings SET groupId = '.$targetGroup.' WHERE id IN('.$mTboxs.');');
$q = new Q('UPDATE hourlies SET groupId = '.$targetGroup.' WHERE id IN('.$mHourl.');');
$q = new Q('UPDATE workcodes SET groupId = '.$targetGroup.' WHERE id IN('.$mWrkcs.');');
$q = new Q('UPDATE custom_css SET groupId = '.$targetGroup.' WHERE id IN('.$mCcss.');');

$out .= warning('attributes have moved');



	// shared workcodes

foreach($sharedWrkcs as $wid) {
	$o = new C_dS_workcode($wid);
	$c = new C_dS_workcode(0,$targetGroup,$o);
	$id = $c->dSsave()->id;
		$out .= notice('workcode id '.$wid.' copied into id '.$id);
	new Q('UPDATE performances SET workCodeId = '.$id.' WHERE workCodeId = '.$wid.' AND groupId IN('.$targetGroup.');');
		
		// duplicate workexperts
		$q = new Q('SELECT id FROM workexperts WHERE groupId = '.$wid.';'); $eIds = $q->ids(false);
		foreach($eIds as $eId) {
			$o = new C_dS_workexpert($eId);
			$c = new C_dS_workexpert(0,$id,$o);
			$eid = $c->dSsave()->id;
			$out .= notice('expert id '.$eId.' copied into id '.$eid);
		};
		
		// re-allocate workexperts
		new Q('DELETE FROM workexperts WHERE groupId = '.$wid.' AND resourceId IN ('.$mRscs.');');
		new Q('DELETE FROM workexperts WHERE groupId = '.$id.' AND resourceId NOT IN ('.$mRscs.');');
}
$out .= warning('shared workcodes have been duplicated');


	// shared ccss

foreach($sharedCcss as $cid) {
	$o = new C_dS_customCss($cid);
	$c = new C_dS_customCss(0,$targetGroup,$o);
	$id = $c->dSsave()->id;
		$out .= notice('ccss id '.$cid.' copied into id '.$id);
	new Q('UPDATE visitors SET cssColor = '.$id.' WHERE cssColor = '.$cid.' AND groupId = '.$targetGroup.';');
	new Q('UPDATE reservations SET cssColor = '.$id.' WHERE cssColor = '.$cid.' AND groupId = '.$targetGroup.';');
	new Q('UPDATE archive_reservations SET cssColor = '.$id.' WHERE cssColor = '.$cid.' AND groupId = '.$targetGroup.';');
	new Q('UPDATE workcodes SET cssColor = '.$id.' WHERE cssColor = '.$cid.' AND groupId = '.$targetGroup.';');
}
$out .= warning('shared ccss have been duplicated');

	// Lazy here : we drop the patterns
new Q('UPDATE visitors SET cssPattern = 0 WHERE groupId = '.$targetGroup.';');

new Q('update logins set groupId = '.$targetGroup.' where id in (8196,8135,8137,8160);');
new Q('update accesskeys set accountId = '.$targetGroup.' where groupId in (8196,8135,8137,8160);');

}
//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo html($out);


?>