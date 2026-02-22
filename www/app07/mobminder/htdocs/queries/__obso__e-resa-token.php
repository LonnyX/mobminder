<?php
require '../classes/ajax_session.php';

$token 	= $_POST['token'];
if(!$token) die('no token');

if(!isset($_SESSION['token'])) die('no checkin');
if($token != $_SESSION['token']) { unset($_SESSION['token']); die('no match'); };

$visiId = @$_SESSION['e-visi'];

echo 'match';

if(isset($visiId)) {
	$o_dS_visitor = new C_dS_visitor($visiId);
	echo '<code>';
	echo $o_dS_visitor->stream1(with_tracking);
	echo '</code>';
}
?>