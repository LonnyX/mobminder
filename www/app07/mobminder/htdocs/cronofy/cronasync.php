<?php
// updated by bspoden

/// !! NEEDS ACCESS TOKEN REFRESHED


require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/mobcronofy.php';


//DebugLog('cronasyn.php.1');
set_time_limit(20);
//DebugLog('cronasyn.php.2');

$body = file_get_contents('php://input');
$data = json_decode($body, true);
//DebugLog('cronasyn.php.3');

$dS_MobCronofy = new MobCronofy($data['accountId'],$data['cronofy_user_id']);
//DebugLog('cronasyn.php.4');

$visitors = array();

foreach($data['visitors'] as $key => $value)
{
    //DebugLog('cronasyn.php.5');

    $visitor = new C_dS_visitor(false,false,$value);

    array_push($visitors,new C_dS_visitor(false,false,$value));
}

DebugLog('cronasync.php/call MobCronofy.UpsertEvent on calendarid='.$data['calendar_id'].' and reservationid='.$data['reservationid']);
              
//external id = event uid if external event
//formerlyexternal = (boolean) true if event id is was an event uid before
$cal= $dS_MobCronofy->UpsertEvent($data['calendar_id'],
                                  $data['reservationid'],
                                  $data['attendeeid'],
                                  $visitors,
                                  $data['description'],
                                  $data['start'],
                                  $data['end'],
                                  $data['color'],
                                  $data['externalid'],
                                  $data['formerlyexternal']);
if(cronofydebug)
{
    if($cal instanceof Exception)      
    {
        $message = $cal instanceof CronofyException ? $cal->error_details() : ' ';
        //file_put_contents(/log/cronasync_'.$data['c'].'.log','x='.$data['x'] . ' ,reservationid=' . $data['reservationid']. ' ,attendeeid=' . $data['attendeeid'].' ,externalid=' . $data['externalid'].' => ERROR: exception code=' . $cal->getCode() .' ,exception message='. $cal->getMessage() .' '.$message . ' ' . print_r($data,true). "\n", FILE_APPEND | LOCK_EX);
    }
    else
    {
        //file_put_contents(/log/cronasync_'.$data['c'].'.log','x='.$data['x'] . ' ,reservationid=' . $data['reservationid']. ' ,attendeeid=' . $data['attendeeid'].' ,externalid=' . $data['externalid']. " => SUCCESS\n", FILE_APPEND | LOCK_EX);
    }
}

?>