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

header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');

require './antslib.php';

ob_start(); // relates to (*ob1)


Check_Auth_Token();

$meeting_point_ids = @$_GET['meeting_point_ids'];
if(!isset($meeting_point_ids)) die('{}');
	else if(is_numeric($meeting_point_ids)) $meeting_point_ids = [$meeting_point_ids];
	else if(!is_array($meeting_point_ids)) die('{}');
	else { } 
// $meeting_point_ids is now an array like [id1,id2,id3]
$mpids = [];
foreach($meeting_point_ids as $x=>$mpid) if(is_numeric($mpid)) $mpids[] = $mpid;
// $mpids is an array like [71076,71118,...]
$mobids = [];
foreach($mpids as $x=>$mpid) {
	switch($mpid) {
		case 71076: $mobids[71076] = 3644; break;
		case 71118: $mobids[71118] = 4584; break;
	};
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
		$tboxing = Array();

	$lookup = new C_availabilities_lookup($dS_account, $bCals, $uCals, $staffsize, $fCals, $ampm, $tboxing, $verbose=false);

		$duration = 1; // slices
		$duration = $duration * C_date::getSecondsPerSlice(); // seconds
		
		$notbefore = 0;
		$aggregate = 0;
		$sameday = 0;
		$limit = 0; // (automatic adaptative limit)
		$limitdate = 0;
		$overdays = 0;
		$except = 0;

	$lookup->search($duration, $notbefore, $aggregate, $sameday, $limit, $limitdate, $overdays, $except);


	$availabilities[$antsid] = $lookup->ANTS($bank='slots',$tagin='',$tagout='');
	
}
$r = ''; $sep = ''; foreach($availabilities as $antsid => $set) { $r .= $sep.'"'.$antsid.'":'.$set; $sep = ','.$nl; } // $r .= $sep.'"'.$id.'":'.$set;
echo '{'.$r.'}';

// $echo = '['.implode(',',$availabilities).']';
// echo $echo;


if(0) {
	echo $nl.'$mobids = ';
	print_r($mobids);
	
	echo $nl.'$_GET = ';
	print_r($_GET);
}

closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>