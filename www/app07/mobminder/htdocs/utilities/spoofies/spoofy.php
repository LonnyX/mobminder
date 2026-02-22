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
$out = h1('Spoofy operation');


//////////////////////////////////////////////////////
//
//  Written to convert birthdates in registration field into birthdates in birthday field (for So Nice)
//


$q = new Q('SELECT id FROM reservations WHERE groupId = 3430;');
$rids = $q->ids(false); 
$hits = $q->hits();
$out .= h2($hits.' found reservations');
$countTreated = 0;
$countSkipped = 0;
die('Never run this again');

foreach($rids as $rid) {
	
	$dS_r = new C_dS_reservation($rid);
	$note = $dS_r->note; $l = strlen($note);
	$dS_v = false; 
	
	// retrieve visitor based on info found in the resa note (that was done for importing Solbosh from SmartAgenda
			$filter_phone 	= utf8_encode('/[^0-9]/');
		$name = substr($note, 0, 5);
		$phone = substr(preg_replace($filter_phone,'',$note),-8);
	$hits = 0;
	if($l >= 25) if($phone) if($name) {
		$q = new Q('select id from visitors where groupId = 3430 and lastname like "'.$name.'%" and (mobile like "%'.$phone.'" OR phone like "%'.$phone.'") ;');
		$ids = $q->ids(); $hits = $q->hits();
		$out .= notice('resaId:'.$rid.', name: '.$name.', phone:'.$phone.' id'.$ids);
	}
	if($hits==1) {
		$dS_v = new C_dS_visitor($ids); 
	}
	else { // not found with phone match
	
		$ddn = ''; $p = 0;
		if($l > 15) {
			$split = explode(' ', $note);
			if(isset($split[2])) $ddn3 = preg_replace($filter_phone,'',$split[2]); else $ddn3 = ''; // birth in 3d position
			if(isset($split[3])) $ddn4 = preg_replace($filter_phone,'',$split[3]); else $ddn4 = ''; // birth in 3d position
			if(isset($split[4])) $ddn5 = preg_replace($filter_phone,'',$split[4]); else $ddn5 = ''; // birth in 3d position
			
			if($ddn3) { $ddn=$ddn3; $p=2; } else if($ddn4) { $ddn=$ddn4; $p=3; }  else if($ddn5) { $ddn=$ddn5; $p=4; } 
			
			$ddn = $split[$p]; if(strpos($ddn,'/')===false) { $ddn = ''; $p=0; } // I hit a phone number, birthdays are always like "27/1/1972"
			if($p) { // split the birthdate and make it mobminder format
				$sbd = explode('/', $ddn); if(!isset($sbd[2])) { $p=0; $ddn=''; break; }
				$aaaa = $sbd[2]; $mm = $sbd[1]; $dd = $sbd[0];
				if(strlen($mm)==1) $mm = '0'.$mm;
				if(strlen($dd)==1) $dd = '0'.$dd;
				$ddn = $aaaa.'-'.$mm.'-'.$dd;
				if(strlen($aaaa)==2) 
					{ if($aaaa<16) $aaaa = '20'.$aaaa; else $aaaa = '19'.$aaaa; };
				
				$where = $aaaa.$mm.$dd;
				if(strlen($where)==8) {
					$q = new Q('select id from visitors where groupId = 3430 and lastname like "'.$name.'%" and birthday = '.$where.';');
					$ids = $q->ids(); $hits = $q->hits();
					$out .= notice('second guess: resaId:'.$rid.', name: '.$name.', phone:'.$phone.' id'.$ids);
				}
				if($hits==1) {
					$dS_v = new C_dS_visitor($ids); 
				} else {
					$countSkipped++;
					$out .= warning('countSkipped: '.$countSkipped.' guessed on DDN:'.$ddn.' note: '.$note);
				}
			}
		} else {
			$countSkipped++;
			$out .= warning('countSkipped: '.$countSkipped.' Short note: '.$note);
		}
	}
	if($dS_v) {
			$o_dS_att_visitor = new C_dS_att_visitor(false, $rid);
			$o_dS_att_visitor->resourceId = $dS_v->id;
			$o_dS_att_visitor->resourceType = class_visitor;
			$o_dS_att_visitor->dSsave();
		$countTreated++;
	}
}
$out .= warning('Skipped:'.$countSkipped);
$out .= warning('Treated:'.$countTreated);


//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out .= h2('Successful');
echo html($out);

?>