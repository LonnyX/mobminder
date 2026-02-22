<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P I   /   Index page
//

require './sga_lib.php';


$_REQUEST['web'] = 1;
setrendermode('');


	$sats = C_dS_satellite::$current_satellites;
$r = new Q('select * from '.$sats.' where id > 0;');


// while($row = $r->result->fetch_array()) {
	// notice($row['id'].' - '.$row['name']);
// }



h1('Welcome to the Mobminder sms gateway landing page');


endrendermode();
?>