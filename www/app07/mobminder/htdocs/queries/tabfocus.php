<?php
ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php'; // (*55*) forces $_SESSION['keyId'] to be in line with currently selected tab on surfer browser
echo C_dS_connection::keepalive(); // keeps session open
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>