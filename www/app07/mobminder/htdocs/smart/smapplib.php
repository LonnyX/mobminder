<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//       S M A R T     A P P     A P I     L I B R A R Y 
//
//   Note: this file is an equivalent of webapp::ajax_session, 
//   but implements more dev & debug functions and more security checks
//

require '../../lib/php/webrender.php';

require '../../classes/language.php';
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/cues.php';

require '../../../lib_mobphp/mblox.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';


setrendermode();
set_urls($subdomainname = 'smart'); // see (*dv01*) in /lib/php/webrender.php


//////////////////////////////////////////////////////////////////////
//
//    T U T O R I A L 

function technicalspecH1() {
	global $web; if(!$web) return;
	h1('Technical specifications for this interface:');
}

function explainstream($classname,$s,$fields) {
	global $web; if(!$web) return;
	$e = '#';
	$e.= $classname.': ';
		$S = '';
	foreach($fields as $f) { $e.= $S.' '.$f.' '; $S = $s; }
	return $e;
}

define('all_fields', false);
function explainclass($instance, $fields, $sep) { // set fields to false to get an overview of all fields
		
		global $web; if(!$web) return;
	
		if(is_a($instance,'C_dbGate')) {
			$dS = $instance->getNew();
			$classname = get_class($dS);
		}
		else if(is_a($instance,'C_dbID')) {
			$classname = get_class($instance);
			$dS = new $classname();
		}
		else 
			abort('0080','explainclass() unrecognized class instance');
		
		if(!$fields) { // 
			$fields = Array('id','groupId');
			foreach($dS->getDefaults() as $fieldname => $explained) $fields[] = $fieldname;
		}
			
		h4('class '.$classname);
		indent(explainstream($classname,$sep,$fields).'<br/>&nbsp;');
			
		foreach($fields as $f) indent('o '.$f.': '.$dS->explain($f));
		pad();
}

function exlainloginputs($indent = 6) {
	
		h3('access credentials (mandatory)');
		
		indent('o lgn: your login as chosen on the account backoffice/accesses/', $indent);
		indent('o pwd: your password as chosen on the account backoffice/accesses/', $indent);
		indent('o kid: your numeric access key for this account, found on the account backoffice/accesses/your access/audit', $indent);
}

function payload() { // tutorial description on how to extract the payload from the server response
	
	global $web, $nl; if(!$web) return;
	
	notice('When not in web render mode, object(s) saved/retrieved to/from DB are available in the server response. The text format is UTF-8. The blueprint on this page shows the server response exactly as you get it when not in web mode.');
	notice('The usefull objects data is nested in &ltdata&gt tags. Please note that the payload can be surrounded by other textual information or performance reports.');
	h3('How do you extract the payload from the server response stream?');
	indent('1. Extract from the stream the text found between &ltdata&gt tags: &ltdata&gtpayload data&lt/data&gt');
	indent('2. Split the stream on chr(10) (newline), you obtain this array of lines:');
		pad(0); if($web) echo('<data>');
		indent('#C_dS_classname_1',6);
		indent('member1|member2|member3|... ...|memberX   <- instance 1 of C_dS_classname_1',6);
		indent('member1|member2|member3|... ...|memberX   <- instance 2 of C_dS_classname_1',6);
		indent('member1|member2|member3|... ...|memberX   <- instance 3 of C_dS_classname_1',6);
		indent('member1|member2|member3|... ...|memberX   <- instance 4 of C_dS_classname_1',6);
		indent('#C_dS_classname_2',6);
		indent('#C_dS_classname_3#bankA',6);
		indent('member1|member2|member3|... ...|memberY   <- instance 1 of C_dS_classname_3',6);
		indent('member1|member2|member3|... ...|memberY   <- instance 2 of C_dS_classname_3',6);
		if($web) echo('</data>');
		pad(0); 
	indent('3. Scan each line searching for a heading hash: #C_dS_classname#bankname');
	indent('4. The atomic word following the # is the class name for object(s) data you will find in the following lines (*1)');
	indent('5. Split every following lines on the pipe \'|\' so to extract objects members values. (*2)(*3)(*4)(*5)');
	indent('6. Stop instanciating objects of class C_dS_classname when you encounter a next heading #, start again at step 4 (*6)(*7).');
	
	h3('Caution');
	indent('(1*) The class name can be followed by a bank name: #C_dS_classname#bankname, bank name is optional and might be unused in your application.');
	indent('(2*) The pipe is by consequence an absolute disallowed character on the api interface. &lt and &gt are also disallowed.');
	indent('(3*) The sequence of members will always be respected in the future as per the technical description of fields specifies.');
	indent('(4*) The number of members might change in the future. So e.g. memberX+1 can be added to C_dS_classname_1. Keep your decoding script flexible.');
	indent('(5*) There might be no instance of C_dS_classname_2 in the stream. The blueprint example here is realistic.');
	indent('(6*) Multiline fields (like note) are slashed, so a newline appears like \n in such a field. The presence of a newline in a field will not affect the split on chr(10)');
	indent('(6*) New sections (classes and objects) might be added in the future. Keep your decoding script flexible.');
	
	h3('Algorythm');
	indent('The following algorythm is an exampe of how objects extraction is possible.');
		pad(0); if($web) echo('<code>');
	indent('var newline = String.fromCharCode(10);');
	indent('var rushsplit = stream.split(newline);');
	indent('var objects = new Array();');
	indent('var line, classname, bankname, instance, members, C_dS;');
	indent('while(line = rushsplit.shift()) { // extracts a section from the array');
	indent('	if(line == \'\') continue;',6);
	indent('	if(line[0] == \'#\') { // class name identification row',6);
	indent('		var classinfo = line.substring(1).split(\'#\');',9);
	indent('		classname = classinfo[0]; 	// classname is supposed to head the lines bulk',9);
	indent('		bankname = classinfo[1] || false; // bankname is optional and follows the classname',9);
	indent('		if(!objects[classname]) objects[classname] = new Array();',9);
	indent('		C_dS = C_inlineStreaming.classes(classname);',9);
	indent('	} else { // continue in current section',6);
	indent('		members = line.split(\'|\');',9);
	indent('		if(bankname) instance = new C_dS(bankname, members);',9);
	indent('			else instance = new C_dS(members);',12);
	indent('		objects[classname][instance.id] = instance;',9);
	indent('	}',6);
	indent('}');
	if($web) echo('</code>');
	pad(0); 

}






//////////////////////////////////////////////////////////////////////
//
//   G e n e r i c    i n p u t    p a r a m e t e r s     c h e c k i n g 
//

function checkRequest4sqlInjection() {
	
	$sqlinj = SQLinjectionScreen($_REQUEST);
	h2('Sql injection screening');
		if(!$sqlinj) indent('no thread');
		else abort('0000','possible SQL injection: '.$sqlinj);
}

function screenTrackingFieldsOverwrite() {
	 
	if(isset($_REQUEST['groupId'])) abort('0099','gate::You have no write access on the account id field');
	
	if(isset($_REQUEST['created'])) abort('0090','gate::You have no write access on the created field');
	if(isset($_REQUEST['creator'])) abort('0091','gate::You have no write access on the created field');
	if(isset($_REQUEST['creatorId'])) abort('0092','gate::You have no write access on the created field');

	if(isset($_REQUEST['changed'])) abort('0093','gate::You have no write access on the changed field');
	if(isset($_REQUEST['changer'])) abort('0094','gate::You have no write access on the changer field');
	if(isset($_REQUEST['changerId'])) abort('0095','gate::You have no write access on the changerId field');

	if(isset($_REQUEST['deleted'])) abort('0096','gate::You have no write access on the changed field');
	if(isset($_REQUEST['deletorId'])) abort('0097','gate::You have no write access on the changer field');
	
}

function fieldcleanup(&$item, $fname) { // field by field checkup on allowed characters


	$exclude_always 	= '/[|<>\\#"]/u'; 
		// those characters are never allowed in our system : 
		// pipes |  , due to our api data format interface
		// smaller bigger < > , can insert HTML js scritps or links or html inside our HTML rendering
		// backslash \  , allows to point subfolders
		// hashtags #
		// 
	
	$filter_address 	= '/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.,a-z A-Z0-9-\'\/\(\)]/';
	$filter_name 		= '/[^_ÀàâãçËÈÉéèëêôöîïñûùüÿ\.a-z A-Z0-9-\'\(\)]/';
	$filter_resource 	= '/[^_!\.a-zA-Z0-9-]/';
	$filter_email 		= '/[^@\._a-zA-Z0-9-]/';
	$filter_stamp 		= '/[^ 0-9-:]/';
	$filter_birthday 	= '/[^0-9-: ]/'; // allows ISO8601 time stamp like "1970-12-30 22:45:12"
	$filter_phone 		= '/[^0-9+]/';
	$filter_zip 		= '/[^a-zA-Z0-9]/';
	// note https://stackoverflow.com/questions/11044136/right-way-to-escape-backslash-in-php-regex
	
	if($item=='NULL') $item = ''; // nice joke from ATX DB extracts
	
	$item = preg_replace($exclude_always,'',$item);
	
	switch($fname) {
		
		case 'address':
		case 'city': 
		case 'country': 
			return preg_replace($filter_address,'',$item);
			
		case 'mobile':
		case 'phone': 
			return preg_replace($filter_phone,'',$item); break;
			
		case 'zipCode': 
			return preg_replace($filter_zip,'',$item);
			
		case 'lastname':
		case 'firstname': 
			return preg_replace($filter_name,'',$item);
			
		case 'birthday': 
			$bd = preg_replace($filter_birthday,'',$item); // can be 1970-12-30 or 19701230
			if(!is_numeric($bd)) {
				if(strlen($bd)>=10) if($bd[4]=='-'&$bd[7]=='-') $bd = substr($bd,0,4).substr($bd,5,2).substr($bd,8,2);
			}
			if($bd=='19010101' || $bd=='') return '0'; else return $bd;
			break;
		case 'email':
			$lower = strtolower($item);
			return preg_replace($filter_email,'',$lower);
			
		default:
			return $item;
	}
};

function fieldscleaner(&$array) { // all fields checkup on allowed characters
	$allok = true;
	if(count($array))
		foreach($array as $pname => &$pvalue) {
			$screened = fieldcleanup($pvalue, $pname);
			if(strcmp($screened,$pvalue)) {
				warning('fieldscleaner::'.$pvalue.' has been reduced to '.$screened);
				$pvalue = $screened;
				$allok = false;
			}
		}
	return $allok;
}

function fieldvalidation(&$value, $fname, $context, $strong = true) { // field by field checkup on allowed characters

	
	global $web, $nl, $script;
	
	if($value=='NULL') $value = ''; // nice joke from ATX DB extracts
	
	switch($fname) {
			
		case 'phone':
			if($value=='') return true; // user wishes to erase the previously recorded value. 
			// if($isphone = preg_match('/^(\+|0){1}([0-9])*/',$value)) return true; // PVH 2021 - make it as flexible as webapp (*pm01*)
			if($isphone = preg_match('/^([0-9])*/',$value)) return true;
			else abort('0080','phone field '.$value.' does not range [+0123456789]');
			
		case 'mobile':
			if($value=='') return true; // user wishes to erase the previously recorded value. 
			$screened = checkMobileFormat($value, $context->dS_account->phoneRegion);
			if(!$screened) warning('invalid mobile format:'.$value);
				else indent('mobile ok: '.$screened,6);
			$value = $screened;
			return true;
			
		case 'lastname':
			if(strlen($value)<2) abort('0081','mandatory field '.$fname.' must count 2 characters minimum');
			return true;
			
		case 'firstname': 
			if(strlen($value)<1) abort('0081','mandatory field '.$fname.' must count 1 characters minimum');
			return true;
			
		case 'birthday': 
			if($value=='') return true; // user wishes to erase the previously recorded value. 
			if($value==0) return true; // user wishes to erase the previously recorded value. 
			$birthday = $value;
			if(strlen($birthday)!=8) 
				abort('0082','Wrong birthday format:'.$birthday.'(expected YYYYMMDD)');
			$yyyy = substr($birthday,0,4);
				if($yyyy<1910 || $yyyy>Date('Y',time())) abort('0083','Wrong birthday value, year:'.$yyyy);
			$mm = substr($birthday,4,2);
				if($mm<1 || $mm>12) abort('0084','Wrong birthday value, month:'.$mm);
			$dd = substr($birthday,6,2);
				if($dd<1 || $dd>31) abort('0085','Wrong birthday value, day:'.$dd);
			$bd = $yyyy.'-'.$mm.'-'.$dd;
			$today = date("Y-m-d");
			if($today<$bd) abort('0086','Wrong birthday value, this date is in the future:'.$yyyy.'-'.$mm.'-'.$dd.', today is '.$today);
			
			indent('birthday format ok: '.$birthday,6);
			return true;
			
		case 'email':
			if($value=='') return true; // user wishes to erase the previously recorded value. 
			$email = $value;
			if($strong) {
				if(!filter_var($email, FILTER_VALIDATE_EMAIL))
					abort('0087','invalid email format:'.$email);
				else indent('email format ok: '.$email,6);
				return true;
			} else {
				if(strlen($email)<4) 
					abort('0087','invalid email length should be at least 4 chars long:'.$email);
				if(strpos($email,'@')===false) 
					abort('0087','invalid email format should contain a @:'.$email);
				return true;
			}
			
		case 'language':
			$l = $value;
			if(!is_numeric($l)) abort('0088','Wrong language format:'.$l);
			if($l<0 || $l>7) abort('0088','Wrong language value:'.$l);
			$languagename = L::getLanguageFromCode($l);
			indent('o '.$fname.' passed: '.$languagename.' ('.$l.')',6);
			return true;
			
		case 'gender': // see (*gc01*)
			$g = $value;
			if(!is_numeric($g)) abort('0089','Wrong gender format:'.$g);
			if($g<0 || $g>6) abort('0089','Wrong gender value:'.$g.'');
			return true;
			
		case 'cueIn':
		case 'cueOut':
			// are checked by C_apicontext::timeStampToUTC(), taking into account the time granularity, format, and range
			return true;
			
		default:
			return true; // not applicable
	}
};

function fieldsvalidator(&$array, $context, $strong = true) { // all fields checkup on allowed characters
	$allok = true;
	if(count($array))
		foreach($array as $pname => &$pvalue) {
			$screened = fieldvalidation($pvalue, $pname, $context, $strong);
			if($screened!==true) {
				$allok = false;
			}
			unset($pvalue,$pname);
		}
	return $allok;
}

class C_api {

	static public function fieldslist($classname) {
		
		// some of the classes are streamed from several api gates
		// in order to be sure we stay coherent as per the number and sequence of fields returned,
		// we keep here the list of fields. 
		// New fields may be appened to this list, but the order must be kept and no field can be removed !
			
		switch($classname) { 
			case 'C_dS_visitor':
				return Array('id','created','creator','creatorId','changed','changer','changerId','deleted','deletorId','mergedTo',
							 'gender','lastname','firstname','company','address','residence','zipCode','city','country',
							 'email','mobile','phone','language','birthday','registration','reference','note',
							 'cssColor','cssPattern','cssTags','selection');
				break;
			case 'C_dS_reservation':
				return Array('id','created','creator','creatorId','changed','changer','changerId','deleted','deletorId','rversion','peerId','iscluster',
					'cueIn','cueOut','note','bookingcode',
					'waitingList','cssColor','cssPattern','cssTags','rescheduled','serieId','snext','sprev','archived','prebooking');
				break;
			case 'C_dS_login':
						$sign 		= Array('id','gender','lastname','firstname','company','language','residence','address','zipCode','city','country','email','mobile','phone','profession');
						$options 	= Array('GMT','weeknumb','color','permissions','accessLevel','tag');
					return array_merge($sign,$options);
				break;
		}
	}
}


function bitfield_display($v, $max = false) { // returns a string like 0000 0010 1010 1111 little endian
	if($max===false) $max = (1<<27);
	$s = '';
	for($c=1, $o=2, $b=2; $c<=$max; $c<<=1, $o<<=1, $b<<=1) {
		// echo $max.' - '.$c.'<br>';
		if($v&$c) $s='1'.$s; else $s='0'.$s;
		if($o==(1<<4)) {$o=1; $s=' '.$s;} // add space every 4 bits
		if($b==(1<<8)) {$b=1; $s=' -'.$s;} // add byte space every 8 bits
	}
	return $s;
}

//////////////////////////////////////////////////////////////////////
//
//      A C C O U N T    C O N T E X T  


class C_shortlogin {
	
	public $dS_login;
	
	public function __construct($xpected_alevel = false, $loadcontext = 0) {
		if(!isset($_REQUEST)) abort('0001','Missing post, check your form-multipart encoding');
		if(count($_REQUEST)==0) abort('0002','None parameter in post, check your form-multipart encoding');

		if(!isset($_REQUEST['lgn'])) abort('0003','You must specify a login');
		if(!isset($_REQUEST['pwd'])) abort('0004','You must specify a password');
		$login 	= $_REQUEST['lgn'];
		$pass 	= $_REQUEST['pwd'];
		
			$dS_login = C_dS_login::logon($login, $pass);
			if(!$dS_login) abort('0006','Wrong login/pass combination');
		$this->dS_login = $dS_login;
		
		$al = $this->dS_login->accessLevel;
		if($xpected_alevel) { // smartphone app
			if(!in_array($al,$xpected_alevel))
				abort('0007','You do not have the expected access level');
		}
		
		C_dbIO::logged($this->dS_login,'(Smartapp)'); // sign any change in DB
		
		$ip = $_SERVER['REMOTE_ADDR'];
		indent('Login success:');
		indent('o IP address: '.$ip );
		indent('o Login id: '.C_dbIO::$loggedId );
		indent('o Login name: '.C_dbIO::$loggedName );
	}
	
	public function geturiaccessparms($key = false) {
		if($key) $k = '&kid='.$key; else $k = '';
		return 'lgn='.$this->dS_login->login.'&pwd='.$this->dS_login->password.$k;
	}
}

class C_apicontext {
	
	public $accountid;
		public $is_single_account;  // the account has only one resource
		public $is_single_view;		// the login view sees a single resource (the account might have many)
		public $is_limited_view;
		public $is_full_view;
	public $rscids_account; // list of rscIds coma separated including all resources of the account
	public $rscids_view;	// list of rscIds coma separated only the one resources in the login view
		public $acc_rscs_cnt;
		public $view_rscs_cnt;

	public $dS_login;
	public $dS_accesskey;
	public $dS_account;
	
	public $resources;
	public $rsc_correllators; // C_dbAccess_synchro_resources
	public $customCsss;
	public $hourliesusers;
	public $hourlies;
	public $timeboxings;
	public $timeboxes;
	public $shadows;
	
	public $workcodes;
	public $workexperts;
	public $worktboxing;
	
	public $details;
	public $catalysts;
	
	public function __construct($xpected_alevel = false, $loadcontext = 1, $perfReport = false) {
		
		$kid = false;
		if(isset($_REQUEST['kid'])) {
			
			$kid = $_REQUEST['kid'];
			if(!is_numeric($kid))
				abort('0006','invalid key format');
		} else
			abort('0005','it looks like your key does not exist');
		
		
		$ip = $_SERVER['REMOTE_ADDR'];
		
		if(!isset($_REQUEST)) abort('0001','Missing post, check your form-multipart encoding');
		if(count($_REQUEST)==0) abort('0002','None parameter in post, check your form-multipart encoding');

		if(!isset($_REQUEST['lgn'])) abort('0003','You must specify a login');
		if(!isset($_REQUEST['pwd'])) abort('0004','You must specify a password');
		$login 	= $_REQUEST['lgn'];
		$pass 	= $_REQUEST['pwd'];
		
			$dS_login = C_dS_login::logon($login, $pass);
			if(!$dS_login) abort('0006','Wrong login/pass combination');
		$this->dS_login = $dS_login;
		
		if($perfReport) $perfReport->peak(' -- C_apicontext::C_dS_login');
		

		$al = $this->dS_login->accessLevel;
		if($xpected_alevel) { // smartphone app
			if(!in_array($al,$xpected_alevel))
				abort('0007','You do not have the expected access level');
		}


		$q = new Q('SELECT id FROM accesskeys WHERE id='.$kid.' AND groupId='.$dS_login->id.';');
		$kid = $q->ids(); 
		if(!$kid) abort('0008','Wrong accesskey/login combination');

		
		$this->dS_accesskey = new C_dS_accesskey($kid);
		
		if($perfReport) $perfReport->peak(' -- C_apicontext::C_dS_accesskey');
		
		
		$this->dS_account = new C_dS_group($this->dS_accesskey->accountId);
		$this->accountid = $this->dS_account->id;
		
		if($perfReport) $perfReport->peak(' -- C_apicontext::C_dS_group');
		
		C_date::setTimeParameters($this->dS_account);
		C_dbIO::logged($this->dS_login,'(Smartapp)'); // sign any change in DB
		
		indent('Login success:');
		indent('o IP address: '.$ip );
		indent('o Login id: '.C_dbIO::$loggedId );
		indent('o Login name: <font color=blue>'.C_dbIO::$loggedName.'</font>' );
		indent('o Logged on account: <font color=red>'.$this->dS_account->name.'</font>' );
		indent('o Account id: '.$this->dS_account->id);
		
		
		if($perfReport) $perfReport->peak(' -- C_apicontext::setTimeParameters');
		
		
		//    A C C O U N T    R E S O U R C E S
		//
			$allrsc = new Q('select id from resources where groupId = '.$this->accountid.';');
			$rc = $allrsc->cnt();
		
		$this->resources = new C_dbAccess_resources($this->accountid, $this->dS_accesskey); // loads them according to key view
		$rescIds = $this->resources->viewIds ? $this->resources->viewIds : $this->resources->getIdsList();
		$vc = $this->resources->count();
		
		$this->is_single_account = $rc==1;
		$this->is_single_view = $vc==1;
		$this->is_limited_view = $rc>$vc;
		$this->is_full_view = $rc==$vc;
		$this->rscids_account = $allrsc->ids(list_as_string); // coma list - all resources of this account
		$this->rscids_view = $rescIds; // coma list - as visible for the login
		$this->acc_rscs_cnt = $rc;
		$this->view_rscs_cnt = $vc;
		
		if($perfReport) $perfReport->peak(' -- C_apicontext::account resources');
		
		indent('o This account is single: '.($this->is_single_account ? 'yes' : 'no, '.$rc.' resources') );
		indent('o This view is single: '.($this->is_single_view ? 'yes' : 'no, '.$vc.' resources') );
		indent('o Resources view ids: '.$rescIds );
		
		
		
		///////////////////////////////////////////////////////////////////////
		//
		// extended context load after this point
		
		if(!$loadcontext) return $this;
		
		
		
		//    A C C O U N T    C S S
		$this->customCsss = new C_dbAccess_customCss($this->dS_account->id);
		
		
		//    H O U R L I E S
		//
		
		
			//    H O U R L I E S    U S E R S
			$this->hourliesusers = new C_dbAccess_hourliesusers($rescIds); // only hourlies used in the given view
					if($perfReport) $perfReport->peak('streamGroup::o_dbAccess_hourliesusers done');
						
					$hourliesIds = $this->hourliesusers->getHourliesIds();
				
					if($perfReport) $perfReport->peak(' -- C_apicontext::hourliesusers');
			
			
			//    H O U R L I E S
			$this->hourlies = new C_dbAccess_hourlies();
			$this->hourlies->loadOnId($hourliesIds);
		
					if($perfReport) $perfReport->peak(' -- C_apicontext::hourlies');
						
			
			//    A C C O U N T    T I M E    B O X E S 
			$this->timeboxings = new C_dbAccess_tboxings($this->dS_account->id);
			
					if($perfReport) $perfReport->peak(' -- C_apicontext::timeboxings');
		
		
				//    H O U R L I E S   T I M E   B O X E S
				$this->timeboxes = new C_dbAccess_timeboxes($hourliesIds);
		
						if($perfReport) $perfReport->peak(' -- C_apicontext::timeboxes');
						

				//    H O U R L I E S   S H A D O W S 
				$this->shadows = new C_dbAccess_shadows($hourliesIds);
			
						if($perfReport) $perfReport->peak(' -- C_apicontext::hourlies');
		
		
		
		
		//	  W O R K C O D E S
		//
		// We dump all the workcodes of the account, it's up to the client device to filter:
		// - display only the workcodes that are assignable to the resource, according to workexperts settings
		// - in case a non expert performance was assigned by a wider viewing login, display it anyway
		//
		
		
			//    W O R K     C O D E S  (keep this after experts streaming)
			$this->workcodes = new C_dbAccess_workcodes($this->accountid);
			$wkids = $this->workcodes->getIdsList();
			
				if($perfReport) $perfReport->peak(' -- C_apicontext::work codes');
			
			
			//    E X P E R T S    F O R    W O R K   C O D E S 
			$this->workexperts = new C_dbAccess_workexperts($wkids);
			
				if($perfReport) $perfReport->peak(' -- C_apicontext::experts');
			
			
			//    T I M E    B O X I N G    F O R    W O R K   C O D E S 
			$this->worktboxings = new C_dbAccess_worktboxing($wkids);
			
				if($perfReport) $perfReport->peak(' -- C_apicontext::work timeboxing');
		
		
		
		
		// 	D I S P L A Y    P R E F E R E N C E S 
		//
		
			// H O R I Z O N T A L ,  V E R T I C A L ,   a n d   L I S T    d i s p l a y    P R E F E R E N C E S (grouped by key id)
			
			$this->details = new C_dbAccess_details($this->dS_accesskey->id); // are grouped by key Id
	
					if($perfReport) $perfReport->peak(' -- C_apicontext::display details');


			// C A T A L Y S T S   ( table display preferences, by key id)   -- not yet applicable for smartphone
			// $this->catalysts = new C_dbAccess_catalysts($this->dS_accesskey->id); // are grouped by key Id
	
					// if($perfReport) $perfReport->peak(' -- C_apicontext::display catalysts');
		
	
	}
	
	public function geturiaccessparms($anotherkey = false, $withkey = true) {
		if($withkey) {
			$k = $this->dS_accesskey->id; if($anotherkey) $k = $anotherkey;
			$k = '&kid='.$k;
		} else {
			$k = '';
		}
		
		return 'lgn='.$this->dS_login->login.'&pwd='.$this->dS_login->password.$k;
	}

	public function request_cid($mandatory = true, $virtual = false, $archive = false) { // @$_REQUEST['cid'] including validation
		
		// global $_REQUEST;
		$cid = @$_REQUEST['cid']; if(isset($cid)) $cid = $cid; else $cid = false;
		if($mandatory) if($cid===false) abort('3200','missing mandatory field cid');
		if(!$mandatory) if($cid=='') return $cid;
		if(!is_numeric($cid)) abort('3201','bad format for cid :'.$cid);
		
		$isnew = $cid<=0; $isedit = !$isnew;
		if($isedit) {
			$q = new Q('select groupId from chat_threads where id  = '.$cid.';'); // select groupId so we can check account scope in the same atomic action
			$gid = $q->groupIds();
			if(!$gid) if($archive) { // give it a try on archive_ table
				$q = new Q('select groupId from archive_chat_threads where id  = '.$cid.';');
				$gid = $q->groupIds();
			}	
			if(!$gid) abort('3202','invalid cid, '.$cid.' not found');
			if($gid != $this->accountid) abort('3203','stay in your playground');
		} else
			if(!$virtual) if($isnew) abort('3204','invalid cid, '.$cid.' virtual not allowed on this script');
		
		return $cid;
	}

	public function gethumanloginsmin() {
		
			$q = new Q('select distinct groupId as id from accesskeys where accountId = '.$this->accountid.';'); // access keys group to logins, we collect all distinct login ids
			$lids = $q->ids(list_as_string); // these logins are potential chat participants (eresa logins and synchro logins are not part of this game)
		$logins = new C_dbAccess_logins_min($lids, aLevels_humans);
		return $logins;
	}
	
	public function get_rclass_type($rclass) {
		switch($rclass) { 
			case class_bCal: $name = 'bCals'; break; 
			case class_uCal: $name = 'uCals'; break; 
			case class_fCal: $name = 'fCals'; break;
			case class_visitor : $name = 'visitor'; break;
			default: $name = 'wrong class code in input';
		}
		return $name;
	}
	
	public function isValidResource($rid) {
		if(array_key_exists($rid, $this->resources->keyed)) 
			return $this->resources->keyed[$rid]->name;
		return false;
	}
	
	public function isValidResourceCorrelator($remoteId) {
		return $this->rsc_corrl->getLocalId($remoteId);
	}
	
	public function isValidResourceClass($rid, $class) {
		if(array_key_exists($rid, $this->resources->keyed)) 
			if($this->resources->keyed[$rid]->resourceType == $class) return $this->resources->keyed[$rid]->resourceType;
		return false;
	}
	
	public function isValidReservation($rid) {
		$q = new Q('select id from reservations where id = '.$rid.' and groupId = '.$this->accountid.' limit 1;');
		$found = $q->ids();
		if($found) return $found;
		else { // check archives
			$q = new Q('select id from archive_reservations where id = '.$rid.' and groupId = '.$this->accountid.' limit 1;');
			$found = $q->ids();
			if($found) return $found;
		}
		return false;
	}
	
	public function timeStampToUTC($stamp, $utc = false) { // note that this function accepts time stamp format "2011-01-01 00:00" or UTC format 1293836400
		if($utc) { // then the input is supposed to be UTC integer
			if(!is_numeric($stamp)) abort('0012','utc time should be numeric (received:'.$stamp.')');
			return $stamp;
		}
		$format = $this->isValidCueFormat($stamp);
		$value = $this->isValidCueValue($format); // returns an array like [2011-01-01 00:00, 1293836400]
		if($value[0]!=$stamp) warning($stamp.' has been reduced to '.$value[0]);
		return $value[1];
	}
	
	public function isValidCueFormat($cue) { // validates the time stamp format 'YYYY-MM-DD HH:MM:SS'
		$l = strlen($cue);
		if($l<>19&&$l<>16) abort('0010','time stamp wrong format (received:'.$cue.')');
		if($l==19) $cue = substr($cue,0,16); // ignore seconds
		if($isdate = preg_match('/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])/',$cue))
			// this preg_match allows midnight timing like 2020-07-10 00:00
			return $cue;
		else 
			abort('0011','time stamp out of range (received:'.$cue.')');
	}
	
	public function isValidDateFormat($d) { // validates the time stamp format 'YYYY-MM-DD'
		$l = strlen($d);
		if($l<>10) abort('0013','date stamp wrong format (received:'.$d.', expected YYYY-MM-DD)');
		if($isdate = preg_match('/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/',$d))
			return $d;
		else 
			abort('0011','time stamp out of range (received:'.$cue.', expected YYYY-MM-DD)');
	}
	
	public function isValidCueValue($cue) {
		$one = str_replace(' ','-',$cue);
		$two = str_replace(':','-',$one);
		$split = explode('-',$two);
		$y = $split[0]; if($y<2010||$y>2039) abort('0012','time stamp year is out of range [2010,2039]');
		$m = $split[1];
		$d = $split[2]; 
		$h = $split[3]; 
		$n = $split[4]; 
		$n = $this->tilt($n, $this->dS_account->timeSlice);
		if($n=='60') { $n='00'; $h++; if($h<10) $h = '0'+$h; }
		$sdate = $y.'-'.$m.'-'.$d.' '.$h.':'.$n;
		$utc = strtotime($sdate); // note that strtotime will accept as input 2010-12-31 24:00 
		return array(Date('Y-m-d H:i',$utc),$utc); // returns an array like [2011-01-01 00:00, 1293836400]
	}
	
	
	
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
	
}




?> 