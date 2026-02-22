<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M O B   A P P    A P I   /   Q U E R Y    E R R O R     L O G   D E T A I L
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
$viewer = new C_shortlogin($xpected_alevel, $loadcontext = true, $perfReport);


	if(!isset($_REQUEST['lgid'])) abort('0003','You must specify a login'); else $logid = $_REQUEST['lgid'];
	$dS_exception = new C_dS_exception_smartapp($logid);
	

pad(); h2('Logger information');
	
	if($dS_exception->id==0) {
		abort('9001','This exception log card was not found in DB');
	} else {
		$kid = $_REQUEST['kid'] = $dS_exception->groupId; 
		$dS_accesskey = new C_dS_accesskey($kid);
		if($dS_accesskey->id==0) {
			abort('9002','The provided key is not valid');
		} else {
				$lid = $dS_accesskey->groupId;
			$C_dS_login = new C_dS_login($lid);
			$_REQUEST['lgn'] = $C_dS_login->login;
			$_REQUEST['pwd'] = $C_dS_login->password;
		}
	}
	

	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$loggercontext = new C_apicontext($xpected_alevel, $loadcontext = false, $perfReport);


// Catching current url parameters and login pass
//
$par = $viewer->geturiaccessparms(); // uri formatted login/pass parameters
$ld = '"'.$http.$host.$uri_1.'/dashboard/logs.php'.'?'.$par.'&web=1"'; // is the main statement to access _logdetail.php, add a logid to this and you are fully ready to call _logdetail.php


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
function td($caption, $css='',$te='td') { return '<'.$te.' class="'.$css.'">'.$caption.'</'.$te.'>'; }
$jsrowinteractive = 'onclick="onlog(this.id)"'; // (*al01*)


pad(); h2('Log details');

					$c = 0; $tds = [];
				$tds[] = td('user agent','','th'); $c++;
				$tds[] = td('mob version','','th'); $c++;
				$tds[] = td('keyId','','th'); $c++;
				$tds[] = td('rscid','','th'); $c++;
				$tds[] = td('critic','','th'); $c++;
				$tds[] = td('class','','th'); $c++;
				$tds[] = td('function','','th'); $c++;
				
			$thr = '<tr>'.implode('',$tds).'</tr>';
			$tcols = '<colgroup>'.str_repeat('<col>',$c).'</colgroup>';
		$thead = $thr.$tcols;
		
					$rc = 0; $tds = [];
				$tds[] = td($dS_exception->ua); $rc++;
				$tds[] = td($dS_exception->version); $rc++;
				$tds[] = td($dS_exception->groupId); $rc++; // is the keyId
				$tds[] = td($dS_exception->rscid); $rc++;
				$tds[] = td($dS_exception->criticity,$dS_exception->criticity); $rc++;
				$tds[] = td($dS_exception->class); $rc++;
				$tds[] = td($dS_exception->function); $rc++;
				
			$metarow = '<tr class="'.$dS_exception->criticity.'" '.$jsrowinteractive.' id="'.$dS_exception->id.'">'.implode('',$tds).'</td></tr>';
			$errmsg = '<tr class="'.$dS_exception->criticity.'"><td class="idle" colspan='.$rc.'>'.htmlize($dS_exception->msg).'</td></td></tr>';
		$rows = $metarow.$errmsg;

		$tbody = '<tbody>'.$rows.'</tbody>';
		
	echo '<h4>log id '.$dS_exception->id.' on '.$dS_exception->created.'</h4>';	
	echo '<table style="width:100%;">'.$thead.$tbody.'</table>';
	
	$js = 'onlog = function(eid) { 
				console.log(eid); 
				var href = '.$ld.'; // will lead back to previous page
				window.location.href=href;
			}';
	dropjs($js);	




pad(); h2('Account access');

	function logontr($dS_accesskey, $dS_login = false) {
		
		if($dS_login===false) {
			$dS_login = new C_dS_login($dS_accesskey->groupId);
		}
		switch($dS_login->accessLevel) {
			case aLevel_admin: $alevel = 'admin'; break;
			case aLevel_seller: $alevel = 'seller'; break;
			case aLevel_manager: $alevel = 'manager'; break;
			case aLevel_supervisor: $alevel = 'supervisor'; break;
			case aLevel_operator: $alevel = 'operator'; break;
			default: $alevel = 'unexpected (eresa/sync/...)'; break;
		}
			$tdaLevel = '<td>Log on as '.$alevel.'</td>';
				$company = ''; if($dS_login->company) $company = ' ('.$dS_login->company.')';
			$tdname = '<td>'.$dS_login->firstname.' '.$dS_login->lastname.$company.'</td>';
		$jsrowinteractive = 'onclick="onlink(this.id)"';
		$eid = $dS_accesskey->accountId.'_'.$dS_login->id.'_'.$dS_accesskey->id;
		$metarow = '<tr class="" '.$jsrowinteractive.' id="'.$eid.'">'.$tdaLevel.$tdname.'</tr>';
		return $metarow;
	}

		$thr = '<tr>'.'<th>login level</th>'.'<th>user name</th>'.'</tr>';
		$tcols = '<colgroup><col><col></colgroup>';
		$rows = Array();
		
		// insert logger access to the concerned account
		$rows[] = logontr($loggercontext->dS_accesskey, $loggercontext->dS_login);
		
		
		// insert sellers/admins access to the concerned account
			$r = 'select accesskeys.id from accesskeys join logins on logins.id = accesskeys.groupId where accountId = '.$loggercontext->accountid.' and accessLevel >= '.aLevel_seller.';';
		$q = new Q($r);
		$kids = $q->ids(list_as_array);
		if(count($kids)) // which is always the case unless we have an orphan account
			foreach($kids as $kid) {
				if($kid==$loggercontext->dS_accesskey->id) continue; // this one is already in the list
				$dS_accesskey = new C_dS_accesskey($kid);
				$rows[] = logontr($dS_accesskey);
			}
		$thead = '<thead>'.$thr.$tcols.'</thead>';
		$tbody = '<tbody>'.implode('',$rows).'</tbody>';
	$table = '<table style="max-width:100%;">'.$thead.$tbody.'</table>';
	echo $table;			
		
		
	
	$js = 'onlink = function(eid) { 
				console.log(eid); 
				var args = eid.split("_");
				var aid = args[0];
				var lid = args[1];
				var kid = args[2];
				var href = "http://login.mobminder.com/"+aid+"/"+lid+"/"+kid+"";
				window.open(href,"_blank");
			}';
	dropjs($js);
		



//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 


pad(8);
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