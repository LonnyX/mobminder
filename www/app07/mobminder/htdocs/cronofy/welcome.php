<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   				A D D / R E V O K E    C O N N E X I O N S   
//
// 		F R O M   M O B M I N D E R   T O   F O R E I G N   C A L E N D A R S
//
//
//
//                              CRONOFY LINKING MAP
//
//  > Step 1 : welcome.php
//  Step 2 : oauth.php
//  Step 2-3 : link account
//  * Step 3 : connecting.php
//  Step 3-4 : elevated permissions
//  Step 4 : initialization.php
//  Step 4bis : minute.php
//  Step 5 : initialized.php
//
//                              CRONOFY REFRESHING MAP
//
//  > Step 1 : welcome.php
//  Step 2 : refresh.php
//  Step 2-3 : elevated permissions
//  Step 3 : initialization.php
//  Step 3bis : minute.php
//  Step 4 : initialized.php
//
//                              CRONOFY REVOKING MAP
//
//  > Step 1 : welcome.php
//  Step 2 : revoke.php
//  Step 3: revoked.php
//
//
// Key: > location  /  * page who can call this page
//
///////////////////////////////////////////////////////////////////////////////////

$session = session_start(); // if the session file was thrown away by apache, a new EMPTY one has been made just now

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SECURITY: Checking session and presence of required session variables	
//
if(!$session) die('System does not allow session start <command>logoff</command>'); // system problem opening the session file
if(!isset($_GET['s'])) // if s exists, it's a return from connecting.php (to manage if user doesn't want link an account)
    if(!isset($_SESSION['loggedIn'])) 
        if(!isset($_SESSION['e-loggedIn']))
            die('Session has been closed at server side <command>logoff</command>'); // new session file, while we expect to be logged

if(!isset($_GET['k'])) die('You have no access to this script <command>logoff</command>');

require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/crodbio.php';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup data loading	
//
$keyId = $_GET['k'];

$dS_accesskey = new C_dS_accesskey($keyId);

if(!$dS_accesskey->id) die('Wrong Access key <command>logoff</command>');

$loginIdFromSession = $_SESSION['loginId'];
if ($loginIdFromSession != $dS_accesskey->groupId) die('Wrong Access key (2) <command>logoff</command>');

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
    echo 'loginId from session:'.$loginIdFromSession.'<br/>';
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Produce responsive content
//
$html = new C_html();

$baseline = '07';
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
// Main info zone

$info = '<h2>'.L::XL('cronofy info').'</h2>';
$row1 = '<tr><td colspan=3>'.$info.'</td></tr>';

$apple 		= '<div class="fab fa-3x fa-google" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
$google 	= '<div class="fab fa-3x fa-apple" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
$microsft 	= '<div class="fab fa-3x fa-windows" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
$row2 = '<tr style="text-align:center;" class="mindercolor"><td style="padding:1em;">'.$apple.'</td><td style="padding:1em;">'.$google.'</td><td style="padding:1em;">'.$microsft.'</td></tr>';

$apple 		= '<td style="padding:0 1.5em 0 0; width:33.3%;"><h1>Google</h1></td>';
$google 	= '<td style="padding:0 1.5em 0 0; width:33.3%;"><h1>Apple</h1></td>';
$microsft 	= '<td style="padding:0 1.2em 0 0; width:33.3%;"><h1>Microsoft</h1></td>';
$row3 = '<tr style="text-align:center; color:steelblue;" class="">'.$apple.$google.$microsft.'</tr>';
$table = '<table style="margin:2em;">'.$row1.$row2.$row3.'</table>';
$infos = '<div class="container">'.$table.'</div>';

$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check step 1: login

function bullet($caption) { return '<div class="e-bullet" style="display:table-cell;">'.$caption.'</div>'; }

$info = '<h3>'.L::XL('cronofy login ident').'</h3>';
$row1 = '<tr><td style="min-width:5em;">'.bullet('1').'</td><td>'.$info.'</td></tr>';
$row2 = '<tr class="ident-row"><td></td><td>'.$dS_login->firstname.' '.$dS_login->lastname.' ('.$dS_login->login.')<br/>'.$dS_login->email.'<br/>'.$dS_login->mobile.'</td></tr>';
$table = '<table class="ident-step">'.$row1.$row2.'</table>';
$infos = '<div class="container">'.$table.'</div>';
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check step 2: account


$info = '<h3>'.L::XL('cronofy account ident').'</h3>';
$row1 = '<tr><td style="min-width:5em;">'.bullet('2').'</td><td>'.$info.'</td></tr>';
$row2 = '<tr class="ident-row"><td></td><td>'.$dS_account->name.'</td></tr>';
$table = '<table class="ident-step">'.$row1.$row2.'</table>';
$infos = '<div class="container">'.$table.'</div>';
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check step 3: view


$info = '<h3>'.L::XL('cronofy view ident').'</h3>';
$row1 = '<tr><td style="min-width:5em;">'.bullet('3').'</td><td>'.$info.'</td></tr>';

$rows = Array(); $c = 1;
foreach($view_resources->keyed as $rid => $dS_resource) {
    $rows[] = '<tr class="ident-row"><td></td><td>'.($c++).' - '.$dS_resource->name.'</td></tr>';
}

$table = '<table class="ident-step">'.$row1.implode('',$rows).'</table>';
$infos = '<div class="container">'.$table.'</div>';
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Buttons captions

$cap_newlink 	= '<div class="fa fa-11x fa-plus" style="padding-right:.6em; display:inline-block;"></div>'.L::XL('cronofy connect'); // icon and text
$cap_revoke = '<div class="fa fa-11x fa-times" style="padding-right:.6em; display:inline-block;"></div>'.L::XL('cronofy revoke');
$cap_init 	= '<div class="fa fa-11x fa-recycle" style="padding-right:.6em; display:inline-block;"></div>'.L::XL('cronofy reinit');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Check step 4: connected yet


$q = new Q('select id from cronofy_user where groupId = '.$loginId.' AND deletorId=0;');
$id = $q->ids(); $c = $q->cnt();
if($c>1) die('Sorry, it seems that many cronofy users are attached to this account id. Please contact Mobminder for further help on this issue!');

$existinguser = '';

$dS_cronofy_user = new C_dS_cronofy_user($id); if($id) $existinguser = '&u='.$dS_cronofy_user->id;

$cronofy_accesses = new C_dbAccess_cronofy_accesses();
$cronofy_accesses->getByKeyId($dS_key->id); //getByKeyId should return only one row!
/*
$cronofy_profiles = new C_dbAccess_cronofy_profiles();
$cronofy_profiles->getByKeyId($dS_key->id);*/

if(cronodevtest) 
{
    echo 'cronofy user id:'.$id.'<br/>';
    echo 'cronofy key id:'.$dS_key->id.'<br/>';
    echo 'cronofy accesses count:'.$cronofy_accesses->count().'<br/>';
}

function allowedaction($profile_id) 
{
    // check.1 task must be terminated ----------------------------------------------------------
    $q = new Q('SELECT id FROM cronofy_inittasks WHERE groupId='.$profile_id.' AND state<>2;');
    $isbusy = $q->ids();

    // check.2 can't refresh if we made an init or a refresh less 10 min ------------------------
    $q = new Q('SELECT id FROM cronofy_inittasks WHERE groupId='.$profile_id.' AND endDate>"'.date("Y-m-d H:i:s",strtotime('-10 minutes')).'";');
    $isrecent = $q->ids();

    return !($isbusy || $isrecent);
}

if($id && $cronofy_accesses->count()) { // some remote profiles are linked to this mobminder login yet, we list them

    $apple 		= '<div class="mindercolor fab fa-15x fa-apple" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
    $google 	= '<div class="mindercolor fab fa-15x fa-google" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
    $microsoft 	= '<div class="mindercolor fab fa-15x fa-windows" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
    $cronofy 	= '<div class="mindercolor fa fa-15x fa-circle-o-notch" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';

    $info = '<h3>'.L::XL('cronofy asis ident').'</h3>';
    $row1 = '<tr><td style="min-width:5em;">'.bullet('4').'</td><td colspan=3>'.$info.'</td></tr>';

    $rows = Array(); $c = 1;
    foreach($cronofy_accesses->keyed as $cid => $dS_cronofy_access) {
        print_r($cid,true);
        $dS_cronofy_profile = new C_dS_cronofy_profile($dS_cronofy_access->groupId);
        $provider = $dS_cronofy_profile->cro_provider_name; $provicone = $provider;
        switch($provider) {
            case 'apple': 			$provicone = $apple.'<span class="smaller">Apple</span>'; break;
            case 'cronofy': 		$provicone = $cronofy.'<span class="smaller">Cronofy</span>'; break;
            case 'exchange': 		$provicone = $microsoft.'<span class="smaller">Exchange</span>'; break;
            case 'google': 			$provicone = $google.'<span class="smaller">Google</span>'; break;
            case 'live_connect': 	$provicone = $microsoft.'<span class="smaller">Outlook</span>'; break;
            case 'office365': 		$provicone = $microsoft.'<span class="smaller">Office365</span>'; break;
        }
        $x = '<span class="smaller" style="padding-right:1em;">'.($c++).'</span>';
        $count = $x.' '.$provicone;
        $provider = '<td style="vertical-align:middle; height:3em; padding-right:1em; white-space:nowrap;">'.$count.'</td>';
        $ident = '<span style="color:steelblue;">'.$dS_cronofy_profile->cro_profile_name.'</span>';
        $profile = '<td style="vertical-align:middle; height:3em; padding-right:2em; white-space:nowrap;">'.$ident.'</td>';

        $revoke = ''; $reinit = '';
        if(allowedaction($cid)) {
            $revoke = '<a href="./revoke.php?k='.$dS_key->id.'&a='.$dS_cronofy_access->id.'" style="padding:.1em 1em; margin-right:1em;" class="action smaller click">'.$cap_revoke.'</a>';
            $reinit = '<a href="./refresh.php?k='.$dS_key->id.'&a='.$dS_cronofy_access->id.'" style="padding:.1em 1em; margin-left:1em;" class="action smaller click">'.$cap_init.'</a>';
        }

        $buttons = '<td width=90%>'.$revoke.$reinit.'</td>';

        $rows[] = '<tr class=""><td></td>'.$provider.$profile.$buttons.'</tr>';
    }

    $table = '<table class="ident-step">'.$row1.implode('',$rows).'</table>';
    $infos = '<div class="container">'.$table.'</div>';
    $html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');


} else { // first connection ever on this Mobminder account

    $info = '<h3>'.L::XL('cronofy asis none').'</h3>';
    $row1 = '<tr><td style="min-width:5em;">'.bullet('4').'</td><td>'.$info.'</td></tr>';

    $info = '<h3>'.L::XL('cronofy connect warning').'</h3>';
    $row2 = '<tr><td style="min-width:5em;"></td><td>'.$info.'</td></tr>';

    $table = '<table class="ident-step">'.$row1.$row2.'</table>';

    $infos = '<div class="container">'.$table.'</div>';
    $html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create a new connection


$newlink = '<a href="./oauth.php?k='.$dS_key->id.$existinguser.'" style="padding:.3em 2em; margin-left:1em;" class="action click" url="">'.$cap_newlink.'</a>';

$l 	= '<article id="button-book" class="" style="text-align:center; margin-top:2em;">'.$newlink.'</article>'; // makes responsiveness possible

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