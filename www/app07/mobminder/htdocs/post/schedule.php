<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    A    N E W     H O U R L Y    C H A N G E   (M_NewHourly)
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$tabs = $_POST['tabs'];
$rscId = $_POST['rscId'];
$dayIn = $_POST['dayIn'];
$monday = $_POST['monday'];
$current = $_POST['current']; // current hourly id
$periodicity = $_POST['periodicity'];

	$dayIn_display = new C_date($dayIn);
	$monday_display = new C_date($monday);
	$current_display = new C_date($current);

echo 'Posted parameters:'.$nl;
echo '   - tabs = '.$tabs.$nl;
echo '   - rscId = '.$rscId.$nl;
echo '   - dayIn = '.$dayIn_display->getDateTimeString().$nl;
echo '   - monday = '.$monday_display->getDateTimeString().$nl;
echo '   - current = '.$current_display->getDateTimeString().$nl;
echo '   - periodicity = '.$periodicity.$nl;
echo ' '.$nl;


$test = false; // allows to watch the ajax response without saving any change to DB

$scope = new C_hourliesScope($rscId, $dayIn);
if($scope->o_dS_huser_onDayIn) $scope->o_dS_huser_onDayIn->dSdelete(); // clean up any huser on this date

switch($tabs) { // note that whatever the case, o_dS_hourlyuser is created in this script

	case 0: // new hourly and new schedule for this hourly
		echo 'Case 0: New hourly'.$nl;
	
		$o_dS_hourly = new C_dS_hourly(-1, $accountId, $_POST);
		if(!$test) $o_dS_hourly->dSsave();
		$_POST['hourlyId'] = $o_dS_hourly->id; // prepares for C_dS_hourlyuser
		$o_dbAccess_timeboxes = new C_dbAccess_timeboxes();
		$o_dbAccess_shadows = new C_dbAccess_shadows();
		
		if($current) {
			// copy exactly the shadows associated with the current schedule, the user modifies them afterwards
			$o_dS_currentHourly = new C_dS_hourly($current);
			
			// reproduce shadows
			$o_dbAccess_currentShadows = new C_dbAccess_shadows($current);
			
				$byDayCode = Array(); for($dc=1;$dc<=28;$dc++) $byDayCode[$dc] = Array();
				foreach($o_dbAccess_currentShadows->keyed as $id => $o_dS_shadow) // note that if current periodicity is e.g. 1, the remaining 3 weeks are left empty
					$byDayCode[$o_dS_shadow->dayCode][$id] = $o_dS_shadow;
				
				// new periodicity may vary from current
				if($o_dS_hourly->periodicity>$o_dS_currentHourly->periodicity) // new periodicity is larger than current
					for($dc=1; $dc<=7; $dc++) {
						$byDayCode[$dc+7] =  $byDayCode[$dc];
						$byDayCode[$dc+14] = $byDayCode[$dc];
						$byDayCode[$dc+21] = $byDayCode[$dc];
					}
				// else we use the first weeks of the current hourly, cutting the trailers

				$stop = (7*$periodicity)+1;
				for($dc=1; $dc<$stop; $dc++) 
					foreach($byDayCode[$dc] as $is =>$o_dS_shadow) {
						$o_dS_copy = $o_dbAccess_shadows->newVirtual();
						$o_dS_copy->groupId = $o_dS_hourly->id;
						$o_dS_copy->cueIn = $o_dS_shadow->cueIn;
						$o_dS_copy->cueOut = $o_dS_shadow->cueOut;
						$o_dS_copy->dayCode = $dc;
						$o_dS_copy->exceptional = $o_dS_shadow->exceptional;
					}		
				if(!$test) $o_dbAccess_shadows->saveAll();
			
			// reproduce time boxes in the same way as here above done for shadows
			$o_dbAccess_currentTboxes = new C_dbAccess_timeboxes($current);
			
				$byDayCode = Array(); for($dc=1;$dc<=28;$dc++) $byDayCode[$dc] = Array();
				foreach($o_dbAccess_currentTboxes->keyed as $id => $o_dS_timebox) // note that if current periodicity is e.g. 1, the remaining 3 weeks are left empty
					$byDayCode[$o_dS_timebox->dayCode][$id] = $o_dS_timebox;
				
				// new periodicity may vary from current
				if($o_dS_hourly->periodicity>$o_dS_currentHourly->periodicity) // new periodicity is larger than current
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
						$o_dS_copy->groupId = $o_dS_hourly->id;
						$o_dS_copy->cueIn = $o_dS_timebox->cueIn;
						$o_dS_copy->cueOut = $o_dS_timebox->cueOut;
						$o_dS_copy->dayCode = $dc;
						$o_dS_copy->timeboxingId = $o_dS_timebox->timeboxingId;
					}		
				if(!$test) $o_dbAccess_timeboxes->saveAll();
		
		} else { // a first new hourly is set on an agenda having the default hourly (no hourly)
			
			$o_dS_group = new C_dS_group($accountId);		
			$o_dbAccess_shadows->newSchedule($o_dS_group, $o_dS_hourly, $periodicity);
			// there is nothing for timeboxes when starting from scratch making your schedule
			if(!$test) $o_dbAccess_shadows->saveAll();
		}
		$o_dS_hourlyuser = new C_dS_hourlyuser(-1, $rscId, $_POST);
		if(!$test) $o_dS_hourlyuser->dSsave();
		
		break;
	
	case 1: // re-use an existing hourly
		echo 'Case 1: Re-use an existing hourly'.$nl;
		
		$o_dS_hourlyuser = new C_dS_hourlyuser(-1, $rscId, $_POST);
		if(!$test) $o_dS_hourlyuser->dSsave();
		break;
		
	case 2: // double switch the hourly, the first in time skip
		echo 'Case 2: Skip to an existing hourly and back'.$nl;
		
			$o_hourliesusers = new C_dbAccess_hourliesusers();
			$o_hourliesusers->loadInBetween($rscId, $_POST['dayIn'], $_POST['dayOut']);
		if(!$test) $o_hourliesusers->deleteAll(); // clean up the period from any existing hourly change 
		
		$o_dS_hourlyuserIN = new C_dS_hourlyuser(-1, $rscId, $_POST);
			$o_dS_hourlyuserIN->hourlyId = $_POST['skipTo'];
		$o_dS_hourlyuserOUT = new C_dS_hourlyuser(-2, $rscId, $_POST);
			$o_dS_hourlyuserOUT->dayIn = $_POST['dayOut'];
			$o_dS_hourlyuserOUT->hourlyId = $_POST['skipBack'];
		if(!$test) $o_dS_hourlyuserIN->dSsave();
		if(!$test) $o_dS_hourlyuserOUT->dSsave();
		break;
}

$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers($rscId);

echo '<code>';
	if($tabs==0) { // a new hourly has been created
		echo $o_dbAccess_shadows->stream();
		echo $o_dbAccess_timeboxes->stream();
		echo $o_dS_hourly->stream1(with_tracking).$nl;
	}
echo $o_dbAccess_hourliesusers->stream();
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_schedule');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>