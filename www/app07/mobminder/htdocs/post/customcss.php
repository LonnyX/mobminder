<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    C U S T O M   C S S  
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();

$perfReport->peak('::session retrieved');

$id = $_POST['id'];
$isdefault = $_POST['isdefault']; // expected to be 0 or 1
if(!is_numeric($isdefault)) die('#mobErr 9980001'); 
if($isdefault!=0) if($isdefault!=1) die('#mobErr 9980002'); 


$dS_customCss = new C_dS_customCss($id, $accountId, $_POST);

$dS_formerowner = false;
if($dS_customCss->ctrlshift) {
	// let's see if ctrlshift sharing rule must be applied (only one of cssType = resa_appointment instance may get the same ctrlshift code (1,2 or 3))
	$cs = $dS_customCss->ctrlshift;
	$sql = 'select id from custom_css where groupId='.$accountId.' and id<>'.$id.' and resaClass='.class_resa_appointment.' and ctrlshift='.$cs.' limit 1;';
	echo $nl.'sql:'.$sql;
	$q = new Q($sql);
	$owner = $q->ids(list_as_string);
	echo $nl.'owner |'.$owner.'|'.$nl.$nl;
	if($owner) { // ctrlshift sharing cleanup
		$dS_formerowner = new C_dS_customCss($owner);
		$dS_formerowner->ctrlshift = 0; // remove ownership of this keyboard shortcut
		$dS_formerowner->dSsave();
	}
}


$dS_customCss->dSsave(); // keep this line under ctrlshift sharing cleanup
$id = $dS_customCss->id; // fresh new when the dataSet is <= 0

switch($dS_customCss->cssType) {
	
	case class_cssType_color: // only one default color/pattern is possible, DB field is bigint32
		if($isdefault) $isdefault = $id; else $isdefault = 0;
		switch($dS_customCss->resaClass) {
			case class_resa_appointment: 	$dS_account->defaultCssAppColor = $isdefault; break;
			case class_resa_event: 			$dS_account->defaultCssEventColor = $isdefault; break;
			case class_resource_tracking: 	$dS_account->defaultCssFcalColor = $isdefault; break;
			case class_visitor: 			$dS_account->defaultCssVisitorColor = $isdefault; break;
			case class_note: 				$dS_account->defaultCssNoteColor = $isdefault; break;
			case class_task: 				$dS_account->defaultCssTaskColor = $isdefault; break;
			case class_chat: 				$dS_account->defaultCssChatColor = $isdefault; break;
			case class_file: 				$dS_account->defaultCssFileColor = $isdefault; break;
			case class_product: 			$dS_account->defaultCssProductColor = $isdefault; break;
		}
		break;
	case class_cssType_pattern: 
		if($isdefault) $isdefault = $id; else $isdefault = 0;
		switch($dS_customCss->resaClass) {
			case class_resa_appointment: 	$dS_account->defaultCssAppPattern 	= $isdefault; break;
			case class_resa_event: 			$dS_account->defaultCssEventPattern = $isdefault; break;
			case class_resource_tracking: 	$dS_account->defaultCssFcalPattern 	= $isdefault; break;
			case class_visitor: 			$dS_account->defaultCssVisitorPattern = $isdefault; break;
			case class_note: 				$dS_account->defaultCssNotePattern 	= $isdefault; break;
			case class_task: 				$dS_account->defaultCssTaskPattern 	= $isdefault; break;
			case class_chat: 				$dS_account->defaultCssChatPattern 	= $isdefault; break;
			case class_file: 				$dS_account->defaultCssFilePattern 	= $isdefault; break;
			case class_product: 			$dS_account->defaultCssProductPattern 	= $isdefault; break;
		}
		break;
		
	case class_cssType_tag: // this is different because more than one tag may define a default set, DB field is text
		if($isdefault)
			switch($dS_customCss->resaClass) {
				case class_resa_appointment: 	$dS_account->idMoreStringRef('defaultCssAppTag'  ,$id); break;
				case class_resa_event: 			$dS_account->idMoreStringRef('defaultCssEventTag',$id); break;
				case class_resource_tracking: 	$dS_account->idMoreStringRef('defaultCssFcalTag' ,$id); break;
				case class_visitor: 			$dS_account->idMoreStringRef('defaultCssVisitorTag',$id); break;
				case class_note: 				$dS_account->idMoreStringRef('defaultCssNoteTag' ,$id); break;
				case class_task: 				$dS_account->idMoreStringRef('defaultCssTaskTag' ,$id); break;
				case class_chat: 				$dS_account->idMoreStringRef('defaultCssChatTag' ,$id); break;
				case class_file: 				$dS_account->idMoreStringRef('defaultCssFileTag' ,$id); break;
				case class_product: 			$dS_account->idMoreStringRef('defaultCssProductTag' ,$id); break;
			}
		else 
			switch($dS_customCss->resaClass) {
				case class_resa_appointment: 	$dS_account->idDropStringRef('defaultCssAppTag'  ,$id); break;
				case class_resa_event: 			$dS_account->idDropStringRef('defaultCssEventTag',$id); break;
				case class_resource_tracking: 	$dS_account->idDropStringRef('defaultCssFcalTag' ,$id); break;
				case class_visitor: 			$dS_account->idDropStringRef('defaultCssVisitorTag',$id); break;
				case class_note: 				$dS_account->idDropStringRef('defaultCssNoteTag' ,$id); break;
				case class_task: 				$dS_account->idDropStringRef('defaultCssTaskTag' ,$id); break;
				case class_chat: 				$dS_account->idDropStringRef('defaultCssChatTag' ,$id); break;
				case class_file: 				$dS_account->idDropStringRef('defaultCssFileTag' ,$id); break;
				case class_product: 			$dS_account->idDropStringRef('defaultCssProductTag' ,$id); break;
			}
			break;
}

$former = $dS_formerowner ? $dS_formerowner->stream(with_tracking).$nl : '';

echo '<code>';
echo '#C_dS_customCss'.$nl.$dS_customCss->stream(with_tracking).$nl.$former;
echo '#C_dS_group'.$nl.$dS_account->cfgversion_increment()->stream(with_tracking).$nl;
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_ccss');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>