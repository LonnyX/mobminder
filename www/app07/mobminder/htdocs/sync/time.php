<?php
require '../../lib_mobphp/dbio.php';
require './lib.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$dS_login = quicklogin();
$r = Date('Ymd H:i:s',$dS_login->syncTrescs+1);
$v = Date('Ymd H:i:s',$dS_login->syncTvisis+1);
$a = Date('Ymd H:i:s',$dS_login->syncTresas+1);

echo $r.chr(10); // !! keep this sequence, calling scripts expect sequence
echo $v.chr(10);
echo $a.chr(10);
?>