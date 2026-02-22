<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                M A I N T E N A N C E     P A G E 
//


require('./assets/php/geo_check.php');

//$g = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/, false /*authorizes bots here*/ );
//$lang = $g->getlanguage();

$lang = getbrowserlang();

header('Location:./'.$lang.'/oups.php'); // for brand new landers, we check their origin country and lead them to the right language
?>
