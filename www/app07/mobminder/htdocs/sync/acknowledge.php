<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    U P D A T E    V I S I T O R S
//

require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/smsgateaway.php';
require '../../lib_mobphp/comm.php';
require './lib.php';

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
$syncTime = Date('Y-m-d H:i:s',$dS_login->syncTresas);

$class 	= @$_POST['class']; if(!isset($class)) die('Fatal: You need to define a target class');
$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$xml 	= @$_POST['xml']; if(isset($xml)) $xml = !!$xml; else $xml = false;

msg('Check mode: '.($check?$check:'Nope'));
msg('Xml feedback: '.($xml?$xml:'Nope'));
msg('Web render: '.($web?$web:'Nope'));

$perfReport->peak('::time needed to retrieve context and posted parameters');


/////////////////////////////////////////////////////////////////////////////////
//
//   R E C O R D    C H A N G E S    C O M I N G    F R O M    R E M O T E   S I D E

// note: remote side has the priority. 
// i.e: If the same item is adapted on this server and remotely, the remotely adapted data overloads the server data.


$f = new postedfile($dS_account, $dS_login->email);
if($f->present) {
	$f->tolines();
}	

if(!$f->isempty) {
	
	$i = $f->csv_toIdsMatch($accountId, $skeyId, $class);
		msg('File read successfully!'); 
	$perfReport->peak('::file read');
	
	// Saving the data
	//
	foreach($i as $c => $dS_s) {
		$dS_s->skeyId = $skeyId;
		$dS_s->dSsave($accountId);
		$skip = false;
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
}

msg('##0## acknowledgment successful, goodbye.##');

$perfReport->peak('::protocol streamed');
if($web) '##perfreport'.chr(10);
if($web) $perfReport->dropReport(); // no perf report for production

?>