<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    A C C O U N T    C O N F I G U R A T I O N
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//

//  
//  girafongtw01
//  ensuite sudo su M0bM1nD3rgtw01!
//  cd /root
//  journalctl -f -u aigtw			  << assistant
//  journalctl -f -u aigtwbooking     << booking
//
//  webapp : 2025pvanhove / 2025pvanhove


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/app07/mobminder/ai/query/config_booking.php?lgn=PVH&pwd=2025&kid=10547&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//

// [12:54, 09/12/2024] Pascal: o Comment tu t'appelles?
// [12:54, 09/12/2024] Pascal: o Toi Moby tu es une dame ou un monsieur?
// [12:54, 09/12/2024] Pascal: o Tu peux me dire si on est le soir ou l'après-midi?
// [12:54, 09/12/2024] Pascal: o Quel jour sommes nous?
// [12:54, 09/12/2024] Pascal: o Quelle heure il est?
// [12:54, 09/12/2024] Pascal: o Est-ce que nos conversations sont confidentielles?
// [12:54, 09/12/2024] Pascal: o Donc tu me confirmes que aucune de nos données ne sont utilisées pour entrainer ou alimenter ton modèle génératif?


// [12:55, 09/12/2024] Pascal: o Quel est le nom de notre établissement?
// [12:54, 09/12/2024] Pascal: o quel est le nom de mon agenda?
// [12:54, 09/12/2024] Pascal: o A quelle heure se termine mon dernier RDV de la journée?
// [12:56, 09/12/2024] Pascal: o Traville-t-on avec des patients? ou avec des clients?
// [12:56, 09/12/2024] Pascal: o Quel est le prix de la plus chère de nos prestations?
// [12:56, 09/12/2024] Pascal: o Quel est la durée de la plus longue de nos prestations?
// [12:57, 09/12/2024] Pascal: o Qui est le dernier patient que je vois aujourd'hui, à quelle heure?
// [12:54, 09/12/2024] Pascal: o la date de naissance de (un patient choisi dans la liste)?
// [12:57, 09/12/2024] Pascal: o Donne moi toutes les informations disponible à propos de ce patient.
// [12:59, 09/12/2024] Pascal: o Donne moi 3 disponibilités pour (la prestation la plus chère) et à des dates différentes.
// [13:01, 09/12/2024] Pascal: o Combien demandons nous pour une consultation?
// [13:01, 09/12/2024] Pascal: o Y-a-t'il un RDV aujourd'hui dans lequel il y a deux patients?
// [13:01, 09/12/2024] Pascal: o Se trouvait il dans mon agenda des RDVs qui ont été effacés?

// [12:54, 09/12/2024] Pascal: o Qu'est-ce que tu penses du problème du réchauffement climatique ?
// [12:54, 09/12/2024] Pascal: o Est-ce que je peux te parler à n'importe quelle heure? Même en pleine nuit?
// [12:54, 09/12/2024] Pascal: o Et tu n'es jamais malade?
// [12:54, 09/12/2024] Pascal: o Est-ce que tu es parfois de mauvaise humeur?

// [12:54, 09/12/2024] Pascal: o Si je croise un dynausore dans mon bureau, à quelle époque est-ce que je vis?

// [12:54, 09/12/2024] Pascal: o Peux-tu envoyer un SMS à mon épouse pour lui indiquer que j'aurai 30 minutes de retard pour le diner?

// [12:54, 09/12/2024] Pascal: o Les technologies récentes en matière de téléviseur?
// [12:54, 09/12/2024] Pascal: o Tu peux me resneigner trois constructeurs d'enceintes acoustiques de très haute fidélité, les trois marques principales qui produisent des enceintes?
// [12:54, 09/12/2024] Pascal: o J'aimerais faire l'achat d'enceintes acoustiques de très haute fidélité. Est-que tu peux déjà m'indiquer trois marques de grande réputation dans le domaine?



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext = true, $perfReport);
$context->workcodes->magnify4AI($context->workexperts,$context->worktboxings);

$perfReport->peak('::loaded context and posted parameters');


	$logins = $context->gethumanloginsmin();

$perfReport->peak('::human logins loaded');

$rscid = @$_REQUEST['rscid']; if(!isset($rscid)) $rscid = 0; // rscid like '60215' is the rscid that was enabled on the smartphone screen when walling AI. By default, this agenda will be agenda that AI uses to query/post data.

$agendaname = '';
if($rscid) {
	$agendaname = $context->isValidResource($rscid); // returns false in case of an invalid rscid
	if(!$agendaname) abort('0020','The specified rscid does not belong to any C_dS_resource instances in this C_dS_account');
} else {
	foreach($context->resources->keyed as $rid => $dS_resource) break; // keeps the first one
	$agendaname = $dS_resource->name;
	$rscid = $dS_resource->id;
}
$rscscnt = $context->resourcesCount(); // number of resources in this view

$perfReport->peak('::parameters loaded');



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   L O A D    D A T A   

	if($web) {
		h2('Query complete');
		notice('The following blueprint is the server payload response when not in web mode.');
	}

	
	$stream = '';

		//    A C C O U N T
			// $fieldsA = Array('id','name'
			// ,'GMT','visitorAlias','timeSlice','rangeIn','rangeOut'
			// ,'defaultGender','bCalsName','uCalsName','fCalsName'
			// ,'email','phoneRegion'
			// ,'overdays','usetasks','usenotes','usechat','useappaddress'
			// , 'ePayActive', 'ePayBenefName', 'ePayBenefIBAN', 'ePayBenefBIC'
			// );
			$fieldsA = Array('id','name','visitorAlias','email');
			$currentoffset = C_date::get_GMT0_timeOffset($context->dS_account);
			$context->dS_account->GMT = $currentoffset; // if we are in brussels, that is 2 hours from march to october and 1 hour during fall/winter
		
		
		if($jason) $stream .= '#C_dS_account'.$nl.$context->dS_account->jason(no_tracking, '', $fieldsA).$nl;
		else $stream .= '#C_dS_account'.$nl.$context->dS_account->stream(no_tracking, '|', $fieldsA).$nl;
		
		
		//    R E S O U R C E S 
			$fieldsR = Array('id','groupId','name');
		if($jason) $stream .= $context->resources->jason4AI(no_tracking, $fieldsR);
		else $stream .= $context->resources->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);
		

		//    C U S T O M    C S S
			// $fieldsC = Array('id','resaClass','cssType','name','css','note');
		// $stream .= $context->customCsss->stream(no_alias, no_bank, no_tracking, '|', $fieldsC);
		
		
		
		
	// H O U R L I E S   (the streaming sequence must be respected)
	
		//    H O U R L I E S
			// $fieldsH = Array('id','name','monday','periodicity','note','colorOff','colorExcp','colorAbsent');
		// $stream .= $context->hourlies->setstringtimeformat4AI()->stream(no_alias, no_bank, no_tracking, '|', $fieldsH);
	
		//    A C C O U N T    T I M E    B O X I N G 
			// $fieldsT = Array('id','name','color','pattern','tag','note','exclusive');
		// $stream .= $context->timeboxings->stream(no_alias, no_bank, no_tracking, '|', $fieldsT);
	
		//    H O U R L I E S    U S E R S
			// $fieldsU = Array('groupId','hourlyId','dayIn');
		// $stream .= $context->hourliesusers->setstringtimeformat4AI()->stream(no_alias, no_bank, no_tracking, '|', $fieldsU);
	
		//    H O U R L I E S    T I M E   B O X E S
			// $fieldsHT = Array('groupId','timeboxingId','cueIn','cueOut','dayCode');
		// $stream .= $context->timeboxes->stream(no_alias, no_bank, no_tracking, '|', $fieldsHT);
	
		//    H O U R L I E S    S H A D O W S 
			// $fieldsHS = Array('groupId','cueIn','cueOut','dayCode','exceptional');
		// $stream .= $context->shadows->stream(no_alias, no_bank, no_tracking, '|', $fieldsHS);
		
		
		
		
	// W O R K   C O D E S
	
		//    E X P E R T S    F O R    W O R K   C O D E S 
			// $fieldsE = Array('groupId','resourceId');
		// $stream.= $context->workexperts->stream(no_alias, no_bank, no_tracking, '|', $fieldsE);
		
	
		//    T I M E   B O X I N G     F O R    W O R K   C O D E S 
			// $fieldsX = Array('groupId','timeboxingId');
		// $stream.= $context->worktboxings->stream(no_alias, no_bank, no_tracking, '|', $fieldsX);
		
		
		//    W O R K     C O D E S  (keep this after experts streaming)
			$fieldsW = Array('id','name','note','duration','price');
		if($jason) $stream .= $context->workcodes->jason4AI(no_tracking, $fieldsW);
		else $stream.= $context->workcodes->stream(no_alias, no_bank, no_tracking, '|', $fieldsW);
		
		
		
		
	// L O G I N    D I S P L A Y    P R E F E R E N C E S 
	
		// H O R I Z O N T A L ,  V E R T I C A L ,   a n d   L I S T    d i s p l a y    P R E F E R E N C E S (grouped by key id)
			// $fieldsD = Array('groupId','displayMode','resourceType','details','deviceType');
		// $stream.= $context->details->stream(no_alias, no_bank, no_tracking, '|',$fieldsD);

		
		// C A T A L Y S T S   ( table display preferences, by key id)   -- not yet applicable for smartphone
			// $fieldsK = Array('groupId','catalyst','fields','sorton','sortdir');
		// $stream.= $context->catalysts->stream(no_alias, no_bank, no_tracking, '|',$fieldsK);




	// L O G I N S    F O R    C H A T,   N O T E S,   T A S K S
	//
			// $sign 		= Array('id','gender','lastname','firstname','company','language','profession');
			$sign = Array('id','gender','lastname','firstname','language','email','mobile');
		$fieldsLm = array_merge($sign);
		if($jason) $stream .= $logins->jason4AI(no_tracking, $fieldsLm);
		else $stream.= $logins->stream('C_dS_collaborator', no_bank, no_tracking, '|',$fieldsLm);
		


// echo $nl;


$who = $context->dS_login->firstname;


//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   M O D E L     t o    A I   S I D E 

	
	wo_pad();
	// technicalspecH1();
	
	if($web) {
		h2('Input parameters');
		exlainloginputs(); 
	}
	
	htmlvisibletag('datamodel');	

		h3('Global account parameters'); wo_pad();
			explainclass($context->dS_account, $fieldsA, '|');
			explainclass($context->resources, $fieldsR, '|');
			// explainclass($context->customCsss, $fieldsC, '|');
			
		// h3('Hourlies'); pad();
			// explainclass($context->shadows, $fieldsHS, '|');
			// explainclass($context->timeboxes, $fieldsHT, '|');
			// explainclass($context->hourlies, $fieldsH, '|');
			// explainclass($context->timeboxings, $fieldsT, '|');
			// explainclass($context->hourliesusers, $fieldsU, '|');
		
		h3('Workcodes'); wo_pad();
			// explainclass($context->workexperts, $fieldsE, '|');
			// explainclass($context->worktboxings, $fieldsX, '|');
			explainclass($context->workcodes, $fieldsW, '|');
	
		$fieldsV = C_api::fieldslist('C_dS_visitor'); // those fields list are centralized in aiapilib.php in such a way that they stay coherent all over the api
		$fieldsRsa = C_api::fieldslist('C_dS_reservation');
		$fieldsAV = C_api::fieldslist('C_dS_availability');
		
		h3('Visitors'); wo_pad();
			explainclass(new C_dS_visitor(), $fieldsV, '|');
	
		h3('Reservations'); wo_pad();
			explainclass(new C_dS_reservation(), $fieldsRsa, '|');
	
		h3('Availabilities'); wo_pad();
			explainclass(new C_dS_availability(), $fieldsAV, '|');


		if($web) { 
			wo_pad(); h3('Logins'); wo_pad();
			indent('The following list of logins has 2 purposes:',3);
			indent('- display the full name of the deletor, only deletorId is passed through tracking.',6);
			indent('- display bullet and full name of a chat participant in the chat thread.',6);
			wo_pad(0);
		}
		explainclass($logins, $fieldsLm, '|');
				
	htmlvisibletag('/datamodel');
	wo_pad();

	// htmlvisibletag('guidelines');
	// htmlvisibletag('/guidelines');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P     S T R E A M


	htmlvisibletag('data');	
	
		echo $stream;
		
	htmlvisibletag('/data');



//////////////////////////////////////////////////////////////////////////////////////////
//
//   R O L E

	wo_pad();
	h2('AI role description');

$whoid = $context->dS_login->id;
$wholang = ''; // english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8
switch($context->dS_login->language) {
	case 0 : $wholang = 'english'; break;
	case 1 : $wholang = 'french'; break;
	case 2 : $wholang = 'polish'; break;
	case 3 : $wholang = 'dutch'; break;
	case 4 : $wholang = 'german'; break;
	case 5 : $wholang = 'italian'; break;
	case 6 : $wholang = 'spanish'; break;
	case 7 : $wholang = 'portuguese'; break;
	case 8 : $wholang = 'luxembourgish'; break;
}
$whohisher = 'his'; // english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8
switch($context->dS_login->gender) {
	case gender_code_male:
	case gender_code_boy: break;
	case gender_code_female:
	case gender_code_miss:
	case gender_code_girl: $whohisher = 'her'; break;
	case gender_code_sa:
	case gender_code_sprl:
	case gender_code_other: $whohisher = 'their';	break;
}
$visialias = '';
switch($context->dS_account->visitorAlias) {
	case 100 : $visialias = 'client'; break;
	case 200 : $visialias = 'patient'; break;
	case 100 : $visialias = 'participant'; break;
}
$frenchvariation = '';
switch($context->dS_account->phoneRegion) { // gpt-4o-realtime-preview-2024-12-17
	case 32 : $frenchvariation .= 'Belgium. Numbers in the 90\'s are spoken "nonante" (iso "quatre-vingt-dix") and numbers in the 70\'s are spoken "septante" (iso "soixante-dix"). For example, 73 is spoken "septante-trois".'; break; // beglian french
	case 41 : $frenchvariation .= 'Switzerland. Numbers in the 90\'s are "nonante" (iso "quatre-vingt-dix"), numbers in the 80\'s are spoken "octante" (iso "quatre-vingts") and numbers in the 70\'s are spoken "septante" (iso "soixante-dix"). For example, 83 is spoken "octante-trois"'; break; // switzerlands french
	// case 33 : $frenchvariation = 'patient'; break; // genuine french : nothing should be specified in the role
}
if($frenchvariation) $frenchvariation .= ' Please respect this dialectal variation when expressing related numbers.';
if($rscscnt>1&&$agendaname) { // multi account, then we spcify to AI what resource to use as default. // rscid=12773&
}

	htmlvisibletag('role');
	
		if($web) echo '<div>';
		echo 'CONTEXT:';
		echo $nl.'• You are Mindy, the AI planning assistant of Mobminder, having access to planning and visitors data in an organisation that runs on appointments.';
		echo $nl.'• The business you assist is "'.$context->dS_account->name.'", and you basically answer inbound calls from '.$visialias.'s.';
		echo $nl.'• What you tell about Mobminder when asked: Mobminder is a Belgian-based company that provides cutting-edge planning solutions for professionals who manage appointments.';
		
		echo $nl.'TALKING:';
		echo $nl.'• Start the conversation in '.$wholang.'. If the caller starts interacting in a new language, then follow him and use IMMEDIATELY this new language.';
		echo $nl.'• You sound good-humoured and smiley. If the caller makes a joke or presents an offbeat or absurd situation, acknowledge it with some laughing "Haha haha" and optionally respond with a related joke.';
		echo $nl.'• If you receive an empty audio input (no voice, no message), respond the caller that you are listening.';
		
		echo $nl.'DATA PROVIDED BY TOOLS:';
		echo $nl.'• Before you provide any private data to the caller, an authentication will happen. That is part of all our use cases. Just proceed with the caller demand, we will authenticate them in due time.';
		echo $nl.'• Stick to simple text, do not use Markdown language, use only values explicitly present in <data>. Do not infer, estimate or generate additional details.';
		echo $nl.'• Present lists from the first to the last inclusively in a single continuous sentence, avoiding line breaks, hyphens, or omissions. Ensure no items are skipped, and each item\'s data is correctly aligned.';
		echo $nl.'• Each time before speaking, double-check that your speech respects one by one each point of the provided <data>.';
		echo $nl.'• You definitely never generate data from information found outside the scope of our tools <data> section responses. When data is not available, you just say so.';
		echo $nl.'• For any query around agenda data that is outside the scope of your tools ability, you just state: "Sorry, I do not have permission to provide this data.".';
		
		// echo $nl.'SPECIFICS ABOUT TOOLS:';
		// echo $nl.'• When the caller does not specify any date but only a time, they mean TODAY, use our tool get_local_date_time to obtain today date in YYYY-MM-DD format.';
		
		echo $nl.'NON AGENDA TOPICS: (e.g., science, economy, nature, etc.),';
		echo $nl.'• Demonstrate a high level of expertise with clear, concise, and well-structured answers.';
		echo $nl.'• Do not repeat the caller\'s question in your response. Provide only a concise summary of the requested answer or relevant information.';

		echo $nl.'DATA MODEL:';
		echo $nl.'• In the previous <datamodel> section, you learned and understood our data model, double-check it now that you understood your role.';
		echo $nl.'• In the tools descriptions, we refer to a <data> class field by using \'->\', for example C_dS_visitor->firstname refers to the firstname of the caller.';
		echo $nl.'• If a tool returns an error or an odd result, report it as is to the caller without attempting to interpret or correct the issue yourself.';

		echo $nl.'TYPICAL CONVERSATIONAL SCENARIOS: (SCENARIO == USE CASE)';
		echo $nl.'• the caller wants to schedule a new appointment.';
		echo $nl.'• the caller wants to cancel an existing appointment.';
		echo $nl.'• the caller wants to replan an existing appointment.';
		echo $nl.'• the caller wants to be reminded an existing appointment.';
		echo $nl.'• the caller wants to leave a message.';
		echo $nl.'• the caller wants to inquiry about general information about our business (opening time, location, ...).';
		echo $nl.'• If the caller enquires about what we\'re capable of with regard to agenda management, tell him about the up above scenarios.';
		if($web) echo '</div>';
		
		echo $nl;
	htmlvisibletag('/role');


	wo_pad();
	

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>