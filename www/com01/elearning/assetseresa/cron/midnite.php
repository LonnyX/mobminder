#!/usr/bin/php5 -q
<?php


/////////////////////////////////////////////////////////////////
// CALL web login pages synchronization
// created by bspoden
/////////////////////////////////////////////////////////////////

define('crontest', false); // when maintaining this page, pass this parameter to true so you can easily call the page and test it


if(crontest)
{
	require '../../../../mobminder/lib_mobphp/dbio.php';  // when running it locally
	require '../classes/eresa_url_lib.php';
}
else
{
	require '/var/www/mobminder/lib_mobphp/dbio.php'; // when running in production
	require '/var/www/booking/_assets/classes/eresa_url_lib.php'; 
}
$helper = new C_Eresa_Url();
$helper->synchronizePages(true); //pass true as argument for removing all postfixurl (test only)


//bsp-end
	
?>