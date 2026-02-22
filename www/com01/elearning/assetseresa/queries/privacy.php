<?php
///////////////////////////////////////////////////////////////////////////////////
//
//  STANDARD PRIVACY POLICY FOR PATIENTS / CLIENTS of OUR MOBMINDER PROFESSIONAL USERS
//

require '../../../../mobminder/lib_mobphp/dbio.php';
require '../../../../mobminder/lib_mobphp/chtml.php';
require '../../_assets/classes/language.php';

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


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Produce responsive content
//
$html = new C_html();

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
$html->pushScriptInclude('text/javascript', '../jquery/jquery-3.2.1.js');
$html->pushScriptInclude('text/javascript', '../jquery/jquery.rightClick.js');

// generic api
$html->pushScriptInclude('text/javascript', '../jscripts/iscroll.5.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/mobframe_IE.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/language.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/datasets.js?b='.$baseline);
$html->pushScriptInclude('text/javascript', '../jscripts/controls.js?b='.$baseline);

// attach the js that is specific to this page
//$html->pushScriptInclude('text/javascript', './install.js?b='.$baseline);




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page h1 Title

$html->pageTitle('Mobminder - Privacy policy');

		$icon = '<div class="fa fa-2x fa-user-secret" style="color:steelblue; text-align:left; display:inline-block; padding-right:.5em;"></div>';
	$title = '<h1 style="color:white; padding-bottom:.5em; padding-top:.2em;">'.$icon.'Politique de confidentialité'.'</h1>';
$html->pushHTML('<section class="s-h1 minder-background" style="margin-bottom:2em;" id="s-h1">'.$title.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Page main image
//

$img = '<img src="../imgs/custom/mobminder-logo-800-336.gif" style="vertical-align:top; height:auto; max-width:100%; max-height:150px;"/>';
$img = '<div style="text-align:center;">'.$img.'</div>'; 

$html->pushHTML('<section class="s-img" id="s-img">'.$img.'</section>');




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

	
$language = new L($dS_account->language, $dS_account->visitorAlias);



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Généralités


	$p = Array();
		$p[] = '<h1 class="pad">Généralités</h1>';
		
		$p[] = '<p>Nous traitons vos données de manière confidentielle et conformément aux dispositions nationales et internationales, dont entre autres la loi belge du 8 décembre 1992, relative à la protection de la vie privée à l\' égard du traitements de données à caractère personnel, modifiée par la loi du 11 décembre 1998.</p>';
		$p[] = '<p>Le site internet de votre professionnel ('.$dS_account->name.') est édités par Cloud-Tech sprl, rue du Brillant 86 à 1170 Bruxelles en Belgique. Cloud-Tech respecte la directive Européenne GDPR.</p>';
		$p[] = '<p>Nous attachons une grande importance à la protection de vos données à caractère personnel et prenons par conséquent des mesures techniques et organisationnelles appropriées pour les sécuriser et les protéger notamment contre toute perte, modification ou accès non autorisé.</p>';
		$p[] = '<p>Aucune information (qu\'elle soit confidentielle ou pas) n\'est stockée dans un cookies de session par ce site internet. 
					Après la fermeture de la page Web (ou du navigateur), aucune information ne reste enregistrée sur la machine que vous avez utilisée pour prendre un RDV.</p>';
	
	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Consentement


	$p = Array();
		$p[] = '<h1 class="pad">Consentement</h1>';
		
		$p[] = '<p>Votre professionnel utilise cette page de prise de RDV en ligne afin de vous aider à prendre un RDV facilement via l\'Internet. 
				Votre professionnel a signé une convention avec Mobminder. Il est informé des responsabilités de chacun. Il agit en responsable de la collecte de données.
				Il a été informé en détail des mesures prises par Mobminder pour respecter vos données confidentielles. 
				Mobminder se limite à lui fournir l\'outil de prise de RDV en ligne. Les responsabilités de Mobminder/cloud-Tech sprl dans le traitement de données sont décrites ci-dessous.</p>';
		$p[] = '<p>Si vous êtes déjà '.L::XL('visitor').' chez '.$dS_account->name.', vous avez déjà donné votre consentement directement auprès de votre professionnel.</p>';
		$p[] = '<p>Si vous n\'êtes pas encore '.L::XL('visitor').' chez '.$dS_account->name.', lisez attentivement la suite. L\'utilisation du service d\'inscription en ligne implique votre consentement.</p>';
		$p[] = '<p>Vous êtes libre de décider de nous communiquer (ou non) vos données à caractère personnel. Notez toutefois que si vous décidez de ne pas nous faire part de certaines données, 
				nous ne serons pas en mesure de traiter vos données aux fins précitées. Vous ne pourrez alors pas effectuer de réservation en ligne, 
				ni recevoir de confirmation ou rappel, ni profiter de nos services.</p>';
		$p[] = '<p>Dans le cadre du Règlement Général de Protection des Données et en donnant votre consentement via le formulaire de réservation en ligne, 
				vous donnez à '.$dS_account->name.' votre consentement explicite au traitement de vos données à caractère personnel tel qu’expliqué ci-dessous.</p>';


	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');

		
		

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Traitement de vos données personnelles


	$p = Array();
		$p[] = '<h1 class="pad">Traitement de vos données:</h1>';
		$p[] = '<p>Pour le compte de '.$dS_account->name.', Mobminder est chargé du traitement suivant:</p>';
		$p[] = '<ul>';
		$p[] = '<li>Votre inscription dans le registre '.L::XL('visitor').' du professionnel concerné ('.$dS_account->name.')</li>';
		$p[] = '<li>La réservation d’un rendez-vous, uniquement chez/à '.$dS_account->name.'</li>';
		$p[] = '<li>La gestion de vos rendez-vous (consulter, modifier ou supprimer) par vous-même.</li>';
		$p[] = '<li>L\'envoi de communications (par e-mail, SMS ou autre) liées à l\'utilisation de ce service, à vos rendez-vous, 
					à vos données personnelles ou des informations générales ou juridiques concernant les services de Mobminder. Ces communications se limitent exclusivement à votre interaction avec '.$dS_account->name.'.</li>';
		$p[] = '<li>Le stockage et la sécurité des données d\'agenda relatives, inclus les divers communications échangées avec '.$dS_account->name.'.</li>';
		$p[] = '</ul>';
		$p[] = '<p>
			Nous traitons vos données à caractère personnel aussi longtemps qu’elles sont nécessaires dans le cadre de notre contrats de services avec '.$dS_account->name.'.
			Il est en outre possible que la loi nous impose de conserver les données pendant un certain temps. 
			A défaut d\'autre mesure juridique pré-emptive, vous avez le droit de consulter vos données et de les (faire) corriger ou effacer.</p>';
		
	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');





///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// But du traitement de vos données personnelles


	$p = Array();
		$p[] = '<h1 class="pad">Quelles données devez-vous communiquer?</h1>';
		
		$p[] = '<p>Si vous êtes déjà '.L::XL('visitor').' de '.$dS_account->name.', vous avez déjà communiqué les données nécessaires à votre professionnel. Le système de prise de RDV en ligne se limitera à vérifier votre identité.</p>';
		$p[] = '<p>Si vous n\'êtes pas encore '.L::XL('visitor').' de '.$dS_account->name.', les données suivantes sont requises:</p>';
		$p[] = '<ul>';
		$p[] = '<li>Données d’identité</li>';
		$p[] = '<li>Date de naissance (professionnels de la santé uniquement)</li>';
		$p[] = '<li>Données de localisation (professionnels de la santé uniquement)</li>';
		$p[] = '<li>Données de contact</li>';
		$p[] = '<li>Données de sécurité (professionnels de la santé uniquement)</li>';
		$p[] = '<ul>';
		
		
	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');


	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Accès à vos données


	$p = Array();
		$p[] = '<h1 class="pad">Qui peut visualiser vos données?</h1>';
		
		$p[] = '<p>Il est important de noter que, contrairement à d\'autres produit existant sur l\'Internet (notamment les annuaires médicaux), votre inscription n\'est pas une inscription sur le service Mobminder. 
				Nous nous limitons à offrir à '.$dS_account->name.' un outil de prise de RDV en ligne et de gestion de planning. 
				Aucune de vos données n\'est utilisée ou récupérée pour servir une autre finalité que celle qui vous est offert par votre professionel '.$dS_account->name.'.</p>';
		$p[] = '<p>Le personnel professionnel qualifié et mandaté par '.$dS_account->name.' aura accès à vos données personnelles.</p>';
		$p[] = '<p>Vos données à caractère confidentiel ne sont jamais partagées avec un autre professionnel, une autre société, ni confièes à un autre prestataire.</p>';
		$p[] = '<p>Le stockage des informations a toujours lieu dans un pays de l\'EU auprès d\'un fournisseur de stockage cloud respectueux de GDPR. Ce fournisseur de stockage cloud n\'a aucun accès à vos données.</p>';
		
	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');


	

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Contact / plaintes


	$p = Array();
		$p[] = '<h1 class="pad">Plainte, droit d’accès, d’opposition et de rectification</h1>';
		$p[] = '<p>Si vous pensez que ce site internet ne respecte pas votre vie privée, veuillez en informer votre professionnel. Celui-ci nous soumettra votre requête. Nous mettrons tout en oeuvre pour déceler et corriger le problème. Vous pouvez également contacter directement Mobminder via ce site web: www.mobminder.com, en utilisant le formulaire de contact. SVP, indiquer nous quel professionel est concerné.</p>';
		$p[] = '<p>
	Moyennant demande écrite datée et signée envoyée à Mobminder, vous pouvez, après avoir justifié votre identité (copie de la carte d\'identité), 
	obtenir gratuitement la communication écrite des données à caractère personnel vous concernant ainsi que, le cas échéant, 
	la rectification de celles qui seraient inexactes, incomplètes ou non pertinentes.
	Une copie de vos données vous sera communiquée au plus tard 30 jours après l\'accusé de réception de votre demande.
	Vous disposez également du droit d\'exiger l\'effacement de vos données.
	</p>';
	
	$div = '<div class="container">'.implode($p).'</div>';

$html->pushHTML('<section class="" id="p1">'.$div.'</section>');




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Footer


$html->dropPage(); // sets the font

?>