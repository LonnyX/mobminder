<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    B A C K U P    V I S I T O R S
//

require '../../classes/language.php';
require '../../../lib_mobphp/dbio.php';
require '../lib.php';

ini_set('memory_limit', '512M');

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;
$keyview = new C_keyview($skeyId);

$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$remotePOV 	= @$_POST['remotepov']; if(isset($remotePOV)) $remotePOV = !!$remotePOV; else $remotePOV = false;

msg('Web render: '.($web?$web:'Nope'));

$sctxt = new C_syncContext($dS_login, $dS_accesskey);

$perfReport->peak('::time needed to retrieve context and posted parameters');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   F E T C H     V I S I T O R S      F O U N D     A T     S E R V E R    S I D E

	
	$visis = $sctxt->rem_vis();

	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    B A C K U P    T O    C L I E N T    S I D E

if($web) echo '<file>'; // enclose the file content within the stream
	$filename = $accountId.'_backup_visitors';
	
	$idfields = Array('id'); if($remotePOV) $idfields[] = 'remoteId';
	$vfields = Array('birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email','note','registration','rcolor');
	$fields = array_merge($idfields, $vfields);

	$stream = $visis->csvstream($filename, $fields, false /*classname*/, !$web /* headers */);
	echo $stream;
if($web) echo '</file>';

msg('##0## process successful, goodbye.##');


$perfReport->peak('::protocol streamed');
if($web) '##perfreport'.chr(10);
if($web) $perfReport->dropReport(); // no perf report for production

?>