<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    Moby  A I   A P I   /   Q U E R Y    V I S I T O R S
//

ob_start(); // relates to (*cc)
require '../../lib_mobphp/doublemetaphone.php';
require '../aiapilib.php';

//
// You need to create a login of type "synchronization" in the Mobminder setup. 
//
// To access the main spec page, use : 
// 		http://localhost/be.mobminder.com/app07/mobminder/ai/documents/specifications.php?lgn=mobapi&pwd=girafe&kid=28283&web=1
//
// Use always your login data when calling this file: 
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738
// 
// Testing: use &web=1 to get html rendering.
// When testing is over, you can POST instead of GET and you forget web=1... The ajax response contains the query results in <file></file>
//
// http://be.mobminder.com/app07/mobminder/ai/query/visitors.php?lgn=voxy&pwd=laura&kid=19102&web=1&mobile=5599&lastname=hove
//
// Birthday variants: (accepted separators are space, dot, slash and minus [ /.-], accepted formats are YYYY MM DD or DD MM YYYY)
//
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&birthday=1970.12.30
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&birthday=1970%2012%2030
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&birthday=1970-12-30
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&birthday=1970-12-5
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&birthday=5-12-1970
//
// Mobile variants: (you use the last digits of the number, 6 digits give a 1/1.000.000 precision)
//
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=+32493655599
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=0493655599
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=3655599
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=599
//
// Phone variants
//		http://localhost/app07/mobminder/ai/query/visitors.php?gender=1&phone=%2B3226621800&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1 // where %2B is the url format for +
//
// Birthday and mobile combination:
//
// 		http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=599&birthday=30.12.1970
//
// 		if mobile and phone and lastname total digits counts more than 5, the birthday can be non encoded in the DB
// 			http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=65599&birthday=30.12.1970
// 			http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=665599&birthday=30.12.1970 will search also files with birthday = 0
//			http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=99&lname=hove&birthday=30.12.1970 will search also files with birthday = 0
//
// Other combinations
//
// http://localhost/app07/mobminder/ai/query/visitors.php?lgn=vx&pwd=vx&kid=18738&web=1&mobile=599&birthday=30.12.1970&gender=0
//
// 
// email address 
//
// http://localhost/app07/mobminder/ai/query/visitors.php?mobile=599&lgn=h4daxa&pwd=h4daxa&kid=20116&web=1
//
// 


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
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
		$bdday 	= @$_REQUEST['bdday']; 			if(isset($bdday)) 	$bdday 		= $bdday; 	else $bdday = ''; 
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


	
//////////////////////////////////////////////////////////////////////////////////////////
//
//    1.   I N      A C C O U N T      S E A R C H 


h1(' I N      A C C O U N T      S E A R C H '); 

$perfReport->peak('     IAS::ready to process');
if(0) {
	
	// strategy:1
	// first of all, we give us a chance to pick one unique match from the current account on cross firstname x lastname phonetique match
	// so, we call guess_firstname() and guess_lastname() on C_dbAccess_visitors()
	
	if($fnm) {
		
				$dmFN = new DoubleMetaphone($fnm);
			$metaphone1 = $dmFN->result['primary'];
			$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		$visis->guess_firstname($aid, $metaphone1, $metaphone2);
		
		h3('IAS FName : '.$visis->count()).' candidates.';
		foreach($visis->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = ''; if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching FN: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		
		$perfReport->peak('     IAS::firstname done');
		
	} 
	if($lnm) {
		
		$visis2 = new C_dbAccess_visitors(); 
				$dmLN = new DoubleMetaphone($lnm);
			$metaphone3 = $dmLN->result['primary'];
			$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';
		$visis2->guess_lastname($aid, $metaphone3, $metaphone4);
		
		h3('IAS LName : '.$visis2->count()).' candidates.';
		foreach($visis2->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = '';
			if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching LN: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		$visis->intersect($visis2);
		
		$perfReport->peak('     IAS::lastname done');
		
		
	}
	if($bdday&&$bdmonth&&$bdyear) {
		
		$visis3 = new C_dbAccess_visitors(); 
		$l_bdday = strlen($bdday);
		$l_bdmonth = strlen($bdmonth);
		$l_bdyear = strlen($bdyear);
		
		$bth = $bdyear.$bdmonth.$bdday;
		$visis3->loadOnBirthdate($aid, $bth); // this loads all of visitors from this account having a matching birthday. Not appropriate for a 9mio records DB.
		
		h3('IAS Birthday: '.$visis3->count()).' candidates.';
		foreach($visis3->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = '';
			if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching Birthdays: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		
		// intersecting with previous results
		$visis4 = new C_dbAccess_visitors();
		$countbirthdates = 0; // count the number of exact match on birthday
		foreach($visis->keyed as $vid => $dS_visitor) { 
			if($dS_visitor->birthday) { // the visitor collected above has a birthday indicated
				if($dS_visitor->birthday == $bth) {
					$visis4->add($dS_visitor, $vid); 
					$countbirthdates++;
				}
			}
			else $visis4->add($dS_visitor, $vid); // when no birthday was present, it might be the good one, but unknow from our DB
		}
		$visis = $visis4; // $visis4 holds what remains from loose filtering on birthdays (exact match on bd and/or no birthday available items)
		$count = $visis->count();
		
		$visis5 = new C_dbAccess_visitors(); 
		
		if($countbirthdates<=$count&&!!$countbirthdates) { // there is some findings, some have a correct birthday and matching fn ln duet (probably doublons)
		
			foreach($visis->keyed as $vid => $dS_visitor)
					if($dS_visitor->birthday) { $visis5->add($dS_visitor, $vid); break; } // one unique match FLB match is fine and best, we stop here.
			
			
		} else { // no birthday at all, let's proceed with the continuing of this script
			
			if($count==1) { // then there is no ambiguïty, we found the one, it doesn't have a birthday attached, let's fix it.
				$visis5 = $visis; // keeps the one only item.
				$visis5->getfirst()->birthday = $bth; // That is a WON
			}
			else { // we keep it like it is also
				$visis5 = $visis;	// a bunch of matches with no birthday at all
			}
		}
		$visis = $visis5;
		$perfReport->peak('     IAS::birthday done');
}


// if that is zero: unknown combination, with or without birthday invloved, in the account
// if that is one: we have the WINNER
// if that is more than one but all are birthdateless: we check for a better match inclusive birthday, through the all mobminder world.
$inaccountmatchcount = $visis->count();





//////////////////////////////////////////////////////////////////////////////////////////
//
//    2.     I N       M O B M I N D E R       S E A R C H 


h1(' I N       M O B M I N D E R       S E A R C H '); 
if($inaccountmatchcount != 1) { // then search the entire DB

	// strategy:2.1
	// No match at all in the account. Ok, let's see if this person is known from anywhere else in another account.
	// so, we call guess_firstname() and guess_lastname() on C_dbAccess_visitors() with $aid = false
	
	$visis2 = new C_dbAccess_visitors(); 
	if($fnm) {
		
				$dmFN = new DoubleMetaphone($fnm);
			$metaphone1 = $dmFN->result['primary'];
			$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		$visis2->guess_firstname(false, $metaphone1, $metaphone2);
		
		h3('IMS FName : '.$visis2->count()).' candidates.';
		foreach($visis2->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = ''; if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching FN: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		
		$perfReport->peak('     IMS::firstname done');
		
	} 
	if($lnm) {
		
		$visis3 = new C_dbAccess_visitors(); 
				$dmLN = new DoubleMetaphone($lnm);
			$metaphone3 = $dmLN->result['primary'];
			$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';
		$visis3->guess_lastname(false, $metaphone3, $metaphone4);
		
		h3('IMS LName : '.$visis3->count()).' candidates.';
		foreach($visis3->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = '';
			if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching LN: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		$visis2->intersect($visis3);
		
		$perfReport->peak('     IMS::lastname done');
		
	}
	// here, $visis2 contains a set of matching fn ln duets, with or maybe without birthday.
	
	$visis3 = new C_dbAccess_visitors(); 
	if($bdday&&$bdmonth&&$bdyear) { // in this stage, if the inaccountmatchcount was > 1, we try to select the right guy on his birthday
		
		$l_bdday = strlen($bdday);
		$l_bdmonth = strlen($bdmonth);
		$l_bdyear = strlen($bdyear);
		
		$bth = $bdyear.$bdmonth.$bdday;
		$visis2->filterOnBirthdate($bth,'visitorsbymetphone.php C_dbAccess_visitors::C_dbGate::filterOnBirthdate()'); // remains only the lucky ones with matching birthday
		
		// from here, $visis2 contains only matching fn ln duet + correct birthday, as seen from entire DB
		
		if($inaccountmatchcount > 1) {
			
			foreach($visis->keyed as $vid => $dS_IASvisitor) { // those are from IAS, and there are more than one
				foreach($visis2->keyed as $vid => $dS_IMSvisitor) { // those are from IMS, they have birthdays
					$IMSfn = strtolower($dS_IMSvisitor->firstname); $IMSfn = reduceDiacriticsUTF8($IMSfn, $firstwordonly = false, $keepspaces = false);
					$IMSln = strtolower($dS_IMSvisitor->lastname); $IMSln = reduceDiacriticsUTF8($IMSln, $firstwordonly = false, $keepspaces = false);
					$IASfn = strtolower($dS_IASvisitor->firstname); $IASfn = reduceDiacriticsUTF8($IASfn, $firstwordonly = false, $keepspaces = false);
					$IASln = strtolower($dS_IASvisitor->lastname); $IASln = reduceDiacriticsUTF8($IASln, $firstwordonly = false, $keepspaces = false);
					
					if($IMSfn == $IASfn)
					if($IMSln == $IASln)
						$dS_IMSvisitor->birthday == $bth;
						$visis3->add($dS_IMSvisitor);
						break; // we have a winner found in IMS, having exact same birthday and literal fn ln.
				}
			}
			
			
		} else { // there was no match from IAS, let's pick the first one we found here
			$butfirst = $visis2->getfirst();
			$visis2->reset($butfirst);
			$visis3 = $visis2; // this is a WON
		}
		
		h3('IMS Birthday: '.$visis3->count()).' candidates.'; // Here, there can be only ONE candiate or EITHER ZERO.
		foreach($visis3->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = '';
			if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching Birthdays: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		
		$perfReport->peak('     IMS::birthday done');
		
	}
	
	$visis = $visis3;
	
} else { // $inaccountmatchcount == 1, the game was WON at IAS stage.
	
}

// Is this zero: No metaphone match of the fn x ln duet, through entire Mobminder DB.
// Is this one: WON
// Is this more than one?
	
$globalmatchcount = $visis->count();



//////////////////////////////////////////////////////////////////////////////////////////
//
//    3.      B U I L D    U P     F R O M     S T A T S 

	
	// strategy:3
	// As no (fn x ln) duet match was possible in account and in mobminder scope, 
	// let's build up the most probable combination by looking at statistics
	// So here, the fallback strategy is to create a new C_dS_visitor()

h1('   I N       S T A T S       S E A R C H   '); 
if($globalmatchcount == 0) {
	if($fnm) {
		
		$firstnames = new C_dbAccess_genders();
		
				$dmFN = new DoubleMetaphone($fnm);
			$metaphone1 = $dmFN->result['primary'];
			$metaphone2 = $dmFN->result['secondary']; if($metaphone2==$metaphone1) $metaphone2 = '';
		$firstnames->guess_stat_firstname($metaphone1, $metaphone2);
		
		h3('FName : '.$firstnames->count()).' candidates.';
		$winner = 0;
		foreach($firstnames->keyed as $lid => $dS_stat_gender) {
			$count = $dS_stat_gender->males + $dS_stat_gender->females;
			wo_indent('Matching FNname: ('.$lid.'): '.$dS_stat_gender->name.', '.$dS_stat_gender->males.'m / '.$dS_stat_gender->females.'f',6);
		}
		
		$perfReport->peak('     ISS::firstname done');
		
	} 
	if($lnm) {
		
		$lastnames = new C_dbAccess_lastnames(); 
				$dmLN = new DoubleMetaphone($lnm);
			$metaphone3 = $dmLN->result['primary'];
			$metaphone4 = $dmLN->result['secondary']; if($metaphone4==$metaphone3) $metaphone4 = '';
		$lastnames->guess_stat_lastname($metaphone3, $metaphone4);
		
		h3('LName : '.$lastnames->count()).' candidates.';
		foreach($lastnames->keyed as $lid => $dS_stat_lastname) {
			wo_indent('Matching LName: ('.$lid.'): '.$dS_stat_lastname->name.', '.$dS_stat_lastname->occurances.'x',6);
		}
		$visis->intersect($lastnames);
		
		$perfReport->peak('     ISS::lastname done');
		
	}
	if($bdday&&$bdmonth&&$bdyear) { // set up this date as birthday, to a new C_dS_visitor
		
		$visis3 = new C_dbAccess_visitors(); 
		$l_bdday = strlen($bdday);
		$l_bdmonth = strlen($bdmonth);
		$l_bdyear = strlen($bdyear);
		
		$bth = $bdyear.$bdmonth.$bdday;
		$visis3->loadOnBirthdate(false, $bth);
		
		h3('Birthday: '.$visis3->count()).' candidates.';
		foreach($visis3->keyed as $vid => $dS_visitor) {
			$dsfntolower = ''; if($dS_visitor->firstname) $dsfntolower = strtolower($dS_visitor->firstname);
			$dslntolower = ''; if($dS_visitor->lastname) $dslntolower = strtolower($dS_visitor->lastname);
			
			$showup = '';
			if( ($dsfntolower==$fntolower) && ($dslntolower==$lntolower) ) $showup = ' <<<<<<<<<<<<<<';
			wo_indent('Matching Birthdays: ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname.' ('.$dS_visitor->birthday.')'.$showup,6);
		}
		
		// intersecting with previous results
		$visis4 = new C_dbAccess_visitors(); 
		foreach($visis->keyed as $vid => $dS_visitor) {
			if($dS_visitor->birthday) { if($dS_visitor->birthday == $bth) $visis4->add($dS_visitor, $vid); }
			else $visis4->add($dS_visitor, $vid); // when no birthday was present, it might be the good one, but unknow from our DB
		}
		$visis = $visis4; // $visis4 holds what remains from loose filtering on birthdays
		$perfReport->peak('     ISS::birthday done');
	}
}
	

if(0) if($id||$lnm||$fnm||$phn||$mob||$bth||$gnd||$eml) {
		$corequery = 'SELECT * FROM visitors WHERE groupId='.$aid.' AND deletorId = 0';
		$limit = ' LIMIT 200;';
	$SQL = $corequery.$id.$eml.$gnd.$lnmq.$fnmq.$ctmq.$phn.$mob.$bth.$limit;
	
	if($web) wo_indent($nl.$SQL.$nl);
	
	$visis->loadMany($SQL);
	
	if($lnm) 
	if(!$exactname) // if you were searching for an exact set of digits, the following combination match is meaningless
	if($visis->count()) { // note that for the web app, this additional work is done at client side, see (*ac01*)
		
		wo_pad(0);
		// if 'loh' is the entering search key, we should return any combination of [l'hoest, l-hoest, l hoest]
		// but if the entering search key is an explicit 'l-ho', then we return the precise match which is [l-ho]
		$letters = str_split($lnm);
		$spaced = implode('[ \'-]*',$letters); // if your letters arrived like "lho", $spaced is "l[ -']*h[ -']*o" which is the needed regexp
		
			foreach($visis->keyed as $vid => $dS_visi) { 
				wo_indent($dS_visi->lastname.'<br/>');
				preg_match('/'.$spaced.'/i', $dS_visi->lastname, $matches, PREG_OFFSET_CAPTURE);
				if(count($matches))
					wo_indent('Precise match for |'.$matches[0][0].'| on position '.$matches[0][1],6);
				else
					unset($visis->keyed[$vid]);
			}
	}
}

h3('Remaining visitors:'.$visis->count());
foreach($visis->keyed as $vid => $dS_visitor) {
	wo_indent('Matching LN : ('.$vid.'): '.$dS_visitor->firstname.', '.$dS_visitor->lastname,6);
}
	
$perfReport->peak('::visitors have been found');


wo_pad(0);
$vqcount = $visis->count();

if($vqcount) notice('<info>number of visitors found: '.$vqcount.'</info>');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   M A G N I F Y      V I S I T O R S 


if($vqcount)
	if($cuein) if($cueout) {
		$q = new Q('SELECT id FROM reservations WHERE groupId='.$aid.' AND deletorId=0 AND cueout>'.$cuein.' AND cuein<'.$cueout.';', 'checking visitors overbooking');
		$tfoids = $q->ids(); // time frame overload ids
		
		
		if($tfoids) {
			$vids = $visis->getIdsList();
			$q = new Q('SELECT DISTINCT resourceId as id FROM att_visitors WHERE groupId IN ('.$tfoids.') AND resourceId IN ('.$vids.');', 'checking visitors overbooking');
			$voids = $q->ids(); // ids of visitors from the auto-complete list who are already attendees on this time frame
			warning('Overbooked visitors: '.$voids.' based on cuein and cueout you provided', 3);
			
				$voids = $q->ids(list_as_array);
			foreach($voids as $vid) $visis->keyed[$vid]->selection = 1; // we use the 'selection' field to inform the client side about this visitor being staffed already
			
		} else {
			indent('No overbooked visitor in this time frame');
		}

	}

$perfReport->peak('::visitors have been magnified');

wo_pad();
	
	

//////////////////////////////////////////////////////////////////////////////////////////
//
//   T U T O R I A L 

$vfields = C_api::fieldslist('C_dS_visitor');
wo_pad();
if($web||$vqcount) {
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