<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    S T A T S    S E T T I N G 
//
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();


echo '<code>';
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
?>