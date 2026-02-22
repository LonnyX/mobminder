<?php
$systemLog = 'GSKspoofy.php';
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  SPLIT AN ACCOUNT (Thanks to Alex Vanhoutte)
//
//  This script moves some resources from one group to another existing group; this means:
//	All reservations must follow
//	All visitors must be copied
//	Some workcodes should move to the new group
// 	Some time boxing should move
//	Some hourlies should move
//
//  Usage: 127.0.0.1/utilities/split.php  <= All parameters and behaviour should be set by reviewing this script
//
//  !! IMPORT VISITORS FIRST !!

//////////////////////////////////////////////////////
//
//  catch this script name 
//

$do = @$_GET['do']; if(isset($do)) { if($do==1) $do = true; } else $do = false;

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); 
$html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out = h1('Spoofy operation - GSK fix up');


//////////////////////////////////////////////////////
//
//  Select att_visitors pointing to a merged visitor object
//

// select * from visitors where groupId = 4835; -- Vaccinations -- Opt in = cssColor = 58883
// select * from visitors where groupId = 3009; -- Vaccinations -- Opt in = cssColor = 63334


$GSK_visis_4835 = new C_dbAccess_visitors(false, 4835);
$GSK_4835_byemails = Array();
$GSK_4835_byref = Array();
foreach($GSK_visis_4835->keyed as $vid => $dS_visitor) {
	if($dS_visitor->email) $GSK_4835_byemails[$dS_visitor->email] = $dS_visitor;
	else $GSK_4835_byref[$dS_visitor->reference] = $dS_visitor;
}


$GSK_visis_3009 = new C_dbAccess_visitors(false, 3009);
$GSK_3009_byemails = Array();
$GSK_3009_byref = Array();
foreach($GSK_visis_3009->keyed as $vid => $dS_visitor) {
	if($dS_visitor->email) $GSK_3009_byemails[$dS_visitor->email] = $dS_visitor;
	else $GSK_3009_byref[$dS_visitor->reference] = $dS_visitor;
}






////////////////////////////////////////////////////////////////////////////////

// Pooring into 4835 from 3009

$out .= h2('Pooring into 3009 from 4835');

$homolog = '';
$count_3009_to_4835_optins_bref = 0;
$count_3009_to_4835_optins_bemail = 0;
$count_3009_to_4835_newbies = 0;
foreach($GSK_visis_4835->keyed as $vid => $dS_visitor) {
	$eml = $dS_visitor->email;
	$ref = $dS_visitor->reference;
	if($dS_visitor->lastname=="Zune") print_r($dS_visitor);
	// if($eml) {
	if(isset($GSK_3009_byemails[$eml])) {  // found by email
			$homolog = $GSK_3009_byemails[$eml];
			if($homolog->cssColor == 63334) { 
				$dS_visitor->cssColor = 58883;
				$count_3009_to_4835_optins_bemail++;
				if($do) $dS_visitor->dSsave();
			}
			if($dS_visitor->lastname=="Zune") echo "<br/>EML";
			
	} else if(isset($GSK_3009_byref[$ref])) { // found by reference
		   // found by email
		$homolog = $GSK_3009_byref[$ref];
		if($homolog->cssColor == 63334) { 
			$dS_visitor->cssColor = 58883;
			$count_3009_to_4835_optins_bref++;
			if($do) $dS_visitor->dSsave();
		}
		if($dS_visitor->lastname=="Zune") echo "<br/>REF";
		
	} else { // not found, must be copied
	
		if($dS_visitor->lastname=="Zune") echo "<br/>NEW";
		$count_3009_to_4835_newbies++;
		$dS_visinew = new C_dS_visitor(-$count_3009_to_4835_newbies,3009,$dS_visitor);
		if($dS_visinew->cssColor == 58883) $dS_visinew->cssColor = 63334;
		$out .= notice($dS_visinew->id.'('.$dS_visinew->groupId.')'.' $dS_visinew = '.$dS_visinew->reference.', '.$dS_visinew->firstname.' :'.$dS_visinew->cssColor.' :'.$dS_visinew->email);
		if($do) $dS_visinew->dSsave();
	}
	$homolog = '';
}


$out .= notice('$count_3009_to_4835_optins_bemail: '.$count_3009_to_4835_optins_bemail);
$out .= notice('$count_3009_to_4835_optins_bref: '.$count_3009_to_4835_optins_bref);
$out .= notice('$count_3009_to_4835_newbies: '.$count_3009_to_4835_newbies);


////////////////////////////////////////////////////////////////////////////////

$out .= h2('Pooring into 4835 from 3009');

// Pooring into 3009 from 4835
$homolog = '';
$count_4835_to_3009_optins = 0;
$count_4835_to_3009_newbies = 0;
foreach($GSK_visis_3009->keyed as $vid => $dS_visitor) {
	$eml = $dS_visitor->email;
	$ref = $dS_visitor->reference;
	if(isset($GSK_4835_byemails[$eml])) {  // found by email
			$homolog = $GSK_4835_byemails[$eml];
			if($homolog->cssColor == 58883) { 
				$dS_visitor->cssColor = 63334;
				$count_4835_to_3009_optins++;
				if($do) $dS_visitor->dSsave();
			}
	} else if(isset($GSK_4835_byref[$ref])) { // found by reference
		   // found by email
		$homolog = $GSK_4835_byref[$ref];
		if($homolog->cssColor == 58883) { 
			$dS_visitor->cssColor = 63334;
			$count_4835_to_3009_optins++;
			if($do) $dS_visitor->dSsave();
		}
	} else { // not found, must be copied
		$count_4835_to_3009_newbies++;
		$dS_visinew = new C_dS_visitor(-$count_4835_to_3009_newbies,4835,$dS_visitor);
		if($dS_visinew->cssColor == 63334) $dS_visinew->cssColor = 58883;
		$out .= notice($dS_visinew->id.'('.$dS_visinew->groupId.')'.' $dS_visinew = '.$dS_visinew->lastname.', '.$dS_visinew->firstname.' :'.$dS_visinew->cssColor.' :'.$dS_visinew->reference);
		if($do) $dS_visinew->dSsave();
	}
	$homolog = '';
}


$out .= notice('$count_4835_to_3009_optins: '.$count_4835_to_3009_optins);
$out .= notice('$count_4835_to_3009_newbies: '.$count_4835_to_3009_newbies);

if(!$do) $out .= warning('NOT IN DO MODE');

// foreach($ids as $avid) {
	
	// if($do) {
		// $av->resourceId = $v->mergedTo;
		// $av->dSsave();
		// $out .= warning('fixed');
	// }
// };


//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo html($out);


?>