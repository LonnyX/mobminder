<?php
//////////////////////////////////////////////////////////////////////
//
//    S E A R C H   A N D   F I N D      P L A N N I N G    I T E M S 
//
$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();


// sleep(1); // this is to test the fade and spinner effects during data fetching

// step 0: retrieve posted parameters
// 
//
$filter = $_POST['filter']|0;

$f_keyword 	= !!($filter&1); // for each activated filter we set up here a boolean indicator
$f_visitor 	= !!($filter&2);
$f_period 	= !!($filter&4);
$f_resrces 	= !!($filter&8);
$f_action 	= !!($filter&16);
$f_color 	= !!($filter&32);
$f_pattern 	= !!($filter&64);
$f_tag 		= !!($filter&128);
$f_wcode 	= !!($filter&256);
$f_epay 	= !!($filter&512); // see (*ff01*)

$keyword = $_POST['keyword']; if($keyword) $keyword = substr($keyword, 0, 16); // this cut is a security measure (leave no room for sqj inj.)
$visiIds = $_POST['visitor']; $visiIds = ($visiIds=='-') 	? false : str_replace('!', ',', $visiIds);
$wkIds = $_POST['wcodes']; $wkIds = ($visiIds=='-') 	? false : str_replace('!', ',', $wkIds);

$midnIn  = $_POST['midnIn']; if(!is_numeric($midnIn)) die('Find Err 001'); // more protection needs to be coded here for other fields
$midnOut  = $_POST['midnOut']; if(!is_numeric($midnOut)) die('Find Err 002');

$rscrIds = $_POST['resources']; $rscrIds = ($rscrIds=='') 	? false : str_replace('!', ',', $rscrIds);

$actions = $_POST['actions'];	
$lognIds = $_POST['logins']; $lognIds = ($lognIds=='-') 	? false : str_replace('!', ',', $lognIds);

$coloIds = $_POST['colors']; $coloIds = ($coloIds=='-') 	? false : str_replace('!', ',', $coloIds);
$pattIds = $_POST['patterns']; $pattIds = ($pattIds=='-') 	? false : str_replace('!', ',', $pattIds);
$tagsIds = $_POST['tags']; $tagsIds = ($tagsIds=='-') 		? [] : explode('!', $tagsIds);

$epaytypes = $_POST['epays']; $epaytypes = ($epaytypes=='-') 		? false : str_replace('!', ',', $epaytypes);



if($epaytypes) if(!exlamationsplitinteger($epaytypes,',')) {}; // logoff('/find.php #moberr 60001a');
	


$filters = ''; // constraints counter
if($f_keyword) 	if($keyword) $filters .= 'Keyword: '.$keyword.$nl; else $filters .= 'Keyword: ANY NON VOID'.$nl;
if($f_visitor) 	if($visiIds) $filters .= 'Visitors: '.$visiIds.$nl;
if($f_wcode) 	if($wkIds) $filters .= 'Workcodes: '.$wkIds.$nl;
if($f_resrces) 	if($rscrIds) $filters .= 'Resources: '.$rscrIds.$nl;
if($f_action) 	if($actions<(1+2+4)) $filters .= 'Actions: '.$actions.$nl;
if($f_action) 	if($lognIds) $filters .= 'Logins: '.$lognIds.$nl;
if($f_color) 	if($coloIds) $filters .= 'Colors: '.$coloIds.$nl;
if($f_pattern) 	if($pattIds) $filters .= 'Patterns: '.$pattIds.$nl;
if($f_tag) 		if(count($tagsIds)) $filters .= 'Tags: '.(implode(',',$tagsIds)).$nl;
if($f_epay) 	if($epaytypes!==false) $filters .= 'ePayment: '.$epaytypes.$nl;

if(!$filters) $filters = 'NONE'; else $filters = $nl.$filters;
echo $nl.'FILTERs:'.$filters.$nl.$nl;

$cc = 0; // constraints counter (we want the user to set up a minimum set of constraints such that we do not return the entire DB)
if($f_keyword) 	$cc++;
if($f_period) 	if($vc<=1) $cc++; // meaning that if you see more than 2 resources, and you activate that filter only, you will retrieve no result, see (*fd02*), (*fd01*)
if($f_visitor) 	if($visiIds) $cc++;
if($f_wcode) 	if(true) 	 $cc++; // activating the filter means you require only those reservations WITH workcode
if($f_resrces) 	if($rscrIds) $cc++;
if($f_action) 	if($actions<(1+2+4)) $cc++;
if($f_action) 	if($lognIds) $cc++;
if($f_color) 	if($coloIds) $cc++;
if($f_pattern)	if($pattIds) $cc++;
if($f_tag) 		if(count($tagsIds)) $cc++;
if($f_epay) 	if(true) $cc++; // activating the filter means you require only those reservations WITH payments


$epay_has_receivables = false;
if($f_epay) if($epaytypes!==false) { // might be just filter '0' (cash)
	$which = explode(',',$epaytypes); // like e.g. (-2,0,1,11,13)
	$out = Array();
	foreach($which as $x => $epaytype)
		if(!is_numeric($epaytype)) die('Find Err 003');
		else if($epaytype==-2) $epay_has_receivables = true;
			else $out[] = $epaytype; // everything but -2 (receivables)
	$epaytypes = implode(',',$out); // like e.g. (0,1,11,13)
	if($epaytypes==='') $epaytypes = false; 
	
	if($epay_has_receivables) echo 'epay_has_receivables:YES, $epaytypes=|'.($epaytypes===false?'FALSE':$epaytypes).'|'.$nl;
	else echo 'epay_has_receivables:nope, $epaytypes='.$epaytypes.$nl;
}


$pivot = C_dS_system::backupPivotStamp();

$perfReport->peak('::time needed to retrieve session and posted parameters');

	
// step 01: R E S E R V A T I O N S
//
//

$o_dbAccess_reservations[0] = new C_dbAccess_reservations();
$o_dbAccess_reservations[1] = new C_dbAccess_reservations('archive_');

$resaIds = Array(); 
	$o_dbAccess_sms = Array(); 
	$toggles = Array(); 

$o_dbAccess_attendees[0] = new C_dbAccess_attendees();
$o_dbAccess_attendees[1] = new C_dbAccess_attendees('archive_');

$o_dbAccess_att_visitors[0] = new C_dbAccess_att_visitors();
$o_dbAccess_att_visitors[1] = new C_dbAccess_att_visitors('archive_');

$o_dbAccess_resaparts[0] = new C_dbAccess_resaparts();
$o_dbAccess_resaparts[1] = new C_dbAccess_resaparts('archive_');

$o_dbAccess_visitors[0] = new C_dbAccess_visitors();
$o_dbAccess_visitors[1] = new C_dbAccess_visitors();

$o_dbAccess_performances[0] = new C_dbAccess_performances(); 
$o_dbAccess_performances[1] = new C_dbAccess_performances('archive_'); 

$o_dbAccess_payments[0] = new C_dbAccess_payments(); 
$o_dbAccess_payments[1] = new C_dbAccess_payments('archive_'); 


// time window definition
//
echo 'midnight reference:'.$nl;
		
$stamp = '2015-02-27'; // a midnight stamp
C_date::setTimeParameters($dS_account);

if(!is_numeric($stamp)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
	$date = new C_date($stamp);
	$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $stamp); // in this case, gmtshift applies
	$stamp = $date->getTstmp(); // turns back stamp into a unix timestamp
	
	echo chr(9).'ISO8601 time stamp:'.$date->getDateTimeString().$nl;
} else {
	// $stamp is a universal integer unix timecode, referenced to GMT 0
	
	$date = new C_date($stamp);
	$gmtshift = 0;
	
	echo chr(9).'unix time stamp:'.$stamp.' = '.$date->getDateTimeString().$nl;
}

echo chr(9).'gmtshift:'.($gmtshift/3600).' hours'.$nl;
	



// view definitions
//

	$view = $view_resources->viewIds;
	$scope = $view; if($f_resrces) if($rscrIds) $scope = $rscrIds;

function mainQuery($archive = '') {
		
		global $filter, $cc, $accountId, $nl;
		global $f_keyword, $f_visitor, $f_wcode, $f_period, $f_resrces, $f_action, $f_color, $f_pattern, $f_tag, $f_epay;
		global $keyword, $visiIds, $wkIds, $midnIn, $midnOut, $rscrIds, $actions, $lognIds, $coloIds, $pattIds, $tagsIds, $epaytypes, $epay_has_receivables;
		
		if(!$cc) return ''; // (*fd02*) not enough constraints for launching a DB request
		
		$T_resa 	= $archive.'reservations';
		$T_att 		= $archive.'attendees';
		$T_attv 	= $archive.'att_visitors';
		$T_perf 	= $archive.'performances';
		$T_visi 	= 'visitors';
		$T_epays 	= 'payments';
	
		
		$f_OnGroup = $T_resa.'.groupId = '.$accountId; 
		$f_OnNote = '';
		$f_OnVisi = ''; $j_OnVisi = '';  
		$f_OnPerf = ''; $j_OnPerfs = ''; 
		$f_OnResource = ''; $j_OnAttendees = '';
		$f_OnCues = '';
		$f_OnActions = ' AND deletorId = 0'; $f_OnLogins = '';
		$f_OnColors = ''; $f_OnPatterns = ''; $f_OnTags = ''; $f_OnEpays = '';
		$sorton = $archive ? ' order by cueIn desc' : ' order by cueIn asc';
	
	$ispidsearch = false; // search for (and limit this search to) a payment id
	if($f_keyword) 
		if($keyword) {
		
				$pidhead = substr($keyword, 0, 3);
				$pidtrail = substr($keyword, 3, 8); // pid10011160 has 8 digits minimum (we started the DB increment at initial 1000000)
			if($pidhead=='pid'&&is_numeric($pidtrail)) $ispidsearch = true;
			
			if($ispidsearch) {
				// see at epay level what we do with this particular case
				$f_epay |= 512; // makes epay filter turn on, su che that we load the resa's payments 
			}
			else $f_OnNote = ' AND '.wherelike('note', $keyword); // that is the default, we search for the keyword through the notes
			
		} else {
			$f_OnNote = ' AND '.$T_resa.'.note <> ""'; // that is the wildcards mode, any non void note is candidate
		}
	
	if($f_visitor) {
		$j_OnVisi = ' JOIN '.$T_attv.' ON '.$T_attv.'.groupId = '.$T_resa.'.id';
		if($visiIds) {
			$f_OnVisi = ' AND '.$T_attv.'.resourceId IN ('.$visiIds.')';
		} else {
			$f_OnVisi = ' AND '.$T_attv.'.resourceId <> 0'; 
		}
	}
	
	if($f_wcode) {
		$j_OnPerfs = ' JOIN '.$T_perf.' ON '.$T_perf.'.groupId = '.$T_resa.'.id';
		if($wkIds) {
			$f_OnPerf = ' AND '.$T_perf.'.workCodeId IN ('.$wkIds.')'; 
		} else {
			$f_OnPerf = ' AND '.$T_perf.'.workCodeId <> 0';
		}
	}
	
	if(false) { // PVH2023 this is the older version for $f_action, let's keep it for a while
		
		if($actions==1) { // you want only the created and NOT modified items
			if($lognIds) $f_OnActions = ' AND creatorId IN ('.$lognIds.') AND changerId = 0 AND deletorId = 0';
			else $f_OnActions = ' AND creatorId <> 0 AND changerId = 0 AND deletorId = 0';
		}
		else if( $actions>1 && $actions!=(1+2+4) ) { // actions
			$actfilters = Array();
			if($lognIds) { // combined filters on logins and actions
				if($actions&1) $actfilters[] = 'creatorId IN ('.$lognIds.')';
				if($actions&2) $actfilters[] = 'changerId IN ('.$lognIds.')';
				if($actions&4) $actfilters[] = 'deletorId IN ('.$lognIds.')'; else $actfilters[] = 'deletorId = 0';
			} else { // actions only
				if($actions&1) $actfilters[] = 'creatorId <> 0';
				if($actions&2) $actfilters[] = 'changerId <> 0';
				if($actions&4) $actfilters[] = 'deletorId <> 0'; else $actfilters[] = 'deletorId = 0';
			}
			$f_OnActions = ' AND '.implode(' aNd ',$actfilters);
		} 
		else // no action filter
			if($lognIds) { // filters on login for unrelevant actions
				$f_OnLogins = ' AND (creatorId IN ('.$lognIds.') OR changerId IN ('.$lognIds.') OR deletorId IN ('.$lognIds.'))';
			} 
			else { // $actions = 7 and no logins are selected
				if($cc) $f_OnActions = '';
			}
	}
	
	if($f_action) {
		
		if($lognIds) { // like 20654,17845,7875, see (*ct21*)
		
			// actions arrive as a 3 bits bitmap like [(1=creation),(2=modification),(4=deletion)]
			
			switch($actions) {
				case 1: // resas that were created but never modified nor deleted
					$f_OnActions = ' AND changerId = 0  AND deletorId = 0 aNd creatorId iN ('.$lognIds.')';
					break;
				case 2: // resas that were created and modified (all resas were ever created so we do not filter on created)
					$f_OnActions = ' AND changerId iN ('.$lognIds.') aNd deletorId = 0';
					break; 
				case 3: // resas that were modified or created by the selected chaps
					$f_OnActions = ' AND ( changerId iN ('.$lognIds.') OR creatorId iN ('.$lognIds.') ) aNd deletorId = 0';
					break; 
				case 4: // resas that were deleted
					$f_OnActions = ' AND deletorId iN ('.$lognIds.')';
					break; 
				case 5: // (1+4) resas that were deleted but never modified
					$f_OnActions = ' AND deletorId iN ('.$lognIds.') AND changerId = 0';
					break; 
				case 6: // (2+4) resas that were deleted but were also modified 
				case 7: // (1+2+4) same because any existing resa was ever created
					$f_OnActions = ' AND deletorId iN ('.$lognIds.') AND changerId iN ('.$lognIds.')';
					break; 
			}
		
		} else { // search actions only, whoever made it!
			
			switch($actions) {
				case 1: // resas that were created but never modified nor deleted
					$f_OnActions = ' AND changerId = 0 AND deletorId = 0';
					break;
				case 2: // resas that were modified
					$f_OnActions = ' AND changerId <> 0 aNd deletorId = 0';
					break; 
				case 3: // resas that were created or modified (all resas were ever created so we do not filter on created)
					$f_OnActions = ' AND ( changerId <> 0 OR creatorId <> 0 ) aNd deletorId = 0';
					break; 
				case 4: // resas that were deleted
					$f_OnActions = ' AND deletorId <> 0';
					break; 
				case 5: // (1+4) resas that were deleted but never modified
					$f_OnActions = ' AND deletorId <> 0 AND changerId = 0';
					break; 
				case 6: // (2+4) resas that were deleted but were also modified 
				case 7: // (1+2+4) same because any existing resa was ever created
					$f_OnActions = ' AND deletorId <> 0 AND changerId <> 0';
					break; 
			}
		}
	}
	
	
	if($f_resrces) if($rscrIds) {
		$j_OnAttendees = ' JOIN '.$T_att.' ON '.$T_att.'.groupId = '.$T_resa.'.id';
		$f_OnResource = ' AND '.$T_att.'.resourceId IN ('.$rscrIds.')'; 
	}
	
	if($f_period) {
		
		echo $nl.'PERIOD filter:'.$nl;
			$in = new C_date($midnIn); $inmdn = new C_date($midnIn); $inmdn->dropTime();
			$out = new C_date($midnOut); $outmdn = new C_date($midnOut); $outmdn->dropTime();
		if($midnIn) echo $nl.'- midnIn:'.$midnIn.' ('.$in->getDateTimeString().' / '.$inmdn->getDateTimeString().') ';
		if($midnOut) echo $nl.'- midnOut:'.$midnOut.' ('.$out->getDateTimeString().' / '.$outmdn->getDateTimeString().') ';
		
		if($midnIn && $midnOut) {
			if($midnIn && $midnOut) // this covers one single day
			
			$f_OnCues = ' AND cueOut > '.$midnIn.' AND cueIn < '.($midnOut+86400);
			
		} else if($midnIn && !$midnOut) {
			$f_OnCues = ' AND cueIn > '.$midnIn;
			
		} else if(!$midnIn && $midnOut) {
			$f_OnCues = ' AND cueOut < '.($midnOut+86400);
			
		}
	}
		
	if($f_color) if($coloIds) {
		$f_OnColors = ' AND cssColor IN ('.$coloIds.')'; // must have one of the provided color
	} else 
		$f_OnColors = ' AND cssColor = 0'; // must have none color set
		
	if($f_pattern) if($pattIds) {
		$f_OnPatterns = ' AND cssPattern IN ('.$pattIds.')'; 
	} else 
		$f_OnPatterns = ' AND cssPattern = 0';
		
		
	if($f_tag) 
		if(count($tagsIds)) { // tagsIds is false if no tags are selected, or an Array[] when some are
			// we select according to tags, they are prepared in DB with heading and trailing '!' so to ease the query syntax, see also (*ct20*) 
			$f_OnTags = ' anD '.$T_resa.'.cssTags <> "" anD (';
			$f_ORtags = Array();
			foreach($tagsIds as $x => $tagid) {
				// $f_ORtags[] = $T_resa.'.cssTags like "%!'.$tagid.'!%"'; 
				$f_ORtags[] = 'CONCAT("!",'.$T_resa.'.cssTags,"!") like "%!'.$tagid.'!%"'; 
			}
			$f_OnTags .= implode(' oR ', $f_ORtags);
			$f_OnTags .= ')';
		} else {
			// we select any reservation having tags set on
			$f_OnTags = ' AND '.$T_resa.'.cssTags <> ""';
		}
	
	
	$j_OnEpays = '';
	if($f_epay) { // with filter(s) on payment means, the receivables view will be limited to those resas having payments of given types (*1) 
		$j_OnEpays = ' JOIN '.$T_epays.' ON '.$T_epays.'.groupId = '.$T_resa.'.id'; // joins the payments table
		
		if(0) {
			if($ispidsearch) { // only one payment is under search, the keyword is like "pid10011160"
				$pid = substr($keyword, 3, 10); // pid10011160 has 8 digits minimum (we started the DB increment at initial 10.000.000)
				echo $nl.'PID |'.$pid.'|'.$nl;
				$f_OnEpays = ' anD '.$T_epays.'.id = '.$pid;
				
			} else { // appointments having payments attached
			
				if($epaytypes===false) // in some case $epaytypes might be just '0' so we need to ===
					$f_OnEpays = ' anD '.$T_epays.'.transtatus = '.payment_status_success; // join any payment but only those reservations where there was associated payment
				else 
					$f_OnEpays = ' AnD '.$T_epays.'.paymean IN ('.$epaytypes.') aNd '.$T_epays.'.transtatus = '.payment_status_success; 
			}
		}
		
		
		if($epaytypes===false) // in some case $epaytypes might be just '0' so we need to ===
			$f_OnEpays = ' anD '.$T_epays.'.transtatus = '.payment_status_success; // join any payment but only those reservations where there was associated payment
		else 
			$f_OnEpays = ' AnD '.$T_epays.'.paymean IN ('.$epaytypes.') aNd '.$T_epays.'.transtatus = '.payment_status_success; 
		
		
		if($ispidsearch) { // only one payment is under search, the keyword is like "pid10011160"
		
			$pid = substr($keyword, 3, 10); // pid10011160 has 8 digits minimum (we started the DB increment at initial 10.000.000)
			echo $nl.'PID |'.$pid.'|'.$nl;
			$f_OnEpays .= ' anD '.$T_epays.'.id = '.$pid;
			
		}
	} 
	if($epay_has_receivables) // positive (receivables) or negative (to be refund) balance exist
		if($epaytypes===false) { // no filter on payment means
			echo $nl.'BILLAMOUNTS'.$nl;
			$f_OnEpays .= ' AnD '.$T_resa.'.billamount > 0'; // some receivables might rely in reservations having no existing dS_payment (*2)
			// $j_OnEpays = '';
		}
	
	// now compile the main query
	//
	$fs = $f_OnNote.$f_OnCues.$f_OnResource.$f_OnVisi.$f_OnPerf.$f_OnActions.$f_OnLogins.$f_OnColors.$f_OnPatterns.$f_OnEpays.$f_OnTags;
	$q = 'select distinct '.$T_resa.'.id AS id from '.$T_resa.$j_OnAttendees.$j_OnVisi.$j_OnPerfs.$j_OnEpays.' where '.$f_OnGroup.$fs.$sorton.' limit 4000; -- /query/find.php';
	
	$line = '-------------------------------------------------';
	// echo $nl.$line.$nl.$q.$nl.$line.$nl.$nl.$nl; // Uncomment thi sline to see the actual query in the debug part of the response payload.
	$q = new Q($q);
	$rids = $q->ids();

	// special cast for 'epaytype' receivables:
	//
	if($f_epay) if($rids) {
		if($epay_has_receivables) { // in this case we need to re-filter the reservations so to keep only those where a positive (receivables) or negative (to be refund) balance exist
			// arrived here we have either resa filtered on paymean (*1) or (if no paymean filter is set) resas having billamount positive (*2)
			// we still need to go through the data and keep only those reservations with non null balance
			// echo $nl.$line.$nl.$rids.$nl.$line.$nl;
			
			// $q11: only those resas having success payments, that we also sum up into total
			$q11 = 'select '.$T_resa.'.id as rid, billamount, sum(amount) as total from '.$T_epays.'
					join '.$T_resa.' on '.$T_resa.'.id = '.$T_epays.'.groupId
					where '.$T_resa.'.groupId = '.$accountId.' and '.$T_resa.'.id in ('.$rids.') and '.$T_epays.'.transtatus = '.payment_status_success.'
					group by '.$T_resa.'.id';
					
			// $q12: only those resas having either no payment at all OR unsuccessfull payments, that we also sum up as zero into total
			$q12 = 'select '.$T_resa.'.id as rid, billamount, 0 as total from '.$T_resa.'
					left join '.$T_epays.' on '.$T_resa.'.id = '.$T_epays.'.groupId
					where '.$T_resa.'.groupId = '.$accountId.' and '.$T_resa.'.id in ('.$rids.') 
						and ( '.$T_epays.'.id is null or '.$T_epays.'.transtatus <> '.payment_status_success.')
					group by '.$T_resa.'.id';
			
			// group by resa id in such a way that duplicates ($q11+$q12) do resolve into a correct bigtotal
			$q1 = 'select rid as id, billamount, sum(total) as bigtotal from ('.$q11.' UnIoN '.$q12.') as summed group by rid';
			
			// retrieve the balance. Positive balance means receivable, negative amounts should be refunded by merchant to visitor.
			$q0 = 'select id, billamount-bigtotal as balance from ('.$q1.') as balanced where billamount-bigtotal <> 0;';
			
			echo $nl.$line.$nl.$q0.$nl.$line.$nl;	
			$q0 = new Q($q0);
			$rids = $q0->ids();
			if($rids) {
				$array = $q0->idx('id','balance'); // see (*q02*)
				echo '    Found '.count($array).' reservations with non zero balance:'.$nl;
				foreach($array as $rid => $balance)
					echo '    rid:'.$rid.' <-> balance:'.$balance.$nl;
			} else 
				echo '     No rids after filtering for f_epay with epay_has_receivables'.$nl;
		}
		echo $nl;
	}
	
	return $rids;
}	


$current = mainQuery(); $archived = ''; if($f_period) if($midnIn < $pivot) $archived = mainQuery('archive_');
	
	
if($current) {
	$o_dbAccess_reservations[0]->loadOnId($current);
	$perfReport->peak('::loaded from current reservations');
}
	
if($archived) {
	$o_dbAccess_reservations[1]->loadOnId($archived);
	$perfReport->peak('::loaded from archived reservations');
}


$current = $o_dbAccess_reservations[0]->count();
$archived = $o_dbAccess_reservations[1]->count();


// reservations are defined, load all need attributes
//



if($current) {
	if(1) $o_dbAccess_reservations[0]->loadPeers(); // if you click the technical resa when in the multiple days car reservation, even if not on planning this day, the technical resa should go open => must be downloaded
	$resaIds[0] = $o_dbAccess_reservations[0]->getIdsList();
	if($view) $o_dbAccess_attendees[0]->loadOnView($view, $resaIds[0]);
		else $o_dbAccess_attendees[0]->loadOnGroup($resaIds[0]); // even if one single resource is displayed, the asses must be accurate and therefore we need to know all attendees in the view
	$o_dbAccess_att_visitors[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_resaparts[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_visitors[0]->loadOnId($o_dbAccess_att_visitors[0]->getVisitorsIds(), false);
	$o_dbAccess_performances[0]->loadOnGroup($resaIds[0]);
	$o_dbAccess_payments[0]->loadOnGroup($resaIds[0]);
	$perfReport->peak('::attributes loaded from current tables ('.$current.' items)');
}
if($archived) {
	if(1) $o_dbAccess_reservations[1]->loadPeers();
	$resaIds[1] = $o_dbAccess_reservations[1]->getIdsList();
	if($view) $o_dbAccess_attendees[1]->loadOnView($view, $resaIds[1]);
		else $o_dbAccess_attendees[1]->loadOnGroup($resaIds[1]);
	$o_dbAccess_attendees[1]->loadOnGroup($resaIds[1]);
	$o_dbAccess_att_visitors[1]->loadOnGroup($resaIds[1]);
	$o_dbAccess_resaparts[1]->loadOnGroup($resaIds[1]);
	$o_dbAccess_visitors[1]->loadOnId($o_dbAccess_att_visitors[1]->getVisitorsIds(), false);
	$o_dbAccess_performances[1]->loadOnGroup($resaIds[1]);
	$o_dbAccess_payments[1]->loadOnGroup($resaIds[1]);
	$perfReport->peak('::attributes loaded from archive tables ('.$archived.' items)');
}

if($gmtshift) { // this login is located on a different timezone but wants to see the agenda "as if" he was on the account timezone
	
	$o_dbAccess_reservations[0]->gmtshift($gmtshift);
	$o_dbAccess_reservations[1]->gmtshift($gmtshift);
}
	


if(1){
	if(isset($resaIds[0])) {
		$o_dbAccess_sms[0] = new C_dbAccess_sms($resaIds[0]);
		$toggles[0] = new C_dbAccess_cToggles($resaIds[0]);
	}
	if(isset($resaIds[1])) {
		$o_dbAccess_sms[1] = new C_dbAccess_sms($resaIds[1]);
		$toggles[1] = new C_dbAccess_cToggles($resaIds[1]);
	}
}

$perfReport->peak('STEP 1 done::R E S E R V A T I O N S');


// step 02: N O T E S   A N D   T A S K S 
//
//


$o_dbAccess_note_addressees[0] = new C_dbAccess_note_addressees();
$o_dbAccess_note_details[0] = new C_dbAccess_note_details();
$o_dbAccess_note_visirefs[0] = new C_dbAccess_note_visirefs();
$o_dbAccess_note_visitors[0] = new C_dbAccess_visitors();
$o_dbAccess_task_assignees[0] = new C_dbAccess_task_assignees();
$o_dbAccess_task_descriptions[0] = new C_dbAccess_task_descriptions();
$o_dbAccess_task_visirefs[0] = new C_dbAccess_task_visirefs();
$o_dbAccess_task_visitors[0] = new C_dbAccess_visitors();

	echo 'Scope for notes & tasks fetching: loginId='.$loginId.', accountId='.$accountId.$nl;

	// $notesIds = $o_dbAccess_note_details[0]->loadOnLogin($midnIn, $midnOut, $loginId, $accountId);
	// $o_dbAccess_note_addressees[0]->loadOnGroup($notesIds);
	// $o_dbAccess_note_visirefs[0]->loadOnGroup($notesIds);
	// $o_dbAccess_note_visitors[0]->loadOnId($o_dbAccess_note_visirefs[0]->getList('visiId'), false);
	
	// $tasksIds = $o_dbAccess_task_assignees[0]->loadOnLogin($midnIn, $midnOut, $loginId, $accountId);
	// $o_dbAccess_task_descriptions[0]->loadOnId($tasksIds);
	// $o_dbAccess_task_assignees[0]->loadOnGroup($tasksIds);
	// $o_dbAccess_task_visirefs[0]->loadOnGroup($tasksIds);
	// $o_dbAccess_task_visitors[0]->loadOnId($o_dbAccess_task_visirefs[0]->getList('visiId'), false);
	

$notescurrent = $o_dbAccess_note_details[0]->count();
$notesarchived = false; //$o_dbAccess_note_details[1]->count();

$taskscurrent = $o_dbAccess_task_descriptions[0]->count();
$tasksarchived = false; //$o_dbAccess_task_descriptions[1]->count();


$perfReport->peak('STEP 2 done:: N O T E S    &   T A S K S');

// E C H O
//
// !note that the sequence is very important as C_dSs will relink at construction at client side!
//
$bank = 'catalyst';
echo '<code>';
	///
	if($notescurrent) {
		echo $o_dbAccess_note_details[0]->stream(false, $bank);
		echo $o_dbAccess_note_addressees[0]->stream(false, $bank);
		echo $o_dbAccess_note_visirefs[0]->stream(false, $bank);
		echo $o_dbAccess_note_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($notesarchived) {
		echo $o_dbAccess_note_details[1]->stream(false, $bank);
		echo $o_dbAccess_note_addressees[1]->stream(false, $bank);
		echo $o_dbAccess_note_visirefs[1]->stream(false, $bank);
		echo $o_dbAccess_note_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if($taskscurrent) {
		echo $o_dbAccess_task_descriptions[0]->stream(false, $bank);
		echo $o_dbAccess_task_assignees[0]->stream(false, $bank);
		echo $o_dbAccess_task_visirefs[0]->stream(false, $bank);
		echo $o_dbAccess_task_visitors[0]->stream(no_alias, no_bank, with_tracking);
	}
	if($tasksarchived) {
		echo $o_dbAccess_task_descriptions[1]->stream(false, $bank);
		echo $o_dbAccess_task_assignees[1]->stream(false, $bank);
		echo $o_dbAccess_task_visirefs[1]->stream(false, $bank);
		echo $o_dbAccess_task_visitors[1]->stream(no_alias, no_bank, with_tracking);
	}
	///
	if(1) {
		if(isset($resaIds[0])) {
			echo $o_dbAccess_sms[0]->stream();
			echo $toggles[0]->stream();
		}
		if(isset($resaIds[1])) {
			echo $o_dbAccess_sms[1]->stream();
			echo $toggles[1]->stream();
		}
	}
	if($current) { 
		echo $o_dbAccess_visitors[0]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[0]->stream(false, $bank);
		echo $o_dbAccess_att_visitors[0]->stream(false, $bank);
		echo $o_dbAccess_resaparts[0]->stream(false, $bank);
		echo $o_dbAccess_performances[0]->stream(false, $bank);
		echo $o_dbAccess_payments[0]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_reservations[0]->stream(false, $bank);
	}
	if($archived) {
		echo $o_dbAccess_visitors[1]->stream(no_alias, no_bank, with_tracking); 
		echo $o_dbAccess_attendees[1]->stream(false, $bank);
		echo $o_dbAccess_att_visitors[1]->stream(false, $bank);
		echo $o_dbAccess_resaparts[1]->stream(false, $bank);
		echo $o_dbAccess_performances[1]->stream(false, $bank);
		echo $o_dbAccess_payments[1]->stream(false, $bank, with_tracking);
		echo $o_dbAccess_reservations[1]->stream(false, $bank);
	}
echo '</code>';




$perfReport->peak('::streamed');

echo '##perfreport'.$nl;
$perfReport->peak('::echo');
$perfReport->dropReport();

// C_dS_connection::poke($perfReport, 'q_plitems');
?>