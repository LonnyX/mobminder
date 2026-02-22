<?php


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E : 
//
// Dev & Test : http://localhost/comm/2018-08-Selfie/emails.php?fn=myfile
//
// filename (fn) is optional, when not used, emails are taken from the logins data table in mobminder db. filters specifications in this file. 
// &test=1 : test mode is enabled by default: sends emails only to a couple of selected emails, for pre-prod check purpose
// &do=0 : actual sending is disabled by default. Use &do=1 to send to the test sample, or &test=0&do=1 to execute final sending.
//
// Effective sending: http://be.mobminder.com/utilities/mobnewyear/emails.php?do=1&test=0
//
// 	OR
// 
// Effective sending: http://be.mobminder.com/utilities/mobnewyear/emails.php?fn=myfile&do=1&test=0
//
// pre-requisite: a file test.csv must be present in the utilities directory.
// When the mailing is tested and ready, replace test.csv by targets.csv
//

require '../../../lib_mobphp/dbio.php';

//////////////////////////////////////////////////////
//
//  Echo functions
//
$allin = microtime(true);
$out = '';
function error($msg, $handle = false) { 
	global $out;
	if($handle) { fclose($handle); }
	$out.='<h3>'.$msg.'</h3>'; 
	echo html($out); 
	die('<br/>Ending execution'); 
}

function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds
function h1($t) { return '<h1 style="white-space:nowrap; color:#7595AF; font-size:1.4em;">'.$t.'</h1>'; }
function h2($t) { return '<h2 style="white-space:nowrap; color:	#a4b357; font-size:1.1em; font-weight:bold;">'.$t.'</h2>'; }
function notice($msg) { return '<p>'.$msg.'</p>'; }
function warning($msg) { return '<p style="color:orange">'.$msg.'</p>'; }
function micro($msg) { return '<p style="color:blue; padding-left:3em; font-size:80%; line-height:70%;">'.$msg.'</p>'; }
function microtab($msg) { return '<p style="color:red; padding-left:6em; font-size:75%; line-height:70%;">'.$msg.'</p>'; }
function html($content, $example = '') {
		$pathfile = $_SERVER["SCRIPT_NAME"];
		$break = Explode('/', $pathfile);
		$thisScript = $break[count($break) - 1]; 

		$o = '<!DOCTYPE HTML>';
		$o .= '<html>';
			$o .= '<head>';
			$o .= '<title>'.$thisScript.'</title>';
			$o .= '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">';
			$o .= '<link href="./basics.css" rel="stylesheet" type="text/css">';
			$o .= '<head>';
		$o .= '<body><div class="verbose">'.$content.'</div>'.$example.'</body></html>';
		return $o;
}
$paddy = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
$out .= h1('mobminder email sender');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['fn'])) $filename = $_GET['fn']; else $filename = false;
$do = false; if(isset($_GET['do'])) $do = !!$_GET['do'];
$test = true; if(isset($_GET['test'])) $test = !!$_GET['test']; 

if($filename) {

	$out .= notice('<b>Using file: '.$filename.'.csv</b>');
	
	$filename = $filename.'.csv'; if (!file_exists($filename)) error('No corresponding csv file: '.$filename);
	$handle = fopen($filename,'r'); if(!$handle) error('The file exists but could not be opened: '.$filename);

	$line1 = fgets($handle); if($line1=='') error('The file is empty: '.$filename, $handle);

	$out .= h2('File opened: '.$filename); $out .= notice('<b>First line: </b>'.$line1);

	$crlf = 0;
	if(substr($line1,-2)==chr(13).chr(10)) { $crlf = 2; $out .= notice('Lines are feeded with <b>CRLF</b>'); }
		else if(substr($line1,-1)==chr(10)) { $crlf = 1; $out .= notice('Lines are feeded with <b>LF</b>'); };

	$headers = explode(';',substr($line1,0,-$crlf)); // strips CRLF
	if(!in_array('gender',$headers)) error('Missing mandatory header: gender', $handle);
	if(!in_array('lastname',$headers)) error('Missing mandatory header: lastname', $handle);
	if(!in_array('firstname',$headers)) error('Missing mandatory header: firstname', $handle);
	if(!in_array('email',$headers)) error('Missing mandatory header: email', $handle);
	if(!in_array('account',$headers)) error('Missing mandatory header: account name', $handle);
	if(!in_array('alias',$headers)) error('Missing mandatory header: visitor alias', $handle);

}

$dS_system = new C_dS_system();
$local = !$dS_system->sendComm;

//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//


if($filename) {
	
	$cuein = microtime(true);
	$lcount = 0; $skipcount = 0; $ccount = count($headers)-1; $lines = array();
	
	function normal(&$item, $key) { // this function is applied to each and single field (*#*)
		if(isset($item)) $item = trim($item); else $item=''; 
	};

	while(!feof($handle)) {
		$line = substr(fgets($handle),0,-$crlf);
		$lcount++;
		if($line=='') { $out .= notice('<b>Skipping line: </b>'.($lcount+1).' (this line is empty)'); continue; }
		if(substr_count($line, ';') != $ccount) { // may be an empty line, anyway it doesnt count the right number of cells!
			$skipcount++; $out .= notice('<b>Skipping line: </b>'.($lcount+1).' (columns count does not match:'.$line.')'); continue; 
		}; 
		
		$utf8 = iconv('ISO-8859-1', 'UTF-8', $line); // all the line is set to lowercase, then converted to utf8 (sequence is important)
		
		// $slashed = addslashes(strtolower($utf8));
		// $slashed = strtolower($utf8);
		
		$split = explode(';',$utf8); array_walk($split,'normal');
		$lines[] = $split; 
	}
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$lcount -= $skipcount;
	$out .= h2('The file has been read in: '.$cuedelta.', it counts '.$lcount.' valid lines - count:'.count($lines) );
	fclose($handle);
	if(!$lcount) error('No valid lines were found');

}
else 
{ 		// read from DB

	$out .= notice('<b>Using DB query: '.'</b>');

	// State excluded wallets
	//
	$xcludedwallets = '(9087,9089,7896,9086,8330,9085,8409,8384,11809,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511,7922,8840,9088,9090,10298)';
	$q = new Q('select id, lastname, firstname, company, accessLevel, language from logins where id in '.$xcludedwallets.';');
	$out .= notice('<b>'.$q->cnt().' excluded wallets:</b>');
	while($row = $q->result->fetch_array()) {
		$id = $row['id']; $fname = $row['firstname']; $lname = $row['lastname']; $company = $row['company']; $language = $row['language']; $alevel = $row['accessLevel'];
		$out .= notice($paddy.'['.$id.'] '.$lname.','.$fname.' ('.$company.','.$language.') '.$alevel);
	}
	
	// State included wallets
	//
	$q = new Q('select id, lastname, firstname, company, accessLevel, language from logins where accessLevel >= 8 and id not in '.$xcludedwallets.';');
	$out .= notice('<b>'.$q->cnt().' included wallets:</b>');
	while($row = $q->result->fetch_array()) {
		$id = $row['id']; $fname = $row['firstname']; $lname = $row['lastname']; $company = $row['company']; $language = $row['language']; $alevel = $row['accessLevel'];
		$out .= notice($paddy.'['.$id.'] '.$lname.','.$fname.' ('.$company.','.$language.') '.$alevel);
	}
	
	// Now commecting emails
	
	$headers = 'email, profession, gender, firstname, lastname, language, account, alias, sellerfname, sellerlname';
	$q = '
		select DISTINCT '.$headers.' from (

select accesskeys.groupId as sellerId, logins.lastname as sellerlname
			, logins.firstname as sellerfname, logins.login, logins.password 
			, accounts.name as account, accounts.creator , accounts.visitorAlias as alias 
			, alogins.id as loginId, alogins.language as language
			, alogins.profession, alogins.gender, alogins.lastname as lastname, alogins.firstname as firstname
			, alogins.mobile, alogins.email, alogins.created
	from accesskeys 
	join logins on accesskeys.groupId = logins.id -- seller login
	join groups as accounts on accesskeys.accountId = accounts.id 
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id
		
	where logins.accessLevel >= 8 and alogins.accessLevel <= 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
			and alogins.profession in(101,102,103,104) -- only dentists
		and accesskeys.groupId not in '.$xcludedwallets.' -- exclude some resellers
		and alogins.email <> ""
		and alogins.lastname <> ""
		and alogins.firstname <> ""
	order by logins.lastname, logins.firstname, accounts.name asc) ALIAS 

order by email asc;
	
	';
	
	$cuein = microtime(true);
	$queried = new Q($q);
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	$lcount = $queried->cnt();
	$out .= h2('The DB has been read in: '.$cuedelta.', it counts '.$lcount.' records' );
	 
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  MAKE RECIPIENTS
//
class C_email {
	public $dear;
	public $addressee;
	public $email;
	public $account;
	public $alias;
	public $company;
	public $language;
	public $boundary;
	public function __construct($gender, $fname, $lname, $email, $account, $language, $alias) {
		
		switch($gender) { // see gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 0: $dear="Chère"; $gender = "Mme"; break; 
			case 1: $dear="Cher"; $gender = "Mr"; break; 
			case 2: $dear=""; $gender = ""; break; 
			default: $dear=""; $gender = "";
		}
		
		switch($alias) { // see (*va00*)
			case 200: $this->alias = 'patients'; $this->company = 'Le centre médical du bonheur'; break; 
			case 150: $this->alias = 'participants'; $this->company = 'L\'équipe du FOREM'; break; 
			case 100: $this->alias = 'clients'; $this->company = 'L\'équipe de la Maison Feel Good'; break; 
			default: $this->alias = 'contacts'; $this->company = 'L\'équipe de la compagnie JetAir';
		}
			$fname = ucwords($fname);
			$lname = ucwords($lname);
		$this->dear = $dear.' '.$gender.' '.$lname;
		$this->addressee = $fname.' '.$lname;
		$this->email = $email;
		$this->account = $account;
		$this->language = $language;
		$this->boundary = uniqid('np');
	}
	public function display() {
		return $this->dear.' ( '.$this->email.' | '.$this->account.' | '.$this->alias.' | '.$this->language.' | '.$this->company.' )';
	}
	public function subject() { return 'Dentex - Mobminder - Dentasoft - Offre exclusive'; }
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	public function html() {
	
		global $local;
		$path = 'http://be.mobminder.com/comm/'; if($local) $path = '../';
		
	
		$linkMobContact = '<a href="http://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="http://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';

		$logoMob1 = '<a href="http://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style=" height:8em; max-height:8em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoMob2 = '<a href="http://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style=" height:10em; max-height:10em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoDent = '<a href="http://www.dentasoft.be" target="_blank"><img src="'.$path.'images/dentasoft.jpg" style=" height:5em; max-height:5em;" alt="DentaSoft" border="0" style="border:none;"></a>';
		
		$selfiers = '<img src="'.$path.'images/2selfiersCrop.jpg" style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$allfine = '<img src="'.$path.'images/allfine.jpg" style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$rightHalfCup = '<img src="'.$path.'images/rhalfcup.jpg" style=" height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$leftHalfCup = '<img src="'.$path.'images/lhalfcup.jpg" style=" height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$champaign = '<img src="'.$path.'images/champaign.jpg" style=" height:36em; max-height:36em;" alt="Cup" border="0" style="border:none;">';		
		$duet = '<img src="'.$path.'images/duet.jpg" style="width:100%" alt="duet" border="0" style="border:none;">';		
		
		$sequence = Array();
		
		/////// Main communication body 
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em; padding-bottom:0em;">
					<p style="color:#5D98EF; font-size:1.4em; text-align:center; padding-top:1em; padding-bottom:0em;">
					'.$this->dear.', à l\'occasion du salon DENTEX<br/> nous souhaitons vous faire un cadeau
					</p>
				</td>			
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:right;">
					<div style="text-align:center; overflow:hidden;">'.$allfine.'</div>
				</td>
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>Mobminder est désormais un partenaire de <strong>DentaSoft</strong>, dont voici les atouts principaux:</p>
				<ul>
					<li>C\'est la solution actuellement <strong>la moins cher du marché</strong></li>
					<li>Agréé INAMI / RIZIV / eHealth</li>
					<li>Services MyCareNet intégrés</li>
					<li>Synchronisation avec Mobminder</li>
				</ul>
				
					<p style="color:#FF6D13; font-size:1.4em; text-align:center; padding-top:1em; padding-bottom:1em;">
					DentaSoft est gratuit 6 mois pour les clients Mobminder
					</p>
					<p>Pour bénéficier de cette promotion, vous devez prendre un RDV pour une démo avant la fin du salon Dentex, ce samedi 6 Octobre.</p>
					<p>Vous pouvez joindre DentaSoft au numéro suivant: +32 (0)497 3131 28 ou sur www.dentasoft.be </p>
					<p>Sur le salon, retrouvez Mobminder sur le stand 5648 et DentaSoft sur le stand voisin 5745</p>
				</td>			
			</tr>
		</table>';
				
		
		/////// LOGO Signature
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="text-align:center;">
				<div style="text-align:center;">'.$logoMob2.'</div>
				<div style="text-align:center;">'.$linkMob.'</div>
				<div style="text-align:center;">'.$logoDent.'</div>
			</td>
		</tr>
		</table>';
		
		
		
		
		/////// Nesting inside body, adding headers
		//
		$main = '<table border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #DDDDDD; margin:50px auto; background-color:#FFFFFF;">
				<tr><td>'.implode('',$sequence).'</td></tr></table>';
		$center = '<center>'.$main.'</center>';

		return $center;
	}
	public function body() {
		$body = '<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#C3E351; width:100% !important;">'.$this->html().'</body>';
		return $body;

	}
	public function msg() { // compose message from html and plain text parts
		
		//here is the content body
		$m = "This is a MIME encoded message.";
		$m .= "\r\n\r\n--" . $this->boundary . "\r\n";

		//Plain text body
		$m .= "Content-type: text/plain;charset=utf-8\r\n\r\n";
		$m .= $this->plaintextbody();
		$m .= "\r\n\r\n--" . $this->boundary . "\r\n";

		//Html body
		$m .= "Content-type: text/html;charset=utf-8\r\n\r\n";
		$m .= $this->body();
		$m .= "\r\n\r\n--" . $this->boundary . "--";
		
		return $m;
	}
	public function send() { // invokes PHP mail to mailsever
		
		if(!$this->email) return true; // skip this oject having no email
		
		//specify the email address you are sending to, and the email subject
		$namee = $this->addressee.' <'.$this->email.'>';
		
		//headers - specify your from email address and name here
		//and specify the boundary for the email
		$headers  = "MIME-Version: 1.0\r\n";
		$headers .= "From: Mobminder <communication@mobminder.com>\r\n";
		$headers .= "To:".$namee."\r\n";
		$headers .= "Reply-To: Mobminder <communication@mobminder.com>\r\n"; // only appearing on user interface, used by mail programs at client side
		$headers .= "X-Mailer: Mobminder/1.0\r\n";
		$headers .= "Content-Type: multipart/alternative;boundary=".$this->boundary."\r\n";

		$message = $this->msg();

		//invoke the PHP mail function
		$result = mail('', $this->subject(), $message, $headers);
		return $result;
	}
	public function stripoff() {
		$in = $this->html();
		$out  = preg_replace('/<[^>]*>/', '', $in);
		$out  = trim(preg_replace('/\t+/', '', $out));
		$out  = preg_replace( '/\n\r/si', '', $out );
		return $out;
	}
}


$recipients = Array(); 
$byemail = Array(); 

if($filename) {

	foreach($lines as $x => $split) { // scan lines

		$skipit = false;
		foreach($headers as $hcount => $header) { // scan fields inside line
			$value = $split[$hcount]; $language = 0;
			switch($header) {
				case 'gender': $gender = $value; break;
				case 'language': $language = $value; break;
				case 'firstname': $fname = $value; break;
				case 'lastname': $lname = $value; break;
				case 'account': $account = $value; break;
				case 'alias': $alias = $value; break;
				case 'email': $email = $value; if(!$email) $skipit = true; break;
				default: break;
			}
		}
		$oemail = new C_email($gender, $fname, $lname, $email, $account, $language, $alias);
		if($skipit) continue;
		if(isset($byemail[$email])) continue;
		$recipients[] = &$oemail; $byemail[$email] = 1; unset($oemail); // have only distinct occurances of emails in the campaign
	}

}
else 
{ 		// treat from DB


	while($row = $queried->result->fetch_array()) {

		$skipit = false;
		$gender = $row['gender'];
		$fname = $row['firstname'];
		$lname = $row['lastname'];
		$email = $row['email']; if(!$email) $skipit = true; 
		$account = $row['account'];
		$language = $row['language'];
		$alias = $row['alias'];
		
		$oemail = new C_email($gender, $fname, $lname, $email, $account, $language, $alias);
		if($skipit) continue;
		if(isset($byemail[$email])) continue;
		$recipients[] = &$oemail; $byemail[$email] = 1; unset($oemail); // have only distinct occurances of emails in the campaign
	}
	

}
	$ecount = count($recipients);
	$out .= h2('Remaining distinct emails: '.$ecount );

//////////////////////////////////////////////////////////////////////////////// 
//
//  send emails
//

	$out .= h2('list of email objects: '.count($recipients) );
foreach($recipients as $x => $a) { 
	if($x == 10) {
		$out.= notice( '... another '.($ecount-10).' email targets are not displayed here.');
		break;
	}
	$out.= notice( ($x+1).': '.$a->display());
}

$out.= notice('<br/>&nbsp;');

if($test===true) 
	$out .= warning('<strong>Test mode by default. Go to prod mode using &test=0</strong>');

if($test) { // select here a test audience for reviewing the email
	
	
	$recipients = Array(); 
		$recipients[] = new C_email(1, 'Pascal', 'Vanhove', 'pascal.vanhove@mobminder.com', 'La maison du bonheur', 2, 150);
		$recipients[] = new C_email(0, 'Lucas', 'Sensasis', 'sensasis@live.be', 'Epifun', 3, 200);
		$recipients[] = new C_email(1, 'Keevin', 'Pierre', 'keevin@mobminder.com', 'Epifun', 3, 200);
		$recipients[] = new C_email(1, 'Giraud', 'Derlet', 'giraud@mobminder.com', 'Epifun', 3, 200);
		$recipients[] = new C_email(0, 'Streep', 'Viviane', 'vivi@dentasoft.be', 'Epifun', 3, 200);
	
	$ecount = count($recipients);
	
	$out .= h2('Number of emails in the test set: '.$ecount );
	foreach($recipients as $x => $a) { 
		$out.= notice( ($x+1).': '.$a->display());
	}
	$out.= notice( 'You are in test audience mode, emails will be sent to the test audience only.');
}

$out.= notice('<br/>&nbsp;');

//////////////////////////////////////////////////////////////////////////////// 
//
//  send emails
//


$example = '';
if($do) {
	set_time_limit(180); // take a breath
	foreach($recipients as $x => $a) {
		$result = $a->send();
		if(!$result) $out .= warning('The email was not sent to: '.$a->email);
	}
	$out .= h2('SENDING COMPLETE - DO NOT RE-EXECUTE !!');
} else {
	foreach($recipients as $x => $a) break;
	
	$out .= warning('<strong>Not in Do mode, emails will not be sent. Use &do=1 to actually send emails</strong>');
	$example .= '<div style="margin-top:3em;">'.$a->subject().'</div>';	
	
	$html = '
	
	<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#D3E361; width:100% !important;">
	'.$a->html().'
	</div>
	
	';
	$example .= $html;
	
	$stripped = '<div style="margin-top:1em;"><textarea rows=12 style="width:100%;">'.$a->stripoff().'</textarea><br/>&nbsp;</div>';
	$example .= $stripped;
}




//////////////////////////////////////////////////////////////////////////////// 
//
//  ECHO OUTPUT
//


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');

echo html($out, $example);

?>