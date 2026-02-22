<?php
require '../../lib_mobphp/dbio.php';
require './lib.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    R E A D    T I M E    A N D    D A T E    O F    L A S T    S Y N C 
//

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);

$class 	= @$_POST['class']; if(!isset($class)) abort('288','acknowledge::You need to define a target class');
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;


switch($class) {
	case 'visi': $utime = $dS_login->syncTvisis; break;
	case 'resa': $utime = $dS_login->syncTresas; break;
	default: abort('282', 'acknowledge::Non matching class in ids matching process: '.$class);
} 

$syncTime = Date('Y-m-d H:i:s', $utime);
if($web) echo 'Sync time for '.$class.': ';
echo $syncTime;

msg('##0## acknowledgment successful, goodbye.##');

?>