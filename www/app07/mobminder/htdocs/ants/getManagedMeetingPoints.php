<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 
//
// If you need to test this api through a curl command on linux console, this is what you need:
//
// curl --location --request GET 'https://fr.mobminder.com/ants/getManagedMeetingPoints' \ --header 'x-hub-rdv-auth-token: [ANTS]{mobminder}proj2023.v01'
//
//

header('Content-Encoding: none');
header('Content-Type: text/plain; charset=UTF-8');

require './antslib.php';
ob_start(); // relates to (*ob1)

// header('X-Hub-Rdv-Auth-Token: THIS IS MY TOKEN'); // when calling ANTS

Check_Auth_Token();

// $dS_chalon 		= new C_dS_Municipality((string)'71076','3644','Chalon-Sur-Saone',(float)'4.853470',(float)'46.78063','3 place de l\'Hôtel de Ville','71100','Chalon-Sur-Saone','CSS','www.chalon.fr','');
$dS_chatenoy 	= new C_dS_Municipality((string)'71118','4584','Châtenoy-le-Royal',(float)'4.81028',(float)'46.79409','10 rue du Bourg','71880','Châtenoy-le-Royal','CLR','www.chatenoyleroyal.fr','');

$municipalities = Array();
// $municipalities[] = json_encode($dS_chalon);
$municipalities[] = json_encode($dS_chatenoy);


$echo = '['.implode(',',$municipalities).']';
echo $echo;

if(0) {
	echo $nl.$nl;
	print_r($_SERVER);
	echo $nl;
	print_r($_GET);
}
closeconnection(); // escapes from Apache2 KEEP_ALIVE

?>