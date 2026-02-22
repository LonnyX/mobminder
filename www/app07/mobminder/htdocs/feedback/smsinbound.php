<?php

$systemLog = 'smsgateaway feedback'; // used in dbio.php to identify the working process/user

	require '../classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext() used in comm.php
	require '../../lib_mobphp/dbio.php';  
	require '../../lib_mobphp/smsgateaway.php';
	require '../../lib_mobphp/comm.php';
	
$stream = @$_REQUEST['stream'];
$web = @$_REQUEST['web']; if(isset($web)) $web = !!$web; else $web = false;

if($web) $stream = 'This is a test stream: <data>#C_dS_sms
20002299|1001|7527796|6228|2020-12-14 10:58:02|32493655599|bla bla bla :)</data>'; // id satid correlator groupId


echo 'OK';
	

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
// Close connexion (but keep this script running)
//
// Why ? 
// So you can allow this script to gently call other interfaces that are potentially slow
//
//
if(!$web) { // disabled when testing using browser mode, so the next section can echo on the screen
	
	ob_start(); 
	usleep(1000*50); // 10ms so to impose a pace to the calling process. That is 100/sec or 6000/minute
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	//
	// dev note 2019-10/pvh: a simpler version of this connection closing method are working on the dev environment, but do not on the server!!
	// in order to get the stuff working, here is what is needed :
	// 1. add ob_start(); after ob_end_clean();
	// 2. add header('Content-Encoding: none');
	// 3. add ob_end_flush(); ob_flush();
	//
	if(session_id()) session_write_close();
	
    $fb = ob_get_contents(); $fl = strlen($fb); $filler = ''; if((4096-$fl)>0) $filler = str_repeat('1',4096-$fl); //  (*ob2)
    ob_end_clean(); // relates to (*ob1)
	ob_start();

    ignore_user_abort(true); 
    set_time_limit(3); 
	header('Content-Encoding: none');
    header('Content-Type: text/plain');
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb.$filler; // flush has no effect if the buffer is not 4k at least (*ob2)

	// flush all output
	ob_end_flush();
	ob_flush();
	flush();
	 
}

$s = C_smsgateaway::stripinbounddata($stream); // an Array of C_smsinbound instances as per definition in smsgateaway.php

// propagate this inbound sms according to template options


$mailer = new C_dataCom_mail();
$dS_system = new C_dS_system();
$mobmindergateaway = new C_smsgateaway('alphanight88','404');


foreach($s as $dS_smsinbound) { // generic code, actually there is always only one inbound message passed by the smsgateaway
	
	if($web) $dS_smsinbound->display();
	
	$dS_template = new C_dS_smsTemplate($dS_smsinbound->groupid); // at this spot (*sg06*) was the template id inserted in the smsgateaway push as groupid
	if(!$dS_template->id) {
		echo 'NOK: the original template ('.$dS_smsinbound->groupid.') could not be found in mobminder DB';
		continue;
	}

	$dS_account = new C_dS_group($dS_template->groupId);
	new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias
	
	if($web) echo 'identified account: '.$dS_account->name.' ('.$dS_account->id.')'.'<br/>';
	if($web) echo 'identified template: '.$dS_template->name.' ('.$dS_template->id.')'.'<br/>';
	if($web) echo 'identified recepient: '.$dS_account->email.' '.'<br/>';
	
	$campaign = false;
	$autoreply = false;
	if($dS_template->name == 'CampagneSMS') {
		
			$campaign = true;
			$visitor = new C_dS_visitor($dS_smsinbound->correlator); // in this case, the inbound correlator is the visitor id, see (*sc20*)
			if(!$visitor->id) {
				if($web) echo 'Could not find visitor id : '.$dS_smsinbound->correlator.' specified as correlator in the inbound sms';
				continue;
			}
			if($web) echo 'identified visitor: '.$visitor->getFullName();
			
			if($dS_template->inboundaction == 'frwdemail') { // ranges [ignore, frwdemail, frwdmobile], see (*sg08*)
						
				$subject = L::XL('inareply title').' - '.($visitor->getFullName());
				
				$content = L::XL('inareply account').' :<br/><b>'.($dS_account->name).'</b>&nbsp;<br/>';
				$content .= '<br/>'.L::XL('inareply in-msg').' :<br/><b>'.($dS_smsinbound->bla).'</b>&nbsp;<br/>';
				$content .= '<br/>'.L::XL('inareply sender').' :<br/><b>'.($visitor->getFullName()).' - '.($dS_smsinbound->from).'</b>&nbsp;<br/>';
				$content .= '<br/>'.L::XL('inareply initial').' :<br/><b>'.$dS_template->name.'</b>&nbsp;<br/>';
				
				if($dS_template->autoreplymsg) {
					$content .= '<br/><br/>'.'Auto-reply message'.' :<br/><b>'.$dS_template->autoreplymsg.'</b>&nbsp;<br/>';
				}
				
				$recipient = $dS_account->email;
				$sender = 'communication@mobminder.com';
				
				if($dS_system->sendComm) // send Comm is a global switch that is located in DB table globals, allows to develop/test locally without sending Emails everywhere
					$mailer->sendMail($subject, $content, $recipient, $sender, $dS_account->language);
				if($web) {
					echo '<br/><br/>EMAIL:<br/>';
					echo $subject.'<br/>'.$content.'<br/>';
				}
			}
			$autoreply = true;
		
	} else {
		
			// the inbound SMS relates to a SMS we have created in the mobminder.sms table
		
			if($dS_template->target == reminder_target_visitor) { // message forwarding applies only for SMS to visitors // (*mt01*)
				
				$dS_sms = new C_dS_sms($dS_smsinbound->correlator); // at this spot (*sg05*) was the sms id inserted in the smsgateaway push as correlator
				if(!$dS_sms->id) {
					echo 'NOK: the original outbound sms ('.$dS_smsinbound->correlator.') could not be found in mobminder DB';
					continue;
				}
				
				if($dS_sms->templateId != $dS_smsinbound->groupid) {
					echo 'NOK: incoherent templateId in dS_sms('.$dS_sms->templateId.')/vs dS_smsinbound('.$dS_smsinbound->groupid.')';
					continue;
				}
			
				$when = new C_date($dS_smsinbound->created);
				
					$vid = $dS_sms->resourceId;
				$visitor = new C_dS_visitor($vid);
					$rid = $dS_sms->reservationId;
				$reservation = new C_dS_reservation($rid);
				$reservation->setstringtimeformat();
				if($dS_template->inboundaction == 'frwdemail') { // ranges [ignore, frwdemail, frwdmobile], see (*sg08*)
							
					$subject = L::XL('inareply title').' - '.($visitor->getFullName());
					
					$content = L::XL('inareply account').' :<br/><b>'.($dS_account->name).'</b>&nbsp;<br/>';
					$content .= '<br/>'.L::XL('inareply in-msg').' :<br/><b>'.($dS_smsinbound->bla).'</b>&nbsp;<br/>';
						$email = ''; if($visitor->email) $email = ' <br/>'.$visitor->email;
						$origin = $visitor->getFullName().' - '.($dS_smsinbound->from).$email;
					$content .= '<br/>'.L::XL('inareply sender').' :<br/><b>'.$origin.'</b>&nbsp;<br/>';
					$content .= '<br/>'.L::XL('inareply appointment').' :<br/><b>'.$reservation->cueIn.'</b>&nbsp;<br/>';
					$content .= '<br/>'.L::XL('inareply initial').' :<br/><b>'.$dS_sms->text.'</b>&nbsp;<br/>';
					
					if($dS_template->autoreplymsg) {
						$content .= '<br/><br/>'.'Auto-reply message'.' :<br/><b>'.$dS_template->autoreplymsg.'</b>&nbsp;<br/>';
					}
				
					$recipient = $dS_account->email;
					$sender = 'communication@mobminder.com';
					
					if($dS_system->sendComm) // send Comm is a global switch that is located in DB table globals, allows to develop/test locally without sending Emails everywhere
						$mailer->sendMail($subject, $content, $recipient, $sender, $dS_account->language);
					if($web) {
						echo '<br/><br/>EMAIL:<br/>';
						echo $subject.'<br/>'.$content.'<br/>';
					}
				}
				$autoreply = true;
			}
	}
	
	
	if($autoreply)
		if($dS_template->autoreplymsg) { // an auto reply is defined to inbound sms
			// the auto-reply should sneak to the same satellite in got in the system, so the sender gets the answer in the same chat thread
			
				if($campaign) $cor = $visitor->id; else $cor = $dS_sms->id; // (*sg05*)
				$corgroup = $dS_template->id; // we pass the template id has a group correlator (*sg06*)
				$queue = $dS_smsinbound->satid; // makes a queue name like eg 's1021' where 1021 is the satellite id that received the sms, so we send the answer from the same phone number and make it a coherent msg feed for the final recepient device
				$text = $dS_template->autoreplymsg;
				$to = $dS_smsinbound->from;
				$priority = 1;
				$encoding = $dS_template->encoding; 
								
			if($dS_system->sendComm)
				$mobmindergateaway->push($queue, $corgroup /*group*/, $cor /*correlator*/, $to /*to*/, 360 /*lifetime*/, $encoding /*encoding*/, $priority /*priority*/, $text);
			if($web) {
				echo 'AUTO REPLY SMS:<br/>';
				echo $dS_template->autoreplymsg.'<br/>';
			}
		}
}


?>