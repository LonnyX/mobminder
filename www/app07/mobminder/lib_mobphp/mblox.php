<?php
// This file was kept separate because comm.php is UTF-8 while this should be encoded ANSI !!

/////////////////////////////////////////////////////////////////////////
//
//  S M S    S E N D I N G    T O   O P E R A T O R   m B L O X 
//
//
//  technical spec can be found here http://manage.mblox.com/developers/sms.html#input-parameters
//  the chapter of interest is "HTTP SMS"
//

define('mbloxdevtest', false); // echoes notifications about the sending of messages (normaly cut by the early connection cut)

class mblox_account {
	public $username;
	public $password;
	public function __construct($username,$password) { $this->username = $username; $this->password = $password; }
}
	
class C_mBlox_sms_http {
	
	private $accounts;
	
	public function __construct() {
		
		$s = new C_dS_system(); // open globals table
		
		$this->accounts = Array();
		$this->accounts['FrNtf'] = new mblox_account($s->SMSproviderFrNtf,'tgx23PiQ');
		$this->accounts['BeNtf'] = new mblox_account($s->SMSproviderBeNtf,'tgx23PiQ');
		$this->accounts['Inter'] = new mblox_account($s->SMSproviderInter,'tgx23PiQ');
	}
	
	public function sendOver(&$dS_sms, $maxlen = 160, $retry=false) { // sending twice an sms with identical id = BatchID results in non sending at all (mBlox records batchIDs)
	
		$msg 	= iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $dS_sms->text); // the sms text was built using UTF-8 but is now ISO-8859 latin 1
		$to  	= $dS_sms->toNumber;
		$from  	= $dS_sms->replyNumber;
		
		$dS_sms->correlator = 0;
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover
		
		$msg = substr($msg,0, $maxlen); // trim any text over 3x153 chars ( one sms 3 pages ), (*m11*)
		$from = substr($from,0,11); // trim any text over 11 chars ( sender id max length )
		
			$msglen = strlen($msg);
		$dS_sms->pages = 1; if($maxlen>159) $dS_sms->pages = 1+(int)($msglen/154); // mBlox can send max 3 pages of 153 chars, that is 459 chars (*m11*)
		
	
		//////////////////////////////////////////////////////////////////////
		//
		// Profile setting
		//
			
		$CCode = substr($to,0,2);
		switch($CCode) {
			case '33': $profile = 'FrNtf'; break; // alphanumeric sender Id is possible in France from 3 to 11 characters
			case '32': $profile = 'BeNtf'; $from = 'Mobminder'; break; // never force a numeric sender Id to belgian operators, they would block the sms
			default: $profile = 'Inter'; break;
		}
		$account = $this->accounts[$profile]; // contains appropriate login and password
		
		
		//////////////////////////////////////////////////////////////////////
		//
		// url setup
		//
		
		$un = urlencode($account->username);
		$pw = urlencode($account->password);
        $msg = urlencode($msg);
        $from = urlencode($from);
		
		$dcs = 1; 	// ISO-8859-1 (latin 1), the mBlox server takes care of conversion into GSM alphabet
		$dr = 1; 	// request delivery receipt
		$ur = $dS_sms->id; // user reference (passed back in delivery callback)
		$exp = 1440; // validity period in minutes (we set 24 hours)
		$st = 5; // source type (Alphanumeric)
		$sys = 'H'; // system type (there is no alternative here and no reason explained in the spec)
		
		// $request = "http://sms1.mblox.com:9001/HTTPSMS?S={$sys}&UN=${un}&P={$pw}&DA={$to}&SA={$from}&M={$msg}&UR={$ur}&ST={$st}&DC={$dcs}&DR={$dr}&VP={$exp}";
		
		// new as per 2020-10
		$request = "https://eu1.httpgw.api.sinch.com:443/HTTPSMS?S={$sys}&UN=${un}&P={$pw}&DA={$to}&SA={$from}&M={$msg}&UR={$ur}&ST={$st}&DC={$dcs}&DR={$dr}&VP={$exp}";
		
		if(mbloxdevtest) echo 'Request:<br/>'.$request.'<br/>';
		
		//////////////////////////////////////////////////////////////////////////
		//
		// connect to mBlox server
		//
		
		$ch = curl_init($request);
		$errstr = '';
		
		if (!$ch) {
			$errstr = '(Network 000) Could not connect to server.';
			return $this->dropxcp($errstr, 'sendOver', $dS_sms);
		}
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$serverresponse = curl_exec($ch);

		if(!$serverresponse) { // The server is unreachable
			$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			$errstr = "(HTTP error: $code)";
			return $this->dropxcp($errstr, 'sendOver', $dS_sms);
		}

		// preg_match('/(OK.*)\r$/', $serverresponse, $matches); // The server has given an answear
		preg_match('/^OK?/', $serverresponse, $matches); // The server has given an answear

		if(!isset($matches[0])) { // "OK" was not found in the server answear 
			
			$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
			switch($code) {
				case 200: $errstr = '(Server 200) '.$serverresponse; break;
				case 400: $errstr = '(Server 400) Bad request, check parameters.'; break;
				case 401: $errstr = '(Server 401) Invalid username or password.'; break;
				case 402: $errstr = '(Server 402) Credit too low, payment required.'; break;
				case 503: $errstr = '(Server 503) Invalid destination or destination not covered.'; break;
				case 500: $errstr = '(Server 500) System error, please retry.'; // the server was not available
					if ($retry) { // give it one more chance
						$r = $this->sendOver($dS_sms, $maxlen, true /*retry*/);
						if($r) return $r;
						$errstr = '(Server 500) System error, retry failed.';
					} else {
						return false; // do not drop an exception by the first attempt
					}
					break;
			}
			return $this->dropxcp($errstr, 'sendOver', $dS_sms);
		}

		// SUCCESSFUL mBlox Server response
		//
		// HTTP Header: 200 OK Content: OK messageid [messageidn] [UR:userreference]
		//
		// If all of the above checks are successful for at least 1 of the destination numbers and there is enough credit to send to all 
		// of the destination numbers, a response will be returned with a HTTP header status code of 200 OK. 
		//
		// The response content will contain the word OK followed by 
		//
		// - one or more numeric message ID’s (e.g. 1000000123456789)
		// - the User Reference if one was supplied in the request.
	
		
		// $this->dropxcp($serverresponse, 'sendOver(success)', $dS_sms); // typical : OK 1584336235 UR:6674083
		if(mbloxdevtest) echo $response;
		
		$parts = explode(' ', $serverresponse); //  Example of a successfull single SMS sending feedback: "OK 1368499233 UR:1807954"

			$mblox_id = $parts[1];
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->correlator = $mblox_id;
		$dS_sms->status = sms_handled;
		
		if(mbloxdevtest) {
			echo '</br>&nbsp;</br>';
			print_r($dS_sms);
			echo '</br>&nbsp;</br>';
		}
		return true;
		
	}
	
	
	//////////////////////////////////////////////////////////////////////
	//
	// 		mBlox Callback
	//
	
	public function mBloxCalling() {
		
		global $_REQUEST;
		$input = @$_REQUEST['INCOMING']; 
		// The HTTP Callback Input Parameter is 'INCOMING'
		
		if(mbloxdevtest) // test tip: change the userref (1138630) with an id of an existing sms in the test DB, so the process will find an SMS and change the status
			$input = "2#1128173:447111111111:447000000000:1:0:1180019698:1138630:#-1:447111111112:447000000003:1:1180019700::48656C6C6F:eee";
		
		// Process the data
		$feedbacks = $this->splitInput($input) or die("OK");

		// Sort out by type and record
		$this->determineType($feedbacks);
		
		// The HTTP Callback Input Parameter is INCOMING and the callback script should respond to 
		// the HTTP POST with 200 OK to acknowledge receipt of the delivery reports and inbound SMS. 
		// Any other status code will be regarded as an error and the request will be attempted at 30 minutes intervals for six hours.
		//
		die('OK');
	}
	
	
	
	//////////////////////////////////////////////////////////////////////
	//
	// 		Private function
	//
	
	private function dropxcp($errstr, $function, $dS_sms=false) {
		
		if(mbloxdevtest) {
			echo('<br/>ERROR dropxcp ('.$errstr.')<br/>');
			return false;
		}
		
			if($dS_sms) $fn = 'mBlox '.$function.'(resa:'.$dS_sms->reservationId.', tmpl:'.$dS_sms->templateId.')';
				else $fn = 'mBlox '.$function.'(no dS_sms object)';
			
			$grpId = 0; if($dS_sms) $grpId = $dS_sms->groupId;
		C_dS_exception::put(get_class(), $fn, $errstr, $grpId);
		
		if($dS_sms) {
			$dS_sms->correlator = 0; // mblox does not give any correlator
			$dS_sms->status = sms_error;
		}
		return false;
	}

	
	private function determineType($feedbacks) {
		
		// An incoming SMS will always have the first field equal to -1.	
		//
			
		if(!is_array($feedbacks)) return;
		
		if(count($feedbacks) > 0) {
			foreach ($feedbacks as $fb) {
				if ($fb[0] == "-1") $this->incomingSMS($fb); 
					else $this->deliveryReceipt($fb);
				
				if(mbloxdevtest) echo "<br/>";
			}
		}
	}
	
	private function splitInput($input) {
		
		// FORMAT
		//
		// N#[MessagePart1][#MessagePartX]
		//
		// Field			Description
		// 
		// N				Count of delivery receipts and inbound SMS. Range: 0-100.
		// #				Message separator. Always present.
		// [MessagePart1]	First delivery report or incoming SMS.
		// #MessagePartX]	Message separator followed by another delivery report or inbound SMS.
		//
		// The number of message parts is limited to 100 at a time. 
		// A message part will be either a delivery report or an inbound SMS. 
		// The format for both is described below.
		
		if ($input == "0#") return true; // take it for a "Hello"
		
		$receipts = explode("#", $input);

		$msgCount = array_shift($receipts); // drops the heading message count

		$feedbacks = array();

		foreach ($receipts as $receipt) {
			if ($receipt == "") {
				continue;
			}
			$field = explode(":", $receipt);
			array_push($feedbacks, $field); // an array like { 0:1128173:447111111111:447000000000:1:0:1180019698:AF31C0D: , 1:#1128174:447111111111:447000000000:1:0:1180019698:AF31C0D: , ... }
		}
		return $feedbacks;
		
	}
	

	private function deliveryReceipt($receipt) {
		
		// MESSAGE PART FORMAT - DELIVERY REPORT
		// A delivery receipt will always have the first field MSGID > 0.
		//
		// MSGID:[SOURCE]:DESTINATION:STATUS:[ERRORCODE]:DATETIME:[USERREF]:
		//
		// Field		Description
		//
		// :			Field separator. There will always be exactly 7 colons per delivery report.
		// MSGID		Positive numeric message ID matching the one returned in the SMS request response.
		// [SOURCE]		Optional source address (originator).
		// DESTINATION	A single destination number.
		// STATUS		Positive numeric delivery receipt status code.
		// [ERRORCODE]	Optional GSM error code consisting of up to 6 hexadecimal characters. 
		// 				Most routes do not return the GSM error code.
		// DATETIME		A 10 digit UTC timestamp representing the date and time that the 
		// 				delivery receipt was received, in GMT
		// [USERREF]	If a User Reference was supplied with the SMS request, 
		// 				it will be displayed here.
		//

		// Typical on receiving one successfull single SMS feedback: "1#1368499233:11111111112:32493655599:1::1477569823:1807954:"
		// Where 
		// 1368499233 is the mBlox reference id
		// 1807954 is our Mobminder SMS id
		// Note that the ERRORCODE field is empty (successfull senfing)
		// The STATUS field is 1 (delivered)

		$mBloxId 	= $receipt[0];
		$source 	= $receipt[1];
		$destination = $receipt[2];
		$status 	= $receipt[3];
		$errcode 	= $receipt[4];
		$datetime 	= $receipt[5];
		$userref 	= $receipt[6];

		
		if(mbloxdevtest) {
			echo "MSGID: $receipt[0]<br/>";
			echo "SOURCE: $receipt[1]<br/>";
			echo "DESTINATION: $receipt[2]<br/>";
			echo "STATUS: $receipt[3]<br/>";
			echo "ERRORCODE: $receipt[4]<br/>";
			echo "DATETIME: $receipt[5]<br/>";
			echo "USERREF: $receipt[6]<br/>";
		}
		
			$o_dbAccess_sms = new C_dbAccess_sms();
		$correlator = $userref; // Mobminder SMS id
		$o_dbAccess_sms->loadOnId($correlator); // should retrieve only one item
		
		if(!$o_dbAccess_sms->count()) { $this->dropxcp('could not retrieve SMS base on id:'.$correlator, 'deliveryReceipt'); return; }
		if($o_dbAccess_sms->count()>1) { $this->dropxcp($o_dbAccess_sms->count().' SMS records found based on id:'.$correlator, 'deliveryReceipt'); return; }
			
		
		// sms was found in DB thanks to its correlator
		$dS_sms = $o_dbAccess_sms->last(); // retrieve the first item in array

		
		// mBlox DELIVERY REPORT STATUS CODES
		//
		// A delivery receipt will contain a status code with one of the following values:
		//
		// Status Code	Name		Description
		// 1			DELIVERED	Message delivered to the handset
		// 2			BUFFERED	Message buffered, usually because it failed first time and is now being retried
		// 3			FAILED		The message failed to deliver. The GSM error code may give more information
		// 5			EXPIRED		Message expired as it could not be delivered within the validity period
		// 6			REJECTED	Message rejected by SMSC
		// 7			ERROR		SMSC error, message could not be processed
		// 11			UNKNOWN		Unknown status, usually generated after 24 hours if no status has been returned from the SMSC
		// 12			UNKNOWN		Unknown status, SMSC returned a non standard status code

		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->opStatus = $status;
		if($errcode) $dS_sms->opStatus.= '/'.$errcode;
		
		// Mobminder REPORT STATUS CODES
		//
		
		switch($status) { // modify sms status on Mobminder interface according to provider status passed
				
			case '1': 
				$dS_sms->status = sms_delivered;
				break;
			case '2': 
				$dS_sms->status = sms_pending;
				break;
			case '3': 
			case '4': 
			case '5': 
			case '6': 
			case '7': 
				$dS_sms->status = sms_discarded;
				break;
			case '11': 
			case '12': 
				$dS_sms->status = sms_handled;
				
				break;
			default:
				$this->dropxcp('error: mBlox status could not be matched:'.$status, 'deliveryReceipt', $dS_sms);
		}
		
		// save back to db
		$dS_sms->dSsave(); 
		
		
		// 
		//
		// http://manage.mblox.com/developers/sms.html#delivery-error-codes

		// Hex	Decimal	Error Name	         		Description         	Duration	Error From	Relating To
		//
		// 0	0		No Error					The message delivered successfully	Permanent	MSC	Mobile Handset
		// 1	1		Unknown Subscriber			The MSISDN is inactive or no longer active.	Permanent	HLR	Destination Network
		// 2	2		Unknown Subscriber -npdb	Mismatch Fault in Number Portability Database or HLR of MSISDN range holder. Occurs more frequently if number ported more than once in certain countries.	Permanent	MSC	Destination Network
		// 5	5		Unidentified Subscriber		Occurs when the MSC that a message has been sent to is not aware of the subscriber IMSI. Suggests HLR has not been updated or MSC malfunction.	Temporary	MSC	Destination Network
		// 6	6		Unknown						It cannot be determined whether this message has been delivered or has failed due to lack of final delivery state information from the carrier.	Permanent	MSC	Destination Network
		// 9	9		Illegal Subscriber			Rejection due to failed authentication or filtering.	Temporary	MSC	Destination Network
		// A	10		No Translation for Address	Destination number is not a valid mobile number or its routing cannot be determined.	Permanent	TRANSPORT	Signalling
		// B	11		Teleservice Not Provisioned	Rejection due to subscription not supporting SMS.	Permanent	HLR	Mobile Handset/Destination Network
		// C	12		Illegal Equiptment			Rejection due to subscription, handset or network not supporting SMS.	Temporary	MSC	Mobile Handset/Destination Network
		// D	13		Call Barred					Rejection due to subscription or network not allowing SMS.	Temporary	HLR	Mobile Handset/Destination Network
		// 15	21		Facility Not Supported		Rejection due to subscription not supporting SMS.	Temporary	MSC	Destination Network
		// 1B	27		Absent Subscriber			Subscriber handset is not logged onto the network due to it being turned off or out of coverage. Likely to have been unavailable for 12 hours or more.	Temporary	HLR	Mobile Handset
		// 1C	28		Absent subscriber no-pageresponse	Subscriber handset is not reachable on the network due to it being turned off or out of coverage. Likely to have very recently become unavailable.	Temporary	MSC	Mobile Handset
		// 1D	29		Absent subscriber IMSI-detached		Subscriber handset is not reachable on the network due to it being turned off or out of coverage. Likely to have been unavailable for several hours.	Temporary	MSC	Mobile Handset
		// 1E	30		Controlling MSC Failure	The MSC that the subscriber is currently registered to is experiencing a fault.	Temporary	MSC	Destination Network
		// 1F	31		Subscriber Busy For MT-SM	MSC is busy handling an exisiting transaction with the handset. The subscriber could be currently receiving an SMS at exactly the same time.	Temporary	MSC	Mobile Handset
		// 20	32		Equipment notSMEquipped		Recieving handset or equipment does not support SMS or an SMS feature. This is temporary because the subscriber could switch to a different device.	Temporary	MSC	Mobile Handset
		// 21	33		Memory Capacity Exceeded	Rejection due to subscriber handset not having the memory capacity to recieve the message. Likely to have been in state for 12 hours or more.	Temporary	HLR	Destination Network
		// 22	34		System Failure				Rejection due to SS7 protocol or network failure.	Temporary	MSC	Destination Network
		// 23	35		Data Missing				Rejection due to subscriber network decoding error or signalling fault.	Temporary	MSC	Destination Network
		// 24	36		Unexpected Data Value		Rejection due to subscriber network decoding error or signalling fault.	Temporary	MSC	Destination Network
		// 25	37		System Failure				Rejection due to SS7 protocol or network failure.	Temporary	HLR	Destination Network
		// 26	38		Data Missing				Rejection due to subscriber network decoding error or signaling fault.	Temporary	HLR	Destination Network
		// 27	39		Unexpected Data Value		Rejection due to subscriber network decoding error or signaling fault.	Temporary	HLR	Destination Network
		// 28	40		Memory capacity Exceeded	Rejection due to subscriber handset not having the memory capacity to receive the message. Likely to have run out of capacity recently.	Temporary	MSC	Destination Network
		// 45	69		Generic delivery failure	Generic delivery failure	Permanent	MSC	Destination Network
		// 8C	140		SS7 Communication Error	Internal SMSC error due to invalid message syntax.	Temporary	SMSC	Message Construction
		// A0	160		Absent subscriber IMSI-detached	Internal SMSC error caused by SS7 link/dialogue fault.	Temporary	SMSC	Destination Network/Signalling
		// C8	200		Unable to decode response	SMSC cannot decode the response received from destination network due to an encoding or protocol fault.	Temporary	SMSC	Destination Network/Signalling
		// C9	201		Provider Abort				Subscriber network or signalling partner has terminated the signalling connection, preventing message transmission.	Temporary	TRANSPORT	Destination Network/Signalling
		// CA	202		User Abort					Subscriber network or signalling partner has rejected the signalling connection, preventing message transmission.	Temporary	TRANSPORT	Destination Network/Signalling
		// CB	203		Timeout						Subscriber network not recieving packets from SMSC, or not responding to them. Alternatively, a 3rd party signalling partner may not be routing correctly.	Temporary	TRANSPORT	Destination Network/Signalling
		// CD	205		Timeout-PAB					Subscriber network or signalling partner has not responded to signalling connection setup or maintenance packets.	Temporary	TRANSPORT	Destination Network/Signalling
		// CE	206		Rejected					Subscriber network refuses signalling connection or message packet.	Permanent	TRANSPORT	Destination Network
		// CF	207		Local Cancel				Signalling with destination network has been prevented by SMSC partner or signalling partner.	Permanent	CARRIER	SMSC Partner Routing/Signalling
		// 12C	300		Screening or Blocking		SMSC partner or 3rd party signalling partner has prevented messages being sent to this MSISDN or destination network.	Permanent	CARRIER	SMSC Partner Routing/Signalling
		// 12D	301		Carrier Syntax Error		SMSC partner has rejected the message due to an unacceptable message parameter.	Permanent	CARRIER	SMSC Partner Platform/Message Construction
		// 12E	302		Carrier Internal Error		SMSC partner could not process this message due to a platform fault, but it will be retired.	Temporary	CARRIER	SMSC Partner Platform
		// 12F	303		Carrier Internal Error		SMSC partner could not process this message due to a platform fault and it will not be retried.	Permanent	CARRIER	SMSC Partner Platform
		// 130	304		Carrier Routing Error		SMSC partner cannot route this message currently, but it will be retried.	Temporary	CARRIER	SMSC Partner Platform/Signalling
		// 131	305		Carrier Routing Error		SMSC partner cannot route this message and it will not be retried.	Permanent	CARRIER	SMSC Partner Platform/Signalling
		// 3E7	999		Congestion					SS7 signalling link at destination network, SMSC, or 3rd party signalling partner is overloaded.		
		
	}

	private function incomingSMS($sms) {
		
		// MESSAGE PART FORMAT - INBOUND SMS
		//
		// -1:[SOURCE]:DESTINATION:DCS::DATETIME:[UDH]:[MESSAGE]
		//
		// Field		Description
		//
		// :			Field separator. There will always be 7 colons per message part.
		// -1			If this field is -1 then the message part is an incoming SMS.
		// DESTINATION	Optional source address (originator).
		// [SOURCE]		A single destination number.
		// DCS			The Data Coding Scheme. Default 1.
		// DATETIME		A 10 digit UTC timestamp representing the date and time 
		// 				that the incoming SMS was received, in GMT.
		// [UDH]		User Data Header hex value, if the message is a binary message.
		// MESSAGE		The message text in hex encoded form. Binary will also be hex encoded. 
		// 				Unicode will be represented in UCS2 hex.
		//
			
		if(mbloxdevtest) {
			echo "SOURCE: $sms[1]<br/>";
			echo "DESTINATION: $sms[2]<br/>";
			echo "DCS: $sms[3]<br/>";
			echo "DATETIME: $sms[5]<br/>";
			echo "UDH: $sms[6]<br/>";
			echo "MESSAGE: ", pack("H*", $sms[7]), "<br/>";
		}
	}

}
















/////////////////////////////////////////////////////////////////////////
//
//  C O N N E C T I O N    T O    S M S    O P E R A T O R S 
//
//         D E C O M M I S S I O N N E D      I N T E R F A C E S
//
//    We keep them for the differente examples of connection server to server
//
//		2019 - the connection used is in file ./mblox.php
//

function cleanUpUTF8chars($text) { // prevents SMS providers to switch messages to UTF8 70 chars/page
	$search  = array('ô', 'â', 'ê', 'ï', 'ë', 'ü', '°', 'ç', '&');
	$replace = array('o', 'a', 'e', 'i', 'e', 'u', 'o', 'c', '-');
	return str_replace($search, $replace, $text);
}


class C_dataConnect_smsAPI_pl { // Obsolete -- not used anywhere - poland
	
	// www.smsapi.pl / mobminder / dioxine / account Id: 2697
	// Contact: Pawel Bielinski - p.bielinski@smsapi.pl
	//
	
	public function sendOver(&$dS_sms, $maxlen = 160) {
	
	// encodings:
	// ANSI set of 217 characters = Windows-1252
	//
	// expected by SMSAPI: (check http://en.wikipedia.org/wiki/ISO/IEC_8859-1)
	// 'iso-8859-1'  => sending ô, â, ê, ï, ë, ü implies one page to be 70chars iso 160. Admitted: é è ù à
	// 'iso-8859-2'
	// 'iso-8859-3'
	// 'iso-8859-4'
	// 'iso-8859-5'
	// 'iso-8859-7'
	// 'windows-1250' <= default for SMSapi.pl
	// 'windows-1251'
	// 'utf-8'
	
		$id = $dS_sms->id;
		$text = $dS_sms->text;
		$to  = $dS_sms->toNumber;
		$from  = $dS_sms->replyNumber;
		
			$textl = strlen($text);
		$dS_sms->pages = 1; if($maxlen>160) $dS_sms->pages = 1+(int)($textl/154); // mBlox can send max 3 pages of 153 chars, that is 459 chars (*m11*)

		// if($to == $from) return $dS_sms->status = sms_iso; // trying to send an sms to group reply number
		$dS_sms->correlator = 0;
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover
			
		$text = substr(stripslashes($text),0,$maxlen); // trim any text over 160 chars ( one sms page )
		$from = substr(stripslashes($from),0,11); // trim any text over 11 chars ( sender id max length )		
		$username 	= 'mobminder';
		$password 	= hash('md5','dioxine');
		
		// older: sending UTF8 format multiplies the number of pages (70 chars/page in UTF8)
		// $message	= cleanUpUTF8chars($text); //iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
		// $urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&from='.$from.'&encoding=utf8&message='.urlencode($message).'&idx='.$id;
		
		$message	= iconv('UTF-8', 'ISO-8859-1//TRANSLIT', cleanUpUTF8chars($text)); // converts UTF-8 that we have in DB, into Latin1 (this is the trick!!! watch out!)
		
		
		// $urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&from='.$from.'&encoding=ISO-8859-1&message='.urlencode($message).'&idx='.$id;
		$urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&encoding=ISO-8859-1&message='.urlencode($message).'&idx='.$id;
		
		// !! Note: fopen will time out if the firewall does not allow communication to this server
		$file = fopen('http://api.smsapi.pl/send.do'.$urlTrailer,'r');
		$result = fread($file,1024); // result like OK:09121622027323511:41261569600
		fclose($file);
		if (substr($result,0,3)=='OK:') { // then this upload is a success
			$trailer = substr($result,3); // drops the heading 3 chars: 'OK:'
			$parts = explode(':',$trailer);
			$msgId = $parts[0]; 
			$dS_sms->correlator = $msgId;
			$dS_sms->status = sms_handled;
		}
		else { // FAILURE => drop an exception
			C_dS_exception::put(get_class(), 'sendOver','sms could not be sent: error msg ='.$result.' url:'.$urlTrailer);
			$dS_sms->status = sms_error;
			return false;
			
		}
		return true;
	}

	public function feedback() { // call back from provider in order to specify sms status @ operator side
	
		// manual test example: be.mobminder.com/feedback/smsapi.php?MsgId=1366102843105613490&status=404&idx=370406&test=1
		// for this kind of feedback call, check errors on server in /var/log/apache2/be.mobminder.com-error.log
	
		$correlator 	= @$_REQUEST['MsgId']; // Message ID
		$providerStatus = @$_REQUEST['status']; // Status of SMS described in specifiaction (Dodatek nr 1)
		$idx 			= @$_REQUEST['idx'];	// Optional – idx value which was sent with SMS
		$test 			= @$_REQUEST['test'];	// 
		
		// $donedate = $_REQUEST['donedate'];	// Time (in timestamp) of delivery report
		// $username = $_REQUEST['username'];	// Username from which message was sent

		// echo $correlator.$providerStatus;
		if(!isset($correlator) || !isset($providerStatus)) { echo 'OK'; return; }
		
		$arCorrelators 	= explode(',',$correlator); // !!!! Many feedbacks come in one call, split over!
		$arStatus 		= explode(',',$providerStatus);
		$arIdx 			= explode(',',$idx);
		
		foreach($arIdx as $index => $id) {
			$dS_sms = new C_dS_sms($id);
			if($dS_sms->correlator != $arCorrelators[$index]) {
				// searching the db for this correlator did not give any result:
				// this sms is not in the sms table anymore OR there is correlator mismatch
				
				if($test) {
					echo 'EXCEPTION feedback smsapi : sms id:'.$id.' sms correlator:'.$arCorrelators[$index].' does not match correlator in sms table:'.$dS_sms->correlator.'<br/>';
				}
				else {
					C_dS_exception::put(get_class(), 'feedback smsapi','sms id:'.$id.' sms correlator:'.$arCorrelators[$index].' does not match correlator in sms table:'.$dS_sms->correlator);
				}
				continue; 
			}
			$dS_sms->statusChangeStamp = C_date::getNow();
			$status = trim($arStatus[$index]);
			$dS_sms->opStatus = $status;
			switch($status) { // modify sms status according to provider status passed
				case '409': 	// "QUEUED": 
				case '403': 	// "SENT": 
					$dS_sms->status = sms_pending;
					break;
				case '404': 	// "DELIVERED to handset": 
					$dS_sms->status = sms_delivered;
					break;
				case '405': 	// "UNDELIVERED - TIME OUT": 
				case '402': 	// "EXPIRED": 
				case '407': 	// "REJECTED": 
				case '408': 	// "UNKNOWN": 
				case '406': 	// "FAILED": 
					$dS_sms->status = sms_discarded;
					break;
				default:				
					if($test) {
						echo 'EXCEPTION feedback smsapi : sms id:'.$id.' error: status could not be matched:'.$status.'<br/>';
					}
					else {
						// dump an exception log as we could not open the socket at provider side
						C_dS_exception::put(get_class(), 'feedback smsapi',"sms id:".$id." error: status could not be matched:".$status);
					}
					break;
			}
			$dS_sms->dSsave();
			
			if($test) {
				$dS_sms->testDisplay();
				echo '<br/>';
			}
		}
		if($test) {
			echo '<br/>';
			$cleanUp = new C_dbAccess_sms();
			$cleanUp->deleteOnGroup($dS_sms->groupId); // cleans up all SMSs generated by the smsapi-test page		
		}
		echo 'OK'; // smsapi protocol
	}
}


class C_dataConnect_smsAPI_com { // Obsolete -- not used anywhere - poland !! .com is different from .pl
	
	// www.smsapi.com / mobminder / dynaudio6a / account Id: 2697
	// Contact: Pawel Bielinski - p.bielinski@smsapi.pl
	//
	
	public function sendOver(&$dS_sms, $maxlen = 160) {
	
	// encodings:
	// ANSI set of 217 characters = Windows-1252
	//
	// expected by SMSAPI: (check http://en.wikipedia.org/wiki/ISO/IEC_8859-1)
	// 'iso-8859-1'  => sending ô, â, ê, ï, ë, ü implies one page to be 70chars iso 160. Admitted: é è ù à
	// 'iso-8859-2'
	// 'iso-8859-3'
	// 'iso-8859-4'
	// 'iso-8859-5'
	// 'iso-8859-7'
	// 'windows-1250' <= default for SMSapi.pl
	// 'windows-1251'
	// 'utf-8'
	
		$id = $dS_sms->id;
		$text = $dS_sms->text;
		$to  = $dS_sms->toNumber;
		$from  = $dS_sms->replyNumber;
		
			$textl = strlen($text);
		$dS_sms->pages = 1; if($maxlen>160) $dS_sms->pages = 1+(int)($textl/154); // mBlox can send max 3 pages of 153 chars, that is 459 chars (*m11*)

		// if($to == $from) return $dS_sms->status = sms_iso; // trying to send an sms to group reply number
		$dS_sms->correlator = 0;
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover
			
		$text = substr(stripslashes($text),0,$maxlen); // trim any text over 160 chars ( one sms page )
		$from = substr(stripslashes($from),0,11); // trim any text over 11 chars ( sender id max length )		
		$username 	= 'mobminder';
		$password 	= hash('md5','dynaudio6a');
		
		// older: sending UTF8 format multiplies the number of pages (70 chars/page in UTF8)
		// $message	= cleanUpUTF8chars($text); //iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
		// $urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&from='.$from.'&encoding=utf8&message='.urlencode($message).'&idx='.$id;
		
		$message	= iconv('UTF-8', 'ISO-8859-1//TRANSLIT', cleanUpUTF8chars($text)); // converts UTF-8 that we have in DB, into Latin1 (this is the trick!!! watch out!)
		
		
		// $urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&from='.$from.'&encoding=ISO-8859-1&message='.urlencode($message).'&idx='.$id;
		$urlTrailer = '?username='.$username.'&password='.$password.'&to='.$to.'&encoding=ISO-8859-1&message='.urlencode($message).'&idx='.$id;
		
		// !! Note: fopen will time out if the firewall does not allow communication to this server
		$file = fopen('http://api.smsapi.com/send.do'.$urlTrailer,'r');
		$result = fread($file,1024); // result like OK:09121622027323511:41261569600
		fclose($file);
		if (substr($result,0,3)=='OK:') { // then this upload is a success
			$trailer = substr($result,3); // drops the heading 3 chars: 'OK:'
			$parts = explode(':',$trailer);
			$msgId = $parts[0]; 
			$dS_sms->correlator = $msgId;
			$dS_sms->status = sms_handled;
			$dS_sms->opStatus = 1;
		}
		else { // FAILURE => drop an exception
			C_dS_exception::put(get_class(), 'sendOver','sms could not be sent: error msg ='.$result.' url:'.$urlTrailer);
			$dS_sms->status = sms_error;
			$dS_sms->opStatus = $result;
			return false;
			
			// 8 Error in request (Please report)
			// 11 Message too long or there is no message or parameter nounicode is set and special characters (including Polish characters) are used.
			// 12 Message has more parts than defined in &max_parts parameter.
			// 13 Lack of valid phone numbers (invalid or blacklisted numbers)
			// 14 Wrong sender name
			// 17 FLASH message cannot contain special characters
			// 18 Invalid number of parameters
			// 19 Too many messages in one request
			// 20 Invalid number of IDX parameters
			// 25 Parameters &normalize and &datacoding musn't appear in the same request.
			// 27 Too long IDX parameter. Maximum 255 chars.
			// 28 Invalid time_restriction parameter value. Available values are: FOLLOW, IGNORE or NEAREST_AVAILABLE.
			// 30 Wrong UDH parameter when &datacoding=bin
			// 40 No group with given name in phonebook
			// 41 Chosen group is empty
			// 50 Messages may be scheduled up to 3 months in the future
			// 52 Too many attempts of sending messages to one number (maximum 10 attempts whin 60s)
			// 53 Not unique idx parameter, message with the same idx has been already sent and&check_idx=1.
			// 54 Wrong date - (only unix timestamp and ISO 8601)
			// 56 The difference between date sent and expiration date can't be less than 1 and more tha 12 hours.
			// 70 Invalid URL in notify_url parameter.
			// 72 -
			// 74 Sending date doesn't match date sent restrictions set for the account.
			// 101 Invalid authorization info
			// 102 Invalid username or password
			// 103 Insufficient credits on Your account
			// 104 No such template
			// 105 Wrong IP address (for IP filter turned on)
			// 110 Action not allowed for your account
			// 200 Unsuccessful message submission
			// 201 System internal error (please report)
			// 202 Too many simultaneous request, message won't be sent
			// 203 Too many requests. Please try again later.
			// 301 ID of messages doesn't exist
			// 400 Invalid message ID of a status response
			// 999 System internal error (please report)
			
		}
		return true;
	}
}


class C_dataConnect_mBlox_uk { // Obsolete -- not used anywhere - watch the note
	
	private function fspost($host, $post) {
		$nl = chr(10);
		
		$headers 	 = 'POST /send HTTP/1.1'.$nl;
		$headers 	.= 'Content-type: application/x-www-form-urlencoded'.$nl;
		$headers 	.= 'Host: '.$host.$nl;
		$headers 	.= 'Content-length: '.strlen($post).$nl;
		$headers 	.= 'User-Agent: Mobminder'.$nl;
		
		$errno = null;
		$errstr = null;
		$fp = @fsockopen($host, 8180, $errno, $errstr, 2); // 2 seconds time out
		if(!$fp) return false;
		fputs($fp, $headers.$nl);
		fputs($fp, $post);
		
		$lines = Array(); while(!feof($fp)) {
			$line = trim(fgets($fp,256)); 
			if($line=='0') break; // mBlox has no EOF finishing their document.
			$lines[] = $line; unset($line);
		}
		
		fclose($fp); // reading the feedback
		return $lines;
	}
	
	public function sendOver(&$dS_sms, $maxlen = 160) { // sending twice an sms with identical id = BatchID results in non sending at all (mBlox records batchIDs)
	
		$id 	= $dS_sms->id;
		$text 	= $dS_sms->text; 
		$to  	= $dS_sms->toNumber;
		$from  	= $dS_sms->replyNumber;
		
		$dS_sms->correlator = 0;
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover

		$text = substr(stripslashes($text),0, $maxlen); // trim any text over 3x153 chars ( one sms 3 pages ), (*m11*)
		$from = substr(stripslashes($from),0,11); // trim any text over 11 chars ( sender id max length )
		
			$textl = strlen($text);
		$dS_sms->pages = 1; if($maxlen>159) $dS_sms->pages = 1+(int)($textl/154); // mBlox can send max 3 pages of 153 chars, that is 459 chars (*m11*)
		
	
		//////////////////////////////////////////////////////////////////////
		//
		// Profile setting
		//
		// L'émetteur alphanumérique est possible en France de 3 à 11 caractères
		// Il faut pour cela utiliser le profil 22193 (réservé aux messages de service, ex rappel de RDV) en mettant comme type d'émetteur alpha (au lieu de SC actuellement)
		//
		// <Profile>22193</Profile>
        // 		<SenderID Type="Alpha">Dr Martin</SenderID>
		//
			
		$profile = '22190'; // should be used for UK and other countries
		$CCode = substr($to,0,2);
		if($CCode=='32') { $profile = '22191'; $from = 'Mobminder'; } // route to shortcode Belgium (no sender Id)
		if($CCode=='33') $profile = '22193'; // route to shortcode France ( sender Id activated )
		
		// $CCode = substr($to,0,3);
		// if($CCode=='594') { $profile = '22193'; /*$to = '33'.substr($to,3);*/ } // route to shortcode France and french Guyana ( sender Id activated )
		
	
		//////////////////////////////////////////////////////////////////////////
		
		$xml = '<?xml version="1.0"?>
<NotificationRequest Version="3.5">
	<NotificationHeader>
		<PartnerName>Mobminder</PartnerName>
		<PartnerPassword>KrJQEvJt</PartnerPassword>
	</NotificationHeader>
		<NotificationList BatchID="'.$id.'">
			<Notification SequenceNumber="1" MessageType="SMS">
				<Message>'.$text.'</Message>
				<Profile>'.$profile.'</Profile>
				<SenderID Type="Alpha">'.$from.'</SenderID>
				<Subscriber>
					<SubscriberNumber>'.$to.'</SubscriberNumber>
				</Subscriber>
			</Notification>
		</NotificationList>
</NotificationRequest>';

		// echo 'XML 1 :['.$xml.']'; // investigating the LAGADEC phenomenoun ($xml is cut in between and mBlox returns code 9 - bad xml)

		$xml 	= iconv('UTF-8', 'ISO-8859-1//TRANSLIT', cleanUpUTF8chars($xml));
		
		// echo 'XML 2 :['.$xml.']';
		
		$post 	= 'XMLDATA='.urlencode($xml);
		
		// echo 'XML 3 :['.$post.']';
		
		// return false;
		
		$host1 = 'xml9.mblox.com'; // $host1 = 'xml5.mblox.com:8180/send';
		$host2 = 'xml10.mblox.com'; // $host2 = 'xml6.mblox.com:8180/send';
		
		if(!($lines = $this->fspost($host1, $post))) { $lines = $this->fspost($host2, $post);	}
		if(!$lines) {
			// dump an exception log as we could not open the socket at provider side
			$dS_sms->correlator = 404; // mblox does not give any correlator
			$dS_sms->status = sms_error;
			C_dS_exception::put(get_class(), 'mBlox sendOver','sms id:'.$id.' error: socket could not open');
			return false;
		}

// <xml version="1.0" encoding="ISO-8859-1" >
// <NotificationRequestResult Version="3.5">
// 		<NotificationResultHeader>
// 			<PartnerName>UserName</PartnerName>
// 			<PartnerRef></PartnerRef>
// 			<RequestResultCode>0</RequestResultCode>
// 			<RequestResultText>OK</RequestResultText>
// 		</NotificationResultHeader>
// 		<NotificationResultList>
// 			<NotificationResult SequenceNumber="1">
// 			<NotificationResultCode>0</NotificationResultCode>
// 			<NotificationResultText>OK</NotificationResultText>
// 				<SubscriberResult>
// 					<SubscriberNumber>447900000000</SubscriberNumber>
// 					<SubscriberResultCode>0</SubscriberResultCode>
// 					<SubscriberResultText>OK</SubscriberResultText>
// 					<Retry>0</Retry>
// 				</SubscriberResult>
// 			</NotificationResult>
// 		</NotificationResultList>
// </NotificationRequestResult>
		
		
		$messages = array(); // keyed by SequenceNumber
		$h = false; // request header
		
		$inHeader = false; // notification request header entered
		$inNotif = false; // notification request header entered
		$inMessage = false; // notification request header entered
			$inRequestResultCode = false; // notification file entered
			$RequestResultText = false;
			$sn = 0;
		foreach($lines as $line) {
			// echo $line.chr(10); // uncomment to check the mblox host response to the request
		
			// header
			if($line=='</NotificationResultHeader>') { $inHeader = false; }// we are leaving a notification tag
			if($line=='<NotificationResultHeader>') {  // starting a notification section
				$inHeader = true; 
				$h = array('headercode'=>false, 'headertext'=>'');
			}
			if($inHeader) {
				if(strpos($line,'<RequestResultCode>')!==false) $h['headercode'] = getTextBetweenTags($line,'RequestResultCode');
				if(strpos($line,'<RequestResultText>')!==false) $h['headertext'] = getTextBetweenTags($line,'RequestResultText');
			
			
				// list
				if($line=='</NotificationResult>') { $inNotif = false; $sn = 0; }// we are leaving a notification tag
				if(substr($line, 0, 14)=='<NotificationResult ') {  // starting a notification section
					$inNotif = true; 
					$sn = getTextBetweenTags($line,'"');
					$messages[$sn] = array('notifcode'=>false, 'notiftext'=>'', 'msgcode'=>false, 'msgtext'=>'');
				}
				if($inNotif) {
					if(strpos($line,'<NotificationResultCode>')!==false) $messages[$sn]['notifcode'] = getTextBetweenTags($line,'NotificationResultCode');
					if(strpos($line,'<NotificationResultText>')!==false) $messages[$sn]['notiftext'] = getTextBetweenTags($line,'NotificationResultText');
				
					// messages
					if($line=='</SubscriberResult>') { $inMessage = false; }// we are leaving a notification tag
					if($line=='<SubscriberResult>') {  // starting a notification section
						$inMessage = true; 
					}
					if($inNotif && inMessage) {
						if(strpos($line,'<SubscriberResultCode>')!==false) $messages['msgcode'] = getTextBetweenTags($line,'SubscriberResultCode');
						if(strpos($line,'<SubscriberResultText>')!==false) $messages['msgtext'] = getTextBetweenTags($line,'SubscriberResultText');
					}
				}
			}
		}
		
		$ok = false;
		if($h) if($h['headercode']=='0') $ok = true;
		
		if(!$ok) {
			$errormsg = 'the error code is '.($h?$h['headercode']:'no error code').' error message is '.($h?$h['headertext']:'no error msg');
				$fn = 'mBlox sendOver(resa:'.$dS_sms->reservationId.', tmpl:'.$dS_sms->templateId.')';
				$errormsg .= ' ['.$xml.']'; 
			C_dS_exception::put(get_class(), $fn, $errormsg, $dS_sms->groupId);
			$dS_sms->correlator = 500; // mblox does not give any correlator
			$dS_sms->status = sms_error;
		} else {
			$dS_sms->statusChangeStamp = C_date::getNow();
			$dS_sms->correlator = $id; // mblox does not give any correlator
			$dS_sms->status = sms_handled;
		}
		return $ok;
	}
}



// $postdata = array('var1'=>'test', 'var2'=>'test');
// $data = file_get_contents('Signatur.jpg');
// $filedata = array('inputname', 'filename.jpg', $data);
// echo PostToHost ("localhost", 80, "/test3.php", $postdata, $filedata);


class C_dataConnect_smsACTION_be { // Obsolete -- not used anywhere - Uncommissionned provider // Example of connection by socket, keep this code
	
	public function sendOver(&$o_dS_sms) {
	
		$id = $o_dS_sms->id;
		$text = $o_dS_sms->text;
		$to  = $o_dS_sms->toNumber;
		$from  = $o_dS_sms->replyNumber;
		if($to == $from) return $o_dS_sms->status = sms_iso; // trying to send an sms to group reply number
		$o_dS_sms->correlator = 0;
		$o_dS_sms->statusChangeStamp = C_date::getNow();
		$o_dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover

		$text = substr(stripslashes($text),0,160); // trim any text over 160 chars ( one sms page )
		$from = substr(stripslashes($from),0,12); // trim any text over 11 chars ( sender id max length )
		
		// www.smsaction.be  MO9136-SA olimagoo
		
		$post 		 = "nichandle=" .urlencode('MO9136-SA')."&";
		$post 		.= "hash=md5&";
		$post 		.= "passphrase=" .urlencode(hash('md5','olimagoo'.$to)) ."&"; //tgx23PiQ
		$post 		.= "senderid=" .urlencode($from)."&";
		$post 		.= "number=" .urlencode($to)."&";
		$post 		.= "coding=1&"; // forces the GSM 0338 (no special characters, but 160 chars)
		$post 		.= "content=" .urlencode($text);

		$headers 	 = "POST /push/ HTTP/1.0\r\n"; // !! keep double quotes here: they convert \n into special chars
		$headers 	.= "Content-type: application/x-www-form-urlencoded\r\n";
		$headers 	.= "Host: api.smsaction.be\r\n";
		$headers 	.= "Content-length: " . strlen($post) . "\r\n";
		$headers 	.= "User-Agent: SMSAction Client\r\n";

		$errno = null;
		$errstr = null;
		$response = "";
		$fp = @fsockopen("api.smsaction.be", 80, $errno, $errstr, 2); // we don't want to lock execution of our pages for more than 2 seconds (client is waiting)
		if ($fp) {
				fputs($fp, $headers."\r\n");
				fputs($fp, $post);
				while(!feof($fp))
					$response .= fgets($fp,128);
					
				fclose($fp);

				$response = split("\r\n\r\n", $response);
				$msgId = $response[1];
			
				switch(trim($msgId)) {
					case "ERROR SYSTEM": 			//  == provider down
					
					case "INCORRECT TIMESTAMP": 	//  (si utilisé)
					case "ERROR IDENTIFICATION": 	//  == numéro ou nom 11char maxi
					case "UNKNOW CONTENT": 			//  == vide
					case "UNKNOW NUMBER": 			//  == vide
					case "ERROR PASSPHRASE": 		// 
					case "ERROR NICHANDLE": 		// 
					case "NOT SEND": 		// 
					case "0":
						// dump an exception log as we could not handle properly the sms
						$o_dS_sms->status = sms_error;
						C_dS_exception::put(get_class(), "sendOver","sms id:".$id." error: ".$msgId);
						return false;
						break;
						
					default:
						// we got a regular sms correlator, return to caller
						$o_dS_sms->correlator = $msgId;
						$o_dS_sms->status = sms_handled;
						return true;
				}
		} else { 
			// dump an exception log as we could not open the socket at provider side
			C_dS_exception::put(get_class(), "sendOver","sms id:".$id." error: socket could not open");
			return false;
		}
		
		return false;
	}

	public function feedback() { // call back from provider in order to specify sms status @ operator side
	
		$correlator = $_REQUEST['msgid'];
		$providerStatus = $_REQUEST['status'];
		
		// echo $correlator.$providerStatus;
		if(!isset($correlator) || !isset($providerStatus)) return;
		
		$o_dbAccess_sms = new C_dbAccess_sms();
		$o_dbAccess_sms->loadOnCorrelator($correlator); // should retrieve only one item
		
		if($o_dbAccess_sms->count()) { // has found an item
			$o_dS_sms = &$o_dbAccess_sms->last(); // retrieve the first item in array
			$o_dS_sms->statusChangeStamp = C_date::getNow();
			
			switch(trim($providerStatus)) { // modify sms status according to provider status passed
				case '3': // "buffered": 
				case '1': // "gateway": 
				case '2': // "queued":
					$o_dS_sms->status = sms_pending;
					break;
				case '4': // "handset": 
					$o_dS_sms->status = sms_delivered;
					break;
				case '5': // "timeout": 
				case '6': // "error": 
					$o_dS_sms->status = sms_discarded;
					break;
				default:
				// dump an exception log as we could not open the socket at provider side
				C_dS_exception::put(get_class(), "feedback","sms id:".$o_dbAccess_sms->id." error: status could not be matched:".$providerStatus);
			}
			
			// save back to db
			$o_dbAccess_sms->testDisplay();
			$o_dbAccess_sms->save($o_dS_sms->id);
		} else {
			
			// searching the db for this correlator did not give any result:
			C_dS_exception::put(get_class(), "feedback","sms correlator:".$correlator." does not match");
		
		}
		unset($o_dbAccess_sms); // close db connect 
	}
}





?>