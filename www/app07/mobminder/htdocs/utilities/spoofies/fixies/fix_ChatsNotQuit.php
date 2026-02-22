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
function h3($t) { return '<h3 style="white-space:nowrap; color:	blue; font-size:1.1em;">'.$t.'</h3>'; }
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
$out = h1('Spoofy operation - CHATS QUIT fix up');


//////////////////////////////////////////////////////
//
//  Prob description :
//
//  When creds are removed from a login, it used to keep the login 'active/present' in chat threads 
//  that this login was actually not able to access anymore.
//
//  The problem is that the blinking red figure that appears up right on screen still did count those unaccessible chats!!
//
//  The webapp has been adapted ( see appropriate section in /post/account.php )
// 
//  This script fixes the situation for logins having quit some accounts (before the fix was brought to /post/account.php)
//


$q = new Q('
select accesskeys.groupId as id, lastname, firstname from accesskeys
	join logins on logins.id = accesskeys.groupId
where accountId = 2808;');
$loginIds = $q->ids();

$dS_logins = new C_dbAccess_logins($loginIds);

foreach($dS_logins->keyed as $lid => $dS_login) {
	
	$out .= h2('Now: '.$dS_login->getFullName().'    '.$dS_login->login.'  /   '.$dS_login->password);
	
	
	$dS_akeys = new C_dbAccess_accesskey($lid);
	$aids = $dS_akeys->getAccountsList(); // the accounts that login can today access
	
	$out .= notice('  Accounts: '.$aids);
	
	$q = new Q('select loginId, chat_participants.physseen, chat_threads.id as ct_id, chat_threads.groupId as accountId, 
				chat_participants.cueOut as cueOut, chat_participants.id as cp_id from chat_threads
	join chat_participants on chat_participants.groupId = chat_threads.id
		where chat_participants.loginId = '.$lid.' and chat_participants.cueOut = 0 
		and chat_threads.groupId not in ('.$aids.');');
	
	$threadsIds = $q->mlist('ct_id');
	$out .= notice('  '.$q->cnt().' Chats: '.$threadsIds);
	
	$accounts = $q->mlist('accountId');
	$out .= notice('  '.$q->cnt().' Accounts: '.$accounts);
	
	
	if($do) {
		
		$q = new Q('update chat_participants inner join chat_threads on chat_threads.id = chat_participants.groupId
		set cueOut = '.time().'
		where chat_participants.loginId = '.$lid.' and chat_participants.cueOut = 0 
			and chat_threads.groupId not in ('.$aids.');');

		$out .= notice('  => '.$q->hits().' Quits: ');
	};
}





////////////////////////////////////////////////////////////////////////////////

// 



$out .= notice('Hello: ');

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