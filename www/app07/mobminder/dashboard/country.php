<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
	include_once("./class/db.php");	
	$db = new db();


		$query = "select 
distinct left(toNumber,5) as operator
from sms
order by operator;";

		$db->querier($query);
	
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
<?php
	$i=1;
	while ($row = $db->results->fetch_object()){
		echo $row->operator."<br/>";
	}

?><h1>done</h1>
</body></html>