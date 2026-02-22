<?php
//////////////////////////////////////////////////////////////////////
//
//    S M A R T     A P P     A P I     /     Q U E R Y     C H A T     P H Y L A C T E R I E S 
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
$aid = $context->dS_account->id;
$cid = $context->request_cid($mandatory = true, $virtual = false, $archive = true);



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		$chatthread = new C_dS_chat_thread($cid); // is read from either live or archive table
		$art = ''; $live =  true; $archived = '(live)'; if($chatthread->archived) { $archived = '<b>(archived)</b>'; $art = 'archive_'; $live = false; }
		indent('o cid: '.$cid.' '.$archived,6);
	
	
	h3('Checking for optional fields');


		$seen = @$_REQUEST['seen']; // integer 0 or positive, tells the server how many phylacteries you have on the device. 
		if(isset($seen)) $seen = $seen; else $seen = 0;
		if(!is_numeric($seen)) abort('3013','gate::bad format for seen');
		
			if($seen) indent('o seen: '.$seen.', you receive the delta missing messages for this conversation',6);
				else  indent('o seen: 0, you receive the full conversation thread',6);

	
$perfReport->peak('::api context set up');



	// removed verification because it might be a lag before a phone knows that this login is checked out from the chat (*lag01*)
	
	$q = new Q('select id from '.$art.'chat_participants where loginId ='.$lid.' and groupId ='.$cid.' limit 1;');	
	$pid = $q->ids();
	
	// if(!$pid) // in case you were just excluded from the chat, we don't generate any error
		// abort('3012','gate::no corresponding participant was found');
	
	
	
$perfReport->peak('::session & post variables retrieved');

	// load data
	//
	$dbAccess_chat_phylacteries = new C_dbAccess_chat_phylacteries($cid, $seen, $art);
	if($live) { // then reset the physseen parameter for the caller participant
		if($pid) C_dS_chat_participant::seenupdate($pid, $cid);
	}

$perfReport->peak('::data loaded');



		
//////////////////////////////////////////////////////////////////////////////////////////
//
//     D R O P    D A T A    T O    C L I E N T    S I D E



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	
echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');

	echo $dbAccess_chat_phylacteries->setstringtimeformat()->stream(no_tracking);
	
span('&lt/data&gt');
echo '</data>';

echo $nl.$nl;

echo '<pars>'; // enclose the file content within the stream
span('&ltpars&gt');

	echo 'phylpace=5'.$nl; // (*lag01*)
	
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
		indent('o cid: chat thread unique id',6);
		
		
		h3('optional posts');
		indent('o seen: integer 0 or positive, tells the server how many phylacteries you have on the device',6);
		
		
		

	pad(0); h2('Returned objects &ltdata&gt');

	explainclass($dbAccess_chat_phylacteries	, all_fields, '|');
		
	
		h4('&ltpars&gt');
		indent('Each line is made from parameter name equal value, indicates the pace to call this chatphyls script',6);
		indent('param name =  value',6);
		indent('where:',6);
		indent('o phylpace is the pace for polling this script when the chat thread is open on screen (phylacteries)',8);
		pad(0);
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