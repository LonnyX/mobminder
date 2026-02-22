<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M O B M I N D E R    S M A R T A P P   /     A P I    S P E C I F I C A T I O N S  
//

ob_start(); // relates to (*cc)
require '../smapplib.php';


//
// You need to create a human login in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
// 		http://localhost/app07/mobminder/htdocs/smart/specs/api.php?lgn=B.Spoden.2024&pwd=bernards2024&kid=44367&web=1
// or prod
// 		https:smart.mobminder.com/specs/api.php?lgn=mobdev&pwd=bernard&kid=28454&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <data></data>
//



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();


pad(); h2('Checking access rights');
	$xpected_alevel = [aLevel_operator,aLevel_supervisor,aLevel_manager,aLevel_seller,aLevel_admin];


$context = new C_apicontext($xpected_alevel);
	$aid = $context->accountid;	
	$creds = $context->geturiaccessparms();

$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1

$perfReport->peak('::time needed to retrieve context and posted parameters');


	h3('Checking optional fields');
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);





//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 




pad();
	h1('Generic for every interface');
	
	pad();
	h2('Input parameters');
	
		exlainloginputs(); 
		indent('<br/>Any call to an interface of this API should be tailed with your access parameters: <b>&'.$creds.'</b>',6);
		
		h3('Optional parameters');
		indent('o web: binary [0,1]. When web=1 you have access to execution in verbose mode and technical spec for the given api interface is displayed',6);
				
	
	$creds .= '&web=1';	


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    Q U E R I E S
	
	pad();
	h1('API interfaces');
	indent('Clicking the blue links in the sections below will execute functions of the API and display the Technical spec for this function.',6);

	
	
if(1) {
	
	pad(); h2('Queries');
	
	
		pad();
		h3('Account configuration');
	
		indent('0099: Query human login keys: (before notifications were implemented)',6);
			$lp = 'lgn='.$context->dS_login->login.'&pwd='.$context->dS_login->password;
			$l = $host.$uri_1.'/query/keys.php'.'?'.$lp.'&web=1';
			
			href($http.$l, 1, 9); pad(0);
			
		indent('0099: Query human login keys: (when notifications were implemented)',6);
				$deviceid = 'iAMtheT3sTdevice1d';
				$fcm = 'dNGdbDtBQ_KexWpZjApZEi:APA91bEQzPsTYioYb84LunKFFKZGRbjXrtUzFJyILzopP5zgEZItlbnhnpdoRuug0P304QjMpnVsvqI62KwnSPIPoI_dnTndn0wMvVlalqgDYt46ekHiNeCh8LXWm1wT5iQlDpx9vUT7';
				$appver = '1.0.15';
				$ua = 'Android 9 (SDK 28), Vanhove Pascal Xiaomi Redmi Note 8T';
			$lp = 'lgn='.$context->dS_login->login.'&pwd='.$context->dS_login->password.'&devid='.$deviceid.'&appver='.$appver.'&ua='.$ua.'&fcm='.$fcm;
			$l = $host.$uri_1.'/query/keys.php'.'?'.$lp.'&web=1';
			
			href($http.$l, 1, 9); pad(0);
	
	
	
	
		indent('0199: Query an account configuration from a key:',6);
			$l = $host.$uri_1.'/query/config.php'.'?'.$creds.'&web=1';
			
			href($http.$l, 1, 9); pad(0);
	
	
			
			
		pad();
		h3('Visitors');

		pad(0);
		indent('0200: Search for a visitor:',6);
		
		$lnamelike = $context->dS_login->lastname;
		$q = new Q('select id from visitors where lastname like "%'.$lnamelike.'%" and groupId = '.$aid.' limit 1;');
		if(!$q->hits()) {
			warning('you need to create a visitor on this account having your -same as login- name');
		} else {
	
			$dS_visitor = new C_dS_visitor($q->ids());
			$name3 = strtolower(substr($dS_visitor->lastname,-4));
			$name5 = substr($dS_visitor->lastname,0,5);
			$mobl5 = substr($dS_visitor->mobile,-5);
			$email = $dS_visitor->email;
			if(!$email) { $email = $dS_visitor->lastname.'@'; }
				else { $apos = strpos($email,'@'); 
					if($apos<=4) $email = substr($dS_visitor->email,0,7);
					else $email = substr($dS_visitor->email,$apos-6,$apos);
				}
			$birth = $dS_visitor->birthday;
			$vid = $dS_visitor->id;
			
				pad(0);
				
			indent('Find a visitor by lastname match',9);
				$e = 'lastname='.$name3;
				
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
					$e = 'lastname='.$name5;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
			indent('Find a visitor on exact lastname (usefull for 2 letters names, like Mr Yu)',9);
			indent('this feature is activated by adding a dot at the end of the searched string',11);
					$e = 'lastname='.$dS_visitor->lastname.'.';
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			
			indent('Find a visitor by mobile match',9);
					$e = 'mobile='.$mobl5;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			
			indent('Find a visitor by email match',9);
					$e = 'email='.$email;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			
			indent('Find a visitor by birthday match',9);
					$e = 'birthday='.$birth;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			
			indent('Find a visitor by id',9);
					$e = 'id='.$vid;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			
				pad(0);
			
			indent('Find visitors and overbooking against given timeframe',9);
			indent('this feature is enabled by passing cuein and cueout to the search engine',11);

			$q = new Q('select reservations.id as id from att_visitors 
				join reservations on reservations.id = att_visitors.groupId
				join visitors on visitors.id = att_visitors.resourceId
				where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' limit 1;');
			$rid = $q->ids();
			
			if($rid) {
				
					$q = new Q('select resourceId as id from att_visitors 
						join reservations on reservations.id = att_visitors.groupId
						where reservations.id = '.$rid.' limit 1;');
					$vid = $q->ids();
				$dS_visitor = new C_dS_visitor($q->ids());
				$name3 = strtolower(substr($dS_visitor->lastname,-4));
				
				
				$dSresa = new C_dS_reservation($rid);
					$dSresa->cueIn-=3600;
					$dSresa->cueOut+=1800;
				$dSresa->magnify()->setstringtimeformat($utc);
					$cin = 	$dSresa->cueIn;
					$cout = $dSresa->cueOut;
				$qp ='lastname='.$name3.'&cuein='.$cin.'&cueout='.$cout;
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$qp.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			} else
				indent('In the given sandbox, there is no reservation in the future, please make one using the webapp',9);
				
				pad(0);

		}
	
			
		indent('0210: Guess a visitor\'s gender:',6);
			pad(0);
				$e = 'fn='.$context->dS_login->firstname;
			$l = $host.$uri_1.'/query/gender.php'.'?'.$e.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
				
				$e = 'fn=Jean-Louis';
			$l = $host.$uri_1.'/query/gender.php'.'?'.$e.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
				
				$e = 'fn=Marie-France';
			$l = $host.$uri_1.'/query/gender.php'.'?'.$e.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
		
		
		
		pad();
		h3('Reservations');
		
	
		pad(0);
		indent('0300: Read one reservation based on its id:',6);
			$vid = $q->ids();
			$vids = 'id='.$vid.'&history=1'; // default takes the preceding found visitor
			
			$q = new Q('select visitors.id as id from att_visitors 
				join reservations on reservations.id = att_visitors.groupId
				join visitors on visitors.id = att_visitors.resourceId
				where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' order by visitors.created desc limit 1;');
			if($q->hits()) $vids = 'id='.$q->ids();	
			
			
			$q = new Q('select reservations.id as id from reservations 
				where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' order by reservations.created desc limit 1;');
			if($q->hits()) $rid = 'resaId='.$q->ids().'&accId='.$aid;
			
			$l = $host.$uri_1.'/query/oneresa.php'.'?'.$rid.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
			
			
		indent('0300: Read visitor appointments:',6);
			
			$l = $host.$uri_1.'/query/visiapps.php'.'?'.$vids.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
	
	
	
		indent('0400: Search for availabilities:',6);
				$d = new C_date(); 
				$d = $d->dIncrement(7)->getDateSortable();
			$q = new Q('select id from workcodes where groupId = '.$aid.' limit 1;');
			$wid = 'workcode='.$q->ids().'&limit=1&from='.$d;
			$l = $host.$uri_1.'/query/availabilities.php'.'?'.$wid.'&'.$creds;
			
			href($http.$l, 1, 9); pad(0);
	
	
	
		indent('0500: Check overbooking:',6);
			$q = new Q('select reservations.id as id from att_visitors 
				join reservations on reservations.id = att_visitors.groupId
				join visitors on visitors.id = att_visitors.resourceId
				where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' limit 1;');
			$rid = $q->ids();
			if(!$rid) {
				$q = new Q('select reservations.id as id from attendees 
				join reservations on reservations.id = attendees.groupId
				where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' limit 1;');
				$rid = $q->ids();
			}
			if($rid) {
				$dSresa = new C_dS_reservation($rid);
				$dSresa->magnify()->setstringtimeformat($utc);
				$atts = $dSresa->streamAttendees(false,'!');
				$cin = 	$dSresa->cueIn;
				$cout = $dSresa->cueOut;
				$qp ='resources='.$atts.'&cueIn='.$cin.'&cueOut='.$cout;
				$l = $host.$uri_1.'/query/overbooking.php'.'?'.$qp.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
			} else {
				indent('In the given sandbox, there is no reservation in the future that can be checked against overbooking',9);
				pad(0);
			}

	
		indent('0400: Magnify one reservation from its id (used after resa id was passed through firebase notification):',6);
			if($rid) {
				$oid = 'accId='.$aid.'&resaId='.$rid;
				$l = $host.$uri_1.'/query/oneresa.php'.'?'.$oid.'&'.$creds;
				href($http.$l, 1, 9); pad(0);
			} else {
				indent('In the given sandbox, there is no reservation in the future that can be checked, please save at least one reservation in the future.',9);
				pad(0);
			}
			


			

		pad();
		h3('Planning');
	
		pad(0);
		indent('0600: Read account planning',6);
				$rsc_ids = $context->resources->getIdsList('!');
				pad(0);
				
			indent('Read planning for all resources',9);
				$l = $host.$uri_1.'/query/planning.php'.'?'.$creds.'&web=1';
				
				href($http.$l, 1, 9); pad(0);
				
			indent('For given resources using resource ids',9);
				$rids = 'rscid='.$rsc_ids; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/planning.php'.'?'.$rids.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
			indent('Read a given date',9);	
				$d = new C_date(); $d->dIncrement(7); // test reading from the archives
				$cd = $d->getDateSortable();
				$from = 'from='.$cd; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/planning.php'.'?'.$from.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
			indent('Read a given calendar span (7 days in this example)',9);
				$nd = 'days=7'; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/planning.php'.'?'.$from.'&'.$nd.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
			indent('Read full days appointments (used for vacations, trainings,... )',9);
				$nd = 'fulldays=1'; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/planning.php'.'?'.$from.'&'.$nd.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);

		pad(0);
		indent('0660: Check for any changes on account planning',6);
				pad(0);
				
			indent('Check a given date',9);	
				$d = new C_date(); $d->dIncrement(7); // test reading from the archives
				$cd = $d->getDateSortable();
				$from = 'from='.$cd; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/plicheck.php'.'?'.$from.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);
				
			indent('Check a calendar span (7 days in this example)',9);
				$nd = 'days=7'; // reads for all resources having a correlator
				$l = $host.$uri_1.'/query/plicheck.php'.'?'.$from.'&'.$nd.'&'.$creds;
				
				href($http.$l, 1, 9); pad(0);

}				





if(1) {	

	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    P O S T S 
				

	pad(); h2('Posts');
		pad();	
		warning('WARNING: Some links might edit objects in the account '.$context->dS_account->name.'. USE ONLY A SANDBOX ACCOUNT !',6);
		pad();	
	
	
		pad();
		h3('Post visitors');
	
		indent('1000: Edit visitor\'s data:',6);
			if(!isset($dS_visitor)) {
				warning('Please create at least one visitor in the account, so this page can show you how to edit it.',6);
			} else {
				$hint = $dS_visitor->lastname.', '.$dS_visitor->firstname.' ('.$dS_visitor->birthday.', '.$dS_visitor->mobile.')';
				notice('The following from your visitors is the target of this test:',9);
				notice($hint,9);
				notice('The birthday will be adapted and also the note for this visitor.',9);
				pad(0);
						$d = new C_date(); 
						$bd = $d->mIncrement(-240)->getBirthdaySortable();
						$bwd = $d->getDayString();
						$vid = $dS_visitor->id;
						$utf8 = 'He ows me §8 56€ but 100 was born on a ';
					$params = 'id='.$vid.'&note='.$utf8.$bwd.'&birthday='.$bd.'&mobile=%2b32493655599'.'&'.$creds; // default takes the preceding found visitor
				$l = $host.$uri_1.'/post/visitor.php'.'?'.$params;
				
				
				href($http.$l, 1, 9); pad(0);
				pad(0);
			}
		
			indent('1010: Create a new visitor:',6);
				notice('Passing a negative or zero id will create the record in the DB',9);
				pad(0);
						$d = new C_date(); 
						$bd = $d->mIncrement(-360)->getBirthdaySortable();
						$bwd = $d->getDayString();
					$params = 'id=0&firstname=Pawel&lastname=Vankowski&note=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=%2b32493655599'.'&'.$creds; // default takes the preceding found visitor
				$l = $host.$uri_1.'/post/visitor.php'.'?'.$params;
				
				
				href($http.$l, 1, 9); pad(0);
			
	
		
		pad();
		h3('Post reservations');
			
		pad(1);
		indent('1100: Create or edit a reservation:',6);
			
			if($rid) {
				$dSresa = new C_dS_reservation($rid);
				$dSresa->magnify()->setstringtimeformat($utc);
				$atts = $dSresa->streamAttendees(false,'!');
				$cin = 	$dSresa->cueIn;
				$cout = $dSresa->cueOut;
				
				
				$hint = 'from '.$dSresa->cueIn.', to '.$dSresa->cueOut.' with id '.$rid;
				notice('The following from your reservations is the target of this test:',9);
				notice($hint,9);
				notice('The note will be adapted.',9);
				pad(0);
							
						$d = new C_date(); $t = $d->getTimeString();
					$params = 'id='.$rid.'&note=Lets change the note now at '.$t.'&'.$creds; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/reservation.php'.'?'.$params;
				
				href($http.$l, 1, 9); pad(0);
			} else
				indent('In the given sandbox, there is no reservation in the future that can be used for this test. Please created at least one reservation on the planning.',6);
			
	
	
	
		indent('1101: Put a reservation in pre-booking mode:',6);
		
					$preb = 15;
					$d = new C_date(); $t = $d->getTimeString();
					$note = 'was set on prebooking mode at '.$t.', will vanish after '.$preb.' minutes';
				$params 			= 'id='.$rid.'&preb='.$preb.'&note='.$note.'&'.$creds; // default takes the preceding found appointment
			$l = $host.$uri_1.'/post/reservation.php'.'?'.$params;
			
			href($http.$l, 1, 6); pad(0);
	
	
	
		indent('1102: Cancel pre-booking and set a booking code:',6);
		
					$bc = 123456789;
					$d = new C_date(); $t = $d->getTimeString();
					$note = 'removed from pre-booking delay and booking code set to '.$bc;
				$params = 'id='.$rid.'&preb=0&bookingcode='.$bc.'&note='.$note.'&'.$creds; // default takes the preceding found appointment
			$l = $host.$uri_1.'/post/reservation.php'.'?'.$params;
			
			href($http.$l, 1, 6); pad(0);
			
			
			
		
		pad();	
		h3('Post user options');
			
		indent('1200: Post display details:',6);
					$bitfield = 8421433;
					$device = device_type_smartphone;
					$mode = planning_view_vertical; // vertical
					$rtype = class_bCal; // 
					
				$params = 'dev='.$device.'&mode='.$mode.'&rtype='.$rtype.'&bits='.$bitfield.'&'.$creds;
			$l = $host.$uri_1.'/post/ddetails.php'.'?'.$params;
			
			href($http.$l, 1, 6); pad(0);
			
		
		/*	We will use templates like for emails and SMSs
		indent('1210: Post notifications options:',6);
					$bitfield = 8421433;
					
				$params = 'bits='.$bitfield.'&'.$par;
			$l = $host.$uri_1.'/post/notifoptions.php'.'?'.$params;
			
			href($http.$l, 1, 6); pad(0);
			*/ 
		
		
		
		pad();
		h3('Post logs');

		indent('1900: Post a log:',6);
				notice('(to read logs, see section Monitoring here below)',10);
				pad(0);
						$kid = $context->dS_accesskey->id;
						$crit = 'notice';
						$class = 'Widget Login';
						$funct = 'getKey()';
						$msg = 'A seller login logged on using key: '.$kid;
						$ua = 'IOS 137';
						$version = '10.4 (build %2322)';
					$params = 'ua='.$ua.'&version='.$version.'&criticity='.$crit.'&class='.$class.'&function='.$funct.'&msg='.$msg.'&'.$creds;
				
				
				
				notice('Notice',10);
				href($http.$l, 1, 9); pad(0);
				
						$crit = 'warning';
						$class = 'Widget Cache';
						$funct = 'read api _planning';
						$msg = 'An abnormal long lag happened on the device: 5.434ms when reading from _planning api';
						$ua = 'Android 23.01.2';
						$version = '1.0.4 (build  %2323)';
					$params = 'ua='.$ua.'&version='.$version.'&criticity='.$crit.'&class='.$class.'&function='.$funct.'&msg='.$msg.'&'.$creds;
				
				
				
				notice('Warning',10);
				href($http.$l, 1, 9); pad(0);
				
						$crit = 'error';
						$class = 'Widget visitor';
						$funct = 'read api visiapps';
						$msg = 'Error returned from server when reading on api visiapps with following parameters: id=5458399';
						$ua = 'IOS 15.1';
						$version = '1.0.4 (build %2324)';
					$params = 'ua='.$ua.'&version='.$version.'&criticity='.$crit.'&class='.$class.'&function='.$funct.'&msg='.$msg.'&'.$creds;
				
				
				
				notice('Error',10);
				href($http.$l, 1, 9); pad(0);
				
						$crit = 'fatal';
						$class = 'Widget DayView';
						$funct = 'getTag()';
						$msg = 'The following tag is declared in the appointment data set but was not find in the account configuration: 5465';
						$ua = 'Android 24.02.1';
						$version = '1.0.4 (build  %2325)';
					$params = 'ua='.$ua.'&version='.$version.'&criticity='.$crit.'&class='.$class.'&function='.$funct.'&msg='.$msg.'&'.$creds;
				
				
				
				notice('Fatal',10);
				href($http.$l, 1, 9); pad(0);
}



if(1) {	


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    D E L E T E


	pad(); h2('Delete');
		pad();	
		warning('WARNING: Some links might edit objects in the account '.$context->dS_account->name.'. USE ONLY A SANDBOX ACCOUNT !',6);
		pad();	
	
		if($rid) {
			$dSresa = new C_dS_reservation($rid);
			$dSresa->magnify()->setstringtimeformat($utc);
			$atts = $dSresa->streamAttendees(false,'!');
			$cin = 	$dSresa->cueIn;
			$cout = $dSresa->cueOut;
			
			indent('2000: Reservation:',6);
			
			$hint = 'from '.$dSresa->cueIn.', to '.$dSresa->cueOut.' with id '.$rid;
			notice('The following from your reservations is the target of this test:',9);
			notice($hint,9); pad(0);
			
				$params = 'id='.$rid.'&note=We are deleting this appointment at '.$t.'&'.$creds; // default takes the preceding found visitor
			$l = $host.$uri_1.'/delete/reservation.php'.'?'.$params;
			
			href($http.$l, 1, 6); pad(0);
		} else
			indent('In the given sandbox, there is no reservation in the future that can be deleted. Please created at least one reservation on the planning.',6);
			
			pad();
			
			indent('2100: Device registration:',6);
			pad(0);
			
				$params = 'devid='.$deviceid.'&'.$creds;
			$l = $host.$uri_1.'/delete/device.php'.'?'.$params;
			href($http.$l, 1, 6); pad(0);
}



if(1) {	


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    M O N I T O R I N G   /   D A S H B O A R D


	pad(); h2('Monitoring');
		pad();	
	
	indent('9000: Read log file:',6);
			$lp = 'lgn='.$context->dS_login->login.'&pwd='.$context->dS_login->password.'&web=1';
		$l = $host.$uri_1.'/dashboard/logs.php'.'?'.$lp;
		
		href($http.$l, 1, 6); pad(0);

}


	/////////////////////////////////////////////////////////////////////////////////////////////
	//
	//    S W I T C H    T O   A N O T H E R    A C C O U N T 	/ o r   U S E R
	
	pad(3);		
	h1('Context switch');

	pad();
	h2('Log to the same account as a different user');
		
		pad();
			

			$akeys = new C_dbAccess_accesskey();
			$akeys->loadOnAccount($aid);
			$akeys->magnifyToLogins();
			
		indent('0001: Use one of those links to switch the user:',6);
		notice('(These are the accounts your login is authorized to access)',11);
		pad(0);
			foreach($akeys->keyed as $a => $dS_akey) {
				if($dS_akey->dS_login->accessLevel < aLevel_operator) continue;
				$creds = 'lgn='.$dS_akey->dS_login->login.'&pwd='.$dS_akey->dS_login->password.'&kid='.$dS_akey->id;	
				indent($dS_akey->dS_login->lastname.' '.$dS_akey->dS_login->firstname.' :',9);
				$l = $host.$uri.'?'.$creds.'&web=1';
				href($http.$l, 0, 9); pad(0);
			}

	pad();
	h2('Switch to another account');
		
		indent('Clicking the blue links in the sections below will execute functions of the API and display the Technical spec for this function.',6);
		pad();
			

			$akeys = new C_dbAccess_accesskey($context->dS_login->id);
			$accounts = new C_dbAccess_groups();
			$accounts->loadonkeys($akeys);
			
		indent('0000: Use one of those links to switch to another account:',6);
		notice('(These are the accounts your login is authorized to access)',11);
		pad(0);
			foreach($akeys->keyed as $a => $dS_akey) {
				$dS_acc = $accounts->keyed[$dS_akey->accountId];
				$inlog = $context->geturiaccessparms($dS_akey->id);
				indent($dS_acc->name.' :',9);
				$l = $host.$uri.'?'.$inlog.'&web=1';
				href($http.$l, 0, 9); pad(0);
			}
		pad();
		
		

pad(20);
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>