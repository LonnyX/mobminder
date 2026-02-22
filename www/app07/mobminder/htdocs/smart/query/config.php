<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P    A P I   /   Q U E R Y    A C C O U N T    C O N F I G U R A T I O N
//

ob_start(); // relates to (*cc)
require '../smapplib.php';


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/webapp/smart/query/config.php?lgn=mobdev&pwd=bernard&kid=12413&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');
	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext = true, $perfReport);

$perfReport->peak('::loaded context and posted parameters');


	$logins = $context->gethumanloginsmin();

$perfReport->peak('::human logins loaded');


	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');

	
	$stream = '';

		//    A C C O U N T
			$fieldsA = Array('id','name','color','pattern','tag','note','language'
			,'GMT','visitorAlias','timeSlice','rangeIn','rangeOut'
			,'defaultGender','bCalsName','uCalsName','fCalsName'
			,'email','phoneRegion','phoneSlicing'
			,'usestandbylist','overdays','usetasks','usenotes','usechat','usefiles','useappaddress'
				,'defaultCssAppColor' ,'defaultCssAppPattern' ,'defaultCssAppTag' ,'defaultCssEventColor','defaultCssEventPattern','defaultCssEventTag'
				,'defaultCssFcalColor','defaultCssFcalPattern','defaultCssFcalTag','defaultCssVisitorColor','defaultCssVisitorPattern','defaultCssVisitorTag'
				,'defaultCssNoteColor','defaultCssNotePattern','defaultCssNoteTag','defaultCssTaskColor','defaultCssTaskPattern','defaultCssTaskTag'
				,'defaultCssChatColor','defaultCssChatPattern','defaultCssChatTag','defaultCssFileColor','defaultCssFilePattern','defaultCssFileTag'
			, 'cfgversion'
			, 'durationShortest', 'durationSteps', 'durationLongest'
			);
			$currentoffset = C_date::get_GMT0_timeOffset($context->dS_account);
			$context->dS_account->GMT = $currentoffset; // if we are in brussels, that is 2 hours from march to october and 1 hour during fall/winter
		$stream .= '#C_dS_group'.$nl.$context->dS_account->stream(no_tracking, '|', $fieldsA).$nl;
		
		
		//    R E S O U R C E S 
			$fieldsR = Array('id','resourceType','name','color','tag','signature','note','guideId');
		$stream .= $context->resources->stream(no_alias, no_bank, no_tracking, '|', $fieldsR);
		

		//    C U S T O M    C S S
			$fieldsC = Array('id','resaClass','cssType','name','css','note');
		$stream .= $context->customCsss->stream(no_alias, no_bank, no_tracking, '|', $fieldsC);
		
		
		
		
	// H O U R L I E S   (the streaming sequence must be respected)
	
		//    H O U R L I E S
			$fieldsH = Array('id','name','monday','periodicity','note','colorOff','colorExcp','colorAbsent');
		$stream .= $context->hourlies->setstringtimeformat()->stream(no_alias, no_bank, no_tracking, '|', $fieldsH);
	
		//    A C C O U N T    T I M E    B O X I N G 
			$fieldsT = Array('id','name','color','pattern','tag','note','exclusive');
		$stream .= $context->timeboxings->stream(no_alias, no_bank, no_tracking, '|', $fieldsT);
	
		//    H O U R L I E S    U S E R S
			$fieldsU = Array('groupId','hourlyId','dayIn');
		$stream .= $context->hourliesusers->setstringtimeformat()->stream(no_alias, no_bank, no_tracking, '|', $fieldsU);
	
		//    H O U R L I E S    T I M E   B O X E S
			$fieldsHT = Array('groupId','timeboxingId','cueIn','cueOut','dayCode');
		$stream .= $context->timeboxes->stream(no_alias, no_bank, no_tracking, '|', $fieldsHT);
	
		//    H O U R L I E S    S H A D O W S 
			$fieldsHS = Array('groupId','cueIn','cueOut','dayCode','exceptional');
		$stream .= $context->shadows->stream(no_alias, no_bank, no_tracking, '|', $fieldsHS);
		
		
		
		
	// W O R K   C O D E S
	
		//    E X P E R T S    F O R    W O R K   C O D E S 
			$fieldsE = Array('groupId','resourceId');
		$stream.= $context->workexperts->stream(no_alias, no_bank, no_tracking, '|', $fieldsE);
		
	
		//    T I M E   B O X I N G     F O R    W O R K   C O D E S 
			$fieldsX = Array('groupId','timeboxingId');
		$stream.= $context->worktboxings->stream(no_alias, no_bank, no_tracking, '|', $fieldsX);
		
		
		//    W O R K     C O D E S  (keep this after experts streaming)
			$fieldsW = Array('id','name','note','duration','staffing','cssColor','cssPattern','tag','ereservable');
		$stream.= $context->workcodes->stream(no_alias, no_bank, no_tracking, '|', $fieldsW);
		
		
		
		
	// L O G I N    D I S P L A Y    P R E F E R E N C E S 
	
		// H O R I Z O N T A L ,  V E R T I C A L ,   a n d   L I S T    d i s p l a y    P R E F E R E N C E S (grouped by key id)
			$fieldsD = Array('groupId','displayMode','resourceType','details','deviceType');
		$stream.= $context->details->stream(no_alias, no_bank, no_tracking, '|',$fieldsD);

		
		// C A T A L Y S T S   ( table display preferences, by key id)   -- not yet applicable for smartphone
			// $fieldsK = Array('groupId','catalyst','fields','sorton','sortdir');
		// $stream.= $context->catalysts->stream(no_alias, no_bank, no_tracking, '|',$fieldsK);




	// L O G I N S    F O R    C H A T,   N O T E S,   T A S K S
	//
			$sign 		= Array('id','gender','lastname','firstname','company','language','email','mobile','phone','profession');
			$options 	= Array('GMT','color','accessLevel','tag');
		$fieldsLm = array_merge($sign,$options);
		$stream.= $logins->stream(no_alias, no_bank, no_tracking, '|',$fieldsLm);



echo '<data>'; // enclose the datasets content within the stream
span('&ltdata&gt');		
	
		// D R O P     S T R E A M
		echo $stream;
		
		
span('&lt/data&gt');
echo '</data>';







//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

if($web) {
	
	pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
				
	
	h2('Returned objects');

		h3('Global account parameters'); pad();
			explainclass($context->dS_account, $fieldsA, '|');
			explainclass($context->resources, $fieldsR, '|');
			explainclass($context->customCsss, $fieldsC, '|');
			
		h3('Hourlies'); pad();
			explainclass($context->shadows, $fieldsHS, '|');
			explainclass($context->timeboxes, $fieldsHT, '|');
			explainclass($context->hourlies, $fieldsH, '|');
			explainclass($context->timeboxings, $fieldsT, '|');
			explainclass($context->hourliesusers, $fieldsU, '|');
		
		h3('Workcodes'); pad();
			explainclass($context->workexperts, $fieldsE, '|');
			explainclass($context->worktboxings, $fieldsX, '|');
			explainclass($context->workcodes, $fieldsW, '|');
	
		h3('User settings'); pad();
			explainclass($context->details, $fieldsD, '|');
			indent('<b>details bitfield description:</b>',6); pad(0);
			
			indent('schedule 		: 1<<0,',6);
			indent('resanote 		: 1<<1,',6);
			indent('attendance 		: 1<<2,',6);
			indent('visitor 		: 1<<3,',6);
			indent('registration	: 1<<4,',6);
			indent('mobile 			: 1<<5,',6);
			indent('visitorNote 	: 1<<6,',6);
			indent('workcodes 		: 1<<7,',6);
			indent('duration 		: 1<<8,',6);
			indent('color 			: 1<<9,',6);
			indent('extraspace		: 1<<10,',6);
			indent('smsstatus 		: 1<<11,',6);
			indent('hideoffdays		: 1<<13,',6);
			indent('hidesection		: 1<<14,',6);
			indent('birthdate		: 1<<15,',6);
			indent('address			: 1<<16,',6);
			indent('timeboxing		: 1<<17,',6);
			indent('fixline			: 1<<18,',6);
			indent('zipcode			: 1<<19,',6);
			indent('reference		: 1<<20,',6);
			indent('language		: 1<<21,',6);
			indent('rtags			: 1<<22, reservations tags',6); 	//
			indent('adaptative		: 1<<23, graphical display span extends to daily hourly limits, instead of the account specified display span',6); //
			indent('emptytboxes		: 1<<24, display empty timeboxes in the list view',6); //
			indent('vtags			: 1<<25, visitors tags',6); 				//
			indent('disbltips		: 1<<26, disable yellow tips display',6); 	//
			indent('hidesrchasst	: 1<<27, hides the search assistent',6); 	//
			indent('maxValue		: 1<<28, there is room up to 64 bits',6); 	//


		pad(); h3('Logins'); pad();
			indent('The following list of logins has 2 purposes:',3);
			indent('- display the full name of the deletor, only deletorId is passed through tracking.',6);
			indent('- display bullet and full name of a chat participant in the chat thread.',6);
			pad(0);
			explainclass($logins, $fieldsLm, '|');
			
	pad();
	h2('Feedback payload');
	payload();
	
	pad();
}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

$perfReport->peak('::protocol streamed');
$perfReport->dropReport(); // no perf report for production

endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>