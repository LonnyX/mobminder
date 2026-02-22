<?php
require '../classes/language.php';
require '../../lib_mobphp/dbio.php';
require '../../lib_mobphp/chtml.php';

session_start();

$fa2code = $_SESSION['FA2_code'];

// check postfix url (online reservation by clients/patients)

$cc = 0; if(isset($_POST['cc'])) $cc = $_POST['cc']; if(!is_numeric($cc)) $cc = 0;
$key = 0; if(isset($_GET['k'])) $key = $_GET['k']; if(!is_numeric($key)) $key = 0; // see (*uk01*)

echo $cc.chr(10);
echo $fa2code.chr(10);
echo chr(10);

sleep(1);
$t = 3*time(); // is always greater than the time computed here (*uk02*)
$tt = (int) $t/10;
$fake = '0'.rand(8*$tt,9*$tt); // is always past time()
if($cc==$fa2code) echo 'r'.chr(10).'<data>'.$t.'</data>';
else echo 'f'.chr(10).'<data>'.$fake.'</data>';

?>