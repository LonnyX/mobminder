<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   S W I T C H    T E S T    -  F O R    C A L L   C  E N T E R  -
//

require './classes/language.php';
require './../lib_mobphp/dbio.php';

require './api/apilib.php';


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/api/switchtest.php?lgn=vs&pwd=spitup&kid=23659&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$_REQUEST['web'] = 1;
setrendermode('./api/api.css');


h1('Welcome to the Mobminder api switchtest page');

pad(); h2('Checking access rights');

	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];
$context = new C_apicontext($xpected_alevel, $loadcontext = false);


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '';
if(isset($subfolders[1])) {
	if($subfolders[1]=='api') $uri_1 = '/api'; // then you are in locahost testing.
}

pad(); h2('Pre-requisites:');

warning('Before any of the below links do work, you need to be connected on Mobminder with your login and password.',3);


pad(); h2('Parameters:');

indent('o aid: should contain the target mobminder account id',3);
indent('o vdg: caller digits, contains the caller number digits, like eg 32493655599 or 026621800',3);



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
			
pad(); h2('Test-links');

	$akeys = new C_dbAccess_accesskey($context->dS_login->id);
	$accounts = new C_dbAccess_groups();
	$accounts->loadonkeys($akeys);

	indent('This is the list of allowed accounts in your login wallet:',6); pad();
	foreach($accounts->keyed as $aid => $dS_account) {
		$aid = $dS_account->id;
			$q = new Q('select mobile, firstname, lastname from visitors where groupId = '.$aid.' and mobile <>"" limit 1;');
			$v = false; if($q->cnt()) $v = $q->result->fetch_array();
			$vdg = ''; $vname = ''; if($v) {
				$vdg = '&vdg='.$v['mobile'];
				$vname = '('.$v['firstname'].' '.$v['lastname'].')';
			}
		indent($dS_account->name.':'.$vname,6);
		$l = 'https://'.$host.'/index.php?aid='.$aid.$vdg;
		jump($l, $l, 9); pad(0);
	}

			
			
endrendermode();
?>