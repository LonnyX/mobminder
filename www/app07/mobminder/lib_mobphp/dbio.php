<?php

//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//

// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium
$nl = chr(10);



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
	$inj_clues = Array('delete', 'select', 'update', 'grant', 'show');
	$inj_links = Array('from resources', 'from logins', 'from visitors', 'from reservations', 'from sms', 'from emails', 'or 1=1','tables');
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
    public static $dbConnection;
    private static $instances = 0; 			// number of C_db objects instanciated any moment

    public static $loggedName = 'no one logged';
    public static $loggedId = 1; // very interesting experience, let's see if sometimes, things are recorded by un-logged origin, see (*io01*) where this is usefull

    public static $accesslog;
    public static $accesslogMembers;

    public function __construct($logged = false) {

        if(++self::$instances==1) 
            self::$dbConnection = new mysqli('localhost', 'mobminder', 'tgx23PiQ', 'mobminder');
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
        C_dS_exception::put('dbio.php C_dbIO'.$aname /*class*/, 'static q()' /*function*/, $from.$aname.$basic /*msg*/, $aid /*account id*/);
		
		if($_SERVER['SERVER_NAME']==='localhost')
			echo(chr(10).'FAILURE executing SQL request: '.'in C_dbIO::q(), '.$from.chr(10).$basic.chr(10)); // comment me before going to production :)
    }
}


// there is no deletor name, because system tasks will never delete business objects
// creator and changer names are foreseen for system tasks that do not have login Ids

// C_dbIO::$accesslog = array('created'=>'0000-00-00 00:00:00', 'creator'=>0, 'creatorId'=>0, 'changed'=>'0000-00-00 00:00:00', 'changer'=>0, 'changerId'=>0, 'deleted'=>'0000-00-00 00:00:00', 'deletorId'=>0 );
C_dbIO::$accesslog = array('created'=>'0000-00-00 00:00:00', 'creator'=>0, 'creatorId'=>0, 'changed'=>'0000-00-00 00:00:00', 'changer'=>0, 'changerId'=>0, 'deleted'=>'0000-00-00 00:00:00', 'deletor'=>'', 'deletorId'=>0 );
// pvh2025 in the $accesslogExtended so far only deletor makes a difference.

C_dbIO::$accesslogMembers = array('created', 'creator', 'creatorId', 'changed', 'changer', 'changerId', 'deleted', 'deletor', 'deletorId', 'skeyId', 'localId', 'remoteId' );


define('list_as_string', true);
define('list_as_array', false);

class Q { // Execute very simple queries, esay and fast when no audit tracking of any kind is required
    public $result;
    public $sql;
    public function __construct($sql, $from=false) {
		$this->sql = $sql;
		if($sql instanceof C_preparedSQL) {
			// do nothing as result is unknown until $this->execute_prepared() gets executed
		} else {
			$this->sql = $sql;
			$this->result = C_dbIO::q($sql, $from?$from:'Q::__construct()'); 
		}
    }
	public function execute_prepared($args) { // args must be an array that counts the number of digits passed to idsb when constructing C_preparedSQL
		$this->result = $this->sql->prexecute($args);
		return $this->result;
	}
    public function __destruct() {
        if(is_object($this->result)) $this->result->close();
    }
    public function ids($coma=true) { return $this->mlist('id', $coma); }
    public function groupIds($coma=true) { return $this->mlist('groupId', $coma);	}
    public function rscIds($coma=true) { return $this->mlist('resourceId', $coma);	}
    public function cnt() { $c = $this->result->num_rows; return $c; } // cnt() applies to select queries, see hits() for update/insert queries
    public function c() { if($this->result===false) return 0; $row = $this->result->fetch_array(); if($this->result->num_rows) $this->result->data_seek(0); return $row['c']; } // returns a counter queried as c
    public function b() { // returns a boolean queried as 'boolean', example: select (case when accessLevel < 5 then 1 else 0 end) as boolean from logins where id = 21592;
		$row = $this->result->fetch_array();
		if($this->result->num_rows) $this->result->data_seek(0);
		return $row['boolean']; 
	} 
    public function one($m='id', $default = false) { // (*Q::one*) // assuming that the query returns only one row
        if($this->result->num_rows) { $row = $this->result->fetch_array(); $this->result->data_seek(0); return $row[$m]; } 
        else return $default;
    } 
    public function hits() { return C_dbIO::hit(); } // hits() applies to update/insert queries, see cnt() for select queries
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
    public function idx($x, $y) { // returns an Array where member $x is the key and member $y is the value, example of usage here (*q02*)
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


class C_preparedSQL {
	public $mysqlprepared;
	public $idsb;
    public function __construct($questionmarkedsql, $idsb) {
		$this->mysqlprepared = C_dbIO::$dbConnection->prepare($questionmarkedsql);
		$this->idsb = $idsb;
	}
    public function execute($args) { // $args is something like intended for $stmt->bind_param('isss', &$id, &$a, &$b, &$c, &$d);
		call_user_func_array([$this->mysqlprepared, 'bind_param'], $args); 
		$this->mysqlprepared->execute();
	} 
    public function prexecute($args) { // $args is something like intended for $stmt->bind_param(&$id, &$a, &$b, &$c, &$d) !! without idsb !!
			$args = array_merge([$this->idsb],$args);
			
			// echo chr(10).'prexecute'.chr(10);
			// print_r($args);
			// echo chr(10).'---'.chr(10);
			
		call_user_func_array([$this->mysqlprepared, 'bind_param'], $args); 
		$this->mysqlprepared->execute();
		return $this->mysqlprepared->get_result();
	} 
	public function getresult() {
		return $this->mysqlprepared->get_result();
	}
}

abstract class C_dbID { // Executes simple queries and match the result to a child object

    public $id;	
    public $groupId; // default dS values are set here, along with id and groupId

	public static function tracknow($utc=false) {
		if($utc) return time(); // UTC bigint(20) unsigned according to UNIX EPOCH
		else return Date('Y-m-d H:i:s',time()); // time format used for change tracking
	}
	
    public function __construct($id=0, $groupId=0, $preset=false) { // PVH 2021-3 changed $groupId=false by $groupId=0

        $this->id = 0;
        $this->groupId = 0;
		
		$debugecho = 0;
		if($debugecho) {
			$cn = $this->getClassName();
			echo '  '.$cn.'::C_dbID::__construct(id = '.$id.', groupId = '.$groupId.')'.chr(10);
		}

        $avoid = array('id', 'groupId');
        $avoid = array_merge($avoid, C_dbIO::$accesslogMembers);
        // load from db OR load default values
	
        if($id > 0) { // EXISTING dS, we load it

			$t = $this->getTableName(); // obtain from child instance
			$ispreparable = isset(static::$prepared);
			if($ispreparable) if(!isset(static::$prepared['select'])) $ispreparable = false; // must be explicitely declared like, select = 0, if not declared, no prepared statement for this query catagory
			$isarchivable = property_exists($this,'archived');
			
			// see if our child has prepared his MySQL statements
			if($ispreparable) {
				$this->sqlselect('',$t);
				if($isarchivable) $this->sqlselect('archive_',$t);
			}
			// $g = ''; // $groupId ? ' and groupId = '.$groupId : ''; // supposed to spedd up queries? TBI
			
			if($ispreparable) {
				// echo 'Executing prepared select statement<br/>'.chr(10);
				if($debugecho) echo '       executing $preparedSQL = [SELECT] id = '.$id.chr(10);
				$preparedSQL = static::$prepared['select'];
				$stmt = $preparedSQL->mysqlprepared;
				$stmt->bind_param('i', $id);
				$stmt->execute();
				$result = $stmt->get_result();
				// $stmt->close(); // Do not close, or you loose the prepared statement in its entirety
			}
            else $result = C_dbIO::q('SeLeCt * FroM '.$t.' WheRe id = '.$id.';', 'C_dbID::__construct(table:'.$t.', id:'.$id.')');
			
            if(!$result->num_rows) 
                if($isarchivable) { // when the object has an archive_ table, also lookup this archive_table (*ar01)
                    
					if($ispreparable) {
						if($debugecho) echo '       executing $preparedSQL = [archive_SELECT] id = '.$id.chr(10);
						$preparedSQL = static::$prepared['archive_select'];
						$stmt = $preparedSQL->mysqlprepared;
						$stmt->bind_param('i', $id);
						$stmt->execute();
						$result = $stmt->get_result();
						// $stmt->close();  // Do not close, or you loose the prepared statement in its entirety
					}
					else 	
						$result = C_dbIO::q('SELECT * FROM archive_'.$t.' WHERE id = '.$id.';', 'C_dbID::__construct(table:archive_'.$t.', id:'.$id.')');
				}
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
            if($groupId) $this->groupId = $groupId;
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
    public function __clone() { 
		$cn = $this->getClassName();
		// echo 'cloning from '.$cn.' with this->id ='.$this->id;
	}

    public function getInsertFieldsList()	{ 
        $fields = Array();
        foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
        else $fields[] = $member; 	
        return implode(',',$fields);
    }
    public function getInsertValuesList($o = false)	{ // $o like 'prepare' or 'idsb' or 'raw'
        $values = Array();
        
		foreach($this as $member => $value)
            if($member=='id') continue; // auto-increment
        else {
			if($o == 'prepare') $values[] = '?';
			else if($o == 'idsb') $values[] = 's';
			else if($o == 'raw') $values[] = &$this->{$member}; // keep tha reference & here or bind_params() will not work...
			else $values[] = '"'.addslashes($value).'"'; // see (*as*)
		}
		
		
		if($o == 'idsb') return implode('',$values);
			else if ($o == 'raw') return $values;
			else return implode(',',$values);
		
		// for a prepare, it returns '?,?,?,?'
    }
    // public function getUpdateFieldsList($o = false, $groupId = false)	{ // $o like 'prepare' or 'idsb' or 'raw'
    public function getUpdateFieldsList($o = false)	{ // $o like 'prepare' or 'idsb' or 'raw'
        $assigns = Array();
		
        foreach($this as $member => $value)
			if($member=='id') continue;
			else {
				if($o == 'prepare') $assigns[] = $member.'=?';
				else if($o == 'idsb') $assigns[] = 's';
				else if($o == 'raw') $assigns[] = &$this->{$member};
				else $assigns[] = $member.'="'.addslashes($value).'"'; // see (*as*)
			}
		
		if($o == 'idsb') return implode('',$assigns);
			else if($o == 'raw') return $assigns;
			else return implode(',',$assigns);
    }

	//////////////////////////

	public function sqlselect($ap,$t) { // $ap = archive prefix, $t = target DB table
		
		if(static::$prepared[$ap.'select'] !== 0) return; // this prepared statement already exists
			
				$questionmarked = 'SeLeCt * FroM '.$ap.$t.' WheRe id = ?;';
			$preprd = new C_preparedSQL($questionmarked,'i');
		static::$prepared[$ap.'select'] = $preprd; // which is either 'archive_select' or 'select'
		
		return $preprd;
	}
	
	public function sqlinsert($ap,$t) {
		
		if(static::$prepared[$ap.'insert'] !== 0) return; // this prepared statement already exists

			$questionmarked = 'InseRT inTO '.$ap.$t.' ( '.$this->getInsertFieldsList().' ) VALUES ('.$this->getInsertValuesList('prepare').')';
			$idsb = $this->getInsertValuesList('idsb');
		$preprd = new C_preparedSQL($questionmarked,$idsb);
		static::$prepared[$ap.'insert'] = $preprd; // which is either 'archive_insert' or 'insert'
		
		return $preprd;
	}
	
	public function sqlupdate($ap,$t) {
		if(static::$prepared[$ap.'update'] !== 0) return; // this prepared statement already exists
		
				$fields = $this->getUpdateFieldsList('prepare');
			$questionmarked =  'update '.$ap.$t.' set '.$fields.' where id = ?;'; // note that arriving parameters must have an ending id value, see (*db01*)
			$idsb = $this->getUpdateFieldsList('idsb');
		$preprd = new C_preparedSQL($questionmarked,$idsb);
		
		static::$prepared[$ap.'update'] = $preprd; // which is either 'archive_update' or 'update'
	}
	
	public function sqldelete($ap,$t) {
		
		if(static::$prepared[$ap.'delete'] !== 0) return; // this prepared statement already exists
		
				$questionmarked =  'delete FroM '.$ap.$t.' WheRe id = ?; -- C_dbID::prepared_dSdelete()';
			$preprd = new C_preparedSQL($questionmarked,'i');
		static::$prepared[$ap.'delete'] = $preprd; // which is either 'archive_delete' or 'delete'
		return $preprd;
	}
	
	//////////////////////////
	
    public function save($groupId = false, $forceInsertOnId = false) {
		
		$debugecho = 0;
        if($groupId) $this->groupId = $groupId+0; // a new groupId was specified (usefull for linking new objects to their hierarchy)
		
		$t = $this->getTableName(); // obtain from child instance
        $here = $this->getClassName().'::C_dbID::save()';
		
		
		
		if($debugecho) {
			$cn = $this->getClassName();
			echo '  '.$cn.'::C_dbID::save(groupId = '.$groupId.')'.chr(10);
			echo '       $this->groupId = '.$this->groupId.chr(10);
			echo '       $this->id = '.$this->id.chr(10);
		}
		
        $archived_prefix = ''; $archive = false;
        if(property_exists($this,'archived')) // (*dbio01*) check if this class has an archive table
            if($this->archived == 1) {
                $archived_prefix = 'archive_';
                $archive = true;
            }
		
		if($forceInsertOnId) {
			// PVH 2025 : was set up to recover one dS_resource and all metas ( attendees, performances, ...) after that resource was deleted from production by mistake... (Keevin)
			// This feature is use by /utilities/spoofies/2025_spoofy_recoverOneDeletedResource.php
			
			C_dbIO::q('INSERT IGNORE INTO '.$archived_prefix.$t.' ( id,'.$this->getInsertFieldsList().' ) VALUES ("'.$this->id.'",'.$this->getInsertValuesList().')',$here);
			
			return $this;
		}
		
		// see if our child has prepared his MySQL statements
		$ispreparable = isset(static::$prepared); // to make a class work with prepare(), this class must host such a public static $prepared = array()
		
		if($ispreparable) {
			if($this->id <= 0) // $id <= 0 is an insert
				$this->sqlinsert($archived_prefix, $t);
			else $this->sqlupdate($archived_prefix, $t);
		}

        if($this->id <= 0) { // New item
		
			if($ispreparable) if(!isset(static::$prepared['insert'])) $ispreparable = false;
			
			if($ispreparable) {
				// echo 'Executing prepared insert statement<br/>'.chr(10);
				$preparedSQL = static::$prepared[$archived_prefix.'insert']; // auto-selects from 
					$args  = array_merge([$preparedSQL->idsb], $this->getInsertValuesList('raw'));
				$preparedSQL->execute($args);
				$this->id = $newId = C_dbIO::iid();
				
				if($debugecho) echo '       $preparedSQL = [INSERT] NEW id = '.$newId.chr(10);
				
			} else {
				C_dbIO::q('INSERT INTO '.$t.' ( '.$this->getInsertFieldsList().' ) VALUES ('.$this->getInsertValuesList().')',$here);
				$this->id = $newId = C_dbIO::iid();
			}
            
        }
        else { // Update of existing item, if archived, it goes back to archive table ( archived_prefix )
			
			if($ispreparable) if(!isset(static::$prepared['update'])) $ispreparable = false;
			
			if($ispreparable) {
				// echo 'Executing prepared update statement<br/>'.chr(10);
				$preparedSQL = static::$prepared[ $archived_prefix.'update']; // auto-selects from 
					$args  = array_merge([$preparedSQL->idsb.'i'], $this->getUpdateFieldsList('raw', $groupId),[&$this->id]);  // see (*db01*) about trailing $id value
				$preparedSQL->execute($args);
				
				if($debugecho) echo '       $preparedSQL = [UPDATE] id = '.$this->id.chr(10);
				
			} else {
				$fields = $this->getUpdateFieldsList();
				if($groupId) // explicit change of groupId
					$fields = 'groupId='.$groupId.','.$fields;
				C_dbIO::q('update '.$archived_prefix.$this->getTableName().' set '.$fields.' where id ='.$this->id.';',$here);
			}
		}
		if($debugecho) echo '       .'.chr(10);
        return $this;
    }
    public function dSsave($groupId = false) {
        return $this->save($groupId);
    }
    public function dSdelete() { // deletes one objects from DB in this instance, virtual or replica
		
		$t = $this->getTableName(); // obtain from child instance (never comes with archive_ prefix)
		$ispreparable = isset(static::$prepared);
		if($ispreparable) if(!isset(static::$prepared['delete'])) $ispreparable = false; // must be explicitely declared, = 0 is ok
		$isarchivable = property_exists($this,'archived');
	
		$debugecho = 0;
		if($debugecho) {
			$cn = $this->getClassName();
			echo '  '.$cn.'::C_dbID::dSdelete()'.chr(10);
			echo '       $this->groupId = '.$this->groupId.chr(10);
			echo '       $this->id = '.$this->id.chr(10);
		}
		
		// see if our child has prepared his MySQL statements
		if($ispreparable) {
			$this->sqldelete('',$t);
			if($isarchivable) $this->sqldelete('archive_',$t);
		}	
	
		if($ispreparable) {
			// echo 'Executing prepared select statement<br/>'.chr(10);
			
			$preparedSQL = static::$prepared['delete'];
			$stmt = $preparedSQL->mysqlprepared;
			$stmt->bind_param('i', $this->id);
			$stmt->execute();
			// $hit = C_dbIO::hit();
			$hit = $stmt->affected_rows;
			// $stmt->close(); // Do not close, or you loose the prepared statement in its entirety
			
			if($debugecho) echo 'Executed prepared DELETE, '.$hit.' items deleted.'.'</br>'.chr(10);
			
			if($isarchivable) {
				$preparedSQL = static::$prepared['archive_delete'];
				$stmt = $preparedSQL->mysqlprepared;
				$stmt->bind_param('i', $this->id);
				$stmt->execute();
				$hit = $stmt->affected_rows;
				// $stmt->close();  // Do not close, or you loose the prepared statement in its entirety
			}
			
			
		} else {
			C_dbIO::q('DELete FRom '.$t.' WHERE id = '.$this->id.'; -- C_dbID::dSdelete()', 'C_dbID::dSdelete()');
			if(property_exists($this,'archived')) // we just make sure it is deleted everywhere
				C_dbIO::q('DELete FRom archive_'.$t.' WHERE id = '.$this->id.'; -- C_dbID::dSdelete()', 'C_dbID::dSdelete()');
		}
			
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
		
            foreach($includeOnly as $member) { // members "à la carte"
				
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
	public function jason($tracking = false, $sep = '|', $includeOnly = false) { // if tracking is true, access log members are streamed along
        $fields = array();
        $csv = $sep==';'; // csv format is assumed when separator is ";"
        $ml = static::$multilines; // multi lines allowed fields list
		
		// THIS IS WHERE YOU WANT YOUR CODE ACT FAST !!
		// 
		// Here streams ALL the data to any kind of client

		$fields = new stdClass();
		
        if($includeOnly) { // stream only selected members
			foreach($includeOnly as $member) { // members "à la carte"
                $v = $this->{$member};
                $fields->{$member} = $v;
            }
            $j = json_encode($fields);
            return $j;

        } else { // streams all objects members
		
			$fields->{'id'} = $this->id; $fields->{'groupId'} = $this->groupId;
			if($tracking) {
                foreach(C_dbIO::$accesslog as $alm => $v) { // multiple inheritance stages do mix the members order list, we need to re-shape this before streaming
                    if(isset($this->{$alm})) $fields->{$alm} = $this->{$alm};
                }
			}
			foreach(static::$defaults as $member => $dfv) {
				
                $v = $this->{$member};
                $fields->{$member} = $v;
            }
            $j = json_encode($fields);
			return $j;
        }
    }
    public function stream1($wt = false, $bank = false) { // comes with class name header
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


    public function idDropStringRef($field, $id) { // applies to fields where reference ids are stringed like '4589!5462!6589!1212' or '!4589!5462!6589!1212!', note the heading and trailing '!'

        // id is e.g. 5462 this function changes the field into '4589!6589!1212', so it drops the reference $id from it
        $string = $this->{$field};
        if($string=='-' || $string=='') return; // nothing to change
		
		$ep = ''; if($string[0]=='!') { $ep = '!'; $sl = strlen($string); $string = substr($string,1,$sl-2); } // strips heading and leading exclams
        $split = explode('!', $string); 
        if(in_array($id, $split)) { 
            foreach($split as $x => $item) if($id == $item) break; // localize the to be dropped
            array_splice($split, $x, 1); // drop it
            $string = implode('!',$split); // rebuild the !string
        }
		if($string) if($ep) $string = $ep.$string.$ep; // rebuilds heading and trailing exclams, if they were initially present
		
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
			'id' 			=> 'numeric unique identifier in the scope of this class instances',
			'groupId' 		=> 'parent instance id',
			
			'changerId' 	=> 'login id of the last changer of this instance. if zero, the instance was never modified.',
			'changer' 		=> 'login name at the change time of this instance',
			'changed' 		=> 'time at last change on this instance',
			
			'creatorId' 	=> 'login id of the creator of this instance',
			'creator' 		=> 'login name at the creation time of this instance',
			'created' 		=> 'time at creation of this instance',
			
			'deletorId' 	=> 'login id of the last deletor of this instance. if zero, the instance was never deleted.',
			'deleted' 		=> 'time at deletion of this instance'
		);
		if(!isset($explained[$f])) return 'no description for '.$f; else return $explained[$f];
	}
	public function explain($f) { if(!isset(static::$explained[$f])) return self::trackexplained($f); else return static::$explained[$f]; }	
	public function AIinstruction() { 
		if(!isset(static::$AIinstructions)) return Array();
		return static::$AIinstructions;
	}	
	public function AIhumanpriceformat($p) { // arrives as cents, like 14999, returns as 149€99 human readable format
		$c = $p%100; // like 99
		$i = (int)($p/100); // like 149
		$a = $i.'€'.($c?$c:''); // if zero cents do not display cents
		return $p?$a:''; // if zero, returns an empty string
	}

}


function wherelike($field, $keyword) { // provide a case insensitive match on the field
    // if many words must match, use + in the keyword: e.g "never+son" will match "I never talked to your son".

		$spaceinsensitive = 'REPLACE('.$field.'," ","")';
    $minusinsensitive = 'REPLACE('.$spaceinsensitive.',"-","")';

		$ignorespaces = 'REPLACE("%'.$keyword.'%"," ","")';
    $matchmanywords = 'REPLACE('.$ignorespaces.',"+","%")';
    
	$caseinsensitive = '( UPPER('.$minusinsensitive.') LIKE UPPER('.$matchmanywords.') )';

    return $caseinsensitive;
}

// input type for the following filterfor() function, see (*mf01*)

define('INPUT_ML_TEXT'	, 100); // *AREA are multiline fields, see (*mf01*)
define('INPUT_ML_SMS' 	, 101);
define('INPUT_ML_MAIL' 	, 102);
define('INPUT_ML_HTML' 	, 104);
define('INPUT_ML_CSS' 	, 105);

define('INPUT_AC' 		, 126); // auto complete
define('INPUT_NAMES' 	, 199);
define('INPUT_TEXT' 	, 127);
define('INPUT_NUMER' 	, 128);
define('INPUT_EMAIL' 	, 129);
define('INPUT_MOBILE' 	, 130);
define('INPUT_ALPHA' 	, 131); 

define('INPUT_PASSWD' 	, 132);
define('INPUT_KEYS' 	, 198);
define('INPUT_LOGIN' 	, 133);

define('INPUT_PHONE' 	, 134);
define('INPUT_PRICE' 	, 135);
define('INPUT_TOKEN' 	, 136);
define('INPUT_BDATE' 	, 137);
define('INPUT_TEXT_WE' 	, 138);   // with authorized emoji's
define('INPUT_URL' 		, 139);

define('INPUT_IBAN'		, 140);
define('INPUT_BIC' 		, 141);

define('INPUT_MANDATORY' 	, 250);
define('INPUT_OPTIONAL' 	, 251);

function filterfor($inputtype) { // provides a filter for allowed chars depending on field type.
		
	// please refer to 
	// https://stackoverflow.com/questions/20690499/concrete-javascript-regular-expression-for-accented-characters-diacritics
	//
	// The easier way to accept all accents is this:
	//
	// [A-zÀ-ú] // accepts lowercase and uppercase characters
	// [A-zÀ-ÿ] // as above, but including letters with an umlaut (includes [ ] ^ \ × ÷)
	// [A-Za-zÀ-ÿ] // as above but not including [ ] ^ \
	// [A-Za-zÀ-ÖØ-öø-ÿ] // as above, but not including [ ] ^ \ × ÷
	//
	
	$f = '';
	
	$language = ' a-zA-ZÀ-ÖØ-öø-ÿ0-9-'; // which is equivalent to ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÐŒœŠšŸŽž
	$currency = '\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6'; // currency symbols
	$extpoints = '\+\'\/\?\&=,.,\!\:\;\*(){}%$@';
	$cr = '\\r\\n'; // '\-\+\'\/\?\&=,.,\!\:\;\*#(){}%';
	// $emoji = '\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff]';
	$emoji = '\p{Extended_Pictographic}'; // https://javascript.info/regexp-unicode
	switch($inputtype) { // keep this inline with (*re01*), but keep in mind that they might differ
	
		case INPUT_MOBILE: 			
		case INPUT_PHONE: 	$f = '0-9+'; 	break;
		case INPUT_NUMER: 	$f = '0-9'; 		break;
		case INPUT_BDATE:	$f = '0-9-'; 	break;
		
		case INPUT_EMAIL: 	$f = '._a-zA-Z0-9-@'; break; // email address (not the content!)
		
		case INPUT_PRICE: 	$f = '.0-9-'+$cr; 	break;
		case INPUT_IBAN: 	$f = ' a-zA-Z0-9'; 	break;
		case INPUT_BIC: 	$f = 'a-zA-Z0-9'; 	break;
		
		case INPUT_ALPHA: 	$f = '\-\'_a-zA-Z0-9çéèëêôîïû@,. '; 	break;
		
		case INPUT_KEYS:
		case INPUT_PASSWD:
		case INPUT_LOGIN: 	$f = $language+$extpoints+'_\\[\\]\~`'; 	break; // double escape for [] in RegExps
		
		case INPUT_TOKEN: 	$f = 'a-z0-9';				break;
		case INPUT_URL: 	$f = '.éèa-zA-Z0-9-\:\/\?\&='; break;
		case INPUT_AC: 		$f = $language+extpoints;	break; // default value for Auto-Complete input field
					
		case INPUT_TEXT: // single line text, with extended points set, parentheses
				$f = $language+extpoints+emoji+currency; break;
				
		case INPUT_TEXT_WE: // _WE stands for With Emoji's
		case INPUT_ML_TEXT: // multi line notes 
				$f = $language+$extpoints+$emoji+$currency; break;
				
		case INPUT_NAMES: // single line text, i.e. firstname, lastname, address, city, country, residence, ...
				$f = $language+'().,\?\&\'\/'; break; // O'connor-Mary (Peter's Son?)

		case INPUT_ML_CSS:  $f = $cr+' _a-zA-Z0-9-@'+'.,\'\!\/\:\;\*#<>(){}%'; 	break; // note that Multi Line fields must accept carriage return 
				
				
			// Here under basically you accept anything BUT the forbidden chars ( see this.disallowed() )
		case INPUT_ML_HTML:  
		case INPUT_ML_MAIL: // allows emoji's because we don't apply any filter here
		case INPUT_ML_SMS: 
		
		default:
			$f = false; break;
	}	
	return $f; // see also this.disallowed() that flushes disallowed characters
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
        parent::dSsave($groupId);
		return $this;
		
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

define('with_tracking', true); // those are used by the ->stream() function
define('no_tracking', false);
define('no_bank', false);
define('no_alias', false);

define('undefined_groupId', false);
define('keep_groupId', false);

define('no_record', true); // when saving items for like technical cleanup, you don't want to update the tracking records of the items. e.g. (*cc01*)


abstract class C_dbTrackingCD_utc extends C_dbID {  // Creation and Delete tracking (UTC version not using alphanum timestamps but Unix EPOCH)

    public $created; // your DB table structure MUST have bigint(20) created field
	public $creator;
	public $creatorId;
	
    public $deleted; // your DB table structure MUST have bigint(20) deleted field
	public $deletor;
	public $deletorId;

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
            $this->created = parent::tracknow($utc=true);
            $this->creator = C_dbIO::$loggedName;
            $this->creatorId = C_dbIO::$loggedId;
            $this->deleted = 0; // January 1, 1970 (UTC) according to UNIX EPOCH
            $this->deletor = '';
            $this->deletorId = 0;
        } else {
			// do nothing now
        }
        return parent::dSsave($groupId);
    }   
	public function dSobsolete() { // indicated as removed but still present and tracked in DB
        $this->deleted = parent::tracknow($utc=true);
        $this->deletor = C_dbIO::$loggedName;
        $this->deletorId = C_dbIO::$loggedId;
        return parent::dSsave();
    }
    public function dSdelete() { // technically and forever removed from DB
        return parent::dSdelete();
    }
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    S Y N C H R O
//

abstract class C_dbSynchro extends C_dbID { // group to an account id

    public $skeyId; 	// links with the login 
    public $localId;	// id in mobminder DB
    public $remoteId;	// id in remote program

    abstract function getClassName();
    abstract function getTableName();
    abstract function getDefaults();

    public function __construct($id=0, $groupId=false, $preset=false) { 
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }

    public function dSsave($groupId = false) {
        return parent::dSsave($groupId);
    }
    public function dSdelete() { // technically and forever removed from DB
        return parent::dSdelete();
    }
}

class C_dS_synchro_reservation  extends C_dbSynchro { // group to an account id

    public function getTableName() { return  'synchro_reservations'; }
    public function getClassName() { return get_class(); }
    public function getDefaults() { return self::$defaults; }

    public function __construct($id=0, $groupId=false, $preset=false) {
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public static $multilines = false;
    public static $defaults = array( 	
        'skeyId' 	=> 0,
        'localId' 	=> 0,
        'remoteId' 	=> 0
    );
}
class C_dS_synchro_visitor  extends C_dbSynchro { // group to an account id

    public function getTableName() { return  'synchro_visitors'; }
    public function getClassName() { return get_class(); }
    public function getDefaults() { return self::$defaults; }

    public function __construct($id=0, $groupId=false, $preset=false) {
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public static $multilines = false;
    public static $defaults = array( 	
        'skeyId' 	=> 0,
        'localId' 	=> 0,
        'remoteId' 	=> 0
    );
}
class C_dS_synchro_resource  extends C_dbSynchro { // group to an account id

    public function getTableName() { return  'synchro_resources'; }
    public function getClassName() { return get_class(); }
    public function getDefaults() { return self::$defaults; }

    public function __construct($id=0, $groupId=false, $preset=false) {
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public static $multilines = false;
    public static $defaults = array( 	
        'skeyId' 	=> 0,
        'localId' 	=> 0,
        'remoteId' 	=> 0
    );
}
class C_dS_synchro_ccss  extends C_dbSynchro { // group to an account id

    public function getTableName() { return  'synchro_ccss'; }
    public function getClassName() { return get_class(); }
    public function getDefaults() { return self::$defaults; }

    public function __construct($id=0, $groupId=false, $preset=false) {
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }
    public static $multilines = false;
    public static $defaults = array( 	
        'skeyId' 	=> 0,
        'localId' 	=> 0,
        'remoteId' 	=> 0
    );
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    G L O B A L     S Y S T E M    S E T T I N G 
//
class C_dS_system extends C_dbID {
    public function getTableName() { return  'globals'; }
    public function getClassName() { return get_class(); }
    public function __construct() { parent::__construct(1); }
    public $baseline; // this field must be incremented each time the DB structure is adapted. It will force all client to reload the js code, see (*bl01*)
    public $backupPivot;
    public $youngestHourlyRun;
    public $youngestTensRun;
    public $youngestStats;
    public $sendComm;
	
    public $SMSproviderInter;
    public $SMSproviderBeNtf;
    public $SMSproviderFrNtf;
	
    public $is_SoftPay_alive;
    public $is_HardPay_alive;
    public $is_Payconiq_alive;
    public $is_eCommerce_alive;
	
    public $is_SoftPay_reported;
    public $is_HardPay_reported;
    public $is_Payconiq_reported;
    public $is_eCommerce_reported;
	
    public $fcm_oauth_token;
	
	public static $provider_threshold = 0; // when this threashold is reached, we signal system administrators that the corresponding provider is offline, see (*sys01*)
    public static $multilines = false;
    public static $defaults = array( 
        'baseline' 			=> 0,
        'backupPivot' 		=> 0,
        'youngestHourlyRun' => 0,
        'youngestTensRun' 	=> 0,
        'youngestStats' 	=> 0,
        'sendComm' 			=> 0,
		
        'SMSproviderInter' 	=> '',
        'SMSproviderBeNtf' 	=> '',
        'SMSproviderFrNtf' 	=> '',
		
        'is_SoftPay_alive' 		=> 0, // provider monitoring (increments by 1 each time a call to the provider does fail), see (*sys01*)
        'is_HardPay_alive' 		=> 0, // see crons 
        'is_Payconiq_alive' 	=> 0, // 
        'is_eCommerce_alive' 	=> 0,  // we currently have no way to test it,
		
        'is_SoftPay_reported' 	=> 0, // see (*sys01*), when the is_SoftPay_alive goes above threashold, an sms is sent to the system administrator
        'is_HardPay_reported' 	=> 0, // 
        'is_Payconiq_reported' 	=> 0, // 
        'is_eCommerce_reported' 	=> 0,  // 
		
        'fcm_oauth_token' => ''
    );
    public function setHourlyRun($stamp) {
        $this->youngestHourlyRun = $stamp;
        new Q('UPDATE globals SET youngestHourlyRun = '.$stamp.' WHERE id=1;','C_dS_system::setHourlyRun()');
    }
    public function setTensRun($stamp) {
        $this->youngestTensRun = $stamp;
        new Q('UPDATE globals SET youngestTensRun = '.$stamp.' WHERE id=1;','C_dS_system::setHourlyRun()');
    }
    public static function backupPivotStamp() {
        $q = new Q('SELECT backupPivot FROM globals WHERE id=1');
        return $q->one('backupPivot');
    }
    public function dSsave($groupId = false) {
        return parent::dSsave(false);
    }
    public function dSdelete() {
        return parent::dSdelete();
    }
    public static function baseline($set=false) {
        if($set) return new Q('UPDATE globals SET baseline = "'.$set.'" WHERE id=1');
        $q = new Q($SQL = 'SELECT baseline FROM globals WHERE id=1');
        return $q->one('baseline');
    }	
	public static function providerfault($which) { // report a faulty connection to the provider's server
		
		$fieldname = '';
		switch($which) {
			case 'SoftPay': 	$fieldname = 'is_SoftPay_alive';	break; // provider monitoring (increments by 1 each time a call to the provider does fail)
			case 'HardPay': 	$fieldname = 'is_HardPay_alive';	break; // see crons 
			case 'Payconiq': 	$fieldname = 'is_Payconiq_alive';	break; // 
			case 'eCommerce': 	$fieldname = 'is_eCommerce_alive';	break;  //
			default:
				return false;
		}
		
        $q = new Q('UpdATE globals set '.$fieldname.' = '.$fieldname.'+1;');
        return true;
    }
	public static function provideralive($which) { // report back to live on provider's server
			
		$fieldname = '';
		$fieldnamereported='';
		switch($which) {
			case 'SoftPay': 	$fieldname = 'is_SoftPay_alive';    $fieldnamereported='is_SoftPay_reported';	break; // provider monitoring (increments by 1 each time a call to the provider does fail)
			case 'HardPay': 	$fieldname = 'is_HardPay_alive';	$fieldnamereported='is_HardPay_reported';  break; // see crons 
			case 'Payconiq': 	$fieldname = 'is_Payconiq_alive';	$fieldnamereported='is_Payconiq_reported'; break; // 
			case 'eCommerce': 	$fieldname = 'is_eCommerce_alive';	$fieldnamereported='is_eCommerce_reported';break;  //
			default:
				return false;
		}
		
		$q = new Q('UpdATE globals set '.$fieldname.' = 0, '.$fieldnamereported.' = 0;');
		return true;
	}
	public static function providerreported($which) { // report back to live on provider's server
			
		$fieldnamereported='';
		switch($which) {
			case 'SoftPay': 	$fieldnamereported='is_SoftPay_reported';	break; // provider monitoring (increments by 1 each time a call to the provider does fail)
			case 'HardPay': 	$fieldnamereported='is_HardPay_reported';   break; // see crons 
			case 'Payconiq': 	$fieldnamereported='is_Payconiq_reported';  break; // 
			case 'eCommerce': 	$fieldnamereported='is_eCommerce_reported'; break;  //
			default:
				return false;
		}
		
		$q = new Q('UpdATE globals set '.$fieldnamereported.' = 1;');
		return true;
	}
	
	public static function checkCredits($testmode) {
			
		// when in test mode, you can trigger/run this script by setting todaySMSremains or todayEMLremains to zero just before running the cron
			
			
		$q = new Q('select id from groups where todaySMSremains = 0;'); // see (*cr10*)
		$aids = $q->ids(list_as_array);
		if(count($aids)) {
			$replyto = 'alert@mobminder.com';
			$recipient = 'pascal@mobminder.com, dev@mobminder.com';
			$emailgateaway = new C_b64_email($replyto, '', '');
			
			foreach($aids as $aid) {
				$q = new Q('update groups set todaySMSremains = -1 where id = '.$aid.';'); // the value -1 indicates that the alert is reported by email
				$dSaccount = new C_dS_group($aid); $aname = $dSaccount->name;
				$subject = 'Violation of SMS credit: ('.$aname.')';
					$msg = $aname.' ('.$aid.') is in violation of SMS credit.';
				$html = '<center><div>'.$msg.'</div></center>';
				if(!$testmode) $emailgateaway->sendMail($recipient, 0, $replyto, $subject, $html);
				else {
					echo '<h2>'.$msg.'</h2>'; // testmode display
				}
			}
		}
		
		$q = new Q('select id from groups where todayEMLremains = 0;'); // see (*cr10*)
		$aids = $q->ids(list_as_array);
		if(count($aids)) {
			$replyto = 'alert@mobminder.com';
			$recipient = 'pascal@mobminder.com, dev@mobminder.com';
			$emailgateaway = new C_b64_email($replyto);
			
			foreach($aids as $aid) {
				$q = new Q('update groups set todayEMLremains = -1 where id = '.$aid.';'); // the value -1 indicates that the alert is reported by email
				$dSaccount = new C_dS_group($aid); $aname = $dSaccount->name;
				$subject = 'Violation of EMAILS credit: ('.$aname.')';
					$msg = $aname.' ('.$aid.') is in violation of EMAILS credit.';
				$html = '<center><div>'.$msg.'</div></center>';
				if(!$testmode) $emailgateaway->sendMail($recipient, 0, $replyto, $subject, $html);
				else {
					echo '<h2>'.$msg.'</h2>'; // testmode display
				}
			}
		}
		
	}
	
    public static function setFcmOauthToken($fcmoauttoken) {
        new Q('UPDATE globals SET fcm_oauth_token = "'.$fcmoauttoken.'" WHERE id=1;','C_dS_system::setFcmOauthToken()');
    }
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    L O G I N S   &   A C C E S S   K E Y S  
//

define('aLevel_synchro' 	, 3);  // equivalent js, see (*av01*)
define('aLevel_eresa' 		, 4);
define('aLevel_operator' 	, 5);
define('aLevel_supervisor' 	, 6);
define('aLevel_manager'		, 7); // see (*av02*)
define('aLevel_seller'		, 8); // have plus option in plus lists, may not create tasks
define('aLevel_admin'		, 9); 

define('aLevels_humans'		, aLevel_operator.','.aLevel_supervisor.','.aLevel_manager.','.aLevel_seller.','.aLevel_admin);


class C_dS_login extends C_dbTrackingCCD {	// grouped by sellerId, if you extend/modify this class, check the C_dS_login_min version
    public function getTableName() { return  'logins'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $accessLevel; // range, see (*av01*)
    public $permissions;
    public $login;	
    public $password;	
    public $taycan;	 // = base64_encode(gzcompress($l.$p, 4)); used for indexing the logins table, fast find back + sqli protection
    public $GMT;
    public $weeknumb;
    public $lastLogin;
    public $gender;
    public $firstname;
    public $lastname;	
    public $company;
    public $residence;
    public $address;
    public $zipCode;	
    public $city;	
    public $country;
    public $email;	
    public $mobile; 
    public $phone; 
    public $language; 
    public $profession;
    public $note;
    public $color;  // css color number, used on the chat thread as eyecatcher background color for the login identifier bubble
    public $tag;  // 
	
    public $notbyme;  // relates to watchovers features, notifications are not triggered by this logins own actions on selected watchovers when notbyme is 1
    public $secretarypopups;  // tells if this login should get pop-up messages from workcode selection, see (*pu11*)

		public $eresaIdentMode; 	// 0: unique email based, 1: family sharing
		public $eresaFillingMode; 	// 98:classroom filling (slots stays online available until completly filled) or 99:private appointment version (which was the first developped version)
    public $seoIndexable; 	// 0 or 1, defaults to 1, set to 0 if the webpage should not be indexed by robots
	public $seoMetaTitle; 	//
	public $seoMetaDescr; 	//
	public $seoMetaCanon; 	//
	public $seoComment; 	// account manager leaves a free comment here ( not visible for clients )
	
	public $eresaTitle; 	// uses e-reservation on url postfix as specified in this field
    public $eresaUrl; 		// varchar(64) see(*qt01*), postfix url ( comes into agenda.mobminder.com/postfixurl that leads to the web reservation page )
    public $eresaMax; 		// allows a maximum of eresaMax future reservations
    public $eresaLimit; 	// number of reservation options returned by the search engine
    public $eresaBefore; 	// defines where in the future will start the search
    public $eresaWithAMPM; 	// defines is the AMPM control appears on the web page
    public $eresaSameday; 	// defines where in the future will start the search when in the same day (is a number of hours)
    public $eresaAllowNote; // 0 or 1 tells if the surfer can write a note before confirming his appointment
    public $eresaSignin; 	// allows online sign in
    public $eresaCancel; 	// allows deletion of appointment, a maximum of eresaDelete days in advance
    public $eresaAggregate; // searching agenda brings options that only aggregate appointments (is a bitmap 0 or 1 | 2)
    public $eresaRescType; 	// defines what resource types are options to the surfer (is a bitmap 0 or bCal | uCal | fCal)
    public $eresaSkin; 		// web page decoration
    public $eresaNote; 		// web page informational message
    public $eresaHourlies; 	// web page information about opening hours
    public $eresaDirections; // web page information about getting directions
    public $eresaDirLabel; 	// label of the link to a maps location site
    public $eresaDirUrl; 	// link to a maps location site
    public $eresaWorkcodes; // workcodes that are visible to this web access (text format like 4568!4897!4562 when empty, this eresa access sees all e-Worcodes)
    public $eresaLink1label; // 
    public $eresaLink1url; 	 // 
    public $eresaLink2label; // 
    public $eresaLink2url; 	 // 
    public $eresaPalette; 	// 
    public $eresaFontTitle; // 
    public $eresaFontText; 	//  
    public $eresaCcss; 	//  
    public $eresaAuthent; 	// No authentication required in this mode
    public $eresaBlacklist; // visitor color code that will be rejected by the online booking process

    public $syncwhat; 		// 
    public $syncTrescs; 	// sync time stamp for resources
    public $syncTvisis; 	// sync time stamp for visitors
    public $syncTresas; 	// sync time stamp for reservations
	
	public $soundsVolume; 	// user setting for event sounds scheme
	
	public $locked; // this login is banned or temporarily disabled (tiny int 1, unsigned)
	public $decision; // this login is a decision maker in the business that represents this account
	public $aienabled; // this login has access to the AI assistant

    public static $multilines = array( 	// we identify here the fields that might contain CR LR chars
        'taycan' => 1, 'note' => 1, 'eresaNote' => 1, 'eresaHourlies' => 1, 'eresaDirections' => 1, 'eresaCcss' => 1, 'seoComment' => 1
	);
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'accessLevel' 	=> aLevel_manager,
        'permissions' 	=> 2130787837, // corresponds to manager standard permissions 2130787837
        'login' 		=> '',
        'password' 		=> '',
        'taycan' 		=> '', 	// = base64_encode(gzcompress($l.$p, 4)); used for indexing the logins table, fast find back and sqli protection
        'GMT' 			=> 3600,
        'weeknumb' 		=> 0,	// defines if week numbers ( 1 to 52 ) are displayed on the screen
        'lastLogin' 	=> '2007-11-17 15:15:15',
        'gender' 		=> gender_code_male,
        'firstname' 	=> '',
        'lastname' 		=> '',	
        'company' 		=> '',
        'residence' 	=> '',
        'address' 		=> '',
        'zipCode' 		=> '',
        'city' 			=> '',
        'country' 		=> '',
        'email' 		=> '',	
        'mobile' 		=> '', 
        'phone' 		=> '',
        'language' 		=> 0,   
        'profession' 	=> 808, // manager
        'note' 			=> '',
        'color' 		=> 0, // css color number, used on the chat thread as eyecatcher background color for the login identifier bubble
        'tag' 			=> 0, 
			'notbyme' 			=> 1, // relates to watchovers features, notifications are not triggered by this logins own actions on selected watchovers when notbyme is 1
			'secretarypopups' 	=> 0, // indicating this login as elligible for secretary pop-ups (e.g. when a workcode is selected)
        
			'eresaIdentMode' => 0, // unique email based, family sharing
			'eresaFillingMode' => 99, 	// 98:classroom filling (slots stays online available until completly filled) or 99:private appointment version (which was the first developped version)
    'seoIndexable' => '', 	// 0 or 1, defaults to 1, set to 0 if the webpage should not be indexed by robots
	'seoMetaTitle' => '', 	//
	'seoMetaDescr' => '', 	//
	'seoMetaCanon' => '', 	//
	'seoComment' => '', 	// account manager leaves a free comment here ( not visible for clients )

		'eresaTitle' 	=> '',
        'eresaUrl' 		=> '',
        'eresaMax' 		=> 0,
        'eresaLimit' 	=> 0, 	// number of results for the search engine
        'eresaBefore' 	=> 9472539, 
        'eresaWithAMPM' => 1, 	// indicates if AMPM control should appear on the web page
        'eresaSameday' 	=> 1, 	// a number of hours screening current time when reservation is allowed in the same day
        'eresaAllowNote'=> 0, 	// binary, the visitor can leave a note at confirmation
        'eresaSignin' 	=> 1, 
        'eresaCancel' 	=> 1,
        'eresaAggregate'=> 0, 	// searching the agenda brings only availabilities taht are subsequent or preceding other reservations
        'eresaRescType' => 0,
        'eresaSkin' 	=> '',
        'eresaNote' 	=> '', 	// displayed at confirmation step
        'eresaHourlies' => '',
        'eresaDirections'=> '',
        'eresaDirLabel' => '',
        'eresaDirUrl' 	=> '',
        'eresaWorkcodes' => '', // only some workcodes apply on this page
        'eresaLink1label'=> '',
        'eresaLink1url' => '',
        'eresaLink2label'=> '',
        'eresaLink2url' => '',
        'eresaPalette' 	=> '',
        'eresaFontTitle'=> '',
        'eresaFontText' => '',
        'eresaCcss' 	=> '',
        'eresaAuthent' 	=> 0,
        'eresaBlacklist'=> 0, 	// customCss id (visitor color on black list)
        'syncwhat' 		=> 0,
        'syncTrescs' 	=> 0,
        'syncTvisis' 	=> 0,
        'syncTresas' 	=> 0,
		
        'soundsVolume' 	=> 8,
		
        'locked' 		=> 0,
		
        'decision' 		=> 0,
        'aienabled' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function setsynctime($which, $utime = false) {
        if(!$utime) $utime = time()+1; 
        switch($which) {
            case 'resa': $this->syncTresas = $utime; break;
            case 'visi': $this->syncTvisis = $utime; break;
            case 'resc': $this->syncTrescs = $utime; break;
        }
        $this->dSsave();
    }
    public function dropWorkcodeId($wrkcdid) { // workcodes linked to e-reservation login
        $this->idDropStringRef('eresaWorkcodes',$wrkcdid);
    }
    
    public function getName() { return $this->lastname; }
    public function getFullName() { return $this->firstname.' '.$this->lastname; }	
	
    public function dSsave($groupId = false) {
		if($this->accessLevel <> aLevel_eresa) // web pages they do not have a login and a password
			$this->taycan = base64_encode(gzcompress($this->login.$this->password, 4)); // see (*lp01*)
        return parent::dSsave($groupId);
    }
	public static function logon($login, $pass) { // returns false if bad login/pass combination was passed, returns dS_login instead
        if(!$login) return false;
        if(!$pass) return false;
			$z = base64_encode(gzcompress($login.$pass, 4)); // see (*lp01*)
		$q = new Q('SELECT id FROM logins WHERE taycan="'.$z.'" and locked = 0 limit 1;'); // taycan is a combination of login and password
		$lid = $q->ids(); 
        if(!$lid) return false;
		$dS_login = new C_dS_login($lid);
		if($dS_login->login!=$login) return false; // that additional test is necessary because tayvan tests the concatenation of $login.$pass such that log.inpass would successfully pass
        
		new Q('update logins set lastLogin = NOW() where id = '.$lid.';'); // 
		return $dS_login;
    }
    public static function checkin($loginId) { // assumes you have session started 

        // Treat the list of currently logged logins from the calling browser
        if(!isset($_SESSION['loggedIn'])) $loggedIn = Array(); // from scratch session
        else if($_SESSION['loggedIn']=='') $loggedIn = Array(); // after a close all action
        else $loggedIn = explode(',', $_SESSION['loggedIn']); // some are logged yet

		$checkinginlogins = Array();
		$checkinginlogins[] = $loginId;
		
		// Special treatment for the main admin
		$q = new Q('select accessLevel from logins where id = '.$loginId.';');
		$al = $q->one('accessLevel');
		if($al==aLevel_admin) {
			// when admin 7875 (PVH) logs on, it logs also a bunch of sellers 
			if($loginId==7875) array_push($checkinginlogins, 8820,9088,7893,7881,13119,22770,8384,7896); // Only PVH admin
		}

        // Add the loginId's to the list of logged in if it was not yet in the list
		foreach($checkinginlogins as $cinlid) {
			$yetin = in_array($cinlid, $loggedIn); 
			if(!$yetin) $loggedIn[] = $cinlid;
		}
        $_SESSION['loggedIn'] = implode(',',$loggedIn);

        new Q('update logins set lastLogin = NOW() where id = '.$loginId.';');
        $_SESSION['loginId'] = $loginId; // the currently active login
    }

	private function xorObfuscate(string $data, string $key): string {
		$out    = '';
		$kLen   = strlen($key);   // key (simple ASCII by preference), in practice we will encode using the logged user accessKey number.
		$dLen   = strlen($data);  // counts the bytes, we operate byte by byte here (not by logical UTF8 multi-byte groups).

		for ($i = 0; $i < $dLen; $i++) {
			// XOR byte to byte
			$out .= $data[$i] ^ $key[$i % $kLen];
		}
		$out = base64_encode($out);

		// on convertit le binaire en Base64 pour transport AJAX
		return $out;
	}
	public function hidecreds() { // when streaming higher accessLevel logins data, we first make them secure.
		
		$this->taycan = 'Ω'; // DB version is never sent, that member is for internal usage ( user login process )
		// following lines define the level of acceptability for weak passwords, that will trigger the pop up of the M_iSECURITY invite to upgrade user's creds
		// (*cr13*)
		if(strlen($this->login)<9) $this->taycan = '';
		if(strlen($this->password)<9) $this->taycan = '';
		
		// following lines hide login/pass so they do not stream down to client side, passes an info about creds format validity
		$passregx = '/^(?=(.*[a-zØ-öø-ÿ]){2})(?=(.*\d){2}).{9,32}$/'; // this should stay aligned with (*cr11*) in mobframe.js, examples of usage are here (*cr14*)
		$lognregx = '/^(?=(.*[a-zØ-öø-ÿ]){2})(?=(.*[A-ZÀ-Ö]){2})(?=(.*\d){2})(?=(.*[\s\[\]\/+\-=\'€?_,.:;(){}!@$%&*]){2}).{9,32}$/'; // note that we authorize the single MSwindows single quote
		
		if(preg_match($lognregx, $this->login)) $this->login = 'ɸ'; else $this->login = ''; // sends an indication of format validity, see (*cr14*)
		if(preg_match($passregx, $this->password)) $this->password = 'Δ'; else $this->password = ''; // sends an indication of format validity

	}
	public function mashcreds($key) { // $key can be any ANSI string, but for the coherence we will use the logged user accesskey.
		
		$this->taycan = 'Σ'; //
		$this->login = $this->xorObfuscate($this->login, $key); // see (*cr50*)
		$this->password = $this->xorObfuscate($this->password, $key);
	}
	
	public static $explained = array( 
        'id' 				=> 'login unique id',	
        'accessLevel' 		=> 'login access level. Range [ 3 = aLevel_synchro, 4 = aLevel_eresa, 5 = aLevel_operator, 6 = aLevel_supervisor, 7 = aLevel_manager, 8 = aLevel_seller]',	
        'GMT' 				=> 'timezone for this login',	
        'weeknumb' 			=> 'this login uses yearly based week numbers, to be displayed on calendars and aside date display.',	
        'company' 			=> 'alphanumeric company name free text',
        'gender' 			=> 'integer value [0:female, 1:male]',
        'firstname' 		=> 'alphanum free field',
        'lastname' 			=> 'alphabetic free field, at least 2 characters',
        'address' 			=> 'alphanum free field',
        'zipCode' 			=> 'alphanum free field',
        'city' 				=> 'alphanum free field',
        'residence' 		=> 'alphanum free field',
        'country' 			=> 'alphanum free field',	
        'email' 			=> 'lowercase alphanumeric field with only @ allowed as special char', 
        'mobile' 			=> 'numeric field with international prefix but no +. Like 32497401626',	
        'phone' 			=> 'numeric field',	
        'language' 			=> 'user language [english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8]',
        'profession' 		=> 'mobminder coded value [range see appendix]',
        'note' 				=> 'alphanum',
        'color' 			=> 'css color number, used on the chat thread as eyecatcher background color for the login identifier bubble',
        'tag' 				=> 'css tag number, used on the chat thread as eyecatcher symbol tag for the login identifier bubble',
        'notbyme' 			=> 'relates to watchovers features, notifications are not triggered by this logins own actions on selected watchovers when notbyme is 1',
        'secretarypopups' 	=> 'indicating this login as elligible for secretary pop-ups (e.g. when a workcode is selected) [0:silent, 1:pops up]',
        'permissions' 		=> 'authorisezed actions and accesses for this login. [range see appendix]',
		
			'eresaIdentMode' => 'Identification mode, based on unique email [0], or family sharing [1]',
			'eresaFillingMode' => 'Classroom filling [98] or casual private appointments [99]',
    'seoIndexable' => '0 or 1, defaults to 1, set to 0 if the webpage should not be indexed by robots',
	'seoMetaTitle' => 'we drop this text in the meta-title field of the web page header',
	'seoMetaDescr' => 'we drop this text in the meta-description field of the web page header',
	'seoMetaCanon' => 'we drop this text in the meta-canonical field of the web page header',
	'seoComment' => 'account manager leaves a free comment here ( not visible for clients )',
			
        'eresaTitle' 		=> 'alphanum',
        'eresaUrl' 			=> 'postfix url ( comes into agenda.mobminder.com/postfixurl that leads to the web reservation page )',
        'eresaMax' 			=> 'maximum number of future appointment(s) that are allowed for a given visitor',
        'eresaLimit' 		=> 'number of results returned by the search engine',
        'eresaBefore' 		=> 'bitfield. Defines the options given to the visitor to start searching availabilities from e.g. 2 weeks from current time, or 2 months from current time.', 	
        'eresaWithAMPM' 	=> 'indicates if AMPM control should appear on the web page', 	
        'eresaSameday' 		=> 'integer value: a number of hours. If set to 2, the search result will return current time +2 hours as first option.', 
        'eresaAllowNote' 	=> 'indicates if free test note control should appear on the web page', 
        'eresaSignin'		=> 'boolean: indicates if new visitors can sign in using web reservation',
        'eresaCancel' 		=> 'boolean: indicates if visitors are allowed to cancel through the web page', 		
        'eresaAggregate' 	=> 'integer value [0,1,2,3]. Availabilities returned are subsequent or ahead existing reservations.', 
        'eresaRescType' 	=> 'bitfield [0,1,2,3], indicates what type of resources can be chosen on the web page. 0 for none.', 
        'eresaWorkcodes' 	=> 'workcodes: id\'s of valid workcode objects, separated by ! (exclam mark)',
        'eresaAuthent' 		=> 'type of authentication foreseen on this web page: [0:no authentication]',
        'eresaBlacklist' 	=> 'custom css id of a valid customcss object. That visitor color is not allowed to book on the web page.',
        
		'soundsVolume' 		=> 'user setting for event sounds scheme.',
        
		'locked' 		=> 'user disallowed. Only account managers have access to this setting in M_LOGIN',
		
        'decision' 		=> 'This login is a decision maker in the business that represents this account.',
        'aienabled' 	=> 'This login has access to the AI assistant.'
    );
    	

}
class C_dS_login_min extends C_dbTrackingCCD {	// a "minimal" simplified login version for chat purpose
    public function getTableName() { return  'logins'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $accessLevel;
    public $GMT;
    public $gender;
    public $firstname;
    public $lastname;	
    public $company;
    public $email;	
    public $mobile; 
    public $phone; 
    public $language; 
    public $profession;
    public $color;  // css color number, used on the chat thread as eyecatcher background color for the login identifier bubble
    public $tag;  // 

    public static $multilines = array();
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'accessLevel' 	=> aLevel_manager,
        'GMT' 			=> 3600,
        'gender' 		=> gender_code_male,
        'firstname' 	=> '',
        'lastname' 		=> '',	
        'company' 		=> '',
        'email' 		=> '',	
        'mobile' 		=> '', 
        'phone' 		=> '',
        'language' 		=> 0,   
        'profession' 	=> 808, // manager
        'color' 		=> 0, // css color number, used on the chat thread as eyecatcher background color for the login identifier bubble
        'tag' 			=> 0
    );
    public function getDefaults() { return self::$defaults; }
	public static $explained = array( 
        'id' 				=> 'unique id in the scope of C_dS_collaborator instances.',	
        'accessLevel' 		=> 'login access level. Range [ 3 = aLevel_synchro, 4 = aLevel_eresa, 5 = aLevel_operator, 6 = aLevel_supervisor, 7 = aLevel_manager, 8 = aLevel_seller].',	
        'GMT' 				=> 'timezone for this login.',	
        'company' 			=> 'alphanumeric company name free text.',
        'gender' 			=> 'gender like [ 0:female, 1:male, 2:sa, 3:sprl, 4:miss, 5:boy, 6:girl, 7:other ]',
        'firstname' 		=> 'collaborator\'s firstname.',
        'lastname' 			=> 'collaborator\'s lastname.',
        'email' 			=> 'collaborator\'s email.', 
        'mobile' 			=> 'collaborator\'s mobile phone number.',	
        'phone' 			=> 'collaborator\'s fix line phone number.',	
        'language' 			=> 'collaborator\'s language [english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8].',
        'profession' 		=> 'mobminder coded value [range see appendix].',
        'color' 			=> 'css color number, used on the chat thread as eyecatcher background color for the login identifier bubble.',
        'tag' 				=> 'css tag number, used on the chat thread as eyecatcher symbol tag for the login identifier bubble.'
    );
}

class C_dS_device extends C_dbTrackingCC {	// a user device, grouping to a login, where the Firebase notification token is stored
    public function getTableName() { return  'devices'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $deviceid; // each time a user logs in, we check if this device is already recorded. If not, it gets created along with token. If existing, we overwrite the token.
    public $appver;
    public $token;
    public $useragent;

    public static $multilines = array();
    public static $defaults = array( 	
        'deviceid' 	=> '',
        'appver' 	=> '',
        'token' 	=> '',
        'useragent' => ''
    );
    public function getDefaults() { return self::$defaults; }
	public static $explained = array( 
        'deviceid' 		=> 'device id, identifies your tablet, phone or computer',	
        'appver' 		=> 'smartapp version',	
        'token' 		=> 'at Firebase side, this is a bundle of device id and destinated application id. If you re-install the application, the token will be renewed',	
        'useragent' 	=> 'identifies device brand, device model and version os and os version'
    );
	
	public static function refreshdevice($deviceid, $loginid, $fcm, $appver, $ua) {

        //echo "\n"."refreshdevice"."\n";
        //get id by deviceId, remove all devices if counter>1
		$qdevice = new Q('select id from devices where deviceid = "'.$deviceid.'";');
        if($qdevice->cnt()==0) 
            $iddevice=false;
        else if ($qdevice->cnt()==1) 
            $iddevice=$qdevice->ids();
        else { 
            //more than one record
            //echo "remove all deviceid"."\n";
            new Q('delete from devices where deviceid = "'.$deviceid.'";');
            $iddevice=false;
        }

        //in addition to checking if deviceid already exists, we check also if token already exists on another deviceid, this could not append but we want to avoid database inconsistency
        //get id by token, remove all devices if counter>1
        $qtoken = new Q('select id from devices where token = "'.$fcm.'";');
        if($qtoken->cnt()==0) 
            $idtoken=false;
        else if ($qtoken->cnt()==1) 
            $idtoken=$qtoken->ids();
        else {
            //more than one record
            //echo "remove all token"."\n";
            new Q('delete from devices where token = "'.$fcm.'";');
            $idtoken=false;
        }


        if($iddevice) {
            if($idtoken) {
                //iddevice && idtoken 
                if ($iddevice!=$idtoken) {
                    //echo "iddevice!=idtoken"."\n";
                    //ids are different! this should never happend!)-------------------------------------------------
                    //remove all
                    new Q('delete from devices where deviceid = "'.$deviceid.'";');
                    new Q('delete from devices where token = "'.$fcm.'";');
                    //create new record
                    $device = new C_dS_device(false,$loginid);
                }
                else
                {
                    //echo "iddevice=idtoken"."\n";
                    //update device (same iddevice and idtoken)-------------------------------------------------
                    $device = new C_dS_device($iddevice);
                }
            }
            else {
                //echo "iddevice but no idtoken"."\n";
                //iddevice but no idtoken-------------------------------------------------
                //update iddevice
                $device = new C_dS_device($iddevice);
            }
        }
        else {
            if($idtoken) {
                //echo "idtoken but no iddevice"."\n";
                //idtoken but no iddevice-------------------------------------------------
                //update idtoken
                $device = new C_dS_device($idtoken);
            }
            else {
                //echo "no idtoken and no iddevice"."\n";
                //no iddevice and no idtoken-------------------------------------------------
                //create new record
                $device = new C_dS_device(false,$loginid);
            }
        }

		//$device->groupId = $loginid;
        $device->deviceid = $deviceid;
		$device->token = $fcm;
		$device->appver = $appver;
		$device->useragent = $ua;
		$device->dSsave($loginid);
	}
    public static function removedevice($deviceid) {
		$q = new Q('delete from devices where deviceid = "'.$deviceid.'";');
	}
}




class C_dS_accesskey extends C_dbID {	// group to a login

	// dS_accesskey defines which account a login is granted access to. For each accessible account, the login gets one dS_accesskey instance attached.
	// dS_accesskey defines also which resources in the account will be visible for the parent login. 

    public function getTableName() { return  'accesskeys'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $accountId;
    public $bCals; // contains '-' when none is selected (*ak01*)
    public $uCals; // contains '' when all are selected (default DB value) or when no specific display order is set
    public $fCals; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order
    public $watchover; // contain like '5687!9874!6541', identifies the resources from which notifications should be sent to this login. A template with target bufCal must be defined!

    public static $multilines = false;
    public static $defaults = array( 	
        'accountId' 	=> 0,
        'bCals' 		=> '',
        'uCals' 		=> '',
        'fCals' 		=> '',
        'watchover' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
	
    // public function cleanView($dS_resource) {	// use removeFromView() instead
	
        // $this->idDropStringRef('watchover',$dS_resource->id); // contains smth like '5687!9874!6541' when some are selected
	
		// switch() {
			// case : break;
			// case : break;
			// case : break;
		// }
		// Now there is some specific attention for the fields bCals, uCals, and fCals
		// they contain '-' when none is visible for this login (that assumes that other resource(s) of that same type still exist in the account)
		// they contain '' when all are visible (which is also the default DB value, so when no resource of the given type exist anymore, the field is left empty '')
		// they contain '5687!9874!6541' when some are selected, or when some display order is defined
		
        // $this->idDropStringRef('bCals',$resourceId); 	
        // $this->idDropStringRef('uCals',$resourceId); 	
        // $this->idDropStringRef('fCals',$resourceId); 	
		
    // }
    public function viewSubstitution($xref) { // $xresources array key is the old id, array value is the new id
        $types = Array(); 
        $types[class_bCal] = &$this->bCals;
        $types[class_uCal] = &$this->uCals;
        $types[class_fCal] = &$this->fCals;
		
        foreach($types as $type => &$value)
            if($value == '') continue;
        else {
			$items = explode('!',$value);
			$xlinked = Array();
			foreach($items as $item) if(isset($xref[$item])) $xlinked[] = $xref[$item];
			$value = implode('!',$xlinked); // note that because taken by reference &$value, the replacement occurs inside the C_dS_accesskey object member
		}
    }
    public function reshapeViewOrder($resctype, $viewSetting) { 

        // here is the intelligence that keeps the pre-set display order even if the view gets extended or limited
        // $viewSetting does not state the display order, it only states what is in the view and what is not

        echo chr(10).'o Checking view for class '.$resctype;

        switch($resctype) {
            case class_bCal: $formerOrder = $this->bCals; break; // contains '-' when none is selected (*ak01*)
            case class_uCal: $formerOrder = $this->uCals; break; // contains '' when all are selected (default DB value) or when a specific display order is set
            case class_fCal: $formerOrder = $this->fCals; break; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order
        }

        if($formerOrder == '') { // this login did not matter the view order

            echo chr(10).chr(9).'There is no former order set'; 
            $newOrdering = $viewSetting; // apply the new setting

        } else {

            // else there was a former setting for the order, we need to keep this order and adapt along
            echo chr(10).chr(9).'The former order was set to '.$formerOrder;
            $formerOrder = explode('!', $formerOrder);

            if($viewSetting == '') { // this resource must see all resources while keeping the former order set
                $q = new Q('select id from resources where resourceType = '.$resctype.' and groupId = '.$this->accountId.';');
                $viewSetting = $q->ids(false);
            } else $viewSetting = explode('!', $viewSetting);

            // items of the former order that do not exists in the new viewSetting, remove them
            $formerCleanedUp = Array(); 
            echo chr(10).chr(9).chr(9).'Cleaning up the former order:';
            echo chr(10).chr(9).chr(9);
            foreach($formerOrder as $x => $formerItem)
                if(array_search($formerItem, $viewSetting)!==false) { $formerCleanedUp[] = $formerItem; echo '+'.$formerItem; unset($formerItem); }
            echo chr(10).chr(9).'formerCleanedUp is '.implode('!',$formerCleanedUp);

            // items of the view setting that are new to the view, add them at the end
            $newItems = Array();
            foreach($viewSetting as $x => $item)
                if(array_search($item, $formerCleanedUp)!==false) continue;
            else { $newItems[] = $item; unset($item); }
            $tellme = count($newItems)?'newItems are '.implode('!',$newItems):'there is no new items to add to the list';
            echo chr(10).chr(9).$tellme;

            if(count($newItems))
                foreach($newItems as $x => $item) $formerCleanedUp[] = $item;

            $newOrdering = implode('!',$formerCleanedUp);
            // save
            echo chr(10).chr(9).'new odering is '.$newOrdering;
        }

        // re-install the setting in the object
        switch($resctype) {
            case class_bCal: $this->bCals = $newOrdering; break; // contains '-' when none is selected (*ak01*)
            case class_uCal: $this->uCals = $newOrdering; break; // contains '' when all are selected (default DB value) or when a specific display order is set
            case class_fCal: $this->fCals = $newOrdering; break; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order
        }
    }
    public function addToView($type, $rid) {
        $types = Array(); 
        $types[class_bCal] = &$this->bCals;
        $types[class_uCal] = &$this->uCals;
        $types[class_fCal] = &$this->fCals;
        $view = &$types[$type]; // catch the right field
        if($view == '') return $this; // all resources are visible yet
        if($view == '-') $view = $rid; // no resource were visible, show this new resource
        else {
			$vorder = explode('!',$view);
			if(in_array($rid,$vorder)) return $this; // this resource is already in the view
			$view = $view.'!'.$rid; // a view order was already defined, add this resource at the end of the list
		}
        return $this;
    }
	public function removeFromView($type, $rid, $dbAccess_rscs, $isfinalremoval = false) {
			$types = Array(); 
			$types[class_bCal] = &$this->bCals;
			$types[class_uCal] = &$this->uCals;
			$types[class_fCal] = &$this->fCals;
        $view = &$types[$type]; // points to the right field in C_dS_accesskey
		$nl = chr(10);
		echo $nl.'rid:'.$rid.$nl;
		echo $nl.'access key id:'.$this->id.$nl;
		
		if($isfinalremoval==true) {
			// as we are actually fully removing this last resource, set the Cal field back to blank if it was the last one:
			$view = '';
			return $this; // job done
		}
		
		if($view == '-') return $this; // this key already sees none of the resources of this type
		
        if($view == '') { // all resources are currently visible
			$vorder = $dbAccess_rscs->getIdsList(list_as_array); // start from a comprehensive list of all resources
		} else {
			$vorder = explode('!',$view); // unless a limited view was already defined, then keep this view order
			// echo $nl; print_r($vorder);
		}
		$pos = array_search($rid,$vorder); // identifies the target position
		echo $nl.'pos='.$pos;
		if($pos!==false) unset($vorder[$pos]); // drop it from table
		
		if(count($vorder)==0) // then this accessKey reached a level that it may not see any of the resource of this type
			$view = '-';
		else
			$view = implode('!',$vorder); // rebuilds the ! separated string and writes across the pointer &
		
		echo 'new view:'.$this->bCals.'|'.$this->uCals.'|'.$this->fCals;
		
        return $this;
    }

    private function matchfile($pathfile) {

        $filename = '';
        $matches = glob($pathfile);
        if(count($matches)>0) $filename = $matches[0]; // echo '<br/>'; print_r($matches);
        $filename = pathinfo($filename, PATHINFO_BASENAME);
        return $filename;
    }
	public function hascustomlogo() { // returns a C_dS_logo id, can be a webpage loginid specific logo, or the group generic logo as a fallback, or 0 if none was uploaded
		
		// in some cases, it turns out the user uploaded many logos associated with the same web page (loginId)
		//
		//   select groupid, loginid, count(*) from logos
		//   group by groupid, loginid
		//   having count(*) > 1;
		//
		// see also /mobfiles/_logos where those multiple files are listed (they can be cleaned up)
		//
		// this directory sometimes contain 
		
		$logoid = 0;
		$q = new Q('select * from logos where groupId = '.$this->accountId.' and loginId = '.$this->groupId.' order by id desc limit 1;'); // looking for specific logo
		if($q->ids()) $logoid = $q->ids();
			else {
				$q = new Q('select * from logos where groupId = '.$this->accountId.' and loginId = 0 order by id desc limit 1;'); // looking for global logo
				if($q->ids()) $logoid = $q->ids();
			}
		return $logoid;
	}
    public function getcustomcss($csspath = '../themes/custom/') {

        // go search for a css file with name accountId_keyId.css (one css for this particular key i.e. that specific login)
        $cssfile = '';
        $cssname = $this->accountId.'_'.$this->id;
        $cssFilePath = $csspath.$cssname;
        $cssfile = $this->matchfile($cssFilePath.'*.css');

        if(!$cssfile) { // go search for a css file with name accountId.css (one css common for all account webpages)
            $cssname = $this->accountId;
            $cssFilePath = $csspath.$cssname;

            $cssfile = $this->matchfile($cssFilePath.' - '.'*.css'); // File having an annotation after the account number
            if(!$cssfile) $cssfile = $this->matchfile($cssFilePath.'.css'); // File having the exact account number for name
        }
        return $cssfile; // returns '' if no css file was found, css name else (no path in the string)
    }
	public function dropWatchover($rscid) {
		if(!$this->watchover) return $this;
		$wors = explode('!',$this->watchover);
		$worsnews = Array();
		foreach($wors as $worscid) if($worscid!=$rscid) $worsnews[] = $rscid;
		$this->watchover = implode('!',$worsnews);
	}
	
	public static function audit($lid, $accid) {
		
        $q = new Q('SELECT id FROM accesskeys WHERE groupId='.$lid.' and accountId = '.$accid.';');
        if(!$q->cnt()) return false; // That login has no access to this account
		if($q->cnt()>1) return false; // abnormal condition, a login can have maximum 1 key to an account
		return new C_dS_accesskey($q->ids());
	}
	
	public static $explained = array( 
        'groupId' 		=> 'id of a C_dS_login object that is defined as parent login for this key. ',	
        'accountId' 	=> 'id of a C_dS_group. This key gives access to the given account',	
        'bCals' 		=> 'id\'s of valid bClas resources that are visible (allowed) for the given C_dS_login in the given account',	
        'uCals' 		=> 'id\'s of valid uClas resources that are visible (allowed) for the given C_dS_login in the given account',
        'fCals' 		=> 'id\'s of valid fClas resources that are visible (allowed) for the given C_dS_login in the given account',
        'watchover' 	=> 'ids of C_dS_resources identifying which resource(s) planning events do notify this login.'
    );
    	

}


define('device_type_computer' 	, 0);  // see (*dt01*)
define('device_type_smartphone' , 1);
define('device_type_tablet' 	, 2);


define('planning_view_vertical' 	, 1); // see (*pv01*)
define('planning_view_horizontal' 	, 2);
define('planning_view_text' 		, 3);
define('planning_view_hourly' 		, 4);

class C_dS_details extends C_dbID { // display details options grouped by access key
    public function getTableName() { return  'details'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $deviceType;
    public $displayMode;
    public $resourceType;
    public $details;
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'deviceType'	=> 0, // 0 computer with keyboard, 1 smartphone, 2 tablets
        'displayMode'	=> 0, // 1 for vertical view, 2 for horizontal view, 3 for list view (textual).
        'resourceType' 	=> class_bCal,	
        'details' 		=> 8299
    );
    public function getDefaults() { return self::$defaults; }
    public static $explained = array( 
		'deviceType'	=> 'deviceType ranges [0 computer with keyboard and mouse, 1 smartphone, 2 tablets]',
		'displayMode'	=> 'display mode this details set relates to [1 for vertical view, 2 for horizontal view, 3 for list view]',
        'resourceType' 	=> 'resource type these details relate to [class_bCal, class_uCal, class_fCal]',
        'details' 		=> 'bigint bitfield, each bit indicates a data to be displayed/hidden', // (*dd01*)
    );
}

class C_dS_connections_manager extends C_dbID {
	

    //                   sessionId     <= one browser on one computer
    //                 /          \
    //                /            \
    //         loginId             loginId    <= multi login
    //          /  \              /   |   \
    //         /    \            /    |    \
    //     accKey  accKey   accKey  accKey  accKey   <= multi account login
	
	
	// PRIVATE
    private function freshset($key, $dS_login, $dS_group) {

        $this->sessionId = session_id();
        $this->loginId = $dS_login->id;
        $this->connKey = $key;
        $this->surfer = $dS_login->lastname.', '.$dS_login->firstname;
        $this->account = $dS_group->name;
        $this->agent = $_SERVER['HTTP_USER_AGENT'];
        $this->ip = $_SERVER['REMOTE_ADDR'];
        $this->logintime = time();
    }
    private static function exist($key) { // returns existing connection for this key, or a new one 
        $q = new Q('SELECT id FROM connections WHERE sessionId="'.session_id().'" AND connKey='.$key.';');
        $id = $q->one();
        if(!$id) return new C_dS_connection(0);
        else return new C_dS_connection($id);
    }

    // STATIC SESSION CONNEXION MONITORING
    public static function current($dS_login, $dS_group, $key) { // registers a new or ongoing connection
        $connectionId = isset($_SESSION['connectionId']) ? $_SESSION['connectionId'] : false;
        $dS_connection = new C_dS_connection($connectionId);
        if($dS_connection->id == 0) { 
            // CASE 1: fresh session
            $dS_connection->freshset($key, $dS_login, $dS_group);
            echo 'Fresh connection'.chr(10);

        } else
            if($dS_connection->connKey != $key) { 
                // CASE 2: connection exists but we switch to another key

                $dS_connection = C_dS_connection::exist($key);
                if($dS_connection->id) { // you have been on this key yet
                    $dS_connection->switchTos++;
                    echo 'Back to a visited key connection'.chr(10);
                } else {
                    // you switch for the first time to this key
                    $dS_connection->freshset($key, $dS_login, $dS_group);
                    echo 'Connection switch to a non visited key yet'.chr(10);
                }

            } else {	
                // CASE 3: identical key => you are reloading your browser
                $dS_connection->reloads++;
                echo 'Connection reload'.chr(10);
            }
        $dS_connection->dSsave($dS_group->id);
        $_SESSION['connectionId'] = $dS_connection->id;
    }
    public static function poke($perfReport, $action) { // records activity on a connection

        // retrieve concerned connection
        $connId = @$_SESSION['connectionId'];
        if(!isset($connId)) return 0;
        $q = new Q('SELECT id FROM connections WHERE id='.$connId.';');
        if(!$q->cnt()) return 2; // That browser did not watchdog and suddenly has activity

        $dS_connection = new C_dS_connection($connId);
        $dS_connection->activity = time();

        // performance log
        $perftime = $perfReport->getlaptime();
        $perfname = 'perf_'.$action.'_pk';
        if($perftime>$dS_connection->{$perfname}) $dS_connection->{$perfname} = $perftime;
        $perfcat = 'perf_'.$action[0].'_pk';
        if($perftime>$dS_connection->{$perfcat}) $dS_connection->{$perfcat} = $perftime;
        $processing = 'perf_'.$action[0].'_acc';
        $totalprocessing = ($dS_connection->{$processing} += $perftime);
        $actcnt = 'cnt_'.$action[0].'_all';
        $mean = 'perf_'.$action[0].'_mean';
        $newmean = $totalprocessing / (++$dS_connection->{$actcnt});
        $dS_connection->{$mean} = $newmean;

        // action counter log
        $cntrname = 'cnt_'.$action;
        $dS_connection->{$cntrname}++;

        //
        $dS_connection->dSsave();
    }
    public static function keepalive() { // records watchdog on a connection
        $connId = @$_SESSION['connectionId'];
        if(!isset($connId)) return 0; // No login yet 
        if($connId == 0) return 0; // All connections were closed using ::close(0)
        new Q('UPDATE connections SET watchdog = '.time().' WHERE id = '.$connId.';');
        return 1;
    }
    public static function timeout($unixtime) { // force closing and archives connections having no watchdog
        $obsolescence = $unixtime-10800; // 3 hours from now
        $where = 'watchdog <= '.$obsolescence.' AND activity <= '.$obsolescence.' AND logintime <= '.$obsolescence;
        new Q('INSERT INTO archive_connections SELECT * FROM connections WHERE '.$where.';');
        new Q('DELETE FROM connections WHERE '.$where.';');
    }
    public static function close($loginId) { // closes and archives a connection
        $connId = @$_SESSION['connectionId'];
        if(!isset($connId)) return;
        $_SESSION['connectionId'] = 0; 

        $a = new Q('SELECT sessionId FROM connections WHERE id = '.$connId.';');
        $sessionId = $a->mlist('sessionId');

        $where = 'WHERE sessionId = "'.$sessionId.'"'; // includes all connections from this browser
        if($loginId) $where .= ' AND loginId = "'.$loginId.'"'; // limit to the given loginId (removes connections for all keys)
        new Q('INSERT INTO archive_connections SELECT * FROM connections '.$where.';');
        new Q('DELETE FROM connections '.$where.';');
    }

    // DATA
    public $sessionId;
    public $loginId;
    public $connKey;
	
    public $surfer;		// login name
    public $account;	// account name
    public $agent; 		// user agent Safari? MS-Explorer?
	
    public $ip;
    public $logintime; 	// login timestamp
	
    public function __construct( $id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset);
	}
}

class C_dS_connection extends C_dS_connections_manager { // group to an account, monitors WEBAPP connections



    public function getTableName() { return  'connections'; }
    public function getClassName() { return get_class(); }
    public function __construct( $id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset);
	}

    

    public $reloads;	// the browser has reloaded the full content (e.g. F5 on Firefox)
    public $switchTos;	// a multi login as switched from another key back to this key
    public $watchdog; 	// last time watchdog has been called using function ::keepalive()
    public $activity; 	// last time activity has been observed through function ::poke()

    public $cnt_q_all; 	public $perf_q_acc; 	public $perf_q_pk; 	public $perf_q_mean;
    public $cnt_p_all; 	public $perf_p_acc; 	public $perf_p_pk; 	public $perf_p_mean;
    public $cnt_d_all; 	public $perf_d_acc; 	public $perf_d_pk; 	public $perf_d_mean;

    public $cnt_q_config; 		public $perf_q_config_pk; // queries
    public $cnt_q_emerg;		public $perf_q_emerg_pk;
    public $cnt_q_gender;		public $perf_q_gender_pk;
    public $cnt_q_login;		public $perf_q_login_pk;
    public $cnt_q_orphans;		public $perf_q_orphans_pk;
    public $cnt_q_plitems;		public $perf_q_plitems_pk;
    public $cnt_q_remote;		public $perf_q_remote_pk;
    public $cnt_q_search;		public $perf_q_search_pk;
    public $cnt_q_stats;		public $perf_q_stats_pk;
    public $cnt_q_alphatab;		public $perf_q_alphatab_pk;
    public $cnt_q_swap;			public $perf_q_swap_pk;
    public $cnt_q_visiapps;		public $perf_q_visiapps_pk;
    public $cnt_q_visitors;		public $perf_q_visitors_pk;

    public $cnt_p_config;		public $perf_p_config_pk; // posts
    public $cnt_p_visitor;		public $perf_p_visitor_pk;
    public $cnt_p_resa;			public $perf_p_resa_pk;
    public $cnt_p_rsc;			public $perf_p_rsc_pk;
    public $cnt_p_schedule;		public $perf_p_schedule_pk;
    public $cnt_p_shadow;		public $perf_p_shadow_pk;
    public $cnt_p_task;			public $perf_p_task_pk;
    public $cnt_p_note;			public $perf_p_note_pk;
    public $cnt_p_chat;			public $perf_p_chat_pk;
    public $cnt_p_newacc;		public $perf_p_newacc_pk; // <= check faisability
    public $cnt_p_login;		public $perf_p_login_pk;
    public $cnt_p_huser;		public $perf_p_huser_pk;
    public $cnt_p_tboxing;		public $perf_p_tboxing_pk;
    public $cnt_p_hourly;		public $perf_p_hourly_pk;
    public $cnt_p_gdlns;		public $perf_p_gdlns_pk;
    public $cnt_p_smst;			public $perf_p_smst_pk;
    public $cnt_p_emlt;			public $perf_p_emlt_pk;
    public $cnt_p_details;		public $perf_p_details_pk;
    public $cnt_p_ccss;			public $perf_p_ccss_pk;
    public $cnt_p_account;		public $perf_p_account_pk;
    public $cnt_p_wrkc;			public $perf_p_wrkc_pk;

    public $cnt_d_account;		public $perf_d_account_pk; // deletes
    public $cnt_d_ccss;			public $perf_d_ccss_pk;
    public $cnt_d_smst;			public $perf_d_smst_pk;
    public $cnt_d_emlt;			public $perf_d_emlt_pk;
    public $cnt_d_gdlns;		public $perf_d_gdlns_pk;
    public $cnt_d_shadow;		public $perf_d_shadow_pk;
    public $cnt_d_huser;		public $perf_d_huser_pk;
    public $cnt_d_tboxing;		public $perf_d_tboxing_pk;
    public $cnt_d_login;		public $perf_d_login_pk;
    public $cnt_d_resa;			public $perf_d_resa_pk;
    public $cnt_d_task;			public $perf_d_task_pk;
    public $cnt_d_note;			public $perf_d_note_pk;
    public $cnt_d_chat;			public $perf_d_chat_pk;
    public $cnt_d_rsc;			public $perf_d_rsc_pk;
    public $cnt_d_wrkc;			public $perf_d_wrkc_pk;


    public static $multilines = false;
    public static $defaults = array( 	
        'sessionId' => 'sessionId', 'loginId' => 0 , 'connKey' => 0
        ,'reloads'		=> 0, 'switchTos'	=> 0
        ,'surfer'		=> '?', 'account'		=> '?'
        ,'agent'		=> 'agent' // Safari? MS-Explorer?
        ,'ip'			=> 0

        ,'logintime'	=> 0
        ,'watchdog'		=> 0 // watchdog timestamp
        ,'activity'		=> 0 // last time watchdog

        ,'cnt_q_all'	=> 0	,'perf_q_acc'	=> 0 		,'perf_q_pk'	=> 0 		,'perf_q_mean'	=> 0 // queries
        ,'cnt_p_all'	=> 0	,'perf_p_acc'	=> 0		,'perf_p_pk'	=> 0		,'perf_p_mean'	=> 0
        ,'cnt_d_all'	=> 0	,'perf_d_acc'	=> 0		,'perf_d_pk'	=> 0		,'perf_d_mean'	=> 0

        ,'cnt_q_config'		=> 0 		,'perf_q_config_pk'	=> 0 // queries
        ,'cnt_q_emerg'		=> 0		,'perf_q_emerg_pk'	=> 0
        ,'cnt_q_gender'		=> 0		,'perf_q_gender_pk'	=> 0
        ,'cnt_q_login'		=> 0		,'perf_q_login_pk'	=> 0
        ,'cnt_q_orphans'	=> 0		,'perf_q_orphans_pk'=> 0
        ,'cnt_q_plitems'	=> 0		,'perf_q_plitems_pk'=> 0
        ,'cnt_q_remote'		=> 0		,'perf_q_remote_pk'	=> 0
        ,'cnt_q_search'		=> 0		,'perf_q_search_pk'	=> 0
        ,'cnt_q_stats'		=> 0		,'perf_q_stats_pk'	=> 0
        ,'cnt_q_alphatab'	=> 0		,'perf_q_alphatab_pk'=> 0
        ,'cnt_q_swap'		=> 0		,'perf_q_swap_pk'	=> 0
        ,'cnt_q_visiapps'	=> 0		,'perf_q_visiapps_pk'=> 0
        ,'cnt_q_visitors'	=> 0		,'perf_q_visitors_pk'=> 0

        ,'cnt_p_config'		=> 0		,'perf_p_config_pk'	=> 0 // posts
        ,'cnt_p_visitor'	=> 0		,'perf_p_visitor_pk'=> 0
        ,'cnt_p_resa'		=> 0		,'perf_p_resa_pk'	=> 0
        ,'cnt_p_rsc'		=> 0		,'perf_p_rsc_pk'	=> 0
        ,'cnt_p_schedule'	=> 0		,'perf_p_schedule_pk'=> 0
        ,'cnt_p_shadow'		=> 0		,'perf_p_shadow_pk'	=> 0
        ,'cnt_p_task'		=> 0		,'perf_p_task_pk'	=> 0
        ,'cnt_p_note'		=> 0		,'perf_p_note_pk'	=> 0
        ,'cnt_p_chat'		=> 0		,'perf_p_chat_pk'	=> 0
        ,'cnt_p_newacc'		=> 0		,'perf_p_newacc_pk'	=> 0
        ,'cnt_p_login'		=> 0		,'perf_p_login_pk'	=> 0
        ,'cnt_p_huser'		=> 0		,'perf_p_huser_pk'	=> 0
        ,'cnt_p_tboxing'	=> 0		,'perf_p_tboxing_pk'=> 0
        ,'cnt_p_hourly'		=> 0		,'perf_p_hourly_pk'	=> 0
        ,'cnt_p_gdlns'		=> 0		,'perf_p_gdlns_pk'	=> 0
        ,'cnt_p_smst'		=> 0		,'perf_p_smst_pk'	=> 0
        ,'cnt_p_emlt'		=> 0		,'perf_p_emlt_pk'	=> 0
        ,'cnt_p_details'	=> 0		,'perf_p_details_pk'=> 0
        ,'cnt_p_ccss'		=> 0		,'perf_p_ccss_pk'	=> 0
        ,'cnt_p_account'	=> 0		,'perf_p_account_pk'=> 0
        ,'cnt_p_wrkc'		=> 0		,'perf_p_wrkc_pk'	=> 0

        ,'cnt_d_account'	=> 0		,'perf_d_account_pk'=> 0 // deletes
        ,'cnt_d_ccss'		=> 0		,'perf_d_ccss_pk'	=> 0
        ,'cnt_d_smst'		=> 0		,'perf_d_smst_pk'	=> 0
        ,'cnt_d_emlt'		=> 0		,'perf_d_emlt_pk'	=> 0
        ,'cnt_d_gdlns'		=> 0		,'perf_d_gdlns_pk'	=> 0
        ,'cnt_d_shadow'		=> 0		,'perf_d_shadow_pk'	=> 0
        ,'cnt_d_huser'		=> 0		,'perf_d_huser_pk'	=> 0
        ,'cnt_d_tboxing'	=> 0		,'perf_d_tboxing_pk'=> 0
        ,'cnt_d_login'		=> 0		,'perf_d_login_pk'	=> 0
        ,'cnt_d_resa'		=> 0		,'perf_d_resa_pk'	=> 0
        ,'cnt_d_task'		=> 0		,'perf_d_task_pk'	=> 0		
        ,'cnt_d_note'		=> 0		,'perf_d_note_pk'	=> 0		
        ,'cnt_d_chat'		=> 0		,'perf_d_chat_pk'	=> 0		
        ,'cnt_d_rsc'		=> 0		,'perf_d_rsc_pk'	=> 0
        ,'cnt_d_wrkc'		=> 0		,'perf_d_wrkc_pk'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_connection_aiapi extends C_dS_connections_manager { // group to an account, monitors AI API connections

    public function getTableName() { return  'connections'; }
    public function getClassName() { return get_class(); }
    public function __construct( $id = false, $groupId = false, &$preset = false) { 
		parent::__construct($id, $groupId, $preset);
	}

    public $reloads;	// the browser has reloaded the full content (e.g. F5 on Firefox)
    public $switchTos;	// a multi login as switched from another key back to this key
    public $watchdog; 	// last time watchdog has been called using function ::keepalive()
    public $activity; 	// last time activity has been observed through function ::poke()

    public $cnt_q_all; 	public $perf_q_acc; 	public $perf_q_pk; 	public $perf_q_mean;
    public $cnt_p_all; 	public $perf_p_acc; 	public $perf_p_pk; 	public $perf_p_mean;
    public $cnt_d_all; 	public $perf_d_acc; 	public $perf_d_pk; 	public $perf_d_mean;

    public $cnt_q_config; 		public $perf_q_config_pk; // queries
    public $cnt_q_emerg;		public $perf_q_emerg_pk;
    public $cnt_q_gender;		public $perf_q_gender_pk;
    public $cnt_q_login;		public $perf_q_login_pk;
    public $cnt_q_orphans;		public $perf_q_orphans_pk;
    public $cnt_q_plitems;		public $perf_q_plitems_pk;
    public $cnt_q_remote;		public $perf_q_remote_pk;
    public $cnt_q_search;		public $perf_q_search_pk;
    public $cnt_q_stats;		public $perf_q_stats_pk;
    public $cnt_q_alphatab;		public $perf_q_alphatab_pk;
    public $cnt_q_swap;			public $perf_q_swap_pk;
    public $cnt_q_visiapps;		public $perf_q_visiapps_pk;
    public $cnt_q_visitors;		public $perf_q_visitors_pk;

    public $cnt_p_config;		public $perf_p_config_pk; // posts
    public $cnt_p_visitor;		public $perf_p_visitor_pk;
    public $cnt_p_resa;			public $perf_p_resa_pk;
    public $cnt_p_rsc;			public $perf_p_rsc_pk;
    public $cnt_p_schedule;		public $perf_p_schedule_pk;
    public $cnt_p_shadow;		public $perf_p_shadow_pk;
    public $cnt_p_task;			public $perf_p_task_pk;
    public $cnt_p_note;			public $perf_p_note_pk;
    public $cnt_p_chat;			public $perf_p_chat_pk;
    public $cnt_p_newacc;		public $perf_p_newacc_pk; // <= check faisability
    public $cnt_p_login;		public $perf_p_login_pk;
    public $cnt_p_huser;		public $perf_p_huser_pk;
    public $cnt_p_tboxing;		public $perf_p_tboxing_pk;
    public $cnt_p_hourly;		public $perf_p_hourly_pk;
    public $cnt_p_gdlns;		public $perf_p_gdlns_pk;
    public $cnt_p_smst;			public $perf_p_smst_pk;
    public $cnt_p_emlt;			public $perf_p_emlt_pk;
    public $cnt_p_details;		public $perf_p_details_pk;
    public $cnt_p_ccss;			public $perf_p_ccss_pk;
    public $cnt_p_account;		public $perf_p_account_pk;
    public $cnt_p_wrkc;			public $perf_p_wrkc_pk;

    public $cnt_d_account;		public $perf_d_account_pk; // deletes
    public $cnt_d_ccss;			public $perf_d_ccss_pk;
    public $cnt_d_smst;			public $perf_d_smst_pk;
    public $cnt_d_emlt;			public $perf_d_emlt_pk;
    public $cnt_d_gdlns;		public $perf_d_gdlns_pk;
    public $cnt_d_shadow;		public $perf_d_shadow_pk;
    public $cnt_d_huser;		public $perf_d_huser_pk;
    public $cnt_d_tboxing;		public $perf_d_tboxing_pk;
    public $cnt_d_login;		public $perf_d_login_pk;
    public $cnt_d_resa;			public $perf_d_resa_pk;
    public $cnt_d_task;			public $perf_d_task_pk;
    public $cnt_d_note;			public $perf_d_note_pk;
    public $cnt_d_chat;			public $perf_d_chat_pk;
    public $cnt_d_rsc;			public $perf_d_rsc_pk;
    public $cnt_d_wrkc;			public $perf_d_wrkc_pk;


    public static $multilines = false;
    public static $defaults = array( 	
        'sessionId' => 'sessionId', 'loginId' => 0 , 'connKey' => 0
        ,'reloads'		=> 0, 'switchTos'	=> 0
        ,'surfer'		=> '?', 'account'		=> '?'
        ,'agent'		=> 'agent' // Safari? MS-Explorer?
        ,'ip'			=> 0

        ,'logintime'	=> 0
        ,'watchdog'		=> 0 // watchdog timestamp
        ,'activity'		=> 0 // last time watchdog

        ,'cnt_q_all'	=> 0	,'perf_q_acc'	=> 0 		,'perf_q_pk'	=> 0 		,'perf_q_mean'	=> 0 // queries
        ,'cnt_p_all'	=> 0	,'perf_p_acc'	=> 0		,'perf_p_pk'	=> 0		,'perf_p_mean'	=> 0
        ,'cnt_d_all'	=> 0	,'perf_d_acc'	=> 0		,'perf_d_pk'	=> 0		,'perf_d_mean'	=> 0

        ,'cnt_q_config'		=> 0 		,'perf_q_config_pk'	=> 0 // queries
        ,'cnt_q_emerg'		=> 0		,'perf_q_emerg_pk'	=> 0
        ,'cnt_q_gender'		=> 0		,'perf_q_gender_pk'	=> 0
        ,'cnt_q_login'		=> 0		,'perf_q_login_pk'	=> 0
        ,'cnt_q_orphans'	=> 0		,'perf_q_orphans_pk'=> 0
        ,'cnt_q_plitems'	=> 0		,'perf_q_plitems_pk'=> 0
        ,'cnt_q_remote'		=> 0		,'perf_q_remote_pk'	=> 0
        ,'cnt_q_search'		=> 0		,'perf_q_search_pk'	=> 0
        ,'cnt_q_stats'		=> 0		,'perf_q_stats_pk'	=> 0
        ,'cnt_q_alphatab'	=> 0		,'perf_q_alphatab_pk'=> 0
        ,'cnt_q_swap'		=> 0		,'perf_q_swap_pk'	=> 0
        ,'cnt_q_visiapps'	=> 0		,'perf_q_visiapps_pk'=> 0
        ,'cnt_q_visitors'	=> 0		,'perf_q_visitors_pk'=> 0

        ,'cnt_p_config'		=> 0		,'perf_p_config_pk'	=> 0 // posts
        ,'cnt_p_visitor'	=> 0		,'perf_p_visitor_pk'=> 0
        ,'cnt_p_resa'		=> 0		,'perf_p_resa_pk'	=> 0
        ,'cnt_p_rsc'		=> 0		,'perf_p_rsc_pk'	=> 0
        ,'cnt_p_schedule'	=> 0		,'perf_p_schedule_pk'=> 0
        ,'cnt_p_shadow'		=> 0		,'perf_p_shadow_pk'	=> 0
        ,'cnt_p_task'		=> 0		,'perf_p_task_pk'	=> 0
        ,'cnt_p_note'		=> 0		,'perf_p_note_pk'	=> 0
        ,'cnt_p_chat'		=> 0		,'perf_p_chat_pk'	=> 0
        ,'cnt_p_newacc'		=> 0		,'perf_p_newacc_pk'	=> 0
        ,'cnt_p_login'		=> 0		,'perf_p_login_pk'	=> 0
        ,'cnt_p_huser'		=> 0		,'perf_p_huser_pk'	=> 0
        ,'cnt_p_tboxing'	=> 0		,'perf_p_tboxing_pk'=> 0
        ,'cnt_p_hourly'		=> 0		,'perf_p_hourly_pk'	=> 0
        ,'cnt_p_gdlns'		=> 0		,'perf_p_gdlns_pk'	=> 0
        ,'cnt_p_smst'		=> 0		,'perf_p_smst_pk'	=> 0
        ,'cnt_p_emlt'		=> 0		,'perf_p_emlt_pk'	=> 0
        ,'cnt_p_details'	=> 0		,'perf_p_details_pk'=> 0
        ,'cnt_p_ccss'		=> 0		,'perf_p_ccss_pk'	=> 0
        ,'cnt_p_account'	=> 0		,'perf_p_account_pk'=> 0
        ,'cnt_p_wrkc'		=> 0		,'perf_p_wrkc_pk'	=> 0

        ,'cnt_d_account'	=> 0		,'perf_d_account_pk'=> 0 // deletes
        ,'cnt_d_ccss'		=> 0		,'perf_d_ccss_pk'	=> 0
        ,'cnt_d_smst'		=> 0		,'perf_d_smst_pk'	=> 0
        ,'cnt_d_emlt'		=> 0		,'perf_d_emlt_pk'	=> 0
        ,'cnt_d_gdlns'		=> 0		,'perf_d_gdlns_pk'	=> 0
        ,'cnt_d_shadow'		=> 0		,'perf_d_shadow_pk'	=> 0
        ,'cnt_d_huser'		=> 0		,'perf_d_huser_pk'	=> 0
        ,'cnt_d_tboxing'	=> 0		,'perf_d_tboxing_pk'=> 0
        ,'cnt_d_login'		=> 0		,'perf_d_login_pk'	=> 0
        ,'cnt_d_resa'		=> 0		,'perf_d_resa_pk'	=> 0
        ,'cnt_d_task'		=> 0		,'perf_d_task_pk'	=> 0		
        ,'cnt_d_note'		=> 0		,'perf_d_note_pk'	=> 0		
        ,'cnt_d_chat'		=> 0		,'perf_d_chat_pk'	=> 0		
        ,'cnt_d_rsc'		=> 0		,'perf_d_rsc_pk'	=> 0
        ,'cnt_d_wrkc'		=> 0		,'perf_d_wrkc_pk'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}


class C_dS_catalyst extends C_dbID { // grouped by access key
    public function getTableName() { return  'catalysts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $catalyst;
    public $fields; // selected fields to be displayed on table for this catalyst
    public $sorton; // column to sort on
    public $sortdir;// sort direction
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'catalyst'	=> '',
        'fields' 	=> '',
        'sorton'	=> '',
        'sortdir'	=> 1
    );
    public function getDefaults() { return self::$defaults; }
    public static $explained = array( 
		'catalyst'	=> 'C_dS_name',
        'fields' 	=> 'Which fields are selected for display',
        'sorton' 	=> 'Which field is chosen to be the sort key for display.',
        'sortdir' 	=> 'Sort direction: 1 is ascending, 0 is descending'
    );
    	

}

class C_keyview extends C_dS_accesskey { // turns viewless access keys into programmable coded views $this->bCals becomes an Array();

    public function __construct($id) { 

        parent::__construct($id);

        $accid = $this->accountId;

        function rids($accid, $type) {
            $q = new Q('select id from resources where groupId = '.$accid.' and resourceType = '.$type.';');
            return $q->ids(false); // true forces Array result
        }

        $b = &$this->bCals;
        $u = &$this->uCals;
        $f = &$this->fCals;
        if($b=='-') $b = Array(); else if($b=='') { $b = rids($accid, class_bCal); } else $b = explode('!',$b);
        if($u=='-') $u = Array(); else if($u=='') { $u = rids($accid, class_uCal); } else $u = explode('!',$u);
        if($f=='-') $f = Array(); else if($f=='') { $f = rids($accid, class_fCal); } else $f = explode('!',$f);
    }
    private function chain($separator, $type=false) {
        switch($type) {
            case class_bCal: return implode($separator,$this->bCals); break;
            case class_uCal: return implode($separator,$this->uCals); break;
            case class_fCal: return implode($separator,$this->fCals); break;
            default:
                $b = implode($separator,$this->bCals);
                $u = implode($separator,$this->uCals);
                $f = implode($separator,$this->fCals);
                if($u) $b.= $separator.$u;
                if($f) $b.= $separator.$f;
                return $b;
        }
    }
    public function get4sql($type=false) { return $this->chain(',', $type); }
    public function get4stream($type=false) { return $this->chain('!', $type); }
    public function get4prog($type=false) { 
        switch($type) {
            case class_bCal: return $this->bCals; break;
            case class_uCal: return $this->uCals; break;
            case class_fCal: return $this->fCals; break;
            default:
                $b = $this->bCals;
                $u = $this->uCals;
                $f = $this->fCals;
                $a = Array(); foreach($b as $id) $a[] = $id;
                if(count($u)) foreach($u as $id) $a[] = $id;
                if(count($f)) foreach($f as $id) $a[] = $id;
                return $a;
        }
    }
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A C C O U N T     &    A C C O U N T    R E S O U R C E S  
//
define('resourceName_resources'		, 00);
define('resourceName_workrooms'		, 10);
define('resourceName_workplaces'	, 20);
define('resourceName_carerooms'		, 30);
define('resourceName_collaborators'	, 40);
define('resourceName_assistants'	, 50);
define('resourceName_doctors'		, 60);
define('resourceName_technicians'	, 70);
define('resourceName_equipment'		, 80);
define('resourceName_offices'		, 90);
define('resourceName_tools'			, 100);
define('resourceName_cars'			, 110);

define('history_ever'		, 0);
define('history_1_day'		, 1);
define('history_1_week'		, 7);
define('history_2_weeks'	, 15);
define('history_1_month'	, 30);
define('history_3_months'	, 120);
define('history_1_year'		, 356);

define('css_skin_login'		, 149);
define('css_skin_standard'	, 150);
define('css_skin_1'			, 151);
define('css_skin_2'			, 152);
define('css_skin_3'			, 153);
define('css_skin_4'			, 154);

define('reservability_buffered'	, 2); 
define('reservability_allday'	, 1);
define('reservability_scheduled', 0);

define('class_uCal'		, 1); // see (*rt01*)
define('class_bCal'		, 2); 
define('class_visitor'	, 3);
define('class_fCal'		, 4); 

// define('visitorAlias_client'		, 100); // (*va00*) // pvh2025 mooooved to language_basics.php
// define('visitorAlias_patient'		, 200);
// define('visitorAlias_participant'	, 150);

class C_dS_group extends C_dbTrackingCCD { // group to a login id (a seller login)

    public function getTableName() { return  'groups'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

	public $cfgversion; // configuration version, when client call the server, this version is compared with client version, if not matching, the client should reload the config

	// account identification

    public $package;		// starter/ basic/ pro/ custom/ etc...
    public $profsector;		// profession and sector
    public $GMT;
    public $name;			// group name and SMS sifnature
    public $headline;		// Office main directive for this account
    public $color;	
    public $pattern;
    public $tag;
    public $note;			// basic information for this account, appears under mouse tooltip above the group name
	public $weburl;			// customer website url, like www.doctorwho.com
	public $ccphone;		// call center phone number (number formed by patient trying to reach the practice, used for auto-login from call central)
    public $email;			// 
    public $language;

	// account parameters
	
    public $visitorAlias;
    public $smsSenderId;
    public $timeSlice;			// integer dividor of 60. E.g: if $timeSlice = 2 than one slice is 30 minutes

    public $durationShortest;	// search pref dashboard, this is the shortest duration you can click, recorded as a number of slices
    public $durationSteps;		// increment (in slices)  on the duration list
    public $durationLongest;	// longest duration you can click, recorded as a number of slices
    public $notbefore;			// bigint (is 8 bytes signed) bitmap indicating which options to display on the searchboard, see C_iBEFORE
    public $upperLeftDate; 		// date to be displayed in the upper left screen corner

    public $rangeIn; 			// number of seconds, first slice drawn on a display planning 
    public $rangeOut;			// number of seconds, last slice drawn on a display planning 
    public $history;
    public $vipToggle;			// allows toggling VIP reservations display
    public $cssSuite;
	
    public $ePayActive;			// ePayment Beneficiary Name
	
    public $ePayBenefName;		// ePayment Beneficiary Name
    public $ePayBenefIBAN;		// ePayment Beneficiary IBAN
    public $ePayBenefBIC;		// ePayment Beneficiary BIC
	
    public $ePayconiqKey;		// ePayment Payconiq key
    public $ePayMarketKey;		// ePayment Marketpay key (PVH2023, not used as we didn't go with market pay)
	
    public $ePayHardPayClientId;		// ePayment credentials HardPOS
    public $ePayHardPayClientSecret;	// ePayment credentials HardPOS
    public $ePayHardPayToken;			// ePayment credentials HardPOS
	
    public $ePaySoftPayClientId;		// ePayment credentials SoftPOS
    public $ePaySoftPayClientSecret;	// ePayment credentials SoftPOS
    public $ePaySoftPayAppId;			// ePayment credentials SoftPOS
    public $ePaySoftPayToken;			// ePayment token for curl calls
	
    public $ePayComputopId;		// ePayment credentials Computop e-commerce user id
    public $ePayComputopFish;	// ePayment credentials Computop e-commerce password
    public $ePayComputopHmac;	// ePayment credentials Computop e-commerce HMAC Authentication
	
	public $ePayWebActive; // bitmap indicating which payment service is active for online resa & payment, bitmap structure, see (*ep23*)
	
    public $suspended;			// service suspended	
    public $stiFontSize;		// planning stickers font size
    public $mailToUsers;	
    public $sendSMSs;			// boolean indication of wether or not sms's are sent (preparation and populating sms table remains)
    public $phoneRegion;		// when no international code is provided with phone number, this specifies which one is set
    public $phoneSlicing;		// to display +32 497 40 16 26 or +32 497 401 626

    public $defaultGender;		// when creating a new person, this gender is preset as default gender
    public $bCalsName; 			// resource name code
    public $uCalsName; 			// resource name code
    public $fCalsName; 			// resource name code

    public $defaultCssAppColor; 		// Watch the SYNTAX when adding some more of those fields
    public $defaultCssAppPattern; 		// -> check (*21*) in delete/customcss.php
    public $defaultCssAppTag; 			//

    public $defaultCssEventColor; 		//
    public $defaultCssEventPattern; 	//
    public $defaultCssEventTag; 		//

    public $defaultCssFcalColor; 		//
    public $defaultCssFcalPattern; 		//
    public $defaultCssFcalTag; 			//

    public $defaultCssVisitorColor; 	//
    public $defaultCssVisitorPattern; 	//
    public $defaultCssVisitorTag; 		//


    public $maxVisitors; 	// specifies the maximum number of visitors a reservation can hold
    public $cssLogging; 	// Specifies if changing css should log into reservations comments who did it and when

    public $usestandbylist; // use standby list
    public $overdays; 		// use reservations that spend over days
    public $usetasks;
    public $usenotes;
    public $usechat;
    public $usefiles;
    public $useappaddress;	// if appointments should show a specific meet place address

    public $defaultCssNoteColor; 	// Watch the SYNTAX when adding some more of those fields
    public $defaultCssNotePattern; 	// -> check (*21*) in delete/customcss.php
    public $defaultCssNoteTag; 		// -> check (*21*) in delete/customcss.php

    public $defaultCssTaskColor; 	//
    public $defaultCssTaskPattern; 	//
    public $defaultCssTaskTag; 		//

    public $defaultCssChatColor; 	//
    public $defaultCssChatPattern; 	//
    public $defaultCssChatTag; 		//

    public $defaultCssFileColor; 	//
    public $defaultCssFilePattern; 	//
    public $defaultCssFileTag; 		//

    public $defaultCssProductColor; 	// 
    public $defaultCssProductPattern; 	//
    public $defaultCssProductTag; 		//

    public $dailySMScredit; 		// protection against abuse, see (*cr10*)
    public $todaySMSremains; 		//
    public $dailyEMLcredit; 		//
    public $todayEMLremains; 		//
	
    public static $multilines = array( 
		'headline' => 1, 'note' => 1 
	);
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0
    );
    public static $defaults = array( 
		'cfgversion'	=> 0,
		
        'package' 			=> 16,	
        'profsector' 		=> 0,	
        'GMT' 				=> 3600,
        'name' 				=> 'New account',
        'headline' 			=> '',
        'color' 			=> 0,
        'pattern' 			=> 0,
        'tag' 				=> 0,
        'note' 				=> '',
        'weburl' 			=> '',
        'ccphone' 			=> '',
        'email' 			=> '',
        'language' 			=> 0,

        'visitorAlias' 		=> 200, // that is visitorAlias_patient, defined in language_basics.php that we do not want to mandatory include
        'smsSenderId' 		=> '',	
        'timeSlice' 		=> 2,	
        'durationShortest' 	=> 1,
        'durationSteps' 	=> 1,
        'durationLongest' 	=> 6,
        'notbefore' 		=> 8424222,
        'upperLeftDate' 	=> '0',
        'rangeIn' 			=> 32400,
        'rangeOut' 			=> 64800,
        'history' 			=> history_ever, 	
        'vipToggle' 		=> 0, 	
        'cssSuite' 			=> css_skin_standard, 
		
        // 'paymentStatus' 	=> contract_payment_ok, 
        // 'ePayProviderHandle'=> '010101010101',
		
        'ePayActive' 	=> 0, 
		
        'ePayBenefName' 	=> '', 
        'ePayBenefIBAN'		=> '',
        'ePayBenefBIC'		=> '',
		
        'ePayconiqKey'		=> '',
        'ePayMarketKey'		=> '',
		
		'ePayHardPayClientId'		=> '',
		'ePayHardPayClientSecret'	=> '',
		'ePayHardPayToken'			=> '',
	
		'ePaySoftPayClientId'		=> '',
		'ePaySoftPayClientSecret'	=> '',
		'ePaySoftPayAppId'			=> '',
		'ePaySoftPayToken'			=> '',
		
        'ePayComputopId' 	=> '', 
        'ePayComputopFish'	=> '',
        'ePayComputopHmac'	=> '',
		
        'ePayWebActive'	=> 0,
		
        'suspended' 		=> contract_service_ongoing, 		
        'stiFontSize' 		=> 0, 
        'mailToUsers' 		=> 0, 
        'sendSMSs' 			=> 0,
        'phoneRegion' 		=> 32,
        'phoneSlicing' 		=> 3,
        'defaultGender' 	=> gender_code_male,
        'bCalsName' 		=> resourceName_carerooms, 
        'uCalsName' 		=> resourceName_collaborators, 
        'fCalsName' 		=> resourceName_equipment,
        'defaultCssAppColor' 		=> 0,
        'defaultCssAppPattern' 		=> 0,
        'defaultCssAppTag' 		=> '',

        'defaultCssEventColor' 		=> 0,
        'defaultCssEventPattern' 	=> 0,
        'defaultCssEventTag' 	=> '',

        'defaultCssFcalColor' 		=> 0,
        'defaultCssFcalPattern' 	=> 0,
        'defaultCssFcalTag' 	=> '',

        'defaultCssVisitorColor' 	=> 0,
        'defaultCssVisitorPattern' 	=> 0,
        'defaultCssVisitorTag' 	=> '',

        'maxVisitors' 				=> 1,
        'cssLogging' 				=> 0,
        'usestandbylist' 				=> 0,
        'overdays' 					=> 0,
        'usetasks' 					=> 1,
        'usenotes' 					=> 1,
        'usechat' 					=> 0,
        'usefiles' 					=> 0,
        'useappaddress' 			=> 0,

        'defaultCssNoteColor' 		=> 0,
        'defaultCssNotePattern' 	=> 0,
        'defaultCssNoteTag' 		=> '',

        'defaultCssTaskColor' 		=> 0,
        'defaultCssTaskPattern' 	=> 0,
        'defaultCssTaskTag' 		=> '',

        'defaultCssChatColor' 		=> 0,
        'defaultCssChatPattern' 	=> 0,
        'defaultCssChatTag' 		=> '',

        'defaultCssFileColor' 		=> 0,
        'defaultCssFilePattern' 	=> 0,
        'defaultCssFileTag' 		=> '',

        'defaultCssProductColor' 	=> 0,
        'defaultCssProductPattern' 	=> 0,
        'defaultCssProductTag' 		=> '',
		
		'dailySMScredit' 	=> 200, // see (*cr10*)
		'todaySMSremains' 	=> 200,
		'dailyEMLcredit' 	=> 200,
		'todayEMLremains' 	=> 200
	
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
	public function cfgversion_increment() { 
		// Many users from different locations are connected to the same account //  see (*cv01*)
		// We experienced that one of them might change the configuration while others are busy using a given configuration
		// Example: User A deletes a custom css, while user B one minute thereafter creates an appointment pointing to the just deleted cssColor
		// So we came with cfgversion. This variable is monitored from clients side and automatic reload happens when the cfgversion number differs.
		$this->cfgversion++; 
		$this->save();
		return $this;
	}
	
	public function saveSoftPayToken($token = false) {
		if($token) $this->ePaySoftPayToken = $token;
		new Q('update groups SET ePaySoftPayToken = "'.$this->ePaySoftPayToken.'" where id = '.$this->id.';');    
	}
	public function saveHardPayToken($token = false) {
		if($token) $this->ePayHardPayToken = $token;
		new Q('update groups SET ePayHardPayToken = "'.$this->ePayHardPayToken.'" where id = '.$this->id.';');    
	}
    public static $explained = array( 
		'cfgversion'	=> 'configuration version, when client call the server, this version is compared with client version, if not matching, the client should reload the config',

        'id' 			=> 'unique id in the scope of C_dS_account instances.',	
        'package' 		=> '',	
        'profsector' 	=> '',	
        'GMT' 			=> 'timezone shift for this business location, expressed in seconds. eg 3600 is GMT+1',
        'name' 			=> 'account name. this is the name of a freelancer running the business or the business name or a combination of those.',
        'headline' 		=> '',
        'color' 		=> 'color id as per color.css definitions. E.g. 106 is for .c106',
        'pattern' 		=> 'pattern id as per color.css definitions. E.g. 902 is for .p902',
        'tag' 			=> 'tag id as per C_iSKIN.csstags in controls.js. E.g 3004 is for fa-building',
        'note' 			=> 'is a free note (left by Mobminder to the account user) that is visible in the upper right tooltip of the main screen.',
        'weburl' 		=> 'customer website url, like www.doctorwho.com',
        'email' 		=> 'any email sent from the system on behalf of this account has this email as reply email.',
        'language' 		=> 'account default language [english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8]',	

        'visitorAlias' 		=> 'visitor alias for this business [200:patient, 100:client, 150:participant].', 
        'smsSenderId' 		=> '',	
        'timeSlice' 		=> 'shortest duration for any event in this account, expressed as an integer hour deviser [1:1 hour, 2:30mn, 3:20mn, 4:15mn, 6:10mn, 12:5 minutes]',
        'durationShortest' 	=> 'shortest appointment duration, in number of this.timeSlice. If timeSlice is 3 and durationShortest is 2, than the shortest duration is 40 minutes for any appointment.',
        'durationSteps' 	=> 'where mutliple duration choices is displayed, they count from duration shortest and increment by dureationSteps slices',
        'durationLongest' 	=> 'where mutliple duration choices is displayed, the last duration displayed is durationLongest',
        'notbefore' 		=> '',
        'upperLeftDate' 	=> '',
        'rangeIn' 			=> 'earliest start time for any event in this account, expressed in seconds counted from midnight. eg: 32400 is 9am',
        'rangeOut' 			=> 'latest end time for any event in this account, expressed in seconds counted from midnight. eg: 72000 is 8pm',
        'history' 			=> '', 	
        'vipToggle' 		=> '', 	
        'cssSuite' 			=> '', 
		
        'ePayActive' 	=> 'recording of payments is active', 
        'ePayBenefName' => 'e payment mob QR code beneficiary name', 
        'ePayBenefIBAN'	=> 'e payment mob QR code beneficiary IBAN',
        'ePayBenefBIC'	=> 'e payment mob QR code beneficiary BIC',
        'ePayconiqKey'	=> 'e payment credential key for Payconiq api',
        'ePayMarketKey'	=> 'e payment credential key for MarketPay api',
		
		'ePayHardPayClientId'		=> 'ePayment credentials for terminal hardware',
		'ePayHardPayClientSecret'	=> 'ePayment credentials for terminal hardware',
		'ePayHardPayToken'			=> 'ePayment credentials for terminal hardware',
	
		'ePaySoftPayClientId'		=> 'ePayment credentials for SoftPOS',
		'ePaySoftPayClientSecret'	=> 'ePayment credentials for SoftPOS',
		'ePaySoftPayAppId'			=> 'ePayment credentials for SoftPOS',
		'ePaySoftPayToken'			=> 'ePayment token for SoftPOS curl calls',
		
        'ePayComputopId' 	=> 'ePayment credentials Computop e-commerce user id', 
        'ePayComputopFish'	=> 'ePayment credentials Computop e-commerce password',
        'ePayComputopHmac'	=> 'ePayment credentials Computop e-commerce HMAC Authentication',
		
        'ePayWebActive'	=> 'bitmap indicating which payment service is active for online resa & payment',
		
        'suspended' 		=> '',
        'stiFontSize' 		=> 'font size in stickers on the graphical planning display', 
        'mailToUsers' 		=> '', 
        'sendSMSs' 			=> 'When set to zero, the account is silent and does not send any communication (SMS nor emails nor notifications)',
        'phoneRegion' 		=> 'International Country Code as defined by ITU',
        'phoneSlicing' 		=> 'Display phone numbers by group of 2 or 3 digits, depending on local habits. Allowed values: [2,3].',
        'defaultGender' 	=> 'when setting up a new C_dS_visitor instance, unless more pertinent information is received, gender defaults to [0: female, 1:male]',
        
		'bCalsName' 		=> 'resource alias name for C_dS_resource where resourceType = 2, see instructions', 
        'uCalsName' 		=> 'resource alias name for C_dS_resource where resourceType = 1, see instructions', 
        'fCalsName' 		=> 'resource alias name for C_dS_resource where resourceType = 3, see instructions',
        
		'defaultCssAppColor' 		=> 'default color for appointment, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssAppPattern' 		=> 'default pattern for appointment, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssAppTag' 			=> 'default tag for appointment, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssEventColor' 		=> 'default color for events, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssEventPattern' 	=> 'default pattern for events, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssEventTag' 		=> 'default tag for events, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssFcalColor' 		=> 'default color for facultative reservations, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssFcalPattern' 	=> 'default pattern for facultative reservations, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssFcalTag' 		=> 'default tag for facultative reservations, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssVisitorColor' 	=> 'default color for visitors, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssVisitorPattern' 	=> 'default pattern for visitors, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssVisitorTag' 		=> 'default tag for visitors, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'maxVisitors' 				=> '',
        'cssLogging' 				=> '',
        'usestandbylist' 			=> 'account uses standby list feature. C_dS_reservation can be tagged as being on standby list.',
        'overdays' 					=> 'C_dS_reservation in this account can span over different or multiple calendar days',
        'usetasks' 					=> 'account uses tasks feature.',
        'usenotes' 					=> 'account uses notes feature.',
        'usechat' 					=> 'account uses chat feature.',
        'usefiles' 					=> 'account uses files storage system for C_dS_visitor record.',
        'useappaddress' 			=> 'appintments might happen in antoher location than the business premises',

        'defaultCssNoteColor' 		=> 'default color for notes, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssNotePattern' 	=> 'default pattern for notes, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssNoteTag' 		=> 'default tag(s) for notes, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssTaskColor' 		=> 'default color for tasks, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssTaskPattern' 	=> 'default pattern for tasks, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssTaskTag' 		=> 'default tag(s) for tasks, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssChatColor' 		=> 'default color for chats, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssChatPattern' 	=> 'default pattern for chats, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssChatTag' 		=> 'default tag(s) for chats, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultCssFileColor' 		=> 'default color for files, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssFilePattern' 	=> 'default pattern for files, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultCssFileTag' 		=> 'default tag(s) for files, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',

        'defaultProductFileColor' 		=> 'default color for products, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultProductFilePattern' 	=> 'default pattern for products, is either 0 or the id of a C_dS_customcss instance (e.g 17648)',
        'defaultProductFileTag' 		=> 'default tag(s) for products, is either \'\' or one id or id\'s of a C_dS_customcss instance(s) separated by ! (e.g 17648!17698!17647)',
		
		'dailySMScredit' 	=> 'daily SMS credit.', // see (*cr10*)
		'todaySMSremains' 	=> 'this counter is decremented each time an SMS leaves for this account. when alert email was sent, the value is set to -1.',
		'dailyEMLcredit' 	=> 'daily emails credit.',
		'todayEMLremains' 	=> 'this counter is deincremeted each time an email leaves for this account. when alert email was sent, the value is set to -1.'
    );
    public static $AIinstructions = array( 
		'C_dS_account' => 'is the root parent object for all other account configuration objects.',
		// 'bCalsName, uCalsName, fCalsName' => 'accounts can make use of 3 different types of resource [bCals:2, uCals:1, fCals:4], each type C_dS_resources is appropriately aliased according to nature of business. possible names: [0:resources,10:work rooms,20:work place,30:care rooms,40:collaborators,50:assistants,60:doctors,70:technicians,80:equipement,90:offices,100:tools,110:cars]',
		'email' => 'account business email. when asked for a contact email, you always provide this email, NEVER a C_dS_collaborator\'s email.',
	);
    	

}
class C_dS_resource extends C_dbTrackingCCD {	// group to an account
    public function getTableName() { return  'resources'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    public $resourceType;
    public $name;
    public $color;	
    public $tag;	
    public $reservability;	
    public $offsetBefore;	// is an integer number of time slice
    public $offsetAfter;	
    public $displayOrder;
    public $note; 	// ISO 9001 note, should appear as tip when mouse pointer goes over resource name
    public $signature; 	// 
    public $sendComms; 	// Default value for sending sms and emails, proper setting for this resource (only for bCals)
    public $guideId;	// bigint20 unique id to a dS_guideline, defaults to zero when no guideline is associated with this resource
    public static $multilines = array( 
        'note' => 1
	);
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'resourceType' 		=> class_bCal,
        'name' 				=> '',
        'color' 	 	 	=> 264,
        'tag' 	 	 		=> 0,
        'reservability'  	=> reservability_scheduled, // PVH 2025: this is the only one used all across our customers, was developped for Mazuin in 2008
        'offsetBefore' 	 	=> 0,
        'offsetAfter' 	 	=> 0,
        'displayOrder' 	 	=> 0,
        'note' 				=> '',
        'signature' 		=> '',
        'sendComms' 		=> 1,
        'guideId' 	 		=> 0 // links to a guideline record
    );
    public function getDefaults() { return self::$defaults; }	
    public static $explained = array( 
        'id' 			=> 'unique id in the scope of C_dS_resource instances.',	
		'groupId'		=> 'id of the parent C_dS_account instance.',
        'resourceType' 		=> 'type of the planning resource [2 for business agenda lines, 1 for staffing lines, 4 for facultative resources].',
        'name' 				=> 'calendar name',
        'color' 	 	 	=> 'a css identifier giving the color to this agenda line. e.g. 162 corresponds to class .c162 in /themes/default/colors.css.',
        'tag' 	 	 		=> 'a css identifier giving the tag to this agenda line. e.g. 4022 corresponds to fa-users-class in controls.js::C_iSKIN.csstags.',
        'reservability'  	=> 'applies to type 4 only.',
        'offsetBefore' 	 	=> 'used in combitnation with reservability.',
        'offsetAfter' 	 	=> 'used in combitnation with reservability.',
        'displayOrder' 	 	=> 'unused.',
        'note' 				=> 'resource note as displayed.',
        'signature' 		=> 'when defined, replaces the resource name in communications.',
        'sendComms' 		=> 'disables or enables sending sms and emails for this resource appointments.',
        'guideId' 	 		=> 'Contains the id of a C_dS_guideline. Guidelines help call center operators and AI with specific instructions to be followed during conversations.',
        'remoteId' 	 		=> 'when defined in the sync login, the correlator value is given here as remoteId.'
    );
    	
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream($tracking, $sep, $flds); }
    public static function remove($resourceId) {

        $dS_resource = new C_dS_resource($resourceId);
        $accId = $dS_resource->groupId;		
        $resourceType = $dS_resource->resourceType;

		// reservations
		//
        C_dS_reservation::removeResource($resourceId);
        C_dS_reservation::removeResource($resourceId, 'archive_');

		// config classes that refer to resources
		//
        // C_dS_cToggle::removeResource($resourceId, $resourceType); included in C_dS_reservation::removeResource
        C_dbAccess_emailTemplates::removeResource($accId, $resourceId);
        C_dbAccess_smsTemplates::removeResource($accId, $resourceId);

        C_dbAccess_xmon_actuals::removeResource($resourceId);

        $o_dbAccess_accesskey = new C_dbAccess_accesskey();
        $o_dbAccess_accesskey->removeFromAllViews($accId, $dS_resource); // all the keys (whatever which login) associated with this account are selected	

        new Q('DELETE FROM workexperts WHERE resourceId = '.$resourceId.';'); // (*wc33*) PVH 2021 - this is wrong, when the last expert gets deleted here we end up with an orphan workcode
        new Q('delete FROM synchro_resources WHERE localId = "'.$resourceId.'";');

		// Hourlies users
		$dbAccess_hourliesusers = new C_dbAccess_hourliesusers($resourceId); // hourliesusers group to a resourceId
		$dbAccess_hourliesusers->deleteAll_hourlyUsers(); //


        $dS_resource->dSdelete();
    }
}
class C_dS_guidelines extends C_dbTrackingCC { // group to an account
    public function getTableName() { return  'guidelines'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $address;
    public $zipCode;	
    public $city;	
    public $country;
    public $email;	
    public $mobile; 
    public $phone; 		
    public $language; 
    public $registration;
    public $directions;
    public $newvisi;
    public $appguide;
    public $reqguide;
    public $neverdo;
    public $tipstricks;
    public static $multilines = array( 	
        'directions' 	=> 1,
        'newvisi' 		=> 1,
        'appguide' 		=> 1,
        'reqguide' 		=> 1,
        'neverdo' 		=> 1,
        'tipstricks' 	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name' 			=> '',	
        'address' 		=> '',
        'zipCode' 		=> '',	
        'city' 			=> '',	
        'country' 		=> '',
        'email' 		=> '',	
        'mobile' 		=> '', 
        'phone' 		=> '', 		
        'language' 		=> 0, 
        'registration' 	=> '',
        'directions' 	=> '',
        'newvisi' 		=> '',
        'appguide' 		=> '',
        'reqguide' 		=> '',
        'neverdo' 		=> '',
        'tipstricks' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    H O U R L I E S ,  S H A D O W S   &    T I M E    B O X E S
//
define('shadow_normal', 0);
define('shadow_except', 1);
define('shadow_block', 	2);
define('shadow_offday', 5);

class C_dS_hourly extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'hourlies'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $monday;			// time stamp: referential monday for availabilities periodicity
    public $periodicity;	// number of weeks that makes an availabilities period
    public $note;
    public $colorOff;
    public $colorExcp;
    public $colorAbsent;
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        // 'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name' 			=> '',
        'monday' 	 	=> 0,
        'periodicity' 	=> 1, // is a number of weeks. 0 when this hourly is a single day exceptional hourly change
        'note' 			=> '',
        'colorOff' 	 	=> color_code_norm,
        'colorExcp' 	=> color_code_excp,
        'colorAbsent' 	=> color_code_event
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
    public static $explained = array( 
		'name'			=> 'free text name chosen by user at creation',
        'monday' 		=> 'applicable for periodicity [2,3,4 weeks], indicates which monday is week 1 monday',
        'periodicity' 	=> 'for running hourlies, periodicity can be 1, 2, 3, or 4 weeks. Periodicity 0 indicates a one day exceptional hourly.',
        'note' 			=> 'free text note from user',
		'colorOff' 		=> 'css color code for closed days in this hourly',
		'colorExcp' 	=> 'css color code for exceptional working time in this hourly',
		'colorAbsent' 	=> 'css color code for non working time in this hourly, applies also for morning and evening off time spans'
    );
    	
	public function setstringtimeformat($utc=false) {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($this->monday) $this->monday = Date('Y-m-d H:i',$this->monday);
		return $this;
	}
	public function purge($account_resources, $perfReport) { // hourly id, it gets deleted if not in use anymore. Other husers are offered a replacement hourly.
		
		global $nl;
		$hid = $this->id;
		$rscIds = $account_resources->getIdsList(''); // returns an array, all C_dS_resource ids in this account
		$accountId = $this->groupId;

			$q2 = new Q('select id from hourlies where groupId = '.$accountId.' and periodicity <> 0;'); // exceptional days are ignored (zero periodicity)
		$hlIds = $q2->ids();

		$perfReport->peak('::done with loading resources and recurrent hourlies '.$q2->cnt().' hourlies loaded');


			$q3 = new Q('select groupId, hourlyId, dayIn from hourliesusers where hourlyId in('.$hlIds.') order by dayIn desc;');


		$rscHourlies = Array();
		foreach($rscIds as $rid) $rscHourlies[$rid] = Array();
		while($row = $q3->result->fetch_array()) { // sort out hourlies by account resource
			$rscId 		= $row['groupId'];
			$hourlyId 	= $row['hourlyId'];
			$dayIn 		= $row['dayIn'];
			$rscHourlies[$rscId][$dayIn] = $hourlyId;
		}

		$perfReport->peak('::done with loading hourliesusers '.$q3->cnt().' hourlies loaded');


		$stillInUse = 0;
		$replacements = Array(); // have a replacement hourlyId for each usage found of the hourly under deletion
		foreach($rscIds as $rid) {
			$hourlies = $rscHourlies[$rid]; // downscope to a single resource
			if(!count($hourlies)) { $replacements[$rid] = 0; continue; } // in this case, the default hourly will be displayed
			foreach($hourlies as $hourlyId) { if($hourlyId==$hid) $stillInUse = 1; else $replacements[$rid] = $hourlyId; break; } // we check only the youngest activated hourly id
			if($stillInUse) break; // no need to check further, we now know that this hourly is still in use
		}
		if($stillInUse) {
			echo 'This hourly is still in use, it cannot be deleted'.$nl;
			return false; // ('This hourly is still in use, it cannot be deleted');
		}

			
		$users = Array(); // identify which resources have used the hourly under deletion
		foreach($rscIds as $rid) {
			$hourlies = $rscHourlies[$rid];
			if(!count($hourlies)) continue;
			$used = false;
			foreach($hourlies as $hourlyId) { if($hourlyId==$hid) { $used = true; break; } } // we check only the youngest activated hourly id
			if($used) $users[$rid] = $rid;
		}

		echo $nl;
		foreach($rscIds as $rid)
			echo 'r='.$rid.' repl:'.$replacements[$rid].$nl;


		$perfReport->peak('::done with finding hourliesusers');

			
		if(count($users)) foreach($users as $rid) {
			$r = $replacements[$rid];
			$q = new Q('update hourliesusers set hourlyId = '.$r.' where hourlyId = '.$hid.' and groupId = '.$rid.';'); // hourliesusers group to resources
			$perfReport->peak('::done with updating hourliesusers, '.$q->hits().' items adapted');
		}


		///////////////////////////////////////////////////////////
		//
		// Step 2 - Delete meta data

		$q = new Q('delete from shadows where groupId = '.$hid.';');
		$perfReport->peak('::done with clean up from shadows, '.$q->hits().' items removed');

		$q = new Q('delete from timeboxes where groupId = '.$hid.';');
		$perfReport->peak('::done with clean up from timeboxes, '.$q->hits().' items removed');


		///////////////////////////////////////////////////////////
		//
		// Step 3 - Delete hourly data set

		$q = new Q('delete from hourlies where id = '.$hid.';');
		$perfReport->peak('::done with clean up from hourlies, '.$q->hits().' item removed');

		return true;
	}
}

class C_dS_shadow extends C_dbID { // group to an hourly
    public function getTableName() { return  'shadows'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $cueIn;
    public $cueOut;
    public $dayCode;		// ISO 8601 numeric representation of the day of the week:  1 for monday, 7 for sunday
    public $exceptional;	// see constants definition here below
    public static $multilines = false;
    public static $defaults = array( 	
        'cueIn' 		=> 36000,	
        'cueOut' 		=> 82800,
        'dayCode'		=> 7, // ISO 8601 numeric representation of the day of the week:  1 for monday, 7 for sunday
        'exceptional' 	=> shadow_normal
    );
    public function getDefaults() { return self::$defaults; }
    public function setAMshadow($o_dS_group) { 
        $this->cueIn = 0;
        $this->cueOut = $o_dS_group->rangeIn;
    }
    public function setPMshadow($o_dS_group) { 
        $this->cueIn = $o_dS_group->rangeOut;
        $this->cueOut = 86400;
    }	
    public static $explained = array( 
		'groupId'	=> 'group to an hourly (just like timeboxes) but refer to a "non working time span"',
        'cueIn' 	=> 'starting cue for this shadow instance ranging [0 to 86400-(1 slice)]. Is a number of seconds, multiple of account time slice.',
        'cueOut' 	=> 'ending cue for this shadow instance [(1 slice) to 86400]. Is a number of seconds, multiple of account time slice.',
        'dayCode' 	=> 'applicable day code. Ranges [1 is monday to 7 is sunday]',
		'exceptional' => 'Indicates the shadow type: [0:shadow_normal, 1:shadow_except, 5:shadow_offday ].'
    );
    	

}
class C_dS_hourlyuser extends C_dbTrackingCCD  { // group to a resource Id
    public function getTableName() { return  'hourliesusers'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $hourlyId;
    public $dayIn;
    public static $multilines = false;
    public static $defaults = array( 	
        'hourlyId' 	=> 0,
        'dayIn' 	=> 0, 
    );
    public function getDefaults() { return self::$defaults; }
    public static $explained = array( 
		'groupId'	=> 'group to a resourceId. Indicates which resource this hourly is applicable to.',
        'hourlyId' 	=> 'unique id of a C_dS_hourly instance. Indicates which hourly is used from dayIn for the given resource.',
        'dayIn' 	=> 'First date of applicable hourly. Timestamp format [YYYY-MM-DD 00:00] (bigint in mob DB)',
    );
    
	public function setstringtimeformat($utc=false) {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($this->dayIn) $this->dayIn = Date('Y-m-d H:i',$this->dayIn);
		return $this;
	}
	public function getdaycode($dS_hourly) {
		$datein = new C_date($this->dayIn);
		$daycode = $datein->getDayCode($dS_hourly->monday, $dS_hourly->periodicity);
		return $daycode;
	}
	
}
class C_dS_timeboxing extends C_dbTrackingCCD { // group to an account
    public function getTableName() { return  'timeboxings'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    public $name;
    public $color;
    public $pattern;
    public $tag;
    public $note;
    public $exclusive;
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        // 'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0
    );
    public static $defaults = array( 
        'name' 		=> '',
        'color' 	=> 0,
        'pattern' 	=> 0,
        'tag' 		=> 0,
        'note'  	=> '',
        'exclusive' => 0
    );
    public function getDefaults() { return self::$defaults; }	
    public static $explained = array( 
		'id'		=> 'unique id of this instance [*1].',
		'groupId'	=> 'group to the account id.',
        'name' 		=> 'free text name for this timeboxing (setup in /account setup/performances/time boxing)',
        'color' 	=> 'technical name for the color (links to a css rule)',
        'pattern' 	=> 'technical name for the pattern (links to a css rule)',
        'tag' 		=> 'technical name for the tag (links to a css rule)',
        'note'  	=> 'free text note',
        'exclusive' => 'when used in combination with search assistant, this timeboxing must be specified or will be avoided [0 or 1]'
    );
    	
}
class C_dS_timebox extends C_dbID { // group to an hourly (like shadows) but refer to a timeboxing (that is their category, defining color and pattern)
    public function getTableName() { return  'timeboxes'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $timeboxingId;
    public $cueIn;
    public $cueOut;
    public $dayCode;		// ISO 8601 numeric representation of the day of the week:  1 for monday, 7 for sunday
    public static $multilines = false;
    public static $defaults = array( 
        'timeboxingId' 	=> 0,	
        'cueIn' 		=> 82800,	
        'cueOut' 		=> 82800,
        'dayCode'		=> 7 // ISO 8601 numeric representation of the day of the week:  1 for monday, 7 for sunday
    );
    public function getDefaults() { return self::$defaults; }
    public static $explained = array( 
		'groupId'		=> 'group to an hourly (just like shadows) but refer to a timeboxing indication.',
        'timeboxingId' 	=> 'refers to a C_dS_timeboxing instance id [*1], timeboxing define their name color and pattern.',
        'cueIn' 	=> 'starting cue for this timebox instance ranging [0 to 86400-(1 slice)]. Is a number of seconds, multiple of account time slice.',
        'cueOut' 	=> 'ending cue for this timebox instance [(1 slice) to 86400]. Is a number of seconds, multiple of account time slice.',
        'dayCode' 	=> 'applicable day code. Ranges [0 to 6]. 0 = sunday. 6 = saturday.'
    );
    	
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C O N T R A C T S  
//

define('contract_payment_nok'	, 0);
define('contract_payment_ok'	, 1);

define('contract_eInvoicing_none'	, 0);
define('contract_eInvoicing_email'	, 1);

define('contract_ePayment_none'	 , 0);
define('contract_ePayment_bank'	 , 1);
define('contract_ePayment_visa'	 , 2);
define('contract_ePayment_master', 3);

define('contract_service_ongoing', 0);
define('contract_service_suspended', 1);

define('contract_tax_rate_0'	, 0);
define('contract_tax_rate_21'	, 2100);
define('contract_tax_rate_3'	, 0);
define('contract_tax_rate_4'	, 0);

class C_dS_contract extends C_dbTrackingCC { // group to an account
    public function getTableName() { return  'contracts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
        return parent::__construct($id, $groupId, $preset); 
    }

    // invoicing coordinates
    public $invname;
    public $register;	// commercial register
    public $invaddress;
    public $invzip;
    public $invcity;
    public $invcountry;

    // contact person coordinates
    public $gender;
    public $firstname;
    public $lastname;	
    public $address;
    public $zipCode;	
    public $city;	
    public $country;
    public $email;	
    public $mobile; 
    public $phone; 		
    public $language; 

    // invoicing parameters
    public $valuedate;	// invoicing is generated on this date

    public $ifrequency;	// automatic bill creation frequency
    public $eInvoicing;	// customer has chosen eInvoicing option

    public $ePayment;	// customer has chosen ePaiment option
    public $eFrequency; // frequency of ePayment

    public $fee;		// definitive fee
    public $exCredit;	// number of months of credit
    public $exFee;		// fee during the credit period
    public $rate;		// tax rate
    public $note;

    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'creation' 		=> 0, 
        'register' 		=> 'RC 000 000', 
        'tax' 			=> 'BE 000 000 000', 
        'ePayment' 		=> contract_ePayment_none, 
        'eInvoicing' 	=> contract_eInvoicing_none, 
        'fee' 			=> 150, 
        'exCredit' 		=> 0, 
        'exFee' 		=> 135, 
        'rate' 			=> contract_tax_rate_21,
        'gender' 		=> gender_code_male,
        'firstname' 	=> '',
        'lastname' 		=> '',	
        'address' 		=> '',
        'zipCode' 		=> '',	
        'city' 			=> '',	
        'country' 		=> '',
        'email' 		=> '',	
        'mobile' 		=> '', 
        'phone' 		=> '', 		
        'language' 		=> 0, 
        'registration' 	=> '', 
        'note' 			=> 'note'
    );
    public function getDefaults() { return self::$defaults; }

}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C U S T O M    C S S  
//

define('color_code_norm'	, 97);
define('color_code_excp'	, 98);
define('color_code_event'	, 99);


// generaly named by $cssType
define('class_cssType_color'		, 80);	
define('class_cssType_pattern'		, 81);
define('class_cssType_tag'			, 82);


class C_dS_customCss extends C_dbTrackingCCD { // group to an account
    public function getTableName() { return  'custom_css'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    public $resaClass; // can be one of class_resa_*
    public $cssType; // can be pattern or color or tags
    public $name;
    public $css;	
    public $ctrlshift; 	
    public $note; 
    public static $multilines = array(
        'note' 			=> ''
    );
    public static $prepared = array(
        // 'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0
    );
    public static $defaults = array( 
        'resaClass' => class_resa_appointment, // with time, this parameter has been used for visitors, chat, note, taks and so the name RESAclass is not pertinent anymore, think of changing!
        'cssType' 	=> class_cssType_color,
        'name' 		=> '',
        'css' 		=> 264,
        'ctrlshift'  	=> 0, // 1 for Ctrl, 2 for Shift, 3 for Ctrl + Shift. Then this customCss is applied to planning sticker when clicked with special key  down. see (*cc00*)
        'note'  	=> ''
    );
    public function getDefaults() { return self::$defaults; }	
    public function getName() { return $this->label(); }
	
    public static $explained = array( 
        'resaClass' => 'indicates that this skinning is aimed for [visitors:3, reservations:13, appointments:11, offdays:12, notes:14, tasks:15, chats:16, files:17]',
        'cssType' 	=> 'indicates the type of skinning [color:80, pattern:81, tag:82]',
        'name' 	 	=> 'a free text name for the custom Css',
        'css'  		=> 'technical name for the css (links to a css rule)',
        'css'  		=> 'technical name for the css (links to a css rule)',
        'ctrlshift' => '1 for Ctrl, 2 for Shift, 3 for Ctrl + Shift. Then customCss is applied to a planning sticker when clicked with special key down. see (*cc00*)',
        'remoteId' 	=> 'when defined in the sync login, the correlator value is given here as remoteId'
    );
    	
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    V I S I T O R S   
//

define('pref_notBefore_urgent'			,200);
define('pref_notBefore_nextWeek'		,201);
define('pref_notBefore_oneWeek'			,202);
define('pref_notBefore_twoWeeks'		,203);
define('pref_notBefore_threeWeeks'		,204);
define('pref_notBefore_nextMonth'		,205);
define('pref_notBefore_oneMonth'		,206);
define('pref_notBefore_twoMonths'		,207);
define('pref_notBefore_threeMonths'		,208);
define('pref_notBefore_sixMonths'		,209);
define('pref_notBefore_specificDate'	,255);


define('gender_code_other'	,7); // value as stored in DB
define('gender_code_girl'	,6);
define('gender_code_boy'	,5);
define('gender_code_miss'	,4);
define('gender_code_sprl'	,3);
define('gender_code_sa'		,2);
define('gender_code_male'	,1);
define('gender_code_female'	,0);

define('VIP_yes',1);
define('VIP_no'	,0);


class C_dS_visitor extends C_dbTrackingCCD { // group to an account
    public function getTableName() { return 'visitors'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
		// C_dS_visitor::prepare();
		parent::__construct($id, $groupId, $preset);
	}
    public $mergedTo;
    public $prefNotBefore;
    public $prefAMPM;
    public $vip; // to be recycled, not used anywhere in the SW
    public $gender; // see (*gc01*)
    public $firstname;
    public $lastname;	
    public $company; 	// IMPORTANT! when changing fields names in here, keep in mind that table catalysts records some fields names!
    public $address;
    public $residence;
    public $zipCode;	
    public $city;	
    public $country;
    public $email;	
    public $mobile; 
    public $phone; 		
    public $language; 
    public $birthday; 
    public $registration; // Can be plate number or any folder identification number
    public $reference;
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $selection;
	
	// public static function prepare() {
		// $rr = C_dS_visitor::$prepared;
		// if($rr['select']) return false;
		// echo 'We have to setup prepared functions by here<br/>'.chr(10);
		// $rr = C_dbID::mysqlprepare($rr);
	// }
	
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $defaults = array( 
        'mergedTo'		=> 0,
        'prefNotBefore' => pref_notBefore_urgent,
        'prefAMPM' 		=> 0x00FFFF00,
        'vip' 			=> VIP_no,
        'gender' 		=> gender_code_male,
        'firstname' 	=> '',
        'lastname' 		=> '',	
        'company' 		=> '',
        'address' 		=> '',
        'residence' 	=> '',
        'zipCode' 		=> '',
        'city' 			=> '',	
        'country' 		=> '',
        'email' 		=> '',	
        'mobile' 		=> '', 
        'phone' 		=> '', 		
        'language' 		=> 0, 
        'birthday' 		=> 0,  
        'registration' 	=> '',
        'reference' 	=> '',
        'note' 			=> '',
        'cssColor' 		=> 0,
        'cssPattern' 	=> 0,
        'cssTags' 		=> '',
        'selection' 	=> 0 // used on visitor ac feedback stream to identify visitors already planned on the given time span (*v01*)
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->lastname; }
    public function getFullName() { return trim($this->firstname.' '.$this->lastname); }	// PVH 2024 - also used by AI api
    public function getInfo() {
        $mobile = $this->mobile ? ' (+'.$this->mobile.')' : '' ;
        return $this->lastname.', '.$this->firstname.$mobile;
    }
    public function getNote() {
        if($this->note == '') return false;
        return $this->lastname.':'.$this->note;
    }

    public function mergeTo($id = false, $dS_group = false, $dS_visitor = false) { 
		
		// where id is the id of another dS_visitor, if not given, the attribute '->mergeTo' can also be specified in the dS
		//
		// So, there are 2 ways to provide the instance of the remaining dS_visitor instance.
		// 1. Only its id. 
		// 2. If you do not provide the id, you MUST provide an additional member ($this->mergeTo->id)
		// 3. If you provide the id of the target instance, you may also provide the instance if you have it available (the 3rd argument).
		//
		// Finally, if the calling script has the $dS_group available (which is generaly the case), providing the dS_group instance relieves the function from having to recreate it. 

		// note that appropriate indexes had to be added to the DB tables to let this script performance increase from 220ms down to 15ms (PVH 2019)

        if(!$id) { // then the calling process has defined $this->mergeTo as a C_dS_visitor // see (*dr01*)
            if(!isset($this->mergeTo)) return; // you have not given any id and have no mergeTo attribute either
            $id = $this->mergeTo->id; 
            unset($this->mergeTo);
        }

		$accountid = $this->groupId;
		if(!$dS_group) $dS_group = new C_dS_group($accountid);
		if(!$dS_visitor) $dS_visitor = new C_dS_visitor($id); // this is the merged instance
		
		
		$thisaccount = ' and groupId = '.$accountid;

        if($id==$this->id) return;
        $q = new Q('select id from visitors where id='.$id.$thisaccount.' and deletorId = 0;');
        if(!$q->ids()) return; // the provided $id is from another account or does not exists or is deleted already


        // change  attendees
		//
		$t = new Q('select att_visitors.id from att_visitors join reservations on reservations.id = att_visitors.groupId where reservations.groupId = '.$accountid.' and att_visitors.resourceId = '.$this->id.';');
		$do = $t->ids();
        if($do) {
			new Q('UPDATE att_visitors SET resourceId = '.$id.' WHERE att_visitors.id in ('.$do.');');

				$p = new Q('select performances.id from performances join reservations on reservations.id = performances.groupId where reservations.groupId = '.$accountid.' and performances.visitorId = '.$this->id.';');
				$perfs = $p->ids();
			if($perfs) new Q('UPDATE performances SET visitorId = '.$id.' WHERE id in ('.$perfs.');');
		}
		
		$t = new Q('select archive_att_visitors.id from archive_att_visitors join archive_reservations on archive_reservations.id = archive_att_visitors.groupId where archive_reservations.groupId = '.$accountid.' and archive_att_visitors.resourceId = '.$this->id.';');
		$do = $t->ids();
        if($do) {
			new Q('UPDATE archive_att_visitors SET resourceId = '.$id.' WHERE id in ('.$do.');');
			
				$p = new Q('select archive_performances.id from archive_performances join archive_reservations on archive_reservations.id = archive_performances.groupId where archive_reservations.groupId = '.$accountid.' and archive_performances.visitorId = '.$this->id.';');
				$perfs = $p->ids();
			if($perfs) new Q('UPDATE archive_performances SET visitorId = '.$id.' WHERE id in ('.$perfs.');');
		}


        // references in notes and tasks
		
		if($dS_group->usenotes) {
			new Q('UPDATE note_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
			new Q('UPDATE archive_note_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
		}

		if($dS_group->usetasks) {
			new Q('UPDATE task_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
			new Q('UPDATE archive_task_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
		}

		if($dS_group->usechat) {
			new Q('UPDATE chat_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
			new Q('UPDATE archive_chat_visirefs SET visiId = '.$id.' WHERE visiId = '.$this->id.';');
		}

        // reference in files
		if($dS_group->usefiles) {
			new Q('UPDATE files SET visitorId = '.$id.' WHERE visitorId = '.$this->id.$thisaccount.';');
		}

        // communication disablers
		
		$q = new Q('select id from templates_sms where target = '.reminder_target_visitor.$thisaccount.';');
		$ids = $q->ids();
        if($ids) new Q('UPDATE comm_toggles SET resourceId = '.$id.' where msgMedium = '.msg_medium_SMS.' AND templateId IN('.$ids.') AND resourceId = '.$this->id.$thisaccount.';');
		
		
		$q = new Q('select id from templates_email where target = '.reminder_target_visitor.$thisaccount.';');
		$ids = $q->ids();
        if($ids) new Q('UPDATE comm_toggles SET resourceId = '.$id.' where msgMedium = '.msg_medium_email.' AND templateId IN('.$ids.') AND resourceId = '.$this->id.$thisaccount.';');
					
		
		// record the merge
        $this->mergedTo = $id;

		// gather all previous merge to the last official remaining item
        $q = new Q('select id from visitors where groupId='.$accountid.' and mergedTo='.$this->id.';'); // select items that were previously merged to the item under deletion
        $ids = $q->ids();
        if($ids) new Q('UPDATE visitors set mergedTo='.$id.' where id in('.$ids.');'); // let all previously merged items point to the remaining genuine instance
        $this->dSobsolete();
		
		
		// gather data from the obsolete version that might be absent from the to keep version
		$enriched = false;
		if($this->note) { $dS_visitor->note .= '\n\n'.$this->note; $enriched = true; }
		if($this->company) 		if(!$dS_visitor->company) 		{ $dS_visitor->company = $this->company; $enriched = true; }
		if($this->address) 		if(!$dS_visitor->address) 		{ $dS_visitor->address = $this->address; $enriched = true; }
		if($this->residence) 	if(!$dS_visitor->residence) 	{ $dS_visitor->residence = $this->residence; $enriched = true; }
		if($this->zipCode) 		if(!$dS_visitor->zipCode) 		{ $dS_visitor->zipCode = $this->zipCode; $enriched = true; }
		if($this->city) 		if(!$dS_visitor->city) 			{ $dS_visitor->city = $this->city; $enriched = true; }
		if($this->country) 		if(!$dS_visitor->country) 		{ $dS_visitor->country = $this->country; $enriched = true; }
		if($this->email) 		if(!$dS_visitor->email) 		{ $dS_visitor->email = $this->email; $enriched = true; }
		if($this->mobile) 		if(!$dS_visitor->mobile) 		{ $dS_visitor->mobile = $this->mobile; $enriched = true; }
		if($this->phone) 		if(!$dS_visitor->phone) 		{ $dS_visitor->phone = $this->phone; $enriched = true; }
		if($this->birthday) 	if(!$dS_visitor->birthday) 		{ $dS_visitor->birthday = $this->birthday; $enriched = true; }
		if($this->registration) if(!$dS_visitor->registration) 	{ $dS_visitor->registration = $this->registration; $enriched = true; }
		if($this->reference) 	if(!$dS_visitor->reference) 	{ $dS_visitor->reference = $this->reference; $enriched = true; }
		if($enriched) $dS_visitor->dSsave(); // see (*dr02*)
		
    }
	public function findclone() {
		
		return false;
	}
	public function setLnLevenshtein($guess) {
		
		$this->LNlev = levenshtein($this->lastname,$guess);
		return $this;
	}
	public function setFnLevenshtein($guess) {
		
		$this->FNlev = levenshtein($this->firstname,$guess);
		return $this;
	}

	public function setAIformats($dS_group) {
		
		// Phone numbers:
		//
		$phoneregion = $dS_group->phoneRegion; // like "32" or "352"
		$prl = strlen($phoneregion);
		$this->mobile = trim($this->mobile);
		if($this->mobile) { // they have a rigid input format, like '32493655599', no space, no heading + when arriving from DB
			
			$this->mobile = mobileAIformat($this->mobile, $phoneregion);
			
		}
		
		$this->phone = trim($this->phone);
		if($this->phone) { // the treatment is different here because the phone number do not have a rigid input format (like we have for mobiles)
			$ml = strlen($this->phone);
			if($ml>=6) {
				// head : for local numbers, remove the CC code with a trunk, for outside the local phone region, highlight the CC
				if(substr($this->phone,0,1)=='+') $this->phone = substr($this->phone,1,--$ml); // decrements also $ml as we remove the heading '+'.
				if(substr($this->phone,0,1)=='0') { // the number is alreay formated as '02 662 1800' with a heading trunk. We do not change that.
					
				}
				else {
					if(substr($this->phone,0,$prl)==$phoneregion) { // the phone starts with a CC ( country code ), let's replace it with a trunk zero that people use to see.
						$this->phone = '0'.substr($this->phone,-((strlen($this->phone)-$prl))); // remove the starting 2 or 3 CC code digits and replace them with a zero
					} else { // that phone is outside the account's local phone region, we keep and highlight the CC
						$plus = '+'.$this->phone;
						$ccd = CCdigits($plus); // defined in dbio.php, it returns how many digits are un in the CC. eg +352 has 3 CC digits, +32 has 2.
						$this->phone = '+'.substr_replace($this->phone, ' ', $ccd, 0); // inserts a space right after the country code, so now we have +352 123456
					}
				}
				$headsize = strlen($this->phone)-6;
				$head = substr($this->phone,0,$headsize);
				if($head) $head = $head.' '; // add some padding if anything is in head
				
				// tail, in the following section, we change the presentation of the trailing 123456, or 655599
				$tail = substr($this->phone,-6);
				
				$chunks = str_split($tail, 2); // from 655599 makes an Array('65','55','99')
				$tail = implode(' ', $chunks); // from Array('65','55','99') makes "65 55 99"
				$this->phone = $head.$tail; // from 32493655599 makes 0493 65 55 99 if the account setup phone region is +32, otherwise, the output is +32 493 65 55 99
			}
		}
		
		return $this;
	}

    public static $explained = array ( 
		'id' => 'unique id in the scope of C_dS_visitor instances',
		'groupId' => 'id of the parent C_dS_group instance',
        'mergedTo' 		=> 'when deletorId is set, this field indicates to which visitor id this instance as been merged to.',
        'prefNotBefore' => 'prefered delay when appointing.',
        'prefAMPM' 	 	=> 'prefered AM PM week scheduling scheme in Hexa format.',
        'vip'  			=> 'unused.',
        'gender'  		=> 'gender like [ 0:female, 1:male, 2:sa, 3:Ltd, 4:miss, 5:boy, 6:girl, 7:other ].', // see (*gc01*)
        'firstname' 	=> 'visitor\'s first name.',
        'lastname' 	 	=> 'visitor\'s family name.',
        'company' 	 	=> 'company to which this visitor links if any.',
        'address' 		=> 'address of this visitor.',
        'residence' 	=> 'residence or address line 2.',
        'zipCode' 		=> 'zip code.',
        'city' 	 		=> 'city where this visitor lives.',
        'country' 	 	=> 'country where this visitor lives.',
        'email' 	 	=> 'visitor\'s email.',
        'mobile' 	 	=> 'visitor\'s mobile phone number. Please respect the digits bundles when reading.',
        'phone' 	 	=> 'visitor\'s fix line phone number.',
        'language' 	 	=> 'visitor\'s language [english:0, french:1, polish:2, dutch:3, german:4, italian:5, spanish:6, portuguese:7, luxembourgish:8].',
        'birthday' 	 	=> 'format YYYMMDD, like 19991230.',
        'registration' 	=> 'free alphanumeric field.',
        'reference' 	=> 'free alphanumeric field.',
        'note' 	 		=> 'information about the visitor.',
        'cssColor' 		=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 3).',
        'cssPattern' 	=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 3).',
        'cssTags' 		=> 'ids of one or many C_dS_customCss of the tag type (C_dS_customCss::cssType = 82, resaClass = 3), separated by "!".',
        'selection' 	=> 'calling /query/visitors giving cueIn and cueOut, this field is set to 1 if the visitor is alreday planned on an appointment in the given timeframe in the current account.'
    );
	public function dSsave($groupId = false) {
		
		parent::dSsave($groupId);
		// echo 'C_dS_visitor::dSsave() '.$this->id;
		
		// here we compute metaphones and we write them to DB, dbio.php and datasets.js have no knowledge of metaphones (as in 2025 when I write this).
		// ( we cannot write them down in the object before saving, because metaphones are NOT represented in the dS_visitor ).
		
			$dmFN = new DoubleMetaphone($this->firstname); // DoubleMetaphone defined in this file.
		$metaphone1 = $dmFN->result['primary'];
		$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';


			$dmLN = new DoubleMetaphone($this->lastname);
		$metaphone3 = $dmLN->result['primary'];
		$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';
		
		$q = new Q('update visitors set metaphone1 = "'.$metaphone1.'", metaphone2 = "'.$metaphone2.'", metaphone3 = "'.$metaphone3.'", metaphone4 = "'.$metaphone4.'" WHERE id = "'.$this->id.'";'); // see (*gs01*)
	}
    	
}
class C_dS_file extends C_dbTrackingCCD { // group to an account

    // usage: 
    //
    // DO NOT FORGET to set php.ini upload_max_filesize = 10M, check also post_max_size = 10M 
    //
    // to know where phph.ini resides, type "php --ini" on the command line
    //      => /etc/php5/cli/php.ini  is the one used for command line (cron tasks)
    //      => /etc/php5/apache2/php.ini is the one used for apache (clients <= this one is the one to adapt)
    //
    // after editing php.ini, proceed with "apache2ctl graceful"
    //
    // How to give PHP/Apache write access to folders:
    // As PHP is a module of the Apache web server, it is executed with the Apache server's permissions.
    // create the folder: mkdir mobfiles (root is fine)
    // than chmod 777 /mobfiles (gives read/write accesslevel)
    //

    public function getTableName() { return  'files'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $visitorId;
    public $name;
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $filename;

    public static $filesdir = '/mobfiles/visifiles/'; // where files are stored on the system drive
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'visitorId'		=> 0, 
        'name'			=> '', 
        'note'			=> '', 
        'cssColor'		=> 0, 
        'cssPattern'	=> 0, 
        'cssTags'		=> '', 
        'filename'		=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }

}
class C_dS_resafile extends C_dbTrackingCCD { // group to an account

    // usage: 
    //
    // DO NOT FORGET to set php.ini upload_max_filesize = 10M, check also post_max_size = 10M 
    //
    // to know where phph.ini resides, type "php --ini" on the command line
    //      => /etc/php5/cli/php.ini  is the one used for command line (cron tasks)
    //      => /etc/php5/apache2/php.ini is the one used for apache (clients <= this one is the one to adapt)
    //
    // after editing php.ini, proceed with "apache2ctl graceful"
    //
    // How to give PHP/Apache write access to folders:
    // As PHP is a module of the Apache web server, it is executed with the Apache server's permissions.
    // create the folder: mkdir mobfiles (root is fine)
    // than chmod 777 /mobfiles (gives read/write accesslevel)
    //

    public function getTableName() { return  'resafiles'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $reservationId;
    public $name;
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $filename;

    public static $filesdir = '/mobfiles/resafiles/'; // where files are stored on the system drive
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'reservationId'	=> 0, 
        'name'			=> '', 
        'note'			=> '', 
        'cssColor'		=> 0, 
        'cssPattern'	=> 0, 
        'cssTags'		=> '', 
        'filename'		=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dS_logo extends C_dbID { // group to an account

    public function getTableName() { return  'logos'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $loginId;
    public $filename;
    public $note;

    public static $filesdir = '/mobfiles/_logos/'; // where files are stored on the system drive ( see post/file and fileclass )
    public static $multilines = array(
        'note' 			=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'loginId'	=> 0, 
        'filename'	=> '',
        'note'		=> '' 
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	public function getcodename() { 
			$ext = strtolower(pathinfo($this->filename, PATHINFO_EXTENSION)); // isolates the file extension
		return $this->groupId.'_'.$this->loginId.'_'.$this->id.'.'.$ext; // file name as saved on the server. // see (*F01*)
	}
	public static function remove($logoid) { // removes file from mobfiles/_logos and removes CCD tracking info from DB
		
		$dS = new C_dS_logo($logoid); // the DB logical image (attributes) of the file, from table logos in mobminder
		$codename = $dS->getcodename(); // a path to the file on our server

		// remove the file
			$pathname = C_dS_logo::$filesdir.$codename;
			// echo chr(10).$pathname.chr(10);
		$r = false; if(file_exists($pathname)) $r = unlink($pathname);
			// echo $r;
			
		// remove the dataSet
		$dS->dSdelete();
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    P R O D U C T S  
//
class C_dS_product extends C_dbTrackingCCD  { // group to an account
    // defines a generic performance, and associated expert resources, duration, and staffing
    public function getTableName() { return  'products'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $code;
		public $price;
		public $deposit;
		
    public $note;
    public $secretarynote; // see (*pu11*)
    public $webpagenote;
    public $communicnote;
	
		public $altLanguage1; // for web pages and notifications (emails, SMS, firebase)
		public $altName1;
		public $altwebpagenote1;
		public $altcommunicnote1;
		public $altLanguage2;
		public $altName2;
		public $altwebpagenote2;
		public $altcommunicnote2;
		
	public $stockremain;
	
	public $cssColor;
	public $cssPattern;
	public $tag;
	public $tags;
	
		public $ereservable;
		public $checklistid;

    public static $multilines = array(
        'note' 			=> 1,
        'secretarynote' => 1,
        'webpagenote' 	=> 1,
        'communicnote' 	=> 1,
		
        'altwebpagenote1' 		=> 1,
        'altwebpagenote2' 		=> 1,
		
        'altcommunicnote1' 		=> 1,
        'altcommunicnote2' 		=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name'		=> '', 
        'code'		=> '', 
			'price'		=> 0,
			'deposit'	=> 0,
			
        'note'		=> '', 
        'secretarynote'		=> '', 
        'webpagenote'		=> '', 
        'communicnote'		=> '', 
		
        'altLanguage1'		=> 0, 
        'altName1'			=> '', 
        'altwebpagenote1'	=> '', 
        'altcommunicnote1'	=> '',
		
        'altLanguage2'		=> 0, 
        'altName2'			=> '', 
        'altwebpagenote2'	=> '', 
        'altcommunicnote2'	=> '',
		
		'stockremain'	=> 0,
        'cssColor'	=> 0,
        'cssPattern'=> 0,
        'tag'		=> 0,
        'tags'		=> '',
        'ereservable'=> 0,
        'checklistid'=> 0
		
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
    public function magnify($resources, $workexperts, $worktboxings) { 
	
		$this->workexperts = Array(class_bCal=>Array(), class_uCal=>Array(), class_fCal=>Array());
		if($workexperts->count())
			foreach($workexperts->keyed as $dS_wex) 
				if($dS_wex->groupId == $this->id) { 
						$type = $resources->keyed[$dS_wex->resourceId]->resourceType;
					$this->workexperts[$type][] = $dS_wex->resourceId; 
				}
		
		$this->worktboxings = Array();
		if($worktboxings->count())
			foreach($worktboxings->keyed as $dS_wtb) 
				if($dS_wtb->groupId == $this->id) { $this->worktboxings[] = $dS_wtb->timeboxingId; }

	}
	
    public static $explained = array( 
	
		'id' => 'unique id in the scope of C_dS_product instances.',
		'groupId' => 'id of the parent C_dS_group instance.',
		
        'name' 			=> 'product name.',
        'code' 	 	 	=> 'user defined product code.',
			'price'  		=> 'product price.',
			'deposit'  		=> 'product deposit if applicable. if zero you ignore it.',
        'note' 	 		=> 'product description.',
        'secretarynote' => 'instructions for secretary. audience: C_dS_login', // pop-ups when a product is selected on search assistant or plain reservation modal
        'webpagenote' 	 	=> 'displayed on webpage for online reservation. audience: C_dS_visitor',
        'communicnote' 	 	=> 'note to be inserted into communication to C_dS_visitor, like in sms or email', // into {note} fusion field
			
			'altLanguage1'		=> 'altLanguage1 ranges [255:notset,0:english,1:french,2:polish,3:dutch,4:german,5:italian,6:spanish,7:portuguese]. if not set, do not use altName1, altwebpagenote1 and altcommunicnote1. ', 
			'altName1'			=> 'version of this.name in language altLanguage1', 
			'altwebpagenote1'	=> 'version of this.webpagenote in language altLanguage1', 
			'altcommunicnote1'	=> 'version of this.communicnote in language altLanguage1',
			
			'altLanguage2'		=> 'altLanguage1 ranges [255:notset,0:english,1:french,2:polish,3:dutch,4:german,5:italian,6:spanish,7:portuguese]. if not set, do not use altName2, altwebpagenote2 and altcommunicnote2. ', 
			'altName2'			=> 'version of this.name in the language altLanguage2. if empty, use this.name', 
			'altwebpagenote2'	=> 'version of this.webpagenote in language altLanguage2. if empty, use this.webpagenote', 
			'altcommunicnote2'	=> 'version of this.communicnote in language altLanguage2. if empty, use this.communicnote', 
		
		'stockremain'	=> 'number of remaining items in the stock (that decreases each time a product gets sold)',
			
        'cssColor' 		=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 11).',
        'cssPattern' 	=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 11).',
        'tag' 			=> 'id of a raw tag (system use only).', 
        'tags' 			=> 'ids of tags to be applied on C_dS_reservation when created with this product, a string like \'!4589!5462!6589!1212!\'',
        'ereservable' 	=> 'is reserved for online reservation',
        'checklistid' 	=> 'id of a C_dS_checklist. when this C_dS_product is added in a C_dS_reservation, this checklist contains questions that should be asked to the visitor at reservation time',
		
		// additional fields set by AI magnification
        'expertIds'	=> 'ids of C_dS_resource(s) that are best appropriate for handling this product', 
    );
	
	public function dSmagnify4AI() { // prepares this dS for exchange with AI
		
		$this->note = str_replace(chr(10),'. ', $this->note); // otherwise, some \n will appear in the text intended to AI
		$this->expertIds = 'expertIds';
		// $this->expertIds = 'timboxesIds';
		
		$this->price = $this->AIhumanpriceformat($this->price);
		$this->deposit = $this->AIhumanpriceformat($this->deposit);
		
		$seconds = C_date::getSecondsPerSlice()*$this->duration; // duration in seconds
		$hours = floor($seconds/3600);
		$minutes = floor(($seconds%3600)/60);
		// $remainingSeconds = $seconds%60;
		$hmm = '';
		if($minutes) $hmm = $minutes.'min';
		if($hours) $hmm = $hours.'h'.$hmm;
		$this->duration = $hmm;
		
		return $this;
    }
}
class C_dS_productexpert extends C_dbID  { // group to a product
    // expert resource for a generic performance, grouped by product id
    public function getTableName() { return  'productexperts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $resourceId;
    public static $multilines = false;
    public static $defaults = array(
        'resourceId' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
	
    public static $explained = array( 
		'id' 			=> 'unique id in the scope of C_dS_productexpert instances',
		'groupId' 		=> 'id of a C_dS_product instance',
        'resourceId' 	=> 'id of a C_dS_resource that is allocable for the execution of the parent C_dS_product instance',
    );
    

}
class C_dS_good extends C_dbID  { // group to a reservation, links to a product, (so you understand that a performance is the actual occurance of a product)
    // assignment of a C_dS_product to a reservation
    public function getTableName() { return 'goods'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $productId;
	public $numberof;
    public $visitorId;	// links to the person who took the reservation => so we can easily query an inventory of which performances a person took so far
    public $checklist;	// derived from the genuine version found in the related productId;
    public $archived;	
    public static $multilines= array(
        'checklist' 	=> 1
    );
    public static $defaults = array( 	
        'productId'	=> 0, 
        'numberof'	=> 0, 
        'visitorId'	=> 0,
        'checklist'	=> '',
        'archived' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->productId; }	

    public static $explained = array( 
        'groupId' 		=> 'id of the parent C_dS_reservation',
        'productId'		=> 'id of the a C_dS_product where all details of this product are defined',
        'numberof'		=> 'number of items covered by the transaction',
        'visitorId' 	=> 'id of a C_dS_visitor (helps identify which products was ever assigned to a given visitor)',
        'checklist' 	=> 'free text. initialy set up based on the text in a C_dS_product.checklistid',
        'archived' 		=> 'this item has been archived'
	);
    public static $AIinstructions = array( 
		// 'mandatory' =>	'no. some C_dS_reservation might have no good attached, in this case you do not list any.',
        // 'address,zipCode,city'	=> 'when not set, the appointment place is the default business place'
	);
}
class C_dS_stocktaking extends C_dbTrackingCD_utc  { // group to a C_dS_product
    // records each time of a new taking inventory is executed, the new number of items available in stock for the given C_dS_product
    public function getTableName() { return 'stocktakings'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $delta;	// number of items added/removed from stock (signed!)
    public $movingtotal;	// number of items added/removed from stock (signed!)
    public $takingnote;	// user note about this stocktaking
    public static $multilines= array(
        'takingnote' 	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'delta'		=> 0,
        'movingtotal'		=> 0,
        'takingnote' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->productId; }	

    public static $explained = array( 
        'groupId' 		=> 'id of the parent C_dS_product.',
        'delta' 		=> 'number of items added/removed from stock (signed!).',
        'movingtotal' 	=> 'number of items in stock when inventory was saved.',
        'takingnote' 	=> 'free text. this item has been archived.'
	);
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    W O R K C O D E S 
//
class C_dS_workcode extends C_dbTrackingCCD  { // group to an account
    // defines a generic performance, and associated expert resources, duration, and staffing
    public function getTableName() { return  'workcodes'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $code;
		public $price;
		public $deposit;
		
    public $note;
    public $secretarynote; // see (*pu11*)
    public $webpagenote;
    public $communicnote;
	
		public $altLanguage1; // for web pages and notifications (emails, SMS, firebase)
		public $altName1;
		public $altwebpagenote1;
		public $altcommunicnote1;
		public $altLanguage2;
		public $altName2;
		public $altwebpagenote2;
		public $altcommunicnote2;
		
	public $duration;
	public $staffing;	
	public $cssColor;
	public $cssPattern;
	public $tag;
	public $tags;
	
		public $ereservable;
		public $checklistid;

    public static $multilines = array(
        'note' 			=> 1,
        'secretarynote' => 1,
        'webpagenote' 	=> 1,
        'communicnote' 	=> 1,
		
        'altwebpagenote1' 		=> 1,
        'altwebpagenote2' 		=> 1,
		
        'altcommunicnote1' 		=> 1,
        'altcommunicnote2' 		=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name'		=> '', 
        'code'		=> '', 
			'price'		=> 0,
			'deposit'	=> 0,
			
        'note'		=> '', 
        'secretarynote'		=> '', 
        'webpagenote'		=> '', 
        'communicnote'		=> '', 
		
        'altLanguage1'		=> 0, 
        'altName1'			=> '', 
        'altwebpagenote1'	=> '', 
        'altcommunicnote1'	=> '',
		
        'altLanguage2'		=> 0, 
        'altName2'			=> '', 
        'altwebpagenote2'	=> '', 
        'altcommunicnote2'	=> '',
		
			'duration'	=> 1,
			'staffing'	=> 1,
        'cssColor'	=> 0,
        'cssPattern'=> 0,
        'tag'		=> 0,
        'tags'		=> '',
        'ereservable'=> 0,
        'checklistid'=> 0
		
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
    public function magnify($resources, $workexperts, $worktboxings) { 
	
		$this->workexperts = Array(class_bCal=>Array(), class_uCal=>Array(), class_fCal=>Array());
		if($workexperts->count())
			foreach($workexperts->keyed as $dS_wex) 
				if($dS_wex->groupId == $this->id) { 
						$type = $resources->keyed[$dS_wex->resourceId]->resourceType;
					$this->workexperts[$type][] = $dS_wex->resourceId; 
				}
		
		$this->worktboxings = Array();
		if($worktboxings->count())
			foreach($worktboxings->keyed as $dS_wtb) 
				if($dS_wtb->groupId == $this->id) { $this->worktboxings[] = $dS_wtb->timeboxingId; }

	}
	
    public static $explained = array( 
	
		'id' => 'unique id in the scope of C_dS_workcode instances.',
		'groupId' => 'id of the parent C_dS_group instance.',
        'name' 			=> 'service name.',
        'code' 	 	 	=> 'user defined service code.',
			'price'  		=> 'service price.',
			'deposit'  		=> 'service deposit if applicable. if zero you ignore it.',
        'note' 	 		=> 'service description.',
        'secretarynote' => 'instructions for secretary. audience: C_dS_login', // pop-ups when a workcode is selected on search assistant or plain reservation modal
        'webpagenote' 	 	=> 'displayed on webpage for online reservation. audience: C_dS_visitor',
        'communicnote' 	 	=> 'note to be inserted into communication to C_dS_visitor, like in sms or email', // into {note} fusion field
		
			'duration' 	 	=> 'duration of the performance.',
			'staffing' 	 	=> 'tells how many of staffable resources should be implied in the realization of this service.',
        'cssColor' 		=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 11).',
        'cssPattern' 	=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 11).',
        'tag' 			=> 'id of a raw tag (system use only).', 
        'tags' 			=> 'ids of tags to be applied on C_dS_reservation when created with this workcode, a string like \'!4589!5462!6589!1212!\'',
        'ereservable' 	=> 'is reserved for online reservation',
        'checklistid' 	=> 'id of a C_dS_checklist. when this C_dS_workcode is added in a C_dS_reservation, this checklist contains questions that should be asked to the visitor at reservation time',
		
        'altLanguage1'		=> 'altLanguage1 ranges [255:notset,0:english,1:french,2:polish,3:dutch,4:german,5:italian,6:spanish,7:portuguese]. if not set, do not use altName1, altwebpagenote1 and altcommunicnote1. ', 
        'altName1'			=> 'version of this.name in language altLanguage1', 
        'altwebpagenote1'	=> 'version of this.webpagenote in language altLanguage1', 
        'altcommunicnote1'	=> 'version of this.communicnote in language altLanguage1',
		
        'altLanguage2'		=> 'altLanguage1 ranges [255:notset,0:english,1:french,2:polish,3:dutch,4:german,5:italian,6:spanish,7:portuguese]. if not set, do not use altName2, altwebpagenote2 and altcommunicnote2. ', 
        'altName2'			=> 'version of this.name in the language altLanguage2. if empty, use this.name', 
        'altwebpagenote2'	=> 'version of this.webpagenote in language altLanguage2. if empty, use this.webpagenote', 
        'altcommunicnote2'	=> 'version of this.communicnote in language altLanguage2. if empty, use this.communicnote', 
		
        'expertIds'	=> 'ids of C_dS_resource(s) that are best appropriate for handling this service',
		'timboxesIds'	=> 'ids of C_dS_timebox(es) that are best appropriate time periods for handling this service.'
    );
	
	public function dSmagnify4AI() { // prepares this dS for exchange with AI
		
		$this->note = str_replace(chr(10),'. ', $this->note); // otherwise, some \n will appear in the text intended to AI
		$this->expertIds = 'expertIds';
		$this->expertIds = 'timboxesIds';
		
		$this->price = $this->AIhumanpriceformat($this->price);
		$this->deposit = $this->AIhumanpriceformat($this->deposit);
		
		$seconds = C_date::getSecondsPerSlice()*$this->duration; // duration in seconds
		$hours = floor($seconds/3600);
		$minutes = floor(($seconds%3600)/60);
		// $remainingSeconds = $seconds%60;
		$hmm = '';
		if($minutes) $hmm = $minutes.'min';
		if($hours) $hmm = $hours.'h'.$hmm;
		$this->duration = $hmm;
		
		return $this;
    }
}
class C_dS_workexpert extends C_dbID  { // group to a workcode
    // expert resource for a generic performance, grouped by workcode id
    public function getTableName() { return  'workexperts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $resourceId;
    public static $multilines = false;
    public static $defaults = array(
        'resourceId' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
	
    public static $explained = array( 
		'id' 			=> 'unique id in the scope of C_dS_workexpert instances',
		'groupId' 		=> 'id of a C_dS_workcode instance',
        'resourceId' 	=> 'id of a C_dS_resource that is allocable for the execution of the parent C_dS_workcode instance',
    );
    

}
class C_dS_worktboxing extends C_dbID  { // group to a workcode
    // expert resource for a generic performance, grouped by workcode id
    public function getTableName() { return  'worktboxing'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $timeboxingId;
    public static $multilines = false;
    public static $defaults = array(
        'timeboxingId' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public static $explained = array( 
		'id' 			=> 'unique id in the scope of C_dS_worktboxing instances',
		'groupId' 		=> 'id of a C_dS_workcode instance',
        'timeboxingId' 		=> 'id of a C_dS_timeboxing instance, C_dS_workcode preferably occurs during this timeboxing periods',
    );
    	
}
class C_dS_performance extends C_dbID  { // group to a reservation, links to a workcode, (so you understand that a performance is the actual occurance of a workcode)
    // assignment of a C_dS_workcode to a reservation
    public function getTableName() { return 'performances'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $workCodeId;
    public $visitorId;	// links to the person who took the reservation => so we can easily query an inventory of which performances a person took so far
    public $checklist;	// 
    public $archived;	
    public static $multilines= array(
        'checklist' 	=> 1
    );
    public static $defaults = array( 	
        'workCodeId'	=> 0, 
        'visitorId'		=> 0,
        'checklist'		=> '',
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->workCodeId; }	

    public static $explained = array( 
        'groupId' 		=> 'id of the parent C_dS_reservation',
        'workCodeId'	=> 'id of the a C_dS_workcode where all details of this performance are defined',
        'visitorId' 	=> 'id of a C_dS_visitor (helps identify which workcodes was ever assigned to a given visitor)',
        'checklist' 	=> 'free text. initialy set up based on the text in a ',
        'archived' 		=> 'this item has been archived'
	);
    public static $AIinstructions = array( 
		'mandatory' =>	'no. some C_dS_reservation might have no performance, in this case you do not list any',
        // 'address,zipCode,city'	=> 'when not set, the appointment place is the default business place'
	);
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    P A Y M E N T S 
//

define('paymean_notset'     ,-1); 
define('paymean_cash'       ,0);
define('paymean_mobqrcode'  ,1);
define('paymean_payconiq'   ,2);
define('paymean_cards'      ,4); // see (*ep20*)

define('paymean_softpos_softpay'  ,11);
define('paymean_hardpos_done4you'  ,21);

define('paymean_onlinepayco'  ,33); // online payment using payconiq
define('paymean_onlinecards'  ,44); // online payment using bank cards (credit or debt)
define('paymean_onlinebcontact' ,55); // online payment using bancontact network (credit or debt)

define('payment_status_isnew'           ,999);  // isnew 	// see (*ep22*)
define('payment_status_unauthorized'    ,0);    // unauthorized
define('payment_status_pending'         ,10);    // pending
define('payment_status_identified'      ,17);    // identified <= Payconiq, the QR code has been scanned
define('payment_status_success'         ,20);    // success
define('payment_status_expired'         ,30);    // expired
define('payment_status_failed'          ,40);    // failed
define('payment_status_cancelled'       ,50);    // cancelled
define('payment_status_reserved'       	,60);    // money reserved on credit card (defaults to success if the payment mean does not support reservation)


// Those constants are used in a bitmap, see (*ep23*)
define('active_payconiq'  	 	,1); // !!(bitmap & paymean_payconiq); can be read from C_dS_group::ePayWebActive
define('active_cards'      		,2); // see (*ep20*)
define('active_onlinebcontact'  ,4); // !!(bitmap & paymean_onlinebcontact);



class C_dS_payment extends C_dbTrackingCC  { // group to a reservation

    // assignment of a C_dS_workcode to a reservation
    public function getTableName() { return 'payments'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $paymean;		// tiny int ranging [see (*ep20*)]
    public $amount;			// bigint20 is the amount in unit of cents
    public $transid;		// is a string
    public $transnote;		// is a varchar 512
    public $transtatus;		// tiny int ranging [see (*ep22*)]
    public $opstatus;		// varchar 256
    public $accountholder;		//  varchar 32
    public $accountIBAN;		// 	varchar 64
    public $qrcodestring;		//  varchar 512
    public $archived; 		// tiny int
    public static $multilines= array(
        'transnote' 	=> 1,
        'qrcodestring' 	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0,
		'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        'archive_delete' 	=> 0
    );
    public static $defaults = array( 	
        'paymean'		=> paymean_cash, 
        'amount'		=> 0,
        'transid'		=> '',
        'transnote'		=> '',
        'transtatus'	=> payment_status_isnew, // see (*ep22*)
        'opstatus'		=> '',
        'accountholder'	=> '',
        'accountIBAN'	=> '',
        'qrcodestring'	=> '',
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }

    public static $explained = array( 
        'groupId' 		=> 'unique id of the parent C_dS_reservation',
        'paymean' 		=> 'payment mean (cash, payconiq, debitcard, creditcard)',
        'amount' 		=> 'amount in this transaction',
        'transid'		=> 'technical id relating to payment mean',
        'transnote' 	=> 'free text',
        'transtatus' 	=> 'transaction status (relevant for e-Payments, not for cash)',
        'opstatus' 		=> 'transaction status according to the external operator (payconiq, marketpay, europabank,...)',
        'accountholder' => 'name of the account holder from which money is received',
        'accountIBAN' 	=> 'shorthand identification of crediting IBAN number',
        'qrcodestring' 	=> 'qr code source string (gets deleted when expired)',
        'archived' 		=> 'this item has been archived'
	);
}


class C_dS_checklist extends C_dbTrackingCCD  { // group to an account
    // defines a generic performance, and associated expert resources, duration, and staffing
    public function getTableName() { return  'checklists'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $clname;
    public $clguideline;
    public $cltext;
    public $cltag;

    public static $multilines = array(
        'clguideline'	=> 1, 
        'cltext'		=> 1 
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'clname'		=> '', 
        'clguideline'	=> '', 
        'cltext'		=> '', 
        'tag'			=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
	
    public static $explained = array( 
		'id' 			=> 'unique id in the scope of C_dS_checklist instances',
		'groupId' 		=> 'id of the parent C_dS_group instance',
        'clname' 		=> 'checklist name',
        'clguideline' 	=> 'checklist guideline, free text, will not be editable in the appointment. appears as a tootlip',
        'cltext'  		=> 'checklist questions, free text, is the initial text of C_dS_checklist->cltext when a performance is attached to a C_dS_reservation',
        'tag' 			=> 'id of a tag, chosen from the checklist edit window',
    );
    
	
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C H A T S 
//
class C_dS_chat_thread extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'chat_threads'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $title;
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $cversion;
    public $archived;
    public $lastphyl;
    public static $multilines = array(
        'note'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0,
		'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        'archive_delete' 	=> 0
    );
    public static $defaults = array(
        'title' 		=> '',
        'note' 			=> '',
        'cssColor' 		=> 0,
        'cssPattern' 	=> 0,
        'cssTags' 		=> '',
        'cversion' 		=> 0,
        'archived' 		=> 0,
        'lastphyl' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	public static $explained = array ( 
		'groupId' 	=> 'id of the parent C_dS_group',
        'title' 	=> 'free alphanum (CRLF disallowed)',
		'note' 	 	=> 'free text note about this visitor (CRLF allowed)',

        'cssColor' 	=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 16)',
        'cssPattern'=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 16)',
        'cssTags' 	=> 'ids of one C_dS_customCss of the tag type (C_dS_customCss::cssType = 82, resaClass = 16)',
        
		'cversion' 	=> 'chat version. incremented each time the chat data or attributes are changed (participants, visirefs). not affected by chat philacteries',
		'archived' 	=> 'this instance was transfered to the archive table',
		'lastphyl' 	=> 'unix time of last inserted phylactery'
    );
	public function charchive($reverse = false, $perfreport = false) {
		
		// copy to archive table
		
		if($reverse) { // from archive tables to live tables
			
			$q = new Q('INSERT INTO chat_visirefs 		SELECT * FROM archive_chat_visirefs 		WHERE archive_chat_visirefs.groupId = '.$this->id.';'); 
			$q = new Q('INSERT INTO chat_phylacteries 	SELECT * FROM archive_chat_phylacteries 	WHERE archive_chat_phylacteries.groupId = '.$this->id.';');
			$q = new Q('INSERT INTO chat_threads 		SELECT * FROM archive_chat_threads 			WHERE archive_chat_threads.id = '.$this->id.';');
			$q = new Q('INSERT INTO chat_participants 	SELECT * FROM archive_chat_participants 	WHERE archive_chat_participants.groupId = '.$this->id.';'); // keep as last step, chatdog uses this to track active chats

			// remove from archive table
			new Q('DELETE FROM archive_chat_participants 	WHERE archive_chat_participants.groupId 	= '.$this->id.';');	
			new Q('DELETE FROM archive_chat_phylacteries 	WHERE archive_chat_phylacteries.groupId 	= '.$this->id.';');	
			new Q('DELETE FROM archive_chat_visirefs 		WHERE archive_chat_visirefs.groupId = '.$this->id.';');	
			new Q('DELETE FROM archive_chat_threads 		WHERE archive_chat_threads.id 	= '.$this->id.';');
			
			new Q('UPDATE chat_threads SET archived = 0 where id = '.$this->id.';');
			$this->archived = 1;

			
		} else { // from live tables to archive tables
			
			$q = new Q('INSERT INTO archive_chat_visirefs 		SELECT * FROM chat_visirefs 		WHERE chat_visirefs.groupId = '.$this->id.';'); 
			if($perfreport) $perfreport->peak('      ::copy to archive_chat_visirefs');

			$q = new Q('INSERT INTO archive_chat_phylacteries 	SELECT * FROM chat_phylacteries 	WHERE chat_phylacteries.groupId = '.$this->id.';');
			if($perfreport) $perfreport->peak('      ::copy to archive_chat_phylacteries');

			$q = new Q('INSERT INTO archive_chat_participants 	SELECT * FROM chat_participants 	WHERE chat_participants.groupId = '.$this->id.';');
			if($perfreport) $perfreport->peak('      ::copy to archive_chat_participants');

			$q = new Q('INSERT INTO archive_chat_threads 		SELECT * FROM chat_threads 			WHERE chat_threads.id = '.$this->id.';');
			if($perfreport) $perfreport->peak('      ::copy to archive_chat_threads');

			// remove from live table
			new Q('DELETE FROM chat_participants 	WHERE chat_participants.groupId 	= '.$this->id.';');	 // keep as first step, chatdog uses this to track active chats
			if($perfreport) $perfreport->peak('      ::removed from chat_participants');

			new Q('DELETE FROM chat_visirefs 		WHERE chat_visirefs.groupId = '.$this->id.';');	
			if($perfreport) $perfreport->peak('      ::removed from chat_visirefs');

			new Q('DELETE FROM chat_phylacteries 	WHERE chat_phylacteries.groupId 	= '.$this->id.';');	
			if($perfreport) $perfreport->peak('      ::removed from chat_phylacteries');

			new Q('DELETE FROM chat_threads 		WHERE chat_threads.id 	= '.$this->id.';');
			if($perfreport) $perfreport->peak('      ::removed from chat_threads');
			
			new Q('UPDATE archive_chat_threads SET archived = 1 where id = '.$this->id.';');
			if($perfreport) $perfreport->peak('      ::set archived flag');
			
			$this->archived = 1;
		
		}
		return $this;
	}
}
class C_dS_chat_participant extends C_dbID  { // group to a chat_thread
    public function getTableName() { return  'chat_participants'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $loginId;
    public $cueIn;
    public $physseen;
    public $live;
    public $cueOut;
    public static $multilines = false;
    public static $defaults = array(
        'loginId' 		=> 0,
        'cueIn' 		=> 0,
        'physseen' 		=> 0, // is set by seenupdate() when query/phylacteries.php or post/phylactery is called.
        'live' 			=> 0, // is set by query/chatdog.php and when query/or post/phylacteries.php are called.
        'cueOut' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
    public static function seenupdate($partid, $chatid) {
				$p = new Q('select count(1) as c from chat_phylacteries where groupId='.$chatid.';');
			$c = $p->c();
        new Q('update chat_participants SET physseen = '.$c.', live = '.time().' where id = '.$partid.';');
    }
    public static function count($chatid) {
		$p = new Q('select count(1) as c from chat_participants where groupId = '.$chatid.' and cueOut = 0;');
		$c = $p->c();
		return $c;
    }
	public function setstringtimeformat($utc=false) {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		// As we need the client devices to display real absolute time, we leave the conversion to local time to the remote device.
		// if($this->cueIn) $this->cueIn = Date('Y-m-d H:i',$this->cueIn);
		// if($this->cueOut) $this->cueOut = Date('Y-m-d H:i',$this->cueOut);
		// if($this->live) $this->live = Date('Y-m-d H:i',$this->live);
		return $this;
	}
	public static $explained = array ( 
		'groupId' 	=> 'unique id of the parent C_dS_chat_thread',
        'loginId' 	=> 'id of a C_dS_login identified as a participant to the C_dS_chat_thread',
        'cueIn'		=> 'date and time when this login was invited to the conversation [1970-12-30 16:15]',

        'physseen' 	=> 'int number of chat phylacteries seen by this login',
        'live'		=> 'is absolute unix time when this participant last time reported that parent chatthread is open on screen',
        'cueOut'	=> 'date and time when this login left the conversation [1970-12-30 16:15]'
    );
}
class C_dS_chat_phylactery extends C_dbID  { // group to a chat_thread
    public function getTableName() { return  'chat_phylacteries'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 		
		parent::__construct($id, $groupId, $preset); 
		if($id <= 0) $this->cue = C_date::getNow(); // the web app sends it in the POST, but we think it's better to set it here (2020-10)
	}
    public $cue; // when 
    public $seqid; // sequence id
    public $who; // login id
    public $bla; // msg
    public static $multilines = array( // identifies fields that might contain \n chars
        'bla'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0,
		'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        'archive_delete' 	=> 0
    );
    public static $defaults = array(
        'cue' 	=> 0,
        'seqid' => 0,
        'who' 	=> 0,
        'bla' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	public function setstringtimeformat($utc=false) {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		// if($this->cue) $this->cue = Date('Y-m-d H:i',$this->cue);
		return $this;
	}
	public static function push($loginid, $chatid, $bla, $pid = false) { // returns the newly created instance of C_dS_chat_phylactery
		
		// this code takes care of
		// - inserting the blabla ( new phylactery )
		// - incrementing the sequence id of the phylactery at insert time
		// - incrementing the phylseen attribute of the related chat_participant
		
		if($pid === false) {
			$q = new Q('select id from chat_participants where loginId ='.$loginid.' and groupId ='.$chatid.' limit 1;');	
			$pid = $q->ids();
		}
		
		// Here we want to insert the new phylactery using an atomic single query, in such a way that the sequence number is always correct
		// We want to avoid another user to squeeze a phylactery in the table during this process. So we need an atomic action. 
		
		// This is the code that should not be used :
		// $dS_chat_phylactery = new C_dS_chat_phylactery(0 /*always new*/, $cid);  // read from DB
			// $dS_chat_phylactery->who = $lid;
			// $dS_chat_phylactery->bla = $bla;		// time gap between read & write, that we want to avoid
			// $dS_chat_phylactery->dSsave(); // Write to DN
		
		$unixnow = time();
		$q = new Q('INSERT INTO chat_phylacteries (groupId, cue, seqid, who, bla) 
			select '.$chatid.', '.$unixnow.', count(1), '.$loginid.', "'.$bla.'" 
			from chat_phylacteries where groupId = '.$chatid.';'); 
			
		$hid = $q->newid(); // retrieves newly created item id from insert query
		

		// We need to manage 4 possible special cases here
		//
		// C1: The client posts a phyl and immediately leaves the chatthread view: His own phyl should not be reported by the chatdog/chatpeek process.
		// C2: The client posts a phyl while just before him, another user posts another phyl. Both phyls should appear on the chatthread display. 
		// C3: Client 1 has 2 different devices displaying the chatthread, all screens should update while he is posting phylacteries.
		// C4: Client 1 has on device displaying the chatthread and another devide displaying the chat list. Chatdog should report coherently.

		new Q('UPDATE chat_threads SET lastphyl = '.$unixnow.' where id = '.$chatid.';');

		// Process explained : (*su01*)
		// We try to leave the process of chatdog completely outside the flow of this process.
		//
		// o When a client smartapp posts a phylactery, it retrieves it from this post echo and stores in cache plus let it appear immediately on the chat thread display.
		// o Note that the dS_phylactery cnotains a sequence number relative to the chat thread id (so going 0, 1, 2, 3, 4, ....)
		// o When a chatthread is displaying on screen, query/chatphyls.php is called every 5 seconds see (*lag01*)
		// o Let's consider the case where client 1 posts a phyl while client 2 posts just before him (1/2 a second before let's say).
		// o From the echoed dS_phylactery, the client 1 knows if another phyl was posted just before, by client 2,
		// 		because one item will be absent from the seqid sequence in the client cache 
		//		e.g 0,1,2,3,4,5,6,7,8,10 where 10 is echoed here from post/phylactery, 9 being the phyl posted by client 2
		// o In reaction to the missing phylactery (number 9), the client will immediately call query/chatphyls.php, indicating 8 as number of phyls seen,
		// 		so client 1 gets the previous phyl (9) and along with the already known posted phyl (10)
		//
	
		if($pid) {
			// We do increment (!) the phylseen here, see Case C1 (*py01*)
			// Note that we don't update based on total number of phyls, we INCREMENT in such a way that if another phyl was posted just before client 1, the phylseen will be exact from perspective of chatdog
			// 
			new Q('update chat_participants SET physseen = (physseen+1), live = '.$unixnow.' where id = '.$pid.';');
		}
		
		$dS_chat_phylactery = new C_dS_chat_phylactery($hid);
		return $dS_chat_phylactery;
	}
	public static $explained = array ( 
		'groupId' 	=> 'unique id of the parent C_dS_chat_thread',
        'who' 	=> 'int unique id of the login who dropped the blabla in the chat thread',
        'seqid'	=> 'sequence id, number of this phylactery relative to the chatthread itself. Used to guarantie exhaustive display at device side.',
        'cue'	=> 'date and time when this login was invited to the conversation [1970-12-30 16:15]',
		'bla' 	 => 'free text note about this visitor (CRLF allowed)'
    );
}
class C_dS_chat_visiref extends C_dbID  {  // group to a chat_thread
    public function getTableName() { return  'chat_visirefs'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $visiId;
    public static $multilines = false;
    public static $defaults = array(
        'visiId' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }
	public static $explained = array ( 
		'groupId' 	=> 'unique id of the parent C_dS_chat_thread',
        'visiId' 	=> 'if of a C_dS_visitor who is referenced by this chat thread'
    );
}

class C_chat_peek { // used by web app but now OBSOLETE - Webapp and SmApp use C_chat_peek_smapp
    public $phytotal;
    public $partotal;
    public $monitor;
    public function __construct($loginId) { // returns a report of live chats status for a given login - this is cross accounts !
        
		$this->phytotal = 0;
        $this->partotal = 0;
        $this->monitor = Array();
		
		// $perfReport = new C_perfReport();
        //  make a list of all chats where the given loginId is still active
        $chats = new Q('SELECT groupId, physseen, loginId FROM chat_participants WHERE loginId = '.$loginId.' AND cueOut = 0;'); // dS_participants group by chatId (groupId is the chatId for dS_participants)
		// $perfReport->peak('::q1');
		
		if($chats->result) {
            $chatIds = $chats->groupIds();
			
            if($chatIds) { // then the given login id is implied in some chats
				
				//  let's count the total of actual phylactaries in each of those chats
                $phylcount = new Q('SELECT groupId, COUNT(1) AS phylcount FROM chat_phylacteries WHERE groupId IN ('.$chatIds.') GROUP BY groupId;');
				$phylcount = $phylcount->idx('groupId','phylcount'); // array like [chatId=>phylcount, chatId=>phylcount, ...]
				// $perfReport->peak('::q2');
				
				//  let's count the total of actual participants for those chats
                $partics = new Q('SELECT groupId, SUM(loginId) AS cs FROM chat_participants WHERE groupId IN ('.$chatIds.') AND cueOut = 0 GROUP BY groupId;');
                $partics = $partics->idx('groupId','cs'); // array like [chatId=>checksum, chatId=>checksum, ...] // checksum is the sum of loginIds of current participants in the chat
				// $perfReport->peak('::q3');
				
				
				//  let's link each chat with it's account
                $threads = new Q('SELECT groupId, id FROM chat_threads WHERE id IN ('.$chatIds.') and deletorId = 0;'); // find relative account id + select only undeleted chats
                $threads = $threads->idx('id','groupId'); // array like [chatId=>accountId, chatId=>accountId, ...]
				// $perfReport->peak('::q4');
				
				while($row = $chats->result->fetch_array()) { // in this body, the scope reduces to a chat and the login participant 
				
                    $chatId = $row['groupId'];
					if(!isset($threads[$chatId])) continue; // the chat is deleted
				
                    $physseen = $row['physseen'];
					
                    $phyltotal = isset($phylcount[$chatId])?$phylcount[$chatId]:0; // covers the case when this chat has no phylactery yet
                    $accountId = $threads[$chatId];
                    $partisum = $partics[$chatId];
                    $this->monitor[] = $accountId.'-'.$chatId.'-'.$phyltotal.'-'.$physseen.'-'.$partisum;
					
                    $this->phytotal += $phyltotal;
                    $this->partotal += $partisum;
                }
				
            }
        }
		
// $perfReport->peak('::streamed');
// $perfReport->dropReport();
    }
    public function stream() { 
        return $this->monitor;
    }
}
class C_chat_peek_smapp { // used by smartphone app 
    public $phytotal;
    public $partotal;
    public $monitor;
    public function __construct($loginId, $perfReport = false) { // returns a report of chats status for a given login
        
		$this->phytotal = 0;
        $this->monitor = Array();
		
        //  make a list of all chats where the given loginId is still active
        $chats = new Q('SELECT groupId, physseen, loginId FROM chat_participants WHERE loginId = '.$loginId.' AND cueOut = 0;'); // dS_participants group by chatId (groupId is the chatId for dS_participants)
		if($perfReport) $perfReport->peak('      C_chat_peek_smapp::q1');
		
		if($chats->result) {
            $chatIds = $chats->groupIds();
			
            if($chatIds) { // then the given login id is participant in some chats
				
				//  let's count the total of actual phylactaries in each of those chats

                $phyls = new Q('SELECT groupId, COUNT(1) AS phylcount FROM chat_phylacteries WHERE groupId IN ('.$chatIds.') GROUP BY groupId;');
				$phylcount = $phyls->idx('groupId','phylcount'); // array like [chatId=>phylcount, chatId=>phylcount, ...]
				if($perfReport) $perfReport->peak('      C_chat_peek_smapp::q2');

				// Obsolete part of code, now we take the last phylactery time from the dS_chat_thread, where it is recorded each time a new phylactery is pushed.
                // $phyls = new Q('SELECT groupId, MAX(cue) as lastcue FROM chat_phylacteries WHERE groupId IN ('.$chatIds.') group by groupId;');
				// $phyllasts = $phyls->idx('groupId','lastcue'); // array like [chatId=>lastcue, chatId=>lastcue, ...]

				// if($perfReport) $perfReport->peak('      C_chat_peek_smapp::q3');
				
				//  check who is live on this conversation
					$recently = time()-10;
                $partics = new Q('SELECT groupId, loginId FROM chat_participants WHERE groupId IN ('.$chatIds.') and loginId <> '.$loginId.' and cueOut = 0 and live > '.$recently.';');
                $partics = $partics->tree('groupId','loginId','loginId'); 
				if($perfReport) $perfReport->peak('      C_chat_peek_smapp::q4');
				
				
				//  let's link each chat with it's account
                $threads = new Q('SELECT groupId, id, cversion, lastphyl FROM chat_threads WHERE id IN ('.$chatIds.') and deletorId = 0;'); // find relative account id (chat_threads group to account)
                $lastphyls = $threads->idx('id','lastphyl'); // array like [ chatId => cversion, chatId => cversion, ...]
                $versions = $threads->idx('id','cversion'); // array like [ chatId => cversion, chatId => cversion, ...]
                $threads = $threads->idx('id','groupId'); // array like [ chatId => accountId, chatId => accountId, ...]
				if($perfReport) $perfReport->peak('      C_chat_peek_smapp::q5');
				
				while($row = $chats->result->fetch_array()) { // in this body, the scope reduces to a chat and the login participant 
				
                    $chatId = $row['groupId'];
					if(!isset($threads[$chatId])) continue; // the chat is deleted
					
                    $physseen = $row['physseen'];
					
					$phyltotal = 0; $phyllast = 0;
					if(isset($phylcount[$chatId])) { // covers the case when this chat has no phylactery yet
						$phyltotal = $phylcount[$chatId];
						$phyllast = $lastphyls[$chatId]; // Date('Y-m-d H:i',$phyllasts[$chatId]); we use absolute unix time for the chat context
					}
					
                    $lives = isset($partics[$chatId])?$partics[$chatId]:Array('0'); // (*lv01*)
					
					$accountId = $threads[$chatId];
                    $version = $versions[$chatId];
                    $this->monitor[] = $accountId.'-'.$chatId.'-'.$phyltotal.'-'.$physseen.'-'.$version.'-'.$phyllast.'-'.implode('!',$lives); // (*cpk01*)
					
                    $this->phytotal += $phyltotal;
                }	
            }
        }
		
		if($perfReport) $perfReport->peak('      C_chat_peek_smapp::streamed');
    }
    public function stream() { 
        return $this->monitor;
    }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    N O T E S 
//
class C_dS_note_detail extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'note_details'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $midnIn;
    public $midnOut;
    public $title;
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $archived;
    public static $multilines = array(
        'note'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0,
		'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        'archive_delete' 	=> 0
    );
    public static $defaults = array(
        'midnIn' 		=> 0,
        'midnOut' 		=> 0,
        'title' 		=> '',
        'note' 			=> '',
        'cssColor' 		=> 0,
        'cssPattern' 	=> 0,
        'cssTags' 		=> '',
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	public function hasValidTimeFrame() {
		if($this->midnOut==0) return true; // whatever the time in, the note is forever visible
		if($this->midnOut<$this->midnIn) return false; // in all other cases, they should be sequential
	}
	public function setstringtimeformat($utc=false) {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($this->midnIn) $this->midnIn = Date('Y-m-d H:i',$this->midnIn); else $this->midnIn = 0; // shows everbeen setting
		if($this->midnOut) $this->midnOut = Date('Y-m-d H:i',$this->midnOut); else $this->midnIn = 0; // shows forever setting
		return $this;
	}
	
	public static $explained = array( 
        'id' 		=> 'note unique id (integer bigint20)',	
        'groupId' 	=> 'account id (integer bigint20)',	
        'midnIn' 		=> 'time when this note becomes visible on agenda\'s. Zero when everbeen visible.',	
        'midnOut' 		=> 'time when this note expires and is not visible on agenda\'s anymore. Zero for forever visible.',	
        'title' 		=> 'alphanumeric free text, single line',
        'note' 			=> 'alphanumeric free text, multiline can include CR LF',

        'cssColor' 	=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 16)',
        'cssPattern'=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 16)',
        'cssTags' 	=> 'ids of one C_dS_customCss of the tag type (C_dS_customCss::cssType = 82, resaClass = 16)',
		
        'archived' 		=> 'integer boolean [0,1]'
    );
}

class C_dS_note_addressee extends C_dbID  { // group to a note_detail
    public function getTableName() { return  'note_addressees'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $loginId;
    public $archived;
    public static $multilines = false;
    public static $defaults = array(
        'loginId' 		=> 0,
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	
	public static $explained = array( 
        'id' 		=> 'unique id (integer bigint20)',	
        'groupId' 	=> 'C_dS_note_detail id (integer bigint20)',	
        'loginId' 	=> 'C_dS_login id (integer bigint20). This user will see the note on due time.',	
        'archived' 	=> 'integer boolean [0,1]'
    );
}
class C_dS_note_visiref extends C_dbID  {  // group to a note_detail
    public function getTableName() { return  'note_visirefs'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $visiId;
    public static $multilines = false;
    public static $defaults = array(
        'visiId' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }
	
	public static $explained = array( 
        'id' 		=> 'unique id (integer bigint20)',	
        'groupId' 	=> 'C_dS_note_detail id (integer bigint20)',	
        'visiId' 		=> 'C_dS_visitor id (integer bigint20). This visitor is referenced by the note.',	
        'archived' 		=> 'integer boolean [0,1]'
    );
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    T A S K S 
//
class C_dS_task_description extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'task_descriptions'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $title;
    public $description;
    public $midnIn;
    public $cssColor;
    public $cssTags;
    public $archived;
    public static $multilines = array(
        'description'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0,
		'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        'archive_delete' 	=> 0
    );
    public static $defaults = array(
        'title' 		=> '',
        'description' 	=> '',
        'midnIn' 		=> 0,
        'cssColor' 		=> 0,
        'cssTags' 		=> '',
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
	
	public static $explained = array( 
        'id' 		=> 'task unique id (integer bigint20)',	
        'groupId' 	=> 'account id (integer bigint20)',	
		
        'midnIn' 		=> 'utc time when this task becomes visible on agenda\'s. Zero when all time visible.',	
        'title' 		=> 'alphanumeric free text, single line',
        'note' 			=> 'alphanumeric free text, multiline can include CR LF',

        'cssColor' 	=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 16)',
        'cssTags' 	=> 'ids of some C_dS_customCss of the tag type (C_dS_customCss::cssType = 82, resaClass = 16)',
		
        'archived' 		=> 'integer boolean [0,1]',
    );
}
class C_dS_task_assignee extends C_dbID  {  // group to a task_description
    public function getTableName() { return  'task_assignees'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $loginId;
    public $midnOut;
    public $cssPattern;
    public $archived; 
    public static $multilines = false;
    public static $defaults = array(
        'loginId' 		=> 0,
        'midnOut' 		=> 0,
        'cssPattern' 	=> 0,
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	

	public static $explained = array( 
        'id' 		=> 'unique id (integer bigint20)',	
        'groupId' 	=> 'C_dS_task_description id (integer bigint20)',	
        'loginId' 	=> 'C_dS_login id (integer bigint20). This user will see the task on due time.',	
        'archived' 	=> 'integer boolean [0,1]'
    );
}
class C_dS_task_visiref extends C_dbID  {  // group to a task_description
    public function getTableName() { return  'task_visirefs'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $visiId;
    public static $multilines = false;
    public static $defaults = array(
        'visiId' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }
	
	public static $explained = array( 
        'id' 		=> 'unique id (integer bigint20)',	
        'groupId' 	=> 'C_dS_task_description id (integer bigint20)',	
        'visiId' 	=> 'C_dS_visitor id (integer bigint20). This visitor is referenced by the task.',	
        'archived' 	=> 'integer boolean [0,1]'
    );
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    R E S E R V A T I O N S
//
class C_dS_reservation extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'reservations'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
        parent::__construct($id, $groupId, $preset); 
    }
    public function __clone() { parent::__clone(); }
	public $cueIn;
    public $cueOut;
    public $peerId; // peer reservation is another C_dS_reservation that is linked to this one (e.g. all day car reservation links to a time limited staf intervention)
	
    public $remoteid;
    public $remoteProfile;
	
    public $iscluster; 	// made of C_dS_resaparts
    public $vip;		// 
    public $waitingList; // indicates that this reservation must be scanned for sooner moving if possible
    public $note;
    public $cssColor;
    public $cssPattern;
    public $cssTags;
    public $rescheduled;
    public $serieId;	// serie of appointments
    public $snext;	// serie of appointments (linked chain)
    public $sprev;
    public $bookingcode;
	
    public $billamount; // total amount of money to be collected from the client for this appointment
	
    public $company;
    public $residence;
    public $address;
    public $zipCode;
    public $city;
    public $country;
	
    public $rversion; // object version
    public $archived;
    public static $prepared = array(
        // 'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0,
        // 'archive_select' 	=> 0,
        'archive_update' 	=> 0,
        'archive_insert' 	=> 0,
        // 'archive_delete' 	=> 0
    );
    public static $multilines = array(
        'note'	=> 1
    );
    public static $defaults = array(
        'cueIn'			=> 0,
        'cueOut' 		=> 0,
        'peerId' 		=> 0,
        'remoteid' 		=> '',
        'remoteProfile' => 0,
        'iscluster' 	=> 0,
        'vip' 			=> VIP_no,
        'waitingList'	=> 0,
        'note' 			=> '',
        'cssColor' 		=> 0,
        'cssPattern' 	=> 0,
        'cssTags' 		=> '',
        'rescheduled' 	=> 0, 
        'serieId' 	=> 0, 
        'snext' 	=> 0, 
        'sprev' 	=> 0, 
        'bookingcode' 	=> 0, 
		
        'billamount' 	=> 0, // units: cents
		
        'company' 	=> '',
        'residence' => '',
        'address' 	=> '',
        'zipCode' 	=> '',
        'city' 		=> '',
        'country' 	=> '',
		
        'rversion'		=> 0, // is incremented immediately when saved, new resas get rversion = 1
        'archived' 		=> 0
    );
	
    public function dSsave($groupId = false) {
		$this->rversion++;
        return parent::dSsave($groupId);
    }
	
    public function dSobsolete() {
		$this->rversion++;
        return parent::dSobsolete();
    }
	
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking, $sep, $flds); }
    public function isOffDays() {
        $in = new C_date($this->cueIn);
        $out = new C_date($this->cueOut);
        if($in->isMidnight() && $out->isMidnight()) return true;
        return false;
    }
	public function isClose($h) { // starts this reservation in the period starting now and ending now plus $h hours ?
	
		// an identical js function operates at client side, see (*ic10*)
	
        $utcnow = time(); // defaults to today now
        $utccue = $this->cueIn; // reservation start time
		$utcgap = $h*3600;
		$d = $utccue-$utcnow;
		
		// see here (*ic10*)
		//
		//         utcnow                               utccue           utcnow + utcgap
		//         |                                    |                |
		//         |                                    |                |
		// --------+------------------------------------+----------------+------------>
		//         |                                    |                |
		//         |                d                   |                |
		//         + <--------------------------------> |                |
		//         |                                                     |
		//         |                    utcgap                           |
		//         + <-------------------------------------------------> +
		//         |                                                     |
		
		if($d>=0 && $d<$utcgap) return true;
		return false;
		
    }
	public function isPast() { // starts this reservation in the period starting now and ending now plus $h hours ?
	
		// an identical js function operates at client side, see (*ic10*)
	
        $utcnow = time(); // defaults to today now
        $utccue = $this->cueIn; // reservation start time
		$d = $utccue-$utcnow;
		
		// see here (*ic11*)
		//
		//         utcnow                               utccue           
		//         |                                    |                
		//         |                                    |                
		// --------+------------------------------------+--------->
		//         |                                    |                
		//         |                d                   |                
		//         + <--------------------------------> |                
		//         |                                                     
		
		if($d<=0) return true;
		return false;
		
    }
    public static function removeResource($resourceId, $archive = '') { // removes all reservations that relate to a given resource

        $q = new Q('SELECT DISTINCT groupId FROM '.$archive.'attendees WHERE resourceId = '.$resourceId.';');
        $ids = $q->groupIds(false);	
        if(count($ids)) {
            new Q('DELETE FROM '.$archive.'attendees WHERE resourceId = '.$resourceId.';');
            foreach($ids as $resaId) { // check if the resa has remaining account resources
                $q = new Q('SELECT COUNT(1) as c FROM '.$archive.'attendees WHERE groupId = '.$resaId.';');
                if($q->c()==0) { // remove that resa because it can not appear on any planning anymore
                    new Q('DELETE FROM '.$archive.'att_visitors WHERE groupId = '.$resaId.';');
                    new Q('DELETE FROM '.$archive.'performances WHERE groupId = '.$resaId.';');
                    new Q('DELETE FROM comm_toggles WHERE reservationId = '.$resaId.';');
                    new Q('DELETE FROM '.$archive.'reservations WHERE id = '.$resaId.';');
                }
            }
        }
    }
	public function dropAttributes($view=false) { // removes attendees, visitors, resaparts, performances
		if($this->id <=0) return $this;
		
			$a = $this->archived ? 'archive_' : '';
		if($view)
			new Q('delete from '.$a.'attendees where groupId = '.$this->id.' and resourceId in ('.$view.');');
		else
			new Q('delete from '.$a.'attendees where groupId = '.$this->id.';');
		new Q('delete from '.$a.'att_visitors where groupId = '.$this->id.';');
		new Q('delete from '.$a.'resaparts where groupId = '.$this->id.';');
		new Q('delete from '.$a.'performances where groupId = '.$this->id.';');
		new Q('delete from '.$a.'goods where groupId = '.$this->id.';');
	}
    public function gmtshift($gmtshift) {
        $this->cueIn -= $gmtshift;
        $this->cueOut -= $gmtshift;
    }
    public function magnify($dbAccess_resources = false, $extended=false) { // resolves indirection through attendees tables and adds the following members : ->attendees, ->visitors, ->workcodes

		$a = $this->archived?'archive_':'';
	
        if(!$dbAccess_resources) { // the caller level can pre-load $dbAccess_resources once for a collection of reservations
            $accountId = $this->groupId;
            $dbAccess_resources = new C_dbAccess_resources($accountId);
        }
        $this->attendees = array(class_bCal=>new C_setKeyed(), class_uCal=>new C_setKeyed(), class_fCal=>new C_setKeyed());

        // load attendees
        $o_dbAccess_attendees = new C_dbAccess_attendees($a);
        $o_dbAccess_attendees->loadOnGroup($this->id);

        // hook up account resource ids to the $o_dS_resa
        foreach($o_dbAccess_attendees->keyed as $attId => $dS_att) {
					$rscId = $dS_att->resourceId;
				$resource = $dbAccess_resources->keyed[$rscId];
            $this->attendees[$dS_att->resourceType]->add($resource, $rscId);
        }

        // hook up visitors
			$q = new Q('select resourceId as id from '.$a.'att_visitors where groupId = '.$this->id.';');
        $this->visitors = new C_dbAccess_visitors($vids = $q->ids()); 
        
        if($extended){ // for cronofy to define the applicable color
		
			$q = new Q('select workCodeId as id from '.$a.'performances where groupId = '.$this->id.';');
            $this->workcodes = new C_dbAccess_workcodes();
            $this->workcodes->loadOnId($wkids = $q->ids()); // retrieves workcodes attached to a reservations (indirecting through performances)
        }

        return $this;
    }
	public function streamAttendees($class = false, $sep = ',') { // to be used after a magnify, returns ids of attendees like "65432,546266,345678" or "65432!546266!345678"
		if(!isset($this->attendees)) return '';
		
		$keys = Array();
		foreach($this->attendees as $c => $a) 
			if($class) { if($c<>$class) continue; }
				else foreach($this->attendees[$c]->keyed as $rid => $dS) $keys[] = $rid;
		 
		if(count($keys)) return implode($sep,$keys); // normaly, a reservation must have attendees
		return '';
	}
	public function setstringtimeformat($utc=false, $tz=false, $tf = 'Y-m-d H:i') {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($tz=='TZ') {
			$this->cueIn = Date('Y-m-d',$this->cueIn).'T'.Date('H:i',$this->cueIn).'Z';
			$this->cueOut = Date('Y-m-d',$this->cueOut).'T'.Date('H:i',$this->cueOut).'Z';
		} else {
			$this->cueIn = Date($tf,$this->cueIn);
			$this->cueOut = Date($tf,$this->cueOut);
		}
		// echo $tf.' '.$this->cueIn.chr(10);
		return $this;
	}	
	public function setstringtimeformat4AI($utc=false, $tz=false, $tf = 'Y-m-d H:i') { // this is an evolution of the previous for our AI api
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($tz=='TZ') {
			$this->cueIn = Date('Y-m-d',$this->cueIn).'T'.Date('H:i',$this->cueIn).'Z';
			$this->cueOut = Date('Y-m-d',$this->cueOut).'T'.Date('H:i',$this->cueOut).'Z';
		} else {
			$this->cueIn = Date($tf,$this->cueIn); // cueIn and cueOut are UTCs here, and they are converted to a string format time stamp that AI can read.
			$this->cueOut = Date($tf,$this->cueOut);
		}
		// echo $tf.' '.$this->cueIn.chr(10);
		return $this;
	}	

	public function setstringtimeformat_previous($utc=false, $tz=false) { // PVH 2024: can be removed after validation of the new one
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($tz=='TZ') {
			$this->cueIn = Date('Y-m-d',$this->cueIn).'T'.Date('H:i',$this->cueIn).'Z';
			$this->cueOut = Date('Y-m-d',$this->cueOut).'T'.Date('H:i',$this->cueOut).'Z';
		} else {
			$this->cueIn = Date('Y-m-d H:i',$this->cueIn);
			$this->cueOut = Date('Y-m-d H:i',$this->cueOut);
		}
		return $this;
	}
	
    public static $explained = array( 
		'id' 			=>'unique id of this C_dS_reservation instance in the scope of C_dS_reservation instances.',
        'groupId' 		=> 'id of the parent C_dS_group.',
        'cueIn'			=> 'date and time at the start of this time reservation.',
        'cueOut' 		=> 'date and time at the end of this time reservation.',
        'peerId' 		=> 'id of another C_dS_reservation.',
        'remoteid' 		=> 'varchar 128, when the reservation was created in a remote calendar, this id indicates which remote id is originally assigned.',
        'remoteProfile' => 'bigint, when the reservation was created in a remote calendar, this id points to this calendar scope (provider, id, name,...).',
        'iscluster' 	=> 'indicating that this time reservation is a bundle of C_dS_resapart.',
        'vip' 			=> 'unused.',
        'waitingList'	=> 'this reservation is on a waiting list.',
        'note' 			=> 'note about this reservation, it can be a message left by the visitor at booking time or a note taken by the agenda manager.',
        'cssColor' 		=> 'id of a C_dS_customCss of the color type (C_dS_customCss::cssType = 80, resaClass = 11).',
        'cssPattern' 	=> 'id of a C_dS_customCss of the pattern type (C_dS_customCss::cssType = 81, resaClass = 11).',
        'cssTags' 		=> 'ids of a C_dS_customCss of the tag type (C_dS_customCss::cssType = 82, resaClass = 11), separated by "!".',
        'rescheduled' 	=> 'time and date indicating when this reservation has been rescheduled.', 
        'serieId' 		=> 'id of a C_dS_resa_serie, this reservation is part of a serie.', 
        'snext' 		=> 'id of the next C_dS_reservation instance in the C_dS_resa_serie referenced by this.serieId.', 
        'sprev' 		=> 'id of the previous C_dS_reservation instance in the C_dS_resa_serie referenced by this.serieId.', 
        'bookingcode' 	=> 'not used', 
		
        'billamount' 	=> 'bill amount for that we will charge for the (combined) service(s) workcodeIds.', 
		
        'company' 	=> 'appointment geolocation, company.',
        'residence' => 'residence',
        'address' 	=> 'address',
        'zipCode' 	=> 'zipCode',
        'city' 		=> 'city',
        'country' 	=> 'country',
		
		'rversion'		=> 'object version. Is incremented each time saved',
        'archived' 		=> 'this item has been archived',
		
        'prebooking' 	=> '0 when not in prebooking time out. If positive, indicates the number of minutes before deletion.', // note that this is not stored on the DB, only showed on the api when streaming data
		
		'visitorIds'	=> 'ids of C_dS_visitor who are planned to attend. If empty, this reservation is called "a private time reservation", else this reservation is called "appointment".',
		'workcodeIds'	=> 'ids of C_dS_workcode that are serviced during this time reservation. If empty, ignore this data.',
		'resourceIds'	=> 'ids of C_dS_resource that are the calendar(s) holding the C_dS_reservation. There is always at least one resource. If more than 1 resource is involved, this reservation is called "a meeting".'
    );
	public static function findByRemoteIdAndRemoteProfile($remoteid, $remoteprofile,$groupid) { // used in cronofy api
        if(!$remoteid) return false;
        if(!$remoteprofile) return false;
        $q = new Q('SELECT id FROM reservations WHERE groupId = '.$groupid.' AND remoteid = "'.$remoteid.'" AND remoteProfile = '.$remoteprofile.';');
        $ids = $q->ids(false); 
        if (!count($ids)) return false;
        return new C_dS_reservation($ids[0]);
	}
	public function addmeta_prebooking() { // adds a member to the class specifying the remaining prebooking delay (in minutes), or zero if not in prebooking mode

			$q = new Q('select reservationId as id, delay as d from prebooking_delays where reservationId = '.$this->id.';');
			$a = $q->idx('id','d');
			$delay = isset($a[$this->id]) ? $a[$this->id] : 0;
			$this->prebooking = $delay;

		return $this;		
	}

    public function addmeta_datetimeVerbose(){ //used by e-resa for time zone problem fixing (*dtacc01*)
	
		// solution for displaying account location timezone
		// date & time are formatted by backend using account location time zone
		// and sent to js frontend dataset in new reservation properties
		
        $this->cueIn_yyyy = (int) Date('Y',$this->cueIn);
        $this->cueIn_mm =   (int) Date('m',$this->cueIn);
        $this->cueIn_dd =   (int) Date('d',$this->cueIn);
        $this->cueIn_wkday =(int) Date('w',$this->cueIn); //The number 0 is for Sunday. The number 6 is for Saturday
        $this->cueIn_hhmm = Date('H:i',$this->cueIn);


        C_dS_reservation::$defaults['cueIn_yyyy'] = 0;
        C_dS_reservation::$defaults['cueIn_mm'] = 0;
        C_dS_reservation::$defaults['cueIn_dd'] = 0;
        C_dS_reservation::$defaults['cueIn_wkday'] = 0;
        C_dS_reservation::$defaults['cueIn_hhmm'] = '';
    }
	public function dSmagnify4AI() { // prepares this dS for exchange with AI
		
        $this->visitorIds = '';
        $this->workcodeIds = '';
        $this->resourceIds = '';
		
		$this->billamount = $this->AIhumanpriceformat($this->billamount);
		
		return $this;
    }
	public function readCues4ai($inclusivedate = false, $inclusiveCueOut = true) {
		$tf = 'G:i'; // displays time like this: "9:20" with no heading zero
		$tf2 = 'l Y-m-d'; // displays date like this: "Monday 2024-12-30"
		$ci = new C_date($this->cueIn); $mdnci = $ci->getMDNstmp();
		$co = new C_date($this->cueOut); $mdnco = $co->getMDNstmp();
		$isoneday = $this->isoneday();
		$on = ''; if($inclusivedate) $on = 'on '.$ci->getSpokenDate();
		if($isoneday == 0) { // two cases here, inside one day, or spanning over days
			if($mdnci==$mdnco) { // that is the most common case of events fully scheduled inside a day.
				if($inclusiveCueOut) {
					return $on.' from '.Date($tf,$ci->t).' to '.Date($tf,$co->t); // that is the normal case of events inside a day.
				} else {
					return $speak = $on.' at '.Date($tf,$ci->t); // on Thursday the 1st of May at 8:50. Note that $on is void '' when $inclusivedate is false.
				}
			}
			else { // cueOut is not on the same day as cuIn. When it spans over days, we indicate day of the week and date
				return 'from '.$on.' on '.Date($tf,$ci->t).' to '.$co->getSpokenDate().' at '.Date($tf,$co->t);
			}
		}
		if($isoneday == 1) return ''; // see (*ai01*), we do not repeat the date as it was announced in the start of the diction.
		if($isoneday == -1) return 'from '.$ci->getSpokenDate().' to '.$co->dIncrement(-1)->getSpokenDate().' included'; // many full days starting on mindnight and finishing on midnight.
	}
	public function isoneday() { // returns 0 if the C_dS_resrevation does not stick to exact calendar days at midnight, -1 if the reservations spans over more than one day, and 1 if that is a one day event. 
		$ci = new C_date($this->cueIn); $ismdnci = $ci->isMDN();
		$co = new C_date($this->cueOut); $ismdnco = $co->isMDN(); $cidi = clone($ci)->dIncrement(); // the exact next midnight (taking care of timezone shifts twice a year).
		$isoneday = ($cidi->t == $co->t);
		if($ismdnci&&$ismdnco&&$isoneday) return 1; // then this is a one full day calendar event, we will generate some special output
		if($ismdnci&&$ismdnco) return -1; // many full days starting on mindnight and finishing on midnight.
		return 0; // is inside a day or overdays, but no full day(s).
	}
	
	// tags
	public function hastag($ccssid) {
		if(empty($this->cssTags)) return false;
		$found = in_array($ccssid, explode('!', $this->cssTags), true);
		return $found;
	}
	public function inserttag($ccssid) {   
		if(empty($this->cssTags)) {
			$this->cssTags = $ccssid; // first and only one
			return $this; 
		}
		if($this->hastag($ccssid)) return $this;
		$rray = explode('!', $this->cssTags); // 84651!58412!47895
		$rray[] = $ccssid; // add the newbie $ccssid
		$this->cssTags = implode('!',$rray); // 84651!58412!47895!$ccssid
		return $this;
	}
	public function removetag($ccssid) {
		if(!$this->hastag($ccssid)) return $this;
		if(empty($this->cssTags))  return $this;
		$rray = explode('!', $this->cssTags);
		foreach($rray as $k => $v) if($v == $ccssid) unset($rray[$k]);
		$this->cssTags = implode('!',$rray);
		return $this;
	}
}
class C_dS_attendee extends C_dbID  { // group to a reservation
    public function getTableName() { return  'attendees'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $resourceType; 
    public $resourceId;
    public $archived;
    public static $multilines = false;
    // public static $prepared = array(
        // 'select' 	=> 0,
        // 'update' 	=> 0,
        // 'insert' 	=> 0,
        // 'delete' 	=> 0,
        // 'archive_select' 	=> 0,
        // 'archive_update' 	=> 0,
        // 'archive_insert' 	=> 0,
        // 'archive_delete' 	=> 0
    // );
    public static $defaults = array( 	
        'resourceType'	=> 0,
        'resourceId' 	=> 0,
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }

    public static $explained = array( 
        'groupId' 		=> 'id of the parent C_dS_reservation instance',
        'resourceType' 	=> 'type of the attending planning resource [2 for business agenda lines, 1 for staffing lines, 4 for facultative resources]',
        'resourceId' 	=> 'id of a C_dS_resource instance',
        'remoteRscid' 	=> 'identifier of a C_dS_resource according to the correlator defined in the sync login',
        'archived' 		=> 'this item has been archived'
	);
    
	
}
class C_dS_att_visitor extends C_dbID  { // group to a reservation
    public function getTableName() { return  'att_visitors'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $resourceType; 
    public $resourceId;
    public $archived;
    public static $multilines = false;
    // public static $prepared = array(
        // 'select' 	=> 0,
        // 'update' 	=> 0,
        // 'insert' 	=> 0,
        // 'delete' 	=> 0,
        // 'archive_select' 	=> 0,
        // 'archive_update' 	=> 0,
        // 'archive_insert' 	=> 0,
        // 'archive_delete' 	=> 0
    // );
    public static $defaults = array( 	
        'resourceType'=> 3,
        'resourceId' => 0,
        'archived' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }

    public static $explained = array( 
        'groupId' 		=> 'id of the parent C_dS_reservation instance',
        'resourceType' 	=> 'type of the attending visitor [3 for regular visitors]',
        'resourceId' 	=> 'id of a C_dS_visitor instance',
        'archived' 		=> 'this item has been archived'
	);
    public static $AIinstructions = array( 
		'mandatory' =>	'no. some C_dS_reservation might have no visitor, in this case you name it "event" instead of "appointment"',
        // 'address,zipCode,city'	=> 'when not set, the appointment place is the default business place'
	);
    

}
class C_dS_resapart extends C_dbID  { // group to a reservation

    public function getTableName() { return  'resaparts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $cueIn;
    public $cueOut;
    public $archived;
    public static $multilines = false;
    public static $defaults = array(
        'cueIn'			=> 0,
        'cueOut' 		=> 0,
        'archived' 		=> 0
    );
    public function getDefaults() { return self::$defaults; }	

    public static $explained = array( 
        'groupId' 		=> 'unique id of the parent C_dS_reservation',
        'cueIn'			=> 'date and time for the start of this sub-reservation part [1970-12-30 15:15]',
        'cueOut' 		=> 'date and time for the end of this sub-reservation part [1970-12-30 15:45]',
        'archived' 		=> 'this item has been archived'
	);
    
}
class C_dS_resa_serie extends C_dbTrackingCCD  { // group to an account

    public function getTableName() { return  'resa_series'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $stitle;
    public static $multilines = false;
    public static $prepared = array(
        // 'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        // 'delete' 	=> 0
    );
    public static $defaults = array(
        'stitle'			=> '',
    );
    public function getDefaults() { return self::$defaults; }	
    public static $explained = array(
		'id' =>	'unique id of this C_dS_resa_serie instance',
        'groupId' 	=> 'id of the parent C_dS_group',
        'stitle'	=> 'serie title [free text]'
	);
    
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream($tracking, $sep, $flds); }
}
class C_dS_cToggle extends C_dbID  { // group to an account
    // indication of a disabled communication
    public function getTableName() { return  'comm_toggles'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $reservationId; 
    public $resourceId; // is the Id of the class_visitor (or class_buf) instance that will not receive the messages
    public $msgMedium; // SMS or Emails
    public $templateId;
    public $onoff;
    public static $multilines = false;
    public static $defaults = array( 	
        'reservationId'	=> 0,
        'resourceId' 	=> 0,
        'msgMedium'		=> 0,
        'templateId' 	=> 0,
        'onoff' 	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public static function removeResource($resourceId, $resourceType) { // this targets notifications to be sent to resources via logins

        $q = new Q('SELECT id FROM templates_sms WHERE target = '.$resourceType.';');
        $ids = $q->ids();
        if($ids) new Q('DELETE FROM comm_toggles WHERE resourceId = '.$resourceId.' AND templateId IN ('.$ids.');');

        $q = new Q('SELECT id FROM templates_email WHERE target = '.$resourceType.';');
        $ids = $q->ids();
        if($ids) new Q('DELETE FROM comm_toggles WHERE resourceId = '.$resourceId.' AND templateId IN ('.$ids.');');
    }
}
class C_dS_prebooking extends C_dbID { // groups to an account, keeps info about a reservation that should be canceled after a given delay
    public static function tableName() { return  'prebooking_delays'; }
    public function getTableName() { return self::tableName(); }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $reservationId; // 
    public $delay; // a multiple of the cron tempo (every 1 minute at the time of writing)
    public static $multilines = false;
    public static $defaults = array( 
        'reservationId'		=> 0,
        'delay'				=> 1
    );
    public function getDefaults() { return self::$defaults; }
    public function magnify() {

        $this->dS_resa = new C_dS_reservation($this->reservationId);
        $this->dS_resa->magnify();
        return $this; 
    }
	public static function queue($dS_resa, $delay) { // queues or drop a reservation from the queue
        $resaId = $dS_resa->id;
		if($delay==0) { // drop from queue
			new Q('delete from prebooking_delays where reservationId='.$resaId.';');
			return false;
			
		} else { // do queue or change the delay value

			// check if this reservation was queued already (if the reservation is re-opened, adapted and re-saved during the delay, we re-init the delay only)
			$q = new Q('select id from prebooking_delays where reservationId='.$resaId.';');
				$queuedYet = $q->ids();
			$delayed = new C_dS_prebooking($queuedYet); // creates a new record when $queuedYet is empty, else opens the existing one

			if($queuedYet) {
				$delayed->delay = 1+$delay; // restart the delay
				$delayed->dSsave();
			} else {
				$delayed->reservationId = $resaId;
				$delayed->delay = 1+$delay;
					$accountId = $dS_resa->groupId;
				$delayed->dSsave($accountId);
			}
			return $delayed;
		}
    }
	public static function is($dS_resa) { // queues or drop a reservation from the queue
		$q = new Q('select count(1) as c from prebooking_delays where reservationId='.$dS_resa->id.';');
		return !!$q->c(); // returns true if this resa is on the prebooking delay queue
	}
}

define('class_shadow'				, 29);

// reservation classes:
//
define('class_resa_any'				, 10);	// can be a trigger_class in msg template records (this value is recorded in DB in templates table, linked to triggerClass)
define('class_resa_appointment'		, 11);
define('class_resa_offdays'			, 12);
define('class_resa_event'			, 13);

define('class_note'					, 14);
define('class_task'					, 15);
define('class_chat'					, 16);
define('class_file'					, 17);
define('class_product'				, 18);

define('class_resource_tracking'	, 32);




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A V A I L A B I L I T I E S
//
class C_dS_availability extends C_dbID  { // group to an account
    public function getTableName() { return  'availabilities'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { 
        parent::__construct($id, $groupId, $preset); 
    }
    public function __clone() { parent::__clone(); }
	public $cueIn;
    public $cueOut;
    public static $multilines = array(
    );
    public static $defaults = array(
        'cueIn'			=> 0,
        'cueOut' 		=> 0
    );
	
    public function dSsave($groupId = false) {
		return true; // this object has no table in DB
		$this->rversion++;
        return parent::dSsave($groupId);
    }
	
    public function getDefaults() { return self::$defaults; }	
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking, $sep, $flds); }
    public function isOffDays() {
        $in = new C_date($this->cueIn);
        $out = new C_date($this->cueOut);
        if($in->isMidnight() && $out->isMidnight()) return true;
        return false;
    }
	public function isClose($h) { // starts this reservation in the period starting now and ending now plus $h hours ?
	
		// an identical js function operates at client side, see (*ic10*)
	
        $utcnow = time(); // defaults to today now
        $utccue = $this->cueIn; // reservation start time
		$utcgap = $h*3600;
		$d = $utccue-$utcnow;
		
		// see here (*ic10*)
		//
		//         utcnow                               utccue           utcnow + utcgap
		//         |                                    |                |
		//         |                                    |                |
		// --------+------------------------------------+----------------+------------>
		//         |                                    |                |
		//         |                d                   |                |
		//         + <--------------------------------> |                |
		//         |                                                     |
		//         |                    utcgap                           |
		//         + <-------------------------------------------------> +
		//         |                                                     |
		
		if($d>=0 && $d<$utcgap) return true;
		return false;
		
    }
	public function isPast() { // starts this reservation in the period starting now and ending now plus $h hours ?
	
		// an identical js function operates at client side, see (*ic10*)
	
        $utcnow = time(); // defaults to today now
        $utccue = $this->cueIn; // reservation start time
		$d = $utccue-$utcnow;
		
		// see here (*ic11*)
		//
		//         utcnow                               utccue           
		//         |                                    |                
		//         |                                    |                
		// --------+------------------------------------+--------->
		//         |                                    |                
		//         |                d                   |                
		//         + <--------------------------------> |                
		//         |                                                     
		
		if($d<=0) return true;
		return false;
		
    }
    public function gmtshift($gmtshift) {
        $this->cueIn -= $gmtshift;
        $this->cueOut -= $gmtshift;
    }
	public function setstringtimeformat($utc=false, $tz=false, $tf = 'Y-m-d H:i') {
		if($utc) return $this; // skip this process if the user wants to keep utc format
		if($tz=='TZ') {
			$this->cueIn = Date('Y-m-d',$this->cueIn).'T'.Date('H:i',$this->cueIn).'Z';
			$this->cueOut = Date('Y-m-d',$this->cueOut).'T'.Date('H:i',$this->cueOut).'Z';
		} else {
			$this->cueIn = Date($tf,$this->cueIn);
			$this->cueOut = Date($tf,$this->cueOut);
		}
		// echo $tf.' '.$this->cueIn.chr(10);
		return $this;
	}	
    public static $explained = array( 
		'id' 			=>'unique id of this C_dS_availability instance in the scope of C_dS_availability instances.',
        'cueIn'			=> 'date and time for the start of this availability.',
        'cueOut' 		=> 'date and time at the end of this availability.', 
		
		'workcodeIds'	=> 'id of a C_dS_workcode that is planned to be serviced.',
		'resourceIds'	=> 'id of a C_dS_resource that references the calendar holding the availability.'
    );
	public function dSmagnify4AI() { // prepares this dS for exchange with AI
		
        $this->workcodeIds = '';
        $this->resourceIds = '';
		
		return $this;
    }
	public function readCues4ai($inclusivedate = false, $inclusiveCueOut = true) {
		$tf = 'G:i'; // displays time like this: "9:20" with no heading zero
		$tf2 = 'l Y-m-d'; // displays time like this: "Monday 2024-12-30 on 9:20" with no heading zero
		$ci = new C_date($this->cueIn); $mdnci = $ci->getMDNstmp();
		$co = new C_date($this->cueOut); $mdnco = $co->getMDNstmp();
		$isoneday = $this->isoneday();
		$on = ''; if($inclusivedate) $on = 'on '.$ci->getSpokenDate();
		if($isoneday == 0) { // two cases here, inside one day, or spanning over days
			if($mdnci==$mdnco) { // that is the most common case of events fully scheduled inside a day.
				if($inclusiveCueOut) {
					return $on.' from '.Date($tf,$ci->t).' to '.Date($tf,$co->t); // that is the normal case of events inside a day.
				} else {
					return $speak = $on.' at '.Date($tf,$ci->t); // on Thursday the 1st of May at 8:50. Note that $on is void '' when $inclusivedate is false.
				}
			}
			else { // cueOut is not on the same day as cuIn. When it spans over days, we indicate day of the week and date
				return 'from '.$on.' on '.Date($tf,$ci->t).' to '.$co->getSpokenDate().' at '.Date($tf,$co->t);
			}
		}
		if($isoneday == 1) return ''; // see (*ai01*), we do not repeat the date as it was announced in the start of the diction.
		if($isoneday == -1) return 'from '.$ci->getSpokenDate().' to '.$co->dIncrement(-1)->getSpokenDate().' included'; // many full days starting on mindnight and finishing on midnight.
	}
	public function isoneday() { // returns 0 if the C_dS_resrevation does not stick to exact calendar days at midnight, -1 if the reservations spans over more than one day, and 1 if that is a one day event. 
		$ci = new C_date($this->cueIn); $ismdnci = $ci->isMDN();
		$co = new C_date($this->cueOut); $ismdnco = $co->isMDN(); $cidi = clone($ci)->dIncrement(); // the exact next midnight (taking care of timezone shifts twice a year).
		$isoneday = ($cidi->t == $co->t);
		if($ismdnci&&$ismdnco&&$isoneday) return 1; // then this is a one full day calendar event, we will generate some special output
		if($ismdnci&&$ismdnco) return -1; // many full days starting on mindnight and finishing on midnight.
		return 0; // is inside a day or overdays, but no full day(s).
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    S M S ,   E M A I L S  ,  and   N O T I F I C A T I O N S
//
define('msg_medium_email', 139);  // (*mm00*)
define('msg_medium_notif', 189);
define('msg_medium_SMS', 200);

define('reminder_target_visitor', 	class_visitor); // (*mt01*)
define('reminder_target_bCal', 		class_bCal);
define('reminder_target_uCal', 		class_uCal);
define('reminder_target_fCal', 		class_fCal);

class C_dS_notifTemplate extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'templates_notif'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $title;
    public $message;
    public $deliveryTime;
    public $deliveryDelay;
    public $triggerId;
    public $triggerClass;
    public $presenceList;
    public $advance;
    public $sendComms;
    public $target;
    public $altLanguage1;
    public $altTitle1;
    public $altMessage1;
    public $altLanguage2;
    public $altTitle2;
    public $altMessage2;
    public $filterOnActions;
    public $filterOnLogins;
    public $filterOnResources;
    public $filterOnWorkcodes;
    public $actions;
    public $logins;
    public $resources;
    public $workcodes;
    public static $multilines = array(
        'message'	=> 1,
        'altMessage1'	=> 1,
        'altMessage2'	=> 1,
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name'				=> '', 
        'title'			=> '', 
        'message'			=> '', 
        'deliveryTime'		=> 72000,  	// that is 8 pm (when the notification should be sent)
        'deliveryDelay'		=> 15,  	// relevant when trigger notification_on_action is selected
        'triggerId'			=> remind_days_eve, 
        'triggerClass'		=> class_resa_any, // the creation of an appointment triggers the creation of the notification
        'presenceList'		=> 0, 	// only for scheduled messaging, when on, the visitor that is twice on the planning gets a reminder only for the soonest appointment
        'advance'			=> 0, 	// a number of seconds retrieved from the scheduled agenda time when compiling the sms message
        'sendComms'			=> 1, 	// [0,1,2] automatic sending of the msg. 0 for default d�activated, 1 for pre-activated, 2 is activated only for current calendar day action. See C_iCOMM (*as01*)	
        'target'			=> reminder_target_visitor,
        'altLanguage1'		=> 255,
        'altTitle1'		=> '',
        'altMessage1'		=> '',
        'altLanguage2'		=> 255,
        'altTitle2'		=> '' ,
        'altMessage2'		=> '' ,
        'filterOnActions'		=> 0 ,
        'filterOnLogins'		=> 0 ,
        'filterOnResources'		=> 0 ,
        'filterOnWorkcodes'		=> 0 ,
        'actions'		=> 7, 	// binary 1|2|4, 1=creation, 2=modification, 3=deletion
        'logins'		=> '' , // filters, message is sent only for the logins listed here
        'resources'		=> '' , // filters, message is sent only for the resources listed here
        'workcodes'		=> '' 	// filters
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }

    public function getMedium() { return msg_medium_notif; } // (*mm00*)
    public function getMediumName() { return 'Notification'; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }

}
class C_dS_emailTemplate extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'templates_email'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $subject;
    public $message;
    public $deliveryTime;
    public $deliveryDelay;
    public $triggerId;
    public $triggerClass;
    public $presenceList;
    public $advance;
    public $sendComms;
    public $target;
    public $altLanguage1;
    public $altSubject1;
    public $altMessage1;
    public $altLanguage2;
    public $altSubject2;
    public $altMessage2;
    public $filterOnActions;
    public $filterOnLogins;
    public $filterOnResources;
    public $filterOnWorkcodes;
    public $actions;
    public $logins;
    public $resources;
    public $workcodes;
    public static $multilines = array(
        'message'	=> 1,
        'altMessage1'	=> 1,
        'altMessage2'	=> 1,
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name'				=> '', 
        'subject'			=> '', 
        'message'			=> '', 
        'deliveryTime'		=> 72000,  	// that is 8 pm (when the email should be sent)
        'deliveryDelay'		=> 15,  	// relevant when trigger notification_on_action is selected
        'triggerId'			=> remind_days_eve, 
        'triggerClass'		=> class_resa_any, // the creation of an appointment triggers the creation of the email
        'presenceList'		=> 0, 	// only for scheduled messaging, when on, the visitor that is twice on the planning gets a reminder only for the soonest appointment
        'advance'			=> 0, 	// a number of seconds retrieved from the scheduled agenda time when compiling the sms message
        'sendComms'			=> 1, 	// [0,1,2] automatic sending of the msg. 0 for default deactivated, 1 for pre-activated, 2 is activated only for current calendar day action. See C_iCOMM (*as01*)	
        'target'			=> reminder_target_visitor,
        'altLanguage1'		=> 255,
        'altSubject1'		=> '',
        'altMessage1'		=> '',
        'altLanguage2'		=> 255,
        'altSubject2'		=> '' ,
        'altMessage2'		=> '' ,
        'filterOnActions'		=> 0 ,
        'filterOnLogins'		=> 0 ,
        'filterOnResources'		=> 0 ,
        'filterOnWorkcodes'		=> 0 ,
        'actions'		=> 7, // binary 1|2|4, 1=creation, 2=modification, 3=deletion
        'logins'		=> '' , // filters, message is sent only for the logins listed here
        'resources'		=> '' , // filters, message is sent only for the resources listed here
        'workcodes'		=> '' 	// filters
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }

    public function getMedium() { return msg_medium_email; } // (*mm00*)
    public function getMediumName() { return 'Email'; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }

}
class C_dS_smsTemplate extends C_dbTrackingCCD  { // group to an account
    public function getTableName() { return  'templates_sms'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $name;
    public $message;
    public $deliveryTime;
    public $deliveryDelay;
    public $triggerId;
    public $triggerClass;
    public $presenceList;
    public $advance;
    public $pages; // 1 byte in DB, maximum size of the template message in number of SMS pages, see (*mp01*). Varies from 1 to 10. According to encoding (ucs2,ansi7) and provider (smsgateaway, shortcode), the number of allowed characters is calculated, see (*sg04*)
    public $sendComms; // this field contains an indication that this template is disabled or enabled by default. When toggled, the indication relies in comm_toggles.
    public $target;
	public $smsgateaway;
	public $encoding;
	public $priority;
	public $inboundaction;
	public $autoreplymsg;
	
    public $altLanguage1;
    public $altMessage1;
    public $altLanguage2;
    public $altMessage2;
	
    public $filterOnActions;
    public $filterOnLogins;
    public $filterOnResources;
    public $filterOnWorkcodes;
    public $actions;
    public $logins;
    public $resources;
    public $workcodes;
    public static $multilines = array(
        'message'	=> 1,
        'autoreplymsg'	=> 1,
        'altMessage1'	=> 1,
        'altMessage2'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'name'				=> '', 
        'message'			=> '', 
        'deliveryTime'		=> 72000,  // that is 8 pm (when the sms should be sent)
        'deliveryDelay'		=> 15,  // relevant when trigger notification_on_action is selected
        'triggerId'			=> remind_days_eve, 
        'triggerClass'		=> class_resa_any, // the creation of an appointment triggers the creation of the sms
        'presenceList'		=> 0, // only for scheduled messaging, when on, the visitor that is twice on the planning gets a reminder only for the soonest appointment		
        'advance'			=> 60, // used when notification is sent X minutes ahead of the scheduled appointment. X = advance
        'pages'				=> 0, // allows to send multi-pages sms [ 1 to 18 pages according to proximus. We implement 1 to 10 in Mobminder ]
        'sendComms'			=> 1, 	// [0,1,2] automatic sending of the msg. 0 for default d�activated, 1 for pre-activated, 2 is activated only for current calendar day action. See C_iCOMM (*as01*)	
        'target'			=> reminder_target_visitor,
			'smsgateaway'	=> 'shortcode',
			'encoding'		=> 'ascii7', // can range [ascii7, ucs2]
			'priority'		=> 0,
			'inboundaction'		=> 'ignore', // ranges [ignore, frwdemail, frwdmobile], see (*sg08*)
			'autoreplymsg'		=> '',
        'altLanguage1'		=> 255,
        'altMessage1'		=> '',
        'altLanguage2'		=> 255,
        'altMessage2'		=> '' ,
			'filterOnActions'		=> 0 ,
			'filterOnLogins'		=> 0 ,
			'filterOnResources'		=> 0 ,
			'filterOnWorkcodes'		=> 0 ,
			'actions'		=> 7, // binary 1|2|4, 1=creation, 2=modification, 3=deletion
			'logins'		=> '' ,
			'resources'		=> '' ,
			'workcodes'		=> '' 
    );
    public function getDefaults() { return self::$defaults; }
    public function getName() { return $this->name; }
    public function getMedium() { return msg_medium_SMS; } // (*mm00*)
    public function getMediumName() { return 'SMS'; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}


define('sms_nosms'		, 0);	// (*mob33*)
define('sms_created'	, 1);	// initial status
define('sms_retry'		, 2);	// the provider was not available
define('sms_handled'	, 3);	// sms successfully passed to provider
define('sms_pending'	, 4);	// sms is pending in operator's network
define('sms_delivered'	, 5);	// sms has been delivered into the destination mobile mobile
define('sms_discarded'	, 6);	// sms has timed out in operator's network and has been deleted
define('sms_retained'	, 7);	// at the moment it had to be sent, the group option sendSMSs was set to 'No'
define('sms_iso'		, 8);	// destination number is equal to expeditor number
define('sms_error'		, 9);	// the provider api has fucked us away
define('sms_dead_numb'	,10);	// the number is no longer valid


class C_dS_email extends C_dbTrackingCC  { // group to an account
    public function getTableName() { return  'emails'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $reservationId;
    public $templateId;
    public $resourceId; // can be a group resource or a visitor id, depending on the template target
    public $sendStamp;
    public $mailsubject;
    public $mailbody;
    public $recipients;
    public $sender;
    public $status;
    public $statusChangeStamp;
    public static $multilines = array(
        'mailbody'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'reservationId'		=> 0, 
        'templateId'		=> 0, 
        'resourceId'		=> 0, 
        'sendStamp'			=> 0,  // that is 8 pm
        'mailsubject'		=> '', 
        'mailbody'			=> '', 
        'recipients'		=> '', 
        'sender'			=> 'rappelsmsbe', 
        'status'			=> sms_created, 
        'statusChangeStamp'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking, $sep, $flds); }
}
class C_dS_notification extends C_dbTrackingCC  { // group to an account
    public function getTableName() { return  'notifications'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $reservationId;
    public $templateId;
    public $resourceId; // can be a group resource or a visitor id, depending on the template target
    public $sendStamp;
    public $title;
    public $message;
    public $recipientId; // which is either a loginId or a visitorId (PVH 2022: visitorId when we'll have a visitor's smartapp)
    public $sender;
    public $status;
    public $statusChangeStamp;
    public static $multilines = array(
        'message'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 	
        'reservationId'	=> 0, 
        'templateId'	=> 0, 
        'resourceId'	=> 0, 
        'sendStamp'		=> 0,
        'title'			=> '', 
        'message'		=> '', 
        'recipientId'	=> 0, // which is either a loginId or a visitorId (PVH 2022: visitorId when we'll have a visitor's smartapp)
        'sender'		=> '', 
        'status'		=> sms_created, 
        'statusChangeStamp'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dS_sms extends C_dbTrackingCC  { // group to an account
    public function getTableName() { return  'sms'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $reservationId;
    public $templateId;
    public $resourceId; // can be a group resource or a visitor id, depending on the template target
    public $sendStamp;
    public $text;
    public $pages;
    public $toNumber;
    public $replyNumber;
    public $correlator;			// route 1, used only when the gateaway imposes an own correlator
	
    public $status; 	// maintain coherence with naming of class members here (*sms01*)
    public $opStatus;
    public $statusChangeStamp;
	
    public $r2correlator;		// route 2, used only when the gateaway imposes an own correlator
    public $r2status;
    public $r2statusChangeStamp;
	
    public $r3correlator;		// route 3, used only when the gateaway imposes an own correlator
    public $r3status;
    public $r3statusChangeStamp;
	
    public static $multilines = array(
        'text'	=> 1
    );
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array(
        'reservationId'		=> 0, 
        'templateId'		=> 0, 
        'resourceId'		=> 0, 
        'sendStamp'			=> 0,  // that is 8 pm
        'text'				=> '', 
        'pages'				=> 0, 
        'toNumber'			=> '', 
        'replyNumber'		=> 'rappelsmsbe', 
        'correlator'		=> 0,  
        'status'			=> sms_created, 
        'opStatus'			=> '', 
        'statusChangeStamp'	=> 0,
        'r2correlator'			=> 0,  
        'r2status'				=> sms_nosms, 
        'r2statusChangeStamp' 	=> 0,
        'r3correlator'			=> 0,  
        'r3status'				=> sms_nosms, 
        'r3statusChangeStamp'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking, $sep, $flds); }
	public static $explained = array( 
        'id' 			=> 'unique id in the scope of C_dS_sms instances.',	
        'sendStamp' 	=> 'When this SMS was sent according to format "YYYY-MM-DD HH:MM".',	
        'toNumber' 		=> 'To what mobile number this SMS was sent.',	
        'text' 			=> 'The message of this SMS.',
    );
	public function setAIformats($dS_account) {
		
		$this->toNumber = mobileAIformat($this->toNumber, $dS_account->phoneRegion);
		
			$d = new C_date($this->sendStamp);
		$this->sendStamp = Date('Y-m-d l G:i',$d->t);
		return $this;
	}
}

class C_dS_delayedNotif extends C_dbID { // group to an account
    public static function tableName() { return  'delayed_notifs'; }
    public function getTableName() { return self::tableName(); }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $reservationId; // 
    public $medium; // email or SMS
    public $templateId; // this template applies to the reservation when delay reaches zero
    public $delay; // a multiple of the cron tempo (every 1 minute at the time of writing)
    public static $multilines = false;
    public static $defaults = array( 
        'reservationId'		=> 0,
        'medium'			=> msg_medium_email,
        'templateId'		=> 0,
        'delay'				=> 1
    );
    public function getDefaults() { return self::$defaults; }
    public function magnify() {

        // load template
        switch($this->medium) {
            case msg_medium_email: $this->dS_templ = new C_dS_emailTemplate($this->templateId); break;
            case msg_medium_SMS: $this->dS_templ = new C_dS_smsTemplate($this->templateId); break;
        }

        // load resources along with watchovers, when templates sends to logins
        $accountId = $this->dS_templ->groupId;
        $dbAccess_resources = new C_dbAccess_resources($accountId);
        if($this->dS_templ->target != class_visitor) // templates aims account logins that are watching over the resources, 
            $dbAccess_resources->addWatchovers();		

        // load reservation
        $this->dS_resa = new C_dS_reservation($this->reservationId);
        $this->dS_resa->magnify($dbAccess_resources);

        return $this; 
    }
    public function sendNotification($systemSendsComm) { // object must be magnified prior to using this function
        if(defined('crontest')) $dolog = crontest; else $dolog = false;

        $forceresend = false;
        $dS_account = new C_dS_group($this->dS_resa->groupId);
        if($dolog) echo '<br/>Treating delayed item with id:'.$this->id;

        if($this->dS_templ->triggerId == notification_on_action) { 
            $forceresend = true; // allows multiple sending on change actions (a first one at creation, then when changed...)

            $deletion = !!($this->dS_templ->actions&4); // this notification should leave also at deletion
            $onlydeletion = ($this->dS_templ->actions==4); // this notification should leave only at deletion
            $deleted = $this->dS_resa->deletorId != 0; // this reservation is deleted

            if( (!$deletion) && $deleted ) { // This notification is about creation or change, while the reservation has been deleted in between time
                if($dolog) echo '<br/>-> The appointment has been deleted during the delay period. No sending.';
                return; // Then abort the sending
            } else 
                if($onlydeletion && !$deleted) { // This notification is about deletion ONLY, while the reservation has been recovered in between time
                    if($dolog) echo '<br/>-> The appointment has been recovered during the delay period. No sending.';
                    return; // Then abort the sending
                }
        }

        sendResaMSGs($this->dS_resa, $this->dS_templ, $dS_account, $systemSendsComm, $forceresend);
    }
    public static function queue($dS_resa, $dS_template) {
        $medium = $dS_template->getMedium();
        $resaId = $dS_resa->id;
        $templId = $dS_template->id;

        // check if this reservation was queued already (if the reservation is re-opened, adapted and re-saved during the delay, we re-init the delay only)
        $q = new Q('SELECT id FROM delayed_notifs WHERE reservationId='.$resaId.' AND medium='.$medium.' AND templateId='.$templId.';');
        $queuedYet = $q->ids();
        $delayed = new C_dS_delayedNotif($queuedYet); // creates a new record when $queuedYet is empty, else opens the existing one

        if($queuedYet) {
            $delayed->delay = $dS_template->deliveryDelay; // restart the delay
            $delayed->dSsave();
            indent('A notification was queued already for this reservation and template (id '.$delayed->id.' in delayed_notifs)');
        } else {
            $delayed->reservationId = $resaId;
            $delayed->medium = $medium;
            $delayed->templateId = $templId;
            $delayed->delay = 1+$dS_template->deliveryDelay;
            $accountId = $dS_resa->groupId;
            $delayed->dSsave($accountId);
            indent('This is notification needs to be queued, the initial delay is '.$dS_template->deliveryDelay.' minutes (id '.$delayed->id.' in delayed_notifs)');
        }
        return $delayed;
    }
}


define('notification_on_action' ,0	); // values should match the client side (*triggers*)
define('notification_manual'	,99	);
define('notification_HminusX'	,90	);
define('notification_onVisitor'	,80	);
define('notification_onBirthday',81	);

define('remind_days_eve'		,1	);
define('remind_days_twodays'	,2	);
define('remind_days_threedays'	,3	);
define('remind_days_fourdays'	,4	);
define('remind_days_oneweek'	,7	);
define('remind_days_twoweeks'	,14	);

define('revival_days_one'		,-1	);
define('revival_weeks_one'		,-7	);
define('revival_weeks_two'		,-14	);
define('revival_month_one'		,-28	);
define('revival_months_two'		,-56	);
define('revival_months_three'	,-91	);
define('revival_months_five'	,-147	);
define('revival_months_six'		,-175	);
define('revival_months_nine'	,-266	);
define('revival_months_eleven'	,-329	);
define('revival_years_one'		,-357	);
define('revival_months_18'		,-539	); // we always try to have a multiple of 7 days (one week). So if you appointed on a monday, you get the revivla on a monday 
define('revival_years_two'		,-728	);





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    S T A T S
//

abstract class C_dbStats extends C_dbID {  // Creation and Change tracking

    public $created;
    public $changed;

    abstract function getClassName();
    abstract function getDefaults();
    abstract function getTableName();

    public function __construct($id=0, $groupId=false, $preset=false) { // preset applies at creation OR after existing object load
        parent::__construct($id, $groupId, $preset);
    }
    public function __destruct() { parent::__destruct(); }

    public function statSave() {

        // avoid having two records for the same measurement point
        $rescCheck = isset($this->resourceId) ? ' AND resourceId = '.$this->resourceId : '';
        $loginCheck = isset($this->loginId) ? ' AND loginId = '.$this->loginId : '';
        $ccssIdCheck = isset($this->ccssId) ? ' AND ccssId = '.$this->ccssId : '';
        $templIdCheck = isset($this->templateId) ? ' AND templateId = '.$this->templateId : '';
        $workCdIdCheck = isset($this->workCodeId) ? ' AND workCodeId = '.$this->workCodeId : '';
        $groupCheck = ' AND groupId = '.$this->groupId;
        $AND = $groupCheck.$rescCheck.$loginCheck.$ccssIdCheck.$templIdCheck.$workCdIdCheck;

        $q = new Q('SELECT id, created FROM '.$this->getTableName().' WHERE sunday = '.$this->sunday.$AND.';');
        $this->id = $q->one(); 
        $this->created = $q->one('created');

        $now = Date('Y-m-d H:i:s',time()); 
        $this->changed = $now;
        if($this->id<=0) { $this->created = $now; }
        return parent::dSsave();
    }
    public function dSdelete() {
        return parent::dSdelete();
    }
}

class C_dS_xmon_action extends C_dbStats  {
    public function getTableName() { return  'xmon_actions'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $loginId;
    public $resaNew;
    public $resaEdit;
    public $resaDel;
    public $appNew;
    public $appEdit;
    public $appDel;
    public $noteNew;
    public $noteEdit;
    public $noteDel;
    public $taskNew;
    public $taskEdit;
    public $taskDel;
    public $taskAssigned;
    public $taskAchieved;
    public $visiNew;
    public $visiEdit;
    public $visiMerge;

    public static $multilines = false;
    public static $defaults = array( 
        'sunday'	=> 0,
        'loginId'	=> 0,
        'resaNew'	=> 0,
        'resaEdit'	=> 0,
        'resaDel'	=> 0,
        'appNew'	=> 0,
        'appEdit'	=> 0,
        'appDel'	=> 0,
        'noteNew'		=> 0,
        'noteEdit'	=> 0,
        'noteDel'	=> 0,
        'taskNew'		=> 0,
        'taskEdit'	=> 0,
        'taskDel'	=> 0,
        'taskAssigned'		=> 0,
        'taskAchieved'		=> 0,
        'visiNew'		=> 0,
        'visiEdit'		=> 0,
        'visiMerge'		=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_xmon_actual extends C_dbStats  { // grouped by account, done by resource id
    public function getTableName() { return  'xmon_actuals'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $resourceId;
    public $offdayCount; // number of reservations by resource
    public $resaCount;
    public $appCount;
    public $offdayTime; // time spent by resource
    public $resaTime;
    public $appTime;

    public static $multilines = false;
    public static $defaults = array( 	
        'sunday'		=> 0,
        'resourceId'	=> 0,
        'offdayCount'	=> 0,
        'resaCount'		=> 0,
        'appCount'		=> 0,
        'offdayTime'	=> 0,
        'resaTime'		=> 0,
        'appTime'		=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_xmon_account extends C_dbStats  {
    public function getTableName() { return  'xmon_accounts'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $rescCount;
    public $visiCount;
    public $visiMobile;
    public $visiMales;
    public $visiFemales;
    public $loginsCount;

    public static $multilines = false;
    public static $defaults = array( 	
        'sunday'		=> 0,
        'rescCount'		=> 0,
        'visiCount'		=> 0,
        'visiMobile'	=> 0,
        'visiMales'		=> 0,
        'visiFemales'	=> 0,
        'loginsCount'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_xmon_sms extends C_dbStats  {
    public function getTableName() { return  'xmon_sms'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $templateId;

    public $r1handled;
    public $r1delivered;
    public $r1pending;
    public $r1error;
    public $r1nofeedback;

    public $r2handled;
    public $r2delivered;
    public $r2pending;
    public $r2error;
    public $r2nofeedback;

    public static $multilines = false;
    public static $defaults = array( 
        'sunday'		=> 0,
        'templateId'	=> 0,
        'r1handled'		=> 0,
        'r1delivered'	=> 0,
        'r1pending'		=> 0,
        'r1error'		=> 0,
        'r1nofeedback'	=> 0,
        'r2handled'		=> 0,
        'r2delivered'	=> 0,
        'r2pending'		=> 0,
        'r2error'		=> 0,
        'r2nofeedback'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_xmon_ccss extends C_dbStats  {
    public function getTableName() { return  'xmon_ccss'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $ccssId;
    public $actual;
    public $action;

    public static $multilines = false;
    public static $defaults = array( 
        'sunday'	=> 0,
        'ccssId'	=> 0,
        'actual'	=> 0,
        'action'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_xmon_perfs extends C_dbStats  {
    public function getTableName() { return  'xmon_performances'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }

    public $sunday; // timestamp of this statistic making
    public $workCodeId;
    public $actual;
    public $action;

    public static $multilines = false;
    public static $defaults = array( 
        'sunday'	=> 0,
        'workCodeId'=> 0,
        'actual'	=> 0,
        'action'	=> 0
    );
    public function getDefaults() { return self::$defaults; }
}


class C_dS_stat_gender extends C_dbID { // not grouped  // statitistics table // see (*gs01*)
    public function getTableName() { return  'stat_genders'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $name;
    public $males;
    public $females;
    public $gender;
    public $metaphone1;
    public $metaphone2;
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'name'		=> '',
        'males'		=> 0,
        'females'	=> 0,
        'gender' 	=> 0,
        'metaphone1' 	=> '',
        'metaphone2' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_stat_lastname extends C_dbID { // not grouped
    public function getTableName() { return  'stat_stat_lastnames'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $name;
    public $reduced;
    public $occurances;
    public $metaphone1;
    public $metaphone2;
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'name'		=> '',
        'reduced'		=> '',
        'occurances'	=> 0,
        'metaphone1' 	=> '',
        'metaphone2' 	=> ''
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_stat_address extends C_dbID { // not grouped, used for the auto complete option where addresses can be filled in
    public function getTableName() { return  'stat_addresses'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $street;
    public $zip;
    public $city;
    public $country;
    public $smetaphone1;
    public $smetaphone2;
    public $cmetaphone1;
    public $cmetaphone2;
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'street'		=> '',
        'zip'			=> '',
        'city'			=> '',
        'country' 		=> '',
        'smetaphone1'	=> '',
        'smetaphone2'	=> '',
        'cmetaphone1' 	=> '',
        'cmetaphone2'	=> ''
    );
    public function getDefaults() { return self::$defaults; }
}
class C_dS_stat_zip extends C_dbID { // not grouped, used for the auto complete option where a zip can be filled in
    public function getTableName() { return  'stat_zips'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false) { parent::__construct($id); }
    public $zip;
    public $city;
    public $country;
    public $cmetaphone1;
    public $cmetaphone2;
    public static $multilines = false;
    public static $prepared = array(
        'select' 	=> 0,
        'update' 	=> 0,
        'insert' 	=> 0,
        'delete' 	=> 0
    );
    public static $defaults = array( 
        'zip'			=> '',
        'city'			=> '',
        'country' 		=> '',
        'cmetaphone1' 	=> '',
        'cmetaphone2'	=> ''
    );
    public function getDefaults() { return self::$defaults; }
}



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

class C_dS_exception_smartapp extends C_dbTrackingC  { // flutter smart app exceptions 2020 / group to an access key
    public function getTableName() { return  'exceptions_smartapp'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset); }
    public $ua;
    public $version;
    public $rscid;
    public $criticity;
    public $class;
    public $function;
    public $msg;
    public static $multilines= array(
        'criticity'	=> 1,
        'class'		=> 1, 
        'function'	=> 1, 
        'msg'		=> 1
    );
    public static $defaults = array( 	
        'ua'		=> 'smartphone', 
        'version'	=> '0.00',
        'criticity'	=> 'low', 
        'rscid'		=> 0, 
        'criticity'	=> 'low', 
        'class'		=> 'not specified', 
        'function'	=> 'undefined', 
        'msg'		=> 'no message'
    );
    public function getDefaults() { return self::$defaults; }	
	public static $explained = array( 
        'ua' 		=> 'User agent (IOS or Android + OS version).',	
        'version' 	=> 'Mobminder smart app version + build.',	
        'groupId' 	=> 'Unique accesskey id (integer). Identifier for both originator login and account.',	
        'rscid' 	=> 'Unique resource id (integer). Optional, indicates which resource was displayed when log report occured',	
        'criticity' => 'Criticity level for this log, ranges [notice, warning, error, fatal]',	
        'class' 	=> 'Class/widget scope for this log (for debug purpose), free alpha max 128 chars.',	
        'function' 	=> 'Originatig function (for debug purpose), free alpha max 128 chars.',
        'msg' 		=> 'Log message. Free alpha text.',
    );
}




//////////////////////////////////////////////////////////////////////////////////////////////
//



//////////////////////////////////////////////////////////////////////////////////////////////
//



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    M U L T I    S E T    D B    A C C E S S 
//
//
//
//
//

class C_setKeyed { 		// same as C_set allowing access via alternative key
    public $keyed;		// allows to access references of $set using other keys

    public function __clone() { foreach($this->keyed as $key => $item) $this->keyed[$key] = clone $item; } // see (*dk01*)
    public function count() { return count($this->keyed); }

    public function getKeysList($filter=false) { // $filter will be used for view filtering
		if($filter) {
			$ids = explode(',',$filter);
			$o = Array();
			foreach($ids as $id) if(array_key_exists($id, $this->keyed)) $o[] = $id;
			return $o;
		} else
			return array_keys($this->keyed);
	}
    public function hasKey($key) { return array_key_exists($key, $this->keyed); }

    public function __construct() {	
		$this->keyed = array(); 
		// echo 'C_setKeyed::'.$this->getClassName();
	}
    public function __destruct() { unset($this->keyed);	}

    public function getfirst() { $o = false; foreach($this->keyed as $id=>$o) break; return $o; }
    public function getlast() { $o = false; foreach($this->keyed as $id=>$o); return $o; } 
    public function reset($but=false) { unset($this->keyed); $this->keyed = array(); if($but) $this->add($but); }
    public function add($item, $key = false) { if($key===false) $key = $item->id; $this->keyed[$key] = $item; return $item; }
    public function last() { return end($this->keyed); }
    public function absorb($o_setKeyed) { 
        if($o_setKeyed->count())
            foreach($o_setKeyed->keyed as $key => &$item)
                $this->keyed[$key] = &$item;
        unset($item);
        return $this;
    }
    public function remove($key, $caller = "") {
        if(!array_key_exists($key,$this->keyed)) {
            die($caller."::C_setKeyed::remove($key) - trying to remove an unexisting key");
        }
        unset($this->keyed[$key]);
    }
    public function changeKey($oldKey,$newKey) {
        $item = &$this->keyed[$oldKey];
        unset($this->keyed[$oldKey]);
        $this->add($item,$newKey);
        return $item;
    }
    public function testDisplay() { 
        // this function works only if $set contains printable types. Will not work with references to objects
        echo "</br> C_set counts ".$this->count()." items: ";
        foreach($this->keyed as $key => $item) {
            echo "</br> &nbsp;&nbsp;&nbsp;item keyed by ".$key." -> testDisplay(): ";
            echo $item->testDisplay();
        }
    }
	public function intersect($setKeyed) {
		if($setKeyed->count()===0) {
			$this->reset();
			return $this;
		}
		$this->keyed = array_intersect_key($this->keyed, $setKeyed->keyed);
		return $this;	
	}
}

abstract class C_dbGate extends C_setKeyed {
    // manage connection opening/closing to DB
    private static $instances = 0; // number of C_dbGate objects instanciated any moment
    private static $hits = 0;	// number of DB rows accessesed

    public $grouped = false;

    // abstract function ,must exist in child class - gets specific data from child class
    abstract function getNew(); 
    abstract function getClassName(); 
    abstract function getTableName();

    private function getNextVirtual() {
        $nextKey = -1;
        if($this->count())
            while(array_key_exists($nextKey,$this->keyed)) $nextKey--; // generates negative ids as those items ar new and not in DB yet
        return $nextKey;
    }
    public function newVirtual($cloneThis=false) {
        $nextKey = self::getNextVirtual();
        // if($cloneThis) $dataSet = $this->add($this->getClone($cloneThis),$nextKey); // getClone() defined e.g. inside C_dbAccess_reservations
        if($cloneThis) $dataSet = $this->add($this->getClone($cloneThis),$nextKey); // getClone() defined e.g. inside C_dbAccess_reservations
        else $dataSet = $this->add($this->getNew(),$nextKey); 
        $dataSet->id = $nextKey; 
        return $dataSet; 
    }

    public function __clone() { // copies objects of one collection into this one, cloning the dS objects (note that getClone() must be defined in the dbAccess class)
        parent::__clone();
    }
    public function __construct() {
        parent::__construct(); 
    }
    public function __destruct() { }//unset($this->o_db);	}
    protected function queryMany($SQL) {

        $cn = $this->getClassName().'::C_dbGate::queryMany()';
        $r = C_dbIO::q($SQL, $cn);
        if(is_object($r)) { self::$hits += $r->num_rows; return $r; }
        else { self::$hits += C_dbIO::hit(); return C_dbIO::iid(); }
    }
    public function loadMany($SQL) {

        $cn = $this->getClassName().'::C_dbGate::loadMany()'; // caller name
        $r = C_dbIO::q($SQL, $cn);
		
        self::$hits += $r->num_rows;
		
        while($row = $r->fetch_array()) {
            $dS = $this->add($this->getNew(),$row['id']);
            if($this->grouped!==false) { // option activated through loadOnGroup
                $g = $row['groupId'];
                if(!isset($this->grouped[$g])) $this->grouped[$g] = Array();
                $this->grouped[$g][$row['id']] = $dS;
            }
            foreach($dS as $member => &$value) $value = $row[$member];	
        }
        $r->close();
    }

    // GENERIC INTERFACE FUNCTIONS
    public function reset($but = false) { // reset the collection, discarding changes and leaving dataBase unchanged
        C_setKeyed::reset($but);
    }
    // public function save(&$id_OR_dS_, $groupId = false, $noTracking = false) {
    public function save($id_OR_dS_, $groupId = false, $noTracking = false) {

        if(is_object($id_OR_dS_)) { // there is a former object that we can use as default
            parent::add($id_OR_dS_);
        } else
            $id = $id_OR_dS_;

        if(!array_key_exists($id,$this->keyed))
            return false; // gently return if you call me on a wrong id

        // $dataSet = &$this->keyed[$id];
        $dataSet = $this->keyed[$id];

        if($noTracking) $dataSet->save($groupId);
        else $dataSet->dSsave($groupId);

        if($id < 0) $this->changeKey($id, $dataSet->id); // the dataSet was new

        return $dataSet->id;
    }
    public function saveAll($groupId = false, $noTracking = false) { // scans this set, updates replica's and insert virtuals
        $ids = array_keys($this->keyed);
        if($this->count()) foreach($ids as $id) self::save($id, $groupId, $noTracking);
    }
    public function copySave($groupId = false) { // resave the dSets in current collection, changing the groupId (used e.g. when copying an account)
        $ids = array_keys($this->keyed);
        if($this->count())
            foreach($ids as $id) {
                $dS = $this->keyed[$id];
                $dS->id = self::getNextVirtual();
                $this->changeKey($id, $dS->save($groupId)->id); // save iso dSsave will not modify the tracking information
            }
    }
    public function moveSave($groupId = false) { // save the dSets in current collection, changing the groupId (used e.g. when copying an account)
        $ids = array_keys($this->keyed);
        if($this->count())
            foreach($ids as $id) {
                $dS = $this->keyed[$id];
                $dS->dSsave($groupId); 
            }
    }
    public function absorbAsNew($o_dbAccess, $groupId = false) { // takes a copy of each items in o_dbAccess and assign them a new virtual id and a new groupId
        
		// /!\ when groupId passed, it re-writes groupId for the entire $o_dbAccess passed collection
		
		$ids = array_keys($o_dbAccess->keyed);
        if(!count($ids)) return $this;
        foreach($ids as $id) {
			 
            // $item = clone $o_dbAccess->keyed[$id]; // PVH 2025 the clone() way is not compatible with C_BdiD::prepare() plan
            // $item->id = self::getNextVirtual();
            // if($groupId !== false) { $item->groupId = $groupId+0;
					// $cn = $this->dataSetClassName();
				// if($cn == 'C_dS_attendee')
					// echo 'absorbAsNew() groupId = '.$item->groupId.chr(10);
			// }
            // parent::add($item);
			
			$nuid = self::getNextVirtual();
            $item = $this->newVirtual($o_dbAccess->keyed[$id]); // this makes a real __construct base on the getClone() function, C_BdiD::__construct is mandatory to manipulate C_dS_sets with prepare() enabled
			
            if($groupId !== false) { 
				$item->groupId = $groupId+0;
					// $cn = $this->dataSetClassName();
				// if($cn == 'C_dS_attendee')
					// echo $cn.' <> absorbAsNew() groupId = '.$item->groupId.chr(10);
			}
            parent::add($item);
			
			
        }
        return $this;
    }

    public function delete($id) { // deletes one objects in this instance, virtual or replica
        if(!array_key_exists($id,$this->keyed)) return;
        if($id>=0) { $dataSet = &$this->keyed[$id];	$dataSet->dSdelete(); } // delete from DB
        $this->remove($id, get_class().'::delete()->'); // remove virtual
    }
    public function deleteOnResource($resourceId, $resourceType = false) { // deletes objects from DB, then virtuals and/or replica if any is loaded
        // remove from DB
        if($resourceId>=0) { // adapt DB if the target is not a virtual
            $onType = $resourceType? ' AND resourceType='.$resourceType : '';
            $SQL = 'DELETE FROM '.$this->getTableName().' WHERE resourceId ='.$resourceId.$onType.';';

            $cn = $this->getClassName().'::C_dbGate::loadMany()';	
            C_dbIO::q($SQL, $cn);
            self::$hits += C_dbIO::hit();
        }
        // remove replica's
        foreach ($this->keyed as $id => $o_dS)
            if($o_dS->resourceId == $resourceId)
                $this->remove($id, get_class().'::delete()->');
    }	
    public function deleteAll() { // deletes all objects having a replica in this instance
        if($this->count()) foreach ($this->keyed as $id => $item) $this->delete($id);
        C_setKeyed::reset();
    }
    public function deleteOnGroup($groupId) { // delete all group related rows in DB, regardless of they were loaded in this instance or not

        $SQL = 'DELETE FROM '.$this->getTableName().' WHERE groupId='.$groupId.';';

        $cn = $this->getClassName().'::C_dbGate::deleteOnGroup()';	
        C_dbIO::q($SQL, $cn); self::$hits += C_dbIO::hit();

        $c = 0;	// now remove replica's in this collection
        if($this->count()) {
            foreach ($this->keyed as $item)
                if($item->groupId == $groupId)
                    $matches[$c++] = $item->id;

            for($i=0; $i<$c; $i++)
                $this->remove($matches[$i], get_class().'::deleteOnGroup()->');
        }
    }
    public function deleteOnResaId($reservationId) { // delete all group related rows in DB, regardless of they were loaded in this instance or not

        if($reservationId > 0) {
            $SQL = 'delete from '.$this->getTableName().' where reservationId='.$reservationId.';';

            $cn = $this->getClassName().'::C_dbGate::deleteOnResaId()';	
            C_dbIO::q($SQL, $cn); self::$hits += C_dbIO::hit();
        }
        $matched = Array();
        if($this->count())
            foreach ($this->keyed as $item)
                if($item->reservationId == $reservationId)
                    $matched[] = $item->id;

		foreach($matched as $index => $id)
            $this->remove($id, get_class().'::deleteOnGroup()->');
    }

    public function loadAll() {
		// note the writing if 'SELect' in the following sql, that is very usefull on MySQL error/longquery logs as it gives a clue on where this query resides in our code
        $SQL = 'SELect * FROM '.$this->getTableName().';';
        C_dbGate::loadMany($SQL);
        return $this;
    }
    public function loadOnId($id, $die = true, $exclude = false) { // by default, dies if you tried to access an unexisting item.
        if(!$id) return $this;
        $inclusion = 'iN';
        $groupFilter = ''; // note that group filter is not necessary when you specify ids
        if($exclude) {  // !! then $exclude must specify a group id !!
            $inclusion = 'NOT IN';
            $groupFilter = ' AND groupId IN ('.$exclude.')';
        }
		// note the writing if 'SelecT' in the following sql, that is very usefull on MySQL error/longquery logs as it gives a clue on where this query resides in our code
        $SQL = 'SelecT * FROM '.$this->getTableName().' WHERE id '.$inclusion.' ('.$id.')'.$groupFilter.';';
		
		// echo $this->getClassName().'::loadOnId('.$id.')'.chr(10).$SQL.chr(10).chr(10); 
			
        C_dbGate::loadMany($SQL);
        if($die)
            if(is_int($id))
                if(!array_key_exists($id,$this->keyed))
                    die($this->getClassName().'::'.get_class().'::loadOnId('.$id.') - trying to load unexisting id from '.$this->getTableName());

        return $this;
    }
    public function loadOnGroup($groupId, $dogroup = false) {
		
        if($groupId=='') return $this;
        if($groupId<0) return $this;
        if($dogroup) $this->grouped = Array(); // this changes the behaviour of C_dbGate::loadMany()
			
        $SQL = 'selECT * FROM '.$this->getTableName().' WHERE groupId IN ('.$groupId.');';
		// echo $this->getClassName().'::loadOnGroup('.$groupId.')'.chr(10).$SQL.chr(10).chr(10); 
			
        C_dbGate::loadMany($SQL);
        return $this;
    }	
    public function loadOnResaId($reservationId) {
        if($reservationId < 0) return $this; 
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE reservationId IN ('.$reservationId.');';
        C_dbGate::loadMany($SQL);
        return $this;
    }
    public function loadOnLoginId($loginIds) {
		if(!$loginIds) return $this;
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE loginId IN ('.$loginIds.');';
        C_dbGate::loadMany($SQL);
        return $this;
    }	
    public function loadOnResource($id, $type = false) {
        $whereType = $type ? 'resourceType ='.$type.' AND ' : '';
        if($id < 0) return $this;
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE '.$whereType.' resourceId	='.$id.';';
        C_dbGate::loadMany($SQL);
        return $this;
    }	
    public function loadOnView($rescIds, $groupIds=false) { // $rescIds may NOT be empty here, it MUST be a list of resoure ids. Do not use view as found in the accessKey
        $andGroup = ''; if($groupIds) $andGroup = ' AND groupId IN ('.$groupIds.')';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE resourceId IN ('.$rescIds.') '.$andGroup.';';
		
   		// echo $this->getClassName().'::loadOnView('.$rescIds.', '.$groupIds.')'.chr(10).$SQL.chr(10).chr(10); 

		C_dbGate::loadMany($SQL);
        return $this;
    }
    public function loadOnType($groupId, $type) {
        $whereType = 'resourceType='.$type.' AND ';
        $SQL = 'SELECT * FROM '.$tablePrefix.$this->getTableName().' WHERE '.$whereType.' groupId IN ('.$groupId.');';
        C_dbGate::loadMany($SQL);
        return $this;
    }
    public function loadOnAction($stampSearchIn, $stampSearchOut, $action) { 
        $in = Date('Y-m-d H:i:s',$stampSearchIn); 
        $out = Date('Y-m-d H:i:s',$stampSearchOut); 
        switch($action) {
            case 'created' : $catch = 'created < "'.$out.'" AND created >= "'.$in.'"'; break;
            case 'changed' : $catch = 'changed < "'.$out.'" AND changed >= "'.$in.'"'; break;
            case 'deleted' : $catch = 'deleted < "'.$out.'" AND deleted >= "'.$in.'"'; break;
        }
        $tableName = $this->getTableName(); // varies when you e.g. go to archive tables
        $SQL = 'SELECT * FROM '.$tableName.' WHERE '.$catch.';'; 
        // echo '</br>'.$SQL;
        C_dbGate::loadMany($SQL);
        foreach($this->keyed as $id => $o_dS) {
            unset($o_dS->note); // to make it lighter in memory consumption
        }
    }	
    public function loadOnSunday($groupId, $sunday, $weeks) { // for xmon_stats tables
        $sunOut = new C_date($sunday);
        $sunIn = $sunOut->wIncrement(-$weeks)->getMDNstmp();

        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = '.$groupId.'
			AND sunday <= '.$sunday.' AND sunday > '.$sunIn.';';
        C_dbGate::loadMany($SQL);
        return $this;
    }
    public function loadOnField($field, $values) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE '.$field.' IN ('.$values.');';
        C_dbGate::loadMany($SQL);
        return $this;
    }

    public function getIdsList($sep=',') {  // returns list of id's of replica's that are loaded, separated by comas: e.g. '1542, 6545, 6528', or an Array is $sep is set to false
		if($sep) return implode($sep, array_keys($this->keyed)); // string list using the specified separator
		return array_keys($this->keyed); // array list;
	}
    public function getGroupIdsList() { // returns list separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->groupId] = $dS->groupId; // this avoids having twice the same item in the list
        return implode(',',$ids); 
    }	
    public function getResourceIdsList($coma = true) { // returns list separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) 
			if($coma) return ''; else return Array();
        $ids = Array();
        foreach($this->keyed as $id => $dS) $ids[$dS->resourceId] = $dS->resourceId;
        if($coma) return implode(',',$ids); else return $ids;
    }
    public function getLoginIdsList() { // returns list of distinct login ids separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->loginId] = $dS->loginId;
        return implode(',',$ids); 
    }
	public function getAccountIdsList() { // returns a coma list of distinct account ids separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->accountId] = $dS->accountId;
        return implode(',',$ids); 
    }
	public function getSerieIdsList() { // returns a coma list of distinct account ids separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->serieId] = $dS->serieId;
        return implode(',',$ids); 
    }
	public function getWorkCodeIdsList() { // returns a coma list of distinct account ids separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->workCodeId] = $dS->workCodeId;
        return implode(',',$ids); 
    }
    public function getFirst() { // returns the first item if exists
	        if(!$this->count()) return false;
        foreach($this->keyed as $dS) return $dS; 
	}
    public function getList($field, $excludeZeroes = false) { // returns list for a chosen field separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $list = Array(); foreach($this->keyed as $dS) { $o = (array)$dS; $skip = false; if($excludeZeroes) if($o[$field]==0) $skip=true; if(!$skip) $list[] = $o[$field]; }
        return implode(',',$list); 
    }

    public function get($id, $alt = false, $field = false) {
        $dS = isset($this->keyed[$id]) ? $this->keyed[$id] : false;
        if(!$dS) return $alt;
        if(!$field) return $dS;
        if(isset($dS->{$field})) return $dS->{$field}; else return $alt;
    }

    public function countOnGroup($groupId) {
        $q = new Q('SELECT COUNT(1) as c FROM '.$this->getTableName().' WHERE groupId='.$groupId.';');
        return $q->c(); 
    }

    public function hasLoginId($loginId) {
        if(!$this->count()) return false;
        foreach($this->keyed as $id => $o_dS)
            if($loginId == $o_dS->loginId)
                return $o_dS;
        return false;
    }

	// Streaming related functions 
	//
	public function setstringtimeformat($utc=false, $options=false, $timeformat='Y-m-d H:i') { // used on the smartapp api, this works with relative string time format
        if($utc) return $this; // skip this processing when user works on utc
		if($this->count())
            foreach($this->keyed as $id => $dS)
                $dS->setstringtimeformat($utc, $options, $timeformat);
		return $this;
	}
	public function setstringtimeformat4AI($utc=false, $options=false, $timeformat='Y-m-d H:i') { // used on the AI api, this works with relative string time format
        if($utc) return $this; // skip this processing when user works on utc
		if($this->count())
            foreach($this->keyed as $id => $dS)
                $dS->setstringtimeformat4AI($utc, $options, $timeformat);
		return $this;
	}
    public function stream($alias = false, $bank = false, $tracking = false, $separator = '|', $fields = false) { // alias is optional, it replaces the native class name with the alias specified 
        global $nl;
        $dataSets = '';
        $alias = $alias ? $alias : $this->dataSetClassName();
        $bank = $bank ? '#'.$bank : '';
        if($this->count())
            foreach($this->keyed as $id => $dataSet)
                $dataSets .= $dataSet->stream($tracking, $separator, $fields).$nl;
        return '#'.$alias.$bank.$nl.$dataSets;
        // returns e.g
        // 		#C_dS_performance
        // 		124766,267659,2578,419147,0
        // 		124765,267659,3054,419147,0
        // 		124764,267658,2550,419147,0
    }
	public function jason($tracking = false, $fields = false) { 
        global $nl;
        $dataSets = [];
        if($this->count())
            foreach($this->keyed as $id => $dataSet)
                $dataSets[$id] = $dataSet->jason($tracking, '', $fields);
        $r = ''; $sep = ''; foreach($dataSets as $id => $dSet_jason) { $r .= $sep.''.$dSet_jason; $sep = ','.$nl; } // $r .= $sep.'"'.$id.'":'.$dSet_jason;
		return '['.$r.']';
    }	
	public function jason4AI($tracking = false, $fields = false) { 
        global $nl;
        $dataSets = [];
        if($this->count())
            foreach($this->keyed as $id => $dataSet)
                $dataSets[$id] = $dataSet->jason($tracking, '', $fields);
        $r = ''; $sep = ''; foreach($dataSets as $id => $dSet_jason) { $r .= $sep.''.$dSet_jason; $sep = ','.$nl; } // $r .= $sep.'"'.$id.'":'.$dSet_jason;
		$classname = $this->dataSetClassName();
		return '#'.$classname.$nl.'['.$r.']'.$nl;
    }
    public function csvstream($filename, $fields = false, $classname = false, $headers = true ) { // meant for file distribution

        if($headers) {
            header('Content-type: text/csv; charset=utf-8');
            header('Content-Disposition: attachment; filename='.$filename.'.csv');
        }

        global $nl;
        $dataSets = ''; $dataSet = false;
        if($this->count())
            foreach($this->keyed as $id => $dataSet)
                $dataSets .= $dataSet->stream(false, ';', $fields).$nl; // does not use the generic strem here above

        if($dataSet) { // may be the list is empty
            if($fields) $line1 = implode(';',$fields); // only those fields are included in the csv
            else $line1 = $dataSet->memberslist(false, ';');
            if(!!$classname) $line1 = '#'.$this->dataSetClassName().$nl.$line1; // pre-empts line1 with a line specifying the data class
        }
        else 
            $line1 = '0;no data';

        return $line1.$nl.$dataSets;

        // returns e.g
        // 		id;groupId;ccssid;color;pattern
        // 		124766;267659;2578;419147;0
        // 		124765;267659;3054;419147;0
        // 		124764;267658;2550;419147;0
    }

	public function dropdeleteditems($caller='') {
		foreach($this->keyed as $id => $dS)
			if($dS->deletorId) $this->remove($id,$caller?$caller:'C_dbGate::dropdeleteditems()');
	}
	public function filterOnBirthdate($birthdate, $caller='') {
		foreach($this->keyed as $id => $dS)
			if($dS->birthday!=$birthdate) $this->remove($id,$caller?$caller:'C_dbGate::filterOnBirthdate()');
	}
}


class C_dbAccess_groups extends C_dbGate {	

    public function __construct($ids = false) { 
		C_dbGate::__construct(); 
		if($ids) { $this->loadOnId($ids); }
	}
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_group'; }	
    public function getTableName() { return 'groups'; }
    public function getNew() { return new C_dS_group(); }
	public function loadonkeys($akeys) { // $akeys is supposed to be a C_dbAccess_accesskey loaded with the related access keys 
		$accids = Array();
		if(!$akeys->count()) return;
		foreach($akeys->keyed as $akid => $dS_akey) $accids[] = $dS_akey->accountId;
		$this->loadOnId(implode(',',$accids));
	}
}
class C_dbAccess_resources extends C_dbGate {	

    public $viewIds; // is false if all account resources are loaded, contains resource ids of the key view when key is provided and view is limited
    public function __construct($accountId = false, $o_dS_accesskey = false) { 

        C_dbGate::__construct(); 
		$this->viewIds = false; // pvh2025
        if($o_dS_accesskey) { // then there is a view defined, load according to this view
            $bCals = $o_dS_accesskey->bCals; // contains '-' when none is selected (*ak01*)
            $uCals = $o_dS_accesskey->uCals; // contains '' when all are selected (default DB value) or when a specific display order is set
            $fCals = $o_dS_accesskey->fCals; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order
            
			if(!$bCals) if(!$uCals) if(!$fCals) return $this->loadOnGroup($accountId);
            
			if($bCals!='-') { if($bCals) $this->loadSomeResource($accountId, str_replace('!',',',$bCals), class_bCal); else $this->loadAllOfType($accountId, class_bCal); }
            if($uCals!='-') { if($uCals) $this->loadSomeResource($accountId, str_replace('!',',',$uCals), class_uCal); else $this->loadAllOfType($accountId, class_uCal); }
            if($fCals!='-') { if($fCals) $this->loadSomeResource($accountId, str_replace('!',',',$fCals), class_fCal); else $this->loadAllOfType($accountId, class_fCal); }

            if($bCals||$uCals||$fCals) $this->viewIds = $this->getIdsList();
            return $this;
        } else
            if($accountId) return $this->loadOnGroup($accountId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_resource'; }	
    public function getTableName() { return 'resources'; }
    public function getNew() { return new C_dS_resource(); }

    // private functions
    public function loadSomeResource($groupId, $ids='', $type=false) {
        $whereType = $type ? ' AND resourceType ='.$type : '';
		$whereIds = $ids ? ' AND id IN ('.$ids.')': '';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = '.$groupId.$whereIds.$whereType.'; -- C_dbAccess_resources::loadSomeResource()';
        C_dbGate::loadMany($SQL);
        return $this;
    }	
    public function loadAllOfType($groupId, $type) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = '.$groupId.' AND resourceType ='.$type.';';
        C_dbGate::loadMany($SQL);
        return $this;
    }	
    public function addWatchovers() { // add a wologins member, pointing to all logins expecting notifications for resources
        $accountId = $this->getfirst()->groupId;
        if(!$accountId) return $this; // the collection is empty

        // load accesskeys under concern
        //
        foreach($this->keyed as $rId => $dS_rsc) { $dS_rsc->wologins = new C_setKeyed(); }
        $qak = new Q('select id from accesskeys where accountId ='.$accountId.' and watchover <> "";'); // we load only logins for which some watch over is defined
        $dbAccess_acckeys = new C_dbAccess_accesskey(); $dbAccess_acckeys->loadOnId($qak->ids()); 

        if($dbAccess_acckeys->count()) { // if you create a dumb setup with notification templates while none of the logins is watching over a resource, there is no access key here and the count is zero.

            $loginsIds = $dbAccess_acckeys->getGroupIdsList(); // access keys group to logins
            $dbAccess_logins = new C_dbAccess_logins($loginsIds); 

            // hook up login to the resource, because it should get notifications by email or SMS
            //
            foreach($dbAccess_acckeys->keyed as $kid => $dS_acckey) {
                $dS_login = $dbAccess_logins->keyed[$dS_acckey->groupId]; // access keys group to a login
                $wovers = explode('!', $dS_acckey->watchover);
                foreach($wovers as $woId) // $woId is a resourceId
                    $this->keyed[$woId]->wologins->add($dS_login, $dS_login->id); // a given login can only be listed ones in this list
            }
        }
        return $this;
    }
}
class C_dbAccess_guidelines extends C_dbGate {	

    public function __construct($groupId = false) { 

        C_dbGate::__construct(); 
        if($groupId) return $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_guidelines'; }	
    public function getTableName() { return 'guidelines'; }
    public function getNew() { return new C_dS_guidelines(); }

    // private functions
}



////////////////////////
//
//  HOURLIES

class C_dbAccess_shadows extends C_dbGate {

    public function __construct($hourlyId = false, $dayCode = false) { // shadows are grouped by hourly id
        C_dbGate::__construct(); 
        if($dayCode && $hourlyId) $this->loadOnDaycode($hourlyId, $dayCode);
        else if($hourlyId) $this->loadOnGroup($hourlyId);  // loadOnGroup redefined for this class !!  see here under
    } 
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_shadow'; }	
    public function getTableName() { return 'shadows'; }
    public function getNew() { return new C_dS_shadow(); }
    public function getClone($original) { return new C_dS_shadow(0,0,$original); }

    public function loadOnGroup($hourlyId, $dogroup = false) {
		// Labo VR bug: some manip at Labo VR created timboxes and shadows with groupId = 0 (which is not supported...) => do not load this shit in other accounts
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId <> 0 and groupId IN('.$hourlyId.');';
		C_dbGate::loadMany($SQL);
    }
    public function loadOnDaycode($hourlyId, $dayCode) {
        $SQL = 'SELECT * FROM '.$this->getTableName().'
		WHERE groupId = '.$hourlyId.' AND dayCode = '.$dayCode.';';
        C_dbGate::loadMany($SQL);
    }
    public function newSchedule($o_dS_group, $o_dS_hourly, $periodicity) {
        $stop = (7*$periodicity)+1;
        for($daycode=1; $daycode<$stop; $daycode++) {
            $o_dS_shadowAM = $this->newVirtual();
            $o_dS_shadowAM->setAMshadow($o_dS_group);
            $o_dS_shadowAM->groupId = $o_dS_hourly->id;
            $o_dS_shadowAM->dayCode = $daycode;

            $o_dS_shadowPM = $this->newVirtual();
            $o_dS_shadowPM->setPMshadow($o_dS_group);
            $o_dS_shadowPM->groupId = $o_dS_hourly->id;
            $o_dS_shadowPM->dayCode = $daycode;
        }
    }
}
class C_dbAccess_hourlies extends C_dbGate {	

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) return $this->loadOnGroup($groupId); // group to an account
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_hourly'; }	
    public function getTableName() { return 'hourlies'; }
    public function getNew() { return new C_dS_hourly(); }
}
class C_dbAccess_hourliesusers extends C_dbGate {	

    public function __construct($groupId = false) { // hourliesusers group to a resourceId
        C_dbGate::__construct(); 
        if($groupId) return $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_hourlyuser'; }	
    public function getTableName() { return 'hourliesusers'; }
    public function getNew() { return new C_dS_hourlyuser(); }

    // Specific to this Class:
    //
    public function getHourliesIds() { // returns list of groupId's of replica's that are loaded, separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $hourliesIds = Array();
        foreach($this->keyed as $id => $o_dS)
            $hourliesIds[$o_dS->hourlyId] = $o_dS->hourlyId;
        return implode(',',$hourliesIds); 
    }
    public function loadInBetween($rscId, $stampIn, $stampOut) { // loads hourly changes between given stamps (dates included)
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = '.$rscId.' AND dayIn >= '.$stampIn.' AND dayIn <= '.$stampOut.';';
        C_dbGate::loadMany($SQL);
    }
	public function deleteAll_hourlyUsers() { // for the loaded resourceId collection, cleans up the complete suite of hourly users and associated exceptionnal hourlies and their shadows
        $hids = $this->getHourliesIds();
		$dbAccess_hourlies = new C_dbAccess_hourlies();
		$dbAccess_hourlies->loadOnId($hids);
		foreach($this->keyed as $huid => $dS_hourlyuser) {
			$dS_hourly = $dbAccess_hourlies->keyed[$dS_hourlyuser->hourlyId];
			if($dS_hourly->periodicity == 0) { // exceptional hourly, we purge all the shadows
				$dbAccess_shadows = new C_dbAccess_shadows($dS_hourly->id);
				$dbAccess_shadows->deleteAll();
			} else {
				// we delete only the hourlyuser, and we keep the hourly itself for a new occasion
			}
		}
		$this->deleteAll();
	}
}
class C_dbAccess_timeboxes extends C_dbGate {	

    public function __construct($hourlyId = false, $dayCode = false) {  // time boxes are grouped by hourly id
        C_dbGate::__construct(); 
        if($dayCode && $hourlyId) $this->loadOnDaycode($hourlyId, $dayCode);
        else if($hourlyId) return $this->loadOnGroup($hourlyId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_timebox'; }	
    public function getTableName() { return 'timeboxes'; }
    public function getNew() { return new C_dS_timebox(); }
    public function getClone($original) { return new C_dS_timebox(0,0,$original); }

    // Specific to this Class:
    //
    public function loadOnGroup($hourlyId, $dogroup = false) {
        $SQL = 'SELECT * FROM '.$this->getTableName().'
		WHERE groupId IN('.$hourlyId.') AND groupId <> 0 AND timeboxingId <> 0;';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnDaycode($hourlyId, $dayCode) {
        $SQL = 'SELECT * FROM '.$this->getTableName().'
		WHERE groupId = '.$hourlyId.' AND dayCode = '.$dayCode.';';
        C_dbGate::loadMany($SQL);
    }
	
	public static function sliceandtimebox($slicing, $hourlyId, $post) { // fills a cues span with timeboxes of the given timeslice duration
		// $slicing is supposed to be 
		global $nl;
		$id = $post['id']; // which is a 
		$timeboxes = new C_dbAccess_timeboxes();
		$s = 60*60/$slicing; // $s is a number of seconds, slicing arrives like [1/2/3/4/6/12] which are the entire divisor of an hour
		if($slicing>12) $s = $slicing * 60; // in this case, slicing arrives as a number of minutes
		// $s is a number of seconds
		$cueIn = $post['cueIn']+0; $cueOut = $post['cueOut']+0;
		$islongenough = ($cueOut - $cueIn) >= (2*$s); // we agree to cut the timebox only if we can make at least two parts from the one entering
		if($islongenough) {
			if($id > 0) { // then start with removing the old version of this timebox
				$dS_timebox = new C_dS_timebox($id);
				$dS_timebox->dSdelete();
				echo 'removing older version before slicing...'.$nl;
			}
			echo 'chopping: 1 slice is '.$s.'sec, cueIn='.$cueIn.', cueOut='.$cueOut.' '.$nl;
			for($c=$cueIn, $x=-1;($c+$s)<=$cueOut; $c+=$s, $x--) {
				$post['cueIn'] = $c; $post['cueOut'] = $c+$s;
				$timeboxes->add( new C_dS_timebox($x, $hourlyId, $post), $x ); // negative $x produces new objects in DB
				echo $c.'.';
			} echo $nl;
			
		} else { // return the cueIn to cueOut timebox has drawn on the screen
			
			echo 'The span is not long enough to be chopped in slices.'.$nl;
			$dS_timebox = new C_dS_timebox($id, $hourlyId, $post);
			$timeboxes->add($dS_timebox, $id);
		}
		return $timeboxes;
	}
}
class C_dbAccess_tboxings extends C_dbGate {	

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) return $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_timeboxing'; }	
    public function getTableName() { return 'timeboxings'; }
    public function getNew() { return new C_dS_timeboxing(); }

    // Specific to this Class:
    //
}

class C_hourliesScope {

    public $o_dS_huser_beforeDayIn;
    public $o_dS_huser_onDayYest;
    public $o_dS_huser_onDayIn;
    public $o_dS_huser_onDayOut;

    public $o_dS_hourly_beforeDayIn;
    public $o_dS_hourly_onDayYest;
    public $o_dS_hourly_onDayIn;
    public $o_dS_hourly_onDayOut;

    protected $rscId;
    protected $dayIn;
    protected $dayOut;


    public function __construct($rscId, $dayIn) {

        // Assess the hourly changes at dayIn and on dayIn +1
        //
        $o_dbAccess_scopeHourliesusers = new C_dbAccess_hourliesusers($rscId);
        $o_dS_huser_onDayYest = false;
        $o_dS_huser_onDayIn = false;
        $o_dS_huser_onDayOut = false;
        $o_dS_huser_beforeDayIn = false; // only periodic hourly comes in here

        $dayOut = new C_date($dayIn); $dayOut->dIncrement(1); $dayOut = $dayOut->getTstmp();
        $dayYest = new C_date($dayIn); $dayYest->dIncrement(-1); $dayYest = $dayYest->getTstmp();


        if($o_dbAccess_scopeHourliesusers->count()) {

            $dayins = Array();
            $hourlies = Array();
            foreach($o_dbAccess_scopeHourliesusers->keyed as $huId => $o_dS_hourlyuser) {
                $dayins[$o_dS_hourlyuser->dayIn] = $o_dS_hourlyuser;
                $hourlies[$o_dS_hourlyuser->hourlyId] = 1;
                unset($o_dS_hourlyuser); 
            }
            ksort($dayins,SORT_NUMERIC); // Sorts these arrays by key, maintaining key to data correlations.

            foreach($hourlies as $hid => $o_dS_hourly)
                $hourlies[$hid] = new C_dS_hourly($hid);

            foreach($dayins as $idayIn => $o_dS_hourlyuser) {
                // echo chr(9).'dayIn:'.$idayIn.' - hourly'.$o_dS_hourlyuser->hourlyId.chr(10);
                if($idayIn==$dayYest) $o_dS_huser_onDayYest = $o_dS_hourlyuser;
                if($idayIn==$dayIn) $o_dS_huser_onDayIn = $o_dS_hourlyuser;
                else if($idayIn==$dayOut) $o_dS_huser_onDayOut = $o_dS_hourlyuser;
                else if($idayIn>$dayOut) break;
                else if($hourlies[$o_dS_hourlyuser->hourlyId]->periodicity != 0) $o_dS_huser_beforeDayIn = $o_dS_hourlyuser;
                unset($o_dS_hourlyuser); 
            }
        }
        $o_dS_hourly_onDayYest = false; if($o_dS_huser_onDayYest) $o_dS_hourly_onDayYest = new C_dS_hourly($o_dS_huser_onDayYest->hourlyId);
        $o_dS_hourly_onDayIn = false; if($o_dS_huser_onDayIn) $o_dS_hourly_onDayIn = new C_dS_hourly($o_dS_huser_onDayIn->hourlyId);
        $o_dS_hourly_onDayOut = false; if($o_dS_huser_onDayOut) $o_dS_hourly_onDayOut = new C_dS_hourly($o_dS_huser_onDayOut->hourlyId);
        $o_dS_hourly_beforeDayIn = false; if($o_dS_huser_beforeDayIn) $o_dS_hourly_beforeDayIn = new C_dS_hourly($o_dS_huser_beforeDayIn->hourlyId);

        // echo 'hourly before:'.($o_dS_hourly_beforeDayIn?$o_dS_hourly_beforeDayIn->name:'none').chr(10); 
        // echo 'hourly change on dayIn:'.($o_dS_hourly_onDayIn?$o_dS_hourly_onDayIn->name:'none').chr(10); 
        // echo 'hourly change on dayOut:'.($o_dS_hourly_onDayOut?$o_dS_hourly_onDayOut->name:'none').chr(10); 

        $this->o_dS_huser_onDayYest = $o_dS_huser_onDayYest;
        $this->o_dS_huser_beforeDayIn = $o_dS_huser_beforeDayIn;
        $this->o_dS_huser_onDayIn = $o_dS_huser_onDayIn;
        $this->o_dS_huser_onDayOut = $o_dS_huser_onDayOut;

        $this->o_dS_hourly_onDayYest = $o_dS_hourly_onDayYest;
        $this->o_dS_hourly_beforeDayIn = $o_dS_hourly_beforeDayIn;
        $this->o_dS_hourly_onDayIn = $o_dS_hourly_onDayIn;
        $this->o_dS_hourly_onDayOut = $o_dS_hourly_onDayOut;

        $this->rscId = $rscId;
        $this->dayIn = $dayIn;
        $this->dayOut = $dayOut;
    }

    public function deleteHuser() { // deletes properly hUser on dayIn


        // situation before deletion:
        //                                  >|<
        //                                   |
        //   before           | dayYest |  dayIn  |  dayOut |
        //                    |         |         |         |
        // ---------|---------|---------|---------|---------|---------|--------->


        if($this->o_dS_hourly_onDayIn->periodicity == 0) { // exceptional hourly
            // exceptional hourly changes come with own hourly and shadows, 
            // they are never shared with other husers or/and resources => gently clean them all

            $o_dbAccess_shadows = new C_dbAccess_shadows($this->o_dS_hourly_onDayIn->id); 
            $o_dbAccess_shadows->deleteAll();
            $this->o_dS_hourly_onDayIn->dSdelete();

            echo '... the concerned hourly is an exceptional day (all attributes cleaned up)'.chr(10);
        }
        else  // periodic hourly
            echo '... the concerned hourly is a periodic hourly'.chr(10);


        echo '... deleting concerned hourly change'.chr(10);
        $this->o_dS_huser_onDayIn->dSdelete();
		
		return $this;
		
		// pvh2025 : OBSOLETE
        if($this->o_dS_huser_onDayOut) { // cover the particular case of a come back to previous hourly, due to an exceptional hourly on dayIn

            echo '... found an hourly change on the next day'.chr(10);

            // if($this->o_dS_hourly_onDayIn->periodicity == 0) {
            if(0) { // pvh2025 : OBSOLETE

                $keep = false;
                if($this->o_dS_hourly_onDayYest) {
                    if($this->o_dS_hourly_onDayYest->periodicity == 0) { // the concerned huser is an exceptional day, preceeded by another exceptional day
                        
						if($this->o_dS_hourly_onDayOut->periodicity == 0) { // the concerned huser has an exceptional day at left and right sides

                            // situation before deletion: another excp follows right next
                            //                              excp
                            //   before         |  excp  |  dayIn |  excp  | cmback
                            //                  |        |        |        |
                            // --------|--------|--------|--------|--------|--------|--------|-------->

                            $o_dS_huser = new C_dS_hourlyuser(0, $this->rscId);
                            $o_dS_huser->dayIn = $dayIn;
                            $o_dS_huser->hourlyId = $this->o_dS_hourly_beforeDayIn->id; // the first found periodic hourly before dayIn
                            $o_dS_huser->dSsave();
                            echo '... creating a comeback to periodical hourly'.chr(10);

                        } else {

                            // situation before deletion: a periodic hourly follows right next
                            //
                            //                              excp
                            //   before         |  excp  |  dayIn |  cmback
                            //                  |        |        |        |
                            // --------|--------|--------|--------|--------|--------|--------|-------->

                            $this->o_dS_huser_onDayOut->dayIn = $this->o_dS_huser_onDayIn->dayIn; // skip back one day the come back to regular hourly 
                            $this->o_dS_huser_onDayOut->dSsave();
                            $keep = true;
                            echo '... maintaining a comeback to identical hourly, set it one day sooner'.chr(10);
                        }
                    }
                } 

                if(!$keep)
                    if($this->o_dS_hourly_onDayOut->id == $this->o_dS_hourly_beforeDayIn->id) {

                        // situation before deletion:
                        //                              
                        //   before:hourlyX |        |        |  cmback:hourlyX
                        //                  |        |        |        |
                        // --------|--------|--------|--------|--------|--------|--------|-------->

                        echo '... deleting a comeback to identical hourly'.chr(10);
                        $this->o_dS_huser_onDayOut->dSdelete(); // no need to keep it because you come back to the same hourly
                    }
            }


        } else { // there is no hourly change on dayOut

            // we need to check if a periodic hourlyBefore exists, 
            // if so, we re-install it only if hourlyYest is a non periodic chap
            echo '... found NO hourly change on the next day'.chr(10);

            if($this->o_dS_hourly_onDayYest) {
                if($this->o_dS_hourly_onDayYest->periodicity == 0) { // the concerned huser is preceeded by an exceptional day
                    
					
					if($this->o_dS_hourly_beforeDayIn) {

                        // situation before deletion:
                        //                                   dayYest    dayIn
                        //   before             |  excp    | excp     | excp     |
                        //                      |          |          | or per   |
                        // ----------|----------|----------|----------|----------|----------|----------|---------->

						// PVH 2025 : new excpetionnals behaviour
                        // $o_dS_huser = new C_dS_hourlyuser(0, $this->rscId);
                        // $o_dS_huser->dayIn = $this->dayIn;
                        // $o_dS_huser->hourlyId = $this->o_dS_hourly_beforeDayIn->id; // the first found periodic hourly before dayIn
                        // $o_dS_huser->dSsave();
                        // echo '... creating a comeback to periodical hourly'.chr(10);
                    }
                }
            }
        }


    }



} 
class C_singleDayHourly extends C_hourliesScope { // used to setup some shadows when hourlies are created

    private $daycode;
    private $daycode7;

    private $o_dbAccess_shadows;
    private $o_dbAccess_timeboxes;
    private $o_dbAccess_hourliesusers;
    private $o_dS_newHourly_onDayIn;

    private $groupId;

    public function __construct($groupId, $rscId, $dayIn, $daycode, $name) {


        $this->daycode = $daycode;
        $this->daycode7 = $this->DCdownset($daycode);

        parent::__construct($rscId, $dayIn);

        $this->o_dbAccess_shadows = new C_dbAccess_shadows();
        $this->o_dbAccess_timeboxes = new C_dbAccess_timeboxes();
        $this->o_dbAccess_hourliesusers = new C_dbAccess_hourliesusers();

        // have a flag showing that we are making a new exceptional hourly day on this date
        $isNew = true; 
        if($this->o_dS_hourly_onDayIn) // C_hourliesScope found an hourly starting on $dayIn 
            if($this->o_dS_hourly_onDayIn->periodicity == 0) // exceptional (single day) hourlies have periodicity == 0 
                $isNew = false; // then you are editing an existing exceptional hourly

        if($isNew) $this->createHourly($groupId, $name); // create a new one
        else $this->o_dS_newHourly_onDayIn = $this->o_dS_hourly_onDayIn; // re-use 

        $this->isNew = $isNew;
        $this->groupId = $groupId;
    }
    public function setShadows($tab, $id, $closed, $post) {

		$noshadows = false; 
		if($post) if(isset($post['id'])) if($post['id']==-9999) $noshadows = true;

        if($tab==0) echo chr(9).'ready to set shadows...'.chr(10);
        if($tab==1) echo chr(9).'ready to set timebox...'.chr(10);

        if($this->isNew) {
			$fpost = $post;
			if($noshadows) { 
				echo chr(9).'no shadow case...'.chr(10); 
				$fpost = false; // To be develpped if we want time boxes to be copied 
		}
			
			$this->cloneShadows($tab, $id, $closed, $fpost); // as a start point, it reproduces the day from the rotating hourly
		}
        else $this->existingShadows($tab, $id, $closed, $post); // uses the existing set of shadows & timeboxes
		return $this;
    }	
    public function deleteShadow($tab, $id, $allofthem) {

        $closed = 0;
        if($this->isNew) 
            $this->cloneShadows($tab, $id, $closed); // passing no post implies removing shadow with id = $id
        else $this->existingShadows($tab, $id, $closed, $post=false, $allofthem);

        switch($tab) {
            case 0: 
                $shadowsleft = $this->o_dbAccess_shadows->count();
                echo chr(9).'number of shadows left:'.$shadowsleft.chr(10);
                if($shadowsleft==0) $this->setDefaults(); // if no shadow anymore on this day, install default shadows
                break; 
            case 1: 
                break; // it is ok having removed the last timebox, when do not check on this
        }
    }
    public function save() {
        $this->o_dS_newHourly_onDayIn->dSsave();
        $hourlyId = $this->o_dS_newHourly_onDayIn->id;
        $this->o_dbAccess_shadows->saveAll($hourlyId);
        $this->o_dbAccess_timeboxes->saveAll($hourlyId);

        if($this->isNew) $this->insertSingleHuser(); // can be done only when hourlyId is known
        $this->o_dbAccess_hourliesusers->saveAll();

        echo '...saved'.chr(10).chr(10);

    } 
    public function stream() {
	
        $s = $this->o_dbAccess_shadows->stream();
        $s .= $this->o_dbAccess_timeboxes->stream();
        $s .= $this->o_dS_newHourly_onDayIn->stream1(with_tracking);
		return $s;
    }

    // Private functions
    //
    private function existingShadows($tab, $id, $closed, $post=false, $allofthem = 0) {

        $deletemode = ($post===false)?'delete mode':'adjust mode';
        echo chr(9).'adapting existing shadows ('.$deletemode.')...'.chr(10);

        $hourlyId = $this->o_dS_newHourly_onDayIn->id;

        if($post) { // adapt a given shadow
            if($tab==0) // hourlies
                if($closed) { 
                    $this->dropShadows(); $this->setCloseDay();
                } else { 
                    $o_dS_shadow = new C_dS_shadow($id, $hourlyId, $post); 
                    $this->o_dbAccess_shadows->add($o_dS_shadow, $id); 
                }

            if($tab==1) { // timeboxes
				$slicing = $post['slicing']+0;
				if($slicing==0) {
					$o_dS_timebox = new C_dS_timebox($id, $hourlyId, $post);
					$this->o_dbAccess_timeboxes->add($o_dS_timebox, $id); 
				} else {
					// let's slice the space between cueIn and cueOut
					$o = C_dbAccess_timeboxes::sliceandtimebox($slicing, $hourlyId, $post);
					$this->o_dbAccess_timeboxes->absorb($o);
				}
            }
        }
        else { // remove the shadow having id = $id
            switch($tab) {
                case 0: // hourlies
                    $this->o_dbAccess_shadows = new C_dbAccess_shadows($hourlyId, $this->daycode);
                    $this->o_dbAccess_shadows->delete($id);
                    break; 
                case 1: // timeboxes
                    $this->o_dbAccess_timeboxes = new C_dbAccess_timeboxes($hourlyId, $this->daycode);
                    $dS_timebox_target = $this->o_dbAccess_timeboxes->keyed[$id];
					$targettboxing = $dS_timebox_target->timeboxingId;
					if($allofthem) {
						foreach($this->o_dbAccess_timeboxes->keyed as $tbid => $dS_timebox) {
							if($dS_timebox->timeboxingId==$targettboxing) // only the timeboxes with the same properties (timeboxing)
								$this->o_dbAccess_timeboxes->delete($tbid);
						}
					}
					else $this->o_dbAccess_timeboxes->delete($id);
                    break; 
            }
        }

    }
    private function cloneShadows($tab, $id, $closed, $post=false) {

        $deletemode = ($post===false)?'delete mode':'adjust mode';
        echo chr(9).'cloning shadows ('.$deletemode.')...'.chr(10);

        if($this->o_dS_hourly_beforeDayIn) $hourlyId = $this->o_dS_hourly_beforeDayIn->id; // usual case
        $o_dbAccess_currentShadows = new C_dbAccess_shadows($hourlyId, $this->daycode);
        $o_dbAccess_currentTimeboxes = new C_dbAccess_timeboxes($hourlyId, $this->daycode);

        // $tab == 0 when a shadow is modified
        // $tab == 1 when a timebox is modified

        if($closed) { // this must be a closed day, getting a full range single shadow
            $this->setCloseDay();
        } else { // reproduce shadows from the current hourly, except for this one that is adapted
            foreach($o_dbAccess_currentShadows->keyed as $shid => $o_dS_shadow) {

                $clonethis = $o_dS_shadow;
                if($tab==0) if($id==$shid) {
                    if($post) $clonethis = $post; // that one is the transformation made
                    else continue; // passing no $post to this function means you don't want to clone shadow with id = $id
                }

                $o_dS = $this->o_dbAccess_shadows->newVirtual($clonethis);
                $o_dS->dayCode = $this->daycode7; 
                $o_dS->groupId = $hourlyId; // just make it visible in test mode
            }
            if($id==0 && $tab==0) { // on this day, you want to exceptionaly add a shadow
                echo chr(9).'inserting a freshly defined shadow...'.chr(10);
                $o_dS = $this->o_dbAccess_shadows->newVirtual($post);
                $o_dS->dayCode = $this->daycode7; 
                $o_dS->groupId = $hourlyId; // just make it visible in test mode
            }
        }

        // o_dbAccess_timeboxes
        //
        if(!$closed) { // we do not reproduce timeboxing on closed days
            if($o_dbAccess_currentTimeboxes->count()) // reproduce tboxes
                foreach($o_dbAccess_currentTimeboxes->keyed as $tbid => $o_dS_timebox) {

                    $clonethis = $o_dS_timebox;
                    if($tab==1) if($id==$tbid) {
                        if($post) $clonethis = $post; // that one is the transformation made
                        else continue; // passing no $post to this function means you don't want to clone shadow with id = $id
                    }

                    $o_dS = $this->o_dbAccess_timeboxes->newVirtual($clonethis);
                    $o_dS->dayCode = $this->daycode7; 
                    $o_dS->groupId = $hourlyId; // juste make it visible in test mode
                }
            if($id==0 && $tab==1) { // on this day, you want to exceptionaly add a timebox
                echo chr(9).'inserting a freshly defined time box...'.chr(10);
				
				$slicing = $post['slicing']+0;
				if($slicing==0) {
					$o_dS_timebox = new C_dS_timebox($id, $hourlyId, $post);
					$o_dS_timebox->dayCode = $this->daycode7; 
					$o_dS_timebox->groupId = $hourlyId; // just make it visible in test mode
					$this->o_dbAccess_timeboxes->add($o_dS_timebox, $id); 
				} else {
					// let's slice the space between cueIn and cueOut
					$o = C_dbAccess_timeboxes::sliceandtimebox($slicing, $hourlyId, $post);
					foreach($this->o_dbAccess_timeboxes as $tbid -> $dS_timebox) {
						$o_dS_timebox->dayCode = $this->daycode7; 
						$o_dS_timebox->groupId = $hourlyId; // just make it visible in test mode
					}
					$this->o_dbAccess_timeboxes->absorb($o);
				}
            }
        }
    }
    private function dropShadows() {

        echo('dropping existing shadows...').chr(10);

        $hourlyId = $this->o_dS_newHourly_onDayIn->id;
        $o_dbAccess_shadows = new C_dbAccess_shadows($hourlyId, $this->daycode); $o_dbAccess_shadows->deleteAll();
        $o_dbAccess_timeboxes = new C_dbAccess_timeboxes($hourlyId, $this->daycode); $o_dbAccess_timeboxes->deleteAll();
    }	
    private function setDefaults() {

        echo('inserting default shadows...').chr(10);

        $hourlyId = $this->o_dS_newHourly_onDayIn->id;
        $o_dS_group = new C_dS_group($this->groupId);

        $o_dS_shadowAM = $this->o_dbAccess_shadows->newVirtual();
        $o_dS_shadowAM->setAMshadow($o_dS_group);
        $o_dS_shadowAM->dayCode = $this->daycode7;
        $o_dS_shadowAM->groupId = $hourlyId;

        $o_dS_shadowPM = $this->o_dbAccess_shadows->newVirtual();
        $o_dS_shadowPM->setPMshadow($o_dS_group);
        $o_dS_shadowPM->dayCode = $this->daycode7;
        $o_dS_shadowPM->groupId = $hourlyId;

    }
    private function setCloseDay() {

        echo('inserting a closed day shadow...').chr(10);

        $o_dS = $this->o_dbAccess_shadows->newVirtual();
        $o_dS->cueIn = 0;
        $o_dS->cueOut = 86400;
        $o_dS->dayCode = $this->daycode7; 
        $o_dS->exceptional = shadow_offday;
        $o_dS->groupId = $this->o_dS_newHourly_onDayIn->id;
    }
    private function DCdownset($dc) {
        while($dc>7) $dc-=7;
        return $dc;
    }
    private function createHourly($groupId, $name) { // inserts a single day dS_hoourlyuser

        echo 'inserting an hourly...'.chr(10);

        // create o_dS_hourly, made for this single date
        //
        $o_dS_hourly = new C_dS_hourly(-1000, $groupId);
        $o_dS_hourly->name = $name; // comes from the client side 	
        $o_dS_hourly->monday = 0; 	
        $o_dS_hourly->periodicity = 0; 
        $o_dS_hourly->note = '';
        // if($this->o_dS_hourly_beforeDayIn) { // PVH 2025 : from now on, exceptional hourlies will be green and blue :)
            // $o_dS_hourly->colorOff = $this->o_dS_hourly_beforeDayIn->colorOff;
            // $o_dS_hourly->colorExcp = $this->o_dS_hourly_beforeDayIn->colorExcp;
            // $o_dS_hourly->colorAbsent = $this->o_dS_hourly_beforeDayIn->colorAbsent;	
        // } else {
            $o_dS_hourly->colorOff = 152; // offday
            $o_dS_hourly->colorExcp = 162; // available on call
            $o_dS_hourly->colorAbsent = 153; // not available
        // }
        $this->o_dS_newHourly_onDayIn = $o_dS_hourly;

    }
    private function insertSingleHuser() {

        echo 'inserting husers...'.chr(10);

        // hourly user on dayIn
        //
        $o_dS_hourlyuser = $this->o_dbAccess_hourliesusers->newVirtual(); // inserting new hourly
        $o_dS_hourlyuser->dayIn = $this->dayIn;
        $o_dS_hourlyuser->hourlyId = $this->o_dS_newHourly_onDayIn->id;
        $o_dS_hourlyuser->groupId = $this->rscId;

        // Check if there is already an hourly change on dayIn (in this case, remove it!)
        //
        if($this->o_dS_huser_onDayIn) { // there was a huser on dayIn before we started this process
            if($this->isNew) {
                echo 'deleting former huser on dayIn...'.chr(10);
                $this->o_dS_huser_onDayIn->dSdelete();
            }
        }

		return $this; // PVH 2025 : get rid of bridge hourly changes
		
        // Now check if we need to re-introduce an hourly on dayOut
        //
        if($this->o_dS_hourly_onDayOut) { // we do not re-install the former hourly

            // CASE 3: (situation before inserting an exceptional day)
            //                                
            //                              huser2------------------->
            //                        huser1->|
            //                          |     |
            //   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
            //                       dayIn  dayOut

            // CASE 4: (situation before inserting an exceptional day)
            //
            //                              huser------------------>
            //                                |
            //   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
            //     

        } else { // We re-introduce the former hourly on dayOut

            // CASE 1: (situation before inserting an exceptional day)
            //
            //        huser--------------------------->
            //        |
            //   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
            //                       dayIn  dayOut

            // CASE 2: (situation before inserting an exceptional day)
            //
            //                        huser--------------------------->
            //                          |
            //   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
            //                       dayIn  dayOut

            // o_dS_hourlyuser for continuing the regular hourly
            //
            $formerHourlyId = 0; if($this->o_dS_hourly_beforeDayIn) $formerHourlyId = $this->o_dS_hourly_beforeDayIn->id;

            $o_dS_hourlyuser = $this->o_dbAccess_hourliesusers->newVirtual(); // inserting new hourly
            $o_dS_hourlyuser->dayIn = $this->dayOut; 
            $o_dS_hourlyuser->hourlyId = $formerHourlyId;
            $o_dS_hourlyuser->groupId = $this->rscId; // juste make it visible in test mode
        }
    }
}


////////////////////////
//
//  

class C_dbAccess_contracts extends C_dbGate {

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_contract'; }
    public function getTableName() { return 'contracts'; }
    public function getNew() { return new C_dS_contract(); }

    public function getNewest() {
        $idResult = 0;
        if($this->count())
            foreach($this->keyed as $id => $dataSet)
                if($id > $idResult) $idResult = $id;
        if($idResult == 0) return false;
        else return $this->keyed[$idResult];
    }
}



////////////////////////
//
//  

class C_dbAccess_logins extends C_dbGate {

    public function __construct($loginsIds = false) { 
        C_dbGate::__construct(); 
        if($loginsIds) $this->loadOnId($loginsIds);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_login'; }
    public function getTableName() { return 'logins'; }
    public function getNew() { return new C_dS_login(); }

    public function loadOnAccessLevel($accessLevel, $ids = false, $subs = false) {
        if($ids) $ids = ' AND id IN ('.$ids.')'; else $ids = '';
        if($subs) $subs = $subs; else $subs = '';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE accessLevel '.$subs.'= '.$accessLevel.$ids.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnAccountAndAccessLevel($accountId, $accessLevel, $ids = false, $subs = false) {
        if($ids) $ids = ' AND id IN ('.$ids.')'; else $ids = '';
        if($subs) $subs = $subs; else $subs = '';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = accessLevel '.$subs.'= '.$accessLevel.$ids.';';
        C_dbGate::loadMany($SQL);
    }
    public function hidecreds() {
		foreach($this->keyed as $lid => $dS_login) $dS_login->hidecreds();
		return $this;
    }
	public function mashcreds($key) {
		foreach($this->keyed as $lid => $dS_login) $dS_login->mashcreds($key);  // see (*cr50*)
	}
}
class C_dbAccess_logins_min extends C_dbGate {

    public function __construct($loginsIds=false, $accessLevels=false) { 
        C_dbGate::__construct(); 
        if($loginsIds) {
			if($accessLevels)
				$this->loadMany('select * from logins where id in ('.$loginsIds.') and accessLevel in ('.$accessLevels.');');
			else
				$this->loadOnId($loginsIds);
		} 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_login_min'; }
    public function getTableName() { return 'logins'; }
    public function getNew() { return new C_dS_login_min(); }
	
	public function getfirstnames($lids) { // ids = Array of logins ids
		$fnames = Array();
		foreach($lids as $lid)
			if(array_key_exists($lid,$this->keyed))
				$fnames[] = $this->keyed[$lid]->firstname;
		return implode(', ', $fnames);
	}
}
class C_dbAccess_devices extends C_dbGate {	

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) return $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_device'; }	
    public function getTableName() { return 'devices'; }
    public function getNew() { return new C_dS_device(); }

    // Specific to this Class:
    //
}




class C_dbAccess_accesskey extends C_dbGate {

    public function __construct($loginId = false) { // accesskeys do group to login id
        C_dbGate::__construct(); 
        if($loginId) $this->loadOnGroup($loginId); // all access keys that belong to a given login
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_accesskey'; }
    public function getTableName() { return 'accesskeys'; }
    public function getNew() { return new C_dS_accesskey(); }
    public function loadOnAccount($accountId) { // all access keys that open a given account
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE accountID IN ('.$accountId.');';
        C_dbGate::loadMany($SQL);
    }
    public function removeFromAllViews($accountId, $dS_resource) { // used when a resource gets removed from an account
        
		// we need an inventory of existing resources of that type
		$dbAccess_resources = new C_dbAccess_resources();	
		$dbAccess_resources->loadAllOfType($accountId, $dS_resource->resourceType);
		$remains = $dbAccess_resources->count(); // tells us if the resource id under removal is the last one of its type
		
		$this->loadOnAccount($accountId); // loads all accesskeys relating to this account
		if($this->count())
            foreach($this->keyed as $id => $dS_accesskey)
                $dS_accesskey->removeFromView($dS_resource->resourceType, $dS_resource->id, $dbAccess_resources, $remains==1 /* then it is a full last resource removal */);

        $this->saveAll();
    }
    public function removeFromWatchovers($accountId, $targetClass) { // cleans up watchover fields when the last communication of the given target class is removed
        $this->loadOnAccount($accountId);
        $target = 'target IN ('.$targetClass.')';
        $q1 = new Q('select count(1) as c from templates_email where groupId = '.$accountId.' and '.$target.';');
        $q2 = new Q('select count(1) as c from templates_sms where groupId = '.$accountId.' and '.$target.';');
        $anymore = $q1->c() + $q2->c(); 
        if(!$anymore) { // then we need to clean up group resource ids of this target class from all accesskeys->watchover fields
            $q3 = new Q('select id from resources where groupId = '.$accountId.' and resourceType = '.$targetClass.';');
            $rids = $q3->ids(false); 
            if(count($rids)) 
                foreach($this->keyed as $kid => $dS_accesskey)
                    foreach($rids as $rid)
                        $dS_accesskey->idDropStringRef('watchover', $rid);
            $this->saveAll();
            return true;
        }
        return false;
    }
	public function getAccountsList($sep=',') {
		if(!$this->count()) return '';
		$list = Array();
		foreach($this->keyed as $akid => $dS_key) $list[] = $dS_key->accountId;
		$list = implode($sep,$list);
		return $list;
	}
	public function magnifyToLogins() {
		foreach($this->keyed as $aid => $dS_akey) {
			$dS_akey->dS_login = new C_dS_login($dS_akey->groupId);
		}
	}
}



class C_dbAccess_details extends C_dbGate {	// are grouped by keyId Id

    public function __construct($keyId = false, $deviceType = false) { 
        C_dbGate::__construct();
		if($deviceType !== false) {
			$this->loadMany('select * from details where groupId = '.$keyId.' and deviceType = '.$deviceType.';');
		} else
			if($keyId) return $this->loadOnGroup($keyId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_details'; }	
    public function getTableName() { return 'details'; }
    public function getNew() { return new C_dS_details(); }

    // Specific to this Class:
    //
}
class C_dbAccess_connections extends C_dbGate {	// are grouped by key Id

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct(); 
        $this->targetTable = $targetTable;
        if($groupId) return $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_connection'; }	
    public function getTableName() { return $this->targetTable.'connections'; }
    public function getNew() { return new C_dS_connection(); }

    // Specific to this Class:
    //
}
class C_dbAccess_catalysts extends C_dbGate { // are grouped by key Id

    public function __construct($keyId = false) { 
        C_dbGate::__construct(); 
        if($keyId) $this->loadOnGroup($keyId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_catalyst'; }
    public function getTableName() { return 'catalysts'; }
    public function getNew() { return new C_dS_catalyst(); }
    public function cleanUp($keyId, $catalyst) {
        $SQL = 'DELETE FROM '.$this->getTableName().' WHERE groupId = '.$keyId.' AND catalyst = "'.$catalyst.'";';
        C_dbIO::q($SQL);
    }
}



class C_dbAccess_workexperts extends C_dbGate { // group to a workcode. is used only to link workcodes with the selected staffing

    public function __construct($workCodeId = false) { // grouped by work code 
        C_dbGate::__construct(); 
        if($workCodeId) $this->loadOnGroup($workCodeId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_workexpert'; }
    public function getTableName() { return 'workexperts'; }
    public function getNew() { return new C_dS_workexpert(); }

    // Specific to this Class:
    //
}
class C_dbAccess_worktboxing extends C_dbGate { // group to a workcode. // is used only to link workcodes with the selected timeboxing

    public function __construct($workCodeId = false) { // grouped by work code 
        C_dbGate::__construct(); 
        if($workCodeId) $this->loadOnGroup($workCodeId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_worktboxing'; }
    public function getTableName() { return 'worktboxing'; }
    public function getNew() { return new C_dS_worktboxing(); }

    // Specific to this Class:
    //
}
class C_dbAccess_workcodes extends C_dbGate { // group to an account

    public function __construct($groupId = false) { 
        C_dbGate::__construct();
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_workcode'; }
    public function getTableName() { return 'workcodes'; }
    public function getNew() { return new C_dS_workcode(); }
    
    // Specific to this Class:
    //
    public function loadOnReservation($id, $archive = '') { // retrieves workcodes attached to a reservations (indirecting through performances)
    
        $dbAccess_performances = new C_dbAccess_performances($archive,$id); // pvh 2025-01 (parameters switched)
        $ids = $dbAccess_performances->getWorkCodeIds();
        foreach($ids as $id)
			$this->loadOnId($id);
    }
	public function magnify($resources, $workexperts, $worktboxings) {
		if(!$this->count()) return $this;
        foreach($this->keyed as $o_dS) { $o_dS->magnify($resources, $workexperts, $worktboxings); }
        return $this; 
	}
	public function magnify4AI($workexperts, $worktboxings) { // adds visitorIds | workcodeIds | resourceIds
	    
		foreach($this->keyed as $id=>$dS_workcode) $dS_workcode->dSmagnify4AI(); // sets up empty visitorIds | workcodeIds | resourceIds
		
		// now we fill the new members
		
		// workexperts (they reference C_dS_resource ids)
		$packed = Array();
		foreach($workexperts->keyed as $attid=>$dS_workexpert) {
			$wkaid = $dS_workexpert->groupId;
			if(!isset($packed[$wkaid])) $packed[$wkaid] = Array();
			$packed[$wkaid][] = $dS_workexpert->resourceId;
		}
		foreach($packed as $wkaid => $pack)
			$this->keyed[$wkaid]->expertIds = implode(',',$pack); 



		// worktboxings (they reference C_dS_timeboxing ids)
		$packed = Array();
		foreach($worktboxings->keyed as $attid=>$dS_worktboxing) {
			$wkaid = $dS_worktboxing->groupId;
			if(!isset($packed[$wkaid])) $packed[$wkaid] = Array();
			$packed[$wkaid][] = $dS_worktboxing->timeboxingId;
		}
		foreach($packed as $wkaid => $pack)
			$this->keyed[$wkaid]->timboxesIds = implode(',',$pack); 


		return $this;
    }
}
class C_dbAccess_performances extends C_dbGate { // group to a reservation

    private $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { // performances are grouped by resaId
        C_dbGate::__construct(); 
        $this->targetTable = $targetTable;
        if($resaIds) return $this->loadOnGroup($resaIds);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_performance'; }
    public function getTableName() { return $this->targetTable.'performances'; }
    public function getNew() { return new C_dS_performance(); }
    public function getClone($original) { return new C_dS_performance(0,$original->groupId,$original); }

    // Specific to this Class:
    //
    public function deleteOnVisitor($visitorId) { 

        $SQL = 'DELETE FROM '.$this->getTableName().' WHERE visitorId='.$visitorId.';';
        C_dbIO::q($SQL);

        $c = 0;	// now remove replica's in this collection
        foreach ($this->keyed as $item)
            if($item->visitorId == $visitorId)
                $matches[$c++] = $item->id;

        for($i=0; $i<$c; $i++)
            $this->remove($matches[$i], get_class().'::deleteOnVisitor()->');
    }
    public function deleteOnWorkCode($workCodeId, $accountid) { 
        global $nl;
		$t = $this->getTableName();
		$r = $this->targetTable.'reservations';
        $sql = 'delete '.$t.' from '.$t.' inner join '.$r.' on '.$r.'.id = '.$t.'.groupId where '.$r.'.groupId = '.$accountid.' and workCodeId='.$workCodeId.';';
		// echo $nl.$sql.$nl;
        $q = new Q($sql);
		echo $q->hits().' items removed from '.$t.$nl;

        $c = 0;	// now remove replica's in this collection
        foreach ($this->keyed as $item)
            if($item->workCodeId == $workCodeId)
                $matches[$c++] = $item->id;

        for($i=0; $i<$c; $i++)
            $this->remove($matches[$i], get_class().'::deleteOnWorkCode()->');
    }
    public function getWorkCodeIds() {
        $workCodesIds = array();
        if($this->count()) 
            foreach($this->keyed as $id => $o_dS_performance)
                $workCodesIds[] = $o_dS_performance->workCodeId;
        return $workCodesIds;
    }
}
class C_dbAccess_payments extends C_dbGate { // group to a reservation

    private $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { // performances are grouped by resaId
        C_dbGate::__construct(); 
        $this->targetTable = $targetTable;
        if($resaIds) return $this->loadOnGroup($resaIds);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_payment'; }
    public function getTableName() { return $this->targetTable.'payments'; }
    public function getNew() { return new C_dS_payment(); }

    // Specific to this Class:
    //
	public function loadByPaymeanAndTransStatus($paymeans, $transtatus, $olderminute=0) {
		
        if($olderminute==0){
		    $sql = 'SELect * From '.$this->getTableName().' WHERE paymean in ('.$paymeans.') AND transtatus = "'.$transtatus.'";';
            C_dbGate::loadMany($sql);
        }
        else
        {
            $sql = 'SELect * From '.$this->getTableName().' WHERE paymean in ('.$paymeans.') AND transtatus = "'.$transtatus.'" AND TIMESTAMPDIFF(MINUTE, created, NOW()) > '.$olderminute.';';
            C_dbGate::loadMany($sql);
        }
	}
	public function load4oneResa($resaid, $transtatus) {
		$sql = 'select * from '.$this->getTableName().' WHERE groupId = '.$resaid.' AND transtatus = "'.$transtatus.'";';
		C_dbGate::loadMany($sql);
	}
	public function alreadypaid() {
		$paid = 0;
        foreach($this->keyed as $id => $dS)
            $paid += $dS->amount;
		return $paid;
	}
	public function remains($billamount) {
		$remains = $billamount;
        foreach($this->keyed as $id => $dS)
            $billamount -= $dS->amount;
		return $remains;
	}
}


////////////////////////////////////////////////////////////////////
//
//   PRODUCTS


class C_dbAccess_productexperts extends C_dbGate { // group to a product. is used only to link products with the selected staffing

    public function __construct($productId = false) { // grouped by work code 
        C_dbGate::__construct(); 
        if($productId) $this->loadOnGroup($productId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_productexpert'; }
    public function getTableName() { return 'productexperts'; }
    public function getNew() { return new C_dS_productexpert(); }

    // Specific to this Class:
    //
}
class C_dbAccess_products extends C_dbGate { // group to an account

    public function __construct($groupId = false) { 
        C_dbGate::__construct();
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_product'; }
    public function getTableName() { return 'products'; }
    public function getNew() { return new C_dS_product(); }
    
    // Specific to this Class:
    //
    public function loadOnReservation($id, $archive = '') { // retrieves products attached to a reservations (indirecting through performances)
    
        $dbAccess_performances = new C_dbAccess_performances($archive,$id); // pvh 2025-01 (parameters switched)
        $ids = $dbAccess_performances->getproductIds();
        foreach($ids as $id)
			$this->loadOnId($id);
    }
	public function magnify($resources, $workexperts, $worktboxings) {
		if(!$this->count()) return $this;
        foreach($this->keyed as $o_dS) { $o_dS->magnify($resources, $workexperts, $worktboxings); }
        return $this; 
	}
	public function magnify4AI($workexperts, $worktboxings) { // adds visitorIds | productIds | resourceIds
	    
		foreach($this->keyed as $id=>$dS_product) $dS_product->dSmagnify4AI(); // sets up empty visitorIds | productIds | resourceIds
		
		// now we fill the new members
		
		// workexperts (they reference C_dS_resource ids)
		$packed = Array();
		foreach($workexperts->keyed as $attid=>$dS_workexpert) {
			$prdid = $dS_workexpert->groupId;
			if(!isset($packed[$prdid])) $packed[$prdid] = Array();
			$packed[$prdid][] = $dS_workexpert->resourceId;
		}
		foreach($packed as $prdid => $pack)
			$this->keyed[$prdid]->expertIds = implode(',',$pack); 



		// worktboxings (they reference C_dS_timeboxing ids)
		$packed = Array();
		foreach($worktboxings->keyed as $attid=>$dS_worktboxing) {
			$prdid = $dS_worktboxing->groupId;
			if(!isset($packed[$prdid])) $packed[$prdid] = Array();
			$packed[$prdid][] = $dS_worktboxing->timeboxingId;
		}
		foreach($packed as $prdid => $pack)
			$this->keyed[$prdid]->timboxesIds = implode(',',$pack); 


		return $this;
    }
}
class C_dbAccess_goods extends C_dbGate { // group to a reservation

    private $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { // goods are grouped by resaId
        C_dbGate::__construct(); 
        $this->targetTable = $targetTable;
        if($resaIds) return $this->loadOnGroup($resaIds);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_good'; }
    public function getTableName() { return $this->targetTable.'goods'; }
    public function getNew() { return new C_dS_good(); }

    // Specific to this Class:
    //
    public function deleteOnVisitor($visitorId) { 

        $SQL = 'DELETE FROM '.$this->getTableName().' WHERE visitorId='.$visitorId.';';
        C_dbIO::q($SQL);

        $c = 0;	// now remove replica's in this collection
        foreach ($this->keyed as $item)
            if($item->visitorId == $visitorId)
                $matches[$c++] = $item->id;

        for($i=0; $i<$c; $i++)
            $this->remove($matches[$i], get_class().'::deleteOnVisitor()->');
    }
    public function deleteOnproduct($productId, $accountid) { 
        global $nl;
		$t = $this->getTableName();
		$r = $this->targetTable.'reservations';
        $sql = 'delete '.$t.' from '.$t.' inner join '.$r.' on '.$r.'.id = '.$t.'.groupId where '.$r.'.groupId = '.$accountid.' and productId='.$productId.';';
		// echo $nl.$sql.$nl;
        $q = new Q($sql);
		echo $q->hits().' items removed from '.$t.$nl;

        $c = 0;	// now remove replica's in this collection
        foreach ($this->keyed as $item)
            if($item->productId == $productId)
                $matches[$c++] = $item->id;

        for($i=0; $i<$c; $i++)
            $this->remove($matches[$i], get_class().'::deleteOnproduct()->');
    }
    public function getproductIds() { // reports an inventory of product ids in the current collection
        $productsIds = array();
        if($this->count()) 
            foreach($this->keyed as $id => $o_dS_good)
                $productsIds[] = $o_dS_good->productId;
        return $productsIds;
    }
}
class C_dbAccess_stocktakings extends C_dbGate { // group to a reservation

    private $targetTable;
    public function __construct($targetTable = '', $prdid = false) { // stocktakings are grouped by product id
        C_dbGate::__construct(); 
        $this->targetTable = $targetTable;
        if($prdid) return $this->loadOnGroup($prdid);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_stocktaking'; }
    public function getTableName() { return $this->targetTable.'stocktakings'; }
    public function getNew() { return new C_dS_stocktaking(); }

}




////////////////////////////////////////////////////////////////////
//
//	NOTES

class C_dbAccess_note_details extends C_dbGate {

    private $targetTable;
    public function __construct($ids = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($ids) $this->loadOnId($ids); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_note_detail'; }
    public function getTableName() { return $this->targetTable.'note_details'; }
    public function getNew() { return new C_dS_note_detail(); }

    // specific
    public function loadOnLogin($stampSearchIn, $stampSearchOut, $loginIds, $groupId) {

        $table = $this->getTableName();
        $SQL = 'SELECT '.$table.'.id AS id FROM '.$table.' 
				JOIN note_addressees ON note_addressees.groupId = '.$table.'.id
				WHERE '.$table.'.groupId = '.$groupId.' AND loginId IN ('.$loginIds.') AND ( 
					( midnOut >= '.$stampSearchIn.' AND midnIn < '.$stampSearchOut.' )
					OR( midnOut = 0 AND midnIn <= '.$stampSearchIn.' )
					OR( midnOut >= '.$stampSearchOut.' AND midnIn = 0 )
					OR (midnOut = 0 AND midnIn = 0) )
				;';
        $q = new Q($SQL); $ids = $q->ids();
        $this->loadOnId($ids);
        return $ids;
    }
}
class C_dbAccess_note_addressees extends C_dbGate {

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }
    public function loadStaff($accountId, $uptoAlevelInclusive) { 
		$q = new Q('select id from logins where groupId = '.$accountId.' and accessLevel <= '.$uptoAlevelInclusive.' and accessLevel > '.aLevel_eresa.';'); // only human logins
		$ids = $q->ids(list_as_array);
		foreach($ids as $lid) $this->newVirtual()->loginId = $lid;
		return $this; 
	}	

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_note_addressee'; }
    public function getTableName() { return $this->targetTable.'note_addressees'; }
    public function getNew() { return new C_dS_note_addressee(); }
}
class C_dbAccess_note_visirefs extends C_dbGate {

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_note_visiref'; }
    public function getTableName() { return $this->targetTable.'note_visirefs'; }
    public function getNew() { return new C_dS_note_visiref(); }
}



/////////////////////////////////////////////////////////////////////
//
//  
class C_dbAccess_chat_threads extends C_dbGate {

    private $targetTable;
    public function __construct($ids = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($ids) $this->loadOnId($ids); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_chat_thread'; }
    public function getTableName() { return $this->targetTable.'chat_threads'; }
    public function getNew() { return new C_dS_chat_thread(); }

    // specific
    public function loadOnLogin($loginId, $groupId = false, $inclbin = false) { // inclbin is inclusive bin elements (deleted)
        $live = !($inclbin||($this->targetTable=='archive_')); // looking into archives or/and deleted items disables the live filter
		$wherelive = ''; if($live) $wherelive = ' and cueOut = 0';
		$q = new Q('select groupId from '.$this->targetTable.'chat_participants where loginId = '.$loginId.$wherelive.';');
        $ids = $q->groupIds(); // includes chats from all accounts
        if($groupId) if($ids) {
			if($inclbin) $inclbin = ''; else $inclbin = ' and deletorId = 0'; 
			$q = 'select id from '.$this->getTableName().' where groupId = '.$groupId.$inclbin.' and id in ('.$ids.');';
            $q = new Q($q);
            $ids = $q->ids();
        }
        $this->loadOnId($ids);
        return $ids;
    }
    public function loadOnVisitor($vid, $groupId = false, $inclbin = false) { // inclbin is inclusive bin elements (deleted items are reported also)
		$q = new Q('select groupId from '.$this->targetTable.'chat_visirefs where visiId = '.$vid.';');
        $ids = $q->groupIds(); // will include only chats from the given account as visitors belong to one account
        if($groupId) if($ids) {
			if($inclbin) $inclbin = ''; else $inclbin = ' and deletorId = 0'; 
			$q = 'select id from '.$this->getTableName().' where groupId = '.$groupId.$inclbin.' and id in ('.$ids.');';
            $q = new Q($q);
            $ids = $q->ids();
        }
        $this->loadOnId($ids);
        return $ids;
    }
}
class C_dbAccess_chat_participants extends C_dbGate { // group to a chat thread

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_chat_participant'; }
    public function getTableName() { return $this->targetTable.'chat_participants'; }
    public function getNew() { return new C_dS_chat_participant(); }
    public static function keeptalkatives($chatid) {
		
		new Q('delete from chat_participants where groupId = '.$chatid.' and live = 0;');
		
        $dbAccess_chat_participants = new C_dbAccess_chat_participants();
        $dbAccess_chat_participants->loadOnGroup($chatid);
		return $dbAccess_chat_participants;
    }
}
class C_dbAccess_chat_visirefs extends C_dbGate {

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_chat_visiref'; }
    public function getTableName() { return $this->targetTable.'chat_visirefs'; }
    public function getNew() { return new C_dS_chat_visiref(); }
}
class C_dbAccess_chat_phylacteries extends C_dbGate { // group to a chat thread

    private $targetTable;
    public function __construct($groupId = false, $seen = 0, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
		if($seen&&$groupId)
			$this->pick_last($groupId, $seen); 
		else
			if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_chat_phylactery'; }
    public function getTableName() { return $this->targetTable.'chat_phylacteries'; }
    public function getNew() { return new C_dS_chat_phylactery(); }
	
	public function pick_last($chatid, $seen) {
		$q = new Q('select count(1) as c from '.$this->targetTable.'chat_phylacteries where groupId = '.$chatid.';');
		$c = $q->c(); $r = $c-$seen; if($r<1) return $this;
		$this->loadMany('select * from '.$this->targetTable.'chat_phylacteries where groupId = '.$chatid.' order by cue desc limit '.$r.';');
	}   
	public function getParticipantsIdsList() { // returns list of distinct login ids separated by comas: e.g. '1542, 6545, 6528'
        if(!$this->count()) return '';
        $ids = Array();
        foreach($this->keyed as $id => $dS)
            $ids[$dS->who] = $dS->who;
        return implode(',',$ids); 
    }
}


////////////////////////
//
//  
class C_dbAccess_task_descriptions extends C_dbGate {

    private $targetTable;
    public function __construct($ids = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($ids) $this->loadOnId($ids); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_task_description'; }
    public function getTableName() { return $this->targetTable.'task_descriptions'; }
    public function getNew() { return new C_dS_task_description(); }
}
class C_dbAccess_task_assignees extends C_dbGate {

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_task_assignee'; }
    public function getTableName() { return $this->targetTable.'task_assignees'; }
    public function getNew() { return new C_dS_task_assignee(); }

    // specific
    public function loadOnLogin($stampSearchIn, $stampSearchOut, $loginId, $groupId) { // assigned to a login, whatever account it accesses, the task is visible
        
		// PVH 2022 - the following was really bad performing
		//
		// loads only assignees listed in $loginId, other assignees have to be loaded after execution of this function, based on retrieved tasks ids
        // $ids = Array();
			// $sql = 'SELECT id FROM task_descriptions WHERE groupId = '.$groupId.' and midnIn < '.$stampSearchOut.';';
        // $q = new Q($sql);
// echo $sql;
		
        // $ids = $q->ids();
        // if($ids=='') return '';

			// $table = $this->getTableName();
        // $SQL = 'SELECT * FROM '.$table.' 
				// WHERE loginId = '.$loginId.' AND groupId IN('.$ids.')
					// AND ( (midnOut = 0) OR (midnOut >= '.$stampSearchIn.' AND midnOut < '.$stampSearchOut.') )
				// ;';
// echo $SQL;

			$table = $this->getTableName();
        $SQL = 'select '.$table.'.id from '.$table.'
				join task_descriptions on '.$table.'.groupId = task_descriptions.id
				where task_descriptions.groupId = '.$groupId.' and midnIn < '.$stampSearchOut.' and loginId = '.$loginId.'
					and ( (midnOut = 0) OR (midnOut >= '.$stampSearchIn.' AND midnOut < '.$stampSearchOut.') )
				;';
// echo $SQL;
        $q = new Q($SQL);
        $ids = $q->ids();

        C_dbGate::loadOnId($ids);
        return $this->getGroupIdsList(); // retrieved tasks ids
    }
    public function loadOnAssigned($stampSearchIn, $stampSearchOut) {

        $out = Date('Y-m-d',$stampSearchOut).' 00:00:00'; 
        $ids = Array();
        $q = new Q('SELECT id FROM task_descriptions WHERE created < "'.$out.'";');
        $ids = $q->ids();
        if($ids=='') return '';

        $table = $this->getTableName();
        $SQL = 'SELECT * FROM '.$table.' WHERE midnOut = 0 AND groupId IN('.$ids.');';
        C_dbGate::loadMany($SQL);
        return $this->getGroupIdsList(); // retrieved tasks ids
    }
    public function loadOnAchieved($stampSearchIn, $stampSearchOut) {
        $table = $this->getTableName();
        $SQL = 'SELECT * FROM '.$table.' 
				WHERE ( (midnOut >= '.$stampSearchIn.' AND midnOut < '.$stampSearchOut.') );';
        C_dbGate::loadMany($SQL);
        return $this->getGroupIdsList(); // retrieved tasks ids
    }
}
class C_dbAccess_task_visirefs extends C_dbGate {

    private $targetTable;
    public function __construct($groupId = false, $targetTable = '') { 
        C_dbGate::__construct();
        $this->targetTable = $targetTable;
        if($groupId) $this->loadOnGroup($groupId); 
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_task_visiref'; }
    public function getTableName() { return $this->targetTable.'task_visirefs'; }
    public function getNew() { return new C_dS_task_visiref(); }
}


////////////////////////
//
//  
class C_dbAccess_visitors extends C_dbGate {

    public function __construct($ids = false, $accId = false) { 
        C_dbGate::__construct();
        if($ids) $this->loadOnId($ids); 
        if($accId) {
            $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$accId.' AND deletorId=0;';
            C_dbGate::loadMany($SQL);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_visitor'; }
    public function getTableName() { return 'visitors'; }
    public function getNew() { return new C_dS_visitor(); }

    // specific functions
    //
    public function countIfMobile($groupId) {
        $q = new Q('SELECT COUNT(1) as c FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND mobile <> "";'); //  AND cssColor="10771"
        return $q->c();
    }
    public function loadIfMobile($groupId, $from = false, $count = false, $xcolor = false) {
        if($from!==false) $from = ' LIMIT '.$from.','.$count; else $from = '';
        if($xcolor!==false) $xcolor = ' and cssColor <> '.$xcolor; else $xcolor = '';
        
		
        $SQL = 'SELECT *
				FROM '.$this->getTableName().' 
				WHERE groupId='.$groupId.' AND mobile <> "" and visitors.deletorId = 0'.$xcolor.' 
				ORDER BY lastname ASC'.$from.';';
				
        C_dbGate::loadMany($SQL);
    }
	public function loadCustom($groupId, $from = false, $count = false, $xcolor = false) {
        if($from!==false) $from = ' LIMIT '.$from.','.$count; else $from = '';
        if($xcolor!==false) $xcolor = ' and cssColor <> '.$xcolor; else $xcolor = '';
        
		// was develop for espace braffot, we want to send only to people having appointed for coolsculpting
		
        $SQL = 'select distinct * from (

	select archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
	(select rid from 
			(select archive_performances.groupId as rid, workcodeId from archive_performances where archive_performances.groupId > 1719464 and workcodeId = 3922) as perfs )

UNION

	select att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
	(select rid from 
			(select performances.groupId as rid, workcodeId from performances where workcodeId = 3922) as perfs ) -- 3922 is Espace Braffort workcode for coolsculpting
		
) as vids 
join visitors on visitors.id = vids.vid
	where visitors.cssColor <> 1192 and visitors.mobile <> "" and visitors.deletorId = 0
	order by id asc'.$from.'; -- 1192 is black list color at Espace Braffort;';
				
        C_dbGate::loadMany($SQL);
    }
    public function loadOnlyWhoAppointedResource($accountId, $rescid, $date = false, $from = false, $count = false) { // only those visitors who ever appointed with the given resource
        if($from!==false) $from = ' LIMIT '.$from.','.$count; else $from = '';
		if($date==false) $date = '2010-01-01';
		
		// Old slow version : not a good idea to join with archive_ tables ... they are huge
		//
        // $SQL = 'select * from visitors where visitors.groupId = '.$accountId.' and visitors.mobile <> "" and visitors.id IN (
					// select distinct resourceId from ( 
						// select att_visitors.resourceId from att_visitors 
							// join reservations on reservations.id = att_visitors.groupId 
							// join attendees on reservations.id = attendees.groupId 
								// where reservations.groupId = '.$accountId.' and reservations.deletorId = 0 
									// and attendees.resourceId = '.$rescid.'  
									// and cueIn > UNIX_TIMESTAMP("'.$date.'")
					// UNION select archive_att_visitors.resourceId from archive_att_visitors 	
							// join archive_reservations on archive_reservations.id = archive_att_visitors.groupId 
							// join archive_attendees on archive_reservations.id = archive_attendees.groupId 
								// where archive_reservations.groupId = '.$accountId.'  and archive_reservations.deletorId = 0
									// and archive_attendees.resourceId = '.$rescid.' 
									// and cueIn > UNIX_TIMESTAMP("'.$date.'")
						// ) ALIAS 
					// )  ORDER BY lastname ASC'.$from.';';
			
				$SQL_C = 'select attendees.groupId as id from attendees 
							join reservations on reservations.id = attendees.groupId 
							where reservations.groupId = '.$accountId.' and resourceId in ('.$rescid.') and cueIn > UNIX_TIMESTAMP("'.$date.'") and reservations.deletorId = 0;';
				// echo $SQL_C.'<br>';
				
			$getresasC = new Q($SQL_C);
						
				$SQL_A = 'select archive_attendees.groupId as id from archive_attendees 
									join archive_reservations on archive_reservations.id = archive_attendees.groupId 
									where archive_reservations.groupId = '.$accountId.' and  resourceId in ('.$rescid.') and cueIn > UNIX_TIMESTAMP("'.$date.'") and archive_reservations.deletorId = 0;';
				// echo $SQL_A.'<br>';			
			$getresasA = new Q($SQL_A);
		
		$rC = $getresasC->ids();
		$rA = $getresasA->ids();
				
				$SQL = 'select distinct id from (select distinct resourceId as id from archive_att_visitors where groupId in ('.$rA.')
								union select distinct resourceId as id from att_visitors where groupId in ('.$rC.')) alias;';
				// echo $SQL.'<br>';	
			$gevisids = new Q($SQL);
		$vids = $gevisids->ids();
		
				// echo $vids.'<br>';
		if(!$vids) return $this;
		
		$SQL = 'select * from visitors 
				where visitors.groupId = '.$accountId.' and visitors.deleted = 0 and visitors.mobile <> "" and visitors.id in ('.$vids.')
				order by lastname asc'.$from.';';
		
        C_dbGate::loadMany($SQL);
    }
    public function loadOnEmail($groupId, $email, $mobile = false, $bdate = false) { // used from e-rese-checkin.php 
        $bdate = $bdate==false?'':'AND birthday='.$bdate;
        $mobile = $mobile==false?'':'OR mobile='.$mobile;
        $SQL = 'SELECT * FROM '.$this->getTableName().' 
				WHERE groupId='.$groupId.' AND (email="'.$email.'" '.$mobile.') '.$bdate.' and visitors.deletorId = 0 ORDER BY lastname ASC;';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnBirthday($groupId, $refDaySortable) { // $refDaySortable like 19701230
        $monthDate = substr($refDaySortable, -4);
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND birthday LIKE "%'.$monthDate.'" and visitors.deletorId = 0;';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnBirthdate($aid, $birthdate) { // $birthdate like 19701230
        $SQL = 'select * from '.$this->getTableName().' where groupId='.$aid.' and '.$this->getTableName().'.birthday = '.$birthdate.' and '.$this->getTableName().'.deletorId = 0;';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnFidelity($accountId, $appcount, $date = false, $rscid = false, $from = false, $count = false) { // used by /utilities/dmarketing.php
		
		// loads distinct last 100 visitors to have appointed in the agenda and not have cancelled thier appointment
		// from those 100, you can load only a part, from number e.g. 60 a bunch of 20 ($from = 60, $count = 20)
		
		if($date) $countfromdate = ' and archive_reservations.cueIn > UNIX_TIMESTAMP("'.$date.'")'; else $countfromdate = '';
		if($rscid) {
			$join_attendees = 'join attendees on attendees.groupId = att_visitors.groupId';
			$join_A_attendees = 'join archive_attendees on archive_attendees.groupId = archive_att_visitors.groupId';
			$where_attendees = 'and attendees.resourceId in ('.$rscid.')';
			$where_A_attendees = 'and archive_attendees.resourceId in ('.$rscid.')';
		} else { $join_attendees = ''; $join_A_attendees = ''; $where_attendees = ''; $where_A_attendees = ''; }
		
		$q = new Q('
			select appcount, vid as id, lastname from (
					select count(1) as appcount, resourceId as vid from 
						( select att_visitors.id, att_visitors.resourceId from att_visitors
							join visitors on visitors.id = resourceId
							join reservations on reservations.id = att_visitors.groupId
							'.$join_attendees.'
							where visitors.groupId = '.$accountId.' '.$where_attendees.' and reservations.deletorId = 0
						UNION
							select archive_att_visitors.id, archive_att_visitors.resourceId from archive_att_visitors
							join visitors on visitors.id = resourceId
							join archive_reservations on archive_reservations.id = archive_att_visitors.groupId
							'.$join_A_attendees.'
							where visitors.groupId = '.$accountId.' '.$countfromdate.' and archive_reservations.deletorId = 0
								 '.$where_A_attendees.'
						) as att_visi_list
					group by vid order by appcount desc
				) as global_counting
			join visitors on visitors.id = global_counting.vid
			where appcount > '.$appcount.';');
		
			$ids = $q->ids();
			
		if($from!==false) $from = ' limit '.$from.','.$count; else $from = '';

        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$accountId.' AND id IN ('.$ids.') ORDER BY lastname ASC '.$from.';';
        C_dbGate::loadMany($SQL);
	}
    public function loadOnLatestShow($groupId, $last=100, $from = false, $count = false) { // used by /utilities/dmarketing.php
		
		// loads distinct last 100 visitors to have appointed in the agenda and not have cancelled thier appointment
		// from those 100, you can load only a part, from number e.g. 60 a bunch of 20 ($from = 60, $count = 20)
		
		$q = new Q('select distinct id, mobile, lastname, firstname from (
						(select reservations.cueIn, gender, lastname, firstname, mobile, visitors.id as id
							from reservations
								join att_visitors on att_visitors.groupId = reservations.id
								join visitors on visitors.id = att_visitors.resourceId

						where reservations.groupId='.$groupId.' and mobile <> "" and reservations.deletorId = 0 and visitors.deletorId = 0)
					UNION
						(select archive_reservations.cueIn, gender, lastname, firstname, mobile, visitors.id as id
							from archive_reservations
								join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
								join visitors on visitors.id = archive_att_visitors.resourceId

						where archive_reservations.groupId='.$groupId.' and mobile <> "" and archive_reservations.deletorId = 0 and visitors.deletorId = 0) 
				order by cueIn DESC 
			) ALIAS LIMIT '.$last.';');
		
			$ids = $q->ids();
			
		if($from!==false) $from = ' LIMIT '.$from.','.$count; else $from = '';

        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND id IN ('.$ids.') ORDER BY lastname ASC '.$from.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnFromAppDate($groupId, $date='2010-01-01', $to='', $xcolor = false, $rscid=false, $xdel=true, $from = false, $count = false) { // used by /utilities/dmarketing.php
		
		// loads distinct visitors to have appointed in the agenda from a given date and not have cancelled thier appointment
		// from those, you can load only a part, from number e.g. 60 a bunch of 20 ($from = 60, $count = 20)
		
		if($to) $to = ' and cueOut < UNIX_TIMESTAMP("'.$to.'") ';
		if($xdel) $xdel = ' and reservations.deletorId = 0 '; else $xdel = '';
		if($xdel) $xdela = ' and archive_reservations.deletorId = 0 '; else $xdela = '';
		if($xcolor) $xcolor = ' and visitors.cssColor <> '.$xcolor; else $xcolor = '';
		if($rscid) {
			$joinresc = 'join attendees on attendees.groupId = reservations.id';
			$joinrescA = 'join archive_attendees on archive_attendees.groupId = archive_reservations.id';
			$whereresc = 'and attendees.resourceId in ('.$rscid.')';
			$whererescA = 'and archive_attendees.resourceId in ('.$rscid.')';
		} else { $joinresc = ''; $joinrescA = ''; $whereresc = ''; $whererescA = ''; }
		
		$sql = 'select distinct id from (
						(select reservations.cueIn, gender, lastname, firstname, mobile, visitors.id as id
							from reservations
								join att_visitors on att_visitors.groupId = reservations.id
								join visitors on visitors.id = att_visitors.resourceId
								'.$joinresc.'
						where reservations.groupId='.$groupId.' and mobile <> ""
							'.$xdel.' and visitors.deletorId = 0 '.$xcolor.'
							and cueIn > UNIX_TIMESTAMP("'.$date.'") '.$to.'
							'.$whereresc.'
						) order by cueIn DESC 
					UNION
						(select archive_reservations.cueIn, gender, lastname, firstname, mobile, visitors.id as id
							from archive_reservations
								join archive_att_visitors on archive_att_visitors.groupId = archive_reservations.id
								join visitors on visitors.id = archive_att_visitors.resourceId
								'.$joinrescA.'
						where archive_reservations.groupId='.$groupId.' and mobile <> "" 
							'.$xdela.' and visitors.deletorId = 0 '.$xcolor.'
							and cueIn > UNIX_TIMESTAMP("'.$date.'") '.$to.'
							'.$whererescA.'
						) order by cueIn DESC 
			) ALIAS;';
			
		// echo '<br/>'.$sql;
		$q = new Q($sql);
		$ids = $q->ids();
		// echo '<br/>ids|'.$ids.'|';
			
			if(!$ids) return $this;
			
		if($from!==false) $from = ' LIMIT '.$from.','.$count; else $from = '';

			$SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND id IN ('.$ids.') ORDER BY lastname ASC '.$from.';';
        C_dbGate::loadMany($SQL);
    }
	
    public function loadClones($groupId, $email, $mobile, $lastname, $firstname) { // used from booking/post/visitors.php
        
		//load visitor duplicates for strict given lastname,firstname and (email OR mobile) 
		//called by booking/post/visitor.php to merge and remove clones from visitors tables 
		//the process is not applied in family mode
		//(*clone01*)
		
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND (email="'.$email.'" OR mobile='.$mobile.' OR (email = "" and mobile = "" ))
                AND lastname="'.$lastname.'" AND firstname = "'.$firstname.'" AND visitors.deletorId = 0 ORDER BY id ASC;';
        C_dbGate::loadMany($SQL);
    }
	
	public function match($field, $digits) { // see (*vs01*)
		
		$matchids = Array();
		foreach($this->keyed as $vid => $dS_v) {
		}
	}
	
	public function setAIformats($dS_group) {
		foreach($this->keyed as $id=>$dS_v) $dS_v->setAIformats($dS_group); // sets the phone numbers format to a readable set of subset of digits
		return $this;
	}
	public function guess_firstname($aid, $m1, $m2 ='') { // on metaphones
		
		if($aid===false) $aid = ''; else $aid = 'groupId = '.$aid.' AND ';
		$sql = '( SELECT * FROM visitors WHERE '.$aid.'metaphone1 = "'.$m1.'" ) UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone2 = "'.$m1.'" )';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$sql .= ' UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone1 = "'.$m2.'" ) UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone2 = "'.$m2.'" )';

		$sql = 'select * from ('.$sql.') as guess where deletorId = 0;';

		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_firstname()->dropdeleteditems()'); // is already included in the query
    }
	public function guess_lastname($aid, $m3, $m4 ='') { // on metaphones

		if($aid===false) $aid = ''; else $aid = 'groupId = '.$aid.' AND ';
		$sql = '( SELECT * FROM visitors WHERE '.$aid.'metaphone3 = "'.$m3.'" ) UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone4 = "'.$m3.'" )';
		if ($m4 !== $m3 && strlen($m4)) // most of m4's are empty
			$sql .= ' UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone3 = "'.$m4.'" ) UNION ( SELECT * FROM visitors WHERE '.$aid.'metaphone4 = "'.$m4.'" )';

		$sql = 'select * from ('.$sql.') as guess where deletorId = 0;';
		
		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_lastname()->dropdeleteditems()'); // is already included in the query
    }
	
	public function guess_on_fn_ln_bth($aid, $m1, $m2, $m3, $m4, $bth = 0) { // on metaphones

		if($aid===false) $aid = ''; else $aid = 'groupId = '.$aid.' AND ';
		
		$c1 = ' metaphone1 = "'.$m1.'" OR metaphone2 = "'.$m1.'" ';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$c1 .= ' OR metaphone1 = "'.$m2.'" OR metaphone2 = "'.$m2.'" ';
		$c1 = '('.$c1.')';

		$c2 = ' metaphone3 = "'.$m3.'" OR metaphone4 = "'.$m3.'" ';
		if ($m4 !== $m3 && strlen($m4)) // most of m4's are empty
			$c2 .= ' OR metaphone3 = "'.$m4.'" OR metaphone4 = "'.$m4.'" ';
		$c2 = '('.$c2.')';
		
		if($bth==0) $c0 = 'birthday = 0 AND '; else $c0 = 'birthday = '.$bth.' AND ';
		
		$sql = 'select * from visitors where '.$aid.$c0.$c1.' and '.$c2.' and deletorId = 0;';
		
		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_lastname()->dropdeleteditems()'); // is already included in the query
    }
	
	public function setLastnameLevenshtein($guess) { // appropriate method for human keyboard tipo
	
		foreach($this->keyed as $vid => $dS_v) {
			$dS_v->setLnLevenshtein($guess);
		}
	}
	
	public function setFirstnameLevenshtein($guess) { // appropriate method for human keyboard tipo
	
		foreach($this->keyed as $vid => $dS_v) {
			$dS_v->setFnLevenshtein($guess);
		}
	}

}
class C_dbAccess_genders extends C_dbGate { // mandatory include: language.php ( for reduceDiacriticsUTF8() )

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_stat_gender'; }
    public function getTableName() { return 'stat_genders'; }
    public function getNew() { return new C_dS_stat_gender(); }

    public $guesscount; 	// counts how many genders where not found
    public $nogender; 	// counts how many genders where not found
    public $foundgender; 	// counts how many genders where found
    public $preload;	// pre-loads all the table in memory, so to speed the execution, if you keep it false
    private $gcount; 	// genders counter used by preload

    public function __construct($preload = true) {
		C_dbGate::__construct();
        $this->guesscount = 0;
        $this->nogender = 0;
        $this->foundgender = 0;
        $this->gcount = 0;
        $this->preload = false;
        if($preload) {
            $letters = Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '\\');
            foreach($letters as $l) $this->preload[$l] = Array();
            $q = new Q('SELECT name, gender FROM stat_genders ORDER BY name ASC;');
            $nameToGender = $q->idx('name','gender');
			foreach($nameToGender as $name => $gender) {
				$name = preg_replace('/[^a-z]/', '', $name);
				if(!$name) continue;
				$initial = $name[0];
				$this->preload[$initial][$name] = $gender+0; // +0 stores it as an integer
			}
            $this->gcount = $q->cnt();
        }
    }
    public function __destruct() { }
    public function guess($name, $default = 0) {

        if(!isset($name[0])) return $default; // $name is an empty string
        $reduced = reduceDiacriticsUTF8($name, true); 
        if(!isset($reduced[0])) return $default; // $name is an empty string

		$this->guesscount++;
		
        if($this->preload === false) { // guess based on instant sql access 
            $q = new Q('SELECT gender FROM stat_genders WHERE name="'.$reduced.'";');
            if($q->cnt()) $this->foundgender++;
				else $this->nogender++;
			return $q->one('gender', $default);
        }

        // guess based on preloaded table
        $name1 = $reduced[0]; // the first letter
        if(isset($this->preload[$name1][$reduced])) {
			$this->foundgender++;
			return $this->preload[$name1][$reduced]; // which is 0 or 1 ( female or male )
		}
        else { $this->nogender++; return $default; }
    }
	public function guess_stat_firstname($m1, $m2 ='') { // guess on metaphones
		
		$sql = '( SELECT * FROM stat_genders WHERE metaphone1 = "'.$m1.'" ) UNION ( SELECT * FROM stat_genders WHERE metaphone2 = "'.$m1.'" )';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$sql .= ' UNION ( SELECT * FROM stat_genders WHERE metaphone1 = "'.$m2.'" ) UNION ( SELECT * FROM stat_genders WHERE metaphone2 = "'.$m2.'" )';

		$sql = 'select * from ('.$sql.') as guess order by males asc;'; //  

		$this->loadMany($sql);
		return $this;
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_firstname()->dropdeleteditems()'); // is already included in the query
    }
}
class C_dbAccess_lastnames extends C_dbGate { // mandatory include: language.php ( for reduceDiacriticsUTF8() )

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_stat_lastname'; }
    public function getTableName() { return 'stat_lastnames'; }
    public function getNew() { return new C_dS_stat_lastname(); }
	
    public $foundlastnames; 	// counts how many genders where found

    public function __construct($preload = true) {
        $this->foundlastnames = 0;
    }
    public function __destruct() { }
    public function guess($name, $default = 0) {
		
    }
	public function guess_stat_lastname($m1, $m2 ='') { // on metaphones

		$sql = '( SELECT * FROM stat_lastnames WHERE metaphone1 = "'.$m1.'" ) UNION ( SELECT * FROM stat_lastnames WHERE metaphone2 = "'.$m1.'" )';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$sql .= ' UNION ( SELECT * FROM stat_lastnames WHERE metaphone1 = "'.$m2.'" ) UNION ( SELECT * FROM stat_lastnames WHERE metaphone2 = "'.$m2.'" )';

		$sql = 'select * from ('.$sql.') as guess order by occurances desc;'; //  
		
		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_lastname()->dropdeleteditems()'); // is already included in the query
    }
}
class C_dbAccess_addresses extends C_dbGate { // mandatory include: language.php ( for reduceDiacriticsUTF8() )

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_stat_address'; }
    public function getTableName() { return 'stat_addresses'; }
    public function getNew() { return new C_dS_stat_address(); }
	
    public function __construct($addresstomatch = false, $filter = '', $zip = '') {
        C_dbGate::__construct();
		if($addresstomatch)
			$addresstomatch = C_dbAccess_addresses::cleanAddress($addresstomatch); // gets rid of house number
		echo $addresstomatch.chr(10);
		
		$threshold = 5; if($zip) $threshold = 3; // those thresholds values must stay aligned with the PHP counterpart, see (*ad02*)
		
		if($len = mb_strlen($addresstomatch) >= $threshold)
			$this->guess($addresstomatch, $filter, $zip);
			
    }
    public function __destruct() { C_dbGate::__destruct(); }
	
    public function guess($streetname, $filter = '', $zip = '') {
		$order = 'order by zip asc';
		if($filter) {
			$order = 'ORDER
				BY (FIELD(country'.$filter.') = 0) ASC, -- priority to those countries
				   FIELD(country'.$filter.') ASC,  -- in the given order
				   zip ASC   -- for the rest
				   ';
		}
		
		// if($zip) $zip = ' zip like "'.$zip.'%" and ';
		
		
		// $sql = 'SELECT * FROM stat_addresses WHERE'.$zip.' street LIKE "%'.$streetname.'%" '.$order.' LIMIT 1000;';
		$against = '+'.$streetname.'*'; if($zip) $against = '+'.$zip.'* '.$against;
		$match = 'MATCH(street)'; if($zip) $match = 'MATCH(zip,street)';
		$sql = 'SELECT * FROM stat_addresses WHERE '.$match.'  AGAINST ("'.$against.'" IN BOOLEAN MODE) '.$order.' LIMIT 1000;';
		
		echo '$SQL:'.$sql.chr(10);
		echo 'guessing...'.chr(10);
		$this->loadMany($sql);
    }
	public function guess_address_on_metaphones($m1, $m2 ='') { // on metaphones

		$sql = '( SELECT * FROM stat_addresses WHERE metaphone1 = "'.$m1.'" ) UNION ( SELECT * FROM stat_addresses WHERE metaphone2 = "'.$m1.'" )';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$sql .= ' UNION ( SELECT * FROM stat_addresses WHERE metaphone1 = "'.$m2.'" ) UNION ( SELECT * FROM stat_addresses WHERE metaphone2 = "'.$m2.'" )';

		$sql = 'select * from ('.$sql.') as guess;'; //  
		
		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_address()->dropdeleteditems()'); // is already included in the query
    }
	public static function cleanAddress($addr) { // was used by 2025_spoofy_address_reduction and can be used by client side auto-complete when searching for an address
		
		$mapping = C_dbAccess_addresses::$mapping;
		$lowering = C_dbAccess_addresses::$lowering;

		// 0) Normalize curly quotes → straight apostrophe
		$addr = str_replace(["’", "‘"], "'", $addr);

		// 1) Strip parentheses, commas, pluses; drop any "/<letters>" segments; normalize whitespace
		$addr = preg_replace('/\s*\([^)]*\)\s*/u', ' ', $addr);
		$addr = str_replace([',','+'], ' ', $addr);
		// remove any slash + word (e.g. /A, /rez)
		$addr = preg_replace('/\s*\/\s*[A-Za-z]+\b/u', ' ', $addr);
		$addr = preg_replace('/\s+/u', ' ', $addr);
		
		$addr = trim($addr, " \/\"\t\n\r\0\x0B,");

		// 2) Apply your place-type and other mapping
		foreach ($mapping as $pattern => $replacement) {
			$addr = preg_replace($pattern, $replacement, $addr);
		}

		// 3) Split into tokens, drop pure-punctuation; extract alpha-prefix for tokens with digits
		$tokens = preg_split('/\s+/u', $addr, -1, PREG_SPLIT_NO_EMPTY);
		$filtered = [];
		foreach ($tokens as $tok) {
			// tokens containing digits:
			if (preg_match('/\d/u', $tok)) {
				// if letter-prefix exists (e.g. "straat76" → "straat"), keep that
				if (preg_match('/^([^\d]+)\d+/u', $tok, $m) && preg_match('/\p{L}/u', $m[1])) {
					$filtered[] = $m[1];
				}
				continue;
			}
			// drop tokens with no letters (pure punctuation)
			if (!preg_match('/\p{L}/u', $tok)) {
				continue;
			}
			$filtered[] = $tok;
		}

		// 4) Re-assemble, lowercase, then Title Case except place-types
		$addr = implode(' ', $filtered);
		$addr = mb_strtolower($addr, 'UTF-8');

		// build place-types list
		$placeTypes = array_unique(array_map(
			function($w){ return mb_strtolower($w,'UTF-8'); },
			array_values($mapping)
		));
		$words = preg_split('/\s+/u', $addr, -1, PREG_SPLIT_NO_EMPTY);
		foreach ($words as &$w) {
			if (!in_array($w, $placeTypes, true)) {
				$w = mb_convert_case($w, MB_CASE_TITLE, 'UTF-8');
			}
		}
		$cleaned = implode(' ', $words);

		// 5) Apply lowering ("De La"→"de la", etc.)
		foreach ($lowering as $pattern => $replacement) {
			$cleaned = preg_replace($pattern, $replacement, $cleaned);
		}

		// 6) Collapse multiple apostrophes and uppercase following letter
		$cleaned = preg_replace("/['’]{2,}/u", "'", $cleaned);
		$cleaned = preg_replace_callback(
			"/([''])(\p{L})/u",
			function($m){ return $m[1] . mb_strtoupper($m[2], 'UTF-8'); },
			$cleaned
		);

		return $cleaned;
	}	


	// I need that exact same function set but in the js world, can you prepare it? (please keep all the comments, and the format (one line = one line).
	
	public static $mapping = [ // place type words:
			// Rue
			'/\b(?:rue|ru|r|r\.|rue\.)\b/ui'        => 'rue',
			// Avenue
			'/\b(?:avenue|avnue|aven|av|av\.|ave|ave\.|avenue\.)\b/ui' => 'avenue',
			// Place
			'/\b(?:place|pl|pl\.)\b/ui'       => 'place',
			// Boulevard
			'/\b(?:boulevard|boul|bvd|bvd\.|bld|bld\.|boul\.|bd|bd\.)\b/ui' => 'boulevard',
			// Chemin
			'/\b(?:chemin|chem|chem\.|ch|ch\.)\b/ui'     => 'chemin',
			// Impasse
			'/\b(?:impasse|imp|imp\.)\b/ui'  => 'impasse',
			// Lotissement
			'/\b(?:lotissement|lotissemen|lotisseme|lotissem|lotisse|lotiss|lotis|lot|lt\\.)\b/ui' => 'lotissement',   // 'lotissement',
			// Allée
			'/\b(?:allee|allée|all|all\.)\b/ui' => 'allée',
			// Faubourg
			'/\b(?:faubourg|faubg|faubg\.|fbg|fbg\.)\b/ui' => 'faubourg',
			// Passage
			'/\b(?:passage|pass|pass\.)\b/ui'  => 'passage',
			// Voie
			'/\b(?:voie|vo|vo\.)\b/ui'       => 'voie',
			// Route
			'/\b(?:route|rte|rte\.|route\.)\b/ui'    => 'route',
			// Cours
			'/\b(?:cours|cours?\.|c|c\.)\b/ui' => 'cours',
			// Clos
			'/\b(?:clos|clos?\.|cl|cl\.)\b/ui' => 'clos',
			// Chaussée
			'/\b(?:chaussee|chaussée|chausee|chssee|ch|ch\.)\b/ui' => 'chaussée',
			// Cité
			'/\b(?:cite|cite\.|cité|cité\.|ct|ct\.)\b/ui'        => 'cité',
			// Pont
			'/\b(?:pré|pre)\b/ui'        => 'pré',
			// Pont
			'/\b(?:pt|pt\.|pont|pont\.)\b/ui'        => 'pont',
			// Apt
			'/\b(?:appart|appart\\.|app|apt|appt)\b/ui' => '',   // drop “App”, “Apt”, etc. is part of house numbering
			// Sous-sol
			'/\b(?:\/Ssol|\/Ssol\.|\/Ss|\/Ss\.|Ssol|Ssol\.|Ss|Ss\.)\b/ui' => '', 
			
			'/
			  (?<![A-Za-z])              # pas de lettre juste avant
			  (?:                        # début de la liste des préfixes
				 bus
			   | box\.?                   # "box" ou "box."
			   | bx\.?                    # "bx" ou "bx."
			   | b\.                      # "b."
			   | boite
			   | bat\.?                   # "bat" ou "bat."
			   | bât\.?                   # "bât" ou "bât."
			   | bte\.?                   # "bte" ou "bte."
			   | bt\.?                   # "bt" ou "bt."
			   | b                        # seul "b"
			  )
			  (?:\d{1,3}[A-Za-z]?)?       # optionnel : 1–3 chiffres + 0 ou 1 lettre
			  (?=                         # ce qui suit doit être...
				 $                        #   soit la fin de chaîne
			   | [ ,]                     #   soit un espace ou une virgule
			  )
			/ixu'		        => '',
			
			// Specific to remove house numbers from address
			// '/\b(?:bus|b\.|boite|bte|bte\.)\b/ui'        => '',
			// '/(?<![A-Za-z])(?:bus|b\.|boite|bte\.?)(?:\d{1,3})?(?![A-Za-z])/iu'        => '',
			
			'/\b(?:étage|etage|et\.)\b/ui'        => '',
			'/,/'        => ' ',
			'/\+/'        => '',
			'/"/'        => ''
			
		];

	
	// linking words that should stay lowercase: apply *after* you’ve lowercased the full string
	public static $lowering = [
		// 1) “De La” must stay “de la”
		'/\bDe La\b/iu'           => 'de la',

		// 2) “De L ” or “De L'” (any mix of space+apostrophe) → “de l'”
		//    (?=\p{L}) makes sure we stop _just_ before the next letter
		'/\bDe L[\'\s]+(?=\p{L})/iu' => "de l'",

		// 3) the other plurals/articles
		'/\bDes\b/iu'             => 'des',
		'/\bDu\b/iu'              => 'du',
		'/\bDe\b/iu'              => 'de',

		// 4) stray single-letter elisions (in case of “D Or”, “L Abattoir”)
		'/\bD[\'\s]+(?=\p{L})/iu'   => "d'",
		'/\bL[\'\s]+(?=\p{L})/iu'   => "l'",
	];
}
class C_dbAccess_zips extends C_dbGate { // mandatory include: language.php ( for reduceDiacriticsUTF8() )

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_stat_zip'; }
    public function getTableName() { return 'stat_zips'; }
    public function getNew() { return new C_dS_stat_zip(); }
	
    public function __construct($zip = false) {
        C_dbGate::__construct();
		if(preg_match('/^(?=(?:.*\d){2,})[A-Za-z0-9\s-]{2,}$/u', $zip)) $zip = $zip; else $zip = ''; // has at least two digits, and only letters/digits/spaces/hyphens → keep
		echo chr(10).'zip to match:|'.$zip.'|  ('.mb_strlen($zip).' chars)'.chr(10);
		
		if($len = mb_strlen($zip) >= 2) $this->guess($zip);
			
    }
    public function __destruct() { C_dbGate::__destruct(); }
	
    public function guess($zip) {
		$sql = 'SELECT * FROM stat_zips WHERE zip LIKE "'.$zip.'%" limit 1000;';
		echo chr(10).chr(10).'sql:'.$sql.chr(10);
		
		echo 'guessing...'.chr(10);
		$this->loadMany($sql);
    }
	public function guess_zip_on_metaphones($m1, $m2 ='') { // on metaphones

		$sql = '( SELECT * FROM stat_zips WHERE cmetaphone1 = "'.$m1.'" ) UNION ( SELECT * FROM stat_zips WHERE cmetaphone2 = "'.$m1.'" )';
		if ($m2 !== $m1 && strlen($m2)) // most of m2's are empty
			$sql .= ' UNION ( SELECT * FROM stat_zips WHERE cmetaphone1 = "'.$m2.'" ) UNION ( SELECT * FROM stat_zips WHERE cmetaphone2 = "'.$m2.'" )';

		$sql = 'select * from ('.$sql.') as guess;'; //  
		
		$this->loadMany($sql);
		// $this->dropdeleteditems('C_dbAccess_visitors::guess_zip()->dropdeleteditems()'); // is already included in the query
    }
	public static function cleanzip($addr) { // was used by 2025_spoofy_zip_reduction and can be used by client side auto-complete when searching for an zip
		
		$mapping = C_dbAccess_zips::$mapping;
		$lowering = C_dbAccess_zips::$lowering;

		// 0) Normalize curly quotes → straight apostrophe
		$addr = str_replace(["’", "‘"], "'", $addr);

		// 1) Strip parentheses, commas, pluses; drop any "/<letters>" segments; normalize whitespace
		$addr = preg_replace('/\s*\([^)]*\)\s*/u', ' ', $addr);
		$addr = str_replace([',','+'], ' ', $addr);
		// remove any slash + word (e.g. /A, /rez)
		$addr = preg_replace('/\s*\/\s*[A-Za-z]+\b/u', ' ', $addr);
		$addr = preg_replace('/\s+/u', ' ', $addr);
		
		$addr = trim($addr, " \/\"\t\n\r\0\x0B,");

		// 2) Apply your place-type and other mapping
		foreach ($mapping as $pattern => $replacement) {
			$addr = preg_replace($pattern, $replacement, $addr);
		}

		// 3) Split into tokens, drop pure-punctuation; extract alpha-prefix for tokens with digits
		$tokens = preg_split('/\s+/u', $addr, -1, PREG_SPLIT_NO_EMPTY);
		$filtered = [];
		foreach ($tokens as $tok) {
			// tokens containing digits:
			if (preg_match('/\d/u', $tok)) {
				// if letter-prefix exists (e.g. "straat76" → "straat"), keep that
				if (preg_match('/^([^\d]+)\d+/u', $tok, $m) && preg_match('/\p{L}/u', $m[1])) {
					$filtered[] = $m[1];
				}
				continue;
			}
			// drop tokens with no letters (pure punctuation)
			if (!preg_match('/\p{L}/u', $tok)) {
				continue;
			}
			$filtered[] = $tok;
		}

		// 4) Re-assemble, lowercase, then Title Case except place-types
		$addr = implode(' ', $filtered);
		$addr = mb_strtolower($addr, 'UTF-8');

		// build place-types list
		$placeTypes = array_unique(array_map(
			function($w){ return mb_strtolower($w,'UTF-8'); },
			array_values($mapping)
		));
		$words = preg_split('/\s+/u', $addr, -1, PREG_SPLIT_NO_EMPTY);
		foreach ($words as &$w) {
			if (!in_array($w, $placeTypes, true)) {
				$w = mb_convert_case($w, MB_CASE_TITLE, 'UTF-8');
			}
		}
		$cleaned = implode(' ', $words);

		// 5) Apply lowering ("De La"→"de la", etc.)
		foreach ($lowering as $pattern => $replacement) {
			$cleaned = preg_replace($pattern, $replacement, $cleaned);
		}

		// 6) Collapse multiple apostrophes and uppercase following letter
		$cleaned = preg_replace("/['’]{2,}/u", "'", $cleaned);
		$cleaned = preg_replace_callback(
			"/([''])(\p{L})/u",
			function($m){ return $m[1] . mb_strtoupper($m[2], 'UTF-8'); },
			$cleaned
		);

		return $cleaned;
	}	


	// I need that exact same function set but in the js world, can you prepare it? (please keep all the comments, and the format (one line = one line).
	
	public static $mapping = [ // place type words:
			// Rue
			'/\b(?:rue|ru|r|r\.|rue\.)\b/ui'        => 'rue',
			// Avenue
			'/\b(?:avenue|avnue|aven|av|av\.|ave|ave\.|avenue\.)\b/ui' => 'avenue',
			// Place
			'/\b(?:place|pl|pl\.)\b/ui'       => 'place',
			// Boulevard
			'/\b(?:boulevard|boul|bvd|bvd\.|bld|bld\.|boul\.|bd|bd\.)\b/ui' => 'boulevard',
			// Chemin
			'/\b(?:chemin|chem|chem\.|ch|ch\.)\b/ui'     => 'chemin',
			// Impasse
			'/\b(?:impasse|imp|imp\.)\b/ui'  => 'impasse',
			// Lotissement
			'/\b(?:lotissement|lotissemen|lotisseme|lotissem|lotisse|lotiss|lotis|lot|lt\\.)\b/ui' => 'lotissement',   // 'lotissement',
			// Allée
			'/\b(?:allee|allée|all|all\.)\b/ui' => 'allée',
			// Faubourg
			'/\b(?:faubourg|faubg|faubg\.|fbg|fbg\.)\b/ui' => 'faubourg',
			// Passage
			'/\b(?:passage|pass|pass\.)\b/ui'  => 'passage',
			// Voie
			'/\b(?:voie|vo|vo\.)\b/ui'       => 'voie',
			// Route
			'/\b(?:route|rte|rte\.|route\.)\b/ui'    => 'route',
			// Cours
			'/\b(?:cours|cours?\.|c|c\.)\b/ui' => 'cours',
			// Clos
			'/\b(?:clos|clos?\.|cl|cl\.)\b/ui' => 'clos',
			// Chaussée
			'/\b(?:chaussee|chaussée|chausee|chssee|ch|ch\.)\b/ui' => 'chaussée',
			// Cité
			'/\b(?:cite|cite\.|cité|cité\.|ct|ct\.)\b/ui'        => 'cité',
			// Pont
			'/\b(?:pré|pre)\b/ui'        => 'pré',
			// Pont
			'/\b(?:pt|pt\.|pont|pont\.)\b/ui'        => 'pont',
			// Apt
			'/\b(?:appart|appart\\.|app|apt|appt)\b/ui' => '',   // drop “App”, “Apt”, etc. is part of house numbering
			// Sous-sol
			'/\b(?:\/Ssol|\/Ssol\.|\/Ss|\/Ss\.|Ssol|Ssol\.|Ss|Ss\.)\b/ui' => '', 
			
			'/
			  (?<![A-Za-z])              # pas de lettre juste avant
			  (?:                        # début de la liste des préfixes
				 bus
			   | box\.?                   # "box" ou "box."
			   | bx\.?                    # "bx" ou "bx."
			   | b\.                      # "b."
			   | boite
			   | bat\.?                   # "bat" ou "bat."
			   | bât\.?                   # "bât" ou "bât."
			   | bte\.?                   # "bte" ou "bte."
			   | bt\.?                   # "bt" ou "bt."
			   | b                        # seul "b"
			  )
			  (?:\d{1,3}[A-Za-z]?)?       # optionnel : 1–3 chiffres + 0 ou 1 lettre
			  (?=                         # ce qui suit doit être...
				 $                        #   soit la fin de chaîne
			   | [ ,]                     #   soit un espace ou une virgule
			  )
			/ixu'		        => '',
			
			// Specific to remove house numbers from zip
			// '/\b(?:bus|b\.|boite|bte|bte\.)\b/ui'        => '',
			// '/(?<![A-Za-z])(?:bus|b\.|boite|bte\.?)(?:\d{1,3})?(?![A-Za-z])/iu'        => '',
			
			'/\b(?:étage|etage|et\.)\b/ui'        => '',
			'/,/'        => ' ',
			'/\+/'        => '',
			'/"/'        => ''
			
		];

	
	// linking words that should stay lowercase: apply *after* you’ve lowercased the full string
	public static $lowering = [
		// 1) “De La” must stay “de la”
		'/\bDe La\b/iu'           => 'de la',

		// 2) “De L ” or “De L'” (any mix of space+apostrophe) → “de l'”
		//    (?=\p{L}) makes sure we stop _just_ before the next letter
		'/\bDe L[\'\s]+(?=\p{L})/iu' => "de l'",

		// 3) the other plurals/articles
		'/\bDes\b/iu'             => 'des',
		'/\bDu\b/iu'              => 'du',
		'/\bDe\b/iu'              => 'de',

		// 4) stray single-letter elisions (in case of “D Or”, “L Abattoir”)
		'/\bD[\'\s]+(?=\p{L})/iu'   => "d'",
		'/\bL[\'\s]+(?=\p{L})/iu'   => "l'",
	];
}


class C_dbAccess_resafiles extends C_dbGate { // group to a visitorId

    public function __construct($resaId = false) { 
        C_dbGate::__construct(); 
        if($resaId) $this->loadOnField('reservationId', $resaId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_resafile'; }
    public function getTableName() { return 'resafiles'; }
    public function getNew() { return new C_dS_resafile(); }
	
	public function loadByResaIds($resaIds) {
        $SQL = 'SeLecT * from '.$this->getTableName().' where reservationId in ('.$resaIds.'); -- C_dbAccess_resafiles::loadByResaIds()';
        C_dbGate::loadMany($SQL);
    }
}
class C_dbAccess_files extends C_dbGate { // group to a visitorId

    public function __construct($visitorId = false) { 
        C_dbGate::__construct(); 
        if($visitorId) $this->loadOnField('visitorId', $visitorId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_file'; }
    public function getTableName() { return 'files'; }
    public function getNew() { return new C_dS_file(); }
}
class C_dbAccess_logos extends C_dbGate { // group to a visitorId

    public function __construct($accountId = false) { 
        C_dbGate::__construct(); 
        if($accountId) $this->loadOnGroup($accountId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_logo'; }
    public function getTableName() { return 'logos'; }
    public function getNew() { return new C_dS_logo(); }
    public static function removeLogin($loginId) { 
		$q = new Q('select id from logos where loginId = '.$loginId.';');
		if($q->ids()) {
			$logosIds = $q->ids(list_as_array);
			foreach($logosIds as $lid) 
				C_dS_logo::remove($lid);
		}
	}
    public static function removeAccount($accountId) { 
		$q = new Q('select id from logos WHERE groupId = '.$accountId.';');
		if($q->ids()) {
			$logosIds = $q->ids(list_as_array);
			foreach($logosIds as $lid) 
				C_dS_logo::remove($lid);
		}
	}
}


define( 'reservationsLoad_thisDay'	, 0	);
define( 'reservationsLoad_past'		, 1	);
define( 'reservationsLoad_future'	, 2	);

define('plitems_visible_on_frame', 0);	// load resas that end, begin, overlap, or are totally contained in the given time frame: for use when displaying planning grids
define('plitems_starting_on_frame', 1); // load resas that strictly begin in the given time frame: for use when sending remainders
define('plitems_all_before', 2); // load all resas that are before stampSearchOut
define('plitems_all_after', 3); // load all resas that are before stampSearchOut
define('plitems_all_ever', 4); // load all resas that are before stampSearchOut
define('plitems_changed_on_frame', 5); // load all resas that where changed, created or deleted in the timeframe

define('plitems_have_not', 0); 
define('plitems_have', 1); 
define('plitems_have_never', 2);
define('plitems_have_ever', 3);  



////////////////////////
//
//  
class C_dbAccess_availabilities extends C_dbGate {
    public $targetTable;
    public function __construct($dbAccess_reservations) { 
        C_dbGate::__construct(); 
		foreach($dbAccess_reservations->keyed as $resaid => $dS_reservation) {
			$this->keyed[$resaid] = new C_dS_availability($resaid,0,$dS_reservation); // dS_availability will pick the fields it is made for
		}
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_availability'; }	
    public function getTableName() { return $this->targetTable.'availabilities'; }
    public function getNew() { return new C_dS_availability(); }
    public function getClone($original) { return new C_dS_availability(0,$original->groupId,$original); }

    // Specific to this Class:
    //
    public function gmtshift($gmtshift) {
        if($this->count())
            foreach($this->keyed as $resaId => $dS_resa)
                $dS_resa->gmtshift($gmtshift);
    }

	public function magnify4AI($attendees, $performances) { // adds visitorIds | workcodeIds | resourceIds
	    
		foreach($this->keyed as $id=>$availability) $availability->dSmagnify4AI(); // sets up empty visitorIds | workcodeIds | resourceIds
		
		// now we fill the new members
		
		
		// attendees (they reference C_dS_resource ids)
		$packed = Array();
		foreach($attendees->keyed as $attid=>$dS_attendee) {
			$resaid = $dS_attendee->groupId;
			if(!isset($packed[$resaid])) $packed[$resaid] = Array();
			$packed[$resaid][] = $dS_attendee->resourceId;
		}
		foreach($packed as $resaid => $pack)
			$this->keyed[$resaid]->resourceIds = implode(',',$pack); 



		// performances (they reference C_dS_visitor ids)
		$packed = Array();
		foreach($performances->keyed as $pid=>$dS_performance) {
			$resaid = $dS_performance->groupId;
			if(!isset($packed[$resaid])) $packed[$resaid] = Array();
			$packed[$resaid][] = $dS_performance->workCodeId;
		}
		foreach($packed as $resaid => $pack)
			$this->keyed[$resaid]->workcodeIds = implode(',',$pack); 


		return $this;
    }
	public function read4ai($inclusiveCueOut = false, $inclusivedate = true) { // builds a textual example of how to read the reservations.
		global $nl;
		$read = '';
		$apps = Array();
		$takeabreak = '"'.$nl.'Take a break, ask for user selection or invite to read further. In case of more options asked, keep reading:'.$nl.'"';
		$previd = false; 
		$movingdate = '';
		foreach ($this->keyed as $id=>$availability) {
			$newdate = substr($availability->cueIn,0,10); // which is something like "2025-04-11"
			$inclusivedate = false; if($newdate != $movingdate) $inclusivedate = true;
			if($previd && ($newdate != $movingdate)) $apps[$previd] = 'and '.$apps[$previd].$takeabreak;
			$s = $availability->readCues4ai($inclusivedate, $inclusiveCueOut); // the return string has variants depending on entire day event or few minutes events
			$apps[$id] = $s;
			$previd = $id;
			$movingdate = $newdate;
		}
		if($previd && $newdate != $movingdate) $apps[$previd] = $apps[$previd].$takeabreak;
		$read .= implode(', ',$apps);
		$read .= '.';
		return $read;
	}

}

////////////////////////
//
//  
class C_dbAccess_reservations extends C_dbGate {
    public $targetTable;
    public function __construct($targetTable = '', $resaIdsORsql = false) { 
        $this->targetTable = $targetTable;
        C_dbGate::__construct(); 
		if($resaIdsORsql) {
			$ids = '';
			if(strtolower(substr($resaIdsORsql,0,6))=='select') { // than we received an SQL statement as input
				$q = new Q($resaIdsORsql); $ids = $q->ids();
			} else
				$ids = $resaIdsORsql;
			$this->loadOnId($ids); // preload if $resaIds are known and passed
		}
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_reservation'; }	
    public function getTableName() { return $this->targetTable.'reservations'; }
    public function getNew() { return new C_dS_reservation(); }
    public function getClone($original) { return new C_dS_reservation(0,$original->groupId,$original); }

    // Specific to this Class:
    //

    public function loadOnWaitingList($cueFrom, $rescIds, $duration) { 

        $resatable = $this->getTableName();
        $time = 'cueIn > '.$cueFrom;
        $duration = '(cueOut-cueIn) <= '.$duration;
        $resaJoin = $resatable.' ON '.$resatable.'.id = attendees.groupId';
        $SQL1 = 'SELECT DISTINCT attendees.groupId AS id, cueIn
				FROM attendees JOIN '.$resaJoin.' WHERE waitingList = 1 AND deletorId = 0
				AND '.$time.' AND resourceId IN ('.$rescIds.') AND '.$duration.' ORDER BY cueIn ASC LIMIT 10;'; // we have a LIMIT but anyway we want to load completely the last scanned day
        $q = new Q($SQL1); $ids = $q->ids(false); $cueLast = $q->maximum('cueIn');


        if($cueLast) { // finish the started calendar day
            $dateLast = new C_date($cueLast);
            $mindnLast = $dateLast->setToMidnight()->getTstmp();
            $time = 'cueIn > '.$mindnLast.' AND cueIn < '.($mindnLast+86400); // so we complete covering the last calendar day
            $SQL2 = 'SELECT DISTINCT attendees.groupId AS id 
					FROM attendees JOIN '.$resaJoin.' WHERE waitingList = 1 AND deletorId = 0
					AND '.$time.' AND resourceId IN ('.$rescIds.') AND '.$duration.';';

            $q = new Q($SQL2); $ids = array_merge($ids, $q->ids(false));
        }

        if(count($ids)) return $this->loadOnId(implode(',',$ids));
        return '';
    }

    public function loadOnIdsAndView($ids, $rescIds) {
        $filterOnResource = ''; $joinOnAttendees = ''; 
        $tableName = $this->getTableName(); // varies when you e.g. go to archive tables
        if($rescIds) {
            $attendeesTable = $this->targetTable.'attendees';
            $joinOnAttendees = ' JOIN '.$attendeesTable.' ON '.$attendeesTable.'.groupId = '.$tableName.'.id';
            $filterOnResource = ' AND resourceId IN ('.$rescIds.')'; 
        }		
		$SQL = 'SELECT '.$tableName.'.id AS id FROM '.$tableName.$joinOnAttendees.'	WHERE '.$tableName.'.id IN ('.$ids.')'.$filterOnResource.';';
		// echo chr(10).$SQL.chr(10);
        $q = new Q($SQL);
        $ids = $q->ids(); if($ids) return $this->loadOnId($ids);
        return '';
    }

    public function load4iCal($accId, $rescId) {

        $joinOnAttendees = ' JOIN attendees ON attendees.groupId = reservations.id';
        $q = new Q('SELECT reservations.id AS id FROM reservations'.$joinOnAttendees.' WHERE reservations.groupId = '.$accId.' AND reservations.deletorId = 0 AND resourceId IN ('.$rescId.');');
        $ids = $q->ids();
        return $this->loadOnId($ids);
    }

    public function loadOnTimeSpan( $accountid,
        $stampSearchIn, $stampSearchOut, $timescope = plitems_visible_on_frame,  
        $rescIds = false, $fulldays = false, $actions = false, $logins = false, $verbose = false, $deleted = 0, $limit = false ) // PVH 2025 for AI: added $deleted, added $limit
    {
        $tableName = $this->getTableName(); // varies when you wnat to fetch from archive tables, e.g. 'archive_reservations' iso 'reservations'
        $f_rscs = ''; $j_att = ''; 
        $f_cues = ''; // filter on reservations.cues (start time and end time of appointments)
        $f_actions = '';
        $f_logins = '';
        $f_deleted = ''; // default behaviour loads all reservations deleted or not.
        $f_limit = ''; // default behaviour loads all reservations.
        $f_account = $tableName.'.groupId = '.$accountid; // filter on account
        if($actions) {
            $actfilters = Array();
            if($logins) { // combined filters on logins and actions
                if($actions&1) $actfilters[] = 'creatorId IN ('.$logins.')';
                if($actions&2) $actfilters[] = 'changerId IN ('.$logins.')';
                if($actions&4) $actfilters[] = 'deletorId IN ('.$logins.')'; else $actfilters[] = 'deletorId = 0';
            } else {
                if($actions&1) $actfilters[] = 'creatorId <> 0';
                if($actions&2) $actfilters[] = 'changerId <> 0';
                if($actions&4) $actfilters[] = 'deletorId <> 0'; else $actfilters[] = 'deletorId = 0';
            }
            $f_actions = ' and '.implode(' AND ',$actfilters); // always keep the heading space, it spaces the SQL commands
        } else {
            if($logins) { // filters on login for unrelevant actions
                $f_logins = ' AND (creatorId IN ('.$logins.') OR changerId IN ('.$logins.') OR deletorId IN ('.$logins.'))';
            }
        }
        if($rescIds) {
            $attendeesTable = $this->targetTable.'attendees';
            $j_att = ' join '.$attendeesTable.' on '.$attendeesTable.'.groupId = '.$tableName.'.id';
            $f_rscs = ' and resourceId in ('.$rescIds.')'; // always keep the heading space, it spaces the SQL commands
        }
        switch($timescope) {
            case plitems_visible_on_frame: 	$f_cues = ' and cueOut > '.$stampSearchIn.' and cueIn < '.$stampSearchOut; break; // for planning display
            case plitems_starting_on_frame: $f_cues = ' and cueIn >= '.$stampSearchIn.' and cueIn < '.$stampSearchOut; break; // for SMS hourly cron
            case plitems_all_before: 		$f_cues = ' and cueOut < '.$stampSearchOut; break;
            case plitems_all_after: 		$f_cues = ' and cueIn > '.$stampSearchIn; break;
            
			case plitems_changed_on_frame: // for changes display (what has been added, changed or removed in the agenda in the given timeframe)

						$stampIn = new C_date($stampSearchIn); $stampIn = '"'.$stampIn->get_ISO8601_stamp().'"'; // standard used by mySQL timestamp type
						$stampOut = new C_date($stampSearchOut); $stampOut = '"'.$stampOut->get_ISO8601_stamp().'"'; // standard used by mySQL timestamp type
					$creation = '(created >= '.$stampIn.' AND created < '.$stampOut.')'; 
					$changing = '(changed >= '.$stampIn.' AND changed < '.$stampOut.')'; 
					$deletion = '(deleted >= '.$stampIn.' AND deleted < '.$stampOut.')'; 
                $f_cues = ' and ('.$creation.' OR '.$changing.' OR '.$deletion.')'; // always keep the heading space, it spaces the SQL commands
                break; 
        }
		if($fulldays) {
			$f_cues .= ' and FROM_UNIXTIME(cueIn,"%H:%i") = "00:00" and FROM_UNIXTIME(cueOut,"%H:%i") = "00:00"';
		}
		
		// the following two "deleted" modes are used by the AI api.
		if($deleted===false) { // then exclude deleted reservations from this query , the default value DOES RETURN deleted reservations
			$f_deleted .= ' and '.$tableName.'.deleted = 0'; // always keep the heading space, it spaces the SQL commands
		} else if($deleted===true) { // then return ONLY deleted reservations
			$f_deleted .= ' and '.$tableName.'.deleted <> 0'; // always keep the heading space, it spaces the SQL commands
		}
		
		// lmit the number of returned items (AI uses value 1 to query the next to start appointment)
		if($limit!==false) { // then return ONLY deleted reservations
			$f_limit .= ' limit '.$limit.''; // always keep the heading space, it spaces the SQL commands
		}
		
		$sql = 'select '.$tableName.'.* from '.$tableName.$j_att.' where '.$f_account.$f_deleted.$f_cues.$f_rscs.$f_actions.$f_logins.$f_limit.'; -- dbio.php::loadOnTimeSpan()';
		if($verbose) {
			echo '<br/>loadOnTimeSpan() SQL:';
			echo '<br/>'.$sql.'<br/>&nbsp;';
			echo '<br/>&nbsp;';
		}
		
		
// Examples:  with filters activated on logins, if you uploaded the client some weeks ago, the apploader id is zero, and those reservations will not be sent sms to.
//
// select reservations.* from reservations where reservations.groupId = 2944 and cueIn >= 1768345200 and cueIn < 1768431600; -- dbio.php::loadOnTimeSpan()
//
// select reservations.* from reservations where reservations.groupId = 2944 and cueIn >= 1768345200 and cueIn < 1768431600 
//		AND (creatorId IN (35870,36361,35972,35964) OR changerId IN (35870,36361,35972,35964) OR deletorId IN (35870,36361,35972,35964));
//
// 
		
		
		
		C_dbGate::loadMany($sql);
		return $this;
	
    }
    public function planningChecksum( $accountid, // this function can be used by systems caching algotrythms before calling loadOnTimeSpan(), if the checksum changed, then your cache should reload the concerned days.
        $stampSearchIn, $stampSearchOut, $timescope = plitems_visible_on_frame,  
        $rescIds = false, $fulldays = false, $verbose = true ) 
    {
        $tableName = $this->getTableName(); // varies when you e.g. go to archive tables
        $f_rscs = ''; $j_att = ''; 
        $f_cues = ''; // filter on reservations.cues (start time and end time of appointments)
        $f_account = $tableName.'.groupId = '.$accountid; // filter on account
        if($rescIds) {
            $attendeesTable = $this->targetTable.'attendees';
            $j_att = ' join '.$attendeesTable.' on '.$attendeesTable.'.groupId = '.$tableName.'.id';
            $f_rscs = ' and resourceId in ('.$rescIds.')'; 
        }
        switch($timescope) {
            case plitems_visible_on_frame: 	$f_cues = ' and cueOut > '.$stampSearchIn.' and cueIn < '.$stampSearchOut; break; // for planning display
            case plitems_starting_on_frame: $f_cues = ' and cueIn >= '.$stampSearchIn.' and cueIn < '.$stampSearchOut; break; // for SMS hourly cron
            case plitems_all_before: 		$f_cues = ' and cueOut < '.$stampSearchOut; break;
            case plitems_all_after: 		$f_cues = ' and cueIn > '.$stampSearchIn; break;            
        }
		if($fulldays) {
			$f_cues .= ' and FROM_UNIXTIME(cueIn,"%H:%i") = "00:00" and FROM_UNIXTIME(cueOut,"%H:%i") = "00:00"';
		}
		
			$sql = 'select sum('.$tableName.'.id * '.$tableName.'.rversion) as c from '.$tableName.$j_att.' where '.$f_account.$f_cues.$f_rscs.';';
			// $sql = 'select sum('.$tableName.'.rversion) as c from '.$tableName.$j_att.' where '.$f_account.$f_cues.$f_rscs.';';
		$q = new Q($sql,'C_dbAccess_reservations::planningChecksum()');
		$c = $q->c();
		if($verbose) {
			echo '<br/>Checksum:'.$c;
			echo '<br/>SQL:<br/>'.$sql.'<br/>&nbsp;';
		} 
		
		return $c;
    }

    public function loadPeers() { // scans the current collection and load their peer reservations
        $ids = Array();
        if($this->count())
            foreach($this->keyed as $id => $o_dS_reservation)
                if($o_dS_reservation->peerId) 
                    $ids[] = $o_dS_reservation->peerId;
        if(count($ids))
            $this->loadOnId(implode(',',$ids));
    }
    public function gmtshift($gmtshift) {
        if($this->count())
            foreach($this->keyed as $resaId => $dS_resa)
                $dS_resa->gmtshift($gmtshift);
    }
	public function addmeta_prebooking() {
		
        if($this->count()) {
			
			$ids = $this->getIdsList();
			$q = new Q('select reservationId as id, delay as d from prebooking_delays where reservationId IN('.$ids.');');
			$a = $q->idx('id','d');
			
            foreach($this->keyed as $resaId => $dS_resa) {
				$delay = isset($a[$dS_resa->id]) ? $a[$dS_resa->id] : 0;
				$dS_resa->prebooking = $delay;
			}
		}
		
		return $this;		
	}

    public function addmeta_datetimeVerbose(){ // used from booking/ for displaying account site timezone information 
		// solution for displaying account location timezone see (*dtacc01*)
	    foreach ($this->keyed as $id=>$reservation) $reservation->addmeta_datetimeVerbose();
    }
	public function magnify4AI($attendees, $att_visitor, $performances) { // adds visitorIds | workcodeIds | resourceIds
	    
		foreach($this->keyed as $id=>$reservation) $reservation->dSmagnify4AI(); // sets up empty visitorIds | workcodeIds | resourceIds
		
		// now we fill the new members
		
		
		// attendees (they reference C_dS_resource ids)
		$packed = Array();
		foreach($attendees->keyed as $attid=>$dS_attendee) {
			$resaid = $dS_attendee->groupId;
			if(!isset($packed[$resaid])) $packed[$resaid] = Array();
			$packed[$resaid][] = $dS_attendee->resourceId;
		}
		foreach($packed as $resaid => $pack)
			$this->keyed[$resaid]->resourceIds = implode(',',$pack); 



		// att_visitor (they reference C_dS_visitor ids)
		$packed = Array();
		foreach($att_visitor->keyed as $attid=>$dS_att_visitor) {
			$resaid = $dS_att_visitor->groupId;
			if(!isset($packed[$resaid])) $packed[$resaid] = Array();
			$packed[$resaid][] = $dS_att_visitor->resourceId;
		}
		foreach($packed as $resaid => $pack)
			$this->keyed[$resaid]->visitorIds = implode(',',$pack); 



		// performances (they reference C_dS_visitor ids)
		$packed = Array();
		foreach($performances->keyed as $pid=>$dS_performance) {
			$resaid = $dS_performance->groupId;
			if(!isset($packed[$resaid])) $packed[$resaid] = Array();
			$packed[$resaid][] = $dS_performance->workCodeId;
		}
		foreach($packed as $resaid => $pack)
			$this->keyed[$resaid]->workcodeIds = implode(',',$pack); 


		return $this;
    }
	public function read4ai($dbAccess_visitors, $dbAccess_workcodes = false, $includeswho = true, $inclusiveCueOut = true, $inclusiveworkcode = false, $inclusivedate = false) { // builds a textual example of how to read the reservations.
		$read = '';
		$apps = Array();
		foreach($this->keyed as $id=>$reservation) {
			
			$s = $reservation->readCues4ai($inclusivedate, $inclusiveCueOut); // the return string has variants depending on entire day event or few minutes events
			$visiids = $reservation->visitorIds; $r = explode(',',$visiids); // $r is an Array();
			if($visiids) { // appointment
				$s .= ' an appointment';
				if($includeswho) {
					$s .= ' with'; $and = '';
					foreach($r as $vid) {
						$s.= ' '.$and.$dbAccess_visitors->keyed[$vid]->getFullName();
						$and = 'and ';
					}
				}
				if($dbAccess_workcodes)
					 if($dbAccess_workcodes->count())
							if($reservation->workcodeIds) {
							$wkids = explode(',',$reservation->workcodeIds);
							$s .= ' for "'.$dbAccess_workcodes->keyed[$wkids[0]]->name.'"';
						}
				
			} else { // no visitor referenced, that is a private time reservation
				$isoneday = $reservation->isoneday();
				switch($isoneday) {
					case 0: $s .= ' a private time reservation'; break;
					case 1: $s .= ' a full day event'; break; // see (*ai01*)
					case -1: $s .= ' off days'; break;
				}
				
				$n = trim($reservation->note);
				if($n) $s .= ' with the following note: "'.$n.'"';
				else $s .= ' (there is no note)';
			}
			$apps[] = $s;
		}
		$read .= implode(', ',$apps);
		$read .= '.';
		return $read;
	}

	public function orderedOnCueIn() {
		$byCueIn = [];
		foreach($this->keyed as $resaid=>$dS_reservation) $byCueIn[$dS_reservation->cueIn] = $dS_reservation;
		ksort($byCueIn, SORT_NUMERIC);
		return $byCueIn;
	}
}
class C_dbAccess_resaparts extends C_dbGate {
    public $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { 
        $this->targetTable = $targetTable;
        C_dbGate::__construct(); 
		if($resaIds) $this->loadOnGroup($resaIds); // preload if $resaIds are known and passed
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_resapart'; }	
    public function getTableName() { return $this->targetTable.'resaparts'; }
    public function getNew() { return new C_dS_resapart(); }
}
class C_dbAccess_resa_series extends C_dbGate {
    public $targetTable;
    public function __construct($targetTable = '', $serieIds = false) { 
        $this->targetTable = $targetTable;
        C_dbGate::__construct(); 
		if($serieIds) $this->loadOnId($serieIds); // preload if $serieIds are known and passed
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_resa_serie'; }	
    public function getTableName() { return $this->targetTable.'resa_series'; }
    public function getNew() { return new C_dS_resa_serie(); }
}
class C_dbAccess_attendees extends C_dbGate {
    public $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { // targetTable must be 'archive_' if you wish to read from archive tables
        $this->targetTable = $targetTable;
        C_dbGate::__construct(); 
		if($resaIds) $this->loadOnGroup($resaIds); // preload if $resaIds are known and passed
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_attendee'; }	
    public function getTableName() { return $this->targetTable.'attendees'; }
    public function getNew() { return new C_dS_attendee(); }
    public function getClone($original) { return new C_dS_attendee(0,$original->groupId,$original); }
    public function countClass($resourceType) {
        $count = 0;
        foreach($this->keyed as $id => $o_dS_attendee)
            if($o_dS_attendee->resourceType == $resourceType)
                $count++;
        return $count;
    }
	public function cutToView($rscIds_cl, $invert=false, $sep=',') { // resource ids in coma list like "23456,23478,26345"
		if(!$rscIds_cl) return $this;
		if(!$this->count()) return $this;
		$rscids = explode($sep,$rscIds_cl); $rscids_ark = array_fill_keys($rscids, 1);
		$byrscid = Array();
		foreach($this->keyed as $attid => $dS_attendee) $byrscid[$dS_attendee->resourceId] = $attid;
		if($invert) { foreach($byrscid as $rscid => $attid) if(array_key_exists($rscid,$rscids_ark)) unset($this->keyed[$attid]); } // removes items in the view scope
			else { foreach($byrscid as $rscid => $attid) if(!array_key_exists($rscid,$rscids_ark)) unset($this->keyed[$attid]); } // removes items out of view scope
		return $this;
	}
	public static function hasoverload($accountId, $cueIn, $cueOut, $attendees, $single) { // returns false or a list or reservation ids that are in overload with the given attendees and timeframe
		
		// Note on DB design: for this function to perform correctly, indexes must be defined on the reservations table:
		// 1. index on groupId, cueIn
		// 2. index on groupId, cueOut
		
		
		// Step 1: We check if the time frame is already occupied by any other reservation in this account
		//
		$q = new Q('SELECT id FROM reservations WHERE groupId='.$accountId.' AND deletorId=0 AND cueOut>'.$cueIn.' AND cueIn<'.$cueOut.';', 'hasoverload()');
		$tfoids = $q->ids(); // time frame overload ids
		
		
		if(!$tfoids) return false;
		if($tfoids && $single) return $tfoids; // single accounts
		
		
		// Step 2: If time frame is occupied and the account is multi-resource, we further investigate if there is a real resource overbooking.
		//
		if(!count($attendees)) return false; // there should always be attendees, still we cover the case to protect the query hereunder (MTTT Grillo did produce the case of none attendees). 
		$r = implode(',',$attendees);
		
		$q = new Q('SELECT DISTINCT groupId as id FROM attendees WHERE groupId IN ('.$tfoids.') AND resourceId IN ('.$r.');', 'hasoverload()');
		
		$roids = $q->ids(); // resource overload ids
		if(!$roids) return false;
			else return $roids;
	}
}
class C_dbAccess_att_visitors extends C_dbGate {
    public $targetTable;
    public function __construct($targetTable = '', $resaIds = false) { 
        $this->targetTable = $targetTable;
        C_dbGate::__construct(); 
		if($resaIds) $this->loadOnGroup($resaIds); // preload if $resaIds are known and passed
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_att_visitor'; }	
    public function getTableName() { return $this->targetTable.'att_visitors'; }
    public function getNew() { return new C_dS_att_visitor(); }
    public function getClone($original) { return new C_dS_att_visitor(0,$original->groupId,$original); }

    public function getVisitorsIds($excludeId = 0) {
        $visitors = array();
        if($this->count())
            foreach($this->keyed as $id => $dS)
                if($dS->resourceId != $excludeId) 
                    $visitors[] = $dS->resourceId;
        return implode(',',$visitors);
    }
    public function visitors_compare($another_dbAccess_att_visitors, $boolean = true) { // boolean 0 if the list is equal, 1 if the list defers 
        $this_visitors = $this->getResourceIdsList($coma=false); // Array like [ 6541235 => 6541235, 60000541 => 60000541, ... ]
        $other_visitors = $another_dbAccess_att_visitors->getResourceIdsList($coma=false);
		$delta = Array();
		
		foreach($this_visitors as $tvid => $vid)
			if(!array_key_exists($tvid,$other_visitors)) $delta[$tvid] = $tvid;
			
		foreach($other_visitors as $ovid => $vid)
			if(!array_key_exists($ovid,$delta)) // do not account twice the same vid
				if(!array_key_exists($ovid,$this_visitors)) $delta[$ovid] = $ovid;
				
		if($boolean) return !!(sizeof($delta)); // boolean 0 if the list is equal, 1 if the list defers 
		return $delta;
    }
}
class C_dbAccess_prebookings extends C_dbGate {

    public function __construct($delay = false) { 
        C_dbGate::__construct(); 
        if($delay !== false) $this->loadOnDelay($delay);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_prebooking'; }	
    public function getTableName() { return C_dS_prebooking::tableName(); }
    public function getNew() { return new C_dS_prebooking(); }

    // Specific to this Class:
    //

    public function loadOnDelay($delay) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE delay='.$delay.';';
        C_dbGate::loadMany($SQL);
    }
     //22-10-07 : new function
     public function loadByResaIds($resaIds) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE reservationId in ('.$resaIds.');';
        C_dbGate::loadMany($SQL);
    }

    public static function tempo() { 
			$t = C_dS_prebooking::tableName(); 
        new Q('UPDATE '.$t.' SET delay = (delay-1) WHERE delay > 0;');
    }
     //22-10-07 : bsp new version
    /*public function dropExpiredReservations() {
        if($this->count()) {
            foreach($this->keyed as $id => $dS_prebooking) {
					$rid = $dS_prebooking->reservationId;
					$dS_resa = new C_dS_reservation($rid);
					$a = $dS_resa->archived ? 'archive_' : '';
				new Q('delete from '.$a.'attendees where groupId    = '.$rid.';');
				new Q('delete from '.$a.'att_visitors where groupId = '.$rid.';');
				new Q('delete from '.$a.'resaparts where groupId    = '.$rid.';');
				new Q('delete from '.$a.'performances where groupId = '.$rid.';');
				new Q('delete from '.$a.'payments where groupId = '.$rid.';');
				new Q('delete from sms where reservationId = '.$rid.';');
				new Q('delete from emails where reservationId = '.$rid.';');
				
				new Q('delete from '.$a.'reservations where id  = '.$rid.';');
            }
        }
    }*/
    public function dropExpiredReservations() 
    {
         if($this->count()) 
         {
             $oldloggid = C_dbIO::$loggedId;
 
             foreach($this->keyed as $id => $dS_prebooking) {
                 $rid = $dS_prebooking->reservationId;
                 $dS_resa = new C_dS_reservation($rid);
                 $a = $dS_resa->archived ? 'archive_' : '';
 
                 $payments = new C_dbAccess_payments($a, $rid); // pvh 2025-01 : $a was missing!
                 if($payments->count()==0)
                 {
                     new Q('delete from '.$a.'attendees where groupId    = '.$rid.';');
                     new Q('delete from '.$a.'att_visitors where groupId = '.$rid.';');
                     new Q('delete from '.$a.'resaparts where groupId    = '.$rid.';');
                     new Q('delete from '.$a.'performances where groupId = '.$rid.';');
                     new Q('delete from '.$a.'payments where groupId = '.$rid.';');
                     new Q('delete from sms where reservationId = '.$rid.';');
                     new Q('delete from emails where reservationId = '.$rid.';');
                     
                     new Q('delete from '.$a.'reservations where id  = '.$rid.';');
                 }
                 else //in case of prebooking rdv with payment, we want to keep the information
                 {
                     C_dbIO::$loggedId = $dS_resa->creatorId;
                     $dS_resa->dSobsolete();
                 }
             }
             C_dbIO::$loggedId = $oldloggid;
         }
     }
}


/////////////////////////////////////////////////////////////////////////////////
//
//  
class C_dbAccess_smsTemplates extends C_dbGate {

    public function __construct($groupId = false, $triggerId = false, $triggerClass = false) { 
        C_dbGate::__construct(); 
        if($triggerClass === false) {
            if($groupId) return $this->loadOnGroup($groupId);
        } else {
            if($groupId) return $this->loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_smsTemplate'; }	
    public function getTableName() { return 'templates_sms'; }
    public function getNew() { return new C_dS_smsTemplate(); }

    // Specific to this Class:
    //
    public function loadOnTrigger($triggerClass, $triggerId, $deliveryTime) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE 
			triggerClass='.$triggerClass.' AND triggerId = '.$triggerId.' AND deliveryTime = '.$deliveryTime.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' 
			WHERE triggerId='.$triggerId.' AND triggerClass='.$triggerClass.' AND groupId = '.$groupId.';';
        C_dbGate::loadMany($SQL);
    }

    public function loadAllOrdered() {
        $SQL = 'SELECT * FROM '.$this->getTableName().'
		ORDER BY deliveryTime;';
        C_dbGate::loadMany($SQL);
    }

    public static function removeResource($accId, $resourceId) {
        $q = new Q('SELECT id FROM templates_sms WHERE groupId='.$accId.' AND resources LIKE "%'.$resourceId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_smsTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('resources', $resourceId); $c++; 
            }
            $dSets->saveAll($accId, true /* no tracking */);
        }	
        global $nl;
        echo $nl.$c.' references to the resource id '.$resourceId.' have been removed from templates_sms ';
    }
    public static function removeLogin($loginId) {
        $q = new Q('SELECT id FROM templates_sms WHERE logins LIKE "%'.$loginId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_smsTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('logins', $loginId); $c++; 
            }
            $dSets->saveAll(keep_groupId, no_record /* no tracking */);
        }	
		return $c;
    }
}
class C_dbAccess_emailTemplates extends C_dbGate {

    public function __construct($groupId = false, $triggerId = false, $triggerClass = false) { 
        C_dbGate::__construct(); 
        if($triggerClass === false) {
            if($groupId) return $this->loadOnGroup($groupId);
        } else {
            if($groupId) return $this->loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_emailTemplate'; }	
    public function getTableName() { return 'templates_email'; }
    public function getNew() { return new C_dS_emailTemplate(); }

    public function loadOnTrigger($triggerClass, $triggerId, $deliveryTime) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE 
			triggerClass='.$triggerClass.' AND triggerId = '.$triggerId.' AND deliveryTime = '.$deliveryTime.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' 
			WHERE triggerId='.$triggerId.' AND triggerClass='.$triggerClass.' AND groupId = '.$groupId.';';
        C_dbGate::loadMany($SQL);
    }

    public static function removeResource($accId, $resourceId) {
        $q = new Q('SELECT id FROM templates_email WHERE groupId='.$accId.' AND resources LIKE "%'.$resourceId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_emailTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('resources', $resourceId); $c++; 
            }
            $dSets->saveAll($accId, true /* no tracking */);
        }	
        global $nl;
        echo $nl.$c.' references to the resource id '.$resourceId.' have been removed from templates_email ';
    }
    public static function removeLogin($loginId) { 
        $q = new Q('SELECT id FROM templates_email WHERE logins LIKE "%'.$loginId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_emailTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('logins', $loginId); $c++; 
            }
            $dSets->saveAll(keep_groupId, no_record /* no tracking */);
        }	
		return $c;
    }
}
class C_dbAccess_notifTemplates extends C_dbGate {

    public function __construct($groupId = false, $triggerId = false, $triggerClass = false) { 
        C_dbGate::__construct(); 
        if($triggerClass === false) {
            if($groupId) return $this->loadOnGroup($groupId);
        } else {
            if($groupId) return $this->loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_notifTemplate'; }	
    public function getTableName() { return 'templates_notif'; }
    public function getNew() { return new C_dS_notifTemplate(); }

    public function loadOnTrigger($triggerClass, $triggerId, $deliveryTime) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE 
			triggerClass='.$triggerClass.' AND triggerId = '.$triggerId.' AND deliveryTime = '.$deliveryTime.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnGroupAndTriggerClass($groupId, $triggerId, $triggerClass) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' 
			WHERE triggerId='.$triggerId.' AND triggerClass='.$triggerClass.' AND groupId = '.$groupId.';';
        C_dbGate::loadMany($SQL);
    }

    public static function removeResource($accId, $resourceId) {
        $q = new Q('SELECT id FROM templates_notif WHERE groupId='.$accId.' AND resources LIKE "%'.$resourceId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_notifTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('resources', $resourceId); $c++; 
            }
            $dSets->saveAll($accId, true /* no tracking */);
        }	
        global $nl;
        echo $nl.$c.' references to the resource id '.$resourceId.' have been removed from templates_notif ';
    }
    public static function removeLogin($loginId) {
		// 
		// logins are stored like '8954!10112!11549' and represent a filter.
		// 
        $q = new Q('SELECT id FROM templates_notif WHERE logins LIKE "%'.$loginId.'%";'); // while we look up for 1111, this query may select 21111 or 11116
        $ids = $q->ids(); $c=0;
        if($ids) {
            $dSets = new C_dbAccess_notifTemplates(); $dSets->loadOnId($ids);
            foreach($dSets->keyed as $dSid => $o_dS) {
                $o_dS->idDropStringRef('logins', $loginId); $c++; 
            }
            $dSets->saveAll(keep_groupId, no_record /* no tracking */);
        }	
		return $c;
    }
}
class C_dbAccess_cToggles extends C_dbGate {

    public function __construct($resaId = false) { 
        C_dbGate::__construct();
        if($resaId) $this->loadOnResaId($resaId); // used to stream presets to client side
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_cToggle'; }	
    public function getTableName() { return 'comm_toggles'; }
    public function getNew() { return new C_dS_cToggle(); }
    public function getClone($original) { return new C_dS_cToggle(0,$original->groupId,$original); }

    public function saveOnResaId($groupId, $resaId) {
        if($this->count())
            foreach($this->keyed as $id => $dS_toggle) 
                $dS_toggle->reservationId = $resaId; 
        else
            return;
        $this->saveAll($groupId); 
    }	
	public function setbundels($accountId, $resaId, $sms, $mails) { // set or reset toggles linked to a given reservation
		
		// // this bundle is made here (*bu1*)
		//
		// $sms is false or an array like { 0 => '5275-3300467-0', 1 => '5276-3300468-1', ... } like 'templateId-resourceId'
		// $mails is false or an array like { 0 => '6075-3300467-0', 1 => '6076-3300468-0', ... } like 'templateId-resourceId'
		//
		// each bundle templateId-resourceId will be exploded and stored in db
		// note that toggles for notification_manual dS_templates are not kept in DB, after message expedition, they are removed, see (*mn01*)
		
		if($resaId>0) // then communication options may have change completely, we drop them all 
			$this->deleteOnResaId($resaId);
			
		if($sms) foreach($sms as $bundle) {	
				$split = explode('-', $bundle); // this bundle is made here (*bu1*) in .js, it stands like 'templateId-resourceId-onoffvalue'
				$rescId = $split[1]; $tempId = $split[0]; $onoff = $split[2];
			$dS_toggle = $this->newVirtual();
			$dS_toggle->reservationId = $resaId;
			$dS_toggle->resourceId = $rescId;
			$dS_toggle->templateId = $tempId;
			$dS_toggle->onoff = $onoff;
			$dS_toggle->msgMedium = msg_medium_SMS;
		}
		if($mails) foreach($mails as $bundle) {	
				$split = explode('-', $bundle);
				$rescId = $split[1]; $tempId = $split[0]; $onoff = $split[2];
			$dS_toggle = $this->newVirtual();
			$dS_toggle->reservationId = $resaId;
			$dS_toggle->resourceId = $rescId;
			$dS_toggle->templateId = $tempId;
			$dS_toggle->onoff = $onoff;
			$dS_toggle->msgMedium = msg_medium_email;
		}
		$this->saveAll($accountId); // group resa communication with group Id
	
	}
    public static function isdisabled($resaId, $dS_template, $rescId) { // PVH 2022-05 obsolete when onoff was introduced un comm_toggles table
		
		// rescId is a visitorId when the template targets a visitor and is a loginId when the template targets a login
		
        $id = $dS_template->id;
        $m = $dS_template->getMedium();
		
        $q = new Q($sql='SELECT COUNT(1) as c FROM comm_toggles WHERE reservationId='.$resaId.' AND templateId='.$id.' AND msgMedium='.$m.' AND resourceId='.$rescId.';');
        $t = !!$q->c(); // t = toggled by user before saving the appointment
        $d = $dS_template->sendComms; // default setting for this template

        $output = false;
        if($d && $t) 	$output = true; // default on but toggled => is disabled
        if(!$d && !$t) 	$output = true; // default off and not toggled => is disabled

        // echo chr(13); // Uncomment this code for debugging only in local dev environment
        // echo '   #template:'.$dS_template->name.chr(13);
        // echo '   #rescId:'.$rescId.chr(13);
        // echo '   #default activated:'.$d.chr(13);
        // echo '   #toggled:'.$t.chr(13);
        // echo '   #-- outcome:'.$output.chr(13); 

        return $output; // all other cases: enabled
    }
    public static function istoggled($resaId, $dS_template, $rescId) {  // returns [false, 0, 1]
		
		// rescId is a visitorId when the template targets a visitor and is a loginId when the template targets a login
		
			$id = $dS_template->id;
			$md = $dS_template->getMedium();
        $q = new Q($sql='select onoff from comm_toggles where reservationId='.$resaId.' and templateId='.$id.' and msgMedium='.$md.' and resourceId='.$rescId.';');
        $r = $q->one('onoff'); // see (*Q::one*), returns false if no record found, returns the onoff value [0,1] is a record was found
		if($r===false) return false;
		return $r|0; // make it integer 0 or 1
    }
	
}
class C_dbAccess_emails extends C_dbGate {

    public function __construct($resaId = false) { 
        C_dbGate::__construct();
        if($resaId) $this->loadOnResaId($resaId); // used to stream presets to client side
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_email'; }	
    public function getTableName() { return 'emails'; }
    public function getNew() { return new C_dS_email(); }

    // Specific to this Class:
    //
    public function issent($reservationId, $dS_template, $resourceId) { // returns as many records as resources where not planned to get communication for this template

        $SQL = 'select count(1) as c from '.$this->getTableName().' where reservationId='.$reservationId.' and templateId='.$dS_template->id.' and resourceId='.$resourceId.';';
        $q = new Q($SQL);
        return $q->c();
    }
}
class C_dbAccess_notifications extends C_dbGate {

    public function __construct($resaId = false) { 
        C_dbGate::__construct();
        if($resaId) $this->loadOnResaId($resaId); // used to stream presets to client side
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_notification'; }	
    public function getTableName() { return 'notifications'; }
    public function getNew() { return new C_dS_notification(); }

    // Specific to this Class:
    //	
    public function issent($reservationId, $dS_template, $resourceId) { // returns as many records as resources where not planned to get communication for this template

        $SQL = 'select count(1) as c from '.$this->getTableName().' where reservationId='.$reservationId.' and templateId='.$dS_template->id.' and resourceId='.$resourceId.';';
        $q = new Q($SQL);
        return $q->c();
    }
}
class C_dbAccess_sms extends C_dbGate {

    public function __construct($resaId = false) { 
        C_dbGate::__construct();
        if($resaId) $this->loadOnResaId($resaId); // used to stream presets to client side
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_sms'; }	
    public function getTableName() { return 'sms'; }
    public function getNew() { return new C_dS_sms(); }

    // Specific to this Class:
    //

    public function loadOnFailedForR2($cueIn, $cueOut) { // loads SMS that are in failure status on route 2 and not yet re-routed to shortcode route
	
		// Here we want to select only the SMSs that were sent in the cueIn/cueOut timespan
		// and only SMSs for which route 2 (smsgateaway) was primarily used (those have r2status != sms_nosms)
		// and only SMSs for which route 2 (smsgateaway) could not successfully deliver (those have r2status != sms_delivered)
		// and only SMSs for which route 2 (smsgateaway) did not reveal a dead number (those have r2status != sms_dead_numb)
		// and only SMSs for which route 2 (smsgateaway) is pending and will be delivered on R2 (those have r2status != sms_pending)
		// and only SMSs for which route 1 (shortcode) was not used already as a retry (those have status == sms_created)
        $SQL = 'SELECT *
				FROM '.$this->getTableName().'
				WHERE r2status NOT IN ('.sms_nosms.','.sms_dead_numb.','.sms_delivered.','.sms_pending.')
					AND status IN ('.sms_created.')
					AND sendStamp >='.$cueIn.' AND sendStamp <'.$cueOut.';';
        C_dbGate::loadMany($SQL);
    }

    public function loadOnFailedForR3($backHourStamp) { // loads SMS that are in failure status on route 1 and 2, and not yet re-routed to route 3
        // SMS must comply with
        // 1/ be handled at least on route 1 (must have quit the default sms_created value)
        // 2/ be handled at least on route 2 (must have quit the default sms_nosms value)
        // 3/ not been delivered on route 1 (if so, the objective was gained)
        // 3/ not been delivered on route 2 (if so, the objective was gained)
        // 3/ has never been handled on route 3: r3status IS equal to initial default sms_nosms
        // 6/ not been discarded twice on route 1 and 2 (if pending somewhere, we try the third route)
        $onlyOneDayBack = $backHourStamp-86400;
        $SQL = 'SELECT *
				FROM '.$this->getTableName().' 
				WHERE  status<>'.sms_created.' AND status<>'.sms_delivered.'
					AND r2status<>'.sms_nosms.' AND r2status<>'.sms_delivered.' AND NOT (status='.sms_discarded.' AND  r2status='.sms_discarded.')
					AND r3status='.sms_nosms.' AND sendStamp >'.$onlyOneDayBack.';';
        C_dbGate::loadMany($SQL);
    }	

    public function loadOnSendStamp($cueInStamp, $cueOutStamp) {
        $SQL = 'SELECT *
				FROM '.$this->getTableName().' 
				WHERE sendStamp>='.$cueInStamp.' AND sendStamp<'.$cueOutStamp.';';
        C_dbGate::loadMany($SQL);
    }

    public function loadOnCorrelator($correlator) { // route 1 assumed

        $SQL = 'SELECT *
				FROM '.$this->getTableName().' 
				WHERE 
					correlator="'.$correlator.'";';
        C_dbGate::loadMany($SQL);
    }
    public function issent($reservationId, $o_dS_template, $resourceId) { // returns as many records as resources where not planned to get communication for this template

        $SQL = 'SELECT COUNT(1) as c FROM '.$this->getTableName().' WHERE reservationId='.$reservationId.' AND templateId='.$o_dS_template->id.' AND resourceId='.$resourceId.';';
        $q = new Q($SQL);
        return $q->c();
    }
}
class C_dbAccess_delayedNotifs extends C_dbGate { // can be emails, sms, or mobile devices notifications

    public function __construct($delay = false) { 
        C_dbGate::__construct(); 
        if($delay !== false) $this->loadOnDelay($delay);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_delayedNotif'; }	
    public function getTableName() { return C_dS_delayedNotif::tableName(); }
    public function getNew() { return new C_dS_delayedNotif(); }

    // Specific to this Class:
    //

    public function loadOnDelay($delay) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE delay='.$delay.';';
        C_dbGate::loadMany($SQL);
    }
    public static function tempo() { 
        $t = C_dS_delayedNotif::tableName(); 
        new Q('UPDATE '.$t.' SET delay = (delay-1) WHERE delay > 0;');
    }
    public function sendNotifications() { // used by /crons/minite.php
        $dS_system = new C_dS_system();
        if($this->count()) {
            foreach($this->keyed as $id => $dS_delayedNotif) {
                $dS = $dS_delayedNotif->magnify();
                $dS->sendNotification($dS_system->sendComm);
            }
        }
    }
}


////////////////////////  Exceptions and performance
//
//  
class C_dbAccess_exceptions extends C_dbGate {

    public function __construct($accountId = false) { 
		
		C_dbGate::__construct(); 
		if($accountId) {
            $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId = "'.$accountId.'";';
            C_dbGate::loadMany($SQL);
        }
	}
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function getTableName() { return 'exceptions'; }
    public function getNew() { return new C_dS_exception(); }

    public function loadOnClass($className) {

        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE class="'.$className.'";';
        C_dbGate::loadMany($SQL);
    }

}
class C_dbAccess_exceptions_smartapp extends C_dbGate {

    public function __construct($date = false) { 
		
		C_dbGate::__construct(); 
		if($date) $this->loadOnDate($date);
	}
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function getTableName() { return 'exceptions_smartapp'; }
    public function getNew() { return new C_dS_exception_smartapp(); }

    public function loadOnDate($date) { // date like 2020-10-01 
		$t = $this->getTableName();
        $SQL = 'select * from '.$t.' where created like "'.$date.'%" order by created desc;';
        C_dbGate::loadMany($SQL);
    }
	public static function loaddates() {
		$q = new Q('select distinct left(created,10) as cdate from exceptions_smartapp order by cdate desc limit 7;');
		$ld = $q->mlist('cdate',list_as_array);
		return $ld;
	}
}

class C_perfReport { // this is the tool we use to micro-measure execution time throughout the script
    public $counter = 0;
    public $initTime;
    public $microtimes = array();
    public $labels = array();
    public function __construct() {
        $this->initTime = $this->peak('init');
    }
    public function peak($label) {
        $peak = microtime($get_as_float = true); // returns UNIX epoch time like 999888777666,001020 where 1 is a second, 001 is ms and 020 are microseconds
        $this->microtimes[] = $peak;
        $this->labels[] = $label;
        $this->counter++;
        return $peak;
    }
    private function convertToMs($microtime) { // converts microtime (seconds with decimals) into milliseconds
		return (($microtime*1000000)|0)/1000; // like 81,02 ms 
    }
    public function dropReport() {
        global $nl;
        $microtimePrev = $this->initTime;
        
		echo $nl.$nl.'Perf Report:';
        foreach($this->labels as $id => $label) {
            $microtime = $this->microtimes[$id];
			$baseref = $microtime - $this->initTime;
			$floatdetla = $microtime-$microtimePrev; // like 1,001020 where 1 is a second, 001 is ms and 020 are microseconds
            $delta = $this->convertToMs($floatdetla); // like 1001,02 ms
            $frominit = $this->convertToMs($baseref); // like 1001,02 ms
            echo $nl.'     '.$frominit.' ms - ( + '.$delta.' ms)'.' <-> '.$label;
            $microtimePrev = $microtime;
        }
        echo $nl.$nl.'   >> Total round trip:  (+'.($this->convertToMs($microtimePrev-$this->initTime)).' ms)'.$nl;
		
		return $this;
    }
    public function getlaptime() {
        return $this->convertToMs($this->microtimes[$this->counter-1]-$this->initTime);
    }
}


////////////////////////
//
//  
class C_dbAccess_customCss extends C_dbGate {

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_customCss'; }	
    public function getTableName() { return 'custom_css'; }
    public function getNew() { return new C_dS_customCss(); }

    // Specific to this Class:
    //
	public function synchro_magnify($skeyId) {
		$rccss = new C_dbAccess_synchro_ccss($skeyId);
		foreach($this->keyed as $cid => $dS_ccss) $dS_ccss->remoteId = ''; // empty string is default when not synced
		if($rccss->count()) foreach($rccss->keyed as $dS_sync_ccss) $this->keyed[$dS_sync_ccss->localId]->remoteId = $dS_sync_ccss->remoteId;
	}
	public function fromfilter($cssclass, $csstype) { // return a C_dbAccess_customCss
		
		$f = new C_dbAccess_customCss();
		foreach($this->keyed as $ccssid => $dS_css)
			if($dS_css->resaClass == $cssclass)
				if($dS_css->cssType == $csstype)
					$f->add($this->keyed[$ccssid]);
				
		return $f;
	}
}


////////////////////////
//
///////// Synchro 

class C_dbAccess_synchro_resources extends C_dbGate {

	public $byRemoteId;
	public $byLocalId;

    public function __construct($skeyId = false) { 
        C_dbGate::__construct(); 
        if($skeyId) {
            $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE skeyId = "'.$skeyId.'";';
            C_dbGate::loadMany($SQL);
        }
		$this->byRemoteId = Array();
		$this->byLocalId = Array();
		if($this->count()) {
			foreach($this->keyed as $dS) {
				if($dS->remoteId) $this->byRemoteId[$dS->remoteId] = $dS->localId; // they can be empty, their definition is optional in the login window
				$this->byLocalId[$dS->localId] = $dS->remoteId;
			}
		}
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_synchro_resource'; }	
    public function getTableName() { return 'synchro_resources'; }
    public function getNew() { return new C_dS_synchro_resource(); }

    // Specific to this Class:
    //
    public function deleteOnKey($keyId) {
        new Q('delete from synchro_resources where skeyId = "'.$keyId.'";');
    }
    public function deleteOnLocalId($resourceId) {
        new Q('delete from synchro_resources where localId = "'.$resourceId.'";');
    }
	public function getLocalId($remoteId) {
		if(array_key_exists($remoteId, $this->byRemoteId)) 
			return $this->byRemoteId[$remoteId]; // which is a local resource id
		return false;
	}
	public function hasanyCorrelator() { // returns true if at least one correlator is defined
		return !!count($this->byRemoteId);
	}
	public function getRemoteId($localId) {
		if(array_key_exists($localId, $this->byLocalId)) 
			return $this->byLocalId[$localId]; // which is a remote resource id (correlator set in sync login gui)
		return false;
	}
	public function getRemoteIds() {
		return implode('!',$this->byLocalId);
	}
	public function getLocalIds() {
		return implode('!',$this->byRemoteId);
	}
	public function turnIntoLocalIds($remoteIds, $sep = ',') { // remoteIds like 'Cab1!Cab2!Me!You'
		$remotes = explode('!',$remoteIds);
		$locals = Array();
		foreach($remotes as $remoteId)
			if(array_key_exists($remoteId, $this->byRemoteId))
				$locals[] = $this->byRemoteId[$remoteId];
		return implode($sep,$locals);
	}
	public function magnify($dbAccess_attendees) {
		
		foreach($dbAccess_attendees->keyed as $aid => $dS_attendee)
			if(isset($this->byLocalId[$dS_attendee->resourceId]))
				$dS_attendee->remoteRscid = $this->byLocalId[$dS_attendee->resourceId];
			else
				$dS_attendee->remoteRscid = '';
	}
	public function magnifyAggregatedRemoteIds($dbAccess_reservations) {
		
		foreach($dbAccess_reservations->keyed as $rid => $dS_reservation) {
			
			if(!isset($dS_reservation->resourceIds)) continue; // if you call this function, make sure you called this one right before: $dbAccess_reservations->magnify4AI($dbAccess_attendees[0],$dbAccess_att_visitors[0],$dbAccess_performances[0]);
			
				$split = explode(',',$dS_reservation->resourceIds);
			foreach($split as $x => $rscId) $split[$x] = $this->byLocalId[$rscId];

			$dS_reservation->resourceIds = implode(',',$split); // and that's it !
		}
	}
}
class C_dbAccess_synchro_visitors extends C_dbGate {

    public function __construct($skeyId = false) { 
        C_dbGate::__construct(); 
        if($skeyId) {
            $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE skeyId = "'.$skeyId.'";';
            C_dbGate::loadMany($SQL);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_synchro_visitor'; }	
    public function getTableName() { return 'synchro_visitors'; }
    public function getNew() { return new C_dS_synchro_visitor(); }

    // Specific to this Class:
    //
    public function loadOnAccount($skeyId) {
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE skeyId = "'.$skeyId.'";';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnLocalId($localIds, $skeyIds = false) {
        if(!$localIds) return;
        if($skeyIds) $skeyIds = ' AND skeyId IN ('.$skeyIds.')';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE localId IN ('.$localIds.')'.$skeyIds.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnRemoteId($remoteIds, $skeyId) {
        if(!$remoteIds) return;
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE remoteId IN ('.$remoteIds.') AND skeyId = "'.$skeyId.'";';
        C_dbGate::loadMany($SQL);
    }
    public function deleteOnKey($keyId) {
        new Q('delete from synchro_visitors where skeyId = "'.$keyId.'";');
    }
    public function deleteOnLocalId($resourceId) {
        new Q('delete from synchro_visitors where localId = "'.$resourceId.'";');
    }
}
class C_dbAccess_synchro_reservations extends C_dbGate {

    public function __construct($groupId = false) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnGroup($groupId);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_synchro_reservation'; }	
    public function getTableName() { return 'synchro_reservations'; }
    public function getNew() { return new C_dS_synchro_reservation(); }

    // Specific to this Class:
    //
    public function loadOnLocalId($localIds, $skeyIds = false) {
        if(!$localIds) return;
        if($skeyIds) $skeyIds = ' AND skeyId IN ('.$skeyIds.')';
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE localId IN ('.$localIds.')'.$skeyIds.';';
        C_dbGate::loadMany($SQL);
    }
    public function loadOnRemoteId($remoteIds, $skeyId) {
        if(!$remoteIds) return;
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE remoteId IN ('.$remoteIds.') AND skeyId = "'.$skeyId.'";';
        C_dbGate::loadMany($SQL);
    }
    public function deleteOnKey($keyId) {
        new Q('delete from synchro_reservations where skeyId = "'.$keyId.'";');
    }
    public function deleteOnLocalId($resourceId) {
        new Q('delete from synchro_reservations where localId = "'.$resourceId.'";');
    }
}
class C_dbAccess_synchro_ccss extends C_dbGate {

    public function __construct($skeyId = false) { 
        C_dbGate::__construct(); 
        if($skeyId) {
            $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE skeyId = "'.$skeyId.'";';
            C_dbGate::loadMany($SQL);
        }
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_synchro_ccss'; }	
    public function getTableName() { return 'synchro_ccss'; }
    public function getNew() { return new C_dS_synchro_ccss(); }

    // Specific to this Class:
    //
    public function deleteOnKey($keyId) {
        new Q('delete from synchro_ccss where skeyId = "'.$keyId.'";');
    }
    public function deleteOnLocalId($resourceId) {
        new Q('delete from synchro_ccss where localId = "'.$resourceId.'";');
    }
}	

////////////////////////
//
///////// Statistics  

class C_dbAccess_xmon_actions extends C_dbGate {

    public function __construct($groupId = false, $sunday = false, $weeks = false) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_action'; }	
    public function getTableName() { return 'xmon_actions'; }
    public function getNew() { return new C_dS_xmon_action(); }

    public static function removeLogin($loginId) {

        $o_dbAccess_xmon_actions = new C_dbAccess_xmon_actions();
        $o_dbAccess_xmon_actions->loadOnLoginId($loginId);
        echo chr(10).'deleting actions monitoring: '.$o_dbAccess_xmon_actions->stream();
        $o_dbAccess_xmon_actions->deleteAll();
    }
}
class C_dbAccess_xmon_actuals extends C_dbGate {

    public function __construct($groupId = false, $sunday = false, $weeks = false) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_actual'; }	
    public function getTableName() { return 'xmon_actuals'; }
    public function getNew() { return new C_dS_xmon_actual(); }

    public static function removeResource($resourceId) {

        $o_dbAccess_xmon_actuals = new C_dbAccess_xmon_actuals();
        $o_dbAccess_xmon_actuals->loadOnResource($resourceId);
        // echo chr(10).'deleting actuals monitoring: '.$o_dbAccess_xmon_actuals->stream();
        $o_dbAccess_xmon_actuals->deleteAll();
    }
}
class C_dbAccess_xmon_accounts extends C_dbGate {

    public function __construct($groupId, $sunday, $weeks) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_account'; }	
    public function getTableName() { return 'xmon_accounts'; }
    public function getNew() { return new C_dS_xmon_account(); }
}
class C_dbAccess_xmon_sms extends C_dbGate {

    public function __construct($groupId, $sunday, $weeks) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_sms'; }	
    public function getTableName() { return 'xmon_sms'; }
    public function getNew() { return new C_dS_xmon_sms(); }
}
class C_dbAccess_xmon_ccss extends C_dbGate {

    public function __construct($groupId, $sunday, $weeks) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_ccss'; }	
    public function getTableName() { return 'xmon_ccss'; }
    public function getNew() { return new C_dS_xmon_ccss(); }
}
class C_dbAccess_xmon_performances extends C_dbGate {

    public function __construct($groupId, $sunday, $weeks) { 
        C_dbGate::__construct(); 
        if($groupId) $this->loadOnSunday($groupId, $sunday, $weeks);
    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_xmon_perfs'; }	
    public function getTableName() { return 'xmon_performances'; }
    public function getNew() { return new C_dS_xmon_perfs(); }
}




//////////    P H O N E   /   M O B I L E    N U M B E R S    P R O C E S S I N G     //////////////////
//
//

function prefixis($prefix, $digits) {
    $l = strlen($prefix);
    return !strcmp($prefix, substr($digits, 0, $l));
}
function NSNdigits($digits) { // those countries have 13 digits calling numbers because their international calling code has 3 digitis

    // National Significant Numbers, check also (*nsn*), a identical function runs at client side, keep it coherent !!
	// The full specs of worldwide mobile numbering plan is here
	//		https://en.wikipedia.org/wiki/List_of_mobile_telephone_prefixes_by_country
	// 

    if(prefixis('+1', $digits)) return 10; // North america. E.g. Canada Quebec: +1 418 2652311

    if(prefixis('+216', $digits)) return 8; // Tunisia: +216 yy 123456
    if(prefixis('+230', $digits)) return 8; // Mauritius island: +23 [0 yyy xxxx] 

    if(prefixis('+352', $digits)) return array(6,7,8,9,10); // Luxembourg: open plan (numbers may have whatever number of digits)

    if(prefixis('+370',$digits)) return 8; // Lithuania: +370 686 12345
    if(prefixis('+371',$digits)) return 8; // Latvia:  +371 640 12345
    if(prefixis('+372',$digits)) return 8; // Estonia: +372 81xx xxxx
    if(prefixis('+373',$digits)) return 8; // Moldova: +371 640 12345

	if(prefixis('+385',$digits)) return array(8, 9); // Croatia: +385 98 123456

    if(prefixis('+30', $digits)) return 10; // Greece, mobiles like +30 6xx 1234567
    // Italy (the big mess :)
    if(prefixis('+39335', $digits)) return array(9, 10); // TIM mobile Italy, mobiles like +39 3xx 123456
    if(prefixis('+39', $digits)) return 10; // Italy, mobiles like +39 3xx xx xx xxx

    if(prefixis('+43660', $digits)) return 10; // +43 is for Austria, they have 10 NSNs in Cell phones like +43 660 1234567
    if(prefixis('+43', $digits)) return array(10,11); // +43 is for Austria, they have 10 or 11 NSNs in Cell phones like +43 699 11223344
    if(prefixis('+44', $digits)) return 10; // +44 is the UK, they have 10 NSN
    if(prefixis('+45', $digits)) return 8; // +45 is denmark mobile phones are like +45 20 123456

    // Godsake Germany :)
    if(prefixis('+4915', $digits)) return 11; // +49 is Germany, they have 11 NSN in the 015 mobile prefixes
    if(prefixis('+49176', $digits)) return 11; // +49 is Germany, they have 11 NSN in the 0176 mobile prefixes
    if(prefixis('+491609', $digits)) return 11; // +49 is Germany, they have 11 NSN in the 01609 mobile prefixes
    if(prefixis('+49', $digits)) return 10; // +49 is Germany, they have 10 NSN in regular 017 and 016 numbers


    if(prefixis('+601', $digits)) { // Malaysia mobile network
        if(prefixis('+6010', $digits)) return 8; // DiGi, XOX, Tune Talk
        if(prefixis('+6011', $digits)) return 8; // 
        if(prefixis('+6012', $digits)) return 8; // Maxis
        if(prefixis('+6013', $digits)) return 8; // Celcom +601 3 2752685
        if(prefixis('+6014', $digits)) return 8; // 
        if(prefixis('+6015', $digits)) return 8; // Celcom / DiGi
        if(prefixis('+6016', $digits)) return 8; // DiGi
        if(prefixis('+6017', $digits)) return 8; // Maxis
        if(prefixis('+6018', $digits)) return 8; // U Mobile
        if(prefixis('+6019', $digits)) return 8; // Celcom
    }
    if(prefixis('+687', $digits)) return 6; // New Caledonia numbers like +687 123 456

    if(prefixis('+90', $digits)) return 10; // Turkey, mobiles like +90 533 1234567 (533 is the operator code, but portability is present)
    if(prefixis('+9617', $digits)) return 8; // Lebanon, mobiles like +961 70 123456
    if(prefixis('+9613', $digits)) return 7; // Lebanon, mobiles like +961 36 12345


    // They fit in standard 2 + 9, or 3 + 9
    //
    // Greece +30 112 34 1234
    // Netherland +31 06 123 1234
    // spain +34 71 123 1234
    //

    return 9;
    // => So a standard number has 12 or 13 digits in total (including heading +). 13 when CC is 3 digits, 12 if CC is 2 digits.

}
function CCdigits($digits) { // those countries have 13 digits calling numbers because their international calling code has 3 digitis

    // Mobile numbers are made of: 
    // 		Country code: 2 or 3 digits (3 digits for smaller countries) (CC)
    //  	+ National Significant number: 8 or 9 or 10 digits (NSN)
    // Generally, NSN is 9 digits.

    // Zone 1 � USA
    if(prefixis('+1', $digits)) return 1; // considers the default 9 NSN digits, that makes a 3 + 9 = 12 digits numbers

    // Zone 3&4 � Europe
    if(prefixis('+35', $digits)) return 3; // Gibraltar, Portugal, Luxembourg, Ireland, Iceland, Albania, Finland, Malta, Cyprus,  Iceland, Bulgaria
    if(prefixis('+37', $digits)) return 3; // Lithuania, Latvia, Estonia, Moldova, Armenia, Belarus, Andorra, Monaco, San Marino, Vatican
    if(prefixis('+38', $digits)) return 3; // Balkans: Croatia, Macedonia, Montenegro, Serbia, Slovenia, Ukraine,
    if(prefixis('+42', $digits)) return 3; // Czech republic, Slovakia, Liechtenstein 

    // Zone 2 � Africa
    if(prefixis('+21', $digits)) return 3; // 
    if(prefixis('+22', $digits)) return 3; // 
    if(prefixis('+23', $digits)) return 3; // Mauritius Island 230, 
    if(prefixis('+24', $digits)) return 3; // 
    if(prefixis('+25', $digits)) return 3; // 
    if(prefixis('+26', $digits)) return 3; // 
    if(prefixis('+29', $digits)) return 3; // 

    // Zone 5 � Latin America (mostly) // +51 to +58 have 2 digits
    if(prefixis('+50', $digits)) return 3; // 
    if(prefixis('+59', $digits)) return 3; // 

    // Zone 6 � Asia // +60 to +66 have 12 digits
    if(prefixis('+60', $digits)) return 3; // +601 for Malaysia mobile network
    if(prefixis('+687', $digits)) return 3; //+687 New Caledonia

    if(prefixis('+67', $digits)) return 3; // 
    // if(prefixis('+68', $digits)) return 3; // +687 New Caledonia
    if(prefixis('+69', $digits)) return 3; // 

    // Zone 8 � Eurasia (former Soviet Union) // +800 is international freephone, 81 to 84 have 2 digits
    if(prefixis('+85', $digits)) return 3; // 
    if(prefixis('+86', $digits)) return 3; // 
    if(prefixis('+87', $digits)) return 3; // 
    if(prefixis('+88', $digits)) return 3; // 

    // Zone 9 � Central, South and Western Asia // 90 to 95, and 98 have 2 digits
    if(prefixis('+96', $digits)) return 3; // 961:Lebanon
    if(prefixis('+97', $digits)) return 3; // 
    if(prefixis('+99', $digits)) return 3; // 

    return 2; // 2 CC digits is for all other bigger countries
}
function coutryFromCCdigits($digits) { // returns the country that mathces the telefony countrycode (CC). Eg: belgium for 32, france for 33

	if($digits[0]!=='+') $digits = '+'.$digits;

    // Zone 1 � USA
    if(prefixis('+1', $digits)) return 1; // considers the default 9 NSN digits, that makes a 3 + 9 = 12 digits numbers

    // Zone 3&4 � Europe
    if(prefixis('+351', $digits)) return 'Portugal';
    if(prefixis('+352', $digits)) return 'Luxembourg';
    if(prefixis('+35', $digits)) return 'Gibraltar, Ireland, Iceland, Albania, Finland, Malta, Cyprus,  Iceland, Bulgaria';
    if(prefixis('+37', $digits)) return 'Lithuania, Latvia, Estonia, Moldova, Armenia, Belarus, Andorra, Monaco, San Marino, Vatican';
    if(prefixis('+38', $digits)) return 'Balkans: Croatia, Macedonia, Montenegro, Serbia, Slovenia, Ukraine';
    if(prefixis('+42', $digits)) return 'Czech republic, Slovakia, Liechtenstein';

    // Zone 2 � Africa
    if(prefixis('+21', $digits)) return '';
    if(prefixis('+22', $digits)) return '';
    if(prefixis('+230', $digits)) return 'Mauritius Island';
    if(prefixis('+24', $digits)) return '';
    if(prefixis('+25', $digits)) return '';
    if(prefixis('+26', $digits)) return '';
    if(prefixis('+29', $digits)) return '';

    // Zone 5 � Latin America (mostly) // +51 to +58 have 2 digits
    if(prefixis('+50', $digits)) return '';
    if(prefixis('+59', $digits)) return '';

    // Zone 6 � Asia // +60 to +66 have 12 digits
    if(prefixis('+60', $digits)) return '+601 for Malaysia mobile network';
    if(prefixis('+687', $digits)) return 3; //+687 New Caledonia

    if(prefixis('+67', $digits)) return '';
    if(prefixis('+687', $digits)) return 'New Caledonia';
    if(prefixis('+69', $digits)) return '';

    // Zone 8 � Eurasia (former Soviet Union) // +800 is international freephone, 81 to 84 have 2 digits
    if(prefixis('+85', $digits)) return '';
    if(prefixis('+86', $digits)) return '';
    if(prefixis('+87', $digits)) return '';
    if(prefixis('+88', $digits)) return '';

    // Zone 9 � Central, South and Western Asia // 90 to 95, and 98 have 2 digits
    if(prefixis('+96', $digits)) return '961:Lebanon';
    if(prefixis('+97', $digits)) return '';
    if(prefixis('+99', $digits)) return '';

    return 2; // 2 CC digits is for all other bigger countries
}
function retrieveMobileFromDirty($digits, $defaultPhoneRegion) { // used by sync vpostprocess() and by visiload() utility
	
	$l = strlen($digits); // when arriving here, only 0-9 and + are entering, see lib.php::filter_mobile
	if(substr($digits,0,1)=='+') { $digits = substr($digits,1,$l-1); $l--; }
	// no heading + sign remains below this line
	
	if(substr($digits,0,1)!='0') {
		// if($l<9) if($defaultPhoneRegion=='687') $digits = $defaultPhoneRegion.$digits; // +687 New Caledonia
		if($l==9) if(substr($digits,0,1)=='4') $digits = $defaultPhoneRegion.$digits; // for numbers arriving like 497401626 adding e.g. '32'.$digits
		if($l==9) if(substr($digits,0,1)=='6') $digits = $defaultPhoneRegion.$digits; // for numbers arriving like 670082974 (France) adding e.g. '33'.$digits
		if($l==9) if(substr($digits,0,1)=='7') $digits = $defaultPhoneRegion.$digits; // for numbers arriving like 777464840 (France) adding e.g. '33'.$digits
		if($l==10) { } // checkMobileFormat() will sort it based on international prifix, might be a 352 123 4567 (Luxembourg)
		if($l==11) { } // is the exact format length 32 123 456789 = 11 digits
		if($l>11) { 
			if(substr($digits,0,3)=='324') { // for numbers arriving as a concatenation of mobile and fixline, like 32497665588071456235
				$digits = substr($digits,0,11); 
				$digits = substr($digits,-9); 
				$digits = $defaultPhoneRegion.$digits; // for numbers arriving like 497401626 adding e.g. '32'.$digits
			}
		}
	}
	else { // numbers arriving with a trunk '0493123456' (10 digits) or double 00 international '0032499123456'
		
		if(substr($digits,0,2)=='00') { // for numbers arriving like 0032497665588, trunk 00 is always followed by a country code
			$digits = substr($digits,-($l-2)); // removes the '00'
		} else {
			if($l==10) $digits = $defaultPhoneRegion.substr($digits,-9); // removes the '0', trunk 0 refers to local default phone region
			if($l>10) { // for numbers arriving as a concatenation of mobile and fixline, like 0497665588071456235
				$digits = substr($digits,0,10); 
				$digits = substr($digits,-9); 
				$digits = $defaultPhoneRegion.$digits; // for numbers arriving like 497401626 adding e.g. '32'.$digits
			}
		}
	} 
	return '+'.$digits;
}
function checkMobileFormat($mobile, $phoneRegion) { // $string is supposed to contain a mobile phone number like "+32493655599" or trunked "0493655599"

    // $phoneRegion is a integer number WITHOUT the HEADING "+" e.g. 32, or 33 (France)
    $header = substr($mobile,0,1);
    $localCC = '+'.$phoneRegion;
    switch($header) {
        case '+': $trunk=1; $cc=CCdigits($mobile); $nsn=NSNdigits($mobile); $output = substr($mobile,1); break; 
        case '0': $trunk=1; $cc=0; $nsn=NSNdigits($localCC.substr($mobile, 1)); $output = $phoneRegion.substr($mobile,1); break; 
        default:  $trunk=0; $cc=0; $nsn=NSNdigits($localCC.$mobile); $output = $phoneRegion.$mobile; break; 
        // default:  $trunk=0; $cc=3; $nsn=NSNdigits($localCC.$mobile); $output = $mobile; break; // for new Caledonia DOES NOT WORK !
    }
	
	// echo 'mobile:'.$mobile.' - $trunk='.$trunk.' - $cc='.$cc.' - nsn'.$nsn.' - output'.$output.' - <br/>';
	
    if($nsn==0) return $output; // open numbering plan... any number of digits is allowed

    $match = false; if(!is_array($nsn)) $nsn = array($nsn); // not an array? make it an array. 
    $l = strlen($mobile);
    foreach($nsn as $n) {
        $expected = $trunk + $cc + $n;
        if($l == $expected) $match = true;
        // echo chr(13).'Screening mobile '.$mobile.', region:'.$localCC.' <-versus-> trunk-'.$trunk.' cc:'.$cc.' nsn:'.$n.' match:'.$match.chr(13);
    }
    if($match) return $output;
    else return '';
}

function checkPhoneFormat($phone, $phoneRegion) { // $string is supposed to contain a fix line phone number

    // $phoneRegion is an integer number WITHOUT the HEADING "+" e.g. 32, or 33 (France)

    // this function returns '' if the passed $mobile string is not compliant with any phone number format
    $length = strlen($phone);

    if (substr($phone,0,1)=='0') {		// REGIONAL FORMAT headed with '0' e.g. '02.662.1800'
        if($length != 9) return ''; // length is wrong
        $phone = substr($phone,1); 	// keep the right part but one character (removes the '0')
        $phone = $phoneRegion.$phone;			// add the international code
        // this number is ready to enter the DB
    }
    else if (substr($phone,0,1)=='+') {	// INTERNATIONAL FORMAT headed with '+' e.g. '+32.2.662.1800', normal length is 1+10
        $phone = substr($phone,1); 	// keep the right part but one character ( => removes the '+')
        if($length == 11) { // number with a 3 digits international prefix code e.g. 352.2.662.1800 (Luxembourg)
            if(substr($phone,0,3)=='352') return $phone; // Luxembourg
            if(substr($phone,0,3)=='441') return $phone; // 
            if(substr($phone,0,3)=='442') return $phone; // 
            if(substr($phone,0,3)=='447') return $phone; // 
            if(substr($phone,0,3)=='492') return $phone; // 
            return ''; // unknown prefix
        } 
        else // you must be a regular 11 digits like 32.2.662.1800
            if($length != 10) return ''; // length is not CEE format compliant
    }		
    else if (substr($phone,0,1)!='0') {	// REGIONAL FORMAT without heading '0' e.g. '84.123.456' (Namur, Belgium)
        if($length != 8) return ''; // length is wrong
        $phone = $phoneRegion.$phone;			// add the international code
        // this number is ready to enter the DB
    }
    return $phone;
}
function mobileAIformat($rawmobile, $phoneregion) { // raw mobile as stored in DB like 32493655599, returned like 0493 65 55 99.
	$ml = strlen($rawmobile);
	$ergoformat = '';
	$prl = strlen($phoneregion);
	$rawmobile = trim($rawmobile);
	if($ml>9) {
		// head : for local numbers, remove the CC code with a trunk, for outside the local phone region, highlight the CC
		if(substr($rawmobile,0,$prl)==$phoneregion) { // the mobile starts with a CC ( country code ), let's replace it with a trunk zero that people use to see.
			$rawmobile = '0'.substr($rawmobile,-((strlen($rawmobile)-$prl))); // remove the starting 2 or 3 CC code digits and replace them with a zero
		} else { // that mobile is outside the account's local phone region, we keep and highlight the CC
			$plus = '+'.$rawmobile;
			$ccd = CCdigits($plus); // defined in dbio.php, it returns how many digits are un in the CC. eg +352 has 3 CC digits, +32 has 2.
			$rawmobile = '+'.substr_replace($rawmobile, ' ', $ccd, 0);
		}
		$headsize = strlen($rawmobile)-6;
		$head = substr($rawmobile,0,$headsize);

		// tail
		$tail = substr($rawmobile,-6);

		$chunks = str_split($tail, 2); // from 655599 makes an Array('65','55','99')
		$tail = implode(' ', $chunks); // from Array('65','55','99') makes "65 55 99"
		$ergoformat = $head.' '.$tail; // from 32493655599 makes 0493 65 55 99.
	}
	else $ergoformat = $rawmobile;
	return $ergoformat;
}

define ('serverIdentification', 32);	// 32 for belgian admins


date_default_timezone_set('Europe/Brussels'); // this is the default (**GMT)



//////////    D A T E S      ////////////////////////////////
//
//

class C_date {

    // This object must comply with 4 different usages during a session:
    //
    // Usage 1: It keeps the reference date; Which is the login date in production and a test date in development test.
    // Usage 2: It contains the agenda page display date that appears on the session main page.
    // Usage 3: It is used by the Slot Search algorythm and contains the scanned date. 
    // Usage 4: As a part of the serch preference Dashboard, it contains the start date for a slotSearch. 

    public $t;	// timestamp, contains date and time of the day information.
    private static $instances = 0;
    private static $timezone = 0;

    public static function getNow() { // the current time in Universal UNIX integer format
        return time(); 
    }

    private static $secondsPerSlice 	= 3600; 	// time granularity for this environment, a number of seconds per time slice
    private static $runTimeStamp 		= 0;	

    public static function getTimeZone($gmt) { // this function should be replaced in favour of a comprehensive js control that makes able to choose continent/town
        $timezone = 'Europe/Brussels';
        switch($gmt) {
            case -43200: $timezone = 'Pacific/Midway'; break; // (GMT -12:00) Eniwetok, Kwajalein',
            case -39600: $timezone = 'Pacific/Honolulu'; break; // (GMT -11:00) Midway Island, Samoa',
            case -36000: $timezone = 'America/Adak'; break; // (GMT -10:00) Hawaii',
            case -32400: $timezone = 'America/Yakutat'; break; // (GMT -9:00) Alaska',
            case -28800: $timezone = 'America/Los_Angeles'; break; // (GMT -8:00) Pacific Time (US&Canada)',
            case -25200: $timezone = 'America/Denver'; break; // (GMT -7:00) Mountain Time (US&Canada)',
            case -21600: $timezone = 'America/Mexico_City'; break; // (GMT -6:00) Central Time (US&Canada), Mexico City',
            case -18000: $timezone = 'America/Havana'; break; // (GMT -5:00) Eastern Time (US&Canada), Bogota, Lima',
            case -14400: $timezone = 'America/La_Paz'; break; // (GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
            case -12600: $timezone = 'America/St_Johns'; break; // (GMT -3:30) Newfoundland',
            case -10800: $timezone = 'America/Cayenne'; break; // (GMT -3:00) Brazil, Buenos Aires, Georgetown',
            case -7200: 	$timezone = 'Africa/Dakar'; break; // (GMT -2:00) Mid-Atlantic',
            case -3600: 	$timezone = 'Africa/Dakar'; break; // (GMT -1:00 hour) Azores, Cape Verde Islands',
            case 0: 		$timezone = 'Europe/London'; break; // (GMT +0:00) Western Europe Time, London, Lisbon, Casablanca',
            case 3600: 		$timezone = 'Europe/Brussels'; break; // (GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris',
            case 7200: 		$timezone = 'Europe/Helsinki'; break; // (GMT +2:00) Kaliningrad, South Africa',
            case 10800: 	$timezone = 'Europe/Moscow'; break; // (GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
            case 12600: $timezone = 'Asia/Tehran'; break; // (GMT +3:30) Tehran',
            case 14400: $timezone = 'Asia/Baku'; break; // (GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi', (Valid for R�union, no DST in Reunion nor Abu Dhabi)
            case 16200: $timezone = 'Asia/Colombo'; break; // (GMT +4:30) Kabul',
            case 18000: $timezone = 'Asia/Baku'; break; // (GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
            case 19800: $timezone = 'Asia/Rangoon'; break; // (GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
            case 20700: $timezone = 'Asia/Kathmandu'; break; // (GMT +5:45) Kathmandu',
            case 21600: $timezone = 'Asia/Thimphu'; break; // (GMT +6:00) Almaty, Dhaka, Colombo',
            case 25200: $timezone = 'Asia/Bangkok'; break; // (GMT +7:00) Bangkok, Hanoi, Jakarta',
            case 28800: $timezone = 'Asia/Kuala_Lumpur'; break; // (GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
            case 32400: $timezone = 'Asia/Seoul'; break; // (GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
            case 34200: $timezone = 'Asia/Seoul'; break; // (GMT +9:30) Adelaide, Darwin',
            case 36000: $timezone = 'Asia/Vladivostok'; break; // (GMT +10:00) Eastern Australia, Guam, Vladivostok',
            case 39600: $timezone = 'Pacific/Noumea'; break; // (GMT +11:00) Magadan, Solomon Islands, New Caledonia',
            case 41400: $timezone = 'Pacific/Auckland'; break; // (GMT +11:30) Auckland, Fiji'
            case 43200: $timezone = 'Asia/Kamchatka'; break; // (GMT +12:00) Kamchatka'
        }
        return $timezone;
    }
    public static function setTimeParameters($dS_group_or_login = false) { // sets the right time zone as per dS_group location and the right time slice

        // timezone
        //
        if(!$dS_group_or_login) $timezone = 'Europe/Brussels'; // ini_get('date.timezone'); // in this case, the php.ini setting is restored
        else {
            C_date::$timezone = $timezone = self::getTimeZone($dS_group_or_login->GMT);
            self::$secondsPerSlice = 3600 / $dS_group_or_login->timeSlice;	
        }

        date_default_timezone_set($timezone); // (**GMT) on the server side we set the timezone specified for the account
    }
    public static function getTimeShift($dS_group, $dS_login, $date = 'now') {

        $timezone1 = self::getTimeZone($dS_group->GMT); 
        $timezone2 = self::getTimeZone($dS_login->GMT); 
        $t1 = new DateTime($date, new DateTimeZone($timezone1));
        $t2 = new DateTime($date, new DateTimeZone($timezone2));
        $delta = $t2->getOffset()-$t1->getOffset();
        return $delta;
    }
    public static function get_GMT0_timeOffset($dS_group) {

        $acctimezone = self::getTimeZone($dS_group->GMT); // GMT is a simplified 3600 sec time based variant for not using the wider set of timezones available in PHP
        $t1 = new DateTime('now', new DateTimeZone($acctimezone));
        $delta = $t1->getOffset();
        return $delta;
    }
	

    // SET OF FUNCTIONS RELATING TO TIME SLICING

    public function getSlice() { return (int) ( $this->getSec() / self::$secondsPerSlice) ; } // returns slice number counted from midnight
    public static function getSecondsPerSlice() { return self::$secondsPerSlice; }

    public function setSlice($slice) { return $this->setSec(self::$secondsPerSlice * $slice); }
    public function sliceIncrement($slices) { $this->t += self::$secondsPerSlice * $slices; return $this; }
    public function	toMonday() { // brings you to the monday date of the actual week at midnight
        return $this->dIncrement(1-$this->getDayCode())->setToMidnight(); // negative increment that brings you back to monday 
    }
    public function isNowSlice() { 
        $now = new C_date();
        $delta = $now->getTstmp() - $this->t; 
        return $delta <= C_date::$secondsPerSlice && $delta >= 0;
    }
    public function isFuture() { 
        $now = new C_date();
        return $now->getTstmp() < $this->t; 
    }
    public function isBefore($o_date) { 
        $stamp = $o_date->getTstmp();
        return $this->t < $stamp; 
    }
    public function isAhead($o_date) { 
        $stamp = $o_date->getTstmp();
        return $this->t >= $stamp; 
    }
	public function isSameDay($o_date) {
		return $this->getMDNstmp() == $o_date->getMDNstmp();
	}
	public function isMDN() { // returns true if this date and time stick to midnight position on the clock.
		$dd = clone($this);
		$mdn = $dd->setToMidnight(); // this is the first midnight ahead of this object date value.
		return ($mdn->t == $this->t);
	}

    public function __construct($dateStmp = -1) { 
        // if called without parameter, the _date object is set with the origin timStamp for the GMT set in the group constructor

        // when called for the first time on a page execution, it sets time_zone. If setting time-zone fails, it dies. 
        if(!self::$instances++)  {
            self::$runTimeStamp = self::getNow();
        }

        if(is_object($dateStmp))  // argument passed is another C_date instance, then copy its timeStamp
            $dateStmp = $dateStmp->getTstmp();

        if($dateStmp === false) // argument passed is boolean 'false'
            $dateStmp = self::getNow();
        else
            if(!is_numeric($dateStmp)) // the string should have a standard time stamp format like "2007-11-14 19:22:46"
                $dateStmp = strtotime($dateStmp);

        if($dateStmp==-1)
            $dateStmp = self::getNow();

        $this->t = $dateStmp;
    }
	
    public function datetimelocation() { // returns the correct [date, day of week and time] in the timezone location of the user (designed for AI api)
		$hhmm = $this->getHHmmString(); // smth like "23:20"
		$tz = C_date::$timezone; // smth like "Europe/Brussels", this is correct only after C_date::setTimeParameters($dS_account) was called; 
		$sortable = $this->getDateSortable().' '.$this->getHHmmString();
		$r = '['.$sortable.'] "'.$this->getSpokenDate().', '.$hhmm.'" (timezone:'.$tz.')';
        return $r;
    }



    // CHANGING THE DATE

    // set* functions drop any date and replace them with origin date: 2/1/1970
    public function setStmp($stmp) { $this->t = $stmp; return $this; }
    public function setSec($seconds) { $this->t = $seconds + $this->getMDNstmp(); return $this; }
    public function setNow() { $this->t = self::getNow(); return $this; }
    public function setToMidnight() { $d=$this->t; $this->t = mktime(0,0,0,date("m",$d),date("d",$d),date("Y",$d)); return $this; }
    public function dropDate() { return $this->t = $this->getSec(); }
    public function dropMinutes() { $d = $this->t; return $this->t = mktime(date("H",$d),0,0,date("m",$d),date("d",$d),date("Y",$d)); }
    public function dropSeconds() { $d = $this->t; return $this->t = mktime(date("H",$d),date("i",$d),0,date("m",$d),date("d",$d),date("Y",$d)); }
    public function dropTime() { $d = $this->t; return $this->t = mktime(0,0,0,date("m",$d),date("d",$d),date("Y",$d)); }

    // *Increment functions move the timeStamp with respect to the current t setting
    public function sIncrement($seconds) { 
        $this->t +=$seconds;
        return $this; 
    }
    public function hIncrement($hours) {
        $this->t += ($hours*3600);
        return $this; 
    }
    public function dIncrement($days=1) {
        // $this->t += ($days*86400); <= do this and you get fucked by the daylight saving time switch, twice a year
        $d = $this->t;
        $this->t = mktime(date("H",$d),date("i",$d),date("s",$d),date("m",$d),date("d",$d)+$days,date("Y",$d)); 
        return $this; 
    }
    public function wIncrement($weeks) { 		
        return $this->dIncrement(7*$weeks);
    }
    public function mIncrement($months) { 
        $d = $this->t;
        $this->t = mktime(date("H",$d),date("i",$d),date("s",$d),date("m",$d)+$months,date("d",$d),date("Y",$d));
        return $this; 
    }	


    // to* functions move the timeStamp with respect to the current t setting
    public function toNextWeek() { 
        $d = $this->t;
        $this->t = mktime(0,0,0,date("m",$d),date("d",$d)+(7-date("w",$d)),date("Y",$d)); 
        return $this; 
    }
    public function toNextMonth() { 
        $d = $this->t;
        $this->t = mktime(0,0,0,date("m",$d)+1,1,date("Y",$d));
        return $this; 
    }	

    public function toSec($seconds) { $this->t = $this->getMDNstmp() + $seconds; } 

    // GETTING INFORMATION ABOUT THE DATE

    public function getDayCode($mondayStmp = false, $periodicity = false) { // monday is 1 to sunday = [7, 14, 21 or 28]

        // Note that since we introduced a notion of periodicity, the day code may extend over 7:
        // when periodicity is 1, then the agenda is managed week by week, and dayCode ranges [1 to 7]
        // if periodicity is 2, then the agenda is managed on a 2 weekly period and dayCode ranges [1 to 14]
        // and so on for 3 weeks, ... 4 weeks...
        // The periodicity is recorded for each resource separately (see C_dS_resource->periodicity) 
        // and helps defining availabilities that repeat weekly, 2 weekly, 3 weekly etc... 

        if(!$mondayStmp || $periodicity==1) return date("N",$this->t); 
        $d = $this->t;
        $m = mktime(0,0,0,date("m",$d),date("d",$d),date("Y",$d)); // drops hours and minutes
        $pDays = $periodicity * 7; // pDays is the periodicity expressed in unit of days
        $deltaDays = (int) round(($m-$mondayStmp) / 86400); // round because some days are 23hours long... or 25 
        while($deltaDays<0) $deltaDays+=(100*$pDays);
        $dayCode = 1 + $deltaDays % $pDays;
        // echo "<br/> getDayCode: deltaDays".$deltaDays."|daycode".$dayCode."|monday".$mondayStmp;
        return $dayCode;
    } 

    public function getMDNstmp() { $d = $this->t; return mktime(0,0,0,date("m",$d),date("d",$d),date("Y",$d)); }
    // public function getMDNstmp() { return $this->t-($this->t%86400); }  THIS CAN NOT WORK => TIME ZONE INFLUENCE
    public function getTstmp() { return $this->t; } // returns international timestamp in seconds counted from 1/1/1970 and from GMT +0
    public function getSec() { return $this->t-$this->getMDNstmp(); } // returns number of seconds counted from midnight
    public function isoClock() { return $this->t%3600 == 0; }
    public function isMidnight() { return $this->getSec() == 0; }

    // GETTING STRINGS FOR DISPLAY ( see https://www.php.net/manual/en/datetime.format.php )

    public function getDayString($cap=0) { 	return L::XL('weekday'.date('N',$this->t),-1,$cap); } // 'N' format is ISO 8601 numeric representation of the day of the week	1 (for Monday) through 7 (for Sunday). So language.php contains 'weekday1' = monday up to 'weekday7' = sunday
	public function getMonthString() { 		return L::XL('month'.date('m',$this->t),-1,0); }
	public function getDateHumanString() { 	return L::XL('date'.date('d',$this->t),-1,0); }
	public function getDateString() { 		return date('d/m/Y',$this->t); }
    public function getFullYearString() { 	return date('Y',$this->t); }
    public function getTimeString() { 		return Date('H:i:s',$this->t); }
    public function getHHmmString() { 		return Date('H:i',$this->t); }
    public function getHHstring() { 		return Date('H',$this->t); }
    public function getDateTimeString() { 	return Date('Y-m-d H:i:s',$this->t); }	
    public function get_ISO8601_stamp() { 	return Date('Y-m-d H:i:s',$this->t); }	
    public function getDateSortable() { 	return Date('Y-m-d',$this->t); }
    public function getBirthdaySortable() { return Date('Ymd',$this->t); }
    public function getTimeHHmm() { // does not display a date
        $s = $this->t;
        $h = intval($s/3600); $s-=$h*3600;
        $m = intval($s/60);
        if($h<10) $h = '0'.$h;
        if($m<10) $m = '0'.$m;
        $t = $h.':'.$m;
        return $t;
    }
	
    public function getSpokenDate() {
		$datetimein = new DateTime($this->getDateTimeString());
		$currentYear = date('Y');
		$spoken = $datetimein->format('l').' the '. $datetimein->format('jS').' of '.$datetimein->format('F');
		if($datetimein->format('Y')!==$currentYear)
			$spoken .= ' '.$datetimein->format('Y');
		return $spoken;
	}

    //bsp-begin
    //return string date with ISO 8601 Zulu format
    public function get_GMTDateTime() 
    { 
        // get current jetlag in seconds (ex -3600)
        $d = date('Z');

        //calculate a new date with jetlag
        $t = $this->t-$d;
        
        //display the new date with 
        return Date('Y-m-d\TH:i:s\Z',$t); 
    }	
    //bsp-end


    // TEST

    public function testDisplay() {
        echo "<br/><br/>C_date::testDisplay() >> ";
        echo $this->getDateTimeString()." = ".date("l",$this->t)." dayCode: ".$this->getDayCode();
        echo " ( stmp = ".$this->getTstmp().", midnightStmp = ".$this->getMDNstmp()." ) << <br/>";
    }

}

function cueInOutSort_ascending($a, $b) { return $b->in->getTstmp() - $a->in->getTstmp(); }
function cueInOutSort_descending($a, $b) { return $a->in->getTstmp() - $b->in->getTstmp(); }
function sort_cueInOut_array($array, $descending = false) {
    if($descending) $sortfunction = 'cueInOutSort_descending'; 
    else $sortfunction = 'cueInOutSort_ascending'; 
    uasort($array, $sortfunction); 
    return $array;
} 





////////////////////////////////////////////////////////////////////////////////////////////////
// CUSTOM CSS COLOR
// Find color in color.css
//
class C_cssNameToHexaColor {	// reads from color.css and links css color name with background color hexa value

    public $cssNameToHexa;
	public $customCsss;

    public function __construct($accountId)
    {
		$this->customCsss = new C_dbAccess_customCss($accountId);
		
		// the following array should stay inline with the definition of colors that you find in colors_2023.css
		$this->cssNameToHexa = Array ( 100 => '#9BFF9B', 101 => '#BBE6FF', 103 => '#FF8040', 104 => '#C1AD84', 106 => '#FF9FFF', 107 => '#C49DF7', 108 => '#8080FF', 110 => '#FFFF00', 111 => '#707070', 90 => '#F2F2F2', 91 => '#D8D8D8', 97 => '#BFBFBF', 98 => '#A5A5A5', 99 => '#7F7F7F', 113 => '#FFFFC0', 102 => '#FFF0A0', 105 => '#FEE283', 109 => '#BB9600', 114 => '#998200', 120 => '#DDD9C3', 121 => '#C4BD97', 122 => '#938953', 123 => '#494429', 124 => '#1D1B10', 130 => '#DBE5F1', 131 => '#B8CCE4', 132 => '#95B3D7', 133 => '#366092', 134 => '#244061', 140 => '#F2DCDB', 141 => '#E5B9B7', 142 => '#D99694', 143 => '#953734', 144 => '#632423', 150 => '#EBF1DD', 151 => '#D7E3BC', 152 => '#B5D088', 153 => '#76923C', 154 => '#4F6128', 160 => '#E5E0EC', 161 => '#CCC1D9', 162 => '#B2A2C7', 163 => '#5F497A', 164 => '#3F3151', 170 => '#DBEEF3', 171 => '#B7DDE8', 172 => '#92CDDC', 173 => '#31859B', 174 => '#205867', 180 => '#FDEADA', 181 => '#FBD5B5', 182 => '#FAC08F', 183 => '#E36C00', 184 => '#974806', 210 => '#F8F8FF', 211 => '#F0FFF0', 212 => '#FFF0F5', 213 => '#FFF5EE', 214 => '#FAF0E6', 215 => '#FFFFF0', 216 => '#FFFAF0', 217 => '#E6E6FA', 220 => '#DB7093', 221 => '#BA55D3', 222 => '#C71585', 223 => '#EE82EE', 224 => '#6A5ACD', 225 => '#8A2BE2', 226 => '#9370DB', 227 => '#7B68EE', 230 => '#F08080', 231 => '#FA8072', 232 => '#CD5C5C', 233 => '#A52A2A', 234 => '#8B0000', 235 => '#B22222', 236 => '#DC143C', 237 => '#FF4500', 240 => '#7FFFD4', 241 => '#00FA9A', 242 => '#00FF7F', 243 => '#98FB98', 244 => '#90EE90', 245 => '#32CD32', 246 => '#7FFF00', 247 => '#ADFF2F', 250 => '#FFFFE0', 251 => '#FFFACD', 252 => '#EEE8AA', 253 => '#FEF273', 254 => '#FFCC00', 255 => '#FFA500', 256 => '#FF8C00', 257 => '#DD9900', 260 => '#FAFAD2', 261 => '#F0E68C', 262 => '#BDB76B', 263 => '#8FBC8F', 264 => '#3CB371', 265 => '#2E8B57', 266 => '#556B2F', 267 => '#006400', 270 => '#FFF8DC', 271 => '#F5F5DC', 272 => '#FAEBD7', 273 => '#FFE4B5', 274 => '#FFDEAD', 275 => '#FFDAB9', 276 => '#F5DEB3', 277 => '#D2B48C', 280 => '#F5DEB3', 281 => '#DEB887', 282 => '#BC8F8F', 283 => '#B8860B', 284 => '#D2691E', 285 => '#CD853F', 286 => '#A0522D', 287 => '#8B4513', 290 => '#F0F8FF', 291 => '#B0E0E6', 292 => '#ADD8E6', 293 => '#B0C4DE', 294 => '#6495ED', 295 => '#4682B4', 296 => '#5F9EA0', 297 => '#4169E1' );
	}
	
	public function getHexaColor($dS_reservation) {

			$hexacolor = null;
			$ccssId = 0;
			
			if($dS_reservation->cssColor) $ccssId = $dS_reservation->cssColor; // explicit color is specified by the user in the dS_reservation
			else {
				if(isset($dS_reservation->workcodes->keyed)) // if that reservation has workcodes
				if(count($dS_reservation->workcodes->keyed)) {
					$dS_workcode = end($dS_reservation->workcodes->keyed); // get last workcode color 
					if($dS_workcode->cssColor) $ccssId = $dS_workcode->cssColor; // if any color is specified for this workcode
				}
			}
					
			if($ccssId) {  // not all performances have a color assigned
				$csscode = $this->customCsss->keyed[$ccssId]->css;  // is a css name identificator. Like 102 for .c102
				$hexacolor = $this->cssNameToHexa[$csscode];
			}
			return $hexacolor;
	}
	public function matchCssName($csscode) {
		if(isset($this->cssNameToHexa[$csscode]))
			return $this->cssNameToHexa[$csscode];
		else return null;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////
//
// CRONOFY USERS
//
class C_dS_cronofy_user extends C_dbTrackingCCD {	// group to a Mobminder loginId
    public function getTableName() { return  'cronofy_user'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    public $cro_account_id;
    public $cro_access_token;
    public $cro_refresh_token;
    public static $multilines = false;
    public static $defaults = array( 
        'cro_account_id'   => '',
        'cro_access_token'   => '',
        'cro_refresh_token' => '',
    );
    public function getDefaults() { return self::$defaults; }	
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dbAccess_cronofy_users extends C_dbGate {

    public function __construct($ids = false/*, $cronofyUserId = false,$calendarId=false*/) { 
        C_dbGate::__construct();
        if($ids) $this->loadOnId($ids); 

    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_cronofy_user'; }
    public function getTableName() { return 'cronofy_user'; }
    // public function getNew() { return new C_dS_cronofy_calendar(); } // pascal fixed corentin here
    public function getNew() { return new C_dS_cronofy_user(); } // pascal fixed corentin here

}


////////////////////////////////////////////////////////////////////////////////////////////////
//
// CRONOFY PROFILES
//
class C_dS_cronofy_profile extends C_dbTrackingCCD {	// group to an cronofy_user | profile is a combo email & provider, provider = google, MS, or iCloud
    public function getTableName() { return  'cronofy_profile'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    // public $keyId;
    public $cro_profile_id;
    public $cro_profile_name;
    public $cro_provider_name;
    public static $multilines = false;
    public static $defaults = array( 
        //'keyId'   => 0,
        'cro_profile_id' => '',
        'cro_profile_name' => '',
        'cro_provider_name' => '',
    );
    public function getDefaults() { return self::$defaults; }	
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dbAccess_cronofy_profiles extends C_dbGate {

    public function __construct($ids = false/*, $cronofyUserId = false,$calendarId=false*/) { 
        C_dbGate::__construct();
        if($ids) $this->loadOnId($ids); 

    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_cronofy_profile'; }
    public function getTableName() { return 'cronofy_profile'; }
    public function getNew() { return new C_dS_cronofy_profile(); }

    public function getByGroupId($groupId){
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
//
// CRONOFY ACCESSES
//
class C_dS_cronofy_access extends C_dbTrackingCCD {	// group to an cronofy_profile, contains the Mobminder accesskey id and so links to a view in a Mobminder account
    public function getTableName() { return  'cronofy_accesses'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $keyId=false,$groupId = false, &$preset = false)
    { 
        if(!!$keyId){
            $q = new Q('SELECT id FROM '.$this->getTableName().' WHERE keyId='.$keyId.' AND deletorId=0;');
            $i=$q->ids();
        }
        parent::__construct($id, $groupId, $preset);
    }
    public $keyId;
    public static $multilines = false;
    public static $defaults = array( 
        'keyId'   => 0,
    );
    public function getDefaults() { return self::$defaults; }	
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dbAccess_cronofy_accesses extends C_dbGate {
    public function __construct($ids = false) { 
        C_dbGate::__construct();
        if($ids) $this->loadOnId($ids); 

    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_cronofy_access'; }
    public function getTableName() { return 'cronofy_accesses'; }
    public function getNew() { return new C_dS_cronofy_access(); }

    public function getByKeyId($keyId){  
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE keyId='.$keyId.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }

    public function getByGroupId($groupId){
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////
//
// CRONOFY CALENDARS
//
class C_dS_cronofy_calendar extends C_dbTrackingCCD {	// group to an cronofy_access
    public function getTableName() { return  'cronofy_calendar'; }
    public function getClassName() { return get_class(); }
    public function __construct($id = false, $groupId = false, &$preset = false) { parent::__construct($id, $groupId, $preset);  }
    public $resourceId;
    public $cro_calendar_id;
    public $cro_channel_id;
    public $initStatus;
    public $permission;
    public $last_sync;
    public static $multilines = false;
    public static $defaults = array( 
        'resourceId'   => '',
        'cro_calendar_id' => '',
        'cro_channel_id' => NULL,
        'initStatus' => 0,
        'permission' =>0,
        'last_sync' => '0000-00-00 00:00:00'
    );
    public function getDefaults() { return self::$defaults; }	
    public function getName() { return $this->name; }
    public function stream($tracking = false, $sep = '|', $flds = false) { return parent::stream(with_tracking); }
}
class C_dbAccess_cronofy_calendars extends C_dbGate {

    public function __construct($ids = false) { 
        C_dbGate::__construct();
        if($ids) $this->loadOnId($ids); 

    }
    public function __destruct() { C_dbGate::__destruct(); }

    // abstract functions called from parent::C_dbGate
    public function getClassName() { return get_class(); }
    public function dataSetClassName() { return 'C_dS_cronofy_calendar'; }
    public function getTableName() { return 'cronofy_calendar'; }
    public function getNew() { return new C_dS_cronofy_calendar(); }

    /* public function getByGroupIdAndCronofyAccessId($cronofy_profile_id,$cronofy_access_id){
        $SQL = 'SELECT * FROM cronofy_calendar WHERE groupId='.$cronofy_profile_id.' AND cronofy_access_id='.$cronofy_access_id.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }*/

    public function getByGroupId($groupId){
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE groupId='.$groupId.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }

    /* public function getByCronofyAccessId($cronofy_access_id){
        $SQL = 'SELECT * FROM cronofy_calendar WHERE cronofy_access_id='.$cronofy_access_id.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }*/

    public function getByResourceId($resourceId){
        $SQL = 'SELECT * FROM '.$this->getTableName().' WHERE resourceId='.$resourceId.' AND deletorId=0;';
        C_dbGate::loadMany($SQL);
    }
}



////////////////////////////  O P E N    D B   C O N N E C T I O N
//
// in files that require dbio.php, if $systemLog is defined, it is set has "changer" on dbrecord tracking. 
// Else, the $_SESSION['loginId'] is used.
//

$dbio = new C_dbIO(isset($systemLog)?$systemLog:false); // $systemLog must be defined in the caller script, ahead of the inclusion of this script

// VERSION DoubleMetaphone Class 1.01
//
// DESCRIPTION
//
// This class implements a "sounds like" algorithm developed
// by Lawrence Philips which he published in the June, 2000 issue
// of C/C++ Users Journal. Double Metaphone is an improved
// version of Philips' original Metaphone algorithm.
//
// COPYRIGHT
//
// Copyright 2001, Stephen Woodbridge <woodbri@swoodbridge.com>
// All rights reserved.
//
// http://swoodbridge.com/DoubleMetaPhone/
//
// This PHP translation is based heavily on the C implementation
// by Maurice Aubrey <maurice@hevanet.com>, which in turn
// is based heavily on the C++ implementation by
// Lawrence Philips and incorporates several bug fixes courtesy
// of Kevin Atkinson <kevina@users.sourceforge.net>.
//
// This module is free software; you may redistribute it and/or
// modify it under the same terms as Perl itself.
//
// CONTRIBUTIONS
//
// 17-May-2002 Geoff Caplan http://www.advantae.com
// Bug fix: added code to return class object which I forgot to do
// Created a functional callable version instead of the class version
// which is faster if you are calling this a lot.
//
// ------------------------------------------------------------------
class DoubleMetaphone
{
  public $original = "";
  public $primary = "";
  public $secondary = "";
  public $length = 0;
  public $last = 0;
  public $current = 0;
  public $result = 0;
  
  public function __construct($string)
  {
    $this->primary = "";
    $this->secondary = "";
    $this->current = 0;
    
    $this->current = 0;
    $this->length = strlen($string);
    $this->last = $this->length - 1;
    $this->original = $string . "     ";
    
    $this->original = strtoupper($this->original);
    
    // skip this at beginning of word
    if($this->StringAt($this->original, 0, 2, array (
        'GN',
        'KN',
        'PN',
        'WR',
        'PS' 
    ))) {
      $this->current++;
    }
      
      // Initial 'X' is pronounced 'Z' e.g. 'Xavier'
    if(substr($this->original, 0, 1) == 'X') {
      $this->primary .= "S"; // 'Z' maps to 'S'
      $this->secondary .= "S";
      $this->current++;
    }
    
    // main loop
    
    while (strlen($this->primary) < 4 || strlen($this->secondary) < 4) {
      if($this->current >= $this->length) {
        break;
      }
      
      switch (substr($this->original, $this->current, 1)) {
        case 'A' :
        case 'E' :
        case 'I' :
        case 'O' :
        case 'U' :
        case 'Y' :
          if($this->current == 0) {
            // all init vowels now map to 'A'
            $this->primary .= 'A';
            $this->secondary .= 'A';
          }
          $this->current += 1;
          break;
        
        case 'B' :
          // '-mb', e.g. "dumb", already skipped over ...
          $this->primary .= 'P';
          $this->secondary .= 'P';
          
          if(substr($this->original, $this->current + 1, 1) == 'B') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'Ç' :
          $this->primary .= 'S';
          $this->secondary .= 'S';
          $this->current += 1;
          break;
        
        case 'C' :
          // various gremanic
          if(($this->current > 1) && !$this->IsVowel($this->original, $this->current - 2) && $this->StringAt($this->original, $this->current - 1, 3, array (
              "ACH" 
          )) && ((substr($this->original, $this->current + 2, 1) != 'I') && ((substr($this->original, $this->current + 2, 1) != 'E') || $this->StringAt($this->original, $this->current - 2, 6, array (
              "BACHER",
              "MACHER" 
          ))))) {
            
            $this->primary .= 'K';
            $this->secondary .= 'K';
            $this->current += 2;
            break;
          }
          
          // special case 'caesar'
          if(($this->current == 0) && $this->StringAt($this->original, $this->current, 6, array (
              "CAESAR" 
          ))) {
            $this->primary .= 'S';
            $this->secondary .= 'S';
            $this->current += 2;
            break;
          }
          
          // italian 'chianti'
          if($this->StringAt($this->original, $this->current, 4, array (
              "CHIA" 
          ))) {
            $this->primary .= 'K';
            $this->secondary .= 'K';
            $this->current += 2;
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "CH" 
          ))) {
            
            // find 'michael'
            if(($this->current > 0) && $this->StringAt($this->original, $this->current, 4, array (
                "CHAE" 
            ))) {
              $this->primary .= 'K';
              $this->secondary .= 'X';
              $this->current += 2;
              break;
            }
            
            // greek roots e.g. 'chemistry', 'chorus'
            if(($this->current == 0) && ($this->StringAt($this->original, $this->current + 1, 5, array (
                "HARAC",
                "HARIS" 
            )) || $this->StringAt($this->original, $this->current + 1, 3, array (
                "HOR",
                "HYM",
                "HIA",
                "HEM" 
            ))) && !$this->StringAt($this->original, 0, 5, array (
                "CHORE" 
            ))) {
              $this->primary .= 'K';
              $this->secondary .= 'K';
              $this->current += 2;
              break;
            }
            
            // germanic, greek, or otherwise 'ch' for 'kh' sound
            if(($this->StringAt($this->original, 0, 4, array (
                "VAN ",
                "VON " 
            )) || $this->StringAt($this->original, 0, 3, array (
                "SCH" 
            ))) || 
            // 'architect' but not 'arch', orchestra', 'orchid'
            $this->StringAt($this->original, $this->current - 2, 6, array (
                "ORCHES",
                "ARCHIT",
                "ORCHID" 
            )) || $this->StringAt($this->original, $this->current + 2, 1, array (
                "T",
                "S" 
            )) || (($this->StringAt($this->original, $this->current - 1, 1, array (
                "A",
                "O",
                "U",
                "E" 
            )) || ($this->current == 0)) && 
            // e.g. 'wachtler', 'weschsler', but not 'tichner'
            $this->StringAt($this->original, $this->current + 2, 1, array (
                "L",
                "R",
                "N",
                "M",
                "B",
                "H",
                "F",
                "V",
                "W",
                " " 
            )))) {
              $this->primary .= 'K';
              $this->secondary .= 'K';
            }
            else {
              if($this->current > 0) {
                if($this->StringAt($this->original, 0, 2, array (
                    "MC" 
                ))) {
                  // e.g. 'McHugh'
                  $this->primary .= 'K';
                  $this->secondary .= 'K';
                }
                else {
                  $this->primary .= 'X';
                  $this->secondary .= 'K';
                }
              }
              else {
                $this->primary .= 'X';
                $this->secondary .= 'X';
              }
            }
            $this->current += 2;
            break;
          }
          
          // e.g. 'czerny'
          if($this->StringAt($this->original, $this->current, 2, array (
              "CZ" 
          )) && !$this->StringAt($this->original, $this->current - 2, 4, array (
              "WICZ" 
          ))) {
            $this->primary .= 'S';
            $this->secondary .= 'X';
            $this->current += 2;
            break;
          }
          
          // e.g. 'focaccia'
          if($this->StringAt($this->original, $this->current + 1, 3, array (
              "CIA" 
          ))) {
            $this->primary .= 'X';
            $this->secondary .= 'X';
            $this->current += 3;
            break;
          }
          
          // double 'C', but not McClellan'
          if($this->StringAt($this->original, $this->current, 2, array (
              "CC" 
          )) && !(($this->current == 1) && (substr($this->original, 0, 1) == 'M'))) {
            // 'bellocchio' but not 'bacchus'
            if($this->StringAt($this->original, $this->current + 2, 1, array (
                "I",
                "E",
                "H" 
            )) && !$this->StringAt($this->original, $this->current + 2, 2, array (
                "HU" 
            ))) {
              // 'accident', 'accede', 'succeed'
              if((($this->current == 1) && (substr($this->original, $this->current - 1, 1) == 'A')) || $this->StringAt($this->original, $this->current - 1, 5, array (
                  "UCCEE",
                  "UCCES" 
              ))) {
                $this->primary .= "KS";
                $this->secondary .= "KS";
                // 'bacci', 'bertucci', other italian
              }
              else {
                $this->primary .= "X";
                $this->secondary .= "X";
              }
              $this->current += 3;
              break;
            }
            else {
              // Pierce's rule
              $this->primary .= "K";
              $this->secondary .= "K";
              $this->current += 2;
              break;
            }
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "CK",
              "CG",
              "CQ" 
          ))) {
            $this->primary .= "K";
            $this->secondary .= "K";
            $this->current += 2;
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "CI",
              "CE",
              "CY" 
          ))) {
            // italian vs. english
            if($this->StringAt($this->original, $this->current, 3, array (
                "CIO",
                "CIE",
                "CIA" 
            ))) {
              $this->primary .= "S";
              $this->secondary .= "X";
            }
            else {
              $this->primary .= "S";
              $this->secondary .= "S";
            }
            $this->current += 2;
            break;
          }
          
          // else
          $this->primary .= "K";
          $this->secondary .= "K";
          
          // name sent in 'mac caffrey', 'mac gregor'
          if($this->StringAt($this->original, $this->current + 1, 2, array (
              " C",
              " Q",
              " G" 
          ))) {
            $this->current += 3;
          }
          else {
            if($this->StringAt($this->original, $this->current + 1, 1, array (
                "C",
                "K",
                "Q" 
            )) && !$this->StringAt($this->original, $this->current + 1, 2, array (
                "CE",
                "CI" 
            ))) {
              $this->current += 2;
            }
            else {
              $this->current += 1;
            }
          }
          break;
        
        case 'D' :
          if($this->StringAt($this->original, $this->current, 2, array (
              "DG" 
          ))) {
            if($this->StringAt($this->original, $this->current + 2, 1, array (
                "I",
                "E",
                "Y" 
            ))) {
              // e.g. 'edge'
              $this->primary .= "J";
              $this->secondary .= "J";
              $this->current += 3;
              break;
            }
            else {
              // e.g. 'edgar'
              $this->primary .= "TK";
              $this->secondary .= "TK";
              $this->current += 2;
              break;
            }
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "DT",
              "DD" 
          ))) {
            $this->primary .= "T";
            $this->secondary .= "T";
            $this->current += 2;
            break;
          }
          
          // else
          $this->primary .= "T";
          $this->secondary .= "T";
          $this->current += 1;
          break;
        
        case 'F' :
          if(substr($this->original, $this->current + 1, 1) == 'F') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "F";
          $this->secondary .= "F";
          break;
        
        case 'G' :
          if(substr($this->original, $this->current + 1, 1) == 'H') {
            if(($this->current > 0) && !$this->IsVowel($this->original, $this->current - 1)) {
              $this->primary .= "K";
              $this->secondary .= "K";
              $this->current += 2;
              break;
            }
            
            if($this->current < 3) {
              // 'ghislane', 'ghiradelli'
              if($this->current == 0) {
                if(substr($this->original, $this->current + 2, 1) == 'I') {
                  $this->primary .= "J";
                  $this->secondary .= "J";
                }
                else {
                  $this->primary .= "K";
                  $this->secondary .= "K";
                }
                $this->current += 2;
                break;
              }
            }
            
            // Parker's rule (with some further refinements) - e.g. 'hugh'
            if((($this->current > 1) && $this->StringAt($this->original, $this->current - 2, 1, array (
                "B",
                "H",
                "D" 
            ))) || 
            // e.g. 'bough'
            (($this->current > 2) && $this->StringAt($this->original, $this->current - 3, 1, array (
                "B",
                "H",
                "D" 
            ))) || 
            // e.g. 'broughton'
            (($this->current > 3) && $this->StringAt($this->original, $this->current - 4, 1, array (
                "B",
                "H" 
            )))) {
              $this->current += 2;
              break;
            }
            else {
              // e.g. 'laugh', 'McLaughlin', 'cough', 'gough', 'rough', 'tough'
              if(($this->current > 2) && (substr($this->original, $this->current - 1, 1) == 'U') && $this->StringAt($this->original, $this->current - 3, 1, array (
                  "C",
                  "G",
                  "L",
                  "R",
                  "T" 
              ))) {
                $this->primary .= "F";
                $this->secondary .= "F";
              }
              elseif(($this->current > 0) && substr($this->original, $this->current - 1, 1) != 'I') {
                $this->primary .= "K";
                $this->secondary .= "K";
              }
              $this->current += 2;
              break;
            }
          }
          
          if(substr($this->original, $this->current + 1, 1) == 'N') {
            if(($this->current == 1) && $this->IsVowel($this->original, 0) && !$this->SlavoGermanic($this->original)) {
              $this->primary .= "KN";
              $this->secondary .= "N";
            }
            else {
              // not e.g. 'cagney'
              if(!$this->StringAt($this->original, $this->current + 2, 2, array (
                  "EY" 
              )) && (substr($this->original, $this->current + 1) != "Y") && !$this->SlavoGermanic($this->original)) {
                $this->primary .= "N";
                $this->secondary .= "KN";
              }
              else {
                $this->primary .= "KN";
                $this->secondary .= "KN";
              }
            }
            $this->current += 2;
            break;
          }
          
          // 'tagliaro'
          if($this->StringAt($this->original, $this->current + 1, 2, array (
              "LI" 
          )) && !$this->SlavoGermanic($this->original)) {
            $this->primary .= "KL";
            $this->secondary .= "L";
            $this->current += 2;
            break;
          }
          
          // -ges-, -gep-, -gel- at beginning
          if(($this->current == 0) && ((substr($this->original, $this->current + 1, 1) == 'Y') || $this->StringAt($this->original, $this->current + 1, 2, array (
              "ES",
              "EP",
              "EB",
              "EL",
              "EY",
              "IB",
              "IL",
              "IN",
              "IE",
              "EI",
              "ER" 
          )))) {
            $this->primary .= "K";
            $this->secondary .= "J";
            $this->current += 2;
            break;
          }
          
          // -ger-, -gy-
          if(($this->StringAt($this->original, $this->current + 1, 2, array (
              "ER" 
          )) || (substr($this->original, $this->current + 1, 1) == 'Y')) && !$this->StringAt($this->original, 0, 6, array (
              "DANGER",
              "RANGER",
              "MANGER" 
          )) && !$this->StringAt($this->original, $this->current - 1, 1, array (
              "E",
              "I" 
          )) && !$this->StringAt($this->original, $this->current - 1, 3, array (
              "RGY",
              "OGY" 
          ))) {
            $this->primary .= "K";
            $this->secondary .= "J";
            $this->current += 2;
            break;
          }
          
          // italian e.g. 'biaggi'
          if($this->StringAt($this->original, $this->current + 1, 1, array (
              "E",
              "I",
              "Y" 
          )) || $this->StringAt($this->original, $this->current - 1, 4, array (
              "AGGI",
              "OGGI" 
          ))) {
            // obvious germanic
            if(($this->StringAt($this->original, 0, 4, array (
                "VAN ",
                "VON " 
            )) || $this->StringAt($this->original, 0, 3, array (
                "SCH" 
            ))) || $this->StringAt($this->original, $this->current + 1, 2, array (
                "ET" 
            ))) {
              $this->primary .= "K";
              $this->secondary .= "K";
            }
            else {
              // always soft if french ending
              if($this->StringAt($this->original, $this->current + 1, 4, array (
                  "IER " 
              ))) {
                $this->primary .= "J";
                $this->secondary .= "J";
              }
              else {
                $this->primary .= "J";
                $this->secondary .= "K";
              }
            }
            $this->current += 2;
            break;
          }
          
          if(substr($this->original, $this->current + 1, 1) == 'G') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          
          $this->primary .= 'K';
          $this->secondary .= 'K';
          break;
        
        case 'H' :
          // only keep if first & before vowel or btw. 2 vowels
          if((($this->current == 0) || $this->IsVowel($this->original, $this->current - 1)) && $this->IsVowel($this->original, $this->current + 1)) {
            $this->primary .= 'H';
            $this->secondary .= 'H';
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'J' :
          // obvious spanish, 'jose', 'san jacinto'
          if($this->StringAt($this->original, $this->current, 4, array (
              "JOSE" 
          )) || $this->StringAt($this->original, 0, 4, array (
              "SAN " 
          ))) {
            if((($this->current == 0) && (substr($this->original, $this->current + 4, 1) == ' ')) || $this->StringAt($this->original, 0, 4, array (
                "SAN " 
            ))) {
              $this->primary .= 'H';
              $this->secondary .= 'H';
            }
            else {
              $this->primary .= "J";
              $this->secondary .= 'H';
            }
            $this->current += 1;
            break;
          }
          
          if(($this->current == 0) && !$this->StringAt($this->original, $this->current, 4, array (
              "JOSE" 
          ))) {
            $this->primary .= 'J'; // Yankelovich/Jankelowicz
            $this->secondary .= 'A';
          }
          else {
            // spanish pron. of .e.g. 'bajador'
            if($this->IsVowel($this->original, $this->current - 1) && !$this->SlavoGermanic($this->original) && ((substr($this->original, $this->current + 1, 1) == 'A') || (substr($this->original, $this->current + 1, 1) == 'O'))) {
              $this->primary .= "J";
              $this->secondary .= "H";
            }
            else {
              if($this->current == $this->last) {
                $this->primary .= "J";
                $this->secondary .= "";
              }
              else {
                if(!$this->StringAt($this->original, $this->current + 1, 1, array (
                    "L",
                    "T",
                    "K",
                    "S",
                    "N",
                    "M",
                    "B",
                    "Z" 
                )) && !$this->StringAt($this->original, $this->current - 1, 1, array (
                    "S",
                    "K",
                    "L" 
                ))) {
                  $this->primary .= "J";
                  $this->secondary .= "J";
                }
              }
            }
          }
          
          if(substr($this->original, $this->current + 1, 1) == 'J') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'K' :
          if(substr($this->original, $this->current + 1, 1) == 'K') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "K";
          $this->secondary .= "K";
          break;
        
        case 'L' :
          if(substr($this->original, $this->current + 1, 1) == 'L') {
            // spanish e.g. 'cabrillo', 'gallegos'
            if((($this->current == ($this->length - 3)) && $this->StringAt($this->original, $this->current - 1, 4, array (
                "ILLO",
                "ILLA",
                "ALLE" 
            ))) || (($this->StringAt($this->original, $this->last - 1, 2, array (
                "AS",
                "OS" 
            )) || $this->StringAt($this->original, $this->last, 1, array (
                "A",
                "O" 
            ))) && $this->StringAt($this->original, $this->current - 1, 4, array (
                "ALLE" 
            )))) {
              $this->primary .= "L";
              $this->secondary .= "";
              $this->current += 2;
              break;
            }
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "L";
          $this->secondary .= "L";
          break;
        
        case 'M' :
          if(($this->StringAt($this->original, $this->current - 1, 3, array (
              "UMB" 
          )) && ((($this->current + 1) == $this->last) || $this->StringAt($this->original, $this->current + 2, 2, array (
              "ER" 
          )))) || 
          // 'dumb', 'thumb'
          (substr($this->original, $this->current + 1, 1) == 'M')) {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "M";
          $this->secondary .= "M";
          break;
        
        case 'N' :
          if(substr($this->original, $this->current + 1, 1) == 'N') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "N";
          $this->secondary .= "N";
          break;
        
        case 'Ñ' :
          $this->current += 1;
          $this->primary .= "N";
          $this->secondary .= "N";
          break;
        
        case 'P' :
          if(substr($this->original, $this->current + 1, 1) == 'H') {
            $this->current += 2;
            $this->primary .= "F";
            $this->secondary .= "F";
            break;
          }
          
          // also account for "campbell" and "raspberry"
          if($this->StringAt($this->original, $this->current + 1, 1, array (
              "P",
              "B" 
          ))) {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "P";
          $this->secondary .= "P";
          break;
        
        case 'Q' :
          if(substr($this->original, $this->current + 1, 1) == 'Q') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "K";
          $this->secondary .= "K";
          break;
        
        case 'R' :
          // french e.g. 'rogier', but exclude 'hochmeier'
          if(($this->current == $this->last) && !$this->SlavoGermanic($this->original) && $this->StringAt($this->original, $this->current - 2, 2, array (
              "IE" 
          )) && !$this->StringAt($this->original, $this->current - 4, 2, array (
              "ME",
              "MA" 
          ))) {
            $this->primary .= "";
            $this->secondary .= "R";
          }
          else {
            $this->primary .= "R";
            $this->secondary .= "R";
          }
          if(substr($this->original, $this->current + 1, 1) == 'R') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'S' :
          // special cases 'island', 'isle', 'carlisle', 'carlysle'
          if($this->StringAt($this->original, $this->current - 1, 3, array (
              "ISL",
              "YSL" 
          ))) {
            $this->current += 1;
            break;
          }
          
          // special case 'sugar-'
          if(($this->current == 0) && $this->StringAt($this->original, $this->current, 5, array (
              "SUGAR" 
          ))) {
            $this->primary .= "X";
            $this->secondary .= "S";
            $this->current += 1;
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "SH" 
          ))) {
            // germanic
            if($this->StringAt($this->original, $this->current + 1, 4, array (
                "HEIM",
                "HOEK",
                "HOLM",
                "HOLZ" 
            ))) {
              $this->primary .= "S";
              $this->secondary .= "S";
            }
            else {
              $this->primary .= "X";
              $this->secondary .= "X";
            }
            $this->current += 2;
            break;
          }
          
          // italian & armenian
          if($this->StringAt($this->original, $this->current, 3, array (
              "SIO",
              "SIA" 
          )) || $this->StringAt($this->original, $this->current, 4, array (
              "SIAN" 
          ))) {
            if(!$this->SlavoGermanic($this->original)) {
              $this->primary .= "S";
              $this->secondary .= "X";
            }
            else {
              $this->primary .= "S";
              $this->secondary .= "S";
            }
            $this->current += 3;
            break;
          }
          
          // german & anglicisations, e.g. 'smith' match 'schmidt', 'snider' match 'schneider'
          // also, -sz- in slavic language altho in hungarian it is pronounced 's'
          if((($this->current == 0) && $this->StringAt($this->original, $this->current + 1, 1, array (
              "M",
              "N",
              "L",
              "W" 
          ))) || $this->StringAt($this->original, $this->current + 1, 1, array (
              "Z" 
          ))) {
            $this->primary .= "S";
            $this->secondary .= "X";
            if($this->StringAt($this->original, $this->current + 1, 1, array (
                "Z" 
            ))) {
              $this->current += 2;
            }
            else {
              $this->current += 1;
            }
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "SC" 
          ))) {
            // Schlesinger's rule
            if(substr($this->original, $this->current + 2, 1) == 'H') {
              // dutch origin, e.g. 'school', 'schooner'
              if($this->StringAt($this->original, $this->current + 3, 2, array (
                  "OO",
                  "ER",
                  "EN",
                  "UY",
                  "ED",
                  "EM" 
              ))) {
                // 'schermerhorn', 'schenker'
                if($this->StringAt($this->original, $this->current + 3, 2, array (
                    "ER",
                    "EN" 
                ))) {
                  $this->primary .= "X";
                  $this->secondary .= "SK";
                }
                else {
                  $this->primary .= "SK";
                  $this->secondary .= "SK";
                }
                $this->current += 3;
                break;
              }
              else {
                if(($this->current == 0) && !$this->IsVowel($this->original, 3) && (substr($this->original, $this->current + 3, 1) != 'W')) {
                  $this->primary .= "X";
                  $this->secondary .= "S";
                }
                else {
                  $this->primary .= "X";
                  $this->secondary .= "X";
                }
                $this->current += 3;
                break;
              }
            }
            
            if($this->StringAt($this->original, $this->current + 2, 1, array (
                "I",
                "E",
                "Y" 
            ))) {
              $this->primary .= "S";
              $this->secondary .= "S";
              $this->current += 3;
              break;
            }
            
            // else
            $this->primary .= "SK";
            $this->secondary .= "SK";
            $this->current += 3;
            break;
          }
          
          // french e.g. 'resnais', 'artois'
          if(($this->current == $this->last) && $this->StringAt($this->original, $this->current - 2, 2, array (
              "AI",
              "OI" 
          ))) {
            $this->primary .= "";
            $this->secondary .= "S";
          }
          else {
            $this->primary .= "S";
            $this->secondary .= "S";
          }
          
          if($this->StringAt($this->original, $this->current + 1, 1, array (
              "S",
              "Z" 
          ))) {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'T' :
          if($this->StringAt($this->original, $this->current, 4, array (
              "TION" 
          ))) {
            $this->primary .= "X";
            $this->secondary .= "X";
            $this->current += 3;
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 3, array (
              "TIA",
              "TCH" 
          ))) {
            $this->primary .= "X";
            $this->secondary .= "X";
            $this->current += 3;
            break;
          }
          
          if($this->StringAt($this->original, $this->current, 2, array (
              "TH" 
          )) || $this->StringAt($this->original, $this->current, 3, array (
              "TTH" 
          ))) {
            // special case 'thomas', 'thames' or germanic
            if($this->StringAt($this->original, $this->current + 2, 2, array (
                "OM",
                "AM" 
            )) || $this->StringAt($this->original, 0, 4, array (
                "VAN ",
                "VON " 
            )) || $this->StringAt($this->original, 0, 3, array (
                "SCH" 
            ))) {
              $this->primary .= "T";
              $this->secondary .= "T";
            }
            else {
              $this->primary .= "0";
              $this->secondary .= "T";
            }
            $this->current += 2;
            break;
          }
          
          if($this->StringAt($this->original, $this->current + 1, 1, array (
              "T",
              "D" 
          ))) {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "T";
          $this->secondary .= "T";
          break;
        
        case 'V' :
          if(substr($this->original, $this->current + 1, 1) == 'V') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          $this->primary .= "F";
          $this->secondary .= "F";
          break;
        
        case 'W' :
          // can also be in middle of word
          if($this->StringAt($this->original, $this->current, 2, array (
              "WR" 
          ))) {
            $this->primary .= "R";
            $this->secondary .= "R";
            $this->current += 2;
            break;
          }
          
          if(($this->current == 0) && ($this->IsVowel($this->original, $this->current + 1) || $this->StringAt($this->original, $this->current, 2, array (
              "WH" 
          )))) {
            // Wasserman should match Vasserman
            if($this->IsVowel($this->original, $this->current + 1)) {
              $this->primary .= "A";
              $this->secondary .= "F";
            }
            else {
              // need Uomo to match Womo
              $this->primary .= "A";
              $this->secondary .= "A";
            }
          }
          
          // Arnow should match Arnoff
          if((($this->current == $this->last) && $this->IsVowel($this->original, $this->current - 1)) || $this->StringAt($this->original, $this->current - 1, 5, array (
              "EWSKI",
              "EWSKY",
              "OWSKI",
              "OWSKY" 
          )) || $this->StringAt($this->original, 0, 3, array (
              "SCH" 
          ))) {
            $this->primary .= "";
            $this->secondary .= "F";
            $this->current += 1;
            break;
          }
          
          // polish e.g. 'filipowicz'
          if($this->StringAt($this->original, $this->current, 4, array (
              "WICZ",
              "WITZ" 
          ))) {
            $this->primary .= "TS";
            $this->secondary .= "FX";
            $this->current += 4;
            break;
          }
          
          // else skip it
          $this->current += 1;
          break;
        
        case 'X' :
          // french e.g. breaux
          if(!(($this->current == $this->last) && ($this->StringAt($this->original, $this->current - 3, 3, array (
              "IAU",
              "EAU" 
          )) || $this->StringAt($this->original, $this->current - 2, 2, array (
              "AU",
              "OU" 
          ))))) {
            $this->primary .= "KS";
            $this->secondary .= "KS";
          }
          
          if($this->StringAt($this->original, $this->current + 1, 1, array (
              "C",
              "X" 
          ))) {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        case 'Z' :
          // chinese pinyin e.g. 'zhao'
          if(substr($this->original, $this->current + 1, 1) == "H") {
            $this->primary .= "J";
            $this->secondary .= "J";
            $this->current += 2;
            break;
          }
          elseif($this->StringAt($this->original, $this->current + 1, 2, array (
              "ZO",
              "ZI",
              "ZA" 
          )) || ($this->SlavoGermanic($this->original) && (($this->current > 0) && substr($this->original, $this->current - 1, 1) != 'T'))) {
            $this->primary .= "S";
            $this->secondary .= "TS";
          }
          else {
            $this->primary .= "S";
            $this->secondary .= "S";
          }
          
          if(substr($this->original, $this->current + 1, 1) == 'Z') {
            $this->current += 2;
          }
          else {
            $this->current += 1;
          }
          break;
        
        default :
          $this->current += 1;
      }
    }
    
    $this->primary = substr($this->primary, 0, 4);
    $this->secondary = substr($this->secondary, 0, 4);
    
    $this->result = [];
    $this->result["primary"] = $this->primary;
    $this->result["secondary"] = $this->secondary;
    
    return $this;
  }
    
  private function StringAt($string, $start, $length, $list)
  {
    if(($start < 0) || ($start >= strlen($string))) {
      return 0;
    }
    
    for ($i = 0; $i < count($list); $i++) {
      if($list[$i] == substr($string, $start, $length)) {
        return 1;
      }
    }
    return 0;
  }
  
  private function IsVowel($string, $pos)
  {
    return preg_match("/[AEIOUY]/", substr($string, $pos, 1));
  }
  
  private function SlavoGermanic($string)
  {
    return preg_match("/W|K|CZ|WITZ/", $string);
  }
}

?>