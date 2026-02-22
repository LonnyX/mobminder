<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M O B   A P P    A P I    /    Q U E R Y    E R R O R     L O G S 
//

ob_start(); // relates to (*cc)
require '../smapplib.php';


//
// You need to create a login in the Mobminder setup. 
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

	$xpected_alevel = [aLevel_seller,aLevel_admin];
$context = new C_shortlogin($xpected_alevel, $loadcontext = true, $perfReport);


// Catching current url parameters and login pass
//
$par = $context->geturiaccessparms(); // uri formatted login/pass parameters
$ld = '"'.$http.$host.$uri_1.'/dashboard/logdetail.php'.'?'.$par.'&web=1"'; // is the main statement to access _logdetail.php, add a logid to this and you are fully ready to call _logdetail.php

echo $ld; 

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
function td($caption, $css='',$te='td') { return '<'.$te.' class="'.$css.'">'.$caption.'</'.$te.'>'; }
$jsrowinteractive = 'onclick="onlog(this.id)"'; // (*al01*)

pad(); h2('Reading logs');

	$dates = C_dbAccess_exceptions_smartapp::loaddates();
	if(count($dates)) {
		
					$c = 0;
				$id = td('id','','th'); $c++;
				$kid = td('keyId','','th'); $c++;
				$rsc = td('rscid','','th'); $c++;
				$crt = td('created','','th'); $c++;
				$cor = td('creator','','th'); $c++;
				$cri = td('critic','','th'); $c++;
				$cls = td('class','','th'); $c++;
				$fct = td('function','','th'); $c++;
				$msg = td('message','msg','th'); $c++;
				
			$thr = '<tr>'.$id.$kid.$rsc.$crt.$cor.$cri.$cls.$fct.$msg.'</tr>';
			$tcols = '<colgroup>'.str_repeat('<col>',$c).'</colgroup>';
		$thead = '<thead>'.$thr.$tcols.'</thead>';
		
		foreach($dates as $d) {
		
			pad(0); h3('Report date: '.$d);

			$tr = Array();
			$excps = new C_dbAccess_exceptions_smartapp($d);
			if($excps->count()) {
				foreach($excps->keyed as $eid => $dS_ex) {
						$id = td($dS_ex->id);
						$kid = td($dS_ex->groupId);
						$rsc = td($dS_ex->rscid);
						//$crt = td(substr($dS_ex->created,-8));
						$crt = td($dS_ex->created,'tdnowrap');
						$cor = td($dS_ex->creator);
						$cri = td($dS_ex->criticity,$dS_ex->criticity);
						$cls = td($dS_ex->class);
						$fct = td($dS_ex->function);
						$msg = '<td class="hideoverflow"><div>'.substr($dS_ex->msg,0,512).'</div></td>';
					$row = '<tr class="'.$dS_ex->criticity.'" '.$jsrowinteractive.' id="'.$dS_ex->id.'">'.$id.$kid.$rsc.$crt.$cor.$cri.$cls.$fct.$msg.'</td></tr>';
					$tr[] = htmlize($row);	
				}
			}
			$tbody = '<tbody>'.implode(chr(10),$tr).'</tbody>';
			echo '<table style="width:100%;">'.$thead.$tbody.'</table>';
		}
		$js = 'onlog = function(eid) { 
					console.log(eid); 
					let href = '.$ld.'+"&lgid="+eid; // eid is the log id, see (*al01*)
					console.log("jumping to "+href);
					window.location.href=href;
				}';
		dropjs($js);
	} else {
		h3('The exceptions logs is empty');
	}
	



//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		indent('o lgn: your login as chosen on the account backoffice/accesses/', 6);
		indent('o pwd: your password as chosen on the account backoffice/accesses/', 6);
				
	
	pad();
	
pad();



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

$perfReport->peak('::protocol streamed');

$perfReport->dropReport(); // no perf report for production



endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>