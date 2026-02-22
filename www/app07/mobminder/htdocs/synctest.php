<?php
require './../lib_mobphp/dbio.php';
require './../lib_mobphp/chtml.php';

$html = new C_html();

$BASELINEversion = 06;
$html->pushLink('themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');
$html->pageTitle('mobminder');

// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');

$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black');

// css
$html->pushLink('themes/fonts/faws.css?b='.$BASELINEversion, 'stylesheet', 'text/css');
$html->pushLink('themes/default/controls.css?baseline='.$BASELINEversion, 'stylesheet', 'text/css');
$html->pushLink('themes/default/mobminder.css?baseline='.$BASELINEversion, 'stylesheet', 'text/css');
$html->pushLink('themes/default/colors_2023.css?baseline='.$BASELINEversion, 'stylesheet', 'text/css');


// browser compatibility
// if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) die($html->sorryForMSIE()->dropPage());


// framework
$html->pushScriptInclude('text/javascript', 'jquery/jquery-3.2.1.js');
$html->pushScriptInclude('text/javascript', 'jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', 'jscripts/iscroll.5.js?baseline='.$BASELINEversion);
$html->pushScriptInclude('text/javascript', 'jscripts/mobframe.js?baseline='.$BASELINEversion);
$html->pushScriptInclude('text/javascript', 'jscripts/language.js?baseline='.$BASELINEversion);
$html->pushScriptInclude('text/javascript', 'jscripts/datasets.js?baseline='.$BASELINEversion);
$html->pushScriptInclude('text/javascript', 'jscripts/controls.js?baseline='.$BASELINEversion);

// attach the js that is specific to this page
$html->pushScriptInclude('text/javascript', 'jscripts/synctest.js?baseline='.$BASELINEversion);


// start the client side
$html->pushJavaScript('new sync_MOB()');

// echo
$html->dropPage();
?>