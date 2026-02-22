<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E     A N    A C C O U N T
//

$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
require '../../lib_cronofy/crohelper.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

if($accountId <> $_POST['id']) die('Sorry, you have no access here... <command>logoff</command>');

if(!supervised()) die('Sorry, no permission... <command>logoff</command>');


$perfReport->peak('::session retrieved');

	$o_dbAccess_resources = new C_dbAccess_resources($accountId); 
	$rescIds = $o_dbAccess_resources->getIdsList();
	
	// resources, including all their attributes
	//
	//
	if($rescIds) {
	
		$q = new Q('SELECT DISTINCT groupId FROM attendees WHERE resourceId IN('.$rescIds.');'); // attendees group to reservations
		$resaIds = $q->groupIds();

		if($rescIds && $resaIds) { // from current reservations tables
			new Q('DELETE FROM performances WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM resaparts WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM att_visitors WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM attendees WHERE resourceId IN('.$rescIds.');'); // attendees link to the resources
			new Q('DELETE FROM reservations WHERE groupId = '.$accountId.';'); // reservations group to account
			new Q('DELETE FROM comm_toggles WHERE groupId = '.$accountId.';'); // reservations group to account
		}
		$perfReport->peak('current reservations');

		$q = new Q('SELECT DISTINCT groupId FROM archive_attendees WHERE resourceId IN('.$rescIds.');'); // attendees group to reservations
		$resaIds = $q->groupIds();
		
		if($rescIds && $resaIds) { // from archived reservations tables
			new Q('DELETE FROM archive_performances WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM archive_resaparts WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM archive_att_visitors WHERE groupId IN('.$resaIds.');'); // att_visitors group to reservations
			new Q('DELETE FROM archive_attendees WHERE resourceId IN('.$rescIds.');'); // attendees link to the resources
			new Q('DELETE FROM archive_reservations WHERE groupId = '.$accountId.';'); // reservations group to account
			new Q('DELETE FROM comm_toggles WHERE groupId = '.$accountId.';'); // reservations group to account
		}
		$perfReport->peak('archived reservations');
	}
	
	// tasks and notes and chats
	//
	//
		$q = new Q('SELECT id FROM task_descriptions WHERE groupId = '.$accountId.';');
		$taskIds = $q->ids();
		if($taskIds) {
			new Q('DELETE FROM task_assignees WHERE groupId IN('.$taskIds.');');
			new Q('DELETE FROM task_visirefs WHERE groupId IN('.$taskIds.');');
			new Q('DELETE FROM task_descriptions WHERE groupId = '.$accountId.';');
		}
	
		$q = new Q('SELECT id FROM note_details WHERE groupId = '.$accountId.';');
		$noteIds = $q->ids();
		if($noteIds) {
			new Q('DELETE FROM note_addressees WHERE groupId IN('.$noteIds.');');
			new Q('DELETE FROM note_visirefs WHERE groupId IN('.$noteIds.');');
			new Q('DELETE FROM note_details WHERE groupId = '.$accountId.';');
		}
	
		$q = new Q('SELECT id FROM chat_threads WHERE groupId = '.$accountId.';');
		$chatIds = $q->ids();
		if($chatIds) {
			new Q('DELETE FROM chat_participants WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM chat_visirefs WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM chat_phylacteries WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM chat_threads WHERE groupId = '.$chatIds.';');
		}
	
	
		// also archived stuff
		$q = new Q('SELECT id FROM archive_task_descriptions WHERE groupId = '.$accountId.';');
		$taskIds = $q->ids();
		if($taskIds) {
			new Q('DELETE FROM archive_task_assignees WHERE groupId IN('.$taskIds.');');
			new Q('DELETE FROM archive_task_visirefs WHERE groupId IN('.$taskIds.');');
			new Q('DELETE FROM archive_task_descriptions WHERE groupId = '.$accountId.';');
		}
			
		$q = new Q('SELECT id FROM archive_note_details WHERE groupId = '.$accountId.';');
		$noteIds = $q->ids();
		if($noteIds) {
			new Q('DELETE FROM archive_note_addressees WHERE groupId IN('.$noteIds.');');
			new Q('DELETE FROM archive_note_visirefs WHERE groupId IN('.$noteIds.');');
			new Q('DELETE FROM archive_note_details WHERE groupId = '.$accountId.';');
		}
		
		$q = new Q('SELECT id FROM archive_chat_threads WHERE groupId = '.$accountId.';');
		$chatIds = $q->ids();
		if($chatIds) {
			new Q('DELETE FROM archive_chat_participants WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM archive_chat_visirefs WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM archive_chat_phylacteries WHERE groupId IN('.$chatIds.');');
			new Q('DELETE FROM archive_chat_threads WHERE groupId = '.$chatIds.';');
		}
		
		$perfReport->peak('tasks and notes');

	
	// hourlies and shadows and timeboxing
	//
	//
	$q = new Q('SELECT id FROM hourlies WHERE groupId = '.$accountId.';');
	$hourlyIds = $q->ids();
	if($hourlyIds) {
		new Q('DELETE FROM shadows WHERE groupId IN('.$hourlyIds.');');
		new Q('DELETE FROM timeboxes WHERE groupId IN('.$hourlyIds.');');
		new Q('DELETE FROM timeboxings WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM hourlies WHERE groupId = '.$accountId.';');
		if($rescIds) { new Q('DELETE FROM hourliesusers WHERE groupId IN('.$rescIds.');'); }
	}
	$perfReport->peak('hourlies and shadows and timeboxing');
	
	

	// communication
	//
	//
	if(1) {
		new Q('DELETE FROM templates_email WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM templates_sms WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM emails WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM sms WHERE groupId = '.$accountId.';');
	}
	$perfReport->peak('communication');
	
	
	// statistics
	//
	//
	if(1) {
		new Q('DELETE FROM xmon_actions WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM xmon_actuals WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM xmon_accounts WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM xmon_sms WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM xmon_ccss WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM xmon_performances WHERE groupId = '.$accountId.';');
	}
	$perfReport->peak('statistics');
	
	// workcodes, experts and associated timeboxing
	//
	//
	$q = new Q('SELECT id FROM workcodes WHERE groupId = '.$accountId.';');
	$wkIds = $q->ids();
	if($wkIds) {
		new Q('DELETE FROM workexperts WHERE groupId IN('.$wkIds.');');
		new Q('DELETE FROM worktboxing WHERE groupId IN('.$wkIds.');');
		new Q('DELETE FROM workcodes WHERE groupId = '.$accountId.';');
	}
	$perfReport->peak('workcodes, experts and associated timeboxing');
	
	
	
	// logins
	//
	//
	$q = new Q('SELECT groupId FROM accesskeys WHERE accountId = '.$accountId.';');
	$loginIds = $q->groupIds(); // all the keys having an access to this account
	if($loginIds) {	
		// remove the login only if they have one remaining key
		$lids = $q->groupIds(false); 
		foreach($lids as $lid) {
			$qq = new Q('SELECT count(1) as c FROM accesskeys WHERE groupId = '.$lid.';'); // counts how many keys this login has
			if($qq->c() < 2) { // this was the only remaining key for this login
				new Q('DELETE FROM logins WHERE id = '.$lid.';');
			}
		}
		
		new Q('DELETE FROM synchro_resources WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM synchro_visitors WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM synchro_reservations WHERE groupId = '.$accountId.';');
	}
	$perfReport->peak('logins');
	


	// accesskeys
	//
	// we need to remove any access keys leading to this account, along with them, details and catalysts
	//
	// remove any key that leads to this account
	// 
	$q = new Q('SELECT id FROM accesskeys WHERE accountId = '.$accountId.';');
	$akIds = $q->ids(list_as_string); // all the keys having an access to this account
	$accesskeysIds = $q->ids(list_as_array);
	if($akIds) {		
		new Q('DELETE FROM catalysts WHERE groupId IN('.$akIds.');');
		new Q('DELETE FROM details WHERE groupId IN('.$akIds.');');
	}
	
	
	
	new Q('DELETE FROM accesskeys WHERE accountId = '.$accountId.';');
	$perfReport->peak('accesskeys');
	
	
	
	
	// logos
		C_dbAccess_logos::removeAccount($accountId);

	
	
	
	// resources and group custom objects
	//
	//
	if(1) {
		new Q('DELETE FROM resources WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM contracts WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM guidelines WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM custom_css WHERE groupId = '.$accountId.';');
		new Q('DELETE FROM groups WHERE id = '.$accountId.';');
		new Q('DELETE FROM exceptions WHERE groupId = '.$accountId.';');
				
		// new Q('DELETE FROM visitors WHERE groupId = '.$accountId.';');			// We always keep visitors, for statistical purpose	
	}
	$perfReport->peak('resources and group custom objects');
	
	
	
	//bsp-begin
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//
	// Cronofy
	// created by bspoden
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//revoke all calendars linked to cronofy accesses linked to accesskeys
	DebugLog('delete/account.calling cronofy.start');
	RevokeCalendarsForAccessKeys($accesskeysIds,$_SESSION['loginId']);
	DebugLog('delete/account.calling cronofy.end');
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	//bsp-end
	
	
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_account');
?>