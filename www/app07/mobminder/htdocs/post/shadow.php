<?php
//////////////////////////////////////////////////////////////////////
//
//    P O S T    S H A D O W    O R    T I M E    B O X 
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$tab = $_POST['tabs']; // Tells us what tab was open on the user's screen when he pushed the safe button. Timeboxing or Shadow => makes $id = $_POST['id'] either the id of a shodow or a timebox
$every = $_POST['every']+0; // defines if the change should apply every dayCode in the current hourly, OR ONLY on the given date
$slicing = $_POST['slicing']+0; // for timeboxing: defines how to slice the saved time period into smaller slices
$hourlyId = $_POST['hourlyId'];

$test = 0; // when set to 1: does not save to DB, does not feedback to ajax caller

if($hourlyId==0) die('Nothing can be associated with hourlyId zero... <command>logoff</command>');


if($every) { // the normal and easy case: change a shadow inside the current hourly

		if($tab == 0) { // shadow change (according to tab selection on save action moment)
			
			if($_POST['exceptional']==5) { // then ignore the cues, remove all shadows and post a 0-86400 unique shadow
				$_POST['cueIn'] = 0;
				$_POST['cueOut'] = 86400;
				$o_dbAccess_shadows = new C_dbAccess_shadows($hourlyId, $_POST['dayCode']); $o_dbAccess_shadows->deleteAll();
				$o_dbAccess_timeboxes = new C_dbAccess_timeboxes($hourlyId, $_POST['dayCode']); $o_dbAccess_timeboxes->deleteAll();
				$_POST['id'] = 0;
			}
			$o_dS_shadow = new C_dS_shadow($_POST['id'], $hourlyId, $_POST); $o_dS_shadow->dSsave();

			echo 'CASE 1: shadow'.$nl;
			echo '<code>';
			echo '#C_dS_shadow'.$nl.$o_dS_shadow->stream().$nl;
			echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
			echo '</code>';

		} else {	// $tab == 1: time box change

			echo 'CASE 2: time boxing'.$nl;
			$timeboxes = new C_dbAccess_timeboxes();
			$id = $_POST['id'];
			if($slicing) // then we chop the time period into smaller pieces
				$timeboxes = C_dbAccess_timeboxes::sliceandtimebox($slicing, $hourlyId, $_POST);
			else // no slicing
				$timeboxes->add(new C_dS_timebox($id, $hourlyId, $_POST), $id);
			
			$timeboxes->saveAll();
			
			echo '<code>';
			// echo '#C_dS_timebox'.$nl.$o_dS_timebox->stream().$nl;
			echo $timeboxes->stream();
			echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
			echo '</code>';
			
		}

} else {	// the tricky case: change applies on a single calendar date
		
		$daycode = $_POST['dayCode'];
		$dayIn = $_POST['dayIn'];
		$name = $_POST['name'];
		$closed = ($_POST['exceptional']==shadow_offday)&&($tab==0);
		$rscId = $_POST['rscId'];
		
		$singleday = new C_singleDayHourly($accountId, $rscId, $dayIn, $daycode, $name); 
		$singleday->setShadows($tab, $_POST['id'], $closed, $_POST);
		if(!$test) $singleday->save();
	
		// feedback to client side
		//		
		
		$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers($rscId);

		echo 'CASE 3'.$nl;
		if(!$test) echo '<code>';
			echo $singleday->stream().$nl;
			echo $o_dbAccess_hourliesusers->stream();
			echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
		if(!$test) echo '</code>';
		
} 


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_shadow');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>