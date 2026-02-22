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

$q0sql = 'select distinct residence from (
		select count(1) as multi, residence from visitors where groupId = 3914 and mergedTo = 0 group by residence) as counting
	where multi > 1 order by multi desc';
	
$q0 = new Q($q0sql);	
$out .= notice($q0sql);
$out .= warning('result: '.$q0->cnt().' items found.');

$byresid = Array();
while($row = $q0->result->fetch_array())
	$byresid[$row['residence']] = $row['residence'];

$donecount = 0;
foreach($byresid as $resid)
{
	if(!$resid) continue;
	if($donecount>100) break; 
	
		$q1sql = 'select id from visitors where groupId = 3914 and mergedTo = 0 and residence = "'.$resid.'" order by created asc;';
	$q1 = new Q($q1sql);
	
	$row = $q1->result->fetch_array();
	$dS_visi = new C_dS_visitor($row['id']); // which is the oldest record
	$out .= notice(++$donecount.') residence: '.$resid.' items found:'.$q1->cnt());
	
	while($row = $q1->result->fetch_array()) {
		$dS_visi2 = new C_dS_visitor($row['id']);
		$out .= '   dS_visi2: '.$dS_visi2->lastname.' '.$dS_visi2->firstname.' merges to '.$dS_visi->lastname.' '.$dS_visi->firstname;
		$dS_visi2->mergeTo($dS_visi->id, $dS_group, $dS_visi);
	}	
	
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