<?php
require './../lib_mobphp/chtml.php';
require './../lib_mobphp/dbio.php';
require './../lib_mobphp/language_basics.php';
require './../lib_mobphp/geocheck.php';

// ini_set('session.cookie_samesite', 'None'); 

session_start();

setCrossSiteCookie($eresa = false);

// session_set_cookie_params(3600*20, '/;SameSite=None', $_SERVER['HTTP_HOST'], true); // only from PHP 7.3



$html = new C_html();

$baseline = C_dS_system::baseline();
$html->pushLink('themes/default/favicon.ico', 'icon', 'image/ico');
$html->pushLink('themes/default/mob144c.png', 'apple-touch-icon-precomposed', 'image/ico');
$html->pageTitle('mobminder');

// META's
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushMeta('format-detection'		, 'date=no');

$html->pushMetaName('mobile-web-app-capable', 'yes'); // check this page: https://web.archive.org/web/20151103001838/http://www.luster.io/blog/9-29-14-mobile-web-checklist.html
$html->pushMetaName('apple-mobile-web-app-capable', 'yes');
$html->pushMetaName('apple-mobile-web-app-status-bar-style', 'translucent-black'); // does not always work... TBI
$html->pushMetaName('apple-mobile-web-app-title', 'Mobminder');
$html->pushMetaName('viewport', 'width=device-width,height=device-height,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0');
$html->pushMetaName('cleartype', 'on'); // turn cleartype on in IE-based browsers so that text in your mobile app looks nicer on the small screen
$html->pushMetaName('robots', 'noindex');

// css
$html->pushLink('themes/default/colors_2023.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/controls.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/planning.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/default/mobminder.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/fonts/faws.css?b='.$baseline, 'stylesheet', 'text/css');
$html->pushLink('themes/fonts/fonts.css?b='.$baseline, 'stylesheet', 'text/css');


// browser compatibility
if(isset($_SERVER['HTTP_USER_AGENT']))
	if(strpos($_SERVER['HTTP_USER_AGENT'], 'MSIE') !== FALSE) die($html->sorryForMSIE()->dropPage());


// framework // all these includes are originals from index.php (includes necessayr js for client side processing)
// $html->pushScriptInclude('text/javascript', 'jquery/jquery-3.2.1.js'); // may 2014, no support for IE 6, 7
// $html->pushScriptInclude('text/javascript', 'jquery/qrcodes/jquery-qrcode.js');
// $html->pushScriptInclude('text/javascript', 'jquery/qrcodes/mobqrcodelib.js');
// $html->pushScriptInclude('text/javascript', 'jquery/jquery.rightClick.js');

// generic api
// $html->pushScriptInclude('text/javascript', 'jscripts/iscroll.52.js?b='.$baseline);
// $html->pushScriptInclude('text/javascript', 'jscripts/mobframe.js?b='.$baseline);
// $html->pushScriptInclude('text/javascript', 'jscripts/language.js?b='.$baseline); // should be kept under mobframe.js because it uses the general mobminder. variable
// $html->pushScriptInclude('text/javascript', 'jscripts/datasets.js?b='.$baseline);
// $html->pushScriptInclude('text/javascript', 'jscripts/controls.js?b='.$baseline);
// $html->pushScriptInclude('text/javascript', 'jscripts/planning.js?b='.$baseline);
// $html->pushScriptInclude('text/javascript', 'jscripts/modals.js?b='.$baseline);

// attach the js that is specific to this page
// $html->pushScriptInclude('text/javascript', 'jscripts/mobminder.js?b='.$baseline);

	// check the API auto-login option. Usage: fr.mobminder.com/index.php?kid=9769&lid=8377&aid=2991
	$keyId = @$_GET['kid'];
	$loginId = @$_GET['lid'];
	$accountId = @$_GET['aid'];
	$calledid = @$_GET['calledid']; // phone number assigned to this account, by the call center

	if($keyId) if(!is_numeric($keyId)) { sleep(2); die('wrong key, please contact your administrator'); }// protection against SQL injection
	if($loginId) if(!is_numeric($loginId)) { sleep(2); die('wrong login id, please contact your administrator'); }
	
	if(isset($accountId)) if(!is_numeric($accountId)) { sleep(2); die('wrong account id, please contact your administrator'); }
	if(isset($calledid)) if(!is_numeric($calledid)) { sleep(2); die('wrong calledid, please contact your administrator'); }

	// if(!isset($calledid)&&!isset($accountId)) { sleep(2); die('calledid or accountId, please contact your administrator'); }

if($keyId && $loginId && $accountId) { // AUTO LOGIN: check the coherence of the 3 parameters
	

	
} else { 	// PAGE RELOAD: The user has already logged-in, $_SESSION['keyId'] exists, 
	
	$keyId = isset($_SESSION['keyId']) ? $_SESSION['keyId'] : 0; // reload case <= should reload the current account, thanks to the tab focus call tabfocus.php, see(*55*)
	
	if($keyId) {
		
		$q = new Q('SELECT count(1) FROM accesskeys WHERE id="'.$keyId.'";');
		if($q->cnt()!=1) { sleep(2); die('0!0!No access rights (4)'); }
		
		$dS_accesskey = new C_dS_accesskey($keyId);
		if($calledid) { // if you specify the call center assigned number iso aid / accountid, still we can connect to the right account using call center phone (ccphone)
			$q = new Q('SELECT id FROM groups WHERE ccphone="'.$calledid.'" limit 1;');
			if($aid = $q->ids()) $accountId = $aid;
			else $accountId = 0;
		}
		if($accountId) { 
		
			//    S W I T C H     T O     A N O T H E R     A C C O U N T   using &aid=digits OR &calledid=digits
			//
			// possible only when you are already logged with a valid key, 
			// and possible only for an account for which you have access granted
			
			$q = new Q('SELECT id, accountId FROM accesskeys WHERE groupId="'.$dS_accesskey->groupId.'" and accountId='.$accountId.';');
			
			if($q->cnt()!=1) { // trying to switch to an account that does not belong to the granted wallet
			
				$_SESSION['loginId'] = 0; // reset all connexions
				$_SESSION['keyId'] = 0; // needed, see (*55*)
				$_SESSION['loggedIn'] = '';
				header("Location: ./index.php"); // gracefull redirection to the login page
			}
			
			$keyId = $q->ids(); // which is only one key that relates to the accountId to which we switch to.
			
		} else {
			
			//    R E L O A D 
			//
			// start the client side based on currently logged key
			
			sleep(1);
		}
		$dS_login = new C_dS_login($dS_accesskey->groupId);
	}
}


if($keyId) { // check that this key has the minimum required access level		
	// solves the login on an e-resa page (link found via google) followed by a call on be.mobminder.com 
	// that would open the account related to the e-resa link! which is not allowable
	if($dS_login->accessLevel < aLevel_operator) $keyId = 0; 

} else {
	sleep(2); 
	// $keyId = 0, this is a fresh call to the index.php with no session opened. 
	die('No access rights.');
}


/////////////////////////////////////////////////////////////////////////////////////////////
//
	

		$vids = $_GET['vid']; $vids = explode('!',$vids); 
		foreach($vids as $x => $vid) if(!is_numeric($vid)) die('Not a better try...');
		$vidscoma = implode(',',$vids); // that has replaced ! with comas.
		$visitors = new C_dbAccess_visitors($vidscoma); // load candidates
	$dS_visitor = $visitors->getFirst(); // we consider the first one only (because I don't know what to do really if many vids arrive here...)
	$accountId = $dS_visitor->groupId; // visitors do group to their account id
	$dS_account = new C_dS_group($accountId);
	$resources = new C_dbAccess_resources($accountId);
	
	$sid = $_GET['sid']; if(!is_numeric($sid)) die('Bad try...');
	$dS_resa_serie = new C_dS_resa_serie($sid);
	$vid = $dS_visitor->id;
	$sname = $dS_resa_serie->stitle?'<span style="font-size:70%; padding-left:.6em;"> ('.$dS_resa_serie->stitle.')</span>':'';

	$wheresid = $sid?' and reservations.serieId = '.$sid:'';
	$sql = 'select reservations.id from reservations
		 join att_visitors on att_visitors.groupId = reservations.id
		 where reservations.groupId='.$accountId.'
			and att_visitors.resourceId='.$vid.'
			and reservations.deletorId=0
			and reservations.cueIn>'.time().$wheresid.'; -- print_appointments.php';
	
	$sqlX = new Q($sql);
	// $html->pushHTML( time().'<br/>' );
	// $html->pushHTML( $sql.'<br/>' );
	// $html->pushHTML( $sqlX->ids().'<br/>' );
	
	// $rids = $sql->ids();
	new L($dS_visitor->language, $dS_account->visitorAlias);
	
	$reservations = new C_dbAccess_reservations('',$sql); // load candidates
	$rids = $reservations->getIdsList();

	$attendees = new C_dbAccess_attendees(); $attendees->loadOnGroup($rids);
	$att_visitors = new C_dbAccess_att_visitors(); $att_visitors->loadOnGroup($rids);
	$performances = new C_dbAccess_performances(); $performances->loadOnGroup($rids);
	$visitors = new C_dbAccess_visitors(); $visitors->loadOnId($att_visitors->getVisitorsIds());
	$workcodes = new C_dbAccess_workcodes(); $workcodes->loadOnId($performances->getWorkCodeIdsList()); // loads only the workcodes involved in those reservation.
	
	$reservationsByCueIn = $reservations->orderedOnCueIn(); // retrieve an array indexed by cueIn and ordered
	$reservations->setstringtimeformat4AI($utc = false,false,'Y-m-d l G:i'); // Y-m-j G:i is defined here https://www.php.net/manual/en/datetime.format.php
	$reservations->magnify4AI($attendees,$att_visitors,$performances);

	$visitors->setAIformats($dS_account); // sets the phone numbers format to a readable set of subset of digits
	
	$includeswho = false; $inclusiveCueOut = false; $inclusivedate = true;
	$read = '';

	$subpacks = []; 
	$c1=28; // this will define the number of reservations printed on the first page
	$cX=34; // this will defines the number of reservations printed from the second page on
	$t=0;
	$gc=0; // general counter
	$c = $c1;
	$apps = Array();
	$ph = L::XL('add a guideline before printing');
	$sp = L::XL('to start printing');
	$tables = [];
	$resacount = $reservations->count();
	$pagescount = 0; $resacountrest = $resacount;
	if($resacountrest>=18) { 
		$resacountrest-=18; $pagescount = 1;
		$additional = (int)(($resacountrest + $cX - 1) / $cX);
		$pagescount += $additional;
	} else $pagescount = 1;
	
	function nowstring() {
		$now = new C_date();
		$midnight = new C_date(); $time = Date('H:i',$now->t);
		return $now->getDayString().' '.$now->getDateSortable().' '.$time;
	}
	function headercontent($t, $pagescount, $css='') {
		$nowstring = nowstring();
			$page = '<td><span class="print-page">Page '.($t+1).' / '.$pagescount.'</span></td>'; // first child
			$date = '<td><span class="print-date">'.$nowstring.'</span></td>'; // last child
			$pagedate = '<div class="print-header '.$css.'"><table style="width:100%;"><tr>'.$page.''.$date.'</tr></table></div>';
		return $pagedate;
	}
	function addTable($t, $pagescount, $apps) {
			$pagedate = headercontent($t, $pagescount);
			$margin = 'margin:0px auto 40px auto;'; if($t) $margin = 'margin:60px auto 40px auto;';
			$pb= $t?'<div class="page-break">'.$pagedate.'</div>':'';
			$rows = '<tr>'.implode('</tr><tr>',$apps).'</tr>';
		return $pb.'<table style="'.$margin.'" class="resa-print-table">'.$rows.'</table>';
	}
	
	
	
	if($resacount) {
		// now we need to display reservations in the right cueIn order

		foreach($reservationsByCueIn as $cueIn=>$reservation) { // now we loop on reservations and build each display line.
			
			$tds = [];
			$s = $reservation->readCues4ai($inclusivedate, $inclusiveCueOut); // the return string has variants depending on entire day event or few minutes events
			
			$ci = new C_date($reservation->cueIn);
			$datetimein = new DateTime($reservation->cueIn);
			$d = $ci->getDayString(1); // 1 is for a capitalized version
			$rd = ' '.$ci->getDateHumanString();
			$y = $datetimein->format('Y');
			$f = $ci->getMonthString();
			$tm = Date('G:i',$ci->t);
			
			$tds[] = '<td>&nbsp;</td>';
			$tds[] = '<td style="width:3em; max-width:3em; white-space:nowrap;">'.++$gc.')</td>'; // td1
			
			$s = $d.' '.$rd.' '.$f.' '.$y;
			$tds[] = '<td class="right"style="width:4em; max-width:4em;">'.$tm.'</td>'; // td2
			$tds[] = '<td style="width:20%; white-space:nowrap;">'.$s.'</td>';
			
			$visiids = $reservation->visitorIds; $visiray = explode(',',$visiids); // $visiray is an Array();
			
			if($visiids) { // appointment
				if($includeswho) {
					$and = '';
					$vs = '';
					foreach($visiray as $vid) {
						$vs.= $and.$visitors->keyed[$vid]->getFullName();
						$and = ', ';
					}
					$tds[] = '<td>'.$vs.'</td>'; // td3
				}
				if($workcodes->count())
					if($reservation->workcodeIds) {
					$wkids = explode(',',$reservation->workcodeIds);
					$wks = '[ '.$workcodes->keyed[$wkids[0]]->name.' ]';
					$tds[] = '<td>'.$wks.'</td>'; // td4
				}
			} 
			
			$rescids = $reservation->resourceIds; $rescray = explode(',',$rescids); // $rescray is an Array();
				$and = '';
				$rs = '';
				foreach($rescray as $rid) {
					$dS_resource = $resources->keyed[$rid];
					if($dS_resource->resourceType != class_bCal) continue;
					$rs.= $and.$dS_resource->name;
					$and = ', ';
				}
				$tds[] = '<td>'.$rs.'</td>'; // td3
					
			$tds[] = '<td>&nbsp;</td>';
			
			if($gc==1) { // we allow to insert a free note
				$ta = '<textarea class="resa-print-note" rows="4" id="print_note" tabindex="0" placeholder="'.$ph.'">'.'</textarea>';
				$apps[] = '<td colspan='.(count($tds)).'>'.$ta.'</td>';
			}
			
			
			$pb = '';
			$apps[] = implode('',$tds); // which is a string of <td>info</tds>'s
			
			if(!--$c) { 
				
				$tables[] = addTable($t, $pagescount, $apps);
				$c = $cX; 
				$apps = Array();
				$t++; // tables counter
			}
		} // foreach($reservations)
	
		if(count($apps)) { // display the remaining apps (not fitting into a full sized table)
			
			$tables[] = addTable($t, $pagescount, $apps);
			$t++; // tables counter
		}
	} // if($resacount)
	
	$tables = implode('',$tables);
	
	$bps = 'style="font-size:200%; line-height:1em; margin:.5em 3em 0 3em; position:absolute; top:-1.6em; left:calc(50% - 8em);" class="f-calibri-bold mob-txt-lime ctrlP"';
	$divgreenprint = '<div '.$bps.'>'.'&lt;Ctrl+P '.$sp.'&gt;'.'</div>'; // .'('.$vid.','.$sid.')'

	$divpagedate = headercontent(0, $pagescount, 'topper'); // that is a <div class="print-header">
	$divaccount = '<div class="accname f-calibri-bold">'.$dS_account->name.'</div>';
	$divvisitor = '<div class="visitor f-calibri-bold">'.$dS_visitor->getFullName().$sname.'</div>';

	$wstyle = '';
	
$html->pushHTML('<div class="print-wrapper" style="'.$wstyle.'">'.$divpagedate.$divaccount.$divvisitor.$divgreenprint.$tables.'</div>');



	
// identifying the client geolocation

// $phoneregion = 32;
// if(!isset($_SESSION['phoneregion'])) { // this happens only one time by php session, whatever login connexion(s) is(are) made during the session
	
	// $geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );
	// $_SESSION['phoneregion'] = $geo->phoneregion;
// }
// $phoneregion = $_SESSION['phoneregion'];


// starting the client side js
// $vdigits = 'false';
// $screen = isset($_SESSION['screen']) ? $_SESSION['screen'] : 0;
// $html->pushJavaScript('new C_iMOB('.$baseline.','.$keyId.','.$screen.','.$vdigits.','.$phoneregion.');');

// echo
$html->dropPage('print');
?>