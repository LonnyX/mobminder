<?php
	

$id = $_POST["xlid"];
$tname = $_POST["tname"];
$page = $_POST["page"];
$newxl = $_POST["newxl"]; $newxl = addslashes($newxl);
$lng = $_POST["lang"];

echo 'page:'.$page.chr(10);
echo 'techname:'.$tname.chr(10);
echo 'id:'.$id.chr(10);
echo 'txt:'.$newxl.chr(10);
echo 'lng:'.$lng.chr(10); // expected to be one of [fr, en, nl, es]

sleep(1);
if($newxl) {
	
		
	$dbio = new mysqli('localhost' /*host*/, 'mobminder' /*user*/, 'tgx23PiQ' /*pw*/, 'newmobcom' /*db*/);
	$dbio->query('SET NAMES utf8');

	if($id) { // item is already in the DB
		$r = $dbio->query('select id from xlations where id='.$id.';');
		if($r===false) echo $dbio->errno.' -> '.$dbio->error;
		$c = $r->num_rows;
		if($c==1) { // id exists, go on with writing
			$sql = 'update xlations set '.$lng.' = "'.$newxl.'" where id='.$id.';';
			echo 'writing: '.$sql.chr(10);
			$r = $dbio->query($sql);
			if($r===false) echo $dbio->errno.' -> '.$dbio->error;
		}
	}
	else if($id==0) { // item needs to be created in the DB
		
			$l = Array('en'=>'', 'fr'=>'', 'nl'=>'', 'es'=>'');
			$l[$lng] = $newxl;
		echo 'creating'.chr(10);
		$r = $dbio->query('insert into xlations (tn, page, fr, en, nl, es) values ("'.$tname.'","'.$page.'","'.$l['fr'].'","'.$l['en'].'","'.$l['nl'].'","'.$l['es'].'");');
		if($r===false) echo $dbio->errno.' -> '.$dbio->error;
	}
} 
?>