<?php
$systemLog = 'GSKspoofy.php';
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  SPLIT AN ACCOUNT (Thanks to Alex Vanhoutte)
//
//  This script moves some resources from one group to another existing group; this means:
//	All reservations must follow
//	All visitors must be copied
//	Some workcodes should move to the new group
// 	Some time boxing should move
//	Some hourlies should move
//
//  Usage: 127.0.0.1/utilities/split.php  <= All parameters and behaviour should be set by reviewing this script
//
//  !! IMPORT VISITORS FIRST !!

//////////////////////////////////////////////////////
//
//  catch this script name 
//

$do = @$_GET['do']; if(isset($do)) { if($do==1) $do = true; } else $do = false;

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); 
$html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

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

$out = h1('Hello World');



class student {
	
	private $name;
	private $age;
	private $option;
	private $credits;
	
	private static $countStudents = 0;
	
	public function __construct($name, $age, $option) {
		
		$this->name = $name;
		$this->age = $age;
		$this->option = $option;
		$this->credits = 0;
		
		self::$countStudents++;
	}
	
	public function introduceyourself() {
		
		echo 'my name is '.$this->name.' and I am '.$this->age.' years old<br/>';
		
	}
	
	private function makeajoke() {
		echo $this->name.' makes a joke'.'<br/>';
	}
	
	public function howmanyareyouguys() {
		echo 'We are in total: '.self::$countStudents.' student(s)<br/>';
	}
	
	
	public function getName() {
		return $this->name;
	}
	
	
	public static function TOTALCOUNT() {
		echo 'They are in total: '.self::$countStudents.' student(s)<br/>';
	}
}

$e1 = new student('meddeke', 21,'chimie');
$e1->introduceyourself();
$e1->howmanyareyouguys();

$e2 = new student('chloé', 18,'elec');
$e3 = new student('nathan', 18,'méca');



echo '<br/>';

$e2->introduceyourself();
$e2->howmanyareyouguys();

echo '<br/>';

$e3->introduceyourself();
$e3->howmanyareyouguys();


echo '<br/>';
echo 'j\'aimerais lire dans e1 son nom: '.$e1->getName().'<br/>';

$e1->introduceyourself();

echo '<br/>';
echo '<br/>';
student::TOTALCOUNT();



//////////////////////////////////////////////////////////////////////////////// 
//
//
//

echo html($out);


?>