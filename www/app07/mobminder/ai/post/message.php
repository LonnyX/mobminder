<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   P O S T   A N    S M S   O R    E M A I L    M E S S A G E
//
//              
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);
$lid = $context->dS_login->id;

$who = $context->dS_login->firstname; // who is talking to AI
$view = $context->resources->viewIds; // view is false when all resources are visible to this login, or a comalist when the view is limited
$aid = $context->accountid;
$dS_account = $context->dS_account;




$perfReport->peak('::context setup');

$do = 1; // for debug work, by setting $do to 0, you prevent the system to actually send messages
$dorequest = @$_REQUEST['do']; if(isset($dorequest)) { // you can force the value of $do on the get part of the url
	if(!is_numeric($dorequest)) abort('3400','"do" must be numeric');
	if($dorequest!=0&&$dorequest!=1) abort('3400','"dorequest" must be zero or one');
	$do = $dorequest;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

h2('Input fields check up');
	
	
	h3('Checking for mandatory fields');
	
		$channel = @$_REQUEST['channel']; if(isset($channel)) $channel = $channel; else $channel = false;
		if($channel===false) abort('3400','missing mandatory field "channel"');
		if(!is_numeric($channel)) abort('3400','"channel" must be numeric');
		if($channel!=0&&$channel!=1) abort('3400','"channel" must be zero or one');
		switch($channel) {
			case 0: $maxlen = 4096; break; // emails: which is approx 700 words.
			case 1: $maxlen = 450; break; // sms: which is 3 sms pages of 150 chars each.
		}
		// from here on, $channel is either 0 or 1
		wo_indent('o channel: '.$channel.' ('.($channel==1?'sms':'email').') ',6);
		
		$addresseeclass = @$_REQUEST['addresseeclass']; if(isset($addresseeclass)) $addresseeclass = $addresseeclass; else $addresseeclass = false;
		if(!$addresseeclass) abort('3400','missing mandatory field \'addresseeclass\'.');
		wo_indent('o addresseeclass: '.$addresseeclass.'',6);
		
		$addresseeid = @$_REQUEST['addresseeid']; if(isset($addresseeid)) $addresseeid = $addresseeid; else $addresseeid = false;
		if(!$addresseeid) abort('3400','missing mandatory field \'addresseeid\'.');
		wo_indent('o addresseeid : '.$addresseeid.'',6);
		
		if(0)
		switch($channel) { // this part is obselete sinds the new interface version was designed (using addresseeclass and addresseeid iso recipient)
			case 0: 
					// $emlpattern = '/^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*(\.[_a-zA-Z0-9-]{2,12}){1}$/';
					// $isok = preg_match($emlpattern,$recipient);
					// if(!$isok) abort('3400','wrong email format.');
				break; // which is approx 700 words.
			
			case 1: 
					// $recipient = preg_replace('/[^0-9+]/', '', $recipient);
					// $keep = $recipient;
					// if($recipient[0]!=='0') $recipient = '+'.$recipient;
					// $recipient = checkMobileFormat($recipient, $dS_account->phoneRegion);
					// if(!$recipient) abort('3400','wrong mobile format: |'.$keep.'|');
				break; // which is 3 sms pages of 150 chars each.
		}
		
		$message = @$_REQUEST['message']; if(isset($message)) $message = mb_strimwidth($message, 0, $maxlen, '+cut+'); else $message = false;
		if(!$message) abort('3400','missing mandatory field "message".');
		
		// from here on, $message is a ready to send string
		wo_indent('o message: '.$message.'',6);

		
		$title = @$_REQUEST['title']; if(isset($title)) $title = mb_strimwidth($title, 0, 256, '...'); else $title = false;
		if($channel==0) if(!$title) abort('3400','missing mandatory field "title" when channel is 0 (emails must have a title).');
	

		switch($channel) {
			case 0: // emails
					if(isoutofcredit($dS_account, msg_medium_email, $sendComm = true)) abort('3400','Sorry, this account is out of credit for emails.');
				break; 
			case 1: // sms
					if(isoutofcredit($dS_account, msg_medium_SMS, $sendComm = true)) abort('3400','Sorry, this account is out of credit for sms messages.');
				break;
		}

		switch($addresseeclass) {
			case 'C_dS_collaborator': 
				// WATCH OUT! the groupId of a login represents the dS_account where it was born, this account might be different than the one in this context
				// we need to rely on accesskeys
				$q = new Q('select distinct groupId as id from accesskeys where accountId = '.$aid.' and groupId = '.$addresseeid.';'); // access keys group to logins, we collect all distinct login ids
				// this query reports nothing if the login has no access key to this account
				$lids = $q->ids(list_as_string);
				if(!$lids) abort('3400','The provided id ('.$addresseeid.') does not match any '.$addresseeclass.' in this account context.');
				$dS_login = new C_dS_login($addresseeid);
				switch($channel) {
					case 0: $recipient = $dS_login->email; break; 
					case 1: $recipient = $dS_login->mobile; break;
				}					
				break; 
			case 'C_dS_visitor':
				$dS_visitor = new C_dS_visitor($addresseeid);
				if($dS_visitor->groupId != $aid) abort('3400','The provided id ('.$addresseeid.') does not match any '.$addresseeclass.' in this account context.');
				switch($channel) {
					case 0: $recipient = $dS_visitor->email; break; 
					case 1: $recipient = $dS_visitor->mobile; break;
				}		
				break;
			default : // a wrong value was passed
				abort('3400','There is no existing addresseeid that match the provided addresseeclass ('.$addresseeclass.'), check with the user and try again.');
		}
		
		wo_indent('o recipient after clearing: '.$recipient.'',6);
		
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 
//
$stream = '';
$sendStamp = C_date::getNow();
switch($channel) {
	
	case 0: // emails: which is approx 700 words. 
	
		$dS_email = new C_dS_email(0,$aid);
		$dS_email->reservationId = 0;
		$dS_email->templateId = 0;
		$dS_email->resourceId = 0;
		$dS_email->sendStamp = $sendStamp;
		$dS_email->mailsubject = $title;
		$dS_email->mailbody = $message;
		$dS_email->recipients = $recipient;
		$dS_email->sender = $dS_account->name.'<'.$dS_account->email.'>';
		$dS_email->status = sms_handled; // status re-used for emails
		$dS_email->statusChangeStamp = $sendStamp;
		
			$subject = $dS_email->mailsubject;
			$content = $dS_email->mailbody;
			$recipient = $dS_email->recipients;
			$replyto = $dS_email->sender;
		$html = HMTLemailDecoration($subject, $content, $dS_account);
		
			$emailgateaway = new C_b64_email('rdv@mobminder.com', '', ''); // sender email MUST be under our domain .mobminder.com, otherwise we get blacklisted instantly
		if($do) {
			$emailgateaway->sendMail($recipient, 0, $replyto, $subject, $html); // New mailer 2023
			$dS_email->dSsave(); // turns the id positive
		}
		$fieldsEML = Array('id','sendStamp','mailsubject','recipients','mailbody');
		$stream .= '#C_dS_email'.$nl.$dS_email->stream(no_tracking, '|', $fieldsEML).$nl;
		
		htmlvisibletag('info');
			if($do) echo 'The email was properly sent to "'.$recipient.'".'.$nl;
			else echo 'This tool is currently not allowed to send the messages, the email was not sent, the output data shows a simulation.'.$nl;
		htmlvisibletag('/info');
		break;
		
	case 1: // sms: which is 3 sms pages of 150 chars each.
	
		$dS_sms = new C_dS_sms(0,$aid);
		$dS_sms->reservationId = 0;
		$dS_sms->templateId = 0;
		$dS_sms->resourceId = 0;
		$dS_sms->sendStamp = $sendStamp;
		$dS_sms->text = $message;
		$dS_sms->toNumber = $recipient;
		$dS_sms->replyNumber = $dS_account->smsSenderId;

			$shortcodegateaway = new C_mBlox_sms_http();
		if($do) {
			$dS_sms->dSsave(); // turns the id positive (used as correlator, that is used on sms status feedback from mblox)
			$shortcodegateaway->sendOver($dS_sms, $maxlen);
			$dS_sms->dSsave(); // saves the correlator
		}
		
		$fieldsSMS = Array('id','sendStamp','toNumber','text');
		$stream .= '#dS_sms'.$nl.$dS_sms->setAIformats($dS_account)->stream(no_tracking, '|', $fieldsSMS).$nl;
		
		htmlvisibletag('info');
			if($do) echo 'The SMS was properly sent to "'.$recipient.'".'.$nl;
			else echo 'This tool is currently not allowed to send the messages, an SMS was not sent, the output data shows a simulation.'.$nl;
		htmlvisibletag('/info');
		break;
}
	



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   M O D E L     t o    A I   S I D E 
//
// 
//
	
	wo_pad();
	// technicalspecH1();
	
	if($web) {
		h2('Data model specifications.');
		exlainloginputs(); 
	}
	htmlvisibletag('datamodel');	
	
	switch($channel) {
		case 0: // emails: which is approx 700 words.
			h3('Email'); wo_pad();
			explainclass($dS_email, $fieldsEML, '|');
			break;
		case 1:
			h3('SMS'); wo_pad();
			explainclass($dS_sms, $fieldsSMS, '|');
			break;
	}
	htmlvisibletag('/datamodel');
	wo_pad();


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O   A I   S I D E
//
// 
//

	h2('Query complete'); 
	wo_notice('The following blueprint is the server payload response when not in web mode.');
	wo_pad(0);
	
	htmlvisibletag('data');	
		echo $stream;
	htmlvisibletag('/data');
	
	
// if($do)	{
	// endrendermode();
	// closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
// }


//////////////////////////////////////////////////////////////////////////////////////////
//
//     T U T O R I A L 

if($web) {
			
			
	pad();
	technicalspecH1();
	
	wo_pad(0); h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		wo_indent('o cid: chat thread unique id',6);
		wo_indent('o bla: free text (limited to 2048 chars)',6);
		

	wo_pad(0); h2('Returned objects &ltdata&gt');

	// explainclass($dS_chat_participant	, all_fields, '|'); // see (*su01*)
	// explainclass($dS_chat_phylactery	, all_fields, '|');		

}

//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 



if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}


endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


?>