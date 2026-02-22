<?php
require './../lib_mobphp/chtml.php';
require './../lib_mobphp/dbio.php';
require './../lib_mobphp/geocheck.php';

// ini_set('session.cookie_samesite', 'None'); 

session_start();

setCrossSiteCookie($eresa = false);

// session_set_cookie_params(3600*20, '/;SameSite=None', $_SERVER['HTTP_HOST'], true); // only from PHP 7.3



$html = new C_html();

$baseline = C_dS_system::baseline();
$html->pushLink('themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');
$html->pageTitle('mobminder');

// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushMeta('format-detection'		, 'date=no');

$html->pushMetaName('mobile-web-app-capable', 'yes'); // check this page: https://web.archive.org/web/20151103001838/http://www.luster.io/blog/9-29-14-mobile-web-checklist.html
$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'translucent-black'); // does not always work... TBI
$html->pushMetaName('apple-mobile-web-app-title', 'Mobminder');
$html->pushMetaName('viewport', 'width=device-width,height=device-height,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
$html->pushMetaName('cleartype', 'on'); // turn cleartype on in IE-based browsers so that text in your mobile app looks nicer on the small screen
$html->pushMetaName('robots', 'noindex');

// css
$html->pushLink('themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/controls.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/planning.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/mobminder.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');


// browser compatibility
if(isset($_SERVER['HTTP_USER_AGENT']))
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) die($html->sorryForMSIE()->dropPage());


// framework
$html->pushScriptInclude('text/javascript', 'jquery/jquery-3.2.1.js'); // may 2014, no support for IE 6, 7
$html->pushScriptInclude('text/javascript', 'jquery/qrcodes/jquery-qrcode.js');
$html->pushScriptInclude('text/javascript', 'jquery/qrcodes/mobqrcodelib.js');
$html->pushScriptInclude('text/javascript', 'jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', 'jscripts/iscroll.52.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', 'jscripts/mobframe.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', 'jscripts/language.js?b='.$baseline); // should be kept under mobframe.js because it uses the general mobminder. variable
$html->pushScriptInclude('text/javascript', 'jscripts/datasets.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', 'jscripts/controls.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', 'jscripts/planning.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', 'jscripts/modals.js?b='.$baseline);

// attach the js that is specific to this page
$html->pushScriptInclude('text/javascript', 'jscripts/mobminder.js?b='.$baseline);

	// check the API auto-login option. Usage: fr.mobminder.com/index.php?kid=9769&lid=8377&aid=2991
	$keyId = @$_GET['kid'];
	$loginId = @$_GET['lid'];
	$accountId = @$_GET['aid'];
	$calledid = @$_GET['calledid']; // phone number assigned to this account, by the call center

	if($keyId) if(!is_numeric($keyId)) { sleep(2); die('wrong key, please contact your administrator'); }// protection against SQL injection
	if($loginId) if(!is_numeric($loginId)) { sleep(2); die('wrong login id, please contact your administrator'); }
	
	if(isset($accountId)) if(!is_numeric($accountId)) { sleep(2); die('wrong account id, please contact your administrator'); }
	if(isset($calledid)) if(!is_numeric($calledid)) { sleep(2); die('wrong calledid, please contact your administrator'); }

	// if(!isset($calledid)&&!isset($accountId)) { sleep(2); die('calledid or accountId, please contact your administrator'); }

if($keyId && $loginId && $accountId) { // AUTO LOGIN: check the coherence of the 3 parameters
	
	//    A U T O    L O G I N  // http://localhost/app07/mobminder/htdocs/index.php?aid=3008&lid=15847&kid=27154
	//
		$q = new Q('SELECT groupId, accountId FROM accesskeys WHERE id="'.$keyId.'";');
	
	if(!$q->cnt()) die('0!0!No access rights (1)'); // the given keyId doesn't exists
	$foundLoginId = $q->mlist('groupId'); 
	$foundAccountId = $q->mlist('accountId'); 
	if($loginId != $foundLoginId) { sleep(2); die('0!0!No access rights (2)'); } // access keys are grouped by loginId
	if($accountId != $foundAccountId) { sleep(2); die('0!0!No access rights (3)'); } // access keys indicate the accountId they open

	// open a session to the account
	C_dS_login::checkin($loginId);
	$dS_login = new C_dS_login($loginId);
	
	sleep(1);
	
} else { 	// PAGE RELOAD: The user has already logged-in, $_SESSION['keyId'] exists, 
	
	$keyId = isset($_SESSION['keyId']) ? $_SESSION['keyId'] : 0; // reload case <= should reload the current account, thanks to the tab focus call tabfocus.php, see(*55*)
	
	if($keyId) {
		
		$q = new Q('SELECT count(1) FROM accesskeys WHERE id="'.$keyId.'";');
		if($q->cnt()!=1) die('0!0!No access rights (4)');
		
		$dS_accesskey = new C_dS_accesskey($keyId);
		if($calledid) { // if you specify the call center assigned number iso aid / accountid, still we can connect to the right account using call center phone (ccphone)
			$q = new Q('SELECT id FROM groups WHERE ccphone="'.$calledid.'" limit 1;');
			if($aid = $q->ids()) $accountId = $aid;
			else $accountId = 0;
		}
		if($accountId) { 
		
			//    S W I T C H     T O     A N O T H E R     A C C O U N T   using &aid=digits OR &calledid=digits
			//
			// possible only when you are already logged with a valid key, 
			// and possible only for an account for which you have access granted
			
			$q = new Q('SELECT id, accountId FROM accesskeys WHERE groupId="'.$dS_accesskey->groupId.'" and accountId='.$accountId.';');
			
			if($q->cnt()!=1) { // trying to switch to an account that does not belong to the granted wallet
			
				$_SESSION['loginId'] = 0; // reset all connexions
				$_SESSION['keyId'] = 0; // needed, see (*55*)
				$_SESSION['loggedIn'] = '';
				header("Location: ./index.php"); // gracefull redirection to the login page
			}
			
			$keyId = $q->ids(); // which is only one key that relates to the accountId to which we switch to.
			
		} else {
			
			//    R E L O A D 
			//
			// start the client side based on currently logged key
			
			sleep(1);
		}
		$dS_login = new C_dS_login($dS_accesskey->groupId);
	}
}


if($keyId) { // check that this key has the minimum required access level		
	// solves the login on an e-resa page (link found via google) followed by a call on be.mobminder.com 
	// that would open the account related to the e-resa link! which is not allowable
	if($dS_login->accessLevel < aLevel_operator) $keyId = 0; 

} else {
	
	// $keyId = 0, this is a fresh call to the index.php with no session opened. 
}


// visitor digits can be passed so that a visitor auto-complete is launched from this page call
//
// The following link implements auto-login + visitors calling number digits
//
// http://localhost/wepapp/index.php?aid=4161&lid=17765&kid=30977&vdg=401626
// 
//
// For call centers integration, the auto-login should not be implemented
//
// Call http://localhost/webapp/index.php?aid=3044&vdg=401626   (Pascal's wallet, Sophie Jacques)
// Switch to http://localhost/webapp/index.php?aid=2836&vdg=401626  (Pascal's wallet, Dentiste Dumont)
//
// In this case, if the operator did not login, he is invited to log-in on first call
//

if(isset($_GET['callerid'])) $vdigits = $_GET['callerid'];
else $vdigits = @$_GET['vdg'];
if(!isset($vdigits)) $vdigits = 'false'; // http://127.0.0.1/index.php?aid=3044&lid=7875&kid=11051&vdg=401626 will start a visitor search on 401626
else {
	if($vdigits) { // avoids &vdg='' input
		if(!is_numeric($vdigits))  die('0!0!phone digits must be numeric, please contact your telephony provider');
		if($vdigits[0]=='0') $vdigits = substr($vdigits,1); // cut the trunk zero (numbers in mobminder DB are encoded with intenational prefix)
		if(strlen($vdigits)>9) {
			$vdigits = substr($vdigits,-9);
			if(substr($vdigits,0,2)=='32') $vdigits = substr($vdigits,2);
			if(substr($vdigits,0,2)=='33') $vdigits = substr($vdigits,2);
		}
	} else $vdigits = 'false';
}

// identifying the client geolocation

$phoneregion = 32;
if(!isset($_SESSION['phoneregion'])) { // this happens only one time by php session, whatever login connexion(s) is(are) made during the session
	
	$geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );
	$_SESSION['phoneregion'] = $geo->phoneregion;
}
$phoneregion = $_SESSION['phoneregion'];


// starting the client side js

$screen = isset($_SESSION['screen']) ? $_SESSION['screen'] : 0;
$html->pushJavaScript('new C_iMOB('.$baseline.','.$keyId.','.$screen.','.$vdigits.','.$phoneregion.');');

// echo
$html->dropPage();
?>