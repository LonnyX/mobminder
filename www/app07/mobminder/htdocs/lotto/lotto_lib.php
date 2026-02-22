<?php
$systemLog = 'spoofy.php';
require '../../lib_mobphp/dbio.php';

set_time_limit(300);
ini_set('memory_limit', '2048M');

//////////////////////////////////////////////////////
//
//  Echo functions
//
$out = '';
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="color:#7595AF; font-size:1.4em; margin:4em 2em 1em 2em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="color:#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 


		$s = '
				.pincell { border:1px solid pink; border-radius:.2em; color:red; }
				.selected { border-color:red; background:red; color:white; }
				.scorecell { border:1px solid pink; line-height:2em; color:grey; padding:0 1em; }
			';

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="./utilities/visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<style>'.$s.'</style>';
			$o .= '</head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}





////////////////////////////////////////////////////////////////////////////
//
// Library
//
//


class L_pick {  // this is a collection of randomly picked L_grid's each number from those begin distinct
	
	public $laps; 
	public $grids;
	public $remaining;
	public function __construct($laps, $remaining = false) { // laps is the number of different L_grid's you want to make
		$this->laps = $laps;
		$this->grids = Array();
		$this->remaining = $remaining===false ? $this->newballsbag() : $remaining;

		$rem = $this->remaining;
		$g = 0;
		while($g++<$this->laps) {

			// preparing a new game
			$selection = Array();

			// executing game
			$t=10;
			while($t>0) { // piccking t-1 balls

				$bc = count($rem); // balls count
				// if($g<2) $out .= notice('balls remaining in this set = '.$bc); // debug info
				
				$pos = rand(0, $bc-1); // select randomly from remaining balls
				$pinpoint = $rem[$pos]; // value of the chosen ball
				$selection[] = $pinpoint; // account the chosen ball value

					// re-lift the remaining balls (set indexing sequential again)
					unset($rem[$pos]);
					$relift = Array();
					foreach($rem as $p => $v) $relift[] = $v;
					$rem = $relift;
				$t--;
			}
			// $out .= notice('Selection: '.$selection[0].','.$selection[1].','.$selection[2].','.$selection[3].','.$selection[4].','.$selection[5].',('.$selection[6].')');

			$this->grids[$g] = new L_grid('Grid Nbr '.$g, $selection);

		}

	}
	private function newballsbag() {
		$c = 0;
		$bag = Array();
		while($c++<45) { $bag[] = $c; } // all bowls at beginning of game
		// $out .= h2('Game Week '.$g);
		// $out .= h2('We have placed '.count($bag).' balls in the game. ['.$bag[0].',...,'.$bag[44].']');
		return $bag;
	}
}


class L_games { // this is a collection of randomly picked number from a grid of 45 targets

	public $laps; 
	public $wsels;
	public function __construct($laps) { // laps is the number of different turns (each turn picks 6 + 1 balls)
		$this->laps = $laps;
		$this->wsels = Array();

		$week = 0;
		while($week++<$this->laps) {

			// preparing a new game
			$selection = Array();
			$remaining = $this->newballsbag();

			// executing game
			$t=7;
			while($t>0) {

				$bc = count($remaining); // balls count
				// if($week<2) $out .= notice('balls remaining in this set = '.$bc); // debug info
				$pos = rand(0, $bc-1); // select randomly from remaining balls
				$pinpoint = $remaining[$pos]; // value of the chosen ball
				$selection[] = $pinpoint; // account the chosen ball value

					// re-lift the remaining balls (set indexing sequential again)
					unset($remaining[$pos]);
					$relift = Array();
					foreach($remaining as $p => $v) $relift[] = $v;
					$remaining = $relift;
				$t--;
			}
			// $out .= notice('Selection: '.$selection[0].','.$selection[1].','.$selection[2].','.$selection[3].','.$selection[4].','.$selection[5].',('.$selection[6].')');

			$this->wsels[$week] = $selection;

		}

	}
	private function newballsbag() {
		$c = 0;
		$bag = Array();
		while($c++<45) { $bag[] = $c; } // all bowls at beginning of game
		// $out .= h2('Game Week '.$week);
		// $out .= h2('We have placed '.count($bag).' balls in the game. ['.$bag[0].',...,'.$bag[44].']');
		return $bag;
	}
}

class L_gains {
	public static $coefficients; // coefficients defined by Lotto for all mutli-grids
	public static $gains; 
	public $score;
	public $multi;
	public function __construct($score, $multi) { // grids is an array of integers [1,...,45]
		$this->score = $score;
		$this->multi = $multi;
	}
	public function gain() {
		$c = L_gains::$coefficients[$this->score][$this->multi];
		$eur = L_gains::$gains;
		$g = 0;
		foreach($eur as $r => $e) {
			$g += $e * $c[$r];
		}
		return $g;
	}

	public static function setup() {
		//
		// 	TABLEAU DE RÉPARTITION DES GAINS LOTTO MULTI ET MULTI+
		//  
		// 
		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		// NOS exacts Rang (exacts) Gains cumulés :
		//
		// 		6+ 	1 (6) 		1 		1 		1 		1 		1 		1 		1 		1 		1
		// 			2 (5+) 		6 	 	6 	 	6 	 	6 	 	6 	 	6 	 	6 	 	6 	 	6
		// 	 		3 (5) 				6 	 	12 	 	18 	 	24 	 	30 	 	36 	 	42 	 	48
		// 	 		4 (4+) 	 			15 	 	30 	 	45 	 	60 	 	75 	 	90 	 	105 	120
		// 	 		5 (4) 	 					15 	 	45 	 	90 	 	150 	225 	315 	420
		// 	 		6 (3+) 	 					20 	 	60 	 	120 	200 	300 	420 	560
		// 	 		7 (3) 	 							20 	 	80 	 	200 	400 	700 	1120
		// 	 		8 (2+) 	 							15 	 	60 	 	150 	300 	525 	840
		// 	 		9 (1+) 	 									6 	 	30 	 	90 	 	210 	420


		$a6p = Array(7 	=> Array(1=>1, 2=>6, 3=>0,  4=>0,   5=>0,   6=>0,   7=>0,    8=>0,   9=>0)
					,8 	=> Array(1=>1, 2=>6, 3=>6,  4=>15,  5=>0,   6=>0,   7=>0,    8=>0,   9=>0)
					,9 	=> Array(1=>1, 2=>6, 3=>12, 4=>30,  5=>15,  6=>20,  7=>0,    8=>0,   9=>0)
					,10 => Array(1=>1, 2=>6, 3=>18, 4=>45,  5=>45,  6=>60,  7=>20,   8=>15,  9=>0)
					,11 => Array(1=>1, 2=>6, 3=>24, 4=>60,  5=>90,  6=>120, 7=>80,   8=>60,  9=>6)
					,12 => Array(1=>1, 2=>6, 3=>30, 4=>75,  5=>150, 6=>200, 7=>200,  8=>150, 9=>30)
					,13 => Array(1=>1, 2=>6, 3=>36, 4=>90,  5=>225, 6=>300, 7=>400,  8=>300, 9=>90)
					,14 => Array(1=>1, 2=>6, 3=>42, 4=>105, 5=>315, 6=>420, 7=>700,  8=>525, 9=>210)
					,15 => Array(1=>1, 2=>6, 3=>48, 4=>120, 5=>420, 6=>560, 7=>1120, 8=>840, 9=>420)); 

		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	6 	1 (6) 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1
		// 	 		3 (5) 	 	6 	 	12 	 	18 	 	24 	 	30 	 	36 	 	42 	 	48 	 	54
		// 	 		5 (4) 	 			15 	 	45 	 	90 	 	150 	225 	315 	420 	540
		// 	 		7 (3) 	 					20 	 	80 	 	200 	 400 	700 	1120 	1680


		$a6 = Array(7 	=> Array(1=>1, 2=>0, 3=>6,  4=>0,  5=>0,    6=>0, 7=>0,    8=>0,  9=>0)
					,8 	=> Array(1=>1, 2=>0, 3=>12, 4=>0,  5=>15,   6=>0, 7=>0,    8=>0,  9=>0)
					,9 	=> Array(1=>1, 2=>0, 3=>18, 4=>0,  5=>45,   6=>0, 7=>20,   8=>0,  9=>0)
					,10 => Array(1=>1, 2=>0, 3=>24, 4=>0,  5=>90,   6=>0, 7=>80,   8=>0,  9=>0)
					,11 => Array(1=>1, 2=>0, 3=>30, 4=>0,  5=>150,  6=>0, 7=>200,  8=>0,  9=>0)
					,12 => Array(1=>1, 2=>0, 3=>36, 4=>0,  5=>225,  6=>0, 7=>400,  8=>0,  9=>0)
					,13 => Array(1=>1, 2=>0, 3=>42, 4=>0,  5=>315,  6=>0, 7=>700,  8=>0,  9=>0)
					,14 => Array(1=>1, 2=>0, 3=>48, 4=>0,  5=>420,  6=>0, 7=>1220, 8=>0,  9=>0)
					,15 => Array(1=>1, 2=>0, 3=>54, 4=>0,  5=>540,  6=>0, 7=>1680, 8=>0,  9=>0) ); 

		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	5+ 	2 (5+) 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1 	 	1
		// 	 		3 (5) 	 	1 	 	2 	 	3 	 	4 	 	5 	 	6 	 	7 	 	8 	 	9
		// 	 		4 (4+) 	 	5 	 	10 	 	15 	 	20 	 	25 	 	30 	 	35 	 	40 	 	45
		// 	 		5 (4) 	 			5 	 	15 	 	30 	 	50 	 	75 	 	105 	140 	180
		// 	 		6 (3+) 	 			10 	 	30 	 	60 	 	100 	150 	210 	280 	360
		// 	 		7 (3) 	 					10 	 	40 	 	100 	200 	350 	560 	840
		// 	 		8 (2+) 	 					10 	 	40 	 	100 	200 	350 	560 	840
		// 	 		9 (1+) 	 							5 	 	25 	 	75 	 	175 	350 	630

		$a5p = Array(7 	=> Array(1=>0, 2=>1, 3=>1, 4=>5,   5=>0,   6=>0,   7=>0,    8=>0,   9=>0)
					,8 	=> Array(1=>0, 2=>1, 3=>2, 4=>10,  5=>5,   6=>10,  7=>0,    8=>0,   9=>0)
					,9 	=> Array(1=>0, 2=>1, 3=>3, 4=>15,  5=>15,  6=>30,  7=>10,   8=>10,  9=>0)
					,10 => Array(1=>0, 2=>1, 3=>4, 4=>20,  5=>30,  6=>60,  7=>40,   8=>40,  9=>5)
					,11 => Array(1=>0, 2=>1, 3=>5, 4=>25,  5=>50,  6=>100, 7=>100,  8=>100, 9=>25)
					,12 => Array(1=>0, 2=>1, 3=>6, 4=>30,  5=>75,  6=>150, 7=>200,  8=>200, 9=>75)
					,13 => Array(1=>0, 2=>1, 3=>7, 4=>35,  5=>105, 6=>210, 7=>350,  8=>350, 9=>175)
					,14 => Array(1=>0, 2=>1, 3=>8, 4=>40,  5=>140, 6=>280, 7=>560,  8=>560, 9=>350)
					,15 => Array(1=>0, 2=>1, 3=>9, 4=>45,  5=>180, 6=>360, 7=>630,  8=>630, 9=>630) ); 

		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	5 	3 (5) 	 	2 	 	3 	 	4 	 	5 	 	6 	 	7 	 	8 	 	9 	 	10
		// 	 		5 (4) 	 	5 	 	15 	 	30 	 	50 	 	75 	 	105 	140 	180 	225
		// 	 		7 (3) 	 			10 	 	40 	 	100 	200 	350 	560 	840 	1200
		//
		$a5 = Array( 7 	=> Array(1=>0, 2=>0, 3=>2,  4=>0,  5=>5,    6=>0, 7=>0,     8=>0,  9=>0)
					,8 	=> Array(1=>0, 2=>0, 3=>3,  4=>0,  5=>15,   6=>0, 7=>10,    8=>0,  9=>0)
					,9 	=> Array(1=>0, 2=>0, 3=>4,  4=>0,  5=>30,   6=>0, 7=>40,    8=>0,  9=>0)
					,10 => Array(1=>0, 2=>0, 3=>5,  4=>0,  5=>50,   6=>0, 7=>100,   8=>0,  9=>0)
					,11 => Array(1=>0, 2=>0, 3=>6,  4=>0,  5=>75,   6=>0, 7=>200,   8=>0,  9=>0)
					,12 => Array(1=>0, 2=>0, 3=>7,  4=>0,  5=>105,  6=>0, 7=>350,   8=>0,  9=>0)
					,13 => Array(1=>0, 2=>0, 3=>8,  4=>0,  5=>140,  6=>0, 7=>560,   8=>0,  9=>0)
					,14 => Array(1=>0, 2=>0, 3=>9,  4=>0,  5=>180,  6=>0, 7=>840,   8=>0,  9=>0)
					,15 => Array(1=>0, 2=>0, 3=>10, 4=>0,  5=>225,  6=>0, 7=>1200,  8=>0,  9=>0) ); 


		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	4+ 	4 (4+) 	 	2 	 	3 	 	4 	 	5 	 	6 	 	7 	 	8 	 	9 	 	10
		// 	 		5 (4) 	 	1 	 	3 	 	6 	 	10 	 	15 	 	21 	 	28 	 	36 	 	45
		// 	 		6 (3+) 	 	4 	 	12 	 	24 	 	40 	 	60 	 	84 	 	112 	144 	180
		// 	 		7 (3) 	 			4 	 	16 	 	40 	 	80 	 	140 	224 	336 	480
		// 	 		8 (2+) 	 			6 	 	24 	 	60 	 	120 	210 	336 	504 	720
		// 	 		9 (1+) 	 					4 	 	20 	 	60 	 	140 	280 	504 	840
		//

		$a4p = Array(7 	=> Array(1=>0, 2=>0, 3=>0, 4=>2,  5=>1,   6=>4,   7=>0,    8=>0,   9=>0)
					,8 	=> Array(1=>0, 2=>0, 3=>0, 4=>3,  5=>3,   6=>12,  7=>4,    8=>6,   9=>0)
					,9 	=> Array(1=>0, 2=>0, 3=>0, 4=>4,  5=>6,   6=>24,  7=>16,   8=>24,  9=>4)
					,10 => Array(1=>0, 2=>0, 3=>0, 4=>5,  5=>10,  6=>40,  7=>40,   8=>60,  9=>20)
					,11 => Array(1=>0, 2=>0, 3=>0, 4=>6,  5=>15,  6=>60,  7=>80,   8=>120, 9=>60)
					,12 => Array(1=>0, 2=>0, 3=>0, 4=>7,  5=>21,  6=>84,  7=>140,  8=>210, 9=>140)
					,13 => Array(1=>0, 2=>0, 3=>0, 4=>8,  5=>28,  6=>112, 7=>224,  8=>336, 9=>280)
					,14 => Array(1=>0, 2=>0, 3=>0, 4=>9,  5=>36,  6=>144, 7=>336,  8=>504, 9=>504)
					,15 => Array(1=>0, 2=>0, 3=>0, 4=>10, 5=>45,  6=>180, 7=>480,  8=>720, 9=>840) ); 


		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	4 	5 (4) 	 	3 	 	6 	 	10 	 	15 	 	21 	 	28 	 	36 	 	45 	 	55
		// 	 		7 (3) 	 	4 	 	16 	 	40 	 	80 	 	140 	224 	336 	480 	660
		//
		$a4 = Array( 7 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>3,    6=>0, 7=>4,     8=>0,  9=>0)
					,8 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>6,    6=>0, 7=>16,    8=>0,  9=>0)
					,9 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>10,   6=>0, 7=>40,    8=>0,  9=>0)
					,10 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>15,   6=>0, 7=>80,    8=>0,  9=>0)
					,11 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>21,   6=>0, 7=>140,   8=>0,  9=>0)
					,12 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>28,   6=>0, 7=>224,   8=>0,  9=>0)
					,13 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>36,   6=>0, 7=>336,   8=>0,  9=>0)
					,14 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>45,   6=>0, 7=>480,   8=>0,  9=>0)
					,15 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>55,   6=>0, 7=>660,   8=>0,  9=>0) ); 


		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	3+ 	6 (3+) 	 	3 	 	6 	 	10 	 	15 	 	21 	 	28 	 	36 	 	45 	 	55
		// 	 		7 (3) 	 	1 	 	4 	 	10 	 	20 	 	35 	 	56 	 	84 	 	120 	165
		// 	 		8 (2+) 	 	3 	 	12 	 	30 	 	60 	 	105 	168 	252 	360 	495
		// 	 		9 (1+) 	 			3 	 	15 	 	45 	 	105 	210 	378 	630 	990
		//
		$a3p = Array(7 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>3,   7=>1,    8=>3,   9=>0)
					,8 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>6,   7=>4,    8=>12,  9=>3)
					,9 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>10,  7=>10,   8=>30,  9=>15)
					,10 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>15,  7=>20,   8=>60,  9=>45)
					,11 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>21,  7=>35,   8=>105, 9=>105)
					,12 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>28,  7=>56,   8=>168, 9=>210)
					,13 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>36,  7=>84,   8=>252, 9=>378)
					,14 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>45,  7=>120,  8=>360, 9=>630)
					,15 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>55,  7=>165,  8=>495, 9=>990) ); 



		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	3 	7 (3) 	 	4 	 	10 	 	20 	 	35 	 	56 	 	84 	 	120 	165 	220
		//
		$a3 = Array( 7 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>4,    8=>0,  9=>0)
					,8 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>10,   8=>0,  9=>0)
					,9 	=> Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>20,   8=>0,  9=>0)
					,10 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>35,   8=>0,  9=>0)
					,11 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>56,   8=>0,  9=>0)
					,12 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>84,   8=>0,  9=>0)
					,13 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>120,  8=>0,  9=>0)
					,14 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>165,  8=>0,  9=>0)
					,15 => Array(1=>0, 2=>0, 3=>0,  4=>0,  5=>0,   6=>0, 7=>220,  8=>0,  9=>0) ); 



		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	2+ 	8 (2+) 	 	4 	 	10 	 	20 	 	35 	 	56 	 	84 	 	120 	165 	220
		// 	 		9 (1+) 	 	2 	 	10 	 	30 	 	70 	 	140 	252 	420 	660 	990
		//
		$a2p = Array(7 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>4,   9=>2)
					,8 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>10,  9=>10)
					,9 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>20,  9=>30)
					,10 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>35,  9=>70)
					,11 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>56,  9=>140)
					,12 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>84,  9=>252)
					,13 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>120, 9=>420)
					,14 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>165, 9=>660)
					,15 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>220, 9=>990) ); 


		// multi: 				7 		8 		9 		10 		11 		12 		13 		14 		15
		//
		// 	 	1+ 	9 (1+) 	 	5 	 	15 	 	35 	 	70 	 	126 	210 	330 	495 	715

		$a1p = Array(7 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>5)
					,8 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>15)
					,9 	=> Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>35)
					,10 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>70)
					,11 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>126)
					,12 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>210)
					,13 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>330)
					,14 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>495)
					,15 => Array(1=>0, 2=>0, 3=>0, 4=>0,  5=>0,  6=>0,  7=>0,  8=>0,  9=>715) ); 



		L_gains::$coefficients = Array('a1p'=>$a1p,'a2p'=>$a2p,'a3'=>$a3,'a3p'=>$a3p,'a4'=>$a4,'a4p'=>$a4p,'a5'=>$a5,'a5p'=>$a5p,'a6'=>$a6,'a6p'=>$a6p,);

		L_gains::$gains = Array(1=>3000000,
								2=>30000,
								3=>1100,
								4=>250,
								5=>25,
								6=>10,
								7=>6.25,
								8=>3.75,
								9=>1.25);
	}
}
L_gains::setup();

class L_grid {

	public $grid; 
	public $name;
	public $size;	// size of this grid
	public $price; 	// price of this grid
	public $coeffs; // coefficients for this grid
	public function __construct($name, $grid) { // grids is an array of integers [1,...,45]
		$this->grid = $grid;
		$this->name = $name;
		$this->size = count($grid);

		switch($this->size) {
			case 7: $p = 8.75; break;
			case 8: $p =  35; break;
			case 9: $p =  105; break;
			case 10: $p =  262.50; break;
			case 11: $p =  577.50; break;
			case 12: $p =  1155; break;
			case 13: $p =  2145; break;
			case 14: $p =  3753.75; break;
			case 15: $p =  6256.25; break;
		}

		$this->price = $p;

		// 7 numéros = 8,75 €
		// 8 numéros = 35 €
		// 9 numéros = 105 €
		// 10 numéros = 262,50 €
		// 11 numéros = 577,50 €
		// 12 numéros = 1.155 €
		// 13 numéros = 2.145 €
		// 14 numéros = 3.753,75 €
		// 15 numéros = 6.256,25 €

	}
	public function display($eid) { // played is an array of numbers ranging [1 ... 45]
		
		$rows = Array(); 
		$rows[0] = '<tr><td colspan=5><div style="line-height:2em; width:100%; text-align:center; color:red; font-weight:bold;">'.$this->name.'</div></td></tr>';
		$tr = '<tr style="">'; $c=1;
		for($r=1;$r<10;$r++)
			$rows[$r] = $this->cell($c++, $this->grid).$this->cell($c++, $this->grid).$this->cell($c++, $this->grid).$this->cell($c++, $this->grid).$this->cell($c++, $this->grid);
		$rows[$r] = '<tr><td colspan=5><div style="line-height:2em; width:100%; text-align:center; color:red; font-weight:bold;">'.$this->price.' eur</div></td></tr>';
		$rows = $tr.implode('</tr>'.$tr,$rows).'</tr>';

		$table = '<table id="'.$eid.'" style="border-collapse:collapse; border:2em solid transparent;">'.$rows.'</table>';
		return $table;
	}

	public function cell($nbr) { 
		$css = ''; if($this->grid) if(in_array($nbr, $this->grid)) $css = 'selected';
		$div = '<div class="pincell '.$css.'" style="line-height:1.5em; width:1.5em;">'.$nbr.'</div>';
		return '<td style="text-align:center; padding:0 .15em .15em 0;">'.$div.'</td>'; 
	}
}


class L_scenario {

	public $grids; 
	public $sname; 
	public function __construct($sname, $grids) { // grids is an array of L_grid instances 
		$this->grids = $grids;
		$this->sname = $sname;
	}

	public function display() {
		$boxes = '';
		$totprice = 0;
		foreach($this->grids as $x => $grid) {
			$boxes.= '<div style="">'.$grid->display('g_'.$x).'</div>';
			$totprice += $grid->price;
		}
		$title = '<div style="text-align:center; font-size:120%; color:steelblue; font-weight:bold; line-height:3em;">'.$this->sname.' ( '.$totprice.' eur )</div>';
		return $title.'<div style="display:flex; flex-wrap: wrap; justify-content: center;">'.$boxes.'</div>';
	}

	public function assess($games) { // games is an instance of L_games
		
		$html = '';
		$html .= h1('Analyzing results over '.$games->laps.' weeks for scenario '.$this->sname );
		$html .= $this->display();

		// global $out;

		$scores = Array(); // array indexed by grid number
			$sout = ''; // sub out section


		foreach($this->grids as $x => $playset) {
			
			$ranks = $this->rankarray();

			foreach($games->wsels as $wn => $set) {

				// analyzing one selection set (matches a given week $wn)
				$win = 0; $comp = 0;
				foreach($set as $pn => $pin) {
					if(in_array($pin, $playset->grid))
						{ if($pn == 6) $comp++; else $win++; }
				}
				if($win >= 1) { 

					// $out .= h2('Winner in week '.$wn);
					// $out .= notice('with game pick selection: '.$set[0].','.$set[1].','.$set[2].','.$set[3].','.$set[4].','.$set[5].',('.$set[6].')');
					if($win==6) $ranks['a6'][] = $wn; // rank 1
						else if($win==5 && $comp==1) 	$ranks['a5p'][] = $wn;  // rank 2
						else if($win==5) 				$ranks['a5'][] 	= $wn; 	// rank 3
						else if($win==4 && $comp==1) 	$ranks['a4p'][] = $wn; 	// rank 4
						else if($win==4)				$ranks['a4'][] 	= $wn; 	// rank 5
						else if($win==3 && $comp==1)	$ranks['a3p'][] = $wn; 	// rank 6
						else if($win==3)				$ranks['a3'][] 	= $wn; 	// rank 7
						else if($win==2 && $comp==1)	$ranks['a2p'][] = $wn; 	// rank 8
						else if($win==1 && $comp==1)	$ranks['a1p'][] = $wn; 	// rank 9
				}
			}
			$scores[$x] = $ranks; // an array like $scores[grid nbr][rank name][index] = weeknumber; 
			unset($ranks);
		}

		$html .= $this->ranktable($scores);
		$html .= $this->gains($scores);

		return $html;
	}
	public function rankarray() {
		$ranks = Array();
		$ranks['a6'] 	= Array(); // rank 1
		$ranks['a5p'] 	= Array(); // rank 2
		$ranks['a5'] 	= Array(); // rank 3
		$ranks['a4p'] 	= Array(); // rank 4
		$ranks['a4'] 	= Array(); // rank 5
		$ranks['a3p'] 	= Array(); // rank 6
		$ranks['a3'] 	= Array(); // rank 7
		$ranks['a2p'] 	= Array(); // rank 8
		$ranks['a1p'] 	= Array(); // rank 9
		return $ranks;
	}
	public function gains($scores) { // an array like $rankscores[grid nbr][rank name][index] = weeknumber; 
		
		$rows = Array(); $r = 0;
		$rows[$r++] = '<td colspan=10><div style="line-height:2em; width:100%; text-align:center; color:grey; font-weight:bold;">'.'GAINS'.'</div></td>';
		$ranks = $this->rankarray();
			$tds = '<td></td>'; foreach($ranks as $rankname => $a) $tds .= '<td class="scorecell" style="text-align:middle;">'.$rankname.'</td>';
		$rows[$r++] = $tds;

		$tr = '<tr style="">'; $c=1;
		$total = 0;

		foreach($scores as $x => $rankscores) {
				$grid = $this->grids[$x];
				$gname = $grid->name;
				$gsize = $grid->size;
			$tds = '<td class="scorecell" style="">'.$gname.'</td>';

			foreach($rankscores as $rankname => $weeks) {
				$wins = count($weeks); // how many wins in this rank 
				$g = new L_gains($rankname,$gsize);
				$euros = $g->gain();
				$euros = $wins*$euros;
				$tds .= '<td class="scorecell" style="text-align:center;">'.$euros.'</td>';
				$total+=$euros;
			}
			
			//$l = new L_score($rankname, $multi);
			//$rankgain = 
		
			$rows[$r++] = $tds;
		}

		$rows[$r++] = '<td colspan=5 style="line-height:2em; text-align:right; color:grey;">Total gains : </td><td colspan=5 style="line-height:2em; text-align:left; color:grey;">'.$total.'</td>';

		$rows = $tr.implode('</tr>'.$tr,$rows).'</tr>';
		$table = '<table id="'.'" style="border-collapse:collapse;">'.$rows.'</table>';
		$table = '<div style="text-align:center;"><div style="display:inline-block; margin:0 auto;">'.$table.'</div></div>';
		return $table;
	}
	public function ranktable($scores) { // an array like $rankscores[grid nbr][rank name][index] = weeknumber; 
		
		$rows = Array(); $r = 0;
		$rows[$r++] = '<td colspan=10><div style="line-height:2em; width:100%; text-align:center; color:grey; font-weight:bold;">'.'SCORES'.'</div></td>';
		$ranks = $this->rankarray();
			$tds = '<td></td>'; foreach($ranks as $rankname => $a) $tds .= '<td class="scorecell" style="text-align:middle;">'.$rankname.'</td>';
		$rows[$r++] = $tds;

		$tr = '<tr style="">'; $c=1;
		$winweekcount = 0;

		foreach($scores as $x => $rankscores) {
				$gname = $this->grids[$x]->name;
			$tds = '<td class="scorecell" style="">'.$gname.'</td>';

			foreach($rankscores as $rankname => $weeks) {
				$wins = count($weeks); // how many wins in this rank 
				$tds .= '<td class="scorecell" style="text-align:center;">'.$wins.'</td>';
				$winweekcount+=$wins;
			}
			
			//$l = new L_score($rankname, $multi);
			//$rankgain = 
		
			$rows[$r++] = $tds;
		}

		$rows[$r++] = '<td colspan=5 style="line-height:2em; text-align:right; color:grey;">Win weeks:</td><td colspan=5 style="line-height:2em; text-align:left; color:grey;">'.$winweekcount.'</td>';

		$rows = $tr.implode('</tr>'.$tr,$rows).'</tr>';
		$table = '<table id="'.'" style="border-collapse:collapse;">'.$rows.'</table>';
		$table = '<div style="text-align:center;"><div style="display:inline-block; margin:0 auto;">'.$table.'</div></div>';
		return $table;
	}

}


?>