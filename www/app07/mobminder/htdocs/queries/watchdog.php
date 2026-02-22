<?php
ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();


if(isset($_POST['ics'])) { // smart.mobminder.com does not send ics, tcs and date
	
	$rics = $_POST['ics']; // remote checksum
	$rtcs = $_POST['tcs']; // remote checksum
	$d = $_POST['date'];

	$date = new C_date($d);
	$stampSearchIn = $date->t;
	$stampSearchOut  = $date->t+86400;

	$archive_pivot_stamp = C_dS_system::backupPivotStamp();
	$pivot_date = new C_date($archive_pivot_stamp);

	if($stampSearchIn < $archive_pivot_stamp) { // then you are exploring the archives, in this case we do not auto-refresh

		// we achieve "no refresh" by returning identical data as the one coming in :)
		$sics = $rics;
		$stcs = $rtcs;
		
	} else {
		
		C_date::setTimeParameters($dS_account);
			$dbAccess_reservations = new C_dbAccess_reservations();
			$view = $view_resources->viewIds;
		$dbAccess_reservations->loadOnTimeSpan($accountId, $stampSearchIn, $stampSearchOut, plitems_visible_on_frame, $view);
		
		$sics = 0; $stcs = 0; // server checksum
		foreach($dbAccess_reservations->keyed as $rid => $dS_r) 
			if($dS_r->deletorId) continue;
				else { // this exact same calculation is realized at client side in planning.js C_iPLAN::daysum and must be maintained equal
					$sics+=$rid+$dS_r->rversion; // ids checksum
					$stcs+=$dS_r->cueIn+$dS_r->cueOut; // time checksum
				}
		
	}
	echo 'display date:'.$d.chr(10);
	echo 'archive pivot date:'.($pivot_date->getDateSortable()).chr(10);
	echo 'remote checksum: '.$rics.','.$rtcs.chr(10);
	echo 'server checksum: '.$sics.','.$stcs.chr(10);
	echo '<data>'.$rics.'-'.$sics.'-'.$rtcs.'-'.$stcs.'</data>';
}

$perfReport->peak('::done');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
?>