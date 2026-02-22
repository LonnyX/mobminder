<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 

// test on linux console:
//
// curl --location --request GET 'https://fr.mobminder.com/ants/availableTimeSlots?meeting_point_ids=71076&mee-01&documents_number=1&reason=CNI' --header 'x-hub-rdv-auth-token: [ANTS]{mobminder}proj2023.v01'
// curl --location --request GET 'https://fr.mobminder.com/ants/availableTimeSlots?mee-01&documents_number=1&reason=CNI' --header 'x-hub-rdv-auth-token: [ANTS]{mobminder}proj2023.v01'


//curl --location --request GET 'https://fr.mobminder.com/ants/availableTimeSlots?meeting_point_ids=71076&meeting_point_ids=71118&start_date=2023-06-01&end_date=2023-12-01&documents_number=1&reason=CNI' \ --header 'x-hub-rdv-auth-token: [ANTS]{mobminder}proj2023.v01'

// tests in production:
//
// https://rendezvouspasseport.ants.gouv.fr/
// 


header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');
define('testmode', false); // good for local dev testing, especially when you call it from _test_availableTimeSlots.php

require './antslib.php';

ob_start(); // relates to (*ob1)


Check_Auth_Token();

$meeting_point_ids = @$_GET['meeting_point_ids'];

$callingurl = $_SERVER['REQUEST_URI']; 		// like be.mobminder.com/availableTimeSlots.php?meeting_point_ids=71118&start_date=2022-11-01&end_date=2022-11-30&reason=CNI&documents_number=1
$callingurl = explode('?',$callingurl)[1]; 	// like meeting_point_ids=71118&start_date=2022-11-01&end_date=2022-11-30&reason=CNI&documents_number=1

$getparams = explode('&',$callingurl);	// like Array(meeting_point_ids=71118,meeting_point_ids=71076,start_date=2022-11-01,...);
$splitparams = Array();
foreach($getparams as $x => $combo) {
	$split = explode('=',$combo); 	// like $split[0] = meeting_point_ids, $split[1] = 71118
	$name = $split[0]; $value = $split[1];
	if(isset($splitparams[$name])) { // then we should set up an Array for this parameter
		if(is_array($splitparams[$name])) $splitparams[$name][] = $value; // keep filling the existing array
		else { // make it an array with one initial value plus the arriving second value
			$splitparams[$name] = Array($splitparams[$name]);
			$splitparams[$name][] = $value;
		}
	} else
		$splitparams[$name] = $value;
}


if(testmode) {
	echo 'meeting_point_ids:'.$nl;
	print_r($meeting_point_ids);
	echo $nl;
	
	echo '$callingurl: '.$callingurl.$nl;	
	echo '$splitparams: '.$nl;
	print_r($splitparams);
	echo $nl;
	
}
if(!isset($splitparams['meeting_point_ids'])) die('{}');
$meeting_point_ids = $splitparams['meeting_point_ids'];

if(is_numeric($meeting_point_ids)) $meeting_point_ids = [$meeting_point_ids];
else if(!is_array($meeting_point_ids)) die('{}');

	
// $meeting_point_ids is now an array like [id1,id2,id3]

$mpids = [];
foreach($meeting_point_ids as $x => $mpid) if(is_numeric($mpid)) $mpids[] = $mpid;
// $mpids is an array like [71076,71118,...]
$mobids = [];
foreach($mpids as $x=>$mpid) {
	switch($mpid) {
		case 71076: $mobids[71076] = 3644; break; // Chalon-Sur-Saone // links ANTS id with mobminder account id
		case 71118: $mobids[71118] = 4584; break; // Châtenoy-le-Royal
	};
}
if(testmode) {
	echo 'mpids:'.$nl;
	print_r($meeting_point_ids).$nl;
	echo $nl;
}

$mobwkids = [];
foreach($mpids as $x=>$mpid) {
	switch($mpid) {
		case 71076: $mobwkids[71076] = 1004151; break; // Chalon-Sur-Saone// links ANTS id with mobminder workcode id (take the workcode that is available online, for one slot)
		case 71118: $mobwkids[71118] = 1004004; break; // Châtenoy-le-Royal
	};
}


$limits = [];
foreach($mpids as $x=>$mpid) {
	switch($mpid) {
		case 71076: $limits[71076] = 512; break; // Chalon-Sur-Saone// links ANTS id with mobminder workcode id (take the workcode that is available online, for one slot)
		case 71118: $limits[71118] = 64; break; // Châtenoy-le-Royal
	};
}

if(testmode) {
	echo 'mpids:'.$nl;
	print_r($meeting_point_ids).$nl;
	echo $nl;
}



// from here we are going to loop on requested ANTS id's, store results in an array

$availabilities = [];
foreach($mobids as $antsid => $mobid) {
	
	$accountId = $mobid; 
	$dS_account = new C_dS_group($accountId);

		$dbAccess_bCals = new C_dbAccess_resources(); $dbAccess_bCals->loadAllOfType($accountId, class_bCal);

		$bCals = $dbAccess_bCals->getIdsList($sep=false);
		$uCals = Array();
		$fCals = Array();
		$staffsize = 1;
		$ampm = 0x00FFFF00;
		$tboxing = Array($mobwkids[$antsid]);


	if(testmode) {
		echo '$mobid:'.$mobid.$nl;
		echo '$bCals:'; print_r($bCals); echo $nl;
		echo '$tboxing:'; print_r($tboxing); echo $nl;
	}

	$lookup = new C_availabilities_lookup($dS_account, $bCals, $uCals, $staffsize, $fCals, $ampm, $tboxing, $verbose=testmode); // see cues.php



		$duration = 1; // slices
		// $duration = $duration * C_date::getSecondsPerSlice(); // seconds
		
		$notbefore = 0;
		$aggregate = 0;
		$sameday = 0;
		$limit = $limits[$antsid]; // (automatic adaptative limit)
		$limitdate = 0;
		$overdays = 0;
		$except = 0;

	$lookup->search($duration, $notbefore, $aggregate, $sameday, $limit, $limitdate, $overdays, $except);


	$availabilities[$antsid] = $lookup->ANTS($bank='slots',$tagin='',$tagout=''); // see cues.php
	
}
$r = ''; $sep = ''; foreach($availabilities as $antsid => $set) { $r .= $sep.'"'.$antsid.'":'.$set; $sep = ','.$nl; } // $r .= $sep.'"'.$id.'":'.$set;
echo '{'.$r.'}';

// $echo = '['.implode(',',$availabilities).']';
// echo $echo;


if(testmode) {
	echo $nl.'$mobids = ';
	print_r($mobids);
	
	echo $nl.'$_GET = ';
	print_r($_GET);
}

closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>