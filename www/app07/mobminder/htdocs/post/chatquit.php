<?php
//////////////////////////////////////////////////////////////////////
//
//   W E B   A P P   /    C H A T     Q U I T      C O M M A N D
//

$loadcontext = 1; require '../classes/ajax_session.php';
require '../classes/language.php';
$L = new L($dS_login->language, $dS_account->visitorAlias);

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$chatid = $_POST['id'];
if($chatid <= 0) die('Only for existing items...');

	$dS_chat_thread = new C_dS_chat_thread($chatid);
if($dS_chat_thread->groupId != $accountId) die('Try in your own group...');


///// participant
//
	$pcount = C_dS_chat_participant::count($chatid); // returns the number of participant still live in this chat
	$q = new Q('SELECT id FROM chat_participants WHERE groupId = '.$chatid.' AND loginId = '.$loginId.' AND cueOut = 0;');
	$partid = $q->ids(); // normally only one id results from this query
		
	
	
///// phylactery
//
		$bla = $dS_login->getFullName().' '.L::XL('left conversation'); // (*1)
	$dS_chat_phylactery = C_dS_chat_phylactery::push($loginId, $chatid, $bla, $partid);



///// participant
//
	$participant = new C_dS_chat_participant($partid);
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



///// stream
//
// $bank = 'plitems';  // DO NOT FEEDBACK <= this conversation is already removed from client side, because he quit the chat
// echo '<code>'; 
// echo '#C_dS_chat_participant'.'#'.$bank.chr(10).$participant->stream().chr(10);
// echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
?>