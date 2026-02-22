<?php
//////////////////////////////////////////////////////////////////////////////////
//
//      W E B    A P P     /      D E L E T E    A    C H A T    T H R E A D 
//
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
require '../classes/language.php';
$L = new L($dS_login->language, $dS_account->visitorAlias); // for correct translation of (*1)
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$chatid = $_POST['id'];
$bank = @$_POST['bank']; if(!isset($bank)) $bank='chitems'; // other possible values are chitems, archives, visitab defined here (*c02*)
	
if($chatid<=0) die('Trying to delete a virtual...');

$dS_chat_thread = new C_dS_chat_thread($chatid);
if($accountId != $dS_chat_thread->groupId) die ('You should delete in your own group. <command>logoff</command>');

$wasarchived = $dS_chat_thread->archived ? $dS_chat_thread->id : 0; // $wasarchived is 0 when live or the id of the archived dS_thread if it was archived

	if($wasarchived) { // bring it back from archive
		
		echo 'o archived: YES - id:'.$wasarchived.$nl;
		$dS_chat_thread = $dS_chat_thread->charchive($reverse = true); // retrieves main thread and attributes from archive_ tables
		$dS_chat_thread->archived = 0;
	}
	
///// phylactery
//
	
		$bla = $dS_login->getFullName().' '.L::XL('deleted conversation'); // (*1)
	$dS_chat_phylactery = C_dS_chat_phylactery::push($loginId, $chatid, $bla);
	
	
	C_dbAccess_chat_participants::keeptalkatives($chatid);

// remove note details
//
$dS_chat_thread->dSobsolete();
$dS_chat_thread->charchive(); // moves main thread and attributes to archive_ tables

echo chr(10).'C_dS_chat_detail:'.chr(10).$dS_chat_thread->stream();

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_chat');
?>