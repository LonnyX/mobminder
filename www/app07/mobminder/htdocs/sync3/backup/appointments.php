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
C_date::setTimeParameters($dS_account);


$web 		= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;

$archiveInc = @$_POST['archive']; if(isset($archiveInc)) $archiveInc = !!$archiveInc; else $archiveInc = false;
$unixtime 	= @$_POST['unixtime']; if(isset($unixtime)) $unixtime = !!$unixtime; else $unixtime = false;
$remotePOV 	= @$_POST['remotepov']; if(isset($remotePOV)) $remotePOV = !!$remotePOV; else $remotePOV = false;
// $specdates 	= @$_POST['specdates']; if(isset($specdates)) $specdates = !!$specdates; else $specdates = false;

msg('Web render: '.($web?$web:'Nope'));
msg('Archived items included: '.($archiveInc?$archiveInc:'Nope'));
msg('Unix time stamp: '.($unixtime?$unixtime:'Nope'));
msg('Remote point of view: '.($remotePOV?$remotePOV:'Nope'));
// msg('Specific dates: '.($specdates?$specdates:'Nope'));

	//  including a daily planning display for remote side (integration)
$stamp 		= @$_POST['specdates']; if(!isset($stamp)) $stamp = false; // a midnight stamp
$days 		= @$_POST['nodays']; if(!is_numeric($days)) $days = 1; if($days<=0) $days =1;

msg('Specific dates: '.($stamp?'Yes: '.$days.' days':'Nope'));

$stampSearchIn = false;
if($stamp) {
	if(!is_numeric($stamp)) { // then we expect a date like '2014-11-22', introduced with gmtshift (**GMT)
		$date = new C_date($stamp);
		$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $stamp); // in this case, gmtshift applies
		$stamp = $date->getTstmp(); // turns back stamp into a unix timestamp
		
		msg('ISO8601 time stamp: '.$date->getDateTimeString());
	} else {
		// $stamp is a universal integer unix timecode, referenced to GMT 0
		
		$date = new C_date($stamp);
		$gmtshift = 0;
		
		msg('unix time stamp:'.$stamp.' = '.$date->getDateTimeString());
	}
	msg('gmtshift:'.($gmtshift/3600).' hours');
	$stampSearchIn = $stamp;
	$stampSearchOut  = $stamp+86400*$days;
	msg('number of days:'.$days.'');
}


$sctxt = new C_syncContext($dS_login, $dS_accesskey);

$perfReport->peak('::time needed to retrieve context and posted parameters');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   F E T C H     A P P O I N T M E N T S     F O U N D     A T     S E R V E R    S I D E

	$resas = $sctxt->rem_resa(false, $archiveInc, $remotePOV, $stampSearchIn, $days);
	
	if($resas->count()) 
		foreach($resas->keyed as $rid => $dS_resa) {
			if(!$unixtime) {
				$dS_resa->cueIn = Date('Y-m-d H:i', $dS_resa->cueIn);
				$dS_resa->cueOut = Date('Y-m-d H:i', $dS_resa->cueOut);
			}
		}

	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    B A C K U P    T O    C L I E N T    S I D E

if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = $accountId.'_backup_reservations';

	$idfields = Array('id'); if($remotePOV) $idfields[] = 'remoteId';
	$afields = Array('resources','cueIn','cueOut','visitors','rcolor','note','created','deleted');
	$fields = array_merge($idfields, $afields);
	
	echo $resas->csvstream($filename, $fields, false /*classname*/, !$web /* headers */);

	if($web) echo '</file>';
	
	
msg('##0## process successful, goodbye.##');


$perfReport->peak('::protocol streamed');
if($web) $perfReport->dropReport();

?>