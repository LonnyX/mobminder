<?php
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/doublemetaphone.php';

ini_set('memory_limit', '2048M');

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOR the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   G E N D E R S    S T A T I S T I C S    G E N E R A T O R
//
//	This script fills DB::stat_genders
//


	$html = new C_html();
	$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
	$html->pushMeta('Content-Style-Type'	, 'text/css');
	$html->pushMeta('Content-Script-Type'	, 'text/javascript');
	$html->pushMeta('pragma'				, 'no-cache');
	$html->pushLink('basics.css'			, 'stylesheet'	, 'text/css');
		$title = 'mobminder gender statistics generator';
	$html->pageTitle($title);
	$html->pushHTML('<h1>'.$title.'</h1>');



///////////////////////////////////////////////////////////////////////////////////////
//
//	CLEANING UP DB FROM BADLY WRITTEN FIRSTNAMES
//

$html->pushHTML('<h3>Corrections in firstname syntaxes:</h3>');

function fnsubstitute($badsyntax, $goodsyntax) {
	$q = new Q('update visitors set firstname = "'.$goodsyntax.'" where firstname = "'.$badsyntax.'";');
	global $html; $html->pushHTML('&nbsp;&nbsp;&nbsp;&nbsp;fixing '.$badsyntax.' into '.$goodsyntax.' had '.$q->hits().' hits<br/>');
}

set_time_limit(301);
$cuein = microtime(true);
	// fnsubstitute('Francois', 	'François');
	// fnsubstitute('Francoi', 	'François');
	// fnsubstitute('Adele', 		'Adèle');
	// fnsubstitute('aurelie', 	'Aurélie');
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>Fixing badly syntaxed firstnames took place in: '.$cuedelta.' mseconds</h2>');

$html->pushHTML('<br/>');




///////////////////////////////////////////////////////////////////////////////////////
//
//	CLEANING UP DB FROM BADLY ENCODED GENDERS
//

$html->pushHTML('<h3>Corrections in genders:</h3>');

function gendersubstitute($firstname, $goodgender) {
	$q = new Q('update visitors set gender = '.$goodgender.' where firstname = "'.$firstname.'";');
	global $html; $html->pushHTML('&nbsp;&nbsp;&nbsp;&nbsp;fixing gender '.$goodgender.' for '.$firstname.' had '.$q->hits().' hits<br/>');
}


set_time_limit(902);
$cuein = microtime(true);
	// gendersubstitute('angela', 0);
	// gendersubstitute('adèle',0);
	// gendersubstitute('anna',0);
	// gendersubstitute('annie',0);
	// gendersubstitute('ariane',0);
	// gendersubstitute('arlette',0);
	// gendersubstitute('aurélie',0);
	
	// gendersubstitute('caroline',0);
	// gendersubstitute('christiane',0);
	// gendersubstitute('christine',0);
	
	
	// gendersubstitute('françois', 1);
	// gendersubstitute('antoine', 1);
	
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>Corrections of genders have been fixed in: '.$cuedelta.' mseconds</h2>');

$html->pushHTML('<br/>');

///////////////////////////////////////////////////////////////////////////////////////
//
//	CLASSES FOR STATISTICS
//

class Cgenders {
	public static $Xmales = 0;
	public static $Xfemales = 0;
	public static $significantCountMin = 10;
	public static $significantSkewMin = 0.35;
	public $males;
	public $females;
	public $metaphone1;
	public $metaphone2;
	public $signif;
	public function __construct($males, $females) { 
		$this->males = 0; $this->females = 0;
		$this->male1($males); $this->female1($females);
		$this->signif = false;
	}
	// private stuff
	private function significant() { // checks if there is a significant statistic trends that justifies a record in the firstnames table
		$mixedCount = $this->males+$this->females;
		$mixedSkew = $this->males-$this->females;
		$relativeSkew = $mixedSkew/$mixedCount;
		if($mixedCount < self::$significantCountMin) return false;
		if($relativeSkew > self::$significantSkewMin) return 1; // more males
		if($relativeSkew < -self::$significantSkewMin) return 0; // more females
		return false;
	}
	
	// public stuff
	public function male1($count) { $this->males+=$count; self::$Xmales+=$count; }
	public function female1($count) { $this->females+=$count; self::$Xfemales+=$count; }
	public function tr($fname) { // this->tr() must be called AFTER this->save()
	
		$signif = $this->signif;
		if($signif===false) return false;
		if($signif===1) $style = 'color:red;'; // more males
		if($signif===0) $style = 'color:green;'; // more females
	
		// $fname = '<td>'.utf8_encode($fname).'</td>';
		$fname = '<td>'.$fname.'</td>';
		$males = '<td>'.$this->males.'</td>';
		$females = '<td>'.$this->females.'</td>';
		$m1 = '<td>'.$this->metaphone1.'</td>';
		$m2 = '<td>'.$this->metaphone2.'</td>';
		return '<tr style="'.$style.'">'.$fname.$males.$females.$m1.$m2.'</tr>';
	}
	public static function th() {
		
		$fname = '<th style="padding:1em 2em .3em 0;">firstname</th>';
		$males = '<th style="padding:1em 2em .3em 0;">found males</th>';
		$females = '<th style="padding:1em 2em .3em 0;">found females</th>';
		$m1 = '<th style="padding:1em 2em .3em 0;">metaphone1</th>';
		$m2 = '<th style="padding:1em 2em .3em 0;">metaphone2</th>';
		return '<tr>'.$fname.$males.$females.$m1.$m2.'</tr>';
	}
	public function save($fname) { // see (*gs01*)
	
	
		$this->signif = $this->significant();
		if($this->signif===false) return false;
			$statpoint = new C_dS_stat_gender();
			// $statpoint->name = utf8_encode($fname);
			$statpoint->name = $fname;
			$statpoint->males = $this->males;
			$statpoint->females = $this->females;
			$statpoint->gender = $this->signif;
			
			$dm = new DoubleMetaphone($fname);
		$statpoint->metaphone1 = $dm->result['primary'];
		$statpoint->metaphone2 = $dm->result['secondary']; if($statpoint->metaphone2==$statpoint->metaphone1) $statpoint->metaphone2 = '';
		
		$this->metaphone1 = $statpoint->metaphone1;
		$this->metaphone2 = $statpoint->metaphone2;
		
		$statpoint->dSsave();
	}
}


	
$mixed = Array(); // an array of Cgenders indexed by fisrtname, like [ 'pascal' => Cgenders, 'olivier' => Cgenders, ... ]

///////////////////////////////////////////////////////////////////////////////////////
//
//	READING FROM VISITORS TABLE
//


$cuein = microtime(true);

$SQLfemales = 'SELECT REPLACE(firstname,"-","") AS fn, COUNT(*) as count FROM visitors WHERE gender = 0 GROUP BY fn;'; //  limit 1000, quicker testing
$SQLmales 	= 'SELECT REPLACE(firstname,"-","") AS fn, COUNT(*) as count FROM visitors WHERE gender = 1 GROUP BY fn;'; //  limit 1000, quicker testing


// note that using this SQL, we do not count diacritics as one sum, they will bring each a different counter. 
// So we need to merge those counters thereafter (*1*)

set_time_limit(303);

$fc = 0;
$females = C_dbIO::q($SQLfemales,'females counting');	
while($row = $females->fetch_array()) { // each different firstnames tagged as FEMALES in production
	
		$fname = reduceDiacriticsUTF8($row['fn']); 
		if(is_numeric(substr($fname,0,1))) continue;
	
	$fc++;
		$count = $row['count']; // (*1*)
		
	if(!isset($mixed[$fname])) $mixed[$fname] = new Cgenders(0,$count);
		else $mixed[$fname]->female1($count);
}
$females->close();



set_time_limit(304);

$mc = 0;
$males = C_dbIO::q($SQLmales,'males counting');	
while($row = $males->fetch_array()) { // each different firstnames tagged as MALES in production
	
	
		$fname = reduceDiacriticsUTF8($row['fn']); 
		if(is_numeric(substr($fname,0,1))) continue;
		
	$mc++;
		$count = $row['count']; // (*1*)
	
	if(!isset($mixed[$fname])) $mixed[$fname] = new Cgenders($count,0);
		else $mixed[$fname]->male1($count);
}
$males->close();

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The visitors have been scanned in DB in: '.$cuedelta.' mseconds</h2>');

set_time_limit(305);



///////////////////////////////////////////////////////////////////////////////////////
//
//	SORT AND DISPLAY
//

$cuein = microtime(true);

ksort($mixed);

$html->pushHTML('<br/>');
$html->pushHTML('<h3>DB findings</h3>');
$html->pushHTML('found males:'.Cgenders::$Xmales.'<br/>');
$html->pushHTML('found females:'.Cgenders::$Xfemales.'<br/>');
$html->pushHTML('males diff names:'.$mc.'<br/>');
$html->pushHTML('females diff names:'.$fc.'<br/>');
$html->pushHTML('-<br/>');



$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The genders sorted in: '.$cuedelta.' mseconds</h2>');


///////////////////////////////////////////////////////////////////////////////////////
//
//	CLEAN UP FORMER STATS
//

$cuein = microtime(true);

new Q('DELETE FROM stat_genders;');

$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The stat_genders table cleand up in: '.$cuedelta.' mseconds</h2>');


///////////////////////////////////////////////////////////////////////////////////////
//
//	PUSH NEW STATS IN DB
//

$cuein = microtime(true);

foreach($mixed as $fname => $genders) { 
		if($fname == 'a') continue;
		if($fname == 'aa') continue;
		if($fname == 'aaa') continue;
		if($fname == '') continue;
		if($fname == 'x') continue;
		if($fname == '-') continue;
		if($fname == '.') continue;
		if(is_numeric($fname)) continue;
	$genders->save($fname); 
}
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$html->pushHTML('<h2>The stat_genders table filled in with new stats in: '.$cuedelta.' mseconds</h2>');


$trs = Array();
foreach($mixed as $fname => $genders) { $significant = $genders->tr($fname); if($significant) $trs[] = $significant; }


$headers = Cgenders::th();
$html->pushHTML('<h2>The genders figures are as follows:</h2>');
$html->pushHTML('<table>'.$headers.implode($trs).'</table>');
$html->dropPage(); 


?>
