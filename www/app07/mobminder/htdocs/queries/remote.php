<?php

//////////////////////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R I E S  ::  R E M O T E . P H P 
//
//   returns one visitor preferences i.t.o workcodes and resources
//


require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session');


$visitorId = $_POST['id'];


//////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 1:  W O R K C O D E S
//
// For this: We load all the performances that were ever associated with this visitor

$SQL = 'SELECT DISTINCT id
	FROM ( SELECT workCodeId as id FROM performances WHERE visitorId = '.$visitorId.' 
		UNION SELECT workCodeId as id FROM archive_performances WHERE visitorId = '.$visitorId.') ALIAS;';

$q = new Q($SQL); $workcodes = $q->ids('!');
$perfReport->peak('::step1 completed - performances associated with visitorId');



//////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 2:  R E S O U R C E S
//


// 		STEP 2.1:  FIND RESERVATIONS ASSOCIATED WITH VISITOR ID
//
// select the latest planned reservation for this visitor (in the current reservations table)
	

function SQL($visitorId, $archive) {
	return 
'SELECT '.$archive.'reservations.id AS resaId 
	FROM '.$archive.'reservations
	JOIN '.$archive.'att_visitors 
		ON '.$archive.'reservations.id = '.$archive.'att_visitors.groupId
	WHERE resourceId = '.$visitorId.''; // absence of ';' is intentionnal
}

$SQL = 'SELECT DISTINCT resaId as id FROM (  '.SQL($visitorId, '').' UNION '.SQL($visitorId, 'archive_').' ) ALIAS WHERE resaId <> 0;';

// echo $nl.$SQL.$nl;

$q = new Q($SQL); $resaIds = $q->ids();
$perfReport->peak('::step2.1 completed - reservations associated with visitorId');



// 		STEP 2.2:  FIND RESOURCES ASSOCIATED WITH THE GIVEN RESERVATIONS
//

function SQL2($resaIds, $archive) {
	return 'SELECT resourceId FROM '.$archive.'attendees WHERE groupId IN ('.$resaIds.')';
}

$resources = '';
if($resaIds) { 

	$SQL = 'SELECT DISTINCT resourceId as id FROM (  '.SQL2($resaIds, '').' UNION '.SQL2($resaIds, 'archive_').' ) ALIAS;';
	$q = new Q($SQL); $resources = $q->ids('!');
}
$perfReport->peak('::step2.2 completed - groups resources associated with visitorId reservations');


//////////////////////////////////////////////////////////////////////////////////////////////////
// STEP 3:    S T R E A M     B A C K 
//
echo '<code>';
echo '#C_dS_visitorPreferences'.$nl.$visitorId.'|'.$resources.'|'.$workcodes.$nl;
echo '</code>';
$perfReport->peak('::echo completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'q_remote');
?>