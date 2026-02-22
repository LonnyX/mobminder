<?php
//////////////////////////////////////////////////////////////////////
//
//       Moby  A I   A P I    /     D E L E T E     D E V I C E    R E G I S T R A T I O N
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

		$login 	= $_REQUEST['lgn'];
		$pass 	= $_REQUEST['pwd'];		

		
	$dS_login = C_dS_login::logon($login, $pass);
	if(!$dS_login) abort('0006','Wrong login/pass combination');
	
	C_dbIO::logged($dS_login,'(Smartapp)'); // sign any change in DB
	

$perfReport->peak('::time needed to log in');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
		
		$devid 	= $_REQUEST['devid']; if(!isset($devid)) $devid = false;
		indent('o devid: '.$devid,6);
		


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    EXECUTE DELETE
//

	C_dS_device::removedevice($devid);


$perfReport->peak('::time needed to delete');




//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o devid: chat thread unique id',6);

}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 


$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>