<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//	Trying to reach smsgateaway from mobminder app, on the same locahost, using a curl
//	The idea is to change the execution context.
//
//  CAUTION : when going from localhost to prod, you adjust some settings, see (*smsga01*)



class C_firebaseMsg {
	
	public $id;
	public $title;
	public $body;
	public $tokens;
	
	public function __construct($tokens, $title, $body) {
		$this->id = 0;
		$this->title = $title;
		$this->body = $body;
		$this->tokens = $tokens; // is an Array()
	}
}

	$tokens = ['dsB2EQkrTtaq2DeHuGhxmK:APA91bFaKd85iEf3iH1f0jpXnNalqBBdxAUheGKUjxo0TTkdNNVkI8EBFBNSBjAt_nxnRCfJ2x684sV_2kXAj0fm8psG3DmANu9FZj5zIKmto-InJo6BSAAxOTmiuo9MCB3M6VvtRq9n'];
$fbmsg = new C_firebaseMsg($tokens,'Salut, moi c\'est Pascal', 'Et ici c\'est le corps de la notification');




class C_firebaseGateaway {
	
	private $login;
	private $fbkey;
	private $rooturl;
	public function __construct() {
		$this->fbkey = "AAAAOi2ndHM:APA91bFzekQRt1Pjl8eKSNNUfnjCUYZZ5lEQOMztTm9H8RTm07jkgbdAplLL7Xb4v52HfUIkWvG8epZNxPPYq1g44lhr3QwsH5NkeJ5SlKZtG5klYtJuudwJzXeE1yli8kCsC-hYjaAp";
		$this->rooturl = 'https://fcm.googleapis.com/fcm/send'; // production // it is ok to use production even when testing on localhost, only be sure the smsgateaway code is update on the server
	}
	public function push($fbmsg) { // queues an sms in the smsgateway
	

		$reg = $fbmsg->tokens; // must be an Array
		$notif = Array( 
							'title'	=>  $fbmsg->title, 					// utf8
							'body'	=>  $fbmsg->body, 	// utf8
							'sound'	=>  'default',
							'android_channel_id'	=> 'rdv', // For Android >= 8  [comm,rdv,chat]   => rdv => resa
							'channel_id'	=> 'rdv', 		// For Android Version < 8
				);
		$data = Array( 
							'click_action'	=>  'FLUTTER_NOTIFICATION_CLICK', //
							'reservationid'	=>  '24247111',
							'accesskeyid'	=>  '28454',
							'resourceid'	=>  '12773',
							'rvdate'	=>  '2022-03-24',   // skiptodate
						);
	
		$params = array(
			'registration_ids' 	=> $reg,
			'notification' 		=> $notif,
			'data'				=> $data
		);


			$url = $this->rooturl; // does not work on the server
		return $this->curl($url, $params);
	}
	
	private function curl($url, $params) {
	
		$curl = curl_init();
		
		$options = array(
			CURLOPT_URL            	=> $url,
			CURLOPT_POST            => true,
			CURLOPT_POSTFIELDS		=> json_encode($params),
			CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
			CURLOPT_RETURNTRANSFER 	=> true,
			CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
			CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
			CURLOPT_AUTOREFERER    	=> true,
			CURLOPT_TIMEOUT_MS 		=> 4096, // PVH 2022-01 / a few times out were observed when it was set to 2048ms, now doubled to 4096
			CURLOPT_FRESH_CONNECT 	=> true,
			CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
			CURLOPT_VERBOSE 		=> true
		);
		curl_setopt_array($curl,$options);

		$headers = [
			'Content-Type: application/json;charset=UTF-8',
			'Authorization:key='.$this->fbkey
		];
		curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

		$response = curl_exec($curl);
		
		if(!$response) { // The server is unreachable
			$nl = '<br/>'; // chr(10);
			$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			$errtext = curl_error($curl);
			$errtitle = 'Firebase gateaway, HTTP error: '.$code.'';
			$errurl = 'error trying to reach ['.$url.']';
			echo $errtitle.$nl.$errurl.$nl.$errtext.$nl;
			curl_close($curl);
			return false;
		} else {
			echo 'YOOO:'.'<br/>'.$response.'<br/>';
		}
		
		curl_close($curl);
		return $response;
	}
}

$fbgate = new C_firebaseGateaway();
$fbgate->push($fbmsg);




// $smsga = new C_smsgateaway('alphanight88','égè!&=404'); // prod (*smsga01*)
// $smsga = new C_smsgateaway('p','v'); // localhost

// TESTING:

// $r = $smsga->push('dentists',2019112412 /*group*/,999000000 /*correlator*/,32493655599 /*to*/,0 /*lifetime*/,0 /*priority*/,'Santa madonne');

// $r = $smsga->readsmsstatus(false /*queue*/, false /*group*/, false /*correlator*/, );
// foreach($r as $dS_sms)
	// $dS_sms->display();


?>