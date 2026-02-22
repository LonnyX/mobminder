<?php
//////////////////////////////////////////////////////////////////////////////////////////////
//
//  P O S T    R E S E R V A T I O N 
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium
//



$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$recurr = @$_POST['recurr']; if(isset($recurr)) $recurr = explode('!', $recurr); else $recurr = false;

$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? false : explode('!', $bCals);
$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? false : explode('!', $uCals);
$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? false : explode('!', $fCals);

$attendees = array();
$classes = array(class_bCal => $bCals, class_uCal => $uCals, class_fCal => $fCals);
foreach($classes as $class => $att_by_class)
	if($att_by_class) foreach($att_by_class as $id) $attendees[] = $id;

$single = $account_resources->count()==1;
	
$perfReport->peak('::posts retrieved');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// retrieve or make new reservation
//

$dS_reservation = new C_dS_reservation(0, $accountId, $_POST); // resa from current table
$duration = $dS_reservation->cueOut - $dS_reservation->cueIn;
$overloads = array();
$c = 0;
echo 'overbooking check for '.count($recurr).' appointments'.$nl;
echo 'duration is '.($duration/60).' minutes'.$nl.$nl;

	foreach($recurr as $cueIn) {
		$c++; $d = new C_date($cueIn);
		echo $c.'. checking on '.$d->getDateTimeString().': ';
		
		$oids = C_dbAccess_attendees::hasoverload($accountId, $cueIn, $cueIn+$duration, $attendees, $single); // see function defined hereunder
		if($oids) echo 'overload found with reservation ids:'.$oids.$nl;
			else echo 'no overload for this resa'.$nl;
		
		if($oids) $overloads[] = $cueIn.'!'.$oids;
	}	

echo $nl;
echo '<array>'.$nl;
if(count($overloads)) foreach($overloads as $ol) echo $ol.$nl;
echo '</array>'.$nl;
	

$perfReport->peak('::Feedback completed');
$perfReport->dropReport();


?>