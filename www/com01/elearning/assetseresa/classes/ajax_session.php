<?php


// session_set_cookie_params(['SameSite' => 'None']);
// session_set_cookie_params(['Secure' => 1]);

$session = session_start(); // if the session file was thrown away by apache, a new EMPTY one has been made just now
//require '../classes/chtml.php';
//require '../classes/chtml.php';



require '../../../../mobminder/lib_mobphp/chtml.php';

// session_set_cookie_params(3600*20, '/;SameSite=None', $_SERVER['HTTP_HOST'], true); // only from PHP 7.3

header('Content-Encoding: none');	// 2.
header('Content-Type: text/plain; charset=UTF-8');

setCrossSiteCookie($eresa = false);

function logoff($reason) {
	die('sorry ('.$reason.') <command>logoff</command>');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SECURITY: Checking session and presence of required session variables	
//
	if(!$session) logoff('#moberr 00001'); // system problem opening the session file
	if(!isset($_SESSION['loggedIn'])) 
		if(!isset($_SESSION['e-loggedIn']))
			logoff('#moberr 00002'); // new session file, while we expect to be logged

	if(!isset($_REQUEST['k'])) logoff('#moberr 00003');
	else {
		if(!is_numeric($_REQUEST['k'])) logoff('#moberr 00004');
		if(!strlen($_REQUEST['k']) > 6) logoff('#moberr 00004b');
	}
	if(!isset($_SESSION['e-loggedIn'])) {
		if(!isset($_POST['b'])) logoff('#moberr 00005');
	}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SECURITY: Checking for SQL injection
//

// require '../classes/dbio.php';
// require '../classes/mblox.php';
// require '../classes/smsgateaway.php';
// require '../classes/comm.php';

require '../../../../mobminder/lib_mobphp/dbio.php';
require '../../../../mobminder/lib_mobphp/mblox.php';
require '../../../../mobminder/lib_mobphp/smsgateaway.php';
require '../../../../mobminder/lib_mobphp/comm.php';

$test = SQLinjectionScreen($_POST);
if($test) 
{
	//foreach ($_POST as $key=>$val) echo '$_POST['.$key."] = ".$val."<br/>";
	die('you are banned <command>logoff</command> ('.$test.')');
}


if(!isset($_SESSION['e-loggedIn'])) {
	
	$baseline = C_dS_system::baseline(); // web app software baseline check
	if($_POST['b']!=$baseline) die('Your baseline is not up to date <command>reload</command>');  // see (*bl01*)
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  SECURITY: Matching provided key with logged in logins
// 
$keyId = $_REQUEST['k'];

if($keyId==='x') { // no context logged on at client side, check (*ck*)
	
	die('napping... '); // do nothing, the watchdog calls us but no one is logged at client side
	
} else if($keyId==0) { // new account request
 
 
	if(!isset($_SESSION['loginId'])) die('You have no access to this script');
	
	$loginId = $_SESSION['loginId'];
	$dS_login = new C_dS_login($loginId);
	if($dS_login->accessLevel < aLevel_seller) die('No access rights for this operation');
	
	$groupId = $loginId; // the new account will belong to this seller/admin
		
	// create an account
	$o_dS_group = new C_dS_group(0, $groupId);
	$o_dS_group->language = $dS_login->language;
	$o_dS_group->name = "NEW NEW";
	$o_dS_group->dSsave();

	// create a key, attach it to the current login
	$o_dS_accesskey = new C_dS_accesskey();
		$o_dS_accesskey->groupId = $loginId;
		$o_dS_accesskey->accountId = $o_dS_group->id;
		$o_dS_accesskey->dSsave();
	$keyId = $o_dS_accesskey->id;

	$accountId = $o_dS_group->id;
	
	// create a default environment that makes this account easier to start with
	
	// Colors / patterns / tags
		$css = array();
		
		// appointments
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_color, 	'css' => 110, 	'name' => 'new patient' );
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_color, 	'css' => 237, 	'name' => 'emergency' );
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_color, 	'css' => 171, 	'name' => 'delegate' );
		
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_pattern, 'css' => 800, 	'name' => 'PVPP' );
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_pattern, 'css' => 812, 	'name' => 'Excused' );
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_pattern, 'css' => 807, 	'name' => 'to be followed' );
		$css[] = array( 'resaClass' => class_resa_appointment, 'cssType' => class_cssType_pattern, 'css' => 803, 	'name' => 'followed ok' );
		
		// events
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_color 		, 'css' => 153, 'name' => 'training' );
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_color 		, 'css' =>  99, 'name' => 'private' );
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_color 		, 'css' => 163, 'name' => 'holiday' );
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_color 		, 'css' => 103, 'name' => 'vacation' );
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_color 		, 'css' => 237, 'name' => 'for emergency' );
		
		$css[] = array( 'resaClass' => class_resa_event, 'cssType' => class_cssType_pattern 	, 'css' => 900, 'name' => 'validated' );
		
		// visitors
		$css[] = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_color, 'css' => 111, 	'name' => 'black list' 		);
		$css[] = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_color, 'css' => 103, 	'name' => 'PVPP' 			);
		$css[] = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_color, 'css' => 254, 	'name' => 'chronicaly late' );
		
		$css[] = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_pattern, 	'css' => 912, 'name' => 'Referent' );
		
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1011, 'name' => 'PMR' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1057, 'name' => 'allergies' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1027, 'name' => 'read note' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1026, 'name' => 'psy' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1016, 'name' => 'smoker' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1003, 'name' => 'child' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1006, 'name' => 'referent' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1015, 'name' => 'addiction' );
		$css[]  = array( 'resaClass' => class_visitor, 'cssType' => class_cssType_tag, 	'css' => 1017, 'name' => 'weight prob' );
	
		foreach($css as $cssIdx => $cssPreset) {
			$o_dS_customCss = new C_dS_customCss(-1, $accountId, $cssPreset ); $o_dS_customCss->dSsave();
		}
	
	
} else { // logged on a given account
	
	if(!is_numeric($keyId)) logoff('#moberr 00015');
	if(strlen($keyId)>6) logoff('#moberr 00015b');   // net security
		
	// You open a session using an existing key
	//
	$o_dS_accesskey = new C_dS_accesskey($keyId);
	if(!$o_dS_accesskey->id) logoff('#moberr 00016'); // Wrong Access key
	$loginId = $o_dS_accesskey->groupId; // access keys group to a login
	
	// check if the login associated with this key has checked in
	//
	$yet = false;
	if(isset($_SESSION['loggedIn'])) { // When accessing e-resa only from a browser, this one loggedIn is not defined
		$loggedIn = explode(',', $_SESSION['loggedIn']);
		$yet = in_array($loginId, $loggedIn);
	}
	if(!$yet) { // The given key may then belong to an e-resa login, listed in e-loggedIn
		if(isset($_SESSION['e-loggedIn'])) {
			$loggedIn = explode(',', $_SESSION['e-loggedIn']);
			$either = in_array($loginId, $loggedIn);
			if(!$either) 
				logoff('#moberr 00017'); // not checked in (1)
		} else
			logoff('#moberr 00018'); // not checked in (2)
	}

	$accountId = $o_dS_accesskey->accountId;
	if(!$accountId) logoff('#moberr 00019'); // Account was not identified

	// keep track of what account is currently logged
}

	$_SESSION['loginId'] 	= $loginId;
	$_SESSION['keyId'] 		= $keyId; // needed in case of reload, see (*55*)

	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Loading some account context objects
//

$nl = chr(10);	// intended for (browser dev console) debug display at client side 
$tab = '          ';

if(isset($loadcontext)) {
	
	if($loadcontext) { // then preload the casual minimum set of account context data

		$dS_login = new C_dS_login($loginId);
		$dS_account = new C_dS_group($accountId);
		$dS_accesskey = new C_dS_accesskey($keyId);

		if($dS_accesskey->groupId != $dS_login->id) 	logoff('#moberr 00020'); // Access key does not match login
		if($dS_accesskey->accountId != $dS_account->id) logoff('#moberr 00021'); // Access key does not match account
	
	} 
	if($loadcontext >= 2) { // then also preload account resources
	
		$account_resources 	= new C_dbAccess_resources($accountId); // all account resources including the ones not in this login's view
		$view_resources 	= new C_dbAccess_resources($accountId, $dS_accesskey); // resources as seen by the login's limited view
		
			$rc = $account_resources->count();
			$vc = $view_resources->count();
			
		$is_single_account = $rc==1;
		$is_single_view = $vc==1;
		$is_limited_view = $rc>$vc;
		$is_full_view = $rc==$vc;
		$acc_rscs_cnt = $rc;
		$view_rscs_cnt = $vc;
		$view_rscs_ids_clist = $view_resources->viewIds ? $view_resources->viewIds : $view_resources->getIdsList();

	}
	if($loadcontext >= 3) { // then also preload account logins

		 
		$q = new Q('SELECT DISTINCT id, groupId FROM accesskeys WHERE accountID = '.$accountId.';');
		$grantedAckeyIds = $q->ids(); // access keys group to logins
		$grantedLoginIds = $q->groupIds(); // access keys group to logins
		
		$q = new Q('SELECT id FROM logins WHERE id IN ('.$grantedLoginIds.') AND accessLevel = '.aLevel_synchro.';');
		$hasSync = $q->ids();
	}
}


function supervised() { // this function checks if an admin is logged (some risky DB operations require that an admin be logged)
	
	$o_dbAccess_loggedin = new C_dbAccess_logins();
	$o_dbAccess_loggedin->loadOnId($_SESSION['loggedIn']);
	foreach($o_dbAccess_loggedin->keyed as $lid => $dS_login) 
		if($dS_login->accessLevel == aLevel_admin) return true;
	return false;
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Closing connection with calling client
//
//  This is used in some script to avoid the KEEP_ALIVE to maintain numerous 
//  apache2 childs working for the default KEEP_ALIVE time.
//

//   >>>>>>  ob_start();  // this instruction MUST stand before any echo proceeds from the script (*ob1)
	
function closeconnection($tempo = false) { // $tempo in milliseconds, 50 for 50ms

	if($tempo) usleep(1000*$tempo);
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	//
	// dev note 2019-10/pvh: a simpler version of this connection closing method are working on the dev environment, but do not on the server!!
	// in order to get the stuff working, here is what I did :
	// 1. add ob_start(); after ob_end_clean();
	// 2. add header('Content-Encoding: none');
	// 3. add ob_end_flush(); ob_flush();
	//
	if(session_id()) session_write_close();
	
    $fb = ob_get_contents(); $fl = strlen($fb); $filler = ''; if((4096-$fl)>0) $filler = str_repeat('1',4096-$fl);
    ob_end_clean(); // relates to (*ob1)
	
	ob_start(); // 1.
    ignore_user_abort(true); 
	// header('Content-Encoding: none'); // those 2 lines have moved to the top of the file (they apply to any request)
    // header('Content-Type: text/plain; charset=UTF-8'); // should may be header('Content-Type: text/plain; charset=UTF-8');
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb.$filler; // flush has no effect if the buffer is not 4k at least

	// flush all output
	ob_end_flush(); // 3.
	ob_flush();
	flush();
	ob_start(); // catch any subsequent echo, that we will never flush to client
}





?>