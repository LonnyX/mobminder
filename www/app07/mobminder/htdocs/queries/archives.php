<?php
//////////////////////////////////////////////////////////////////////////
//
//      Q U E R Y    N O T E S,  T A S K S,  C H A T S    A R C H I V E S
//

require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport();

$id = $_POST['id'];
if($id != $accountId) die('look in your own group... <command>logoff</command>');

	// prepare load parameters
	//

$filter = $_POST['filter'];	

$keyword 	= $_POST['keyword']; $keyword = substr($keyword,0,16);
$sunday 	= $_POST['sunday']+86400;
$xweeks 	= $_POST['xweeks'];	
$logins 	= $_POST['logins']; if($logins=='-') $logins= Array(); else $logins = explode('!', $logins); // an array of login Ids, assigned to this task


$notesIds = Array( 0=>false, 1=>false );
$tasksIds = Array( 0=>false, 1=>false );
$chatsIds = Array( 0=>false, 1=>false );
$target = Array( 0=>'', 1=>'archive_' ); // we search both current and archive tables

if(count($logins)) {

	$logins = implode(',',$logins);
	
	foreach($target as $x => $arch) switch($filter) {

		case 'none': // not accessible to users, to avoid flooding
			echo 'No filter ('.$arch.')'.$nl; 
			
			$q = new Q('SELECT id FROM '.$arch.'note_details WHERE groupId='.$accountId.';'); $notesIds[$x] = $q->ids();
			$q = new Q('SELECT id FROM '.$arch.'task_descriptions WHERE groupId='.$accountId.';'); $tasksIds[$x] = $q->ids();
			$q = new Q('SELECT id FROM '.$arch.'chat_threads WHERE groupId='.$accountId.';'); $chatsIds[$x] = $q->ids();
			
			break;

		case 'created': 
			echo 'By creation date ('.$arch.')'.$nl; 
					$midnOut = new C_date($sunday);
					$midnIn = $midnOut->wIncrement(-$xweeks)->getMDNstmp();
					$midnOut = $sunday;		
				$in = Date('Y-m-d H:i:s',$midnIn); 
				$out = Date('Y-m-d H:i:s',$midnOut); 
			
			$q = new Q('SELECT id FROM '.$arch.'note_details WHERE groupId='.$accountId.' AND created < "'.$out.'" AND created >= "'.$in.'" AND creatorId IN ('.$logins.');'); $notesIds[$x] = $q->ids();
			$q = new Q('SELECT id FROM '.$arch.'task_descriptions WHERE groupId='.$accountId.' AND created < "'.$out.'" AND created >= "'.$in.'" AND creatorId IN ('.$logins.');'); $tasksIds[$x] = $q->ids();
			$q = new Q('SELECT id FROM '.$arch.'chat_threads WHERE groupId='.$accountId.' AND created < "'.$out.'" AND created >= "'.$in.'" AND creatorId IN ('.$logins.');'); $chatsIds[$x] = $q->ids();
			
			break;
			
		case 'archived': 
			echo 'By archive date ('.$arch.')'.$nl; 
					$midnOut = new C_date($sunday);
					$midnIn = $midnOut->wIncrement(-$xweeks)->getMDNstmp();
					$midnOut = $sunday;		
				$in = Date('Y-m-d H:i:s',$midnIn); 
				$out = Date('Y-m-d H:i:s',$midnOut); 
			// easy for notes: we base the filtering on last visible day
			$q = new Q('SELECT id FROM '.$arch.'note_details WHERE groupId='.$accountId.' AND midnOut < "'.$midnOut.'" AND midnOut >= "'.$midnIn.'";'); $nIds = $q->ids();
			if($nIds) {
				$q = new Q('SELECT DISTINCT groupId FROM '.$arch.'note_addressees WHERE groupId IN ('.$nIds.') AND loginId IN ('.$logins.');'); $notesIds[$x] = $q->groupIds();
			}
			
			
			// less easy for tasks, all assignees must have finished the job (midnOut <> 0)
			$q = new Q('SELECT id FROM '.$arch.'task_descriptions WHERE groupId='.$accountId.' AND midnIn >= "'.$midnIn.'";'); $tIds = $q->ids();
			if($tIds) {
				$q = new Q('SELECT DISTINCT groupId FROM '.$arch.'task_assignees WHERE groupId IN ('.$tIds.') AND midnOut = 0;'); $xcludeIds = $q->groupIds();
				$q = new Q('SELECT DISTINCT id FROM '.$arch.'task_descriptions WHERE id IN ('.$tIds.') AND id NOT IN ('.$xcludeIds.');'); $tIds = $q->ids();
				if($tIds)
					$q = new Q('SELECT DISTINCT groupId FROM '.$arch.'task_assignees WHERE groupId IN ('.$tIds.') AND loginId IN ('.$logins.');'); $tasksIds[$x] = $q->groupIds();
			}
			
			
			// chats
			if($x == 1) { // we fetch only from archive table
			
				$sql = 'SELECT id FROM '.$arch.'chat_threads WHERE groupId='.$accountId.' AND ( (changed >= "'.$in.'" AND changed < "'.$out.'") OR (deleted >= "'.$in.'" AND deleted < "'.$out.'") ) and creatorId in ('.$logins.');';
				$q = new Q($sql); $cIds = $q->ids();
				
				// echo chr(10).chr(10).$sql.chr(10).chr(10);
				// echo chr(10).$sql.chr(10).$cIds.chr(10);
				
				$chatsIds[$x] = $cIds;
		
				// if($cIds) {
					// $q = new Q('SELECT DISTINCT groupId FROM '.$arch.'chat_participants WHERE groupId IN ('.$cIds.') AND cueOut = 0;'); $xcludeIds = $q->groupIds();
					// $q = new Q('SELECT id FROM '.$arch.'chat_threads WHERE id IN ('.$cIds.') AND id NOT IN ('.$xcludeIds.');'); $cIds = $q->ids();
					// if($cIds)
						// $q = new Q('SELECT DISTINCT groupId FROM '.$arch.'chat_participants WHERE groupId IN ('.$cIds.') AND loginId IN ('.$logins.');'); $chatsIds[$x] = $q->groupIds();
				// }
			}
			break;
			
		case 'keyword': 
			echo 'By keyword ['.$keyword.'] ('.$arch.')'.$nl; 
			
			$whereTitle = wherelike('title', $keyword);
			$whereDescr = wherelike('description', $keyword);
			$whereNote 	= wherelike('note', $keyword);
			$whereBla 	= wherelike('bla', $keyword);
			
			// notes
			$q = new Q('SELECT id FROM '.$arch.'note_details WHERE groupId='.$accountId.' AND ('.$whereTitle.' OR '.$whereNote.');'); $nIds = $q->ids();
			if($nIds) $q = new Q('SELECT DISTINCT groupId FROM '.$arch.'note_addressees WHERE groupId IN ('.$nIds.') AND loginId IN ('.$logins.');'); $notesIds[$x] = $q->groupIds();
			
			
			// tasks
			$q = new Q('SELECT id FROM '.$arch.'task_descriptions WHERE groupId='.$accountId.' AND ('.$whereTitle.' OR '.$whereDescr.');'); $tIds = $q->ids();
			if($tIds) $q = new Q('SELECT DISTINCT groupId FROM '.$arch.'task_assignees WHERE groupId IN ('.$tIds.') AND loginId IN ('.$logins.');'); $tasksIds[$x] = $q->groupIds();
			
			
			// chats
			$q = new Q('SELECT id FROM '.$arch.'chat_threads WHERE groupId='.$accountId.' AND ('.$whereTitle.' OR '.$whereNote.');'); $ids0 = $q->ids(list_as_array);
			$q = new Q('SELECT '.$arch.'chat_phylacteries.groupId as id FROM '.$arch.'chat_phylacteries RIGHT JOIN chat_threads on chat_threads.id = '.$arch.'chat_phylacteries.groupId WHERE chat_threads.groupId='.$accountId.' AND '.$whereBla.';'); $ids1 = $q->ids(list_as_array);
			$cIds = implode(',',array_merge($ids0, $ids1));
			
			if($cIds) $q = new Q('SELECT DISTINCT groupId FROM '.$arch.'chat_participants WHERE groupId IN ('.$cIds.') AND loginId IN ('.$logins.');'); $chatsIds[$x] = $q->groupIds();
			break;
	}
}
else {
	
		echo 'No login selected'.$nl; 
}
	
	
$perfReport->peak('::data selection complete');


	// load data
	//
	foreach($target as $x => $arch) {
		
		if($notesIds[$x]) {
			$o_dbAccess_note_details[$x] = new C_dbAccess_note_details($notesIds[$x], $arch);
			$o_dbAccess_note_addressees[$x] = new C_dbAccess_note_addressees($notesIds[$x], $arch);
			$o_dbAccess_note_visirefs[$x] = new C_dbAccess_note_visirefs($notesIds[$x], $arch);
			$o_dbAccess_note_visitors[$x] = new C_dbAccess_visitors($o_dbAccess_note_visirefs[$x]->getList('visiId'));
		}
		
		if($tasksIds[$x]) {
			$o_dbAccess_task_assignees[$x] = new C_dbAccess_task_assignees($tasksIds[$x], $arch);
			$o_dbAccess_task_descriptions[$x] = new C_dbAccess_task_descriptions($tasksIds[$x], $arch);
			$o_dbAccess_task_visirefs[$x] = new C_dbAccess_task_visirefs($tasksIds[$x], $arch);
			$o_dbAccess_task_visitors[$x] = new C_dbAccess_visitors($o_dbAccess_task_visirefs[$x]->getList('visiId'));
		}
		
		if($chatsIds[$x]) {
			$o_dbAccess_chat_participants[$x] = new C_dbAccess_chat_participants($chatsIds[$x], $arch);
			$o_dbAccess_chat_threads[$x] = new C_dbAccess_chat_threads($chatsIds[$x], $arch);
			$o_dbAccess_chat_visirefs[$x] = new C_dbAccess_chat_visirefs($chatsIds[$x], $arch);
			$o_dbAccess_chat_visitors[$x] = new C_dbAccess_visitors($o_dbAccess_chat_visirefs[$x]->getList('visiId'));
		}
	}
	
	
$perfReport->peak('::data loaded');


	// stream data
	//
	

$bank = 'plitems';

	echo '<code>';
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
			$bank = 'archives';
			echo $o_dbAccess_chat_threads[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_participants[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_visirefs[$x]->stream(false, $bank);
			echo $o_dbAccess_chat_visitors[$x]->stream(no_alias, no_bank, with_tracking);
		}
	}
	echo '</code>';

	
$perfReport->peak('::streamed');

$perfReport->dropReport();
?>