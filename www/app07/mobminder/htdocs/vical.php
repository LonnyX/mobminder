<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   I C A L      V I S I T O R     A P P O I N T M E N T S   
//

require './../lib_mobphp/dbio.php';

$web = @$_GET['web'];
if(isset($web)) $web=true; else $web=false;
require './classes/ical.php';

/////////////////////////////////////////////////////////////////////////////////

$perfReport = new C_perfReport();

// retrieve posts
$aid = @$_GET['aid']; // account id
$vid = @$_GET['vid']; // visitor id
$vdi = @$_GET['vdi']; // visitor digits (min 3 max 8)

if(!(isset($aid))||!(isset($vid))||!(isset($vdi))) die('Sorry (no ticket)');


/////////////////////////////////////////////////////////////////////////////////
//
// Visitor authentication

$q = new Q('select count(1) as c from visitors where groupId = "'.$aid.'" AND id = "'.$vid.'" AND REPLACE(REPLACE(lastname," ",""),"-","") LIKE "'.$vdi.'%";');
if(!$q->c()) {
	die('Sorry (authentication failed)');
}

$dS_account = new C_dS_group($aid);
$dS_visitor = new C_dS_visitor($vid);


/////////////////////////////////////////////////////////////////////////////////
//
// Account context

$wkcds = new C_dbAccess_workcodes($aid);
$ccsss = new C_dbAccess_customCss($aid);
$rescrs = new C_dbAccess_resources($aid); 

$L = new L($dS_visitor->language);


/////////////////////////////////////////////////////////////////////////////////
//
// Fetch reservations

$joinOnAttendees = 'JOIN att_visitors ON att_visitors.groupId = reservations.id';
$where = 'WHERE reservations.groupId = '.$aid.' AND reservations.deletorId = 0 AND resourceId = '.$vid.'';
$SQL = 'SELECT reservations.id AS id FROM reservations '.$joinOnAttendees.' '.$where.';';
$q = new Q($SQL);
$resas = new C_dbAccess_reservations(); $resas->loadOnId($q->ids());


$events = Array(); if($resas->count()) {

	$attnd = new C_dbAccess_attendees(); 	$attnd->loadOnGroup($q->ids(), true /*do group*/);
	$attvs = new C_dbAccess_att_visitors(); $attvs->loadOnGroup($q->ids(), true /*do group*/);
	// $visis = new C_dbAccess_visitors(); 	$visis->loadOnId($attvs->getResourceIdsList());
	$perfs = new C_dbAccess_performances(); $perfs->loadOnGroup($q->ids(), true /*do group*/);
	
	foreach($resas->keyed as $resaId => $dS) {
		
		// escape exceptions
		if(!isset($attnd->grouped[$resaId])) continue; // a reservation with no attendee (normally, that should never happen)
		
		// resources 
		$resc = Array(); $attCount = count($attnd->grouped[$resaId]);
		if($attCount) foreach($attnd->grouped[$resaId] as $attId => $d) {
			$rid = $d->resourceId;
			$resc[] = $rescrs->keyed[$rid]->name;
		}
		$resc = implode(', ',$resc);

		
		// performances
		$perf = Array(); 
		if(isset($perfs->grouped[$resaId]))
			foreach($perfs->grouped[$resaId] as $pId => $d) {
				$wkid = $d->workCodeId;
				if(isset($wkcds->keyed[$wkid])) // though it 
					$perf[] = $wkcds->keyed[$wkid]->name;
			}
		$perf = implode(', ',$perf);
		
		
		// custom colors
		$ccss = Array();
		if($dS->cssColor) $ccss[] = $ccsss->keyed[$dS->cssColor]->name;
		if($dS->cssPattern) $ccss[] = $ccsss->keyed[$dS->cssPattern]->name;
		$ccss = implode(', ',$ccss);
		
		// note
		$resaNote = $dS->note;
		$crPosition = strpos($resaNote, chr(10)); // Find position of first occurrence of a string
		if($crPosition) // then there are many lines of text in this note
			$resaNote = substr($resaNote, 0, $crPosition); // select only the first line for the title
		$resaNote = substr($resaNote, 0, 128); // anyway never more than 128 characters
		
		// assess
		$title = $dS_account->name.': '.$resaNote;
		$vnts = $resc.'\n';
		
		
		// ical object
		$events[] = new C_iCal_vEvent($resaId, $dS->cueIn, $dS->cueOut, $title, $dS->note /*resanote*/, '' /*visiname*/, '' /*visinote*/, $perf /*workcode*/, $ccss /*colorname*/, ''/*attendance*/, ''/*color*/);
	}
}


$perfReport->peak('::reservations loaded');



$ics = new C_iCal_protocol($events);

// output
	$filename = $aid.'_'.$vid.'_'.$vdi;
	
$filename = utf8_decode($filename);
$filename = preg_replace("/[^A-Za-z0-9ιθ_\(\)\-]/",'',$filename); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""
if($web) $ics->display($filename); else $ics->stream($filename);

if(!$web) die(); // no perf report for production
$perfReport->peak('::protocol streamed');
echo '##perfreport'.chr(10);
$perfReport->peak('::echo');
$perfReport->dropReport();

?>