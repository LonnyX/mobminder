<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M A R T    A P P     A P I   /   G E T     P A Y M E N T
//
//              
//	03/10/2023 : new version of API, returning several payments at once

//ob_start(); // relates to (*cc)
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

		//$paymentid = false; $paymentid = @$_REQUEST['id'];	
		//if(!isset($paymentid)) abort('3400','gate::missing mandatory field id');
		//indent('o payment id: '.$paymentid.'',6);

		$ids = @$_REQUEST['ids']; if(!isset($ids)) abort('3400','gate::missing mandatory field ids'); else $pids = explode('!',$ids);  // be able to treat inputs like 00001!00002!00087
		$digits = str_replace('!','',$ids); if(!is_numeric($digits)) abort('3400','gate::invalid field ids');
		$select = str_replace('!',',',$ids);
		indent('o payment ids: '.$select.'',6);
	
	h3('Screening disallowed characters in fields');
	
		if($allok = fieldscleaner($_REQUEST)) indent('all fields are made from allowed chars',6);
			else indent('some characters have been removed',6);



		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// get payment
//
	//$dS_payment = new C_dS_payment($paymentid,false);
	/*if($dS_payment->id<=0) // if new payment => generate qrcode
	{
        abort('3400','gate::payment not found for id '.$paymentid);
	}*/
	$payments = new C_dbAccess_payments();
	$payments->loadOnId($select);


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
	//echo '#C_dS_payment'.$nl.$dS_payment->stream(with_tracking).$nl;
	//echo '#C_dS_payment'.$nl.$dS_payment->stream(with_tracking, '|');
	//$bank = 'plitems';
	echo $payments->stream(no_alias,false, with_tracking);

	span('&lt/data&gt');
	echo '</data>';

	echo $nl;
	echo '<pars>'; // enclose the file content within the stream
	span('&ltpars&gt');
	echo 'pollinglag=1'.$nl; 								// rythm for calling this script
	span('&lt/pars&gt');
	echo '</pars>';
	


//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o id: payment id',6);
		indent('o transtatus: transtatus',6);

		h3('optional posts');
		indent('o groupId: groupId',6);
		indent('o paymean: paymean',6);
		indent('o transnote: transnote',6);
		indent('o amount: amount',6);
		

	//pad(0); h2('Returned objects &ltdata&gt');


}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 



$perfReport->peak('::completed');
$perfReport->dropReport();


endrendermode();
//no neeod of closeconnection because pooling calls it every second
//closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


?>