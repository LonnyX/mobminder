<?php
require '../../../../mobminder/lib_mobphp/dbio.php';
require '../classes/eresa_url_lib.php';

$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

//echo $_SERVER['REMOTE_ADDR']; 
//if ($_SERVER['REMOTE_ADDR']!=webapp_server_ip_address) die ('invalid ip address');
if(strpos(webapp_server_ip_address, $_SERVER['REMOTE_ADDR'])===false) 
{
    $res = 'invalid ip address :'.$_SERVER['REMOTE_ADDR'];
    C_dS_exception::put('delete/wa_resa_url.php', 'main',$res);
    die ($res);
}


$postfixurl = $_REQUEST['postfixurl']; if(!isset($postfixurl)) 
{
    $res = 'missing parameter';
    C_dS_exception::put('delete/wa_resa_url.php', 'main',$res);
    die ($res);
}
$perfReport->peak('::posts retrieved');

$helper = new C_Eresa_Url();
$res = $helper->deleteReferencePage($postfixurl);
if ($res!=null) {C_dS_exception::put('delete/wa_resa_url.php', 'main',$res);die ($res);}


$perfReport->peak('::completed');

$perfReport->dropReport();

?>

