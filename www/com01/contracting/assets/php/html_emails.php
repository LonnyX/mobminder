<?php


$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '/assets/imgs/emails'; // same in production as in local
$http = 'https';
$environment = 'PROD!';
if(isset($subfolders[1])) {
	if($host=='localhost:8888') { // then we run local dev
		$uri_1 = '/mobcom/assets/imgs/emails'; // then you are in locahost testing.
		$http = 'http';
		$environment = 'DEV :)';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/comm" and prod "https://be.mobminder.com/comm"


	// connect to DB and bring all Xlations to their respective places
	
$dbio = new mysqli('localhost' /*host*/, 'mobminder' /*user*/, 'tgx23PiQ' /*pw*/, 'newmobcom' /*db*/);
$dbio->query('SET NAMES utf8');

// function X($tn, $page = false) {
// 	global $dbio, $l, $p, $ixl;
// 	if($page) $qp = $page; else $qp = 'wizard';
// 	$sql='select id, fr, '.$l.' from xlations where tn = "'.$tn.'" and page = "'.$qp.'";';
// 	$r = $dbio->query($sql);
// 	if($r===false) echo $dbio->errno.' -> '.$dbio->error;
// 	$c = $r->num_rows;
// 	if($c > 1) return '-?many-'.$tn.'-?-'; // 'Many XL for '.$tn.'/'.$qp; // mutliple entries for this combination of technical name and page
// 	if($c === 0) { 
// 			$id = 0; // will trigger the creation of a new record in xlations DB table
// 		if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">-?'.$tn.'?-</xl>'; // interactive translation
// 			else $xl = '-?'.$tn.'?-'; // 'No XL for '.$tn.'/'.$qp; // technical name/page not found in db
// 		$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
// 		return $xl;
		
// 	} else { // only one found, great!
// 		$row = $r->fetch_array();
// 			$xl = $row[$l]; if($xl=='') $xl = $row['fr']; // when the page is not yet translated in the requested language, the document displays french.
// 			$id = $row['id'];
// 		if($xl === '') return '-?empty?-';
// 		if($ixl=='on') $xl = '<xl id="xl_'.$qp.'_'.$id.'" value="'.$tn.'">'.$xl.'</xl>'; // interactive translation
// 		$xl = nl2br($xl); // nl2br seems to leave the \n's inside the string was solved here (*xl_1*)
// 		return $xl;
// 	}
// }

//////////////////////////////////////////////////////////////////////////////// 
//
//  MAKE RECIPIENTS
//


?>