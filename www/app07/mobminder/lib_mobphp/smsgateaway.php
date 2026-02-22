<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Trying to reach smsgateaway from mobminder app, on the same locahost, using a curl
//	The idea is to change the execution context.
//
//  CAUTION : when going from localhost to prod, you adjust some settings, see (*smsga01*)


// http://localhost/smsgateaway/user/push.php?qn=medicenters&co=1111&to=32493655599&l=plog&p=pass&web=1&bla=This%20message%20%20%C3%A2,%C3%AA,%C3%B6,%C3%A9,%C3%A8,%C3%AF,@%20generated%20on%202019-10-09%2017:37:52%20was%20placed%20on%20queue%20medicenters

///////////// Keep following definitons inline with (*smsga09*)
//
define('sms_status_created'		, 100);	// set by gateaway at queue input   
define('sms_status_expired'		, 800); // lifetime felt down to 0, status set by gateaway
define('sms_status_satellite'	, 110);	// set by gateaway at satellite request
define('sms_status_operator'	, 120);	// provided by satellite at handover to operator (opid is known at that moment)
define('sms_status_pending'		, 190); // provided by satellite
define('sms_status_delivered'	, 200);	// delivered
define('sms_status_error'		, 404); // sms was not accepted by operator (wrong number can be a reason)
define('sms_status_dead'		, 405); // hlr lookup revealed number not in service
define('sms_status_discarded'	, 999); // set by discard.php procedure called from user, so to prepare bunches of SMS for deletion by cron task


class C_smsstatus {
	public $id;
	public $queueid;
	public $correlator;
	public $groupid;
	public $priority;
	public $created;
	public $lifetime;
	public $status;
	public $when;
	public function __construct($stream) {
		$split = explode('|',$stream);
		$this->id = $split[0];
		$this->queueid = $split[1];
		$this->correlator = $split[2];
		$this->groupid = $split[3];
		$this->priority = $split[4];
		$this->created = $split[5];
		$this->lifetime = $split[6];
		$this->status = $split[7];
		$this->when = $split[8];
	}
	public function display() {
		echo ' -id:'.$this->id.' -queueid:'.$this->queueid.' -correlator:'.$this->correlator.' -groupid:'.$this->groupid.' -priority:'.$this->priority.' -created:'.$this->created.' -lifetime:'.$this->lifetime.' -status:'.$this->status.' -when:'.$this->when.'</br>';
	}
}

class C_smsinbound {
	public $id;
	public $satid; // parentid for a C_dS_inbound
	public $correlator;
	public $groupid; // taken from the correlated outbound sms's groupId
	public $created;
	public $from;
	public $bla;
	public function __construct($stream) {
		$split = explode('|',$stream);
		$this->id = $split[0];
		$this->satid = $split[1];
		$this->correlator = $split[2];
		$this->groupid = $split[3];
		$this->created = $split[4];
		$this->from = $split[5];
		$this->bla = $split[6];
	}
	public function display() {
		echo ' -id:'.$this->id.' -satid:'.$this->satid.' -correlator:'.$this->correlator.' -groupid:'.$this->groupid.' -created:'.$this->created.' -from:'.$this->from.' -bla:'.$this->bla.'</br>';
	}
}

class C_smsgateaway {
	
	private $login;
	private $password;
	private $rooturl;
	public function __construct($login, $password) {
		$this->login = $login;
		$this->password = $password;
		
		// $this->rooturl = 'http://127.0.0.1:80/smsgateaway/user'; // local  (*smsga01*)
		// $this->rooturl = 'http://localhost:80/smsgateaway/user'; // local
		$this->rooturl = 'http://smsgateaway.mobminder.com/user'; // production // it is ok to use production even when testing on localhost, only be sure the smsgateaway code is update on the server
	}
	private function fitToGSMascii7($str) { // Converts diacritics into an acceptable form of ascii7, and removes any other UTF8 exotics from the string
		
		// let's start with conversion of exotic chars
		$a = array('’',  '|', 'À', 'Á', 'Â', 'Ã', 'È', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ò', 'Ó', 'Ô', 'Õ', 'Ù', 'Ú', 'Û', 'Ý', 'á', 'â', 'ã', 'ç', 'ê', 'ë', 'í', 'î', 'ï', 'ó', 'ô', 'õ', 'ú', 'û', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ',  'ĳ',  'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ',  'œ',  'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ',  'ǽ',  'Ǿ', 'ǿ', 'Ά', 'ά', 'Έ', 'έ', 'Ό', 'ό', 'Ώ', 'ώ', 'Ί', 'ί', 'ϊ', 'ΐ', 'Ύ', 'ύ', 'ϋ', 'ΰ', 'Ή', 'ή');
		$b = array('\'', 'I', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'c', 'e', 'e', 'i', 'i', 'i', 'o', 'o', 'o', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o', 'Α', 'a', 'Ε', 'e', 'Ο', 'ο', 'o', 'o', 'I', 'i', 'i', 'i', 'Υ', 'u', 'u', 'u', 'Η', 'n');
		$str = str_replace($a, $b, $str);
			
		// now filter anything that is not ascii7 set (https://www.developershome.com/sms/gsmAlphabet.asp)
		// $ascii7a = array(chr(10),chr(13),' ','@','£','$','¥','è','é','ù','ì','ò','Ç','Ø','ø','Å','å','Δ','_','Φ','Γ','Λ','Ω','Π','Ψ','Σ','Θ','Ξ','^','{','}','\\','[','~',']','|','€','Æ','æ','ß','!','"','#','¤','%','&','\'','(',')','*','+',',','-','.','\/','0','1','2','3','4','5','6','7','8','9',':',';','<','=','>','?','¡','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','Ä','Ö','Ñ','Ü','§','¿','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','ä','ö','ñ','ü','à');
		$ascii7s = '/[^\n\r@£$¥èéùìòÇØøÅåΔ_ΦΓΛΩΠΨΣΘΞ^{}\\\[~\]|€ÆæßÉ!\"#¤%&\'\(\)\*+,\-\.\/:;<=>\?¡ÄÖÑÜ§¿äöñüà A-Za-z0-9]/';
		$str = preg_replace($ascii7s,'?',$str);
		return $str;
	}

	public function push($queue,$group,$corr,$to,$lifetime,$encoding,$prio,$blabla) { // queues an sms in the smsgateway
	
		if($encoding<>'ucs2') { // some special chars are not supported by gsm ascii7
			$blabla = $this->fitToGSMascii7($blabla); // best fits UTF8 into gsm ascii7
		}
		
		$params = array(
			'qn' 	=> $queue,
			'co' 	=> $corr,
			'gr'	=> $group,
			'to' 	=> $to,
			'l' 	=> utf8_encode($this->login),
			'p' 	=> utf8_encode($this->password),
			'web' 	=> 0, // smsgateaway/push will close the connection immediately only when web=0, when web=1, comprehensive html verbose mode is active and the hlr lookup loop time will be waited
			'bla' 	=> $blabla,
			'lt'	=> $lifetime, // lifetime in minutes, after this time, the SMS will not be sent and goes to status 800
			'pr' 	=> $prio, // sms priority, default is 0
			'enc' 	=> $encoding, // sms encoding
		);


		$url = $this->rooturl.'/push.php'; // does not work on the server
		
		// the response is something like 
		// #C_dS_sms 
		// 20000357|606|2019-10-10 12:26:55|999888|0|1|59|100|2019-10-10 12:26:55|0|0|0|0|32499500982|a message from locahost using web=0|0000-00-00 00:00:00||0000-00-00 00:00:00||0000-00-00 00:00:00||0000-00-00 00:00:00|
		//
		// We do not use the response
			$caller = 'push('.$queue.','.$corr.','.$group.')::';
		return $this->curl($url, $params, $caller);
	}
	
	public function readsmsstatus($queue = false, $group = false, $corr = false, $since = false) { // read the status of a bunch of sms's (polling mode, not used at the moment PVH-2021, see stripstatusdata )

		$params = array(
			'l' 	=> utf8_encode($this->login),
			'p' 	=> utf8_encode($this->password),
			'web' 	=> 0, // when web=1, comprehensive html verbose mode is active
		);
		if($queue) 	$params['qn'] = $queue; // can be false, one at least should be defined
		if($corr) 	$params['co'] = $corr; 	// can be false, one at least should be defined
		if($group) 	$params['gr'] = $group; // can be false, one at least should be defined
		if($since) 	$params['sn'] = $since; // can be false, one at least should be defined

		$url = $this->rooturl.'/smsstatus.php';
		
		// the response is something like 
		// #C_dS_sms 
		// 20000357|606|2019-10-10 12:26:55|999888|0|1|59|100|2019-10-10 12:26:55|0|0|0|0|32499500982|a message from locahost using web=0|0000-00-00 00:00:00||0000-00-00 00:00:00||0000-00-00 00:00:00||0000-00-00 00:00:00|
		//
		// We do not use the response
		
		$resp = $this->curl($url, $params);
		return C_smsgateaway::stripstatusdata($resp);
	}
	
	public static function stripstatusdata($stream) { // returns an Array of C_smsstatus instances (event based mode, currently used PVH-2021 )
		
		$tagin = '<data>'; $tagout = '</data>';
		$m = mb_substr($stream, mb_strpos($stream, $tagin)+strlen($tagin));
		$stripped = mb_substr($m, 0, mb_strpos($m, $tagout));
		
		// echo str_replace(chr(10),'<br/>',$stripped);
		
		$array = Array();
		$split = explode(chr(10),$stripped);
		if(count($split)) foreach($split as $line)
			if($line) // exclude the last line
				if(substr($line,0,1)!='#') // exclude the header line
					$array[] = new C_smsstatus($line);
					
		return $array;
	}
	
	public static function stripinbounddata($stream) { // returns an Array of C_smsinbound instances
		
		$tagin = '<data>'; $tagout = '</data>';
		$m = mb_substr($stream, mb_strpos($stream, $tagin)+strlen($tagin));
		$stripped = mb_substr($m, 0, mb_strpos($m, $tagout));
		
		// echo str_replace(chr(10),'<br/>',$stripped);
		
		$array = Array();
		$split = explode(chr(10),$stripped);
		if(count($split)) foreach($split as $line)
			if($line) // exclude the last line
				if(substr($line,0,1)!='#') // exclude the header line
					$array[] = new C_smsinbound($line);
					
		return $array;
	}
	
	private function curl($url, $params, $caller='') {
	
		$curl = curl_init();
		
		$options = array(
			CURLOPT_URL            	=> $url,
			CURLOPT_POST            => true,
			CURLOPT_POSTFIELDS		=> $params,
			CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
			CURLOPT_RETURNTRANSFER 	=> true,
			CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
			CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
			CURLOPT_AUTOREFERER    	=> true,
			CURLOPT_TIMEOUT_MS 		=> 4096, // PVH 2022-01 / a few times out were observed when it was set to 2048ms, now doubled to 4096
			CURLOPT_FRESH_CONNECT 	=> true,
			CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
			CURLOPT_VERBOSE 		=> false
		);
		curl_setopt_array($curl,$options);

		$response = curl_exec($curl);
		
		if(!$response) { // The server is unreachable
			$nl = chr(10);
			$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			$errtext = curl_error($curl);
			$errtitle = 'SMS gateaway, HTTP error: '.$code.'';
			$errurl = 'error trying to reach ['.$url.']';
			echo $errtitle.'/'.$errurl.'/'.$errtext.$nl;
			curl_close($curl);
			return false;
		} else 
			if(substr($response,0,5)=='error') {
				// we got an error notification from the smsgateaway, let's drop an exception
				C_dS_exception::put(get_class(), $caller.'curl('.$url.')','smsgateaway returned an error ='.$response);
			}
		
		curl_close($curl);
		return $response;
	}
}


// $smsga = new C_smsgateaway('alphanight88','égè!&=404'); // prod (*smsga01*)
// $smsga = new C_smsgateaway('p','v'); // localhost

// TESTING:

// $r = $smsga->push('dentists',2019112412 /*group*/,999000000 /*correlator*/,32493655599 /*to*/,0 /*lifetime*/,0 /*priority*/,'Santa madonne');

// $r = $smsga->readsmsstatus(false /*queue*/, false /*group*/, false /*correlator*/, );
// foreach($r as $dS_sms)
	// $dS_sms->display();


?>