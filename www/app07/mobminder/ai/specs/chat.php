<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M O B M I N D E R    S M A R T P H O N E    A P I   /   C H A T     S P E C I F I C A T I O N S  
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// You need to create a human login in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		https://localhost/smart/specs/chat.php?lgn=mobdev&pwd=bernard&kid=28454&web=1
// or prod
// 		https:smart.mobminder.com/specs/chat.php?lgn=mobdev&pwd=bernard&kid=28454&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$context = new C_apicontext($xpected_alevel); // xpected_alevel is defined in aiapilib.php
	$aid = $context->accountid;
	$par = $context->geturiaccessparms();
	$lid = $context->dS_login->id;
	$lname = C_dbIO::$loggedName;

$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1

$perfReport->peak('::time needed to retrieve context and posted parameters');


	h3('Checking optional fields');
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);





//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


// $uriandpar = explode('?',$_SERVER['REQUEST_URI']);
// $host = $_SERVER['HTTP_HOST']; // which is localhost or smart.mobminder.com
// $uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
// $uri_1 = '';
// $http = 'https://'; // good for production
// if(isset($subfolders[1])) {
	// if($subfolders[1]=='be.mobminder.com') // then you are in locahost testing.
		// if(isset($subfolders[2]))
			// if($subfolders[2]=='smart') {
				// $http = 'http://';  // good for local dev
				// $uri_1 = '/be.mobminder.com/smart'; // then you are in locahost testing.
			// }
// }



pad();
	h1('Generic for every interface');
	
	pad();
	h2('Input parameters');
	
		exlainloginputs(); 
		indent('<br/>Any call to an interface of this API should be tailed with your access parameters: <b>&'.$par.'</b>',6);
		
		h3('optional parameters');
		indent('o web: binary [0,1]. When web=1 you have access to execution in verbose mode and technical spec for the given api interface is displayed',6);




	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    Q U E R I E S
	
	pad();
	h1('API interfaces');
	indent('Clicking the blue links in the sections below will execute functions of the API and display the Technical spec for this function.',6);
	
	
if(1) {
	
	pad(); h2('Queries');
	
	
		pad(0); indent('3020: Query chat overview status for '.$lname.':',6);
			$l = $host.$uri_1.'/query/chatdog.php'.'?'.$par.'&web=1';
			pad(0); href($http.$l, 1, 9); pad(0);
		
	
			$q = new Q('select chat_threads.id from chat_threads join chat_participants on chat_participants.groupId = chat_threads.id 
						where chat_participants.loginId = '.$lid.' and chat_participants.cueOut = 0 and chat_threads.groupId = '.$aid.'
							and chat_threads.deletorId = 0
						order by chat_threads.created desc limit 1;');
			
			$chid = $q->ids();
			
			$hascid = false; $fcid = @$_REQUEST['cid']; if(isset($fcid)) { 
				$fcid = (int)$fcid; $hascid = true; $chid = $fcid; 
				
			} else { $hascid = false; }
			$vid = 0;
			if($chid) {
				$dS_chat = new C_dS_chat_thread($chid);
					$q = new Q('select visiId as id from chat_visirefs where groupId = '.$chid.' limit 1;');
					$vid=$q->ids();
					if($vid) $dS_visi = new C_dS_visitor($vid); else $dS_visi = false;
						
				$title = $dS_chat->title;
				if($dS_visi) $title = $dS_visi->lastname.', '.$dS_visi->firstname;
				
				$archived = '(live)'; if($dS_chat->archived) $archived = '(archived)';
		
				$hint = '<b>'.$archived.'</b> chatid: <b>'.$dS_chat->id.'</b>, title: <b>'.$title.'</b>, note:<b>'.$dS_chat->note.'</b> ';
					
				warning('Using this chat '.$hint.'',6);
			} else {
				$hint = 'No Chat found for experimenting';
			}

		
		
		
		pad(); indent('3001: Query the list of chats where '.$lname.' is identified as participant for account '.$aid,6);
			$l = $host.$uri_1.'/query/chatitems.php'.'?'.$par.'&web=1';
		pad(0); href($http.$l, 1, 9);
			
		
		pad(0); indent('3002: Query the list of chats for '.$lname.' that are in the chats archive',6);
			$l = $host.$uri_1.'/query/chatitems.php'.'?arch=1&'.$par.'&web=1';
		pad(0); href($http.$l, 1, 9); 
			
		
		pad(0); indent('3003: Query the list of chats for '.$lname.' that are in the chats archive inclusive deleted items',6);
			$l = $host.$uri_1.'/query/chatitems.php'.'?arch=1&bin=1&'.$par.'&web=1';
		pad(0); href($http.$l, 1, 9); 
			
		
		pad(0); indent('3004: Query the list of archive chats for account '.$aid.' not limited to this login view (so any chat from this account)',6);
			$l = $host.$uri_1.'/query/chatitems.php'.'?all=1&arch=1&bin=1&'.$par.'&web=1';
		pad(0); href($http.$l, 1, 9); 
			
		
		pad(0); indent('3005: Query the list of chats for a given visitor '.($vid?$vid:''),6);
		if($vid) {
			$l = $host.$uri_1.'/query/chatitems.php'.'?vid='.$vid.'&arch=1&bin=1&'.$par.'&web=1';
			pad(0); href($http.$l, 1, 9); 
		}
		else 
			warning('To execute this query, please create a chat in the account where one visitor is identified as reference.',8);
	
			
			
		pad(1); indent('3006: Query dS_chat and related dSets for a given chat id ',6);
			if($chid) {
				$cid = 'cid='.$chid.'';
				$l = $host.$uri_1.'/query/chatitems.php'.'?'.$cid.'&'.$par.'&web=1';
				pad(0); href($http.$l, 1, 9); pad(0);
			} else 
				warning('To execute this query, please create a chat in the account where '.$lname.' is identified as participant.',8);
			
			
	// now select an example chat from archive tables
	//
	$q = new Q('select archive_chat_threads.id from archive_chat_threads join archive_chat_participants on archive_chat_participants.groupId = archive_chat_threads.id 
				where archive_chat_participants.loginId = '.$lid.' and archive_chat_threads.groupId = '.$aid.'
					and archive_chat_threads.deletorId = 0
				order by archive_chat_threads.created desc limit 1;');
	
	$archid = $q->ids();
	
	$hascid = false; $fcid = @$_REQUEST['arcid']; if(isset($fcid)) { 
		$fcid = (int)$fcid; $hascid = true; $archid = $fcid; 
		
	} else { $hascid = false; }

	if($archid) {
		$ar_dS_chat = new C_dS_chat_thread($archid);
			$q = new Q('select visiId as id from archive_chat_visirefs where groupId = '.$archid.' limit 1;');
			$vid=$q->ids();
			if($vid) $ar_dS_visi = new C_dS_visitor($vid); else $ar_dS_visi = false;
				
		$title = $ar_dS_chat->title;
		if($ar_dS_visi) $title = $ar_dS_visi->lastname.', '.$ar_dS_visi->firstname;
		
		$archived = '(live)'; if($ar_dS_chat->archived) $archived = '(archived)';

		$ar_hint = '<b>'.$archived.'</b> chatid: <b>'.$ar_dS_chat->id.'</b>, title: <b>'.$title.'</b>, note:<b>'.$ar_dS_chat->note.'</b> ';
			
		
	} else {
		$hint = 'No Chat found for experimenting';
	}	
		
		pad(0); indent('3007: Query dS_chat and related dSets for an archived chat id ',6);
			if($archid) {
				warning('Using this archived chat '.$ar_hint.'',9);
				$cid = 'cid='.$archid.'';
				$l = $host.$uri_1.'/query/chatitems.php'.'?'.$cid.'&'.$par.'&web=1';
				pad(0); href($http.$l, 1, 9); pad(0);
			} else 
				warning('To execute this query, please archive a chat in the account where '.$lname.' is identified as participant.',8);
			
			
			
		pad(); indent('3010: Query the <b>full list</b> of phylacteries for a given chat',6);
			indent('Affects the dS_participant::physseen that is reset to the actual number of phylactaries in the chat',9);
			if($chid) {
				$cid = 'cid='.$chid;
				$l = $host.$uri_1.'/query/chatphyls.php'.'?'.$cid.'&'.$par.'&web=1';
				pad(0);href($http.$l, 1, 9); pad(0);
			} else 
				warning('To execute this query, please create a chat in the account where '.$lname.' is identified as participant.',8);
			
			
		pad(0); indent('3010: Query the <b>missing</b> list of phylacteries for a given chat, you need to provide the number of phylacteries you have on screen.',6);
			indent('For live chats, this affects the dS_participant::physseen that is reset to the actual number of phylactaries in the chat',9);
			if($chid) {
					$q = new Q('select count(1) as c from chat_phylacteries where groupId = '.$chid.';');
					$c = $q->c()-1;
				$seen = 'seen='.$c;
				
				$cid = 'cid='.$chid;
				$l = $host.$uri_1.'/query/chatphyls.php'.'?'.$cid.'&'.$seen.'&'.$par.'&web=1';
				pad(0);href($http.$l, 1, 9); pad(0);
			} else 
				warning('To execute this query, please create a chat in the account where '.$lname.' is identified as participant.',8);
		
}


if(1) {	

	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    P O S T S 
				

	pad(); h2('Posts');
		pad();	
		warning('WARNING: Some links might edit objects in the account '.$context->dS_account->name.'. USE ONLY A SANDBOX ACCOUNT !',6);
		pad();	
		
		
		
	indent('3200: Create a new chat thread:',6);
		notice('Passing a negative or zero cid will create the record in the DB',9);
		
			// let's pick random parameters to simulate a real case
			
					$d = new C_date(); 
					$day = $d->getDayString();
				$dtm = 'first phylactery on '.$d->getTimeString();
				$tim = 'new on '.$day.' at '.$d->getDateTimeString();
				
			notice('- title :'.$tim,9);
			notice('- note :'.$dtm,9);
				
				$logins = $context->gethumanloginsmin(); // is a C_dbAccess_logins_min()
				if($logins->count() > 1) { // then we add another participant
					$lkey = $lid; while($lkey==$lid) $lkey = array_rand($logins->keyed);
					$dS_login_min = $logins->keyed[$lkey];
					$pts = $lid.'!'.$dS_login_min->id;
				} else { $pts = $lid; }
			notice('- participants :'.$pts.' ('.$logins->getfirstnames(explode('!',$pts)).')',9);
			
			
				
				$tags = $context->customCsss->fromfilter(class_chat, class_cssType_tag);
				if($tags->count()) {
					$tagid = array_rand($tags->keyed);
					$dS_tagcss = $tags->keyed[$tagid];
					$tags = '&tags='.$tagid;
					notice('- tags : '.$tagid.' ('.$dS_tagcss->name.')',9);
				} else {
					$tags = '';
					notice('- tags : none',9);
				}
				
						$v = new Q('select id from visitors where groupId = '.$aid.' order by rand() limit 1;');
					$dS_visi = new C_dS_visitor($v->ids());
				$vrfs = $dS_visi->id;
			notice('- visitor ref :'.$vrfs.' ('.$dS_visi->getFullName().')',9);
				
		
			$parms = 'cid=0&title='.$tim.'&note='.$dtm.'&pts='.$pts.'&vrfs='.$vrfs.$tags;
		$l = $host.$uri_1.'/post/chathread.php'.'?'.$parms.'&'.$par.'&web=1';
		
				pad(0);
				href($http.$l, 1, 9); pad(0);
		
			

	
		pad();
		indent('3201: Edit chat thread data:',6);
			if(!isset($dS_chat)) {
				warning('Please create at least one chat in the account in which you are involved.',6);
			} else {
				notice('The following from your chat is the target of this test:',9);
				notice($hint,9);
				notice('The note will be adapted.',9);
				pad(0);
						$d = new C_date(); 
						$day = $d->getDayString();
					$dtm = 'This is the note changed on '.$day.' '.$d->getDateTimeString();
						
					$cid = 'cid='.$chid;
					$pts = '&pts='.$lid;
					$parms = $cid.$pts.'&note='.$dtm;
				$l = $host.$uri_1.'/post/chathread.php'.'?'.$parms.'&'.$par.'&web=1';
				
				href($http.$l, 1, 9); pad(0);
				pad(0);
			}
			
		
		indent('3202: Refer a visitor to the chat:',6);
		$lnamelike = $context->dS_login->lastname;
		$q = new Q('select id from visitors where lastname like "%'.$lnamelike.'%" and groupId = '.$aid.' limit 1;');
		if(!$q->hits()) {	
			$q = new Q('select id from visitors where groupId = '.$aid.' order by created desc limit 1;');
			if(!$q->hits())  {
				warning('you need to create at least one visitor on this account',6);
			}
		} 
		if(!isset($dS_chat))
			warning('Please create at least one chat in the account in which you are involved.',6);
		else 
		if($q->ids()) {
			$dS_visitor = new C_dS_visitor($q->ids());
			notice('The following from your chat is the target of this test:',9);
			notice($hint,9);
			notice('The visitor will be attached:'.$dS_visitor->lastname.', '.$dS_visitor->firstname,9);
			pad(0);
					$cid = 'cid='.$chid;
				$parms = $cid.$pts.'&vrfs='.$dS_visitor->id;
			$l = $host.$uri_1.'/post/chathread.php'.'?'.$parms.'&'.$par.'&web=1';
			
			href($http.$l, 1, 9); pad(0);
			pad(0);
		}
		
		pad(0);
		indent('3203: Edit an archived thread (this will bring the chat back to live status):',6);
			if(!isset($ar_dS_chat)) {
				warning('Please archive at least one chat in the account in which you are involved.',6);
			} else {
				notice('The following from your chat is the target of this test:',9);
				notice($ar_hint,9);
				notice('The note will be adapted.',9);
				pad(0);
						$d = new C_date(); 
						$day = $d->getDayString();
					$dtm = 'This is the note changed on '.$day.' '.$d->getDateTimeString();
						
					$cid = 'cid='.$archid;
					$pts = '&pts='.$lid;
					$parms = $cid.$pts.'&note='.$dtm;
				$l = $host.$uri_1.'/post/chathread.php'.'?'.$parms.'&'.$par.'&web=1';
				
				href($http.$l, 1, 9); pad(0);
				pad(0);
			}
		
		pad();
		indent('3400: Add a phylactery in a chat:',6);
			if(!isset($dS_chat)) {
				warning('Please create at least one chat in the account in which you are involved.',6);
			} else {
					notice('The following from your chat is the target of this test:',9);
					notice($hint,9);
						$d = new C_date(); 
							$day = $d->getDayString();
						$dtm = 'My name is '.($context->dS_login->firstname).' and this '.$day.' on '.$d->getTimeString().' I am adding some blabla in the chat';
						$cid = 'cid='.$chid;
						
					notice('Let\'s drop one more phylactery:',9);
					notice('>> '.$dtm,9);
					
					$parms = $cid.'&bla='.$dtm;
					
				$l = $host.$uri_1.'/post/phylactery.php'.'?'.$parms.'&'.$par.'&web=1';
				pad(0);
				href($http.$l, 1, 9); pad(0);
			}
}



if(1) {	


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    D E L E T E


	pad(); h2('Quit / Delete / Archive');
		pad();	
		warning('WARNING: Some links might edit objects in the account '.$context->dS_account->name.'. USE ONLY A SANDBOX ACCOUNT !',6);
		pad();	
	
			
		indent('3600: Quit a chat:',6);
	
		if(!isset($dS_chat)) {
			warning('Please create at least one chat in the account in which you are involved.',6);
		} else {
				notice('This action exclude yourself from the chat participants list, recording your exit time in dS_participants::cueOut',9);
				notice('One phylacery is placed at the end of the conversation stating the quit event',9);
				notice('The following from your chat is the target of this test:',9);
				notice($hint,9);
					$cid = 'cid='.$chid;
				
				$parms = $cid;
				
			$l = $host.$uri_1.'/post/chatquit.php'.'?'.$parms.'&'.$par.'&web=1';
			pad(0);
			href($http.$l, 1, 9); pad(0);
		}
	
			
		pad();
		indent('3700: Archive a chat:',6);
	
		if(!isset($dS_chat)) {
			warning('Please create at least one chat in the account in which you are involved.',6);
		} else {
				notice('This action excludes all participants, recording exit time in dS_participants::cueOut',9);
				notice('One phylacery is placed at the end of the conversation stating the archive event',9);
				notice('The following from your chat is the target of this test:',9);
				notice($hint,9);
					$cid = 'cid='.$chid;
				
				$parms = $cid;
				
			$l = $host.$uri_1.'/post/chatarchive.php'.'?'.$parms.'&'.$par.'&web=1';
			pad(0);
			href($http.$l, 1, 9); pad(0);
		}
		
		
		pad();
		indent('3800: Delete a chat:',6);
	
		if(!isset($dS_chat)) {
			warning('Please create at least one chat in the account in which you are involved.',6);
		} else {
				notice('This action records the login id in C_dS_chat_thread::deletorId and deletion time in C_dS_chat_thread::deleted',9);
				notice('One phylacery is placed at the end of the conversation stating the delete event',9);
				notice('The following from your chat is the target of this test:',9);
				notice($hint,9);
					$cid = 'cid='.$chid;
				
				$parms = $cid;
				
			$l = $host.$uri_1.'/delete/delchat.php'.'?'.$parms.'&'.$par.'&web=1';
			pad(0);
			href($http.$l, 1, 9); pad(0);
		}
			
}


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    S W I T C H    T O   A N O T H E R    A C C O U N T 	/ o r   U S E R
	
	pad(3);
	h1('Context switch');

	pad();
	h2('Use another chat as target example');
		
		pad();
			

		$q = new Q('select chat_threads.id from chat_threads join chat_participants on chat_participants.groupId = chat_threads.id 
					where chat_participants.loginId = '.$lid.' and chat_threads.groupId = '.$aid.'
						and chat_threads.deletorId = 0
					order by chat_threads.created desc limit 20;');
		
		$chids = $q->ids(list_as_array);
		
		if(count($chids)) {
			indent('0000: Use one of those links to switch to another chat thread:',6);
			notice('(These are the chats your login is about in the same account)',11);
			
			foreach($chids as $chid) {
			$dS_chat = new C_dS_chat_thread($chid);
				$q = new Q('select visiId as id from chat_visirefs where groupId = '.$chid.' limit 1;');
				$vid=$q->ids();
				if($vid) $dS_visi = new C_dS_visitor($vid); else $dS_visi = false;
					
				$title = $dS_chat->title;
				if($dS_visi) $title = $dS_visi->lastname.', '.$dS_visi->firstname;
				$hint = 'chatid: '.$dS_chat->id.' = '.$title.', '.$dS_chat->note.'';
				
				pad();
				indent('chat '.$chid.' with title: '.($title),9);
				$l = $host.$uri_1.'/specs/chat.php'.'?'.$par.'&cid='.$chid.'&web=1';
				href($http.$l, 1, 9); pad(0);
			}
		} else {
			$hint = 'No Chat found for experimenting';
		}
		
		$akeys = new C_dbAccess_accesskey($context->dS_login->id);
		$accounts = new C_dbAccess_groups();
		$accounts->loadonkeys($akeys);
		
		pad(0);
			foreach($akeys->keyed as $a => $dS_akey) {
				$dS_acc = $accounts->keyed[$dS_akey->accountId];
				$inlog = $context->geturiaccessparms($dS_akey->id);
			}
				
	pad();
	
	pad();
	h2('Log to the same account as a different user');
		
		pad();
			

			$akeys = new C_dbAccess_accesskey();
			$akeys->loadOnAccount($aid);
			$akeys->magnifyToLogins();
			
		indent('0001: Use one of those links to switch the user:',6);
		notice('(These are the accounts your login is authorized to access)',11);
		pad(0);
			foreach($akeys->keyed as $a => $dS_akey) {
				if($dS_akey->dS_login->accessLevel < aLevel_operator) continue;
				$creds = 'lgn='.$dS_akey->dS_login->login.'&pwd='.$dS_akey->dS_login->password.'&kid='.$dS_akey->id;	
				indent($dS_akey->dS_login->lastname.' '.$dS_akey->dS_login->firstname.' :',9);
				$l = $host.$uri.'?'.$creds.'&web=1';
				href($http.$l, 0, 9); pad(0);
			}
		
		
	pad();
	h2('Switch to another account');
		
		pad();
			

			$akeys = new C_dbAccess_accesskey($context->dS_login->id);
			$accounts = new C_dbAccess_groups();
			$accounts->loadonkeys($akeys);
			
		indent('0000: Use one of those links to switch to another account:',6);
		notice('(These are the accounts your login is authorized to access)',11);
		pad(0);
			foreach($akeys->keyed as $a => $dS_akey) {
				$dS_acc = $accounts->keyed[$dS_akey->accountId];
				$inlog = $context->geturiaccessparms($dS_akey->id);
				indent($dS_acc->name.' :',9);
				$l = $host.$uri.'?'.$inlog.'&web=1';
				href($http.$l, 0, 9); pad(0);
			}
	pad();
		
		
		



pad(20);
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>