<?php
////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//                M A T C H      V I S I T O R S     
//
//         A R R I V I N G     O  N    I N T E R F A C E        
//
//                         W I T H 
//
//      L O C A L Y    E X I S T I N G     V I S I T O R S 
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                          C O P Y R I G H T      N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


class C_dS_V_counters {
	
	public $enb; // counters // see (*ec01*)
	public $ena;
	public $enm;
	public $enp;
	public $ene;
	public $enr;
	public $enf;
	public $eng;
	
	public $lec; // locally enriched visitor counter
	
	public function __construct() {
		$this->lec = 0; // locally enriched visitor counter
		
		$this->enb = 0; // enriched counter for birthdate // when remote match is unique and brings more info than we have locally, we enrich the local data
		$this->ena = 0; // enriched counter for address
		$this->enm = 0; // enriched counter for mobile
		$this->enp = 0; // enriched counter for phone
		$this->ene = 0; // enriched counter for email
		$this->enr = 0; // enriched counter for residences
		$this->enf = 0; // enriched counter for references
		$this->eng = 0; // enriched counter for registration
	}
	
	public function dropreport() {
		
		C_clevermatch::msg('Total of '.$this->lec.' enriched items in Mobminder:');
		C_clevermatch::msg(chr(9).'o number of enriched birthdays: '.$this->enb);
		C_clevermatch::msg(chr(9).'o number of enriched addresses: '.$this->ena);
		C_clevermatch::msg(chr(9).'o number of enriched mobiles: '.$this->enm);
		C_clevermatch::msg(chr(9).'o number of enriched phones: '.$this->enp);
		C_clevermatch::msg(chr(9).'o number of enriched emails: '.$this->ene);
		C_clevermatch::msg(chr(9).'o number of enriched residences: '.$this->enr);
		C_clevermatch::msg(chr(9).'o number of enriched references: '.$this->enf);
		C_clevermatch::msg(chr(9).'o number of enriched registration: '.$this->eng);
	}
}

class C_clevermatch {
	
	private $check; // check mode
	private $accountid; // 
	private $skeyid; // 
	private $wremid; // 
	
	private $beta; // 3 dimensional array matrix by initials
	private $assigned; 
	private $unmatched;
	private static $levenshtein_tolerance = 3;
	private $localsamplesize;
	
	
	private $enriching_counters;
	
	private $nsv; // newly imported visitor counter
	
	private $matchlevels; // different ways we use for matching ('initials','fullname','mobile','birthday','phone','city','email')
	private $matchaudit; // reporting on how the items were match (by mean of initials, mobile, birthday... )
	
	
	private $verbose;
	
	public function __construct($accountid, $skeyid, $locals, $remotes, $wremid, $check) {
		
		//	This class realizes two functions
		//
		//  1. match remote items with local items (so building records in synchro_visitors where remoteId is linked to local visitors.id)
		//  2. merge matched items such that unequally known data is copied from and shared with remote side
		//
		//  o the remaining unmatched remote items are created as new dS_visitor in Mobminder, inclusive synchro_visitors link (when $wremid is true)
		//  o the newly matched items get a new synchro_visitors link (when $wremid is true)
		//
		
		// $locals is an instance of class Q() where you filtered on the local candidates for this match
		// Examples :
		//
		// $q = new Q('select id, firstname, lastname, zipCode, phone, mobile, address, city, birthday, email, note from visitors where groupId = '.$accountId.' and deleted = 0;'); 
		//  
		// $q = new Q('select synchro_visitors.remoteId, visitors.id, firstname, lastname, zipCode, phone, mobile, address, city, birthday, email, note
		//		from visitors 
		//		left join synchro_visitors on synchro_visitors.localId = visitors.id 
		//		where visitors.groupId = '.$accountId.' and visitors.deleted = 0 and synchro_visitors.remoteId is NULL;');
		//
		//  
		
		// $remotes is an array of dS_visitor like [ 0 => dS_visitor, 1 => dS_visitor, 2 => dS_visitor, 3 => dS_visitor, 4 => dS_visitor, ...  ]
		//    as produced from incoming remote csv file by lib.php/postedfile::csv_to_visitors()
		// 
		
		// DB monitoring (for debugging)
		// Use the following SQL that show which data is linked, saved or changed during your test
		//
		// run the SQL a first time before any change (merge), keep this window. In a second window run the SQL again after the merge. 
		//
		// select visitors.id, created, changed, remoteId, firstname, lastname, zipCode, phone, mobile, address, city, birthday, email 
		// 		from visitors left join synchro_visitors on localId = visitors.id
		// 		where visitors.groupId = 3566 order by lastname asc;
		//
		// 
		
		$this->verbose = false; // logs more execution comments
		
		$this->check = $check;
		$this->accountid = $accountid;
		$this->skeyid = $skeyid;
		$this->wremid = $wremid;
		
		$this->unmatched = Array();
		$this->buildbeta();	$this->fillbeta($locals);
		
			$rcount = count($remotes);
			C_clevermatch::msg('o Total new remote items '.$rcount);
			C_clevermatch::msg('o Sample size items from Mobminder '.$this->localsamplesize);
			C_clevermatch::msg('o Includes remote ids: '.($this->wremid?'yes':'no'));
		
		// counting result of the merge // see (*ec01*)
		$this->enriching_counters = new C_dS_V_counters();
		
		$this->nsv = 0; // newly imported visitor
		
			// preparing counters for the match
			$this->matchlevels = Array('NoMatch','initials','fullname','mobile','birthday','phone','city','email','MultiMatch');
			$this->matchaudit = Array();
			
		foreach($this->matchlevels as $l) $this->matchaudit[0][$l] = 0; // counters for first pass ($pass = 0)
		foreach($this->matchlevels as $l) $this->matchaudit[1][$l] = 0; // counters for second pass ($pass = 0)
		
		
		foreach($remotes as $x => $r_dSv) {
			$r_dSv->match = false; // r_ as remote dataset visitor, we add one boolean field indicating if item was matched
			if(!$wremid) $r_dSv->remoteId = 0; // remote id initally set to zero
		}
		
		
		// match process starting here
		
		for($pass=0; $pass<2; $pass++) // we proceed with two rounds, $pass=0, then $pass=1
		{
			C_clevermatch::msg('&nbsp;');
			C_clevermatch::msg('&nbsp;.&nbsp;.&nbsp;. Scanning remote visitors input file - PASS:'.(1+$pass));
			if($pass) { // preparing second pass
				$this->beta['_']['_']['_'] = $this->unmatched; // in pass 2, all unmatched items are gathered here. So the match is initials independant.
				C_clevermatch::msg('Unmatched local visitors during pass 1:');
				foreach($this->unmatched as $uid => $rg) C_clevermatch::msg(chr(9).$uid.'|'.$rg['lastname'].'|'.$rg['firstname']);
			}
			
			foreach($remotes as $x => $r_dSv) {  // scanning remote arriving visitors
			
				if($r_dSv->match) continue; // was matched during first pass
				
					$rl = $this->sanitize($r_dSv->lastname); 
					$rf = $this->sanitize($r_dSv->firstname); 
						
				if($pass) { $l1 = $l2 = $l3 = '_'; } // this register is reserved for all items that could not match during the first pass. May be initials are faulty so we give them a chance to gather in a unique register
				else { 
					$l1 = substr($rl,0,1); 
					$l2 = substr($rl,1,1); 
					$l3 = substr($rf,0,1); // so if your name is Vanhove Pascal, you fall in register $beta['v']['a']['p']
				} 
				
				if(!isset($this->beta[$l1][$l2][$l3])) $this->nomatch($r_dSv, $pass);		// intitials are not in the right range (this should normally never happen after sanitize() )
				else if(!count($this->beta[$l1][$l2][$l3])) $this->nomatch($r_dSv, $pass); 	// intitials have no candidate
				else {
					// there is at least one local candidate inside $beta[$l1][$l2][$l3] for this remote visitor
					$mobcandidates = $this->beta[$l1][$l2][$l3]; 	// all candidates in this subset have identical lastname first 2 letters and firstname first letter
					$localmatch = $this->match($r_dSv, $mobcandidates, $pass, $rl, $rf);
					if($localmatch) { // match algo using any of mobile, birthday, or lenvenshtein distance on lastname and firstname
						
						$lid = $localmatch['id'];
						$this->assigned[$l1][$l2][$l3][] = $lid; // record the match
							unset($this->beta[$l1][$l2][$l3][$lid]); // prevent another assignment of this item
							unset($this->unmatched[$lid]); // remove from list of unmatched locals
						$r_dSv->match = true; // mark this remote item as matched (usefull during second pass)
					}
				}
			}
			
		} // loop to next round
		
		
		foreach($this->unmatched as $vid => $vvid) {
			$dS_v = new C_dS_visitor($vid);
			if(!$this->check) $dS_v->dSsave(); // touches visitors (tracking) that were not matched, in such a way that the first sync will bring them to the remote application.
		}
		
		
	}
	public function dropreport() {
		
		C_clevermatch::msg('Overall match quality:');
					$exactm = Array('initials','fullname','mobile','birthday','phone','city','email');
				$total_exact_match = 0;
				foreach($this->matchaudit as $p => $cs)
					foreach($exactm as $mtype) $total_exact_match+=$cs[$mtype];
					
			C_clevermatch::msg('o Total unique match '.$total_exact_match);
			C_clevermatch::msg('o Total multi-match '.($this->matchaudit[1]['MultiMatch']));
			C_clevermatch::msg('&nbsp;');
			
		$dS_v = false;	
		foreach($this->unmatched as $vid => $vvid) { $dS_v = new C_dS_visitor($vid); break; } // this is displaying $dS_v->changed
		
			C_clevermatch::msg('o Total NON MATCH in Mobminder: '.count($this->unmatched));
			if($dS_v) {
				C_clevermatch::msg(chr(9).count($this->unmatched).' unmatched mobminder have been touched and will be sync by the first delta sync');
				C_clevermatch::msg(chr(9).'touched (modif date set to '.$dS_v->changed.') and will be sync by the first delta sync');
				C_clevermatch::msg(chr(9).'Unmatched ids:'.implode(' |',array_keys($this->unmatched)));
			}
				
			C_clevermatch::msg('o Total NON MATCH from remote file: '.($this->matchaudit[1]['NoMatch']));
				C_clevermatch::msg(chr(9).$this->nsv.' new (unmatched) visitors were created in Mobminder');
					
		C_clevermatch::msg('&nbsp;');
		C_clevermatch::msg('<br/>Match counters:');
		foreach($this->matchaudit as $p => $counters) {
			C_clevermatch::msg('<br/>&nbsp;&nbsp;&nbsp; PASS '.$p);
			foreach($counters as $x => $mc)
				C_clevermatch::msg(chr(9).'o match level '.$x.': '.$mc);
		}
		
		C_clevermatch::msg('&nbsp;');
		$this->enriching_counters->dropreport();
		
	}
	public function reportunmatched() {
		
		$vs = new C_dbAccess_visitors();
			$ccss = new C_dbAccess_customCss($this->accountid); // here we associate the custom ccss remoteId with the mobminder ccss ids
			$ccss->synchro_magnify($this->skeyid);
		
		foreach($this->unmatched as $vid => $vvid) {
			$dS_v = new C_dS_visitor($vid);
			$dS_v->remoteId = 0; // indicates clearly that we couldn't match them
			$dS_v->rcolor = $ccss->get($dS_v->cssColor,'','remoteId'); 
			$vs->add($dS_v);
		}
		return $vs;
	}

	public static function clevermerge($r_dSv, $l_dSv, $checkmode = true, $verbose = false, $enriching_counters) { // r_ for remote, l_ for local
		
		$s = Array('b'=>false, 'a'=>false, 'm'=>false, 'p'=>false, 'e'=>false, 'r'=>false, 'f'=>false, 'g'=>false, 'n'=>false); // s for 'to be saved', needed when data could be imported from remote side
		$t = Array('b'=>false, 'a'=>false, 'm'=>false, 'p'=>false, 'n'=>false, 'e'=>false); // t for 'to be touched', needed when remote data misses some information we host at local side
	

		// now we check if some remote data, not localy present, can be imported locally  // see (*ec01*)
		// if so, we keep track in the $s[] array
		//
		if($r_dSv->birthday) 	{ $s['b'] = true; $enriching_counters->enb++; $l_dSv->birthday = $r_dSv->birthday; 	} 
		if($r_dSv->address) 	{ $s['a'] = true; $enriching_counters->ena++; $l_dSv->address = $r_dSv->address; $l_dSv->zipCode = $r_dSv->zipCode; $l_dSv->city = $r_dSv->city;  }
		if($r_dSv->mobile && $l_dSv->mobile=='') 	{ $s['m'] = true; $enriching_counters->enm++; $l_dSv->mobile = $r_dSv->mobile; }
		if($r_dSv->phone && $l_dSv->phone=='') 		{ $s['p'] = true; $enriching_counters->enp++; $l_dSv->phone = $r_dSv->phone; }
		if($r_dSv->email && $l_dSv->email=='') 		{ $s['e'] = true; $enriching_counters->ene++; $l_dSv->email = $r_dSv->email; }
		if($r_dSv->residence && $l_dSv->residence=='') 		{ $s['r'] = true; $enriching_counters->enr++; $l_dSv->residence = $r_dSv->residence; }
		if($r_dSv->reference && $l_dSv->reference=='') 		{ $s['f'] = true; $enriching_counters->enf++; $l_dSv->reference = $r_dSv->reference; }
		if($r_dSv->registration && $l_dSv->registration=='') 	{ $s['g'] = true; $enriching_counters->eng++; $l_dSv->registration = $r_dSv->registration; }
		if($r_dSv->note) { $s['n'] = true; $l_dSv->note .= ' / '.$r_dSv->note; }
		
		
		$sw = $s['b']||$s['a']||$s['m']||$s['p']||$s['e']||$s['r']||$s['f']||$s['g']||$s['n'];
		if($sw) {
			$enriching_counters->lec++;
			if($verbose) { // reporting
				C_clevermatch::msg(chr(9).'enriching local visitor file (id '.$l_dSv->id.') using data found in remote visitor (id '.$r_dSv->remoteId.')'); 
				if($s['b']) C_clevermatch::msg(chr(9).' - remote birthday: '.$r_dSv->birthday.' - / local:'.$l_dSv->birthday); 
				if($s['a']) C_clevermatch::msg(chr(9).' - remote address : '.$r_dSv->address.' - / local:'.$l_dSv->address); 
				if($s['m']) C_clevermatch::msg(chr(9).' - remote mobile  : '.$r_dSv->mobile.' - / local:'.$l_dSv->mobile); 
				if($s['p']) C_clevermatch::msg(chr(9).' - remote phone   : '.$r_dSv->phone.' - / local:'.$l_dSv->phone); 
				if($s['e']) C_clevermatch::msg(chr(9).' - remote email   : '.$r_dSv->phone.' - / local:'.$l_dSv->email); 
				if($s['r']) C_clevermatch::msg(chr(9).' - remote residence : '.$r_dSv->residence.' - / local:'.$l_dSv->residence); 
				if($s['f']) C_clevermatch::msg(chr(9).' - remote reference : '.$r_dSv->reference.' - / local:'.$l_dSv->reference); 
				if($s['g']) C_clevermatch::msg(chr(9).' - remote registration : '.$r_dSv->registration.' - / local:'.$l_dSv->registration); 
				if($s['n']) C_clevermatch::msg(chr(9).' - remote note : '.$r_dSv->note.' - / local:'.$l_dSv->note); 
			}
		}
		
		
		// now we check if remote data can be enriched from local data. 
		// this happens by touching the local dS such that it pops out by the first following delta sync
		// 
		//
		if($r_dSv->birthday==0 && $l_dSv->birthday!=='0'){ $t['b'] = true; } // more information in Mobminder than in remote DB
		if($r_dSv->address=='' && $l_dSv->address!=='') { $t['a'] = true; }
		if($r_dSv->mobile=='' && $l_dSv->mobile!=='') 	{ $t['m'] = true; }
		if($r_dSv->phone=='' && $l_dSv->phone!=='') 	{ $t['p'] = true; }
		if($r_dSv->email=='' && $l_dSv->email!=='') 	{ $t['e'] = true; }
		if($r_dSv->note=='' && $l_dSv->note!=='') 		{ $t['n'] = true; }
		
		$tw = $t['b']||$t['a']||$t['m']||$t['p']||$t['n']||$t['e'];

		if($verbose) if($tw) { // reporting
			C_clevermatch::msg(chr(9).'need for enriching remote visitor (id '.$r_dSv->remoteId.') from local visitor file (id '.$l_dSv->id.')'); 
			if($t['b']) C_clevermatch::msg(chr(9).' - local birthday: '.$l_dSv->birthday.' / remote: '.$r_dSv->birthday); 
			if($t['m']) C_clevermatch::msg(chr(9).' - local mobile  : '.$l_dSv->mobile.' / remote: '.$r_dSv->mobile); 
			if($t['p']) C_clevermatch::msg(chr(9).' - local phone   : '.$l_dSv->phone.' / remote: '.$r_dSv->phone); 
			if($t['a']) C_clevermatch::msg(chr(9).' - local address : '.$l_dSv->address.' / remote: '.$r_dSv->address); 
			if($t['e']) C_clevermatch::msg(chr(9).' - local email : '.$l_dSv->email.' / remote: '.$r_dSv->email); 
			if($t['n']) C_clevermatch::msg(chr(9).' - local note : '.$l_dSv->note.' / remote: '.$r_dSv->note); 
		}
		
		// execute touch or save
		// see (*cm10*) where is gathered all data we feed back to remote side
		//
		if(!$checkmode) { // some real DB recording executes under this condition
			// data was present locally and we want to send it to remote side, pop up is needed by first delta sync
			if($tw) $l_dSv->dSsave(); // to achieve this, we save the dS, that updates the local dS.changed field, see (*cm10*)
				else if($sw) $l_dSv->save(); // does not save tracking, no pop up is needed by first delta sync
		}
		
		return $sw ? 1 : 0; // returns 1 if a local item could be enriched
	}

	// private functions
	//
	private function match($r_dSv, $mlocals, $pass, $rl, $rf, $lax = false) { // use lax = true when the two series of visitors are supposed to be - almost - identicals
		
		
			$lt = self::$levenshtein_tolerance;
		
		
		// preparing match clues
			
			// $ra = trim(strtolower($r_dSv->address)); 
			$rz = trim(strtolower($r_dSv->zipCode)); 
			$rm = trim(strtolower($r_dSv->mobile));
			$rp = trim(strtolower($r_dSv->phone)); 
			$rc = trim(strtolower($r_dSv->city)); 
			$re = trim(strtolower($r_dSv->email)); 
			$rb = $r_dSv->birthday; 
			if($pass) $in = ''; else $in = substr($rf,0,2).substr($rl,0,2); // initials, Vanhove Pascal turns into vapa. During second pass, the match is initials independant
			
			// in the following $rx variables, we reproduce the match pattern established at (*MP01*)
			// they must stay strictly in line with (*MP01*)
			//
			$rx0_initials 	= substr($rf,0,2).substr($rl,-3); // must remain coherent with (*x0*), vanhove pascal becomes here paove : firstname two first letters and lastname last 3 letters
			$rx1_fullname 	= $rf.$rl; // $rf and $rl are the " sanitized() " version of lastname and firstname
				// note that following data rx2 to rx5 is only made from initials when the data is not present in the remote DB
			$rx2_mobile 	= $in.substr($rm,-8); // we use here the least significant 7 leading numbers, so there is no need to re-format the incoming Excel sheet
			$rx3_birthday 	= $in.$rb; 
			$rx4_phone 		= $in.substr($rp,-7); 
			$rx5_city		= $in.$rc;
			$rx6_email		= $in.$re;
		

		// local state variables
			$mcb = 100; // match count best guess (will decrease during match process, if it reaches 1, then we have a unique match)
			$lm = false; // last matching local dataset
			$mcbwich = ''; // holds which match level gave the best guess
			$blm = false; // best last match (this is populated when multiple matches were found)
			$lev = 0; // intra match level levenshtein distance
			$blev = 100; // best levenstein distance measured
		
		// from the possible candidates, we are looking for a 1 to 1 unique match
		
		// MATCH ATTEMPT LEVEL 0  
		$mc = 0; // intra level match counter
		
		foreach($mlocals as $x => $mobref) { // try a very simple match using firstname[0,1].lastname[-1,-2,-3] concatenation ( 26^5 )
			if($rx0_initials==$mobref['x0']) {
				$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on initials, we check that firstname.lastname is close to the remote data (levenstein test)
				if($lev<$lt) { // note here that we strenghten the levenstein threshold by one: using < iso <=
					if($lev<$blev) { // if multiple matches are close, we keep the closest ($blev)
						$mc++; $lm = $mlocals[$x]; $blev = $lev; // from all the folk that has the same initials, keep the closest levenstein differing
					}
				}
			} 
		} 
		if($mc==1) { // if we have a single match after this comparison, we have the unique match already
			$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['initials']++; 
			C_clevermatch::msg('unique match on initials for /'.$rl.'|'.$rf.'|'.$rx0_initials.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x0'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
		} // we found a unique match
		if($pass) // no multi match in pass 0, in the first pass we resolve only the best $mc==1 matches
			if($mc>1) // match counter indicates mutli match
				if($mc<$mcb) { // this multi match is more accurate than any found before
					$mcb = $mc; // update the best match indicator
					$mcbwich = 'initials('.$rx0_initials.')'; 
					$blm = $lm; // keep track of the last item in this best multi match 
				} 
		
		
		// MATCH ATTEMPT LEVEL 1
		if($mcb!==1) { 	// try a strengher match of full firstname.lastname
			$mc = 0; $blev = 100;
			foreach($mlocals as $x => $mobref) { // try a very simple match using firstname.lastname concatenation, strict comparison
				if($rx1_fullname==$mobref['x1']) { $mc++; $lm = $mlocals[$x]; }
			}
			if($mc==1) { 
				$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['fullname']++; 
				C_clevermatch::msg('unique match on strict firstname.lastname for /'.$rl.'|'.$rf.'|'.$rx1_fullname.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x1'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
			}
			if($pass) if($mc>1) if($mc<$mcb) { $mcb = $mc; $mcbwich = 'fullname('.$rx1_fullname.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
		}
		
		
		// MATCH ATTEMPT LEVEL 2
		if($rm) if($mcb!==1) { // try a match of mobile + initials (  26^2 x 9999999 )
			
			$mc = 0; $lev = 0; $blev = 100;
			
			foreach($mlocals as $x => $mobref) { // try matching through address, this can change the value of $mc
				if($mobref['x2']) { // no mobile in mobminder file would make $mobref['x2'] == 0, no match is possible in this case
					if($rx2_mobile==$mobref['x2']) { $mc++; $lm = $mlocals[$x]; }
					if($pass) if($rx2_mobile==substr($mobref['mobile'],-8)) 
					{ 
						$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on mobile, we check that firstname.lastname is close to the remote data
						if($lev<=$lt) // the match must be close enough
							if($lev<$blev) { // if multiple matches are close, we keep the closest ($blev)
								$mc++; $lm = $mlocals[$x]; $blev = $lev;
							}
					}
				}
			}
			if($mc==1) { 
				$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['mobile']++; 
				C_clevermatch::msg('unique match on mobile for /'.$rl.'|'.$rf.'|'.$rx2_mobile.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x2'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
			}
			if($pass) if($mc>1) if($mc<$mcb){ $mcb = $mc; $mcbwich = 'mobile('.$rx2_mobile.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
			
		}
		
		
		// MATCH ATTEMPT LEVEL 3
		if($rb) if($mcb!==1) { // try a match of birthday + initials ( 26^2 x 365 = 246 740 )
		
			$mc = 0; $lev = 0; $blev = 100;
			
			foreach($mlocals as $x => $mobref) { // try matching through address, this can change the value of $mc
				if($mobref['x3']) { // no birthday in mobminder file would make $mobref['x3'] == 0, no match is possible in this case
					if($rx3_birthday==$mobref['x3']) { $mc++; $lm = $mlocals[$x]; }
					if($pass) if($rx3_birthday==$mobref['birthday'])
					{ 
						$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on birthday, we check that firstname.lastname is close to the remote data
						if($lev<$lt) if($lev<$blev) { $mc++; $lm = $mlocals[$x]; $blev = $lev; }
					}
				}
			}
			if($mc==1) { 
				$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['birthday']++; 
				C_clevermatch::msg('unique match on birthday for /'.$rl.'|'.$rf.'|'.$rx3_birthday.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x3'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
			}
			if($pass) if($mc>1) if($mc<$mcb) { $mcb = $mc; $mcbwich = 'birthday('.$rx3_birthday.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
			
		}
		
		
		// MATCH ATTEMPT LEVEL 4
		if($rp) if($mcb!==1) { // try a match on phone
		
			$mc = 0; $lev = 0; $blev = 100;
			
			foreach($mlocals as $x => $mobref) { // try matching through address, this can change the value of $mc
				if($mobref['x4']) { // no phone in mobminder file would make $mobref['x4'] == 0, no match is possible in this case
					if($rx4_phone==$mobref['x4']) { $mc++; $lm = $mlocals[$x]; }
					if($pass) if($rx4_phone==substr($mobref['phone'],-7))
					{ 
						$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on phone, we check that firstname.lastname is close to the remote data
						if($lev<$lt) if($lev<$blev) { $mc++; $lm = $mlocals[$x]; $blev = $lev; }
					}
				}
			}
			if($mc==1) { 
				$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['phone']++;
				C_clevermatch::msg('unique match on phone for /'.$rl.'|'.$rf.'|'.$rx4_phone.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x4'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
			}
			if($pass) if($mc>1) if($mc<$mcb) { $mcb = $mc; $mcbwich = 'phone('.$rx4_phone.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
			
		}
		
		
		// MATCH ATTEMPT LEVEL 5
		if($re) if($mcb!==1) { // try a match on email
		
			$mc = 0; $lev = 0; $blev = 100;
			
			foreach($mlocals as $x => $mobref) { // try matching through address, this can change the value of $mc
				if($mobref['x6']) { // no email in mobminder file would make $mobref['x6'] == 0, no match is possible in this case
					// C_clevermatch::msg(('trying match on email for /'.$rl.'|'.$rf.'|'.$rx6_email.'/ with local /'.$mobref['x6'].'/'.$mobref['email'].'/'); 
					if($rx6_email==$mobref['x6']) { $mc++; $lm = $mlocals[$x]; }
					if($pass) if($rx6_email==trim(strtolower($mobref['email']))) // during second pass ($pass=1) we compare regardless of initials
					{ 
						$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on birthday, we check that firstname.lastname is close to the remote data
						// C_clevermatch::msg('XX finding match on email for /'.$rl.'|'.$rf.'|'.$rx6_email.'/ with local /'.$mobref['x6'].'/'.$mobref['email'].'/ levenshtein:'.$lev);
						if($lev<$lt) if($lev<$blev) { $mc++; $lm = $mlocals[$x]; $blev = $lev; }
					}						
				}
			}
			if($mc==1) { 
				$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['email']++;
				C_clevermatch::msg('unique match on email for /'.$rl.'|'.$rf.'|'.$rx6_email.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x6'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
			}
			if($pass) if($mc>1) if($mc<$mcb) { $mcb = $mc; $mcbwich = 'email('.$rx6_email.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
			
		}
		
		
		// MATCH ATTEMPT LEVEL 6
		if($lax)
			if($rc) if($mcb!==1) { // try a match on city
			
				$mc = 0; $lev = 0; $blev = 100;
				
				foreach($mlocals as $x => $mobref) { // try matching through address, this can change the value of $mc
					if($mobref['x5']) { // no city in mobminder file would make $mobref['x5'] == 0, no match is possible in this case
						// C_clevermatch::msg('trying match on city for /'.$rl.'|'.$rf.'|'.$rx5_city.'/ with local /'.$mobref['x5'].'/'.$mobref['city'].'/'); 
						if($rx5_city==$mobref['x5']) { 
							$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on city, we check that firstname.lastname is close to the remote data
							if($lev<=1) if($lev<$blev) { $mc++; $lm = $mlocals[$x]; $blev = $lev; }
						}
						if($pass) if($rx5_city==trim(strtolower($mobref['city']))) // during second pass ($pass=1) we compare regardless of initials
						{ 
							$lev = levenshtein($rx1_fullname,$mobref['x1']); // as the match is only on city, we check that firstname.lastname is close to the remote data
							// C_clevermatch::msg('XX finding match on city for /'.$rl.'|'.$rf.'|'.$rx5_city.'/ with local /'.$mobref['x5'].'/'.$mobref['city'].'/ levenshtein:'.$lev);
							if($lev<=2) if($lev<$blev) { $mc++; $lm = $mlocals[$x]; $blev = $lev; }
						}						
					}
				}
				if($mc==1) { 
					$mcb = 1; $blm = $lm; $this->matchaudit[$pass]['city']++;
					C_clevermatch::msg('unique match on city for /'.$rl.'|'.$rf.'|'.$rx5_city.'/ with local /'.$lm['lastname'].'|'.$lm['firstname'].'|'.$lm['x5'].'/'.($blev!=100?'levenshtein='.$blev:'')); 
				}
				if($pass) if($mc>1) if($mc<$mcb) { $mcb = $mc; $mcbwich = 'city('.$rx5_city.')'; $blm = $lm; } // entering here means you are the most accurate multi-match
				
			}
		
		
		
		// match attempts finish here, $mcb can be 100...1,
		
		if($mcb==100) return $this->nomatch($r_dSv, $pass); // returns false
		
		// else one or multi matches were found
			
		$lm = $blm; // we go for the last match in the most accurate multi match level
		
		if($mcb>1) { // many possible candidates were found (we will link to the last found match)
			
			// you never enter here during first pass
			// $mcb in range [2,...,99], some of the MATCH ATTEMPT has given multiple matches
			
			$this->matchaudit[$pass]['MultiMatch']++; // counts the number of items that were matched many times
			C_clevermatch::msg(':( Multiple matches found for this remote set: |'.$rx0_initials.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->zipCode.','.$r_dSv->city );
			C_clevermatch::msg(chr(9).'Possible matches on '.$mcbwich.', mcb='.$mcb.'');
			// foreach($mlocals as $x => $mobref) C_clevermatch::msg(chr(9).$mobref['x0'].'|'.$mobref['x1'].'| for '.$mobref['firstname'].','.$mobref['lastname'].','.$mobref['birthday']);
			
			$mcb = 1; // force creation of dS_synchro_visitor, see (*sv01*)
		}
		
		
		$this->merge($r_dSv, $rx1_fullname, $lm, $blev);
		
		// produce links now and data sets and write to DB
		//
		// (*sv01*) here we use $lm (the last match), we create a sync tracking in the synchro_visitors table
			
		if($this->wremid)	{ // records a remoteId		
			$dS_synchro_visitor = new C_dS_synchro_visitor(0, $this->accountid); // see (*cm02*)
			$dS_synchro_visitor->skeyId = $this->skeyid;
			$dS_synchro_visitor->localId = $lm['id'];
			$dS_synchro_visitor->remoteId = $r_dSv->remoteId;
			if(!$this->check) $dS_synchro_visitor->dSsave();
		}
		
		return $lm;
		
	}
	private function nomatch($r_dSv, $pass) {
		
		$this->matchaudit[$pass]['NoMatch']++; // counts the number of items that could not be matched
		
		if($this->verbose) {
			if($pass==0 ) // first pass ($pass==0)
				C_clevermatch::msg('first pass, no unique match found for remote data: '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->birthday.'' );
			if($pass==1) // second pass ($pass==1)
				C_clevermatch::msg('second pass, no match found for remote references: '.$r_dSv->remoteId.'| for '.$r_dSv->firstname.','.$r_dSv->lastname.','.$r_dSv->birthday );
		}
		
		if($pass) // only in second pass, if still no match was found, we will create a new dS_visitor in Mobminder
			$this->saveasnew($r_dSv);
			
		return false; // keep this !
	}
	private function merge($r_dSv, $rx1_fullname, $lm, $lev) { // copies missing data left and rights such that both DB will end up equal
	
		$ds = new C_dS_visitor($lm['id']); // load the local winnar that is a unique match to this remote DB item
		
		// Check if the firstname / lastname are written the same both sides
		//
		if($lev==100) { // no levenstein distance was calculated
			if($rx1_fullname!==$lm['x1']) $lev = 1; // alpha letters differ
			else if( trim(strtolower($r_dSv->lastname)) !==trim(strtolower($lm['lastname']))  ) $lev = 1; // lastnames differ
			else if( trim(strtolower($r_dSv->firstname))!==trim(strtolower($lm['firstname'])) ) $lev = 1; // firstnames differ
		}
		if($lev) { // we consider the remote side holding the correct name (because we mostly interface with e-ID cards reading capable systems)
			$ds->lastname = $r_dSv->lastname;
			$ds->firstname = $r_dSv->firstname;
		}
		
		if(0) {
			$s = Array('b'=>false, 'a'=>false, 'm'=>false, 'p'=>false, 'n'=>false, 'e'=>false, 'r'=>false, 'f'=>false); // s for 'to be saved'
			$t = Array('b'=>false, 'a'=>false, 'm'=>false, 'p'=>false, 'n'=>false, 'e'=>false, 'f'=>false, 'f'=>false); // t for 'to be touched'
			
			// now we check if some remote data can be written locally  // see (*ec01*)
			//
			if($r_dSv->birthday) { $s['b'] = true; $this->enriching_counters->enb++; $ds->birthday = $r_dSv->birthday; 	} 
			if($r_dSv->address) { $s['a'] = true; $this->enriching_counters->ena++; $ds->address = $r_dSv->address; $ds->zipCode = $r_dSv->zipCode; $ds->city = $r_dSv->city;  }
			if($r_dSv->mobile && $lm['mobile']=='') 	{ $s['m'] = true; $this->enriching_counters->enm++; $ds->mobile = $r_dSv->mobile; }
			if($r_dSv->phone && $lm['phone']=='') 		{ $s['p'] = true; $this->enriching_counters->enp++; $ds->phone = $r_dSv->phone; }
			if($r_dSv->email && $lm['email']=='') 		{ $s['e'] = true; $this->enriching_counters->ene++; $ds->email = $r_dSv->email; }
			if($r_dSv->residence && $lm['residence']=='') 		{ $s['r'] = true; $this->enriching_counters->enr++; $ds->residence = $r_dSv->residence; }
			if($r_dSv->reference && $lm['reference']=='') 		{ $s['f'] = true; $this->enriching_counters->enf++; $ds->reference = $r_dSv->reference; }
			if($r_dSv->registration && $ds->registration=='') 	{ $s['g'] = true; $this->enriching_counters->eng++; $ds->registration = $r_dSv->registration; }
			if($r_dSv->note) { $s['n'] = true; $ds->note .= ' / '.$r_dSv->note; }
			
			
			$sw = $s['b']||$s['a']||$s['m']||$s['p']||$s['n']||$s['e']||$s['r']||$s['f']||$s['g'];
			if($this->verbose) if($sw) { // reporting
				C_clevermatch::msg(chr(9).'enriching local visitor file (id '.$lm['id'].') using data found in remote visitor (id '.$r_dSv->remoteId.')'); 
				if($s['b']) C_clevermatch::msg(chr(9).' - remote birthday: '.$r_dSv->birthday.' - / local:'.$lm['birthday']); 
				if($s['m']) C_clevermatch::msg(chr(9).' - remote mobile  : '.$r_dSv->mobile.' - / local:'.$lm['mobile']); 
				if($s['p']) C_clevermatch::msg(chr(9).' - remote phone   : '.$r_dSv->phone.' - / local:'.$lm['phone']); 
				if($s['a']) C_clevermatch::msg(chr(9).' - remote address : '.$r_dSv->address.' - / local:'.$lm['address']); 
				if($s['r']) C_clevermatch::msg(chr(9).' - remote residence : '.$r_dSv->residence.' - / local:'.$lm['residence']); 
				if($s['f']) C_clevermatch::msg(chr(9).' - remote reference : '.$r_dSv->reference.' - / local:'.$lm['reference']); 
				if($s['g']) C_clevermatch::msg(chr(9).' - remote registration : '.$r_dSv->registration.' - / local:'.$lm['registration']); 
			}
			
			
			// now we check if remote data can be enriched from local data. This happens by touching the local dS such that it pops out by the first following delta sync
			//
			if($r_dSv->birthday==0 && $lm['birthday']!=='0'){ $t['b'] = true; } // more information in Mobminder than in remote DB
			if($r_dSv->address=='' && $lm['address']!=='') 	{ $t['a'] = true; }
			if($r_dSv->mobile=='' && $lm['mobile']!=='') 	{ $t['m'] = true; }
			if($r_dSv->phone=='' && $lm['phone']!=='') 		{ $t['p'] = true; }
			if($r_dSv->email=='' && $lm['email']!=='') 		{ $t['e'] = true; }
			if($r_dSv->note=='' && $lm['note']!=='') 		{ $t['n'] = true; }
			
			$tw = $t['b']||$t['a']||$t['m']||$t['p']||$t['n']||$t['e'];

			if($this->verbose) if($tw) { // reporting
				C_clevermatch::msg(chr(9).'need for enriching remote visitor (id '.$r_dSv->remoteId.') from local visitor file (id '.$lm['id'].')'); 
				if($t['b']) C_clevermatch::msg(chr(9).' - local birthday: '.$lm['birthday'].' / remote: '.$r_dSv->birthday); 
				if($t['m']) C_clevermatch::msg(chr(9).' - local mobile  : '.$lm['mobile'].' / remote: '.$r_dSv->mobile); 
				if($t['p']) C_clevermatch::msg(chr(9).' - local phone   : '.$lm['phone'].' / remote: '.$r_dSv->phone); 
				if($t['a']) C_clevermatch::msg(chr(9).' - local address : '.$lm['address'].' / remote: '.$r_dSv->address); 
			}
			
			// execute touch or save
			//
			if(!$this->check) { // data was present locally and we want to send it to remote side, pop up is needed by first delta sync
				if($tw) $ds->dSsave(); // to achieve this, we save the dS, that updates the local dS.changed field, see (*cm10*)
					else if($sw) $ds->save(); // does not save tracking, no pop up is needed by first delta sync
			}
		} else 
			C_clevermatch::clevermerge($r_dSv,$ds, $this->check, false, $this->enriching_counters);
			
		
		unset($ds);
		
	}
	private function saveasnew($r_dSv) {
		
			
		$rid = $r_dSv->remoteId;
			unset($r_dSv->remoteId); // this field doesn't enter our DB table
			unset($r_dSv->match); // this field doesn't enter our DB table
			unset($r_dSv->rcolor); // mandatory before saving the dataSet
		if(!$this->check) { 
			$r_dSv->dSsave($this->accountid); // this produces saving the remotely uploaded vsitor, making so a new visitor in Mobminder
			$this->nsv++;
		}
		
		if($this->wremid)	{ // records a remoteId	
				$nid = $r_dSv->id;
			$dS_synchro_visitor = new C_dS_synchro_visitor(0, $this->accountid);
			$dS_synchro_visitor->skeyId = $this->skeyid;
			$dS_synchro_visitor->localId = $nid;
			$dS_synchro_visitor->remoteId = $rid;
			if(!$this->check) $dS_synchro_visitor->dSsave();
		}
		
	}
	private function buildbeta() {
		
		// we created a tree registery ($beta) that we can quickly traverse to a given set of match candidates

			$letters = Array('a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z', '_');
		$this->beta = Array(); 
		$this->assigned = Array();
		
		foreach($letters as $l) { 
			$this->beta[$l] = Array();
			$this->assigned[$l] = Array(); 
		}
		foreach($letters as $l1) foreach($letters as $l2) { 
			$this->beta[$l1][$l2] = Array(); 
			$this->assigned[$l1][$l2] = Array(); 
		}
		foreach($letters as $l1) foreach($letters as $l2) foreach($letters as $l3) {
			$this->beta[$l1][$l2][$l3] = Array();
			$this->assigned[$l1][$l2][$l3] = Array();
		}
	}
	private function fillbeta($locals) {
		
		$this->localsamplesize = 0; // local count initially
		while($r = $locals->result->fetch_array()) { // scanning Mobminder side visitors, building a comparison registery
		
			$id = $r['id']; // $r is a record from Mobminder DB
			
			$ln = $this->sanitize($r['lastname']);  // sanitize makes them lowercase and cleans up any special chars like éèàô@#$%^©...
			$fn = $this->sanitize($r['firstname']); 
			
			$zip = trim(strtolower($r['zipCode']	));
			$phone = trim(strtolower($r['phone']	));
			$mobile = trim(strtolower($r['mobile']	));		// this data is used for searching matches only, so we can keep it all lowercase
			$city = trim(strtolower($r['city']	));
			$email = trim(strtolower($r['email']	));
			// $ad = trim(strtolower($r['address']	));
			$birth = $r['birthday'];
			$in = substr($fn,0,2).substr($ln,0,2); // initials, Vanhove Pascal turns into vapa
			
			// establishing match patterns (*MP01*)
			//
			$r['x0'] = substr($fn,0,2).substr($ln,-3); // comparison based on fn initials and lastname 3 significant trailing letters // must remain coherent with (*x0*)
			$r['x1'] = $fn.$ln;  // comparison based on full concatenated lastname and firstname
			$r['x2'] = $mobile?$in.substr($mobile,-8):0; // comparison based on initials and mobile phone number // we use here the least significant 7 leading numbers
			$r['x3'] = $birth?$in.$birth:0; // comparison based on initials and birthday
			$r['x4'] = $phone?$in.substr($phone,-7):0; // comparison based on least significant digits
			$r['x5'] = $city?$in.$city:0; // comparison based on initials and zipCode
			$r['x6'] = $email?$in.$email:0; // comparison based on initials and email
			
				$l1 = substr($ln,0,1); $l2 = substr($ln,1,1); $l3 = substr($fn,0,1); // note that we use 2 letters from lastname AND ONE FROM FIRSTNAME
			$this->beta[$l1][$l2][$l3][$id] = &$r;
			$this->unmatched[$id] = &$r;
			
				// $r is an array like 
				//
				// $r = { id, firstname, lastname, zipCode, phone, mobile, address, city, birthday, x0, x1, x2, x3, x4, x5, x6	}
				//
			
			// so if your name is Vanhove Pascal, you fall in register $beta['v']['a']['p']
			
			unset($r); 
			$this->localsamplesize++;
		} 
	}
	
	private function removeDiacritics($str) { // users might have introduced Jérôme Noël in remote software while they typed in Jerome Noel in Mobminder. We will reduce all special chars into the non accented
	  $a = array('À', 'Á', 'Â', 'Ã', 'Ä', 'Å', 'Æ',  'Ç', 'È', 'É', 'Ê', 'Ë', 'Ì', 'Í', 'Î', 'Ï', 'Ð', 'Ñ', 'Ò', 'Ó', 'Ô', 'Õ', 'Ö', 'Ø', 'Ù', 'Ú', 'Û', 'Ü', 'Ý', 'ß', 'à', 'á', 'â', 'ã', 'ä', 'å', 'æ',  'ç', 'è', 'é', 'ê', 'ë', 'ì', 'í', 'î', 'ï', 'ñ', 'ò', 'ó', 'ô', 'õ', 'ö', 'ø', 'ù', 'ú', 'û', 'ü', 'ý', 'ÿ', 'Ā', 'ā', 'Ă', 'ă', 'Ą', 'ą', 'Ć', 'ć', 'Ĉ', 'ĉ', 'Ċ', 'ċ', 'Č', 'č', 'Ď', 'ď', 'Đ', 'đ', 'Ē', 'ē', 'Ĕ', 'ĕ', 'Ė', 'ė', 'Ę', 'ę', 'Ě', 'ě', 'Ĝ', 'ĝ', 'Ğ', 'ğ', 'Ġ', 'ġ', 'Ģ', 'ģ', 'Ĥ', 'ĥ', 'Ħ', 'ħ', 'Ĩ', 'ĩ', 'Ī', 'ī', 'Ĭ', 'ĭ', 'Į', 'į', 'İ', 'ı', 'Ĳ',  'ĳ',  'Ĵ', 'ĵ', 'Ķ', 'ķ', 'Ĺ', 'ĺ', 'Ļ', 'ļ', 'Ľ', 'ľ', 'Ŀ', 'ŀ', 'Ł', 'ł', 'Ń', 'ń', 'Ņ', 'ņ', 'Ň', 'ň', 'ŉ', 'Ō', 'ō', 'Ŏ', 'ŏ', 'Ő', 'ő', 'Œ',  'œ',  'Ŕ', 'ŕ', 'Ŗ', 'ŗ', 'Ř', 'ř', 'Ś', 'ś', 'Ŝ', 'ŝ', 'Ş', 'ş', 'Š', 'š', 'Ţ', 'ţ', 'Ť', 'ť', 'Ŧ', 'ŧ', 'Ũ', 'ũ', 'Ū', 'ū', 'Ŭ', 'ŭ', 'Ů', 'ů', 'Ű', 'ű', 'Ų', 'ų', 'Ŵ', 'ŵ', 'Ŷ', 'ŷ', 'Ÿ', 'Ź', 'ź', 'Ż', 'ż', 'Ž', 'ž', 'ſ', 'ƒ', 'Ơ', 'ơ', 'Ư', 'ư', 'Ǎ', 'ǎ', 'Ǐ', 'ǐ', 'Ǒ', 'ǒ', 'Ǔ', 'ǔ', 'Ǖ', 'ǖ', 'Ǘ', 'ǘ', 'Ǚ', 'ǚ', 'Ǜ', 'ǜ', 'Ǻ', 'ǻ', 'Ǽ',  'ǽ',  'Ǿ', 'ǿ', 'Ά', 'ά', 'Έ', 'έ', 'Ό', 'ό', 'Ώ', 'ώ', 'Ί', 'ί', 'ϊ', 'ΐ', 'Ύ', 'ύ', 'ϋ', 'ΰ', 'Ή', 'ή');
	  $b = array('A', 'A', 'A', 'A', 'A', 'A', 'AE', 'C', 'E', 'E', 'E', 'E', 'I', 'I', 'I', 'I', 'D', 'N', 'O', 'O', 'O', 'O', 'O', 'O', 'U', 'U', 'U', 'U', 'Y', 's', 'a', 'a', 'a', 'a', 'a', 'a', 'ae', 'c', 'e', 'e', 'e', 'e', 'i', 'i', 'i', 'i', 'n', 'o', 'o', 'o', 'o', 'o', 'o', 'u', 'u', 'u', 'u', 'y', 'y', 'A', 'a', 'A', 'a', 'A', 'a', 'C', 'c', 'C', 'c', 'C', 'c', 'C', 'c', 'D', 'd', 'D', 'd', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'E', 'e', 'G', 'g', 'G', 'g', 'G', 'g', 'G', 'g', 'H', 'h', 'H', 'h', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'I', 'i', 'IJ', 'ij', 'J', 'j', 'K', 'k', 'L', 'l', 'L', 'l', 'L', 'l', 'L', 'l', 'l', 'l', 'N', 'n', 'N', 'n', 'N', 'n', 'n', 'O', 'o', 'O', 'o', 'O', 'o', 'OE', 'oe', 'R', 'r', 'R', 'r', 'R', 'r', 'S', 's', 'S', 's', 'S', 's', 'S', 's', 'T', 't', 'T', 't', 'T', 't', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'W', 'w', 'Y', 'y', 'Y', 'Z', 'z', 'Z', 'z', 'Z', 'z', 's', 'f', 'O', 'o', 'U', 'u', 'A', 'a', 'I', 'i', 'O', 'o', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'U', 'u', 'A', 'a', 'AE', 'ae', 'O', 'o', 'Α', 'a', 'Ε', 'e', 'Ο', 'ο', 'o', 'o', 'I', 'i', 'i', 'i', 'Υ', 'u', 'u', 'u', 'Η', 'n');
	  return str_replace($a, $b, $str);
	}
	private function sanitize($s) { // make a string lowercase and a-z characters (letters we use for the match cases), make it at least 3 chars long also
			
			$i = $this->removeDiacritics($s); // regexp for letters we want to base our comparison on.
			$i = strtolower($i); 
			$i = preg_replace('/[^A-Za-z]/', '', $i); // removes any remaing ' quote, spaces or - 
			// $i = trim(preg_replace('^[ \x{00C0}-\x{01FF}a-z\'\-]+$/iu'), 'x', $i)); // regexp for any european name excluding special chars like @#$%^© etc.
			// $i = trim(preg_replace(utf8_encode('/[^éèëחיטכךפצמןש\'a-zA-Z]/'), '?', $i));
			while(strlen($i)<3) $i .= '_'; // make it at least 3 characters long
		return $i;
	}

	public static function msg($msg) {
		global $web; if($web) echo $msg.chr(10);
	}

}


?>