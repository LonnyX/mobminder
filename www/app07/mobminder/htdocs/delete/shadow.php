<?php

//////////////////////////////////////////////////////////////////////
//
//    D E L E T I N G    S H A D O W S    O R    T I M E B O X 

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$id = $_POST['id'];
$tab = $_POST['tabs']; if(!is_numeric($tab)) die('err100100');
$hourlyId = $_POST['hourlyId']; if(!is_numeric($hourlyId)) die('err100100');
$every = $_POST['every']+0; if(!is_numeric($every)) die('err100100');
$daycode = $_POST['dayCode']; if(!is_numeric($daycode)) die('err100100');
$allofthem = $_POST['allofthem']; if(!is_numeric($allofthem)) die('err100100');

if($hourlyId==0) die('Nothing can be associated with hourlyId zero... <command>logoff</command>');

$stream = '';
if($every) { // the normal and easy case: delete a shadow inside the current hourly

	switch($tab) {
		case 0: // delete a shadow
		
			$dS_shadow = new C_dS_shadow($id);
			if($dS_shadow->exceptional == shadow_offday) { // deleting an off day
			
				// then replace the off day unique shadow by a pair of normal AM and PM shadows
				$is024 = ($dS_account->rangeIn == 0 && $dS_account->rangeOut == 86400);
				if($is024) {
					// then the action of opening a closed day will simply leave it blank and ready for adding custom unavailability shadows
					
				} else {
					$dS_shadowAM = new C_dS_shadow(0, $hourlyId);
					$dS_shadowAM->setAMshadow($dS_account);
					$dS_shadowAM->dayCode = $daycode;
					$dS_shadowAM->dSsave();
					
					$dS_shadowPM = new C_dS_shadow(0, $hourlyId);
					$dS_shadowPM->setPMshadow($dS_account);
					$dS_shadowPM->dayCode = $daycode;
					$dS_shadowPM->dSsave();
				}
			}
			$dS_shadow->dSdelete();
			$o_dbAccess_shadows = new C_dbAccess_shadows($hourlyId, $daycode); // reloads the rest of the collection from DB
			$stream = $o_dbAccess_shadows->stream();
			break; 
		
		case 1: // delete a time box
		
			$dS_timebox = new C_dS_timebox($id);
			if($allofthem) { // deletes on that day all the timeboxes having that given color/pattern/label (which is a C_dS_timeboxing setup)
				$tbxingid = $dS_timebox->timeboxingId;
				$daycode = $dS_timebox->dayCode;
				$hourlyid = $dS_timebox->groupId;
				$q = new Q('select id from timeboxes where groupId = '.$hourlyid.' and daycode = '.$daycode.' and timeboxingId = '.$tbxingid.';');
				$dbAccess_timeboxes = new C_dbAccess_timeboxes();
				$dbAccess_timeboxes->loadOnId($q->ids())->deleteAll(); 
			} else
				$dS_timebox->dSdelete();
			
			$o_dbAccess_timeboxes = new C_dbAccess_timeboxes($hourlyId, $daycode); // reloads the rest of the collection from DB
			$stream = $o_dbAccess_timeboxes->stream();
			break;
	}

} else { // the tricky case: change applies on a single calendar date

	
		$dayIn = $_POST['dayIn'];
		$name = $_POST['name'];
		$rscId = $_POST['rscId'];
		
		$singleday = new C_singleDayHourly($accountId, $rscId, $dayIn, $daycode, $name); 
		$singleday->deleteShadow($tab, $_POST['id'], $allofthem);
		$singleday->save();
		
		// feedback to client side
		//		
		$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers($rscId);
			$stream = $singleday->stream().$nl;
			$stream .= $o_dbAccess_hourliesusers->stream();

}

echo '<code>';
echo $stream;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_shadow');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>