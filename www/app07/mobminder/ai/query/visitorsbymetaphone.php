<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    V I S I T O R S
//

ob_start(); // relates to (*cc)
require '../aiapilib.php';

//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// To access the main spec page, use : 
// 		http://localhost/app07/mobminder/ai/specs/api.php?lgn=mobapi&pwd=girafe&kid=28283&web=1
// 		http://localhost/app07/mobminder/ai/specs/api.php?lgn=PVH&pwd=2025&kid=10547&web=1
//
// Use always your login data when calling this file: 
// 		http://localhost/app07/mobminder/ai/query/visitorsbymetaphone.php?lgn=vx&pwd=vx&kid=18738
// 		http://localhost/app07/mobminder/ai/query/visitorsbymetaphone.php?lgn=PVH&pwd=2025&kid=10547&web=1
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <file></file>
//
// http://be.mobminder.com/app07/mobminder/ai/query/visitors.php?lgn=voxy&pwd=laura&kid=19102&web=1&mobile=5599&lastname=hove
//
//


$perfReport = new C_perfReport();
checkRequest4sqlInjection();

$context = new C_apicontext($xpected_alevel, $loadcontext=false, $perfReport);

	$who = $context->dS_login->firstname; // who is talking to AI
	$accId = $context->accountid;
	$dS_account = $context->dS_account;
	$aid = $dS_account->id;
	

$perfReport->peak('::time needed to retrieve context and posted parameters');


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

wo_pad();
h1('Input fields check up');
	
	h2('Checking fields');
	
		$id 	= @$_REQUEST['id']; 		if(isset($id)) $id = $id; else $id = '';

		$mob 	= @$_REQUEST['mobile']; 	if(isset($mob)) $mob = $mob; else $mob = '';
		$phn 	= @$_REQUEST['phone']; 		if(isset($phn)) $phn = $phn; else $phn = '';
		
		// birthdate
		// $bth 	= @$_REQUEST['birthday']; 	if(isset($bth)) $bth = $bth; else $bth = '';
		$bdday 		= @$_REQUEST['bdday']; 		if(isset($bdday)) 	$bdday 		= $bdday; 	else $bdday = ''; 
		$bdmonth 	= @$_REQUEST['bdmonth']; 	if(isset($bdmonth)) $bdmonth 	= $bdmonth; else $bdmonth = ''; 
		$bdyear 	= @$_REQUEST['bdyear']; 	if(isset($bdyear)) 	$bdyear 	= $bdyear; 	else $bdyear = ''; 
		
		
		$gnd 	= @$_REQUEST['gender']; 	if(isset($gnd)) $gnd = is_numeric($gnd)?$gnd+0:false; else $gnd = false; // expected to be 1 or 0

		$lnm 	= @$_REQUEST['lastname']; 	if(isset($lnm)) $lnm = $lnm; else $lnm = '';
		$fnm 	= @$_REQUEST['firstname']; 	if(isset($fnm)) $fnm = $fnm; else $fnm = '';
		$city 	= @$_REQUEST['city']; 	if(isset($city)) $city = $city; else $city = '';

		$eml 	= @$_REQUEST['email']; 		if(isset($eml)) $eml = $eml; else $eml = '';
		
		$cuein 	= @$_REQUEST['cuein']; 	if($cuein===null) $cuein = 0;
		$cueout = @$_REQUEST['cueout'];	if($cueout===null) $cueout = 0;
		
		$utcin = @$_REQUEST['utc']; $utc = false; if(isset($utcin)) if($utcin==1) $utc = true; // so the only way to turn utc on is by setting this value to 1, otherwise dates are returned in ISO 8601 format (YYYY-MM-DD HH:MM)

		
		if($id)
			wo_indent('o id : '.($id?$id:'').' any other input will be discarded when you use id');
		else {

			wo_indent('o gender : '.($gnd!==false?$gnd:'-'));
			
			// wo_indent('o birthdate : '.($bth?$bth:'-'));
			wo_indent('o bdday : '.($bdday?$bdday:'-'));
			wo_indent('o bdmonth : '.($bdmonth?$bdmonth:'-'));
			wo_indent('o bdyear : '.($bdyear?$bdyear:'-'));
			
			wo_indent('o phone : '.($phn?$phn:'-'));
			wo_indent('o mobile : '.($mob?$mob:'-'));
			wo_indent('o city : '.($city?$city:'-'));
			
			wo_indent('o lastname : '.($lnm?$lnm:'-'));
			wo_indent('o firstname : '.($fnm?$fnm:'-'));
				$exactname = false; // all visitors having a wildcard match of the input will be returned. eg: "vanhove" would be returned if the input is "hove"
			if($lnm) if(substr($lnm,-1)=='.') { // input ending with a dot, like "yu." or "spoden", should trigger a lookup on the exact name "yu" or "spoden".
				$exactname = true;
				warning('search on exact name',6);
			}
			
			wo_indent('o email : '.($eml?$eml:'-'));

			if($cuein) wo_indent('o cuein : '.$cuein);
			if($cueout) wo_indent('o cueout : '.$cueout);
				
		}
		
		// if(!($id||$fnm||$lnm||$phn||$mob||$bth||$eml||$city||$gnd))
			// abort('0200','You must specify at least one creterion when calling this tool.');
		
		// if(!($id||$fnm||$lnm||$phn||$mob||$bth||$eml||$city)) if($gnd)
			// abort('0201','You must always use at least one other criterion in combination with the gender parameter.');
	
	
	h3('Screening disallowed fields');
	
		wo_indent('none',6);
	
	h3('Screening disallowed characters in fields');
	
	
		if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);
		wo_pad(0); 

	
	h2('Fields format/value validation');
		
	
		if($id) {
			if(!(is_numeric($id)))
				abort('0202','visitor id does not have a valid format');
			
			$q = new Q('select id from visitors where id = '.$id.' and groupId = '.$context->accountid.';');
			if(!($q->ids()))
				abort('0203','You must specify a valid visitor Id');
		} else {
			
			if($cuein) if($cueout) { // check values format, can be utc or ISO
				
				if($utc) {
					if(!is_numeric($cuein)) if(!is_numeric($cueout)) 
						abort('0210','cuein and cueout must be unix time format');
					
					$date = new C_date($cuein);
					wo_indent('o cuein: UTC unix time format:'.$cuein.' ['.$date->getDateSortable().']', 6);
					$date = new C_date($cueout);
					wo_indent('o cueout: UTC unix time format:'.$cueout.' ['.$date->getDateSortable().']', 6);
					
				} else { // ISO8601 time YYYY-MM-DD hh:mm
				
					$cuein = $context->isValidCueFormat($cuein);
					$cueout = $context->isValidCueFormat($cueout);
					
					
					$dcuein = new C_date($cuein); // selects today / refers to account timezone setting
					$dcueout = new C_date($cueout); // selects today / refers to account timezone setting
					
						$tz = date_default_timezone_get();
					wo_indent('o cuein: ISO8601 time:['.$dcuein->getDateSortable().'] / '.$tz.'',6);
					wo_indent('o cueout: ISO8601 time:['.$dcueout->getDateSortable().'] / '.$tz.'',6);
					
					$cuein = $dcuein->getTstmp();
					$cueout = $dcueout->getTstmp();
				}
				
			}
				
		}
			unset($_REQUEST['mobile'],$_REQUEST['phone']); // avoid strict format validation for those fields, as parts of numbers can be used on this interface
		if($allok = fieldsvalidator($_REQUEST, $context, $strong = false)) { wo_indent('all fields have valid format and value range',6); }	

wo_pad();

	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   OBJECTIVE OF THIS SCRIPT



h1('Query'); 
	
$visis = new C_dbAccess_visitors(); 
$lnmq = ''; $fnmq = ''; $ctmq = '';

if($id) $id = ' AND id = '.$id;
else if(0) {

	if($gnd!==false) {
		switch($gnd) {
			case 0: case 4: case 6: $gnd = ' AND gender In (0,4,6) '; break;
			case 1: case 5: $gnd = ' AND gender in (1,5)'; break;
			case 2: case 3: $gnd = ' AND gender In (2,3)'; break;
			case 7: $gnd = ' AND gender In (7,0,1,4,6,5) '; break;
			default: $gnd = ''; break;
		}
	}

	if($bth) {
		if(strlen($mob.$phn.$lnm)>=6) $bth = ' AND (birthday like "'.$bth.'%" OR birthday = 0)'; // birthday can be absent in the DB if mobile or phone is another search criteria
		else $bth = ' AND birthday like "'.$bth.'%"';
	}

	if($phn) { if(strlen($phn)>6) $phn = substr($phn,-6) ;$phn = ' AND phone LIKE "%'.$phn.'"'; }

	if($mob) { if(strlen($mob)>6) ; $mob = ' AND mobile LIKE "%'.$mob.'%"'; }

	if($lnm) {
		
		// spaces are removed so you can search on "de co" to find "de coninck"
		$clup = preg_replace("/[^a-z0-9éèëêôîïû.]/si",'',$lnm); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""

		
		if($exactname) { // search on exact name
			$d = rtrim($clup,'.');
			$lnmq = ' AND ( REPLACE(REPLACE(REPLACE(lastname," ",""),"-",""),"\'","") = "'.$d.'")'; // replacement applies on the DB record field prior to comparison
		} 
		else // use %% query
			$lnmq = ' AND ( REPLACE(REPLACE(REPLACE(lastname," ",""),"-",""),"\'","") LIKE "%'.$clup.'%")'; // replacement applies on the DB record field prior to comparison
	}

	if($fnm) {
		
		// spaces are removed so you can search on "de co" to find "de coninck"
		$clup = preg_replace("/[^a-z0-9éèëêôîïû.]/si",'',$fnm); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""
		$fnmq = ' AND ( REPLACE(REPLACE(firstname,"-","")," ","") LIKE "%'.$clup.'%")'; // replacement applies on the DB record field prior to comparison, best for marie-christine or marie christine
	}

	if($city) {
		
		// spaces are removed so you can search on "de co" to find "de coninck"
		$clup = preg_replace("/[^a-z0-9éèëêôîïû.]/si",'',$city); // allows only a-z, 0-9, and simple quote. The rest is replaced by ""
		$ctmq = ' AND ( REPLACE(REPLACE(REPLACE(city,"-","")," ",""),"\'","") LIKE "%'.$clup.'%")'; // replacement applies on the DB record field prior to comparison, best for Vil-Sur-Meuse or Vil Sur Meuse
	}

	if($eml) $eml = ' AND email LIKE "%'.$eml.'%"';
}

$fntolower = ''; if($fnm) $fntolower = strtolower($fnm);
$lntolower = ''; if($lnm) $lntolower = strtolower($lnm);


	$dmFN = new DoubleMetaphone($fnm);
$metaphone1 = $dmFN->result['primary'];
$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';


	$dmLN = new DoubleMetaphone($lnm);
$metaphone3 = $dmLN->result['primary'];
$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';


$bth = 0;
if($bdday&&$bdmonth&&$bdyear) { // in this stage, if the inaccountmatchcount was > 1, we try to select the right guy on his birthday
	$l_bdday = strlen($bdday);
	$l_bdmonth = strlen($bdmonth);
	$l_bdyear = strlen($bdyear);
	
	$bdday = $l_bdday == 1 ? '0'.$bdday : $bdday;
	$bdmonth = $l_bdmonth == 1 ? '0'.$bdmonth : $bdmonth;
	$bdyear = $l_bdyear == 1 ? '0'.$bdyear : $bdyear;
	
	$bth = ($bdyear.$bdmonth.$bdday)|0; // is a YYYYMMDD format, with leading zeroes where needed.
}


function guessdisplay($visitors, $title) {
	global $fntolower, $lntolower;
	h4($title.' ('.$visitors->count().' visitors)');
	foreach($visitors->keyed as $vid => $dS_visitor) {
		$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
		$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
		
		$showup = ''; if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
		wo_indent('dS_visitor('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////
//
//    1.   I N      A C C O U N T      S E A R C H   incl. BIRTHDAY MATCH



$winner = false;
$perfReport->peak('     IAS::ready to process');
if(!$winner) { // easy testing
	
	h2(' I N      A C C O U N T      S E A R C H   (incl.birthday)'); 
	$visis3 = new C_dbAccess_visitors(); 	
	$visis3->guess_on_fn_ln_bth($aid, $metaphone1, $metaphone2, $metaphone3, $metaphone4, $bth);
	
	guessdisplay($visis3, 'IAS 1: '); 
	
	$v3total = $visis3->count();
	$butfirst = $visis3->getfirst();
	if($v3total) {
		if($v3total>1)
			$visis3->reset($butfirst); // we keep only one entry (they are most probably duplicates at the scale of an account
		$winner = $butfirst;
	}
	
	
	$perfReport->peak('     IAS::done');	
	$visis = $visis3;
}



//////////////////////////////////////////////////////////////////////////////////////////
//
//    2.   I N      A C C O U N T      W I T H O U T     B I R T H D A Y 

 

$perfReport->peak('     IAS 2::ready to process');
if(!$winner) { // easy testing

	h2(' I N      A C C O U N T      S E A R C H    (loose)');
	$visis3 = new C_dbAccess_visitors(); 	
	$visis3->guess_on_fn_ln_bth($aid, $metaphone1, $metaphone2, $metaphone3, $metaphone4); // retrieves only visitors with birthday = 0
	
	guessdisplay($visis3, 'IAS 2: ');
	
	$v3total = $visis3->count();
	$butfirst = $visis3->getfirst();
	if($v3total) {
		if($v3total>1)
			$visis3->reset($butfirst); // we keep only one entry (they are most probably duplicates at the scale of an account
		$winner = $butfirst;
		$winner->birthday = $bth; // update the visitor's data
		// $winner->save(); // saves without changing the tracking fields
		warning('One existing visitor updated with birthdate');
	}
	
	$perfReport->peak('     IAS 2::done');	
	$visis = $visis3;
		
}


//////////////////////////////////////////////////////////////////////////////////////////
//
//    3.     I N       M O B M I N D E R       S E A R C H      incl. BIRTHDAY MATCH

// When picking out of outer account register, we need to copy
// this visitor to the host account, because accounts do not share visitors.


if(!$winner) { // then search the entire DB
	
	h2(' I N       M O B M I N D E R       S E A R C H   (incl.birthday)'); 
	$visis3 = new C_dbAccess_visitors(); 
		
	$visis3->guess_on_fn_ln_bth(false, $metaphone1, $metaphone2, $metaphone3, $metaphone4, $bth);
	guessdisplay($visis3, 'IMS 1: ');		
	
	$v3total = $visis3->count();
	$butfirst = $visis3->getfirst();
	if($v3total) {
		if($v3total>1)
			$visis3->reset($butfirst); // we keep only one entry
		$winner = new C_dS_visitor(0, $aid, $butfirst);
		// $winner->dSsave(); // saves and updates the tracking fields.
		warning('One new visitor saved('.$winner->id.')');
		$visis3 = new C_dbAccess_visitors(); $visis3->add($winner);
	}
	
	$visis = $visis3;
	$perfReport->peak('     IMS 1::done');	
}



//////////////////////////////////////////////////////////////////////////////////////////
//
//    4.     I N       M O B M I N D E R       S E A R C H    ( WITHOUT BIRTHDAY )


if(!$winner) { // then search the entire DB

	h2(' I N       M O B M I N D E R       S E A R C H    (loose)'); 
	$visis3 = new C_dbAccess_visitors(); 
		
	$visis3->guess_on_fn_ln_bth(false, $metaphone1, $metaphone2, $metaphone3, $metaphone4); // retrieves only visitors with birthday = 0
	guessdisplay($visis3, 'IMS 2: ');		
	
	$v3total = $visis3->count();
	$butfirst = $visis3->getfirst();
	if($v3total) {
		if($v3total>1)
			$visis3->reset($butfirst); // we keep only one entry
			
		$winner = new C_dS_visitor(0, $aid, $butfirst);
		$winner->birthday = $bth; // update the visitor's data
		// $winner->dSsave(); // saves without changing the tracking fields
		warning('One new visitor saved('.$winner->id.')');
		$visis3 = new C_dbAccess_visitors(); $visis3->add($winner);
	}
	
	$visis = $visis3;
	$perfReport->peak('     IMS 2::done');			
} 



//////////////////////////////////////////////////////////////////////////////////////////
//
//    5.      B U I L D    U P     F R O M     S T A T S 

	
	// strategy:5
	// As no (fn x ln x bth) duet match was possible in account and in mobminder scope, 
	// let's build up the most probable combination by looking at statistics
	// So here, the fallback strategy is to create a new C_dS_visitor()

if(!$winner) {

	h2('   I N       S T A T S       S E A R C H   '); 
		
	$firstnames = new C_dbAccess_genders();
	
	
			$dmFN = new DoubleMetaphone($fnm);
		$metaphone1 = $dmFN->result['primary'];
		$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
	$firstnames->guess_stat_firstname($metaphone1, $metaphone2);
	
	
	h3('FName : '.$firstnames->count()).' candidates.';
	$winner = 0; $dS_winnerFN = false;
	foreach($firstnames->keyed as $lid => $dS_stat_gender) {
		$count = $dS_stat_gender->males + $dS_stat_gender->females;
		if($count>$winner) { $winner = $count; $dS_winnerFN = $dS_stat_gender; }
		wo_indent('Matching FNname: ('.$lid.'): '.$dS_stat_gender->name.', '.$dS_stat_gender->males.'m / '.$dS_stat_gender->females.'f',6);
	}
	if($dS_winnerFN) warning('WINNER FIRSTNAME: ('.$lid.'): '.$dS_winnerFN->name.', '.$dS_winnerFN->males.'m / '.$dS_winnerFN->females.'f',6);
	else warning('WINNER FIRSTNAME: NONE',6);
	
	$perfReport->peak('     ISS::firstname done');
	

	
	$lastnames = new C_dbAccess_lastnames(); 
			$dmLN = new DoubleMetaphone($lnm);
		$metaphone3 = $dmLN->result['primary'];
		$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';
	$lastnames->guess_stat_lastname($metaphone3, $metaphone4);
	
	h2('LName : '.$lastnames->count()).' candidates.';
	$winner = 0; $dS_winnerLN = false;
	foreach($lastnames->keyed as $lid => $dS_stat_lastname) {
		if($dS_stat_lastname->occurances > $winner) { $winner = $dS_stat_lastname->occurances;  $dS_winnerLN = $dS_stat_lastname; }
		wo_indent('Matching LName: ('.$lid.'): '.$dS_stat_lastname->name.', '.$dS_stat_lastname->occurances.'x',6);
	}
	if($dS_winnerLN) warning('WINNER LASTNAME: ('.$lid.'): '.$dS_winnerLN->name.', '.$dS_winnerLN->occurances.' occurances ',6);
	else warning('WINNER LASTNAME: NONE',6);

	
	$perfReport->peak('     ISS::lastname done');
		

	
	// set up this date as birthday, to a new C_dS_visitor
	$winner = new C_dS_visitor(0,$aid);
	$winner->firstname = 'Firstname?'; if($dS_winnerFN) $winner->firstname = $dS_winnerFN->name;
	$winner->gender = 0; if($dS_winnerFN) $winner->gender = $dS_winnerFN->males>$dS_winnerFN->females?1:0;
	$winner->lastname = 'Lastname?'; if($dS_winnerLN) $winner->lastname = $dS_winnerLN->name;
	$winner->birthday = $bth;
	$winner->note = 'Created by AI assistant as the pronounciation of name and birthday was of poor quality.';
	
	$visis = new C_dbAccess_visitors();
	$visis->add($winner);
	// $winner->dSsave();
		warning('One new visitor saved('.$winner->id.')');
}


h1('Remaining visitors:'.$visis->count());
foreach($visis->keyed as $vid => $dS_visitor) {
	h3('visitor id '.$vid.'',6);
	h3($dS_visitor->firstname,6);
	h3($dS_visitor->lastname,6);
	h3($dS_visitor->gender,6);
	h3($dS_visitor->birthday,6);
	wo_indent('----------------',6);
}
	
$perfReport->peak('::visitors have been found');


wo_pad(0);



	
	

//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

$vfields = C_api::fieldslist('C_dS_visitor');
wo_pad();
if($web) {
	technicalspecH1();
	h2('Input parameters');
	
	if($web) exlainloginputs(); 
	
	h3('mandatory posts');
	
		wo_indent('o one of id or a set of (mobile, phone, birthday, lastname, gender or email) is mandatory',6);
	
	h3('optional posts');
		
		wo_indent('o id: id of valid visitor instance. Any other input will be discarded when you use id',6);
		wo_indent('o mobile: ending part of a mobile number, will be wildcarded like [*123456]. At least 6 digits',6);
		wo_indent('o phone: ending part of a phone number, will be wildcarded like [*123456]. At least 6 digits',6);
		wo_indent('o birthday: numeric field in straight sortable format: 19991230 (AAAAMMDD) see (1*)',6);
		wo_indent('o gender: male or female. Range [0:female,1:male]. See (*2)',6);
		wo_indent('o firstname: a part of the visitor\'s firstname. At leat 2 characters. Must be alphabetical',6);
		wo_indent('o lastname: a part of the visitor\'s lastname. At leat 2 characters. Must be alphabetical.',6);
		wo_indent('o email: an email address, lowercase.',6);
		wo_indent('o cuein and cueout: a time frame to check if the returned visitors are appointed yet in this time frame.If some are, they will have .selection set to 1.',6);
		
	h3('caution');
		 wo_indent('You can use a set of mobile, phone, birthday, lastname, gender or email.',6);
		 wo_indent('(*1) When birthday is used in conjunction with one of mobile, phone or lastname, visitors with absent birthday are wildcarded by the query.',6);
		 wo_indent('(*2) Gender must be used in conjunction with one of mobile, phone, lnm or birthday.',6);
				 
				 
				 
	if($web) h2('Returned objects');
	htmlvisibletag('datamodel');

	h3('Visitors'); wo_pad();
		explainclass(new C_dS_visitor(), $vfields, '|');
		
	htmlvisibletag('/datamodel');
	wo_pad();

}	
	
	
	
	
//////////////////////////////////////////////////////////////////////////////////////////
//
//   D R O P    D A T A   T O    C L I E N T    S I D E

	h2('Query complete'); wo_indent('The following blueprint is the server payload response when not in web mode.'); wo_pad();

	$vcount = $visis->count();
	if($vcount) {
		htmlvisibletag('data');
			
		echo $visis->setAIformats($context->dS_account)->stream(no_alias, no_bank, no_tracking, '|', $vfields);
			
		htmlvisibletag('/data');
		
		htmlvisibletag('guidelines');
		
		if($vcount==1)
			echo 'You found a unique match, check with the user if this is the one he was thinking about. keep this C_dS_visitor id in mind. It will be usefull in the next scenario.'.$nl;
		else {
			echo 'When listing the returned C_dS_visitor instances, read only C_dS_visitor->firstname and C_dS_visitor->lastname.'.$nl;
			echo 'Talk with the user so that he can select a final C_dS_visitor from this list. Once selected, keep this C_dS_visitor id in mind. It will be usefull in the next scenario.'.$nl;
		}
		htmlvisibletag('/guidelines');
	}
	else {
		htmlvisibletag('info');
		// if($lnm)
		echo 'No visitor was found matching the input criteria. Ask '.$who.' if he can spel '.$nl;
			
		htmlvisibletag('/info');
	}



//////////////////////////////////////////////////////////////////////////////////////////
//
//   P E R F    R E P O R T 

if($web) {
	$perfReport->peak('::protocol streamed');
	$perfReport->dropReport(); // no perf report for production
	echo $nl;
	wo_pad();
}




endrendermode();
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>