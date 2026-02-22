<?php
//////////////////////////////////////////////////////////////////////
//
//         W E B   A P P   /  P O S T     C H A T     P H Y L A C T E R Y 
//

require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$chatid = $_POST['chatid'];
$partid = $_POST['partid'];

	// prepare parameters
	//
	$o_dS_chat_thread = new C_dS_chat_thread($chatid);
	if($o_dS_chat_thread->groupId != $accountId) die('post in your own group... <command>logoff</command>');


	$unixnow = time();
	$lid = $loginId;
	$bla = $_POST['bla'];
	
	
	$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $chatid, $bla, $partid);
	$dS_chat_participant = new C_dS_chat_participant($partid);

///// stream
//
$bank = 'chitems';
echo '<code>';
echo '#C_dS_chat_participant'.'#'.$bank.$nl.$dS_chat_participant->stream().$nl;
echo '#C_dS_chat_phylactery'.'#'.$bank.$nl.$dS_chat_phylactery->stream().$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
?>