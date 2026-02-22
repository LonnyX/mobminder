<?php
//////////////////////////////////////////////////////////////////////
//
//   W E B   A P P     /    C H A T     S T A T U S      Q U E R Y 
//
//   See also ./chatpush.php
//
//
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php';
$perfReport = new C_perfReport();
C_dS_connection::keepalive();
session_write_close();  // <= the session file is un-locked (no more writing possible to session file), other scripts may run
$perfReport->peak('::ready');
$p = new C_chat_peek_smapp($loginId, $perfReport);
$perfReport->peak('::queried');
	$peekstream = implode($nl,$p->stream());
	
echo $nl;
echo 'aid:'.$accountId.$nl;
echo 'lid:'.$loginId.$nl;
echo $nl;
echo '<data>'.$peekstream.'</data>';
echo $nl;

$perfReport->peak('::streamed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>