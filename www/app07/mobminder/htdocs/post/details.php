<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    D I S P L A Y   D E T A I L S  
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

if(isset($_REQUEST['resourceType'])) 	if(!is_numeric($_REQUEST['resourceType'])) 	logoff('#moberr 10006f');
if(isset($_REQUEST['orientation'])) 	if(!is_numeric($_REQUEST['orientation'])) 	logoff('#moberr 10006g');
if(isset($_REQUEST['weekdays'])) 	if(!is_numeric($_REQUEST['orientation'])) 	logoff('#moberr 10006g');

if(isset($_REQUEST['viewers'])) if(!exlamationsplitinteger($_REQUEST['viewers'])) logoff('#moberr 10006h');
if(isset($_REQUEST['order'])) if(!exlamationsplitinteger($_REQUEST['order'])) logoff('#moberr 10006i');


$resourceType 	= $_POST['resourceType'];
$orientation 	= $_POST['orientation'];
$viewers 		= $_POST['viewers']; if($viewers=='-') die('No login specified!'); else $viewers = explode('!', $viewers);
$neworder 		= $_POST['order']; $neworder = explode('!', $neworder);

$Q = new Q('SELECT id FROM accesskeys WHERE accountId = '.$accountId.' AND groupId IN ('.implode(',',$viewers).') ');
$kids = $Q->ids(false);

// When the surfer has never set any details, there is no record in the table for this key
//
$o_dbAccess_keys = new C_dbAccess_accesskey();
foreach($kids as $kid) { 

	$o_dbAccess_keys->loadOnId($kid);
	$dS_accesskey = $o_dbAccess_keys->keyed[$kid];
	$dS_login = new C_dS_login($dS_accesskey->groupId);
	
	echo 'for login:'.$dS_login->lastname.', '.$dS_login->firstname.', key:'.$kid.chr(10);
	
	// display details preferences
		// clean up older details (may or not exist)
		new Q('DELETE FROM details WHERE groupId = '.$kid.' AND resourceType = '.$resourceType.'  AND displayMode = '.$orientation.';');

		// new details
		
		switch($orientation) {
			case 1: $details = $_POST['v-details']; $orverbose = 'vertical'; break;
			case 2: $details = $_POST['h-details']; $orverbose = 'horizontal'; break;
			case 3: $details = $_POST['t-details']; $orverbose = 'text list'; break;
		}
		echo chr(9).'orientation => '.$orverbose.chr(10);
		echo chr(9).'new details => V:'.$_POST['v-details'].' H:'.$_POST['h-details'].' T:'.$_POST['t-details'].chr(10);
		
		$dS_details = new C_dS_details(0, $kid);
			$dS_details->deviceType = device_type_computer;
			$dS_details->displayMode = $orientation;
			$dS_details->details = $details;
			$dS_details->resourceType = $resourceType;
		$dS_details->dSsave();
		
	
	// display order
	if($orientation==2) { // only when horizontal view is concerned
		switch($resourceType) {
			case class_bCal: $formerOrder = $dS_accesskey->bCals; break; // contains '-' when none is selected (*ak01*)
			case class_uCal: $formerOrder = $dS_accesskey->uCals; break; // contains '' when all are selected (default DB value) or when a specific display order is set
			case class_fCal: $formerOrder = $dS_accesskey->fCals; break; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order
		}
		if($formerOrder == '') { // for this login, no order was specified, and this login sees all resources
			$fitted = $neworder; 
			$q = new Q('select id from resources where resourceType = '.$resourceType.' and groupId = '.$accountId.';');
			$allrescs = $q->ids(false);
			foreach($allrescs as $x => $rid) // in case the logged buddy has a resctricted view, then the neworder does not contain all resource ids of the account, so we do complete them
				if(array_search($rid, $neworder)===false) { $fitted[] = $rid; unset($rid); }
		
		} else { // for this login, an order and a limited view was specified
			
			$formerOrder = explode('!', $formerOrder);
			
			// there sould be no more items in the key view than was before
			$fitted = Array();
			foreach($neworder as $x => $item)
				if(array_search($item, $formerOrder)!==false) { $fitted[] = $item; unset($item); }
			
			// if there is more items in the key view than in the posted order request, add the difference at the end
			foreach($formerOrder as $x => $item)
				if(array_search($item, $neworder)===false) { $fitted[] = $item; unset($item); }
		}
		$fitted = implode('!',$fitted);
		switch($resourceType) {
			case class_bCal: $dS_accesskey->bCals = $fitted; break; // see (*ak01*)
			case class_uCal: $dS_accesskey->uCals = $fitted; break;
			case class_fCal: $dS_accesskey->fCals = $fitted; break;
		}
		echo chr(9).'order for this login => '.$fitted.chr(10); 
	}
}
$o_dbAccess_keys->saveAll();

	echo '<code>'; 
	if($orientation==2) { // only when horizontal view is concerned
		foreach($o_dbAccess_keys->keyed as $kid => $key) if($kid==$keyId) echo $key->stream1(no_tracking, 'logged').chr(10); // if the logged dude changes his own data
		echo $o_dbAccess_keys->stream(false, 'config');
		// note that details dSets are not feed backed because they are adapted in real time at the client side
	} 
	echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
	echo '</code>';


$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_details');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>