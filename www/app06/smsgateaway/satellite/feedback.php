<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   F E E D B A C K    -  report SMS sending status progress
//
//	Calls like:
//  http://localhost/smsgateaway/satellite/feedback.php?cid=32493655599&id=1000000&st=100&web=1
//

require '../sga_lib.php';
$perfReport = new C_perfReport();
setrendermode('..');
if(!$web) { ob_start(); } // relates to (*ob1)


////////////////////////////////////////////////////////////////////////////////
//
// Use case basic flow
//
//
// step 1: satellite calls api/satellite/alive.php?cid=simiccid
//
// 		- the api returns an SMS object, having an SMS id (*1)
//
// 		- the satellite sends the SMS and obtains the operator id
//
//
// step 2: satellite calls api/satellite/feedback.php?cid=simiccid&ost=120&sid=[sms id (1*)]&oid=[the operator id]
//
// 		- the gateaway stores the new status and the operator id
//
//
//
// step 3: some time spans
//
//
//
// step 4: the operator calls the satellite giving a new status for the SMS having operator id (2*)
//
//
//
// step 5: satellite calls api/satellite/feedback.php?cid=simiccid&ost=[see list in sga_list.php]&oid=[the operator id]
//
// 		- the gateaway retrieves the SMS object based on the operator id, and updates the status of this SMS
//


////////////////////////////////////////////////////////////////////////////////
//
// 		I N P U T     P A R A M s    C H E C K    I N 
//


$perfReport->peak('input');

	$iccid = @$_REQUEST['cid']; if(!isset($iccid)) die('error 0500'); // sim card number ICCID
$satellite = C_dS_satellite::login($iccid);


h2('Welcome satellite: '.$satellite->name);


h2('Mandatory parameters for this call: ');

	indent('o <b>cid</b>: your SIM ICCID device number [MMCCII123456789012C].',3);
	indent('o <b>ost</b>: operator status [see possible values at the bottom].',3);
	indent('o <b>sid</b>: the SMS id as provided by the sms gateaway at /satellite/alive call. Only at synchronous send operation.',3);
	indent('o <b>oid</b>: assigned network operator id [integer], must be returned for each call',3);
	pad(0);

$status = @$_REQUEST['ost']; if(!isset($status)) die('error 0530'); // no Status id
	else $status = $status;
if(!is_numeric($status)) die('error 0531'); // Status id must be numeric


$oid = @$_REQUEST['oid']; if(!isset($oid)) die('error 0510'); // no SMS id
if(!is_numeric($oid)) die('error 0511'); // SMS id must be numeric 


	$sa = getopstatusarray('values');
	$sn = getopstatusarray('named');
if(!in_array($status,$sa)) die('error 0532, status '.$status.' not recognized, sms id '.$oid); // unrecognised status id (when multipage sms are sent, we get acknowledged for each page though we record only the last page operator id)



////////////////////////////////////////
//
//  Loading the SMS object
//

$ustatus = sms_status_operator;


/////////////////////////////////////////////
//
// Synchronous feedback when handling the SMS to the opeartor. 

if($status==0xEE||$status==0xAA) { // In this case the satellite must feedback the SMS id we provided to him

	$perfReport->peak('loading sms by id (sms server id)');

	$sid = @$_REQUEST['sid']; if(!isset($sid)) die('error 0520'); // no SMS id
	$pgs = @$_REQUEST['pgs']; if(!isset($pgs)) $pgs = 0; else $pgs = $pgs; if(!is_numeric($pgs)) die('error 0520'); // pgs is the number of pages
	if($sid==-1) die(); // sid = -1 is assigned to notification sms's issued by the satellite (satellite status notification)
	if(!is_numeric($sid)) die('error 0521'); // SMS id must be numeric
		$q = new Q('select id from sms where id = '.$sid.';'); // identify the caller
		$c = $q->cnt();
		if($c==0) die('error 0522'); // unrecognised SMS id
		if($c>1) die('error 0523');  // multiple match for this SMS id
	$smsid = $q->ids();
	$sms = new C_dS_sms($smsid);
	$sms->operator = C_id::tracknow();
	
	if($status>=0xE0&&$status<=0xEE) { // status is rejected at handled to operator, in this case the sms is set in error
		
		$sms->oper_opcode = $status; // rejected
		$ustatus = sms_status_error;
	}
		
	if($status==0xAA) { // = decimal 170, status is accepted at handled to operator, register the opid, next call to feedback will use this opid
	
		// note that in case of multipage SMSs, only the last page oid is reported
		$sms->operatorid = $oid;
		$sms->oper_opcode = $status; // accepted
		$ustatus = sms_status_operator;
	}
	
} else { 

	$perfReport->peak('loading by operator id (sms id from simcard');
/////////////////////////////////////////////
//
// Asynchronous feedback. The operator has called the shield to provide a status for the SMS with oid

	// in case of multipage SMSs, only the last page oid will be recognized
	
	$sid = false;
		$q = new Q('select id from sms where operatorid = '.$oid.' order by id desc limit 1;'); // identify the caller
		$c = $q->cnt();
		if($c==0) die('no match, multipage?'); // die('error 0512'); // unrecognised SMS operatorid - this error will occur in normal condition for satellite spontaneous status reporting through SMS, because those SMS also have an ack feedback while they are not originated from our SMS DB
		if($c>1) die('error 0513'); // multiple match for this SMS operatorid (impossible as now because we limited the query to 1 record)
	$smsid = $q->ids();
	if($smsid) $sms = new C_dS_sms($smsid); //
	
	
// Operator status codes as provided by satellites SIM shields
//
// public enum ESmsReportStatus
// {
        // Success = 0x00, 				// Short message delivered successfully
        // Forwarded = 0x01, 			// Forwarded, but status unknown
        // Replaced = 0x02, 			// Replaced
		
        // Congestion = 0x20, 			// Congestion, still trying
        // Recipientbusy = 0x21, 		// Recipient busy, still trying
        // NoResponseRecipient = 0x22, 	// No response recipient, still trying
        // ServiceRejected = 0x23, 		// Service rejected, still trying
        // QOSNotAvailableStillTrying = 0x24, // QOS not available, still trying
        // RecipientError = 0x25, 		// Recipient error, still trying
		
        // RPCError = 0x40, 				// RPC Error
        // IncompatibleDestination = 0x41, 	// Incompatible destination
        // ConnectionRejected = 0x42, 		// Connection rejected
        // NotObtainable = 0x43, 			// Not obtainable
        // QOSNotAvailable = 0x44, 			// QOS not available
        // NoInternetworkingAvailable = 0x45, // No internetworking available
        // MessageExpired = 0x46, 			// Message expired
        // MessageDeletedBySender = 0x47, 	// Message deleted by sender
        // MessageDeletedBySMSC = 0x48, 	// Message deleted by SMSC
        // DoesNotExist = 0x49, 			//Does not exist 
		
	// 0x60 Remote procedure error.
	// 0x61 Incompatible destination. 
	// 0x62 Connection rejected by the SME. 
	// 0x63 Not obtainable.
	// 0x64 Quality of service not available.
	// 0x65 No interworking available.
	// 0x70 Message validity period expired. 
	// ...0x7F Message deleted by originating SME. Message deleted by SMSC administration. Message does not exist 
	//  (or the SMSC has no knowledge of the associated message). Values specificc to each SMSC.
// }

// https://epdf.pub/mobile-messaging-technologies-and-services-sms-ems-and-mms57649.html
//
// 0x00 - Short message transaction completed.

// 0x02 Permanent error, SMSC is not making delivery attempts anymore.

// 0x10...0x1F Temporary error, SMSC is not making delivery attempts anymore.
// Message successfully received by the recipient SME. Message forwarded by the SMSC to the SME but the SMSC is unable to con?rm delivery. Message has been replaced by the SMSC. Values speci?c to each SMSC.


// 0x20 0x21 0x22 0x23 0x24 0x30...0x3F
// Congestion. SME busy. No response from SME. Service rejected. Quality of service not available. Values speci?c to each SMSC.

// Temporary error, SC still trying to transfer the short message.
// 0x01

// 0x50...0x5F
// Status report codes


// 0x40 0x41 0x42 0x43 0x44 0x45 0x46 0x47 0x48 0x49
// Congestion. SME busy. No response from SME. Service rejected. Quality of service not available. Error in SME. Values specific to each SMSC.

	if($smsid) {
		
		if($status==0x00||$status==0x01||$status==0x02) { // delivered
			$sms->delivered = C_id::tracknow();
			$sms->deli_opcode = $status;
			$ustatus = sms_status_delivered;
		}
		else
		if(($status>=0x20)&&($status<=0x2F)) { // pending
			$sms->pending = C_id::tracknow();
			$sms->pend_opcode = $status;
			
			$ustatus = sms_status_pending;
		}
		else
		if(($status>=0x40)&&($status<=0x4F)) { // errors
			$sms->error = C_id::tracknow();
			$sms->err_opcode = $status;
			$ustatus = sms_status_error;
		}
		else
		if($status>0x4F) {
			$sms->error = C_id::tracknow();
			$sms->err_opcode = $status;
			$ustatus = sms_status_error;
		}
	}
}


h2('You have posted: ');

	indent('o <b>cid</b>: '.$iccid,3);
	indent('o <b>ost</b>: '.$status,3);
	if($sid) indent('o <b>sid</b>: '.$sid,3);
	indent('o <b>oid</b>: '.$oid,3);
	pad(0);
	
	
// now map the operator status to our user api status
//

$perfReport->peak('saving sms');

$sms->status = $ustatus;
$sms->when = C_id::tracknow();
$sms->save();

	$sats = C_dS_satellite::$current_satellites;
if($ustatus==sms_status_error) { // increment satellite performance counter : thishour404
	$sid = $sms->satelliteid;
	new Q('update '.$sats.' set thishour404=thishour404+1, today404=today404+1 where id = '.$sid.';');
}



////////////////////////////////////////////////////////////////////////////////
//
// 		S M S    S T A T U S     C H A N G E     A N D     F E E D B A C K 
//


pad(2);


h2('You posted a new status '.$status.' for sms '.$sid);


	echo '<data>'; // enclose the file content within the stream
		span('&ltdata&gt');
			echo $sms->stream1(no_tracking).$nl;
		span('&lt/data&gt');
	echo '</data>';

	
	pad(); h2('Returned object');
	explainclass(new C_dS_sms(0), false, '|');
	C_dS_sms::explainstatus();

pad(5);
endrendermode();


////////////////////////////////////////////////////////////////////////////////
//
// Close connection ( escape from KEEP_ALIVE !! )
//

if($web) 
 // disabled when testing using browser mode, so the next section can echo on the screen
	$perfReport->dropReport();
else
	$perfReport->logReport('feedback');
	
if(!$web) { // disabled when testing using browser mode, so the next section can echo on the screen
	
	closeconnection();
}



?>