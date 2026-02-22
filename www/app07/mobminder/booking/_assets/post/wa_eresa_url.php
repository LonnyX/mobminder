<?php
require '../../../../mobminder/lib_mobphp/dbio.php';
require '../classes/eresa_url_lib.php';
require '../classes/connection.php'; 

ob_start(); 

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

//echo $_SERVER['REMOTE_ADDR']; 
//if($_SERVER['REMOTE_ADDR']!=webapp_server_ip_address) die ('invalid ip address');

if(strpos(webapp_server_ip_address, $_SERVER['REMOTE_ADDR'])===false) 
{
    $res = 'invalid ip address :'.$_SERVER['REMOTE_ADDR'];
    C_dS_exception::put('post/wa_resa_url.php', 'main',$res);
    die($res);
}

$postfixurl = $_REQUEST['postfixurl']; if(!isset($postfixurl)) 
{
    $res = 'missing parameter';
    C_dS_exception::put('post/wa_resa_url.php', 'main',$res);
    die ($res);
}

$eresaIdentMode = $_REQUEST['eresaIdentMode']; if(!isset($eresaIdentMode)) 
{
    $res = 'missing parameter';
    C_dS_exception::put('post/wa_resa_url.php', 'main',$res);
    die ($res);
}

$perfReport->peak('::posts retrieved');

$helper = new C_Eresa_Url();

//no need to delete the old version of postfixurl if postfixurl has been changed
//because the midnight cron task will to it

//but override current postfixurl (delete + create)

$res = $helper->deleteReferencePage($postfixurl);
if($res!=null) {C_dS_exception::put('post/wa_resa_url.php', 'main',$res);die ($res);}

$res = $helper->createReferencePage($postfixurl,$eresaIdentMode);
if($res!=null) {C_dS_exception::put('post/wa_resa_url.php', 'main',$res);die ($res);}

$perfReport->peak('::completed');
$perfReport->dropReport();

closeconnection();

?>