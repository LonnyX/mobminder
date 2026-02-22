<?php
$systemLog = 'spoofy.php'; // the connected user, our framework track any DB modification based on that name.
	
require '../../../lib_mobphp/dbio.php';


//////////////////////////////////////////////////////////////////////////////// 
//
//  This script description: ...
//
//



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



function selectVisitorIdsByGroup(mysqli $conn, int $groupId): array {
    $sql = "SELECT id FROM `visitors` WHERE `groupId` = ? LIMIT 10;"; // no trailing ';'

    $stmt = $conn->prepare($sql);           // if this fails, an Exception is thrown
    $stmt->bind_param('i', $groupId);       // 'i' because groupId is an integer
    $stmt->execute();

    // Option A (no mysqlnd): bind_result + fetch
    $stmt->bind_result($id);
    $rows = [];
    while ($stmt->fetch()) {
        $rows[] = $id;
    }
    $stmt->close();
    return $rows;

    // Option B (if mysqlnd): use get_result()
    // $res = $stmt->get_result();
    // return array_column($res->fetch_all(MYSQLI_ASSOC), 'id');
}



//////////////////////////////////////////////////////
//
//  START
//

$out = h1('Spoofy operation');
$out = h2('PHP version:'.phpversion());


	$link = C_dbIO::$dbConnection;
	$aid = 4252;
	
	

	
$a = selectVisitorIdsByGroup($link,$aid);
print_r($a);



$ql = 'select id from visitors where groupId = ? limit 10;';


$pdstmt = $link->prepare("select id from visitors where groupId = ? limit 10;");
$out .= notice($ql.' << PREPARED');


$pdstmt->bind_param('i', $aid);
$out .= notice($ql.' << BOND');
	
	
$r = $pdstmt->execute();
$out .= notice($ql.' << EXECUTED with '.($r?'SUCCESS':'FAILURE'));


$ids = ''; $a = Array(); 


if(!$r) { 
	$pdstmt->close();
	$out .= warning('error executing '.$pdstmt);
} else {
	
	$out .= notice($ql.' << SCANNING');
	$pdstmt->bind_result($id);
	while($pdstmt->fetch()) {
		$a[] = $id;
		$out .= notice('            >> '.$id);		
	}
	if($pdstmt->num_rows) $pdstmt->data_seek(0);
	$pdstmt->close();
	$coma = ','; 
	if(count($a)) 
        $ids = implode($coma,$a);
}



// $q = new Q($ql);

// $ids = $q->ids();


$out .= notice('result: '.count($a).' items found.');

// $out .= notice($ids);




foreach($a as $vid)  {
	$dS_v = new C_dS_visitor($vid);
	$out.= notice($dS_v->id.': '.$dS_v->lastname.' = '.$dS_v->firstname);
}

$newone = new C_dS_visitor(0,$aid);

$newone->lastname = 'VANHOVE'; $dS_v->firstname='PASCAL';
$newone->save($aid); // should trigger some verbose on prepare creation for insert
$newoneid = $newone->id;

$newone->dSdelete();


$c = 0;
if(!$do) $out .= warning('NOT IN DO MODE');

if($do)
	new Q(';');




//////////////////////////////////////////////////////////////////////////////// 
//
// STOP
//

echo html($out);


?>