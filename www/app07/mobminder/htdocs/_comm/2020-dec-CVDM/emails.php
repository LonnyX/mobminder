<?php


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I S H E S  for  2 0 2 0 
//
// Dev & Test : http://localhost/comm/2019-dec-smswishes/emails.php
//
// Effective sending: https://be.mobminder.com/comm/2019-dec-smswishes/emails.php
//
//
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
else {
				
				
	$out .= notice('<b>Using DB query: '.'</b>');

	$q = '
select gender, lastname, firstname, visitors.email, mobile, groups.name as account, groups.language as language, groups.visitorAlias as alias 
	from visitors 
	join groups on visitors.groupId = groups.id 
	where visitors.groupId = 3237 and visitors.email <> "" and visitors.cssColor <> 6242 order by email asc;
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
	public $alias1;
	public $company;
	public $language;
	public $boundary;
	public $surroundColor;
	public function __construct($gender, $fname, $lname, $email, $account, $language, $alias) {
		
		switch($gender) { // see gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 0: $dear="Chère"; $gender = "Mme"; break; 
			case 1: $dear="Cher"; $gender = "Mr"; break; 
			case 2: $dear=""; $gender = ""; break; 
			default: $dear=""; $gender = "";
		}
		
		switch($alias) { // see (*va00*)
			case 200: $this->alias = 'patients'; 	$this->alias1 = 'patient'; 		$this->company = 'Le centre médical du bonheur'; break; 
			case 150: $this->alias = 'participants';$this->alias1 = 'participant'; 	$this->company = 'L\'équipe du FOREM'; break; 
			case 100: $this->alias = 'clients'; 	$this->alias1 = 'client'; 		$this->company = 'L\'équipe de la Maison Feel Good'; break; 
			default: $this->alias = 'contacts'; 	$this->alias1 = 'contact'; 		$this->company = 'L\'équipe de Exxki';
		}
			$fname = ucwords($fname);
			$lname = ucwords($lname);
		$this->dear = $dear.' '.$gender.' '.$lname;
		$this->addressee = $gender.' '.$fname.' '.$lname;
		$this->email = $email;
		$this->account = $account;
		$this->language = $language;
		$this->boundary = uniqid('np');
		$this->surroundColor = '#F9F2DF';
	}
	public function display() {
		return $this->dear.' ( '.$this->email.' | '.$this->account.' | '.$this->alias.' | '.$this->language.' | '.$this->company.' )';
	}
	public function subject() { return 'Une bonne année 2021 de la part du Dr. Van De Merckt et son équipe!';}
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	public function html() {
	
		$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';

		$logoMob1 = '<a href="https://www.mobminder.com" target="_blank"><img src="https://be.mobminder.com/comm/mob-logo.jpg" style=" height:7em; max-height:7em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoMob2 = '<a href="https://www.mobminder.com" target="_blank"><img src="https://be.mobminder.com/comm/mob-logo.jpg" style=" height:5em; max-height:10em;" alt="Mobminder" border="0" style="border:none;"></a>';
		
		$image1 = '<img src="https://be.mobminder.com/comm/images/CVDM2021.jpg" style="width:100%; max-width:100%;" alt="cheers" border="0" style="border:none;">';
		
		
		/////// Main communication body  EXCLUSIVITÉ  //  ('.$this->account.')
		//
		
		$t0 = '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td colspan=2 valign="top" style=" color:slategrey; text-align:left; padding-left:2em; padding-right:2em; padding-top:3em;">
				<p>'.$this->dear.',</p>
			</td>			
		</tr>
		<tr>
			<td valign="top" style="color:goldenrod; font-size:1.4em; line-height:1.8em; text-align:center; padding-left:2em; padding-right:2em; padding-top:0em; padding-bottom:1em;">
				<strong>Le Dr. Van De Merckt et son équipe vous souhaitent de bonnes fêtes de fin d\'année</strong>
			</td>
		</tr>
		</table>';

		$t1 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:slategrey; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
				<p>A l\'année prochaine,</p>
				<p>Cabinet d\'imagerie Carine Van De Merckt</p>
			</td>			
		</tr>
		</table>';
		
		$t2 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left;">
				<div style="">
					<a href="https://www.mobminder.com" target="_blank">'.$image1.'</a>
				</div>
			</td>
		</tr>
		</table>';
		
		$t3 = '';
		
		$t4 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:slategrey; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="font-size:0.9em; text-align:left; padding-left:2em; padding-right:3em; padding-top:2em;">
				<p>'.$this->addressee.', vous recevez cet email car vous êtes enregistré(e) en tant que patient(e) auprès du cabinet d\'imagerie médicale CVDM</p>
			</td>
		</tr>
		</table>';
		

		/////// Signature
		//
		
		$t5 = '
		<table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color:transparent; color:slategrey; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="font-size:0.9em; text-align:center;">
				<p>Ce service de messagerie est realisé par</p>
				<div style="text-align:center;">'.$logoMob2.'</div>
				<p>Agenda & planning médical pour les cliniques</p>
				<div style="text-align:center;">'.$linkMob.'</div>
			</td>
		</tr>
		</table>';
		
		
		
		
		/////// Nesting inside body, adding headers
		//
		$main = '<table border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #DDDDDD; margin:50px auto; background-color:#FFFFFF;">
				<tr><td>'.$t0.$t1.$t2.$t3.$t4.$t5.'</td></tr></table>';
		$center = '<center>'.$main.'</center>';

		return $center;
	}
	public function body() {
		$body = '<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:'.$this->surroundColor.'; width:100% !important;">'.$this->html().'</body>';
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
$byemail = Array(); // contains a list of distinct email

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

	$gross = $queried->cnt();
	$out .= h2('DB Query size: '.$gross );
	
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
		if(isset($byemail[$lname.$fname.$email])) continue; // this email is already included.
		$recipients[] = &$oemail; 
		$byemail[$lname.$fname.$email] = 1; unset($oemail); // have only distinct occurances of emails in the campaign
	}
	

}
	$ecount = count($recipients);
	$out .= h2('Remaining distinct emails: '.$ecount );

	
//////////////////////////////////////////////////////////////////////////////// 
//
//  setting up test mails
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
		$recipients[] = new C_email(1, 'Pascal', 	'Vanhove', 'pascal.vanhove@mobminder.com', 'La maison du bonheur', 2, 150);
		$recipients[] = new C_email(1, 'Keevin', 	'Pierre', 'keevin@mobminder.com', 'Clinique des bras cassés', 3, 200); // patients
		$recipients[] = new C_email(0, 'Patricia', 	'Willems', 'sensasis@live.be', 'Epifun', 3, 100);
		$recipients[] = new C_email(1, 'Giraud', 	'Derlet', 'giraud@mobminder.com', 'Epilaserenpanne', 3, 200); // patients
	
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
	
	<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:'.$a->surroundColor.'; width:100% !important;">
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