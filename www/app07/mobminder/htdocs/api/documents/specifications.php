<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    M A C H I N E    L O G I N S   A P I   /   S P E C I F I C A T I O N S  
//

require '../apilib.php';


//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// Use always your login data when calling this file: 
//
//		http://localhost/app07/mobminder/htdocs/api/documents/specifications.php?lgn=machine&pwd=machine&kid=42818&web=1
//
// dev link :
//
// 		localhost/app07/mobminder/htdocs/api/documents/specifications.php?lgn=Mobai-B-32&pwd=2024mobai&kid=43766&web=1
//
// prod link :
//		https://api.mobminder.com/documents/specifications.php?lgn=Mobai-B-32&pwd=2024mobai&kid=44368&web=1
// 
//
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
$context = new C_apicontext();

$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting is as value 1

$perfReport->peak('::time needed to retrieve context and posted parameters');


	h3('Checking optional fields');
		if($utc) indent('o utc time format: YES',6);
			else  indent('o utc time format: NO',6);





//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

$par = $context->geturiaccessparms();


pad();
	h1('Overview of interfaces');
	
	h2('Input parameters');
	
		exlainloginputs(); 
		indent('<br/>Any call to an interface of this API should be tailed with your access parameters: <b>&'.$par.'</b>',6);
		
		h3('Optional parameters');
		indent('o web: binary [0,1]. When web=1 you have access to execution in verbose mode and technical spec for the given api interface is displayed',6);
				
	
	
	
	
	
pad();
	h2('API interfaces');

			$aid = $context->accountid;
			
			indent('Clicking the blue links in this section will execute a function of the API and display the Technical spec for this function.',6);
			warning('WARNING: The following links will edit objects in the account '.$context->dS_account->name.'. USE ONLY A SANDBOX ACCOUNT !',6);
			pad();
	
		h3('Queries');
		
			indent('0000: This is the correct link to the present document:',6);
			$l = $host.$uri.'?'.$par.'&web=1';
			href($http.$l, $l, 6); pad(0);
		
		
			indent('0100: Account configuration:',6);
			$l = $host.$uri_1.'/query/config.php'.'?'.$par.'&web=1';
			href($http.$l, $l, 6); pad(0);
		
		
			indent('0101: Account web pages:',6);
			$l = $host.$uri_1.'/query/webconfigs.php'.'?'.$par.'&web=1';
			href($http.$l, $l, 6); pad(0);
		
		
			indent('0200: Search for a visitor:',6);
				$q = new Q('select id, email from visitors where email <> "" and reference = "spectest" and groupId = '.$aid.' limit 1;');
				if($q->hits()) $e = 'email='.$q->mlist('email');
					else {
						$q = new Q('select id, lastname from visitors where lastname <> "" and groupId = '.$aid.' limit 1;');
						$e = 'email='.$q->mlist('lastname');
					}
				$l = $host.$uri_1.'/query/visitors.php'.'?'.$e.'&'.$par.'&web=1';
				href($http.$l, $l, 6); pad(0);
		
		
		
			indent('0300: Read visitor appointments:',6);
				$vid = $q->ids();
				$vids = 'id='.$vid.'&history=1'; // default takes the preceding found visitor
				
				$q = new Q('select visitors.id as id from att_visitors 
					join reservations on reservations.id = att_visitors.groupId
					join visitors on visitors.id = att_visitors.resourceId
					where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' order by visitors.created desc limit 1;');
				if($q->hits()) $vids = 'id='.$q->ids();	
				
				$l = $host.$uri_1.'/query/visiapps.php'.'?'.$vids.'&'.$par.'&web=1';
				href($http.$l, $l, 6); pad(0);
		
		
		
			indent('0310: Read a visitor\'s notes:',6);
				$vid = $q->ids();
				$vids = 'id='.$vid.'&history=1'; // default takes the preceding found visitor
				
				$q = new Q('select visitors.id as id from att_visitors 
					join reservations on reservations.id = att_visitors.groupId
					join visitors on visitors.id = att_visitors.resourceId
					where reservations.cueIn > '.time().' and reservations.groupId = '.$aid.' order by visitors.created desc limit 1;');
				if($q->hits()) $vids = 'id='.$q->ids();	
				
				$l = $host.$uri_1.'/query/visinotes.php'.'?'.$vids.'&'.$par.'&web=1';
				href($http.$l, $l, 6); pad(0);
		
		
		
			indent('0400: Search for availabilities:',6);
					$d = new C_date(); 
					$d = $d->dIncrement(7)->getDateSortable();
				$q = new Q('select id from workcodes where groupId = '.$aid.' limit 1;');
				$wid = 'workcode='.$q->ids().'&limit=1&from='.$d;
				$l = $host.$uri_1.'/query/availabilities.php'.'?'.$wid.'&'.$par.'&web=1';
				href($http.$l, $l, 6); pad(0);
		
		
		
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
					$l = $host.$uri_1.'/query/overbooking.php'.'?'.$qp.'&'.$par.'&web=1';
					href($http.$l, $l, 6); pad(0);
				} else
					indent('In the given sandbox, there is no reservation in the future that can be checked against overbooking',6);

		
			indent('0600: Read account planning (from and days can be used in any case)',6);
			
					$rsc_corrls = $context->rsc_correllators->getRemoteIds();
					$rsc_ids = $context->resources->getIdsList('!');
					pad(0);
					
				indent('0601: Read planning for all resources',9);
					$l = $host.$uri_1.'/query/planning.php'.'?'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
					
				indent('0602: For given resources using resource ids',9);
					$rids = 'rscid='.$rsc_ids; // reads for all resources having a correlator
					$l = $host.$uri_1.'/query/planning.php'.'?'.$rids.'&'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
					
				indent('0603: For given resources using correlators (you have defined synchro correlators in the login preferences)',9);
					$rcls = 'rsccrl='.$rsc_corrls; // reads for all resources having a correlator
					$l = $host.$uri_1.'/query/planning.php'.'?'.$rcls.'&'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
					
				indent('0604: For given resources using correlators and with an aggregated data layout',9);
					$rcls = 'rsccrl='.$rsc_corrls.'&agr=1'; // reads for all resources having a correlator
					$l = $host.$uri_1.'/query/planning.php'.'?'.$rcls.'&'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
					
				indent('0605: Read a given date',9);	
					$d = new C_date(); $d->dIncrement(7); // test reading from the archives
					$cd = $d->getDateSortable();
					$from = 'from='.$cd; // reads for all resources having a correlator
					$l = $host.$uri_1.'/query/planning.php'.'?'.$from.'&'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
					
				indent('0606: Read a given calendar span (7 days in this example)',9);
					$nd = 'days=7'; // reads for all resources having a correlator
					$l = $host.$uri_1.'/query/planning.php'.'?'.$from.'&'.$nd.'&'.$par.'&web=1';
					href($http.$l, $l, 9); pad(0);
			
			
	
		h3('Posts');
		
			indent('1000: Edit visitor\'s data:',6);
						$d = new C_date(); 
						$bd = $d->mIncrement(-240)->getBirthdaySortable();
						$bwd = $d->getDayString();
					$vids = 'id='.$vid.'&note=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=%2b32493655599'; // default takes the preceding found visitor
					$vidscaption = 'id='.$vid.'&ampnote=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=+32493655599';
				$l = $host.$uri_1.'/post/visitor.php'.'?'.$vids.'&'.$par.'&web=1';
				$c = $host.$uri_1.'/post/visitor.php'.'?'.$vidscaption.'&'.$par.'&web=1';
				
				href($http.$l, $c, 6); pad(0);
		
			indent('1010: Create a new visitor:',6);
						$d = new C_date(); 
						$bd = $d->mIncrement(-360)->getBirthdaySortable();
						$bwd = $d->getDayString();
					$vids 			= 'id=0&firstname=Pawel&lastname=Vankowski&note=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=%2b32493655599'; // default takes the preceding found visitor
					$vidscaption 	= 'id=0&ampfirstname=Pawel&amplastname=Vankowski&ampnote=He was born on a '.$bwd.'&ampbirthday='.$bd.'&ampmobile=+32493655599';
				$l = $host.$uri_1.'/post/visitor.php'.'?'.$vids.'&'.$par.'&web=1';
				$c = $host.$uri_1.'/post/visitor.php'.'?'.$vidscaption.'&'.$par.'&web=1';
				
				href($http.$l, $c, 6); pad(0);
		
		
		
			indent('1100: Create or edit a reservation:',6);
			
						$d = new C_date(); $t = $d->getTimeString();
					$resas = 'id='.$rid.'&note=Lets change the note now at '.$t; // default takes the preceding found appointment
					$resascaption = 'id='.$rid.'&ampnote=Lets change the note now at '.$t; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/reservation.php'.'?'.$resas.'&'.$par.'&web=1';
				$c = $host.$uri_1.'/post/reservation.php'.'?'.$resascaption.'&'.$par.'&web=1';
				href($http.$l, $c, 6); pad(0);
		
		
		
			indent('1101: Put a reservation in pre-booking mode:',6);
			
						$preb = 15;
						$d = new C_date(); $t = $d->getTimeString();
						$note = 'was set on prebooking mode at '.$t.', will vanish after '.$preb.' minutes';
					$resas 			= 'id='.$rid.'&preb='.$preb.'&note='.$note; // default takes the preceding found appointment
					$resascaption 	= 'id='.$rid.'&amppreb='.$preb.'&ampnote='.$note; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/reservation.php'.'?'.$resas.'&'.$par.'&web=1';
				$c = $host.$uri_1.'/post/reservation.php'.'?'.$resascaption.'&'.$par.'&web=1';
				href($http.$l, $c, 6); pad(0);
		
		
		
			indent('1102: Cancel pre-booking and set a booking code:',6);
			
						$bc = 123456789;
						$d = new C_date(); $t = $d->getTimeString();
						$note = 'removed from pre-booking delay and booking code set to '.$bc;
					$resas 			= 'id='.$rid.'&preb=0&bookingcode='.$bc.'&note='.$note; // default takes the preceding found appointment
					$resascaption 	= 'id='.$rid.'&amppreb=0&ampbookingcode='.$bc.'&ampnote='.$note; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/reservation.php'.'?'.$resas.'&'.$par.'&web=1';
				$c = $host.$uri_1.'/post/reservation.php'.'?'.$resascaption.'&'.$par.'&web=1';
				href($http.$l, $c, 6); pad(0);
		
		
		
			indent('1200: Post a new note, without visitor reference, applies to all logins:',6);
						$d = new C_date();
						$note = 'this not was set on '.$d->getDateTimeString().', enjoy!';
						$title = 'Today is '.$d->getDayString().', '.$d->getHHmmString().'';
					$vars = 'id=0'.'&title='.$title.'&note='.$note; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/note.php'.'?'.$vars.'&'.$par.'&web=1';
				href($http.$l, 1, 6); pad(0);
		
		
		
			indent('1201: Post a new note, including a visitor reference, applies to all logins:',6);
						$d = new C_date();
						$note = 'this not was set on '.$d->getDateTimeString().', enjoy!';
						$title = 'Today is '.$d->getDayString().', '.$d->getHHmmString().'';
					$vars = 'id=0'.'&title='.$title.'&visirefs='.$vid.'&note='.$note; // default takes the preceding found appointment
				$l = $host.$uri_1.'/post/note.php'.'?'.$vars.'&'.$par.'&web=1';
				href($http.$l, 1, 6); pad(0);
				

	
		h3('Delete');
		
				indent('2000: Reservation:',6);
				$resas = 'id='.$rid.'&note=We are deleting this appointment at '.$t; // default takes the preceding found visitor
				$resascaption = 'id='.$rid.'&ampnote=We are deleting this appointment at '.$t; // default takes the preceding found visitor
			$l = $host.$uri_1.'/delete/reservation.php'.'?'.$resas.'&'.$par.'&web=1';
			$c = $host.$uri_1.'/delete/reservation.php'.'?'.$resascaption.'&'.$par.'&web=1';
			href($http.$l, $c, 6); pad(0);
	
	
pad();



endrendermode();
?>