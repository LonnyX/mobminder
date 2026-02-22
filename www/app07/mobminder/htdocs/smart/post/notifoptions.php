<?php
//////////////////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php 
//
//    S M A R T    A P P     A P I    /    P O S T    N O T I F I C A T I O N S    O P T I O N S 
//
//    NOT USED : WE DECIDED TO REUSE THE templates_sms APPROACH - SETTING FROM SMARTDEVICE FOR LATER DEV !!
//

ob_start(); // relates to (*cc)
require '../smapplib.php';



//////////////////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php 
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$accountid = $context->dS_account->id;
$loginid = $context->dS_login->id;
$keyid = $context->dS_accesskey->id;



$perfReport->peak('::context setup');

$device_types = Array(/*0 => 'computer device',*/1 => 'smartphone device',2 => 'tablet device'); // see (*dt01*), computers should post from Web App
$display_modes = Array(0 => 'vertical display',1 => 'horizontal display',2 => 'text display'); // see (*pv01*)
$resource_types = Array(2 => 'bCals (business calendar)',1 => 'uCals (staffable resource)',4 => 'fCals (facultative resource)'); // see (*rt01*)



//////////////////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php 
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		$devtype = @$_REQUEST['dev'];
		if(!isset($devtype)) abort('1200','gate::missing mandatory field');
		if(!is_numeric($devtype)) abort('1201','gate::bad format for dev');
		if(!array_key_exists($devtype,$device_types)) abort('1202','gate::bad range for dev');
		indent('o dev: '.$devtype.' ('.$device_types[$devtype].')',6);
	
		$dmode = @$_REQUEST['mode'];
		if(!isset($dmode)) abort('1210','gate::missing mandatory field');
		if(!is_numeric($dmode)) abort('1211','gate::bad format for mode');
		if(!array_key_exists($dmode,$display_modes)) abort('1212','gate::bad range for mode');
		indent('o mode: '.$dmode.' ('.$display_modes[$dmode].')',6);
	
		$rtype = @$_REQUEST['rtype'];
		if(!isset($rtype)) abort('1220','gate::missing mandatory field');
		if(!is_numeric($rtype)) abort('1221','gate::bad format for mode');
		if(!array_key_exists($rtype,$resource_types)) abort('1222','gate::bad range for mode');
		indent('o resource: '.$rtype.' ('.$resource_types[$rtype].')',6);
	
		pad(0);
		$bits = @$_REQUEST['bits'];
		if(!isset($bits)) abort('1230','gate::missing mandatory field');
		if(!is_numeric($bits)) abort('1231','gate::bad format for bits');
		if($bits<0) abort('1232','gate::bad range for bits');
			$bitfield = '0000 0000 0000 0000';
		indent('o bits: d '.$bits.' ( b'.bitfield_display($bits).')',6);
	
		pad(0);
		indent('enabled: ',9);
		if($bits&1<<0)	indent('schedule 		: 1<<0,',12);
		if($bits&1<<1)	indent('resanote 		: 1<<1,',12);
		if($bits&1<<2)	indent('attendance 		: 1<<2,',12);
		if($bits&1<<3) 	indent('visitor 		: 1<<3,',12);
		if($bits&1<<4) 	indent('registration	: 1<<4,',12);
		if($bits&1<<5) 	indent('mobile 			: 1<<5,',12);
		if($bits&1<<6) 	indent('visitorNote 	: 1<<6,',12);
		if($bits&1<<7) 	indent('workcodes 		: 1<<7,',12);
		if($bits&1<<8) 	indent('duration 		: 1<<8,',12);
		if($bits&1<<9) 	indent('color 			: 1<<9,',12);
		if($bits&1<<10) indent('extraspace		: 1<<10,',12);
		if($bits&1<<11) indent('smsstatus 		: 1<<11,',12);
		if($bits&1<<13) indent('hideoffdays		: 1<<13,',12);
		if($bits&1<<14) indent('hidesection		: 1<<14,',12);
		if($bits&1<<15) indent('birthdate		: 1<<15,',12);
		if($bits&1<<16) indent('address			: 1<<16,',12);
		if($bits&1<<17) indent('timeboxing		: 1<<17,',12);
		if($bits&1<<18) indent('fixline			: 1<<18,',12);
		if($bits&1<<19) indent('zipcode			: 1<<19,',12);
		if($bits&1<<20) indent('reference		: 1<<20,',12);
		if($bits&1<<21) indent('language		: 1<<21,',12);
		if($bits&1<<22) indent('rtags			: 1<<22, reservations tags',12); 	//
		if($bits&1<<23)	indent('adaptative		: 1<<23, graphical display span extends to daily hourly limits, instead of the account specified display span',12); //
		if($bits&1<<24) indent('emptytboxes		: 1<<24, display empty timeboxes in the list view',12); //
		if($bits&1<<25) indent('vtags			: 1<<25, visitors tags',12); 				//
		if($bits&1<<26) indent('disbltips		: 1<<26, disable yellow tips display',12); 	//
		if($bits&1<<27) indent('hidesrchasst	: 1<<27, hides the search assistent',12); 	//

		pad(0);
		indent('disabled: ',9);
		if(!($bits&1<<0))	indent('schedule 		: 1<<0,',12);
		if(!($bits&1<<1))	indent('resanote 		: 1<<1,',12);
		if(!($bits&1<<2))	indent('attendance 		: 1<<2,',12);
		if(!($bits&1<<3))	indent('visitor 		: 1<<3,',12);
		if(!($bits&1<<4))	indent('registration	: 1<<4,',12);
		if(!($bits&1<<5))	indent('mobile 			: 1<<5,',12);
		if(!($bits&1<<6))	indent('visitorNote 	: 1<<6,',12);
		if(!($bits&1<<7))	indent('workcodes 		: 1<<7,',12);
		if(!($bits&1<<8))	indent('duration 		: 1<<8,',12);
		if(!($bits&1<<9))	indent('color 			: 1<<9,',12);
		if(!($bits&1<<10))	indent('extraspace		: 1<<10,',12);
		if(!($bits&1<<11)) 	indent('smsstatus 		: 1<<11,',12);
		if(!($bits&1<<13))	indent('hideoffdays		: 1<<13,',12);
		if(!($bits&1<<14)) 	indent('hidesection		: 1<<14,',12);
		if(!($bits&1<<15)) 	indent('birthdate		: 1<<15,',12);
		if(!($bits&1<<16)) 	indent('address			: 1<<16,',12);
		if(!($bits&1<<17)) 	indent('timeboxing		: 1<<17,',12);
		if(!($bits&1<<18)) 	indent('fixline			: 1<<18,',12);
		if(!($bits&1<<19)) 	indent('zipcode			: 1<<19,',12);
		if(!($bits&1<<20)) 	indent('reference		: 1<<20,',12);
		if(!($bits&1<<21)) 	indent('language		: 1<<21,',12);
		if(!($bits&1<<22)) 	indent('rtags			: 1<<22, reservations tags',12); 	//
		if(!($bits&1<<23))	indent('adaptative		: 1<<23, graphical display span extends to daily hourly limits, instead of the account specified display span',12); //
		if(!($bits&1<<24)) 	indent('emptytboxes		: 1<<24, display empty timeboxes in the list view',12); //
		if(!($bits&1<<25)) 	indent('vtags			: 1<<25, visitors tags',12); 				//
		if(!($bits&1<<26)) 	indent('disbltips		: 1<<26, disable yellow tips display',12); 	//
		if(!($bits&1<<27)) 	indent('hidesrchasst	: 1<<27, hides the search assistent',12); 	//
		
//////////////////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php 
//
//   S T O R I N G    D A T A 
//

	// start with a neat clean-up. If not existing, this query has no hit.
	new Q('delete from details where groupId = '.$keyid.' and resourceType = '.$rtype.' and deviceType = '.$devtype.' and displayMode = '.$dmode.';');


	// complete with saving new parameters
	//
		$dS_details = new C_dS_details(0, $keyid);
		$dS_details->deviceType = $devtype;		
		$dS_details->displayMode = $dmode;
		$dS_details->resourceType = $rtype;
		$dS_details->details = $bits;
	$dS_details->dSsave();




//////////////////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php 
//
//   D R O P    D A T A   T O    C L I E N T    S I D E
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//

	$fieldsD = Array('groupId','displayMode','resourceType','details','deviceType');


	h2('Post complete'); 
	notice('The following blueprint is the server payload response when not in web mode.');
	pad(0);
	
	echo '<data>'; // enclose the file content within the stream
	span('&ltdata&gt');
	
echo '#C_dS_details'.$nl.$dS_details->stream(no_tracking, '|', $fieldsD).$nl;

	span('&lt/data&gt');
	echo '</data>';
	
	
	

////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php
//
//   P E R F    R E P O R T 

$perfReport->peak('::completed');
$perfReport->dropReport();




////////////////////////////////////////////////////////////////////////////////////////// smapp / post / notifoptions.php
//
//   T U T O R I A L 


pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
				
	
	h2('Returned objects');
	
		h3('User settings'); pad();
			explainclass($dS_details, $fieldsD, '|');
			indent('<b>details bitfield description: see query/config - C_dS_details section.</b>',6); pad(0);
	


pad();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE	
?>