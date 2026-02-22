<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// initialized.php
// Step 4 : Page called after an initialization or a reresh
//
//                              CRONOFY LINKING MAP
//
//  Step 1 : welcome.php
//  Step 2 : oauth.php
//  Step 2-3 : link account
//  Step 3 : connecting.php
//  Step 3-4 : elevated permissions
//  * Step 4 : initialization.php
//  Step 4bis : minute.php
//  > Step 5 : initialized.php
//
//                              CRONOFY REFRESHING MAP
//
//  Step 1 : welcome.php
//  Step 2 : refresh.php
//  Step 2-3 : elevated permissions
//  * Step 3 : initialization.php
//  Step 3bis : minute.php
//  > Step 4 : initialized.php
//
//
// Key: > location  /  * page who can call this page
//
///////////////////////////////////////////////////////////////////////////////////

require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/crodbio.php';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup data loading	
//
$keyId 	= @$_GET['k']; /*$dS_cronofy_profile->keyId;*/

$dS_accesskey = new C_dS_accesskey($keyId);
if(!$dS_accesskey->id) die('Wrong Access key <command>logoff</command>');

$loginId 	= $dS_accesskey->groupId; // access keys group to a login
$accountId 	= $dS_accesskey->accountId;

$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);
$dS_key = new C_dS_accesskey($keyId);

if($dS_key->groupId != $dS_login->id) die('Access key does not match login <command>logoff</command>');
if($dS_key->accountId != $dS_account->id) die('Access key does not match account <command>logoff</command>');

/*if(cronodevtest) {
    echo 'loginId:'.$loginId.'<br/>';
    echo 'accountId:'.$accountId.'<br/>';
    echo 'keyId:'.$keyId.'<br/>';
    echo '<br/>';
}*/

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
// Syncing info
//

function bullet($caption) { return '<div class="e-bullet" style="display:table-cell;">'.$caption.'</div>'; }


$info = '<h3>'.L::XL('cronofy syncing').'</h3>';
$symbol = '<div class="fa fa-11x fa-thumbs-up" style="display:inline-block;"></div>';
$row1 = '<tr><td style="min-width:5em;">'.bullet($symbol).'</td><td colspan=2>'.$info.'</td></tr>';


$table = '<table class="ident-step">'.$row1.'</table>';
$infos = '<div class="container">'.$table.'</div>';
$html->pushHTML('<section class="s-info" id="s-info" style="margin-bottom:5em;">'.$infos.'</section>');



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