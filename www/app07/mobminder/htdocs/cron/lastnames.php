<?php
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/doublemetaphone.php';

ini_set('memory_limit', '1024M');

	$html = new C_html();
	$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
	$html->pushMeta('Content-Style-Type'	, 'text/css');
	$html->pushMeta('Content-Script-Type'	, 'text/javascript');
	$html->pushMeta('pragma'				, 'no-cache');
	$html->pushLink('basics.css'			, 'stylesheet'	, 'text/css');
		$title = 'mobminder lastname statistics generator'; // see (*ls01*)
	$html->pageTitle($title);
	$html->pushHTML('<h1>'.$title.'</h1>');



$cuein = microtime(true);


set_time_limit(699);




// note that using this SQL, we do not count diacritics as one sum, they will bring each a different counter. 
// So we need to merge those counters thereafter (*1*)

class C_lastname {
	public $c;
	public $n;
	public static $instances = Array();
	public function __construct($name, $count) {
		$this->c = $count;
		$this->n = $name; // native name
		$this->r = reduceDiacriticsUTF8($name, $firstwordonly = false, $keepspaces = false); // reduced
		C_lastname::$instances[$name] = $this;
		
		
			$dm = new DoubleMetaphone($name);
		$this->m1 = $dm->result['primary'];
		$this->m2 = $dm->result['secondary']; if($this->m2==$this->m1) $this->m2 = '';
	}
	public static function collect($name,$count) { // accumulates counter or creates a new instance if $lname was not yet encountered
		
		$lname = reduceDiacriticsUTF8($name, $firstwordonly = false, $keepspaces = true);
		
		if(is_numeric(substr($lname,0,1))) return false;
		if(strlen($lname)<5)  return false;
		
		if(!isset(C_lastname::$instances[$lname])) new C_lastname($lname,$count);
			else C_lastname::$instances[$lname]->more($count);
		
		return true;
	}
	public static function count() {
		return count(C_lastname::$instances);
	}
	public static function sortandsave() {
		
		ksort(C_lastname::$instances);
		
		$remove = Array();
		foreach(C_lastname::$instances as $lname => $object) { 
				if($object->c < 2) { $remove[] = $lname; continue; } // we do not take unique instanaces
			$object->save($lname); 
}
		foreach($remove as $n) unset(C_lastname::$instances[$n]);
	}
	public function more($howmany) {
		$this->c += $howmany;
	}
	public function tr() {
		return '<tr>'.'<td>'.$this->n.'</td>'.'<td>'.$this->c.'</td>'.'<td>'.$this->r.'</td>'.'<td>'.$this->m1.'</td>'.'<td>'.$this->m2.'</td>'.'</tr>';
	}
	public static function th() {
		return '<tr>'.'<th style="padding:1em 2em .3em 0;">native names</th>'.'<th style="padding:1em 2em .3em 0;">occurances</th>'.'<th style="padding:1em 2em .3em 0;">reduced name</th>'.'<th style="padding:1em 2em .3em 0;">metaphone1</th>'.'<th style="padding:1em 2em .3em 0;">metaphone2</th>'.'</tr>';
	}
	public function save() {
		// id (auto), name, reduced, occurances
		new Q('INSERT INTO stat_lastnames VALUES("", "'.$this->n.'", "'.$this->r.'",'.$this->c.',"'.$this->m1.'","'.$this->m2.'"); -- stat_lastnames'); 
	}
	public static function display() { // returns an HTML table
	
		$th = C_lastname::th();
		$trs = Array();
		foreach(C_lastname::$instances as $lname => $object) { $trs[] = $object->tr(); }
		return '<table style="margin:0 auto 0 0;">'.$th.implode($trs).'</table>';
	}
}



///////////////////////////////////////////////////////////////////////////////////////
//
//	READING FROM VISITORS TABLE
//


$q = new Q('SELECT lastname AS ln, COUNT(*) as count FROM visitors WHERE gender = 1 GROUP BY ln;'); //  limit 100000, quicker testing
$nc = 0;
$counters = $q->mlist('count', false);
$names = $q->mlist('ln', false);
foreach($names as $x => $name) { // each different lastnames before diatrics reduction
	$nc++;
		$count = $counters[$x]; // (*1*)
	C_lastname::collect($name, $count); // accumulates counter or creates a new instance if $lname was not yet encountered
}
unset($names); // prevents memory overflow
unset($counters); // prevents memory overflow

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The visitors have been scanned in DB in: '.$cuedelta.' mseconds</h2>');





///////////////////////////////////////////////////////////////////////////////////////
//
//	CLEAN UP FORMER STATS
//

set_time_limit(602);

$cuein = microtime(true);

	new Q('DELETE FROM stat_lastnames;');

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The stat_lastnames table cleand up in: '.$cuedelta.' mseconds</h2>');





///////////////////////////////////////////////////////////////////////////////////////
//
//	SORT AND SAVE
//

$cuein = microtime(true);


$html->pushHTML('<br/>');
$html->pushHTML('<h3>number of different entries (before diatrics reduction)'.$nc.'</h3>');
$html->pushHTML('<br/>');

	C_lastname::sortandsave();

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>Lastnames sorted and saved to stat_lastnames in: '.$cuedelta.' mseconds</h2>');





///////////////////////////////////////////////////////////////////////////////////////
//
//	DISPLAY
//

$cuein = microtime(true);

	$display = C_lastname::display();


$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>Lastnames displayed in: '.$cuedelta.' mseconds</h2>');




///////////////////////////////////////////////////////////////////////////////////////
//
//	PUSH NEW STATS IN DB
//

$cuein = microtime(true);



$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The stat_lastnames table filled in with new stats in: '.$cuedelta.' mseconds</h2>');





///////////////////////////////////////////////////////////////////////////////////////
//
//	DISPLAY RESULTS
//



$html->pushHTML('<h2>The counting of significant lastnames is as follows:</h2>');
$html->pushHTML('<h3>'.C_lastname::count().' final different names</h3>');
$html->pushHTML($display);
$html->dropPage(); 


?>
