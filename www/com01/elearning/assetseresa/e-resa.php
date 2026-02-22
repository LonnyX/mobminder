<?php

require '../_assets/classes/language.php';
require '../../mobminder/lib_mobphp/dbio.php';
require '../../mobminder/lib_mobphp/chtml.php';


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   This is 2016 version of the e-reservation page, most used in 2019
//
//


// check postfix url (online reservation by clients/patients)

if(!isset($_GET['p'])) { sleep(2); header('location:https://maintenance.mobminder.com/oups.php'); die(); };

$postfixUrl = $_GET['p']; // (*30*)
if($postfixUrl=='') { sleep(1); header('location:https://maintenance.mobminder.com/oups.php'); die(); };

$familyIdentMode = $_GET['f']; if(!isset($familyIdentMode)) $familyIdentMode = 0; 

$demo = @$_GET['demo']; if(isset($demo)) $demo = 1; else $demo = 0;

// obtain account data

session_start();

//Debug
//foreach ($_SESSION as $key=>$val) echo '$_SESSION['.$key."] = ".$val."<br/>";

setCrossSiteCookie($eresa = false);


$_SESSION['demo'] = $demo;

		$strippedp = preg_replace("/[^A-Za-z0-9]/",'X',$postfixUrl);
		if($strippedp!=$postfixUrl) { sleep(5); header('location:https://maintenance.mobminder.com/oups.php'); }
		
	$q = new Q('SELECT id FROM logins WHERE eresaUrl="'.$strippedp.'";');
	$loginId = $q->ids(); if(!$loginId) { sleep(5); header('location:https://maintenance.mobminder.com/oups.php'); }

// Load keys associated with this login
$dS_keys = new C_dbAccess_accesskey($loginId);

if(!$dS_keys->count()) {
	// drop an exception, this login has no key anymore, that should never happen
	C_dS_exception::put('e-reservation.php', 'main:line60','This login has no key:'.$loginId);
	die('There is a technical problem with your web-reservation. Please contact your Mobminder support');
}
$dS_key = $dS_keys->last(); // there should be only one key anyway here attached to a web page login
$dS_account = new C_dS_group($dS_key->accountId);
$dS_login = new C_dS_login($dS_key->groupId);

$L = new L($dS_login->language);

// keep track of all surfer loginIds that are connected on the calling browser

// Treat the currently list of logged account from the calling browser
if(!isset($_SESSION['e-loggedIn'])) $loggedIn = Array(); // from scratch session
else if($_SESSION['e-loggedIn']=='') $loggedIn = Array(); // after a close all action
else $loggedIn = explode(',', $_SESSION['e-loggedIn']); // from some logged yet

// Add the loginId to the list of logged in if it was not yet in the list
	$yet = in_array($loginId, $loggedIn); if(!$yet) $loggedIn[] = $loginId;

$_SESSION['e-loggedIn'] = implode(',',$loggedIn);



// Produce responsive content, intended for Google robots
//
$html = new C_html();

	$aname = $dS_account->name;
	//$ptitle = $dS_login->eresaTitle;
	$f_title = $dS_login->eresaFontTitle?'f-'.$dS_login->eresaFontTitle:'';
	$f_text = $dS_login->eresaFontText?'f-'.$dS_login->eresaFontText:'';
	$info = $html->htmlize($dS_login->note);
	$how = $html->htmlize($dS_login->eresaDirections);

$baseline = 8;
$html->pushLink('../_assets/imgs/favicon/favicon.ico', 'icon', 'image/ico');
$html->pushLink('../_assets/imgs/favicon/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushMeta('format-detection'		, 'date=no');

$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'black');
$html->pushMetaName('viewport', 'user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1'); 
// $html->pushMetaName('robots', 'index');

// css
//$html->pushLink('/themes/default/e-resa/e-resa.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/index.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/generics.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/bootstrap.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/colors.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/fonts.css?b='.$baseline, 'stylesheet', 'text/css');
//$html->pushLink('/themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../_assets/css/faws.css?b='.$baseline, 'stylesheet', 'text/css');



//META DESCRIPTION //////////////////////////////////////////////////////////////////////////
//TODO
$seoMetaDescr= $dS_login->seoMetaDescr;
$what = $dS_login->firstname.' '.$dS_login->lastname;
$address = trim($dS_login->residence.' '.$dS_login->address.($dS_login->city?' '.L::XL('in_place').($dS_login->zipCode?' '.$dS_login->zipCode:'').' '.$dS_login->city:''));
$defaultdescr = L::XL('make_an_appointment_with').' '.$what.($address?', '.$address:'');
$html->pushMetaName('description', $seoMetaDescr?$seoMetaDescr:$defaultdescr);	



//META ROBOT //////////////////////////////////////////////////////////////////////////
//TODO
//$seoIndexable=1;
//TMP
//if (!$dS_login->seoIndexable)
	$html->pushMetaName('robots', 'noindex');
//else
	//$html->pushMetaName('robots', 'index');


//META CANONICAL //////////////////////////////////////////////////////////////////////////
function localestartswith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}


$seoMetaCanon=$dS_login->seoMetaCanon;
if (!$seoMetaCanon)
	$canonicalurl = 'https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'];
else if (localestartswith($dS_account->weburl,'http'))
	$canonicalurl = $seoMetaCanon;
else
	$canonicalurl = 'https://'.$seoMetaCanon;


//echo "canonicalurl=".$canonicalurl;
$html->pushLink($canonicalurl, 'canonical');

//getcustomcss is based on filesystem.
$custom_css = $dS_key->getcustomcss('../_assets/css/custom/');
if($custom_css) 
{
	//$html->pushHTML('<section>custom_css found</section>');
	$html->pushLink('../_assets/css/custom/'.$custom_css.'?b='.$baseline, 'stylesheet', 'text/css');
}
else
{
	//$html->pushHTML('<section>no custom_css found</section>');
}

if($dS_login->eresaCcss) 
{
	//$html->pushHTML('<section>eresaCcss found</section>');
	$html->pushStyle($dS_login->eresaCcss, 'custom_setup');
}
else
{
	//$html->pushHTML('<section>no eresaCcss found</section>');
}


// framework
$html->pushScriptInclude('text/javascript', '../_assets/jquery/jquery-3.2.1.js');
$html->pushScriptInclude('text/javascript', '../_assets/jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/iscroll.5.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/mobframe_IE.js?b='.$baseline);  //  WATCH THIS !! USES _IE COMPATIBLE VERSION (AXA Milan Italy on Windows 7)
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/language.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/datasets.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/controls.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/jquery-qrcode.min.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/mobqrcodelib.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../_assets/jscripts/e-resa-foundation.js?b='.$baseline);

// attach the js that is specific to this page
if ($familyIdentMode)
	$html->pushScriptInclude('text/javascript', '../_assets/jscripts/e-resa2.js?b='.$baseline);
else
	$html->pushScriptInclude('text/javascript', '../_assets/jscripts/e-resa.js?b='.$baseline);




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Page links
	
	function makelink($url,$label) {
		if(!$url) return '';
		
				$prefx = 'http://';
				if(substr($url, 0, 7)=='http://') $prefx = '';
				if(substr($url, 0, 8)=='https://') $prefx = '';
				
		$target = '_self'; if(strpos($url, '.mobminder.')===false) $target = '_blank';
		
			$a = '<a href="'.$prefx.$url.'" style="text-align:center;min-width:270px;max-width:270px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" target="'.$target.'" >'.$label.'</a>';
			$l = '<div class="flexinner e-link">'.$a.'</div>';
			
		return $l;
	}

	$lnks = Array();
	$lnks[] = makelink($dS_login->eresaLink1url,$dS_login->eresaLink1label);
	$lnks[] = makelink($dS_login->eresaLink2url,$dS_login->eresaLink2label);
	//$ldsp = implod($lnks,'<div style="display:inline-block; width:1em; border:1px solid transparent;"></div>');

	$ldsp = implode($lnks);

	//$lcnt = implode($lnks);


	if($ldsp) { // this section is not displayed if no link exist
	$row = '<div class="row justify-content-end">'.$ldsp.'</div>';
	$links = '<div class="container" >'.$row.'</div>';
	$html->pushHTML('<section class="s-links" id="s-links">'.$links.'</section>');
	}
	else
	$html->pushHTML('<div style="height:15px"></div>');
			
	
	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Page h1 Title

	//META TITLE //////////////////////////////////////////////////////////////////////////
	$deftitle = $dS_login->firstname.' '.$dS_login->lastname.($dS_login->city?' '.L::XL('in_place').' '.$dS_login->city:'').' | '.L::XL('online appointment');
	$seoMetaTitle=$dS_login->seoMetaTitle;
	$titledefault = ($seoMetaTitle?$seoMetaTitle:$deftitle);
	$h1title = ($dS_login->eresaTitle?$dS_login->eresaTitle:str_replace('|','-',$deftitle));
	
	$html->pageTitle($titledefault);

	//$h1 = '<h1 class="'.$f_title.'" >'.($ptitle?$ptitle:$aname).'</h1>';
	$h1 = '<h1>'.$h1title.'</h1>';
	$h1 = '<div class="container '.$f_title.'">'.$h1.'</div>';
	$html->pushHTML('<section class="s-h1 txt-bluetitle centered" id="s-h1">'.$h1.'</section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Page main image
	//
	// Logo: there are 4 different ways to define a logo
	// 1. There is no logo
	// 2. The logo is chosen from the set of standard images offered by the application
	// 3. The logo is customized and associated with the account (same logo for all web pages from this account)
	// 4. The logo is customized and is specific to the login (each login has an own defined logo, non specific logos default to the account logo)
	
			$custompath = '';
				$logoid = $dS_key->hascustomlogo();
				$standardimg = $dS_login->eresaSkin;
				if($logoid||$standardimg) 
					$custompath = 'src="../_assets/queries/logo.php?aid='.$dS_account->id.'&lid='.$dS_login->id.'&kid='.$dS_key->id.'&gid='.$logoid.'"'; // logo is proper to overall account
			
			if($custompath) { // then there is either a standard logo, an account logo or a login logo
				$img = '<img '.$custompath.'/>';
				$img = '<div class="container">'.$img.'</div>'; 
			} else $img = '';
			
$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Main info zone

			$icon_info= '<span id="info-icon" class="fa lightest fa-2x fa-info-circle"></span>';
			//$icon_info = '<div id="info-icon" class="fa fa-2x fa-info-circle" style="text-align:left; display:inline-block; padding-right:.5em;"></div>';
			$infos = '<div class="container"><h2>'.$icon_info.($info?$info:L::XL('e-reservation')).'</h2></div>';
$html->pushHTML('<section class="s-info" id="s-info">'.$infos.'</section>');




	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Buttons

				$lens 	= '<span class="fa lighter fa-1x fa-plus-circle fa-fw"></span><br>'.L::XL('book now'); // icon and text
				//$cros 	= '<span class="fa lighter fa-1x fa-times fa-fw"></span><br>'.L::XL('cancel resa');
				$cros 	= '<span class="fa lighter fa-1x fa-trash-alt fa-fw"></span><br>'.L::XL('cancel resa');
				$bl = '<div>'.$lens.'</div>'; // makes text vertical middle possible
				$br = '<div>'.$cros.'</div>';
				$bl = '<div class="c255 centered action">'.$bl.'</div>'; // makes margin and border-radius possible
				$br = '<div class="c255 centered action">'.$br.'</div>';
				$l 	= '<div class="flexinner col-sm-12 col-md-6 click click-default" id="buttons_lft_ui">'.$bl.'</div>'; // makes responsiveness possible
				$r 	= '<div class="flexinner col-sm-12 col-md-6 click click-default" id="buttons_rgt_ui">'.$br.'</div>';
				$row = '<div class="row justify-content-center">'.$l.$r.'</div>';
				$buttons = '<div class="container">'.$row.'&nbsp;</div>';
				$html->pushHTML('<section class="s-action" id="s-action">'.$buttons.'</section>');	



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// When and where
	

			$when = $html->htmlize($dS_login->eresaHourlies);
					$r = ''; if($dS_login->residence) $r = $dS_login->residence.'<br/>';
					$a = ''; if($dS_login->address) $a = $dS_login->address.'<br/>';
					$z = ''; if($dS_login->zipCode||$dS_login->city) $z = $dS_login->zipCode.'&nbsp;'.$dS_login->city.'<br/>';
					$c = ''; if($dS_login->country) $c = $dS_login->country.'<br/>';
					$m = ''; if($dS_login->mobile) $m = $dS_login->mobile.'<br/>';
					$p = ''; if($dS_login->phone) $p = $dS_login->phone.'<br/>';
					$e = ''; if($dS_login->email) $e = $dS_login->email.'<br/>&nbsp;';
					$h = ''; if($dS_login->eresaDirections) $p = '<br/>'.$how.'<br/>';
					$dlnk = ''; if($dS_login->eresaDirUrl) $dlnk = '<a href="'.$dS_login->eresaDirUrl.'" target="_blank">'.$dS_login->eresaDirLabel.'</a>';
			$where = $r.$a.$z.$c.$m.$p.$e.$h.$dlnk;

				$ilocate = $where?'<span id="directions-icon-l" class="fa lightest fa-2x fa-map-marker d-block"></span>':'';
				$icalend = $when?'<span id="directions-icon-r" class="fa lightest fa-2x fa-clock d-block"></span>':'';
			
			$a1 = '<div class="col-sm-6 pr-4 pb-4">'.$icalend.'<span class="d-block">'.$when.'</span>'.'</div>';
			$a2 = '<div class="text-sm-right col-sm-6">'.$ilocate.'<span class="d-block">'.$where.'</span>'.'</div>';
		
		$row = '<div class="row">'.$a1.$a2.'</div>';
		$wherewhen = '<div class="container">'.$row.'</div>';

$html->pushHTML('<section class="s-directions" id="s-directions">'.$wherewhen.'</section>');



	///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Powered by mobminder
	
	$from = '?from=moberesa_'.$dS_login->eresaUrl;
	$moblink = L::XL('powered by').' <a class="lime-hover" href="https://www.mobminder.com'.$from.'" title="'.L::XL('powered by title').'" target="_blank">www.mobminder.com</a> | '.L::XL('powered by tail');
	$privacy = '<a class="lime-hover" href="../_assets/queries/privacy.php?k='.$dS_key->id.'">Politique de confidentialité</a>';
	$power = '<div style="font-size:smaller;">'.$moblink.' | '.$privacy.'</div>';
	$cright = '<div style="font-size:smaller;">'.'© 2006-2024 Mobminder is a trademark of Cloud-Tech Belgium'.'</div>';
	$footer = '<div class="container" style="min-height:5em; padding-top:2em; padding-bottom:2em; text-align:center;">'.$power.$cright.'</div>';
	$html->pushHTML('<footer id="s-footer" class="txt-grey-l s-footer">'.$footer.'</footer>');



	//temporary not used----------------------------------------------------------------------
		//extracts visitor ID and reservation ID from payment return url
		//r parameter is no more used!
		/*if(isset($_GET['r'])) 
		{
			//return url call to e-resa.php
			//?r=XXXXXXXXX-YYYYYYYYY
			$tmp = base64_decode(urldecode($_GET['r']));
			if (!!stripos($tmp,"-"))
			{
				$tmp = explode("-",$tmp );
				$returnvisitorid=$tmp[0];
				$returnresaid=$tmp[1];
			}
			else
			{
				$returnvisitorid=$tmp;
				$returnresaid=0;
			}

			if (isset($_SESSION['e-resa']))
			{
				unset($_SESSION['e-resa']);
			}
		}
		else
		{*/
	//---------------------------------------------------------------------------------------
	
//e-resa is stored in php session by /post/reservation.php when 
//it is used to reload current reservation and display process section waiting for payconiq payment
//- when users has lost his reservation page before having validate payconiq payment
//- when payconiq application is not installed on smartphone, because payconiq installation page goes back to booking page

//retrieve visitor ID and reservation ID from PHP session
if(isset($_SESSION['e-visi']) && isset($_SESSION['e-resa']))
{
	//echo "session var found : ".$_SESSION['e-visi']."-".$_SESSION['e-resa'];
	$returnvisitorid=$_SESSION['e-visi'];
	$returnresaid=$_SESSION['e-resa'];
	unset($_SESSION['e-resa']);
}
else
{
	//echo "session var not found";
	$returnvisitorid=0;
	$returnresaid=0;
}

//}

//computop back url is called with 'computop transaction id', equals to payement id, which is necessary to cancel the given payement
//because computop does not call notification url (callback) for cancel payment
if(isset($_GET['ctptransid'])) 
{
	$computoptransid = $_GET['ctptransid'];
}
else
{
	$computoptransid = 0;
}

// start the client side
$html->pushJavaScript('new e_MOB('.$dS_key->id.', '.$demo.', '.$dS_login->language.', "'.$returnvisitorid.'", '.$returnresaid.', '.$computoptransid.','.$familyIdentMode.')');
//$html->pushJavaScript('new e_MOB('.$dS_key->id.', '.$demo.', '.$dS_login->language.')');

	$custom_css = $custom_css?'c'.$dS_account->id:''; // this activates the custom css for this account
	$custom_css.= $dS_login->eresaPalette?' '.$dS_login->eresaPalette:'';

	$html->dropPage($custom_css.' '.$f_text); // sets the font
?>