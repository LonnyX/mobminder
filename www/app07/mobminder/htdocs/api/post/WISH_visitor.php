<?php
//////////////////////////////////////////////////////////////////////
//
//    A P I   /   W I S H  / P O S T    V I S I T O R  
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

	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);


// $id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = false;
pad();


$perfReport->peak('::posted parameters retrieved and parsed');


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		// if($id===false)
			// abort('9090','post/visitors::You must specify a patient WISH id');
		// indent('WISH id: you passed '.$id,6);
		
		$birthday = 'not specified';
		if(!isset($_REQUEST['birthday'])) abort('9091','post/visitors::missing mandatory field:birthday'); else $birthday = $_REQUEST['birthday'];
		indent('birthday: you passed '.$birthday,6);
		
		$lastname = 'not specified';
		if(!isset($_REQUEST['lastname'])) abort('9092','post/visitors::missing mandatory field:lastname'); else $lastname = $_REQUEST['lastname'];
		indent('lastname: you passed '.$lastname,6);
			
		$firstname = 'not specified';
		if(!isset($_REQUEST['firstname'])) abort('9093','post/visitors::missing mandatory field:firstname'); else $firstname = $_REQUEST['firstname'];
		indent('firstname: you passed '.$firstname,6);
			
		$gender = 'not specified';
		if(!isset($_REQUEST['gender'])) abort('9094','post/visitors::missing mandatory field:gender'); else $gender = $_REQUEST['gender'];
		indent('gender: you passed '.$gender,6);
			
		$registration = 'not specified';
		if(!isset($_REQUEST['registration'])) abort('9095','post/visitors::missing mandatory field:registration'); else $registration = $_REQUEST['registration'];
		indent('registration: you passed '.$registration,6);
			
		$residence = 'not specified';
		if(!isset($_REQUEST['residence'])) abort('9096','post/visitors::missing mandatory field:residence'); else $residence = $_REQUEST['residence'];
		indent('residence: you passed '.$residence,6);
		
		// 
		
	
	h3('Screening disallowed fields');
	
		screenTrackingFieldsOverwrite();
		indent('none',6);
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($registration)))
			abort('9080','post/visitors::registration id is not integer');
	
		if(!(is_numeric($residence)))
			abort('9080','post/visitors::residence id is not integer');
	
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
		
	
	h3('Fields format/value validation');
		
		if($allok = fieldsvalidator($_REQUEST, $context)) { pad(0); indent('all fields have valid format and value range',6); }		
		
	
pad();




//////////////////////////////////////////////////////////////////////
//
//   RETRIEVE PATIENT mobminder id
//

	h2('Finding candidates for updation in Mobminder file register');
	
$accountscope = 'groupId = '.$context->accountid.' and deletorId = 0';
$matchids = 0; // if it is left zero after this process
$q = new Q('select id from visitors where '.$accountscope.' and registration = "'.$registration.'";');
$foundids = $q->ids(list_as_array);
$cnt = count($foundids);
if($cnt) {
	$matchids = $foundids;
	// here, if more than one was found, we should merge the doublons, left for later dev
	indent('Exact match on registration number, for '.$cnt.' patients',3);
	
	if($cnt>1) {
		warning(($cnt-1).' duplicate patients will be merged onto a unique one.',3);
		$merge = 1;
	}
	
} else { // registration (= WISH patient id) not yet existing in mobminder, let's find the patient based on birthday and lastname
	warning('registration number not existing yet in Mobminder...',3);

	$q = new Q('select id from visitors where '.$accountscope.' and birthday = "'.$birthday.'" and lastname = "'.$lastname.'" and firstname = "'.$firstname.'";');
	$luckyids = $q->ids(list_as_array);
	$cnt = $q->cnt();
	if($cnt>=1) { 
		$matchids = $luckyids; // at least one strict match found (we will update all doublons)
		indent('Exact match on lastname, birthday and firstname, for '.$cnt.' patients',3);
	}
	else {
		// Among visitors having unassigned registration so far,
		// let's try to find a close match: the first letter of LN and FN must always be correct, 
		// also the birthday must be exact or unspecified in the candidate record
		//
		// $sql = 'select id from visitors where '.$accountscope.' and (birthday = "'.$birthday.'" or birthday = 0) and registration = "" and lastname like "'.substr($lastname,0,1).'%" and firstname like "'.substr($firstname,0,1).'%";';
		$sql = 'select id from visitors where '.$accountscope.' and (birthday = "'.$birthday.'" or birthday = 0) and registration = "";';
		$q = new Q($sql);
		indent($sql,3);
		$ids = $q->ids(list_as_array);
		$idslist = $q->ids(list_as_string);
		$cnt = count($ids);
		indent('found likely visitors with ids = ['.$idslist.'] counts '.$cnt,3);
		if($cnt)
			if(strlen($lastname)>=5 || strlen($firstname)>=5) { // this match makes no sense if lastname and firstname are short
			
			$candidates = new C_dbAccess_visitors();
			$candidates->loadOnId($idslist);
			indent('Engaging Levenshtein match, on '.$candidates->count().' candidates.',3);
			// Here we associate each candidate with his Levenshtein distance on lastname
			$candidates->setLastnameLevenshtein($lastname); // sets ->LNlev
			$candidates->setFirstnameLevenshtein($firstname); // sets ->FNlev
			
			
			$LVmatchids = Array();
			foreach($candidates->keyed as $vid => $dS_v) { // first guess on LV distance = 1
				indent($dS_v->id.': comparing firstnames:'.$dS_v->firstname.'/'.$firstname.'/'.$dS_v->FNlev.', comparing lastname:'.$dS_v->lastname.'/'.$lastname.'/'.$dS_v->LNlev);
				if($dS_v->LNlev <= 1 && $dS_v->FNlev <= 1) {
					$LVmatchids[] = $dS_v->id;
					warning('Match with levenshtein distance = 1',3);
					
				}
			}
			if(!count($LVmatchids)) {
				foreach($candidates->keyed as $vid => $dS_v) { // first guess on LV distance = 2
					if($dS_v->LNlev <= 1 && $dS_v->FNlev <= 2) {
						$LVmatchids[] = $dS_v->id;
						warning('Match with levenshtein distance = 1/2',3);
					}
				}
			}
			if(!count($LVmatchids)) {
				foreach($candidates->keyed as $vid => $dS_v) { // first guess on LV distance = 2
					if($dS_v->LNlev <= 2 && $dS_v->FNlev <= 1) {
						$LVmatchids[] = $dS_v->id;
						warning('Match with levenshtein distance = 2/1',3);
					}
				}
			}
			$lvcnt = count($LVmatchids);
			if($lvcnt) { 
				
				indent('Found '.$lvcnt.' on Levenshtein lieklyhood.',3);
				$matchids = $LVmatchids;
			}
		} else {
			warning('Levenshtein match is not possible as one of firstname or latsname is shorter than 5 chars.',3);
		}
	}

} // when going out from here, you have either $id = 0 (we will make a new patient), or $id = 'id1, id2, id3, ...' (most often only one).



//////////////////////////////////////////////////////////////////////
//
//   S A V E  
//
$visitorfinal = 0;
if($matchids===0) {
	warning('Creating a new patient in Mobminder',3);
	
	if(!isset($_REQUEST['language'])) $_REQUEST['language'] = $context->dS_account->language;
	$dS_visitor = new C_dS_visitor(0, $context->accountid, $_REQUEST);
	$dS_visitor->email = strtolower($dS_visitor->email); // some format fixing for free
	$dS_visitor->dSsave();
	$id = $dS_visitor->id;
	$visitorfinal = $dS_visitor; // that is a new id
} else {
	// 
	$cnt = count($matchids); // that is at least one
	// one or more candidates were found, we will update them
	warning('Updating '.$cnt.' patients in Mobminder',3);
	
	// empty parameters passed through the api should not replace existing values in mobminder
	if(isset($_REQUEST['email'])) if($_REQUEST['email']=='') unset($_REQUEST['email']); 
	if(isset($_REQUEST['phone'])) if($_REQUEST['phone']=='') unset($_REQUEST['phone']); 
	if(isset($_REQUEST['mobile'])) if($_REQUEST['mobile']=='') unset($_REQUEST['mobile']); 
	if(isset($_REQUEST['language'])) if($_REQUEST['language']=='') unset($_REQUEST['language']); 
	
	if(isset($_REQUEST['address'])) if($_REQUEST['address']=='') unset($_REQUEST['address']); 
	if(isset($_REQUEST['city'])) if($_REQUEST['city']=='') unset($_REQUEST['city']); 
	if(isset($_REQUEST['zipcode'])) if($_REQUEST['zipcode']=='') unset($_REQUEST['zipcode']); 
	if(isset($_REQUEST['country'])) if($_REQUEST['country']=='') unset($_REQUEST['country']); 
	if(isset($_REQUEST['company'])) if($_REQUEST['company']=='') unset($_REQUEST['company']); 
	
	if(isset($_REQUEST['reference'])) if($_REQUEST['reference']=='') unset($_REQUEST['reference']); 
	if(isset($_REQUEST['note'])) unset($_REQUEST['note']); // may not replace the mobminder visitor's note
	
	
	
	foreach($matchids as $vid) { // update visitors
		$_REQUEST['id'] = $vid;
		
		$dS_visitor = new C_dS_visitor($vid, $context->accountid, $_REQUEST); // this retrieves the visitor with id = $vid, and replaces all fields with the content of $_REQUEST
		$dS_visitor->email = strtolower($dS_visitor->email); // some format fixing for free
		$dS_visitor->dSsave();
		$visitorfinal = $dS_visitor; // these are existing ids
		
		break; // we update only the first in line candidates, all others are considered duplicates (doublons) and are merged to this one. 
	}
	unset($matchids[$visitorfinal->id]); // remove from the matching list the one we keep, all others will be merge in the next lines
	
	// merging other instances
	foreach($matchids as $vid) { // update visitors
		$_REQUEST['id'] = $vid;
		$dS_visitor = new C_dS_visitor($vid, $context->accountid,$_REQUEST); // this retrieves the visitor with id = $vid
		$dS_visitor->email = strtolower($dS_visitor->email); // some format fixing for free
		$dS_visitor->mergeTo($visitorfinal->id, $context->dS_account, $visitorfinal);
	}
}

$perfReport->peak('::posted');


//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//
	h2('Object saved'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; 
span('&ltdata&gt');

			// $fieldsV = Array('id','created','creator','creatorId','changed','changer','changerId','deleted','deletorId','gender','firstname','lastname','company','address','residence','registration','zipCode','city','country','email','mobile','phone','language','birthday');
			$fieldsV = Array('id','gender','firstname','lastname','birthday','residence','registration','address','zipCode','city','country','email','mobile','phone','language');

			// $fieldsV = C_api::fieldslist('C_dS_visitor', $context->dS_login->accessLevel);			
		echo '#C_dS_visitor'.$nl.$dS_visitor->stream(false, '|', $fieldsV).$nl;
		
span('&lt/data&gt');
echo '</data>'; 



//////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L  
//

pad();
	technicalspecH1();
	
		h2('Principles');
			indent('o Birthday: is mandatory and should always be provided.',6);
			indent('o Lastname and firstname can be wrongly typed in Mobminder, up to 2 chars are allowed in Levenstein distance for each of fn and ln.',6);
			indent('o If mutliple match are found in Mobminder for a given patient, all of them are updated with master data coming from WISH, but duplicates are reduced thereafter.',6);
			indent('o Existing information in Mobminder not provided by a call from WISH is not replaced, they are conserved.',6);
			indent('o WISH can not set a field to blank. When empty parameters are passed, they are ignored. Only non blank provided parameters are updated',6);
			indent('o The full patient file is returned to WISH as a response to this call. So, it is possible for WISH to gather contact information (email, phone, mobile,...) already existing in Mobminder.',6);
			indent('o Duplicates in Mobminder are resolved by this webservice.',6);
	
		h2('Merging Duplicates');	
			indent('o When multiple patients in Mobminder have the same WISH id, they get merged into one instance.',6);
			indent('o When multiple patients having no WISH id in mobminder are identified by their birthday or close or exact lastname and close or exact firstname, they get the WISH id provided on the interface and are merged into a single instance.',6);
		
		h2('Input parameters');
	
		exlainloginputs(); 
		
		
		h3('Patient data update');
		
			h4('mandatory posts');
				// indent('o id: Positive integer, an existing patient id in the WISH system.',6);
				indent('o birthday: straight sortable birthday format like 19991231, positive INTEGER!. (*3)',6);
				indent('o lastname: at least 2 characters alphabetic format UTF-8.',6);
				indent('o firstname: at least 1 character alphabetic format UTF-8.',6);
				indent('o gender: 0 for female, 1 for male. Positive integer.',6);
				indent('o registration (patient WISH id): alpha num free text. (Integer in WISH).',6);
				indent('o residence: (WISH: admission number or inpatient stay id), alpha num free text. (Integer in WISH).',6);
			
			h4('optional posts');
				indent('o mobile: international formatted mobile number with heading country code and heading +. Example: +33659123456 (*1) or locally expressed mobile number with heading trunk 0. Example: 0493655599 (*2)',6);
				indent('o phone: local or international formatted phone number.',6);
				indent('o email: properly formatted email value, including @ and a min 2 digits tail.',6);
				indent('o language: numeric field ranging [0 to 7]. See object description for code to language matching value. Defaults to the account set default language.',6);
				
				indent('o company: alpha num free text.',6);
				indent('o address: alpha num free text.',6);
				indent('o zipCode: alpha num free text.',6);
				indent('o city: alpha num free text.',6);
				indent('o country: alpha num free text.',6);
				
				indent('o reference: alpha num free text.',6);
				indent('o note: alpha num free text (*4).',6);

			h4('caution');
				indent('(1*) mobiles are screened for correct number of digits (this is depending the country code). When a wrongly formatted reaches the api, it is discarded (not recorded).',6);
				indent('(2*) All mobile numbers are turned to international format. When the heading trunk 0 is detected, it is converted into the account regional country code found in the Mobminder setup.',6);
				indent('(3*) Birthday may not be a future date. Year, month and day range are screened.',6);
				indent('(4*) Note that any free text field is screened for SQL injection and script injection.',6);
		
		
		// h3('existing visitor');
		
			// h4('mandatory posts');
				// indent('o id: positive, must match an existing visitor.',6);
			
			// h4('optional posts');
				// indent('o are identical to the new visitor section optional posts.',6);
			
			
			
	pad();
	
	h2('Returned objects');
	explainclass($dS_visitor, $fieldsV, '|');
	
	h2('Feedback payload');
	payload();
	
pad();

$perfReport->peak('::streamed');
$perfReport->dropReport();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>