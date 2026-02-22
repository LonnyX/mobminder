<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     U S E R    A C C O U N T    M O N I T O R I N G
//
//
// 	

require '../sga_lib.php';
require '../bargraphs_lib.php';
$web=1; setrendermode('..');
$dS_login = checkcredentials();
// Catching current url parameters and login pass
//
$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '';
$http = 'http';
if(isset($subfolders[1])) {
	if($subfolders[1]=='smsgateaway') { 
		$uri_1 = '/smsgateaway'; // then you are in locahost testing.
		$http = 'http';
	}
}
$par = geturiaccessparms($dS_login); // uri formatted login/pass parameters
$ld = '"'.$http.'://'.$host.$uri_1.'/dashboard/index.php'.'?'.$par.'"'; // is the main statement to access _logdetail.php, add a logid to this and you are fully ready to call _logdetail.php	
$sd = '"'.$http.'://'.$host.$uri_1.'/dashboard/satsdetail.php'.'?'.$par.'"';

$qid = $_REQUEST['qid'];
$dS_queue = new C_dS_queue($qid); 

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Queues
//

pad(); h2('Queue '.$qid.' : '.$dS_queue->name,'queues');

	echo '<table class="list">';
		echo '<thead>';
			echo C_dS_queue::gethtmlqueueheaders(); 
		echo '</thead>';

		echo '<tbody>';
			echo $dS_queue->gethtmlqueues();
		echo '</tbody>';
	echo '</table>';

	$js = 'onqueue = function(eid) { 
						console.log(eid); 
						var href = '.$ld.'+"#queues"; // eid is the log id, see (*al01*)
						window.location.href=href;
					}';
	dropjs($js);

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Satellites
//

pad(); h2 ('Satellites according to patch table : '.C_dS_patch::$current_patches);

	$sats = C_dS_satellite::$current_satellites;
	
	$q = new Q('select '.$sats.'.id as id from '.$sats.' 
				join '.C_dS_patch::$current_patches.' on '.$sats.'.id = '.C_dS_patch::$current_patches.'.satelliteid
				where queueid = '.$qid.' order by '.C_dS_patch::$current_patches.'.operator, '.$sats.'.operator, '.$sats.'.id;');
	$c = $q->cnt();
	if($c==0) warning('No sms seem to be assigned to this satellite'); // this queue has no satellite
	
	$satids = $q->ids(list_as_array);


	echo '<table class="list">';

		echo '<thead>';
			echo C_dS_Satellite::gethtmlheader(); 
		echo '</thead>';

		echo '<tbody>';
			foreach($satids as $sid) {
				$dS_satellite = new C_dS_Satellite($sid);
				echo $dS_satellite->gethtmlrow(); 
			}
		echo '</tbody>';

	echo '</table>';

	$js = 'onsat = function(eid) { 
						console.log(eid); 
						var href = '.$sd.'+"&satid="+eid; // eid is the log id, see (*al01*)
						window.location.href=href;
					}';
	dropjs($js);

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	SMS
//

pad(); h2('Sms');

	$q = new Q('select id from sms where parentid = '.$qid.' order by created desc limit 100;');
	$c = $q->cnt();
	if($c==0) warning('No sms seem to be assigned to this satellite'); // this queue has no satellite
	
	$smsids = $q->ids(list_as_array);


	echo '<table class="list">';

		echo '<thead>';
			echo C_dS_sms::gethtmlsmsheaders(); 
		echo '</thead>';

		echo '<tbody>';
			foreach($smsids as $sid) {
				$dS_sms = new C_dS_sms($sid);
				echo $dS_sms->gethtmlsmsview(); 
			}
		echo '</tbody>';

	echo '</table>';	


?>