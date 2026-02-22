<?php
//////////////////////////////////////////////////////////////////////
//
//    Q U E R Y    V I S I T O R S   o n   D I G I T S
//

ob_start(); // relates to (*ob1)
require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

// retrieve and filter input digits 
// sleep(1);

///  !!! THIS PAGE IS ENCODED IN UTF8 => preg_replace would otherwise not replace special chars like éèë...

$cueIn 	= @$_POST['cueIn']; 	if($cueIn===null) $cueIn = false;
$cueOut = @$_POST['cueOut'];	if($cueOut===null) $cueOut = false;
echo 'cueIn: '.$cueIn.$nl;
echo 'cueOut: '.$cueOut.$nl;


$digits = strtolower($_POST['digits']);
echo 'input digits: '.$digits.$nl;


$visitors = new C_dbAccess_visitors();

$perfReport->peak('visitors AC:: session & parameters retrieved.');


////////// birthday stuff
//
$ddmmyyy = preg_match('/^((0[1-9]|[12][0-9]|3[01]|[1-9]))([- \/.])(0[1-9]|1[012]|[1-9])([- \/.])?((19|20)\d\d)?/',$digits);
$yyymmdd = preg_match('/^(19|20)\d\d([- \/.])(0[1-9]|1[012]|[1-9])([- \/.])?(0[1-9]|[12][0-9]|3[01]|[1-9])?/',$digits);

$bd = false; if($yyymmdd||$ddmmyyy) $bd = preg_replace('/[- \/.]/i','-',$digits);
if($bd) {
	echo 'normalized birthdate = '.$bd.$nl;
		$l = strlen($bd);					echo chr(9).chr(9).'l = '.$l.$nl;
	$s1 = strpos($bd,'-'); 					echo chr(9).chr(9).'separator 1 = '.$s1.$nl;
		$r = substr($bd,-($l-$s1-1)); 		echo chr(9).chr(9).'right part = '.$r.$nl;
	$s2 = strpos($r,'-');					echo chr(9).chr(9).'separator 2 = '.$s2.$nl;
	
	$p1 = substr($bd,0,$s1);				echo chr(9).'part 1 = '.$p1.$nl;
	if($s2) $p2 = substr($r,0,$s2);	else $p2 = $r;
											echo chr(9).'part 2 = '.$p2.$nl;
		$lr = strlen($r);					echo chr(9).chr(9).'right part length = '.$lr.$nl;
	$p3 = ''; if($s2) if($lr-$s2-1) $p3 = substr($r,-($lr-$s2-1)); 
											echo chr(9).'part 3 = '.$p3.$nl;
											echo $nl;
}
function sortabledate($yyyy, $mm, $dd) {
	$ly = strlen($yyyy); switch($ly) { case 0: $yyyy = '____'; break; case 1: $yyyy .= '___'; break; case 2: $yyyy .= '__'; break; case 3: $yyyy .= '_'; break; }
	$lm = strlen($mm); switch($lm) { case 0: $mm = '__'; break; case 1: $mm = '0'.$mm; break; } 
	$ld = strlen($dd); switch($ld) { case 0: $dd = '__'; break; case 1: $dd = '0'.$dd; break; } 
	return $yyyy.$mm.$dd;
}
$birthdate = false;
if($ddmmyyy) $birthdate = sortabledate($p3,$p2,$p1);
if($yyymmdd) $birthdate = sortabledate($p1,$p2,$p3);

if($birthdate) {
	echo 'birthdate : '.($birthdate?$birthdate:'nope').$nl;
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND birthday LIKE "'.$birthdate.'" AND deletorId = 0 LIMIT 300;';
	$visitors->loadMany($SQL);
}
$perfReport->peak('visitors AC::searching on birthday complete.');


////////// matching a phone number
//
$phonenumber = is_numeric($digits);
if($phonenumber) {
	// this version based also on fix line phone search does not produce any display at client side, because the phone number is not visible on the dropdown menu
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND (mobile LIKE "%'.$digits.'%" or phone LIKE "%'.$digits.'%") AND deletorId = 0 LIMIT 300;';
	// $SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND mobile LIKE "%'.$digits.'%" AND deletorId = 0 LIMIT 300;';
	$visitors->loadMany($SQL);
}
$perfReport->peak('visitors AC::searching on phone number complete.');
echo 'phone numb: '.($phonenumber?'YES':'nope').$nl;


// spaces are removed so you can search on "de co" to find "de coninck"
// $digits = preg_replace("/[^a-z0-9éèëêôîïûü.]/si",'',$digits); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""
$digits = preg_replace("/[^a-z0-9àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÐŒœŠšŸŽž.]/si",'',$digits); // allowed characters for the search

echo 'filtered digits: '.$digits.$nl;


////////// exact lastname
//
$exactname = false;
if(substr($digits,-1)=='.') { // then we need to return persons having this exact name
	$exactname = true;
	$digits = rtrim($digits,'.');
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND REPLACE(REPLACE(REPLACE(lastname," ",""),"-",""),"\'","") = "'.$digits.'" AND deletorId = 0 LIMIT 300;'; // note the exact match
	$visitors->loadMany($SQL);
}
$perfReport->peak('visitors AC::searching on exact lastname.');
echo 'exact name: '.($exactname?'YES':'nope').$nl;



////////// matching registration field
//
if(!$birthdate && !$exactname) {
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND registration LIKE "%'.$digits.'%" AND deletorId = 0 LIMIT 300;';
	$visitors->loadMany($SQL);
}
$perfReport->peak('visitors AC::searching on registration complete.');




////////// matching lastname or company name
//
if(!$birthdate && !$exactname) {
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND ( REPLACE(REPLACE(REPLACE(lastname," ",""),"-",""),"\'","") LIKE "%'.$digits.'%") AND deletorId = 0 LIMIT 300;'; 
	$visitors->loadMany($SQL);
	
	$SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' AND ( REPLACE(REPLACE(REPLACE(company," ",""),"-",""),"\'","") LIKE "%'.$digits.'%") AND deletorId = 0 LIMIT 300;'; 
	$visitors->loadMany($SQL);

	// this is a forecast of a version of this lookup that uses PHP processing instead of the REPLACE(REPLACE(...)) version here above.
	// $d1 = mb_substr($digits, 0, 1);
	// $visi1 = new C_dbAccess_visitors();
	// $SQL = 'SELECT * FROM visitors WHERE groupId='.$accountId.' lastname LIKE "%'.$d1.'%") AND deletorId = 0 LIMIT 2000;';
	// $visitors->loadMany($SQL);
	// $visitors->match('lastname', $digits); // see (*vs01*)
	
	
	// echo $nl.$SQL.$nl;
}
$perfReport->peak('visitors AC::searching on lastname or company name complete.');




////////// Querying visitors ends here
//

$vqcount = $visitors->count();
echo 'number of visitors found: '.$vqcount.$nl;


////////// sending sync information in case of sync login presence
//
	
	$q = new Q('SELECT logins.id FROM logins JOIN accesskeys on accesskeys.groupId = logins.id WHERE accessLevel = '.aLevel_synchro.' AND accountId = '.$accountId.';');
	$hasSync = $q->ids();
	$synchro_visitors = new C_dbAccess_synchro_visitors(); 
	
	if($vqcount) if($hasSync) { 
		$vids = $visitors->getIdsList();
		$synchro_visitors->loadOnLocalId($vids);
	}
		
$perfReport->peak('visitors AC::fetched sync info.');


////////// checking overbooking of visitors (*v01*)
//
if($vqcount)
	if($cueIn) if($cueOut) {
		$q = new Q('SELECT id FROM reservations WHERE groupId='.$accountId.' AND deletorId=0 AND cueOut>'.$cueIn.' AND cueIn<'.$cueOut.';', 'checking visitors overbooking');
		$tfoids = $q->ids(); // time frame overload ids
		
		
		if($tfoids) {
			$vids = $visitors->getIdsList();
			$q = new Q('SELECT DISTINCT resourceId as id FROM att_visitors WHERE groupId IN ('.$tfoids.') AND resourceId IN ('.$vids.');', 'checking visitors overbooking');
			$voids = $q->ids(); // ids of visitors from the auto-complete list who are already attendees on this time frame
			echo 'overbooked visitors: '.$voids.$nl;
			
				$voids = $q->ids(list_as_array);
			foreach($voids as $vid) $visitors->keyed[$vid]->selection = 1; // we use the 'selection' field to inform the client side about this visitor being staffed already
			
		} else {
			echo 'no overbooked visitor in this time frame'.$nl;
		}

	}
$perfReport->peak('visitors AC::overload on given timespan checked.');




////////// feedback results
//

$perfReport->peak('visitors AC::step 2 complete - data loaded.');

echo $nl;
	echo '<code>';
	echo $visitors->stream(no_alias, no_bank, with_tracking);
	if($hasSync) echo $synchro_visitors->stream();
	echo '</code>';
	
$perfReport->peak('visitors AC::step 3 complete - streamed.');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_visitors');

?>
