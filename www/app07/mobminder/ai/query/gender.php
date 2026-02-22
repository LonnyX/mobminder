<?php
//////////////////////////////////////////////////////////////////////
//
//   Moby  A I   A P I
//
//  T E S T   A   F I R S T N A M E    T O    G U E S S    
//
//      A   M A T C H    O N    T H E    G E N D E R   
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);

$perfReport->peak('::time needed to retrieve context and posted parameters');




//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//


if(!isset($_REQUEST['fn'])) abort('0210','you are expected to specify a firstname');
$fn = $_REQUEST['fn'];
$fn = strtolower($fn);
$many = strpos($fn, ' '); // that is a firstname containing law names like Marie Antoine Henriette
$guesson = $fn;
if($many) $guesson = substr($fn,0,$many); // then check on the first bunch
$reduced = str_replace('-','',$guesson);

// this conversion set is different from the one used in fitToGSMascii7() !!
$a = array('’',  '|', 'À', 'Á', 'Â', 'Ã', 'È', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ò', 'Ó', 'Ô', 'Õ', 'Ù', 'Ú', 'Û', 'Ý', 'á', 'â', 'ã', 'ç', 'é', 'è', 'ê', 'ë', 'í', 'î', 'ï', 'ô', 'ó', 'ô', 'õ', 'ú', 'û', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ',  'ĳ',  'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ',  'œ',  'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ',  'ǽ',  'Ǿ', 'ǿ', 'Ά', 'ά', 'Έ', 'έ', 'Ό', 'ό', 'Ώ', 'ώ', 'Ί', 'ί', 'ϊ', 'ΐ', 'Ύ', 'ύ', 'ϋ', 'ΰ', 'Ή', 'ή');
$b = array('\'', 'I', 'A', 'A', 'A', 'A', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'Y', 'a', 'a', 'a', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'o', 'o', 'o', 'o', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o', 'Α', 'a', 'Ε', 'e', 'Ο', 'ο', 'o', 'o', 'I', 'i', 'i', 'i', 'Υ', 'u', 'u', 'u', 'Η', 'n');
$reduced = str_replace($a, $b, $reduced);





//////////////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R Y


$q = new Q('SELECT gender FROM stat_genders WHERE name="'.$reduced.'";');
$gender = $q->one('gender','x');




//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E


pad(); h2('Query result');
		indent('Guessing on |'.$reduced.'|',3);
pad(0);
if($web) echo '<div style="color:blue;">';
echo '<)'.$gender.'(>';
if($web) echo '</div>';


$perfReport->peak('::echo completed');


pad(); 




//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

pad();
	technicalspecH1();
	
	h2('Input parameters');
	
		exlainloginputs(); 
		
		h3('mandatory posts');
		indent('o fn: first name. A best guess gender will be returned based on the provided firstname.',6);


	h2('Returned data');
		indent('<)1(> guess it\'s a male',3);
		indent('<)0(> guess it\'s a female',3);
	
	

if($web) $perfReport->peak('::Tutorial displayed');
if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	pad();
}

pad();
endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>
