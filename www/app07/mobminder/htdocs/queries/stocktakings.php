<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y   S T O C K T A K I N G S
//
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session');

// retrieve posts
$prdid = $_POST['prdid'];

$o_dbAccess_stocktakings = new C_dbAccess_stocktakings('', $prdid);
$perfReport->peak('::o_dbAccess_stocktakings');


echo '<code>';
echo $o_dbAccess_stocktakings->stream(no_alias, no_bank, with_tracking);
echo '</code>';

$perfReport->peak('::echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>
