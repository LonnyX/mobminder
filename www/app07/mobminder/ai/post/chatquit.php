<?php
//////////////////////////////////////////////////////////////////////
//
//         Moby  A I   A P I    /     P O S T     C H A T     Q U I T      C O M M A N D
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$aid = $context->dS_account->id;
$lid = $context->dS_login->id;
$cid = $context->request_cid($mandatory = true);

	$dS_chat_thread = new C_dS_chat_thread($cid);
			
$L = new L($context->dS_login->language, $context->dS_account->visitorAlias); // for correct translation of (*1)

pad();

$perfReport->peak('::context setup');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
		
		
		indent('o cid: '.$cid.' (valid)',6);
		if($web) {
			pad(0);
			indent('- title: '.$dS_chat_thread->title.'',9);
			indent('- note: '.$dS_chat_thread->note.'',9);
			indent('- tags: '.$dS_chat_thread->cssTags.'',9);
			indent('- color: '.$dS_chat_thread->cssColor.'',9);
			indent('- pattern: '.$dS_chat_thread->cssPattern.'',9);
		}
		

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    P R E P A R E     D A T A 
//



///// participant
//
	$pcount = C_dS_chat_participant::count($cid); // returns the number of participant still live in this chat
	$q = new Q('SELECT id FROM chat_participants WHERE groupId = '.$cid.' AND loginId = '.$lid.' limit 1;');
	$partid = $q->ids(); // normally only one id results from this query
		
	
	
///// phylactery
//
		$bla = $context->dS_login->getFullName().' '.L::XL('left conversation');
	$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $cid, $bla, $partid);


///// participant - set cueOut to current time indicates when this participant left the conversation
//
	$participant = new C_dS_chat_participant($partid);  // keep this code under the phylactery insert
	$participant->live = 0;
	$participant->cueOut = time();
	$participant->dSsave();


///// trigger a chat list renew where related devices are connected
//
	$dS_chat_thread->cversion++;
	$dS_chat_thread->dSsave(); // increments cversion in such a way that all related devices refresh their participants list

	
////// If he was the last participant, pass this chat to archive
//
	if($pcount==1) // lid is the only remaining participant
		$dS_chat_thread = $dS_chat_thread->charchive(); // moves main thread and attributes to archive_ tables


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
//

	h2('All the data is ready, are you too?'); 
///// stream
//
	echo '<data>'; // enclose the file content within the stream
	if($web) span('&ltdata&gt');
echo '#C_dS_chat_thread'.$nl.$dS_chat_thread->stream().$nl; 							// cversion incremented
echo '#C_dS_chat_participant'.$nl.$participant->setstringtimeformat4AI()->stream().$nl; 	// participant cueOut
echo '#C_dS_chat_phylactery'.$nl.$dS_chat_phylactery->stream().$nl; 					// exit notification
	if($web) span('&lt/data&gt');
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
		

	pad(0); h2('Returned objects &ltdata&gt');

	explainclass($participant	, all_fields, '|');
	explainclass($dS_chat_phylactery	, all_fields, '|');		

}

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