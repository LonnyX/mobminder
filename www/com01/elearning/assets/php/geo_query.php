<?php
	
require('./geo_check.php');

$g = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );

echo $g->getstring();


// ISO 3166 Country Codes
// https://dev.maxmind.com/geoip/legacy/codes/iso3166/
// https://www.maxmind.com/download/geoip/misc/region_codes.csv

// BE,01,"Antwerpen"
// BE,03,"Hainaut"
// BE,04,"Liege"
// BE,05,"Limburg"
// BE,06,"Luxembourg"
// BE,07,"Namur"
// BE,08,"Oost-Vlaanderen"
// BE,09,"West-Vlaanderen"
// BE,10,"Brabant Wallon"
// BE,11,"Brussels Hoofdstedelijk Gewest"
// BE,12,"Vlaams-Brabant"
// BE,13,"Flanders"
// BE,14,"Wallonia"


?>