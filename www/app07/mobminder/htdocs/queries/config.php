<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R Y   A C C O U N T    C O N F I G   F O R    M O B    A P P L I C A T I O N 
//
// session_start();
// require '../../lib_mobphp/dbio.php';

$loadcontext = 3; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');

C_dS_connection::current($dS_login, $dS_account, $keyId);

// send the group config back to the browser
$config = '';
switch($dS_login->accessLevel) {
	
	case aLevel_manager:
	case aLevel_supervisor:
	case aLevel_operator:
	case aLevel_eresa:
		$config = streamGroup($dS_accesskey, $dS_account);
		$accessLevel = aLevel_manager;
		break;
	case aLevel_admin:
	case aLevel_seller:
		$config = streamGroup($dS_accesskey, $dS_account, true /* no view */ );
		$accessLevel = $dS_login->accessLevel;
		break;
	default:
		die('unrecognized surfer type <command>logoff</command>');
}


// Stream the groups and access keys that belong to login asking for the config
//
$o_dbAccess_loggedin = new C_dbAccess_logins();
$o_dbAccess_loggedin->loadOnId($_SESSION['loggedIn']);
$o_dbAccess_loggedin->hidecreds($keyId); // security, this bank DOES support creds management

	$perfReport->peak('::o_dbAccess_loggedin');
	

$o_dbAccess_akeys = new C_dbAccess_accesskey($_SESSION['loggedIn']);
	$grantedAccounts = $o_dbAccess_akeys->getList('accountId');
	
	$perfReport->peak('::o_dbAccess_akeys');	
	
	
$o_dbAccess_groups = new C_dbAccess_groups();
$o_dbAccess_groups->loadOnId($grantedAccounts);

	$perfReport->peak('::o_dbAccess_groups');
	

$logged = '';
	$logged.= $o_dbAccess_groups->stream(false,false,with_tracking);
	$logged.= $o_dbAccess_loggedin->stream(false,'logged',with_tracking);
	$logged.= $o_dbAccess_akeys->stream(false,'logged',with_tracking);

	$perfReport->peak('::o_logged in streamed');
	
	
	
// Stream the groups and access keys that belong to login asking for the config
//
$loggable = ''; // they go to the 'config' bank at client side

	$o_dbAccess_logins = new C_dbAccess_logins(); // logins having access to this account are visible on the account preferences
	$o_dbAccess_logins->loadOnAccessLevel($accessLevel, $grantedLoginIds, '<'); // loads any with equal or lower access rights 
	$o_dbAccess_logins->hidecreds($keyId); // security, for editing purpose the encrypted versions will be later sent through an ajax call to /queries/taycan.php
	$loggable.= $o_dbAccess_logins->stream(false,'config',with_tracking); // (=> i.e. group responsibles can not see that some sellers and mobminder admins have access to their account)
	
	$perfReport->peak('::o_dbAccess_logins (loggable)');
	
	
	// Stream accesskeys having access to this account, but still do not send accesskeys of higher accessLevel than the logged login level. 
	if($grantedAccounts) {
		$q = new Q('SELECT accesskeys.id FROM accesskeys JOIN logins ON accesskeys.groupId = logins.id WHERE logins.accessLevel <= '.$accessLevel.' AND accountId IN ('.$grantedAccounts.') AND accesskeys.groupId IN ('.$grantedLoginIds.');');
		$akeys_logged = new C_dbAccess_accesskey(); // all the keys belonging to surfers having access to the current account, and relating to opened accounts
		$akeys_logged->loadOnId($q->ids());
		$loggable.= $akeys_logged->stream(false,'config');
		
		$perfReport->peak('::akeys_logged (loggable)');
	}
	
	
	
// Stream the login contact data of account managers holding a key to this config
//
$amanagers = '';
	$q = new Q('select logins.id from logins join accesskeys on accesskeys.groupId = logins.id where accesskeys.accountId = '.$accountId.' and accessLevel in ('.aLevel_seller.', '.aLevel_admin.');');
	$amsids = $q->ids();
	
	$dbAccess_amanagers = new C_dbAccess_logins();
	$dbAccess_amanagers->loadOnId($amsids)->hidecreds(); // this bank does not support creds management and the alevel justifies thtat we clean up the creds fields before streaming

	$perfReport->peak('::dbAccess_amanagers');


	$dbAccess_amkeys = new C_dbAccess_accesskey($amsids);

	$perfReport->peak('::dbAccess_amkeys');	
	
	$amanagers.= $dbAccess_amanagers->stream(false,'amanagers',with_tracking);
	$amanagers.= $dbAccess_amkeys->stream(false,'amanagers',with_tracking);



// Stream a non DB object that gives running context indications
//
		$accountId = $dS_accesskey->accountId;
		$loginId = $dS_accesskey->groupId;
		$keyId = $dS_accesskey->id;
		$archive_pivot_stamp = C_dS_system::backupPivotStamp();
		$gmtshift = C_date::getTimeShift($dS_account, $dS_login);
	$context = '#C_dS_context'.$nl.$accountId.'|'.$loginId.'|'.$keyId.'|'.$archive_pivot_stamp.'|'.$gmtshift.$nl;

	$dbAccess_logos = new C_dbAccess_logos($accountId);
	$loggable.= $dbAccess_logos->stream(false);
	
		$perfReport->peak('::dbAccess_logos');


// Echo stream to client
//
echo '<code>'.$logged.$loggable.$amanagers.$config.$context.'</code>';

$perfReport->peak('::streaming done');
$perfReport->dropReport();



// Streaming the currently selected group 
//

function streamGroup($dS_accesskey, $dS_account, $noview = false) { // K E E P  the  S E Q U E N C E   O R D E R  of streaming  !!
	
	global $perfReport;
	$stream = '';
	$groupId = $dS_accesskey->accountId;

// SURFER	
	
	//    D E T A I L S
	$o_dbAccess_details = new C_dbAccess_details($dS_accesskey->id, device_type_computer); // are grouped by key Id // see (*dt01*)
	$stream.= $o_dbAccess_details->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_details done');
					
	
	//    C A T A L Y S T S   ( table display preferences, by key )
	$o_dbAccess_catalysts = new C_dbAccess_catalysts($dS_accesskey->id); // are grouped by key Id
	$stream.= $o_dbAccess_catalysts->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_catalysts done');


// ACCOUNT
	
	//    C O N T R A C T S 
	// $o_dbAccess_contracts = new C_dbAccess_contracts($groupId);
	// $stream.= $o_dbAccess_contracts->stream();



	//    G U I D E L I N E S  
	$o_dbAccess_guidelines = new C_dbAccess_guidelines($groupId);
	$stream.= $o_dbAccess_guidelines->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_guidelines done');
	
	//    V I E W 
	// $o_dbAccess_resources = new C_dbAccess_resources($groupId, $noview ? false : $dS_accesskey);
	$o_dbAccess_resources = new C_dbAccess_resources($groupId, $dS_accesskey);
	$rescIds = $o_dbAccess_resources->getIdsList();
	
					$perfReport->peak('streamGroup::o_dbAccess_resources done');

	
	// HOURLIES
		
		//    H O U R L I E S    U S E R S
		$o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers($rescIds); // only hourlies used in the given view
					$perfReport->peak('streamGroup::o_dbAccess_hourliesusers done');
					
		$hourliesIds = $o_dbAccess_hourliesusers->getHourliesIds();
	
		
		//    H O U R L I E S
		$o_dbAccess_hourlies = new C_dbAccess_hourlies();
		$o_dbAccess_hourlies->loadOnId($hourliesIds);
	
					$perfReport->peak('streamGroup::o_dbAccess_hourlies done');
					
		
		//    T I M E    B O X I N G     C A T E G O R I E S 
		$o_dbAccess_tboxings = new C_dbAccess_tboxings($groupId); // all are transmitted because they must be used at will in hourly setting
	
					$perfReport->peak('streamGroup::o_dbAccess_tboxings done');
					

		//    T I M E   B O X E S
		$o_dbAccess_timeboxes = new C_dbAccess_timeboxes($hourliesIds);
	
					$perfReport->peak('streamGroup::o_dbAccess_timeboxes done');
					
					

		//    S H A D O W S 
		$o_dbAccess_shadows = new C_dbAccess_shadows($hourliesIds);
		
					$perfReport->peak('streamGroup::o_dbAccess_shadows done');
					
		
		$stream.= $o_dbAccess_tboxings->stream(no_alias, no_bank, with_tracking); 	// keep this sequence heading the stream
		$stream.= $o_dbAccess_shadows->stream(); 	// keep this sequence heading the stream
		$stream.= $o_dbAccess_timeboxes->stream(); 	// keep this sequence heading the stream
		$stream.= $o_dbAccess_hourlies->stream(no_alias, no_bank, with_tracking);
		$stream.= $o_dbAccess_hourliesusers->stream();
		
	
					$perfReport->peak('streamGroup::stream hourlies done');
					
		
	
	//    R E S O U R C E S 
	$stream.= $o_dbAccess_resources->stream(no_alias, no_bank, with_tracking);
	
					$perfReport->peak('streamGroup::streaming resources done');
					
	
	
	//    C U S T O M    C S S 
	$o_dbAccess_customCss = new C_dbAccess_customCss($groupId);
	$stream.= $o_dbAccess_customCss->stream(no_alias, no_bank, with_tracking);
	
					$perfReport->peak('streamGroup::o_dbAccess_customCss done');
					
					

	//    E M A I L ,   S M S ,  and  N O T I F I C A T I O N S    T E M P L A T E S 
	$o_dbAccess_emailTemplates = new C_dbAccess_emailTemplates($groupId);
	$stream.= $o_dbAccess_emailTemplates->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_emailTemplates done');
					
	$o_dbAccess_smsTemplates = new C_dbAccess_smsTemplates($groupId);
	$stream.= $o_dbAccess_smsTemplates->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_smsTemplates done');
					
	$o_dbAccess_notifTemplates = new C_dbAccess_notifTemplates($groupId);
	$stream.= $o_dbAccess_notifTemplates->stream();
	
					$perfReport->peak('streamGroup::C_dbAccess_notifTemplates done');
					
					
	
	//    W O R K    C O D E S  (keep this after Ccss streaming)

		//    E X P E R T S    F O R    W O R K   C O D E S 
		$o_dbAccess_workexperts = new C_dbAccess_workexperts();
		if($rescIds) $o_dbAccess_workexperts->loadOnView($rescIds); // no rescIds when creating a new group
		$stream.= $o_dbAccess_workexperts->stream(no_alias, no_bank, with_tracking);
		
	
					$perfReport->peak('streamGroup::o_dbAccess_workexperts done');
					
					
		
		//    W O R K     C O D E S  (keep this after experts streaming)
		$o_dbAccess_workcodes = new C_dbAccess_workcodes();
		$o_dbAccess_workcodes->loadOnId($o_dbAccess_workexperts->getGroupIdsList());
	
					$perfReport->peak('streamGroup::o_dbAccess_workcodes done');
					
					

		//    T I M E    B O X I N G    F O R    W O R K   C O D E S 
		$o_dbAccess_worktboxing = new C_dbAccess_worktboxing($o_dbAccess_workcodes->getIdsList());
		$stream.= $o_dbAccess_worktboxing->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_worktboxing done');
					
					
		
		$stream.= $o_dbAccess_workcodes->stream(no_alias, no_bank, with_tracking);
					
					
	
	
	
	//    P R O D U C T S   (keep this after Ccss streaming)

		//    E X P E R T S    F O R    P R O D U C T S
		$o_dbAccess_productexperts = new C_dbAccess_productexperts();
		if($rescIds) $o_dbAccess_productexperts->loadOnView($rescIds); // no rescIds when creating a new group
		$stream.= $o_dbAccess_productexperts->stream(no_alias, no_bank, with_tracking);
		
					$perfReport->peak('streamGroup::o_dbAccess_productexperts done');
					
					
		//    P R O D U C T S  (keep this after experts streaming)
		$o_dbAccess_products = new C_dbAccess_products();
		$o_dbAccess_products->loadOnId($o_dbAccess_productexperts->getGroupIdsList());
	
					$perfReport->peak('streamGroup::o_dbAccess_products done');
					
					
		$stream.= $o_dbAccess_products->stream(no_alias, no_bank, with_tracking);
		
		
		
		
	//    S Y N C H R O    S T U F F 
	$o_dbAccess_synchro_resources = new C_dbAccess_synchro_resources(); 
	$o_dbAccess_synchro_resources->loadOnGroup($groupId);
	$stream.= $o_dbAccess_synchro_resources->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_synchro_resources done');
					
					
	
	$o_dbAccess_synchro_ccss = new C_dbAccess_synchro_ccss(); 
	$o_dbAccess_synchro_ccss->loadOnGroup($groupId);
	$stream.= $o_dbAccess_synchro_ccss->stream();
	
					$perfReport->peak('streamGroup::o_dbAccess_synchro_ccss done');
	
		
	return $stream;
}

C_dS_connection::poke($perfReport, 'q_config');
?>