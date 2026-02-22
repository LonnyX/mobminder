<?php
//////////////////////////////////////////////////////////////////////
//
//         P O S T    D A Y    N O T E 
//

require '../classes/ajax_session.php';
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved');

$noteid = $_POST['id'];
$o_dS_note_detail = new C_dS_note_detail($noteid, $accountId, $_POST);
$o_dS_note_detail->dSsave();

///// addressees by login
//
$addressees = $_POST['addressees']; $addressees = explode('!', $addressees);
$o_dbAccess_note_addressees = new C_dbAccess_note_addressees();
if($noteid>0) $o_dbAccess_note_addressees->deleteOnGroup($noteid);
foreach($addressees as $id) {
	$o_dS_ = $o_dbAccess_note_addressees->newVirtual();
	$o_dS_->loginId = $id;
}
$o_dbAccess_note_addressees->saveAll($o_dS_note_detail->id); // group addressees by note id

///// references to visitors
//
$visirefs = $_POST['visiref']; $visirefs = ($visirefs=='-') ? false : explode('!', $visirefs);
$o_dbAccess_note_visirefs = new C_dbAccess_note_visirefs();
if($noteid>0) $o_dbAccess_note_visirefs->deleteOnGroup($noteid);
if($visirefs)
	foreach($visirefs as $vid) {
		// check that this visitor is still active
		$q = new Q('select count(1) as c from visitors where id = '.$vid.' and deletorId = 0;');
		if(!$q->c()) continue; // This solves the very particular case where a doublon was removed but is still selected (and id posted) from the C_iACPICK control. Other similar scripts are protected against this. see (*exc10*)
		
		// add the visitor reference
		$o_dS_ = $o_dbAccess_note_visirefs->newVirtual();
		$o_dS_->visiId = $vid;
	}
$o_dbAccess_note_visirefs->saveAll($o_dS_note_detail->id); // group references by note id

///// stream
//
$bank = 'plitems';
echo '<code>';
echo '#C_dS_note_detail'.'#'.$bank.$nl;
echo $o_dS_note_detail->stream().$nl;
echo $o_dbAccess_note_addressees->stream(false, $bank);
echo $o_dbAccess_note_visirefs->stream(false, $bank);
echo '</code>';

$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_note');
?>