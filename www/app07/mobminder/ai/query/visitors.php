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


$perfReport->peak('::time needed to retrieve context and posted parameters');


//////////////////////////////////////////////////////////////////////
//
//   S C R E E N I N G     I N P U T     P A R A M E T E R S 
//

wo_pad();
h2('Input fields check up');
	
	h3('Checking fields');
	
		$id 	= @$_REQUEST['id']; 		if(isset($id)) $id = $id; else $id = '';

		$mob 	= @$_REQUEST['mobile']; 	if(isset($mob)) $mob = $mob; else $mob = '';
		$phn 	= @$_REQUEST['phone']; 		if(isset($phn)) $phn = $phn; else $phn = '';
		$bth 	= @$_REQUEST['birthday']; 	if(isset($bth)) $bth = $bth; else $bth = ''; // will be false or a sortable birthday
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
			wo_indent('o birthdate : '.($bth?$bth:'-'));
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
		
		if(!($id||$fnm||$lnm||$phn||$mob||$bth||$eml||$city||$gnd))
			abort('0200','You must specify at least one creterion when calling this tool.');
		
		if(!($id||$fnm||$lnm||$phn||$mob||$bth||$eml||$city)) if($gnd)
			abort('0201','You must always use at least one other criterion in combination with the gender parameter.');
	
	
	h3('Screening disallowed fields');
	
		wo_indent('none',6);
	
	h3('Screening disallowed characters in fields');
	
	
		if($allok = fieldscleaner($_REQUEST)) wo_indent('all fields are made from allowed chars',6);
		wo_pad(0); 

	
	h3('Fields format/value validation');
		
	
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
//   F E T C H     V I S I T O R S      F O U N D     A T     S E R V E R    S I D E

h2('Query'); 
	
$visis = new C_dbAccess_visitors(); 
$lnmq = ''; $fnmq = ''; $ctmq = '';

if($id) $id = ' AND id = '.$id;
else {

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

// 
//
// yu. sur l'api ?
// spa ramène spé

if($id||$lnm||$fnm||$phn||$mob||$bth||$gnd||$eml) {
		$corequery = 'SELECT * FROM visitors WHERE groupId='.$context->dS_account->id.' AND deletorId = 0';
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

$perfReport->peak('::visitors have been found');


wo_pad(0);
$vqcount = $visis->count();

if($vqcount) notice('<info>number of visitors found: '.$vqcount.'</info>');


//////////////////////////////////////////////////////////////////////////////////////////
//
//   M A G N I F Y      V I S I T O R S 


if($vqcount)
	if($cuein) if($cueout) {
		$q = new Q('SELECT id FROM reservations WHERE groupId='.$context->accountid.' AND deletorId=0 AND cueout>'.$cuein.' AND cuein<'.$cueout.';', 'checking visitors overbooking');
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