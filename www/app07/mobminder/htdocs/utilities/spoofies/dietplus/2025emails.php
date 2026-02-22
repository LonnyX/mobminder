<?php
$systemLog = 'Dietplus Web Marketing action';

ini_set('memory_limit', '2048M');
require '../../../../lib_mobphp/dbio.php';


//////////////////////////////////////////////////////
//
//  Purpose of this script
//
// In the Dietplus wallet, we want to link each account to dS_login(main login)
// because in this login we store the target email recepient for online booking
//
//
// In case you need to clean up existing emails before starting : (MySQL statements to be executed in Navicat)

// delete from templates_email 
  // where groupId in (select distinct accountId from accesskeys where groupId = 7922) 
    // and message like "{\nAction: 'appointment taken',\nGender: '{gender}',%" ;


// delete from templates_email 
  // where groupId in (select distinct accountId from accesskeys where groupId = 7922) 
    // and message like "{\nAction: 'appointment deleted',\nGender: '{gender}',%" ;
	

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1>'.$t.'</h1>'; }
function h2($t) { return '<h2>'.$t.'</h2>'; }
function h3($t) { return '<h3>'.$t.'</h3>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }

if(function_exists('apache_setenv')) {
    apache_setenv('no-gzip', '1');
}
ini_set('zlib.output_compression', 0);
ini_set('output_buffering', 0);


function mb_lcfirst(string $s, string $encoding = 'UTF-8'): string {
    if($s === ''){
        return '';
    }
    $firstChar = mb_substr($s, 0, 1, $encoding);
    $then      = mb_substr($s, 1, null, $encoding);
    return mb_strtolower($firstChar, $encoding) . $then;
}


$csvsep = ',';
$do = @$_REQUEST['do']; if(isset($do)) $do = !!($do|0); else $do = false;



//////////////////////////////////////////////////////
//
//  HTML display
//

// 2) Envoi des headers pour désactiver buffering proxys / navigateurs
header('Content-Type: text/html');
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: no-cache');
header('X-Accel-Buffering: no');

// 3) Vider tous les buffers existants
while(ob_get_level() > 0) { ob_end_flush(); }


// 4) Activer l’implicit flush : chaque echo() se flush automatiquement
ob_implicit_flush(1);


	$pathfile = $_SERVER["SCRIPT_NAME"];
	$break = Explode('/', $pathfile);
	$thisScript = $break[count($break) - 1]; 

	$o = '<!DOCTYPE HTML>';
	$o .= '<html>';
		$o .= '<head>';
		$o .= '<title>'.$thisScript.'</title>';
		$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
		$o .= '<link href="../../utilities.css" rel="stylesheet" type="text/css">';
		$o .= '<head>';
	$o .= '<body>';
	echo $o;
	
	
// 
// As from here, we can echo to the user's screen. The buffering being disabled,
// any echo goes straight to the screen of the user, before the end of this script execution.
// 
	
	
echo '<h1>Dietplus WebMarketing monitoring system setup.</h1>';
if($do) echo '<h1>Do mode  is '.($do?'ON':'OFF').'</h1>';
	else echo '<h2>Do mode  is '.($do?'ON':'OFF').'</h2>';


set_time_limit(360);



//////////////////////////////////////////////////////
//
//  
//
// emails for tracking WebCampaigns
//
// 8504: WebCampaignTracerTake
// 8505: WebCampaignTracerDelete

$dS_emlA = new C_dS_emailTemplate(8504);
$dS_emlB = new C_dS_emailTemplate(8505); // a pair of templates that we need to re-apply in each target account


//
// accounts under scope
//
//
$q = new Q('select distinct accountId as id from accesskeys where groupId = 7922;');
$aids = $q->ids(list_as_array);
$aids_q = $q->ids(list_as_string);

$q = new Q('select name from groups where id in ('.$aids_q.');');
$names = $q->mlist('name',list_as_array);

echo h2('Targets: ('.count($aids).')');
echo '<div>'.implode(', ',$names).'</div>';

//
// Main login (the one we chose to have keys in all accounts, specifying the remote side email)
//
//

$dS_loginMain = new C_dS_login(36364);

$dS_key = new C_dS_accessKey(0,$dS_loginMain->id); // an empty key belonging to $dS_loginMain (via groupId) that we can re-apply on each target account.


//////////////////////////////////////////////////////
//
//  Scanning the accounts
//

foreach($aids as $aid) {
	
	$account = new C_dS_group($aid);
	
	// access key
	//
	// gathers the ids of all resources in that account (most of time it is only one in Dietplus wallet)
	// and build a $watchover field for the new accesskey and link this key to the account and to the login
	// 
	$dbAccess_resources = new C_dbAccess_resources($aid); // auto-loads all resources from that account
	$rids = $dbAccess_resources->getKeysList();
	$ridslist = implode('!',$rids);
	
	echo '<h3>'.$account->name.' Resources:'.$ridslist.'</h3>';
	
	$q = new Q('select id from accesskeys where groupId = '.$dS_loginMain->id.' and accountId = '.$aid.' limit 1');
	$kid = $q->ids();
	$gocreatekey = !$kid; // if no template stands ready 
	
	if($gocreatekey) {
		echo '<p>Creating a key.</p>';
		$dS_key->id = -1;
		$dS_key->accountId = $aid;
		$dS_key->watchover = $ridslist;
		if($do) $dS_key->dSsave();
	} else {
		echo '<p>There is already a key in account id '.$aid.' for our main login.</p>';
	}
	
	// emails
	
	$q = new Q('select id from templates_email where groupId = '.$aid.' and message like "{\nAction: \'appointment taken\',\nGender: \'{gender}\',%" limit 1;');
	$tid = $q->ids();
	$gocreateemails = !$tid; // if no template stands ready 
	
	if($gocreateemails) {
		echo '<p>Creating emails.</p>';
		// create email templates attaching them to the right account
		//
		$dS_emlA->groupId = $aid;
		$dS_emlA->id = -1;
		if($do) $dS_emlA->dSsave();
		
		$dS_emlB->groupId = $aid;
		$dS_emlB->id = -1;
		if($do) $dS_emlB->dSsave();
	} else {
		echo '<p>There are already emails in account id '.$aid.'.</p>';
	}
}




//////////////////////////////////////////////////////
//
//  
//


echo h2('<br/>Successful execution (this script is non destructive, it can be repeated any time).');


echo '</body></html>';

?>