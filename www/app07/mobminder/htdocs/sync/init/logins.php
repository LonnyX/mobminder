<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    I N I T I A L I Z E     L O G I N S
//

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$skeyId = $dS_accesskey->id;
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
msg('Check mode: '.($check?$check:'Nope'));
msg('Clean up first: '.($clean?$clean:'Nope'));


$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines();
$l = $f->csv_toLogins();
$perfReport->peak('::file read');
msg('File read successfully!'); 

fixgenders($l);
$perfReport->peak('::guessing genders processed');
	msg('Fixing genders is done!'); 



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//

if($clean) {

	
	
	msg('CLEAN UP: complete.');
	$perfReport->peak('::Clean up done');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//
if(!$check) {
	foreach($r as $c => $dS_l) {
		$dS_l->dSsave($accountId);
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
} else {
	msg('Check mode! The data has NOT been saved to DB.'); 
}

	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Return a file with local Ids
//

msg('##0## process successful, goodbye.##');


// Or return a perf report

$perfReport->peak('::completed');
if($web) $perfReport->dropReport();


?>