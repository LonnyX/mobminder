<?php


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E : 
//
//
// http://be.mobminder.com/utilities/oxteo/emails.php?fn=oxteoTest&do=0
//
// pre-requisite: a file oxteo.txt must be present in the utilities directory
//

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
function html($content) {
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
		$o .= '<body>'.$content.'</body></html>';
		return $o;
}
$out .= h1('mobminder email sender');



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['fn'])) $filename = $_GET['fn']; else $filename = false; if(!$filename) error('You need to give a file name');
$do = false; if(isset($_GET['do'])) if($_GET['do']) $do = true;

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



//////////////////////////////////////////////////////////////////////////////// 
//
//  READING THE FILE
//
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
	$slashed = strtolower($utf8);
	
	$split = explode(';',$slashed); array_walk($split,'normal');
	$lines[] = $split; 
}
$cueout = microtime(true);
$cuedelta = deltasec($cuein,$cueout);
$lcount -= $skipcount;
$out .= h2('The file has been read in: '.$cuedelta.', it counts '.$lcount.' valid lines - count:'.count($lines) );
fclose($handle);
if(!$lcount) error('No valid lines were found');


//////////////////////////////////////////////////////////////////////////////// 
//
//  MAKE RECIPIENTS
//
class email {
	public $dear;
	public $addressee;
	public $email;
	public $boundary;
	public function __construct($gender, $fname, $lname, $email, $language) {
		
		switch($gender) { // see gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 0: $dear="Chère"; $gender = "Mme"; break; 
			case 1: $dear="Cher"; $gender = "Mr"; break; 
			case 2: $dear=""; $gender = ""; break; 
			default: $dear=""; $gender = "";
		}
			$fname = ucwords($fname);
			$lname = ucwords($lname);
		$this->dear = $dear.' '.$gender.' '.$lname;
		$this->addressee = $fname.' '.$lname;
		$this->email = $email;
		$this->boundary = uniqid('np');
	}
	public function display() {
		return $this->dear.' ('.$this->email.')';
	}
	public function subject() { return 'La relation avec votre patient au coeur de votre cabinet';}
	public function plaintextbody() {
		$t = '\n'.$this->dear.',\nCette communication annonce la collaboration de Mobminder avec Oxtéo.\n';
		$t.= 'Mob-Oxteo est pour les Ostéopathes une combinaison idéale qui permet dorénavant:\n';
		$t.= 'o La gestion de vos documents et des protocoles.\n';
		$t.= 'o Le rappel automatique des RDV par SMS et e-mails, ainsi que la relance périodique du patient à des fins de prévention.\n';
		$t.= 'o Aux patients de prendre RDV directement par internet.\n';
		$t.= '\n';
		$t.= 'Répondez à cet email ou contactez-nous via www.mobminder.com et bénéficiez d\'une démonstration gratuite sans engagement.\n';
		$t.= '\n';
		$t.= '\n';
		return $t;
	}
	public function htmlbody() {
	
		$linkMobContact = '<a href="http://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
		$linkMob = '<a href="http://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
		$linkOxteo = '<a href="http://www.oxteo.be" target="_blank" title="Découvrez Oxteo" style="color: #336699;font-weight: normal;text-decoration: underline;">www.oxteo.be</a>';

		$logoMob = '<a href="http://www.mobminder.com"><img src="http://be.mobminder.com/comm/mob-logo.jpg" style=" height:6em; max-height:6em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoOxteo = '<a href="http://www.oxteo.be"><img src="http://be.mobminder.com/comm/oxteo-logo.png" style=" height:6em; max-height:6em;"  alt="Oxteo" border="0" style="border:none;"></a>';
		
		/////// Main communication body
		//
		$t1 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left; padding-left:3em; padding-right:3em; padding-top:2em;">
				<p>'.$this->dear.',<br/>Cette communication annonce la collaboration de Mobminder avec Oxtéo.</p>
				<p>Mob-Oxteo est pour les Ostéopathes une combinaison idéale qui permet dorénavant:</p>
				<ul>
					<li>La gestion de vos consultations et de vos documents.</li>
					<li>Le rappel automatique des RDV par <strong>SMS</strong> et <strong>e-mails</strong>, ainsi que la relance périodique du patient à des fins de prévention.</li>
					<li>Aux patients de <strong>prendre RDV directement par internet.</strong></li>
				</ul>			
			</td>
		</tr>
		</table>';
		
		$t2 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="center" style="text-align:center; padding-left:1em; padding-right:1em; vertical-align:center;">
				Répondez à cet email ou contactez-nous via '.$linkMobContact.' et bénéficiez d\'une démonstration gratuite sans engagement.
			</td>
			<td valign="top" style="text-align:right;">
				<div style="text-align:right; overflow:hidden;">
				<a href="http://www.mobminder.com"><img src="http://be.mobminder.com/comm/she-computer.jpg" style=" height:18em; max-height:18em;" alt="She" border="0" style="border:none;"></a>
				</div>
			</td>
		</tr>
		</table>';
		
		$t3 = '
		<table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" width="50%" style="text-align:center;">
				<div style="text-align:center;">'.$logoMob.'</div>
				<div style="text-align:center;">'.$linkMob.'</div>
			</td>
			
			<td valign="top" style="text-align:center;">
				<div style="text-align:center;">'.$logoOxteo.'</div>			
				<div style="text-align:center;">'.$linkOxteo.'</div>			
			</td>

		</tr>
		</table>';

		/////// Signature
		//
		
		
		
		
		/////// Nesting inside body, adding headers
		//
		$main = '<table border="0" cellpadding="0" cellspacing="0" width="600" style="border:1px solid #DDDDDD; margin:50px auto; background-color:#FFFFFF;">
				<tr><td>'.$t1.$t2.$t3.'</td></tr></table>';
		$center = '<center>'.$main.'</center>';
		$body = '<body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#D3F361; width:100% !important;">'.$center.'</body>';

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
		$m .= $this->htmlbody();
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
		$headers .= "From: Mobminder-Oxteo <communication@mobminder.com>\r\n";
		$headers .= "To:".$namee."\r\n";
		$headers .= "Reply-To: Mobminder <communication@mobminder.com>\r\n"; // only appearing on user interface, used by mail programs at client side
		$headers .= "X-Mailer: Mobminder/1.0\r\n";
		$headers .= "Content-Type: multipart/alternative;boundary=" . $this->boundary . "\r\n";

		$message = $this->msg();

		//invoke the PHP mail function
		$result = mail('', $this->subject(), $message, $headers);
		return $result;
	}
}
$recipients = Array(); foreach($lines as $x => $split) { // scan lines

	$skipit = false;
	foreach($headers as $hcount => $header) { // scan fields inside line
		$value = $split[$hcount]; $language = 0;
		switch($header) {
			case 'gender': $gender = $value; break;
			case 'language': $language = $value; break;
			case 'firstname': $fname = $value; break;
			case 'lastname': $lname = $value; break;
			case 'email': $email = $value; if(!$email) $skipit = true; break;
			default: break;
		}
	}
	$email = new email($gender, $fname, $lname, $email, $language);
	if($skipit) continue;
	$recipients[] = &$email; unset($email);
}


//////////////////////////////////////////////////////////////////////////////// 
//
//  send emails
//

foreach($recipients as $x => $a) $out.= microtab( ($x+1).': '.$a->display());



//////////////////////////////////////////////////////////////////////////////// 
//
//  send emails
//
if($do) {
	foreach($recipients as $x => $a) {
		$result = $a->send();
		if(!$result) $out .= warning('The email was not sent to: '.$a->email);
	}
	$out .= h2('SENDING COMPLETE - DO NOT RE-EXECUTE !!');
} else {
	$out .= warning('Not in Do mode');
}




//////////////////////////////////////////////////////////////////////////////// 
//
//  ECHO OUTPUT
//


$allout = microtime(true);
$alldelta = deltasec($allin,$allout);
$out .= h2('EXECUTION SUCCESSFULL - Total roundtrip: '.$alldelta.'');

echo html($out);

?>