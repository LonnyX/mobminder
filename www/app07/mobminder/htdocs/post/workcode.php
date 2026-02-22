<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    W O R K C O D E 
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$wrkcdid = $_POST['id'];
$o_dS_workcode = new C_dS_workcode($wrkcdid, $accountId, $_POST);
$o_dS_workcode->dSsave();

// Experts
//
$bCals = $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? false : explode('!', $bCals);
$uCals = $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? false : explode('!', $uCals);
$fCals = $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? false : explode('!', $fCals);

$classes = array(class_bCal => $bCals, class_uCal => $uCals, class_fCal => $fCals);
$o_dbAccess_workexperts = new C_dbAccess_workexperts();
if($wrkcdid>0) $o_dbAccess_workexperts->deleteOnGroup($wrkcdid);

foreach($classes as $class => $experts)
	if($experts)
		foreach($experts as $id) {
			$o_dS_workexpert = $o_dbAccess_workexperts->newVirtual();
			$o_dS_workexpert->resourceId = $id;
		}
$o_dbAccess_workexperts->saveAll($o_dS_workcode->id); // group experts by workcode id


// Timeboxing
//
$tboxing = $_POST['tboxing']; $tboxing = ($tboxing=='-') ? false : explode('!', $tboxing);
$o_dbAccess_worktboxing = new C_dbAccess_worktboxing();
if($wrkcdid>0) $o_dbAccess_worktboxing->deleteOnGroup($wrkcdid);

	if($tboxing)
		foreach($tboxing as $id) {
			$o_dS_worktboxing = $o_dbAccess_worktboxing->newVirtual();
			$o_dS_worktboxing->timeboxingId = $id;
		}
$o_dbAccess_worktboxing->saveAll($o_dS_workcode->id); // group tboxing references by workcode id


// Feedback
//

echo '<code>';
echo $o_dbAccess_workexperts->stream();
echo $o_dbAccess_worktboxing->stream();
echo '#C_dS_workcode'.$nl.$o_dS_workcode->stream(with_tracking).$nl;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>