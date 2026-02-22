<?php
//
//	Encoded in UTF-8 !
//

// this file requires '/classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext()
// this file requires '/classes/mblox.php'; 
//
require('maillib.php'); // necessary for C_b64_email
require('fcmgateawaylib.php');

$testmode = false;
function settestmode() {
	global $testmode;
	$crontest = false; if(defined('crontest')) if(crontest) { $crontest = true; }
	$localtst = false; if(defined('local_test')) if(local_test) $localtst = true;
	$testmode = $crontest||$localtst;
}
settestmode();


if(!defined('webrender')) { // see (*wr00*)
	
	// api and smartapp interfaces can be tested from a browser by GET passing the &web=1 option. Those api scripts then display verbose info using HTML format
	// But webapp/post/reservation.php script is called by ajax, so the setrendermode() function is not applicable
	// This is why webrenderer.php can NOT be included in ajax called scripts 
	// so we need to define h1(), h2(), notice(), ... that are used by comm.php::sendEventMessages()
	// In this case, they return plain text format text ( iso html ).
	
	function h1($t) { global $testmode; if($testmode) echo chr(10).chr(10).'==> '.$t.' <=='; }  			
	function h2($t) { global $testmode; if($testmode) echo chr(10).chr(10).'  [ '.$t.' ]'; }					
	function notice($msg, $em = 6) { global $testmode; if($testmode) echo chr(10).''.$msg; } 		
	function indent($msg, $em = 3) { global $testmode; if($testmode) echo chr(10).chr(9).' -> '.$msg; }	
	function warning($msg, $em = 3) { global $testmode; if($testmode) echo chr(10).chr(9).' !! '.$msg; }
}



/////////////////////////////////////////////////////////////////////////
//
//  M S G s   M E R G I N G  - see (*T01*)
//

define('tag_gender'			, '{gender}'	); // tags turned into actual data during sms compiling 
define('tag_dear'			, '{dear}'		);
define('tag_firstName'		, '{fname}'		);
define('tag_lastName'		, '{lname}'		);
define('tag_company'		, '{company}'	);
define('tag_info'			, '{info}'		);
define('tag_mobile'			, '{mobile}'	);
define('tag_email'			, '{email}'		);
define('tag_regist'			, '{regist}'	);
define('tag_address'		, '{address}'	);
define('tag_reference'		, '{reference}'	);
define('tag_residence'		, '{residence}'	);

define('tag_cuein'			, '{time}'		);
define('tag_resadate'		, '{date}'		);
define('tag_resaday'		, '{day}'		);
define('tag_resanote'		, '{resa_note}'	);
define('tag_perf'			, '{perf}'		);
define('tag_perfnote'		, '{perf_note}'	);
define('tag_bcode'			, '{bcode}'		);

define('tag_business'		, '{business}'	);
define('tag_bCal'			, '{att_bcal}'	);
define('tag_uCal'			, '{att_ucal}'	);
define('tag_fCal'			, '{att_fcal}'	); 
define('tag_participants'	, '{participants}'	);

define('tag_iban'	, '{epay_iban}'			);
define('tag_benef'	, '{epay_beneficiary}'	);
define('tag_bill'	, '{epay_billtotal}'	);
define('tag_paid'	, '{epay_paid}'			);
define('tag_remains', '{epay_remains}'		);
define('tag_sepa_qr', '{epay_SEPA_qr}'		);


define('action_create', 1 );
define('action_change', 2 );
define('action_delete', 4 ); // made reservation deleted by user, actually still in DB (marked obsolete)
define('action_drop', 	8 ); // does not exist anymore in DB


function isoutofcredit($dS_account, $medium, $sendComm = false) {
	
	global $testmode; if($testmode) return false;
	if(!$sendComm) {
		$dS_system = new C_dS_system();
		$sendComm = $dS_system->sendComm;
	}
	$SMSremainingCredit = $dS_account->todaySMSremains >= 0; // which is a boolean // see (*cr10*)
	$EMLremainingCredit = $dS_account->todayEMLremains >= 0; // which is a boolean
	
	$creditOK = false; // see (*cr10*)
	switch($medium) { // (*mm00*)
		case msg_medium_SMS: $creditOK = $SMSremainingCredit; break;
		case msg_medium_email: $creditOK = $EMLremainingCredit; break;
		case msg_medium_notif: $creditOK = true; break; // so far we have no limitation on the amount of notifications we send
	}
	$allowed = $sendComm && $creditOK; // which is a boolean
	if(!$allowed) {
		if(!$sendComm) notice('     Global sendComm is OFF !');
		if(!$creditOK) notice('     This account is out of credit !');
		return true;
	}
	return false;
}


	// note: echo functions h1() h2(), indent() and notice() must be defined in the calling environment
	// => include webrender.php
	// => or define those echo functions in the local lib (e.g. they are defined in apilib.php)

function sendEventMessages($dS_login, $dS_account, $resaId, $actions = 0, $timing_changed = true, $testmode = false) { 
	
	// event is a manual action from a human or machine login (machine? eresa web pages do trigger event messages).
	// example of events : reservation creation/change/delete
	//                     chat new philacteries
	// So this sendEventMessages is typically used by webapp api, general api, smartapp api, eresa api
	// 
	
	h1('Entering comm.php::sendEventMessages() local test mode is '.($testmode?'ON':'OFF'));

	$accId = $dS_account->id;

	$dS_templates = 	  new C_dbAccess_smsTemplates(	$accId, notification_on_action, class_resa_any);   // notification_on_action
	$dS_templates->absorb(new C_dbAccess_emailTemplates($accId, notification_on_action, class_resa_any));
	$dS_templates->absorb(new C_dbAccess_notifTemplates($accId, notification_on_action, class_resa_any));
	
	$dS_templates->absorb(new C_dbAccess_smsTemplates(	$accId, notification_manual, class_resa_any)); // notification_manual
	$dS_templates->absorb(new C_dbAccess_emailTemplates($accId, notification_manual, class_resa_any));
	$dS_templates->absorb(new C_dbAccess_notifTemplates($accId, notification_manual, class_resa_any));


	if($dS_templates->count()) { // if any notification message


		// re-link the resa to the account resources and appointment visitors
		$dbAccess_resources = new C_dbAccess_resources($accId);
		foreach($dS_templates->keyed as $templateId => $dS_template) { // for each template
			if($dS_template->target != class_visitor) { // templates aims account logins that are watching over the resources, 
				$dbAccess_resources->addWatchovers(); // hooks up logins to the resources (those logins expecting notifications when change are made on the agenda resource. This setting resides in the login modal window)
				notice('     At least one template sends notifications to logins ('.$dS_template->name.')');
				break; // adding watchovers is done once for all templates
			}
		}

		$dS_resa = new C_dS_reservation($resaId);
		$dS_resa->magnify($dbAccess_resources);
		
		$isanewresa = $dS_resa->changed == 0;
		$deletedresa = $dS_resa->deleted != 0;
		$c = 0;
		
		
		foreach($dS_templates->keyed as $templateId => $dS_template) { // for each template, we check if we should skip it
		
			
			if(isoutofcredit($dS_account, $dS_template->getMedium())) continue; // this account is out of credit
		
			h2($c++.' - /'.$dS_template->getMediumName().'/ template id '.$templateId.' ( '.$dS_template->name.' )');

			$forceresend 		= false;
			$filterOnActions 	= false;
			$filterOnLogins 	= false;
			$filterOnResources 	= false;
			if($dS_template->filterOnActions) $filterOnActions = $dS_template->actions;
			if($dS_template->filterOnLogins) if($dS_template->logins) $filterOnLogins = explode('!',$dS_template->logins);
			if($dS_template->filterOnResources) if($dS_template->resources) $filterOnResources = explode('!',$dS_template->resources);

			// checking on triggerId
			if($actions!=action_delete) if(!$isanewresa) // this applies only for changed reservations
			{
				$skip = false;
				switch($dS_template->triggerId) {
					
					case notification_manual: break; // those should leave even if the reservation timing is not changed
					default:
						if(!$timing_changed)
							$skip = 'this template does not trigger if the reservation has no schedule or visitor changes'; 
				}
				if($skip) { indent($skip); continue; }
			}
			
			// checking on target
			if($dS_template->target == class_visitor) if($dS_resa->visitors->count()==0)  { indent('this template targets visitors but this reservation has no visitor. Discarding.'); continue; } 
			// if($dS_template->target != class_visitor) if($dS_login->notbyme) // We do not reject the entire template here because for this same template, other watchover logins should get the message.
			
			
			// checking on action filters
			if($filterOnActions) {
					$creation 	= $filterOnActions&action_create; 
					$change 	= $filterOnActions&action_change;
					$deletion 	= $filterOnActions&action_delete;
						
				if($filterOnActions&$actions) {
					
					$skip = false;
					if($actions&action_delete) { // call from delete script, the reservation has been deleted
						if(!$deletion) $skip = 'this template does not operate at deletion'; 
						
					} else { // call from post script, that is a change or a create
					
						if(!$change && !$creation) $skip = 'this template operates only at deletion';
						if(!$creation ) if($isanewresa) $skip = 'this template operates only when changed, this resa is new';
						if(!$change ) if(!$isanewresa) $skip = 'this template operates only at creation, this is a change';
						
					}
					if($skip) { indent('discarded by actions filter:'.$filterOnActions.' ('.$skip.')'); continue; }
					
				} else {
					indent('none of expected actions ('.$actions.') are covered by this template action filter ('.$filterOnActions.')'); continue;
				}
			} else { // no action filters in template
				if($actions==action_delete) { // the call is from the /delete/reservation.php script, only those communications specifying action_delete may trigger
					indent('deletion script (actions='.$actions.') does not trigger any template having no specific delete filter'); continue;
				}
			}
			
			// checking on logins filter
			if($filterOnLogins) if(!in_array($dS_login->id,$filterOnLogins))  { indent('discarded by logins filter:'.$dS_template->logins); continue; }

			// checking on resources filters
			if($filterOnResources) {
					$keep = false;
					$attendees = array_merge($dS_resa->attendees[class_bCal]->keyed,$dS_resa->attendees[class_uCal]->keyed,$dS_resa->attendees[class_fCal]->keyed);
				foreach($attendees as $dS_resc) if(in_array($dS_resc->id,$filterOnResources)) { $keep = true; break; }
				if(!$keep) { indent('discarded by resources filter:'.$dS_template->resources); continue; }
			}
			
			
			//
			// all filters have taken effect when reaching here, we are ready to send the communication
			//
			if($dS_template->triggerId == notification_on_action) $forceresend = true; // allows multiple sending on change actions
			if($dS_template->triggerId == notification_manual) $forceresend = true; // forceresend disables checking if a message was already sent for this template+resa+resource combination

			if($dS_template->deliveryDelay) { // puts the actual sending in a delayed process using table delayed_notifs (shifted by a cron task: minute.php)
				C_dS_delayedNotif::queue($dS_resa, $dS_template);
				$msgs = false;
			}
			else // each template can generate none, one, or multiple messages
				$msgs = sendResaMSGs($dS_resa, $dS_template, $dS_account, false /*the function instantiates sendComm by itself */, $forceresend, $dS_login);

			if($testmode) {
				if($msgs) {
					if($msgs->count()) foreach($msgs->keyed as $id => $dS_msg) { // we list here the msgs that we sent for the current template
						switch($dS_template->getMedium()) {
							case msg_medium_SMS: indent('SMS to '.$dS_msg->toNumber.': '.$dS_msg->text); break;
							case msg_medium_email: indent('EMAIL to '.$dS_msg->recipients.': '.$dS_msg->mailbody); break;
							case msg_medium_notif: indent('NOTIF to '.$dS_msg->recipientId.': '.$dS_msg->message); break;
						}
					}
				}
				else {
					// may be sent already in a previous action, or no valid recipient, or no login is watching over the concerned resources
					indent(' No msg was sent for this template');
				}
			}

			// remove toggles for manually activable communications
			// a manually activable comm must be manually re-activated each time it must be sent again, that is why we remove the toggle here
			// those toggles were stored in db here (*mn01*)
			if($dS_template->triggerId == notification_manual) {
				$q = new Q($sql='delete from comm_toggles where reservationId='.$resaId.' and templateId='.$templateId.';');
				$h = $q->hits();
				indent($h.' toggle(s) were removed for the notification_manual dS_template '.$templateId.' and resaId '.$resaId);
			}
		
		} // for each template

	} // if any notification message
}


function mergeMSGtext($language, $dS_resa, $dS_account, $dS_template, $dS_att_visitor, $dS_recipient) {
	
	if(!isset($dS_att_visitor)) { // he is the appointed attendee visitor (not always the recipient)
		C_dS_exception::put('comm.php', 'mergeMSGtext()','dS_att_visitor is undefined - template id '.$dS_template->id.' - group id '.$dS_account->id.' - resa id '.$dS_resa->id);
	}
	
	new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias, prepare for XLations

	//
	$gender 		= $dS_att_visitor->gender;	
	$firstName 		= $dS_att_visitor->firstname;	
	$lastName 		= $dS_att_visitor->lastname;
	$company 		= $dS_att_visitor->company;
	
	$mobile 		= '+'.$dS_att_visitor->mobile;	
	$regist 		= $dS_att_visitor->registration;
	$email 			= $dS_att_visitor->email;
	$reference 		= $dS_att_visitor->reference;
	$residence 		= $dS_att_visitor->residence;
	
		$info = $dS_att_visitor->note;	
		$crPosition = strpos($info, chr(10)); // Find position of first occurrence of a string
		if($crPosition) // then there are many lines of text in this note
			$info = substr($info, 0, $crPosition); // select only the first line for the message
	// $info = substr($info, 0, 300); // anyway never more than 300 characters (removed with introduction of multi-page SMS)
	
		$r 	= $dS_att_visitor->residence;
		$a 	= $dS_att_visitor->address;
		$z 	= $dS_att_visitor->zipCode;
		$c 	= $dS_att_visitor->city;
	$address = ($r?$r.', ':'').($a?$a.', ':'').($z?$z.' ':'').($c?$c.'.':'');
	
	$message = $dS_template->message;
	if($language == $dS_template->altLanguage1) $message = $dS_template->altMessage1;
	if($language == $dS_template->altLanguage2) $message = $dS_template->altMessage2;
	
	// concatenate names of agenda attendees
	$attendees = array(class_bCal=>'', class_uCal=>'', class_fCal=>''); 
	if(strpos($message,'{att_') !== false) {  // account resources attendees must be indicated
		$attendees = array(class_bCal=>array(), class_uCal=>array(), class_fCal=>array());
		foreach($dS_resa->attendees as $aclass => $o_setKeyed) 
			if($o_setKeyed->count()) 
				foreach($o_setKeyed->keyed as $id => $o_dS_att) 
					$attendees[$aclass][] = ($o_dS_att->signature?$o_dS_att->signature:$o_dS_att->name); // if a signature is defined, it has precedence on the agenda name
		foreach($attendees as $aclass => $arrayof) $attendees[$aclass] = implode(',',$arrayof);
	}

	// concatenate names of performances 
		$performances = ''; $perfnotes = ''; // in case 2 or more workcodes are associated with this appointment, we want to chain the names and recommendations for all of them, in the correct language
		$hasPerfTag = (strpos($message,tag_perf)!==false); 
		$hasPerfNote = (strpos($message,tag_perfnote)!==false);
	if($hasPerfTag||$hasPerfNote) { // performance tags are used in the template
		$perfids = new Q('select distinct workCodeId as id from performances where groupId = '.$dS_resa->id.';');
		if($perfids->cnt()) {
			$dbAccess_workcodes = new C_dbAccess_workcodes();
			$dbAccess_workcodes->loadOnId($perfids->ids());
			$pnames = Array(); $pcoms = Array();
			foreach($dbAccess_workcodes->keyed as $wkId => $dS_wk) {
				$name = $dS_wk->name; // name
				$note = $dS_wk->communicnote; // communication
				if($language === $dS_wk->altLanguage1) { if($dS_wk->altcommunicnote1) $note = $dS_wk->altcommunicnote1; if($dS_wk->altName1) $name = $dS_wk->altName1; }
				if($language === $dS_wk->altLanguage2) { if($dS_wk->altcommunicnote2) $note = $dS_wk->altcommunicnote2; if($dS_wk->altName2) $name = $dS_wk->altName2; }
				$pnames[] = $name;
				$pcoms[] = $note;
			}
			$performances = implode(', ',$pnames);
			$perfnotes = implode(', ',$pcoms);
		}
	}
	
	// payment information
		$hasEpayTags = !!(strpos($message, tag_iban)!==false || strpos($message, tag_benef)!==false || strpos($message, tag_bill)!==false || strpos($message, tag_paid)!==false || strpos($message, tag_remains)!==false || strpos($message, tag_sepa_qr)!==false ); 
		$epay_paid = 0; $epay_remains = 0;
	if($hasEpayTags) { // performance tags are used in the template
	
			$dbAccess_payments = new C_dbAccess_payments();
			$dbAccess_payments->load4oneResa($dS_resa->id, payment_status_success);
			
				$ap = $dbAccess_payments->alreadypaid();
			$epay_paid = number_format($ap/100, 2, ',', ' ');
				$rp = $dS_resa->billamount-$ap;
			$epay_remains = number_format($rp/100, 2, ',', ' ');
	}
	
		

	// concatenate names of participants exclusive the addressee 
	$participants = '';
	if(strpos($message,tag_participants)!==false) { // participants must be indicated (exclusive addressee)
		$visitors = $dS_resa->visitors->count();
		if($visitors) {
			$them = Array(); $isVisitor = ($dS_recipient->getClassName() == 'C_dS_visitor'); // no exclusion is necessary when the recepient is a login
			$none = L::XL('no visitor',$language); if($isVisitor) $none = L::XL('no other visitor',$language); 
			
			foreach($dS_resa->visitors->keyed as $visiId => $dS_v) {
				if($isVisitor) if($visiId==$dS_att_visitor->id) continue;
					$amobile =  $dS_v->mobile?' (+'.$dS_v->mobile.')':'';
				$them[] = $dS_v->firstname.' '. $dS_v->lastname.$amobile;
			}
			$participants = count($them) ? implode(', ',$them) : $none;
		}
	}
	
	// dates and others
	$o_dataLink_date_cueIn = new C_date($dS_resa->cueIn);
	
		$resaNote = $dS_resa->note;
		$crPosition = strpos($resaNote, chr(10)); // Find position of first occurrence of a string
		if($crPosition) // then there are many lines of text in this note
			$resaNote = substr($resaNote, 0, $crPosition); // select only the first line for the message
	// $resaNote = substr($resaNote, 0, 150); // anyway never more than 150 characters (removed with introduction of multi-page SMS)
	
	switch($gender) {
		case gender_code_male:
		case gender_code_boy:
			$genderString = L::XL('male',$language);
			$dearString = L::XL('dear male',$language);
			break;
		case gender_code_female:
			$genderString = L::XL('female',$language);
			$dearString = L::XL('dear female',$language);
			break;
		case gender_code_miss:
		case gender_code_girl:
			$genderString = L::XL('miss',$language);
			$dearString = L::XL('dear female',$language);
			break;
		case gender_code_other:
			$genderString = L::XL('othergender',$language);
			$dearString = L::XL('dear other',$language);
			break;
		default:
			$genderString = '';
			$dearString = '';
	}
	
	
	C_date::setTimeParameters($dS_account); // shift server to the proper timezone, so to produce date/time strings in the message that are compliant with event location in the world
	
	$allValues = array(	'gender' 		=> $genderString,
						'dear' 			=> $dearString,
						'firstname' 	=> $firstName,
						'lastname' 		=> $lastName,
						'company' 		=> $company,
						'mobile' 		=> $mobile,
						'email' 		=> $email,
						'info' 			=> $info,
						'regist' 		=> $regist,
						'address' 		=> $address,
						'reference' 	=> $reference,
						'residence' 	=> $residence,
						
						'cuein' 	=> $o_dataLink_date_cueIn->getHHmmString(),
						'resadate' 	=> $o_dataLink_date_cueIn->getDateString(),
						'resaday' 	=> L::XL('weekday'.$o_dataLink_date_cueIn->getDayCode(), $language), // weekday1, weekday2, etc... see (*wd10*)
						'resanote' 	=> $resaNote,
						'resaperf' 	=> $performances,
						'perfnote' 	=> $perfnotes,
						'bcode' 	=> $dS_resa->bookingcode,
						
						'business' 		=> $dS_account->name,
						'bCal' 			=> $attendees[class_bCal],
						'uCal' 			=> $attendees[class_uCal],
						'fCal' 			=> $attendees[class_fCal],
						'participants' 	=> $participants,
						
						'epay_iban' 	=> $dS_account->ePayBenefIBAN,
						'epay_benef' 	=> $dS_account->ePayBenefName,
						'epay_bill' 	=> number_format($dS_resa->billamount/100, 2, ',', ' '),
						'epay_paid' 	=> $epay_paid,
						'epay_remains' 	=> $epay_remains,
						'epay_SEPA_qr' 	=> '' // url that links to a QR code image to be displayed in the email
						
						); // 
	
	
	$allTags = array(	'gender'		=> tag_gender,
						'dear'			=> tag_dear,
						'firstname'		=> tag_firstName,
						'lastname'		=> tag_lastName,
						'company'		=> tag_company,
						'mobile'		=> tag_mobile,
						'email'			=> tag_email,
						'info'			=> tag_info,
						'regist'		=> tag_regist,
						'address'		=> tag_address,
						'reference'		=> tag_reference,
						'residence'		=> tag_residence,
						
						'cuein'		=> tag_cuein,
						'resadate'	=> tag_resadate,
						'resaday'	=> tag_resaday,
						'resanote'	=> tag_resanote,
						'resaperf'	=> tag_perf,
						'perfnote'	=> tag_perfnote,
						'bcode'		=> tag_bcode,
						
						'business'		=> tag_business,
						'bCal'			=> tag_bCal,
						'uCal'			=> tag_uCal,
						'fCal'			=> tag_fCal,
						'participants'	=> tag_participants	,
						
						'epay_iban'		=> tag_iban,
						'epay_benef'	=> tag_benef,
						'epay_bill'		=> tag_bill,
						'epay_paid'		=> tag_paid,
						'epay_remains'	=> tag_remains,
						'epay_SEPA_qr'	=> tag_sepa_qr	);
	
	
	C_date::setTimeParameters(); // shift back to the server setting, so the created/modified ds timestamps are correct
	
	foreach($allTags as $value => $tag ) $message = str_replace($tag,$allValues[$value],$message);
	return $message;
}


function setupCommObject($dbAccess_msgs, $dS_resa, $dS_template, $dS_account, $dS_recipient, $dS_att_visitor) {
	
	global $testmode;
	
	$language = $dS_account->language; // the message language is the account language, unless the recipient language matches an alternative language defined in the message template.
	if($dS_recipient->language == $dS_template->altLanguage1) $language = $dS_template->altLanguage1;
	if($dS_recipient->language == $dS_template->altLanguage2) $language = $dS_template->altLanguage2;
	
	$sendStamp = C_date::getNow();
	switch($dS_template->getMedium()) {
		case msg_medium_email: // emails have a subject and a body
		
			$subject = $dS_template->subject;
			if($language == $dS_template->altLanguage1) $subject = $dS_template->altSubject1 ? $dS_template->altSubject1 : $dS_template->subject;
			if($language == $dS_template->altLanguage2) $subject = $dS_template->altSubject2 ? $dS_template->altSubject2 : $dS_template->subject;
			
			$email = $dS_recipient->firstname.' '.$dS_recipient->lastname.'<'.$dS_recipient->email.'>';
			
			$dS_email = $dbAccess_msgs->newVirtual();
			$dS_email->groupId = $dS_account->id;
			$dS_email->reservationId = $dS_resa->id;
			$dS_email->templateId = $dS_template->id;
			$dS_email->resourceId = $dS_recipient->id;
			$dS_email->sendStamp = $sendStamp;
			$dS_email->mailsubject = $subject;
			$dS_email->mailbody = mergeMSGtext($language, $dS_resa, $dS_account, $dS_template, $dS_att_visitor, $dS_recipient);
			$dS_email->recipients = $email;
			$dS_email->sender = $dS_account->name.'<'.$dS_account->email.'>';
			$dS_email->status = sms_handled; // status re-used for emails
			$dS_email->statusChangeStamp = $sendStamp;
			break;
			
		case msg_medium_SMS: // SMS have a text
		
			$dS_sms = $dbAccess_msgs->newVirtual();
			$dS_sms->groupId = $dS_account->id;
			$dS_sms->reservationId = $dS_resa->id;
			$dS_sms->templateId = $dS_template->id;
			$dS_sms->resourceId = $dS_recipient->id;
			$dS_sms->sendStamp = $sendStamp;
			$dS_sms->text = mergeMSGtext($language, $dS_resa, $dS_account, $dS_template, $dS_att_visitor, $dS_recipient);
			$dS_sms->toNumber = $dS_recipient->mobile;
			$dS_sms->replyNumber = $dS_account->smsSenderId;
			break;
			
		case msg_medium_notif: // notifs have a title and a message
		
			$title = $dS_template->title;
			if($language == $dS_template->altLanguage1) $title = $dS_template->altTitle1;
			if($language == $dS_template->altLanguage2) $title = $dS_template->altTitle2;
			
			$notif = $dbAccess_msgs->newVirtual();
			$notif->groupId = $dS_account->id;
			$notif->reservationId = $dS_resa->id;
			$notif->templateId = $dS_template->id;
			$notif->resourceId = $dS_recipient->id;
			$notif->sendStamp = $sendStamp;
			$notif->title = $title;
			$notif->message = mergeMSGtext($language, $dS_resa, $dS_account, $dS_template, $dS_att_visitor, $dS_recipient);
			$notif->recipientId = $dS_recipient->id; // which is either a loginId or a visitorId (PVH 2022: visitorId when we'll have a visitor's smartapp)
			$notif->sender = $dS_account->name;
			$notif->status = sms_handled; // status re-used for emails
			$notif->statusChangeStamp = $sendStamp;
			break;
	}
}


function skipOrKeep($messages,$dS_visitor,$dS_template,$dS_resa,$forceresend) {
	
	$skip = false;
	
		$who = $dS_visitor->firstname.' '.$dS_visitor->lastname.' (vid:'.$dS_visitor->id.')';
		$medium = $dS_template->getMedium();
		
	switch($medium) {
		case msg_medium_SMS: if(!$dS_visitor->mobile) $skip = $who.' has No mobile'; break;
		case msg_medium_email: if(!$dS_visitor->email) $skip = $who.' has No email'; break;
		case msg_medium_notif: if(!$dS_visitor->email) $skip = $who.' has No mobile device'; break;
	}
	// if($dS_resa->isPast()) $skip = 'This resa starts in the past ('.Date('Y-m-d H:i',$dS_resa->cueIn).')'; // see here (*ic11*) // PVH 2022 - PVPP messages should leave
	
	if(!$skip) {
		
			$istoggled = C_dbAccess_cToggles::istoggled($dS_resa->id, $dS_template, $dS_visitor->id);
			// note that this is based on database data, the toggles must have been stored in db before arriving here, see (*bu1*) and C_dbAccess_cToggles::setbundels()
		
		if($istoggled!==1) { // then it's either 0 or false
		
			if($istoggled===0) // can be false, 0 or 1. Only when toggled to 0 = "do not send", we should skip the communication
				$skip = $who.' '.'Disabled by comm_toggles';

			if($dS_template->sendComms == 0 && $istoggled <> 1) // this communication triggers only when manually toggled by user
				$skip = $who.' '.'Triggers only when manually toggled by user';
		
			if($dS_template->sendComms == 2) // this communication triggers only when the action time is close to the reservation time
				if(!$dS_resa->isClose(16)) // let's look 16 hours ahead, keep this setting equal to see here (*ic00*)
					$skip = $who.' '.'Triggers only when action time is close to reservation time';
		}	
	}
	if(!$skip) 
		if(!$forceresend) // forcesend allows to skip the verification, in which case an sms already sent can be send again
			if($messages->issent($dS_resa->id, $dS_template, $dS_visitor->id))
				$skip = $who.' '.'A msg was already sent for this template and resa';
	
	return $skip;
}

function sendResaMSGs($dS_resa, $dS_template, $dS_account, $sendComm, $forceresend = false, $dS_login_actionee = false) { 

	// this function is limited to reservations related events (create, change, delete)
	// it is used for event based messages (posting and deleting reservations) and for scheduled messages (crons)

	if(!$sendComm) { // scripts that runs this function many times ( hourly.php is an example ) have their own unique instance of sendComm
		$dS_system = new C_dS_system();
		$sendComm = $dS_system->sendComm;
	}
	
	// for a given reservation AND a given template, here we compile messages and send them
	$aid = $dS_account->id;
	$resaId = $dS_resa->id;
	$medium = $dS_template->getMedium(); // represent the type of medium used by the message : email, sms or mobile device notification
	$medname = $dS_template->getMediumName();
	$target = $dS_template->target; // is a login or a visitor. Note that for logins, the target is primarily an account resource type (b_cal, u_cal, f_cal) and each login defines which instance(s) of this resource type it monitors
	
	// Prepare a container for the messages that this function is going to send
	//
	switch($medium) {	// deduce recipient type from the $dS_template class
		// Note that we load the $messages with the communication that was already sent for this reservation and template, so we can later check on it
		
		case msg_medium_SMS: 	$messages = new C_dbAccess_sms(); break;
		case msg_medium_email: 	$messages = new C_dbAccess_emails(); break;
		case msg_medium_notif: 	$messages = new C_dbAccess_notifications(); break;
	}
	
	if(isoutofcredit($dS_account, $medium, $sendComm)) return $messages; // if you are out of credit, the story ends here for you :)
	
	// produce echoes when true (not for production environments)
	$skip = '';
	global $testmode;
	
	// Let's see if the reservation has an attendee of the target_type mentionned in the template
	switch($target) {
		case class_bCal: 
		case class_uCal: 
		case class_fCal: 
			if($dS_resa->attendees[$target]->count()==0)
				$skip = ' => this appointment does not involve any resource of the template target type ('.$target.')'; 
			break;
		case class_visitor: 
			if($dS_resa->visitors->count()==0)
				$skip = ' => there is no visitor in this appointment (may have got a message for a sooner appointment on the same day)'; 
			break;
	}
	if($skip) {
		indent($skip);
		return false;
	}
	
	
	
	
	// VISITORS are the TARGET
	//
	if($target == class_visitor) { // visitors have email or mobile
		
		$any = $dS_resa->visitors->count();
		if($any) foreach($dS_resa->visitors->keyed as $visiId => $dS_visitor) { // sends a message to each appointed visitor 
		
				$skip = skipOrKeep($messages,$dS_visitor,$dS_template,$dS_resa,$forceresend); // records any reason to skip this communication, involving user toggled directives
			if($skip) { warning($skip);	continue; } // continue with next recipient
			
			setupCommObject($messages, $dS_resa, $dS_template, $dS_account, $dS_visitor /* recipient */, $dS_visitor /* appointed */);
		}
		else {
			indent('vistors are the target but there are no visitor in this reservation.');
		}
	}
	
	// OTHER ACCOUNT RESOURCES are the TARGET -> send notification to logins watching over concerned resources
	//
	else {
		$dS_att_visitor = $dS_resa->visitors->last(); // is false if the reservation has no visitor attached
		if(!$dS_att_visitor) {
			indent('No communication when no dS_att_visitor is associated');
			
		} else { // no notifications for reservations without visitor (PVH 2020-10 after observation of error log on be.mobminder.com)
			
			foreach($dS_resa->attendees[$target]->keyed as $rescId => $dS_resc) { // foreach resource of the target class
				
				$any = $dS_resc->wologins->count();
				if($any) foreach($dS_resc->wologins->keyed as $tlid => $dS_target_login) { // foreach login watching over this resource: $tlid = target login id
				
						$skip = skipOrKeep($messages,$dS_target_login,$dS_template,$dS_resa,$forceresend); // records any reason to skip this communication, involving user toggled directives
					
					if($dS_login_actionee) { // login id of the event actionee. This relates to the C_dS_login::notbyme setting
						if($dS_login_actionee->notbyme) // this login never gets notified for his own actions
							if($dS_login_actionee->id==$tlid)
								$skip = 'login '.$dS_target_login->lastname.'('.$tlid.') doesn\'t receive '.$medname.' on own actions for this template';
					}
					
					if($skip) {
						warning($skip);
						continue; // continue with next recipient
					}
					
					// else this msg template passed all conditions that prevent sending the message, let's make it and add it to $messages
					setupCommObject($messages, $dS_resa, $dS_template, $dS_account, $dS_target_login /* recipient */, $dS_att_visitor /* appointed */); // 
				
				} // foreach login watching over the resource
				else {
					indent(' => there is no login watching over the resources attached to this appointment.');
				}
			
			} // foreach resource of the correct target class
			
		}
	}

	
	//    S E N D     C O M M U N I C A T I O N S
	//
	// arrived here, $messages contains the messages that must be sent for sure
	
	if($testmode) { // that is the debug mode, actually not sending any msg through server gates
		
		$tab = '    '; // &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		if($messages->count())
			foreach($messages->keyed as $id => $dS_msg) {
				switch($medium) {
					case msg_medium_SMS: 	
						echo '<br/>'.$tab.'<b>SMS to '.$dS_msg->toNumber.'</b> | '.$dS_msg->text;
						break;
					case msg_medium_email: 	
						// echo chr(10).$tab.'EMAIL to '.$dS_msg->recipients.' | '.$dS_msg->mailsubject.' ('.$dS_msg->mailbody.')'; break;
						break; 
					case msg_medium_notif: 	// C_dS_notification
						// echo '<br/>'.$tab.'<b>NOTIF to '.$dS_msg->recipients.'</b> | '.$dS_msg->subject.' ('.$dS_msg->body.')'; break; 
						break;
				}
			}
		else {
			echo '<br/>'.$tab.$tab.' ... no message was sent for this appointment/template combination';
		}
		// return $messages;   //  T E S T     M O D E    S T O P S    H E R E    (comment this line to test further and generate insertion of dS_sms, dS_email, dS_notification in DB. Be sure globals#sendComm is set to 0)
	}
	
	if(!$messages->count()) return $messages; // which is an empty array[]
		
	
	
	switch($medium) {  //  OPEN GATEAWAYS and PASS THE MESSAGEs according to the medium (sms, mail or firebase)
		
		case msg_medium_SMS:
		
			$shortcodegateaway = new C_mBlox_sms_http();
			$mobmindergateaway = new C_smsgateaway('alphanight88','404');
			
			foreach($messages->keyed as $id => $dS_sms) {
				
				$dS_sms->dSsave(); // turns the id positive (used as correlator)
				$CCode = substr($dS_sms->toNumber,0,2); // switch SMS traffic according to country code

				$shortcode = false;
				if($CCode!='32') $shortcode = true; // routing international sms trafic to shortcode supplier
				
				else switch($dS_template->smsgateaway) { // Belgium satellites 

					// (*sg03*)
					// case 'medicenters':
					// case 'miscellaneous':
					case 'cluster2020':
							$cor = $dS_sms->id; // (*sg05*)
							$corgroup = $dS_template->id; // we pass the template id has a group correlator (*sg06*)
							$queue = $dS_template->smsgateaway; 
							$text = $dS_sms->text;
							$to = $dS_sms->toNumber;
							$priority = $dS_template->priority; 
							$encoding = $dS_template->encoding; 
							$dS_sms->r2status = sms_handled; // awaiting a first feedback from smsgateaway
							$dS_sms->r2statusChangeStamp = C_date::getNow(); // 
							
						if($sendComm&&!$testmode)
							$mobmindergateaway->push($queue, $corgroup /*group*/, $cor /*correlator*/, $to /*to*/, 360 /*lifetime*/, $encoding /*encoding*/, $priority /*priority*/, $text);
						break;
											
					case 'shortcode':
					default: // no setting in DB, or incoherent with  (*sg03*)
						$shortcode = true; // so it makes possible to use shortcode for an account having belgian (32) trafic.
				}
				
				if($shortcode)
					if($sendComm&&!$testmode) { // send Comm is a global switch that is located in DB table globals, allows to develop/test locally without sending SMSs everywhere
						
						$maxlen = $dS_template->pages ? 459 : 159; // see (*m11*)
						$shortcodegateaway->sendOver($dS_sms, $maxlen);  
					} 
				
				if($sendComm&&!$testmode) $dS_sms->dSsave(); // Prod conditions, saves the correlator
				// if($testmode) $dS_sms->dSsave(); // let's create the SMS in test mode, when needed.
					
				new Q('update groups set todaySMSremains = todaySMSremains-1 where id = '.$aid.' and todaySMSremains >0; -- comm.php');		// update account credit
			}
			break; // msg_medium_SMS
			
			
			
		case msg_medium_email: 
				// if($dS_account->id == 3925) 
						$emailgateaway = new C_b64_email('rdv@mobminder.com', '', '');
					// else 
						// $emailgateaway = new C_dataCom_mail();
				
				foreach($messages->keyed as $id => $dS_email) {
					
					$subject = $dS_email->mailsubject;
					$content = $dS_email->mailbody;
					$recipient = $dS_email->recipients;
					$replyto = $dS_email->sender;
					$html = HMTLemailDecoration($subject, $content, $dS_account, $dS_template, $dS_email);
					// if($testmode) echo chr(10).'>>>'.$html.chr(10).chr(10);
					
					if($sendComm&&!$testmode) // send Comm is a global switch that is located in DB table globals, allows to develop/test locally without sending Emails everywhere
						$emailgateaway->sendMail($recipient, 0, $replyto, $subject, $html); // New mailer 2023
					$dS_email->dSsave(); // turns the Id positive
				

					new Q('update groups set todayEMLremains = todayEMLremains-1 where id = '.$aid.' and todayEMLremains >0; -- comm.php');				
				}
				break; // msg_medium_email
			
			
		case msg_medium_notif:  // mobile devices notifications
		
				if($target == class_visitor) break; // we keep it for future development when visitors can have an app
		
				$gateway = new C_FcmGateaway();
				foreach($messages->keyed as $id => $dS_notification) 
				{
					$loginId = $dS_notification->recipientId;
					$gateway->sendResaNotification4Login($loginId,$dS_resa,$dS_notification);
					$dS_notification->dSsave(); // turns the Id positive
				}
				break; // msg_medium_notif

	}
		
	return $messages; // depending on medium, is an instance of C_dbAccess_sms or C_dbAccess_emails
}

function htmlizeit($text) { // turns up CR LF into a nice html line breaker <br/>
		$text = str_replace(chr(13).chr(10), "<br/>", $text);
		$text = str_replace(chr(10), "<br/>", $text);
		return $text;
}

function HMTLemailDecoration($title, $message, $dS_account, $dS_template = false, $dS_email = false) {
	
			$msglength = strlen($message); // there are approx 80 chars per ligne in a 600px wide table 
		$allwidth = '500'; if($msglength>400) $allwidth = '600';
	$message = htmlizeit($message); // crlf in the email template mailbody field must be turned into html <br/> otherwise you never see a next line in the html
	
	$languageAbrevs = L::$languageAbrevs[$dS_account->language]; // which ranges [en,fr,nl,pl,de,... ]
	$imageshost = 'https://www.mobminder.com/assets/imgs/emails';

		// TBfixed, logo should come from account settings
	$logoTitle = '<img height="150" src="'.$imageshost.'/moovia.png" alt="company-logo" border="0" style="border:none; height:150px; max-height:150px;"></img>';
	$thumbup = '<img src="'.$imageshost.'/thumbup.png" width="75" style="width:75px; max-width:75px;" alt="cheers" border="0" style="border:none;"></img>';	
	
		$iconwidth = '60';
	$checkedIcon = '<img src="'.$imageshost.'/checked.png" width="'.$iconwidth.'" alt="place" border="0" style="border:none; width:'.$iconwidth.'px; max-width:'.$iconwidth.'px; overflow:hidden;">';
	
	$titlecolormail = '#6060AA'; // '#606060';
	$txtcolormail = '#505050'; // '#505050';
	
	// css for emails (!tricky!)
	// 
	$fixoldhtmltablelook = 'color="'.$txtcolormail.'" border="0" cellpadding="0" cellspacing="0" width="'.$allwidth.'"'; // Older Outlook email readers - padding in style="" are ok
		$font = 'font-family:Helvetica;font-size:16px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
	$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:'.$txtcolormail.'; line-height:130%; overflow: hidden;'; //font-family:Arial; font-size:14px; 


	/////// Main communication body 
	//

	// Top border with logo
	//

	// TBfixed, logo should come from account settings
	
	$tt = ' 
	<table '.$fixoldhtmltablelook.' align="center">
		<tr>
			<td valign="top" align="center" style="text-align:center; padding-top:1em;">
				'.$logoTitle.'
			</td>
		</tr>
	</table>';
	
	$tt = '';  // TBfixed, logo should come from account settings
	
	
	// Main title
	//

	$t1 = '
	<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="bottom" style="text-align:center; padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
				<h1 style="color:'.$titlecolormail.'; font-size:1.5em; line-height:120%; white-space:nowrap;">
					<strong>'.$title.'</strong>
				</h1>
			</td>
		</tr>
		</tr>
			<td valign="middle" align="center" style="vertical-align:middle; text-align:center; padding-top:.3em;">
				'.$checkedIcon.'
			</td>
		</tr>
	</table>';



	// Message
	//

	$t4 = '
	<table '.$fixoldhtmltablelook.' style="margin-bottom:1.5em;">
	<tr>
		<td style="padding-right:2em; padding-left:2.5em; padding-top:1.5em; padding-bottom:1.5em; background-color:#F0F0F0;">
			<p style="color:'.$txtcolormail.'; font-size:18px;">'.$message.'</p>
		</td>
	</tr>
	</table>';

	// Footer
	//
	
	
	$language = $dS_account->language; // the message language is the account language, unless the recipient language matches an alternative language defined in the message template.
	if($dS_template) if($dS_email) { // PVH 2024 this will be possible when a field 'language' is added in C_dS_email, C_dS_sms and C_dS_notification, very useful and no other way...
		// if($dS_email->language == $dS_template->altLanguage1) $language = $dS_template->altLanguage1;
		// if($dS_email->language == $dS_template->altLanguage2) $language = $dS_template->altLanguage2;
	}
		
	$copyright = L::XL('copyright',$language);
	$provided = L::XL('provided by',$language);
	$summarized = L::XL('summarized features',$language);
	$privacy = L::XL('privacy policy',$language);
				
			$tid = $dS_template?$dS_template->id:0; // dS_template and dS_email are optional parameters, e.g. not available when sending a 2FA token through e-resa-authenticate
			$rid = $dS_email?$dS_email->resourceId:0;
			$eid = $dS_email?$dS_email->id:0;


		$privacy = '<a href="https://be.mobminder.com/emailprivacy.php?aid='.$dS_account->id.'&eid='.$eid.'&tid='.$tid.'&rid='.$rid.'">'.$privacy.'</a>';
		$mobminder = '<a href="https://www.mobminder.com/'.$languageAbrevs.'/?from='.$dS_account->id.'_'.$rid.'"><strong>www.mobminder.com</strong></a>';
			$logowidth = '200';
		$logoMobBottom = '<img width="'.$logowidth.'" src="'.$imageshost.'/mob-logo.png" style="width:'.$logowidth.'px; max-width:'.$logowidth.'px;" alt="Mobminder" border="0" style="border:none;">';
	
	$tfooter = '
	<table '.$fixoldhtmltablelook.' align="center" style="">
	<tr>
		<td valign="middle" style=" padding-right:1.5em; padding-left:1.5em; padding-top:5em; text-align:center; line-height:105%; background-color:white;">
			<div style="color:rgb(112,112,112); font-size:12px;">'.$copyright.' '.$mobminder.' '.$provided.'</div>	
			<div style="color:rgb(112,112,112); font-size:12px;">'.$summarized.'</div>
			<div style="overflow:hidden; padding-top:1em; padding-bottom:1em; padding-left:0em; text-align: center;">'.$logoMobBottom.'</div>
		</td>
	</tr>
	</table>';
		// <div style="color:rgb(112,112,112); font-size:12px; text-align: center; ">'.$privacy.'</div>

	/////// Nesting inside body, adding headers
	//
	
	// $main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'"><tr><td>'.$tt.$t1.$t4.$tfooter.'</td></tr></table>';
	
		$main = $tt.$t1.$t4.$tfooter;
	$center = '<center>'.$main.'</center>';

	return $center;
}





/////////////////////////////////////////////////////////////////////////
//
//  C O N N E C T I O N    T O    M A I L    S E R V E R 
//
// 
class C_dataCom_mail { // still in use by some crons and by the sync libs. PVH 2024: Should use the new version of the footer (TBD)
	
	public function __construct() {}

	public function htmlize($text) { // turns up CR LF into a nice html line breaker <br/>
		$text = str_replace(chr(13).chr(10), "<br/>", $text);
		$text = str_replace(chr(10), "<br/>", $text);
		return $text;
	}
	public function extract_emails_from($string){
		preg_match_all("/[\._a-zA-Z0-9-]+@[\._a-zA-Z0-9-]+/i", $string, $matches);
		return $matches[0];
	}
	public function sendMail($subject, $contentSection, $recipient, $from, $language, $vid = 0) {
		
		$subject = $this->htmlize($subject); 
		$contentSection = $this->htmlize($contentSection); // crlf in the email template mailbody field must be turned into html <br/>
		
		$divStyle = 'style="background-color:white; width:80%; margin:0 auto 0.5em auto; border:1px solid silver; padding:1em 2em 2em"';
		$contentDiv = '<div '.$divStyle.'>'.$contentSection.'</div>';
		$signature = '<p style="text-align:center;font-size:10px">'.L::XL('powered by', $language).'</p>';
		
		
		
		$body = '<body style="padding:1em 0; background-color:#eee;">'.$contentDiv.$signature.'</body>'; 
		
		$header = '
				<head>
					<title>'.$subject.'</title>
				</head>
				'; // note that html head title should match with email subject in order to ensure delivery to inbox ( iso spam :) 
				
				
		$html = '<html>'.$header.$body.'</html>'; 
		// send report
		$mailheader  = "MIME-Version: 1.0\n";
		$mailheader .= "Content-type: text/html; charset=UTF-8\n";
		$mailheader .= "FROM: rdv@mobminder.com\n";  // let the sender have the same domain as our server is, so we are not considered like spam
		$mailheader .= "Reply-To: ".$from."\n"; // only appearing on user interface, used by mail programs at client side
		$mailheader .= "X-Mailer: Mobminder/1.0\n";
		// $mailheader .= 'List-Unsubscribe: https://be.mobminder.com/unsubscribe/?vid='.$vid."\n";
		$mailheader .= "\r\n";
		
		$emails = $this->extract_emails_from($from);
		$fromemail = $emails[0];
		
			$html = $this->splithtml4mail($html);
		$result = mail($recipient, $subject, $html, $mailheader); // -f makes the return path (should only mention email with no pseudo, used by mail server
		if(!$result) {
			C_dS_exception::put(get_class(), 'sendMail','mail could not be sent to recipient:'.$recipient);
		};
	}
	
	
	private function splithtml4mail($source,$maxlen=255) {
	
		$encoding = "UTF-8";

		$crlf = chr(13).chr(10); //CR LF
		//$crlf = chr(10); //CR LF
		$splitchars = array("<","=",";"," "); //split characters

		$lines = explode($crlf,$source);
		$result = array();

		//loop in all existing lines
		foreach($lines as $line) {

			while (strlen($line)!=0)
			{
				//if the length of line is smaller or equal to maxlen, then keep the entire line (add entire line to array)
				if (strlen($line)<=$maxlen)
				{
					array_push($result, $line);
					break;
				}

				//the length of line is greater than maxlen, take the first maxlen characters
				//$truncatedline = substr($line,0,$maxlen);
				$truncatedline = mb_strcut($line,0,$maxlen,$encoding);

				//try to find the last "<","=",";"," " characters in line
				$splitcharindex = -1;
				foreach($splitchars as $splitchar) {

					$lastindex = strripos($truncatedline,$splitchar);
					if ($lastindex != false)
						if ($lastindex>$splitcharindex)
							$splitcharindex = $lastindex;
				}

				//if a "<","=",";"," " character is found, then take its index to split the line
				//otherwise split at maxlen index
				if ($splitcharindex!=-1) {
					//$truncatedline = substr($line,0,$splitcharindex);
					$truncatedline = mb_strcut($line,0,$splitcharindex,$encoding);
				}
				else {
					//$truncatedline has been already built
					$splitcharindex = $maxlen;
				}

				//add current line to array
				array_push($result, $truncatedline);

				//build new line for loop
				$oldlinelength = strlen($line);

				//$line = substr($line,$splitcharindex);
				$line = mb_strcut($line,$splitcharindex,null,$encoding);

				$newlinelength = strlen($line);
				
				//security #2 : if current line length does not decrease, then exit from while loop
				if ($newlinelength >= $oldlinelength) {
					//never happen
					//error !must exit froom while loop!!
					break;
				}
			}
		}
		//build a string from array (separtor = char 13 + char 10)
		return implode($crlf, $result);
	}
}

?>