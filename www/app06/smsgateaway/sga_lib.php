<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S   G A T E A W A Y   /   L I B R A R Y 
//
//		mandatory include: language.php ( for reduceDiacriticsUTF8() )
//
//
// http://localhost/webapp/smsgateaway/satellite/alive.php?cid=8932029862021146473&csq=20&ptmp=50&pwr=1&ver=20200324&probe=1&web=1
// 
// http://localhost/webapp/smsgateaway/user/push.php?l=alphanight88&p=404&co=10&qn=cluster2020&bla=hello&to=32493655599&web=1
//
// http://localhost/webapp/smsgateaway/dashboard/index.php?l=alphanight88&p=404&web=1
// 
// http://localhost/webapp/smsgateaway/admin/make_sms_clusters.php?qid=620&do=0


// Today 2021 / 10, the queues in use are :
// 600 : dev test queue
// 612 : for sms mailing
// 620 : cluster 2020 used by webapp
// 999 : used by Offimed

// tips for good management of SIM cards ( table satellites_YYYY_MM ) :
// 		- orange SIMs are in the id range 1001 to 1099
//		- proximus SIMs are in the id range 1201 to 1299
//		- telenet (Base) SIMs are in the id range 1401 to 1499
//		- scarlet (proximus) SIMs are in the id range 1601 to 1699
//		- mobile vikings (orange) SIMs will go to the id range 1800 to 1899


// define('QUEUES','queues');  // new table preparation? see (*sl01*)
// define('SATELLITES','satellites');
// define('PATCHES','patches_2021_05');

define('QUEUES'		,'queues_2021_10');  // new table preparation? see (*sl01*)
define('SATELLITES'	,'satellites_2021_10');
define('PATCHES'	,'patches_2021_10'); //new version with 10 new scarlet sim cards
//define('PATCHES'	,'patches_2021_10_keep');  //old version without 10 new scarlet sim cards



//////////////////////////////////////////////////////////////////////
//
//    W E B    R E N D E R 


function h1($t) { global $web, $nl; if(!$web) return; echo '<h1>'.$t.'</h1>'; }
function h2($t,$id=false) { global $web, $nl; if(!$web) return; if($id) $id=' id="'.$id.'"'; else $id='';   echo '<h2'.$id.'>'.$t.'</h2>'; }
function h3($t, $morestyle = '') { global $web, $nl; if(!$web) return; echo '<h3 style="'.$morestyle.'">'.$t.'</h3>'; }
function h4($t) { global $web, $nl; if(!$web) return; echo '<h4>'.$t.'</h4>'; }
function span($msg) { global $web, $nl; if(!$web) return; echo '<span>'.$msg.'</span>'; }
function notice($msg) { global $web, $nl; if(!$web) return; echo '<p>'.$msg.'</p>'; }
function indent($msg, $em = 3, $morestyle = '') { global $web, $nl; if(!$web) return; echo '<p style="padding-left:'.$em.'em; margin:0; '.$morestyle.'">'.$msg.'</p>'; }
function warning($msg, $em = 0) { global $web, $nl; if(!$web) return; echo '<p style="padding-left:'.$em.'em; color:orange">'.$msg.'</p>'; }
function micro($msg) { global $web, $nl; if(!$web) return; echo '<p style="color:blue; padding-left:3em; font-size:80%; line-height:120%;">'.$msg.'</p>'; }
function microtab($msg) { global $web, $nl; if(!$web) return; echo '<p style="color:red; padding-left:6em; font-size:75%; line-height:125%;">'.$msg.'</p>'; }
function pad($em=1) { global $web, $nl; if(!$web) return; echo '<p style="margin:'.$em.'em;">&nbsp;</p>'; }
function href($link, $caption, $em = 3) { global $web, $nl; if(!$web) return; echo '<a href="'.$link.'" style="padding-left:'.$em.'em; margin:0;">'.$caption.'</a>'; }
function js($s) { global $web, $nl; if(!$web) return; echo '<script type="text/javascript">'.$s.'</script>'; }
function div($eid,$html) { global $web, $nl; if(!$web) return; echo '<div id="'.$eid.'">'.$html.'</div>'; }

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
function dropjs($js) { global $web, $nl; if(!$web) return; echo '<script type="text/javascript">'.$js.'</script>'; }
function geturiaccessparms ($dS_login) { return 'l='.$dS_login->login.'&p='.$dS_login->pass; }


function CRLFfree($text) {
	$no1310 = str_replace(chr(13).chr(10), '\n', $text);
	$no10 = str_replace(chr(10), '\n', $no1310);
	$no13 = str_replace(chr(13), '\n', $no10);
	$noPipe = str_replace('|', '', $no13);
	$noTagIn = str_replace('<', '', $noPipe);
	$noTagOut = str_replace('>', '', $noTagIn);
	$clean = $noTagOut;
	return $clean;
}


// $web = false;
$nl = chr(10); $uriaccess = '';
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$split = Explode('/', $pathfile);
		$splitcont = count($split);
	$scriptname 	= $split[$splitcont - 1]; 
	$scriptfolder 	= $split[$splitcont - 2]; if($scriptfolder) $scriptfolder = '/'.$scriptfolder;
	if(isset($split[$splitcont - 3])) $scopefolder 	= $split[$splitcont - 3]; else $scopefolder = false; if($scopefolder) $scopefolder = '/'.$scopefolder;
	$script = $scopefolder.$scriptfolder.'/'.$scriptname;
		
		
function checkcredentials() {
	
	$l 	= @$_REQUEST['l']; if(!isset($l)) die('error 0001'); 
	$p 	= @$_REQUEST['p']; if(!isset($p)) die('error 0002');

	pad(); h2('Checking access rights');

	// login validation
		$q = new Q('select id from logins where login = "'.$l.'" and pass = "'.$p.'";');
		$c = $q->cnt();
	if($c==0) die('error 0003'); // login is not recognized
	$qid = $q->ids();

	$dS_login = new C_dS_login($qid);

	indent('Welcome '.$dS_login->name.' ('.$dS_login->email.')');
	
	global $uriaccess;
	$uriaccess = 'l='.$dS_login->login.'&p='.$dS_login->pass;
	
	$_SESSION['loginid'] = $dS_login->id;
	
	return $dS_login;
}


class C_perfReport {
    public $counter = 0;
    public $initTime;
    public $microtimes = array();
    public $labels = array();
    public $dropTime;
    public function __construct() {
        $this->initTime = $this->peak('init');
    }
    public function peak($label) {
        $peak = microtime(true);
        $this->microtimes[] = $peak;
        $this->labels[] = $label;
        $this->counter++;
        return $peak;
    }
    private function convertToMs($microtime) { // converts microtime (seconds with decimals) into milliseconds (no decimals)
        return ($microtime*1000)|0;
    }
    public function dropReport() {
        global $nl;
        $microtimePrev = $this->initTime;
        echo $nl.$nl.'Perf Report:';
        foreach($this->labels as $id => $label) {
            $microtime = $this->microtimes[$id];
            $delta = $this->convertToMs($microtime-$microtimePrev);
            echo $nl.'     '.$microtime.' sec (+'.$delta.' ms)'.' <-> '.$label;
            $microtimePrev = $microtime;
        }
		$this->dropTime = $microtimePrev-$this->initTime;
        echo $nl.$nl.'     Total delta:  (+'.($this->convertToMs($this->dropTime)).' ms)';
		return $this;
    }
	
	public function logReport($page) {
        global $nl;
		$microtimePrev = $this->initTime;
        $buffer='';
		$buffer.='Perf Report :' .$page;
		foreach($this->labels as $id => $label) {
			$microtime = $this->microtimes[$id];
			$delta = $this->convertToMs($microtime-$microtimePrev);
			$buffer.=$nl.''.$microtime.' sec (+'.$delta.' ms)'.' <-> '.$label;
			$microtimePrev = $microtime;
		}
			
		$this->dropTime = $microtimePrev-$this->initTime;
		//$limit = 1000000;
		$limit = 1000;
		$totalms = $this->convertToMs($this->dropTime);
		echo $totalms;
		
		if($totalms>$limit)
		{
			$buffer.=$nl.'Total delta:  (+'.($totalms).' ms)';
			$time = @date('[d/M/Y:H:i:s]');
			$result = file_put_contents('/var/log/smsga-log/slowpages.log', $time.' - ' . $buffer . "\n", FILE_APPEND | LOCK_EX);
		}
		return $this;
    }


    public function getlaptime() {
        return $this->convertToMs($this->microtimes[$this->counter-1]-$this->initTime)+1;
    }
}

		
function setrendermode($relative = '.') {
	global $web, $nl, $scriptname, $scriptfolder, $scopefolder;
	if(!isset($web)) $web = @$_REQUEST['web'];
	if(isset($web)) $web = !!$web; else $web = false; if($web==1) $nl='<br/>';
	if(!$web) { return; }
	

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$scriptfolder.'/'.$scriptname.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="'.$relative.'/controls.css" rel="stylesheet" type="text/css">';
			$o .= '<link href="'.$relative.'/api.css" rel="stylesheet" type="text/css">';
			$o .= '<link rel="shortcut icon" href="'.$relative.'/imgs/favicon.ico">';
			$o .= '<script src="'.$relative.'/js/jquery-3.2.1.js"></script>';
			$o .= '<script src="'.$relative.'/js/iscroll.52.js"></script>';
			$o .= '<script src="'.$relative.'/js/moblib.js"></script>';
			$o .= '<script src="'.$relative.'/js/datasets.js"></script>';
			$o .= '<script src="'.$relative.'/js/controls.js"></script>';
			$o .= '<script src="'.$relative.'/js/sga.js"></script>';
			$o .= '<head>';
		$o .= '<body>';
		$o .= '<h1>You are executing '.$scopefolder.$scriptfolder.'/'.$scriptname.'</h1>';
		echo $o;
	
}

function endrendermode() {
	global $web, $nl;
	if(!$web) return;
	echo '</body></html>';
}

function closeconnection($tempo = false) { // $tempo in milliseconds, 50 for 50ms

	if($tempo) usleep(1000*$tempo); // note that this maintains an open connection at server side, it is not advisable to use long tempo here
	
	// close current session (!!! you need to start an ob_start() at the top of the script, before any echo runs !!!)
	//
	// dev note 2019-10/pvh: a simpler version of this connection closing method are working on the dev environment, but do not on the server!!
	// in order to get the stuff working, here is what I did :
	// 1. add ob_start(); after ob_end_clean();
	// 2. add header('Content-Encoding: none');
	// 3. add ob_end_flush(); ob_flush();
	//
	if(session_id()) session_write_close();
	
    $fb = ob_get_contents(); $fl = strlen($fb); $filler = ''; if((4096-$fl)>0) $filler = str_repeat('1',4096-$fl);
    ob_end_clean(); // relates to (*ob1)
	
	ob_start();
    ignore_user_abort(true); 
	header('Content-Encoding: none');
    header('Content-Type: text/plain');
    header('Content-Length: '.$fl); // in the header we indicate the valuable content length only, so this is transmitted
    header('Connection: close'); 
    
	echo $fb.$filler; // flush has no effect if the buffer is not 4k at least

	// flush all output
	ob_end_flush();
	ob_flush();
	flush();
	
	ob_start(); // catch any subsequent echo, that we will never flush to client
}

function abort($errorcode, $errormsg) { 
	global $web, $nl, $script;
	echo '<error>#'.$errorcode.' in '.$script.'::'.$errormsg.'</error>'.$nl;
	endrendermode();
	die();
};


function explainstream($classname,$s,$fields) {
	global $web; if(!$web) return;
	$e = '#';
	$e.= $classname.': ';
		$S = '';
	foreach($fields as $f) { $e.= $S.' '.$f.' '; $S = $s; }
	return $e;
}

function explainclass($instance, $fields, $sep) { // set fields to false to get an overview of all fields
		
		global $web; if(!$web) return;
	
		if(is_a($instance,'C_dbGate')) {
			$dS = $instance->getNew();
			$classname = get_class($dS);
		}
		else if(is_a($instance,'C_id')) {
			$classname = get_class($instance);
			$dS = new $classname();
		}
		else 
			abort('0080','explainclass() unrecognized class instance');
		
		if(!$fields) { // 
			$fields = Array('id','parentid');
			foreach($dS->getDefaults() as $fieldname => $explained) $fields[] = $fieldname;
		}
			
		h3('class '.$classname);
		indent(explainstream($classname,$sep,$fields).'<br/>&nbsp;');
			
		// foreach($fields as $f) indent('o '.$f.': '.$dS->explain($f));
		pad();
}

function smsgacurl($url, $params, $timeout = 300) {

	$curl = curl_init();
	
	$options = array(
		CURLOPT_URL            	=> $url,
		CURLOPT_POST            => true,
		CURLOPT_POSTFIELDS		=> $params,
		CURLOPT_IPRESOLVE		=> CURL_IPRESOLVE_V4, // if you are on an IP V6 machine (like this is for localhost on Win10/EasyPHP), you need to force IP V4
		CURLOPT_RETURNTRANSFER 	=> true,
		CURLOPT_HEADER         	=> false, // would return something like: HTTP/1.1 100 Continue HTTP/1.1 200 OK Date: Thu, 10 Oct 2019 09:26:22 GMT Server: Apache Vary: Accept-Encoding Content-Encoding: gzip Content-Length: 5063 Content-Type: text/html
		CURLOPT_FOLLOWLOCATION 	=> true, // the called script is final and contents no header:location redirection
		CURLOPT_AUTOREFERER    	=> true,
		CURLOPT_TIMEOUT_MS 		=> $timeout, 
		CURLOPT_FRESH_CONNECT 	=> true,
		CURLOPT_FORBID_REUSE	=> true, //  force the connection to explicitly close when it has finished processing, and not be pooled for reuse ( KEEP_ALIVE not active )
		CURLOPT_VERBOSE 		=> false
	);
	curl_setopt_array($curl,$options);

	$response = curl_exec($curl);
	
	if(!$response) { // The server is unreachable
		$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
		$errtext = curl_error($curl);
		$errtitle = 'SMS gateaway, HTTP error: '.$code.'';
		$errurl = 'error trying to reach ['.$url.']';
		warning($errtitle.'<br/>'.$errurl.'<br/>'.$errtext);
		curl_close($curl);
		return false;
	}
	
	curl_close($curl);
	return $response;
}



//////////////////////////////////////////////////////////////////////
//
//    D B   C O N N E C T I O N 


define('list_as_string', true);
define('list_as_array', false);

class Q { // Execute very simple queries, esay and fast when no audit tracking of any kind is required
    public $result;
    public static $dbio;
    public function __construct($sql, $from=false) {
		$this->result = self::$dbio->query($sql);
		if($this->result===false) {
			$from = $from ? '<br/>'.$from : ''; 
			abort('0001','sql request err#'.self::$dbio->errno.' -> '.self::$dbio->error.'<br/>'.$sql.$from);
		}
    }
    public function __destruct() {
        if(is_object($this->result)) $this->result->close();
    }
    public function ids($coma=true) { return $this->mlist('id', $coma); }
    public function parentids($coma=true) { return $this->mlist('parentid', $coma);	}
    public function rscIds($coma=true) { return $this->mlist('resourceId', $coma);	}
    public function cnt() { $c = $this->result->num_rows; return $c; }
    public function c() { $row = $this->result->fetch_array(); if($this->result->num_rows) $this->result->data_seek(0); return $row['c']; } // returns a counter queried as c
    public function one($m='id', $default = false) { // assuming that the query returns only one row
        if($this->result->num_rows) { $row = $this->result->fetch_array(); $this->result->data_seek(0); return $row[$m]; } 
        else return $default;
    } 
    public function hits() { return self::$dbio->affected_rows; }
    public function newid() {  return self::$dbio->insert_id; }
    public static function iid() {  return self::$dbio->insert_id; }

    public function mlist($m, $coma = true) { // returns imploded list joined with coma's, or an Array
        $a = Array(); 
        if($this->result) {
            while($row = $this->result->fetch_array()) $a[] = $row[$m];
            if($this->result->num_rows) $this->result->data_seek(0); 
        }
        if(count($a)) 
            if($coma) {
                if($coma===true) $coma = ',';
                return implode($coma,$a);
            } else return $a;
        return $coma?'': Array();
    }
    public function idx($x, $y) { // returns an Array where member $x is the key and member $y is the value
        $a = Array(); 
        if($this->result) {
            while($row = $this->result->fetch_array()) $a[$row[$x]] = $row[$y];
            if($this->result->num_rows) $this->result->data_seek(0);
        }
        return $a;
    }
    public function tree($x, $y, $z) { // returns an Array where member $x is the key and member $y is the value
        $a = Array(); 
        if($this->result) {
            while($row = $this->result->fetch_array()) {
                if(!isset($a[$row[$x]])) $a[$row[$x]] = Array();
                $a[$row[$x]][$row[$y]] = $row[$z];
            }
            if($this->result->num_rows) $this->result->data_seek(0);
        }
        return $a;
    }
    public function maximum($m) {
        if(!$this->result->num_rows) return 0;
        $max = 0; 
        while($row = $this->result->fetch_array()) { if($max<$row[$m]) $max=$row[$m]; }
        $this->result->data_seek(0);
        return $max;
    }
	public static function q($sql) {
		$result = self::$dbio->query($sql);
		if($result===false) {
			abort('0001','sql request err#'.self::$dbio->errno.' -> '.self::$dbio->error.'<br/>'.$sql);
		}
		return $result;
	}
}
Q::$dbio = new mysqli('localhost'/*host*/, 'queuing_daemon' /*user*/, '1970'/*pass*/, 'smsgateaway'/*DB name*/);
if(mysqli_connect_errno())
	abort('0000','Q::__construct() - DB Connection Error : '.mysqli_connect_errno().' - '.mysqli_connect_error());
mysqli_set_charset(Q::$dbio,'utf8mb4');



function jsArgument($utf8string) { // makes the string field readable for javascript
    $cr = chr(13); global $nl;
    $jsStream = str_replace($cr.$nl, '\n', $utf8string);
    $jsStream = str_replace($nl, '\n', $jsStream);
    $jsStream = str_replace('"', '\"', $jsStream);
    return $jsStream;
}
function csvArgument($utf8string) { // makes the string field readable for csv format

	$csvStream = str_replace('"', '""', $utf8string); // doubles any double quote (csv protocol), see (*csv*)
    $csvStream = '"'.$csvStream.'"';
    return $csvStream;
}




////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   S M S   G A T E A W A Y   /   C L A S S E S 
//
//////////////////////////////////////////////////////////////////////
//
//    

define('with_tracking', true);
define('no_tracking', false);

abstract class C_id { // Executes simple queries and match the result to a child object

    public $id;	
    public $parentid; // default dS values are set here, along with id and parentid
	
	
    public static $accesslog;
    public static $accesslogMembers;

	public static function tracknow() { return Date('Y-m-d H:i:s',time()); } // time format used for change tracking
	
    public function __construct($id=0, $parentid=false, $preset=false) {

        $this->id = 0;
        $this->parentid = 0;

        $avoid = array('id', 'parentid');
        // load from db OR load default values

        if($id > 0) { // EXISTING dS

            $t = $this->getTableName(); // obtain from child instance
            $result = Q::q('SELECT * FROM '.$t.' WHERE id = '.$id.';', 'C_id::__construct(table:'.$t.', id:'.$id.')');
            if(!$result->num_rows) 
                if(property_exists($this,'archived')) // when the object has an archive_ table, also lookup this archive_table (*ar01)
                    $result = Q::q('SELECT * FROM archive_'.$t.' WHERE id = '.$id.';', 'C_id::__construct(table:archive_'.$t.', id:'.$id.')');
            if($result->num_rows) {
                $row = $result->fetch_array();
                foreach($this as $member => &$value) $value = $row[$member]; unset($value);
            }
            $result->close();	
        }
        else {  // NEW dS

			if($id===false) {
				// explicit intention to skip the default values setup
			} else {
				// new object, set default values
				$defaults = $this->getDefaults();
				foreach($this as $member => &$value) 
					if(array_search($member, $avoid) === false) // no overwrite for generic members
						$value = $defaults[$member];
				unset($value);
				$this->id = $id;
				$this->parentid = $parentid;
			}
        }

        // Option: copy from the preset object (it must have the same class of course!)
        if(is_object($preset)) {  // the preset is an o_dS_
            foreach($this as $member => &$value) 
                if(array_search($member, $avoid) === false) // no overwrite for generic members
                    $value = $preset->{$member};
            unset($value);
        }

        // Option: copy from array (typically used when posting, array is a $_POST)			
        if(is_array($preset)) {  // the preset is an array, it can be e.g. $_POST 
            foreach($this as $member => &$value) 
                if(array_key_exists($member, $preset)) // the preset must not contain all members, some of them will do
                    if($member!='id')
                        $value = $preset[$member];
            unset($value);
        }

    }
    public function __destruct() { }
    public function __clone() { }

	
    public function getInsertFieldsList()	{ 
        $fields = Array();
        foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
        else $fields[] = '`'.$member.'`'; 	
        return implode(',',$fields);
    }
    public function getInsertValuesList()	{ 
        $values = Array();
        foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
        else $values[] = '"'.addslashes($value).'"'; // see (*as*)
        return implode(',',$values);
    }
    public function getUpdateFieldsList() {
        $assigns = Array();
        foreach($this as $member => $value)
            if( $member=='id' || $member=='parentid' ) continue;
        else $assigns[] = '`'.$member.'`'.'="'.addslashes($value).'"'; // see (*as*)
        return implode(',',$assigns);
    }

    public function save($parentid = false) {
        if($parentid) $this->parentid = $parentid; // a new parentid was specified (usefull for linking new objects to their hierarchy)
        $here = 'C_id::save()';

        if($this->id <= 0) {
            Q::q('INSERT INTO '.$this->getTableName().' ( '.$this->getInsertFieldsList().' ) VALUES ('.$this->getInsertValuesList().')',$here);
            $this->id = $newId = Q::iid(); // get insert id
        }
        else
            Q::q('UPDATE '.$this->getTableName().' SET '.$this->getUpdateFieldsList().' WHERE id ='.$this->id.';',$here);

        return $this;
    }
    public function delete() { // deletes one objects in this instance, virtual or replica
        Q::q('DELETE FROM '.$this->getTableName().' WHERE id = '.$this->id.';', 'C_id::dSdelete()');
        if(property_exists($this,'archived')) 
            Q::q('DELETE FROM archive_'.$this->getTableName().' WHERE id = '.$this->id.';', 'C_id::dSdelete()');
        return $this;
    }

    public function stream($tracking = with_tracking, $sep = '|', $includeOnly = false) { // if tracking is true, access log members are streamed along
        $fields = array();
        $csv = $sep==';'; // csv format is assumed when separator is ";"
        $ml = static::$multilines; // multi lines allowed fields list


        if($includeOnly) { // stream only selected members
			foreach($includeOnly as $member) { // members "� la carte"
                $v = $this->{$member};
				if($ml) if($v)
				if(isset($ml[$member])) { // based on value and not on $defaults, because $includeOnly fields may contain custom values like 'prebooking'
					if($csv) $v = csvArgument($v); 
						else if(preg_match('/["\r\n]/', $v)) $v = jsArgument($v);
				}
                $fields[] = $v;
            }
            $fields = implode($sep,$fields);
            return $fields;

        } else { // streams all objects members

			$defaults = static::$defaults;
			$ids = $this->id.$sep.$this->parentid; // note that id and groupId have no default values
			$accesslog = '';
			if($tracking) {
                $accesslog = Array();
                foreach(C_id::$accesslog as $alm => $v) { // multiple inheritance stages do mix the members order list, we need to re-shape this before streaming
                    if(isset($this->{$alm})) $accesslog[] = $this->{$alm};
                }
                $accesslog = implode($sep,$accesslog); 
                if($accesslog) $accesslog = $sep.$accesslog;
			}
			foreach($defaults as $member => $dfv) {
				
                $v = $this->{$member};
				if($ml) if($v)
				if(isset($ml[$member])) { // based on value and not on $defaults, because $includeOnly fields may contain custom values like 'prebooking'
					if($csv) $v = csvArgument($v); 
						else if(preg_match('/["\r\n]/', $v)) $v = jsArgument($v);
				}
                $fields[] = $v;
            }
            $fields = $sep.implode($sep,$fields);
			
			return $ids.$accesslog.$fields;
			
        }
    }

    public function stream1($wt = with_tracking, $sep = '|', $includeOnly = false, $bank = false) { 
        // an equivalent of this function for multi-data sets streaming exists in C_dbGate::stream()
        global $nl;
        if($bank) $bank = '#'.$bank; else $bank = '';
        return '#'.$this->getClassName().$bank.$nl.$this->stream($wt, $sep, $includeOnly); 
    }

    public function memberslist($tracking = false, $sep = '|') { 
        $fields = array();
        $defaults = static::$defaults;
        $ids = array('id'=>0, 'parentid'=>0); // note that id and parentid have no default values
        $accesslog = array();

        foreach($this as $member => $value) { // scans the full instance (inherited members included)
            if(array_key_exists($member, $ids)) { $ids[$member] = $member; continue; }
            if(array_key_exists($member, self::$accesslog)) { if($tracking) $accesslog[$member] = $member; continue; } 

            // for all other specific members
            $quotes = true; // by default, quotes will frame the values
            if(isset($defaults[$member]))
                if(is_int($defaults[$member])) $quotes = false; // double quotes are not needed for integer values
            $fields[] = $quotes ? jsArgument($member) : $member;
        }
        if($tracking) {
            $ordered = Array();
            foreach(self::$accesslog as $m => $v) { // multiple inheritance stages do mix the members order list, we need to re-shape this before streaming
                if(isset($accesslog[$m])) $ordered[$m] = $accesslog[$m];
            }
            $accesslog = implode($sep,$ordered); 
            if($accesslog) $accesslog = $sep.$accesslog;

        } else $accesslog = '';

        $ids = implode($sep,$ids);
        $fields = $sep.implode($sep,$fields);

        return $ids.$accesslog.$fields;
    }


    public function idDropStringRef($field, $id) { // applies to fields where reference ids are stringed like '4589!5462!6589!1212'

        // id is e.g. 5462 this function changes the field into '4589!6589!1212', so it drops the reference $id from it
        $string = $this->{$field};
        if($string=='-' || $string=='') return; // nothing to change
        $split = explode('!', $string); 
        if(in_array($id, $split)) { 
            foreach($split as $x => $item) if($id == $item) break; // localize the to be dropped
            array_splice($split, $x, 1); // drop it
            $string = implode('!',$split); // rebuild the !string
        }
        $this->{$field} = $string;
    }
    public function idMoreStringRef($field, $id) { // applies to fields where reference ids are stringed like '4589!6589!1212'

        // id is e.g. 1170 this function changes the field into '4589!6589!1212!1170', so it drops the reference $id from it
        $string = $this->{$field};
        if($string=='-' || $string=='') { $this->{$field} = $id; return; }; // this is the first id to be put in the string
        
		$split = explode('!', $string); 
        if(!in_array($id,$split)) $split[] = $id; // avoid double reference
        $string = implode('!',$split);
        $this->{$field} = $string;
    }
	
	public function trackexplained($f) { // used for tutorial on api
		$explained = array(
			'id' 			=> 'unique identifier in Mobminder system',
			'parentid' 		=> 'parent object unique identifier',
			
			'changerId' 	=> 'login id of the last changer of this object',
			'changer' 		=> 'login name at the change time of this object',
			'changed' 		=> 'time at last change on this object',
			
			'creatorId' 	=> 'login id of the creator of this object',
			'creator' 		=> 'login name at the creation time of this object',
			'created' 		=> 'time at creation of this object',
			
			'deletorId' 	=> 'login id of the last deletor of this object',
			'deleted' 		=> 'time at deletion of this object'
		);
		if(!isset($explained[$f])) return 'no description for '.$f; else return $explained[$f];
	}
}

	// there is no deletor name, because system tasks will never delete business objects
	// creator and changer names are foreseen for system tasks that do not have login Ids
C_id::$accesslog = array('created'=>0, 'creator'=>0, 'creatorId'=>0, 'changed'=>0, 'changer'=>0, 'changerId'=>0, 'deleted'=>0, 'deletorId'=>0 );
C_id::$accesslogMembers = array('created', 'creator', 'creatorId', 'changed', 'changer', 'changerId', 'deleted', 'deletorId', 'skeyId', 'localId', 'remoteId' );



//  id to parent relationship:  organizes account ownership
//
//
//                       login   
//                    /        \
//                   /          \
//                  / 1:n        \ 1:n
//                 /              \
//                /                \
//           queue                   satellite  
//          /    \               /     |     \
//         /      \             /      |      \
//        /1:n     \ 1:n       /       |       \
//       /          \         /        |        \
//     sms         sms      sms       sms       sms 
//
//
//
//  patch relationship: organizes which satellite serves which queues
//
//	
//                     queue A                  queue B   
//                    /        \              /
//                   /          \            /
//                  / 1:n        \ 1:n      / 1:n
//                 /              \        /
//                /                \      /
//           satellite            satellite  
//          /    \               /     |    \
//         /      \             /      |     \
//        /1:n     \ 1:n       /       |      \
//       /          \         /        |       \
//     sms         sms      sms       sms       sms 
//
//
//
//  cluster patch organisation: allows to route SMSs to the parent operator SIM
//
//	
//
//                             queue C  
//                            /   |   \
//                           /    |    \
//                          /     |     \
//                         /      |      \
//                        /       |       \
//                       /        |        \
//                satellite   satellite   satellite
//                proximus     orange      base
//
//


//////////////////////////////////////////////////////////////////////
//
//    S A T E L L I T E 
//
// ICCID : Integrated Circuit Card Identifier - A SIM card contains its unique serial number (ICCID)
// 
// The format of the ICCID is: MMCC IINN NNNN NNNN NN C x
//
//
// � MM = Constant (ISO 7812 Major Industry Identifier, = 89 for "Telecommunications administrations and private operating agencies")
// � CC = Country Code (i.e. 61 = Australia, 86 = China)
// � II = Issuer Identifier (AAPT = 14, EZI-PhoneCard = 88, Hutchison = 06, Optus = 02/12/21/23, Telstra = 01, Telstra Business = 00/61/62, Vodafone = 03)
// � N{12} = Account ID ("SIM number")
// � C = Checksum calculated from the other 19 digits using the Luhn algorithm.
// � x = An extra 20th digit is returned by the 'AT!ICCID?' command, but doesn't seem to be an official part of the ICCID.
//
// Example
//
//   8932 00 21 0034 7095 21 0 F
//   MMCC II 12 3456 7890 12 C x
//
// 

class C_dS_satellite extends C_id { // parents to a login

	public static $current_satellites = SATELLITES; // '.C_dS_patch::$current_patches.' // current in use patch table

	// 
	//
	// 
    public function getTableName() { return self::$current_satellites; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset); 
	}
    public $sim; 		// Subscriber Identity Module (SIM phone number) not that PIN code is disabled
    public $iccid; 		// Personal identification number (SIM PIN)
    public $puk; 		// Puk code for this SIM
    public $name;		// satellite name as assigned at server side, like "Wavre"
    public $sat;		// satellite name as assigned in sms.cnf file, on the client pool or satellite
    public $port;		// satellite port, like "ttyASM01"
    public $operator;	// satellite operator, like [ proximus, telenet, orange ], if empty, then this satellite is not part of a cluster
    public $lag;		// typical lag for this satellite, in seconds
		public $lastseen;	// last time this satellite fetched for sms
		public $swversion;	// software version as reported by satellite (after an update, it should align with the sw version in /satellite/bin/)
		public $swsignatr;	// software signature as reported by satellite (after an update, this signature is subject to change)
		public $lastcsq;	// last carrier signal quality reported (through alive.php)
		public $lastptmp;	// last processor temperature reported (through alive.php)
		public $fetchever;			// number of SMS sent so far
		
		public $fetchthishour;		
		public $thishour404;	
		public $fetchlasthour;		
		public $lasthour404;	
		
		public $fetchthisday;	
		public $today404;	
		
		public $fetchyesterday;		
		public $fetchthisweek;		
		public $fetchlastweek;		
		public $fetchthismonth;		
		public $fetchlastmonth;		
		public $color;		// number of feedbacks provided so far
		public $enabled;	// indicates if this satellite is still in use, this is changed manually to 0 

		public $status;
		public $owner;


	public static $threshold_smsperday = 120;   // thresholds for dashboard alerts, see also (*th01*)
	public static $threshold_smspermonth = 8000;
	public static $threshold_mincsq = 12;
	public static $threshold_maxcsq = 99;
	public static $threshold_prcmaxtmp = 60;
	
	//public static $alert_color_red = 'font-weight:bold; color:red;';
	public static $alert_color_red = 'color:red;';
	public static $alert_color_orange = 'font-weight:bold; color:orange;';
	public static $alert_color_purple = 'font-weight:bold; color:purple;';
	
	public static function login($iccid,$errorifnotexists=true) { // login from satellite perspective, using an iccid id
		
		if(!is_numeric($iccid)) die('error 0021'); // ICCID must be numeric
		if($iccid<'8932000000000000000' || $iccid>'8932990000000000000') die('error 0022'); // invalid ICCID range
			
			$sats = self::$current_satellites;
		$q = new Q('select id from '.$sats.' where iccid = "'.$iccid.'";'); // identify the caller
		$c = $q->cnt();
		if($c==0)
		{
			if($errorifnotexists) 
				die('error 0023'); // unrecognised SIM id
			else
				return null; //returns null if does not exist
		}
		if($c>1) die('error 0024');  // multiple match for this SIM
		$satid = $q->ids();
		$dS_sat = new C_dS_satellite($satid,0);  // satellite is recovered from iccid
		return $dS_sat;
	}
	
    public static $multilines = false;
    public static $defaults = array( 
        'sim' 		=> 0,
        'iccid' 	=> 'MMCCII123456789012C',
        'puk' 		=> '123456',
        'name' 		=> 'satellite',
        'sat' 		=> 'sat',
        'port' 		=> 'port',
        'operator' 	=> 'operator',
        'lag' 		=> 20,
		'lastseen' 		=> 'never',
		'swversion' 	=> '20190925', // format [YYYYMMDD]
		'swsignatr' 	=> 'V01.01', // format varchar 12
		'lastcsq' 		=> 99,
		'lastptmp' 		=> 40,
			
        'fetchever' 	=> 0,	
		
        'fetchthishour' => 0,
        'thishour404' 	=> 0,
        'fetchlasthour' => 0,
        'lasthour404' 	=> 0,
		
        'fetchthisday' 		=> 0,
        'today404' 			=> 0,
        'fetchyesterday' 	=> 0,
		
        'fetchthisweek' => 0,
        'fetchlastweek' => 0,
		
		'fetchthismonth'=> 0,
		'fetchlastmonth'=> 0,
		
		'color' 		=> '#FF0000',
		'enabled' 		=> 0,

		'status' 		=> 30,
		'owner' 		=> ''
    );
	public function queues() {
			
		$q = new Q('select queueid as id from '.C_dS_patch::$current_patches.' where satelliteid = '.$this->id.';');
		$qids = $q->ids(list_as_array);
		$queues = Array();
		if(count($qids)) 
			foreach($qids as $qid)
				$queues[$qid] = new C_dS_queue($qid);
		
		return $queues;
		
	}
	//-1. recall is used just after a timeout network error occured on smsbox when calling alive.php
	//it force server to resend last 110 status sms if exists
	public function feedWithRecall() {
		$q = new Q($sql='select id from sms 
		where status = '.sms_status_satellite.' 
		and satelliteid = '.$this->id.' 
		order by id desc limit 1;');
		$id=$q->ids(list_as_string);
		if($id) return $sms = new C_dS_sms($id);
		else return false;
	}
	
	public function feed() {
		
		$satoperator = $this->operator;
		
		// Note we feed satellites with following order of priority
		// -1. check if a 110 sms was sent for this satellite
		// 0. sms with parentid = satellite id (push from dashboard)
		// 1. queueless sms high priority
		// 2. priority low for satellite dedicated outbound: pop from the SMS, only if the priority is  0 and the queue id matches a satellite id ( > 1000 )
		// 3. queued sms by order of priority
		// 4. queueless sms normal priority ( =0 )
		
		// (*sg02*) note that queries in this function have no join to hlr lookup table, which is performance purpose
		
		// execution sequence in this function is by order of priority

		
		//-1. recall is used just after a timeout network error occured on smsbox when calling alive.php
		//it force server to resend last 110 status sms if exists
		/*if($recall)
		{
			$q = new Q($sql='select id from sms 
			where status = '.sms_status_satellite.' 
			and satelliteid = '.$this->id.' 
			order by id desc limit 1;');
			$id=$q->ids(list_as_string);
			if($id) return $sms = new C_dS_sms($id);
		}*/
		
		// 0. priority high for satellite dedicated outbound: pop from the SMS, only if the priority is higher than 0 and the queue id matches a satellite id ( > 1000 )
		//
		//
		//	
		$q = new Q($sql='select id from sms 
			where parentid = '.$this->id.' and status = '.sms_status_created.' and priority > 0
			order by priority desc, id asc limit 1;');
				
		$id=$q->ids(list_as_string);
		if($id) return $sms = new C_dS_sms($id);
		
		
		
		// 1. priority high: pop from the "no queue" SMS, only if the priority is higher than 0 ( no patch table in the way )
		//
		//
		// (*sg02*) note that queries in this function have no join to hlr lookup table, which is performance purpose
		
		$q = new Q($sql='select id from sms 
			where parentid = 0 and status = '.sms_status_created.' and priority > 0 and home = "'.$satoperator.'"
			order by priority desc, id asc limit 1;');
				
		$id=$q->ids(list_as_string); 
		if($id) return $sms = new C_dS_sms($id);
		
		
		// 2. priority low for satellite dedicated outbound: pop from the SMS, only if the priority is  0 and the queue id matches a satellite id ( > 1000 )
		//
		//
		//	
		$q = new Q($sql='select id from sms 
			where parentid = '.$this->id.' and status = '.sms_status_created.' and priority = 0
			order by priority desc, id asc limit 1;');
				
		$id=$q->ids(list_as_string);
		if($id) return $sms = new C_dS_sms($id);
		
		
		
		// 3. pop from the queued SMS, highest priority first ( uses the path table )
		//
		// We want the sms.operator to be defined by the queue patch, not by the home operator of the SIM card in the satellite.
		// e.g. From queue 601, we want satellite 1002 to send to proximus only. The patch in this case is [id,601,1002,proximus]
		// e.g. From queue 606, we want satellite 1002 to send to any operator. The patch will be like  [id,606,1002,%]  Note that % will solve the SAL wuery on "any operator"
		//
		// So you need to be clever enough to arrange the patches in such a way that proximus recipient are sent by proximus satellites, orange to orange etc... 
		//  
				
		$q = new Q('select sms.id from sms
					right join '.C_dS_patch::$current_patches.' on '.C_dS_patch::$current_patches.'.satelliteid = '.$this->id.' and '.C_dS_patch::$current_patches.'.queueid = sms.parentid
					where status = '.sms_status_created.' and sms.home like ('.C_dS_patch::$current_patches.'.operator) 
						and sms.mod1000 >= ('.C_dS_patch::$current_patches.'.n_sup_to) and sms.mod1000 < ('.C_dS_patch::$current_patches.'.n_inf_to)
					order by sms.priority desc, sms.id asc limit 1');
					
		$id = $q->ids(list_as_string);
		if($id) return $sms = new C_dS_sms($id);
		
		
		// 4. priority low: pop from the queueless SMS where priority is 0 ( no patch table in the way )
		$q = new Q($sql='select id from sms 
			where parentid = 0 and status = '.sms_status_created.' and priority = 0 and home = "'.$satoperator.'"
			order by priority desc, id asc limit 1;');
				

		$id=$q->ids(list_as_string); 
		if($id) return $sms = new C_dS_sms($id);
		
		return false;

	}
	
	public function patches() {	
		$patches = C_dS_patch::loadforsatellite($this->id);
		return $patches;
	}	
	
	public static $explained = array( 
        'id' 			=> 'satellide unique id [integer ranging 10##]',	
        'parentid' 		=> 'login unique id [bigint ranging 9##]',	
        'sim' 			=> 'satellite SIM card mobile number, like 32497123456',	
        'iccid' 		=> 'satellite SIM card ICCID number (each call from satellite sends it)',		
        'puk' 			=> 'puk code for the SIM card (when initialized, our SIM card have PIN code set to NULL)',		
        'name' 			=> 'satellite name',	
        'sat' 			=> 'satellite name as assigned in sms.cnf file, on the client pool or satellite',	
        'port' 			=> 'satellite port, like "ttyASM01"',	
        'operator' 		=> 'SIM card operator [prox, orange, base]',	
        'lag' 			=> 'typical lag time in seconds between sending 2 SMS',	
        'lastseen' 		=> 'date/time of last call to api/staellite/alive.php',	
        'swversion' 	=> 'software version as reported by satellite ( format like [YYYYMMDD], e.g. 20190925 )',	
        'swsignatr' 	=> 'software signature as reported by satellite ( format like [V.01.01] )',	
        'lastcsq' 		=> 'last carrier signal quality reported (through alive.php) [1-31, 99], 99 means no network',	
        'lastptmp' 		=> 'last satellite processor temperature',	
		
        'fetchever' 	=> 'total number of SMS fetched so far',	
		
        'fetchthishour' => 'number of SMS fetched in the current hour (automatic reset every hour)',
        'fetchlasthour' => 'number of SMS fetched in the current hour (automatic reset every hour)',
		
        'fetchthisday' 	=> 'number of SMS fetched in the current day (automatic reset every day at midnight)',
        'fetchyesterday' => 'number of SMS fetched yesterday',
		
        'fetchthisweek' => 'number of SMS fetched in the current week (automatic reset every week on sunday)',
        'fetchlastweek' => 'number of SMS fetched in the current week (automatic reset every week on sunday)',
		
		'fetchthismonth'=> 'number of SMS fetched in the current month (automatic reset every month 1st at midnight)',
		'fetchlastmonth'=> 'number of SMS fetched in the last month',
		
		'color' 		=> 'display color on api in web mode',
		'enabled' 		=> '[0: disabled, 1:enabled], when disabled, no SMS is dispatched to this satellite',

		'status' 		=> '',
		'owner' 		=> '',
    );
    	

	public static function gethtmlheader() { 
		$c=0; $ths = Array();
			$ths[] = '<th>'.'operator'.'</th>'; $c++;
			$ths[] = '<th>'.'name'.'</th>'; $c++;
			$ths[] = '<th>'.'status'.'</th>'; $c++;
			$ths[] = '<th>'.'owner'.'</th>'; $c++;
			$ths[] = '<th>'.'rpi'.'</th>'; $c++;
			$ths[] = '<th>'.'port'.'</th>'; $c++;
			$ths[] = '<th>'.'lastseen'.'</th>'; $c++;
			$ths[] = '<th>'.'csq'.'</th>'; $c++;
			/*$ths[] = '<th>'.'temp.(°C)'.'</th>'; $c++;*/
			$ths[] = '<th style="min-width:3em;">'.'hour<br>total'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'hour<br>404'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'hour-1<br>total'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'hour-1<br>404'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'today<br>total'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'today<br>404'.'</th>'; $c++;
			$ths[] = '<th>'.'yest'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}	 

	private static $jsrowinteractive = 'onclick="onsat(this.id)"'; // (*al01*)

    public function gethtmlrow() {
		$tds = Array();
		$ac = self::$alert_color_red;
		
    	$tds[] = '<td style="font-weight:bold; color:'.$this->color.'">'.$this->operator.'</td>';
		$tds[] = '<td>'.$this->name.'</td>';

		$lstatuscolor = '';
	  	if($this->status!=10 && $this->status!=30) $lstatuscolor = $ac;
		$tds[] = '<td style="'.$lstatuscolor.'">'.getSlotStatusByCode($this->status).'</td>';

		 
		 $tds[] = '<td>'.$this->owner.'</td>';
		 $tds[] = '<td>'.$this->sat.'</td>';
		 $tds[] = '<td>'.$this->port.'</td>';
		 
		 	$time = date("Y-m-d H:i:s", strtotime('-90 second'));
    		$lseencolor = '';
		 	if($this->lastseen<$time) $lseencolor = $ac;
		 $tds[] = '<td style="'.$lseencolor.'">'.$this->lastseen.'</td>';
		 
		 	$csqcolor = '';
		 	if($this->lastcsq<=self::$threshold_mincsq || $this->lastcsq>=self::$threshold_maxcsq) $csqcolor = $ac;
		 $tds[] = '<td style="'.$csqcolor.'">'.$this->lastcsq.'</td>';
		 
		 	//$tptmpcolor = '';
		 	//if($this->lastptmp>=self::$threshold_prcmaxtmp) $tptmpcolor = $ac;
		 //$tds[] = '<td style="'.$tptmpcolor.'">'.$this->lastptmp.'</td>';
		 
		 
		 $tds[] = '<td>'.$this->fetchthishour.'</td>';
			$c404 = ''; if($this->fetchthishour<(3*$this->thishour404)) $c404 = $ac;
		 $tds[] = '<td style="'.$c404.'">'.$this->thishour404.'</td>';
		 
		 $tds[] = '<td>'.$this->fetchlasthour.'</td>';
			$c404 = ''; if($this->fetchlasthour<(3*$this->lasthour404)) $c404 = $ac;
		 $tds[] = '<td style="'.$c404.'">'.$this->lasthour404.'</td>';
		 
		 
		 	$daycolor = '';
		 	if($this->fetchthisday>=self::$threshold_smsperday) $daycolor = $ac;
		 $tds[] = '<td style="'.$daycolor.'">'.$this->fetchthisday.'</td>';
		 
			$c404 = ''; if($this->fetchthisday<(3*$this->today404)) $c404 = $ac;
		 $tds[] = '<td style="'.$c404.'">'.$this->today404.'</td>';
		 
		 	$yesterdaycolor = '';
		 	if($this->fetchyesterday>=self::$threshold_smsperday) $yesterdaycolor = $ac;
		 $tds[] = '<td style="'.$yesterdaycolor.'">'.$this->fetchyesterday.'</td>';
		 
		 return '<tr '.self::$jsrowinteractive.' id="'.$this->id.'">'.implode('',$tds).'</tr>';
    }

    public function gethtmlmonitoring() {
    	$thead = '<thead>'.self::gethtmlheader().'</thead>';
		$tbody = '<tbody>'.$this->gethtmlrow().'</tbody>';
		$table = '<table>'.$thead.$tbody.'</table>';
		return $table;
    }

    public static function gethtmlsatheadersid() { 
		$c=0; $ths = Array();
		$ths[] = '<th>'.'id'.'</th>'; $c++;
		$ths[] = '<th>'.'name'.'</th>'; $c++;
		$ths[] = '<th>'.'sat'.'</th>'; $c++;
		$ths[] = '<th>'.'port'.'</th>'; $c++;
		$ths[] = '<th>'.'operator'.'</th>'; $c++;
		$ths[] = '<th>'.'caller id'.'</th>'; $c++;
		$ths[] = '<th>'.'puk'.'</th>'; $c++;
		$ths[] = '<th>'.'iccid'.'</th>'; $c++;
		$ths[] = '<th>'.'lag'.'</th>'; $c++;
		$ths[] = '<th>'.'lastseen'.'</th>'; $c++;
		$ths[] = '<th>'.'sw v'.'</th>'; $c++;
		$ths[] = '<th>'.'sw s'.'</th>'; $c++;
		$ths[] = '<th>'.'csq'.'</th>'; $c++;
		$ths[] = '<th>'.'temp'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;		
    }

    public function gethtmlsatidentification() {
		$tds = Array();
		$ac = self::$alert_color_red;
		
    	$tds[] = '<td>'.$this->id.'</td>';
    	$tds[] = '<td>'.$this->name.'</td>';
    	$tds[] = '<td>'.$this->sat.'</td>';
    	$tds[] = '<td>'.$this->port.'</td>';
    	$tds[] = '<td style="font-weight:bold; color:'.$this->color.'">'.$this->operator.'</td>';
    	$tds[] = '<td>'.$this->sim.'</td>';
    	$tds[] = '<td>'.$this->puk.'</td>';
    	$tds[] = '<td>'.$this->iccid.'</td>';
    	$tds[] = '<td>'.$this->lag.'</td>';
    		$time = date("Y-m-d H:i:s", strtotime('-60 second'));
    		$lseencolor = '';
		 	if($this->lastseen<$time) $lseencolor = $ac;
    	$tds[] = '<td style=" '.$lseencolor.'">'.$this->lastseen.'</td>';
    	$tds[] = '<td>'.$this->swversion.'</td>';
    	$tds[] = '<td>'.$this->swsignatr.'</td>';
    		$csqcolor = '';
		 	if($this->lastcsq<=self::$threshold_mincsq || $this->lastcsq>=self::$threshold_maxcsq) $csqcolor = $ac;
    	$tds[] = '<td style=" '.$csqcolor.'">'.$this->lastcsq.'</td>';
    		$tptmpcolor = '';
		 	if($this->lastptmp>=self::$threshold_prcmaxtmp) $tptmpcolor = $ac;
    	$tds[] = '<td style=" '.$tptmpcolor.'">'.$this->lastptmp.'</td>';
    	return '<tr '.self::$jsrowinteractive.' id="'.$this->id.'">'.implode('',$tds).'</tr>';
    }

	public static function gethtmlcountheaders() { 
		$c=0; $ths = Array();
			$ths[] = '<th>'.'operator'.'</th>'; $c++;
			$ths[] = '<th>'.'name'.'</th>'; $c++;
			$ths[] = '<th>'.'ever'.'</th>'; $c++;

			$ths[] = '<th style="min-width:3em;">'.'h'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'404'.'</th>'; $c++;

			$ths[] = '<th style="min-width:3em;">'.'h-1'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'404'.'</th>'; $c++;

			$ths[] = '<th style="min-width:3em;">'.'today'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'404'.'</th>'; $c++;
			
			$ths[] = '<th>'.'yesterday'.'</th>'; $c++;
			$ths[] = '<th>'.'this week'.'</th>'; $c++;
			$ths[] = '<th>'.'last week'.'</th>'; $c++;
			$ths[] = '<th>'.'this month'.'</th>'; $c++;
			$ths[] = '<th>'.'last month'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}    

    public function gethtmlcounters() {
			$tds = Array();
			$ac = self::$alert_color_red;
		
    	$tds[] = '<td style="font-weight:bold; color:'.$this->color.'">'.$this->operator.'</td>';
    	$tds[] = '<td>'.$this->name.'</td>';
    	$tds[] = '<td>'.$this->fetchever.'</td>';
    	$tds[] = '<td>'.$this->fetchthishour.'</td>';
		
			$c404 = ''; if($this->fetchthishour<(3*$this->thishour404)) $c404 = $ac;
		$tds[] = '<td style="'.$c404.'">'.$this->thishour404.'</td>';
		 
    	$tds[] = '<td>'.$this->fetchlasthour.'</td>';
		
			$c404 = ''; if($this->fetchlasthour<(3*$this->lasthour404)) $c404 = $ac;
		 $tds[] = '<td style="'.$c404.'">'.$this->lasthour404.'</td>';
		
    		$daycolor = '';	if($this->fetchthisday>=self::$threshold_smsperday) $daycolor = $ac;
    	$tds[] = '<td style=" '.$daycolor.'">'.$this->fetchthisday.'</td>';
		
			$c404 = ''; if($this->fetchthisday<(3*$this->today404)) $c404 = $ac;
		$tds[] = '<td style="'.$c404.'">'.$this->today404.'</td>';
		 
		
    		$yesterdaycolor = '';
		 	if($this->fetchyesterday>=self::$threshold_smsperday) $yesterdaycolor = $ac;
    	$tds[] = '<td style=" '.$yesterdaycolor.'">'.$this->fetchyesterday.'</td>';
		
    	$tds[] = '<td>'.$this->fetchthisweek.'</td>';
    	$tds[] = '<td>'.$this->fetchlastweek.'</td>';
    		$monthcolor = '';
		 	if($this->fetchthismonth>=self::$threshold_smspermonth) $monthcolor = $ac;
			
    	$tds[] = '<td style=" '.$monthcolor.'">'.$this->fetchthismonth.'</td>';
    		$lmonthcolor = '';
		 	if($this->fetchlastmonth>=self::$threshold_smspermonth) $lmonthcolor = $ac;
			
    	$tds[] = '<td style=" '.$lmonthcolor.'">'.$this->fetchlastmonth.'</td>';
		
    	return '<tr '.self::$jsrowinteractive.' id="'.$this->id.'">'.implode('',$tds).'</tr>';
    }
}


// User API status ///////////// Keep following definitons inline with (*smsga09*)
//
define('sms_status_created'		, 100);	// set by gateaway at queue input
define('sms_status_expired'		, 800); // lifetime felt down to 0, status set by gateaway
define('sms_status_satellite'	, 110);	// set by gateaway at satellite request
define('sms_status_operator'	, 120);	// provided by satellite at handover to operator (opid is known at that moment)
define('sms_status_pending'		, 190); // provided by satellite
define('sms_status_delivered'	, 200);	// delivered
define('sms_status_error'		, 404); // sms was not accepted by operator (wrong number can be a reason)
define('sms_status_dead'		, 405); // hlr lookup revealed number not in service
define('sms_status_discarded'	, 999); // set by discard.php procedure called from user, so to prepare bunches of SMS for deletion by cron task





function getstatusarray($which = 'array') {
	$r = array();
	$a = array(	 sms_status_created
				,sms_status_satellite
				,sms_status_operator
				,sms_status_pending
				,sms_status_delivered
				,sms_status_error
				,sms_status_dead
				,sms_status_expired);
	switch($which) {
		case 'named': 
			$n = array('created','satellite','operator','pending','delivered','error','expired','discarded');
			foreach($a as $x => $value) $r[$value] = $n[$x];
			break;
		case 'values':
			return $a;
			break;
		case 'array': default: 
			foreach($a as $value) $r[$value] = array();
	}
	return $r;
}

function getopstatusarray($which = 'array') {
	$r = array();
	$a = array( 0xAA,  0xEE,  0x00,  0x01,  
				0x02,  0x20,  0x21,  0x22,  0x23,  	0x24,  	0x25,  
				0x40,  0x41,  0x42,	 0x43,	0x44,	0x45,	0x46,	0x47,	0x48,	0x49,
				0x60,  0x61,  0x62,  0x63,  0x65,
				0x70	);
				
	$b = array('0xAA','0xEE','0x00','0x01'
				,'0x02','0x20','0x21','0x22','0x23','0x24','0x25'
				,'0x40','0x41','0x42','0x43','0x44','0x45','0x46','0x47','0x48','0x49'
				,'0x60','0x61','0x62','0x63','0x65'
				,'0x70');
				
	switch($which) {
		case 'named': 
			$n = array(  'accepted','rejected','delivered','forwarded','replaced'
						,'congestion','device busy','device no response','device rejects','no QOS','device error'
						,'rpc error','incompatible','no connection','not obtainable','no QOS','no internet','expired','deleted by sender','deleted by smc','does not exists'
						,'Remote procedure error','Incompatible destination','Connection rejected by the SME','Not obtainable','No interworking available'
						,'Message validity period expired/ or blocked?');
			foreach($a as $x => $value) $r[$value] = $n[$x];
			break;
		case 'values':
			return $a;
			break;
		case 'array': default: 
			foreach($a as $value) $r[$value] = array();
	}
	return $r;
}



// Operator status codes as provided by satellites SIM shields
//
// public enum ESmsReportStatus
// {
        // Success = 0x00, 				// Short message delivered successfully
        // Forwarded = 0x01, 			// Forwarded, but status unknown
        // Replaced = 0x02, 			// Replaced
		
        // Congestion = 0x20, 			// Congestion, still trying
        // Recipientbusy = 0x21, 		// Recipient busy, still trying
        // NoResponseRecipient = 0x22, 	// No response recipient, still trying
        // ServiceRejected = 0x23, 		// Service rejected, still trying
        // QOSNotAvailableStillTrying = 0x24, // QOS not available, still trying
        // RecipientError = 0x25, 		// Recipient error, still trying
		
        // RPCError = 0x40, 				// RPC Error
        // IncompatibleDestination = 0x41, 	// Incompatible destination
        // ConnectionRejected = 0x42, 		// Connection rejected
        // NotObtainable = 0x43, 			// Not obtainable
        // QOSNotAvailable = 0x44, 			// QOS not available
        // NoInternetworkingAvailable = 0x45, // No internetworking available
        // MessageExpired = 0x46, 			// Message expired
        // MessageDeletedBySender = 0x47, 	// Message deleted by sender
        // MessageDeletedBySMSC = 0x48, 	// Message deleted by SMSC
        // DoesNotExist = 0x49, 			//Does not exist 
// }

function getSlotStatusByCode($code) 
{
	switch($code)
	{
		case 0 : return 'UnInitialized'; //=0, 
		case 1 : return 'RequestInit'; //=0, 
		case 2 : return 'RequestDisable'; //=0, 

		case 10 : return 'SlotOff'; //=0, 
		case 11 : return 'TtyNotAvailable'; //=0, 
		case 12 : return 'NoSimCard'; //=0, 
		case 13 : return 'LockedSimPin'; //=0, 
		case 14 : return 'NetworkUnregistered'; //=0, 
		case 15 : return 'AtInitError'; //=0, 

		//case 20 : return 'AtPersistantError'; //=0, 
		case 21 : return 'ApplicationError'; //=0, 

		case 30 : return 'Ready'; //=0, 
		
		case 40 : return 'Disabled'; //=0, 

		default : return "unknown";
	}
}

//////////////////////////////////////////////////////////////////////
//
//    I N B O U N D     S M S 
//

define('sms_inbound_status_fresh', 0);
define('sms_inbound_status_escalated', 77);
define('sms_inbound_status_obsolete', 88);

class C_dS_inbound extends C_id { // parent is a satellite (which the sms was received on)
    public function getTableName() { return  'inbound'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset);
		if($id<=0) { // created at queue input
			$this->created = parent::tracknow();
		}
	}
    public $correlator;	// is the supposed outbound sms id that relates to this inbound
    public $groupid;	// user usage group 
    public $created;	// timestamp like 2019-02-25 11:47:59
    public $status;		// [0:fresh, 77:sent, 88:obsolete ] obsolete after one minute when there is no feedback link for inbound sms
    public $csq;		// carrier signal quality
    public $from;
    public $blabla;
	
    public static $multilines = array( 
        'blabla'	=> 1
	);	
    public static $defaults = array( 
        'correlator'	=> 0,
        'groupid' 		=> 0,
        'created' 		=> '0000-00-00 00:00:00',
        'status' 		=> sms_inbound_status_fresh,
        'csq' 			=> 31,
        'from' 			=> 0,
        'blabla' 		=> ''
    );
	public static function inventory($pid = false, $gid = false, $cor = false ) { // returns all sms elements in the table
		
			if($pid!==false) $queue = ' and parentid in ('.$pid.')'; else $queue = '';
			if($gid!==false) $group = ' and groupid = '.$gid; else $group = '';
			if($cor!==false) $corrl = ' and correlator = '.$cor; else $corrl = '';
		$q = new Q($sql='select id from inbound where id > 0'.$queue.$group.$corrl.$exludediscarded.' order by created desc limit 100;');
		$ids = $q->ids(list_as_array);
		
		$inboundlist = array();
		if(count($ids))	foreach($ids as $id) {
			$sms = new C_dS_sms($id);
			$inboundlist[] = $sms;
		}
		
		return $inboundlist;
	}
	
	public static $explained = array( 
        'id' 			=> 'gateaway internal sms unique id. Must be returned by satellite as sid to /satellite/feedback.php at synchronous send operation',	
        'parentid' 		=> 'the originating satellite id [integer ranging 10##]',	
        'correlator' 	=> 'if found, is the supposed outbound sms id that relates to this inbound response [0 if no correlator, or bigint as a dS_sms id]',	
        'groupid' 		=> 'user own correlator [integer]',		
        'created' 		=> 'date/time of insertion in the queue [2019-02-25 11:47:59]',	
        'status' 		=> '[0:fresh, 77:sent to queue owner, 88:obsolete ] obsolete after one minute when there is no feedback link for inbound sms',	
        'csq' 			=> 'satellite hat carrier signal quality at the moment of /inbound.php call',
        'from' 			=> 'from which mobile number this sms was sent',
        'blabla' 			=> 'SMS message in UTF8 format'
    );
    	
	public static function gethtmlinboundheaders() {
			$c=0; $ths = Array();
			// $ths[] = '<th>'.'id'.'</th>'; $c++;
			$ths[] = '<th>'.'id'.'</th>'; $c++;
			$ths[] = '<th>'.'parentid'.'</th>'; $c++;
			$ths[] = '<th>'.'correlator'.'</th>'; $c++;
			$ths[] = '<th>'.'groupid'.'</th>'; $c++;
			$ths[] = '<th>'.'created'.'</th>'; $c++;
			$ths[] = '<th>'.'status'.'</th>'; $c++;
			$ths[] = '<th>'.'csq'.'</th>'; $c++;
			$ths[] = '<th>'.'from'.'</th>'; $c++;
			$ths[] = '<th>'.'blabla'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}
	
	public function gethtmlinboundview() {
		$tds = Array();
		$tds[] = '<td>'.$this->id.'</td>';
		$tds[] = '<td>'.$this->parentid.'</td>';
		$tds[] = '<td>'.$this->correlator.'</td>';
		$tds[] = '<td>'.$this->groupid.'</td>';
		$tds[] = '<td>'.$this->created.'</td>';
		$tds[] = '<td>'.$this->status.'</td>';
		$tds[] = '<td>'.$this->csq.'</td>';
		$tds[] = '<td>'.$this->from.'</td>';
		$tds[] = '<td>'.$this->blabla.'</td>';
		return '<tr>'.implode('',$tds).'</tr>';
	}

}


//////////////////////////////////////////////////////////////////////
//
//    S M S    (*sg04*)  characters capacity
//
// a.  Test ok : 8 pages de (160-7) = 1224 char
// b.  Test ok : 8 pages de (140-6)/2 = 536 char


class C_dS_sms extends C_id { // parent is a queue
    public function getTableName() { return  'sms'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset);
		if($id===false) { } // specifies an intentional skip of default values setting
		else if($id<=0) { // created at queue input
			$this->created = $this->when = parent::tracknow();
			$this->status = sms_status_created;
			$this->satelliteid = 0;
		}
	}
    public $correlator;		// user usage correlator
    public $groupid;		// user usage group 
	public $priority;		// priority in the queue
    public $created;		// timestamp like 2019-02-25 11:47:59
    public $home;			// operator at the moment of creation of the sms
    public $lifetime;
    public $status; 		// user API status integer
    public $when;			// last time API status was adapted timestamp like 2019-02-25 11:47:59
    public $satelliteid;
    public $operatorid;
    public $csq;		// carrier signal quality
    public $procstmp;	// satellite processor temperature ( enteger value like 38, as reported through alive.php just before sms was handled to satellite )
    public $to;			// recepient number
    public $mod1000; 	// remaining 3 digits from the recepient number (used for patch selection filter)
    public $encoding;
    public $bla;
		public $operator;		// provided by satellite at feedback.php call, is also the csq time
		public $oper_opcode;
		public $pending;
		public $pend_opcode;
		public $delivered;
		public $deli_opcode;
		public $error;
		public $err_opcode;
	public $ms_push;
	public $ms_hlr;
    public static $multilines = array( 
        'bla'	=> 1
	);	
    public static $defaults = array( 
        'correlator'	=> 0,
        'groupid' 		=> 0,
		'priority' 		=> 0,  // can be [0,1], highset priority is feeded first to satellite,
        'created' 		=> '0000-00-00 00:00:00',
        'home' 			=> '',
        'lifetime' 		=> 0,
        'status' 		=> sms_status_created,
        'when' 			=> '0000-00-00 00:00:00',
        'satelliteid' 	=> 0,
        'operatorid' 	=> 0,
        'csq' 			=> 0,
        'procstmp' 		=> 0,
        'to' 			=> 0,
        'mod1000' 		=> 0,
        'encoding' 		=> 'ucs2', // can be ucs2, ascii (we do not send under gsm7)
        'bla' 			=> '',
			'operator' 		=> '0000-00-00 00:00:00',
			'oper_opcode' 	=> '',
			'pending' 		=> '0000-00-00 00:00:00',
			'pend_opcode' 	=> '',
			'delivered' 	=> '0000-00-00 00:00:00',
			'deli_opcode' 	=> '',
			'error' 		=> '0000-00-00 00:00:00',
			'err_opcode' 	=> '',
        'ms_push' 		=> 0, // number of milliseconds that were needed to push the SMS into DB
        'ms_hlr' 		=> 0 // number of milliseconds that were needed to hlr the SMS (this runs after connexion closing)
    );
	public function setStatus($newstatus) {
		$this->when = parent::tracknow();
		$this->status = $newstatus;
	}
	public function setSatellite($satid) {
		$this->when = parent::tracknow();
		$this->status = sms_status_satellite;
		$this->satelliteid = $satid;
		$this->save();
	}
	public static function inventory($status = false, $qid = false, $gid = false, $cor = false ) { // returns all sms elements in the table
		
			if($status) $status = ' and status = '.$status; else $status = '';
			if($qid!==false) $queue = ' and parentid in ('.$qid.')'; else $queue = '';
			if($gid!==false) $group = ' and groupid = '.$gid; else $group = '';
			if($cor!==false) $corrl = ' and correlator = '.$cor; else $corrl = '';
			$exludediscarded = ' and status <> 999';
		$q = new Q($sql='select id from sms where id > 0'.$status.$queue.$group.$corrl.$exludediscarded.' order by created asc limit 1000;');
		$ids = $q->ids(list_as_array);
		$smss = getstatusarray();
		if(count($ids))	foreach($ids as $id) {
			$sms = new C_dS_sms($id);
			$smss[$sms->status][] = $sms;
		}
		
		return $smss;
	}
	
	public static $explained = array( 
        'id' 			=> 'gateaway internal sms unique id. Must be returned by satellite as sid to /satellite/feedback.php at synchronous send operation',	
        'parentid' 		=> 'queue unique id [integer ranging 6## or 0 for queueless messages]',	
        'correlator' 	=> 'user own correlator [integer]',	
        'groupid' 		=> 'user own correlator [integer]',		
		'priority'		=> 'SMS queue priority [0,1]',
        'created' 		=> 'date/time of insertion in the queue [2019-02-25 11:47:59]',	
        'home' 			=> 'operator at the moment the sms was queued',	
		'lifetime'		=> 'number of minutes before going to expired status [integer, number of minutes]',
        'status' 		=> 'sms network status [100:created, 110:satellite, 120:operator, 190:pending in network, 200:delivered, 404:network error, 800:expired in queue]',	
        'when' 			=> 'last status change',	
        'satelliteid' 	=> 'assigned satellite id [integer ranging 10##]',	
        'operatorid' 	=> 'assigned network operator id [integer], must be returned by satellite as oid to /satellite/feedback.php each time called.',	
        'csq' 			=> 'satellite hat carrier signal quality at the moment of /alive.php call',
        'procstmp' 		=> 'satellite processor temperature ( enteger value like 38 )',
        'to' 			=> 'mobile number',
        'mod1000' 		=> 'remaining 3 digits from the recepient number (used for patch selection filter)',
        'encoding' 		=> 'indicates to satellite what encoding to use for sending the SMS, ranges [ucs2, ascii]. We do not send under gsm7',
        'bla' 			=> 'SMS message in UTF8 format',
			'operator' 		=> 'date/time of handover to operator, provided by satellite [2019-02-25 11:47:59]',
			'oper_opcode' 	=> 'operator status code at synchrone handover',
			'pending' 		=> 'date/time of intermediate status, provided by operator through satellite [2019-02-25 11:47:59]',
			'pend_opcode' 	=> 'operator status code indicating a pending operation',
			'delivered' 	=> 'date/time of delivery to target device, provided by operator through satellite [2019-02-25 11:47:59]',
			'deli_opcode' 	=> 'operator status code indicating a successful delivery',
			'error' 		=> 'date/time of delayed aborted operation, provided by operator through satellite [2019-02-25 11:47:59]',
			'err_opcode' 	=> 'operator status code indicating a delivery failure',
		'lag' 	=> 'expected timespan [seconds] before your next call to /smsgateaway/satellite/alive.php'
    );
    	

	public static function explainstatus() {
		
		h3('user API SMS status range');

		indent('100: created.',3);
			indent('the SMS has been inserted in the queue, it is waiting for a satellite to fetch it.',8);
		indent('800: expired.',3);
			indent('the SMS stayed in status 100 for a lifetime period and was not assigned to a satellite, it expired and will not be dispatched anymore to a satellite.',8);
		indent('110: satellite.',3);
			indent('the SMS has been assigned to a satellite, the operator id is not yet known.',8);
		indent('120: operator.',3);
			indent('the SMS has been handled to the operator and the operator id is known.',8);
		indent('190: pending.',3);
			indent('the operator called to satellite to specify that the SMS is pending in the network (the mobile device is unreachable or turned off).',8);
		indent('200: delivered.',3);
			indent('the SMS has been delivered to the mobile device.',8);
		indent('404: error.',3);
			indent('the SMS has been handled to the operator and the operator id is known but the message was undeliverable.',8);
		indent('405: error.',3);
			indent('the SMS target recepient was revealed Dead bu the hlr_lookup.',8);
		indent('999: discarded by user.',3);
			indent('This sms must not be treated anymore.',8);
	
		pad();
		h3('Operator SMS status codes as reported by satellite');
		
		h4('Synchronous feedbacks (at SMS sending time)');

		indent('0xAA: Message accepted by operator.',12);
		indent('0xEE: Message rejected by operator.',12);
		
		h4('Asynchronous feedbacks (callback from operator)');

		indent('o Message delivery success:',6);
		indent('The following status are mapped to user api status 200, delivered',9);
		
		indent('0x00: Success, short message delivered successfully.',12);
		indent('0x01: Forwared.',12);
		indent('0x02: Replaced.',12);
		
		pad(0);
		indent('o Message delivery pending:',6);
		indent('The following status are mapped to user api status 190, pending',9);
		
		indent('0x20: Congestion, still trying.',12);
		indent('0x21: Recipientbusy, still trying.',12);
		indent('0x22: NoResponseRecipient, still trying.',12);
		indent('0x23: ServiceRejected, still trying',12);
		indent('0x24: QOS Not Available, still trying.',12);
		indent('0x25: Recipient Error, still trying.',12);
		
		pad(0);
		indent('o Message delivery failure:',6);
		indent('The following status are mapped to user api status 404, error',9);
			
		indent('0x40: RPC Error, remote procedure call error.',12);
		indent('0x41: Incompatible Destination.',12);
		indent('0x42: Connection Rejected.',12);
		indent('0x43: Not Obtainable.',12);
		indent('0x44: QOS Not Available.',12);
		indent('0x45: No Internet working Available.',12);
		indent('0x46: Message Expired.',12);
		indent('0x47: Message Deleted BySender.',12);
		indent('0x48: Message Deleted BySMSC.',12);
		indent('0x49: Does Not Exist.',12);
	}
	
	private static $jsrowinteractive = 'onclick="onlog(this.id)"'; // (*al01*)

	public static function gethtmlsmsheaders () {
		$th1 = '<th>'.'parentid'.'</th>';
		$th2 = '<th>'.'created'.'</th>';
		$th3 = '<th>'.'home'.'</th>';
		$th4 = '<th>'.'status'.'</th>';
		$th5 = '<th>'.'when'.'</th>';
		$th6 = '<th>'.'to'.'</th>';
		$th7 = '<th>'.'bla'.'</th>';
		$thr ='<tr>'.$th1.$th2.$th3.$th4.$th5.$th6.$th7.'</tr>';
		$tcols = '<colgroup><col><col><col><col><col><col></colgroup>';
		return $thr.$tcols;
	}

	public function gethtmlsmsview () {
		$td1 = '<td>'.$this->parentid.'</td>';
		$td2 = '<td>'.$this->created.'</td>';
		$td3 = '<td>'.$this->home.'</td>';
		$td4 = '<td>'.$this->status.'</td>';
		$td5 = '<td>'.$this->when.'</td>';
		$td6 = '<td>'.$this->to.'</td>';
		$td7 = '<td>'.$this->bla.'</td>';
		return '<tr>'.$td1.$td2.$td3.$td4.$td5.$td6.$td7.'</tr>';
	}

}




//////////////////////////////////////////////////////////////////////
//
//    H L R     L O O K U P 
//


class C_hlr_location {

	public function __construct($rr) {
		foreach($this as $member => $v) 
			if(isset($rr[$member])) $this->{$member} = $rr[$member];
				else $this->{$member} = 'na';
	}
	public $verified;
	public $timezone;
	public $location;
	public $network_name;
	public $country_code;
	public $area;
	
}
class C_hlr_lookup {
	
		///////////////////////////////////////////////////////////////////////////
		//
		//	Example :
		//
		// https://www.hlrlookup.com/api/hlr/?apikey=46evK1rPLFetuOak7IMVJZL6trIPcelm&password=dynaudio6a&msisdn=32486666520,32493655599,32497401626
		//
		//
		// $response = {  // you can use this to test the code without calling the hlr provider
		 // "32486666520": {
			// "issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Telenet","country_code":32,"area":"Belgium","region":"BE"}
			// ,"type":"Mobile"
			// ,"msisdn":"32486666520"
			// ,"error_code":5
			// ,"error_text":"Inconclusive"
			// ,"status":"Undelivered"
			// ,"mccmnc":"20620"
			// ,"is_ported":false
			// ,"is_roaming":false
			// }
		// ,"32497401626": {
			// "issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium","region":"BE"}
			// ,"home_info":{"verified":true,"timezone":"Europe/Brussels ","location":"Belgium","network_name":"Proximus (Belgacom Mobile)","country_code":32,"region":"BE"}
			// ,"roaming_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Proximus","country_code":32,"area":"Belgium","region":"BE"}
			// ,"type":"Mobile"
			// ,"msisdn":"32497401626"
			// ,"error_code":0
			// ,"error_text":"Live"
			// ,"status":"Delivered"
			// ,"mccmnc":"20601"
			// ,"is_ported":true
			// ,"is_roaming":false
			// }
		// ,"32493655599": {
			// "issueing_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium"}
			// ,"home_info":{"verified":true,"timezone":"Europe/Brussels ","location":"Belgium","network_name":"Orange (Orange S.A.)","country_code":32}
			// ,"roaming_info":{"verified":true,"timezone":"Europe/Brussels","location":"Belgium","network_name":"Orange","country_code":32,"area":"Belgium"}
			// ,"type":"Mobile"
			// ,"msisdn":"32493655599"
			// ,"error_code":0
			// ,"error_text":"Live"
			// ,"status":"Delivered"
			// ,"mccmnc":"20610"
			// ,"is_ported":false
			// ,"is_roaming":false
			// }
		// }
		
		//	Note : 
		//		1. When the SIM card is not online, current network is not available and error code is <> 0
		//		2. When roaming is activated on the SIM card, roaming info will appear in the roaming info. If inside home, roaming shows home location
		//
		
	public function __construct($rr) {
		foreach($this as $member => $v) 
			if($member=='issueing_info'||$member=='home_info'||$member=='roaming_info') {
				if(isset($rr[$member])) // in this case, $stdobj->{$member} is a StdObject
					$this->{$member} = new C_hlr_location($rr[$member]);
				} 
			else
				$this->{$member} = $rr[$member];
			
		$void = Array();
		if(!isset($this->issueing_info)) 
			$this->issueing_info = new C_hlr_location($void); // this items is not always mentionned
	}
	
	public $issueing_info; 	// C_hlr_location
	public $home_info;		// C_hlr_location
	public $roaming_info;	// C_hlr_location
	
	public $type;
	public $msisdn;
	public $error_code;
	public $error_text;
	public $status;
	public $mccmnc;
	public $is_ported;
	public $is_roaming;
	
}

class C_dS_hlr {
	
	public $mobile;
	public $hlrstamp; // indicates the date of a successfull hlr lookup answer
	public $issued;
	public $home;
	public $error_code;
	public $error_text;
	public $is_ported;
	public $is_roaming;
	
	public $operator; // deduced physical operator
	
    public function __construct($m) { // same constructor for new or existing items
		
		$q = new Q('select * from hlr_lookups where mobile = '.$m.';');
		$c = $q->cnt();
		if($c) { // this item was already looked up
			$row = $q->result->fetch_array();
			foreach($this as $member => &$value) $value = $row[$member]; unset($value);
		}
		else { // new item: We assign a default operator according to BIPT assignment rules. 
		
			$this->mobile = $m;
			$this->hlrstamp = '0000-00-00 00:00:00';
			$this->operator = $this->allocation(); // perfom this already in case the number is served to a satellite before it gets hlr_looked up 
			$this->save();
			
		}
	}
	
	public function update() {
		if($this->isexpired()) $this->lookup(); // works fine for new items too because they have hlrstamp = '0000-00-00 00:00:00';
		$this->save();
	}
	
	public function lookup() { // contains a potential time consuming curl to hlr webservice
		
		// contact at hlrlookup.com : Iain Sutherland <iain@hlrlookup.com>
		
				$msisdn = $this->mobile;
				$key='46evK1rPLFetuOak7IMVJZL6trIPcelm';
				$pass='dynaudio6a';
			$url = 'https://www.hlrlookup.com/api/hlr/?apikey='.$key.'&password='.$pass.'&msisdn='.$msisdn.'';
		$curl = curl_init($url);

		curl_setopt($curl, CURLOPT_HEADER, 0);
		curl_setopt($curl, CURLOPT_POST, 0);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl, CURLOPT_TIMEOUT_MS, 30*1000); // when set to 10 seconds, 20% go time out (according to hlr guys, belgian market network pretty slow)
		
		$response = curl_exec($curl);
		
		if(!$response) { // The server is unreachable
			$code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
			$errtitle = 'HLR Lookup, HTTP error: '.$code.'';
			$errtext = '(could not reach HLR Lookup server, using ['.$url.'] )';
			curl_close($curl);
			
				$dS_log = new C_dS_log(0, 0);
					$dS_log->created = C_dS_hlr::tracknow();
					$dS_log->title = $errtitle;
					$dS_log->level = log_level_critical;
					$dS_log->bla = $errtext;
				$dS_log->save();


			if($this->hlrstamp == '0000-00-00 00:00:00') { // fail to reach rlr lookup provider on a new C_dS_hlr item
				$this->issued 	= '';
				$this->home 	= '';
				$this->error_code	= 0;
				$this->error_text	= '';
				$this->is_ported	= 'false';
				$this->is_roaming	= 'false';
				$this->operator = $this->allocation(); // will default to formula rule allocation
				$this->save();
			}
			
			// usleep(100*1000); // 100 ms
			return $this;
		}
		
		curl_close($curl);
		
		//	If we reach here, the hlr lookup provider has given a response to our call
		//
		
		$arr = json_decode($response, true); 	// is an array of array of array ... 
		
		// $items = Array(); // this is when you send a request for multiple numbers
		// if(count($arr))
			// foreach($arr as $msisdn => $r)
				// $items[$msisdn] = new C_hlr_lookup($r);
		// �tems is an array of C_hlr_lookup's like [ mobile => C_hlr_lookup, mobile => C_hlr_lookup, mobile => C_hlr_lookup, ... ]
				
		$item = new C_hlr_lookup($arr);
		
		$this->hlrstamp 	= C_dS_hlr::tracknow();
		$this->issued 		= $item->issueing_info->network_name;
		$this->error_code	= $item->error_code;
		if($item->error_code==0) $this->home = $item->home_info->network_name; // this field is void when error code is <> 0
			else $this->home = $this->issued;
		$this->error_text	= $item->error_text;
		$this->is_ported	= $item->is_ported?1:0;
		$this->is_roaming	= $item->is_roaming?1:0;
		
		$this->operator = $this->allocation();
		
		$this->save();
		
		// in case of a "dead" result (error_code == 1) we discard messages from the sms table by giving them the sms_status_dead 405 status
		// doing so, thoses sms's will not be fetched
		// note: the following queries will take a huge time to execute if there is no index on sms.to
		//
		if($this->error_code==1) 
			$q = new Q($sql='update sms set sms.status = '.sms_status_dead.', sms.when = "'.$this->hlrstamp.'" where sms.to = '.$this->mobile.';');
		else
			// report home operator to the SMS table (this avoids the fetch process to join hlr table when selecting sms to feed to satellite) (*sg02*)
			$q = new Q($sql='update sms set sms.home = "'.$this->operator.'" where sms.to = '.$this->mobile.';');
		
		
		return $this;

	}
	
	private function allocation() { // here we resolve the originating operator using noational allocation table rules
		
		$m = $this->mobile;
		if($this->hlrstamp <> '0000-00-00 00:00:00') { // then this item was looked up and the actual info is in the object
			
			$use = $this->home; // the mobile could be localised and comprehensive info was returned by the hlr lookup
			if($this->error_code) $use = $this->issued; // the item was looked-up but incomplete data is returned
							
			$t = strtolower($use);
			if(strpos($t, 'proximus')!==false) return 'proximus'; 
			if(strpos($t, 'orange')!==false) return 'orange'; 
			return 'telenet'; 
		
			
		} else { // the item was not looked up yet and we need to use rules for deducing the operator
			
			if($m>32490000000 && $m<32499999999) return 'orange'; // recipient number is out of range
				// in 2018 we had 65.000 sms sent to this range (35%)
			if($m>32470000000 && $m<32479999999) return 'proximus'; // recipient number is out of range
				// in 2018 we had 95.000 sms sent to this range (51%)
			return 'telenet';
				// in 2018 we had 25.000 sms sent to this range (14%)
		}
		
	}

    public function save() {
        $here = 'C_dS_hlr::save()';
		$q = new Q('select mobile from hlr_lookups where mobile = '.$this->mobile.';');
		$c = $q->cnt();
		
        if($c) 
            Q::q('update hlr_lookups SET '.$this->upfields().' where mobile ='.$this->mobile.';',$here);
		else
            Q::q('insert into hlr_lookups ( '.$this->infields().' ) values ('.$this->invalues().')',$here);

        return $this;
    }
	
	
	//  Privates : 
	// 
    private function infields()	{ 
        $fields = Array();
        foreach($this as $member => $value) $fields[] = '`'.$member.'`'; 	
        return implode(',',$fields);
    }
    private function invalues()	{ 
        $values = Array();
        foreach($this as $member => $value) $values[] = '"'.addslashes($value).'"'; // see (*as*)
        return implode(',',$values);
    }
    private function upfields() {
        $assigns = Array();
        foreach($this as $member => $value)
            if($member=='mobile') continue; // we do not rewrite the table key
			else $assigns[] = '`'.$member.'`'.'="'.addslashes($value).'"'; // see (*as*)
        return implode(',',$assigns);
    }
	public static function tracknow() { return Date('Y-m-d H:i:s',time()); } // time format used for change tracking
	public static function trackexpire() { return Date('Y-m-d H:i:s',time()-86400*400 /*days*/); } // re-lookup a number when the cache is older than 400 days
	public function isexpired() {
		// return true; // for testing
		// we trigger a new hlr lookup also if the error code is positive (like unassigned number in a past check, may be is now assigned again to some other person)
		if($this->error_code) return true; // operator could not be retrieved last time
		
		// we trigger a new hlr also when the last check on this number is older than x month (defined in trackexpire())
		$expdate = C_dS_hlr::trackexpire();
		$lastlookup = $this->hlrstamp;
		return $lastlookup < $expdate;
	}
	public function isnew() {
		return $this->hlrstamp == '0000-00-00 00:00:00';
	}
	
}




//////////////////////////////////////////////////////////////////////
//
//    Q U E U E 
//

class C_dS_queue extends C_id { // group to a login id

	public static $current_queues = QUEUES; // '.C_dS_patch::$current_patches.' // current in use patch table


    public function getTableName() { return  self::$current_queues; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { parent::__construct($id, $parentid, $preset); }
	
    public $name;
    public $countrycode;
	
	// counters
    public $pushedever;	
    public $pushthishour;
    public $pushlasthour;
    public $pushthisday;
    public $pushyesterday;
    public $pushthisweek;
    public $pushlastweek;
	public $pushthismonth;
	public $pushlastmonth;
	
    public static $multilines = false;
    public static $defaults = array( 
        'name' 			=> 'queue',
        'countrycode' 	=> 32,
        'pushedever' 	=> 0,	
        'pushthishour' 	=> 0,
        'pushlasthour' 	=> 0,
        'pushthisday' 	=> 0,
        'pushyesterday' => 0,
        'pushthisweek' 	=> 0,
        'pushlastweek' 	=> 0,
		'pushthismonth'	=> 0,
		'pushlastmonth'	=> 0
    );
	public function magnify($status = false, $gid = false) { // returns all sms elements in this queue
			if($status) $status = ' and status = '.$status;
			if($gid!==false) $group = ' and groupid = '.$gid; else $group = '';
			$exludediscarded = ' and status <> 999';
		$q = new Q($sql='select id from sms where parentid = '.$this->id.$status.$group.$exludediscarded.' order by created desc;');
		$ids = $q->ids(list_as_array);
		$this->smss = getstatusarray();
		if(count($ids))	foreach($ids as $id) {
			$sms = new C_dS_sms($id);
			$this->smss[$sms->status][] = $sms;
		}
	}
	
	public function satellites() {
			
			
		$q = new Q('select satelliteid as id from '.C_dS_patch::$current_patches.' where queueid = '.$this->id.';');
		$sids = $q->ids(list_as_array);
		$satellites = Array();
		if(count($sids)) 
			foreach($sids as $sid)
				$satellites[$sid] = new C_dS_satellite($sid);
		
		return $satellites;
		
	}	
	public function patches() {	
		$patches = C_dS_patch::loadforqueue($this->id);
		return $patches;
	}	
	
	public static $explained = array( 
        'id' 			=> 'queue unique id [integer ranging 6##]',	
        'parentid' 		=> 'login unique id [bigint ranging 9##]',		
        'countrycode' 	=> 'country calling codes (like 32 for be, 33 for France, 41 for Switzerland...)',	
        'name' 			=> 'queue name, alphanum chosen by user',
		
        'pushedever' 	=> 'total number of SMS fetched so far',	
		
        'pushthishour' => 'number of SMS pushed in the current hour (automatic reset every hour)',
        'pushlasthour' => 'number of SMS pushed in the current hour (automatic reset every hour)',
		
        'pushthisday' 	=> 'number of SMS pushed in the current day (automatic reset every day at midnight)',
        'pushyesterday' => 'number of SMS pushed yesterday',
		
        'pushthisweek' => 'number of SMS pushed in the current week (automatic reset every week on sunday)',
        'pushlastweek' => 'number of SMS pushed in the current week (automatic reset every week on sunday)',
		
		'pushthismonth'=> 'number of SMS pushed in the current month (automatic reset every month 1st at midnight)',
		'pushlastmonth'=> 'number of SMS pushed in the last month'
    );
    	

	public static function ids($lid) {  // returns ids of queues belonging to a given login
		$q = new Q('select id from '.self::$current_queues.' where parentid = '.$lid.';');
		$qids = $q->ids(list_as_string);
		return $qids;
	}
	public static function loadall($lid) { // returns an array of instances of C_dS_queue belonging to dS_login
		$q = new Q('select id from '.self::$current_queues.' where parentid = '.$lid.';');
		$qids = $q->ids(list_as_array);
		$r = Array();
		foreach($qids as $qid) {
			$r[$qid] = new C_dS_queue($qid);
		}
		return $r;
	}
		private static $jsrowinteractive = 'onclick="onqueue(this.id)"'; // (*al01*)

	public static function gethtmlheader() {
		$th1 = '<th>'.'id'.'</th>';
		$th2 = '<th>'.'name'.'</th>';
		$th3 = '<th>'.'parentid'.'</th>';
		$th4 = '<th>'.'countrycode'.'</th>';
		$th5 = '<th>'.'pushedever'.'</th>';
		$th6 = '<th>'.'thishour'.'</th>';
		$th7 = '<th>'.'lasthour'.'</th>';
		$th8 = '<th>'.'thisday'.'</th>';
		$th9 = '<th>'.'yesterday'.'</th>';
		$thr ='<tr>'.$th1.$th2.$th3.$th4.$th5.$th6.$th7.$th8.$th9.'</tr>';
		$tcols = '<colgroup><col><col><col></colgroup>';
		return $thr.$tcols;
	}

	public  function gethtmlrow() {
		$td1 = '<td>'.$this->id.'</td>';
    	$td2 = '<td>'.$this->name.'</td>';
    	$td3 = '<td>'.$this->parentid.'</td>';
    	$td4 = '<td>'.$this->countrycode.'</td>';
    	$td5 = '<td>'.$this->pushedever.'</td>';
    	$td6 = '<td>'.$this->pushthishour.'</td>';
    	$td7 = '<td>'.$this->pushlasthour.'</td>';
    	$td8 = '<td>'.$this->pushthisday.'</td>';
    	$td9 = '<td>'.$this->pushyesterday.'</td>';
    	return '<tr '.self::$jsrowinteractive.' id="'.$this->id.'">'.$td1.$td2.$td3.$td4.$td5.$td6.$td7.$td8.$td9.'</tr>';
	}

	public static function gethtmlqueueheaders() {
		$th1 = '<th>'.'id'.'</th>';
		$th2 = '<th>'.'name'.'</th>';
		$th3 = '<th>'.'parentid'.'</th>';
		$th4 = '<th>'.'countrycode'.'</th>';
		$th5 = '<th>'.'pushedever'.'</th>';
		$th6 = '<th>'.'thishour'.'</th>';
		$th7 = '<th>'.'lasthour'.'</th>';
		$th8 = '<th>'.'thisday'.'</th>';
		$th9 = '<th>'.'yesterday'.'</th>';
		$th10 = '<th>'.'thisweek'.'</th>';
		$th11 = '<th>'.'lastweek'.'</th>';
		$th12 = '<th>'.'thismonth'.'</th>';
		$th13 = '<th>'.'lastmonth'.'</th>';
		$thr ='<tr>'.$th1.$th2.$th3.$th4.$th5.$th6.$th7.$th8.$th9.$th10.$th11.$th12.$th13.'</tr>';
		$tcols = '<colgroup><col><col><col><col><col><col><col><col></colgroup>';
		return $thr.$tcols;
	}

	public  function gethtmlqueues() {
		$td1 = '<td>'.$this->id.'</td>';
		$td2 = '<td>'.$this->name.'</td>';
    	$td3 = '<td>'.$this->parentid.'</td>';
    	$td4 = '<td>'.$this->countrycode.'</td>';
    	$td5 = '<td>'.$this->pushedever.'</td>';
    	$td6 = '<td>'.$this->pushthishour.'</td>';
    	$td7 = '<td>'.$this->pushlasthour.'</td>';
    	$td8 = '<td>'.$this->pushthisday.'</td>';
    	$td9 = '<td>'.$this->pushyesterday.'</td>';
    	$td10 = '<td>'.$this->pushthisweek.'</td>';
    	$td11 = '<td>'.$this->pushlastweek.'</td>';
    	$td12 = '<td>'.$this->pushthismonth.'</td>';
    	$td13 = '<td>'.$this->pushlastmonth.'</td>';
    	return '<tr '.self::$jsrowinteractive.' id="'.$this->id.'">'.$td1.$td2.$td3.$td4.$td5.$td6.$td7.$td8.$td9.$td10.$td11.$td12.$td13.'</tr>';
	}

}





//////////////////////////////////////////////////////////////////////
//
//    P A T C H E S 
//

class C_dS_patch { // parent to a server instance
	
	public static $current_patches = PATCHES; // '.C_dS_patch::$current_patches.' // current in use patch table
	
    public function __construct($id) { 
		$load = new Q('select * from '.C_dS_patch::$current_patches.' where id = '.$id.';');
		$c = $load->cnt();
		if($c) { // this item was already looked up
			$row = $load->result->fetch_array();
			foreach($this as $member => &$value) $value = $row[$member]; unset($value);
		}
	}
    public $id;			//
    public $queueid;	// 
    public $satelliteid;// 
    public $operator; 	// assigned operator in the related queue
    public $n_sup_to; 	// filter on recepient number last 3 digits, floor, set [0,1000] for no filtering
    public $n_inf_to; 	// filter on recepient number last 3 digits, ceiling
	
	public static function loadforsatellite($satid) {
		$q = new Q('select id from '.C_dS_patch::$current_patches.' where satelliteid = '.$satid.';');
		$pids = $q->ids(list_as_array);
		$r = Array();
		foreach($pids as $pid) {
			$patch = new C_dS_patch($pid);
			$patch->queue = new C_dS_queue($patch->queueid);
			$r[$pid] = $patch; unset($patch);
		}
		return $r;
	}
	
	public static function loadforqueue($qid) {
		$q = new Q('select id from '.C_dS_patch::$current_patches.' where queueid = '.$qid.';');
		$pids = $q->ids(list_as_array);
		$r = Array();
		if(count($pids))
			foreach($pids as $pid) {
				$patch = new C_dS_patch($pid);
				$patch->satellite = new C_dS_satellite($patch->satelliteid);
				$r[$pid] = $patch; unset($patch);
			}
		return $r;
	}
}






//////////////////////////////////////////////////////////////////////
//
//    L O G I N
//

class C_dS_login extends C_id { // parent to a server instance
	
    public function getTableName() { return  'logins'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset);
	}
    public $name;	//
    public $login;	// 
    public $pass; 	// 
    public $email; 	// 
    public $feedbackurl; 	// 
    public $inboundurl; 	// 
    public static $multilines = false;
    public static $defaults = array( 
        'name'	=> '',
        'login' => '',
        'pass' 	=> '',
        'email' => '',
        'feedbackurl' => '',
        'inboundurl' => ''
    );
	public static function loadall() {
		$q = new Q('select id from logins;');
		$lids = $q->ids(list_as_array);
		$r = Array();
		foreach($lids as $lid) {
			$r[$lid] = new C_dS_login($lid);
		}
		return $r;
	}
}





//////////////////////////////////////////////////////////////////////
//
//    S M S B O X     b i n     F I L E     a n d     v e r s i o n
//

class C_smsbox { 
	
    public function getClassName() { return get_class(); }
    public function __construct($mdb) { 
		
		$filter = $mdb?'./bin/smsbox.exe.mdb':'./bin/smsbox.exe';
		$matches = glob($filter);
		if(count($matches)>1) die('error 0010');  // multiple match for this SIM
		if(count($matches)==0) die('error 0011');  // no match for this SIM
			$pathfile = $matches[0];
		if(!file_exists($pathfile)) die('error 0012');  // multiple match for this SIM


		$path_parts = pathinfo($pathfile); // returns an array

		// echo $path_parts['dirname'], "<br/>";
		// echo $path_parts['basename'], "<br/>";
		// echo $path_parts['extension'], "<br/>";
		// echo $path_parts['filename'], "<br/>"; // as from PHP 5.2.0		

		$this->pathfile = $pathfile;
		$this->filename = $path_parts['basename'];
		$this->version = explode('_',$path_parts['filename'])[0];
		$this->size = filesize($pathfile);
		
	}
    private $pathfile;	//
    private $filename;	//
    private $version;	//
    private $size;		//
	
	public function version() { return $this->version; }
	
	public function stream() { // no echo must have been triggered before !
		
		header('Content-Description: File Transfer');
		header('Content-Type: application/octet-stream');
		header('Content-Disposition: attachment; filename='.$this->filename);
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
		header('Content-Length: '.$this->size);
		ob_clean();
		flush();
		readfile($this->pathfile);
		exit();
	}
}






//////////////////////////////////////////////////////////////////////
//
//    L O G G I N G 
//


// User API status
//
define('log_level_info'			, 10);	// set by gateaway at queue input
define('log_level_warning'		, 20); 	// lifetime felt down to 0, status set by gateaway
define('log_level_critical'		, 30);	// set by gateaway at satellite request
define('log_level_error'		, 40);	// provided by satellite at handover to operator (opid is known at that moment)
define('log_level_failure'		, 50); 	// provided by satellite


class C_dS_log extends C_id { // log from satellites
	
    public function getTableName() { return  'logs'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset);
	}
    public $created;	//
    public $smsopid;	// 
    public $satelliteid; 	// 
    public $csq;		// carrier signal quality
    public $procstmp; 	// satellite processor temperature ( enteger value like 38 )
    public $rpipower;	// 

    public $title; 	// 
    public $level; 	// 
    public $bla; 	// 
    public static $multilines = array( 
        'title' 		=> 1,
        'level' 		=> 1,
        'bla' 			=> 1
    );
    public static $defaults = array( 
        'created'		=> '',
        'smsopid' 		=> 0,
        'satelliteid' 	=> 0,
        'csq' 			=> 0,
        'procstmp' 		=> 0,
        'rpipower' 		=> 0,
        'title' 		=> '',
        'level' 		=> '',
        'bla' 			=> ''
    );
	
	public static $explained = array( 
        'id' 			=> 'unique id [integer ranging 6##]',	
        'parentid' 		=> 'login unique id [bigint ranging 9##]',		
        'created' 		=> 'date/time of insertion in the log [2019-02-25 11:47:59]',
		
        'smsopid' 		=> 'sms operator id, when applicable',	
        'satelliteid' 	=> 'log provider satellite id [integer ranging 10##]',	
        'csq' 			=> 'carrier signal quality at the moment of /alive.php call [99, 0-31]',
        'procstmp' 		=> 'satellite processor temperature ( enteger value like 38 )',
        'rpipower' 		=> 'rpi power level ok (binary value)',
		
        'title' 	=> 'title for this log',
        'level' 	=> 'severity or importance level [info, warning, critical, error, failure]',
        'bla' 		=> 'textual information'
    );
    	
	
	public static function getlevelarray($which = 'array') {
		$r = array();
		$a = array(log_level_info, log_level_warning, log_level_critical, log_level_error, log_level_failure);
		$n = array('info','warning','critical','error','failure');
		switch($which) {
			case 'named': 
				foreach($a as $x => $value) $r[$value] = $n[$x];
				break;
			case 'values':
				return $a;
				break;
			case 'named_array': 
				foreach($a as $x => $value) $r[$n[$x]] = array();
				break;
			case 'array': default: 
				foreach($a as $value) $r[$value] = array();
		}
		return $r;
	}
	public static function inventory($satellite = false, $level = false, $gid = false ) { // returns all sms elements in the table
		
			if($level) $level = ' and level = "'.$level.'"'; else $level = '';
			if($satellite!==false) $satellite = ' and satelliteid in ('.$satellite.')'; else $satellite = '';
			if($gid!==false) $group = ' and groupid = '.$gid; else $group = '';
		$q = new Q($sql='select id from logs where id > 0'.$level.$satellite.$group.' order by created desc;');
		$ids = $q->ids(list_as_array);
		$logs = C_dS_log::getlevelarray('named_array');
		if(count($ids))	foreach($ids as $id) {
			$log = new C_dS_log($id);
			$logs[$log->level][] = $log;
		}
		
		return $logs;
	}
	
	
	public static function gethtmllogheaders() {
			$c = 0;
			$th1 = ''; //'<th>'.'id'.'</th>';
			$th2 = '<th>'.'owner'.'</th>'; $c++;
			$th3 = '<th>'.'created'.'</th>'; $c++;
			$th4 = '<th>'.'opid'.'</th>'; $c++;
			$th6 = '<th>'.'csq'.'</th>'; $c++;
			$th7 = '<th>'.'tmp'.'</th>'; $c++;
			$th8 = '<th>'.'power'.'</th>'; $c++;
			$th9 = '<th>'.'title'.'</th>'; $c++;
			$th10 = '<th>'.'level'.'</th>'; $c++;
			$th11 = '<th>'.'description'.'</th>'; $c++;
		$thr ='<tr>'.$th1.$th2.$th3.$th4.$th6.$th7.$th8.$th9.$th10.$th11.'</tr>';
		for($cols = '';$c--;$cols.='<col>');
		$tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}
	
	public function gethtmllogview() {
		$td1 = ''; // '<td>'.$this->id.'</td>';
		$td2 = '<td>'.$this->parentid.'</td>';
		$td3 = '<td>'.$this->created.'</td>';
		$td4 = '<td>'.$this->smsopid.'</td>';
		$td6 = '<td>'.$this->csq.'</td>';
		$td7 = '<td>'.$this->procstmp.'</td>';
		$td8 = '<td>'.$this->rpipower.'</td>';
		$td9 = '<td>'.$this->title.'</td>';
		$td10 = '<td>'.$this->level.'</td>';
		$td11 = '<td>'.$this->bla.'</td>';
		return '<tr>'.$td1.$td2.$td3.$td4.$td6.$td7.$td8.$td9.$td10.$td11.'</tr>';
	}
	
}

class C_dS_device extends C_id { 
    public function getTableName() { return 'devices'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset); 
	}

	public static $threshold_prcmaxtmp = 60;
	public static $threshold_cpuandsd = 70;
	public static $alert_color_red = 'color:red;';



	public $name;
	public $swversion;
	public $netaddr;
	public $location;
	public $lastcpu;
	public $lastptmp;
	public $lastuvolt;
	public $lastRAMtotal;
	public $lastRAMused;
	public $lastSDtotal;
	public $lastSDused;
	public $lastexectime;
	public $lastseen;
	
    public static function findbyname($name) { // login from satellite perspective, using an iccid id
		$q = new Q('select id from '.'devices'.' where name = "'.$name.'";'); // identify the caller
		$c = $q->cnt();
		if($c==0) return null;
		if($c>1) die('error 0040');  // multiple match for same rpi name!
		$deviceid = $q->ids();
		$dS_device = new C_dS_device($deviceid);  // satellite is recovered from iccid
		return $dS_device;
	}
	
    //public static $multilines = false;
    public static $defaults = array( 
		'name' => 'unknown',
		'swversion' => 'unknown',
		'netaddr' => 'unknown',
		'location' => 'unknown',
		'lastcpu' => 0,
		'lastptmp' => 0,
		'lastuvolt' => 0,
		'lastRAMtotal' => 0,
		'lastRAMused' => 0,
		'lastSDtotal' => 0,
		'lastSDused' => 0,
		'lastexectime' => '',
		'lastseen' => '',
    );
	
	public static $explained = array( 
		'id' 			=> 'raspberri unique id [integer ranging 6000000]',	
		'name' 			=> 'name of rpi',
		'swversion' 	=> 'software version',
		'netaddr' 		=> 'list of network addresses xxx.xxx.xxx.xxx;xxx.xxx.xxx.xxx',
		'location' 		=> 'physical location',
		'lastcpu'		=> 'last total cpu',
		'lastptmp' 		=> 'last cpu temperature',
		'lastuvolt' 	=> 'last cpu under voltage flag (0=no undervoltage,1=undervoltage)',
		'lastRAMtotal' 	=> 'last RAM total memory (in Mb)',
		'lastRAMused' 	=> 'last RAM used memory (in Mb)',
		'lastSDtotal' 	=> 'last SD card total memory (in Mb)',
		'lastSDused' 	=> 'last SD card used memory (in Mb)',
		'lastexectime' 	=> 'last software execution time',
		'lastseen' 	=> 'date/time of last call to api/device/monitoring.php',
    );
    	

	public static function gethtmlheader() { 
		$c=0; $ths = Array();
			$ths[] = '<th>'.'name'.'</th>'; $c++;
			$ths[] = '<th>'.'version'.'</th>'; $c++;
			$ths[] = '<th>'.'location'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'cpu (%)'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'temp.(°C)'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'uVolt'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'RAM</br>total (MB)'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'RAM</br>used (MB)'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'SD card</br>total (GB)'.'</th>'; $c++;
			$ths[] = '<th style="min-width:3em;">'.'SD card</br>used (GB)'.'</th>'; $c++;
			$ths[] = '<th>'.'last seen'.'</th>'; $c++;
			$ths[] = '<th>'.'last start'.'</th>'; $c++;
			$ths[] = '<th>'.'netaddr'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}	 

    public function gethtmlrow() {
		$tds = Array();
		$ac = self::$alert_color_red;
		
		$tds[] = '<td style="text-align:right" >'.$this->name.'</td>';
		$tds[] = '<td>'.$this->swversion.'</td>';
		$tds[] = '<td>'.$this->location.'</td>';

		$tds[] = '<td>'.$this->lastcpu.' %</td>';

		$tptmpcolor = '';
		if($this->lastptmp>=self::$threshold_prcmaxtmp) $tptmpcolor = $ac;
		$tds[] = '<td style="'.$tptmpcolor.'">'.$this->lastptmp.' °C</td>';
		 

		if ($this->lastuvolt==1)
			$tds[] = '<td style="'.self::$alert_color_red.'">Under</br>voltage</td>';
		else
			$tds[] = '<td>-</td>';

		

		if($this->lastRAMtotal!=0) 
		{
			$rampercent = $this->lastRAMused/$this->lastRAMtotal*100;
			if($rampercent>self::$threshold_cpuandsd) $tptmpcolor=self::$alert_color_red;
			else $tptmpcolor='';
			$rampercent = '</br>('.number_format($rampercent,2,',','.').' %)';
		}
		else 
		{
			$rampercent = '';
			$tptmpcolor='';
		}
		$tds[] = '<td>'.number_format($this->lastRAMtotal/1000,0,',','.').' MB</td>';
		$tds[] = '<td style="'.$tptmpcolor.'">'.number_format($this->lastRAMused/1000,2,',','.').' MB'.$rampercent.'</td>';


		if($this->lastSDtotal!=0) 
		{
			$ramsd = $this->lastSDused/$this->lastSDtotal*100;
			if($ramsd>self::$threshold_cpuandsd) $tptmpcolor=self::$alert_color_red;
			else $tptmpcolor='';
			$ramsd = '</br>('.number_format($ramsd,2,',','.').' %)';
		}
		else
		{
			$ramsd = '';
			$tptmpcolor='';
		} 
		$tds[] = '<td>'.number_format($this->lastSDtotal/1000,2,',','.').' GB</td>';
		$tds[] = '<td style="'.$tptmpcolor.'">'.number_format($this->lastSDused/1000,2,',','.').' GB'.$ramsd.'</td>';
		 
		$time = date("Y-m-d H:i:s", strtotime('-60 second'));
    	$lseencolor = '';
		if($this->lastseen<$time) $lseencolor = $ac;
    	$tds[] = '<td style=" '.$lseencolor.'">'.$this->lastseen.'</td>';

		$tds[] = '<td>'.$this->lastexectime.'</td>';
		$tds[] = '<td>'.str_replace('-','</br>',$this->netaddr).'</td>';
		 
		return '<tr style="text-align:left" id="'.$this->id.'">'.implode('',$tds).'</tr>';
    }
}

class C_dS_slot extends C_id { // parents to a login

    public function getTableName() { return 'slots'; }
    public function getDefaults() { return self::$defaults; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $parentid = false, &$preset = false) { 
		parent::__construct($id, $parentid, $preset); 
	}
    public $port;		// satellite port, like "ttyASM01"
	public $lastcsq;	// last carrier signal quality reported (through alive.php)
	public $status;
	
	public static $alert_color_red = 'color:red;';
	
    public static $defaults = array( 
        'port' 		=> 'port',
		'lastcsq' 		=> 99,
		'status' 		=> 0
    );
	public static $explained = array( 
        'id' 			=> 'satellide unique id [integer ranging 10##]',	
        'parentid' 		=> 'login unique id [bigint ranging 9##]',	
        'port' 			=> 'satellite port, like "ttyASM01"',	
        'lastcsq' 		=> 'last carrier signal quality reported (through alive.php) [1-31, 99], 99 means no network',	
		'status' 		=> ''
    );

	public static function loadbyParentId($parentid)
	{
		$q = new Q('select id from slots where parentid = '.$parentid.';');
		$qids = $q->ids(list_as_array);
		return $qids;
	}
	public static function findByPort($parentid,$port)
	{
		$q = new Q('select id from slots where parentid = '.$parentid.' and port = "'.$port.'";');
		$c = $q->cnt();
		if($c==0)
		{
			return null;
		}
		else
		{
			if($c>1) die('error 0025');  // multiple match for this slot port
			$slotid = $q->ids();
			$dS_slot = new C_dS_slot($slotid);  // satellite is recovered from iccid
			return $dS_slot;
		}
	}

    	
	public static function gethtmlheader() { 
		$c=0; $ths = Array();
		$ths[] = '<th>'.'port'.'</th>'; $c++;
		$ths[] = '<th>'.'csq'.'</th>'; $c++;
		$ths[] = '<th>'.'status'.'</th>'; $c++;
		//$ths[] = '<th>'.'last seen'.'</th>'; $c++;
		$thr ='<tr>'.implode('',$ths).'</tr>';
		for($cols = '';$c--;$cols.='<col>'); $tcols = '<colgroup>'.$cols.'</colgroup>';
		return $thr.$tcols;
	}	 

	//private static $jsrowinteractive = 'onclick="onsat(this.id)"'; // (*al01*)

    public function gethtmlrow() {
		$tds = Array();
		$ac = self::$alert_color_red;
		
		$tds[] = '<td>'.$this->port.'</td>';

		$csqcolor = '';
		if($this->status==30 && ($this->lastcsq<=C_dS_satellite::$threshold_mincsq || $this->lastcsq>=C_dS_satellite::$threshold_maxcsq)) $csqcolor = $ac;

		$tds[] = '<td style="'.$csqcolor.'">'.$this->lastcsq.'</td>'; 

		$lstatuscolor;
		if($this->status==30) //success
		{
			$lstatuscolor= 'color:green;';
		}
		else if($this->status==10 || $this->status==40) //Slotoff et disabled
		{
			$lstatuscolor = '';
		}
	  	else
		{
			$lstatuscolor= $ac;
		}
		

		$tds[] = '<td style="text-align:left;'.$lstatuscolor.'">'.getSlotStatusByCode($this->status).'</td>';

		//$time = date("Y-m-d H:i:s", strtotime('-60 second'));
    	//$lseencolor = '';
		//if($this->lastseen<$time) $lseencolor = $ac;
    	//$tds[] = '<td style=" '.$lseencolor.'">'.$this->lastseen.'</td>';


	 	return '<tr  id="'.$this->id.'">'.implode('',$tds).'</tr>';
    }
}



?>