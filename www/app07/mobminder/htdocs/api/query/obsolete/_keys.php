<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M O B   A P P    A P I   /   Q U E R Y    H U M A N    L O G I N    K E Y S
//
//
//    NO KEY ID REQUIRED FOR THIS API
//
ob_start(); // relates to (*cc)
require '../apilib.php'; // keep ahead of includes, see (*rq01*)


//
// You need to create a login with human access leve in the Mobminder setup (manager, spervisor, operator, delegate, admin). 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/query/keys.php?lgn=h4daxa&pwd=h4daxa&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

checkRequest4sqlInjection();

pad(); h2('Checking access rights');

		$login 	= $_REQUEST['lgn'];
		$pass 	= $_REQUEST['pwd'];	
	$dS_login = C_dS_login::logon($login, $pass);
	if(!$dS_login) abort('0006','Wrong login/pass combination');


$perfReport->peak('::time needed to log in');


	$akeys = new C_dbAccess_accesskey($dS_login->id);
$perfReport->peak('::access keys loaded');

	$accounts = new C_dbAccess_groups();
	$accounts->loadonkeys($akeys);
	
	
$perfReport->peak('::accounts loaded');



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');
	
	$stream = '';
	
		//    L O G I N
				$sign 		= Array('id','gender','lastname','firstname','company','language','residence','address','zipCode','city','country','email','mobile','phone','profession');
				$options 	= Array('GMT','weeknumb','color','permissions','accessLevel');
			$fieldsL = array_merge($sign,$options);
		$stream .= '#C_dS_login'.$nl.$dS_login->stream(false, '|', $fieldsL).$nl;
	
	
		//    A C C E S S    K E Y S
			$fieldsK = Array('id','groupId','accountId','bCals','uCals','fCals');
		$stream .= $akeys->stream(false, false, false, '|', $fieldsK);


		//    A C C O U N T S
			$fieldsA = Array('id','name','color','pattern','tag');
		$stream .= $accounts->stream(false, false, false, '|', $fieldsA);
		

		echo $stream;
		
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
	
		indent('o lgn: your login as chosen on the account backoffice/accesses/', 6);
		indent('o pwd: your password as chosen on the account backoffice/accesses/', 6);
				
	
	h2('Returned objects');

	
	explainclass($dS_login, $fieldsL, '|');
	explainclass($akeys->getFirst(), $fieldsK, '|');
	explainclass($accounts->getFirst(), $fieldsA, '|');
	
	
	h2('Feedback payload');
	payload();
	
pad();



endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>