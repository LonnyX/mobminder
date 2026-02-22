<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// minute.php
// Page called by /cron/minute.php every minute in order to create events for a profile


/////////////////////////////////////
// PROCESSING
//
DebugLog('minute.php.start');

$q = new Q('SELECT id FROM cronofy_inittasks WHERE state=1;');
$syncing = $q->ids();
if(!$syncing) // if nothing is syncing (<=> state = 1)
{
    // select oldest waiting inittask (<=> state = 0 and oldest startDate)
    $q = new Q('SELECT id FROM cronofy_inittasks WHERE state=0 ORDER BY startDate ASC LIMIT 1;');
    $id = $q->ids();
    if(!!$id)
    {
        // START SYNCING ----------------------------------------------
        DebugLog('minute.php.executing...init task id='.$id);
        $dS_cronofy_initsync = new C_dS_cronofy_inittask($id);
        $dS_cronofy_initsync->state = 1; // set state at 1 (<=> syncing)
        $dS_cronofy_initsync->dSsave();

        // INITIALIZE EVENTS -------------------------------------------
        $cronofy_access_id=$dS_cronofy_initsync->groupId; 
        $dS_cronofy_manager = new C_cronofy_manager_access($cronofy_access_id);

        if (!cronobatchbulk)
        {
            $dS_cronofy_manager->EventsInitialization(); //old param ? $dS_cronofy_initsync->refresh
        }
        else
        {
            $dS_cronofy_manager->EventsInitializationBulk();
        }

        // END SYNCING -------------------------------------------------
        $dS_cronofy_initsync = new C_dS_cronofy_inittask($id);
        $dS_cronofy_initsync->endDate = date('Y-m-d H:i:s');
        $dS_cronofy_initsync->state = 2; // set state at 2 (<=> complete)
        $dS_cronofy_initsync->dSsave();
    }
}

DebugLog('minute.php.end');
?>