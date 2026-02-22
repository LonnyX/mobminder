<?php

require './../lib_mobphp/dbio.php';

$web = @$_GET['web'];
if(isset($web)) $web=true; else $web=false;
require './classes/ical.php';

// http://localhost/ical.php?g=3636&l=9482&r=10632&web=1    // Sébastien Tejedor chez Olivier Gay / Agenda de Stéphanie

// http://localhost/ical.php?g=4376&l=9482&r=22656&web=1    // Agenda 1, test chez Olivier Gay

/////////////////////////////////////////////////////////////////////////////////

$perfReport = new C_perfReport();

$rescId 	= @$_GET['r'];
$groupId 	= @$_GET['g'];
$loginId 	= @$_GET['l'];

if(!(isset($rescId))||!(isset($groupId))||!(isset($loginId))) die('Sorry (no ticket)');

// Protection against SQL injection

if($rescId) if(!is_numeric($rescId)) die('Invalid input (1)');
if(!is_numeric($groupId)) die('Invalid input (2)');
if(!is_numeric($loginId)) die('Invalid input (3)');

$rescId = preg_replace("/[^0-9]/",'',$rescId);
$groupId = preg_replace("/[^0-9]/",'',$groupId);
$loginId = preg_replace("/[^0-9]/",'',$loginId);


//    L O G I N  (check if this login has a key for the given group)
//
$q = new Q('select id from accesskeys where groupId = "'.$loginId.'" AND accountId = "'.$groupId.'";');
$ids = $q->ids(false); $kid = 0; if(count($ids)) $kid = $ids[0];
if($kid==0) { sleep(5); die('Sorry (no key)'); }

$o_dS_group = new C_dS_group($groupId);
$o_dS_login = new C_dS_login($loginId);


//    R E S O U R C E (s)
//
$timeboxing = false;
if(isset($rescId)&&($rescId!='')) {
	$view = $rescId;
	
} else {
	$keyview = new C_keyview($kid);
	$view = $keyview->get4sql();
}


//    G R O U P 
//
$wkcds = new C_dbAccess_workcodes($groupId);
$ccsss = new C_dbAccess_customCss($groupId);
$rescrs = new C_dbAccess_resources($groupId); 

$csstohexa = new C_cssNameToHexaColor($groupId);

$L = new L($o_dS_login->language);


$perfReport->peak('::time needed to retrieve context and posted parameters');


// step 01: fetch reservations

$joinOnAttendees = 'JOIN attendees ON attendees.groupId = reservations.id';
$where = 'WHERE reservations.groupId = '.$groupId.' AND reservations.deletorId = 0 AND resourceId IN ('.$view.')';
$SQL = 'SELECT reservations.id AS id FROM reservations '.$joinOnAttendees.' '.$where.';';
$q = new Q($SQL);
$resas = new C_dbAccess_reservations(); $resas->loadOnId($q->ids());

$events = Array(); if($resas->count()) {

	$attnd = new C_dbAccess_attendees(); 	$attnd->loadOnGroup($q->ids(), true /*do group*/);
	
	foreach($resas->keyed as $resaId => $dS_resa) {
		
		$dS_resa->magnify($rescrs, true);
		
		// escape exceptions
		if(!isset($attnd->grouped[$resaId])) continue; // a reservation with no attendee (normally, that should never happen)
		
		// resources 
		$resc = Array(); $attCount = count($attnd->grouped[$resaId]);
		if($attCount) foreach($attnd->grouped[$resaId] as $attId => $dS_attendee) {
			$rid = $dS_attendee->resourceId; if($rid == $rescId) continue; // do not mention the calling resource, only other attendees
			$resc[] = $rescrs->keyed[$rid]->name;
		}
		$resc = implode(', ',$resc);


		// visitors
		$visCount = $dS_resa->visitors->count();
		$vids = Array(); $vnts = Array(); 
		if($visCount)
			foreach($dS_resa->visitors->keyed as $vid => $dS_visitor)
				{ $vids[] = $dS_visitor->getInfo(); $vnts[] = $dS_visitor->getNote(); }
		
		$vids = implode('\n',$vids);
		$vnts = implode('\n',$vnts);

		
		// performances
		$perfscount = $dS_resa->workcodes->count();
		$perf = Array(); 
		if($perfscount)
			foreach($dS_resa->workcodes->keyed as $wkid => $dS_workcode)
				$perf[] = $dS_workcode->name;
				
		$perf = implode(', ',$perf);
		
		
		// custom colors
		$ccss = Array();
		if($dS_resa->cssColor) $ccss[] = $ccsss->keyed[$dS_resa->cssColor]->name;
		if($dS_resa->cssPattern) $ccss[] = $ccsss->keyed[$dS_resa->cssPattern]->name;
		$ccss = implode(', ',$ccss);
		$color = $csstohexa->getHexaColor($dS_resa);
		
		
		// note ( VEVENT::DESCRIPTION )
		//
		$resaNote = $dS_resa->note;
		$crPosition = strpos($resaNote, chr(10)); // Find position of first occurrence of a string
		if($crPosition) // then there are many lines of text in this note
			$resaNote = substr($resaNote, 0, $crPosition); // select only the first line for the title
		$resaNote = substr($resaNote, 0, 512); // anyway never more than 512 characters
		
		// title ( VEVENT::SUMMARY )
		//
		$title = L::XL('event'); // title appears under iCal SUMMARY
		if($resaNote) $title = $resaNote; // When something is written in the note, take the note
		if($visCount) $title = L::XL('appointment'); // more than on visitor
		if($visCount==1) $title = $vids; // only one visitor
		if($visCount>1) $vnts = $vids.'\n'; // when more than one visitor, the visinotes is the list of visitors
		if(!$visCount)
			if($perf) $title = $perf; // no visitor, take the performance as title
		
		// ical object
		$events[] = new C_iCal_vEvent($resaId, $dS_resa->cueIn, $dS_resa->cueOut, $title, $dS_resa->note, $vids, $vnts, $perf, $ccss, $resc, $color);
	}
}

$perfReport->peak('::reservations loaded');

$ics = new C_iCal_protocol($events);

// output
	$filename = $o_dS_group->id.'_'.$o_dS_login->id;
	if($rescId) $filename .= '_'.$rescId;
	
$filename = utf8_decode($filename);
$filename = preg_replace("/[^A-Za-z0-9éè_\(\)\-]/",'',$filename); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""
if($web) $ics->display($filename); else $ics->stream($filename);

if(!$web) die(); // no perf report for production
$perfReport->peak('::protocol streamed');
echo '##perfreport'.chr(10);
$perfReport->peak('::echo');
$perfReport->dropReport();

?>