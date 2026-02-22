<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     m B L O X      F E E D B A C K      - NOT IN USE !!
//

define('localdevtest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2011-01-05 9:01:46'); 


$systemLog = 'mblox feedback';
if(localdevtest) {
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
} else {
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/smsgateaway.php';
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}


function abort($errorcode, $errormsg) { 
	if(localdevtest) echo '##'.$errorcode.'##'.'error: '.$errormsg.chr(10);
		else 
			C_dS_exception::put('mblox feedback', 'main','errorcode:'.$errorcode.', errormsg:'.$errormsg);
	die('Ok');
};
function msg($msg) { if(localdevtest) echo $msg.chr(10); };


$xml = @$_REQUEST['XMLDATA'];
if(!isset($xml)) abort(7, 'xmldata is not set');

$lines = explode(chr(10), $xml);

if(!count($lines)) abort(8, 'xmldata is empty');

if(count($lines)==1) abort(9, 'xmldata was not split properly, it counts a single line');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Reading XML Variable
//

// <xml version="1.0" encoding="ISO-8859-1">
// <NotificationService Version="2.3">
// <Header>
// 		<Partner>UserName</Partner>
// 		<Password>Password</Password>
// 		<ServiceID>1</ServiceID>
// </Header>
// <NotificationList>
// 		<Notification BatchID="1" SequenceNumber="1">
// 			<Subscriber>
// 				<SubscriberNumber>447900000000</SubscriberNumber>
// 				<Status>Delivered</Status>
// 				<TimeStamp>200412181548</TimeStamp>
// 				<MsgReference>111040222919362</MsgReference>
// 				<Reason>4</Reason>
// 			</Subscriber>
// 		</Notification>
// </NotificationList>
// </NotificationService>

$table = array();
$inNotification = false; // notification file entered
	$inMsgReference = false; // notification file entered
	$inStatus = false;
	$inReason = false;
	$n = false; // notification
	$id = 0;
foreach($lines as $line) {
	$line = trim($line);
	if($line=='</Notification>') { // we are leaving a notification tag
		$table[$id] = $n; 
		if(localdevtest) { 
			$display = 'notification: id='.$id.', nmbr='.$n['SubscriberNumber'].', status='.$n['Status'].', reason='.$n['Reason'];
			msg(chr(9).$display); 
		}
		$inNotification = false;
	}
	if($line!=='<NotificationList>' && substr($line, 0, 14)=='<Notification ') {  // starting a notification section
		$inNotification = true; 
		$id = getParameter($line,'BatchID'); // fetches the value in double quotes from e.g. BatchID="546789"
		$n = array('SubscriberNumber'=>false, 'Status'=>false, 'Reason'=>false);
	}
	if($inNotification) {
		if(strpos($line,'<SubscriberNumber>')!==false) $n['SubscriberNumber'] = getTextBetweenTags($line,'SubscriberNumber');
		if(strpos($line,'<Status>')!==false) $n['Status'] = getTextBetweenTags($line,'Status');
		if(strpos($line,'<Reason>')!==false) $n['Reason'] = getTextBetweenTags($line,'Reason');
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Recording acknowledgements in DB
//
if(!count($table)) abort(10, 'No notification was found in the xmldata');
	else foreach($table as $id => $n) {
	
	$o_dbAccess_sms = new C_dbAccess_sms();
	$correlator = $id;
	$o_dbAccess_sms->loadOnId($correlator); // should retrieve only one item
	if(!$o_dbAccess_sms->count()) {
		// searching the db for this correlator did not give any result:
		$error = 'sms correlator: '.$correlator.' does not match';
		abort(11, $error);
		continue;
	}
	// sms was found in DB thanks to its correlator
	$o_dS_sms = $o_dbAccess_sms->last(); // retrieve the first item in array
	$o_dS_sms->statusChangeStamp = C_date::getNow();
		$providerStatus = $n['Reason'];
	$o_dS_sms->opStatus = $providerStatus;
	
	switch($providerStatus) { // modify sms status according to provider status passed
	
			// check this source for error codes: https://my.mblox.com/docs/sms.html#smpp-delivery-status-codes
			
		case '1': // "not yet been delivered due to a phone related problem"
		case '2': // "not yet been delivered due to some carrier related problem"
		case '3': // "accepted by the operator" 
		case '21': // "insufficient subscriber credit "
		case '24': // "subscriber is temporarily absent, e.g. their phone is switched off, they cannot be located on the network"
			$o_dS_sms->status = sms_pending;
			break;
		case '4': // "handset/delivered": 
			$o_dS_sms->status = sms_delivered;
			break;
		case '5': // "undelivered but no detailed information related to the failure is known"
		case '6': // "lack of final delivery state information, cannot determine whether this message has been delivered"
		case '8': // "expired: could not be delivered within the life time of the message"
			$o_dS_sms->status = sms_discarded;
			break;
		case '20': // "Invalid Originator (Shortcode)"
		case '23': // "Absent subscriber (incorrect / invalid / blacklisted / or permanently barred)"
		case '25': // "failed due to a temporary condition in the carrier network"
		case '26': // "failed due to a temporary phone related error, e.g. SIM card full, SME busy, memory exceeded"
		case '27': // "handset is permanently incompatible or unable to receive this type of message (e.g. MMS compatibility)"
		case '28': // "rejected due to suspicion of SPAM on the operator network"
		case '29': // "content or parameter is missing or not permitted on the network/short code"
		case '30': // "subscriber has reached the predetermined spend limit for the current billing period"
		case '33': // "failed age verification checks for the requested content"
		case '43': // "the carrier has blacklisted the number"
		case '49': // "service denied: carrier or the end user has blocked third party content to this number"
		case '74': // "message was failed due to the roaming"
		case '89': // "Verizon Shortcode blocking by subscriber"
			$o_dS_sms->status = sms_discarded;
			
			break;
		default:
			// dump an exception log as we could not match the status
			$error = 'sms id:'.$o_dS_sms->id.' error: status could not be matched:'.$providerStatus;
			abort(19, $error);
	}
		
	// save back to db
	$o_dS_sms->dSsave(); 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Closing file and ending process
//

msg('##0## process successful, goodbye.');
echo 'OK';
?>