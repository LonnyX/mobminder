<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S Y N C H R O     L I B R A R Y 
//
//

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


function abort($errorcode, $errormsg) { 
	echo '##'.$errorcode.'##'.'error: '.$errormsg.chr(10);
	die();
};
function msg($msg) { global $web; if($web) echo $msg.chr(10); };


function quicklogin() {

	if(!isset($_POST)) abort('001','gate::Missing post, check your form-multipart encoding');
	if(count($_POST)==0) abort('002','gate::None parameter in post, check your form-multipart encoding');

	if(!isset($_POST['login'])) abort('003','gate::You must specify a login');
	if(!isset($_POST['passw'])) abort('004','gate::You must specify a password');

	$login 	= $_POST['login'];
	$pass 	= $_POST['passw'];
	$dS_login = C_dS_login::logon($login, $pass);
	if(!$dS_login) abort('005','gate::Wrong login/pass combination');
		else if($dS_login->accessLevel!=3) abort('006','gate::You do not have the expected access level');
			else C_dbIO::logged($dS_login,'(sync3)');
	msg('Logged:'.C_dbIO::$loggedName);
	
	return $dS_login;
}
function quickkey($loginid, $accountid = false) { // assumes a single key is attached to this login
	$and = $accountid ? ' and accountId = "'.$accountid.'" ' : '';
	$q = new Q('select id from accesskeys where groupId = "'.$loginid.'" '.$and.';'); // access keys group to a login
	$ids = $q->ids(false); $kid = 0; if(count($ids)) $kid = $ids[0];
	if($kid==0) { abort('009', 'gate::You have no allowance on this page (invalid key)'); }
	
	$dS_accesskey = new C_dS_accesskey($kid);
	return $dS_accesskey;
}

class C_syncContext { // should be used in all sync scripts in the next design lift, now only used for backups
	
	private $dS_login;
	private $dS_ackey;
	
	// correlators
	private $ccss;
	private $rscs;
	private $visis;
	private $resas;
	
	// forward correlators
	private $fw_ccss;
	private $fw_rscs;
	private $fw_rtype;
	
	// reverse correlators
	private $rv_ccss;
	private $rv_rscs;
	
	
	public function __construct($dS_login, $dS_accesskey) {
		
		$this->dS_login = $dS_login;
		$this->dS_ackey = $dS_accesskey;
		$this->visis = false;
		
		$skeyId = $this->dS_ackey->id;
		
		// account resources
		$this->rscs = new C_dbAccess_resources($dS_accesskey->accountId);
		$rrscs = new C_dbAccess_synchro_resources($skeyId);
		foreach($this->rscs->keyed as $rid => $dS_rsc) 
			$dS_rsc->remoteId = 0; // 0 is default when not synced
		if($rrscs->count()) 
			foreach($rrscs->keyed as $dS_sync_rsc) 
				$this->rscs->keyed[$dS_sync_rsc->localId]->remoteId = $dS_sync_rsc->remoteId;

		// custom ccss
		$this->ccss = new C_dbAccess_customCss($dS_accesskey->accountId); // here we associate the custom ccss remoteId with the mobminder ccss ids
		$rccss = new C_dbAccess_synchro_ccss($skeyId);
		foreach($this->ccss->keyed as $cid => $dS_ccss) 
			$dS_ccss->remoteId = ''; // '' is default when not synced
		if($rccss->count()) 
			foreach($rccss->keyed as $dS_sync_ccss) 
				$this->ccss->keyed[$dS_sync_ccss->localId]->remoteId = $dS_sync_ccss->remoteId;

		// forward correlators (from local id to remote id)
		$this->fw_ccss = Array();
		$this->fw_rscs = Array();
		$this->fw_rtype = Array();
			
			// only synchronized items are present in those arrays
		foreach($this->ccss->keyed as $cid => $dS_ccss) if($dS_ccss->remoteId) $this->fw_ccss[$cid] = $dS_ccss->remoteId;
		foreach($this->rscs->keyed as $rid => $dS_rsc)  if($dS_rsc->remoteId) $this->fw_rscs[$rid] = $dS_rsc->remoteId;
		foreach($this->rscs->keyed as $rid => $dS_rsc)  if($dS_rsc->remoteId) $this->fw_rtype[$rid] = $dS_rsc->resourceType;
	
		// reverse correlators (from remote id to local id)
		$this->rv_ccss = array_flip($this->fw_ccss);
		$this->rv_rscs = array_flip($this->fw_rscs);
		
	}
	
	// functions for listing synchronized resources
	// 
	public function listrescs() {
		$l = 'mobId;mobName;mobClass;remoteId'.chr(10);
		foreach($this->fw_rscs as $rid => $rremId) {
			$mn = $this->rscs->keyed[$rid]->name;
			$mt = $this->fw_rtype[$rid];
			$l .= $rid.';'.$mn.';'.$mt.';'.$rremId.chr(10); 
		}
		return $l;
	}
	public function listccsss() {
		$l = 'mobId;mobName;mobClass;remoteId'.chr(10);
		foreach($this->fw_ccss as $rid => $cremId) {
			$mn = $this->ccss->keyed[$rid]->name;
			$mc = $this->ccss->keyed[$rid]->resaClass;
			$l .= $rid.';'.$mn.';'.$mc.';'.$cremId.chr(10); 
		}
		return $l;
	}
	
	
	// functions allowing to clean up appointments and visitors in the target context
	//
	public function flush_visitors() {
		
		new Q('delete from visitors where groupId = '.$this->dS_ackey->accountId.';');
		new Q('delete from synchro_visitors where groupId = '.$this->dS_ackey->accountId.';'); // this will fuck any setup where double sync is present
	}
	public function flush_reservations() {
		
		// Appointments are removed only for the synced resources
		$rsync = new C_dbAccess_synchro_resources($this->dS_ackey->id);
		if(!$rsync->count()) abort('101', 'clean up::No Resource is expected to be synchronized');
		foreach($rsync->keyed as $rsc) {
			$rid = $rsc->localId;
			C_dS_reservation::removeResource($rid);
			C_dS_reservation::removeResource($rid, 'archive_');
		}
		new Q('delete from synchro_reservations where groupId = '.$this->dS_ackey->accountId.';');
		
	}
	
	// functions allowing to retrieve local ids from remote ids
	//
	public function local_rsc($remoteRscIds, $id) {
		$rrscs = explode('!',$remoteRscIds); 
		$atts = new C_dbAccess_attendees(); 
		foreach($rrscs as $rid) { // the value passed by the remote program is his own resource id
			if(!isset($this->rv_rscs[$rid])) { msg(chr(9).'Warning: this resource has no sync correlator in Mobminder:'.$rid.' in item '.$id); continue; } // this resource is not synchronized
			$lrid = $this->rv_rscs[$rid];
			$att = $atts->newVirtual(); $att->resourceId = $lrid; $att->resourceType = $this->fw_rtype[$lrid]; 
		}
		return $atts;
	}
	public function local_ccss($remoteCcssId, $id) {
		if(!isset($this->rv_ccss[$remoteCcssId])) return 0;
		return $this->rv_ccss[$remoteCcssId];
	}
	
	
	// functions allowing to retrieve remote ids from localIds
	//
	private function rem_rsc($localRscId) {
		if(!isset($this->rscs->keyed[$localRscId])) {
			msg('Trying to associate a local resource id having no correspondence in account resources:'.$localRscId);
			return 0;
		}
		return $this->rscs->keyed[$localRscId]->remoteId;
	}
	private function rem_ccss($localCcssId) {
		if($localCcssId==0) return '';
		if(!isset($this->ccss->keyed[$localCcssId])) {
			msg('Trying to associate a local custom css id having no correspondence in account ccss:'.$localCcssId);
			return 0;
		}
		return $this->ccss->keyed[$localCcssId]->remoteId;
	}
	
	// functions allowing to magnify visitors or reservations using their remote ids 
	//
	private function sortonlname($dS1,$dS2) { return strcmp($dS1->lastname, $dS2->lastname); } 
	public function rem_vis($visiIds = false) {
		
		// this function returns an o_dbAccess_visitors
		//
		// each dS_visitor is magnified with following members:
		//
		// ->remoteId (as defined by the synchro_visitors correlators)
		// ->rcolor  (as defined by the sync login correlators setup)
		
		$skeyId = $this->dS_ackey->id;
		
		$swhere = ' skeyId = '.$skeyId;
		$vwhere = ''; if($visiIds) $vwhere = ' AND localId in ('.$visiIds.')';
		
		$this->visis = new C_dbAccess_visitors(); 
		if($visiIds) $this->visis->loadOnId($visiIds);
			else $this->visis->loadOnGroup($this->dS_ackey->accountId);
		
		// now magnify visitors	
		foreach($this->visis->keyed as $vid => $dS_v) { 
			$dS_v->remoteId = 0; 
			$dS_v->rcolor = $this->rem_ccss($dS_v->cssColor); 
		}

		$SQL = 'SELECT localId, remoteId FROM synchro_visitors WHERE '.$swhere.$vwhere.';';
		$q = new Q($SQL); $vidx = $q->idx('localId','remoteId'); $c = $q->hits();
		
		if($c) foreach($vidx as $lid => $rid)
			$this->visis->keyed[$lid]->remoteId = $rid;
		
		usort($this->visis->keyed, Array($this,'sortonlname')); // Array() is a PHP way to find the sort function from this object functions
		return $this->visis;
	}
	
	private function sortoncuein($dS1,$dS2) { if($dS1->cueIn<$dS2->cueIn) return 1; else if($dS1->cueIn>$dS2->cueIn) return -1; else return 0; } 
	public function rem_resa($resaIds = false, $archiveInc = true, $remotePOV = false, $stampSearchIn = false, $days = 1) {
		
		// this function returns an o_dbAccess_reservations
		//
		// each dS_reservation is magnified with following members:
		//
		// ->remoteId (as defined by the synchro_reservations correlators)
		// ->rcolor  (as defined by the sync login correlators setup)
		// ->resources (as defined by the sync login correlators setup)
		// ->visitors (as defined by the synchro_visitors correlators)
		
		$skeyId = $this->dS_ackey->id;
		$accId = $this->dS_ackey->accountId;
		if($stampSearchIn) {
			$stampSearchOut = $stampSearchIn+86400*$days;
		}
		
		$accwhere = ' reservations.groupId = '.$accId;
		$attwhere = ''; if($resaIds) $attwhere = ' AND reservations.id in ('.$resaIds.')';
		$timewhere = ''; if($stampSearchIn) $timewhere = ' AND reservations.cueOut > '.$stampSearchIn.' AND reservations.cueIn < '.$stampSearchOut;
		if($archiveInc) {
			$accwhereA = ' archive_reservations.groupId = '.$accId;
			$attwhereA = ''; if($resaIds) $attwhereA = ' AND archive_reservations.id in ('.$resaIds.')';
			$timewhereA = ''; if($stampSearchIn) $timewhereA = ' AND archive_reservations.cueOut > '.$stampSearchIn.' AND archive_reservations.cueIn < '.$stampSearchOut;
		}
		$this->resas = new C_dbAccess_reservations(); 
		if($resaIds) $this->resas->loadOnId($resaIds);
			else if($stampSearchIn) {
				$this->resas->loadOnTimeSpan($accId, $stampSearchIn, $stampSearchOut, plitems_visible_on_frame, false /*$scope*/, false/*$fulldays*/, false/*$actions*/, false/*$logins*/, false/*$verbose*/);
			}	
				else $this->resas->loadOnGroup($accId);
		
		if($archiveInc) {
			$resasA = new C_dbAccess_reservations('archive_'); 
			if($resaIds) $resasA->loadOnId($resaIds);
				else if($stampSearchIn) {
					$resasA->loadOnTimeSpan($accId, $stampSearchIn, $stampSearchOut, plitems_visible_on_frame, false /*$scope*/, false/*$fulldays*/, false/*$actions*/, false/*$logins*/, false/*$verbose*/);
				}
					else $resasA->loadOnGroup($accId);
			$this->resas->absorb($resasA);
			// unset($resasA);
		}
		
		

		// now magnify reservations and attach their remoteId
		foreach($this->resas->keyed as $vid => $dS_r) { 
			$dS_r->remoteId = 0; 
			$dS_r->resources = ''; 
			$dS_r->visitors = ''; 
			$dS_r->rcolor = $this->rem_ccss($dS_r->cssColor); 
				$no1310 = str_replace(chr(13).chr(10), ' ', $dS_r->note);
				$no10 = str_replace(chr(10), ' ', $no1310);
			$dS_r->note = $no10;
		}		
		
		// lookup account resource attendees
			$join = 'reservations ON reservations.id = attendees.groupId';
		$SQL = 'SELECT attendees.id as id, reservations.id as resaid, resourceId as rscid FROM attendees JOIN '.$join.' WHERE '.$accwhere.$attwhere.$timewhere;
		
		if($archiveInc) {
				$joinA = 'archive_reservations ON archive_reservations.id = archive_attendees.groupId';
			$SQLA = 'SELECT archive_attendees.id as id, archive_reservations.id as resaid, resourceId as rscid FROM archive_attendees JOIN '.$joinA.' WHERE '.$accwhereA.$attwhereA.$timewhereA;
			$SQL = $SQL.' UNION '.$SQLA;
		} 
		
		$q = new Q($SQL.';'); $aridx = $q->tree('resaid','id','rscid'); // attendees matrix
		foreach($aridx as $r => $rids) { // $r is a resa id
			$a = Array();
			foreach($rids as $i => $rid) { $id = $this->rem_rsc($rid); if($id) $a[] = $id; } // $a[] contains the remoteId
			if(count($a)) $m = implode('!',$a); else $m = 0;
			if(!$m) $this->resas->remove($r); // (*1*) do not backup agendas for which no sync correlator is defined
				else $this->resas->keyed[$r]->resources = $m;
		}
		
		// lookup concerned visitors remoteIds
		if($remotePOV) {
				$vwhere = '';
				if($resaIds) {
					$SQL = 'SELECT DISTINCT resourceId as id FROM att_visitors WHERE groupId IN ('.$resaIds.');';
					$q = new Q($SQL); $visiIds = $q->ids();
					$vwhere = ' AND localId in ('.$visiIds.')';
				}
				$swhere = ' skeyId = '.$skeyId;
			$SQL = 'SELECT localId, remoteId FROM synchro_visitors WHERE '.$swhere.$vwhere.';';
			$q = new Q($SQL); $vidx = $q->idx('localId','remoteId'); $c = $q->hits();
		}
		
		// lookup visitors appointed
			$join = 'reservations ON reservations.id = att_visitors.groupId';
		$SQL = 'SELECT att_visitors.id as id, reservations.id as resaid, resourceId as vid FROM att_visitors JOIN '.$join.' WHERE '.$accwhere.$attwhere.$timewhere;
		
		if($archiveInc) {
				$joinA = 'archive_reservations ON archive_reservations.id = archive_att_visitors.groupId';
			$SQLA = 'SELECT archive_att_visitors.id as id, archive_reservations.id as resaid, resourceId as vid FROM archive_att_visitors JOIN '.$joinA.' WHERE '.$accwhereA.$attwhereA.$timewhereA;
			$SQL = $SQL.' UNION '.$SQLA;
		} 
		
		$q = new Q($SQL.';'); $avidx = $q->tree('resaid','id','vid'); $c = $q->hits(); // visitors matrix
		if($c) foreach($avidx as $resaid => $vids) { 
			$a = Array();
			foreach($vids as $id => $vid) { 
				if($remotePOV) { // $a[] should contains the remoteId
					if(isset($vidx[$vid])) $a[] = $vidx[$vid]; 
					else { 
						// if not set, the visitor is not synchronized and we are not able to provide a relevant remote reference on it
						$a[] = 0; 
						$dS_r = $this->resas->keyed[$resaid]; // PHP Notice:  Undefined offset: 33628624 in /var/www/2023-12-17_16:35:40_mobminder_baseline/htdocs/sync3/lib.php on line 343
						$dS_v = new C_dS_visitor($vid);
						$dS_r->note .= ' ('.$dS_v->getFullName().')'; // PHP Notice:  Undefined property: stdClass::$note in /var/www/2023-12-17_16:35:40_mobminder_baseline/htdocs/sync3/lib.php on line 345
					}
				}
				else $a[] = $vid; 
			} 
			$m = implode('!',$a);
			if(isset($this->resas->keyed[$resaid])) // some resas may have been remove in (*1*)
				$this->resas->keyed[$resaid]->visitors = $m;
		}

		// lookup reservations having a remoteId yet
		if($remotePOV) {
				$rwhere = ''; if($resaIds) $vwhere = ' AND localId in ('.$resaIds.')';
			$SQL = 'SELECT localId, remoteId FROM synchro_reservations WHERE '.$swhere.$rwhere.';';
			$q = new Q($SQL); $ridx = $q->idx('localId','remoteId'); $c = $q->hits();
			
			if($c) foreach($ridx as $lid => $rid)
				if(isset($this->resas->keyed[$lid])) // some resas may have been remove in (*1*)
					$this->resas->keyed[$lid]->remoteId = $rid;
		}
		
		usort($this->resas->keyed, Array($this,'sortoncuein')); // Array() is a PHP way to find the sort function from this object functions
		return $this->resas;
	}

}


class C_timezone { // not used yet
	public $shift;
	public $daylightShift;
	public $daylightIn;
	public $daylightOut;
	public function __construct() {	
		$shift = 0;
		$daylightShift = 0;
		$daylightIn = false;
		$daylightOut = false;
	}
	public function getShiftUnixTS($timeStamp) {
		return 0; 
	}
}

class C_section {
	// private $lines;
	private $classname;
	private $linein;
	private $lineout;
	private $headers;
	private $hpositions;
	public function __construct($classname, $lines, $lineIn) {
		$lastline = count($lines)-1;
		$sectionsplit = utf8_encode('#');
		for($lx = $lineIn+1; $lx<=$lastline; ++$lx)
			if(substr($lines[$lx],0,1)==$sectionsplit) break;
		// $this->lines = $lines;
		$this->lineout = $lx-1; // index of the last line of data for this section, that line should be read too
		$this->linein = $lineIn+2; // index of the first line of data for this section
		$this->classname = $classname;
		$this->headers = explode(';',$lines[$lineIn+1]);
		$this->hpositions = array_flip($this->headers);
	}
	public function setremoteid() { // turns id header into remoteId 
		if(isset($this->hpositions['id'])) { // allows to mount a backup from another program, having no id column in the csv
			$hp = $this->hpositions['id'];
			$this->headers[$hp] = 'remoteId';
			unset($this->hpositions['id']); $this->hpositions['remoteId'] = $hp; 
		}
		return $this->headers; 
	}
	public function getclassname() { return $this->classname; }
	public function getheaders() { return $this->headers; }
	public function getlinein() { return $this->linein;	}
	public function getlineout() { return $this->lineout; }
}

class postedfile {
	
	public $dS_account;
	public $email;
	
	public $present;
	public $isempty;
	public $size;
	public $pathnamext;
	public $name;
	public $type;
	public $ext;
	public $dir;
	public $lines;
	public $error;
	
	public $hasRemoteId;
	
	// csv files specific
	public $sections; // when multiple dataset classes, sections is like [C_dS_classA => o_C_section, C_dS_classB => o_C_section]

	
	// functions
	public function __construct($dS_account, $email = '') {
		
		$this->dS_account = $dS_account;
		$this->email = $email;
		
		$this->size 	= 0;
		$this->pathnamext = '';
		$this->name 	= '';
		$this->type 	= '';
		$this->ext 		= '';
		$this->dir 		= '';
		$this->lines 	= Array();
		$this->present 	= false;
		$this->isempty 	= true;
		$this->hasRemoteId = false;
		
		if(count($_FILES)) $this->present = true; else { $this->present = false; return $this; }
		foreach($_FILES as $postname => $filedescritpion) { break; } // we read only one file in this script

		switch ($filedescritpion['error']) {
			case UPLOAD_ERR_OK: break;
			case UPLOAD_ERR_NO_FILE: abort('201','posted file audit::No file received'); break;
			case UPLOAD_ERR_INI_SIZE:
			case UPLOAD_ERR_FORM_SIZE: abort('202','posted file audit::The file size is exceeding limits'); break;
			default: abort('200', 'posted file audit::Unknown upload error');
		}

		// Opening the file
		//
		$this->size 		= $filedescritpion['size']+0;
		$this->pathnamext 	= $filedescritpion['tmp_name'];
		$this->name 	= $filedescritpion['name'];
		$this->type 	= $filedescritpion['type'];
		$this->ext 		= strtolower(pathinfo($this->name, PATHINFO_EXTENSION));
		$this->dir 		= pathinfo($this->pathnamext, PATHINFO_DIRNAME);

		$this->sections = Array();
		$this->sectionsplit = utf8_encode('#');

		msg('FILE RECEIVED - size: '.(int)($this->size/1024).'kB, name: '.$this->name.', ext: '.$this->ext);

		$this->filter_line 		= utf8_encode('/[^#_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÐŒœŠšŸŽž@ A-Za-z0-9\+€&:;,!=\*\?\/\'\"\.\(\)\[\]\-\t\\\\]/'); // '\\\\' is the regexp code for single backslah '\' filtering with preg_replace
		$this->filter_address 	= utf8_encode('/[^_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÐŒœŠšŸŽž\.,a-z A-Z0-9-\'\/\(\)]/');
		$this->filter_name 		= utf8_encode('/[^_ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝßàáâãäåæçèéêëìíîïñòóôõöøùúûüýÿÐŒœŠšŸŽž\'\.a-z A-Z-]/'); 
		// $this->filter_name 		= utf8_encode('/[^ _\x{00C0}-\x{01FF}\'\.a-z A-Z-]/'); // does not compile (??)
		$this->filter_resource 	= utf8_encode('/[^_!\.a-zA-Z0-9-]/');
		$this->filter_email 	= utf8_encode('/[^@\._a-zA-Z0-9-]/');
		$this->filter_stamp 	= utf8_encode('/[^ 0-9-:]/');
		$this->filter_birthday 	= utf8_encode('/[^0-9-: ]/'); // allows ISO8601 time stamp like "1970-12-30 22:45:12"
		$this->filter_phone 	= utf8_encode('/[^0-9\+]/');
		$this->filter_mobile 	= utf8_encode('/[^0-9\+]/');
		$this->filter_zip 		= utf8_encode('/[^a-zA-Z0-9]/');

		$this->filter_substitute 	= utf8_encode('_');
	}
	public function __destruct() {
		if($this->pathnamext) unlink($this->pathnamext);
	}
	
	public function log($l) { msg($l); }
	
	public function remove_utf8_bom($text) {
		$bom = pack('H*','EFBBBF');
		$text = preg_replace("/^$bom/", '', $text);
		return $text;
	}
	
	public function tolines($encoding = false) {
		$lines = &$this->lines; 
		
			if(!$this->present) return $this;
			$handle = fopen($this->pathnamext,'r');
			if(!$handle) return $this;
			
			$c = 0; $bunch = '';
		
		if(!$encoding) {
			while(!feof($handle) && $c++<200)	$bunch .= trim(fgets($handle)); rewind($handle);
			$encoding = mb_detect_encoding($bunch, mb_list_encodings(), true);
			$this->log('Detected file encoding is:'.$encoding);
			// Note about encoding:
			//   Windows .xls and .xlsx files are ISO-8859-1
			//   Flat files generated by Octopus are ASCII
			//   Backups generated by Mobminder are UTF-8
		} else {
			$this->log('You have specified file encoding:'.$encoding);
			if($encoding!='UTF-8' && $encoding!='ISO-8859-1' && $encoding!='ASCII') {
				$encoding ='UTF-8';
				$this->log('Your file encoding specification is not supported, default:'.$encoding.' (it should be one of UTF-8, ISO-8859-1, ASCII)');
			}
		}
		
			// multi lines fields (mlf) are changing the pattern of having one record by line in the csv (*csv*)
			//
			// - Velden met embedded separator moeten quoted zijn. Bv: “tekst met een ; erin”
			// - Velden met embedded double quotes moeten quoted zijn. Bv: ”tekst met ””double”” quotes”. Let op : de embedded quotes moeten verdubbeld worden.
			// - Velden met embedded line breaks moeten quoted zijn. Let op: line break = chr(10), niet backslash n.
			//
			// example:
			// 		id	;resources	;cueIn				;cueOut				;note
			// 		3	;EL			;2015-01-06 10:00	;2015-01-06 11:00	;MME POMEROLE NOTIFIEE
			// 		4	;EL			;2015-01-06 15:00	;2015-01-06 16:00	;M.CONDé
			// 		5	;PE			;2015-11-26 00:00	;2015-11-27 00:00	;"IRTS college coopératif
			// 		JE SUIS EN EXTERIEUR TTE LA JOURNEE
			// 		sur le thème de ""les nouvelles figures de l'intervention sociale""
			// 		organisé par le collège coopératif sur le site de IRTS Salliens."
			// 		6	;EL			;2015-01-07 08:30	;2015-01-07 12:30	;REUNION USAGERS
			// 		7	;EL			;2015-01-13 00:00	;2015-01-14 00:00	;BAYONA Abs
			//
			// item 5 is not following the regular pattern (one line per record)
			// mlf opens when an odd number of '"' is present and they close by the same rule. 
			// Inside an mlf double quotes are simply doubled : '""'
			//
			// see also (*as*) as how escapable characters are handled through DB and client js interface
			//
			$mlf_ongoing = false; $mlf_off = false; $mlf_start = false; $buffer = ''; $c = 0;
			$trim = " \n\r\t\v\0"; if($this->ext=='ics') $trim = " \n\r\v\0"; // ics uses tab chr(9) to indicate multiline variables
			
			
		while(!feof($handle)) {
			
			$line = trim(fgets($handle),$trim); 
			// $line = fgets($handle); 
				if($line=='') continue; // $lines will contains ONLY non blank lines
				if(substr($line,0,2)=='//') continue; // $lines beginning with double // are comments, we ignore them
				
			if($c==0) if($encoding=='UTF-8') $line = $this->remove_utf8_bom($line);
			$mlf_start = false; $mlf_off = false; 
			
			$slimit = false; // mlf do not apply to any file format but .csv
			if($this->ext == 'csv') { $dquotes = substr_count($line, '"'); $slimit = $dquotes%2; } // that is 0 if 0, 2, 4 and 1 if 1, 3, 5 occurences.
			if($slimit) {
				if($mlf_ongoing) $mlf_off = true; // this line finishes an excel string (multiple lines)
				else $mlf_start = true;  // this line opens an excel string (multiple lines)
				$mlf_ongoing = !$mlf_ongoing;
			} 
			$mlf = $mlf_ongoing||$mlf_off;
			
			// ISO treatment
			$utf8 = $line; // default is UTF-8 assumed
			if($this->ext == 'csv') { // see if we need to convert to UTF-8
				$line = preg_replace('/[\x00-\x1F\x7F]/','',$line); // removes special chars (passed by Octopus)
				if($encoding!='UTF-8') $utf8 = iconv('ISO-8859-1', 'UTF-8', $line);
			} 
			$utf8 = preg_replace($this->filter_line,$this->filter_substitute,$utf8); // removes other not alphanum chars
			
			// utf8 treatment
			$utf8 = preg_replace("/\\s\\s+/",' ',$utf8); // reduces multiple spaces into single spaces
			
			if($mlf) {
				if($mlf_off) $utf8 = rtrim($utf8, '\"'); // removes the trailing double quote (or [double quote + ;] if a field follows)
				if($mlf_start) $buffer = $utf8; else $buffer .= '\n'.$utf8; // "\n" replaces the chr(10) in the stream
				if(!$mlf_off) continue; // continues filling buffer up to the exepcted mlf_off line
			} 
			else $buffer = $utf8; // non mlf case
			
			if($c++<10) $this->log(chr(9).'line '.$c.' >'.$buffer);
			$lines[] = $buffer; unset($buffer); $buffer = '';
		}
		fclose($handle);
		if(count($lines)) $this->isempty = false; else $this->isempty = true;
		return $this;
	}
	public function read_appointments() { // returns an Array of C_dS_reservation
		$a = [];
		switch($this->ext) {
			case 'csv': $a = $this->csv_toAppointments(); break;
			case 'ics': $a = $this->ics_toAppointments(); break;
			default:
				$this->abort('203', 'posted file audit::File extension not supported');
		}
		return $a;
	}	
	public function read_visitors() { // returns an Array of C_dS_reservation
		$v = [];
		switch($this->ext) {
			case 'csv': $v = $this->csv_toVisitors(); break;
			case 'vcf': $v = $this->vcf_toVisitors(); break;
			default:
				$this->abort('204', 'posted file audit::File extension not supported');
		}
		return $v;
	}
	
	
	///////////////////////
	//
	// private functions
	//
	private function abort($errorcode, $errormsg) {
		
		$email = $this->email;
		if($email) {
			$title = 'Mobminder - Sync problem - account'.$this->dS_account->name;
			$text = 'A sync transaction has been stopped - error Code:'.$errorcode.'. Error:'.$errormsg;
			$from = 'Mobminder sync API <no-reply@app01.mobminder.com>';
			
			$o_dataCom_mail = new C_dataCom_mail();
			$o_dataCom_mail->sendMail($title, $text, $email, $from, 0);
		}
		
		$msg = '##'.$errorcode.'##'.'error: '.$errormsg.chr(10);
		die($msg);
	}
	
	///////////////////////
	//
	// .ics treatment
	//
	private function tilt($m, $slicing) { // $m are minutes i, s tring format, like '15'
		
		if($m!='00') if($m!='10') if($m!='20') if($m!='30') if($m!='40') if($m!='50')
		if($m!='05') if($m!='15') if($m!='25') if($m!='35') if($m!='45') if($m!='55') {
			switch($m) {
				case '01': case '02': $m = '00'; break;
				case '03': case '04': case '06': case '07': $m = '05'; break;
				case '08': case '09': case '11': case '12': $m = '10'; break;
				case '13': case '14': case '16': case '17': $m = '15'; break;
				case '18': case '19': case '21': case '22': $m = '20'; break;
				case '23': case '24': case '26': case '27': $m = '25'; break;
				case '28': case '29': case '31': case '32': $m = '30'; break;
				case '33': case '34': case '36': case '37': $m = '35'; break;
				case '38': case '39': case '41': case '42': $m = '40'; break;
				case '43': case '44': case '46': case '47': $m = '45'; break;
				case '48': case '49': case '51': case '52': $m = '50'; break;
				case '53': case '54': case '56': case '57': $m = '55'; break;
				case '58': case '59': $m = '60'; break;
				
			}
		}
		if($slicing == 12) return $m;
		if($slicing == 6 || $slicing == 2 || $slicing == 1 || $slicing == 3) {
			if($m=='05') $m = '00';
			if($m=='15') $m = '10';
			if($m=='25') $m = '20';
			if($m=='35') $m = '30';
			if($m=='45') $m = '40';
			if($m=='55') $m = '50';			
			if($slicing == 6) return $m;
		}
		if($slicing == 4) { // m enters as [00,05,10,15,20,25,30,35,40,45,50,55,60]
			if($m=='05') $m = '00';
				if($m=='10') $m = '15';
				if($m=='20') $m = '15';
			if($m=='25') $m = '30';
			if($m=='35') $m = '30';
				if($m=='40') $m = '45';
				if($m=='50') $m = '45';
			if($m=='55') $m = '60';
			return $m;
		}
		if($slicing == 3) {  // m enters as [00,10,20,30,40,50,60]
			if($m=='10') $m = '00';
			if($m=='30') $m = '20';
			if($m=='50') $m = '40';
			return $m;
		}
		if($slicing == 2) { // m enters as [00,10,20,30,40,50,60]
			if($m=='10') $m = '00';
			if($m=='20') $m = '30';
			if($m=='40') $m = '30';
			if($m=='50') $m = '60';
			return $m;
		}
		if($slicing == 1) { // m enters as [00,10,20,30,40,50,60]
			if($m=='10') $m = '00';
			if($m=='20') $m = '00';
			if($m=='30') $m = '00';
			if($m=='40') $m = '60';
			if($m=='50') $m = '60';
		}
		return $m;
	}
	private function utc($icsformat, $timeSlice, $tzone) { // ics format is like 20130807T214500 or 20130807
		
		//             01234567890123456
		//             |   | |  | |  
		// time format 20130807T214500
		//
		$y = substr($icsformat,0, 4);
		$o = substr($icsformat,4, 2);
		$d = substr($icsformat,6, 2);
		
		$isDateAndTime = true;
		$h = substr($icsformat,9, 2); if($h=='') { $isDateAndTime = false; $h='00'; }
		$m = substr($icsformat,11, 2); if($m=='') $m='00';
		$s = substr($icsformat,13, 2); if($s=='') $s='00';
		
		if($s!='00') return false;
		$m = $this->tilt($m, $timeSlice);
		$format = $y.'-'.$o.'-'.$d.' '.$h.':'.$m.':'.$s;
		
		$relativeToZone = substr($icsformat,-1)=='Z'; // like 20210712T152530Z, zoneless time format refers to GMT universal time
		
		if($isDateAndTime)
			if($relativeToZone) date_default_timezone_set('GMT'); // force encoding time GMT relative in this case
			
		$datetime = new C_date($format); 
		
		if($isDateAndTime)
			if($relativeToZone) date_default_timezone_set($tzone); // read time relative to ics file specified time zone
		
		$stamp =  $datetime->get_ISO8601_stamp();
		
		return $stamp;
	}
	private function after($line, $after) {
		$ap = strpos($line,$after); if($ap===false) return $line;
		$al = strlen($after);
		// $ll = strlen($line);
		$left = substr($line, $ap+$al);
		return $left;
	}
	private function readICSdate($line, $tag) {
		$icstime = '';
		if(strpos($line, $tag.';VALUE=DATE')!==false) $icstime = $this->after($line, $tag.';VALUE=DATE:'); 
			else if(strpos($line, $tag.';TZID=')!==false) $icstime = $this->after($line, ':');
				else if(strpos($line, $tag.':')!==false) $icstime = $this->after($line, $tag.':'); 
	// $this->log($line.' -- '.$icstime);
		return $icstime;
	}
	
		private function lookup_rscId() {
			
			$rscId = false;
			foreach($this->lines as $x => $line) {
				if($x > 200) break; // we expect to find this information in the first 200 lines
				if(strpos($line,'X-WR-CALNAME')===0) {
					$rscId = $this->getvalue($line);
				}
			}
			
			if(!$rscId) $this->abort('212', 'ics conversion::No calendar name is specified that we can match to a rscId');
			$this->log('|X-WR-CALNAME| = '.($rscId?$rscId:'NOT FOUND'));
			return $rscId;
		}
		private function lookup_timezone() {
			
			$tz='Europe/Brussels';
			foreach($this->lines as $x => $line) {
				if($x > 200) break; // we expect to find this information in the first 200 lines
				if(strpos($line,'X-WR-TIMEZONE')===0) {
					$tz = $this->getvalue($line);
				}
			}
			$this->log('|X-WR-TIMEZONE| = '.$tz);
			return $tz;
		}
		private function getvalue($line) {
			$split = explode(':',$line); $sc = count($split);
			if($sc==2) { $v = $split[1]; return $v; }
			if($sc>2) { // some particular cases might occur here
				$drop = 1;
				$d = strpos($line,'DESCRIPTION:')===0; $s = strpos($line,'SUMMARY:')===0;
				if($s) if(strpos($line,'SUMMARY:LANGUAGE')===0) { $drop = 2; } // colon in the variable name, thank you Microsoft Outlook SUMMARY:LANGUAGE=en-us: // sometimes a ;  :D
				
				// if($d || $s) { // free text fields might contain colon (not escaped)
				$v = '';
				foreach($split as $x => $p)
					if($x < $drop) continue; // member name
					else $v .= ':'.$p; 
				return $v;
			}
		}
		private function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds

	private function ics_toAppointments() { // returns an array of $o_dS_reservations ( > 2021 version PVH, process multiline variables )
	
		
		$rscId = $this->lookup_rscId(); // defaults to unique resourceid for single account, false in case of multi agenda if not mentionned in the ics file ( X-WR-CALNAME:thename ), thename should match a resource correlator in the sync login used
		$tz = $this->lookup_timezone(); // defaults to Europe/Brussels
	
		$lines = Array(); // contain final result after filtering and cleaning up
		$veblock = Array();
		$vevents = Array();
		$lcount = 0; $skipcount = 0; $multilines = 0;  $veventcount = 0; $veventskip = 0; 
		$member = false; $vevent = false; $skip = 0; $vskip = false;
		$cuein = microtime(true);
	
		foreach($this->lines as $line) { // let's start with a clean up and splitting the VEVENTs
	
			$newmember = false;
			$skip = 0;
			
			$chr9 = substr($line,0,1)=== chr(9);
			if(!$chr9) { // here starts a new member
				$x = explode(':',$line);
				$member = $x[0];
				$newmember = true;
			} else {
				// $this->log('|||||||||||||||||| Multiline: '.$line);
			} // the member stays what it was from the previous line(s)
			
			if($newmember) {
				
				if(strpos($line,'BEGIN:VEVENT')===0) { $vevent = true; $velines = Array(); }
				if(strpos($line,'END:VEVENT')===0) { 
					if(!$vskip) {
						// $velines[] = $line;
						foreach($velines as $l) $lines[] = $l; // pass that buffer into the final filtered array of line
						
						$veblock[$veventcount] = $velines; $veblock[$veventcount][] = $line;
						$veventcount++;
					} else $veventskip++;
					
					$vevent = false; $vskip = false;
				}
				
				if($vevent){ // inside a VEVENT section
					if(strpos($line,'DTEND')===0) { // end time of event specification
						$x = explode(':',$line); $ln = count($x); $date = $x[--$ln]; $year = substr($date,0,4);
						if($year<2016) $vskip = true;
					}
				}
				
				if($vskip) continue; // do not waste time scanning lines while the full vevent should be skipped
				
				// remove any MS or MS Outlook bullshit private standard
				if(strpos($line,'X-MICROSOFT')===0) $skip = 1;
				if(strpos($line,'X-MS-OLK')===0) $skip = 1;
				if(strpos($line,'CLASS:')===0) $skip = 1;
				if(strpos($line,'PRIORITY:')===0) $skip = 1;
				if(strpos($line,'SEQUENCE:')===0) $skip = 1;
				if(strpos($line,'CATEGORIES:')===0) $skip = 1;
				if(strpos($line,'TRANSP:')===0) $skip = 1;
				
				if(strpos($line,'X-ALT-DESC;FMTTYPE=text/html:')===0) $skip = 1;
				if(strpos($line,'UID:')===0) $skip = 1;
				
				
			} else { // crossing multi lines member
			
				if($member == 'X-ALT-DESC;FMTTYPE=text/html') $skip = 1;
				if($member == 'UID') $skip = 1;
				if(!$skip) $multilines++;
				
			}
			if($skip) { $skipcount++; continue; }
			$lcount++;
			// $utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // converted to utf8
			
			if($vevent) $velines[] = $line;
				else $lines[] = $line;
		
		} // finished with clean up and splitting the VEVENTs
		
			$cueout = microtime(true);
			$cuedelta = $this->deltasec($cuein,$cueout);	
	
		$this->log('Lines: '.$lcount.' valid lines, multilines '.$multilines.', skipped '.$skipcount.' lines.');
		$this->log('Vevents: '.$veventcount.' valid events, skipped '.$veventskip.' events (occur before 2016).');
	
			
		foreach($veblock as $x => $v) { // each event
			$merged = Array(); // multilines are merged in this instance
			$cl = 0;
			foreach($v as $i => $l) {
				if($l=='END:VEVENT') continue;
				if($l=='BEGIN:VEVENT') continue;
				$chr9 = substr($l,0,1)=== chr(9);
				if($chr9) $merged[$cl-1] = $merged[$cl-1].trim($l,"\t");
					else $merged[$cl++] = $l;
			}
			$veblock[$x] = $merged;
		}
		
		foreach($veblock as $x => $v) { // VEVENT blocks are ready here and we display a bunch of them
			if($x>10) break;
			foreach($v as $i => $l) {
				$chr9 = substr($l,0,1)=== chr(9);
				if(!$chr9) $this->log('<b>'.$x.'</b> '.$i.') '.$l.'');
					else $this->log('<b>ML -------------- </b> '.$l.''); // those are all merged and should never appear on display
			}
		}
		
		
		
		$slicing = $this->dS_account->timeSlice;
		C_date::setTimeParameters($this->dS_account);
		$resas = array();
		$rcount = 0; $skipcount = 0;
		
		foreach($veblock as $x => $v) { // reading VEVENT blocks
			$dS_r = new C_dS_reservation();	
			$dS_r->resources = $rscId; // value set at point (*SR*) treated lower in the code but sooner in file execution
			$skip = false;
			$inVALARM = false;
			foreach($v as $i => $line) {
				if(strpos($line,'DTEND')===0) {
					$icstime = $this->getvalue($line);
					$stamp = $this->utc($icstime, $slicing, $tz);
					if($stamp === false) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueOut has a wrong time granularity:'.$icstime.')'); $skip = true; };
					$dS_r->cueOut = $stamp;
				}
				if(strpos($line,'DTSTART')!==false) {
					$icstime = $this->getvalue($line);
					$stamp = $this->utc($icstime, $slicing, $tz);
					if($stamp === false) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueIn has a wrong time granularity:'.$icstime.')'); $skip = true; };
					$dS_r->cueIn = $stamp;
				}
				if(strpos($line,'SUMMARY')===0) 
					if(!$dS_r->note) $dS_r->note = $this->getvalue($line); 
						else $dS_r->note = $this->getvalue($line).'\n'.$dS_r->note; // keep the summary as first line.
				
				if($line=='END:VALARM') { $inVALARM = false; continue; }// we are leaving a calendar event tag
				if($line=='BEGIN:VALARM') { $inVALARM = true; continue; }
				if(!$inVALARM) { // so not to catch the Description of the VALARM
					if(strpos($line,'DESCRIPTION')===0) 
						if(!$dS_r->note) $dS_r->note = $this->getvalue($line); 
							else $dS_r->note .= '\n'.$this->getvalue($line); // keep the description after the summary (There is no formal sequence order for DESCRIPTION and SUMMARY in the ics flow)
				}
			}
			
			if(!$skip) { 
				if($rcount<21) {
					$this->log('resa '.$rcount.', '.$dS_r->cueIn.' to '.$dS_r->cueOut.', note:'.$dS_r->note);
				}
					$in = new C_date($dS_r->cueIn); $dS_r->cueIn = $in->getTstmp();
					$out = new C_date($dS_r->cueOut); $dS_r->cueOut = $out->getTstmp();
				if($dS_r->cueOut<$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is before cue in)'); continue; }; 
				if($dS_r->cueOut==$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is equal to cue in)'); continue; }; 					
				if($dS_r->cueIn<=1451606400){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment occured before 2016)'); continue; }; 					
				$resas[] = $dS_r; $rcount++; 
			}
		}
		
		return $resas;
		
	}
	private function prev_ics_toAppointments() { // returns an array of $o_dS_reservations ( < 2021 version PVH )

		$rscId = false; // remote resource Id
		$tz = false; // timezone
		
		// scanning lines
		//
		$lcount = 0; $rcount = 0; $skipcount = 0; $skip = false;
		$table = array(); $dS_r = false;
		
		$inVEVENT = false; $inVALARM = false; $inTIMEZONE = false;  $inTZ_DAYLIGHT = false;  $inTZ_STANDARD = false; 
		$slicing = $this->dS_account->timeSlice;
		
		C_date::setTimeParameters($this->dS_account);
		
		foreach($this->lines as $line) {
			$lcount++;
			
			///////// CALENDAR NAME
			//
			if(!$rscId) { // then we need to find one before any other scan be usefull
				if(strpos($line,'X-WR-CALNAME:')!==false) {
					$rscId = $this->after($line, 'X-WR-CALNAME:'); // (*SR*)
					continue;
				}
			}
			if(!$tz) { // then we need to find one before any other scan be usefull
				if(strpos($line,'X-WR-TIMEZONE:')!==false) {
					$tz = $this->after($line, 'X-WR-TIMEZONE:'); // e.g. X-WR-TIMEZONE:Europe/Brussels
					$this->log('Timezone: '.$tz);
					continue;
				}
			}
			
			///////// VIRTUAL TIME ZONE 
			//
			if(0) // not used yet
			if(!$tz) {
				if($line=='END:VTIMEZONE') { 
					$inTIMEZONE = false; 
					$tz = true;
					continue;
				}
				if($line=='BEGIN:VTIMEZONE') {
					$inTIMEZONE = true;
					$tz = new C_timezone();
					continue;
				}
				if($inTIMEZONE) {
					
					if($line=='END:DAYLIGHT') { 
						$inTZ_DAYLIGHT = false; 
						continue;
					}
					if($line=='BEGIN:DAYLIGHT') {
						$inTZ_DAYLIGHT = true;
						continue;
					}
					if($inTZ_DAYLIGHT) {
						
						continue;
					}
					
					if($line=='END:STANDARD') { 
						$inTZ_STANDARD = false; 
						continue;
					}
					if($line=='BEGIN:STANDARD') {
						$inTZ_STANDARD = true;
						continue;
					}
					if($inTZ_STANDARD) {
						
						continue;
					}
					
					continue;
				}
			}
			
			// if(!$rscId || !$tz) continue; // looking up events makes no sense if you do not know the time zone and resource Id
			if(!$rscId) continue; // looking up events makes no sense if you do not know the time zone and resource Id
			
			
			///////// EVENTS
			//
			if($line=='END:VEVENT') { // we are leaving a calendar event tag
				$inVEVENT = false; $inVALARM = false;
				if(!$skip) { 
					if($rcount<21) {
						$this->log('resa '.$rcount.', '.$dS_r->cueIn.' to '.$dS_r->cueOut.', note:'.$dS_r->note);
					}
						$in = new C_date($dS_r->cueIn); $dS_r->cueIn = $in->getTstmp();
						$out = new C_date($dS_r->cueOut); $dS_r->cueOut = $out->getTstmp();
					if($dS_r->cueOut<$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is before cue in)'); continue; }; 
					if($dS_r->cueOut==$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is equal to cue in)'); continue; }; 					
					if($dS_r->cueIn<=1451606400){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment occured before 2016)'); continue; }; 					
					$table[] = $dS_r; $rcount++;
				}
				unset($dS_r);
				continue;
			}
			if($line=='BEGIN:VEVENT') { // we are leaving a calendar event tag
				$inVEVENT = true;
				$dS_r = new C_dS_reservation();	
					$dS_r->resources = $rscId; // value set at point (*SR*) treated lower in the code but sooner in file execution
				$skip = false;
				continue;
			}
			if($inVEVENT) {
				if(strpos($line,'DTEND')!==false) {
					$icstime = $this->readICSdate($line, 'DTEND');
					$stamp = $this->utc($icstime, $slicing, $tz);
					if($stamp === false) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueOut has a wrong time granularity:'.$icstime.')'); $skip = true; };
					$dS_r->cueOut = $stamp;
				}
				if(strpos($line,'DTSTART')!==false) {
					$icstime = $this->readICSdate($line, 'DTSTART');
					$stamp = $this->utc($icstime, $slicing, $tz);
					if($stamp === false) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueIn has a wrong time granularity:'.$icstime.')'); $skip = true; };
					$dS_r->cueIn = $stamp;
				}
				if(strpos($line,'SUMMARY:')!==false) $dS_r->note = $this->after($line, 'SUMMARY:');
				if(strpos($line,'SUMMARY:LANGUAGE=fr-be:')!==false) $dS_r->note = $this->after($line, 'SUMMARY:LANGUAGE=fr-be:'); // Thank you Microsoft Outlook
				if(strpos($line,'SUMMARY:LANGUAGE=en-us:')!==false) $dS_r->note = $this->after($line, 'SUMMARY:LANGUAGE=en-us:'); // Thank you Microsoft Outlook // sometimes a :
				if(strpos($line,'SUMMARY;LANGUAGE=fr-be:')!==false) $dS_r->note = $this->after($line, 'SUMMARY;LANGUAGE=fr-be:'); // Thank you Microsoft Outlook
				if(strpos($line,'SUMMARY;LANGUAGE=en-us:')!==false) $dS_r->note = $this->after($line, 'SUMMARY;LANGUAGE=en-us:'); // Thank you Microsoft Outlook // sometimes a ;  :D
				
				if($line=='END:VALARM') { $inVALARM = false; continue; }// we are leaving a calendar event tag
				if($line=='BEGIN:VALARM') { $inVALARM = true; continue; }
				if(!$inVALARM) { // so not to catch the Description of the VALARM
					if(strpos($line,'DESCRIPTION:')!==false) $dS_r->note = $this->after($line, 'DESCRIPTION:');
				}
			}
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort('210', 'ics conversion::No valid lines could be read from the file');
		if(!$tz) $this->abort('211', 'ics conversion::No valid time zone was found in the file');
		if(!$rscId) $this->abort('212', 'ics conversion::No calendar name is specified that we can match to a rscId');
		$this->log($lcount.' valid lines have been read');
		$this->log($rcount.' valid reservations have been extracted');
		return $table;
	}
	
	///////////////////////
	//
	// .vcf treatment
	//
	private function vcf_toVisitors() { // returns an array of $o_dS_reservations

		
		// scanning lines
		//
		$lcount = 0; $vcount = 0; $skipcount = 0; $skip = false;
		$v = array(); $dS_v = false;
		$lineIn = 0; $lineOut = 0; $lineCount = 0;
		
		$inVCARD = false;
		
		
		foreach($this->lines as $line) {
			$lcount++;
			
			///////// EVENTS
			//
			if($line=='END:VCARD') { // we are leaving a virtual card tag
				$inVCARD = false; 
				
				if(!$skip) { 
					
					$dS_v->mobile = preg_replace($this->filter_mobile,'',$dS_v->mobile);
					$dS_v->mobile = checkMobileFormat($dS_v->mobile, $this->dS_account->phoneRegion);
					$dS_v->phone = preg_replace($this->filter_phone,'',$dS_v->phone);
						
					$nomobile = !$dS_v->mobile;
					$nophone = !$dS_v->phone;
					$noemail = !$dS_v->email;
					if($nomobile&&$nophone&&$noemail) {
						
						// we do not upload contacts having no comuunication mean
						
					} else {
						
						$v[] = $dS_v; $vcount++; 
						if($vcount<201) {
							$this->log('visitor '.$vcount.', '.$dS_v->firstname.'|'.$dS_v->lastname.', mobile:'.$dS_v->mobile.', phone:'.$dS_v->phone.', email:'.$dS_v->email);
						}
					}
				}
				unset($dS_v);
				$lineIn = 0; $lineOut = $lcount; $lineCount = 0;
				continue;
			}
			if($line=='BEGIN:VCARD') { // we are entering a virtual card tag
				$inVCARD = true;
				$dS_v = new C_dS_visitor();
				$skip = false;
				$lineIn = $lcount; $lineCount = 0;
				// if($vcount<201) { $this->log('VCARD at line '.$lcount);	}
				continue;
			}
			if($inVCARD) {
				if($lineCount++ > 20) $this->log('Abnormal VCARD length ('.$lineCount.') at line '.$lcount);

				if(strpos($line,'TEL;')!==false) { 
					
					if(strpos($line,'CELL:')!==false) {
						if(!$dS_v->mobile) $dS_v->mobile = $this->after($line, 'CELL:');
						else if(!$dS_v->phone) $dS_v->phone = $this->after($line, 'CELL:');
					}
					if(strpos($line,'CELL;PREF:')!==false) $dS_v->mobile = $this->after($line, 'CELL;PREF:');
					if(strpos($line,'HOME:')!==false) $dS_v->phone = $this->after($line, 'HOME:');
					if(strpos($line,'WORK:')!==false) $dS_v->note = $this->after($line, 'WORK:');
					
				}
				if(strpos($line,'EMAIL')===0) { 
					
					if(strpos($line,'EMAIL:')!==false) $dS_v->email = $this->after($line, 'EMAIL:');
					if(strpos($line,'EMAIL;WORK:')!==false) $dS_v->email = $this->after($line, 'EMAIL;WORK:');
					if(strpos($line,'EMAIL;HOME:')!==false) $dS_v->email = $this->after($line, 'EMAIL;HOME:');
					
				}
				if(strpos($line,'N:')===0) {
					
					$s = $this->after($line, 'N:'); 
					// $l = strlen($s);
					// if(substr($s,0,1)==';') $s = substr($s,-($l-1)); $l = strlen($s);
					$p = explode(';', $s); 
					
					if(count($p)==1) {
						
						$firstname = $p[0];
						$lastname = $p[0];
						
					} else {
					
						$gender = $p[0]; $first = $p[1]; $last = $p[2]; $title = $p[3];
						// if($vcount<201) { $this->log('line '.$s.', gender:'.$gender.', first:'.$first.', first:'.$last);	}
						
						$combo = ''; $lastname = ''; $firstname = '';
						if($gender=='') {
							if($last=='') $combo = $first; // e.g.  N:;Khalatyan Tigran;;;   or   N:;Lamri;;;
							else { $lastname = $last; $firstname = $first; }
						} else {
							
							if(!$first && !$last) $combo = $gender; // N:germay;;;;
							else {
								if(!$last) { // N:Meryam;Khale;;;
									$lastname = $first; $firstname = $gender;
									
								} else { // N:Soeur;Lamqami;Naima;;
									$lastname = $last; $firstname = $first;
								}
							}
							
						}
						
						// arrived here we have $combo OR ( $lastname + $firstname )
						if($combo) {
							if(strpos($combo,' ')!==false) { // N:;Khalatyan Tigran;;;
								$combox = explode(' ',$combo);
								$firstname = $combox[0]; // assumes firstname is heading
								$lastname = $combox[1];
								if(isset($combox[2])) $lastname .= ' '.$combox[2];
								if(isset($combox[3])) $lastname .= ' '.$combox[3];
							} else { // N:;Lamri;;;
								$firstname = $combo;
								$lastname = $combo;
							}
							
						} else {
							
							// it is ready
						}
						
					}
						
					$dS_v->firstname = $firstname;
					$dS_v->lastname = $lastname;
					if(!$firstname && !$lastname) $skip = true;
				}
			}
			
			
		} 	// foreach($this->lines as $line)
		
		$lcount -= $skipcount;
		if(!$lcount) $this->abort('210', 'vcf conversion::No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		$this->log($vcount.' valid visitors have been extracted');
		return $v;
	}

	///////////////////////
	//
	// .csv treatment
	//
	public function csv_splitsections() {
		
		if($this->present == false) abort('220', 'splitsections::No file was posted');
		if(count($this->lines)==0) abort('221', 'splitsections::The file is empty');
		if(count($this->lines)==1) { $this->isempty = true; return false; }; // only the header row
		
		$line1 = $this->lines[0];
		if($line1=='') abort('222', 'splitsections::The header line is empty');
		
		if(substr($line1,0,1)!=$this->sectionsplit) abort('223', 'splitsections::There is no section starting at line 1');
		
		foreach($this->lines as $lc => $line) {
			if(substr($line,0,6)==$this->sectionsplit.'C_dS_') {
				$l = strlen($line); $classname = substr($line,-($l-1));
				$this->sections[$classname] = new C_section($classname, $this->lines, $lc);
				$s = $this->sections[$classname];
				msg(chr(9).'section name:<b>'.$s->getclassname().'</b>');
				msg(chr(9).'- headers: ['.implode(', ',$s->getheaders()).']');
				msg(chr(9).'- linein: |'.substr($this->lines[$s->getlinein()],0,50).'|');
				msg(chr(9).'- lineout: |'.substr($this->lines[$s->getlineout()],0,50).'|');
			}
		}
		

		return $this->sections;
	}
	private function csv_getheaders($classname = false, $section = false) {
		
		if($this->present == false) abort('230', 'headers processing::No file was posted');
		if(count($this->lines)==0) abort('231', 'headers processing::The file is empty');
		if(count($this->lines)==1) { $this->isempty = true; return false; }; // only the header row
		
		$line1 = $this->lines[0];
		if($line1=='') abort('232', 'csv headers processing::The header line is empty');
		$headers = explode(';',$line1);
		
		return $headers;
	}
	private function localid_from_remoteid($skeyId, $remoteId, $syncclass, $callingfunction) { 
	
		// $syncclass must be 'visitors' or 'reservations'
		
		if(!is_numeric($remoteId)) abort('256', 'csv processing ('.$syncclass.') ::remoteId must be a numeric, you sent:'.$remoteId);
		$remoteId = intval($remoteId); if(!is_int($remoteId)) abort('257', 'csv processing ('.$syncclass.') ::remoteId must be an integer, you sent:'.$remoteId);
		
		$sql = 'SELECT localId as id, id as sequence FROM synchro_'.$syncclass.' WHERE skeyId = '.$skeyId.' AND remoteId = '.$remoteId.' order by sequence desc;';
		$q = new Q($sql);
		$cnt = $q->cnt(); 
		if($cnt==1) { // this is what should be the usual case: the provided remoteId links to one and only localId
			return $localid = $q->ids();
		}
		if($cnt==0) { // the provided remoteId does not link to a known localId
			// keep existingId = 0; this will trigger creation of a new item
			// the sync reference will be created here (*uv01*) for visitors
			return 0;
		}
		if($cnt>1) { // the provided remoteId links to many localId's, drop an exception and keep the newest one
				$msg =   $syncclass.' remoteId '.$remoteId.' matches multiple local ids: '.$q->ids();
			C_dS_exception::put('sync3/lib.php postedfile' /*class*/, $callingfunction, $msg, $this->dS_account->id);
			$this->log(chr(9).'Warning: '.$msg);
			$ids = $q->ids(list_as_array); 
			return $localid = $ids[0]; // will be the latest created as we order by sequence desc in the above sql
		}
		return 0; // you never reach here
	}
	
	public function csv_toVisitors($skeyId = false, $section = false) { // leaving skeyId to false forces creation of all new dataSets
	
		// This is the list of fields that are shared on the interface
		//
		// 'id','remoteId'
		// ,'birthday','gender','lastname','firstname','mobile','phone','address','zipCode','city','country','email'
		// ,'note','rcolor','company','residence','language','reference','registration'
		// ,'created','changed','deleted','mergedTo'
		//
	
		if($section) $headers = $section->getheaders();
			else $headers = $this->csv_getheaders();
		if(!$headers) return Array();
		
		$headersindex = Array();
		foreach($headers as $hcount => $header) $headersindex[$header] = $hcount;
		if(in_array('remoteId',$headers)) $this->hasRemoteId = true;
		$hasMerge = false; if(in_array('mergedTo',$headers)) $hasMerge = true;
		
		// checking headers
		//
		$this->log(chr(9).'remoteId is in headers:'.($this->hasRemoteId?'YES':'NO'));
		
		C_dS_visitor::$defaults['language'] = $this->dS_account->language;
		$dS_v = new C_dS_visitor(); 
			$o_dS_defaults = $dS_v->getDefaults();
			$o_dS_defaults['created'] = ''; // are automatically updated by the dSsave() and dSobsolete() functions
			$o_dS_defaults['changed'] = '';
			$o_dS_defaults['deleted'] = '';
			$o_dS_defaults['lastname'] = utf8_encode('LASTNAME?');
			$o_dS_defaults['firstname'] = utf8_encode('FIRSTNAME?');
			if($this->hasRemoteId) $o_dS_defaults['remoteId'] = 0; // add the synchro field, note that when remoteId is present, any reference to an item is considered to be remoteId (e.g. mergedTo)
			$o_dS_defaults['rcolor'] = 0; // add the remote color field
		
		foreach($headers as $hcount => $header) // compares headers in the csv with expected header found in class definition (o_dS_defaults)
			if(!array_key_exists($header,$o_dS_defaults))				
				$this->abort('241','csv visitors headers processing::The following header has no correspondence in the expected fields list: '.$header);
		
		if(!in_array('gender',$headers)&&in_array('firstname',$headers)) { // you specified firstnames but do no associate genders
			C_dS_visitor::$defaults['gender'] = false; // (*vg01*) // this will apply only to new items as we modify here the default gender for new items of C_dS_visitor
			$this->log('Missing header: gender. Genders will be deduced from statistics.'); 
		}

		// defining sections
		//
			$lcount = 1; $skipcount = 1; $v = Array();
			$linein = 1; $lineout = count($this->lines)-1;
			if($section) { $linein = $section->getlinein(); $lineout = $section->getlineout(); }
		$this->log('Found '.$hcount.' valid column headers in line '.$linein);
		
		// scanning lines
		//
		function vnormal(&$item, $index) { // check (*n01*)
			if(isset($item)) { 
				$item = trim($item); 
				$item = str_replace('"', '\'', $item);
			}
			else $item='';
		};
		function vfilter($item, $key, $that, $linenumber) { // check (*n02*)
			if($item=='NULL') $item = ''; // nice joke from ATX DB extracts
			switch($key) {
				case 'address':
				case 'city': 
				case 'country': 
					$item = preg_replace($that->filter_address,'',$item);
					return $item; break;
					
				case 'mobile':
					return preg_replace($that->filter_mobile,'',$item); break;
					
				case 'phone': 
					return preg_replace($that->filter_phone,'',$item); break;
				case 'zipCode': 
					$item = preg_replace($that->filter_zip,'',$item);
					return $item; break;
					
				case 'lastname':
					$item = preg_replace($that->filter_name,'#',$item);
					if(!$item) {
						$that->log(chr(9).'WARNING line: '.$linenumber.' (lastname is empty), replacing with LASTNAME?');
						$item = utf8_encode('LASTNAME?');
					}
					return $item; break;
					
				case 'firstname': 
					$item = preg_replace($that->filter_name,'#',$item);
					if(!$item) {
						$that->log(chr(9).'WARNING line: '.$linenumber.' (firstname is empty), replacing with FIRSTNAME?');
						$item = utf8_encode('FIRSTNAME?');
					}
					return $item; break;
					
				case 'birthday': 
					$item = preg_replace($that->filter_birthday,'',$item);
					if(!is_numeric($item)) { // $that->log(chr(9).'found a non numeric birthday:'.$item);
						$i = (string) $item; 
						if(strlen($item)>=10) if($item[4]=='-'&$item[7]=='-') $item = substr($item,0,4).substr($item,5,2).substr($item,8,2);
						// $that->log(chr(9).'found a non numeric birthday:'.$i.' became '.$item);
					}
					if($item=='19010101' || $item=='') return '0'; else return $item;
					break;
					
				case 'gender': // you have specified a gender in your csv headers
					if($item==='') $item = false; // (*vg01*) forces automatic setting if the value is empty
					return $item;
					break;
				
				default:
					return $item;
			}
		};
		
		for($lx = $linein; $lx<=$lineout; $lx++, $lcount++) { // scan each data line in the file
		
			$line = $this->lines[$lx]; if(!$line) continue; // ignore empty lines
			
				$split = str_getcsv($line,';' /*delimiter*/,'"' /*enclosure*/);
			if(count($split) != ($hcount+1)) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; }; 
			array_walk($split,'vnormal');  // normal is the function defined here: (*n01*)
			
			// If the visitors file arrived with remoteId, it is a sync update or a backup restore. 
			// When init from scratch, there is no remoteId field and visitors are created for the complete file.
			
			$existingId = 0;
			if($skeyId && $this->hasRemoteId) {
				$existingId = $this->localid_from_remoteid($skeyId, $split[$headersindex['remoteId']], 'visitors', __METHOD__.'(remoteId)');
				
				if($hasMerge) {
					$remoteMergedToId = $split[$headersindex['mergedTo']];
					if($remoteMergedToId) { // place the localId in this field instead to the remoteId
						$localToBeMerged = $this->localid_from_remoteid($skeyId, $remoteMergedToId, 'visitors', __METHOD__.'(mergedTo)');
						if($localToBeMerged)
							$split[$headersindex['mergedTo']] = $localToBeMerged;
						else {
							$this->log('Merge: You specified a remoteId target ('.$remoteMergedToId.') that is unknown at mobminder side, ignoring this item.'); 
							$skipcount++; continue;
						}
					}
				}
			}
			
			$dS_v = new C_dS_visitor($existingId);	// create a new visitor OR re-use the one identified by the synchro_visitors correlator
			
			foreach($headers as $hc => $header) { // scan each field in the data line
				// if($header=='gender') {
					// $g = $split[$hc];
					// $this->log('GENDER: ['.$g.'] length:'.strlen($g) );
				// }
				$infield = vfilter($split[$hc], $header, $this, $lcount); // (*n02*) update only fields exchanged in synchro as per the csv headers definition
				if($infield)
					$dS_v->{$header} = $infield;
				// else do nothing, never set to blank something that is already written in the mobminder (e.g. by written by the callcenter and deleted by medinect where no mobile exists).
				
				// if($header=='gender') {
					// $this->log('after: ['.$dS_v->{$header}.'] length:'.strlen($dS_v->{$header}) );
				// }
			}
			
			$v[] = $dS_v; // dS_visitors that could not be matche have id = 0
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort('249', 'csv visitors processing::No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		return $v;
	}
	public function csv_toAppointments($skeyId = false, $section = false) { // leaving skeyId to false forces creation of all new dataSets
	
		if($section) $headers = $section->getheaders();
			else $headers = $this->csv_getheaders();
		if(!$headers) return Array();
		
		$headersindex = Array();
		foreach($headers as $hcount => $header) $headersindex[$header] = $hcount;
		if(in_array('remoteId',$headers)) $this->hasRemoteId = true;
		
		$deletedFieldPresent = array_search('deleted',$headers); // contains false or the position of the field in the headers list
		
		// checking headers
		//
		$this->log(chr(9).'remoteId is in headers:'.($this->hasRemoteId?'YES':'NO'));

		if(!in_array('cueIn',$headers)) { 		$this->abort('251', 'csv appointments headers processing::missing cueIn field'); }
		if(!in_array('cueOut',$headers)) { 		$this->abort('252', 'csv appointments headers processing::missing cueOut field'); }
		if(!in_array('resources',$headers)) { 	$this->abort('253', 'csv appointments headers processing::missing resources field'); }
		if(!in_array('visitors',$headers)) { 	$this->abort('254', 'csv appointments headers processing::missing visitors field'); }
		
	
		// check expected fields list
		//
		$dS_r = new C_dS_reservation(); 
		$o_dS_defaults = $dS_r->getDefaults();
		$o_dS_defaults['resources'] = ''; // so to check headers correspondence
		$o_dS_defaults['visitors'] = '';
		$o_dS_defaults['rcolor'] = '';
		$o_dS_defaults['performances'] = '';
			$o_dS_defaults['created'] = ''; // are automatically updated by the dSsave() and dSobsolete() functions
			$o_dS_defaults['changed'] = '';
			$o_dS_defaults['deleted'] = '';
		if($this->hasRemoteId) $o_dS_defaults['remoteId'] = 0;
		
		foreach($headers as $hcount => $header) {
			if(!array_key_exists($header,$o_dS_defaults))
				$this->abort('255','csv appointments headers processing::The following header has no correspondance in the expected fields list: '.$header);
		}

		// defining sections
		//
			$lcount = 1; $skipcount = 1; $a = Array();
			$linein = 1; $lineout = count($this->lines)-1;
			if($section) { $linein = $section->getlinein(); $lineout = $section->getlineout(); }
		$this->log('Found '.$hcount.' valid column headers in line '.$linein);
		
		// scanning lines
		//
		function anormal(&$item, $key) { // check (*n10*)
			if(isset($item)) { 
				$item = trim($item); 
				$item = str_replace('""', '"', $item); // see (*csv*) format, see also (*as*) as how escapable characters are handled through DB and client js interface
			}
			else $item='';
		};
		function afilter($item, $key, $that) { // check (*n11*)
			
			return $item;
			switch($key) {
				case 'visitors': if($item=='0') return ''; else return preg_replace($that->filter_resource,'',$item); break;
				case 'resources': 
				case 'rcolor': 
					return preg_replace($that->filter_resource,'',$item); break;
				default:
					return $item;
			}
		};
		
		for($lx = $linein; $lx<=$lineout; $lx++, $lcount++) { $line = $this->lines[$lx];
			
			if($line == '') { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (empty line)'); continue; }; 
			$split = str_getcsv($line,';' /*delimiter*/,'"' /*enclosure*/);
			if(count($split) != ($hcount+1)) { $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; };
			array_walk($split,'anormal'); // check (*n10*)
			
			$existingId = 0;
			if($skeyId && $this->hasRemoteId) // if a synchro key is passed, first check if this item is not already present in DB
				$existingId = $this->localid_from_remoteid($skeyId, $split[$headersindex['remoteId']], 'reservations', __METHOD__.'(remoteId)');
			
			$dS_r = new C_dS_reservation($existingId); // if existingId is positive here, it loads the existing data set

			// perform basic checks
			foreach($headers as $hc => $header) 
				$dS_r->{$header} = afilter($split[$hc], $header, $this); // (*n11*) update only fields exchanged in synchro as per the csv headers definition, in this statement, remoteId takes place in the dS
				
			if($deletedFieldPresent!==false) { if($split[$deletedFieldPresent]!=0) $dS_r->deletorId = C_dbIO::$loggedId; else $dS_r->deletorId = 0; }
			
			if($dS_r->cueIn == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueIn is empty)'); continue; }; 
			if($dS_r->cueOut == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueOut is empty)'); continue; }; 
				$in = new C_date($dS_r->cueIn); $dS_r->cueIn = $in->getTstmp();
				$out = new C_date($dS_r->cueOut); $dS_r->cueOut = $out->getTstmp();
			if($dS_r->cueOut<$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is before cue in)'); continue; }; 
			if($dS_r->cueOut==$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is equal to cue in: cin='.$dS_r->cueIn.' cout='.$dS_r->cueOut.' remid='.$dS_r->remoteId.')'); continue; }; 
		
			if($dS_r->resources == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (resources is empty)'); continue; }; 
			if($this->hasRemoteId) if($dS_r->remoteId == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (remoteId is empty)'); continue; }; 
			
			// $dS_r->rcolor is optional
			
			$a[] = $dS_r;
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort('259', 'csv appointments processing::No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		return $a;
	}
	public function csv_toIdsMatch($accountId, $skeyId, $class) { // used by acknowledge function
	
		$headers = $this->csv_getheaders();
		if(!$headers) return Array();
	
		// checking headers
		//
		if(!in_array('mobminderId',$headers)) { 	$this->abort('280', 'acknowledge::No mobminderId field is heading the csv'); }
		if(!in_array('remoteId',$headers)) { 		$this->abort('281', 'acknowledge::No remoteId field is heading the csv'); }
		
		$this->hasRemoteId = true;
		$hcount = 1; // we expect only those two columns: localId and the matching remoteId

		
		$stable = ''; $otable = '';
		switch($class) {
			case 'visi': $stable = 'synchro_visitors';  	$otable = 'visitors'; 		break;
			case 'resa': $stable = 'synchro_reservations'; 	$otable = 'reservations'; 	break;
			default: $this->abort('282', 'acknowledge::Non matching class in ids matching process: '.$class);
		}
		
		// scanning lines
		//
		$lcount = 0; $a = array(); $datalines = count($this->lines)-1;
		
		function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
		if($datalines) {
			
			foreach($this->lines as $line) {
				if($lcount++==0) continue; // do not treat the first line (headers line)
				if($line == '') { // an empty line
					$this->log(chr(9).'Skipping line: '.$lcount.' (empty line)'); continue; 
				}; 
				if(substr_count($line, ';') != $hcount) { // it doesnt count the right number of cells!
					$this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; 
				}; 
				$split = explode(';',$line);
				array_walk($split,'normal');
				
				switch($class) {
					case 'visi': $dS_s = new C_dS_synchro_visitor(); break;
					case 'resa': $dS_s = new C_dS_synchro_reservation(); break;
				}
				foreach($headers as $hc => $header) $dS_s->{$header} = $split[$hc];
				
				$dS_s->localId = $dS_s->mobminderId; unset($dS_s->mobminderId);
				
				$discard = false;
				
				if($dS_s->localId == '')	{ $this->log(chr(9).'Skipping line: '.$lcount.' (mobminderId is empty)'); $discard = true; }; 
				if($dS_s->remoteId == '')	{ $this->log(chr(9).'Skipping line: '.$lcount.' (remoteId is empty)'); $discard = true; }; 
				
				// checking if the localId is valid
				//
				$q = new Q('select count(1) as c from '.$otable.' where groupId = '.$accountId.' and id = '.$dS_s->localId.';');
				if(!$q->c()) { 
					$this->log(chr(9).'Skipping line: '.$lcount.' (localId '.$dS_s->localId.' is unknown in account '.$accountId.')'); $discard = true; 
				};
				
				// checking if this exact link (remoteId to localId) is not already existing
				//
				$q = new Q('select count(1) as c from '.$stable.' where skeyId = '.$skeyId.' and localId = '.$dS_s->localId.' and remoteId = '.$dS_s->remoteId.';');
				if($q->c()) { 
					$this->log(chr(9).'Skipping line: '.$lcount.' (localId '.$dS_s->localId.' was already linked to remoteId '.$dS_s->remoteId.')'); continue; 
				};
				
				// checking if this localId is not already synced to another remoteId
				//
				$q = new Q('select count(1) as c from '.$stable.' where skeyId = '.$skeyId.' and localId = '.$dS_s->localId.';');
				if($q->c()) { 
					$p = new Q('select remoteId as id from '.$stable.' where skeyId = '.$skeyId.' and localId = '.$dS_s->localId.';');
					$this->log(chr(9).'Deleting link: '.$lcount.' (localId '.$dS_s->localId.' was already linked to remoteId(s) '.$p->ids().')');
					new Q('delete from '.$stable.' where skeyId = '.$skeyId.' and localId = '.$dS_s->localId.' and remoteId IN ('.$p->ids().');'); $discard = false; // (link deletion **)
				};
				
				// checking if the remoteId is new (keep this under link deletion **)
				//
				$q = new Q('select count(1) as c from '.$stable.' where skeyId = '.$skeyId.' and remoteId = '.$dS_s->remoteId.';');
				if($q->c()) { 
					$r = new Q('select localId as id from '.$stable.' where skeyId = '.$skeyId.' and remoteId = '.$dS_s->remoteId.';');
					$this->log(chr(9).'Skipping line: '.$lcount.' (remoteId '.$dS_s->remoteId.' is already in use for following localId: '.$r->ids().')'); $discard = true; 
				};
				
				if($discard) continue;
				
				$a[] = $dS_s;
			}
			
			// checking for doublons
			//
			$doublons = array(); $remoteids = array(); $abortit = false; 
			foreach($a as $c => $dS_c) {
				if(in_array($dS_c->remoteId,$remoteids)) {
					$abortit = true;  
					$doublons[] = $dS_c->remoteId;
				}
				$remoteids[] = $dS_c->remoteId;
			}
			if($abortit) {
				$doublons = implode(', ',$doublons);
				abort('902', 'your list contains duplicate remoteIds. Review your list! Doublons: '.$doublons);
			}

		}
		
		$this->log($lcount.' lines have been read');
		return $a;
	}	

	
}


// post processing for visitors import
//
function fixgenders($dS_v_array, $preload = false, $verbose = false) { // accepts an array of C_dS_visitor
	
	$count = Array(); $count[0] = 0;  $count[1] = 0; $count[2] = 0;  $count[3] = 0; 
	$genders = new C_dbAccess_genders($preload);
	$log = ''; $c=0;
	foreach($dS_v_array as $c => $dS_v) {
		$g = $dS_v->gender; 
		if($g===false) { // (*vg01*)
			$dS_v->gender = $genders->guess($dS_v->firstname); 
			if($verbose) $count[$dS_v->gender]++;  // counts on value retrieved from stats
			continue; 
		}
		if(($g==1)||($g==0)||($g==2)||($g==3)||($g==4)||($g==5)||($g==6)) { 
			$g%=2;
			if($verbose) {
				// if($c<20) msg('found native value:|'.$dS_v->gender.'| length:'.strlen($dS_v->gender));
				$count[$g+2]++;
			}
			continue; 
			
		} // valid native values, no conversion needed
		
		// else convert exotic values found in gender columns
		$out = 0;
		switch(strtolower($g)) { // see .js: var gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 'mr':case 'mr.': case 'm': $out=1; break;
			case 'mme': case 'mme.': case 'f': $out=0; break;
			case 'mlle': case 'mlle.': $out=4; break;
			case 'sprl': case 's.p.r.l.': case 's.p.r.l': $out=3; break;
			case 'sa': case 's.a.': case 's.a': $out=2; break;
			default: 
				$out = $genders->guess($dS_v->firstname);
		}
		$dS_v->gender = $out;
		if($verbose) $count[$dS_v->gender]++; // counts on value retrieved from stats
		$c++;
	}
	if($verbose) msg('fixgenders log: '.$log.' (from stats: males:'.$count[1].' females:'.$count[0].', from your file: males:'.$count[3].' females:'.$count[2].')');
}
function vpostprocess($dS_v_array, $dS_accesskey, $dS_account) {

	msg('Now post-processing visitors.');
	
	$rccss = new C_dbAccess_synchro_ccss($dS_accesskey->id);
	$ccorrl = Array(); if($rccss->count()) foreach($rccss->keyed as $css) $ccorrl[$css->remoteId] = $css->localId;
	
	$passed = Array();
	foreach($dS_v_array as $c => $dS_v) {
		
		if($dS_v->firstname == '') $dS_v->firstname == 'X';
			else $dS_v->firstname = ucwords($dS_v->firstname);
		$dS_v->lastname = ucwords($dS_v->lastname);
		
		if($dS_v->address) $dS_v->address = ucwords($dS_v->address);
		if($dS_v->city) $dS_v->city = ucwords($dS_v->city);
		if($dS_v->country) $dS_v->country = ucwords($dS_v->country);
		if($dS_v->company) $dS_v->company = ucwords($dS_v->company);
		if($dS_v->note) {
			// when Excel gets multi lines notes, it encloses the cell in double quotes => "line1+chr(13)+line2". We remove those addslashed quotes. If we don't, they are pushed to the DB and appear in the note on the app.
			// chr(92) is \ back slash
			// chr(34) is " double quote
			$dS_v->note = str_replace(chr(92).chr(34), '', $dS_v->note); 
			$dS_v->note = str_replace(chr(13), '', $dS_v->note); // no carriage return in single line fields
		}		
		
		if(isset($dS_v->rcolor)) {
			if($dS_v->rcolor) {
				if(isset($ccorrl[$dS_v->rcolor])) $dS_v->cssColor = $ccorrl[$dS_v->rcolor];
					else { 
						msg(chr(9).'Warning: this color has no sync correlator in Mobminder:'.$dS_v->rcolor.' in item '.$dS_v->remoteId);
						$dS_v->cssColor = 0; // when rcolor is empty, reset the cssColor previously applied
				}
			}
			unset($dS_v->rcolor); // clean up data set from this memeber, mandatory before saving the dataSet
		}
		
		if($dS_v->mobile) {
			$dS_v->mobile = retrieveMobileFromDirty($dS_v->mobile, $dS_account->phoneRegion); // prepare for checkMobileFormat()
			$dS_v->mobile = checkMobileFormat($dS_v->mobile, $dS_account->phoneRegion); // $string is supposed to contain a mobile phone number like "+32493655599" or trunked "0493655599"
		}
		
		$passed[] = $dS_v;
	}
	msg('>> Nbr of visitors before screening:'.count($dS_v_array));
	msg('<< Nbr of visitors after screening:'.count($passed));
	return $passed; // drops unpassed items
}


// post processing for appointments import
//
// => correlates remote resource Ids with local resource Ids (inclusive visitors)
// 
//
function apostprocess($dS_a_array, $dS_accesskey, $dS_account) { // considers that visitors are already synced

	msg('Now post-processing appointments, matching your ids with sync correlators.');
	
	// each remote visitor reference must have a local visitor reference
	//
			$visiIds = Array();
			foreach($dS_a_array as $c => $dS_r) {
				if(isset($dS_r->visitors)) if($dS_r->visitors!='') {
					$v = explode('!',$dS_r->visitors); 
					foreach($v as $vid) $visiIds[] = $vid;
				}
			}
			$visiIds = implode(',',$visiIds);

		$vsync = new C_dbAccess_synchro_visitors(); if($visiIds) $vsync->loadOnRemoteId($visiIds, $dS_accesskey->id); // load only the concerned guys
		$vcorrl = Array();
		if($vsync->count()) foreach($vsync->keyed as $vs) $vcorrl[$vs->remoteId] = $vs->localId;

	// we need to have local resources
	//
		$grscs = new C_dbAccess_resources($dS_account->id);
		if(!$grscs->count()) abort('501', 'appointment post processing::The target account has no resource');
		$rtypes = Array();
		foreach($grscs->keyed as $rsc) $rtypes[$rsc->id] = $rsc->resourceType;

	// each remote resource reference has possibly a local resource reference
	//
		$rsync = new C_dbAccess_synchro_resources($dS_accesskey->id);
		if(!$rsync->count()) abort('502', 'appointment post processing::none of the resources have a correlator');
		$rcorrl = Array();
		foreach($rsync->keyed as $rsc) $rcorrl[$rsc->remoteId] = $rsc->localId;

	// colors
	//
		$rccss = new C_dbAccess_synchro_ccss($dS_accesskey->id);
		$ccorrl = Array(); if($rccss->count()) foreach($rccss->keyed as $css) $ccorrl[$css->remoteId] = $css->localId;

	
	// now scan imported appointments and attach local id's 
	//
	$passed = Array(); 
	foreach($dS_a_array as $c => $dS_r) {
		
		// $in = new C_date($dS_r->cueIn); $dS_r->cueIn = $in->getTstmp();    // has moved to function csv_toAppointments()
		// $out = new C_date($dS_r->cueOut); $dS_r->cueOut = $out->getTstmp();
		
		// here we should check matching of cueIn and cueOut on the account granularity
		//
		// TBD
		
		// attendees
			$rscs = explode('!',$dS_r->resources); 
			$atts = new C_dbAccess_attendees(); 
			foreach($rscs as $rid) { // the value passed by the remote program is his own resource id
				if(!isset($rcorrl[$rid])) { msg(chr(9).'Warning: this resource has no sync correlator in Mobminder:'.$rid.' in item '.$dS_r->remoteId); continue; } // this resource is not synchronized
					else $lrid = $rcorrl[$rid];
				$att = $atts->newVirtual(); $att->resourceId = $lrid; $att->resourceType = $rtypes[$lrid]; 
			}
		if(!$atts->count()) { msg(chr(9).'Error: This item has none matching resource in Mobminder:'.$dS_r->remoteId.', skipping'); continue; }
		$dS_r->resources = $atts; // (*sy01*)
		
		// visitors
			$attvi = new C_dbAccess_att_visitors(); 
			if(isset($dS_r->visitors)) if($dS_r->visitors!='') {
				$visis = explode('!',$dS_r->visitors); 
				foreach($visis as $vid) { 
					if(!isset($vcorrl[$vid])) { msg(chr(9).'Warning: this visitor has no sync correlator in Mobminder:'.$vid.' in item '.$dS_r->remoteId); continue; } // you would end up with a gray sticker on your screen because the visitor does not match
					$lvid = $vcorrl[$vid];
					$v = $attvi->newVirtual(); $v->resourceId = $lvid; $v->resourceType = class_visitor; 
				}
			}
		$dS_r->visitors = $attvi;
		
		// colors
			if(isset($dS_r->rcolor)) if($dS_r->rcolor) { 
				if(isset($ccorrl[$dS_r->rcolor])) $dS_r->cssColor = $ccorrl[$dS_r->rcolor];
					else { 
						msg(chr(9).'Warning: this color has no sync correlator in Mobminder:'.$dS_r->rcolor.' in item '.$dS_r->remoteId);
						$dS_r->cssColor = 0; // when rcolor is empty, reset the cssColor previously applied
					}
			}

		// miscellaneous
		if($dS_r->note) {
			// when Excel gets multi lines notes, it encloses the cell in double quotes => "line1+chr(13)+line2". We remove those addslashed quotes. If we don't, they are pushed to the DB and appear in the note on the app.
			// chr(92) is \ back slash
			// chr(34) is " double quote
			$dS_r->note = str_replace(chr(92).chr(34), '', $dS_r->note); 
			$dS_r->note = str_replace(chr(13), '', $dS_r->note); // no carriage return in single line fields
		}
		
		$passed[] = $dS_r;
	}
	msg('>> Nbr of appointments before screening:'.count($dS_a_array));
	msg('<< Nbr of appointments after screening:'.count($passed));
	return $passed; // drops unpassed items
}


?>