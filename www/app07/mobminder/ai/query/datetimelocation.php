<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    A C C O U N T    C O N F I G U R A T I O N
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext = false, $perfReport);
$who = $context->dS_login->firstname; // who is talking to AI

$perfReport->peak('::loaded context and posted parameters');


	$logins = $context->gethumanloginsmin();

$perfReport->peak('::human logins loaded');


	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   L O A D    D A T A   

	if($web) {
		h2('Query complete');
		notice('The following blueprint is the server payload response when not in web mode.');
	}

	$stream = '';
		$d = new C_date();
		
		$incdays = @$_REQUEST['incdays']; 	if(!isset($incdays)) $incdays = 0; 		else { if(!is_numeric($incdays)) abort('9500','You must specify an integer value for incdays'); }
		$inchours = @$_REQUEST['inchours']; if(!isset($inchours)) $inchours = 0; 	else { if(!is_numeric($inchours)) abort('9500','You must specify an integer value for inchours'); }
		$incweeks = @$_REQUEST['incweeks']; if(!isset($incweeks)) $incweeks = 0; 	else { if(!is_numeric($incweeks)) abort('9500','You must specify an integer value for incweeks'); }
		
		if($incdays) $d->dIncrement($incdays);
		if($inchours) $d->hIncrement($inchours);
		if($incweeks) $d->wIncrement($incweeks);
		
		$t = $d->datetimelocation(); // C_date::setTimeParameters($dS_account) was called in the C_apicontext() constructor, so the result is correct ito timezone
	
	$stream = $t;
	wo_pad();
		$now = new C_date();
		$isbefore = $d->isBefore($now); // only if $d is really past (not present)
		$isfuture = $d->isAhead($now); // present zero is considered future here
		$istoday = $d->isSameDay($now); // present zero is considered future here



//////////////////////////////////////////////////////////////////////////////////////////
//
//   S P E C I F I C A T I O N S 

	
	wo_pad();
	// technicalspecH1();
	
	if($web) {
		h2('Input parameters');
		exlainloginputs();
	}
	

//////////////////////////////////////////////////////////////////////////////////////////
//
//   D A T A    S T R E A M I N G

	
	htmlvisibletag('info');
	if($incdays||$inchours||$incweeks) {
		$agoahead = Array(-1 => 'ago', 0 =>'now', 1 => 'ahead');
		$was = 'will be'; if($isbefore) $was = 'was';
		
		if($incweeks) $incweeks = ' '.(($incweeks>=0)?$incweeks:-$incweeks).' week'.($incweeks*$incweeks>1?'s':'').' '.$agoahead[(($incweeks>0)?1:(($incweeks < 0)?-1 :0))];
			else $incweeks = '';
		if($incdays) $incdays = ' '.(($incdays>=0)?$incdays:-$incdays).' day'.($incdays*$incdays>1?'s':'').' '.$agoahead[(($incdays>0)?1:(($incdays < 0)?-1 :0))];
			else $incdays = '';
		if($inchours) $inchours = ' '.(($inchours>=0)?$inchours:-$inchours).' hour'.($inchours*$inchours>1?'s':'').' '.$agoahead[(($inchours>0)?1:(($inchours < 0)?-1 :0))];
			else $inchours = '';
		
		
		echo 'This is the date and time that '.$was.' at '.$who.'\'s place'.$incweeks.$incdays.$inchours.($isbefore?'':' from now').'.'.$nl;
		if($istoday) echo 'The date refers to today.'.$nl;
		echo 'Here are possible usages:'.$nl;
		echo '- It can simply be reported to the user, on request.'.$nl;
		echo '- It can be used as date input for our get_planning tool (so only YYYY-MM-DD), specifying what day to read the planning from.'.$nl;
		echo '- It can be cueIn in a call to tool save_reservation so to specify date and time for saving a brand new C_dS_resevation (with id=0).'.$nl;
		echo '- It can be dateIn (so only YYYY-MM-DD) in a call to tool register_off_days.'.$nl;
		if($isfuture) echo '- It can be used as date (so only YYYY-MM-DD) for a query on search_availabilities tool.'.$nl;
		
	} else {
		echo 'This the time now at '.$who.'\'s place.'.$nl;
	}
	htmlvisibletag('/info');
	
	
	htmlvisibletag('data');		
	
		// D R O P     S T R E A M
		echo $stream.$nl;
		
	htmlvisibletag('/data');




//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	wo_pad();
}
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>