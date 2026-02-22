
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOT the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// � All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// � Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


//////////////////////////////////////////////////////////////////////////////// 
//
//  H T M L   I N L I N E   S T R E A M I N G      R E A D E R
//

function C_inlineStreaming() {}
C_inlineStreaming.classes = function(classname) {
	let C_dS;
	switch(classname) {
		// plitems
		case 'C_dS_note_detail'		: C_dS = C_dS_note_detail; break;
		//case 'C_dS_note_addressee'	: C_dS = C_dS_note_addressee; break;
		//case 'C_dS_note_visiref'	: C_dS = C_dS_note_visiref; break;
		case 'C_dS_task_description': C_dS = C_dS_task_description; break;
		case 'C_dS_task_assignee'	: C_dS = C_dS_task_assignee; break;
		case 'C_dS_task_visiref'	: C_dS = C_dS_task_visiref; break;
		case 'C_dS_attendee'		: C_dS = C_dS_attendee; break;
		case 'C_dS_att_visitor'		: C_dS = C_dS_att_visitor; break;
		case 'C_dS_resapart'		: C_dS = C_dS_resapart; break;
		case 'C_dS_resa_serie'		: C_dS = C_dS_resa_serie; break;
		case 'C_dS_performance'		: C_dS = C_dS_performance; break;
		case 'C_dS_payment'			: C_dS = C_dS_payment; break;
		case 'C_dS_reservation'		: C_dS = C_dS_reservation; break;
		case 'C_dS_prebooking'		: C_dS = C_dS_prebooking; break;
		
		// chat
		case 'C_dS_chat_thread'		: C_dS = C_dS_chat_thread; break;
		case 'C_dS_chat_participant': C_dS = C_dS_chat_participant; break;
		case 'C_dS_chat_phylactery'	: C_dS = C_dS_chat_phylactery; break;
		case 'C_dS_chat_visiref'	: C_dS = C_dS_chat_visiref; break;
		
		// surfer
		case 'C_dS_details'		: C_dS = C_dS_details; break;
		case 'C_dS_accesskey'	: C_dS = C_dS_accesskey; break;
		case 'C_dS_login'		: C_dS = C_dS_login; break;
		case 'C_dS_connection'	: C_dS = C_dS_connection; break;
		//case 'C_dS_catalyst'	: C_dS = C_dS_catalyst; break;
		
		// config
		case 'C_dS_contract'	: C_dS = C_dS_contract; break;
		case 'C_dS_customCss'	: C_dS = C_dS_customCss; break;
		case 'C_dS_workexpert'	: C_dS = C_dS_workexpert; break;
		case 'C_dS_worktboxing'	: C_dS = C_dS_worktboxing; break;
		case 'C_dS_workcode'	: C_dS = C_dS_workcode; break;
		case 'C_dS_checklist'	: C_dS = C_dS_checklist; break;
		case 'C_dS_shadow'		: C_dS = C_dS_shadow; break;
		case 'C_dS_hourly'		: C_dS = C_dS_hourly; break;
		case 'C_dS_hourlyuser'	: C_dS = C_dS_hourlyuser; break;
		case 'C_dS_timeboxing'	: C_dS = C_dS_timeboxing; break;
		case 'C_dS_timebox'		: C_dS = C_dS_timebox; break;
		case 'C_dS_resource'	: C_dS = C_dS_resource; break;
		case 'C_dS_guidelines'	: C_dS = C_dS_guidelines; break;
		case 'C_dS_group'		: C_dS = C_dS_group; break;
		case 'C_dS_context'		: C_dS = C_dS_context; break;
		
		// communication
		case 'C_dS_notifTemplate'		: C_dS = C_dS_notifTemplate; break;
		case 'C_dS_emailTemplate'		: C_dS = C_dS_emailTemplate; break;
		case 'C_dS_smsTemplate'			: C_dS = C_dS_smsTemplate; break;
		case 'C_dS_cToggle'				: C_dS = C_dS_cToggle; break;
		case 'C_dS_email'				: C_dS = C_dS_email; break;
		case 'C_dS_sms'					: C_dS = C_dS_sms; break;
		
		// visitors
		case 'C_dS_visitor'				: C_dS = C_dS_visitor; break;
		case 'C_dS_visitorPreferences'	: C_dS = C_dS_visitorPreferences; break; // search
		case 'C_dS_visitorAlpha'		: C_dS = C_dS_visitorAlpha; break;	// alphatabs
		case 'C_dS_file'				: C_dS = C_dS_file; break;
		case 'C_dS_logo'				: C_dS = C_dS_logo; break;
		
		// statistics
		//case 'C_dS_xmon_action'			: C_dS = C_dS_xmon_action; break;
		//case 'C_dS_xmon_actual'			: C_dS = C_dS_xmon_actual; break;
		//case 'C_dS_xmon_account'		: C_dS = C_dS_xmon_account; break;
		//case 'C_dS_xmon_sms'			: C_dS = C_dS_xmon_sms; break;
		//case 'C_dS_xmon_ccss'			: C_dS = C_dS_xmon_ccss; break;
		//case 'C_dS_xmon_perfs'			: C_dS = C_dS_xmon_perfs; break;
		//case 'C_dS_smsCounters'			: C_dS = C_dS_smsCounters; break;
		
		// synchronization
		case 'C_dS_synchro_resource'	: C_dS = C_dS_synchro_resource; break;
		case 'C_dS_synchro_ccss'		: C_dS = C_dS_synchro_ccss; break;
		case 'C_dS_synchro_visitor'		: C_dS = C_dS_synchro_visitor; break;
		case 'C_dS_synchro_reservation'	: C_dS = C_dS_synchro_reservation; break;
	
		// miscellaneous & auto-completes
		case 'C_lastname'				: C_dS = C_lastname; break;
		
		default:
			warning('datasets.js', 'C_inlineStreaming', 'createDataSets', 'unexpected class? '+classname);
	}
	return C_dS;
}
C_inlineStreaming.createDataSets = function(stream) {
	
	let perf = measureStreaming?new microperf('entering createDataSets'):false;
	let newline = String.fromCharCode(10);
	let rushsplit = stream.split(newline);
	let objects = new Array();
	let line, classinfo, classname, olifant, instance, parameters, prevclassname = false, C_dS;
	
	while(line = rushsplit.shift()) { // extracts a section from the array
		if(line == '') continue;
		if(line[0] == '#') { // class name identification row
			if(perf) if(prevclassname) perf.cue('done with creation of '+prevclassname);
			let classinfo = line.substring(1).split('#');
			classname = classinfo[0]; 	// classname is supposed to head the lines bulk
			olifant = classinfo[1] || false; // classname is supposed to head the lines bulk
			if(!objects[classname]) objects[classname] = new Array();
			C_dS = C_inlineStreaming.classes(prevclassname = classname);
		} else { // continue in current section
			parameters = line.split('|');
			if(olifant) instance = new C_dS(olifant, parameters);
				else instance = new C_dS(parameters);
			objects[classname][instance.id] = instance;
		}
	}
	if(perf) if(prevclassname) perf.cue('done with creation of '+prevclassname);
	if(perf) perf.report('C_inlineStreaming::createDataSets()');
	return objects;
}



//////////////////////////////////////////////////////////////////////////////// 
//
//  D A T A    S E T      A C C E S S    L O G   /   T R A C K I N G
//

function C_dS_ID(id,groupId) {
	C_dS_ID.defaults.mergeto(this,arguments);
}
C_dS_ID.prototype = {
	display: function() {
		let tr 		= '<tr style="vertical-align:top;">';
		let tdLeft	= '<td style="text-align:right; padding-right:1em;" class="textcolor-light">';
		
		let creation= '', changing = '', deletion = '', archive = '';
		let blankline = '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>';
		
		let is = { 	accc: this instanceof C_dS_group,
					resa: this instanceof C_dS_reservation,
					visi: this instanceof C_dS_visitor,
					rsrc: this instanceof C_dS_resource,
					ccss: this instanceof C_dS_customCss,
					logn: this instanceof C_dS_login,
					chat: this instanceof C_dS_chat_thread }


			let xlo = { cap:true };
		if(this.id <= 0) {
			let creator = tr+tdLeft+C_XL.w('creator',xlo)+'</td><td>'+mobminder.context.surfer.name+'</td></tr>';
			let created = tr+tdLeft+C_XL.w('created on',xlo)+'</td><td>'+C_XL.w('now')+'</td></tr>';
			creation = created+creator;
			
		} else { // Existing object
		
			// Creation record
			let creator = tr+tdLeft+C_XL.w('creator',xlo)+'</td><td>'+this.creator+'</td></tr>';
			let created = humandate(this.created);
				created = tr+tdLeft+C_XL.w('created on',xlo)+'</td><td>'+created+'</td></tr>';
			creation = created+creator;
			
			// Edition record
			if(this.changerId !== undefined) {
				let changed = C_XL.w('never'), changer = C_XL.w('no one');
				if(this.changerId) { 
					changed = humandate(this.changed);
					changer = this.changer;
				}
				changer = tr+tdLeft+C_XL.w('changer',xlo)+'</td><td>'+changer+'</td></tr>';
				changed = tr+tdLeft+C_XL.w('changed on',xlo)+'</td><td>'+changed+'</td></tr>';
				changing = blankline+changed+changer;
			}
			
			// Deletion record
			if(this.deletorId !== undefined) 
			if(this.deletorId) {
				let deleted = C_XL.w('never'), deletor = C_XL.w('no one');
				if(this.deletorId) { 
					deleted = humandate(this.deleted);
					deletor = C_dS_loggable.getname(this.deletorId);
				}
				if(is.resa) {
						let r = this.rescheduled;
					deletor = tr+tdLeft+C_XL.w(r?'rescheduled by':'deletor',xlo)+'</td><td>'+deletor+'</td></tr>';
					deleted = tr+tdLeft+C_XL.w(r?'rescheduled on':'deleted on',xlo)+'</td><td>'+deleted+(r?' '+C_XL.w('to',{cap:0})+' ('+r+')':'')+'</td></tr>';
				} else if(is.visi) {
						let m = this.mergedTo;
					deleted = tr+tdLeft+C_XL.w('merged on',xlo)+'</td><td>'+deleted+'</td></tr>';
					deletor = tr+tdLeft+C_XL.w('merged by',xlo)+'</td><td>'+deletor+'</td></tr>';
					deletor+= tr+tdLeft+C_XL.w('merged',xlo)+' '+C_XL.w('with')+'</td><td>'+' id '+m+'</td></tr>';
				} else { // every other objects
					deletor = tr+tdLeft+C_XL.w('deletor',xlo)+'</td><td>'+deletor+'</td></tr>';
					deleted = tr+tdLeft+C_XL.w('deleted on',xlo)+'</td><td>'+deleted+'</td></tr>';
				}
				deletion = blankline+deleted+deletor;
			}
			
			// Archive record
			if(this.archtime !== undefined) {
				let archived = C_XL.w('never'), archivor = C_XL.w('no one');
				if(this.archivorId) { 
					archived = humandate(this.archtime);
					archivor = this.archivor;
				}
				archivor = tr+tdLeft+C_XL.w('archivor',xlo)+'</td><td>'+archivor+'</td></tr>';
				archived = tr+tdLeft+C_XL.w('archived on',xlo)+'</td><td>'+archived+'</td></tr>';
				archive = blankline+archived+archivor;
			}
		}
		
		let preinfo	= '', syncinfo = '', postinfo = '';
		
		// synchro information
		//
		let synclogins = C_dS_loggable.getbyAccLevel([aLevel.synchro]);
		if(is.resa || is.visi || is.rsrc || is.ccss) // do not display this for other objects
		for(let slid in synclogins) { // there may be multiple sync logins
			let slogin = synclogins[slid];
			let skey, skeyid = false, skeys = C_dS_accesskey.get('config', slogin.id); for(skeyid in skeys) { skey = skeys[skeyid]; break; } // synchro logins have only one key
			let remoteId = 'not synced';
			if(skeyid) { 
				let dS_synchro = false;
					if(is.resa) dS_synchro = C_dS_synchro_reservation.get(skeyid, this.id); 
					else if(is.visi) dS_synchro = C_dS_synchro_visitor.get(skeyid, this.id); 
					else if(is.rsrc) dS_synchro = C_dS_synchro_resource.get(skeyid, this.id); 
					else if(is.ccss) dS_synchro = C_dS_synchro_ccss.get(skeyid, this.id); 
				if(dS_synchro) remoteId = dS_synchro.remoteId;
			}
			syncinfo += tr+tdLeft+C_XL.w('synchro',xlo)+'</td><td>'+slogin.firstname+', remote id: '+remoteId+'</td></tr>';
		}
		
		// miscellaneous information
		//
		if(is.resa) {
			preinfo += tr+tdLeft+C_XL.w('data class',xlo)+'</td><td>resa '+resaclass.name(this.assess)+'</td></tr>';
			preinfo += tr+tdLeft+C_XL.w('booking code',xlo)+'</td><td>'+this.bookingcode+'</td></tr>';
			preinfo += tr+tdLeft+C_XL.w('version',xlo)+'</td><td>'+this.v+'</td></tr>';
		}
		if(is.logn) preinfo = tr+tdLeft+C_XL.w('last login',xlo)+'</td><td>'+this.lastLogin+'</td></tr>';
		
		if(is.accc) postinfo = tr+tdLeft+C_XL.w('version',xlo)+'</td><td>'+mobminder.account.cfgversion+'</td></tr>';
		
		if(is.chat) preinfo = tr+tdLeft+C_XL.w('version',xlo)+'</td><td>'+this.v+'</td></tr>';
		
		let id =  tr+tdLeft+C_XL.w('data id')+'</td><td>'+this.id+'</td></tr>';
			id = blankline+preinfo+id+syncinfo+postinfo;
		
		return '<table class="tracking">'+creation+changing+deletion+archive+id+'</table>';
	},
	tracking_ui_catalyst: function(member) {
		let none = { c:1, t:'', v:'', d:'-' };
		let t = '"';
		switch(member) {
			case 'created': 
			case 'changed': 		
			case 'deleted':
				if(this[member]=='0000-00-00 00:00:00' || this[member]=='0') return { c:1, t:'', v:{0:C_XL.w('never')} };
				else return { c:1, t:'', v:{0:this[member].substring(0,16)} };
			case 'deletor': case 'deletorId':
				let login = C_dS_loggable.get(this.deletorId);
				if(login) return { c:1, t:'', v:login.name }; 
					else if(this.deletorId) return { c:1, t:'', v:this.deletorId };
						else return none;
			default: 
				return { c:1, t:t, v:{0:this[member]} }; // in all other cases, display the genuine value
		}
	},
}
C_dS_ID.defaults = new A_df( { id:0, groupId:0 } );

function C_dS_trackingCC(id,groupId,created,creator,creatorId,changed,changer,changerId) {
		this.tmc = 8; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCC.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCC','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		
		this.tracking = C_dS_ID.prototype.display;
		this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingCC.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0 } );
C_dS_trackingCC.tnew = function(id, groupId) {
	let now = new Date(); now = now.getUnixTime();
	let surfer = mobminder.context.surfer.name;
	let sId = mobminder.context.surfer.id;
	let t = new C_dS_trackingCCD(id, groupId, now, surfer, sId, now, surfer, sId);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.changed, t.changer, t.changerId];
};

function C_dS_trackingCCD(id,groupId,created,creator,creatorId,changed,changer,changerId,deleted,deletorId) {
		
		this.tmc = 10; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCCD.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCCD','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		
		this.tracking = C_dS_ID.prototype.display;
		this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingCCD.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0, deleted:'', deletorId:0 } );
C_dS_trackingCCD.tnew = function(id, groupId) {
	let now = new Date(); now = now.getUnixTime();
	let surfer = mobminder.context.surfer.name;
	let sId = mobminder.context.surfer.id;
	let never = '0000-00-00 00:00:00';
	let t = new C_dS_trackingCCD(id, groupId, now, surfer, sId, now, surfer, sId, never, 0);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.changed, t.changer, t.changerId, t.deleted, t.deletorId];
};

function C_dS_trackingCCDA(id,groupId,created,creator,creatorId,changed,changer,changerId,deleted,deletor,deletorId,archtime,archivor,archivorId) {
		
		this.tmc = 14; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCCDA.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCCDA','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		
		this.tracking = C_dS_ID.prototype.display;
		this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingCCDA.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0, deleted:'', deletorId:0, archtime:0, archivor:'', archivorId:0 } );
C_dS_trackingCCDA.tnew = function(id, groupId) {
	let now = new Date(); now = now.getUnixTime();
	let surfer = mobminder.context.surfer.name;
	let sId = mobminder.context.surfer.id;
	let never = 0;
	let noid = 0;
	let t = new C_dS_trackingCCDA(id, groupId, 
			now, surfer, sId, /* creator */
			now, surfer, sId, /* changer */
			never, '', noid,  /* deletor */
			never, '', noid  /* archivor */ );
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.changed, t.changer, t.changerId, t.deleted, t.deletorId, t.archtime, t.archivor, t.archivorId];
};


function C_dS_context(p) {
	C_dS_context.defaults.mergeto(this,p);
	// meta data
	mobminder.context = this;
	this.ctxtmeta();
	this.account.acmeta(); // builds account meta data
}
C_dS_context.defaults = new A_df({groupId:0, loginId:0, keyId:0, pivotStamp:0, gmtshift:0});
C_dS_context.prototype = {
	ctxtmeta: function() {
		this.pivotDate = new Date(this.pivotStamp*1000);
		this.surfer = C_dS_loggedIn.get(this.loginId); // mobminder.context.surfer is an o_dS_login // mobminder.context.surfer = {}
		this.account = C_dS_group.get(this.groupId); // mobminder.account
			let loggedkey = this.keyId;
		this.acckey = function() { return C_dS_accesskey.byid('logged', loggedkey); }; // mobminder.context.acckey
		this.surfer.is = {  // mobminder.context.surfer.is = {}
			eresa: (this.surfer.accessLevel==aLevel.eresa),
			atleast:{	
				operator: (this.surfer.accessLevel>=aLevel.operator),
				supervisor: (this.surfer.accessLevel>=aLevel.supervisor),
				manager: (this.surfer.accessLevel>=aLevel.manager),
				seller: (this.surfer.accessLevel>=aLevel.seller),
				admin: (this.surfer.accessLevel>=aLevel.admin)
			},
			supervised: C_dS_loggedIn.anyadmin()
		}
	}
}





//////////////////////////////////////////////////////////////////////////////// 
//
////////////////            A C C O U N T 


function C_dS_group(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_group.defaults.mergeto(this,p,this.tmc);
	
	this.rescTypeNames = new Array();
	this.rescTypeNames[class_bCal] = this.bCalsName;
	this.rescTypeNames[class_uCal] = this.uCalsName;
	this.rescTypeNames[class_fCal] = this.fCalsName;
	
	this.defCcss = []; // here we link default values into an organized tree
		this.defCcss[ccsstype.color] = [];
		this.defCcss[ccsstype.pattern] = []; 
		this.defCcss[ccsstype.tag] = [];
	
	this.defCcss[ccsstype.color][ccssclasses.appointment] 	= this.CssAppColor;
	this.defCcss[ccsstype.pattern][ccssclasses.appointment] = this.CssAppPattern;
	this.defCcss[ccsstype.tag][ccssclasses.appointment] 	= this.CssAppTag;
	
	this.defCcss[ccsstype.color][ccssclasses.event] 	= this.CssEventColor;
	this.defCcss[ccsstype.pattern][ccssclasses.event] 	= this.CssEventPattern;
	this.defCcss[ccsstype.tag][ccssclasses.event] 		= this.CssEventTag;
	
	this.defCcss[ccsstype.color][ccssclasses.fcal] 		= this.CssFcalColor;
	this.defCcss[ccsstype.pattern][ccssclasses.fcal] 	= this.CssFcalPattern;
	this.defCcss[ccsstype.tag][ccssclasses.fcal] 		= this.CssFcalTag;
	
	this.defCcss[ccsstype.color][ccssclasses.visitor] 	= this.CssVisitorColor;
	this.defCcss[ccsstype.pattern][ccssclasses.visitor] = this.CssVisitorPattern;
	this.defCcss[ccsstype.tag][ccssclasses.visitor] 	= this.CssVisitorTag;
	
	this.defCcss[ccsstype.color][ccssclasses.note] 		= this.CssNoteColor;
	this.defCcss[ccsstype.pattern][ccssclasses.note] 	= this.CssNotePattern;
	this.defCcss[ccsstype.tag][ccssclasses.note] 		= this.CssNoteTag;
	
	this.defCcss[ccsstype.color][ccssclasses.task] 		= this.CssTaskColor;
	this.defCcss[ccsstype.pattern][ccssclasses.task] 	= this.CssTaskPattern;
	this.defCcss[ccsstype.tag][ccssclasses.task] 		= this.CssTaskTag;
	
	this.defCcss[ccsstype.color][ccssclasses.chat] 		= this.CssChatColor;
	this.defCcss[ccsstype.pattern][ccssclasses.chat] 	= this.CssChatPattern;
	this.defCcss[ccsstype.tag][ccssclasses.chat] 		= this.CssChatTag;
	
	this.defCcss[ccsstype.color][ccssclasses.file] 		= this.CssFileColor;
	this.defCcss[ccsstype.pattern][ccssclasses.file] 	= this.CssFilePattern;
	this.defCcss[ccsstype.tag][ccssclasses.file] 		= this.CssFileTag;

	C_dS_group.registers.id.add(this.id, this);
	if(this.usechat) C_dS_group.anychat++; // sums up all C_dS_groups from all logins (i.e. all accounts from all logged wallets)
	
}
C_dS_group.defaults = new A_df({cfgversion:0,package:16, profsector:0, GMT:0, name:'new account', headline:'', color:0, pattern:0, tag:0, note:''
	,weburl:'',ccphone:'',email:'',language:0,visitorAlias:200,smsSenderId:'',timeSlice:4
	,durationShortest:1,durationSteps:1,durationLongest:8, notbefore:8424222, upperLeftDate:'0'
	,rangeIn:28800,rangeOut:72000,history:0,vipToggle:0,cssSuite:0
	
	,ePayActive:0,ePayBenefName:'',ePayBenefIBAN:'',ePayBenefBIC:'',ePayconiqKey:'',ePayMarketKey:''
	
	,suspended:0,stiFontSize:2,mailToUsers:0,sendSMSs:0,phoneRegion:32,phoneSlicing:3
	,defaultGender:0,bCalsName:20,uCalsName:70,fCalsName:110
	
	,CssAppColor:0,CssAppPattern:0,CssAppTag:''
	,CssEventColor:0,CssEventPattern:0,CssEventTag:''
	,CssFcalColor:0,CssFcalPattern:0,CssFcalTag:''
	,CssVisitorColor:0,CssVisitorPattern:0,CssVisitorTag:''
	
	,maxVisitors:0, cssLogging:0, usestandbylist:0, overdays:0, usetasks:1, usenotes:1, usechat:0, usefiles:0, useappaddress:0
	
	,CssNoteColor:0,CssNotePattern:0,CssNoteTag:''
	,CssTaskColor:0,CssTaskPattern:0,CssTaskTag:''
	,CssChatColor:0,CssChatPattern:0,CssChatTag:''
	,CssFileColor:0,CssFilePattern:0,CssFileTag:'' });
(C_dS_group.reset = function() {
	C_dS_group.registers = new C_regS('id');
	C_dS_group.anychat = 0;
})();
C_dS_group.get = function(id) { return C_dS_group.registers.id.get(id) };
C_dS_group.prototype = {
	acmeta: function() {
		mobminder.account = this; // global var
		C_XL.setContextLanguage();
		
		// relink
		C_dS_hourly.relink();
		
		// pre-computed meta-data
		this.single = C_dS_resource.single();
		this.secondsPerSlice 	= (3600/this.timeSlice)|0; 
		this.sliceIn 	= (this.rangeIn/this.secondsPerSlice)|0;
		this.sliceOut 	= (this.rangeOut/this.secondsPerSlice)|0;
		this.durMinSec	= this.secondsPerSlice*this.durationShortest;
			let uld = undefined; if(this.upperLeftDate!='0000-00-00 00:00:00') uld = jsDateFromUnixTime(this.upperLeftDate);
		this.upperLeftDate = uld; // convert the time stamp to a js date as we can't do anything good anyway with a UnixTimeStamp
		C_iCUE.init();
		
		this.is = {
			range024:(this.rangeIn==0 && this.rangeOut==86400)
		};
		this.has = { // mobminder.account.has = 
			bCal:C_dS_resource.has(class_bCal), uCal:C_dS_resource.has(class_uCal), fCal:C_dS_resource.has(class_fCal)
			, workcodes:C_dS_workcode.has({eresa:false}), eworkcodes:C_dS_workcode.has({eresa:true}), excpshadows:C_dS_shadow.has.exceptional, timeboxing:C_dS_timeboxing.has()
			, resa: {   color: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.color)
					, pattern: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.pattern)
					,     tag: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.tag)+C_dS_customCss.countByType(ccssclasses.event,ccsstype.tag)
					,workcode: (C_dS_workcode.has({eresa:false}) + C_dS_workcode.has({eresa:true})) }
			, visi: { 	color: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.color)
					, pattern: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.pattern)
					,     tag: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.tag)
					}
			, epayment: !!this.ePayActive
			, epmobsepa: !!this.ePayBenefName&&!!this.ePayBenefIBAN&&!!this.ePayBenefBIC // true if all 3 fields are filled.
			, epayconiq: !!this.ePayconiqKey && (!!this.ePayBenefName&&!!this.ePayBenefIBAN&&!!this.ePayBenefBIC)		
			, epaymarkt: !!this.ePayMarketKey && (!!this.ePayBenefName&&!!this.ePayBenefIBAN&&!!this.ePayBenefBIC)	
		};
		
		this.nameof = { bCal:C_XL.w(class_bCal), uCal:C_XL.w(class_uCal), fCal:C_XL.w(class_fCal) };
		
		// preset default values
		C_dS_visitor.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.visitor];
		C_dS_visitor.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.visitor];
		
		C_dS_visitor.defaults.gender = this.defaultGender;
			C_dS_visitor.defaults.language = mobminder.context.surfer.language;
			C_dS_login.defaults.language = mobminder.context.surfer.language;
			C_dS_contract.defaults.language = mobminder.context.surfer.language;
			C_dS_guidelines.defaults.language = mobminder.context.surfer.language;
		C_dS_group.defaults.language = mobminder.context.surfer.language;
		
		C_dS_note_detail.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.note];
		C_dS_note_detail.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.note];
		
		C_dS_task_description.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.task];
		C_dS_task_assignee.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.task];
		
		C_dS_chat_thread.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.chat];
		C_dS_chat_thread.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.chat];
		
		C_dS_file.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.file];
		C_dS_file.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.file];
		
		C_dS_workcode.defaults.duration = this.durationShortest;
		
		C_dS_customCss.setdefaults();
		C_dS_sms.status.stringSet();
		C_dS_email.status.stringSet();
	},
	macroflush: function() { // called before any new config is loaded
		mobminder.account = false; // global var
		C_dS_logo.reset();
		C_dS_workcode.reset();
		C_dS_timeboxing.reset();
		C_dS_timebox.reset();
		C_dS_workexpert.reset();
		C_dS_worktboxing.reset();
		C_dS_customCss.reset();
		C_dS_notifTemplate.reset();
		C_dS_emailTemplate.reset();
		C_dS_smsTemplate.reset();
		C_dS_resource.reset();
		C_dS_guidelines.reset();
		C_dS_shadow.reset();
		C_dS_hourly.reset();
		C_dS_hourlyuser.reset();
		C_dS_details.reset();
		C_dS_contract.reset();
		C_dS_task_assignee.reset();
		C_dS_group.reset();
		keysbank.reset();
		C_dS_prebooking.reset();

	},
	abullet: function(options) {
		options = options||{};
		let applet = '&nbsp;'; // sets bullet height to 100% of td height
			if(this.tag) applet = ''; // then the div content will be the tag 
		// let applet = '0';
		if(options.warning) { // red indicator at right bottom of bullet (for chats)
			applet = '&nbsp;<div class="warnme" style="width:1em; font-size:80%; position:absolute; bottom:-0.3em; right:-1.1em; text-align:left;">'+options.warning+'</div>';
		}
		
			let color = 'c'+this.color; // grayed when no color is chosen
			let pattern = this.pattern ? ' p'+this.pattern : '';
			let tag = this.tag ? ' tagged '+C_iSKIN.tagcss(this.tag) : '';
		let bullet = '<div style="display:inline-block; position:relative;" class="bullet account '+color+pattern+tag+'">'+applet+'</div>';
		return bullet;
	},
	defaultCcss: function(csstype,resaclass,id) { // returns an array like [0:19680, 1:19767, 2:...] or true/false if an id is provided
		let a = new Array();
		switch(csstype) {
			case ccsstype.tag:
				// this is different because more than one tag may define a default set
				a = this.defCcss[csstype][resaclass].split('!'); 
				break;
			default:
				a.push(this.defCcss[csstype][resaclass]);
		}
		if(!id) return a;
		for(let x in a) if(id==a[x]) return true;
		return false;
	}
}
C_dS_group.ACoptions = {
	trigger: 3,
	css: 'alpha20',
	callback: false,
	exclude: false,
	fetch: function(digits, callback, exclude) { 
		this.callback = callback; this.exclude = exclude || false;
		let post = new C_iPASS({digits:digits});
		mobminder.app.post({post:post}, {post:{digits:'digits'}}, './queries/acgroups.php', new A_cb(this, this.stream, digits));
	},
	label: function(id) { 
		return this.merge(C_dS_group.register.id.get(id), {bullet:false});
	},
	merge: function(o_dS, options) {
		let id =  '['+o_dS.id+'] ';
		let bullet = ''; if(options.bullet) bullet = o_dS.abullet({});
		let name = o_dS.name;
		return bullet+id+name;
	}, 
	stream: function(digits, datasets) {
		let options = new Array();
		let presets = new Array(); // they contain the tooltip indications
		let dSets = datasets['C_dS_group'];
		for(let id in dSets)
			if(id != this.exclude) {
				options[id] = C_dS_group.ACoptions.merge(dSets[id], {bullet:false}); // bullet does not display well once selected :(	
				presets[id] = { tip:'Hello' };
			}
		C_dS_group.ACoptions.callback.cb(digits, options, presets);
	}
}



////////////////  W O R K    C O D E S 

function C_dS_workcode(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_workcode.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_workcode.registers.eresa.add(this.ereservable, this.id, this);
		C_dS_workcode.registers.id.add(this.id, this);
		C_dS_workcode.count++; 
	} else {
		C_dS_workcode.defaults.apply(this); // new object
	}
	
	// meta
	this.has = { ccss:!!(this.cssColor||this.cssPattern) };
		let color = this.cssColor?C_dS_customCss.get(this.cssColor).css:'';
		let pattern = this.cssPattern?C_dS_customCss.get(this.cssPattern).css:'';
	this.ccss = { color:color, pattern:pattern };
	this.xmon = new Array();
};
//old bsp C_dS_workcode.defaults = new A_df( { name:'', code:'', price:0, deposit:0, note:'', duration:1, staffing:1, cssColor:0, cssPattern:0, tag:0, ereservable:0, checklistid:0 } );
C_dS_workcode.defaults = new A_df( { name:'', code:'', price:0, deposit:0
		, note:'', secretarynote:'', webpagenote:'', communicnote:'' 
		, altLanguage1:255, altName1:'', altwebpagenote1:'', altcommunicnote1:'', altLanguage2:255, altName2:'', altwebpagenote2:'', altcommunicnote2:''			
		, duration:1, staffing:1, cssColor:0, cssPattern:0, tag:0 
		, ereservable:0, checklistid:0 } );

(C_dS_workcode.reset = function() {
	C_dS_workcode.registers = new C_regS('id','eresa');
	C_dS_workcode.count = 0; 
})();
C_dS_workcode.prototype = {
	resources: function() { return C_dS_workexpert.registers.bytype.get(this.id) }, // results like [rscType][rscId] = o_dS_resource;
	expertsIds: function() { return C_dS_workexpert.registers.rescids.get(this.id) }, // results like [rscId] = rscId;
	tboxingIds: function() { return C_dS_worktboxing.registers.tboxid.get(this.id) }, // results like [tboxingId] = o_dS_timeboxing;

	wbullet: function() {	
			let tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			let inner = this.tag?'':'&nbsp;';
		let bullet = '<div style="display:inline-block;" class="bullet workcode '+tag+this.wcss()+'">'+inner+'</div>';
		return bullet;
	},
	wcss: function() {
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		return color+pattern;
	},
	hasCcss: function() { return !!(this.cssColor+this.cssPattern); },
	minutes: function() { 
			let mps = mobminder.account.secondsPerSlice/60; // minutes per slice
		return (this.duration*mps)+'min';
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};
C_dS_workcode.ACoptions = function(preset) { // for C_iACPICK, see (*aco01*)
		preset = preset||{ /* eWorkcodes:false, tip:false, bullets:true */}; 
		
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) { 
			this.register = C_dS_workcode.registers.eresa.get(1) || []; // returns only ePerformances
			this.sum = C_dS_workcode.registers.eresa.ends(1) || 0;
		}
		if(preset.eWorkcodes===false) {
			this.register = C_dS_workcode.registers.eresa.get(0) || []; // returns only NON ePerformances
			this.sum = C_dS_workcode.registers.eresa.ends(0) || 0;
		}
	} else {
		this.register = C_dS_workcode.registers.id.get();
		this.sum = C_dS_workcode.registers.id.ends();
	}

	this.trigger = 0,
	this.css = 'alpha14',
	this.fetch = function(digits, callback) { 
	
		let options = {}; for(let id in this.register) options[id] = this.label(id);
		setTimeout(function(){return callback.cb(digits, options)},5);
		return;

		//   PREPARED BUT NOT IN USE - we try to sort e-reservables from internal workcodes
		
			let sections = C_XL.w({ 0:'workcode', 1:'e-reservable' });
			
				let bullet = C_XL.w('bullet down');
			let labels 	= { 0: [], 1: [] };
			let presets = { 0: {}, 1: {} };
			let order 	= { 0:new Array(), 1:new Array() }; 	
			let registers = [];
		registers[0] = C_dS_workcode.registers.eresa.get(0); // returns only NON ePerformances
		registers[1] = C_dS_workcode.registers.eresa.get(1); // returns only ePerformances
		
		for(let s in sections) { // s is the section id
			let sortrule = function(a,b) { return (registers[s][a]>registers[s][b])?1:-1; }; 
			for(let id in registers[s]) {
				order[s].push(id);
				
				let dS = registers[s][id];
				
				if(preset.bullets) labels[s][id] = dS.wbullet()+dS.name;
					else labels[s][id] = dS.name;
					
				presets[s][id] = { tip:false };
				if(preset.tip) {
					let tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
					presets[s][id].tip = tip;
				}
			}
			order[s].sort(sortrule);
		}
		
		
		let labelsmerge = { };
		for(let s in sections) {
			labelsmerge[s] = sections[s];
			for(let id in labels[s]) labelsmerge[id] = labels[s][id];
		}
		let ordermerge = new Array();
		for(let s in order) {
			ordermerge.push(s);
			for(let i in order[s]) ordermerge.push(order[s][i]);
		}
		let presetmerge = { 0:{section:bullet}, 1:{section:bullet} };
		for(let s in presets) {
			for(let id in labels[s]) presetmerge[id] = presets[s][id];
		}
		
			let count = ordermerge.length;
		
		let optionss = { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count };	 // the upper level is not prepared to receive options with specification of order
		
		// console.log(options);
		
		setTimeout(function(){return callback.cb(digits, optionss)},5);
	},
	this.label = function(id) { 
		let dS = C_dS_workcode.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		
				let price = ''; if(dS.price) price = ', '+C_iEDIT.ergoprice(dS.price)+C_XL.w('euros');
			let parentheses = ''; parentheses = ' <span style="font-size:smaller; opacity:.7">('+dS.minutes()+price+')</span>';
		
		return dS.wbullet()+dS.name+parentheses;
	},
	this.tip = function(id) { 
			let workcode = C_dS_workcode.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
			let name = workcode.name+' '+workcode.minutes();
			let separator = '<hr/>';
			let bullet = workcode.hasCcss() ? workcode.wbullet() : '';
			let note = workcode.note ? separator + workcode.note : '';
			let codeprice = new Array(); 
		if(workcode.code) codeprice.push(workcode.code);
		if(workcode.price) codeprice.push(C_iEDIT.ergoprice(workcode.price)+C_XL.w('euros'));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
		let tip = bullet + name + codeprice + note;
		return tip;
	},
	this.count = function() { return this.sum; } // see (*ac10*)
	
}
C_dS_workcode.get = function(id) { return C_dS_workcode.registers.id.get(id); }
C_dS_workcode.has = function(options) { // options like { eresa:[true, false, undef] }
	options = options||{};
	if(options.eresa==undefined) return C_dS_workcode.registers.id.ends();
	else return C_dS_workcode.registers.eresa.ends(options.eresa?1:0);
	return !!C_dS_workcode.count;
}
C_dS_workcode.del = function(id) {
	C_dS_workexpert.deleteOnWorkcode(id);
	C_dS_worktboxing.deleteOnWorkcode(id);
		let item = C_dS_workcode.registers.id.get(id);
	C_dS_workcode.registers.del(item);
}
C_dS_workcode.plus = function(genome) { // genome like eresa:[true, false, or undefined]
	this.genome = genome||{};
		
	// generic interface to C_iPLUS, used for workcodes in the webapp setup on performances tab
	this.plusmay = permissions.may(pc.cr_wrkc);
	this.eid = '_wrk';
	this.list = function() {
		let labels = [], order = [];
		let register = (this.genome.eresa===undefined)?C_dS_workcode.registers.id.get():C_dS_workcode.registers.eresa.get(this.genome.eresa?1:0);
		for(let id in register) {
				let dataset = register[id];
					let price = ''; if(dataset.price) price = C_iEDIT.ergoprice(dataset.price)+C_XL.w('euros');
					let deposit = ''; if(dataset.deposit) deposit = ' / '+C_iEDIT.ergoprice(dataset.deposit)+C_XL.w('euros');
				let pricetag = ''; if(dataset.price||dataset.deposit) pricetag = ' <span style="font-size:smaller; opacity:.7">('+price+deposit+')</span>';
			labels[id] = dataset.wbullet()+dataset.name+pricetag;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let dS = new C_dS_workcode();
		dS.ereservable = (this.genome.eresa===true)?1:0;
		return dS;
	};
	this.get = function(id) {
		return C_dS_workcode.registers.id.get(id);
	}
}
C_dS_workcode.options = function(preset) { // for C_iCRESTA, see (*aco01*)

		// preset like {eWorkcodes:true, which:[ids], checked:'first' or [ids]}
	
		preset = preset||{ /* eWorkcodes:false, tip:false, bullets:true */ };
		// the search assistant uses eWorkcodes:false (none of e-resa workcodes should appear there)
		// the e-resa.js use eWorkcodes:true (only of e-resa workcodes should appear there)
		// the M_RESA resa modal use eWorkcodes:undefined (shows all of possible e-reservable and intern workcodes)
		// M_LOGIN uses eWorkcodes:true (filtering the allowed workcodes for the eresa web page)
	
	// let register = preset.eWorkcodes?C_dS_workcode.registers.eresa.get(1):C_dS_workcode.registers.id.get();
	let register = C_dS_workcode.registers.id.get() || [];
	
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
	
		let order = [], labels = [], presets = {};

		let sortrule = function(a,b) { return (register[a].name>register[b].name)?1:-1; }; 
	
		if(preset.eWorkcodes===true) register = C_dS_workcode.registers.eresa.get(1) || []; // returns only ePerformances
		if(preset.eWorkcodes===false) register = C_dS_workcode.registers.eresa.get(0) || []; // returns only NON ePerformances
	
	
		for(let id in register) {
			if(preset.which) if(!(id in preset.which)) continue; // exclude ids that are not foreseen by the .which array.
			
				let dS = register[id];
			order.push(id);
			
			if(preset.bullets) labels[id] = dS.wbullet()+dS.name;
				else labels[id] = dS.name;
				
			presets[id] = { tip:false };
			if(preset.tip) {
				let tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
				presets[id].tip = tip;
			}
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
		switch(preset.checked) {
			case undefined: break;
			case 'first': for(let x in order) { presets[order[x]].checked = true; break; } break;
			default:
			if(preset.checked.length)
				for(let id in preset.checked) 
					if(id in presets) presets[id].checked = true;
		}
	
		return { order:order, labels:labels, presets:presets, count:order.length };
	
	
	} else {
		// show all kind of workcodes, sort them into 2 sections  PREPARED BUT NOT IN USE
		
			let sections = C_XL.w({ 0:'workcode', 1:'e-reservable' });
			
				let bullet = C_XL.w('bullet down');
			let labels 	= { 0: [], 1: [] };
			let presets = { 0: {}, 1: {} };
			let order 	= { 0:new Array(), 1:new Array() }; 	
			let registers = [];
		registers[0] = C_dS_workcode.registers.eresa.get(0) || []; // returns only NON ePerformances
		registers[1] = C_dS_workcode.registers.eresa.get(1) || []; // returns only ePerformances
		
		for(let s in sections) { // s is the section id
			let sortrule = function(a,b) { return (registers[s][a]>registers[s][b])?1:-1; }; 
			for(let id in registers[s]) {
				order[s].push(id);
				
				let dS = register[id];
				
				if(preset.bullets) labels[s][id] = dS.wbullet()+dS.name;
					else labels[s][id] = dS.name;
					
				presets[s][id] = { tip:false };
				if(preset.tip) {
					let tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
					presets[s][id].tip = tip;
				}
			}
			order[s].sort(sortrule);
		}
		
		
		let labelsmerge = { };
		for(let s in sections) {
			labelsmerge[s] = sections[s];
			for(let id in labels[s]) labelsmerge[id] = labels[s][id];
		}
		let ordermerge = new Array();
		for(let s in order) {
			ordermerge.push(s);
			for(let i in order[s]) ordermerge.push(order[s][i]);
		}
		let presetmerge = { 0:{section:bullet}, 1:{section:bullet} };
		for(let s in presets) {
			for(let id in labels[s]) presetmerge[id] = presets[s][id];
		}
		
			let count = ordermerge.length;
		
		return { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count };
	}
	
}



////////////////  P E R F O R M A N C E

function C_dS_performance(b, p) { // groups to a reservation. Tells which of workcodes are performed during exercising this reservation.
	C_dS_performance.defaults.mergeto(this,p);
	rmems[b].perf.add(this.resaId, this.workCodeId, C_dS_workcode.get(this.workCodeId));
	if(vbs) vlog('datasets.js','C_dS_performance','new','id:'+this.id+', grpId:'+this.resaId+', workCodeId:'+this.workCodeId); 
}
C_dS_performance.defaults = new A_df({id:0, resaId:0, workCodeId:0, visitorId:0, checklist:''});



////////////////  P A Y M E N T


function payregs() { C_regS.apply(this,['byid','byresaid']); };
payregs.prototype = C_regS.prototype;

var payregs = { all:new payregs(), flush: function(which) { payregss[which] = new payregs() } }


function C_dS_payment(b, p) { // groups to a reservation. Tells which of workcodes are performed during exercising this reservation.
	
	C_dS_trackingCC.apply(this,p);
	C_dS_payment.defaults.mergeto(this,p,this.tmc); // tmc stands for 'tracking members count'
	
	payregs.all.byresaid.add(this.groupId, this.id, this); // an array like payregs.all.byresaid[resaid][pid] => o_dS_payment
	payregs.all.byid.add(this.id, this); // an array like payregs.all.byid[pid] => o_dS_payment
	if(vbs) vlog('datasets.js','C_dS_payment','new','bank:'+b+', id:'+this.id+', resaId:'+this.groupId+', paymean:'+this.paymean+', amount:'+this.amount);
	
	// console.log(this);
}
C_dS_payment.type = { notset:-1, cash:0, mobqrcode:1, payconiq:2, cards:4 };
C_dS_payment.status = { // see (*ep10*)
	code:{ isnew:999, unauthorized:0, pending:1, success:2, expired:3, failed:4, cancelled:5 },
	translate:{ 999:'ep-st-isnew', 0:'ep-st-unauthorized', 1:'ep-st-pending', 2:'ep-st-success', 3:'ep-st-expired', 4:'ep-st-failed', 5:'ep-st-cancelled' }
};
C_dS_payment.defaults = new A_df({paymean:0, amount:0, transid:'', transnote:'', transtatus:999, opstatus:'', accountholder:'', accountIBAN:'', qrcodestring:'', archived:0 });
C_dS_payment.prototype = {
	pbullet: function(options) {
		options = options || { display:'pluslist'};
		let s = 'fa-euro-sign';
		switch(this.paymean) {
			case C_dS_payment.type.cash: 		s = 'fa-coins'; break;
			case C_dS_payment.type.mobqrcode: 	s = 'fa-qrcode'; break;
			case C_dS_payment.type.payconiq: 	s = 'fa-infinity'; break;
			case C_dS_payment.type.cards: 		s = 'fa-credit-card'; break;
		}
		switch(options.display) {
			case 'modaltitle': 
				return '<i style="padding-left:.2em; text-align:center;" class="fa fa-gray fa-2x '+s+'"></i>';
			case 'pluslist': 
			default:
				return '<i style="padding:.2em 0em; min-width:2em; text-align:center;" class="fa fa-gray fa-13x '+s+'"></i>';
		}
	},
	pstatus: function(options) {
		let guistatus = C_dS_payment.status.translate; // see (*ep10*)
		let s = C_dS_payment.status.code.new;
		switch(this.paymean) {
			case C_dS_payment.type.cash: 		s = this.transtatus; break;
			case C_dS_payment.type.mobqrcode: 	s = this.transtatus; break;
			case C_dS_payment.type.payconiq: 	s = this.transtatus; break; // should match the possible status codes range for payconiq
			case C_dS_payment.type.cards: 		s = this.transtatus; break; // should match the possible status codes range for marketpay
		}
		return C_XL.w(guistatus[s]); // see (*ep10*)
	},
}
C_dS_payment.del = function(pid) {
	if(vbs) vlog('datasets.js','C_dS_payment','del','id:'+pid);
	let item = payregs.all.byid.get(pid);
	payregs.all.del(item);
}
C_dS_payment.plus = function(dS_reservation) {
	
	// generic interface to C_dS_payment
	this.plusmay = this.mayadd();
	this.eid = '_trns_';
	this.resa = dS_reservation;
	this.list = function() {
		this.payments = payregs.all.byresaid.get(this.resa.id); // is undefined or an array like this.payments[id] => o_dS_payment
		
		let indexed = this.payments; // is undefined when no resource relies in the register
		let labels = [], order = [];
		this.plusmay = this.mayadd();
		for(let x in indexed) { 
				let payment = indexed[x]; let id = payment.id;
				let bullet = payment.pbullet();
				let price = C_iEDIT.ergoprice(payment.amount);
				let status = payment.pstatus();
			order.push(id); labels[id] = bullet+price+' '+C_XL.w('euros')+' <span style="font-size:smaller; opacity:.5">('+status+')</span>';
			if(verboseOn) labels[id] = id+' '+labels[id];
		}
		return { labels:labels, order:order };
	}
	this.plus = function() { // called when a new item is required by touching the (plus) button
		return new C_dS_payment(this.resa.rmem, C_dS_trackingCC.tnew(0, this.resa.id).concat([C_dS_payment.type.notset]));
	}
	this.get = function(id) { // called when a new item is required by touching an item from the list
		return payregs.all.byresaid.get(this.resa.id)[id];
	}
	this.ends = function() {
		return payregs.all.byresaid.end(this.resa.id);
	}
}
C_dS_payment.plus.prototype = {
	mayadd: function() {
		return true;
	}
}


////////////////  W O R K    C O D E S    E X P E R T S 

function C_dS_workexpert(p) {
	C_dS_workexpert.defaults.mergeto(this,p);
	let resource = C_dS_resource.get(this.resourceId);
	C_dS_workexpert.registers.bytype.add(this.groupId, resource.resourceType, resource.id, this);
	C_dS_workexpert.registers.rescids.add(this.groupId, resource.id, resource.id); // used of R_search
	C_dS_workexpert.registers.id.add(this.groupId, this.id, this);
};
C_dS_workexpert.defaults = new A_df( { id:0, groupId:0, resourceId:0 } );
C_dS_workexpert.deleteOnWorkcode = function(wrkcodeId) {
	let items = C_dS_workexpert.registers.id.get(wrkcodeId);
	for(let id in items) C_dS_workexpert.registers.del(items[id]);
};
(C_dS_workexpert.reset = function(){
	C_dS_workexpert.registers = new C_regS('id', 'bytype', 'rescids');
})();


////////////////  W O R K    C O D E S    T I M E     B O X I N G  

function C_dS_worktboxing(p) {
	C_dS_worktboxing.defaults.mergeto(this,p);
	C_dS_worktboxing.registers.tboxid.add(this.groupId, this.timeboxingId, this);
	C_dS_worktboxing.registers.id.add(this.groupId, this.id, this);
};
C_dS_worktboxing.defaults = new A_df( { id:0, groupId:0, timeboxingId:0 } );
C_dS_worktboxing.deleteOnWorkcode = function(wrkcodeId) {
	let items = C_dS_worktboxing.registers.id.get(wrkcodeId);
	for(let id in items) C_dS_worktboxing.registers.del(items[id]);
};
(C_dS_worktboxing.reset = function(){
	C_dS_worktboxing.registers = new C_regS('id', 'tboxid');
})();



////////////////  C H E C K L I S T S   ( PVH 2022 - TBC - ongoing dev )

function C_dS_checklist(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_checklist.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_checklist.registers.id.add(this.id, this);
		C_dS_checklist.count++; 
	} else {
		C_dS_checklist.defaults.apply(this); // new object
	}
	
	// meta
	this.has = { cltag:!!(this.cltag), guideline:!!(this.clguideline) };
	this.ccss = { color:color, pattern:pattern };
};
C_dS_checklist.defaults = new A_df( { clname:'', clguideline:'', cltext:'', cltag:0 } );
(C_dS_checklist.reset = function() {
	C_dS_checklist.registers = new C_regS('id');
	C_dS_checklist.count = 0; 
})();
C_dS_checklist.prototype = {
	
};
C_dS_checklist.ACoptions = function(preset) {
		preset = preset||{/* eWorkcodes:false, tip:false, bullets:true */}; 
		
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) { 
			this.register = C_dS_checklist.registers.eresa.get(1) || []; // returns only ePerformances
			this.sum = C_dS_checklist.registers.eresa.ends(1) || 0;
		}
		if(preset.eWorkcodes===false) {
			this.register = C_dS_checklist.registers.eresa.get(0) || []; // returns only NON ePerformances
			this.sum = C_dS_checklist.registers.eresa.ends(0) || 0;
		}
	} else {
		this.register = C_dS_checklist.registers.id.get();
		this.sum = C_dS_checklist.registers.id.ends();
	}

	this.trigger = 0,
	this.css = 'alpha14',
	this.fetch = function(digits, callback) { 
		let options = {}; for(let id in this.register) options[id] = this.label(id);
		setTimeout(function(){return callback.cb(digits, options)},5);
	},
	this.label = function(id) { 
		let dS = C_dS_checklist.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		return dS.wbullet()+dS.name+' '+dS.minutes();
	},
	this.tip = function(id) { 
			let workcode = C_dS_checklist.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
			let name = workcode.name+' '+workcode.minutes();
			let separator = '<hr/>';
			let bullet = workcode.hasCcss() ? workcode.wbullet() : '';
			let note = workcode.note ? separator + workcode.note : '';
			let codeprice = new Array(); 
		if(workcode.code) codeprice.push(workcode.code);
		if(workcode.price) codeprice.push(C_XL.w('euros') + (workcode.price/100).toFixed(2));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
		let tip = bullet + name + codeprice + note;
		return tip;
	},
	this.count = function() {
		return this.sum;
	}
}
C_dS_checklist.get = function(id) { return C_dS_checklist.registers.id.get(id); }
C_dS_checklist.has = function() { // options like { eresa:[true, false, undef] }
	return C_dS_checklist.registers.id.ends();
}
C_dS_checklist.del = function(id) {
	C_dS_workexpert.deleteOnWorkcode(id);
	C_dS_worktboxing.deleteOnWorkcode(id);
		let item = C_dS_checklist.registers.id.get(id);
	C_dS_checklist.registers.del(item);
}
C_dS_checklist.plus = function(genome) { // genome like eresa:[true, false, or undefined]
	this.genome = genome||{};
		
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_wrkc);
	this.eid = '_wrk';
	this.list = function() {
		let labels = [], order = [];
		let register = (this.genome.eresa===undefined)?C_dS_checklist.registers.id.get():C_dS_checklist.registers.eresa.get(this.genome.eresa?1:0);
		for(let id in register) {
			let dataset = register[id];
			labels[id] = dataset.wbullet()+dataset.name;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let dS = new C_dS_checklist();
		dS.ereservable = (this.genome.eresa===true)?1:0;
		return dS;
	};
	this.get = function(id) {
		return C_dS_checklist.registers.id.get(id);
	}
}
C_dS_checklist.options = function(preset) { 
	
		preset = preset||{}; 
	let order = [], labels = [], presets = {};
	let register = preset.eWorkcodes?C_dS_checklist.registers.eresa.get(1):C_dS_checklist.registers.id.get();
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) register = C_dS_checklist.registers.eresa.get(1); // returns only ePerformances
		if(preset.eWorkcodes===false) register = C_dS_checklist.registers.eresa.get(0); // returns only NON ePerformances
	} else {
		register = C_dS_checklist.registers.id.get();
	}
	for(let id in register) {
		if(preset.which) if(!(id in preset.which)) continue;
		
		let dS = register[id];
		order.push(id);
		
		if(preset.bullets) labels[id] = dS.wbullet()+dS.name;
			else labels[id] = dS.name;
			
		presets[id] = { tip:false };
		if(preset.tip) {
			let tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
			presets[id].tip = tip;
		}
	}
	order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
	switch(preset.checked) {
		case undefined: break;
		case 'first': for(let x in order) { presets[order[x]].checked = true; break; } break;
		default:
		if(preset.checked.length)
			for(let id in preset.checked) 
				if(id in presets) presets[id].checked = true;
	}
	
	return { order:order, labels:labels, presets:presets, count:order.length };
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
// 	  C U S T O M    C S S 

var color_code_event = 99;
var css_pattern_none = 999;
var css_color_none = 999;
var css_tag_none = 1000;

var ccsstype = { color:80, pattern:81, tag:82 }; // DB values
var ccssclasses = { appointment:resaclass.appointment , event:resaclass.event, fcal:resaclass.fcalwide, visitor:class_visitor, note:class_note, task:class_task, chat:class_chat, file:class_file };
var ccsstag = function(clas, type) { return type+'_'+clas; };
var skin = { color:ccsstype.color, pattern:ccsstype.pattern, tag:ccsstype.tag, acctag:83, rsctag:84, tbxtag:85, wkctag:86, logtag:87, eresa:89 };

function C_dS_customCss(p) {

	C_dS_trackingCCD.apply(this,p);
	C_dS_customCss.defaults.mergeto(this,p,this.tmc);

	// this.resaClass is one of ccssclasses
	// this.cssType is one of ccsstype
	
	// meta
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_customCss.registers.id.add(this.id, this);
		C_dS_customCss.registers.cclass.add(this.resaClass, this.cssType, this.id, this);
	}
	// links
	this.emails = new Array(); // emails and sms that are triggered by this css setting
	this.smss = new Array(); // NOT USED ?? (set in the relink function of smsTemplates)
	
	// meta	
	switch(this.cssType) {
		case ccsstype.color: this.cssName = 'c'+this.css; break;
		case ccsstype.pattern: this.cssName = 'p'+this.css; break;
		case ccsstype.tag: this.cssName = this.css?C_iSKIN.tagcss(this.css):''; break;
	}
	this.xmon = new Array();
};
C_dS_customCss.defaults = new A_df( { resaClass:0, cssType:0, name:'', css:0, note:'' } );
(C_dS_customCss.reset = function() {
	C_dS_customCss.registers = new C_regS('id','cclass');
})();
C_dS_customCss.prototype = {
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; },
	mbullet: function(css) {
		let t = '';
		switch(this.cssType) {
			case ccsstype.color: 	css = 'bullet '+(css||'')+' '+this.cssName; t = '&nbsp;'; break;
			case ccsstype.pattern: 	css = 'bullet '+(css||'')+' '+this.cssName; t = '&nbsp;'; break;
			case ccsstype.tag: 		css = 'tag '+(css||'')+' '+this.cssName; break;
		}
		let bullet = '<div style="display:inline-block;" class="'+css+'">'+t+'</div>';
		return bullet;
	},
}
C_dS_customCss.get = function(id) { 
	let ccss = C_dS_customCss.registers.id.get(id); 
	if(ccss === undefined) if(id) {
		console.log('C_dS_customCss id '+id+' is referenced but not defined');
	
	//	Troubleshoot defective account ?
	//	
	//	select * from custom_css where id = 30135;
	//	select * from workcodes where cssPattern = 30135 or cssColor = 30135;
	//	select * from reservations where cssPattern = 30135 or cssColor = 30135;
	//	select * from visitors where cssPattern = 30135 or cssColor = 30135;
	//
	//	Any custom_css that was deleted but used either way by another login, should be repaired by deleting the bad reference (eg30135) from the workcode or the reservation
	//
	
		return C_dS_customCss.registers.id.get(0); 
	}
	return ccss;
}
C_dS_customCss.getByType = function(resaClass, cssType, id) { 
	return C_dS_customCss.registers.cclass.get(resaClass, cssType, id);
}
C_dS_customCss.countByType = function(resaClass, cssType) { 
	return C_dS_customCss.registers.cclass.ends(resaClass, cssType);
}
C_dS_customCss.setdefaults = function() { // to the list of custom colors for visitors or reservations, we add here a way to select "no color".
	
	for(let type in ccsstype) {
		let t = ccsstype[type]; // [color, pattern, tag]
		for(let c in ccssclasses) {
			let cclass = ccssclasses[c];  // [ appointment, event, fcalwide, class_visitor, class_note, class_task, class_chat, class_file ]
			let csscode;
			if(t==ccsstype.color) switch(cclass) { 
					case resaclass.appointment: csscode = color_code_event; break; 
					case resaclass.event: csscode = color_code_event; break; 
					case resaclass.fcalwide: csscode = color_code_event; break; 
					default: csscode = css_color_none; 
				}
			if(t==ccsstype.pattern) csscode = css_pattern_none; 
			if(t==ccsstype.tag) csscode = css_tag_none; 
			
			let name;
			switch(cclass) { 
				case resaclass.appointment: name = 'default'; break; 
				case resaclass.event: name = 'event'; break; 
				case resaclass.fcalwide: name = 'default'; break; 
				default: 
					if(t==ccsstype.color) name = 'none ff'; // feminin translation in some languages, like e.g. french: aucune
					else name = 'none'; // default masculine e.g. "aucun"
			}
			
			let z = new C_dS_customCss(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([cclass,t,C_XL.w(name),csscode,'']));
			
		}
	}
	
}
C_dS_customCss.options = function(resaClass, cssType, precheck, options) { // options like { defxclusive:true, stickeratright:true }
	// precheck is expected to be an array of ids, like [ 0=>5521, 1=>5426, 2=>5526 ]
		options = options||{};
	let bcss = ''; // bullet css
		if(cssType==ccsstype.tag) bcss = 'taglabelled';
		if(options.stickeratright) bcss = 'padded';
	let checkall = false;
	if(precheck) {
		if(typeof(precheck)=='object') precheck = arrayINVERT(precheck);
		else { precheck=false; checkall = true; }
	}
	let order = [], labels = [], presets = {};
	let register = C_dS_customCss.getByType(resaClass,cssType);
	for(let id in register) {
		if(options.defxclusive) if(id==0) continue; // default values are excluded from options
		if(id!=0) order.push(id); // discard default color/pattern from the sorting list (is added to the end afterwards see (*dc01*) )
		let dS = register[id];
		
		if(options.stickeratright) labels[id] = dS.name+dS.mbullet(bcss);
			else labels[id] = dS.mbullet(bcss)+dS.name;
			let tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
		presets[id] = { tip:tip };
		if(precheck) if(id in precheck) presets[id].checked = true;
		if(checkall) presets[id].checked = true;
	}
	order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
	if(cssType!=ccsstype.tag) 
		if(!options.defxclusive) order.push(0); // puts default color/pattern at the end of the list, see (*dc01*)

	
	return { order:order, labels:labels, presets:presets, count:order.length };
}
C_dS_customCss.plus = function(resaclass, csstype) {
	this.genome = { resaClass:resaclass, cssType:csstype }
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_ccss);
	this.eid = '_ccss_'+resaclass+'_'+csstype;
	let bcss = ''; // bullet css
		if(csstype==ccsstype.tag) bcss = 'taglabelled';
	this.list = function() {
		let ccsss = C_dS_customCss.getByType(resaclass, csstype);
		let labels = [], order = [];
		
			let d = '<span style="font-size:80%; font-weight:bold;">&nbsp;(*'+C_XL.w('default')+')</span>';
			let da = mobminder.account.defaultCcss(csstype,resaclass);
			
		for(let id in ccsss) if(id!=0) { // id's == 0 are the defaults css
			let css = ccsss[id];
			let bullet = css.mbullet(bcss);
			labels[id] = bullet+css.name; 
			if(verboseOn) labels[id] = css.id+' '+labels[id];
			for(let x in da) if(id==da[x]) { labels[id]+=d; break; } // display as default // csstype.tag can have more than one default
			order.push(id); 
		}
		order.sort(function(a,b){return (ccsss[a].name>ccsss[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {	
		let newcss;
		switch(this.genome.cssType) {
			case ccsstype.color: newcss = 173 /* blue */; break;
			case ccsstype.pattern: newcss = 800 /* hashed */; break;
			case ccsstype.tag: newcss = 1000 /* none */; break;
		}
		return new C_dS_customCss(C_dS_trackingCCD.tnew(-1, mobminder.account.id).concat([this.genome.resaClass, this.genome.cssType, '', newcss, '']));
	}
	this.get = function(id) {
		return C_dS_customCss.registers.id[id];
	}
}
C_dS_customCss.del = function(id) {
	let item = C_dS_customCss.get(id);
	C_dS_customCss.registers.del(item);
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   S M S   &   E M A I L S

function C_dS_sms(p) {
	C_dS_trackingCC.apply(this,p);
	C_dS_sms.defaults.mergeto(this,p,this.tmc);
	// this.status = this.r2status || this.status; // - we show a single status on the user interface, if used, we show the route 2 status (obsolete since we went to mBlox, route2 is not used anymore)
	C_dS_sms.registers.add(this, 'resa', this.reservationId, this.templateId, this.resourceId);
}
C_dS_sms.defaults = new A_df( { reservationId:0,templateId:0,resourceId:0,sendStamp:0,text:'',pages:0,toNumber:'',replyNumber:''
	,correlator:0,status:0,opStatus:'',statusChangeStamp:0,r2correlator:0,r2status:0,r2statusChangeStamp:0 } );
C_dS_sms.registers = new C_registers('resa'); // read sms instances using reservation id entry key
C_dS_sms.prototype = {
	title: function() { return ''; },
	message: function() { return this.text; }
}
C_dS_sms.status = {
	// status codes
	 sms_nomobile 	: 'x'	// never stored in DB, used here to identify targets having no recipient
	,sms_disabled 	: 'y'	// never stored in DB, used here to identify toggled communications
	,sms_outdated 	: 'o' // SMS will never be sent, it was created after the planned delivery time
	,sms_nosms 		: 0
	,sms_created 	: 1	// initial status
	,sms_retry 		: 2	// the provider was not available
	,sms_handled 	: 3	// sms successfully passed to provider
	,sms_pending 	: 4	// sms is pending in operator's network
	,sms_delivered 	: 5	// sms has been delivered into the destination mobile mobile
	,sms_discarded 	: 6	// sms has timed out in operator's network and has been deleted
	,sms_retained 	: 7	// at the moment it had to be sent, the group option sendSMSs was set to 'No'
	,sms_iso 		: 8	// destination number is equal to expeditor number
	,sms_error 		: 9	// error when trying to deliver to operator
	,sms_dead_numb 	: 10	// bad number, operator rejected the query
	
	// css classes
	,csslist		: { x:'sms_nomobile', y:'sms_disabled', o:'sms_outdated', 0:'sms_nosms', 1:'sms_created', 2:'sms_retry', 3:'sms_handled', 4:'sms_pending', 5:'sms_delivered', 6:'sms_discarded', 7:'sms_retained', 8:'sms_iso', 9:'sms_discarded', 10:'sms_dead_numb' }
	
	// textual status
	,string			: {}
	,stringSet: function() { for(let x in this.csslist) this.string[x] = this.csslist[x]; this.string = C_XL.w(this.string); } // initial status
	,fromcode: function(statuscode) { return C_dS_sms.status.string[statuscode]; }
}
C_dS_sms.relink = function() {};
C_dS_sms.get = function(resaId, rscId, templateId) { // !! OLD DESIGN
	// When SMS is sent to a visitor, rscId is the visitor Id
	// When SMS is sent to a login, rscId is the login Id
	if(!C_dS_sms.registers.resa[resaId]) return false;
	if(!C_dS_sms.registers.resa[resaId][templateId]) return false;
	if(!C_dS_sms.registers.resa[resaId][templateId][rscId]) return false;
	return C_dS_sms.registers.resa[resaId][templateId][rscId];
}
C_dS_sms.getImgCss = function() { return 'img-sms' } // used as symbol for the SMS, in e.g. modal windows



	////////////////  E M A I L S 

function C_dS_email(p) {
	C_dS_trackingCC.apply(this,p);
	C_dS_email.defaults.mergeto(this,p,this.tmc);
	C_dS_email.registers.add(this, 'resa', this.reservationId, this.templateId, this.resourceId);
}
C_dS_email.defaults = new A_df( { reservationId:0,templateId:0,resourceId:0,sendStamp:0,mailsubject:'',mailbody:'',recipients:'',sender:'',status:0,statusChangeStamp:0 } );
C_dS_email.registers = new C_registers('resa'); 
C_dS_email.prototype = {
	title: function() { return this.mailsubject; },
	message: function() { return this.mailbody; }
}
C_dS_email.relink = function() {}
C_dS_email.getEmail = function(resaId, resourceId, templateId) { // OLD DESIGN
	if(!C_dS_email.registers.resa[resaId]) return false;
	if(!C_dS_email.registers.resa[resaId][templateId]) return false;
	if(!C_dS_email.registers.resa[resaId][templateId][resourceId]) return false;
	return C_dS_email.registers.resa[resaId][templateId][resourceId];
}
C_dS_email.get = function(resaId, resourceId, templateId) { // NEW DESIGN - harmonize with sms
	if(!C_dS_email.registers.resa[resaId]) return false;
	if(!C_dS_email.registers.resa[resaId][templateId]) return false;
	if(!C_dS_email.registers.resa[resaId][templateId][resourceId]) return false;
	return C_dS_email.registers.resa[resaId][templateId][resourceId];
}
C_dS_email.status = { 

	 eml_no_email 	: 'x'	// never stored in DB, used here to identify targets having no recipient
	,eml_disabled 	: 'y'	// never stored in DB, used here to identify toggled communications
	,eml_outdated 	: 'o' // email will never be sent, it was created after the planned delivery time
	,eml_none 		: 0
	,eml_created 	: 1	// initial status
	,eml_handled 	: 3	// email successfully passed to provider
	,eml_pending 	: 4	// email is pending in operator's network
	,eml_delivered 	: 5	// email has been delivered into the destination mobile mobile
	,eml_discarded 	: 6	// email has timed out in operator's network and has been deleted
	
	,csslist		: { x:'eml_no_email', y:'eml_disabled', o:'eml_outdated', 0:'eml_none', 1:'eml_created', 3:'eml_handled', 4:'eml_pending', 5:'eml_delivered', 6:'eml_discarded' }
	
	// textual status
	,string			: {}
	,stringSet: function() { for(let x in this.csslist) this.string[x] = this.csslist[x]; this.string = C_XL.w(this.string); } // translations
}
C_dS_email.getImgCss = function() { return 'img-email' } // used as symbol for the e-mails, in e.g. modal windows



	////////////////  N O T I F I C A T I O N S 

function C_dS_notification(p) {
	C_dS_trackingCC.apply(this,p);
	C_dS_notification.defaults.mergeto(this,p,this.tmc);
	C_dS_notification.registers.add(this, 'resa', this.reservationId, this.templateId, this.resourceId);
}
C_dS_notification.defaults = new A_df( { reservationId:0,templateId:0,resourceId:0,sendStamp:0,mailsubject:'',mailbody:'',recipients:'',sender:'',status:0,statusChangeStamp:0 } );
C_dS_notification.registers = new C_registers('resa'); 
C_dS_notification.prototype = {
	title: function() { return this.mailsubject; },
	message: function() { return this.mailbody; }
}




	////////////////  ( U N !!) P L A N N E D    C O M M U N I C A T I O N

function C_dS_cToggle(p) {
	C_dS_cToggle.defaults.mergeto(this,p);
	C_dS_cToggle.registers.resaRscMediumTempl.add(this.reservationId, this.resourceId, this.msgMedium, this.templateId, this);
}
C_dS_cToggle.defaults = new A_df( { id:0,groupId:0,reservationId:0,resourceId:0,msgMedium:0,templateId:0, onoff:0 } );
C_dS_cToggle.registers = new C_regS('resaRscMediumTempl'); 
C_dS_cToggle.isToggled = function(reservationId, resourceId, msgMedium, templateId) {
	return C_dS_cToggle.registers.resaRscMediumTempl.ends(reservationId, resourceId, msgMedium, templateId);
}
C_dS_cToggle.drop = function(reservationId) { 
	C_dS_cToggle.registers.resaRscMediumTempl.del(reservationId,1);
	return false;
}
C_dS_cToggle.onoff = function(reservationId, resourceId, msgMedium, templateId) { 
	let dS_cToggle = C_dS_cToggle.registers.resaRscMediumTempl.get(reservationId, resourceId, msgMedium, templateId);
	if(dS_cToggle) return dS_cToggle.onoff; // [0,1]
	return dS_cToggle; // undefined
}



	////////////////  T E M P L A T E S 
	

function C_dS_msgTemplate() {}
C_dS_msgTemplate.msgMerge = function(dS_tmplat, dS_resa, dS_visi /* the addressee of the message */) { 
	
		let language = mobminder.account.language;
	if(dS_visi.language == dS_tmplat.altLanguage1) language = dS_tmplat.altLanguage1;
	if(dS_visi.language == dS_tmplat.altLanguage2) language = dS_tmplat.altLanguage2;
		
		let visitarget = (dS_visi instanceof C_dS_visitor); // then this message goes to a visitor attendee of the appointment (not to a wo login)
	
	// fetch all the needed data swap
	let phpStmp = dS_resa.cueIn;
	let o_date_cueIn = new Date(phpStmp*1000);
	
	let resaNote = dS_resa.note;
	let crPosition = resaNote.indexOf('\n'); // Find position of first occurrence of a line break
	if(crPosition != -1) // then there are many lines of text in this note
		resaNote = resaNote.substring(0, crPosition); // select only the first line for the message
	resaNote = resaNote.substring(0, 40); // anyway never more than 40 characters
	
		let signatures = function(array) { // join signatures of resources
			let signas = new Array();
			for(let i in array) signas.push(array[i].signature?array[i].signature:array[i].name);
			signas = signas.length ? signas.join(' & ') : '-?-';
			return signas;
		}
		let participants = function(vs, xclude) { // join names of visitor attendees
			
			let none = C_XL.w('no visitor'); if(visitarget) none = C_XL.w('no other visitor');
			if(!vs) return none;
			let them = new Array();  
			for(let id in vs) if(id==xclude.id) continue; else them.push(vs[id].firstname[0]+'. '+vs[id].lastname+' ('+vs[id].mobile+')');
			them = them.length ? them.join(', ') : none;
			return them;
		}
		let perfnotes = function(perfs) { // join names of performances
			let pnotes = new Array(), none = ''; 
			for(let id in perfs) pnotes.push(perfs[id].note);
			pnotes = pnotes.length ? pnotes.join(', ') : none;
			return pnotes;
		}
	
		let cals = dS_resa.resources;
		let message = dS_tmplat.message; // defaults to the account language
	
	let v = {}; for(let m in mobtags.fusion) v[m] = 1; // check (*T01*)
	v.gender = C_XL.gender(dS_visi.gender, language);
	v.dear = C_XL.dear[dS_visi.gender][language];
	v.firstname = dS_visi.firstname;
	v.lastname = dS_visi.lastname;
	v.company = dS_visi.company;
	v.mobile = '+'+dS_visi.mobile;
	v.email = dS_visi.email;
	v.info = dS_visi.note;
	v.registration = dS_visi.registration;
	v.address = (dS_visi.residence?dS_visi.residence+', ':'')+dS_visi.address+' '+dS_visi.zipCode+' '+dS_visi.city;
	v.cuein = o_date_cueIn.HHmm();
	v.resadate = C_XL.date(o_date_cueIn, {abreviation:'abr', weekday:false}, language);
	v.resaday = C_XL.weekday(o_date_cueIn.getPHPday(),'full',language);
	v.resanote = resaNote; 
	v.perf = dS_resa.text.workcodes;
	v.perfnote = perfnotes(dS_resa.performances);
	v.bookingcode = dS_resa.bookingcode; 
	v.bcal = signatures(cals[class_bCal]);
	v.ucal = signatures(cals[class_uCal]);
	v.fcal = signatures(cals[class_fCal]);
	v.business = mobminder.account.name;
	v.participants = 'X'; 
		let has = { participants:~message.indexOf(mobtags.fusion.participants) };
	if(has.participants) v.participants = participants(dS_resa.visitors, visitarget?dS_visi:{});
	
	// compile the sms message
	if(language == dS_tmplat.altLanguage2) message = dS_tmplat.altMessage2;
	if(language == dS_tmplat.altLanguage1) message = dS_tmplat.altMessage1;
	for(let m in mobtags.fusion) message = message.replaceAll(mobtags.fusion[m],v[m]);
	
	return message;
}




var msgmedium = { email:139, notif:189, sms:200 };

var msgtrigger = { 	notification_on_action:0,  // value range for C_dS_sms/email/notifTemplate.triggerId  // see (*mt01*)
					notification_manual:99, 
					notification_HminusX:90, 
					notification_onVisitor:80, 
					notification_onBirthday:81 }
					


	////////////////  E M A I L     T E M P L A T E S 
	
function C_dS_notifTemplate(p) {

	C_dS_trackingCCD.apply(this,p);
	C_dS_notifTemplate.defaults.mergeto(this,p,this.tmc);

	if(this.id>0) { // virtuals are not registered, so they are not displayed in the plus list when a new one is made
		C_dS_notifTemplate.registers.id.add(this.id, this);
		C_dS_notifTemplate.registers.trigger.add(this.triggerClass, this.target, this.id, this);
		C_dS_notifTemplate.registers.target.add(this.target, this.triggerClass, this.id, this);
	}
};
(C_dS_notifTemplate.reset = function() {
	C_dS_notifTemplate.registers = new C_regS('id','trigger','target'); 
})();
C_dS_notifTemplate.defaults = new A_df( { name:'', title:'', message:''
	, deliveryTime:72000, deliveryDelay:0, triggerId:0, triggerClass:class_resa_any, presenceList:0, advance:60, sendComms:1, target:class_visitor
	, altLanguage1:255, altTitle1:'', altMessage1:'', altLanguage2:255, altTitle2:'', altMessage2:''
	, filterOnActions:0, filterOnLogins:0, filterOnResources:0, filterOnWorkcodes:0, actions:7, logins:'', resources:'', workcodes:''
	} );
C_dS_notifTemplate.prototype = {
	isEnabled: function(dS_resa, rscId) {
		
		// assess is enabled by setup
			let autosend = this.isautosend(dS_resa); // [0,1] is it default enabled or disabled as per template config setup
			let notbyme = 1; // this.notbyme(rscId); // [0 = do not send, 1 = the surfer is not the addressee of the message or notbyme is not active]
		let enabled = autosend*notbyme;
		
		// assess is user has intentionally changed the setup setting
			let onoff = C_dS_cToggle.onoff(dS_resa.id, rscId, msgmedium.notif, this.id); // [undefined, 0, 1], undefined when no user change is recorded
		if(onoff!==undefined) enabled = onoff; // fallback on user choice
		
		// console.log('notif isEnabled(dS_resa '+rscId+', C_dS_notifTemplate '+this.id+', resource:'+rscId+')=',', toggled:',onoff,', notbyme:',notbyme,' FINAL:',(enabled?'YES':'NO'));
		return enabled;
	},
	hasDevice: function(id) { // dS_target is an dS_visitor or the person associated with the login of a group resource
		let dS_target = false;
		switch(this.target) {
			case reminder_target_visitor: 
				dS_target = C_dS_visitor.get(id); // that is an dS_visitor
				break;
			case reminder_target_bCal:
			case reminder_target_uCal:
			case reminder_target_fCal: 
				let dS_resource = C_dS_resource.get(id);
				if(dS_resource.dS_login)
					dS_target = dS_resource.dS_login;
				else return false; // no login associated
				break;
		}
		if(!dS_target.touch) return false; // touch is not implemented so far, should come with firebase implementation
		return true;
	},
	tname: function() {
		let n = this.name;
		if(verboseOn) n = '('+this.id+') '+n;
		return n;
	},
	isautosend: function(dS_resa) { // returns the autosend data based on sendComms setting and current calendar day
		let autosend = this.sendComms; // ranges [ 0,1,2 ]
		if(autosend==2) { // sendComm value 2 auto-activates only when displayed reservation is in the current day (today from surfer perspective)
			autosend = 1;
			// if(!dS_resa.is.soon) autosend = 0; // see here (*ic10*) we don't do it because it posts comm_toggles that will also affect other logins
		}
		// console.log('autosend(dS_resa)',autosend);
		return autosend; // [0,1]
	},
	notbyme: function(rscId) { // returns 0 if communication should be inhibited, 1 if communication goes through
		if(this.target==class_visitor) return 1; // does not apply to visitors as addressees
				let dS_login = C_dS_login.get('config',rscId);
			let notbyme = dS_login.notbyme; // the addressee does not wish to get notifications on his own actions
			let surfid = mobminder.context.surfer.id; // the actual current user of the webapp, performing action on screen now
			let addrid = dS_login.id; // the adressee login id
		if(notbyme) if(surfid == addrid) return 0; // the actual webapp surfer is that specific adressee
		return 1;
	}
}
C_dS_notifTemplate.msgMedium = msgmedium.notif;
C_dS_notifTemplate.childs = C_dS_notification;
C_dS_notifTemplate.get = function(id) { 
	return C_dS_notifTemplate.registers.id.get(id);
}
C_dS_notifTemplate.byTrigger = function(triggerClass) {
	let nothing = new Array();
	if(!C_dS_notifTemplate.registers.trigger.get(triggerClass)) return nothing;
	return C_dS_notifTemplate.registers.trigger.get(triggerClass);
};
C_dS_notifTemplate.targetCount = function(targetClass) {
	return C_dS_notifTemplate.registers.target.ends(targetClass);
};
C_dS_notifTemplate.recepient = function(dS_target) { // o_dS_target is an o_dS_visitor or a o_dS_login
	return dS_target.touch || false;
};
C_dS_notifTemplate.plus = function() { // generic interface to C_iPLUS
	this.genome = {}
	this.plusmay = permissions.may(pc.cr_comm);
	this.eid = '_ntft_';
	this.list = function() {
		let templates = C_dS_notifTemplate.get();
		let labels = [], order = [];
		for(let id in templates) if(id!=0) { 
			let templ = templates[id];
			labels[id] = templ.name; if(verboseOn) labels[id] = templ.id+' '+labels[id];
			order.push(id); 
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {
		return new C_dS_notifTemplate();
	}
	this.get = function(id) {
		return C_dS_notifTemplate.registers.id.get(id);
	}
}
C_dS_notifTemplate.del = function(id) {
	let item = C_dS_notifTemplate.get(id);
	C_dS_notifTemplate.registers.del(item);
}




	////////////////  E M A I L     T E M P L A T E S 
	
function C_dS_emailTemplate(p) {

	C_dS_trackingCCD.apply(this,p);
	C_dS_emailTemplate.defaults.mergeto(this,p,this.tmc);

	if(this.id>0) { // virtuals are not registered, so they are not displayed in the plus list when a new one is made
		C_dS_emailTemplate.registers.id.add(this.id, this);
		C_dS_emailTemplate.registers.trigger.add(this.triggerClass, this.target, this.id, this);
		C_dS_emailTemplate.registers.target.add(this.target, this.triggerClass, this.id, this);
	}
	// this.msgMedium = msgmedium.email;
};
(C_dS_emailTemplate.reset = function() {
	C_dS_emailTemplate.registers = new C_regS('id','trigger','target'); 
})();
C_dS_emailTemplate.defaults = new A_df( { name:'', subject:'', message:''
	, deliveryTime:72000, deliveryDelay:0, triggerId:0, triggerClass:class_resa_any, presenceList:0, advance:60, sendComms:1, target:class_visitor
	, altLanguage1:255, altSubject1:'', altMessage1:'', altLanguage2:255, altSubject2:'', altMessage2:''
	, filterOnActions:0, filterOnLogins:0, filterOnResources:0, filterOnWorkcodes:0, actions:7, logins:'', resources:'', workcodes:''
	} );
C_dS_emailTemplate.prototype = {
	isEnabled: function(dS_resa, rscId) {
		
		// assess is enabled by setup
			let autosend = this.isautosend(dS_resa); // [0,1] is it default enabled or disabled as per template config setup
			let notbyme = 1; // this.notbyme(rscId); // [0 = do not send, 1 = the surfer is not the addressee of the message or notbyme is not active]
		let enabled = autosend*notbyme;
		
		// assess is user has intentionally changed the setup setting
			let onoff = C_dS_cToggle.onoff(dS_resa.id, rscId, msgmedium.email, this.id); // [undefined, 0, 1], undefined when no user change is recorded
		if(onoff!==undefined) enabled = onoff; // fallback on user choice
		
		// console.log('email isEnabled(dS_resa '+rscId+', C_dS_emailTemplate '+this.id+', resource:'+rscId+')',', toggled:',onoff,', notbyme:',notbyme,' FINAL:',(enabled?'YES':'NO'));
		return enabled;
	},
	hasEmail: function(resourceId) { // dS_target is an dS_visitor or an dS_person associated with the login of a group resource
		let dS_target = false;
		switch(this.target) {
			case reminder_target_visitor: 
				dS_target = C_dS_visitor.get(resourceId); // that is an dS_visitor
				break;
			case reminder_target_bCal:
			case reminder_target_uCal:
			case reminder_target_fCal: 
				let dS_resource = C_dS_resource.get(resourceId);
				if(dS_resource.dS_login)
					dS_target = dS_resource.dS_login;
				else return false; // no login associated
				break;
		}
		if(!dS_target.email) return false;
		return true;
	},
	tname: function() {
		let n = this.name;
		if(verboseOn) n = '('+this.id+') '+n;
		return n;
	},
	isautosend: function(dS_resa) { // returns the autosend data based on sendComms setting and current calendar day
		let autosend = this.sendComms; // ranges [ 0,1,2 ]
		if(autosend==2) { // sendComm value 2 auto-activates only when displayed reservation is in the current day (today from surfer perspective)
			autosend = 1;
			// if(!dS_resa.is.soon) autosend = 0; // see here (*ic10*) we don't do it because it posts comm_toggles that will also affect other logins		}
		}
		return autosend; // [0,1]
	},
	notbyme: function(rscId) { // returns 0 if communication should be inhibited, 1 if communication goes through
		if(this.target==class_visitor) return 1; // does not apply to visitors as addressees
				let dS_login = C_dS_login.get('config',rscId);
			let notbyme = dS_login.notbyme; // the addressee does not wish to get notifications on his own actions
			let surfid = mobminder.context.surfer.id; // the actual current user of the webapp, performing action on screen now
			let addrid = dS_login.id; // the adressee login id	
		if(notbyme) if(surfid == addrid) return 0; // the actual webapp surfer is that specific adressee
		return 1;
	}
}
C_dS_emailTemplate.msgMedium = msgmedium.email;
C_dS_emailTemplate.childs = C_dS_email;
C_dS_emailTemplate.get = function(id) { 
	return C_dS_emailTemplate.registers.id.get(id);
}
C_dS_emailTemplate.byTrigger = function(triggerClass) {
	let nothing = new Array();
	if(!C_dS_emailTemplate.registers.trigger.get(triggerClass)) return nothing;
	return C_dS_emailTemplate.registers.trigger.get(triggerClass);
};
C_dS_emailTemplate.targetCount = function(targetClass) {
	return C_dS_emailTemplate.registers.target.ends(targetClass);
};
C_dS_emailTemplate.recepient = function(dS_target) { // o_dS_target is an o_dS_visitor or a o_dS_login
	return dS_target.email || false;
};
C_dS_emailTemplate.plus = function() { // generic interface to C_iPLUS
	this.genome = {}
	this.plusmay = permissions.may(pc.cr_comm);
	this.eid = '_emlt_';
	this.list = function() {
		let templates = C_dS_emailTemplate.get();
		let labels = [], order = [];
		for(let id in templates) if(id!=0) { 
			let templ = templates[id];
			labels[id] = templ.name; if(verboseOn) labels[id] = templ.id+' '+labels[id];
			order.push(id); 
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {
		return new C_dS_emailTemplate();
	}
	this.get = function(id) {
		return C_dS_emailTemplate.registers.id.get(id);
	}
}
C_dS_emailTemplate.del = function(id) {
	let item = C_dS_emailTemplate.get(id);
	C_dS_emailTemplate.registers.del(item);
}



	////////////////  S M S     T E M P L A T E S 

function C_dS_smsTemplate(p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_smsTemplate.defaults.mergeto(this,p,this.tmc);
	this.subject = ''; // keeps coherence with C_dS_emailTemplate

	if(this.id>0) { // virtuals are not registered, so they are not displayed in the plus list when a new one is made
		C_dS_smsTemplate.registers.id.add(this.id, this);
		C_dS_smsTemplate.registers.trigger.add(this.triggerClass, this.target, this.id, this);
		C_dS_smsTemplate.registers.target.add(this.target, this.triggerClass, this.id, this);
	}
	this.xmon = new Array();
	
	// this.msgMedium = msgmedium.sms;
};
C_dS_smsTemplate.defaults = new A_df( { name:'', message:''
	, deliveryTime:72000, deliveryDelay:0, triggerId:0, triggerClass:class_resa_any, presenceList:0, advance:60, pages:1, sendComms:1, target:class_visitor
	, smsgateaway:'shortcode', encoding:'ascii7', priority:0, inboundaction:'ignore', autoreplymsg:''
	, altLanguage1:255, altMessage1:'', altLanguage2:255, altMessage2:''
	, filterOnActions:0, filterOnLogins:0, filterOnResources:0, filterOnWorkcodes:0, actions:7, logins:'', resources:'', workcodes:''
	} );
C_dS_smsTemplate.prototype = {
	isEnabled: function(dS_resa, rscId) {
		
		// assess is enabled by setup
			let autosend = this.isautosend(dS_resa); // [0,1] is it default enabled or disabled as per template config setup
			let notbyme = 1; // this.notbyme(rscId); // [0 = do not send, 1 = the surfer is not the addressee of the message or notbyme is not active]
		let enabled = autosend*notbyme;
		
		// assess is user has intentionally changed the setup setting
			let onoff = C_dS_cToggle.onoff(dS_resa.id, rscId, msgmedium.sms, this.id); // [undefined, 0, 1], undefined when no user change is recorded
		if(onoff!==undefined) enabled = onoff; // fallback on user choice
		
		if(vbs) vlog('dataset.js','C_dS_smsTemplate','isEnabled','(dS_smsTemplate '+this.id+', dS_resa '+rscId+', rscId:'+rscId+') => '+' toggled:'+onoff+', autosend:'+autosend+', notbyme:'+notbyme+' FINAL:'+(enabled?'YES':'NO'));
		return enabled;
	},
	hasMobile: function(resourceId) { // dS_target is a dS_visitor or an dS_person associated with the login of a group resource
		let dS_target = false;
		switch(this.target) {
			case reminder_target_visitor: 
				dS_target = C_dS_visitor.get(resourceId); // that is a dS_visitor
				break;
			case reminder_target_bCal:
			case reminder_target_uCal:
			case reminder_target_fCal: 
				let dS_resource = C_dS_resource.get(resourceId);
				if(dS_resource.dS_login)
					dS_target = dS_resource.dS_login;
				else return false; // no login associated
				break;
		}
		if(!dS_target.mobile) return false;
		return true;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; },
	tname: function() {
		let n = this.name;
		if(verboseOn) n = '('+this.id+') '+n;
		return n;
	},
	isautosend: function(dS_resa) { // returns the autosend data based on sendComms setting and current calendar day
		let autosend = this.sendComms; // ranges [ 0,1,2 ]
		if(autosend==2) { // sendComm value 2 auto-activates only when displayed reservation is in the current day (today from surfer perspective)
			autosend = 1;
			// if(!dS_resa.is.soon) autosend = 0; // see here (*ic10*) we don't do it because it posts comm_toggles that will also affect other logins
		}
		
		if(vbs) vlog('dataset.js','C_dS_smsTemplate','isautosend','(dS_smsTemplate '+this.id+', dS_resa '+dS_resa.id+') => '+'autosend:'+autosend);

		return autosend; // [0,1]
	},
	notbyme: function(rscId) { // returns 0 if communication should be inhibited, 1 if communication goes through
		if(this.target==class_visitor) return 1; // does not apply to visitors as addressees
		
			let dS_login = C_dS_login.get('config',rscId);
		let notbyme = dS_login.notbyme; // the addressee does not wish to get notifications on his own actions
		let surfid = mobminder.context.surfer.id; // the actual current user of the webapp, performing action on screen now
		let addrid = dS_login.id; // the adressee login id
		
	// console.log('        adressee id:'+rscId,'target class:'+this.target,'dS_template:'+this.name,'dS_login:'+dS_login.name,'dS_login.notbyme:'+dS_login.notbyme);
	
		if(notbyme) if(surfid == addrid) return 0; // the actual webapp surfer is that specific adressee
		return 1;
	}
};
(C_dS_smsTemplate.reset = function() {
	C_dS_smsTemplate.registers = new C_regS('id','trigger','target'); 
})();
C_dS_smsTemplate.msgMedium = msgmedium.sms;
C_dS_smsTemplate.childs = C_dS_sms;
C_dS_smsTemplate.get = function(id) { 
	return C_dS_smsTemplate.registers.id.get(id);
}
C_dS_smsTemplate.byTrigger = function(triggerClass) {
	let nothing = new Array();
	if(!C_dS_smsTemplate.registers.trigger.get(triggerClass)) return nothing;
	return C_dS_smsTemplate.registers.trigger.get(triggerClass);
}
C_dS_smsTemplate.targetCount = function(targetClass) {
	return C_dS_smsTemplate.registers.target.ends(targetClass);
}
C_dS_smsTemplate.count = function(triggerClass, target) {
	if(target) return C_dS_smsTemplate.registers.trigger.ends(triggerClass, target);
}
C_dS_smsTemplate.recepient = function(dS_target) { // dS_target is a dS_visitor or an dS_login (watchovers)
	return dS_target.mobile || false;
}
C_dS_smsTemplate.plus = function() { // generic interface to C_iPLUS
	this.genome = {}
	this.plusmay = permissions.may(pc.cr_comm);
	this.eid = '_smst_';
	this.list = function() {
		let templates = C_dS_smsTemplate.get();
		let labels = [], order = [];
		for(let id in templates) if(id!=0) { 
			let templ = templates[id];
			labels[id] = templ.name; if(verboseOn) labels[id] = templ.id+' '+labels[id];
			order.push(id); 
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {
		return new C_dS_smsTemplate();
	}
	this.get = function(id) {
		return C_dS_smsTemplate.registers.id.get(id);
	}
}
C_dS_smsTemplate.del = function(id) {
	let item = C_dS_smsTemplate.get(id);
	C_dS_smsTemplate.registers.del(item);
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E S O U R C E S

var reservability_buffered	= 2; 
var reservability_allday	= 1;
var reservability_scheduled = 0;

function C_dS_resource(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_resource.defaults.mergeto(this,p,this.tmc);
	
	if(this.id>0) {
		C_dS_resource.registers.id.add(this.id, this);
		C_dS_resource.registers.typeId.add(this.resourceType, this.id, this);
		C_dS_resource.instances++;
	} else {
		C_dS_resource.defaults.apply(this); // new object
	}
	
	// m�ta data
	this.xmon = new Array();
};
C_dS_resource.prototype = { // returns false or { dayIn:, hourly:, shadows:, tboxes:, offday:, daycode:, weekcode: }
	schedule: function(date) { // returns the active hourly at given date
		let hourly = false, stamp = date.stamp(), dayIn = 0;
		let chrono = C_dS_hourlyuser.chrono(this.id); // hourly users in chronological order
		for(let x in chrono) {
			if(stamp<(chrono[x].dayin|0)) break; // stop there and return the previous value
			hourly = chrono[x].hourly;
			dayIn = chrono[x].dayin;
		}
		if(!hourly) return { dayIn:0, hourly:C_dS_hourly.get(0), shadows:false, tboxes:false, offday:false, daycode:false, weekcode:false }; 
		hourly = hourly.scope(date);
		hourly.dayIn = dayIn;
		return hourly;
		// return { dayIn:dayIn, hourly:hourly.hourly, shadows:hourly.shadows, tboxes:hourly.tboxes, offday:hourly.offday, daycode:hourly.daycode, weekcode:hourly.weekcode };
	},
	getName: function() { return this.name; },
	rbullet: function() {
			let color = ' c'+this.color; // grayed when no color is chosen
			let tag = this.tag?' '+C_iSKIN.tagcss(this.tag):'';
			let inner = this.tag?'':'&nbsp;';
		let bullet = '<div style="display:inline-block;" class="bullet resource'+tag+color+'">'+inner+'</div>';
		return bullet;
	},
	rColor: function() {
		let color = ' c'+this.color; // grayed when no color is chosen
		//let tag = this.tag?' '+C_iSKIN.tagcss(this.tag):'';
		let inner = ''; //'&nbsp;';
		let bullet = '<div style="display:inline-block;" class="bullet'+color+'">'+inner+'</div>';
		return bullet;
	},
	rColoredName: function() {
		let color = ' c'+this.color; // grayed when no color is chosen
		//let tag = this.tag?' '+C_iSKIN.tagcss(this.tag):'';
		//let inner = '&nbsp;';
		let inner = this.name;
		let bullet = '<div style="display:inline-block;" class="colorresource'+color+'">'+inner+'</div>';
		return bullet;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};
C_dS_resource.defaults = new A_df( { resourceType:2,name:'new resource',color:152,tag:0,reservability:0,offsetBefore:0,offsetAfter:0,displayOrder:0,note:'',signature:'', sendComms:1, guideId:0 } );
(C_dS_resource.reset = function() {
	C_dS_resource.registers = new C_regS('id', 'typeId');
	C_dS_resource.instances = -1; // Casual counting of C_dS_resource instances
})();
C_dS_resource.displayorder = function(resctype) {
	let keyview = mobminder.context.acckey().view[resctype];
	let register = C_dS_resource.registers.typeId.get(resctype);
	let ids = [];
	if(keyview) if(keyview=='-') return ids; else return keyview.split('!'); // there is a user defined order
	for(let id in register) ids.push(id); ids.sort(function(a,b){return register[a].name<register[b].name?-1:1}); // else we display resources in alphabetical order
	return ids;
}
C_dS_resource.indisplayorder = function(resctype) {
	let ids = C_dS_resource.displayorder(resctype);
	let indexed = new Array();
	for(let x in ids) { let rscId = ids[x]; indexed[x] = C_dS_resource.registers.id.get(rscId); }
	return indexed;
}
C_dS_resource.single = function() {
	let single = !C_dS_resource.instances; // indicates single-agenda view
	if(single) for(let id in C_dS_resource.registers.id.get()) return id; // when in single mode, .single contains the id of this unique o_dS_resource
	return single;
}
C_dS_resource.options = function(resourceType, prechecked) { 
	let order = [], labels = [], presets = {};
	let indexed = C_dS_resource.indisplayorder(resourceType);
		prechecked = prechecked || {}; // if prechecked is a simple true, all options are selected (*pc1*)
	for(let x in indexed) {
		let rsc = indexed[x];
		let id = rsc.id;

		//BSP hide resource tag!!!
		//let tag = rsc.tag?'<div class="'+C_iSKIN.tagcss(rsc.tag)+'" style="font-size:1.25em; line-height:60%; width:1.5em;"></div>':'';
		let tag = false?'<div class="'+C_iSKIN.tagcss(rsc.tag)+'" style="font-size:1.25em; line-height:60%; width:1.5em;"></div>':'';
		
		order.push(id); labels[id] = tag+rsc.name;
		let tip = '<strong>'+rsc.name+'</strong>'; if(rsc.note) tip+= ':<br/>'+rsc.note;
		presets[id] = { tip:tip, checked:(prechecked===true)||(id in prechecked) }; //  (*pc1*)
	}
	let count = order.length;
	return { order:order, labels:labels, presets:presets, count:count };
}
C_dS_resource.has = function(rtype) {
	let ends = C_dS_resource.registers.typeId.ends(rtype);
	return !!ends;
}
C_dS_resource.count = function(rtype) {
	let ends = rtype?C_dS_resource.registers.typeId.ends(rtype):C_dS_resource.registers.id.ends();
	return ends;
}
C_dS_resource.get = function(id) {
	return C_dS_resource.registers.id.get(id);
}
C_dS_resource.getByType = function(type) {
	return C_dS_resource.registers.typeId.get(type);
}
C_dS_resource.ids = function(rtype) {
	let ids = new Array();
	if(rtype) {
		let register = C_dS_resource.registers.typeId.get(rtype);
		for(let id in register) ids[id] = id; // ambidextrous format
		return ids;
	} else {
		let register = C_dS_resource.registers.id.get();
		for(let id in register) ids.push(id);
		return ids;
	}
}
C_dS_resource.ACoptions = {
	trigger: 2,
	css: 'alpha16',
	fetch: function(digits, callback) { 
		let options = {};
		for(let id in C_dS_resource.registers.id.get())	
			options[id] = this.label(id);
		callback.cb(digits, options);
	},
	label: function(id) { 
		let resource = C_dS_resource.registers.id.get(id);
		return resource.name;
	},
	tip: function(id) { 
		return C_dS_resource.registers.id.get(id).name;
	}
}
C_dS_resource.plus = function(calClass) {
	this.genome = { calClass:calClass };
	
	// generic interface to C_dS_resource
	this.plusmay = this.mayadd();
	this.eid = '_cals_'+calClass;
	this.list = function() {
		let indexed = C_dS_resource.indisplayorder(calClass); // is undefined when no resource relies in the register
		let labels = [], order = [];
		this.plusmay = this.mayadd();
		for(let x in indexed) { 
			let resource = indexed[x]; let id = resource.id;
			let bullet = ''; if(resource.color) bullet = resource.rbullet();
			order.push(id); labels[id] = bullet+resource.name;
			if(verboseOn) labels[id] = id+' '+labels[id];
		}
		let register = C_dS_resource.registers.id.get();
		return { labels:labels, order:order };
	}
	this.plus = function() {
		let color = 0; if(this.genome.calClass == class_bCal) color = 173;
		return new C_dS_resource(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([this.genome.calClass, '', color, 0, 0, 0, 0, 0, '']));
	}
	this.get = function(id) {
		return C_dS_resource.registers.id.get(id);
	}
	this.ends = function() {
		return C_dS_resource.registers.typeId.ends(this.genome.calclass);
	}
}
C_dS_resource.plus.prototype = {
	mayadd: function() {
		
		let perm = false; // permissions as per login settings
		switch(this.genome.calClass) {
			case class_bCal: perm = permissions.may(pc.cr_bcals); break;
			case class_uCal: perm = permissions.may(pc.cr_ucals); break;
			case class_fCal: perm = permissions.may(pc.cr_fcals); break;
		}		
		
		let logic = false; // application logic
			let bcals = C_dS_resource.count(agClass.bCal);
		switch(this.genome.calClass) {
			case class_bCal: logic=true; break;  // check also (*xcr*)
			case class_uCal: logic=!!bcals; break; // only when some bcals exist
			case class_fCal: logic=!!bcals; break; // only when some bcals exist
		}		
		return perm&&logic;
	}
}


C_dS_resource.names = {  // watch out ! mobile app has copied this list, if you add another alias here, you need to add it also in the smartphone baseline
	
	// procedure to add one more item in this list:
	// - you need the single and plural translations (e.g. salesmen and salesman)
	// - you add the plural version here ( follow (*d01*) )
	// - you add the pointer to the single version in language.js::C_XL.setContextLanguage ( follow (*d01*) )
	// - you add the plural and single translations to language.js
	
	resources:00, workrooms:10, workplaces:20, classrooms:25, carerooms:30, 
	collaborators:40, assistants:50, doctors:60, practitioners:61,
	technicians:70, consultants:71, instructors:72, experts:73, dentists:74, salesmen:75, teachers:76, // (*d01*)
	equipments:80, offices:90, tools:100, vehicules:110,
	companies:150, 
	
	options: function() {  
		let order = [];
		let names = C_dS_resource.names;
		let sections = C_XL.w({ 9:'places', 39:'people', 79:'assets', 149:'miscel' });
		let labels = {
			9: C_XL.w({ 
				10:'workrooms',
				20:'workplaces',
				25:'classrooms',
				30:'carerooms'
				}),
			39: C_XL.w({ 
				40:'collaborators',
				50:'assistants',
				60:'rdoctors',
				61:'practitioners',
				70:'technicians',
				71:'consultants',
				72:'instructors',
				73:'experts',
				74:'dentists',
				75:'salesmen', // (*d01*)
				76:'teachers'
				}),
			79: C_XL.w({ 
				80:'equipments',
				90:'offices',
				100:'tools',
				110:'vehicules'
				}),
			149: C_XL.w({ 
				150:'companies'
				})
		};
		order = { 9:new Array(), 39:new Array(), 79:new Array(), 149:new Array() }; 			
		for(let s in labels) { // s is the section id
			for(let x in labels[s]) order[s].push(x);
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
			order[s].sort(sortrule);
		}
		let labelsmerge = { 0:C_XL.w('resources') };
		for(let s in sections) {
			labelsmerge[s] = sections[s];
			for(let i in labels[s]) labelsmerge[i] = labels[s][i];
		}
		let ordermerge = new Array(); ordermerge.push(0);
		for(let s in order) {
			ordermerge.push(s);
			for(let i in order[s]) ordermerge.push(order[s][i]);
		}
			let count = ordermerge.length;
			let bullet = C_XL.w('bullet down');
		let lockies = { 9:{section:bullet}, 39:{section:bullet}, 79:{section:bullet}, 149:{section:bullet} };
		
		return { order:ordermerge, labels:labelsmerge, presets:lockies, count:count };
		
		// for(let x in that.english) { labels[that[x]]=C_XL.w(that.english[x]); order.push(that[x]); }
		// let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
		// return { order:order, labels:labels, presets:false, count:order.length };
	},
	preset: function(calclass) { let preset=new Array(); preset[mobminder.account.rescTypeNames[calclass]] = { set:true }; return preset; }
}
C_dS_resource.whichboxing = function(rscIds) { // rscIds is an array like [ rscId1, rscId2, rscId3, ... ]
	let tboxings = new Array();
	for(let x in rscIds) {
		let rscId = rscIds[x];
		let huser = C_dS_hourlyuser.first(rscId);
		let timeboxingId;
		while(huser) {
			let theseboxings = C_dS_timebox.whichtboxing(huser.hourlyId); 
			for(timeboxingId in theseboxings) tboxings[timeboxingId] = 1;
			huser=huser.next; // watch the position of this statement
		}
	}
	keys = arrayKEYS(tboxings);
	return keys;
}
C_dS_resource.del = function(id) {
	let item = C_dS_resource.get(id);
	C_dS_resource.registers.del(item);
}



function C_dbSynchro(id,groupId,skeyId,localId,remoteId) {
		this.tmc = 5; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dbSynchro.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dbSynchro','constructor','id:'+this.id+', skeyId:'+this.skeyId+', localId:'+this.localId+', remoteId:'+this.remoteId);
		this.tracking = C_dS_ID.prototype.display;
}
C_dbSynchro.defaults = new A_df( { skeyId:0, localId:0, remoteId:'' } );


function C_dS_synchro_resource(p) {
	
	C_dbSynchro.apply(this,p);
	C_dS_synchro_resource.defaults.mergeto(this,p,this.tmc);
	
	if(this.id>0) {
		C_dS_synchro_resource.registers.id.add(this.id, this);
		C_dS_synchro_resource.registers.keyrid.add(this.skeyId, this.localId, this);
	} else {
		C_dS_synchro_resource.defaults.apply(this); // new object
	}
};
C_dS_synchro_resource.prototype = {
};
C_dS_synchro_resource.defaults = new A_df( { } );
(C_dS_synchro_resource.reset = function() {
	C_dS_synchro_resource.registers = new C_regS('id', 'keyrid');
})();
C_dS_synchro_resource.options = function(keyid, resourceType) { 
	let order = [], labels = [], presets = {};
	let indexed = C_dS_resource.indisplayorder(resourceType);
	if(vbs) vlog('dbAccess','C_dbSynchro','options','skeyId:'+keyid+', resourceType:'+resourceType);

	for(let x in indexed) {
		let rsc = indexed[x];
		let rid = rsc.id;
		let sync = C_dS_synchro_resource.registers.keyrid.get(keyid, rid);
		let remoteId = sync?sync.remoteId:'';
		order.push(rid); labels[rid] = rsc.name;
		presets[rid] = remoteId; // to be replaced by remoteId from the C_dS_synchro_resource.registers
	}
	let count = order.length;
	return { order:order, labels:labels, presets:presets, count:count };
}
C_dS_synchro_resource.get = function(skeyid, localId) {
	return C_dS_synchro_resource.registers.keyrid.get(skeyid, localId);
}

function C_dS_synchro_ccss(p) {
	
	C_dbSynchro.apply(this,p);
	C_dS_synchro_ccss.defaults.mergeto(this,p,this.tmc);
	
	if(this.id>0) {
		C_dS_synchro_ccss.registers.id.add(this.id, this);
		C_dS_synchro_ccss.registers.keyrid.add(this.skeyId, this.localId, this);
	} else {
		C_dS_synchro_ccss.defaults.apply(this); // new object
	}
};
C_dS_synchro_ccss.prototype = { };
C_dS_synchro_ccss.defaults = new A_df( { } );
(C_dS_synchro_ccss.reset = function() {
	C_dS_synchro_ccss.registers = new C_regS('id', 'keyrid');
})();
C_dS_synchro_ccss.options = function(keyid, ccssclass, ccsstype) { 
	let ccss = C_dS_customCss.options(ccssclass, ccsstype, false, { defxclusive:true, stickeratright:true });
		for(let id in ccss.labels) {
			let sync = C_dS_synchro_ccss.registers.keyrid.get(keyid, id);
			let remoteId = sync?sync.remoteId:'';
			ccss.presets[id] = remoteId;
		}
	return  ccss;
}
C_dS_synchro_ccss.get = function(skeyid, localId) {
	return C_dS_synchro_ccss.registers.keyrid.get(skeyid, localId);
}

function C_dS_synchro_reservation(p) {
	
	C_dbSynchro.apply(this,p);
	C_dS_synchro_reservation.defaults.mergeto(this,p,this.tmc);
	
	if(this.id>0) {
		C_dS_synchro_reservation.registers.id.add(this.id, this);
		C_dS_synchro_reservation.registers.keyrid.add(this.skeyId, this.localId, this);
	} else {
		C_dS_synchro_reservation.defaults.apply(this); // new object
	}
};
C_dS_synchro_reservation.prototype = { };
C_dS_synchro_reservation.defaults = new A_df( { } );
(C_dS_synchro_reservation.reset = function() {
	C_dS_synchro_reservation.registers = new C_regS('id', 'keyrid');
})();
C_dS_synchro_reservation.get = function(skeyid, localId) {
	return C_dS_synchro_reservation.registers.keyrid.get(skeyid, localId);
}


function C_dS_synchro_visitor(p) {
	
	C_dbSynchro.apply(this,p);
	C_dS_synchro_visitor.defaults.mergeto(this,p,this.tmc);
	
	if(this.id>0) {
		C_dS_synchro_visitor.registers.id.add(this.id, this);
		C_dS_synchro_visitor.registers.keyrid.add(this.skeyId, this.localId, this);
	} else {
		C_dS_synchro_visitor.defaults.apply(this); // new object
	}
};
C_dS_synchro_visitor.prototype = { };
C_dS_synchro_visitor.defaults = new A_df( { } );
(C_dS_synchro_visitor.reset = function() {
	C_dS_synchro_visitor.registers = new C_regS('id', 'keyrid');
})();
C_dS_synchro_visitor.get = function(skeyid, localId) {
	return C_dS_synchro_visitor.registers.keyrid.get(skeyid, localId);
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    S E C R E T A R Y     G U I D E L I N E S 

function C_dS_guidelines(p) {
		
	C_dS_trackingCC.apply(this,p);
	C_dS_guidelines.defaults.mergeto(this,p,this.tmc);
	if(this.id>0)
		C_dS_guidelines.register.id.add(this.id, this);
	
	// meta
	if(this.mobile) if(this.mobile[0]!='0') this.mobile = '+'+this.mobile;
}
C_dS_guidelines.defaults = new A_df( { 
	name:'', address:'', zipCode:'',  city:'', country:'', email:'', mobile:'', phone:'', language:0, registration:'', directions:''
	, newvisi:'', appguide:'', reqguide:'', neverdo:'', tipstricks:'' } );
(C_dS_guidelines.reset = function() {
	C_dS_guidelines.register = new C_regS('id');
})();
C_dS_guidelines.plus = function() {
	this.genome = {};
	
	// generic interface to C_iPLUS
	this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.supervisor);
	this.eid = '_wrk';
	this.list = function() {
		let labels = [], order = [];
		let register = C_dS_guidelines.register.id.get();
		for(let id in register) {
			let dataset = register[id];
			labels[id] = dataset.name;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		return new C_dS_guidelines([0]);
	};
	this.get = function(id) {
		return C_dS_guidelines.register.id.get(id);
	}
}
C_dS_guidelines.get = function(id) { return C_dS_guidelines.register.id.get(id); }
C_dS_guidelines.del = function(id) {
	let item = C_dS_guidelines.register.id.get(id);
	
	// also delete references of this item in C_dS_resource registers
	let register = C_dS_resource.registers.id.get();
	for(let x in register) if(register[x].guideId == id) register[x].guideId = 0;

	C_dS_guidelines.register.del(item);
}
C_dS_guidelines.options = function() { // for usage with C_iDDWN
	let labels = { 0:C_XL.w('no guideline') };
		let register = C_dS_guidelines.register.id.get();
		for(let x in register) labels[register[x].id] = register[x].name;
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	let count = order.length;
	return { order:order, labels:labels, presets:{}, count:count };
}
C_dS_guidelines.tip = function(dS_resource) {
	let tip = dS_resource.note.htmlize();
	if(dS_resource.guideId) {
		let gtitle = function(english) { return '<strong>'+C_XL.w(english)+':'+'</strong>';};
		let g = C_dS_guidelines.register.id.get(dS_resource.guideId); if(!g) return tip;
		let separator = '<hr/>';
		if(g.directions) 	tip += (tip?separator:'')+gtitle('coordinates')+'<br/>'+g.directions.htmlize();
		if(g.newvisi) 		tip += (tip?separator:'')+gtitle('new visitor')+'<br/>'+g.newvisi.htmlize();
		if(g.appguide) 		tip += (tip?separator:'')+gtitle('appointment')+'<br/>'+g.appguide.htmlize();
		if(g.reqguide) 		tip += (tip?separator:'')+gtitle('gdl requests')+'<br/>'+g.reqguide.htmlize();
		if(g.neverdo) 		tip += (tip?separator:'')+gtitle('gdl never')+'<br/>'+g.neverdo.htmlize();
		if(g.tipstricks) 	tip += (tip?separator:'')+gtitle('gdl tips')+'<br/>'+g.tipstricks.htmlize();
	}
	return tip;
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    H O U R L I E S


////////////////   T I M E     B O X I N G 

function C_dS_timeboxing(p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_timeboxing.defaults.mergeto(this,p,this.tmc);
	// meta
	if(this.id > 0) {
		C_dS_timeboxing.registers.id.add(this.id, this);
	}
	
	// meta	
	this.cssName = 'c'+this.color;
	if(this.pattern) this.cssName += ' p'+this.pattern;
	this.used = true; // true when at least one hourly refers to this timeboxing
};
C_dS_timeboxing.defaults = new A_df( { name:'', color:0, pattern:0, tag:0, note:'', exclusive:0 } );
(C_dS_timeboxing.reset = function() {
	C_dS_timeboxing.registers = new C_regS('id');
})();
C_dS_timeboxing.prototype = {
	xbullet: function() {
			let tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			let inner = this.tag?'':'&nbsp;';
		return '<div style="display:inline-block;" class="bullet tboxing '+tag+this.cssName+'">'+inner+'</div>';
	}
}
C_dS_timeboxing.get = function(id) { return C_dS_timeboxing.registers.id.get(id); }
C_dS_timeboxing.has = function() { return !!C_dS_timeboxing.registers.id.ends(); }
C_dS_timeboxing.cresta = function(presets, only) { // options for C_iCRESTA instance, only is an array of ids to be selected like [tid1, tid2, tid3, ...]
		// time boxing options are used in M_SHADOW, in M_WRKCD and on the R_search
		let labels = {}, order=new Array(), preset = [];
		let tboxings = C_dS_timeboxing.get();
			if(only) only = arrayINVERT(only);
		for(let id in tboxings) { 
			if(only) if(!(id in only)) continue;
			preset[id] = false; 
			labels[id] = tboxings[id].xbullet()+tboxings[id].name; order.push(id); 
		};
		if(presets) for(let id in presets) if(preset[id]!==undefined) if(id in labels) preset[id] = true;
		
		order.sort(function(a,b){return (tboxings[a].name>tboxings[b].name)?1:-1; });
		return { count:order.length, order:order, labels:labels, presets:preset }	
}
C_dS_timeboxing.plus = function() {
	this.genome = {  }
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.ch_hourly);
	this.eid = '_tbx_';
	this.list = function() {
		let tboxings = C_dS_timeboxing.get();
		let labels = [], order = [];
		for(let id in tboxings) if(id!=0) { // id's == 0 are the defaults css
			let dS = tboxings[id];
			let label = dS.xbullet()+dS.name; 
			if(verboseOn) label = dS.id+' '+label;
			if(dS.exclusive) label+='<span style="font-size:80%; font-weight:bold;">&nbsp;(*'+C_XL.w('exclusive tboxing')+')</span>';
			labels[id] = label; order.push(id); 
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {	
			let color = 254 /* midyellow */;
			let pattern = 0 /* none */;
			let tag = 0 /* none */;
		return new C_dS_timeboxing(C_dS_trackingCCD.tnew(-1, mobminder.account.id).concat(['', color, pattern, tag, '']));
	}
	this.get = function(id) {
		return C_dS_timeboxing.registers.id[id];
	}
}
C_dS_timeboxing.del = function(id) {
	let item = C_dS_timeboxing.get(id);
	C_dS_timeboxing.registers.del(item);
}


////////////////   T I M E     B O X E S


function C_dS_timebox(p) {  // class name is important for stickers 
	// grouped by hourly id, css specified by time boxing reference
	C_dS_timebox.defaults.mergeto(this,p);
	
	//meta data
	this.midnight = 0;
	this.next = false; this.previous = false; // pointer to next shadow or timebox in the same dayCode (used for dragging function in P_hourly)
	
	this.css = 'timebox '+C_dS_timeboxing.get(this.timeboxingId).cssName; // will set according to the time boxing specification

	C_dS_timebox.registers.hastbx.add(this.groupId, this.timeboxingId, this.id, this); // by hourlyId, identifies the tboxing used
	C_dS_timebox.registers.hourly.add(this.groupId, this.dayCode, this.id, this);
	C_dS_timebox.registers.tboxing.add(this.timeboxingId, this.dayCode, this.id, this);
	C_dS_timebox.registers.byid.add(this.id, this);
};
C_dS_timebox.defaults = new A_df({id:0,groupId:0,timeboxingId:0,cueIn:0,cueOut:0,dayCode:0});
C_dS_timebox.prototype = {
	clone: function() {
		return  {oclass:C_dS_timebox, id:this.id
				,groupId:this.groupId,timeboxingId:this.timeboxingId
				,cueIn:this.cueIn,cueOut:this.cueOut,dayCode:this.dayCode
				,midnight:this.midnight,next:this.next,previous:this.previous,css:this.css
				};
	}
};
(C_dS_timebox.reset = function() {
	C_dS_timebox.registers = new C_regS('hourly', 'tboxing', 'byid', 'hastbx'); // register[hourlyId][dayCode][id] = o_dS_shadow;
})();
C_dS_timebox.get = function(id) {
	return C_dS_timebox.registers.byid.get(id);
};
C_dS_timebox.drop = function(hourlyId, daycode) {
	let boxes = C_dS_timebox.registers.hourly.get(hourlyId, daycode);
	for(let id in boxes) { let item = boxes[id]; C_dS_timebox.registers.del(item); };
};
C_dS_timebox.whichtboxing = function(hourlyId) {
	let register = C_dS_timebox.registers.hastbx.get(hourlyId);
	return register; // like register[timeboxingId][tboxId] = dS_timebox
}
C_dS_timebox.del = function(hourlyId) {
	let items = C_dS_timebox.registers.hourly.get(hourlyId);
	for(dc in items) 
		for(let id in items[dc]) C_dS_timebox.registers.del(items[dc][id]);
}
	
////////////////   S H A D O W S 

var shadow_normal = 0;
var shadow_except = 1; // values for field C_dS_shadow.exceptional
var shadow_block = 	2; // unused ? remove me
var shadow_offday = 5;
	
function C_dS_shadow(p) { // class name is important for stickers

	// grouped by hourly id, css specified by dS_hourly
	
	C_dS_shadow.defaults.mergeto(this,p);
	
	//meta data
	this.midnight = 0;
	this.next = false; this.previous = false; // pointer to next shadow in the same dayCode (used for dragging function in P_hourly)
	this.assess = this.exceptional; // use identical semantic for assess in dataSet_reservation, see 'this.cueable.assess'
	this.css = ''; // will be set by the parent hourly
	C_dS_shadow.registers.hourly.add(this.groupId, this.dayCode, this.id, this);
	C_dS_shadow.registers.byid.add(this.id, this);
	
	if(this.exceptional == shadow_except) C_dS_shadow.has.exceptional++;
};
C_dS_shadow.defaults = new A_df({id:0,groupId:0,cueIn:0,cueOut:0,dayCode:0,exceptional:0});
C_dS_shadow.prototype = {
	clone: function() {
		return  {oclass:C_dS_shadow /* check sticker.class.name */ , id:this.id,groupId:this.groupId
				,cueIn:this.cueIn,cueOut:this.cueOut,dayCode:this.dayCode,exceptional:this.exceptional
				,midnight:this.midnight,next:this.next,previous:this.previous,assess:this.assess,css:this.css};
	}
};
(C_dS_shadow.reset = function() {
	C_dS_shadow.has = { exceptional:0 };
	C_dS_shadow.registers = new C_regS('hourly', 'byid'); // register[hourlyId][dayCode][id] = o_dS_shadow;
})();
C_dS_shadow.get = function(id) {
	return C_dS_shadow.registers.byid.get(id);
};
C_dS_shadow.drop = function(hourlyId, daycode) {
	let shadows = C_dS_shadow.registers.hourly.get(hourlyId, daycode);
	for(let id in shadows) { 
		let item = shadows[id]; 
		C_dS_shadow.registers.del(item); 
	};
}
C_dS_shadow.del = function(hourlyId) {
	let items = C_dS_shadow.registers.hourly.get(hourlyId);
	for(let dc in items) 
		for(let id in items[dc]) C_dS_shadow.registers.del(items[dc][id]);
}
C_dS_shadow.range = function() {
	let items = C_dS_shadow.registers.byid.get();
	let c = 0, soonest = 86400, latest = 0;
	for(let id in items) {
		let dS = items[id];
		let i = dS.cueIn, o = dS.cueOut;
		if(i!=0) 
			if(i<soonest) soonest = i;
		if(o!=86400)
			if(o>latest) latest = o;
		c++;
	}
	return { count:c, soonest:soonest, latest:latest }
}

////////////////   H O U R L I E S

function C_dS_hourly(p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_hourly.defaults.mergeto(this,p,this.tmc);
	C_dS_hourly.registers.byid.add(this.id, this);
	
	// meta data
	this.shadowsreg = false;
	this.tboxesreg = false;
	this.offdays = false;
	this.first = new Array(); // first shadow, like first[daycode] = shadow
	this.last = new Array(); // last shadow, like last[daycode] = shadow
	this.link(); // binds shadows and time-boxes in a concatenated bi-directional way (using .next and .previous). Useful for anti-overlapping check
};
C_dS_hourly.defaults = new A_df({name:'default hourly',monday:0,periodicity:1,note:'',colorOff:0,colorExcp:0,colorAbsent:99});
C_dS_hourly.relink = function() {
	new C_dS_hourly(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([C_XL.w('no hourly')]));
};
C_dS_hourly.prototype = {
	dayCode: function(date) { // daycode depends on the hourly as we have some periods of 14 to 28 days in periodicity
		date.clone().toMidnight(); 
		if(!this.monday || this.periodicity==1) return date.getPHPday(); // note that exceptional hourly days have this.monday == 0
		let pDays = this.periodicity * 7; // pDays is the periodicity expressed in unit of days
		let deltaDays = Math.round((date.getPHPstamp()-this.monday) / 86400); // round because some days are 23hours long... or 25 
		while(deltaDays<0) deltaDays+=(100*pDays);
		let daycode = 1 + deltaDays % pDays;
		return daycode;
	},
	scope: function(date) {
		if(!this.shadowsreg) return { hourly:this, shadows:new Array(), offday:false }; // default hourly, has no shadows
		let daycode = this.dayCode(date); // daycode may range [0-6], [0-13], [0-20] or [0-27]
		let isoffday = this.offdays[daycode];
		let weekcode = 1+((daycode-1)/7)|0;
		return { hourly:this, shadows:this.shadowsreg[daycode], tboxes:this.tboxesreg[daycode], offday:isoffday, daycode:daycode, weekcode:weekcode }; // shadows:[shadowId] = o_dS_shadow
	},	
	dropshadows: function(daycode) { C_dS_shadow.drop(this.id, daycode); this.link(); },
	droptboxes: function(daycode) { C_dS_timebox.drop(this.id, daycode); this.link(); },
	hbullet: function() {
		let bullet = '<div class="bullet-hourly c'+this.colorExcp+'">&nbsp;</div>';
			bullet += '<div class="bullet-hourly c'+this.colorOff+'">&nbsp;</div>';
			bullet += '<div class="bullet-hourly c'+this.colorAbsent+'">&nbsp;</div>';
		return bullet;
	},
	usage: function() { // tells which resources use this hourly (with respect to this login's view!)
		let resources = C_dS_resource.getByType()
		let byuser = agClassMatrix(); // byuser[type][rscid] = { labels:labels, order:order }
		
		// bCals:
		for(let type in agClass) {
			let rtype = agClass[type];
			for(let rid in resources[rtype]) {
				let any = C_dS_hourlyuser.registers.byhourly.ends(this.id, rid);
				if(any)
					byuser[rtype][rid] = new C_dS_hourlyuser.usage(this, rid);
			}
		}
		return byuser;
	},
	
	// drag and adjust shadows sticker:
	//
	link: function() { // this function must be called again when subsidiaries do change (changing hourlies shadows)
		
		this.shadowsreg = C_dS_shadow.registers.hourly.get(this.id); // results like this.shadowsreg[dayCode][shadowId] = o_dS_shadow;
		this.tboxesreg = C_dS_timebox.registers.hourly.get(this.id) || []; // results like this.tboxesreg[dayCode][shadowId] = o_dS_timebox;
		this.offdays = new Array(); // results like this.offdays[dayCode] = true or false;
		let css = []; 
			css[shadow_normal] 	= this.colorOff;
			css[shadow_except] 	= this.colorExcp;
			css[shadow_offday] 	= this.colorAbsent; 
		let assess;
		for(let daycode in this.shadowsreg) {
			let sorted = new Array();
			for(let id in this.shadowsreg[daycode]) { // scan each shadow
				let shadow = this.shadowsreg[daycode][id];
				this.shadowsreg[daycode][id].css = 'shadow c'+css[shadow.assess];
				this.offdays[daycode] = (shadow.assess == shadow_offday);
				sorted.push(shadow);
			}
			for(let id in this.tboxesreg[daycode]) { // scan each timebox
				let timebox = this.tboxesreg[daycode][id];
				sorted.push(timebox);
			}
			sorted.sort(function(a,b) { if(a.cueIn<b.cueIn) return -1; return 1; } );
			let previous = false;
			this.first[daycode] = false; // 024 configs may have days with none shadow
			for(let x in sorted) {
				if(previous) { sorted[x].previous = previous; previous.next = sorted[x] }
					else this.first[daycode] = sorted[x];
				previous = sorted[x];
			} this.last[daycode] = previous;
		}
	}, 
	previous: function(daycode, cue, excludeId) {
		let shadow = this.last[daycode];
		if(!shadow) return false; // on this date, there is no shadow at all in the hourly (which is possible only for 024 setups)
		while(shadow.cueIn > cue || shadow.id==excludeId) { shadow = shadow.previous; };
		return shadow;
	},
	next:function(daycode, cue, excludeId) { 
		let shadow = this.first[daycode];
		if(!shadow) return false; // on this date, there is no shadow at all in the hourly (which is possible only for 024 setups)
		while(shadow.cueIn < cue || shadow.id==excludeId) { shadow = shadow.next;  };
		return shadow;
	},
	isfree: function(date, cue) {
	
	    //   AUTHORIZED CASES:
		//                                     cue
		//                                      |
		//    shadow.first           shadow   	|				    shadow
		//   ///////////|     |/////////////////|           |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//                                     
		//                                           cue
		//    shadow.first           shadow   	      |        shadow
		//   ///////////|     |/////////////////|     |     |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		
		
	    //   NOT AUTHORIZED CASES:
		//                         cue         
		//                          |           
		//    shadow.first          |   shadow   			   shadow
		//   ///////////|     |/////|///////////|           |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//                                     
		//                                                 cue 
		//                                                  |        
		//    shadow.first           shadow   	            |  shadow
		//   ///////////|     |/////////////////|           |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		
		
		let daycode = this.dayCode(date);
		let shadow = this.first[daycode];
		if(!shadow) return true; // on this date, there is no shadow at all in the hourly (which is possible only for 024 setups)
		while(shadow.cueOut <= cue) shadow = shadow.next;
		if(shadow.cueIn <= cue) return false;
		return true;
	},
	isnest: function(date, cueIn, cueOut) {
	    //   AUTHORIZED CASES:
		//
		//                   cueIn             cueOut
		//     shadow         |<--------------->|        shadow
		//   ///////////|     |                 |     |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//             cueIn             cueOut
		//     shadow   |<--------------->|              shadow
		//   ///////////|                 |           |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//                         cueIn             cueOut
		//     shadow               |<--------------->|    shadow
		//   ///////////|           |                 |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		
		
	    //   NOT AUTHORIZED CASES:
		//
		//                   cueIn                        cueOut
		//     shadow         |<--------------------------->|
		//   ///////////|     |                 |///////////|//////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//             cueIn             cueOut
		//     shadow   |<--------------->|              shadow
		//   ///////////|/////|           |           |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		//
		//                   cueIn                        cueOut
		//     shadow         |<--------------------------->|
		//   ///////////|     |     |/////////////////|     |  
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|
		
		
		let daycode = this.dayCode(date);
		let shadow1 = this.first[daycode];
		if(!shadow1) return true; // on this date, there is no shadow at all in the hourly (which is possible only for 024 setups)
		let shadowX = shadow1;
		while(shadowX.cueOut <= cueIn) shadowX = shadowX.next;
		//
		//                   cueIn                  shadowX.cueOut         
		//   shadow1          |          shadowX      |
		//   ///////////|     |     |/////////////////| 
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		if(shadowX.cueIn <= cueIn) return false;
		
		
		let shadowP = shadow1;
		while(shadowP.cueOut < cueOut) shadowP = shadowP.next;
		//
		//                   cueIn                        cueOut
		//   shadow1          |          shadowX            |         shadowP
		//   ///////////|     |     |/////////////////|     |     |////////////
		//   -----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
		if(shadowP.cueIn < cueOut) return false;
		if(shadowX!=shadowP) return false;
		
		return true;
	}
};
(C_dS_hourly.reset = function() {	
	C_dS_hourly.registers = new C_regS('byid');
})();
C_dS_hourly.options = function(options) {
		let defaults = new A_df( {exceptional:true, periodics:true} );
	options = defaults.align(options);		

	let labels = {};
	let hourlies = C_dS_hourly.registers.byid.get();
	for(let id in hourlies) {
		let hourly = hourlies[id];
		if(!options.exceptional) if(hourly.periodicity==0) continue;
		if(!options.periodics) if(hourly.periodicity!=0) continue;
		labels[id] = hourly.hbullet()+' '+hourly.name;
	}
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (hourlies[a].name>hourlies[b].name)?1:-1; }; order.sort(sortrule);
	return { order:order, labels:labels, presets:{}, count:order.length };
	
}
C_dS_hourly.get = function(id) {
	return C_dS_hourly.registers.byid.get(id);
}
C_dS_hourly.plus = function(rscid) { // shows only hourlies that are used by the given resource
	this.genome = {rscid:rscid};
	
	// generic interface to C_iPLUS
	this.plusmay = false; 
	this.eid = '_hrly';
	this.list = function() {
		let labels = [], order = [];
		let huser = C_dS_hourlyuser.first(this.genome.rscid);
		let hourly, id;
		while(huser) {
			hourly = huser.hourly();
			if(!hourly) warning('dataset.js','C_dS_hourly','plus','hourly user '+huser.id+' makes reference to undefined hourly Id:'+huser.hourlyId );
			huser=huser.next; // watch the position of this statement
			id = hourly.id; if(id in labels) continue; // do not display twice the same hourly
			if(hourly.periodicity==0) continue; // do not display exceptional days as hourly as such
			labels[id] = hourly.hbullet()+' - '+hourly.name;
			if(verboseOn) labels[id] = id+' '+labels[id];
			order.push(id);
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {
		return new C_dS_hourly(C_dS_trackingCCD.tnew(-1, mobminder.account.id).concat(['',0,1,'']));
	};
	this.get = function(id) {
		return C_dS_hourly.get(id);
	}
}
C_dS_hourly.del = function(id) {
	let item = C_dS_hourly.registers.byid.get(id);
	C_dS_hourly.registers.del(item);
	C_dS_shadow.del(id);
	C_dS_timebox.del(id);
}


////////////////   H O U R L Y     U S E R S 

function C_dS_hourlyuser(p) { // group to a resource, are streamed in last instance from server


	C_dS_hourlyuser.defaults.mergeto(this,p);
	let rscId = this.groupId;
	
	C_dS_hourlyuser.registers.byhourly.add(this.hourlyId, rscId, this.dayIn, this); // [groupId=resourceId][dayIn] = hourlyuser
	C_dS_hourlyuser.registers.bydayin.add(rscId, this.dayIn, this); // [groupId=resourceId][dayIn] = hourlyuser
	C_dS_hourlyuser.registers.changes.add(rscId, this.id, this); // [groupId=resourceId][id] = hourlyuser
	C_dS_hourlyuser.registers.byid.add(this.id, this); // [groupId=resourceId] = hourlyuser
	
	// here we check incoherence in the DB: no huser can occur twice on the same day!
	let unsorted = C_dS_hourlyuser.registers.againdayin.get(rscId);
	if(unsorted) if(this.dayIn in unsorted) {
		// then multiple hourly changes are recorded on the same date, which is not coherent
		console.log('!!! huser '+this.id+' violates dayIn rule !!! for '+sortable(this.dayIn, {y:true})+', hourly:'+this.hourlyId );
	}
	C_dS_hourlyuser.registers.againdayin.add(rscId, this.dayIn, this); // [groupId=resourceId] = hourlyuser
	
	
	this.next = false; // concatenates data sets in incremental dayIn order
	this.prev = false;
	
	// console.log('regist huser id:'+this.id+' to houlry: '+this.hourly().name+tab+'on dayin:'+sortable(this.dayIn));
	
	let sorted = C_dS_hourlyuser.registers.bydayin.get(rscId); // register[dayIn] = dS_hourlyuser
	
	
	let prevhuser = false, dS_hourlyuser;
	for(let x in sorted.order) {
		let dayin = sorted.order[x];
		dS_hourlyuser = sorted.keys[dayin];
		if(prevhuser) { dS_hourlyuser.prev = prevhuser; prevhuser.next = dS_hourlyuser; }
		prevhuser = dS_hourlyuser;
	}
	dS_hourlyuser.next = false;
};
C_dS_hourlyuser.defaults = new A_df({id:0,groupId:0,hourlyId:0,dayIn:0});
C_dS_hourlyuser.prototype = {
	hourly: function() { 
		let h = C_dS_hourly.get(this.hourlyId); 
		if(!h) warning('dataset.js','C_dS_hourlyuser','hourly','hourly user '+this.id+' makes reference to undefined hourly Id:'+this.hourlyId );
		return h;
	},
	previous: function(options) { 
		if(!options) return this.prev; 
		if(options.periodic) { // return the first periodic hourly, or false if none
			// this.loghourlyusers(); uncomment for debug purpose
			let prevhuser = this.prev;
			while(prevhuser) {
				let h = prevhuser.hourly();
				if(h) { 
					if(h.periodicity==0) prevhuser = prevhuser.prev;
					else return prevhuser; 
				}
			}
			return false;
		} 
	},
	nexton: function(options) { // options like { periodic:true, exclude:hourlyId }, if both are set, this function returns the next hourly user having alternative hourlyId 
		if(!options) return this.next; 
		if(options.periodic) { // return the first periodic hourly, or false if none
			// this.loghourlyusers();
			let nexthuser = this.next;
			while(nexthuser) {
				if(nexthuser.hourly().periodicity==0) nexthuser = nexthuser.next; // skip this non periodic hourly switch
					else if(options.exclude==nexthuser.hourlyId) nexthuser = nexthuser.next; // skip this periodic hourly switch to hourlyId
						else return nexthuser;
			}
			return false;
		} 
	},
	loghourlyusers: function() { // debug function, not called in prod operation
		// console.log('----as found in register:');
		let sorted = C_dS_hourlyuser.registers.bydayin.get(this.groupId); // register[dayIn] = dS_hourlyuser
		for(let x in sorted.order) {
			let dayin = sorted.order[x];
			let dS_hourlyuser = sorted.keys[dayin];
			// console.log('x:'+x+', id:'+dS_hourlyuser.id+tab+'dayin:'+sortable(dS_hourlyuser.dayIn)+tab+'name:'+dS_hourlyuser.hourly().name);
		}
		// console.log('----as seen after concatenation:');
		let first = sorted.keys[sorted.order[0]];
		let current = first;
		while(current) {
			// console.log('id:'+current.id+tab+'dayin:'+sortable(current.dayIn)+tab+'name:'+current.hourly().name);
			current = current.next;
		}
		// console.log('-----------------------');
	}
};
(C_dS_hourlyuser.reset = function() {
	C_dS_hourlyuser.registers = new C_regS( {name:'byhourly', sort:true}, {name:'bydayin', sort:true}, 'changes', 'byid', 'againdayin'); 
})();
C_dS_hourlyuser.plus = function(rscid) { // shows all hourly changes (including exceptional days) for a given resource
	this.genome = {rscid:rscid};
	
	// generic interface to C_iPLUS
	this.plusmay = false;
	this.eid = '_husr';
	this.list = function() {
		let labels = [], order = [];
		let huser = C_dS_hourlyuser.first(this.genome.rscid);
		let hourly, id, datein, pp;
		while(huser) {
			id = huser.id;
			hourly = huser.hourly();
			datein = new Date(huser.dayIn*1000);
			pp = huser.previous({periodic:true}); // pp is the first previous change to a periodic hourly
			huser=huser.next; // watch the position of this statement
			if(pp) if(pp.hourlyId == hourly.id) continue; // that is a comeback to the previous periodic hourly, do not display in list
			labels[id] = hourly.hbullet()+' - '+datein.sortable({y:true})+' - '+hourly.name;
			if(verboseOn) labels[id] = id+' '+labels[id];
			order.unshift(id);
		}
		// order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let today = new Date(); today = today.toMidnight().stamp();
		return new C_dS_hourlyuser([0,this.genome.rscid,0,today]);
	};
	this.get = function(id) {
		return C_dS_hourlyuser.registers.byid.get(id);
	}
}
C_dS_hourlyuser.usage = function(hourly, rscid) { // shows usage of a given hourly by a given resource

	this.genome = {hourly:hourly, rscid:rscid}; // hourly is a dS_hourly

	// generic interface to C_iPLUS
	this.plusmay = false;
	this.eid = '_husr';
	this.list = function() {
		let today = new Date(); today = today.toMidnight().stamp();
		let verby = {
			now: '<span class="orange bold">&nbsp;('+C_XL.w('now')+')</span>',
			tonow: '<span class="orange bold">'+C_XL.w('to',{cap:0})+' '+C_XL.w('now')+'</span>',
			toever: '<span class="mobtext bold">'+C_XL.w('and after')+'</span>'
		}
		let labels = [], order = [];
		let reg = C_dS_hourlyuser.registers.byhourly.get(hourly.id, rscid); // a couple like { order:, keys: }
		for(let ox in reg.order) {
				let dayIn = reg.order[ox];
				let huser = reg.keys[dayIn]; 
			
				let pp = huser.previous({periodic:true}); // pp is the first previous change to a periodic hourly
			if(pp) if(pp.hourlyId == hourly.id) continue; // that is a comeback to the previous periodic hourly, do not display in list (comeback is due to exceptional days)
			
				let nn = huser.nexton({periodic:true, exclude:hourly.id}); // pp is the first previous change to a periodic hourly
				let upto;
			if(nn) {  // identify end of relevance period for this hourly
				let dayOut = nn.dayIn;
				let dateOut = new Date(dayOut*1000);
				let now = ''; if(dayIn<=today && dayOut>= today) now = verby.now;
					upto = C_XL.w('todate')+' '+dateOut.sortable({y:true})+now;
			} else {
				if(dayIn < today) upto = verby.tonow; else upto = verby.toever;
				}
			
				let huid = huser.id;
				let datein = new Date(dayIn*1000);
			labels[huid] = hourly.hbullet()+' - '+datein.sortable({y:true})+' '+upto;
			if(verboseOn) labels[huid] = huid+' '+labels[huid];
			order.unshift(huid);
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let today = new Date(); today = today.toMidnight().stamp();
		return new C_dS_hourlyuser([0,this.genome.rscid,0,today]);
	};
	this.get = function(id) {
		return C_dS_hourlyuser.registers.byid.get(id);
	}
}
C_dS_hourlyuser.del = function(which) { // which like { id:anid OR rscId:aRscId }
	if(which.id) { // deletes a particular hourly change
		let item = C_dS_hourlyuser.registers.byid.get(which.id);
		C_dS_hourlyuser.registers.del(item);
	} 
	if(which.rscId) { // concerns only one resource
	
		if(which.dayin) { // remove only hourly change on dayIn
		
			let item = C_dS_hourlyuser.registers.bydayin.get(which.rscId, which.dayin);
		// console.log('deleting huser on dayIn:'+sortable(which.dayin)+', item found'+(item?item.id:'none'));
			if(item) C_dS_hourlyuser.registers.del(item);
			
		} else { // remove all hourly changes for this resource
			
								let perf = false; // new microperf('entering C_dS_hourlyuser.del');
								// there was a perf problem in this part of the code because we removed 300 items one by one in sorted registers. This has been fixed by removing entire parts of the trees
			
			let items = C_dS_hourlyuser.registers.changes.get(which.rscId);
			
								if(perf) perf.cue('done with getting items');
								
			let icb = C_dS_hourlyuser.registers.byhourly.ends();
			C_dS_hourlyuser.registers.byhourly.del(which.rscId,1); // deletes at level 1, which is where we specify rscId
			let ica = C_dS_hourlyuser.registers.byhourly.ends();
								if(perf) perf.cue('done with byhourly items, before:'+icb+' after:'+ica);
			
			
				icb = C_dS_hourlyuser.registers.byid.ends();
			for(let id in items) delete C_dS_hourlyuser.registers.byid[id]; // short cut for p
				ica = C_dS_hourlyuser.registers.byid.ends();
								if(perf) perf.cue('done with byid items, before:'+icb+' after:'+ica);
								
								
			C_dS_hourlyuser.registers.againdayin.del(which.rscId);					
								if(perf) perf.cue('done with againdayin items');
			C_dS_hourlyuser.registers.bydayin.del(which.rscId);		
								if(perf) perf.cue('done with bydayin items');
			C_dS_hourlyuser.registers.changes.del(which.rscId);
								if(perf) perf.cue('done with changes items');
			
								if(perf) perf.report('C_dS_hourlyuser.del: items');
		}
	}
}
C_dS_hourlyuser.chrono = function(rscid) { // returns chronological sequence of hourly changes for a given resource

	let chrono = C_dS_hourlyuser.registers.bydayin.get(rscid);  
		// chrono = { order:[key1, key2, ...], keys:[key1=>dS_hourlyuser, key2=>dS_hourlyuser, ... ] }		
	let bundle = new Array();
	if(!chrono) return bundle;
	for(let x in chrono.order) {
		let dayIn = chrono.order[x];
		let hourlyuser = chrono.keys[dayIn];
		bundle.push({huser:hourlyuser, hourly:hourlyuser.hourly(), dayin:dayIn});
	}
	return bundle;
	
}
C_dS_hourlyuser.first = function(rscid) {
	let sorted = C_dS_hourlyuser.registers.bydayin.get(rscid);
	let first = sorted?sorted.keys[sorted.order[0]]:false; // when no hourly exists, sorted is undefined
	return first;
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    L O G I N S   &   A C C E S S   K E Y S  
//


function keysbank() { C_regS.apply(this,['loginid','byacclvl','keyid','keybylogin','keybyaccount','loginbywovers']); };
keysbank.prototype = C_regS.prototype;
var keysmem;
(keysbank.reset = function() {
	keysmem = { config:new keysbank(), logged:new keysbank(), autocomp:new keysbank() // autocomp is for searching for connections
		,flush: function(which) { 
			if(which) return keysmem[which] = new keysbank();
			else for(m in this) if(this[m] instanceof keysbank) this[m] = new keysbank();
			return; } };
})();

function C_dS_login(b,p) {
	this.bank = b;
	C_dS_trackingCCD.apply(this,p);
	C_dS_login.defaults.mergeto(this,p,this.tmc);
	
	if(this.id <= 0) return;
	
	if(this.mobile) if(this.mobile[0]!='0') this.mobile = '+'+this.mobile;
	
	keysmem[b].loginid.add(this.id, this);
	keysmem[b].byacclvl.add(this.accessLevel, this.id, this);
	
	// meta data
	this.namefull = this.firstname+' '+this.lastname;
	this.name = this.firstname[0]+'. '+this.lastname; // use C_dS_login.lname to access bullet display
	this.xmon = new Array();
};
C_dS_login.defaults = new A_df({
		accessLevel:0,   // range, see (*av01*)
		permissions:0, login:'', password:'', taycan:'', GMT:3600, weeknumb:0,
		lastLogin:'',
		gender:1, firstname:'', lastname:'', company:'', 
		residence:'', address:'', zipCode:'', city:'',
		country:'', email:'', mobile:'', phone:'', language:0, profession:0, note:'', color:0, tag:0,
		notbyme:1, secretarypopups:0,
	eresaIdentMode:0, eresaFillingMode:99,
		seoIndexable:1, seoMetaTitle:'', seoMetaDescr:'', seoMetaCanon:'', seoComment:'', 
	eresaTitle:'', eresaUrl:'', eresaMax:1, eresaLimit:0, eresaBefore:9472539, eresaWithAMPM:1, eresaSameday:1, eresaAllowNote:1, 
	eresaSignin:1, eresaCancel:0, eresaAggregate:0, eresaRescType:0, eresaSkin:'',
	eresaNote:'', eresaHourlies:'', eresaDirections:'', eresaDirLabel:'', eresaDirUrl:'', 
	eresaWorkcodes:'', eresaLink1label:'', eresaLink1url:'', eresaLink2label:'', eresaLink2url:'', eresaPalette:'', 
	eresaFontTitle:'', eresaFontText:'', eresaCcss:'', eresaAuthent:0, eresaBlacklist:0,
	syncwhat:1 });
C_dS_login.prototype = {
	getKeys: function() {
		return C_dS_accesskey.get(this.bank, this.id);
	},
	clone: function() {
		keysmem[this.bank].loginid.add(this.id, this);
		return this;
	},
	lname: function(options) { // returns login name, options like { bullet:1 } or { bullet:{css:'small'} }
		options = options || {}; // { bullet:{css:'' }};
		let b = ''; if(options.bullet) b = this.lbullet(options.bullet.css?options.bullet.css:'')+' ';
		let n = b+this.firstname+' '+this.lastname;
		// if(verboseOn) n = '('+this.id+') '+n;
		return n;
	},
	lbullet: function(cssmore) {
		if(!this.color&&!this.tag) return '';
		let css = this.lcss();
		if(cssmore) css += ' '+cssmore;
		let bullet = '<div style="display:inline-block;" class="bullet login '+css+'">'+this.initials()+'</div>';
		if(this.tag) {
			let tag = C_iSKIN.tagcss(this.tag);
			bullet = '<div style="display:inline-block;" class="bullet login fa-15x '+tag+' '+css+'"></div>';
		}			
		return bullet;
	},
	url: function() {
		if(this.accessLevel == aLevel.eresa) 
			return 'https://agenda.mobminder.com/'+this.eresaUrl;
		else 
			return 'https://be.mobminder.com/sync?l='+this.login+'&p='+this.password+'&g='+this.groupId;
	},
	eworkcodes: function() {
	
		let eworkcodes = [];
		if(!this.eresaWorkcodes) return eworkcodes;
		
		let wcids = this.eresaWorkcodes.split('!');
		for(let x in wcids) {
			let wkid = wcids[x];
			eworkcodes[wkid] = C_dS_workcode.get(wkid);
		}
		return eworkcodes;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; },
	lcss:function() { return this.color?'c'+this.color:'default'; },
	nickname:function() { return this.firstname[0]+(this.firstname[1]?this.firstname[1]:'')+this.lastname[0]+(this.lastname[1]?this.lastname[1]:'') },
	initials:function() { return this.firstname[0]+this.lastname[0] }

};
C_dS_login.get = function(bank,id) { return keysmem[bank].loginid.get(id); } 
C_dS_login.ACoptions = {
	trigger: 3,
	css: 'alpha20',
	callback: false,
	exclude: false,
	fetch: function(digits, callback, exclude) { 
		this.callback = callback; this.exclude = exclude || false;
		let post = new C_iPASS({digits:digits});
		mobminder.app.post({post:post}, {post:{digits:'digits'}}, './queries/aclogins.php', new A_cb(this, this.stream, digits));
	},
	label: function(id) { 
		return this.merge(C_dS_login.register.id.get(id));
	},
	merge: function(o_dS) {
		let name = o_dS.namefull;
		let login = '('+o_dS.login+')';
		let email = ''; if(o_dS.email) email = ' - '+o_dS.email;
		let comp = ''; if(o_dS.company) comp = o_dS.company+': ';
		return comp+name+login+email;
	}, 
	stream: function(digits, datasets) {
		let options = new Array();
		let dSets = datasets['C_dS_login'];
		for(let id in dSets)
			if(id != this.exclude) 
				options[id] = C_dS_login.ACoptions.merge(dSets[id]);
		C_dS_login.ACoptions.callback.cb(digits, options);
	}
}


var aLevel = {   // equivalent php, see (*av01*)
	synchro:3, eresa:4, operator:5, supervisor:6, manager:7, seller:8, admin:9,
	names: { 3:'al-synchro', 4:'al-eresa', 5:'al-operator', 6:'al-supervisor', 7:'al-manager', 8:'al-seller', 9:'al-admin' },
	name:function(aLevel) { return this.names[aLevel]; }
}

var permissions = { // permissions codes (is a bit map)
	codes: {
		none: 0, 
		
		// cr_ gives permission to create
		// op_ gives permission to open the item (see content)
		// ac_ gives permission to access
		// ch_ gives permission to change
		// dl_ gives permission to delete
		
		// usage
		cr_resas: 	1<<0, cr_tasks: 	1<<2, cr_notes: 1<<3, cr_chats: 1<<4,
		ac_disprefs:1<<5, ac_stats: 	1<<6, ac_visis: 1<<7, ac_setup: 1<<8, ac_archv: 1<<12, 	ac_sfind: 1<<13,
		ch_hourly: 	1<<10, ch_calendar:	1<<11,   	
		op_resas:	1<<16,
		
		// config
		cr_bcals: 	1<<20, 	cr_ucals: 	1<<21, 	cr_fcals: 1<<22,
		cr_comm: 	1<<23, 	ch_comm: 	1<<24,
		cr_wrkc: 	1<<25, 	ch_wrkc: 	1<<26,
		cr_ccss: 	1<<27, 	ch_ccss: 	1<<28,
		cr_logins: 	1<<29, 	ch_logins: 	1<<30
		
		// Bulk set up of permission : SQL example
		//
		// update logins set permissions = permissions | 32; -- permission to display preferences
		// update logins set permissions = permissions | 65536; -- permission to open reservations
		//
		// update logins set permissions = permissions & ~32; -- permission to display preferences
		// update logins set permissions = permissions & ~65536; -- permission to open reservations
		
	},
	full: function() { // calculates the bitmap that allows all permissions
		let f = 0;
		for(let perm in this.codes) f |= this.codes[perm]; 
		return f;
	},
	pdefault: function(alevel) {  // provides a default set of permissions in function of a given access level
		let p = 0;
		switch(alevel) {
			case aLevel.operator: 	p = pc.op_resas+pc.ac_disprefs+pc.cr_resas+pc.cr_tasks+pc.cr_notes+pc.cr_chats+pc.ac_visis+pc.ch_calendar; break;
			case aLevel.supervisor: p =  pc.op_resas+pc.ac_disprefs+pc.cr_resas+pc.cr_tasks+pc.cr_notes+pc.cr_chats+pc.ac_visis+pc.ch_calendar
										+pc.ac_setup+pc.ac_archv+pc.ac_sfind+pc.cr_wrkc+pc.ch_wrkc+pc.cr_ccss+pc.ch_ccss; break;
			case aLevel.manager: 	p = this.full()-pc.cr_bcals-pc.cr_ucals-pc.cr_fcals-pc.cr_comm; break;
			case aLevel.seller: 	p = this.full(); break;
			case aLevel.admin: 		p = this.full(); break;
		}
		return p; 
	},
	options: function(which, preset) {
		
		let order = [], labels = [], presets = {};
		for(let name in this.codes) {
			let bit = this.codes[name]; if(bit==0) continue;
			if(!(which&bit)) continue;
			order.push(bit);
			labels[bit] = C_XL.w(name);
				let tip = '<strong>'+C_XL.w(name)+'</strong>';
			presets[bit] = { tip:tip, checked:!!(preset&bit) };
		}
		
		// order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		
		return { order:order, labels:labels, presets:presets, count:order.length };
	},
	may: function(what) { // e.g. if( permissions.may(pc.cr_bcals) ) {}
		return !!(mobminder.context.surfer.permissions & what);
	}
}; pc = permissions.codes;



///////////////////////////////////

function C_dS_loggable() {}; // uses the secondary bank 'config'
C_dS_loggable.prototype = {}
C_dS_loggable.get = function(id) {
	return keysmem['config'].loginid.get(id);
}
C_dS_loggable.del = function(id) {
	
	// login references
	let item = keysmem['config'].loginid.get(id);
		keysmem['config'].loginid.del(item);
		keysmem['config'].byacclvl.del(item);
		
	// access keys references
	let cfgreg = keysmem['config'].keybylogin.get(id);
	for(let kid in cfgreg) {
		let item = cfgreg[kid];
		keysmem['config'].keyid.del(item);
		keysmem['config'].keybylogin.del(item);
		keysmem['config'].keybyaccount.del(item);
	}
}
C_dS_loggable.webpagecount = function() {
	let eresalevelcount = keysmem['config'].byacclvl.ends(aLevel.eresa);
	return eresalevelcount;
}
C_dS_loggable.plus = function(accessLevel) {
	this.genome = {accessLevel:accessLevel};
	
	// generic interface to C_iPLUS
	// this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.manager);
		// if(this.genome.accessLevel==aLevel.eresa) this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.seller);
	this.plusmay = permissions.may(pc.cr_logins);
	this.eid = '_lgn';
	this.count = function() { return keysmem['config'].byacclvl.ends(this.genome.accessLevel); }
	this.list = function() {
		let labels = [], order = [];
		let register = keysmem['config'].byacclvl.get(this.genome.accessLevel);
		for(let id in register) {
			let dataset = register[id], label; 
			switch(dataset.accessLevel) {
				case aLevel.synchro: label = dataset.firstname; break;
				case aLevel.eresa: label = dataset.url(); break;
				default:
					label = dataset.namefull;
					label+=',&nbsp;('+C_XL.w('login')+':'+dataset.login+')';
			}
			if(verboseOn) label = dataset.id+' '+label;
			labels[dataset.id] = label; order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let login = new C_dS_login('config');
		login.accessLevel = this.genome.accessLevel|0;
		login.permissions = permissions.pdefault(login.accessLevel);
		login.GMT = mobminder.account.GMT;
		return login;
	};
	this.get = function(id) {
		let o_dS_login = keysmem['config'].loginid.get(id);
		return o_dS_login;
	}
}
C_dS_loggable.getname = function(id, options) {
	options = options || {};
	let item = keysmem['config'].loginid.get(id);
	if(!item) return '??';
	// if(options.initials) return item.firstname[0]+item.lastname[0];
	return item.firstname+'&nbsp;'+item.lastname;
}
C_dS_loggable.phylactag = function(id_or_dS_login, cssmore) {
	let item;
	if(id_or_dS_login instanceof C_dS_login) item = id_or_dS_login; // then use the provided dS, it might be a modified clone of an instance not yet saved in bank, see (*st01*)
		else item = keysmem['config'].loginid.get(id_or_dS_login);
	if(!item) return { initials:'JD', css:'default', name:'John Doe', bullet:'' };
	return { initials:item.initials(), css:item.lcss(), name:item.lname(), bullet:item.lbullet(cssmore) };
}
C_dS_loggable.cresta = function(accessLevel, presets, options) { // options for C_iCRESTA instance, see (*us01*)
		options = options || { bullet:{css:''} };
		let labels = {}, order=new Array(), preset = [];
		let register = keysmem['config'].byacclvl.get(accessLevel);
		for(let id in register) { 
			preset[id] = false; 
			labels[id] = register[id].lname(options); order.push(id);
		};
		if(presets) for(let id in presets) if(presets[id]!==undefined) { 
			// id is a login id, while presets[id] is most often any class like o_dS_task_assignee or o_dS_note_addressee.. see what is passed to new C_iUSERS
			// we have made a specific class: C_optionPreset for the purpose a passing more than a boolean to the C_iCRESTA options pre-set
			if(typeof presets[id] === 'boolean') { preset[id] = true; continue; }
			if(presets[id] instanceof C_iTEM.preset) { preset[id] = presets[id]; continue; }
			preset[id] = true; // anything else, reduce to boolean
		}
		
			// let ab = 'let a = labels[a]; let b = labels[b];';
			// let sequence = ' if(b < a) return  1; else if(a < b) return -1; return 0;';
			// eval('let sf = function(a,b) {'+ab+sequence+'}');
			
			let sf = function(a,b) { let av = labels[a], bv = labels[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			
		order.sort(sf);
		return { count:order.length, order:order, labels:labels, presets:preset }	
}
C_dS_loggable.getbyAccLevel = function(accessLevels) { // accessLevels is an array like [aLevel.seller,aLevel.admin]
	let regs = []; // indexed by access level
	for(let x in accessLevels) { let al = accessLevels[x]; regs[al] = keysmem['config'].byacclvl.get(al); }
	return arrayOR(regs);
}
C_dS_loggable.getWatchovers = function(rid) {  // provides the list of watching over logins for the gevin resource
	
	return keysmem['config'].loginbywovers.get(rid); // returns an array like array[loginId] = C_dS_loggable;
}


///////////////////////////////////

function C_dS_loggedIn() {};
C_dS_loggedIn.get = function(id) { return keysmem['logged'].loginid.get(id); }
C_dS_loggedIn.count = function() { return keysmem['logged'].loginid.ends(); }
C_dS_loggedIn.del = function(id) {

	// login references
	let item = keysmem['logged'].loginid.get(id);
	keysmem['logged'].loginid.del(item);
	
	// access keyes references
	let cfgreg = keysmem['logged'].keybylogin.get(id);
	for(kid in cfgreg) {
		let item = cfgreg[kid];
		keysmem['logged'].keyid.del(item);
		keysmem['logged'].keybylogin.del(item);
		keysmem['logged'].keybyaccount.del(item);
	}
}
C_dS_loggedIn.cresta = function(presets, options) { // options for C_iCRESTA instance
			options = options||{}; // like {excludeloggables:true, excludelevels:[aLevel.synchro,aLevel.eresa]}
		let labels = {}, order=new Array(), preset = [];
		let loggedon = keysmem['logged'].loginid.get();
		let loggables = keysmem['config'].loginid.get();
		for(let id in loggedon) { 
				let excluded = false;
				if(options.excludeloggables) for(let lid in loggables) if(lid==id) { excluded=true; break; } // excludes from this list logins that have an access to this account
				if(options.excludelevels) for(let x in options.excludelevels) { let lvl = options.excludelevels[x]; if(loggedon[id].accessLevel==lvl) { excluded=true; break; } }
			if(excluded) continue;
			preset[id] = false; 
			labels[id] = loggedon[id].name; order.push(id);
		};
		if(presets) for(let id in presets) if(presets[id]!==undefined) preset[id] = presets[id];
		
			// let ab = 'let a = labels[a]; let b = labels[b];';
			// let sequence = ' if(b < a) return  1; else if(a < b) return -1; return 0;';
			// eval('let sf = function(a,b) {'+ab+sequence+'}');
			
			let sf = function(a,b) { let av = labels[a], bv = labels[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			
		order.sort(sf);
		return { count:order.length, order:order, labels:labels, presets:preset }	
}
C_dS_loggedIn.anyadmin = function() {
	let loggedon = keysmem['logged'].loginid.get();
	for(let id in loggedon) { 
		if(loggedon[id].accessLevel==aLevel.admin) return true;
	}
	return false;
}



////////////////   K E Y S  

function C_dS_accesskey(b,p) { // grouped by loginId
	
	C_dS_accesskey.defaults.mergeto(this,p,this.tmc);
	
	keysmem[b].keyid.add(this.id, this);
	keysmem[b].keybylogin.add(this.groupId,this.id,this); // access keys are grouped by loginId
	keysmem[b].keybyaccount.add(this.accountId,this.id,this);
	
	let wos = arrayINVERT(this.watchover.split('!'));
	for(let rid in wos) keysmem[b].loginbywovers.add(rid,this.groupId,C_dS_loggable.get(this.groupId)); // like loginbywovers[resourceId][loginId] = C_dS_loggable;
	
	this.account = C_dS_group.get(this.accountId);
	this.login = C_dS_loggedIn.get(this.groupId);
	this.view = {}; 
		this.view[class_bCal] = this.bCals; // contains '-' when none is selected (*ak01*) 
		this.view[class_uCal] = this.uCals; // contains '' when all are selected (default DB value) or when a specific display order is set  
		this.view[class_fCal] = this.fCals; // contains '5687!9874!6541' when some are selected, or when some display order is defined. The list order is the display order 
	
	this.catalysts = new C_regS('byClass');
};
C_dS_accesskey.defaults = new A_df({
		id:0,groupId:0,accountId:0,
		bCals:'', uCals:'', fCals:'', /* view */
		watchover:'' /* notifications */ });

C_dS_accesskey.prototype = {
	getView: function() {
		let view = new Array();
		
		view[class_bCal] = this.bCals.length?arrayINVERT(this.bCals.split('!')):C_dS_resource.ids(class_bCal); // an empty string means that ALL are selected
		view[class_uCal] = this.uCals.length?arrayINVERT(this.uCals.split('!')):C_dS_resource.ids(class_uCal);
		view[class_fCal] = []; // when nothing is selected (the field contains then '-')
		if(this.fCals!='-')  
			if(this.fCals.length) view[class_fCal] = arrayINVERT(this.fCals.split('!')); // some are selected
				else for(let cid in C_dS_resource.options(class_fCal)) view[class_fCal] = C_dS_resource.ids(class_fCal); // ALL are selected

		return view; // an ambidextrous array like [class_bCal[rid:rid, rid:rid], class_uCal[rid:rid, rid:rid], class_fCal[rid:rid, rid:rid] ]
	},
	getWatchovers: function() { // provides the list of watched over resources for the gevin access key
		let watchovers = new Array();
		
		if(!this.watchover.length) return { bCals:[], uCals:[], fCals:[] };
		let watch = arrayINVERT(this.watchover.split('!'));
		
		let all_bCals = C_dS_resource.ids(class_bCal);
		let all_uCals = C_dS_resource.ids(class_uCal);
		let all_fCals = C_dS_resource.ids(class_fCal);
		
		let bCals = []; for(let rid in all_bCals) if(rid in watch) bCals[rid] = rid;
		let uCals = []; for(let rid in all_uCals) if(rid in watch) uCals[rid] = rid;
		let fCals = []; for(let rid in all_fCals) if(rid in watch) fCals[rid] = rid;
		
		watchovers[class_bCal] = bCals;
		watchovers[class_uCal] = uCals;
		watchovers[class_fCal] = fCals;
		
		return watchovers; // an ambidextrous array like [class_bCal[rid:rid, rid:rid], class_uCal[rid:rid, rid:rid], class_fCal[rid:rid, rid:rid] ]
	}
};
C_dS_accesskey.options = function(lid, more) {
	more = more || {}; // like { warnings:[id=>value] }
	let warnings = more.warnings||[];
	
	let order = new Array(), labels = {}, presets = {};
	
	let register = keysmem['logged'].keybylogin.get(lid); // only for this login
	// let register = keysmem['logged'].keyid.get();
	for(let id in register) {
		let key = register[id];
		let bullet = key.account.abullet({warning:warnings[key.account.id]||0});
		let aname = '<td style="width:18em; max-width:18em; overflow:hidden; white-space:nowrap;">'+bullet+'&nbsp;'+key.account.name+'</td>';
		labels[id] = '<table style="display:inline-table; vertical-align:-4px;"><tr>'+aname+'</tr></table>';// bullet+aname+login+close
		
			let tiptitle = '<p style="white-space:nowrap;">'+bullet+'<span style="white-space:nowrap; font-weight:bold">&nbsp;'+key.account.name+'</span></p>';
			let tiplogged = '<p style="white-space:nowrap;">'+C_XL.w('login')+':&nbsp;'+key.login.name+'</p>';
		let tip = tiptitle+tiplogged+'<p>'+key.account.note.htmlize()+'</p>';
		presets[id] = { tip:tip };
		order.push(id);
	}
	
		let sortrule = function(a,b) {
			let left = register[a].account.color+register[a].account.name;
			let right = register[b].account.color+register[b].account.name;
			return (left>right)?1:-1; 
		}
	order.sort(sortrule);
	return { order:order, labels:labels, presets:presets, count:order.length };
	
}		
C_dS_accesskey.nextkey = function(forlogin, notthisone) {
	let register = keysmem['logged'].keyid.get();
	let keyid = 0;
	for(keyid in register) 
		if(keyid == notthisone) continue; 
		else {
			let key = register[keyid];
			if(key.groupId==forlogin) // access keys are grouped by login
				break; // stop here, we have a next key for the right login
		}
	return keyid;
}
C_dS_accesskey.accounts = function(loginId) {
	
	let order = new Array(), labels = {}, presets = {};
		let cfgreg = keysmem['config'].keybylogin.get(loginId);
	for(let keyid in cfgreg) {
		let key = cfgreg[keyid]; let accid = key.accountId; 
		let account = C_dS_group.get(accid); let bullet = account.abullet();
		
			let aname = '<div style="display:table-cell; width:12em; max-width:12em; overflow:hidden; white-space:nowrap;">&nbsp;'+account.name+'</div>';
		labels[accid] = bullet+aname;
		
		let selected = false;
		if(mobminder.account.id == accid) selected = true;
		
			let tiptitle = '<div style="display:table-cell; white-space:nowrap; font-weight:bold">'+bullet+'&nbsp;'+account.name+'</div>';
		let tip = tiptitle+'<p>'+account.note.htmlize()+'</p>';
		
		presets[accid] = { tip:tip, selected:selected, locked:false };
		order.push(accid);
	};
	let sortrule = function(a,b) {
		let acc1 = C_dS_group.get(a), acc2 = C_dS_group.get(b); 
		let left = acc1.color+acc1.name, right = acc2.color+acc2.name;
		return (left>right)?1:-1; 
	}
	order.sort(sortrule);
	let count = order.length;
	
	return { order:order, labels:labels, presets:presets, count:count };
}
C_dS_accesskey.get = function(bank, loginId) {
	let keys = keysmem[bank].keybylogin.get(loginId); // returns an array of o_dS_accesskey's
	return keys;
}
C_dS_accesskey.byid = function(bank, keyId) {
	return keysmem[bank].keyid.get(keyId);
}
C_dS_accesskey.byaccount = function(bank, aid) { // returns a collection of accesskeys having access to account aid
	if(!aid) aid = mobminder.context.groupId;
	return keysmem[bank].keybyaccount.get(aid); // returns array[kid] = dS_accesskey
}
C_dS_accesskey.toaccount = function(loginId, accountId) {
	let keys = keysmem['config'].keybylogin.get(loginId); // returns an array of o_dS_accesskey's
	let count = keysmem['config'].keybylogin.ends(loginId);
	for(let keyid in keys) if(keys[keyid].accountId==accountId) return { count:count, akey:keys[keyid] }; // returns a single o_dS_accesskey
	return { count:0, akey:{id:0} }; // when creating a new login, you fall here
}
C_dS_accesskey.del = function(id) {

	let item = keysmem['logged'].keyid.get(id);
	keysmem['logged'].keyid.del(item);
	keysmem['logged'].keybylogin.del(item);
	keysmem['logged'].keybyaccount.del(item);
}
	
	
	

////////////////   C O N N E C T I O N S 

function cnxbank() { C_regS.apply(this,['byid']); }; // here you mention the different registers you want in each bank
cnxbank.prototype = C_regS.prototype;
var cnxmem;
(cnxbank.reset = function() {
	cnxmem = { realtime:new cnxbank(), archive:new cnxbank() // here we define two distinct banks
		,flush: function(which) { 
			if(which) return cnxmem[which] = new cnxbank();
			else for(m in this) if(this[m] instanceof cnxbank) this[m] = new cnxbank();
			return; } };
})();

function C_dS_connection(b, p) { // group to an account
	this.bank = b;
	C_dS_connection.defaults.mergeto(this,p);
	cnxmem[b].byid.add(this.id, this);
};
C_dS_connection.defaults = new A_df({
	 id:0, groupId:0
	, sessionId:'', loginId:0, connKey:0, reloads:0, switchTos:0
	, surfer:'', account:'', agent:'', ip:'', logintime:0, watchdog:0, activity:0
	
	,cnt_q_all:0,perf_q_acc:0 	,perf_q_pk:0 	,perf_q_mean:0 // queries
	,cnt_p_all:0,perf_p_acc:0	,perf_p_pk:0	,perf_p_mean:0
	,cnt_d_all:0,perf_d_acc:0	,perf_d_pk:0	,perf_d_mean:0
	
	,cnt_q_config:0 	,perf_q_config_pk:0 // queries
	,cnt_q_emerg:0		,perf_q_emerg_pk:0
	,cnt_q_gender:0		,perf_q_gender_pk:0
	,cnt_q_login:0		,perf_q_login_pk:0
	,cnt_q_orphans:0	,perf_q_orphans_pk:0
	,cnt_q_plitems:0	,perf_q_plitems_pk:0
	,cnt_q_remote:0		,perf_q_remote_pk:0
	,cnt_q_search:0		,perf_q_search_pk:0
	,cnt_q_stats:0		,perf_q_stats_pk:0
	,cnt_q_alphatab:0	,perf_q_alphatab_pk:0
	,cnt_q_swap:0		,perf_q_swap_pk:0
	,cnt_q_visiapps:0	,perf_q_visiapps_pk:0
	,cnt_q_visitors:0	,perf_q_visitors_pk:0
	
	,cnt_p_config:0		,perf_p_config_pk:0 // posts
	,cnt_p_visitor:0	,perf_p_visitor_pk:0
	,cnt_p_resa:0		,perf_p_resa_pk:0
	,cnt_p_rsc:0		,perf_p_rsc_pk:0
	,cnt_p_schedule:0	,perf_p_schedule_pk:0
	,cnt_p_shadow:0		,perf_p_shadow_pk:0
	,cnt_p_task:0		,perf_p_task_pk:0
	,cnt_p_note:0		,perf_p_note_pk:0
	,cnt_p_chat:0		,perf_p_chat_pk:0
	,cnt_p_newacc:0		,perf_p_newacc_pk:0
	,cnt_p_login:0		,perf_p_login_pk:0
	,cnt_p_huser:0		,perf_p_huser_pk:0
	,cnt_p_tboxing:0	,perf_p_tboxing_pk:0
	,cnt_p_hourly:0		,perf_p_hourly_pk:0
	,cnt_p_gdlns:0		,perf_p_gdlns_pk:0
	,cnt_p_smst:0		,perf_p_smst_pk:0
	,cnt_p_emlt:0		,perf_p_emlt_pk:0
	,cnt_p_details:0	,perf_p_details_pk:0
	,cnt_p_ccss:0		,perf_p_ccss_pk:0
	,cnt_p_account:0	,perf_p_account_pk:0
	,cnt_p_wrkc:0		,perf_p_wrkc_pk:0
	
	,cnt_d_account:0	,perf_d_account_pk:0 // deletes
	,cnt_d_ccss:0		,perf_d_ccss_pk:0
	,cnt_d_smst:0		,perf_d_smst_pk:0
	,cnt_d_emlt:0		,perf_d_emlt_pk:0
	,cnt_d_gdlns:0		,perf_d_gdlns_pk:0
	,cnt_d_shadow:0		,perf_d_shadow_pk:0
	,cnt_d_huser:0		,perf_d_huser_pk:0
	,cnt_d_tboxing:0	,perf_d_tboxing_pk:0
	,cnt_d_login:0		,perf_d_login_pk:0
	,cnt_d_resa:0		,perf_d_resa_pk:0
	,cnt_d_task:0		,perf_d_task_pk:0
	,cnt_d_note:0		,perf_d_note_pk:0
	,cnt_d_chat:0		,perf_d_chat_pk:0
	,cnt_d_rsc:0		,perf_d_rsc_pk:0
	,cnt_d_wrkc:0		,perf_d_wrkc_pk:0
	
		});
C_dS_connection.prototype = {
	add: function(xMon, xMax) {
		for(m in this) {
			if(m in C_dS_xmon_action.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,loginId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	},
	uivalue: function(member) {
		let d;
		switch(member) {
			case 'logintime': d = new Date(this.logintime*1000); return d.datetimestr({y:false}); 
			case 'watchdog': if(!this.watchdog) return '/'; d = new Date(this.watchdog*1000); return d.datetimestr({y:false}); 
			case 'activity': d = new Date(this.activity*1000); return d.datetimestr({y:false}); 
				
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = { c:1, t:'', v:this.uivalue(m) } }; 
		return items;
	}
};
C_dS_connection.catalyst = function(options) {  // for C_iARRAY, options mandatory specifies bank to read from
	
	this.bank = options.bank;
	this.xlprefix = 'cnx-'; // translation prefix
	this.options = { surfer:'surfer', account:'account', logintime:'logintime', activity:'activity', watchdog:'watchdog', ip:'ip'
		, reloads:'reloads', switchTos:'switchtos', cnt_q_all:'qcount', cnt_p_all:'pcount', cnt_d_all:'dcount'};
	this.on = options.on ? options.on : [ 'ip','account',  'surfer', 'logintime', 'activity', 'watchdog', 'reloads', 'switchTos' ];
	this.sorton = { key:'account', order:1 };
	
	//
	this.labels = function() { // returns translated labels
		let headers = new Array(); 
		for(let x in this.options) 
			headers[x] = C_XL.w(this.xlprefix+this.options[x]);
		return headers;
	},
	this.sort = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		set = set || this.keys();
		let key = this.sorton.key;
		let order = this.sorton.order;
		let values = new Array(); for(let x in set) { let id =  set[x]; values[id] = this.dS(id).uivalue(key); };
		
		// let ab = 'let a = values[a]; let b = values[b];';
		// if(order== 1) order = ' if(b < a) return  1; else if(a < b) return -1; return 0;';
		// if(order==-1) order = ' if(b < a) return -1; else if(a < b) return  1; return 0;';
		// eval('let sf = function(a,b) {'+ab+order+'}');
		
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
		
		return set.sort(sf);
	};
	this.keys = function() { return cnxmem[this.bank].byid.keys() };
	this.dS = function(id) { return cnxmem[this.bank].byid.get(id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.sum = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		let dSsum = new C_dS_connection([0]);
		let dSmax = new C_dS_connection([-1]);
		for(let x in set) { let id =  set[x]; dSsum.add(this.dS(id),dSmax) };
		return { sum:dSsum.members(this.on), max:dSmax.members(this.on) };
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let types = new Array();
		for(let i in this.on) {
			let m = this.on[i];
			if(typeof C_dS_connection.defaults[m] === 'string') types[m]='T'; else types[m]=0;
			if(m=='logintime') types[m]='T';
			if(m=='activity') types[m]='T';
			if(m=='watchdog') types[m]='T';
		}
		return types;
	}
}



///////////////   D I S P L A Y     D E T A I L S 
	
var details = { // bitmap for recording user display details selection // see (*dt*) 

	// note that MySQL bigint as 64 bites
	none 			: 0,
	schedule 		: 1<<0,
	resanote 		: 1<<1,
	attendance 		: 1<<2,
	visitor 		: 1<<3,
	registration	: 1<<4,
	mobile 			: 1<<5,
	visitorNote 	: 1<<6,
	workcodes 		: 1<<7,
	duration 		: 1<<8,
	color 			: 1<<9,
	extraspace		: 1<<10,
	smsstatus 		: 1<<11,
	hideoffdays		: 1<<13, 
	hidesection		: 1<<14,
	birthdate		: 1<<15,
	address			: 1<<16,
	timeboxing		: 1<<17,
	fixline			: 1<<18,
	zipcode			: 1<<19,
	reference		: 1<<20,
	language		: 1<<21,
	rtags			: 1<<22, // reservations tags
	adaptative		: 1<<23, // graphical display span extends to daily hourly limits, instead of the account specified display span
	emptytboxes		: 1<<24, // display empty timeboxes in the list view
	vtags			: 1<<25, // visitors tags
	disbltips		: 1<<26, // disable yellow tips display
	hidesrchasst	: 1<<27, // hides the search assistent
	maxValue		: 1<<28, // there is room up to 64 bits
	bydefault		: 0	
}
details.bydefault = details.schedule+details.visitor+details.resanote+details.mobile;

function C_dS_details(p) { // grouped by keyId
	C_dS_details.defaults.mergeto(this,p);
	C_dS_details.registers.encoded.add(this.displayMode, this.resourceType, this);
};
C_dS_details.defaults = new A_df({id:0, groupId:0,deviceType:0,displayMode:0,resourceType:0,details:0}); // displayMode = 1 for vertical view, 2 for horizontal view, 3 for list view (textual)
C_dS_details.prototype = {
	array: function() {
		if(vbs) vlog('dbAccess','C_dS_details','array','level:'+this.details);
		let info = [];
		for(let bit=details.maxValue; bit; bit>>=1) if(this.details&bit) info[bit] = '';
		return info;
	}
};
(C_dS_details.reset = function() {
	C_dS_details.registers = new C_regS('encoded');
})();
C_dS_details.get = function(displayMode, resourceType, detail) {
	let dS = C_dS_details.registers.encoded.get(displayMode, resourceType);
				
	// else this surfer never specified display details for this screen
	if(!dS) {
		let id = -(displayMode+100*resourceType);
		let device_computer = 0; // see (*dt01*)
		dS = new C_dS_details([id, mobminder.context.keyId, device_computer, displayMode , resourceType, details.bydefault]);
	}
	if(detail) // detail is one bit, we check it up and return a boolean indication
		return !!(dS.details & detail);
	else 
		return dS;
};
C_dS_details.set = function(displayMode, resourceType, details) {
	let dS = C_dS_details.registers.encoded.get(displayMode, resourceType);
	if(dS) dS.details = details;
};


/*C_dS_catalyst = function(p) { // grouped by keyId
	C_dS_catalyst.defaults.mergeto(this,p);
	keysmem['logged'].keyid.get(this.groupId).catalysts.byClass.add(this.catalyst, this);
};
C_dS_catalyst.defaults = new A_df({id:0, groupId:0,catalyst:'',fields:'',sorton:'',sortdir:0});
C_dS_catalyst.prototype = {
};
(C_dS_catalyst.reset = function() {
	C_dS_catalyst.registers = new C_regS('encoded');
})();
C_dS_catalyst.get = function(displayMode, resourceType) {
	let dS = C_dS_catalyst.registers.encoded.get(displayMode, resourceType);
	if(dS) return dS;
				
	// else this surfer never specified display details for this screen
	let id = -(displayMode+100*resourceType);
	return new C_dS_catalyst([id, mobminder.context.keyId, displayMode , resourceType, details.bydefault]);
};
C_dS_catalyst.set = function(displayMode, resourceType, details) {
	let dS = C_dS_catalyst.registers.encoded.get(displayMode, resourceType);
	if(dS) dS.details = details;
};*/


function C_catalyst(genome) { // this object is used by C_iARRAY, it makes the interface to the design of any C_dS
	// genome is a C_dS_someclass for which C_iARRAY must display tables of items
	if(genome.finalize) genome.finalize(); // user setup dependant stuff are tuned in the class.catalyst object (e.g. C_dS_reservation.catalyst)
	for(let property in genome) { this[property] = genome[property]; }
	this.catalystname = this.genomec.name; // genome class //  (*msie01*)

	this.defview();
	let dS_catalyst = mobminder.context.acckey().catalysts.byClass.get(this.catalystname); // (*ct01*) retrieve preferences from table catalysts if ever recorded
	if(dS_catalyst) { 
		this.on = dS_catalyst.fields.split('!'); // contains a summary of user preferences related to this particular array display
		this.sorton = { key:dS_catalyst.sorton, order:dS_catalyst.sortdir };
	}
};
C_catalyst.prototype = {
	
	defview: function() {
		this.on = this.defaults.on;
		this.sorton = this.defaults.sorton;
	},
	post: function() { // stores on the server the display settings chosen by the user for this particular genomec
			let k = mobminder.context.keyId;
			let catalyst = this.catalystname;
			let fields = this.on.join('!');
			let sorton = this.sorton.key;
			let sortdir = this.sorton.order;
		let pass = new C_iPASS({key:k, catalyst:catalyst, fields:fields, sorton:sorton, sortdir:sortdir});
		let names = {catalyst:'catalyst', fields:'fields', sorton:'sorton', sortdir:'sortdir'};
		mobminder.app.post({pass:pass}, {pass:names}, './post/catalyst.php');
	},
	labels: function(options) { // returns translated labels, NOT abreviated
		options = options || { abr:false, flat:false };
			let labels = new Array(), flatlabels = new Array();
			let prefix = this.xlprefix; if(options.abr) prefix = prefix+'abr-';
			let foptions = this.foptions; 
			let hascategories = false; for(let x in this.foptions) { if(typeof this.foptions[x] == 'object') hascategories = true; break; } 
		if(!hascategories) foptions = { 0:foptions }; // creates a unique category, turn the flat case into the generic case with category
		
		for(let c in foptions) { // loop on category
			let optionscat = foptions[c];
			labels[c] = new Array();
			for(let m in optionscat) { // loop on option item inside the category
				let o = optionscat[m];
				if(m == 'bCals' || m == 'uCals' || m == 'fCals') {
					labels[c][m] = o; // which is going to request translation for {att_bcal}, {att_ucal}, {att_fcal}
					flatlabels[m] = o;
					continue;
				}
				let combo = prefix+o; // e.g. visi-firstname or visi-abr-firstname that you should find in language.js
				labels[c][m] = combo;
				flatlabels[m] = combo;
			}
		}
		if(options.flat) return C_XL.w(flatlabels);
		return C_XL.w(labels); // note the recursion (*xl02*)
	},
	cresta: function() { // options for C_iCRESTA instance, see C_iARRAY.fields
		let labels = this.labels({flat:false});
		let crestas = new Array();
		for(let c in labels) { // loop on category
			let order = new Array(), preset = [];
			let category = labels[c];
			for(let m in category) { order.push(m); };
			// let sortrule = function(a,b) { return (category[a]>category[b])?1:-1; }; order.sort(sortrule);
			for(let x in this.on) { 
				if(category[this.on[x]])
					preset[this.on[x]] = true;
			};
			crestas[c] = { count:order.length, order:order, labels:category, presets:preset }; // one option pane per category
		}
		return crestas;
	},
	sort: function(set) { // set is an array of ids like [ 0:id3, 1:id1, 2:id2, ... ]
			
			set = set || this.keys();
			
			let key = this.sorton.key;
			let order = this.sorton.order;
			let values = new Array(); 
			
			// console.log('C_catalyst.sort key:'+key+' order:'+order);
	
			switch(key) { // here we fetch the values that are appropriate for sorting, in some cases, they are not the ones displayed
				
				case 'duration':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cueOut - this.dS(id).cueIn; }; break;
				
				case 'dateIn':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cueIn; }; break;
				case 'dateOut':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cueOut; }; break;
				
				case 'cueIn':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cueIn - this.dS(id).midnight; }; break;
				case 'cueOut':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cueOut - this.dS(id).midnight; }; break;
					
				case 'created':
				case 'changed':
				case 'deleted':
					for(let x in set) {  let id =  set[x]; values[id] = this.dS(id)[key]; }; break;
				case 'ccss':
					if(set.length) {
						let id0 = set[0]; let hascss = this.dS(id0).css;
						if(hascss) for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).css; }
							else for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).cssColor+this.dS(id).cssPattern; };
					}
					break;
					
				case 'birthday':
					for(let x in set) {  
						let id =  set[x]; 
						let o = this.dSuivalue(id,'birthday_raw'); // should be birthday_raw ?
						values[id] = o.c ? o.v[0] : 0;
					};
					break; // see (*sr01*)
				
				default: // for all other values, we sort alphabeticaly based on the appearance on the screen
					for(let x in set) {  
						let id =  set[x]; 
						let o = this.dSuivalue(id,key);
						values[id] = o.c ? o.v[0] : (o.t=='"'?'':0);
					};
			}
		set.sort(function(a,b){return (values[a]>values[b])?order:-order; });
		return set;
	},
	keys: function() { return this.register().keys() }, // would basically return a list of ids
	dS: function(id) { return this.register().get(id); },
	dSuivalue: function(id, member) {
		
		let dS = this.dS(id);
		
		if(this.genomec.name == 'C_dS_visitorAlpha')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_reservation')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_note_detail')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_task_description')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_chat_thread')
			return dS.uivalue(member);
		
		switch(member) { // values as displayed on the browser table
		
			// for dS_chat_thread
			case 'title': return { c:1, t:'"', v:{0:dS.htitle()} };
			case 'ccss':
				let ccss = [];
					if(dS.cssColor) ccss.push(C_dS_customCss.get(dS.cssColor).name);
					if(dS.cssPattern) ccss.push(C_dS_customCss.get(dS.cssPattern).name);
				return { c:ccss.length, t:'"', v:ccss, d:dS.bullet() }; // d is the html  display value
				
			case 'created': case 'changed': case 'deleted': 	
				if(dS[member]=='0000-00-00 00:00:00') return { c:1, t:'', v:{0:C_XL.w('never')} };
				else return { c:1, t:'', v:{0:dS[member].substring(0,16)} };
			
			default: return { c:1, t:this.genomec.defaults._t[member], v:{0:dS[member]} } // in all other cases, display the genuine value
		}
	},
	dSui: function(id) {
		let items = new Array();
		for(let i in this.on) { let m = this.on[i]; items[m] = this.dSuivalue(id, this.on[i]); };
		return items; // for a given dS, returns the display values that are selected in this.on
	},
	dScss: function(id) {
		if('css' in this) return this.css(id); // the genome class define a special css for data sets having some particular properties...
		// the genome catalyst defines no particular row css to be displayed on the table, we default to the following
			let css = '';
			let dS = this.dS(id); 
		if(dS.deletorId) css += ' ds-obsolete'; // generic inactive look for deleted items
		return css;
	},
	count: function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		
		// prepare a set of counters that match what is displayed in the table
		let on = arrayINVERT(this.on);
		let counters = {}; 
		for(let member in on) counters[member] = 0;
		
		// specifiy how to count special fields, like ccss or birthday
		let count = function(dS, counters) {
			for(let m in counters) {
				switch(m) {
					case 'ccss': if((dS.cssColor!=0) || (dS.cssPattern!=0)) counters[m]++; break; // counts if one of pattern or color is defined
					case 'gender': if((dS.gender==1) || (dS.gender==5)) counters[m]++; break; // counts males only
					case 'birthday': if(dS.birthday!=0) counters[m]++; break; // counts defined birthday only, all other are 0
					case 'visitors' : counters[m]+=dS.visicount; break;
					case 'performances' : if(dS.performances) for(let id in dS.performances) counters[m]++; break;
					case 'duration' : counters[m]+=dS.rduration().v[0]|0; break;
					default: if(dS[m] != '') counters[m]++; break; // counts when non empty string
				}
			}
		}
		for(let x in set) { let id =  set[x]; count(this.dS(id), counters) };
		return { counters:counters };
	}
};




////////////////   C O N T R A C T S 

function C_dS_contract(p) {
	C_dS_contract.defaults.mergeto(this,p);
	C_dS_contract.register[this.id] = this; 
};
C_dS_contract.defaults = new A_df({
		id:0,groupId:0,creation:0,register:'',
		tax:'',ePayment:0,eInvoicing:0,fee:0,exCredit:0,exFee:0,rate:0,
		gender:1,firstname:'',lastname:'',address:'',zipCode:'',city:'',
		country:'',email:'',mobile:'',phone:'',language:0, registration:'',note:'' });
(C_dS_contract.reset = function() {
	C_dS_contract.register = new Array();
})();
C_dS_contract.prototype = { }


	


//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C H A T S
//


function cmem() { C_regS.apply(this,['chats']); };
cmem.prototype = C_regS.prototype;

var cmems = { chitems:new cmem(), archives:new cmem(), visitab:new cmem() ,flush: function(which) { cmems[which] = new cmem() } } // (*c02*)

	
	////////////////  C H A T    T H R E A D S 

function C_dS_chat_thread(b, p) {
		b = b||'chitems';
	C_dS_trackingCCD.apply(this,p);
	C_dS_chat_thread.defaults.mergeto(this,p,this.tmc);
	if(this.id>0) cmems[b].chats.add(this.id, this);
	this.participants = new C_regS('bylogin');
	this.phylacteries = new C_regS('bycue');
	this.visirefs = new C_regS('byid');
	this.physonserver = 0;
	this.seenonserver = 0;
	
	this.bank = b;
	this.has = { ccss:!!(this.cssColor||this.cssPattern), tags:!!this.cssTags };
};
C_dS_chat_thread.defaults = new A_df( { title:'', note:'', cssColor:0, cssPattern:0, cssTags:'', v:0, archived:0, lastphyl:0 } );
C_dS_chat_thread.prototype = {
	cbullet: function(options) {
		options = options||{};
		let applet = '&nbsp;';
		if(options.phys) {
				// let seen = this.participants.bylogin.get(mobminder.context.surfer.id).physseen;
				
					let onserver = this.physonserver;
					let seen = this.seenonserver;
				let notseen = onserver-seen; if(notseen<0) notseen=0;
			let warncss = notseen?'warnme':'';
			applet = '&nbsp;<div class="'+warncss+'" style="width:1em; font-size:80%; position:absolute; bottom:-0.3em; right:-1.1em; text-align:left;">'+notseen+'</div>';
		}
		
			let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
			let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		let bullet = '<div style="display:inline-block; position:relative;" class="bullet bullet-chat '+color+pattern+'">'+applet+'</div>';
		
		return bullet;
	},
	bullet: function() { return this.cbullet() }, // generic interface to C_catalyst
	uivalue: function(member) {
		let v = '', d = '';
		let t = C_dS_chat_thread.defaults._t[member]; // can be '"' for strings or '' for any other 
		switch(member) {
			case 'title': v = this.htitle(); break;
			case 'ccss': v = this.cbullet(); break;
			case 'creator': let login = C_dS_loggable.get(this.creatorId); if(login) v = login.name; break;
			case 'created': let dt = jsDateFromUnixTime(this.created); v = dt.sortable({y:true}); break;
			case 'note': 
				d = '<div style="font-size:85%; text-align:left;">'+this.note+'</div>';
				v = this.note;
				break;
				
			default: v = this[member]; // in all other cases, display the genuine value
		} 
		return { c:1, t:t, v:v, d:d }; // count, type, values, html display
	},
	ctags: function(options) {
		let tags = '';
		options = options || {}; // like  { marginright:'0.5em', marginbetween:'0.2em', size:'100%' }
		if(this.has.tags) {
				let size = ''; if(options.size) size=' font-size:'+options.size+';';
				let tagsids = this.cssTags.split('!');

				let margin = options.marginbetween ? ' margin-right:'+options.marginbetween+';' : '';
				let last = tagsids.length-1;
			for(let x in tagsids) {
					let tagid = tagsids[x];
					let tagcss = C_dS_customCss.get(tagid).cssName;
						if(x==last) margin = options.marginright ? ' margin-right:'+options.marginright+';' : '';
					let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
				tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
			}
		}
		return tags;
	},
	htitle: function() { // returns the compiled task title (taking into consideration that title can be empty if some visitors references are given)

		// whatch out, this function is based on this dS values, and hence is different from M_CHAT::htitle()
		let htitle = '';
		if(this.title) htitle = this.title;
		else if(this.visirefs.byid.ends()) {
			let visirefs = this.visirefs.byid.get(); for(let id in visirefs) visirefs[id] = C_dS_visitor.get(id); 
			let names = C_dS_visitor.currentnames(visirefs);
			htitle = names;
		} else warning('datasets.js','C_dS_chat_thread','htitle','this note has no title nor visitors:'+this.id);
		return htitle;
	},
	partisum: function() { // (*ps01*)
		let psum = 0, ps;
		for(let lid in ps = this.participants.bylogin.get()) 
			if(!ps[lid].cueOut) psum+=lid|0;
		return psum;
	}
};
C_dS_chat_thread.plus = function() { // used by C_iTHREADS to list live chats
	this.genome = {  };
	
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_chats);
	this.eid = '_chat';
	this.list = function() {
		let labels = [], order = []; lastphyls = [];
		let register = cmems['chitems'].chats.get();
		for(let id in register) {
			let dS = register[id];
				dS.chtitle = dS.htitle(); // computed htitle
			labels[dS.id] = '<span style="white-space:nowrap">'+dS.cbullet({phys:true})+dS.ctags({marginright:'0.5em'})+dS.chtitle+'</span>';
			lastphyls[dS.id] = dS.lastphyl?dS.lastphyl:dS.created; // (*do01*) covers the case of a new chat that doesn't have a single phylactery yet, this one will have dS.lastphyl equal to zero.
			if(verboseOn) labels[dS.id] = dS.id+' '+labels[dS.id];
			order.push(dS.id);
		}
		// order.sort(function(a,b){return (register[a].chtitle>register[b].chtitle)?1:-1; }); // before lastphyl was available, we sorted this way
		order.sort(function(a,b){return (register[a].lastphyl<register[b].lastphyl)?1:-1; }); // (*do01*)
		return { lastphyls:lastphyls, labels:labels, order:order };
	};
	this.plus = function() { return new C_dS_chat_thread(); };
	this.get = function(id) { return cmems['chitems'].chats.get(id); };
	this.count = function() { return cmems['chitems'].chats.ends(); }
}
C_dS_chat_thread.del = function(id) {
	let item = cmems['chitems'].chats.get(id);
	cmems['chitems'].chats.del(item);
}
C_dS_chat_thread.get = function(bank, xcludeleted) {
		let allids = cmems[bank].chats.keys();
	if(!xcludeleted) return allids; // returns the full register in an array like ids[x] = id
	
	// exclude deleted items
	let subset = new Array(); 
	for(let x in allids) { 
			let id =  allids[x]
			let deleted = cmems[bank].chats.get(id).deletorId;
		if(!deleted) subset.push(id);
	}
	return subset;
}

C_dS_chat_thread.catalyst_Archives = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_chat_thread, // genome class
	register: function() { return cmems['archives'].chats; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'chats', // title for modal C_iARRAY.fields
	xlprefix: 'chats-', // translation prefix
	foptions: { // like fieldName:translation
		  id:'id', creator:'creator', created:'created', title:'title', note:'note', ccss:'ccss'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'creator', 'created', 'title', 'note', 'ccss' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};
C_dS_chat_thread.catalyst_visitab = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_chat_thread, // genome class
	register: function() { return cmems['visitab'].chats; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'chats', // title for modal C_iARRAY.fields
	xlprefix: 'chats-', // translation prefix
	foptions: { // like fieldName:translation
		  id:'id', creator:'creator', created:'created', title:'title', note:'note', ccss:'ccss'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'ccss','title','created','creator' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};


function C_dS_chat_participant(b, p) {
	C_dS_chat_participant.defaults.mergeto(this,p);
	if(this.id>0) cmems[b].chats.get(this.groupId).participants.bylogin.add(this.loginId, this);
		else C_dS_chat_participant.defaults.apply(this); // new object
};
C_dS_chat_participant.defaults = new A_df( { id:0, groupId:0, loginId:0, cueIn:0, physseen:0, live:0, cueOut:0 } );

function C_dS_chat_phylactery(b, p) {
	C_dS_chat_phylactery.defaults.mergeto(this,p);
	if(this.id>0) {
		let dS_chat_thread = cmems[b].chats.get(this.groupId);
		dS_chat_thread.phylacteries.bycue.add(this.cue, this);
	}
		else C_dS_chat_phylactery.defaults.apply(this); // new object
};
C_dS_chat_phylactery.defaults = new A_df( { id:0, groupId:0, cue:0, seqid:0, who:0, bla:'' } );

function C_dS_chat_visiref(b, p) {
	C_dS_chat_visiref.defaults.mergeto(this,p);
	if(this.id>0) cmems[b].chats.get(this.groupId).visirefs.byid.add(this.visiId, this);
		else C_dS_chat_visiref.defaults.apply(this); // new object
};
C_dS_chat_visiref.defaults = new A_df( { id:0, groupId:0, visiId:0 } );





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    N O T E S    &    T A S K S
//


function ntmem() { C_regS.apply(this,['notes','tasks']); };
ntmem.prototype = C_regS.prototype;

var ntmems = { plitems:new ntmem(), visitab:new ntmem(), catalyst:new ntmem() ,flush: function(which) { ntmems[which] = new ntmem() } }




	
	////////////////  N O T E    D E T A I L S

function C_dS_note_detail(b, p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_note_detail.defaults.mergeto(this,p,this.tmc);
	if(this.id>0) ntmems[b].notes.add(this.id, this);
	this.addressees = new C_regS('bylogin');
	this.visirefs = new C_regS('byid');
};
C_dS_note_detail.defaults = new A_df( { midnIn:0, midnOut:0, title:'', note:'',  cssColor:0, cssPattern:0, cssTags:'', archived:0 } );
C_dS_note_detail.prototype = {
	nbullet: function() {		
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		let bullet = '<div style="display:inline-block;" class="bullet '+color+pattern+'">&nbsp;</div>';
		return bullet;
	},
	uivalue: function(member) {
		let none = { c:1, t:'', v:'', d:'-' }, d;
		switch(member) {
			case 'midnIn': if(!this.midnIn) return none; d = new Date(this.midnIn*1000); return { c:1, t:'', v:d.sortable({y:true}) }; 
			case 'midnOut': if(!this.midnOut) return none; d = new Date(this.midnOut*1000); return { c:1, t:'', v:d.sortable({y:true}) }; 
			case 'title': return { c:1, t:'"', v:this.htitle() };
			case 'ccss': 
					let ccss = [];
				if(this.cssColor) ccss.push(C_dS_customCss.get(this.cssColor).name);
				if(this.cssPattern) ccss.push(C_dS_customCss.get(this.cssPattern).name);
				return { c:1, t:'"', v:ccss, d:this.nbullet() };
			case 'created': 
			case 'changed': 		
			case 'deleted': 		
				if(this[member]=='0000-00-00 00:00:00') return { c:1, t:'', v:{0:C_XL.w('never')} };
				else return { c:1, t:'', v:{0:this[member].substring(0,16)} };
			case 'deletor':
				let login = C_dS_loggable.get(this.deletorId);
				if(login) return { c:1, t:'', v:login.name }; else return none;
			case 'note':
				let div = '<div style="font-size:85%; text-align:left;">'+this.note+'</div>';
				return { c:1, t:'"', v:this.note, d:div };
				
			default: return { c:1, t:C_dS_note_detail.defaults._t[member], v:{0:this[member]} }; // in all other cases, display the genuine value
		}		
	},
	htitle: function() { // returns the compiled task title (taking into consideration that title can be empty if some visitors references are given)

		// whatch out, this function is based on this dS values, and hence is diffrent from M_NOTE::htitle()
		let htitle = '';
		if(this.title) htitle = this.title;
		else if(this.visirefs.byid.ends()) {
				let visirefs = this.visirefs.byid.get(); for(let id in visirefs) visirefs[id] = C_dS_visitor.get(id);
			let names = C_dS_visitor.currentnames(visirefs);
			htitle = names;
		} else warning('datasets.js','C_dS_note_detail','htitle','this note has no title nor visitors:'+this.id);
		return htitle;		
	}
};
C_dS_note_detail.plus = function() {
	this.genome = {};
	
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_notes);
	this.eid = '_note';
	this.list = function() {
		let labels = [], order = [];
		let register = ntmems['plitems'].notes.get();
		for(let id in register) {
				let dS = register[id];
					dS.chtitle = dS.htitle(); // computed htitle
				let note = dS.note?'<span style="font-size:85%; white-space:nowrap;">&nbsp;('+dS.note+')</span>':'';
				let bullet = dS.nbullet(); if(verboseOn) bullet = dS.id+' '+bullet;
			labels[dS.id] = '<span style="white-space:nowrap">'+bullet+dS.chtitle+'</span>'+note;
			order.push(dS.id);
		}
		order.sort(function(a,b){return (register[a].chtitle>register[b].chtitle)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() { return new C_dS_note_detail(); };
	this.get = function(id) { return ntmems['plitems'].notes.get(id); };
	this.count = function() { return ntmems['plitems'].notes.ends(); }
}
C_dS_note_detail.del = function(id) {
	let item = ntmems['plitems'].notes.get(id);
	ntmems['plitems'].notes.del(item);
}
C_dS_note_detail.catalyst_archives = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_note_detail, // genome class
	register: function() { return ntmems['plitems'].notes; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'notes', // title for modal C_iARRAY.fields
	xlprefix: 'notes-', // translation prefix
	foptions: { // like fieldName:translation
		  creator:'creator', created:'created', title:'title', note:'note', ccss:'ccss', midnIn:'midnIn', midnOut:'midnOut'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'creator', 'created', 'title', 'note', 'ccss', 'midnIn', 'midnOut' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};
C_dS_note_detail.catalyst_visitab = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_note_detail, // genome class
	register: function() { return ntmems['visitab'].notes; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'notes', // title for modal C_iARRAY.fields
	xlprefix: 'notes-', // translation prefix
	foptions: { // like fieldName:translation
		  creator:'creator', created:'created', title:'title', note:'note', ccss:'ccss', midnIn:'midnIn', midnOut:'midnOut'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'created','ccss','title' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};



	////////////////  T A S K    D E S C R I P T I O N S 

function C_dS_task_description(b,p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_task_description.defaults.mergeto(this,p,this.tmc);
	// if(this.id>0) ntmems[b].tasks.add(this.id, this);
	ntmems[b].tasks.add(this.id, this);
	if(this.id==0) C_dS_task_description.defaults.apply(this); // new object
	this.assignees = new C_regS('bylogin');
	this.visirefs = new C_regS('byid');
};
C_dS_task_description.defaults = new A_df( { title:'', description:'', midnIn:0, cssColor:0, cssTags:'', archived:0 } );
C_dS_task_description.prototype = {
	assignIds: function() { // returns ids of o_dS_task_assignee
		let ids = new Array(); 
		let assignees = this.assignees.bylogin.get(); // array like assignees[loginId] = o_dS_task_assignee
		for(let loginId in assignees) ids.push(assignees[loginId].id);
		return ids;
	},
	tbullet: function() {
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
			let assigned = this.assignees.bylogin.get(mobminder.context.loginId);
		let pattern = ''; if(assigned) pattern = ' p'+C_dS_customCss.get(assigned.cssPattern).css; // transparent when no pattern is chosen
		let bullet = '<div style="display:inline-block;" class="bullet '+color+pattern+'">&nbsp;</div>';
		return bullet;
	},
	assignedcount: function() {
		return this.assignees.bylogin.ends();
	},
	progresscount: function() {
		let done = 0 
		let assigned = this.assignees.bylogin.get();
		for(let id in assigned) { if(assigned[id].midnOut) done++; }
		return done;
	},
	progresstip: function() {
		let assigned = this.assignedcount();
		let progress = this.progresscount();
		if(!progress) return '';
		return '<span style="font-size:75%; white-space:nowrap; font-weight:bold">&nbsp;|'+progress+'/'+assigned+'|</span>';
	},
	medone: function() {
		let archivedyet = !!this.assignees.bylogin.get(mobminder.context.loginId).midnOut;
		if(!archivedyet) return '';
		return '<span style="font-size:75%; white-space:nowrap; font-weight:bold">'+C_XL.w('archived')+'&nbsp;</span>';
	},
	uivalue: function(member) {
		
		let v = '', d = '', dt, login;
		let t = C_dS_task_description.defaults._t[member]; // can be '"' for strings or '' for any other 

		switch(member) {
			case 'midnIn': 
				if(this.midnIn) { 
						dt = new Date(this.midnIn*1000); 
					d = v = dt.sortable({y:true});
				}
				break;
			case 'title': 	d = v = this.htitle(); break;
			case 'ccss': 	d = v = this.tbullet(); break;
			case 'creator': login = C_dS_loggable.get(this.creatorId); if(login) d = v = login.name; break;
			case 'created': dt = jsDateFromUnixTime(this.created); d = v = dt.sortable({y:true}); break;
			case 'description': 
				d = '<div style="font-size:80%; text-align:left; width:28em; overflow:hidden;">'+this.description+'</div>';
				v = this.description;
				break;
				
			default: v = d = this[member]; // in all other cases, display the genuine value
		}
		return { c:1, t:t, v:v, d:d }; // count, type, values
	},
	htitle: function() { // returns the compiled task title (taking into consideration that title can be empty if some visitors references are given)

		// whatch out, this function is based on this dS values, and hence is diffrent from M_TASK::htitle()
		let htitle = '';
		if(this.title) htitle = this.title;
		else if(this.visirefs.byid.ends()) {
					let visirefs = this.visirefs.byid.get(); for(let id in visirefs) visirefs[id] = C_dS_visitor.get(id);
				let names = C_dS_visitor.currentnames(visirefs);
			htitle = names;
		} else warning('datasets.js','C_dS_task_description','htitle','this task has no title nor visitors:'+this.id);
		return htitle;		
	}
};
C_dS_task_description.plus = function() {
	this.genome = {};
	
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_tasks);
	this.eid = '_task';
	this.list = function() {
		let labels = [], order = [];
		let register = ntmems['plitems'].tasks.get();
		for(let id in register) {
			if(id==0) continue; // do not display the virtual new task
			let dS = register[id];	
				dS.chtitle = dS.htitle(); // computed htitle
				let progress = dS.progresstip();
				let medone = dS.medone();
				let description = dS.description?'<span style="font-size:85%; white-space:nowrap;">&nbsp;('+dS.description+')</span>':'';
				let bullet = dS.tbullet(); if(verboseOn) bullet = dS.id+' '+bullet;
			labels[dS.id] = '<span style="white-space:nowrap">'+bullet+medone+dS.chtitle+'</span>'+progress+description;
			order.push(dS.id);
		}
		order.sort(function(a,b){return (register[a].chtitle>register[b].chtitle)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() { return new C_dS_task_description('plitems',[0]); };
	this.get = function(id) { return ntmems['plitems'].tasks.get(id); };
	this.count = function() { let c = ntmems['plitems'].tasks.ends(); return c; }
}
C_dS_task_description.del = function(id) {
	C_dS_task_assignee.del(id);
	C_dS_task_visiref.del(id);

	let item = ntmems['plitems'].tasks.get(id);
	ntmems['plitems'].tasks.del(item);
}

C_dS_task_description.catalyst_archives = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_task_description, // genome class
	register: function() { return ntmems['plitems'].tasks; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'tasks', // title for modal C_iARRAY.fields
	xlprefix: 'tasks-', // translation prefix
	foptions: { // like fieldName:translation
		  creator:'creator', created:'created', title:'title', description:'description', ccss:'ccss', midnIn:'midnIn', midnOut:'midnOut'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'creator', 'created', 'title', 'description', 'ccss', 'midnIn' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};
C_dS_task_description.catalyst_visitab = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	genomec: C_dS_task_description, // genome class
	register: function() { return ntmems['visitab'].tasks; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'tasks', // title for modal C_iARRAY.fields
	xlprefix: 'tasks-', // translation prefix
	foptions: { // like fieldName:translation
		  creator:'creator', created:'created', title:'title', description:'description', ccss:'ccss', midnIn:'midnIn', midnOut:'midnOut'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'created','ccss','title' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};



function C_dS_task_assignee(b,p) {
	C_dS_task_assignee.defaults.mergeto(this,p);
	if(this.id>=0) ntmems[b].tasks.get(this.groupId).assignees.bylogin.add(this.loginId, this);
	if(this.id>=0) C_dS_task_assignee.registers.bytaskid.add(this.groupId, this.id, this);
};
(C_dS_task_assignee.reset = function() {
	C_dS_task_assignee.registers = new C_regS('bytaskid');
})();
C_dS_task_assignee.defaults = new A_df( { id:0, groupId:0, loginId:0, midnOut:0, cssPattern:0, archived:0 } );
C_dS_task_assignee.prototype = {
	tabullet: function(options) { // options like {ifany:true, margin:true }
		let bullet = ''; options = options || {};
		// a span is displayed even when no custom css is applied
			let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
			let margin = options.margin ? 'margin-left:1em' : '';
		bullet = '<div style="display:inline-block; '+margin+'" class="bullet '+pattern+'">&nbsp;</div>';
		return bullet;
	},
	uivalue: function(member) {
		switch(member) {
			case 'loginId':
				let loginname = C_dS_loggable.getname(this.loginId);
				if(mobminder.context.loginId==this.loginId) loginname = '<strong>'+loginname+'</strong>';
				return loginname;
			case 'cssPattern': return this.tabullet({margin:true});
			case 'midnOut': 
				if(!this.midnOut) return '';
				return C_XL.date(this.midnOut, {abreviation:'full', weekday:true});
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) items.push( { c:1, t:'', v:this.uivalue(which[i]) } ); 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		for(let i in which) { let m = which[i]; types[m] = 'A'; }
		return types;
	}
};
C_dS_task_assignee.catalyst = function(taskId, options) {  // for C_iARRAY
	
	this.taskId = taskId; // specific to this catalyst that presents only assignees for a given task
	
	options = options || {};
	this.xlprefix = 'tskass-'; // translation prefix
	this.options = { cssPattern:'cssPattern', loginId:'loginId', midnOut:'midnOut' };
	this.on = options.on ? options.on : [ 'cssPattern', 'loginId', 'midnOut' ];
	this.sorton = { key:'loginId', order:1 };
	
	//
	this.labels = function() { // returns translated labels
		let headers = new Array(); 
		for(let x in this.options) 
			headers[x] = C_XL.w(this.xlprefix+this.options[x]);
		return headers;
	},
	this.sort = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
			set = set || this.keys();
			let key = this.sorton.key;
			let order = this.sorton.order; 
			let values = new Array(); for(let x in set) {  let id =  set[x]; values[id] = this.dS(id).uivalue(key); };
			
			// let ab = 'let a = values[a]; let b = values[b];';
			// if(order== 1) order = ' if(b < a) return  1; else if(a < b) return -1; return 0;';
			// if(order==-1) order = ' if(b < a) return -1; else if(a < b) return  1; return 0;';
			// eval('let sf = function(a,b) {'+ab+order+'}');
			
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
			
		return set.sort(sf);
	};
	this.keys = function() { return C_dS_task_assignee.registers.bytaskid.keys(this.taskId) };
	this.dS = function(id) { return C_dS_task_assignee.registers.bytaskid.get(this.taskId, id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let dumb = new C_dS_task_assignee('plitems', [-1]);
		return dumb.types(this.on);
	}
}
C_dS_task_assignee.del = function(taskId) {
	let items = C_dS_task_assignee.registers.bytaskid.get(taskId);
	for(let id in items) C_dS_task_assignee.registers.del(items[id]);
}

function C_dS_task_visiref(b, p) {
	C_dS_task_visiref.defaults.mergeto(this,p);
	if(this.id>0) ntmems[b].tasks.get(this.groupId).visirefs.byid.add(this.visiId, this);
		else C_dS_task_visiref.defaults.apply(this); // new object
};
C_dS_task_visiref.defaults = new A_df( { id:0, groupId:0, visiId:0 } );
C_dS_task_visiref.del = function(taskId) { /* no register */ };



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   V I S I T O R S 
//


function C_dS_visitor(p) {
	
	C_dS_trackingCCD.apply(this,p||arguments); // ||arguments been introduced for MSIE
	C_dS_visitor.defaults.mergeto(this,p,this.tmc);

	C_dS_visitor.register.id.add(this.id, this);
	
	// meta
	if(this.mobile) if(this.mobile[0]!='0') this.mobile = '+'+this.mobile;
	this.has = { ccss:!!(this.cssColor||this.cssPattern), tags:!!this.cssTags };
	this.ergomobile = this.vmobile();
	this.files = new C_regS('id');
}
C_dS_visitor.defaults = new A_df( { mergedTo:0, prefNotBefore:200, prefAMPM:parseInt('011111110111111100000000', 2), vip:0
	, gender:gendercode.male, firstname:'', lastname:'', company:'', address:'', residence:'', zipCode:'',  city:'', country:'', email:'', mobile:'', phone:''
	, language:0, birthday:0, registration:'', reference:'', note:'', cssColor:0,  cssPattern:0,  cssTags:'', selection:0 } );
(C_dS_visitor.init = function() {
	C_dS_visitor.register = new C_regS('id');
})();
C_dS_visitor.prototype = {
	vname: function(options) {  // options like {language:false, abr:true, gender:true, br:false, nowrap:false, separator:', ', switched:false }
		options = options||{}; if(!options.separator) options.separator = ', ';
			let tags = options.tags?this.vtags(options.tags)+' ' : ''; // options.tags is expected to contain vtags() options
			let gender = options.gender?C_XL.gender(this.gender)+' ' : '';
			let fname = options.abr?this.firstname[0]+'.':this.firstname; 
		if(options.language) fname+=' ('+mobminder.language.abr[this.language]+')';
			let br = options.br?'<br/>':'';
			let company = this.company?this.company+': ':'';
		let compiled = tags+company+gender+this.lastname+options.separator+fname; // lastname first
		if(options.switched) compiled = tags+company+gender+fname+options.separator+this.lastname; // firstname first
		if(options.nowrap) compiled = '<span style="white-space:nowrap;">'+compiled+'</span>';
		return br+compiled;
	},
	vmobile: function() { // inserts spaces in mobile phone numbers to improve readability
		let splicing = mobminder.account.phoneSlicing; // defines the mode of slicing (+32 493 65 55 99 or +32 493 655 599)
		return C_iFIELD.ergophone(this.mobile,splicing);
	},
	bullet: function(options) { // options like {ifany:true, margin:true } // bullet() is a generic interface to C_catalyst
		let bullet = '', verbose = '';
		options = options || {};
		if(this.has.ccss || !options.ifany) { // no span displayed when no ccss is specified
			// ifany: a span is forced displayed even when no custom css is present
				let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
				let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
				let margin = options.margin ? 'margin-left:1em' : '';
			bullet = '<div style="display:inline-block; '+margin+'" class="bullet '+color+pattern+'">&nbsp;</div>';
		}
		if(options.verbose) {
			if(this.cssColor) verbose += '&nbsp;'+C_dS_customCss.get(this.cssColor).name;
			if(this.cssPattern) verbose += '&nbsp;'+C_dS_customCss.get(this.cssPattern).name;
		}
		return bullet+verbose;
	},
	vbullet: function(options) { return this.bullet(options); },
	vtags: function(options) {
		let tags = '';
		options = options || {}; // like  { marginleft:'0.5em', marginbetween:'0.2em', size:'100%' }
		if(this.has.tags) {
				let size = ''; if(options.size) size=' font-size:'+options.size+';';
				let tagsids = this.cssTags.split('!');
				
			if(options.verbose) { // display as a list of item with each their name (used for tooltip where the tags signification are also displayed)
					let br = '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
						let dS_tag = C_dS_customCss.get(tagid);
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+size+'"';
					tags = tags+br+'<div '+style+' class="tag '+dS_tag.cssName+'"></div>&nbsp;'+dS_tag.name;
					br = '<br/>';
				}
				
			} else { // display inline (good for autocomplete list)
				let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
						let tagcss = C_dS_customCss.get(tagid).cssName;
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
					tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
					margin = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : ''; // reduce the margin between tags, only the first one is longer
				}
			}
		}
		return tags;
	},
	vwarn: function() { // (*v01*)
			let warn = '';
			let warnicon = '<div style="font-size:1.2em; display:inline-block;" class="orange fa fa-gray fa-warning"></div>';
		if(this.selection) warn = warnicon+'&nbsp;';
		return warn;
	},
	vtip: function() {
			let separator = '<hr/>';
			let tip = '', warning = '', birthday = '', address = '', phones = '', note = '';
				let bullet = this.vbullet({ifany:true, verbose:true}); if(bullet) bullet = '<br/>'+bullet;
				let tags = this.vtags({verbose:true}); if(tags) tags = separator+tags;
				let name = '<strong>'+this.vname()+'</strong>';
			if(this.birthday!=0) birthday = ' ('+tobdate(this.birthday)+')'; 
			if(this.selection) warning = '<br/>'+this.vwarn()+'&nbsp;'+C_XL.w('visitor overbooked');
			
				let addresstack = new Array(), addresslist = new Array();
			addresstack.push(this.residence,this.address,this.zipCode,this.city,this.country);
			for(let x in addresstack) if(addresstack[x]) addresslist.push(addresstack[x]);
			if(addresslist.length) address = separator+addresslist.join(', ');
			
				let phonestack = new Array(), phoneslist = new Array();
			phonestack.push(this.ergomobile,this.phone);
			for(let x in phonestack) if(phonestack[x]) phoneslist.push(phonestack[x]);
			if(phoneslist.length) phones = separator+phoneslist.join(', ');
			
			if(this.note) note = separator+this.note.htmlize();
			
		tip = name+birthday+warning+bullet+address+phones+tags+note;
		return tip;
	},
	html: function(members) {
		let items = new Array();
		let itemHTML = '', DBvalue, member;
		for(let i in members) {
			member = members[i];
			DBvalue = this[member];
			switch(member) {
				case 'gender': itemHTML = C_XL.gender(this.gender); break;
				case 'language': itemHTML = mobminder.language.names[this.language]; break;
				default: // in all other cases, display in the table just like they are recorded in DB
					itemHTML = DBvalue; 
			}
			items.push(itemHTML); 
		}
		return items;
	},
	uivalue: function(member) {
	
		switch(member) { // values as displayed on the browser table
			
			case 'gender': 		return { c:1, t:'"', v:{0:C_XL.gender(this.gender)} };
			case 'language': 	return { c:1, t:'"', v:{0:mobminder.language.names[this.language]} };
			case 'birthday': 	return { c:1, t:'"', v:{0:tobdate(this.birthday)} };
			case 'birthday_raw': return { c:1, t:'', v:{0:this.birthday} }; // for C_catalyst.sort() function
			case 'ccss':
				let ccss = [];
					if(this.cssColor) ccss.push(C_dS_customCss.get(this.cssColor).name);
					if(this.cssPattern) ccss.push(C_dS_customCss.get(this.cssPattern).name);
				return { c:ccss.length, t:'"', v:ccss, d:this.bullet() }; // d is the html  display value
				
			case 'note':
				let div = '<div style="font-size:85%; text-align:left;">'+this.note+'</div>';
				return { c:1, t:'"', v:this.note, d:div };
				
			default: return { c:1, t:C_dS_visitor.defaults._t[member], v:this[member] }; // in all other cases, display the genuine value
		}	
	},
	members: function(which, options) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) items.push(this.uivalue(which[i], options)); 
		return items;
	},
	// types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		// let types = new Array();
		// for(let i in which) types.push('A');
		// return types;
	// },
	vical: function() {
			let aid = mobminder.account.id;
			let vid = this.id;
			let vdi = this.lastname.toLowerCase().replace(/[ ,\-]/gi,'');
		return 'vical.mobminder.com/'+aid+'/'+vid+'/'+vdi;
	}
}
C_dS_visitor.membersCount = 22;
C_dS_visitor.get = function(id) { return C_dS_visitor.register.id.get(id); }
C_dS_visitor.ACoptions = {
	trigger: 3,
	css: 'alpha20',
	callback: false,
	exclude: false,
	fetch: function(digits, callback, exclude, acxtrapass) { // acxtrapass is used for (*v01*)
		this.callback = callback; this.exclude = exclude || false;
		let passer = {digits:digits};
		if(acxtrapass) {
			if(typeof acxtrapass === "object")
				for(let p in acxtrapass) passer[p] = acxtrapass[p]; 
		}
			
		let post = new C_iPASS(passer);
		mobminder.app.post({post:post}, {post:post.autonames()}, './queries/visitors.php', new A_cb(this, this.stream, digits));
	},
	label: function(id) { 
		return this.merge(C_dS_visitor.register.id.get(id));
	},
	
	merge: function(dS_visitor) {
		let mobile = ''; if(dS_visitor.mobile) mobile = ' '+dS_visitor.ergomobile;
		let registration = ''; if(dS_visitor.registration) registration = ' - '+dS_visitor.registration;
		let birthday = ''; if(dS_visitor.birthday!=0) birthday = ' ('+tobdate(dS_visitor.birthday)+')'; 
		let bullet = dS_visitor.vbullet({ifany:true, margin:true});
		let tags = dS_visitor.vtags({marginleft:'0.5em',marginbetween:'0.2em'});
		let name = dS_visitor.vname();
		let warning = dS_visitor.vwarn(); // based on dS_visitor.selection, used from AC query to show already appointed visitors (*v01*)
		if(is.newtouch)
			return warning+name+'<br/>&nbsp;<span style="font-size:70%;">'+mobile+birthday+registration+bullet+tags+'</span>';
		else
			return warning+name+mobile+birthday+registration+bullet+tags;
	}, 
	tip: function(id) {
		let dS_visitor = C_dS_visitor.register.id.get(id);
		return { text:dS_visitor.vtip(), css:'visi-tip'};
	},
	stream: function(digits, datasets) {
		let options = new Array();
		let presets = new Array(); // they contain the tooltip indications
		let visitors = datasets['C_dS_visitor'];
		let xcl = new Array();
		if(this.exclude) {
			if(this.exclude instanceof Array) xcl = this.exclude; 
			else xcl.push(this.exclude); // this.exclude can be a single value or an array
		}
		for(let id in visitors) { // they contain the labels displayed on the ac drop menu
				var skip = false;
			for(let i in xcl) if(id == xcl[i]) { skip=true; break; } // hides from the dropdown list the items defined in this.exclude when fetch() was called
			if(skip) continue;
			
			options[id] = C_dS_visitor.ACoptions.merge(visitors[id]);
			presets[id] = { tip:C_dS_visitor.ACoptions.tip(id) };
		}
		
		
		C_dS_visitor.ACoptions.callback.cb(digits, options, presets);
	}
}
C_dS_visitor.currentnames = function(visitors) { // visitors is an array like [ id1:dS_visitor, id2:dS_visitor ]
		let c = 0, names = '', sameln = true, lastname = ''; 
		let id; for(id in visitors) {  
			if(visitors[id]===undefined) // visiref object points to an unexisting visitor in DB (still how to be understood how this is possible)
				{ console.log('C_dS_visitor.currentnames() visitor id '+id+' is passed but undefined !!'); continue; }
			if(c) if(visitors[id].lastname != lastname) sameln = false;
			lastname = visitors[id].lastname;
			c++;
		}
		if(c==1) names = visitors[id].vname({gender:true});
		else if(c>1) {
			let many = new Array(); 
			if(sameln) {
				for(let id in visitors) many.push(visitors[id].firstname);
				names = many.join(' & ')+' '+lastname;
			}
			else for(let id in visitors) {
				many.push(visitors[id].vname({abr:true, separator:' ', switched:true})); 
				names = many.join(', ');
			}
		}
		return names;
}


function C_lastname(p) { // used for new visitor's lastname auto-completion
	C_lastname.defaults.mergeto(this,p);
	C_lastname.register.push(this.lastname);
}
C_lastname.defaults = new A_df( { lastname:'' } );
(C_lastname.init = function() { C_lastname.register = []; })();
C_lastname.ACoptions = {
	trigger: 5,
	css: 'alpha20',
	callback: false,
	exclude: false,
	fetch: function(digits, callback, exclude) { 
		this.callback = callback; this.exclude = exclude || false;
		let post = new C_iPASS({digits:digits});
		mobminder.app.post({post:post}, {post:{digits:'digits'}}, './queries/lastname.php', new A_cb(this, this.stream, digits));
		C_lastname.init();
	},
	label: function(x) { 
		return C_lastname.register[x];
	},
	stream: function(digits, datasets, stream) {
		let options = C_lastname.register;
		C_lastname.ACoptions.callback.cb(digits, options);
	}
}

function C_dS_visitorPreferences(p) {
	C_dS_visitorPreferences.defaults.mergeto(this,p);
	this.resources = (this.resources!='') ? this.resources.split('!') : [];
	this.workcodes = (this.workcodes!='') ? this.workcodes.split('!') : [];
	C_dS_visitorPreferences.register[this.visitorId] = this;
}
C_dS_visitorPreferences.defaults = new A_df( { visitorId:0, resources:'', workcodes:'' } );
C_dS_visitorPreferences.register = new Array();


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   V I S I T O R S    M A N A G E M E N T 
//

function C_dS_visitorAlpha(p) { // similar to C_dS_visitor with special registers suited for the alphatab view
	C_dS_visitor.apply(this,arguments);
	C_dS_visitorAlpha.register.id.add(this.id, this);
};
if(is.browser.MSIE) C_dS_visitorAlpha.name = 'C_dS_visitorAlpha'; // Fixing MSIE shit that does not know of function name (*msie01*)
C_dS_visitorAlpha.prototype = C_dS_visitor.prototype;
C_dS_visitorAlpha.defaults = C_dS_visitor.defaults;
(C_dS_visitorAlpha.init = function() {
	C_dS_visitorAlpha.register = new C_regS('id');
})();
C_dS_visitorAlpha.get = function(letter, xcludeleted) {
	let allids = C_dS_visitorAlpha.register.id.keys();
	if(!xcludeleted) return allids; // returns the full register in an array like ids[x] = id
	
	// exclude deleted items
	let subset = new Array(); 
	for(let x in allids) { 
			let id =  allids[x]
			let deleted = C_dS_visitorAlpha.register.id.get(id).deletorId;
		if(!deleted) subset.push(id);
	}
	return subset;
}
C_dS_visitorAlpha.catalyst = {  // for C_catalyst 
	
	genomec: C_dS_visitorAlpha, // genome class
	register: function() { return C_dS_visitorAlpha.register.id; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'visitors', // title for modal C_iARRAY.fields
	xlprefix: 'visi-', // translation prefix
	foptions: { // like fieldName:translation
		  id:'id', vip:'vip', company:'company', lastname:'lastname', firstname:'firstname', gender:'gender'
		, residence:'residence', address:'address', zipCode:'zipCode' , city:'city', country:'country'
		, email:'email', mobile:'mobile' , phone:'phone', language:'language' 
		, birthday:'birthday', registration:'registration' 
		, ccss:'ccss'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'ccss', 'birthday', 'gender', 'firstname', 'lastname', 'mobile', 'zipCode', 'city' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'lastname', order:1 }
	}
};




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   V I S I T O R S    F I L E S 
//

function C_dS_file(p) {
		
	C_dS_trackingCCD.apply(this,p);
	C_dS_file.defaults.mergeto(this,p,this.tmc);
	
	// meta
	if(this.id > 0) {
		C_dS_visitor.get(this.visitorId).files.id.add(this.id, this);
	}
}
C_dS_file.defaults = new A_df( { visitorId:0, name:'', note:'',  cssColor:0, cssPattern:0, cssTags:'', filename:'' } );
C_dS_file.prototype = {
	fbullet: function() {		
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		let typeicon = symbol(this.fextension()||'file', 'fa-lg', 'margin:0 auto;');
		let bullet = '<div style="display:table-cell; text-align:center;" class="bullet '+color+pattern+'">'+typeicon+'</div>';
		return bullet;
	},
	bullet: function() { return this.fbullet(); }, // generic interface to C_catalyst
	codename: function() { // file name as encoded on the server. // see (*F01*)
		return this.groupId+'_'+this.visitorId+'_'+this.id;
	},
	uivalue: function(member) { // used by catalyst table display
		switch(member) {
			case 'ccss': return this.fbullet();
			case 'creator': let login = C_dS_loggable.get(this.creatorId); if(login) return login.name; return ''; 
			case 'created': let d = jsDateFromUnixTime(this.created); return d.sortable({y:true}); 
			case 'note': return '<div style="font-size:80%; text-align:left; width:28em; overflow:hidden;">'+this.note+'</div>'; 
				
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { 
		let items = new Array();
		for(let i in which) { let member = which[i]; items[member] = this.uivalue(member); }
		return items;
	},
	fextension: function() { return this.filename.split('.').pop(); }
}
C_dS_file.catalyst_visitab = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	object: false, // check (*ct02*)
	genomec: C_dS_file, // genome class
	register: function() { return this.object.files.id; }, // (*ct02*) register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'files', // title for modal C_iARRAY.fields
	xlprefix: 'files-', // translation prefix
	foptions: { // like fieldName:translation
		  creator:'creator', created:'created', name:'name', ccss:'ccss', note:'note'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'creator', 'created', 'ccss', 'name', 'note' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'created', order:-1 }
	}
};
C_dS_file.del = function(vid, id) {
		let registers = C_dS_visitor.get(vid).files;
		let item = registers.id.get(id);
	registers.del(item);
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   L O G O S     F I L E S 
//
function C_dS_logo(p) {
		
	// C_dS_trackingCCD.apply(this,p);
	C_dS_logo.defaults.mergeto(this,p,this.tmc);
	
	// meta
	if(this.id>0) {
		C_dS_logo.register.byid.add(this.id, this);
		if(this.loginId)
			C_dS_logo.register.bylogin.add(this.loginId, this);
		else { 
			// this logo is common for all web pages of this account
			C_dS_logo.common = this;
		}
	}
}
C_dS_logo.defaults = new A_df( { id:0,groupId:0,loginId:0,filename:'',note:'' } );
C_dS_logo.prototype = {
	codename: function() { // file name as encoded on the server. // see (*F01*)
		return this.groupId+'_'+this.loginId+'_'+this.id;
	},
	fextension: function() { return this.filename.split('.').pop(); }
};
(C_dS_logo.reset = function() {
	C_dS_logo.register = new C_regS('byid','bylogin'); // only one logo is associated with a login
	C_dS_logo.common = undefined;
})();
C_dS_logo.get = function(loginId) {
	if(!loginId) return C_dS_logo.common; // common logo for all webpages in this account
	return C_dS_logo.register.bylogin.get(loginId);
}
C_dS_logo.del = function(id) {
	let item = C_dS_logo.register.byid.get(id); 
	if(item) if(item.loginId==0) { 
		C_dS_logo.common = undefined; 
	}
	C_dS_logo.register.del(item);
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E S E R V A T I O N S
//


function rmem() { C_regS.apply(this,['resas','atts', 'attvs', 'byvis', 'parts', 'perf', 'series', 'payments']); };
rmem.prototype = C_regS.prototype; // C_regS defined in mobframe.js

var rmems = { // plitems, slots, visiapps, standbylist, catalyst are the available banks
	  plitems:new rmem()
	, slots:new rmem()
	, visiapps:new rmem()
	, standbylist:new rmem()
	, catalyst:new rmem()
	,flush: function(which) { rmems[which] = new rmem() } } 

	//////////////// A T T E N D E E S

function C_dS_att_visitor(b,p) { // C_dS_visitor's and C_dS_resource's must be created first
	C_dS_att_visitor.defaults.mergeto(this,p);
	rmems[b].attvs.add(this.resaId, this.resourceId, C_dS_visitor.get(this.resourceId));
	rmems[b].byvis.add(this.resourceId, this.resaId, this);
	if(vbs) vlog('datasets.js','C_dS_att_visitor','new','id:'+this.id+', grpId:'+this.resaId); 
};
C_dS_att_visitor.defaults = new A_df({id:0, resaId:0, resourceType:0, resourceId:0});
C_dS_att_visitor.getbyvisitor = function() { // dS_reservation objects must be loaded prior to calling this function
	
	let resasbyvisitor = []; // like resasbyvisitor[visitorid][resaid] = dS_reservation
	let attendeesbyvisitor = rmems['visiapps'].byvis.get();
	for(let vid in attendeesbyvisitor) {
		resasbyvisitor[vid] = [];
		for(let rid in attendeesbyvisitor[vid]) {
			resasbyvisitor[vid][rid] =  rmems['visiapps'].resas.get(rid);
		}
	}
	
	return resasbyvisitor;
}

function C_dS_attendee(b, p) { // C_dS_visitor's and C_dS_resource's must be created first
	C_dS_attendee.defaults.mergeto(this,p);
	rmems[b].atts.add(this.resaId, this.resourceType, this.resourceId, C_dS_resource.get(this.resourceId));
	if(vbs) vlog('datasets.js','C_dS_attendee','new','id:'+this.id+', grpId:'+this.resaId); 
};
C_dS_attendee.defaults = new A_df({id:0, resaId:0, resourceType:0, resourceId:0});

function C_dS_resapart(b,p) {
	C_dS_resapart.defaults.mergeto(this,p);
	// meta data
	this.rmem = b;
	this.css = '';
	this.assess = class_resa_any;
	this.jsDateIn = new Date(this.cueIn*1000);
	this.jsDateOut = new Date(this.cueOut*1000);
	this.midnight = this.jsDateIn.clone().toMidnight().stamp();
	this.span = this.jsDateOut.span(this.jsDateIn);
	let timing = { cin:this.jsDateIn.HHmm(), out:this.jsDateOut.HHmm(), duration:duration(this.jsDateOut.span(this.jsDateIn)) };
	let schedule = {  cin: C_XL.date(this.jsDateIn,{abreviation:'abr',weekday:true}), out: C_XL.date(this.jsDateOut,{abreviation:'abr',weekday:true})};
	this.text = { time:timing, date:schedule };
	
	rmems[this.rmem].parts.add(this.groupId, this.midnight, this.id, this);
};
C_dS_resapart.defaults = new A_df({id:0, groupId:0, cueIn:0, cueOut:0, archived:0});
C_dS_resapart.prototype = {
	getpost: function() { return this.cueIn+'-'+this.cueOut; },
	resa: function() { return rmems[this.rmem].resas[this.groupId];	},
	clone: function() { 
		let part = new C_dS_resapart(this.rmem, [this.id, this.groupId, this.cueIn, this.cueOut, this.archived]);
		return part;
	}
}

function C_dS_resa_serie(b,p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_resa_serie.defaults.mergeto(this,p,this.tmc);
	this.rmem = b;
	rmems[this.rmem].series.add(this.id, this);
};
C_dS_resa_serie.defaults = new A_df({ stitle:'' });
C_dS_resa_serie.prototype = {
	getpost: function() { return this.stitle; },
}


joinnames = function(array) { // join names of objects from a 1 or 2 dimensions array
	let names = new Array();
	for(let i in array) {
		if(array[i]===undefined) { if(verboseOn) console.log('joinnames::undefined name for id='+i); continue; }
		if(array[i].name) names.push(array[i].name); // case of array like [id] = name
			else for(let j in array[i]) {  // case of array like [type][id] = name
				if(array[i][j]===undefined) { if(verboseOn) console.log('joinnames::undefined name for id='+j+', while rsc type i='+i); continue; }
				names.push(array[i][j].name);
			}
	}
	names = names.length ? names.join(' & ') : '';
	return names;
}

function C_dS_reservation(b, p) { 
	C_dS_trackingCCD.apply(this,p);
	C_dS_reservation.defaults.mergeto(this,p,this.tmc); // tmc stands for 'tracking members count'
	rmems[b].resas.add(this.id, this);
	this.rmem = b;
	this.rmeta();
	if(vbs) vlog('datasets.js','C_dS_reservation','new','id:'+this.id+', grpId:'+this.groupId); 
}
C_dS_reservation.defaults = new A_df( { cueIn:0, cueOut:86400	// !! watch this when you add new members to this object (*r00*)
	, peerId:0, remoteid:'', remoteProfile:0, iscluster:0, vip:0
	, waitingList:0, note:'',  cssColor:0, cssPattern:0, cssTags:'', rescheduled:0, serieId:0, snext:0, sprev:0, bookingcode:0
	, billamount:0
	, company:'', residence:'', address:'', zipCode:'', city:'', country:'' 
	, v:0, archived:0 } );
C_dS_reservation.prototype = { 
	// public
	peer: function() { return rmems[this.rmem].resas.get(this.peerId); },
	resa: function() { return this; }, // for interface homogeneity with C_dS_resapart // (*p01*)
	rdetails: function(mode, type) { // text for stickers in horizontal & vertical graphic views // see (*dt*)
		let level = C_dS_details.get(mode, type).details; 
		if(vbs) vlog('dbAccess','C_dS_reservation','details','mode:'+mode+', type:'+type+', level:'+level);
		let info = [], s=0, v=0, r=0, single = mobminder.account.single;
		
		if(level & details.schedule){ info[details.schedule] = this.text.span; s++ }
		if(level & details.duration){ info[details.duration] = '('+this.text.time.duration+')'; s++ }
		if(level & details.rtags) 	{ info[details.rtags] = this.rtags({size:'95%', marginleft:'0.3em', marginbetween:'0.1em'}); s+= info[details.tags]?1:0 }
		
		let br = ''; // in stickers, new line before writing the name, only when some info is displayed before the name
		if(mode==planning.horizontal) br = '<br/>';
		
		if(this.visicount>1 && (level&details.visitor)) // more than 1 visitor (ergo rule is to not flood the sticker with too much text)
			info[details.visitor] = C_XL.w('many visitors');
		else if(this.visicount) { // one visitor (most of the cases)
				let tags = false;
			if(level & details.vtags)		{ tags = {size:'95%', marginleft:'0em', marginbetween:'0.1em'}; s++ };
			if(level & details.registration){ info[details.registration]= '&nbsp;<b>('+this.visitor.registration+')</b>'; s++ };
			if(level & details.visitor) 	{ info[details.visitor] 	= this.visitor.vname({abr:!single, nowrap:false, tags:tags }); v++ }; // keep nowrap for resa stickers (week view)
			if(level & details.mobile) 		{ info[details.mobile] 		= '<span style="white-space:nowrap;">'+this.visitor.ergomobile+'</span>'; v++ }
			if(level & details.visitorNote) { info[details.visitorNote] = this.visitor.note; v++ }
			if(level & details.birthdate) 	{ info[details.birthdate] 	= tobdate(this.visitor.birthday); v++; }
			if(level & details.address) 	{ info[details.address] 	= this.visitor.address+', '+this.visitor.zipCode+' '+this.visitor.city; v++; }
			if(level & details.zipcode) 	{ info[details.zipcode] 	= this.visitor.zipCode; v++; }
		}
		if(level & details.resanote || this.assess != resaclass.appointment) { // events and performances have the note by default
			if(mode==planning.vertical&&this.cueOut-this.cueIn>=3600) { // when vertical and sufficient sticker height, we display the note inclusive cr's. 
				let divstyle = 'padding-left:.8em; border-left:2px solid rgba(0,0,0,.5); margin:.3em 0 .3em 1em;';
				if(this.note) 
					info[details.resanote] = '<br/><div style="'+divstyle+'">'+this.note.htmlize()+'<br/></div>';
			}
			else info[details.resanote] = this.note; 
			r++;
		} 
		if(level & details.workcodes) { info[details.workcodes] = this.text.workcodes; r++ }
		if(level & details.attendance) { info[details.attendance] = this.text.resources.buf; r++ }
		
		if(level & details.color) info[details.color] = (this.cssColor || this.cssPattern) ? this.text.ccss.color+' '+this.text.ccss.pattern : '';
		
		// returns a flat array that can be joined
		let schedule = new Array(info[details.schedule],info[details.duration],info[details.rtags]);  
			schedule = schedule.join(' '); schedule = s?'<span style="white-space:nowrap;">'+schedule+'</span>'+br:'';
		
		let visitor = new Array(info[details.vtags],info[details.visitor],info[details.mobile],info[details.visitorNote],info[details.birthdate],info[details.zipcode],info[details.address],info[details.registration]); 
			visitor = visitor.join(' ')+(v?br:'');
		
		let resa = new Array(info[details.resanote], info[details.workcodes],info[details.color],info[details.attendance]); 
			resa = resa.join(' ')+(r?br:'');
			
		return schedule+visitor+resa;
		
	},
	rtip: function() { // tooltip details 
		// mode is a planning view mode like { horizontal:2, vertical:1, text:3, hourly:4, ... }
		// type is a resource type
					
		if(vbs) vlog('dbAccess','C_dS_reservation','details','');
		let summup = new Array();
		let separator = '<hr/>';
		let padder = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		
		// schedule		
		let tags = this.rtags({size:'105%', marginleft:'0em', marginbetween:'0.2em'});

		summup.push(tags+(tags?' ':'')+this.text.span);
		
		// duration
		summup.push('('+this.text.time.duration+')');
		
		// visitor(s)
		let levelH = C_dS_details.get(planning.horizontal, class_bCal).details; // see (*dt*)
		let levelV = C_dS_details.get(planning.vertical, class_bCal).details;  
		let showAddress = ((levelH|levelV)&(details.address|details.zipcode)); // if any of vertical or horizontal view has enabled zip code or address, we display the address.
		
		if(this.visicount>10) 
			summup.push(C_XL.w('many visitors'));
		else if(this.visicount) {
			let c = 0; if(this.visicount>1) c=1;
			for(visiId in this.visitors) { 
				if(!this.visitors[visiId]) { console.log('Visitor id '+visiId+'is referenced but does not exists anymore'); continue; } // the visitor dS has been deleted but an attendee still exists (should never happen)
				let dS_visitor = this.visitors[visiId];
				let x = ''; if(c) x = '<b>'+c+'</b>. '; // when the counter is activated, this displays a numbering, else nope.
					let r = dS_visitor.registration?dS_visitor.registration+' ':'';
					let m = dS_visitor.mobile?' '+dS_visitor.ergomobile+' ':'';
					let n = dS_visitor.vname({gender:true, br:false/*this options breaks before*/});
					let t = dS_visitor.vtags({size:'95%', marginleft:'0.5em', marginbetween:'0.2em'});
					let a = ''; if(showAddress) a = '<br/>'+dS_visitor.address+', '+dS_visitor.zipCode+' '+dS_visitor.city;
				summup.push(padder+x+r+n+t+m+a);
				if(dS_visitor.note) summup.push('<br/>'+dS_visitor.note);
				if(c) c++;
			}
		}
		
		
		// resa attributes
		if(this.note) summup.push(separator+this.note); // events and performances have the note by default
		if(mobminder.account.has.workcodes) 
			if(this.performances) // workcodes (including price)
			{
				let p=0; for(pid in this.performances) p++;
				summup.push(separator+(p>1?C_XL.w('workcodes'):C_XL.w('workcode'))+':');
				if(p>10) 
					summup.push(C_XL.w('many performances'));
				else if(p) {
					let c = 0; if(p>1) c=1;
					for(let perfId in this.performances) { 
						if(!this.performances[perfId]) { console.log('Performance id '+perfId+'is referenced but does not exist anymore or in this config'); continue; } // the workcode dS has been deleted but a performance using this workcode still exists (should never happen)
						let dS_workcode = this.performances[perfId];
						let x = ''; if(c) x = '<b>'+c+'</b>. '; // when the counter is activated, this displays a numbering, else nope.
							let b = dS_workcode.wbullet();
							let n = dS_workcode.name;
							let p = dS_workcode.price?' '+C_XL.w('euros') + (dS_workcode.price/100).toFixed(2)+'-':'';
						summup.push(padder+x+b+n+p);
						// if(dS_workcode.note) summup.push('<br/>'+dS_workcode.note);
						if(c) c++;
					}
				}
			}
		if(this.cssColor || this.cssPattern) summup.push(separator+C_XL.w('color')+'/'+C_XL.w('pattern')+':'+this.text.ccss.color+' '+this.text.ccss.pattern);
		if(!mobminder.account.single) summup.push(separator+C_XL.w('with')+':'+this.text.resources.buf);
		
		return summup;
	},
	duration: function() { // returns a human readable text string
		if(this.iscluster) {
			let total = 0;
			for(midnight in this.iscluster) for(partId in this.iscluster[midnight]) total += this.iscluster[midnight][partId].span;
			return duration(total);
		}
		return duration(this.jsDateOut.span(this.jsDateIn));
	},
	partspost: function() {
		if(this.iscluster) {
				let post = new Array();
			for(midnight in this.iscluster) for(partId in this.iscluster[midnight]) post.push(this.iscluster[midnight][partId].getpost());
			return post.join('!');
		}
		return '-';
	},
	unregister: function() {
		rmems[this.rmem].atts.del(this.id, 1);
		rmems[this.rmem].attvs.del(this.id, 1);
		rmems[this.rmem].parts.del(this.id, 1);
		rmems[this.rmem].perf.del(this.id, 1);
		rmems[this.rmem].resas.del(this.id, 1);
	},
	clone: function(bank) { // bank: specifies a new bank storage for the clone

		let id;
		let cloneid = -this.id;
		
		for(let pid in this.performances)
			new C_dS_performance(bank||this.rmem, [-pid,cloneid,pid,this.performances[pid].visitorId,this.performances[pid].checklist]);
		for(let vid in this.visitors)
			new C_dS_att_visitor(bank||this.rmem, [-vid,cloneid,class_visitor,vid]);
		for(let aclass in this.resources)
			for(let rid in this.resources[aclass])
				new C_dS_attendee(bank||this.rmem, [-rid,cloneid,aclass,rid]);
		
			let args = [cloneid, this.groupId, this.created, this.creator, this.creatorId, this.changed, this.changer, this.changerId, this.deleted, this.deletorId ];
			for(let a in C_dS_reservation.defaults) // is an instance of A_df
				if(a in A_df.prototype) continue; // no action for prototype functions
				else args.push(this[a]); // build an array that reflects the current object
				
		let r = new C_dS_reservation(bank||this.rmem, args);
		return r;
		
		// This older version was dependant on the structure of C_dS_reservation.defaults, now replaced by the above loop
		// return new C_dS_reservation(bank||this.rmem, // (*r00*)
			// [-this.id, this.groupId, this.created, this.creator, this.creatorId, this.changed, this.changer, this.changerId, this.deleted, this.deletorId
			// , this.cueIn, this.cueOut, this.peerId, this.layerLevel, this.iscluster, this.vip, this.waitingList
			// , this.note, this.cssColor, this.cssPattern, this.cssTag, this.rescheduled, this.serieId, this.snext, this.sprev, this.archived]);
	},
	changeattendance: function(ids) {
		rmems[this.rmem].atts.del(this.id, 1);
		rmems[this.rmem].attvs.del(this.id, 1);
		for(let aclass in ids) {
			for(let x in ids[aclass]) { let id = ids[aclass][x];
				switch(aclass|0) {
					case class_bCal:
					case class_uCal:
					case class_fCal: new C_dS_attendee(this.rmem, [-id,this.id, aclass,id]); break;
					case class_visitor: new C_dS_att_visitor(this.rmem, [-id,this.id, aclass,id]); break;
				}
			}
		}
		return this.rmeta();
	},
	changeperformance: function(workcodes) {
		rmems[this.rmem].perf.del(this.id, 1);
		for(let wid in workcodes) new C_dS_performance(this.rmem, [-wid,this.id,wid]);
		return this.rmeta();
	},
	changecue: function(cueIn) {
		let duration = this.cueOut - this.cueIn;
		this.cueOut = cueIn + duration;
		this.cueIn = cueIn;
		return this.rmeta();
	},
	
	getstaff: function(resclass) { // ready to post list of resources
		let resources = this.resources[resclass];
		let array = new Array();
		for(let id in resources) array.push(id);
		return array.length ? array.join('!') : '-';
	},
	getvisitors: function() { // ready to post list of visitors
		let array = new Array();
		for(let id in this.visitors) array.push(id);
		return array.length ? array.join('!') : '-';
	},
	getperformances: function() { // ready to post list of performances
		let array = new Array();
		for(let id in this.performances) array.push(id);
		return array.length ? array.join('!') : '-';
	},	
	bullet: function() { // !generic interface to C_catalyst
		let bullet = '<div class="bullet '+this.css+'">&nbsp;</div>'; 
		return bullet;
	},
	resabullet: function() { return this.bullet(); },
	rtags: function(options) {
		let tags = '';
		options = options || {}; // like  { marginleft:'0.5em', marginbetween:'0.2em', size:'100%' }
		if(!!this.cssTags) {
			let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
			let size = ''; if(options.size) size=' font-size:'+options.size+';';
			let tagsids = this.cssTags.split('!');
			for(let x in tagsids) {
					let tagid = tagsids[x];
					let tagcss = C_dS_customCss.get(tagid).cssName;
					let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
				tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
				margin = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : ''; // reduce the margin between tags, only the first one is longer
			}
		}
		return tags;
	},
	
	// e-payment
	haspayment: function() {
		let payments = payregs.all.byresaid.get(this.id);
		let count = 0;
		for(let x in payments) { 
			let payment = payments[x];
			count++;
		}
		return count; // which is in units of cents
	},
	getpaidsum: function() {
		let payments = payregs.all.byresaid.get(this.id);
		let sum = 0;
		for(let x in payments) { 
			let payment = payments[x];
			if(payment.transtatus==C_dS_payment.status.code.success) sum += payment.amount;
		}
		return sum; // which is in units of cents
	},
	getpaycomm: function() { // communication text that we associate to e-payments 
			let summup = new Array();
			let date = C_XL.date(this.jsDateIn,{abreviation:'full',weekday:true, year:true});
			let time = this.jsDateIn.HHmm();
			let resource = ''; // signature or nothing (some resource name in call center contain guidelines, not to be passed to communication)
			let visitor = '';
			let text = date+C_XL.w('at',{cap:0})+' '+time+' - '+visitor+' - '+resource+mobminder.account.name;
		return text;
	},
	
	// catalyst interface
	rresources: function(rscclass) {
			let resources = this.resources[rscclass];
			let ra = new Array();
		for(let id in resources) ra.push(resources[id].name);
		return { c:ra.length, t:'"', v:ra };
	},
	rperformances: function() { 
		let prfs = this.performances;
		let p = new Array();
		for(let id in prfs)
			if(prfs[id])	
				p.push(prfs[id].name);
		return { c:p.length, t:'"', v:p }
	},
	rdateIn: function() { 
			let d = C_XL.date(this.jsDateIn, { abreviation:'full', weekday:true, time:false });
			let v = this.jsDateIn.sortable();
		return { c:1, t:'"', v:{0:v}, d:d }; // on html screen displays date in a human friendly format
		// return 
	},
	rdateOut: function() { 
			let d = C_XL.date(this.jsDateOut, { abreviation:'full', weekday:true, time:false });
			let v = this.jsDateIn.sortable();
		return { c:1, t:'"', v:{0:v}, d:d }; // on html screen displays date in a human friendly format
	},
	rcueIn: function()  { return { c:1, t:'"', v:{0:this.text.time.cin} } },
	rcueOut: function() { return { c:1, t:'"', v:{0:this.text.time.out} } },
	rduration: function() { 
		let v = (this.cueOut-this.cueIn)/60; // is a number minutes
		return { c:1, t:'', v:{0:v}, d:v+'mn' };
	},
	
	// used from e.g M_RESA
	rsymbol: function(which) { // defines iconic symbol for this window
		let s = false;
		switch(which) {
			case 'app': 		s = 'calendar-check'; break; // checked calendar
			case 'event': 		s = 'calendar-minus'; break; // with a minus sign
			case 'new': 		s = 'calendar-plus'; break; // with a plus sign
			case 'deleted': 	s = 'calendar-times'; break; // crossed
			case 'calendar': 	s = 'calendar'; break; // entire days
			case 'replan': 		s = 'calendar'; break; // entire days
		}
		return '<span style="padding:0 .2em 0 .7em;" class="fa fa-gray fa-13x fa-'+s+'"></span>';
	},
	rtitle: function() { // defines title for this window, including symbol (*M01*)
			let title, symbol = 'app'; 
			let xlo = { cap:true };
		switch(this.assess) {
			case resaclass.appointment: title = C_XL.w('appointment',xlo); break;
			case resaclass.event: title = C_XL.w('event',xlo); symbol = 'event'; if(this.is.calendar) symbol = 'calendar'; break;
			case resaclass.fcalwide: title = C_XL.w('tracking',xlo)+' '+C_XL.w('single'+class_fCal); break;
			default: title = 'title?';
		}
		if(this.peerId && (this.assess!=resaclass.fcalwide)) title += ' '+C_XL.w('with')+' '+C_XL.w('single'+class_fCal);
		
		if(this.id <= 0) { // new appointment
			if(this.replan) { title += ': '+C_XL.w('replan',xlo); symbol = 'replan'; }
				else if(this.duplicate) { title += ': '+C_XL.w('duplicate',xlo); symbol = 'new'; }
					else { title += ': '+C_XL.w('new',xlo); symbol = 'new'; }
		}
		if(this.deletorId) 
			if(this.rescheduled) { title += ': '+C_XL.w('rescheduled',xlo); symbol = 'deleted'; }
				else { title += ': '+C_XL.w('deleted',xlo); symbol = 'deleted'; }
				
		return title+this.rsymbol(symbol);
	},
	
	// private
	rmeta: function() { // pre-computed data, made from native datasets
		
		// meta data
		this.jsDateIn = new Date(this.cueIn*1000);
		this.jsDateOut = new Date(this.cueOut*1000);
		
			let midnightjd = this.jsDateIn.clone({midnight:1});
		this.midnight = midnightjd.stamp();
		this.timeshift = midnightjd.timeshift();
		
		// re-link this object to its attributes (note that all attributes were heading the stream for proper work)
		this.performances = rmems[this.rmem].perf.get(this.id); // is undefined or an array like this.performances[id] => o_dS_workcode or false 
		this.visitors = rmems[this.rmem].attvs.get(this.id); // is an array like this.visitors[id] => o_dS_visitor or false 
		this.visitor = false;
		this.visicount = 0;
		for(let visiId in this.visitors) { 
			if(!this.visitors[visiId]) { console.log('Visitor id '+visiId+'is referenced but does not exists anymore'); continue; } // the visitor dS has been deleted but an attendee still exists (should never happen)
			else { 
				if(!this.visitor) this.visitor = this.visitors[visiId]; // catch the first one
				this.visicount++;
			}
		}
		let cals = this.resources = rmems[this.rmem].atts.get(this.id) || [];
		this.assess = this.resaClass();
		
		this.bCal = false; // is an o_dS_resource or false
		if(class_bCal in cals) for(let b in cals[class_bCal]) { this.bCal = cals[class_bCal][b]; break; }
		
		if(this.id<=0) { // set initial color, pattern and tags for new objects
			// this must behave correctly when the M_RESA changes the clone resaclass
			// note that R_search might have duplicated ccss in a fresh new resa in case of duplicate or replan, check R_search::this.state.duplicate
			this.cssColor 	= this.cssColor?this.cssColor:mobminder.account.defCcss[ccsstype.color][this.assess];
			this.cssPattern = this.cssPattern?this.cssPattern:mobminder.account.defCcss[ccsstype.pattern][this.assess];
			this.cssTags = this.cssTags?this.cssTags:mobminder.account.defCcss[ccsstype.tag][this.assess];
		}
		this.tipcss = this.css = this.cssclass(this.assess); // depends on this.bCal
		if(this.performances) this.tipcss = 'tip'; // when performances are listed, the tooltip is yellow standard (so to see the perf color bullets!)
		if(this.deletorId) 
			if(this.rescheduled) this.css = 'resa resa-deleted p801'; // p801 is hashed decrementing
				else this.css = 'resa resa-deleted p800'; // p800 is hashed incrementing
	
		// clusters and parts
		this.iscluster = this.iscluster?rmems[this.rmem].parts.get(this.id):0;
		if(this.iscluster) for(let midnight in this.iscluster) for(let partId in this.iscluster[midnight])  { 
			let o = this.iscluster[midnight][partId]; o.css = this.css; o.assess = this.assess;
		};
		
		
			let jsnow = new Date(); let phpnow = jsnow.getPHPstamp();
			let insameyear = this.jsDateIn.sameYear(this.jsDateOut);
			let nothisyear = this.jsDateIn.sameYear(jsnow);
			let displayear = (!insameyear)||(!nothisyear);
			let sameday = this.jsDateIn.sameday(this.jsDateOut); // starts and ends in the same calendar day
			let soon = this.jsDateIn.isclose(16, jsnow); // starts in the upcoming 16 hours, keep this setting equal to see here (*ic00*), see here (*ic10*)
			let calendar = this.jsDateIn.calendar(this.jsDateOut); // starts today
		this.is = { future:(this.cueIn>phpnow), past:(this.cueOut<phpnow), soon:soon, sameday:sameday, calendar:calendar, fromserie:(this.serieId) };
		
		// series
		this.serie = rmems[this.rmem].series.get(this.serieId) || new C_dS_resa_serie(this.rmem,C_dS_trackingCCD.tnew(0, mobminder.account.id).concat(['' /*stitle*/])); // (*s01*)
		
		// text preset
		let d = this.duration();
		let timing = { cin:this.jsDateIn.HHmm(), out:this.jsDateOut.HHmm(), duration:d };
			let dateout = this.jsDateOut.seconds() ? C_XL.date(this.jsDateOut,{abreviation:'abr',weekday:true, year:displayear}) : C_XL.date(this.jsDateOut.clone().increment({d:-1}),{abreviation:'abr',weekday:true, year:displayear});
		let schedule = {  cin:C_XL.date(this.jsDateIn,{abreviation:'abr',weekday:true, year:displayear}), out:dateout };
		let b = joinnames(cals[class_bCal]);
		let u = joinnames(cals[class_uCal]);
		let f = joinnames(cals[class_fCal]);
		let buf = joinnames(cals);
		let w = joinnames(this.performances);
		let c = this.cssColor ? C_dS_customCss.get(this.cssColor).name : '';
		let p = this.cssPattern ? C_dS_customCss.get(this.cssPattern).name : '';
		let span = this.cueOut-this.cueIn;
		if(this.is.sameday) span = timing.cin;
			else if(span==86400&&this.is.calendar) span = C_XL.w('ondate')+' '+schedule.cin;
				else if(this.is.calendar) span = C_XL.w('fromdate')+' '+schedule.cin+' '+C_XL.w('todate')+' '+schedule.out+' '+C_XL.w('date included');
					else span = C_XL.w('fromdate')+' '+schedule.cin+' '+C_XL.w('at',{cap:0})+' '+timing.cin+' '+C_XL.w('todate')+' '+schedule.out+' '+C_XL.w('at',{cap:0})+' '+timing.out;

		this.text = { time:timing, date:schedule, span:span, resources:{ b:b, u:u, f:f, buf:buf }, workcodes:w, ccss:{ color:c, pattern:p } };
		return this;
	},
	cssclass: function(assess) { // setting up custom css

		let perfcss = { color:false, pattern:false }; // when specified, use the performance color or pattern
		for(let id in this.performances) { 
			let workcode = this.performances[id]; // this can collect pattern and color from two different assigned performances
			if(!workcode) continue; // workcode has been deleted from config
			if(workcode.ccss.color) perfcss.color = workcode.ccss.color;
			if(workcode.ccss.pattern) perfcss.pattern = workcode.ccss.pattern;
		};
		
			// color
		let cssColor;
		if(this.cssColor) { // specific Ccss color has PRECEDENCE on the performance color
			if(C_dS_customCss.get(this.cssColor)===undefined) console.log('undefined css:'+this.cssColor);
			else
				cssColor = C_dS_customCss.get(this.cssColor).css; // a full custom css is applied for this reservation
		}
		else if(perfcss.color) cssColor = perfcss.color; // when at least one workcode has a color
			else if(assess==resaclass.appointment && this.bCal) cssColor = this.bCal.color; // otherwise, if appointment, it takes the bCal color
				else cssColor = C_dS_customCss.getByType(assess, ccsstype.color, 0).css; // if not an appointment, it goes grayed (default css id zero)

		let css = 'resa c'+cssColor; // note that there is always a color specified
		
			// pattern (there is not always a pattern applied)
		let cssPattern = false; // specific Ccss pattern has PRECEDENCE on the performance pattern
		if(this.cssPattern) {
			if(C_dS_customCss.get(this.cssPattern)===undefined) console.log('undefined pattern:'+this.cssPattern);
			else
				cssPattern = C_dS_customCss.get(this.cssPattern).css; // a full custom css is applied for this reservation
		}
		else if(perfcss.pattern) cssPattern = perfcss.pattern; // when at least one workcode has a pattern
		
		if(cssPattern) css+=' p'+cssPattern;
		return css;
	},
	resaClass: function() {
		let resources = this.resources;
		if(!resources) return resaclass.event; // normally this never happens, it is a resa without attendee
		if(this.visicount) // there is a visitor
			if(resources[class_bCal]) return resaclass.appointment;
				else return resaclass.fcalwide; // only a visitor and an fCal, never a bCal
		// there is no visitor
		return resaclass.event; // a single type of resource is assigned (vacation)
	},
	getparts: function(midnight) { // returns cueable objects that can be used for stickers, see (*gp*)
		
		/////// Possible configurations for a resa are as follow
		//
		//
		//  CASE 1: is.sameday (returned as one part)
		//
		//                          cueIn   cueOut
		//                           |<----->|
		//                           |       |
		//  ------------------|------------------|------------------|------------------|
		//                  midnight           midnight           midnight           midnight
		//
		//
		//
		//  CASE 2: calendar holiday (returned in two parts for this example)
		//
		//                           cueIn                                 cueOut
		//                             |<----------------------------------->|
		//                             |                                     |
		//  ------------------|------------------|------------------|------------------|
		//                  midnight           midnight           midnight           midnight
		//
		//
		//
		//  CASE 3: calendar holiday (returned in two parts for this example), fulldays == true
		//
		//                  cueIn                                 cueOut
		//                    |<----------------------------------->|
		//                    |                                     |
		//  ------------------|------------------|------------------|------------------|
		//                  midnight           midnight           midnight           midnight
		//
		//
		//
		//  CASE 4: clusters (the reservation extends over days, in small parts)
		//
		//   dS_reservation        cueIn                                       cueOut
		//                          |<----------------------------------------->|
		//                          |                                           |
		//   dS_resapart          cueIn   cueOut     cueIn   cueOut   cueIn   cueOut
		//                          |<----->|         |<------->|        |<---->|
		//                          | part1 |         |  part2  |        | part3|
		//  ------------------|------------------|------------------|------------------|
		//                  midnight           midnight           midnight           midnight
		//
		
		if(midnight) { // request for only one particular day (midnight)
			
			if(this.iscluster) { return this.iscluster[midnight]; } // return the parts that are stored in DB
			if(this.is.sameday) return new Array(this);  // most of the cases <=> THEY DO NOT USE C_dS_resapart !!
			
				// case of a resa that spans over many days, cut and return the part that is visible in the requested day
			let cueIn = this.cueIn, cueOut = this.cueOut;
			if(this.cueIn < midnight) cueIn = midnight;
			if(this.cueOut > (midnight+86400)) cueOut = (midnight+86400);
			part = new C_dS_resapart(this.rmem, [0, this.id, cueIn, cueOut, 0]);
			part.css = this.css; part.assess = this.assess;
			return new Array(part);
		}
		
		// request for all parts, potentially covering many days: we return all parts
			
				// console.log('-',this.id,'-');
		let parts = new Array(); 
		if(this.is.sameday) return new Array(this); // most of the cases <=> THEY DO NOT USE C_dS_resapart !!
		if(this.iscluster) { // case 4
			for(let m in this.iscluster) 
				for(let id in this.iscluster[m]) 
					parts.push(this.iscluster[m][id]); 
			for(let id in parts) { parts[id].css = this.css; parts[id].assess = this.assess; }
			return parts;
		}
		
		// cases 2 or 3
		// long overday reservation, should be cut in parts
		let i = this.jsDateIn.clone({midnight:1});
		let o = this.jsDateOut.clone({midnight:1});
		let v = 1;
			let som = this.jsDateIn.stamp()==i.stamp();	// starts on midnight
			let eom = this.jsDateOut.stamp()==o.stamp(); // ends on midnight
		let fulldays = som&&eom;
		
		parts.push(new C_dS_resapart(this.rmem, [v++, this.id, this.cueIn, i.stamp()+86400, 0])); // leading end
		while(i.addDay(1)<o) parts.push(new C_dS_resapart(this.rmem, [v++, this.id, i.stamp(), i.stamp()+86400, 0])); // trailers
		if(!eom) parts.push(new C_dS_resapart(this.rmem, [v++, this.id, i.stamp(), this.cueOut, 0])); // end of trailer
	
		for(let id in parts) { parts[id].css = this.css; parts[id].assess = this.assess; }
		return parts;
	},
	
	// interface to C_catalyst and further C_iARRAY
	rvisitors: function(options) { // C_catalyst // returns an html/csv renderable version of visitors
	
		let v = new Array();
		options = options||{field:'lastname'};
		let t = C_dS_visitor.defaults._t[options.field]; // can be '"' for strings or '' for any other 
		
		for(let id in this.visitors) {
				let info, visitor = this.visitors[id]; 
			if(options.field) { // requires a specific field
				switch(options.field) {
					case 'email': 		info = visitor.email;  break; 
					case 'birthday_raw': info = visitor.birthday; t = ''; break; // for C_catalyst.sort() function
					case 'birthday': info = tobdate(visitor.birthday,{format:'sortable'});
						t = '"'; // forces birthdays to be quoted in csv files, they arrive as integer from the server
						break; 
					case 'mobile': 		info = visitor.mobile; break; 
					
					case 'zipCode': 	info = visitor.zipCode; break;
					case 'company': 	info = visitor.company; break;
					case 'residence': 	info = visitor.residence; break;
					
					case 'registration': info = visitor.registration; break;
					
					case 'visitors':
					default: t = '"'; info = visitor.vname({nowrap:false});
				}
			}
			v.push(info); 
		}
		return { c:v.length, t:t, v:v }; // count, type, values
	},
	uivalue: function(member) {	// C_catalyst
		switch(member) { // values as displayed on the browser table

			// for dS_visitor ( more than one visitor can be referenced in an appointment )
				case 'visitors': 	return this.rvisitors();
				case 'email': 		return this.rvisitors({field:'email'});
				case 'birthday_raw': return this.rvisitors({field:'birthday_raw'});
				case 'birthday': return this.rvisitors({field:'birthday'}); // see (*sr01*)
					
				case 'mobile': 		return this.rvisitors({field:'mobile'});
				case 'zipCode': 	return this.rvisitors({field:'zipCode'});
				case 'company': 	return this.rvisitors({field:'company'});
				case 'residence': 	return this.rvisitors({field:'residence'});
				case 'registration': return this.rvisitors({field:'registration'});
				
			// for dS_reservations
			case 'dateIn': 		return this.rdateIn();
			case 'dateOut': 	return this.rdateOut();
			case 'cueIn': 		return this.rcueIn();
			case 'cueOut': 		return this.rcueOut();
			case 'duration':    return this.rduration();
				
			case 'performances': return this.rperformances();
			
			case 'bCals': return this.rresources(agClass.bCal);
			case 'uCals': return this.rresources(agClass.uCal);
			case 'fCals': return this.rresources(agClass.fCal);
			case 'note':
				let div = '<div style="font-size:85%; text-align:left;">'+this.note+'</div>';
				return { c:1, t:'"', v:this.note, d:div };

			
			case 'ccss':
				let ccss = [];
					if(this.cssColor) ccss.push(C_dS_customCss.get(this.cssColor).name);
					if(this.cssPattern) ccss.push(C_dS_customCss.get(this.cssPattern).name);
				return { c:ccss.length, t:'"', v:ccss, d:this.bullet() }; // d is the html  display value
				
			case 'id': case 'groupId': case 'created': case 'changed': case 'deleted': case 'creator': case 'changer': case 'deletor': case 'deletorId':
				return this.tracking_ui_catalyst(member);
		}
	}
}


C_dS_reservation.catalyst = {  // for C_catalyst 
	
	genomec: C_dS_reservation, // genome class
	register: function() { return rmems['catalyst'].resas; }, // register where dataSets can be read from
	title: 'reservations', // title for modal C_iARRAY.fields
	xlprefix: 'resa-', // translation prefix
	foptions: { // like fieldName:translation
		  reservation: { cueIn:'cueIn', cueOut:'cueOut', dateIn:'dateIn', dateOut:'dateOut', duration:'duration', note:'note', performances:'performances', ccss:'ccss' }
		, visitor: { visitors:'visitors', email:'email', birthday:'birthday', mobile:'mobile', zipCode:'zipCode', company:'company', residence:'residence', registration:'registration' } // visitors means visitors names, should stay 'visitors' because many records are in table catalysts containing 'visitors'
		, audit: { id:'id', created:'created', creator:'creator', changed:'changed', changer:'changer', deletorId:'deletor', deleted:'deleted' }
	},
	defaults: { // defines a set of default displayed columns
		on: [  'ccss', 'dateIn', 'cueIn', 'duration', 'visitors', 'note', 'performances' ],  // like [ fieldName1, fieldName2, ... ] in the expected displayed order
		sorton: { key:'dateIn', order:1 }
	},
	finalize: function() { // adjust this object to the user context setup
		if(!mobminder.account.single) {
			let category = this.foptions['reservation'];
			category['bCals'] = '{att_bcal}';
			if(mobminder.account.has.uCal) category['uCals'] = '{att_ucal}';
			if(mobminder.account.has.fCal) category['fCals'] = '{att_fcal}';
		}
	}
};



////////////////   C O N T R A C T S 

function C_dS_prebooking(b,p) {
	C_dS_prebooking.defaults.mergeto(this,p);
	C_dS_prebooking.register[this.id] = this; 
};
C_dS_prebooking.defaults = new A_df({id:0, groupId:0,reservationId:0, delay:0 });
(C_dS_prebooking.reset = function() {
	C_dS_prebooking.register = new Array();
})();
C_dS_prebooking.prototype = { }

