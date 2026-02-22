<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// midnite.php
// created by bspoden
// called by /cron/midnite.php every night
////////////////////////////////////////////////////////////////////////////////////////////////


DebugLog('calling cronofy/midnite.php');
/////////////////////////////////////////////////////////////////////////////////////////////////
// PROCESSING 1 : revoke all cronofy calendars by cronofy_access (with cascade) if cronofy_access is older than 1 year)
// midnite can also be manually called from a browser with and cronofy_access id (param=id)
/////////////////////////////////////////////////////////////////////////////////////////////////
DebugLog('cronofy/midnite.processing 1 : revoking cronofy calendars...');

$accesskeysIds = Array();
if(isset($_GET['id']))
{
    $GLOBALS['ECHO_MODE'] = true;
    DebugLog('cronofy/midnite.calling midnite.php manually...');
    DebugLog('cronofy/midnite.input : accesskeysId='.$_GET['id']);
    $q = new Q('SELECT id FROM cronofy_accesses WHERE deletorId = 0 and id = '.$_GET['id'].' ORDER BY created;');
    $accesskeysIds = $q->ids(false);
    if (count($accesskeysIds)==0)
    {
        DebugLog('cronofy/midnite.error : accesskeysId does not exist or is not active anymore');
    }
}    
else
{
    /////////////////////////////////////////////////////////////////////////
    //for testing : replace interval 1 year by 0
    //for production : find all cronofy_access with ccreate date < 1 year
    
    //exclude keyid 57040 (Id du client = 2946) Giraud request
    //$q = new Q('SELECT id FROM cronofy_accesses WHERE deletorId = 0 and created < DATE_SUB(NOW(),INTERVAL 1 YEAR) ORDER BY created;');
    $q = new Q('SELECT id FROM cronofy_accesses WHERE deletorId = 0 and keyid not in (57040) and created < DATE_SUB(NOW(),INTERVAL 1 YEAR) ORDER BY created;');
    
    $accesskeysIds = $q->ids(false);
}

DebugLog('cronofy/midnite.count='.count($accesskeysIds));

if(count($accesskeysIds)>0)
{
    //loop in cronofy_access found
    foreach($accesskeysIds as $accesskeysId)
    {
        DebugLog('cronofy/midnite.revoke cronofy calendarid for cronofy_access_id : '.$accesskeysId);
        //revoke all cronofy calendars for this cronofy_access -----------------------------
        $dS_cronofy_manager_access = new C_cronofy_manager_access($accesskeysId);
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByGroupId($accesskeysId);
        $dS_cronofy_manager_access->RevokeCalendars($dbAccess_cronofy_calendars->keyed);

        //prepare mailing-------------------------------------------------------------------
        $sender = 'communication@mobminder.com';
        $recipient = $dS_cronofy_manager_access->dS_cronofy_profile_updater->cro_profile_name;
        $providername = $dS_cronofy_manager_access->dS_cronofy_profile_updater->cro_provider_name;
        $subject = str_replace('[providername]',$providername,'Connexion avec votre compte [providername]'); //TODO utiliser tranlsation
        $message = str_replace('[providername]',$providername,'La connexion entre Mobminder et votre compte [providername] a été rompue. Si vous souhaitez la rétablir, connectez-vous sur Mobminder, cliquez sur votre prénom et réexécutez la procédure de connexion (Lien avec Google, Apple ou Outlook)'); //TODO utiliser translation
        
        if(!cronofymidnitecalledbybrowser)
        {
            DebugLog('cronofy/midnite.sending e-mail...');
            DebugLog('not implemented yet!');
            $o_dataCom_mail = new C_dataCom_mail();
    		$o_dataCom_mail->sendMail($subject, $message, $recipient, $sender, language_code_english);
	    }
        else
        {
            DebugLog('cronofy/midnite.sending e-mail (simulation)...');
            DebugLog('sender'.$sender);
            DebugLog('recipient'.$recipient);
            DebugLog('subject'.$subject);
            DebugLog('message '.$message );
        }
    }
}
DebugLog('cronofy/midnite.end of process');
?>