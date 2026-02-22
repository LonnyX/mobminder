<?php

$systemLog = 'update_residence';
require '../utililib.php';
ini_set('memory_limit', '1024M');

$allin = microtime(true);
 
//////////////////////////////////////////////////////////////////////////////// 
//
//  VISILOAD is a script that help LOADING VISITORS 
//
//  FROM .CSV FILES to a MOBMINDER ACCOUNT
//
//   Usage: http://be.mobminder.com/utilities/visiload.php?id=3143&do=1&cleanup=1


$logged = new C_dS_login(7875);
C_dbIO::logged($logged,'fix');


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOCATING HOST
//

	$uriandpar = explode('?',$_SERVER['REQUEST_URI']);  // http://localhost/utilities/visiload/visiload.php?id=5009
$host = $_SERVER['HTTP_HOST']; // localhost
$pars = $uriandpar[1]; // id=5009
$path = $uriandpar[0]; // /utilities/visiload/visiload.php
	$subfolders = preg_split("#/#", $path); 
$sub1 = $subfolders[1];
$sub2 = isset($subfolders[2])?$subfolders[2]:'';
$sub3 = isset($subfolders[3])?$subfolders[3]:'';


$out .= h2('Executing on host: '.$host);
$out .= notice('Pars: '.$pars);
$out .= notice('Path: '.$path);
$out .= notice('sub1: '.$sub1);
$out .= notice('sub2: '.$sub2);

$gotoprod = 'https://be.mobminder.com/utilities/spoofies/titeca_update_residence.php'.'?'.$pars.'';





//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['cleanup'])) $cleanup = true; else $cleanup = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; $do = ($do && $do!=0 && $do!='0');


if(!$accountId) error('You need to give an account id');

$dS_group = new C_dS_group($accountId);
if($dS_group->name == '') error('The account does not exists');

$out .= h2('Account identified: '.$dS_group->name);




//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
set_time_limit(180);

$q0sql = 'select att_visitors.id as id from att_visitors left join visitors on visitors.id = att_visitors.resourceId
	where visitors.id is null';
	
$q0 = new Q($q0sql);	
$out .= notice($q0sql);
$out .= warning('result: '.$q0->cnt().' items found.');

$byresid = Array();
while($row = $q0->result->fetch_array()) {
	$avid = $row['id'];
	if($do) $q = new Q('delete from att_visitors where id = '.$avid.';');
}


$q0sql = 'select archive_att_visitors.id as id from archive_att_visitors left join visitors on visitors.id = archive_att_visitors.resourceId
	where visitors.id is null';
	
$q0 = new Q($q0sql);	
$out .= notice($q0sql);
$out .= warning('result: '.$q0->cnt().' items found.');

$byresid = Array();
while($row = $q0->result->fetch_array()) {
	$avid = $row['id'];
	if($do) $q = new Q('delete from archive_att_visitors where id = '.$avid.';');
}





	
//////////////////////////////////////////////////////////////////////////////// 
//
//  W R I T I N G     T O    D B 
//

$c = 0;
if($do) {
	$cuein = microtime(true);
	
	
	
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$out .= h2($c.' Visitors where written in BD: it took '.$cuedelta.' ');
	$out .= warning('<b> ! ! do NOT re-execute this page ! ! </b>');
} else {
	$out .= h2($c.' dataSets are ready. No WRITING to BD, you are in check mode: use &do=1 to write to DB');
}


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'seconds');

if($host=='localhost')
	$out .= hrefbutton('Go to Prod', $gotoprod);

echo html($out); // from utililib.php

?>