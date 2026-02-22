<?php
//////////////////////////////////////////////////////////////////////
//
//    S M A R T     A P P     A P I     /      Q U E R Y    C H A T    T H R E A D S    I T E M S 
//


ob_start(); // relates to (*cc)
require '../smapplib.php';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    C R E D E N T I A L S     A N D     C O N T E X T 
//


$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$cid = $context->request_cid($mandatory = false, $virtual = false, $archive = true);	

$perfReport->peak('::api context set up');




//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	h3('Checking for optional fields');
	
	

		$archived = '';
		if($cid) {
			$chatthread = new C_dS_chat_thread($cid); 
			$archived = '(live)'; if($chatthread->archived) $archived = '(archived)';
		}
	
		indent('o cid: '.($cid?$cid.' '.$archived:'(not specified, all chats where calling login is implied)').'',6);
		
		
	$hasarch = false; $arch = @$_REQUEST['arch']; if(isset($arch)) { $arch = !!$arch; $hasarch = true; } else { $arch = false; };
	$hasvid = false; $vid = @$_REQUEST['vid']; if(isset($vid)) { $hasvid = true; } else { $vid = false; };
	
	if($hasvid)	{
		if(!is_numeric($vid)) abort('3010','chatitems::vid has a wrong format');
		$dS_visitor = new C_dS_visitor($vid);
		if(!$dS_visitor->id) abort('3011','chatitems::visitor does not exists');
		if(!$dS_visitor->id) abort('3011','chatitems::visitor does not exists');
		indent('o vid: '.$vid.' ('.$dS_visitor->lastname.')',6);
	}
	else
		indent('o vid: '.'(not specified)',6);
	
	
	if($cid) {
		$art = ''; if($chatthread->archived) $art = 'archive_'; // $art is for archive table
		indent('o arch: implicit from cid '.$archived, 6);

	} else {
		
		indent('o arch: '.($arch?'yes, only archive table will be looked up':($hasarch?'no, live chat table query':'not specified, defaults to live chat table query')).'',6);
		$art = ''; if($arch) $art = 'archive_';
	}
	
	
	
	$hasinclbin = false; $inclbin = @$_REQUEST['bin']; if(isset($inclbin)) 	{ $inclbin = !!$inclbin; $hasinclbin = true;  }	else { $inclbin = false; }
		
	if($hasinclbin)	
		indent('o inclbin: '.($inclbin?'yes, deleted items will be included':'no').'',6);
	else
		indent('o inclbin: '.'(not specified, defaults to exclusive deleted items)',6);




//////////////////////////////////////////////////////////////////////
//
//   L O A D    C H A T S    D A T A  
//
//

	$chat_threads 	= new C_dbAccess_chat_threads($cid, $art);
if($cid) {
	$chatsIds = $cid;
	$chat_threads->add($chatthread, $cid);
} else if($vid) {
	$chatsIds = $chat_threads->loadOnVisitor($vid, $context->dS_account->id, $inclbin);
}
	else {
		$chatsIds = $chat_threads->loadOnLogin($context->dS_login->id, $context->dS_account->id, $inclbin);
	}

	
$participants 	= new C_dbAccess_chat_participants(false, $art);
	$loginIds = $participants->loadOnGroup($chatsIds)->getLoginIdsList();
	
$logins 		= new C_dbAccess_logins($loginIds);

$visitors 		= new C_dbAccess_visitors();
$visirefs 		= new C_dbAccess_chat_visirefs(false, $art);

	$visirefs->loadOnGroup($chatsIds);
	$visitors->loadOnId($visirefs->getList('visiId'), false);

if($visitors->count())
	foreach($visitors->keyed as $vid => $dS_visitor) { // PVH 2025-01 : preserve the older versions of the smartapp from the new language_code_luxembourgish and gender_code_other
		if($dS_visitor->language==language_code_luxembourgish) $dS_visitor->language=language_code_french;
		if($dS_visitor->gender==gender_code_other) $dS_visitor->language=gender_code_female;
	}

$perfReport->peak('STEP 2 done::data loaded');




//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	$fieldsL = C_api::fieldslist('C_dS_login');
	$fieldsV = C_api::fieldslist('C_dS_visitor');


echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');

		echo $chat_threads->stream(no_alias);
		echo $logins->stream(no_alias, no_bank, no_tracking, '|', $fieldsL);
		echo $participants->setstringtimeformat()->stream(no_alias);
		echo $visitors->stream(no_alias, no_bank, no_tracking, '|', $fieldsV); 
		echo $visirefs->stream(no_alias);
	
span('&lt/data&gt');
echo '</data>';

echo $nl.$nl;
	
// echo '<chatpeek>';
// span('&ltchatpeek&gt');

	// $peekstream = implode($nl,$p->stream());
	// echo $peekstream;

// span('&lt/chatpeek&gt');
// echo '</chatpeek>';




//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
	
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o There is no mandatory input data for this query, the process relies on the credentials',6);
		
		
	pad(0); h2('Returned data for &ltchatpeek&gt');
		indent('Each line is made from the following string of integers',6);
		indent('accountId - chatId - phylcount - physseen - partisum',6);
		indent('where:',6);
		indent('o accountId is the accound scope for the following data on the same line (big int)',8);
		indent('o chatId is the chat thread id (big int)',8);
		indent('o phylcount is the number of actual  phylacteries attached to the chat thread (int)',8);
		indent('o physseen is the number of phylacteries sent to your login so far, using a call to /chatphyls.php with the same login',8);
		indent('o partisum is the number of actual participants in the chat thread',8);
		pad(0);
		indent('So, you get one line for each chatthread you are involved into, cross accounts.',6);
		

	pad(0); h2('Returned objects &ltdata&gt');

	explainclass($chat_threads	, all_fields, '|');
	explainclass($participants	, all_fields, '|');
	explainclass($visirefs		, all_fields, '|');
	explainclass($logins		, $fieldsL, '|');
	explainclass($visitors		, $fieldsV, '|');		
}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 


pad();
$perfReport->peak('::protocol streamed');
$perfReport->dropReport(); // no perf report for production


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE

?>