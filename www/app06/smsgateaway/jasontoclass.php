<?php

$pad = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
$br = '<br/>';



class C_hlr_location {

	public function __construct($rr) {
		foreach($this as $member => $v) if(isset($rr[$member])) $this->{$member} = $rr[$member];
	}
	public $verified;
	public $timezone;
	public $location;
	public $network_name;
	public $country_code;
	public $area;
	
	public function display() {
		global $pad;
		echo $pad.$pad.$pad;
		echo 'timezone: '.$this->timezone.', location: '.$this->location.', network_name: '.$this->network_name.', country_code: '.$this->country_code.', area: '.$this->area.'<br/>';
	}
	
}
class C_hlr_lookup {
	
	public function __construct($rr) {
		foreach($this as $member => $v) // collect data of insterest (only members of interest are read from the entering jason)
			if($member=='issueing_info'||$member=='home_info'||$member=='roaming_info') {  // some of the members are instances of C_hlr_location
				if(isset($rr[$member])) // in this case, $stdobj->{$member} is a StdObject
					$this->{$member} = new C_hlr_location($rr[$member]);
				} 
			else
				$this->{$member} = $rr[$member];
	}
	
	public $issueing_info; 	// C_hlr_location
	public $home_info;		// C_hlr_location
	public $roaming_info;	// C_hlr_location
	
	public $type;
	public $msisdn;
	public $error_code;
	public $error_text;
	public $status;
	public $mccmnc;
	public $is_ported;
	public $is_roaming;
	
	public function display() {
		global $pad, $br;
		echo 'HLR lookup for ['.$this->msisdn.']'.$br.$br;
		echo $pad.'type: '.$this->type.$br;
		echo $pad.'o error_text: '.$this->error_text.$br;
		echo $pad.'o status: '.$this->status.$br;
		echo $pad.'o mccmnc: '.$this->mccmnc.$br;
		echo $pad.'o is_ported: '.($this->is_ported?'yes':'no').$br;
		echo $pad.'o is_roaming: '.($this->is_roaming?'yes':'no').$br.$br;
		if($this->issueing_info) { echo $pad.'o issueing_info:'.$br; $this->issueing_info->display(); }
		if($this->home_info) { echo $pad.'o home_info:'.$br; $this->issueing_info->display(); }
		if($this->roaming_info) { echo $pad.'o roaming_info:'.$br; $this->issueing_info->display(); }
		echo $br.$br;
	}
}




	//
	// some jason shit we want to absorb as instances of C_hlr_lookup's
	//
	$response = '{  
	 "32486666520": {
		"issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Telenet","country_code":32,"area":"Belgium","region":"BE"}
		,"type":"Mobile"
		,"msisdn":"32486666520"
		,"error_code":5
		,"error_text":"Inconclusive"
		,"status":"Undelivered"
		,"mccmnc":"20620"
		,"is_ported":false
		,"is_roaming":false
		}
	,"32497401626": {
		"issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium","region":"BE"}
		,"home_info":{"verified":true,"timezone":"Europe/Brussels ","location":"Belgium","network_name":"Proximus (Belgacom Mobile)","country_code":32,"region":"BE"}
		,"roaming_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Proximus","country_code":32,"area":"Belgium","region":"BE"}
		,"type":"Mobile"
		,"msisdn":"32497401626"
		,"error_code":0
		,"error_text":"Live"
		,"status":"Delivered"
		,"mccmnc":"20601"
		,"is_ported":true
		,"is_roaming":false
		}
	,"32493655599": {
		"issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium"}
		,"home_info":{"verified":true,"timezone":"Europe/Brussels ","location":"Belgium","network_name":"Orange (Orange S.A.)","country_code":32}
		,"roaming_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium"}
		,"type":"Mobile"
		,"msisdn":"32493655599"
		,"error_code":0
		,"error_text":"Live"
		,"status":"Delivered"
		,"mccmnc":"20610"
		,"is_ported":false
		,"is_roaming":false
		}
	}';



	$arr = json_decode($response, true); 	// turns jason into an array of array of array ... 
	
	$items = Array(); // note that the expected jason response is an indexed list of [C_hlr_lookup]
	if(count($arr))
		foreach($arr as $msisdn => $i)
			$items[$msisdn] = new C_hlr_lookup($i);

	foreach($items as $nbr => $item)
		$item->display();
	
	
	echo 'done<br/>';


?>