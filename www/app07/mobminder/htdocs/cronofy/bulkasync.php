<?php
// updated by bspoden

require '../../lib_mobphp/dbio.php';
require '../../lib_cronofy/mobcronofy.php';

//DebugLog('bulkasync called');

set_time_limit(60);

$body = file_get_contents('php://input');
if (empty($body))
{
    BulkDebugLog(-1,'bulkasync.error : body is empty');
}
else
{
    $data = json_decode($body, true);
    //BulkDebugLog(-1,'body='.$body);

    BulkDebugLog($data['id'],'bulkasync (cronofyuserid='.$data['cronofy_user_id'].', id='.$data['id'].') calling batch api...');

    $dS_MobCronofy = new MobCronofy($data['accountId'],$data['cronofy_user_id']);

    $ret = $dS_MobCronofy->CallBatch($data['events']);

    if($ret instanceof Exception)      
    {   
        $message = $ret instanceof CronofyException ? $ret->error_details() : ' ';
        //$msg = "batch error : reservationid=" . $reservation->id. " ,attendeeid=" . $attendee_id." ,externalid=" . $externalid." => ERROR: exception code=" . $ret->getCode() .' ,exception message='. $ret->getMessage() .' '.$message;
        $msg = 'bulkasync (cronofyuserid='.$data['cronofy_user_id'].', id='.$data['id'].') => ERROR: exception code=' . $ret->getCode() .' ,exception message='. $ret->getMessage() .' '.$message;
        BulkDebugLog($data['id'],$msg);
    }
    else
    {
        //$msg = "batch success : reservationid=" . $reservation->id. " ,attendeeid=" . $attendee_id." ,externalid=" . $externalid." => SUCCESS";
        $msg = 'bulkasync (cronofyuserid='.$data['cronofy_user_id'].', id='.$data['id'].') => SUCCESS';
        BulkDebugLog($data['id'],$msg);
    }
   
}
function BulkDebugLog($id,$log)
{
    if(cronofydebug)
    {
        $time = @date('[d/M/Y:H:i:s]');
        $result = file_put_contents(__DIR__.'/log/bulkasync_'.$id.'.log',$time.' - ' . $log . "\n", FILE_APPEND | LOCK_EX);
    }
}
?>