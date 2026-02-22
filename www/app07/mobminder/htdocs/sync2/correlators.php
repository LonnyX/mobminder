<?php
require '../../lib_mobphp/dbio.php';
require './lib.php';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    R E A D    T I M E    A N D    D A T E    O F    L A S T    S Y N C 
//


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;

$web = @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;

msg('Account: '.$dS_account->name);

$sctxt = new C_syncContext($dS_login, $dS_accesskey);

$perfReport->peak('::time needed to retrieve context and posted parameters');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Echo resources associations and colors association
//

$file = '#'.'C_dS_resource'.$nl.$sctxt->listrescs();
$file .= '#'.'C_dS_customCss'.$nl.$sctxt->listccsss();

if($web) echo '<account>'.$dS_account->id.'|'.$dS_account->name.'</account>';
if($web) echo '<surfer>'.$dS_login->id.'|'.$dS_login->lastname.' '.$dS_login->firstname.'</surfer>';

if($web) echo '<file>';
echo $file;
if($web) echo '</file>';


////////////////////////////////////////////////////////////////////////////////////////////////////////

msg('##0## process successful, goodbye.##');
$perfReport->peak('::packed up and echoed to the caller');
if($web) $perfReport->dropReport();
?>