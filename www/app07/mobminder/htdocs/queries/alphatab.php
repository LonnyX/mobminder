<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    V I S I T O R S   o n   F I R S T    L E T T E R  o f   L A S T N A M E
//
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

$id = $_POST['id'];
if($id != $accountId) die('look in your own group... <command>logoff</command>');



// -- this query applies color 84244 to any visitor in the account having never had an appointment
// update visitors set cssColor = 84244
// where groupid = 2960 
// and id not in (select resourceId from att_visitors) 
// and id not in (select resourceId from archive_att_visitors);



// sleep(1); // this is to test the fade and spinner effects during data loading

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

$letter = strtolower($_POST['letter']);
$letter = substr($letter,0,1);
$letter = preg_replace("/[^a-z']/si",'',$letter); // does not allow special chars
if(!$letter) die('please contact your administrator'); // protection against SQL injection

$filter = $_POST['filter'];

$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? Array() : explode('!', $bCals);
$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? Array() : explode('!', $uCals);
$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? Array() : explode('!', $fCals);

$resources = Array(class_bCal=>$bCals, class_uCal=>$uCals, class_fCal=>$fCals); // is always at least  a one element array
$staff = Array(); foreach($resources as $type => $ids) if(count($ids)) foreach($ids as $id) $staff[] = $id;

$letterRule = '(REPLACE(lastname," ","") LIKE "'.$letter.'%" )';

$SQL = false;

switch($filter) {
	case 'none': 
		echo 'No filter'.$nl; $SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND '.$letterRule.';'; 
		break;
		
	case 'byrsc': 
		$scount = count($staff);
		echo 'filter on staff:'.$scount.' resources'.$nl;
		if(!$scount) break;
			// current table
			$r = new Q('SELECT DISTINCT groupId FROM attendees WHERE resourceId IN ('.implode(',',$staff).');');
			$rIds = $r->groupIds(); if($rIds) {
				$v = new Q('SELECT resourceId FROM att_visitors WHERE groupId IN ('.$rIds.');');
				$vIds = $v->rscIds(false); 
				echo '    from current:'.count($vIds).' visitors'.$nl;
			} else $vIds = Array();
			// archive table
			$r = new Q('SELECT DISTINCT groupId FROM archive_attendees WHERE resourceId IN ('.implode(',',$staff).');');
			$arIds = $r->groupIds(); if($arIds) {
				$v = new Q('SELECT resourceId FROM archive_att_visitors WHERE groupId IN ('.$arIds.');');
				$avIds = $v->rscIds(false); 
				echo '    from archive:'.count($avIds).' visitors'.$nl;
			} else $avIds = Array();
			
			// merge results
			$vIds = array_merge($vIds, $avIds);
			if(count($vIds)) $vIds = implode(',',$vIds); else $vIds = false;
			// final fetch
			if($vIds) $SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND id IN ('.$vIds.') AND '.$letterRule.';';
				else echo '    No visitors after filtering.'.$nl;
		break;
}

$perfReport->peak('visitors AC::step 1 complete - session & parameters retrieved.');

$visitors = new C_dbAccess_visitors();
if($SQL) $visitors->loadMany($SQL);



////////// sending sync information in case of sync login presence
//
	
	$q = new Q('SELECT logins.id FROM logins JOIN accesskeys on accesskeys.groupId = logins.id WHERE accessLevel = '.aLevel_synchro.' AND accountId = '.$accountId.';');
	$hasSync = $q->ids();
	$synchro_visitors = new C_dbAccess_synchro_visitors(); 
	
	if($hasSync) { 
		$vids = $visitors->getIdsList();
		$synchro_visitors->loadOnLocalId($vids);
	}
		
		
////////// feedback
//
		

$perfReport->peak('visitors AC::step 2 complete - data loaded.');
	echo $nl.'##'.$_POST['letter'].'##';
	echo '<code>';
	echo $visitors->stream('C_dS_visitorAlpha', no_bank, with_tracking); // note the subsitution of the class name
	if($hasSync) echo $synchro_visitors->stream();
	echo '</code>';
	
$perfReport->peak('visitors AC::step 3 complete - streamed.');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_alphatab');
?>
