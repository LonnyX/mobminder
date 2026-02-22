<?php
///////////////////////////////////////////////////////////////////////////////////
//
//
//


$session = session_start(); // if the session file was thrown away by apache, a new EMPTY one has been made just now

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// SECURITY: Checking session and presence of required session variables	
//

require __DIR__.'/../../lib_mobphp/dbio.php'; // the usage of __DIR__. is mandatory because all reates to the vhost document root ( smart.mobminder.com/smart )
require __DIR__.'/../classes/language.php';
require __DIR__.'/../../lib_mobphp/chtml.php';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Produce responsive content
//
$html = new C_html();

$baseline = '17';
$html->pushLink('../themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('../themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


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
$html->pushLink('./welcome.css?b='.$baseline.'6', 'stylesheet', 'text/css');
$html->pushLink('../themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');


// framework
$html->pushScriptInclude('text/javascript', '../jquery/jquery-1.7.2.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jquery/jquery.rightClick.js?b='.$baseline);








///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Powered by mobminder

function pushfooter() {
	global $html;
	$power = '<div>'.L::XL('powered by').'</div>';
	$cright = '<div style="font-size:90%; margin-top:2em;">'.L::XL('copyright').'</div>';
	$footer = '<div class="container" style="min-height:5em; margin-top:1em; padding:2em; text-align:center; font-size:90%;">'.$power.$cright.'</div>';
	$html->pushHTML('<section id="s-footer" class="c99 s-footer">'.$footer.'</section>');
}


function bullet($caption ,$h1css='mobcolor air bold', $divcss='centered') {
	return '<div class="'.$divcss.'"><h1 class="'.$h1css.' bubble">'.$caption.'</h1></div>';
}

?>