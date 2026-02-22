<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T   A P P   A P I   /   Q U E R Y    H U M A N    L O G I N    K E Y S
//
//
//    NO KEY ID REQUIRED FOR THIS API
//

define('closeconn',false); // this script is followed by other calls, let's KEEP_ALIVE

if(closeconn) ob_start(); // relates to (*cc)
require '../smapplib202501.php';


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
	
	C_dbIO::logged($dS_login,'(Smartapp)'); // sign any change in DB
	

$perfReport->peak('::time needed to log in');


			// introduced with notifications
		$fcm 		= @$_REQUEST['fcm']; if(!isset($fcm)) $fcm = '';			// fcm token (for firebase notifications) (varchar 32), is empty if the device doesn't accept notifications
		$appver 	= @$_REQUEST['appver']; if(!isset($appver)) $appver = ''; 	// SW version (varchar 16)
		$deviceid 	= @$_REQUEST['devid']; if(!isset($deviceid)) $deviceid = '';// device id (unique identifier for the client device) (varchar 64)
		$ua			= @$_REQUEST['ua']; if(!isset($ua)) $ua = '';				// user agent ( OS + OS Version ) (varchar 64)


	$akeys = new C_dbAccess_accesskey($dS_login->id);
$perfReport->peak('::access keys loaded');

	$accounts = new C_dbAccess_groups();
	$accounts->loadonkeys($akeys);
	
$perfReport->peak('::accounts loaded');



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');

	
	$stream = '';
	
		//    L O G I N
				$fieldsL = C_api::fieldslist('C_dS_login');
		$stream .= '#C_dS_login'.$nl.$dS_login->stream(no_tracking, '|', $fieldsL).$nl;
	
	
		//    A C C E S S    K E Y S
			$fieldsK = Array('id','groupId','accountId','bCals','uCals','fCals');
		$stream .= $akeys->stream(no_alias, no_bank, no_tracking, '|', $fieldsK);


		//    A C C O U N T S - accounts that are accessible to the logged in login
			$fieldsA = Array('id','name','color','pattern','tag','usechat');
		$stream .= $accounts->stream(no_alias, no_bank, no_tracking, '|', $fieldsA);	


echo '<data>'; // enclose the datasets content within the stream
span('&ltdata&gt');

		// D R O P     S T R E A M
		echo $stream;
		
span('&lt/data&gt');
echo '</data>';



//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


if($web) {
	
	pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		indent('o lgn: your login as chosen on the account backoffice/accesses/', 6);
		indent('o pwd: your password as chosen on the account backoffice/accesses/', 6);
	
	pad(0);
		indent('o fcm: fcm token (for firebase notifications) (varchar 32), is empty if the device doesn\'t accept notifications', 6);
		indent('o appver: mobminder smartapp version on the client device', 6);
		indent('o devid: device id (unique identifier for the client device) (varchar 64)', 6);
		indent('o ua: user agent ( OS + OS Version ) (varchar 64)', 6);
						
	
	h2('Returned objects');

	
	explainclass($dS_login, $fieldsL, '|');
	explainclass($akeys->getFirst(), $fieldsK, '|');
	explainclass($accounts->getFirst(), $fieldsA, '|');
	
	
	h2('Feedback payload');
	payload();
	
	pad();
}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

$perfReport->peak('::protocol streamed');
$perfReport->dropReport(); // no perf report for production

endrendermode();
if(closeconn) closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE



//////////////////////////////////////////////////////////////////////////////////////////
//
//   C O N N E C T I O N    C L O S E D

//TMP BSP  bug florian/cindy
//if ($dS_login->id==9085)
//if ($dS_login->id==23498)
//{
//	C_dS_exception::put('smart/query/keys.php', 'erreur debug','$deviceid='.$deviceid.', $dS_login->id='.$dS_login->id.', $fcm='.$fcm.', $appver='.$appver.', $ua='.$ua);
//}


if($deviceid) { // $deviceid is empty if the version of the smart app is anterior to the notification version release
	C_dS_device::refreshdevice($deviceid, $dS_login->id, $fcm, $appver, $ua);
}


	



	
	
	
	
	
	
	
	
	
	
	
	




?>