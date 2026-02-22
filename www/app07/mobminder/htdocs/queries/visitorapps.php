<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   W E B    A P P    /    Q U E R Y    V I S I T O R    H I S T O R Y 
//
ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();


// retrieve posts
$id = $_POST['id']; // visitor id
$futureOnly = isset($_POST['future']) ? $_POST['future'] : false; 
$perfReport->peak('::time needed to retrieve session and posted parameters');

if($futureOnly) { // then we execute this particular piece of code (see proximus.js)
	
	$visiId = $id;
	
	// step00: fetch attendees related to this visitor (in the current table only)
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_att_visitors->loadOnResource($visiId);
	$resaIds = $o_dbAccess_att_visitors->getGroupIdsList();
	
	// check if this key relates to a specific view
	$o_dS_accesskey = new C_dS_accesskey($keyId);
	$o_dbAccess_resources = new C_dbAccess_resources($accountId, $o_dS_accesskey); 
	$rescIds = $o_dbAccess_resources->viewIds;
	
	// step 01: fetch reservations where this visitor was invited
	$now = new C_date();
	$nowStamp = $now->getTstmp();
	$o_dbAccess_reservations = new C_dbAccess_reservations();
	if($resaIds) $o_dbAccess_reservations->loadOnIdsAndView($resaIds, $rescIds);
	
	$resaIds = Array();
	if($o_dbAccess_reservations->count())
		foreach($o_dbAccess_reservations->keyed as $resaId => $o_dS_resa)
			if($o_dS_resa->cueIn > $nowStamp) $resaIds[] = $resaId;
	
	$resaIds = implode(',',$resaIds);

	$o_dbAccess_reservations = new C_dbAccess_reservations();
	$o_dbAccess_attendees = new C_dbAccess_attendees();
	$o_dbAccess_att_visitors = new C_dbAccess_att_visitors();
	$o_dbAccess_visitors = new C_dbAccess_visitors();
	$o_dbAccess_performances = new C_dbAccess_performances(); 
	$o_dbAccess_payments = new C_dbAccess_payments(); 
	
	if(count($resaIds)) {
	
		$o_dbAccess_reservations->loadOnId($resaIds);
		
		// step02: load attendees and visitors
		$o_dbAccess_attendees->loadOnGroup($resaIds);
		$o_dbAccess_att_visitors->loadOnGroup($resaIds);
		$o_dbAccess_visitors->loadOnId($o_dbAccess_att_visitors->getVisitorsIds($visiId /*exclude this id*/));
		$o_dbAccess_performances->loadOnGroup($resaIds);
		$o_dbAccess_payments->loadOnGroup($resaIds);
	}
	
	
	$bank = 'visiapps';
	echo '<code>';
	echo $o_dbAccess_visitors->stream(no_alias, no_bank, with_tracking); 
	echo $o_dbAccess_att_visitors->stream(false, $bank);
	echo $o_dbAccess_attendees->stream(false, $bank);
	echo $o_dbAccess_performances->stream(false, $bank);
	echo $o_dbAccess_reservations->stream(false, $bank);
	echo $o_dbAccess_payments->stream(false, $bank, with_tracking);
	echo '</code>';
	die();
}

// check if this relates to a specific view (we show appointments taken with resources only in the view of the surfer)
//

	$rescIds = $view_resources->viewIds;


// step 00: fetch attendees related to this visitor
//

	$o_dbAccess_att_visitors_current = new C_dbAccess_att_visitors();
	$o_dbAccess_att_visitors_current->loadOnResource($id);
	$ids_current = $o_dbAccess_att_visitors_current->getGroupIdsList();

	$o_dbAccess_att_visitors_archive = new C_dbAccess_att_visitors('archive_');
	$o_dbAccess_att_visitors_archive->loadOnResource($id);
	$ids_archive = $o_dbAccess_att_visitors_archive->getGroupIdsList();

	$perfReport->peak('::o_dbAccess_att_visitors');


// step 01: fetch reservations where this visitor was invited
//

	$o_dbAccess_reservations_current = new C_dbAccess_reservations();
	if($ids_current) $o_dbAccess_reservations_current->loadOnIdsAndView($ids_current, $rescIds);
	$resaIds_current = $o_dbAccess_reservations_current->getIdsList();

	$o_dbAccess_reservations_archive = new C_dbAccess_reservations('archive_');
	if($ids_archive) $o_dbAccess_reservations_archive->loadOnIdsAndView($ids_archive, $rescIds);
	$resaIds_archive = $o_dbAccess_reservations_archive->getIdsList();

	$perfReport->peak('::o_dbAccess_reservations');

// step02: fetch group resource attendees & visitors attendees (this overwrites step00)
//

	$o_dbAccess_attendees_current = new C_dbAccess_attendees();
	if($resaIds_current!='') $o_dbAccess_attendees_current->loadOnGroup($resaIds_current);
	$o_dbAccess_attendees_archive = new C_dbAccess_attendees('archive_');
	if($resaIds_archive!='') $o_dbAccess_attendees_archive->loadOnGroup($resaIds_archive);
	$perfReport->peak('::o_dbAccess_attendees');


// step04: fetch visitors (does not reload this visitor for which we already have the data)
//

	$o_dbAccess_visitors_current = new C_dbAccess_visitors();
	$o_dbAccess_visitors_current->loadOnId($o_dbAccess_att_visitors_current->getVisitorsIds($id /*exclude this id*/), false);
	$o_dbAccess_visitors_archive = new C_dbAccess_visitors();
	$o_dbAccess_visitors_archive->loadOnId($o_dbAccess_att_visitors_archive->getVisitorsIds($id /*exclude this id*/), false);
	$perfReport->peak('::o_dbAccess_visitors');


// step05: fetch performances
//

	$o_dbAccess_performances_current = new C_dbAccess_performances(); 
	$o_dbAccess_performances_current->loadOnGroup($resaIds_current);
	$o_dbAccess_performances_archive = new C_dbAccess_performances('archive_'); 
	$o_dbAccess_performances_archive->loadOnGroup($resaIds_archive);
	$perfReport->peak('::o_dbAccess_performances');


// step06: fetch resa parts
//

	$o_dbAccess_resaparts_current = new C_dbAccess_resaparts(); 
	$o_dbAccess_resaparts_current->loadOnGroup($resaIds_current);
	$o_dbAccess_resaparts_archive = new C_dbAccess_resaparts('archive_'); 
	$o_dbAccess_resaparts_archive->loadOnGroup($resaIds_archive);
	$perfReport->peak('::o_dbAccess_resaparts');


// step06: fetch resa payments
//

	$o_dbAccess_payments_current = new C_dbAccess_payments(); 
	$o_dbAccess_payments_current->loadOnGroup($resaIds_current);
	$o_dbAccess_payments_archive = new C_dbAccess_payments('archive_'); 
	$o_dbAccess_payments_archive->loadOnGroup($resaIds_archive);
	$perfReport->peak('::o_dbAccess_resaparts');



// step06 b: fetch resa series
//

	$o_dbAccess_resa_series[0] = new C_dbAccess_resa_series();
	if($resaIds_current) {
		$serieIds[0] = $o_dbAccess_reservations_current->getList('serieId', true /*excludes zeroes*/);
		$o_dbAccess_resa_series[0]->loadOnId($serieIds[0]);
	}
	
	$o_dbAccess_resa_series[1] = new C_dbAccess_resa_series();  // 'archive_' not yet implemented, all records are in the same table
	if($resaIds_archive) {
		$serieIds[1] = $o_dbAccess_reservations_archive->getList('serieId', true /*excludes zeroes*/);
		$o_dbAccess_resa_series[1]->loadOnId($serieIds[1]);
	}
	$perfReport->peak('::o_dbAccess_resa_series');
	
	


// step07: references in notes, tasks and chats
//
	$notesIds = Array( 0=>false, 1=>false );
	$tasksIds = Array( 0=>false, 1=>false );
	$chatsIds = Array( 0=>false, 1=>false );
	$target   = Array( 0=>'', 1=>'archive_' );

	foreach($target as $x => $arch) {
	
		$q = new Q('SELECT groupId FROM '.$arch.'note_visirefs WHERE visiId='.$id.';'); $notesIds[$x] = $q->groupIds();
		$q = new Q('SELECT groupId FROM '.$arch.'task_visirefs WHERE visiId='.$id.';'); $tasksIds[$x] = $q->groupIds();
		$q = new Q('SELECT groupId FROM '.$arch.'chat_visirefs WHERE visiId='.$id.';'); $chatsIds[$x] = $q->groupIds();
	
		if($notesIds[$x]) {
			$o_dbAccess_note_details[$x] 	= new C_dbAccess_note_details($notesIds[$x], $arch);
			$o_dbAccess_note_addressees[$x] = new C_dbAccess_note_addressees($notesIds[$x], $arch);
			$o_dbAccess_note_visirefs[$x] 	= new C_dbAccess_note_visirefs($notesIds[$x], $arch);
			$o_dbAccess_note_visitors[$x] 	= new C_dbAccess_visitors($o_dbAccess_note_visirefs[$x]->getList('visiId'));
		}
		if($tasksIds[$x]) {
			$o_dbAccess_task_assignees[$x] 		= new C_dbAccess_task_assignees($tasksIds[$x], $arch);
			$o_dbAccess_task_descriptions[$x] 	= new C_dbAccess_task_descriptions($tasksIds[$x], $arch);
			$o_dbAccess_task_visirefs[$x] 		= new C_dbAccess_task_visirefs($tasksIds[$x], $arch);
			$o_dbAccess_task_visitors[$x] 		= new C_dbAccess_visitors($o_dbAccess_task_visirefs[$x]->getList('visiId'));
		}
		if($chatsIds[$x]) {
			// echo $nl.'chats found from '.$arch.$nl.$chatsIds[$x].$nl.$nl;
			
			$o_dbAccess_chat_participants[$x] 	= new C_dbAccess_chat_participants($chatsIds[$x], $arch);
			$o_dbAccess_chat_threads[$x] 		= new C_dbAccess_chat_threads($chatsIds[$x], $arch);
			$o_dbAccess_chat_visirefs[$x] 	= new C_dbAccess_chat_visirefs($chatsIds[$x], $arch);
			$o_dbAccess_chat_visitors[$x] = new C_dbAccess_visitors($o_dbAccess_chat_visirefs[$x]->getList('visiId'));
		}
	}

$perfReport->peak('::o_dbAccess_notes, tasks, chats');

// step08: files
//

	$o_dbAccess_files = new C_dbAccess_files($id); // visitor's files
	$o_dbAccess_resafiles = new C_dbAccess_resafiles($resaIds_current); // visitor's appointments related files (resafiles)
	
	//
	

// step LAST: feedback to client side
//

$bank = 'visiapps';
echo '<code>';

	echo $o_dbAccess_visitors_current->stream(no_alias, no_bank, with_tracking); 
	echo $o_dbAccess_visitors_archive->stream(no_alias, no_bank, with_tracking);

	echo $o_dbAccess_att_visitors_current->stream(false, $bank);
	echo $o_dbAccess_att_visitors_archive->stream(false, $bank);

	echo $o_dbAccess_attendees_current->stream(false, $bank);
	echo $o_dbAccess_attendees_archive->stream(false, $bank);

	echo $o_dbAccess_resa_series[0]->stream(false, $bank, with_tracking);
	echo $o_dbAccess_resa_series[1]->stream(false, $bank, with_tracking);

	echo $o_dbAccess_performances_current->stream(false, $bank);
	echo $o_dbAccess_performances_archive->stream(false, $bank);

	echo $o_dbAccess_resaparts_current->stream(false, $bank);
	echo $o_dbAccess_resaparts_archive->stream(false, $bank);

	echo $o_dbAccess_reservations_current->stream(false, $bank);
	echo $o_dbAccess_reservations_archive->stream(false, $bank);

	echo $o_dbAccess_payments_current->stream(false, $bank, with_tracking);
	echo $o_dbAccess_payments_archive->stream(false, $bank, with_tracking);

	///
	$bank = 'visitab';
	foreach($target as $x => $arch) {
		if($notesIds[$x]) {
			echo $o_dbAccess_note_details[$x]->stream(false, $bank);
			echo $o_dbAccess_note_addressees[$x]->stream(false, $bank);
			echo $o_dbAccess_note_visirefs[$x]->stream(false, $bank);
			echo $o_dbAccess_note_visitors[$x]->stream(no_alias, no_bank, with_tracking);
		}
		if($tasksIds[$x]) {
			echo $o_dbAccess_task_descriptions[$x]->stream(false, $bank);
			echo $o_dbAccess_task_assignees[$x]->stream(false, $bank);
			echo $o_dbAccess_task_visirefs[$x]->stream(false, $bank);
			echo $o_dbAccess_task_visitors[$x]->stream(no_alias, no_bank, with_tracking);
		}
		if($chatsIds[$x]) { 
			echo $o_dbAccess_chat_threads[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_participants[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_visirefs[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_visitors[$x]->stream(no_alias, no_bank, with_tracking);
		}
	}
	
	echo $o_dbAccess_files->stream(false); // these two must stay after the streaming of any _visitors[$x], because files are attached to them at client side (that must happen after execution of the C_dS_visitor:constructor() )
	echo $o_dbAccess_resafiles->stream(false);
	
echo '</code>';

$perfReport->peak('::step 3 - echo completed');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
C_dS_connection::poke($perfReport, 'q_visiapps');
?>