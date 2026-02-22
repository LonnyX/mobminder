<?php
//////////////////////////////////////////////////////////////////////
//
//  C O M P U T E S    A N D    S T R E A M S    S M S    S T A T I S T I C S
//

$loadcontext = 1; require '../classes/ajax_session.php'; session_write_close(); 
$o_dS_system = new C_dS_system();
$perfReport = new C_perfReport();

$aid = $_POST['id']; if($aid!=$accountId) die('Access restriction <command>logoff</command>');
$midnIn  = $_POST['midnIn'];	
$midnOut = $_POST['midnOut'];

if($midnIn) $midnIn = new C_date($midnIn); else $midnIn = false;
if($midnOut) $midnOut = new C_date($midnOut+86400); else $midnOut = false;

$perfReport->peak('::time needed to retrieve session and posted parameters');


echo 'account id:'.$aid.', name:'.$dS_account->name.$nl;
if($midnIn) echo 'mid in :'.$midnIn->getDateTimeString().chr(10);
if($midnOut) echo 'mid out:'.$midnOut->getDateTimeString().chr(10);




	// 1- create a structure for the counters, following status possible values
	//
class C_dS_smsCounters extends C_dbID {
	
	public $templateId; // handled to provider, no feedback yet
	public $date; // 
	public $msgs; // number of msgs, this is a meta data calculated at client side, we leave it zero here
	public $pages; // 
	
	public $handled; // handled to provider, no feedback yet
	public $error; 	// problem contacting the provider
	public $pending;	// feedback received: queued somewhere in network	
	public $delivered;	// feedback received: delivered
	public $discarded;	// feedback received: deleted somewhere in network	
	
	public function __construct($id) { // route line [1,2 or 3]
		parent::__construct($id);
	}
	public function status($status, $count, $pages) {
		switch($status) {
			case sms_delivered: $this->delivered += $count; break;
			case sms_discarded: $this->discarded += $count; break;
			case sms_pending: $this->pending += $count; break;
			case sms_handled: $this->handled += $count; break;
			case sms_error: $this->error += $count; break;
		} 
		$this->pages += $pages;
	}
	public static $multilines = false;
    public static $defaults = array( 
			'templateId'=> 0,	
			'date' 		=> '',
			'msgs' 		=> 0,
			'pages' 	=> 0,	
		'handled' 	=> 0,	
		'error' 	=> 0,	
		'pending' 	=> 0,	
		'delivered' => 0,	
		'discarded' => 0
		 );
	public function getDefaults() { return self::$defaults; }
}

class C_dbAccess_smsCounters extends C_dbGate {	

	public function __construct() { C_dbGate::__construct(); }
	public function __destruct() { C_dbGate::__destruct(); }
	
	// abstract functions called from parent::C_dbGate
	public function getClassName() { return get_class(); }
	public function dataSetClassName() { return 'C_dS_smsCounters'; }	
	public function getTableName() { return 'X'; }
	public function getNew() { return new C_dS_smsCounters(0); }
	public function next($accountId, $templateId, $date) { 
			$o_dS_ = parent::newVirtual();
			$o_dS_->groupId = $accountId; 
			$o_dS_->templateId = $templateId; 
			$o_dS_->date = $date;
		return $o_dS_; 
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// QUERY

	$whereIn = ''; if($midnIn) $whereIn = 'created>"'.$midnIn->getDateSortable().'"';
	$whereOut = ''; if($midnOut) $whereOut = ($midnIn?' and':'').' created<"'.$midnOut->getDateSortable().'"';
	$SQL = 'select substring(created,1,10) as date, templateId, status, count(1) as msgs, sum(pages) as pages from sms where groupId='.$aid.' and '.$whereIn.$whereOut.' group by templateId, date, status;';

	// echo $nl.$SQL.$nl.$nl;

	$result = C_dbIO::q($SQL, 'smsdash.php::main()');




////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// PACK UP


$counters = Array();
$o_smsCounters = new C_dbAccess_smsCounters();
$ic = 0;
while($row = $result->fetch_array()) {
	// echo '-'.$row['templateId'].' / '.$row['date'].' / '.$row['status'].': '.$row['msgs'].' - '.$row['pages'].$nl;
	$t = $row['templateId']; $d = $row['date']; $s = $row['status']; $c = $row['msgs']; $p = $row['pages'];
	if(!isset($counters[$t])) $counters[$t] = Array();
	if(!isset($counters[$t][$d])) $i = $counters[$t][$d] = $o_smsCounters->next($accountId, $t, $d);
		else $i = $counters[$t][$d];
	$i->status($s,$c,$p);
}
			
			
$perfReport->peak('::data queried');




////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// STREAM

echo $nl.'<code>';
echo $o_smsCounters->stream();
echo '</code>';
	
$perfReport->peak('::streamed');
$perfReport->dropReport();


?>