<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    L O G I N  
//
//
//          				  	      o_dS_group      <= except for delegates and admins who have a login that does not group to an account!
//                                     /   |   \
//                                    /    |    \
//                                   /     |     \
//                                  /      |      \
//                           o_dS_task     |    o_dS_note
//                                /        |          \
//                               /         |           \
//                              /          |            \
//                             /           |             \
//                 o_dS_assignee ---->  o_dS_Login <--- o_dS_addressee 
//                                         /\
//                                        /  \
//                                       /    \
//                         o_dS_accesskey      o_dS_accesskey
//                               /\                      /   \
//                              /  \                    /     \
//                             /    \                  /       \
//                 o_dS_detail       \         o_dS_detail      \
//                             o_dS_catalyst              o_dS_catalyst
//
//
ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

// login stuff (that is the easy part)
//
$id = $_POST['id']; // posted login id (can be any access level, belonging or not belonging the group)
$o_dS_login = new C_dS_login($id, $accountId, $_POST); // the login posted is may be not the logged login
$o_dS_login->mobile = checkMobileFormat($o_dS_login->mobile, $dS_account->phoneRegion);
$o_dS_login->dSsave(); // C_dS_login has an overloaded form for dSsave()

	$new = ($id>0) ? 'existing login' : 'new login';
echo $nl.'STEP 1: Login data saved, id:'.$o_dS_login->id.'('.$new.')';




//////////// access key
//
//
echo $nl.'STEP 2: Access keys:'.$nl;
if($id<=0) {
	// new login - needs a first access key
	//
	$o_dS_accesskey = new C_dS_accesskey(0, $o_dS_login->id);
	$o_dS_accesskey->accountId = $accountId;
	$o_dS_accesskey->dSsave();
	echo $nl.'     a new access key has been made.'.$nl;
} else {
	// existing login - get the access key for this account
	$q = new Q('SELECT id FROM accesskeys WHERE accountId = '.$accountId.' AND groupId = '.$o_dS_login->id.' limit 1;'); // that should never be more than one
	if($q->ids()) // if this login has just been retrieved access to the groupId, there is no key found
		$o_dS_accesskey = new C_dS_accesskey($q->ids()); // that is only one key (one key by account for a given login)
	
	echo $nl.'     existing access key is used.'.$nl;
}




//////////// synchro logins / sync objects setting
//
//
if($o_dS_login->accessLevel == aLevel_synchro) {
	
	// resources
	$a = Array();
	$a[class_bCal] = $_POST['sbCals']; // is e.g "8329!CHR|8316!JPD|8318!JIM|8317!OLI|8468!SAM|8319!VDS"
	$a[class_uCal] = $_POST['suCals']; // or is, when no resource of this type exit: "x"
	$a[class_fCal] = $_POST['sfCals'];
	$syncs_rscs = new C_dbAccess_synchro_resources();
	$syncs_rscs->deleteOnKey($o_dS_accesskey->id);
	foreach($a as $rtype => $s) {
		if($s=='x') continue; // (*sc01*)
		$ridspairs = explode('|', $s);
		if(!count($ridspairs)) continue;
		foreach($ridspairs as $ss) {
			$d = explode('!', $ss);
			$rid = $d[0]; $remoteId = $d[1]; if(!$remoteId) continue;
			$o_dS_sync = $syncs_rscs->newVirtual();
			$o_dS_sync->skeyId = $o_dS_accesskey->id;
			$o_dS_sync->localId = $rid;
			$o_dS_sync->remoteId = $remoteId;
			$o_dS_sync->dSsave($accountId);
		}
	}
	
	// custom css
	$c = Array();
	$c[class_resa_appointment] = $_POST['scss_resa']; // is e.g "8329!color1|8316!color2|8318!colorA|8317!colorB|8468!colorC|8319!colorV"
	$c[class_resa_event] = $_POST['scss_event']; // or is, when no resource of this type exit: "x"
	$c[class_visitor] = $_POST['scss_visi'];
	$syncs_ccss = new C_dbAccess_synchro_ccss();
	$syncs_ccss->deleteOnKey($o_dS_accesskey->id);
	foreach($c as $ctype => $s) {
		if($s=='x') continue; // (*sc02*)
		$csspairs = explode('|', $s);
		if(!count($csspairs)) continue;
		foreach($csspairs as $ss) {
			$d = explode('!', $ss);
			$ccssid = $d[0]; $remoteId = $d[1]; if(!$remoteId) continue;
			$o_dS_sync = $syncs_ccss->newVirtual();
			$o_dS_sync->skeyId = $o_dS_accesskey->id;
			$o_dS_sync->localId = $ccssid;
			$o_dS_sync->remoteId = $remoteId;
			$o_dS_sync->dSsave($accountId);
		}
	}
}



//////////// view setting
//
//

echo $nl.'STEP 3: View setting:'.$nl;

if($o_dS_login->accessLevel >= aLevel_seller) { // then this login should always see all resources
	$_POST['bCals'] = '';
	$_POST['uCals'] = '';
	$_POST['fCals'] = '';
	echo 'NO VIEW LIMITATION IS ALLOWED FOR Sellers OR Admin LOGINS'.$nl;
}
$o_dS_accesskey->reshapeViewOrder(class_bCal, $_POST['bCals']); 
$o_dS_accesskey->reshapeViewOrder(class_uCal, $_POST['uCals']);
$o_dS_accesskey->reshapeViewOrder(class_fCal, $_POST['fCals']);


echo $nl.'STEP 4: Recording notification preferences:'.$nl;
$o_dS_accesskey->watchover = $_POST['watchover'];



echo $nl.'STEP Final: Streaming'.$nl;

$o_dS_accesskey->dSsave();
$o_dS_login->hidecreds($keyId);


// Stream the access keys that belong to login being modified in scope of groups visible to this login configuration (*1*)
//
	$loggable = '#C_dS_login#config'.$nl.$o_dS_login->stream(with_tracking).$nl;

	$o_dbAccess_akeys = new C_dbAccess_accesskey($_SESSION['loggedIn']);
	$grantedAccounts = $o_dbAccess_akeys->getList('accountId'); // this is what we mean with "login configuration" (*1*)
	
	$q = new Q('SELECT id FROM accesskeys WHERE accountId IN ('.$grantedAccounts.') AND groupId = '.$o_dS_login->id.';');
	$akeys_logged = new C_dbAccess_accesskey(); // all the keys belonging to surfers having access to the current account, and relating to opened accounts
	$akeys_logged->loadOnId($q->ids());
	$loggable.= $akeys_logged->stream(false,'config',with_tracking);

// stream
echo '<code>';
echo $loggable;

// Check if this login is currently logged
$loggedIn = explode(',', $_SESSION['loggedIn']);
$yet = in_array($id, $loggedIn);	

if($yet) { // Modification of the surfer's own accesses

	// the client side code makes it such that the surfer cannot remove the key he is connected with
	// still he can remove other keys from his login
	// We stream the remaining keys for this login, in the 'logged' bank
	$logged = '';
	$o_dbAccess_akeys = new C_dbAccess_accesskey($o_dS_login->id);
	echo '#C_dS_login#logged'.$nl.$o_dS_login->stream(with_tracking).$nl;
	echo $o_dbAccess_akeys->stream(no_alias,'logged',with_tracking);
}

if($o_dS_login->accessLevel == aLevel_synchro) {
	echo $syncs_rscs->stream(false);
	echo $syncs_ccss->stream(false);
}
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>'.$nl;


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_login');

closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE

//BSP-START #################################################################################################
//create or update eresa  url
//###########################################################################################################

//if ($o_dS_login->groupId == 3925)
if (true)
{
	if($o_dS_login->accessLevel == aLevel_eresa) 
	{
		require '../../lib_mobphp/waeresaurl.php';
		$eresagw = new C_WaEresaUrlGateaway();
		if (!$eresagw->createUrl($o_dS_login->eresaUrl,$o_dS_login->eresaIdentMode))
		{
			$msg = $eresagw->lasthttpcode.'-'.$eresagw->lasterrorcode.'-'.$eresagw->lasterrormessage;
			C_dS_exception::put('post/login.php', 'add eresa url',$msg);
		}
	}
}
//BSP-END ###################################################################################################



?>
