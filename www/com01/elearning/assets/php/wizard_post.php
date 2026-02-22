<?php

////////////////////////////////////////////////////////////////////////////////////////////////
//
// portal
//

$continent	= $_POST['geo_continent'];	// 
$country	= $_POST['geo_country'];	// 
$region		= $_POST['geo_region'];		// 
$city		= $_POST['geo_city'];		// 
$phonecc	= $_POST['geo_phonecc'];	// 
$language	= $_POST['geo_language'];	// 

$pro		= $_POST['pro'];		// [ medical, freelance, medgroup, dental, industry, wellness ]
$time		= $_POST['time'];		// [1, 2, 3, 4, 6, 12]
$paper		= $_POST['paper'];		// 1 = paper, 0 = software
$papernote	= $_POST['papernote'];	// which agenda is currently used, INPUT_ALPHA max 32 chars
$fname		= $_POST['fname'];		// INPUT_ALPHA max 32 chars
$lname		= $_POST['lname'];		// INPUT_ALPHA max 32 chars
$company	= $_POST['company'];	// INPUT_ALPHA max 32 chars
$mobile		= $_POST['mobile'];		// INPUT_MOBILE +32493655599
$email		= $_POST['email'];		// INPUT_EMAIL, p@v.com
$multi		= $_POST['multi'];		// 1 = multi, 0 = single
$agen1		= $_POST['agen1'];		// INPUT_ALPHA max 32 chars (filled only when multi = 1)
$agen2		= $_POST['agen2'];		// INPUT_ALPHA max 32 chars
$agen3		= $_POST['agen3'];		// INPUT_ALPHA max 32 chars
$agen4		= $_POST['agen4'];		// INPUT_ALPHA max 32 chars
$agen5		= $_POST['agen5'];		// INPUT_ALPHA max 32 chars
$eresa		= $_POST['eresa'];		// 1 = with eresa, 0 = without 
$ownweb		= $_POST['ownweb'];		// 1 = exists, 0 = wish
$url		= $_POST['url'];		// www.domain.be
$comm		= $_POST['comm'];		// [r!c!v!b] reminder, confirmation, revival, birthday
$live		= $_POST['live'];		// 1 = filled, 0 = virgin
$livenote	= $_POST['livenote'];	// free text max 512 chars 
$caid		= $_POST['caid'];		// [ 0, ... 9 ], see captcha_check.php
$cach		= $_POST['cach'];		// [ 1, ... 5 ]
$calang		= $_POST['calang']; 	// [ fr, en, nl ]
$lang		= $_POST['lang'];		// [ fr, en, nl ] // language as chosen by the surfer


////////////////////////////////////////////////////////////////////////////////////////////////
//
// sql injection gate
//










////////////////////////////////////////////////////////////////////////////////////////////////
//
// treatment
//







function do_post_request($data) {
  
  $url = "https://be.mobminder.com/post/newacc.php";
  //$url = "http://be.mobminder.com/post/webaccount.php";
  
  $posting = '';

  foreach($data as $idx=>$post)
  	$posting .= $idx."=".$post."&";
  
  $posting = strip_tags($posting);
  $posting = str_ireplace ( "delete"	, "" , $posting); 
  $posting = str_ireplace ( "update" 	, "" , $posting); 
  $posting = str_ireplace ( "drop" 		, "" , $posting); 
    
  $params = array('http' => array(
              'method' => 'POST',
              'content' => $posting
            ));
  
  
  
  $ctx = stream_context_create($params);  
  $fp = @fopen($url, 'rb', false, $ctx);
  
  if (!$fp) { 
  	die("Problem connecting server##".chr(10)."e=10".chr(10)."a=".chr(10)."b=");
  }
  
  $response = @stream_get_contents($fp);
  if ($response === false) { 
  	die("Problem reading data from server##".chr(10)."e=11".chr(10)."a=".chr(10)."b=");
  }
  
  fclose($fp);
  return $response;
}


// echo do_post_request($_POST);

echo 'POST OK';

?>