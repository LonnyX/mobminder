<?php


//////////////////////////////////////////////////////////////////////////////////////////////
//                        C O P Y R I G H T    N O T I C E
//
// This SEARCH ENGINE is under trade mark: PVHxAGENDA
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


class C_set {  // builds and manage collection of any class of object
	public $set;		// array of references to objects (whatever the class)
	public $count;		// int: number of references placed in $set

	public function __construct() {
		$this->count = 0;
		$this->set = array();
	}
	public function __clone() {
		foreach($this->set as $index => $item)
			$this->set[$index] = clone $item;
	}
	public function count() { return $this->count; }
	public function plus($item) {
		$this->set[$this->count++] = &$item;
		return $item;
	}
	public function absorb($o_set) {		// adds all references from $mix into this->$set
		
		if($o_set->count)
		foreach($o_set->set as &$item)
			$this->set[$this->count++] = &$item;
		unset($item);
		return $this;
	}
	public function testDisplay() { 
	// this function works only if $set contains printable types. Will not work with references to objects
		echo "</br> C_set counts ".$this->count." items: ";
		foreach($this->set as $key => $item) {
			echo "</br> &nbsp;&nbsp;&nbsp;item ".$key." -> testDisplay(): ";
			echo $item->testDisplay();
			}
		}
	public function drop($index) {
		unset($this->set[$index]);
		$this->count--;
	}
}
class C_combination {	// this is a single combination of a bCal with a mix of uCals		
					
	public $bCal;	// reference to an object of any class, this one is mandatory in the combination (it must be specified)
	public $uCals;	// is a reference to an array of objects of any class (this array may be empty)
	public $fCal;	// reference to an object of any class (this unique object is optional, it may be not set)
					
	function __construct(&$bCal,&$uCals, &$fCal = false)	{			
		$this->bCal = &$bCal;			
		$this->uCals = &$uCals;			
		$this->fCal = &$fCal;				
	}	

	public function testDisplay() {
		echo "</br> C_combination: bCal=".$this->bCal." ";
			foreach ($this->uCals as $uCal)
				echo(" | uCal:".$uCal);
	}	
	
}
class C_combinatory extends C_set {	// builds combinations of references to objects			
	
	// contains a LIST of all possible combinations of $K items chosen from $N items
	// the number of possible combinations is stored in $C
		
	public $Bdispatch;	// array of mandatory resource, one of each must be present in a combination with a staff mix
	
	public $mixes = array();	// an array of C_set instances, first mix is $mixes[0]
	public $K;		// K choices
	public $Nresources;		// array of N items (whatever the class)
	public $N;		// resources count
	public $R;		// int: count combinations found in under last recursive cycle	
	public $C;		// int: count total of combinations found		
		
	private function combine($N,$K,&$R)  {	// recursive function, note that ONLY $R is passed by reference
							
		if ($K==1) {					
			// first we treat the case that stops the recursivity : $K=1				
							
			for ($i=1;$i<=$N; $i++)	{
				$this->mixes[$this->C] = array();
				$this->mixes[$this->C++][$K-1] = &$this->Nresources[$this->N-$N+$i-1];
			}		
			$R = $N;				
		} else {						
			// here we treat the calls that require more recursivity : $K>1		
					
			$Rrecur = 0;		
			$RrecurOld = 0;		
			for ($i=1;$i<=$N-$K+1;$i++)	{		
				$RrecurOld += $Rrecur;	
				$this->combine($N-$i,$K-1,$Rrecur);
				// note: $Rrecur is taken by reference and will be updated from the nested recursivity cycle
				// note: $K is passed by value and decreases by 1 every time a nested recursive cycle is called
				for ($j=$this->C-$Rrecur+1; $j<=$this->C; $j++)	
					$this->mixes[$j-1][$K-1] = &$this->Nresources[$this->N-$N+$i-1];	
			}		
			$R = $RrecurOld + $Rrecur;		
		}		
	}		

	private function match(&$optionalResource = false) {
		foreach($this->Bdispatch as &$mandatory){
				foreach($this->mixes as &$mix) 	
					$this->plus(new C_combination($mandatory, $mix, $optionalResource));
				unset($mix);
				}
		unset($mandatory);
	}
							
	function __construct(&$Bdispatch, &$Nresources, $K, &$Foptionals) {	// $Nresources must be an array			
		// $Nresources				
		// $K must be the size of the combination, and hence be less or equal to count($Nresources)			
						
		$this->Bdispatch 	= &$Bdispatch;  // keeps reference to the staf (must exist as an Object instance outside this)
		$this->Nresources 	= &$Nresources; // keeps reference to the staf (must exist as an Object instance outside this)
		$this->N = count($Nresources);		// assignable staffing members
		$this->K = $K;						// staffing size	
						
		$this->C = 0;	// first combination gets id = 0			
		$this->R = 0;			
		$F = count($Foptionals); // count the number of optional resources
		
		// there are two cases: With or without staffable resources
		
		if($this->N) { // there is at least one uCal
			$this->combine($this->N,$this->K, $this->R); // entry point for recursive call, produces $this->mixes
			if($F) // propose a combination of a mandatory resource and a mix of staffable, for each optional resource
				foreach($Foptionals as &$optionalItem)
					$this->match($optionalItem);
			else
				$this->match(); // pass false as there is no optional resource to associate
			
		} else { // there is no uCal, in this case, no combinatory is needed
			$nomix = false;
			if($F) { // propose a combination of a mandatory resource  for each optional resource
				foreach($Foptionals as &$optionalItem) {
					foreach($Bdispatch as &$mandatory)
						$this->plus(new C_combination($mandatory, $nomix, $optionalItem));
					unset($mandatory);
				}
				unset($optionalItem);
			} else { // there is no optional resource to match
				foreach($Bdispatch as &$mandatory)
					$this->plus(new C_combination($mandatory, $nomix));
				unset($mandatory);
			}
		}	
	}
	
	public function testDisplay() {
		echo "<br/> C_combinatory: holds ".$this->count()." combinations";
		if(!$this->count()) return;
		
		$draftPadding = "&nbsp;&nbsp;&nbsp;";
		echo "<table>";
		
		echo "<tr><td>&nbsp;</td><td>$draftPadding bCal $draftPadding</td>";
		for($i=0; $i < $this->K; $i++) 
			echo "<td>$draftPadding uCal $draftPadding</td>";
		echo "</tr>";
		foreach($this->set as $key => $combination) {
			echo "<tr>";
			echo("<td>".(int)$key.$draftPadding."</td>");
			echo("<td>".$combination->bCal."</td>");
			if($combination->uCals)
				foreach ($combination->uCals as $uCal)
					echo("<td>".$uCal."</td>");
				echo "</tr>";
			}
		
		echo "</table>";
	}	
	
}
class C_inout { // a couple of o_date's
	public $in; // o_dataLink_date
	public $out;// o_dataLink_date
	public $parts;
	public function __construct($cueInStmp = -1, $cueOutStmp = -1) { // must be time of the day expressed in seconds
		
		if(is_object($cueInStmp))
			$this->in = clone $cueInStmp;
		else {
			$this->in = new C_date(); 
			if($cueInStmp!=-1) $this->in->setStmp($cueInStmp);
		}
		
		if(is_object($cueOutStmp))
			$this->out = clone $cueOutStmp;
		else {
			$this->out = new C_date(); 
			if($cueOutStmp!=-1) $this->out->setStmp($cueOutStmp);
		}
		
		$this->parts = new C_set();
	}
	public function __clone() {
		$this->in = clone $this->in;
		$this->out = clone $this->out;
	}
	public function testDisplay() {
		$inDate = new C_date($this->in);		
		$outDate = new C_date($this->out);	
		$timeDisplay = chr(9).'in:'.$inDate->getDateTimeString().', out:'.$outDate->getDateTimeString();
		$partsDisplay = chr(9).'no parts'; 
		if($this->hasparts()) $partsDisplay = chr(9).'parts:'.$this->parts->count;
		return $timeDisplay.$partsDisplay.chr(10);
	}
	public function shadowDisplay() {
		$inDate = new C_date($this->in);		
		$outDate = new C_date($this->out);	
		$timeDisplay = chr(9).'in:'.$inDate->getTimeHHmm().', out:'.$outDate->getTimeHHmm();
		return $timeDisplay;
	}
	public function getSecSpan() {
		if($this->hasparts()) { // then we have a time span made of more than one part, each part is an o_inout
			$allover = 0;
			foreach($this->parts->set as $part) $allover+= $part->getSecSpan();
			return $allover;
		}
		return $this->out->t - $this->in->t;
	}
	public function includes($cue) {
		return  $cue >= $this->in->t && $cue < $this->out->t;
	}
	public function chopIn($cue) {
		if($this->includes($cue)) return $this->in->setStmp($cue);
		return false;
	}
	public function chopOut($cue) {
		if($this->includes($cue)) return $this->out->setStmp($cue);
		return $this->out->setStmp($cue);
	}
	public function isZeroSpan() {
		return $this->getSecSpan()==0;
	}
	public function isOverlap($o_cueInOutCheck) {
		$in = $this->in;
		$out = $this->out;
		
		$inChk = $o_cueInOutCheck->in;
		$outChk = $o_cueInOutCheck->out;
		
		if( $in < $inChk && $out > $inChk ) return true;
		if( $out > $outChk && $in < $outChk ) return true;
		if( $in >=$inChk && $out <= $outChk ) return true;
		
		return false; 
	}
	public function tilt($slices) {
		$this->in->sliceIncrement($slices);
		$this->out->sliceIncrement($slices);
		return $this;
	}
	public function slices() { // returns the span in number of slices, when subparts are presetn, it returns ONLY the number of slices in the subparts
		return $this->getSecSpan()/C_date::getSecondsPerSlice();
	}
	public function spanslices() { // total span in number of slices, regardless of parts
		return ($this->out->t - $this->in->t)/C_date::getSecondsPerSlice();
	}
	public function subslotscount($durationInSlices) { // returns the number of tilted duration spans that fit in the cueInOut
		$slices = $this->slices(); // width of the time slot in units of slice
		if(($slices - $durationInSlices)>=0) return ($slices - $durationInSlices)+1;
		else return 0;
	}
	public function adjustSpan($slices) {
		$prototype = clone $this;
		$prototype->out->sliceIncrement($slices);
		if($prototype->getSecSpan() <= 0) return false; // this made the cueIn be equal or stand before the cueOut
		$this->out->sliceIncrement($slices);
		return true;
	}
	public function moveToCueIn($cueInStmp) { // keeping the same duration
		$initialIn = $this->in->t;
		$initialOut = $this->out->t;
		$vector = $cueInStmp - $initialIn; // vector = destination minus origin
		$this->in->setStmp($initialIn+$vector); 
		$this->out->setStmp($initialOut+$vector); 
	}	
	public function update($mdate, $dGMT = 0) { // applies for cueInOut having no date but time ( < 86400 )
		
		// $dGMT is the delta between the surfer GMT and the server GMT
		// $mdate is a mandatory midnight date!!
		
		$initialIn = $this->in->t;
		$initialOut = $this->out->t;
		
		$midnight = $mdate->t;
			$next = clone($mdate); $next = $next->dIncrement(1)->t;
			$daylength = $next-$midnight;
		$timeshift = $daylength-86400;
		$inTshift = 0; $outTshift = 0;
		if($this->in->t > 7200) $inTshift = $timeshift; 
		if($this->out->t > 7200) $outTshift = $timeshift;
		
		$this->in->t = $initialIn+$midnight+$inTshift; 
		$this->out->t = $initialOut+$midnight+$outTshift; 
		return $this;
	}
	public function hasparts() { return $this->parts->count > 1; } // return true when at least two parts exists
	public function chunks($duration, $aggregate, $verbose = 0) { // decomposes a cueInOut into many chunks of length = duration, each chunk is an o_inout
		// duration in seconds
		$sliceSec = C_date::getSecondsPerSlice();  // number of seconds in a time slice
		$durationSlices = $duration / $sliceSec;
		$spanslices = $this->spanslices(); // full span in unit of slices
		$easeSlices = $spanslices - $durationSlices;
		$in = $this->in->t;
		$chunks = new C_set();
		$v = 0; //  = $verbose  // when all of verbose must be active. This sets up detailed verbosing on the following process
		$early = $aggregate & 0x1;
		$lately = $aggregate & 0x2;
		
		for($pos=0; $pos <= $easeSlices; $pos++, $in+=$sliceSec) {
			if($this->parts->count<2) { // this cueInOut is in one chunk, that's the easy situation
				$cueIn = $in; $cueOut = $in+$duration;
				
				if($v) {
					$date = new C_date($cueIn);
					echo 'Single part chunking( on '.$date->get_ISO8601_stamp().') ';
					echo '$aggregate = '.$early.'+'.$lately.', $durationSlices = '.$durationSlices.', $spanslices = '.$spanslices.', $easeSlices = '.$easeSlices.''.chr(10);
				}
				
				if($aggregate) { // selects only chunks that are subsequent or ahead existing reservations
					
				
					if($this->in->sticky==false && $this->out->sticky==false) { // an empty hourly period, select input and exit chunks
					
						if($pos==0 && $early) { $chunks->plus(new C_inout($cueIn, $cueOut)); if($v) echo chr(9).chr(9).'$pos = 0 => early hit ($pos==0 && $early)'.chr(10); }
						else if($pos==$easeSlices && $lately) { $chunks->plus(new C_inout($cueIn, $cueOut)); if($v) echo chr(9).chr(9).'$pos = '.$pos.' => lately hit, ($this->in->sticky==false && $lately)'.chr(10); }
						
						// if($v) echo chr(10); 
					} 
					else { // some reservation(s) form(s) the boundaries of the slot
						if($pos==0) { 
							if($this->in->sticky) {
								$chunks->plus(new C_inout($cueIn, $cueOut)); 
								if($v) echo chr(9).chr(9).'$pos = 0  => ($this->in->sticky)'.chr(10);
							}
							else if($easeSlices==0 && $this->out->sticky) {
								$chunks->plus(new C_inout($cueIn, $cueOut));
								if($v) echo chr(9).chr(9).'$pos = 0  => ($easeSlices==0 && $this->out->sticky)'.chr(10);
							} else if($early) {
								$chunks->plus(new C_inout($cueIn, $cueOut));
								if($v) echo chr(9).chr(9).'$pos = 0  => ($easeSlices==0 && $early)'.chr(10);
							}
						}
						else if($pos==$easeSlices) { 
							if($this->out->sticky) {
								$chunks->plus(new C_inout($cueIn, $cueOut)); 
								if($v) echo chr(9).chr(9).'$pos = $easeSlices   => ($this->out->sticky)'.chr(10);
							} else if($easeSlices && $pos==$easeSlices && $lately) {
								$chunks->plus(new C_inout($cueIn, $cueOut));
								if($v) echo chr(9).chr(9).'$pos = $easeSlices   => ($easeSlices==$pos && $lately)'.chr(10);
							}
						}
					}
				}
				else $chunks->plus(new C_inout($cueIn, $cueOut)); // include all intermediate possibilities
				
				// this object is made of ONE part, the result will be chunks like follow
				// Example of o_inout having NO part
				//
				//            unique part slot
				//        |<------------------------------------------>|
				//        |                                            |
				//        in                                           out
				//        |                                            |
				//        |                                            |
				//        |                                            |
				//--------|----|----|----|----|----|----|----|----|----|---------------> time
				//        0    1    2    3    4    5    6    7    8    9
				//              
				//        |<<--------------->>|  chunk 0 (pos = 0)
				//             
				//             |<<--------------->>|  chunk 1 (pos = 1)
				//             
				//                  |<<--------------->>|  chunk 2 (pos = 2)
				//             
				//                       |<<--------------->>|  chunk 3 (pos = 3)
				//             
				//                            |<<--------------->>|  chunk 4 (pos = 4)
				//             
				//                                 |<<--------------->>|  chunk 5 (pos = 5)
				//             
				
			}
			else { // chunking a span made of parts
				// this object is made of parts, the result will be chunks with some of which having parts also
				// Example of o_inout having parts
				//
				//           part 1 ($x=0)                       part 2  ($x=1)
				//        |<--------->|                        |<----->|
				//        |           |                        |       |
				//        in          out                      in      out
				//        |           |                        |       |
				//                    |                        |       |
				//                    |------------------------|       |
				//                                                     |
				//--------|---|---|---|------------------------|---|---|---------------> time
				//        0   1   2                            3   4   5
				//            |  
				//            |  subpart[0]
				//            |<<--->>|
				//            $in  
				
				// 1.
				$xIn = false; // identify starting part
				foreach($this->parts->set as $x => $part) 
					if($part->includes($in)) { $xIn = $x; break; } // each chunk we are looking for starts inside a part
				if($xIn === false) continue;
				
				// 2.
				$subparts = new C_set();
				$remains = $duration;
				foreach($this->parts->set as $x => $part) {
					if($x < $xIn) continue; // skip to the start part
					
					// 2.a
					$subpart = clone $part;
					if($x == $xIn) $subpart->chopIn($in); // keep the right part of the start part
					$subparts->plus($subpart);
					
					// 2.b
					$remains -= $subpart->getSecSpan();
					if($remains<=0) { // then in the current part, there is enough room to contain the required duration 
						$subpart->chopOut($subpart->out->t+$remains); 
						unset($subpart);
						break; // we can go to the next $in
					}
					
					// else you go on and take a chop of the next part
					unset($subpart);
				}
				if($remains>0) break; // there will never be enough room in the following positions of $in
				
				// 3.
				$cueIn = $subparts->set[0]->in->t;
				$cueOut = $subparts->set[$subparts->count-1]->out->t;
				$chunk = $chunks->plus(new C_inout($cueIn, $cueOut));
				
				if($verbose) echo chr(9).'chunk '.$chunks->count.$chunk->testDisplay();
				
				// 4.
				if($subparts->count>1) { 
					$chunk->parts = $subparts; // we create the ->parts member only when at least two parts exist
					
					if($verbose) {
						// echo $subparts->count.' subparts'.$nl;
						foreach($subparts->set as $x => $subpart)
							echo chr(9).chr(9).'. subpart '.$x.$subpart->testDisplay();
					}
				}
				unset($subparts, $chunk);
				if($verbose) echo $nl;
				// Example: span = 7 slices, duration = 4 slices, spanslices = 17, subslotscount(4) = 4, easeSlices = 17-4 = 13
				//
				//           0                                                                   17
				//           |                                                                   |
				//          in  p.1                          p.2                            p.3  out
				//           |<----->|                   |<--------->|                   |<----->|
				//           |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |   |
				//-----------|---|---|-------------------|---|---|---|-------------------|---|---|------------------> time
				//           0   1                       2   3   4                       5   6     
				//           |            chunk 1 (4 slices)     |                           |  
				//           |<--------------------------------->|                           |  
				//           in (pos=0)                          out                         |
				//               |             chunk 2               |                       |      
				//               |<--------------------------------->|                       |      
				//               in (pos=1)                          out                     |
				//                                       |                                   |
				//                                       |             chunk 3               |                          
				//                                       |<--------------------------------->|                          
				//                                       in (pos=5)                          out
				//                                           |                                   |
				//                                           |             chunk 4               |                          
				//                                           |<--------------------------------->|                          
				//                                           in (pos=6)                          out
				//
			}
		}
		return $chunks;
	}
}


class C_hourly {
	public $id; // is a C_dS_hourly id
	public $excpShadows; 	// $this->excpShadows[$dayCode] = o_set( o_inout )
	public $normShadows; 	// $this->normShadows[$dayCode] = o_set( o_inout )
	public $isOffSchedule;  // $this->isOffSchedule[$dayCode] = true/false tells you if this daycode is an off day in this schedule
	public $monday; 		// monday stamp
	public $periodicity; 	// periodicity
	static private	$vshadowid = 1;
	
	public function __construct($id, $monday, $periodicity) {
		$this->id = $id;
		$this->monday = $monday; 		
		$this->periodicity = $periodicity; 	
		$this->isOffSchedule = array();	
		$this->tboxes = array();
	}
	public function addShadow($id, $dayCode, $assess, $cueIn, $cueOut) {
		
		$cueInOut = new C_inout($cueIn, $cueOut);
		$cueInOut->type = class_shadow;
		
		if(!isset($this->isOffSchedule[$dayCode])) {
			$this->isOffSchedule[$dayCode] = false;
			$this->normShadows[$dayCode] = new C_set();
			$this->excpShadows[$dayCode] = new C_set();
		}
		switch($assess) {
			case shadow_offday: $this->isOffSchedule[$dayCode] = true; // FALL THROUGH
			case shadow_normal: $this->normShadows[$dayCode]->plus($cueInOut,$id); break;
			case shadow_except: $this->excpShadows[$dayCode]->plus($cueInOut,$id); break;
		}
		
		if(0) echo chr(9).'addShadow to hourly '.$this->id.' daycode '.$dayCode.' / '.$cueInOut->shadowDisplay().$nl;
	}
	public function addTbox($id, $dayCode, $cueIn, $cueOut) {
		
		$o_cues = new C_inout($cueIn, $cueOut); $o_cues->type = class_shadow;
		if(!isset($this->tboxes[$dayCode])) $this->tboxes[$dayCode] = new C_set();
		$this->tboxes[$dayCode]->plus($o_cues,$id);
	}
	public function convertTimeBoxes() { // converts time boxing into shadows, so from there we can process as if shadows were passed, with the existing algorythm
		global $nl;
		if(0) echo 'setting time boxing shadows for hourly '.$this->id.$nl;
		
		if($this->periodicity) $days = 7*$this->periodicity; // any perdiodic hourly
			else $days = 7; // an hourly made for an exceptional day (shadows exist only on the particular daycode)
		for($dc = 1; $dc <= $days; $dc++) {
			if(isset($this->tboxes[$dc])) { // there are timeboxes in this weekday
			
				sort($this->tboxes[$dc]->set); // sort on first member: cueIn
				$cueLast = 0; // midnight
				foreach($this->tboxes[$dc]->set as $tbid => $o_tbcues) {
						$tbIn = $o_tbcues->in->t;
					// if($cueLast==$tbIn) { // two subsequent timeboxes are joined
						// $cueLast = $o_tbcues->out->t; // => we leave the cueIn = cueOut kind of shadow in the cues, so time boxes can be used to define small subsequent boxes where reservations should fit!
						// continue; 
					// } 
					$this->addShadow(C_hourly::$vshadowid++, $dc, shadow_normal, $cueLast, $tbIn);
					$cueLast = $o_tbcues->out->t;
				}
				$this->addShadow(C_hourly::$vshadowid++, $dc, shadow_normal, $cueLast, 86400);
			} else { 
				// no timebox for this weekday, mask it all
				$this->addShadow(C_hourly::$vshadowid++, $dc, shadow_offday, 0, 86400);
			}
		}
	}
	public function getShadows($dayCode, $excp) {
		// echo '<br/>schedule'.$this->id.' daycode'.$dayCode.' '.($excp?'excp':'norm');
		$o_set_cues = new C_set(); 
		$o_set_cues->absorb(clone $this->normShadows[$dayCode]); // restrict to normal worktime by adding normal shadows
		if(!$excp)
			$o_set_cues->absorb(clone $this->excpShadows[$dayCode]); // at least shadow up to the extended worktime
			
		return $o_set_cues; // we pass a copy that the subsequent search process can fuck up
	}
}
class C_dayin { // hourlies for each resource, organized by day in
	
	private $dayins; // $this->dayins[$resourceId][dayIn] = o_hourly
	private $ampm; // ampm[$dayCode] = o_inout
	private $hasTboxing; // 0 when none
	private $verbose;
	
	////////////// public functions
	//
	//
	public function __construct($dS_account, $ampm, $staff, $tboxing, $verbose = false) { 
		
		$this->setampm($ampm, $verbose); $this->hasTboxing = count($tboxing);
		$nl = chr(10);
		
		$this->dayins = array(); // bi-dimensional array [resourceId][dayIn]
		
		$hourlies = array(); $hourlies[0] = $this->setdefault($dS_account);
		if(!count($staff)) return $this;
		$staffIn = implode(',',$staff); 
		
				// echo '### staffIn:'.$staffIn.$nl;
		
		// for each staff resource, foresee an hourly schedule
		foreach($staff as $resourceId) {
			$this->dayins[$resourceId] = array();
			$this->dayins[$resourceId][0] = $hourlies[0]; // before any first hourly setting, the resource was running on default hourly
		}
		
		// check hourlies usage for the given staff
			$q = new Q('SELECT DISTINCT hourlyId as id FROM hourliesusers WHERE groupId IN ('.$staffIn.');'); // C_dS_hourlyusers group to a resource Id
			$hourlyIds = $q->ids(); if(!$hourlyIds) return $this; // there is nothing else to load, everything runs on default hourlies

				// echo '### hourlyIds:'.$hourlyIds.$nl;

		// load hourlies
			$q = new Q('SELECT id, monday, periodicity FROM hourlies WHERE id IN ('.$hourlyIds.')');
			while($r = $q->result->fetch_array()) $hourlies[$r['id']] = new C_hourly($r['id'], $r['monday'], $r['periodicity']);
		
		if($this->hasTboxing) { // search exclusively inside the given time boxes
			if($verbose) echo '--->> search using time boxing'.$nl;
		
			// load tboxes
			$q = new Q('SELECT id, groupId, cueIn, cueOut, dayCode FROM timeboxes WHERE groupId IN ('.$hourlyIds.') AND timeboxingId IN ('.implode(',',$tboxing).');');
			while($r = $q->result->fetch_array()) 				
				$hourlies[$r['groupId']]->addTbox($r['id'], $r['dayCode'], $r['cueIn'], $r['cueOut']);
				
			// make shadows from time boxes
			foreach($hourlies as $hid => $hourly)
				if($hid==0) continue; // leaves default schedules intact
					else $hourly->convertTimeBoxes();
					
		} else { // search free slots based upon hourlies shadows and outside exclusive timeboxing 
		
			// load regular shadows
			if($verbose) echo '--->> search using regular hourlies shadows'.$nl;
			$q = new Q('SELECT id, groupId, cueIn, cueOut, exceptional, dayCode FROM shadows WHERE groupId IN ('.$hourlyIds.') AND groupId <> 0;');
				
			while($r = $q->result->fetch_array())
				$hourlies[$r['groupId']]->addShadow($r['id'], $r['dayCode'], $r['exceptional'], $r['cueIn'], $r['cueOut']);
			
			// check if any exclusive timeboxing exists
			$q = new Q('SELECT id FROM timeboxings WHERE groupId = '.$dS_account->id.' AND exclusive = 1;'); 
			$xtboxingIds = $q->ids();
			
			if($xtboxingIds) { // in this case, every exclusive time boxing is considered as a shadow
				if($verbose) echo '   ... but there are exclusive time boxings'.$nl;
				$q = new Q('SELECT id, groupId, cueIn, cueOut, dayCode FROM timeboxes WHERE groupId IN ('.$hourlyIds.') AND timeboxingId IN ('.$xtboxingIds.');');
				while($r = $q->result->fetch_array()) {
					$hourlyId = $r['groupId'];
					$hourlies[$hourlyId]->addShadow($r['id'], $r['dayCode'], shadow_normal, $r['cueIn'], $r['cueOut']);
				}
			}
		}
		
		// check hourlies usage for the given staff
		$q = new Q('SELECT hourlyId, dayIn, groupId FROM hourliesusers WHERE groupId IN ('.$staffIn.');');
		while ($r = $q->result->fetch_array()) {
			$hourlyId = $r['hourlyId'];
			$resourceId = $r['groupId'];
			$this->dayins[$resourceId][$r['dayIn']] = $hourlies[$hourlyId]; // hourlyId can be zero when resource returns to default hourly
		}
			
		// Now we need to sort hourlies usage by dayIn ascending in order to prepare the getShadows algorythm (1*)
		if(count($this->dayins))
			foreach($this->dayins as $resourceId => $hourlychanges) 
				ksort($this->dayins[$resourceId],SORT_NUMERIC); // Sorts these arrays by key, maintaining key to data correlations.

		$this->verbose = $verbose;
	}
	public function getAMPMmasks($date) {
		$dayCode = $date->getDayCode(); // daycode ranges [1 to 7]
		$o_set_cues = clone $this->ampm[$dayCode];
		foreach($o_set_cues->set as $cueInOut)
			$cueInOut->update($date); // actualize the cue by setting it to the given midnight stamp
		return $o_set_cues;
	}
	public function getShadowsCues($date, $resourceId, $excp) {
	
		$midnight = $date->getMDNstmp();
		$hourlies = $this->dayins[$resourceId]; // is an array of hourlies proper to resourceId and indexed by dayIn ascending (*1)
		$previousHourly = $this->dayins[$resourceId][0];
		$breakfor = false;
		foreach($hourlies as $dayIn => $hourly) { // there is an identical kind of scanning here in js world (*sh03*) for displaying the hourlies
			if($hourly->periodicity==0) if($midnight==$dayIn) $breakfor = true; else continue; // we skip here exceptional hourlies unless they are right on date == dayIn
			if($midnight<$dayIn) break; // check if this hourly is the forecast, if so, the previous one was the current
			$previousHourly = $hourly;
			if($breakfor) break; // case of an exceptional hourly right on dayIn, we catch this hourly and we stop here
		}
		$hourly = $previousHourly;

		// now select shadows according to the dayCode of $date
		$dayCode = $date->getDayCode($hourly->monday, $hourly->periodicity); // daycode ranges [1 to 7, 1 to 14, 1 to 21, or 1 to 28]
		$o_set_cues = $hourly->getShadows($dayCode, $excp); // we make no difference anymore in the AM or PM exceptionnal
		
		foreach($o_set_cues->set as $cueInOut)
			$cueInOut->update($date); // actualize the cue by setting it to the given midnight stamp
		return $o_set_cues;
	}
	public function __destruct() { }
	
	
	////////////// private functions
	//
	//
	private function setampm($ampm, $verbose = false) {
	
		global $nl; 
		
		// schedule relating to $ampm preferences
		// 
		$shadowAM = new C_inout(0, 43200);
		$shadowAM->type = class_shadow;
		$maskAM = new C_set(); $maskAM->plus($shadowAM);
		
		$shadowPM = new C_inout(43200, 90000);
		$shadowPM->type = class_shadow;
		$maskPM = new C_set(); $maskPM->plus($shadowPM);
		
		$shadowAMPM = new C_inout(0, 90000);
		$shadowAMPM->type = class_shadow;
		$maskAMPM = new C_set(); $maskAMPM->plus($shadowAMPM);
		
		$this->ampm = array();
		for ($dayCode=1, $amBit = 0x010000, $pmBit = 0x000100; $dayCode<8; $dayCode++, $amBit <<=1, $pmBit <<=1) {
			$AM = !!($amBit & $ampm); // is 1 if the day part is selected, 0 either
			$PM = !!($pmBit & $ampm);
			if($verbose) echo 'daycode:'.$dayCode.' AM '.($AM?'X':' ').' PM '.($PM?'X':' ').$nl;
			if(!$AM && !$PM) $this->ampm[$dayCode] = $maskAMPM;
				else if(!$AM) $this->ampm[$dayCode] = $maskAM;
					else if(!$PM) $this->ampm[$dayCode] = $maskPM;
						else $this->ampm[$dayCode] = new C_set();
		}
		// monitoring:
		if($verbose) echo '-------------------'.$nl;
	}
	private function setdefault($dS_account) {
		$monday = new C_date(); $monday->toMonday();
		$hourly = new C_hourly(0, $monday, 1);
		global $nl; 
		
		if($this->verbose) echo 'setting default hourly 0'.$nl;
		for($dc = 1; $dc <= 7; $dc++ ) {
			$hourly->addShadow($dc*10, $dc, 0 /*not exceptional*/, 0, $dS_account->rangeIn /* shadow MORNING */ );
			$hourly->addShadow($dc*20, $dc, 0 /*not exceptional*/, $dS_account->rangeOut, 86400 /* shadow EVENING */ );
		}
		return $hourly;
	}
	
}



function displaycues($o_cueInOut) { // for monitoring purpose
	$inDate = new C_date($o_cueInOut->in);		
	$outDate = new C_date($o_cueInOut->out);			
	echo chr(9).' -> in = '.$inDate->getDateTimeString();
	echo chr(9).' -> out = '.$outDate->getDateTimeString();
	echo chr(9).' type='.($o_cueInOut->type == class_resa_any?'resa':$o_cueInOut->type).chr(10);
}
function displayslot($o_cueInOut, $durationSlices=false, $comment='') {
	$inDate = new C_date($o_cueInOut->in);		
	$outDate = new C_date($o_cueInOut->out);	
	$countDisplay = 'slot - ';
	$bCalDisplay = chr(9).'bCal:'.$o_cueInOut->attendees[class_bCal][0];
	$timeDisplay = chr(9).'in:'.$inDate->getDateTimeString();
	$timeDisplay .= chr(9).'out:'.$outDate->getDateTimeString();
	$partsDisplay = chr(9).'no parts'; if(isset($o_cueInOut->parts)) $partsDisplay = chr(9).'parts:'.$o_cueInOut->parts->count;
	$subslotscount = chr(9).'subslots:'.$o_cueInOut->subslotscount($durationSlices);
	echo $countDisplay.$bCalDisplay.$timeDisplay.$partsDisplay.$subslotscount.$comment.chr(10);
}
	

class C_availabilities_lookup {
	
	// Usage example
	//
	// $lookup = new C_availabilities_lookup($context->dS_account, $bCals, $uCals, $staffsize, $fCals, $ampm, $tboxing, $verbose=true);
	// $lookup->search($duration, $notbefore, $aggregate, $sameday, $limit, $limitdate, $overdays, $except);
	// $lookup->stream($bank='slots',$tagin='<code>',$tagout='</code>');
	
	
	// context
	private $account;
	private $resources;
	private $staff;
	private $hourlies;
	
	// set by search() request
	private $notbefore;
	
	// combinatory
	private $combs;	 // all possible combinations of resources as specified for the search
	private $slots;  // slots are calendar periods of availability (most often longer than the required duration)
	private $chunks; // chunks are availabilities of the specified lookup duration (they are the result of finding the required durations in slots)
	
		// Example when required duration = 3 slices
		//
		//                             free slot
		//                     |<--------------------------------->|
		//                     |                                   |     shadow (hourlies)
		//  [///appointment///]|                   chunks          |///////////////////
		//  [///appointment///]|               |<--------->|       |///////////////////
		//                     |           |<--------->|           |
		//     time slice      |       |<--------->|               |
		//         |<->|       |   |<--------->|                   |
		//         |   |       |<--------->|                       |
		//         |   |       |                                   |
		//---------|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|----------> time
		//         0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19
		//     
	
	// operational vars
	private $resastop;	// breaks the chunking process
	
	// output data
	public $resaparts;
	public $reservations;
	public $attendees;
	// private $att_visitors;
	// private $performances;
	
	// misc
	private $perfReport;
	
	
	public function __construct($dS_account, $bCals, $uCals = Array(), $staffsize =1, $fCals = Array(), $ampm = null, $tboxing = null, $verbose=false) {
		
		$this->account 	= $dS_account;
		
		$this->resaparts 	= new C_dbAccess_resaparts();
		$this->reservations = new C_dbAccess_reservations();
		$this->attendees 	= new C_dbAccess_attendees();
		
		$this->resources= Array(class_bCal=>$bCals, class_uCal=>$uCals, class_fCal=>$fCals); // is always at least  a one element array
		$this->staff 	= Array(); foreach($this->resources as $type => $ids) if(count($ids)) foreach($ids as $id) $this->staff[] = $id; 
		$this->combs 	= new C_combinatory($bCals, $uCals, $staffsize, $fCals);
		
			if($ampm == null) $ampm = 0x00FFFF00;
			if($tboxing == null) $tboxing = Array();
			
		$this->hourlies = new C_dayin($dS_account, $ampm, $this->staff, $tboxing, $verbose);
		
		$this->verbose = $verbose;
		
		$this->perfReport = new C_perfReport();
		
	}
	
	public function search($duration, $notbefore = 0, $aggregate = 0, $sameday = 0, $limit = 0, $limitdate = 0, $overdays = 0, $except = 0) {
		
		if(!count($this->staff)) return $this;
		
		$this->slots 	= new C_set();
		$this->chunks 	= new C_set();
		$this->notbefore = $notbefore ? new C_date($notbefore) : new C_date(); // defaults to now
		
		if($limit) $this->resastop = $limit; // number of reservations returned
			else {
				$this->resastop = 50+($this->combs->count()*10); // number of options returned when automatic mode (limit = 0)
				if($this->resastop>300) $this->resastop = 300; // h4d ever launched a search on a workcode with 30 bCals and 27 uCals :D
			}
			
			
		// execution flow for private functions
		//
		// 	->extractslots()
		//			->querycues()
		//			->setmasks()
		//			->scancombination()
		//
		// 	->makechunks()
		//
		// 	->datasets()
		//
		
		$this->extractslots($duration, $this->resastop, $aggregate, $overdays, $except, $this->verbose);
		
		$sameday = ($sameday+0)*3600; // $sameday enters as a number of hours, it is a padding that prevents proposing availabilities that would begin in a few minutes
		
		if($this->slots->count()) {
			$this->makechunks($duration, $aggregate, $limitdate, $sameday, $this->verbose);
			$this->datasets();
		}
		
		return $this;
	}
	
	public function stream($bank='',$tagin='',$tagout='') {  // echoes to client
		
		global $nl;
		
		// if(!count($this->staff)) echo $tagin.$tagout.$nl;
		
		echo $nl.$tagin;
		echo $this->attendees->stream(false, $bank, with_tracking, $sep = '|', $flds = false);
		echo $this->resaparts->stream(false, $bank, with_tracking, $sep = '|', $flds = false);
		echo $this->reservations->stream(false, $bank, with_tracking, $sep = '|', $flds = false);
		echo $tagout.$nl;
	}
	public function ANTS($bank='') {  // ANTS project for city halls in France (PVH 2023).
		
		global $nl;
		
		$url = ''; switch($this->account->id) {
			case 3644: $url = 'https://booking.mobminder.com/antschalon'; break;
			case 4584: $url = 'https://booking.mobminder.com/antschatenoy'; break;
		}
		
		// keep only distinct dates and time
		$resadistinct = new C_dbAccess_reservations();
			$cues = Array(); $c = 0;
		foreach($this->reservations->keyed as $rid => $ds_resa) {
			$time = Date('Y-m-d H:i', $ds_resa->cueIn);
			if(isset($cues[$time])) continue;
			$cues[$time] = $c++;
			$resadistinct->add($ds_resa, $rid);
		}
		
		// prepare members format to ANTS required units 
		foreach($resadistinct->keyed as $rid => $ds_resa) {
				$time = Date('Y-m-d H:i', $ds_resa->cueIn);
				$ds_resa->setstringtimeformat($utc = false, $options = 'TZ');
			$ds_resa->callback_url = $url.'?dt='.$time; // callback_url: this one is an ANTS requirement, format "https:\\booking.mobminder.com\antschalon?dt=2023-07-31 14:40"
			$ds_resa->datetime = $ds_resa->cueIn; // datetime: this one is an ANTS requirement, format "2023-07-31T11:20Z"
		}
		$fieldsANTS = Array('id','groupId','datetime','callback_url'); 
		
		// echo $nl;
		return $resadistinct->jason(with_tracking, $fieldsANTS);
		// echo $nl;
	}
	public function jason($bank='',$tagin='',$tagout='') {  // echoes to client
		
		global $nl;
		
		echo $nl.$tagin;
		echo $this->reservations->jason(with_tracking, $flds = false);
		echo $tagout.$nl;
	}
	public function dropperfreport() {
		
		return $this->perfReport->dropReport();
	}
	public function addmeta_datetimeVerbose(){ // used from booking/ for displaying account site timezone information 
		//solution for displaying account location timezone see (*dtacc01*)
	    $this->reservations->addmeta_datetimeVerbose();
    }	
	
	private function querycues($swindowIn, $swindowOut) {  // returns existing time reservations as $view[$rscid] = $o_set[$o_inout]
		
		global $nl; 
		if($this->verbose) echo chr(9).'extractslots()->querycues() load appointments from '.$swindowIn->getDateString().' to '.$swindowOut->getDateString().$nl;	
		
			$resources = $this->resources;		
		$view = Array();
		foreach($resources as $type => $ids)
			if(count($ids)) foreach($ids as $id) { $view[$id] = new C_set(); }
		
		$midnIn = $swindowIn->t;	
		$midnOut = $swindowOut->t;

		
		$SQL = 'SELECT cueIn, cueOut, resourceId, deletorId FROM attendees 
				JOIN reservations ON attendees.groupId = reservations.id
				WHERE          
					reservations.groupId = '.$this->account->id.' and
					cueOut >= '.$midnIn.' and cueIn <= '.$midnOut.' and
					attendees.resourceId IN ('.implode(',',$this->staff).');';
		
		$q = new Q($SQL);
		while ($row = $q->result->fetch_array()) {
			if($row['deletorId']!=0) continue; // bypass any deleted reservation
			$resourceId = $row['resourceId']; $cueIn = $row['cueIn']; $cueOut = $row['cueOut']; 
			$o_cueInOut = $view[$resourceId]->plus(new C_inout($cueIn,$cueOut));
			$o_cueInOut->type = class_resa_any;
		}
		if(count($view))
			foreach($view as $o_set_cues)
				sort($o_set_cues->set);
				
		$windloadedcues = $q->cnt(); 
		if($this->verbose) echo chr(9).chr(9).$q->cnt().' reservations loaded'.$nl;

		if(0) {	// monitoring: reservations cues
			echo 'RESAS cues monitoring:'.$nl;
			if(0) echo 'SQL:'.$SQL.$nl;
				foreach($resources as $type => $ids) {
					if(count($ids)) 
						foreach($ids as $id) {
							echo chr(9).'Resource '.$id;
							if($view[$id]->count)
								{ echo $nl; foreach($view[$id]->set as $o_cueInOut) displaycues($o_cueInOut); }
								else echo ' -> No reservation'.$nl;
						}
				}
			echo '-----------------------------------------'.$nl;	
		}

		$this->perfReport->peak(chr(9).'extractslots()->querycues() - query reservations');
		
		return $view;
	}
	
	private function setmasks($swindowIn, $swindowOut, $except) {  // convert hourlies and ampm preferences into actual dates/time masks
		
		global $nl; 
		if($this->verbose) echo chr(9).'extractslots()->setmasks() calculate shadows and actualize them, exceptional availability included:'.($except?'YES':'no').$nl;
		// STEP 4: for the determined future period, calculate shadows and actualize them
		//
		// 
		$shadows = Array(class_bCal=>Array(), class_uCal=>Array(), class_fCal=>Array()); // is always at least  a one element array
		$ampmMasks = new C_set();
		$resources = $this->resources;
		
		foreach($resources as $type => $ids)
			if(count($ids)) 
				foreach($ids as $id) { // which is the id of a C_dS_resource
					$shadows[$type][$id] = new C_set();
					$scanDate = clone $swindowIn; $scanDate->dIncrement(-1);
					while($scanDate->dIncrement(1)->isBefore($swindowOut)) {
						$shadows[$type][$id]->absorb($this->hourlies->getShadowsCues($scanDate, $id, $except));
						$ampmMasks->absorb($this->hourlies->getAMPMmasks($scanDate));
					}
				}
				
			if(0) {	// monitoring: checking AMPM masks: they exists ONLY when specified, otherwise this list is void
				echo 'AMPM masks monitoring:'.$nl;
				if($ampmMasks->count) 
					foreach($ampmMasks->set as $o_cueInOut) displaycues($o_cueInOut);
					else echo chr(9).'no AMPM specified'.$nl;
				echo '-----------------------------------------'.$nl;
			}
			if(0) {	// monitoring: checking shadows:
				echo 'SHADOWS masks monitoring:'.$nl;
					foreach($resources as $type => $ids)
					if(count($ids)) 
						foreach($ids as $id) 
							foreach($shadows[$type][$id]->set as $o_cueInOut)
								displaycues($o_cueInOut);
				echo '-----------------------------------------'.$nl;
			}
		
		$this->perfReport->peak(chr(9).'extractslots()->setmasks()');
		
		$pack = Array(); $pack['shadows'] = $shadows; $pack['ampms'] = $ampmMasks;
		return $pack;
	}
	
	private function scancombination($o_combination, $view, $shadows, $ampms, $duration, $aggregate, $overdays) { // output slots to $this->slots
		
		global $nl; 
		if($this->verbose) echo chr(9).'extractslots()->scancombination() duration:'.$duration.' aggregate:'.$aggregate.' overdays:'.$overdays.$nl;

			$cues = new C_set();
		
		// reservations
			$cues->absorb($view[$o_combination->bCal]); 
			
		// shadows for other resources
			$cues->absorb($shadows[class_bCal][$o_combination->bCal]); 
			if($o_combination->uCals)
				foreach($o_combination->uCals as $uCalId) {
					$cues->absorb($view[$uCalId]); // reservations
					$cues->absorb($shadows[class_uCal][$uCalId]);
				}
			if($o_combination->fCal) {
				$cues->absorb($view[$o_combination->fCal]); // reservations
				$cues->absorb($shadows[class_fCal][$o_combination->fCal]);
			}
			
		// am/pm settings
			$cues->absorb($ampms);
		
		
		// STEP 5.2: find all slots relative to the given combination
		//
		$bCalArray = array($o_combination->bCal);
		$uCalArray = $o_combination->uCals;
		$fCalArray = $o_combination->fCal ? array($o_combination->fCal) : array();
		$byClass = Array(class_bCal=>$bCalArray, class_uCal=>$uCalArray, class_fCal=>$fCalArray);
				
		sort($cues->set);
		
		// Example of sorted cues sequence as parsed by the slot search algorithm
		//
		// in                out                                  slot 1                         slot 2
		// |-----------------|                                 |<--------->|                   |<----->|
		// |------------------------|                          |           |                   |       |
		//                       |-----------------|           |           |                   |       |
		//                                 |-------------------|           |                   |       |
		//                                 |-------------|                 |                   |       |
		//                                                                 |-------------------|       |
		//                                                                                             |----------------------|
		//-----------------------------------------------------|---|---|---|-------------------|---|---|------------------------------> time
		//                                                     0   1   2                       3   4   
		//     
		
		if(0) {	// monitoring: sorted accumulated cues
			echo 'COMBI sorted cues monitoring for combination: ';
			echo 'bCal-'.$o_combination->bCal; 
			if($o_combination->uCals) { echo ', uCal'; foreach($o_combination->uCals as $uCalId) echo '-'.$uCalId; }
			if($o_combination->fCal)  { echo ', fCal'; foreach($o_combination->uCals as $fCalId) echo '-'.$fCalId; }
			echo $nl;
		
			foreach($cues->set as $o_cueInOut) displaycues($o_cueInOut);
			echo '-----------------------------------------'.$nl;
		}
		
		$oldmax = $cues->set[0]->out->t;
		$oldsticky = ($cues->set[0]->type == class_resa_any);
		$continue = 0; $slotInContinue = 0;
		$parts = new C_set();
		$slotscount = 0;
		
			$sliceSec = C_date::getSecondsPerSlice();  // number of seconds in a time slice
		$durationSlices = ($duration/$sliceSec);
		
		foreach ($cues->set as $o_cueInOut) {
			$slotIn = $oldmax; 
			$slotOut = $o_cueInOut->in->t;
			$span = $slotOut - $slotIn;	
			$newsticky = ($o_cueInOut->type == class_resa_any);

			if($overdays) {
				if($span >= $sliceSec) { // at least one slice
					if($continue == 0) $slotInContinue = $slotIn;
					$continue += $span;
					$partInOut = $parts->plus(new C_inout($slotIn, $slotOut));
					$slices = $span/$sliceSec;

				}
				if($o_cueInOut->type == class_resa_any) { // cuts a continuum of free slots
					$span = $continue; $continue = 0; $slotIn = $slotInContinue; 
				}
			}
			if($span >= $duration && $continue == 0) { // continue == 0 means we have collapsed onto a reservation
				if($overdays) $slotOut = $partInOut->out->t;
				$cueInOut = $this->slots->plus(new C_inout($slotIn, $slotOut)); // output data
				$cueInOut->attendees = $byClass;
				$cueInOut->parts 	 = $parts; 
				if($aggregate) {
					$slotscount += 2;
					$cueInOut->in->sticky 	 = $oldsticky; 
					$cueInOut->out->sticky 	 = $newsticky; 
				} else {
					$slotscount += $cueInOut->subslotscount($durationSlices);
				}
					
				if(0) displayslot($cueInOut, $durationSlices, ''); // monitoring
				unset($cueInOut); unset($parts); $parts = new C_set();
			}
			$newmax = max($o_cueInOut->out->t, $oldmax);
			if($oldmax == $newmax) { if($o_cueInOut->type == class_resa_any) $oldsticky = true; }
				else { $oldsticky = $newsticky; }
			$oldmax = $newmax;			
		}
		
		if($overdays)
			if($continue>=$duration) { // treat trailing open end 
				$cueInOut = $this->slots->plus(new C_inout($slotInContinue, $slotOut)); // output data
				$cueInOut->attendees = $byClass;
				$cueInOut->parts 	 = $parts;
					$slotscount += $cueInOut->subslotscount($durationSlices);

				if(0) displayslot($cueInOut, $durationSlices, '...trailing'); // monitoring
			}
		
		$this->perfReport->peak(chr(9).'extractslots()->scancombination()');

		return $slotscount;
	}
	
	private function extractslots($duration, $slotstop, $aggregate, $overdays, $except, $verbose) {
		
		global $nl; 
		if($this->verbose) echo 'extractslots()'.$nl.$nl;
		
		$slotscount = 0;
		$breaker = 0;
		$searchwindowspan = 12; // each search loop spans a number of days 
		
		
		// $slotstop = $slotstop; // number of slots stopping the search loop (slot count is always smaller than resa count)
		
		
		$swindowIn = clone $this->notbefore; // we keep an intact version of $notbefore, see ($now)
		
		$swindowIn->setToMidnight();
		
		
		while($slotscount < $slotstop) { // slots extraction (note that at least $searchwindowspan days are scanned for all combinations)

			
			$swindowOut = clone $swindowIn; $swindowOut->dIncrement($searchwindowspan);
			
				if(0) { // monitoring the loop time window
					echo chr(9).'STARTING A NEW SLOT SEARCH LOOP'.$nl;
					echo chr(9).'window IN cue: '.$swindowIn->getDateTimeString().$nl;
					echo chr(9).'window OUT cue: '.$swindowOut->getDateTimeString().$nl;
				}
				
				
				
			$view = $this->querycues($swindowIn, $swindowOut);

				$masks = $this->setmasks($swindowIn, $swindowOut, $except);
			$shadows = $masks['shadows'];
			$ampms	 = $masks['ampms'];
			

			// STEP 5: scan combinations
			//
			// a combination set is always fully achieved inside a given time window (mandatory). i.e. all combinations will be searched
			// 
			$packcount = 0;
			foreach($this->combs->set as $o_combination)
				$packcount += $this->scancombination($o_combination, $view, $shadows, $ampms, $duration, $aggregate, $overdays);

			// get ready for the next time window
			$swindowIn = $swindowOut;
			$slotscount += $packcount;
			
			if($this->verbose) echo chr(9).''.$packcount.' slots found in the window, '.$slotscount.' slots so far, breaker '.$breaker.')'.$nl;
			

			if(!$packcount) { // No slots where found in the current window
				$cuescount = 0; foreach($view as $rscid => $set) $cuescount += $set->count();
				if(!$cuescount) // No time reservation in the window (then free slots are defined by hourlies only)
					$breaker++; // in the present window, the hourly is such that no chunk of the duration searched does fit
			}
			
			$this->perfReport->peak('extractslots()');
			
			if($breaker>=12) {
				if($this->verbose) echo 'Searching abandonned after 12 windows showing no result'.$nl;
				break; // abandon searching when it seems that the future is fully closed. Example: the duration required does not fit in the defined hourlies
			}
			
		} // loop to next time window
	}
	
	private function makechunks($duration, $aggregate, $limitdate, $sameday, $verbose) { // cuts slots into chunks
		
		
		
		$dnow = new C_date(); $dnow->sIncrement($sameday); $now = $dnow->t; // $sameday is used only in e-reservation (it is zero instead). Users should not take an appointment on the same day in the next minutes. 
			// note that $dnow is server time while notbefore is the remote browser time, if the server drifts, there might be a difference when notbefore is set to "from now" on the browser query
		if($now<($this->notbefore->t-3600)) $now = 0; // skip the past test if the search begun in the future
		
			
		global $nl; 
		if($this->verbose) echo 'makechunks('.$this->slots->count.' slots in input)'.$nl;
			if(0) echo chr(9).'$dnow='.$dnow->getDateTimeString().', $now='.$now.', $notbefore='.$this->notbefore->t.')'.$nl;
			
			
		// Make chunks from slots. Chunks have the required duration.
		//
		// 

		if($limitdate) { 
			$limitdate = new C_date($limitdate); // you do not want search results after the given date
			if($this->verbose) echo chr(9).'limit date:'.($limitdate->getDateString()).$nl; // Note: if 2017-04-28 is the limit date, scanning stops when 2017-04-28 is scanned completely
		}
		
		sort($this->slots->set); // mixes all combinations, placing soonest chunks at the beginning. Sorting based on cueIn !!
		
		$prevday = 0;
		foreach($this->slots->set as $o_cueInOut) { // Entering a new slot

			$current = new C_date($o_cueInOut->in->t); $currday = $current->dropTime(); // calendar day to which this slot belongs
			$dayswitch = $prevday ? $currday != $prevday : false; // is true if we start scanning a new calendar day
			
				$enough = $this->chunks->count >= $this->resastop; // enough possibilities have been collected
			
			if($limitdate) if($limitdate->isBefore($current)) break; // do not return results after the limit date
			if($enough&&$dayswitch) break; // we always finish scanning a full calendar day (otherwise we return part of the availabilities of the last slot)
			if(0) {
				displayslot($o_cueInOut, $durationSlices, '');
			}
			
			$chunkspack = $o_cueInOut->chunks($duration, $aggregate, 0 /*verbose*/ ); // returns a set of o_inout
			$past = Array();
			foreach($chunkspack->set as $x => $chunk) {
				if($now) if($chunk->in->t < $now) { $past[] = $x; continue; }
				$chunk->attendees = $o_cueInOut->attendees; // inherit attendees
			}
			if(count($past)) foreach($past as $x) $chunkspack->drop($x); // clean up past stuff
			
			$this->chunks->absorb($chunkspack);
			$prevday = $currday;
		}
		sort($this->chunks->set); // mixes all combinations, placing soonest chunks at the beginning
			
			if(0) {
				echo '#### ALL CHUNKS SORTED ####'.$nl;
				foreach($this->chunks->set as $chunk) echo chr(9).$chunk->testDisplay();
			}
		
		$this->perfReport->peak('makechunks()');
	}
		
	private function datasets() { // cuts slots into chunks
		
		global $nl; 
		if($this->verbose) echo 'datasets()'.$nl;
	
		foreach($this->chunks->set as $chunk) {
			$dS_reservation = $this->reservations->newVirtual();
			$dS_reservation->groupId = $this->account->id;
					$dS_reservation->created = 0; 
					$dS_reservation->creator = 0;
					$dS_reservation->creatorId = 0;
				$dS_reservation->changed = 0; 
				$dS_reservation->changer = 0;
				$dS_reservation->changerId = 0;
					$dS_reservation->deleted = 0; 
					$dS_reservation->deletorId = 0;
			$dS_reservation->cueIn 	= $chunk->in->t;
			$dS_reservation->cueOut 	= $chunk->out->t;
			$dS_reservation->iscluster = $chunk->hasparts()?1:0;

			if($dS_reservation->iscluster) 
				foreach($chunk->parts->set as $x => $part) {
					$dS_resapart = $this->resaparts->newVirtual();
					$dS_resapart->groupId = $dS_reservation->id;
					$dS_resapart->cueIn 	= $part->in->t;
					$dS_resapart->cueOut = $part->out->t;
				}
				
			foreach($chunk->attendees as $type => $attendees) {
				if($attendees)
					foreach($attendees as $resourceId) {
						$dS_attendees = $this->attendees->newVirtual();
						$dS_attendees->groupId = $dS_reservation->id;
						$dS_attendees->resourceType = $type;
						$dS_attendees->resourceId = $resourceId;
					}
			}
		}
		$this->perfReport->peak('datasets()');
		
	}	
	

}

?>