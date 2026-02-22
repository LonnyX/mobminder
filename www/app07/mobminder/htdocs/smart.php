<?php

///////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                 / s m a r t / i n d e x . p h p 
//
//    Simplified responsive interface for using Mobminder from a small device
//

// Example of logins (for development purpose)
//
// http://localhost/smart/index.php?aid=2835&lid=8122&kid=8122
//
// http://smart.mobminder.com/3044/8612/10999
// http://login.mobminder.com/3044/8612/10999


require './classes/language.php';
require './../lib_mobphp/dbio.php';
require './../lib_mobphp/chtml.php';

session_start();

//
//    I N C L U D E S 
//

$html = new C_html();
$baseline = C_dS_system::baseline(); $subbl = '44';

$html->pushLink('./themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('./themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');

$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black'); // possible values [default, black, black-translucent]
$html->pushMetaName('viewport', 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'); // so that the app shows up at its natural resolution
$html->pushMetaName('robots', 'noindex');

// css
$html->pushLink('./themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./themes/default/colors_2023.css?b='.$baseline.'_'.$subbl, 'stylesheet', 'text/css');
$html->pushLink('./themes/fonts/fonts.css?b='.$baseline.'_'.$subbl, 'stylesheet', 'text/css');
$html->pushLink('./themes/default/planning.css?b='.$baseline.'_'.$subbl, 'stylesheet', 'text/css');
$html->pushLink('./themes/default/controls.css?b='.$baseline.'_'.$subbl, 'stylesheet', 'text/css');
$html->pushLink('./smart/smart.css?b='.$baseline.'_'.$subbl, 'stylesheet', 'text/css');


// framework
$html->pushScriptInclude('text/javascript', './jquery/jquery-1.7.2.js');
$html->pushScriptInclude('text/javascript', './jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', './jscripts/iscroll.52.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/mobframe.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/language.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/datasets.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/controls.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/planning.js?b='.$baseline.'_'.$subbl);
$html->pushScriptInclude('text/javascript', './jscripts/modals.js?b='.$baseline.'_'.$subbl);

// attach the js that is specific to this page
$html->pushScriptInclude('text/javascript', './smart/smart.js?b='.$baseline.'_'.$subbl);



//
//    A U T O    L O G I N 
//

// check the API auto-login option. Usage: localhost/smart/index.php?kid=9769&lid=8377&aid=2991

$accountId = @$_GET['aid'];
$loginId = @$_GET['lid'];
$keyId = @$_GET['kid'];

if($keyId && $loginId && $accountId) { // check the coherence of the 3 parameters
	
		$q = new Q('SELECT groupId, accountId FROM accesskeys WHERE id="'.$keyId.'";');
	
	if(!$q->cnt()) die('0!0!No access rights (1)'); // the given keyId doesn't exists
	$foundLoginId = $q->mlist('groupId'); 
	$foundAccountId = $q->mlist('accountId'); 
	if($loginId != $foundLoginId) die('0!0!No access rights (2)'); // access keys are grouped by loginId
	if($accountId != $foundAccountId) die('0!0!No access rights (3)'); // access keys indicate the accountId they open

	// open a session to the account
	C_dS_login::checkin($loginId);
} else {
	
	// start the client side, may be it's a reload
	$keyId = isset($_SESSION['keyId']) ? $_SESSION['keyId'] : 0; // reload case <= should reload the current account, thanks to the tab focus call tabfocus.php, see(*55*)
}

if($keyId) { // check that this key has the minimum required access level
	$dS_accesskey = new C_dS_accesskey($keyId);
	$dS_login = new C_dS_login($dS_accesskey->groupId);
	if($dS_login->accessLevel < aLevel_operator) $keyId = 0; // solves the login on an e-resa page (link found via google) followed by a call on be.mobminder.com <= that would open the account related to the e-resa link! which is not allowable

} else die('you need to provide a correlated key...'.$keyId);
 

//
//    D I S P L A Y     P A G E     L A Y O U T 
//


	$L = new L($dS_login->language);

	$dS_account = new C_dS_group($dS_accesskey->accountId);
	$aname = $dS_account->name;
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Page h1 Title
	
$html->pageTitle($dS_account->name);
$html->pushHTML('<section class="s-h1" id="topper"><table><tr>'.'<td style="width:99%;"><h1>'.$aname.'</td></h1>'.'<td style="min-width:3em; text-align:center;">X</td>'.'</tr></table></section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 
	//   Calendar viewport zone

$html->pushHTML('<section id="viewport" style="">'.'</section>');



// start the client side
$html->pushJavaScript('new s_MOB('.$baseline.','.$keyId.');');

// echo
$html->dropPage(); // sets the font


?>