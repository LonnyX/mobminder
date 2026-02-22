<?php
///////////////////////////////////////////////////////////////////////////////////
//
//  ACCOUNT BACKUP
//

require '../../lib_mobphp/dbio.php';
ini_set('memory_limit', '1024M');


//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['id'])) $accountId = $_GET['id']; else $accountId = false; if(!$accountId) error('You need to give an account id');

$dS_account = new C_dS_group($accountId); if($dS_account->name == '') error('The account does not exists');

$out = h1('Export for account '.$accountId.', '.$dS_account->name);


//////////////////////////////////////////////////////
//
//  Echo functions
//
function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
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
			$o .= '<meta http-equiv="Content-Type"'.' htmlOut="text/html; charset=UTF-8">';
			$o .= '<link href="visiload.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}


//////////////////////////////////////////////////////
//
//  Magnified appointment object
//



class appointment {
	
	public $id;
	public $created;
	public $schedule;
	public $collaborator;
	public $performance;
	public $color; 
	
	public $firstname;
	public $lastname;
	public $birthday;
	public $mobile;
	public $phone;
	public $email;
	public $address;
	public $zipCode;
	public $city;
	public $country;
	
	public $note;
	
	public function __construct($id) { $this->id = $id; }
	
	
	public function getcsv() {
		
		$csv = '';
		$csv .= $this->id;
		$csv .= ';'.$this->schedule;
		$csv .= ';'.$this->collaborator;
		$csv .= ';'.$this->performance;
		$csv .= ';'.$this->color;
		
		$csv .= ';'.$this->firstname;
		$csv .= ';'.$this->lastname;
		$csv .= ';'.$this->birthday;
		$csv .= ';'.$this->mobile;
		$csv .= ';'.$this->phone;
		$csv .= ';'.$this->email;
		$csv .= ';"'.str_replace(';', ',',$this->address).'"';
		$csv .= ';'.str_replace(';', ',',$this->zipCode);
		$csv .= ';'.str_replace(';', ',',$this->city);
		$csv .= ';'.$this->country;
		
		$csv .= ';"'.str_replace(';', ',',$this->note).'"';
		
		$csv = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $csv);
		
		$csv = str_replace(chr(13).chr(10), ', ', $csv);
		$csv = str_replace(chr(10), ', ', $csv);
		
		return $csv;
	}
	
	public static function getheaders() { 
		
		$csv = 'id';
		$csv .= ';'.'schedule';
		$csv .= ';'.'collaborator';
		$csv .= ';'.'performance';
		$csv .= ';'.'color';
		
		$csv .= ';'.'firstname';
		$csv .= ';'.'lastname';
		$csv .= ';'.'birthday';
		$csv .= ';'.'mobile';
		$csv .= ';'.'phone';
		$csv .= ';'.'email';
		$csv .= ';'.'address';
		$csv .= ';'.'zipCode';
		$csv .= ';'.'city';
		$csv .= ';'.'country';
		
		$csv .= ';'.'note';
		
		$csv = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $csv);
		
		return $csv;
	
	}
	
	
}


//////////////////////////////////////////////////////
//
//  Fetching data
//

$allin = microtime(true);

$appMtrx = Array();

function load($accountId, $archive = '') {
	
	global $appMtrx, $out;
	$a = $archive;
	
		$join = 'JOIN '.$a.'att_visitors ON '.$a.'att_visitors.groupId = '.$a.'reservations.id'; // prevents loading apps having no visitor
	$q = new Q('SELECT '.$a.'reservations.id, FROM_UNIXTIME(cueIn,"%Y-%m-%d %H:%i") as schedule, note FROM '.$a.'reservations '.$join.' WHERE '.$a.'reservations.groupId = '.$accountId.' ORDER BY cueIn DESC;'); // attendees group to reservations
	$appIds = $q->ids(false); $appscount = count($appIds);

	$out .= notice($appscount.' '.$a.'reservations found');

	$packed = Array();
	foreach($appIds as $x => $aid) { // we cannot send an SQL request with a IN() list of 5000 items, so we group ids by pack of 128 items
		$appMtrx[$aid] = new appointment($aid);
		$deca = $x>>12;
		if(!isset($packed[$deca])) $packed[$deca] = Array();
		$packed[$deca][] = $aid;
	}
	$packcount = count($packed);
	$out .= notice($packcount.' packs built');
	
	foreach($q->idx('id','schedule') as $aid => $schedule) { $appMtrx[$aid]->schedule = $schedule; };
	foreach($q->idx('id','note') as $aid => $note) { $appMtrx[$aid]->note = $note; };


	foreach($packed as $d => $pack) {
		
		$p = implode(',',$packed[$d]);
		
		$c = new Q('SELECT '.$a.'reservations.id as aid, name as color FROM '.$a.'reservations LEFT JOIN custom_css ON '.$a.'reservations.csscolor = custom_css.id WHERE '.$a.'reservations.id IN ('.$p.');' );
			foreach($c->idx('aid','color') as $aid => $color) { $appMtrx[$aid]->color = $color; };
		
		$r = new Q('SELECT '.$a.'attendees.groupId as aid, name as collaborator FROM '.$a.'attendees JOIN resources ON resources.id = '.$a.'attendees.resourceId WHERE '.$a.'attendees.groupId IN ('.$p.');' );
			foreach($r->idx('aid','collaborator') as $aid => $collaborator) { $appMtrx[$aid]->collaborator = $collaborator; };
			
		$b = new Q('SELECT '.$a.'performances.groupId as aid, name as performance FROM '.$a.'performances JOIN workcodes ON workcodes.id = '.$a.'performances.workCodeId WHERE '.$a.'performances.groupId IN ('.$p.');' );
			foreach($b->idx('aid','performance') as $aid => $performance) { $appMtrx[$aid]->performance = $performance; };
		
		$d = new Q('SELECT '.$a.'att_visitors.groupId as aid, firstname, lastname, birthday, mobile, phone, email, address, zipCode, city, country FROM '.$a.'att_visitors JOIN visitors ON visitors.id = '.$a.'att_visitors.resourceId WHERE '.$a.'att_visitors.groupId IN ('.$p.');' );	
			foreach($d->idx('aid','firstname') as $aid => $firstname) { $appMtrx[$aid]->firstname = $firstname; };
			foreach($d->idx('aid','lastname') as $aid => $lastname) { $appMtrx[$aid]->lastname = $lastname; };
			foreach($d->idx('aid','birthday') as $aid => $birthday) { $appMtrx[$aid]->birthday = $birthday; };
			foreach($d->idx('aid','mobile') as $aid => $mobile) { $appMtrx[$aid]->mobile = $mobile; };
			foreach($d->idx('aid','phone') as $aid => $phone) { $appMtrx[$aid]->phone = $phone; };
			foreach($d->idx('aid','email') as $aid => $email) { $appMtrx[$aid]->email = $email; };
			foreach($d->idx('aid','address') as $aid => $address) { $appMtrx[$aid]->address = $address; };
			foreach($d->idx('aid','zipCode') as $aid => $zipCode) { $appMtrx[$aid]->zipCode = $zipCode; };
			foreach($d->idx('aid','city') as $aid => $city) { $appMtrx[$aid]->city = $city; };
			foreach($d->idx('aid','country') as $aid => $country) { $appMtrx[$aid]->country = $country; };
	}
	
}


	$cin = microtime(true);
load($accountId);
	$cout = microtime(true); $d = deltasec($cin,$cout); $out .= h2('Successful load from current table - roundtrip: '.$d.' - ');

	
	$cin = microtime(true);
load($accountId, 'archive_');
	$cout = microtime(true); $d = deltasec($cin,$cout); $out .= h2('Successful load from archive table - roundtrip: '.$d.' - ');

	
	
///////////////////////////////////////////////////////////////////////////////////
//
// Produce the file content	

	$cin = microtime(true);
	
$filecontent = appointment::getheaders().chr(13).chr(10);
foreach($appMtrx as $aid => $app) $filecontent .= $app->getcsv().chr(13).chr(10); 




///////////////////////////////////////////////////////////////////////////////////
//
// write the file	
	
$filename = $accountId.'_export.csv';
$pathname = './'.$filename;

if (file_put_contents($pathname, $filecontent) !== false) {
   $out .= notice('Job done, written to '.basename($pathname));
} else {
   $out .= warning('Problem writing to '.basename($pathname));
}

	$cout = microtime(true); $d = deltasec($cin,$cout); $out .= h2('Successful writing into file - roundtrip: '.$d.' - ');
	

///////////////////////////////////////////////////////////////////////////////////
//
// echo to caller

$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.' - ');

echo html($out);

?>