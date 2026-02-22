<?php
$systemLog = 'spoofy.php';
require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//  SPLIT AN ACCOUNT (Thanks to Alex Vanhoutte)
//
//  This script moves some resources from one group to another existing group; this means:
//	All reservations must follow
//	All visitors must be copied
//	Some workcodes should move to the new group
// 	Some time boxing should move
//	Some hourlies should move
//
//  Usage: 127.0.0.1/utilities/split.php  <= All parameters and behaviour should be set by reviewing this script
//
//  !! IMPORT VISITORS FIRST !!

//////////////////////////////////////////////////////
//
//  catch this script name 
//

$do = @$_GET['do']; if(isset($do)) { if($do==1) $do = true; } else $do = false;

//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); 
$html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function html($content) {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type=text/html; charset=UTF-8">';
			$o .= '<link href="./utilities.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out = '';


//////////////////////////////////////////////////////
//
//  History
//

// 1. Activate usage of open_ssl in php.ini
// 2. Use / iso \ in the path to the openssl config file (!!)
// 3. Create columns in DB for encryption
//    	ALTER TABLE `visitors` ADD COLUMN `lastname_enc` BLOB AFTER `lastname`;
// 		ALTER TABLE `visitors` ADD COLUMN `firstname_enc` BLOB AFTER `firstname`;
// 		ALTER TABLE `visitors` ADD COLUMN `email_enc` BLOB AFTER `email`;
//
// To read the result : execute in Navicat
// 
// select id, lastname_enc, hex(lastname_enc) as lastname, firstname_enc, hex(firstname_enc) as firstname, email_enc, hex(email_enc) as email from visitors where groupId = 5083;


//////////////////////////////////////////////////////
//
//  START
//

$out .= h1('Generating keys ');

	$RSAconfig = array(
		// "config" => "C:/Program Files (x86)/EasyPHP-Devserver-17/eds-binaries/php/php5630vc11x86x201201220202/extras/ssl/openssl.cnf", // HYSTOU
		"config" => "C:/Program Files (x86)/EasyPHP-DevServer-14.1VC11/binaries/php/php_runningversion/extras/ssl/openssl.cnf", // NUC
		"digest_alg" => "sha512",
		"private_key_bits" => 2048, //  this will define the fixed length of the encoded string version: 1024 => 128 bytes, 2048 => 256 bytes
		"private_key_type" => OPENSSL_KEYTYPE_RSA,
	);
// Create the private and public key



$res = openssl_pkey_new($RSAconfig);

if($res===false) {
	$out .= warning('ERROR CREATING KEYS');
	while (($e = openssl_error_string()) !== false) {
		$out .= warning($e);
	}
}

// Extract the private key from $res to $privKey
openssl_pkey_export($res, $privKey, NULL, $RSAconfig);

if($privKey===false) {
	$out .= warning('ERROR EXTRACTING PRIVTATE KEY');
	while (($e = openssl_error_string()) !== false) {
		$out .= warning($e);
	}
}


// Extract the public key from $res to $pubKey
$pubKey = openssl_pkey_get_details($res);
$pubKey = $pubKey["key"];

if($pubKey===false) {
	$out .= warning('ERROR EXTRACTING PUBLIC KEY');
	while (($e = openssl_error_string()) !== false) {
		$out .= warning($e);
	}
}

$out .= notice('PrivateKey:'.$privKey);
$out .= notice('publicKey:'.$pubKey);


$out .= h1('Encryption');

$data = 'Bonjour Pascal, aujourd\'hui la météo va t\'envoyer du soleil';
$out .= notice('UNDER ENCRYPTION: '.$data);

// Encrypt the data to $encrypted using the public key
openssl_public_encrypt($data, $encrypted, $pubKey);
$out .= notice('ENCRYPTED: '.$encrypted);



$out .= h1('Decryption');

// Decrypt the data using the private key and store the results in $decrypted
openssl_private_decrypt($encrypted, $decrypted, $privKey);

$out .= warning('DECRYPTED: '.$decrypted);



$out .= h1('Apply on Database data');

$ql = 'select id from visitors where groupId = 5083;';
	
$q = new Q($ql); // 4168 = Dr Doe & Associates

$ids = $q->ids(list_as_string);
$out .= notice($ql);
$out .= notice('result: '.$q->cnt().' items found.');
$out .= notice($ids);

$ids = $q->ids(list_as_array);
foreach($ids as $vid) {
	$dS_v = new C_dS_visitor($vid);
	openssl_public_encrypt($dS_v->lastname, $dS_v->lastname_enc, $pubKey);
	openssl_public_encrypt($dS_v->firstname, $dS_v->firstname_enc, $pubKey);
	openssl_public_encrypt($dS_v->email, $dS_v->email_enc, $pubKey);
	$out .= notice('id:'.$dS_v->id.' lastname:'.$dS_v->lastname.' encrypted:'.$dS_v->lastname_enc);
	if($do) $dS_v->dSsave();
}

if(!$do) $out .= warning('NOT IN DO MODE');



//////////////////////////////////////////////////////////////////////////////// 
//
// STOP
//

echo html($out);


?>