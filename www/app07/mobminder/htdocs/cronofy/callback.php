<?php
//require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/cronofymanager.php';


//compare 2 cronofy events in function of deleted flag
//used for sorting cronofy events array
//created/updated events must be processed before deleted events
function cmp($a, $b)
{
    //DebugLog(json_encode($a));

    if ($a['deleted']==1)
    {
        if ($b['deleted']==1)
        {
            return 0;
        }
        else
        {
            return 1;
        }
    }
    else
    {
        if ($b['deleted']==1)
        {
            return -1;
        }
        else
        {
            return 0;
        }
    }
}

//remove utf-8 emoji and other symbols from a string
//used for cleaning summary and description fields from cronofy events
//before saving text into database
function RemoveEmoji($string) 
{
    // Match Emoticons
    $regex_emoticons = '/[\x{1F600}-\x{1F64F}]/u';
    $clear_string = preg_replace($regex_emoticons, '', $string);

    // Match Miscellaneous Symbols and Pictographs
    $regex_symbols = '/[\x{1F300}-\x{1F5FF}]/u';
    $clear_string = preg_replace($regex_symbols, '', $clear_string);

    // Match Transport And Map Symbols
    $regex_transport = '/[\x{1F680}-\x{1F6FF}]/u';
    $clear_string = preg_replace($regex_transport, '', $clear_string);

    // Match Miscellaneous Symbols
    $regex_misc = '/[\x{2600}-\x{26FF}]/u';
    $clear_string = preg_replace($regex_misc, '', $clear_string);

    // Match Dingbats
	$regex_dingbats = '/[\x{2700}-\x{27BF}]/u';
	$clear_string = preg_replace($regex_dingbats, '', $clear_string);
	
	$clear_string = str_replace('|','I',$clear_string);
	
	return $clear_string;
}

//-----------------------------------------------------------------------------------------------
// updated by bspoden
//
//how to parse summary and description fields ---------------------------------------------------
//case 0 : delete event uid or event id
//case 1 : create event uid : note = summary (emoji removed) + EOL + description (emoji removed) AND try to PARSE visitors from summary and description
//case 2 : update event uid : note = summary (emoji removed) + EOL + description (emoji and [] removed)
//case 3 : moving event  id : note = summary (emoji removed) only if no visitor + description (emoji and [] removed)
//case 4 : update evnet  id : note = summary (emoji removed) only if no visitor + description (emoji and [] removed)
//
//-----------------------------------------------------------------------------------------------

//cronofycallbackasync = true => callback page closes html stream as soon as parameters are retrieved 
//to avoid wasting time (because cronofy waits 5 sec before cancelling call)
//cronofycallbackasync is called below (ob_start) and before to close stream

if(cronofycallbackasync) ob_start(); // relates to (*ob1)

//ini_set("log_errors", 1);
//ini_set("error_log", "/path/to/php-error.log");
//DebugLog('start1');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//extract information from url and file content ----------------------------------------------
//cronofycallbackcalledbybrowser = true => used to simulate a call to callback from cronofy by using an internet browser
$data=null;
$cronofy_calendar_id=null;
if (!cronofycallbackcalledbybrowser) //production mode--------------
{
    $body = file_get_contents('php://input');

    //DebugLog('beforebody');
    DebugLog($body);
    //DebugLog('afterbody');

    $data = json_decode($body, true);
    //$text = ':'. '\n';
    $cronofy_calendar_id = $_GET['id']; // id of line in cronofy_calendar table
}
else //debug mode -------------------------------------------------
{
    
    $body = '{"notification":{"type":"change","changes_since":"2019-12-03T15:13:22Z"},"channel":{"channel_id":"chn_5de675f94217a500b64ad92f","callback_url":"https://d364c275.ngrok.io/cronofy/callback.php?id=400909","filters":{"calendar_ids":["cal_XYy1iiqicgBj@5Pt_FKDR3wfBgOmgPrf2WVBaOw"],"only_managed":false},"scheduling_conversations":{}}}';
    $data = json_decode($body, true);
    $cronofy_calendar_id='400909';
}
DebugLog('cronofy/callback.init');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// retrieve mobminder context
$dS_cronofy_calendar = new C_dS_cronofy_calendar($cronofy_calendar_id);
if($dS_cronofy_calendar->permission==0) // if elevated permission not true, do nothing
{
    die();
}
$dS_cronofy_access = new C_dS_cronofy_access($dS_cronofy_calendar->groupId);
$dS_cronofy_profile = new C_dS_cronofy_profile($dS_cronofy_access->groupId);
$dS_cronofy_user = new C_dS_cronofy_user($dS_cronofy_profile->groupId);
$keyId = $dS_cronofy_access->keyId;
$dS_accesskey = new C_dS_accesskey($keyId);
$loginId = $dS_accesskey->groupId;
$accountId = $dS_accesskey->accountId;
$dbAccess_resources = new C_dbAccess_resources($accountId);
$dS_login = new C_dS_login($loginId);
C_dbIO::logged($dS_login, '(cronofy)');
$dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accountId);
$dS_mobcronofy_current = new MobCronofy($accountId,$dS_cronofy_user->id);

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// retrieve cronofy data

//notification call information (date & type of call)
$keyvals = Array();
foreach($data['notification'] as $key => $val)
{
    $keyvals[$key]=$val;
}

DebugLog('cronofy/callback.start');

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// synchrone or asynchrone page mode ( close page or not)
if(cronofycallbackasync) // disabled when testing, so the next section can echo on the screen
{
    $fb = ob_get_contents(); $fl = strlen($fb); $filler = ''; if((4096-$fl)>0) $filler = str_repeat('1',4096-$fl);
    ob_end_clean(); // relates to (*ob1)
    ignore_user_abort(true); 
    set_time_limit(0); 
    header('Connection: close'); 
    header('Content-Type: text/plain');
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    echo $fb.$filler; // flush has no effect if the buffer is not 4k at least
    flush(); 
    DebugLog('cronofy/callback.closing page...');
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// process only change event (if type of call is 'change')
// $text=$text.'>> keyvals='.print_r($keyvals,true).'\n';
if(strcmp($keyvals['type'],'change')==0)
{ 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // revoke calendar if deleted by external/manual action------------------------------------------------
    $calendars = $dS_mobcronofy_current->GetCalendars();
    foreach($calendars as $calendar)
    {
        if($calendar['calendar_id']==$dS_cronofy_calendar->cro_calendar_id && $calendar['calendar_deleted'])
        {
            DebugLog('cronofy/callback.revoking deleted calendar');
            $dS_cronofy_manager_access = new C_cronofy_manager_access($dS_cronofy_access->id);
            $dS_cronofy_manager_access->RevokeCalendars(array($dS_cronofy_calendar));
            //die is mandatory to avoid removing all events from mobminder calendar!
            die();
        }
    }
    //------------------------------------------------------------------------------------------------------

    // Get updated/deleted/created events from calendar $cro_calendar_id from date $keyvals['changes_since']
    $datelastupdate=null;
    $datenewlastupdate = new C_date();
    //warning : margin of 1 seconde : more margin could generate duplicate delete event
    $datenewlastupdate->sIncrement(-1); 
    DebugLog('cronofy/callback.cro_calendar.lastsync = '.$dS_cronofy_calendar->last_sync);
    DebugLog('cronofy/callack.changes_since = '.$keyvals['changes_since']);
    if ($dS_cronofy_calendar->last_sync != '0000-00-00 00:00:00')
    {
        $date = new C_date($dS_cronofy_calendar->last_sync);
        //get string date with ISO 8601 Zulu format
        $datelastupdate = $date->get_GMTDateTime();
        DebugLog('cronofy/callback.input lastsync from cro_calendar = '.$datelastupdate);
    }
    else
    {
        $datelastupdate = $keyvals['changes_since'];
        DebugLog('cronofy/callback.input lastsync from callack response = '.$datelastupdate);
    }
        
    $tmpevents = $dS_mobcronofy_current->ReadUpdatedEvents(array($dS_cronofy_calendar->cro_calendar_id),$datelastupdate);
    $events = Array();
    //use a temporary array for sorting events by type (deleted or not
    //process must start with not deleted event and waits X seconds before processing deleted events
    foreach($tmpevents->each() as $event) // for each event
    { 
        array_push($events,$event);
    }
    //DebugLog('$tmpevents='.json_encode($events));
    if (!usort($events, 'cmp'))
    {
         DebugLog('####error in usort!!!');
    }
    else
    {
         DebugLog('####success in usort!!!');
    }

    //only first delete will wait X seconds (sleep)
    $flag_first_delete_done=false;

    foreach($events as $event) // for each event -------------------------------------------------------------------------
    { 
        DebugLog('####cronofy/callback.loop in event####');

        //process only not recurring event
        if(!$event['recurring'])
        {
            $event_uid=null;
            $event_id=null;
            $reservation_id=0;
            $attendee_id=0;
            $flagExternal=false;

            //$text = $text.print_r($event,true). '\n';
            //prepare current event identifiers----------------------------------------------------------------------------
            if (empty($event['event_id'])) // external event with EVENT_UID -----------------------------------------------
            {
                //$text = $text.'event_id not found (event_uid='.$event['event_id']')\n'
                $event_uid=$event['event_uid'];
                $event_id=null;
                $reservation_id=0;
                $attendee_id=0;
                $flagExternal=true;
            }
            else // internal event with EVENT_ID --------------------------------------------------------------------------
            {
                //$text = $text.'event_id found (event_id='.$event['event_id']. ')\n'
                $event_uid=null;
                $event_id=$event['event_id'];
                if (strpos($event_id,'_')==false)
                {
                    DebugLog('ERROR:cronofy/callback.reading event property : invalid (bad format) event_id='.$event_id);
                    continue;
                }
                $split=explode('_',$event_id);
                $reservation_id = $split[0];
                $attendee_id = $split[1];
                if(empty($reservation_id) || empty($attendee_id))
                {
                    DebugLog('ERROR:cronofy/callback.reading event property :invalid (bad format) event_id='.$event_id);
                    continue;
                }
                $flagExternal=false;
            }
            DebugLog('cronofy/callback.event_uid='.$event_uid);
            DebugLog('cronofy/callback.event_id='.$event_id);
            DebugLog('cronofy/callback.reservation_id='.$reservation_id);
            DebugLog('cronofy/callback.attendee_id='.$attendee_id);
            DebugLog('cronofy/callback.flagExternal='.($flagExternal?'true':'false'));

            if($event['deleted']==1)  // case 0 : ACTION=DELETE -----------------------------------------------------------
            {
                if (!$flag_first_delete_done)
                {
                    DebugLog('####cronofy/callback.delete.sleeping 5 sec...on crocal='.$dS_cronofy_calendar->cro_calendar_id);
                    sleep(5);
                    DebugLog('####cronofy/callback.delete.wakeup after 5 sec...on crocal='.$dS_cronofy_calendar->cro_calendar_id);
                    $flag_first_delete_done=true;
                }

                //$text = $text.'DELETE '.$event['event_id']. '\n';
                $dS_reservation=null;
                $dS_attendee=null;
                $dbAccess_attendees=null;
                if ($flagExternal) // sub ACTION=DELETE with EVENT_UID -------------------------------------------------
                {
                    DebugLog('cronofy/callback.delete.event_uid');
                    //find reservation by event_uid and calendar id ------------------------------------------------
                    $dS_reservation= C_dS_reservation::findByRemoteIdAndRemoteProfile($event_uid,$cronofy_calendar_id,$accountId);
                    $reservation_id=$dS_reservation->id;
                    if (empty($dS_reservation))
                    {
                        DebugLog('ERROR:cronofy/callback.delete external event : invalid (not found in database) event_uid='.$event_uid.', calendar_id'.$cronofy_calendar_id);
                        continue;
                    }
                    
                    //find all attendees for current reservation -------------------------------------------------
                    DebugLog('cronofy/callback.delete.event_uid.load all attendees');
                    $dbAccess_attendees = new C_dbAccess_attendees();
                    $dbAccess_attendees->loadOnGroup($reservation_id);
                    
                    DebugLog('cronofy/callback.delete.event_uid.load find current attendee,count='.$dbAccess_attendees->count());
                    foreach($dbAccess_attendees->keyed as $currentattendee)
                    {
                        //find the current attendee by resourceid from calendar
                        //because attendee_id cannot be found in event properties!
                        DebugLog('$currentattendee->resourceId='.$currentattendee->resourceId);
                        DebugLog('$dS_cronofy_calendar->resourceId='.$dS_cronofy_calendar->resourceId);
                        if($currentattendee->resourceId == $dS_cronofy_calendar->resourceId)
                        {
                            $dS_attendee=$currentattendee;
                            $attendee_id=$dS_attendee->id;
                            break;
                        }
                    }    
                    if (empty($dS_attendee))
                    {
                        DebugLog('ERROR:cronofy/callback.delete external event : linked attendee not found for event_uid='.$event_uid);
                        continue;
                    }
                }
                else // sub ACTION=DELETE with EVENT_ID -------------------------------------------
                {
                    DebugLog('cronofy/callback.delete.event_id');
                    //find reservation by reservation ID --------------------------------------
                    $dS_reservation = new C_dS_reservation($reservation_id);
                    
                    //find all attendees ------------------------------------------------------
                    $dbAccess_attendees = new C_dbAccess_attendees();
                    $dbAccess_attendees->loadOnGroup($reservation_id);
                    
                    //find attendee by attendid ID --------------------------------------------
                    $dS_attendee = new C_dS_attendee($attendee_id);
                   
                    //TODO : tester si l'attendee existe toujours en db, sinon ca plante dans le DeleteByAttendee
                    if ($dS_attendee->id==0)
                    {
                        //DebugLog('ERROR:cronofy/callback.delete external event : linked attendee not found for attendee_id='.$attendee_id);
                        DebugLog('cronofy/callback.delete.end (without delete because attendee does not exist anymore' );
                        continue;
                    }
                }
                
                // return to factorized code used by event uid And event id

                // DELETE IN CRONOFY ---------------------------------------------------------
                // Delete only for this attendee, excluding current calendar id (event is already deleted)
                $dS_cronofy_manager_reservation->DeleteByAttendee($dS_reservation,$dS_attendee,$cronofy_calendar_id);

                // DELETE IN MOBMINDER -------------------------------------------------------
                if ($dbAccess_attendees->count()==1)
                {  
                    //ACTION = if only one attendee, make reservation obsolete
                    DebugLog('cronofy/callback.delete.obsolete2');
                    
                    //never remove last attendee!!!
                    //new Q('delete from attendees where id='.$attendee_id.';'); // delete attendee on database

                    //reset remote id and remote profile if external event
                    if ($flagExternal) 
                    {
                        $dS_reservation->remoteid='1';
                        $dS_reservation->remoteProfile=0;
                    }
                    $dS_reservation->dSobsolete();
                }
                else //more than one attendee
                { 
                    //ACTION = if more than one attendee, delete only this attendee
                    
                    DebugLog('cronofy/callback.delete.delete current attendee');
                    //$text=$text.'many'.'\n';
                    new Q('delete from attendees where id='.$attendee_id.';'); // delete attendee on database
                    
                    //reset remote id and remote profile if external event
                    if ($flagExternal) 
                    {
                        DebugLog('cronofy/callback.delete.reset remote id and profile');
                    
                        $dS_reservation->remoteid='1';
                        $dS_reservation->remoteProfile=0;
                        $dS_reservation->save();
                    }

                }
                //$text = $text.'end DELETE '. '\n';
                DebugLog('cronofy/callback.delete.end');
            }
            else // ACTION=CREATE or UPDATE
            {
                DebugLog('####cronofy/callback.create/update...on crocal='.$dS_cronofy_calendar->cro_calendar_id);
              
                $resourceId = $dS_cronofy_calendar->resourceId;

                if ($flagExternal) // ACTION=CREATE OR UPDATE with EVENT_UID
                {
                    $dS_reservation= C_dS_reservation::findByRemoteIdAndRemoteProfile($event_uid,$cronofy_calendar_id,$accountId);
                    
                    if (empty($dS_reservation)) 
                    {
                        //------------------------------------------------------------
                        //disable moving on event uid because it cannot happen ! 
                        //moving a event uid create new event uid!
                        //------------------------------------------------------------
                        
                        // case 1 : ACTION=CREATE EVENT_UID ------------------------------------------------
                        
                        DebugLog('cronofy/callback.create.event_uid.start');

                        //$text = $text.'CREATE'.$event['event_id']. '\n';

                        // CREATE IN MOBMINDER ---------------------------------------------------------------------------
                    
                        // RESERVATION -------------------------------------
                        $dS_reservation = new C_dS_reservation();
                        $dS_reservation->cueIn = strtotime($event['start']);
                        $dS_reservation->cueOut = strtotime($event['end']);
                        $dS_reservation->remoteid = $event_uid;
                        $dS_reservation->remoteProfile = $cronofy_calendar_id;
                        
                        // VISITORS-----------------------------------------
                        $summary = RemoveEmoji($event['summary']);
                        $description = RemoveEmoji($event['description']);
                        
                        // NOTE---------------------------------------------
                        //save note and original description which contains only text from external event.
                        $dS_reservation->note= $summary.PHP_EOL.$description; 
                        DebugLog('cronofy/callback.note = '. $dS_reservation->note);
                        
                        $dS_reservation = $dS_reservation->dSsave($accountId);

                        //ATT_VISITORS -------------------------------------
                        $visitors = $dS_cronofy_manager_reservation->GetVisitors($summary,$description);
                        $att_visitors = new C_dbAccess_att_visitors();
                        foreach($visitors as $visitor)
                        { 
                            //deprecated because event creation (no update)
                            //$q = new Q('select id from att_visitors where groupId='.$reservation_id.' AND resourceId='.$visitor->id.' AND resourceType='.$resourceType.';');
                            //if(!$q->ids()){ // if not already attached, do add the visitor
                            $dS_attendee_vis = $att_visitors->newVirtual();
                            $dS_attendee_vis->resourceId = $visitor->id;
                            $dS_attendee_vis->resourceType = class_visitor;
                        }
                        $att_visitors->saveAll($dS_reservation->id);
                        
                        // ATTENDEES ----------------------------------------
                        $resourceId = $dS_cronofy_calendar->resourceId;
                        $resourceType = $dS_cronofy_manager_reservation->dbAccess_account_resources->keyed[$resourceId]->resourceType; // resource type for resourceId
                        $attendees = new C_dbAccess_attendees();
                        $dS_attendee = $attendees->newVirtual();
                        $dS_attendee->resourceId = $resourceId;
                        $dS_attendee->resourceType = $resourceType;
                        $dS_attendee->dSsave($dS_reservation->id);

                        // CREATE IN CRONOFY -----------------------------------------------------------------------------
                        
                        //update all cronofy events, except current external event 
                        $dS_cronofy_manager_reservation->UpsertForAttendees($dS_reservation,$cronofy_calendar_id);
                        //$text = $text.'CREATE finish'. '\n';
                        
                        DebugLog('cronofy/callback.create.event_uid.end');
                    }
                    else // case 2 : ACTION=UPDATE EVENTUID -------------------------------------------------------------------------
                    {
                        DebugLog('cronofy/callback.update.event_uid.start');
                        $reservation_id=$dS_reservation->id;
                        //$text = $text.'UPDATE='.$event['event_id']. '\n';

                        // UPDATE IN MOBMINDER ----------------------------------------------------------------------------
                        
                        // VISITORS ---------------------------------------
                        //new Q('delete from att_visitors where groupId = '.$reservation_id.';');
                        //$att_visitors=$dS_cronofy_manager_reservation->GetVisitors($reservation_id,$event['summary']);
                        //if(empty($att_visitors->keyed)){// If no visitor, insert summary in description. After, we select first line of description as summary

                        // NOTE--------------------------------------------
                        //save summary and description without bracket content (which contains visitors long label)
                        $summary = RemoveEmoji($event['summary']);
                        $cleaneddescription = preg_replace('/\[.*\]/', '', RemoveEmoji($event['description'])); // remove text between square bracket
                        $cleaneddescription = ltrim($cleaneddescription,PHP_EOL);

                        $dS_reservation->note= $summary.PHP_EOL.$cleaneddescription;
                        DebugLog('cronofy/callback.note = '. $dS_reservation->note);

                        $dS_reservation->cueIn = strtotime($event['start']);
                        $dS_reservation->cueOut = strtotime($event['end']);
                        
                        if($dS_reservation->deleted!=0)
                        {
                            $dS_reservation->deletorId=0;
                            $dS_reservation->deleted=0;
                        }
						
                        $dS_reservation->dSsave();

                        // UPDATE IN CRONOFY -----------------------------------------------------------------------------
                        //update all cronofy events except current external event
                        $dS_cronofy_manager_reservation->UpsertForAttendees($dS_reservation,$cronofy_calendar_id); //,$cronofy_calendar_id); 
                        //$text = $text.'UPDATE finish'. '\n';
                        DebugLog('cronofy/callback.update.event_uid.end');
                    }
                }
                else // ACTION=UPDATE (or MOVING) with EVENT_ID ---------------------------------------------------------
                {
                    // Test to know if it's an update or a moving
                    $q = new Q('SELECT id FROM attendees WHERE groupId='.$reservation_id.' AND resourceId='.$resourceId.';');
                    $attendee_exist = $q->ids();   

                    if(!$attendee_exist || (!!$attendee_exist && $attendee_exist!=$attendee_id)) 
                    //if attendee does not exist for this calendar =>
                    //or attendees exit and it's not the same id (moving on same calendar) =>
                    //then it's a moving
                    
                    // case 3 : ACTION=MOVING FROM PHONE -----------------------------------------------------------------
                    {   
                        //$text = $text.'MOVING='.$event['event_id']. '\n';
                        DebugLog('cronofy/callback.moving.general.start');
                        //DebugLog('summary='.$event['summary']);
                        //DebugLog('description='.$event['description']);

                        $resourceType = $dS_cronofy_manager_reservation->dbAccess_account_resources->keyed[$resourceId]->resourceType;
                        
                        ////////////////////////////////////////////////////////////////////////////////////////////////////
                        //DELETE DUPLICATE EVENT because attendee already exists
                        if(!!$attendee_exist)
                        {
                            // delete to not duplicate an event on same calendar when moving
                            DebugLog('remove duplicate event in moving');
                            //call low level delete event  because the event has been moved to this calendar.
                            //DeleteByAttendee will not work for this event (old cro_calendar_id in database)
                            $dS_mobcronofy_current->DeleteEvent($dS_cronofy_calendar->cro_calendar_id,$reservation_id,$attendee_id); 

                            //call also DeleteByAttendee for all other calendars linked to this ressource!
                            $oldS_attendee = new C_dS_attendee($attendee_id);
                            if ($oldS_attendee->id!=0)
                            {
                                $dS_cronofy_manager_reservation->DeleteByAttendee($dS_reservation,$oldS_attendee,null);
                            }

                            // DELETE OLD ATTENDEE IN DB-------------------------------
                            DebugLog('cronofy/callback.delete attendee in db : attendee id='.$attendee_id);
                            new Q('delete from attendees where id='.$attendee_id.';'); 

                        } 
                        else
                        {
                            // UPDATE IN MOBMINDER //////////////////////////////////////////////////////////////////////
                            $dS_reservation = new C_dS_reservation($reservation_id);

                            // NOTE--------------------------------------------
                            //save only description into note (summary is no more saved because it contains visitors short label)
                            //$summary = $event['summary'];
                            $cleaneddescription = preg_replace('/\[.*\]/', '', RemoveEmoji($event['description'])); // remove text between square bracket
                            $cleaneddescription = ltrim($cleaneddescription,PHP_EOL);
                            
                            //check if visitors exist for saving summary of not
                            $att_visitors = new C_dbAccess_att_visitors();
                            $att_visitors->loadOnGroup($reservation_id);
                            if (count($att_visitors->keyed)>0)
                            {
                                //DebugLog('cronofy/callback.visitors>0');
                                //summary cannot be saved because it contains read only visitors short label
                                //old summary has been stored in description
                                $dS_reservation->note= $cleaneddescription; 
                            }
                            else
                            {
                                //DebugLog('cronofy/callback.visitors=0');
                                //summary must be saved because it contains old summary
                                $summary = RemoveEmoji($event['summary']);
                                $dS_reservation->note= $summary.PHP_EOL.$cleaneddescription;
                            }
                            //DebugLog('cronofy/callback.note = '. $dS_reservation->note);
                            // FIN NOTE---------------------------------------------

                            $dS_reservation->cueIn = strtotime($event['start']);
                            $dS_reservation->cueOut = strtotime($event['end']);

                            //must be reactivated because could be disabled (obsolete) by the other callback.delete (// tasks)
                            //if($dS_reservation->deleted!=0)
                            //{
                            $dS_reservation->deletorId=0;
                            $dS_reservation->deleted=0;
                            //}
							
                            $dS_reservation->dSsave();

                            
                            // CRONOFY : DELETE REMOVED ATTENDEE-------------------------------------------------
                            //DebugLog('cronofy/callback.DeleteEvent attendee id='.$attendee_id);
                            //call low level delete event  because the event has been moved to this calendar.
                            //DeleteByAttendee will not work for this event (old cro_calendar_id in database)
                            $dS_mobcronofy_current->DeleteEvent($dS_cronofy_calendar->cro_calendar_id,$reservation_id,$attendee_id); 
                            
                            //call DeleteByAttendee for all other calendars linked to this ressource!
                            //DebugLog('cronofy/callback.DeleteByAttendee attendee id='.$attendee_id);
                            $oldS_attendee = new C_dS_attendee($attendee_id);
                            if ($oldS_attendee->id!=0)
                            {
                                $excludeCalendarId = $dS_cronofy_calendar->id;
                                $dS_cronofy_manager_reservation->DeleteByAttendee($dS_reservation,$oldS_attendee,$excludeCalendarId);
                            }
                            


                            // DELETE OLD ATTENDEE IN DB-------------------------------
                            DebugLog('cronofy/callback.delete attendee in db : attendee id='.$attendee_id);
                            new Q('delete from attendees where id='.$attendee_id.';'); 
                            
                            // CREATE NEW ATTENDEE IN DB-------------------------------
                            DebugLog('cronofy/callback.create new attendee in db for resourceid='.$resourceId);
                            $attendees = new C_dbAccess_attendees();
                            $newdS_attendee = $attendees->newVirtual();
                            $newdS_attendee->resourceId = $resourceId;
                            $newdS_attendee->resourceType = $resourceType;
                            $newdS_attendee->dSsave($reservation_id);

                            // CRONOFY : UPDATE (and insert) ALL ATTENDEE----------------------------------------
                            DebugLog('cronofy/callback.UpsertForAttendee');
                            //$dS_cronofy_manager_reservation->UpsertForAttendee($dS_reservation->magnify($dbAccess_resources),$newdS_attendee,null); // upsert new event only for the new attendee
                            $dS_cronofy_manager_reservation->UpsertForAttendees($dS_reservation,null);
                        }
                        DebugLog('cronofy/callback.moving.general.end');
                    }
                    else // case 4 : ACTION=UPDATE with EVENT_ID ----------------------------------------------------------------
                    { 
                        DebugLog('cronofy/callback.update.event_id.start');
                        DebugLog('summary='.$event['summary']);
                        DebugLog('description='.$event['description']);
                        //$text = $text.'UPDATE='.$event['event_id']. '\n';

                        //UPDATE IN MOBMINDER --------------------------------------------------------------------------
                        
                        // LOADING reservation ----------------------------------
                        $dS_reservation = new C_dS_reservation($reservation_id);

                        // VISITORS ---------------------------------------------
                        //new Q('delete from att_visitors where groupId = '.$reservation_id.';');
                        //$att_visitors=$dS_cronofy_manager_reservation->GetVisitors($reservation_id,$event['summary']);
                        
                        //if(empty($att_visitors->keyed)){// If no visitor, insert summary in description. After, we select first line of description as summary
                        //    $dS_reservation->note= $event['summary'].PHP_EOL.preg_replace('/\[.*\]/', '', $event['description']); // remove text between square bracket
                        //}else{
                        //$dS_reservation->note=preg_replace('/\[.*\]/', '', $event['description']);
                        //}

                        // NOTE-------------------------------------------------
                        //save only description into note (summary is no more saved because it contains visitors short label)
                        //$summary = $event['summary'];
                        $cleaneddescription = preg_replace('/\[.*\]/', '', RemoveEmoji($event['description'])); // remove text between square bracket
                        $cleaneddescription = ltrim($cleaneddescription,PHP_EOL);
                        
                        //check if visitors exist for saving summary of not
                        $att_visitors = new C_dbAccess_att_visitors();
                        $att_visitors->loadOnGroup($reservation_id);
                        if (count($att_visitors->keyed)>0)
                        {
                            DebugLog('cronofy/callback.visitors>0');
                            //summary cannot be saved because it contains read only visitors short label
                            //old summary has been stored in description
                            $dS_reservation->note= $cleaneddescription;
                        }
                        else
                        {
                            DebugLog('cronofy/callback.visitors=0');
                            //summary must be saved because it contains old summary
                            $summary = RemoveEmoji($event['summary']);
                            $dS_reservation->note= $summary.PHP_EOL.$cleaneddescription;
                        }

                        DebugLog('cronofy/callback.note = '. $dS_reservation->note);
                        // FIN NOTE---------------------------------------------

                        $dS_reservation->cueIn = strtotime($event['start']);
                        $dS_reservation->cueOut = strtotime($event['end']);
                        
                        if($dS_reservation->deleted!=0)
                        {
                            $dS_reservation->deletorId=0;
                            $dS_reservation->deleted=0;
                        }
						
                        $dS_reservation->dSsave();

                        // UPDATE IN CRONOFY -----------------------------------------------------------------------------
                        //update all cronofy events except current external event
                        $dS_cronofy_manager_reservation->UpsertForAttendees($dS_reservation,$cronofy_calendar_id); //,); 
                        //$text = $text.'UPDATE finish'. '\n';
                        DebugLog('cronofy/callback.update.event_id.end');
                    }
                }
            }
        }
    }
    DebugLog('cronofy/saving cro_calendar.lastsync = '.$datenewlastupdate->get_ISO8601_stamp());
    //save new last sync date for next callback
    $dS_cronofy_calendar->last_sync = $datenewlastupdate->get_ISO8601_stamp();
    $dS_cronofy_calendar->dSsave();
    //DebugLog($text);
} 
DebugLog('cronofy/callback.end');
?>
