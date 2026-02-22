<?php
//////////////////////////////////////////////////////////////////////
//
//  P O S T    A C C O U N T 
//
//
//  This is where you post new account settings
//
//	  H E R E   you can also   D U P L I C A T E    A  N    A C C O U N T
//
//
ini_set('memory_limit', '1024M');
set_time_limit(360); // take a breath ( allows 10min execution )

ob_start(); // relates to (*ob1)
$loadcontext = 1; require '../classes/ajax_session.php'; // defines $nl, $keyId, $loginId, $accountId
require '../../lib_cronofy/crohelper.php';
$perfReport = new C_perfReport();

$perfReport->peak('::session retrieved');

$aid = $_POST['id']+0;
$duplicate = @$_POST['dup']; if(isset($duplicate)) $duplicate = true; else $duplicate = false;

if($aid <= 0) die('unexpected negative id'); // new accounts are not created through this script

if($duplicate) { // Account duplication ( this is not the basic flow, basic flow is saving an existing account parameters, that goes through the else { } )

	$inclusive 	= explode('!',$_POST['inclusive']);
	
	$targetexisting = $_POST['targetexisting']+0; // 0 = new account, 1 = merge to an existing account
	$targaccid 		= $_POST['targaccid']; 	// usefull when targetexisting = 1
	
	$colors 		= in_array('colors',$inclusive);
	$comms 			= in_array('communications',$inclusive);
	$agendas 		= in_array('agendas',$inclusive);
	$timeboxing 	= in_array('timeboxing',$inclusive);
	$hourlies 		= in_array('hourlies',$inclusive);
	$workcodes 		= in_array('workcodes',$inclusive);
	$visitors 		= in_array('visitors',$inclusive);
	$reservations 	= in_array('reservations',$inclusive);
	$guidelines 	= in_array('guidelines',$inclusive);
	
	$acckeys4 	= $_POST['acckeys4'];
		if($acckeys4=='-') $acckeys4 = Array();
		else $acckeys4 = explode('!', $_POST['acckeys4']); // is a list of login ids that should get access to this account
	
	$rscmove = 0; // $_POST['rscmove']+0; // NOT OPERATIONAL YET - tells whether agendas are moved or copied, 1:'move rscs to new acc'
		$rscmove = !!$rscmove; // make them boolean
		$rsccopy = !$rscmove; 
		// Needs further development!! the related code here is completely buggy, based on re-assigning the resources.
		// It's certainly much better to copy the resources and after that, delete the originating resources from the originatig account
		// The problem is: sms and emails are keeping linked to orignal resource if we can program a real "resource move", when copying a resource with reservations the sms and email were never sent
	
	
	$visicopymode 	= $_POST['visicopymode']+0; // wheter visitors are all copied, or if only appointed visitors are copied (with respect to selected resources), 1:'copy appointed visitors'
	$include_arch 	= $_POST['resascopymode']+0; // 1 including archived reservation, 0 including only the current table
	
	$rscids 	= $_POST['resources']; // which agendas are copied/moved


	// new account request
	//
	if($dS_login->accessLevel < aLevel_seller) die('No access rights for this operation');
	
	$dS_targetAccount = new C_dS_group($aid); // we copy all properties from the original account

	
	// debug : show copy parameters
	//
	
	echo 'PROCESS PARAMETERS and OPTIONS: '.$nl;
	$pad = '     ';
	
	echo $nl.'target mode: '.($targetexisting?'merge to existing account ('.$targaccid.')':'make a new account').$nl;
	echo $nl.'inclusive:'.$nl;
	if($visitors) 		echo $pad.'visitors'.$nl;
	if($agendas) 		echo $pad.'agendas'.$nl;
		echo $pad.$pad.'resources:'.$rscids.$nl; if($rscids) $rscids = explode('!', $rscids); else $rscids = Array();
			$coma_rscids = implode(',',$rscids);
			$rcount = count($rscids);
		echo $pad.$pad.'->'.($rscmove?'move '.$rcount.' agendas':'copy '.$rcount.' agendas').$nl;
		if($rcount==0) { $agendas = 0; $reservations = 0; }
	
	echo $nl;
	if($colors) 		echo $pad.'colors'.$nl;
	if($comms) 			echo $pad.'comms'.$nl;
	if($timeboxing) 	echo $pad.'timeboxing'.$nl;
	if($hourlies) 		echo $pad.'hourlies'.$nl;
	if($workcodes) 		echo $pad.'workcodes'.$nl;
	if($reservations)	echo $pad.'reservations'.$nl;
	if($guidelines)		echo $pad.'guidelines'.$nl;
	if(count($acckeys4)) echo $pad.'acckeys'.$nl;
	
	
	// die('debug stop :)'); // when checking how parameters post, stopping here is convenient :)
	

	if($targetexisting) {
		
		
		$q = new Q('select id from groups where id = '.$targaccid.';');
		if(!$q->ids()) die('Cannot copy to target account, invalid id');
		
		echo $nl.'LINKING TO TARGET ACCOUNT: '.$nl;
		
		$dS_targetAccount = new C_dS_group($targaccid);
		
	} else {
		
		echo $nl.'INSTANCIATING NEW ACCOUNT: '.$nl;
		
		// create an destinating account
		$dS_targetAccount = new C_dS_group($aid); // we copy all properties from the original account
			$dS_targetAccount->groupId 	= $loginId; // the new account will belong to this seller
			$dS_targetAccount->name 		= $_POST['name'];
			$dS_targetAccount->color 		= $_POST['color'];
			$dS_targetAccount->pattern 	= $_POST['pattern'];
			$dS_targetAccount->note 		= $_POST['note'];
		
			// reset some parameters
			$dS_targetAccount->email = '';
			$dS_targetAccount->smsSenderId = '';
			$dS_targetAccount->sendSMSs = 0;
		
		$dS_targetAccount->language = $dS_login->language;
		
		$dS_targetAccount->id = 0;
		$dS_targetAccount->dSsave();
	}
	$targetAccId = $dS_targetAccount->id; 
	echo 'target account id: '.$targetAccId.$nl;
	
	// logged on process initiator gets immediately a key to access the target account
	// 
	// $dS_accesskey (provided by ajax_session) is the key of the copier from the originating account
	// $dS_copierkey (provided here) is the key of the copier for the target account. We pass here at the bottom of this script so the copier gets logged all through after this process
	//
	// 2 cases :
	// - A new account is made: make a new key
	// - The target is an existing account: check if copier login has a key already
	
	$scope_rscs = new C_dbAccess_resources(); // loads resources under scope from the originating account
		$scope_rscs->loadOnId($coma_rscids);
	
	$q = new Q('select id from accesskeys where groupId = '.$loginId.' and accountid = '.$targetAccId.';'); // check if the requesting account already has access to the target account
	if(!$q->ids()) { // when a new account is being made, there is never an already existing key
		$dS_copierkey = new C_dS_accesskey(); // copier key is the accesskey of the copier (or copying) login
		$dS_copierkey->accountId = $targetAccId; // note that the copier is always a human login, so we are sure not to assign a second key to a sync or web login
		$dS_copierkey->dSsave($loginId); // access keys group to a login
	} else {
		$dS_copierkey = new C_dS_accesskey($q->ids()); // (use the existing key) (*eak*)
	}
	
	$perfReport->peak('::target account made or loaded, complete');	


	
	echo $nl.'STARTING POPULATION PROCESS'.$nl;
	
	function xlinkstring($recepient,$xref,$sep='!') { // recipient like '4589!8754!5632', $xref like [2200->9990,4589->9999,8754->9998,5632->9997,6333->9996], output like '9999,9998,9997'			
		if(!$recepient) return '';
		$items = explode($sep,$recepient);
		$xlinked = Array();
		foreach($items as $item) $xlinked[] = $xref[$item];
		return implode($sep,$xlinked);
	}
	$xccss = false; // no copy of colors
	if($colors) { 	// copy colors, retrieve $xccss[]
		echo $pad.'copying colors'.$nl;
		$ccss = new C_dbAccess_customCss($aid);
		$xccss = Array(); $xccss[0] = 0; // no ccss assigned
		foreach($ccss->keyed as $ccssId => $dS_ccss) {
			$dS_ccss->id = 0; $dS_ccss->dSsave($targetAccId);
			$xccss[$ccssId] = $dS_ccss->id; // array key is the old id, array value is the new id
		}
		
		$dS_targetAccount->defaultCssAppColor 	= $xccss[$dS_targetAccount->defaultCssAppColor];
		$dS_targetAccount->defaultCssAppPattern 	= $xccss[$dS_targetAccount->defaultCssAppPattern];
		$dS_targetAccount->defaultCssAppTag 		= xlinkstring($dS_targetAccount->defaultCssAppTag,$xccss);
		
		$dS_targetAccount->defaultCssEventColor 	= $xccss[$dS_targetAccount->defaultCssEventColor];
		$dS_targetAccount->defaultCssEventPattern = $xccss[$dS_targetAccount->defaultCssEventPattern];
		$dS_targetAccount->defaultCssEventTag 	= xlinkstring($dS_targetAccount->defaultCssEventTag,$xccss);
		
		$dS_targetAccount->defaultCssFcalColor 	= $xccss[$dS_targetAccount->defaultCssFcalColor];
		$dS_targetAccount->defaultCssFcalPattern 	= $xccss[$dS_targetAccount->defaultCssFcalPattern];
		$dS_targetAccount->defaultCssFcalTag 		= xlinkstring($dS_targetAccount->defaultCssFcalTag,$xccss);
		
		$dS_targetAccount->defaultCssVisitorColor 	= $xccss[$dS_targetAccount->defaultCssVisitorColor];
		$dS_targetAccount->defaultCssVisitorPattern 	= $xccss[$dS_targetAccount->defaultCssVisitorPattern];
		$dS_targetAccount->defaultCssVisitorTag 		= xlinkstring($dS_targetAccount->defaultCssVisitorTag,$xccss);
		
		$perfReport->peak('::colors processing complete');	
	} else {
		// colors should not be copied, so let's reset the default setting that resides in the dS_group
		$dS_targetAccount->defaultCssAppColor 	= 0;
		$dS_targetAccount->defaultCssAppPattern 	= 0;
		$dS_targetAccount->defaultCssAppTag 		= '';
		
		$dS_targetAccount->defaultCssEventColor 	= 0;
		$dS_targetAccount->defaultCssEventPattern = 0;
		$dS_targetAccount->defaultCssEventTag 	= '';
		
		$dS_targetAccount->defaultCssFcalColor 	= 0;
		$dS_targetAccount->defaultCssFcalPattern 	= 0;
		$dS_targetAccount->defaultCssFcalTag 		= '';
		
		$dS_targetAccount->defaultCssVisitorColor 	= 0;
		$dS_targetAccount->defaultCssVisitorPattern 	= 0;
		$dS_targetAccount->defaultCssVisitorTag 		= '';
	}
	
	$xvisitors = false; // no copy of visitors
	if($visitors) {	// copy visitors, retrieve $xvisitors[]
	
		echo $pad.'copying visitors'.$nl;
	
		if($visicopymode) { // select only visitors that ever were appointed on the selected resources
			
			$sql_inclusive_archive = 'select distinct vid as id from (

							select distinct archive_att_visitors.resourceId as vid from archive_att_visitors where archive_att_visitors.groupId in 
							(select distinct resaid from 
									(select archive_attendees.groupId as resaid, archive_attendees.resourceId 
											from archive_attendees where archive_attendees.resourceId in ('.$coma_rscids.')
									) as arch_resas )
						UNION
							select distinct att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
							(select distinct resaid from 
									(select attendees.groupId as resaid, attendees.resourceId
											from attendees where attendees.resourceId in ('.$coma_rscids.')
									) as crr_resas ) 
								
						) as vids;';
						
			$sql_current_only = 'select distinct vid as id from (

							select distinct att_visitors.resourceId as vid from att_visitors where att_visitors.groupId in 
							(select distinct resaid from 
									(select attendees.groupId as resaid, attendees.resourceId
											from attendees where attendees.resourceId in ('.$coma_rscids.')
									) as crr_resas )
								
						) as vids;';
			
			$q = new Q($include_arch?$sql_inclusive_archive:$sql_current_only);
			
		}
		else { // select all visitors from the register
			$q = new Q('SELECT id FROM visitors WHERE groupId = '.$aid.';');
		}
		$vc = $q->cnt();
		$perfReport->peak('::visitors ids query complete ('.$vc.' ids)');
		
		$vids = $q->ids(list_as_array); unset($q); // is an array of ids
		$xvisitors = Array(); // xvisitors[originating visitor id] = destination visitor id
		$dSvisis = Array(); // xvisitors[originating visitor id] = destination visitor id
		foreach($vids as $vid) {
			$dS = new C_dS_visitor($vid);
			if($dS->deletorId) continue; // this one was ever merged, skip it
			if($colors) { // re-linking with new colors
				$dS->cssColor = $xccss[$dS->cssColor]; 
				$dS->cssPattern = $xccss[$dS->cssPattern];
				if($dS->cssTags) $dS->cssTags = xlinkstring($dS->cssTags,$xccss);
			}
			else { $dS->cssColor = 0; $dS->cssPattern = 0; $dS->cssTags = 0; }
			
			$dSvisis[] = $dS;
		}
			$vc = count($dSvisis);
		$perfReport->peak('::visitors processing complete ('.$vc.' dSs)');
		
		foreach($dSvisis as $dSv) { // we keep this here because we want to measure the processing time of saving to DB compared with provessing time of loading and re-linking
			$vid = $dSv->id;
			$dSv->id = 0; $dSv->dSsave($targetAccId); // forces copy
			$xvisitors[$vid] = $dSv->id; // retrieves new id, link it to old id so we can further re-link any object that refers to this visitor
		}
		unset($dSvisis);
			$vc = count($xvisitors);
		$perfReport->peak('::visitors saving to DB complete ('.$vc.' dSs)');	
	}	
	
	if($comms) {	// copy communication templates
		echo $pad.'copying communication templates'.$nl;
	
		$smsT = new C_dbAccess_smsTemplates($aid); 	$emlT = new C_dbAccess_emailTemplates($aid);
		$smsT->copySave($targetAccId); 				$emlT->copySave($targetAccId);
	}

	$xtbxings = false;
	if($timeboxing) {
		
		echo $pad.'copying time boxing'.$nl;

		$tbxings = new C_dbAccess_tboxings($aid);
		$xtbxings = Array();
		foreach($tbxings->keyed as $tbxId => $dS_tbxing) {
			$dS_tbxing->id = 0; $dS_tbxing->save($targetAccId);
			$xtbxings[$tbxId] = $dS_tbxing->id; // array key is the old id, array value is the new id
		}
		
		$perfReport->peak('::timeboxing processing complete');	

	}
	
	$xhourlies = false;
	if($hourlies) {	// copy current hourly, for each agenda

		echo $pad.'copying hourlies'.$nl;

		// copy the hourlies collection, inclusive shadows, timeboxings and 
		$hrlies = new C_dbAccess_hourlies($aid);
		$xhourlies = Array();
		foreach($hrlies->keyed as $hid => $dS_hourly) {
			$dS_hourly->id = 0; $dS_hourly->save($targetAccId);
			$xhourlies[$hid] = $dS_hourly->id; // array key is the old id, array value is the new id
			$shads = new C_dbAccess_shadows($hid); $shads->copySave($dS_hourly->id);
			if($timeboxing) { // note that time boxing can not be reproduced in hourlies if the copier didn't include timeboxing copying
				$tboxs = new C_dbAccess_timeboxes($hid);
				foreach($tboxs->keyed as $tbxsId => $dS_tbx) $dS_tbx->timeboxingId = $xtbxings[$dS_tbx->timeboxingId];
				$tboxs->copySave($dS_hourly->id);
			}
		}
		
		$perfReport->peak('::hourlies processing complete');	
		
	}
	
	$xguidelines = false; // xguidelines[originating guideline id] = destination guideline id
	if($guidelines) {
		$q = new Q('select guideId as id from resources where guideId <> 0 and resources.id in ('.$coma_rscids.');');
		$guidesid = $q->ids(list_as_array);
		if(count($guidesid)) {
			foreach($guidesid as $ori_guideId) { // copy scope guidelines to the new /or target account
				$dS_g = new C_dS_guidelines($ori_guideId);
				$dS_g->id = 0;
				$dS_g->save($targetAccId);
				$dest_guideId = $dS_g->id;
				$xguidelines[$ori_guideId] = $dest_guideId; 
			}
		}
		
	}
	
	$xresources = false; // xresources[originating rsc id] = destination rsc id
	if($agendas) {	// copy/move agendas
	
		// where resource ids are referenced
		// - attendees
		// - workexperts
		// - web pages login views and view order list (accesskeys)
		// - 

		
		if($rscmove) echo $pad.'moving agendas'.$nl; 
			else $pad.'copying agendas'.$nl;

	
		$xresources = Array(); // FROM HERE DOWNWARDS: $scope_rscs CONTAINS THE DESTINATING RESOURCES
		// 
		foreach($scope_rscs->keyed as $rscId => $dS_r) { // scans the resources under scope
			if($rsccopy) $dS_r->id = 0; // cause a copy
			
			if($xguidelines) {
				$dS_r->guideId = $xguidelines[$dS_r->guideId]; // links to the copied guideline
				// Lors d'un SPLIT de Rhode Odontalia:
				// PHP Notice:  Undefined offset: 0 in /var/www/2023-11-16_18:55:42_mobminder_baseline/htdocs/post/account.php on line 366, referer: https://be.mobminder.com/
				// PHP Notice:  Undefined offset: 6614 in /var/www/2023-11-16_18:55:42_mobminder_baseline/htdocs/post/account.php on line 379, referer: https://be.mobminder.com/

			} else $dS_r->guideId = 0;
			$dS_r->save($targetAccId);
			$xresources[$rscId] = $dS_r->id; // xresources[originating rsc id] = destination rsc id
			
		}
		
		// re-install hourlies usage for each resource
		if($xhourlies) {
			foreach($xresources as $oRscId => $nRscId) {
				$husers = new C_dbAccess_hourliesusers($oRscId);
				foreach($husers->keyed as $husrId => $dS_husr) 
					if($dS_husr->hourlyId == 0) $dS_husr->hourlyId = 0; // hourly changes to "no hourly", that has obviously no corresponding defined hourly
					else $dS_husr->hourlyId = $xhourlies[$dS_husr->hourlyId];
				$husers->copySave($nRscId);
			}
		}
		
		
		// fix the view on all resources (especially important when an existing accesskey is re-used (*eak*) )
		if($dS_copierkey->bCals || $dS_copierkey->uCals || $dS_copierkey->fCals) {
			$resc_bytype = Array(); $resc_bytype[class_bCal] = Array(); $resc_bytype[class_uCal] = Array(); $resc_bytype[class_fCal] = Array();
			foreach($scope_rscs->keyed as $rscId => $dS_r) {
				$resc_bytype[$dS_r->resourceType][] = $dS_r->id; // use the destination resource id in the copier view
			}
			// now if any view order was defined, add the new resources to the view of the copier access key
			if($dS_copierkey->bCals) if(count($resc_bytype[class_bCal])) $dS_copierkey->bCals = $dS_copierkey->bCals.'!'.implode('!',$resc_bytype[class_bCal]);
			if($dS_copierkey->uCals) if(count($resc_bytype[class_uCal])) $dS_copierkey->uCals = $dS_copierkey->uCals.'!'.implode('!',$resc_bytype[class_uCal]);
			if($dS_copierkey->fCals) if(count($resc_bytype[class_fCal])) $dS_copierkey->fCals = $dS_copierkey->fCals.'!'.implode('!',$resc_bytype[class_fCal]);
			$dS_copierkey->save();
		}
		
		$perfReport->peak('::agendas processing complete');	
	}
	
	$xworkcodes = false;
	if($workcodes) { // copy workcodes (copying workcodes while not having copied resources makes no sense)
		
		echo $pad.'copying workcodes'.$nl;
		
		// prepare a set of experts that covers all resources
		$allwkxp = new C_dbAccess_workexperts(); // is a set of workexperts that implies all account resources, we use it for orphan workcodes
		foreach($xresources as $ori_rscid => $dest_rscid) {
			$dS_wkex = $allwkxp->newVirtual();
			$dS_wkex->resourceId = $dest_rscid;
		}
		
		
		$xworkcodes = Array();
		$wrkcds = new C_dbAccess_workcodes($aid);
		foreach($wrkcds->keyed as $wkid => $dS_wrkcd) {
			if($colors) { // then cross ref the new colors
				$dS_wrkcd->cssColor = $xccss[$dS_wrkcd->cssColor];
				$dS_wrkcd->cssPattern = $xccss[$dS_wrkcd->cssPattern];
			} else { // remove ccss references from the workcodes 
				$dS_wrkcd->cssColor = 0;
				$dS_wrkcd->cssPattern = 0;
			}
			$dS_wrkcd->id = 0; 
			$dS_wrkcd->dSsave($targetAccId); // note that you can not copy workexperts if you don't copy resources
			$xworkcodes[$wkid] = $dS_wrkcd->id; 


			if($agendas) {
				$wexprts = new C_dbAccess_workexperts($wkid); // load the original set of workexperts, note that some are not welcome in the new account as only a subset of the resources are copied
				foreach($wexprts->keyed as $wkexId => $dS_wkx) 
					if(isset($xresources[$dS_wkx->resourceId])) $dS_wkx->resourceId = $xresources[$dS_wkx->resourceId];
					else $wexprts->remove($wkexId); // is not part of the selected resources scope
				
				if($wexprts->count()==0) { // in the new set of resources, this workcode has no expert left, still it might be used by some appointments where it was manually added
					// let's not leave a dS_workcode with no dS_workexpert, assign all account resources instead
					$allwkxp->copySave($dS_wrkcd->id);
				} else
					$wexprts->copySave($dS_wrkcd->id);
			} else { //assign no-one
				
			}
			if($timeboxing) {
				$wtboxgs = new C_dbAccess_worktboxing($wkid);
				foreach($wtboxgs->keyed as $tbxsId => $dS_tbx) $dS_tbx->timeboxingId = $xtbxings[$dS_tbx->timeboxingId];
				$wtboxgs->copySave($dS_wrkcd->id);
			}
		}
		
		$perfReport->peak('::xworkcodes processing complete');	

	}
	
		$xapps = false;
		$xseries = false;
	if($reservations&&$agendas) {	// copy reservations
		
		if($rscmove) echo $pad.'moving reservations'.$nl; 
			else echo $pad.'copying reservations'.$nl;

		// collect ids of reservations under scope 
		
			$sql_inclusive_archive = 'select distinct resaid as id from (

					select distinct resaid from 
							(select archive_attendees.groupId as resaid, archive_attendees.resourceId 
									from archive_attendees where archive_attendees.resourceId in ('.$coma_rscids.')
							) as arch_resas
				UNION
					select distinct resaid from 
							(select attendees.groupId as resaid, attendees.resourceId
									from attendees where attendees.resourceId in ('.$coma_rscids.')
							) as crr_resas
				) alias;';
				
				
			$sql_current_only = 'select resaid as id from (

					select distinct resaid from 
							(select attendees.groupId as resaid, attendees.resourceId
									from attendees where attendees.resourceId in ('.$coma_rscids.')
							) as crr_resas
				) alias;';
	
						
		$q = new Q($include_arch?$sql_inclusive_archive:$sql_current_only);
		
		
		
		// collect ids of series under scope (they must copy along with reservations)
		
			$ids_string = $q->ids(list_as_string);
				$sql_series_current = 'select distinct serieId as id from reservations where groupId = '.$aid.' and serieId <> 0 and id in ('.$ids_string.');';
				$sql_series_incl_archives = 'select distinct serieId as id from (
						select distinct serieId from reservations where groupId = '.$aid.' and serieId <> 0 and id in ('.$ids_string.')
						UNION
						select distinct serieId from archive_reservations where groupId = '.$aid.' and serieId <> 0 and id in ('.$ids_string.')
					) alias;';
		$s = new Q($include_arch?$sql_series_incl_archives:$sql_series_current);
		

		$appsIds = $q->ids(list_as_array); unset($q); // is an array of ids
		$serieIds = $s->ids(list_as_array); unset($s); // is an array of ids
		
		$xseries = Array();
		foreach($serieIds as $serid) { // each loop run owns a unique dS_serie
			$dS = new C_dS_resa_serie($serid); // loads the existing dS_serie
			// $arch = ''; if($dS->archived) $arch = 'archive_'; // PVH 2021: No archive table yet existing for series
			
			$deleted = $dS->deletorId; 
			if($rscmove) { $dS->dSsaveAsNew($targetAccId); } // resets tracking data and attach this item to the new account
				else { $dS->id = 0; /*$dS->archived = 0;*/ $dS->save($targetAccId); } // inserts a new item in DB // archived see (*dbio01*)
			if($deleted) $dS->dSobsolete();
			
			$xseries[$serid] = $dS->id; // new items are created in the target context and are cross linkable through $xseries
			// echo '               '.$serid.' / '.$dS->id.$nl;
		}
		
		
		$xapps = Array();
		foreach($appsIds as $appid) { // each loop run treats a unique dS_reservation
			
			// C_dS_reservation - groups to an account
			//
			$dS = new C_dS_reservation($appid); // loads the existing reservation
			$arch = ''; if($dS->archived) $arch = 'archive_';
			if($colors) { 
				if(isset($xccss[$dS->cssColor])) $dS->cssColor = $xccss[$dS->cssColor]; else $dS->cssColor = 0;
				if(isset($xccss[$dS->cssPattern])) $dS->cssPattern = $xccss[$dS->cssPattern];  else $dS->cssPattern = 0;
				if($dS->cssTags) $dS->cssTags = xlinkstring($dS->cssTags,$xccss);
			}
			else { 
				$dS->cssColor = 0; $dS->cssPattern = 0; $dS->cssTags = '';
			}
			$deleted = $dS->deletorId; 
			
			if($dS->serieId) {
				if(isset($xseries[$dS->serieId])) {
					// echo '               '.$dS->serieId.' = '.$xseries[$dS->serieId].$nl;
					$dS->serieId = $xseries[$dS->serieId];
				}
				else $dS->serieId = 0;
			}
				
			
			if($rscmove) { $dS->dSsaveAsNew($targetAccId); } // resets tracking data and attach this item to the new account
				else { $dS->id = 0; $dS->archived = 0; $dS->save($targetAccId); } // inserts a new item in DB // archived see (*dbio01*)
			if($deleted) $dS->dSobsolete();
			 
			$xapps[$appid] = $rid = $dS->id;
			
			// C_dS_attendee - groups to a reservation, points to resourceId
			//
			if($rscmove) {
				// if resources have been moved, there is no change in the resourceId nor groupId in dS_attendee
			} else { 
				$attendees = new C_dbAccess_attendees($arch); $attendees->loadOnGroup($appid);
				foreach($attendees->keyed as $attId => $dS_att) {
					if(isset($xresources[$dS_att->resourceId])) $dS_att->resourceId = $xresources[$dS_att->resourceId];
					else $attendees->remove($attId); // is not part of the selected resources set
					$dS_att->archived = 0; // see (*dbio01*), we do not want re-insertion in archive table
				}
				
				$attendees->copySave($rid); // makes a copy for each element, grouping to $dS->id ()
			}
				
			// C_dS_visitor - groups to a reservation, points to resourceId, only resourceId changes as we copy visitors in both moving or copying resources cases
			//
			if($visitors) {
				$vattendees = new C_dbAccess_att_visitors($arch); $vattendees->loadOnGroup($appid);
				foreach($vattendees->keyed as $vattId => $dS_vatt) {
					if(isset($xvisitors[$dS_vatt->resourceId])) $dS_vatt->resourceId = $xvisitors[$dS_vatt->resourceId];
					else $vattendees->remove($vattId); // is not part of the selected visitors set (visitor was merged)
					$dS_vatt->archived = 0; // see (*dbio01*)
				}
				if($rscmove) $vattendees->saveAll(); // saves new resourceId (groupId actually does not change)
					else $vattendees->copySave($rid); // keeps a copy in the originating account
			}
				
			// C_dS_performance - groups to a reservation, links to a workcode and a visitor
			//
			if($workcodes) {
				$perfs = new C_dbAccess_performances($arch,$appid); // pvh 2025-01 (parameters switched)
				foreach($perfs->keyed as $pId => $dS_perf) {
					if($dS_perf->visitorId)
						if(isset($xvisitors[$dS_perf->visitorId])) $dS_perf->visitorId = $xvisitors[$dS_perf->visitorId];
						else $dS_perf->visitorId = 0;
					if(isset($xworkcodes[$dS_perf->workCodeId]))
						$dS_perf->workCodeId = $xworkcodes[$dS_perf->workCodeId];
					else $perfs->remove($pId); // should never happen, but when testing, we found in an older manually split account (ILES D'OR) some references to workcodes originally defined and owned by the originating account
					$dS_perf->archived = 0; // see (*dbio01*)
				}
				if($rscmove) $perfs->saveAll(); // saves new resourceId (groupId actually does not change)
					else $perfs->copySave($rid); // keeps a copy in the originating account
			}
			
		}
			$ac = count($xapps);
		$perfReport->peak('::reservations processing complete, '.$ac.' reservations processed.');	

	}
	
	
	if($rscmove) { // To be finished
		// remove any workexpert in the originating account as the resources have moved
		// $q = new Q('delete from hourliesusers where groupId in ('.$coma_rscids.');'); // 
		$q = new Q('delete from workexperts join workcodes on workexperts.groupId = workcodes.id where workcodes.groupId = '.$aid.' and resourceId in ('.$coma_rscids.');');
		foreach($rscids as $rscid) {
			$q = new Q('select id from accesskeys where accountId = '.$aid.' and (
							watchover like "%'.$rscid.'%"
						or	    bCals like "%'.$rscid.'%"
						or	    uCals like "%'.$rscid.'%"
						or	    fCals like "%'.$rscid.'%" );');
			if($q->ids())
				foreach($q->ids(list_as_array) as $akid) {
					$dS_acckey = new C_dS_accesskey($akid);
					$dS_acckey->cleanView($rscid);
					$dS_acckey->save($rscid);
				}
		}
		$perfReport->peak('::clean up originating account from references to scoped resources');	
	}
	
	
	echo $pad.'making credentials for selected logins'.$nl;
	
	// create more keys for selected logins
	if(count($acckeys4)) {	// build new keys to connect selected logins
		foreach($acckeys4 as $lid) {
			if($lid==$loginId) continue; // this one is already managed above in this script, see (*eak*)
			$q = new Q('select (case when accessLevel < 5 then 0 else 1 end) as boolean from logins where id = '.$lid.';');
			if(!$q->b()) { echo ' - acckeys4 improper level for lid '.$lid.$nl; continue; } // no treatment for sync or webpage logins (never a multi-accesskeys for those login types)
			echo $nl.$pad.$pad.'checking accesskey for '.$lid;
			$q = new Q('select id from accesskeys where groupId = '.$lid.' and accountid = '.$targetAccId.';'); // check if the requesting account already has access to the target account
			if(!$q->ids()) { // only for logins having no access yet to this account (we don't want duplicate access keys pointing to the same account)
				$dS_acckey = new C_dS_accesskey();
				$dS_acckey->accountId = $targetAccId;
				$dS_acckey->dSsave($lid); // access keys group to a login
				echo ' - created accesskey ('.$dS_acckey->id.') for login '.$lid;
			} else {
				echo ' - acckeys4 has already a key to this account, lid = '.$lid.$nl;
			}
		}
	}

	$perfReport->peak('::access keys creation complete');	
	
	echo $nl;
	echo $nl;
	echo '<code>';
	echo '#C_dS_accesskey#logged'.$nl.$dS_copierkey->stream(with_tracking).$nl;
	echo '</code>';

	
}
else 
{  //  Else : Regular post for an already existing account

	$dS_account_aswas = new C_dS_group($aid); // keeps a copy of previous settings, so we can compare
	
	$dS_account = new C_dS_group($aid, false, $_POST); // saves all posted parameters
	$dS_account->cfgversion++;
	$dS_account->dSsave();
	
	// granting access keys
	$granting = $_POST['granted']=='-' ? Array() : explode('!', $_POST['granted']); // an array of login ids in any case
	$disallow = $_POST['disallowed']=='-' ? Array() : explode('!', $_POST['disallowed']); // an array of login ids
	
	if(count($granting)) {
		foreach($granting as $lid) {
			$dS_accesskey = new C_dS_accesskey(0, $lid);
			$dS_accesskey->accountId = $aid;
			$dS_accesskey->dSsave();
		}
	}
	
	// removing of access keys
	$autoremove = false;
	$cdislw = count($disallow);
	if($cdislw) {
		// this is where some logins get their access creds removed for the current account
		
		echo $nl.$cdislw.' logins get their credentials removed for this account:'.$nl;
		foreach($disallow as $lid) {
			
			$dS_login = new C_dS_login($lid);
			echo $nl.'- '.$dS_login->lastname.' '.$dS_login->firstname.' ('.$dS_login->id.') :';
			
			// catch the login's key to the presently saved account
			$Q = new Q('SELECT id FROM accesskeys WHERE accountID = '.$aid.' AND groupId = '.$lid.';');
			$kids = $Q->ids(list_as_array); $okid = $kids[0]; // there should be only one key for a given account and for a login
			
			if(!is_numeric($okid)) continue; // okid goes for obsolete key id
			
			$o_dbAccess_details = new C_dbAccess_details($okid);
			echo $nl.$tab.'deleting display details: '.$o_dbAccess_details->stream().$nl;
			$o_dbAccess_details->deleteAll();
			
			$o_dbAccess_catalysts = new C_dbAccess_catalysts($okid);
			echo $tab.'deleting catalysts: '.$o_dbAccess_catalysts->stream().$nl;
			$o_dbAccess_catalysts->deleteAll();
			
			$dS_accesskey = new C_dS_accesskey($okid); //load this obsolete key
			echo $tab.'deleting access key: '.$dS_accesskey->stream1().$nl;
			$dS_accesskey->dSdelete();
			
			// quit any chat where this login was participants
			$q = new Q('update chat_participants inner join chat_threads on chat_threads.id = chat_participants.groupId
				set cueOut = '.time().'
				where chat_participants.loginId = '.$lid.' and chat_participants.cueOut = 0 and chat_threads.groupId in ('.$aid.');');
			echo $nl.$tab.'quitting chat threads: '.$q->hits().' chats were quit'.$nl;
						
			if($lid==$loginId) $autoremove = true;
		}
		echo $nl;
	}
	
	if($autoremove) // indicates that the current login removes its own key to the logged account
		echo '##key removed##'.$nl; // feedback to client side that will force reconnection to the login next key
	else 
		echo '##key still valid##'.$nl;
	
	echo '<code>';
	echo '#C_dS_group'.$nl.$dS_account->stream(with_tracking).$nl;
	echo '</code>';
	
	
	/////////////////////////////////////////////////////////////////////////////////////////
	//
	// let's fix now hourlies (in case rangeIn and rangeOut have impact on shadows)
	//
	// Case A: the work range shrinks
	//
	$rin_prev = $dS_account_aswas->rangeIn; // number of seconds, first slice drawn on a display planning 
	$rout_prev = $dS_account_aswas->rangeOut; // number of seconds, last slice drawn on a display planning 
	$rin_new = $dS_account->rangeIn; // number of seconds, first slice drawn on a display planning 
	$rout_new = $dS_account->rangeOut; // number of seconds, last slice drawn on a display planning 
	
	if($rin_prev!=$rin_new || $rout_prev!=$rout_new) {
	// So we dive in here only if the hours display range was just changed.
	
echo $nl.$nl.'### Smoothing hourlies ###'.$nl.$nl;

if($rin_prev!=0 && $rin_prev<$rin_new) { // Case A.1 : shrinks by rangeIn coming later
	
	echo $nl.$nl.'  -> shrinks by rangeIn coming later'.$nl.$nl;
	
	// if the new rangeIn setting makes the day shorter, we reset the 0 -> rangeIn shadows so to stick to the new setting (that removes all other shadows and timebox in that day code, unless it was a day off)
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) {
		$q = new Q('select id, dayCode from shadows where groupId = '.$hid.' and cueIn = 0 and cueOut < '.$rin_new.' and exceptional <> '.shadow_offday.'; -- webapp/post/account.php');// off days have exceptional == 5
		$sids = $q->idx('id','dayCode'); // items to be adapted
		if(count($sids)) foreach($sids as $sid => $daycode) {
			// remove timeboxing
			$q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$daycode.' and cueIn < '.$rin_new.';'); // removes only those items that are in the way
			
			// remove regular shadows (the ones having no 0 - 86400 values for cueIn or cueOut
			$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$daycode.' and cueIn <> 0 and cueOut <> 86400 and cueIn < '.$rin_new.' and exceptional <> '.shadow_offday.';'); // keeps early and latest shadows
			
			// update the rangeIn value in that early shadow
			$q = new Q('update shadows set cueOut = '.$rin_new.' where groupId = '.$hid.' and dayCode = '.$daycode.' and cueIn = 0 and exceptional <> '.shadow_offday.';'); // off days have exceptional == 5
		}
	}
} // Case A.1 ends here


if($rout_prev!=86400 && $rout_prev>$rout_new) { // Case A.2 : shrinks by rangeOut coming sooner
	
	echo $nl.$nl.'  -> shrinks by rangeOut coming sooner'.$nl.$nl;
	
	// if the new rangeOut setting makes the day shorter, we reset the rangeOut -> 86400 shadows so to stick to the new setting (that removes all other shadows and timebox in that day code, unless it was a day off)
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) {
		$q = new Q('select id, dayCode from shadows where groupId = '.$hid.' and cueOut = 86400 and cueIn > '.$rout_new.' and exceptional <> '.shadow_offday.'; -- webapp/post/account.php'); // off days have exceptional == 5
		$sids = $q->idx('id','dayCode'); // items to be adapted
		if(count($sids)) foreach($sids as $sid => $daycode) {
			// remove timeboxing
			$q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$daycode.' and cueOut > '.$rout_new.';'); // removes only those items that are in the way
			
			// remove regular shadows (the ones having no 0 - 86400 values for cueIn or cueOut
			$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$daycode.' and cueIn <> 0 and cueOut <> 86400 and cueOut > '.$rout_new.' and exceptional <> '.shadow_offday.';'); // keeps early and latest shadows
			
			// update the rangeIn value in that early shadow
			$q = new Q('update shadows set cueIn = '.$rout_new.' where groupId = '.$hid.' and dayCode = '.$daycode.' and cueOut = 86400 and exceptional <> '.shadow_offday.';');// off days have exceptional == 5
		}
	}		
} // Case A.2 ends here



// Case B: the work range starts now at midnight (and that is an actual change)
//
if($rin_new==0 && $rin_prev!=0) {
	
	echo $nl.$nl.'  -> the work rangeIn starts now at midnight'.$nl.$nl;
	
	// very easy in this case, all shadow_normal's disappear if they have cueIn = 0 and are not shadow_offday's
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) {
		$q = new Q('delete from shadows where groupId = '.$hid.' and cueIn = 0 and exceptional <> '.shadow_offday.';'); // removes all rangeIn related shadows, unless it is an offday
	}
	// timeboxing is not affected
} // Case B ends here



// Case C: the work range ends now at midnight (and that is an actual change)
//
if($rout_new==86400 && $rout_prev!=86400) {
	
	echo $nl.$nl.'  -> the work rangeOut ends now at midnight'.$nl.$nl;
	
	// very easy in this case, all shadow_normal's disappear if they have cueOut = 86400 and are not shadow_offday's
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) {
		$q = new Q('delete from shadows where groupId = '.$hid.' and cueOut = 86400 and exceptional <> '.shadow_offday.';'); // removes all rangeOut related shadows, unless it is an offday
	}
	// timeboxing is not affected
} // Case C ends here




// Case D: the work range starts now AFTER midnight (and that is an actual change from starting at midnight)
//
function setupEarlyShadow($hid,$dc,$rin_new) {
	$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn < '.$rin_new.' and exceptional <> '.shadow_offday.';'); // removes what lies in the way
	$q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn < '.$rin_new.';'); // removes timboxes in the way
	$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn = 0;'); // removes existing early shadows
	$shadow = new C_dS_shadow(0,$hid);
	$shadow->dayCode = $dc;
	$shadow->cueIn = 0;
	$shadow->cueOut = $rin_new;
	$shadow->dSsave();
	global $nl; echo '    - saved early shadow with cueIn = 0 and cueOut = '.$rin_new.' for daycode '.$dc.$nl;
}
if($rin_prev==0 && $rin_new!=0) {
	
	echo $nl.$nl.'  -> the work range starts now AFTER midnight (and that is an actual change from starting at midnight)'.$nl.$nl;
	
	// we need to build for each daycode an early shadow
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) { // starts looping on account hourlies
		
		$hourly = new C_dS_hourly($hid);
		$p = $hourly->periodicity;
		$stop = (7*$p)+1;
		if($p) { // rotating by week multiple
			for($dc=1;$dc<$stop;$dc++) { // proceed for each days in the hourly
				$q = new Q('select id from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and exceptional = '.shadow_offday.';');
				if($q->ids(list_as_string)) { // there is an off day here. 
					// do nothing
					echo '    - did nothing for daycode '.$dc.$nl;
				}
				else { // set up an early shadow
					// $q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn < '.$rin_new.' and exceptional <> '.shadow_offday.';');
					// $q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn < '.$rin_new.';');
					// $q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueIn = 0;');
					// $shadow = new C_dS_shadow(0,$hid);
					// $shadow->dayCode = $dc;
					// $shadow->cueIn = 0;
					// $shadow->cueOut = $rin_new;
					// $shadow->dSsave();
					// echo '    - saved shadow with cueIn = 0 and cueOut = '.$rin_new.' for daycode '.$dc.$nl;
					setupEarlyShadow($hid,$dc,$rin_new);
				}
			}
		} else { // it is a single day exceptionnal hourly
		
			$q = new Q('select id from hourliesusers where hourlyId = '.$hid.' limit 1;'); // find the parent hourly users so we know the exact date
			$huser = new C_dS_hourlyuser($q->ids(list_as_string));
			$dc = $huser->getdaycode($hourly);
			setupEarlyShadow($hid,$dc,$rin_new);
		}
		// looping on account hourlies
	}
} // Case D ends here



// Case E: the work range ends now BEFORE midnight (and that is an actual change from ending at midnight)
//
function setupLateShadow($hid,$dc,$rout_new) {
	$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut > '.$rout_new.' and exceptional <> '.shadow_offday.';');
	$q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut > '.$rout_new.';');
	$q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut = 86400;');
	$shadow = new C_dS_shadow(0,$hid);
	$shadow->dayCode = $dc;
	$shadow->cueIn = $rout_new;
	$shadow->cueOut = 86400;
	$shadow->dSsave();
	global $nl; echo '    - saved late shadow with cueIn = '.$rout_new.' and cueOut = 86400'.' for daycode '.$dc.$nl;
}	
if($rout_prev==86400 && $rout_new!=86400) {
	
	echo $nl.$nl.'  -> the work range ends now BEFORE midnight (and that is an actual change from ending at midnight)'.$nl.$nl;
	
	// we need to build for each daycode a late shadow
	$q = new Q('select id from hourlies where groupId = '.$aid.';');
	$hids = $q->ids(list_as_array); // all hourlies
	if(count($hids)) foreach($hids as $hid) { // starts looping on account hourlies
	
		$hourly = new C_dS_hourly($hid);
		$p = $hourly->periodicity;
		$stop = (7*$p)+1;
		if($p) { // rotating by week multiple
			for($dc=1;$dc<$stop;$dc++) { // proceed for each days in the hourly
				$q = new Q('select id from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and exceptional = '.shadow_offday.';');
				if($q->ids(list_as_string)) { // there is an off day here. 
					// do nothing
					echo '    - did nothing for daycode '.$dc.$nl;
				} 
				else{ // set up a late shadow
					// $q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut > '.$rout_new.' and exceptional <> '.shadow_offday.';');
					// $q = new Q('delete from timeboxes where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut > '.$rout_new.';');
					// $q = new Q('delete from shadows where groupId = '.$hid.' and dayCode = '.$dc.' and cueOut = 86400;');
					// $shadow = new C_dS_shadow(0,$hid);
					// $shadow->dayCode = $dc;
					// $shadow->cueIn = $rout_new;
					// $shadow->cueOut = 86400;
					// $shadow->dSsave();
					// echo '    - saved shadow with cueIn = '.$rout_new.' and cueOut = 86400'.' for daycode '.$dc.$nl;
					setupLateShadow($hid,$dc,$rout_new);
				}
			}
		} else { // it is a single day exceptionnal hourly (they have periodicity = 0)
		
			$q = new Q('select id from hourliesusers where hourlyId = '.$hid.' limit 1;'); // find the parent hourly users so we know the exact date
			$huser = new C_dS_hourlyuser($q->ids(list_as_string));
			$dc = $huser->getdaycode($hourly);
			setupLateShadow($hid,$dc,$rout_new);
		}
		// looping on account hourlies
	}
	
} // Case E ends here


	} // let's fix now hourlies, ends here
	
	
} //  Else : Regular post




$perfReport->peak('::completed');
$perfReport->dropReport();
C_dS_connection::poke($perfReport, 'p_account');
closeconnection(); // (*cc) escapes from Apache2 KEEP_ALIVE
?>