<?php
$systemLog = 'spoofy.php';

  function random_bytes($length = 6)
    {
        $characters = '0123456789';
        $characters_length = strlen($characters);
        $output = '';
        for ($i = 0; $i < $length; $i++)
            $output .= $characters[rand(0, $characters_length - 1)];

        return $output;
    }
	
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
			$o .= '<meta http-equiv="Content-Type=text/html; charset=UTF-8">';
			$o .= '<link href="./utilities.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}


//////////////////////////////////////////////////////
//
//  START
//

$out = h1('Spoofy operation');
$out = h2('PHP version:'.phpversion());


////////////////////////////////////////// 33179 - MNT - CONTRÔLE CHANTIER


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%MNT - CONTRÔLE CHANTIER ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('MNT - CONTRÔLE CHANTIER');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 33179;
		if($do) $dS_perf->dSsave();
	}




////////////////////////////////////////// 28206 - MNT - CONTRÔLE VC


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%MNT - CONTRÔLE VC ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('MNT - CONTRÔLE VC');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 28206;
		if($do) $dS_perf->dSsave();
	}






////////////////////////////////////////// 33168 - MNT - VCM (chiffrée)


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%MNT - VCM (chiffrée) ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('MNT - VCM');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 33168;
		if($do) $dS_perf->dSsave();
	}







////////////////////////////////////////// 35308 - US : Signature délais de paiement


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%US : Signature délais de paiement ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('Signature délais de paiement');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 35308;
		if($do) $dS_perf->dSsave();
	}










////////////////////////////////////////// 35306 - GR - Médiation


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%GR - Médiation ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('Médiation');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 35306;
		if($do) $dS_perf->dSsave();
	}









////////////////////////////////////////// 27689 - Délégation Syndicale


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and note like "%Délégation Syndicale ]%";';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('Délégation Syndicale');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 27689;
		if($do) $dS_perf->dSsave();
	}









////////////////////////////////////////// 27312 - Arrêt maladie & Congés Payés


	$ql = 'select reservations.id as id from reservations left join performances 
		on performances.groupId = reservations.id
	where reservations.groupId = 3783 and performances.id is null and (note like "%Arrêt maladie ]%" OR note like "%Congés Payés ]%");';


	$q = new Q($ql);

	$rids = $q->ids(list_as_array);
	$out .= h1('Arrêt maladie & Congés Payés');
	$out .= notice('result: '.$q->cnt().' items found.');


	foreach($rids as $rid)  {
			$dS_r = new C_dS_reservation($rid);
			$out.= notice($dS_r->id.': '.$dS_r->cueIn.' = '.$dS_r->note);
		
		$dS_perf = new C_dS_performance(false, $rid);
		$dS_perf->visitorId = 0;
		$dS_perf->workCodeId = 27312;
		if($do) $dS_perf->dSsave();
	}









$c = 0;
if(!$do) $out .= warning('NOT IN DO MODE');

if($do)
	new Q(';');


//////////////////////////////////////////////////////////////////////////////// 
//
// STOP
//

echo html($out);


?>