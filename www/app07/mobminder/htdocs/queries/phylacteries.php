<?php
//////////////////////////////////////////////////////////////////////
//
//    W E B    A P P    /    Q U E R Y     C H A T     P H Y L A C T E R I E S 
//
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

	$bank = $_POST['bank'];
	$chatid = $_POST['chatid'];
	$partid = $_POST['partid']+0; // zero is posted when the chat viewer was not part of the conversation (when consulting archives).

	// prepare load parameters
	//
	$dS_chat_thread = new C_dS_chat_thread($chatid);
	if($dS_chat_thread->groupId != $accountId) die('look in your own group...');
	$art = ''; $live =  true; $archived = '(live)'; if($dS_chat_thread->archived) { $archived = '(archived)'; $art = 'archive_'; $live = false; }
	echo 'o cid: '.$chatid.' '.$archived.$nl;

	

$perfReport->peak('::session & post variables retrieved');

	// load data
	//
	$phylacteries = new C_dbAccess_chat_phylacteries($chatid, 0, $art);
	if($live&&$partid) { // then reset the physseen parameter for the caller participant
		C_dS_chat_participant::seenupdate($partid, $chatid);
		$dS_chat_participant = new C_dS_chat_participant($partid);
	}


$perfReport->peak('::data loaded');

		
	// stream data
	//
	// $bank = 'chitems'; // now defined by the caller script, based on which bank the C_dS_chat_thread is stored in
	echo $nl;
	echo '<code>';
	if($live&&$partid) echo $dS_chat_participant->stream1(no_tracking, $bank).$nl; // this updates the physseen variable at client side
	echo $phylacteries->stream(false, $bank);
	echo '</code>';
	
$perfReport->peak('::streamed');
$perfReport->dropReport();
?>