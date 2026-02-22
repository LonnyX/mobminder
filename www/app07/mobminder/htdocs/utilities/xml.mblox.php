<?php

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     m B L O X      F E E D B A C K     T E S T    S T U B 
//

define('localdevtest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it
define('fakeTime', '2011-01-05 9:01:46'); 


$systemLog = 'mblox feedback';
if(localdevtest) {
	require '../classes/language.php'; 
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/comm.php';
} else {
	require '/var/www/mobminder/htdocs/classes/language.php'; 
	require '/var/www/mobminder/lib_mobphp/dbio.php'; 
	require '/var/www/mobminder/lib_mobphp/comm.php'; 
}


function abort($errorcode, $errormsg, $handle = false, $filename = false) { 
	if($handle) fclose($handle);
	if($filename) unlink($filename);
	if(localdevtest) echo '##'.$errorcode.'##'.'error: '.$errormsg.chr(10);
		else
			C_dS_exception::put('mblox feedback', 'main','errorcode:'.$errorcode.', errormsg:'.$errormsg);
	die('Ok');
};
function msg($msg) { if(localdevtest) echo $msg.chr(10); };


if(!count($_FILES)) abort(1,'No file has been posted');

foreach($_FILES as $postname => $filedescritpion) { break; } // we read only one file in this script

// $_FILES comes like:
// 	Array
// 	(
// 		[3038_824420_4] => Array
// 		(
// 			[name] => Cobrastyle.mp3
// 			[type] => audio/mpeg
// 			[tmp_name] => C:\Program Files\EasyPHP-12.1\tmp\php825.tmp
// 			[error] => 0
// 			[size] => 4323985
// 		)
// )

switch ($filedescritpion['error']) {
	case UPLOAD_ERR_OK: break;
	case UPLOAD_ERR_NO_FILE: abort(1,'No file received'); break;
	case UPLOAD_ERR_INI_SIZE:
	case UPLOAD_ERR_FORM_SIZE: abort(2,'The file size is exceeding limits'); break;
	default: abort(1, 'Unknown upload error');
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Reading file attributes
//

$size 		= $filedescritpion['size']+0;
$pathnamext = $filedescritpion['tmp_name'];
$name 		= $filedescritpion['name'];
$type 		= $filedescritpion['type'];
$ext 		= pathinfo($name, PATHINFO_EXTENSION);
$dir 		= pathinfo($pathnamext, PATHINFO_DIRNAME);

if(localdevtest) {
	echo 'name: '.$name.chr(10);
	echo 'type: '.$type.chr(10);
	echo 'extension: '.$ext.chr(10);
	echo 'pathnamext: '.$pathnamext.chr(10);
	echo 'directory: '.$dir.chr(10);
		$dispsize = (((100*$size)/1024)|0)/100;
	echo 'size: '.$dispsize.' Kbytes'.chr(10);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// opening file
//

if(!file_exists($pathnamext)) abort(5, 'No corresponding file in temp dir: '.$pathnamext);
$handle = fopen($pathnamext,'r'); if(!$handle) abort(6, 'The file exists but could not be opened: '.$pathnamext);
$line1 = fgets($handle); if($line1=='') abort(7, 'The file is empty', $handle, $pathnamext);

msg('File opened: '.$pathnamext);

	// lines delimitor
	//
	$crlf = 0;
	if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; msg('Lines are feeded with CRLF'); }
		else if(substr($line1,-1)==chr(10)) { $crlf = 1; msg('Lines are feeded with LF'); }
	msg('First line: |'.substr($line1,0,strlen($line1)-$crlf).'|');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Reading file
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

$lcount = 0; $table = array();
$ackCount = 0; 
$inNotification = false; // notification file entered
	$inMsgReference = false; // notification file entered
	$inStatus = false;
	$inReason = false;
	$n = false; // notification
	$id = 0;
while(!feof($handle)) {
	$line = trim(fgets($handle));
	if($line=='</Notification>') { // we are leaving a notification tag
		$table[$id] = $n; 
		if(localdevtest) { 
			$display = 'notification: id='.$id.', nmbr='.$n['SubscriberNumber'].', status='.$n['Status'].', reason='.$n['Reason'];
			msg(chr(9).$display); 
		}
		$inNotification = false;
	}
	if($line!=='<NotificationList>' && substr($line, 0, 14)=='<Notification ') {  // starting a notification section
		$ackCount++; $inNotification = true; 
		$id = getParameter($line,'BatchID'); // fetches the value in double quotes from e.g. BatchID="546789"
		$n = array('SubscriberNumber'=>false, 'Status'=>false, 'Reason'=>false);
	}
	if($inNotification) {
		if(strpos($line,'<SubscriberNumber>')!==false) $n['SubscriberNumber'] = getTextBetweenTags($line,'SubscriberNumber');
		if(strpos($line,'<Status>')!==false) $n['Status'] = getTextBetweenTags($line,'Status');
		if(strpos($line,'<Reason>')!==false) $n['Reason'] = getTextBetweenTags($line,'Reason');
	}
	$lcount++;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Recording acknowledgements in DB
//
if(count($table)) foreach($table as $id => $n) {
	
	$o_dbAccess_sms = new C_dbAccess_sms();
	$correlator = $id;
	$o_dbAccess_sms->loadOnCorrelator($correlator); // should retrieve only one item
	if(!$o_dbAccess_sms->count()) {
		// searching the db for this correlator did not give any result:
		$error = 'sms correlator: '.$correlator.' does not match';
		abort(10, $error, $handle, $pathnamext);
		continue;
	}
	// sms was found in DB thanks to its correlator
	$o_dS_sms = $o_dbAccess_sms->last(); // retrieve the first item in array
	$o_dS_sms->statusChangeStamp = C_date::getNow();
	$providerStatus = $n['Reason'];
	switch($providerStatus) { // modify sms status according to provider status passed
		case '1': // "buffered phone": 
		case '2': // "buffered smsc":
		case '3': // "acked": 
			$o_dS_sms->status = sms_pending;
			break;
		case '4': // "handset/delivered": 
			$o_dS_sms->status = sms_delivered;
			break;
		case '5': // "timeout": 
		case '6': // "lost": 
			$o_dS_sms->status = sms_discarded;
			break;
		default:
			// dump an exception log as we could not open the socket at provider side
			$error = 'sms id:'.$o_dS_sms->id.' error: status could not be matched:'.$providerStatus;
			abort(10, $error, $handle, $pathnamext);
	}
		
	// save back to db
	$o_dS_sms->dSsave(); 
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Closing file and ending process
//
fclose($handle);
if(unlink($pathnamext)) msg('The temp file has been properly deleted'); 
	else msg('Could not delete the temp file '.$pathnamext); 
msg('##0## process successful, goodbye.');
echo 'OK';
?>