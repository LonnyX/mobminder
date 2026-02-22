<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//    S Y N C H R O     I N I T I A L I Z E     V I S I T O R S
//

require '../../classes/language.php'; // getTextBetweenTags()
require '../../../lib_mobphp/dbio.php';
require '../../../lib_mobphp/smsgateaway.php';
require '../../../lib_mobphp/comm.php';
require '../lib.php';

ini_set('memory_limit', '2048M');

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Login gate
//

$perfReport = new C_perfReport();

$dS_login = quicklogin();
$dS_accesskey = quickkey($dS_login->id);
$dS_account = new C_dS_group($dS_accesskey->accountId);

$accountId = $dS_account->id;
$skeyId = $dS_accesskey->id;

$check 	= @$_POST['check']; if(isset($check)) $check = !!$check; else $check = false;
$clean 	= @$_POST['clean']; if(isset($clean)) $clean = !!$clean; else $clean = false;
$revrs 	= @$_POST['reverse']; if(isset($revrs)) $revrs = !!$revrs; else $revrs = false;
$web 	= @$_POST['web']; if(isset($web)) $web = !!$web; else $web = false;
$encod 	= @$_POST['encoding']; if(!isset($encod)) $encod = false; // encoding false leads to auto-detection of encoding

msg('Check mode: '.($check?'YES':'Nope'));
msg('Clean up first: '.($clean?'YES':'Nope'));
msg('Reverse init: '.($revrs?'YES':'Nope'));


$perfReport->peak('::time needed to retrieve context and posted parameters');


////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Receiving the file
//

$f = new postedfile($dS_account, $dS_login->email);
$f->tolines($encod);
$v = $f->csv_toVisitors();
$perfReport->peak('::file read');
	msg('File read successfully!'); 

fixgenders($v, true /*preload*/);
$perfReport->peak('::guessing genders processed');
	msg('Fixing genders is done!'); 
	
set_time_limit(900); // take a breath ( allows 1 more min execution )

$v = vpostprocess($v, $dS_accesskey, $dS_account); // $v contains visitors arriving from remote software
$perfReport->peak('::post process done');
	msg('Postprocessing is done!'); 


function deltasec($i,$o) { $seconds = (((($o-$i)*1000)|0)/1000); return $seconds.'sec'; } // $i and $o are microseconds, output is seconds coma milliseconds

function sanitize($s) { // make a string lowercase and a-z characters, make it at least 3 chars long also
	$i = mb_strtolower($s, 'UTF-8'); 
		$i = trim(preg_replace(utf8_encode('/[^אגדחיטכךפצמןûשüÿ\'a-z]/'), '', $i));
		while(mb_strlen($i, 'UTF-8')<3) $i .= '_'; // make it at least length 3
	return $i;
}

if($revrs) { // applies when Mobminder is already in use when a remote app initiates a sync

	// In this case there is no creation of dS_visitors from scratch, but only the dS_synchro_visitors are created after a match with existing visitors.
	//
	// 3 possible cases for visitors:
	// - (1) - The remote visitor has a unique match with a Mobminder visitor (based on first/lastname/birthday/mobile). Only the dS_synchro_visitors entry is created
	// - (2) - The remote visitor has no match in Mobminder. We create a new dS_visitor and a dS_synchro_visitors.
	// - (3) - Mobminder visitors are left with no match with remote. Those one are resolved during the first sync (see (4) )
	//
	// (4) After the "reverse init" procedure, the first app/visi sync must force a syncTime anterior to the Mobminder account creation. That will
	// 		force unmatched Mobminder visitors to create a file in the remote application. The sync is complete!
	//
	// Note that when a match is found between two records, we will enrich the Mobminder DB with missing data at our side
	
	$cuein = microtime(true);
	$q = new Q('select id, firstname, lastname, zipCode, phone, mobile, address, city, birthday from visitors where groupId = '.$accountId.' and deleted = 0;');
	$lci = 0; // local count initially
	
	// From actual Mobminder DB we created a tree registery that we can quickly traverse to a given lastname
	//
				$letters = Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '\\');
			$beta = Array();
		foreach($letters as $l) $beta[$l] = Array();
		foreach($letters as $l1) foreach($letters as $l2) $beta[$l1][$l2] = Array();
		foreach($letters as $l1) foreach($letters as $l2) foreach($letters as $l3) $beta[$l1][$l2][$l3] = Array();
	
	while($r = $q->result->fetch_array()) { // scanning Mobminder side visitors, building a comparison registery
	
		$id = $r['id']; // $r is a record from Mobminder DB
		
		$ln = sanitize($r['lastname']); 
		$fn = sanitize($r['firstname']); 
		
		$zc = mb_strtolower($r['zipCode']	, 'UTF-8');
		$ph = mb_strtolower($r['phone']		, 'UTF-8');
		$mb = mb_strtolower($r['mobile']	, 'UTF-8');		// this data is used for searching matches only, so we can keep it all lowercase
		$ct = mb_strtolower($r['city']		, 'UTF-8');
		$ad = mb_strtolower($r['address']	, 'UTF-8');
		$lb = $r['birthday'];
		
		$l = mb_strlen($ln, 'UTF-8'); // $r is for remote data
		$r['x0'] = mb_substr($fn,0,2,'UTF-8').mb_substr($ln,-3,NULL,'UTF-8'); // $fn[0].$fn[1].$ln[$l-3].$ln[$l-2].$ln[$l-1]; // comparison based on initials
		$r['x1'] = $fn.$ln;  // comparison based on full lastname and firstname
		$r['x2'] = $mb; // comparison based on initials and birthday
		$r['x3'] = $lb; // comparison based on initials and mobile phone number
		$r['x4'] = $ln.$ct; // comparison based on lastname and city
		$r['x5'] = $ln.$zc; // comparison based on lastname and zipCode
		$r['xx'] = $id; // comparison based on mobminder id (in some case we can receive a merged file where some mobminder id's are already included)
		
		$l1 = mb_substr($ln,0,1,'UTF-8'); $l2 = mb_substr($ln,1,1,'UTF-8'); $l3 = mb_substr($fn,0,1,'UTF-8'); $beta[$l1][$l2][$l3][] = &$r;
		unset($r); $lci++;
	} 
	
	$lcid = 0; foreach($letters as $l1) foreach($letters as $l2) foreach($letters as $l3) $lcid += count($beta[$l1][$l2][$l3]);
	
	$perfReport->peak('Reverse Init::visitors loaded from existing visitors table');
	
	$enb = 0; // enriched counter for birthdate // when remote match is unique and brings more info than we have locally, we enrich the local data
	$ena = 0; // enriched counter for address
	$enm = 0; // enriched counter for mobile
	$enp = 0; // enriched counter for phone
	$nsv = 0; // new synchro_visitor links counter
	
		$matchlevels = Array('X',0,1,2,3,4,5,'Y');
		$matchaudit = Array();
	foreach($matchlevels as $l) $matchaudit[$l] = 0; // counters
		
	// now scan the uploaded file
	//
	foreach($v as $x => $r_dSv) { // r_ as remote dataset visitor // scanning remote arriving visitors
		
		$underbreak = false;
		$rl = sanitize($r_dSv->lastname); 
		$rf = sanitize($r_dSv->firstname); 
		
		$l = mb_strlen($rl, 'UTF-8'); // $r is for remote data
		$l1 = mb_substr($rl,0,1,'UTF-8'); $l2 = mb_substr($rl,1,1,'UTF-8'); $l3 = mb_substr($rf,0,1,'UTF-8');
		
		$ra = mb_strtolower($r_dSv->address, 'UTF-8'); 
		$rz = mb_strtolower($r_dSv->zipCode, 'UTF-8'); 
		$rm = mb_strtolower($r_dSv->mobile, 'UTF-8');
		$rc = mb_strtolower($r_dSv->city, 'UTF-8'); 
		$rb = $r_dSv->birthday; 
		
		$rx0 = mb_substr($rf,0,2,'UTF-8').mb_substr($rl,-3,NULL,'UTF-8'); //$rf[0].$rf[1].$rl[$l-3].$rl[$l-2].$rl[$l-1]; does not work with UTF8
		$rx1 = $rf.$rl; 
		$rx2 = $rm; 
		$rx3 = $rb; 
		$rx4 = $rl.$rc; 
		$rx5 = $rl.$rz;
		
		
		$mc = 0; // match counter
		$mcb = 100; // match counter best guess found
		$lm = false; // last matching dataset
		$p = false; 
		
		if(!isset($beta[$l1][$l2][$l3])) { // intitials are not in the right range
			msg('? Initials not in expected range : |'.$rx0.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->birthday );
		}
		else if(!count($beta[$l1][$l2][$l3])) { // intitials have no candidate
			msg('? No local candidate for those initials: |'.$rx0.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->birthday ); 
		}
		else { // there is at least one local candidate for this remote visitor
			
			$imatches = $beta[$l1][$l2][$l3]; // all candidates in this subset have identical lastname first 2 letters and firstname first letter
			
			// from the possible candidates, we are looking for a 1 to 1 unique match
			
			// MATCH ATTEMPT LEVEL 0
			foreach($imatches as $x => $yetin) { // try a very simple match using firstname[0,1].lastname[-1,-2,-3] concatenation ( 26^3 )
				
				if($rx0==$yetin['x0']) { $mc++; $lm = $imatches[$x]; $p=$x; } // if we have a single match after this comparison, we have the unique match already
				unset($yetin);
			} 
			// if($rx0=='somer') msg('L0:'.$mc);
			if($mc==1) $matchaudit[0]++;
			if($mc) if($mc<$mcb) $mcb = $mc;
			
			
			// MATCH ATTEMPT LEVEL 1
			if($mc==0 || $mc>1) { // try a strengher match of full firstname.lastname
				
				$mc = 0; 
				foreach($imatches as $x => $yetin) { // try a very simple match using firstname.lastname concatenation
					if($rx1==$yetin['x1']) { $mc++; $lm = $imatches[$x]; $p = $x; }
					unset($yetin);
				}
				// if($rx0=='somer') msg('L1:'.$mc);
				if($mc==1) { $matchaudit[1]++; }
				if($mc) if($mc<$mcb) $mcb = $mc;
			}
			
			// MATCH ATTEMPT LEVEL 2
			if($rm) if($mc==0 || $mc>1) { // try a match of mobile + initials(  26^2 x 499000000 )
			
				$mc = 0;
				foreach($imatches as $x => $yetin) { // try matching through address, this can change the value of $mc
					if($rx2==$yetin['x2']) { $mc++; $lm = $imatches[$x]; $p = $x; }
					unset($yetin);
				}
				// if($rx0=='somer') msg('L2:'.$mc);
				if($mc==1) { $matchaudit[2]++; }
				if($mc) if($mc<$mcb) $mcb = $mc;
			}
			
			// MATCH ATTEMPT LEVEL 3
			if($rb) if($mc==0 || $mc>1) { // try a match of birthday + initials ( 26^2 x 365 = 246 740 )
			
				$mc = 0;
				foreach($imatches as $x => $yetin) { // try matching through address, this can change the value of $mc
					if($rx3==$yetin['x3']) { $mc++; $lm = $imatches[$x];  $p = $x;}
					unset($yetin);
				}
				// if($rx0=='somer') msg('L3:'.$mc);
				if($mc==1) { $matchaudit[3]++; }
				if($mc) if($mc<$mcb) $mcb = $mc;
			}
			
			// MATCH ATTEMPT LEVEL 4
			if($rc) if($mc==0 || $mc>1) { // try a match of city + lastname
			
				$mc = 0;
				foreach($imatches as $x => $yetin) { // try matching through address, this can change the value of $mc
					if($rx4==$yetin['x4']) { $mc++; $lm = $imatches[$x]; $p = $x; }
					unset($yetin);
				}
				// if($rx0=='somer') msg('L4:'.$mc);
				if($mc==1) { $matchaudit[4]++; }
				if($mc) if($mc<$mcb) $mcb = $mc;
			}
			
			// MATCH ATTEMPT LEVEL 5
			if($rc&&$rz) if($mc==0 || $mc>1) { // try a match of zipcode + lastname
			
				$mc = 0;
				foreach($imatches as $x => $yetin) { // try matching through address, this can change the value of $mc
					if($rx5==$yetin['x5']) { $mc++; $lm = $imatches[$x];  $p = $x;}
					unset($yetin);
				}
				// if($rx0=='somer') msg('L5:'.$mc);
				if($mc==1) { $matchaudit[5]++; }
				if($mc) if($mc<$mcb) $mcb = $mc;
			}
			
			
			if($mc==1) { // unique match found (best case)
				
				$s = false; // s for 'to be saved'
				$ds = new C_dS_visitor($lm['id']); // load 
				unset($beta[$l1][$l2][$l3][$p]);
				
				if($r_dSv->birthday && $lm['birthday']=='0') { $ds->birthday = $r_dSv->birthday; $s = true; $enb++;	}
				if($r_dSv->address && $lm['address']=='') { $ds->address = $r_dSv->address; $ds->zipCode = $r_dSv->zipCode; $ds->city = $r_dSv->city; $s = true; $ena++; }
				if($r_dSv->mobile && $lm['mobile']=='') { $ds->mobile = $r_dSv->mobile; $s = true; $enm++; }
				if($r_dSv->phone && $lm['phone']=='') { $ds->phone = $r_dSv->phone; $s = true; $enp++; }
				if($s) {
					// msg('enriching visitor id '.$lm['id'].' - a birthday: '.$r_dSv->birthday.' - '.$lm['birthday']); 
					// msg(' - with birthday: '.$r_dSv->birthday.' - '.$lm['birthday']); 
					// msg(' - with mobile  : '.$r_dSv->mobile.' - '.$lm['mobile']); 
					// msg(' - with phone   : '.$r_dSv->phone.' - '.$lm['phone']); 
					// msg(' - with address : '.$r_dSv->address.' - '.$lm['address']); 
					if(!$check) $ds->save(); // no tracking 
				}
				unset($ds);
			} 
			else if($mcb==100&&$mc==0) {
				msg('? Initials match but no match found: |'.$rx0.'|'.$rx1.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->birthday );
				msg(chr(9).'Possible matches: (mcb='.$mcb.')');
				foreach($imatches as $x => $yetin) msg(chr(9).$yetin['x0'].'|'.$yetin['x1'].'| for '.$yetin['firstname'].','.$yetin['lastname'].','.$yetin['birthday']);
				
				$matchaudit['X']++; // counts the number of items that could not be matched
			}
			else if($mcb) { // many possible candidates were found
				
				$matchaudit['Y']++; // counts the number of items that could not be matched
				msg('? Initials match but multiple matches found: |'.$rx0.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->zipCode.','.$r_dSv->city );
				msg(chr(9).'Possible matches: (mcb='.$mcb.')');
				foreach($imatches as $x => $yetin) msg(chr(9).$yetin['x0'].'|'.$yetin['x1'].'| for '.$yetin['firstname'].','.$yetin['lastname'].','.$yetin['birthday']);
			}
		} 
		
		
		// produce data sets and write to DB
		//
		if($mc==1) { // there is a match !! here we use $lm (the last match), we create a sync tracking in the synchro_visitors table
						
			$dS_synchro_visitor = new C_dS_synchro_visitor(0, $accountId);
			$dS_synchro_visitor->skeyId = $skeyId;
			$dS_synchro_visitor->localId = $lm['id'];
			$dS_synchro_visitor->remoteId = $r_dSv->remoteId;
				
			if(!$check) $dS_synchro_visitor->dSsave();
			$nsv++;
			
		} else { // $mc = 0 for this $r_dSv, make a new one local visitor based on remote data
			
				$rid = $r_dSv->remoteId;
			unset($r_dSv->remoteId);
			if(!$check) $r_dSv->dSsave($accountId); // this produces saving the remotely uploaded vsitor, making so a new visitor in Mobminder
				$nid = $r_dSv->id;
			
			$dS_synchro_visitor = new C_dS_synchro_visitor(0, $accountId);
			$dS_synchro_visitor->skeyId = $skeyId;
			$dS_synchro_visitor->localId = $nid;
			$dS_synchro_visitor->remoteId = $rid;
			if(!$check) $dS_synchro_visitor->dSsave();
			$nsv++;
		}
		
			
	} // loop to next remote dataset visitor
	
	$lcf = 0; foreach($letters as $l1) foreach($letters as $l2) foreach($letters as $l3) $lcf += count($beta[$l1][$l2][$l3]);
	msg('Remote items count: '.count($v));
	msg('Local items count: '.$lci);
	msg('Number of matched items: '.($lcid-$lcf).' ('.$lcid.' initially in beta registers, '.$lcf.' left unmatched)');
	
	
	msg('number of enriched birthdays: '.$enb);
	msg('number of enriched addresses: '.$ena);
	msg('number of enriched mobiles: '.$enm);
	msg('number of enriched phones: '.$enp);
	
	msg('match levels:');
	foreach($matchaudit as $x => $mc)
		msg(chr(9).'match level '.$x.': '.$mc);
		msg(chr(9).'TOTAL UNIQUE MATCH (0,1,2,3,4,5) '.($matchaudit[0]+$matchaudit[1]+$matchaudit[2]+$matchaudit[3]+$matchaudit[4]+$matchaudit[5]));
		msg(chr(9).'TOTAL NON MATCH (X,Y) '.($matchaudit['X']+$matchaudit['Y']));
				
	$cueout = microtime(true);
	$cuedelta = deltasec($cuein,$cueout);
	msg(' visitors matched with existing and synchro_visitor links made: '.$nsv.' links, in '.$cuedelta);
	$perfReport->peak('Reverse Init::visitors matched with existing and synchro_visitor links made');

	die('ENDS UP HERE');
}


	

////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cleaning up the data
//

if($clean) {
	
	if($check) {
		
		msg('CLEAN UP: set up but not executed in check mode.');
		
	} else {
		
		new Q('delete from visitors where groupId = '.$accountId.';');
		$perfReport->peak('::All visitors have been deleted from the account');
		msg('CLEAN UP: visitors have been deleted.');
		if($f->hasRemoteId) {
			new Q('delete from synchro_visitors where groupId = '.$accountId.';');
			$perfReport->peak('::All the sync data have been deleted from the account');
			msg('CLEAN UP: sync data have been deleted.');
		}
		
	}
}



////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Saving the data
//
set_time_limit(1600); // take a breath ( allows 1 more min execution )

$o_dbAccess_synchro_visitors = new C_dbAccess_synchro_visitors();
if(!$check) {
	foreach($v as $c => $dS_v) {
		if($f->hasRemoteId) {
			$dS_s = $o_dbAccess_synchro_visitors->newVirtual();
			$dS_s->groupId = $accountId;
			$dS_s->skeyId = $dS_accesskey->id;
			$dS_s->remoteId = $dS_v->remoteId;
			
			unset($dS_v->remoteId); // mandatory before saving the dataSet
			unset($dS_v->rcolor); // mandatory before saving the dataSet
		}
		
		$dS_v->dSsave($accountId);
		
		if($f->hasRemoteId) {
			$dS_s->localId = $dS_v->id;
			$dS_s->dSsave($accountId);
		}
	}
	msg('The data has been saved to DB.'); 
	$perfReport->peak('::All visitors have been saved to the account');
} else {
	msg('Check mode! The data has NOT been saved to DB.'); 
}



	
	
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Return a file with local Ids
//
if($check) msg('You are in check mode: The sync time will not be recorded.');
	else $dS_login->setsynctime('visi');

if($web) echo '<file>'; // enclose the filecontent within the stream
	$filename = 'synchro_visi_init';
	if($check) echo 'You are in check mode: None local to remote Id reference created.';
		else echo $o_dbAccess_synchro_visitors->csvstream($filename, false /*fields*/, false /* include classname */, !$web /* headers */);
if($web) echo '</file>';


msg('##0## process successful, goodbye.##');


// Or return a perf report

$perfReport->peak('::completed');
if($web) $perfReport->dropReport();


?>