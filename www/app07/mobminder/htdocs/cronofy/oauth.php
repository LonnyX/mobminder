<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// oauth.php
// Here, we request an authorization url in order to connect at an external account.
//
// Documentation : https://www.cronofy.com/developers/api/#authorization (Authorization -> Requesting Authorization)
//
//
//                              CRONOFY LINKING MAP
//
//  * Step 1 : welcome.php
//  > Step 2 : oauth.php
//  Step 2-3 : link account
//  Step 3 : connecting.php
//  Step 3-4 : elevated permissions
//  Step 4 : initialization.php
//  Step 4bis : minute.php
//  Step 5 : initialized.php
//
//
// Key: > location  /  * page who can call this page
// updated by bspoden
///////////////////////////////////////////////////////////////////////////////////


require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/mobcronofy.php';

$session = session_start();

/////////////////////////////////////
// GET PARAMETERS
//
$keyId = @$_GET['k'];
$cronofy_user_id = @$_GET['u'];

//Verify if cronofy user is deleted
if(!!$cronofy_user_id) //condition was missing! SQL error occured when cronofy_user_id is empty!
{ 
    $q = new Q("SELECT id FROM cronofy_user WHERE id=".$cronofy_user_id." AND deletorId=0;");
    $cronofy_user_id = $q->ids();
}

/////////////////////////////////////
// DATA INITIALIZATION
//
$dS_accesskey = new C_dS_accesskey($keyId);

$loginIdFromSession = $_SESSION['loginId'];
if ($loginIdFromSession != $dS_accesskey->groupId) die('Wrong Access key (2) <command>logoff</command>');

$loginId = $dS_accesskey->groupId;
$accountId = $dS_accesskey->accountId;
$dS_login = new C_dS_login($loginId);
$dS_account = new C_dS_group($accountId);

if($dS_accesskey->groupId != $dS_login->id) die('Access key does not match login <command>logoff</command>');
if($dS_accesskey->accountId != $dS_account->id) die('Access key does not match account <command>logoff</command>');

C_dbIO::$loggedName = $dS_login->firstname.' '.$dS_login->lastname;
C_dbIO::$loggedId = $dS_login->id;

/////////////////////////////////////
// CRONOFY INITIALIZATION
//
$cuid = !!$cronofy_user_id ? $cronofy_user_id : false;

$dS_MobCronofy = new MobCronofy($accountId,$cuid);

/////////////////////////////////////
// PROCESSING
//

// Make uri to redirect user to next step 
$existinguser = '';
if(!!$cronofy_user_id) 
    $existinguser = '_'.$cronofy_user_id;

$redirect_uri = $GLOBALS['DOMAIN'] . '/cronofy/connecting.php';

// Create params array for request
// TODO BSP disabler avoidlinking!
$params = array(
    'redirect_uri' => $redirect_uri,
    'state' => $keyId.$existinguser,
    'scope' => array('read_account','create_calendar','list_calendars','read_events','create_event','delete_event','read_free_busy','change_participation_status'),
    'avoid_linking' => 'true',
);

if(!!$cronofy_user_id){ 
    //if cronofy_user (at least one mobminder user made a synchro with an external account) exists, 
    //get link token to link with this user
    $params['link_token']=$dS_MobCronofy->GetLinkToken()['link_token'];
}

try{
    // Do request : ask authorization url
    $authorizationUrl = $dS_MobCronofy->GetAuthorizationURL($params);
}catch(Exception $e){
    // Refresh if error
    if($ex->getCode() == 401){
        $dS_MobCronofy->RefreshToken();
        $authorizationUrl = $dS_MobCronofy->GetAuthorizationURL($params);
    }
}

// Open step 2-3
header('Location: '.$authorizationUrl);
?>