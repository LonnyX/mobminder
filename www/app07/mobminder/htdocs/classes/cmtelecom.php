<?php
// This file was kept separate because comm.php is UTF-8 while this should be encoded ANSI !!

/////////////////////////////////////////////////////////////////////////
//
//  S M S    S E N D I N G    T O   O P E R A T O R   C M   T E L E C O M 
//
//
//  technical spec can be found here API http : https://docs.cmtelecom.com/bulk_sms/v1.0
//
//  Backoffice : https://login.cmtelecom.com/		pascal.vanhove@mobminder.com / Dynaudio6a
// 
//  Product Token est le : A4028A17-81F6-4C30-8D0B-68AC5753F1A6
//
//  .be = 0.042€
//	.fr = 0.0315€
//	.lu = 0.008€
// 	.ch = 0.022€
//


define('cmteldevtest', true); // echoes notifications about the sending of messages (normaly cut by the early connection cut)

class cmtel_account {
	public $username;
	public $password;
	public function __construct($username,$password) { $this->username = $username; $this->password = $password; }
}

class C_CMtelecom {
	
	public function __construct() {
		
	}
	
	static public function buildMessageXml($from, $recipient, $message, $reference) {
		
      $xml = new SimpleXMLElement('<MESSAGES/>');

      $authentication = $xml->addChild('AUTHENTICATION');
		$authentication->addChild('PRODUCTTOKEN', 'A4028A17-81F6-4C30-8D0B-68AC5753F1A6');

      $msg = $xml->addChild('MSG');
		  $msg->addChild('FROM', $from);
		  $msg->addChild('TO', $recipient);
		  $msg->addChild('BODY', $message);
		  $msg->addChild('REFERENCE', $reference);
		  $msg->addChild('DCS', '7');
		  $msg->addChild('MINIMUMNUMBEROFMESSAGEPARTS', '1');
		  $msg->addChild('MAXIMUMNUMBEROFMESSAGEPARTS', '8');

      return $xml->asXML();
    }
	
	public function sendOver(&$dS_sms, $maxlen = 160) { // sending twice an sms with identical id = BatchID results in non sending at all (cmtel records batchIDs)
	
		$msg 	= iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $dS_sms->text); // the sms text was built using UTF-8 but is now ISO-8859 latin 1
		$to  	= $dS_sms->toNumber;
		$from  	= $dS_sms->replyNumber;
		
		$dS_sms->correlator = $dS_sms->id;
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_retry; // we assume failure and change back to sms_handled only in case of successfull handover
		
		$msg = substr($msg,0, $maxlen); // trim any text over 3x153 chars ( one sms 8 pages ), (*m11*)
		$from = substr($from,0,11); // trim any text over 11 chars ( sender id max length )
		
			$msglen = strlen($msg);
		$dS_sms->pages = 1; if($maxlen>159) $dS_sms->pages = 1+(int)($msglen/154); // cmtel can send max 8 pages of 153 chars, that is 459 chars (*m11*)
		
	
		// $xml = self::buildMessageXml($from, $to, $msg, $dS_sms->correlator);

		// $ch = curl_init(); // cURL v7.18.1+ and OpenSSL 0.9.8j+ are required
		// curl_setopt_array($ch, array(
			// CURLOPT_URL				=> 'https://smpp12.cm.nl/gateway.ashx',
			// CURLOPT_PORT			=> 30000,
			// CURLOPT_HTTPHEADER		=> array('Content-Type: application/xml'),
			// CURLOPT_POST			=> true,
			// CURLOPT_POSTFIELDS		=> $xml,
			// CURLOPT_RETURNTRANSFER	=> true
			// )
		// );

		// $serverresponse = curl_exec($ch);
		// $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		// curl_close($ch);
		

		//////////////////////////////////////////////////////////////////////
		//
		// url setup
		//
		// producttoken=00000000-0000-0000-0000-000000000000&body=Example+message+text&to=00447911123456&from=SenderName&reference=your_reference
		
		$pt = 'producttoken=A4028A17-81F6-4C30-8D0B-68AC5753F1A6';
        $msg = 'body='.urlencode($msg);
        $to = 'to=00'.$to;
        $from = 'from='.urlencode($from);
        $corr = 'reference='.$dS_sms->correlator; // user reference (passed back in delivery callback)
		$dcs = 'dcs=0';
		$parts = 'maximumnumberofmessageparts=8';
		
		
		$request = 'https://sgw01.cm.nl/gateway.ashx?'.$pt.'&'.$msg.'&'.$to.'&'.$from.'&'.$corr.'&'.$dcs.'&'.$parts;
		
		if(cmteldevtest) echo chr(10).'Request:'.$request;
		
		//////////////////////////////////////////////////////////////////////////
		//
		// connect to cmtel server
		//
		
		$ch = curl_init($request);
		$errstr = '';
		
		if(!$ch) {
			$errstr = '(Network 000) Could not initialize curl.';
			return $this->dropxcp($errstr, 'sendOver', $dS_sms);
		}
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

		$serverresponse = curl_exec($ch);
		$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

		curl_close($ch);
		
		if(cmteldevtest) {
			echo chr(10).chr(10).'Server code:['.$code.']'.chr(10);
			echo 'Server Response:['.$serverresponse.']'.chr(10);
		}
		
		//////////////////////////////////////////////////////////////////////////
		//
		// server response treatment
		//
		
		if($serverresponse) {
			
			switch($code) {
				case 400: $errstr = '(Server 400) Nothing was posted.'; break;
				case 401: $errstr = '(Server 401)'; break;
				case 402: $errstr = '(Server 402)'; break;
				case 503: $errstr = '(Server 503)'; break;
				case 500: $errstr = '(Server 500)'; break; // the server was not available
					
				case 200: $errstr = '(Server 200) '.$serverresponse; break;
					break;
			}
			return $this->dropxcp($errstr, 'sendOver', $dS_sms);
		}

		
		// SUCCESSFUL cmtel Server response
		//
		// HTTP Header: 200
		//
		// If all of the above checks are successful for at least 1 of the destination numbers and there is enough credit to send to all 
		// of the destination numbers, a response will be returned with a HTTP header status code of 200 OK. 
		//
		// The response content will contain the word OK followed by 
		//
		// - one or more numeric message ID’s (e.g. 1000000123456789)
		// - the User Reference if one was supplied in the request.
	
		$response = $matches[1]; 
		
		if(cmteldevtest) if($serverresponse) echo $serverresponse; else echo 'The server accepted the request';

			
		$dS_sms->statusChangeStamp = C_date::getNow();
		$dS_sms->status = sms_handled;
		
		if(cmteldevtest) {
			echo chr(10).'----------------------'.chr(10);
			print_r($dS_sms);
			echo chr(10).'----------------------'.chr(10);
		}
		
		return true;
	}
	
	
	
	//////////////////////////////////////////////////////////////////////
	//
	// 		mBlox Callback
	//
	
	public function CMtelecomCalling() {
		
		global $_REQUEST;
		$input = @$_REQUEST['INCOMING']; 
		
		//
		// http://be.mobminder.com/feedback/cmtelecom.php?CREATED_S=[CREATED_S]&DATETIME_S=[CREATED_S]
		//			&GSM=[CREATED_S]&REFERENCE=[CREATED_S]&STANDARDERRORTEXT=[CREATED_S]
		//			&STATUS=[CREATED_S]&STATUSDESCRIPTION=[CREATED_S]
		//
		
		die('OK');
	}
	
	
	//////////////////////////////////////////////////////////////////////
	//
	// 		Private function
	//
	
	private function dropxcp($errstr, $function, $dS_sms=false) {
		
		if(cmteldevtest) {
			echo(chr(10).'dropxcp('.$errstr.')');
			return false;
		}
		
			if($dS_sms) $fn = 'cmtel '.$function.'(resa:'.$dS_sms->reservationId.', tmpl:'.$dS_sms->templateId.')';
				else $fn = 'cmtel '.$function.'(no dS_sms object)';
			
		C_dS_exception::put(get_class(), $fn, $errstr, $dS_sms->groupId);
		
		if($dS_sms) {
			$dS_sms->correlator = 0; // cmtel does not give any correlator
			$dS_sms->status = sms_error;
		}
		return false;
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
		// 1368499233 is the cmtel reference id
		// 1807954 is our Mobminder SMS id
		// Note that the ERRORCODE field is empty (successfull senfing)
		// The STATUS field is 1 (delivered)

		$cmtelId 	= $receipt[0];
		$source 	= $receipt[1];
		$destination = $receipt[2];
		$status 	= $receipt[3];
		$errcode 	= $receipt[4];
		$datetime 	= $receipt[5];
		$userref 	= $receipt[6];

		
		if(cmteldevtest) {
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

		
		// cmtel DELIVERY REPORT STATUS CODES
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
				$this->dropxcp('error: cmtel status could not be matched:'.$status, 'deliveryReceipt', $dS_sms);
		}
		
		// save back to db
		$dS_sms->dSsave(); 
		
		
		// 
		//
		// http://manage.cmtel.com/developers/sms.html#delivery-error-codes

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
}


?>