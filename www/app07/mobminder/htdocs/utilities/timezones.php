<?php
$systemLog = 'timzones.php';
require '../../lib_mobphp/dbio.php';


//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em; font-weight:bold;">'.$t.'</h2>'; }
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
$out = h1('Time zone shifts');



class C_timezone {
	public $town;
	public $offset;
	public $continent;
	public function __construct($tz, $continent) {
		date_default_timezone_set($tz);
		$d = new DateTime();
		$this->offset = $d->getOffset()-3600;
		$this->continent = $continent;
		$this->town = $tz;
	}
	public function display() { 
		// return '<td style="text-align:right;">'.$this->offset.'</td><td>'.$this->town.'</td>'; 
		return $this->town.'<br/>';
		
		// without courtry
		$slash = strpos($this->town, '/'); $l = strlen($this->town);
		$town = substr($this->town,-($l-$slash)+1);
		return $town.'<br/>';
	}
}


class C_byOffset {

	public $byOffset;
	public $continents;
	public function __construct() {
	
		$this->byOffset = Array();
		
		$this->addTimezones(DateTimeZone::AFRICA, 'AFRICA');
		$this->addTimezones(DateTimeZone::AMERICA, 'AMERICA');
		// $this->addTimezones(DateTimeZone::ANTARCTICA, 'ANTARCTICA');
		// $this->addTimezones(DateTimeZone::ARCTIC, 'ARCTIC');
		$this->addTimezones(DateTimeZone::ASIA, 'ASIA');
		// $this->addTimezones(DateTimeZone::ATLANTIC, 'ATLANTIC');
		// $this->addTimezones(DateTimeZone::AUSTRALIA, 'AUSTRALIA');
		$this->addTimezones(DateTimeZone::EUROPE, 'EUROPE');
		$this->addTimezones(DateTimeZone::INDIAN, 'INDIAN');
		$this->addTimezones(DateTimeZone::PACIFIC, 'PACIFIC');
		
		// $this->addTimezones(DateTimeZone::PER_COUNTRY, 'PER_COUNTRY');
		
		ksort($this->byOffset);
		asort($this->continents);
	}
	
	public function addTimezones($continent, $display) {
		
		$list = DateTimeZone::listIdentifiers($continent);
		if(!isset($this->continents[$display])) $this->continents[] = $display;
		foreach($list as $tz) {
			$t = new C_timezone($tz, $display);
			$o = $t->offset;
			$c = $t->continent;
			if(!isset($this->byOffset[$o])) $this->byOffset[$o] = Array();
			if(!isset($this->byOffset[$o][$c])) $this->byOffset[$o][$c] = Array();
			$this->byOffset[$o][$c][] = $t;
			unset($t, $o, $c);
		}
		
	}
	public function display() {
		
		$tds = '<th style="width:6em;">&nbsp;</th>';
		foreach($this->continents as $continent)
			$tds .= '<th style="color:green; font-weight:bold;">'.$continent.'</th>';
		$trs = '<tr>'.$tds.'</tr>';

		foreach($this->byOffset as $offset => $bycontinent) {
			$tds = '<td style="color:red; font-weight:bold; text-align:right; vertical-align:top; padding-right:1em;">'.$offset.'</td>';
			foreach($this->continents as $continent) {
				$towns = ''; 
				if(isset($bycontinent[$continent]))
					foreach($bycontinent[$continent] as $t) { $towns .= $t->display(); }
				$tds .= '<td style="border:1px solid silver;">'.$towns.'</td>';
			}	
			$trs .= '<tr>'.$tds.'</tr>';
		}
		$table = '<table style="width:100%; table-layout:fixed;">'.$trs.'</table>';
		
		return $table;
	}

}

$bo = new C_byOffset();
$out .= $bo->display();

//////////////////////////////////////////////////////
//
//  Parameters
//

echo html($out);


?>