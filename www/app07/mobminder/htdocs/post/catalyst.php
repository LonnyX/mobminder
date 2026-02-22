<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    N E W    C A T A L Y S T    D I S P L A Y    P R E F E R E N C E 
//

require '../classes/ajax_session.php'; // defines $nl, $keyId, $loginId, $accountId

$perfReport = new C_perfReport();

$perfReport->peak('::session retrieved');

$catalyst = $_POST['catalyst'];

// When the surfer has never set any details, there is no record in the table for this key
//
$o_dbAccess_catalysts = new C_dbAccess_catalysts();
$o_dbAccess_catalysts->cleanUp($keyId, $catalyst);

$o_dS_catalyst = new C_dS_catalyst(-1, $keyId, $_POST); // details are grouped by loginId
$o_dS_catalyst->dSsave();


echo '<code>';
echo '#C_dS_catalyst'.chr(10);
echo $o_dS_catalyst->stream().chr(10);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
?>