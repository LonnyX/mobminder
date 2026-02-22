<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   				R E V O K E    C O N N E X I O N S   
//
// 		F R O M   M O B M I N D E R   T O   F O R E I G N   C A L E N D A R S
//
//

$session = session_start(); // if the session file was thrown away by apache, a new EMPTY one has been made just now

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SECURITY: Checking session and presence of required session variables	
//
if(!$session) die('System does not allow session start <command>logoff</command>'); // system problem opening the session file
if(!isset($_SESSION['loggedIn'])) 
    if(!isset($_SESSION['e-loggedIn']))
        die('Session has been closed at server side <command>logoff</command>'); // new session file, while we expect to be logged

if(!isset($_GET['k'])) die('You have no access to this script <command>logoff</command>');

require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/cronofymanager.php';



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup data loading	
//
$keyId 	= $_GET['k'];
$aid 	= $_GET['a']; // profile id
$do 	= @$_GET['do']; // action confirmed

$dS_accesskey = new C_dS_accesskey($keyId);
if(!$dS_accesskey->id) die('Wrong Access key <command>logoff</command>');

$loginIdFromSession = $_SESSION['loginId'];
if ($loginIdFromSession != $dS_accesskey->groupId) die('Wrong Access key (2) <command>logoff</command>');

$dS_cronofy_access = new C_dS_cronofy_access($aid);
$cronofy_profile_id = $dS_cronofy_access->groupId;
$dS_cronofy_profile = new C_dS_cronofy_profile($cronofy_profile_id);
if(!$dS_cronofy_profile->id) die('Wrong Profile id <command>logoff</command>');

$loginId 	= $dS_accesskey->groupId; // access keys group to a login
$accountId 	= $dS_accesskey->accountId;

$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);
$dS_key = new C_dS_accesskey($keyId);

if($dS_key->groupId != $dS_login->id) die('Access key does not match login <command>logoff</command>');
if($dS_key->accountId != $dS_account->id) die('Access key does not match account <command>logoff</command>');

$view_resources = new C_dbAccess_resources($accountId, $dS_key); // resources as seen by the login's limited view

if(cronodevtest) {
    echo 'loginId:'.$loginId.'<br/>';
    echo 'accountId:'.$accountId.'<br/>';
    echo 'keyId:'.$keyId.'<br/>';
    echo '<br/>';
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Proceed
//

if($do) 
{
    $dS_cronofy_manager_access = new C_cronofy_manager_access($dS_cronofy_access->id);
    $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
    $dbAccess_cronofy_calendars->getByGroupId($dS_cronofy_access->id);
 
    $dS_cronofy_manager_access->RevokeCalendars($dbAccess_cronofy_calendars->keyed);
 
    header('Location: revoked.php?k='.$dS_cronofy_access->keyId);
    exit;
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Produce responsive content
//
$html = new C_html();

$baseline = '06';
$html->pushLink('themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');

$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black');
$html->pushMetaName('viewport', 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'); 
$html->pushMetaName('robots', 'noindex');

// css
$html->pushLink('../themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('./cronofy.css?b='.$baseline.'6', 'stylesheet', 'text/css');
$html->pushLink('../themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');


// framework
$html->pushScriptInclude('text/javascript', '../jquery/jquery-1.7.2.js');
$html->pushScriptInclude('text/javascript', '../jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', '../jscripts/iscroll.5.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/mobframe.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/language.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/datasets.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/controls.js?b='.$baseline);




$L = new L($dS_login->language, $dS_account->visitorAlias);

$aname = $dS_account->name;

$how = $html->htmlize($dS_login->eresaDirections);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page h1 Title

$html->pageTitle($dS_account->name);

$icon = '<div class="fa fa-15x fa-sitemap" style="color:steelblue; text-align:left; display:inline-block; padding-right:.5em;"></div>';
$title = '<h1 style="color:white; padding-bottom:.5em; padding-top:.2em;">'.$icon.L::XL('cronofy title').'</h1>';
$html->pushHTML('<section class="s-h1 minder-background" style="margin-bottom:3em;" id="s-h1">'.$title.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page main image
//

$img = '<img src="../themes/logos/mobminder-logo-800-336.gif" style="vertical-align:top; height:auto; max-width:100%; max-height:150px;"/>';
$img = '<div style="font-size:100%;">'.$img.'</div>'; 

$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check step 4: connected yet

function bullet($caption) { return '<div class="e-bullet" style="display:table-cell;">'.$caption.'</div>'; }

$q = new Q('select id from cronofy_user where groupId = '.$loginId.' AND deletorId=0;');
$id = $q->ids(); $c = $q->cnt();
if($c>1) die('Sorry, it seems that many cronofy users are attached to this account id. Please contact Mobminder for further help on this issue!');


if($id) { // some remote profiles are linked to this mobminder login yet, we list them

    $dS_cronofy_user = new C_dS_cronofy_user($id);

    $info = '<h3>'.L::XL('cronofy revoke warning').'</h3>';
    $symbol = '<div class="fa fa-11x fa-cut" style="display:inline-block;"></div>';
    $row1 = '<tr><td style="min-width:5em;">'.bullet($symbol).'</td><td colspan=2>'.$info.'</td></tr>';


    $ident = $dS_cronofy_profile->cro_provider_name.' ('.$dS_cronofy_profile->cro_profile_name.') ';
    $profile = '<td style="vertical-align:middle; height:3em; padding-right:2em; white-space:nowrap;">'.$ident.'</td>';

    $rows[] = '<tr class="ident-row"><td></td>'.$profile.'</tr>';

    $table = '<table class="ident-step">'.$row1.implode('',$rows).'</table>';
    $infos = '<div class="container">'.$table.'</div>';
    $html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');


} else { // first connection ever on this Mobminder account

    $info = '<h3>'.L::XL('cronofy asis none').'</h3>';
    $row1 = '<tr><td style="min-width:5em;">'.bullet('4').'</td><td>'.$info.'</td></tr>';

    $table = '<table class="ident-step">'.$row2.'</table>';

    $infos = '<div class="container">'.$table.'</div>';
    $html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');
}





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Buttons captions

$cap_do = '<div class="fa fa-11x fa-play" style="padding-right:.6em; display:inline-block;"></div>'.L::XL('cronofy revoke full'); // icon and text
$cap_cancel = '<div class="fa fa-11x fa-pause" style="padding-right:.6em; display:inline-block;"></div>'.L::XL('go previous'); // icon and text



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Confirm refresh


$do = '<a href="./revoke.php?k='.$dS_key->id.'&a='.$aid.'&do=1" style="padding:.3em 2em; margin-right:2em;" class="action click" url="">'.$cap_do.'</a>';
$cancel = '<a href="./welcome.php?k='.$dS_key->id.'" style="padding:.3em 2em; margin-left:2em;" class="action click" url="">'.$cap_cancel.'</a>';

$l 	= '<article id="button-book" class="" style="text-align:center; margin-top:2em;">'.$do.$cancel.'</article>'; // makes responsiveness possible

$buttons = '<div class="container" style="line-height:0em;">'.$l.'&nbsp;</div>';
$html->pushHTML('<section class="s-action" id="s-action">'.$buttons.'</section>');	



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Powered by mobminder

$power = '<div>'.L::XL('powered by').'</div>';
$cright = '<div style="font-size:90%; margin-top:2em;">'.L::XL('copyright').'</div>';
$footer = '<div class="container" style="min-height:5em; margin-top:1em; padding:2em; text-align:center; font-size:90%;">'.$power.$cright.'</div>';
$html->pushHTML('<section id="s-footer" class="c99 s-footer">'.$footer.'</section>');



// start the client side
// $html->pushJavaScript('new e_MOB('.$dS_key->id.', '.$demo.', '.$dS_login->language.')');

// echo
$html->dropPage(); // sets the font

?>