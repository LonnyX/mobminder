<?php
//////////////////////////////////////////////////////////////////////
//
//    A P I   /   P O S T    A    L O G    M S G 
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
require '../apilib.php';



$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_synchro,aLevel_operator,aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);

$kid = $context->dS_accesskey->id;
$rscid	= @$_REQUEST['rscid']; 		if(isset($rscid)) 	$rscid = $rscid; else $rscid = '';
$crit 	= @$_REQUEST['criticity']; 	if(isset($crit)) 	$crit = $crit; 	else $crit = false;
$clas 	= @$_REQUEST['class']; 		if(isset($clas)) 	$clas = $clas; 	else $clas = false;
$func 	= @$_REQUEST['function']; 	if(isset($func)) 	$func = $func; 	else $func = false;
$msg	= @$_REQUEST['msg']; 		if(isset($msg)) 	$msg = $msg; 	else $msg = false;
pad();


$perfReport->peak('::posted parameters retrieved and parsed');


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	h3('Checking for mandatory fields');
	
		if($kid===false)
			abort('9901','post/_log::You must specify a login key id');
		indent('kid: '.$kid.' (from your access credentials)',6);
	
		if($crit===false)
			abort('9902','post/_log::You must specify a criticity level');
		indent('criticity: '.$crit,6);
	
		if($clas===false)
			abort('9903','post/_log::You must specify a class/widget scope');
		indent('class: '.$clas,6);
	
		if($func===false)
			abort('9904','post/_log::You must specify a function scope');
		indent('function: '.$func,6);
	
		if($msg===false)
			abort('9905','post/_log::You must specify a message');
		indent('msg: '.substr($msg,0,32).'...',6);
		
		
	h3('Checking for optional fields');
	
		if($rscid)
			indent('rscid: '.$rscid.'',6);
	
	
	h3('Screening disallowed characters in fields');
	
		if(!(is_numeric($kid)))
			abort('9910','post/_log::kid id does not have a valid format');
	
	
	h3('Fields format/value validation');
		
		if($crit!='notice') if($crit!='warning') if($crit!='error') if($crit!='fatal')
			abort('9911','post/_log::criticity does not have a valid value');
		
		
pad();

//////////////////////////////////////////////////////////////////////
//
//   S A V E  
//

$dS_exception = new C_dS_exception_smartapp(0 /*new item*/, $kid, $_REQUEST);
$dS_exception->dSsave();

$perfReport->peak('::posted');


//////////////////////////////////////////////////////////////////////
//
//   S T R E A M
//
	h2('Object saved'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; 
span('&ltdata&gt');

			$fieldsL = Array('groupId','rscid','creator','creatorId','criticity','class','function','msg');
			
		echo '#C_dS_exception_smartapp'.$nl.$dS_exception->stream(false, '|', $fieldsL).$nl;
		
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
		
		
		h3('Exception attributes');
		
			h4('mandatory posts');
				indent('o kid: identifier for both originator login and account.',6);
				indent('o criticity: level of criticity for the logged exception.',6);
				indent('o class: free alpha max 128 chars.',6);
				indent('o function: free alpha max 128 chars. ',6);
				indent('o msg: free alpha text. ',6);
				
			h4('optional posts');
				indent('o rscid: Indicates which resource was displayed on screen when error was reported.',6);
			
	pad();
	
	h2('Returned objects');
	explainclass($dS_exception, $fieldsL, '|');
	
	h2('Feedback payload');
	payload();
	
pad();

$perfReport->peak('::streamed');
$perfReport->dropReport();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>