<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   A L I V E 
//
//
//	Calls are like:
//  http://localhost/smsgateaway/satellite/update.php?cid=8932029862021146473
//

require '../sga_lib.php';
setrendermode('..');


$key = @$_REQUEST['key']; if(!isset($key)) die('error 0020'); // security key
if ($key!='497ced65-3cbd-4a33-be28-783b8cda4c3a') die('error 0021'); //compare with uuid token because iccid cannot be used in this case)

$mdb = @$_REQUEST['mdb']; if(!isset($mdb)) $mdb = false; if($mdb) $mdb = true; 

$binfile = new C_smsbox($mdb);
$binfile->stream();

	
?>