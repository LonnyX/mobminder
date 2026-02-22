<?php
//////////////////////////////////////////////////////////////////////
//
//   S M A R T     A P P     A P I     /     G L O B A L    C H A T    T H R E A D S     S T A T U S      Q U E R Y 
//
//   See also ./chatpush.php
//
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
$lid = $context->dS_login->id;

$perfReport->peak('::api context set up');



//////////////////////////////////////////////////////////////////////////////////////////
//
//    D A T A    Q U E R Y 



$p = new C_chat_peek_smapp($lid);
$perfReport->peak('::queried');



//////////////////////////////////////////////////////////////////////////////////////////
//
//     D R O P    D A T A    T O    C L I E N T    S I D E



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
echo '<chatpeek>';
span('&ltchatpeek&gt');

	$peekstream = implode($nl, $p->stream());
	echo $peekstream;

span('&lt/chatpeek&gt');
echo '</chatpeek>';

echo $nl.$nl;

echo '<pars>'; // enclose the file content within the stream
span('&ltpars&gt');

	echo 'forepace=60'.$nl; // rythm for updating the little icon in the green bottom bar
	echo 'realpace=9'.$nl; // rythm for updating the list of chat threads (*lag01*)
	
span('&lt/pars&gt');
echo '</pars>';




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
		
		
	pad(0); h2('Returned data');
	
		h4('&ltchatpeek&gt');
		indent('Each line is made from the following string of integers',6);
		indent('accountId - chatId - phylcount - physseen - chatversion - phylast - livewho',6);
		indent('where:',6);
		indent('o accountId is the accound scope for the following data on the same line (big int)',8);
		indent('o chatId is the chat thread id (big int)',8);
		indent('o phylcount is the number of actual  phylacteries attached to the chat thread (int)',8);
		indent('o physseen is the number of phylacteries sent to your login so far, using a call to /chatphyls.php with the same login',8);
		indent('o chatversion is the number of actual participants in the chat thread',8);
		indent('o phylast is the unix absolute time of the last phylactery inserted in this thread (used for sorting the list on chatthread list display)',8);
		indent('o livewho is the loginId list of participants who were viewing the chatthread in the last 10 seconds',8);
		pad(0);
		indent('So, you get one line for each chatthread you are involved into as a dS_chat_participant, cross accounts.',6);
	
		h4('&ltpars&gt');
		indent('Each line is made from parameter name equal value, indicates the pace to call this chatdog script',6);
		indent('param name =  value',6);
		indent('where:',6);
		indent('o forepace is the pace for polling this chatdog when the smart app is in foreground mode',8);
		indent('o realpace is the pace for polling this chatdog when the smart app has chat screens open',8);
		pad(0);
		indent('Note, when an app is in background mode or is terminated, there is no way to run background code ',6);
		

	// pad(0); h2('Returned objects &ltdata&gt');

	// explainclass($n		, all_fields, '|');
	// explainclass($logins, $fieldsL, '|');

}	

//////////////////////////////////////////////////////////////////////////////////////////
//
//     P E R F    R E P O R T 

pad();
$perfReport->peak('::protocol streamed');
$perfReport->dropReport(); // no perf report for production


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>