<?php
//////////////////////////////////////////////////////////////////////
//
//     W E B   A P P     /     P O S T     C H A T      T H R E A D 
//

$loadcontext = 1; require '../classes/ajax_session.php';
require '../classes/language.php';
$L = new L($dS_login->language, $dS_account->visitorAlias);
$now = time();

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$chatid = $_POST['id']; $isnew = $chatid<=0;
$bank = @$_POST['bank']; if(!isset($bank)) $bank='chitems'; // other possible values are chitems, archives, visitab defined here (*c02*)

$philactery = '';
$dS_chat_thread = new C_dS_chat_thread($chatid, $accountId, $_POST);
if($isnew) {
	if($dS_chat_thread->note) { // then move the note to a first chat philactery
		echo 'o new chat note: '.$dS_chat_thread->note.$nl;
		$philactery = $dS_chat_thread->note;
		// $dS_chat_thread->note = ''; // I think it's a good idea to keep the very first message in the note
	}
	$dS_chat_thread->lastphyl = $now;
}
else { 

	$wasarchived = $dS_chat_thread->archived ? $dS_chat_thread->id : 0; // $wasarchived is 0 when live or the id of the archived dS_thread if it was archived
	
	if($wasarchived) { // bring it back from archive
		
		echo 'o archived: YES - id:'.$wasarchived.$nl;
		$dS_chat_thread = $dS_chat_thread->charchive($reverse = true); // retrieves main thread and attributes from archive_ tables
		$dS_chat_thread->archived = 0;
		
		///// unarchived phylactery
			$bla = $dS_login->getFullName().' '.L::XL('unarchived conversation'); // (*1)
		$dS_chat_phylactery = C_dS_chat_phylactery::push($loginId, $chatid, $bla);
	}
			

	$dS_chat_thread->cversion++;
}

$dS_chat_thread->deletorId = 0; // in case this chat was previously deleted, restore it
$dS_chat_thread->deleted = 0;
$dS_chat_thread->dSsave();
$chatid = $dS_chat_thread->id;


///// participants by login
//
$participants = $_POST['participants']; $participants = explode('!', $participants); // an array of login Ids, assigned to this task
$dbAccess_chat_participants_asis = new C_dbAccess_chat_participants();
$dbAccess_chat_participants_tobe = new C_dbAccess_chat_participants();
if(!$isnew) $dbAccess_chat_participants_asis->loadOnGroup($chatid);

// CASE A: you are already in the chat (dS existing with cueOut = 0)
// CASE B: you have never been in this chat (no dS existing)
// CASE C: you have ever been in this chat (cueOut positive, we recycle the dS: return it back to zero)
// CASE D: you are thanked out from the chat (cueOut must be actualized)
// CASE E: the surfer who posted this chat is not part of the target participants, still he passed a note as first philactery

foreach($participants as $plid) {
	if($dS_ = $dbAccess_chat_participants_asis->hasLoginId($plid)) {
		if($dS_->cueOut) { $dS_->cueOut = 0; $dS_->cueIn = $now; } // CASE C:
		$dbAccess_chat_participants_tobe->add($dS_, $dS_->id); // CASE A:
	}
	else {
		$dS_ = $dbAccess_chat_participants_tobe->newVirtual(); // CASE B:
		$dS_->loginId = $plid;
		$dS_->cueIn = $now;
	}
}
foreach($dbAccess_chat_participants_asis->keyed as $id => $dS_previous)
	if(!$dbAccess_chat_participants_tobe->hasKey($id)) { // CASE D:
		$dS_previous->cueOut = $now; 
		$dS_previous->dSsave(); 
	}
	
if($philactery) { // only for brand new threads having some text in the note ( note is the first message for new chats )
	$dS_ = $dbAccess_chat_participants_tobe->hasLoginId($dS_login->id); // the surfer who posted this new chat
	
	if($dS_) { // the surfer who posted this chat is part of the target participants	
		// $dS_->physseen = 1; // as creator of the chat thread, you already saw the message // commented, happens here : (*py01*)
	}
	else { // the surfer who posted this chat is not part of the target participants, still he passed a note as first philactery
		$dS_ = $dbAccess_chat_participants_tobe->newVirtual(); // CASE E:
		$dS_->loginId = $dS_login->id;
		$dS_->cueIn = $now;
		$dS_->cueOut = $now+1; // As the creator does not wish to be participant, we will exclude him immediately
		// $dS_->physseen = 1; // commented, happens here : (*py01*)
	}
}

$dbAccess_chat_participants_tobe->saveAll($dS_chat_thread->id); // 



///// references to visitors
//
$visirefs = $_POST['visiref']; $visirefs = ($visirefs=='-') ? false : explode('!', $visirefs);
$dbAccess_chat_visirefs = new C_dbAccess_chat_visirefs();
if(!$isnew) $dbAccess_chat_visirefs->deleteOnGroup($chatid); // cleanup before we intall the new list
if($visirefs)
	foreach($visirefs as $vid) {
		// check that this visitor is still active
		$q = new Q('select count(1) as c from visitors where id = '.$vid.' and deletorId = 0;');
		if(!$q->c()) continue; // This solves the very particular case where a doublon was removed but is still selected (and id posted) from the C_iACPICK control. Other similar scripts are protected against this. see (*exc10*)
		
		// add the visitor reference
		$dS_ = $dbAccess_chat_visirefs->newVirtual();
		$dS_->visiId = $vid;
	}
$dbAccess_chat_visirefs->saveAll($dS_chat_thread->id); // group references by chat id


if($philactery) { // only for brand new threads
	
	$dS_chat_phylactery = C_dS_chat_phylactery::push($loginId, $chatid, $philactery);
}


///// stream
//
if($dbAccess_chat_participants_tobe->hasLoginId($dS_login->id)) { // if the surfer excludes himself from a chat, his browser doesn't get any feedback dSets
	echo '<code>';
	echo '#C_dS_chat_thread'.'#'.$bank.chr(10);
	echo $dS_chat_thread->stream().chr(10);
	echo $dbAccess_chat_participants_tobe->stream(false, $bank);
	echo $dbAccess_chat_visirefs->stream(false, $bank);
	if($philactery) echo '#C_dS_chat_phylactery'.'#'.$bank.$nl.$dS_chat_phylactery->stream().$nl;
	echo '</code>';
} else 
	echo 'you have excluded yourself from this chat thread.';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_chat');
?>