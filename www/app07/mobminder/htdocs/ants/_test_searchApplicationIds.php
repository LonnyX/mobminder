<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 

header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');

require './antslib.php';
ob_start(); // relates to (*ob1)


$params = [ 'application_ids' => ['6123155111','6123155222'] ];

$result = curl('http://localhost/app05/htdocs/ants/searchApplicationIds.php',$params);
$j = json_decode($result);

echo $nl.'========================= Mobminder Response =============== ';
echo $nl.$result;
echo $nl.'========================= Decoded Response =============== ';
echo $nl;
print_r($j);

closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>