<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    A N    H O U R L Y    D E S C R I P T I O N
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');


$hourlyId = $_POST['id'];
$test = false; // allows to watch the ajax response without saving any change to DB
	
if($hourlyId > 0) { // existing hourly (which is always the case for this script, because creation is possible only through schedule.php)

	$o_dS_hourly = new C_dS_hourly($hourlyId); 
	$o_dbAccess_timeboxes = new C_dbAccess_timeboxes(); // the new set of time boxes
	$o_dbAccess_shadows = new C_dbAccess_shadows(); // the new set of shadows
	$periodicity = $_POST['periodicity'];
	
	if($o_dS_hourly->periodicity != $_POST['periodicity']) { // let's check if you try to extend/reduce the periodicity of the hourly
	
		// STEP 1: reproduce shadows
		$o_dbAccess_currentShadows = new C_dbAccess_shadows($hourlyId); // the current set of shadows (we will remove them and replace with new ones)
		
			$byDayCode = Array(); for($dc=1;$dc<=28;$dc++) $byDayCode[$dc] = Array();
			foreach($o_dbAccess_currentShadows->keyed as $id => $o_dS_shadow) // note that if current periodicity is e.g. 1, the remaining 3 weeks are left empty
				$byDayCode[$o_dS_shadow->dayCode][$id] = $o_dS_shadow;
			
			// new periodicity may vary from current
			if($o_dS_hourly->periodicity < $periodicity) // new periodicity is larger than before
				for($dc=1; $dc<=7; $dc++) {
					$byDayCode[$dc+7] = $byDayCode[$dc];
					$byDayCode[$dc+14] = $byDayCode[$dc];
					$byDayCode[$dc+21] = $byDayCode[$dc];
				}
			// else we use the first weeks of the current hourly, cutting the trailers

			$stop = (7*$periodicity)+1;
			for($dc=1; $dc<$stop; $dc++) 
				foreach($byDayCode[$dc] as $is =>$o_dS_shadow) {
					$o_dS_copy = $o_dbAccess_shadows->newVirtual();
					$o_dS_copy->groupId = $hourlyId;
					$o_dS_copy->cueIn = $o_dS_shadow->cueIn;
					$o_dS_copy->cueOut = $o_dS_shadow->cueOut;
					$o_dS_copy->dayCode = $dc;
					$o_dS_copy->exceptional = $o_dS_shadow->exceptional;
				}		
			if(!$test) { 
				$o_dbAccess_shadows->saveAll();
				$o_dbAccess_currentShadows->deleteAll();
			}
		
		// STEP 2: reproduce time boxes in the same way as here above done for shadows
		$o_dbAccess_currentTboxes = new C_dbAccess_timeboxes($hourlyId); // the current set of time boxes (we will remove them and replace with new ones)
		
			$byDayCode = Array(); for($dc=1;$dc<=28;$dc++) $byDayCode[$dc] = Array();
			foreach($o_dbAccess_currentTboxes->keyed as $id => $o_dS_timebox) // note that if current periodicity is e.g. 1, the remaining 3 weeks are left empty
				$byDayCode[$o_dS_timebox->dayCode][$id] = $o_dS_timebox;
			
			// new periodicity may vary from current
			if($o_dS_hourly->periodicity < $periodicity) // new periodicity is larger than before
				for($dc=1; $dc<=7; $dc++) {
					$byDayCode[$dc+7] = $byDayCode[$dc];
					$byDayCode[$dc+14] = $byDayCode[$dc];
					$byDayCode[$dc+21] = $byDayCode[$dc];
				}
			// else we use the first weeks of the current hourly, cutting the trailers

			$stop = (7*$periodicity)+1;
			for($dc=1; $dc<$stop; $dc++) 
				foreach($byDayCode[$dc] as $is =>$o_dS_timebox) {
					$o_dS_copy = $o_dbAccess_timeboxes->newVirtual();
					$o_dS_copy->groupId = $hourlyId;
					$o_dS_copy->cueIn = $o_dS_timebox->cueIn;
					$o_dS_copy->cueOut = $o_dS_timebox->cueOut;
					$o_dS_copy->dayCode = $dc;
					$o_dS_copy->timeboxingId = $o_dS_timebox->timeboxingId;
				}		
			if(!$test) {
				$o_dbAccess_timeboxes->saveAll();
				$o_dbAccess_currentTboxes->deleteAll();
			}
			
	} else { // periodicity does not change
		
		$o_dbAccess_timeboxes->loadOnGroup($hourlyId);
		$o_dbAccess_shadows->loadOnGroup($hourlyId);
	}
}

	$o_dS_hourly = new C_dS_hourly($hourlyId, $accountId, $_POST);
	$o_dS_hourly->dSsave();

	echo '<code>';
	echo $o_dbAccess_shadows->stream();
	echo $o_dbAccess_timeboxes->stream();
	// echo '#C_dS_hourly'.chr(10).$o_dS_hourly->stream(with_tracking).chr(10);
	echo $o_dS_hourly->stream1(with_tracking).$nl;
	echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
	echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_hourly');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>