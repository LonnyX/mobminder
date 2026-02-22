<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    B A C K U P    R E S E R V A T I O N S
//

require '../../../lib_mobphp/dbio.php';
require '../lib.php';

ini_set('memory_limit', '512M');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);
$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;
$keyview = new C_keyview($skeyId);


$web 		= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;

$archiveInc = @$_POST['archive']; if(isset($archiveInc)) $archiveInc = !!$archiveInc; else $archiveInc = false;
$unixtime 	= @$_POST['unixtime']; if(isset($unixtime)) $unixtime = !!$unixtime; else $unixtime = false;
$remotePOV 	= @$_POST['remotepov']; if(isset($remotePOV)) $remotePOV = !!$remotePOV; else $remotePOV = false;


msg('Archived items included: '.($archiveInc?$archiveInc:'Nope'));
msg('Web render: '.($web?$web:'Nope'));

$sctxt = new C_syncContext($dS_login, $dS_accesskey);

$perfReport->peak('::time needed to retrieve context and posted parameters');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   F E T C H     A P P O I N T M E N T S     F O U N D     A T     S E R V E R    S I D E


	$resas = $sctxt->rem_resa(false, $archiveInc, $remotePOV);
	
	if($resas->count()) foreach($resas->keyed as $rid => $dS_resa) {
		
		if(!$unixtime) {
			$dS_resa->cueIn = Date('Y-m-d H:i',$dS_resa->cueIn);
			$dS_resa->cueOut = Date('Y-m-d H:i',$dS_resa->cueOut);
		}
	}

	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   F E T C H     V I S I T O R S      F O U N D     A T     S E R V E R    S I D E

	$visis = $sctxt->rem_vis();
	
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    B A C K U P    T O    C L I E N T    S I D E

if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = $accountId.'_backup_reservations';

	$idfields = Array('id'); if($remotePOV) $idfields[] = 'remoteId';
	$vfields = Array('birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email','note','rcolor');
	$fields = array_merge($idfields, $vfields);
	echo $visis->csvstream($filename, $fields, true /* include classname */, !$web /* headers */);
	
	$afields = Array('resources','cueIn','cueOut','visitors','rcolor','note','created','deleted');
	$fields = array_merge($idfields, $afields);
	echo $resas->csvstream($filename, $fields, true /* include classname */, !$web /* headers */);
	
if($web) echo '</file>';
	

msg('##0## process successful, goodbye.##');


$perfReport->peak('::protocol streamed');
if($web) $perfReport->dropReport();

?>