<?php
///////////////////////////////////////////////////////////////////////////////////
//
//  STANDARD PRIVACY POLICY FOR PATIENTS / CLIENTS of OUR MOBMINDER PROFESSIONAL USERS
//

require '../../../../mobminder/lib_mobphp/dbio.php';
require '../../../../mobminder/lib_mobphp/chtml.php';
require '../../_assets/classes/language.php';
require '../../_assets/classes/connection.php'; 



//require '../classes/dbio.php';
//require '../classes/chtml.php';
//require '../classes/language.php';

		if(!isset($_REQUEST['k'])) die('You have no access to this script <command>logoff</command>');
		$keyId = $_REQUEST['k'];
		if(!is_numeric($keyId)) die('Access key invalid format <command>logoff</command>');
		$o_dS_accesskey = new C_dS_accesskey($keyId);
		if(!$o_dS_accesskey->id) die('Wrong Access key <command>logoff</command>');
		
	$loginId = $o_dS_accesskey->groupId; // access keys group to a login
	$accountId = $o_dS_accesskey->accountId;

$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);
$dS_accesskey = new C_dS_accesskey($keyId);
$L = new L($dS_login->language,$dS_account->visitorAlias);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Produce responsive content
//
$languageIso2 = L::$languageAbrevs[$dS_login->language];
$html = new C_html($languageIso2);
//$html = new C_html();

$baseline = 12;
$html->pushLink('../imgs/favicon/favicon.ico', 'icon', 'image/ico');
$html->pushLink('../imgs/favicon/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');


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
$html->pushLink('../css/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../css/e-privacy.css?b='.$baseline.'6', 'stylesheet', 'text/css');
$html->pushLink('../css/colors.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('../css/fonts.css?b='.$baseline, 'stylesheet', 'text/css');


// framework
//$html->pushScriptInclude('text/javascript', '../jquery/jquery-3.2.1.js');
//$html->pushScriptInclude('text/javascript', '../jquery/jquery.rightClick.js');

// generic api
//$html->pushScriptInclude('text/javascript', '../jscripts/iscroll.5.js?b='.$baseline);
//$html->pushScriptInclude('text/javascript', '../jscripts/mobframe_IE.js?b='.$baseline);
//$html->pushScriptInclude('text/javascript', '../jscripts/language.js?b='.$baseline);
//$html->pushScriptInclude('text/javascript', '../jscripts/datasets.js?b='.$baseline);
//$html->pushScriptInclude('text/javascript', '../jscripts/controls.js?b='.$baseline);

// attach the js that is specific to this page
//$html->pushScriptInclude('text/javascript', './install.js?b='.$baseline);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page h1 Title

$html->pageTitle('Mobminder - Privacy policy');

		$icon = '<i class="fa fa-3x fa-user-secret"></i>';
	$title = '<h1 style="font-size:2em; font-weight:bold;">'.$icon.L::XL('privacy policy').'</h1>';
$html->pushHTML('<section class="s-h1" style="margin-top:3em; margin-bottom:2em; color:steelblue;" id="s-h1">'.$title.'</section>');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page main image
//

$img = '<img src="../imgs/custom/mob-logo.png" style="vertical-align:top; height:auto; max-width:100%; max-height:100px;"/>';
$img = '<div style="text-align:center;">'.$img.'</div>'; 

$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Powered by mobminder


function pushfooter() {
	global $html;
	global $dS_login;

    $from = '?from=moberesa_'.$dS_login->eresaUrl;
    $moblink_url = 'https://www.mobminder.com'.$from;
    $currentYear = date('Y'); // Get the current year
    $cright = '<span style="font-size:smaller; margin-top:0.3em;">'.'© 2006-'.$currentYear.' </span>';
    $moblink = ' <a style="font-weight:bold; text-decoration: none;;" href="'.$moblink_url.'" target="_blank" data-title="'.L::XL('discover mobminder').'"  ><span class="logo mob">mob</span><span class="logo minder">minder</span></a> ';

    $supplied= '<div  style="font-size:smaller; text-align: center;" >'.'<p style="vertical-align: middle; text-align:center;">'.$cright.$moblink.L::XL('provided by').'</p></div>';
    $features1= '<div style="font-size:smaller; margin-top:0.3em;">'.L::XL('summarized features').'</div>';

    $footer_content = $supplied.$features1;

    $footer = '<div class="container">'.$footer_content.'</div>';

    $html->pushHTML('<footer id="s-footer" class="s-footer">'.$footer.'</footer>');

}


function bullet($caption ,$h1css='mobcolor air bold', $divcss='centered') {
	return '<div class="'.$divcss.'"><h1 class="'.$h1css.' bubble">'.$caption.'</h1></div>';
}

	
//$language = new L($dS_account->language, $dS_account->visitorAlias);

$accountname = '[ACCOUNTNAME]';
$aliasvisitor = '[ALIASVISITOR]';


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Généralités


	$p = Array();
	$p[] = '<h1 class="pad">'.L::XL('general information title').'</h1>';
	$p[] = '<p>'.L::XL('general information p1').'</p>';
	$p[] = '<p>'.L::XL('general information p2').'</p>'; //account
	$p[] = '<p>'.L::XL('general information p3').'</p>';
	$p[] = '<p>'.L::XL('general information p4').'</p>';
	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Consentement


	$p = Array();
	$p[] = '<h1 class="pad">'.L::XL('consent title').'</h1>';
	$p[] = '<p>'.L::XL('consent p1').'</p>';
	$p[] = '<p>'.L::XL('consent p2').'</p>'; //visitor+account
	$p[] = '<p>'.L::XL('consent p3').'</p>'; //visitor+account
	$p[] = '<p>'.L::XL('consent p4').'</p>';
	$p[] = '<p>'.L::XL('consent p5').'</p>'; //account
	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');

	
		

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Traitement de vos données personnelles


	$p = Array();
	//$p[] = '<h1 class="pad">Traitement de vos données:</h1>';
	$p[] = '<h1 class="pad">'.L::XL('data processing title').'</h1>';

	//$p[] = '<p>Pour le compte de '.$dS_account->name.', Mobminder est chargé du traitement suivant:</p>';
	$p[] = '<p>'.L::XL('data processing intro').'</p>'; 
		
	$p[] = '<ul>';

	//$p[] = '<li>Votre inscription dans le registre '.L::XL('visitor').' du professionnel concerné ('.$dS_account->name.')</li>';
	$p[] = '<li>'.L::XL('data processing list 1').'</li>'; 

	//$p[] = '<li>La réservation d’un rendez-vous, uniquement chez/à '.$dS_account->name.'</li>';
	$p[] = '<li>'.L::XL('data processing list 2').'</li>'; 
		
	//$p[] = '<li>La gestion de vos rendez-vous (consulter, modifier ou supprimer) par vous-même.</li>';
	$p[] = '<li>'.L::XL('data processing list 3').'</li>'; 
		
	//$p[] = '<li>L\'envoi de communications (par e-mail, SMS ou autre) liées à l\'utilisation de ce service, à vos rendez-vous, 
	//			à vos données personnelles ou des informations générales ou juridiques concernant les services de Mobminder. Ces communications se limitent exclusivement à votre interaction avec '.$dS_account->name.'.</li>';
	$p[] = '<li>'.L::XL('data processing list 4').'</li>'; 
		
	//$p[] = '<li>Le stockage et la sécurité des données d\'agenda relatives, inclus les divers communications échangées avec '.$dS_account->name.'.</li>';
	$p[] = '<li>'.L::XL('data processing list 5').'</li>'; 
		
	$p[] = '</ul>';

	/*$p[] = '<p>
		Nous traitons vos données à caractère personnel aussi longtemps qu’elles sont nécessaires dans le cadre de notre contrats de services avec '.$dS_account->name.'.
		Il est en outre possible que la loi nous impose de conserver les données pendant un certain temps. 
		A défaut d\'autre mesure juridique pré-emptive, vous avez le droit de consulter vos données et de les (faire) corriger ou effacer.</p>';*/
	$p[] = '<p>'.L::XL('data processing retention').'</p>'; //account
		
	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// But du traitement de vos données personnelles


	$p = Array();
		//$p[] = '<h1 class="pad">Quelles données devez-vous communiquer?</h1>';
		$p[] = '<h1 class="pad">'.L::XL('data communication title').'</h1>';
		
		//$p[] = '<p>Si vous êtes déjà '.L::XL('visitor').' de '.$dS_account->name.', vous avez déjà communiqué les données nécessaires à votre professionnel. Le système de prise de RDV en ligne se limitera à vérifier votre identité.</p>';
		$p[] = '<p>'.L::XL('data communication intro registered').'</p>';
		//$p[] = '<p>Si vous n\'êtes pas encore '.L::XL('visitor').' de '.$dS_account->name.', les données suivantes sont requises:</p>';
		$p[] = '<p>'.L::XL('data communication intro not registered').'</p>';
		
		$p[] = '<ul>';
		
		//$p[] = '<li>Données d’identité</li>';
		$p[] = '<li>'.L::XL('data communication list 1').'</li>'; 
		
		//$p[] = '<li>Date de naissance (professionnels de la santé uniquement)</li>';
		$p[] = '<li>'.L::XL('data communication list 2').'</li>'; 
		
		//$p[] = '<li>Données de localisation (professionnels de la santé uniquement)</li>';
		$p[] = '<li>'.L::XL('data communication list 3').'</li>'; 
		
		//$p[] = '<li>Données de contact</li>';
		$p[] = '<li>'.L::XL('data communication list 4').'</li>'; 
		
		//$p[] = '<li>Données de sécurité (professionnels de la santé uniquement)</li>';
		$p[] = '<li>'.L::XL('data communication list 5').'</li>'; 
		
		$p[] = '<ul>';
		
		
	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');


	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Accès à vos données


	$p = Array();
	//$p[] = '<h1 class="pad">Qui peut visualiser vos données?</h1>';
	$p[] = '<h1 class="pad">'.L::XL('data visibility title').'</h1>';
		
	//$p[] = '<p>Il est important de noter que, contrairement à d\'autres produit existant sur l\'Internet (notamment les annuaires médicaux), votre inscription n\'est pas une inscription sur le service Mobminder. 
	//		Nous nous limitons à offrir à '.$dS_account->name.' un outil de prise de RDV en ligne et de gestion de planning. 
	//		Aucune de vos données n\'est utilisée ou récupérée pour servir une autre finalité que celle qui vous est offert par votre professionel '.$dS_account->name.'.</p>';
	$p[] = '<p>'.L::XL('data visibility intro').'</p>';

	//$p[] = '<p>Le personnel professionnel qualifié et mandaté par '.$dS_account->name.' aura accès à vos données personnelles.</p>';
	$p[] = '<p>'.L::XL('data visibility professional access').'</p>';

	//$p[] = '<p>Vos données à caractère confidentiel ne sont jamais partagées avec un autre professionnel, une autre société, ni confièes à un autre prestataire.</p>';
	$p[] = '<p>'.L::XL('data visibility confidentiality').'</p>';

	//$p[] = '<p>Le stockage des informations a toujours lieu dans un pays de l\'EU auprès d\'un fournisseur de stockage cloud respectueux de GDPR. Ce fournisseur de stockage cloud n\'a aucun accès à vos données.</p>';
	$p[] = '<p>'.L::XL('data visibility storage').'</p>';

	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');


	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Contact / plaintes


	$p = Array();
	//$p[] = '<h1 class="pad">Plainte, droit d’accès, d’opposition et de rectification</h1>';
	$p[] = '<h1 class="pad">'.L::XL('complaints and rights title').'</h1>';

	//$p[] = '<p>Si vous pensez que ce site internet ne respecte pas votre vie privée, veuillez en informer votre professionnel. Celui-ci nous soumettra votre requête. Nous mettrons tout en oeuvre pour déceler et corriger le problème. Vous pouvez également contacter directement Mobminder via ce site web: www.mobminder.com, en utilisant le formulaire de contact. SVP, indiquer nous quel professionel est concerné.</p>';
	$p[] = '<p>'.L::XL('complaints and rights intro').'</p>';

	/*$p[] = '<p>
		Moyennant demande écrite datée et signée envoyée à Mobminder, vous pouvez, après avoir justifié votre identité (copie de la carte d\'identité), 
		obtenir gratuitement la communication écrite des données à caractère personnel vous concernant ainsi que, le cas échéant, 
		la rectification de celles qui seraient inexactes, incomplètes ou non pertinentes.
		Une copie de vos données vous sera communiquée au plus tard 30 jours après l\'accusé de réception de votre demande.
		Vous disposez également du droit d\'exiger l\'effacement de vos données.
		</p>';*/
	$p[] = '<p>'.L::XL('complaints and rights request').'</p>';
	
	$div = '<div class="container">'.implode($p).'</div>';
	$div = str_replace($aliasvisitor,L::XL('visitor'),str_replace($accountname,$dS_account->name,$div));
	$html->pushHTML('<section class="" id="p1">'.$div.'</section>');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Footer
pushfooter();

$html->dropPage(); // sets the font


?>