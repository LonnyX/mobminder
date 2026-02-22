<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P     A P I   /   P O S T     C H A T     P H Y L A C T E R Y 
//
//              
//

ob_start(); // relates to (*cc)
require '../smapplib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$aid = $context->dS_account->id;
$lid = $context->dS_login->id;
$cid = $context->request_cid($mandatory = true);



$perfReport->peak('::context setup');




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		indent('o cid: '.$cid.'',6);
	
		$hasbla = false; $bla = @$_REQUEST['bla'];	if(isset($bla)) { $bla = mb_strimwidth($bla, 0, 2048, "+cut+"); $hasbla = true; } else { $bla = 'empty'; }
	
		if(!$hasbla) abort('3400','gate::missing mandatory field bla');
		
		indent('o bla: '.$bla.'',6);
	

		// removed verification because it might be a lag before a phone knows that this login is checked out from the chat (*lag01*)
		
		$q = new Q('select id from chat_participants where loginId ='.$lid.' and groupId ='.$cid.' limit 1;');	
		$pid = $q->ids();
		if(!$pid) 
			abort('3400','gate::no corresponding participant was found');
	
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);
		
		
		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// insert phylactery in DB
//

	
	$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $cid, $bla, $pid);
	$dS_chat_participant = new C_dS_chat_participant($pid);




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
	
echo '#C_dS_chat_participant'.$nl.$dS_chat_participant->setstringtimeformat()->stream(with_tracking).$nl; // see (*su01*)
echo '#C_dS_chat_phylactery'.$nl.$dS_chat_phylactery->setstringtimeformat()->stream(with_tracking).$nl;

	span('&lt/data&gt');
	echo '</data>';
	


//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o cid: chat thread unique id',6);
		indent('o bla: free text (limited to 2048 chars)',6);
		

	pad(0); h2('Returned objects &ltdata&gt');

	explainclass($dS_chat_participant	, all_fields, '|'); // see (*su01*)
	explainclass($dS_chat_phylactery	, all_fields, '|');		

}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 



$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


?>