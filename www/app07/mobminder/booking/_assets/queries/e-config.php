<?php
///////////////////////////////////////////////////////////////////////////////////
//
//   Q U E R Y   A C C O U N T    C O N F I G   F O R    e - R E S E R V A T I O N
//
ob_start();

$loadcontext = 1; 
require '../classes/ajax_session.php';
require '../classes/connection.php'; 

$perfReport = new C_perfReport(); $perfReport->peak('::time needed to retrieve session and posted parameters');


// Echo the list of currently logged account
$o_dbAccess_loggedin = new C_dbAccess_logins();
$o_dbAccess_loggedin->loadOnId($loginId);
$o_dbAccess_akeys = new C_dbAccess_accesskey($loginId);
$o_dbAccess_groups = new C_dbAccess_groups();
$o_dbAccess_groups->loadOnId($dS_accesskey->accountId);

//BSP - daylight saving time
/*foreach ($o_dbAccess_groups->keyed as $id=>$group)
{ 
	$currentoffset = C_date::get_GMT0_timeOffset($group);
	$group->GMT = $currentoffset; // if we are in brussels, that is 2 hours from march to october and 1 hour during fall/winter
}*/


//BSP obfuscates all payment parameters
foreach ($o_dbAccess_groups->keyed as $id=>$group)
{
	if ($group->ePayBenefName) $group->ePayBenefName='1';
	if ($group->ePayBenefIBAN) $group->ePayBenefIBAN='1';
	if ($group->ePayBenefBIC) $group->ePayBenefBIC='1';
	if ($group->ePayconiqKey) $group->ePayconiqKey='1';
	if ($group->ePayHardPayClientId) $group->ePayHardPayClientId='1';
	if ($group->ePayHardPayClientSecret) $group->ePayHardPayClientSecret='1';
	if ($group->ePayHardPayToken) $group->ePayHardPayToken='1';
	if ($group->ePaySoftPayClientId) $group->ePaySoftPayClientId='1';
	if ($group->ePaySoftPayClientSecret) $group->ePaySoftPayClientSecret='1';
	if ($group->ePaySoftPayAppId) $group->ePaySoftPayAppId='1';
    if ($group->ePaySoftPayToken) $group->ePaySoftPayToken='1';
	if ($group->ePayComputopId) $group->ePayComputopId='1';
    if ($group->ePayComputopFish) $group->ePayComputopFish='1';
    if ($group->ePayComputopHmac) $group->ePayComputopHmac='1';

}



new Q('update logins set lastLogin = NOW() where id = '.$loginId.';');

$perfReport->peak('::context retrieved'); 

$logged = '';
	$logged.= $o_dbAccess_groups->stream(false,false,with_tracking);
	$logged.= $o_dbAccess_loggedin->stream(false,'logged',with_tracking);
	$logged.= $o_dbAccess_akeys->stream(false,'logged',with_tracking);

$stream = streamGroup($dS_accesskey, $dS_account);

echo '<code>'.$logged.$stream.'</code>';

$perfReport->peak('::streaming done');
$perfReport->dropReport();

closeconnection();

function streamGroup($dS_accesskey, $dS_account) {
	$nl = chr(10);
	$stream = '';
	$groupId = $dS_accesskey->accountId;
	
	//    V I E W 
	$o_dbAccess_resources = new C_dbAccess_resources($groupId, $dS_accesskey); 		

	$rescIds = $o_dbAccess_resources->getIdsList();
		
	//    R E S O U R C E S 
	$stream.= $o_dbAccess_resources->stream(no_alias, no_bank, with_tracking);
	
	//    C U S T O M    C S S 
	$o_dbAccess_customCss = new C_dbAccess_customCss($groupId);


	$stream.= $o_dbAccess_customCss->stream();
	
	//    W O R K    C O D E S  (keep this after Ccss streaming)

		//    E X P E R T S    F O R    W O R K   C O D E S 
		$o_dbAccess_workexperts = new C_dbAccess_workexperts();
		if($rescIds) $o_dbAccess_workexperts->loadOnView($rescIds); // no rescIds when creating a new group
		$stream.= $o_dbAccess_workexperts->stream(no_alias, no_bank, with_tracking);
		
		//    W O R K     C O D E S  (keep this after experts streaming)
		$o_dbAccess_workcodes = new C_dbAccess_workcodes();
		$o_dbAccess_workcodes->loadOnId($o_dbAccess_workexperts->getGroupIdsList());
		
		

		$stream.= $o_dbAccess_workcodes->stream(no_alias, no_bank, with_tracking);

		//    T I M E    B O X I N G    F O R    W O R K   C O D E S 
		$o_dbAccess_worktboxing = new C_dbAccess_worktboxing($o_dbAccess_workcodes->getIdsList());
		$stream.= $o_dbAccess_worktboxing->stream();
		
		
	//    C O N T E X T
	
		$archive_pivot_stamp = C_dS_system::backupPivotStamp();
		$accountId = $dS_accesskey->accountId;
		$loginId = $dS_accesskey->groupId;
		$keyId = $dS_accesskey->id;
		$gmtshift = 0;

		$dS_system = new C_dS_system();
		


	$stream .= '#C_dS_context'.$nl.$accountId.'|'.$loginId.'|'.$keyId.'|'.$archive_pivot_stamp.'|'.$gmtshift.
				'|'.$dS_system->is_Payconiq_alive.'|'.$dS_system->is_SoftPay_alive.'|'.$dS_system->is_HardPay_alive.'|'.C_dS_system::$provider_threshold.$nl;
		
	return $stream;
}

?>