<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   P O S T     C H A T      T H R E A D 
//
//              
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
$cid = $context->request_cid($mandatory = true, $virtual = true, $archive = true); // can be new but may not be archived item

$L = new L($context->dS_login->language, $context->dS_account->visitorAlias);  // for correct translation of (*1)
$now = time();

pad();

$perfReport->peak('::context setup');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
		
		indent('o cid: '.$cid.'',6);
		$isnew = $cid<=0; $isedit = !$isnew;
		$wasarchived = 0;
		

		$hasnote = false; $note = @$_REQUEST['note'];		if(isset($note)) { $note = mb_strimwidth($note, 0, 1024, "..."); $hasnote = true; } else { $note = 'empty'; }
		$hastitle = false; $title = @$_REQUEST['title'];		if(isset($title)) { $title = mb_strimwidth($title, 0, 60, "..."); $hastitle = true; } else { $title = 'empty'; }
		$hasvisiref = false; $visirefs = @$_REQUEST['vrfs']; 	if(isset($visirefs)) { $visirefs = $visirefs; $hasvisiref = true; } else { $visirefs = ''; }
		$hasparticp = false; $partcips = @$_REQUEST['pts']; 	if(isset($partcips)) { $partcips = $partcips; $hasparticp = true; } else { $partcips = ''; }
		
		
		if($hastitle) if($title == '') if($hasvisiref) if(strlen($visirefs)==0) abort('3204','if title is empty, you must mention visitors');


	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);


	h3('Fields format/value validation');
		
		if($hasvisiref) {
			if(strlen($visirefs)) { 
				if(!is_numeric(str_replace('!','',$visirefs))) abort('3205','bad format for vrfs');
				$visirefs = explode('!', $visirefs); // an array of visitor ids indicated as reference for this chat
				foreach($visirefs as $vid) {
					$q = new Q('select count(1) as c from visitors where groupId  = '.$aid.' and id = '.$vid.';');
					$c = $q->c();
					if($c-1) abort('3206','invalid visitor id '.$vid.'');
				}	
			}	
			else $visirefs = Array();
		} // visirefs is now a validated array of visitor ids
		
		
		if($hasparticp) {
			if(strlen($partcips)) { 
				if(!is_numeric(str_replace('!','',$partcips))) abort('3205','bad format for vrfs');
				$partcips = explode('!', $partcips); // an array of visitor ids indicated as reference for this chat
				foreach($partcips as $plid) {
					$q = new Q('select count(1) as c from logins where id = '.$plid.';');
					$c = $q->c();
					if($c-1) abort('3206','invalid login id '.$plid.' mentioned in participants');
				}
				if(!in_array($plid,$partcips)) abort('3207','the chat editor ('.$plid.') must participate in this chat, use chatquit to exit the chat');
			}	
			else abort('3208','at least the chat editor ('.$lid.') must remain as chat participant in this chat');
			
		} else
			if($isnew) {
				$partcips[] = $lid; // by default, include the chat editor as first participant
			}
			
		// partcips is now a validated array of login ids
		
		if($web) {
			$lids_str = implode(',',$partcips);
			$logins = new C_dbAccess_logins($lids_str);
			indent('o pts:',6);
			foreach($logins->keyed as $dS_login)
				indent('- '.$dS_login->id.' ('.$dS_login->getFullName().')',9);
		}
		
		
		
		
		if($hasvisiref) if(count($visirefs)==0) if($hastitle) if($title == '') abort('3209','you must have either title or visiref');

		$dS_chat_phylactery = false;
		if($isnew) { // some fields are mandatory when creating a new chat 
			
			$new_dS_thread = new C_dS_chat_thread(0, $aid);
			$new_dS_thread->lastphyl = $now;
			
		} else { // edit an existing chat thread
		
			$asis_dS_thread = new C_dS_chat_thread($cid);
			$asis_title = $asis_dS_thread->title;
			$wasarchived = $asis_dS_thread->archived ? $asis_dS_thread->id : 0; // $wasarchived is 0 when live or the id of the archived dS_thread if it was archived
			
			if($wasarchived) { // bring it back from archive
				
				indent('o archived: YES - id:'.$wasarchived,6);
				$asis_dS_thread = $asis_dS_thread->charchive($reverse = true); // retrieves main thread and attributes from archive_ tables
				$asis_dS_thread->archived = 0;
				
				///// unarchived phylactery
	
					$bla = $context->dS_login->getFullName().' '.L::XL('unarchived conversation'); // (*1)
				$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $cid, $bla);
			
			}
			
				$q = new Q('select count(1) as c from chat_visirefs where groupId  = '.$cid.';');
			$asis_visirefs_count = $q->c();
			
			if($hasvisiref) if(count($visirefs)==0) if(!$hastitle) if($asis_title == '') abort('3220','you must have either title or visiref');
			if(!$asis_visirefs_count) if($hastitle) if($title == '') abort('3221','you must have either title or visiref');
			
			
				$q = new Q('select count(1) as c from chat_participants where groupId  = '.$cid.';');
			$asis_parti_count = $q->c();
			
			
			if($hastitle) indent('o title: '.($title?$title:'reset to blank'),6);
			else indent('o title: no title posted, keeping previous setting',6);
			
			if($hasvisiref) 
				indent('o vrfs: '.implode(',',$visirefs).' ',6);
			else indent('o vrfs: no visitor reference posted',6);
		}
	
	
		


	h3('Checking for optional fields');
	
		// note

		if(!$hasnote) {	
			indent('o note: no note posted',6);	
		} else {
				if($note) indent('o note: '.mb_strimwidth($note, 0, 1024, "..."),6);	
				else indent('o note: you reset the note to blank',6);	
			}



		// customCss

		$hascolor = false; 	$cssColor = @$_REQUEST['color']; 		if(isset($cssColor)) 	{ $cssColor = $cssColor; $hascolor = true; }		else { $cssColor = 0; }
		$haspattern = false; $cssPattern = @$_REQUEST['pattern']; 	if(isset($cssPattern)) 	{ $cssPattern = $cssPattern; $haspattern = true; }	else { $cssPattern = 0; }
		$hastags = false; 	$cssTags = @$_REQUEST['tags']; 			if(isset($cssTags)) 	{ $cssTags = $cssTags; $hastags = true; }			else { $cssTags = ''; }
		
		if($hascolor||$haspattern||$hastags) $customCsss = new C_dbAccess_customCss($aid);

		if($hascolor) {	
			if($cssColor) {
				if($customCsss->hasKey($cssColor)) indent('o color: '.$cssColor.' ('.$customCsss->keyed[$cssColor]->name.')',6);
				else abort('3210','cssColor '.$cssColor.' unknown from account config');
			}
			else indent('o color: you reset the color to none',6);					
		} else
			indent('o color: no color posted',6);


		if($haspattern) {	
			if($cssPattern) {
				if($customCsss->hasKey($cssPattern)) indent('o pattern: '.$cssPattern.' ('.$customCsss->keyed[$cssPattern]->name.')',6);
				else abort('3211','cssPattern '.$cssPattern.' unknown from account config');
			}
			else indent('o pattern: you reset the color to none',6);
		} else
			indent('o pattern: no pattern posted',6);	
		

		if($hastags) {
			if($cssTags) {
				$tags = explode('!',$cssTags);
				$tagnames = Array();
				foreach($tags as $tagid) {
					if($customCsss->hasKey($tagid)) $tagnames[] = $customCsss->keyed[$tagid]->name;
					else abort('3211','cssTags '.$tagid.' unknown from account config');
				}
				indent('o tags: '.$cssTags.' ('.implode(',',$tagnames).')',6);
			}
			else indent('o tags: you reset the tags to none',6);
		} else
			indent('o tags: no tags posted',6);		



	
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    P R E P A R E     D A T A 
//

	if($isnew) $dS_chat_thread = $new_dS_thread;
		else $dS_chat_thread = $asis_dS_thread;
	
	if($hastitle) $dS_chat_thread->title = $title;
	if($hasnote) $dS_chat_thread->note = $note;
	
	if($hascolor) $dS_chat_thread->cssColor = $cssColor;
	if($haspattern) $dS_chat_thread->cssPattern = $cssPattern;
	if($hastags) $dS_chat_thread->cssTags = $cssTags;
	

	
$dS_chat_thread->deletorId = 0; // in case this chat was previously deleted, restore it
$dS_chat_thread->deletor = "";
$dS_chat_thread->deleted = "";
$dS_chat_thread->dSsave();
$cid = $dS_chat_thread->id;

$philactery = '';
if($isnew) // this feature is not used on the smartphone app
	if($dS_chat_thread->note) { // then move the note to a first chat philactery
		indent('o new chat note: '.$dS_chat_thread->note.chr(10), 6);
		$philactery = $dS_chat_thread->note;
	}		
			
	

///// participants by login
//

$dbAccess_chat_participants_asis = new C_dbAccess_chat_participants();
$dbAccess_chat_participants_tobe = new C_dbAccess_chat_participants();
if(!$isnew) $dbAccess_chat_participants_asis->loadOnGroup($cid);

// CASE A: you are already in the chat (dS existing with cueOut = 0)
// CASE B: you have never been in this chat (no dS existing)
// CASE C: you have ever been in this chat (cueOut positive, we recycle the dS: return it back to zero)
// CASE D: you are thanked out from the chat (cueOut must be actualized)
// CASE E: the surfer who posted this chat is not part of the target participants, still he passed a note as first philactery

foreach($partcips as $loginId) { // Array of login ids posted

	if($dS_ = $dbAccess_chat_participants_asis->hasLoginId($loginId)) {
		if($dS_->cueOut) { $dS_->cueOut = 0; $dS_->cueIn = $now; } // CASE C:
		$dbAccess_chat_participants_tobe->add($dS_, $dS_->id); // CASE A:
	}
	else {
		$dS_ = $dbAccess_chat_participants_tobe->newVirtual(); // CASE B:
		$dS_->loginId = $loginId;
		$dS_->cueIn = $now;
	}
}
foreach($dbAccess_chat_participants_asis->keyed as $id => $dS_previous)
	if(!$dbAccess_chat_participants_tobe->hasKey($id)) { // CASE D:
		$dS_previous->cueOut = $now; 
		$dS_previous->dSsave(); 
	}
	
if($philactery) { // only for brand new threads - not used on smartapp
	$dS_ = $dbAccess_chat_participants_tobe->hasLoginId($lid); // returns a C_dS_chat_participant, the surfer who posted this new chat
	
	if($dS_) { // the surfer who posted this chat is part of the target participants	
		$dS_->physseen = 1; // as creator of the chat thread, you already saw the message
	}
	else { // the surfer who posted this chat is not part of the target participants, still he passed a note as first philactery
		$dS_ = $dbAccess_chat_participants_tobe->newVirtual(); // CASE E: (not allowed anymore, if you post, you participate)
		$dS_->loginId = $lid;
		$dS_->cueIn = $now;
		$dS_->cueOut = $now+1;
		$dS_->physseen = 1;
	}
}

$dbAccess_chat_participants_tobe->saveAll($cid); // group experts by workcode id



///// references to visitors
//
$dbAccess_chat_visirefs = new C_dbAccess_chat_visirefs();
if($isedit) if($hasvisiref) $dbAccess_chat_visirefs->deleteOnGroup($cid); // new list of visitors posted on existing chat, cleanup before we install the new list
if($hasvisiref)
	foreach($visirefs as $vid) {
		
		// add the visitor reference
		$dS_ = $dbAccess_chat_visirefs->newVirtual();
		$dS_->visiId = $vid;
	}
$dbAccess_chat_visirefs->saveAll($dS_chat_thread->id); // group references by chat id


if($philactery) { // only for brand new threads
	
	$dS_chat_phylactery = C_dS_chat_phylactery::push($lid, $cid, $philactery);
}




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//



	h2('All the data is ready, are you too?'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	$fieldsL = C_api::fieldslist('C_dS_login');
	$fieldsV = C_api::fieldslist('C_dS_visitor');


if($dbAccess_chat_participants_tobe->hasLoginId($lid)) { // if the surfer excludes himself from a chat, his browser doesn't get any feedback dSets
	
	echo '<data>'; // enclose the file content within the stream
	if($web) span('&ltdata&gt');

		echo '#C_dS_chat_thread'.$nl;
		echo $dS_chat_thread->stream(with_tracking).$nl;
		echo $dbAccess_chat_participants_tobe->setstringtimeformat4AI()->stream(no_alias, no_bank, with_tracking);
		echo $dbAccess_chat_visirefs->stream(no_alias, no_bank, with_tracking);
		if($dS_chat_phylactery) echo '#C_dS_chat_phylactery'.'#'.$nl.$dS_chat_phylactery->stream(with_tracking).$nl;

	if($web) span('&lt/data&gt');
	echo '</data>';
	
} else 
	echo 'you have excluded yourself from this chat thread.';



//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
	
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o cid: chat thread unique id, zero or negative will create a new chat_thread',6);
		indent('o pts: when the chat is new, participants must be mentioned',6);
		
		h3('optional posts');
		indent('o note: free text, limited to 1024 chars',6);
	
	pad(0);	
		indent('One of title or visitor reference is mandatory. When the chat has no title bu has visirefs, the names of the visitors are displayed as chat title.',9);
		indent('o title: free text, limited to 60 chars',6);
		indent('o vrfs: visitor references by id, multiple items are separated by !, like [7479110!7474579]',6);
	
	pad(0);
		
		indent('o color: account cssColor reference for class chat and type color, like 43715',6);
		indent('o pattern: account cssPattern reference for class chat and type color, like 43717',6);
		indent('o tags: account cssTags reference for class chat and type color, alphanum like [43718!43720!43719]',6);
		

	pad(0); h2('Returned objects &ltdata&gt');
	
		if(!isset($dS_chat_phylactery)) $dS_chat_phylactery = new C_dS_chat_phylactery(0);

	explainclass($dS_chat_thread	, all_fields, '|');
	explainclass($dbAccess_chat_participants_tobe	, all_fields, '|');		
	explainclass($dbAccess_chat_visirefs	, all_fields, '|');			
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