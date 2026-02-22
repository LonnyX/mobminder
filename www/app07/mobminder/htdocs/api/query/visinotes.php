<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Q U E R Y    V I S I T O R 'S   related   N O T E S,  T A S K S   a n d   C H A T S 
//

ob_start(); // relates to (*cc)
require '../apilib.php'; // keep ahead of includes, see (*rq01*)


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <file></file>
//
//
// http://localhost/api/query/visiapps.php?id=2387596&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//
// 

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);


$id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = '';
$history = @$_REQUEST['history']; if(!isset($history)) $history = false;
$deleted = @$_REQUEST['deleted']; if(!isset($deleted)) $deleted = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1
pad();

$perfReport->peak('::time needed to retrieve context and posted parameters');



//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if(!($id)) abort('0310','You must specify a visitor id');
		indent('o id: '.$id,6);
	
	h3('Checking optional fields');
	
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);
	
		if($deleted===false) { indent('o deleted: omitted, default is without deleted items',6);
		} else indent('o deleted: '.$deleted,6);
		
		
	h3('Screening disallowed fields');
	
		indent('none',6);
		
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($id)))
			abort('0311','visitor id must be numeric');
		 
		
		indent('all fields are made from allowed chars',6);
	
		// if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);

	
	h3('Fields format and value validation');
	
	
		$q = new Q('select id from visitors where id = '.$id.' and groupId = '.$context->accountid.';');
		if(!($q->ids())) abort('0312','You must specify a valid visitor Id');
		
		if($deleted===false) {
			$deleted = 0;
		} else
			if($deleted!=1&&$deleted!=0)  abort('0313','deleted is out of range [0,1], you passed:'.$deleted);
		
		$deleted = !!$deleted;
		indent('all fields have valid format and value range',6);
		
		
pad();

$perfReport->peak('::parameters screened');



//////////////////////////////////////////////////////////////////////
//
//   Q U E R Y    D A T A 
//
	
	$visiId = $id;

// references in notes, tasks and chats
//
	$notesIds = Array( 0=>false, 1=>false );
	$tasksIds = Array( 0=>false, 1=>false );
	$chatsIds = Array( 0=>false, 1=>false );
	$target   = Array( 0=>'', 1=>'archive_' );

	foreach($target as $x => $arch) {
	
		$q = new Q('SELECT groupId FROM '.$arch.'note_visirefs WHERE visiId='.$visiId.';'); $notesIds[$x] = $q->groupIds();
		$q = new Q('SELECT groupId FROM '.$arch.'task_visirefs WHERE visiId='.$visiId.';'); $tasksIds[$x] = $q->groupIds();
		$q = new Q('SELECT groupId FROM '.$arch.'chat_visirefs WHERE visiId='.$visiId.';'); $chatsIds[$x] = $q->groupIds();
	
		$_note_details[$x] 	= new C_dbAccess_note_details($notesIds[$x], $arch);
		$_note_addressees[$x] = new C_dbAccess_note_addressees($notesIds[$x], $arch);
		$_note_visirefs[$x] 	= new C_dbAccess_note_visirefs($notesIds[$x], $arch);
		$_note_visitors[$x] 	= new C_dbAccess_visitors($_note_visirefs[$x]->getList('visiId'));
		
		$_task_assignees[$x] 		= new C_dbAccess_task_assignees($tasksIds[$x], $arch);
		$_task_descriptions[$x] 	= new C_dbAccess_task_descriptions($tasksIds[$x], $arch);
		$_task_visirefs[$x] 		= new C_dbAccess_task_visirefs($tasksIds[$x], $arch);
		$_task_visitors[$x] 		= new C_dbAccess_visitors($_task_visirefs[$x]->getList('visiId'));
		
		$_chat_participants[$x] 	= new C_dbAccess_chat_participants($chatsIds[$x], $arch);
		$_chat_threads[$x] 		= new C_dbAccess_chat_threads($chatsIds[$x], $arch);
		$_chat_visirefs[$x] 	= new C_dbAccess_chat_visirefs($chatsIds[$x], $arch);
		$_chat_visitors[$x] = new C_dbAccess_visitors($_chat_visirefs[$x]->getList('visiId'));
	}
	
	$note_details 		= $_note_details[0]; 		$note_details->absorb( $_note_details[1] );
	$note_addressees 	= $_note_addressees[0]; 	$note_addressees->absorb( $_note_addressees[1] );
	$note_visirefs 		= $_note_visirefs[0]; 		$note_visirefs->absorb( $_note_visirefs[1] );
	$note_visitors 		= $_note_visitors[0]; 		$note_visitors->absorb( $_note_visitors[1] );
	
	$task_assignees 	= $_task_assignees[0]; 		$task_assignees->absorb( $_task_assignees[1] );
	$task_descriptions 	= $_task_descriptions[0]; 	$task_descriptions->absorb( $_task_descriptions[1] );
	$task_visirefs 		= $_task_visirefs[0]; 		$task_visirefs->absorb( $_task_visirefs[1] );
	$task_visitors 		= $_task_visitors[0]; 		$task_visitors->absorb( $_task_visitors[1] );
	
	$chat_participants 	= $_chat_participants[0]; 	$chat_participants->absorb( $_chat_participants[1] );
	$chat_threads 		= $_chat_threads[0]; 		$chat_threads->absorb( $_chat_threads[1] );
	$chat_visirefs 		= $_chat_visirefs[0]; 		$chat_visirefs->absorb( $_chat_visirefs[1] );
	$chat_visitors 		= $_chat_visitors[0]; 		$chat_visitors->absorb( $_chat_visitors[1] );
	

$perfReport->peak('::loaded notes, tasks, chats');


	
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.'); pad(0);
	
echo '<data>';
span('&ltdata&gt');


	$bank = no_bank; 
	$sep = '|';
	$fieldsV = C_api::fieldslist('C_dS_visitor', $context->dS_login->accessLevel);

		$fieldsND = Array('id','groupId','created','creator','creatorId','changed','changer','deletor','deletorId','midnIn','midnOut','title','note','cssColor','cssPattern','cssTags','archived');
	echo $note_details->stream(no_alias, no_bank, with_tracking, $sep, $fieldsND);
	
	echo $note_addressees->stream(no_alias, no_bank, with_tracking, $sep);
	echo $note_visirefs->stream(no_alias, no_bank, with_tracking, $sep);
	echo $note_visitors->stream(no_alias, no_bank, with_tracking, $sep, $fieldsV);
	
		$fieldsTD = Array('id','groupId','created','creator','creatorId','changed','changer','deletor','deletorId','title','midnOut','title','description','midnIn','cssColor','cssTags','archived');
	echo $task_descriptions->stream(no_alias, no_bank, with_tracking, $sep, $fieldsTD);
	echo $task_assignees->stream(no_alias, no_bank, with_tracking, $sep);
	echo $task_visirefs->stream(no_alias, no_bank, with_tracking, $sep);
	echo $task_visitors->stream(no_alias, no_bank, with_tracking, $sep, $fieldsV);
	
		$fieldsCT = Array('id','groupId','created','creator','creatorId','changed','changer','deletor','deletorId','title','midnOut','title','note','cssColor','cssPattern','cssTags','cversion','archived');
	echo $chat_threads->stream(no_alias, no_bank, with_tracking, $sep, $fieldsCT);
	echo $chat_participants->stream(no_alias, no_bank, with_tracking, $sep);
	echo $chat_visirefs->stream(no_alias, no_bank, with_tracking, $sep);
	echo $chat_visitors->stream(no_alias, no_bank, with_tracking, $sep, $fieldsV);


span('&lt/data&gt');
echo '</data>';	




//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

$perfReport->peak('::protocol streamed');

$perfReport->dropReport(); // no perf report for production




//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o id: the visitor unique id. This id must exist in the target account. The target account is defined by login/and pass.',6);
		
		h3('optional posts');
		indent('o deleted: includes deleted elements. Range [0,1]. Default:0 (deleted items not included)',6);
		indent('o utc: time variables are provided as Unix Time Code',6);
	
	pad(0); h2('Returned objects');
	
		h3('for notes');

			explainclass($note_details	, $fieldsND, '|', 6);
			explainclass($note_addressees, false, '|');
			explainclass($note_visirefs	, false, '|');
	
		h3('for tasks');

			explainclass($task_descriptions	, $fieldsTD, '|', 6);
			explainclass($task_assignees	, false, '|', 6);
			explainclass($task_visirefs	, false, '|', 6);
			
	
		h3('for chats');

			explainclass($chat_threads	, $fieldsCT, '|', 6);
			explainclass($chat_participants	, false, '|', 6);
			explainclass($chat_visirefs	, false, '|', 6);

	
		h3('common to notes, tasks and chats');

			explainclass($chat_visitors	, false, '|', 6);
	
	
	pad(0); h2('Feedback payload');
	payload();
	
pad();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>