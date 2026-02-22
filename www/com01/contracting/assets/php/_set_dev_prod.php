<?php


$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '/assets/imgs/emails'; // same in production as in local
$http = 'https';
$environment = 'PROD!';
if(isset($subfolders[1])) {
	if($host=='localhost:8888') { // then we run local dev
		$uri_1 = '/contracting/assets/imgs/emails'; // then you are in locahost testing.
		$http = 'http';
		$environment = 'DEV :)';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/" and prod "https://contracting.mobminder.com/"


?>