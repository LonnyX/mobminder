<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// initialization.php
// Step 3 : Page called when calendars was created and their permission elevated in order to create events
// Here, we init a task in database which will be deal by minute.php
//
//
//                              CRONOFY LINKING MAP
//
//  Step 1 : welcome.php
//  Step 2 : oauth.php
//  Step 2-3 : link account
//  Step 3 : connecting.php
//  *Step 3-4 : elevated permissions
//  > Step 4 : initialization.php
//  Step 4bis : minute.php
//  Step 5 : initialized.php
//
//                              CRONOFY REFRESHING MAP
//
//  Step 1 : welcome.php
//  Step 2 : refresh.php
//  * Step 2-3 : elevated permissions
//  > Step 3 : initialization.php
//  Step 3bis : minute.php
//  Step 4 : initialized.php
//
//
// Key: > location  /  * page who can call this page
//
///////////////////////////////////////////////////////////////////////////////////

require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/crodbio.php';


/////////////////////////////////////
// GET PARAMETER
//
$cronofy_access_id = @$_GET['a'];
$refresh = @$_GET['r'];

$dS_cronofy_access = new C_dS_cronofy_access($cronofy_access_id);
$cronofy_profile_id = $dS_cronofy_access->groupId;
$dS_cronofy_profile = new C_dS_cronofy_profile($cronofy_profile_id);

$keyId=$dS_cronofy_access->keyId;
$dS_accesskey = new C_dS_accesskey($keyId);
$loginId 	= $dS_accesskey->groupId;
$accountId 	= $dS_accesskey->accountId;
$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);
$dS_key = new C_dS_accesskey($keyId);
C_dbIO::$loggedName = $dS_login->firstname.' '.$dS_login->lastname;
C_dbIO::$loggedId = $dS_login->id;

/////////////////////////////////////
// PROCESSING IN BACKGROUND
//

if(!isset($_GET['error']))
{
    $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
    $dbAccess_cronofy_calendars->getByGroupId($dS_cronofy_access->id);
    foreach($dbAccess_cronofy_calendars->keyed as $dS_cronofy_calendar){
        $dS_cronofy_calendar->permission=1;
        $dS_cronofy_calendar->dSsave();
    }
}

// Create the task in database if not exists already an init task (with state=0) for this profile
$q = new Q('SELECT id FROM cronofy_inittasks WHERE groupId='.$cronofy_profile_id.' AND state=0;');
$id = $q->ids();

if(!$id){
    $dS_cronofy_inittask = new C_dS_cronofy_inittask();
    $dS_cronofy_inittask->groupId = $cronofy_access_id;
    $dS_cronofy_inittask->startDate = date('Y-m-d H:i:s');
    $dS_cronofy_inittask->refresh = $refresh;
    $dS_cronofy_inittask->dsSave();
}
//require 'initialized.php';
header('Location: initialized.php?k='.$dS_cronofy_access->keyId);
?>