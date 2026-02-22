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

$ld = '"'.$http.'://'.$host.$uri_1.'/dashboard/index.php'.'?'.$par.'"';

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// 	Hlr lookups
//

pad(); h2('Hlr lookups','hlr');


$q = new Q('select datesms, smscount, hlrcount from 
			(select count(1) as smscount, SUBSTR(created from 1 for 10) as datesms from sms 
			where SUBSTR(created from 1 for 10) BETWEEN CURDATE() - INTERVAL 60 DAY AND CURDATE() 
			GROUP BY datesms order by datesms DESC) as smsq left join 
			(select count(1) as hlrcount, SUBSTR(hlrstamp from 1 for 10) as datehlr from hlr_lookups GROUP BY datehlr order by datehlr DESC) as hlrq
			on datesms = datehlr;');

echo '<table class="list">';
	echo '<thead>';
		echo '<tr>'.'<th>'.'Datesms'.'</th>'.'<th>'.'Smscount'.'</th>'.'<th>'.'Hlrcount'.'</th>'.'</tr>';
	echo '</thead>';

	echo '<tbody>';
		while($row = $q->result->fetch_array()) {
			$date = $row['datesms'];
			$sms = $row['smscount'];
			$hlr = $row['hlrcount'];
		echo '<tr onclick="onhlr(this.id)">'.'<td>'.$date.'</td>'.'<td>'.$sms.'</td>'.'<td>'.$hlr.'</td>'.'</tr>';
		}
	echo '</tbody>';

	$js = 'onhlr = function(eid) { 
						console.log(eid); 
						var href = '.$ld.'+"&satid="+eid; // eid is the log id, see (*al01*)
						window.location.href=href;
					}';
	dropjs($js);

echo '</table>';


?>