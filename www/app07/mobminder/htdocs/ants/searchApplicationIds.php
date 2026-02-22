<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 

header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');

require './antslib.php';
ob_start(); // relates to (*ob1)


Check_Auth_Token();
$applids = Array();


$r = ''; $sep = ''; foreach($applids as $applid => $dSet_jason) { $r .= $sep.'"'.$applid.'":'.$dSet_jason; $sep = ','.$nl; } // $r .= $sep.'"'.$id.'":'.$dSet_jason;
echo '{'.$r.'}';


// $echo = '['.implode(',',$applids).']';
// echo $echo;

if(0) {
	echo $nl;
	print_r($_GET);
}
closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>