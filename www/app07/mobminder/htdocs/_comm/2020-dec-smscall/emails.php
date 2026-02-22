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


$uriandpar = explode('?',$_SERVER['REQUEST_URI']);
$host = $_SERVER['HTTP_HOST'];
$uri = $uriandpar[0]; $subfolders = preg_split("#/#", $uri); 
$uri_1 = '/comm'; // same in production as in local
$http = 'https';
if(isset($subfolders[1])) {
	$out.= notice('HOST: |'.$host.'|');
	if($host=='localhost') { 
		$uri_1 = '/be.mobminder.com/comm'; // then you are in locahost testing.
		$http = 'http';
	}
}
$imageshost = $http.'://'.$host.$uri_1; // is local "http://localhost/comm" and prod "https://be.mobminder.com/comm"


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
	
	$q = new Q('select sunday from xmon_accounts where groupId = 3250 order by sunday desc limit 1;');
	$unixsunday = $q->one('sunday'); // last stats available from xmon_accounts
	$out .= notice('<b>unixsunday: '.$unixsunday.'</b>');
	$andtest = ''; if($test) $andtest = ' and accesskeys.accountId in (3566,3925)';
	$q = '
select logins.id, logins.gender, logins.language, logins.lastname, logins.firstname, logins.email, logins.mobile, logins.profession
			, accounts.id as accountid, counters.visiCount, counters.visiMobile
from logins join (

		select distinct alogins.id as userloginid, accesskeys.accountId as accountId  -- we select all logins from accounts belonging to a given set of seller wallets
					from accesskeys -- seller key
			join logins on accesskeys.groupId = logins.id -- seller login
			right join logins as alogins on accesskeys.groupId = logins.id -- account user login
			right join accesskeys as aakeys on aakeys.groupId = alogins.id -- account user key
				
			where logins.accessLevel >= 8 and alogins.accessLevel < 8 and alogins.accessLevel >=5 and aakeys.accountId = accesskeys.accountId
				and logins.id not in (-- exclude some wallets (commented ids will be INCLUDED)
							-- 8797, -- Mob Closed Accounts
							-- 7918, -- Mob Wizard
							-- 7875, -- Pascal Vanhove
						-- 7874, -- Sandbox Oxteo Bernard Spoden
						-- 7881, -- Keevin
						-- 7893, -- Giraud
						-- 7896, -- Axel Boven 
						7922, -- Dietplus (Olivier Gay)
						-- 8330 -- Keevin Burogest
						-- 8350 -- Burogest prog prog
						8384, -- Maxime DHoogh pages d or
						-- 8818 -- Vincent Sancinito Spitup
						-- 8820 -- Catherine Barthel
						8840, -- Sandbox Alain Offimed Medinect
						-- 8914, -- portefeuille Philippe Orban Octopus
						8925, -- Sandbox e-Dent
						-- 9085, -- mobdev / bernard dev mobminder (for test logins)
						-- 9086 -- Christian Brunelle
						-- 9087, -- Mob Recycling
						9088, -- PlayOff Oncologues
						9089, -- synchros ATX DentAdmin
						9361, -- versusmind sandbox
						9482, -- Olivier Gay
						-- 9719, -- Tunisie Nabil Hafsa
						-- 9859, -- Village No 1 Mediconsult
						-- 10298, -- Keevin Mediconsult
						-- 11641, -- Oxteo portefeuille
						10444, 11707, 11808, 11809, 12079, -- h4d
						-- 13119, -- Ruba Voxiplan
						-- 14036, -- Spitup
						-- 14191, -- Keevin Tbb
						-- 14286, -- Support Medinect
						-- 14551, -- Jean Claude Spelte - Caretel France
						-- 14693, -- ODM Alliance
						-- 17558, -- Anne-Sophie de Wael
						0
						) 
						'.$andtest.' 
) as candidates on candidates.userloginid = logins.id
join groups as accounts on accounts.id = candidates.accountId
join ( select groupId, visiCount, visiMobile from xmon_accounts where sunday = '.$unixsunday.'
		) as counters on counters.groupId = accounts.id
	where logins.email <> "" 
		and logins.email NOT like "%@burogest.be" 
		and logins.email NOT like "%@caretel.be"  
		and logins.email NOT like "%@thomas-piron.eu" 
		and logins.email NOT like "%@medecinsdumonde.be" 
		and logins.email NOT like "%@esecretariat.be" 
		and logins.email NOT like "%@laramee.be"
		and logins.email NOT like "pierrehalut@gmail.com"
		and logins.email NOT like "%@toubipbip.be"
		and logins.email NOT like "%@spitup.be"
		and logins.email NOT like "%@oxteo.be"
	and logins.profession not in(	801, -- assistant
									803, -- secretary
									806, -- technician
									814 -- salesperson
								) -- see C_iPRO for professions codes list
	order by email asc;';
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
	public function __construct($gender, $fname, $lname, $email, $accountid, $language, $visicount = 0, $mobilecount = 0) {
		
		switch($gender) { // see gendercode = { female:0, male:1, sa:2, sprl:3, miss:4, boy:5, girl:6 };
			case 0: $dear="Chère"; $gender = "Mme"; break; 
			case 1: $dear="Cher"; $gender = "Mr"; break; 
			case 2: $dear=""; $gender = ""; break; 
			default: $dear=""; $gender = "";
		}
		
			$fname = ucwords($fname);
			$lname = ucwords($lname);
		$this->dear = $gender.' '.$lname;
		$this->addressee = $fname.' '.$lname;
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
	public function subject() { return 'Merci de vous laver les mains avant de lire ce message';}
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
	public function html() {
	
		global $imageshost;
		$linkMobContact = '<a href="https://www.mobminder.com/contact" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration:underline;">www.mobminder.com</a>';
		
		$linkMob  = '<a href="https://www.mobminder.com" target="_blank" title="Découvrez Mobminder" style="color: #336699;font-weight: normal;text-decoration: underline;">www.mobminder.com</a>';
		
		$logoMobBottom = '<a href="https://www.mobminder.com" target="_blank"><img width="400" src="'.$imageshost.'/images/covid-minder-02.png" style="width:400px; max-width:400px;" alt="Mobminder" border="0" style="border:none;"></a>';
		$logoTitle = '<a href="https://www.mobminder.com" target="_blank"><img width="250" src="'.$imageshost.'/images/covid-minder-02.png" style="width:250px; max-width:250px;" alt="Mobminder" border="0" style="border:none;"></a>';
		
		$bluetree = '<img src="'.$imageshost.'/images/blue-xmas-gifts-f.jpg" width="200" style="width:200px; max-width:200px;" alt="cheers" border="0" style="border:none;">';		
		$image2 = '<img src="'.$imageshost.'/images/minionsPile.jpg" width="150" style="width:100%; max-width:100%;" alt="Minions" border="0" style="border:none;">';	
		
		$blueribleft = '<img src="'.$imageshost.'/images/blue-ribbon-1-50pc.jpg" width="82" style="width:82px; min-width:90px;" alt="ribbon" border="0" style="border:none;">';
		$blueribright = '<img src="'.$imageshost.'/images/blue-ribbon-2-50pc.jpg" width="82" style="width:82px; min-width:90px;" alt="ribbon" border="0" style="border:none;">';
		
		$knob1 = '<img src="'.$imageshost.'/images/green-knob-1.jpg" width="250" style="width:18em; min-width:18em;" alt="ribbon" border="0" style="border:none;">';
		$knob2 = '<img src="'.$imageshost.'/images/green-knob-2.jpg" width="250" style="width:18em; min-width:18em;" alt="ribbon" border="0" style="border:none;">';
		$knob3 = '<img src="'.$imageshost.'/images/green-knob-3.jpg" width="250" style="width:18em; min-width:18em;" alt="ribbon" border="0" style="border:none;">';
		
		$xmasdecobottom = '<img src="'.$imageshost.'/images/green-xmas-deco.jpg" width="450" style="width:30em;" alt="Mobminder" border="0" style="border:none;">';
		
		
		// css for emails (!tricky!)
		// 
		$fixoldhtmltablelook = 'bgcolor="#FFFFFE" color="#505050" border="0" cellpadding="0" cellspacing="0" width="600"'; // Older Outlook email readers - padding in style="" are ok
			$font = 'font-family:Helvetica;font-size:14px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none';
		$cssglobal = $font.' border:none; border-collapse:collapse; margin:0px auto; background-color:#FFFFFE; color:#505050; line-height:150%;'; //font-family:Arial; font-size:14px; 
		
		$mobgreenW = '#BCDC45'; // C0E04A
		$mob_blueW = '#4477AA'; // 4477AA
		
		/////// Main communication body  EXCLUSIVITÉ  //  ('.$this->account.')
		//
		$t0 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="bottom" style="padding-left:2em; padding-right:0em; padding-top:3em;">
				<p style="color:'.$mob_blueW.'; font-size:1.4em; line-height:120%; white-space:nowrap;">
					<strong>Chez Mobminder<br/>
							<span style="color:'.$mobgreenW.';">on ne se serre pas la main</span><br/>
							mais on se serre les coudes!</strong></p>
			</td>
			<td valign="middle" style="padding-right:1em; padding-top:3em; vertical-align:middle;">
				<a href="https://www.mobminder.com">'.$logoTitle.'</a>
			</td>
		</tr>
		<tr>
			<td colspan=2 style="padding-left:2em; padding-right:2em;">
				<p>Bonjour '.$this->dear.',</p>
				<p>Etes-vous prêt pour une année 2021 sans Covid?</p>
				<p>Vous avez '.$this->visicount.' '.$this->alias.' qui peuvent compter sur vous!</p>
				<p>Ecrivez-leur un SMS, nous l\'envoyons durant les fêtes de fin d\'année. Vous avez '.$this->mobilecount.' '.$this->alias.' pour lesquels un numéro de portable est renseigné dans votre agenda.</p>
			</td>			
		</tr>
		</table>';
		
		$t1 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr><td height="20">&nbsp;<td></tr>
		<tr>
			<td width="60">&nbsp;</td>
				<td style="padding:auto 0; text-align:right; vertical-align:middle;">'.$blueribleft.'</td>
					<td valign="top" align="center" color="4477AA" style="color:'.$mob_blueW.'; font-size:1.4em; text-align:center; line-height:150%;">
						<strong>Vos voeux de fin d\'année dans un SMS à date et heure planifiée</strong>
					</td>
				<td style="padding:auto 0;  vertical-align:middle;">'.$blueribright.'</td>
			<td width="60">&nbsp;</td>	
		</tr>
		</table>';

		
		$t2 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="top" style=" vertical-align:middle;">
				<div style=" overflow:hidden; padding-top:0em; padding-left:3em;">'.$bluetree.'</div>
			</td>
			<td valign="top" style=" padding-right:1.5em; padding-left:0em; padding-top:0em;">
				<ul style="padding-left:0em;">
					<li>SMS nominatif, chaque message contient les prénom ou/et nom de votre '.$this->alias1.'.</li>
					<li>Apprécié des '.$this->alias.' pour qui vous manifestez une attention.</li>
					<li>Programmable à une date et heure que vous choisirez.</li>
					<li>Bien plus économique et écologique qu\'un courrier postal.</li>
					<li>Les SMS ont un taux de lecture de 99%.</li>
					<li>Vous pouvez récupérer les réponses aux SMS.</li>
				</ul>			
			</td>
		</tr>
		</table>';
		
		// ❄ veille de Noël ❄ 🎄
		// de Noël 🎄 🎅
		//  ☀  🍸  ☀ 
		//  ✴  🌏   ⛄  ☀
		
		$margins = '16';
		$t3 = '
		<table '.$fixoldhtmltablelook.' style="">
			<tr><td width="'.$margins.'" style="width:'.$margins.'px; min-width:'.$margins.'px;">&nbsp;</td><td>
				<table style="">
					<tr><td colspan="3">&nbsp;</td>
					<tr>
						<td colspan=3 color="'.$mobgreenW.'" valign="middle" align="center" style="color:'.$mobgreenW.'; text-align:center; font-size:1.2em;">
							<b>Voici quelques exemples de messages:</b>				
						</td>
					</tr>
					<tr><td colspan="3">&nbsp;</td>
					<tr style="">
						'.$this->smsview($this->dear.',<br/> Cap sur ✴2021✴ De la part de toute l\'équipe du '.$this->company.', nous vous souhaitons une belle et heureuse année 2021 pleine d\'énergie et de beaux projets. Je profite de ces bons vœux pour vous remercier sincèrement de votre fidélité tout au long de cette année compliquée en raison du contexte sanitaire Covid-19. Nous n\'avons rien lâché et ensemble nous avons surmonté cette crise. Un immense merci').' 
						<td rowspan=3 valign="middle" style="text-align:center; ">'.$image2.'</td>
						'.$this->smsview($this->dear.', '.$this->company.' vous souhaite une excellente Année 2021 🌏 <br/>Qu\'elle vous apporte joie, bonheur, prospérité et qu\'elle permette la réalisation de tous vos désirs. Accueillez la nouvelle Année sous une pluie de champagne 🍸 elle sera pétillante de joie et de santé, ensemble nous aurons vaincu la crise du COVID, merci et bravo pour vos efforts! Excellentes fêtes 🎅 et Meilleurs voeux 🎄').'
					</tr>
					<tr style=""><td>&nbsp;</td><td>&nbsp;</td></tr>
					<tr style="">
						'.$this->smsview($this->dear.'<br/> Je vous souhaite une heureuse année 2021 pleine d\'énergie, de prospérité, et de réussite. Notre équipe est toujours aussi enthousiaste à vous satisfaire, à vous apporter la meilleure qualité de service possible, '.$this->company.' ').'
						'.$this->smsview($this->dear.'<br/> Nous vous remercions pour la collaboration agréable et la confiance témoignée cette année avec '.$this->company.'. Nos meilleurs voeux et nous vous souhaitons une bonne année à venir, pleine de succès !<br/> ⛄ '.$this->company.' ⛄ ').'
					</tr>
					<tr><td colspan="3">&nbsp;</td>
				</table>
			</td><td width="'.$margins.'" style="width:'.$margins.'px; min-width:'.$margins.'px;">&nbsp;</td><tr>
		</table>';
		
		$t4 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="top" style=" padding-left:2em; padding-right:3em; padding-top:0em;">
				<p  color="'.$mobgreenW.'" style="color:'.$mobgreenW.'; text-align:center; font-size:1.2em;">
					<b>Personnalisez votre campagne SMS:</b>
				</p>
					<p>Définissez la couverture:</p>				
					<ul style="padding-left:2em;">
						<li>Par exemple, les 2000, 3000 ou 5000 derniers '.$this->alias.' ayant un RDV dans l\'agenda.</li>
						<li>Tous les '.$this->alias.' ayant pris RDV après une date donnée.</li>
						<li>Uniquement les '.$this->alias.' ayant pris RDV avec un collaborateur précis de votre organisation.</li>
						<li>Les '.$this->alias.' marqués d\'une couleur spécifique dans votre registre peuvent être inclus ou exclus de la campagne.</li>
					</ul>
				<p>Ecrivez votre propre message ou adaptez l\'un des exemples fournis ci-dessus. Les SMS peuvent faire jusqu\'à 400 lettres ainsi que contenir des émojis</p>
				<p>Choisissez la date de votre campagne: vos voeux peuvent parvenir avant Noël, le jour de Noël, entre Noël et nouvel an, ou à partir du 1er janvier, dimanche compris.</p>
				<p>Indiquez-nous si vous souhaitez récupérer les réponses de vos '.$this->alias.'.</p>
				<p>Rassemblez vos désidératas et écrivez-nous en répondant à cet email ou contactez-nous via '.$linkMobContact.'</p>	
			</td>
		</tr>
		<tr>
			<td valign="top" style="text-align:center; vertical-align:middle; padding-top:1em;">
				'.$knob1.'
			</td>
		</tr>
		</table>';
		
		$t5 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="top" style=" padding-left:2em; padding-right:3em; padding-top:0em;">
				<p style="color:'.$mob_blueW.';">
					<b>Conditions financières:</b>
				</p>
				<p>Un SMS coûte 9 cents. Soit 90eur pour 1000 SMS.</p>
				<p>Le forfait de mise en oeuvre est de 50eur. Il comprend l\'export de votre base de données, la suppression des doublons, la préparation d\'un filtre et les tests.</p>
			</td>
		</tr>
		<tr>
			<td valign="top" style="text-align:center; vertical-align:middle; padding-top:1em;">
				'.$knob2.'
			</td>
		</tr>
		</table>';
		
		$t6 = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="top" style=" padding-left:2em; padding-right:3em; padding-top:0em;">
				<p style="color:'.$mob_blueW.'; text-align:center; font-size:1.3em; line-height:120%;"><strong>Toute notre équipe vous souhaite déjà d\'excellentes fêtes!</strong></p>				
			</td>
		</tr>
		<tr>
			<td valign="top" style="text-align:center; vertical-align:middle; padding-top:1em;">
				'.$knob3.'
			</td>
		</tr>
		</table>';
		

		/////// Signature
		//
		
		$tb = '
		<table '.$fixoldhtmltablelook.' style="">
		<tr>
			<td valign="top" width="50%" style="text-align:center; padding:none;">
				<div style="text-align:center;">'.$logoMobBottom.'</div>
				<div style="text-align:center;">'.$linkMob.'</div>
				<div style="text-align:center;">'.$xmasdecobottom.'</div>
			</td>
		</tr>
		<tr>
			<td valign="top" style="text-align:center; vertical-align:middle; padding-top:1em; padding-left:10em; padding-right:10em; font-size:0.9em; ">
				Si vous ne souhaitez plus recevoir les emails informatifs de Mobminder, SVP répondez à cet email pour nous l\'indiquer. Nous ferons le nécessaire. 
			</td>
		</tr>
		</table>';
		
		
		
		
		/////// Nesting inside body, adding headers
		//
		$main = '<table '.$fixoldhtmltablelook.' style="'.$cssglobal.'">
					<tr><td>'.$t0.$t1.$t2.$t3.$t4.$t5.$t6.$tb.'</td></tr></table>';
		$center = '<center>'.$main.'</center>';

		return $center;
	}
	public function body() {
		$body = '<body bgcolor="#C3E351" leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#C3E351; width:100% !important;">'.$this->html().'</body>';
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
	$out .= h2('DB Query size: '.$gross );
	
	while($row = $queried->result->fetch_array()) {

		$skipit = false;
		$gender = $row['gender'];
		$fname = $row['firstname'];
		$lname = $row['lastname'];
		$email = $row['email']; if(!$email) $skipit = true; 
		$accountid = $row['accountid'];
		$language = $row['language'];
		$visicount = $row['visiCount'];
		$mobilecount = $row['visiMobile'];
		
		$oemail = new C_email($gender, $fname, $lname, $email, $accountid, $language, $visicount, $mobilecount);
		if($skipit) continue;
		if(isset($byemail[$email])) continue; // this email is already included.
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
		<div leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0" style="-webkit-text-size-adjust:none; margin:0; padding-top:2em; padding-bottom:5em; text-align:center; background-color:#D3E361; width:100% !important;">
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