<?php
//////////////////////////////////////////////////////////////////////
//
//  OBTAIN ENCRYPTED VERSION of PASS and LOGIN for a given User  
//

ob_start(); // relates to (*ob1)
require '../classes/language.php';
require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');

if(!isset($_POST['lid'])) die('You have no access to this script');
$lid = $_POST['lid']; // ajax_session.php did check if that is integer
echo 'input lid:'.$lid.$nl;

$dS_login_in = new C_dS_login($lid);

// security
// we basicaly check if the candidate login shares an access with the logged user (calling this script) to the logged account (through an accesskey)
//
	$q = new Q('select id from accesskeys where groupId = '.$lid.' and accountId = '.$accountId.'; -- taycan.php');
if(!$q->ids(list_as_string)) die('mobminder #err80001a');


// obtain data

$dS_login_in->mashcreds($keyId); // see (*cr50*)


// stream data

echo $nl.'<in>'.$dS_login_in->login.'|'.$dS_login_in->password.'</out>'.$nl;



$perfReport->peak('::echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>