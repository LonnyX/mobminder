<?php
require '../classes/language.php';
require '../../lib_mobphp/chtml.php';
require '../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////////////////////////////// 
//
//   
//
//  
//

//
//  Usage: be.mobminder.com/utilities/smsquality.php

$html = new C_html();
$html->pushMeta('Content-Type'			, 'text/html; charset=UTF-8');
$html->pushMeta('Content-Style-Type'	, 'text/css');
$html->pushMeta('Content-Script-Type'	, 'text/javascript');
$html->pushMeta('pragma'				, 'no-cache');
$html->pushLink('visiload.css'			, 'stylesheet'	, 'text/css');
$html->pageTitle('mobminder SMS traffic analyzer');
$html->pushHTML('<h1>mobminder SMS traffic analyzer</h1>');

function error($msg, $handle = false) { global $html; if($handle) fclose($handle); $html->pushHTML('<h3>'.$msg.'</h3>'); $html->dropPage(); die(); }
function notice($msg) { global $html; $html->pushHTML('<p>'.$msg.'</p>'); }
function pc($p,$t) { return '<span style="font-size:80%; padding-left:0.5em">('.((int)((100*$p)/$t)).'%)</span>'; }
//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS
//

// if(isset($_GET['id'])) $groupId = $_GET['id']; else $groupId = false;
// if(!$groupId) error('You need to give an account id');


class dS_sms  { // group to an account
	public function __construct($r) {
		foreach($r as $name => $value) $this->{$name} = $value;
	}
	public $reservationId;
	public $templateId;
	public $resourceId;
	public $sendStamp;
	// public $text;
	public $toNumber;
	public $replyNumber;
	// public $correlator;			// route 1
	public $status;
	public $statusChangeStamp;
	// public $r2correlator;		// route 2
	public $r2status;
	public $r2statusChangeStamp;
	// public $r3correlator;		// route 3
	public $r3status;
	public $r3statusChangeStamp;
	
	public static $select = 'reservationId, templateId, sendStamp, toNumber, replyNumber, status, statusChangeStamp, r2status, r2statusChangeStamp, r3status, r3statusChangeStamp';
}

//////////////////////////////////////////////////////////////////////////////// 
//
//   O V E R V I E W
//

$html->pushHTML('<h2>Overview</h2>');

class bulkSMS {
	public $sms;
	public $timeframe;
	
	public $countryNames;
	public $routeNames;
	public $countryFilter;
	
	public $statusNames;
	public $statusFilter;
	public $stampFilter;
	
	public function __construct($dateIn, $dateOut) {
		$this->sms = Array( 32 => Array(), 33 => Array(), 'xx' => Array());
		$this->timeframe = 'created > "'.$dateIn.' 00:00:00" AND created < "'.$dateOut.' 00:00:00" ';
		$this->countryNames  = Array( 32 => 'Belgium', 33 => 'France', 'xx' => 'Other countries');
		$this->routeNames = Array( 1 => 'routeSMS india', 2 => 'SMSapi Poland', 3 => 'XtraPro Belgium');
		$this->countryFilter = Array( 32 => 'tonumber LIKE "32%"', 33 => 'tonumber LIKE "33%"', 'xx' => 'NOT (tonumber LIKE "33%" OR tonumber LIKE "32%")');
		
		$dateIn = new C_date($dateIn);
		$dateOut = new C_date($dateOut);
		notice('From <strong>'.$dateIn->getDateString().'</strong> to <strong>'.$dateOut->getDateString().'</strong> midnight to midnight.</strong>');
		
		$sms = &$this->sms;
		foreach($this->countryNames as $id => $name) {
			$cf = $this->countryFilter[$id];
			$q = new Q('SELECT '.dS_sms::$select.' FROM sms WHERE '.$this->timeframe.' AND '.$cf.';');
			while($r = $q->result->fetch_array()) { $sms[$id][] = new dS_sms($r); }
			notice('Traffic to '.$name.' (+'.$id.') = '.count($sms[$id]).' SMSs');
		}
		
		$this->statusNames 	 = Array( 0 => 'no sms', 1 => 'created', 2 => 'retry', 3 => 'handled', 4 => 'pending', 5 => 'delivered', 6 => 'discarded', 9 => 'prov error');
		$this->statusFilter = Array( 1 => 'status', 2 => 'r2status', 3 => 'r3status' );
		$this->stampFilter = Array( 1 => 'statusChangeStamp', 2 => 'r2statusChangeStamp', 3 => 'r3statusChangeStamp' );

	}
	public function status($route) { // route like 'r1'
	
		// counting
		$t = 0; // big total for the given route
		$c = Array( 0 => 0, 1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0, 6 => 0, 8=>0, 9 => 0, 'T' => 0); // counters for a given country
		$r = Array( 32 => ($x=$c), 33 => ($x=$c), 'xx' => ($x=$c)); // each country gets a serie of counters
		$f = $this->statusFilter[$route];
		foreach($this->countryNames as $id => $name) {
			$c = &$r[$id];
			foreach($this->sms[$id] as $sms) $c[$sms->{$f}]++;
			foreach($this->statusNames as $s => $sname) if($s) $c['T'] += $c[$s]; // ignore the "no_sms" status
			$t += $c['T'];
		}
			// headers
			$tds = Array('<th style="color:blue;">'.$this->routeNames[$route].'</th>');
			foreach($this->countryNames as $name) $tds[] = '<th style="padding-left:2em;">'.$name.'</th>'.'<th>'.'</th>';
			$header = '<tr>'.implode('',$tds).'</tr>';
		
		// counters
		$trs = Array($header);
		foreach($this->statusNames as $s => $sname) {
			if(!$s) continue; // ignore the "no_sms" status
			$tds = Array('<td style="">'.$sname.'</td>');
			foreach($this->countryNames as $id => $name) 
				$tds[] = '<td style="">'.$r[$id][$s].'</td>'.'<td>'.pc($r[$id][$s],$r[$id]['T']).'</td>';
			$trs[] = '<tr>'.implode('',$tds).'</tr>';
		}
			// totals
			$tds = Array('<th style="color:gray;">'.$t.' SMS</th>');
			foreach($this->countryNames as $id => $name) $tds[] = '<th style="font-style:italic; color:gray;">'.$r[$id]['T'].'</th>'.'<th>'.pc($r[$id]['T'],$t).'</th>';
			$totals = '<tr>'.implode('',$tds).'</tr>';
		
		$table = '<table style="border:1px solid silver; margin-top:1em; margin-left:5em; text-align:right;">'.$totals.implode('',$trs).'</table>';
		return $table;
	}
}



$html->pushHTML('<h3>Total traffic</h3>');
$_ = new bulkSMS('2013-09-18', '2013-11-18');

$html->pushHTML('<h3>Traffic by operator</h3>');
	notice('Main route');
$html->pushHTML($_->status(1));
	notice('Fall back provider 1');
$html->pushHTML($_->status(2));
	notice('Fall back provider 2');
$html->pushHTML($_->status(3));

	
//////////////////////////////////////////////////////////////////////////////// 
//
//  BUILDING UP SQL
//


$html->pushHTML('<h2>end of page</h2>');
$html->dropPage();



?>