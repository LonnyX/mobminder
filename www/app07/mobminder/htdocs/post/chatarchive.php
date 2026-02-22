<?php
//////////////////////////////////////////////////////////////////////
//
//      W E B  A P P   /   P O S T     C H A T     A R C H I V E      C O M M A N D  (logs out all participants)
//

$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
require '../classes/language.php';
$L = new L($dS_login->language, $dS_account->visitorAlias); // (*1)

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$chatid = $_POST['id'];
if($chatid <= 0) die('Only for existing items...');

	$dS_chat_thread = new C_dS_chat_thread($chatid);
if($dS_chat_thread->groupId != $accountId) die('Try in your own group...');


///// trigger a chat list renew where related devices are connected
//
	$dS_chat_thread->cversion++;
	$dS_chat_thread->dSsave();
	
	
$perfReport->peak('::changed timestamp');

///// participants
//

C_dbAccess_chat_participants::keeptalkatives($chatid);  // decided to keep participants visible in archive chats


$perfReport->peak('::keeptalkatives');

	
///// phylactery
//
		$bla = $dS_login->getFullName().' '.L::XL('archived conversation'); // (*1)
	$dS_chat_phylactery = C_dS_chat_phylactery::push($loginId, $chatid, $bla);
	
$perfReport->peak('::inserted phylactery');


///// move to archive table
//

	$dS_chat_thread->charchive($reverse = false, $perfreport = $perfReport); // moves main thread and attributes to archive_ tables

$perfReport->peak('::moved to archive_ tables');



///// stream
//
// $bank = 'plitems';  // DO NOT FEEDBACK <= this conversation is already removed from client side, because he quit the chat
// echo '<code>'; 
// echo '#C_dS_chat_participant'.'#'.$bank.chr(10).$participant->stream().chr(10);
// echo '</code>';

echo chr(10).'C_dS_chat_detail:'.chr(10).$dS_chat_thread->stream(); // not nested in <code>, for feedback only


$perfReport->peak('::completed');
$perfReport->dropReport();
?>