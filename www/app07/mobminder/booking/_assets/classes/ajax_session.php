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

setCrossSiteCookie();

function logoff($reason) {
	die('sorry ('.$reason.') <command>logoff</command>');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SECURITY: Checking session and presence of required session variables	
//
	if(!$session) logoff('#moberr eresa00001'); // system problem opening the session file
	if(!isset($_SESSION['loggedIn'])) 
		if(!isset($_SESSION['e-loggedIn']))
			logoff('#moberr eresa00002'); // new session file, while we expect to be logged

	if(!isset($_REQUEST['k'])) logoff('#moberr eresa00003');
	else {
		if(!is_numeric($_REQUEST['k'])) logoff('#moberr eresa00004');
		if(!strlen($_REQUEST['k']) > 6) logoff('#moberr eresa00004b');
	}
	if(!isset($_SESSION['e-loggedIn'])) {
		if(!isset($_POST['b'])) logoff('#moberr eresa00005');
	}

	// let's protect some very returning post parameters
	if(isset($_REQUEST['id'])) 		if(!is_numeric($_REQUEST['id'])) 	logoff('/ajax_session #moberr eresaeresa00006a');
	if(isset($_REQUEST['lid'])) 	if(!is_numeric($_REQUEST['lid'])) 	logoff('/ajax_session #moberr eresaeresa00006b');
	
	if(isset($_REQUEST['aid'])) 	if(!is_numeric($_REQUEST['aid'])) 	logoff('/ajax_session #moberr eresaeresa00006c');
	if(isset($_REQUEST['sid'])) 	if(!is_numeric($_REQUEST['sid'])) 	logoff('/ajax_session #moberr eresaeresa00006d');
	
	if(isset($_REQUEST['kid'])) 	if(!is_numeric($_REQUEST['kid'])) 	logoff('/ajax_session #moberr eresa00006e');
	if(isset($_REQUEST['gid'])) 	if(!is_numeric($_REQUEST['kid'])) 	logoff('/ajax_session #moberr eresa00006e');
	
	if(isset($_REQUEST['archived'])) 		if(!is_numeric($_REQUEST['archived'])) 	logoff('/ajax_session #moberr eresa00006f');
	
	if(isset($_REQUEST['reservationId'])) 	if(!is_numeric($_REQUEST['reservationId'])) 	logoff('/ajax_session #moberr eresa00006g');
	
	if(isset($_REQUEST['vid'])) 		if(!is_numeric($_REQUEST['vid'])) 	logoff('/ajax_session #moberr eresa00006h');
	if(isset($_REQUEST['visitorId'])) 	if(!is_numeric($_REQUEST['visitorId'])) 	logoff('/ajax_session #moberr eresa00006i');
	
	if(isset($_REQUEST['msgMedium'])) 	if(!is_numeric($_REQUEST['msgMedium'])) 	logoff('/ajax_session #moberr eresa00006j');
	if(isset($_REQUEST['templateId'])) 	if(!is_numeric($_REQUEST['templateId'])) 	logoff('/ajax_session #moberr eresa00006k');
	if(isset($_REQUEST['onoff'])) 		if(!is_numeric($_REQUEST['onoff'])) 	logoff('/ajax_session #moberr eresa00006l');
	
	if(isset($_REQUEST['resourceType'])) if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr eresa00006m');
	if(isset($_REQUEST['resourceId'])) 	if(!is_numeric($_REQUEST['resourceId'])) 	logoff('/ajax_session #moberr eresa00006n');
	if(isset($_REQUEST['rescId'])) 		if(!is_numeric($_REQUEST['rescId'])) logoff('/ajax_session #moberr eresa00006o');
	if(isset($_REQUEST['rid'])) 		if(!is_numeric($_REQUEST['rid'])) 	logoff('/ajax_session #moberr eresa00006p');
	
	if(isset($_REQUEST['deviceType'])) 	if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr eresa00006q');
	if(isset($_REQUEST['displayMode'])) if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr eresa00006r');
	if(isset($_REQUEST['details'])) 	if(!is_numeric($_REQUEST['resourceType'])) 	logoff('/ajax_session #moberr eresa00006s');
	
	if(isset($_REQUEST['peerId'])) 		if(!is_numeric($_REQUEST['peerId'])) 	logoff('/ajax_session #moberr eresa00006t');
	if(isset($_REQUEST['archived'])) 	if(!is_numeric($_REQUEST['archived'])) 	logoff('/ajax_session #moberr eresa00006u');
	if(isset($_REQUEST['billamount'])) 	if(!is_numeric($_REQUEST['billamount'])) 	logoff('/ajax_session #moberr eresa00006v');
	
	if(isset($_REQUEST['cssColor'])) 	if(!is_numeric($_REQUEST['cssColor'])) 	logoff('/ajax_session #moberr eresa00006w');
	if(isset($_REQUEST['cssPattern'])) 	if(!is_numeric($_REQUEST['cssPattern'])) 	logoff('/ajax_session #moberr eresa00006x');
	
	
	
	if(isset($_REQUEST['cssTags'])) if(!exlamationsplitinteger($_REQUEST['cssTags'])) logoff('/ajax_session #moberr eresa00009a');
	
	if(isset($_REQUEST['bCals'])) if(!exlamationsplitinteger($_REQUEST['bCals'])) logoff('/ajax_session #moberr eresa00009b');
	if(isset($_REQUEST['uCals'])) if(!exlamationsplitinteger($_REQUEST['uCals'])) logoff('/ajax_session #moberr eresa00009c');
	if(isset($_REQUEST['fCals'])) if(!exlamationsplitinteger($_REQUEST['fCals'])) logoff('/ajax_session #moberr eresa00009d');
	
	if(isset($_REQUEST['visitors'])) if(!exlamationsplitinteger($_REQUEST['visitors'])) logoff('/ajax_session #moberr eresa00009e');
	if(isset($_REQUEST['workcodes'])) if(!exlamationsplitinteger($_REQUEST['workcodes'])) logoff('/ajax_session #moberr eresa00009f');
	if(isset($_REQUEST['tboxing'])) if(!exlamationsplitinteger($_REQUEST['tboxing'])) logoff('/ajax_session #moberr eresa00009g');
	

	function exlamationsplitinteger(string $str, string $sep = '!'): bool {
		$str = trim($str);
		if($str === '') return true;
		if($str === '-') return true;
		$parts = explode($sep, $str);
		foreach($parts as $p) {
			//    replace with  ^(?:0*[1-9][0-9]*)$ to authorize heading zeroes.
			if (!preg_match('/^[1-9][0-9]*$/', $p)) {
				return false;
			}
		}
		return true;
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
	$o_dS_group->name = 'NEW NEW';
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

function fieldcleanup(&$item, $fname) { // field by field checkup on allowed characters


	$exclude_always 	= '/[|<>\\#"]/u'; 
		// those characters are never allowed in our system : 
		// pipes |  , due to our api data format interface
		// smaller bigger < > , can insert HTML js scritps or links or html inside our HTML rendering
		// backslash \  , allows to point subfolders
		// hashtags #
		// 
	
	$filter_address 	= '/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.,a-z A-Z0-9-\'\/\(\)]/';
	$filter_name 		= '/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.a-z A-Z0-9-\'\(\)]/';
	$filter_resource 	= '/[^_!\.a-zA-Z0-9-]/';
	$filter_email 		= '/[^@\._a-zA-Z0-9-]/';
	$filter_stamp 		= '/[^ 0-9-:]/';
	$filter_birthday 	= '/[^0-9-: ]/'; // allows ISO8601 time stamp like "1970-12-30 22:45:12"
	$filter_phone 		= '/[^0-9+]/';
	$filter_zip 		= '/[^a-zA-Z0-9]/';

	$filter_note 		= '/[^#_ÀàâãçËÈÉéèëêôöîïñûüùÿ@ A-Za-z0-9+€&:;,!=\n\*\?\/\'\"\.\(\)\[\]\-\\\]/'; // note 
	
	// note https://stackoverflow.com/questions/11044136/right-way-to-escape-backslash-in-php-regex
	//if($item=='NULL') $item = ''; // nice joke from ATX DB extracts
	
	$item = preg_replace($exclude_always,'',$item);
	
	switch($fname) {
		
		case 'address':
			$item = substr($item,0,64);
			return preg_replace($filter_address,'',$item);
		case 'city': 
			$item = substr($item,0,32);
			return preg_replace($filter_address,'',$item);
		case 'country': 
			$item = substr($item,0,32);
			return preg_replace($filter_address,'',$item);
			
		case 'mobile':
			$item = substr($item,0,32);
			return preg_replace($filter_phone,'',$item); break;
		case 'phone': 
			$item = substr($item,0,32);
			return preg_replace($filter_phone,'',$item); break;
			
		case 'zipCode': 
			$item = substr($item,0,8);
			return preg_replace($filter_zip,'',$item);
		case 'lastname':
			$item = substr($item,0,64);
			return preg_replace($filter_name,'',$item);
		case 'firstname': 
			$item = substr($item,0,64);
			return preg_replace($filter_name,'',$item);
		case 'birthday': 
			$bd = preg_replace($filter_birthday,'',$item); // can be 1970-12-30 or 19701230
			if(!is_numeric($bd)) {
				if(strlen($bd)>=10) if($bd[4]=='-'&$bd[7]=='-') $bd = substr($bd,0,4).substr($bd,5,2).substr($bd,8,2);
			}
			if($bd=='19010101' || $bd=='') return '0'; else return $bd;
			break;
		case 'email':
			$item = substr($item,0,64);
			$item = strtolower($item);
			return preg_replace($filter_email,'',$item);
		case 'note':
			$item = substr($item,0,1024);
			return preg_replace($filter_note,'',$item);
			//return $item;
		default:
			return $item;
	}
};

function fieldscleaner(&$array) // all fields checkup on allowed characters
{ 
	if(count($array))
	{
		foreach($array as $pname => &$pvalue) 
		{
			$screened = fieldcleanup($pvalue, $pname);
			if(strcmp($screened,$pvalue)) 
			{
				//warning('fieldscleaner::'.$pvalue.' has been reduced to '.$screened);
				$pvalue = $screened;
			}
		}
	}
}


?>