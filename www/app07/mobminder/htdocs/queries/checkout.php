<?php
//////////////////////////////////////////////////////////////////////
//
//     U N - L O G S    T H E    G I V E N     L O G I N
//
session_start();
require '../../lib_mobphp/dbio.php';


if(!isset($_POST['r'])) die('You have no access to this script');
if(!is_numeric($_POST['r'])) die('You have again no access to this script');
$remove = $_POST['r']+0;


// Treat the currently list of logged users from the calling browser
if(!isset($_SESSION['loggedIn'])) $loggedIn = Array(); // from scratch session
	else if($_SESSION['loggedIn']=='') $loggedIn = Array(); // from close all
		else $loggedIn = explode(',', $_SESSION['loggedIn']); // from some logged yet


// Archive connections
//
if($remove==0) { // close all connections
	if(count($loggedIn)) foreach($loggedIn as $lid)
		C_dS_connection::close($lid);
} else
	C_dS_connection::close($remove); // close that connection that was selected by the user
		

// Defines if any remaining login is on this session
//
$loginId = 0; // contains the loginId of the next in list connected surfer (on this session), or zero if all surfers got disconnected

if($remove==0) $loggedIn = Array(); // => remove all from the list, loginId remains equal to zero
else 
	if(in_array($remove,$loggedIn)) { // remove one from the list
		foreach($loggedIn as $x => $id) if($id == $remove) break; 
		array_splice($loggedIn, $x, 1);
		if(count($loggedIn)) $loginId = $loggedIn[0]; 
	}
$_SESSION['loggedIn'] = implode(',',$loggedIn);


// keep track of all surfer loginIds that are connected on the calling browser
if($loginId) {
	$_SESSION['loginId'] = $loginId;
	
	// Load keys associated with this login
	$keys = new C_dbAccess_accesskey($loginId);
	$key = $keys->last()->id;
	
} else { // no remaining open connection
	$_SESSION['loginId'] = 0;
	$_SESSION['keyId'] = 0; // needed, see (*55*)
	$_SESSION['loggedIn'] = '';
	$key = 0;
}



// verbose on status
echo $key.'!'.chr(10); // payload, subsequent verbose might follow
echo 'remove: '.($remove==-1?'all':($remove==0?'none':$remove)).chr(10);
echo 'logged in: '.$_SESSION['loggedIn'].chr(10);
echo 'current: '.$_SESSION['loginId'].chr(10);
?>