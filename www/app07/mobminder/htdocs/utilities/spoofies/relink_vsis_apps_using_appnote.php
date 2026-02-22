<?php

$systemLog = 'spoofy.php';
require '../utililib.php';


//////////////////////////////////////////////////////////////////////////////// 
//
// Use this utility to match an appointment note to a visitor id.
//
// This first version is very simple:
// - The appointment notes we received ( .ics file ) had a DMI file number between parenthesis : like (3426)
// - The patients register we got had a DMI file number that I moved to the visitor.registration field, like d03426
// => this spoofy isolates from the appointment note the number between parenthesis like 547 and pad it to 00547 and adds the 'd'.
//    then match with a visitor. 
//
// More development is needed if we want to cleverly match lastnames and firstnames
//

$out = h1('Spoofy operation - MS Outlook Giant ics files clean up');

if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false;
if(isset($_GET['do'])) $do = $_GET['do']; else $do = false; if($do) $do = !!$do;


if(!$accountId) error('You need to give an account id');

$o_dS_group = new C_dS_group($accountId);
if($o_dS_group->name == '') error('The account does not exists');

$out .= h2('<h2>Account identified: '.$o_dS_group->name.'</h2>');


	$m = 1024*3.6; // 3 Gig RAM
ini_set('memory_limit', $m.'M');



//////////////////////////////////////////////////////////////////////////////// 
//
//  LOADING VISITORS
//
$cuein = microtime(true); $visiTotal = 0;

$byReference = Array(); // an array that references the visitors using their original id from (id in the migrated DB)

	$SQL = 'SELECT id, registration FROM visitors WHERE visitors.groupId = '.$accountId.';';

	$result = C_dbIO::q($SQL); if(!$result) error('SQL failed:'.$SQL.' ');
	while ($row = $result->fetch_array()) {
		$r = $row['registration'];
		// if(strpos($r, '#') !== false) { $r = explode('#',$r); $r = $r[0]; };
		if($r) {
			$byReference[$r] = $id = $row['id'];
			if($visiTotal<100) $out .= notice($r.' for visi '.$id);
			$visiTotal++;
		}
	}
	$result->close();
		
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$visiTotal.' visitors have been loaded in: '.$cuedelta.' mseconds</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  Visualize a part of the result
//

$cuein = microtime(true); $appsTotal = 0; $links = 0;

	$SQL = 'SELECT id, note FROM reservations WHERE groupId = '.$accountId.';';
	$q = new q($SQL);
	
	while($row = $q->result->fetch_array()) {
		$note = $row['note'];
		preg_match('#\((.*?)\)#', $note, $match);
		$resaid = $row['id'];
		if(isset($match[1])) {
			$m = $match[1];
			if(is_numeric($m)) {
				$m = str_pad($m, 5, '0', STR_PAD_LEFT);
				if(isset($byReference['d'.$m])) {
					$vid = $byReference['d'.$m];
					if($links<100) $out .= notice($m.' seems to stick to visi id '.$vid);
					
					$dS_att_visitor = new C_dS_att_visitor(false, $resaid);
					$dS_att_visitor->resourceId = $vid;
					$dS_att_visitor->resourceType = class_visitor;
					
					
					if($do)
						$dS_att_visitor->dSsave();
						
					$links++;
				}
			}
		}
		$appsTotal++;
	}
	
	
$cueout = microtime(true);
$cuedelta = (($cueout-$cuein)*1000)|0;
$out .= h2('<h2>'.$appsTotal.' have been scanned in: '.$cuedelta.' mseconds, '.$links.' links could be established</h2>');




//////////////////////////////////////////////////////////////////////////////// 
//
//  Save
//


if($do) {
	$out .= warning('DO mode ON, don\'t re-execute!!');
} else
	$out .= warning('Not in DO mode, the file was not written');


$out .= h2('Successful');
echo html($out);

?>