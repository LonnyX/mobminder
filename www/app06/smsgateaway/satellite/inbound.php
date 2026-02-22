<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   I N B O U N D
//
//
//	Calls like:
//  http://localhost/smsgateaway/satellite/alive.php?sim=32493655599&web=1
//

require '../sga_lib.php';
setrendermode('..');

		
$csq = @$_REQUEST['csq']; if(!isset($csq)) die('error 0610'); // carrier signal quality [99,0-31]
	if(!is_numeric($csq)) die('error 0611'); 
$frm = @$_REQUEST['frm']; if(!isset($frm)) die('error 0620'); // from phone number (mandatory)
	if(!is_numeric($frm)) die('error 0621'); 

$mid = @$_REQUEST['mid']; // if(!isset($mid)) die('error 0620'); // message id (taken from User Data Header, applies for Multipart messages, defaults to 0)
	if(!isset($mid)) $mid = 0;
	if(!is_numeric($mid)) die('error 0621'); 
$fid = @$_REQUEST['fid']; // if(!isset($fid)) die('error 0622'); // message frame id (taken from User Data Header, applies for Multipart messages, defaults to 0)
	if(!isset($fid)) $fid = 1;	
	if(!is_numeric($fid)) die('error 0623'); 
$msz = @$_REQUEST['msz']; // if(!isset($msz)) die('error 0624'); // message size is a number of frames (taken from User Data Header, applies for Multipart messages, defaults to 0)
	if(!isset($msz)) $msz = 1;
	if(!is_numeric($msz)) die('error 0625'); 


$bla = @$_REQUEST['bla']; if(!isset($bla)) die('error 0640'); // message alphanumeric


	
$probe = @$_REQUEST['probe']; if(!isset($probe)) $probe = false; else if($probe==1) $probe = 1; else $probe = 0; // probe must be specified like &probe=0 to prevent status change


	$iccid = @$_REQUEST['cid']; if(!isset($iccid)) die('error 0600'); // sim card number ICCID
$satellite = C_dS_satellite::login($iccid);
$satid = $satellite->id;


	$pack = array('csq'=>$csq,'from'=>$frm,'blabla'=>$bla);
$inbound = new C_dS_inbound(0, $satid, $pack);

h2('Welcome satellite: '.$satellite->name);
$satellite->lastseen = C_id::tracknow();
$satellite->lastcsq = $csq;


h2('You are serving the following queues: ');
$queues = $satellite->queues();
foreach($queues as $qid => $dS_queue)
	indent('('.$qid.') '.$dS_queue->name,3);
	
	
h2('Mandatory parameters for this call: ');

	indent('o <b>cid</b>: your SIM ICCID device number [MMCCII123456789012C].',3);
	indent('o <b>csq</b>: your carrier signal quelity [99, 1 to 31].',3);
	indent('o <b>frm</b>: the sender phone number [32499010203].',3);
	indent('o <b>mid</b>: the received UHD message id [numeric 0-255].',3);
	indent('o <b>fid</b>: the received UHD frame id [numeric 0-255].',3);
	indent('o <b>msz</b>: the received UHD message size [numeric 0-255].',3);
	indent('o <b>bla</b>: the received message [alpha numeric utf8].',3);
	pad(0);
	
h2('Optional parameters for this call: ');
	indent('o <b>probe</b>: calls this interface but no writing will happen to DB (that is for testing purpose)',3);
	pad(0);
	

h2('You have posted: ');

	indent('o <b>cid</b>: '.$iccid,3);
	indent('o <b>csq</b>: '.$csq,3);
	indent('o <b>frm</b>: '.$frm,3);
	
	indent('o <b>mid</b>: '.$mid,3);
	indent('o <b>fid</b>: '.$fid,3);
	indent('o <b>msz</b>: '.$msz,3);
	
	indent('o <b>bla</b>: ['.$bla.']',3);
	if($probe!==false) indent('o <b>probe</b>: '.$probe,3);
	pad(0);
	
	
h2('Correlation with outbound: ');
	
	indent('o <b>satid</b>: '.$satid,3);
	
	// this is supposed to be the last sent before the inbound came in, with identical device number and satelliteid
	$sms = false;
	$q = new Q('select id from sms 
				where delivered <= "'.$inbound->created.'" and satelliteid = '.$satid.' and sms.to = '.$inbound->from.'
				order by delivered desc limit 1;');
	if($q->cnt()) {
		$sms = new C_dS_sms($q->ids());
		indent('We found the possible correlation with this outbound message: '.$sms->id,3);
		echo '<data>'; // enclose the file content within the stream
			span('&ltdata&gt');
				echo $sms->stream1(no_tracking, '|').$nl;
			span('&lt/data&gt');
		echo '</data>';
		$inbound->correlator = $sms->id;
		$inbound->groupid = $sms->groupid;
	} else {
		warning('There is no outbound message correlated with this inbound message.');
	}
	
	
	if($probe==1) warning('This message was not saved to DB because you are in probe mode');
	else {
		$inbound->save(); // note that correlator will change later in this script 
	}
	
pad(2);

	$idfields = Array('id','parentid');
	$inboundfields = Array('correlator','created','csq','from','blabla');
	$fields = array_merge($idfields, $inboundfields);
		
	
	echo '<data>'; // enclose the file content within the stream
		span('&ltdata&gt');
			echo $inbound->stream1(no_tracking, '|', $fields).$nl;
		span('&lt/data&gt');
	echo '</data>';
	

	unset($satellite->queues);
	$satellite->save();
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
	
h2('Reporting to user:');

if($inbound->correlator) { // then this inbound sms is related to an outbound sms
	
	//correlator = '.$inbound->correlator.' (do not filter on correlator)
	$q = 'select count(*) as c from inbound where inbound.parentid = '.$satid.' and inbound.from = '.$inbound->from.' and inbound.created > DATE_SUB("'.$inbound->created.'", INTERVAL 1 HOUR);';
	//warning('query='.$q."\n");
	$q = new Q($q);
	$c = $q->c();
	//warning('count='.$c."\n");
    if($c>=5) {
		//inbound limit has been exceeded
		warning('the inbound counter limit (5) has been exceeded ('.$c.') in last 1 hour');
	}
	else{
		//warning('the inbound counter limit (5) has NOT been exceeded ('.$c.') in last 1 hour');
		$queue = new C_dS_queue($sms->parentid);
		$login = new C_dS_login($satellite->parentid);
		$url = $login->inboundurl;
		if(!$url) {
			warning('There is no feedback url associated with this user login.');
		} else {
			
			$inbound->status = sms_inbound_status_escalated;
			if(!$probe) $inbound->save(); // note that correlator will change for reporting
			
			$inbound->correlator = $sms->correlator; // turn correlator into a user understandable value (this correlator was given to outbound sms at push operation)
				// Note: in the mobminder implementation, this correlator is 
				// 	for reminders generated by mobminder : the mobminder.sms id
				// 	for reminders generated by sms campaign utility : the mobminder.visitors id, see see (*sc10*)
			
			$idfields = Array('id','parentid');
			$smsfields = Array('correlator','groupid','created','from','blabla');
			$fields = array_merge($idfields, $smsfields);
			
			$payload = '';
			$payload .= '<data>'; // enclose the file content within the stream
				$payload .= '#C_dS_inbound'.chr(10);
				$payload .=  $inbound->stream(no_tracking, '|', $fields).chr(10);
			$payload .= '</data>';
			
			notice('Sending to:'.$url);
			$r = false;
			$r = smsgacurl($url,Array('stream'=>$payload));
			if($r===false) warning('URL curl error');
			else notice('Response from remote feedback host:<br/>'.$r);
			pad();
		}
	}
}	
	
	
	
	
	pad(); h2('Returned objects');

	explainclass($inbound, $fields, '|');

endrendermode();
?>