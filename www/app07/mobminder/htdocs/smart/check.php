
<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//       S M A R T     A P P     A P I      
//
//   ping check if server is accessible
//
//   -- do not remove this file --
//

ob_end_clean();
header('Connection: close');
header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');
ignore_user_abort(true); // optional
ob_start();
echo ('Ok');
$size = ob_get_length();
header('Content-Length: '.$size);
ob_end_flush();     // Strange behaviour, will not work ...
flush();            // ... Unless both are called !

//////////////////////////////////////////////////////////////////////////////////////////////////////////

//do processing here
echo('Text you will never see');

?>