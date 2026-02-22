<?php
//////////////////////////////////////////////////////////////////////
//
//  S T R E A M    S T A T I S T I C S    D A T A 
//
require '../classes/ajax_session.php'; session_write_close(); 
$o_dS_system = new C_dS_system();
$perfReport = new C_perfReport();

$id = $_POST['id']; if($id!=$accountId) die('Access restriction');


if(isset($_REQUEST['sunday'])) { if(!is_numeric($_REQUEST['sunday'])) logoff('#moberr 80006g'); }
else { logoff('#moberr 800106g'); }
if(isset($_REQUEST['xweeks'])) { if(!is_numeric($_REQUEST['xweeks'])) logoff('#moberr 80007g'); }
else { logoff('#moberr 80107g'); }

$sunday = @$_POST['sunday']; if(!isset($sunday)) $sunday = $o_dS_system->youngestStats;
$xweeks = @$_POST['xweeks']; if(!isset($weeks)) $weeks = 1;

$sundayDate = new C_date($sunday);

echo 'account id:'.$id.$nl;
echo 'sunday:'.($sundayDate->getDateTimeString()).$nl;
echo 'xweeks:'.$xweeks.$nl;

$actions = new C_dbAccess_xmon_actions($accountId, $sunday, $xweeks);
$actuals = new C_dbAccess_xmon_actuals($accountId, $sunday, $xweeks);
$account = new C_dbAccess_xmon_accounts($accountId, $sunday, $xweeks);
$sms	 = new C_dbAccess_xmon_sms($accountId, $sunday, $xweeks);
$ccss	 = new C_dbAccess_xmon_ccss($accountId, $sunday, $xweeks);
$perfs	 = new C_dbAccess_xmon_performances($accountId, $sunday, $xweeks);

echo '<code>';
echo $actions->stream();
echo $actuals->stream();
echo $account->stream();
echo $sms->stream();
echo $ccss->stream();
echo $perfs->stream();
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();

C_dS_connection::poke($perfReport, 'q_stats');
?>