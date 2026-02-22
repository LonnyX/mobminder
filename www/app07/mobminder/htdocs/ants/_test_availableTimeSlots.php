<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 

header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');

require './antslib.php';
ob_start(); // relates to (*ob1)



$params = [ 'meeting_point_ids' => Array('71076','71118'), 'start_date'=>'2022-11-01','end_date'=>'2022-11-30','reason'=>'CNI','documents_number'=>'1'];
// $params = [ 'meeting_point_ids' => '71076', 'start_date'=>'2022-11-01','end_date'=>'2022-11-30','reason'=>'CNI','documents_number'=>'1'];
// $params = [ 'meeting_point_ids' => '71118', 'start_date'=>'2022-11-01','end_date'=>'2022-11-30','reason'=>'CNI','documents_number'=>'1'];
//$params = [ 'meeting_point_ids' => ['71076','71118'] , 'start_date'=>'2022-11-01','end_date'=>'2022-11-30','reason'=>'CNI','documents_number'=>'1'];

// $p = '?meeting_point_ids=201&meeting_point_ids=203&start_date=2022-11-01&end_date=2022-11-30&reason=CNI&documents_number=1';



$result = curl('http://localhost/app05/htdocs/ants/availableTimeSlots.php',$params);
// $result = curl('https://fr.mobminder.com/ants/availableTimeSlots',$params);

$j = json_decode($result);
echo $nl.'========================= Mobminder Response =============== ';
echo $nl.$result;
echo $nl.'========================= Decoded Response =============== ';
echo $nl;
print_r($j);

closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>