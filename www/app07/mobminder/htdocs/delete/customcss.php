<?php
//////////////////////////////////////////////////////////////////////
//
//    D E L E T E     C U S T O M     C S S  
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');


$id 		= $_POST['id'];
$resaClass 	= $_POST['resaClass'];
$cssType 	= $_POST['cssType'];

if($id<=0) die('Trying to delete a virtual...');

$o_dS_customCss = new C_dS_customCss($id);
if($accountId != $o_dS_customCss->groupId) die ('You should delete in your own group.');
echo $nl.'object under deletion:'.$nl.'C_dS_customCss:'.$nl.$o_dS_customCss->stream();



/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// remove references from reservations, visitors, chats, notes, tasks
//

$logins = false;
$workcodes = false;
$products = false;

switch($cssType) {
	case class_cssType_color: 	$type = 'cssColor'; 	break;
	case class_cssType_pattern: $type = 'cssPattern'; 	break;
	case class_cssType_tag: 	$type = 'cssTags'; 		break;
}

function tag_eviction($table, $tagId, $accountId) { // Only for tags. There are multiple tags in one field, like 3145!5468!1212

	// in tables workcodes and products, the field containing ccss tags ids is named 'tags' instead of 'cssTags' in all other object...
	// so we need that little trick:
	$tagfieldname = 'cssTags';
	switch($table) {
		case 'workcodes':
		case 'products':	$tagfieldname = 'tags'; break;
	}

	$q = new Q('SELECT id FROM '.$table.' WHERE '.$table.'.groupId = '.$accountId.' and '.$tagfieldname.' LIKE "%'.$tagId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
	$ids = $q->ids();
	switch($table) {
		case 'files': 			$dSets = new C_dbAccess_files(); break;
		
		case 'visitors': 				$dSets = new C_dbAccess_visitors(); break;
		
		case 'reservations': 			$dSets = new C_dbAccess_reservations(); break;
		case 'archive_reservations': 	$dSets = new C_dbAccess_reservations('archive_'); break;
		
		case 'note_details': 			$dSets = new C_dbAccess_note_details(); break;
		case 'archive_note_details':	$dSets = new C_dbAccess_note_details('archive_'); break;
		
		case 'task_descriptions': 		$dSets = new C_dbAccess_task_descriptions(); break;
		case 'archive_task_descriptions': $dSets = new C_dbAccess_task_descriptions('archive_'); break;
		
		case 'chat_threads': 			$dSets = new C_dbAccess_chat_threads(); break;
		case 'archive_chat_threads': 	$dSets = new C_dbAccess_chat_threads('archive_'); break;
		
		case 'workcodes': 	$dSets = new C_dbAccess_workcodes(); break;
		case 'products': 	$dSets = new C_dbAccess_products(); break;
		
	}
	$c = 0;
	if($ids) {
		$dSets->loadOnId($ids);
		foreach($dSets->keyed as $dSid => $o_dS) { $o_dS->idDropStringRef($tagfieldname, $tagId); $c++; } // idDropStringRef is defined in dbio.php in class C_dbID, it is very available to all objects in our model
		$dSets->saveAll(keep_groupId, no_record); // see (*cc01*)
	}
	global $nl, $perfReport;
	echo $nl.$c.' reference to Tag id '.$tagId.' have been removed from table: '.$table.$nl;
	$perfReport->peak('::tag '.$tagId.' removed from '.$table);
	return $dSets;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////
//


if($type == 'cssTags') { // tags
	
	$tagId = $id;
	switch($resaClass) {
		case class_visitor:
			tag_eviction('visitors', $tagId, $accountId);
			break;
		
		case class_resa_appointment: // clean up reservations and workcodes tables
		case class_resa_event: 
			
			tag_eviction('reservations', $tagId, $accountId);
			tag_eviction('archive_reservations', $tagId, $accountId);
			
			$workcodes = tag_eviction('workcodes', $tagId, $accountId);
			break;
		
		case class_task:
			tag_eviction('task_descriptions', $tagId, $accountId);
			tag_eviction('archive_task_descriptions', $tagId, $accountId);
			break;
		case class_note:
			tag_eviction('note_details', $tagId, $accountId); 
			tag_eviction('archive_note_details', $tagId, $accountId);
			break;
		case class_chat:
			tag_eviction('chat_threads', $tagId, $accountId); 
			tag_eviction('archive_chat_threads', $tagId, $accountId);
			break;
		case class_file:
			tag_eviction('files', $tagId, $accountId); break;
		case class_product:
			$products = tag_eviction('products', $tagId, $accountId); break;
	}

} else { // colors and patterns

	switch($resaClass) {
		case class_visitor: 
			new Q('UPDATE visitors SET '.$type.' = 0 WHERE visitors.groupId = '.$accountId.' and '.$type.' = '.$id.';');
				$perfReport->peak('::color/pattern '.$id.' removed from table: visitors');
			
			$q = new Q('select id from logins where logins.groupId = '.$accountId.' and eresaBlacklist = '.$id.';');
			if($lids = $q->ids()) { // some eresa logins are using this color as a blacklist indication
				new Q('UPDATE logins SET eresaBlacklist = 0 WHERE logins.id IN('.$lids.');');
				$logins = new C_dbAccess_logins($lids); // this makes a change in a config login so we need to feed this back to client side
			}
				
				$perfReport->peak('::color/pattern '.$id.' removed from table: logins');
			 break;
		
		case class_resa_appointment: // clean up reservations and workcodes tables
		case class_resa_event: 
		
			new Q('UPDATE reservations SET '.$type.' = 0 WHERE reservations.groupId = '.$accountId.' and '.$type.' = '.$id.';');
				$perfReport->peak('::color/pattern '.$id.' removed from table: reservations');
				
			new Q('UPDATE archive_reservations SET '.$type.' = 0 WHERE archive_reservations.groupId = '.$accountId.' and '.$type.' = '.$id.';');
				$perfReport->peak('::color/pattern '.$id.' removed from table: archive_reservations');
				
			new Q('UPDATE workcodes SET '.$type.' = 0 WHERE workcodes.groupId = '.$accountId.' and '.$type.' = '.$id.';');
				$perfReport->peak('::color/pattern '.$id.' removed from table: workcodes');
			$workcodes = new C_dbAccess_workcodes($accountId); // this makes potential changes to workcodes so we need to feed this back to client side, see (*cs01*)
			
			
			break;
		
		case class_task:
			switch($cssType) {
				case class_cssType_color:
					new Q('UPDATE task_descriptions SET '.$type.' = 0 WHERE task_descriptions.groupId = '.$accountId.' and '.$type.' = '.$id.';');
					new Q('UPDATE archive_task_descriptions SET '.$type.' = 0 WHERE archive_task_descriptions.groupId = '.$accountId.' and '.$type.' = '.$id.';'); 
				
				break;
				case class_cssType_pattern:
					new Q('UPDATE task_assignees JOIN task_descriptions on task_descriptions.id = task_assignees.groupId SET '.$type.' = 0 WHERE task_descriptions.groupId = '.$accountId.' and '.$type.' = '.$id.';');
					new Q('UPDATE archive_task_assignees JOIN archive_task_descriptions on archive_task_descriptions.id = archive_task_assignees.groupId SET '.$type.' = 0 WHERE archive_task_descriptions.groupId = '.$accountId.' and '.$type.' = '.$id.';');
				break;
			}
				$perfReport->peak('::color/pattern '.$id.' removed from table tasks');
			break;
			
		case class_note: 
			new Q('UPDATE note_details SET '.$type.' = 0 WHERE note_details.groupId = '.$accountId.' and '.$type.' = '.$id.';'); 
			new Q('UPDATE archive_note_details SET '.$type.' = 0 WHERE archive_note_details.groupId = '.$accountId.' and '.$type.' = '.$id.';'); 
				$perfReport->peak('::color/pattern '.$id.' removed from table: note_details');
			break;
		case class_chat: 
			new Q('UPDATE chat_threads SET '.$type.' = 0 WHERE chat_threads.groupId = '.$accountId.' and '.$type.' = '.$id.';'); 
			new Q('UPDATE archive_chat_threads SET '.$type.' = 0 WHERE archive_chat_threads.groupId = '.$accountId.' and '.$type.' = '.$id.';'); 
				$perfReport->peak('::color/pattern '.$id.' removed from table: chat_threads');
			break;
		case class_file: 
			new Q('UPDATE files SET '.$type.' = 0 WHERE files.groupId = '.$accountId.' and '.$type.' = '.$id.';');	
				$perfReport->peak('::color/pattern '.$id.' removed from table: files');
			break;
		case class_product: 
			new Q('UPDATE products SET '.$type.' = 0 WHERE products.groupId = '.$accountId.' and '.$type.' = '.$id.';');	
				$perfReport->peak('::color/pattern '.$id.' removed from table: products');
			break;
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// remove references from group default values (*21*)
//

$field = 'defaultCss';
switch($resaClass) {
	case class_resa_appointment: $field .= 'App'; break;
	case class_resa_event: $field .= 'Event'; break;
	case class_resource_tracking: $field .= 'Fcal'; break;
	case class_visitor: $field .= 'Visitor'; break;
	case class_note: $field .= 'Note'; break;
	case class_task: $field .= 'Task'; break;
	case class_chat: $field .= 'Chat'; break;
	case class_file: $field .= 'File'; break;
	case class_product: $field .= 'Product'; break;
}
switch($cssType) {
	case class_cssType_color: $field .= 'Color'; break;
	case class_cssType_pattern: $field .= 'Pattern'; break;
	case class_cssType_tag: $field .= 'Tag'; break;
}

if($cssType == class_cssType_tag) {
	$dS_account->idDropStringRef($field, $tagId);
	new Q('UPDATE groups SET '.$field.' = "'.$dS_account->{$field}.'" WHERE id = '.$accountId.';');
} else {
	new Q('UPDATE groups SET '.$field.' = 0 WHERE '.$field.' = '.$id.' AND id = '.$accountId.';');
}

	$perfReport->peak('::field '.$field.' cleaned up:'.$id.' removed from account: '.$accountId);
	
	

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// delete from ccss synchro table
//
	new Q('delete FROM synchro_ccss WHERE localId = "'.$id.'";');
	$perfReport->peak('::removed from table: synchro_ccss');



/////////////////////////////////////////////////////////////////////////////////////////////////////
//
// delete dS_customCss and feedback to client
//

$o_dS_customCss->dSdelete();

echo $nl.$nl;


if($logins)
	$logins = $logins->stream(false,'config',with_tracking); else $logins = '';

if($workcodes)
	$workcodes = $workcodes->stream(false,no_bank,with_tracking); else $workcodes = '';

if($products)
	$products = $products->stream(false,no_bank,with_tracking); else $products = '';

echo '<code>';
echo $logins;
echo $workcodes; // modified datasets for workcodes must be provided, see (*cs01*), in orde to update the display of their correct bullets
echo $products; // the intention is to refresh the client side with any object that was impacted by this customCss removal.
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_ccss');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE

?>