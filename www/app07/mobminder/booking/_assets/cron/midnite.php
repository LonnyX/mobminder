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
	$sitemapxml = 'C:\\Program Files (x86)\\EasyPHP-Devserver-17\\eds-www\\booking\\sitemap.xml';
}
else
{
	require '/var/www/mobminder/lib_mobphp/dbio.php'; // when running in production
	require '/var/www/booking/_assets/classes/eresa_url_lib.php'; 
	$sitemapxml = '/var/www/booking/sitemap.xml';
}
$helper = new C_Eresa_Url();
$helper->synchronizePages(); //pass true as argument for removing all postfixurl (test only)


//////////////////////////////////////////////////////////////////////////////////////
//
// remove and generate sitemap.xml
//
//////////////////////////////////////////////////////////////////////////////////////


$content = '<?xml version="1.0" encoding="UTF-8"?>'.chr(10).'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'.chr(10);

$q = new Q('SELECT id, trim(eresaUrl) as eresaUrl, eresaIdentMode FROM logins WHERE trim(eresaUrl) <> "";');
while($r = $q->result->fetch_array()) 
{
    $postfixurl = $r['eresaUrl'];
    $url = 'https://booking.mobminder.com/'.$postfixurl.'/';
    //echo $postfixurl.'</br>';

    $content=$content.'    <url>'.chr(10);
    $content=$content.'        <loc>'.$url.'</loc>'.chr(10);
    $content=$content.'    </url>'.chr(10);
}
$content=$content.'</urlset>'.chr(10);

if(!file_put_contents($sitemapxml,$content, LOCK_EX))
{
	echo 'sitemap.xml file has not been created : '.chr(10);
}
if(!chown($sitemapxml,'www-data'))
{
	echo 'sitemap.xml file owner (www-data) has not been changed : '.chr(10);
}
if(!chgrp($sitemapxml,'www-data'))
{
	echo 'sitemap.xml file group (www-data) has not been changed : '.chr(10);
}
if(!chmod($sitemapxml,0775))
{
	echo 'sitemap.xml file permission (0775) has not been changed : '.chr(10);
}




///////////////////////////////////////////////////////////////////////////////////////



$now = new C_date();
echo 'EXECUTION FINISHED ON:'.$now->getDateTimeString().chr(10);

//bsp-end
	
?>