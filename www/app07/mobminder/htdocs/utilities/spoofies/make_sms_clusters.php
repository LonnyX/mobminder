<?php

$systemLog = 'spoofy.php';
require '../../smsgateaway/sga_lib.php';
setrendermode('..');


//////////////////////////////////////////////////////
//
//  Echo functions
//
$out = '';
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}



//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out = h1('Spoofy operation - smsgateaway make patch table from available satellites');

if(isset($_GET['do'])) $do = $_GET['do']; if($do) $do = true; else $do = false;
if(isset($_GET['qid'])) $qid = $_GET['qid']; else $qid = false;


	// $m = 1024*3.6; // 3 Gig RAM
// ini_set('memory_limit', $m.'M');


$out .= warning('Do mode : '.($do?'TRUE':'NOPE'));
$out .= warning('Queue id : '.($qid?'qid':'NOPE'));



class C_patchmaker {
	
	public $patch_table;
	public $satls_table;
	public $queues_table;
	
	public function __construct($operators) {
		
		$this->patch_table = 'patches_2021_10';
		$this->satls_table = 'satellites_2021_10';
		$this->queues_table = 'queues_2021_10';
		
		global $out;
		
			foreach($operators as $x => $op) $op = '"'.$op.'"';
			$ops = implode(',',$operators);
			$sql = 'select count(1) as c from '.$this->satls_table.' where operator in ('.$ops.');';
			
		$q = new Q($sql);
		
		$out .= notice('SQL:'.$sql);
		$out .= notice('Number of satellites:'.$q->c());
	}
}



	$operators = Array('proximus','scarlet');
$proximus = new C_patchmaker($operators);



if($do) {
	// $q = new Q('delete from '.$patch_table.' where queueid '.$qid.';');
}





//////////////////////////////////////////////////////////////////////////////// 
//
//
//

$out .= h2('Successful');
echo html($out); die();

?>