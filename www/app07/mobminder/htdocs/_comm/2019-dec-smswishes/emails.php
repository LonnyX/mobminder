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
else 
{ 		// read from DB

				// 801:'assistant',
				// 802:'nurse',
				// 803:'secretary',
				// 804:'realtor',
				// 805:'agent',
				// 806:'technician',
				// 807:'broker',
				// 808:'manager',
				// 809:'consultant',
				// 810:'expert',
				// 811:'lawyer',
				// 812:'judge',
				// 813:'notary',
				// 814:'salesperson',
				// 815:'teacher',

	// select id, lastname, firstname, accessLevel, login, password from logins where id 
	// in (9090,9080,8840,7922,8797,9087,9089,7896,9086,8330,9085,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511);

	// select id, lastname, firstname, accessLevel, login, password from logins where accessLevel = 8 and id not 
	// in (9090,9080,8840,7922,8797,9087,9089,7896,9086,8330,9085,8409,8384,11809,9482,12079,11808,11707,10444,8925,9361,8914,7874,8818,9511);
				
				
	$out .= notice('<b>Using DB query: '.'</b>');

	$q = '
select logins.id, logins.gender, logins.language, logins.lastname, logins.firstname, logins.email, logins.mobile, logins.profession
			, accounts.name as account, accounts.visitorAlias as alias
from logins join (

select distinct alogins.id as userloginid, accesskeys.accountId as accountId  -- we select all logins from accounts beloging to a given set of sller wallets
			from accesskeys -- seller key
	join logins on accesskeys.groupId = logins.id -- seller login
	right join logins as alogins on accesskeys.groupId = logins.id -- account user login
	right join accesskeys as aakeys on aakeys.groupId = alogins.id -- account user key
		
	where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
		and logins.id not in (-- exclude some wallets
				7874, -- Sandbox Oxteo Bernard Spoden
				-- 7896, -- Axel Boven 
				7922, -- Dietplus (Olivier Gay)
				8330, -- Keevin Burogest
				8384, -- Maxime DHoogh pages d or
				8840, -- Sandbox Offimed Medinect
				8409, -- Florence Clearebault
				8797,
				-- 8818, -- Jonathan Vandenberg CCM Online
				-- 8914, -- portefeuille Philippe Orban Octopus
				8925, -- Sandbox e-Dent
				9087, -- Mob Recycling
				9089, -- sandbox ATX DentAdmin
				9085, -- Play Off portefeuille idle
				9361, -- versusmind sandbox
				9482, -- Olivier Gay
				10444, 11808, 11809, 11707, 12079, -- h4d
				14551 -- Jean Claude Spelte - Caretel France
				) 
) as candidates on candidates.userloginid = logins.id
left join groups as accounts on accounts.id = candidates.accountId
	where logins.email <> "" 
		and logins.email NOT like "%@burogest.be" 
		and logins.email NOT like "%@caretel.be"  
		and logins.email NOT like "%@thomas-piron.eu" 
		and logins.email NOT like "%@medecinsdumonde.be" 
		and logins.email NOT like "%@esecretariat.be" 
		and logins.email NOT like "i-secretariat@%"
		and logins.email NOT like "%@laramee.be"
		and logins.email NOT like "pierrehalut@gmail.com"
		and logins.email NOT like "%@toubipbip.be"
	and logins.profession not in(	801, -- assistant
																803, -- secretary
																806, -- technician
																814 -- salesperson
															) -- see C_iPRO for professions codes list

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
	public $alias1;
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
			case 200: $this->alias = 'patients'; 	$this->alias1 = 'patient'; 		$this->company = 'Le centre médical du bonheur'; break; 
			case 150: $this->alias = 'participants';$this->alias1 = 'participant'; 	$this->company = 'L\'équipe du FOREM'; break; 
			case 100: $this->alias = 'clients'; 	$this->alias1 = 'client'; 		$this->company = 'L\'équipe de la Maison Feel Good'; break; 
			default: $this->alias = 'contacts'; 	$this->alias1 = 'contact'; 		$this->company = 'L\'équipe de Exxki';
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
	public function subject() { return 'Mobminder - Vive les fêtes!';}
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	public function html() {
	
		$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';

		$logoMob1 = '<a href="https://www.mobminder.com" target="_blank"><img src="https://be.mobminder.com/comm/mob-logo.jpg" style=" height:7em; max-height:7em;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoMob2 = '<a href="https://www.mobminder.com" target="_blank"><img src="https://be.mobminder.com/comm/mob-logo.jpg" style=" height:10em; max-height:10em;" alt="Mobminder" border="0" style="border:none;"></a>';
		
		$image1 = '<img src="https://be.mobminder.com/comm/images/champaignflip.jpg" style="width:10em; max-width:10em;" alt="cheers" border="0" style="border:none;">';		
		$image2 = '<img src="https://be.mobminder.com/comm/images/minionsPile.jpg" style="width:13em; max-width:13em;" alt="Minions" border="0" style="border:none;">';		
		
		/////// Main communication body  EXCLUSIVITÉ  //  ('.$this->account.')
		//
		$t0 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:slategrey; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="bottom" style="text-align:left; padding-left:2em; padding-right:0em; padding-top:3em;">
				<p style="color:#4477AA; text-align:left; font-size:1.6em; line-height:120%; white-space:nowrap;"><strong>DIFFUSEZ <br/>VOS BONS VOEUX</strong></p>
				<p>'.$this->dear.',</p>
			</td>
			<td valign="top" style="text-align:right; padding-right:1em; padding-top:3em;">
				<a href="https://www.mobminder.com">'.$logoMob1.'</a>
			</td>
		</tr>
		<tr>
			<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
				<p>Merci pour la confiance que vous placez en Mobminder. Nous voici arrivés ensemble en décembre.</p>
				<p>En tant qu\'utilisateur Mobminder, vous avez la possibilité d\'utiliser votre registre de '.$this->alias.' pour diffuser facilement vos voeux.</p>
				<p>Nous sommes heureux de vous proposer cette solution innovante et économique!</p>
			</td>			
		</tr>
		</table>';
		
		$t1 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="color:goldenrod; font-size:1.6em; text-align:center; padding-left:2em; padding-right:2em; padding-top:1em; padding-bottom:1em;">
				<strong>Vos voeux de fin d\'année automatiques par SMS</strong>
			</td>
		</tr>
		</table>';

		
		$t2 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left;">
				<div style="text-align:left; overflow:hidden; padding-top:2em;">
				<a href="https://www.mobminder.com" target="_blank">'.$image1.'</a>
				</div>
			</td>
			<td valign="top" style="text-align:left; padding-right:2em; padding-left:2em; padding-top:0em;">
				<p>Votre base de données est importante. Elle comprend plusieurs milliers de numéros.</p>
				<p>Chaque année vous êtes nombreux à nous demander de mettre en place <strong>un mailing SMS pour les fêtes de fin d\'année</strong>, à envoyer à vos '.$this->alias.'.</p>
				<p>Le SMS mailing:</p>
				<ul>
					<li>Est nominatif, chaque message contient sans faute les prénom et nom de votre contact!</li>
					<li>Apprécié des '.$this->alias.' pour qui vous manifestez une attention spécifique.</li>
					<li>Est programmable (date et heure que vous choisirez).</li>
					<li>Bien plus économique qu\'un mailing papier.</li>
					<li>Est toujours lu.</li>
				</ul>			
			</td>
		</tr>
		</table>';
		
		$t3 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left; padding-left:2em; padding-right:0em; padding-top:0em;">
				<p>Voici quelques exemples de messages:</p>
				<ul>
					<li style="color:olivedrab; font-size:1em;">'.$this->dear.', nos voeux les plus sincères vous accompagnent en cette ❄ veille de Noël ❄ 🎄 '.$this->company.'<br/>&nbsp;</li>
					<li style="color:chocolate; font-size:1em;">'.$this->dear.', 🍸 '.$this->company.' vous adresse ses meilleurs voeux en ce jour de Noël 🎄 🎅<br/>&nbsp;</li>
					<li style="color:goldenrod; font-size:1em;">'.$this->dear.', '.$this->company.' vous souhaite de 🍸 toutes bonnes fêtes de fin d\'année! 🎶 🎉<br/>&nbsp;</li>
					<li style="color:olivedrab; font-size:1em;">'.$this->dear.' ☀ je vous souhaite une année 2020 🌏 riche en belles surprises, en petites joies et grands bonheurs ⛄ '.$this->company.' ☀<br/>&nbsp;</li>
					<li style="color:orchid; font-size:1em;">'.$this->dear.' ✴ Que 2020 soit une année riche en joies intenses 🦂 et bonheurs durables ✴ Bien cordialement,  '.$this->company.'!<br/>&nbsp;</li>
				</ul>						
			</td>
			<td valign="top" style="text-align:right;">
				<div style="text-align:left; overflow:hidden; padding-right:1em; padding-top:4em;">
				<a href="https://www.mobminder.com" target="_blank">'.$image2.'</a>
				</div>
			</td>
		</tr>
		</table>';
		
		$t4 = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:slategrey; font-family:Arial; font-size:14px; line-height:150%;">
		<tr>
			<td valign="top" style="text-align:left; padding-left:2em; padding-right:3em; padding-top:0em;">
				<p style="color:brown;"><b>Envoyez-nous la date et l\'heure d\'expédition souhaitée, ainsi que votre message personnalisé.</b></p>
				<p>Cette année, un SMS coûte <b>10 cents</b>. Le message peut faire jusqu\'à <b>220 caractères</b> et contenir <b>des emojis</b> de votre choix. Le message peut contenir les nom ou/et prénom de votre '.$this->alias1.'.</p>
				<p>Le forfait de mise en oeuvre est de 50eur. Il comprend l\'export de votre base de donnée, la suppression des doublons, la préparation d\'un filtre si nécessaire et le test du SMS.</p>
				<p>Exemples de filtres: Les '.$this->alias.' blacklistés sont écartés. Les 1000 ou 2000 derniers '.$this->alias.' ayant pris un RDV. Tous les '.$this->alias.' ayant pris RDV après le 1 janvier 2017.</p>
				<p>Vos voeux peuvent parvenir avant Noël, le jour de Noël, entre Noël et nouvel an, ou à partir du 1er janvier, dimanche y compris</p>
				<p>Cette offre est valable pour les commandes de SMS mailing passées <b>avant le 15 Décembre 2019</b> et pour 500 SMS au minimum. Les prix s\'entendent htva.</p>
				
				<p style="color:brown;"><br/><strong>Répondez directement à cet email ou contactez-nous via '.$linkMobContact.'</strong></p>	
				<p>Vous recevrez rapidement une offre tarifaire en fonction du volume de votre sms mailing.</p>

				<p style="color:#4477AA; text-align:center; font-size:1.3em; line-height:120%;">D\'avance, toute l\'équipe de Mobminder vous souhaite d\'excellentes fêtes!</p>				
			</td>
		</tr>
		</table>';
		

		/////// Signature
		//
		
		$t5 = '
		<table border="0" cellpadding="10" cellspacing="10" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
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
				<tr><td>'.$t0.$t1.$t2.$t3.$t4.$t5.'</td></tr></table>';
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
		if(isset($byemail[$email])) continue; // never send a double communication to the same recepient
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