<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    R E S O U R C E  
//

ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');


$id = $_POST['id'];
	
	$dS_resource = new C_dS_resource($id, $accountId, $_POST);
$dS_resource->dSsave();

	$rid = $dS_resource->id;
	$type = $dS_resource->resourceType; // type of the posted resource is [class_bCal, class_uCal, class_fCal] // see resource types (*rt01*)

if($id<=0) { // A new resource, push it in the current view

	echo 'new resource, fixing up view for maker login'.chr(10);
	$dS_accesskey->addToView($type, $rid)->dSsave(); // this is the dS_accesskey of the currently logged user
	
	echo 'fixing up views for other sellers and admins logins'.chr(10);
	// any delegate having access to this account should get the new resource in their view (unless he got it yet here above):
	$q = new Q('SELECT accesskeys.id FROM accesskeys JOIN logins ON accesskeys.groupId = logins.id WHERE accountId = '.$accountId.' AND accessLevel >= '.aLevel_seller.' AND logins.id <> '.$loginId.';');
	$admin_keys = new C_dbAccess_accesskey();
	$admin_keys->loadOnId($q->ids());
	foreach($admin_keys->keyed as $kid => $dSkey) $dSkey->addToView($type, $rid)->dSsave();
	
}

$viewallocation = ($dS_login->accessLevel >= aLevel_seller);
if($viewallocation) {  // sellers and admins have a tab for view allowance on new / existing resources, see (*va01*)
	
	$viewfor = $_POST['viewfor']; // '-' if none selected and '4589!4578!4365!4277' when some logins are selected
	
	if($viewfor!=='-') { // only a seller/admin has access to the allocation tab in the resource modal, and he is auto /and mandatory checked 
		
		// echo $nl.'The following logins should see this resource: '.$viewfor;
		$viewfor = explode('!',$viewfor); // is a list of login ids that should see this resource (to be set in the accesskeys bCals/uCals/fCals)
		$comaviewfor = implode(',',$viewfor);
		
		// make sure that the posted resource is included in the view for checked logins
		$sql = 'select accesskeys.id as id from accesskeys join logins on logins.id = accesskeys.groupId
				where logins.accessLevel in ('.aLevel_operator.','.aLevel_supervisor.','.aLevel_manager.')
				and accesskeys.accountId = '.$accountId.' and logins.id in ('.$comaviewfor.');';
				
		// echo $nl.$sql.$nl;
		$q = new Q($sql); // collect only accesskeys with specific accessLevel and for which view credentials are granted
		
		$views_increase_keys = new C_dbAccess_accesskey();
		$views_increase_keys->loadOnId($q->ids());	
		
		foreach($views_increase_keys->keyed as $kid => $dSkey)
			$dSkey->addToView($type, $rid)->dSsave(); // addToView() is designed in such a way that if already granted, the rid is not doubled in the dS_accesskey::bufCal member

		// make sure that the posted resource is removed from view for not checked logins
		$sql = 'select accesskeys.id as id from accesskeys join logins on logins.id = accesskeys.groupId
				where logins.accessLevel in ('.aLevel_operator.','.aLevel_supervisor.','.aLevel_manager.')
				and accesskeys.accountId = '.$accountId.' and logins.id not in ('.$comaviewfor.');';
				
		// echo $nl.$sql.$nl;
		$q = new Q($sql); // collect only accesskeys with specific accessLevel and for which view credentials are granted
		$xids = $q->ids();
		// echo $nl.'accesskeys loosing view on this resource: '.$xids;
		
		$rscsoftype = new C_dbAccess_resources();
		$rscsoftype->loadAllOfType($accountId, $type); // reduce the scope to the resources of the right resourceType
		$views_decrease_keys = new C_dbAccess_accesskey();
		$views_decrease_keys->loadOnId($xids);				
		foreach($views_decrease_keys->keyed as $kid => $dSkey)
			$dSkey->removeFromView($type, $rid, $rscsoftype)->dSsave(); // $account_resources from ajax_session.php with loadcontext level 2
	}
	echo $nl;
}


// report to client
//
echo $nl;
echo '<code>';
echo '#C_dS_resource'.chr(10).$dS_resource->stream(with_tracking).chr(10);
if($id<=0) {
	echo '#C_dS_accesskey#logged'.chr(10).$dS_accesskey->stream().chr(10);
	echo '#C_dS_accesskey#config'.chr(10).$dS_accesskey->stream().chr(10);
	if($admin_keys->count()) echo $admin_keys->stream(false,'config');
}
if($viewallocation) { 
	echo $views_increase_keys->stream(false,'config');
	echo $views_decrease_keys->stream(false,'config');
}
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_rsc');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>