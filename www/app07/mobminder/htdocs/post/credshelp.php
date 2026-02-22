<?php
////////////////////////////////////////////////////////////////////////////////////////////////
//
//     S E N D    C R E D E N T I A L S    C O P Y    T O   T H E    U S E R   L O G I N
//
//
//


// $loadcontext = 1;	// NO CONTEXT POSSIBLE as we are not logged already. 
// require '../classes/language.php'; // for function getTextBetweenTags() and XLations in mergeMSGtext() used in comm.php
// require '../classes/ajax_session.php'; session_write_close(); 

require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/mblox.php';
// require '../../lib_mobphp/smsgateaway.php';
// require '../../lib_mobphp/comm.php';

$perfReport = new C_perfReport();
$recepient 	= @$_POST['to'];
$testmode = false;

if(!isset($recepient)) { sleep(5); die('0!who are you?'); }
if(!is_numeric($recepient=substr($recepient,0,15)))  { sleep(5); die('0!what do you hope to do?'); } // limits the string to an unrealistic mobile numer lentgh +32493655599123


if(substr($recepient,0,1)=='0')
	$significant = substr($recepient,1,15); // excludes the trunk 0

if(substr($recepient,0,1)=='+')
	$significant = substr($recepient,1,15); // excludes the plus

echo 'significant: '.$significant.$nl;


$q = new Q('select id from logins where mobile like "%'.$significant.'" limit 1;');
$lid = $q->ids();
echo 'loginid:'.$lid.$nl;
if($lid) {

	$dSlogin = new C_dS_login($lid);
	$login = $dSlogin->login;
	$pass = $dSlogin->password;
	
	$dSaccount = new C_dS_group($dSlogin->groupId); $accountId = $dSaccount->id;
	$mobile = $dSlogin->mobile;
		
	$perfReport->peak('::data-retrieved');
	echo 'mobile:'.$mobile.$nl;

	if($mobile) { // then send an SMS
		
		$dS_system = new C_dS_system();
		$SMSremainingCredit = $dSaccount->todaySMSremains >= 0; // which is a boolean // see (*cr10*)

		$creditOK = $SMSremainingCredit; // see (*cr10*)
		$allowed = $dS_system->sendComm && $creditOK; // which is a boolean
		echo 'allowed:'.($allowed?'yep':'nope').$nl;
		

		if(1) { // set to 1 to test client side without sending messages all over the world :)
			
				$shortcodegateaway = new C_mBlox_sms_http();
				
				$sms = new C_dS_sms(0);
				$sms->groupId = $accountId;
				$sms->reservationId = 888;
				$sms->templateId = 10101010; // the template specifies if the message targets a visitor or a group resource
				$sms->resourceId = 20202020; // can be a visitor Id or a group resource Id depending on the message target
				$sms->sendStamp = C_date::getNow();
				$sms->text = $login.$nl.$nl.$pass.$nl;
				$sms->toNumber = $mobile;
				$sms->replyNumber = 'QuickSMS';
				$sms->dSsave(); // turns the Id positive (an SMS must have an id for the dataConnect_ to work with
				
			$perfReport->peak('::message is ready for sending');
			
				if($allowed) $shortcodegateaway->sendOver($sms, 310);
				else echo 'SMS? Sorry guys...'.$nl;
				
			$perfReport->peak('::sendOver function complete');
				$sms->dSsave(); // sms status turned to "transmit" by $connect is recorded in DB, now the SMS is waiting for feedback from aggregator
				
			new Q('update groups set todaySMSremains = todaySMSremains-1 where id = '.$accountId.' and todaySMSremains >0; -- post/credsmsg.php');
			$perfReport->peak('::sms status saved');
				
		}
	} // if($mobile)
} // if($lid)

$perfReport->peak('::completed');

sleep(3);
usleep(rand(10000, 80000)); // bots can read from login/passes validity by measuring the response time of our DB, so we here blur the timeline, see also (*lq01*)

$perfReport->dropReport();
?>