<?php
$systemLog = 'apps loader';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  SPLIT VISITORS REGISTRATION FIELDS ON THE '#', LEAVES ONLY THE TRAILER PART
//
//  Usage: 127.0.0.1/utilities/bc.php?id=2896
//
//  !! IMPORT VISITORS FIRST !!

//////////////////////////////////////////////////////
//
//  catch this script name 
//
$pathfile = $_SERVER["SCRIPT_NAME"];
$break = Explode('/', $pathfile);
$thisScript = $break[count($break) - 1]; 


//////////////////////////////////////////////////////
//
//  HTML Headers 
//
$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('mobminder appointments csv loader');
$html->pushHTML('<h1>mobminder appointments generator</h1>');



//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function notice($msg) { global $html; $html->pushHTML('<p>'.$msg.'</p>'); }


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;

if(!$groupId) error('You need to give an account id');

$o_dS_group = new C_dS_group($groupId);
if($o_dS_group->name == '') error('The account does not exists');
$html->pushHTML('<h2>Account identified: '.$o_dS_group->name.'</h2>');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;
$byRegistr = Array();

	$SQL = 'SELECT id, registration FROM visitors WHERE groupId = '.$groupId.';';

	$result = C_dbIO::q($SQL);
	while ($row = $result->fetch_array()) {
		$r = $row['registration'];
		if(strpos($r, '#') !== false) { 
			$split = explode('#',$r); 
			$trailer = $split[1];
			new Q('UPDATE visitors SET registration = "'.$trailer.'" WHERE id = '.$row['id'].';');
		} else {
			new Q('UPDATE visitors SET registration = "" WHERE id = '.$row['id'].';');
		};
		$byRegistr[$r] = $row['id'];
		$visiTotal++;
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');


//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//

$html->pushHTML('<h2>Operation SUCCESSFULL: do NOT re-execute this page.</h2>');
$html->dropPage();










?>