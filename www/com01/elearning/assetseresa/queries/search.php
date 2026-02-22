<?php


//////////////////////////////////////////////////////////////////////////////////////////////
//                        C O P Y R I G H T    N O T I C E
//
// This SEARCH ENGINE is under trade mark: PVHxAGENDA
//
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// � All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// � Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium



ob_start(); // relates to (*ob1)
$loadcontext = 1; 
require '../classes/ajax_session.php';

if (isset($_SESSION['e-resa'])) unset($_SESSION['e-resa']);
session_write_close(); 

require '../../../../mobminder/lib_mobphp/cues.php';


if(1) { // retrieve posts and set parameters
	
	$duration 	= $_POST['duration'];
	$notbefore 	= $_POST['before']+0;
	$ampm 		= $_POST['ampm']+0;
	$except 	= !!$_POST['exceptional']; 	// options
	$overdays 	= !!$_POST['overdays']; 	// options
	$aggregate 	= $_POST['aggregate']+0; 	// options
	$staffsize 	= $_POST['staffsize']+0;
	$visitors 	= $_POST['visitors'];
	$workcodes 	= $_POST['workcodes'];
	$tboxing 	= $_POST['tboxing'];
	$continued 	= $_POST['continued']+0;
	$limit 		= $_POST['limit']+0; // maximum wished number of returned options returned, keep in mind that when a day starts scanning, it goes to the end of the day. limit = 0 means automatic limit.
	
	$sameday = @$_POST['sameday'] or 0; 
	$limitdate 	= @$_POST['limitdate'] or 0; 

	C_date::setTimeParameters($dS_account);

	$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? Array() : explode('!', $bCals);
	$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? Array() : explode('!', $uCals);
	$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? Array() : explode('!', $fCals);

	// convert to framework format
	$duration = $duration * C_date::getSecondsPerSlice();

	$visitors 	= $visitors=='-' 	? Array() : explode('!', $visitors);
	$workcodes 	= $workcodes=='-' 	? Array() : explode('!', $workcodes);
	$tboxing 	= $tboxing=='-' 	? Array() : explode('!', $tboxing);
	
	if($visitors) // modify the visitor file to remember AMPM preferences (without tracking to field "changed" and "changer")
		new Q('UPDATE visitors SET prefAMPM = '.$ampm.' WHERE id IN ('.implode(',',$visitors).');');
	
	
	if($continued) { 
			$nbd = new C_date($continued); 
			$nbd->dIncrement(1); 
			$notbefore = $nbd->t;
		} // continues with the next day
	
}

$lookup = new C_availabilities_lookup($dS_account, $bCals, $uCals, $staffsize, $fCals, $ampm, $tboxing, $verbose=true);
$lookup->search($duration, $notbefore, $aggregate, $sameday, $limit, $limitdate, $overdays, $except);
$lookup->stream($bank='slots',$tagin='<code>',$tagout='</code>');

$perf = $lookup->dropperfreport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perf,'q_search');
?>