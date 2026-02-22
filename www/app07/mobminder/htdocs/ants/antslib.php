<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 

require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/cues.php';
$nl = "\n";



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Closing connection with calling client
//
//  This is used in some script to avoid the KEEP_ALIVE to maintain numerous 
//  apache2 childs working for the default KEEP_ALIVE time.
//

//   >>>>>>  ob_start();  // this instruction MUST stand before any echo proceeds from the script (*ob1)
	
function closeconnection($tempo = false) { // $tempo in milliseconds, 50 for 50ms

	if($tempo) usleep(1000*$tempo);
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	//
	if(session_id()) session_write_close();
	
	// echo chr(10).'Closing connection.'.chr(10); // PVH 2025 : this was perturbing the reading of the response @ ANTS side. I commented this line.
    $fb = ob_get_contents(); $fl = strlen($fb); // collect, measure and closes ob1, see (*ob1)
    ob_end_clean();
	
	ob_start(); // use a new bufer, ob2
    ignore_user_abort(true); 
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb; // flush has no effect if the buffer is not 4k at least

	// flush all output// 3
	ob_end_flush(); ob_flush(); flush(); // serve client with the content of ob2
	ob_start(); // ob3 catches any subsequent echo, that we will hence never flush to the client
	// echo chr(10).'Connection closed (You never see this message)';
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Authentication
//
//

function Check_Auth_Token() {
	
	$header = apache_request_headers();
	$authtoken = @$header['x-hub-rdv-auth-token'];
	if(!isset($authtoken)) $authtoken = 'NOT AVAILABLE';

	$webmode = @$_GET['web']; if(isset($webmode)) if($webmode) $webmode=!!$webmode; else $webmode = 0;
	if($webmode) {
		echo 'x-hub-rdv-auth-token: |'.$authtoken.'|'.$nl;
	} else {
		if($authtoken != '[ANTS]{mobminder}proj2023.v01') {
			echo '{ "detail": "x-hub-rdv-auth-token header invalid : '.$authtoken.'" }'.$nl.$nl;
			closeconnection(); // escapes from Apache2 KEEP_ALIVE
		}
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  C_dS_Municipality
//
//

class C_dS_Municipality {
	public $id; 	// code insee
	public $mobid; 	// mobminder account id
	public $name;
	public $longitude;
	public $latitude;
	public $public_entry_address;
	public $zip_code;
	public $city_name;
	public $decoded_city_name;
	public $website;
	public $city_logo;
	public function __construct($id,$mobid,$name,$longitude,$latitude,$address,$zip_code,$city_name,$decoded_city_name,$website,$city_logo) {
		$this->id = $id; $this->mobid = $mobid; $this->name = $name;
		$this->longitude = $longitude; $this->latitude = $latitude;
		$this->public_entry_address = $address; $this->zip_code = $zip_code; $this->city_name = $city_name; $this->decoded_city_name = $decoded_city_name;
		$this->website = $website; $this->city_logo = $city_logo;
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  C_dS_Municipality
//
//

class C_dS_ApplicationId {
	public $applid; 	// code insee
	public $mobid; 	// mobminder account id
	public $meeting_point;
	public $datetime;
	public $management_url;
	public $cancel_url;
	public function __construct($applid, $dS_account, $dS_resa) {
		$this->applid = $applid;
		$this->mobid = 0;
		$this->meeting_point = 'Mairie de Chatenoy';
		$this->datetime = '2023-01-01T10:00Z';
		$this->management_url = 'management_url';
		$this->cancel_url = 'cancel_url';
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  Curling ANTS / or How ANTS curls us
//
//

function curl($url, $params, $caller='') {
	global $nl;
	
	$get = '?'; $c = ''; 
	foreach($params as $pname => $pvalue) { 
	
		// Note: strict html standard requires param[] square brackets to pass array values. ANTS does not use it, they pass param=v1, param=v2, etc...
		// if(is_array($pvalue)) foreach($pvalue as $x => $pv) { $get .= $c.$pname.'[]='.urlencode($pv); $c='&'; }
		if(is_array($pvalue)) foreach($pvalue as $x => $pv) { $get .= $c.$pname.'='.urlencode($pv); $c='&'; }
		else { $get .= $c.$pname.'='.urlencode($pvalue); $c='&'; }
	}
	echo 'CURL: '.$url.$get.$nl;
	// $get looks like '?param1=thatvalue&param2=anothervalue&param3=three'

	$httpheaders = [	'Content-Type: application/json; charset=utf-8'
					,	'Accept: application/json'
					, 	'x-rdv-opt-auth-token: [ANTS]{mobminder}proj2023.v01'  // watch the space after :
					, 	'x-hub-rdv-auth-token: [ANTS]{mobminder}proj2023.v01'  // watch the space after :
					, 	'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' ];
	
	$options = array(
		CURLOPT_URL            	=> $url.$get, // contains GET parameters, urlencode() is managed by the curl
		// CURLOPT_POST            => true,  // PVH: according to my test, it is not possible to have tgether POST params and CURLOPT_HTTPHEADER
		// CURLOPT_POSTFIELDS		=> $params,
		CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
		CURLOPT_RETURNTRANSFER 	=> true,
		CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
		CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
		CURLOPT_AUTOREFERER    	=> true,
		CURLOPT_TIMEOUT_MS 		=> 2048, // PVH 2022-01 / a few times out were observed when it was set to 2048ms, now doubled to 4096
		CURLOPT_FRESH_CONNECT 	=> true,
		CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
		CURLOPT_VERBOSE 		=> false,
		CURLOPT_HTTPHEADER		=> $httpheaders,
		CURLOPT_SSL_VERIFYPEER  => false
	);
	$curl = curl_init();
	curl_setopt_array($curl,$options);

	$response = curl_exec($curl);
	
	if(!$response) { // The server is unreachable
		$nl = chr(10);
		$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		$errtext = curl_error($curl);
		$errtitle = 'ANTS call, HTTP error: '.$code.'';
		$errurl = 'error trying to reach ['.$url.']';
		echo $errtitle.'/'.$errurl.'/'.$errtext.$nl;
		curl_close($curl);
		return false;
	} else 
		if(substr($response,0,5)=='error') {
			// we got an error notification from the smsgateaway, let's drop an exception
			// C_dS_exception::put(get_class(), $caller.'curl('.$url.')','smsgateaway returned an error ='.$response);
			echo 'ERROR from remote server:'.$response;
		}
	
	curl_close($curl);
	return $response;
}



?>