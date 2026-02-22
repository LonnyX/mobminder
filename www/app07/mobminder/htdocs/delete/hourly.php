<?php

//////////////////////////////////////////////////////////////////////
//
//    D E L E T I N G    A N     H O U R L Y 
//

ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

// We need to :
//
// 1- Delete all references to this hourly in hourlyusers
//   => when exceptionnal hourlies are placed, the comeback should re-activate the previously used periodic hourly
//
// 2- Delete all meta data of the hourly under deletion: that is shadows and timeboxes
//
// 3- Delete the hourly dataSet itself 
//




///////////////////////////////////////////////////////////
//
// Step 1 - Fix hourly usage

$hid = $_POST['id'];

$h = new C_dS_hourly($hid);
$h->purge($account_resources, $perfReport); // $account_resources is a global variable set by ajax_session.php when loading at loadcontext level 2




///////////////////////////////////////////////////////////
//
// Feedback to the lovely client, we have possibly replaced this hourly by another one


$rscIds = $account_resources->getIdsList(false); // returns an array, all C_dS_resource ids in this account
$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers(implode(',',$rscIds));
echo '<code>';
	echo $o_dbAccess_hourliesusers->stream();
	echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';




///////////////////////////////////////////////////////////
//
//

echo $nl;
$perfReport->peak('::completed');
$perfReport->dropReport();
// C_dS_connection::poke($perfReport, 'd_huser');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>