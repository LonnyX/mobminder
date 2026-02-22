<?php
////////////////////////////////////////////////////////////////////////////////////////////////
// halfs.php
// created by bspoden
// called by /cron/halfs.php every hour.30
////////////////////////////////////////////////////////////////////////////////////////////////

DebugLog('calling cronofy/halfs.php');


/////////////////////////////////////////////////////////////////////////////////////////////////
// PROCESSING 1 : convert all event uid to event id one hour after creation
/////////////////////////////////////////////////////////////////////////////////////////////////
DebugLog('cronofy/halfs.processing 2 : converting event uid in event id...');
//for immediate testing : $q = new Q('SELECT id FROM reservations WHERE deletorId = 0 and remoteProfile <> 0 ORDER BY id;');

//find all RV with created date < 1 hour
$q = new Q('SELECT id FROM reservations WHERE deletorId = 0 and remoteProfile <> 0 and created < DATE_SUB(NOW(),INTERVAL 1 HOUR) ORDER BY id;');
$reservationIds = $q->ids(false);

DebugLog('cronofy/halfs.count='.count($reservationIds));
if (count($reservationIds)>0)
{
    //loop in all RV found
    foreach($reservationIds as $reservationId)
    {
        DebugLog('cronofy/halfs.loop reservationId = '.$reservationId);
        $dS_resa = new C_dS_reservation($reservationId);
        $current_account_id = $dS_resa->groupId;
        $dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($current_account_id);

        //find cronofy calendar------------------------
        $cronofy_calendar_id = $dS_resa->remoteProfile;
        $dS_cronofy_calendar = new C_dS_cronofy_calendar($cronofy_calendar_id);

        //find all attendees----------------------------
        $dbAccess_attendees = new C_dbAccess_attendees();
        $dbAccess_attendees->loadOnGroup($reservationId);
        
        //DebugLog('find current attendee,count='.$dbAccess_attendees->count());
        $dS_attendee=null;
        foreach($dbAccess_attendees->keyed as $currentattendee)
        {
            //find attendee by resourceid from calendar
            //DebugLog('$currentattendee->resourceId='.$currentattendee->resourceId);
            //DebugLog('$dS_cronofy_calendar->resourceId='.$dS_cronofy_calendar->resourceId);
            if($currentattendee->resourceId == $dS_cronofy_calendar->resourceId)
            {
                $dS_attendee=$currentattendee;
                break;
            }
        }    
        if (!empty($dS_attendee)) //empty never happened!
        {
            //delete cronofy event for this attendee
            DebugLog('cronofy/halfs.attendee found : calling cronofymanager.DeleteByAttendee');
            //$dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$attendees_deleted);
            $dS_cronofy_manager_reservation->DeleteByAttendee($dS_resa,$dS_attendee,null);
        }
        else
        {
            DebugLog('cronofy/halfs.attendee not found!');
        }

        //reset remote id and profile, if eventuid existed in past, it has been deleted!
        //remote id forced to '1' to remember that it was an external event uid!
        $dS_resa->remoteid = '1';
        $dS_resa->remoteProfile = 0;
        $dS_resa = $dS_resa->dSsave();
        

        //update all, (and create new RV with event id instead of event uid)
         DebugLog('cronofy/halfs.calling cronofymanager.UpsertForAttendees');
        $dS_cronofy_manager_reservation->UpsertForAttendees($dS_resa,null);

    }
}

DebugLog('cronofy/halfs.end of process');
//echo 'terminated';
?>