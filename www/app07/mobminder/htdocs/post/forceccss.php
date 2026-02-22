<?php
//////////////////////////////////////////////////////////////////////
//
//     P O S T    A    C O M M A N D    T O    F O R C E  
//
//       (or remove) a CCSS on the given reservation rid
//

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$rid = $_POST['rid'];
$bank = $_POST['bank']; $bank = substr($bank,0,10); // is never supposed to be longer than 10 chars. Options are ['plitems','visiapps','catalyst']

$ccssid = 0; 
if(isset($_POST['ccssid'])) $ccssid = $_POST['ccssid'];
	else die ('errNo 99100: missing parameter.');
if(!is_numeric($ccssid)) die ('errNo 99101: bad format.');

if($ccssid&&$rid) { // both are not zero

	$dS_c = new C_dS_customCss($ccssid);
	$dS_r = new C_dS_reservation($rid);

	switch($dS_c->cssType) { // toggle in case of a second click on the sticker
		case class_cssType_color: 	if($dS_r->cssColor == $ccssid) $ccssid = 0; break; 
		case class_cssType_pattern: if($dS_r->cssPattern == $ccssid) $ccssid = 0; break; 
		case class_cssType_tag: 	if($dS_r->hastag($ccssid)) $dS_r->removetag($ccssid); else $dS_r->inserttag($ccssid);  break; // only the $ccssid should be removed, in case it stands in the ! separated string
	}
	
	if($dS_c->groupId!=$dS_r->groupId) die ('errNo 99102: bad group match.');
	if($dS_c->groupId!=$accountId) die ('errNo 99103: bad account match.');
	if($dS_c->resaClass!=class_resa_appointment) die ('errNo 99104: only for appointments.');


	switch($dS_c->cssType) {
		case class_cssType_color: 	$dS_r->cssColor = $ccssid; break; 
		case class_cssType_pattern: $dS_r->cssPattern = $ccssid; break; 
		case class_cssType_tag:  break;  // it is ready fo tags ;)
	}
	echo $nl.'Served resa id '.$dS_r->id;
	echo $nl.'    $dS_r->cssColor'.$dS_r->cssColor;
	echo $nl.'    $dS_r->cssPattern'.$dS_r->cssPattern;
	echo $nl.'    $dS_r->cssTags'.$dS_r->cssTags.$nl.$nl;

	$dS_r->dSsave();

	echo '<code>';
	echo '#C_dS_reservation#'.$bank.chr(10).$dS_r->stream(with_tracking).$nl;
	echo '</code>';
}

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_emlt');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>