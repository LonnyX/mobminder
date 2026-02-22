<?php
require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/chtml.php';

session_start();

$_SESSION['FA2_code'] = '44419';

// check postfix url (online reservation by clients/patients)

$vid = 0; if(isset($_GET['vid'])) $vid = $_GET['vid']; if(!is_numeric($vid)) $vid = 0;

$demo = @$_GET['demo']; if(isset($demo)) $demo = 1; else $demo = 0;

$dS_visitor = false;
$dS_account = false;
if($vid) { 
	$dS_visitor = new C_dS_visitor($vid); 
	if($dS_visitor->id == 0)
		$dS_visitor = false;
	else {
		$dS_account = new C_dS_group($dS_visitor->groupId); 
	}
}
$accname = $dS_account?$dS_account->name:'Mobminder';
$accid = $dS_account?$dS_account->id:0;


$html = new C_html();

$baseline = '00';
$html->pushLink('../themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('../themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushMeta('format-detection'		, 'date=no');

$html->pushMetaName('description', 'Mobminder - delete your personnal data' );
$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black');
$html->pushMetaName('viewport', 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'); 
// $html->pushMetaName('robots', 'index');

// css
$html->pushLink('./unsubscribe.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/default/controls.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');


// framework
$html->pushScriptInclude('text/javascript', '../jquery/jquery-3.2.1.js');
$html->pushScriptInclude('text/javascript', '../jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', '../jscripts/iscroll.5.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/language.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/datasets.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/controls.js?b='.$baseline);

// attach the js that is specific to this page
$html->pushScriptInclude('text/javascript', './unsubscribe.js?b='.$baseline);


$L = new L($dS_visitor?$dS_visitor->language:language_code_english);

	

	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Page links
	
			function makelink($url,$label) {
				if(!$url) return '';
				
						$prefx = 'http://';
						if(substr($url, 0, 7)=='http://') $prefx = '';
						if(substr($url, 0, 8)=='https://') $prefx = '';
						
				$target = '_self'; if(strpos($url, '.mobminder.')===false) $target = '_blank';
				
					$a = '<a href="'.$prefx.$url.'" target="'.$target.'" style="padding:.3em 2em; border:1px solid rgba(0,0,0,.1); border-radius:.2em;">'.$label.'</a>';
					$l = '<div style="display:inline-block;" class="e-link">'.$a.'</div>';
					
				return $l;
			}
	
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Page h1 Title
	
$html->pageTitle($accname);

$icon = '<div class="fa fa-2x fa-mobile" style="color:steelblue; text-align:left; display:inline-block; padding-right:.5em;"></div>';
$title = '<h1 style="color:white; padding-bottom:.5em; padding-top:.2em;">'.$icon.'Mobminder'.($dS_account?' - '.$dS_account->name:'').' - Unsubscribe'.'</h1>';
$html->pushHTML('<section class="s-h1 minder-background" style="margin-bottom:2em;" id="s-h1">'.$title.'</section>');


$img = '<img src="../themes/logos/mobminder-logo-800-336.gif" style="vertical-align:top; height:auto; max-width:100%; max-height:150px;"/>';
$img = '<div style="text-align:center;">'.$img.'</div>'; 
$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Main info zone

			$icon_info = '<div id="info-icon" class="fa fa-2x fa-info-circle" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
			$infos = '<div class="container"><h2>'.L::XL('u-info').'</h2></div>';
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Powered by mobminder
	
				$moblink = L::XL('powered by').' <a href="https://www.mobminder.com'.'" title="'.L::XL('powered by title').'" target="_blank">www.mobminder.com</a> | '.L::XL('powered by tail');
			$power = '<div style="font-size:smaller;">'.$moblink.'</div>';
			$cright = '<div style="margin-top:2em; font-size:smaller;">'.'© 2006-2024 Mobminder is a trademark of Cloud-Tech Belgium'.'</div>';
		$footer = '<div class="container" style="min-height:5em; padding-top:2em; padding-bottom:2em; text-align:center;">'.$power.$cright.'</div>';
$html->pushHTML('<section id="s-footer" class="c99 s-footer">'.$footer.'</section>');



// start the client side
	$key = (3*time()); // see (*uk01*)
$html->pushJavaScript('new e_UNSUBSCRIBE('.$accid.', '.$demo.', '.L::currentlanguage().', '.$key.')');

$html->dropPage(); // sets the font
?>