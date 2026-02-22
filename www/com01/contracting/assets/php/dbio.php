<?php

$nl = chr(10);

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    E X C E P T I O N S
//
class C_dS_exception extends C_dbTrackingC  {
    public function getTableName() { return  'exceptions'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $class;
    public $function;
    public $msg;
    public static $multilines = array(
        'class'		=> 1, 
        'function'	=> 1, 
        'msg'		=> 1
    );
    public static $defaults = array( 	
        'class'		=> 'class undefined', 
        'function'	=> 'function undefined', 
        'msg'		=> 'no message'
    );
    public function getDefaults() { return self::$defaults; }
	
	public static function put($class, $function, $msg, $groupId = 0) { // drops an exception record to the exceptions DB table
        $dS = new C_dS_exception(0, $groupId);
        $dS->class 		= $class;
        $dS->function	= $function;
        $dS->msg 		= $msg;
		$dS->dSsave();
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    D B   I O    &    D B    I D E N T I F I C A T I O N
//

function jsArgument($utf8string) { // makes the string ready for transport to the js client (no newline inside a dataset in the stream)
    $cr = chr(13); $n = chr(10); // intentionally, $nl is not used here, because in some script, $nl is re-defined (*nl1*)
    $jsStream = str_replace($cr.$n, '\n', $utf8string);
    $jsStream = str_replace($n, '\n', $jsStream);
    $jsStream = str_replace($cr, '\n', $jsStream);
    $jsStream = str_replace('"', '\"', $jsStream);
    return $jsStream;
}
function csvArgument($utf8string) { // makes the string field readable for csv format

	$csvStream = str_replace('"', '""', $utf8string); // doubles any double quote (csv protocol), see (*csv*)
    $csvStream = '"'.$csvStream.'"';
    return $csvStream;
}

function SQLinjectionScreen($array) { // $array is expected to be $_POST or $_GET or $_REQUEST
	
	// check for strictly unique forbidden words
	$inj_strict = Array('<script', 'curl_','sleep(','password like', ' and(', ' and ('); // PVH 2022 " and(" was experienced by FirstStep

	// check by combining key words
	$inj_clues = Array('delete', 'select', 'update', 'grant');
	$inj_links = Array('from resources', 'from logins', 'from visitors', 'from reservations', 'from sms', 'from emails', 'or 1=1');
	$inj_tables = Array(' * ', ' % ', '@' , 'set', 'like', 'or 1=1', 'where');
	
	$outcome = false;
	
	if(isset($array['id'])) if(!is_numeric($array['id'])) return '#error 00001';
	if(isset($array['groupId'])) if(!is_numeric($array['groupId'])) return '#error 00002';
	if(isset($array['b'])) if(!is_numeric($array['b'])) return '#error 00003';
	if(isset($array['k'])) if(!is_numeric($array['k'])) return '#error 00004';
	
	if(isset($array)) if(count($array)) {
		foreach($array as $pname => $pvalue) { // pvalue is one of the POST value, this loop scans the complete POST array
			
			$lpvalue = strtolower($pvalue);
			$reduced = str_replace('0x0','0.0',$lpvalue); // no way to insert characters from their hexa value 0x##
			$reduced = str_replace('1=1','1!1',$reduced); // no way to insert 1=1 type SQL request
			$reduced = strtolower($reduced); // capital or lowercase unallowed words will get caught
			
			// scanning on strictly disallowed words
			foreach($inj_strict as $clue) if(strpos($reduced,$clue)!==false) {
				$outcome = $pname.': suspicious |'.$clue.'|';
				break; // exit the loop
			}
			
			// scanning on words combinations
			if($outcome===false)
			foreach($inj_clues as $clue) if(strpos($reduced,$clue)!==false) {
				foreach($inj_links as $linker) if(strpos($reduced,$linker)!==false) {
					foreach($inj_tables as $table) if(strpos($reduced,$table)!==false) {
						// the post contains an association like "delete from reservations" or "drop table visitors"
						$outcome = $pname.': suspicious |'.$clue.'+'.$linker.'+'.$table.'|';
						break;
					}
				}
			}
		}
	}
	return $outcome;
}


class C_dbIO { // Managing logged surfer tracking

    // manage connection opening/closing to DB
    private static $dbConnection;
    private static $instances = 0; 			// number of C_db objects instanciated any moment

    public static $loggedName = 'no one logged';
    public static $loggedId = 0;

    public static $accesslog;
    public static $accesslogMembers;

    public function __construct($logged = false) {

        if(++self::$instances==1) 
            self::$dbConnection = new mysqli('localhost', 'mobminder', 'tgx23PiQ', 'contracting');
        if(mysqli_connect_errno())
            die(); //die('C_dbIO::__construct() - DB Connection Error : '.mysqli_connect_errno().' - '.mysqli_connect_error());
		// self::$dbConnection->query('SET NAMES utf8mb4'); // should be effective but we need to re-write all text/varchar fields of the DB before we activate this (collation search on "spa" returns now all accents...)
		mysqli_set_charset(self::$dbConnection,'utf8mb4');

        if($logged) { // a specific user OR system task (call from CLI - cron) is accessing the DB
            self::$loggedName = $logged;
        } else
            if(isset($_SESSION)) // the web app uses $_SESSION['loginId'] to remember who works between 2 calls from same device
                if(isset($_SESSION['loginId']))
                    C_dbIO::logged(new C_dS_login($_SESSION['loginId']));
    }
    public function __destruct() {

        if(--self::$instances==0) {
            if(!mysqli_connect_errno()) self::$dbConnection->close();
        }
    }
    public static function logged($dS_login, $prefix = '') {		
		if($prefix) $prefix = $prefix.' ';
        self::$loggedName = $prefix.$dS_login->firstname.' '.$dS_login->lastname;
        self::$loggedId = $dS_login->id;
    }
    public static function q($sql,$from=false) {
        $r = self::$dbConnection->query($sql);
        // Returns FALSE on failure. 
        // For successful SELECT, SHOW, DESCRIBE or EXPLAIN queries mysqli_query() will return a mysqli_result object. 
        // For other successful queries mysqli_query() will return TRUE.
        if($r===false) self::failed($sql,$from);
        return $r;
    }
    public static function iid() {	
        return self::$dbConnection->insert_id;
    }
    public static function hit() {		
        return self::$dbConnection->affected_rows;
    }

    private static function failed($info, $from) {
        $from = $from?'called from '.$from.', ':'';
        $basic = $info.' - err#'.self::$dbConnection->errno.' -> '.self::$dbConnection->error;
        $aid = 0; $aname = ''; global $dS_account; if(isset($dS_account)) { $aid = $dS_account->id; $aname = ' - '.$dS_account->name; }
        // C_dS_exception::put('dbio.php C_dbIO'.$aname /*class*/, 'static q()' /*function*/, $from.$aname.$basic /*msg*/, $aid /*account id*/);
		
		if($_SERVER['SERVER_NAME']==='localhost')
			echo(chr(10).'FAILURE executing SQL request: '.'in C_dbIO::q(), '.$from.chr(10).$basic.chr(10)); // comment me before going to production :)
    }
}

// there is no deletor name, because system tasks will never delete business objects
// creator and changer names are foreseen for system tasks that do not have login Ids
C_dbIO::$accesslog = array('created'=>'0000-00-00 00:00:00', 'creator'=>0, 'creatorId'=>0, 'changed'=>'0000-00-00 00:00:00', 'changer'=>0, 'changerId'=>0, 'deleted'=>'0000-00-00 00:00:00', 'deletorId'=>0 );
C_dbIO::$accesslogMembers = array('created', 'creator', 'creatorId', 'changed', 'changer', 'changerId', 'deleted', 'deletorId', 'skeyId', 'localId', 'remoteId' );


define('list_as_string', true);
define('list_as_array', false);

class Q { // Execute very simple queries, esay and fast when no audit tracking of any kind is required
    public $result;
    public function __construct($sql, $from=false) {
		$this->sql = $sql;
        $this->result = C_dbIO::q($sql, $from?$from:'Q::__construct()'); 
    }
    public function __destruct() {
        if(is_object($this->result)) $this->result->close();
    }
    public function ids($coma=true) { return $this->mlist('id', $coma); }
    public function groupIds($coma=true) { return $this->mlist('groupId', $coma);	}
    public function rscIds($coma=true) { return $this->mlist('resourceId', $coma);	}
    public function cnt() { $c = $this->result->num_rows; return $c; }
    public function c() { $row = $this->result->fetch_array(); if($this->result->num_rows) $this->result->data_seek(0); return $row['c']; } // returns a counter queried as c
    public function b() { // returns a boolean queried as 'boolean', example: select (case when accessLevel < 5 then 1 else 0 end) as boolean from logins where id = 21592;
		$row = $this->result->fetch_array();
		if($this->result->num_rows) $this->result->data_seek(0);
		return $row['boolean']; 
	} 
    public function one($m='id', $default = false) { // (*Q::one*) // assuming that the query returns only one row
        if($this->result->num_rows) { $row = $this->result->fetch_array(); $this->result->data_seek(0); return $row[$m]; } 
        else return $default;
    } 
    public function hits() { return C_dbIO::hit(); }
    public function newid() { return C_dbIO::iid(); }

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
}


abstract class C_dbID { // Executes simple queries and match the result to a child object

    public $id;	
    public $groupId; // default dS values are set here, along with id and groupId

	public static function tracknow() { return Date('Y-m-d H:i:s',time()); } // time format used for change tracking
	
    public function __construct($id=0, $groupId=0, $preset=false) { // PVH 2021-3 changed $groupId=false by $groupId=0

        $this->id = 0;
        $this->groupId = 0;

        $avoid = array('id', 'groupId');
        $avoid = array_merge($avoid, C_dbIO::$accesslogMembers);
        // load from db OR load default values
	
		// echo '+';

        if($id > 0) { // EXISTING dS

            $t = $this->getTableName(); // obtain from child instance
			// $g = ''; // $groupId ? ' and groupId = '.$groupId : ''; // supposed to spedd up queries? TBI
			
            $result = C_dbIO::q('SeLeCT * FroM '.$t.' WheRe id = '.$id.';', 'C_dbID::__construct(table:'.$t.', id:'.$id.')');
            if(!$result->num_rows) 
                if(property_exists($this,'archived')) // when the object has an archive_ table, also lookup this archive_table (*ar01)
                    $result = C_dbIO::q('SELECT * FROM archive_'.$t.' WHERE id = '.$id.';', 'C_dbID::__construct(table:archive_'.$t.', id:'.$id.')');
            if($result->num_rows) {
                $row = $result->fetch_array();
                foreach($this as $member => &$value) $value = $row[$member]; unset($value);
            }
            $result->close();	
        }
        else {  // NEW dS

            // new object, set default values
            $defaults = $this->getDefaults();
            foreach($this as $member => &$value) 
                if(array_search($member, $avoid) === false) // no overwrite for generic members
                    $value = $defaults[$member];
            // unset($value);
            $this->id = $id;
            $this->groupId = $groupId;
        }

        // Option: copy from the preset object (it must have the same class of course!)
        if(is_object($preset)) {  // the preset is an o_dS_
            foreach($this as $member => &$value) 
                if(array_search($member, $avoid) === false) // no overwrite for generic members
                    $value = $preset->{$member};
            // unset($value);
        }

        // Option: copy from array (typically used when posting, array is a $_POST)			
        if(is_array($preset)) {  // the preset is an array, it can be e.g. $_POST 
            foreach($this as $member => &$value) 
                if(array_key_exists($member, $preset)) // the preset must not contain all members, some of them will do
                    if($member!='id')
                        $value = $preset[$member];
            // unset($value);
        }

    }
    public function __destruct() { }
    public function __clone() { }

	
    public function getInsertFieldsList()	{ 
        $fields = Array();
        foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
        else $fields[] = $member; 	
        return implode(',',$fields);
    }
    public function getInsertValuesList()	{ 
        $values = Array();
        foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
            else{$values[] = '"'.addslashes($value).'"';}  // see (*as*)
        $test = implode(',',$values);
        return $test;
    }
    public function getUpdateFieldsList() {
        $assigns = Array();
        foreach($this as $member => $value)
            if( $member=='id' || $member=='groupId' ) continue;
			else $assigns[] = $member.'="'.addslashes($value).'"'; // see (*as*)
        return implode(',',$assigns);
    }

    public function save($groupId = false) {
        if($groupId) $this->groupId = $groupId; // a new groupId was specified (usefull for linking new objects to their hierarchy)
        $here = $this->getClassName().'::C_dbID::save()';
        $archived_prefix = '';
        $archive = false;
        if(property_exists($this,'archived')) // (*dbio01*) check if this class has an archive table
            if($this->archived == 1) {
                $archived_prefix = 'archive_';
                $archive = true;
            }

        if($this->id <= 0) { // new item
            $if = $this->getInsertFieldsList();
            $iv = $this->getInsertValuesList();
            $sql = 'INSERT INTO '.$this->getTableName().' ( '.$if.' ) VALUES ('.$iv.')';
            // echo $sql;
            // echo($sql);
            C_dbIO::q($sql,$here);
            $this->id = $newId = C_dbIO::iid();
            
        }
        else { // existing item, if archived, it goes back to archive table ( archived_prefix )
			
			$fields = $this->getUpdateFieldsList();
			if($groupId) // explicit change of groupId
				$fields = 'groupId='.$groupId.','.$fields;
            C_dbIO::q('update '.$archived_prefix.$this->getTableName().' set '.$fields.' where id ='.$this->id.';',$here);
		}

        return $this;
    }
    public function dSsave($groupId = false) {
        return $this->save($groupId);
    }
    public function dSdelete() { // deletes one objects in this instance, virtual or replica
        C_dbIO::q('DELETE FROM '.$this->getTableName().' WHERE id = '.$this->id.';', 'C_dbID::dSdelete()');
        if(property_exists($this,'archived')) 
            C_dbIO::q('DELETE FROM archive_'.$this->getTableName().' WHERE id = '.$this->id.';', 'C_dbID::dSdelete()');
        return $this;
    }

    public function stream($tracking = false, $sep = '|', $includeOnly = false) { // if tracking is true, access log members are streamed along
        $fields = array();
        $csv = $sep==';'; // csv format is assumed when separator is ";"
        $ml = static::$multilines; // multi lines allowed fields list
		
		// THIS IS WHERE YOU WANT YOUR CODE ACT FAST !!
		// 
		// Here streams ALL the data to any kind of client

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
			$ids = $this->id.$sep.$this->groupId; // note that id and groupId have no default values
			$accesslog = '';
			if($tracking) {
                $accesslog = Array();
                foreach(C_dbIO::$accesslog as $alm => $v) { // multiple inheritance stages do mix the members order list, we need to re-shape this before streaming
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
    public function stream1($wt = false, $bank = false) { 
        // an equivalent of this function for multi-data sets streaming exists in C_dbGate::stream()
        global $nl;
        if($bank) $bank = '#'.$bank; else $bank = '';
        return '#'.$this->getClassName().$bank.$nl.$this->stream($wt); 
    }

    public function memberslist($tracking = false, $sep = '|') { 
        $fields = array();
        $defaults = static::$defaults;
        $ids = array('id'=>0, 'groupId'=>0); // note that id and groupId have no default values
        $accesslog = array();

        foreach($this as $member => $value) { // scans the full instance (inherited members included)
            if(array_key_exists($member, $ids)) { $ids[$member] = $member; continue; }
            if(array_key_exists($member, C_dbIO::$accesslog)) { if($tracking) $accesslog[$member] = $member; continue; } 

            // for all other specific members
            $quotes = true; // by default, quotes will frame the values
            if(isset($defaults[$member]))
                if(is_int($defaults[$member])) $quotes = false; // double quotes are not needed for integer values
            $fields[] = $quotes ? jsArgument($member) : $member;
        }
        if($tracking) {
            $ordered = Array();
            foreach(C_dbIO::$accesslog as $m => $v) { // multiple inheritance stages do mix the members order list, we need to re-shape this before streaming
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
			'groupId' 		=> 'parent object unique identifier',
			
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
	public function explain($f) { if(!isset(static::$explained[$f])) return self::trackexplained($f); else return static::$explained[$f]; }	

}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//    D B   R E C O R D S       T R A C K I N G 
//

abstract class C_dbTrackingC extends C_dbID { // Creation tracking

    public $created;
	public $creator;
	public $creatorId;

    abstract function getClassName();
    abstract function getDefaults();
    abstract function getTableName();

    public function __construct($id=0, $groupId=false, $preset=false) { // preset applies at creation OR after existing object load
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public function __clone() { parent::__clone(); }

    public function dSsave($groupId = false) {
        if($this->id<=0) {
            $this->created = parent::tracknow();
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
        }
        return parent::dSsave($groupId);
    }
    public function dSdelete() {
        return parent::dSdelete();
    }
}

abstract class C_dbTrackingCC extends C_dbID {  // Creation and Change tracking

    public $created;
	public $creator;
	public $creatorId;
	
    public $changed;
	public $changer;
	public $changerId;

    abstract function getClassName();
    abstract function getDefaults();
    abstract function getTableName();

    public function __construct($id=0, $groupId=false, $preset=false) { // preset applies at creation OR after existing object load
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public function __clone() { parent::__clone(); }

    public function dSsave($groupId = false) {
        if($this->id<=0) {
            $this->created = parent::tracknow();
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
            $this->changed = '0000-00-00 00:00:00'; // 0000-00-00 00:00:00
            $this->changer = '';
            $this->changerId = 0;
        } else {
            $this->changed = parent::tracknow();
            $this->changer = C_dbIO::$loggedName;
            $this->changerId = C_dbIO::$loggedId;
        }
        return parent::dSsave($groupId);
    }
    public function dSdelete() {
        return parent::dSdelete();
    }
}
abstract class C_dbTrackingCCD extends C_dbID {  // Creation, Change, and Deletion tracking + special function for deleting (dSobsolete)

    public $created;
	public $creator;
	public $creatorId;
	
    public $changed;
	public $changer;
	public $changerId;
	
    public $deleted;
	public $deletorId;

    abstract function getClassName();
    abstract function getDefaults();
    abstract function getTableName();
	
    public function __construct($id=0, $groupId=false, $preset=false) { // preset applies at creation OR after existing object load
        if($this->id<=0) {
            $this->created = parent::tracknow();
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
            $this->changed = '0000-00-00 00:00:00'; 
            $this->changer = '';
            $this->changerId = 0;
            $this->deleted = '0000-00-00 00:00:00'; 
            $this->deletorId = 0;
        }
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public function __clone() { parent::__clone(); }

    public function dSsave($groupId = false) {
        if($this->id<=0) {
            // this part has moved to the constructor
        } else {
            $this->changed = parent::tracknow();
            $this->changer = C_dbIO::$loggedName;
            $this->changerId = C_dbIO::$loggedId;
        }
        return parent::dSsave($groupId);
    }
    public function dSsaveAsNew($groupId = false) { // drop the change tracking, keeps only the creation tags
		if($this->id<=0) {
            // this part has moved to the constructor
        } else {
            $this->created = parent::tracknow(); 
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
            $this->changed = 0;
            $this->changer = '';
            $this->changerId = 0;
		}
        return parent::dSsave($groupId);
	}
    public function dSobsolete() { // indicated as removed but still present and tracked in DB
        $this->deleted = parent::tracknow();
        $this->deletorId = C_dbIO::$loggedId;
        return parent::dSsave();
    }
    public function dSdelete() { // technically and forever removed from DB
        return parent::dSdelete();
    }

    // SQL when you whish to pass a class to CCD
    //
    // ALTER TABLE `mytable` ADD COLUMN `deletorId` bigint(20) unsigned NOT NULL default 0 AFTER `id`;
    // ALTER TABLE `mytable` ADD COLUMN `deleted` timestamp unsigned NOT NULL default '0000-00-00 00:00:00' AFTER `id`;
    //
    // ALTER TABLE `mytable` ADD COLUMN `changerId` bigint(20) unsigned NOT NULL default 0 AFTER `id`;
    // ALTER TABLE `mytable` ADD COLUMN `changer` varchar(64) NOT NULL AFTER `id`;
    // ALTER TABLE `mytable` ADD COLUMN `changed` timestamp NOT NULL default '0000-00-00 00:00:00' AFTER `id`;
    //
    // ALTER TABLE `mytable` ADD COLUMN `creatorId` bigint(20) unsigned NOT NULL default 0 AFTER `id`;
    // ALTER TABLE `mytable` ADD COLUMN `creator` varchar(64) NOT NULL AFTER `id`;
    // ALTER TABLE `mytable` ADD COLUMN `created` timestamp NOT NULL default '0000-00-00 00:00:00' AFTER `id`;
	
}
abstract class C_dbTrackingCCDA extends C_dbID {  // Creation, Change, Archive and Deletion tracking

    public $created;
	public $creator;
	public $creatorId;
	
    public $changed;
	public $changer;
	public $changerId;
	
    public $deleted;
	public $deletor;
	public $deletorId;
	
    public $archtime;
	public $archivor;
	public $archivorId;

    abstract function getClassName();
    abstract function getDefaults();
    abstract function getTableName();
	
    public function __construct($id=0, $groupId=false, $preset=false) { // preset applies at creation OR after existing object load
        if($this->id<=0) {
            $this->created = time();
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
			
				$this->changed = 0; 
				$this->changer = '';
				$this->changerId = 0;
			
            $this->deleted = 0; 
            $this->deletor = '';
            $this->deletorId = 0;
			
				$this->archtime = 0; 
				$this->archivor = '';
				$this->archivorId = 0;
        }
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public function __clone() { parent::__clone(); }

    public function dSsave($groupId = false) {
        if($this->id<=0) {
            // this part has moved to the constructor
        } else {
            $this->changed = time();
            $this->changer = C_dbIO::$loggedName;
            $this->changerId = C_dbIO::$loggedId;
        }
        return parent::dSsave($groupId);
    }
    public function dSsaveAsNew($groupId = false) { // drop the change tracking, keeps only the creation tags
		if($this->id<=0) {
            // this part has moved to the constructor
        } else {
            $this->created = time(); 
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
            $this->changed = 0;
            $this->changer = '';
            $this->changerId = 0;
		}
        return parent::dSsave($groupId);
	}
    public function dSobsolete() { // indicated as removed but still present and tracked in DB
        $this->deleted = time();
        $this->deletor = C_dbIO::$loggedName;
        $this->deletorId = C_dbIO::$loggedId;
        return parent::dSsave();
    }
    public function dSdelete() { // technically and forever removed from DB
        return parent::dSdelete();
    }
	
}

define('with_tracking', true);
define('no_tracking', false);
define('no_bank', false);
define('no_alias', false);

//JBO
define('payplan_monthly_debit', 1);
define('payplan_annual_debit', 2);
define('payplan_annual_invoice', 3);



class C_dS_contract extends C_dbTrackingC {
    public function getTableName() { return  'contracts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $leadid;
    public $pmPp;
    public $invCompanyName;
    public $invCompanyNumber;    
    public $beginAccountingYear;
    public $endAccountingYear; // Keep the only one we use beginAccountingYear of endAccountingYear (to be checked)
    // public $invContactPerson;
    public $invContactPersonFirstname;
    public $invContactPersonLastname;
    public $invCourtesy;
    public $invAddress;
    public $invCity;
    public $invCP;
    public $invCountry;
    public $TVA;
    public $invPhone;
    public $invMobile;
    public $invEmail;
    public $BIC;
    public $IBAN; 		
    public $monthlyPackage;
    public $smsPackage;
    public $extraSmsPackage;
    public $birthdayContract; //Should be called $contractBirthday JBO
    public $paymentType; //Should be called $payPlan JBO
    public $numberBusinessDiaries;    
    public $numberEmployees;
    public $numberSmsAppointment;	
    public $clientNr;
    public $invNotes;
    public $placeSigning;
    public $accessCode;

    public static $multilines = array(
        'invNotes' 		    => 1
    );
    public static $defaults = array( 
        'leadid'                    => 0,
        'pmPp'                      => '',
        'invCompanyName'            => '',
        'invCompanyNumber'          => '',
        'beginAccountingYear'       => '',
        'endAccountingYear'         => '',
        // 'invContactPerson'       => '',
        'invContactPersonFirstname' => '',
        'invContactPersonLastname'  => '',
        'invCourtesy'               => '',
        'invAddress'                => '',
        'invCity'                   => '',   
        'invCP'                     => '',   
        'invCountry'                => '',   
        'TVA' 		                => '',
        'invPhone'                  => '',
        'invMobile'                 => '',
        'invEmail'                  => '',
        'BIC' 	                    => '',
        'IBAN' 		                => '',
        'monthlyPackage' 			=> '',	
        'smsPackage' 		        => 0,
        'extraSmsPackage' 		    => 0,
        'birthdayContract' 		    => '',	
        'paymentType' 		        => 0, 
        'numberBusinessDiaries' 	=> 0, 		
        'numberEmployees' 		    => 0, 
        'numberSmsAppointment' 		=> 0,  
        'clientNr' 	                => 0,
        'invNotes'                  => '',
        'placeSigning'              => '',
        'accessCode' 	            => 0
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'leadid' 		        => 'ID of the lead',
        'invCompanyName'        => 'alphabetic field',
        'invCompanyNumber'      => 'alphabetic field',        
        // 'invContactPerson'      => 'alphabetic field',
        'invContactPersonFirstname'      => 'alphabetic field',
        'invContactPersonLastname'      => 'alphabetic field',
        'invAddress'            => 'alphabetic field',
        'invCity'               => 'alphabetic field', 
        'TVA'        	        => 'alphabetic field',
        'invPhone'              => 'alphabetic field',
        'invMobile'             => 'alphabetic field',
        'invEmail'              => 'alphabetic field',
        'BIC'    	 	        => 'alphabetic field',
        'IBAN'   	 	        => 'numeric field with international prefix but no +. Like 32497401626',
        'monthlyPackage' 		=> 'lowercase alphanumeric field with only @ allowed as special char',
        'smsPackage'    	    => 'free alphanum',
        'extraSmsPackage'    	=> 'free alphanum',
        'birthdayContract' 		=> 'free alphanum',
        'paymentType' 	 	    => 'free alphanum',
        'numberBusinessDiaries' => 'free alphanum',
        'numberEmployees' 	 	=> 'alphabetic field',
        'numberSmsAppointment' 	=> 'alphabetic field',
        'clientNr' 	 	        => 'alphabetic field',
        'accessCode' 	 	    => 'alphabetic field'
    );
}

class C_dS_customer extends C_dbTrackingCCD {
    public function getTableName() { return  'customers'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $leadid;
    public $contractId;
    public $clientNr;
    public $accountName;
    public $wallet; 		
    public $colorChip;		
    public $companyname;
    public $speciality;
    public $sector;
    public $firstname;    
    public $lastname;
    public $civility;	
    public $tel; //should be mobile
    public $phoneNr; // should be phone
    public $email;
    public $address;
    public $city;
    public $country;
    public $TVA;
    public $BIC; 		
    public $IBAN;		
    public $monthlyPackage;
    public $currency;
    public $notesMonthlyPackage;
    public $numberOfSms;
    public $amountForAdditionalSms;
    public $birthdayContract;    
    public $numberBusinessDiaries;	
    public $numberEmployees;
    public $numberSmsAppointment;
    public $dateSigned;
    public $placeOfsigning;
    public $legalEntity;
    public $accountingYear;

    public static $multilines = array(
        'notes' 		    => 1
    );
    public static $defaults = array( 
        'leadid'                    => 0,
        'contractId'                => 0,
        'clientNr' 		            => 0,
        'accountName' 	            => '',
        'wallet' 		            => 0,
        'colorChip' 			    => '',	
        'companyname' 		        => '',
        'speciality' 		        => '',	
        'sector' 		            => '', 
        'firstname' 		        => '', 		
        'lastname' 		            => '', 
        'civility' 		            => '',  
        'tel' 	                    => '',
        'phoneNr' 	                => '',
        'email' 			        => '',
        'address'                   => '',
        'city' 		                => '',
        'country' 	                => '',
        'TVA' 		                => '',
        'BIC' 			            => '',	
        'IBAN' 		                => '',
        'monthlyPackage' 		    => '',
        'currency'                  => '',
        'notesMonthlyPackage'       => '',
        'numberOfSms' 		        => '', 
        'amountForAdditionalSms' 	=> '', 		
        'birthdayContract' 		    => '',
        'numberBusinessDiaries' 	=> '',  
        'numberEmployees' 	        => '',
        'numberSmsAppointment' 	    => '',
        'dateSigned' 			    => '',
        'placeOfsigning' 	        => '',
        'legalEntity' 			    => '',
        'accountingYear' 	        => ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'leadid'                    => 0,
        'contractId'                => 0,
        'clientNr' 		            => 0,
        'accountName' 	            => '',
        'wallet' 		            => '',
        'colorChip' 			    => '',	
        'companyname' 		        => '',
        'speciality' 		        => '',	
        'sector' 		            => '', 
        'firstname' 		        => '', 		
        'lastname' 		            => '', 
        'civility' 		            => '',  
        'tel' 	                    => '',
        'phoneNr' 	                => '',
        'email' 			        => '',
        'address'                   => '',
        'city' 		                => '',
        'country' 	                => '',
        'TVA' 		                => '',
        'BIC' 			            => '',	
        'IBAN' 		                => '',
        'monthlyPackage' 		    => '',	
        'currency'                  => '',
        'notesMonthlyPackage'       => '',
        'numberOfSms' 		        => '', 
        'amountForAdditionalSms' 	=> '', 		
        'birthdayContract' 		    => '', 
        'numberBusinessDiaries' 	=> '',  
        'numberEmployees' 	        => '',
        'numberSmsAppointment' 	    => '',
        'dateSigned' 			    => '',
        'placeOfsigning' 	        => '',
        'legalEntity' 			    => '',
        'accountingYear' 	        => ''
    );    	
}

class C_dS_lead extends C_dbTrackingCC {
    public function getTableName() { return  'leads'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $accountm;
    public $firstname;
    public $lastname;
    public $phoneNr; 		
    public $email;		
    public $country;
    public $city;
    public $address;
    public $companyname;    
    public $language;
    public $sector;
    public $speciality;	
    public $status;
    public $source;
    public $sourcedetails;
    public $followUp;
    public $notes;
    public $demo_AcNr;
    public $demo_AcName;

    public static $multilines = array(
        'notes' 		    => 1
    );
    public static $defaults = array( 
        'accountm'          => 0,
        'firstname' 		=> '',
        'lastname' 	        => '',
        'phoneNr' 		    => '',
        'email' 			=> '',	
        'country' 		    => '',
        'city' 		        => '',	
        'address' 		    => '', 
        'companyname' 		=> '', 		
        'language'          => 1,
        'sector' 		    => 999, 
        'speciality' 		=> '',  
        'status' 	        => 1,
        'source' 	        => 999,
        'sourcedetails'     => 999,
        'followUp'          => 999,
        'notes' 			=> '',
        'demo_AcNr' 		=> '',
        'demo_AcName' 		=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'accountm' 		=> 'ID of the account manager connected to the lead',
        'firstname' 	=> 'alphabetic field',
        'lastname' 	 	=> 'alphabetic field',
        'phoneNr' 	 	=> 'numeric field with international prefix but no +. Like 32497401626',
        'email' 		=> 'lowercase alphanumeric field with only @ allowed as special char',
        'country'    	=> 'free alphanum',
        'city' 		    => 'free alphanum',
        'address' 	 	=> 'free alphanum',
        'companyname' 	=> 'free alphanum',
        'language'      => 'alphabetic field',
        'sector' 	 	=> 'alphabetic field',
        'speciality' 	=> 'alphabetic field',
        'status' 	 	=> 'alphabetic field',
        'source' 	 	=> 'alphabetic field',
        'followUp:'     => 'Follow up of lead',
        'notes' 	 	=> 'alphabetic field',
        'demo_AcNr' 	=> 'alphabetic field',
        'demo_AcName' 	=> 'alphabetic field'
    );
}

class C_dS_followUp extends C_dbID {
    public function getTableName() { return  'followup'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $name;
    public static $multilines = false;

    public static $defaults = array( 
        'name' 			=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'name' 		=> 'Which follow up status the lead is'
    );
}

class C_dS_sector extends C_dbID {
    public function getTableName() { return  'sector'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $name;
    public static $multilines = false;

    public static $defaults = array( 
        'name' 			=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'name' 		=> 'Which sector the lead is active in'
    );
}

class C_dS_source extends C_dbID {
    public function getTableName() { return  'source'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $name;
    public static $multilines = false;

    public static $defaults = array( 
        'name' 			=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'name' 		=> 'Which sector the lead is active in'
    );
}

class C_dS_users extends C_dbID {
    public function getTableName() { return  'users'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $firstname;
    public $lastname;
    public $email;
    public $mobile;
    public $username;
    public $password;
    public $taycan;
    public $accesslevel;

    public static $multilines = false;

    public static $defaults = array( 
        'firstname'             => '',
        'lastname'              => '',
        'email'             => '',
        'mobile'              => '',
        'username'              => '',
        'password'              => '',
        'taycan'                => '',
        'accesslevel' 			=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'firstname'             => 'Firstname of user',
        'lastname'              => 'LAstname of user',
        'username'              => 'Username of user',
        'password'              => 'Pw of user',
        'taycan'                => 'Encrypted taycan',
        'accesslevel' 			=> 0
    );
}

class C_dS_language extends C_dbID {
    public function getTableName() { return  'language'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset); 
	}
    public $full_l;
    public $shortened_l;

    public static $multilines = false;

    public static $defaults = array( 
        'full_l'             => '',
        'shortened_l'        => ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
    public function getInfo() {
        $phoneNr = $this->phoneNr ? ' (+'.$this->phoneNr.')' : '' ;
        return $this->lastname.', '.$this->firstname.$phoneNr;
    }
    public function getNote() {
        if($this->notes == '') return false;
        return $this->lastname.':'.$this->notes;
    }
    public static $explained = array ( 
        'full_l'             => 'full name of language',
        'shortened_l'        => 'shortened version of language'
    );
}

////////////////////////////  O P E N    D B   C O N N E C T I O N
//
// in files that require dbio.php, if $systemLog is defined, it is set has "changer" on dbrecord tracking. 
// Else, the $_SESSION['loginId'] is used.
//

$dbio = new C_dbIO(isset($systemLog)?$systemLog:false); // $systemLog must be defined in the caller script, ahead of the inclusion of this script

?>