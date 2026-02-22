
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
// © Copyright 2007-2022 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


//////////////////////////////////////////////////////////////////////////////// 
//
//  H T M L   I N L I N E   S T R E A M I N G      R E A D E R
//

var measureStreaming = false;
function C_inlineStreaming() {}
C_inlineStreaming.classes = function(classname) {
	var C_dS;
	console.log(classname);
	switch(classname) {
		
		case 'C_dS_queue'		: C_dS = C_dS_queue; break;
		case 'C_dS_satellite'	: C_dS = C_dS_satellite; break;
		
		default:
			warning('datasets.js', 'C_inlineStreaming', 'createDataSets', 'unexpected class? '+classname);
	}
	return C_dS;
}
C_inlineStreaming.createDataSets = function(stream) {
	
	var perf = measureStreaming?new microperf('entering createDataSets'):false;
	var newline = String.fromCharCode(10);
	var rushsplit = stream.split(newline);
	var objects = new Array();
	var line, classinfo, classname, olifant, instance, parameters, prevclassname = false, C_dS;
	
	while(line = rushsplit.shift()) { // extracts a section from the array
		if(line == '') continue;
		if(line[0] == '#') { // class name identification row
			if(perf) if(prevclassname) perf.cue('done with creation of '+prevclassname);
			var classinfo = line.substring(1).split('#');
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
		var tr 		= '<tr style="vertical-align:top;">';
		var tdLeft	= '<td style="text-align:right; padding-right:1em;" class="textcolor-light">';
		
		var creation= '', changing = '', deletion = '';
		var blankline = '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>';
		
		var is = { resa: this instanceof C_dS_reservation, visi: this instanceof C_dS_visitor, rsrc: this instanceof C_dS_resource, ccss: this instanceof C_dS_customCss, logn: this instanceof C_dS_login }


			var xlo = { cap:true };
		if(this.id <= 0) {
			var creator = tr+tdLeft+C_XL.w('creator',xlo)+'</td><td>'+mobminder.context.surfer.name+'</td></tr>';
			var created = tr+tdLeft+C_XL.w('created on',xlo)+'</td><td>'+C_XL.w('now')+'</td></tr>';
			creation = created+creator;
			
		} else { // Existing object
		
			// Creation record
			var creator = tr+tdLeft+C_XL.w('creator',xlo)+'</td><td>'+this.creator+'</td></tr>';
			var created = C_XL.date(jsDateFromUnixTime(this.created), {abreviation:'abr', weekday:true, time:true });
				created = tr+tdLeft+C_XL.w('created on',xlo)+'</td><td>'+created+'</td></tr>';
			creation = created+creator;
			
			// Edition record
			if(this.changerId !== undefined) {
				var changed = C_XL.w('never'), changer = C_XL.w('no one');
				if(this.changerId) { 
					changed = C_XL.date(jsDateFromUnixTime(this.changed), {abreviation:'abr', weekday:true, time:true });
					changer = this.changer;
				}
				changer = tr+tdLeft+C_XL.w('changer',xlo)+'</td><td>'+changer+'</td></tr>';
				changed = tr+tdLeft+C_XL.w('changed on',xlo)+'</td><td>'+changed+'</td></tr>';
				changing = blankline+changed+changer;
			}
			
			// Deletion record
			if(this.deletorId !== undefined) 
			if(this.deletorId) {
				var deleted = C_XL.w('never'), deletor = C_XL.w('no one');
				if(this.deletorId) { 
					deleted = C_XL.date(jsDateFromUnixTime(this.deleted), {abreviation:'abr', weekday:true, time:true });
					deletor = C_dS_loggable.getname(this.deletorId);
				}
				if(is.resa) {
						var r = this.rescheduled;
					deletor = tr+tdLeft+C_XL.w(r?'rescheduled by':'deletor',xlo)+'</td><td>'+deletor+'</td></tr>';
					deleted = tr+tdLeft+C_XL.w(r?'rescheduled on':'deleted on',xlo)+'</td><td>'+deleted+(r?' '+C_XL.w('to',{cap:0})+' ('+r+')':'')+'</td></tr>';
				} else if(is.visi) {
						var m = this.mergedTo;
					deleted = tr+tdLeft+C_XL.w('merged on',xlo)+'</td><td>'+deleted+'</td></tr>';
					deletor = tr+tdLeft+C_XL.w('merged by',xlo)+'</td><td>'+deletor+'</td></tr>';
					deletor+= tr+tdLeft+C_XL.w('merged',xlo)+' '+C_XL.w('with')+'</td><td>'+' id '+m+'</td></tr>';
				} else { // every other objects
					deletor = tr+tdLeft+C_XL.w('deletor',xlo)+'</td><td>'+deletor+'</td></tr>';
					deleted = tr+tdLeft+C_XL.w('deleted on',xlo)+'</td><td>'+deleted+'</td></tr>';
				}
				deletion = blankline+deleted+deletor;
			}
			
		}
		
		var preinfo	= '', syncinfo	= '';
		
		// synchro information
		//
		var synclogins = C_dS_loggable.getbyAccLevel([aLevel.synchro]);
		if(is.resa || is.visi || is.rsrc || is.ccss) // do not display this for other objects
		for(var slid in synclogins) { // there may be multiple sync logins
			var slogin = synclogins[slid];
			var skey, skeyid = false, skeys = C_dS_accesskey.get('config', slogin.id); for(var skeyid in skeys) { skey = skeys[skeyid]; break; } // synchro logins have only one key
			var remoteId = 'not synced';
			if(skeyid) { 
				var dS_synchro = false;
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
		}
		if(is.logn) preinfo = tr+tdLeft+C_XL.w('last login',xlo)+'</td><td>'+this.lastLogin+'</td></tr>';
		
		var id = tr+tdLeft+C_XL.w('data id')+'</td><td>'+this.id+'</td></tr>';
			id = blankline+preinfo+id+syncinfo;
		
		return '<table class="tracking">'+creation+changing+deletion+id+'</table>';
	}
}
C_dS_ID.defaults = new A_df( { id:0, groupId:0 } );

function C_dS_trackingCC(id,groupId,created,creator,creatorId,changed,changer,changerId) {
		this.tmc = 8; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCC.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCC','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		this.tracking = C_dS_ID.prototype.display;
}
C_dS_trackingCC.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0 } );
C_dS_trackingCC.tnew = function(id, groupId) {
	var now = new Date(); now = now.getUnixTime();
	var surfer = mobminder.context.surfer.name;
	var sId = mobminder.context.surfer.id;
	var t = new C_dS_trackingCCD(id, groupId, now, surfer, sId, now, surfer, sId);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.changed, t.changer, t.changerId];
};

function C_dS_trackingCCD(id,groupId,created,creator,creatorId,changed,changer,changerId,deleted,deletorId) {
		
		this.tmc = 10; // tracking members count
		C_dS_ID.apply(this,arguments);
		C_dS_trackingCCD.defaults.mergeto(this,arguments,2);
		if(vbs) vlog('dbAccess','C_dS_trackingCCD','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
		this.tracking = C_dS_ID.prototype.display;
}
C_dS_trackingCCD.defaults = new A_df( { created:'', creator:'', creatorId:0, changed:'', changer:'', changerId:0, deleted:'', deletorId:0 } );
C_dS_trackingCCD.tnew = function(id, groupId) {
	var now = new Date(); now = now.getUnixTime();
	var surfer = mobminder.context.surfer.name;
	var sId = mobminder.context.surfer.id;
	var never = '0000-00-00 00:00:00';
	var t = new C_dS_trackingCCD(id, groupId, now, surfer, sId, now, surfer, sId, never, 0);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId, t.changed, t.changer, t.changerId, t.deleted, t.deletorId];
};



////////////////  W O R K    C O D E S 

function C_dS_queue(p) {
	this.tmc = 2;
	C_dS_ID.apply(this,p);
	C_dS_queue.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_queue.registers.id.add(this.id, this);
		C_dS_queue.count++; 
	} else {
		C_dS_queue.defaults.apply(this); // new object
	}
	// console.log(this);
};
C_dS_queue.defaults = new A_df( { name:'', pushedever:0, pushthishour:0, pushlasthour:0, pushthisday:0, pushyesterday:0, pushthisweek:0, pushlastweek:0, pushthismonth:0, pushlastmonth:0 } );
(C_dS_queue.reset = function() {
	C_dS_queue.registers = new C_regS('id');
	C_dS_queue.count = 0; 
})();
C_dS_queue.prototype = {
	resources: function() { return C_dS_workexpert.registers.bytype.get(this.id) }, // results like [rscType][rscId] = o_dS_resource;
	expertsIds: function() { return C_dS_workexpert.registers.rescids.get(this.id) }, // results like [rscId] = rscId;
	tboxingIds: function() { return C_dS_worktboxing.registers.tboxid.get(this.id) }, // results like [tboxingId] = o_dS_timeboxing;

	wbullet: function() {	
			var tag = this.tag ? ' '+C_iSKIN.tagcss(this.tag)+' ' : '';
			var inner = this.tag?'':'&nbsp;';
		var bullet = '<div style="display:inline-block;" class="bullet workcode '+tag+this.wcss()+'">'+inner+'</div>';
		return bullet;
	},
	wcss: function() {
		var color = 'c'+C_dS_customCss.get(this.cssColor).css; // grayed when no color is chosen
		var pattern = ' p'+C_dS_customCss.get(this.cssPattern).css; // transparent when no pattern is chosen
		return color+pattern;
	},
	hasCcss: function() { return !!(this.cssColor+this.cssPattern); },
	minutes: function() { 
			var mps = mobminder.account.secondsPerSlice/60; // minutes per slice
		return '('+(this.duration*mps)+'min)';
	},
	setXmonPoint: function(xmon) { this.xmon[xmon.sunday] = xmon; }
};
C_dS_queue.ACoptions = function(preset) {
		preset = preset||{/* eWorkcodes:false, tip:false, bullets:true */}; 
		
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) { 
			this.register = C_dS_queue.registers.eresa.get(1) || []; // returns only ePerformances
			this.sum = C_dS_queue.registers.eresa.ends(1) || 0;
		}
		if(preset.eWorkcodes===false) {
			this.register = C_dS_queue.registers.eresa.get(0) || []; // returns only NON ePerformances
			this.sum = C_dS_queue.registers.eresa.ends(0) || 0;
		}
	} else {
		this.register = C_dS_queue.registers.id.get();
		this.sum = C_dS_queue.registers.id.ends();
	}

	this.trigger = 0,
	this.css = 'alpha14',
	this.fetch = function(digits, callback) { 
		var options = {}; for(var id in this.register) options[id] = this.label(id);
		setTimeout(function(){return callback.cb(digits, options)},5);
	},
	this.label = function(id) { 
		var dS = C_dS_queue.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		return dS.wbullet()+dS.name+' '+dS.minutes();
	},
	this.tip = function(id) { 
			var workcode = C_dS_queue.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
			var name = workcode.name+' '+workcode.minutes();
			var separator = '<hr/>';
			var bullet = workcode.hasCcss() ? workcode.wbullet() : '';
			var note = workcode.note ? separator + workcode.note : '';
			var codeprice = new Array(); 
		if(workcode.code) codeprice.push(workcode.code);
		if(workcode.price) codeprice.push(C_XL.w('euros') + (workcode.price/100).toFixed(2));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
		var tip = bullet + name + codeprice + note;
		return tip;
	},
	this.count = function() {
		return this.sum;
	}
}
C_dS_queue.get = function(id) { return C_dS_queue.registers.id.get(id); }
C_dS_queue.has = function(options) { // options like { eresa:[true, false, undef] }
	options = options||{};
	if(options.eresa==undefined) return C_dS_queue.registers.id.ends();
	else return C_dS_queue.registers.eresa.ends(options.eresa?1:0);
	return !!C_dS_queue.count;
}
C_dS_queue.del = function(id) {
	C_dS_workexpert.deleteOnWorkcode(id);
	C_dS_worktboxing.deleteOnWorkcode(id);
		var item = C_dS_queue.registers.id.get(id);
	C_dS_queue.registers.del(item);
}
C_dS_queue.plus = function(genome) { // genome like eresa:[true, false, or undefined]
	this.genome = genome||{};
		
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_wrkc);
	this.eid = '_wrk';
	this.list = function() {
		var labels = [], order = [];
		var register = (this.genome.eresa===undefined)?C_dS_queue.registers.id.get():C_dS_queue.registers.eresa.get(this.genome.eresa?1:0);
		for(var id in register) {
			var dataset = register[id];
			labels[id] = dataset.wbullet()+dataset.name;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		var dS = new C_dS_queue();
		dS.ereservable = (this.genome.eresa===true)?1:0;
		return dS;
	};
	this.get = function(id) {
		return C_dS_queue.registers.id.get(id);
	}
}
C_dS_queue.options = function(preset) { // preset like { which:[ids], checked:'first' or [ids], tip:false, bullets:true}
	
		preset = preset||{}; 
	var order = [], labels = [], presets = {};
	var register = C_dS_queue.registers.id.get();
	for(var id in register) {
		if(preset.which) if(!(id in preset.which)) continue;
			var dS = register[id];
		order.push(id);
		
		if(preset.bullets) labels[id] = dS.wbullet()+dS.name;
			else labels[id] = 'queue: '+dS.name;
			
		presets[id] = { tip:false };
		if(preset.tip) {
			var tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
			presets[id].tip = tip;
		}
	}
	order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
	switch(preset.checked) {
		case undefined: break;
		case 'first': for(var x in order) { presets[order[x]].checked = true; break; } break;
		default:
		if(preset.checked.length)
			for(var id in preset.checked) 
				if(id in presets) presets[id].checked = true;
	}
	
	return { order:order, labels:labels, presets:presets, count:order.length };
}




////////////////  C H E C K L I S T S 

function C_dS_satellite(p) {
	
	this.tmc = 2;
	C_dS_ID.apply(this,p);
	C_dS_satellite.defaults.mergeto(this,p,this.tmc);
	
	// registers
	if(this.id>0) {
		C_dS_satellite.registers.id.add(this.id, this);
		C_dS_satellite.count++; 
	} else {
		C_dS_satellite.defaults.apply(this); // new object
	}
	console.log(this);
};
C_dS_satellite.defaults = new A_df( 
	{ sim:'', iccid:'', puk:'', name:'', sat:'', port:0, operator:'', color:'', lag:0, lastseen:'', swversion:'', swsignatr:'', enabled:0, lastcsq:0, lastptmp:0,
		fetchever:0, fetchthishour:0, fetchlasthour:0, fetchthisday:0, fetchyesterday:0, fetchthisweek:0, fetchlastweek:0, fetchthismonth:0, fetchlastmonth:0,
		color:'', enabled:0
		} );
(C_dS_satellite.reset = function() {
	C_dS_satellite.registers = new C_regS('id');
	C_dS_satellite.count = 0; 
})();
C_dS_satellite.prototype = {
	
};
C_dS_satellite.ACoptions = function(preset) {
		preset = preset||{/* eWorkcodes:false, tip:false, bullets:true */}; 
		
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) { 
			this.register = C_dS_satellite.registers.eresa.get(1) || []; // returns only ePerformances
			this.sum = C_dS_satellite.registers.eresa.ends(1) || 0;
		}
		if(preset.eWorkcodes===false) {
			this.register = C_dS_satellite.registers.eresa.get(0) || []; // returns only NON ePerformances
			this.sum = C_dS_satellite.registers.eresa.ends(0) || 0;
		}
	} else {
		this.register = C_dS_satellite.registers.id.get();
		this.sum = C_dS_satellite.registers.id.ends();
	}

	this.trigger = 0,
	this.css = 'alpha14',
	this.fetch = function(digits, callback) { 
		var options = {}; for(var id in this.register) options[id] = this.label(id);
		setTimeout(function(){return callback.cb(digits, options)},5);
	},
	this.label = function(id) { 
		var dS = C_dS_satellite.registers.id.get(id); // looks in full register has you should see if some patient did reserve via web
		return dS.wbullet()+dS.name+' '+dS.minutes();
	},
	this.tip = function(id) { 
			var workcode = C_dS_satellite.registers.id.get(id); // looks in full register (you should see when patient did reserve via web)
			var name = workcode.name+' '+workcode.minutes();
			var separator = '<hr/>';
			var bullet = workcode.hasCcss() ? workcode.wbullet() : '';
			var note = workcode.note ? separator + workcode.note : '';
			var codeprice = new Array(); 
		if(workcode.code) codeprice.push(workcode.code);
		if(workcode.price) codeprice.push(C_XL.w('euros') + (workcode.price/100).toFixed(2));
			codeprice = (codeprice.length) ? separator + codeprice.join(', ') : '';
		var tip = bullet + name + codeprice + note;
		return tip;
	},
	this.count = function() {
		return this.sum;
	}
}
C_dS_satellite.get = function(id) { return C_dS_satellite.registers.id.get(id); }
C_dS_satellite.has = function() { // options like { eresa:[true, false, undef] }
	return C_dS_satellite.registers.id.ends();
}
C_dS_satellite.del = function(id) {
	C_dS_workexpert.deleteOnWorkcode(id);
	C_dS_worktboxing.deleteOnWorkcode(id);
		var item = C_dS_satellite.registers.id.get(id);
	C_dS_satellite.registers.del(item);
}
C_dS_satellite.plus = function(genome) { // genome like eresa:[true, false, or undefined]
	this.genome = genome||{};
		
	// generic interface to C_iPLUS
	this.plusmay = permissions.may(pc.cr_wrkc);
	this.eid = '_wrk';
	this.list = function() {
		var labels = [], order = [];
		var register = (this.genome.eresa===undefined)?C_dS_satellite.registers.id.get():C_dS_satellite.registers.eresa.get(this.genome.eresa?1:0);
		for(var id in register) {
			var dataset = register[id];
			labels[id] = dataset.wbullet()+dataset.name;
			if(verboseOn) labels[id] = dataset.id+' '+labels[id];
			order.push(dataset.id);
		}
		order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
		return { labels:labels, order:order };
	};
	this.plus = function() {
		var dS = new C_dS_satellite();
		dS.ereservable = (this.genome.eresa===true)?1:0;
		return dS;
	};
	this.get = function(id) {
		return C_dS_satellite.registers.id.get(id);
	}
}
C_dS_satellite.options = function(preset) { // preset like {eWorkcodes:true, which:[ids], checked:'first' or [ids]}
	
		preset = preset||{/* eWorkcodes:false, tip:false, bullets:true */}; 
	var order = [], labels = [], presets = {};
	var register = preset.eWorkcodes?C_dS_satellite.registers.eresa.get(1):C_dS_satellite.registers.id.get();
	if('eWorkcodes' in preset) { // preset.eWorkcodes undefined => return all workcodes
		if(preset.eWorkcodes===true) register = C_dS_satellite.registers.eresa.get(1); // returns only ePerformances
		if(preset.eWorkcodes===false) register = C_dS_satellite.registers.eresa.get(0); // returns only NON ePerformances
	} else {
		register = C_dS_satellite.registers.id.get();
	}
	for(var id in register) {
		if(preset.which) if(!(id in preset.which)) continue;
			var dS = register[id];
		order.push(id);
		
		if(preset.bullets) labels[id] = dS.wbullet()+dS.name;
			else labels[id] = dS.name;
			
		presets[id] = { tip:false };
		if(preset.tip) {
			var tip = '<strong>'+dS.name+'</strong>'; if(dS.note) tip+= ':<br/>'+dS.note;
			presets[id].tip = tip;
		}
	}
	order.sort(function(a,b){return (register[a].name>register[b].name)?1:-1; });
	
	switch(preset.checked) {
		case undefined: break;
		case 'first': for(var x in order) { presets[order[x]].checked = true; break; } break;
		default:
		if(preset.checked.length)
			for(var id in preset.checked) 
				if(id in presets) presets[id].checked = true;
	}
	
	return { order:order, labels:labels, presets:presets, count:order.length };
}




