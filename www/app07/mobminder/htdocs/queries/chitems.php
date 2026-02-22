<?php

///////////////////////////////////////////////////////////////////////////////////
//
//    W E B    A P P    /    Q U E R Y    C H A T    T H R E A D S    I T E M S 
//

ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

$clientLid = @$_POST['lid']; if(!isset($clientLid)) die('insufficient parameters <command>logoff</command>');
if($loginId != $clientLid) die('please read your own messages <command>logoff</command>');

session_write_close();  // <= the session file is un-locked (no more writing possible to session file)

$perfReport->peak('::time needed to retrieve session and posted parameters');



//   L O A D    C H A T S    D A T A  
//
//

$o_dbAccess_visitors = new C_dbAccess_visitors();
$o_dbAccess_chat_participants = new C_dbAccess_chat_participants();
$o_dbAccess_chat_threads = new C_dbAccess_chat_threads();
$o_dbAccess_chat_visirefs = new C_dbAccess_chat_visirefs();

	
	$chatsIds = $o_dbAccess_chat_threads->loadOnLogin($loginId, $accountId);
	$o_dbAccess_chat_participants->loadOnGroup($chatsIds);
	$o_dbAccess_chat_visirefs->loadOnGroup($chatsIds);
	$o_dbAccess_visitors->loadOnId($o_dbAccess_chat_visirefs->getList('visiId'), false);

$chatscurrent = $o_dbAccess_chat_threads->count();

$p = new C_chat_peek_smapp($loginId);

$perfReport->peak('STEP 2 done::data loaded');

// E C H O
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//
$bank = 'chitems';
echo '<code>';
		echo $o_dbAccess_chat_threads->stream(false, $bank);
		echo $o_dbAccess_chat_participants->stream(false, $bank);
		echo $o_dbAccess_chat_visirefs->stream(false, $bank);
		echo $o_dbAccess_visitors->stream(no_alias, no_bank, with_tracking); 
echo '</code>'.chr(10);

echo '<data>'.implode($nl,$p->stream()).'</data>'.chr(10);

$perfReport->peak('::streamed');

$perfReport->peak('::echo');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
// C_dS_connection::poke($perfReport, 'q_chitems');

?>