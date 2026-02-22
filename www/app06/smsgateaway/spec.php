<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     S M S    G A T E A W A Y    S T U B   /   T E S T     P A G E
//
//
// 	http://localhost/smsgateaway/spec.php?l=plog&p=pass&web=1
// 	http://localhost/smsgateaway/spec.php?l=mob&p=spoden&web=1
//
//  http://smsgateaway.mobminder.com/spec.php?l=pvh&p=dynaudio6a&web=1
//  http://smsgateaway.mobminder.com/dashboard/index.php?l=alphanight88&p=404&web=1
//

require './sga_lib.php';
setrendermode();
$dS_login = checkcredentials();
	
js('window.onload = function () { 
	var t = new C_iSGA("sms_interactive", {lgn:"'.$dS_login->login.'", pss:"'.$dS_login->pass.'"});
	t.init();
	console.log("Page is loaded") }
');



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Queues
//
	
	$qtable = C_dS_queue::$current_queues;
	
$q = new Q('select id from '.$qtable.' where parentid = "'.$dS_login->id.'";'); // queues belong to a login
$c = $q->cnt();
if($c==0) die('error 9001'); // login has no queue
$qid = $q->ids(list_as_array);
$qids = $q->ids(list_as_string);

$queues = Array();
foreach($qid as $id) $queues[$id] = new C_dS_queue($id);


	h3('You own the following queues ');
foreach($queues as $id => $dS_queue) indent($id.' - '.$dS_queue->name,6);

	
	
	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Satellites
//
	
		$sats = C_dS_satellite::$current_satellites;
		
	$q = new Q('select id from '.$sats.' where parentid = "'.$dS_login->id.'";');
	$c = $q->cnt();
	if($c==0) die('error 9002'); // this queue has no satellite
	$sids = $q->ids(list_as_array);

$satellites = Array(); // all satellites
foreach($sids as $sid) $satellites[$sid] = new C_dS_satellite($sid);





////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//



$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '';
if(isset($subfolders[1])) {
	if($subfolders[1]=='smsgateaway') $uri_1 = '/smsgateaway'; // then you are in locahost testing.
}


pad();
	h1('Objects attributes and their meaning/usage');
	
	h2('Outbound sms (outbound: leaving our server to the operator network)');
	explainclass(new C_dS_sms(0), false, '|');
	C_dS_sms::explainstatus();
	
	h2('Queue');
	explainclass(new C_dS_queue(0), false, '|');
	
	h2('Satellite');
	explainclass(new C_dS_satellite(0), false, '|');
	
	h2('Logs');
	explainclass(new C_dS_log(0), false, '|');
	
	h2('Inbound sms (inbound: entering our system)');
	explainclass(new C_dS_inbound(0), false, '|');
	


pad();
	h1('Overview of API interfaces');
	
	h2('Input parameters');
		
		h3('Optional parameters');
		indent('o web: binary [0,1]. When web=1 you have access to execution in verbose mode and technical spec for the given api interface is displayed',6);
		
		pad(); indent('0000: This is the correct link to the present document:',6);
		$l = $host.$uri.'?'.$uriaccess.'&web=1';
		href('http://'.$l, $l, 6); pad(0);
	


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//        U S E R      I N T E R F A C E 
//

pad();
	h2('1. User interface');
			
			
		h3('Queries');
			indent('0221: Monitor your config (satellites to queue patch)',6);
			$l = $host.$uri_1.'/user/config.php'.'?'.$uriaccess.'&web=1';
			href('http://'.$l, $l, 6); pad(0);
			
			indent('0221: Monitor your sms queues',6);
			$l = $host.$uri_1.'/user/monitor.php'.'?'.$uriaccess.'&web=1';
			href('http://'.$l, $l, 6); pad(0);
		
			
			foreach($queues as $qid => $dS_queue) { $qn = 'qn='.$dS_queue->name; break;	}			
			
		h3('Post');
		
			div('sms_interactive','HERE'); pad();
		
			indent('0201: Push an SMS in the queue',6); pad(0);
			foreach($queues as $qid => $dS_queue) {
						$t = time(); 
						$date = Date('Y-m-d H:i:s',$t);
					$co = '&co=1111'.'&to=32493655599';
					$bla = '&bla='.utf8_encode('This message  â,ê,ö,é,è,ï,@ generated on '.$date.' was placed on queue '.$dS_queue->name);
					$qn = 'qn='.$dS_queue->name;
					
				$l = $host.$uri_1.'/user/push.php'.'?'.$qn.$co.'&'.$uriaccess.'&web=1'.$bla;
				href('http://'.$l, $l, 6); pad(0);
			}
		
		h3('Discard');
		
			pad(); indent('0211: Discard an SMS',6);
			$l = $host.$uri_1.'/user/discard.php'.'?'.$qn.'&'.$uriaccess.'&web=1';
			href('http://'.$l, $l, 6); pad(0);
			pad(); 
		
		h3('Log');
			indent('0601: Reading the log file',6); $c = 0;
			foreach($satellites as $sid => $dS_satellite) {
				$sname = 'snm='.$dS_satellite->name;
				$level = 'lvl=critical';
				$l = $host.$uri_1.'/user/readlog.php'.'?'.$sname.'&'.$level.'&'.$uriaccess.'&web=1';
				pad(0); href('http://'.$l, $l, 6); 
				if(++$c>3) break;
			}
			pad(); 
	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//        S A T E L L I T E      I N T E R F A C E 
//
pad();
	h2('2. Satellites interface');
		
		h3('Use case basic flow');

		indent('step 1: satellite calls api/satellite/alive.php?cid=mobilenumber',3);
			indent('- the api returns an SMS object, having an SMS id (*1)',6);
			indent('- the satellite sends the SMS and obtains the operator id',6);
			pad(0);
		indent('step 2: satellite calls api/satellite/feedback.php?cid=mobilenumber&ost=120&sid=[sms id (1*)]&oid=[the operator id]',3);
			indent('- the gateaway stores the new status and the operator id',6);
			pad(0);
		indent('step 3: some time spans',3);
			pad(0);
		indent('step 4: the operator calls the satellite giving a new status for the SMS having operator id (2*)',3);
			pad(0);
		indent('step 5: satellite calls api/satellite/feedback.php?cid=simiccid&ost=[190,200,404]&oid=[the operator id]',3);
			indent('- the gateaway retrieves the SMS object based on the operator id, and updates the status of this SMS',6);
			pad();
			
	
	
		h3('Queries');
			
			pad();
			indent('0102: Query an sms from the queue',6); pad(0);
			indent('Probe mode show the next sms to be sent but does not change the internal status',9);pad(0);
			$c = 0;
			foreach($satellites as $sid => $dS_satellite) {
				$cid = 'cid='.$dS_satellite->iccid;
				$l = $host.$uri_1.'/satellite/alive.php'.'?'.$cid.'&csq=31&pwr=1&ptmp=65&ver=20191019&probe=1&web=1';
				pad(0); href('http://'.$l, $l, 6); 
				if(++$c > 5) break; // limit this display to 5 satellites
			}
			
			pad();
			indent('0102: Query an sms from the queue',6); pad(0);
			indent('Changes the internal status and associates the sms with a satellite',9);pad(0);
			$c = 0;
			foreach($satellites as $sid => $dS_satellite) {
				$cid = 'cid='.$dS_satellite->iccid;
				$l = $host.$uri_1.'/satellite/alive.php'.'?'.$cid.'&csq=31&pwr=1&ptmp=65&ver=20191019&web=1';
				pad(0); href('http://'.$l, $l, 6); 
				if(++$c > 5) break; // limit this display to 5 satellites
			}
		

		
		h3('Post');
			indent('0103: Feedback an sms status',6);
			$sa = getstatusarray('values'); $c = 0;
			foreach($satellites as $sid => $dS_satellite) {
				
				$satid = $dS_satellite->id;
				$q = new Q('select id from sms where satelliteid = '.$satid.' and status <> 800 and status <> 100 order by id asc limit 1;');
				$smsid = $q->ids(list_as_string);
				if(!$smsid) continue;
				$sms = new C_dS_sms($smsid);
				
				
				$cid = 'cid='.$dS_satellite->iccid;
				$l = $host.$uri_1.'/satellite/feedback.php'.'?'.$cid.'&sid='.$smsid.'&ost=0xAA&oid='.($sms->id+123456789);
				pad(0); href('http://'.$l, $l, 6); 
				
				if(++$c > 5) break; // limit this display to 5 satellites
			}
			
			pad();
			indent('0500: Post an inbound sms',6);
				$l = $host.$uri_1.'/satellite/inbound.php'.'?'.$cid.'&frm=32493655599&csq=31&bla=this is the received message&probe=1&web=1';
				pad(0); href('http://'.$l, $l, 6); 
		
		
		
		h3('Log');
			indent('0600: Logging an event to the server',6); $c = 0;
			foreach($satellites as $sid => $dS_satellite) {
				$cid = 'cid='.$dS_satellite->iccid;
				$l = $host.$uri_1.'/satellite/log.php'.'?'.$cid.'&csq='.(rand(12,20)).'&pwr=1&ptmp=65&opid=0&title=bad csq&level=critical&bla=the csq level does not allow sending sms'.'&web=1';
				pad(0); href('http://'.$l, $l, 6); 
				
				if(++$c > 5) break; // limit this display to 5 satellites
			}
		



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//        A D M I N      I N T E R F A C E 
//
		
pad();
	h2('3. Admin interface');
			
	
		h3('Queries');
		
			indent('0000: This is the correct link to the present document:',6);
			$l = $host.$uri.'?'.$uriaccess.'&web=1';
			href('http://'.$l, $l, 6); pad(0);
		
			
			
	
		// h3('Posts');
		
			// indent('1000: Edit visitor\'s data:',6);
						// $d = new C_date(); 
						// $bd = $d->mIncrement(-240)->getBirthdaySortable();
						// $bwd = $d->getDayString();
					// $vids = 'id='.$vid.'&note=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=%2b32493655599'; // default takes the preceding found visitor
					// $vidscaption = 'id='.$vid.'&ampnote=He was born on a '.$bwd.'&birthday='.$bd.'&mobile=+32493655599';
				// $l = $host.$uri_1.'/post/visitor.php'.'?'.$vids.'&'.$uriaccess.'&web=1';
				// $c = $host.$uri_1.'/post/visitor.php'.'?'.$vidscaption.'&'.$uriaccess.'&web=1';
				
				// href('http://'.$l, $c, 6); pad(0);

	
	
	
pad();
endrendermode();

?>