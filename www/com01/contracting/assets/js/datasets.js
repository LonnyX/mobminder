
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
		case 'C_dS_lead'			: C_dS = C_dS_lead; break;
		case 'C_dS_customer'		: C_dS = C_dS_customer; break
		case 'C_dS_contract'		: C_dS = C_dS_contract; break;
		case 'C_dS_followUp'		: C_dS = C_dS_followUp; break;
		case 'C_dS_sector'			: C_dS = C_dS_sector; break;
		case 'C_dS_source'			: C_dS = C_dS_source; break;
		case 'C_dS_users'			: C_dS = C_dS_users; break;
		case 'C_dS_language'		: C_dS = C_dS_language; break;			
	
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

function C_dS_trackingC(id,groupId,created,creator,creatorId) {
	this.tmc = 5; // tracking members count
	C_dS_ID.apply(this,arguments);
	C_dS_trackingC.defaults.mergeto(this,arguments,2);
	if(vbs) vlog('dbAccess','C_dS_trackingC','constructor','id:'+this.id+', created:'+this.created+', creator:'+this.creator);
	
	this.tracking = C_dS_ID.prototype.display;
	this.tracking_ui_catalyst = C_dS_ID.prototype.tracking_ui_catalyst;
}
C_dS_trackingC.defaults = new A_df( { created:'', creator:'', creatorId:0} );
C_dS_trackingC.tnew = function(id, groupId) {
	let now = new Date(); now = now.getUnixTime();
	let surfer = mobminder.context.surfer.name;
	let sId = mobminder.context.surfer.id;
	let t = new C_dS_trackingC(id, groupId, now, surfer, sId);
	return [t.id, t.groupId, t.created, t.creator, t.creatorId];
};

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

mobminder.context = {};
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



	





////////////////   C O N T R A C T S 

// function C_dS_contract(p) {
// 	C_dS_contract.defaults.mergeto(this,p);
// 	C_dS_contract.register[this.id] = this; 
// };
// C_dS_contract.defaults = new A_df({
// 		id:0,groupId:0,creation:0,register:'',
// 		tax:'',ePayment:0,eInvoicing:0,fee:0,exCredit:0,exFee:0,rate:0,
// 		gender:1,firstname:'',lastname:'',address:'',zipCode:'',city:'',
// 		country:'',email:'',mobile:'',phone:'',language:0, registration:'',note:'' });
// (C_dS_contract.reset = function() {
// 	C_dS_contract.register = new Array();
// })();
// C_dS_contract.prototype = { }


	

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


class C_dS_lead{
    constructor(p){
		C_dS_trackingCC.apply(this,p||arguments); // ||arguments been introduced for MSIE
		C_dS_lead.defaults.mergeto(this,p,this.tmc);
	
		C_dS_lead.register.id.add(this.id, this);
    }
}
C_dS_lead.defaults = new A_df( { accountm:0, firstname:'', lastname:'', phoneNr:''
	, email:'', country:'', city:'', address:'', companyname:'', language:1, sector:999, speciality:''
	, status:1, source:999, sourcedetails:999, followUp:999 , notes:'',demo_AcNr:'',demo_AcName:''} );
C_dS_lead.prototype = {

};
(C_dS_lead.init = function() {
	C_dS_lead.register = new C_regS('id');
})();
C_dS_lead.get = function(id) { return C_dS_lead.register.id.get(id); }


class C_dS_customer{
    constructor(p){
		C_dS_trackingCCD.apply(this,p||arguments); // ||arguments been introduced for MSIE
		C_dS_customer.defaults.mergeto(this,p,this.tmc);
	
		C_dS_customer.register.id.add(this.id, this);
    }
}
C_dS_customer.defaults = new A_df( { leadid:0, contractId:0, clientNr:0, accountName:'', wallet:0
	, colorChip:'', companyname:'', speciality:'', sector:'', firstname:'', lastname:'', civility:''
	, tel:'', phoneNr:'', email:'', address:'', city:'', country:'', TVA:'', BIC:''
	, IBAN:'', monthlyPackage:'', currency:'', notesMonthlyPackage:'', numberOfSms:'', amountForAdditionalSms:'', birthdayContract:'', numberBusinessDiaries:'', numberEmployees:''
	, numberSmsAppointment:'', dateSigned:'', placeOfsigning:'', legalEntity:'',  accountingYear:''} );
	C_dS_customer.prototype = {

};
(C_dS_customer.init = function() {
	C_dS_customer.register = new C_regS('id');
})();
C_dS_customer.get = function(id) { return C_dS_customer.register.id.get(id); }

class C_dS_contract{
	constructor(p){
		C_dS_trackingC.apply(this,p||arguments);
		C_dS_contract.defaults.mergeto(this,p,this.tmc);

		C_dS_contract.register.id.add(this.id, this);
	}
}
C_dS_contract.defaults = new A_df( { leadid:0, pmPp:'', invCompanyName:'', invCompanyNumber:'', beginAccountingYear:'', endAccountingYear:''
	, /*invContactPerson:'',*/ invContactPersonFirstname:'',invContactPersonLastname:'', invCourtesy:''
	, invAddress:'', invCity:'', invCP:'', invCountry:'', TVA:'', invPhone:'', invMobile:'', invEmail:'', BIC:'', IBAN:''
	, monthlyPackage:'', smsPackage:0, extraSmsPackage:0, birthdayContract:'', paymentType:0, numberBusinessDiaries:0
	, numberEmployees:0, numberSmsAppointment:0 , clientNr:0, invNotes:'', placeSigning:'', accessCode:0} );
C_dS_contract.prototype = {
};
(C_dS_contract.init = function() {
	C_dS_contract.register = new C_regS('id');
})();
C_dS_contract.get = function(id) { return C_dS_contract.register.id.get(id); }

class C_dS_followUp{
	constructor(p){
		C_dS_followUp.defaults.mergeto(this,p);
		C_dS_followUp.register.id.add(this.id, this);
	}
}
C_dS_followUp.defaults = new A_df( { id: 0, groupId:0, name:''} );
C_dS_followUp.prototype = {
};
(C_dS_followUp.init = function() {
	C_dS_followUp.register = new C_regS('id');
})();
C_dS_followUp.get = function(id) { return C_dS_followUp.register.id.get(id); }


class C_dS_sector{
	constructor(p){
		C_dS_sector.defaults.mergeto(this,p);
		C_dS_sector.register.id.add(this.id, this);
	}
}
C_dS_sector.defaults = new A_df( { id: 0, groupId:0, name:''} );
C_dS_sector.prototype = {
};
(C_dS_sector.init = function() {
	C_dS_sector.register = new C_regS('id');
})();
C_dS_sector.get = function(id) { return C_dS_sector.register.id.get(id); }


class C_dS_source{
	constructor(p){
		C_dS_source.defaults.mergeto(this,p);
		C_dS_source.register.id.add(this.id, this);
	}
}
C_dS_source.defaults = new A_df( { id: 0, groupId:0, name:''} );
C_dS_source.prototype = {
};
(C_dS_source.init = function() {
	C_dS_source.register = new C_regS('id');
})();
C_dS_source.get = function(id) { return C_dS_source.register.id.get(id); }

class C_dS_language{
	constructor(p){
		C_dS_language.defaults.mergeto(this,p);
		C_dS_language.register.id.add(this.id, this);
	}
}
C_dS_language.defaults = new A_df( { id: 0, groupId:0, full_l:'', shortened_l:''} );
C_dS_language.prototype = {
};
(C_dS_language.init = function() {
	C_dS_language.register = new C_regS('id');
})();
C_dS_language.get = function(id) { return C_dS_language.register.id.get(id); }


class C_dS_users{
	constructor(p){
		C_dS_users.defaults.mergeto(this,p);
		C_dS_users.register.id.add(this.id, this);
	}
}
C_dS_users.defaults = new A_df( { id: 0, groupId:0, firstname:'', lastname:'', email:'',mobile:'', username:'', password:'', taycan:'', accesslevel:0} );
C_dS_users.prototype = {
};
(C_dS_users.init = function() {
	C_dS_users.register = new C_regS('id');
})();
C_dS_users.get = function(id) { return C_dS_users.register.id.get(id); }