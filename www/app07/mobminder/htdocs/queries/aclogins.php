<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    L O G I N S
//
require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

	$loggedIn = $_SESSION['loggedIn']; 	// list of logged in logins
	session_write_close(); 
	
if($dS_login->accessLevel==aLevel_admin) { // you see all connections on the system
	
	// $q = new Q('SELECT id FROM groups;'); $groupIds = $q->ids();
	$logIdsIN = '';
	echo 'admin level search'.$nl;

} else { // you see only connections relating to groups for which connected logins have access keys


	$o_dbAccess_akeys = new C_dbAccess_accesskey($loggedIn);
		$accountIds = $o_dbAccess_akeys->getList('accountId');
		
	echo 'limited scope search for logins:'.$loggedIn.$nl;
	echo '   - those logins can enter accounts:'.$accountIds.$nl;
	
	$akeys_currgroup = new C_dbAccess_accesskey(); 
	$akeys_currgroup->loadOnAccount($accountIds); // all the keys that open the groups visible for $loggedIn ($loggedIn may be more than one loggin)
		$logIds = $akeys_currgroup->getGroupIdsList(); // all the logins having access to the current group 
	
	$logIdsIN = 'id IN('.$logIds.') AND ';
	
	echo '   - for which accounts the possible logins are:'.$logIds.$nl;
}

// retrieve and filter input digits 

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

$digits = strtolower($_POST['digits']);
$digits = preg_replace("/[^a-z0-9éèëêôîïû']/si",'',$digits); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""

// spaces are removed so you can search on "de co" to find "de coninck"
// thanks to the SQL here under, you can search on "deco" to find "de coninck" as well

$results = Array();

	$SQL = 'SELECT * FROM logins WHERE '.$logIdsIN.'
		( REPLACE(REPLACE(lastname," ",""),"-","") LIKE "%'.$digits.'%"
		OR REPLACE(REPLACE(firstname," ",""),"-","") LIKE "%'.$digits.'%"
		OR REPLACE(REPLACE(company," ",""),"-","") LIKE "%'.$digits.'%"
		OR REPLACE(REPLACE(login," ",""),"-","") LIKE "%'.$digits.'%"
		OR REPLACE(REPLACE(email," ",""),"-","") LIKE "%'.$digits.'%" )
		LIMIT 50;'; 

$perfReport->peak('logins AC::step 1 complete - session & parameters retrieved.');

$o_dbAccess_logins = new C_dbAccess_logins();
$o_dbAccess_logins->loadMany($SQL);

$perfReport->peak('logins AC::step 2 complete - data loaded.');

echo $nl;
$bank = 'ac'; // destinated to the auto complete register
	echo '<code>';
	echo $o_dbAccess_logins->stream(false, 'autocomp',with_tracking);
	echo '</code>';
	
$perfReport->peak('logins AC::step 3 complete - streamed.');
$perfReport->dropReport();
?>
