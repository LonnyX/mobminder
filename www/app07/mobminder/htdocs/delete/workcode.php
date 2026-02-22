<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    W O R K C O D E 
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$wrkcdid = $_POST['id'];
if($wrkcdid<=0) die('Trying to delete a virtual...');

$dS_workcode = new C_dS_workcode($wrkcdid);
if($accountId != $dS_workcode->groupId) die ('You should delete in your own group.');

echo $nl.'C_dS_workcode:'.$nl.$dS_workcode->stream();

// remove any related workexperts
$workexperts = new C_dbAccess_workexperts($wrkcdid); // work experts group to workcodes
$workexperts->deleteAll();

$perfReport->peak('::cleaned up from workexperts');

// remove from performances
	$perfs = new C_dbAccess_performances();
$perfs->deleteOnWorkCode($wrkcdid, $accountId);

$perfReport->peak('::cleaned up from performances');

	$perfs = new C_dbAccess_performances('archive_');
$perfs->deleteOnWorkCode($wrkcdid, $accountId);


$perfReport->peak('::cleaned up from archive performances');


// remove from e-resa logins (e-performances have references in e-resa logins)
$q = new Q('select id from logins where groupId = '.$dS_workcode->groupId.' and accessLevel = '.aLevel_eresa.' and eresaWorkcodes like "%'.$wrkcdid.'%";'); // while we look up for 1111, this query may select 21111 or 11116
$ids = $q->ids();
if($ids) {
		$logins = new C_dbAccess_logins();
	$logins->loadOnId($ids);
	foreach($logins->keyed as $lid => $o_dS_login)
		$o_dS_login->dropWorkcodeId($wrkcdid);
	$logins->saveAll();
}

$perfReport->peak('::cleaned up from e-resa logins (workcodes view)');

// finally, remove the workcode
$dS_workcode->dSdelete();

echo '<code>';
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_wrkc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>