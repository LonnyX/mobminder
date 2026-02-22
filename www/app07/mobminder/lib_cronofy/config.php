<?php

////////////////////
//updated by bspoden
////////////////////

//A. how to reset cronofy in test database:
//====================================
//delete from cronofy_accesses;
//delete from cronofy_calendar;
//delete from cronofy_inittasks;
//delete from cronofy_profile;
//delete from cronofy_user;

//B. remove all my cronofy links from production webapp

//C. clean all my agenda from google, outlook, etc

//D. configure ngrok on dev env.
//==============================
//1. run ngrok
//2. copy public ngrok url to $GLOBALS['DOMAIN']

define('cronofy_test', false);


//old version : require '/vendor/cronofy/cronofy.php';
require 'vendor/cronofyv015/cronofy.php';

define('cronofydebug', cronofy_test);           //true = debug log in all cronofy classes 
                                                //(production=FALSE)

define('cronofymidnitecalledbybrowser', cronofy_test);  //true = run midnite job from browser : log e-mail instead of sending 
                                                //(production=FALSE)

define('cronofycallbackasync', true);           //true = run (faster) callback page in asynchrone mode, without waiting end of process 
                                                //(production=TRUE)

define('cronofycallbackcalledbybrowser', false);//true = allow to run callback from browser : need of configure hardcoded inputs! 
                                                //(production=FALSE)

define('cronodevtest',cronofy_test);            //true = EventsInitialization calls localhost cronasync.php url! 
                                                //true = display login information at the top of the page (loginid,accountid,keyid)
                                                //(production=FALSE)

define('cronobatchbulk',true);                  //true = EventsInitialization calls bulk API (50 updates at same time) 

define('cronobatchbulkthread',true);            //true = if calls bulk API, run several threads (// run)

$GLOBALS['ECHO_MODE'] = false;                  //use echo instead of debug file for printing logs
                                                //default = false (except in midnite.php if manual mode)
                                                
if (cronofy_test)
{
    //(test=false)
    $GLOBALS['DATA_CENTER']=false; //'DE' for production ?  DE or UR?
}
else
{
    $GLOBALS['DATA_CENTER']='DE'; //'DE' for production ?  DE or UR?
}
    


if (empty($GLOBALS['DATA_CENTER']))
{
    //echo ('CRONOFY TEST');

    // tests account on US servers
    //DebugLog('cronofy/config.php.mode=development');
    //change ngrok dynamic url every 8 hours!
    $GLOBALS['DOMAIN'] = 'https://fc38-109-89-149-142.ngrok.io/be.mobminder.com'; // website domain MUST MATCH APPLICATION SETTINGS URL WEB SITE on https://app.cronofy.com/oauth/applications/
    
    //bspoden
    $GLOBALS['CRONOFY_CLIENT_ID'] = 'G9L0iZ2gWrXSBz-49s72Mlq9gzqdIDiI'; // client id given by cronofy
    $GLOBALS['CRONOFY_CLIENT_SECRET'] = 'cyXkfD2v5_GCIVjxefNkmMcKLINkK6SG-Syq3UOM_moNneLNigWVEtcxY62RdwQRhMCRgAdblsSPJ_JkNJc7wA'; //client secret given by cronofy
    
    //old test user
    //$GLOBALS['CRONOFY_CLIENT_ID'] = "IP4ckWzBSLAZBqSEt5OIrQCZA26lVLWt"; // client id given by cronofy
    //$GLOBALS['CRONOFY_CLIENT_SECRET'] = "c4y4pUw9vrLVpg91s2sV1YfhWAY6zwUagdlnt-boNnCBq8dXtRJYBCqKVy1epDrtQZWEXcc4BrTwEhAuj4VT8g"; //client secret given by cronofy
} 
else 
{ 
    // production German servers
    //DebugLog('cronofy/config.php.mode=production');
    $GLOBALS['CRONOFY_CLIENT_ID'] = '9SKXz021ttW1dH4uLb37xuwCvX-HkN5k'; // client id given by cronofy
    $GLOBALS['CRONOFY_CLIENT_SECRET'] = '2IH6w2uQTfy4_dWBhZPSpbTOfGepxVNBsz79XQEwtCl_b61cy8tfJbPStpoxSTB_gJNwYet8mfe081GLgyGriA'; //client secret given by cronofy
    $GLOBALS['DOMAIN'] = 'https://be.mobminder.com'; // website domain MUST MATCH APPLICATION SETTINGS URL WEB SITE at https://app-de.cronofy.com/oauth/applications/
}

function DebugLog($log)
{
    if ($GLOBALS['ECHO_MODE']==true)
    {
        $time = @date('[d/M/Y:H:i:s]');
        echo $time.' - '.$log.'<br/>';
    }
    if(cronofydebug)
    {
        $time = @date('[d/M/Y:H:i:s]');
        $result = file_put_contents(__DIR__ . '/log/debug.log',$time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
    }
}
function startsWith($haystack, $needle)
{
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}
?>