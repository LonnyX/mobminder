<?php

/////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                T O P     M A I N     L A N D I N G     P A G E 
//


require('./assets/php/geo_check.php');

//$g = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/, false /*authorizes bots here*/ );

//$lang = $g->getlanguage();

$lang = getbrowserlang();



header('Location:./'.$lang.'/index.php'); // for brand new landers, we check their origin country and lead them to the right language
?>