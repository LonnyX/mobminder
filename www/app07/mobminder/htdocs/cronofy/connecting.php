<?php
///////////////////////////////////////////////////////////////////////////////////
// connecting.php
// Here, we create profile, calendars and channel and we ask the elevated permissions
//
//
//                              CRONOFY LINKING MAP
//
//  Step 1 : welcome.php
//  Step 2 : oauth.php
//  * Step 2-3 : link account
//  > Step 3 : connecting.php
//  Step 3-4 : elevated permissions
//  Step 4 : initialization.php
//  Step 4bis : minute.php
//  Step 5 : initialized.php
//
//
// Key: > location  /  * page who can call this page
// updated by bspoden
///////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Setup data loading	
//
$split = explode('_',$_GET['state']);
$keyId 	= $split[0];

$cronofy_user_id=false;
if(count($split)==2)
    $cronofy_user_id= $split[1];

// if click on 'I don't want link my account...'
if(isset($_GET['error']))
    header('Location: welcome.php?k='.$keyId.'&s=1');

if(!isset($keyId)) die('You have no access to this script <command>logoff</command>');

require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/cronofymanager.php';

$session = session_start();

$dS_accesskey = new C_dS_accesskey($keyId);
$loginId 	= $dS_accesskey->groupId;
$accountId 	= $dS_accesskey->accountId;
$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);
$dS_key = new C_dS_accesskey($keyId);
C_dbIO::$loggedName = $dS_login->firstname.' '.$dS_login->lastname;
C_dbIO::$loggedId = $dS_login->id;

/////////////////////////////////////
// CRONOFY INITIALIZATION
//

$cuid = !!$cronofy_user_id ? $cronofy_user_id : false;

$dS_MobCronofy = new MobCronofy($accountId,$cuid);

///////////////////////////////////////////////////////
// PROCESSING
//

try {
    $redirect_uri = $GLOBALS['DOMAIN'] . '/cronofy/connecting.php';

    // Get token
    try
    {
        $result = $dS_MobCronofy->RequestToken(array('code' => $_GET['code'], 'redirect_uri' => $redirect_uri));
    }
    catch(Exception $e)
    {
        echo 'an exception has been generated';
        echo $e->getMessage();
        echo $e->getTraceAsString();
        // if error -> replace all private method in cronofy librabry by protected
        // exit;
    }

    // Get profile
    if(isset($result['linking_profile']))
    {
        $linking_profile = $result['linking_profile'];
    }
    else
    {
        echo 'error! linking_profile not found';
        exit;
    }

    if(!!$cronofy_user_id){ // if mobminder account is already linked with cronofy
        $dS_cronofy_user = new C_dS_cronofy_user($cronofy_user_id);
        $dS_cronofy_user->cro_access_token=$dS_MobCronofy->cronofy->access_token;
        $dS_cronofy_user->cro_refresh_token=$dS_MobCronofy->cronofy->refresh_token;
        $dS_cronofy_user->dSsave();
        //manquait un R à la fin de $dS_MobCronofy->dS_cronofy_user_updater
        $dS_MobCronofy->dS_cronofy_user_updater = $dS_cronofy_user;
    }else{
        $cro_account_id = $dS_MobCronofy->GetUserInfo()['sub'];

        $dS_cronofy_user = new C_dS_cronofy_user();
        $dS_cronofy_user->groupId=$loginId;
        $dS_cronofy_user->cro_account_id=$cro_account_id;
        $dS_cronofy_user->cro_access_token=$dS_MobCronofy->cronofy->access_token;
        $dS_cronofy_user->cro_refresh_token=$dS_MobCronofy->cronofy->refresh_token;
        $cronofy_user_id = $dS_cronofy_user->dSsave()->id;
        //manquait un R à la fin de $dS_MobCronofy->dS_cronofy_user_updater
        $dS_MobCronofy->dS_cronofy_user_updater = $dS_cronofy_user;
    }

    // Create profile if it do not exists
    $q = new Q('SELECT id FROM cronofy_profile WHERE groupId='.$cronofy_user_id.' AND cro_profile_id="'.$linking_profile["profile_id"].'" AND deletorId=0;');
    $cronofy_profile_id = $q->ids();
    if(empty($cronofy_profile_id)){
        $dS_cronofy_profile = new C_dS_cronofy_profile();
        $dS_cronofy_profile->groupId = $cronofy_user_id;
        // $dS_cronofy_profile->keyId = $keyId;
        $dS_cronofy_profile->cro_profile_id = $linking_profile["profile_id"];
        $dS_cronofy_profile->cro_profile_name = $linking_profile["profile_name"];                
		$dS_cronofy_profile->cro_provider_name = $linking_profile["provider_name"];
        $cronofy_profile_id = $dS_cronofy_profile->dSsave()->id;
    }

    // Create access if it do not exists
    $q = new Q('SELECT id FROM cronofy_accesses WHERE groupId='.$cronofy_profile_id.' AND keyId='.$keyId.' AND deletorId=0;');
    $cronofy_access_id = $q->ids();
    if(empty($cronofy_access_id)){
        $dS_cronofy_access = new C_dS_cronofy_access();
        $dS_cronofy_access->groupId = $cronofy_profile_id;
        $dS_cronofy_access->keyId = $keyId;
        $cronofy_access_id = $dS_cronofy_access->dSsave()->id;
    }else{
        //already linked
        echo 'already linked on this account';
        exit;
    }

    ///
    /// CREATE CALENDAR ON PROFILE
    ///

    $dS_cronofy_manager_access = new C_cronofy_manager_access($cronofy_access_id);

    ini_set('max_execution_time', 180);

    // Calendars from DB
    $view_resources = new C_dbAccess_resources($accountId, $dS_accesskey); // resources as seen by the login's limited view

    foreach ($view_resources->keyed as $view){  
        $dS_cronofy_manager_access->CreateCalendarFromResource($view);
    }

    ///
    /// ASK ELEVATED PERMISSIONS
    ///

    $response=$dS_cronofy_manager_access->AskElevatedPermissions(false);

    header('Location: '.$response);

    exit;
} catch(CronofyException $ex) {
    echo $ex;
}

?>