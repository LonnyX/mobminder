<?php


//////////////////////////////////////////////////////////////////////////////// 
//
//  U S A G E : 
//
// Dev & Test : https://localhost/comm/2018-08-Selfie/emails.php?fn=myfile
//
// Dev & Test : https://localhost/comm/2018-11-Offimed/emails_tomed.php
// Dev & Test : https://localhost/comm/2018-11-Offimed/emails_tomob.php
//
// filename (fn) is optional, when not used, emails are taken from the logins data table in mobminder db. filters specifications in this file. 
// &test=1 : test mode is enabled by default: sends emails only to a couple of selected emails, for pre-prod check purpose
// &do=0 : actual sending is disabled by default. Use &do=1 to send to the test sample, or &test=0&do=1 to execute final sending.
//
// Effective sending: https://be.mobminder.com/utilities/mobnewyear/emails.php?do=1&test=0
//
// 	OR
// 
// Effective sending: https://be.mobminder.com/utilities/mobnewyear/emails.php?fn=myfile&do=1&test=0
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
{ 	
	// read from DB

	$out .= notice('<b>Using DB query: '.'</b>');

	// State excluded wallets
	//
	$xcludedwallets = '(7874,7922,8330,8409,8384,8914,8925,9085,9086,9089,9361,9511,9482,9719,10298,10444,11707,11808,11809,12079,13119,11641)';
		// 7874		Spoden	Bernard	mminder	
		// 7896		Boven	Axel	axel	
		// 7922		George Remy
		// 8330		Burogest	Keevin	b	
		// 8384		D'Hoogh	Maxim	madhoo	
		// 8409		claereboudt	florence	floch	
		// 8818		Vandenberg	Jonathan	jonathan3	
		// 8914		Orban	Philippe	philo	
		// 8925		Amzel	Jacob	jacoba	
		// 9085		Campagne	Play Off GÃ©nÃ©ralistes	pogen	
		// 9086		Brunelle	Christian	Batiyou	
		// 9089		Aertssen	Steven	atx	
		// 9361		Office	Singapour	singapour	
		// 9482		Gay	Olivier	Oliga	
		// 9511		Vandewynckel	Sebastien	call	
		// 9719		Hafsa Nabil
		// 9859		Chiaradia	Laurence	laulau	
		// 10444	Pigot	Pierre Vincent	Pigot	
		// 11707	Marquet	Nicolas	marquet	
		// 11808	Marquet	Nicolas	NMarquet	
		// 11809	Gambarelli	FranÃ§ois	FGambarelli	
		// 12079	H4D	Equipe	EquipeH4D

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
	
	// Now connecting emails
	
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
			and (alogins.profession > 200 and alogins.profession < 300 
				or alogins.profession > 400 and alogins.profession < 500 ) -- only doctors - see C_iPRO for professions codes list
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
	public function subject() { return 'Mobminder - réunion utilisateurs'; }
	public function plaintextbody() { $t = $this->stripoff(); return $t; }
	public function html() {
	
		global $local;
		$path = 'https://be.mobminder.com/comm/'; if($local) $path = '../';
		
	
		$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		$linkMob = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
		$linkOff = '<a href="https://medinect.offimed.be/" target="_blank" title="Découvrez Medinect" style="color: #336699;font-weight: normal;text-decoration: underline;">www.medinect.be</a>';
		$signin = '<a href="https://docs.google.com/forms/d/1u1IzEYC5dofd0VR9oSAilKCKXEMPVgv74K3iCQ7A-mk/viewform?edit_requested=true" target="_blank" title="S\'inscrire à une soirée" style="color:white; font-weight:normal; text-decoration:none;">merci de vous inscrire en cliquant ici</a>';

		
		$logoMob2 = '<a href="https://www.mobminder.com" target="_blank"><img src="'.$path.'mob-logo.jpg" style="width:80%; max-width:80%;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoOffimed = '<a href="https://medinect.offimed.be" target="_blank"><img src="'.$path.'images/medinect.png" style=" width:80%; max-width:80%;" alt="DentaSoft" border="0" style="border:none;"></a>';
		
		$selfiers 		= '<img src="'.$path.'images/2selfiersCrop.jpg" style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$doctors 		= '<img src="'.$path.'images/doctors_3.jpg" 	style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$drseniors 		= '<img src="'.$path.'images/drsenior.png" 	style="width:100%;" alt="Selfier" border="0" style="border:none;">';		
		$rightHalfCup 	= '<img src="'.$path.'images/rhalfcup.jpg" 		style="height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$leftHalfCup 	= '<img src="'.$path.'images/lhalfcup.jpg" 		style="height:30em; max-height:30em;" alt="Cup" border="0" style="border:none;">';		
		$champaign 		= '<img src="'.$path.'images/champaign.jpg" 	style="height:36em; max-height:36em;" alt="Cup" border="0" style="border:none;">';		
		$duet 			= '<img src="'.$path.'images/duet.jpg" 			style="width:100%" alt="duet" border="0" style="border:none;">';		
		$minionWarn 	= '<img src="'.$path.'images/minionWarn.jpg" 	style="height:18em; max-height:18em;" alt="minion warns" border="0" style="border:none;">';		
		$minionsPile 	= '<img src="'.$path.'images/minionsPile.jpg" 	style="height:36em; max-height:36em;" alt="minions pile" border="0" style="border:none;">';	

		
		$sequence = Array();
		
		/////// Main communication body 
		//
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td  valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em; padding-bottom:0em;">
					<p>'.$this->dear.',</p>
					<p style="text-align:left; padding-top:1em; padding-bottom:0em; margin:0em;">
						Nous avons le plaisir de vous convier à une réunion des utilisateurs <strong>Mobminder</strong><br/>
						A cette occasion, vous aurez également l\'occasion de rencontrer nos équipes et de leur poser toutes vos questions!<br/>
						Consultez ci-dessous le programme des présentations. 
					</p>
				</td>			
			</tr>
		</table>';
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="bottom" style="text-align:right; padding-left:4em;">
					<div style="text-align:left; overflow:hidden;">'.$minionWarn.'</div>
				</td>
				<td valign="top" style="text-align:left; vertical-align:middle; padding-left:0em; padding-right:4em; padding-top:0em;">
					<p style="color:#FF6D13; font-size:1.6em; text-align:center; line-height:2em;">
						Réunion des utilisateurs Mobminder pour les médecins généralistes et spécialistes! </span>
					</p>
				</td>	
			</tr>
		</table>';
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>Agenda de la soirée:</p>
					<ul>
						<li>20h00 - Accueil avec sandwich et boissons</li>
						<li>20h15 - Présentation de notre partenariat avec Offimed/Medinect</li>
						<li>20h30 - Apparaître sur Internet, pièges et astuces</li>
						<li>20h45 - Présentation des nouveautés de Médinect</li>
						<li>21h15 - Questions et réponses</li>
					</ul>
				</td>			
			</tr>
		</table>';
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>Quand et où:</p>
					<ul>
						<li><strong>Mardi 27</strong> Novembre à <strong>Liège</strong><br/>(APPL Rue de Mulhouse,33B 4020 Liège)</li>
						<li><strong>Jeudi 29</strong> Novembre à <strong>Mons</strong><br/>(UPHOC Avenue des nouvelles technologies,59 7080 Frameries)</li>
						<li><strong>Mardi 4</strong> Décembre à <strong>Bruxelles</strong><br/>(UPB-AVB Rue Colonel Bourg 127, 1140 Evere)</li>
					</ul>
				</td>
				<td style="padding-right:3em; width:30%; max-width:30%;">
					<p style="padding:.5em; border:1px solid transparent; background:#FF6D13; border-radius:.5em; font-size:1.3em; text-align:center; line-height:1.5em;">'.$signin.'</p>
				</td>
			</tr>

		</table>';	
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:right; padding-bottom:2em;">
					<div style="text-align:center; overflow:hidden;">'.$doctors.'</div>
				</td>
			</tr>
		</table>';
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" width="50%" style="text-align:center;">
					<div style="text-align:center;">'.$logoOffimed.'</div>
				</td>
				<td valign="top" width="50%" style="text-align:center;">
					<div style="text-align:center;">'.$logoMob2.'</div>
				</td>
			</tr>
			<tr>
				<td valign="top"  style="">
					<ul>
						<li>DMI au meilleur prix sur le marché belge</li>
						<li>Société coopérative depuis 4 ans (médecins et pharmaciens) = garantie</li>
						<li>Très complet et intuitif. Software éprouvé et stable, expérience de 6 ans.</li>
						<li>Pc, Mac, iPad pour pratique individuelle ou maison médicale (généralistes et spécialistes)</li>
						<li>Votre DB patients chez vous (pas dans le cloud chez un sous-traitant)</li>
						<li>4YourHealth 1ere belge pour la communication sécurisée avec le smartphone de votre patient</li>
					</ul>
				</td>
				<td valign="top"  style="padding-right:1em;">
					<ul>
						<li>Agenda médical le moins cher, SMS et e-mails de rappel de RDV, illimités</li>
						<li>Société belge active depuis 10 ans, 3 millions de patients enregistrés, 4000 utilisateurs</li>
						<li>Prise de RDV par internet, référencement Google, site internet personalisé</li>
						<li>Secrétariat médical, call center spécialisé. Co-gestion et partage d\'agenda</li>
						<li>Support gratuit, mises à jour gratuite, contact dédicacé</li>
					</ul>
				</td>
			</tr>
		</table>';
				
		
				
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td valign="top" style="text-align:left; padding-left:2em; padding-right:0em; padding-top:0em;">
					<p>
						Pour tout renseignement, vous pouvez également contacter
					</p>
					<ul>
						<li>Vincent Druart pour Mons et Bruxelles vincent.druart@offimed.be</li>
						<li>Alain Hernoe pour les spécialistes à Mons et Bruxelles alain.hernoe@offimed.be</li>
						<li>Frédérique Demoulin pour Liège et Luxembourg  frederique.demoulin@offimed.be</li>
						<li>Marie Christine Derval pour Charleroi, Namur et le BW  marie-christie.derval@offimed.be</li>
					</ul>
					
					<ul>
						<li>Giraud Derlet pour Bxl, BW, Mons et Tournai: giraud@mobminder.com</li>
						<li>Keevin Pierre pour Liège, Namur et Charleroi: keevin@mobminder.com</li>
					</ul>
					
					<ul>
						<li>Pascal Vanhove, CEO pour Mobminder pascal@mobminder.com</li>
						<li>Bruno Willems, CEO pour Offimed bruno.willems@offimed.be</li>
					</ul>
					
					<p style="text-align:center; padding-top:1em; padding-bottom:0em;">
						Pour consultez nos sites web : 
					</p>
					<table style="width:100%;"><tr>
						<td style="width:50%; text-align:center;">'.$linkOff.'</td>
						<td style="width:50%; text-align:center;">'.$linkMob.'</td>
					</tr></table>
					<p style="margin-top:2em;">
						Medinect distribue également 4YourHealth, une application par laquelle le médecin communique à son patient, de manière sécurisée, des rapports, résultats d\'analyse de prélèvement ou prescriptions électroniques 
					</p>
				</td>			
			</tr>
		</table>';
				
				
		/////// MOB LOGO Signature
		//
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:center; padding-left:2em; padding-right:2em; padding-top:0em;">
					<p>Médinect est un partenaire officiel de Mobminder</p>
				</td>
			</tr>
		</table>';
		
		
		$sequence[] = '
		<table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:transparent; color:#404040; font-family:Arial; font-size:14px; line-height:150%;">
			<tr>
				<td colspan=2 valign="top" style="text-align:left; padding-left:2em; padding-right:2em; padding-top:0em; color:#7595AF;">
					<p>Plus de 3 millions de patients et 4000 professionnels nous font déjà confiance.</p>
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
		$recipients[] = new C_email(1, 'Keevin', 'Pierre', 'keevin@mobminder.com', 'Epifun', 3, 200);
		$recipients[] = new C_email(1, 'Fabrice', 'Malfrère', 'sensasis@live.be', 'Epifun', 3, 200);
		$recipients[] = new C_email(1, 'Bruno', 'Willems', 'bruno.willems@offimed.be', 'Epifun', 3, 200);
	
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