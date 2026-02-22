<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S Y N C H R O     L I B R A R Y 
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

	if(!isset($_POST)) die('missing post, check your form-multipart encoding');
	if(count($_POST)==0) die('none parameter in post, check your form-multipart encoding');

	if(!isset($_POST['login'])) die('you must specify a login');
	if(!isset($_POST['passw'])) die('you must specify a password');

	$login 	= $_POST['login'];
	$pass 	= $_POST['passw'];
	$dS_login = C_dS_login::logon($login, $pass);
	if(!$dS_login) abort(1,'You have no access');
		else if($dS_login->accessLevel!=3) abort(2,'You do not have the expected access level');
			else C_dbIO::logged($dS_login,'(sync1)');
	msg('Logged:'.C_dbIO::$loggedName);
	
	return $dS_login;
}
function quickkey($loginid, $accountid = false) { // assumes a single key is attached to this login
	$and = $accountid ? ' and accountId = "'.$accountid.'" ' : '';
	$q = new Q('select id from accesskeys where groupId = "'.$loginid.'" '.$and.';'); // access keys group to a login
	$ids = $q->ids(false); $kid = 0; if(count($ids)) $kid = $ids[0];
	if($kid==0) { abort(3, 'You have no allowance on this page (invalid key)'); }
	
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
	
	// functions allowing to clean up appointments and visitors in the target context
	//
	public function flush_visitors() {
		
		new Q('delete from visitors where groupId = '.$this->dS_ackey->accountId.';');
		new Q('delete from synchro_visitors where groupId = '.$this->dS_ackey->accountId.';'); // this will fuck any setup where double sync is present
	}
	public function flush_reservations() {
		
		// Appointments are removed only for the synced resources
		$rsync = new C_dbAccess_synchro_resources($this->dS_ackey->id);
		if(!$rsync->count()) abort(15, 'No Resource is expected to be synchronized');
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
	public function rem_resa($resaIds = false, $archiveInc = true, $remotePOV = false) {
		
		// this function returns an o_dbAccess_reservations
		//
		// each dS_reservation is magnified with following members:
		//
		// ->remoteId (as defined by the synchro_reservations correlators)
		// ->rcolor  (as defined by the sync login correlators setup)
		// ->resources (as defined by the sync login correlators setup)
		// ->visitors (as defined by the synchro_visitors correlators)
		
		$skeyId = $this->dS_ackey->id;
		
		$accwhere = ' reservations.groupId = '.$this->dS_ackey->accountId;
		$attwhere = ''; if($resaIds) $attwhere = ' AND reservations.id in ('.$resaIds.')';
		if($archiveInc) {
			$accwhereA = ' archive_reservations.groupId = '.$this->dS_ackey->accountId;
			$attwhereA = ''; if($resaIds) $attwhere = ' AND archive_reservations.id in ('.$resaIds.')';
		}
		$this->resas = new C_dbAccess_reservations(); 
		if($resaIds) $this->resas->loadOnId($resaIds);
			else $this->resas->loadOnGroup($this->dS_ackey->accountId);
		
		if($archiveInc) {
			$resasA = new C_dbAccess_reservations('archive_'); 
			if($resaIds) $resasA->loadOnId($resaIds);
				else $resasA->loadOnGroup($this->dS_ackey->accountId);
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
		$SQL = 'SELECT attendees.id as id, reservations.id as resaid, resourceId as rscid FROM attendees JOIN '.$join.' WHERE '.$accwhere.$attwhere;
		
		if($archiveInc) {
				$joinA = 'archive_reservations ON archive_reservations.id = archive_attendees.groupId';
			$SQLA = 'SELECT archive_attendees.id as id, archive_reservations.id as resaid, resourceId as rscid FROM archive_attendees JOIN '.$joinA.' WHERE '.$accwhereA.$attwhereA;
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
		$SQL = 'SELECT att_visitors.id as id, reservations.id as resaid, resourceId as vid FROM att_visitors JOIN '.$join.' WHERE '.$accwhere.$attwhere;
		
		if($archiveInc) {
				$joinA = 'archive_reservations ON archive_reservations.id = archive_att_visitors.groupId';
			$SQLA = 'SELECT archive_att_visitors.id as id, archive_reservations.id as resaid, resourceId as vid FROM archive_att_visitors JOIN '.$joinA.' WHERE '.$accwhereA.$attwhereA;
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
						$dS_r = $this->resas->keyed[$resaid];
						$dS_v = new C_dS_visitor($vid);
						$dS_r->note .= ' ('.$dS_v->getFullName().')';
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
		$hp = $this->hpositions['id'];
		$this->headers[$hp] = 'remoteId';
		unset($this->hpositions['id']); $this->hpositions['remoteId'] = $hp;
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
		
		if(count($_FILES)) $this->present = true; else { $this->present = false; return $this; }
		foreach($_FILES as $postname => $filedescritpion) { break; } // we read only one file in this script

		switch ($filedescritpion['error']) {
			case UPLOAD_ERR_OK: break;
			case UPLOAD_ERR_NO_FILE: abort(1,'No file received'); break;
			case UPLOAD_ERR_INI_SIZE:
			case UPLOAD_ERR_FORM_SIZE: abort(2,'The file size is exceeding limits'); break;
			default: abort(1, 'Unknown upload error');
		}

		// Opening the file
		//

		$this->size 	= $filedescritpion['size']+0;
		$this->pathnamext = $filedescritpion['tmp_name'];
		$this->name 	= $filedescritpion['name'];
		$this->type 	= $filedescritpion['type'];
		$this->ext 		= strtolower(pathinfo($this->name, PATHINFO_EXTENSION));
		$this->dir 		= pathinfo($this->pathnamext, PATHINFO_DIRNAME);
		
		$this->sections = Array();
		$this->sectionsplit = utf8_encode('#');
		
		msg('FILE RECEIVED - size: '.(int)($this->size/1024).'kB, name: '.$this->name.', ext: '.$this->ext);
		
		$this->filter_line 		= utf8_encode('/[^#_ÀàâçËÈÉéèëêôöîïûùÿ@ A-Za-z0-9+€&:;,!\*\?\/\'\"\.\(\)\[\]\-]/');
		$this->filter_address 	= utf8_encode('/[^_ÀàâçËÈÉéèëêôöîïûùÿ\.,a-z A-Z0-9-\'\/\(\)]/');
		$this->filter_name 		= utf8_encode('/[^_ÀàâçËÈÉéèëêôöîïûùÿ\'\.a-z A-Z-]/');
		$this->filter_resource 	= utf8_encode('/[^_!\.a-zA-Z0-9-]/');
		$this->filter_email 	= utf8_encode('/[^\._a-zA-Z0-9-]/');
		$this->filter_stamp 	= utf8_encode('/[^ 0-9-:]/');
		$this->filter_birthday 	= utf8_encode('/[^0-9]/');
		$this->filter_phone 	= utf8_encode('/[^0-9]/');
		$this->filter_zip 		= utf8_encode('/[^a-zA-Z0-9]/');
		
		$this->filter_substitute 	= utf8_encode('_');
	}
	public function __destruct() {
		if($this->pathnamext) unlink($this->pathnamext);
	}
	
	public function log($l) { msg($l); }
	
	public function tolines() {
		$lines = &$this->lines; 
		
			if(!$this->present) return $this;
			$handle = fopen($this->pathnamext,'r');
			if(!$handle) return $this;
			
			$c = 0; $bunch = '';
		while(!feof($handle) && $c<200)	$bunch .= trim(fgets($handle)); rewind($handle);
		$encoding = mb_detect_encoding($bunch, mb_list_encodings(), true);
		$this->log('File encoding is:'.$encoding);
		// Note about encoding:
		//   Windows .xls and .xlsx files are ISO-8859-1
		//   Flat files generated by Octopus are ASCII
		//   Backups generated by Mobminder are UTF-8
		
			$c = 0;
		while(!feof($handle)) {
			$line = trim(fgets($handle));
			
			if($line=='') continue; // $lines will contains ONLY non blank lines
			
			// ISO treatment
			$utf8 = $line;
			if($this->ext == 'csv') { // then the file is in ANSI format
				
				$line = preg_replace('/[\x00-\x1F\x7F]/','',$line); // removes special chars
				if($encoding!='UTF-8') $utf8 = iconv('ISO-8859-1', 'UTF-8', $line);
			} 
			$utf8 = preg_replace($this->filter_line,$this->filter_substitute,$utf8); // removes other not alphanum chars
			
			// utf8 treatment
			$utf8 = preg_replace("/\\s\\s+/",' ',$utf8); // reduces multiple spaces into single spaces
			// $slashed = addslashes($utf8);
			$lines[] = $utf8;
			// if($c++<20) log(chr(9).'line '.$c.' >'.$utf8);
			unset($utf8);
		}
		fclose($handle);
		if(count($lines)) $this->isempty = false; else $this->isempty = true;
		return $this;
	}
	public function read_appointments() { // returns an Array of C_dS_reservation
		$a; 
		switch($this->ext) {
			case 'csv': $a = $this->csv_toAppointments(); break;
			case 'ics': $a = $this->ics_toAppointments(); break;
			default:
				$this->abort(1, 'File extension not supported');
		}
		return $a;
	}
	
	
	///////////////////////
	//
	// private functions
	//
	private function abort($ec, $e) {
		
		$email = $this->email;
		if($email) {
			$title = 'Mobminder - Sync problem - account'.$this->dS_account->name;
			$text = 'A sync transaction has been stopped - error Code:'.$ec.'. Error:'.$e;
			$from = 'Mobminder sync API <no-reply@app01.mobminder.com>';
			
			$o_dataCom_mail = new C_dataCom_mail();
			$o_dataCom_mail->sendMail($title, $text, $email, $from, 0);
		}
		
		$msg = 'Fatal error: '.$e.chr(10);
		die($msg.chr(10).'##'.$ec.'##'.$e);
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
		if($slicing == 6 || $slicing == 2 || $slicing == 3) {
			if($m=='05') $m = '00';
			if($m=='15') $m = '10';
			if($m=='25') $m = '20';
			if($m=='35') $m = '30';
			if($m=='45') $m = '40';
			if($m=='55') $m = '50';			
			if($slicing == 6) return $m;
		}
		if($slicing == 4) {
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
		if($slicing == 3) { 
			if($m=='10') $m = '00';
			if($m=='30') $m = '20';
			if($m=='50') $m = '40';
			return $m;
		}
		if($slicing == 2) { 
			if($m=='10') $m = '00';
			if($m=='30') $m = '20';
			if($m=='50') $m = '40';
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
		
		$relativeToZone = substr($icsformat,-1)=='Z';
		
		if($isDateAndTime)
			if($relativeToZone) date_default_timezone_set('GMT'); // force encoding time GMT relative in this case
			
		$datetime = new C_date($format); 
		
		if($isDateAndTime)
			if($relativeToZone) date_default_timezone_set($tzone); // read time relative to ics file specified time zone
		
		$stamp =  $datetime->get_ISO8601_stamp();
		
		return $stamp;
	}
	private function after($line, $after) {
		$al = strlen($after);
		$ll = strlen($line);
		$left = substr($line, -($ll-$al));
		return $left;
	}
	private function readICSdate($line, $tag) {
		$icstime = '';
		if(strpos($line, $tag.';VALUE=DATE')!==false) $icstime = $this->after($line, $tag.';VALUE=DATE:'); 
		else if(strpos($line, $tag.':')!==false) $icstime = $this->after($line, $tag.':'); 
		return $icstime;
	}
	private function ics_toAppointments() { // returns an array of $o_dS_reservations

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
					$tz = $this->after($line, 'X-WR-TIMEZONE:');
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
				
				if($line=='END:VALARM') { $inVALARM = false; continue; }// we are leaving a calendar event tag
				if($line=='BEGIN:VALARM') { $inVALARM = true; continue; }
				if(!$inVALARM) { // so not to catch the Description of the VALARM
					if(strpos($line,'DESCRIPTION:')!==false) $dS_r->note = $this->after($line, 'DESCRIPTION:');
				}
			}
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort(12, 'No valid lines could be read from the file');
		if(!$tz) $this->abort(13, 'No valid time zone was found in the file');
		if(!$rscId) $this->abort(14, 'No calendar name is specified that we can match to a rscId');
		$this->log($lcount.' valid lines have been read');
		$this->log($rcount.' valid reservations have been extracted');
		return $table;
	}

	///////////////////////
	//
	// .csv treatment
	//
	
	public function csv_splitsections() {
		
		if($this->present == false) abort(6, 'No file was posted');
		if(count($this->lines)==0) abort(7, 'The file is empty');
		if(count($this->lines)==1) { $this->isempty = true; return false; }; // only the header row
		
		$line1 = $this->lines[0];
		if($line1=='') abort(8, 'The header line is empty');
		
		if(substr($line1,0,1)!=$this->sectionsplit) abort(9, 'There is no section starting at line 1');
		
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
		
		if($this->present == false) abort(6, 'No file was posted');
		if(count($this->lines)==0) abort(7, 'The file is empty');
		if(count($this->lines)==1) { $this->isempty = true; return false; }; // only the header row
		
		$line1 = $this->lines[0];
		if($line1=='') abort(8, 'The header line is empty');
		$headers = explode(';',$line1);
		
		return $headers;
	}
	public function csv_toVisitors($dS_accesskey = false, $section = false) { // leaving dS_accesskey to false forces creation of all new dataSets
	
		if($section) $headers = $section->getheaders();
			else $headers = $this->csv_getheaders();
		if(!$headers) return Array();
	
		// checking headers
		//
		if(in_array('remoteId',$headers))$this->hasRemoteId = true; else $this->hasRemoteId = false;
		$this->log(chr(9).'remoteId is in headers:'.($this->hasRemoteId?'YES':'NO'));
		
		if(!in_array('lastname',$headers)) $this->abort(10, 'Missing mandatory header: lastname');
	
		C_dS_visitor::$defaults['language'] = language_code_french;
		$dS_v = new C_dS_visitor(); 
			$o_dS_defaults = $dS_v->getDefaults(); // which is an array
			if($this->hasRemoteId) $o_dS_defaults['remoteId'] = 0; // add the synchro field
			$o_dS_defaults['rcolor'] = 0; // add the remote color field
		
		$remoteIdPosition = 0;
		foreach($headers as $hcount => $header) {
			if(!array_key_exists($header,$o_dS_defaults))				
				if($header=='deleted' || $header=='created') { // we accept this header even though it is not part of the defaults (this field belongs to the generic tracking fields list)
				} else
					$this->abort(11,'The following header has no correspondence in the expected fields list: '.$header);
			if($this->hasRemoteId) if($header == 'remoteId') $remoteIdPosition = $hcount;
		}
		if(!in_array('gender',$headers)) { 
			C_dS_visitor::$defaults['gender'] = false; 
			$this->log('Missing header: gender. Genders will be deduced from statistics.'); 
		}

		// scanning lines
		//
		$lcount = 1; $skipcount = 1; $v = Array();
		$linein = 1; $lineout = count($this->lines)-1;
		if($section) { $linein = $section->getlinein(); $lineout = $section->getlineout(); }
		
		$this->log('Found '.$hcount.' valid columns in line '.$linein);
		
		function vnormal(&$item, $index) { // check (*n01*)
			if(isset($item)) $item = trim($item); else $item='';
		};
		function vfilter($item, $key, $that) { // check (*n02*)
			switch($key) {
				case 'address':
				case 'city': return preg_replace($that->filter_address,'',$item); break;
				case 'mobile':
				case 'phone': return preg_replace($that->filter_phone,'',$item); break;
				case 'zipCode': return preg_replace($that->filter_zip,'',$item); break;
				case 'lastname':
				case 'firstname': return preg_replace($that->filter_name,'',$item); break;
				case 'birthday': 
					$item = preg_replace($that->filter_birthday,'',$item);
					if($item=='19010101')  return '0'; else return $item;
					break;
				default:
					return $item;
			}
		};

		$accountId = 0; $skeyId = 0; if($dS_accesskey) { $accountId = $dS_accesskey->accountId; $skeyId = $dS_accesskey->id; }

		for($lx = $linein; $lx<=$lineout; $lx++, $lcount++) {
			$line = $this->lines[$lx];
			if($line == '') { // an empty line
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (empty line)'); continue; 
			}; 
			if(substr_count($line, ';') != $hcount) { // may be an empty line, anyway it doesnt count the right number of cells!
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; 
			}; 
			$split = explode(';',$line);
			array_walk($split,'vnormal');  // normal is the function defined here: (*n01*)
			
			$existingId = 0;
			if($this->hasRemoteId) {
				$remoteId = $split[$remoteIdPosition];
				if($skeyId) { // if a synchro key is passed, first check if this item is not already present in DB
					if($remoteId) {
							$sql = 'SELECT localId as id FROM synchro_visitors WHERE skeyId = '.$skeyId.' AND remoteId = '.$remoteId.';';
						$q = new Q($sql);
						$existingId = $q->ids(); if(!$existingId) $existingId = 0; // then the item is new
						
						$cnt = $q->cnt(); 
						if($cnt>1) {
		C_dS_exception::put('sync/lib.php postedfile' /*class*/, 'csv_toVisitors()' /*function*/, 'Multiple localId match for a single remoteId > '.$sql.'| line:'.$line /*msg*/, $accountId /*account id*/);
		$this->abort('248', 'csv visitors processing::This remoteId has more than one entry in the sync table:'.$remoteId.' matches mobIds '.$existingId);
						}	
						
					}
				}
			}
			
			$dS_v = new C_dS_visitor($existingId);		
			
			foreach($headers as $hc => $header) $dS_v->{$header} = vfilter($split[$hc], $header, $this); // (*n02*) update only fields exchanged in synchro as per the csv headers definition
			
			if($dS_v->lastname == ''){ // we do not agree entries with no lastname
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (lastname is empty)'); continue; 
			}; 
			$v[] = $dS_v;
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort(12, 'No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		return $v;
	}
	public function csv_toAppointments($skeyId = false, $section = false) { // leaving skeyId to false forces creation of all new dataSets
	
		if($section) $headers = $section->getheaders();
			else $headers = $this->csv_getheaders();
		if(!$headers) return Array();
		$deletedFieldPresent = array_search('deleted',$headers); // contains false or the position of the field in the headers list
		
		// checking headers
		//
		if(in_array('remoteId',$headers)) $this->hasRemoteId = true; else $this->hasRemoteId = false;
		$this->log(chr(9).'remoteId is in headers:'.($this->hasRemoteId?'YES':'NO'));

		if(!in_array('cueIn',$headers)) { 		$this->abort(21, 'No cueIn field'); }
		if(!in_array('cueOut',$headers)) { 		$this->abort(22, 'No cueOut field'); }
		if(!in_array('resources',$headers)) { 	$this->abort(23, 'No resources field'); }
		if(!in_array('visitors',$headers)) { 	$this->abort(24, 'No visitors field'); }
		
	
		// check expected fields list
		//
		$dS_r = new C_dS_reservation(); 
		$o_dS_defaults = $dS_r->getDefaults();
		$o_dS_defaults['resources'] = ''; // so to check headers correspondance
		$o_dS_defaults['visitors'] = '';
		$o_dS_defaults['rcolor'] = '';
		$o_dS_defaults['performances'] = '';
		if($this->hasRemoteId) $o_dS_defaults['remoteId'] = 0;
		
		$remoteIdPosition = 0;
		foreach($headers as $hcount => $header) {
			if(!array_key_exists($header,$o_dS_defaults))
				if($header=='deleted' || $header=='created') { // we accept this header even though it is not part of the defaults (this field belongs to the generic tracking fields list)
				} else
					$this->abort(25,'The following header has no correspondance in the expected fields list: '.$header);
			if($this->hasRemoteId) if($header == 'remoteId') $remoteIdPosition = $hcount;
		}

		// scanning lines
		//
		$lcount = 1; $skipcount = 1; $a = Array();
		$this->log('Found '.$hcount.' valid columns in line 1');
		function anormal(&$item, $key) { // check (*n10*)
			if(isset($item)) $item = trim($item); else $item='';
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
		
		$linein = 1; $lineout = count($this->lines)-1;
		if($section) { $linein = $section->getlinein(); $lineout = $section->getlineout(); }
		// foreach($this->lines as $line) {
		for($lx = $linein; $lx<=$lineout; $lx++, $lcount++) {
			$line = $this->lines[$lx];
			if($line == '') { // an empty line
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (empty line)'); continue; 
			}; 
			if(substr_count($line, ';') != $hcount) { // may be an empty line, anyway it doesnt count the right number of cells!
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; 
			}; 
			$split = explode(';',$line);
			array_walk($split,'anormal'); // check (*n10*)
			
			$existingId = 0;
			if($skeyId && $this->hasRemoteId) { // if a synchro key is passed, first check if this item is not already present in DB
				$remoteId = $split[$remoteIdPosition];
				if(!is_numeric($remoteId)) abort(27, 'remoteId must be a numeric, you sent:'.$remoteId);
				$remoteId = intval($remoteId); if(!is_int($remoteId)) abort(28, 'remoteId must be an integer, you sent:'.$remoteId);
				if($remoteId) {
					$q = new Q('SELECT localId as id, synchro_reservations.id as younger FROM synchro_reservations WHERE skeyId = '.$skeyId.' AND remoteId = '.$remoteId.' order by younger desc limit 1;');
					$existingId = $q->ids(); if(!$existingId) $existingId = 0; // then the item is new
					if($q->cnt()>1) abort(99, 'Many reservations have the same remoteId:'.$remoteId.''); // that is a messy situation where the remote side has loaded many new items having a common remote id
				}
			}
			$dS_r = new C_dS_reservation($existingId); // if existingId is positive here, it loads the existing data set

			// perform basic checks
			foreach($headers as $hc => $header) $dS_r->{$header} = afilter($split[$hc], $header, $this); // (*n11*) update only fields exchanged in synchro as per the csv headers definition, in this statement, remoteId takes place in the dS
			if($deletedFieldPresent!==false) { if($split[$deletedFieldPresent]!=0) $dS_r->deletorId = C_dbIO::$loggedId; else $dS_r->deletorId = 0; }
			
			if($dS_r->cueIn == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueIn is empty)'); continue; }; 
			if($dS_r->cueOut == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (cueOut is empty)'); continue; }; 
				$in = new C_date($dS_r->cueIn); $dS_r->cueIn = $in->getTstmp();
				$out = new C_date($dS_r->cueOut); $dS_r->cueOut = $out->getTstmp();
			if($dS_r->cueOut<$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is before cue in)'); continue; }; 
			if($dS_r->cueOut==$dS_r->cueIn){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (appointment cue out is equal to cue in)'); continue; }; 
		
			if($dS_r->resources == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (resources is empty)'); continue; }; 
			if($this->hasRemoteId) if($dS_r->remoteId == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (remoteId is empty)'); continue; }; 
			// $dS_r->rcolor is optional
			$a[] = $dS_r;
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort(29, 'No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		return $a;
	}
	public function csv_toResources() {
	
		$headers = $this->csv_getheaders();
		if(!$headers) return Array();
	
		// checking headers
		//
		if(in_array('remoteId',$headers)) $this->hasRemoteId = true; else $this->hasRemoteId = false;

		if(!in_array('name',$headers)) { $this->abort(31, 'No name field'); }
	
		// expected fields list
		//
		$dS_r = new C_dS_resource(); 
		$o_dS_defaults = $dS_r->getDefaults();
		if($this->hasRemoteId) $o_dS_defaults['remoteId'] = 0;
		
		foreach($headers as $hcount => $header) {
			if(!array_key_exists($header,$o_dS_defaults))
				$this->abort(45,'The following header has no correspondence in the expected fields list: '.$header);
		}

		// scanning lines
		//
		$lcount = 0; $skipcount = 1; $a = array();
		$this->log('Found '.$hcount.' valid columns in line 1');
		function normal(&$item, $key) { if(isset($item)) $item = trim($item); else $item=''; };
		foreach($this->lines as $line) {
			if($lcount++==0) continue; // do not treat the first line (headers line)
	echo $line.chr(10);
			if($line == '') { // an empty line
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (empty line)'); continue; 
			}; 
			if(substr_count($line, ';') != $hcount) { // may be an empty line, anyway it doesnt count the right number of cells!
				$skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; 
			}; 
			$split = explode(';',$line);
			array_walk($split,'normal');
			$dS_r = new C_dS_resource();
			foreach($headers as $hc => $header) $dS_r->{$header} = $split[$hc];
			if($dS_r->name == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (name is empty)'); continue; }; 
			if($this->hasRemoteId) if($dS_r->remoteId == ''){ $skipcount++; $this->log(chr(9).'Skipping line: '.$lcount.' (remoteId is empty)'); continue; }; 
			$a[] = $dS_r;
		}
		$lcount -= $skipcount;
		if(!$lcount) $this->abort(49, 'No valid lines could be read from the file');
		$this->log($lcount.' valid lines have been read');
		return $a;
	}
	public function csv_toIdsMatch($accountId, $skeyId, $class) {
	
		$headers = $this->csv_getheaders();
		if(!$headers) return Array();
	
		// checking headers
		//
		if(!in_array('mobminderId',$headers)) { 	$this->abort(91, 'No mobminderId field is heading the csv'); }
		if(!in_array('remoteId',$headers)) { 		$this->abort(92, 'No remoteId field is heading the csv'); }
		
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
				if(substr_count($line, ';') != $hcount) { // may be an empty line, anyway it doesnt count the right number of cells!
					$this->log(chr(9).'Skipping line: '.$lcount.' (columns count does not match: '.utf8_decode($line).')'); continue; 
				}; 
				$split = explode(';',$line);
				array_walk($split,'normal');
				
				switch($class) {
					case 'visi': $dS_s = new C_dS_synchro_visitor(); break;
					case 'resa': $dS_s = new C_dS_synchro_reservation(); break;
					default: $this->abort(80, 'Non matching class in ids matching process: '.$class);
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
		$this->log($lcount.' valid lines have been read');
		return $a;
	}	

	
}


// post processing for visitors import
//
function guessGender($name) {
	
	$reduced = reduceDiacriticsUTF8($name, /*$firstwordonly = */true);
	
	$SQL = 'SELECT gender FROM stat_genders WHERE name="'.$reduced.'";';
	$result = mysql_query($SQL) or die('SQL execution error:'.$SQL); // error while executing query
	$gender = 'x';
	while($row = mysql_fetch_assoc($result)) { $gender = $row['gender']; break; }
	
	switch($gender) {
		case 'x': msg(chr(9).'no gender found for firstname |'.$name.'| reduced to |'.$reduced.'|, occurence '); return 0;
		default: 
			// msg(chr(9).'gender '.$gender.' found for |'.$reduced.'|');
			return $gender;
	}
}
function fixgenders($dS_v_array, $verbose = false) { // accepts an array of C_dS_visitor
	
	$log = '';
	foreach($dS_v_array as $c => $dS_v) {
		$g = $dS_v->gender;
		if($g===false) { $dS_v->gender = guessGender($dS_v->firstname); if($verbose) $log .= '|'; continue; }
		if(($g==1)||($g==0)||($g==2)||($g==3)||($g==4)||($g==5)||($g==6)) { continue; } // valid native values, no conversion needed
		
		// else convert exotic values found in gender columns
		$out = 0;
		switch($g) { // see .js: var gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 'mr':case 'mr.': case 'm': $out=1; break; // remember that the all line was set to lower case
			case 'mme': case 'mme.': case 'f': $out=0; break;
			case 'mlle': case 'mlle.': $out=4; break;
			case 'sprl': case 's.p.r.l.': case 's.p.r.l': $out=3; break;
			case 'sa': case 's.a.': case 's.a': $out=2; break;
			default: 
				$out = guessGender($dS_v->firstname);
				if($verbose) $log .= '/';
		}
		$dS_v->gender = $out;
	}
	if($verbose) if($log) msg('fixgenders: '.$log);
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
		
		if(isset($dS_v->rcolor)) if($dS_v->rcolor) {
			if(isset($ccorrl[$dS_v->rcolor])) $dS_v->cssColor = $ccorrl[$dS_v->rcolor];
				else { 
					msg(chr(9).'Warning: this color has no sync correlator in Mobminder:'.$dS_v->rcolor.' in item '.$dS_v->remoteId);
					$dS_v->cssColor = 0; // when rcolor is empty, reset the cssColor previously applied
				}
		}
		
		if($dS_v->mobile) {
			if(substr($dS_v->mobile,0,1)!='0') $dS_v->mobile = '+'.$dS_v->mobile; // for numbers arriving like 32497401626
			$dS_v->mobile = checkMobileFormat($dS_v->mobile, $dS_account->phoneRegion); 
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
		if(!$grscs->count()) abort(14, 'The target group has no resource');
		$rtypes = Array();
		foreach($grscs->keyed as $rsc) $rtypes[$rsc->id] = $rsc->resourceType;

	// each remote resource reference has possibly a local resource reference
	//
		$rsync = new C_dbAccess_synchro_resources($dS_accesskey->id);
		if(!$rsync->count()) abort(15, 'Resources have not been synchronized');
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