<?php


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E : 
//
// Dev & Test : http://localhost/comm/newyear2017/emails.php?fn=test&do=0
//
// Effective sending: http://be.mobminder.com/utilities/mobnewyear/emails.php?fn=test&do=0
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
			and alogins.profession not in(812) -- excludes 812=judges (see C_iPRO for professions codes list)
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
	public function subject() { return 'Mobminder - Meilleurs voeux! Beste Wensen! Happy New Year!';}
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	public function html() {
	
		global $local;
		$path = 'http://be.mobminder.com/comm/'; if($local) $path = '../';
		
	
		$linkMobContact = '<a href="http://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="http://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';

		$logoMob1 = '<a href="http://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style=" height:8em; max-height:8em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoMob2 = '<a href="http://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style=" height:10em; max-height:10em;" alt="Mobminder" border="0" style="border:none;"></a>';
		
		$smilingAssistant = '<img src="'.$path.'images/smile.jpg" style=" height:36em; max-height:36em;" alt="She" border="0" style="border:none;">';		
		$rightHalfCup = '<img src="'.$path.'images/rhalfcup.jpg" style=" height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$leftHalfCup = '<img src="'.$path.'images/lhalfcup.jpg" style=" height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$champaign = '<img src="'.$path.'images/champaign.jpg" style=" height:36em; max-height:36em;" alt="Cup" border="0" style="border:none;">';		
		$imageHPN = '<img src="'.$path.'2017-dec-newyear/hpn01_1.jpg" style="width:100%;" alt="HPN" border="0" style="border:none;">';		
		
		$sequence = Array();
		
		/////// Main communication body 
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:right;">
					<div style="text-align:center; overflow:hidden;">'.$imageHPN.'</div>
				</td>
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="bottom" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>'.$this->dear.',</p>
				</td>
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="color:#606060; font-size:1.6em; text-align:center; padding-top:1em; padding-bottom:1em;">
				<strong>Meilleurs voeux pour 2018 !</strong>
			</td>
		</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>L\'équipe entière de Mobminder vous souhaite une belle et heureuse année 2018 pour vous, votre famille et vos collègues.</p>
					<p>Que celle-ci soit synonyme de réussite personnelle et professionnelle dans tous vos projets!</br>
				</td>			
			</tr>
		</table>';
		

		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left; padding-left:2em; padding-right:0em; padding-top:2em;">
				<p>Grâce à vos conseils et remarques, Mobminder a évolué depuis 2007 et offre de nombreuses options et fonctionnalités. Merci!</p>
				<p>Mobminder en quelques chiffres...</p>
				<ul>
					<li>3100 utilisateurs professionnels</li>
					<li>2.400.000 '.$this->alias.'</li>
					<li>2.000.000 de RDVs pris en 2017</li>
				</ul>
				<p>Mobminder est distribué</p>
				<ul>
					<li>En Italie et au Portugal par h4d</li>
					<li>En France par Mobikap</li>
					<li>En Suisse par Kisano</li>
					<li>En Belgique par Cloud-Tech</li>
				</ul>
				<p>Vous êtes également équipé de Mobminder si vous avez choisi l\'un des 8 secrétariats professionnels partenaires en Belgique ou en France.</p>
				<p>Encore merci pour votre confiance!</p>
			</td>
			<td valign="top" style="text-align:right;">
				<div style="text-align:left; overflow:hidden;">
				<a href="http://www.mobminder.com" target="_blank">'.$champaign.'</a>
				</div>
			</td>
		</tr>
		</table>';
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
				<p>Olivier, Keevin, Giraud, Laurence, Anne-Sophie, Serge, Catherine, Quentin et Pascal.</p>
				</td>			
			</tr>
		</table>';

		/////// Signature
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="text-align:center;">
				<div style="text-align:center;">'.$logoMob2.'</div>
				<div style="text-align:center;">'.$linkMob.'</div>
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
	
	$out .= warning('<strong>Not in Do mode</strong>');
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