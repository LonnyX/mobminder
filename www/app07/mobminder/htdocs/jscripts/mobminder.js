
//////////////////////////////////////////////////////////////////////////////////////////////
//
//                        C O P Y R I G H T    N O T I C E
// 
// This code is NOT licensed under the GNU General Public License NOR the MIT License.
// Using this code or a part of this code is subject to license agreement with PASCAL VANHOVE.
//
// © All Rights Reserved. Permission to use, copy, modify, and distribute this software and its 
// documentation for educational, research, and not-for-profit purposes, without fee and without 
// a signed licensing agreement, modifications, and distributions, is hereby PROHIBITED. 
// Contact PASCAL VANHOVE - +32(0)26621800 for commercial licensing opportunities.
//
// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


//prevent to click on browser back button (browser button OR back keyboard key)
//https://stackoverflow.com/questions/12381563/how-can-i-stop-the-browser-back-button-using-javascript
//https://jsbin.com/yaqaho/edit?html,css,js,output




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G    O U T    O F    I N T E R N A T I O N A L     P R E F I X E S 
//
function C_iCountryCodes(eid, callbacks, preset) {
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iCountryCodes.defaults.align(preset);
	
		let options = C_iCountryCodes.options();
		let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:false }, options, { maxcols:1, value:preset.value } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iCountryCodes.defaults = new A_df({});
C_iCountryCodes.prototype = {
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { return this.controls.ddwn.getpost(); }
	
	// private
}
C_iCountryCodes.options = function() {
	let regions = { 0:'North America', 2:'Africa', 3:'Europe', 4:'Balkans', 5:'Latin America', 6:'Southeast Asia and Oceania', 7:'Former Soviet Union', 8:'East Asia', 9:'Asia' };
	let labels = { 
		0:{ 1:'Canada & USA (+1)', 1212:'New York City (+1 212)', 1312:'Chicago (+1 312)', 1213:'Los Angeles (+1 213)', 1313:'Detroit (+1 313)', 1215:'Philadelphia (+1 215)' }, // 
		2:{ 20:'Egypt (+20)', 212:'Morocco (+212)', 213:'Algeria (+213)', 216:'Tunisia (+216)', 218:'Libya (+218)', 262: 'Reunion, Mayotte (+262)', 27:'South Africa (+27)' },
		3:{ 30: 'Greece (+30)', 31: 'Netherlands (+31)', 32: 'Belgium (+32)', 352: 'Luxembourg (+352)', 
			33: 'France (+33)',  376: 'Andorra (+376)',  377: 'Monaco (+377)', 
			34: 'Spain (+34)', 350: 'Gibraltar (+350)', 356: 'Malta (+356)', 357: 'Cyprus (+357)', 36: 'Hungary (+36)', 39: 'Italy (+39)',
			351: 'Portugal (+351)', 353: 'Ireland (+353)', 354: 'Iceland (+354)', 355: 'Albania (+355)', 358: 'Finland (+358)', 359: 'Bulgaria (+359)', 370: 'Lithuania (+370)', 371: 'Latvia (+371)',
			372: 'Estonia (+372)', 373: 'Moldova (+373)', 374: 'Armenia (+374)', 375: 'Belarus (+375)', 378: 'San Marino (+378)',
			379: 'Vatican (+379)', 380: 'Ukraine (+380)', 381: 'Serbia (+381)', 382: 'Montenegro (+382)', 385: 'Croatia (+385)', 386: 'Slovenia (+386)',
			388: 'Europe Services (+388)', 389: 'Macedonia (+389)'
			},
		4:{ 40: 'Romania (+40)', 41: 'Switzerland (+41)', 43: 'Austria (+43)', 44: 'United Kingdom (+44)', 45: 'Denmark (+45)', 46: 'Sweden (+46)', 47: 'Norway (+47)', 48: 'Poland (+48)', 
			49: 'Germany (+49)', 420: 'Czech Republic (+420)', 421: 'Slovakia (+421)', 423: 'Liechtenstein (+423)' }, 
		5:{ 55: 'Brazil (+55)', 57: 'Colombia (+57)', 590: 'Guadeloupe, Saint-Barthelemy and Saint-Martin (+590)', 594: 'French Guiana (+594)', 596: 'Martinique (+596)' },
		6:{ 60: 'Malaysia (+60)', 61: 'Australia (+61)', 62: 'Indonesia (+62)', 63: 'Philippines (+63)', 64: 'New Zealand (+64)', 65: 'Singapore (+65)', 66: 'Thailand (+66)', 687: 'New Caledonia (+687)' },
		7:{ 70: 'Russia (+7)' },
		8:{ 81: 'Japan (+81)', 82: 'South Korea (+82)', 84: 'Vietnam (+84)', 850: 'North Korea (+850)', 852: 'Hong Kong (+852)', 86: 'China (+86)', 886: 'Taiwan (+886)' },
		9:{ 90: 'Turkey (+90)', 91: 'India (+91)', 964: 'Iraq (+964)', 965: 'Kuwait (+965)', 966: 'Saudi Arabia (+966)', 970: 'Palestine (+970)', 971: 'United Arab Emirates (+971)', 972: 'Israel (+972)', 973: 'Bahrain (+973)', 974: 'Qatar (+974)' }
	}
	let order = new Array(); 
		for(let r in labels) {
			order.push(r); for(let cc in labels[r]) order.push(cc);
		}
	
		let b = {section:'<span class="fa fa-13x fa-tty"></span>'}; // bullet
	let presets = { 0:b, 2:b, 3:b, 4:b, 5:b, 6:b, 7:b, 8:b, 9:b };
	
	let labelsmerge = {};
	for(let r in regions) {
		labelsmerge[r] = regions[r];
		for(let cc in labels[r]) { 
			labelsmerge[cc] = labels[r][cc]; 
			presets[cc] = {indent:2.6}; // bullets are not indented while labels are
		}
	}
	
	let count = order.length;

	return { order:order, labels:labelsmerge, presets:presets, count:count };
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G     S Y N C H R O     O P T I O N S 
//
function C_iSYOPT(eid, callbacks, preset) {  // Sync options
	this.eids = { menu:eid+'_menu' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSYOPT.defaults.align(preset);
	
		let options = C_iSYOPT.options(preset.syncwhat);
	let menu = new C_iCRESTA(this.eids.menu, { onselect:false }, options, { maxcols:2, maxrows:12 } );
	this.controls = new A_ct({menu:menu});
}
C_iSYOPT.defaults = new A_df({});
C_iSYOPT.prototype = {
	display: function(css) { return this.controls.menu.display(css); },
	labelled: function(english, css) { return this.controls.menu.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let setting = this.controls.menu.getvalue();
		let coded = 0;
		for(let x in setting) coded += setting[x]|0; // builds a bitmap value
		return coded;
	}
	
	// private
}
C_iSYOPT.options = function(syncwhat) {
	let labels = C_XL.w({ 1:'visitors', 2:'appointments', 4:'files' }); // powers of 2 <=> bitmap posted
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	let count = order.length;
	let presets = {};
	if(syncwhat)
		for(let i = syncwhat|0, j = 1; i; i>>=1, j<<=1) { 
			// input like (5), result like [1=>1, 2=>0, 4=>1]. It makes an array of bits from the bitmap value.
			presets[j] = !!(i&1); 
		}
	return { order:order, labels:labels, presets:presets, count:count };
}



function C_iSYRSC(eid, callbacks, preset) {  // Sync correlators for resources
	this.eids = { bCal:eid+'_bcals', uCal:eid+'_ucals', fCal:eid+'_fcals' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSYRSC.defaults.align(preset);
	
	this.controls = new A_ct({});
		this.has = { bCals:C_dS_resource.count(class_bCal), uCals:C_dS_resource.count(class_uCal) , fCals:C_dS_resource.count(class_fCal) };
	if(this.has.bCals) this.controls.add1(new C_iTXTA(this.eids.bCal, {onchange:new A_cb(this,this.tchanged,class_bCal)}, C_dS_synchro_resource.options(this.state.keyid, class_bCal), { title:C_XL.w(class_bCal) }), class_bCal);
	if(this.has.uCals) this.controls.add1(new C_iTXTA(this.eids.uCal, {onchange:new A_cb(this,this.tchanged,class_uCal)}, C_dS_synchro_resource.options(this.state.keyid, class_uCal), { title:C_XL.w(class_uCal) }), class_uCal);
	if(this.has.fCals) this.controls.add1(new C_iTXTA(this.eids.fCal, {onchange:new A_cb(this,this.tchanged,class_fCal)}, C_dS_synchro_resource.options(this.state.keyid, class_fCal), { title:C_XL.w(class_fCal) }), class_fCal);

}
C_iSYRSC.defaults = new A_df({ keyid:0 });
C_iSYRSC.prototype = {
	display: function(css) { 
		css = css || '';
		let bCal = ''; let uCal = ''; let fCal = '';
		let trin = '<tr style="vertical-align:top; border-top:1em solid transparent;">';
		if(class_bCal in this.controls) bCal = trin+'<td>'+this.controls[class_bCal].display()+'</td>'+'</tr>';
		if(class_uCal in this.controls) uCal = trin+'<td>'+this.controls[class_uCal].display()+'</td>'+'</tr>';
		if(class_fCal in this.controls) fCal = trin+'<td>'+this.controls[class_fCal].display()+'</td>'+'</tr>';
		return '<table style="text-align:left;">'+bCal+fCal+uCal+'</tr></table>'; 
	},
	labelled: function(english, css) { return this.controls.menu.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let b = this.has.bCals?this.controls[class_bCal].getpost():'x'; // (*sc01*)
		let u = this.has.uCals?this.controls[class_uCal].getpost():'x';
		let f = this.has.fCals?this.controls[class_fCal].getpost():'x';
		let post = { bCals:b, uCals:u , fCals:f };
		
		C_dS_synchro_resource.reset(); // when saving, the current records at server side are all deleted and replaced with new ones that we get through the save feedback
		return post;
	},
	
	// private
	
	
	// event handling
	tchanged: function(type, value, digits) {
		if(vbs) vlog('mobminder.js','C_iSYRSC','tchanged','type:'+type+', value:'+value+', digits:'+digits);
	}
}



function C_iSYCSS(eid, callbacks, preset) {  // Sync correlators for colors
	this.eids = { evnt:eid+'_evnt', resa:eid+'_resa', visi:eid+'_visi' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSYCSS.defaults.align(preset);
	
	let options = {
		evnt: C_dS_synchro_ccss.options(this.state.keyid, resaclass.event, ccsstype.color),
		resa: C_dS_synchro_ccss.options(this.state.keyid, resaclass.appointment, ccsstype.color),
		visi: C_dS_synchro_ccss.options(this.state.keyid, class_visitor, ccsstype.color)
	}
	
	this.controls = new A_ct({});
		this.has = { evnt:options.evnt.count, resa:options.resa.count , visi:options.visi.count };
	if(this.has.evnt) this.controls.add1(new C_iTXTA(this.eids.evnt, {onchange:new A_cb(this,this.tchanged,resaclass.event)}		, options.evnt, { title:C_XL.ccss(resaclass.event, ccsstype.color) }), resaclass.event);
	if(this.has.resa) this.controls.add1(new C_iTXTA(this.eids.resa, {onchange:new A_cb(this,this.tchanged,resaclass.appointment)}	, options.resa, { title:C_XL.ccss(resaclass.appointment, ccsstype.color) }), resaclass.appointment);
	if(this.has.visi) this.controls.add1(new C_iTXTA(this.eids.visi, {onchange:new A_cb(this,this.tchanged,class_visitor)}			, options.visi, { title:C_XL.ccss(class_visitor, ccsstype.color) }), class_visitor);

}
C_iSYCSS.defaults = new A_df({ keyid:0 });
C_iSYCSS.prototype = {
	display: function(css) { 
		css = css || '';
		let evnt = ''; let resa = ''; let visi = '';
		let trin = '<tr style="vertical-align:top; border-top:1em solid transparent;">';
		if(resaclass.event in this.controls) evnt = trin+'<td>'+this.controls[resaclass.event].display()+'</td>'+'</tr>';
		if(resaclass.appointment in this.controls) resa = trin+'<td>'+this.controls[resaclass.appointment].display()+'</td>'+'</tr>';
		if(class_visitor in this.controls) visi = trin+'<td>'+this.controls[class_visitor].display()+'</td>'+'</tr>';
		return '<table style="text-align:left;">'+evnt+resa+visi+'</tr></table>'; 
	},
	labelled: function(english, css) { return this.controls.menu.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let e = this.has.evnt?this.controls[resaclass.event].getpost():'x'; // (*sc02*)
		let r = this.has.resa?this.controls[resaclass.appointment].getpost():'x';
		let v = this.has.visi?this.controls[class_visitor].getpost():'x';
		let post = { evnt:e, resa:r , visi:v };
		
		C_dS_synchro_ccss.reset(); // when saving, the current records at server side are all deleted and replaced with new ones that we get through the save feedback
		return post;
	},
	
	// private
	
	
	// event handling
	tchanged: function(type, value, digits) {
		if(vbs) vlog('mobminder.js','C_iSYCSS','tchanged','type:'+type+', value:'+value+', digits:'+digits);
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E     :   V I S I T O R S     R E G I S T E R 
//
function C_backVISI(eid, callbacks, preset) {
	const b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons', table:b+'visitors', alphadiv:b+'div', staff:b+'staff', filter:b+'filter', overlay:b+'overlay'
		,filters:{ none:b+'f_none', byrsc:b+'f_rsc'} };
	this.elements = new A_el();
	this.state = C_backVISI.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };

if(vbs) vlog('mobminder.js','C_backVISI','construction','');

	// meta
	const is = mobminder.context.surfer.is;
	
	// account
	this.dataSet = mobminder.account;
	const id	= new C_iPASS(this.dataSet.id);

	// controls
	this.catalysts = new C_catalyst(C_dS_visitorAlpha.catalyst); // C_dS_visitorAlpha.catalyst is the genome for C_catalyst // see (*cy01*)
	const staff 	= new C_iSTAFF(this.eids.staff, 'empty', new A_cb(this,this.staff), C_dS_resource.getByType() );
	
		const filters = C_XL.w({ none:'vfilter none', byrsc:'vfilter have app' });
		const forder = ['none','byrsc'];
	const filter = new C_iCRESTA(this.eids.filter, { onchange:new A_cb(this, this.filter) }, { order:forder, labels:filters, count:forder.length }, { skin:0, mode:-1, value:this.state.filter, title:C_XL.w('vfilter title') } );

	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit), deletemsg:new A_cb(this, this.deletemsg)}, { remove:false, save:false, quit:true });
	const letters = { A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z'};
	const tabs = new C_iTABS(this.eids.tabs, letters, { ontab:new A_cb(this, this.ontab )} );
	this.controls = new A_ct( { cartouche:cartouche, tabs:tabs, id:id, staff:staff, filter:filter } );
}
C_backVISI.defaults = new A_df( { letter:'', filter:'none' } );
C_backVISI.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backVISI','display',''); 
		
						const spinner = '<div class="spinner">'+'</div>';
				const busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:20vh;';
			const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';
			
			const alphaswap = '<div class="alphaswap" id="'+this.eids.alphadiv+'"></div>'; // later filled by this.alphatab()
			const alphatab = '<div class="alphatab" style="position:relative; min-height:30em; padding-top:2em; padding-bottom:5em;">'+alphaswap+overlay+'</div>'; 
		
		// final packaging
				const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
				const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
			const combocontainers = '<div style="background-color:white;">'+alphatab+'</div>'; // do not invert <div> layout sequence!
			const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
		const headers = '<div class="prefs-header">'+this.header()+'</div>';
		const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';
		
		return '<div class="C_backVISI prefs-grid" style="height:100%; min-height:100%;">'+headers+tabcontainers+'</div>'; // makes the entire inner content scrollable
	},
	activate:function() {
		this.controls.activate('C_backVISI');
		this.elements.collect(this.eids);
		this.ontab('A');
	},
	refresh: function() { this.alphatab(this.state.letter); return this; }, // see (*rf01*)

	// handlers
	save: function() { // to be decided what we do with this
		if(!this.controls.validation()) return;
		// this.alphabusy(true);
		// let names = { id:'id'};
		// mobminder.app.post(this.controls, names, './post/visiselect.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	remove: function() {
		this.alphabusy(true);
		let names = { id:'id' };
		mobminder.app.post(this.controls, names, './delete/visitors.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	deletemsg: function() {
		let msg = 'Are you sure that you want to delete ALL visitors from this account?';
		let bp = 'This operation CAN NOT be UNDONE !';
		return msg+'<div class="orange center blueprint airtop airunder notbold">'+bp+'</div>';
	},
	
	// private
	alphabusy: function(on) {
		if(on) {
			$(this.elements.overlay).addClass('on');
			C_iWIN.cursor('wait');
		} else {
			$(this.elements.overlay).removeClass('on');
			C_iWIN.cursor();
		}
	},
	header: function() {
		// buttons & title
				let buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
				let title = '<td class="mheader"><h1>'+C_XL.w('visitors register')+symbol('visitors','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
			let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div><table style="width:100%; padding:1em 0 0 0;">'+header+'</table></div>';
		
		// filters
			let ftype = '<td>'+this.controls.filter.display()+'</td>';
			let fnone = '<td id="'+this.eids.filters.none+'">'+C_XL.w('vfilter none tip')+'</td>';
			let frscs = '<td id="'+this.eids.filters.byrsc+'" style="display:none;">'+this.controls.staff.display()+'</td>';
			
		let filters = '<div><table style="margin:1em auto 1em auto;"><tr style="vertical-align:top;">'+ftype+fnone+frscs+'<tr></table></div>';
		
		// tabs
		let divTabs = this.controls.tabs.display('floating tabs-squeeze');
		return '<div class="visitors-header">'+divHeader+filters+divTabs+'</div>';
	},
	
	// events
	ontab: function(letter) {
		if(vbs) vlog('mobminder.js','C_backVISI','ontab','letter:'+letter); 
		this.alphabusy(true);
		// if(letter!=this.state.letter) this.elements.alphadiv.innerHTML = '';
		this.state.letter = letter;
		let names = { id:'id', tabs:'letter', filter:'filter', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' } };
		mobminder.app.post(this.controls, names, './queries/alphatab.php', new A_cb(this,this.alphastream), new A_cb(this,this.failed));
		C_dS_visitorAlpha.init();
	},
	staff: function() {
		if(vbs) vlog('mobminder.js','C_backVISI','staff',''); 
		this.ontab(this.state.letter);
	},
	filter: function(which) {
		let fchange = which != this.state.filter; if(!fchange) return; 
		this.state.filter = which;
		if(vbs) vlog('mobminder.js','C_backVISI','filter','which:'+which); 
		for(let eid in this.elements.filters.get) $(this.elements.filters[eid]).hide(); $(this.elements.filters[which]).show();
		this.ontab(this.state.letter);
	},
	onvisirow: function(visitorId) {
		let o_dS_visitor = C_dS_visitor.get(visitorId);
		let modal = new M_VISI(o_dS_visitor, { saved:new A_cb(this, this.visitorsaved) });
	},
	
	// ajax callbacks
	alphastream: function(dataSets, stream) {
		// stream like:
		// some info
		// ## letter ##
		// <code> ... </code>
			let parts = stream.split('##');
			let misc = parts.shift()
			let letter = parts.shift();
			let asyncmatch = (letter==this.state.letter); // if in between async delay, the surfer has chosen another tab, the asyncmatch is false
		if(vbs) vlog('mobminder.js','C_backVISI','alphastream','letter:'+letter+', asyncmatch:'+asyncmatch); 
		if(!asyncmatch) return;
		this.alphatab(letter);
	},
	alphatab: function(letter) {
		let ids = C_dS_visitorAlpha.get(letter, mobminder.app.hidedeleted); // array like ids[x] = id
		let table = new C_iARRAY(this.eids.table, this.catalysts, { onrow:new A_cb(this, this.onvisirow) }, { ids:ids, max:false, sum:false, count:true, viewset:true, xport:true, endoflist:true }); 
		this.elements.alphadiv.innerHTML = table.display('visitors');
		table.activate();
		this.alphabusy(false);
	},
	
	saved: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
		this.alphabusy(false);
	},
	removed: function() { 
		this.ontab(this.state.letter);
		this.alphabusy(false);
		if(vbs) vlog('mobminder.js','C_backVISI','removed','id:'+id); 
	},
	failed: function() {
		this.alphabusy(false);
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		this.ontab(this.state.letter);
		if(vbs) vlog('mobminder.js','C_backVISI','visitorsaved','id:'+id); 
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E     :   S T A T I S T I C S
//
function C_backSTAT(eid, callbacks, preset) {
		let b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons', table:b+'table', dp:b+'dp', xw:b+'xw'
		, account:b+'accn', actuals:b+'actl', actions:b+'actn', smstraf:b+'smst'
		, resrces:b+'resc', staff:b+'staff', logins:b+'lgns', templates:b+'tmpl' };
	this.state = C_backSTAT.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };
	this.elements = new A_el(); 
	
	this.summed = { actuals:new Array(), actions:new Array(), ccss:new Array(), perfos:new Array(), smstraf:new Array() };
	
if(vbs) vlog('mobminder.js','C_backSTAT','construction','');
	
	// account
	const id	= new C_iPASS(mobminder.account.id);

	// controls
		const sunday = new Date(); sunday.sunday();
	const dp	= new C_iDP(this.eids.dp, {dayclick:new A_cb(this, this.sunday)}, { jsdate:sunday, maxdate:sunday, weekdays:[0], display:{} });
	
		const xwoptions = function() { // number of weeks to be cumulated
				const w = function(n) { return n+' '+C_XL.w('week'+(n>1?'s':'')) }
			const labels = { 1:w(1), 2:w(2), 4:w('4'), 8:w(8), 12:w(12), 24:w(24), 36:w(36), 52:w(52), 104:w(104) };
			const order = []; for(let x in labels) order.push(x);
			return { order:order, labels:labels, presets:{}, count:order.length };
		}
	const xw = new C_iDDWN(this.eids.xw, { onselect:new A_cb(this, this.xweeks) }, xwoptions(), { maxcols:1, maxrows:1, value:1 } );
	
	const staff 	= new C_iSTAFF(this.eids.staff, 'empty', new A_cb(this,this.staff), C_dS_resource.getByType() );
	const logins 	= new C_iUSERS(this.eids.logins, { changed:new A_cb(this, this.logins) }, { hide:[aLevel.synchro] }, C_dS_loggable.get() );

	//
	this.catalysts = { // they should not reset their setting when dp changes dates or xw changes weeks
		actions: { 	  resas: new C_dS_xmon_action.catalyst({on:[ 'id', 'resaNew', 'resaEdit', 'resaDel' ]})
					, apps: new C_dS_xmon_action.catalyst({on:[ 'id', 'appNew' , 'appEdit' , 'appDel' ]})
					, notes: new C_dS_xmon_action.catalyst({on:[ 'id', 'noteNew', 'noteEdit', 'noteDel' ]})  
					, tasks: new C_dS_xmon_action.catalyst({on:[ 'id', 'taskNew', 'taskEdit', 'taskDel', 'taskAssigned', 'taskAchieved' ]})  
					, visis: new C_dS_xmon_action.catalyst({on:[ 'id', 'visiNew', 'visiEdit', 'visiMerge' ]})
				},
		smstraf: new C_dS_xmon_sms.catalyst(),
		actuals: new C_dS_xmon_actual.catalyst()
	}
	
	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, { onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
		const labels = { account:'stats account', actuals:'stats actuals', actions:'stats actions', smstraf:'stats smstraf' };
	
	const tabs = new C_iTABS(this.eids.tabs, C_XL.w(labels), { ontab:new A_cb(this, this.ontab )} );
	this.controls = new A_ct( { cartouche:cartouche, dp:dp, xw:xw, tabs:tabs, id:id, logins:logins, staff:staff	} );
}
C_backSTAT.defaults = new A_df( { letter:'A' } );
C_backSTAT.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backSTAT','display',''); 
		
		// account
		const account = '<div id="'+this.eids.account+'"></div>';
		
		// actuals
		const staff = '<div style="display:inline-block; margin:0 auto;">'+this.controls.staff.display()+'</div>';
		const actuals = staff+'<div id="'+this.eids.actuals+'"></div>';
		
		// actions
		const logins = this.controls.logins.display();
		const actions = logins+'<div id="'+this.eids.actions+'"></div>';
		
		// smstraf
		const smstraf = '<div id="'+this.eids.smstraf+'"></div>';
		
		// make tabs
		const c_account = this.controls.tabs.container('account', account, 'wide deep' );
		const c_actuals = this.controls.tabs.container('actuals', actuals, 'wide deep' );
		const c_actions = this.controls.tabs.container('actions', actions, 'wide deep' );
		const c_smstraf = this.controls.tabs.container('smstraf', smstraf, 'wide deep' );
		
			// final packaging
				const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
				const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
			const combocontainers = '<div>'+c_account+c_actuals+c_actions+c_smstraf+'</div>'; // do not invert <div> layout sequence!
			const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
		const headers = '<div class="prefs-header">'+this.header()+'</div>';
		const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';

		
		return '<div class="C_backSTAT prefs-grid" style="height:100%; min-height:100%;">'+headers+tabcontainers+'</div>'; // makes the entire inner content scrollable
	},
	activate:function() {
		this.controls.activate('C_backSTAT');
		this.elements.collect(this.eids);
		this.sunday();
	},

	// handlers
	save: function() {
		if(!this.controls.validation()) return;
		this.busy(true);
		let names = { id:'id'};
		mobminder.app.post(this.controls, names, './post/stats.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	
	// private
	busy: function(on) {
		
	},
	header: function() {
			let buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
				let dp = this.controls.dp.display('alpha16 mindertext bigger bold');
				let xw = this.controls.xw.display('alpha12 mindertext bigger bold');
			let left = '<td>'+dp+'&nbsp;'+C_XL.w('for')+'&nbsp;'+xw+'</td>';
			let right = '<td><h1>'+C_XL.w('account statistics')+':&nbsp;'+mobminder.account.name+symbol('stats','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
		let header = '<table style="width:100%;" summary="account statistics header"><tr>'+buttons+left+right+'</tr></table>';
		let divHeader = '<div style="padding:1em 0 2em 0;">'+header+'</div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;		
	},
	fetch: function() {
		let names = { id:'id', dp:'sunday', xw:'xweeks' };
		mobminder.app.post(this.controls, names, './queries/stats.php', new A_cb(this,this.freshstats), new A_cb(this,this.failed));
		this.controls.tabs.busy('account', true );
		this.controls.tabs.busy('actuals', true );
		this.controls.tabs.busy('actions', true );
		this.controls.tabs.busy('smstraf', true );
	},
	h2: function(msg) { return '<h2 style="padding:2em 0 0.5em 0">'+msg+'</h2>'; },	
	h3: function(msg) {	return '<h3 style="padding:2em 0 0.5em 0">'+msg+'</h3>'; },
	
	drawCcssBar: function(eid, action, ccssclass, scale, options) {
		let html = '';
		for(let type in ccsstype) { // [color, pattern]
			
			let ccss = C_dS_customCss.getByType(ccssclass, ccsstype[type]);
			
			// build graphical data points
			let points = new Array();
			for(let ccssId in ccss) { 
				let xmon = this.summed.ccss[-ccssId][action];
				if(xmon==0) continue;
				points.push({label:ccss[ccssId].name, measure:xmon, css:ccss[ccssId].cssName});
			}
			
			// append graphics to html output
			if(points.length) {
				html += this.h2(C_XL.ccss(ccssclass,ccsstype[type]));
				let graphC = new C_iBAR(eid+'_'+ccssclass+'_'+type, points, scale, options );
				html += graphC.display('shadow');
			}
		}
		return html;
	},
	drawPerfsBar: function(eid, action) {
		let html = '';
		
		// consolidate data of x weeks
		let workcodes = C_dS_workcode.get();
		
		let max = 0, total = 0, xmon = this.summed.perfos; 
		order = new Array(); 
		for(let wkId in xmon) { 
			let p = xmon[wkId][action];
			if(!p) continue;
			if(max<p) max = p; total += p;
			order.push(wkId); 
		}
		order.sort(function(ida,idb){ // put most realized work code on top
			let pa = xmon[ida][action], pb = xmon[idb][action];
			if(pa==pb) return 0;
			if(pa<pb) return 1; else return -1;
		});
		
		// build multi bars graphics 
		if(order.length) {
			html += this.h2(C_XL.w('performances')+': '+total);
			for(let idx in order) { 
				let wkid = order[idx]; 
				let p = xmon[wkid][action];
				let dS = workcodes[-wkid]; if(!dS) continue;
					let options = { barHeight:'1em', total:false, legend:dS.name, legendDisplay:'fixfront' };
				let bar = new C_iBAR(eid+'_perf'+dS.id, {0:{label:false, measure:p, css:dS.wcss()}}, max, options);
				html += bar.display();
			}
		}
		return html;
	},
	account: function() {
		let html = this.h2(C_XL.w('visitors'));
		
		let sunday = this.controls.dp.stamp();
		let account = C_dS_xmon_account.registers.sunday.get();
		let xmon = account[sunday]; 
			
		if(!xmon) { 
			this.controls.tabs.busy('account', false);
			return this.elements.account.innerHTML = '<h3>No data</h3>';
		}
		
		// Visitors count
		let xdate = new Date(sunday*1000);
			let options = { barHeight:'2em', total:xmon.visiCount, legend:xdate.sortable()};
		let title1 = this.h3(C_XL.w('mobile'));
		let graph1 = new C_iBAR(this.eids.account, {0:{label:C_XL.w('with mobile'), measure:xmon.visiMobile, css:'c274'}}, xmon.visiCount, options );
		
		// Visitors gender
		let title2 = this.h3(C_XL.w('sex'));
		let graph2 = new C_iBAR(this.eids.account, {0:{label:C_XL.w('men'), measure:xmon.visiMales, css:'c282'}, 1:{label:C_XL.w('women'), measure:xmon.visiFemales, css:'c293'}}, xmon.visiCount, options );
		
		html += title1+graph1.display('shadow')+title2+graph2.display('shadow');
			
			options.barTextVertical = 'bottom';
		html += this.drawCcssBar(this.eids.account, 'actual', ccssclasses.visitor, xmon.visiCount, options);
		
		this.elements.account.innerHTML = html;
		this.controls.tabs.busy('account', false);
	},
	actuals: function() {

		let html = '';
		
		// change staff control id signs
			let staff = this.controls.staff.value(); 
		for(let type in staff) for(let x in staff[type]) staff[type][x] = -staff[type][x];
		
		// get xmons available resource ids and AND with ids of resources in the config
			let xmons = arrayKEYS(this.summed.actuals);
		for(let type in staff) staff[type] = arrayAND([staff[type], xmons]);
		
		// table presentation
		let actuals = new A_ct();
		for(let aclass in agClass) { // aclass = [bCal, uCal, fCal]
			let type = agClass[aclass]; // type = [2, 1, 4]
			if(!staff[type].length) continue; // no resource of this type is selected
			let ids = staff[type];
			let table = new C_iARRAY(this.eids.actuals+'_type'+type, this.catalysts.actuals, {}, { ids:ids, max:true, sum:true } ); 
			html += this.h2(C_XL.w(type))+table.display('actuals');
			actuals.add1(table,type);
		}
		
		// graphical presentation
		let max = 0; // used for scaling all graphs
		for(let type in staff) for(let x in staff[type]) {
			let id = staff[type][x];
			let xmon = this.summed.actuals[id].appCount;
			if(max<xmon) max=xmon;
		}
		html += this.h2(C_XL.w('appointments')+', '+this.controls.dp.jsdate().sortable());
		
		// by resource
		let totals = { bCal:0, uCal:0, fCal:0 }; // total appointments by week
		for(let aclass in agClass) { // aclass = [bCal, uCal, fCal]
			let type = agClass[aclass]; // type = [2, 1, 4]
			if(!staff[type].length) continue; // no resource of this type is selected
			let databars = new Array();
			let disporder = C_dS_resource.displayorder(type);
			for(let idx in disporder) { 
				let rscId = disporder[idx];
				let rsc = C_dS_resource.get(rscId); 
				let negid = -rscId; 
				if(!arrayHAS(staff[type],negid)) continue; // this resource is not selected
				
				let xmon = this.summed.actuals[negid].appCount;
					totals[aclass] += xmon;
				let barcss = rsc.color ? 'c'+rsc.color : 'c'+(150+type);
				let options = { barHeight:'1.5em', total:false, legend:rsc.name, legendDisplay:'fixfront' };
				databars.push(new C_iBAR(this.eids.actuals+'_'+rscId,{0:{label:false, measure:xmon, css:barcss}}, max, options));
			}
			
			if(databars.length) {
				html += '<h3 style="padding:2em 0 0.5em 0">'+C_XL.w(type)+', '+C_XL.w('total')+':'+totals[aclass]+'</h3>';
				while(b = databars.shift()){ html += b.display(); }
			}
		}	
			
		// custom Ccss 
			let options = { barHeight:'2em', total:false, legend:false, barTextVertical:'bottom' };
		html += this.drawCcssBar(this.eids.actuals, 'actual', ccssclasses.appointment, max, options);
		
		// performances	
			let perfsBars = this.drawPerfsBar(this.eids.actuals, 'actual');
		if(mobminder.account.has.workcodes) html += perfsBars;
		
		
		this.elements.actuals.innerHTML = html;
		this.controls.tabs.busy('actuals', false);
		actuals.activate();
	},
	actions: function() {
		let html = '';
		let sunday = this.controls.dp.stamp();
		let xweeks = this.controls.xw.value();
		
			let logins = this.controls.logins.value(); for(let x in logins) logins[x] = -logins[x]; // negative ids for summed xmons 
			let xmons = arrayKEYS(this.summed.actions);
			let ids = arrayAND([logins, xmons]);
			
		let resas = new C_iARRAY(this.eids.actions+'_resas', this.catalysts.actions.resas, {}, { ids:ids, max:true, sum:true } ); 
		let apps  = new C_iARRAY(this.eids.actions+'_apps', this.catalysts.actions.apps, {}, { ids:ids, max:true, sum:true } ); 
		let visis = new C_iARRAY(this.eids.actions+'_visis', this.catalysts.actions.visis, {}, { ids:ids, max:true, sum:true } ); 
		let notes = new C_iARRAY(this.eids.actions+'_notes', this.catalysts.actions.notes, {}, { ids:ids, max:true, sum:true } ); 
		let tasks = new C_iARRAY(this.eids.actions+'_tasks', this.catalysts.actions.tasks, {}, { ids:ids, max:true, sum:true } ); 
		
		html += this.h2(C_XL.w('reservations'))+resas.display('actions');
		html += this.h2(C_XL.w('appointments'))+apps.display('actions');
		html += this.h2(C_XL.w('visitors'))+visis.display('actions');
		html += this.h2(C_XL.w('notes'))+notes.display('actions');
		html += this.h2(C_XL.w('tasks'))+tasks.display('actions');
		
		// custom Ccss 
			let options = { barHeight:'2em', total:false, legend:false, barTextVertical:'bottom' };
		html += this.drawCcssBar(this.eids.actuals, 'action', ccssclasses.appointment, 100, options);
		
		// performances	
		if(mobminder.account.has.workcodes) html += this.drawPerfsBar(this.eids.actions, 'action');
		
		this.elements.actions.innerHTML = html;
		this.controls.tabs.busy('actions', false);
		resas.activate();
		apps.activate();
		visis.activate();
		notes.activate();
		tasks.activate();
		// table.appendToTable(this.summed.actions);
	},
	smstraf: function() {
		let html = '';
		let sunday = this.controls.dp.stamp();
		let xweeks = this.controls.xw.value();
		
			let xmons = arrayKEYS(this.summed.smstraf);
			let ids = xmons; //= arrayAND([templates, xmons]); 


		let scale = 0, points = new Array(), totals = new Array();
		
		for(let x in ids) {
			let xmon = this.summed.smstraf[ids[x]];
			points[x] = { 
				0:{label:C_XL.w('sms_delivered'), measure:xmon.r1delivered, css:'c243'}
				, 1:{label:C_XL.w('sms_pending'), measure:xmon.r1pending, css:'c292'}
				, 2:{label:C_XL.w('sms_discarded'), measure:xmon.r1error, css:'c237'}
				, 3:{label:C_XL.w('sms_nofeedback'), measure:xmon.r1nofeedback, css:'c217'}
			};
			// totals[x] = xmon.r1handled; 
			totals[x] = xmon.r1delivered+xmon.r1pending+xmon.r1error+xmon.r1nofeedback;
			if(scale<totals[x]) scale = totals[x];
		}
		let smstraf;
		if(points.length) {
			html += this.h2(C_XL.w('transmission quality'));
			
			// coloured bar graph
			for(let x in ids) {
				let templId = -ids[x];
				let template = C_dS_smsTemplate.get(templId);
				let title = this.h3(template.name);
				let options = { barHeight:'2em', total:totals[x], legend:false, barTextVertical:'bottom'};
				let graph = new C_iBAR(this.eids.account, points[x], scale, options );
				html+=title+graph.display('shadow');
			}
			
			// table
			smstraf = new C_iARRAY(this.eids.smstraf+'_sms', this.catalysts.smstraf, {}, { ids:ids, max:false, sum:true } ); 
			html += this.h2(C_XL.w('details per route'))+smstraf.display('smstraf');
		}
		else html += this.h2(C_XL.w('sms_nosms'));
			
		this.elements.smstraf.innerHTML = html;
		this.controls.tabs.busy('smstraf', false);
		
		if(points.length) smstraf.activate();
	},
	
	// callbacks
	ontab: function(letter) {
		if(vbs) vlog('mobminder.js','C_backSTAT','ontab','letter:'+letter); 
	},
	sunday: function(jsdate, stamp) {
		if(vbs) vlog('mobminder.js','C_backSTAT','sunday','jsdate:'+(jsdate?jsdate.sortable():'none')); 
		this.fetch();
	},
	xweeks: function(value) {
		if(vbs) vlog('mobminder.js','C_backSTAT','xweeks','xweeks:'+value); 
		this.fetch();
	},
	logins: function() {
		this.actions();
	},
	staff: function() {
		this.actuals(); 
	},
	
	// ajax callbacks
	saved: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
		this.busy(false);
	},
	freshstats: function(datsSets, stream) {
		
		
		// summing measure points as per date picker and period settings
		//
		let logins = C_dS_loggable.get(); for(let id in logins) this.summed.actions[-id] = new C_dS_xmon_action([-id]);
		let resour = C_dS_resource.get(); for(let id in resour) this.summed.actuals[-id] = new C_dS_xmon_actual([-id]);
		let ccsses = C_dS_customCss.get(); for(let id in ccsses) this.summed.ccss[-id] = new C_dS_xmon_ccss([-id]);
		let perfos = C_dS_workcode.get(); for(let id in perfos) { this.summed.perfos[-id] = new C_dS_xmon_perfs([-id]); }
		let smstmp = C_dS_smsTemplate.get(); for(let id in smstmp) this.summed.smstraf[-id] = new C_dS_xmon_sms([-id]);
		
		let jsdate = this.controls.dp.jsdate();
		let xweeks = this.controls.xw.value();
		let id, sunday;
		for(sunday = jsdate.stamp(); xweeks--; sunday = jsdate.addWeek(-1).stamp()) {
			for(id in logins) if(sunday in logins[id].xmon) this.summed.actions[-id].add(logins[id].xmon[sunday]);
			for(id in resour) if(sunday in resour[id].xmon) this.summed.actuals[-id].add(resour[id].xmon[sunday]);
			for(id in ccsses) if(sunday in ccsses[id].xmon) this.summed.ccss[-id].add(ccsses[id].xmon[sunday]);
			for(id in perfos) if(sunday in perfos[id].xmon) this.summed.perfos[-id].add(perfos[id].xmon[sunday]);
			for(id in smstmp) if(sunday in smstmp[id].xmon) this.summed.smstraf[-id].add(smstmp[id].xmon[sunday]);
		}
				
		// display
		//
		this.account();
		this.actuals(); 
		this.actions(); 
		this.smstraf(); 
		
	},
	failed: function() {
		this.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E     :   S M S     T R A F I C   (for sellers only - IN CONSTRUCTION) 
//
function C_backSMS(eid, callbacks, preset) {
	let b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons', table:b+'table'
			, counters:b+'cnt', details:b+'dtl', graphs:b+'grf', bars:b+'brs'
			, filters: { period:b+'f_prd' }
			, iarrays: { smscount:b+'ir_sms' }};
	this.state = C_backSMS.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };
	this.elements = new A_el(); 
	
	
if(vbs) vlog('mobminder.js','C_backSMS','construction','');
	
	// account
	const id	= new C_iPASS(mobminder.account.id);

	// controls
	
		const filterchanging = new A_cb(this, this.filterchanging);
		this.delayedfetch = new A_cb(this, this.filterschanged, false, filterchanging, 1000);

		let today = new Date(); today = today.toMidnight().stamp();
		const options = { 2:'from date', 3:'in period', 6:'single day' }
	const period = new C_iPERIOD(this.eids.filters.period, { pchange:this.delayedfetch }, { midnIn:today, midnOut:0, options:options } );

	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, { onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
		
		const labels = { graphs:'sms graphs', counters:'sms counters', details:'sms details' };
	const tabs = new C_iTABS(this.eids.tabs, C_XL.w(labels), { ontab:new A_cb(this, this.ontab )} );
	this.controls = new A_ct( { cartouche:cartouche, tabs:tabs, id:id
								, filters: new A_ct({period:period})	} );								
}
C_backSMS.defaults = new A_df( { letter:'A' } );
C_backSMS.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backSMS','display',''); 
		
		const dgraphs = '<div id="'+this.eids.graphs+'"></div>';
		const dcounters = '<div id="'+this.eids.counters+'"></div>';
		const ddetails = '<div id="'+this.eids.details+'"></div>';
		
		
		// make tabs
		const graphs = this.controls.tabs.container('graphs', dgraphs, 'wide deep' );
		const counters = this.controls.tabs.container('counters', dcounters, 'wide deep' );
		const details = this.controls.tabs.container('details', ddetails, 'wide deep' );
		
			// final packaging
				const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
				const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
			const combocontainers = '<div style="background-color:white;">'+graphs+counters+details+'</div>'; // do not invert <div> layout sequence!
			const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
		const headers = '<div class="prefs-header">'+this.header()+'</div>';
		const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';

		
		return '<div class="C_backSMS prefs-grid" style="position:absolute; inset:0; overflow:auto;">'+headers+tabcontainers+'</div>'; // makes the entire inner content scrollable
	},
	activate:function() {
		this.controls.activate('C_backSMS');
		this.elements.collect(this.eids);
	},

	// handlers
	save: function() {
		if(!this.controls.validation()) return;
		this.busy(true);
		let names = { id:'id'};
		mobminder.app.post(this.controls, names, './post/smscounting.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	
	// private
	busy: function(on) {
		
	},
	header: function() {
		
		let cperiod  	= this.controls.filters.period.display('','margin:0em auto 2em auto;');	
		
			let buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
			let span = '<span style="padding-left:1em;" class="fa fa-gray fa-2x fa-rss"></span>';
			let right = '<td><h1>'+C_XL.w('sms monitoring')+symbol('smsmon','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
		let header = '<div style="padding:1em 0 0em 0;"><table style="width:100%;" summary="SMS counters header"><tr>'+buttons+right+'</tr></table></div>';
		let filters = '<div style="vertical-align:top;">'+cperiod+'</div>';
		let tabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return header+filters+tabs;
	},
	fetch: function() {
		let names = { id:'id'		
					, filters: { period:{midnIn:'midnIn',midnOut:'midnOut'} } 
					};
		mobminder.app.post(this.controls, names, './queries/smsdash.php', new A_cb(this,this.freshdata), new A_cb(this,this.failed));
		this.controls.tabs.busy('counters', true );
		this.controls.tabs.busy('details', true );
		C_dS_smsCounters.reset();
	},
	h2: function(msg) { return '<h2 style="padding:2em 0 0.5em 0">'+msg+'</h2>'; },	
	h3: function(msg) {	return '<h3 style="padding:2em 0 0.5em 0">'+msg+'</h3>'; },
	
	// filters handling
	filterchanging: function() { // called while the filters are changed
		if(vbs) vlog('mobminder.js','C_backSMS','filterchanging',''); 
			let fchanging = '<div style="margin:2em 0 0em 0; text-align:center">'+C_XL.w('afilter changing')+'</div>';
		this.controls.tabs.html('counters', fchanging);
		this.controls.tabs.html('details', fchanging);
		this.controls.tabs.html('graphs', fchanging);
	},
	filterschanged: function() { // called 3 seconds after filters have not changed anymore
		if(vbs) vlog('mobminder.js','C_backSMS','filterschanged','filters:'+this.state.filter); 
		this.fetch();
	},
	
	// callbacks
	ontab: function(which) {
		if(vbs) vlog('mobminder.js','C_backSMS','ontab','letter:'+which); 
	},
	onrow: function(id) {
	},
	
	// ajax callbacks
	saved: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
		this.busy(false);
	},
	freshdata: function(dSets, stream) {
		this.controls.tabs.busy('counters', false );
		this.controls.tabs.busy('details', false );

		let hmany = C_dS_smsCounters.registers.id.ends();
		if(!hmany) {
			let none = '<div style="margin:2em 0 0em 0; text-align:center">'+C_XL.w('no search result')+'</div>';
			this.controls.tabs.html('counters',none);
			this.controls.tabs.html('graphs',none);
			this.controls.tabs.html('details',none);
			return;
		}
		
		// grids of figures
		//
		let tnames = {}, iarrays = {};
		for(let id in dSets['C_dS_smsCounters']) {
			let dS = dSets['C_dS_smsCounters'][id];
			let tid = dS.templateId; if(tid in tnames) continue;
			let templ = C_dS_smsTemplate.get(tid);
			if(templ) tnames[tid] = templ.name; else tnames[tid] = 'deleted ?'; // when no match is found, the template was deleted in the account setup
			iarrays[tid] = new C_iARRAY(this.eids.iarrays.smscount+'_'+tid, new C_dS_smsCounters.catalyst({templateId:tid}), {onrow:new A_cb(this, this.onrow)}, {count:true, sum:true, endoflist:true } );
		}
		
		let counters = ''; for(let tid in tnames) counters += this.h2(tnames[tid])+iarrays[tid].display();
		

		// bar graphs
		//
		let scale=0, points={}, totals={}, bars={}, legends={}, v=hmany>21?0:1;
		for(let id in dSets['C_dS_smsCounters']) {
			let dS = dSets['C_dS_smsCounters'][id];
			points[id] = { 
				  0:{	label:v?C_XL.w('sms_nofeedback'):''	, measure:dS.handled+dS.error	, css:'c217'	}
				, 1:{	label:v?C_XL.w('sms_discarded'):''	, measure:dS.discarded			, css:'c237'	}
				, 2:{	label:v?C_XL.w('sms_pending'):''	, measure:dS.pending			, css:'c255'	}
				, 3:{	label:v?C_XL.w('sms_delivered'):''	, measure:dS.delivered			, css:'c243'	}
			};
			totals[id] = dS.msgs; legends[id] = dS.date;
			if(scale<totals[id]) scale = totals[id];
			
		}
		for(let id in points) { // scale must be defined before you get here
				let options = { legend:legends[id], legendDisplay:'fixfront', barHeight:v?'2em':'1em', total:totals[id], barTextVertical:'bottom' };
			bars[id] = new C_iBAR(this.eids.bars+'_'+id, points[id], scale, options );
		}		
		
		let graphs = ''; for(let tid in tnames) {
			graphs += this.h2(tnames[tid]);
			for(let id in C_dS_smsCounters.registers.template.get(tid)) graphs += bars[id].display('linedup');
		}
		
		// refresh dom and activate
		//
		this.controls.tabs.html('counters',counters);
		this.controls.tabs.html('graphs',graphs);
		this.controls.tabs.html('details','');
		for(let tid in tnames) iarrays[tid].activate(); 
		return;
		
	},
	failed: function() {
		this.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E :   A R C H I V E D    T A S K S ,   N O T E S   a n d   C H A T S 
//
function C_backARCH(eid, callbacks, preset) {
	let b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons'
			, logins:b+'logns', filter:b+'filtr', dp:b+'dp', xw:b+'xw', finset:b+'fin', busy:b+'bsy'
			, filters:{ period:b+'f_period', keyword:b+'f_kwrd'}
			, iarrays:{ notes:b+'rr_nts', tasks:b+'rr_tsk', chats:b+'rr_cht' }
			, filter:b+'cfilter', keyword:b+'ckeyword'
			};
	this.state = C_backARCH.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };
	this.elements = new A_el(); 
	
	
if(vbs) vlog('mobminder.js','C_backARCH','construction','');
	
	// account
	const id	= new C_iPASS(mobminder.account.id);

	// controls
		const filterchanging = new A_cb(this, this.filterchanging);
		const filtergroup = new A_cb(this, this.filterschanged, null, filterchanging, 3000);
	const logins 	= new C_iUSERS(this.eids.logins, { changed:filtergroup }, {}, C_dS_loggable.get() );
	
			const filters = C_XL.w({ created:'afilter created', archived:'afilter archived', keyword:'afilter keyword' });
		const forder = ['created','archived','keyword'];
	const filter = new C_iCRESTA(this.eids.filter, { onchange:new A_cb(this, this.filter) }, { order:forder, labels:filters, count:forder.length }, { skin:0, mode:-1, value:this.state.filter, title:C_XL.w('afilter title') } );
	const keyword = new C_iFIELD(this.eids.keyword, { onfchange:new A_cb(this, this.keyword, null, null, 2000 ), onfclear:new A_cb(this, this.keywclear) }, { digits:'', type:INPUT_TEXT, mandatory:false, placeholder:C_XL.w('type keyword') });

		const sunday = new Date();
	const dp	= new C_iDP(this.eids.dp, {dayclick:filtergroup}, { jsdate:sunday, maxdate:false, weekdays:false, display:{} });
	
		const xwoptions = function() { // number of weeks to be cumulated
			const labels = { 1:'1 '+C_XL.w('week'), 2:'2 '+C_XL.w('weeks'), 4:'4 '+C_XL.w('weeks'), 8:'8 '+C_XL.w('weeks'), 12:'12 '+C_XL.w('weeks') };
			const order = []; for(let x in labels) order.push(x);
			return { order:order, labels:labels, presets:{}, count:order.length };
		}
	const xw = new C_iDDWN(this.eids.xw, { onselect:filtergroup }, xwoptions(), { maxcols:1, maxrows:1, value:1 } );
	
	this.chat_catalyst = new C_catalyst(C_dS_chat_thread.catalyst_Archives);
	
	// results display
	this.rrnotes = new C_iARRAY(this.eids.iarrays.notes, new C_catalyst(C_dS_note_detail.catalyst_archives), {onrow:new A_cb(this, this.onnote)}, { count:true, endoflist:true } ); 
	this.rrtasks = new C_iARRAY(this.eids.iarrays.tasks, new C_catalyst(C_dS_task_description.catalyst_archives), {onrow:new A_cb(this, this.ontask)}, { count:true, endoflist:true } ); 
	this.rrchats = new C_iARRAY(this.eids.iarrays.chats, this.chat_catalyst, {onrow:new A_cb(this, this.onchat)}, { viewset:true, count:true, endoflist:true } );
	
	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, { onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
		const labels = { notes:'notes', tasks:'tasks', chats:'chats' };
	
	let tabs = new C_iTABS(this.eids.tabs, C_XL.w(labels), { ontab:new A_cb(this, this.ontab )} );
	this.controls = new A_ct( { cartouche:cartouche, tabs:tabs, id:id, filter:filter, logins:logins, keyword:keyword, dp:dp, xw:xw } );
}
C_backARCH.defaults = new A_df( { filter:'created', fbusy:false, tbusy:false } );
C_backARCH.title = function() {	
	let title = C_XL.w('account archives')+': ';
	let items = [];
		if(mobminder.account.usenotes) items.push(C_XL.w('notes'));
		if(mobminder.account.usetasks) items.push(C_XL.w('tasks'));
		if(mobminder.account.usechat) items.push(C_XL.w('chats'));
	return title+items.join(', ');
};
C_backARCH.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backARCH','display',''); 
		
		// make tabs
		const notes = this.controls.tabs.container('notes', '', 'wide deep' ); // empty, filled by this.archfreshdata()
		const tasks = this.controls.tabs.container('tasks', '', 'wide deep' );
		const chats = this.controls.tabs.container('chats', '', 'wide deep' );
		
		// hide unused stuffs
		if(!mobminder.account.usenotes) { this.controls.tabs.hide('notes', true); };
		if(!mobminder.account.usetasks) { this.controls.tabs.hide('tasks', true); };
		if(!mobminder.account.usechat) { this.controls.tabs.hide('chats', true); };
		
		// const h = '<div class="archives-header">'+this.header()+'</div>';
		const t = '<div style="background:rgba(245,245,245,.1);">'+notes+tasks+chats+'</div>';
		
			// final packaging
				const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
				const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
			const combocontainers = '<div style="background-color:white;">'+t+'</div>'; // do not invert <div> layout sequence!
			const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
		const headers = '<div class="prefs-header">'+this.header()+'</div>';
		const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';


		return '<div class="C_backARCH prefs-grid" style="height:100%; min-height:100%;">'+headers+tabcontainers+'</div>'; // makes the entire inner content scrollable
	},
	activate:function() {
		this.controls.activate('C_backARCH');
		this.elements.collect(this.eids);
		this.fetch();
	},
	refresh: function() { // see (*rf02*)
			let cids = C_dS_chat_thread.get('archives', mobminder.app.hidedeleted); // array like ids[x] = id, for chats we filter out deleted items according to the Ctrl+D shortcut
		this.rrchats.setids(cids); // when ids are set from here, they will no longer be fetched by the C_dS_chat_thread.catalyst_Archives::sort function 
		this.rrchats.refresh();
		return this;
	},

	// main buttons handlers
	save: function() {
		// if(!this.controls.validation()) return;
		// let names = { id:'id'};
		// mobminder.app.post(this.controls, names, './post/archives.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	
	// private
	header: function() {
		// buttons & title
			let buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
			let right = '<td><h1>'+C_backARCH.title()+symbol('archives','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
		let header = '<table style="width:100%;" summary="account statistics header"><tr>'+buttons+right+'</tr></table>';
		let divHeader = '<div style="padding:1em 0 0 0;">'+header+'</div>';
		
		// filters
				let tdftype = '<td>'+this.controls.filter.display()+'</td>';
						let dp = this.controls.dp.display('alpha16 mindertext bigger bold');
						let xw = this.controls.xw.display('alpha10 mindertext bigger bold right');
					let dpxw = '<table><tr><td>'+xw+'</td><td>'+'&nbsp;'+C_XL.w('untildate')+'&nbsp;'+dp+'</td></tr></table>';
				let tdfperiod = '<td id="'+this.eids.filters.period+'" style="vertical-align:top; padding-top:2.2em;">'+dpxw+'</td>';
				let tdkeywd = '<td id="'+this.eids.filters.keyword+'" style="display:none; vertical-align:bottom;">'+this.controls.keyword.display('alpha20')+'</td>';
			let row1 = '<tr style="vertical-align:top;">'+tdftype+tdfperiod+tdkeywd+'<tr>';
			
			let flogins = '<td></td><td style="vertical-align:top; padding-top:1em;">'+this.controls.logins.display({tablecss:'margin-centered align-top'})+'</td>';
			let row2 = '<tr style="vertical-align:top; text-align:center;">'+flogins+'<tr>';

			let t1 = '<table style="margin:0 auto;">'+row1+'</table>';
			let t2 = '<table style="margin:0 auto;">'+row2+'</table>';
		let filters = t1+t2;
		let finset = '<div id="'+this.eids.finset+'" style="position:relative;">'+filters+'</div>';
		
		// tabs
		let divTabs = '<div style="text-align:center; padding:2em 0 0em 0;">'+this.controls.tabs.display()+'</div>';
		
		return divHeader+finset+divTabs;
	},
	fetch: function() {
		this.fbusy(true).filterchanging();
		let names = { id:'id', filter:'filter', logins:'logins', keyword:'keyword', dp:'sunday', xw:'xweeks' };
		mobminder.app.post(this.controls, names, './queries/archives.php', new A_cb(this,this.archfreshdata), new A_cb(this,this.failed));
		ntmems.flush('plitems');
		cmems.flush('archives');
	},
	fbusy: function(onoff) { // filters zone busy overlay
		if(onoff && !this.state.fbusy) {
			let zindex = 1000+C_iMODAL.layer;
			let overlay = '<div class="overlay-busy-64px" id="'+this.eids.busy+'" style="position:absolute; z-index:'+zindex+'; top:0; left:0; width:100%; height:100%; overflow:hidden;"></div>';
			$(this.elements.finset).append(overlay);
			C_iWIN.cursor('wait');
		} else {
			let overlay = document.getElementById(this.eids.busy);
			if(overlay) $(overlay).remove();
			C_iWIN.cursor();
		}
		return this;
	},
	tbusy: function(onoff) { // tabs container zone busy overlay (not used in last version)
		if(onoff != this.state.tbusy) {
			this.controls.tabs.busy('notes', onoff );
			this.controls.tabs.busy('tasks', onoff );
			this.controls.tabs.busy('chats', onoff );
		}
		return this;
	},
	h2: function(msg) { return '<h2 style="padding:2em 0 0.5em 0">'+msg+'</h2>'; },	
	h3: function(msg) {	return '<h3 style="padding:2em 0 0.5em 0">'+msg+'</h3>'; },
	
	// handlers
	ontab: function(which) {
		if(vbs) vlog('mobminder.js','C_backARCH','ontab','letter:'+which); 
	},
	onnote: function(id) {
		let dS = ntmems['plitems'].notes.get(id);
		let notesaved = new A_cb(this, this.notesaved);
		let modal = new M_NOTE(dS, {saved:notesaved, removed:notesaved});
	},
	ontask: function(id) {
		let dS = ntmems['plitems'].tasks.get(id);
		let tasksaved = new A_cb(this, this.tasksaved);
		let modal = new M_TASK(dS, {saved:tasksaved, removed:tasksaved});
	},
	onchat: function(id) {
		let dS = cmems['archives'].chats.get(id);
			let chatsaved = new A_cb(this, this.chatsaved);
			let chatremoved = new A_cb(this, this.chatremoved, dS);
		let modal = new M_chat(dS, {saved:chatsaved, removed:chatremoved}, { tab:0 });
	},	
	
	// filters handlers
	filter: function(which) {
		let fchange = which != this.state.filter; if(!fchange) return; 
		this.state.filter = which;
		if(vbs) vlog('mobminder.js','C_backARCH','filter','which:'+which); 
			if(which=='created'||which=='archived') which = 'period';
		for(let eid in this.elements.filters.get) $(this.elements.filters[eid]).hide(); $(this.elements.filters[which]).show();
		if(which=='keyword') { this.controls.keyword.clear().focus(true); this.filterchanging(); return; } // no spontaneous fetch
		this.fetch();
	},
	filterchanging: function() {
		this.controls.tabs.html('notes', C_XL.w('afilter changing'));
		this.controls.tabs.html('tasks', C_XL.w('afilter changing'));
		this.controls.tabs.html('chats', C_XL.w('afilter changing'));
	},
	filterschanged: function() {
			let dpisopen = this.controls.dp.isopen(), xwisopen = this.controls.xw.isopen();
		if(vbs) vlog('mobminder.js','C_backARCH','onfilters','dpisopen'+dpisopen+', xwisopen'+xwisopen); 
		if(dpisopen||xwisopen) return;
		if(this.controls.filter.getvalue()=='keyword') return this.keyword(this.controls.keyword.value()); // because keyword length must be checked
		this.fetch();
	},
	keyword: function(digits) {
		if(vbs) vlog('mobminder.js','C_backARCH','keyword','digits:'+digits); 
		let stripped = digits.replace(/[ +]/gi,'');
		if(stripped.length <= 5) { this.filterchanging(); return; }
		this.fetch();
	},
	keywclear: function() {
		if(vbs) vlog('mobminder.js','C_backARCH','keywclear',''); 
	},
	
	// ajax callbacks
	saved: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
		this.busy(false);
	},
	archfreshdata: function(datsSets, stream) {
		
		this.controls.tabs.html('notes',this.rrnotes.display('notes-archive'));
		this.controls.tabs.html('tasks',this.rrtasks.display('tasks-archive'));
		this.controls.tabs.html('chats',this.rrchats.display('chats-archive'));
		
			let cids = C_dS_chat_thread.get('archives', mobminder.app.hidedeleted); // array like ids[x] = id, for chats we filter out deleted items according to the Ctrl+D shortcut
		this.rrchats.setids(cids); // when ids are set from here, they will no longer be fetched by the C_dS_chat_thread.catalyst_Archives::sort function 
		
		this.rrnotes.activate(); 
		this.rrtasks.activate(); 
		this.rrchats.activate(); 
		
		this.fbusy(false);
		return;
	},
	failed: function() {
		this.busy(false);
	},
	notesaved: function() {
		if(vbs) vlog('mobminder.js','C_backARCH','notesaved',''); 
		this.controls.tabs.html('notes',this.rrnotes.display('notes-archive'));
		this.rrnotes.activate(); 
	},
	tasksaved: function() {
		if(vbs) vlog('mobminder.js','C_backARCH','tasksaved',''); 
		this.controls.tabs.html('tasks',this.rrtasks.display('tasks-archive'));
		this.rrtasks.activate(); 
	},
	chatsaved: function() {
		if(vbs) vlog('mobminder.js','C_backARCH','chatsaved',''); 
		this.controls.tabs.html('chats',this.rrchats.display('chats-archive'));
		this.rrchats.activate(); 
	},
	chatremoved: function(dS) {
		if(vbs) vlog('mobminder.js','C_backARCH','chatremoved','id:'+dS.id);
				let d = new Date();
			dS.deletor = mobminder.context.surfer.name;
			dS.deletorId = mobminder.context.surfer.id;
			dS.deleted = d.datetimestr();
		this.controls.tabs.html('chats',this.rrchats.display('chats-archive'));
		this.rrchats.activate(); 
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E :   S E A R C H ,   F I L T E R   A N D   F I N D   R E S E R V A T I O N S 
//

function C_backFIND(eid, callbacks, preset) {
	
	const b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons'
			, multi:b+'multi', dp:b+'dp', xw:b+'xw', finset:b+'fin', rightinset:b+'rin', overlay:b+'overlay'
			, filters:{ keyword:b+'fc_kwrd', visitor:b+'fc_vi', period:b+'fc_pd', resources:b+'fc_ag', action:b+'fc_act', logins:b+'fc_lgns', color:b+'fc_col', pattern:b+'fc_ptr', tag:b+'fc_tg', wcode:b+'fc_wk', epay:b+'fc_ep' }
			, iarrays:{ resas:b+'rr_resas' }
			, fselectors:{ keyword:b+'fs_kw', visitor:b+'fs_vi', period:b+'fs_pd', resources:b+'fs_ag', action:b+'fs_act', color:b+'fs_col', pattern:b+'fs_ptr', tag:b+'fs_tg', wcode:b+'fs_wk', epay:b+'fs_ep' }
			, fboxes:{ keyword:b+'fb_kw', visitor:b+'fb_vi', period:b+'fb_pd', resources:b+'fb_ag', action:b+'fb_act', color:b+'fb_col', pattern:b+'fb_ptr', tag:b+'fb_tg', wcode:b+'fb_wk', epay:b+'fb_ep' }
			, blueprints: { ep_rcvo:b+'bp_ep_rcvo', ep_rcvpm:b+'bp_ep_rcvpm', ep_pmo:b+'bp_ep_pmo', ep_none:b+'bp_ep_none', ep_gopid:b+'bp_ep_gopid'
					, colr_none:b+'bp_colr_none', colr_one:b+'bp_colr_one', colr_some:b+'bp_colr_some'
					, patrn_none:b+'bp_patrn_none', patrn_one:b+'bp_patrn_one', patrn_some:b+'bp_patrn_some'
					, tags_none:b+'bp_tags_none', tags_one:b+'bp_tags_one', tags_some:b+'bp_tags_some'
					, user_none:b+'bp_user_none', user_one:b+'bp_user_one', user_some:b+'bp_user_some'
					, act_1:b+'bp_act_1', act_2:b+'bp_act_2', act_3:b+'bp_act_3', act_4:b+'bp_act_4', act_5:b+'bp_act_5', act_67:b+'bp_act_67'
					, wcodes:b+'bp_wcodes', kw_dopid:b+'bp_kw_dopid', kw_ispid:b+'bp_kw_ispid', kw_default:b+'bp_kw_dflt', kw_empty:b+'bp_kw_mpty'
					, vs_typing:b+'bp_visis_tp', vs_default:b+'bp_visis_dflt', vs_empty:b+'bp_visis_mpty'
					}
			, has:{ multi:b+'h_multi', color:b+'h_col', pattern:b+'h_pat', tag:b+'h_tag', wcode:b+'h_wk', epay:b+'h_ep'}
			};
	this.state = C_backFIND.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };
	this.elements = new A_el(); 
	
if(vbs) vlog('mobminder.js','C_backFIND','construction','');
	
	// account

	// selectors, when upgrading this section, check also (*ff01*)
	const fskeyword 	= new C_iONOFF(this.eids.fselectors.keyword, 	{ onswitch:new A_cb(this, this.fselect, 1) }, 	{ value:1, 		state:!!(1&this.state.filter) } );
	const fsvisitor 	= new C_iONOFF(this.eids.fselectors.visitor, 	{ onswitch:new A_cb(this, this.fselect, 2) }, 	{ value:2, 		state:!!(2&this.state.filter) } );
	const fsperiod 	= new C_iONOFF(this.eids.fselectors.period, 	{ onswitch:new A_cb(this, this.fselect, 4) }, 	{ value:4, 		state:!!(4&this.state.filter) } );
	const fsagenda 	= new C_iONOFF(this.eids.fselectors.resources, 	{ onswitch:new A_cb(this, this.fselect, 8) }, 	{ value:8, 		state:!!(8&this.state.filter) } );
	const fsaction 	= new C_iONOFF(this.eids.fselectors.action, 	{ onswitch:new A_cb(this, this.fselect, 16) }, 	{ value:16, 	state:!!(16&this.state.filter) } );
	const fscolor 	= new C_iONOFF(this.eids.fselectors.color, 		{ onswitch:new A_cb(this, this.fselect, 32) }, 	{ value:32, 	state:!!(32&this.state.filter) } );
	const fspattern 	= new C_iONOFF(this.eids.fselectors.pattern, 	{ onswitch:new A_cb(this, this.fselect, 64) }, 	{ value:64, 	state:!!(64&this.state.filter) } );
	const fstag 		= new C_iONOFF(this.eids.fselectors.tag, 		{ onswitch:new A_cb(this, this.fselect, 128) },	{ value:128, 	state:!!(128&this.state.filter) } );
	const fswcodes	= new C_iONOFF(this.eids.fselectors.wcode, 		{ onswitch:new A_cb(this, this.fselect, 256) },	{ value:256, 	state:!!(256&this.state.filter) } );
	const fsepay		= new C_iONOFF(this.eids.fselectors.epay, 		{ onswitch:new A_cb(this, this.fselect, 512) },	{ value:512, 	state:!!(512&this.state.filter) } );

	this.fselectors = new A_ct( { 1:fskeyword, 2:fsvisitor, 4:fsperiod, 8:fsagenda, 16:fsaction, 32:fscolor, 64:fspattern, 128:fstag, 256:fswcodes, 512:fsepay } );
	
	// controls
		const filterchanging = new A_cb(this, this.filterchanging);
		this.delayedfetch = new A_cb(this, this.filterschanged, false, filterchanging, 2500); // before any execution of server fetch, wait for 2,5seconds with idle user
		
		// keyword
	const keyword = new C_iFIELD(this.eids.filters.keyword, { onfchange:new A_cb(this, this.keyword), onfclear:new A_cb(this, this.keywclear) }, { digits:'', type:INPUT_TEXT, mandatory:false, placeholder:C_XL.w('type keyword') });

		// visitors
	const visitor = new C_iACPICK(this.eids.filters.visitor, C_dS_visitor, { changed:new A_cb(this, this.visitorSelect), cleared:this.delayedfetch, typing:new A_cb(this, this.visitortyping) },  { placeholder:C_XL.w('visitor') } );

		// period
		const jsdate = new Date(); const today = jsdate.toMidnight().stamp();
	const period = new C_iPERIOD(this.eids.filters.period, { pchange:this.delayedfetch }, { midnIn:today, midnOut:0 } );
		
		// resources
		const precheck = false;
	const resources = new C_iSTAFF(this.eids.resources, 'empty', this.delayedfetch, precheck, {postmode:'merged', validation:'none' });
		
		// actions
	const logins 	= new C_iUSERS(this.eids.filters.logins, { changed:new A_cb(this, this.userchanged) }, { hide:[aLevel.synchro], orientation:'vertical' }, false /* no preset */ );
	const actions = new C_iACTIONS(this.eids.filters.action, { onchange:new A_cb(this, this.actionchanged) }, { actions:1+2, title:C_XL.w('action') } );
	
		// colors
		const colorsopt = C_dS_customCss.options(resaclass.appointment, ccsstype.color, undefined, { defxclusive:true });
	const colors = new C_iCRESTA(this.eids.filters.color, { onchange:new A_cb(this, this.colorchanged) }, colorsopt, { skin:1, mode:0, maxrows:4, maxcols:3 } );
	
		// patterns
		const patternsopt = C_dS_customCss.options(resaclass.appointment, ccsstype.pattern, undefined, { defxclusive:true });
	const patterns = new C_iCRESTA(this.eids.filters.pattern, { onchange:new A_cb(this, this.patternchanged) }, patternsopt, { skin:1, mode:0, maxrows:4, maxcols:3 } );
	
		// tags
		const tagssopt = C_dS_customCss.options(resaclass.appointment, ccsstype.tag);
	const tags = new C_iCRESTA(this.eids.filters.tag, { onchange:new A_cb(this, this.tagschanged) }, tagssopt, { skin:1, mode:0, maxrows:4, maxcols:3 } );

		// workcodes
	const wcode = new C_iACPICK(this.eids.filters.wcode, C_dS_workcode, { changed:new A_cb(this, this.wcodechanged), cleared:new A_cb(this, this.wcodecleared), typing:new A_cb(this, this.wcodetyping) }, { ismulti:true, placeholder:C_XL.w('workcodes') } );

		// payment mean
		const epaysssopt = C_dS_payment.type.options(); // see (*ep12*)
	const epay = new C_iCRESTA(this.eids.filters.epay, { onchange:new A_cb(this, this.epaychanged) }, epaysssopt, { skin:1, mode:0, maxrows:4, maxcols:3 } );
	
		
	// reservations display
		this.catalyst = new C_catalyst(C_dS_reservation.catalyst);  // C_dS_reservation.catalyst is the genome for this instance
	this.rresas = new C_iARRAY(this.eids.iarrays.resas, this.catalyst, { onrow:new A_cb(this, this.onresa) }, { viewset:true, count:true, endoflist:true, xport:true } ); 
	
	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, { onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
		
		const labels = { resas:'reservations' };
	const tabs = new C_iTABS(this.eids.tabs, C_XL.w(labels), { ontab:new A_cb(this, this.ontab )} );
	
	const more = new C_iPASS({ filter:this.state.filter });
		
	this.controls = new A_ct( { cartouche:cartouche, tabs:tabs, more:more, 
								filters: new A_ct({keyword:keyword, visitor:visitor, period:period, actions:actions, logins:logins, resources:resources, colors:colors, patterns:patterns, tags:tags, wcode:wcode, epay:epay} )
								} );
								
}
C_backFIND.defaults = new A_df( { filter:0, fbusy:false } );
C_backFIND.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backFIND','display',''); 
		
		// make tabs
		const resas = this.controls.tabs.container('resas', 'HELLO', '' ); // empty, filled by this.freshdata()
		
				const spinner = '<div class="spinner">'+'</div>';
			const busystyle = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; display:flex; justify-content:center; align-items:top; padding-top:30vh;';
		const overlay = '<div class="modal-busy" id="'+this.eids.overlay+'" style="'+busystyle+'">'+spinner+'</div>';

		return '<div class="C_backFIND" style="position:absolute; inset:0; overflow:auto;">'+this.header()+resas+overlay+'</div>'; // makes the entire inner content scrollable

		// return '<div class="C_backFIND" style="position:relative; min-height:10em;">'+this.header()+resas+overlay+'</div>';
	},
	activate:function() {
		this.controls.activate('C_backFIND');
		this.elements.collect(this.eids);
		// this.fshow(1+2+4+8+16+32+64+128,false).fshow(this.state.filter,true);
		this.fselectors.activate('C_backFIND');
		for(let x in this.fselectors.get) { this.fselectors.get[x].set(undefined, {silent:false}) }; //triggers the callback see (*ci01*)
		
		if(mobminder.account.single) $(this.elements.has.multi).hide();
		if(!mobminder.account.has.resa.color) $(this.elements.has.color).hide();
		if(!mobminder.account.has.resa.pattern) $(this.elements.has.pattern).hide();
		if(!mobminder.account.has.resa.tag) $(this.elements.has.tag).hide();
		if(!mobminder.account.has.resa.workcode) $(this.elements.has.wcode).hide();
		// if(!mobminder.account.has.epay.active) $(this.elements.has.epay).hide(); // epayment intentionally left visible
			let donotpropagate = true;
		this.epayset(this.controls.filters.epay.getvalue(),donotpropagate);
		this.colorset(this.controls.filters.colors.getvalue(),donotpropagate);
		this.patternset(this.controls.filters.patterns.getvalue(),donotpropagate);
		this.tagsset(this.controls.filters.tags.getvalue(),donotpropagate);
		this.actionset(this.controls.filters.actions.getvalue(),donotpropagate);
		this.userset(this.controls.filters.logins.value(),donotpropagate);
	},

	// main buttons handlers
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	
	// private
	header: function() { // contains all the filters
		
		// filters selectors
			const dispotions = {table:true, xl:true, cap:true};
		const fkeywd 	= '<td class="top right no-print">'+this.fselectors[1].labelled('keyword', false, dispotions )+'</td>';
		const fvisitors = '<td class="top right no-print">'+this.fselectors[2].labelled('visitors', false, dispotions)+'</td>';
		const fperiod 	= '<td class="top right no-print">'+this.fselectors[4].labelled('period', false, dispotions)+'</td>';
		const fresources = '<td class="top right no-print">'+this.fselectors[8].labelled('agendas', false, dispotions)+'</td>';
		const faction 	= '<td class="top right no-print">'+this.fselectors[16].labelled('action', false, dispotions)+'</td>';
		const fcolor 	= '<td class="top right no-print">'+this.fselectors[32].labelled('color', false, dispotions)+'</td>';
		const fpattern 	= '<td class="top right no-print">'+this.fselectors[64].labelled('pattern', false, dispotions)+'</td>';
		const ftag 		= '<td class="top right no-print">'+this.fselectors[128].labelled('tag', false, dispotions)+'</td>';
		const fwcode 	= '<td class="top right no-print">'+this.fselectors[256].labelled('workcode', false, dispotions)+'</td>';
		const fepay 	= '<td class="top right no-print">'+this.fselectors[512].labelled('payment', false, dispotions)+'</td>'; // see (*ff01*)
		
		// filter controls
		
			const ckeywd = '<div class="airunder">'+this.controls.filters.keyword.display('alpha32')+'</div>';				
				const bp_kw_default = '<div style="display:block;" class="filterblueprint blueprint" id="'+this.eids.blueprints.kw_default+'">'+C_XL.w('bp-catfilter-keyword-default')+'</div>';
				const bp_kw_empty 	= '<div style="display:block;" class="filterblueprint blueprint" id="'+this.eids.blueprints.kw_empty+'">'+C_XL.w('bp-catfilter-keyword-empty')+'</div>';
				const bp_kw_dopid	= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.kw_dopid+'">'+C_XL.w('bp-catfilter-keyword-dopid')+'</div>';
				const bp_kw_ispid	= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.kw_ispid+'">'+C_XL.w('bp-catfilter-keyword-ispid')+'</div>';
		const bkeywd 	= '<td width=90%><div id="'+this.eids.fboxes.keyword+'" class="filter-area">'+ckeywd+bp_kw_ispid+bp_kw_dopid+bp_kw_default+bp_kw_empty+'<div></td>';


			const cvisitors = '<div class="airunder">'+this.controls.filters.visitor.display('alpha32')+'</div>';	
				const bp_vs_default = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.vs_default+'">'+C_XL.w('bp-catfilter-visitor-default')+'</div>';
				const bp_vs_empty 	= '<div style="display:block;" class="filterblueprint blueprint" id="'+this.eids.blueprints.vs_empty+'">'+C_XL.w('bp-catfilter-visitor-empty')+'</div>';
				const bp_vs_dopid	= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.vs_typing+'">'+C_XL.w('bp-catfilter-visitor-typing')+'</div>';
		const bpvisitor = cvisitors+bp_vs_default+bp_vs_empty+bp_vs_dopid;
		
		const cperiod = this.controls.filters.period.display();
		const cresources = this.controls.filters.resources.display();
		
		// filters boxes
		
			const clogins = this.controls.filters.logins.display({tablecss:'align-top'});
			let cactions = this.controls.filters.actions.display({});
		cactions = '<div>'+cactions+'</div><div  class="airunder">'+clogins+'</div>';
		
				
					const bp_user_none = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.user_none+'">'+C_XL.w('bp-catfilter-user-none')+'</div>';
					const bp_user_one = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.user_one+'">'+C_XL.w('bp-catfilter-user-one')+'</div>';
					const bp_user_some = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.user_some+'">'+C_XL.w('bp-catfilter-user-some')+'</div>';
				
				const bp_act_1 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_1+'">'+C_XL.w('bp-catfilter-act_1')+'</div>';
				const bp_act_2 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_2+'">'+C_XL.w('bp-catfilter-act_2')+'</div>';
				const bp_act_3 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_3+'">'+C_XL.w('bp-catfilter-act_3')+'</div>';
				const bp_act_4 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_4+'">'+C_XL.w('bp-catfilter-act_4')+'</div>';
				const bp_act_5 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_5+'">'+C_XL.w('bp-catfilter-act_5')+'</div>';
				const bp_act_67 = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.act_67+'">'+C_XL.w('bp-catfilter-act_67')+'</div>';
				
			const act_cresta 	= '<div id="'+this.eids.fboxes.action+'" class="filter-area">'+cactions+bp_act_1+bp_act_2+bp_act_3+bp_act_4+bp_act_5+bp_act_67+bp_user_none+bp_user_one+bp_user_some+'</div>';
		const baction = '<td>'+act_cresta+'</td>';
		
		
			const colors = '<div class="airunder">'+this.controls.filters.colors.display()+'</div>';
				const bp_color_none = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.colr_none+'">'+C_XL.w('bp-catfilter-colors-none')+'</div>';
				const bp_color_one = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.colr_one+'">'+C_XL.w('bp-catfilter-colors-one')+'</div>';
				const bp_color_some = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.colr_some+'">'+C_XL.w('bp-catfilter-colors-some')+'</div>';
			const col_cresta 	= '<div id="'+this.eids.fboxes.color+'" class="filter-area">'+colors+bp_color_none+bp_color_one+bp_color_some+'</div>';
		const bcolor = '<td>'+col_cresta+'</td>';
			
			
			const patterns = '<div class="airunder">'+this.controls.filters.patterns.display()+'</div>';
				const bp_pattern_none = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.patrn_none+'">'+C_XL.w('bp-catfilter-patterns-none')+'</div>';
				const bp_pattern_one = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.patrn_one+'">'+C_XL.w('bp-catfilter-patterns-one')+'</div>';
				const bp_pattern_some = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.patrn_some+'">'+C_XL.w('bp-catfilter-patterns-some')+'</div>';
			const patrn_cresta = '<div id="'+this.eids.fboxes.pattern+'" class="filter-area">'+patterns+bp_pattern_none+bp_pattern_one+bp_pattern_some+'</div>';
		const bpattern = '<td>'+patrn_cresta+'</td>';
			
			
			const tags = '<div class="airunder">'+this.controls.filters.tags.display()+'</div>';
				const bp_tags_none = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.tags_none+'">'+C_XL.w('bp-catfilter-tags-none')+'</div>';
				const bp_tags_one = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.tags_one+'">'+C_XL.w('bp-catfilter-tags-one')+'</div>';
				const bp_tags_some = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.tags_some+'">'+C_XL.w('bp-catfilter-tags-some')+'</div>';
			const tags_cresta = '<div id="'+this.eids.fboxes.tag+'" class="filter-area">'+tags+bp_tags_none+bp_tags_one+bp_tags_some+'</div>';
		const btag = '<td>'+tags_cresta+'</td>';
		
		
			const wcodes = '<div class="airunder">'+this.controls.filters.wcode.display()+'</div>';
				const bp_wcode = '<div style="display:block;" class="filterblueprint blueprint" id="'+this.eids.blueprints.wcodes+'">'+C_XL.w('bp-catfilter-wcode')+'</div>';
			const wcode = '<div id="'+this.eids.fboxes.wcode+'" class="filter-area">'+wcodes+bp_wcode+'</div>';
		const bwcode = '<td>'+wcode+'</td>';
		
			// blue prints for e-payment
			const epays = '<div class="airunder">'+this.controls.filters.epay.display()+'</div>';
				const bp_ep_receivablesonly 	= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.ep_rcvo+'">'+C_XL.w('bp_ep_receivablesonly')+'</div>';
				const bp_ep_receivablespaymeans = '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.ep_rcvpm+'">'+C_XL.w('bp_ep_receivablespaymeans')+'</div>';
				const bp_ep_paymeansonly 		= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.ep_pmo+'">'+C_XL.w('bp_ep_paymeansonly')+'</div>';
				const bp_ep_noneoffilters 		= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.ep_none+'">'+C_XL.w('bp_ep_noneoffilters')+'</div>';
				const bp_ep_gopid 				= '<div style="display:none;" class="filterblueprint blueprint" id="'+this.eids.blueprints.ep_gopid+'">'+C_XL.w('bp-catfilter-epay-gopid')+'</div>';
				const ep_cresta = '<div id="'+this.eids.fboxes.epay+'" class="filter-area airunder">'+epays+bp_ep_receivablesonly+bp_ep_receivablespaymeans+bp_ep_paymeansonly+bp_ep_noneoffilters+bp_ep_gopid+'</div>';
		const bepay 		= '<td>'+ep_cresta+'</td>';
		
		
		const bvisitors 	= '<td><div id="'+this.eids.fboxes.visitor+'" class="filter-area">'+bpvisitor+'</div></td>';
		const bperiod 	= '<td><div id="'+this.eids.fboxes.period+'" class="filter-area">'+cperiod+'</div></td>';
		const bresources 	= '<td><div id="'+this.eids.fboxes.resources+'" class="filter-area">'+cresources+'</div></td>';
		
		
		// filters area
		const rwkeywd 	= '<tr>'+fkeywd+bkeywd+'</tr>'; // double td alignment with OnOff switch on the lefter column, and horizontal aligned the filters specs
		const rwvisitors 	= '<tr>'+fvisitors+bvisitors+'</tr>';
		const rwperiod 	= '<tr>'+fperiod+bperiod+'</tr>';
		const rwresources = '<tr id="'+this.eids.has.multi+'">'+fresources+bresources+'</tr>';
		const rwaction 	= '<tr>'+faction+baction+'</tr>';
		const rwcolor 	= '<tr id="'+this.eids.has.color+'">'+fcolor+bcolor+'</tr>';
		const rwpattern 	= '<tr id="'+this.eids.has.pattern+'">'+fpattern+bpattern+'</tr>';
		const rwtag 		= '<tr id="'+this.eids.has.tag+'">'+ftag+btag+'</tr>';
		const rwwcode  	= '<tr id="'+this.eids.has.wcode+'">'+fwcode+bwcode+'</tr>';
		
		const rwepay  	= '<tr id="'+this.eids.has.epay+'">'+fepay+bepay+'</tr>';
		
		const columns 	= '<colgroup><col><col></colgroup>';
		
		const tblfilters = '<table style="margin:0em auto 0 auto;">'+columns+rwkeywd+rwvisitors+rwperiod+rwresources+rwaction+rwcolor+rwpattern+rwtag+rwwcode+rwepay+'</table>';
		
		// buttons & title
			const tdbuttons = '<td class="no-print"  style="width:1%; white-space:nowrap; vertical-align:top;">'+this.controls.cartouche.display('no-print')+'</td>';
			const tdtitle = '<td class="no-print"  style="vertical-align:top;"><h1>'+C_XL.w('resa finder')+symbol('search','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
			const headertbl = '<table><tr>'+tdbuttons+tdtitle+'</tr></table>';
		const title = '<div id="'+this.eids.rightinset+'" class="" style="padding:1em 4em;">'+headertbl+'</div>';
		
		
		// filters
			const filters = '<td style="padding-top:.2em;"><div id="'+this.eids.finset+'" style="position:relative; vertical-align:top;">'+tblfilters+'</div></td>';
		const header = '<table style="width:100%;" summary="account statistics header"><tr>'+filters+'</tr></table>';
		const filtersdiv = '<div style="padding:0;">'+header+'</div>';
		
		// tabs
		// const tabs = '<div style="text-align:center; padding:2em 0 0em 0;">'+this.controls.tabs.display()+'</div>'; // keep for when multiple tabs are needed
		const tabs = ''; // as long as we have one single tab, no need to display the tab header of it
										
		return '<div style="position:relative; min-height:10em;">'+title+filtersdiv+tabs+'</div>';
	},
	fetch: function() { // post filters
		this.fbusy(true).filterchanging();
		this.controls.more.items.filter = this.state.filter;
		const names = { 
			more: { filter:'filter' },
			filters: { keyword:'keyword', visitor:'visitor', period:{midnIn:'midnIn',midnOut:'midnOut'}, actions:'actions', logins:'logins'
					, resources:'resources', colors:'colors', patterns:'patterns', tags:'tags', wcode:'wcodes', epay:'epays' }
		};
		mobminder.app.post(this.controls, names, './queries/find.php', new A_cb(this,this.freshdata), new A_cb(this,this.failed));
		rmems.flush('catalyst');
	},
	fbusy: function(onoff) { // filters zone busy overlay
		this.state.fbusy = onoff;
		if(onoff) {
			$(this.elements.overlay).addClass('on');
			C_iWIN.cursor('wait');
		} else {
			$(this.elements.overlay).removeClass('on');
			C_iWIN.cursor();
		}
		return this;
	},
	h2: function(msg) { return '<h2 style="padding:2em 0 0.5em 0">'+msg+'</h2>'; },	
	h3: function(msg) {	return '<h3 style="padding:2em 0 0.5em 0">'+msg+'</h3>'; },
	
	// handlers
	ontab: function(which) {
		if(vbs) vlog('mobminder.js','C_backFIND','ontab','letter:'+which); 
	},
	onresa: function(rid, evnt, skeys) { // clicking from the list of reservation displayed by the Filter & Find tool
		if(!permissions.may(pc.op_resas)) return false;
		
		const dS_resa = this.catalyst.register().get(rid);
	
		if(rid<=0) if(!permissions.may(pc.cr_resas)) return false;
		if(rid>0) if(!permissions.may(pc.op_resas)) return false;
		
		// console.log('P_AgendaHVL.resaopen('+rid+') skeys:', skeys, 'mousevent.button:',mousevent.button);
		
		// if(mousevent.button!==undefined) {
			// switch(mousevent.button) {
				// case 0: console.log('that is a left click'); break; 
				// case 1: console.log('that is a wheel click'); return false; break; 
				// case 2: console.log('that is a right click'); return false; break; 
			// }
		// }
		
			const isappointment = dS_resa.assess == resaclass.appointment;
				const iconstyle = 'width:1.4em; min-width:1.4em; font-size:1.2em; line-height:1.0em;';
			const keyboard = '<div style="'+iconstyle+'" class="fa fa-gray fa-keyboard">'+'</div>';
		
		if(skeys.shiftkey&&skeys.ctrlkey) { // that is a Ctrl + Shift + click action
			
			const hasctrlshift = C_dS_customCss.getCtrlShift(resaclass.appointment, 3); // some of dS_customCss might have a ctrlshift value of 1 (which is the Ctrl bit)
			
			// console.log('P_AgendaHVL.resaopen('+rid+') with Ctrl key ON, hasctrlshift = '+(hasctrlshift?'yes':'no')+' isappointment = '+(isappointment?'yes':'no'));
			if(hasctrlshift&&isappointment) {
				const docall = { values:{rid:rid, ccssid:hasctrlshift.id, bank:'catalyst'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
				const p = new C_iPASS(docall.values); // values and names are defined by docall return values
				mobminder.app.post({p:p}, {p:docall.names}, './post/forceccss.php', new A_cb(this,this.ccssforced,3));
			} else 
				if(isappointment) {
					const msg = C_XL.w('ctrlshift no interactivity yet', { cap:1, nested:{ctrlshift:'Ctrl + Shift',keyboard:keyboard}} );
					const css = {body:'left blueprint', borders:'mmborder-green'};
					const subtitle = C_XL.w('ctrlshift no interactivity title', { cap:1, nested:{ctrlshift:'Ctrl + Shift'} } );
					const preset = { sound:'note', css:css, interactivity:'ok', title:'Ctrl + Shift + Click', subtitle:subtitle, size:{x:600,y:''} };
					new C_iMSG(msg, { onChoice:false }, preset );
				}
			// else there are no ccss that is supposed to trigger on a Ctrl-Shift-click
			return false;
			
		} else if(skeys.shiftkey) { // that is a Shift + click action
			
			const hasshift = C_dS_customCss.getCtrlShift(resaclass.appointment, 2); // some of dS_customCss might have a ctrlshift value of 2 (which is the Shift bit)
			
			
			// console.log('P_AgendaHVL.resaopen('+rid+') with Shift key ON, hasshift = '+(hasshift?'yes':'no')+' isappointment = '+(isappointment?'yes':'no'));
			if(hasshift&&isappointment) {
				const docall = { values:{rid:rid, ccssid:hasshift.id, bank:'catalyst'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
				const p = new C_iPASS(docall.values); // values and names are defined by docall return values
				mobminder.app.post({p:p}, {p:docall.names}, './post/forceccss.php', new A_cb(this,this.ccssforced,2));
			} else 
				if(isappointment) {
					const msg = C_XL.w('ctrlshift no interactivity yet', { cap:1, nested:{ctrlshift:'Shift',keyboard:keyboard}} );
					const css = {body:'left blueprint', borders:'mmborder-orange'};
					const subtitle = C_XL.w('ctrlshift no interactivity title', { cap:1, nested:{ctrlshift:'Shift'} } );
					const preset = { sound:'note', css:css, interactivity:'ok', title:'Shift + Click', subtitle:subtitle, size:{x:600,y:''} };
					new C_iMSG(msg, { onChoice:false }, preset );
				}
			// else there are no ccss that is supposed to trigger on a Shift-click
			return false;
			
		} else if(skeys.ctrlkey) { // that is a Ctrl + click action
			
			const hasctrl = C_dS_customCss.getCtrlShift(resaclass.appointment, 1); // some of dS_customCss might have a ctrlshift value of 1 (which is the Ctrl bit)
			
			// console.log('P_AgendaHVL.resaopen('+rid+') with Ctrl key ON, hasctrl = '+(hasctrl?'yes':'no')+' isappointment = '+(isappointment?'yes':'no'));
			if(hasctrl&&isappointment) {
				const docall = { values:{rid:rid, ccssid:hasctrl.id, bank:'catalyst'}, names:{rid:'rid', ccssid:'ccssid', bank:'bank'} };
				const p = new C_iPASS(docall.values); // values and names are defined by docall return values
				mobminder.app.post({p:p}, {p:docall.names}, './post/forceccss.php', new A_cb(this,this.ccssforced,1));
			} else 
				if(isappointment) {
					const msg = C_XL.w('ctrlshift no interactivity yet', { cap:1, nested:{ctrlshift:'Ctrl',keyboard:keyboard}} );
					const css = {body:'left blueprint', borders:'mmborder-blue'};
					const subtitle = C_XL.w('ctrlshift no interactivity title', { cap:1, nested:{ctrlshift:'Ctrl'} } );
					const preset = { sound:'note', css:css, interactivity:'ok', title:'Ctrl + Click', subtitle:subtitle, size:{x:600,y:''} };
					new C_iMSG(msg, { onChoice:false }, preset );
				
				}
			// else there are no ccss that is supposed to trigger on a Ctrl-click
			
			return false;
			
		} else { // that is a regular click
		
				const resasaved = new A_cb(this, this.resasaved,dS_resa.id); // (*onresa*)
				const resaremoved = new A_cb(this, this.resaremoved,dS_resa.id); // (*onresa*)
			const modal = new M_RESA(dS_resa, {saved:resasaved, deleted:resaremoved}, { bank:'catalyst', parent:this });
		
		}
		return false;
	},
	
	// filter selection handlers
	fselect: function(hit,v) { this.fshow(hit,v); return this.fstatus(hit) },
	fshow: function(hit, onoff) { // shows or hide a given filter form
		if(vbs) vlog('mobminder.js','C_backFIND','fshow','hit:'+hit+', onoff:'+onoff); 
		for(let scan=512; scan; scan>>=1) if(scan&hit) { // see (*ff01*)
			let wrap = false;
			switch(scan) {
				case 1: wrap = this.elements.fboxes.keyword; break;
				case 2: wrap = this.elements.fboxes.visitor; break;
				case 4: wrap = this.elements.fboxes.period; break;
				case 8: wrap = this.elements.fboxes.resources; break;
				case 16: wrap = this.elements.fboxes.action; break;
				case 32: wrap = this.elements.fboxes.color; break;
				case 64: wrap = this.elements.fboxes.pattern; break;
				case 128: wrap = this.elements.fboxes.tag; break;
				case 256: wrap = this.elements.fboxes.wcode; break; 
				case 512: wrap = this.elements.fboxes.epay; break; // see (*ff01*)
			}
			if(wrap) { if(onoff) $(wrap).show(); else $(wrap).hide(); }
		}
		if(hit&512) if(onoff) { // the payment filter is turned active
			// let's add some columns to the table, in an automated way
			if(!mobminder.account.has.epay.active) return this;
			let f = ['payments','cash'];
			if(mobminder.account.has.epay.epmobsepa) f.push('mobqrcode');
			if(mobminder.account.has.epay.epayconiq) f.push('payconiq');
			if(mobminder.account.has.epay.epaysoft) f.push('softpos');
			if(mobminder.account.has.epay.epayhard) f.push('hardpos');
			if(mobminder.account.has.epay.epayonline) f.push('onlinecards');
			if(mobminder.account.has.epay.epayonline) if(mobminder.account.has.epay.epayconiq) f.push('onlinepayco');
			if(mobminder.account.has.epay.epayonline) f.push('receivables');
			this.rresas.showcolumns(f); // automaticaly set those columns visible
		}
		return this;
	},
	fstatus: function(hit) {
		let bits = 0; // see (*ff01*)
		for(let scan=512; scan; scan>>=1) bits += (this.fselectors[scan].value());
		if(vbs) vlog('mobminder.js','C_backFIND','fstatus','hit:'+hit+', status:'+bitmap(bits)+', previous:'+this.state.filter); 
		let fchange = bits != this.state.filter; if(!fchange) return; 
		this.state.filter = bits;
		
		// clear appropriate controls
		if(hit==1 && this.state.filter&1) { this.controls.filters.keyword.clear().focus(true); } // no spontaneous fetch
		if(hit==2 && this.state.filter&2) { this.controls.filters.visitor.clear().focus(true); } // no spontaneous fetch
		
		
		if(hit==512) { // epayment
			if(this.state.filter&512) { // turned on
				this.controls.filters.visitor.clear().focus(true);
			}
		}
		
		if(hit==512||hit==1) // epayment or keyword filter switch
			this.keywblueprint(); // sets the blueprints
		
		this.delayedfetch.cb();
	},
	filter: function(which) {
		const fchange = which != this.state.filter; if(!fchange) return; 
		this.state.filter = which;
		if(vbs) vlog('mobminder.js','C_backFIND','filter','which:'+which); 
		for(let eid in this.elements.fboxes.get) $(this.elements.fboxes[eid]).hide(); $(this.elements.filters[which]).show();
		this.filterschanged(); // spontaneous fetch
	},
	
	// events
	filterchanging: function(checkeditems) { // called while the filters are changed
		if(vbs) vlog('mobminder.js','C_backFIND','filterchanging',''); 
		this.controls.tabs.html('resas', C_XL.w('afilter changing'));
	},
	filterschanged: function() { // called 3 seconds after filters have not changed anymore
	
		// case 1: wrap = this.elements.fboxes.keyword; break;
		// case 2: wrap = this.elements.fboxes.visitor; break;
		// case 4: wrap = this.elements.fboxes.period; break;
		// case 8: wrap = this.elements.fboxes.resources; break;
		// case 16: wrap = this.elements.fboxes.action; break;
		// case 32: wrap = this.elements.fboxes.color; break;
		// case 64: wrap = this.elements.fboxes.pattern; break;
		// case 128: wrap = this.elements.fboxes.tag; break;
		// case 256: wrap = this.elements.fboxes.wcode; break; 
		// case 512: wrap = this.elements.fboxes.epay; break; // see (*ff01*)
	
		if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','filters:'+this.state.filter); 
		if(this.state.filter==0) return this.freshdata(); // no filter is selected
		if(this.state.filter&1) { // keyword filter is also selected
			const digits = this.controls.filters.keyword.value();
			const stripped = digits.replace(/[ +]/gi,'');
			if(stripped.length<5) // we do not call the server if anything between 1 and 4 characters was typed.
				if(stripped.length>0)
					return this.freshdata(); // which is actually an exit way
			else {} // proceed and call the server side
		}
		if(this.state.filter&2) { // visitor
			const acopen = this.controls.filters.visitor.isopen();
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','ac open:'+acopen); 
			if(acopen) return;
			if(this.state.filter==2) { // only this filter is active
				let visids = this.controls.filters.visitor.value();
				if(!visids.length) // but no visitor is selected
					return this.freshdata();
			}
		}
		if(this.state.filter&4) { // timeline boundaries are set
			if(this.state.filter==4) return this.freshdata(); // must combine with another filter
			const dpopen = this.controls.filters.period.isopen();
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&8) { // resources filter is set
			if(this.state.filter==8) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&16) { // actions filter is set (who and one of [create, modify, delete])
			if(this.state.filter==16) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&32) { // color filter is set
			if(this.state.filter==32) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&64) { // pattern filter is set
			if(this.state.filter==64) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&128) { // tag filter is set
			if(this.state.filter==128) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		if(this.state.filter&256) { // workcodes // see (*ff01*)
			const acopen = this.controls.filters.wcode.isopen();
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','wk open:'+acopen); 
			if(acopen) return;
			if(this.state.filter==256) {
				const wkids = this.controls.filters.wcode.value();
				if(!wkids.length) return this.freshdata();
			}
		} 
		if(this.state.filter&512) { // epayments filter is set
			if(this.state.filter==512) return this.freshdata(); // must combine with another filter
			const dpopen = false;
			if(vbs) vlog('mobminder.js','C_backFIND','filterschanged','dp open:'+dpopen); 
			if(dpopen) return this.freshdata();
		}
		
		// if(this.state.filter&1) return this.keyword(this.controls.filters.keyword.value()); // because keyword length must be checked before fetching results
		this.fetch();
	},
	
	epaychanged: function(which) { // callback onchange() from C_iCRESTA
		this.epayset(which);
	},
	epayset: function(which, donotpropagate) {
		// which can range [0,1,2,11,21,33,44,-2] according to C_dS_payment.type
		
		$(this.elements.blueprints.ep_none).hide();
		$(this.elements.blueprints.ep_pmo).hide();
		$(this.elements.blueprints.ep_rcvpm).hide();
		$(this.elements.blueprints.ep_rcvo).hide();
		
		let count = which.length;
		let pt = C_dS_payment.type;
		let receivables = arrayHAS(which,pt.receivables);
		
		if(count) {
			
			if(receivables && (count==1)) $(this.elements.blueprints.ep_rcvo).show(); // receivables only
			if(receivables && (count>1) ) 
				$(this.elements.blueprints.ep_rcvpm).show(); // receivable and paymeans are selected
			if(!receivables)
				$(this.elements.blueprints.ep_pmo).show(); // paymean only blueprint
			
		} else // none of options are selected
			$(this.elements.blueprints.ep_none).show();
		
		if(vbs) vlog('mobminder.js','C_backFIND','epayset','which:'+which+', count:'+count+', donotpropagate:'+donotpropagate); 
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	
	colorchanged: function(which) { // callback onchange() from C_iCRESTA
		this.colorset(which);
	},
	colorset: function(which, donotpropagate) {
		
		$(this.elements.blueprints.colr_none).hide();
		$(this.elements.blueprints.colr_one).hide();
		$(this.elements.blueprints.colr_some).hide();
		
		let count = which.length;
		if(count) switch(count) {
			case 1:$(this.elements.blueprints.colr_one).show(); break;
			default: $(this.elements.blueprints.colr_some).show();
		}
		else $(this.elements.blueprints.colr_none).show();
		
		if(vbs) vlog('mobminder.js','C_backFIND','colorset','which:'+which+', count:'+count+', donotpropagate:'+donotpropagate); 
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	patternchanged: function(which) { // callback onchange() from C_iCRESTA
		this.patternset(which);
	},
	patternset: function(which, donotpropagate) {
		
		$(this.elements.blueprints.patrn_none).hide();
		$(this.elements.blueprints.patrn_one).hide();
		$(this.elements.blueprints.patrn_some).hide();
		
		let count = which.length;
		if(count) switch(count) {
			case 1:$(this.elements.blueprints.patrn_one).show(); break;
			default: $(this.elements.blueprints.patrn_some).show();
		}
		else $(this.elements.blueprints.patrn_none).show();
		
		if(vbs) vlog('mobminder.js','C_backFIND','patternset','which:'+which+', count:'+count+', donotpropagate:'+donotpropagate); 
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	tagschanged: function(which) { // callback onchange() from C_iCRESTA
		this.tagsset(which);
	},
	tagsset: function(which, donotpropagate) {
		
		$(this.elements.blueprints.tags_none).hide();
		$(this.elements.blueprints.tags_one).hide();
		$(this.elements.blueprints.tags_some).hide();
		
		let count = which.length;
		if(count) switch(count) {
			case 1:$(this.elements.blueprints.tags_one).show(); break;
			default: $(this.elements.blueprints.tags_some).show();
		}
		else $(this.elements.blueprints.tags_none).show();
		
		if(vbs) vlog('mobminder.js','C_backFIND','tagsset','which:'+which+', count:'+count+', donotpropagate:'+donotpropagate); 
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	
	actionchanged: function(which) { // callback onchange() from C_iACTIONS
		
		this.actionset(which);
	},
	actionset: function(which, donotpropagate) { 	
		if(vbs) vlog('mobminder.js','C_backFIND','actionset','which:'+which+', donotpropagate:'+donotpropagate); 
		
		$(this.elements.blueprints.act_1).hide();
		$(this.elements.blueprints.act_2).hide();
		$(this.elements.blueprints.act_3).hide();
		$(this.elements.blueprints.act_4).hide();
		$(this.elements.blueprints.act_5).hide();
		$(this.elements.blueprints.act_67).hide();
		
		let binary = 0; for(let x in which) binary += which[x]|0;
		
		switch(binary) { // see (*ct21*)	
			case 1: // resas that were created but never modified nor deleted
				$(this.elements.blueprints.act_1).show();
				break;
			case 2: // resas that were modified
				$(this.elements.blueprints.act_2).show();
				break; 
			case 3: // (1+2) resas that were created and modified (all resas were ever created so we do not filter on created)
				$(this.elements.blueprints.act_3).show();
				break; 
			case 4: // resas that were deleted
				$(this.elements.blueprints.act_4).show();
				break; 
			case 5: // (1+4) resas that were deleted but never modified
				$(this.elements.blueprints.act_5).show();
				break; 
			case 6: // (2+4) resas that were deleted but were also modified 
			case 7: // (1+2+4) same because any existing resa was ever created
				$(this.elements.blueprints.act_67).show();
				break; 
		}
		
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	userchanged: function(which) { // callback changed() from C_iUSERS
		
		this.userset(which);
	},
	userset: function(which, donotpropagate) {
		
		$(this.elements.blueprints.user_none).hide();
		$(this.elements.blueprints.user_one).hide();
		$(this.elements.blueprints.user_some).hide();
		
		let count = which.length;
		switch(count) { // see (*ct21*)
			case 0:$(this.elements.blueprints.user_none).show(); break;
			case 1:$(this.elements.blueprints.user_one).show(); break;
			default: $(this.elements.blueprints.user_some).show();
		}
		
		if(vbs) vlog('mobminder.js','C_backFIND','userset','which:'+which+', count:'+count+', donotpropagate:'+donotpropagate); 
		if(donotpropagate) return this; 
		this.delayedfetch.cb();
	},
	wcodechanged: function(dSs) {
		
		let which = []; for(id in dSs) which.push(id);
		let count = which.length;
		// if(count) $(this.elements.blueprints.wcodes).hide();
		// else $(this.elements.blueprints.wcodes).show();
		$(this.elements.blueprints.wcodes).hide();
		
		if(vbs) {
			which = which.join(',');
			vlog('mobminder.js','C_backFIND','wcodechanged','count:'+count+', which'+which); 
		}
		this.delayedfetch.cb();
	},
	wcodecleared: function() {
		
		$(this.elements.blueprints.wcodes).show();
		if(vbs) vlog('mobminder.js','C_backFIND','wcodecleared','');
		this.delayedfetch.cb();
	},
	
	visitortyping: function(digits) { // these digits are the one inside the element after the first key was typed
		if(vbs) vlog('mobminder.js','C_backFIND','visitortyping','digits:'+digits); 
		$(this.elements.blueprints.vs_default).hide();
		$(this.elements.blueprints.vs_empty).hide();
		$(this.elements.blueprints.vs_typing).show();
		// this.delayedfetch.cb();
	},
	visitorSelect: function(ids) { // adding or selecting using checkbox
		let list = [], c = 0; for(let id in ids) { list.push(id); c++; }; list.join(',');
		if(vbs) vlog('mobminder.js', 'C_backFIND', 'visitorSelect', c+' visitors, ids:'+list);
		if(c) {
			$(this.elements.blueprints.vs_default).show(); // some visitors are selected
			$(this.elements.blueprints.vs_empty).hide();
			$(this.elements.blueprints.vs_typing).hide();
		} else {
			$(this.elements.blueprints.vs_default).hide(); // none visitor is selected
			$(this.elements.blueprints.vs_empty).show();
			$(this.elements.blueprints.vs_typing).hide();
		}
		this.delayedfetch.cb();
	},
	wcodetyping: function() {
		if(vbs) vlog('mobminder.js','C_backFIND','wcodetyping',''); 
		this.delayedfetch.cb();
	},
	keyword: function(digits) {
		if(vbs) vlog('mobminder.js','C_backFIND','keyword','digits:'+digits); 
		
		let stripped = digits.replace(/[ +]/gi,'');
		let len = stripped.length;
		this.keywblueprint(); // sets the blueprints
		if(len<5) if(len>0) return this.freshdata(); // which is actually an exit way, we do not call the server if anything between 1 and 4 characters was typed.
		this.delayedfetch.cb();
	},
	keywclear: function() {
		if(vbs) vlog('mobminder.js','C_backFIND','keywclear',''); 
		this.freshdata();
		if(this.state.filter > 1) this.delayedfetch.cb();
	},
	keywblueprint: function() { // according to filters state, let blueprints about keywords interactively display
	
		if(vbs) vlog('mobminder.js','C_backFIND','keywblueprint','');
		
			let digits = this.controls.filters.keyword.value();
				digits = digits.replace(/[ +]/gi,'');
		let kwlen = digits.length;
		let ispid = this.ispid(digits);
		let keywopen = this.state.filter&1;
		let epayopen = this.state.filter&512;
		let callserver = (kwlen==0||kwlen>=5);
		
		// invite blueprint at keyword filter side
		$(this.elements.blueprints.kw_default).hide();
		$(this.elements.blueprints.kw_empty).hide();
		$(this.elements.blueprints.kw_dopid).hide();
		$(this.elements.blueprints.kw_ispid).hide();
		$(this.elements.blueprints.ep_gopid).hide();
		
		// blueprint scenes
		if(ispid) {
			
			this.elements.blueprints.kw_ispid.innerHTML = C_XL.w('bp-catfilter-keyword-ispid')+' '+ispid;
			$(this.elements.blueprints.kw_ispid).show();
			
		} else {
			
			if(epayopen) $(this.elements.blueprints.kw_dopid).show();
			
			if(!keywopen) $(this.elements.blueprints.ep_gopid).show();
			
			if(kwlen==0) $(this.elements.blueprints.kw_empty).show();
				else $(this.elements.blueprints.kw_default).show();
		}
	},
	
	// ajax callbacks
	saved: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
		this.busy(false);
	},
	freshdata: function(dSets, stream) { // called with none arguments does reset the table
		
		let reservations = []; if(dSets!==undefined) reservations = dSets['C_dS_reservation'];
		const ids = []; for(let id in reservations) { ids.push(id); }
		if(dSets!==undefined) {
			const h2 = ids.length ? '' : '<h2 class="centered airunder mobtext">'+C_XL.w('C_backFIND this search returns no result')+'</h2>';
			this.controls.tabs.html('resas',h2+this.rresas.setids(ids).display('highheader reservations')); // definitions of setids() and display() are here (*rr01*)
		}
		else {
			const msg = '<h2 class="centered">'+C_XL.w('C_backFIND you must activate more filters.')+'</h2>';
			this.controls.tabs.html('resas',msg);
		}
		this.rresas.activate(); 
		this.fbusy(false);
		return;
	},
	failed: function() {
		this.busy(false);
	},
	resasaved: function(rid) {
		if(vbs) vlog('mobminder.js','C_backFIND','resasaved',''); 
		this.rresas.refresh(); // no server fetch needed, only this one reservation is affected and it was streamed again, it is up to date localy.
		
		// this.controls.tabs.html('resas',this.rresas.display('resas-finder'));
		// this.rresas.activate(); 
		// this.fetch(); // refreshes the C_iARRAY with changes /or deletion
	},
	resaremoved: function(rid) {
		// const r = this.catalyst.unregister(rid); // already done from M_RESA::remove(); see (*mr04*)
		const deletedon = this.fselectors[16].value();
		if(deletedon) {
			const actions = this.controls.filters.actions.getvalue(); // which is an array like [1,2,4]
			let hasdelete = false; for(let x in actions) if(actions[x]==4) hasdelete = true;
			if(!hasdelete) // only if non deleted items are in scope
				this.rresas.removeid(rid); // this id must disappear from the actively displayed reservations list
		}
		this.rresas.refresh(); // no server fetch needed, only this one reservation is affected and it was streamed again, it is up to date localy.
		
		if(vbs) vlog('mobminder.js','C_backFIND','resaremoved','r='+r); 
	},
	ccssforced: function(ctrlshift,dataSets,stream) { // ctrlshift arrives as 1, 2 or 3, see this.resaopen()
		// console.log(ctrlshift,dataSets,stream);
		
			let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /* anyway, this brings a single resa back*/ }
		if(vbs) vlog('planning.js','P_AgendaHVL','ccssforced','date:'+(resa?resa.jsDateIn.sortable():'none'+', '+'cssColor:'+resa.cssColor+', '+'cssPattern:'+resa.cssPattern+', '+'cssTags:'+resa.cssTags)); 
		if(!resa) return;
		
		ctrlshiftplay(ctrlshift); // from mobframe.js, mobminder.sounds
		this.rresas.refresh(); // no server fetch needed, only this one reservation is affected and it was streamed again, it is up to date localy.
	},
	
	// private
	ispid: function(digits) { // 
		if(vbs) vlog('mobminder.js','C_backFIND','ispid','digits='+digits);
		let hpid = ('pid' == digits.substr(0, 3)); // heading three chars are 'pid'
		let len = digits.length;
		if(hpid && len>=11) { // the written keyword is long enough to be a pid and is headed with 'pid'
			let pid = digits.slice(3);
			if(!isNaN(pid)) return parseInt(pid);
		}
		return false; // downfall
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E     :   C O N N E C T I O N S    M O N I T O R I N G  
//
function C_backCNX(eid, callbacks, preset) {
	let b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons'
			, filters:b+'flt', realtime:b+'rt', archives:b+'arch', finset:b+'fin', busy:b+'bsy'
			, logins:b+'logins', filter:b+'filter', dp:b+'dp', xw:b+'xw', acg:b+'acg', acl:b+'acl'
			, filters:{ period:b+'f_period', keyword:b+'f_kwrd'}
			, iarray:{realtime:b+'rt', archives:b+'arc'} };
	this.state = C_backCNX.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { boffdone: };
	this.elements = new A_el(); 
	
	
if(vbs) vlog('mobminder.js','C_backCNX','construction','');
	
	// account
	const id	= new C_iPASS(mobminder.account.id);

	// controls
		const filterchanging = new A_cb(this, this.filterchanging);
		const filtergroup = new A_cb(this, this.filterschanged, null, filterchanging, 3000);
	const logins 	= new C_iUSERS(this.eids.logins, { changed:filtergroup }, { hide:[] }, C_dS_loggable.get() );
	
			const filters = C_XL.w({ created:'afilter created', archived:'afilter archived', keyword:'afilter keyword' });
		const forder = ['created','archived','keyword'];
	const filter = new C_iCRESTA(this.eids.filter, { onchange:new A_cb(this, this.filter) }, { order:forder, labels:filters, count:forder.length }, { skin:0, mode:-1, value:this.state.filter, title:C_XL.w('afilter title') } );
	const keyword = new C_iFIELD(this.eids.keyword, { onfchange:new A_cb(this, this.keyword, null, null, 2000 ), onfclear:new A_cb(this, this.keywclear) }, { digits:'', type:INPUT_TEXT, mandatory:false, placeholder:C_XL.w('type keyword') });

		const sunday = new Date();
	const dp	= new C_iDP(this.eids.dp, {dayclick:filtergroup}, { jsdate:sunday, maxdate:false, weekdays:false, display:{} });
	
		const xwoptions = function() { // number of weeks to be cumulated
			const labels = { 1:'1 '+C_XL.w('week'), 2:'2 '+C_XL.w('weeks'), 4:'4 '+C_XL.w('weeks'), 8:'8 '+C_XL.w('weeks'), 12:'12 '+C_XL.w('weeks') };
			const order = []; for(let x in labels) order.push(x);
			return { order:order, labels:labels, presets:{}, count:order.length };
		}
	const xw = new C_iDDWN(this.eids.xw, { onselect:filtergroup }, xwoptions(), { maxcols:1, maxrows:1, value:1 } );
	const acg = new C_iAC(this.eids.acg, C_dS_group, { acselect:new A_cb(this, this.acgroup), acclear:new A_cb(this, this.groupcleared) }, { placeholder:C_XL.w('account') } );
	const acl = new C_iAC(this.eids.acl, C_dS_login, { acselect:new A_cb(this, this.aclogin), acclear:new A_cb(this, this.logincleared) }, { placeholder:C_XL.w('login') } );

	
	// results display
		this.catalyst = { realtime:new C_dS_connection.catalyst({bank:'realtime'}), archives:new C_dS_connection.catalyst({bank:'archive'}) };
	this.realtime = new C_iARRAY(this.eids.iarray.realtime, this.catalyst.realtime, { onrow:new A_cb(this, this.onconnexionrow, 'realtime') }, {endoflist:true} ); 
	this.archives = new C_iARRAY(this.eids.iarray.archives, this.catalyst.archives, { onrow:new A_cb(this, this.onconnexionrow, 'archives') }, {endoflist:true} ); 
	
	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, { onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
	
	const tabs = new C_iTABS(this.eids.tabs, C_XL.w({ realtime:'cnx realtime', archives:'cnx archives' }), { ontab:new A_cb(this, this.ontab )} );
	this.controls = new A_ct( { cartouche:cartouche, tabs:tabs, id:id, filter:filter, logins:logins, keyword:keyword, dp:dp, xw:xw, acg:acg, acl:acl } );
}
C_backCNX.defaults = new A_df( { filter:'created', fbusy:false, tbusy:false } );
C_backCNX.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backCNX','display',''); 
		
			// make tabs containers
			const realtime = this.controls.tabs.container('realtime', '', 'wide deep' );
			const archives = this.controls.tabs.container('archives', '', 'wide deep' );
			
		// final packaging
					const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
					const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
				const combocontainers = '<div style="background-color:white;">'+realtime+archives+'</div>'; // do not invert <div> layout sequence!
				const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
			const headers = '<div class="prefs-header">'+this.header()+'</div>';
			const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';
		
		return '<div class="C_backCNX prefs-grid" style="height:100%; min-height:100%;">'+headers+tabcontainers+'</div>'; // makes the entire inner content scrollable		
	},
	activate:function() {
		this.controls.activate('C_backCNX');
		this.elements.collect(this.eids);
		this.fetch();
	},

	// handlers
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	ontab: function(which) {
		if(vbs) vlog('mobminder.js','C_backCNX','ontab','letter:'+which); 
	},
	onconnexionrow: function(bank, id) {
		if(vbs) vlog('mobminder.js','C_backCNX','onconnexionrow','bank:'+bank+', id'+id); 
		new M_Conxion(this.catalyst[bank].dS(id), {});
	},
	
	// private
	header: function() {
		// title
			const buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
			const level = C_XL.w(aLevel.name(mobminder.context.surfer.accessLevel));
			const surfer = '<h2>'+mobminder.context.surfer.name+':&nbsp;'+level+'</h2>';
			const left = '<td>'+surfer+'</td>';
			const right = '<td><h1>'+C_XL.w('cnx monitoring')+symbol('connexions','fa-13x','padding:0 .2em 0 .7em;')+'</h1></td>';
		const header = '<table style="width:100%;" summary="account statistics header"><tr>'+buttons+left+right+'</tr></table>';
		const divHeader = '<div style="padding:1em 0 2em 0;">'+header+'</div>';
		
		// filters
				const acg = this.controls.acg.display('alpha32 bigger bold right');
			const row0 = '<tr style="vertical-align:top;"><td colspan=2>'+acg+'</td><tr>';
				const acl = this.controls.acl.display('alpha32 bigger bold right');
			const row1 = '<tr style="vertical-align:top;"><td colspan=2>'+acl+'</td><tr>';
					
			const ftype = '<td>'+this.controls.filter.display()+'</td>';
						const dp = this.controls.dp.display('alpha16 mindertext bigger bold');
				const fperiod = '<td id="'+this.eids.filters.period+'" style="vertical-align:top; padding-top:1.3em;">'+dp+'</td>';
				const keywd = '<td id="'+this.eids.filters.keyword+'" style="display:none; vertical-align:bottom;">'+this.controls.keyword.display('alpha20')+'</td>';
			const row2 = '<tr style="vertical-align:top;">'+ftype+fperiod+keywd+'<tr>';
		const filters = '<table style="margin:1em auto 0 auto;">'+row0+row1+row2+'</table>';
		const finset = '<div id="'+this.eids.finset+'" style="position:relative;">'+filters+'</div>';
		
		// tabs

		const divTabs = '<div style="text-align:center; padding:2em 0 0em 0;">'+this.controls.tabs.display()+'</div>';
		return divHeader+finset+divTabs;
	},
	fetch: function() {
		this.fbusy(true).filterchanging();
		let names = { id:'id', filter:'filter', logins:'logins', keyword:'keyword', dp:'sunday', xw:'xweeks' };
		mobminder.app.post(this.controls, names, './queries/connections.php', new A_cb(this,this.freshdata), new A_cb(this,this.failed));
		cnxmem.flush(); // flushes the memory
	},
	fbusy: function(onoff) { // filters zone busy overlay
		if(onoff && !this.state.fbusy) {
			let zindex = 1000+C_iMODAL.layer;
			let overlay = '<div class="overlay-busy-64px" id="'+this.eids.busy+'" style="position:absolute; z-index:'+zindex+'; top:0; left:0; width:100%; height:100%; overflow:hidden;"></div>';
			$(this.elements.finset).append(overlay);
			C_iWIN.cursor('wait');
		} else {
			let overlay = document.getElementById(this.eids.busy);
			if(overlay) $(overlay).remove();
			C_iWIN.cursor();
		}
		return this;
	},
	tbusy: function(onoff) { // tabs container zone busy overlay (not used in last version)
		if(onoff != this.state.tbusy) {
			this.controls.tabs.busy('realtime', onoff );
			this.controls.tabs.busy('archives', onoff );
		}
		return this;
	},

	// filters handlers
	filter: function(which) {
		let fchange = which != this.state.filter; if(!fchange) return; 
		this.state.filter = which;
		if(vbs) vlog('mobminder.js','C_backCNX','filter','which:'+which); 
			if(which=='created'||which=='archived') which = 'period';
		for(let eid in this.elements.filters.get) $(this.elements.filters[eid]).hide(); $(this.elements.filters[which]).show();
		if(which=='keyword') { this.controls.keyword.clear().focus(true); this.filterchanging(); return; } // no spontaneous fetch
		this.fetch();
	},
	filterchanging: function() {
		this.controls.tabs.html('archives', C_XL.w('afilter changing'));
		this.controls.tabs.html('realtime', C_XL.w('afilter changing'));
	},
	filterschanged: function() {
			let dpisopen = this.controls.dp.isopen(), xwisopen = this.controls.xw.isopen();
		if(vbs) vlog('mobminder.js','C_backCNX','onfilters','dpisopen'+dpisopen+', xwisopen'+xwisopen); 
		if(dpisopen||xwisopen) return;
		if(this.controls.filter.getvalue()=='keyword') return this.keyword(this.controls.keyword.value()); // because keyword length must be checked
		this.fetch();
	},
	keyword: function(digits) {
		if(vbs) vlog('mobminder.js','C_backCNX','keyword','digits:'+digits); 
		let stripped = digits.replace(/[ +]/gi,'');
		if(stripped.length <= 5) { this.filterchanging(); return; }
		this.fetch();
	},
	keywclear: function() {
		if(vbs) vlog('mobminder.js','C_backCNX','keywclear',''); 
	},
	acgroup: function(id) {
		if(vbs) vlog('mobminder.js','C_backCNX','acg','id:'+id); 
	},
	groupcleared: function() {
		if(vbs) vlog('mobminder.js','C_backCNX','gcleared',''); 
	},
	aclogin: function(id) {
		if(vbs) vlog('mobminder.js','C_backCNX','acg','id:'+id); 
	},
	logincleared: function() {
		if(vbs) vlog('mobminder.js','C_backCNX','gcleared',''); 
	},
	
	// ajax callbacks
	freshdata: function(datsSets, stream) {
		
		if(vbs) vlog('mobminder.js','C_backCNX','freshdata',''); 
		
		this.controls.tabs.html('realtime',this.realtime.display('cnx-realtime'));
		this.controls.tabs.html('archives',this.archives.display('cnx-archives'));
		this.realtime.activate(); 
		this.archives.activate(); 
		
		this.fbusy(false);
		return;
	},
	failed: function() {
		this.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   B A C K   O F F I C E     :   P R E F E R E N C E S    T A B S    S W I T C H E R 
//
function C_backPREFS(eid, callbacks, preset) { // used by C_iMOB, display inserted into the backoffice section
	
		const b = eid+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons', duplicate:b+'dup',
		account: { id:b+'id', name:b+'name', sector:b+'sec', headline:b+'hdl', color:b+'color', pattern:b+'pattern', tag:b+'tag', note:b+'note', packageplan:b+'pack' },
		display: { gender:b+'gend', lang:b+'lang', visitors:b+'visi', slicing:b+'slicing', stifont:b+'stifont', pslicing:b+'pslicing', gmt:b+'gmt', range:b+'range', durations:b+'dur', durstep:b+'step', before:b+'bef' },
		colors: { /* later (*prf1) */ },
		agendas: { usestandbylist:b+'emerg', overdays:b+'overd', usenotes:b+'usenotes', usetasks:b+'usetasks', usefiles:b+'usefiles', guidelines:b+'gdlns' },
		xcals: { plus:{ bcal:b+'_p_bcal', ucal:b+'_p_ucal', fcal:b+'_p_fcal' }, names:{ bcal:b+'_n_bcal', ucal:b+'_n_ucal', fcal:b+'_n_fcal' } /* later (*prf2) */ },
		logins: { plus: b+'logins', usechat: b+'usechat', granting:b+'grntng' },
		products: { plus: b+'pdcs' }, eproducts: { plus: b+'epdcs' }, workcodes: { plus: b+'wkcs' }, eworkcodes: { plus: b+'ewkcs' }, timeboxing: { plus: b+'tbxng' },
		epay: { am:b+'_am' , usepay: b+'uspy', iban: b+'iban', bic: b+'bic', holder: b+'hldr', pckey: b+'pckey'
				, ctop_id: b+'ctop_id', ctop_pass: b+'ctop_ps', ctop_hmac: b+'ctop_hm', compay: b+'compay'
				, spay_cid: b+'spay_cid', spay_csc: b+'spay_csc', spay_aid: b+'spay_aid'
				, hpay_cid: b+'hpay_cid', hpay_csc: b+'hpay_csc', hpay_aid: b+'hpay_aid', hpay_pair: b+'hpay_pair'
				},
		comms: { sendsms:b+'sendsms', weburl:b+'weburl', email:b+'email', mobile:b+'mobile', ccphone:b+'ccphne', prefix:b+'prfx', smsplus:b+'smspl', emlplus:b+'emlpl', notifplus:b+'ntfpl' },
		wraps: { h1:b+'h1', noteccss:b+'wpnotes' , taskccss:b+'wptasks', chatccss:b+'wpchats', fileccss:b+'wpfiles', prdctccss:b+'wpprdcts', fcals:b+'fcals' }
	};
	this.elements = new A_el();
	this.state = C_backPREFS.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { cfgreload:, boffdone: };

if(vbs) vlog('mobminder.js','C_backPREFS','construction','');
	
	// globals
	const is = mobminder.context.surfer.is;

	// account
		this.dS = mobminder.account;
	let id			= new C_iPASS(this.dS.id);
	
		const ntyping = new A_cb(this, this.nametyping, null, null, 1400);
	const name 		= new C_iFIELD(this.eids.account.name, { onfchange:ntyping }, { digits:this.dS.name, type:INPUT_NAMES, mandatory:true, focus:true, enabled:is.atleast.seller });
	const sector 		= new C_iSEC(this.eids.account.sector, false, { value:this.dS.profsector, mandatory:true });
	const headline 	= new C_iNOTE(this.eids.account.headline, this.dS.headline, {rows:2} ); 
	const color		= new C_iSKIN(this.eids.account.color, {select:new A_cb(this, this.oncolorselect, null, null, 800)} , { type:ccsstype.color, value:this.dS.color, allownone:true, enabled:is.atleast.seller } /*preset*/ );
	const pattern		= new C_iSKIN(this.eids.account.pattern, {select:new A_cb(this, this.onpatternselect, null, null, 1000)}, { type:ccsstype.pattern, value:this.dS.pattern, allownone:true, enabled:is.atleast.seller } /*preset*/ );
	const acctag		= new C_iSKIN(this.eids.account.tag, {select:new A_cb(this, this.ontagselect, null, null, 1200)}, { type:skin.acctag, value:this.dS.tag, allownone:true, css:'tagbig', enabled:is.atleast.seller } /*preset*/ );
	const note 		= new C_iNOTE(this.eids.account.note, this.dS.note, { rows:16 } );
	
	const packageplan 	= new C_iDDWN(this.eids.account.packageplan, {}, {labels:{1:'Starter', 2:'Basic', 4:'Pro', 8:'Premium', 16:'Custom'}}, { value:this.dS.package, enabled:is.atleast.seller } );
	

	// display

	const gender		= new C_iDDWN(this.eids.display.gender, {}, {labels:C_XL.w(genders.english)}, { value:this.dS.defaultGender } );
	const lang		= new C_iDDWN(this.eids.display.lang, {}, {labels:mobminder.language.names}, { value:this.dS.language } );
	
	const visitors	= new C_iDDWN(this.eids.display.visitors, {},  { labels:C_XL.w({ 100:'visitors clients', 200:'visitors patients', 150:'visitors particip'})}, { value:this.dS.visitorAlias}  );
	const slicing		= new C_iDDWN(this.eids.display.slicing, {},  { labels:{ 1:'60mn', 2:'30mn', 3:'20mn', 4:'15mn', 6:'10mn', 12:'5mn'}}, { value:this.dS.timeSlice, enabled:is.atleast.seller } );
	const stifont		= new C_iDDWN(this.eids.display.stifont, {},  { labels:C_XL.w({ 0:'small font', 1:'medium font', 2:'large font', 3:'xl font'})}, { value:this.dS.stiFontSize } );
	const pslicing	= new C_iDDWN(this.eids.display.pslicing, {},  { labels:{ 2:'+CC 623 12 24 56', 3:'+CC 475 123 456'}}, { value:this.dS.phoneSlicing}  );
	
	const gmt			= new C_iGMT(this.eids.display.gmt, {}, { value:this.dS.GMT } );

		const srange = C_dS_shadow.range();
	const range		= new C_iRANGE(this.eids.display.range, {}, { units:'seconds', setin:this.dS.rangeIn, setout:this.dS.rangeOut, increment:'hour', min:0, max:86400, lockafter:srange.soonest } );
	const durations	= new C_iRANGE(this.eids.display.durations, {}, { units:'slices', setin:this.dS.durationShortest, setout:this.dS.durationLongest, increment:'slice', min:2, max:20 } );
	
	const dursteps 	= new C_iDDWN(this.eids.display.durstep, {}, {labels:C_XL.w({ 1:'1 slice', 2:'2 slices', 3:'3 slices', 4:'4 slices', 5:'5 slices', 6:'6 slices' })}, { value:this.dS.durationSteps } );

	const before 		= new C_iBEFORE(this.eids.display.before, {}, { mode:'checker', maxrows:6, selection:this.dS.notbefore } );
	// let upleftdate 	= new C_iDATEPRESET(this.eids.display.upleftdate, {}, { jsdate:this.dS.upperLeftDate } );
	
	// custom colors & patterns (*prf1) 
		const colors = new A_cb(this, this.ccss);
		const ccss = new A_ct();
	for(let type in ccsstype) {
		const types = new A_ct();
		const csstype = ccsstype[type];
		for(let clas in ccssclasses) {
			const resaclass = ccssclasses[clas];
			// console.log('   class='+clas+':'+resaclass); // keep this debug log, it is very usefull
			const tag = ccsstag(clas, type); // returns return type+'_'+clas;
			const eid = this.eids.colors[tag] = tag;
			const bp = 'ccss_bp_'+clas+'_'+type; // something like ccss_bp_appointment_color, ccss_bp_visitor_pattern, ccss_bp_event_color, see language.js
			const c = new C_iPLUS(eid, { select:colors }, { plusclass:new C_dS_customCss.plus(resaclass, csstype), blueprint:bp } );
			types.add1(c, resaclass);
		}
		ccss.add1(types, csstype);
	}
	
	// agendas (*prf2)
	
	const usestandbylist = new C_iONOFF(this.eids.agendas.usestandbylist, {}, { state:this.dS.usestandbylist } );
	const overdays  = new C_iONOFF(this.eids.agendas.overdays, {}, { state:this.dS.overdays } );
	const usenotes  = new C_iONOFF(this.eids.agendas.usenotes, { onswitch:new A_cb(this, this.onUseNotes) }, { state:this.dS.usenotes } );
	const usetasks  = new C_iONOFF(this.eids.agendas.usetasks, { onswitch:new A_cb(this, this.onUseTasks) }, { state:this.dS.usetasks } );
	const usefiles  = new C_iONOFF(this.eids.agendas.usefiles, { onswitch:new A_cb(this, this.onUseFiles) }, { state:this.dS.usefiles } );
	
	const usechat   = new C_iONOFF(this.eids.logins.usechat, { onswitch:new A_cb(this, this.onUseChats) }, { state:this.dS.usechat } );
	
		const xcal = new A_cb(this, this.xcal);
	xcals_bcal = new C_iPLUS(this.eids.xcals.plus.bcal, { select:xcal }, { plusclass:new C_dS_resource.plus(class_bCal), reorder:false, twocolumns:12 });
	xcals_ucal = new C_iPLUS(this.eids.xcals.plus.ucal, { select:xcal }, { plusclass:new C_dS_resource.plus(class_uCal), reorder:false, twocolumns:12 });
	xcals_fcal = new C_iPLUS(this.eids.xcals.plus.fcal, { select:xcal }, { plusclass:new C_dS_resource.plus(class_fCal), reorder:false, twocolumns:12 });
	
		const options = C_dS_resource.names.options();
	xnames_bcal = new C_iDDWN(this.eids.xcals.names.bcal, { }, options, { value:mobminder.account.rescTypeNames[class_bCal], maxcols:1 } );
	xnames_ucal = new C_iDDWN(this.eids.xcals.names.ucal, { }, options, { value:mobminder.account.rescTypeNames[class_uCal], maxcols:1 } );
	xnames_fcal = new C_iDDWN(this.eids.xcals.names.fcal, { }, options, { value:mobminder.account.rescTypeNames[class_fCal], maxcols:1 } );
	
		const onguideline = new A_cb(this, this.onguideline);
	const guidelines = new C_iPLUS(this.eids.agendas.guidelines, { select:onguideline }, { plusclass:new C_dS_guidelines.plus() });
	
	// logins
		const onlogin = new A_cb(this, this.onlogin);
		const bylevel = new Array();
		const noeworkcodes = !C_dS_workcode.has({eresa:true});
	
	for(let l in aLevel.names)
		if(l>mobminder.context.surfer.accessLevel) continue; // you can see only logins who have your access level and under
		else bylevel[l] = new C_iPLUS(this.eids.logins.plus+'_'+l, { select:onlogin }, { plusclass:new C_dS_loggable.plus(l) });
	const logins = new A_ct(bylevel);	
	
	const granting = new C_iALLOW(this.eids.logins.granting, {}, {} );

	// communication
	const weburl 	= new C_iFIELD(this.eids.comms.weburl, false, { digits:this.dS.weburl, type:INPUT_URL, mandatory:false, enabled:is.atleast.seller, placeholder:'www.example.com' });
	const email 	= new C_iFIELD(this.eids.comms.email, false, { digits:this.dS.email, type:INPUT_EMAIL, mandatory:true });
	const mobile 	= new C_iFIELD(this.eids.comms.mobile, false, { digits:this.dS.smsSenderId, type:INPUT_NAMES, mandatory:true, max:12 });
	const ccphone = new C_iFIELD(this.eids.comms.ccphone, false, { digits:this.dS.ccphone, type:INPUT_PHONE, mandatory:false });
	
	const sendsms = new C_iDDWN(this.eids.comms.sendsms, {}, {labels:C_XL.w({ 0:'no', 1:'yes' })}, { value:this.dS.sendSMSs, enabled:is.atleast.seller } );

		const onsms = new A_cb(this, this.onsms);
		const onemail = new A_cb(this, this.onemail);
		const onnotif = new A_cb(this, this.onnotif);
	const prefix = new C_iCountryCodes(this.eids.comms.prefix, { }, { value:this.dS.phoneRegion } );
	const smsplus = new C_iPLUS(this.eids.comms.smsplus, { select:onsms }, { plusclass:new C_dS_smsTemplate.plus() });
	const emlplus = new C_iPLUS(this.eids.comms.emlplus, { select:onemail }, { plusclass:new C_dS_emailTemplate.plus() });
	const notifplus = new C_iPLUS(this.eids.comms.notifplus, { select:onnotif }, { plusclass:new C_dS_notifTemplate.plus() });
	
	// workcodes
		const onworkcode = new A_cb(this, this.onworkcode), ontimebox = new A_cb(this, this.ontimebox);
	const timeboxing = new C_iPLUS(this.eids.timeboxing.plus, { select:ontimebox }, { plusclass:new C_dS_timeboxing.plus(), twocolumns:12, blueprint:'bp_bprefs_timeboxing' });
	const workcodes = new C_iPLUS(this.eids.workcodes.plus, { select:onworkcode }, { plusclass:new C_dS_workcode.plus({eresa:false}), blueprint:'bp_bprefs_workcodes' });
	const eworkcodes = new C_iPLUS(this.eids.eworkcodes.plus, { select:onworkcode }, { plusclass:new C_dS_workcode.plus({eresa:true}), blueprint:'bp_bprefs_eworkcodes' });
	
	// products
		const onproduct = new A_cb(this, this.onproduct);
	const products = new C_iPLUS(this.eids.products.plus, { select:onproduct }, { plusclass:new C_dS_product.plus({eresa:false}), blueprint:'bp_bprefs_products' });
	const eproducts = new C_iPLUS(this.eids.eproducts.plus, { select:onproduct }, { plusclass:new C_dS_product.plus({eresa:true}), blueprint:'bp_bprefs_eproducts' });
	
	
	// e-payment   iban:'ePayBenefName', bic:'ePayBenefIBAN', holder:'ePayBenefBIC'
		const mayedit = is.atleast.seller;
	const usepay  = new C_iONOFF(this.eids.epay.usepay, {}, { state:this.dS.ePayActive, enabled:mayedit } );
		let ibanph = C_XL.w('CCBC-IBAN-IBAN-IBAN',{cap:0}); if(mobminder.account.phoneRegion=='32') ibanph = C_XL.w('CCBC-IBAN-IBAN-IBAN',{cap:0, language:mobminder.language.codes.dutch}); // see // (*ml*)
	const iban 	= new C_iFIELD(this.eids.epay.iban, false, { digits:this.dS.ePayBenefIBAN, type:INPUT_IBAN, mandatory:false, placeholder:ibanph, enabled:mayedit });
	const bic 	= new C_iFIELD(this.eids.epay.bic, false, { digits:this.dS.ePayBenefBIC, type:INPUT_BIC, mandatory:false, placeholder:'BBBBCCLL(bbb)', enabled:mayedit });
	const holder 	= new C_iFIELD(this.eids.epay.holder, false, { digits:this.dS.ePayBenefName, type:INPUT_NAMES, mandatory:false, placeholder:C_XL.w('name',{cap:0}), enabled:mayedit });
	const paycokey = new C_iFIELD(this.eids.epay.pckey, false, { digits:this.dS.ePayconiqKey, type:INPUT_KEYS, mandatory:false, placeholder:'your payconiq key', enabled:mayedit });
	
	const ePayComputopId 	 = new C_iFIELD(this.eids.epay.ctop_id, false, { digits:this.dS.ePayComputopId, 	type:INPUT_KEYS, mandatory:false, placeholder:'your computop id', enabled:mayedit });	
	const ePayComputopFish = new C_iFIELD(this.eids.epay.ctop_pass, false, { digits:this.dS.ePayComputopFish, type:INPUT_KEYS, mandatory:false, placeholder:'your computop password', enabled:mayedit });	
	const ePayComputopHmac = new C_iFIELD(this.eids.epay.ctop_hmac, false, { digits:this.dS.ePayComputopHmac, type:INPUT_KEYS, mandatory:false, placeholder:'your computop hmac key', enabled:mayedit });	

	const ePayWebActive = new C_iCOMPAY(this.eids.epay.compay, {}, {encoded:this.dS.ePayWebActive} );
	
	const ePaySoftPayClientId 	= new C_iFIELD(this.eids.epay.spay_cid, false, { digits:this.dS.ePaySoftPayClientId, 		type:INPUT_KEYS, mandatory:false, placeholder:'your softpay client id', enabled:mayedit });	
	const ePaySoftPayClientSecret = new C_iFIELD(this.eids.epay.spay_csc, false, { digits:this.dS.ePaySoftPayClientSecret, 	type:INPUT_KEYS, mandatory:false, placeholder:'your softpay client secret', enabled:mayedit });	
	const ePaySoftPayAppId 		= new C_iFIELD(this.eids.epay.spay_aid, false, { digits:this.dS.ePaySoftPayAppId, 			type:INPUT_KEYS, mandatory:false, placeholder:'your softpay application id', enabled:mayedit });	
	
	const ePayHardPayClientId 	= new C_iFIELD(this.eids.epay.hpay_cid, false, { digits:this.dS.ePayHardPayClientId, 		type:INPUT_KEYS, mandatory:false, enabled:false, placeholder:'your terminal id' });	
	const ePayHardPayClientSecret = new C_iFIELD(this.eids.epay.hpay_csc, false, { digits:this.dS.ePayHardPayClientSecret, 	type:INPUT_KEYS, mandatory:false, enabled:false, placeholder:'your client secret' });	
	const ePayHardPayToken 		= new C_iFIELD(this.eids.epay.hpay_aid, false, { digits:this.dS.ePayHardPayToken, 			type:INPUT_KEYS, mandatory:false, enabled:false, placeholder:'your application id' });	
	
		const url = 'www.mobminder.com/'+mobminder.context.surfer.languageabr()+'/pay.php';
		const tipwww = C_XL.w('tip-iam-www', { cap:true } )+'<br/>'+url; 
		const caption = 'www.mobminder.com';
	const accman		= new C_iAManager(this.eids.epay.am, {}, { additionalink:{caption:caption, url:url, tip:tipwww } } );

			const spanstyles = 'opacity:.6; padding-top:1em;';
			const istyles = 'padding:.3em 1em; min-width:2em; text-align:center; flex-grow:1;';
			const iclasses = 'fad fa-gray fa-3x mobtext';
		const symbhrdpos 	= '<div style="'+istyles+'" class="'+iclasses+' fa-credit-card"></div><div style="'+spanstyles+'">HardPOS</div>';
	const ePayHardPairButton = new C_iCLIK(this.eids.epay.hpay_pair, { click:new A_cb(this, this.onHPpair) }, { tag:'td', ui:symbhrdpos, css:'', style:'text-align:center;', tip:'click to pair a new terminal' }  );
	
	// wrapper
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:is.supervised, removekbshorcut:false });

	const duplicate 	= is.atleast.seller ? new C_iCLIK(this.eids.duplicate, { click:new A_cb(this, this.duplicate) }
		, { enabled:this.state.remove, tip:C_XL.w('tip acc duplicate'), css:'modal-button fa fa-gray fa-copy touch-blue', tag:'div', style:'font-size:1.4em;'
		}) : false;

		const tabscaps = C_XL.w({/*account:'account', */display:'display', colors:'colors', agendas:'agendas', accesses:'accesses', comms:'comms', workcodes:'workcodes', epay:'payment', audit:'audit'});
	const tabs = new C_iTABS(this.eids.tabs, tabscaps, {/*callbacks*/}, { numbering:true });
	this.controls = new A_ct( { cartouche:cartouche, duplicate:duplicate, tabs:tabs, 
		/* account */ id:id, name:name, sector:sector, headline:headline, color:color, pattern:pattern, acctag:acctag, note:note, packageplan:packageplan,
		/* display */ gender:gender, lang:lang, visitors:visitors, slicing:slicing, stifont:stifont, pslicing:pslicing, gmt:gmt, range:range, durations:durations, dursteps:dursteps, before:before,
		/* colors */ ccss:ccss, 
		/* agendas */ usestandbylist:usestandbylist, overdays:overdays, usenotes:usenotes, usetasks:usetasks,  usefiles:usefiles, 
		/* xcals */ xcals_bcal:xcals_bcal, xcals_ucal:xcals_ucal, xcals_fcal:xcals_fcal, xnames_bcal:xnames_bcal, xnames_ucal:xnames_ucal, xnames_fcal:xnames_fcal, guidelines:guidelines,
		/* logins */ logins:logins, usechat:usechat, granting:granting,
		/* communications */ email:email, mobile:mobile, ccphone:ccphone, weburl:weburl, sendsms:sendsms, prefix:prefix, smsplus:smsplus, emlplus:emlplus, notifplus:notifplus,
		/* workcodes */ products:products, eproducts:eproducts, workcodes:workcodes, eworkcodes:eworkcodes, timeboxing:timeboxing,
		/* e-payment */ usepay:usepay, iban:iban, bic:bic, holder:holder, paycokey:paycokey
				, ePayComputopId:ePayComputopId, ePayComputopFish:ePayComputopFish, ePayComputopHmac:ePayComputopHmac, ePayWebActive:ePayWebActive
				, ePaySoftPayClientId:ePaySoftPayClientId, ePaySoftPayClientSecret:ePaySoftPayClientSecret, ePaySoftPayAppId:ePaySoftPayAppId
				, ePayHardPayClientId:ePayHardPayClientId, ePayHardPayClientSecret:ePayHardPayClientSecret, ePayHardPayToken:ePayHardPayToken
				, ePayHardPairButton:ePayHardPairButton, accman:accman
	} );
}
C_backPREFS.defaults = new A_df( { screen:screens.preferences, busy:false } );
C_backPREFS.prototype = {
	// public
	display:function() {
		if(vbs) vlog('mobminder.js','C_backPREFS','display',''); 
		
			const is = mobminder.context.surfer.is;
			const padderdiv = '<div style="display:inline-block; height:18em; width:1.6em;"></div>'; //  border:1px solid red;

		// account tab ( PVH 2025 - not in use anymore)
		const account = ''; // this.controls.tabs.container('account', '');	
		
		const paddy = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';	

		// display tab
			// const id = '<tr>'+this.controls.id.labelled('customer id')+'</tr>';
			
			// 1
			const packageplan = '<tr>'+this.controls.packageplan.labelled('package plan', 'alpha06')+'</tr>';
			const name 		= '<tr>'+this.controls.name.labelled('business name', 'alpha28')+'</tr>';
			const sector 		= '<tr>'+this.controls.sector.labelled('prof sector')+'</tr>';
			const nametable = '<div><table summary="account name and id" class="coords" style="margin:1em auto;">'+name+sector+'</table></div>';

			// 2
					const gender = '<tr>'+this.controls.gender.labelled('default gender', 'alpha06')+'</tr>';
					const lang = '<tr>'+this.controls.lang.labelled('language', 'alpha10')+'</tr>';
					const visitors = '<tr>'+this.controls.visitors.labelled('visitors alias', 'alpha06')+'</tr>';
					const slicing = '<tr>'+this.controls.slicing.labelled('time slice', 'alpha06')+'</tr>';
					const stifont = '<tr>'+this.controls.stifont.labelled('sticker font size', 'alpha06')+'</tr>';
					const gmt = this.controls.gmt.labelled('time zone', 'alpha28');
					const range = this.controls.range.labelled('planning range', 'alphaCUE');
					const durations = this.controls.durations.labelled('duration span', 'alphaCUE');
					const dursteps = '<tr>'+this.controls.dursteps.labelled('duration increment', 'alpha14')+'</tr>';
					const pslicing = '<tr>'+this.controls.pslicing.labelled('phone slicing', 'alpha10')+'</tr>';
				const left = '<table class="coords" summary="display left" style="display:inline-block">'+lang+gender+visitors+stifont+pslicing+packageplan+'</table>';
				const right = '<table class="coords" summary="display right" style="display:inline-block; margin-left:2em;">'+gmt+range+slicing+durations+dursteps+'</table>';
			const displayparams = '<div class="centered"><div style="display:inline-block; margin:1em auto;">'+left+right+'</div></div>';			
			
			
			// 3  account bulconst :
			// const color 		= '<tr>'+this.controls.color.labelled('color')+'</tr>';
			// const pattern 	= '<tr>'+this.controls.pattern.labelled('pattern')+'</tr>';
			// const acctag 		= '<tr>'+this.controls.acctag.labelled('tag')+'</tr>';
			
						const clabel = '<td class="label textcolor-light">'+C_XL.w('color')+'</td>';
						const plabel = '<td class="label textcolor-light">'+C_XL.w('pattern')+'</td>';
						const tlabel = '<td rowspan=2 class="label textcolor-light">'+C_XL.w('tag')+'</td>';
					
					const cctrl = '<td class="">'+this.controls.color.display()+'</td>';
					const pctrl = '<td class="">'+this.controls.pattern.display()+'</td>';
					const tctrl = '<td  rowspan=2 class="">'+this.controls.acctag.display()+'</td>';
				
				const cpt_row_1 = '<tr>'+clabel+cctrl+'<td>&nbsp;&nbsp;</td>'+tlabel+tctrl+'</tr>';
				const cpt_row_2 = '<tr>'+plabel+pctrl+'<td>&nbsp;&nbsp;</td>'+'</tr>';
			
			const colorpatterntag = '<div><table summary="account setting" class="coords" style="margin:2em 20% 2em auto;">'+cpt_row_1+cpt_row_2+'</table></div>';

			
			// let colorpatterntag = '<div><table summary="account setting" class="coords" style="margin:1em auto;">'+color+pattern+acctag+'</table></div>';
			
			const headline 	= '<tr>'+this.controls.headline.labelled('headline', 'alpha40')+'</tr>';
			const note 		= '<tr>'+this.controls.note.labelled('note', 'alpha40')+'</tr>';
			
			const headlinenote = '<div><table summary="account setting" class="coords" style="margin:1em auto;">'+paddy+headline+note+'</table></div>';
			
			// 4
				
				// let upleftdate = '<tr style="border-top:2em solid transparent;"><td>'+this.controls.upleftdate.display()+'</td></tr>'; // PVH 2025 - declared obsolete
				
				const beforebp = '<div><span class="blueprint">'+C_XL.w('backprefs-bp-search-assistent')+'</span></div>';
				const beforectrl = '<div>'+this.controls.before.display()+'</div>';
			const beneath = '<div style="margin:3em 30%;">'+beforebp+beforectrl+'</div>';
	
			
			
			// assemble [1,2,3,4]
	
				const tr1_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline visis-title-color">'+C_XL.w('backprefs-geometry')+'</div></td>';
		const tr_1 = '<tr class="">'+tr1_header+'<td>'+displayparams+'</td>'+'</tr>';
		
				const tr2_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline resas-title-color">'+C_XL.w('backprefs-description')+'</div></td>';
		const tr_2 = '<tr class="">'+tr2_header+'<td>'+nametable+colorpatterntag+headlinenote+'</td>'+'</tr>';
		
				const tr3_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline chats-title-color">'+C_XL.w('backprefs-search-assistent')+'</div></td>';
		const tr_3 = '<tr class="">'+tr3_header+'<td>'+beneath+'</td>'+'</tr>';
		
			const assembled = '<table summary="workcodes" class="backprefs-tabcontainer-layout" style="margin-top:2em;">'+tr_1+tr_2+tr_3+'</table>';
		
		
		
		const display = this.controls.tabs.container('display', assembled);
			
			
			
		
		// custom css
		
			const app_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline resas-title-color">'+C_XL.w('appointments')+'</div></td>';
			const app_col = this.controls.ccss[ccsstype.color][ccssclasses.appointment].labelled('colors','','textcolor-light');
			const app_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.appointment].labelled('patterns','patterns','textcolor-light');
			const app_tag = this.controls.ccss[ccsstype.tag][ccssclasses.appointment].labelled('tags','','textcolor-light');
			
			const event_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline resas-title-color">'+C_XL.w('off time')+'</div></td>';
			const event_col = this.controls.ccss[ccsstype.color][ccssclasses.event].labelled('colors','','textcolor-light');
			const event_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.event].labelled('patterns','patterns','textcolor-light');
			const event_tag = this.controls.ccss[ccsstype.tag][ccssclasses.event].labelled('tags','','textcolor-light');
			
			const fcal_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline resas-title-color">'+C_XL.w('optional resa')+'</div></td>';
			const fcal_col = this.controls.ccss[ccsstype.color][ccssclasses.fcal].labelled('colors','','textcolor-light');
			const fcal_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.fcal].labelled('patterns','patterns','textcolor-light');
			const fcal_tag = this.controls.ccss[ccsstype.tag][ccssclasses.fcal].labelled('tags','','textcolor-light');
			
			const visi_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline visis-title-color">'+C_XL.w('visitors')+'</div></td>';
			const visi_col = this.controls.ccss[ccsstype.color][ccssclasses.visitor].labelled('colors','','textcolor-light');
			const visi_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.visitor].labelled('patterns','patterns','textcolor-light');
			const visi_tag = this.controls.ccss[ccsstype.tag][ccssclasses.visitor].labelled('tags','','textcolor-light');
			
			const note_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline notes-title-color">'+C_XL.w('notes')+'</div></td>';
			const note_col = this.controls.ccss[ccsstype.color][ccssclasses.note].labelled('colors','','textcolor-light');
			const note_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.note].labelled('patterns','patterns','textcolor-light');
			const note_tag = this.controls.ccss[ccsstype.tag][ccssclasses.note].labelled('tags','','textcolor-light');
			
			const task_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline tasks-title-color">'+C_XL.w('tasks')+'</div></td>';
			const task_col = this.controls.ccss[ccsstype.color][ccssclasses.task].labelled('colors','','textcolor-light');
			const task_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.task].labelled('patterns','patterns','textcolor-light');
			const task_tag = this.controls.ccss[ccsstype.tag][ccssclasses.task].labelled('tags','','textcolor-light');
			
			const chat_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline chats-title-color">'+C_XL.w('chats')+'</div></td>';
			const chat_col = this.controls.ccss[ccsstype.color][ccssclasses.chat].labelled('colors','','textcolor-light');
			const chat_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.chat].labelled('patterns','patterns','textcolor-light');
			const chat_tag = this.controls.ccss[ccsstype.tag][ccssclasses.chat].labelled('tags','','textcolor-light');
			
			const file_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline mobtext">'+C_XL.w('files')+'</div></td>';
			const file_col = this.controls.ccss[ccsstype.color][ccssclasses.file].labelled('colors','','textcolor-light');
			const file_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.file].labelled('patterns','patterns','textcolor-light');
			const file_tag = this.controls.ccss[ccsstype.tag][ccssclasses.file].labelled('tags','','textcolor-light');
			
			const prdct_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline products-title-color">'+C_XL.w('products')+'</div></td>';
			const prdct_col = this.controls.ccss[ccsstype.color][ccssclasses.product].labelled('colors','','textcolor-light');
			const prdct_pat = this.controls.ccss[ccsstype.pattern][ccssclasses.product].labelled('patterns','patterns','textcolor-light');
			const prdct_tag = this.controls.ccss[ccsstype.tag][ccssclasses.product].labelled('tags','','textcolor-light');
			
				const title_colors = '<th>&nbsp;</th><th><h2>'+C_XL.w('colors')+'</h2></th>';
				const title_patterns = '<th>&nbsp;</th><th><h2>'+C_XL.w('patterns')+'</h2></th>';
				const title_tags = '<th>&nbsp;</th><th><h2>'+C_XL.w('tags')+'</h2></th>';
			const tr_titles = '<tr style="border-top:1em solid transparent;">'+'<td></td>'+title_colors+title_patterns+title_tags+'</tr>';
			
			const tr_visi = '<tr class="pluslists-row visible">'+visi_header+visi_col+visi_pat+visi_tag+'</tr>';
			const tr_apps = '<tr class="pluslists-row visible">'+app_header+app_col+app_pat+app_tag+'</tr>';
			const tr_event = '<tr class="pluslists-row visible">'+event_header+event_col+event_pat+event_tag+'</tr>';
			const tr_fcal = '<tr id="'+this.eids.wraps.fcals+'"  class="pluslists-row visible">'+fcal_header+fcal_col+fcal_pat+fcal_tag+'</tr>';
			const tr_note = '<tr id="'+this.eids.wraps.noteccss+'" class="pluslists-row visible">'+note_header+note_col+note_pat+note_tag+'</tr>';
			const tr_task = '<tr id="'+this.eids.wraps.taskccss+'" class="pluslists-row visible">'+task_header+task_col+task_pat+task_tag+'</tr>';
			const tr_chat = '<tr id="'+this.eids.wraps.chatccss+'" class="pluslists-row visible">'+chat_header+chat_col+chat_pat+chat_tag+'</tr>';
			const tr_file = '<tr id="'+this.eids.wraps.fileccss+'" class="pluslists-row visible">'+file_header+file_col+file_pat+file_tag+'</tr>';
			const tr_product = '<tr id="'+this.eids.wraps.prdctccss+'" class="pluslists-row visible">'+prdct_header+prdct_col+prdct_pat+prdct_tag+'</tr>';
			
			const table = '<table class="pluslists-layout" >'+tr_titles+tr_visi+tr_apps+tr_event+tr_fcal+tr_note+tr_task+tr_chat+tr_file+tr_product+'</table>'
		let colors = this.controls.tabs.container('colors', table, 'pluslists-layout' );
		
		// agendas
		
			// 1 Options
					const usestandbylist = '<tr>'+this.controls.usestandbylist.labelled('use standby list', 'alpha10')+'</tr>';
					const overdays = '<tr>'+this.controls.overdays.labelled('search overdays', 'alpha10')+'</tr>';
					const usenotes = '<tr>'+this.controls.usenotes.labelled('account usenotes', 'alpha10')+'</tr>';
					const usetasks = '<tr>'+this.controls.usetasks.labelled('account usetasks', 'alpha10')+'</tr>';
					const usefiles = '<tr>'+this.controls.usefiles.labelled('account usefiles', 'alpha10')+'</tr>';
				const aoptions = '<table class="centered" style="">'+usestandbylist+overdays+usenotes+usetasks+usefiles+'</table>';
				
			const layoutaoptions = '<table style="width:100%; margin-top:3em;" class="">'+'<tr><td style="min-width:66%">'+aoptions+'</td>'+'<td></td></tr></table>';
			
			
			// 2-3-4 Cals
							const bc = this.controls.xnames_bcal.display('right alpha10');
							const uc = this.controls.xnames_ucal.display('right alpha10');
							const fc = this.controls.xnames_fcal.display('right alpha10');
						
						const plusbcals = this.controls.xcals_bcal.prefixed( bc, { leftertdcss:'prefix label textcolor-light alpha10' } );
						const plusucals = this.controls.xcals_ucal.prefixed( uc, { leftertdcss:'prefix label textcolor-light alpha10' } );
						const plusfcals = this.controls.xcals_fcal.prefixed( fc, { leftertdcss:'prefix label textcolor-light alpha10' } );
				
						const bpstyles = 'width:35%;';
					const bcalsbp = '<td style="'+bpstyles+'" class="blueprint left">'+C_XL.w('bcal creation note')+'</td>';
					const ucalsbp = '<td style="'+bpstyles+'" class="blueprint left">'+C_XL.w('ucal creation note')+'</td>';
					const fcalsbp = '<td style="'+bpstyles+'" class="blueprint left">'+C_XL.w('fcal creation note')+'</td>';
				
				const bcals = '<table class="pluslists-layout centered" style="width:90%;"><tr>'+bcalsbp+plusbcals+'</tr>'+'</table>';
				const ucals = '<table class="pluslists-layout centered" style="width:90%;"><tr>'+ucalsbp+plusucals+'</tr>'+'</table>';
				const fcals = '<table class="pluslists-layout centered" style="width:90%;"><tr>'+fcalsbp+plusfcals+'</tr>'+'</table>';
				
				
			// 5 Guidelines
			
				const gbp = '<div style="max-width:30%; padding-top:2em;" class="blueprint inline">'+C_XL.w('bp_bprefs_guidelines')+'</div>';
				const gdl = '<table class="pluslists-layout" style="max-width:30%; vertical-align:top;">'+this.controls.guidelines.labelled('guidelines')+'</table>'; // that is a pair of td's like <td>label</td><td>plus list</td>
			const guidelines = '<div style="display:flex; justify-content:center;">'+gdl+gbp+'</div>';
			
				
				let a_tr1_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline">'+C_XL.w('backprefs-options')+'</div></td>';
		const a_tr_1 = '<tr class="">'+a_tr1_header+'<td>'+layoutaoptions+'</td>'+'</tr>';
		
				let a_tr2_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline">'+C_XL.w('backprefs-guidelines')+'</div></td>';
		const a_tr_2 = '<tr class="">'+a_tr2_header+'<td>'+guidelines+'</td>'+'</tr>';
		
				let a_tr3_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline">'+C_XL.w('backprefs-business-agendas')+'</div></td>';
		const a_tr_3 = '<tr class="">'+a_tr3_header+'<td>'+bcals+'</td>'+'</tr>';
		
				let a_tr4_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline">'+C_XL.w('backprefs-contingent-agendas')+'</div></td>';
		const a_tr_4 = '<tr class="">'+a_tr4_header+'<td>'+ucals+'</td>'+'</tr>';
		
				let a_tr5_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline">'+C_XL.w('backprefs-optional-agendas')+'</div></td>';
		const a_tr_5 = '<tr class="">'+a_tr5_header+'<td>'+fcals+'</td>'+'</tr>';
		
			const a_assembled = '<table setup" class="backprefs-tabcontainer-layout" style="margin-top:2em; width:100%;">'+a_tr_1+a_tr_3+a_tr_4+a_tr_5+a_tr_2+'</table>';
		

		const agendas = this.controls.tabs.container('agendas', a_assembled, 'pluslists-layout' );
		
		// logins
			// logins list
			let logins = new Array();
			let ltitle = ''; if(is.atleast.seller) ltitle = '<tr class="pluslists-row visible"><th></th><th colspan="2"><h2 style="padding-left:10em;">'+C_XL.w('logins')+'</h2></th></tr>';
			const usechat = '<tr class="pluslists-row" style=""><td></td>'+this.controls.usechat.labelled('account usechat', 'alpha10')+'</tr>';
			for(let l in this.controls.logins.get) {
				logins[l] = '<tr class="pluslists-row visible"><td></td>'+this.controls.logins[l].labelled(aLevel.name(l))+'</tr>'; // aLevel is defined here: see (*av01*)
			}
			logins = '<table summary="logins" class="pluslists-layout" >'+ltitle+logins.join('')+usechat+'</table>';
			
			// access keys attribution
				let granting = '';
			if(is.atleast.seller) {
				granting = '<tr class=""><td>'+this.controls.granting.display()+'</td></tr>';
				granting = '<table summary="acckeys" class="">'+granting+'</table>';
			};
			
			let loglayout = '<table summary="accesses" class="pluslists-layout"><tr><td style="min-width:36em;">'+logins+'</td><td style="padding-left:8em;">'+granting+'</td></tr></table>';
		logins = this.controls.tabs.container('accesses', loglayout );
		this.controls.tabs.hide('accesses', !permissions.may(pc.ch_logins));
		
		// communication
				const weburl = '<tr>'+this.controls.weburl.labelled('website url')+'</tr>';
				const email = '<tr>'+this.controls.email.labelled('email senderid')+'</tr>';
				const mobile = '<tr>'+this.controls.mobile.labelled('sms senderid')+'</tr>';
				const ccphone = '<tr>'+this.controls.ccphone.labelled('call center phone')+'</tr>';
				const sendsms = '<tr>'+this.controls.sendsms.labelled('activate messaging', 'alpha04')+'</tr>';
				const prefix = '<tr>'+this.controls.prefix.labelled('phone region')+'</tr>';
			const commsoptions = '<table summary="account" class="coords" style="margin-top:3em; margin-bottom:3em;">'+weburl+email+mobile+ccphone+sendsms+prefix+'</table>';
			
				const smsplus = this.controls.smsplus.labelled('sms templates');
				const emlplus = this.controls.emlplus.labelled('email templates');
				const notifplus = this.controls.notifplus.labelled('notif templates');
			const commstemplates = '<table summary="templates" class="pluslists-layout"><tr class="pluslists-row visible">'+smsplus+emlplus+notifplus+'</tr></table>';
		const comms = this.controls.tabs.container('comms', commsoptions+commstemplates, 'pluslists-layout' );
		
		
		// workcodes & products
			
				const tbx_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline timeboxings-title-color">'+C_XL.w('timeboxings')+'</div></td>';
				const righterpad = '<td style="min-width:30%; border:1px solid red;"></td>';
				const timeboxing = '<table class="pluslists-layout"><tr class="pluslists-row visible">'+tbx_header+this.controls.timeboxing.labelled('timeboxings','timeboxings')+'</tr></table>';
			const tbtr = '<tr class=""><td colspan="4">'+timeboxing+'</td></tr>';
		
				const wrk_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline workcodes-title-color">'+C_XL.w('workcodes')+'</div></td>';
				const iworkcodes = this.controls.workcodes.labelled('workcodes','workcodes');
				const eworkcodes = this.controls.eworkcodes.labelled('e-reservable','workcodes');
			const wktr = '<tr class="pluslists-row visible">'+wrk_header+iworkcodes+eworkcodes+'</tr>';
		
				const prd_header = '<td style="position:relative;">'+padderdiv+'<div class="f-calibri-setsize vertical-inline products-title-color">'+C_XL.w('products')+'</div></td>';
				const products = this.controls.products.labelled('products','products');
				const eproducts = this.controls.eproducts.labelled('e-reservable','products');
			const pdtr = '<tr class="pluslists-row visible">'+prd_header+products+eproducts+'</tr>';
			
				const finalworkcodes = '<table summary="workcodes" class="pluslists-layout" >'+tbtr+wktr+pdtr+'</table>';
		
		
		const workcodes = this.controls.tabs.container('workcodes', finalworkcodes, 'pluslists-layout' );
		
		
		// e-payment
			let epayglobal = '';
			if(is.atleast.seller||mobminder.account.has.epay.active) { // only sellers and active users may view this data, note that for regular users (not sellar) the field edition is disabled
			
					let spanstyles = 'opacity:.6; padding-top:1em;';
					let istyles = 'padding:.3em 1em; min-width:2em; text-align:center; flex-grow:1;';
					let iclasses = 'fad fa-gray fa-3x mobtext';
				let symbcash 	= '<div style="'+istyles+'" class="'+iclasses+' fa-coins"></div><div style="'+spanstyles+'">Cash</div>';
				let symbsepa 	= '<div style="'+istyles+'" class="'+iclasses+' fa-qrcode"></div><div style="'+spanstyles+'">Sepa</div>';
				let symbpayco 	= '<div style="'+istyles+'" class="'+iclasses+' fa-infinity"></div><div style="'+spanstyles+'">Payconiq</div>';
				let symbecomm 	= '<div style="'+istyles+'" class="'+iclasses+' fa-globe"></div><div style="'+spanstyles+'">WebPage</div>';
				let symbsftpos 	= '<div style="'+istyles+'" class="'+iclasses+' fa-mobile-alt"></div><div style="'+spanstyles+'">SoftPOS</div>';
				let symbhrdpos 	= '<div style="'+istyles+'" class="'+iclasses+' fa-credit-card"></div><div style="'+spanstyles+'">HardPOS</div>';
	
					let usepay 	= '<tr>'+this.controls.usepay.labelled('ep-use payment', '')+'</tr>';
				let usepaytable = '<table summary="usepaytable" class="coords">'+usepay+'</table>';
	
					let holder 	= '<tr>'+this.controls.holder.labelled('qr beneficiary name', 'alpha20')+'</tr>';
					let iban 	= '<tr>'+this.controls.iban.labelled('qr beneficiary account', 'alpha20')+'</tr>';
					let bic 	= '<tr>'+this.controls.bic.labelled('qr beneficiary bic', 'alpha10')+'</tr>';
				let epaytable 	= '<table summary="epaytable" class="coords" >'+holder+iban+bic+'</table>';
				
					let paycokey 	= '<tr>'+this.controls.paycokey.labelled('ep-payconiq key', 'alpha32')+'</tr>';
				let paycotable 	= '<table summary="paycotable" class="coords" style="margin: 0 auto;">'+paycokey+'</table>';
				
					let compu_id 	= '<tr>'+this.controls.ePayComputopId.labelled('ep-computop-ec id', 'alpha32')+'</tr>'; // ec for e-commerce
					let compu_ps 	= '<tr>'+this.controls.ePayComputopFish.labelled('ep-computop-ec pass', 'alpha32')+'</tr>';
					let compu_hm 	= '<tr>'+this.controls.ePayComputopHmac.labelled('ep-computop-ec hmac', 'alpha32')+'</tr>';
					
							let bpt = 'Please select here the payment acquirers that should be presented as compatible for online e-payments.';
						let bp = '<td class="blueprint top" style="text-align:left;"><div style="max-width:300px; margin:40px auto 0 10px;">'+bpt+'</div></td>';
						let cresta = '<td>'+this.controls.ePayWebActive.display()+'</td>';
					let compu_active = '<tr style="border-top:12px solid transparent;">'+cresta+bp+'</tr>';
					
				let ecommercetable 	= '<table summary="computoptable" class="coords" style="margin: 0 auto;">'+compu_id+compu_ps+compu_hm+compu_active+'</table>';
				
					let softpos_cid 	= '<tr>'+this.controls.ePaySoftPayClientId.labelled('ep-softpay-sp clid', 'alpha32')+'</tr>'; // sp for softpos
					let softpos_csc 	= '<tr>'+this.controls.ePaySoftPayClientSecret.labelled('ep-softpay-sp clsc', 'alpha32')+'</tr>';
					let softpos_aid 	= '<tr>'+this.controls.ePaySoftPayAppId.labelled('ep-softpay-sp appid', 'alpha32')+'</tr>';
				let softpostable 	= '<table summary="computoptable" class="coords" style="margin: 0 auto;">'+softpos_cid+softpos_csc+softpos_aid+'</table>';
				
					let hardpos_cid 	= '<tr>'+this.controls.ePayHardPayClientId.labelled('ep-hardpos-hp clid', 'alpha32')+'</tr>'; // sp for softpos
					let hardpos_csc 	= '<tr>'+this.controls.ePayHardPayClientSecret.labelled('ep-hardpos-hp clsc', 'alpha32')+'</tr>';
					let hardpos_aid 	= '<tr>'+this.controls.ePayHardPayToken.labelled('ep-hardpos-hp token', 'alpha32')+'</tr>';
				let hardpostable 	= '<table summary="computoptable" class="coords" style="margin: 0 auto;">'+hardpos_cid+hardpos_csc+hardpos_aid+'</table>';
				

				let epayrow = '<tr style="border-top:30px solid transparent;"><td style="text-align:center;">'+symbcash+'</td>'+'<td>'+usepaytable+'</td></tr>';
				let separow = '<tr style="border-top:30px solid transparent;"><td style="text-align:center;">'+symbsepa+'</td>'+'<td>'+epaytable+'</td></tr>';
				let paycorow = '<tr style="border-top:30px solid transparent;"><td style="text-align:center;">'+symbpayco+'</td>'+'<td>'+paycotable+'</td></tr>';
				let compecom = '<tr style="border-top:30px solid transparent;"><td style="text-align:center;">'+symbecomm+'</td>'+'<td style="text-align:center;">'+ecommercetable+'</td></tr>';
				let softpos = '<tr style="border-top:30px solid transparent;"><td style="text-align:center;">'+symbsftpos+'</td>'+'<td style="text-align:center;">'+softpostable+'</td></tr>';
				
					let hpi = this.controls.ePayHardPairButton.display();
				let hardpos = '<tr style="border-top:30px solid transparent;">'+hpi+'<td style="text-align:center;">'+hardpostable+'</td></tr>';
			
				epayglobal = '<table summary="epayglobal" style="text-align:left; margin: 0 auto;">'+epayrow+separow+paycorow+compecom+softpos+hardpos+'</table>';
			
			} else { // regular user (not a seller)
			
				let dS_accman = this.controls.accman.dS; // this controls read directly from the am bank of logins
				
					let eptitle = '<div class="txt-gray_d" style="font-weight:bold; font-size:110%; text-align:center; padding-bottom:1em;">'+C_XL.w('eptab-title')+'</div>';	
					let intro = '<div style="font-weight:normal; text-align:center; margin:1em 20% 1em 20%;">'+C_XL.w('epctab-intro')+'</div>';
					
							let bcard = '<img src="./assets/imgs/paymeans/bcard.png" style="width:90px; min-width:90px; height:auto;"/>';
							let cash = '<img src="./assets/imgs/paymeans/cash.png" style="width:90px; min-width:90px; height:auto;"/>';
							let payco = '<img src="./assets/imgs/paymeans/payconiq.png" style="width:90px; min-width:90px; height:auto;"/>';
							let qrcode = '<img src="./assets/imgs/paymeans/qrcode.png" style="width:90px; min-width:90px; height:auto;"/>';
							let istyles = 'style="width:25%; max-width:25%; padding-top:20px;"';
							let lstyles = 'style="padding:0 1em;"';
						let uprow = '<tr><td '+istyles+'>'+cash+'</td><td '+istyles+'>'+payco+'</td><td '+istyles+'>'+qrcode+'</td><td '+istyles+'>'+bcard+'</td></tr>';
						let uprowlabels = '<tr><td '+lstyles+'>'+C_XL.w('eptab-cash')+'</td><td '+lstyles+'>'+C_XL.w('eptab-payco')+'</td><td '+lstyles+'>'+C_XL.w('eptab-SEPA')+'</td><td '+lstyles+'>'+C_XL.w('eptab-bcards')+'</td></tr>';
						// let dwrow = '<tr></tr>';
						// let dwrowlabels = '<tr></tr>';
					let pmeans = '<table style="text-align:center; margin:0 auto;">'+uprow+uprowlabels+'</table>';
					
								
								
							let check = '<td rowspan="2" style="vertical-align:top;"><div class="fad fa-17x fa-check mob-txt-lime" style="padding-right:.6em; display:relative; top:-10px;"></div></td>';
							
						let t1 = '<td><h2>'+C_XL.w('epctab-title1-QR')+'</h2></td>';
						let p1 = '<td><div>'+C_XL.w('epctab-chap1-QR')+'</div>';
							let bla1 = '<tr style="border-top:2em solid transparent;">'+check+t1+'</tr>'+'<tr>'+p1+'</tr>';
							
						let t2 = '<td><h2>'+C_XL.w('epctab-title2-QR')+'</h2></td>';
						let p2 = '<td><div>'+C_XL.w('epctab-chap2-QR')+'</div></td>';
							let bla2 = '<tr style="border-top:2em solid transparent;">'+check+t2+'</tr>'+'<tr>'+p2+'</tr>';
							
						let t3 = '<td><h2>'+C_XL.w('epctab-title3-BC')+'</h2></td>';
						let p3 = '<td><div>'+C_XL.w('epctab-chap3-BC')+'</div></td>';
							let bla3 = '<tr style="border-top:2em solid transparent;">'+check+t3+'</tr>'+'<tr>'+p3+'</tr>';
							
						let t4 = '<td><h2>'+C_XL.w('epctab-title4-SP')+'</h2></td>';
						let p4 = '<td><div>'+C_XL.w('epctab-chap4-SP')+'</div></td>';
							let bla4 = '<tr style="border-top:2em solid transparent;">'+check+t4+'</tr>'+'<tr>'+p4+'</tr>';
							
						let t5 = '<td><h2>'+C_XL.w('epctab-title5-OP')+'</h2></td>';
						let p5 = '<td><div>'+C_XL.w('epctab-chap5-OP')+'</div></td>';
							let bla5 = '<tr style="border-top:2em solid transparent;">'+check+t5+'</tr>'+'<tr>'+p5+'</tr>';
							
					let checks = '<table style="text-align:left; margin:2em 15%;">'+bla1+bla2+bla3+bla4+bla5+'</table>';

						let msg = '<div style="font-weight:normal; text-align:center; margin-top:4em; margin-bottom:1em;">'+C_XL.w('epctab-contact')+': <strong>'+dS_accman.lname({})+'</strong></div>';
					let pcontact = msg+this.controls.accman.display({orientation:'horizontal'});
				
				epayglobal = eptitle+intro+pmeans+checks+pcontact;
			}
			
			
			// let epayhtml = '<div style="justify-content:center; padding:1em; display:flex;">'+epayglobal+'</div>';
			let epayhtml = epayglobal;
		epayhtml = this.controls.tabs.container('epay', epayhtml, 'pluslists-layout' );
		// this.controls.tabs.hide('epay', !is.atleast.seller); // only sellers can activate payments and set keys
		
		
		
		// audit
			const tracking = this.tracking(); // returns a <table>
			const mobgirafe = '<span style="color:#DA9247;">This software is designed by Pascal Vanhove (c)2007-2027</span><img src="./themes/default/mobgirafe.png" style="width:200px;">'
			const auditdiv = '<table style="margin:1em auto;">'+'<tr><td>'+tracking+'<td></tr>'+'<tr><td>'+mobgirafe+'<td></tr>'+'</table>';
			const audit = this.controls.tabs.container('audit', auditdiv );
					
		
		// final packaging
					const topshade = '<div class="whitetopshader" style="height:50px; pointer-events:none;">'+'&nbsp;'+'</div>'; // .topnav see (*tn03*)
					const bottomshade = '<div class="whitebottomshader" style="height:50px; z-index:+10; pointer-events:none;">'+'&nbsp;'+'</div>'; // .bottomshade see (*tn04*)
				const combocontainers = '<div>'+account+display+colors+agendas+logins+comms+workcodes+epayhtml+audit+'</div>'; // do not invert <div> layout sequence!
				const scrollydiv = '<div style="overflow-y:scroll; overflow-x:clip; position:absolute; top:1px; bottom:0; width:100vw;">'+combocontainers+'</div>';
			const headers = '<div class="prefs-header">'+this.header()+'</div>';
			const tabcontainers = '<div class="prefs-settings" style="position:relative;">'+scrollydiv+topshade+bottomshade+'</div>';
		
		return '<div class="prefs-grid" style="height:100%; min-height:100%;">'+headers+tabcontainers+'</div>';
		
	},
	activate:function() {
		this.elements.collect(this.eids.wraps);
		this.controls.activate('C_backPREFS');
		this.wrapshide();
	},

	// handlers
	save: function() {
		if(!this.controls.validation()) return;
		this.busy(true);
		const names = { id:'id', 
			/* account */ name:'name', sector:'profsector', headline:'headline', color:'color', pattern:'pattern', acctag:'tag', note:'note', packageplan:'package', 
			/* display */ lang:'language', gender:'defaultGender', visitors:'visitorAlias', slicing:'timeSlice', stifont:'stiFontSize', pslicing:'phoneSlicing',
						gmt:'GMT', range:{cin:'rangeIn', out:'rangeOut'}, durations:{cin:'durationShortest',out:'durationLongest'}, dursteps:'durationSteps',
						before:'notbefore',
			/* agendas options*/ usestandbylist:'usestandbylist', overdays:'overdays',  usenotes:'usenotes', usetasks:'usetasks', usefiles:'usefiles', 
			/* xnames */ xnames_bcal:'bCalsName', xnames_ucal:'uCalsName', xnames_fcal:'fCalsName', 
			/* logins */ usechat:'usechat', granting: {granted:'granted', disallowed:'disallowed'},
			/* communications */ weburl:'weburl', email:'email', mobile:'smsSenderId', ccphone:'ccphone', sendsms:'sendSMSs', prefix:'phoneRegion',
			/* workcodes */ 
			/* ePayment */ usepay:'ePayActive', holder:'ePayBenefName', iban:'ePayBenefIBAN', bic:'ePayBenefBIC', paycokey:'ePayconiqKey'
							, ePayComputopId:'ePayComputopId', ePayComputopFish:'ePayComputopFish', ePayComputopHmac:'ePayComputopHmac', ePayWebActive:'ePayWebActive'
							, ePaySoftPayClientId:'ePaySoftPayClientId', ePaySoftPayClientSecret:'ePaySoftPayClientSecret', ePaySoftPayAppId:'ePaySoftPayAppId'
			};
		mobminder.app.post(this.controls, names, './post/account.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	quit: function() {
		if(this.callbacks.boffdone) this.callbacks.boffdone.cb();
	},
	remove: function() {
		let names = { id:'id' };
		mobminder.app.post(this.controls, names, './delete/account.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},	
	duplicate: function() {
		let names = { id:'id' };
		new M_duplacc(this.dS, { saved:new A_cb(this, this.duplicated)} );
	},
	onHPpair: function() { 		
		if(vbs) vlog('mobminder.js','C_backPREFS','onHPpair','');
		new M_iPairGoCrypto(this.dS, { paired:new A_cb(this, this.HPOSpaired), unpaired:new A_cb(this, this.HPOSunpaired) });
	},	
	
	// private
	tracking: function() {
		let tracking = this.dS.tracking();
		return tracking;
	},
	busy: function(on) {
		
	},
	wrapshide: function() { // shows or hide settings according to enabled functionalities
		if(this.controls.usenotes.value()|0) $(this.elements.noteccss).addClass('visible').show(); else $(this.elements.noteccss).removeClass('visible').hide();
		if(this.controls.usetasks.value()|0) $(this.elements.taskccss).addClass('visible').show(); else $(this.elements.taskccss).removeClass('visible').hide();
		if(this.controls.usechat.value()|0) $(this.elements.chatccss).addClass('visible').show(); else $(this.elements.chatccss).removeClass('visible').hide();
		if(this.controls.usefiles.value()|0) $(this.elements.fileccss).addClass('visible').show(); else $(this.elements.fileccss).removeClass('visible').hide();
		// if(this.controls.useproducts.value()|0) $(this.elements.prdctccss).addClass('visible').show(); else $(this.elements.prdctccss).removeClass('visible').hide();
		if(this.controls.xcals_fcal.hasany()) $(this.elements.fcals).addClass('visible').show(); else $(this.elements.fcals).removeClass('visible').hide();
		
		// if(this.controls.usenotes.value()|0) this.elements.noteccss.style.visibility = 'visible'; else this.elements.noteccss.style.visibility = 'hidden';
		// if(this.controls.usetasks.value()|0) this.elements.taskccss.style.visibility = 'visible'; else this.elements.taskccss.style.visibility = 'hidden';
		// if(this.controls.usechat.value()|0) this.elements.chatccss.style.visibility = 'visible'; else this.elements.chatccss.style.visibility = 'hidden';
		// if(this.controls.usefiles.value()|0) this.elements.fileccss.style.visibility = 'visible'; else this.elements.fileccss.style.visibility = 'hidden';
		// if(this.controls.xcals_fcal.hasany()) this.elements.fcals.style.visibility = 'visible'; else this.elements.fcals.style.visibility = 'hidden';
		
	},
	header: function() {
					let buttons = '<td style="width:1%; white-space:nowrap;">'+this.controls.cartouche.display()+'</td>';
					let duplicate = this.controls.duplicate ? '<td style="width:1%; padding-left:2em;">'+this.controls.duplicate.display()+'</td>':'';

					let level = C_XL.w(aLevel.name(mobminder.context.surfer.accessLevel));
					let surfer = '<h2>'+mobminder.context.surfer.name+':&nbsp;'+level+'</h2>';
					let left = '<td>'+surfer+'</td>';
					let right = '<td><h1 id="'+this.eids.wraps.h1+'">'+this.h1txt()+'</h1></td>';
				let header = '<table style="width:100%;" summary="preferences header"><tr>'+buttons+duplicate+left+right+'</tr></table>';

		let accid = '<div id="mob_acc_nmb" class="deltarea max f-lato mindertext" style="width:90%; text-align:center; font-weight:bold; bottom:-6px; left:0px; opacity:.4;">'+this.dS.id+'</div>';
			
			let divHeader = '<div style="padding:1em 0 2em 0;">'+header+'</div>';
			let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('back-prefs-tabs', {lefter:accid} )+'</div>'; // displays the interactive tabs headers
		let headerpack = '<div class="backprefs-header">'+divHeader+divTabs+'</div>';
		return headerpack;
	},
	h1txt: function() {
		let n = this.controls.name.value();
		let t = this.controls.acctag.value();
		let faw = this.dS.acctag(t,{css:'fa-13x'});
		// C_XL.w('preferences')
		let h1txt = faw+n+'&nbsp;'+symbol('setup','fa-13x','padding:0 2em 0 .7em;');
		return h1txt;
	},
	
	
	// callbacks
	saved: function(dSets, stream) {

		this.busy(false);
		let parts = stream.split('##');
		let echoes = parts.shift(); // first part
		let removed = parts.shift(); // second part
		if(removed=='key removed') return this.removed(); // the surfer has removed his own key from the "access" tab in backoffice preferences
		if(this.callbacks.cfgreload) this.callbacks.cfgreload.cb();
	},
	removed: function() { 
		C_dS_accesskey.del(this.dS.id);
		if(this.callbacks.cfgremoved) this.callbacks.cfgremoved.cb();
		this.busy(false);
	},
	duplicated: function(kid) { // kid is the new key id
		if(this.callbacks.cfgreload) this.callbacks.cfgreload.cb(kid);
		this.busy(false);
	},
	failed: function() {
		this.busy(false);
	},
	HPOSpaired: function() { // back from pairing this account with a payment terminal device
		
		// this.dS which points to mobminder.account has been updated by M_iPairGoCrypto::paired
		// let's refresh the display
		this.controls.ePayHardPayClientId.set(this.dS.ePayHardPayClientId);
		this.controls.ePayHardPayClientSecret.set(this.dS.ePayHardPayClientSecret);
		this.controls.ePayHardPayToken.set(this.dS.ePayHardPayToken);
		
		if(vbs) vlog('mobminder.js','C_backPREFS','HPOSpaired','Clientid: '+this.dS.ePayHardPayClientId);
	},	
	HPOSunpaired: function() { // back from un-pairing this account from a payment terminal device
		
		// this.dS which points to mobminder.account has been updated by M_iPairGoCrypto::paired
		// let's refresh the display
		this.controls.ePayHardPayClientId.set(this.dS.ePayHardPayClientId);
		this.controls.ePayHardPayClientSecret.set(this.dS.ePayHardPayClientSecret);
		this.controls.ePayHardPayToken.set(this.dS.ePayHardPayToken);
	
		if(vbs) vlog('mobminder.js','C_backPREFS','HPOSunpaired','Clientid: '+this.dS.ePayHardPayClientId);
	},
	
	// account name, color, pattern or tag adjsutement
	//
	oncolorselect: function(ccode) {
		// this.elements.h1.innerHTML = this.h1txt();
		if(1) vlog('modals.js', 'C_backPREFS', 'oncolorselect', 'ccode:'+ccode);
	},
	onpatternselect: function(pcode) {
		// this.elements.h1.innerHTML = this.h1txt();
		if(1) vlog('modals.js', 'C_backPREFS', 'onpatternselect', 'pcode:'+pcode);
	},
	ontagselect: function(tcode) {
		this.elements.h1.innerHTML = this.h1txt();
		if(1) vlog('modals.js', 'C_backPREFS', 'ontagselect', 'tcode:'+tcode);
	},
	nametyping: function(digits) {
		this.elements.h1.innerHTML = this.h1txt();
		if(1) vlog('modals.js', 'C_backPREFS', 'nametyping', 'digits:'+digits);
	},
	
	
	// agenda options activation
	onUseNotes: function(which) { this.wrapshide(); },
	onUseTasks: function() { this.wrapshide();	},
	onUseChats: function() { this.wrapshide();	},
	onUseFiles: function() { this.wrapshide();  },
	
	// custom css
	ccss: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','colors','ccss id:'+dataset.id);
		new M_CCSS(dataset, { saved:new A_cb(this, this.ccsssaved), removed:new A_cb(this, this.ccssremoved) });
	},
	ccsssaved: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','ccsssaved','resaClass:'+dataset.resaClass+', cssType:'+dataset.cssType);
		
		// this.controls.ccss[dataset.cssType][dataset.resaClass].refresh(); // PVH2025 it is now possible to take the ownership of Ctrl or Shift from a customCss of the same resaclass but not the same cssType.
		this.controls.ccss[ccsstype.color][dataset.resaClass].refresh(); // refreshing all three types of Ccss
		this.controls.ccss[ccsstype.pattern][dataset.resaClass].refresh();
		this.controls.ccss[ccsstype.tag][dataset.resaClass].refresh();
		
		// workcodes use ccss, they should be refreshed with new settings (case where the color/pattern of a workcode has been changed)
		if(dataset.resaClass==resaclass.appointment) { // new datasets for workcodes must be provided, see (*cs01*)
			this.controls.workcodes.refresh(); // this refreshes the list display under the workcodes tab
			this.controls.eworkcodes.refresh();
		}
		mobminder.sounds.done.play();
	},
	ccssremoved: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','ccssremoved','resaClass:'+dataset.resaClass+', cssType:'+dataset.cssType);
		this.controls.ccss[dataset.cssType][dataset.resaClass].refresh();
		
		if(dataset.cssType==ccsstype.color&&dataset.resaClass==class_resa_any) // a visitor color was removed
			this.controls.logins[aLevel.eresa].refresh(); // in case it was the eresaBlacklist color of a Web page, refresh the logins
			
		// workcodes use ccss, they should be refreshed with new settings (case where a color/pattern/tag for workcodes has been deleted)
		if(dataset.resaClass==resaclass.appointment) { // new datasets for workcodes must be provided, see (*cs01*)
			this.controls.workcodes.refresh(); // this refreshes the list display under the workcodes tab
			this.controls.eworkcodes.refresh();
		}
		
		// product use ccss for products, they should be refreshed with new settings (case where a color/pattern/tag for products has been deleted)
		if(dataset.resaClass==class_product) { 
			this.controls.products.refresh(); // this refreshes the list display under the products tab
			this.controls.eproducts.refresh();
		}
	},
	
	// group resources
	xcal: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','xcal','ccss id:'+dataset);
		new M_RESC(dataset, { saved:new A_cb(this, this.xcalsaved), deleted:new A_cb(this, this.xcaldeleted) }, { tab:0, parent:this });
	},
	xcalsaved: function(dataset) { // saved a C_dS_resource
		if(vbs) vlog('mobminder.js','C_backPREFS','xcalsaved','resourceType:'+dataset.resourceType);
		this.controls.xcals_bcal.refresh(); // refresh all three types because the plusmay depends on the number of each others
		this.controls.xcals_ucal.refresh(); 
		this.controls.xcals_fcal.refresh(); 
		this.controls.guidelines.refresh(); // refreshes the assignations <spans>, as the C_dS_resource might have got a new one, or none.
		mobminder.sounds.done.play();
	},
	xcaldeleted: function() {
		if(vbs) vlog('mobminder.js','C_backPREFS','xcaldeleted','');
		if(this.callbacks.cfgreload) this.callbacks.cfgreload.cb(); // complete reload of the agenda in this case.
	},
	onguideline: function(dataset) {
if(vbs) vlog('mobminder.js','C_backPREFS','onguideline','guideline id:'+dataset.id);
		new M_GDLNS(dataset, { saved:new A_cb(this, this.guidelinesaved), deleted:new A_cb(this, this.guidelinedeleted)  }, { tab:0 });
	},
	guidelinesaved: function workcodesaved(dataset) {
		this.controls.guidelines.refresh();
		if(vbs) vlog('mobminder.js','C_backPREFS','guidelinesaved','guideline:'+dataset.name);
		mobminder.sounds.done.play();
	},
	guidelinedeleted: function workcodedeleted(dataset) {
		this.controls.guidelines.refresh();
if(vbs) vlog('mobminder.js','C_backPREFS','guidelinedeleted','guideline:'+dataset.name);
	},
	
	// logins
	onlogin: function onlogin(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','onlogin','login id:'+dataset.id);
		new M_LOGIN(dataset, { saved:new A_cb(this, this.loginsaved), deleted:new A_cb(this, this.logindeleted), duplicate:new A_cb(this, this.loginduplicate, dataset)  }, { tab:0 });
	},
	loginsaved: function loginsaved(dataset) {
		for(let l in this.controls.logins.get) this.controls.logins[l].refresh(); // refresh all levels: some login may pass from one plus list to another, when changing the access level
		this.controls.granting.refresh();
		mobminder.sounds.done.play();
		if(vbs) vlog('mobminder.js','C_backPREFS','loginsaved','login:'+dataset.login);
	},
	logindeleted: function logindeleted(dataset) {
		this.controls.logins[dataset.accessLevel].refresh();
		this.controls.granting.refresh();
		if(vbs) vlog('mobminder.js','C_backPREFS','logindeleted','login:'+dataset.login);
	},
	loginduplicate: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','loginduplicate','loginduplicate:'+dataset.id);
		
		let login = dataset.lclone(); 
		// setTimeout(function(that, login) {
		new M_LOGIN(login, { saved:new A_cb(this, this.loginsaved), deleted:new A_cb(this, this.logindeleted)  }, { tab:0 });
		// }, 250, this, login); // delay should be at least the one specified here (*md03*)
	},
	
	
	// products
	onproduct: function onproduct(dataset) {
if(vbs) vlog('mobminder.js','C_backPREFS','onproduct','product id:'+dataset.id);
		new M_PRODUCT(dataset, { saved:new A_cb(this, this.productsaved), deleted:new A_cb(this, this.productdeleted), duplicate:new A_cb(this, this.productduplicate, dataset)  }, { tab:0 });
	},
	productsaved: function productsaved(dataset) {
		this.controls.products.refresh();
		this.controls.eproducts.refresh();
		this.controls.logins[aLevel.eresa].refresh();
		mobminder.sounds.done.play();
		if(vbs) vlog('mobminder.js','C_backPREFS','productsaved','product:'+dataset.name);
	},
	productdeleted: function productdeleted(dataset) {
		this.controls.products.refresh();
		this.controls.eproducts.refresh();
		// this.controls.logins[aLevel.eresa].refresh(); <= not yet, we give a chance to remove it still while working in this preferences session
if(vbs) vlog('mobminder.js','C_backPREFS','productdeleted','product:'+dataset.name);
	},
	productduplicate: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','productduplicate','productduplicate:'+dataset.id);
		
		let newds = dataset.wclone();
			newds.name = ''; // that leaves the field red as it mandatory and needs to be written with a different name
		new M_PRODUCT(newds, { saved:new A_cb(this, this.productsaved), deleted:new A_cb(this, this.productdeleted)  }, { tab:1 });
	},
	
	// workcodes
	onworkcode: function onworkcode(dataset) {
if(vbs) vlog('mobminder.js','C_backPREFS','onworkcode','workcode id:'+dataset.id);
		new M_WRKCD(dataset, { saved:new A_cb(this, this.workcodesaved), deleted:new A_cb(this, this.workcodedeleted), duplicate:new A_cb(this, this.workcodeduplicate, dataset)  }, { tab:0 });
	},
	workcodesaved: function workcodesaved(dataset) {
		this.controls.workcodes.refresh();
		this.controls.eworkcodes.refresh();
		this.controls.logins[aLevel.eresa].refresh();
		mobminder.sounds.done.play();
		if(vbs) vlog('mobminder.js','C_backPREFS','workcodesaved','workcode:'+dataset.name);
	},
	workcodedeleted: function workcodedeleted(dataset) {
		this.controls.workcodes.refresh();
		this.controls.eworkcodes.refresh();
		// this.controls.logins[aLevel.eresa].refresh(); <= not yet, we give a chance to remove it still while working in this preferences session
if(vbs) vlog('mobminder.js','C_backPREFS','workcodedeleted','workcode:'+dataset.name);
	},
	workcodeduplicate: function(dataset) {
		if(vbs) vlog('mobminder.js','C_backPREFS','workcodeduplicate','workcode id:'+dataset.id);
		
		let newds = dataset.wclone();
			newds.name = ''; // that leaves the field red as it mandatory and needs to be written with a different name
		// let that = this;
		// setTimeout(function(that, newds) {
		new M_WRKCD(newds, { saved:new A_cb(this, this.workcodesaved), deleted:new A_cb(this, this.workcodedeleted)  }, { tab:1 });
	},
	
	
	// timeboxes
	ontimebox: function ontimebox(dataset) {
if(vbs) vlog('mobminder.js','C_backPREFS','ontimebox','timebox id:'+dataset.id);
		new M_TBOXING(dataset, { saved:new A_cb(this, this.timeboxsaved), removed:new A_cb(this, this.timeboxdeleted)  }, { tab:0 });
	},
	timeboxsaved: function timeboxsaved(dataset) {
		this.controls.timeboxing.refresh();
		mobminder.sounds.done.play();
		if(vbs) vlog('mobminder.js','C_backPREFS','timeboxsaved','timebox:'+dataset.name);
	},
	timeboxdeleted: function timeboxdeleted(dataset) {
		this.controls.timeboxing.refresh();
if(vbs) vlog('mobminder.js','C_backPREFS','timeboxdeleted','timebox:'+dataset.name);
	},
	
	// templates
	onsms: function onsms(dataset) {
		new M_SMST(dataset, { saved:new A_cb(this, this.smssaved), removed:new A_cb(this, this.smsdeleted)  }, { tab:0 });
	},
	smssaved: function smssaved(dataset) { this.controls.smsplus.refresh();	mobminder.sounds.done.play(); },
	smsdeleted: function smsdeleted(dataset) { this.controls.smsplus.refresh();	},
	
	onemail: function onemail(dataset) {
		new M_EMLT(dataset, { saved:new A_cb(this, this.emailsaved), removed:new A_cb(this, this.emaildeleted)  }, { tab:0 });
	},
	emailsaved: function emailsaved(dataset) { this.controls.emlplus.refresh(); mobminder.sounds.done.play(); },
	emaildeleted: function emaildeleted(dataset) { this.controls.emlplus.refresh();	},
	
	onnotif: function onnotif(dataset) {
		new M_NOTIF_Template(dataset, { saved:new A_cb(this, this.notifsaved), removed:new A_cb(this, this.notifdeleted)  }, { tab:0 });
	},
	notifsaved: function notifsaved(dataset) { this.controls.notifplus.refresh(); mobminder.sounds.done.play();	},
	notifdeleted: function notifdeleted(dataset) { this.controls.notifplus.refresh();	}
	
}






function T_backoptions(eid,callbacks,preset) { // access to different backoffice options (preferences, visitors, stats,...)
	this.ctrlname = 'T_backoptions';
	this.eids = { picker:eid+'_pickr', trigger:eid+'_trg' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { tomenu:, screen: }
	this.state = T_backoptions.defaults.align(preset);
				const bullet = mobminder.account.abullet();
			const tiptitle = '<p style="white-space:nowrap;">'+bullet+'<span style="white-space:nowrap; font-weight:bold">&nbsp;'+mobminder.account.name+'</span></p>';
			const tiptext = '<p>'+mobminder.account.note.htmlize()+'</p>';
		const tip = tiptitle+tiptext;
		// let allowaccess = mobminder.context.surfer.accessLevel>aLevel.operator;
			
		const accountname = mobminder.account.acctag()+mobminder.account.name; 
		if(verboseOn) accountname+= '&nbsp;<span style="font-size:70%; color:blue">'+(is.small?'Small':'Large')+' '+(is.tactile?'Tactile':'Mouse')+'</span>';
	
				const pcode = mobminder.account.pattern;
				let pcss = ''; if(pcode) pcss = ' p'+pcode;
		const cogs = '<div class="fa fa-cogs fa-12x"></div>';
		const tbstyle = 'line-height:'+topbar.height+'; color:var(--main-text-color);';
	const trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:cogs, enabled:true, tip:tip, tag:'td', css:'std-button', style:tbstyle } );
		
	this.controls = new A_ct({trigger:trigger});
}
T_backoptions.defaults = new A_df({ open:false });
T_backoptions.prototype = {
	display: function() { // this is the trigger display (appears upper right in the top bar displaying account name)
		return this.controls.trigger.display();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('T_backoptions');
	},
	open: function() {
		
			const options = [], order = [];  // symbol() in mobframe.js, see (*sybl01*)
			if(permissions.may(pc.ac_sfind)) { options[screens.resafind] 	= C_XL.w('resa finder')			+symbol('search','fa-13x','','div'); 		order.push(screens.resafind); }
			if(permissions.may(pc.ac_visis)) { options[screens.visitors]	= C_XL.w('visitors register')	+symbol('visitors','fa-13x','','div'); 	order.push(screens.visitors); }
			if(permissions.may(pc.ac_stats)) { options[screens.statistics]	= C_XL.w('account statistics')	+symbol('stats','fa-13x','','div'); 		order.push(screens.statistics); }
			
			if(mobminder.account.usenotes||mobminder.account.usetasks||mobminder.account.usechat) 
				if(permissions.may(pc.ac_archv)) { options[screens.archives]	= C_backARCH.title()+symbol('archives','fa-13x','','div'); order.push(screens.archives);	}
			
			if(permissions.may(pc.ac_setup)) { options[screens.preferences]	= C_XL.w('account preferences')+symbol('setup','fa-13x','','div'); order.push(screens.preferences); }
			if(mobminder.context.surfer.accessLevel>=aLevel.seller) { 
				options[screens.connections] = C_XL.w('cnx monitoring')+symbol('connexions','fa-13x','','div'); order.push(screens.connections); 
			}
			
			if(mobminder.context.surfer.accessLevel>=aLevel.seller) { 
				options[screens.smsdash] = C_XL.w('sms monitoring')+symbol('smsmon','fa-13x','','div'); order.push(screens.smsdash); // (*sybl01*)
			}
			options[screens.elearning] = C_XL.w('elearning')+symbol('elearning','fa-13x','','div'); order.push(screens.elearning); // (*sybl01*)


		const picker = new C_iMENU(this.eids.picker, {onlabel:new A_cb(this,this.onbackoffice)}, { labels:options, order:order }, {} );
		
		const div = '<div style="display:inline-block; text-align:right; padding-right:1em; margin:1em 0 1em auto;">'+picker.display('backoptions')+'</div>';
		
			const timearea = '<div id="timearea2" class="f-lato" style="font-weight:bold;"></div>';
			const datearea = '<div id="datearea2" class="f-lato" style="font-weight:bold;"></div>';
		
		const flexdiv = '<div style="position:relative; text-align:right; min-height:200px;">'+timearea+datearea+div+'</div>';
		// this.callbacks.tomenu.cb(this, '<div>'+div+'</div>'); // this is the html we want to display on the falldown drawer
		this.callbacks.tomenu.cb(this, flexdiv, 'T_backoptions'); // this is the html we want to display on the falldown drawer
		picker.activate(); // this.callbacks.tomenu.cb() has added our html to the DOM, now we can activate it
		this.state.open = true;
	},
	close: function() {
		if(vbs) vlog('mobminder.js','T_backoptions', 'close', '');
		this.callbacks.tomenu.cb(this, false);
		this.state.open = false;
	},
	trigger: function() {
		if(this.state.open) this.close(); else this.open();
	},
	onbackoffice: function(screen) { 
		this.close();
		if(this.callbacks.screen) this.callbacks.screen.cb(screen|0);
	}
}



function T_logged(eid, callbacks, preset) { // Choose between logged in sessions, open more sessions or close
	this.ctrlname = 'T_logged';
	this.eids = { logged:eid+'_lggd', commands:eid+'_logcmds', trigger:eid+'_trig', login:eid+'_log', warning:eid+'_wrn' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { tomenu:; loginok:, cleared: }
	this.state = T_logged.defaults.align(preset);
	
	
		let warning = '<e id="'+this.eids.warning+'" style="width:0; height:0; font-size:80%; line-height:80%; color:red; text-shadow: 0px 0px 2px rgba(255,255,255,.5); position:absolute; right:-.3em; bottom:35%;">'+'</e>';
		let lname = '<div style="display:inline-block; position:relative;">'+mobminder.context.surfer.firstname+warning+'</div>';
		let surfer = '<div style="display:inline-block; padding:0 0 0 1em; line-height:2.2em; ">'+lname+'</div>';
		let bullet = mobminder.context.surfer.lbullet('tbar');
	this.loginname = bullet+surfer; // bullet
	
	let trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:this.loginname, tag:'td', style:'padding:0 1.5em; color:var(--main-text-color)' } );
	this.controls = new A_ct({trigger:trigger});
	this.state = { open:false }
	
	C_iTHREADS.polling.setcallback('accountslist', new A_cb(this, this.warning)); // register to the chat polling engine (*pe*)
}
T_logged.defaults = new A_df({ open:false, warning:0, warnings:false });
T_logged.prototype = {

	display: function() {
		
		
		// this.controls.trigger.set(this.loginname);
		return this.controls.trigger.display();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('T_logged');
	},
	open: function() { // the logged-in console opens up, showing access keys to other accounts and more logish options

		// the list of logged accounts
			const manylogged = C_dS_loggedIn.count()-1;
			const logged = C_dS_loggedIn.get();
			const loggedmenus = new A_ct();
					const availwidth = (C_iWIN.size.w-320 /*some room for the commands*/);
					const columns = (availwidth/310)|0;
				const maxcols = columns||1;
			let loggedtable = new Array();
		
		let options = {};
		for(let lid in logged) {
			const l = logged[lid];
			options = C_dS_accesskey.options( lid, { warnings:this.state.warnings, showLogin:true  } );
			const menu = new C_iMENU(this.eids.logged, { onlabel:new A_cb(this,this.switchto) }, options, { maxcols:maxcols, maxrows:5 } );
			loggedmenus.add1(menu,lid);
			const loggedname = manylogged?'<tr><td style="white-space:nowrap; padding-top:1em; padding-bottom:0.5em; font-weight:bold;">'+l.namefull+'&nbsp;:</td></tr>':'';
			const loggedaccounts = '<tr><td>'+menu.display()+'</td></tr>';
			loggedtable.push(loggedname); loggedtable.push(loggedaccounts);
		}
		const loggedtbl = '<table class="logged-menu" style="margin:0 auto;">'+loggedtable.join('')+'</table>';
		
		// add options to logout, log more, or logout all
			
			const sign = function(which) {
				let s = false;
				switch(which) {
					case 'closeall': 	s = 'power-off'; break;
					case 'logout': 		s = 'sign-out'; break;
					case 'login': 		s = 'sign-in'; break;
					case 'newacc': 		s = 'magic'; break;
					case 'link': 		s = 'sitemap'; break; // 'link'
				}
				const span = '<span style="padding-right:1em;" class="fa fa-11x fa-gray fa-'+s+'"></span>'
				return span;
			}
			
			const order = new Array(), labels = {};
			if(options.count) { labels['all'] = sign('closeall')+C_XL.w('logout all'); order.push('all'); }
				const login = mobminder.context.surfer.firstname+'&nbsp;'+mobminder.context.surfer.lastname;
			labels['current'] = sign('logout')+C_XL.w('logout current')+': '+login; order.push('current');
			labels['more'] = sign('login')+C_XL.w('more login'); order.push('more');
			labels['cronofy'] = sign('link')+C_XL.w('sync cronofy'); order.push('cronofy');
			if(mobminder.context.surfer.accessLevel>=aLevel.seller) { labels['new'] = sign('newacc')+C_XL.w('new account'); order.push('new'); };
			if(mobminder.context.surfer.accessLevel==aLevel.admin) 
				if(mobminder.context.surfer.id==7918) { 
					labels['webnew'] = '** Test wizard account'; order.push('webnew'); // testing wizard creation
			};
		const commands = new C_iMENU(this.eids.commands, { onlabel:new A_cb(this,this.onmenu) }, { count:order.length, order:order, labels:labels }, {} );	
	
			const headers = '<tr><th style="padding-top:1em;">'+(options.count?C_XL.w('switch to account'):'')+'</th><th style="padding-top:1em;">'+C_XL.w('sessions')+':</th></tr>';
				options = '<tr><td>'+loggedtbl+'</td><td style="padding-left:3em;">'+commands.display()+'</td></tr>';
			const paddy = '<tr><td style="height:1em;">'+'</td></tr>';
		const table = '<table class="logged-menu" style="margin:0 auto;">'+headers+options+paddy+'</table>';
		
		this.callbacks.tomenu.cb(this, table, 'T_logged'); // this is where we send the menu into the drawer area
		this.state.open = true;
			loggedmenus.activate();
			commands.activate();
	},
	close: function() { // this menu is programmatically closed at the upper level ( T_bar )
		if(vbs) vlog('mobminder.js','T_logged', 'close', '');
		this.callbacks.tomenu.cb(this, false);
		this.state.open = false;
	},
	
	// privates
	login: function() { // changes the display to a login/pass form
		this.close();
		setTimeout(() => { 
			new M_iLOGIN(this.eids.login, { loginok:new A_cb(this, this.loginok) }, {}); // which is an auto-close modal design
		}, 300 );
	},	
	trefresh: function() { // called after a plitems event
		if(vbs) vlog('mobminder.js','T_chats', 'trefresh', 'open:'+this.state.open);
		
		// let count = this.state.warning?'<e style="font-size:80%; color:red; text-shadow: 0px 0px 2px 2px rgba(255,255,255,.5); position:absolute; right:0.1em; bottom:-.15em;">'+this.state.warning+'</e>':'';
		// this.controls.trigger.set(this.loginname+' '+count);
		
		if(this.state.warning) this.elements.warning.innerHTML = this.state.warning; // writes in the <e> element a number of chats to be checked by user
	},
	
	// callbacks
	trigger: function() { // the trigger has been touched/clicked (trigger = heading label in Top menu bar)
		if(this.state.open) this.close(); else this.open();
	},
	switchto: function(selection) {
		if(vbs) vlog('mobminder.js','T_logged','switchto','selection='+selection); 
		this.close();
		if(this.callbacks.loginok) return this.callbacks.loginok.cb(selection);
	},
	onmenu: function(selection) {
		if(vbs) vlog('mobminder.js','T_logged','onmenu','selection='+selection); 
		switch(selection) {
			case 'more': return this.login(); break;
			case 'current': this.close(); this.checkout(mobminder.context.surfer.id); break; // closes only the currently active user's connection
			case 'all': this.close(); this.checkout(); break; // closes all current connection
			case 'cronofy': 
				this.close(); 
					let keyid = mobminder.context.keyId;
				window.open('./cronofy/welcome.php?k='+keyid, '_blank', 'location=false,height=700,width=1000,scrollbars=yes');
				break;
			case 'new':
				this.close();
				if(this.callbacks.loginok) return this.callbacks.loginok.cb(0 /*triggers new account creation*/);
				break;
			case 'webnew':
				this.close();
				if(this.callbacks.loginok) return this.callbacks.loginok.cb(-1 /*triggers new account creation*/);
				break;
		}
	},
	checkout: function(remove) {
		remove = remove || 0; // see (*co01*)
		let data = new C_iPASS({r:remove});
		new A_ps({data:data}, {data:{r:'r'}}, './queries/checkout.php', {onreply:new A_cb(this,this.checkedout), ontimeout:new A_cb(this,this.failed)} );
		
		mobminder.sounds.logoff.play();
	},
	warning: function(status) { // status is an array like [accId][chatId]=>physdelta
		let warnings = [];
		let summed = 0;
		for(let accid in status) {
			if(accid==mobminder.account.id) continue; // show only alerts in other logged accounts
			if(!(accid in warnings)) warnings[accid] = 0;
			for(let chid in status[accid])
				if(status[accid][chid]>0) { warnings[accid]++; summed++; }
		}
		if(vbs) vlog('mobminder.js','T_logged','warning','summed:'+summed); 
		this.state.warnings = warnings;
		
		if(this.state.warning!=summed) {
			if(summed > this.state.warning) mobminder.sounds.walle.play();
			this.state.warning = summed;
			this.trefresh(); // updates small red counters at the trigger side
			if(this.state.open) this.open(); // refresh the menu zone if currently displayed
		}
	},
	
	// handlers:
	checkedout: function(stream) {
		let key = stream.split('!').shift()|0; // which is a key
		if(vbs) vlog('mobminder.js','T_logged','checkedout','new key='+key); 
		if(key) if(this.callbacks.loginok) return this.callbacks.loginok.cb(key);
		if(this.callbacks.cleared) return this.callbacks.cleared.cb();
	},
	failed: function() {		
		this.controls.button.busy(false);
		return new C_iMSG(C_XL.w('connection failed'));
	},
	loginok: function(key) { // callback from valid login in T_login
		this.close();
		if(this.callbacks.loginok) this.callbacks.loginok.cb(key);
	}
}



function T_uneb(eid,callbacks,preset) { // specific for UNEB 
	this.ctrlname = 'T_uneb';
	this.eids = { picker:eid+'_pickr', trigger:eid+'_trg' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { tomenu:mandatory!, onuneb: }
	this.state = T_uneb.defaults.align(preset);
	
		let tip = '';
	let trigger = new C_iCLIK(this.eids.trigger, { click:new A_cb(this, this.trigger) }, { ui:this.state.caption, enabled:true, tip:tip, tag:'td' } );
	
	
	this.controls = new A_ct({trigger:trigger});
}
T_uneb.defaults = new A_df({ caption:'UNEB', open:false });
T_uneb.prototype = {
	display: function() {
		return this.controls.trigger.display();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('T_uneb');
	},
	open: function() {
		
				let dstyles = 'text-align:center; flex-grow:1; padding:1em;';
				let istyles = 'padding:.3em .2em; min-width:1.5em; text-align:center; flex-grow:1;';
				let iclasses = 'fa fa-gray fa-15x';
			let itrain 	= '<i style="'+istyles+'" class="'+iclasses+' fa-users-class"></i>';
			let ibuy 	= '<i style="'+istyles+'" class="'+iclasses+' fa-gift"></i>';

			let labels = { training:itrain+'Formations', advantages:ibuy+'Avantages' };
			let order = new Array(); for(let x in labels) order.push(x);
			let presets = {};
		let options = { order:order, labels:labels, presets:presets, count:2 }; 

		let picker = new C_iMENU(this.eids.picker, {onlabel:new A_cb(this,this.onuneb)}, options, {} );
		
			let bottom = '<div class="showred" style="clear:both"></div>';
			let logo = '<div style="float:left; padding-left:100px;" class="showgreen"><img src="./themes/logos/uneb.png" style="max-width:200px;"></div>';
		
		let div = '<div style="float:left; text-align:left; padding-left:2em;" class="showgreen">'+picker.display()+'</div>'+logo+bottom;
		
		this.callbacks.tomenu.cb(this, '<div>'+div+'</div>'); // this is the htlm we want to display on the falldown drawer
		picker.activate(); // this.callbacks.tomenu.cb() has added our html to the DOM, now we can activate it
		this.state.open = true;
	},
	close: function() {
		if(vbs) vlog('mobminder.js','T_uneb', 'close', '');
		this.callbacks.tomenu.cb(this, false);
		this.state.open = false;
	},
	trigger: function() {
		if(this.state.open) this.close(); else this.open();
	},
	onuneb: function(which) { 
		this.close();
		let href;
		switch(which) {
			case 'training': 	href = 'https://uneb.be/formations'; break;
			case 'advantages':	href = 'https://uneb.be/avantages'; break;
		}
		window.open(href,"_blank");
		if(this.callbacks.onuneb) this.callbacks.onuneb.cb(0);
	}
}



function T_agenda(eid,callbacks,preset) { // calendar large dropping drawer, and date navigation buttons  <<  <  date  >  >>
	// instanciated inside T_bar, when a new config is loaded
	const b = eid+'_';
	this.eids = { eid:eid, today:b+'today', backo:b+'accn', center:b+'center', uneb:b+'uneb'
		, notes:b+'notes', tasks:b+'tasks', chats:b+'chats', loggd:b+'logd'
		, deleted:{ barinfo:b+'del', barsep:b+'delsep', style:b+'delstyle' }
		, highlight:b+'high'
	};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { tomenu:, screen:, datechanged:, loginok:, cleared: }
	this.state = T_agenda.defaults.align(preset);
	
	// controls
	const today = new C_iDNAV.today(this.eids.today, { ontoday:this.callbacks.datechanged }); // C_iDNAV is defined in planning.js
	
	const backo = new T_backoptions(this.eids.backo, { tomenu:this.callbacks.tomenu, screen:this.callbacks.screen}, {} );
	const uneb = new T_uneb(this.eids.uneb, { tomenu:this.callbacks.tomenu }, {  } );
	
	
	const loggd = new T_logged(this.eids.loggd, { tomenu:this.callbacks.tomenu, loginok:this.callbacks.loginok, cleared:this.callbacks.cleared, screen:this.callbacks.screen }, {} );
	

	this.controls = new A_ct({today:today, loggd:loggd, backo:backo, uneb:uneb });
	
	if(!T_agenda.styling) {
		$('head').append('<style id="'+this.eids.deleted.style+'" type="text/css"></style>');
		T_agenda.styling = true;
	}
}
T_agenda.defaults = new A_df({ showdeleted:false });
T_agenda.styling = false;
T_agenda.prototype = {
	// public
	display: function() {
		
		
		const td_logged = this.controls.loggd.display(); // this displays only the name of the currently logged user
		let td_uneb = '';
		const td_backo = this.controls.backo.display(); // this displays only the name of the currently logged account
		
		if(mobminder.account.groupId==9361) {
			$('body').addClass('UNEB-skin'); 
			td_uneb = this.controls.uneb.display();
		} else { 
			$('body').removeClass('UNEB-skin');
		}
			
			
		// optional controls
		// let td_notes = ''; if(mobminder.account.usenotes) td_notes = this.controls.notes.display();
		// let td_tasks = ''; if(mobminder.account.usetasks) td_tasks = this.controls.tasks.display();
		// let td_chats = ''; if(mobminder.account.usechat) td_chats = this.controls.chats.display();
		
		// deleted stickers on screen
			const trashbin = '<div style="font-size:1.4em; display:inline-block;" class="fa fa-gray fa-trash"></div>';
		const td_delmode = '<td id="'+this.eids.deleted.barinfo+'" style="white-space:nowrap; padding:0 1.6em 0 .4em;">'+trashbin+'</td>';
		
		// let logCtrls = td_logged+td_notes+td_tasks+td_chats+td_backo+td_delmode;
		const logCtrls = td_logged+td_backo+td_delmode;
		
		// front bar layout:
		const left = td_uneb+this.controls.today.display('txt-usual');
			const colspan = is.small?6:1;

				const pcode = mobminder.account.pattern;
				let pcss = ''; if(pcode) pcss = ' p'+pcode;
			let inlinecss = '', blockcss = '';
				switch(pcode) {
					case 900: case 901: case 902: case 903: // see also (*mi01*)
					case 910: case 911: case 912: case 913: 
					case 820: case 821:
						inlinecss = pcss; // those iconic patterns appear hooked upper right by absolute positionning
						break; 
					default:
						blockcss = pcss; // those are background patterns, we apply them to the 100% block div 
				}	
			const highlight = '<span id="'+this.eids.highlight+'"class="top_highlight f-calibri-bold">'+'</span>';
			let accountname = mobminder.account.acctag()+mobminder.account.name; 
		if(verboseOn) accountname+= '&nbsp;<span style="font-size:70%; color:blue">'+(is.small?'Small':'Large')+' '+(is.tactile?'Tactile':'Mouse')+'</span>';
		accountname = '<div class="'+inlinecss+'" style="position:relative; display:inline-block; margin:0 auto; padding:0 2em; line-height:'+topbar.height+'; white-space:nowrap;">'+accountname+highlight+'</div>';
		accountname = '<div class="'+blockcss+'" style="text-align:center; ">'+accountname+'</div>';
		
		const center = '<td id="'+this.eids.center+'" colspan='+colspan+' style="width:99%;">'+accountname+'</td>'; // see this.cleanup()
		const right = logCtrls;
		
		let ctrls = '<tr>'+left+center+right+'</tr>';
			if(is.small) ctrls = '<tr>'+left+right+'</tr>'+'<tr>'+center+'</tr>'; // splits the top bar in two rows on very small screens
		const table = '<table style="width:calc(100vw - 10px); height:100%; margin: 0 auto 0 0;" class="T_agenda top-agenda">'+ctrls+'</table>';
		return table;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('T_agenda');
		this.showdeleted();
		new C_KEY([C_KEY.code.alpha.d+C_KEY.code.s.ctrl], new A_cb(this, this.ctrlD), 'T_agenda::'+this.eids.eid); // Deleted items
	},
	highlight(what) {
		if(what) {
			this.elements.highlight.innerHTML = what;
			$(this.elements.highlight).addClass('on');
		} else {
			$(this.elements.highlight).removeClass('on');
			setTimeout((th1s)=>{th1s.elements.highlight.innerHTML = '';}, 1000, this); // cleans up the place so it doesn't take space in the flux
		}
	},
	atrefresh: function() {
		if(this.controls.notes) this.controls.notes.nrefresh();
		if(this.controls.tasks) this.controls.tasks.trefresh();
	},
	logout: function() {
		return this.controls.loggd.checkout();
	},
	cleanup: function() { // this one is called when switching to another account or when full log-out occurs
		this.elements.center.innerHTML = '';
	},
		
	// private
	showdeleted: function() { // displays the little bin on top of the screen
		// console.log('T_agenda.showdeleted()',mobminder.app.hidedeleted);
		switch(mobminder.app.hidedeleted) {
			case false:
				$(this.elements.deleted.barinfo).show(); // enables indicator top right of screen, indicating that deleted items are displayed on the screen (plitems, visitors, ...)
				break;
			case true: 
				$(this.elements.deleted.barinfo).hide();
				break;
		}
		C_iTIP.handlers.quit();	
	},
	
	// callbacks
	ctrlD: function() { // toggles the binary value of mobminder.app.hidedeleted
		mobminder.app.hidedeleted = !mobminder.app.hidedeleted;
		mobminder.app.refresh({callserver:false});
		this.showdeleted();
		return false; // cancel propagation and hence, browser default behavior on this key
	}
}




// welcome srcreen clock

var formerweektext = ''; // see (*ta01*)
function timekeeper() { 
	let d = new Date();
	timetext = d.HHmm(0,''); // no seconds and no 0 prefill (02:35)
	$('#timearea').attr('time-before',timetext);
	$('#timearea2').html(timetext); $('#timearea2').attr('time-before',timetext);
	$('#timearea3').html(timetext); $('#timearea3').attr('time-before',timetext);
	
	// console.log(timetext);
	
		let l = device.language.mobcode;
		if(mobminder.context.surfer) l = mobminder.context.surfer.language;
	let weektext = C_XL.date(new Date(), {abreviation:'full', weekday:true, year:true, weeknumb:false}, l);
	$('#datearea').attr('time-before',weektext);
	$('#datearea2').html(weektext); $('#datearea2').attr('time-before',weektext);
	$('#datearea3').html(weektext); $('#datearea3').attr('time-before',weektext);
	
	let datechanged = formerweektext != weektext;
	if(datechanged) { let weekcss = mobminder.app.setweekcss(); console.log('setting body weekcss : '+weekcss); }
	formerweektext = weektext;
} 
setInterval(timekeeper, 999);



const topbar = { height:'2.2em' };

function T_bar(eid, callbacks, preset) { // one instance when client session opens up
	this.ctrlname = 'T_bar';
	this.eids = { eid:eid, inset:eid+'_inset', outset:eid+'_outset', front:eid+'_front', menu:eid+'_menu', login:eid+'login', agtop:eid+'_agtop', coloreference:eid+'cref' };
	this.elements = new A_el(); 
	
	this.menu = new A_cb(this, this.inmenu); // tomenu callback
	
	this.controls = new A_ct({agtop:false}); // agtop is a T_agenda instanciated from this.agendatop()
	this.callbacks = callbacks || {}; // { configonload:, configloaded: , setdate: , screen: , skipdate: }
	this.state = { activemenu:false, previouscss:'' };
	this.keys = { escape:new A_cb(this, this.escape), gotoprefs: new A_cb(this, this.gotoprefs)
		, gotofind: new A_cb(this, this.gotofind), gotoarchives: new A_cb(this, this.gotoarchives) }; // note that assigned keyboard keys are cleaned up when the modal does quit, see (*md01*)
}
T_bar.prototype = {
	// public
	display: function() {
		// note that when this function is called, mobminder.account is still false (later it points to the active account)
	
			// front is the always visible agenda top bar displaying account name and logged-in user name
			const front = '<div id="'+this.eids.front+'" class="top-front" style="height:'+topbar.height+'; padding:0;">'+'</div>'; 
				
			// outset is the console that opens to show chats/tasks/notes lists
				const menu = '<div id="'+this.eids.menu+'" class="top-shape top-menu top-inset" style="padding:0;">'+'</div>';
				const outstyle = 'display:none; z-index:200; position:absolute; top:'+topbar.height+'; right:0; left:0; max-height:90%; overflow-y:auto; overflow-x:clip;';
			const outset = '<div id="'+this.eids.outset+'" class="T_bar top-shape top-outset" style="'+outstyle+'">'+menu+'</div>'; // creates a layer z-index 10
		return front+outset;
	},
	activate: function() {
		// note that when this function is called, mobminder.account is still false (later it points to the active account)

		this.elements.collect(this.eids);
		new C_KEY(C_KEY.code.s.escape, this.keys.escape, 'T_bar::'+this.eids.eid); // closes any open menu in the T_bar (under login name and under account name).
		new C_KEY([C_KEY.code.s.ctrl+C_KEY.code.alpha.e], this.keys.gotoprefs, 'T_bar::'+this.eids.eid+'_CtrlE');
		// new C_KEY([C_KEY.code.s.ctrl+C_KEY.code.alpha.g], this.keys.gotofind, 'T_bar::'+this.eids.eid+'_CtrlG');
		// new C_KEY([C_KEY.code.s.ctrl+C_KEY.code.alpha.a], this.keys.gotoarchives, 'T_bar::'+this.eids.eid+'_CtrlA');
		// let t = this; $(this.elements.inset).mousedown(function() { t.escape()}); // click on screen layer
		
		return this;
	},
	login: function(key) { // this is only on the very welcome screen, when opening extra sessions, the login control opens in the menu drawer
		if(key) return this.loginok(key); // current login from the session
		setTimeout( () => {	
			new M_iLOGIN(this.eids.login, { loginok:new A_cb(this, this.loginok) }, { mode:'welcome', css:{ modalcss:'airy' } }); // which is an auto-close design
		}, 2000);
	},
	logout: function() {
		this.escape(); // so if the menu was open at the logout moment, it closes
		if(this.controls.agtop) { // if you are not logged, than there is nothing to do
			this.controls.agtop.logout(); // .agtop is an instance of T_agenda that is created during execution of this.agendatop()
			this.controls.agtop = false; // PVH2024 added this to avoid double logout that we observed chatdog and watchdog are calling at the same time
		}
	},
	agendatop: function() { // called when a new config is downloaded OR when the account is saved
		
		this.state.activemenu = false;
		this.controls.agtop = new T_agenda(this.eids.agtop, { tomenu:this.menu, datechanged:this.callbacks.datechanged, screen:this.callbacks.screen, loginok:new A_cb(this, this.loginok), cleared:new A_cb(this, this.cleared)  } );

			const ccss = mobminder.account.color ? ' account-color c'+mobminder.account.color : ''; // see (*tf10*)
			const coloref = '<div id="'+this.eids.coloreference+'" class="'+ccss+'" style="height:'+topbar.height+'; width:12px; position:absolute; top:0; left:0; padding:0; display;none;">'+'</div>';		
			// const coloref = '';		
		this.elements.front.innerHTML = this.controls.agtop.display()+coloref;
		this.controls.agtop.activate();
		this.elements.collect(this.eids); // this.eids.coloreference was just dropped in the DOM
				
				// remove anything that looks like c### (which are our colour tags)
		$(this.elements.front).removeClass( function(index, className) { return (className.match (/c[0-9][0-9][0-9]?[0-9]?/g) || []).join(' '); } ); // removes anything like c153, those are defined here (*md04*)
		$(this.elements.front).addClass(ccss);
		
		
		setTimeout(() => { // gives the DOM some time to load the account config.
			$(this.elements.front).addClass('loggedin'); // allows animation, see  see (*tf01*)
			
			const base = getComputedStyle(this.elements.coloreference).backgroundColor;
			let finalbase = base, isgray = true;
			switch(mobminder.account.color) { // only the gray colors are in scope here
				case 124: finalbase = 'rgb(255, 0, 0)'; break; // the darkest below in the column of brown shades
				case 111: finalbase = 'rgb(149, 179, 215)'; break; // the darkest above in the column of grey shades
				case 90: finalbase = 'rgb(181, 208, 136)'; break;
				case 91: finalbase = 'rgb(0, 255, 0)'; break;
				case 97: finalbase = 'rgb(0, 0, 255)'; break;
				case 98: finalbase = 'rgb(187, 230, 255)'; break;
				case 99: finalbase = 'rgb(204, 193, 217)'; break;
				default: isgray = false;
			}
			
			if(isgray) $('#body').addClass('gray'); else $('#body').removeClass('gray');
			document.documentElement.style.setProperty('--account-color-code', finalbase); /* see (*tf02*) */
			// console.log('T_bar agendatop() isgray '+isgray+' - base '+base+' - finalbase '+finalbase);
		}, 500);
		
	},
	hide: function() { $(this.elements.front).hide(); }, 
	show: function() { $(this.elements.front).show(); },
	plitems: function() {
		if(this.controls.agtop) this.controls.agtop.atrefresh(); // this.controls.agtop is a T_agenda
	},
	showdeleted: function() {
		this.controls.agtop.ctrlD(); // which is a T_agenda
	},
	highlight: function(what) {
		if(this.controls.agtop) this.controls.agtop.highlight(what);
	},
	monitorXM: function(active, commid, from) { // called from A_ps in mobframe.js, to display an indication that some communication is busy with mobminder server
		if(!this.elements.coloreference) return this;
		// console.log('T_bar::monitorXM() active:'+active+', commid:'+commid+', from:'+from);
		$(this.elements.coloreference).removeClass('on'); 
		if(active) $(this.elements.coloreference).addClass('on'); // comes above this other class see (*tf10*)
		return this;
	},
	
	// private

	// callbacks
	loginok: function(k) { // launches a config fetch to the server
		$(this.elements.front).removeClass('loggedin'); 
		if(this.controls.agtop) this.controls.agtop.cleanup();
		if(k==-1) this.quickaccount(); 
		else {
			const key = new C_iPASS({baseline:mobminder.app.baseline, key:k}); // passes the key of the config that should be loaded (*40*)
			mobminder.app.post({key:key}, {key:{baseline:'b', key:'k'}}, './queries/config.php', new A_cb(this,this.configloaded), new A_cb(this,this.failed));
		}
		if(this.callbacks.configonload) this.callbacks.configonload.cb(k);
		mobminder.sounds.popup.play();
	},
	quickaccount: function() { // aimed for testing the newacc.php that is normaly called from the Wizard.com
		const data = new C_iPASS({ // values posted
			  name:'WebAccountTest', language:'1', phoneRegion:'32', timeSlice:'4', sendSMSs:'1', sector:'101', timeZone:'1.00'
			, gender:3, firstname:'Olivier', lastname:'Maghe', country:'Belgique', email:'pascal@mobminder.com', mobile:'0497401626'
			, agendaCount:1, packagePlan:8, promoCode:''
			, agendaName0:'Cabinet'
				, a0dc1x:'1', a0dc1am:'10', a0dc1pm:'17'
				, a0dc2x:'1', a0dc2am:'10', a0dc2pm:'17'
				, a0dc3x:'1', a0dc3am:'11', a0dc3pm:'18'
				, a0dc4x:'1', a0dc4am:'12', a0dc4pm:'19'
				, a0dc5x:'1', a0dc5am:'9', a0dc5pm:'17'
				, a0dc6x:'0', a0dc6am:'9', a0dc6pm:'18'
				, a0dc7x:'0', a0dc7am:'9', a0dc7pm:'18'			
			, agendaName1:'Ortho'
				, a1dc1x:'0', a1dc1am:'10', a1dc1pm:'18'
				, a1dc2x:'1', a1dc2am:'10', a1dc2pm:'18'
				, a1dc3x:'1', a1dc3am:'10', a1dc3pm:'19'
				, a1dc4x:'1', a1dc4am:'10', a1dc4pm:'18'
				, a1dc5x:'1', a1dc5am:'9', a1dc5pm:'17'
				, a1dc6x:'1', a1dc6am:'10', a1dc6pm:'18'
				, a1dc7x:'0', a1dc7am:'10', a1dc7pm:'18'
		}); 
		const names = { // names posted
			  name:'name', language:'language', phoneRegion:'phoneRegion', timeSlice:'timeSlice', sendSMSs:'sendSMSs', sector:'sector', timeZone:'timeZone'
			, gender:'gender', firstname:'firstname', lastname:'lastname', country:'country', email:'email', mobile:'mobile'
			, agendaCount:'agendaCount', packagePlan:'packagePlan', promoCode:'promoCode'
			, agendaName0:'agendaName-0'
				, a0dc1x:'a0dc1x', a0dc1am:'a0dc1am', a0dc1pm:'a0dc1pm'
				, a0dc2x:'a0dc2x', a0dc2am:'a0dc2am', a0dc2pm:'a0dc2pm'
				, a0dc3x:'a0dc3x', a0dc3am:'a0dc3am', a0dc3pm:'a0dc3pm'
				, a0dc4x:'a0dc4x', a0dc4am:'a0dc4am', a0dc4pm:'a0dc4pm'
				, a0dc5x:'a0dc5x', a0dc5am:'a0dc5am', a0dc5pm:'a0dc5pm'
				, a0dc6x:'a0dc6x', a0dc6am:'a0dc6am', a0dc6pm:'a0dc6pm'
				, a0dc7x:'a0dc7x', a0dc7am:'a0dc7am', a0dc7pm:'a0dc7pm'			
			, agendaName1:'agendaName-1'
				, a1dc1x:'a1dc1x', a1dc1am:'a1dc1am', a1dc1pm:'a1dc1pm'
				, a1dc2x:'a1dc2x', a1dc2am:'a1dc2am', a1dc2pm:'a1dc2pm'
				, a1dc3x:'a1dc3x', a1dc3am:'a1dc3am', a1dc3pm:'a1dc3pm'
				, a1dc4x:'a1dc4x', a1dc4am:'a1dc4am', a1dc4pm:'a1dc4pm'
				, a1dc5x:'a1dc5x', a1dc5am:'a1dc5am', a1dc5pm:'a1dc5pm'
				, a1dc6x:'a1dc6x', a1dc6am:'a1dc6am', a1dc6pm:'a1dc6pm'
				, a1dc7x:'a1dc7x', a1dc7am:'a1dc7am', a1dc7pm:'a1dc7pm'
		}; 
		mobminder.app.post({data:data}, {data:names}, './post/newacc.php', new A_cb(this,this.quickok), new A_cb(this,this.failed));
	},
	configloaded:function() { // new account config received
		if(this.callbacks.configloaded) this.callbacks.configloaded.cb();
		this.agendatop();
		
			const dS_login = mobminder.context.surfer;
			const cok = !!dS_login.taycan; // see (*cr13*)
			const alevel = mobminder.context.surfer.is.atleast.operator; if(!alevel) return this; // excludes machines or web pages
			if(cok) return this; // creds are strong enough (so far)
			setTimeout( () => { new M_iSECURITY(dS_login, { onChoice:new A_cb(this, this.onSecurity) }, { } ); }, 1000 );
	},
	cleared:function() { // everybody logged out
		C_Agendadog.polling.stop();
		$(this.elements.front).removeClass('loggedin');
		this.state.activemenu = false;
		this.elements.front.innerHTML = '';
		if(mobminder.account) mobminder.account.macroflush();
		mobminder.app.clear(); // clears the screen
		mobminder.context = { surfer:{name:'doe', id:'1', language:device.language.mobcode, soundsVolume:3 } }; // check (*ck*), that is the minimal needed to be able to use C_XL.w when no surfer is logged
		this.login(); // invite user to log in again
	},

	inmenu: function(ctrl, html, css) {  // tomenu callback: inserts html in DOM (arriving from active menu) in the menu area of this Top Bar
		css = css || '';
		if(html) // subcontrols that need to display in the menu area must pass through this function, that re-sizes the screen
			if(ctrl!=this.state.activemenu) // replace the active menu pointer
				if(this.state.activemenu) this.state.activemenu.close(); // (*b01*)
	
		this.state.activemenu = html?ctrl:false; // keeps track of what control called, so you can close it if chosen again (*b01*)
		if(this.elements.menu) this.elements.menu.innerHTML = html||'';
		
		if(this.state.previouscss!=css) {
			$(this.elements.outset).removeClass(this.state.previouscss);
			$(this.elements.outset).addClass(css);
			this.state.previouscss=css;
		}
		
		$(this.elements.menu).removeClass('open'); if(this.state.activemenu) $(this.elements.menu).addClass('open');
		if(this.state.activemenu) $(this.elements.outset).show(); else $(this.elements.outset).hide(); 
		if(vbs) vlog('mobminder.js','T_bar','inmenu','activemenu:'+(this.state.activemenu?this.state.activemenu.ctrlname:'none')+', html:'+(html?'yes':'none'));
	},

	// events handling
	onSecurity: function(which) {
		if(which==1) { // see (*cr02*)
			const dS_login = mobminder.context.surfer;
			setTimeout( () => new M_LOGIN(dS_login, { saved:false }, { tab:8, maysave:true, reduced:true }), 100 ); // maysave forces save capability while maybe this login does not hav the permissions.may(pc.ch_logins) to change logins
		}
	},
	
	// handling keyboard keys
	escape: function() {
		$(this.elements.inset).removeClass('open');
		if(vbs) vlog('mobminder.js','T_bar','escape','activemenu:'+(this.state.activemenu?this.state.activemenu.ctrlname:'none'));		
		if(this.state.activemenu) this.state.activemenu.close();
		return false;
	},	
	gotoprefs: function() {
		this.escape(); // let's start with closing the menu in case it was open
		if(this.controls.agtop) if(this.callbacks.screen) this.callbacks.screen.cb(screens.preferences);
		return false;
	},
	gotofind: function() {
		this.escape(); // let's start with closing the menu in case it was open
		if(this.controls.agtop) if(this.callbacks.screen) this.callbacks.screen.cb(screens.resafind);
		return false;
	},
	gotoarchives: function() {
		this.escape(); // let's start with closing the menu in case it was open
		if(this.controls.agtop) if(this.callbacks.screen) this.callbacks.screen.cb(screens.archives);
		return false;
	},
	
	// ajax feedback
	failed: function() {		
		this.controls.button.busy(false);
		return new C_iMSG(C_XL.d('connection failed'));
	},
	quickok: function(dS, stream) { // an account has been created, linked to the web wizard admin
		// stream example:
		//
		// misc info 		<= some comment and debug info here
		// @@10317			<= the account key for the admin
		// ##		<= before: used from app, after: used by wizard.com
		// e=0				<= any error occured at wizard side
		// a=Olivier7		<= login
		// b=2266			<= password
		let parts = stream.split('##').shift().split('@@'); 
		let debugs = parts[0];
		let data = parts[1];
		let key = data.split(newline).shift();
		let keyint = key|0; 
		if(keyint==0) return; // there was a problem at server side
		this.loginok(keyint);
	}
	
}

//////////////////////////////////////////////////////////////////////////////////////////////
//
//   M O B     M I N D E R     A P P     S T A R T E R   
//
//   (ajax, login, config load, backoffice screens, main screen layout)
//


function C_iMOB(baseline, key, screen, vdigits, phoneregion) { // created from index.php, sets up the T_bar (top bar) and the default screen

	mobminder.app = this;
	mobminder.app.phoneregion = phoneregion;
	mobminder.app.dp = false;
	mobminder.app.hidedeleted = true; 
	
	mobminder.app.setdate = false;  // see (*mb02*) in C_iDNAV from planning.js
		// usage: mobminder.app.setdate.cb(jsdate); calling this function with undefined jsdate turns back the calendar to today date
		// if you want to refresh the planning only, without changing the displayed date, use mobminder.app.refresh();
		
	mobminder.app.resourcescope = false; // // see (*mb03*) in P_horiz
	
	this.baseline = baseline;
	
		this.screen = screen || screens.search;
		this.vdigits = vdigits || false;
	const e = 'imob_';
	this.eids = { body:'body', top:e+'top', desk:e+'desk', boff:e+'boff', mobminder:e+'mobminder'
		, clock:e+'logolayer', overlay:'mainoverlay', mainbusy:e+'mainbusy', ftf:'flyingtf', activity:e+'activ' // flyingtf and body must stay untouched because referred like this in the css
		, timearea:e+'timearea', datearea:e+'datearea'  };
	this.elements = new A_el();
	this.elements.collect({ body:'body' });
	this.state = new A_df(C_iMOB.defaults.align());
	
	
	const clock = new C_iCLOCK.display('logo'); // see (*cl01*)

	this.handlers = { resasaved:new A_cb(this, this.resasaved), screen:new A_cb(this, this.mobscreen), plitems:new A_cb(this, this.plitems), rescsaved:new A_cb(this, this.rescsaved) , rescdeleted:new A_cb(this, this.rescdeleted) };
	
		const topevents = { configonload:new A_cb(this, this.configonload), configloaded:new A_cb(this, this.configloaded), datechanged:new A_cb(this, this.mobdate), screen:this.handlers.screen };
		const top = new T_bar(this.eids.top, topevents, {});
	this.controls = new A_ct({top:top, clock:clock, agenda:false, office:false });
		
		const ergomode = is.tactile ? 'touch' : 'mouse';
		const devicesize = is.small ? 'small-device' : 'large-device';
		const os = device.OS=='Mac8' ? 'mac8' : '';
	$(this.elements.body).addClass(ergomode).addClass(devicesize).addClass(os).noContext();
	
	this.display();
	this.activate(key);
	
		const pace = this.state.moverlaydelay; // bewteen two calls to ontick:this.screenwaiter, see (*css10*)
		const timer = this.state.moverlaydelay; // before first call to ontick:this.screenwaiter, 
	this.timer = new C_iCLOCK(this.eids.activity, { ontick:new A_cb(this, this.screenwaiter) }, { pace:pace, timer:timer, unregisterable:false } ); // (*sw*)
	// C_iCLOCK class is defined in planning.js and has two modules: 
	// - the first one is a ticking clock with custom pace, with hold and replay functions
	// - the second one displays the vectorial and html version of our logo and brand mobminder.
	
		const timearea = '<div id="timearea" class="f-lato" style="font-weight:bold; display:none;"></div>';
		const datearea = '<div id="datearea" class="f-lato" style="font-weight:bold; display:none;"></div>';
	$('#body').append(timearea+datearea);
	timekeeper(); // see (*ta01*)
	$('#timearea').show();
	$('#datearea').show();
}
C_iMOB.defaults = new A_df({ moverlayed:false, moverlaydelay:3600, duplicate:false, cutmode:false, asleep:false }); // 3000 is 50 minutes, see (*css10*)
C_iMOB.prototype = {
	display: function() {
		const top = this.controls.top.display();
			const style = 'display:none; position:absolute; bottom:0; top:'+topbar.height+'; left:0; right:0;'; // border:4px solid red; 
		const desk = '<div id="'+this.eids.desk+'" class="C_iMOB" style="'+style+'">'+'</div>';
		const boff = '<div id="'+this.eids.boff+'" class="C_iMOB" style="'+style+'">'+'</div>';
		// let boff = '<div id="'+this.eids.boff+'" class="C_iMOB" style="'+style+' overflow:auto;">'+'</div>';
				const emsize = 4;
			const clock = this.controls.clock.html(emsize);  // (*css02*)
			const clkstyle = '';
		const clkwrap = '<div class="glassy-mobminder-logo-clock" id="'+this.eids.clock+'" style="'+clkstyle+'">'+clock+'</div>'; 
		
		
			const timearea = '<div id="timearea3" class="f-lato" style="font-weight:bold;"></div>';
			const timestyle = '';
		const timewrap = '<div class="glassy-mobminder-logo-time" id="'+this.eids.timearea+'" style="'+timestyle+'">'+timearea+'</div>';  // css see here (*css06*)
			
			const datearea = '<div id="datearea3" class="f-lato" style="font-weight:bold;"></div>';
			const datestyle = '';
		const datewrap = '<div class="glassy-mobminder-logo-date" id="'+this.eids.datearea+'" style="'+datestyle+'">'+datearea+'</div>';  // css see here (*css06*)

			const mobminder = '<img src="./themes/default/2025mobtextonly.png" alt="mobminder" width="400px">';  // (*css02*)
			const mobstyle = ' ';
		const mobwrap = '<div class="glassy-mobminder-logo-text" id="'+this.eids.mobminder+'" style="'+mobstyle+'">'+mobminder+'</div>';  // css see here (*css06*)
		
			const mainbusystyle = '';
		const mainbusy = '<div class="mainbusy" id="'+this.eids.mainbusy+'" style="'+mainbusystyle+'">'+clkwrap+mobwrap+datewrap+timewrap+'</div>'; // mainbusy animation, see (*css02*)
		
		const mainoverlay = ''; // '<div id="'+this.eids.overlay+'" class="mainoverlay on"></div>'; too much GPU processing, let's wait for a few years
		
		const flyingtimeflag = '<div class="" id="'+this.eids.ftf+'"></div>'; // #flyingtf in controls.css
		this.elements.body.innerHTML = top+desk+boff+mainoverlay+mainbusy+flyingtimeflag;
	},
	activate: function(key) {
		this.elements.collect(this.eids);
		this.controls.activate()
		this.controls.top.login(key);
		this.clear().setweekcss();
	},
	setweekcss: function() {
		if(vbs) vlog('mobminder.js','C_iMOB','setweekcss',''); 
			const date = new Date(); const week = date.getWeekNumber(); // is an object like { y:yyyy, wn:weeknumber }
		const weeknbr = 'w-'+(2-week.y%2)+'-'+week.wn; // see (*bd01*)
		$(this.elements.body).addClass(weeknbr);
		return weeknbr;
	},
	configonload: function(key) { // config will be fetched from server
		if(vbs) vlog('mobminder.js','C_iMOB','configonload','new key:'+key);
		this.mobminderlogo(true,'configonload');
		this.elements.desk.innerHTML = '';
		if(mobminder.account) mobminder.account.macroflush();
		ntmems.flush('plitems');
		cmems.flush('chitems');

		C_iCLOCK.reset(); // un-registers all clients of the Clock service
	},
	configloaded: function() { // config has been received from the server
		if(vbs) vlog('mobminder.js','C_iMOB','configloaded','account:'+mobminder.account.name); 
		document.title = mobminder.account.name+' - '+mobminder.context.surfer.firstname;
		window.name = 'mobminder';
		C_Agendadog.reset(); // see (*wd01*)
		const agenda = new C_iPLAN(this.handlers);
		
		this.elements.desk.innerHTML = agenda.display();
		
		this.controls.add1(agenda, 'agenda');
		this.controls.activate('C_iMOB::configloaded()');
			let screen = screens.search;
			let rscid = 0;
		if(is.small) {
			screen = screens.list;
			rscid = C_dS_resource.ids()[0];
		}
		this.mobscreen(screen, rscid);
		C_iTHREADS.reset(); // (*pe*) un-registers chats from polling engine. This line may not move to configonload (why? to be investigated...)
		$('#timearea').hide(); $('#datearea').hide();
		$(this.elements.body).removeClass('cleared');
		const t = this; setTimeout(function() { t.mobminderlogo(false,'configloaded'); }, 1000);
	},
	clear: function() { // when quitting all logins, you pass by here
		if(vbs) vlog('mobminder.js','C_iMOB','clear',''); 
		document.title = 'mobminder';
		
		$(this.elements.body).addClass('cleared');
		$(this.elements.desk).hide();
		$(this.elements.boff).hide();
		
		C_iTHREADS.reset(); // (*pe*)
		$('#timearea').show(); $('#datearea').show();
		
		// this.mobminderlogo(true,'clear');
		// const t = this; setTimeout(function() { t.mobminderlogo(false,'clear'); }, 3000); // just after login, an html mobminder logo appears on the screen
		return this;
	},
	
	
	// private about mobminder logo overlay display and animation, see css here (*ov01*)
	//
	wakeup: function(from) { // // removes mobminder logo overlay from screen
		if(this.timer) this.timer.replay();
		if(this.state.moverlayed === false) return this; // avoiding ribbons
		const fromsneaking = this.state.moverlayed.sneaking; 
		
		// console.log('       >> wakeup() fromsneaking:'+(fromsneaking?'SNEAKY':'NOPE')+' moverlayed:',this.state.moverlayed,' ',from);
		
		// $(this.elements.mainbusy).removeClass('on').removeClass('smooth').addClass('off'); // .addClass('off')
		$(this.elements.mainbusy).addClass('on').addClass('off').removeClass('smooth'); // .addClass('off')
		// $(this.elements.overlay).addClass('on').removeClass('smooth');
		
			// const activityEvents = 'pointerdown keydown wheel focus';
		// $(document.body).off(activityEvents + '.busy'); $(document.body).unbind('mouseover');
		
			setTimeout(() => { $(this.elements.mainbusy).removeClass('on').removeClass('off'); },1200); // (*ov02*)
			// setTimeout(() => { $(this.elements.mainbusy).removeClass('off'); },1210); // (*ov02*)
			
		if(fromsneaking) {
		} 
		// setTimeout(() => { $(this.elements.overlay).removeClass('on'); },100); // (*ov02*)
		this.state.moverlayed = false;
		return this;
	},
	sleep: function(o = {sneaking:false}) { // engage mobminder logo overlay
	
		if(this.state.moverlayed) return this; // avoiding ribbons
		
		// console.log('<< sleep() sneaking:'+(o.sneaking?'SNEAKY':'NOPE')+' moverlayed:'+this.state.moverlayed); 
		
		$(this.elements.mainbusy).removeClass('on').removeClass('off').removeClass('smooth');
		// $(this.elements.overlay).removeClass('on').removeClass('smooth');
		
		if(o.sneaking) { // sneaking means it goes away on mouse over, the css makes it also suck that the animation is much slower
			const t = this; 
			// const activityEvents = 'pointerdown keydown wheel focus';
			$(this.elements.mainbusy).addClass('smooth'); // appears slowly
			// $(this.elements.overlay).addClass('smooth'); // appears slowly
			$(document.body).unbind('mouseover');
			// $(document.body).off(activityEvents + '.busy'); // removed because it fires sometime even if the user did not touch the mouse nor keyboard...
			
			$(document.body).mouseover(function() { t.wakeup('from mouseover()'); });
			// $(document.body).on(activityEvents + '.busy', function () { t.wakeup('from activityEvents()'); });
		}
		// else it is pop-up mode
		this.state.moverlayed = o; // keeps an indication of the trigger was from screenwaiter();
		const respectsneaky = o.sneaking ? 2000 : 10;
		setTimeout(() => { 
			$(this.elements.mainbusy).addClass('on'); 
			// $(this.elements.overlay).addClass('on'); 
		}, respectsneaky); // this happens right next to a hand shake with the DOM
		return this;
	},
	mobminderlogo: function(onoff, whois) { // pop-up mode, programmaticaly turns on/off the display of our mobminder logo (overlay mode)
	
		
		// if(vbs) vlog('mobminder.js','C_iMOB','busy','onoff:'+onoff,'whois',whois);
		// console.log('mobminder.js','C_iMOB','mobminderlogo','onoff = '+onoff,'whois = ',whois+'()');
		
		if(!!onoff) this.sleep({sneaking:false}); // those css apply in combinaison with .mainbusy, see (*css02*)
			else this.wakeup('from mobminderlogo()');
		
		return this;
	},
	screenwaiter: function(jsdate, timecss) { // screen decoration if you leave the screen unused
	
		if(vbs) vlog('mobminder.js','C_iMOB','screenwaiter','useractivity:'+this.timer.state.timer);
	
		// console.log('screenwaiter:'+timecss.hours+'h'+timecss.minutes+'m'+timecss.seconds+'s');
		if(this.state.moverlayed) return this;
			else this.sleep({sneaking:true});
		return this;
	},
	
	///////////////////////////////////////////////
	//

	mobscreen: function mobscreen(newscreen, resourceId, jsdate) { // switch between backoffice and agenda modes
		if(vbs) vlog('mobminder.js','C_iMOB','mobscreen','newscreen:'+newscreen+', resourceId:'+resourceId+', jsdate:'+(jsdate?jsdate.sortable():'none')); 		
		
		mobminder.app.controls.top.highlight(''); // reset the top header display
		switch(newscreen) { 
			case screens.elearning: ;
				let language, multi = '/single.php'; if(!C_dS_resource.single()) multi = '/multi.php';
				switch(mobminder.context.surfer.language) {
					case 1: language = '/fr'; break;
					case 3: language = '/nl'; break;
					default: language = '/en';
				}
				window.open('https://elearning.mobminder.com'+language+multi, '_blank', 'location=yes,height=700,width=1000,scrollbars=yes');
				return this;
				break;
			case screens.search: // calendar screens
			case screens.week: 
			case screens.list: 
			case screens.changes: 
			case screens.hourly: 
				$(this.elements.desk).show(); $(this.elements.boff).hide();
				this.controls.agenda.setscreen(newscreen, resourceId);
				switch(newscreen) {
					case screens.search: 
						if(this.vdigits) {
							this.controls.agenda.controls.desk.remote.visitrigger(this.vdigits); // that is a deep dive through C_iPLAN to R_search
						}
						this.vdigits = false;
						break;
				}
				break; 
				
			case screens.preferences: // back office screens
			case screens.visitors:
			case screens.statistics:
			case screens.smsdash:
			case screens.archives:
			case screens.resafind:
			case screens.connections:
			
				let office;
				const callbacks = {cfgremoved:new A_cb(this, this.cfgremoved), cfgreload:new A_cb(this, this.cfgreload), boffdone:new A_cb(this, this.boffdone)};
				switch(newscreen) {
					case screens.preferences: office = new C_backPREFS(this.eids.boff, callbacks); break;
					case screens.visitors: office = new C_backVISI(this.eids.boff, callbacks); break;
					case screens.statistics: office = new C_backSTAT(this.eids.boff, callbacks); break;
					case screens.smsdash: office = new C_backSMS(this.eids.boff, callbacks); break;
					case screens.archives: office = new C_backARCH(this.eids.boff, callbacks); break;
					case screens.resafind: office = new C_backFIND(this.eids.boff, callbacks); break;
					case screens.connections: office = new C_backCNX(this.eids.boff, callbacks); break;
				}
				// this.controls.top.hide();
				this.elements.boff.innerHTML = office.display();
				$(this.elements.desk).hide(); $(this.elements.boff).show();
				office.activate();
				this.controls.office = office;
				break;
		}
		this.screen = newscreen;
	},
	mobdate: function mobdate(jsdate) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		if(vbs) vlog('mobminder.js','C_iMOB','mobdate','date:'+jsdate);
		if(this.controls.agenda) this.controls.agenda.setmaindate(jsdate); 
	},	
	refresh: function refresh(options) { // refreshes the current screen, with or without server call
		//
		// refresh() is called from CtrlD() with option {callserver:false}, this lets the deleted items appear on the screen
		// refresh() is called from many modals to refresh the global planning on save or remove events
		//
		options = options || {callserver:true};
		if(vbs) vlog('mobminder.js','C_iMOB','refresh','planning is refreshed');
		switch(this.screen) { 
			case screens.visitors: // lets merged visitors appear/disappear from display // see (*rf01*)
			case screens.archives: // lets deleted items appear/disappear from display  // see (*rf02*)
				this.controls.office.refresh(); break; 
			default: 
				if(options.callserver) return this.mobdate(); else return this.controls.agenda.refresh();
		}
	},
	
	showdeleted: function() {
		// console.log('C_iMOB.showdeleted()');
		this.controls.top.showdeleted(); // which is a T_bar
		return false;
	},
	
	setflyingtimeflag(html, topy, leftx) { // sets inner display and position
		if(html===false) { // turns it of by moving away from wiewport
			this.elements.ftf.style.left = '-1000px';
			return false;
		}
		this.elements.ftf.style.top = topy+'px';
		this.elements.ftf.style.left = leftx+'px';
		this.elements.ftf.innerHTML = html;
		return true;
	},
	
	// This is the general gateway to post in ajax mode
	// As soon as you are logged in, you always post using the following procedure, using mobminder.app.post()
	//
	post: function(controls, names, target, success, failure, options) { // failure is called in case of timeout OR if a command is received
			const ajaxfeedback = new A_cb(this, this.ajaxfeedback, { success:success, failure:failure /* callbacks (*88*) */});
			const ajaxtimeout = new A_cb(this, this.ajaxtimeout, failure);
			let key;
			if('key' in names) // WATCH OUT! NEVER use 'key' in your controls while programming
			{ /* this specific post is passing a key (see e.g. the login process) (*40*) */ }
			else { 
				// common case for all other posts: work with the key that came through the configuration
				if(!mobminder.context) { 
					// this session was cleared out. See (*ck*)
					warning('mobminder.js','C_iMOB','post','no context, no post done'); key = new C_iPASS({baseline:mobminder.app.baseline, key:'x'});
				}  
				else 
					key = new C_iPASS({baseline:mobminder.app.baseline, key:mobminder.context.keyId});
				
				names['key'] = {baseline:'b', key:'k'}; // add baseline and key to the parameters already passed to the this.post()
				controls['key'] = key; 
			} 
			
		const post = new A_ps(controls, names, target, {onreply:ajaxfeedback, ontimeout:ajaxtimeout}, options);
	},
	
	// ajax feedbacks
	ajaxfeedback: function(callbacks /* (*88*) */, stream) { // called when the date is change from the TOP menu, applies jsdate on current planning screen

		const dscode = stream.extract('<code>','</code>').match; 
		const command = stream.extract('<command>','</command>').match;  
		
			if(vbs) vlog('mobminder.js','C_iMOB','ajaxfeedback','command:'+command);
			
		let datasets = false;
		if(dscode) datasets = C_inlineStreaming.createDataSets(dscode);
		
		if(command) switch(command) { // see ajaxsession.php, this is where those commands are issued
			case 'logoff':
				if(1) {
					C_iMODAL.closeall();
					this.controls.top.logout(); // top is an instance of T_bar
					this.elements.boff.innerHTML = '';
					if(callbacks.failure) callbacks.failure.cb(command); return; // that is not needed, PVH commented in 2024
				}
				break;
			case 'reload': // this command is issued when the code version on the server does not match the baseline at client side
				location.reload();
				break;
		} else {
			if(callbacks.success) { callbacks.success.cb(datasets, stream); }
		}
	},	
	ajaxtimeout: function(failure) {
		if(vbs) vlog('mobminder.js','C_iMOB','ajaxtimeout','');
		new C_iMSG(C_XL.w('connection failed'));
		if(failure) failure.cb();
	},	
	
	// copypaste interactivity
	copypaste: function(dS_resa, options = {}) {  // call this function AFTER modal closed, so to register the KEY on the right Layer level. 
	
		// PVH 2025 for reservations that are copy/pasted while they are part of a Serie, something needed to be done, see (*cp02*), we add them in the existing serie.
		this.state.cutmode = options.cut||false; // (*cp04*)
		this.state.duplicate = dS_resa; // returns to false when duplication/cutpaste is done, see mobminder.app.copypaste(false)
		// console.log('C_iMOB.copypaste() this.state.duplicate = ',dS_resa);
		if(this.controls.agenda) this.controls.agenda.copypaste(dS_resa, options); // passing dS_resa = false will cancel the copypaste process
	},

	// callbacks
	boffdone: function() {
		if(vbs) vlog('mobminder.js','C_iMOB','boffdone',''); 
		this.screen = screens.search;
		return this.cfgreload();
	}, 
	cfgreload: function(kid) { // new key id, optional (defaults takes the current key)
		if(vbs) vlog('mobminder.js','C_iMOB','cfgreload',''); 
		this.elements.boff.innerHTML = '';
		this.elements.desk.innerHTML = '';
		this.mobminderlogo(true,'cfgreload');
		this.controls.top.loginok(kid||mobminder.context.keyId);
	}, 
	cfgremoved: function() { // we need to load another config
			const nextkey = C_dS_accesskey.nextkey(mobminder.context.surfer.id, mobminder.context.keyId /*excludes the current*/);
		if(vbs) vlog('mobminder.js','C_iMOB','cfgremoved','currentkey:'+mobminder.context.keyId+', nextkey:'+nextkey); 
		if(nextkey==0) { } // then you have removed your last key => a new account will be created
		this.elements.boff.innerHTML = '';
		this.elements.desk.innerHTML = '';
		this.mobminderlogo(true,'cfgremoved');
		this.controls.top.loginok(nextkey);
	}, 
	resasaved: function(resa) { // new resa from slot search assistant R_search (in planning.js)
		// console.log('mobminder.js','C_iMOB','resasaved','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		mobminder.app.setdate.cb(resa.jsDateIn); // which is a A_cb set here (*mb10*) in planning.js
		this.controls.agenda.lastresasaved(resa); // C_iPLAN.lastresasaved()
	},
	plitems: function(inlineDataSets) { // new plitems received in the P_AgendaHVL
		this.controls.top.plitems(inlineDataSets); // this.controls.top is a T_bar ( Top_Bar )
	},
	rescsaved: function(inlineDataSets) { // called when a resource is deleted from the planning screen
		if(vbs) vlog('mobminder.js','C_iMOB','rescsaved','');
		this.configloaded(); // we redraw the agenda screen, inclusive the dashboard (good for when resources do change name, or display order)
	},
	rescdeleted: function(inlineDataSets) { // 
		if(vbs) vlog('mobminder.js','C_iMOB','rescdeleted',''); 
		return this.cfgreload();
	}
};

$(window).blur(function(e) { });
$(window).focus(function(e) {
	if(mobminder.context) // check (*ck*)
		if(mobminder.context.keyId) mobminder.app.post({}, {}, './queries/tabfocus.php');
});


function C_orientation(document, window) {
	// special cast for iPhones that should be hold in landscape mode
	this.handlers = new A_hn({ ochange:new A_cb(this, this.check) });
	if('orientation' in window) {
		document.addEventListener('orientationchange', this.handlers.ochange);
	}
};
C_orientation.prototype = {
	check: function() {	
		if('orientation' in window)
			switch(window.orientation) {  
				case -90: case 90: /* Device is in landscape mode */
					if(this.msg) { this.msg.close(); this.msg = false; $(this.activel).focus(); }
					break; 
				default: /* Device is in portrait mode */
					if(!this.msg) this.msg = new C_iMSG(C_XL.w('keep device landscape'), {onChoice:new A_cb(this, this.ok)}, { css:{body:'bigger'} } );
					this.activel = document.activeElement;
					$(this.activel).blur();
					
			}
	},
	ok: function() { this.msg = false; }
}
mobminder.orientation = new C_orientation(document, window);


window.onload = function () { 
} // this keeps your session alive





