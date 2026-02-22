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



	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); notice('The following blueprint is the server payload response when not in web mode.');

echo '<data>'; // enclose the file content within the stream
span('&ltdata&gt');
	
	$stream = '';
	

		//    A C C O U N T
			$fieldsA = Array('id','name','GMT','language','visitorAlias','timeSlice','phoneRegion','phoneSlicing','defaultGender','bCalsName','uCalsName','fCalsName','email');
		$stream .= '#C_dS_account'.$nl.$context->dS_account->stream(false, '|', $fieldsA).$nl;
		

		//    R E S O U R C E S 
			$fieldsR = Array('id','resourceType','name','signature','note','remoteId');
		$stream .= $context->resources->stream(false, false, false, '|', $fieldsR);
		

		//    C U S T O M    C S S
			$fieldsC = Array('id','resaClass','cssType','name','css','note','remoteId');
		$stream .= $context->customCsss->stream(false, false, false, '|', $fieldsC);
		

		//    T I M E    B O X I N G
			$fieldsT = Array('id','name','color','pattern','exclusive','note');
		$stream .= $context->timeboxings->stream(false, false, false, '|', $fieldsT);
		
	
		//    E X P E R T S    F O R    W O R K   C O D E S 
			$fieldsE = Array('groupId','resourceId');
		$stream.= $context->workexperts->stream(false, false, false, '|', $fieldsE);
		
	
		//    T I M E   B O X I N G     F O R    W O R K   C O D E S 
			$fieldsX = Array('groupId','timeboxingId');
		$stream.= $context->worktboxings->stream(false, false, false, '|', $fieldsX);
		
		
		//    W O R K     C O D E S  (keep this after experts streaming)
			$fieldsW = Array('id','name','note','duration','staffing','cssColor','cssPattern','ereservable');
		$stream.= $context->workcodes->stream(false, false, false, '|', $fieldsW);
		
		
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

	explainclass($context->dS_account, $fieldsA, '|');
	explainclass($context->resources, $fieldsR, '|');
	explainclass($context->customCsss, $fieldsC, '|');
	explainclass($context->timeboxings, $fieldsT, '|');
	explainclass($context->workexperts, $fieldsE, '|');
	explainclass($context->worktboxings, $fieldsX, '|');
	explainclass($context->workcodes, $fieldsW, '|');
	
	
	h2('Feedback payload');
	payload();
	
pad();



endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>