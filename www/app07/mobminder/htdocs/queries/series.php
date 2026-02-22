<?php
///////////////////////////////////////////////////////////////////////////////////
//
//        Q U E R Y    A    L I S T     O F     S E R I E (s)  
//
//	For a given visitor, this script looks up the list of series involving this visitor
//

ob_start(); // relates to (*ob1)
$loadcontext = 2; require '../classes/ajax_session.php';
$perfReport = new C_perfReport();


$vids = @$_POST['vids']; // id of a visitor for whom we will identify the existing and planned series

if(!isset($vids)) die('error: insufficient parameters.');
$vidsray = explode('!',$vids);
foreach($vidsray as $x => $vid) if(!is_numeric($vid)) die('error: vids format.');
if(!count($vidsray)) die('warning: no visitor');

$vids = implode(',',$vidsray);
echo $vids.$nl;
$sql = new Q('select distinct serieId as id from att_visitors
	join attendees on attendees.groupId = att_visitors.groupId
	join reservations on reservations.id = att_visitors.groupId
	where att_visitors.resourceId in ('.$vids.')
		and reservations.serieId <> 0;');
$sids = $sql->ids(); // in coma separated format, ids of series involving these visitor(s).
echo $nl.'found:'.$nl.$sids.$nl.$nl;

$dbAccess_resa_series = new C_dbAccess_resa_series('',$sids);

$perfReport->peak('::series loaded');	


if($dbAccess_resa_series->count()) {
	$sql2 = new Q('select serieId as id, count(1) as howmany from reservations where 
		reservations.groupId = '.$accountId.' and reservations.serieId in ('.$sids.')
		group by serieId;');
	$sql2ray = $sql2->idx('id','howmany');

	foreach($sql2ray as $sid => $counter) {
		$dS_serie = $dbAccess_resa_series->keyed[$sid];
		$dS_serie->stitle .= '<'.$counter.'>';
	}
}
$perfReport->peak('::series counted');	
	
$bank = 'visiapps';
echo '<code>';
	echo $dbAccess_resa_series->stream(no_alias, $bank, with_tracking); // first make client side be compatible with tracking for C_dS_resa_serie with tracking
echo '</code>';

$perfReport->peak('::streaming complete');
$perfReport->dropReport();
closeconnection(); // escapes from Apache2 KEEP_ALIVE
// C_dS_connection::poke($perfReport, 'q_serie'); // First create the item q_serie in DB
?>