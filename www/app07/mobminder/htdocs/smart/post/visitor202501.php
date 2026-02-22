<?php
//////////////////////////////////////////////////////////////////////
//
//    S M A R T   A P P    A P I   /   P O S T    V I S I T O R  
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
require '../smapplib202501.php';



$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);


$id = @$_REQUEST['id']; if(isset($id)) $id = $id; else $id = false;
pad();


$perfReport->peak('::posted parameters retrieved and parsed');


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if($id===false)
			abort('1000','post/visitors::You must specify a visitor id');
		indent('id: found '.$id,6);
		
		if($id<=0) {
			if(!isset($_REQUEST['lastname'])) abort('1010','gate::missing mandatory field:lastname');
				indent('lastname: found',6);
			if(!isset($_REQUEST['firstname'])) abort('1011','gate::missing mandatory field:firstname');
				indent('firstname: found',6);
		}
		
	
	h3('Screening disallowed fields');
	
		screenTrackingFieldsOverwrite();
		indent('none',6);
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($id)))
			abort('1021','post/visitors::visitor id does not have a valid format');
	
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
		
	
	h3('Fields format/value validation');
		
		if($id>0) {
			$q = new Q('select id from visitors where id = '.$id.' and groupId = '.$context->accountid.';');
			if(!($q->ids()))
				abort('1022','post/visitors::You must specify a valid visitor Id');
		}
		
		if($allok = fieldsvalidator($_REQUEST, $context)) { pad(0); indent('all fields have valid format and value range',6); }		
		
	
pad();

//////////////////////////////////////////////////////////////////////
//
//   S A V E  
//

if($id<0) {
	if(!isset($_REQUEST['language'])) $_REQUEST['language'] = $context->dS_account->language;
}

$dS_visitor = new C_dS_visitor($id, $context->accountid, $_REQUEST);

$dS_visitor->email = strtolower($dS_visitor->email);

$dS_visitor->dSsave();
$id = $dS_visitor->id;

$perfReport->peak('::posted');


//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//
	h2('Object saved'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; 
span('&ltdata&gt');

			// $fieldsV = Array('id','created','creator','creatorId','changed','changer','changerId','deleted','deletorId','gender','firstname','lastname','company','address','residence','zipCode','city','country','email','mobile','phone','language','birthday','registration','cssColor','cssPattern','cssTags','note');

			$fieldsV = C_api::fieldslist('C_dS_visitor');			
		echo '#C_dS_visitor'.$nl.$dS_visitor->stream(false, '|', $fieldsV).$nl;
		
span('&lt/data&gt');
echo '</data>'; 



//////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L  
//

pad();
	technicalspecH1();
	
		h2('Input parameters');
	
		exlainloginputs(); 
		
		
		h3('new visitor');
		
			h4('mandatory posts');
				indent('o id: zero or negative forces the creation of a new visitor. Positive must match an existing visitor record in the given account.',6);
				indent('o lastname: mandatory, at least 2 characters alpha.',6);
				indent('o firstname: mandatory, at least 1 character alpha.',6);
			
			h4('optional posts');
				indent('o mobile: international formatted mobile number with heading country code and heading +. Example: +33659123456 (*1) or locally expressed mobile number with heading trunk 0. Example: 0493655599 (*2)',6);
				indent('o phone: local or international formatted phone number.',6);
				indent('o birthday: straight sorting brithday format like 19991231. (*3)',6);
				indent('o email: properly formatted email value, including @ and a min 2 digits tail.',6);
				indent('o language: numeric field ranging [0 to 7]. See object description for more details on the right value. Defaults to the account set default language.',6);
				indent('o gender: 0 for female, 1 for male.',6);
				indent('o company: alpha num free text.',6);
				indent('o address: alpha num free text.',6);
				indent('o residence: alpha num free text.',6);
				indent('o zipCode: alpha num free text.',6);
				indent('o city: alpha num free text.',6);
				indent('o country: alpha num free text.',6);
				indent('o registration: alpha num free text.',6);
				indent('o reference: alpha num free text.',6);
				indent('o note: alpha num free text (*4).',6);
				indent('o cssColor: id of a valid css color object as provided by the call on the config interface (only class 3 and type 80).',6);
				indent('o cssPattern: id of a valid css color object as provided by the call on the config interface (only class 3 and type 81).',6);
				indent('o cssTags: ids of a valid css tag objects as provided by the call on the config interface, separated by exclam mark (only class 3 and type 82).',6);

			h4('caution');
				indent('(1*) mobiles are screened for correct number of digits (this is depending the country code). When a wrongly formatted reaches the api, it is discarded (not recorded).',6);
				indent('(2*) All mobile numbers are turned to international format. When the heading trunk 0 is detected, it is converted into the account regional country code found in the Mobminder setup.',6);
				indent('(3*) Birthday may not be a future date. Year, month and day range are screened.',6);
				indent('(4*) Note that any free text field is screened for SQL injection and script injection.',6);
		
		
		h3('existing visitor');
		
			h4('mandatory posts');
				indent('o id: positive, must match an existing visitor.',6);
			
			h4('optional posts');
				indent('o are identical to the new visitor section optional posts.',6);
			
			
			
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