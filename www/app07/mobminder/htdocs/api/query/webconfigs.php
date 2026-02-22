<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Q U E R Y    C O N F I G U R A T I O N
//

ob_start(); // relates to (*cc)
require '../apilib.php'; // keep ahead of includes, see (*rq01*)

//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/query/config.php?lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
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
$context = new C_apicontext();

$perfReport->peak('::time needed to retrieve context and posted parameters');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Fetching data from DB
//

$q = new Q('select logins.id as id from accesskeys join logins on accesskeys.groupId = logins.id where accountId = '.$context->accountid.' and deletorId = 0 and accessLevel = 4;', 'api/query/webconfigs');
	
	$wlids = $q->ids();
	$akeys = new C_dbAccess_accesskey(); $akeys->loadOnGroup($wlids, true /*do group option, creates the ->grouped member that summarises all elements by their groupId */);
	$wlogins = new C_dbAccess_logins($wlids);

	// note: accesskeys for web logins have a one to one relationship, a web login never uses multiple keys (so far in 2018)
	
	foreach($wlogins->keyed as $wlid => $dS_wlogin) {
		$dS_akey = reset($akeys->grouped[$wlid]); // reset returns the value of the first element in the ->grouped array. 
		$dS_wlogin->bCals = $dS_akey->bCals;
		$dS_wlogin->uCals = $dS_akey->uCals;
		$dS_wlogin->fCals = $dS_akey->fCals;
	}
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');
	
	$stream = '';


		//    W E B     L O G I N S  
			$fieldsL = Array('id','accessLevel','GMT','company','gender','firstname','lastname','address','zipCode','city','country','email','mobile','phone','language','profession','note','eresaTitle','eresaUrl','eresaMax','eresaLimit','eresaBefore','eresaWithAMPM','eresaSameday','eresaAllowNote','eresaSignin','eresaCancel','eresaAggregate','eresaRescType','eresaWorkcodes','eresaAuthent','eresaBlacklist');
		$stream .= $wlogins->stream(no_alias, no_bank, no_tracking, $sep = '|', $fieldsL);


		//    A C C E S S    K E Y S 
			$fieldsA = Array('groupId','accountId','bCals','uCals','fCals');
		$stream .= $akeys->stream(no_alias, no_bank, no_tracking, $sep = '|', $fieldsA);


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
	
		exlainloginputs(); 
				
	
	h2('Returned objects');
	
	
	explainclass($wlogins, $fieldsL, '|');
	
	
	h3('Additional information about notBefore bitfield encoding');
		indent('Settings of the not before control, in the web page setup modal window, are encoded in a 4 bytes bit field. Bit values are like follows:',6);
		indent('o Byte 1/4, 0x00 00 00 01:tomorrow, 0x 02:next week (next monday), 0x 04::one week from now (today plus 7 days), 0x 08::two weeks from now, 0x 10::three weeks, 0x 40::five weeks, 0x 80::six weeks',6);
		indent('o Byte 2/4, 0x00 00 01 00: next month, 0x 02 00: one month, 0x 04 00: two months, 0x 08 00: three months, 0x 10 00: four months, 0x 20 00: five months, 0x 80 00: six months from today',6);
		indent('o Byte 3/4, 0x00 02 00 00: eight months, 0x 04 0000: nine months, 0x 10 0000: after tomorrow, 0x 20 0000: three days from today, 0x 80 0000: one year from today',6);
		indent('o Byte 4/4, 0x08 00 00 00: search from curent time on',6);
	pad();	
	
			
	explainclass($akeys, $fieldsA, '|');
	
	
	h2('Feedback payload');
	payload();
	
pad();



endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>