<?php
//////////////////////////////////////////////////////////////////////
//
//  D E L E T E    L O G I N
//
//
//          				  	      o_dS_group
//                                     /   |   \
//                                    /    |    \
//                                   /     |     \
//                                  /      |      \
//                           o_dS_task     |    o_dS_note
//                                /        |          \
//                               /         |           \
//                              /          |            \
//                             /           |             \
//                 o_dS_assignee ---->  o_dS_Login   <--- o_dS_addressee + tasks_participant + chat_participant
//                                     |   \   \   \
//                                     /\   \   \   o_dS_logo (eresa: groups to account and referenced to login)
//                                    /  \   \   \
//                                   /    \   \   o_dS_smsTemplate & o_dS_emailTemplate (referenced when filter is on)
//                                  /      \   \
//                                 /        \   \
//                                /          \   o_dS_xmon_actions (actions counting by login and by account)
//                               /            \
//                              /              \
//                      o_dS_accesskey      o_dS_accesskey
//                            /\                      /   \
//                           /  \                    /     \
//                          /    \                  /       \
//              o_dS_detail       \         o_dS_detail      \
//                          o_dS_catalyst              o_dS_catalyst
//
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
require '../../lib_cronofy/crohelper.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$perfReport->peak('::session retrieved');

$id = $_POST['id'];
if($id<=0) die('0##Trying to delete a virtual...');


$o_dS_surferLogin = new C_dS_login($loginId); // login logged
$o_dS_login = new C_dS_login($id); // login under deletion
if($accountId != $o_dS_login->groupId) 
	if($o_dS_surferLogin->accessLevel < aLevel_seller)
		die ('0##You should delete in your own group.');

echo '1##'.$nl;
		
		

	$q = new Q('delete from task_assignees where loginId = '.$id.';');
$perfReport->peak('::done with clean up from task_assignees, '.$q->hits().' items removed');

		
	$q = new Q('delete from note_addressees where loginId = '.$id.';');
$perfReport->peak('::done with clean up from note_addressees, '.$q->hits().' items removed');


	$q = new Q('delete from chat_participants where loginId = '.$id.';');
$perfReport->peak('::done with clean up from chat_participants, '.$q->hits().' items removed');


	C_dbAccess_logos::removeLogin($id);
$perfReport->peak('::done with clean up of logos (e-resa)');



//// cronofy stuff
//

	$acckeys = new C_dbAccess_accesskey($id);
	
	$accesskeysIds = array(); 
	foreach($acckeys->keyed as $keyId => $o_dS_key) array_push($accesskeysIds,$keyId);
	
	
//// synchro logins stuff
//
if($o_dS_login->accessLevel == aLevel_synchro) {
	echo $nl.'deleting sync stuff...';
	foreach($acckeys->keyed as $keyId => $o_dS_key) { // those logins have normaly only one key
		echo ' - for key id: '.$keyId;
		$syncs_resa = new C_dbAccess_synchro_reservations(); $syncs_resa->deleteOnKey($keyId);
		$syncs_visi = new C_dbAccess_synchro_visitors(); 	 $syncs_visi->deleteOnKey($keyId);
		$syncs_rscs = new C_dbAccess_synchro_resources(); 	 $syncs_rscs->deleteOnKey($keyId);
		$syncs_ccss = new C_dbAccess_synchro_ccss();		 $syncs_ccss->deleteOnKey($keyId);
	}
	$perfReport->peak('::done with clean up of synchro stuffs');
}




//// sms and email templates filter
//
	echo $nl.'deleting references in sms and email templates...';
	
	$c = C_dbAccess_emailTemplates::removeLogin($id);
$perfReport->peak('::done with clean up from templates_email, '.$c.' items changed');
	

	$c = C_dbAccess_smsTemplates::removeLogin($id);
$perfReport->peak('::done with clean up from templates_sms, '.$c.' items changed');
	



//// access keys
//
	$keysList = $acckeys->getIdsList();
	

	$q = new Q('delete from details where groupId in ('.$id.');');
$perfReport->peak('::done with clean up from display details, '.$q->hits().' items removed');

	$q = new Q('delete from catalysts where groupId in ('.$id.');');
$perfReport->peak('::done with clean up from display catalysts, '.$q->hits().' items removed');



	$acckeys->deleteAll();
$perfReport->peak('::done with clean up of access keys');


//// login object itself
//
echo $nl.'deleting this login: #C_dS_login'.$nl.$o_dS_login->stream().$nl.$nl;
$o_dS_login->dSdelete();


echo '<code>';
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'd_login');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE


//BSP-START #################################################################################################
//create or update eresa  url
//###########################################################################################################

//if($o_dS_login->groupId == 3925)
if (true)
{
	if($o_dS_login->accessLevel == aLevel_eresa) 
	{
		require '../../lib_mobphp/waeresaurl.php';
		$eresagw = new C_WaEresaUrlGateaway();
		if (!$eresagw->deleteUrl($o_dS_login->eresaUrl))
		{
			$msg = $eresagw->lasthttpcode.'-'.$eresagw->lasterrorcode.'-'.$eresagw->lasterrormessage;
			C_dS_exception::put('delete/login.php', 'remove eresa url',$msg);
		}
	}
}
//BSP-END ##################################################################################################


//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
// created by bspoden
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//revoke all calendars linked to cronofy accesses linked to accesskeys
DebugLog('delete/login.calling cronofy.start');
RevokeCalendarsForAccessKeys($accesskeysIds,$_SESSION['loginId']);
DebugLog('delete/login.calling cronofy.end');
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
//bsp-end

?>
