<?php

require('./geo_check.php');


////////////////////////////////////  ///////////////


$session = session_start();




////////////////////////////////////////////////////////////////////////////////////////////////
//
// portal
//
// echo 'gonna find you...'.chr(10);

// geotrack *PA01*

if(!isset($_SESSION['geolocated'])) {

    $geo = new C_geofind($_SERVER['HTTP_USER_AGENT'], getenv('REMOTE_ADDR') /* user IP*/ );

    $continent	= $geo->cont;		 // see geo_check.php
    $country	= $geo->coun;		 // 
    $region		= $geo->rnam;		 // 
    $city		= $geo->city;		 // 
    $phonecc	= $geo->phoneregion; // 
    $language	= $geo->language;	 // 

    $_SESSION['geolocated'] = $country;
} else {
    // echo 'Re-using session var.';
    // re-use the former result in this session
}

echo '&$'.$_SESSION['geolocated'].'&$'.chr(10);
// echo '&$'.'Luxembourg'.'&$'.chr(10);

?>