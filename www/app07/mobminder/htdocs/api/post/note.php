<?php
//////////////////////////////////////////////////////////////////////
//
//    A P I   /   P O S T    a   N O T E
//
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/post/visitor.php?id=2387596&firstname=Patrick&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//      http://localhost/api/post/visitor.php?id=2387596&firstname=Pascal&mobile=%2b32493655599&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//
//	Note that %2b stands for the '+' heading international mobile numbers
// 
// Testing: use &web=1 to get html rendering.
//

ob_start(); // relates to (*cc)

require '../apilib.php'; // keep ahead of includes, see (*rq01*)



$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);


$id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = false; $isnew = false; if($id<=0) $isnew = true;
$title = @$_REQUEST['title']; if(isset($title)) $title = $title; else $title = false;
$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1


$loginids = @$_REQUEST['loginids']; if(isset($loginids)) $loginids = explode('!',$loginids); else $loginids = false;
$visirefs = @$_REQUEST['visirefs']; if(isset($visirefs)) $visirefs = explode('!',$visirefs); else $visirefs = false;


$midnIn 	= @$_REQUEST['midnIn']; 	if(isset($midnIn)) $midnIn = $midnIn; else $midnIn = false; 
$midnOut 	= @$_REQUEST['midnOut']; 	if(isset($midnOut)) $midnOut = $midnOut; else $midnOut = false; 
$note 		= @$_REQUEST['note']; 		if(isset($note)) $note = $note; else $note = false;

$cssColor = false; //  To Be Developped
$cssPattern = false;
$cssTags = false;

pad();


$perfReport->peak('::posted parameters retrieved');





//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if($id===false)
			abort('1200','post/note::You must specify a note id');
		indent('o id: '.$id,6);
		
		if($isnew) {
			if(!$title) if(!$visirefs) abort('1201','post/note::either visirefs or title is mandatory.');
			indent('o title: '.($title?$title:'not provided'),6);
			indent('o visirefs: '.($visirefs?implode(',',$visirefs):'not provided'),6);
		} 
	
	h3('Checking optional fields');
	
		if($loginids) {
			indent('loginids: '.($loginids?implode(',',$loginids):'not provided'),6);
		}
		else if($isnew) indent('o loginids: NONE, the note applies to all logins in this account.',6);
			else  indent('o loginids: NONE, the note addressees will remain as is.',6);
		
		indent('o midnIn: '.($midnIn===false?'not provided':$midnIn),6);
		indent('o midnOut: '.($midnOut===false?'not provided':$midnOut),6);
		indent('o note: '.($note===false?'not present':$note),6);
	
		if($utc) indent('o utc time format: YES',6); else indent('o utc time format: NO',6);
			
	
	h3('Screening disallowed fields');
	
		screenTrackingFieldsOverwrite();
		indent('none',6);
	
	
	h3('Screening disallowed characters in fields');
	
		if(!is_numeric($id))
			abort('1021','post/note:: id does not have a valid format');


		//   T I M E    F O R M A T    C O N V E R S I O N

		if($midnIn===false) { // not provided
			if($isnew) $midnIn = 0; // new item will use the default value, which is zero 
			else $midnIn=false; // existing items will not be edited on this parameter
		} 
		else if($midnIn==='0') $midnIn = 0;  // then it is everbeen/forever, it stays zero in DB
		else $midnIn = $context->timeStampToUTC($rcuein, $utc); // translates into unix UTC according to the $utc provided setting
		
		if($midnIn!==false) if(!is_numeric($midnIn))
			abort('1022','post/note:: midnIn does not have a valid format');
			
			

		if($midnOut===false) { // not provided
			if($isnew) $midnOut = 0; // new item will use the default value, which is zero 
			else $midnOut=false; // existing items will not be edited on this parameter
		} 
		else if($midnOut==='0') $midnOut = 0;  // then it is everbeen/forever, it stays zero in DB
		else $midnOut = $context->timeStampToUTC($rcuein, $utc); // translates into unix UTC according to the $utc provided setting

		if($midnOut!==false) if(!is_numeric($midnOut))
			abort('1023','post/note:: midnOut does not have a valid format');
	
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
		
	
	
	h3('Fields format/value validation');
		
		if($id>0) {
			$q = new Q('select id from notes_details where groupId = '.$context->accountid.' and id = '.$id.';');
			if(!($q->ids()))
				abort('1031','post/visitors::You must specify a valid note id');
			else 
				indent('o this note id is valid: '.$id,6);
		}
		$dS_note = new C_dS_note_detail($id,$context->accountid); // keep this line after format and value validation
		
	
		if($loginids) {
			foreach($loginids as $x => $loginId)
				if(!is_numeric($loginId)) abort('1032','post/note::each of login id must be numeric.');
	
			foreach($loginids as $x => $loginId) {
				$q = new Q('select id from logins where groupId = '.$context->accountid.' and id = '.$loginId.';');
				if($q->cnt()) indent('o this login id is valid: '.$loginId,6);
				else abort('1033','this login id is invalid: '.$loginId);
			}
		}
	
		if($visirefs) {
			foreach($visirefs as $x => $visiId)
				if(!is_numeric($visiId)) abort('1034','post/note::each of visitor reference id must be numeric.');
	
			foreach($visirefs as $x => $visiId) {
				$q = new Q('select id from visitors where groupId = '.$context->accountid.' and id = '.$visiId.';');
				if($q->cnt()) indent('o this visitor id is valid: '.$visiId,6);
				else abort('1035','this visitor id is invalid: '.$visiId);
			}
		}


		if($midnIn!==false) $dS_note->midnIn = $midnIn;
		if($midnOut!==false) $dS_note->midnOut = $midnOut;
		if(!$dS_note->hasValidTimeFrame()) abort('1201','the provided midnOut/midnOut combination is invalid.');
		
		
		if($allok = fieldsvalidator($_REQUEST, $context)) { pad(0); indent('all fields have valid format and value range',6); }		
		
	
pad();


$perfReport->peak('::screened');






//////////////////////////////////////////////////////////////////////
//
//   S A V E  
//


	if($title!==false) 		$dS_note->title 	= $title;
	if($note!==false) 		$dS_note->note 		= $note;
	if($cssColor!==false) 	$dS_note->cssColor 	= $cssColor;
	if($cssPattern!==false) $dS_note->cssPattern = $cssPattern;
	if($cssTags!==false) 	$dS_note->cssTags 	= $cssTags;
		
	$dS_note->dSsave();
	$nid = $dS_note->id; // newly assigned or existing note id
	
	$x_note_addressees 	= new C_dbAccess_note_addressees($nid); // loaded with existing items if existing
	$x_note_visirefs 	= new C_dbAccess_note_visirefs($nid);
	
	$note_addressees 	= new C_dbAccess_note_addressees(); // virgin
	$note_visirefs 		= new C_dbAccess_note_visirefs();
	
	$note_visitors = new C_dbAccess_visitors(implode(',',$visirefs));
	
	if($visirefs) {
		foreach($visirefs as $x => $visiId) {
			$ref = $note_visirefs->newVirtual();
			$ref->visiId = $visiId;
		}
		$x_note_visirefs->deleteAll(); // purge previous setting
		
	} else { // existing visirefs remain unchanged, or unexisting if saving a new item
		
	} 
	
	$note_visirefs->saveAll($nid);
	
	
	if($loginids) {
		foreach($loginids as $x => $loginId) {
			$note_addressees->newVirtual()->loginId = $loginId;
		}
		$x_note_addressees->deleteAll(); // purge previous setting
		
	} else { // addressees were not specified
		
		if($isnew) { // all of the staff is adressed
			
			$note_addressees->loadStaff($context->accountid, aLevel_manager); // each of staff users up to manager level, see (*av02*)
			
		} else { // no change to existing setting
			
			$note_addressees = $x_note_addressees;
		}
	}
	
	$note_addressees->saveAll($nid);
	
	
$perfReport->peak('::posted');





//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//

	h2('Object saved'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; 
span('&ltdata&gt');


	$bank = no_bank; 
	$sep = '|';
			
	echo $note_addressees->stream(no_alias, no_bank, with_tracking, $sep);
	echo $note_visirefs->stream(no_alias, no_bank, with_tracking, $sep);
		
		$fieldsND = Array('id','groupId','created','creator','creatorId','changed','changer','deletor','deletorId','midnIn','midnOut','title','note','cssColor','cssPattern','cssTags','archived');
	echo '#C_dS_note_detail'.$nl.$dS_note->setstringtimeformat($utc)->stream(with_tracking, $sep = '|', $fieldsND).$nl;

		$fieldsV = C_api::fieldslist('C_dS_visitor', $context->dS_login->accessLevel);	
	echo $note_visitors->stream(no_alias, no_bank, with_tracking, $sep, $fieldsV);
		
		
span('&lt/data&gt');
echo '</data>'; 


$perfReport->peak('::feedback streamed');






//////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L  
//

pad();
	technicalspecH1();
	
		h2('Input parameters');
	
		exlainloginputs(); 
		
		
		h3('new note');
		
			h4('mandatory posts');
				indent('o id: zero or negative forces the creation of a new note. Positive will update an existing note.',6);
				indent('o title or visirefs: one of which is mandatory, see below for range and conditions.',6);
			
			h4('optional posts');
				indent('o loginids: who are this note adressees separated by exclam marks, like \'21293!20664!7875\'. Defaults to all logins having access to the account. For an updated note, defaults to no change in addressees.',6);
				indent('o midnIn: is the date/time for this note to become visible. Defaults to zero (everbeen in the past). Units are UTC or timestamp according to the utc parameter setting.',6);
				indent('o midnOut:  is the date/time for this note to become invisible. Defaults to zero (forever visible in the future). Units are UTC or timestamp according to the utc parameter setting.',6);
				indent('o title: alpha num free text varchar(256).',6);
				indent('o visirefs: valid visitor id\'s separated by exclam marks, like \'4153442!4153666!7442555\'.',6);
				indent('o note: alpha num free text.(1*)',6);
				
				indent('o cssColor: id of a valid css color object as provided by the call on the config interface (only class 14 and type 80).',6);
				indent('o cssPattern: id of a valid css color object as provided by the call on the config interface (only class 14 and type 81).',6);
				indent('o cssTags: ids of a valid css tag objects as provided by the call on the config interface, separated by exclam mark (only class 14 and type 82).',6);

			h4('caution');
				indent('(1*) Note that any free text field is screened for SQL injection and script injection.',6);
		
		
		h3('existing note');
		
			h4('mandatory posts');
				indent('o id: positive, must match an existing note.',6);
			
			h4('optional posts');
				indent('o are identical to the new visitor section optional posts. One of visiref or title must stay non void.',6);
			
			
			
	pad();
	
	h2('Returned objects');
		explainclass($dS_note, $fieldsND, '|', 6);
		explainclass($note_addressees, false, '|');
		explainclass($note_visirefs	, false, '|');
		explainclass($note_visitors, $fieldsV, '|');
	
	h2('Feedback payload');
	payload();
	
pad();

$perfReport->peak('::tutorial streamed');

$perfReport->dropReport();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>