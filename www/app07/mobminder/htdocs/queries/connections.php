<?php
//////////////////////////////////////////////////////////////////////
//
//      Q U E R Y    C O N N E C T I O N S 
//
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

	$loggedIn = $_SESSION['loggedIn']; 	// list of logged in logins
	
$filter = $_POST['filter'];	

$keyword 	= $_POST['keyword'];	
$sunday 	= $_POST['sunday']; // consider taking today's connection in consideration
$xweeks 	= $_POST['xweeks'];	
$logins 	= $_POST['logins']; if($logins=='-') $logins= Array(); else $logins = explode('!', $logins); // an array of login Ids, assigned to this task

$perfReport->peak('::session & post variables retrieved');

///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Real time monitoring
//

	// prepare loading parameters
	//
if($dS_login->accessLevel==aLevel_admin) { // you see all connections on the system
	
	echo 'admin level scope'.$nl;
	$q = new Q('SELECT id FROM groups;'); $accountIds = $q->ids();

} else { // you see only connections relating to groups for which connected logins have access keys

	$o_dbAccess_akeys = new C_dbAccess_accesskey($loggedIn);
		$accountIds = $o_dbAccess_akeys->getList('accountId');		
		
	echo 'limited scope for logins:'.$loggedIn.$nl.'accounts:'.$accountIds.$nl;
}

$perfReport->peak('::real time data selection completed');


	// load data
	//
	$o_dbAccess_connections = new C_dbAccess_connections($accountIds);
	$rtstream = $o_dbAccess_connections->stream(false, 'realtime');
	
$perfReport->peak('::real time data loaded');


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Archived connections monitoring
//

	$midnIn = $sunday;
	$midnOut = $sunday+86400;	
	
	$q = new Q('SELECt id FROM archive_connections WHERE logintime >= '.$midnIn.' AND logintime <= '.$midnOut.' AND groupId IN ('.$accountIds.');');
	$cnxIds = $q->ids();
	
$perfReport->peak('::archived data selection completed');
	
	$o_dbAccess_connections = new C_dbAccess_connections(false, 'archive_');
	if($cnxIds) $o_dbAccess_connections->loadOnId($cnxIds);
	
	$archstream = $o_dbAccess_connections->stream(false, 'archive');
	

$perfReport->peak('::archived data loaded');

///////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Feedback to client
//	
	// stream data
	//
	echo '<code>';
	echo $rtstream;
	echo $archstream;
	echo '</code>';
	
$perfReport->peak('::streamed');

$perfReport->dropReport();
?>