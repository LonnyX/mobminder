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


$out = h1('Fix e-Dent agenda import');

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
if(isset($_GET['nodoublons'])) $nodoublons = true; else $nodoublons = false;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');

$out .= h2('Account identified: '.$o_dS_group->name);


$out = h2('PHP version:'.phpversion());



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//


$ql = 'select id from visitors where groupId = 5434 and mobile <> "";';
$q = new Q($ql);

$ids = $q->ids();
$out .= notice($ql);
$out .= notice('result: '.$q->cnt().' items found.');

$vids = $q->ids(list_as_array);

$visbymobile = Array(); $countmobiles = 0;
$multimobile = Array(); $countmultis = 0;

foreach($vids as $vid)  {
	
	$dS_v = new C_dS_visitor($vid);
	
	if(isset($visbymobile[$dS_v->mobile])) { $multimobile[$dS_v->mobile] = $dS_v; $countmultis++; } // do not keep mobiles that are shared by two or more 
	else { $visbymobile[$dS_v->mobile] = $dS_v; }
	$countmobiles++; 
	// $out.= notice($dS_v->id.': '.$dS_v->lastname.', '.$dS_v->firstname);
}

	$out .= warning('<b>found in total '.$countmobiles.' visitors with mobile</b>');
	$out .= warning('<b>from which are '.$countmultis.' in doublons</b>');


foreach($multimobile as $mobile => $dS_v) {
	unset($visbymobile[$dS_v->mobile]);
}

$countremains = 0;
foreach($visbymobile as $mobile => $dS_v) {
	$countremains++;
}
	$out .= warning('<b>a total of '.$countremains.' remains after cleanup</b>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING APPOINTMENTS
//


$q2 = 'select reservations.id as id, SUBSTR(note FROM 3 FOR 11) as mobref, note from reservations
left join att_visitors on att_visitors.groupId = reservations.id
where reservations.groupId = 5434 and att_visitors.id is NULL and note like "#+%#%";';

$q = new Q($q2);

$rids = $q->ids(list_as_array); // which is a list of reservations id

$countfixedresas = 0;
$countunfixedresas = 0;
while($row = $q->result->fetch_array()) {

		$rid = $row['id'];
		$mobile = $row['mobref'];
		if(isset($visbymobile[$mobile])) {
			$dS_v = $visbymobile[$mobile];
			$out .= notice('a perfect match was found for resa '.$rid.' with visitor '.$dS_v->id.' '.$dS_v->lastname);
			$countfixedresas++;
			
				$dS_att_visitor = new C_dS_att_visitor(0, $rid);
				$dS_att_visitor->resourceId = $dS_v->id;
			
			if($do) {
				$dS_att_visitor->save();
			}
		} else {
			$countunfixedresas++;
		}
}
	$out .= warning('<b>a total of '.$countfixedresas.' resrevations can be fixed</b>');
	$out .= warning('<b>a total of '.$countunfixedresas.' resrevations can NOT be fixed</b>');
	
	

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