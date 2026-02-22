<?php
	echo 'does clone recurse inheritance and does it call the __construct() anyway?'.'<br/>';
	
	// clone DOES NOT call the __construct() again, instead, it calls the __clone() function on the NEW instance
	
	class C_inner {
		private static $innercount = 1;
		private static $innercloned = 1;
		private $instance;
		public $keyed;
		public function __construct() { 
			$this->keyed = array('a','b','c');
			$this->instance = self::$innercount++;
			echo "Hello I am inner ".$this->instance.'<br/>';
		}
		public function __clone() { 
			echo "Hello I am inner cloned ".self::$innercloned++.'<br/>';
		}
		public function speak() {
			echo '<br/>I am inner '.$this->instance.'<br/>';
			print_r($this->keyed);
			echo '<br/>-------------';
		}
	}
	
	class C_outer extends C_inner {
		private static $outercount = 1;
		private static $outercloned = 1;
		private $instance;
		public function __construct() { 
			$this->instance = self::$outercount++;
			echo "Hello I am outer ".$this->instance.'<br/>';
			parent::__construct();
		}
		public function __clone() { 
			echo "Hello I am outer cloned ".self::$outercloned++.'<br/>';
			parent::__clone(); // __clone must be explecitely called in the inherited class
		}
		public function speak() {
			parent::speak();
		}
	}
	
	$o1 = new C_outer();
	echo '--------------'.'<br/>';
	$o2 = clone $o1;
	
	$o1->keyed[0] = 'pascal'; // pascal will not be written in the cloned object, the cloned object holds a new Array
	$o1->speak();
	$o2->speak();
?>