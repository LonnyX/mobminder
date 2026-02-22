<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
?>
<html>
<head>
	<title>Mobminder Dashboard</title>
	<meta content="text/html; charset=UTF-8" http-equiv="Content-Type">
	<meta content="text/css" http-equiv="Content-Style-Type">
	<meta content="text/javascript" http-equiv="Content-Script-Type">

	<link rel="stylesheet" type="text/css" href="./css.css">
	<link rel="icon" type="image/ico" href="./favicon.ico">
</head>
<body>
<h1>Mobminder Dashboard</h1>

<?php
	include_once("./class/db.php");	
	$db = new db();
	$db->getBorne(); 
	$db->setBornes(); 
	$db->totalSMS(); 
	$db->showBornes();
	$db->showResults(); 
//	$db->getResults(); 
	$db->freeResults(); 	
?>

</body>
</html>
