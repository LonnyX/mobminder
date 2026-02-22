<?php

//////////////////////////////////////////////////////////////////////
//
//    C H E C K    I F     T H E   G I V E N    H O U R L Y   I S   D E L A T A B L E   ( NOT  USED  ANYMORE )
//
//  This verification needs to be done here, not at client side, because 
//  client side is limited to the login view that may not consider all resources and their hourly usages.
//
//  Consider two cases
//  - the hourlyId is used by the youngest hourlyuser dayIn, in this case we may not delete the hourly (because currently in use)
//  - the hourlyId is used by a future hourlyuser dayIn, in this case we may not delete the hourly (because planned for re-use)

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$hId = $_POST['id'];

$q1 = new Q('select id from resources where groupId = '.$accountId.';');
$rscIds = $q1->ids(false);

$q2 = new Q('select id from hourlies where groupId = '.$accountId.' and periodicity <> 0;'); // exceptional days are ignored (zero periodicity)
$hlIds = $q2->ids();

$q3 = new Q('select groupId, hourlyId, dayIn from hourliesusers where hourlyId in('.$hlIds.') order by dayIn desc;');

$rscHourlies = Array();
foreach($rscIds as $rid) $rscHourlies[$rid] = Array();
while($row = $q3->result->fetch_array()) { // sort out hourlies by account resource
	$rscId = $row['groupId'];
	$hourlyId = $row['hourlyId'];
	$dayIn = $row['dayIn'];
	$rscHourlies[$rscId][$dayIn] = $hourlyId;
}

$today = new C_date(); $today = $today->getMDNstmp();
$stillInUse = 0;
foreach($rscIds as $rid) {
	$hourlies = $rscHourlies[$rid];
	if(!count($hourlies)) continue;
	foreach($hourlies as $dayIn => $hourlyId) // drills down dayIn's from future to past, for each resource
		{ if($hourlyId==$hId) $stillInUse = 1; if($dayIn < $today) break; } // we check only the youngest activated hourly id if past, if future we check them all until we come to the past
	if($stillInUse) break; // no need to check further, we now know that this hourly is still in use
}

echo $stillInUse.'##'.$nl; // client side should split on "##", the check result is 0 if not used anymore, dayIn if still in use


foreach($rscIds as $rid) { // display some monitoring
	$hourlies = $rscHourlies[$rid];
	echo 'resource '.$rid.$nl;
	if(count($hourlies)) 
		foreach($hourlies as $dayIn => $hourlyId) {
			echo '   dayIn '.$dayIn.', hourlyId '.$hourlyId.$nl;
		}
	echo '-------------------'.$nl;
}

$perfReport->peak('::completed');
$perfReport->dropReport();
?>