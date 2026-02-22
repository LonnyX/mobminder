<?php
//////////////////////////////////////////////////////////////////////////////////////////////
//
//  W E B   A P P  /  P O S T    R E S E R V A T I O N 
//
//
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
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
//

// sleep(1); // this is to test the fade and spinner effects during modal save


define('local_test', false); // echoes notifications about the sending of messages (false -> cut by the early connection close
							// when set to true, the network response shows a nice drilldown of what, how and why messages are sent or not sent
							// please keep false in production
							// 
							// !! do not forget to set sendComms back to 1 - even though you are in dev - in DB 'globals' table

if(!local_test) ob_start(); // relates to (*ob1)

require '../classes/language.php';

$loadcontext = 2; require '../classes/ajax_session.php'; session_write_close();
new L($dS_account->language, $dS_account->visitorAlias); // states the visitor alias
$perfReport = new C_perfReport(); $perfReport->peak('::session retrieved, session file closed');

$resaId = $_POST['id']+0; // added +0 to make sure we are posted a genuine entiger (problem with rows inserted with id 0)

$archived 	= $_POST['archived']+0;
$peerId 	= $_POST['peerId']+0;
$replan 	= @$_POST['replan']; 	if(isset($replan)) $replan = ($replan=='-') ? false : $replan; else $replan = false;
$staffchanged 	= @$_POST['staffchanged'];	if(isset($staffchanged)) $staffchanged = ($staffchanged=='0') ? false : true; else $staffchanged = false;
$confirmed 	= @$_POST['confirm'];	if(isset($confirmed)) $confirmed = ($confirmed=='0') ? false : true; else $confirmed = false;
$parts 		= @$_POST['parts']; 	if(isset($parts)) $parts = ($parts=='-') ? false : explode('!', $parts); else $parts = false;
$recurr 	= @$_POST['recurr']; 	if(isset($recurr)) $recurr = explode('!', $recurr); else $recurr = false;
$bank 		= $_POST['bank'];


if(isset($_REQUEST['waitingList'])) 	if(!is_numeric($_REQUEST['waitingList'])) 	logoff('#moberr 70001a');
if(isset($_REQUEST['workcodes'])) if(!exlamationsplitinteger($_REQUEST['workcodes'])) logoff('#moberr 70001b');
if(isset($_REQUEST['products']))  if(!exlamationdoublesplitinteger($_REQUEST['products'])) logoff('#moberr 70001g');



// C_date::setTimeParameters($dS_account); // Not needed, time is posted in UTC
$date = new C_date($_POST['cueIn']);
$gmtshift = C_date::getTimeShift($dS_account, $dS_login, $date->getDateSortable());
if($gmtshift) { // GMT shift (**GMT)
    $_POST['cueIn'] += $gmtshift; $_POST['cueOut'] += $gmtshift;
    echo 'gmtshift:'.($gmtshift/3600).' hours'.$nl;
}


$visitors = $_POST['visitors']; $visitors = ($visitors=='-') ? false : explode('!', $visitors);
$bCals 	= $_POST['bCals']; $bCals = ($bCals=='-'||$bCals=='') ? false : explode('!', $bCals);
$uCals 	= $_POST['uCals']; $uCals = ($uCals=='-'||$uCals=='') ? false : explode('!', $uCals);
$fCals 	= $_POST['fCals']; $fCals = ($fCals=='-'||$fCals=='') ? false : explode('!', $fCals);

$workcodes = $_POST['workcodes']; $workcodes = ($workcodes=='-') ? false : explode('!', $workcodes);
$products = $_POST['products']; $products = ($products=='') ? false : explode('!', $products); // pairs of product id with quantity, like '2200027,3!2200028,2'

if($dS_login->accessLevel == aLevel_eresa) C_dbIO::logged($dS_login,'(eresa)'); // sign any change in DB

$perfReport->peak('::posts retrieved');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// retrieve or make new reservation
//

$isanewresa = ($resaId <= 0); $isexistingresa = !$isanewresa;

if($resaId<=0) $archived = 0; // copy/paste from a reservation that is archived sends a negative id with archive set to 1. In fact, it is a new reservation (a copy) and the archive tag must be ignored (*bf01*)


	$resa_as_existing = false;
if($archived) { 
    // when archived: the reservation is removed from archived tables, and re-recorded in the current tables, see (*21*)
    // => plitems queries are tuned to read also from current tables, even for older dates queries.
    // => next weekly cron will put this older reservation back to its place in archive tables. 
    // => the new record will get the id of the archived record, see (*23*)
    // => we copy the original creation date to the new dS_reservation, see (*22*)
    //
    $archived = $resaId;
    $dS_reservation = new C_dS_reservation(0, $accountId, $_POST); // the one we are going to save into current table
	$resa_as_existing = new C_dS_reservation($resaId); // loads automatically from archive_ if necessary

} else {
	if($isexistingresa) $resa_as_existing = new C_dS_reservation($resaId); // keeps a copy of the unchanged reservation
    $dS_reservation = new C_dS_reservation($resaId, $accountId, $_POST); // resa from current table, goes back to current table
}



$perfReport->peak('::Reservation');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Prepare reservation attributes
//
$att_visitors = new C_dbAccess_att_visitors();
$resaparts = new C_dbAccess_resaparts();
$performances = new C_dbAccess_performances();
$goods = new C_dbAccess_goods();


$attendees = new C_dbAccess_attendees();
$classes = array(class_bCal => $bCals, class_uCal => $uCals, class_fCal => $fCals); // this is based on what was posted (eventually limited by the login's view)
foreach($classes as $class => $att_by_class)
    if($att_by_class)
        foreach($att_by_class as $id) {
            $dS_attendee = $attendees->newVirtual();
            $dS_attendee->resourceId = $id;
            $dS_attendee->resourceType = $class;
        }
if($isexistingresa) // PVH-2020-11 fix limited view resa post problem
	if($is_limited_view) { // add attendees that are out of view scope (complete the set with resources that are out of login's view, so they receive the expected treatment)
			$as_is_attendees = new C_dbAccess_attendees($archived ? 'archive_' : '');
		$as_is_resources = $as_is_attendees->loadOnGroup($resaId)->cutToView($view_rscs_ids_clist, $invert=true)->getResourceIdsList(list_as_array);
	// echo 'AIR '.implode(',',$as_is_resources).$nl; // should restore resources eventually out of view scope BUT NOT the ones in the view scope
		$to_be_resources = $attendees->getResourceIdsList(list_as_array);
	// echo 'TBR '.implode(',',$to_be_resources).$nl; // list of resources as passed through the POST, view limited players can only mange and post in view scope resources 
		
		foreach($as_is_resources as $rscid => $v)
			if(!array_key_exists($rscid,$to_be_resources)) {
				$dS_attendee = $attendees->newVirtual();
				$dS_attendee->resourceId = $rscid;
				$dS_attendee->resourceType = $account_resources->keyed[$rscid]->resourceType;
				// echo '- added rscid : '.$rscid.$nl;
			}
	}


// check if the visitor ids do match real records (this has been introduced after a hacking on the e-resa, where visitor id 0 was passed)
//
if($visitors) { // we check here that visitor Ids passed belong to the right account and have valid ids
    $mv = implode(',',$visitors);
    $q = new Q('select count(1) as c from visitors where groupId = '.$accountId.' and id in('.$mv.');');
    $c = $q->c();
    if(count($visitors)!=$c) logoff('Incoherent data #moberr 70701c');
}

// attendee visitors objects	
if($visitors)
    foreach($visitors as $vid) {
        // check that this visitor is still active
        $q = new Q('select count(1) as c from visitors where id = '.$vid.' and deletorId = 0;');
        if(!$q->c()) continue; // This solves the very particular case where a doublon was removed but is still selected (and id posted) from the C_iACPICK control. Other similar scripts are protected against this. see (*exc10*)

        // add the visitor reference
        $dS_att_vis = $att_visitors->newVirtual();
        $dS_att_vis->resourceId = $vid;
        $dS_att_vis->resourceType = class_visitor;
    }

$perfReport->peak('::Attendees');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	
// Check for overloads before saving anything in DB   ( !!  script might DIE in this section  !! )
//
$dooverloadcheck = !$confirmed && !$archived && ($isanewresa||$staffchanged);
if($dooverloadcheck) { // if confirmed is true, the user has already indicated that he accepts an overload

	// echo 'Checking overloads'.$nl;
    // This check has two purposes
    // - in case of concurrent planning management, we want to show that so else has just created or modified a reservation that conflicts with this saving
    // - when a user overloads some resources on the planning (let's say mutliple resource type planning), he should be warned 
    //
    $i = $dS_reservation->cueIn;
    $o = $dS_reservation->cueOut;
    $x = $dS_reservation->id; $excludethis = ''; if($x>0) $excludethis = 'AND reservations.id <> '.$x;
    $r = $attendees->getResourceIdsList();
    $SQL = 'SELECT reservations.id AS id, creator, created, changer, changed, cueIn FROM reservations 
			JOIN attendees ON attendees.groupId = reservations.id
			WHERE ( reservations.groupId = '.$accountId.' AND '.$i.' < cueOut AND '.$o.' > cueIn) 
				'.$excludethis.' AND reservations.deletorId = 0	AND resourceId IN ('.$r.');';

    $result = C_dbIO::q($SQL);
    if($result->num_rows) { // report some info about what reservations we are overloading here (this protocol is read in .js see (*20*))

        $loginIds = Array(); $resaIds = Array(); $stamps = Array();

        while($row = $result->fetch_array()) { 
            if($row['changer']!='') $lId = $row['changer']; else $lId = $row['creator']; 
            $stamp = 'X';
            $create = new C_date($row['created']); $stamp = $create->getTstmp();
            $change = new C_date($row['changed']); if($row['changer']) $stamp = $change->getTstmp();
            $resaId = $row['id'];
            $cueIn = $row['cueIn'];

            $loginIds[] = $lId; $resaIds[] = $resaId; $stamps[] = $stamp; $cueIns[] = $cueIn; 
            unset($lId, $resaId, $stamp, $cueIn);
        }

        $servernow = new C_date(); $servernow = $servernow->getTstmp();
        die('Overload!'.$servernow.'!'.implode(',',$cueIns).'!'.implode(',',$loginIds).'!'.implode(',',$stamps).'!'.implode(',',$resaIds).$nl);
    }
    $result->close();

}

$perfReport->peak('::Overload check');	



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Delete older attributes
//
$formerly_existing_attendees = false;
$formerly_existing_visitors = false;
$timing_changed = false;

if($isexistingresa) { // workcodes and attendees may have changed totally, we clean them up

    // To delete event in Cronofy
    $formerly_existing_attendees = new C_dbAccess_attendees($archived ? 'archive_' : '');
	$formerly_existing_attendees->loadOnGroup($resaId); // loads only attendees that can be managed by this login, according to his view
    $formerly_existing_visitors = new C_dbAccess_att_visitors($archived ? 'archive_' : '');
	$formerly_existing_visitors->loadOnGroup($resaId); // loads only attendees that can be managed by this login, according to his view
	
	// timing change : we send communications and notifications only when schedule or visitors have changed
	
		$sched_change = $resa_as_existing->cueIn <> $dS_reservation->cueIn;
		$visi_change = $formerly_existing_visitors->visitors_compare($att_visitors);
	$timing_changed = ($sched_change || $visi_change);
	
	$resa_as_existing->dropAttributes(); // workcodes and attendees may have changed, we clean those in the login view
}

$perfReport->peak('::Removed attributes');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Save reservation & attributes ( keep these lines after confirmation in case of overload )
//
$dS_reservation->deleted = '0000-00-00 00:00:00'; // when saving a deleted reservation, you restore it
$dS_reservation->deletorId = 0;
$dS_reservation->rescheduled = 0;
$dS_reservation->archived = 0; // if not reset, the data set goes back to archive tables (which is not what we want, see (*21*)
if($parts) $dS_reservation->iscluster = 1;


if(0) {
	$joiningSerieId = $_POST['joiningSerieId']+0; // should be integer
	if(!is_numeric($joiningSerieId)) $joiningSerieId = 0; // should always be but let's protect against hacking tricks here
	if($isexistingresa) {
		if($dS_reservation->serieId) { // update existing serie
			
			if($joiningSerieId==-1) { // this is the un-link command, we make it such that this reservation is removed from the serie but stays on the agenda
				$dS_reservation->serieId = 0; // see where this command is emitted from? > (*rs03*)
				
				// PVH 2025 : there should be a piece of code here re-linking snext and sprev when a reservation is removed from a serie.
				// But snext and sprev are nowhere used so far, so I did not write this piece of code.
		
			} else {
				$dS_serie = new C_dS_resa_serie($dS_reservation->serieId, $accountId, $_POST); // will only reflect 'stitle' from the post
				$dS_serie->dSsave();
			}
			
		} else {
			
			// we have an existing reservation belonging to no serie so far
			$dS_reservation->serieId = $joiningSerieId; // that is defaulty posted as zero (no serie link)
			echo $nl.'existing resa joining resa serie '.$joiningSerieId.$nl;
		}
	} else { // it is a new reservation
		
		// PVH 2025 : there should be a piece of code here re-linking snext and sprev when a reservation is added to a serie.
		// But snext and sprev are nowhere used so far, so I did not write this piece of code.

		$dS_reservation->serieId = $joiningSerieId; // writes the value even if it is zero
		echo $nl.'new resa joining resa serie '.$joiningSerieId.$nl;
		
	}
}

if($isexistingresa) {
	if($dS_reservation->serieId) { // we update the name of an existing serie here 
		$dS_serie = new C_dS_resa_serie($dS_reservation->serieId, $accountId, $_POST); // will only reflect 'stitle' from the post
		$dS_serie->dSsave();		
	}
}		




$dS_reservation->dSsave(); 
$resaId = $dS_reservation->id; // now resaId is the id of the new reservation (if it was archived or virtual) // see (*23*)

if($archived) {
    $dS_archived = $resa_as_existing; // when not found in current table, the dbio code retrieves the reservation from the archive table
    $dS_reservation->created = $dS_archived->created; // see (*22*)
    $dS_reservation->creator = $dS_archived->creator;
    $dS_reservation->creatorId = $dS_archived->creatorId;
    $dS_reservation->rversion = $dS_archived->rversion+1; // retrieve also the version
    $dS_reservation->dSsave();
    $dS_archived->dSdelete(); // this is a real record removal from archive table (not a delete tag like you get when using dSobsolete)
    new Q('update reservations set id = '.$archived.' where id = '.$resaId.';'); // see (*23*) id of this reservation is referenced in toggles, sms, emails, ... so we better keep the id intact
    $dS_reservation->id = $resaId = $archived;
}


$attendees->saveAll($resaId); // group attendees by reservation id
$att_visitors->saveAll($resaId); 


$perfReport->peak('::Saving reservation');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Treat replan
//
if($replan) { // mark the replanned reservation as rescheduled

    $dS_replaced = new C_dS_reservation($replan); // if archived, it loads from the archive table
    $dS_replaced->rescheduled = $resaId;

    if($dS_replaced->peerId) { // then we also remove the peer resa attributes
        $dS_replaced_peer = new C_dS_reservation($dS_replaced->peerId);
        $dS_replaced_peer->rescheduled = 1;
        $dS_replaced_peer->dSobsolete();
    }
    $dS_replaced->dSobsolete();
    $perfReport->peak('::Replacing another resa');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// New reservation with fCal attendees
//
$noPeer = !$peerId;
if($isanewresa && $noPeer && $fCals) { // check fCal attendees with a custom reservability (like car reservation)
    $reservations_fcal = new C_dbAccess_reservations();
    $att_visitors_fcal = new C_dbAccess_att_visitors();
    $attendees_fcal = new C_dbAccess_attendees();
    foreach($fCals as $id) {
        $dS_resource = new C_dS_resource($id);
        $i = $dS_reservation->cueIn;
        $o = $dS_reservation->cueOut;
        if($dS_resource->reservability != reservability_scheduled) { // then an additional resa is necessary, it covers the bounds according to reservability
            // create an fCal tracking resa
            $dS_resa_fcal = $reservations_fcal->newVirtual();
            $dS_resa_fcal->groupId = $accountId;
            $dS_resa_fcal->cueIn = mktime(0,0,0,date("m",$i),date("d",$i),date("Y",$i))+$dS_account->rangeIn;
            $dS_resa_fcal->cueOut = mktime(0,0,0,date("m",$o),date("d",$o),date("Y",$o))+$dS_account->rangeOut;
            $dS_resa_fcal->peerId = $dS_reservation->id;
            $dS_resa_fcal->dSsave(); // gets a new id if virtual, keeps former id when updated
            // link it by peerId to the peer resa
            $dS_reservation->peerId = $dS_resa_fcal->id;
            $dS_reservation->dSsave();
            // create fCal attendee
            $dS_attendee = $attendees_fcal->newVirtual();
            $dS_attendee->groupId = $dS_resa_fcal->id;
            $dS_attendee->resourceId = $id;
            $dS_attendee->resourceType = class_fCal;
            $dS_attendee->dSsave();
            // create visitors attendee
            if($visitors) {
                foreach($visitors as $id) {
                    $dS_attendee = $att_visitors_fcal->newVirtual();
                    $dS_attendee->resourceId = $id;
                    $dS_attendee->groupId = $dS_resa_fcal->id;
                    $dS_attendee->resourceType = class_visitor;
                }
            }
        }
    }
    $att_visitors_fcal->saveAll();
    $attendees_fcal->saveAll();
    $perfReport->peak('::New resa with fCals');
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Peer reservation
//
if($peerId) {
    $peer = new C_dS_reservation($peerId);
    if($peer->peerId != $resaId) {
        $peer->peerId = $resaId; // link to the peer and establish reciprocity

        if($isanewresa) { // when you drag and drop on an fCal (e.g. droppping a technical resa on a replacement car)
            $peer_attendees = new C_dbAccess_attendees();
            if($fCals)
                foreach($fCals as $id) {
                    $dS_attendee = $peer_attendees->newVirtual();
                    $dS_attendee->resourceId = $id;
                    $dS_attendee->resourceType = class_fCal;
                }
            $peer_attendees->saveAll($peer->id); // group attendees by reservation id
        }
        $peer->dSsave();
    }
    $perfReport->peak('::Peer resa');
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Parts
//
if($parts) foreach($parts as $id => $combo) {
    $cues = explode('-', $combo);
    $cueIn = $cues[0]; $cueOut = $cues[1];
	if(!is_numeric($cueIn)) 	logoff('#moberr 70701d');
	if(!is_numeric($cueOut)) 	logoff('#moberr 70701e');
    $dS_resapart = $resaparts->newVirtual();
    $dS_resapart->cueIn = $cueIn;
    $dS_resapart->cueOut = $cueOut;
}
$resaparts->saveAll($resaId); // group parts by reservation id
$perfReport->peak('::Parts');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Performances
//

if($workcodes) foreach($workcodes as $id) {

    $q = new Q('select id from workcodes where id = '.$id.';'); if(!$q->ids()) continue; // the workcode has been deleted from the account config by another user.

    if($visitors) { // one performance for each visitor
        foreach($visitors as $visitorId) {
            $dS_performance = $performances->newVirtual();
            $dS_performance->workCodeId = $id;
            $dS_performance->visitorId = $visitorId;
        }
    } else { // a single performance (this is not an appointment but a time reservation)
        $dS_performance = $performances->newVirtual();
        $dS_performance->workCodeId = $id;
        $dS_performance->visitorId = 0;
    }
}
$performances->saveAll($resaId); // group performances by reservation id
$perfReport->peak('::Workcodes');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Products and goods
//

if($products) foreach($products as $prididquantity) { 
	$split = explode(',', $prididquantity); // pairs of product id with quantity, like '2200027,3'
	$prdid = $split[0];
	$quant = $split[1]; // they are already verified as being integeer all of them.
    $q = new Q('select id from products where id = '.$prdid.';'); if(!$q->ids()) continue; // the product has been deleted from the account config by another user.
	
	if($visitors) { // one goods for each visitor, so we can track who buys what. Note that this behaviour is identical for performances.
        foreach($visitors as $visitorId) {
            $dS_goods = $goods->newVirtual();
            $dS_goods->productId = $prdid;
            $dS_goods->numberof = $quant;
            $dS_goods->visitorId = $visitorId;
        }
    } else { // a single performance (this is not an appointment but a time reservation)
        $dS_goods = $goods->newVirtual();
        $dS_goods->productId = $prdid;
        $dS_goods->numberof = $quant;
        $dS_goods->visitorId = 0;
    }
}
$goods->saveAll($resaId); // group goods by reservation id
$perfReport->peak('::Goods');



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Communication toggle options
//

    $toggles = new C_dbAccess_cToggles();	

		$sms = @$_POST['sms']; 		if(isset($sms)) $sms = ($sms=='-') ? false : explode('!', $sms); 			else $sms = false;
		$mails = @$_POST['mails']; 	if(isset($mails)) $mails = ($mails=='-') ? false : explode('!', $mails); 	else $mails = false;

	$toggles->setbundels($accountId, $resaId, $sms, $mails); // this bundle was made here (*bu1*)

    $perfReport->peak('::Communication switches (on/off)');
	


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Recurrence - create a new serie of reservations (sell of goods do not reproduce on series)
//
$rec_resas = new C_dbAccess_reservations();
$dS_serie = false;
$rec_resas->add($dS_reservation);
$c = 0;
if($isanewresa)	
    if(!$parts) 	// clusters may not generate recurrence	
        if($recurr)	// is the exploded version array from  $recurr = @$_POST['recurr'];, arriving like '1763751600!1763838000!1763924400!1764010800!1764097200'
            if(count($recurr)>1) {

				if($dS_reservation->serieId)
					$dS_serie = new C_dS_resa_serie($dS_reservation->serieId); // we rely on that existing dS_resa_serie
				else {
					$dS_serie = new C_dS_resa_serie(0, $accountId, $_POST); // we create an new serie and assign stitle to it. This will only extract stitle from the post.
					$dS_serie->dSsave();
				}
                $dS_reservation->serieId = $serieId = $dS_serie->id;

                $rec_att_visitors 	= clone $att_visitors;
                $rec_attendees 		= clone $attendees;
                $rec_performances 	= clone $performances;
                $rec_toggles 		= clone $toggles;	

                $duration = $dS_reservation->cueOut - $dS_reservation->cueIn;
                $skipfirst = 0;
				$dS_prev = $dS_reservation; // is the first chronological dS_reservation, as POSTED
				
                foreach($recurr as $cueIn) {
                    
					$d = new C_date($cueIn);
                    echo $skipfirst.': recurring appointment on '.$d->getDateTimeString().$nl;

                    if(!$skipfirst++) continue; // the first of this serie is already in place in the arriving $_POST[]t'ed $dS_reservation

                    // snext and sprev are reservation ids, they make a linked list so to identify a serie of reservations

                    $dS_resa = $rec_resas->newVirtual($dS_reservation); // clones that reservation each time
                    $dS_resa->serieId = $serieId;
                    $dS_resa->snext = 0; // erases the result of this (*33*) during the first iteration of this loop
                    $dS_resa->cueIn = $cueIn; $dS_resa->cueOut = $cueIn+$duration;
                    $dS_resa->sprev = $dS_prev->id;
                    
					$rid = $rec_resas->save($dS_resa->id);
                    $dS_prev->snext = $rid; $dS_prev->save(); // (*33*) is recorded inside the reference $dS_reservation at first body execution
                    unset($dS_prev); $dS_prev = $dS_resa;
				
                    // duplicate attributes
                    $att_visitors->absorbAsNew($rec_att_visitors, $rid); // makes an actual copy of $rec_att_visitors onto $att_visitors, changing only the groupId ($rid here)
                    
					$attendees->absorbAsNew($rec_attendees, $rid);
					
					// echo $c.' *************** '.chr(10);
					// foreach($attendees->keyed as $attid => $dS_attendee) { echo ' =>'.chr(10);  print_r($dS_attendee); echo chr(10); }
					// echo $c.' *************** '.chr(10);
					
                    $performances->absorbAsNew($rec_performances, $rid);
                    
					if($rec_toggles->count()) foreach($rec_toggles->keyed as $tid => $dS_toggle) $dS_toggle->reservationId = $rid;
                    $toggles->absorbAsNew($rec_toggles, $accountId);
					
					unset($rid);
					unset($dS_resa);
					$c++;
                }	
				
                // foreach($attendees->keyed as $attid => $dS_attendee) { print_r($dS_attendee); echo chr(10); }
				
                $att_visitors->saveAll();
                $attendees->saveAll();
                $performances->saveAll();
                $toggles->saveAll();

                echo $nl;

                $perfReport->peak('::Recurrent reservations');
            }




////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Feedback
//
if($gmtshift) {
    foreach($rec_resas->keyed as $id => $dS_resa)
        $dS_resa->gmtshift($gmtshift); // only for display reasons at client side. Do not save the reservation after this!
}

echo '<code>';
echo $attendees->cutToView($is_limited_view?$view_resources->viewIds:false)->stream(no_alias, $bank);
echo $att_visitors->stream(no_alias, $bank);
echo $performances->stream(no_alias, $bank);
echo $goods->stream(no_alias, $bank);
echo $resaparts->stream(no_alias, $bank);
echo $toggles->stream();
echo $rec_resas->stream(no_alias, $bank); // embraces recurrent or non recurrent dS_reservation(s)
if($dS_serie) echo '#C_dS_resa_serie'.'#'.$bank.$nl.$dS_serie->stream(with_tracking).$nl;
if($noPeer && $isanewresa && $fCals) {
    echo $attendees_fcal->stream(no_alias, $bank);
    echo $att_visitors_fcal->stream(no_alias, $bank);
    echo $reservations_fcal->stream(no_alias, $bank);
}
echo '</code>';
$perfReport->peak('::Feedback completed');
$perfReport->dropReport();


// Echo to client side and close connexion (but keep this script running)
//
if(!local_test) { // disabled when testing, so the next sections can echo on the screen
	
	closeconnection(); // escapes from Apache2 KEEP_ALIVE
}

C_dS_connection::poke($perfReport, 'p_resa');

// define('crontest', local_test); // this prevents the comm layer to really send communication to the SMS provider





////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Now takes place the processing we want to happen AFTER feedback has been delivered to the client side
//



////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// notifications 
//

$abortnotifications = false; 
notice(chr(10));

if(!($bCals||$uCals)) $abortnotifications = 'fcals only in attendees'; // In this case the reservation is only on facultative resource. 
if(!$visitors) $abortnotifications = 'no notifications for a reservation having no visitor';
if(!$dS_account->sendSMSs) $abortnotifications = 'this account has a disabled communication switch';
// if($timing_changed) $abortnotifications = 'The reservation schedule nor recepients have changed'; // PVH 2022 this would prevent manual notifications messages to leave


notice(chr(10)); 
if($abortnotifications) h1('No notification will be sent: '.$abortnotifications);
else 
	sendEventMessages($dS_login, $dS_account, $resaId, action_create+action_change, $timing_changed, $testmode = local_test);

notice(chr(10)); 



//bsp-begin
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// Cronofy
// updated by bspoden
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require '../../lib_cronofy/cronofymanager.php';
DebugLog('post/reservation.start');
$dS_cronofy_manager_reservation = new C_cronofy_manager_reservation($accountId);
$dS_resa = new C_dS_reservation($resaId);
DebugLog('post/reservation.2');

// if change, delete old event (because, attendee are deleted then created)
if($formerly_existing_attendees) 
{
    DebugLog('post/reservation.before attendeedeleted');
    $dS_cronofy_manager_reservation->DeleteByAttendees($dS_resa,$formerly_existing_attendees);
}

//reset remote id and profile, if eventuid existed in past, it has been deleted!
if($dS_resa->remoteProfile!=0)
{
    //force remoteid with '1' to know that event was born as an external event
    $dS_resa->remoteid = '1';
    $dS_resa->remoteProfile = 0;
    $dS_resa = $dS_resa->dSsave();
}

//create all, only eventid and no eventuid because eventuid has been reset in reservation
DebugLog('post/reservation.3');
    // create all, only eventid and no eventuid because eventuid has been reset in reservation
	// view is false when all resources are visible to this login, or a comalist when the view is limited
$dS_cronofy_manager_reservation->UpsertForAttendees($dS_resa,null /*excludeCalendarId*/);
DebugLog('post/reservation.end');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//bsp-end

// new C_hl7_notification($accountId,$dS_resa);

?>