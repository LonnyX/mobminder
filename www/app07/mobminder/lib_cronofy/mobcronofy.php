<?php 
require 'crodbio.php';

////////////////////////////////////////////////////////////////////////////////////////////////
// mobcronofy.php
// Contains all object to dialog with Cronofy & Database in cronofy context
// updated by bspoden
////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////////
// DATABASE OBJECTS
//
//
//		Client Id, Client secret (when you sign up at Cronofy, this is client identification you get from cronofy as an App Developper) - developper email
//
//
//                              
//                              dS_login        <= Mobminder login (login id, lastname, firstname,... ) - mobminder login email (*)
//                                 |  
//                                 |  
//                                1:1 
//                                 |  
//                                 |                 
//  				  	    dS_cronofy_user     <= Cronofy user  - AUTHENTICATION - mobminder login email (*)
//                          /      |      \             [ cronofy accountId, accessToken, refreshToken ]
//                         /       |       \
//                        /        |        \
//                       /        1:n        \
//                      /          |          \
//                     /           |           \
//                    /            |            \
//                   /             |             \
//                  /              |              \
//     dS_cronofy_profile   dS_cronofy_profile   dS_cronofy_profile  <= Cloud Calendar provider (email + provider) - OAUTHorization - scope - calendar account email
//                           /          \                                   [ profile_id, provider_name(Google,..), profile_name(email) ]
//                          /            \ 
//                         /              \    
//                        /       1:n      \ 
//                       /                  \  
//                      /                    \   
//                     /                      \
//                    /                        \
//         dS_cronofy_access            dS_cronofy_access   <= Mobminder account (accesskeyId, view)
//          /       |      \
//         /        |       \
//        /         |        \
//       /         1:n        \
//      /           |          \
//     /            |           \
//  dS_cronofy_calendar         dS_cronofy_calendar   <= Agenda line (Mob resourceId)
//                                                             [ calendar_id, channel_id ]
//
//


////////////////////////////////////////////////////////////////////////////////////////////////
// Wrapper layer for vendor class Cronofy 
// used for overriding existing functions or adding specific functions
class ExtendedCronofy extends Cronofy
{
    public function __construct($config = array())
    { 
        parent::__construct($config);
    }
    //OVERRIDEN because : returns TOKEN if successful instead of TRUE
    public function request_token_cro($params)
    {
        /*
          Array $params : An array of additional paramaters
          redirect_uri : String The HTTP or HTTPS URI you wish the user's authorization request decision to be redirected to. REQUIRED
          code: The short-lived, single-use code issued to you when the user authorized your access to their account as part of an Authorization  REQUIRED

          Response :
          returns TOKEN if successful, error string if not
        */
        $postfields = array(
            'client_id' => $this->client_id,
            'client_secret' => $this->client_secret,
            'grant_type' => 'authorization_code',
            'code' => $params['code'],
            'redirect_uri' => $params['redirect_uri']
        );

        $tokens = $this->http_post('/oauth/token', $postfields);

        if (!empty($tokens['access_token'])) {
            $this->access_token = $tokens['access_token'];
            $this->refresh_token = $tokens['refresh_token'];
            $this->expires_in = $tokens['expires_in'];
            return $tokens;
        } else {
            return $tokens['error'];
        }
    }
    //OVERRIDEN because : insertion of COLOR and EVENT UID if necessary
    public function upsert_event_cro($sourceparams)
    {
        //manadory for correcting utf8 errors
        //ex : json_encode returns empty string
        //and call to api returns exception ! 
         $params = utf8ize($sourceparams);

        /*
          calendar_id : The calendar_id of the calendar you wish the event to be added to. REQUIRED
          String event_id : The String that uniquely identifies the event. REQUIRED
          String summary : The String to use as the summary, sometimes referred to as the name, of the event. REQUIRED
          String description : The String to use as the description, sometimes referred to as the notes, of the event. REQUIRED
          String tzid : A String representing a known time zone identifier from the IANA Time Zone Database. OPTIONAL
          Time start: The start time can be provided as a simple Time string or an object with two attributes, time and tzid. REQUIRED
          Time end: The end time can be provided as a simple Time string or an object with two attributes, time and tzid. REQUIRED
          String location.description : The String describing the event's location. OPTIONAL
          String location.lat : The String describing the event's latitude. OPTIONAL
          String location.long : The String describing the event's longitude. OPTIONAL
          Array reminders : An array of arrays detailing a length of time and a quantity. OPTIONAL
                            for example: array(array("minutes" => 30), array("minutes" => 1440))
          String transparency : The transparency of the event. Accepted values are "transparent" and "opaque". OPTIONAL
          Array attendees : An array of "invite" and "reject" arrays which are lists of attendees to invite and remove from the event. OPTIONAL
                            for example: array("invite" => array(array("email" => "new_invitee@test.com", "display_name" => "New Invitee"))
                                               "reject" => array(array("email" => "old_invitee@test.com", "display_name" => "Old Invitee")))

          returns true on success, associative array of errors on failure
         */
        $postfields = array(
            // comment 'event_id' => $params['event_id'],
            'summary' => $params['summary'],
            'description' => $params['description'],
            'start' => $params['start'],
            'end' => $params['end'],
            'color' => $params['color']
        );
        //manage event_id OR event_uid---------------------
        if (!empty($params['event_id'])) 
        {
            $postfields['event_id'] = $params['event_id'];
        }
        if (!empty($params['event_uid'])) 
        {
            $postfields['event_uid'] = $params['event_uid'];
        }
        //--------------------------------------------------

        if (!empty($params['tzid'])) {
            $postfields['tzid'] = $params['tzid'];
        }
        if (!empty($params['location'])) {
            $postfields['location'] = $params['location'];
        }
        if(!empty($params['reminders'])) {
            $postfields['reminders'] = $params['reminders'];
        }
        if(!empty($params['transparency'])) {
            $postfields['transparency'] = $params['transparency'];
        }
        if(!empty($params['attendees'])) {
            $postfields['attendees'] = $params['attendees'];
        }

        return $this->http_post('/' . self::API_VERSION . '/calendars/' . $params['calendar_id'] . '/events', $postfields);
    }

    public function callbatch_cro($sourceevents)
    {
        //DebugLog('ExtendedCronofy.callbatch_cro.count='.count($events));
        //$tmp = json_encode($events);
        //if (empty($tmp))
        //{
        //    $code = json_last_error();
        //    DebugLog('callbatch.events=code'.$code);
        //}

        //manadory for correcting utf8 errors
        //ex : json_encode returns empty string
        //and call to api returns exception ! 
        $events = utf8ize($sourceevents);

        $actions = Array();

        foreach($events as $event)
        {
            $postfields = array(
                // comment 'event_id' => $params['event_id'],
                'summary' => $event['summary'],
                'description' => $event['description'],
                'start' => $event['start'],
                'end' => $event['end'],
                'color' => $event['color']
            );
            //manage event_id OR event_uid---------------------
            if (!empty($event['event_id']))    $postfields['event_id'] = $event['event_id'];
            if (!empty($event['event_uid']))   $postfields['event_uid'] = $event['event_uid'];
            
            if (!empty($event['tzid']))        $postfields['tzid'] = $event['tzid'];
            if (!empty($event['location']))    $postfields['location'] = $event['location'];
            if (!empty($event['reminders']))   $postfields['reminders'] = $event['reminders'];
            if (!empty($event['transparency'])) $postfields['transparency'] = $event['transparency'];
            if (!empty($event['attendees']))   $postfields['attendees'] = $event['attendees'];
            
            $action = array(
                'method'=>'POST',
                'relative_url'=>'/'.self::API_VERSION.'/calendars/'.$event['calendar_id'] .'/events',
                'data'=>$postfields
            );
            array_push($actions,$action);
        }

        $request = array(
            'batch' => $actions
        );

        //return $this->http_post("/" . self::API_VERSION . "/calendars/" . $params['calendar_id'] . "/events", $postfields);
        //DebugLog('callbatch.request='.json_encode($request));
        return $this->http_post('/' . self::API_VERSION . '/batch', $request);

    }

    //OVERRIDEN because : filters parameters are sent in addition to callback_url
    public function create_channel_cro($params)
    {
        /*
          String callback_url : The URL that is notified whenever a change is made. REQUIRED
          returns $result - Details of new channel. Details are available in the Cronofy API Documentation
        */
        //$postfields = array('callback_url' => $params['callback_url']);
        return $this->http_post('/' . self::API_VERSION . '/channels', $params);
    }
    //OVERRIDEN because : the original function does not exit
    public function delete_all_events_cro($params)
    {
        $postfields = array('calendar_ids' => $params['calendar_ids']);
        return $this->http_delete('/' . self::API_VERSION . '/events', $postfields);
    }
    //OVERRIDEN because : the original function does not exit
    public function getLinkToken_cro()
    {
        return $this->http_post('/' . self::API_VERSION . '/link_tokens');
    }
    //OVERRIDEN because : the original function does not exit
    public function getAuthorizationURL_cro($params)
    {

        $scope_list = join(' ', $params['scope']);

        $url = $this->app_root_url . '/oauth/authorize?response_type=code&client_id=' . $this->client_id . '&redirect_uri=' . urlencode($params['redirect_uri']) . '&scope=' . $scope_list;
        if (!empty($params['state'])) {
            $url.='&state=' . $params['state'];
        }
        if (!empty($params['link_token'])) {
            $url.='&link_token=' . $params['link_token'];
        }
        if (!empty($params['avoid_linking'])) {
            $url.='&avoid_linking=' . $params['avoid_linking'];
        }
        DebugLog('getAuthorizationURL_cro.return='.$url);
        return $url;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////
// Low-level access to cronofy API
// MobCronofy no more extends Cronofy but contains a ExtendedCronofy which extends Cronofy
//
// it is used in
//  	/cronofy/callback.php
// 		/cronofy/connecting.php
// 		/cronofy/cronasync.php
// 		/cronofy/cronofymanager.php
// 		/cronofy/oauth.php
//
class MobCronofy 
{
    public $cronofy;
    public $accountId;
    public $dS_cronofy_user_updater;

    public function __construct($accountId,$cronofy_user_id=false)
    {
        $config = array(
            'access_token' => '',
            'refresh_token' => ''
        );

        $config['client_id'] = $GLOBALS['CRONOFY_CLIENT_ID'];
        $config['client_secret'] = $GLOBALS['CRONOFY_CLIENT_SECRET'];
        $config['data_center'] = $GLOBALS['DATA_CENTER'];

        if(!!$cronofy_user_id)
        {
            //DebugLog('mobcronofy.__construct.cronofy_user_id exists');
            $this->dS_cronofy_user_updater = new C_dS_cronofy_user($cronofy_user_id);
            $config['access_token'] = $this->dS_cronofy_user_updater->cro_access_token;
            $config['refresh_token'] = $this->dS_cronofy_user_updater->cro_refresh_token;
        }
        else
        {
            //DebugLog('mobcronofy.__construct.cronofy_user_id does not exist');
        }

        $this->accountId=$accountId;

        $this->cronofy = new ExtendedCronofy($config);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Make a refresh of token 
    public function RefreshToken()
    {
        try 
        {
            $this->cronofy->refresh_token();
            
            //Function overloading to update access_token & refresh_token in database
            if(isset($this->dS_cronofy_user_updater)) 
            {
			    $this->dS_cronofy_user_updater->cro_access_token=$this->cronofy->access_token;
    			$this->dS_cronofy_user_updater->cro_refresh_token=$this->cronofy->refresh_token;
	    		$this->dS_cronofy_user_updater->dSsave();
		    }

            $result = array(
                'data' => null,
                'error' => null
            );
        }
        catch(CronofyException $ex){
            $this->dropxcp($ex,'RefreshToken');
            return $ex;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Read Updated Event for calendars from date
    public function ReadUpdatedEvents($calendarsid,$lastmodified)
    {
        //DebugLog('mobcronofy/ReadUpdatedEvents/start');
        $params = array('tzid' => 'Etc/UTC', 'include_managed' => true, 'last_modified' => $lastmodified,'include_deleted'=>true,'calendar_ids' => $calendarsid);

        try{
            $result = $this->cronofy->read_events($params);
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->read_events($params);
                    }
                    catch(Exception $ex)
                    {
                        //DebugLog('mobcronofy/ReadUpdatedEvents/exception:'.$ex->getMessage());
                        $this->dropxcp($ex,'ReadUpdatedEvents');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'ReadUpdatedEvents');
            }
            //DebugLog('mobcronofy/ReadUpdatedEvents/end1');
            //DebugLog(json_encode($e));
            return $e;
        } 
        //DebugLog('mobcronofy/ReadUpdatedEvents/end2');
        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Get calendars for an account
    public function GetCalendars()
    {
        try
        {
            $result = $this->cronofy->list_calendars()['calendars'];
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->list_calendars()['calendars'];
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'GetCalendars');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'GetCalendars');
            }
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Create a calendar
    public function CreateCalendar($accountProfileId,$name,$color)
    {
        try{
            $calendar = array(
                'profile_id' => $accountProfileId,
                'name' => $name,
                'color' =>$color
            );

            $result = $this->cronofy->create_calendar($calendar);
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException){
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->create_calendar($calendar);
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'CreateCalendar');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'CreateCalendar');
            }
            return $e;
        } 
        return $result;
    }
    
   

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Upsert an event in a calendar (high level function)
    //generate summary and descriptions fields from note field and visitors (if exist)
    //+ set $externalid to insert/update event uid instead of event id
    //
    //how to fill summary and description fields ----------------------------------------------------------------------------------------------
    //case 1 : event uid + no attendee visitor => summary = first note line + sad emoji,   description = other note lines
    //case 2 : event uid +    attendee visitor => summary = first line      + happy emoji, description = other note lines
    //case 3 : event id  + no attendee visitor => summary = first note line,               description = other note lines
    //case 4 : event id  +    attendee visitor => summary = short visitors label,          description = long visitors labels + all notes lines
    //-----------------------------------------------------------------------------------------------------------------------------------------
    public function UpsertEvent($calendarid,$reservationid,$attendeeid,$visitors,$note,$start,$end,$color,$externalid,$formerlyexternal)
    {
        //DebugLog('mobcronofy.UpsertEvent.start');
        $event = PrepareEventStructure($calendarid,$reservationid,$attendeeid,$visitors,$note,$start,$end,$color,$externalid,$formerlyexternal);
        $ret = $this->UpdateEvent($event);
        //DebugLog('mobcronofy.UpsertEvent.end');
        return $ret;
    }

    //Insert or Update event in a calendar (low-level function)
    //event is created if eventid or eventuid does not yet exist
    public function UpdateEvent($event)
    {
        try
        {
            DebugLog('mobcronofy.UpdateEvent.call upsert_event_cro');
            $result =$this->cronofy->upsert_event_cro($event);
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401)
                { // error refresh token = refresh & retry
                    try
                    {
                        $this->RefreshToken();
                        return $this->cronofy->upsert_event_cro($event);
                    }
                    catch(Exception $ex)
                    {
                        DebugLog('mobcronofy.UpdateEvent.exception ! : '.$ex);
                        $this->dropxcp($ex,'UpdateEvent');
                        return $ex;
                    }
                }
            }
            else
            {
              DebugLog('mobcronofy.UpdateEvent.exception ! : '.$e);
              $this->dropxcp($e,'UpdateEvent');
            }
            return $e;
        } 

        return $result;
    }
    public function CallBatch($events)
    {
        try
        {
            //DebugLog('mobcronofy.CallBatch.call callbatch_cro');
            $result =$this->cronofy->callbatch_cro($events);
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401)
                { // error refresh token = refresh & retry
                    try
                    {
                        $this->RefreshToken();
                        return $this->cronofy->callbatch_cro($events);
                    }
                    catch(Exception $ex)
                    {
                        DebugLog('mobcronofy.CallBatch.exception ! : '.$ex);
                        $this->dropxcp($ex,'UpdateEvent');
                        return $ex;
                    }
                }
            }
            else
            {
                DebugLog('mobcronofy.CallBatch.exception ! : '.$e);
                $this->dropxcp($e,'UpdateEvent');
            }
            
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Delete event id in a calendar
    public function DeleteEvent($calendarid,$reservationid,$attendeeid)
    {
        $params = array(
                'calendar_id' => $calendarid,
                'event_id' => $reservationid."_".$attendeeid
        );
        try
        {
            DebugLog('mobcronofy.DeleteEvent.call delete_event');
            $result = $this->cronofy->delete_event($params);
        }
        catch(Exception $e){
            if($e instanceof CronofyException){
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->delete_event($params);
                    }
                    catch(Exception $ex)
                    {
                        DebugLog('mobcronofy.DeleteEvent.exception ! : '.$ex);
                        $this->dropxcp($ex,'DeleteEvent');
                        return $ex;
                    }
                }
            }
            else
            {
                DebugLog('mobcronofy.DeleteEvent.exception ! : '.$e);
                $this->dropxcp($e,'DeleteEvent');
            }
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Delete external event in a calendar (event uid)
    public function DeleteExternalEvent($calendarid,$eventuid)
    {
        $params = array(
            'calendar_id' => $calendarid,
            'event_uid' => $eventuid
        );
        try{
            DebugLog('mobcronofy.DeleteExternalEvent.call delete_external_event');
            $result = $this->cronofy->delete_external_event($params);
        }catch(Exception $e){
            if($e instanceof CronofyException){
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->delete_external_event($params);
                    }
                    catch(Exception $ex)
                    {
                        DebugLog('mobcronofy.DeleteExternalEvent.exception ! : '.$ex);
                        $this->dropxcp($ex,'DeleteExternalEvent');
                        return $ex;
                    }
                }
            }
            else
            {
                DebugLog('mobcronofy.DeleteExternalEvent.exception ! : '.$e);
                $this->dropxcp($e,'DeleteExternalEvent');
            }
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Delete all events for calendar ids (array)
    public function DeleteAllEvents($calendarids)
    {
        $params = array(
            'calendar_ids' => $calendarids,
        );
        try{
            $result = $this->cronofy->delete_all_events_cro($params);
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->delete_all_events_cro($params);
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'DeleteAllEvents');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'DeleteAllEvents');
            }
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Create a channel for a given calendar id
    public function CreateChannel($calendarid,$cronofy_calendar_id)
    {
        $callbackUrl = $GLOBALS['DOMAIN'] . '/cronofy/callback.php?id='.$cronofy_calendar_id;
        try{
            $result = $this->cronofy->create_channel_cro(array(
                'callback_url' => $callbackUrl,
                'filters' => array(
                    'only_managed' => false,
                    'calendar_ids' => array($calendarid)
                )));
        }
        catch(Exception $e){
            if($e instanceof CronofyException){
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->create_channel_cro(array(
                            'callback_url' => $callbackUrl,
                            'filters' => array(
                                'only_managed' => false,
                                'calendar_ids' => array($calendarid)
                            )));
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'CreateChannel');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'CreateChannel');
            }
            return $e;
        } 

        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Close a channel 
    public function CloseChannel($channel_id)
    {
        try
        {
            $result = $this->cronofy->close_channel(array('channel_id' => $channel_id));
        }
        catch(Exception $e)
        {
            if($e instanceof CronofyException)
            {
                if($e->getCode() == 401)
                { // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->close_channel(array(
                            'channel_id' => $channel_id));
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'CloseChannel');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'CloseChannel');
            }
            return $e;
        } 
        return $result;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //Add permission to a calendar id
    public function ElevatePermissions($params)
    {
        try{
            $response = $this->cronofy->elevated_permissions($params);
        }catch(Exception $e){
            if($e instanceof CronofyException){
                if($e->getCode() == 401){ // error refresh token = refresh & retry
                    try{
                        $this->RefreshToken();
                        return $this->cronofy->elevated_permissions($params);
                    }
                    catch(Exception $ex){
                        $this->dropxcp($ex,'ElevatePermissions');
                        return $ex;
                    }
                }
            }
            else
            {
                $this->dropxcp($e,'ElevatePermissions');
            }
            return $e;
        }   

        return $response;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //intermediate function for accessing cronofy instance
    public function RequestToken($params)
    {
         return $this->cronofy->request_token_cro($params);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //intermediate function for accessing cronofy instance
    public function GetLinkToken()
    {
        try
        {
            return $this->cronofy->request_link_token();
            //return $this->cronofy->getLinkToken_cro();
        }
        catch(CronofyException $ex)
        {
            $this->dropxcp($ex,'GetLinkToken');
            throw $ex;
        } 
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //intermediate function for accessing cronofy instance
    public function GetAuthorizationURL($params)
    {
        return $this->cronofy->getAuthorizationURL_cro($params);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //intermediate function for accessing cronofy instance
    public function GetUserInfo()
    {
        return $this->cronofy->get_userinfo();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //intermediate function for accessing cronofy instance
    public function RevokeAuthorization()
    {
        //$currenttoken = $this->cronofy->refresh_token;
        $currenttoken = $this->cronofy->access_token;
        return $this->cronofy->revoke_authorization($currenttoken);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////
    //save exception in exceptions table  
    private function dropxcp($errstr, $function) 
    {
        C_dS_exception::put(get_class(), $function, $errstr, $this->accountId);
    }
}

function PrepareEventStructure($calendarid,$reservationid,$attendeeid,$visitors,$note,$start,$end,$color,$externalid,$formerlyexternal)
{
    //define emojis for external event---------------------------
    //https://freek.dev/376-using-emoji-in-php
    //https://apps.timwhitlock.info/emoji/tables/unicode
    //https://www.nowsms.com/emoticons.htm
    //$this->emojihappy= json_decode('"\uD83D\uDE00"'); // "\u{D83D}\u{DE00}"; //'OK';//'\xF0\x9F\x98\x83';
    //$this->emojisad=   json_decode('"\uD83D\uDE21"'); //"\u{D83D}\u{DE00}"; //'NOK';//'\xF0\x9F\x98\xA1';
    $emojihappy= json_decode('"\u2714"');
    $emojisad=   json_decode('"\u274C"');
    //----------------------------------------------------------

    //DebugLog('mobcronofy.PrepareEventStructure.start');

    //mandatory to split by linebreak; NEWLINE is used because of some format issues with carriage return
    $note = str_replace("\r\n",'[NEWLINE]',$note);
    $note = str_replace("\n",'[NEWLINE]',$note);
    $notelines=explode('[NEWLINE]',$note);
    //$notelines=explode(PHP_EOL,$note);

    $summary='';
    $description='';
    if (!empty($externalid)) // event uid (external event)  --------------------------------
    {
        //DebugLog('mobcronofy.PrepareEventStructure.eventuid');
        if (count($visitors)==0) // case 1 : no attendee visitors
        {
            //DebugLog('mobcronofy.PrepareEventStructure.without any visitors');
            //summary = first note line + sad emoji
            //description = other note lines

            //works even only one line in $note!
            $summary = $notelines[0].' '.$emojisad;         
            array_shift($notelines); //remove first line to provide only description
            $description = join(PHP_EOL, $notelines);   
            
        }
        else // case 2 : with attendee visitors
        {
            //DebugLog('mobcronofy.PrepareEventStructure.with visitors');
            //summary = first line + happy emoji
            //description = other note lines
    
            //works even only one line found in $note!
            $summary = $notelines[0].' '.$emojihappy;       
            array_shift($notelines); //remove first line to provide only description
            $description = getVisitorsLongString($visitors).PHP_EOL.join(PHP_EOL, $notelines);   
        }
    }
    else //event id (internal event) ------------------------------------------------------
    {
        //DebugLog('mobcronofy.PrepareEventStructure.eventid');
        if (count($visitors)==0) // case 3 : no attendee visitors
        {
            //DebugLog('mobcronofy.PrepareEventStructure.without any visitors.note='.$note);
            //DebugLog('test'.PHP_EOL.'test');
            
            //summary = first note line (with sad emoji if formerly external event)
            //description = other note lines
            $summary = $notelines[0].($formerlyexternal?' '.$emojisad:''); 
            //DebugLog('mobcronofy.UpsertEvent.without any visitors.summary='.$summary);
            array_shift($notelines); //remove first line to provide only description
            $description = join(PHP_EOL, $notelines);
            //DebugLog('mobcronofy.UpsertEvent.without any visitors.description='.$description);
        }
        else // case 4 : with attendee visitors
        {
            //DebugLog('mobcronofy.PrepareEventStructure.with visitors');

            //summary = short visitors label (with happy emoji if formerly external event)
            //description = long visitors labels + all notes lines
            $summary = getVisitorsShortString($visitors).($formerlyexternal?' '.$emojihappy:'');
            $description = getVisitorsLongString($visitors).PHP_EOL.join(PHP_EOL, $notelines); 
        }
    }

    if (empty($summary))
    {
        $summary='-';
    }
    // -------------------------------------------------------------------------------------

    //// Create event object
    $event = Array(
        'tzid' => 'Etc/UTC',
        //comment "event_id" => $reservationid."_".$attendeeid,
        'calendar_id' => $calendarid,
        'summary' => $summary,
        'description' => $description,
        'start' => date(DATE_ATOM,$start),
        'end' => date(DATE_ATOM,$end),
        'color' =>$color
    );
    if (empty($externalid))
    {
        $event = array_merge($event,['event_id'=>$reservationid.'_'.$attendeeid]);
    }
    else
    {
        $event = array_merge($event,['event_uid'=>$externalid]);
    }
    //DebugLog('event='.json_encode($event));
    //DebugLog('mobcronofy.PrepareEventStructure.end');
    //DebugLog(json_encode($event));
    return $event;
}
////////////////////////////////////////////////////////////////////////////////////////////////    
//convert a visitors array to long string with [ ] (description field)
function getVisitorsLongString($visitors)
{
    //DebugLog('mobcronofy.getVisitorsLongString.start');
    $res = array();
    foreach($visitors as $visitor)
    {
        array_push($res,getVisitorLongString($visitor));
    }
    //DebugLog('mobcronofy.getVisitorsLongString.end');
    return '['.join('',$res).']';
}

////////////////////////////////////////////////////////////////////////////////////////////////
//convert a single visitor to long string (#lastname, firstname (birthday) mobile)
function getVisitorLongString($visitor)
{
    //DebugLog('mobcronofy.getVisitorLongString.start');
    $res = '#'.$visitor->lastname.', '.$visitor->firstname;
    if(!!$visitor->birthday)
    {
        $res = $res.' ('.substr($visitor->birthday,6,2).'-'.substr($visitor->birthday,4,2).'-'.substr($visitor->birthday,0,4).')';
    }
    if(!!$visitor->mobile)
    {
        $res = $res.' '.$visitor->mobile;
    }
    //DebugLog('mobcronofy.getVisitorLongString.end');
    return $res;
}

////////////////////////////////////////////////////////////////////////////////////////////////
//convert a visitors array to short string (summary field)
function getVisitorsShortString($visitors)
{
    //DebugLog('mobcronofy.getVisitorsShortString.start');
    $res = array();
    foreach($visitors as $visitor)
    {
        array_push($res,getVisitorShortString($visitor));
    }
    //DebugLog('mobcronofy.getVisitorsShortString.end');
    return join('',$res);
}

////////////////////////////////////////////////////////////////////////////////////////////////
//convert a single visitor to short string (#lastname, firstname initial)
function getVisitorShortString($visitor)
{
    return '#'.$visitor->lastname.', '.substr($visitor->firstname,0,1).' ';
}

/*function safe_json_encode($value, $options = 0, $depth = 512) 
{
        $encoded = json_encode($value, $options, $depth);
        if ($encoded === false && $value && json_last_error() == JSON_ERROR_UTF8) {
            $encoded = json_encode(utf8ize($value), $options, $depth);
        }
        return $encoded;
}*/
function utf8ize($mixed) 
{
    if (is_array($mixed)) 
    {
        foreach ($mixed as $key => $value) 
        {
            $mixed[$key] = utf8ize($value);
        }
    } 
    elseif (is_string($mixed)) 
    {
        return mb_convert_encoding($mixed, 'UTF-8', 'UTF-8');
    }
    return $mixed;
}
?>
