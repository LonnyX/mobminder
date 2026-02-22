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


//////////////////////////////////////////////////////////////////////////////// 
//
//  H T M L   I N L I N E   S T R E A M I N G      R E A D E R
//

function C_inlineStreaming() {}
C_inlineStreaming.classes = function(classname) {
	let C_dS;
	switch(classname) { // this is the list all classes that are exchanged with the server
		
		// plitems
		case 'C_dS_note_detail'		: C_dS = C_dS_note_detail; break;
		case 'C_dS_note_addressee'	: C_dS = C_dS_note_addressee; break;
		case 'C_dS_note_visiref'	: C_dS = C_dS_note_visiref; break;
		case 'C_dS_task_description': C_dS = C_dS_task_description; break;
		case 'C_dS_task_assignee'	: C_dS = C_dS_task_assignee; break;
		case 'C_dS_task_visiref'	: C_dS = C_dS_task_visiref; break;
		case 'C_dS_attendee'		: C_dS = C_dS_attendee; break;
		case 'C_dS_att_visitor'		: C_dS = C_dS_att_visitor; break;
		case 'C_dS_resapart'		: C_dS = C_dS_resapart; break;
		case 'C_dS_resa_serie'		: C_dS = C_dS_resa_serie; break;
		case 'C_dS_performance'		: C_dS = C_dS_performance; break;
		case 'C_dS_good'			: C_dS = C_dS_good; break;
		case 'C_dS_payment'			: C_dS = C_dS_payment; break;
		case 'C_dS_prebooking'		: C_dS = C_dS_prebooking; break;
		case 'C_dS_reservation'		: C_dS = C_dS_reservation; break;
		
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
		case 'C_dS_catalyst'	: C_dS = C_dS_catalyst; break;
		
		// config
		case 'C_dS_contract'	: C_dS = C_dS_contract; break;
		case 'C_dS_customCss'	: C_dS = C_dS_customCss; break;
		
		case 'C_dS_workexpert'	: C_dS = C_dS_workexpert; break;
		case 'C_dS_worktboxing'	: C_dS = C_dS_worktboxing; break;
		case 'C_dS_workcode'	: C_dS = C_dS_workcode; break;
		
		case 'C_dS_productexpert'	: C_dS = C_dS_productexpert; break;
		case 'C_dS_product'			: C_dS = C_dS_product; break;
		case 'C_dS_stocktaking'		: C_dS = C_dS_stocktaking; break;
		
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
		case 'C_dS_resafile'			: C_dS = C_dS_resafile; break;
		case 'C_dS_logo'				: C_dS = C_dS_logo; break;
		
		// statistics
		case 'C_dS_xmon_action'			: C_dS = C_dS_xmon_action; break;
		case 'C_dS_xmon_actual'			: C_dS = C_dS_xmon_actual; break;
		case 'C_dS_xmon_account'		: C_dS = C_dS_xmon_account; break;
		case 'C_dS_xmon_sms'			: C_dS = C_dS_xmon_sms; break;
		case 'C_dS_xmon_ccss'			: C_dS = C_dS_xmon_ccss; break;
		case 'C_dS_xmon_perfs'			: C_dS = C_dS_xmon_perfs; break;
		case 'C_dS_smsCounters'			: C_dS = C_dS_smsCounters; break;
		
		// synchronization
		case 'C_dS_synchro_resource'	: C_dS = C_dS_synchro_resource; break;
		case 'C_dS_synchro_ccss'		: C_dS = C_dS_synchro_ccss; break;
		case 'C_dS_synchro_visitor'		: C_dS = C_dS_synchro_visitor; break;
		case 'C_dS_synchro_reservation'	: C_dS = C_dS_synchro_reservation; break;
	
		// miscellaneous & auto-completes
		case 'C_lastname'				: C_dS = C_lastname; break;
		case 'C_dS_stat_address'		: C_dS = C_dS_stat_address; break;
		case 'C_dS_stat_zip'			: C_dS = C_dS_stat_zip; break;
		
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
//    S T A T I S T I C S 
//


function C_dS_xmon_action(p) {
	C_dS_xmon_action.defaults.mergeto(this,p);
	// meta
	C_dS_xmon_action.registers.id.add(this.id, this);
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_action.registers.login.add(this.sunday, this.loginId, this);
		let login = C_dS_loggable.get(this.loginId); if(login) login.setXmonPoint(this);
	}
};
C_dS_xmon_action.defaults = new A_df( { id:-1, groupId:0, sunday:0, loginId:0
		, resaNew:0, 	resaEdit:0, 	resaDel:0
		, appNew:0, 	appEdit:0, 		appDel:0
		, noteNew:0, 	noteEdit:0, 	noteDel:0
		, taskNew:0, 	taskEdit:0, 	taskDel:0
		, taskAssigned:0, taskAchieved:0
		, visiNew:0, 	visiEdit:0, 	visiMerge:0 } );
C_dS_xmon_action.prototype = {
	add: function(xMon, xMax) {
		for(m in this) {
			if(m in C_dS_xmon_action.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,loginId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	},
	uivalue: function(member) {
		switch(member) {
			case 'id': let login = C_dS_loggable.get(-this.id); if(login) return login.name; return ''; 
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = { c:1, t:'', v:this.uivalue(m) } }; 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		// for(let i in which) if(which[i]=='id') types.push('A'); else types.push(0); 
		for(let i in which) { let m = which[i]; if(m=='id') types[m] = 'A'; else types[m] = 0; }
		return types;
	}
};
(C_dS_xmon_action.reset = function() {
	C_dS_xmon_action.registers = new C_regS('id','login');
})(); 
C_dS_xmon_action.get = function(id) {
	return C_dS_xmon_action.registers.id.get(id);
}
C_dS_xmon_action.catalyst = function(options) {  // for C_iARRAY
	
	options = options || {};
	this.xlprefix = 'actions-'; // translation prefix
	this.options = { id:'id'
		, resaNew:'resaNew', resaEdit:'resaEdit', resaDel:'resaDel', appNew:'appNew', appEdit:'appEdit', appDel:'appDel'
		, noteNew:'noteNew', noteEdit:'noteEdit', noteDel:'noteDel'
		, taskNew:'taskNew', taskEdit:'taskEdit', taskDel:'taskDel', taskAssigned:'taskAssigned', taskAchieved:'taskAchieved'
		, visiNew:'visiNew', visiEdit:'visiEdit', visiMerge:'visiMerge' };
	this.on = options.on ? options.on : [ 'id', 'resaNew', 'resaEdit', 'resaDel' ];
	this.sorton = { key:'id', order:1 };
	
	//
	this.ctlabels = function() { // returns translated labels
		let headers = new Array(); 
		for(let x in this.options) 
			headers[x] = C_XL.w(this.xlprefix+this.options[x]);
		return headers;
	},
	this.sort = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
			let key = this.sorton.key;
			let order = this.sorton.order;
			let values = new Array(); for(let x in set) { let id =  set[x]; values[id] = this.dS(id).uivalue(key); };
			
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
			
		return set.sort(sf);
	};
	this.keys = function() { return C_dS_xmon_action.registers.id.keys() };
	this.dS = function(id) { return C_dS_xmon_action.registers.id.get(id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.sum = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		let dSsum = new C_dS_xmon_action([0]);
		let dSmax = new C_dS_xmon_action([-1]);
		for(let x in set) { let id = set[x]; dSsum.add(this.dS(id),dSmax) };
		return { sum:dSsum.members(this.on), max:dSmax.members(this.on) };
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let dumb = new C_dS_xmon_action([0]);
		return dumb.types(this.on);
	}
}


function C_dS_xmon_actual(p) {
	C_dS_xmon_actual.defaults.mergeto(this,p);
	// meta
	C_dS_xmon_actual.registers.id.add(this.id, this);
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_actual.registers.resource.add(this.sunday, this.resourceId, this);
		let resc = C_dS_resource.get(this.resourceId); if(resc) resc.setXmonPoint(this);
	}
};
C_dS_xmon_actual.defaults = new A_df( { id:-1, groupId:0, sunday:0, resourceId:0, offdayCount:0, resaCount:0, appCount:0, offdayTime:0, resaTime:0, appTime:0 } );
C_dS_xmon_actual.prototype = {
	add: function(xMon, xMax) {
		for(let m in this) {
			if(m in C_dS_xmon_actual.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,resourceId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	},
	uivalue: function(member) {
		switch(member) {
			case 'resourceId': let resc = C_dS_resource.get(-this.id); if(resc) return resc.name; return ''; 
			case 'resaTime':  
			case 'appTime': return duration(60*this[member], {days:false, pad:' '}); // displays 25h 10m ( more than 24 hours! )
			case 'offdayTime': return duration(60*this[member], {days:true, pad:' '});  // displays 1d 1h 10m ( number of days displayed! )
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = { c:1, t:'', v:this.uivalue(m) } }; 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		// for(let i in which) if(which[i]=='resourceId') types.push('A'); else types.push(0); 
		for(let i in which) { let m = which[i]; if(m=='resourceId') types[m] = 'A'; else types[m] = 0; }
		return types;
	}
};
(C_dS_xmon_actual.reset = function() {
	C_dS_xmon_actual.registers = new C_regS('id','resource');
})(); 
C_dS_xmon_actual.catalyst = function(options) {  // for C_iARRAY
	
	options = options || {};
	this.xlprefix = 'actuals-'; // translation prefix
	this.options = { resourceId:'resourceId', offdayCount:'offdayCount', resaCount:'resaCount', appCount:'appCount', offdayTime:'offdayTime', resaTime:'resaTime', appTime:'appTime' };
	this.on = options.on ? options.on : [ 'resourceId', 'offdayCount', 'offdayTime', 'appCount', 'appTime', 'resaCount', 'resaTime' ];
	this.sorton = { key:'resourceId', order:1 };
	
	//
	this.ctlabels = function() { // returns translated labels
		let headers = new Array(); 
		for(let x in this.options) 
			headers[x] = C_XL.w(this.xlprefix+this.options[x]);
		return headers;
	},
	this.sort = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
			let key = this.sorton.key;
			let order = this.sorton.order;
			let values = new Array(); for(let x in set) { let id =  set[x]; values[id] = this.dS(id)[key]; };
			
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
			
		return set.sort(sf);
	};
	this.keys = function() { return C_dS_xmon_actual.registers.id.keys() };
	this.dS = function(id) { return C_dS_xmon_actual.registers.id.get(id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.sum = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		let dSsum = new C_dS_xmon_actual([0]);
		let dSmax = new C_dS_xmon_actual([-1]);
		for(let x in set) { let id =  set[x]; dSsum.add(this.dS(id),dSmax) };
		return { sum:dSsum.members(this.on), max:dSmax.members(this.on) };
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let dumb = new C_dS_xmon_actual([0]);
		return dumb.types(this.on);
	}
}

C_dS_xmon_account = function(p) {
	C_dS_xmon_account.defaults.mergeto(this,p);
	// meta
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_account.registers.id.add(this.id, this);
		C_dS_xmon_account.registers.sunday.add(this.sunday, this);
	}
};
C_dS_xmon_account.defaults = new A_df( { id:-1, groupId:0, sunday:0, rescCount:0, visiCount:0, visiMobile:0, visiMales:0, visiFemales:0, loginsCount:0 } );
(C_dS_xmon_account.reset = function() {
	C_dS_xmon_account.registers = new C_regS('id','sunday');
})(); 


function C_dS_xmon_sms(p) {
	C_dS_xmon_sms.defaults.mergeto(this,p);
	
	// meta
	C_dS_xmon_sms.registers.id.add(this.id, this);
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_sms.registers.template.add(this.sunday, this.templateId, this);
		let templ = C_dS_smsTemplate.get(this.templateId); if(templ) templ.setXmonPoint(this);
	}
};
C_dS_xmon_sms.defaults = new A_df( { id:-1, groupId:0, sunday:0, templateId:0
		, r1handled:0, r1delivered:0, r1pending:0, r1error:0, r1nofeedback:0 
		, r2handled:0, r2delivered:0, r2pending:0, r2error:0, r2nofeedback:0 } );
C_dS_xmon_sms.prototype = {
	add: function(xMon, xMax) {
		for(m in this) {
			if(m in C_dS_xmon_sms.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,templateId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	},
	uivalue: function(member) {
		switch(member) {
			case 'templateId': let template = C_dS_smsTemplate.get(-this.id); if(template) return template.name; return ''; 
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = { c:1, t:'', v:this.uivalue(m) } }; 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		// for(let i in which) if(which[i]=='templateId') types.push('A'); else types.push(0);
		for(let i in which) { let m = which[i]; if(m=='templateId') types[m] = 'A'; else types[m] = 0; }
		return types;
	}
};
(C_dS_xmon_sms.reset = function() {
	C_dS_xmon_sms.registers = new C_regS('id','template');
})(); 
C_dS_xmon_sms.catalyst = function(options) {  // for C_iARRAY

	options = options || {};
	this.xlprefix = 'sms-'; // translation prefix
	this.options = { templateId:'templateId'
		, r1handled:'r1handled', r1delivered:'r1delivered', r1pending:'r1pending', r1error:'r1error', r1nofeedback:'r1nofeedback'
		, r2handled:'r2handled', r2delivered:'r2delivered', r2pending:'r2pending', r2error:'r2error', r2nofeedback:'r2nofeedback'
		};
	this.on = options.on ? options.on : ['templateId', 'r1handled', 'r2handled', 'r1delivered', 'r2delivered', 'r1pending', 'r2pending', 'r1error', 'r2error'];
	this.sorton = { key:'templateId', order:1 };
	
	//
	this.ctlabels = function() { // returns translated labels
		let headers = new Array(); 
		for(let x in this.options) 
			headers[x] = C_XL.w(this.xlprefix+this.options[x]);
		return headers;
	},
	this.sort = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
			let key = this.sorton.key;
			let order = this.sorton.order;
			let values = new Array(); for(let x in set) { let id =  set[x]; values[id] = this.dS(id).uivalue(key); };
			
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
			
		return set.sort(sf);
	};
	this.keys = function() { return C_dS_xmon_sms.registers.id.keys() };
	this.dS = function(id) { return C_dS_xmon_sms.registers.id.get(id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.sum = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		let dSsum = new C_dS_xmon_sms([0]);
		let dSmax = new C_dS_xmon_sms([-1]);
		for(let x in set) { let id =  set[x]; dSsum.add(this.dS(id),dSmax) };
		return { sum:dSsum.members(this.on), max:dSmax.members(this.on) };
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let dumb = new C_dS_xmon_sms([0]);
		return dumb.types(this.on);
	}
}

function C_dS_xmon_ccss(p) {
	C_dS_xmon_ccss.defaults.mergeto(this,p);
	// meta
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_ccss.registers.id.add(this.id, this);
		C_dS_xmon_ccss.registers.ccss.add(this.sunday, this.ccssId, this);
		let ccss = C_dS_customCss.get(this.ccssId); if(ccss) ccss.setXmonPoint(this);
	}
};
C_dS_xmon_ccss.defaults = new A_df( { id:-1, groupId:0, sunday:0, ccssId:0, actual:0, action:0 } );
C_dS_xmon_ccss.prototype = {
	add: function(xMon, xMax) {
		for(m in this) {
			if(m in C_dS_xmon_ccss.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,ccssId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	},
	uivalue: function(member) {
		switch(member) {
			case 'id': let login = C_dS_loggable.get(-this.id); if(login) return login.name; return ''; 
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = this.uivalue(m); }; 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		for(let i in which) if(which[i]=='id') types.push('A'); else types.push(0); 
		return types;
	}
};
(C_dS_xmon_ccss.reset = function() {
	C_dS_xmon_ccss.registers = new C_regS('id','ccss');
})(); 


function C_dS_xmon_perfs(p) {
	C_dS_xmon_perfs.defaults.mergeto(this,p);
	// meta
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_xmon_perfs.registers.id.add(this.id, this);
		C_dS_xmon_perfs.registers.workcode.add(this.sunday, this.workCodeId, this);
		let wkcd = C_dS_workcode.get(this.workCodeId); if(wkcd) wkcd.setXmonPoint(this);
	}
};
C_dS_xmon_perfs.defaults = new A_df( { id:-1, groupId:0, sunday:0, workCodeId:0, actual:0, action:0 } );
C_dS_xmon_perfs.prototype = {
	add: function(xMon, xMax) {
		for(m in this) {
			if(m in C_dS_xmon_perfs.prototype) continue;
			if(m in {id:0,groupId:0,sunday:0,workCodeId:0}) continue;
			this[m] += xMon[m];
			if(xMax) if(xMax[m]<xMon[m]) xMax[m] = xMon[m];
		}
	}
};
(C_dS_xmon_perfs.reset = function() {
	C_dS_xmon_perfs.registers = new C_regS('id','workcode');
})(); 


function C_dS_smsCounters(p) { // grouped by templateId
	C_dS_smsCounters.defaults.mergeto(this,p);
	this.msgs = this.handled+this.error+this.pending+this.delivered+this.discarded;
	
	// meta
	if(this.id!=0) { // item with id 0 is created here (*c01*)
		C_dS_smsCounters.registers.id.add(this.id, this);
		C_dS_smsCounters.registers.template.add(this.templateId, this.id, this);
	}
};
C_dS_smsCounters.defaults = new A_df( { id:-1, groupId:0, templateId:0, date:'', msgs:0, pages:0, handled:0, error:0, pending:0, delivered:0, discarded:0 } );
C_dS_smsCounters.prototype = {
	add: function(xMon) {
		for(m in this) {
			if(m in C_dS_smsCounters.prototype) continue;
			if(m in {id:0,groupId:0,templateId:0,date:0}) continue; // for those fields, there is no header summing
			this[m] += xMon[m];
		}
	},
	uivalue: function(member) {
		switch(member) {
			case 'templateId': let resc = C_dS_smsTemplate.get(this.templateId); if(resc) return resc.name; else if(resc===false) return 'deleted?'; return '';
			default: return this[member]; // in all other cases, display the genuine value
		}		
	},
	members: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) { let m = which[i]; items[m] = { c:1, t:'', v:this.uivalue(m) } }; 
		return items;
	},
	types: function(which) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let types = new Array();
		for(let i in which) { let m = which[i]; if(m=='templateId') types[m] = 'A'; else types[m] = 0; }
		return types;
	}
};
(C_dS_smsCounters.reset = function() {
	C_dS_smsCounters.registers = new C_regS('id','template');
})(); 
C_dS_smsCounters.catalyst = function(options) {  // for C_iARRAY, options mandatory: { templateId: }
	
	this.templateId = options.templateId;
	this.xlprefix = 'sms-'; // translation prefix
	this.options = { date:'date', msgs:'msgs', pages:'pages', handled:'handled', error:'error', pending:'pending', delivered:'delivered', discarded:'discarded' };
	this.on = options.on ? options.on : [ 'date', 'msgs', 'pages', 'handled', 'error', 'pending', 'delivered', 'discarded' ];
	this.sorton = { key:'date', order:1 };
	
	//
	this.ctlabels = function() { // returns translated labels
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
			
			let sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  1; else if(av < bv) return -1; return 0; };
			if(order==-1) sf = function(a,b) { let av = values[a], bv = values[b]; if(bv < av) return  -1; else if(av < bv) return 1; return 0; };
			
		return set.sort(sf);
	};
	this.keys = function() { return C_dS_smsCounters.registers.template.keys(this.templateId) };
	this.dS = function(id) { return C_dS_smsCounters.registers.id.get(id) };
	this.dSui = function(id) {
		let dS = this.dS(id);
		if(!dS) { return false; }
		return dS.members(this.on);
	},
	this.sum = function(set) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
		let dSsum = new C_dS_smsCounters([0]);
		// let dSmax = new C_dS_smsCounters([-1]);
		for(let x in set) { let id =  set[x]; dSsum.add(this.dS(id)) };
		return { sum:dSsum.members(this.on), max:-1 };
	},
	this.types = function() { // returns an array like [ 0:'A', 1:0, 2:0, ... ] 'A' means text, 0 when figures
		let dumb = new C_dS_smsCounters([0]); // (*c01*)
		return dumb.types(this.on);
	}
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
			case 'id': return { c:1, t:'', v:{0:this[member]} };
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

	// Timestamp versions (obsolete, should be replaced by UTC wherever can and whenever can)

function C_dS_trackingCC(id,groupId,created,creator,creatorId,changed,changer,changerId) {
		this.tmc = 8; // tracking members count (is a count of id,groupId,created,creator,creatorId,changed,changer,changerId which is 8 fields here)
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
		
		this.tmc = 10; // tracking members count (is a count of id,groupId,created,creator,creatorId,changed,changer,changerId,deleted,deletorId which is 10 fields here)
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCCD.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCCD','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		
		this.tracking = C_dS_ID.prototype.display;
		this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingCCD.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0, deleted:'', deletorId:0 } );
C_dS_trackingCCD.tnew = function(id, groupId) { // returns an array like [id, groupId, created, creator, creatorId, changed, changer, changerId, deleted, deletorId]
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


	// UTC versions: Faster DB treatments

function C_dS_trackingCD_utc(id,groupId,created,creator,creatorId,deleted,deletor,deletorId) {
		
		this.tmc = 8; // tracking members count (is a count of id,groupId,created,creator,creatorId,deleted,deletor,deletorId which is 8 fields here)
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCD_utc.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCD_utc','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		
		this.tracking = C_dS_ID.prototype.display;
		this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingCD_utc.defaults = new A_df( { created:0, creator:'', creatorId:0, deleted:0, deletor:'', deletorId:0 } ); // UTC !!
C_dS_trackingCD_utc.tnew = function(id, groupId) { // returns an array like [id, groupId, created, creator, creatorId, changed, changer, changerId, deleted, deletorId]
	let now = Date.now(); // UTC in mSecs
	let nowUnix = (now/1000)|0; // UTC in Unix EPOCH seconds
	let surfer = mobminder.context.surfer.name;
	let sId = mobminder.context.surfer.id;
	let never = 0; // UTC version
	let t = new C_dS_trackingCD_utc(id, groupId, nowUnix, surfer, sId, never, '', 0);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.deleted, t.deletor, t.deletorId];
};




//////////////////////////////////////////////////////////////////////////////// 
//

function C_dS_context(p) {
	C_dS_context.defaults.mergeto(this,p);
	// meta data
	mobminder.context = this; // check (*ck*)
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
	
	this.defCcss[ccsstype.color][ccssclasses.product] 		= this.CssProductColor;
	this.defCcss[ccsstype.pattern][ccssclasses.product] 	= this.CssProductPattern;
	this.defCcss[ccsstype.tag][ccssclasses.product] 		= this.CssProductTag;

	C_dS_group.registers.id.add(this.id, this);
	if(this.usechat) C_dS_group.anychat++; // sums up all C_dS_groups from all logins (i.e. all accounts from all logged wallets)
	
	this.is = {};
}
C_dS_group.defaults = new A_df({cfgversion:0,package:16, profsector:0, GMT:0, name:'new account', headline:'', color:0, pattern:0, tag:0, note:''
	,weburl:'',ccphone:'',email:'',language:0,visitorAlias:200,smsSenderId:'',timeSlice:4
	,durationShortest:1,durationSteps:1,durationLongest:8, notbefore:8424222, upperLeftDate:'0'
	,rangeIn:28800,rangeOut:72000,history:0,vipToggle:0,cssSuite:0
	
	, ePayActive:0, ePayBenefName:'', ePayBenefIBAN:'', ePayBenefBIC:''
	, ePayconiqKey:'', ePayMarketKey:''
	, ePayHardPayClientId:'', 	ePayHardPayClientSecret:'', ePayHardPayToken:''
	, ePaySoftPayClientId:'', 	ePaySoftPayClientSecret:'', ePaySoftPayAppId:'', ePaySoftPayToken:''
	, ePayComputopId:'', 		ePayComputopFish:'', 		ePayComputopHmac:''
	, ePayWebActive:0
	
	,suspended:0,stiFontSize:2,mailToUsers:0,sendSMSs:0,phoneRegion:32,phoneSlicing:3
	,defaultGender:0,bCalsName:20,uCalsName:70,fCalsName:110
	
	,CssAppColor:0,CssAppPattern:0,CssAppTag:''
	,CssEventColor:0,CssEventPattern:0,CssEventTag:''
	,CssFcalColor:0,CssFcalPattern:0,CssFcalTag:''
	,CssVisitorColor:0,CssVisitorPattern:0,CssVisitorTag:'' // apply to C_dS_visitor at creation
	
	,maxVisitors:0, cssLogging:0, usestandbylist:0, overdays:0, usetasks:1, usenotes:1, usechat:0, usefiles:0, useappaddress:0
	
	,CssNoteColor:0,CssNotePattern:0,CssNoteTag:''
	,CssTaskColor:0,CssTaskPattern:0,CssTaskTag:''
	,CssChatColor:0,CssChatPattern:0,CssChatTag:''
	,CssFileColor:0,CssFilePattern:0,CssFileTag:''
	,CssProductColor:0,CssProductPattern:0,CssProductTag:''
	
	,dailySMScredit:200,todaySMSremains:200
	,dailyEMLcredit:200,todayEMLremains:200 });
	
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
		
		let wphas = {workcodes:C_dS_workcode.has({eresa:false}), eworkcodes:C_dS_workcode.has({eresa:true})
					, products:C_dS_product.has({eresa:false}), eproducts:C_dS_product.has({eresa:true}) };
		
		this.is = {
			range024:(this.rangeIn==0 && this.rangeOut==86400)
		};
		this.has = { // mobminder.account.has = 
			bCal:C_dS_resource.has(class_bCal), uCal:C_dS_resource.has(class_uCal), fCal:C_dS_resource.has(class_fCal)
			, workcodes:wphas.workcodes, eworkcodes:wphas.eworkcodes
			, products:wphas.products, eproducts:wphas.eproducts
			, excpshadows:C_dS_shadow.has.exceptional, timeboxing:C_dS_timeboxing.has()
			, resa: {   color: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.color)
					, pattern: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.pattern)
					,     tag: C_dS_customCss.countByType(ccssclasses.appointment,ccsstype.tag)+C_dS_customCss.countByType(ccssclasses.event,ccsstype.tag)
					, workcode: wphas.workcodes&&wphas.eworkcodes
					, product: wphas.products&&wphas.eproducts
					}
			, visi: { 	color: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.color)
					, pattern: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.pattern)
					,     tag: C_dS_customCss.countByType(ccssclasses.visitor,ccsstype.tag)
					}
			, epay: { active: !!this.ePayActive // see (*ep20*)
					, epmobsepa: !!this.ePayBenefName&&!!this.ePayBenefIBAN // true if all 2 out of 3 fields are filled (BIC is not mandatory)
					, epayconiq: !!this.ePayconiqKey
					, epaysoft: (!!this.ePaySoftPayClientId&&!!this.ePaySoftPayClientSecret&&!!this.ePaySoftPayAppId)
					, epayhard: (!!this.ePayHardPayClientId&&!!this.ePayHardPayClientSecret) // &&!!this.ePayHardPayToken (if you keep this one, then a payment must have been realized before you can unpair.)
					, epayonline: (!!this.ePayComputopId&&!!this.ePayComputopFish&&!!this.ePayComputopHmac)
			}
		};
		
		this.nameof = { bCal:C_XL.w(class_bCal), uCal:C_XL.w(class_uCal), fCal:C_XL.w(class_fCal) };
		
		// preset default values
		C_dS_visitor.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.visitor];
		C_dS_visitor.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.visitor];
		C_dS_visitor.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.visitor];
		
		C_dS_visitor.defaults.gender = this.defaultGender;
			C_dS_visitor.defaults.language = mobminder.context.surfer.language;
			C_dS_login.defaults.language = mobminder.context.surfer.language;
			C_dS_contract.defaults.language = mobminder.context.surfer.language;
			C_dS_guidelines.defaults.language = mobminder.context.surfer.language;
		C_dS_group.defaults.language = mobminder.context.surfer.language;
		
		C_dS_note_detail.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.note];
		C_dS_note_detail.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.note];
		C_dS_note_detail.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.note];
		
		C_dS_task_description.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.task];
		C_dS_task_assignee.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.task];
		C_dS_task_assignee.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.task];
		
		C_dS_chat_thread.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.chat];
		C_dS_chat_thread.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.chat];
		C_dS_chat_thread.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.chat];
		
		C_dS_file.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.file];
		C_dS_file.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.file];
		C_dS_file.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.file];
		
		C_dS_product.defaults.cssColor = this.defCcss[ccsstype.color][ccssclasses.product];
		C_dS_product.defaults.cssPattern = this.defCcss[ccsstype.pattern][ccssclasses.product];
		C_dS_product.defaults.cssTags = this.defCcss[ccsstype.tag][ccssclasses.product];
		
		C_dS_workcode.defaults.duration = this.durationShortest;
		
		C_dS_customCss.setdefaults();
		C_dS_sms.status.stringSet();
		C_dS_email.status.stringSet();
	},
	macroflush: function() { // called before any new config is loaded
		mobminder.account = false; // global var
		C_dS_logo.reset();
		C_dS_workcode.reset();
		C_dS_product.reset();
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
	},
	abullet: function(options) { // this one is intended to the wallet accounts list and is displayed by T_logged
		options = options||{};
		let applet = ''; // sets bullet height to 100% of td height
			if(this.tag) applet = ''; // then the div content will be the tag 
		// let applet = '0';
		if(options.warning) { // red indicator at right bottom of bullet (for chats)
			applet = '<div class="chats-blink-color" style="position:absolute; bottom:-.9em; left:-.5em; font-size:80%;">'+options.warning+'</div>';
		}
			let fit = ''; if(options.fit) fit = options.fit; //which is more css, like fit:'fit';
			let color = ' c'+this.color; // grayed when no color is chosen
			let pattern = this.pattern ? ' p'+this.pattern : '';
			let tag = this.tag ? ' tagged '+C_iSKIN.tagcss(this.tag) : '';
			
		let bullet = '<div style="" class="bullet account '+fit+color+pattern+tag+'">'+(options.fit?'':'&nbsp;')+'</div>';
		let counter = '<div style="display:inline-block; position:relative;">'+applet+'</div>'; // border:1px solid red;
		
		return bullet+counter;
	},
	acctag: function(tagcode = 0, o = {css:''}) {
		
			let ccss = 'fa-17x';
			if(o.css) ccss = o.css;
			
			let tag = '';
			if(tagcode) tag = ccss+' '+C_iSKIN.tagcss(tagcode);
			else if(this.tag) tag = ccss+' '+C_iSKIN.tagcss(this.tag);
			
		let divtag = '<div style="padding:0 1em; position:relative; top:.1em;" class="'+tag+'">'+'</div>';
		return divtag;
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






//////////////////////////////////////////////////////////////////////////////// 
//
////////////////  P R O D U C T S 

function C_dS_product(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_product.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_product.registers.eresa.add(this.ereservable, this.id, this); // ereservable is [0 or 1]
		C_dS_product.registers.id.add(this.id, this);
		C_dS_product.count++; // is a static member, see C_dS_product.reset()
	} else {
		C_dS_product.defaults.apply(this); // new object
	}
	
	// meta
	this.has = { ccss:!!(this.cssColor||this.cssPattern), tags:!!this.tags };
		let color = this.cssColor?C_dS_customCss.get(this.cssColor).css:'';
		let pattern = this.cssPattern?C_dS_customCss.get(this.cssPattern).css:'';
	this.ccss = { color:color, pattern:pattern };
	this.xmon = new Array();
};
C_dS_product.defaults = new A_df( { name:'', code:'', price:0, deposit:0
		, note:'', secretarynote:'', webpagenote:'', communicnote:'' 
		, altLanguage1:255, altName1:'', altwebpagenote1:'', altcommunicnote1:'', altLanguage2:255, altName2:'', altwebpagenote2:'', altcommunicnote2:''			
		, stockremain:0, cssColor:0, cssPattern:0, tag:0, tags:'' 
		, ereservable:0, checklistid:0 } );
(C_dS_product.reset = function() {
	C_dS_product.registers = new C_regS('id','eresa');
	C_dS_product.count = 0; 
})();
C_dS_product.prototype = {
	resources: function() { return C_dS_productexpert.registers.bytype.get(this.id) }, // results like [rscType][rscId] = o_dS_resource;
	expertsIds: function() { return C_dS_productexpert.registers.rescids.get(this.id) }, // results like [rscId] = rscId;
	scretarymsg: function() {
		if(this.secretarynote) { // pop up the product note // see also (*pu10*)
			setTimeout( function(that) {
				new C_iMSG(that.secretarynote.htmlize(), { onChoice:false }, { css:{image:'comment-alt-exclamation', duotone:'red', body:'', borders:'mmborder-blue'}, interactivity:'ok', title:that.name, subtitle:C_XL.w('product pop-up title'), size:{x:600,y:''}, sound:'droplet' } );
			} 
			, 2*C_iMODAL.animationdelay, this ); // here we double the animation delay because when coming from the visitor creation modal, you end up here (*md19*)
		}
	},

	wbullet: function(options) {	
		options = options || { }; 
			let tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			let inner = this.tag?'':'&nbsp;';
			let cssclass = 'bullet product '+tag+this.wcss();
		let bullet = '<div style="display:inline-block;" class="'+cssclass+'">'+inner+'</div>';
		return bullet;
	},
	wcss: function() {
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		return color+pattern;
	},
	wtip: function() {
			let separator = '<hr/>';
		let bullet = this.hasCcss() ? this.wbullet() : '';
			
			let codeprice = new Array(); 
		if(this.code) codeprice.push(this.code);
		if(this.price) codeprice.push(C_iEDIT.ergoprice(this.price)+C_XL.w('euros'));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
			
		// let name = this.name+' ('+this.amount()+')';
		let name = this.name;
		let note = this.note ? separator + this.note : '';
		let tags = this.wtags({verbose:true}); if(tags) tags = separator+tags; 
			
		let tip = bullet + name + codeprice + note + tags;
		return tip;
	},
	wtags: function(options) {
		let tags = '';
		
		options = options || {}; // like  { marginleft:'0.5em', marginbetween:'0.2em', size:'100%' }
		if(this.has.tags) {
				let size = ''; if(options.size) size=' font-size:'+options.size+';';
				let tagsids = this.tags.split('!');
				
			if(options.verbose) { // display as a list of item with each their name (used for tooltip where the tags signification are also displayed)
					let br = '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
					if(tagid==='') continue; // which is the tags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						let dS_tag = C_dS_customCss.get(tagid);
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+size+'"';
					tags = tags+br+'<div '+style+' class="tag '+dS_tag.cssName+'"></div>&nbsp;'+dS_tag.name;
					br = '<br/>';
				}
				
			} else { // display inline (good for autocomplete list)
				let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
					if(tagid==='') continue; // which is the tags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						let tagcss = C_dS_customCss.get(tagid).cssName;
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
					tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
					margin = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : ''; // reduce the margin between tags, only the first one is longer
				}
			}
		}
		return tags;
	},
	hasCcss: function() { return !!(this.cssColor+this.cssPattern); },
	amount: function() { 
		return '1x';
	},
	wclone: function() {
		let son = new C_dS_product();
		son.id = 0; son.groupId = this.groupId;
		for(let field in C_dS_product.defaults) son[field] = this[field];
		
		C_dS_productexpert.clonefrom(this.id);
		
		return son;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};

////////////////

C_dS_product.ACoptions = function(preset) { // for C_iACPICK, see (*aco01*), used by M_RESA
		preset = preset||{ /* eproducts:false, tip:false, leadclass:{resources:this.dS.resources} */}; 
	
	let wkall = false;
	let ewkonly = false;
	let intonly = false;
	if('eproducts' in preset) { // preset.eproducts undefined => return all products
		if(preset.eproducts===true) { this.sum = C_dS_product.registers.eresa.ends(1) || 0; ewkonly = true; }
		else if(preset.eproducts===false) { this.sum = C_dS_product.registers.eresa.ends(0) || 0; intonly = true; }
	}
	else {
		wkall = true;
		this.sum = C_dS_product.registers.id.ends() || 0; // returns both internal and e-reservable products
	}
		

	this.trigger = 0; // calls this.fetch() when focused, if 0 (zero), the C_iAC will auto set the trigger value based on this.count()
	this.css = 'alpha14';
	
		// let options = {}; for(let id in this.register) options[id] = this.label(id);
		// if(esection) options[0] = esection; // labels are not sorted by id, but by label alphabetic

		let ints_r = C_dS_product.registers.eresa.get(0) || []; // returns only NON ePerformances
		let webs_r = C_dS_product.registers.eresa.get(1) || []; // returns only ePerformances

		let registers = [];

		let bcal = { id:0 }; // this product display is not dedicated to a given bcal resource
			if('leadclass' in preset) {
				let rscs = preset.leadclass.resources; // like { 1:class_uCal ids [], 2:class_bCal ids [], 4:class_fCal ids []  }
				let bcals = rscs[agClass.bCal]; // always at least one
				for(id in bcals) { bcal = bcals[id]; break; } // pick the first one (most of time there is only one), multi accounts with staffing may differ
			}
			
			let labels 	= { 0: [], 1: [], 2: [], 3: [] };
			let presets = { 0: {}, 1: {}, 2: {}, 3: {} };
			let order 	= { 0:new Array(), 1:new Array(), 2:new Array(), 3:new Array() }; 	
		
		
		if(mobminder.account.single) { // they arrive well sorted, we use registers 2 and 3 for single accounts
		
			if(this.sum) {
				if(!ewkonly) registers[2] = ints_r; // internal products
				if(mobminder.account.has.eproducts)
					if(wkall||ewkonly) registers[3] = webs_r; // odd indexes are for e-reservables
			}
			
		} else { // multi accounts
		
			// registers 0 and 1 show only products for which bcal is expert
			// registers 2 and 3 show other remaining products
			
			let f = function(rray, title) { // this is for dev purpose
				console.log(' ');
				console.log(title);
				for(let i in rray) console.log(i, rray[i]);
			}
				
			// registers 0 and 2 are used for internal products
			if(ewkonly) {
				registers[2] = Array(); // internals for which bcal is not expert
			}
			else {
				if(bcal.id) registers[0] = Array(); // internals for which bcal is expert, when bcal is undefined this register is empty
				registers[2] = Array(); // internals for which bcal is not expert
						
				for(let wkid in ints_r) { // sort out internal products
					let xperts = C_dS_productexpert.registers.rescids.get(wkid); // the concerned bcal is expert for this product according to account setup
					// f(xperts,'internal products');
					if(bcal.id in xperts) // bcal is expert for this wkid
							registers[0][wkid] = ints_r[wkid];
					else 	registers[2][wkid] = ints_r[wkid];
				}
			}
			
			if(mobminder.account.has.eproducts) if(!intonly) {
				
				// registers 1 and 3 are used for web products
				registers[1] = Array();
				registers[3] = Array();
				for(let wkid in webs_r)  // sort out web products
					if(bcal.id in C_dS_productexpert.registers.rescids.get(wkid)) // the concerned bcal is expert for this product according to account setup
							registers[1][wkid] = webs_r[wkid];
					else 	registers[3][wkid] = webs_r[wkid];
			}
			
		}
		
		// common to all sections
		//
		// When testing this code, please plan the following scenarios
		// o single account with no e-reservable product
		// o single account with e-reservables
		// o multi account with no e-reservable product
		// o multi account with e-reservables
		// o log in as a single user from a multi account (that user displays in single mode and sees only products for which he is expert)
		
		// for(let s in registers) {
			// let c = 0; for(id in registers[s]) c++;
			// console.log('Reg '+s+' : '+c+' items');
		// }
		
		
		for(let s in registers) { // s is the section id
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
			for(let id in registers[s]) {
				order[s].push(id);
				let dS = registers[s][id];
				labels[s][id] = this.label(id);
				presets[s][id] = { tip:false };
				if(preset.tip) presets[s][id].tip = dS.wtip();
			}
			order[s].sort(sortrule); // we sort each section independatly on label's alphanumeric
		}
		
		
		// prepare this.options like { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count }
		let ordermerge = new Array();
		let labelsmerge = { };
		let presetmerge = { };
		
		
		// let's fix the sections titles and presets
		
					let globy = '<div style="margin-left:.6em;" class="fa fa-globe fa-15x"></div>';
				let multi_ints = ''; if(bcal.id) multi_ints = C_XL.w('performances',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name; // like 'performances for Dr Jekill's'
				let multi_webs = ''; if(bcal.id) multi_webs = C_XL.w('e-reservables',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name+globy; // like 'e-reservables for Dr Jekill's'
					
					let others = false; if(!!registers[0]) others = true; // if bcal specifics exist, then other products should be called 'other products'
				let ints = others ? C_XL.w('other performances',{cap:0}) : C_XL.w('performances',{cap:0});
				let webs = C_XL.w('e-reservables',{cap:0})+globy;
			let sections = { 0:multi_ints, 1:multi_webs, 2:ints, 3:webs }; // see (*ac03*)
			let bullet = C_XL.w('bullet down')+'&nbsp;';
		
		for(let s in registers) {
			if(mobminder.account.single && s==2) continue; // we do not display the internal section title when on single accounts
			if(intonly) continue; // we do not display the internal section title when on single accounts
			labelsmerge[s] = sections[s];
			presetmerge[s] = {section:bullet};
		}
		
		// let's fill now with products labels
		
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) labelsmerge[id] = labels[s][id];
		}
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			ordermerge.push(s); // set the place for the section (i.e 0, 1, 2 or 3)
			for(let i in order[s]) ordermerge.push(order[s][i]);
			
		}
			// let sectionbullet = {section:bullet};
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) { presetmerge[id] = presets[s][id]; }
		}
		
		
		
		let count = ordermerge.length;
		
	this.options = { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count };	 // the upper level is not prepared to receive options with specification of order

}
C_dS_product.ACoptions.prototype = {
	
	fetch: function(digits, callback) { 
	
		let options = this.options;
		setTimeout(function(o){return callback.cb(digits, o)},4,options); // see (*ac04*)
		return;
	},
	label: function(id) { // this is called to display the product lablel under the AC control, in the C_iCRESTA scope
		
		let dS = C_dS_product.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		
				let price = ''; if(dS.price) price = C_iEDIT.ergoprice(dS.price)+C_XL.w('euros');
			let parentheses = ''; parentheses = ' <span style="font-size:smaller; font-weight:normal; opacity:.6">('+price+')</span>';
			let tags = dS.wtags({marginleft:'0.5em',marginbetween:'0.2em'});
			// let label = dS.wbullet()+dS.name+parentheses+tags;
			let label = '&nbsp;'+dS.wbullet()+dS.name+parentheses+tags;
		return label;
	},
	quantity: function(resaid, prdctid) {
		return C_dS_good.quantity(resaid, prdctid) ;
	},
	tip: function(id) { 
		let dS_prd = C_dS_product.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
		return dS_prd.wtip();
	},
	count: function() { return this.sum; } // used by C_iAC to set the fetch trigger, see (*ac10*)
}
C_dS_product.get = function(id) { return C_dS_product.registers.id.get(id); }
C_dS_product.has = function(options) { // options like { eresa:[true, false, undef] }
	options = options||{};
	if(options.eresa==undefined) return C_dS_product.registers.id.ends();
	else return C_dS_product.registers.eresa.ends(options.eresa?1:0);
	return !!C_dS_product.count;
}
C_dS_product.del = function(id) {
	C_dS_productexpert.deleteOnproduct(id);
		let item = C_dS_product.registers.id.get(id);
	C_dS_product.registers.del(item);
}
C_dS_product.plus = function(genome) { // genome like eresa:[true, false, or undefined]
	this.genome = genome||{};
		
	// generic interface to C_iPLUS, used for products in the webapp setup on performances tab
	this.plusmay = permissions.may(pc.cr_wrkc);
	this.eid = '_prd';
	this.list = function() {
		let labels = [], order = [];
		let register = (this.genome.eresa===undefined)?C_dS_product.registers.id.get():C_dS_product.registers.eresa.get(this.genome.eresa?1:0);
		for(let id in register) {
				let dataset = register[id];
					let price = ''; if(dataset.price) price = C_iEDIT.ergoprice(dataset.price)+C_XL.w('euros');
					let deposit = ''; if(dataset.deposit) deposit = ' / '+C_iEDIT.ergoprice(dataset.deposit)+C_XL.w('euros');
				let pricetag = ''; if(dataset.price||dataset.deposit) pricetag = ' <span style="font-size:smaller; opacity:.7">('+price+deposit+')</span>';
				let tags = dataset.wtags({marginleft:'0.5em',marginbetween:'0.2em'});
			labels[id] = dataset.wbullet()+dataset.name+pricetag+tags;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		let dS = new C_dS_product();
		dS.ereservable = (this.genome.eresa===true)?1:0;
		return dS;
	};
	this.get = function(id) {
		return C_dS_product.registers.id.get(id);
	}
}


////////////////  P R O D U C T     E X P E R T S,   they identify the resources that are defined as experts for a given C_dS_product

function C_dS_productexpert(p) {
	C_dS_productexpert.defaults.mergeto(this,p);
	let resource = C_dS_resource.get(this.resourceId);
	C_dS_productexpert.registers.bytype.add(this.groupId, resource.resourceType, resource.id, this); // definition of bytype, rescids and id, see (*we01*)
	C_dS_productexpert.registers.rescids.add(this.groupId, resource.id, resource.id); // used of R_search
	C_dS_productexpert.registers.id.add(this.groupId, this.id, this);
};
C_dS_productexpert.defaults = new A_df( { id:0, groupId:0, resourceId:0 } ); // they group to a C_dS_product
C_dS_productexpert.deleteOnproduct = function(productid) {
	let items = C_dS_productexpert.registers.id.get(productid);
	for(let id in items) C_dS_productexpert.registers.del(items[id]);
};
C_dS_productexpert.clonefrom = function(productid) { // clone experts from a productid into a new set having groupId = 0 and negative id's for the related C_dS_productexpert's
	
	let items = C_dS_productexpert.registers.id.get(productid);
	for(let id in items) {
			let dS_workexpert = items[id];
		let son = new C_dS_productexpert( [-dS_workexpert.id, 0, dS_workexpert.resourceId] );		
	}
};
(C_dS_productexpert.reset = function(){
	C_dS_productexpert.registers = new C_regS('id', 'bytype', 'rescids'); // see (*we01*)
})();


////////////////  G O O D S, they are usage of C_dS_product on C_dS_reservation

function C_dS_good(b, p) { // groups to a reservation. Tells which of products are performed during exercising this reservation.
	C_dS_good.defaults.mergeto(this,p);
	rmems[b].goods.add(this.resaId, this.productId, this);
	if(vbs) vlog('datasets.js','C_dS_good','new','id:'+this.id+', grpId:'+this.resaId+', productId:'+this.productId); 
}
C_dS_good.defaults = new A_df({id:0, resaId:0, productId:0, numberof:0, visitorId:0, checklist:''});

C_dS_good.quantity = function(resaid, prdctid) {
	const q = rmems['plitems'].goods.get(resaid, prdctid);
	// console.log('C_dS_good.quantity:',q.numberof);
	return q.numberof;
}
C_dS_good.getbyresaid = function(resaid, prdctid) {
	const q = rmems['plitems'].goods.get(resaid, prdctid);
	// console.log('C_dS_good.quantity:',q.numberof);
	return q;
}

////////////////

C_dS_good.ACoptions = function(preset) { // for C_iACPICK, see (*aco01*), used by M_RESA
		preset = preset||{ /* eproducts:false, tip:false, leadclass:{resources:this.dS.resources} */}; 
	
	let wkall = false;
	let ewkonly = false;
	let intonly = false;
	if('eproducts' in preset) { // preset.eproducts undefined => return all products
		if(preset.eproducts===true) { this.sum = C_dS_good.registers.eresa.ends(1) || 0; ewkonly = true; }
		else if(preset.eproducts===false) { this.sum = C_dS_good.registers.eresa.ends(0) || 0; intonly = true; }
	}
	else {
		wkall = true;
		this.sum = C_dS_good.registers.id.ends() || 0; // returns both internal and e-reservable products
	}
		

	this.trigger = 0; // calls this.fetch() when focused, if 0 (zero), the C_iAC will auto set the trigger value based on this.count()
	this.css = 'alpha14';
	
		// let options = {}; for(let id in this.register) options[id] = this.label(id);
		// if(esection) options[0] = esection; // labels are not sorted by id, but by label alphabetic

		let ints_r = C_dS_good.registers.eresa.get(0) || []; // returns only NON ePerformances
		let webs_r = C_dS_good.registers.eresa.get(1) || []; // returns only ePerformances

		let registers = [];

		let bcal = { id:0 }; // this product display is not dedicated to a given bcal resource
			if('leadclass' in preset) {
				let rscs = preset.leadclass.resources; // like { 1:class_uCal ids [], 2:class_bCal ids [], 4:class_fCal ids []  }
				let bcals = rscs[agClass.bCal]; // always at least one
				for(id in bcals) { bcal = bcals[id]; break; } // pick the first one (most of time there is only one), multi accounts with staffing may differ
			}
			
			let labels 	= { 0: [], 1: [], 2: [], 3: [] };
			let presets = { 0: {}, 1: {}, 2: {}, 3: {} };
			let order 	= { 0:new Array(), 1:new Array(), 2:new Array(), 3:new Array() }; 	
		
		
		if(mobminder.account.single) { // they arrive well sorted, we use registers 2 and 3 for single accounts
		
			if(this.sum) {
				if(!ewkonly) registers[2] = ints_r; // internal products
				if(mobminder.account.has.eproducts)
					if(wkall||ewkonly) registers[3] = webs_r; // odd indexes are for e-reservables
			}
			
		} else { // multi accounts
		
			// registers 0 and 1 show only products for which bcal is expert
			// registers 2 and 3 show other remaining products
			
			let f = function(rray, title) { // this is for dev purpose
				console.log(' ');
				console.log(title);
				for(let i in rray) console.log(i, rray[i]);
			}
				
			// registers 0 and 2 are used for internal products
			if(ewkonly) {
				registers[2] = Array(); // internals for which bcal is not expert
			}
			else {
				if(bcal.id) registers[0] = Array(); // internals for which bcal is expert, when bcal is undefined this register is empty
				registers[2] = Array(); // internals for which bcal is not expert
						
				for(let wkid in ints_r) { // sort out internal products
					let xperts = C_dS_goodexpert.registers.rescids.get(wkid); // the concerned bcal is expert for this product according to account setup
					// f(xperts,'internal products');
					if(bcal.id in xperts) // bcal is expert for this wkid
							registers[0][wkid] = ints_r[wkid];
					else 	registers[2][wkid] = ints_r[wkid];
				}
			}
			
			if(mobminder.account.has.eproducts) if(!intonly) {
				
				// registers 1 and 3 are used for web products
				registers[1] = Array();
				registers[3] = Array();
				for(let wkid in webs_r)  // sort out web products
					if(bcal.id in C_dS_goodexpert.registers.rescids.get(wkid)) // the concerned bcal is expert for this product according to account setup
							registers[1][wkid] = webs_r[wkid];
					else 	registers[3][wkid] = webs_r[wkid];
			}
			
		}
		
		// common to all sections
		//
		// When testing this code, please plan the following scenarios
		// o single account with no e-reservable product
		// o single account with e-reservables
		// o multi account with no e-reservable product
		// o multi account with e-reservables
		// o log in as a single user from a multi account (that user displays in single mode and sees only products for which he is expert)
		
		// for(let s in registers) {
			// let c = 0; for(id in registers[s]) c++;
			// console.log('Reg '+s+' : '+c+' items');
		// }
		
		
		for(let s in registers) { // s is the section id
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
			for(let id in registers[s]) {
				order[s].push(id);
				let dS = registers[s][id];
				labels[s][id] = this.label(id);
				presets[s][id] = { tip:false };
				if(preset.tip) presets[s][id].tip = dS.wtip();
			}
			order[s].sort(sortrule); // we sort each section independatly on label's alphanumeric
		}
		
		
		// prepare this.options like { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count }
		let ordermerge = new Array();
		let labelsmerge = { };
		let presetmerge = { };
		
		
		// let's fix the sections titles and presets
		
					let globy = '<div style="margin-left:.6em;" class="fa fa-globe fa-15x"></div>';
				let multi_ints = ''; if(bcal.id) multi_ints = C_XL.w('performances',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name; // like 'performances for Dr Jekill's'
				let multi_webs = ''; if(bcal.id) multi_webs = C_XL.w('e-reservables',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name+globy; // like 'e-reservables for Dr Jekill's'
					
					let others = false; if(!!registers[0]) others = true; // if bcal specifics exist, then other products should be called 'other products'
				let ints = others ? C_XL.w('other performances',{cap:0}) : C_XL.w('performances',{cap:0});
				let webs = C_XL.w('e-reservables',{cap:0})+globy;
			let sections = { 0:multi_ints, 1:multi_webs, 2:ints, 3:webs }; // see (*ac03*)
			let bullet = C_XL.w('bullet down')+'&nbsp;';
		
		for(let s in registers) {
			if(mobminder.account.single && s==2) continue; // we do not display the internal section title when on single accounts
			if(intonly) continue; // we do not display the internal section title when on single accounts
			labelsmerge[s] = sections[s];
			presetmerge[s] = {section:bullet};
		}
		
		// let's fill now with products labels
		
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) labelsmerge[id] = labels[s][id];
		}
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			ordermerge.push(s); // set the place for the section (i.e 0, 1, 2 or 3)
			for(let i in order[s]) ordermerge.push(order[s][i]);
			
		}
			// let sectionbullet = {section:bullet};
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) { presetmerge[id] = presets[s][id]; }
		}

		let count = ordermerge.length;
		
	this.options = { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count };	 // the upper level is not prepared to receive options with specification of order

}
C_dS_good.ACoptions.prototype = {
	
	fetch: function(digits, callback) { 
	
		const options = this.options;
		setTimeout(function(o){return callback.cb(digits, o)},4,options); // see (*ac04*)
		return;
	},
	label: function(id) { // this is called to display the product lablel under the AC control, in the C_iCRESTA scope
		
		const dS = C_dS_good.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		
				const price = dS.price ? price = C_iEDIT.ergoprice(dS.price)+C_XL.w('euros') : 0;
				const parentheses = '&nbsp;<span style="font-size:smaller; font-weight:normal; opacity:.6">('+price+')</span>';
			const tags = dS.wtags({marginleft:'0.5em',marginbetween:'0.2em'});
			// let label = dS.wbullet()+dS.name+parentheses+tags;
			const label = '&nbsp;'+dS.wbullet()+dS.name+parentheses+tags;
		return label;
	},
	quantity: function(resaid, prdctid) {
		return C_dS_good.quantity(resaid, prdctid);
	},
	tip: function(id) { 
		let dS_prd = C_dS_good.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
		return dS_prd.wtip();
	},
	count: function() { return this.sum; } // used by C_iAC to set the fetch trigger, see (*ac10*)
}


////////////////   P R O D U C T     S T O C K     I N V E N T O R I E S

function C_dS_stocktaking(p) { // group to a C_dS_product. Tells which of products are performed during exercising this reservation.
	C_dS_trackingCD_utc.apply(this,p);
	C_dS_stocktaking.defaults.mergeto(this,p,this.tmc); // tmc taken from C_dS_trackingCD_utc
	// registers
	if(this.id>0) {
		C_dS_stocktaking.registers.byproduct.add(this.groupId, this.id, this); // C_dS_stocktaking's group to a C_dS_product
		C_dS_stocktaking.registers.id.add(this.id, this);
	} else {
		C_dS_stocktaking.defaults.apply(this); // new object
	}
	if(vbs) vlog('datasets.js','C_dS_stocktaking','new','id:'+this.id+', delta:'+this.delta+', takingnote:'+takingnote);
}
C_dS_stocktaking.defaults = new A_df({delta:0, movingtotal:0, takingnote:'' });
(C_dS_stocktaking.reset = function(){
	C_dS_stocktaking.registers = new C_regS('id', 'byproduct');
})();
C_dS_stocktaking.prototype = {
	bullet_movingtotal: function() { // returns the green label bullet that displays the moving total
		let movingtotal = this.movingtotal;
		let calculate = '<div style="margin-left:.6em; font-weight:bold; line-height:1em; max-height:1em;" class="fad fa-calculator fa-15x"></div>';
			movingtotal = '<div class="" style="display:inline-block; font-size:1.2em; padding-left:.6em; padding-right:1em;">'+movingtotal+'</div>';
		let divmoving = '<div class="mindertext" style="padding-left:.2em; display:inline-flex; align-items:center; height:1.4em;">'+calculate+movingtotal+'</div>';
		return divmoving;

	},
	bullet_delta: function() { // returns the blue label bullet that displays the moving total
		let delta = this.delta; 
				let chart = '<div style="font-weight:bold; max-height:1em; line-height:1em;" class="fad fa-arrow-alt-right fa-16x fa-rotate-45"></div>'; // going up
		if(delta>0) chart = '<div style="font-weight:bold; max-height:1em; line-height:1em;" class="fad fa-arrow-alt-right fa-16x fa-rotate-315"></div>';// going down
		if(delta==0) chart = '<div style="font-weight:bold; max-height:1em; line-height:1em;" class="fad fa-arrow-alt-right fa-16x"></div>'; // going flat
		
		let signeddelta = delta; if(delta>0) signeddelta = '+'+delta;
			signeddelta = '<div>'+signeddelta+'</div>';
		let divdelta = '<div class="mobtext" style="display:inline-flex; align-items:center; height:1.4em;">'+chart+signeddelta+'</div>';
		return divdelta;
	}
}
C_dS_stocktaking.get = function(id) { return C_dS_stocktaking.registers.id.get(id); }
C_dS_stocktaking.getbyproduct = function(productId) { return C_dS_stocktaking.registers.byproduct.get(productId); }

C_dS_stocktaking.plus = function(genome) {
	this.genome = genome||{};
	// generic interface to C_iPLUS
	this.plusmay = true; // permissions.may(pc.ch_stocktakings); 
	this.eid = '_stt_';
	this.list = function() {
		let product = C_dS_product.get(this.genome.productId); // which is a C_dS_product
		let takings = C_dS_stocktaking.getbyproduct(this.genome.productId); // which is an array of C_dS_stocktaking indexed by their id
		let labels = [], order = [], islast = true;
		if(takings) {
			let keys = Object.keys(takings).filter(id => id != "0").sort((a, b) => Number(b) - Number(a)); // prepare for reverse scanning the takings array
			let dS;
			for(let id of keys) { // id's == 0 are newly and eventually abandonned stocktaking creations
					dS = takings[id];
				let when = '<div style="display:inline-block; height:2em; line-height:2em;">'+sortable(dS.created,{y:true})+':</div>';
				let signeddelta = dS.delta; if(dS.delta>0) signeddelta = '+'+dS.delta;
				let total = dS.bullet_movingtotal();
				let note = '<div class="textcolor-light ellipsis smaller" style="padding-left:1em; max-width:24em; line-height:1em; padding-top:.1em;">'+dS.takingnote+'</div>';
				signeddelta = dS.bullet_delta();
				let cssshade = dS.deleted ? ' opacity:.4; font-size:90%;' : '';
				let bin = '';
				if(dS.deleted)
					bin = '<div style="margin-right:.3em; line-height:1em; max-height:1em;" class="fad fa-trash-alt fa-15x"></div>';
				let label = bin+when+total+signeddelta+note;
				if(verboseOn) label = '<div>'+dS.id+'</div> '+label;
				labels[id] = '<div style="display:inline-flex; align-items:center; '+cssshade+'" class="">'+label+'</div>';
				order.push(id); // most recents stocktakings appear on the top of the list
				if(dS.deleted) dS.youarelast = false; // deleted items are excluded from defining the last created (deletable) item
				else { 
					dS.youarelast = islast; // only the newest created item is identified as last event on calendar
					islast = false;
				}
			}
		}
		return { labels:labels, order:order };
	};
	this.plus = function() {	
		return new C_dS_stocktaking(C_dS_trackingCD_utc.tnew(-1, mobminder.account.id).concat([0 /*delta*/, '' /* takingnote */]));
	}
	this.get = function(id) {
		return C_dS_stocktaking.registers.id[id];
	}
}
C_dS_stocktaking.del = function(id) {
	let item = C_dS_stocktaking.get(id);
	C_dS_stocktaking.registers.del(item);
}





//////////////////////////////////////////////////////////////////////////////// 
//
////////////////  W O R K    C O D E S 

function C_dS_workcode(p) {
	
	C_dS_trackingCCD.apply(this,p);
	C_dS_workcode.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_workcode.registers.eresa.add(this.ereservable, this.id, this); // ereservable is [0 or 1]
		C_dS_workcode.registers.id.add(this.id, this);
		C_dS_workcode.count++; 
	} else {
		C_dS_workcode.defaults.apply(this); // new object
	}
	
	// meta
	this.has = { ccss:!!(this.cssColor||this.cssPattern), tags:!!this.tags };
		let color = this.cssColor?C_dS_customCss.get(this.cssColor).css:'';
		let pattern = this.cssPattern?C_dS_customCss.get(this.cssPattern).css:'';
	this.ccss = { color:color, pattern:pattern };
	this.xmon = new Array();
};
C_dS_workcode.defaults = new A_df( { name:'', code:'', price:0, deposit:0
		, note:'', secretarynote:'', webpagenote:'', communicnote:'' 
		, altLanguage1:255, altName1:'', altwebpagenote1:'', altcommunicnote1:'', altLanguage2:255, altName2:'', altwebpagenote2:'', altcommunicnote2:''			
		, duration:1, staffing:1, cssColor:0, cssPattern:0, tag:0, tags:'' 
		, ereservable:0, checklistid:0 } );
(C_dS_workcode.reset = function() {
	C_dS_workcode.registers = new C_regS('id','eresa');
	C_dS_workcode.count = 0; 
})();
C_dS_workcode.prototype = {
	resources: function() { return C_dS_workexpert.registers.bytype.get(this.id) }, // results like [rscType][rscId] = o_dS_resource;
	expertsIds: function() { return C_dS_workexpert.registers.rescids.get(this.id) }, // results like [rscId] = rscId;
	tboxingIds: function() { return C_dS_worktboxing.registers.tboxid.get(this.id) }, // results like [tboxingId] = o_dS_timeboxing;
	scretarymsg: function() {
		if(this.secretarynote) { // pop up the workcode note // see also (*pu10*)
			setTimeout( function(that) {
				new C_iMSG(that.secretarynote.htmlize(), { onChoice:false }, { css:{image:'comment-alt-exclamation', duotone:'red', body:'', borders:'mmborder-blue'}, interactivity:'ok', title:that.name, subtitle:C_XL.w('workcode pop-up title'), size:{x:600,y:''}, sound:'droplet' } );
			} 
			, 2*C_iMODAL.animationdelay, this ); // here we double the animation delay because when coming from the visitor creation modal, you end up here (*md19*)
		}
	},

	wbullet: function(options) {	
		options = options || { }; 
			let tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			let inner = this.tag?'':'&nbsp;';
			let cssclass = 'bullet workcode '+tag+this.wcss();
		let bullet = '<div style="display:inline-block;" class="'+cssclass+'">'+inner+'</div>';
		return bullet;
	},
	wcss: function() {
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		return color+pattern;
	},
	wtip: function() {
			let separator = '<hr/>';
		let bullet = this.hasCcss() ? this.wbullet() : '';
			
			let codeprice = new Array(); 
		if(this.code) codeprice.push(this.code);
		if(this.price) codeprice.push(C_iEDIT.ergoprice(this.price)+C_XL.w('euros'));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
			
		let name = this.name+' ('+this.minutes()+')';
		let note = this.note ? separator + this.note : '';
		let tags = this.wtags({verbose:true}); if(tags) tags = separator+tags; 
			
		let tip = bullet + name + codeprice + note + tags;
		return tip;
	},
	wtags: function(options) {
		let tags = '';
		
		options = options || {}; // like  { marginleft:'0.5em', marginbetween:'0.2em', size:'100%' }
		if(this.has.tags) {
				let size = ''; if(options.size) size=' font-size:'+options.size+';';
				let tagsids = this.tags.split('!');
				
			if(options.verbose) { // display as a list of item with each their name (used for tooltip where the tags signification are also displayed)
					let br = '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
					if(tagid==='') continue; // which is the tags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						let dS_tag = C_dS_customCss.get(tagid);
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+size+'"';
					tags = tags+br+'<div '+style+' class="tag '+dS_tag.cssName+'"></div>&nbsp;'+dS_tag.name;
					br = '<br/>';
				}
				
			} else { // display inline (good for autocomplete list)
				let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
				for(let x in tagsids) {
						let tagid = tagsids[x];
					if(tagid==='') continue; // which is the tags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						let tagcss = C_dS_customCss.get(tagid).cssName;
						let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
					tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
					margin = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : ''; // reduce the margin between tags, only the first one is longer
				}
			}
		}
		return tags;
	},
	hasCcss: function() { return !!(this.cssColor+this.cssPattern); },
	minutes: function() { 
			let mps = mobminder.account.secondsPerSlice/60; // minutes per slice
		return (this.duration*mps)+'min';
	},
	wclone: function() {
		let son = new C_dS_workcode();
		son.id = 0; son.groupId = this.groupId;
		for(let field in C_dS_workcode.defaults) son[field] = this[field];
		
		C_dS_workexpert.clonefrom(this.id);
		
		return son;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};

////////////////

C_dS_workcode.ACoptions = function(preset) { // for C_iACPICK, see (*aco01*), used by M_RESA
		preset = preset||{ /* eWorkcodes:false, tip:false, leadclass:{resources:this.dS.resources} */}; 
	
	let wkall = false;
	let ewkonly = false;
	let intonly = false;
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) { this.sum = C_dS_workcode.registers.eresa.ends(1) || 0; ewkonly = true; }
		else if(preset.eWorkcodes===false) { this.sum = C_dS_workcode.registers.eresa.ends(0) || 0; intonly = true; }
	}
	else {
		wkall = true;
		this.sum = C_dS_workcode.registers.id.ends() || 0; // returns both internal and e-reservable workcodes
	}
		

	this.trigger = 0; // calls this.fetch() when focused, if 0 (zero), the C_iAC will auto set the trigger value based on this.count()
	this.css = 'alpha14';
	
		// let options = {}; for(let id in this.register) options[id] = this.label(id);
		// if(esection) options[0] = esection; // labels are not sorted by id, but by label alphabetic

		let ints_r = C_dS_workcode.registers.eresa.get(0) || []; // returns only NON ePerformances
		let webs_r = C_dS_workcode.registers.eresa.get(1) || []; // returns only ePerformances

		let registers = [];

		let bcal = { id:0 }; // this workcode display is not dedicated to a given bcal resource
			if('leadclass' in preset) {
				let rscs = preset.leadclass.resources; // like { 1:class_uCal ids [], 2:class_bCal ids [], 4:class_fCal ids []  }
				let bcals = rscs[agClass.bCal]; // always at least one
				for(id in bcals) { bcal = bcals[id]; break; } // pick the first one (most of time there is only one), multi accounts with staffing may differ
			}
			
			let labels 	= { 0: [], 1: [], 2: [], 3: [] };
			let presets = { 0: {}, 1: {}, 2: {}, 3: {} };
			let order 	= { 0:new Array(), 1:new Array(), 2:new Array(), 3:new Array() }; 	
		
		
		if(mobminder.account.single) { // they arrive well sorted, we use registers 2 and 3 for single accounts
		
			if(this.sum) {
				if(!ewkonly) registers[2] = ints_r; // internal workcodes
				if(mobminder.account.has.eworkcodes)
					if(wkall||ewkonly) registers[3] = webs_r; // odd indexes are for e-reservables
			}
			
		} else { // multi accounts
		
			// registers 0 and 1 show only workcodes for which bcal is expert
			// registers 2 and 3 show other remaining workcodes
			
			let f = function(rray, title) { // this is for dev purpose
				console.log(' ');
				console.log(title);
				for(let i in rray) console.log(i, rray[i]);
			}
				
			// registers 0 and 2 are used for internal workcodes
			if(ewkonly) {
				registers[2] = Array(); // internals for which bcal is not expert
			}
			else {
				if(bcal.id) registers[0] = Array(); // internals for which bcal is expert, when bcal is undefined this register is empty
				registers[2] = Array(); // internals for which bcal is not expert
						
				for(let wkid in ints_r) { // sort out internal workcodes
					let xperts = C_dS_workexpert.registers.rescids.get(wkid); // the concerned bcal is expert for this workcode according to account setup
					// f(xperts,'internal workcodes');
					if(bcal.id in xperts) // bcal is expert for this wkid
							registers[0][wkid] = ints_r[wkid];
					else 	registers[2][wkid] = ints_r[wkid];
				}
			}
			
			if(mobminder.account.has.eworkcodes) if(!intonly) {
				
				// registers 1 and 3 are used for web workcodes
				registers[1] = Array();
				registers[3] = Array();
				for(let wkid in webs_r)  // sort out web workcodes
					if(bcal.id in C_dS_workexpert.registers.rescids.get(wkid)) // the concerned bcal is expert for this workcode according to account setup
							registers[1][wkid] = webs_r[wkid];
					else 	registers[3][wkid] = webs_r[wkid];
			}
			
		}
		
		// common to all sections
		//
		// When testing this code, please plan the following scenarios
		// o single account with no e-reservable workcode
		// o single account with e-reservables
		// o multi account with no e-reservable workcode
		// o multi account with e-reservables
		// o log in as a single user from a multi account (that user displays in single mode and sees only workcodes for which he is expert)
		
		// for(let s in registers) {
			// let c = 0; for(id in registers[s]) c++;
			// console.log('Reg '+s+' : '+c+' items');
		// }
		
		
		for(let s in registers) { // s is the section id
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
			for(let id in registers[s]) {
				order[s].push(id);
				let dS = registers[s][id];
				labels[s][id] = this.label(id);
				presets[s][id] = { tip:false };
				if(preset.tip) presets[s][id].tip = dS.wtip();
			}
			order[s].sort(sortrule); // we sort each section independatly on label's alphanumeric
		}
		
		
		// prepare this.options like { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count }
		let ordermerge = new Array();
		let labelsmerge = { };
		let presetmerge = { };
		
		
		// let's fix the sections titles and presets
		
					let globy = '<div style="margin-left:.6em;" class="fa fa-globe fa-15x"></div>';
				let multi_ints = ''; if(bcal.id) multi_ints = C_XL.w('performances',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name; // like 'performances for Dr Jekill's'
				let multi_webs = ''; if(bcal.id) multi_webs = C_XL.w('e-reservables',{cap:0})+'&nbsp;'+C_XL.w('for',{cap:0})+'&nbsp;'+bcal.name+globy; // like 'e-reservables for Dr Jekill's'
					
					let others = false; if(!!registers[0]) others = true; // if bcal specifics exist, then other workcodes should be called 'other workcodes'
				let ints = others ? C_XL.w('other performances',{cap:0}) : C_XL.w('performances',{cap:0});
				let webs = C_XL.w('e-reservables',{cap:0})+globy;
			let sections = { 0:multi_ints, 1:multi_webs, 2:ints, 3:webs }; // see (*ac03*)
			let bullet = C_XL.w('bullet down')+'&nbsp;';
		
		for(let s in registers) {
			if(mobminder.account.single && s==2) continue; // we do not display the internal section title when on single accounts
			if(intonly) continue; // we do not display the internal section title when on single accounts
			labelsmerge[s] = sections[s];
			presetmerge[s] = {section:bullet};
		}
		
		// let's fill now with workcodes labels
		
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) labelsmerge[id] = labels[s][id];
		}
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			ordermerge.push(s); // set the place for the section (i.e 0, 1, 2 or 3)
			for(let i in order[s]) ordermerge.push(order[s][i]);
			
		}
			// let sectionbullet = {section:bullet};
		for(let s in registers) {
			if(!registers[s].length) continue; // nothing to display here
			for(let id in labels[s]) { presetmerge[id] = presets[s][id]; }
		}
		
		
		
		let count = ordermerge.length;
		
	this.options = { order:ordermerge, labels:labelsmerge, presets:presetmerge, count:count };	 // the upper level is not prepared to receive options with specification of order

}
C_dS_workcode.ACoptions.prototype = {
	
	fetch: function(digits, callback) { 
	
		let options = this.options;
		setTimeout(function(o){return callback.cb(digits, o)},4,options); // see (*ac04*)
		return;
	},
	label: function(id) { // this is called to display the workcode lablel under the AC control, in the C_iCRESTA scope
		
		let dS = C_dS_workcode.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		
				let price = ''; if(dS.price) price = ', '+C_iEDIT.ergoprice(dS.price)+C_XL.w('euros');
			let parentheses = ''; parentheses = ' <span style="font-size:smaller; font-weight:normal; opacity:.6">('+dS.minutes()+price+')</span>';
			let tags = dS.wtags({marginleft:'0.5em',marginbetween:'0.2em'});
			let label = dS.wbullet()+dS.name+parentheses+tags;
		return label;
	},
	tip: function(id) { 
		let dS_wrk = C_dS_workcode.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
		return dS_wrk.wtip();
	},
	count: function() { return this.sum; } // used by C_iAC to set the fetch trigger, see (*ac10*)
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
C_dS_workcode.options = function(preset) { // for C_iCRESTA, see (*aco01*) in e-resa.js (note PVH2023 : OBSOLETE! there is no e-resa anymore in this baseline)

		// preset like {eWorkcodes:true, which:[ids], checked:'first' or [ids]}
	
		preset = preset||{ /* eWorkcodes:false, tip:false, bullets:true, language:false */ };
		// the search assistant uses eWorkcodes:false (none of e-resa workcodes should appear there)
		// the e-resa.js used eWorkcodes:true (only of e-resa workcodes should appear there)
		// the M_RESA modal use eWorkcodes:undefined (shows all of possible e-reservable and intern usage workcodes)
		// M_LOGIN uses eWorkcodes:true (filtering the allowed workcodes for the eresa web page)
		// language 
	
	// let register = preset.eWorkcodes?C_dS_workcode.registers.eresa.get(1):C_dS_workcode.registers.id.get();
	let register = C_dS_workcode.registers.id.get() || [];
	
	if('eWorkcodes' in preset) { // preset.eWorkcodes is true or false => returns all workcodes of the given type: e-workcodes or internal workcodes
	
		let order = [], labels = [], presets = {};

		let sortrule = function(a,b) { return (register[a].name>register[b].name)?1:-1; }; 
	
		if(preset.eWorkcodes===true) register = C_dS_workcode.registers.eresa.get(1) || []; // returns only ePerformances
		if(preset.eWorkcodes===false) register = C_dS_workcode.registers.eresa.get(0) || []; // returns only internal use workcodes
	
	
		for(let id in register) {
			
			if(preset.which) if(!(id in preset.which)) continue; // exclude ids that are not foreseen by the .which array.
			
				let dS_wk = register[id]; // is a dS_workcode
			order.push(id);
			
			
			let note = dS_wk.note, name = dS_wk.name;

			// reset the name and note when alternative languages are specified in the workcode
			if(preset.language!==undefined) {
				let l = preset.language; // language specified for the web page
				if(l == dS_wk.altLanguage1) { if(dS_wk.altwebpagenote1) note = dS_wk.altwebpagenote1; if(dS_wk.altName1) name = dS_wk.altName1; }
				if(l == dS_wk.altLanguage2) { if(dS_wk.altwebpagenote2) note = dS_wk.altwebpagenote2; if(dS_wk.altName2) name = dS_wk.altName2; }
			}
			
			if(preset.bullets) labels[id] = dS_wk.wbullet()+name;
				else labels[id] = name;
				
			presets[id] = { tip:false };
			if(preset.tip)
				presets[id].tip = dS_wk.wtip();
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
}


////////////////  W O R K    C O D E S    E X P E R T S, they identify the resources that are defined as experts for a given C_dS_workcode

function C_dS_workexpert(p) {
	C_dS_workexpert.defaults.mergeto(this,p);
	let resource = C_dS_resource.get(this.resourceId);
	C_dS_workexpert.registers.bytype.add(this.groupId, resource.resourceType, resource.id, this); // definition of bytype, rescids and id, see (*we01*)
	C_dS_workexpert.registers.rescids.add(this.groupId, resource.id, resource.id); // used of R_search
	C_dS_workexpert.registers.id.add(this.groupId, this.id, this);
};
C_dS_workexpert.defaults = new A_df( { id:0, groupId:0, resourceId:0 } ); // they group to a C_dS_workcode
C_dS_workexpert.deleteOnWorkcode = function(wrkcodeId) {
	let items = C_dS_workexpert.registers.id.get(wrkcodeId);
	for(let id in items) C_dS_workexpert.registers.del(items[id]);
};
C_dS_workexpert.clonefrom = function(wrkcodeId) { // clone experts from a wrkcodeId into a new set having groupId = 0 and negative id's for the related C_dS_workexpert's
	
	let items = C_dS_workexpert.registers.id.get(wrkcodeId);
	for(let id in items) {
			let dS_workexpert = items[id];
		let son = new C_dS_workexpert( [-dS_workexpert.id, 0, dS_workexpert.resourceId] );		
	}
};
(C_dS_workexpert.reset = function(){
	C_dS_workexpert.registers = new C_regS('id', 'bytype', 'rescids'); // see (*we01*)
})();


////////////////  P E R F O R M A N C E, they are application of C_dS_workcode on C_dS_reservation

function C_dS_performance(b, p) { // groups to a reservation. Tells which of workcodes are performed during exercising this reservation.
	C_dS_performance.defaults.mergeto(this,p);
	rmems[b].perf.add(this.resaId, this.workCodeId, C_dS_workcode.get(this.workCodeId));
	if(vbs) vlog('datasets.js','C_dS_performance','new','id:'+this.id+', grpId:'+this.resaId+', workCodeId:'+this.workCodeId); 
}
C_dS_performance.defaults = new A_df({id:0, resaId:0, workCodeId:0, visitorId:0, checklist:''});




//////////////////////////////////////////////////////////////////////////////// 
//
////////////////  P A Y M E N T


function payregs() { C_regS.apply(this,['byid','byresaid']); }; 
payregs.prototype = C_regS.prototype;

var payregs = { plitems:new payregs(), slots:new payregs(), standbylist:new payregs(), visiapps:new payregs(), catalyst:new payregs(), flush: function(which) { payregs[which] = new payregs() } } // see (*ep09*)


function C_dS_payment(b, p) { // group to a reservation. Tells which of workcodes are performed during exercising this reservation.
	
	C_dS_trackingCC.apply(this,p);
	C_dS_payment.defaults.mergeto(this,p,this.tmc); // tmc stands for 'tracking members count'
	
	payregs[b].byresaid.add(this.groupId, this.id, this); // an array like payregs[b].byresaid[resaid][pid] => o_dS_payment
	payregs[b].byid.add(this.id, this); // an array like payregs[b].byid[pid] => o_dS_payment
	
	if(vbs) vlog('datasets.js','C_dS_payment','constructor','bank:'+b+', id:'+this.id+', resaId:'+this.groupId+', paymean:'+this.paymean+', amount:'+this.amount+', transtatus:'+C_dS_payment.status.xl(this.transtatus, true)+', opstatus:'+this.opstatus+', transnote:'+this.transnote);
}
C_dS_payment.type = { 
	receivables:-2, notset:-1, cash:0, mobqrcode:1, payconiq:2, cards:4, softpos:11, hardpos:21, onlinepayco:33, onlinecards:44, onlinebancontact:55,
	// translate:{ '-1':'none', 0:'ep-paytype cash', 1:'ep-paytype sepa qr', 2:'ep-paytype payconiq', 4:'ep-paytype cards', 11:'ep-paytype softpos', 21:'ep-paytype hardpos', 33:'ep-paytype onlinepayco', 44:'ep-paytype onlinecards', 55:'ep-paytype onlinebancontact' },
	options: function() { // these are filter options for Search & Find, used by C_iCRESTA, e.g. in the C_backFIND, see (*ep12*)
		let order = [0,1,2,11,21,33,44,55,'-2'];
		let labels = C_XL.w({0:'ep-paytype cash', 1:'ep-paytype sepa qr', 2:'ep-paytype payconiq', 4:'ep-paytype cards', 11:'ep-paytype softpos', 21:'ep-paytype hardpos', 33:'ep-paytype onlinepayco', 44:'ep-paytype onlinecards', 55:'ep-paytype onlinebancontact', '-2':'resa-receivables'}); // see (*tp02*)
		for(let x in order) { let pc = order[x]; labels[pc] = this.icons[pc]+'&nbsp;'+labels[pc] };
		let presets = {};
		return { order:order, labels:labels, presets:presets, count:order.length };
	},
	icons: (function(){ let icons=[]; // see (*ep18*)
		icons[0]  = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-coins"></span>';
		icons[1]  = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-qrcode"></span>';
		icons[2]  = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-infinity"></span>';
		icons[4]  = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-credit-card"></span>';
		icons[11] = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-mobile-alt"></span>';
		icons[21] = '<span class="mob-txt-gray_m fa fa-13x fa-2w fa-credit-card"></span>';
		icons[33] = '<span class="mob-txt-gray_m fa fa-13x fa-infinity"></span>&nbsp;<span class="mob-txt-gray_d fa fa-08x fa-globe"></span>';
		icons[44] = '<span class="mob-txt-gray_m fa fa-13x fa-credit-card"></span>&nbsp;<span class="mob-txt-gray_d fa fa-08x fa-globe"></span>';
		icons[55] = '<span class="mob-txt-gray_m fa fa-13x fa-credit-card"></span>&nbsp;<span class="mob-txt-gray_d fa fa-08x fa-globe"></span>';
		icons[-2] = '<span class="mob-txt-gray_m fa fa-13x fa-inbox"></span><span class="mob-txt-gray_d fa fa-history"></span>';
		return icons;
	})()
};

function XLpayicons(span) {
	let l = {0:'',1:'',2:'',3:'',4:'',5:'',6:'',7:'',8:'',9:'',10:'',11:'',12:''}; // foresees 12 languages
	for(let lc in l) l[lc]=span;
	return l;
}

C_XL.d['resa-abr-payments']		= XLpayicons('<div class="fad fa-17x fa-inbox-in"></div>');
C_XL.d['resa-abr-cash']			= XLpayicons('<div class="fad fa-15x fa-coins"></div>');  // note the FAD, these are translations for C_catalyst columns header display, see also (*ct07*)
C_XL.d['resa-abr-mobqrcode']	= XLpayicons('<div class="fad fa-15x fa-qrcode"></div>');
C_XL.d['resa-abr-payconiq']		= XLpayicons('<div class="fad fa-15x fa-infinity"></div>');
C_XL.d['resa-abr-softpos']		= XLpayicons('<div class="fad fa-15x fa-mobile-alt"></div>');
C_XL.d['resa-abr-hardpos']		= XLpayicons('<div class="fad fa-15x fa-credit-card"></div>');
C_XL.d['resa-abr-onlinepayco']	= XLpayicons('<div class="fad fa-15x fa-infinity"></div><div class="fa fa-09x fa-globe"</div>');
C_XL.d['resa-abr-onlinecards']	= XLpayicons('<div class="fad fa-15x fa-credit-card"></div><div class="fa fa-09x fa-globe"></div>');
C_XL.d['resa-abr-onlinebancontact']	= XLpayicons('<div class="fad fa-15x fa-credit-card"></div><div class="fa fa-09x fa-globe"></div>');
C_XL.d['resa-abr-receivables']	= XLpayicons('<div class="fad fa-15x fa-inbox"></div><div class="fa fa-history"></div>'); // we redefine it to icon display mode, see (*ep16*)
	
C_dS_payment.status = { // see (*ep10*)
	code:{ isnew:999, unauthorized:0, identified:17, pending:10, success:20, refund:21, expired:30, failed:40, cancelled:50 }, // note that refund does not exist in DB
	translate:{ 999:'ep-st-isnew', 0:'ep-st-unauthorized', 10:'ep-st-pending', 17:'ep-st-identified', 20:'ep-st-success', 21:'ep-st-refund', 30:'ep-st-expired', 40:'ep-st-failed', 50:'ep-st-cancelled' },
	xl: function(s,v) { let xl = C_XL.w(this.translate[s]); let c = v?' ('+s+')':''; return xl+c; },
	options: function(paymean) { // here we limit the range of possible status according to the payment mean, see C_dS_payment.status.options( for usage examples
		
		let ptypes = C_dS_payment.type;
		let options = this.translate;
		
		switch(paymean) {
			case ptypes.cash:
			case ptypes.mobqrcode:	
				options = { 20:'ep-st-success', 50:'ep-st-cancelled' }
				break;
			
			case ptypes.payconiq:	
			case ptypes.cards:
			case ptypes.softpos:
			case ptypes.hardpos:
			case ptypes.onlinepayco:
			case ptypes.onlinecards:
			default: 
				options = this.translate;
				break; 
		}		
		
		return C_XL.w(options);
	}
};
C_dS_payment.defaults = new A_df({paymean:0, amount:0, transid:'', transnote:'', transtatus:999, opstatus:'', accountholder:'', accountIBAN:'', qrcodestring:'', archived:0 });
C_dS_payment.prototype = {
	pbullet: function(options) {
		options = options || { display:'pluslist' };
		
		let color='';
		switch(this.transtatus) {
			case C_dS_payment.status.code.success: 		color = 'mob-txt-lime'; break;
			case C_dS_payment.status.code.failed: 		color = 'orange'; 		break;
			case C_dS_payment.status.code.cancelled: 	color = 'mob-txt-blue'; break;
			case C_dS_payment.status.code.expired: 		color = 'orange'; 		break;
			case C_dS_payment.status.code.unauthorized: color = 'orange'; 		break;
			
			case C_dS_payment.status.code.pending: 		color = 'mob-txt-blue'; break; // it seems not possible to know when the QRcode has been scanned
			case C_dS_payment.status.code.identified: 	color = 'mob-txt-blue'; break; // it seems not possible to know when the QRcode has been scanned
		}
		
			
		switch(options.display) { // note that for bullets, we stick on regular (non duo-tone)
			
			case 'modaltitle': 
				let s = 'fa-euro-sign';
				switch(this.paymean) {
					case C_dS_payment.type.notset: 		s = 'fa-cowbell-more'; break; // new paiement
					case C_dS_payment.type.cash: 		s = 'fa-coins'; break;
					case C_dS_payment.type.mobqrcode: 	s = 'fa-qrcode'; break;
					case C_dS_payment.type.payconiq: 	s = 'fa-infinity'; break;
					case C_dS_payment.type.cards: 		s = 'fa-id-card'; break;
					case C_dS_payment.type.softpos: 	s = 'fa-mobile-alt'; break;
					case C_dS_payment.type.hardpos: 	s = 'fa-credit-card'; break;
					case C_dS_payment.type.onlinepayco: s = 'fa-globe'; break;
					case C_dS_payment.type.onlinecards: s = 'fa-globe'; break;
				}
				let bullet = '<i style="padding-left:.2em; text-align:center;" class="fa fa-gray fa-2x '+s+' '+color+'"></i>';
				return bullet;
				
			case 'pluslist': 
			default:
				if(color=='mob-txt-lime') color = '';
				let icons = C_dS_payment.type.icons[this.paymean]; // defined here (*ep18*)
				let icon = '<div style="display:inline-block; min-width:3.6em; padding-left:0em; line-height:1.8em">'+icons+'</div>';
				let price = '<span class="'+color+'">'+C_iEDIT.ergoprice(this.amount)+' '+C_XL.w('euros')+'</span>';
				let status = ' <span class="" style="font-size:smaller; opacity:.5">('+this.pstatus()+')</span>';
				return icon+price+status;
		}
	},
	pstatus: function(options) {
		let guistatus = C_dS_payment.status.translate; // see (*ep10*)
		let s = this.transtatus;
		if(this.amount<0 && this.transtatus == C_dS_payment.status.code.success) s++; // skips to 21: displays as refund
		return C_XL.w(guistatus[s]);
	},
	is: function() {
			let pm = this.paymean;
			let pt = C_dS_payment.type;
			let ts = this.transtatus;
			let sc = C_dS_payment.status.code;
		
		let is = { 	anew:this.id <=0, 
					cash:pm == pt.cash, mobqr:pm == pt.mobqrcode, payco:pm == pt.payconiq,
					cards:(pm == pt.cards||pm == pt.softpos||pm == pt.hardpos||pm == pt.onlinecards), 
					online:(pm == pt.onlinepayco||pm == pt.onlinecards), 
					onsite:(pm == pt.cash||pm == pt.mobqrcode||pm == pt.payconiq||pm == pt.softpos||pm == pt.hardpos), 
					polled:(pm >= pt.payconiq), // includes also pm == pt.softpos||pm == pt.hardpos||pm == pt.onlinecards||pm == pt.onlinepayco
					qrcode:pm == pt.mobqrcode||pm == pt.payconiq,
					pending:(ts==sc.isnew)||(ts==sc.pending),
					endstate:(ts==sc.success)||(ts==sc.failed)||(ts==sc.cancelled)||(ts==sc.expired)||(ts==sc.unauthorized)
				};
				
		return is;
	}
}
C_dS_payment.get = function(pid,b) {
	b = b||'plitems';
	if(vbs) vlog('datasets.js','C_dS_payment','get','id:'+pid+' from bank '+b);
		let item = payregs[b].byid.get(pid);
	return item;
}
C_dS_payment.del = function(pid,b) {
	b = b||'plitems';
	if(vbs) vlog('datasets.js','C_dS_payment','del','id:'+pid+' from bank '+b);
	let item = payregs[b].byid.get(pid);
	payregs[b].del(item);
}
C_dS_payment.plus = function(dS_reservation) {
	
	// generic interface to C_dS_payment
	this.plusmay = this.mayadd();
	this.eid = '_trns_';
	this.resa = dS_reservation;
	this.list = function() {
		this.payments = payregs[this.resa.rmem].byresaid.get(this.resa.id); // is undefined or an array like this.payments[id] => o_dS_payment
		
		let indexed = this.payments; // is undefined when no resource relies in the register
		let labels = [], order = [];
		this.plusmay = this.mayadd();
		
		for(let x in indexed) { 
		
				let payment = indexed[x]; let id = payment.id;				
				let caption = payment.pbullet({display:'pluslist'});
	
			order.push(id); labels[id] = caption;
			if(verboseOn) labels[id] = id+' '+labels[id];
		}
		return { labels:labels, order:order };
	}
	this.plus = function() { // called when a new item is required by touching the (plus) button, see (*ep11*)
		return new C_dS_payment(this.resa.rmem, C_dS_trackingCC.tnew(0, this.resa.id).concat([C_dS_payment.type.notset]));
	}
	this.get = function(id) { // called when a new item is required by touching an item from the list
		return payregs[this.resa.rmem].byresaid.get(this.resa.id)[id];
	}
	this.ends = function() {
		return payregs[this.resa.rmem].byresaid.end(this.resa.id);
	}
}
C_dS_payment.plus.prototype = {
	mayadd: function() {
		return true;
	}
}




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

const color_code_event = 99;
const css_pattern_none = 999;
const css_color_none = 999;
const css_tag_none = 1000;

const ccsstype = { color:80, pattern:81, tag:82 }; // DB values
 // definition (*cs02*), for resaclass.appointment, see (*rc01*)
const ccssclasses = { 
	appointment:resaclass.appointment, 
	event:resaclass.event, 
	fcal:resaclass.fcalwide, 
	visitor:class_visitor, 
	note:class_note, 
	task:class_task, 
	chat:class_chat, 
	file:class_file, 
	product:class_product
}
const geth1css = function(ccss) { // (*cs55*)
	let postfix = '';
	switch(ccss) {
	
		case ccssclasses.appointment: postfix = 'resa'; break;
		case ccssclasses.event: 	postfix = 'event'; break;
		case ccssclasses.fcal: 		postfix = 'fcal'; break;
		
		case ccssclasses.visitor: 	postfix = 'visitor'; break;
		
		case ccssclasses.note: 		postfix = 'note'; break;
		case ccssclasses.task: 		postfix = 'task'; break;
		case ccssclasses.chat: 		postfix = 'chat'; break;
		
		case ccssclasses.product: postfix = 'product'; break;
		
		default: postfix = 'not-found';
	}
	if(postfix) return 'modal-customcss-h1-'+postfix;
	return '';
};
const ccsstag = function(clas, type) { return type+'_'+clas; };

// skin usage, see (*sk01*)
const skin = { color:ccsstype.color, pattern:ccsstype.pattern, tag:ccsstype.tag, acctag:83, rsctag:84, tbxtag:85, prdtag:99, wkctag:86, logtag:87, eresa:89 };

function C_dS_customCss(p) {

	C_dS_trackingCCD.apply(this,p);
	C_dS_customCss.defaults.mergeto(this,p,this.tmc);

	// this.resaClass is one of ccssclasses
	// this.cssType is one of ccsstype
	
	// meta
	if(this.id >= 0) { // registers default css too (they have id == 0)
		C_dS_customCss.registers.id.add(this.id, this);
		C_dS_customCss.registers.cclass.add(this.resaClass, this.cssType, this.id, this);
		C_dS_customCss.registers.ctrlshift.add(this.resaClass, this.ctrlshift, this);
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
C_dS_customCss.defaults = new A_df( { resaClass:0, cssType:0, name:'', css:0, ctrlshift:0, note:'' } ); // resaClass is badly chosen name, it should just be 'class', but in the early mobminder developments, custom colors and patterns were only applicable to planning time reservations, hence resaClass
(C_dS_customCss.reset = function() {
	C_dS_customCss.registers = new C_regS('id','cclass', 'ctrlshift');
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
	cclone: function() {
		const son = new C_dS_customCss();
		son.id = 0; son.groupId = this.groupId;
		for(let field in C_dS_customCss.defaults) son[field] = this[field];
		return son;
	},
}
C_dS_customCss.get = function(id) { 
	const ccss = C_dS_customCss.registers.id.get(id); 
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
C_dS_customCss.getCtrlShift = function(resaClass, ctrlshift) { 
	return C_dS_customCss.registers.ctrlshift.get(resaClass, ctrlshift);
}
C_dS_customCss.countByType = function(resaClass, cssType) { 
	return C_dS_customCss.registers.cclass.ends(resaClass, cssType);
}
C_dS_customCss.setdefaults = function() { // to the list of custom colors for visitors or reservations, we add here a way to select "no color".
	
	for(let type in ccsstype) {
		const t = ccsstype[type]; // [color, pattern, tag]
		for(let c in ccssclasses) {
			const cclass = ccssclasses[c];  // [ appointment, event, fcalwide, class_visitor, class_note, class_task, class_chat, class_file ]
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
		let dS = register[id]; // dS_customCss
		
		// if(options.stickeratright) labels[id] = '<div style="white-space:nowrap; padding-bottom:2px;">'+dS.name+dS.mbullet(bcss)+'</div>';
			// else labels[id] = '<div style="white-space:nowrap; padding-bottom:2px;">'+dS.mbullet(bcss)+dS.name;+'</div>';
		const b = dS.mbullet(bcss);
		if(options.stickeratright) labels[id] = dS.name+b;
			else labels[id] = b+dS.name;
			
			let tip = '<strong>'+b+dS.name+'</strong>'; if(dS.note) tip+= ':<hr/>'+dS.note;
		presets[id] = { tip:{text:tip} };
		if(precheck) if(id in precheck) presets[id].checked = true;
		if(checkall) presets[id].checked = true;
	}
	order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
	if(cssType!=ccsstype.tag) 
		if(!options.defxclusive) order.push(0); // puts default color/pattern at the end of the list, because there is less chance they get selected, see (*dc01*)

	
	return { order:order, labels:labels, presets:presets, count:order.length };
}
C_dS_customCss.plus = function(resaclass, csstype) {
	this.genome = { resaClass:resaclass, cssType:csstype }
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_ccss);
	this.eid = '_ccss_'+resaclass+'_'+csstype;
	const bcss = csstype==ccsstype.tag ? 'taglabelled' : '';
	this.list = function() {
		const ccsss = C_dS_customCss.getByType(resaclass, csstype);
		const labels = [], order = [];
		
			// const d = '<span style="font-size:80%; font-weight:bold;">&nbsp;(*'+C_XL.w('default')+')</span>';
				const dflt = C_XL.w('default');
				const di = '<div style="font-size:1.4em; line-height:1em;" class="fas fa-map-marker-plus"></div>'; // default icon
			const d = '<span style="font-size:80%;" class="mob-txt-blue">'+'&nbsp;&nbsp;'+di+'&nbsp;'+dflt+'</span>';
			const da = mobminder.account.defaultCcss(csstype,resaclass);
		
		const ctrlshift = function(ds) {
			const cs = ds.ctrlshift; // not a joke
			let ctrlshift = '';
			if(cs&1) ctrlshift += '&nbsp;Ctrl';
			if(cs&2) ctrlshift += '&nbsp;Shift';
			const kb = cs ? '&nbsp;&nbsp;<div style="color:orange;" class="fas fa-keyboard"></div>':'';
			return kb+'<span style="font-size:80%; color:orange;">'+ctrlshift+'</span>';
		}
		
		for(let id in ccsss) if(id!=0) { // id's == 0 are the defaults css
			const css = ccsss[id]; // dS_customCss instance
			const bullet = css.mbullet(bcss);
			labels[id] = bullet+css.name+ctrlshift(css); 
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
C_dS_sms.getImgCss = function() { return {image:'sms', duotone:'blue', body:'left', borders:'mmborder-green'} } // used as symbol for the SMS, is a faws item // see (*faw01*)
C_dS_sms.mediumname = function() { return C_XL.w('sms')+'<div style="padding-left:1em;" class="fad fa-mobile fa-2x"></div>'; }



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
	if(!C_dS_email.registers.resa[resaId]) return false; // see where this is treated (*ml02*)
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
C_dS_email.getImgCss = function() { return {image:'envelope-open-text', duotone:'lime', body:'left', borders:'mmborder-green'} } // used as symbol for the e-mails // see (*faw01*)
C_dS_email.mediumname = function() { return C_XL.w('email')+'<div style="padding-left:1em;" class="fad fa-laptop fa-2x"></div>'; }


	////////////////  N O T I F I C A T I O N S 

function C_dS_notification(p) {
	C_dS_trackingCC.apply(this,p);
	C_dS_notification.defaults.mergeto(this,p,this.tmc);
	C_dS_notification.registers.add(this, 'resa', this.reservationId, this.templateId, this.resourceId);
}
C_dS_notification.defaults = new A_df( { reservationId:0,templateId:0,resourceId:0,sendStamp:0,title:'',message:'',recipientId:0,sender:'',status:0,statusChangeStamp:0 } );
C_dS_notification.registers = new C_registers('resa'); 
C_dS_notification.prototype = {
	title: function() { return this.mailsubject; },
	message: function() { return this.mailbody; }
}
C_dS_notification.getImgCss = function() { return {image:'mobile', duotone:'blue-lime', body:'left', borders:'mmborder-green'} } // used as symbol for the notifications // see (*faw01*)
C_dS_notification.mediumname = function() { return C_XL.w('notification')+'<div style="padding-left:1em;" class="fad fa-bell-on fa-2x"></div>'; }



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





	////////////////  reservations that are in the process of online booking

function C_dS_prebooking(b,p) {
	C_dS_prebooking.defaults.mergeto(this,p);
	C_dS_prebooking.registers[b].add(this.reservationId,this.id,this);
}
C_dS_prebooking.defaults = new A_df( { id:0,groupId:0,reservationId:0,delay:0 } );
C_dS_prebooking.registers = new C_regS('plitems');
C_dS_prebooking.get4resa = function(reservationId) { 
	let dSets = C_dS_prebooking.registers.plitems.get(reservationId);
	let dS = false;
	for(let id in dSets) dS = dSets[id]; // this would keep the last one but in practice there is never more than one prebooking on a reservation
	return dS;
};
(C_dS_prebooking.flush = function() {
	C_dS_prebooking.registers.flush();
})();


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
			for(let id in perfs) 
				if(perfs[id]) // some login view might be defined that make this performance invisible to this login, because not identified as an expert
					pnotes.push(perfs[id].note);
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
	
	v.iban = mobminder.account.ePayBenefIBAN; 
	v.benef = mobminder.account.ePayBenefName; 
	v.bill = dS_resa.billamount;
	v.paid = dS_resa.getpaidsum();
	v.remains = dS_resa.billamount-v.paid;
		v.bill = C_iEDIT.ergoprice(v.bill); // turns cents into € or $ units
		v.paid = C_iEDIT.ergoprice(v.paid);
		v.remains = C_iEDIT.ergoprice(v.remains);
	v.sepaqr = '[QRcode]';
	
	
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
	isEnabled: function(dS_resa, rscId) { // according to past user preset or automatic presets settings
		
		// assess is enabled by setup
			let autosend = this.isautosend(dS_resa); // [0,1] is it default enabled or disabled as per template config setup
			let notbyme = 1; // this.notbyme(rscId); // [0 = do not send, 1 = the surfer is not the addressee of the message or notbyme is not active]
		let enabled = autosend*notbyme;
		
		// assess if user has intentionally changed the setup setting
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
		C_dS_resource.del(this.id); // we need to clean up any earlier registration, or that will keep erroneous past prints that pops up through C_dS_resource.plus() list
		C_dS_resource.registers.id.add(this.id, this);
		C_dS_resource.registers.typeId.add(this.resourceType, this.id, this);
		
		if(this.guideId) C_dS_resource.registers.bygdl.add(this.guideId, this.id, this);
		C_dS_resource.instances++;
	} else {
		C_dS_resource.defaults.apply(this); // new object
	}
	
	// méta data
	this.xmon = new Array();
};
C_dS_resource.prototype = { // returns false or { dayIn:, hourly:, shadows:, tboxes:, offday:, daycode:, weekcode: }
	schedule: function(date) { // returns the active hourly at given date, see (*hl01*) in planning.js
		let hourly = false, stamp = date.stamp(), dayIn = 0, breakfor = false;
		const chrono = C_dS_hourlyuser.chrono(this.id); // hourly users in chronological order
		for(let x in chrono) { // there is an identical kind of scanning here (*sh03*), for the search engine
			const c = chrono[x]; // which is a structure like {huser:hourlyuser, hourly:hourlyuser.hourly(), dayin:dayIn}
			if(c.hourly) {
				if(c.hourly.periodicity==0) if(c.dayin==stamp) breakfor = true; else continue; // we skip here exceptional hourlies unless they are right on date == dayIn
				if(stamp<(c.dayin|0)) break; // the client date stamp happens before the dayIn of this chrono[x], so this hourly change is in the future. Let's stop there and keep the right previous value
				hourly = c.hourly;
				dayIn = c.dayin;
				if(breakfor) break; // case of an exceptional hourly right on dayIn !
			} else {
				console.log(c); // see (*sh05*) // in the past, it was apparently possible to set up a huser that points to an hourly that was delete.
			// try this :
			// select hourliesusers.id, hourliesusers.created, hourliesusers.creator, hourliesusers.hourlyId, FROM_UNIXTIME(dayIn) as DAYIN from hourliesusers left join hourlies on hourliesusers.hourlyId = hourlies.id
			// where hourliesusers.hourlyId <> 0 and hourlies.id is null order by hourliesusers.created desc;
			}
		}
		if(!hourly) return { dayIn:0, hourly:C_dS_hourly.get(0), shadows:false, tboxes:false, offday:false, daycode:false, weekcode:false }; 
		hourly = hourly.scope(date); // { hourly:, shadows:, tboxes:, offday:, daycode:, weekcode: }; // shadows:[shadowId] = o_dS_shadow
		hourly.dayIn = dayIn;
		return hourly; // { dayIn:, hourly:, shadows:, tboxes:, offday:, daycode:, weekcode: }; // that is a date with its related hourly
		
	},
	getrscname: function(o) { o = o || {bullet:true}; if(o.bullet) return this.rbullet()+this.name; else return this.name; },
	rbullet: function() {
			const color = ' c'+this.color; // grayed when no color is chosen
			const tag = this.tag?' '+C_iSKIN.tagcss(this.tag):'';
			const inner = this.tag?'':'&nbsp;';
		const bullet = '<div style="display:inline-block;" class="bullet resource'+tag+color+'">'+inner+'</div>';
		return bullet;
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};
C_dS_resource.defaults = new A_df( { resourceType:2,name:'new resource',color:152,tag:0,reservability:0,offsetBefore:0,offsetAfter:0,displayOrder:0,note:'',signature:'', sendComms:1, guideId:0 } );
(C_dS_resource.reset = function() {
	C_dS_resource.registers = new C_regS('id', 'typeId', 'bygdl');
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
		let tag = rsc.tag?'<div class="'+C_iSKIN.tagcss(rsc.tag)+'" style="font-size:1.25em; line-height:60%; width:1.5em;"></div>':'';
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
C_dS_guidelines.prototype = {
	findusers: function() { // returns an array like [rscid:rscname] showing what dS_resource are making use of this C_dS_guidelines
		let out = [];
		const rscs = C_dS_resource.registers.bygdl.get(this.id); // find resources associated with the current guidelines
		for(let rscid in rscs) {
			const dS_resource = rscs[rscid];
			out[rscid] = dS_resource;
			// console.log('findusers for guideline '+this.name+': '+rscid+' / '+dS_resource.name);
		}
		return out; // an array like [rscid1:rscname1, rscid2:rscname2]
	},
	usernames: function() {
		let namesrr = [];
		const users = this.findusers();
		if(users.length) {
			for(let rscid in users) {
				namesrr.push(users[rscid].name); // packing up the names
			}
			return '<span style="font-size:smaller; opacity:.7">( '+namesrr.join(', ')+' )</span>';
		} else {
			// there is no user so far for this guideline
			return '<span style="font-size:smaller; opacity:.8" class="orange">( '+C_XL.w('backprefs guidelines not assigned')+' )</span>';
		}
	}
}
C_dS_guidelines.plus = function() {
	this.genome = {};
	
	// generic interface to C_iPLUS
	this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.supervisor);
	this.eid = '_wrk';
	this.list = function() {
		let labels = [], order = [];
		let register = C_dS_guidelines.register.id.get();
		for(let id in register) {
			const dataset = register[id];
			const rscusers = dataset.usernames(); // an array like [ rscid:'agenda name' ]
			labels[id] = dataset.name+' '+rscusers; 
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
	let labels = {};
		const register = C_dS_guidelines.register.id.get();
		for(let x in register) {
			const dS_guideline = register[x];
			labels[register[x].id] = dS_guideline.name+' '+dS_guideline.usernames();
		}
	let order = new Array(); for(let x in labels) order.push(x);
	
	// sort
	const sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	
	// sets the none option at the top of the list
	labels[0] = C_XL.w('no guideline');
	order.unshift(0); // places option value 0 at the start of the list order[0]
	
	const count = order.length;
	
	return { order:order, labels:labels, presets:{}, count:count };
}
C_dS_guidelines.getname = function(id) { 
	const i = C_dS_guidelines.register.id.get(id);
	if(i) return i.name; else return '';
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
			const tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			const inner = this.tag?'':'&nbsp;';
		return '<div style="display:inline-block;" class="bullet tboxing '+tag+this.cssName+'">'+inner+'</div>';
	},
	tbtip: function(ci, co, o = {vertical:false} ) {
		
		const flex = 'display:flex; align-items:center; justify-content:center;';
		const tagfacss = this.tag ? C_iSKIN.tagcss(this.tag) : '';
		
		let i1 = '',i2 = '',i3 = '', css = '';
		if(o.vertical) {
			
			let infoarray = [];
			if(this.name) infoarray.push('<div style="width:100%; text-align:center; font-size:90%; word-wrap:break-word;">'+this.name+'</div>');
			if(this.tag) {
				const tag = '<div style="margin:0 auto;" class="fa fa-13x '+tagfacss+' centered">'+'</div>';
				infoarray.push(tag);
			}
			if(this.note) infoarray.push('<div style="text-align:left; font-size:80%; word-wrap:break-word;">'+this.note+'</div>');
			
			i1 = '<div class="timebox-tip-v-top">'+timeOBS(ci)+'</div>';
			i2 = '<div class="timebox-tip-v-middle">'+infoarray.join('<hr/>')+'</div>';
			i3 = '<div class="timebox-tip-v-bottom">'+timeOBS(co)+'</div>';
			css = ' tip-vertical';
			
		} else { // horizontal
		
			const name = this.name? '<div style="'+flex+' font-size:90%;">'+this.name+'</div>' :'';
			const note = this.note? '<div style="'+flex+' font-size:80%;">'+this.note+'</div>' :'';
			const tag = this.tag?'<div style="'+flex+' width:4em; text-align:center;" class="fa fa-13x '+tagfacss+'">'+'</div>':'';
			
			i1 = '<div class="timebox-tip-h-left">'+timeOBS(ci)+'</div>';
			i2 = '<div class="timebox-tip-h-center">'+name+tag+note+'</div>';
			i3 = '<div class="timebox-tip-h-right">'+timeOBS(co)+'</div>';
			css = ' tip-horizontal';
		}
		
		return '<div class="timebox-tip-div'+css+'">'+i1+i2+i3+'</div>';
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
C_dS_timebox.drop1 = function(tbid) {
	let item = C_dS_timebox.get(tbid); C_dS_timebox.registers.del(item);
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
// var shadow_block = 	2; // unused ? remove me
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
C_dS_shadow.get4Hourly = function(hourlyId, daycode, one) {
	let dS_shadow = 0; // may be there is not shadow at all
	if(hourlyId==0) return dS_shadow;
	let shadows = C_dS_shadow.registers.hourly.get(hourlyId, daycode);
	if(one) {
		for(let id in shadows) return dS_shadow  = shadows[id];
	} else 
		return shadows; // an array like [id1:dS_shadow1, id2:dS_shadow2, id3:dS_shadow3, ... ] 
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
	C_dS_hourly.registers.byid.add(this.id, this); // prepares an indexed register where it is easy to fetch objects from
	
	// meta data
	this.is = { exceptional:(this.periodicity==0) }; // exceptional hourly, valid only on a single calendar day.
	this.shadowsreg = false;
	this.tboxesreg = false;
	this.offdays = false;
	this.first = new Array(); // first shadow, like first[daycode] = shadow
	this.last = new Array(); // last shadow, like last[daycode] = shadow
	this.link(); // binds shadows and time-boxes in a concatenated bi-directional way (using .next and .previous). Useful for anti-overlapping check
};
C_dS_hourly.defaults = new A_df({name:'default hourly',monday:0,periodicity:1,note:'',colorOff:132,colorExcp:0,colorAbsent:152});
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
		const daycode = this.dayCode(date); // daycode may range [0-6], [0-13], [0-20] or [0-27]
		const isoffday = this.offdays[daycode];
		const weekcode = 1+((daycode-1)/7)|0;
		const sreg = this.shadowsreg ? this.shadowsreg[daycode] : new Array();
		const treg = this.tboxesreg ? this.tboxesreg[daycode] : new Array();
		return { hourly:this, shadows:sreg, tboxes:treg, offday:isoffday, daycode:daycode, weekcode:weekcode }; // shadows:[shadowId] = o_dS_shadow
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
		let defaults = new A_df( {exceptional:true, periodics:true, exclude:false } );
	options = defaults.align(options);		

	let labels = {};
	let hourlies = C_dS_hourly.registers.byid.get();
	for(let id in hourlies) {
		let hourly = hourlies[id];
		if(options.exclude!==false) if(hourly.id==options.exclude) continue;
		if(!options.exceptional) if(hourly.periodicity==0) continue;
		if(!options.periodics) if(hourly.periodicity!=0) continue;
		labels[id] = hourly.hbullet()+' '+hourly.name;
	}
	let order = new Array(); 
	for(let hid in labels) if(hid|0) order.push(hid); // order[0] = 125654 ( a C_dS_hourly id )
	let sortrule = function(a,b) { return (hourlies[a].name>hourlies[b].name)?1:-1; }; order.sort(sortrule);
	order.push(0); // puts the default hourly at the end of the list
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
	
		// first round: we collect the distinct hourlies that are used by this resource
		while(huser) {
			let hourly = huser.hourly();
			// !hourly should never happen, PVH2025 fixed code and DB to clean up cases
			if(!hourly) warning('dataset.js','C_dS_hourly','plus','hourly user '+huser.id+' makes reference to undefined hourly Id:'+huser.hourlyId );
			
			let id = hourly.id; if(id in labels) { huser = huser.next; continue; } // do not display twice the same hourly (that covers the bridges also)
			if(hourly.periodicity==0) { huser = huser.next; continue; } // do not display exceptional days in this C_dS_hourly.plus list
	
			labels[id] = hourly.hbullet()+' - '+hourly.name
			if(verboseOn) labels[id] = id+' '+labels[id];
			order.push(id);
			huser = huser.next;
		} // now we have labels:labels and order:order
	
		// second round: let's identify the running hourly
		let recurring = '<div class="mob-txt-blue fas fa-sync fa-13x" style="padding:0 .8em 0 .8em;"></div>'+'<span class="mob-txt-blue">'+C_XL.w('current schedule')+'</span>';
		let today = new Date(); today = today.toMidnight().stamp();
		
		huser = C_dS_hourlyuser.first(this.genome.rscid);
		while(huser) {
			let hourly = huser.hourly();
			// !hourly should never happen, PVH2025 fixed code and DB to clean up cases
			if(!hourly) warning('dataset.js','C_dS_hourly','plus','hourly user '+huser.id+' makes reference to undefined hourly Id:'+huser.hourlyId );
			
			let ongoing = '';
			let nn = huser.nexton({periodic:true}); // pp is the first previous change to a periodic hourly
			
			// if(hourly.periodicity==0) continue; // we are interested in identifying the running recurrent hourly ( they have .periodicity > 0 )
			let id = hourly.id; // do not display twice the same hourly (that covers the bridges also)
		
			if(nn) {
				let dayOut = nn.dayIn;
				if( (huser.dayIn <= today) && (dayOut > today) ) ongoing = recurring; // there is another later hourly change, but we are in the period where this hourly is running
			} else {
				if(huser.dayIn <= today) ongoing = recurring; // there is no next hourly, so this hourly id is still running today
			}
			labels[id] += ongoing;
			huser = huser.next; // watch the position of this statement
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
	let rscId = this.groupId; // C_dS_hourlyuser groups to a C_dS_resource
	
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
					if(h.periodicity==0) prevhuser = prevhuser.prev; // skip this non periodic hourly switch
					else return prevhuser; 
				}
			}
			return false;
		} 
	},
	nextonOBSO: function(options) { // options like { periodic:true, exclude:hourlyId }, if both are set, this function returns the next hourly user having alternative hourlyId 
		if(!options) return this.next; 
		if(options.periodic) { // return the first periodic hourly, or false if none
			// this.loghourlyusers();
			let nexthuser = this.next;
			while(nexthuser) {
				let h = nexthuser.hourly();
				if(!h) { nexthuser = nexthuser.next; continue; }
				if(h.periodicity==0) nexthuser = nexthuser.next; // skip this non periodic hourly switch
					else if(options.exclude==nexthuser.hourlyId) nexthuser = nexthuser.next; // skip this periodic hourly switch to hourlyId
						else return nexthuser;
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
				let skip = false;
				let h = nexthuser.hourly();
				if(!h) skip = true; // this should never happen, but I found 2 cases in the DB in 2025, see (*sh05*)
				else if(h.periodicity==0) skip = true; // skip this non periodic hourly switch
					else if(options.exclude==nexthuser.hourlyId) skip = true; // skip this periodic hourly switch to hourlyId
				if(skip) nexthuser = nexthuser.next;
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
C_dS_hourlyuser.plus = function(rscid, timeframe) { // shows all hourly changes (including exceptional days) for a given resource
	this.genome = {rscid:rscid};
	
	// timeframe can be [  ]
	
	// generic interface to C_iPLUS
	this.plusmay = false;
	this.eid = '_husr';
	this.list = function() {
		let labels = [], order = [];
		let huser = C_dS_hourlyuser.first(this.genome.rscid);
		let hourly, id, datein, pp;
		let recurring = '<div class="mob-txt-blue fas fa-sync fa-13x" style="padding:0 .8em 0 .8em;"></div>'+'<span class="mob-txt-blue">'+'</span>';
		let exceptional = '<div class="mob-txt-lime fas fa-chevron-double-left fa-13x" style="padding:0 .6em 0 .8em;"></div>'+'<span class="mob-txt-lime">'+C_XL.w('today')+'</span>';
		let today = new Date(); today = today.toMidnight().stamp();
		let isexceptional = 0, isongoing = 0;
		
		while(huser) {
			id = huser.id;
			hourly = huser.hourly();
			datein = new Date(huser.dayIn*1000);
			
			let outofscope = false;
			switch(timeframe) {
				case 'future': if(today>=huser.dayIn) outofscope = true; break; 
				case 'past': if(huser.dayIn>=today) outofscope = true; break;
				case 'today': if(!(huser.dayIn==today)) outofscope = true; break;
			}
			if(outofscope) { huser = huser.next; continue; } // else go on and do the function job
			
			pp = huser.previous({periodic:true}); // pp is the first previous change to a periodic hourly
			if(pp) if(pp.hourlyId == hourly.id) { huser = huser.next; continue; } // that is a comeback to the previous periodic hourly, do not display in list
			
			
			if(hourly.is.exceptional && huser.dayIn == today) { // champagne! today is the day of an exceptional hourly day
				isexceptional = id;
			} else if(!hourly.is.exceptional) {
				// recurring hourly
				let nn = huser.nexton({});
				if(nn) {
					let dayOut = nn.dayIn;
					if( (huser.dayIn <= today) && (dayOut > today) ) {
						isongoing = id; // there is another later hourly change, but we are in the period where this hourly is running
					}
				} else {
					if(huser.dayIn <= today) {
						isongoing = id; // there is no next hourly, so this hourly id is still running today
					}
				}
			}
		
			labels[id] = datein.sortable({y:true})+' '+hourly.hbullet()+' '+hourly.name;
			if(verboseOn) labels[id] = id+' '+labels[id];
			order.unshift(id);
			huser = huser.next; // watch the position of this statement
			
		}
		
		if(isongoing) labels[isongoing] += recurring;
		if(isexceptional) labels[isexceptional] += exceptional;
		
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
(keysbank.reset = function() { // of the register profile (tree), we now create multiple banks (instances, or roots)
	keysmem = { config:new keysbank(), logged:new keysbank(), amanagers:new keysbank(), autocomp:new keysbank() // are banks, autocomp is for searching for connections
		,flush: function(which) { 
			if(which) return keysmem[which] = new keysbank();
			else for(m in this) if(this[m] instanceof keysbank) this[m] = new keysbank();
			return; } };
})();

function C_dS_login(b,p) {
	this.bank = b;
	C_dS_trackingCCD.apply(this,p);
	C_dS_login.defaults.mergeto(this,p,this.tmc); // this.tmc = tracking members count, belongs to C_dS_trackingCCD
	
	if(this.mobile) if(this.mobile[0]!='0') this.mobile = '+'+this.mobile; // because we do not store millions of identical (and meaningless) + in the DB and because mobile so are ints in the DB
	this.namefull = this.firstname+' '+this.lastname;
	this.name = this.firstname[0]+'. '+this.lastname; // use C_dS_login.lname to access bullet display
	
	if(this.id <= 0) return;
	
	
	keysmem[b].loginid.add(this.id, this);
	keysmem[b].byacclvl.add(this.accessLevel, this.id, this);
	
	// meta data
	this.xmon = new Array();
	
};
C_dS_login.defaults = new A_df({
		accessLevel:0,   // range, see (*av01*)
		permissions:0, login:'', password:'', taycan:'', GMT:3600, weeknumb:0,
		lastLogin:'',
		gender:1, firstname:'', lastname:'', company:'', 
		residence:'', address:'', zipCode:'', city:'',
		country:'', email:'', mobile:'', phone:'', language:0, profession:808, note:'', color:0, tag:0,
		notbyme:1, secretarypopups:0,
	eresaIdentMode:0, eresaFillingMode:99,
		seoIndexable:1, seoMetaTitle:'', seoMetaDescr:'', seoMetaCanon:'', seoComment:'', 
	eresaTitle:'', eresaUrl:'', eresaMax:1, eresaLimit:0, eresaBefore:9472539, eresaWithAMPM:1, eresaSameday:1, eresaAllowNote:1, 
	eresaSignin:1, eresaCancel:0, eresaAggregate:0, eresaRescType:0, eresaSkin:'',
	eresaNote:'', eresaHourlies:'', eresaDirections:'', eresaDirLabel:'', eresaDirUrl:'', 
	eresaWorkcodes:'', eresaLink1label:'', eresaLink1url:'', eresaLink2label:'', eresaLink2url:'', eresaPalette:'', 
	eresaFontTitle:'', eresaFontText:'', eresaCcss:'', eresaAuthent:0, eresaBlacklist:0,
	syncwhat:1, syncTrescs:1, syncTvisis:1, syncTresas:1, soundsVolume:8, locked:0,
	decision:0, aienabled:0
	});
C_dS_login.prototype = { 
	
	invoicertag: '<div style="" class="mob-txt-blue fa fa-13x fa-file-invoice-dollar"></div>',
	decisiontag: '<div style="" class="mob-txt-lime fa fa-15x fa-chess-king"></div>',
	noway: '<div style="box-shadow:0px 0px 1px 2px red; border-radius:50%; background-color:orangered; color:white" class="fa fa-13x fa-minus-circle"></div>',
	warning: '<div style="" class="yellow fa fa-13x fa-sensor-alert"></div>',
	getKeys: function() {
		return C_dS_accesskey.get(this.bank, this.id);
	},
	lclone: function() {
		let son = new C_dS_login(this.bank);
		son.id = 0; son.groupId = this.groupId;
		for(let field in C_dS_login.defaults) son[field] = this[field];
		return son;
	},
	lname: function(options) { // returns login name, options like { bullet:1 } or { bullet:{css:'small'} }
		options = options || {}; // { bullet:{css:'' }};
		
			let pad = '&nbsp;&nbsp;';
		let l = ''; if(options.showlocked) l = this.locked ? pad+this.noway : ''; 
		let w = ''; if(options.showweak) w = this.checkcredentials() ? '' : pad+this.warning;
		let d = ''; if(options.showdecision) if(mobminder.context.surfer.is.atleast.seller) if(this.decision) d = pad+this.decisiontag;
		let i = ''; if(options.showdecision) if(mobminder.context.surfer.is.atleast.seller) if(this.permissions & pc.sees_invcs) i = pad+this.invoicertag;
		
		let n; switch(this.accessLevel) {
			case aLevel.eresa: n = this.eresaUrl+l; break;
			case aLevel.synchro: n = this.company+' '+this.namefull+l+w; break;
			default: n = this.namefull+l+w+d+i; // humans
		}
		
		let b = ''; if(options.bullet) b = this.lbullet(options.bullet.css?options.bullet.css:'')+' ';
			
		return '<div style="display:inline-block; white-space:nowrap;">'+b+n+'</div>';
	},
	ltip: function(options) { // returns login name, options like { bullet:1, adminview:[true/false] } or { bullet:{css:'small'} }
		options = options || {}; // { bullet:{css:'' }};
		let i = '', n = ''; // header icon for webpages, and name
		let iseresa = this.accessLevel==aLevel.eresa;
					let fn = this.firstname;
					let ln = this.lastname;
				let lockedtxt = fn+' '+ln+' '+C_XL.w('bp locked', {cap:false});
				if(iseresa) lockedtxt = C_XL.w('disabled webpage');
			let locked = '<div>'+'<div style="display:inline-block; width:3em; text-align:center;">'+this.noway+'</div>'+' '+lockedtxt+'</div>';
			let warning = '<div>'+'<div style="display:inline-block; width:3em; text-align:center;">'+this.warning+'</div>'+' '+C_XL.w('weak credentials')+'</div>';
		let l = ''; if(options.showlocked) l = this.locked ? locked : ''; 
		let w = ''; if(options.showweak&&!iseresa) w = this.checkcredentials() ? '' : warning;
		let wl = ''; if(l||w) wl = '<div style="margin:.8em 0; line-height:2em;">'+l+w+'</div>';
		
		switch(this.accessLevel) {
			
			case aLevel.synchro:
				n = '<div><strong>'+this.firstname+'</strong></div>'+'<div>'+this.company+'</div>';
				n += '<div>'+this.lastname+'</div>';
				n += '<div>'+C_iEDIT.ergophone(this.phone,2)+'</div>';
				n += '<div>'+C_iEDIT.ergophone(this.mobile,3)+'</div>';
				n += '<div>'+this.email+'</div>';
				i = '<div style="text-align:right;">'+'<div style="display:inline-block;" class="fa fa-server fa-15x mob-txt-gray_m">'+'</div>'+'</div>'; // header icon for webpages
				break;
				
			case aLevel.eresa:
				n = '<div><strong>'+this.firstname+'</strong></div>'+'<div>'+this.lastname+'</div>';
				i = '<div style="text-align:right;">'+'<div style="display:inline-block;" class="fa fa-globe fa-15x mob-txt-gray_m">'+'</div>'+'</div>'; // header icon for webpages
				n += '<div style="padding:1em 0;">'+' ('+this.url()+')'+'</div>';
				break;
				
			default: // humans
				let b = ''; // header icon for people
				if(options.bullet) b = this.lbullet(options.bullet.css?options.bullet.css:'')+' ';
				n = '<div class="bold">'+b+this.namefull+'</div>';
				
					let p = this.profession; // default value 808
					let o = new C_iPRO.options();
				let pd = o.labels[p]; // according to definition here (*pr01*)	
				n += '<div style="margin-bottom:.5em;">'+pd+' '+this.company+'</div>';
				
				if(options.adminview) { // add more private info to the tip
					n += '<div>'+C_iEDIT.ergophone(this.phone,2)+'</div>';
					n += '<div>'+C_iEDIT.ergophone(this.mobile,3)+'</div>';
					n += '<div>'+this.email+'</div>';
				}
		}
		return '<div style="">'+i+n+wl+'</div>';
	},
	lbullet: function(cssmore) {
		
			if(this.accessLevel<=aLevel.eresa) return ''; // webpages and machines
		
			let css = this.lcss(); if(cssmore) css += ' '+cssmore;
		let bullet = '<div style="display:inline-block; font-weight:normal;" class="bullet login '+css+'">'+this.initials()+'</div>';
		if(!this.color&&!this.tag) return bullet;
		if(this.tag) {
			let tag = C_iSKIN.tagcss(this.tag);
			bullet = '<div style="display:inline-block;" class="bullet login fa-15x '+tag+' '+css+'"></div>';
		}			
		return bullet;
	},
	url: function(key) {
		let url = '';
		switch(this.accessLevel) {
			case aLevel.synchro: // jumps to the api specification related to this login authorisation
				// url = uriencode('https://api.mobminder.com/documents/specifications.php?lgn='+this.login+'&pwd='+this.password+'&kid='+key+'&web=1');
				url = 'https://api.mobminder.com/documents/specifications.php'
					  + '?lgn=' + encodeURIComponent(this.login)
					  + '&pwd=' + encodeURIComponent(this.password)
					  + '&kid=' + encodeURIComponent(key)
					  + '&web=1';
				break;
			case aLevel.eresa: // opens a webpage in the next tab
				url = 'https://booking.mobminder.com/'+this.eresaUrl;
				break; 
			default: // connect a human login to the webapp
				url = 'https://login.mobminder.com/'+mobminder.account.id+'/'+this.id+'/'+key;	
		} 
		if(vbs) {
			// this second set is for opening the same links in the dev environment, vbs is global mutex that can be set in mobframe.js
			
			switch(this.accessLevel) {
				case aLevel.synchro: // jumps to the api specification related to this login authorisation
					// url = 'http://localhost/app05/htdocs/smart/specs/api.php?lgn='+this.login+'&pwd='+this.password+'&kid='+key+'&web=1';
					url = 'http://localhost/app07/mobminder/htdocs/api/documents/specifications.php'
					  + '?lgn=' + encodeURIComponent(this.login)
					  + '&pwd=' + encodeURIComponent(this.password)
					  + '&kid=' + encodeURIComponent(key)
					  + '&web=1';
					break;
				case aLevel.eresa: // opens a webpage in the next tab
					url = 'http://localhost/app07/booking/'+this.eresaUrl;
					break; 
				default: // connect a human login to the webapp
					url = 'http://localhost/app07/htdocs/index.php?aid='+mobminder.account.id+'&lid='+this.id+'&kid='+key;
			} 			
		}

		return url;
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
	lcss:function() { return this.color?'c'+this.color:'c200'; },
	nickname:function() { return this.firstname[0]+(this.firstname[1]?this.firstname[1]:'')+this.lastname[0]+(this.lastname[1]?this.lastname[1]:'') },
	initials:function() { return this.firstname[0]+this.lastname[0] },
	languageabr: function() {
		let lc = this.language;
		let abr; // we default to english
		switch(lc|0) {
			case 0: case 1: case 3: case 6: 
			abr = mobminder.language.abr[lc];
			break; 
			default: abr = 'en';
		}
		return abr;
	},
	checkcredentials: function() { // see (*cr12*)
		// note that this function is not the one used when typing in the field. see (*cr03*) for rules while editing of the fields.
		let lok = !!this.login; // arrives as phi when valid
		let pok = !!this.password; // arrives as delta when valid
		let different = this.login != this.password; // if empty, we consider it ok
		let valid = lok && pok && different;
		return valid;
	},
	restore: function(key, l, p) {
		if(this.bank=='config'||this.bank=='logged') {
			this.login = this.xorDeobfuscateUtf8(l,key); // see (*cr50*)
			this.password = this.xorDeobfuscateUtf8(p,key);
			this.taycan = 'R00000';
		}
	},
	xorDeobfuscateUtf8: function(b64, key) { // see (*cr50*)
		key = String(key);
		
		// console.log('|'+b64+'| ('+key+')');
		
		const bin = atob(b64); //  binary string, 1 char = 1 octet (0–255)
		const kLen = key.length;
		const bytes = new Uint8Array(bin.length);

		for (let i = 0; i < bin.length; i++) {
			const b = bin.charCodeAt(i) ^ key.charCodeAt(i % kLen);
			bytes[i] = b; // original byte
		}

		// packing up the UTF-8 chars sequence into a js string
		return new TextDecoder('utf-8').decode(bytes);
	}
	
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
C_dS_login.amanager = function() { // returns the right account manager for this account, based on business strategy (this piece of code must be maintained)
	let dS = false; 
	let def = C_dS_login.amanager.defaults(); 
	// let ams = keysmem['amanagers'].byacclvl.get(aLevel.seller);
	
	let r = keysmem['amanagers'].byacclvl;
	let ams = r.get(aLevel.admin);
	for(let id in ams) dS = r.get(aLevel.admin,id); // admin is the fallback, should normaly be overrided by a regular seller
		
		ams = r.get(aLevel.seller);
		
	for(let id in ams) { // here we setup some priorities, according to callcenter wallets and destination of the login (e.g. Wizard Source Duplication)
		let am = ams[id];
	
		switch(id|0) {
			case 13119: // Wizard Duplication
			case 8797: // Mob closed accounts
			case 8840: // Alain Rogister
			case 7874: case 9085: // Bernard
			case 14998: // Dietplus Test
			case 9089: // Dentadmin Steven Aertsen
			case 8925: // Jacob Amzel
				continue; // all accounts in those wallets have another AM, so we skip and select the other one
			
			case 9090: // Kristof Clevers
			case 7896: // Axel Boven
			case 9086: // Kamal
			case 9719: // Nabil Hafsa ( Tunisie )
				dS = def.jonas; continue; 
			
			case 11641: //Oxteo
			case 20317: // Michaël Faufra
				dS = def.pierre; continue;
			
			case 9087: // mob recycle
			case 8818: // Spit up
			case 8914: // Philippe Orban
			case 9859: // Médiconsult
			case 8350: // Burogest
			case 7918: // Wizard Admin
			
			case 17558: // ASDW
			case 14693: // SSBSanté
			case 20382: // Dentistes en ligne
			case 14286: // Médinect
			case 14191: // Toubipbip
			case 14036: // Spitup
			case 22221: // IITS
			case 8330: // Burogest
				dS = def.keevin; continue;
			
			case 8820: // Kate Barthel
				dS = def.giraud; continue;
				

		}
		dS = r.get(aLevel.seller,id);
	}
	if(!dS) dS = def.keevin; // keevin is the absolute default
	return dS;
} 
C_dS_login.amanager.defaults = function() {
	
				let giraud = C_dS_login.defaults.array({firstname:'Giraud', lastname:'Derlet', email:'giraud@mobminder.com', mobile:'32474374779'}); // definition of A_df.array() see (*df02*)
			let members = C_dS_trackingCCD.tnew(0, mobminder.account.id).concat(giraud); // which is an array[] with all setup values and tracking
		giraud = new C_dS_login('amanagers', members);
		
			let keevin = C_dS_login.defaults.array({firstname:'Keevin', lastname:'Pierre', email:'keevin@mobminder.com', mobile:'32483371160'}); // definition of A_df.array() see (*df02*)
			members = C_dS_trackingCCD.tnew(-1, mobminder.account.id).concat(keevin); // which is an array[] with all setup values and tracking
		keevin = new C_dS_login('amanagers', members);
		
			let jonas = C_dS_login.defaults.array({firstname:'Jonathan', lastname:'Bardo', email:'jonathan@mobminder.com', mobile:'32472017763'}); // definition of A_df.array() see (*df02*)
			members = C_dS_trackingCCD.tnew(-2, mobminder.account.id).concat(jonas); // which is an array[] with all setup values and tracking
		jonas = new C_dS_login('amanagers', members);
		
			let pierre = C_dS_login.defaults.array({firstname:'Pierre', lastname:'Halut', email:'pierre@oxteo.com', mobile:'32477201860'}); // definition of A_df.array() see (*df02*)
			members = C_dS_trackingCCD.tnew(-3, mobminder.account.id).concat(pierre); // which is an array[] with all setup values and tracking
		pierre = new C_dS_login('amanagers', members);
		
	return { giraud:giraud, keevin:keevin, jonas:jonas, pierre:pierre };
};



var aLevel = {   // equivalent php, see (*av01*)
	synchro:3, eresa:4, operator:5, supervisor:6, manager:7, seller:8, admin:9,
	names: { 3:'al-synchro', 4:'al-eresa', 5:'al-operator', 6:'al-supervisor', 7:'al-manager', 8:'al-seller', 9:'al-admin' },
	name:function(aLevel) { return this.names[aLevel]; }
}

var permissions = { // permissions codes (is a bit map), see (*pn01*)
	codes: {
		none: 0, 
		
		// cr_ gives permission to create
		// op_ gives permission to open the item (see content)
		// ac_ gives permission to access
		// ch_ gives permission to change
		// dl_ gives permission to delete
		
		// usage
		op_resas:	1<<1, 	
		cr_resas: 	1<<0, cr_tasks: 	1<<2, cr_notes: 1<<3, cr_chats: 1<<4,
		ac_disprefs:1<<5, ac_stats: 	1<<6, ac_visis: 1<<7, ac_setup: 1<<8, ac_archv: 1<<12, 	ac_sfind: 1<<13,
		ch_hourly: 	1<<10, ch_calendar:	1<<11,  
		// op_resas:	1<<16, 	 // PVH 2025-03 see (*pn02*)
		
		sees_pairs:	1<<17, 	// sees logins that are at the same level of managment
		sees_invcs:	1<<18, 	// sees invoices linked to this account
		
		// config
		cr_bcals: 	1<<20, 	cr_ucals: 	1<<21, 	cr_fcals: 1<<22,
		cr_comm: 	1<<23, 	ch_comm: 	1<<24,
		cr_wrkc: 	1<<25, 	ch_wrkc: 	1<<26,
		cr_ccss: 	1<<27, 	ch_ccss: 	1<<28,
		cr_logins: 	1<<29, 	ch_logins: 	1<<30
		
		// Bulk set up of permission : SQL example
		//
		// update logins set permissions = permissions | 32; -- permission to display preferences
		// update logins set permissions = permissions | (1<<16); -- permission to open reservations
		//
		// update logins set permissions = permissions & ~32; -- permission to display preferences
		// update logins set permissions = permissions & ~(1<<16); -- permission to open reservations
		
		
		// select count(1) from logins;
		// select id, permissions from logins;

		// select * from logins where permissions & 1<<16 = 1<<16;
		// select * from logins where permissions & 1<<1 = 1<<1;
		// select * from logins where permissions & 1<<2 = 1<<2;
		// select * from logins where permissions & 1<<3 = 1<<3;

		// change the bit position of a given setting
		// -- update logins set permissions = permissions | 2 where permissions & 1<<16 = 1<<16;
		// -- update logins set permissions = permissions & ~(1<<16); -- clean up this permission bit
		
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
										+pc.ac_setup+pc.ac_archv+pc.ac_sfind+pc.cr_wrkc+pc.ch_wrkc+pc.cr_ccss+pc.ch_ccss+pc.sees_pairs; break;
										
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
}; var pc = permissions.codes;



///////////////////////////////////

function C_dS_loggable() {}; // Management of loggable humans and machines, uses the secondary bank 'config'
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
C_dS_loggable.plus = function(accessLevel) { // generic interface to C_iPLUS
	this.genome = {accessLevel:accessLevel};
	
	// this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.manager);
		// if(this.genome.accessLevel==aLevel.eresa) this.plusmay = (mobminder.context.surfer.accessLevel>=aLevel.seller);
		
	this.plusmay = permissions.may(pc.cr_logins);
	this.eid = '_lgn';
	this.count = function() { return keysmem['config'].byacclvl.ends(this.genome.accessLevel); }
	this.list = function() { // see (*lb01*)
		let labels = [], order = [], tips = [];
		let register = keysmem['config'].byacclvl.get(this.genome.accessLevel);
		for(let id in register) {
			let ds = register[id], label; // which is a dS_login
			let issameacclevel = mobminder.context.surfer.accessLevel == ds.accessLevel;
			let issamelogin = mobminder.context.surfer.id == ds.id;
			if(issameacclevel&&!issamelogin&&!permissions.may(pc.sees_pairs)) continue; // logins without the permission.codes.sees_pairs do not see logins of the same level as theirs
				label = ds.lname({bullet:{css:'small'}, showlocked:true, showweak:true, showdecision:true});
			if(verboseOn) label = ds.id+' '+label;
			tips[ds.id] = ds.ltip( {bullet:1, showlocked:true, showweak:true} );
			labels[ds.id] = label; order.push(ds.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order, tips:tips };
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
			dS_login = register[id];
			preset[id] = { tip:dS_login.ltip( { bullet:1} ) }; // this preset flows down to here (*cr01*)
			labels[id] = dS_login.lname(options); order.push(id);
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
		let bullet = key.account.abullet({ fit:'fit', warning:warnings[key.account.id]||0});
		// let aname = '<td style="width:18em; max-width:18em; overflow:hidden; white-space:nowrap;">'+bullet+'&nbsp;'+key.account.name+'</td>';
		let aname = '<div style="width:18em; max-width:18em; overflow:clip; white-space:nowrap; padding:1px 0 1px 3.6em;">'+bullet+'&nbsp;'+key.account.name+'</div>';
		// labels[id] = '<table style="display:inline-table; vertical-align:-4px;"><tr>'+aname+'</tr></table>';// bullet+aname+login+close
		labels[id] = ''+aname+'';// bullet+aname+login+close
		
			let tipbullet = key.account.abullet({});
			let tiptitle = '<p style="white-space:nowrap;">'+tipbullet+'<span style="white-space:nowrap; font-weight:bold">&nbsp;'+key.account.name+'</span></p>';
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
C_dS_accesskey.accounts = function(loginId) { // intended for a C_iMENU
	
	let order = new Array(), labels = {}, presets = {};
		let cfgreg = keysmem['config'].keybylogin.get(loginId);
	for(let keyid in cfgreg) {
		let key = cfgreg[keyid]; let accid = key.accountId; 
		let account = C_dS_group.get(accid); let bullet = account.abullet();
		
			let aname = '<div style="display:table-cell; width:17em; max-width:17em; overflow:hidden; white-space:nowrap;">'+bullet+'&nbsp;'+account.name+'</div>';
		labels[accid] = aname;
		
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
	this.ctlabels = function() { // returns translated labels
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
	
	// The height of graphical planning lines depends as well on the number of details selected from this collection, see (*lvl*)

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
	visicolor		: 1<<28, // 
	maxValue		: 1<<29, // there is room up to 64 bits
	bydefault		: 0	
}
details.bydefault = details.schedule+details.visitor+details.resanote+details.timeboxing;

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


C_dS_catalyst = function(p) { // grouped by keyId
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
};




function C_catalyst(genome) { // see (*cy01*) // this object is used by C_iARRAY, it makes the interface to the design of any C_dS

	// examples of genome classes include:
	// C_dS_visitorAlpha.catalyst
	// C_dS_reservation.catalyst
	// .. find a comprehensive list by searching cross file on .catalyst

	// genome is a C_dS_someclass for which C_iARRAY must display tables of items
	if(genome.finalize) genome.finalize(); // user setup dependant stuff are tuned in the class.catalyst object (e.g. C_dS_reservation.catalyst)
	for(let property in genome) { this[property] = genome[property]; } // inheritance of anything found in the genome catalyst, see (*ct17*) // find the list of imported properties here: (*cy01*)
	this.catalystname = this.genomec.name; // genome class //  (*msie01*)

	this.defview();
	let dS_catalyst = mobminder.context.acckey().catalysts.byClass.get(this.catalystname); // (*ct01*) retrieve preferences from table catalysts if ever recorded by the user
	if(dS_catalyst) { // in case a record was found, then replace the defaults with the user setting
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
	ctlabels: function(options) { // returns translated labels, used here (*ct19*)
		options = options || { abr:false, flat:false, csv:false, tip:false };
			let labels = new Array(), flatlabels = new Array();
			let prefix = this.xlprefix;
			let fallback = 'empty string';
			if(options.abr) prefix = prefix+'abr-'; if(options.csv) prefix = prefix+'csv-'; if(options.tip) prefix = prefix+'tip-';
			let foptions = this.foptions; // see (*ct18*) for an example of structured options for C_dS_reservation
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
				let combo = prefix+o; // e.g. visi-firstname or visi-abr-firstname or resa-tip-receivables that you should find in language.js
				labels[c][m] = combo;
				flatlabels[m] = combo;
			}
		}
		if(options.flat) return C_XL.w(flatlabels, {cap:1}, fallback); // uses the fallback feature of C_XL.w, see (*fb01*)
		return C_XL.w(labels, {cap:1}, fallback); // note the recursion (*xl02*)
	},
	cresta: function() { // options for C_iCRESTA instance, see C_iARRAY.fields
		let labels = this.ctlabels({flat:false});
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
			
		set = set || this.keys(); // if no subset is provided, then we base the sort on the full list
		// console.log('C_catalyst::sort() keys',set);
		let key = this.sorton.key;
		let order = this.sorton.order;
		let values = new Array(); 
		
		switch(key) { // here we fetch the values that are appropriate for sorting because in some cases, they are not the ones displayed
			
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
					let id = set[x]; 
					let o = this.dSuivalue(id,key); // see also (*ca01*)
					// o is an object like { c:1, t:'', v:{0:v}, d:{0:html} }
					// with count, type of data (text or numeric), values array or raw, and optional html display format
					// v: can be a raw value v:rawvalue or an set like { 0:rawvalue, 1:antohervalue, 2:again, ... } if multiple lines are displayed for this item
					// t: members type, see constructor of A_df (*df01*), is a double quote for strings (") and an empty string '' for numeric
					let v = o.v instanceof Object ? o.v[0] : o.v;
					if(o.t == '"') if(v) v = v.toLowerCase(); // this is only for the sorting process, the onscreen displayed value will be based on its id
					// if(o.t == '"') if(v) v = typeof v === 'string' ? v.toLowerCase() : v; // PVH 2025 bug reported by Giraud? but I can not reprodduce it so let's leave it like it is.
					values[id] = o.c ? v : (o.t=='"'?'':0);
				};
		}
		
			let verbose = 0, compare = []; // this is for debugging purpose
			if(verbose) // fill the left part of the console display, which is before:v
				for(let x in set) { let id = set[x]; let v = values[id]; compare[x] = { before:v, after:0 } }
		
		set.sort(function(a,b){return (values[a]>values[b])?order:-order; });
		
			if(verbose) // fill the right part of the console display, which is after:v
				for(let x in set) { let id = set[x]; let v = values[id]; compare[x].after = v; }
			
			if(verbose) // now display a compared before to after 
				for(let x in set) { console.log(x+'] '+compare[x].after+' / '+compare[x].after); }
		
		return set;
	},
	keys: function() { return this.register().keys(); }, // would basically return a list of ids, an example of overload can be found here (*ct22*)
	dS: function(id) { return this.register().get(id); },
	dSuivalue: function(id, member, options) {
		options = options || {file:false};
		
		let dS = this.dS(id);
		
		if(this.genomec.name == 'C_dS_visitorAlpha')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_reservation')
			return dS.uivalue(member, options); // see (*ct04*)
			
		if(this.genomec.name == 'C_dS_note_detail')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_task_description')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_task_assignee') // this is displayed in M_TASK on progression tab
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_chat_thread')
			return dS.uivalue(member);
			
		if(this.genomec.name == 'C_dS_file' || this.genomec.name == 'C_dS_resafile')
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
			
			default: 
				// console.log('bottomed default for '+member);
				return { c:1, t:this.genomec.defaults._t[member], v:{0:dS[member]} } // in all other cases, display the genuine value
		}
	},
	dSui: function(id, options) { // see (*ft02*)
		options = options || {file:false};
		let items = new Array();
		for(let i in this.on) { let m = this.on[i]; items[m] = this.dSuivalue(id, this.on[i], options); };
		return items; // for a given dS, returns the display values that are selected in this.on
	},
	dScss: function(id) {
		if('css' in this) return this.css(id); // the genome class define a special css for data sets having some particular properties...
		// the genome catalyst defines no particular row css to be displayed on the table, we default to the following
			let css = '';
			const dS = this.dS(id); 
		if(dS.deletorId) css += ' ds-obsolete'; // generic inactive look for deleted items
		return css;
	},	
	dStip: function(id) {
		const dS = this.dS(id);
		if(this.genomec.name == 'C_dS_reservation') {
			const tippreset = { text:dS.rtip(), css:'sticker-tip resa '+dS.tipcss, delay:300}
			return tippreset; // see (*ct04*)
		}
		return false;
	},
	count: function(set,options) { // set is an array like [ 0:id3, 1:id1, 2:id2, ... ]
	
		options = options||{file:false}; // Defaults to HTML display mode. If forfile = true, then the counting aims to csv and must be purely numeric
		let forhtml = !options.file;
		
		// prepare a set of counters that match what is displayed in the table
		let on = arrayINVERT(this.on);
		let counters = {}; 
		for(let member in on) counters[member] = 0;
		
		// we specify here how to count special fields, like ccss or birthday
		
		let ptypes = C_dS_payment.type;
		let genome = this.genomec.name;
		let count = function(dS,genome,counters,ptypes) {
			// inside this function, this. will not work
			for(let m in counters) {
				switch(m) {
					case 'ccss': if((dS.cssColor!=0) || (dS.cssPattern!=0)) counters[m]++; break; // counts if one of pattern or color is defined
					case 'tags': 
						if(dS.cssTags) { // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string when none is selected, see (*ct20*)
							// note that this works equally for C_dS_reservation and also C_dS_visitorAlpha or C_dS_chat_thread
							let tagsids = dS.cssTags.split('!'); 
							for(let x in tagsids) { let tagid = tagsids[x]; if(tagid==='') continue; else counters[m]++; }
						}
						break; // counts if one of pattern or color is defined
					case 'gender': if((dS.gender==1) || (dS.gender==5)) counters[m]++; break; // counts males only (appears only on C_backVISI)
					case 'birthday':
						if(genome == 'C_dS_reservation') 
							if(dS.visitors) for(let id in dS.visitors) if(dS.visitors[id].birthday!=0) counters[m]++;
						if(genome == 'C_dS_visitorAlpha')
							if(dS.birthday!=0) counters[m]++;
						break; // counts defined birthday only, all other are 0
					case 'visitors' : counters[m]+=dS.visicount; break;
					case 'performances' : if(dS.performances) for(let id in dS.performances) counters[m]++; break;
					case 'duration' : counters[m]+=dS.rduration().v[0]|0; break; // (*ct23*)
					
						// for payments, the amount (in cents) is summed up here
					case 'payments': 	counters[m]+=dS.rpayments().v; break;
					case 'cash': 		counters[m]+=dS.rpayments(ptypes.cash).v; break;
					case 'mobqrcode': 	counters[m]+=dS.rpayments(ptypes.mobqrcode).v; break;
					case 'payconiq': 	counters[m]+=dS.rpayments(ptypes.payconiq).v; break;
					case 'softpos': 	counters[m]+=dS.rpayments(ptypes.softpos).v; break;
					case 'hardpos': 	counters[m]+=dS.rpayments(ptypes.hardpos).v; break;
					case 'onlinepayco': counters[m]+=dS.rpayments(ptypes.onlinepayco).v; break;
					case 'onlinecards': counters[m]+=dS.rpayments(ptypes.onlinecards).v; break;
					case 'receivables': counters[m]+=dS.rpayments(ptypes.receivables).v; break;
			
					default: if(dS[m] != '') counters[m]++; break; // counts when non empty string
				}
			}
		}
		let fit4csv = function(counters) {
			for(let m in counters) {
				switch(m) {
					case 'payments': case 'cash': case 'mobqrcode': case 'payconiq': case 'softpos': case 'hardpos': 
					case 'onlinepayco': case 'onlinecards': case 'receivables':
						counters[m] = insertcoma(counters[m]); break; // insertcoma() is from mobframe.js
				}
			}
		}
		for(let x in set) { 
			let id = set[x]; 
			count(this.dS(id), genome, counters, ptypes); // sum up using the count() function
		}; 
		if(options.file) fit4csv(counters);
		
		for(let m in counters) { // re-adjust some display, like e.g. units display
			switch(m) {
				case 'ccss': break;
				case 'gender': counters[m] = counters[m]+' '+C_XL.w('men'); break;
				case 'birthday': break;
				case 'visitors' : break;
				case 'performances': break;
				case 'payments': case 'cash': case 'mobqrcode':case 'payconiq': case 'softpos': case 'hardpos': case 'onlinepayco': case 'onlinecards': case 'receivables': 
					if(forhtml) counters[m] = C_iEDIT.ergoprice(counters[m])+' '+C_XL.w('euros');
					// else keep it numeric for csv export
					break;
				case 'duration':
					if(forhtml) {
								const v = counters[m]|0; // which is a number minutes
							const hours = (v/60)|0;
							const mntes = v%60;
						const display = (hours?hours+'h':'')+(mntes?String(mntes).padStart(2, '0')+'mn':'');
						counters[m] = display; // see (*ct08*) prepared for webapp header sum display
					}
					// else keep it numeric for csv export
					break;
				default: break; 
			}
		}
		
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
			let warncss = notseen?'chats-blink-color':'';
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
			case 'archived':
				d = '<div class="fa fa-11x fa-comments mindertext"></div>';
				if(this.archived) d = '<div class="fa fa-11x fa-archive mobtext"></div>';
				if(this.deletorId) d = '<div class="fa fa-11x fa-trash"></div>';
				v = this.archived;
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
				if(tagid==='') continue; // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string when none is selected, see (*ct20*)
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
		} else warning('datasets.js','C_dS_chat_thread','htitle','this chat_thread has no title nor visitors:'+this.id);
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
	this.count = function(vid) { 
		if(!vid) return cmems['chitems'].chats.ends(); // returns a total count of items
		return cmems['visitab'].chats.ends(); // else we report a counter for visitor vid only (note that with this implementation, the visitor modal must be open)

	}
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
		  id:'id', creator:'creator', created:'created', archived:'archived', title:'title', note:'note', ccss:'ccss'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'creator', 'created', 'archived', 'title', 'note', 'ccss' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
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
				let note = dS.note?'<span style="font-size:85%; white-space:nowrap; padding-left:1em;" class="mob-txt-gray_d">(&nbsp;'+dS.note+'&nbsp;)</span>':'';
				let bullet = dS.nbullet(); if(verboseOn) bullet = dS.id+' '+bullet;
			labels[dS.id] = '<span style="white-space:nowrap">'+bullet+dS.chtitle+'</span>'+note;
			order.push(dS.id);
		}
		order.sort(function(a,b){return (register[a].chtitle>register[b].chtitle)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() { return new C_dS_note_detail(); };
	this.get = function(id) { return ntmems['plitems'].notes.get(id); };
	this.count = function(vid) { 
		if(!vid) return ntmems['plitems'].notes.ends(); // returns a total count of items
		
		// In this case we display currently active notes for a given visitor. see (*nc01*)
		
		
		return ntmems['visitab'].notes.ends(); // else we report a counter for visitor vid only
	}
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

function C_dS_note_addressee(b, p) {
	C_dS_note_addressee.defaults.mergeto(this,p);
	if(this.id>0) ntmems[b].notes.get(this.groupId).addressees.bylogin.add(this.loginId, this);
		else C_dS_note_addressee.defaults.apply(this); // new object
};
C_dS_note_addressee.defaults = new A_df( { id:0, groupId:0, loginId:0, archived:0 } );

function C_dS_note_visiref(b, p) {
	C_dS_note_visiref.defaults.mergeto(this,p);
	if(this.id>0) ntmems[b].notes.get(this.groupId).visirefs.byid.add(this.visiId, this);
		else C_dS_note_visiref.defaults.apply(this); // new object
};
C_dS_note_visiref.defaults = new A_df( { id:0, groupId:0, visiId:0 } );




	////////////////  T A S K    D E S C R I P T I O N S 

function C_dS_task_description(b,p) {
	C_dS_trackingCCD.apply(this,p);
	C_dS_task_description.defaults.mergeto(this,p,this.tmc);
	this.bank = b; 
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
		let t = C_dS_task_description.defaults._t[member] || ''; // can be '"' for strings or '' for any other 

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
				let description = dS.description?'<span style="font-size:85%; white-space:nowrap;" class="mob-txt-gray_d">(&nbsp;'+dS.description+'&nbsp;)</span>':'';
				let bullet = dS.tbullet(); if(verboseOn) bullet = dS.id+' '+bullet;
			labels[dS.id] = '<span style="white-space:nowrap">'+bullet+medone+dS.chtitle+'</span>'+progress+description;
			order.push(dS.id);
		}
		order.sort(function(a,b){return (register[a].chtitle>register[b].chtitle)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() { return new C_dS_task_description('plitems',[0]); };
	this.get = function(id) { return ntmems['plitems'].tasks.get(id); };
	this.count = function(vid) { 
		if(!vid) return ntmems['plitems'].tasks.ends(); // returns a total count of items
		return ntmems['visitab'].tasks.ends(); // else we report a counter for visitor vid only (note that with this implementation, the visitor modal must be open)
	}
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
	// there is no tracking on those records
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

		let v = '', d = '', dt, login;
		let t = C_dS_task_assignee.defaults._t[member] || ''; // can be '"' for strings or '' for any other 

		switch(member) {
			case 'loginId':
				let loginname = C_dS_loggable.getname(this.loginId);
				if(mobminder.context.loginId==this.loginId) loginname = '<strong>'+loginname+'</strong>';
				d = v = loginname;
				break; 
			case 'cssPattern': d = v = this.tabullet({margin:true});
				break; 
			case 'midnOut': 
				if(!this.midnOut) d = v =  '';
				else d = v = C_XL.date(this.midnOut, {abreviation:'full', weekday:true});
				break; 
			default: 
				d = v = this[member]; // in all other cases, display the genuine value
		}		
		return { c:1, t:t, v:v, d:d }; // count, type, values
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
C_dS_task_assignee.del = function(taskId) {
	let items = C_dS_task_assignee.registers.bytaskid.get(taskId);
	for(let id in items) C_dS_task_assignee.registers.del(items[id]);
}

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
	this.keys = function() { 
		return C_dS_task_assignee.registers.bytaskid.keys(this.taskId);
	};
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
C_dS_task_assignee.catalyst_taskmodal = {  // for C_iARRAY
	
	dS_task_id: false,
	genomec: C_dS_task_assignee, // genome class
	keys: function() { // that is an overload of the generic C_catalyst.keys() that you find here (*ct22*)
		return C_dS_task_assignee.registers.bytaskid.keys(this.dS_task_id);
	},
	dS: function(id) { // that is an overload of the generic C_catalyst.dS()
		return C_dS_task_assignee.registers.bytaskid.get(this.dS_task_id, id);
	},

	register: function() { return C_dS_task_assignee.registers; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'tasks', // title for modal C_iARRAY.fields
	xlprefix: 'tskass-', // translation prefix
	foptions: { // like fieldName:translation
		  cssPattern:'cssPattern', loginId:'loginId', midnOut:'midnOut'
	},
	defaults: { // defines a set of default displayed columns
		on: [ 'cssPattern', 'loginId', 'midnOut' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'loginId', order:1 }
	}
}

function C_dS_task_visiref(b, p) {
	C_dS_task_visiref.defaults.mergeto(this,p);
	if(this.id>0) ntmems[b].tasks.get(this.groupId).visirefs.byid.add(this.visiId, this);
		else C_dS_task_visiref.defaults.apply(this); // new object
};
C_dS_task_visiref.defaults = new A_df( { id:0, groupId:0, visiId:0 } );
C_dS_task_visiref.del = function(id) { /* no register */ };



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
	
	// about birthday
	let bd = this.birthday;
	this.meta = { age:0, dbb:0, cake:'', i:C_dS_visitor.icons.userdefault, bdweekday:'' }; // days before birthday
	const today = new Date();
	if(bd>19000101) { // excludes birthdays like '1995' that are sometime introduced by imports
		bd = ''+bd; // turns it into a string
		// Parse out year, month (0-based), and day
		const year  = parseInt(bd.slice(0, 4), 10);
		const month = parseInt(bd.slice(4, 6), 10) - 1;  // JS months are 0–11
		const day   = parseInt(bd.slice(6, 8), 10);

			this.meta.age = today.getFullYear() - year;

		// If today's month/day is before the birth month/day, subtract 1
		const monthDiff = today.getMonth() - month;
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) this.meta.age--;
	
		if(this.meta.age<19) this.meta.i = C_dS_visitor.icons.userchild;
		if(this.meta.age<5) this.meta.i = C_dS_visitor.icons.userbaby;
		
		const isToday = (
			today.getMonth() === month &&
			today.getDate()  === day
		);
		if(isToday) this.meta.cake = C_dS_visitor.icons.birthdaycake; // let's celebrate birthdays!
		
		const nextBirthday = new Date(today.getFullYear(), month, day);
		if(nextBirthday < today) nextBirthday.setFullYear(today.getFullYear()+1);
		
		this.meta.bdweekday = C_XL.weekday(nextBirthday.getPHPday(), undefined, undefined, 0 /* no cap */ );
		
		this.meta.dbb = Math.ceil( (nextBirthday - today) / (1000 * 60 * 60 * 24) ); // 1000 * 60 * 60 * 24
		// dbb is now 0 if today is birthday (or if no birthday was set), otherwise 1..364	
	}

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
			const tags = options.tags?this.vtags(options.tags)+' ' : ''; // options.tags is expected to contain vtags() options
			const gender = options.gender?C_XL.gender(this.gender)+' ' : '';
			let fname = options.abr?this.firstname[0]+'.':this.firstname; 
		if(options.language) fname+=' ('+mobminder.language.abr[this.language]+')';
			const br = options.br?'<br/>':'';
			const company = this.company?this.company+': ':'';
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
				const color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
				const pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
				const margin = options.margin ? 'margin-left:1em' : '';
			bullet = '<div style="display:inline-block; '+margin+'" class="bullet '+color+pattern+'">&nbsp;</div>';
		}
		if(options.verbose) {
			const names = [];
			if(this.cssColor) names.push(C_dS_customCss.get(this.cssColor).name);
			if(this.cssPattern) names.push(C_dS_customCss.get(this.cssPattern).name);
			if(names.length) verbose += names.join(',&nbsp;');
		}
		return bullet+verbose;
	},
	vbullet: function(options) { return this.bullet(options); },
	vtags: function(options) { // options like {size:'110%', marginleft:'0.5em', marginbetween:'0.2em', verbose:true }
		let tags = '';
		options = options || {}; // options like { marginleft:'0.5em', marginbetween:'0.2em', size:'100%', those:'48360!48362!48361' }
				let size = ''; if(options.size) size=' font-size:'+options.size+';';
				let tagsids = this.cssTags.split('!');
				if(options.those!==undefined) tagsids = options.those.split('!');
				
		if(tagsids.length) {
			const shownames = tagsids.length < (options.inline?5:11);
			const showverbose = options.verbose && shownames;
			
			if(showverbose) { // display as a list of item with each their name (used for tooltip where the tags signification are also displayed)
					
				const pack = [];
				const inline = !!options.inline;
				for(let x in tagsids) {
					let tagid = tagsids[x];
					if(tagid==='') continue; // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						const dS_tag = C_dS_customCss.get(tagid);
						const name = '&nbsp;'+dS_tag.name;
						const style = 'style="display:inline-block; position:relative; bottom:.1em;'+size+'"';
					pack.push('<div '+style+' class="tag '+dS_tag.cssName+'"></div>'+name);
				}
				tags = pack.join(inline?',&nbsp;':'<br/>');
				
				
			} else { // display inline (good for autocomplete list)
				let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
				for(let x in tagsids) {
						const tagid = tagsids[x];
					if(tagid==='') continue; // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string, see (*ct20*)
						const tagcss = C_dS_customCss.get(tagid).cssName;
						const style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
					tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
					margin = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : ''; // reduce the margin between tags, only the first one is longer
				}
			}
		}
		return tags; // html ready
	},
	vwarn: function() { // (*v01*)
			let warn = '';
			let warnicon = '<div style="font-size:1.2em; display:inline-block;" class="orange fa fa-gray fa-warning"></div>';
		if(this.selection) warn = warnicon+'&nbsp;';
		return warn;
	},
	vtip: function(o = {withbp:false}) { // inner content HTML for a dS_visitor tooltip
				const separator = '<hr/>', hrshort = '<hr class="short"></hr>';
				const padder = '<div style="height:1em; min-height:1em; border:none;"></div>';
				let dbb = '';
				if(this.meta.dbb) // ignore if value is zero (birthday is today)
				if(this.meta.dbb<=7) { // ignore if birthday is further away than one week.
					const bdf = C_XL.w('birthday forecast',{ nested:{weekday:this.meta.bdweekday}, cap:0 }); // birthday forecast
					let bda = C_XL.w('in x days',{ nested:{dtgo:this.meta.dbb}, cap:0 }); // days ahead of birthday
					if(this.meta.dbb==1) bda = C_XL.w('tomorrow',{ cap:0 }); // birthday is tomorrow
					dbb = '&nbsp;&nbsp;('+bdf+', '+bda+'&nbsp;&nbsp;'+C_dS_visitor.icons.birthdaycake+'&nbsp;)';
				}
			let warning = '', birthday = '', address = '', phones = '', email = '', registration= '', reference = '', note = '';
				const bullet = (dbb?'<br/>':'')+this.vbullet({ifany:true, verbose:true}); // if(bullet) bullet = '<br/>'+bullet;
				let tags = this.vtags({verbose:true}); if(tags) tags = separator+tags;
				// let name = '<strong>'+this.vname()+'</strong>';
			if(this.birthday) birthday = tohumanbdate(this.birthday)+dbb+'<span style="display:inline-block; min-width:2em;">&nbsp;</span>'; 
			if(this.selection) warning = '<br/>'+this.vwarn()+'&nbsp;'+C_XL.w('visitor overbooked');
			
				const addresstack = new Array(), addresslist = new Array();
			addresstack.push(this.residence,this.address,this.zipCode,this.city,this.country);
			for(let x in addresstack) if(addresstack[x]) addresslist.push(addresstack[x]);
			if(addresslist.length) address = separator+addresslist.join(', ');
			
				const phonestack = new Array(), phoneslist = new Array();
			phonestack.push(this.ergomobile,this.phone);
			for(let x in phonestack) if(phonestack[x]) phoneslist.push(phonestack[x]);
			if(phoneslist.length) phones = separator+phoneslist.join(', ');
			
			if(this.email) email = separator+this.email;
			
			if(this.registration) registration = separator+this.registration;
			
			if(this.reference) reference = separator+this.reference;
			
			// let more = ''; if(this.note.length>1800) more = '...';
			const more = this.note.length>1800 ? '...':'';
			if(this.note) note = separator+this.note.substr(0,1800).htmlize()+more;
			
			let ctrlshiftbp = '';
			if(o.withbp) { // o.withbp indicates that the client has implemented shift / ctrl + clic. o.forcresta indicates that this tip goes under a C_iCRESTA display
				const kb = '<div style="" class="fas fa-keyboard fa-padded"></div>';
				ctrlshiftbp = padder+hrshort+'<div class="blueprint centered">'+C_XL.w('visitor_bp_ctrlshift', { nested:{ kb:kb } })+'</div>';
				ctrlshiftbp = '<div class="cresta-only">'+ctrlshiftbp+'</div>';
			}
		const tip = this.vtitle()+birthday+warning+bullet+address+phones+email+tags+registration+reference+note+ctrlshiftbp;
		return tip;
	},
	vtitle: function(css = '', o = { foresatip:false }) {
		
		if(o.foresatip) { // visitors are also depicted in the C_dS_reservation toolip (appearing on hovering a planning sticker).
						const h = this.birthday?'1.6em':'1.1em';
						const b = '<span style="font-size:80%;">'+this.vbullet({ifany:true, margin:false, verbose:false })+'</span>';
				
					const astyle = 'width:100%; text-align:center; font-weight:bold; bottom:-1.8em; left:-1px; opacity:.4;';
				const divage = this.meta.age?'<div class="deltarea min f-lato" style="'+astyle+'">'+this.meta.age+'</div>':'';
				const avatar = '<div>'+this.meta.i+'</div>';
				
					const combostyle = 'display:inline-block; position:relative; width:2em; height:1.2em; text-align:center; line-height:1.0em;';
				const combo = '<div style="'+combostyle+'">'+avatar+divage+'</div>';
			let name = this.meta.cake+'<span style="padding-right:.4em; padding-left:1em;">'+b+this.vname()+'</span>'+combo;
			
			if(this.deletorId) name = C_XL.w('merged',{cap:true})+symbol('user-deleted');
			
			const title = '<h1 style="font-size:1.2em; min-height:'+h+'; margin:.3em 0;" class="modal-visi'+(css?' '+css:'')+'">'+name+'</h1>';
			return title;
			
		} else { // visitors are depicted in the C_dS_visitor toolip (appearing on hovering a selected visitor in M_RESA or R_search).
			const h = this.birthday?'3em':'2em';

					const astyle = 'width:100%; text-align:center; font-weight:bold; bottom:-1.6em; left:0px; opacity:.4;';
				const divage = this.meta.age?'<div class="deltarea min f-lato" style="'+astyle+'">'+this.meta.age+'</div>':'';
				const avatar = '<div>'+this.meta.i+'</div>';
				
					const combostyle = 'display:inline-block; position:relative; width:2.4em; height:1.4em; text-align:center; line-height:1.2em;';
				const combo = '<div style="'+combostyle+'">'+avatar+divage+'</div>';
			let name = this.meta.cake+'<span style="padding-right:.4em; padding-left:1em;">'+this.vname()+'</span>'+combo;
			
			if(this.deletorId) name = C_XL.w('merged',{cap:true})+symbol('user-deleted');
			
			const title = '<h1 style="font-size:1.4em; min-height:'+h+';" class="modal-visi mobtext'+(css?' '+css:'')+'">'+name+'</h1>';
			return title;			
			
		}
		
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
			
			case 'gender': 		return { c:1, t:'"', v:{0:C_XL.gender(this.gender)} }; // format, see (*ca01*)
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
				
			default: return { c:1, t:C_dS_visitor.defaults._t[member], v:this[member] }; // for defaults._t[member] see (*df01*)
			// in all other cases, display the genuine value
		}	
	},
	members: function(which, options) { // for C_iARRAY, which is an array like [ 0:'id', 1:'groupId', 2:'created' ]
		let items = new Array();
		for(let i in which) items.push(this.uivalue(which[i], options)); 
		return items;
	},
	vical: function() {
			let aid = mobminder.account.id;
			let vid = this.id;
			let vdi = this.lastname.toLowerCase().replace(/[ ,\-]/gi,'');
		return 'vical.mobminder.com/'+aid+'/'+vid+'/'+vdi;
	},
	anglemail: function() {
		if(!this.email) return '';
		return '"'+this.lastname+' '+this.firstname+'" <'+this.email+'>';
	}
}
C_dS_visitor.membersCount = 22;
C_dS_visitor.get = function(id) { return C_dS_visitor.register.id.get(id); }
C_dS_visitor.ACoptions = function(preset = {tipwithbp:false}) {
	this.trigger = 3;
	this.tipwithbp = preset.tipwithbp;
	this.css = 'alpha20';
	this.callback = false;
	this.exclude = false;

}
C_dS_visitor.ACoptions.prototype = {
	fetch: function(digits, callback, exclude, acxtrapass) { // acxtrapass is used for (*v01*)
		this.callback = callback; this.exclude = exclude || false;
		const passer = {digits:digits};
		if(acxtrapass) {
			if(typeof acxtrapass === "object")
				for(let p in acxtrapass) passer[p] = acxtrapass[p]; 
		}
			
		const post = new C_iPASS(passer);
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
		else {
			// let span = '<span class="mob-txt-gray_d" style="font-size:85%; font-weight:normal; padding:0 0 0 1em;">'+mobile+birthday+registration+'</span>';
			let span = mobile+birthday+registration;
			return warning+name+span+bullet+tags;
		}
	}, 
	tip: function(id, o = { forcresta:false }) {
		// this function is called from inside C_iAC (tooltips for dropdown display items list), 
		// and is also called from C_iACPICK when selected items are displayed in the C_iCRESTA.
		// this.tipwithbp indicates that the client has implemented shift / ctrl + clic. 
		// o.forcresta indicates that this tip goes under a C_iCRESTA display.
		
		const dS_visitor = C_dS_visitor.register.id.get(id);
		// console.log('C_dS_visitor.ACoptions::tip() forcresta:',o.forcresta,' tipwithbp:',this.tipwithbp);
		const withbp = o.forcresta&&this.tipwithbp; // both conditions must be fullfilled for the blueprint to be requested
		return { text:dS_visitor.vtip({withbp:withbp}), css:'visi-tip', delay:100 };
	},
	stream: function(digits, datasets) {
		const options = new Array();
		const presets = new Array(); // they contain the tooltip indications
		const visitors = datasets['C_dS_visitor'];
		let xcl = [];
		if(this.exclude) {
			if(this.exclude instanceof Array) xcl = this.exclude; 
			else xcl.push(this.exclude); // this.exclude can be a single value or an array
		}
		for(let id in visitors) { // they contain the labels displayed on the ac drop menu
				var skip = false;
			for(let i in xcl) if(id == xcl[i]) { skip=true; break; } // hides from the dropdown list the items defined in this.exclude when fetch() was called
			if(skip) continue;
			
			options[id] = this.merge(visitors[id]);
			presets[id] = { tip:this.tip(id) };
		}
		
		
		this.callback.cb(digits, options, presets);
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
			const many = new Array(); 
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
C_dS_visitor.icons = { // upper right modal corner decoration, and visitor tip title
		userdefault: '<div class="fad fa-user fa-15x"></div>',
		userchild: '<div class="fad fa-child fa-15x"></div>',
		userbaby: '<div class="fad fa-baby fa-15x"></div>',
		usernew: '<div class="fad fa-user-new fa-15x"></div>',
		birthdaycake: '<div class="fad fa-birthday-cake fa-15x"></div>'
	}





function C_lastname(p) { // used for new visitor's lastname auto-completion
	C_lastname.defaults.mergeto(this,p);
	C_lastname.register.push(this.lastname); // is just an array, set up in C_lastname.init()
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






class C_dS_stat_zip { // used for new visitor's lastname auto-completion
	constructor(p) {
		C_dS_stat_zip.defaults.mergeto(this,p);
		C_dS_stat_zip.register[this.id] = this;
	};
	static mapping = {
		// Rue
		'\\b(?:rue|ru|r|r\\.|rue\\.)\\b': '',   // 'rue',
		// Avenue
		'\\b(?:avenue|avnue|aven|av|av\\.|ave|ave\\.|avenue\\.)\\b': '',   // 'avenue',
		// Place
		'\\b(?:place|pl|pl\\.)\\b': '',   // 'place',
		// Boulevard
		'\\b(?:boulevard|boulevar|bouleva|boulev|boule|boul|bvd|bvd\\.|bld|bld\\.|boul\\.|bd|bd\\.)\\b': '',   // 'boulevard',
		// Chemin
		'\\b(?:chemin|chemi|chem|chem\\.|ch|ch\\.)\\b': '',   // 'chemin',
		// Impasse
		'\\b(?:impasse|impass|impa|imp|imp\\.)\\b': '',   // 'impasse',
		// Lotissement
		'\\b(?:lotissement|lotissemen|lotisseme|lotissem|lotisse|lotiss|lotis|lot|lt\\.)\\b': '',   // 'lotissement',
		// Allée
		'\\b(?:all|alle|allé|allée|allee|all|all\\.)\\b': '',   // 'allée',
		// Faubourg
		'\\b(?:faubourg|faubour|faubou|faubo|faubg|faubg\\.|fbg|fbg\\.)\\b': '',   // 'faubourg',
		// Passage
		'\\b(?:passage|passag|passa|pass|pass\\.)\\b': '',   // 'passage',
		// Voie
		'\\b(?:voie|vo|vo\\.)\\b': '',   // 'voie',
		// Route
		'\\b(?:route|rout|rte|rte\\.|route\\.)\\b': '',   // 'route',
		// Cours
		'\\b(?:cours|cour|cours?\\.|c|c\\.)\\b': '',   // 'cours',
		// Clos
		'\\b(?:clos|clos?\\.|cl|cl\\.)\\b': '',   // 'clos',
		// Chaussée
		'\\b(?:chaussee|chaussée|chausee|chssee|ch|ch\\.)\\b': '',   // 'chaussée',
		// Cité
		'\\b(?:cite|cite\\.|cité|cité\\.|ct|ct\\.)\\b': '',   // 'cité',
		// Pré
		'\\b(?:pré|pre)\\b': '',   // 'pré',
		// Pont
		'\\b(?:pt|pt\.|pont|pont\\.)\\b': '',   // 'pont',
		// Apt
		'\\b(?:appa|appar|appart|appart\\.|app|apt|appt)\\b': '',
		// Sous-sol
		'\\b(?:\\/Ssol|\\/Ssol\\.|\\/Ss|\\/Ss\\.|Ssol|Ssol\\.|Ss|Ss\\.)\\b': '',
		// Boîte, batiment, etc.
		'(?<![A-Za-z])(?:bus|box\\.?|bx\\.?|b\\.|boite|bat\\.?|bât\\.?|bte\\.?|bt\\.?|b)(?:\\d{1,3}[A-Za-z]?)?(?=$|[ ,])': '',
		// Étage
		'\\b(?:étage|etage|étag|etag|et\\.)\\b': '',
		// commas, pluses, quotes
		',': ' ',
		'\\+': '',
		'"': ''
	}

  // linking words that should stay lowercase: apply *after* you’ve lowercased the full string
	static lowering = {
		// 1) “De La” must stay “de la”
		'\\bDe La\\b': '', //   'de la',
		// 2) “De L ” or “De L'” (any mix of space+apostrophe) ? “de l'”
		'\\bDe L[\'\\s]+(?=\\p{L})': "", //   "de l'",
		// 3) the other plurals/articles
		'\\bDes\\b': '', //   '',
		'\\bDu\\b': '', //   '',
		'\\bDe\\b': '', //   '',
		// 4) stray single-letter elisions (in case of “D Or”, “L Abattoir”)
		'\\bD[\'\\s]+(?=\\p{L})': "", //   "d'",
		'\\bL[\'\\s]+(?=\\p{L})': "" //  "l'"
	}

	static cleanzip(addr) { // was used by 2025_spoofy_zip_reduction...
		// 0) Normalize curly quotes ? straight apostrophe
		addr = addr.replace(/[’‘]/g, "'");

		// 1) Strip parentheses, commas, pluses; drop any "/<letters>" segments; normalize whitespace
		addr = addr.replace(/\s*\([^)]*\)\s*/gu, ' ');
		addr = addr.replace(/[,+]/g, ' ');
		// remove any slash + word (e.g. /A, /rez)
		addr = addr.replace(/\s*\/\s*[A-Za-z]+\b/gu, ' ');
		addr = addr.replace(/\s+/gu, ' ');
		addr = addr.trim();

		// 2) Apply your place-type and other mapping
		for (let [pat, repl] of Object.entries(this.mapping)) {
		  addr = addr.replace(new RegExp(pat, 'giu'), repl);
		}

		// 3) Split into tokens, drop pure-punctuation; extract alpha-prefix for tokens with digits
		let tokens = addr.split(/\s+/u);
		let filtered = [];
		for (let tok of tokens) {
		  if (/\d/u.test(tok)) {
			let m = tok.match(/^([^\d]+)\d+/u);
			if (m && /\p{L}/u.test(m[1])) filtered.push(m[1]);
			continue;
		  }
		  if (!/\p{L}/u.test(tok)) continue;
		  filtered.push(tok);
		}

		// 4) Re-assemble, lowercase, then Title Case except place-types
		addr = filtered.join(' ');
		addr = addr.toLowerCase();
		let placeTypes = new Set(Object.values(this.mapping).map(w => w.toLowerCase()));
		let words = addr.split(/\s+/u).map(w =>
		  placeTypes.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)
		);
		let cleaned = words.join(' ');

		// 5) Apply lowering ("De La"?"de la", etc.)
		for (let [pat, repl] of Object.entries(this.lowering)) {
		  cleaned = cleaned.replace(new RegExp(pat, 'giu'), repl);
		}

		// 6) Collapse multiple apostrophes and uppercase following letter
		cleaned = cleaned.replace(/['’]{2,}/gu, "'");
		cleaned = cleaned.replace(/(['’])(\p{L})/gu, (_, p, l) => p + l.toUpperCase());

		return cleaned.trim();
	}
}
C_dS_stat_zip.defaults = new A_df( { id:0, groupId:0, zip:'', city:'', country:'' } );
// C_dS_stat_zip.prototype = {
// };
( C_dS_stat_zip.init = function() { C_dS_stat_zip.register = []; })();


C_dS_stat_zip.ACoptions = function(preset) {
	this.trigger =  3;
	this.css = 'alpha20';
	this.callback = false;
	this.exclude = false;
	this.zipgetcb = preset.zipgetcb; // which is a A_cb supposed to return the current zip value. This zip (if set) is posted to the server as an additional filter for the query.
}
C_dS_stat_zip.ACoptions.prototype = {
	
	fetch: function(digits, callback, exclude) { 
		this.callback = callback; this.exclude = exclude || false;
		let post = new C_iPASS({digits:digits});
		mobminder.app.post({post:post}, {post:{digits:'digits'}}, './queries/zip.php', new A_cb(this, this.stream, digits)); // see (*ads01*)
		C_dS_stat_zip.init();
	},
	label: function(x) { 
		return C_dS_stat_zip.register[x];
	},
	tip: function(id) {
		return 'Hello, I am a zip and city name :)';
	}, 
	stream: function(digits, datasets, stream) { // digits was set here (*ads01*), the rest comes from mobframe framework
		let labels = new Array();
		let presets = new Array(); // they contain the tooltip indications
		let order = new Array(); // they contain the tooltip indications
		let zips = datasets['C_dS_stat_zip'];
		let xcl = new Array();
		if(this.exclude) {
			if(this.exclude instanceof Array) xcl = this.exclude; 
			else xcl.push(this.exclude); // this.exclude can be a single value or an array
		}
		
		let zipsbycc = []; let countrycodes;
		switch(mobminder.account.phoneRegion) {
			case 352: countrycodes = ['lu','be','fr','de']; break;
			case 33: countrycodes = ['fr','be','ch','sp']; break;
			case 32: // falls down
			default:
				countrycodes = ['be','fr','lu','de']; break;
		}
		
		for(let id in zips) { // zips is the input list
				let skip = false;
			for(let i in xcl) if(id == xcl[i]) { skip=true; break; } // hides from the dropdown list the items defined in this.exclude when fetch() was called
			if(skip) continue;0
			order.push(id);
		}
		
			let sortrule = function(id_a,id_b) { 
				const ds_a = zips[id_a];
				const ds_b = zips[id_b];
				return (ds_a.zip>ds_b.zip)?1:-1;
				
			};
		order.sort(sortrule);
		let count = order.length;
		
		
		for(let id in zips) { // they contain the labels displayed on the ac drop menu
				let skip = false;
			for(let i in xcl) if(id == xcl[i]) { skip=true; break; } // hides from the dropdown list the items defined in this.exclude when fetch() was called
			if(skip) continue;
			
			labels[id] = this.merge(zips[id]);
			presets[id] = { tip:this.tip(id) };
		}
		
		const options =  { order:order, labels:labels, presets:presets, count:count };
		this.callback.cb(digits, options); // see (*ac10*), which is a C_iAC.prototype.load() call with (*ac04*) option
	},
	merge: function(dS_stat_zip) {
		const c = C_XL.duallettercountrycode(dS_stat_zip.country); // dS_stat_zip.country is the 2 digits country code, like 'ch' for Switzerland
		let display = dS_stat_zip.zip+', '+dS_stat_zip.city+', '+c;
		return display;
	}
	
}



// We need the cleanAddress() function to be adapted in such a way that it LEAVES in the string trailing comas, spaces, numbers whatever appears.
// So the cleanup processes only heading numbers.
// and, we want to retrieve the cut part, before the mapping & lowering applies.
// So, if the input is "25, rue des maronniers, 1170" it should output { payload:"maronniers, 1170", cut:"25, rue des" }
// Can you help?

class C_dS_stat_address { // used for new visitor's lastname auto-completion
	constructor(p) {
		C_dS_stat_address.defaults.mergeto(this,p);
		C_dS_stat_address.register[this.id] = this;
	};
	static mapping = {
		// Rue
		'\\b(?:rue|ru|r|r\\.|rue\\.)\\b': '',   // 'rue',
		// Avenue
		'\\b(?:avenue|avnue|aven|av|av\\.|ave|ave\\.|avenue\\.)\\b': '',   // 'avenue',
		// Place
		'\\b(?:place|pl|pl\\.)\\b': '',   // 'place',
		// Boulevard
		'\\b(?:boulevard|boulevar|bouleva|boulev|boule|boul|bvd|bvd\\.|bld|bld\\.|boul\\.|bd|bd\\.)\\b': '',   // 'boulevard',
		// Chemin
		'\\b(?:chemin|chemi|chem|chem\\.|ch|ch\\.)\\b': '',   // 'chemin',
		// Impasse
		'\\b(?:impasse|impass|impa|imp|imp\\.)\\b': '',   // 'impasse',
		// Lotissement
		'\\b(?:lotissement|lotissemen|lotisseme|lotissem|lotisse|lotiss|lotis|lot|lt\\.)\\b': '',   // 'lotissement',
		// Allée
		'\\b(?:all|alle|allé|allée|allee|all|all\\.)\\b': '',   // 'allée',
		// Faubourg
		'\\b(?:faubourg|faubour|faubou|faubo|faubg|faubg\\.|fbg|fbg\\.)\\b': '',   // 'faubourg',
		// Passage
		'\\b(?:passage|passag|passa|pass|pass\\.)\\b': '',   // 'passage',
		// Voie
		'\\b(?:voie|vo|vo\\.)\\b': '',   // 'voie',
		// Route
		'\\b(?:route|rout|rte|rte\\.|route\\.)\\b': '',   // 'route',
		// Cours
		'\\b(?:cours|cour|cours?\\.|c|c\\.)\\b': '',   // 'cours',
		// Clos
		'\\b(?:clos|clos?\\.|cl|cl\\.)\\b': '',   // 'clos',
		// Chaussée
		'\\b(?:chaussee|chaussée|chausee|chssee|ch|ch\\.)\\b': '',   // 'chaussée',
		// Cité
		'\\b(?:cite|cite\\.|cité|cité\\.|ct|ct\\.)\\b': '',   // 'cité',
		// Pré
		'\\b(?:pré|pre)\\b': '',   // 'pré',
		// Pont
		'\\b(?:pt|pt\.|pont|pont\\.)\\b': '',   // 'pont',
		// Apt
		'\\b(?:appa|appar|appart|appart\\.|app|apt|appt)\\b': '',
		// Sous-sol
		'\\b(?:\\/Ssol|\\/Ssol\\.|\\/Ss|\\/Ss\\.|Ssol|Ssol\\.|Ss|Ss\\.)\\b': '',
		// Boîte, batiment, etc.
		'(?<![A-Za-z])(?:bus|box\\.?|bx\\.?|b\\.|boite|bat\\.?|bât\\.?|bte\\.?|bt\\.?|b)(?:\\d{1,3}[A-Za-z]?)?(?=$|[ ,])': '',
		// Étage
		'\\b(?:étage|etage|étag|etag|et\\.)\\b': '',
		// commas, pluses, quotes
		// ',': ' ',
		'\\+': '',
		'"': ''
	}

  // linking words that should stay lowercase: apply *after* you’ve lowercased the full string
	static lowering = {
		// 1) “De La” must stay “de la”
		'\\bDe La\\b': '', //   'de la',
		// 2) “De L ” or “De L'” (any mix of space+apostrophe) ? “de l'”
		'\\bDe L[\'\\s]+(?=\\p{L})': "", //   "de l'",
		// 3) the other plurals/articles
		'\\bDes\\b': '', //   'des',
		'\\bDu\\b': '', //   'du',
		'\\bDe\\b': '', //   'de',
		// 4) stray single-letter elisions (in case of “D Or”, “L Abattoir”)
		'\\bD[\'\\s]+(?=\\p{L})': "", //   "d'",
		'\\bL[\'\\s]+(?=\\p{L})': "" //  "l'"
	}

	// We want to keep the properties of this function EXACTLY THE SAME, 
	// but when option keepend is set true, any house numbering -like following the street key word('s) should be kept.
	// Do you think it is possible to achieve this?

	static cleanAddress(addr, keepend = false) {
		
    // 0) Normalize curly quotes ? straight apostrophe
    addr = addr.replace(/[’‘]/g, "'");

    // 1) Strip parentheses, commas, pluses; drop any "/<letters>" segments; normalize whitespace
    addr = addr.replace(/\s*\([^)]*\)\s*/gu, ' ');
    // addr = addr.replace(/[,+]/g, ' ');
    // remove any slash + word (e.g. /A, /rez)
    addr = addr.replace(/\s*\/\s*[A-Za-z]+\b/gu, ' ');
    addr = addr.replace(/\s+/gu, ' '); // implodes duplicate spaces
    // addr = addr.trim();

    // 2) Apply your place-type and other mapping
	const mapping = Object.assign({}, this.mapping);
	if(!keepend) mapping[','] = ' ';
    for (let [pat, repl] of Object.entries(mapping)) {
      addr = addr.replace(new RegExp(pat, 'giu'), repl);
    }

    // 3) Split into tokens, drop pure-punctuation; extract alpha-prefix for tokens with digits
    // let tokens = addr.split(/\s+/u);
    // let filtered = [];
    // for (let tok of tokens) {
		// if(/\d/u.test(tok)) {
			// let m = tok.match(/^([^\d]+)\d+/u);
			// if(m && /\p{L}/u.test(m[1])) { filtered.push(m[1]); }
			// continue;
		// }
		// if(!/\p{L}/u.test(tok)) continue;
		// filtered.push(tok);
    // }
	let tokens   = addr.split(/\s+/u);
	let filtered = [];
	for (let tok of tokens) {
		if (/\d/u.test(tok)) {
			if(keepend) {
				// ? CHANGÉ ICI : au lieu de ne garder que le préfixe alpha,
				// on garde le token entier (p.ex. "25B" ou "1170")
				filtered.push(tok);
			}
			else {
				// ancien comportement : on extraie seulement la partie avant les chiffres
				let m = tok.match(/^([^\d]+)\d+/u);
				if (m && /\p{L}/u.test(m[1])) filtered.push(m[1]);
			}
			continue;
		}
		if(!/\p{L}/u.test(tok)) continue;
		filtered.push(tok);
	}


    // 4) Re-assemble, lowercase, then Title Case except place-types
    addr = filtered.join(' ');
    addr = addr.toLowerCase();
    let placeTypes = new Set(Object.values(this.mapping).map(w => w.toLowerCase()));
    let words = addr.split(/\s+/u).map(w => placeTypes.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1) );
    let cleaned = words.join(' ');

    // 5) Apply lowering ("De La"?"de la", etc.)
    for (let [pat, repl] of Object.entries(this.lowering)) {
      cleaned = cleaned.replace(new RegExp(pat, 'giu'), repl);
    }

    // 6) Collapse multiple apostrophes and uppercase following letter
    cleaned = cleaned.replace(/['’]{2,}/gu, "'");
    cleaned = cleaned.replace(/(['’])(\p{L})/gu, (_, p, l) => p + l.toUpperCase());
    return cleaned;
  }
}
C_dS_stat_address.defaults = new A_df( { id:0, groupId:0, street:'', zip:'', city:'', country:'' } );
// C_dS_stat_address.prototype = {
// };
( C_dS_stat_address.init = function() { C_dS_stat_address.register = []; })();


C_dS_stat_address.ACoptions = function(preset) {
	this.css = 'alpha20';
	this.callback = false;
	this.exclude = false;
	this.zipgetcb = preset.zipgetcb; // which is a A_cb supposed to return the current zip value. This zip (if set) is posted to the server as an additional filter for the query.
}
C_dS_stat_address.ACoptions.prototype = {
	
	// C_iAC interface functions: (mandatory)
	trigger: function(digits) {
	
		// we will fool the if() process inside C_iAC::changed() by always adjusting trigger around the digits.length
		
		let ql = digits.length;
		if(digits.includes(',')) return ql+1; // never triggers a fetch
		
		const zcc = this.zipgetcb.cb();
		let threshold = 5; if(zcc.zip) threshold = 3; // those thresholds values must stay aligned with the PHP counterpart, see (*ad02*)
		
		let trigger = 0;
		let c = C_dS_stat_address.cleanAddress(digits, true /*keeps end*/ );
		
		if(c.length==threshold) trigger = ql; // triggers a fetch, respecting the length reduction case (*ad03*)
			else if(c.length>threshold) trigger = ql-1; // triggers a fetch
				else trigger = ql+1; // does not trigger a fetch

		// console.log('ACoptions.trigger('+digits+' > '+c+') '+c.length+'chars, trigger='+trigger+', ql='+ql);
		return trigger; // c contains a string, this line gives an error: C.length is not a function. HElp?
	},
	fetch: function(digits, callback, exclude) { // callback used here, when data is received: (*ad11*)
		const zip = this.zipgetcb.cb();
		const clean = C_dS_stat_address.cleanAddress(digits, false /*keeps end*/ );
		this.callback = callback; this.exclude = exclude || false;
		let cc = ISO3166_1_alpha_2_code_from_ITUT_E_164_CC(mobminder.account.phoneRegion); // turns 32 into 'be', 33 into 'fr', etc...
		if(mobminder.account.phoneRegion==32) cc = this.resolvebelgiumnlfr();
		this.cc = cc;
		let post = new C_iPASS({digits:clean, cc:cc, zip:zip.zip});
		mobminder.app.post({post:post}, {post:{digits:'digits', cc:'cc', zip:'zip'}}, './queries/address.php', new A_cb(this, this.stream, clean)); // see (*ads01*)
		C_dS_stat_address.init();
	},
	label: function(x) { 
		return C_dS_stat_address.register[x];
	},
	tip: function(id) {
		return 'Hello, I am a street name :)';
	}, 
	stream: function(digits, datasets, stream) { // digits was set here (*ads01*), the rest comes from mobframe framework
		let labels = new Array();
		let presets = new Array(); // they contain the tooltip indications and subtitles {section:bullet}
		let order = new Array(); 
		let addresses = datasets['C_dS_stat_address'];
		let xcl = new Array();
		if(this.exclude) {
			if(this.exclude instanceof Array) xcl = this.exclude; 
			else xcl.push(this.exclude); // this.exclude can be a single value or an array
		}
		
		// cleans up the items to be xcluded (optional feature for that ACoptions)
		let xcladdrss = new Array();
		for(const id in addresses) {
				let skip = false;
			for(let i in xcl) if(id == xcl[i]) { skip=true; break; } // hides from the dropdown list the items defined in this.exclude when fetch() was called
			if(skip) continue;
			xcladdrss[id] = addresses[id]; // [id to dS_stat_address] array
		}
		
		
		let dc = this.distinctcountries(xcladdrss); // smth like [  'be-nl':[],'be-fr':[],'be':[],'lu':[],'fr':[], 'de':[], 'it':[], 'ch':[]  ]
		for(const id in xcladdrss) {
			const dS = xcladdrss[id];
			dc[dS.country].push(id);
		}
		
			const bullet = ''; // C_XL.w('b2'); finaly, no thanks
			const sortrule = function(id_a,id_b) { 
				const ds_a = xcladdrss[id_a];
				const ds_b = xcladdrss[id_b];
				const compo_a = ds_a.country+ds_a.zip; // by country, than by zip number inside that country
				const compo_b = ds_b.country+ds_b.zip;
				return ( compo_a > compo_b ) ? 1 : -1;
			};
		for(const cc in dc) {
			dc[cc].sort(sortrule); // so the display order is ruled by label value (id here). Some array like [0:6548954, 1:6584562, 2: ...]
			dc[cc].unshift(cc); // 'fr', or 'be' will be the value at position zero in the array
				const cxl = C_XL.duallettercountrycode(cc); // dS_stat_zip.country is the 2 digits country code, like 'ch' for Switzerland, and 'Belgïe' for be-nl, while 'Belgique' for be-fr.
			labels[cc] = cxl; // inserts a title for that section
			presets[cc] = {section:{bullet:bullet,css:'f-calibri-bold mob-txt-gray_l addresslist_section'}}; // see (*sb01*), this bullet gets concatenated with the label for cc.
		}
		
		let filter = '';
		switch(this.cc) { // this filter defines the sorting order and priorities of the query, in function of the user location. This is future ready for adding countries.
			case 'fr': filter = ['fr','be','lu','de']; break;
			case 'lu': filter = ['lu','fr','be','de']; break;
			case 'be-fr': filter = ['be-fr','be-nl','be','fr','lu','de']; break;
			case 'be-nl': filter = ['be-nl','be-fr','be','fr','lu','de']; break;
			default: // keeps void filter untouched. This switch must stay identical to the one found at PHP side in /query/address.php, see (*ad05*)
		}
		
		const filterSet = new Set(filter);
		
		for(const pref of filter)
			if(dc[pref])
				for(let id in dc[pref]) order.push(dc[pref][id]); // fills in the country order according to this.cc preferences through filter
				
		for(const cc of Object.keys(dc))
			if(!filterSet.has(cc))           
				for(let id in dc[cc]) order.push(dc[cc][id]); // adds thereafter other countries as they arrive (not listed in the filter).
		
		const count = order.length;
		for(const id in xcladdrss) {
			let m = this.merge(xcladdrss[id]); // smth like { tip:{text:'sometext', css:'help-tip by default'}, label:'' }
			labels[id] = m.label;
			presets[id] = { tip:m.tip };
		}
		
		
		const options =  { order:order, labels:labels, presets:presets, count:count, pascal:'happy' };
		this.callback.cb(digits, options); // (*ad11*), see also (*ac10*), which is a C_iAC.prototype.load() call with (*ac04*) option
	},
	
	// private functions:
	merge: function(dS_stat_address) { // this is where option label and option tip are built. Returns smth like { tip:{text:'sometext'}, label:'the actual address' }
				const dlcc = dS_stat_address.country; // dual letters country code, but can be [ be, be-fr, be-nl ] // Belgium: that country is cut into two linguistic regions with overlap, so we make it easy for the user taking their login language as a preferred way to display options
			const c = C_XL.duallettercountrycode(dlcc); // dS_stat_zip.country is the 2 digits country code, like 'ch' for Switzerland, and 'Belgïe' for be-nl, while 'Belgique' for be-fr.
		const label = dS_stat_address.street+', '+dS_stat_address.zip+', '+dS_stat_address.city+' ('+c+')';	
		const tiptext = dS_stat_address.street+'\n'+dS_stat_address.zip+'\n'+dS_stat_address.city+'\n'+c;
		return { tip:{text:tiptext.htmlize() }, label:label };
	},
	distinctcountries(addresses) { // returns distinct countries found in addresses (as array of C_dS_stat_address)
		let dc = []; // distinct countries
		for(let id in addresses) {
			const ds_a = addresses[id];
			// if(ds_a.country=='be') ds_a.country = this.resolvebelgiumnlfr(); // can return 'be', 'be-fr', or 'be-nl'
			if(!(ds_a.country in dc)) dc[ds_a.country] = [];
		}
		// now according to intrenational phone country code and login language, we can setup an ergonomic display in function of user location.
		return dc; // smth like [ 'be-nl':[],'be-fr':[],'be':[],'lu':[],'fr':[] ]
	},
	resolvebelgiumnlfr: function() { // applies only for dlcc=='be'  (dlcc = dual letter country code)
		let output = 'be';
		switch(mobminder.context.surfer.language) {
			case mobminder.language.codes.dutch: output = 'be-nl'; break; // will be tranlsated to 'Belgïe'
			case mobminder.language.codes.french: output = 'be-fr'; break; // will be tranlsated to 'Belgique'
			default: // output stays 'be' and will be tranlsated to 'Belgium'.
		}
		return output;
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
//   V I S I T O R S    R E G I S T E R 
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
C_dS_visitorAlpha.catalyst = {  // for C_catalyst, see (*cy01*)
	
	genomec: C_dS_visitorAlpha, // genome class
	register: function() { return C_dS_visitorAlpha.register.id; }, // register where dataSets can be read from, using their id; like dS = this.register.get(id);
	title: 'visitors', // title for modal C_iARRAY.fields
	xlprefix: 'visi-', // translation prefix
	foptions: { // like fieldName:translation, used by C_catalyst.labels() see (*ct18*) for display by C_iARRAY.fields
		  id:'id', vip:'vip', company:'company', lastname:'lastname', firstname:'firstname', gender:'gender'
		, residence:'residence', address:'address', zipCode:'zipCode' , city:'city', country:'country'
		, email:'email', mobile:'mobile' , phone:'phone', language:'language' 
		, birthday:'birthday', registration:'registration' 
		, ccss:'ccss'
	},
	defaults: { // defines a set of columns that are displayed by default when the user didn't save any custom setting so far
		on: [ 'ccss', 'birthday', 'gender', 'firstname', 'lastname', 'mobile', 'zipCode', 'city' ],  // like [ fieldName1, fieldName2, ... ] in the displayed order
		sorton: { key:'lastname', order:1 }
	}
};




//////////////////////////////////////////////////////////////////////////////////////////////
//
//     V I S I T O R S    &    R E S A S     F I L E S 
//

function C_dS_file(p) {
		
	C_dS_trackingCCD.apply(this,p);
	C_dS_file.defaults.mergeto(this,p,this.tmc);
	
	// meta
	if(this.id > 0) {
		C_dS_file.register.byid.add(this.id, this);
		C_dS_file.register.byvid.add(this.visitorId, this.id, this);
	}
}
C_dS_file.register = new C_regS('byid','byvid');
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
		let v = '', d = '';
		let t = C_dS_file.defaults._t[member]; // can be '"' for strings or '' for any other 
		switch(member) {
			case 'name': v = this.name; break;
			case 'ccss': v = this.fbullet(); break;
			case 'creator': let login = C_dS_loggable.get(this.creatorId); if(login) v = login.name; break;
			case 'created': let dt = jsDateFromUnixTime(this.created); v = dt.sortable({y:true}); break;
			case 'note': 
				d = '<div style="font-size:85%; text-align:left;">'+limitlength(this.note)+'</div>';
				v = this.note;
				break;
				
			default: v = this[member]; // in all other cases, display the genuine value
		} 
		return { c:1, t:t, v:v, d:d }; // count, type, values, html display	
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
	register: function() { return C_dS_file.register.byid; }, // (*ct02*) register where dataSets can be read from, using their id; like dS = this.register.get(id);
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
		let i = C_dS_file.register.byvid.get(vid,id); // item
	C_dS_file.register.del(i); // del function called at that level will cure all registers
} 
C_dS_file.ends = function(vid) {
		let n = C_dS_file.register.byvid.ends(vid); // item
	return n;
}






function C_dS_resafile(p) {
		
	C_dS_trackingCCD.apply(this,p);
	C_dS_resafile.defaults.mergeto(this,p,this.tmc);
	
	// meta
	if(this.id > 0) {
		C_dS_resafile.register.byid.add(this.id, this);
		C_dS_resafile.register.byrid.add(this.reservationId, this.id, this);
	}
}
C_dS_resafile.register = new C_regS('byid','byrid');
C_dS_resafile.defaults = new A_df( { reservationId:0, name:'', note:'',  cssColor:0, cssPattern:0, cssTags:'', filename:'' } );
C_dS_resafile.prototype = {
	fbullet: function() {		
		let color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		let pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		let typeicon = symbol(this.fextension()||'file', 'fa-lg', 'margin:0 auto;');
		let bullet = '<div style="display:table-cell; text-align:center;" class="bullet '+color+pattern+'">'+typeicon+'</div>';
		return bullet;
	},
	bullet: function() { return this.fbullet(); }, // generic interface to C_catalyst
	codename: function() { // file name as encoded on the server. // see (*F01*)
		return this.groupId+'_'+this.reservationId+'_'+this.id;
	},
	uivalue: function(member) { // used by catalyst table display
		let v = '', d = '';
		let t = C_dS_file.defaults._t[member]; // can be '"' for strings or '' for any other 
		switch(member) {
			case 'name': v = this.name; break;
			case 'ccss': v = this.fbullet(); break;
			case 'creator': let login = C_dS_loggable.get(this.creatorId); if(login) v = login.name; break;
			case 'created': let dt = jsDateFromUnixTime(this.created); v = dt.sortable({y:true}); break;
			case 'note': 
				d = '<div style="font-size:85%; text-align:left;">'+limitlength(this.note)+'</div>';
				v = this.note;
				break;
				
			default: v = this[member]; // in all other cases, display the genuine value
		} 
		return { c:1, t:t, v:v, d:d }; // count, type, values, html display	
	},
	members: function(which) { 
		let items = new Array();
		for(let i in which) { let member = which[i]; items[member] = this.uivalue(member); }
		return items;
	},
	fextension: function() { return this.filename.split('.').pop(); }
}
C_dS_resafile.catalyst = {  // for C_catalyst, using generic features (inclusive an ability to store the user's view preferences).
	
	object: false, // check (*ct02*)
	genomec: C_dS_resafile, // genome class
	register: function() { return C_dS_resafile.register.byid; }, // (*ct02*) register where dataSets can be read from, using their id; like dS = this.register.get(id);
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
C_dS_resafile.del = function(rid, id) {
		let i = C_dS_resafile.register.byrid.get(rid,id); // item
	C_dS_resafile.register.del(i); // del function called at that level will cure all registers
}
C_dS_resafile.ends = function(rid) {
		let n = C_dS_resafile.register.byrid.ends(rid); // item
	return n;
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


function rmem() { C_regS.apply(this,['resas','atts', 'attvs', 'byvis', 'parts', 'perf', 'goods', 'series', 'payments']); };
rmem.prototype = C_regS.prototype; // C_regS defined in mobframe.js

var rmems = { // plitems, slots, visiapps, standbylist, catalyst are the available banks
	  plitems:new rmem() // that is an instance of C_regS
	, slots:new rmem()
	, visiapps:new rmem()
	, standbylist:new rmem()
	, catalyst:new rmem() 
	, flush: function(which) { rmems[which] = new rmem() } } 

var rgr = new C_regS('id'); // reservations general register

	//////////////// A T T E N D E E S

function C_dS_att_visitor(b,p) { // C_dS_visitor's and C_dS_resource's must be created first
	C_dS_att_visitor.defaults.mergeto(this,p);
	rmems[b].attvs.add(this.resaId, this.resourceId, C_dS_visitor.get(this.resourceId));
	rmems[b].byvis.add(this.resourceId, this.resaId, this);
	if(vbs) vlog('datasets.js','C_dS_att_visitor','new','id:'+this.id+', grpId:'+this.resaId); 
};
C_dS_att_visitor.defaults = new A_df({id:0, resaId:0, resourceType:0, resourceId:0});
C_dS_att_visitor.getbyvisitor = function() { // dS_reservation objects must be loaded prior to calling this function
	
	const resasbyvisitor = []; // like resasbyvisitor[visitorid][resaid] = dS_reservation
	const attendeesbyvisitor = rmems['visiapps'].byvis.get();
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
	rmems[b].atts.add(this.resaId, this.resourceType, this.resourceId, C_dS_resource.get(this.resourceId)); // here we hook up straight to the C_dS_resource, skipping the indirection of C_dS_attendee
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
	const timing = { cin:this.jsDateIn.HHmm(), out:this.jsDateOut.HHmm(), duration:duration(this.jsDateOut.span(this.jsDateIn)) };
	const schedule = {  cin: C_XL.date(this.jsDateIn,{abreviation:'abr',weekday:true}), out: C_XL.date(this.jsDateOut,{abreviation:'abr',weekday:true})};
	this.text = { time:timing, date:schedule };
	
	rmems[this.rmem].parts.add(this.groupId, this.midnight, this.id, this);
};
C_dS_resapart.defaults = new A_df({id:0, groupId:0, cueIn:0, cueOut:0, archived:0});
C_dS_resapart.prototype = {
	getpost: function() { return this.cueIn+'-'+this.cueOut; },
	resa: function() { return rmems[this.rmem].resas[this.groupId];	},
	clone: function() { 
		const part = new C_dS_resapart(this.rmem, [this.id, this.groupId, this.cueIn, this.cueOut, this.archived]);
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




	////////////////    R E S E R V A T I O N


function C_dS_reservation(b, p) { 
	C_dS_trackingCCD.apply(this,p);
	C_dS_reservation.defaults.mergeto(this,p,this.tmc); // tmc stands for 'tracking members count'
	rmems[b].resas.add(this.id, this);
	rgr.id.add(this.id, this);
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
		const level = C_dS_details.get(mode, type).details; 
		if(vbs) vlog('dbAccess','C_dS_reservation','details','mode:'+mode+', type:'+type+', level:'+level);
		const info = [], single = mobminder.account.single;
		let s=0, v=0, r=0;
		if(level & details.schedule){ info[details.schedule] = this.text.span; s++ }
		if(level & details.duration){ info[details.duration] = '('+this.text.time.duration+')'; s++ }
		if(level & details.rtags) 	{ info[details.rtags] = this.rtags({size:'95%', marginleft:'.6em', marginbetween:'.2em'}); s+= info[details.tags]?1:0 }
		
		let br = ''; // in stickers, new line before writing the name, only when some info is displayed before the name
		if(mode==planning.horizontal) br = '<br/>';
		
		if(this.visicount>1 && (level&details.visitor)) // more than 1 visitor (ergo rule is to not flood the sticker with too much text)
			info[details.visitor] = C_XL.w('many visitors');
		else if(this.visicount) { // one visitor (most of the cases)
				let tags = false;
			if(level & details.vtags)		{ tags = {size:'95%', marginleft:'.4em', marginbetween:'.1em'}; s++ };
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
				let divstyle = 'margin:.3em 0 .3em 0;'; // padding-left:.3em; border-left:2px solid rgba(0,0,0,.5); 
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
		
		let resa = new Array(info[details.resanote],info[details.workcodes],info[details.color],info[details.attendance]); 
			resa = resa.join(' ')+(r?br:'');
			
		return schedule+visitor+resa;
		
	},
	rtip: function(o) { // text for sticker tooltips
		// mode is a planning view mode like { horizontal:2, vertical:1, text:3, hourly:4, ... }
		// type is a resource type
		o = o || { displaydate:false };	
		if(vbs) vlog('dbAccess','C_dS_reservation','details','');
		let summup = new Array();
		const separator = '<hr/>';
		const padder = '<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		
		// schedule		
			const tags = this.rtags({size:'105%', marginleft:'0em', marginbetween:'0.1em'});
			const date = o.displaydate ? this.humandate + ' ' + C_XL.w('at',{cap:0}) + ' ' : '';
			const span = date+this.text.span; // set by this.rmeta;
			const duration =this.text.time.duration;
			let header = '';
		
		let i1 = '',i2 = '',i3 = '', css = '';
		const d = '<span style="font-size:80%;">('+duration+')</span>';
		if(this.text.time.out=='00:00') {
			// see (*sp01*)
			i1 = '';
			i2 = '<div class="sticker-tip-offdays-left">'+span+'</div>';
			i3 = '<div class="sticker-tip-offdays-right">'+(tags ? tags + '&nbsp;&nbsp;' : '')+d+'</div>';
			css = ' tip-vertical';
			
		} else { // horizontal
				const endtime = this.text.time.endtime;
				const starttime = this.text.time.starttime;
			// see (*sp02*)
			i1 = '<div class="sticker-tip-left">'+starttime+'</div>';
			i2 = '<div class="sticker-tip-center">'+(tags ? tags + '&nbsp;&nbsp;' : '')+d+'</div>';
			i3 = '<div class="sticker-tip-right">'+endtime+'</div>';
			css = ' tip-horizontal';
		}
		
		summup.push('<div class="sticker-tip-header-div'+css+'">'+i1+i2+i3+'</div>');
		
		
		// visitor(s)
		const levelH = C_dS_details.get(planning.horizontal, class_bCal).details; // see (*dt*)
		const levelV = C_dS_details.get(planning.vertical, class_bCal).details;  
		const showAddress = this.visicount<5; // ((levelH|levelV)&(details.address|details.zipcode)); // if any of vertical or horizontal view has enabled zip code or address, we display the address.
		
		if(this.visicount>12) 
			summup.push(C_XL.w('many visitors'));
		else if(this.visicount) { // We list them
			let c = 0; if(this.visicount>1) c=1; let hr = '';
			for(visiId in this.visitors) { 
				if(!this.visitors[visiId]) { console.log('Visitor id '+visiId+'is referenced but does not exists anymore'); continue; } // the visitor dS has been deleted but an attendee still exists (should never happen)
				const dS_visitor = this.visitors[visiId];
				// let x = ''; if(c) x = '&nbsp;'+c+'.&nbsp;'; // when the counter is activated, this displays a numbering, else nope.
					summup.push(hr);
					// const n = dS_visitor.vname({gender:true, br:false/*this options breaks before*/});
					const n = dS_visitor.vtitle('mobtext',{ foresatip:true });
					summup.push(n);
					
					const tagsregmobile = [];
						const t = dS_visitor.vtags({size:'110%', marginleft:'0.5em', marginbetween:'0.2em', verbose:true, inline:true });
						if(t) {
							const td = '<div style="padding-left:3px;" class="mobtext">'+t+'</div>'; //  inline airunder
							tagsregmobile.push(td);
						}
						
						const r = dS_visitor.registration?dS_visitor.registration+' ':'';
						if(r) {
							const id = '<div class="fa fa-09x fa-id-card fa-padded mobtext"></div>';
							const rd = '<div>'+id+r+'</div>';
							tagsregmobile.push(rd);
						}
						
						const m = dS_visitor.mobile?dS_visitor.ergomobile+' ':'';
						if(m) {
							const mobile = '<div class="fa fa-09x fa-mobile-alt fa-padded mobtext"></div>';
							const md = '<div>'+ mobile + m+'</div>';
							tagsregmobile.push(md);
						}
					if(tagsregmobile.length) {
						const style = this.visicount>5?'flex':'grid';
						const joined = '<div style="display:'+style+';">'+tagsregmobile.join('')+'</div>';
						summup.push(joined);
					}
					
					
					
					// const b = dS_visitor.vbullet({ifany:true, margin:false, verbose:false });
					if(showAddress) { // to be changed display details modal M_details (modals.js) by choosing "zipCode"
						if(dS_visitor.address||dS_visitor.zipCode||dS_visitor.city) {
							const pack = [];
							if(dS_visitor.address) pack.push(dS_visitor.address);
							if(dS_visitor.zipCode) pack.push(dS_visitor.zipCode);
							if(dS_visitor.city) pack.push(dS_visitor.city);
							const home = '<div class="fa fa-09x fa-home fa-padded mobtext"></div>';
							const a = '<div>'+home+pack.join(', ')+'</div>';
							summup.push(a);
						}
					}
				
				if(dS_visitor.note&&this.visicount<6) { // we display notes up to 3 visitors
						const useredit = '<div style="padding-top:.3em;" class="fa fa-09x fa-user-edit fa-padded mobtext"></div>';
							const charmax = 800 / this.visicount;
						let n = dS_visitor.note.substr(0,charmax).htmlize(); if(dS_visitor.note.length>charmax) n += '...';
						const nd = '<div>'+n+'</div>';
						const style = 'display:grid; grid-template-columns:auto 1fr; column-gap:0em; align-items:start; padding-top:.6em;';
					const grid = '<div style="'+style+'">'+useredit+nd+'</div>';
					summup.push(grid);
				}
				if(c) {
					c++;
					hr = this.visicount>5 ? '' : '<hr class="short"></hr>';
				}
			}
		}
		
		
		// resa attributes
		if(mobminder.account.has.workcodes) 
			if(this.performances) // workcodes (including price)
			{
				let p=0; for(let pid in this.performances) p++;
				// summup.push(separator+(p>1?C_XL.w('workcodes'):C_XL.w('workcode'))+':');
				summup.push(separator);
				const cog = '<div class="fa fa-users-cog fa-padded mindertext"></div>';
				if(p>10) 
					summup.push(C_XL.w('many performances'));
				else if(p) {
					let br = '';
					let c = 0; if(p>1) c=1;
					for(let perfId in this.performances) { 
						if(!this.performances[perfId]) { console.log('Performance id '+perfId+'is referenced but does not exist anymore or in this config'); continue; } // the workcode dS has been deleted but a performance using this workcode still exists (should never happen)
						const dS_workcode = this.performances[perfId];
						let x = ''; if(c) x = ''; // '<b>'+c+'</b>. '; // when the counter is activated, this displays a numbering, else nope.
							const b = dS_workcode.wbullet();
							const n = dS_workcode.name;
							const p = dS_workcode.price?' '+C_XL.w('euros') + (dS_workcode.price/100).toFixed(2)+'-':'';
						summup.push(br+cog+x+b+n+p);
						// if(dS_workcode.note) summup.push('<br/>'+dS_workcode.note);
						if(c) c++;
						br = '<br/>';
					}
				}
			}
		// note
		if(this.note) {
				const charmax = 800 - this.visicount ;
				let n = this.note.substr(0,charmax).htmlize(); if(this.note.length>charmax) n += '...';
					n = '<div>'+n+'</div>';

			const calendar = '<div style="padding-top:.1em;" class="fa fa-calendar-edit fa-padded mindertext"></div>'; // which is an icon from fontawsome.com
			// const t = '<table style="margin:0 auto 0 0;"><tr><td style="vertical-align:top; width:1%;">'+calendar+'</td><td>'+n+'</td></tr></table>';

				const style = 'display:grid; grid-template-columns:auto 1fr; column-gap:0em; align-items:start;';
			const grid = '<div style="'+style+'">'+calendar+n+'</div>';
			// this t <div> behaves differently in Chrome and in Firefox. In Firefox the table behaves as an inline-block, in Chrome the table takes 100% of the container (and pushes it to max-width;).
			// How can I avoid this difference in behaviour? I am ok to use grid or flex instead of <table>.
			summup.push(separator+grid);
		}
		
		// performances
		const perfcss = this.perfcss({raw:true}); // { color:false, pattern:false } color and pattenr according to performances
		// console.log('C_dS_visitor::rtip() ','perfcss.color',perfcss.color,'this.cssColor',this.cssColor,'perfcss.pattern',perfcss.pattern,'this.cssPattern',this.cssPattern);
		
		// color & pattern
		const showcolor = (perfcss.color!=this.cssColor)||(perfcss.pattern!=this.cssPattern); // show color only if it is different from what performances would impose.
		if(showcolor) if(this.cssColor || this.cssPattern) {
			const bullet = this.bullet(); // a <div class="bullet">
			const pack = [];
			if(this.text.ccss.color) pack.push(this.text.ccss.color);
			if(this.text.ccss.pattern) pack.push(this.text.ccss.pattern);
			// summup.push(separator+C_XL.w('color')+'/'+C_XL.w('pattern')+':'+this.text.ccss.color+' '+this.text.ccss.pattern);
			const cssnames = pack.join(', ');
			summup.push(separator+bullet+cssnames);
		}
		
		if(!mobminder.account.single) summup.push(separator+this.text.resources.bufc); // separator+C_XL.w('with')+':'+
		
		return '<div style="line-height:1.3em;">'+summup.join('');+'</div>';
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
		rmems[this.rmem].atts.del(this.id);
		rmems[this.rmem].attvs.del(this.id);
		rmems[this.rmem].parts.del(this.id);
		rmems[this.rmem].perf.del(this.id);
		rmems[this.rmem].resas.del(this.id);
		const c = rmems[this.rmem].resas.get(this.id);
		// console.log('C_dS_reservation::unregister() c=',c); // should be undefined if the deletion went well
		
	},
	clone: function(bank) { // bank: specifies a new bank storage for the clone, does not copy payments

		let cloneid = -this.id; if(cloneid==0) cloneid = -1; // be careful with this, see (*mr30*)
		
		for(let pid in this.performances)
			if(this.performances[pid]) // some login view might be defined that make this performance invisible to this login, because not identified as an expert
				new C_dS_performance(bank||this.rmem, [-pid,cloneid,pid,this.performances[pid].visitorId,this.performances[pid].checklist]);
		for(let vid in this.visitors)
			new C_dS_att_visitor(bank||this.rmem, [-vid,cloneid,class_visitor,vid]);
		
		for(let aclass in this.resources)
			for(let rid in this.resources[aclass])
				new C_dS_attendee(bank||this.rmem, [-rid,cloneid,aclass,rid]);
		
			const args = [cloneid, this.groupId, this.created, this.creator, this.creatorId, this.changed, this.changer, this.changerId, this.deleted, this.deletorId ];
			for(let a in C_dS_reservation.defaults) // is an instance of A_df
				if(a in A_df.prototype) continue; // no action for prototype functions
				else args.push(this[a]); // build an array that reflects the current object
				
		const r = new C_dS_reservation(bank||this.rmem, args); // see (*cp01*)
			
		
		// console.log('M_RESA::cloned('+r.assess+') (11 = appointment, 13 = event)',r);
		return r;		
	},
	changeattendance: function(ids, options) {
		options = options || {}; // like {rscsonly:true}, used by P_column::touching()
		rmems[this.rmem].atts.del(this.id, 1);
		if(!options.rscsonly) rmems[this.rmem].attvs.del(this.id, 1); // avoid visitors when resettting only resources (in this case, ids is not expected to contain any class_visitor)
		for(let aclass in ids) {
			for(let x in ids[aclass]) { const id = ids[aclass][x];
				switch(aclass|0) {
					case class_bCal:
					case class_uCal:
					case class_fCal: new C_dS_attendee(this.rmem, [-id,this.id, aclass,id]); break;
					case class_visitor: new C_dS_att_visitor(this.rmem, [-id,this.id, aclass,id]); break;
				}
			}
		}
		if(vbs) vlog('datasets.js','C_dS_reservation','changeattendance','id:'+this.id+', grpId:'+this.groupId); 
		return this;
	},
	changeperformance: function(workcodes) {
		rmems[this.rmem].perf.del(this.id, 1);
		for(let wid in workcodes) new C_dS_performance(this.rmem, [-wid,this.id,wid]);
		if(vbs) vlog('datasets.js','C_dS_reservation','changeperformance','id:'+this.id+', grpId:'+this.groupId); 
		return this;
	},
	changegoods: function(products) {
		rmems[this.rmem].goods.del(this.id, 1);
		// for(let pid in products) new C_dS_goods(this.rmem, [-pid,this.id,pid]);
		if(vbs) vlog('datasets.js','C_dS_reservation','changegoods','id:'+this.id+', grpId:'+this.groupId); 
		return this.rmeta();
	},
	changecue: function(cueIn) {
		const duration = this.cueOut - this.cueIn;
		this.cueOut = cueIn + duration;
		this.cueIn = cueIn;
		if(vbs) vlog('datasets.js','C_dS_reservation','changecue','id:'+this.id+', grpId:'+this.groupId); 
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
		options = options || {}; // like  { marginleft:'0.5em', marginbetween:'0.2em', size:'100%', linefeed:5, those:'48360!48362!48361' }
		let tagsids = this.cssTags.split('!');
		if(options.those!==undefined) tagsids = options.those.split('!');
		
		if(tagsids.length) {
			let margin = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
			let size = ''; if(options.size) size=' font-size:'+options.size+';';
			
			let c = -1;
			let mleft = options.marginleft ? ' margin-left:'+options.marginleft+';' : '';
			let mbetw = options.marginbetween ? ' margin-left:'+options.marginbetween+';' : '';
			for(let x in tagsids) {
					let tagid = tagsids[x];
				if(tagid==='') continue; // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string when none is selected, see (*ct20*)
					let tagcss = C_dS_customCss.get(tagid).cssName;
				if(options.linefeed) if(++c==options.linefeed) { tags = tags+'<br/>'; c = 0; margin = mleft; } // such that a carriage return is inserted every 4 items (displays 4 items on each line)
					let style = 'style="display:inline-block; position:relative; bottom:.1em;'+margin+size+'"';
				tags = tags+'<div '+style+' class="tag '+tagcss+'"></div>';
				margin = mbetw; // reduce the margin between tags, only the first one is longer
			}
		}
		return tags;
	},
	
	// e-payment
	haspayment: function() {
		
		if(this.id<=0) return false; // a reservation under creation process can not hold payments
		
			let bank = this.rmem;
		let payments = payregs[bank].byresaid.get(this.id); // see (*ep09*)
		// let count = 0;
		// for(let x in payments) { 
			// let payment = payments[x];
			// count++;
		// }
		return payments; // which is in units of cents
	},
	getpaidsum: function(paymean) {
		if(paymean===undefined) paymean = false; // such that the function defaults either by passing false or undefined
		let billamount = 0;
		if(paymean==C_dS_payment.type.receivables) { // we calculate the due balance (due by the client = positive amount, to be refund = negative amount)
			billamount = this.billamount;
			paymean = false; // so to take any payment type into account
		};
		if(this.id<=0) return 0; // a reservation under creation process can not hold payments
		
			let bank = this.rmem;
		let payments = payregs[bank].byresaid.get(this.id);
		let sum = 0;
		for(let x in payments) { 
			let payment = payments[x];
			if(paymean!==false) if(payment.paymean!=paymean) continue; // if paymean filter was provided, account only payments of this type
			if(payment.transtatus==C_dS_payment.status.code.success) sum += payment.amount;
		} 
		if(billamount) sum = billamount-sum; // this calculates (sum paid)-(total bill) = the due balance
		return sum; // which is in units of cents
	},
	getpaycomm: function(paymean) { // communication text that we associate to e-payments 
			// let date = C_XL.date(this.jsDateIn,{abreviation:'full',weekday:true, year:true});
			let date = this.jsDateIn.getUnixTime({wseconds:false});
		
		let pid = '';
		switch(paymean) {	// see (*ep22*) in post/payment.php
			case C_dS_payment.type.mobqrcode: 	paymean = 'ep-paytype sepa qr'; pid = ' {pid}'; break;
			
			case C_dS_payment.type.notset: 
			case C_dS_payment.type.cash:
			case C_dS_payment.type.payconiq:
			case C_dS_payment.type.cards:
			case C_dS_payment.type.softpos:
			case C_dS_payment.type.hardpos:
			case C_dS_payment.type.onlinepayco:
			case C_dS_payment.type.onlinecards:
			default:
			
		}
			
			let resource = 'bCAL'; 
			if(this.bCal) resource = this.bCal.signature ? this.bCal.signature : this.bCal.name; // signature or nothing? (some resource name in call center contain guidelines, not to be passed to communication)
			
			let visitor = this.visitor ? this.visitor.lastname : 'X';
			// let text = date+' '+C_XL.w('at',{cap:0})+' '+time+' - '+resource+mobminder.account.name;
			let text = mobminder.account.name+' '+visitor+' '+date+' '+resource+pid+'   ';
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
		const prfs = this.performances;
		const p = new Array();
		for(let id in prfs)
			if(prfs[id])	
				p.push(prfs[id].name);
			// e.g. c=3 when three performances are attached to the reservation
		return { c:p.length, t:'"', v:p }
	},
	rpayments: function(paymean,options) {
		options = options || {file:false};
		let sumofpayments = this.getpaidsum(paymean);
		// c:1 because one line per reservation
		// t:'' because the value is numeric
		// d:'some text or html' containing the € symbol (display value)
		// v:sum amount in cents (summable value)
		let display = '&nbsp;';
		if(options.file) sumofpayments = insertcoma(sumofpayments);
		else if(sumofpayments) display = C_iEDIT.ergoprice(sumofpayments)+' '+C_XL.w('euros');
		return { c:1, t:'', v:sumofpayments, d:display };
	},
	rdateIn: function() { 
			const d = C_XL.date(this.jsDateIn, { abreviation:'full', weekday:true, time:false });
			const v = this.jsDateIn.sortable();
		return { c:1, t:'"', v:{0:v}, d:d }; // on html screen displays date in a human friendly format
		// return 
	},
	rdateOut: function() { 
			const d = C_XL.date(this.jsDateOut, { abreviation:'full', weekday:true, time:false });
			const v = this.jsDateIn.sortable();
		return { c:1, t:'"', v:{0:v}, d:d }; // on html screen displays date in a human friendly format
	},
	rcueIn: function()  { return { c:1, t:'"', v:{0:this.text.time.cin} } },
	rcueOut: function() { return { c:1, t:'"', v:{0:this.text.time.out} } },
	rduration: function() { // (*ct23*)
				const v = ((this.cueOut-this.cueIn)/60)|0; // which is a number minutes
			const hours = (v/60)|0;
			const mntes = v%60;
		const display = (hours?hours+'h':'')+(mntes?String(mntes).padStart(2, '0')+'mn':'');
		return { c:1, t:'', v:{0:v}, d:display };
	},
	
	// used from e.g M_RESA
	rsymbol: function(which) { // defines basic iconic symbol for this reservation, depending on assess
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
	rtitle: function(xlo, options) { // Also defines title for this M_RESA window, including symbol (*M01*)
	
		options = options || {}; // like { thosetags:'forces other tags instead of default ones' }
			let title, symbol = 'app'; 
				xlo = xlo || { cap:true, that:false, icon:true };
			const t = xlo.that?xlo.that+' ':''; // xlo.that can be ['this' or 'the'] // see (*rs04*)
		switch(this.assess) {
			case resaclass.appointment: title = C_XL.w(t+'appointment',xlo); break; // see (*rs04*) how the value of t is used in language.js
			case resaclass.event: title = C_XL.w(t+'event',xlo); symbol = 'event'; if(this.is.calendar) symbol = 'calendar'; break;
			case resaclass.fcalwide: title = C_XL.w('tracking',xlo)+' '+C_XL.w('single'+class_fCal); break;
			default: title = 'title?';
		}
		if(this.peerId && (this.assess!=resaclass.fcalwide)) title += ' '+C_XL.w('with')+' '+C_XL.w('single'+class_fCal);
		
		// console.log('rtitle() '+title);
		
		if(this.id <= 0) { // new reservation
			if(this.replan) { title += ': '+C_XL.w('replan',xlo); symbol = 'replan'; }
				else if(this.duplicate) { title += ': '+C_XL.w('duplicate',xlo); symbol = 'new'; }
					else { title += ': '+C_XL.w('new',xlo); symbol = 'new'; }
		}
		if(this.deletorId) 
			if(this.rescheduled) { title += ': '+C_XL.w('rescheduled',xlo); symbol = 'deleted'; }
				else { title += ': '+C_XL.w('deleted',xlo); symbol = 'deleted'; }
				
		if(this.is.prebooking) 
			{ title += ': '+C_XL.w('resa busy',xlo); symbol = 'new'; }
		
		let i = '';
		if(xlo.icon) {
			i = this.rsymbol(symbol); // basic symbols for events, appointment, new reservation
		
			if(options.thosetags!==undefined) { // specific tags are selected by the user during modal edition
				if(options.thosetags!=='')
					i = ' '+this.rtags({marginbetween:'6px', marginleft:'.7em', size:'1em', those:options.thosetags });
			}
			else if(this.cssTags) { // specific tags are set in the dS
				i = ' '+this.rtags({marginbetween:'6px', marginleft:'.7em', size:'1em' });
			}
		}
		
		return title+i;
	},
	
	// private
	rmeta: function() { // is basicaly a magnifier that relinks all attribute objects from other classes arriving sooner in the stream.
	
		if(vbs) vlog('datasets.js','C_dS_reservation','rmeta','id:'+this.id+', grpId:'+this.groupId); 
		// meta data
		this.jsDateIn = new Date(this.cueIn*1000);
		this.jsDateOut = new Date(this.cueOut*1000);
		this.sortable = { cuein:this.jsDateIn.sortable(), cueout:this.jsDateOut.sortable() };
		
			const midnightjd = this.jsDateIn.clone({midnight:1});
		this.midnight = midnightjd.stamp();
		this.timeshift = midnightjd.timeshift();
		
		// re-link this object to its attributes (note that all attributes were heading the stream for proper work)
		this.performances = rmems[this.rmem].perf.get(this.id); // is undefined or an array like this.performances[id] => o_dS_workcode or false 
		this.goods = rmems[this.rmem].goods.get(this.id); // is undefined or an array like this.goods[id] => o_dS_product or false 
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
		const cals = this.resources = rmems[this.rmem].atts.get(this.id) || [];
		this.assess = this.resaClass();
		// console.log('M_RESA.rmeta() assess = '+this.assess+' (11 = appointment, 13 = event)');
		
		this.bCal = false; // is an o_dS_resource or false
		if(class_bCal in cals) for(let b in cals[class_bCal]) { this.bCal = cals[class_bCal][b]; break; } // identifies the first bCal in place 
		
		if(this.id<=0) { // set initial color, pattern and tags for new objects
		
			const iscopypaste = mobminder.app.state.duplicate; 
			// this must behave correctly when the M_RESA changes the clone resaclass
			// note that R_search might have duplicated ccss in a fresh new resa in case of duplicate or replan, check R_search::this.state.duplicate

			// this.cssColor, this.cssPattern, this.cssTags may arrive with values as a copy/paste dS object, // see (*cp01*)
			if(!iscopypaste) {
				this.cssColor 	= this.cssColor?	this.cssColor:		mobminder.account.defCcss[ccsstype.color][this.assess];
				this.cssPattern = this.cssPattern?	this.cssPattern:	mobminder.account.defCcss[ccsstype.pattern][this.assess];
				this.cssTags 	= this.cssTags?		this.cssTags:		mobminder.account.defCcss[ccsstype.tag][this.assess]; // see (*rs05*)
			} else {
				// during copy/cut/paste operations, we do not rely on default colors, we just keep custom css as is.
				// console.log('C_dS_reservation::rmeta() iscopypaste, cssColor='+this.cssColor+', cssPattern='+this.cssPattern+', cssTags='+this.cssTags);
			}
			
			// this.cssColor 	= mobminder.account.defCcss[ccsstype.color][this.assess];
			// this.cssPattern = mobminder.account.defCcss[ccsstype.pattern][this.assess];
			// this.cssTags = mobminder.account.defCcss[ccsstype.tag][this.assess]; // see (*rs05*)
			
			// console.log('M_RESA.rmeta(new dS) cssColor = '+this.cssColor+'  cssPattern = '+this.cssPattern+' cssTags = '+this.cssTags+' ');
		}
		this.resetCssclass(); // depends on this.bCal // see (*st11*), paperclips see (*pc01*), tags are not set there
	
		// clusters and parts
		this.iscluster = this.iscluster?rmems[this.rmem].parts.get(this.id):0;
		if(this.iscluster) for(let midnight in this.iscluster) for(let partId in this.iscluster[midnight])  { 
			let o = this.iscluster[midnight][partId]; o.css = this.css; o.assess = this.assess;
		};
		
			const jsnow = new Date(); const phpnow = jsnow.getPHPstamp();
			const insameyear = this.jsDateIn.sameYear(this.jsDateOut);
			const nothisyear = this.jsDateIn.sameYear(jsnow);
			const displayear = (!insameyear)||(!nothisyear);
			const sameday = this.jsDateIn.sameday(this.jsDateOut); // starts and ends in the same calendar day
			const soon = this.jsDateIn.isclose(16, jsnow); // starts in the upcoming 16 hours, keep this setting equal to see here (*ic00*), see here (*ic10*)
			const calendar = this.jsDateIn.calendar(this.jsDateOut); // starts today
			const prebooking = C_dS_prebooking.get4resa(this.id); // returns false or a dS_prebooking
			const d = this.duration();
			const timing = { cin:this.jsDateIn.HHmm(), out:this.jsDateOut.HHmm(), duration:d, starttime:this.jsDateIn.HHmm(false,''), endtime:this.jsDateOut.HHmm(false,'') };		
			
		this.is = { midnight:timing.cin=='00:00', future:(this.cueIn>phpnow), past:(this.cueOut<phpnow), soon:soon, sameday:sameday, calendar:calendar, fromserie:(this.serieId), prebooking:!!prebooking };
		// series
		this.serie = rmems[this.rmem].series.get(this.serieId) || new C_dS_resa_serie(this.rmem,C_dS_trackingCCD.tnew(0, mobminder.account.id).concat(['' /*stitle*/])); // (*s01*)
		
		// text preset
		
		
		const joinresources = function(array, o = {iconic:false}) { // join names of objects from a 1 or 2 dimensions array
			
			const names = [];
			for(let i in array) {
				const dS = array[i]; // that is a dS_resource
				if(dS===undefined) { console.log('joinnames::undefined name for resource id='+i); continue; }
	// console.log(dS.name);
	
				// const display = dS.getrscname();
					const tag = dS.tag?'<div class="'+C_iSKIN.tagcss(dS.tag)+'" style="font-size:1.1em; width:1.4em; line-height:70%; padding-left:.6em;"></div>':'';
					const headertitle = dS.name+tag; // this raw and idle header title is needed here (*hp01*)
				
				if(o.iconic) {
					const rcss = 'resource-label '+(dS.color==0?'':'c'+dS.color); // do not display the c0 color that is "no color"
					const style = 'display:inline-block; line-height:80%; position:relative; top:-1px; right:-1px; font-size:.8em; padding:.5em .9em; margin:0 0 .3em 0;'; // see also planning.css .resource-label
					const display = '<div style="'+style+'" class="'+rcss+'">'+headertitle+'</div>';
					names.push(display); // case of array like [id] = name
					
				} else { // textual only
				
					names.push(headertitle); // case of array like [id] = name
					
				}
				
			}
			const namesfinal = names.length ? names.join(' ') : '';
			return namesfinal;
		}
		const joinworkcodes = function(array, o = {withbullet:false}) { // join names of objects from a 1 or 2 dimensions array
			
			const names = [];
			for(let i in array) {
				const dS = array[i]; // that is a dS_workcode
				if(dS===undefined) { console.log('joinnames::undefined name for workcode id='+i); continue; }
	// console.log(dS.name);
				const b = o.withbullet ? dS.wbullet() : '';
				const display = '<div>'+b+dS.name+'</div>';
				names.push(display); // case of array like [id] = name
			}
			const namesfinal = names.length ? names.join('') : '';
			return namesfinal;
		}
		
			const dateout = this.jsDateOut.seconds() ? C_XL.date(this.jsDateOut,{abreviation:'abr',weekday:true, year:displayear}) : C_XL.date(this.jsDateOut.clone().increment({d:-1}),{abreviation:'abr',weekday:true, year:displayear});
		const schedule = {  cin:C_XL.date(this.jsDateIn,{abreviation:'abr',weekday:true, year:displayear}), out:dateout };
			
			const bufpack = [];
				const b = joinresources(cals[class_bCal]);
				const u = joinresources(cals[class_uCal]);
				const f = joinresources(cals[class_fCal]);
			if(b) bufpack.push(b); // received as C_dS_resources instances
			if(u) bufpack.push(u);
			if(f) bufpack.push(f);
		const buf = bufpack.join(', '); // 2 dimensional join for sticker-resa
			
			const bufcpack = [];
				const bc = joinresources(cals[class_bCal],{iconic:true});
				const uc = joinresources(cals[class_uCal],{iconic:true});
				const fc = joinresources(cals[class_fCal],{iconic:true});
			if(bc) bufcpack.push(bc); // received as C_dS_resources instances
			if(uc) bufcpack.push(uc);
			if(fc) bufcpack.push(fc);
		const bufc = '<div>'+bufcpack.join(' ')+'</div>'; // 2 dimensional join for sticker-resa
		
		
		const w = joinworkcodes(this.performances); // received as C_dS_workcode instances
		const c = this.cssColor ? C_dS_customCss.get(this.cssColor).name : '';
		const p = this.cssPattern ? C_dS_customCss.get(this.cssPattern).name : '';
		
		let span = this.cueOut-this.cueIn;
		if(this.is.sameday) span = timing.starttime;
			else if(span==86400&&this.is.calendar) span = C_XL.w('ondate')+' '+schedule.cin;
				else if(this.is.calendar) span = C_XL.w('fromdate')+' '+schedule.cin+' '+C_XL.w('todate')+' '+schedule.out+' '+C_XL.w('date included');
					else span = C_XL.w('fromdate')+' '+schedule.cin+' '+C_XL.w('at',{cap:0})+' '+timing.cin+' '+C_XL.w('todate')+' '+schedule.out+' '+C_XL.w('at',{cap:0})+' '+timing.out;

		this.text = { time:timing, date:schedule, span:span, resources:{ b:b, u:u, f:f, buf:buf, bufc:bufc }, workcodes:w, ccss:{ color:c, pattern:p } };
		this.humandate = humandate(this.cueIn, {abreviation:'full', time:false } );
		return this;
	},
	cssclass: function(assess) { // produces a css string usable by stickers and by bullets. Tags are not concerned here.

		const perfcss = this.perfcss({raw:false}); // { color:false, pattern:false }, when specified, use the performance color or pattern
	
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
		
		
			// files
		if(mobminder.account.usefiles) { // paperclips see (*pc01*)
			const hasfiles = C_dS_resafile.ends(this.id);
			// console.log('C_dS_reservation::cssclass() resaid '+this.id+' / '+hasfiles+' files');
			switch(hasfiles) {
				case 0: break;
				case 1: css+=' hasfile'; break; 
				default: // which is 2 or more
					css+=' hasfiles';
			}
		}
		
		return css;
	},
	perfcss: function(o = {raw:false}) { // raw = true returns C_dS_customCss id, raw = false returns ccss color code ( like c222 so 222 )
		const perfcss = { color:false, pattern:false }; // when specified, use the performance color or pattern
		for(let id in this.performances) { 
			const workcode = this.performances[id]; // this can collect pattern and color from two different assigned performances
			if(!workcode) continue; // workcode has been deleted from config
			if(workcode.ccss.color) perfcss.color = o.raw ? workcode.cssColor : workcode.ccss.color;
			if(workcode.ccss.pattern) perfcss.pattern = o.raw ? workcode.cssPattern : workcode.ccss.pattern;
		};
		return perfcss;
	},
	resetCssclass: function() {
		let css = this.cssclass(this.assess);		if(this.deletorId) 
		if(this.rescheduled) css = 'resa resa-deleted p801'; // p801 is hashed decrementing
			else css = 'resa resa-deleted p800'; // p800 is hashed incrementing
		this.tipcss = ''+css;
		// console.log('resetCssclass = ',this.tipcss);
		this.css = css;
	},
	resaClass: function() {
		let resources = this.resources; if(!resources) return resaclass.event; // normally this never happens, it is a resa without attendee
		
		let r = resaclass.event
		if(this.visicount) // there is a visitor
			if(resources[class_bCal]) r = resaclass.appointment;
				else r = resaclass.fcalwide; // only a visitor and an fCal, never a bCal
		// there is no visitor
		// console.log('resaClass() returns '+r);
		return r; // a single type of resource is assigned (vacation)
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
		//  CASE 2: overday spreading reservation (returned in three parts for this example)
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
	uivalue: function(member, options) {	// for C_catalyst, see (*ct04*)
		options = options || {file:false};
		let pt = C_dS_payment.type;
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
			
			case 'payments': return this.rpayments(false,options);
			case 'cash': return this.rpayments(pt.cash,options);
			case 'mobqrcode': return this.rpayments(pt.mobqrcode,options);
			case 'payconiq': return this.rpayments(pt.payconiq,options);
			case 'softpos': return this.rpayments(pt.softpos,options);
			case 'hardpos': return this.rpayments(pt.hardpos,options);
			case 'onlinepayco': return this.rpayments(pt.onlinepayco,options);
			case 'onlinecards': return this.rpayments(pt.onlinecards,options);
			case 'receivables': return this.rpayments(pt.receivables,options);
			
			case 'bCals': return this.rresources(agClass.bCal);
			case 'uCals': return this.rresources(agClass.uCal);
			case 'fCals': return this.rresources(agClass.fCal);
			case 'note':
				let div = '<div style="font-size:85%; text-align:left;">'+this.note+'</div>';
				return { c:1, t:'"', v:this.note, d:div }; // c is the number of items (if more than one, you pass arrays), t is text or integer, v is the value, d is the value with decoration.

			
			case 'ccss':
				let ccss = [];
					if(this.cssColor) ccss.push(C_dS_customCss.get(this.cssColor).name);
					if(this.cssPattern) ccss.push(C_dS_customCss.get(this.cssPattern).name);
				return { c:ccss.length, t:'"', v:ccss, d:this.bullet() }; // d is the html  display value, v contains the names: they are written in the csv export
			
			case 'tags':
				let tagsnames = [], tagsicons = '';
				if(this.cssTags) { // which is the cssTags field from DB they appear like 48360!48362!48361 or !48360!48362!48361! or an empty string when none is selected, see (*ct20*)
					// note that this works equally for C_dS_reservation and also C_dS_visitorAlpha or C_dS_chat_thread
					let tagsids = this.cssTags.split('!'); 
					for(let x in tagsids) { 
						let tagid = tagsids[x]; if(tagid==='') continue;
						tagsnames.push(C_dS_customCss.get(tagid).name);
					}
					tagsicons = this.rtags({ marginbetween:'0.3em', size:'1.4em', linefeed:4 }); // linefeed: one line break each 4 items
				}
				return { c:tagsnames.length, t:'"', v:tagsnames, d:tagsicons }; // d is the html display value, v contains the names: they are written in the csv export
				
			case 'id': case 'groupId': case 'created': case 'changed': case 'deleted': case 'creator': case 'changer': case 'deletor': case 'deletorId':
				return this.tracking_ui_catalyst(member);
			
			default: 
		}
	}
}
C_dS_reservation.fromrgr = function(id) {
	return rgr.id.get(id);
}

C_dS_reservation.catalyst = {  // for C_catalyst, note that all properties of C_dS_reservation.catalyst are absorbed by C_catalyst(genome) here (*ct17*)
	
	genomec: C_dS_reservation, // genome class
	register: function() { return rmems['catalyst'].resas; }, // register where dataSets can be read from
	unregister: function(rid) { // un-register the given dataset
	
		const asis = rmems['catalyst'].resas.get(rid); // is a dS_reservation
		
		// console.log('<<<< asis',asis);
		if(!asis) return 0;
		
		asis.unregister(); // removes this guy from the register
		
		const after = rmems['catalyst'].resas.get(rid); // is a dS_reservation
		// console.log('>>>> after',after);
		return 1;
	}, 
	title: 'reservations', // title for modal C_iARRAY.fields
	xlprefix: 'resa-', // translation prefix, see (*tp01*)
	foptions: { // like fieldName:translation, used by C_catalyst.labels() see (*ct18*) for display by C_iARRAY.fields
		  reservation: { cueIn:'cueIn', cueOut:'cueOut', dateIn:'dateIn', dateOut:'dateOut', duration:'duration', note:'note', performances:'performances', payments:'payments', payments:'payments', ccss:'ccss', tags:'tags' }
		, payments: { cash:'cash', mobqrcode:'mobqrcode', payconiq:'payconiq', softpos:'softpos', hardpos:'hardpos', onlinepayco:'onlinepayco', onlinecards:'onlinecards', receivables:'receivables'  } // visitors means visitors names, should stay 'visitors' because many records are in table catalysts containing 'visitors'
		, visitor: { visitors:'visitors', email:'email', birthday:'birthday', mobile:'mobile', zipCode:'zipCode', company:'company', residence:'residence', registration:'registration' } // visitors means visitors names, should stay 'visitors' because many records are in table catalysts containing 'visitors'
		, audit: { id:'id', created:'created', creator:'creator', changed:'changed', changer:'changer', deletorId:'deletor', deleted:'deleted' }
	},
	defaults: { // defines a set of default displayed columns
		on: [  'ccss', 'dateIn', 'cueIn', 'duration', 'visitors', 'payments', 'performances' ],  // like [ fieldName1, fieldName2, ... ] in the expected displayed order
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




