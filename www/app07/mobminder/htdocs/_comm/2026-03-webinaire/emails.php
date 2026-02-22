<?php


//////////////////////////////////////////////////////////////////////////////// 
//
// 	 W I S H E S  for  2 0 2 0 
//
// Dev & Test : http://localhost/app07/mobminder/htdocs/comm/2024-05-IAconference/emails.php
//
// Effective sending: https://be.mobminder.com/comm/2024-05-IAconference/emails.php
//
//
//

require '../../../lib_mobphp/dbio.php';
require('../../../lib_mobphp/maillib.php'); // necessary for C_b64_email




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


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


$out .= h1('mobminder email sender (v04)'); ////////////////////////////////////////////////////////////




$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '/comm'; // same in production as in local
$http = 'https';
if(isset($subfolders[1])) { // then you are in local dev
	$out.= notice('HOST: |'.$host.'|');
	if($host=='localhost') { 
		$uri_1 = '/app07/mobminder/htdocs/comm'; // then you are in locahost testing.
		$http = 'http';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/comm" and prod "https://be.mobminder.com/comm" << use when images are in the /emails.php folder

$imageshost='https://mobminder.com/assets/imgs/emails'; // << use when images are on the .com

echo '$imageshost = '.$imageshost.$nl;



//////////////////////////////////////////////////////////////////////////////// 
//
//  CHECKING INPUTS AND FILE
//
if(isset($_GET['fn'])) $filename = $_GET['fn']; else $filename = false;
$do = false; if(isset($_GET['do'])) $do = !!$_GET['do'];
$test = true; if(isset($_GET['test'])) $test = !!$_GET['test'];  // you can pass zero or one, but by default test is true.

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
else 
{ 		// read from DB


	// select id, lastname, firstname, accessLevel, login, password from logins where id 
	// in (9090,9080,8840,7922,8797,9087,9089,7896,9086,8330,9085,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511);

	// select id, lastname, firstname, accessLevel, login, password from logins where accessLevel = 8 and id not 
	// in (9090,9080,8840,7922,8797,9087,9089,7896,9086,8330,9085,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511);
				
				
	$out .= notice('<b>Using DB query: '.'</b>');
	
	if(!$test) { //   /!\ pas les dentiste, juste les MG et SP, et pas seulement décisionnaire
		
		$mainquery = 'select distinct account.name as accountname, account.id as accId, account.phoneRegion as region
  , accmanagers.firstname as accmfirstname, accmanagers.lastname as accmlastname, accmanagers.accessLevel as accessLevel
  , userlogins.email, userlogins.gender, userlogins.lastname, userlogins.firstname, userlogins.language
from
(select distinct id, groupId, email, gender, lastname, firstname, language from logins
  where email <> ""
  and profession <> 801 -- assistant
  and profession <> 803 -- secretary 
  and profession <> 806 -- technician
  and email not like "%burogest%" and email not like "%smile-office%" and email not like "%toubipbip%" and email not like "%spitup%" and email not like "%oxteo%" and email not like "%offimed.be"   
  and accessLevel > 4 -- 4 is webpages
  and ( (logins.profession >= 201 and logins.profession < 230) -- specialists  ( 201 = GP, in this scope )
		OR (logins.profession >= 401 and logins.profession < 406) -- psychiatry
		OR (logins.profession in (801,803,808,810) ) -- managers, experts
	)
) as userlogins
join groups as account on account.id = userlogins.groupId -- catch the account name
join accesskeys on userlogins.groupId = accesskeys.accountId
-- left join logins as accmlogins on accesskeys.groupId = accmlogins.id -- logins been created by 
left join
  ( select distinct l.accessLevel, l.id, l.firstname, l.lastname, a.accountId from accesskeys as a join logins as l on l.id = a.groupId
    where l.accessLevel >= 8 
    and l.id IN (7874, 7875, 7881, 7893, 8330, 8384, 8797, 8820, 9086, 9088, 9482, 9859, 11641, 14036, 14191, 14693, 22221, 22770)
    -- and l.id IN (26707, 26705, 26708, 26706)
  ) as accmanagers on accmanagers.accountId = account.id
where 
	accmanagers.firstname is not null
		and account.phoneRegion = 32 -- Belgium
		and account.visitorAlias = 200 -- Only working with patients
		and account.profsector in (11,12,14,15,18,19) -- only medical centers (excludes 13 = dentists)

	order by account.id asc;';

	} else {
		// test mode
		$mainquery = 'select distinct logins.email, logins.gender, logins.lastname, logins.firstname, logins.language
				, accmlogins.lastname as accmlastname, accmlogins.firstname as accmfirstname, groups.id as accId, groups.name as accountname
				, groups.phoneRegion as region
		from logins 
			join groups on groups.id = logins.groupId
			join accesskeys on logins.groupId = accesskeys.accountId
			left join logins as accmlogins on accesskeys.groupId = accmlogins.id
			where 
				groups.phoneRegion = 32
				and accesskeys.accountId in (3566) -- Dr Test Pascal (Ps wallet)
				and logins.email <> ""
				and logins.language = 1
				order by accmlogins.lastname asc, groups.id asc, logins.email asc';
	}
	$cuein = microtime(true);
	
	// $out .= warning('<b>Using DB query: '.$mainquery.'</b>&nbsp;</b>'); // for debug purpose
	
	$queried = new Q($mainquery);
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
	public $doctorDoe;
	public $email;
	public $account;
	public $alias;
	public $alias1;
	public $company;
	public $language;
	public $boundary;
	
	public static $emailgateaway = false;
	
	public function __construct($gender, $fname, $lname, $email, $accountid, $language, $visicount = 0, $mobilecount = 0) {
		
		if(C_email::$emailgateaway == false) 
			C_email::$emailgateaway = new C_b64_email();
		
		$this->title = 'Cher confrère';
		switch($gender) { // see gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 0: $dear="Chère"; $gender = "Dr."; $this->title = 'Chère consœur'; break; 
			case 1: $dear="Cher"; $gender = "Dr."; break;
			case 2: $dear=""; $gender = ""; break; 
			default: $dear=""; $gender = "";
		}
		
			$fname = ucwords($fname);
			$lname = ucwords($lname);
		$this->dear = $gender.' '.$lname;
		$this->addressee = $fname.' '.$lname;
		$this->doctorDoe = 'Dr '.$lname;
		$this->email = $email;
		$this->account = new C_dS_group($accountid);
		$this->language = $language;
		$this->boundary = uniqid('np');
		$this->visicount = $visicount;
		$this->mobilecount = $mobilecount;
		$this->company = $this->account->name; 
		
		switch($this->account->visitorAlias) { // see (*va00*)
			case 200: $this->alias = 'patients'; 	$this->alias1 = 'patient'; 		break; 
			case 150: $this->alias = 'participants';$this->alias1 = 'participant'; 	break; 
			case 100: $this->alias = 'clients'; 	$this->alias1 = 'client'; 		break; 
			default: $this->alias = 'contacts'; 	$this->alias1 = 'contact';
		}
	}
	public function display() {
		return $this->dear.' ( '.$this->email.' | '.$this->account->name.' | '.$this->alias.' | '.$this->language.' | '.$this->company.' )';
	}
	public function subject() { return 'Webinaire en attente d\'accréditation - Protéger votre identité et les données de vos patients.'; }
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	
	function smsview($bla) { 
	
					$screenwidth = '200';
					$gsmscreen = 'background-color:#EEEEF1; color:#202020;';
					$oldhtml = 'valign="middle" bgcolor="#EEEEF1" color="#202020"';
				// inner table with simulated padding
				
				$tdmsg = '<td '.$oldhtml.' style="'.$gsmscreen.'">&nbsp;<br/>'.$bla.'<br/>&nbsp;</td>';
				
				
				// outer table
				$tdlr = '<td width="3" bgcolor="#BBBBBB" style="width:3px; min-width:3px; background-color:#BBBBBB;"></td>';
				$trtop = ''; // $trtop = '<tr><td style=""></td>'.$tdtb.'<td></td></tr>';
				$trmid = '<tr>'.$tdlr.''.$tdmsg.''.$tdlr.'</tr>';
				$trbot = ''; // $trbot = '<tr><td style=""></td>'.$tdtb.'<td></td></tr>';
				
			$tbl = '<table style="">'.$trtop.$trmid.$trbot.'</table>';
		
		$td = '<td valign="middle" width="'.$screenwidth.'" style="width:'.$screenwidth.'px;">'.$tbl.'</td>';
		return $td; 
	
	}
	public function html() { /////////////////////////////////////////////// HTMLT ///////////////////////////////////////////

		global $imageshost;

$logoTitle1 = '<a href="https://medinect.offimed.be" target="_blank"><img width="150" src="'.$imageshost.'/logomedi.jpg" alt="Medinect" border="0" style="width:150px; max-width:150px; border:none;"></a>';
$logoTitle2 = '<a href="https://www.mobminder.com" target="_blank"><img width="150" src="'.$imageshost.'/logomob.jpg" alt="Mobminder" border="0" style="width:150px; max-width:150px; border:none;"></a>';
$logoTitle3 = '<a href="https://tull-it.com/" target="_blank"><img width="150" src="'.$imageshost.'/tullit.png" alt="tull-it" border="0" style="width:150px; max-width:150px; border:none;"></a>';


// css for emails (!tricky!)
// 

$mobgreenW = '#BCDC45';
$mob_blueW = '#4477AA';
$medcolor = '#00568B';
$bgcolormail = '#EEEEEE'; // which is NOT the right place to set the surrounding background color, see here => (*bgc01*)
$txtcolormail = '#505050';
$buttoncolorbg = '#C3E24A';
$buttoncolortxt = '#012C42';
$txtcolorwarning = 'red';



$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
	$font = 'font-family:Helvetica;font-size:18px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; border-radius: 1.5em; overflow: hidden; line-height:20px;'; //font-family:Arial; font-size:14px; border-radius WITH overflow: hidden are responsible for radius (compatibility: https://www.caniemail.com/features/css-border-radius/ )



/////// Main communication body 
//


// Top banner email
//




// Dear
//

$t1 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="bottom" style="padding-left:2.5em; padding-right:2.5em; padding-top:1.5em;">
		<p style="color:'.$medcolor.'; font-weight:bold; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">
			'.$this->dear.',</p>
	</td>
</tr>
</table>';

// Main message 
//

$t2 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td style="padding-left:2.5em; padding-right:2.5em;">
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Nous avons le plaisir de vous convier au webinaire offert (en attente d’accréditation en éthique et économie):
		</p>

		<p style="color:'.$medcolor.'; font-weight:bold; font-size:20px; margin-block-start: 2em; margin-block-end: 2em; text-align: center; margin-top:30px;">Bonnes pratiques pour protéger votre identité et les données de vos patients
		</p>

        <p style="color:'.$medcolor.'; font-size:18px; margin-block-start: 1.2em; margin-block-end: 0.3em; font-weight:bold;">Date et heure
		</p>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: 1em;">Le mardi 24 mars à 20h
		</span>

        <p style="color:'.$medcolor.'; font-size:18px; margin-block-start: 1.2em; margin-block-end: 0.3em; font-weight:bold;">Programme
		</p>
        <span style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 0em; margin-block-end: 1em;">
		Introduction : rappel RGPD (Vincent Druart – Responsable commercial Offimed)<br/><br/>

		Sécurité des données des patients dans le dossier médical informatisé (Vincent Druart – Responsable commercial Offimed)<br/><br/>

		Apparaître sur Internet, les astuces et les pièges (Jonathan Bardo – Responsable Marketing Mobminder)<br/><br/>

		Bonnes pratiques : organisation et infrastructure (Séverine Champt – Account Manager Tull-IT)<br/>
		</span>
	</td>			
</tr>
</table>';

// Warning
//

$t3 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="top" style=" padding-left:2.5em; padding-right:2.5em; padding-top:0em;">
		<p style="text-align:left; line-height:130%; font-weight:bold; color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Les inscriptions sont ouvertes</p>				
	</td>
</tr>
</table>';

// CTA
//

$t4 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; padding-bottom:20px; text-align: center;">
		<a rel="noopener" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSf43O3IIz_4OYZsc53-YJGqJkts1TBnsYgeSTlH2SD7wKEFbw/viewform?usp=header  " style="background-color:'.$buttoncolorbg.'; font-size: 20px; font-weight: bold; text-decoration: none; padding: 15px 40px; color: white; border-radius: 5px; display: inline-block;">
    		<span style="color:'.$buttoncolortxt.';">Je m\'inscris</span>
		</a>			
	</td>
</tr>
</table>';

// Info
//

$t5 = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" style="padding-left:2.5em; padding-right:2.5em; padding-top:20px; text-align:left;">
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Pour toute question, vous pouvez appeler le <a href="tel:+3228809787" style="text-decoration:none!important; color:'.$medcolor.'">+32 2 880 97 87 </a></p>
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 1em;">Ou vous adresser à <a href="mailto:jonathan@mobminder.com" style="color:'.$medcolor.'; text-decoration:none;" target="_blank">jonathan@mobminder.com</a><br><br></p>
		<p style="color:'.$txtcolormail.'; font-size:18px; margin-block-start: 1em; margin-block-end: 0em;">Cette conférence est rendue possible grâce aux contributions de:</p>
	</td>
</tr>
</table>';


// Partners' logo
//

$tt = '
<table '.$fixoldhtmltablelook.'>
<tr>
	<td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
		<div style="text-align:center;">'.$logoTitle1.'</div>
	</td>
	<td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
		<div style="text-align:center;">'.$logoTitle2.'</div>
	</td>
    <td valign="middle" width="20%" style="text-align:center; padding-top:2em; padding-bottom:2em;">
        <div style="text-align:center;">'.$logoTitle3.'</div>
    </td>  
</tr>
</table>';





/////// Nesting inside body, adding headers
//
$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
			<tr><td>'.$t1.$t2.$t3.$t4.$t5.$tt.'</td></tr></table>';
$center = '<center>'.$main.'</center>';




		return $center;
	}
	public function body() { // each body is different as we include addressee specific data
		$body = '<body bgcolor="#C3E351" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#C3E351; width:100% !important;">'.$this->html().'</body>';
		return $body;

	}
	public function send() { // invokes PHP mail to mailsever
		
		if(!$this->email) return true; // skip this addressee having no email
		
		//specify the email address you are sending to, and the email subject
		$recipient = $this->addressee.' <'.$this->email.'>';
		

		//invoke the PHP mail function
		$result = C_email::$emailgateaway->sendMail($recipient, 0, $replyto = 'Jonathan <jonathan@mobminder.be>', $this->subject(), $this->html(), '#E4E6E7'); // New mailer 2023, (*bgc01*)

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
				case 'accountid': $accountid = $value; break;
				case 'email': $email = $value; if(!$email) $skipit = true; break;
				default: break;
			}
		}
		// $oemail = new C_email($gender, $fname, $lname, $email, $accountid, $language); // changed to work with accountid !!
		if($skipit) continue;
		if(isset($byemail[$email])) continue; // never send a double communication to the same recepient
		$recipients[] = &$oemail; $byemail[$email] = 1; unset($oemail); // have only distinct occurances of emails in the campaign
	}

}
else 
{ 		// treat from DB

	$gross = $queried->cnt();
	$out .= h2('DB Query records count: '.$gross );
	
	while($row = $queried->result->fetch_array()) { // now let's scan the result of our mainquery

		$skipit = false;
		$gender = $row['gender'];
		$fname = $row['firstname'];
		$lname = $row['lastname'];
		$email = $row['email']; if(!$email) $skipit = true; 
		$accountid = $row['accId'];
		$language = $row['language'];
		$visicount = 0;
		$mobilecount = 0;
		
		if($skipit) continue;
		if(isset($byemail[$email])) continue; // this email is already included.
		$oemail = new C_email($gender, $fname, $lname, $email, $accountid, $language, $visicount, $mobilecount);
		$recipients[] = &$oemail; 
		$byemail[$email] = 1; unset($oemail); // have only distinct occurances of emails in the campaign
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
	
	/////////////////// dev and test of the email
	
	$out .= warning('<strong>Not in Do mode, emails will not be sent. Use &do=1 to actually send emails</strong>');
	
	$example .= '<div style="margin-top:3em;">'.$a->subject().'</div>';	
	
		$html = '
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#BBBBBB; width:100% !important;">
		'.$a->html().'
		</div>
		<div style="height:5em;">&nbsp;</div>
		';
	$example .= $html;
	
	
	$example .= h1('Comprehensive list of emails in the definitive campaign: '.$ecount);
	foreach($recipients as $x => $a) { 
		$example.= notice( ($x+1).': '.$a->display());
	}
	
	$example .= h1('Text version for this email: '.$ecount );
	$stripped = '<div style="margin-top:3em;"><textarea rows=24 style="width:100%;">'.$a->stripoff().'</textarea><br/>&nbsp;</div>';
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