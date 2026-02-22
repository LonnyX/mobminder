<?php

$systemLog = 'visiload';
require '../utililib.php';

$allin = microtime(true);
 
 
if(isset($_GET['do'])) $do = true; else $do = false;

$out .= h1('Build logins zip utility');

$out .= warning('DO MODE : '.($do?'YES':'NO'));

$q = new Q('select count(1) as c from logins;');
$c = $q->c();
$out .= warning('logins count : '.$c);


$q = new Q('select id, accessLevel, login, password, lastname, firstname 
	from logins where accessLevel <> 4
	order by accessLevel desc;');
	
while($row = $q->result->fetch_array()) {
	$id = $row['id'];
	$l = $row['login'];
	$p = $row['password'];
	$z = base64_encode(gzcompress($l.$p, 4)); // see (*lp01*)
	$b = gzuncompress(base64_decode($z)); 
	// $out .= notice($id.', '.$l.', '.$p.', => zipped |'.$z.'|  back: '.$b);
	if($do) {
		new Q('update logins set taycan = "'.$z.'" where id = '.$id.';');
		// $out .= warning('SAVED');
	}
}
	
$q = new Q('select id, accessLevel, login, password, taycan, lastname, firstname 
	from logins where accessLevel <> 4
	order by accessLevel desc;');
	
while($row = $q->result->fetch_array()) {
	$id = $row['id'];
	$l = $row['login'];
	$p = $row['password'];
	$t = base64_decode($row['taycan']);
	$b = gzuncompress($t); // see (*lp01*)
	$out .= notice($id.', '.$l.', '.$p.'|  taycan: '.$b);
}


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'seconds');

echo html($out); // from utililib.php

?>