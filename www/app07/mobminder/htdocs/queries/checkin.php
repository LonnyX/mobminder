<?php
session_start();
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/chtml.php';
$nl = chr(10);


setCrossSiteCookie($eresa = false);

usleep(rand(10000, 80000)); // bots can read from login/passes validity by measuring the response time of our DB, so we here blur the timeline, see also (*lq01*)
sleep(2);

if(!isset($_POST['l'])) die('You have no access to this script - (ip Banned)');
if(!isset($_POST['p'])) die('You have no access to this script - (ip Banned)');

$login 	= $_POST['l']; $login = substr($login,0,32);
$pass 	= $_POST['p']; $pass = substr($pass,0,32); // prevents SQL injection
$xpectd	= @$_POST['x']; if(!isset($xpectd)) $xpectd = false; else $xpectd = $xpectd|0; // expected level of access


$dS_login = C_dS_login::logon($login, $pass);

if(!$dS_login) { 
	if(!isset($_SESSION['logtrials'])) $_SESSION['logtrials'] = 1; 
		else $_SESSION['logtrials']++;
	
	sleep(2*$_SESSION['logtrials']); // multiple tries using the same session_id will lead to increased wait time (again protection against bots)
	die('0!0!0!0!'.$nl.'no access rights');
	
} else {
	$_SESSION['logtrials'] = 0;
}

	$loginId 		= $dS_login->id;
	$accessLevel 	= $dS_login->accessLevel;

if($xpectd) { 
	if($accessLevel!=$xpectd) 
	die('0!0!0!0!'.$nl.'unexpected access level:'.$accessLevel); 
}
	else switch($accessLevel) {
		case aLevel_admin:
		case aLevel_seller:
		case aLevel_manager:
		case aLevel_supervisor:
		case aLevel_operator:
		case aLevel_eresa:
			break;
		default:
			die('0!0!0!0!'.$nl.'unrecognized access level'); 
}

// keep track of all surfer loginIds that are connected on the calling browser

C_dS_login::checkin($loginId);



// Load keys associated with this login
$keys = new C_dbAccess_accesskey($loginId);
if($keys->count()) {
	$dS_accesskey = $keys->last();
	$key = $dS_accesskey->id;
	$accId = $dS_accesskey->accountId;
}
else {
	$key = 0;
	$accId = 0;
}

// stream some info to client
echo $key.'!'.$loginId.'!'.$accId.'!'.$dS_login->language.'!'.$nl;
echo 'keyId!loginId!accountId!languageCode!'.$nl;

if(0) { // drop additional debug info
	echo 'login:  '.$login.$nl;
	echo 'pass:   '.$pass.$nl;
	echo 'key:   '.$key.$nl;
	echo 'logged yet: '.($yet==true?'YES':'NO').$nl;
	echo 'logged in: '.$_SESSION['loggedIn'].$nl;
	echo 'current: '.$_SESSION['loginId'].$nl;
}
?>