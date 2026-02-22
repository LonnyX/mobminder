<?php
$systemLog = 'spoofy.php';
require '../../lib_mobphp/dbio.php';


//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}


$out = h1('regex test');


$out .= h2('T1');

	$serverresponse = 'OK 1602765184 UR:6618569';
	$serverresponse = 'OK oui';
	preg_match('/^OK?/', $serverresponse, $matches); // The server has given an answear

	if(isset($matches[0])) { // "OK" was not found in the server answear 
		$out .= notice('MATCH:'.$matches[0]);
	} else 		
		$out .= notice('NO MATCH');



$out .= h1('This is a test');


class sachet {
	public $couleur;
	
	public function __construct() {
		$this->couleur = "rose";
	}
	public function etlesachet() {
		return 'il est ['.$this->couleur.']';
	}
}

class frite extends sachet {
	public $sel;
	public $sauce; 
	public $nbreFrites;
	
	public function __construct($avecSel, $quelSauce) {
		$this->sel = $avecSel;
		$this->sauce = $quelSauce;
		$this->nbreFrites = 30;
		parent::__construct();
	}
	
	public function ckelsauce() {
		return $this->sauce;
	}
	public function cavecsel() {
		if($this->sel) return 'oui';
			else return 'non';
	}
}

$out .= h2('Pour Pascal');
$monSachet = new frite(1, 'mayo');

$out .= notice('Pascal a quel sauce? '.$monSachet->ckelsauce());
$out .= notice('Et il a du sel? '.$monSachet->cavecsel());
$out .= notice('Quel couleur de sachet? '.$monSachet->etlesachet());

$out .= h2('Pour Jonas');
$tonSachet = new frite(0, 'ketchup');

$out .= notice('Jonas a quel sauce? '.$tonSachet->ckelsauce());
$out .= notice('Et il a du sel? '.$tonSachet->cavecsel());
$out .= notice('Quel couleur de sachet? '.$tonSachet->etlesachet());


$out .= h2('TEST');
for($x=0;$x<300;$x++) {
	
	if($x%30==0) $out .= notice('Pause at x= '.$x);
}



echo html($out);


?>