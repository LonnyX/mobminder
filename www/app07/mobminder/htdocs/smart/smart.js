
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
// Use Case: A professional wants to book an appointment from a small device
//



//////////////////////////////////////////////////////////////////////////////////////////////
//
//     D A T E    P I C K E R 
//

function C_sDF (eid, callbacks, preset) { // Interactive Date frame for touch devices
	this.ctrlname = 'C_sDF';
		var b = eid+'_';
	this.eids = { ui:b+'ui', mm:b+'mm', m:b+'m', p:b+'p', pp:eid+'pp' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { mainui:, skip:, dblskip:, onmain:  }
	this.state = C_sDF.defaults.align(preset);
	
	var ui 	= new C_iCLIK(this.eids.ui, { click:new A_cb(this, this.onmain) } 		, { tag:'td', ui:'X', enabled:true } );	
	var mm 	= new C_iCLIK(this.eids.mm, { click:new A_cb(this, this.dblskip, -1)} 	, { ui:'', tag:'td' } );
	var m 	= new C_iCLIK(this.eids.m, 	{ click:new A_cb(this, this.skip, -1)} 		, { ui:'', tag:'td' } );
	var p 	= new C_iCLIK(this.eids.p, 	{ click:new A_cb(this, this.skip, 1)} 		, { ui:'', tag:'td' } );
	var pp 	= new C_iCLIK(this.eids.pp, { click:new A_cb(this, this.dblskip, 1)} 	, { ui:'', tag:'td' } );

	this.controls = new A_ct({ui:ui, mm:mm, m:m, p:p, pp:pp});
}
C_sDF.defaults = new A_df({ value:0 });
C_sDF.prototype = {
	
	display: function(css) {
		var td_mm = (is.small&&is.portrait)?'':this.controls.mm.display('sDP-button fa fa-gray fa-fast-backward fa-13x ');
		var td_m = this.controls.m.display('sDP-button fa fa-gray fa-step-backward fa-13x');
		var td_p = this.controls.p.display('sDP-button fa fa-gray fa-step-forward fa-13x');
		var td_pp = (is.small&&is.portrait)?'':this.controls.pp.display('sDP-button fa fa-gray fa-fast-forward fa-13x');
		var td_dp = this.controls.ui.display('sDP-date');
		var table = '<table style="text-align:center; margin:0 auto;">'+'<tr>'+td_mm+td_m+td_dp+td_p+td_pp+'</tr>'+'</table>';
		return table;
	},
	activate: function() {
		if(vbs) vlog('mobminder.js','C_sDF','activate','eid:'+this.eids.ui);
		this.elements.collect(this.eids);
		this.controls.activate(this.ctrlname);
		return this;
	},
	set: function(html) { 	this.controls.ui.set(html);	},
	
	// sub controls callbacks
	onmain: function() { 		
		if(vbs) vlog('mobminder.js','C_sDF','onmain','eid:'+this.eids.ui);
		if(this.callbacks.onmain) this.callbacks.onmain.cb(this.state.value); 
	},
	skip: function(dir) {		if(this.callbacks.skip) this.callbacks.skip.cb(dir);				},
	dblskip: function(dir) {	if(this.callbacks.dblskip) this.callbacks.dblskip.cb(dir);			}
}


function C_sDP(eid, callbacks, preset) { // Date picker for touch devices
	this.ctrlname = 'C_sDP';
	this.eids = { cscrl:eid+'_scrl', cal:eid+'_cal', df1:eid+'_df1', df2:eid+'_df2' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { datechanged:, tomenu:,  }
	this.state = C_sDP.defaults.align(preset);
		
		// var mpr = C_iWIN.size.w <= 1320 ? 4 : 6; if(is.tactile) mpr = 3; if(is.small) mpr = 1; // months per row
		// console.log(mpr,C_iWIN.size.w/300|0);
		var mpr = C_iWIN.size.w/400|0; if(mpr==0) mpr=1;
		
		var months = 24; // number of months we want to display in total;
		var rows = months/mpr;
		var prows = months/3/mpr|0;
			var pact = new A_cb(this, this.dpact, true); // called real time when dp activity is present
		var dphandler = { dayclick:new A_cb(this, this.daytouch, undefined, pact), incremented:new A_cb(this, this.incremented, undefined, pact) };
	var cal = new C_iCAL(this.eids.cal, dphandler, { mpr:mpr, rows:rows, pastrows:prows, weeknumb:mobminder.context.surfer.weeknumb });

		var dfh = { onmain:new A_cb(this, this.datehit), skip:new A_cb(this, this.skipdate), dblskip:new A_cb(this, this.bigskip) };
	var df1 = new C_sDF(this.eids.df1, dfh);
	var df2 = new C_sDF(this.eids.df2, dfh);
	this.controls = new A_ct({cal:cal, df1:df1, df2:df2 });
}
C_sDP.defaults = new A_df({ scrolling:false });
C_sDP.prototype = {
	display: function(dfx) {
			var ctrl = this.controls.df1.display();
		if(dfx==2) ctrl = this.controls.df2.display();
		return '<div class="backgnd-light">'+ctrl+'</div>';
	},
	calendar: function() {
		var slider = '<div id="'+this.eids.cal+'" class="iSlide">'+this.controls.cal.display()+'</div>';
		var scroller = '<div id="'+this.eids.cscrl+'" style="position:relative; height:100%;">'+slider+'</div>';
		return scroller;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate(this.ctrlname);
		this.controls.df1.set(this.dateframe());
		this.controls.df2.set(this.dateframe());
		
		var handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone) });
		var options = { 
			bounce:true, momentum:true, snap:'tr.agrow', snapSpeed:900, 
			scrollbars:true, fadeScrollbars:true, eventPassthrough:false, 
		};
		this.scrolly = new IScroll(this.elements.cscrl, options);  // C_sDP (top date picker)
		this.scrolly.on('scrollStart', handlers.iScrolling);
		this.scrolly.on('scrollEnd', handlers.iScrolldone);
			
		this.scroll(1);
		if(vbs) vlog('mobminder.js','C_sDP','activate','eid:'+this.eids.cscrl);
		return this;
	},
	settopdate: function(jsdate) {
		jsdate = jsdate || new Date();
		this.controls.cal.set(jsdate.toMidnight());
		this.controls.df1.set(this.dateframe());
	},
	getdate: function() { return this.controls.cal.jsdate();},
	
	// private
	dateframe: function() {
		// clickable control face
		var jsdate = this.controls.cal.jsdate();
			var abreviation = is.tactile?'abr':'full';
			
		var date = C_XL.date(jsdate, {abreviation:abreviation, weekday:false });
		var weekday = C_XL.weekday(jsdate.getPHPday(), abreviation);
				var dwidth = is.tactile?6:12;
				var wwidth = is.tactile?3:6;
			date = '<td style="min-width:'+dwidth+'em; text-align:left;">'+date+'</td>';
			weekday = '<td style="min-width:'+wwidth+'em; text-align:right;">'+weekday+'&nbsp;</td>';
		var html = '<table><tr>'+weekday+date+'</tr></table>';
		return html;
	},
	scroll: function(duration) {
		if(vbs) vlog('mobminder.js','C_sDP','scroll','');
		var position = this.controls.cal.getcurrentcoord();
		if(this.scrolly) {
			var that = this; 
			this.scrolly.refreshNext(); // lets this applet measure the size of the divs
			setTimeout( function(){ that.scrolly.goToPage(position.col, position.row, duration); }, 1 );
		}
		return this;
	},
	
	// DOM events
	iScrolling: function() { // iScroll events - tactile only -
		if(!this.state.scrolling) { // calls only once above
			C_iDAY.state.down = false; /* cancels a date click if your finger slides from a date td */ 
			this.state.scrolling = true;
			if(vbs) vlog('mobminder.js','C_sDP','iScrolling','');
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.state.scrolling = false;
		if(vbs) vlog('mobminder.js','C_sDP','iScrolldone','');
		return true;
	}, 
	
	// callbacks
	skipdate: function(skip) { // called from single array touch, skip must be 1 or -1
		if(vbs) vlog('mobminder.js','C_sDP','skipdate', 'skip='+skip);
		var inc = { d:skip, w:0 };
		this.controls.cal.increment(inc);
		this.controls.df1.set(this.dateframe());
		this.controls.df2.set(this.dateframe());
		this.scroll();
	},
	bigskip: function(skip) { // called from double array touch, skip must be 1 or -1
		if(vbs) vlog('mobminder.js','C_sDP','skipdate','skip='+skip);
		var inc = { w:skip };
		this.controls.cal.increment(inc);
		this.controls.df1.set(this.dateframe());
		this.controls.df2.set(this.dateframe());
		this.scroll();
	},
	incremented: function(jsdate) { // the date has changed in the datepicker using dateframe interactivity
		if(vbs) vlog('mobminder.js','C_sDP','daytouch','date:'+jsdate.sortable());
		if(this.callbacks.incremented) this.callbacks.incremented.cb(jsdate);
	},
	daytouch: function(jsdate) { // the date has changed in the datepicker using day cell touch interactivity
		if(vbs) vlog('mobminder.js','C_sDP','daytouch','date:'+jsdate.sortable());
		if(this.callbacks.datechanged) this.callbacks.datechanged.cb(jsdate);
	},
	dpact: function() { // activity on datepicker
		this.controls.df1.set(this.dateframe());
		this.controls.df2.set(this.dateframe());
		if(vbs) vlog('mobminder.js','C_sDP','dpact','');
	},
	datehit: function() {
		if(vbs) vlog('mobminder.js','C_sDP','datehit','');
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//     S E A R C H    A S S I S T E N T    S E T T I N G  
//


C_sSlot = function(eid, dS_reservation, callbacks, preset) { // a single slot entry
	this.resa = dS_reservation;
	var positive = this.resa.id<0 ? this.resa.id*-1 : this.resa.id;
	
	this.eids = { time:eid+'_'+positive, date:eid+'_date_'+positive };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { selected:A_cb };
	this.state = C_sSlot.defauts.align(preset);
	
		var fCalsString = this.resa.text.resources.f;  //C_dS_attendee.getResourcesNames(this.resa.id, class_fCal);
		var bCalId 		= this.resa.bCal.id;
		var uCalsString = this.resa.text.resources.u; //C_dS_attendee.getResourcesNames(this.resa.id, class_uCal);
	
	this.fCalsString = fCalsString;
	this.uCalsString = uCalsString;
	
	var time = new C_iCLIK(this.eids.date, { click:new A_cb(this, this.selected)} , { ui:this.resa.text.time.cin, tag:'span', style:'min-width:2em; float:left;' } );
	this.controls = new A_ct({time:time});
}
C_sSlot.defauts = new A_df( { enabled:true, css:'', tip:false } );
C_sSlot.prototype = { 
	// public
	displayTime: function() {
		return this.controls.time.display();
	},
	displayResources: function(type, css) {	
		switch(type) {
			case class_bCal: return this.resa.bCal.rbullet()+this.resa.bCal.name; break;
			case class_uCal: return this.uCalsString; break;
			case class_fCal: return this.fCalsString; break;
		}
		return '';
	},
	displayDate: function() { 
		var date = C_XL.date(this.resa.jsDateIn, {abreviation:(is.small?'abr':'full'), weekday:true, year:false } );
		return date+'&nbsp;';
	},
	activate: function() {	
		this.elements.collect(this.eids);
		this.controls.activate('C_sSlot');
	},	
	selected: function() {
		if(this.callbacks.selected) this.callbacks.selected.cb(this.resa);
	}
};

C_sSlots = function(eid, callbacks, preset) { // collection of C_sSlot
	
	this.ctrlname = 'C_sSA';
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { { selected:new A_cb(this, this.slotclick) } }
	this.state = C_sSlots.defaults.align(preset);
	this.eids = { eid:eid, slot:eid+'_slot', inset:eid+'_inset', outset:eid+'_outset' };
	this.controls = new A_ct({});
	
	this.register = new C_registers({name:'midnight', order:true}); 
	this.slots = new A_ct(); // reserved for slot instances
	this.controls = new A_ct(); // scroller and miscellaneous controls
	
}
C_sSlots.defaults = new A_df( { enabled:true, css:'', tip:false } );
C_sSlots.prototype = {
	feed: function(dS_reservation) {
			var r = dS_reservation;
		var slot = new C_sSlot(this.eids.slot, r, this.callbacks, {tip:this.state.tip});
			// register branching is like this.register.midnight[midnight][fCals][bCal][uCals][time] = o_SLOT
		this.register.add(slot, 'midnight', r.midnight, r.text.resources.f, r.bCal.id, r.text.resources.u, r.cueIn);
		this.slots.add1(slot);
	},
	display: function() { // displays the collection of C_sSlot instances, in a specialy ordered way
		var prevMidnight = false;
		var prev_bCalId = false;
		var trs = new Array();
			var rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
		var staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal) };

		// scanning dates
		for(m in this.register.midnight.ordered) { // this.register.midnight[midnight][fCals][bCal][uCals][time] = o_SLOT
			
			var midnight = this.register.midnight.ordered[m];
			
			// scanning uCals for a given bCal
			var fCalsStrings = this.register.midnight[midnight]; 
			for(f in fCalsStrings.ordered) { 
				var fCalsString = fCalsStrings.ordered[f];
				
				// scanning bCals inside a given fCal option
				var bCals = fCalsStrings[fCalsString];  
				for(b in bCals.ordered) {
					var bCalId = bCals.ordered[b];
					
					// scanning uCals for a given bCal
					var uCalsStrings = bCals[bCalId];
					for(u in uCalsStrings.ordered) {
						var uCalsString = uCalsStrings.ordered[u];
						
						// scanning free slots for a given fCal / bCal / uCal combination
						var cueIns = uCalsStrings[uCalsString]; 
						var slots = new Array();
						for(c in cueIns.ordered) {
							var cueIn = cueIns.ordered[c];	
							slots.push(cueIns[cueIn].displayTime());
						}
						slots = slots.length ? slots.join('') : '';
						
						
						var slot = cueIns[cueIn];
						
						var cc = 1;
						var dateShow = (prevMidnight!=midnight) ? slot.displayDate() : '';
						var bCalShow = (prev_bCalId!=bCalId) ? slot.displayResources(class_bCal) : '';
						var dateTd = '<td style="width:1%; white-space:nowrap; text-align:left; font-weight:bold; padding:1em 0 0 .5em;">'+dateShow+'</td>';
						
						var bCalTd = '';
							if(!mobminder.account.single && staffshow.bCals) { cc++; bCalTd = '<td style="width:1%; white-space:nowrap;">'+bCalShow+'</td>'; }
							
						var uCalsTd = ''; 
							if(uCalsString!='-'&&staffshow.uCals) { cc++; uCalsTd = '<td style="width:1%; white-space:nowrap; text-align:right;">'+uCalsString+'</td>'; }
						
						var fCalsTd = '';
							if(fCalsString!='-'&&staffshow.fCals) { cc++; fCalsTd = '<td style="width:1%; white-space:nowrap;">'+fCalsString+'</td>'; }
						
						var screenbreaker = is.small?'</tr><tr style="border-top:none;">':''; // on iPhone, the dates come above the time slots proposals
						var colspan = is.small?(' colspan='+cc):''; // on iPhone, the dates come above the time slots proposals
						
						var slotsTd = '<td '+colspan+' style="white-space:normal;">'+slots+'</td>';
						
						trs.push(dateTd+bCalTd+uCalsTd+screenbreaker+slotsTd+fCalsTd);
						prevMidnight = midnight;
						prev_bCalId = bCalId;
					}
				}
			}
			prev_bCalId = false;
		}
		trs = trs.length ? trs.join('</tr><tr class="snappy">') : '<tr><td style="font-size:bigger; font-weight:bold;">'+C_XL.w('no search result')+'<td></tr>';
		trs = '<tr class="snappy">'+trs+'</tr>';
					var table =  '<table summary="results" class="slots" style="white-space:nowrap;">'+trs+'</table>';
				var inset = '<div id="'+this.eids.inset+'" class="iSlide">'+table+'</div>';
			var outset = '<div id="'+this.eids.outset+'" class="" style="height:100%; max-height:100%; position:relative;">'+inset+'</div>';
		return outset;
	},
	activate: function() {
		
		this.slots.activate(); 
		this.controls.activate();
		this.elements.collect(this.eids);
		
		var options = { 
			bounce:true, momentum:true, snap:'tr.snappy', snapSpeed:900, 
			scrollbars:true, fadeScrollbars:true, eventPassthrough:false, 
		};
		this.scrolly = new IScroll(this.elements.outset, options); 
	}

}


function C_sSA(eid, callbacks, preset) { // Search Assistent setting
	this.ctrlname = 'C_sSA';
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { datechanged:, tomenu:,  }
	this.state = C_sSA.defaults.align(preset);
	
	this.eids = { eid:eid, outset:eid+'_outset', inset:eid+'_inset', output:eid+'_out', tboxingtd:eid+'_tboxingtd',
					controls:{ visitors:eid+'_visi', workcodes:eid+'_work', duration:eid+'_dur', before:eid+'_before', ampm:eid+'_ampm', staff:eid+'_staff', tboxing:eid+'_tboxing', options:eid+'_options' },
					buttons:{ search:eid+'_search', stbylist:eid+'_stbl', exceptional:eid+'_excep', overdays:eid+'_overd', plus:eid+'_plus', eject:eid+'_eject' },
					slots:'slots'
				}

	var workcodes = false;
	var wkcallbacks = { added:new A_cb(this, this.workcodeAdded), changed:new A_cb(this, this.workcodeSelect), cleared:new A_cb(this, this.workcodesCleared) };
	// if(mobminder.account.has.workcodes>50) // counts how many NOT eresa workcodes the account holds
		workcodes = new C_iACPICK(this.eids.controls.workcodes, C_dS_workcode, wkcallbacks, { placeholder:C_XL.w('workcodes'), eWorkcodes:false } );

		var plus = new C_iCLIK(this.eids.buttons.plus, { click:new A_cb(this, this.newvisitor) }
			, { enabled:true, tip:C_XL.w('tip plus visitor'), css:'button-ac fa-gray fa-11x fa fa-user-plus', style:'display:inline-block;', ui:'', tag:'div'
			, keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.n /* Ctrl + n */, C_KEY.code.kpad.s.add /* Numpad plus key */ ] } );
		var eject = new C_iCLIK(this.eids.buttons.eject, { click:new A_cb(this, this.oneject) }
			, { enabled:true, tip:C_XL.w('tip clear search'), css:'button-ac fa-gray fa-11x fa fa-eject', style:'display:inline-block;', ui:'', tag:'div'
			, keys:[C_KEY.code.s.backspace+C_KEY.code.s.shift /* backspace */, C_KEY.code.kpad.s.subtract /* Numpad minus key */ ] } );
		
		var visibacks = { changed:new A_cb(this, this.visitorSelect), added:new A_cb(this, this.visitorAdded), cleared:new A_cb(this, this.visitorACclear)};
	var visitors = new C_iACPICK(this.eids.controls.visitors, C_dS_visitor, visibacks, { focus:false, buttons:{plus:plus, eject:eject}, onlabelclick:new A_cb(this, this.visiLabelClick), placeholder:C_XL.w('visitor') } );

	var duration = new C_iDUR(this.eids.controls.duration, {ondur:new A_cb(this,this.duration)} );
	var before = new C_iBEFORE(this.eids.controls.before, {onbefore:new A_cb(this,this.before)}, { selection:mobminder.account.notbefore } );
	var ampm = new C_iAMPM(this.eids.controls.ampm, {onampm:new A_cb(this,this.ampm)}, {abreviation:(is.tactile?'abr':'full')} );
	
		var precheck = [];
			precheck[class_bCal] = C_dS_resource.getByType(class_bCal);
			precheck[class_uCal] = C_dS_resource.getByType(class_uCal);
	var staff = new C_iSTAFF(this.eids.controls.staff, 'staffing', new A_cb(this,this.staff), precheck);
		var options = C_dS_timeboxing.cresta(); // see also showhidetboxing() that hides it from the dashboard
	var tboxing = new C_iCRESTA(this.eids.controls.tboxing, { onchange:new A_cb(this,this.tboxing) }, options, { mode:0, title:C_XL.w('timeboxing') } );

	var search = new C_iCLIK(this.eids.buttons.search, { click:new A_cb(this, this.search) }
		, {   tip:C_XL.w('tip search'), css:'small bold', style:'display:inline-block; width:12em; height:6em;'
			, ui:C_XL.w('slotsearch'), tag:'button', keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.f /* Ctrl + f (find)*/] } );

	var stbylist = new C_iCLIK(this.eids.buttons.stbylist, { click:new A_cb(this, this.standbylist) }
		, {   tip:C_XL.w('tip waiting list'), css:'small bold', style:'display:inline-block; width:8em; height:6em; margin-right:1em;'
			, ui:C_XL.w('standby list'), tag:'button', keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.w /* Ctrl + w (waiting list)*/] } );

	var exceptional = new C_iCLIK(this.eids.buttons.exceptional, { click:new A_cb(this, this.exceptional) }
		, {   tip:C_XL.w('tip exceptional'), css:'small bold', style:'display:inline-block; width:8em; height:6em; margin-right:1em;'
			, ui:C_XL.w('excp'), tag:'button', keys:[] } );

	var overdays = new C_iCLIK(this.eids.buttons.overdays, { click:new A_cb(this, this.overdays) }
		, {   tip:C_XL.w('tip overdays'), css:'small bold', style:'display:inline-block; width:8em; height:6em; margin-right:1em;'
			, ui:C_XL.w('overdays'), tag:'button', keys:[] } );

	var continued = new C_iPASS('0');
	var limit = new C_iPASS('0');

	var options = new C_iPASS({ exceptional:0, overdays:0, aggregate:0 });
	
	this.controls = new A_ct({visitors:visitors, workcodes:workcodes, duration:duration, before:before, ampm:ampm, staff:staff, tboxing:tboxing, options:options, continued:continued, limit:limit});
	this.buttons = new A_ct({search:search, stbylist:stbylist, exceptional:exceptional, overdays:overdays, plus:plus, eject:eject });
	this.slots = false; // will be an instance of C_sSlots when freshslots() is called
}
C_sSA.defaults = new A_df({ duplicate:false, searchmode:false });
C_sSA.prototype = {
	display: function(dfx) {

		if(vbs) vlog('small.js','C_sSA','display',''); 
		
		// remote control dashboard
		var visitors = '<td>'+this.controls.visitors.display()+'</td>';
		var duration = '<td>'+this.controls.duration.display()+'</td>';
		var before = '<td>'+this.controls.before.display()+'</td>';
		var ampm = '<td>'+this.controls.ampm.display()+'</td>';
		var staff = '<td>'+this.controls.staff.display()+'</td>';
		var workcodes = mobminder.account.has.workcodes ? '<td>'+this.controls.workcodes.display({ddwn:'white-input'})+'</td>' : '';
		var tboxing = mobminder.account.has.timeboxing ? '<td id="'+this.eids.tboxingtd+'">'+this.controls.tboxing.display()+'</td>' : '';
		
		// buttons
			var search = this.buttons.search.display();
			var stbylist  = mobminder.account.usestandbylist ? this.buttons.stbylist.display() : '';
			var except = mobminder.account.has.excpshadows ? this.buttons.exceptional.display() : '';
			var overd  = mobminder.account.overdays ? this.buttons.overdays.display() : '';
		var buttons = stbylist+except+overd+search;
		
		if(mobminder.account.single) { // right area vertical search assistant
		
				var headerlayout = '<tr style="vertical-align:top;">'+visitors+'</tr>'+'<tr style="vertical-align:top;">'+workcodes+'</tr>';
			
			var headerpane = '<div class="remote-pane"><table style="width:100%;">'+headerlayout+'</table></div>';
			var bodypane = '<div class="remote-pane"><table style="width:100%;"><tr style="vertical-align:top;">'+duration+before+'</tr></table></div>';
			var bottompane = '<div class="remote-pane"><table style="width:100%;"><tr style="vertical-align:top;">'+ampm+tboxing+'</tr></table></div>';
			var staffpane = '';
			var buttonspane = '<div class="remote-pane">'+buttons+'</div>';
		
		} else { // wide horizontal bottom search assistant
		
			var headerpane = '<div class="remote-pane"><table style="width:100%;">'+visitors+workcodes+'</table></div>';
			var bodypane = '<div class="remote-pane"><table style="width:100%;"><tr style="vertical-align:top;">'+duration+before+staff+'</tr></table></div>';
			var bottompane = '<div class="remote-pane"><table style="width:100%;"><tr style="vertical-align:top;">'+ampm+tboxing+'</tr></table></div>';
			var staffpane = '<div class="remote-pane"><table style="width:100%;"><tr style="vertical-align:top;">'+staff+'</tr></table></div>';
			var buttonspane = '<table style="width:100%;"><tr style="vertical-align:top;">'+buttons+'</tr></table>';
		
		}
		
		
		// search assistant overall shape
			var inset = '<div id="'+this.eids.inset+'" class="remote-shape remote-inset iSlide" style="padding:1em;">'+headerpane+bodypane+bottompane+staffpane+'</div>';
			var outset = '<div id="'+this.eids.outset+'" class="remote-shape remote-outset" style="height:100%; position:relative;">'+inset+'</div>';
		
			var upper = '<div class="" style="position:absolute; top:0em; bottom:6em; width:100%; overflow:hidden;">'+outset+'</div>';
			var footer = '<div class="backgnd-light" style="height:6em; max-height:6em; overflow:hidden; position:absolute; bottom:0px; width:100%; padding:.5em 5em;">'+buttonspane+'</div>';
		var wrapper = '<div class="" style="height:100%; position:relative;">'+upper+footer+'</div>';
		return wrapper;

	},
	dispslots: function() {
		// query result output div
		var output = '<div id="'+this.eids.output+'" class="remote-output" style="">AVAILABLE SLOTS HERE</div>';
		
		return output;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('R_search');
		// this.controls.visitors.activate('R_search'); // during activation of visitors, the vfrm__viemport is shifted by 63 pixels <= because focus is set to "true" => this forces the screen to scroll down to this field
		
		this.buttons.activate();
		this.showhidetboxing();
		this.ejectshow(false);
		
		var options = { 
			bounce:true, momentum:true, snap:'div.remote-pane', snapSpeed:900, 
			scrollbars:true, fadeScrollbars:true, eventPassthrough:false, 
		};
		this.scrolly = new IScroll(this.elements.outset, options); 

		return this;
	},
	
	
	duplicate: function(resa, replan) {
		if(vbs) vlog('small.js','C_sSA','duplicate','replan:'+(replan?resa.id:0)); 
		
		// watch the sequence here: this.state.duplicate switches the subsequent execution behaviour
		this.state.duplicate = { replan:(replan?resa.id:0), note:resa.note, ccsscolor:resa.cssColor, ccsspattern:resa.cssPattern, ccsstags:resa.cssTags };
		this.controls.visitors.clear();
		var v = 0;
		for(var id in resa.visitors) { v=id; this.controls.visitors.more([id]); }
		if(v) this.controls.ampm.and(resa.visitors[v].prefAMPM);
		
				
		var anyperf = false;
		for(var id in resa.performances) { anyperf = true; this.controls.workcodes.more([id]); }
		
		if(!anyperf) { // then we preset the resources that are in the original appointment
			var r = new Array(); for(var rescclass in resa.resources) for(var id in resa.resources[rescclass]) r.push(id);
			var s = 0; for(var id in resa.resources[class_uCal]) s++;
			this.controls.staff.resetstaff(r).setsize(s||1);
		}
		var duration = (resa.cueOut-resa.cueIn)/mobminder.account.secondsPerSlice;
		this.controls.duration.set(duration || mobminder.account.durationShortest);
	},
	visitrigger: function(digits) {
		this.controls.visitors.set(digits);
		return this;
	},
	
	// private functions
	sumUpPreferences: function() {
		if(vbs) vlog('small.js','C_sSA','sumUpPreferences',''); 
		this.dashboreset();
		var vitems = this.controls.visitors.value();
		for(var vid in vitems) {
			var o_dS_visitor = vitems[vid];
			var o_dS_workexperts = C_dS_visitorPreferences.register[vid];
			if(!o_dS_workexperts) continue; // not yet arrived, should come through ajax callback this.preferences()
			this.controls.ampm.and(o_dS_visitor.prefAMPM);
			this.controls.workcodes.more(o_dS_workexperts.workcodes, true /*unset*/);
			this.controls.staff.highlight(o_dS_workexperts.resources);
		}
	},
	closeslots: function() {
		if(vbs) vlog('small.js','C_sSA','closeslots',''); 
		if(!this.elements.output) return; // not yet activated
		this.elements.output.innerHTML = '';
		this.controls.continued.set('0');
		this.buttons.search.caption(C_XL.w('slotsearch'));
		this.buttons.stbylist.caption(C_XL.w('standby list'));
	},
	buttonsReset: function() { // enables and sets all buttons in non busy mode
		this.buttons.search.busy(false);
		this.buttons.exceptional.busy(false);
		this.buttons.overdays.busy(false);
		this.buttons.stbylist.busy(false);
		for(var x in this.buttons.get) this.buttons.get[x].enable(true);
		this.state.searchmode.focus();
	},
	buttonsBusy: function(button) { // disables all buttons except the active searchmode
		this.state.searchmode = button;
		this.state.searchmode.focus();
		for(var x in this.buttons.get) this.buttons.get[x].enable(false);
		button.busy(true);
	},
	dashboreset: function() {
		if(vbs) vlog('small.js','C_sSA','dashboreset',''); 
		this.controls.staff.resetstaff().setsize(1);
		this.controls.workcodes.clear();
		this.controls.before.resetbefore();
		this.controls.ampm.resetampm();
		this.closeslots();
	},
	showhidetboxing: function(which) { // timeboxing appears only when resources are selected that have timeboxing in their hourlies
		// if(mobminder.account.single) return;
		if(!mobminder.account.has.timeboxing) return;
		if(!which) which = this.controls.staff.value();
		var tboxings = new Array(); // check what timeboxing is used by the selected resources
		var classes = [class_bCal, class_uCal, class_fCal];
		var werechecked = arrayINVERT(this.controls.tboxing.getvalue());
		for(var x in classes) {
			var rscIds = which[classes[x]];
			var ids = C_dS_resource.whichboxing(rscIds);
			tboxings = tboxings.concat(ids);
		}
			var newoptions = C_dS_timeboxing.cresta(werechecked, tboxings);
		this.controls.tboxing.clear(newoptions);
			
		if(tboxings.length) $(this.elements.tboxingtd).show(); // if no timeboxing at all remains, hide the complete control
			else $(this.elements.tboxingtd).hide();
	},
	
	// event handling
	staff: function(which) { // which is like which[class_bufCal][x] = id
			var bcals = which[class_bCal].join(',');
			var ucals = which[class_uCal].join(',');
			var fcals = which[class_fCal].join(',');
		if(vbs) vlog('small.js','C_sSA','staff','bcals:'+bcals+' ucals:'+ucals+' fcals:'+fcals); 
		this.showhidetboxing(which); 
		this.closeslots(); 
	},
	ampm: function() { this.closeslots(); },
	before: function() { this.closeslots(); },
	duration: function() { this.closeslots(); },
	tboxing: function() { this.closeslots(); },
	workcodeAdded: function(id) { // id of the workcode that has been selected by browsing available account workcodes
		if(vbs) vlog('small.js','C_sSA','workcodeAdded','id:'+id); 
	},
	workcodeSelect: function(items) { // a workcode has been checked or unchecked
		// this.closeslots(); 
		var rscids = new Array(), tboxids = new Array();
		var duration = 0; var staffsize = 1;
		var ids = [];
		for(var id in items) { // many workcodes can be selected on the workcode selection control
			var o_dS_workcode = items[id]; ids.push(id);
			duration += o_dS_workcode.duration;
			staffsize = Math.max(o_dS_workcode.staffing, staffsize);
			rscids.push(o_dS_workcode.expertsIds());
			tboxids.push(arrayKEYS(o_dS_workcode.tboxingIds()));
		}
		if(vbs) vlog('small.js','C_sSA','workcodeSelect','newsetting:'+ids.join(',')); 
		
		this.controls.duration.set(duration || mobminder.account.durationShortest);
		var commonResources = arrayAND(rscids); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.staff.resetstaff(commonResources).setsize(staffsize);
		
		var commonTimeboxings = arrayAND(tboxids); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.tboxing.docheck(commonTimeboxings, true, {reset:true});

	},
	workcodesCleared: function() { // a workcode has been checked or unchecked
		if(vbs) vlog('small.js','C_sSA','workcodesCleared',''); 
		this.closeslots();
	},
	
	visitorAdded: function(id) {
		if(vbs) vlog('small.js','C_sSA','visitorAdded','duplicate:'+!!this.state.duplicate); 
		if(this.state.duplicate) return; // do not overwrite performances setting when in duplicate or replan mode
		id = new C_iPASS(id);
		mobminder.app.post({id:id}, {id:'id'}, '../queries/remote.php', new A_cb(this,this.preferences), new A_cb(this,this.connfailed));
	},	
	visitorSelect: function(items) {
		if(vbs) vlog('small.js','C_sSA','visitorSelect',''); 
		// this function fires immediately when a visitor is added through the ac, though the preferences arrive later through ajax
		if(is.tactile) this.controls.visitors.blur();
		this.ejectshow(true);
		this.sumUpPreferences();
	},
	visitorACclear: function() {
		if(vbs) vlog('small.js','C_sSA','visitorACclear',''); 
		this.fullreset();
	},
	visiLabelClick: function(visitorId) {
		var o_dS_visitor = C_dS_visitor.get(visitorId);
		var o_easyVISI = new M_VISI(o_dS_visitor, { saved:new A_cb(this, this.visitorsaved)} );
		return false;
	},
	
	newvisitor: function() { 
		var digits = this.controls.visitors.digits();
		if(vbs) vlog('small.js','C_sSA','newvisitor','digits:'+digits); 
		var o_easyVISI = new M_VISI(false, { saved:new A_cb(this, this.newvisitorsaved)}, { digits:digits });
	},
	fullreset: function() { // full dashboard reset
		if(vbs) vlog('small.js','C_sSA','fullreset','duplicate mode cleared'); 
		this.sumUpPreferences();
		this.state.duplicate = false;
		this.ejectshow(false);
		mobminder.app.copypaste(false); // cancel the copypaste mode
	},
	oneject: function() {
		if(vbs) vlog('small.js','C_sSA','oneject',''); 
		this.controls.visitors.clear();
		return this.fullreset();
	},
	ejectshow: function(doshow) { // delayed hide for the eject button
		if(doshow) return this.buttons.eject.hide(false);
		var button = this.buttons.eject;
		setTimeout( function(){ return button.hide(true) }, 1000);
	},
	newvisitorsaved: function(inlineDataSets) {
		var id; for(var id in inlineDataSets['C_dS_visitor']) break;
		this.controls.visitors.add(id);
	},
	visitorsaved: function(inlineDataSets) {
		var id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('small.js','C_sSA','visitorsaved','id:'+id); 
		this.controls.visitors.refresh(id); 
	},
	newresasaved: function(dataSets) {
		var resa = false;
		for(var id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('small.js','C_sSA','newresasaved','id:'+resa.id); 
		this.state.duplicate = false;
		this.oneject();
		if(this.callbacks.resasaved) this.callbacks.resasaved.cb(resa);
	},
	queryslots: function(exceptional, overdays) {
		this.elements.output.innerHTML = '';
		this.controls.options.items.exceptional = exceptional||0;
		this.controls.options.items.overdays = overdays||0;

		var names = {
			visitors:'visitors', workcodes:'workcodes', duration:'duration', before:'before', ampm:'ampm', tboxing:'tboxing'
			, continued:'continued' , limit:'limit'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' } 
			, options:{exceptional:'exceptional', overdays:'overdays', aggregate:'aggregate' }
		};
		mobminder.app.post(this.controls, names, '../queries/search.php', new A_cb(this,this.freshslots), new A_cb(this, this.connfailed));
		rmems.flush('slots');
	}, 
	search: function() { 
		this.queryslots(0,0);
		this.buttonsBusy(this.buttons.search);
	}, 
	exceptional: function() {
		this.queryslots(1,0);
		this.buttonsBusy(this.buttons.exceptional);
	}, 
	overdays: function() {
		this.queryslots(0,1);
		this.buttonsBusy(this.buttons.overdays);
	},
	standbylist: function() {
		this.elements.output.innerHTML = '';
		var names = {
			workcodes:'workcodes', duration:'duration', before:'before', ampm:'ampm', tboxing:'tboxing', continued:'continued'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' }
		};
		mobminder.app.post(this.controls, names, '../queries/standbylist.php', new A_cb(this,this.stbylistfresh), new A_cb(this, this.connfailed));
		// C_sSlot.flush();
		rmems.flush('slots');
		this.buttonsBusy(this.buttons.stbylist);
	}, 
	
	// ajax callbacks
	freshslots: function(inlineDataSets) { // this is where we display this stuff on the output pad
		this.buttonsReset();
		this.ejectshow(true);
		var virtualid = -1, cueLast = 0;
		if(vbs) vlog('small.js','C_sSA','freshslots','dusplicate:'+(this.state.duplicate!==false)); 
		
		this.slots = new C_sSlots(this.eids.slots, { selected:new A_cb(this, this.slotclick) }, {});
		for(var id in inlineDataSets['C_dS_reservation']) { // scans all reservations
			var resa = inlineDataSets['C_dS_reservation'][id];
			
			// relink visitors, if any selected for the search
				var vitems = this.controls.visitors.value();
				var vany = false;
			for(var vid in vitems) { 
				vany = vid;
				new C_dS_att_visitor('slots', [ virtualid--, id, class_visitor, vid ]);
			}
			if(vany) { // the resa.assess changed from any other to appointment
				if(resa.cssColor) resa.cssColor = 0; // reset color, a default color was applied during new resa streaming rmeta();
				if(resa.cssPattern) resa.cssColor = 0; // reset color, a default pattern was applied during resa streaming rmeta();
			}
			
			// re-apply color and status when duplicate or replan
			if(this.state.duplicate) {
				resa.note = this.state.duplicate.note;
				resa.cssColor = this.state.duplicate.ccsscolor;
				resa.cssPattern = this.state.duplicate.ccsspattern;
				resa.cssTags = this.state.duplicate.ccsstags;
				if(this.state.duplicate) {
					resa.replan = this.state.duplicate.replan; // is the id of dS_reservation to be moved
					resa.duplicate = this.state.duplicate&&(!this.state.duplicate.replan);
				}
			}
			
			// relink workcodes, if any selected for the search
				var witems = this.controls.workcodes.value();
			for(var wid in witems) new C_dS_performance('slots', [ virtualid--, id, wid, vany||0 ]);
			
			resa.rmeta();
			this.slots.feed(resa);
			
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
		this.controls.continued.set(cueLast);
		
			var slotshtml = this.slots.display(); // returns an html <table>
		if(this.callbacks.freshslots) this.callbacks.freshslots.cb(slotshtml); // should be displayed in an html container by the upper parent
		this.slots.activate();

		this.buttons.search.caption(C_XL.w('more search'));
	},
	slotclick: function(resa) {
		
		if(this.callbacks.slotselect) this.callbacks.slotselect.cb(resa); // should be displayed in an html container by the upper parent

	},

	stbylistfresh: function(inlineDataSets) {
		if(vbs) vlog('small.js','C_sSA','stbylistfresh',''); 
		this.buttonsReset();
		var cueLast = 0;
		this.slots = new C_sSlots(this.eids.slots, { selected:new A_cb(this, this.slotclick) }, {tip:true});
		for(var id in inlineDataSets['C_dS_reservation']) {
			var resa = inlineDataSets['C_dS_reservation'][id];
			this.slots.feed(resa);
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
		this.controls.continued.set(cueLast);
		this.elements.output.innerHTML = this.slots.display({duration:true, visitors:true});
		this.buttons.stbylist.caption(C_XL.w('continued'));
		this.slots.activate();
	},
	connfailed: function() { this.buttonsReset(); },
	preferences: function(dataSets, stream) {
		this.sumUpPreferences();
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//     H O R I Z O N T A L     S L I D E R
//

function C_sHslide(eid, callbacks, preset, parent) { // preset like { content:html, caption:html }
		var b = eid+'_';
	this.eids = { eid:eid };
	this.elements = new A_el();
	this.state = C_sHslide.defaults.align(preset);
	this.controls = new A_ct({});
	this.parent = parent;
}
C_sHslide.defaults = new A_df({ content:'', caption:'' });
C_sHslide.prototype = { 
	display: function() { 
			var w = 100/this.parent.state.scount;
		return '<div id="'+this.eids.eid+'" class="iSlide" style="float:left; width:'+w+'%; height:100%;">'+this.state.content+'</div>'; 
	},
	caption: function() { return this.state.caption; },
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_sDP');
	},
	content: function(html) { this.elements.eid.innerHTML = html; },
	wrapper: function() { return this.elements.eid; }
}


//////////////////////////////////////////////////////////////////////////////////////////////

function C_sHslider(eid, options, callbacks, preset) { // options like { 0:{caption:'label1', content:'Hello'}, 1:{caption:'label2', content:'Fine'}, 2:{caption:'label3', content:'Bye bye'} }
	this.ctrlname = 'C_sHslider';
	this.options = options;
		var b = eid+'_';
	this.eids = { viewport:b+'h_vwprt', wrapper:b+'h_wrapr', scroller:b+'h_scrlr', indicator:b+'h_indic' };
	this.elements = new A_el();
	this.callbacks = callbacks || {};
	this.state = C_sHslider.defaults.align(preset);
	
	this.slides = new A_ct({});
	for(var v in this.options) { // opreset like { content:html, caption:html }
				var opreset = this.options[v];
				var sid = eid+'_'+v;
			var b = new C_sHslide(sid, { oncaption: false }, opreset, this );
		this.slides.add1(b, v); this.state.scount++; // slides counter
	}
	this.controls = new A_ct({});
	
	this.iscroll = false;
}
C_sHslider.defaults = new A_df({ scount:0, topbar:0 });
C_sHslider.prototype = {
	viewport: function() {
				var slides = '';
				for(var v in this.slides.get) slides += this.slides.get[v].display(); 
				
				var w = 100*this.state.scount;
				var scrolstyle = 'z-index=2; width:'+w+'%; height:100%; transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);';
			var scroller = '<div id="'+this.eids.scroller+'" style="'+scrolstyle+'" class="iScroller">'+slides+'</div>';
		var wrapper = '<div id="'+this.eids.wrapper+'" style="width:100%; height:100%;">'+scroller+'</div>';
		var viewport = '<div  id="'+this.eids.viewport+'" style="position:relative; width:100%; height:100%; margin:0 auto; overflow: hidden;">'+wrapper+'</div>';
			// var footer = '<div class="slide-footer" style="position:absolute; width:100%; bottom:0; height:3em;">'+'</div>'; // white shwadowed fading (not in use)
		
		var s = this.sections().vp;
		return '<div style="position:absolute; width:100%; top:'+s.top+'em; bottom:'+s.bottom+'em;">'+viewport+'</div>'; // +footer; // (*i1*) 2.5em = .5em (the border-top where the indicator slides) + 2em (the indicator symbols area)
	},
	indicator: function(options) { // options like {topbar:{html:html, eid:eid}}
		
				var w = 100/this.state.scount;
				var ds = 'position: absolute; width:'+w+'%; height:.4em; border-radius:10px; background:rgba(0,0,0,.3); transition-duration: 0ms; display: block; transform: translate(0px, 0px) translateZ(0px); transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);';
			var dotty = '<div id="dotty" style="'+ds+'"></div>';
		
					var captions = '';
					for(var v in this.slides.get) captions += '<td style="width:'+w+'%; text-align:center; vertical-align:middle; white-space:nowrap; overflow:hidden;">'+this.slides.get[v].caption()+'</td>'; 
					captions = '<table style="table-layout:fixed; width:100%;"><tr style="line-height:2em; border-top:.5em solid transparent;">'+captions+'</tr></table>'; // (*i1*)
				var sbs = 'position: relative; width:100%; margin:0 auto; background:rgba(0,0,0,.1);';
			var scrollbar = '<div id="'+this.eids.indicator+'" class="" style="'+sbs+'" >'+dotty+captions+'</div>';
		
		// top bar insertion
		var topbar='';
		if(options)
		if(options.topbar) {
			var eid = options.topbar.eid?'eid='+options.topbar.eid+' ':'';
			var html = options.topbar.html?options.topbar.html:'';
			var s = this.sections();
			topbar = '<div '+eid+'style="position:absolute; width:100%; top:'+s.tb.top+'em; bottom:'+s.tb.bottom+'em; overflow:hidden">'+html+'</div>';
		}
		return '<div style="position:absolute; width:100%; height:2.5em;">'+scrollbar+'</div>'+topbar;
	},
	activate: function() {
		
		this.elements.collect(this.eids);
		this.elements.viewport.scrollLeft = 0; // the browser remembers a previous setting of any scroller on the page. Set back to initial position.
		
		this.controls.activate('C_sHslider');
		this.slides.activate('C_sHslider');
	// console.log('---'+this.eids.wrapper);
		this.iscroll = new IScroll(this.elements.wrapper, {
			scrollX: true,
			scrollY: false,
			momentum: true,
			snap: true,
			snapSpeed:200,
			keyBindings: true,
			eventPassthrough: false, // allows vertical scroll
			indicators: { el: this.elements.indicator, resize: false }
		});
	// console.log('---B');
			var handlers = new A_hn({ bounce:new A_cb(this, this.bounce) });
	
		this.iscroll.on('bounceStart', handlers.bounce);
		this.iscroll.on('beforeScrollStart', function(e) { 
			if(is.tactile) e.preventDefault(); // prevents inner vertical scrolling to propagate to outer frame vertical scroller, see also (*bnc*)
			e.stopPropagation(); 
		}); 
		
		// console.log('H SCROLL MONITORING: - '+this.eids.viewport+':'+this.elements.viewport.scrollLeft+'- '+this.eids.wrapper+':'+this.elements.wrapper.scrollLeft)

		
		return this;
	},
	gotopage: function(p) { 
		if(p!=this.iscroll.currentPage.pageX) this.iscroll.goToPage(p,0,1000);
	},
	pageel: function(p) { 
		// var that=this; setTimeout(function(){ console.log('REFRESH'); return that.iscroll.refresh()},0);
		return this.slides[p].wrapper(); 
	},
	
	//privates
	sections: function() {
		var tb = this.state.topbar;
		return { ind:{top:0}, vp:{top:2.5+tb, bottom:0}, tb:{top:2.5, bottom:2.5+tb} };
	},
	
	// callbacks
	bounce: function(to, on) {
		switch(to) {
			case 'right':  if(this.callbacks.bounceright) this.callbacks.bounceright.cb(); break;
			case 'left': if(this.callbacks.bounceleft) this.callbacks.bounceleft.cb(); break;
		}
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//     B R O W S E     F R O M    C A L E N D A R     to     A P P O I N T M E N T    (horizontal scrolling)
//

function C_sCalview(eid, callbacks, preset ) { // uses C_sHslider
		var b = eid+'_';
	this.eids = { eid:eid, dp:b+'dp', planning:b+'pl', hvl:b+'hvl' };
	this.elements = new A_el();
	this.state = C_sCalview.defaults.align(preset);
	this.callbacks = callbacks || {};
	
	var sDP = new C_sDP(this.eids.dp, { datechanged:new A_cb(this, this.dpchanged), incremented:new A_cb(this, this.incremented) }, {});
	var planning = new P_Vertical(this.eids.planning, { resaopen:new A_cb(this, this.resaopen) }, { rescId:mobminder.account.single, days:1 } );
	
						var MSIEfix = ''; if(is.browser.MSIE) MSIEfix = 'height:100%;'; // height:100% is necessary only for MSIE
					var hvl = '<div class="P_AgendaHVL" id="'+this.eids.hvl+'" style="'+MSIEfix+'">'+planning.display()+'</div>'; 
	
				var s0 = {caption:'<div style="" class="fa fa-gray fa-13x fa-calendar"></div>', content:sDP.calendar()}; // page 0
				// var s1 = {caption:'<div style="" class="fa fa-gray fa-13x fa-list"></div>', content:'p1' }; // planning.display()
				var s1 = {caption:'<div style="" class="fa fa-gray fa-13x fa-list"></div>', content:hvl }; // planning.display()
				var s2 = {caption:'<div style="" class="fa fa-gray fa-13x fa-clock-o"></div>', content:'no appointment seelected'};
				var s3 = {caption:'<div style="" class="fa fa-gray fa-13x fa-user"></div>', content:'no visitor selected'};
			var slides = { 0:s0, 1:s1, 2:s2, 3:s3 };
		var slider = new C_sHslider(eid, slides, this.callbacks, { topbar:2.5 });  // passes callbacks.bounceleft
	this.controls = new A_ct({ slider:slider, sDP:sDP, planning:planning });
	
	
}
C_sCalview.defaults = new A_df({ zoom:true });
C_sCalview.prototype = { 

	display: function() { 
			// var div = '<div style="height:2.5em; background:rgba(0,0,154,.5);" >'+'</div>'; // bottom shade effect
			var topbar = this.controls.sDP.display();
		return this.controls.slider.indicator( {topbar:{html:topbar}} )+this.controls.slider.viewport();
	},
	activate: function() {
		if(vbs) vlog('mobminder.js','C_sCalview','activate','eid:'+this.eids.eid); 
		this.elements.collect(this.eids);
		// this.controls.sDP.activate('C_sCalview');
		this.controls.activate('C_sCalview');
		this.controls.planning.setdate(this.controls.sDP.getdate());
		this.zoom();
		return this;
	},
	zoom: function(zoom) {
		this.state.zoom = zoom||this.state.zoom;
		
		// change the icon on screen
		if(this.controls.zoom) { //exists only after this.vheader() has been called
			var s;
			if(this.state.zoom) s = symbol('zoom-out','fa-13x','padding-right:.5em;');
				else s = symbol('zoom-in','fa-13x','padding-right:.5em;');
			this.controls.zoom.set(s); 
		}
		
		// change the display mode
		$(this.elements.hvl).removeClass('zoom'); if(this.state.zoom) $(this.elements.hvl).addClass('zoom'); // toggles a css indicator  // see (*zm001)		
		if(this.controls.planning) if('zoom' in this.controls.planning) this.controls.planning.zoom(this.state.zoom);
	}, 
	
	// controls callbacks
	dpchanged: function(jsd) {
		if(vbs) vlog('mobminder.js','C_sCalview','dpchanged','new date:'+jsd.sortable()); 

		this.controls.planning.setdate(jsd);
		this.gotopage(1);
	},
	incremented: function(jsd) { this.controls.planning.setdate(jsd); },
	
	resaopen: function(cueable) { // called from planning display
		
		// console.log(cueable);
			var id = cueable.id;
			var dS_resa = cueable.resa();
			var focus = (id<=0?'onvisitors':'onnote');
			
				var callbacks = { 
					  saved:new A_cb(this, this.resasaved), deleted:new A_cb(this, this.resadeleted), escaped:new A_cb(this, this.resaescaped)
					, newvisitor:new A_cb(this, this.newvisitor), visiclick:new A_cb(this, this.visiclick) 
					}
			var m = new M_RESA(dS_resa, callbacks, { focus:focus, embedded:true } );
			
			var page = this.controls.slider.pageel(2);
			
		page.innerHTML = m.modal.display();
		m.activate();
		this.gotopage(2);
		return this.mresa = m;
		
	},
	resasaved: function(dataSets) {		
		var resa = false;
		for(var id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('mobminder.js','C_sCalview','resasaved','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		this.controls.sDP.settopdate(resa.jsDateIn); // that calls in return this.dpchanged();
	},
	resadeleted: function(jsDate) {	this.controls.sDP.settopdate(jsDate); }, // that calls in return this.dpchanged();
	resaescaped: function() { this.gotopage(1);	},
	resaclick: function(dS_resa) { // called from visitor's modal history tab 
		return this.resaopen({id:dS_resa.id, resa:function(){return dS_resa;}});	// make a cueable object, readable for resaopen()
	}, 
	
	newvisitor: function(digits) { 
		var v = new M_VISI(false, { saved:new A_cb(this, this.newvisitorsaved), escaped:new A_cb(this, this.visitorescaped)}, { parent:this.mresa, digits:digits } ); 
		return this.visishow(v);
	},
	visiclick: function(dS_visitor) { 
	
			var callbacks = { 
				  saved:new A_cb(this, this.visitorsaved), escaped:new A_cb(this, this.visitorescaped), resaclick:new A_cb(this, this.resaclick)
				}
		var v = new M_VISI(dS_visitor, callbacks, { parent:this.mresa, embedded:true });
		return this.visishow(v);
	},
	visishow: function(modalv) {
			var page = this.controls.slider.pageel(3);
		page.innerHTML = modalv.modal.display();
		modalv.activate();
		this.gotopage(3);
		return this.mvisi = modalv;
	},
	visitorsaved: function(dSs) { this.mresa.visitorsaved(dSs); this.controls.slider.gotopage(2);	},
	newvisitorsaved: function(dSs) { this.mresa.newvisitorsaved(dSs); this.controls.slider.gotopage(2);	},
	visitorescaped: function() { this.gotopage(2); },
	
	// private
	gotopage: function(p) {		
		// following asynchronism is necessary as the P_Sticker::up() $(document).unbind('mouseup') and P_GRID.dragging = false; prevent the animation when run is same threat
		var that=this; setTimeout(function(){ return that.controls.slider.gotopage(p) },100);
	}
}







//////////////////////////////////////////////////////////////////////////////////////////////
//
//     B R O W S E     F R O M    S E A R C H    T O   A P P O I N T M E N T    (horizontal scrolling with snap)
//

function C_sSearchview(eid, callbacks, preset ) { // uses C_sHslider
		var b = eid+'_';
	this.eids = { eid:eid, dp:b+'s1_dp' };
	this.elements = new A_el();
	this.state = C_sSearchview.defaults.align(preset);
	this.callbacks = callbacks || {};
	
	var sSA = new C_sSA(this.eids.dp, { freshslots:new A_cb(this, this.freshslots), slotselect:new A_cb(this, this.slotselect)}, {});
	
				var s0 = {caption:'<div style="" class="fa fa-gray fa-13x fa-binoculars"></div>', content:sSA.display()}; // page 0
				var s1 = {caption:'<div style="" class="fa fa-gray fa-13x fa-list"></div>', content:sSA.dispslots()};
				
				// var s0 = {caption:'<div style="" class="fa fa-gray fa-13x fa-binoculars"></div>', content:'popo'}; // page 0
				// var s1 = {caption:'<div style="" class="fa fa-gray fa-13x fa-list"></div>', content:'pipi'};
				
				var s2 = {caption:'<div style="" class="fa fa-gray fa-13x fa-clock-o"></div>', content:'Appointment'};
				var s3 = {caption:'<div style="" class="fa fa-gray fa-13x fa-user"></div>', content:'Bye bye'};
				var s4 = {caption:'<div style="" class="fa fa-gray fa-13x fa-rss"></div>', content:'Goodnight'};
			var slides = { 0:s0, 1:s1, 2:s2, 3:s3, 4:s4 };
		var slider = new C_sHslider(eid, slides, this.callbacks, {}); // passes callbacks.bounceleft
	this.controls = new A_ct({ slider:slider, sSA:sSA });
}
C_sSearchview.defaults = new A_df({  });
C_sSearchview.prototype = { 

	display: function() { 
		return this.controls.slider.indicator()+this.controls.slider.viewport();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_sSearchview'); // during activation of sSA, the frame gets scrolled up by 63 pix
		return this;
	},
	
	// controls callbacks
	freshslots: function(slotshtml) {
		
		var page = this.controls.slider.pageel(1);
		page.innerHTML = slotshtml;
		this.gotopage(1);
	},
	slotselect: function(dS_resa) {
		
				var callbacks = { 
				  saved:new A_cb(this, this.resasaved), escaped:new A_cb(this, this.resaescaped)
				, newvisitor:new A_cb(this, this.newvisitor), visiclick:new A_cb(this, this.visiclick) 
				}
			var m = new M_RESA(dS_resa, callbacks, { focus:focus, embedded:true } );
			var page = this.controls.slider.pageel(2);
			
		page.innerHTML = m.modal.display();
		m.activate();
		
		this.gotopage(2)
		return this.mresa = m;
		
	},
	resasaved: function(dataSets) {		
		var resa = false;
		for(var id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('mobminder.js','C_sCalview','resasaved','resa.id:'+resa.id+', date:'+resa.jsDateIn.sortable()); 
		this.gotopage(0);
	},
	resaescaped: function() { this.gotopage(1);	},
	newvisitor: function(digits) { 
		var v = new M_VISI(false, { saved:new A_cb(this, this.newvisitorsaved), escaped:new A_cb(this, this.visitorescaped)}, { parent:this.mresa, digits:digits } ); 
		return this.visishow(v);
	},
	visiclick: function(dS_visitor) { 
		var v = new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved), escaped:new A_cb(this, this.visitorescaped)}, { parent:this.mresa });
		return this.visishow(v);
	},
	visishow: function(modalv) {
			var page = this.controls.slider.pageel(3);
		page.innerHTML = modalv.modal.display();
		modalv.activate();
		this.gotopage(3);
		return this.mvisi = modalv;
	},
	visitorsaved: function(dSs) { this.mresa.visitorsaved(dSs); this.gotopage(2);	},
	newvisitorsaved: function(dSs) { this.mresa.newvisitorsaved(dSs); this.gotopage(2);	},
	visitorescaped: function() { this.gotopage(2); },
	
	// private
	gotopage: function(p) {		
		var that=this; setTimeout(function(){ return that.controls.slider.gotopage(p) }, 100);
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//     V E R T I C A L      S L I D E R
//

function C_sVslide(eid, callbacks, preset, parent) { // preset like { content:html, caption:html }
		var b = eid+'_';
	this.eids = { eid:eid, caption:b+'cp' };
	this.elements = new A_el();
	this.callbacks = callbacks || {};
	this.state = C_sVslide.defaults.align(preset);
		var l = this.state.caption;
	this.h = 100/parent.state.scount;
	var caption = new C_iCLIK(this.eids.caption, { click:new A_cb(this, this.oncaption) }, {tag:'div', ui:this.state.caption, css:'', style:'height:'+this.h+'%; text-align:center; padding-top:100%; white-space:nowrap; overflow:hidden;'});
	this.controls = new A_ct({caption:caption}); // forseen for interactive indicator captions
}
C_sVslide.defaults = new A_df({ content:'', caption:'', value:false });
C_sVslide.prototype = { 
	display: function() { 
			
		return '<div id="'+this.eids.eid+'" class="ivSlide" style="position:relative; height:'+this.h+'%; width:100%;">'+this.state.content+'</div>'; 
	},
	caption: function() { 
	
		return this.controls.caption.display(); 
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_sVslide');
	},
	content: function(html) { this.elements.eid.innerHTML = html; },
	oncaption: function(html) { if(this.callbacks.oncaption) this.callbacks.oncaption.cb(this.state.value); }
}



//////////////////////////////////////////////////////////////////////////////////////////////

function C_sVslider(eid, options, callbacks, preset) { // options like { 0:{caption:'label1', content:'Hello'}, 1:{caption:'label2', content:'Fine'}, 2:{caption:'label3', content:'Bye bye'} }
	this.ctrlname = 'C_sVslider';
	this.options = options;
		var b = eid+'_';
	this.eids = { viewport:b+'v_vwport', wrapper:b+'v_wrapr', scroller:b+'v_scrlr', indicator:b+'v_indic', indiwrapper:b+'v_indwp' };
	this.elements = new A_el();
	this.callbacks = callbacks || {};
	this.state = C_sVslider.defaults.align(preset);
	
	this.slides = new A_ct({});
	for(var v in this.options) this.state.scount++; // must be computed before construction of slides
	for(var v in this.options) { // opreset like { content:html, caption:html }
				var opreset = this.options[v];
				var sid = eid+'_'+v;
			var b = new C_sVslide(sid, { oncaption:new A_cb(this, this.oncaption) }, opreset, this );
		this.slides.add1(b, v); 
	}
	this.controls = new A_ct({});
	this.iscroll = false;
	this.faderdelay = false;
}
C_sVslider.defaults = new A_df({ scount:0, scrolling:false, menufading:false, menuon:false });
C_sVslider.prototype = {
	viewport: function() {
				var slides = '';
				for(var v in this.slides.get) slides += this.slides.get[v].display(); 
				
				var h = 100*this.state.scount; // make it 80% if you want the top of the next slide is visible at the bottom of the screen (so you can grasp it and slide it up)
				var scrolstyle = 'z-index=1; height:'+h+'%; width:100%; transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);';
			var scroller = '<div id="'+this.eids.scroller+'" style="'+scrolstyle+'" class="iScroller">'+slides+'</div>';
		var wrapper = '<div id="'+this.eids.wrapper+'" style="position:absolute; width:100%; top:0px; bottom:0px;">'+scroller+'</div>';
		var viewport = '<div id="'+this.eids.viewport+'" class="main-viewport" style="position:relative; width:100%; height:100%; overflow: hidden;">'+wrapper+'</div>';
		return viewport;
	},
	indicator: function() {
		
				var h = 100/this.state.scount;
				var ds = 'position: absolute; height:'+h+'%; width:1em; border-radius:10px; background:rgba(255,255,255,.7); transition-duration: 0ms; display: block; transform: translate(0px, 0px) translateZ(0px); transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);';
			var dotty = '<div style="'+ds+'"></div>';
		
					var captions = ''; for(var v in this.slides.get) captions += this.slides.get[v].caption(); 
					captions = '<div style="width:100%; height:100%; border-left:1em solid transparent;">'+captions+'</div>';
				var sbs = 'position:relative; height:100%; width:100%;';
			var scrollbar = '<div id="'+this.eids.indicator+'" class="minder-background" style="'+sbs+'" >'+dotty+captions+'</div>';
		return '<div id="'+this.eids.indiwrapper+'" style="z-index:10; position:absolute; top:0; left:0; width:5em; height:100%;">'+scrollbar+'</div>';
	},
	activate: function() {
		
		this.elements.collect(this.eids);
		this.elements.viewport.scrollTop = 0; // the browser remembers a previous setting of any scroller on the page. Set back to initial position.
		this.controls.activate('C_sVslider');
		this.slides.activate('C_sVslider');
		
		this.iscroll = new IScroll(this.elements.wrapper, {
			scrollX: false, scrollY: true, momentum: true, snap: '.ivSlide',
			snapSpeed:500, keyBindings: true, eventPassthrough: false, // we do not pass this to the body
			indicators: { el: this.elements.indicator, resize:false	}
		});
		var handlers = new A_hn({ iScrolling:new A_cb(this, this.iScrolling), iScrolldone:new A_cb(this, this.iScrolldone)});
		this.iscroll.on('scrollStart', handlers.iScrolling);
		this.iscroll.on('scrollEnd', handlers.iScrolldone);
		this.menu(true,{delay:2000}); // show the main menu on the left side for 2 seconds
		
		// console.log('V SCROLL MONITORING: - '+this.eids.viewport+':'+this.elements.viewport.scrollTop+'- '+this.eids.wrapper+':'+this.elements.wrapper.scrollTop)
		
		return this;
	},
	gotopage: function(i) { 
		var c = this.iscroll.currentPage.pageY;
		if(vbs) vlog('mobminder.js','C_sVslider','gotopage','current:'+c+', destination:'+i);
		if(i!=c) this.iscroll.goToPage(0,i,1200);
	},
	
	// DOM events
	iScrolling: function() { // iScroll events - tactile only -
		if(vbs) vlog('mobminder.js','C_sVslider','iScrolling','');
		if(!this.state.scrolling) { // calls only once above
			this.state.scrolling = true;
			if(this.state.menuon==false) this.menu(true); // the lefter menu appears on screen during scrolling
		}
		return false;
	}, 
	iScrolldone: function() { // iScroll events - tactile only -
		this.state.scrolling = false;
		this.menu(false, {delay:1000}); // the lefter menu fades away after scrolling
		if(vbs) vlog('mobminder.js','C_sVslider','iScrolldone','');
		return true;
	}, 
	faderdelayover: function() {
		if(vbs) vlog('mobminder.js','C_sVslider','faderdelayover','');
		this.faderdelay = false;
		var h = new A_hn({ fading:new A_cb(this, this.fading),faded:new A_cb(this, this.faded)});
		h.fading(); $(this.elements.indiwrapper).fadeOut({duration:600,easing:'linear',complete:h.faded});
	},
	fading: function() { this.state.menufading = true; this.state.menuon=false; },
	faded: function() { this.state.menufading = false; },
	menu: function(onoff, options) {
		
		
		if(this.state.menufading) return; // no state change during busy fading away
		
		if(onoff===undefined) onoff = !this.state.menuon; // toggles by default
		if(this.faderdelay) { clearTimeout(this.faderdelay); this.faderdelay = false };
		if(onoff) {
			$(this.elements.indiwrapper).show(); 
			this.state.menuon=true;
			options = options || {delay:5000}; // unless otherwise specified, the menu disappears after a while
		} 
		else { 
			if(!options) this.faderdelayover();
		}
		
		var delay = false; if(options) if(options.delay) delay = options.delay;
		if(vbs) vlog('mobminder.js','C_sVslider','menu','on:'+onoff+', delay:'+delay);
		
		// organize fade away of menu
			var h = new A_hn({ over:new A_cb(this, this.faderdelayover)});
		if(delay) this.faderdelay = setTimeout(h.over,options.delay);
			
		return this.state.menuon;
	},
	oncaption: function(v) { this.gotopage(v); }
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//      A P P    M A I N   F R A M E   L A Y E R   (vertical scrolling with snap)
//

function C_sFrameLayer(eid, callbacks, preset ) {
		var b = eid+'_';
	this.eids = { eid:eid, menu:b+'menu' };
	this.elements = new A_el();
	this.state = C_sFrameLayer.defaults.align(preset);
	this.callbacks = callbacks || {};
	
	// display of topper line

		var menu = new C_iCLIK(this.eids.menu, { click:new A_cb(this, this.menu) }, 
				{tag:'td', ui:'', css:'mindercolor fa fa-15x fa-th-large', style:'width:3em; min-width:3em; text-align:center; vertical-align:middle;'});

			var valign = '<table style="height:100%;"><tr>'+menu.display()+'</tr></table>';
		var righter = '<div style="position:absolute; top:0; right:0; bottom:0; z-index:1;">'+valign+'</div>';

			var surfername = '<span class="topper-surfer">('+mobminder.context.surfer.name+')</span>';
			var toppercaption = '<h1>'+mobminder.account.name+surfername+'</h1>';
			var agendaname = 'agenda name';
		var lefter = '<div style="width:100%; max-width:100%; overflow-x:hidden; white-space:nowrap; vertical-align:middle;">'+toppercaption+'</div>';

	var topper = '<div style="height:100%;">'+lefter+righter+'</div>';
	$('#topper').html(topper);
	

	// left pop up menu

		var bounceleft = new A_cb(this, this.bounceleft);
	var calview = new C_sCalview('cvw', {bounceleft:bounceleft}); 
	var search = new C_sSearchview('svw', {bounceleft:bounceleft}); 
	
				var l0 = { value:0, caption:'<div style="display:inline-block" class="fa fa-gray fa-17x fa-calendar"></div>',	content: calview.display()	}; // page 0 calview.display()
				var l1 = { value:1, caption:'<div style="display:inline-block" class="fa fa-gray fa-17x fa-binoculars"></div>', content: search.display()	}; // page 1 
				var l2 = { value:2, caption:'<div style="display:inline-block" class="fa fa-gray fa-17x fa-users"></div>', 		content:'3rd frame'		};
				var lb = { value:3, caption:'<div style="display:inline-block" class="fa fa-gray fa-17x fa-circle"></div>', 	content:'About'				}; // page bottom - About
			var slides = { 0:l0, 1:l1, 2:l2, 3:lb };
		var slider = new C_sVslider(eid, slides, {}, {}); 

	this.controls = new A_ct({ menu:menu, calview:calview, search:search, slider:slider });
}
C_sFrameLayer.defaults = new A_df({ });
C_sFrameLayer.prototype = { 

	display: function() { 
		return this.controls.slider.indicator()+this.controls.slider.viewport();
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_sFrameLayer');
	},
	
	
	// controls callbacks
	menu: function(jsd) {
		this.controls.slider.menu(); //toggles menu on or off screen
	},
	bounceleft: function() {
		this.controls.slider.menu(true, {delay:2000}); //toggles menu on or off screen
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//

is.newtouch = true; // activates class C_iFIELD  in place of C_iEDIT

s_MOB = function s_MOB(baseline, keyId, language) {

	if(vbs) vlog('small.js','s_MOB','constructor','key:'+keyId); 
	mobminder.app = this;
	mobminder.app.hidedeleted = true;
	
	this.baseline = baseline;
	
	this.eids = { remote:'eresa' };
	this.elements = new A_el();
	this.elements.collect({body:'body'});
	
	C_iWIN.setbodyclass();
	
	this.controls = new A_ct( { frame:false} );
		
	this.display();
	this.getconfig(keyId);
}
s_MOB.prototype = {
	display: function() { // display on screen stuff that is NOT config dependant
		if(vbs) vlog('small.js','s_MOB','display',''); 
		// $('html, body').animate({ scrollTop:$('#body').offset().top }, 1000);
	},
	activate: function() {
		if(vbs) vlog('small.js','s_MOB','activate',''); 
		this.elements.collect(this.eids);	
		this.controls.activate('s_MOB');
	},
	post: function(controls, names, target, success, failure, options) { // failure is called in case of timeout OR if a command is received
			var ajaxfeedback = new A_cb(this, this.ajaxfeedback, { success:success, failure:failure /* callbacks (*88*) */});
			var ajaxtimeout = new A_cb(this, this.ajaxtimeout, failure);
			
			if('key' in names) // keep names, do not use ('key' in controls) as controls may have been modified once already
			{ /* this specific post is passing a key (see e.g. the login process) (*40*) */ }
			else { 
				if(!mobminder.context) { warning('mobminder.js','C_iMOB','post','no context, no post done'); key = new C_iPASS('x'); }  // check (*ck*) posting key = 0 would create a new account when the login is a seller type
					else var key = new C_iPASS({baseline:mobminder.app.baseline, key:mobminder.context.keyId});
				names['key'] = {baseline:'b', key:'k'};
				controls['key'] = key; 
			} // then work with the one that came through the configuration
			
		var post = new A_ps(controls, names, target, {onreply:ajaxfeedback, ontimeout:ajaxtimeout}, options);
	},
	showdesk: function(visible) {},
	
	// ajax feedbacks
	ajaxfeedback: function(callbacks /* (*88*) */, stream) { // called when the date is change from the TOP menu, applies jsdate on current planning screen

		var dscode = stream.extract('<code>','</code>').match; 
		var command = stream.extract('<command>','</command>').match;  
		
			if(vbs) vlog('mobminder.js','C_iMOB','ajaxfeedback','command:'+command);
			
		var datasets = false;
		if(dscode) datasets = C_inlineStreaming.createDataSets(dscode);
		
		if(command) switch(command) {
			case 'logoff': 
				C_iMODAL.closeall();
				this.controls.top.logout(); 
				this.elements.boff.innerHTML = '';
				this.controls.top.show(); 
				if(callbacks.failure) callbacks.failure.cb(command); return; 
				break;
			case 'reload': // this command is issued when the code version on the server does not match the baseline at client side
				location.reload();
				break;
		}
		if(callbacks.success) { callbacks.success.cb(datasets, stream); }
	},	
	ajaxtimeout: function(failure) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		if(vbs) vlog('small.js','s_MOB','ajaxtimeout','');
		// new C_iMSG(C_XL.w('connection failed'));
		// if(failure) failure.cb();
	},	
	
	// private
	getconfig: function(k) {
		
		if(vbs) vlog('small.js','s_MOB','getconfig','');
			var key = new C_iPASS({baseline:mobminder.app.baseline, key:k}); // passes the key of the config that should be loaded (*40*)
			mobminder.app.post({key:key}, {key:{baseline:'b', key:'k'}}, '../queries/config.php', new A_cb(this,this.configloaded), new A_cb(this,this.failed));
	},
	configloaded: function() { // display on screen stuff that is config dependant
		this.controls.frame = new C_sFrameLayer('vfrm'); 
		$('#viewport').html(this.controls.frame.display());
		var c = this.controls.frame;
		c.activate();
	},
	failed: function() {
		console.log('failed to contact server');
		
	}
};


window.onload = function () { 
	// this keeps your session alive
	new C_iWatchdog({wait:C_iWatchdog.defaults.rythm}); // check (*ck*), wait installs a delay before sending the first call
	
	// avoid bouncing of body : None of all this bullshit worked, only this: (*bn1*) in the css style
	// document.addEventListener('touchmove',function(e) {e.preventDefault();},false);
	// window.ontouchmove = function(e){ console.log('Window bbbboucing...'); e.preventDefault(); return false; } // (*bnc*) prevents the uggly bouncing when scrolling the body up or bottom
	// var body = document.getElementsByTagName('body')[0];
		// body.ontouchmove = function(e){ console.log('Body bbbboucing...'); e.preventDefault(); /*e.stopPropagation();*/ return false; }
} 


