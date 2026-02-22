<?php
require 'mobcronofy.php';

////////////////////////////////////////////////////////////////////////////////////////////////
//
// cronofymanager.php
//
// This page hosts the cronofy manager object which is used to manage events syncing when 
// there are callbacks from cronofy, updates from mobminder or to initialize events
//
// Documentation : https://www.cronofy.com/developers/api/#authorization (Authorization -> Requesting Authorization)
// updated by bspoden


////////////////////////////////////////////////////////////////////////////////////////////////
//
// This class handles the credentials and accesses 
//
// it is used in
//  	/cronofy/callback.php
// 		/cronofy/connecting.php
// 		/cronofy/crohelper.php
// 		/cronofy/midnite.php
// 		/cronofy/minute.php
// 		/cronofy/refresh.php
// 		/cronofy/revoke.php
//
class C_cronofy_manager_access //extends MobCronofy 
{
    public $dS_cronofy_access_updater;
    public $dS_cronofy_profile_updater;
    public $dS_accesskey;
    public $dbAccess_account_resources;
    public $customCss_to_color;
    //removed : public $dbAccess_cronofy_calendars;

    public function __construct($cronofy_access_id)
    { 
        // load C_dS_cronofy_access --------------------
        $this->dS_cronofy_access_updater = new C_dS_cronofy_access($cronofy_access_id);

        // load C_dS_cronofy_profile -------------------
        $cronofy_profile_id = $this->dS_cronofy_access_updater->groupId;
        $this->dS_cronofy_profile_updater = new C_dS_cronofy_profile($cronofy_profile_id);

        // Linked cronofy user
        //$cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        //$this->dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();

        // load accesskey ------------------------------
        $keyId = $this->dS_cronofy_access_updater->keyId;
        $this->dS_accesskey = new C_dS_accesskey($keyId); // updater acceskey
        
        // load resources ------------------------------
        $accountId = $this->dS_accesskey->accountId; // updater accountId
        $this->dbAccess_account_resources = new C_dbAccess_resources($accountId);    

        // load hexa colors list from Mobminder ---------
        $this->customCss_to_color = new C_cssNameToHexaColor($accountId);
        
        // Update info for database --------------------
        $loginId = $this->dS_accesskey->groupId;
        $dS_login = new C_dS_login($loginId);
        C_dbIO::$loggedName = $dS_login->firstname.' '.$dS_login->lastname;
        
        if ($dS_login->id!=0)
            C_dbIO::$loggedId = $dS_login->id;
        else
            C_dbIO::$loggedId = 1; //23/03/2020 : corrected by bsp, happens when cronofy_access.keyid does not exist anymore in accesskeys!


        //$dS_account = new C_dS_group($accountId);
        //parent::__construct($accountId,$cronofy_user_id);
    }
    public function GetCalendars()
    {
        //prepare local parameters ----------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;

        //create mobcronofy -------------------------------
        $dS_mob_cronofy = new MobCronofy($accountId,$cronofy_user_id);

        //get all cronofy calendars -----------------------
        return $dS_mob_cronofy->GetCalendars();
    }

    // create a cronofy calendar for a given resource
    public function CreateCalendarFromResource($resource)
    {
        //prepare local parameters ----------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        $cro_profile_id=$this->dS_cronofy_profile_updater->cro_profile_id;
        $cronofy_access_id=$this->dS_cronofy_access_updater->id;
        $resourcename = 'mob_'.$resource->name;
        //$resourcename = $resource->name;
        
        //create mobcronofy -------------------------------
        $dS_mob_cronofy = new MobCronofy($accountId,$cronofy_user_id);

        //get all cronofy calendars -----------------------
        $calendars = $dS_mob_cronofy->GetCalendars();
        $existing_calendars = array();
        foreach($calendars as $c)
        {
            if($c['provider_name']==$this->dS_cronofy_profile_updater->cro_provider_name
               && $c['profile_id']==$this->dS_cronofy_profile_updater->cro_profile_id
               && startsWith($c['calendar_name'],$resourcename)
               && $c['calendar_deleted']==false)
            {
                $existing_calendars[]=$c['calendar_name'];
            }
        }

        $num = 0;
        foreach($existing_calendars as $ec)
        {
            $split = explode('_',$ec);
            if(count($split)==3)
            {
                if(is_numeric($split[2]))
                {
                    if($split[2]>$num)
                        $num=$split[2];
                }
            }
            else
            {
                $num=1;
            }
        }     

        $name= $num>0 ? $resourcename.'_'.++$num : $resourcename;
		$hxcolor = $this->customCss_to_color->matchCssName($resource->color);
        
        //create calendar ------------------------------------
        $calendar = $dS_mob_cronofy->CreateCalendar($cro_profile_id, $name, $hxcolor);
        if(!($calendar instanceof Exception))
        {
            // create link in database between calendars- ----
            $dS_cronofy_calendar = new C_dS_cronofy_calendar();
            $dS_cronofy_calendar->groupId=$cronofy_access_id;
            $dS_cronofy_calendar->resourceId=$resource->id;
            $dS_cronofy_calendar->cro_calendar_id=$calendar['calendar']['calendar_id'];
            $cronofy_calendar_id = $dS_cronofy_calendar->dSsave()->id;

            //create cronofy channel -------------------------
            $channel = $dS_mob_cronofy->CreateChannel($calendar['calendar']['calendar_id'],$cronofy_calendar_id);

            if(!($channel instanceof Exception))
            {  
                $dS_cronofy_calendar->cro_channel_id=$channel['channel']['channel_id'];
                $dS_cronofy_calendar->initStatus = 1;
                $dS_cronofy_calendar->dSsave();
            }
            return true;
        }
        return false;
    }

    /*
        Ask evelated permissions to cronofy
        param refresh : boolean to know if the function is called when we do a refresh or an initialization
        *You can't call this function if you use CreateByCronofyUser function to create this object
    */
    public function AskElevatedPermissions($refresh)
    {
        //prepare local parameters ----------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        $cronofy_access_id=$this->dS_cronofy_access_updater->id;
        
        //create mobcronofy -------------------------------
        $dS_mob_cronofy = new MobCronofy($accountId,$cronofy_user_id);

        //load calendars -----------------------------------
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByGroupId($cronofy_access_id);

        //prepare elevate permissions parameters ----------
        $arr_values = array();
        foreach ($dbAccess_cronofy_calendars->keyed as $dS_cronofy_calendar)
        {
            array_push($arr_values, array(
                'calendar_id' => $dS_cronofy_calendar->cro_calendar_id,
                'permission_level' => 'unrestricted'
            ));
        }

        $params = array(
            'permissions' => $arr_values,
            'redirect_uri' => $GLOBALS['DOMAIN'] . '/cronofy/initialization.php?a='.$cronofy_access_id.'&r='.$refresh
        );

        //call elevatepermission -------------------------
        $response= $dS_mob_cronofy->ElevatePermissions($params);

        return $response['permissions_request']['url'];
    }

    /*
        Initialize events for a profile (create all events)
        Creation of events in parallel
        *You can't call this function if you use CreateByCronofyUser function to create this object
    */
    public function EventsInitialization() //old param ? $refresh
    {
        DebugLog('cronofy_manager_access.EventsInitialization.start');
        
        //prepare local parametres ---------------------------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        $cronofy_access_id=$this->dS_cronofy_access_updater->id;
        ini_set('max_execution_time', 500);
        $nb_parallel_call = 7;
        $x=0;
        $c=0;

        // Get calendars from database for this profile ------------------
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByGroupId($cronofy_access_id);

        foreach($dbAccess_cronofy_calendars->keyed as $cronofy_calendar)
        {
            DebugLog('cronofy_manager_access.EventsInitialization.calendarid='.$cronofy_calendar->id.' and resourceid='.$cronofy_calendar->resourceId);
            //Get event from Mobminder
            $dbAccess_reservations = new C_dbAccess_reservations();

            $dbAccess_reservations->load4iCal($accountId, $cronofy_calendar->resourceId);
            $i=0;

            /////////////////////////////////////
            // Load reservation in parallel
            // Be careful -> Cronofy max 500 event posted on 1min
            foreach ($dbAccess_reservations->keyed as $reservation)
            {  
                DebugLog('cronofy_manager_access.EventsInitialization.reservationid='.$reservation->id);
           
                $reservation->magnify($this->dbAccess_account_resources,true);

                $q = new Q('SELECT id FROM attendees WHERE groupId='.$reservation->id.' AND resourceId='.$cronofy_calendar->resourceId.';');
                $attendee_id = $q->ids();
                $hexacolor = $this->customCss_to_color->getHexaColor($reservation);

                //externalid = event uid stored in $reservation->remoteid (if event uid)
                //externalid = null if event is en event ID
                //$reservation->remoteProfile contains linked cronofy calendar id
                $externalid=null;
                
                //formerlyexternal = true if event was an event UID before
                //if $reservation->remoteid is not empty (cronofy calendar is or value '1') then formerlyexternal = > true
                //if $reservation->remoteid is empty then formerlyexternal = false
                $formerlyexternal=false;
                        
                if ($reservation->remoteProfile == $cronofy_calendar->id)
                {
                    $externalid=$reservation->remoteid;
                    $formerlyexternal=false;
                }
                else
                {
                    $externalid=null;
                    $formerlyexternal=(!empty($reservation->remoteid));
                }

                //TODO BSP = on ne traite que les event id et pas les event uid 
                //car il ne devrait plus y en avoir (grace au halfs.php)
                if (empty($externalid))
                {
                    $params = array(
                        'cronofy_user_id' => $cronofy_user_id,
                        // 'access_token' => $this->access_token,
                        // 'refresh_token' => $this->refresh_token,
                        'calendar_id' => $cronofy_calendar->cro_calendar_id,
                        'reservationid' => $reservation->id,
                        'attendeeid' => $attendee_id,
                        'visitors' => $reservation->visitors->keyed,
                        'description' => $reservation->note,
                        'start' => $reservation->cueIn,
                        'end' => $reservation->cueOut,
                        'color'=> $hexacolor,
                        'accountId' => $accountId,
                        'c' => $c,
                        'x' => $x++,
                        'externalid' => $externalid,
                        'formerlyexternal' => $formerlyexternal
                    );

                    $curl = curl_init();
                    ///// you need to pass accountId
                    
                    if (cronodevtest)
                    {
                        DebugLog('cronofy_manager_access.EventsInitialization.loop (test) in calendar='.$cronofy_calendar->cro_calendar_id.'and reservation='.$reservation->id);
                    
                        curl_setopt($curl, CURLOPT_URL, 'http://localhost:80/cronofy/cronasync.php');  // for local testing see (*curl 01*)
                        //curl_setopt($curl, CURLOPT_URL, 'http://localhost/mobminder/cronofy/cronasync.php');  // for local testing see (*curl 01*)
                    }
                    else
                    {
                        DebugLog('cronofy_manager_access.EventsInitialization.loop (prod) in calendar='.$cronofy_calendar->cro_calendar_id.'and reservation='.$reservation->id);
                    
                        curl_setopt($curl, CURLOPT_URL, 'https://be.mobminder.com/cronofy/cronasync.php');
                    }
                    
                    curl_setopt($curl, CURLOPT_POST, 1);
                    curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($params));
                    curl_setopt($curl, CURLOPT_VERBOSE, false);
                    curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
                    curl_setopt($curl, CURLOPT_TIMEOUT_MS, 20);

                    curl_exec($curl);
                    curl_close($curl);

                    if($c++>$nb_parallel_call-2)
                    {
                        $c=0;
                        sleep(1);
                    }
                    $i++;
                }
            }

            // Init status end for calendar
            $cronofy_calendar->initStatus=2;
            $cronofy_calendar->dSsave();
        }
        DebugLog('cronofy_manager_access.EventsInitialization.end');
    }
    public function EventsInitializationBulk()
    {
        DebugLog('cronofy_manager_access.EventsInitializationBulk.start');
        
        //prepare local parametres ---------------------------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        $cronofy_access_id=$this->dS_cronofy_access_updater->id;
        ini_set('max_execution_time', 600);

        // Get calendars from database for this profile ------------------
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByGroupId($cronofy_access_id);

        DebugLog('cronofy_manager_access.EventsInitializationBulk - accountId='.$accountId);
        DebugLog('cronofy_manager_access.EventsInitializationBulk - cronofy_user_id='.$cronofy_user_id);

        $dS_MobCronofy = new MobCronofy($accountId,$cronofy_user_id);

        $events = Array();
        $id=0;
        $counter=0;
        foreach($dbAccess_cronofy_calendars->keyed as $cronofy_calendar)
        {
            DebugLog('cronofy_manager_access.EventsInitializationBulk.calendarid='.$cronofy_calendar->id.' and resourceid='.$cronofy_calendar->resourceId);
            //Get event from Mobminder
            $dbAccess_reservations = new C_dbAccess_reservations();

            $dbAccess_reservations->load4iCal($accountId, $cronofy_calendar->resourceId);
            //$i=0;

            /////////////////////////////////////
            // Load reservation in parallel
            // Be careful -> Cronofy max 500 event posted on 1min
            foreach ($dbAccess_reservations->keyed as $reservation)
            {  
                //DebugLog('cronofy_manager_access.EventsInitializationBulk.reservationid='.$reservation->id);
           
                $reservation->magnify($this->dbAccess_account_resources,true);

                $q = new Q('SELECT id FROM attendees WHERE groupId='.$reservation->id.' AND resourceId='.$cronofy_calendar->resourceId.';');
                $attendee_id = $q->ids();
                $hexacolor = $this->customCss_to_color->getHexaColor($reservation);

                //externalid = event uid stored in $reservation->remoteid (if event uid)
                //externalid = null if event is en event ID
                //$reservation->remoteProfile contains linked cronofy calendar id
                $externalid=null;
                
                //formerlyexternal = true if event was an event UID before
                //if $reservation->remoteid is not empty (cronofy calendar is or value '1') then formerlyexternal = > true
                //if $reservation->remoteid is empty then formerlyexternal = false
                $formerlyexternal=false;
                        
                if ($reservation->remoteProfile == $cronofy_calendar->id)
                {
                    $externalid=$reservation->remoteid;
                    $formerlyexternal=false;
                }
                else
                {
                    $externalid=null;
                    $formerlyexternal=(!empty($reservation->remoteid));
                }

                //do not process event uid
                //they should not exist (see halfs.php)
                if (!empty($externalid)) continue;

                $event = PrepareEventStructure(
                    $cronofy_calendar->cro_calendar_id,
                    $reservation->id,
                    $attendee_id,
                    $reservation->visitors->keyed,
                    $reservation->note,
                    $reservation->cueIn,
                    $reservation->cueOut,
                    $hexacolor,
                    $externalid,
                    $formerlyexternal
                );

                $counter++;

                array_push($events,$event);
                
                if (count($events)==50)
                {
                    if (!cronobatchbulkthread)
                    {
                        DebugLog('cronofy_manager_access.EventsInitializationBulk sending 50 events...');
                            
                        $ret = $dS_MobCronofy->CallBatch($events);
                        if($ret instanceof Exception)      
                        {   
                            $message = $ret instanceof CronofyException ? $ret->error_details() : ' ';
                            //$msg = "batch error : reservationid=" . $reservation->id. " ,attendeeid=" . $attendee_id." ,externalid=" . $externalid." => ERROR: exception code=" . $ret->getCode() .' ,exception message='. $ret->getMessage() .' '.$message;
                            $msg = 'batch => ERROR: exception code=' . $ret->getCode() .' ,exception message='. $ret->getMessage() .' '.$message;
                            DebugLog($msg);
                            //die();
                        }
                        else
                        {
                            //$msg = "batch success : reservationid=" . $reservation->id. " ,attendeeid=" . $attendee_id." ,externalid=" . $externalid." => SUCCESS";
                            $msg = 'batch => SUCCESS';
                            DebugLog($msg);
                        }
                        sleep(1);
                    }
                    else //multi thread---------------------------------
                    {
                        $data = array(
                            'id' => $id,
                            'accountId' => $accountId,
                            'cronofy_user_id' => $cronofy_user_id,
                            'events' => $events,
                        );
                        //calls utf8ize else json_encode fails!
                        $data = utf8ize($data);

                        $curl = curl_init();
                        if(cronodevtest)
                        {
                            DebugLog('cronofy_manager_access.EventsInitializationBulk.loop (test) id='.$id);
                            //curl_setopt($curl, CURLOPT_URL, 'http://localhost:80/cronofy/bulkasync.php');  // for local testing see (*curl 01*)
                            curl_setopt($curl, CURLOPT_URL, 'http://192.168.0.37/be.mobminder.com/cronofy/bulkasync.php');  // for local testing see (*curl 01*)
                            //curl_setopt($curl, CURLOPT_URL, 'http://localhost/mobminder/cronofy/cronasync.php');  // for local testing see (*curl 01*)
                        }
                        else
                        {
                            DebugLog('cronofy_manager_access.EventsInitializationBulk.loop (prod)');
                            curl_setopt($curl, CURLOPT_URL, 'https://be.mobminder.com/cronofy/bulkasync.php');
                        }
                        
                        curl_setopt($curl, CURLOPT_POST, 1);
                        curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
                        //DebugLog("body to send=".json_encode($data));
                        curl_setopt($curl, CURLOPT_VERBOSE, false);
                        curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
                        curl_setopt($curl, CURLOPT_TIMEOUT_MS, 100);
                        curl_exec($curl);
                        curl_close($curl);
                        sleep(1);
                    }
                    $events = Array();
                    $id++;
                    //TODO  //break;
                }
            }

            // Init status end for calendar
            $cronofy_calendar->initStatus=2;
            $cronofy_calendar->dSsave();
        }
        if (count($events)>0)
        {
            if (!cronobatchbulkthread)
            {
                DebugLog('sending '.count($events).' events...');
                $ret = $dS_MobCronofy->CallBatch($events);
                if($ret instanceof Exception)      
                {   
                    $message = $ret instanceof CronofyException ? $ret->error_details() : ' ';
                    $msg = 'batch => ERROR: exception code=' . $ret->getCode() .' ,exception message='. $ret->getMessage() .' '.$message;
                    DebugLog($msg);
                    //die();
                }
                else
                {
                    $msg = 'batch => SUCCESS';
                    DebugLog($msg);
                }
                
            }
            else //multi thread----------------------------------
            {
                $data = array(
                            'id' => $id,
                            'accountId' => $accountId,
                            'cronofy_user_id' => $cronofy_user_id,
                            'events' => $events,
                        );
                
                //calls utf8ize else json_encode fails!
                $data = utf8ize($data);

                $curl = curl_init();
                if (cronodevtest)
                {
                    DebugLog('cronofy_manager_access.EventsInitializationBulk.loop (test) id='.$id);
                    //curl_setopt($curl, CURLOPT_URL, 'http://localhost:80/cronofy/bulkasync.php');  // for local testing see (*curl 01*)
                    curl_setopt($curl, CURLOPT_URL, 'http://127.0.0.1:80/cronofy/bulkasync.php');  // for local testing see (*curl 01*)
                    //curl_setopt($curl, CURLOPT_URL, 'http://localhost/mobminder/cronofy/cronasync.php');  // for local testing see (*curl 01*)
                }
                else
                {
                    DebugLog('cronofy_manager_access.EventsInitializationBulk.loop (prod)');
                    curl_setopt($curl, CURLOPT_URL, 'https://be.mobminder.com/cronofy/bulkasync.php');
                }
                
                curl_setopt($curl, CURLOPT_POST, 1);
                curl_setopt($curl, CURLOPT_POSTFIELDS, json_encode($data));
                //DebugLog("body to send=".json_encode($data));
                curl_setopt($curl, CURLOPT_VERBOSE, false);
                curl_setopt($curl, CURLOPT_FRESH_CONNECT, true);
                curl_setopt($curl, CURLOPT_TIMEOUT_MS, 100);
                curl_exec($curl);
                curl_close($curl);
                //sleep(10);

            }
            $id++;
            $events = Array();
        }
        DebugLog('cronofy_manager_access.EventsInitializationBulk.number = '.$counter);
        DebugLog('cronofy_manager_access.EventsInitializationBulk.end');
    }

    /*
        Revoke all calendars and delete their channels
        This function revokes the profile if profile has no more calendars linked
        This function revokes the user if user has no more calendars linked
        $calendars is a dbAccess_cronofy_calendar object who contains all calendar that will be deleted
        *You can't call this function if you use CreateByCronofyUser function to create this object
        return true if user if revoked
            */
    public function RevokeCalendars($calendars)
    {
        DebugLog('cronofy_manager_access.RevokeCalendars.start');
        //prepare local parameters ----------------------------------------
        $accountId = $this->dS_accesskey->accountId;
        $cronofy_user_id = $this->dS_cronofy_profile_updater->groupId;
        $cronofy_access_id=$this->dS_cronofy_access_updater->id;
        
        //create mobcronofy -----------------------------------------------
        $dS_mob_cronofy = new MobCronofy($accountId,$cronofy_user_id);

        $calendarids = array();
        foreach($calendars as $dS_cronofy_calendar)
        {
            // close each channel -----------------------------------------
            DebugLog('cronofy_manager_access.RevokeCalendars.CloseChannel for calendarid='.$dS_cronofy_calendar->cro_calendar_id);
            $dS_mob_cronofy->CloseChannel($dS_cronofy_calendar->cro_channel_id);
            array_push($calendarids,$dS_cronofy_calendar->cro_calendar_id);
            $dS_cronofy_calendar->dSobsolete();
        }

        DebugLog('cronofy_manager_access.RevokeCalendars.DeleteAllEvents');
        //delete all events on cronofy calendars --------------------------
        DebugLog("calendarids=".json_encode($calendarids));
        $res = $dS_mob_cronofy->DeleteAllEvents($calendarids);
        DebugLog("res=".json_encode($res));

        //delete access in db if no more calendar for access -------------
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByGroupId($cronofy_access_id);

        if(count($dbAccess_cronofy_calendars->keyed)==0)
        {
            DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_calendars = 0 => removing cronofy access');  
            $this->dS_cronofy_access_updater->dSobsolete();

            //update related inittasks state to completed (=2)
            //new Q('update cronofy_inittasks set state = 2 where groupId = '.$this->dS_cronofy_access_updater->id.';'); 
            new Q('delete from cronofy_inittasks where groupId = '.$this->dS_cronofy_access_updater->id.';'); 
  
            //delete profile in db if no more access for profile
            $dbAccess_cronofy_accesses = new C_dbAccess_cronofy_accesses();
            $dbAccess_cronofy_accesses->getByGroupId($this->dS_cronofy_profile_updater->id);

            if(count($dbAccess_cronofy_accesses->keyed)==0)
            {
                DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_accesses = 0 => removing cronofy profile');
                $this->dS_cronofy_profile_updater->dSobsolete();

                //delete user in db if no more profile for access
                $dbAccess_cronofy_profiles = new C_dbAccess_cronofy_profiles();
                $dbAccess_cronofy_profiles->getByGroupId($dS_mob_cronofy->dS_cronofy_user_updater->id);

                if(count($dbAccess_cronofy_profiles->keyed)==0)
                {
                    DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_profiles = 0 => removing cronofy user & revoke authorization');
                    $dS_mob_cronofy->RevokeAuthorization(); //Revoke user if it's the last link
                    $dS_mob_cronofy->dS_cronofy_user_updater->dSobsolete();
                    DebugLog('cronofy_manager_access.RevokeCalendars.end=true');
                    return true;
                }
                else
                {
                    DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_profiles > 0');
                }
            }
            else
            {
                 DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_accesses > 0');
            }
        }
        else
        {
            DebugLog('cronofy_manager_access.RevokeCalendars.dbAccess_cronofy_calendars > 0');  
        }
        DebugLog('cronofy_manager_access.RevokeCalendars.end=false');
        return false;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
//
// This class is used in the mobminder core code 
//
// 		- in /api/delete/reservation.php
// 		- in /api/post/reservation.php
// 		- in /cronofy/callback.php
// 		- in /cronofy/cron/halfs.php
// 		- in /cronofy/cronofymanager.php
// 		- in /delete/reservation.php
// 		- in /post/reservation.php
//

class C_cronofy_manager_reservation 
{
    public $accountId;
    public $dbAccess_account_resources;

    public function __construct($accountId)
    { 
        $this->accountId=$accountId;
        $this->dbAccess_account_resources = new C_dbAccess_resources($accountId);    
    }

    /*
        Upsert (udpate/insert) an event for all attendees
    */
    //if $excludeCalendarId <> null => excludedcalendarid will not be updated
    //if $excludeCalendarId == null => all calendar will be updated
    public function UpsertForAttendees($dS_reservation,$excludeCalendarId,$view=false) // PVH 2020-11-09 added $view
    {
        DebugLog('cronofymanager.UpsertForAttendees.start');

        //loading all attendees for current reservation ----------------------
        $attendees = new C_dbAccess_attendees();
        if($view)
			$attendees->loadOnView($view, $dS_reservation->id); // Load some attendees for this reservation (according to the view) PVH
		else 
			$attendees->loadOnGroup($dS_reservation->id); //Load attendees for the reservation
		
        $customCss_to_color = new C_cssNameToHexaColor($this->accountId);

		$dS_reservation->magnify($this->dbAccess_account_resources, true);
		
        DebugLog('cronofymanager.UpsertForAttendees.count='.$attendees->count());
        foreach($attendees->keyed as $attendee)
        {   
            //for each attendee, insert or update cronofy event -----------
            DebugLog('cronofymanager.UpsertForAttendees:attendee='.$attendee->resourceId);
            $this->UpsertForAttendee($dS_reservation,$attendee,$excludeCalendarId,$customCss_to_color);
        }
        
        DebugLog('cronofymanager.UpsertForAttendees.end');
    }

    /*
        Upsert (update/insert) an event for a given attendee
    */
    //if $excludeCalendarId <> null => excludedcalendarid will not be updated
    //if $excludeCalendarId == null => all calendar will be updated
    private function UpsertForAttendee($dS_reservation,$attendee,$excludeCalendarId,$customCss_to_color)
    {
        DebugLog('cronofymanager.UpsertForAttendee.start');

        ///////////////////////////////////////////////////////
        //loading all calendars for current attendee-----------------------
        //the link is : calendar.resourceId == attendee->resourceId
        ///////////////////////////////////////////////////////
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        $dbAccess_cronofy_calendars->getByResourceId($attendee->resourceId);

        if(count($dbAccess_cronofy_calendars->keyed)>0)
        {
            $hxcolor = $customCss_to_color->getHexaColor($dS_reservation);

            DebugLog('cronofymanager.UpsertForAttendee.>0');
            // for each calendar ---------------------------------------------------
            foreach($dbAccess_cronofy_calendars->keyed as $id => $cronofy_calendar)
            {   
                //excludeCalendarId is excluded from cascade updates (if <> null)
                if ((empty($excludeCalendarId)) || ($excludeCalendarId!=$cronofy_calendar->id))
                {
                    if($cronofy_calendar->permission==1)
                    {
                        DebugLog('cronofymanager.UpsertForAttendee.permission');
                        $dS_cronofy_access = new C_dS_cronofy_access($cronofy_calendar->groupId);
                        $dS_cronofy_profile = new C_dS_cronofy_profile($dS_cronofy_access->groupId);
                        $dS_mob_cronofy = new MobCronofy($this->accountId,$dS_cronofy_profile->groupId);

                        //externalid = event uid stored in $reservation->remoteid (if event uid)
                        //externalid = null if event is en event ID
                        //$reservation->remoteProfile contains linked cronofy calendar id
                        $externalid=null;
                      
                        //formerlyexternal = true if event was an event UID before
                        //if $reservation->remoteid is not empty (cronofy calendar is or value '1') then formerlyexternal = > true
                        //if $reservation->remoteid is empty then formerlyexternal = false
                        $formerlyexternal=false;
                        
                        if ($dS_reservation->remoteProfile == $cronofy_calendar->id)
                        {
                            //insert or update event_uid (current calendar id equals remote profile)
                            DebugLog('cronofymanager.UpsertForAttendee.remoteProfile');
                            //eventuid = remoteid
                            $externalid=$dS_reservation->remoteid;
                            $formerlyexternal=false; //not used in event ui case!
                        }
                        else
                        {
                            //insert or update event id
                            DebugLog('cronofymanager.UpsertForAttendee.no remoteProfile');
                            //set eventuid to null ()
                            $externalid=null;
                            //upsertevent should know if event is or was and external event
                            //remote id = event uid (lined) OR 1 (formely external uid) OR '' (empty=internal event)
                            $formerlyexternal=(!empty($dS_reservation->remoteid));
                        }
                        $t=$dS_mob_cronofy->UpsertEvent($cronofy_calendar->cro_calendar_id,
                                                        $dS_reservation->id,
                                                        $attendee->id,
                                                        $dS_reservation->visitors->keyed,
                                                        $dS_reservation->note,
                                                        $dS_reservation->cueIn,
                                                        $dS_reservation->cueOut,
                                                        $hxcolor,
                                                        $externalid,$formerlyexternal); // upsert event

                        DebugLog('res='.json_encode($t));
                    }
                }
                else
                {
                     DebugLog('cronofymanager.UpsertForAttendee.no need to update excluded calendar id : '.$excludeCalendarId);
                }
            }
        }
        DebugLog('cronofymanager.UpsertForAttendee.end');
    }

    /*
        Delete an event for all attendees for a given reservation id
    */
    public function DeleteForAllAttendees($reservation_id)
    {
        DebugLog('cronofymanager.DeleteForAllAttendees.start');

        //loading $dS_reservation to read remoteid and remoteprofile---
        $dS_reservation = new C_dS_reservation($reservation_id);
        
        //loading attendees ------------------------------------------
        $attendees = new C_dbAccess_attendees();
        $attendees->loadOnGroup($reservation_id); //Load attendees for the reservation
        
        $this->DeleteByAttendees($dS_reservation,$attendees);
        DebugLog('cronofymanager.DeleteForAllAttendees.end');
    }

    /*
        Delete an event by attendees for given reservation and attendees array
    */
    public function DeleteByAttendees($dS_reservation,$attendees)
    {
        DebugLog('cronofymanager.DeleteByAttendees.start');
        foreach($attendees->keyed as $attendee)
        {   //for each attendee
            //excludeCalendarId must be null (no calendar exclusion for delete)
            $this->DeleteByAttendee($dS_reservation,$attendee,null);
        }
        DebugLog('cronofymanager.DeleteByAttendees.end');
    }

    /*
        Delete an event by an attendee
    */
    //$excludeCalendarId should be set to avoid delete already deleted event
    public function DeleteByAttendee($dS_reservation,$attendee,$excludeCalendarId)
    {
        //loading calendars ----------------------------------------------
        DebugLog('cronofymanager.DeleteByAttendee.start');
        $dbAccess_cronofy_calendars = new C_dbAccess_cronofy_calendars();
        DebugLog('cronofymanager.DeleteByAttendee.start1');
        $dbAccess_cronofy_calendars->getByResourceId($attendee->resourceId);
        DebugLog('cronofymanager.DeleteByAttendee.start2');

        //foreach calendar -----------------------------------------------
        foreach($dbAccess_cronofy_calendars->keyed as $id => $cronofy_calendar)
        { 
            DebugLog('cronofymanager.DeleteByAttendee.in calendar loop');
            
            //delete evente only if calendar ID <> excludeCalendarId
            if ((empty($excludeCalendarId)) || ($excludeCalendarId!=$cronofy_calendar->id))
            {
                if($cronofy_calendar->permission==1)
                {
                    DebugLog('cronofymanager.DeleteByAttendee.permission');
                    $dS_cronofy_access = new C_dS_cronofy_access($cronofy_calendar->groupId);
                    $dS_cronofy_profile = new C_dS_cronofy_profile($dS_cronofy_access->groupId);
                    $dS_mob_cronofy = new MobCronofy($this->accountId,$dS_cronofy_profile->groupId);

                    if ($dS_reservation->remoteProfile == $cronofy_calendar->id)
                    {
                        //delete event UID -------------------------
                        //because current calendar is remote profile 
                        DebugLog('cronofymanager.DeleteByAttendee.DeleteExternalEvent');
                        $externalid=$dS_reservation->remoteid;
                        $dS_mob_cronofy->DeleteExternalEvent($cronofy_calendar->cro_calendar_id,$externalid);
                    }
                    else
                    {
                        //delete event ID --------------------------
                        DebugLog('cronofymanager.DeleteByAttendee.DeleteEvent');
                        $dS_mob_cronofy->DeleteEvent($cronofy_calendar->cro_calendar_id,$attendee->groupId,$attendee->id); // delete event    
                    }
                }
            }
            else
            {
                DebugLog('cronofymanager.UpsertForAttendee.no need to delete excluded calendar id : '.$excludeCalendarId);
            }
        }  
        DebugLog('cronofymanager.DeleteByAttendee.end');
    }
	
    // VISITORS VERIFICATION
    //
    /*
        Search visitors in summary (text from cronofy) for an event Id (= reservation id on mobminder)
        return a C_dbAccess_att_visitors object
    */
    //GetVisitors is no more used to directly create attendee visitors in database!
    //source fields are summary AND description
    public function GetVisitors($summary,$description)
    {
        $sources = array();
        array_push($sources,$summary);
        array_push($sources,$description);
        $visitors = array();
        foreach($sources as $source)
        {
            $exploded_visitors = explode('#',$source); // explode by #
            foreach($exploded_visitors as $exploded_visitor)
            {   
                // for each potential visitor
                if(!empty($exploded_visitor))
                {
                    $visitor = $this->getVisitor($exploded_visitor); // check if a match can be found in DB
                    if(!!$visitor)
                    {
                        array_push($visitors,$visitor);
                    }
                }
            }
        }
        return $visitors;
    }

    /*
     Try to find a visitor in database from string
     return C_dS_visitor object if it finds else return false
    */
    private function getVisitor($input)
    {
       //DebugLog('getVisitor with:'.$input);   
	   $regex = '/([a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*),([a-zA-ZáàâäãåçéèêëíìîïñóòôöõúùûüýÿæœÁÀÂÄÃÅÇÉÈÊËÍÌÎÏÑÓÒÔÖÕÚÙÛÜÝŸÆŒ._\s-]*)(\([0-9]{2}-[0-9]{2}-[0-9]{4}\))?[\s]?([+])?([\d]*)?/';

        // examples
        // #lastname, firstname (dd-mm-yyyy) phonenumber
        // #lastname, firstname
        // #lastname_initial, firstname_initial  phonenumber
        // #lastname_initial, firstname_initial (dd-mm-yyyy)
		
        preg_match($regex, $input, $visitors_regex_array);
        if(empty($visitors_regex_array))
            return false;

        $lastname	= strtoupper(trim($visitors_regex_array[1]));
        $firstname	= strtoupper(trim($visitors_regex_array[2]));
        //DebugLog('getVisitor lastname:'.$lastname); 
        //DebugLog('getVisitor firstname:'.$firstname); 

        preg_match('/([0-9]{2}-[0-9]{2}-[0-9]{4})/', $visitors_regex_array[3], $date_regex_array);
        $date = !empty($date_regex_array) ? $date_regex_array[0] : null;

        $mobile = trim($visitors_regex_array[5]);

        $visitors = new C_dbAccess_visitors();

        if(!empty($lastname) && !empty($firstname))
        {
            //DebugLog('getVisitor 1');
            $lastname_initial_letter = substr($lastname,0,1);
            $firstname_initial_letter = substr($firstname,0,1);

            // Mobile & initial letter
            if(!empty($mobile))
            {
                $mobile_length=strlen($mobile);
                if($mobile_length>6){
                    $SQL=$this->mobileQuery($firstname_initial_letter,$lastname_initial_letter,$mobile,$mobile_length);
                    $visitors->loadMany($SQL);
                    $visitor = $this->getOneVisitor($visitors);
                    if(!!$visitor)
                    {
                        return $visitor;
                    }
                }
            }

            //DebugLog('getVisitor 2');


            // Date & initial letter
            if(!empty($date))
            {
                $isdate = preg_match('/^((0[1-9]|[12][0-9]|3[01]|[1-9]))([-])(0[1-9]|1[012]|[1-9])([-])?((19|20)\d\d)?/',$date);

                if($isdate) {
														echo 'normalized birthdate = '.$date.chr(10);
                    $l = strlen($date);					echo chr(9).chr(9).'l = '.$l;
                    $s1 = strpos($date,'-'); 			echo chr(9).chr(9).'separator 1 = '.$s1;
                    $r = substr($date,-($l-$s1-1)); 	echo chr(9).chr(9).'right part = '.$r;
                    $s2 = strpos($r,'-');				echo chr(9).chr(9).'separator 2 = '.$s2;
                    $p1 = substr($date,0,$s1);			echo chr(9).'part 1 = '.$p1;
					
                    if($s2) $p2 = substr($r,0,$s2);	else $p2 = $r;
														echo chr(9).'part 2 = '.$p2;
														
                    $lr = strlen($r);					echo chr(9).chr(9).'right part length = '.$lr;
					
                    $p3 = ''; if($s2) if($lr-$s2-1) $p3 = substr($r,-($lr-$s2-1)); 
														echo chr(9).'part 3 = '.$p3;
                }

                $birthdate = false;
                if($isdate)
                    $birthdate = $this->sortabledate($p3,$p2,$p1);
                if($birthdate){
                    $SQL =$this->birthdateQuery($firstname_initial_letter,
                                                $lastname_initial_letter,
                                                $birthdate);

                    $visitors->loadMany($SQL);
                    $visitor = $this->getOneVisitor($visitors);
                    if(!!$visitor)
                        return $visitor;
                }
            }

            //DebugLog('getVisitor 3');

            // Lastname & Firstname
            $SQL = 'SELECT * FROM visitors WHERE groupId='.$this->accountId
                .' AND UPPER(firstname) LIKE "'.$firstname.'%"'
                .' AND UPPER(lastname) LIKE "'.$lastname.'%"'
                .' AND deletorId = 0 LIMIT 2;';
            $visitors->loadMany($SQL);
            $visitor = $this->getOneVisitor($visitors);
            if(!!$visitor)
                return $visitor;

            //DebugLog('getVisitor 4');

            //Mobile & Firstname & Lastname initial letter
            if(!empty($mobile)){
                $mobile_length=strlen($mobile);
                if($mobile_length>6){

                    $SQL = $this->mobileQuery($firstname,$lastname_initial_letter,$mobile,$mobile_length);
                    $visitors->loadMany($SQL);
                    $visitor = $this->getOneVisitor($visitors);
                    if(!!$visitor)
                        return $visitor;
                }
            }
            
            //DebugLog('getVisitor 5');

            //Date & Firstname & Lastname initial letter
            if(!empty($date)){
                // birthdate is created in Date & initial letter
                if($birthdate){
                    $SQL =$this->birthdateQuery($firstname,
                                                $lastname_initial_letter,
                                                $birthdate);
                    $visitors->loadMany($SQL);
                    $visitor = $this->getOneVisitor($visitors);
                    if(!!$visitor)
                        return $visitor;
                }
            }

        }

        return false;
    }

    private function birthdateQuery($firstname,$lastname,$birthdate){
        return 'SELECT * FROM visitors WHERE groupId='.$this->accountId
            .' AND UPPER(firstname) LIKE "'.$firstname.'%"'
            .' AND UPPER(lastname) LIKE "'.$lastname.'%"'
            .' AND birthday LIKE "'.$birthdate.'" AND deletorId = 0 LIMIT 2;';
    }

    private function mobileQuery($firstname,$lastname,$mobile,$mobile_length){
        $SQL= 'SELECT * FROM visitors WHERE groupId='.$this->accountId
            .' AND UPPER(firstname) LIKE "'.$firstname.'%"'
            .' AND UPPER(lastname) LIKE "'.$lastname.'%"'
            .' AND mobile LIKE "%'.substr($mobile,$mobile_length-6,$mobile_length).'%" AND deletorId = 0 LIMIT 2;';
        return $SQL;
    }

    private function sortabledate($yyyy, $mm, $dd) {
        $ly = strlen($yyyy); switch($ly) { case 0: $yyyy = '____'; break; case 1: $yyyy .= '___'; break; case 2: $yyyy .= '__'; break; case 3: $yyyy .= '_'; break; }
        $lm = strlen($mm); switch($lm) { case 0: $mm = '__'; break; case 1: $mm = '0'.$mm; break; } 
        $ld = strlen($dd); switch($ld) { case 0: $dd = '__'; break; case 1: $dd = '0'.$dd; break; } 
        return $yyyy.$mm.$dd;
    }

    /*
    Return C_dS_Visitor object if it finds only one visitor in visitors given in parameter
    */
    private function getOneVisitor($visitors){
        if(count($visitors->keyed)==1)
            return array_shift($visitors->keyed);
        else
            return false;
    }
}
?>
