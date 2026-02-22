<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P     A P I   /   P O S T     R E S A	B I L L A M O U N T
//
//              
//

ob_start(); // relates to (*cc)
require '../smapplib202307.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$aid = $context->dS_account->id;
$lid = $context->dS_login->id;
//$cid = $context->request_cid($mandatory = true);

$perfReport->peak('::context setup');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		//indent('o cid: '.$cid.'',6);

		$resaid = false; $resaid = @$_REQUEST['id'];	
		if(!isset($resaid)) { $resaid = false; }
		if(!$resaid) abort('3400','gate::missing mandatory field id');
		indent('o resa id: '.$resaid.'',6);
	
		$billamount = false; $billamount = @$_REQUEST['billamount'];	
		if(!isset($billamount)) abort('3401','gate::missing mandatory field billamount');
		indent('o billamount: '.$billamount.'',6);
	
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);

		$dS_resa = new C_dS_reservation($resaid);
		if (!$dS_resa->id) abort('3402','gate::resa not found');

		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// update billamount
//
	$dS_resa->billamount = $billamount;
	$dS_resa->save(); // saves without changing the tracking fields


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//



	h2('Query complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
	
	span('&lt/data&gt');
	echo '</data>';
	


//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o id: resa id',6);
		indent('o billamount: billamount',6);
		

	//pad(0); h2('Returned objects &ltdata&gt');


}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 



$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


?>