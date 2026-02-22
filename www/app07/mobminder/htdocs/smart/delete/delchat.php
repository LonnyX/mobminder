<?php
//////////////////////////////////////////////////////////////////////
//
//       S M A R T A P P    /     D E L E T E      C H A T       C O M M A N D
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
$cid = $context->request_cid($mandatory = false, $virtual = false, $archive = true);

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
		
		$dS_chat_thread = new C_dS_chat_thread($cid);
		
		if($web) {
			pad(0);
			indent('- title: '.$dS_chat_thread->title.'',9);
			indent('- note: '.$dS_chat_thread->note.'',9);
			indent('- tags: '.$dS_chat_thread->cssTags.'',9);
			indent('- color: '.$dS_chat_thread->cssColor.'',9);
			indent('- pattern: '.$dS_chat_thread->cssPattern.'',9);
		}
		
		$wasarchived = $dS_chat_thread->archived ? $dS_chat_thread->id : 0; // $wasarchived is 0 when live or the id of the archived dS_thread if it was archived
		if($wasarchived) { // bring it back from archive
			
			indent('o archived: YES - id:'.$wasarchived,6);
			$dS_chat_thread = $dS_chat_thread->charchive($reverse = true); // retrieves main thread and attributes from archive_ tables
			$dS_chat_thread->archived = 0;
					
		}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    P R E P A R E     D A T A 
//

	$participants = C_dbAccess_chat_participants::keeptalkatives($cid);



///// phylactery
//
		$bla = $context->dS_login->getFullName().' '.L::XL('deleted conversation'); // (*1)
	$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $cid, $bla);


///// chat_thread
//
	$dS_chat_thread->dSobsolete();
	$dS_chat_thread->charchive(); // moves main thread and attributes to archive_ tables
	
	
	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
//

	h2('All the data is ready, are you too?'); 
///// stream
//
	echo '<data>'; // enclose the file content within the stream
echo '#C_dS_chat_thread'.$nl.$dS_chat_thread->stream().$nl;
echo $participants->setstringtimeformat()->stream();
echo '#C_dS_chat_phylactery'.$nl.$dS_chat_phylactery->stream().$nl;
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
		

	pad(0); h2('Returned objects &ltdata&gt');

	explainclass($dS_chat_thread, all_fields, '|');	
	explainclass($dS_chat_phylactery, all_fields, '|');	

}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 


$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>