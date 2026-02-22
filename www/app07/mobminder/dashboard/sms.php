<?php
	error_reporting(E_ALL);
	ini_set('display_errors', '1');
	include_once("./class/db.php");	
	$db = new db();

	$patternEmail = '/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/';

		$query = "SELECT v.email as email, v.groupId as groupid, g.name as groupname
FROM visitors v 
join groups g on v.groupId=g.id
where v.email<>'' order by g.name;";

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
		$email = strtolower($row->email);
		if (!preg_match($patternEmail, $email)) echo $i++."- ".$row->groupname."(".$row->groupid.") ".utf8_decode($email)."<br/>";
	}

?><h1>done</h1>
</body></html>