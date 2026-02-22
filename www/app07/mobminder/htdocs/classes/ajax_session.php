<?php

session_set_cookie_params(['SameSite' => 'None']);
session_set_cookie_params(['Secure' => 1]);

$session = session_start(); // if the session file was thrown away by apache, a new EMPTY one has been made just now
require '../../lib_mobphp/chtml.php';


header('Content-Encoding: none');	// 2.
header('Content-Type: text/plain; charset=UTF-8');

// setCrossSiteCookie($eresa = false);
	

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

	if(!isset($_REQUEST['k'])) logoff('#moberr 00003'); // key
	else {
		if(!is_numeric($_REQUEST['k'])) logoff('#moberr 00004');
		if(!strlen($_REQUEST['k']) > 6) logoff('#moberr 00004b');
	}
	if(!isset($_SESSION['e-loggedIn'])) {
		if(!isset($_POST['b'])) logoff('#moberr 00005'); // code baseline No
	}
	
	// let's protect some very returning post parameters
	if(isset($_REQUEST['id'])) 		if(!is_numeric($_REQUEST['id'])) 	logoff('/ajax_session #moberr 00006a');
	if(isset($_REQUEST['lid'])) 	if(!is_numeric($_REQUEST['lid'])) 	logoff('/ajax_session #moberr 00006b');
	
	if(isset($_REQUEST['aid'])) 	if(!is_numeric($_REQUEST['aid'])) 	logoff('/ajax_session #moberr 00006c');
	if(isset($_REQUEST['sid'])) 	if(!is_numeric($_REQUEST['sid'])) 	logoff('/ajax_session #moberr 00006d');
	
	if(isset($_REQUEST['kid'])) 	if(!is_numeric($_REQUEST['kid'])) 	logoff('/ajax_session #moberr 00006e');
	
	if(isset($_REQUEST['archived'])) 		if(!is_numeric($_REQUEST['archived'])) 	logoff('/ajax_session #moberr 00006f');
	
	if(isset($_REQUEST['reservationId'])) 	if(!is_numeric($_REQUEST['reservationId'])) 	logoff('/ajax_session #moberr 00006g');
	
	if(isset($_REQUEST['vid'])) 			if(!is_numeric($_REQUEST['vid'])) 	logoff('/ajax_session #moberr 00006h');
	if(isset($_REQUEST['visitorId'])) 		if(!is_numeric($_REQUEST['visitorId'])) 	logoff('/ajax_session #moberr 00006i');
	
	if(isset($_REQUEST['msgMedium'])) 		if(!is_numeric($_REQUEST['msgMedium'])) 	logoff('/ajax_session #moberr 00006j');
	if(isset($_REQUEST['templateId'])) 		if(!is_numeric($_REQUEST['templateId'])) 	logoff('/ajax_session #moberr 00006k');
	if(isset($_REQUEST['onoff'])) 			if(!is_numeric($_REQUEST['onoff'])) 	logoff('/ajax_session #moberr 00006l');
	
	if(isset($_REQUEST['resourceType'])) 	if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr 00006m');
	if(isset($_REQUEST['resourceId'])) 		if(!is_numeric($_REQUEST['resourceId'])) 	logoff('/ajax_session #moberr 00006n');
	if(isset($_REQUEST['rescId'])) 			if(!is_numeric($_REQUEST['rescId'])) logoff('/ajax_session #moberr 00006o');
	if(isset($_REQUEST['rid'])) 			if(!is_numeric($_REQUEST['rid'])) 	logoff('/ajax_session #moberr 00006p');
	
	if(isset($_REQUEST['deviceType'])) 		if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr 00006q');
	if(isset($_REQUEST['displayMode'])) 	if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr 00006r');
	if(isset($_REQUEST['details'])) 		if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr 00006s');
	
	if(isset($_REQUEST['peerId'])) 		if(!is_numeric($_REQUEST['peerId'])) 	logoff('/ajax_session #moberr 00006t');
	if(isset($_REQUEST['archived'])) 	if(!is_numeric($_REQUEST['archived'])) 	logoff('/ajax_session #moberr 00006u');
	if(isset($_REQUEST['billamount'])) 	if(!is_numeric($_REQUEST['billamount'])) 	logoff('/ajax_session #moberr 00006v');
	
	if(isset($_REQUEST['cssColor'])) 	if(!is_numeric($_REQUEST['cssColor'])) 	logoff('/ajax_session #moberr 00006w');
	if(isset($_REQUEST['cssPattern'])) 	if(!is_numeric($_REQUEST['cssPattern'])) 	logoff('/ajax_session #moberr 00006x');
	
	if(isset($_REQUEST['days'])) 	if(!is_numeric($_REQUEST['days'])) 	logoff('/ajax_session #moberr 00006x');
	if(isset($_REQUEST['fulldays'])) 	if(!is_numeric($_REQUEST['fulldays'])) 	logoff('/ajax_session #moberr 00006x');
	
	
	
	if(isset($_REQUEST['cssTags'])) if(!exlamationsplitinteger($_REQUEST['cssTags'])) logoff('/ajax_session #moberr 00009a');
	
	if(isset($_REQUEST['bCals'])) if(!exlamationsplitinteger($_REQUEST['bCals'])) logoff('/ajax_session #moberr 00009b');
	if(isset($_REQUEST['uCals'])) if(!exlamationsplitinteger($_REQUEST['uCals'])) logoff('/ajax_session #moberr 00009c');
	if(isset($_REQUEST['fCals'])) if(!exlamationsplitinteger($_REQUEST['fCals'])) logoff('/ajax_session #moberr 00009d');
	
	if(isset($_REQUEST['visitors'])) if(!exlamationsplitinteger($_REQUEST['visitors'])) logoff('/ajax_session #moberr 00009e');
	if(isset($_REQUEST['workcodes'])) if(!exlamationsplitinteger($_REQUEST['workcodes'])) logoff('/ajax_session #moberr 00009f');
	if(isset($_REQUEST['resources'])) if(!exlamationsplitinteger($_REQUEST['resources'])) logoff('/ajax_session #moberr 00009g');
	if(isset($_REQUEST['rscrIds'])) if(!exlamationsplitinteger($_REQUEST['rscrIds'])) logoff('/ajax_session #moberr 00009h');
	if(isset($_REQUEST['tboxing'])) if(!exlamationsplitinteger($_REQUEST['tboxing'])) logoff('/ajax_session #moberr 00009i');
	
	if(isset($_REQUEST['lognIds'])) if(!exlamationsplitinteger($_REQUEST['lognIds'])) logoff('/ajax_session #moberr 00009j');
	if(isset($_REQUEST['coloIds'])) if(!exlamationsplitinteger($_REQUEST['coloIds'])) logoff('/ajax_session #moberr 00009k');
	if(isset($_REQUEST['pattIds'])) if(!exlamationsplitinteger($_REQUEST['pattIds'])) logoff('/ajax_session #moberr 00009l');
	if(isset($_REQUEST['tagsIds'])) if(!exlamationsplitinteger($_REQUEST['tagsIds'])) logoff('/ajax_session #moberr 00009m');
	


	function exlamationsplitinteger(string $str, string $sep = '!'): bool {
		$str = trim($str);
		if($str === '') return true;
		if($str === '-') return true;
		$parts = explode($sep, $str);
		foreach($parts as $p) {
			if(!is_numeric($p)) {
				echo('exlamationsplitinteger('.$p.'/'.$str.')');
				return false;
			}
		}
		return true;
	}

	function exlamationdoublesplitinteger(string $str, string $sep = '!', string $innersep = ','): bool {
		$str = trim($str); // in which $str is something like '2200027,3!2200028,2'
		if($str === '') return true;
		if($str === '-') return true;
		$parts = explode($sep, $str); // now splitting on the exlamation point
		foreach($parts as $p) { // in which p is something like '2200028,2'
			$psplit = explode($innersep, $p); // now splitting on the coma
			$prdid = $psplit[0];
			$quant = $psplit[1];
			if(!is_numeric($prdid)) {
				echo('exlamationdoublesplitinteger('.$p.'/'.$str.' product id wrong)');
				return false;
			}
			if(!is_numeric($quant)) {
				echo('exlamationdoublesplitinteger('.$p.'/'.$str.' quantity wrong)');
				return false;
			}
		}
		return true;
	}

	
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SECURITY: Checking for SQL injection
//

require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/mblox.php';
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';


$test = SQLinjectionScreen($_POST);
if($test) die('you are banned <command>logoff</command> ('.$test.')');


if(!isset($_SESSION['e-loggedIn'])) {
	
	$baseline = C_dS_system::baseline(); // web app software baseline check
	if($_POST['b']!=$baseline) die('Your baseline is outdated <command>reload</command>');  // see (*bl01*)
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
			$vc = $view_resources->count(); // view count, used a lot but an example is here (*fd01*)
			
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
	if(session_id()) session_write_close();
	
	echo chr(10).'Closing connection.'.chr(10);
    $fb = ob_get_contents(); $fl = strlen($fb); // collect, measure and closes ob1, see (*ob1)
    ob_end_clean();
	
	ob_start(); // use a new bufer, ob2
    ignore_user_abort(true); 
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb; // flush has no effect if the buffer is not 4k at least

	// flush all output// 3
	ob_end_flush(); ob_flush(); flush(); // serve client with the content of ob2
	ob_start(); // ob3 catches any subsequent echo, that we will hence never flush to the client
	echo chr(10).'Connection closed (You never see this message)';
}




?>