<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    G R O U P S
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

	$loggedIn = $_SESSION['loggedIn']; 	// list of logged in logins
	session_write_close(); 
	
if($dS_login->accessLevel==aLevel_admin) { // you see all connections on the system
	
	// $q = new Q('SELECT id FROM groups;'); $groupIds = $q->ids();
	$groupIdsIN = '';
	echo 'admin level search'.$nl;

} else { // you see only connections relating to groups for which connected logins have access keys


	$o_dbAccess_akeys = new C_dbAccess_accesskey($loggedIn);
		$accountIds = $o_dbAccess_akeys->getList('accountId');
		
	echo 'limited scope search for logins:'.$loggedIn.$nl.'accounts:'.$accountIds.$nl;
	
	$groupIdsIN = 'id IN('.$accountIds.') AND ';
}

// retrieve and filter input digits 

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

$exactname = false;
$digits = strtolower($_POST['digits']);

echo 'searching on digits:'.$digits.$nl;

if(substr($digits,-1)=='.') { // then we need to return persons having this exact name
	$exactname = true;
	$digits = rtrim($digits,'.');
}

$digits = preg_replace("/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.,a-z A-Z0-9-\'\/\(\)]/si",'',$digits); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""

// spaces are removed so you can search on "de co" to find "de coninck"
// thanks to the SQL here under, you can search on "deco" to find "de coninck" as well

$results = Array();

if($exactname)  // uses another SQL, matching the exact name required
	$SQL = 'SELECT * FROM groups WHERE '.$groupIdsIN.' REPLACE(REPLACE(name," ",""),"-","") = "'.$digits.'" LIMIT 50;'; 
	
else // use an SQL looking through names
	$SQL = 'SELECT * FROM groups WHERE '.$groupIdsIN.'
		( REPLACE(REPLACE(name," ",""),"-","") LIKE "%'.$digits.'%" 
			OR email LIKE "%'.$digits.'%")
		LIMIT 50;'; 

$perfReport->peak('groups AC::step 1 complete - session & parameters retrieved.');

$o_dbAccess_groups = new C_dbAccess_groups();
$o_dbAccess_groups->loadMany($SQL);

$perfReport->peak('groups AC::step 2 complete - data loaded.');

echo $nl;
$bank = 'ac'; // destinated to the auto complete register
	echo '<code>';
	// echo $o_dbAccess_groups->stream(false, $bank);
	echo $o_dbAccess_groups->stream(false,false,with_tracking);
	echo '</code>';
	
$perfReport->peak('groups AC::step 3 complete - streamed.');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>
