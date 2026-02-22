//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//       T B C   pas terminé !
//
//

//////////////////////////////////////////////////////////////////////////////////////////////
//   P I C K   O U T   F R O M   e - P E R F O R M A N C E S
//
C_ePERF = function(eid, callbacks, preset) {
	this.eids = { picker:eid+'_pickr' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { oneperf: }
	this.state = C_ePERF.defaults.align(preset);
	this.optionspreset = [];
		var which = undefined;
		if(mobminder.context.surfer.eresaWorkcodes) { // this login uses only a subset of the defined e-workcodes
			which = [];
			var ids = mobminder.context.surfer.eresaWorkcodes.split('!');
			for(var x in ids) { var id = ids[x]; which[id] = id; }
		}
			var options = C_dS_workcode.options({eWorkcodes:true, checked:'first', which:which});
	this.opcount = options.count;
	var picker = new C_iCRESTA(this.eids.picker, {onchange:new A_cb(this,this.onpicker)}, options
								, { maxrows:(is.small?false:12), maxcols:3, skin:0, title:C_XL.w('workcode'), mode:-1 }
							);

	this.controls = new A_ct({picker:picker});
}
C_ePERF.defaults = new A_df({ });
C_ePERF.prototype = {
	// public
	display: function(css) { 
		if(this.opcount==1) return '';
		else return this.controls.picker.display('select-header '+(css||''));
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		// var id = this.controls.picker.getpost();
		// if(this.callbacks.oneperf) this.callbacks.oneperf.cb([id]);
	},
	getpost: function() {
		var workcode = this.controls.picker.getpost(); 
		return workcode;
	},
	value: function() { return this.getpost(); },
	
	// private
	
	// callbacks
	onpicker: function(id) {
		if(this.callbacks.oneperf) this.callbacks.oneperf.cb([id]);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E G I S T R A T I O N     F O R M 
//

function C_iSLIDE(eid, callbacks, preset) { // double buttons horizontally aligned with responsive up/down behaviour
		var b = eid+'_';
	this.eids = { buttons:{above:b+'abv', under:b+'udr' }, own:{ wrappy:b+'wrp', drawer:b+'drw', busy:b+'bsy' } };
		
		defbutton = { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' };
	preset = preset || { above:defbutton, under:defbutton };
	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onabove:, onunder:, afterabove:, afterunder: }
	this.state = C_iSLIDE.defaults.align(preset);
	
	var above 	= this.outer(this.eids.buttons.above, 'above', preset.above, {onbutton:new A_cb(this, this.onabove)});
	var under 	= this.outer(this.eids.buttons.under, 'under', preset.under, {onbutton:new A_cb(this, this.onunder)});

	if(vbs) vlog('unsubscribe.js','C_iSLIDE','constructor',''); 

	this.controls = new A_ct({above:above, under:under});
	this.overlay = false;
}
C_iSLIDE.defaults = new A_df({ isopen:false, busy:false });
C_iSLIDE.prototype = {

	display: function(css) {
			var l = this.controls.above.display(); // makes responsiveness possible
			var r = this.controls.under.display();
			var d = '<div id="'+this.eids.own.drawer+'" class="slider-drawer" style="width:150%; overflow:hidden; white-space:nowrap; margin:0 auto 0 0;">'+l+r+'</div>';
		var b = '<div id="'+this.eids.own.wrappy+'" class="slider-wrappy" style="height:3em; overflow:hidden; position:relative;">'+d+'</div>'; /* height must stay here, should stick to height of display:table-cell */
		return b;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		this.set(false,1); // be sure to have closed controls
		return this;
	}, 
	enable: function(onoff) { // onoff like { above:onoff, under:onoff }
		for(var lr in onoff) {
			switch(lr) {
				case 'above': this.controls.above.enable(onoff.above); break;
				case 'under': this.controls.under.enable(onoff.under); break; 
			}
		}
	},
	caption: function(which) { // which like { above:{ caption:'newcaption', cssfa:'exclamation-circle' }, under:{ caption:'newcaption', cssfa:'exclamation-circle' } }
		for(var lr in which) {
			switch(lr) {
				case 'above': this.controls.above.caption(this.inner(which.above)); break;
				case 'under': this.controls.under.caption(this.inner(which.under)); break; 
			}
		}
	},
	busy: function(onoff) {  // onoff like true or false
		
		var getoverlay = function(eid, callback) {
			callback = callback || { onbusy:false };
			
					var symbol = '<div class="fa fa-2x fa-spinner fa-pulse" style="color:grey; padding-under:.6em; display:inline-block;"></div>'; // icon and text
			
					var bstyle = 'display:table-cell; height:2.5em; vertical-align:middle; text-align:right; padding:.2em 2em; overflow:hidden'; // table-cell makes text vertical middle possible
				var b = '<div id="'+eid+'" style="'+bstyle+'">'+symbol+'<span style="white-space:nowrap;">'+''+'</span></div>';
					b = '<span style="display:inline-block;">'+b+'</span>'; // enables text-align capability, display:inline-block might seem strange but Safari does not consider span an inline-block by default... 
			
			var s = 'z-index:20; display:inline-block; position:absolute; top:0; left:0; width:150%; height:100%; overflow:hidden; text-align:right;';
			
			return new C_iCLIK(eid, { click:callback.onbusy }, 	{ tag:'div', ui:b, css:'slider-busy', style:s, tip:'please wait, this control is busy...' }  );
		}
		
		if(onoff && !this.state.busy) {
			this.overlay = getoverlay(this.eids.own.busy);
			$(this.elements.own.wrappy).append(this.overlay.display());
			this.overlay.activate();
		}
			else if(onoff==false && this.state.busy) { this.overlay.remove(); this.overlay = false; }
		
		this.state.busy = onoff;
		return this;
	},
	remove: function() { // remove the control from the DOM
		this.controls.above.remove(); // removes the tip that might be on the screen
		this.controls.under.remove();
		if(this.overlay) this.overlay.remove();
		$(this.elements.own.wrappy).remove();
	},
	
	// private
	inner: function(preset) { // inner html of a sliding area
				preset = preset || { caption:'caption', cssfa:'exclamation-circle' };
				var symbol = preset.cssfa?'<div class="fa fa-11x fa-'+preset.cssfa+'" style="display:inline-block;"></div>':''; // icon and text
				var bstyle = 'display:table-cell; height:2.5em; vertical-align:middle; padding:.2em .5em; overflow:hidden'; // table-cell makes text vertical middle possible
			var b = '<div style="'+bstyle+'">'+symbol+'<span style="white-space:nowrap; padding-left:1em;">'+preset.caption+'</span></div>'; 
				b = '<span style="display:inline-block;">'+b+'</span>'; // enables text-align:right capability
		return b;
	},
	outer: function(eid, which, skin, callback) { // outer control of a sliding area
				callback = callback || { onbutton:false };
				skin = skin || { caption:'caption', tip:'tip', csscolor:'c255', cssfa:'exclamation-circle' }
			var inner = this.inner(skin);
			var width='100%'; switch(which) { case 'above': width='67%'; break; case 'under': width='33%'; break; };
			var csscl; switch(which) { case 'above': csscl='slider-above'; break; case 'under': csscl='slider-under'; break; };
			var s = 'display:inline-block; width:'+width+'; margin:0; text-align:right;';
		return new C_iCLIK(eid, { click:callback.onbutton }, { tag:'div', ui:inner, css:csscl+' '+skin.csscolor, style:s, tip:skin.tip, idle:skin.idle }  );
	},
	set: function(o, quick) { 
		if(!this.elements.own.wrappy) return;
			s = quick?0:600;
			o = o||!this.state.isopen;
		var d = $(this.elements.own.drawer).width();
		var w = $(this.elements.own.wrappy).width();
		var u = $(this.controls.under.element()).offset().left;
		
		if(vbs) vlog('unsubscribe.js','C_iSLIDE','onabove','open:'+o+', wrappy:'+w+', drawer:'+d+',  under:'+u);
		if(o) $(this.elements.own.wrappy).animate({ scrollLeft:0 }, s); 
		else $(this.elements.own.wrappy).animate({ scrollLeft:d/3*2  }, s); 
		
		if(this.callbacks.onabove) this.callbacks.onabove.cb(); 
		this.state.isopen = o;
	},
	
	//callbacks
	onabove: function() { var action = true; if(this.callbacks.onabove) action = this.callbacks.onabove.cb(); if(action) this.set(); if(this.callbacks.afterabove) this.callbacks.afterabove.cb(this.state.isopen); },
	onunder: function() { if(this.callbacks.onunder) this.callbacks.onunder.cb(); },
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E S E R V A T I O N    D I S P L A Y 
//
C_eRESA = function(resa, callbacks, preset) {

	this.state = C_eRESA.defauts.align(preset = preset || {});
	this.dataSet = resa; 
	this.callbacks = callbacks; // like { saved:o_callback, escaped:o_callback, failed:o_callback };
	var base = 'eresa_'+resa.id+'_';
	this.eids = { note:base+'note', conf:base+'conf', action:base+'action' };
	this.elements 	= new A_el();
	
	if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'constructor', 'resaId:'+this.dataSet.id+', may delete:'+this.state.maydelete);
	

	var id			= new C_iPASS({id:this.dataSet.id, archived:0, peerId:0, bank:'visiapps' });
	var schedule	= new C_iPASS({cin:this.dataSet.cueIn, out:this.dataSet.cueOut});
	
	var staff		= new C_iPASS({ bCals:this.dataSet.getstaff(class_bCal), uCals:this.dataSet.getstaff(class_uCal) , fCals:this.dataSet.getstaff(class_fCal) });
		var v = this.dataSet.getvisitors();
	var visitors	= new C_iPASS(this.dataSet.getvisitors());
	var workcodes	= new C_iPASS(this.dataSet.getperformances());
	
	var note 		= mobminder.context.surfer.eresaAllowNote ? new C_iNOTE(this.eids.note, this.dataSet.note) : false;
	var confirm 	= new C_iBUTTON(this.eids.conf, new A_cb(this, this.save), { caption:C_XL.w('confirm'), width:10, height:2.5 } );

			this.delayed = new A_cb(this,this.remove,null,new A_cb(this,this.onremove),1000);
			var afterabove = new A_cb(this,this.afterabove);
		
	this.captions = {
		summary: { caption:this.summary(), tip:'', csscolor:'', cssfa:'calendar-check', idle:!this.state.maydelete },
		remove: { caption:C_XL.w('delete'), tip:'', csscolor:'', cssfa:'calendar-times' },
		// confrmv: {caption:C_XL.w('e- del confirm'),cssfa:'warning' }
	}
	var action = new C_iSLIDE(this.eids.action, {afterabove:afterabove, onunder:this.delayed }, {above:this.captions.summary, under:this.captions.remove });

	
	this.controls 	= new A_ct( { id:id, staff:staff, visitors:visitors, workcodes:workcodes, schedule:schedule, note:note, confirm:confirm, action:action } );
	

}
C_eRESA.defauts = new A_df( { maydelete:false } );
C_eRESA.prototype = { 
	// public
	summary: function() { // returns time and date for this appointment		
		var date = C_XL.date(this.dataSet.jsDateIn, {abreviation:'full', weekday:true, year:!is.tactile });
		var cin = this.dataSet.jsDateIn.HHmm();
		var cout = this.dataSet.jsDateOut.HHmm();
		return date+', '+C_XL.w('fromtime',{cap:0})+'&nbsp;'+cin+'&nbsp;'+C_XL.w('to',{cap:0})+'&nbsp;'+cout;
	},
	action: function() { // appears where the list of appointments is displayed for an identified visitor
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'schedule', 'resaId:'+this.dataSet.id);
		return this.controls.action.display();
	},
	display: function() { // appears where you can confirm your new appointment, just before it is saved
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'display', 'resaId:'+this.dataSet.id);
			var n = this.controls.note ? this.controls.note.display('','') : '';
			var b = this.controls.confirm.display({css:'e-button'});
			
		var notefield = '<div>'+n+'</div>';
		var bconfirm = '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+b+'</div>';

		return notefield+bconfirm;
	},
	activate: function() {
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'activate', 'resaId:'+this.dataSet.id);
		this.controls.activate('C_eRESA');
		this.elements.collect(this.eids);
	},

	
	// event handling
	save: function() {
		this.controls.confirm.busy(true);
		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		var names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id', archived:'archived', peerId:'peerId', bank:'bank' }
			, visitors:'visitors', workcodes:'workcodes', note:'note', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' } };
		mobminder.app.post(this.controls, names, './post/reservation.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) this.dataSet.unregister();
	},
	afterabove: function(isopen) { // control face ui is touched
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'afterabove', 'isopen:'+isopen);
		if(!isopen) { // set back to initial conditions (*ic01*)
			// this.controls.action.caption({under:this.captions.remove}); // pvh 2019: changed behaviour to one click removal, so this caption & callback settings are not necessary anymore
			// this.controls.action.callbacks.onunder = this.delayed;	
		}
	},
	onremove: function() { // immediate call when under shield is touched
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'onremove', '');
		this.controls.action.busy(true);
	},
	remove: function() { // one seconds after button was hit
		this.controls.action.busy(false);
		
		var names = {id:{id:'id', archived:'archived' } };
		mobminder.app.post(this.controls, names, './delete/reservation.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		
		// pvh 2019: changed behaviour to one click removal
		// this.controls.action.callbacks.onunder = new A_cb(this,this.removeconfirmed); // change initial conditions (*ic01*)
		// this.controls.action.caption({under:this.captions.confrmv});
		// if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'remove', 'now confirm');
	},
	removeconfirmed: function() { // second time button is hit // pvh 2019: you never reach here anymore
		if(vbs) vlog('unsubscribe.js', 'C_eRESA', 'removeconfirmed', '');
		this.controls.action.busy(true);
		var names = {id:{id:'id', archived:'archived' } };
		mobminder.app.post(this.controls, names, './delete/reservation.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
	},
	
	// callbacks
	
	// ajax callback event handlers
	saved: function(dataSets) {
		this.controls.confirm.busy(false);
		if(this.callbacks.saved) this.callbacks.saved.cb(dataSets);
	},
	deleted: function() {
		this.controls.action.remove();
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dataSet.id);
		if(this.dataSet.id>0) this.dataSet.unregister();
	},
	failed: function() { 
		this.controls.action.busy(false);
		if(this.callbacks.failed) this.callbacks.failed.cb();
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//   S L O T S    D I S P L A Y 
//
C_iRPOP = function(eid, dSresa, onClick, preset) {
	this.resa = dSresa;
	this.id = dSresa.id;
	var positive = this.id<0 ? this.id*-1 : this.id;
	
	this.eids = { time:eid+'_'+positive, date:eid+'_date_'+positive };
	this.elements = new A_el();
	this.callbacks = { onClick:onClick };
	this.state = C_iRPOP.defauts.align(preset);
	
	var dpop = new C_iDPpop(this.eids.date, this.resa.jsDateIn, { setdate:mobminder.app.setdate });
	var time = new C_iCLIK(this.eids.time, { click:new A_cb(this, this.time) } , { tag:'a', ui:this.resa.text.time.cin } );
	
	this.controls = new A_ct({time:time, dpop:dpop});
}
C_iRPOP.defauts = new A_df( { enabled:true, css:'', tip:false } );
C_iRPOP.prototype = { 
	// public
	display: function() {
		var d = '<td>'+this.controls.dpop.display()+'</td>';
		var t = '<td>'+this.controls.time.display()+'</td>';
		var b = '<td>'+this.resa.text.resources.b+'</td>';
		var u = ''; if(mobminder.account.has.uCal) u = '<td>'+this.resa.text.resources.u+'</td>';
		var f = ''; if(mobminder.account.has.fCal) f = '<td>'+this.resa.text.resources.f+'</td>';
		var w = ''; if(mobminder.account.has.workcodes) w = '<td>'+this.resa.text.workcodes+'</td>';
		var n = ''; if(!mobminder.account.has.uCal && !mobminder.account.has.fCal) n = '<td style="max-width:16em; overflow:hidden;">'+this.resa.note+'</td>';
		return d+t+b+u+f+w+n;
	},
	activate: function() {	
		this.elements.collect(this.eids);
		this.enable(this.state.enabled);
		this.controls.activate('C_iRPOP');
	},
	enable: function(onOff) { // can be called before or after activation
		this.state.enabled = !!onOff;
		if(this.elements.time) { // that is only if the element was activated
			switch(this.state.enabled) {
				case true: $(this.elements.time).removeClass('disabled').click(C_iRPOP.click); break;
				case false: $(this.elements.time).addClass('disabled').unbind('click', C_iRPOP.click); break;
			}
		}
		return this;
	},
	
	// event handling
	time: function() {
		if(this.callbacks.onClick) this.callbacks.onClick.cb(this.resa);
	}
}
C_iRPOP.display = function(resaPops_array) { // displays an array of resaPops
	
	if(!resaPops_array.length) return '<div style="margin:1em 0 1em 0;">'+C_XL.w('none')+'<div>';
	
	// headers
	var d = '<th>'+C_XL.w('date')+'</th>';
	var t = '<th>'+C_XL.w('time')+'</th>';
	var b = '<th>'+mobminder.account.nameof.bCal+'</th>';
	var u = ''; if(mobminder.account.has.uCal) u = '<th>'+mobminder.account.nameof.uCal+'</th>';
	var f = ''; if(mobminder.account.has.fCal) f = '<th>'+mobminder.account.nameof.fCal+'</th>';
	var w = ''; if(mobminder.account.has.workcodes) w = '<th>'+C_XL.w('workcodes')+'</th>';
	var n = ''; if(!mobminder.account.has.uCal && !mobminder.account.has.fCal) n = '<th>'+C_XL.w('note')+'</th>';
	var th = '<tr class="resapop-header">'+d+t+b+u+f+w+n+'</tr>';
	
	// appointments
	var tr = '<tr class="resapop-row">';
	var trs = new Array();
	for(var x in resaPops_array) {
		var o_easyRESAPOP = resaPops_array[x];
		trs.push(o_easyRESAPOP.display());
	}
	trs = trs.join('</tr>'+tr);
	
	// layout
	var tbody = th+tr+trs+'</tr>';
	return '<table summary="resa pops" class="resapop-table" style="white-space:nowrap;">'+tbody+'</table>';
}



C_iSLOT = function(eid, dS_reservation, callbacks, preset) { // a single slot entry
	this.resa = dS_reservation;
	var positive = this.resa.id<0 ? this.resa.id*-1 : this.resa.id;
	
	this.eids = { time:eid+'_'+positive, date:eid+'_date_'+positive };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { selected:A_cb };
	this.state = C_iSLOT.defauts.align(preset);
	C_iSLOT.eids[this.eids.time] = this;
	
	// build up register 
	var midnight = this.resa.midnight;
		
	var fCalsString = this.resa.text.resources.f;  //C_dS_attendee.getResourcesNames(this.resa.id, class_fCal);
	var bCalId 		= this.resa.bCal.id;
	var uCalsString = this.resa.text.resources.u; //C_dS_attendee.getResourcesNames(this.resa.id, class_uCal);
	
	C_iSLOT.register.add(this, 'midnight', midnight, fCalsString, bCalId, uCalsString, this.resa.cueIn);
	
	this.fCalsString = fCalsString;
	this.uCalsString = uCalsString;
	
	var time = new C_iCLIK(this.eids.date, { click:new A_cb(this, this.selected)} , { ui:this.resa.text.time.cin, tag:'span', style:'min-width:2em; float:left;' } );
	this.controls = new A_ct({time:time});
}
C_iSLOT.defauts = new A_df( { enabled:true, css:'', tip:false } );
C_iSLOT.register = new C_registers({name:'midnight', order:true}); 
C_iSLOT.eids = new Array(); 
C_iSLOT.prototype = { 
	// public
	displayTime: function() {
		C_iSLOT.toBeActivated.add1(this);
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
		this.controls.activate('C_iSLOT');
	},	
	selected: function() {
		if(this.callbacks.selected) this.callbacks.selected.cb(this.resa);
	}
};
(C_iSLOT.flush = function() {
	C_iSLOT.eids = new Array(); 
	C_iSLOT.register.flush('midnight'); 
	rmems.flush('slots');
	C_iSLOT.toBeActivated = new A_ct();
})();
C_iSLOT.display = function() { // displays the collection of C_iSLOT instances, in a specialy ordered way
	var prevMidnight = false;
	var prev_bCalId = false;
	var trs = new Array();
		var rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
	var staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal) };

	// scanning dates
	for(m in C_iSLOT.register.midnight.ordered) { // C_iSLOT.register.midnight[midnight][fCals][bCal][uCals][time] = o_SLOT
		
		var midnight = C_iSLOT.register.midnight.ordered[m];
		
		// scanning uCals for a given bCal
		var fCalsStrings = C_iSLOT.register.midnight[midnight]; 
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
					var dateTd = '<td class="slots-date" style="width:30%; text-align:left;">'+dateShow+'</td>';
					
					var bCalTd = '';
						if(!mobminder.account.single && staffshow.bCals) { cc++; bCalTd = '<td class="slots-bcal" style="width:30%;"> '+bCalShow+'</td>'; }
						
					var uCalsTd = ''; 
						if(uCalsString!='-'&&staffshow.uCals) { cc++; uCalsTd = '<td class="slots-ucal"  style="width:30%; text-align:right;"> '+uCalsString+'</td>'; }
					
					var fCalsTd = '';
						if(fCalsString!='-'&&staffshow.fCals) { cc++; fCalsTd = '<td class="slots-fcal" style="width:30%;"> '+fCalsString+'</td>'; }
					
					var screenbreaker = ''; //= is.small?'</tr><tr style="border-top:none;">':''; // on iPhone, the dates come above the time slots proposals
					var colspan = ''; //is.small?(' colspan='+cc):''; // on iPhone, the dates come above the time slots proposals
					
					var slotsTd = '<td class="slots-time" '+colspan+' style="">'+slots+'</td>';
					
					trs.push(dateTd+bCalTd+uCalsTd+screenbreaker+slotsTd+fCalsTd);
					prevMidnight = midnight;
					prev_bCalId = bCalId;
				}
			}
		}
		prev_bCalId = false;
	}
	trs = trs.length ? trs.join('</tr><tr>') : '<tr><td style="font-size:bigger; font-weight:bold;  padding-top:.5em;">'+C_XL.w('no e-search result')+'<td></tr>';
	trs = '<tr>'+trs+'</tr>';
	return '<table summary="results" class="slots" style="">'+trs+'</table>';
}
C_iSLOT.activate = function() { 
	C_iSLOT.toBeActivated.activate(); 
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    e R E S A    P R O G R E S S    I N D I C A T I O N
//
C_eStep = function(eid, preset) {
	this.classname = 'C_eStep';
	this.eids = { on:eid+'_on', off:eid+'_off' };
	this.elements = new A_el();
	this.state = C_eStep.defaults.align(preset);
}
C_eStep.defaults = new A_df( { symbol:false, step:1, caption:'hello', on:true } );
C_eStep.prototype = {
	display: function() {
		var disabled = '<span id="'+this.eids.off+'" class="e-step off-air" style="display:inline-block;">'+this.step('disabled')+'</span>';
		var onair = '<span id="'+this.eids.on+'" class="e-step" style="display:inline-block;">'+this.step()+'</span>';
		return disabled+onair;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.set(this.state.on);
	},
	set: function(onOff, oncaption) {
		this.state.on = onOff;
		if(this.elements.on) { // then it is in the DOM
			if(this.state.on){ $(this.elements.on).show(); $(this.elements.off).hide(); }
				else { $(this.elements.off).show(); $(this.elements.on).hide(); }
		}
		return this;
	},
	caption: function(caption) {
		caption = caption||C_XL.w(this.state.caption);
		$(this.elements.on).find('.e-bullet-caption').html(caption);
		return this;
	},
	slideto: function() {
		if(this.elements.on) $('html, body').animate({ scrollTop: $(this.elements.on).offset().top }, 1000);
		return this;
	},
	
	// private
	step: function(mode) { // this is the caption appearing at right side of the bullet
			mode = mode || '';
			var inner = this.state.symbol; if(mode=='disabled') inner = this.state.step;
		var step = this.bullet(inner, mode)+'<div class="e-bullet-caption '+(mode||'')+'">'+C_XL.w(this.state.caption)+'</div>';
		return step;
	},
	bullet: function(caption, css) { // this is the bullet
		css = css || '';
		var bullet = '<div class="e-bullet '+css+'" style="display:table-cell;">'+caption+'</div>';
		return bullet;
	}
}

C_eProgress = function(eid) {
	this.classname = 'C_eProgress';
	this.elements = new A_el();
	this.eids = { ident:eid+'_ident', search:eid+'_search', select:eid+'_select', confirm:eid+'_confirm', thanks:eid+'_thanks' };
	
	var ident 	= new C_eStep(this.eids.ident, 	{ step:1, caption:'e-step ident', 	on:true   , symbol:symbol('ident') });
	var options = new C_eStep(this.eids.search, { step:2, caption:'e-step options', on:false  , symbol:symbol('options') });
	var select 	= new C_eStep(this.eids.select, { step:3, caption:'e-step select', 	on:false  , symbol:symbol('select') });
	var confirm = new C_eStep(this.eids.confirm,{ step:4, caption:'e-step confirm', on:false  , symbol:symbol('confirm') });
	var thanks 	= new C_eStep(this.eids.thanks, { step:5, caption:'e-step thanks', 	on:false  , symbol:symbol('thanks') });
	
	this.controls = new A_ct({ ident:ident, options:options, select:select, confirm:confirm, thanks:thanks });
	this.bystep = { 1:ident, 2:options, 3:select, 4:confirm, 5:thanks };
}
C_eProgress.prototype = { 
	display: function(step) {
		var steps = new Array();
		if(!step) for(var x in this.bystep) steps.push(this.bystep[x].display()); // returns all steps
			else steps.push(this.bystep[step].display()); // returns desired step
		return '<div class="e-step">'+steps.join('')+'</div>';
	},
	activate: function() {
		this.controls.activate('C_eProgress');
	},
	step: function(step, newcaption) { // turns ON the given step and FALSE all others
		for(var x in this.bystep) if(x>step) this.bystep[x].set(false);
		this.bystep[step].set(true,newcaption);
		return this;
	},
	caption: function(step, newcaption) { // modifies the caption of a step
		this.bystep[step].caption(newcaption); return this; 
	},
	slideto: function(step) { this.bystep[step].slideto(); return this; }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    C H E C K    I N    P R O C E S S  
//
//    This is in two parts:
//
//		1. Authentication
//		2. Identifying which person we appoint for, this phase has again 3 possible ways
//			2a. We find nobody using the verified email: Ask for birthday and mobile
//				2a1. Still nodody even with mobile? Offer to register in
//			2b. We find only one visitor having the given email, or phone/birthday
//			2c. We find many visitors having the same email, in this case:
//				2c1. We offer to choose one (or many) from the list
//				2c2. We offer to register another person on the same email
//
//
//
//	
//
// 


C_eToken = function(eid, callbacks) {
	this.classname = 'C_eToken';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { checked }

	this.eids = { msg:eid+'_msg', butt:eid+'_butt', field:eid+'_field' };
	
	var field 	= new C_iFIELD(this.eids.field, { onfchange:new A_cb(this, this.tokentype ), onenterkey:new A_cb(this, this.tokenenterkey ) }, { digits:'', type:INPUT_ALPHA, mandatory:true, placeholder:C_XL.w('token'), style:'padding-right:1em;', surround:true });
	var butt 	= new C_iBUTTON(this.eids.butt, new A_cb(this, this.token), { caption:C_XL.w('token validate'), width:8, height:2.5, enabled:false } );

	this.controls = new A_ct({field:field, butt:butt})
}
C_eToken.prototype = { 
	display: function() {
			var msg = '<div class="e-msg" >'+C_XL.w('token sent')+'<br/>'+C_XL.w('use token')+'<br/><strong><br/>'+C_XL.w('e-token warning')+'</strong></div>';
			var field = '<div class="e-msg" >'+this.controls.field.display(false,false,false,'margin-bottom:1em; margin-right:1em;')+this.controls.butt.display({css:'e-button'})+'</div>';
			var divs = msg+field;
		return divs;
	},
	activate: function() { this.elements.collect(this.eids.own); this.controls.activate('C_eToken'); },
	caption: function(caption) { this.controls.butt.caption(caption); },
	reset:function() { this.controls.field.set('');	},
	focus: function() { this.controls.field.focus(true); },
	
	// controls callbakcs
	tokentype: function(digits) { this.controls.butt.enable(!!digits.length); },
	tokenenterkey: function(digits, keycode) {	if(!!digits.length) this.token();  },
	token: function() { 
		this.controls.butt.busy(true);
		mobminder.app.post(this.controls, { field:'token' }, './eresa2/e-resa-token.php', new A_cb(this,this.tokenmatch, null, null, 800), new A_cb(this, this.connfailed));
	},
	tokenmatch: function(inlineDataSets, stream) {
		this.controls.butt.busy(false);
		var match = stream.split('<code>').shift();
		switch(match) {
			case 'match': 
				if(this.callbacks.checked) this.callbacks.checked.cb(true);
				break;
			case 'no token':
			case 'no checkin':
			case 'no match': 
				if(this.callbacks.checked) this.callbacks.checked.cb(false);
				break;
		}
	},
	connfailed: function() {
		this.controls.butt.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//	A U T H E N T I C A T E 
//
//  Email or mobile number verification
//	
//

C_eAuthenticate = function(eid, callbacks) { // authenticates a surfer
	this.classname = 'C_eAuthenticate';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { authified }
		var tokenauth = (mobminder.context.surfer.eresaAuthent==1 || mobminder.context.surfer.eresaAuthent==2);
		var patients = mobminder.account.visitorAlias==mobminder.visitor.codes.patient;
	this.has = { tokenauth:tokenauth, patients:patients };
	
		if(vbs) vlog('unsubscribe.js','C_eAuthenticate','constructor','token authentication:'+tokenauth+', patients:'+patients); 

	var b = eid+'_eAuth_';
	this.eids = { 	own: { div:b+'_div_all', welcome:b+'_div_welc', badtoken:b+'_div_bad'
							, email:b+'_div_email', mobile:b+'_div_mobl', bauth:b+'div_bauth'
							, msg:b+'_div_msg', warn:b+'_div_warn', form:b+'_div_form', token:b+'_div_token', demo:b+'_div_demo' },
					controls: { email:b+'_email', mobile:b+'_mobl', token:b+'_token' },
					buttons: { auth:b+'_bttauth'}
				};
				
	
		var typing = new A_cb(this, this.typing, null, null, 500);
		var onenter = new A_cb(this, this.onenter ); // this works only when the control got the focus()
		
	var email 	= new C_iFIELD(this.eids.controls.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email'), surround:true });
	var mobile 	= new C_iFIELD(this.eids.controls.mobile, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile'), surround:true });
	
	var auth 	= new C_iBUTTON(this.eids.buttons.auth, new A_cb(this, this.authenticate), {caption:C_XL.w('authify me'), enabled:false } );
	var token 	= new C_eToken(this.eids.controls.token, { checked:new A_cb(this,this.tokenchecked) } );
	
	this.controls = new A_ct({email:email, mobile:mobile, token:token});
	this.buttons = new A_ct({auth:auth});
	this.appointments = new A_ct();
	
	this.state = { authmode:'email', visitor:false, faillevel:0, valid:{email:false, mobile:false} };
}
C_eAuthenticate.prototype = {
	
	// register form
	display: function() {
		
		var postbd = '', postmobile = '';
		if(is.browser.MSIE) { // MSIE bullshit filling (has no placeholder)
			postmobile = '<span style="color:silver;">'+C_XL.w('mobile')+'</span>';
			postbd = '<span style="color:silver;">'+C_XL.w('dd-mm-yyyy',{cap:0})+'</span>';
		}
			var welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'" 	style="">'+C_XL.w('e-welcome')+'</div>';
			var bad 	= '<div class="e-msg" id="'+this.eids.own.badtoken+'" 	style="display:none;">'+C_XL.w('bad token')+'</div>';
			var email 	= '<div class="e-msg" id="'+this.eids.own.email+'" 		style="">'+this.controls.email.display('textual')+'</div>';
			var mobile 	= '<div class="e-msg" id="'+this.eids.own.mobile+'" 	style="display:none;">'+this.controls.mobile.display('textual')+postmobile+'</div>';
				
			var bauth 	= '<div class="e-btn" id="'+this.eids.own.bauth+'" 	style="">'+this.buttons.auth.display({css:'e-button'})+'</div>';
			
			var msg 	= '<div class="e-msg" id="'+this.eids.own.msg+'" 		style="display:none;">'+'</div>';
			var warn 	= '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="display:none; text-align:center;">'+C_XL.w('warn red field')+'</div>';
			var token 	= '<div class="" id="'+this.eids.own.token+'" 			style="display:none;">'+this.controls.token.display()+'</div>';
			var demo 	= '<div class="" id="'+this.eids.own.demo+'" 			style="display:none;">'+'</div>';
		var div = '<div id="'+this.eids.own.div+'">'+welcome+bad+msg+email+mobile+bauth+warn+token+demo+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eAuthenticate');
		this.buttons.activate('C_eAuthenticate');
		
	},
	focus: function() {
		
		switch(this.state.authmode) {
			case 'email': go = this.controls.email.focus(true); break;
			case 'mobile': go = this.controls.mobile.focus(true); break;
		}
	},
	
	// private
	extractoken: function(stream) { // we are in demo mode and instead of sending the token by mail, it is visible on the screen
		var split = stream.split('!'); split.shift(); // removes the first part conatining debug and status info
		var token = split.shift();
		this.elements.demo.innerHTML = '<div style="font-size:90%; text-align:right;">Demo token: '+token+'</div>';
		$(this.elements.demo).show();
	},
	
	// controls callbacks
	validauth: function() {
		this.state.valid.email = this.controls.email.valid();
		this.state.valid.mobile = this.controls.mobile.valid();
		var go = false;
		switch(this.state.authmode) {
			case 'email': go = this.state.valid.email; break;
			case 'mobile': go = this.state.valid.mobile; break;
		}
		this.buttons.auth.enable(go);
		return go;
	},
	typing: function(digits) { this.validauth(); },
	onenter: function() { if(this.validauth()) this.authenticate(); },
	tokenchecked: function(result) {
		if(result) {
				var e = this.controls.email.getpost();
				var m = this.controls.mobile.getpost();
			if(this.callbacks.authenticated) this.callbacks.authenticated.cb(e,m);
			return;
		}
		// bad token introduced
		this.controls.token.reset();
		$(this.elements.badtoken).show();
		$(this.elements.email).show(); 
		$(this.elements.bauth).show(); 
			this.controls.email.focus(true);
		$(this.elements.token).hide();
		$(this.elements.msg).hide();
	},
	
	// ajax calls
	authenticate: function() { // the 'authify me' button has been hit after email has been validly typed in
		this.buttons.auth.busy(true);
		this.controls.email.blur();
		this.controls.mobile.blur();
		$(this.elements.welcome).hide();
		$(this.elements.badtoken).hide();
		mobminder.app.post(this.controls, { email:'email', mobile:'mobile' }, './eresa2/authenticate.php', new A_cb(this,this.authenticated, null, null, 500), new A_cb(this, this.connfailed));
		
	},
	
	// ajax callbacks
	authenticated: function(dsets, stream) { // e-resa STEP 1: callback from initial email check
		$(this.elements.bauth).hide();
		this.buttons.auth.busy(false);
		if(this.has.tokenauth) if(mobminder.demo) this.extractoken(stream);
		if(!mobminder.context.surfer.eresaAuthent) this.tokenchecked(true); // no active authentication shortcut the token authentication
			else { $(this.elements.token).show(); this.controls.token.focus(); } // check the token sent on email or mobile
	},
	connfailed: function() {
		this.buttons.signin.busy(false);
		this.buttons.auth.busy(false);
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//	C H E C K    I N
//
//  List all visitors found based on given email and mobile number, offers an option to register more
//	
//
C_eCheckIn = function(eid, callbacks, options) { 
	this.classname = 'C_eCheckIn';
	this.elements = new A_el();
	this.wrappers = new A_el();
	this.callbacks = callbacks; // like { identified }
		var tokenauth = (mobminder.context.surfer.eresaAuthent==1 || mobminder.context.surfer.eresaAuthent==2);
		var patients = mobminder.account.visitorAlias==mobminder.visitor.codes.patient;
	this.has = { tokenauth:tokenauth, patients:patients };
	
		if(vbs) vlog('unsubscribe.js','C_eCheckIn','constructor','token authentication:'+tokenauth+', patients:'+patients); 

	this.eids = { 	own: { div:eid+'_div_all', prelist:eid+'_div_pre', postlist:eid+'_div_post', vlist:eid+'_div_vlist'
							, email:eid+'_div_email', mobile:eid+'_div_mobl', bident:eid+'div_bident'
							, regmsg:eid+'_div_msg', form:eid+'_div_form', demo:eid+'_div_demo' },
					inputs: { email:eid+'_email', mobile:eid+'_mobl' },
					controls: { registr:eid+'_registr' },
					buttons: { ident:eid+'_ident', more:eid+'_more', next:eid+'_next'},
					wrappers: { welcome:eid+'_wrp_welcome', vlist:eid+'_wrp_list', register:eid+'_wrp_register' }
				};

		var typing = new A_cb(this, this.typing, null, null, 500);
		var onenter = new A_cb(this, this.onenter ); // this works only when the control got the focus()
				
	var email 	= new C_iFIELD(this.eids.inputs.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email'), surround:true });
	var mobile 	= new C_iFIELD(this.eids.inputs.mobile, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile'), surround:true });
	
	var ident 	= new C_iBUTTON(this.eids.buttons.ident, new A_cb(this, this.ident), {caption:C_XL.w('identify me'), enabled:false } );
	
	var more 	= new C_iBUTTON(this.eids.buttons.more, new A_cb(this, this.more), {caption:C_XL.w('eresa register more'), enabled:true, hidden:false } );
	var next 	= new C_iBUTTON(this.eids.buttons.next, new A_cb(this, this.next), {caption:C_XL.w('eresa ident continue many'), enabled:true, hidden:false } );

		
	var registr = new C_eRegister(this.eids.controls.registr, { valid:new A_cb(this,this.validform), saved:new A_cb(this,this.newvisisaved) }, { shortform:!this.has.patients } );
	
	this.inputs = new A_ct({ email:email, mobile:mobile });
	this.controls = new A_ct({ registr:registr });
	this.buttons = new A_ct({ident:ident, more:more, next:next });
	this.appointments = new A_ct();
	
	this.state = { visitors:false, firstsignin:false, faillevel:0, valid:false };
}
C_eCheckIn.prototype = {
	
	// public
	display: function() {
		
				var postbd = '', postmobile = '';
				if(is.browser.MSIE) { // MSIE bullshit filling (has no placeholder)
					postmobile = '<span style="color:silver;">'+C_XL.w('mobile')+'</span>';
					postbd = '<span style="color:silver;">'+C_XL.w('dd-mm-yyyy',{cap:0})+'</span>';
				}
				var welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'">'+C_XL.w('fill mobile')+'</div>';
				var email 	= '<div class="e-msg" id="'+this.eids.own.email+'">'+this.inputs.email.display('textual')+'</div>';
				var mobile 	= '<div class="e-msg" id="'+this.eids.own.mobile+'">'+this.inputs.mobile.display('textual')+postmobile+'</div>';
				var bident 	= '<div class="e-btn" id="'+this.eids.own.bident+'">'+this.buttons.ident.display({css:'e-button'})+'</div>';
			var welcome = '<div id="'+this.eids.wrappers.welcome+'" style="display:block;">'+welcome+email+mobile+bident+'</div>';
				
			
				var prelist = '<div class="e-msg" id="'+this.eids.own.prelist+'" style="display:none">'+C_XL.w('eresa identified more')+'</div>';
				var postlist = '<div class="e-msg" id="'+this.eids.own.postlist+'" style="display:none">'+C_XL.w('eresa identified one')+'</div>';
				
				var vlist = '<div class="e-msg" id="'+this.eids.own.vlist+'">'+'</div>';
				var next = '<div class="e-btn">'+this.buttons.next.display({css:'e-button e-next stretch'})+'</div>';
				var more = '<div class="e-btn">'+this.buttons.more.display({css:'e-button e-more stretch'})+'</div>';
			var vlist = '<div id="'+this.eids.wrappers.vlist+'" style="display:none;">'+prelist+vlist+postlist+next+more+'</div>';
			
			
				var regmsg 	= '<div class="e-msg" id="'+this.eids.own.regmsg+'">'+C_XL.w('pls register')+'</div>';
				var form 	= '<div class="e-msg" id="'+this.eids.own.form+'"">'+this.controls.registr.display()+'</div>';
			var register = '<div id="'+this.eids.wrappers.register+'" style="display:none;">'+regmsg+form+'</div>';
			
				var demo 	= '<div class="" id="'+this.eids.own.demo+'" style="display:none;">'+'</div>'; // demo mode token cheat display
				
		var div = '<div id="'+this.eids.own.div+'">'+welcome+vlist+register+demo+'</div>';
		return div;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.wrappers.collect(this.eids.wrappers);
		this.inputs.activate('C_eCheckIn');
		this.controls.activate('C_eCheckIn');
		this.buttons.activate('C_eCheckIn');
	},
	set(email, mobile) {
		if(email) this.inputs.email.set(email);
		if(mobile) this.inputs.mobile.set(mobile);
	},
	focus() {
		this.inputs.mobile.focus(true);
	},
	visitors: function() {
		return this.state.visitors;
	},
	reset: function() {
		this.state = { visitors:false, faillevel:0, valid:false };
		
		this.inputs.email.clear(); this.inputs.mobile.clear();
		$(this.elements.welcome).show();
		this.buttons.ident.show(true); this.buttons.ident.caption(C_XL.w('identify me')); $(this.elements.bident).show();
		$(this.elements.email).show(); $(this.elements.dident).show(); this.inputs.mobile.focus(true);
	},
	
	// private
	showcandidates: function() {
		
			var visitors = this.state.visitors;
		var list = '', c = 0;
		for(var vid in visitors) {
			var dS_v = visitors[vid];
			list += C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname+',<br/>';
			c++;
		}
		
			$(this.elements.prelist).hide();
			$(this.elements.postlist).hide();
			$(this.wrappers.welcome).hide();
		
		if(c==0) {
			this.state.firstsignin = true; // first sign in for the given mobile number && email
			return this.more(); // the surfer was not identified in this account DB. Offer him to sign in
		}
		else if(c==1) {
			$(this.elements.postlist).show();
			this.buttons.next.caption(C_XL.w('eresa ident continue one'));
			$(this.elements.vlist).html(list);
			$(this.wrappers.vlist).show();
		}
		else { // c>1, many contacts have been found matching email/mobile
			$(this.elements.prelist).show();
			this.buttons.next.caption(C_XL.w('eresa ident continue many'));
			$(this.elements.vlist).html(list);
			$(this.wrappers.vlist).show();
			
		} 
	},
	
	// controls callbacks
	typing: function() {
		var newstate = this.inputs.isvalid();
		if(newstate!=this.state.valid) {
			if(this.callbacks.valid) this.callbacks.valid.cb(newstate);
			this.buttons.ident.enable(newstate);
		}
		return this.state.valid = newstate;
	},
	onenter: function(digits) { if(this.typing()) this.ident(); },
	
	validform: function(isvalid) { // callback from C_eRegister
	},
	newvisisaved: function(dSvisitor) { // callback from C_eRegister
		$(this.wrappers.register).hide();
		this.state.visitors[dSvisitor.id] = dSvisitor;
		this.showcandidates();
	},

	
	// ajax calls
	ident: function() { // the 'identify me' button has been hit after email has been validly typed in
		this.buttons.ident.busy(true);
		this.inputs.email.blur();
		this.inputs.mobile.blur();
		mobminder.app.post(this.inputs, { email:'email', mobile:'mobile' }, './eresa2/identify.php', new A_cb(this,this.candidates), new A_cb(this, this.connfailed));
	},
	more: function() {
		
			var e = this.inputs.email.getpost();
			var m = this.inputs.mobile.getpost();
		this.controls.registr.reset(e,m);
			
		this.controls.registr.setcaption(this.state.firstsignin);
		
		$(this.wrappers.register).show(); // shows visitor data registration form
		$(this.wrappers.vlist).hide();
		this.controls.registr.focus();
		
	},
	next: function() { // this is the only way out from this process
		// $(this.elements.vlist).hide();
		if(this.callbacks.identified) this.callbacks.identified.cb(this.state.visitors, this.state.firstsignin);
		
	},
	
	// ajax callbacks
	candidates: function(inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
		this.buttons.ident.busy(false);
		if(!this.state.visitors.count) this.state.newsignin = true;
		this.state.visitors = inlineDataSets['C_dS_visitor'] || new Array(); // visitor(s) matched to email or mobile
		this.showcandidates();
	},
	connfailed: function() {
		this.buttons.ident.busy(false);
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//	R E G I S T E R
//
//  Associate a new visitor with authenticated email and mobile number
//	
//
C_eRegister = function(eid, callbacks, preset) {
	this.dataSet = new C_dS_visitor();
	this.callbacks = callbacks || {}; // like { valid: }
	var b = eid+'_eReg_';
	this.eids = { 	id:b+'id', gender:b+'gender', fname:b+'fname', lname:b+'lname', mobile:b+'mobile'
					, addr:b+'addr', zip:b+'zip', city:b+'city', country:b+'country', phone:b+'phone'
					, email:b+'email', bdate:b+'bdate', save:b+'regsave', 
					own: { warn:eid+'_div_warn' } 
				};
	this.elements = new A_el();
	this.state = C_eRegister.defaults.align(preset);
		
		var shortform = this.state.shortform;
	
		var typing = new A_cb(this, this.typing, null, null, 500);
		var typingfn = new A_cb(this, this.typingfn, null, null, 800); /* special cast for firstname whom we will try to guess the gender from */
		var onenter = new A_cb(this, this.onenter );
	
	var id = new C_iPASS(this.dataSet.id);
	
		
	var gender		= new C_iCRESTA(this.eids.gender, {}, { labels:{ 0:C_XL.w('gender_0'), 1:C_XL.w('gender_1') } }, { value:this.dataSet.gender, skin:0, title:false, mode:-1, value:0, maxrows:2 }  );

		var po_fn = C_XL.w('firstname');
		var po_ln = C_XL.w('lastname');
		switch(mobminder.context.surfer.profession) { // (*es01*)
			case 214: po_fn = C_XL.w('child firstname'); po_ln = C_XL.w('child lastname'); break; // pediatrician 
			case 296: po_fn = C_XL.w('owner firstname'); po_ln = C_XL.w('owner lastname'); break; // veterinary 
		}
	var lname 		= new C_iFIELD(this.eids.lname, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.lastname, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:po_ln, surround:true });
	var fname 		= new C_iFIELD(this.eids.fname, { onfchange:typingfn, onenterkey:onenter }, { digits:this.dataSet.firstname, type:INPUT_TEXT, mandatory:true, placeholder:po_fn, surround:true });
	var mobile 		= new C_iFIELD(this.eids.mobile, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.mobile, type:INPUT_MOBILE, mandatory:true, placeholder:C_XL.w('mobile'), surround:true });

	var addr 		= new C_iFIELD(this.eids.addr, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.address, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('address'), surround:true });
	var zip 		= new C_iFIELD(this.eids.zip, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.zipCode, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('zipCode'), surround:true });
	var city 		= new C_iFIELD(this.eids.city, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.city, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('city'), surround:true });
	var country		= new C_iFIELD(this.eids.country, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.country, type:INPUT_TEXT, mandatory:!shortform, placeholder:C_XL.w('country'), surround:true });
	var phone 		= new C_iFIELD(this.eids.phone, { onfchange:typing, onenterkey:onenter }, { digits:this.dataSet.phone, type:INPUT_PHONE, mandatory:false, placeholder:C_XL.w('phone'), surround:true });
	
	var email 		= new C_iFIELD(this.eids.email, { onfchange:typing, onenterkey:onenter }, { digits:'', type:INPUT_EMAIL, mandatory:true, placeholder:C_XL.w('email'), surround:true });
	var bdate 		= new C_iFIELD(this.eids.bdate, { onfchange:typing, onenterkey:onenter }, { type:INPUT_BDATE, mandatory:!shortform, placeholder:C_XL.w('dd-mm-yyyy',{cap:0}), surround:true });

	var save 		= new C_iBUTTON(this.eids.save, new A_cb(this, this.onsave), { caption:C_XL.w('i sign in'), enabled:false } );
	
	
	this.controls = new A_ct( { save:save, id:id, email:email, bdate:bdate, gender:gender, fname:fname, lname:lname, mobile:mobile, addr:addr, zip:zip, city:city, country:country, phone:phone } );
	this.state = { valid:false };
}
C_eRegister.defaults = new A_df( { shortform:false } );
C_eRegister.prototype = { 
	// public
	display: function(css) {
	
		// coordinates left side
		var gender 	= '<div>'+this.controls.gender.display()+'</div>';
		
		var fname 	= '<tr>'+this.controls.fname.td('textual')+'</tr>';
		var lname 	= '<tr>'+this.controls.lname.td('textual')+'</tr>';
		var mobile 	= '<tr>'+this.controls.mobile.td('textual')+'</tr>';
		var phone 	= '<tr>'+this.controls.phone.td('textual')+'</tr>';
		var bdate 	= '<tr>'+this.controls.bdate.td('textual')+'</tr>';
		
		// coordinates right side
		var addr 	= '<tr>'+this.controls.addr.td('textual')+'</tr>';
		var zip 	= '<tr>'+this.controls.zip.td('textual')+'</tr>';
		var city 	= '<tr>'+this.controls.city.td('textual')+'</tr>';
		var country = '<tr>'+this.controls.country.td('textual')+'</tr>';
		var email 	= '<tr>'+this.controls.email.td('textual')+'</tr>';
		
		var cl = '<table class="v-coords-left" style="">'+lname+fname+mobile+phone+bdate+'</table>';
		var cr = '<table class="v-coords-right" style="">'+addr+zip+city+country+email+'</table>';
		
		var form = '<div class="e-coords">'+cl+cr+'</div>';
		var save = 	'<div class="e-btn" style="">'+this.controls.save.display({css:'e-button'})+'</div>';
		var warn = '<div class="e-msg e-warner" id="'+this.eids.own.warn+'" style="text-align:center;">'+C_XL.w('warn red field')+'</div>';

		return gender+form+save+warn;
	},
	activate: function() {	
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eRegister'); return this;	
		this.state.valid = this.controls.isvalid();
	},
	reset: function(email, mobile) {
		
		this.controls.email.set(email);
		this.controls.mobile.set(mobile);
		
		this.controls.fname.set('');
		this.controls.bdate.set('');
	},
	setcaption: function(first) {
			var c = C_XL.w('sign in');
			if(first) c = C_XL.w('i sign in');
		this.controls.save.caption(c);
	},
	save: function() { // programmaticaly trigger a save
		var names = { id:'id', email:'email', bdate:'birthday', gender:'gender', fname:'firstname', lname:'lastname', mobile:'mobile', addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone'};
		mobminder.app.post(this.controls, names, './post/visitor.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	focus: function() { this.controls.lname.focus(true); },
	
	// private

	// event handling
	typing: function(d) {
		var newstate = this.controls.isvalid();
		if(newstate!=this.state.valid) {
			if(this.callbacks.valid) this.callbacks.valid.cb(newstate);
			this.controls.save.enable(newstate);
			if(newstate) $(this.elements.warn).hide(); else $(this.elements.warn).show();
		}
		
		return this.state.valid = newstate;
	},
	typingfn: function(d) {
		var names = { fname:'name' };
		mobminder.app.post(this.controls, names, './queries/gender.php', new A_cb(this,this.gender), new A_cb(this,this.failed));

		return this.typing(d);
	},
	onenter: function(digits) { if(this.typing()) this.save(); },
	remove: function() { },
	escape: function() { return true; },
	onsave: function() { this.save(); },

	// ajax callback event handlers
	gender: function(dS, stream) {
		
		var s = stream.split('##');
		var gender = s[0];
		
		if(gender == 'x') {
			this.state.match = false; 
		} else {
			this.controls.gender.docheck(gender|0);
			this.state.match = true; 
		}
		
	},
	saved: function(inlineDataSets) {
		var visitors = inlineDataSets['C_dS_visitor'];
		var id = 0; for(id in visitors) break;
		if(this.callbacks.saved) this.callbacks.saved.cb(visitors[id]);
	},
	failed: function() { 
		this.controls.cartouche.failuremsg(); 
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//  C H E C K      E X I S T I N G      A P P O I N T M E N T S 
//	
//
//
C_eVappointments = function(eid, callbacks, preset) { // downloads and displays visitor data
	this.classname = 'C_eVappointments';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { loaded: }
	
	this.eids = { 	own: { wrp:eid+'_wrap_capps' },
					controls: { email:eid+'_email' },
					buttons: { ident:eid+'_ident'}
				};
				
	this.state = C_eVappointments.defaults.align(preset);
	
	this.controls = new A_ct({});
	this.buttons = new A_ct({});
	this.appointments = new A_ct();
	
}
C_eVappointments.defaults = new A_df( { dSvisitor:false } );
C_eVappointments.prototype = {
	
	// public
	display: function() {
		return '<div id="'+this.eids.own.wrp+'" class="" style="">'+'</div>';
	},
	appload: function(vids) { // id is the visitor id that we request the data of
			
		// vids is an array like vids[vid] = dS_visitor holding the selected visitors ids		
		for(var vid in vids) vids[vid].apps = []; // we add a member 'apps' to each objects
		this.state.dSvisitors = vids;
		
			var ids = arrayKEYS(vids);
			var ctls = new A_ct({ids:new C_iPASS(ids.join(','))});
			var names = {ids:'ids'};
		mobminder.app.post(ctls, names, './eresa2/visiapps.php', new A_cb(this,this.cappsdata,vids), new A_cb(this, this.connfailed));
	},
	vappscount: function(vid) {
		var c = 0;
		var vs = this.state.dSvisitors;
		if(vid) { // count for one given visitor
			var dS_v = vs[vid];
			for(var rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;			
		} else
			for(var vid in vs) { // total count for all visitors
				var dS_v = vs[vid];
				for(var rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;
			}
		return c;
	},
	ds: function() { return this.state.dSvisitors; },
	vcaption: function(vid) {
		var vs = this.state.dSvisitors;
		var dS_v = vs[vid];
		var cap = ''+C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname;
		return cap;
	},
	vlist: function() {
		var list = '';
		var vs = this.state.dSvisitors;
		for(var vid in vs) {
			var dS_v = vs[vid];
			list += this.vcaption(vid)+',<br/>';
		}
		return list;
	},
	appsdisplay: function() {
		
		var options = { maydelete:mobminder.context.surfer.eresaCancel, afterdelete:false, before:''};
			
		var list = '';
		var c = this.vappscount();
		
		if(c) {
			var vs = this.state.dSvisitors;
			for(var vid in vs) {
				var dS_v = vs[vid];
				var c=0; for(var rid in dS_v.apps) if(dS_v.apps[rid].deletorId==0) c++;	
				
				list += '<div class="e-visitor">'+this.vcaption(vid)+'</div>';
			
				if(!c) {
					list += '<div class="e-msg" style="padding-left:2em;">'+C_XL.w('e- has no planned appointment')+'</div>';	
					continue;
				}
				
					var apps = dS_v.apps;
				this.appointments = new A_ct();
					var ordered = []; for(var id in apps) ordered.push(id);
					var sortf = function(a,b){ if(apps[a].cueIn > apps[b].cueIn) return 1; else return -1; };
				ordered.sort(sortf);
				
				for(var x in ordered) {
					var dS_resa = apps[ordered[x]];
					if(dS_resa.deletorId!=0) continue;
					var eresa = new C_eRESA(dS_resa, { deleted:new A_cb(this, this.appdeleted) }, { maydelete:options.maydelete } );
						list += eresa.action();
						this.appointments.add1(eresa,id);
				}
			}
			
			var msgabove = '<div class="e-msg">'+C_XL.w('e- you are app yet on')+'</div>';
				var m = C_XL.w('e- deletion unavailable'); if(options.maydelete) m = is.tactile? C_XL.w('e- touch to delete') : C_XL.w('e- click to delete');
			var msgunder = '<div style="margin: 1em 0; text-align:right;">'+m+'</div>';
			
			$(this.elements.wrp).html(msgabove+list+msgunder);
			this.appointments.activate('C_eVappointments');
			
		} else {
			
			var noappyet = '<div style="margin: 1em 0;">'+C_XL.w('e- you have no appointments')+'</div>';
			$(this.elements.wrp).html(noappyet);
			
		}
		
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eVappointments');
		this.buttons.activate('C_eVappointments');
	},
	
	// private
	
	// controls callbacks
	appdeleted: function(resaId) { // from 
		if(this.callbacks.appdeleted) this.callbacks.appdeleted.cb(resaId);
		this.appload(this.state.dSvisitors);
		if(vbs) vlog('unsubscribe.js','C_eVappointments','appdeleted','resaId:'+resaId); 
	},
	
	
	// ajax calls
	
	// ajax callbacks
	cappsdata: function(vids, inlineDataSets, stream) { // e-resa STEP 1: callback from initial email check
			

		let resasbyvisitor = C_dS_att_visitor.getbyvisitor(); // we will need to display appointments by visitors
		for(let vid in resasbyvisitor) {
			let resas = resasbyvisitor[vid];
			for(let rid in resas) {
				let dS_resa = resas[rid];
				if(this.state.dSvisitors[vid]) // we need this check because if rid resa has multiple visitors, of which one is not part of the "family", then the code stops here with this error message "this.state.dSvisitors[vid] is undefined"
					this.state.dSvisitors[vid].apps[rid] = dS_resa;
			}
		}
		
		this.appsdisplay();
		
		if(this.callbacks.cappsloaded) this.callbacks.cappsloaded.cb(vids);
	},
	connfailed: function() {
		
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//  S E L E C T     V I S I T O R S    T O     A P P O I N T     F O R 
//	
//	Choose from allowed visitors to appoint for 
//	Allowed visitors:
//		- have not reached the future appointments limit
//		- are not blacklisted
//
//
C_eVselect = function(eid, callbacks, preset) {
	
	this.classname = 'C_eVselect';
	this.elements = new A_el();
	this.callbacks = callbacks; // like { vchosen }

	this.eids = { own: { div:eid+'_d', vselect:eid+'_vsel', next:eid+'_next' },
				controls: { vselect:eid+'_vs' },
				buttons: { more:eid+'_b_more', notme:eid+'_b_nme', next:eid+'_b_next'}
			};
	
	this.visitors = false; this.leadclass = C_dS_visitor;
	
	var next 	= new C_iBUTTON(this.eids.buttons.next, 	new A_cb(this, this.next), { caption:C_XL.w('continue'), width:20, height:2, enabled:true, hidden:false } );

	this.controls = new A_ct({ vselect:false });
	this.buttons = new A_ct({ next:next });

}
C_eVselect.prototype = {
	set: function(visitors) {
		this.visitors = visitors;
		var c = 0; for(var vid in visitors) c++;
		var eresaMax = mobminder.context.surfer.eresaMax;
		
			// presetting the picker preset options (items of type leadclass)
			var optpreset = {};
			var labels = [], order=[], presets = [], c = 0;
			for(var vid in visitors) {
					var dS_visi = visitors[vid];
					var vappsc = this.appscount(dS_visi);
					var maymore = vappsc <= eresaMax;
				if(this.leadclass.get(vid)) {
					labels[vid] = this.leadclass.ACoptions.label(vid);
					order.push(vid);
					presets[vid] = { checked:!c++, tip:false, onlabel:false, enabled:maymore }
				}
			}
			this.sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(this.sortrule);
				optpreset = { order:order, labels:labels, presets:presets, count:order.length };
		var vselect = new C_iCRESTA(this.eids.controls.vselect, { onchange:new A_cb(this, this.vselect) }, optpreset, { skin:1, mode:1, value:0, title:false } );
	
		this.elements.vselect.innerHTML = vselect.display();
		this.controls.vselect = vselect.activate();
	},
	display: function(css) {
			var welcome = '<div class="e-msg" id="'+this.eids.own.welcome+'" 	style="">'+C_XL.w('e-choose who to book for')+'</div>';
			var vselect = '<div class="e-msg" id="'+this.eids.own.vselect+'" 	style="">'+'</div>';
			var next 	= '<div class="e-msg" id="'+this.eids.own.next+'" 		style="">'+this.buttons.next.display({css:'e-button'})+'</div>';
		var div = '<div id="'+this.eids.own.div+'">'+welcome+vselect+next+'</div>';
		return div;
	},
	activate: function() {	
		this.elements.collect(this.eids.own);
		this.controls.activate('C_eCheckIn');
		this.buttons.activate('C_eCheckIn');
	},
	getpost: function() {
		return this.controls.vselect.getpost();
	},
	
	// controls feedback
	vselect: function(a) {
		
	},
	next: function(a) {
		if(this.callbacks.vchosen) {
				var selected = this.controls.vselect.getvalue();
				var visitors = [];
				for(var x in selected) { 
					var vid = selected[x];
					visitors[vid] = this.leadclass.get(vid); 
				}
			this.callbacks.vchosen.cb(visitors);
		}
	},
	
	// private
	appscount: function(dS_visi) { var c = 0; for(var rid in dS_visi.apps) if(dS_visi.apps[rid].deletorId==0) c++; return c; }

}







//////////////////////////////////////////////////////////////////////////////////////////////
//
//
//
//    O N L I N E      R E S E R V A T I O N     G L O B A L      P R O C E S S
//
//
//
//

C_eProcess = function(eid, callbacks) { // FIVE STEPS RESERVATION PROCESS IS OVERALL MANAGED HERE
	this.classname = 'C_eProcess';
	this.callbacks = callbacks||{}; // callbacks like { ondone:A_cb }
	if(vbs) vlog('unsubscribe.js','C_eProcess','constructor',''); 
	mobminder.app.search = this;
		var b = eid+'_';
	this.eids = { eid:eid, outset:b+'outset', auth:b+'auth', checkin:b+'checkin', capps:b+'capps', vslct:b+'vslct', options:b+'options', slots:b+'out', resa:b+'resa', goodbye:b+'goodbye',
					controls:{ auth:b+'auth', chkin:b+'chkin', capps:b+'ccapps', visi:b+'visi', eperf:b+'eperf', before:b+'before', ampm:b+'ampm', staff:b+'staff' },
					buttons:{ search:b+'search', moreslots:b+'moreslots', change1:b+'change1', change2:b+'change2', moredone:b+'bmd' },
					msgs: { currapps:b+'capps', options:b+'chopt', slotshere:b+'shere'
							, wkname:b+'wknme', wknotice:b+'wknote', wkwarning:b+'wkwarn'
							, moreapp:b+'moreapp', confirmsg:b+'cfrm', progress:b+'progress' },
					panes: { p1:b+'p1', p2:b+'p2', p3:b+'p3', p4:b+'p4', p5:b+'p5' },
				}
	this.elements = new A_el();
	
	var progress = new C_eProgress(this.eids.msgs.progress);
	
	// sub controls
	var auth 	= new C_eAuthenticate(this.eids.controls.auth, { authenticated:new A_cb(this, this.authenticated) } );
	var checkin = new C_eCheckIn(this.eids.controls.chkin, { identified:new A_cb(this, this.identified) } ); // includes an instance of C_eRegister
	var capps 	= new C_eVappointments(this.eids.controls.capps, { cappsloaded:new A_cb(this, this.cappsloaded), appdeleted:new A_cb(this, this.appdeleted) } );
	var vselect = new C_eVselect(this.eids.controls.visi, { vchosen:new A_cb(this, this.vselected) } );
	
	var eperf = new C_ePERF(this.eids.controls.eperf, {oneperf:new A_cb(this,this.workcodeSelect)} );
	var duration = new C_iPASS(1);
	var tboxing = new C_iPASS('-');
	var before = new C_iBEFORE(this.eids.controls.before, {onbefore:new A_cb(this,this.before)}, { eresa:true, selection:mobminder.context.surfer.eresaBefore, title:'search as from', soonest:'today' } );
	
		var aid = mobminder.account.id;
	this.days = 0;
		
	var ampm = new C_iAMPM(this.eids.controls.ampm, {onampm:new A_cb(this,this.ampm)} );
		var rsctypes = mobminder.context.surfer.eresaRescType; // bitmap according to what choice is allowed to public web reservation
		var staffshow = {bCals:!!(rsctypes&class_bCal), uCals:!!(rsctypes&class_uCal), fCals:!!(rsctypes&class_fCal), contingent:false };
	var staff = new C_iSTAFF(this.eids.controls.staff, 'staffing', new A_cb(this,this.staff), {}, { show:staffshow, maxrows:(is.small?false:12), maxcols:3 });
	
		var more = {caption:C_XL.w('e- more app'), tip:'', css:'action double', cssfa:'plus' };
		var done = {caption:C_XL.w('e- done ok'), tip:'', css:'action double', cssfa:'sign-out' };
	var moredone = new e_DblButton(this.eids.buttons.moredone, {onleft:new A_cb(this, this.moreapp), onright:new A_cb(this, this.done)}, {left:more, right:done });
	
		var tipsearch = C_XL.w('tip e-search');
		var tipchange = C_XL.w('tip e-change');
	var search = new C_iBUTTON(this.eids.buttons.search, new A_cb(this, this.search), {enabled:true, width:12, height:3, tabindex:false, tip:tipsearch});
	var moreslots = new C_iBUTTON(this.eids.buttons.moreslots, new A_cb(this, this.search), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipsearch});
	var change1 = new C_iBUTTON(this.eids.buttons.change1, new A_cb(this, this.change), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipchange});
	var change2 = new C_iBUTTON(this.eids.buttons.change2, new A_cb(this, this.change), {enabled:true, width:16, height:2.5, tabindex:false, tip:tipchange});
	
	var continued = new C_iPASS(0);
	var limit = new C_iPASS(mobminder.context.surfer.eresaLimit);
	var limitdate = new C_iPASS(0);
	
		var aggregate = mobminder.context.surfer.eresaAggregate;
		var sameday = mobminder.context.surfer.eresaSameday;
	var options = new C_iPASS({ exceptional:0, overdays:0, aggregate:aggregate, sameday:sameday }); // passed to search engine on server
	
	this.controls = new A_ct({progress:progress, capps:capps, vselect:vselect, visitor:new C_iPASS('-'), auth:auth, checkin:checkin, eperf:eperf, duration:duration, before:before, ampm:ampm, staff:staff, tboxing:tboxing, options:options, continued:continued, limit:limit, limitdate:limitdate});
	this.buttons = new A_ct({search:search, moreslots:moreslots, change1:change1, change2:change2, moredone:moredone});
	
		var wkcnt = C_dS_workcode.has({eresa:true});
	this.state = { duplicate:false, duplicate:false, wkcnt:wkcnt, initializing:false };
}
C_eProcess.prototype = {
	// public interface 
	display: function(containerEid) {
		var single = mobminder.account.single;
		if(vbs) vlog('unsubscribe.js','C_eProcess','display',''); 
		
		
		// pane 1 - identification
		
				var auth = this.controls.auth.display('textcolor-light');
				var checkin = this.controls.checkin.display('textcolor-light');
				var capps = this.controls.capps.display('textcolor-light');
				var vselect = this.controls.vselect.display('textcolor-light');
				
			var s1 	= '<div class="" style="">'+this.controls.progress.display(1)+'</div>';
			var authpane 	= '<div id="'+this.eids.auth+'" class="" style="">'+auth+'</div>';
			var identpane 	= '<div id="'+this.eids.checkin+'" class="" style="display:none;">'+checkin+'</div>';
			var currapps 	= '<div id="'+this.eids.capps+'" class="e-msg" style="display:none; margin:1em 0;">'+capps+'</div>';
			var vselect 	= '<div id="'+this.eids.vslct+'" class="e-msg" style="display:none; margin:1em 0;">'+vselect+'</div>';
			
			var moreapp		= '<div id="'+this.eids.msgs.moreapp+'" style="display:none;">'+this.buttons.moredone.display()+'</div>';
			
			var identpane = '<div id="'+this.eids.panes.p1+'" class="step-pane">'+authpane+identpane+currapps+moreapp+vselect+'</div>';
		var s1_ident = s1+identpane;
		
		
		// pane 2 - search options
			var s2 	= '<div class="" style="">'+this.controls.progress.display(2)+'</div>';
		 
					var eperf = this.state.wkcnt?'<span class="lfloat">'+this.controls.eperf.display()+'</span>':''; // this one is always on the screen
					
						var wkname = '<tr><td id="'+this.eids.msgs.wkname+'" class="e-msg bold" style=""></td></tr>';
						var wknotice = '<tr><td id="'+this.eids.msgs.wknotice+'" class="e-msg e-perf-note" style=""></td></tr>';
					var wknote = '<span class="rfloat top-pad">'+'<table id="'+this.eids.msgs.wkwarning+'" style="display:none; vertical-align:top;">'+wkname+wknotice+'</table>'+'</span>';
				
				var performance = '<div class="endfloat top-pad">'+eperf+wknote+'</div>';
				
						var staff 	= single?'':'<span class="lfloat top-pad">'+this.controls.staff.display()+'</span>';
						var before 	= '<span class="lfloat top-pad '+(single?'':'')+'">'+this.controls.before.display()+'</span>';
						
							var withampm = !!mobminder.context.surfer.eresaWithAMPM;
						var ampm = withampm?'<span class="lfloat top-pad">'+this.controls.ampm.display()+'</span>':'';
					
				var soptable = '<div class="endfloat">'+staff+before+ampm+'</div>';
				
					var bsearch = this.buttons.search.display({caption:C_XL.w('slotsearch'), css:'e-button'});
				var search = '<div class="e-msg endfloat" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+bsearch+'</div>';
		
				var chooseopt 	= '<div id="'+this.eids.msgs.options+'" class="e-msg" style="display:none; margin-bottom:1em;">'+'</div>'; // instruction message

				
			var optionspane = '<div id="'+this.eids.panes.p2+'" class="e-msg" class="step-pane">'+chooseopt+performance+soptable+search+'</div>';

			
		var s2_options = s2+optionspane;
		
		
		// pane 3 - choosing out of availabilities
		
			var s3 	= '<div class="" style="">'+this.controls.progress.display(3)+'</div>';		
				var slotshere 	= '<div class="e-msg"  id="'+this.eids.msgs.slotshere+'" style="margin-bottom:0.5em;">'+C_XL.w('slots here')+'</div>';
				var selectmsg 	= '<div class="e-msg" style="margin-bottom:1em;">'+C_XL.w('pls select')+'</div>';
				var slotspane 	= '<div id="'+this.eids.slots+'" class="e-msg" style=""></div>'; // filled with availabilities
				var change1 	= '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.change1.display({caption:C_XL.w('modify options'), css:'e-button'})+'</div>';
				var moreslots 	= !!this.days ? '': '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.moreslots.display({caption:C_XL.w('next dates'), css:'e-button'})+'</div>';
			var availipane = '<div id="'+this.eids.panes.p3+'" class="e-msg" class="step-pane">'+slotshere+selectmsg+slotspane+moreslots+change1+'</div>';

		var s3_choose = s3+availipane;
		
		
		// pane 4 - confirming choice
		
			var s4 	= '<div class="" style="">'+this.controls.progress.display(4)+'</div>';	
					var tipconfirm = mobminder.context.surfer.eresaAllowNote ? C_XL.w('e- pls note&confirm') : C_XL.w('e- pls confirm');
				var plsconfirm 	= '<div class="e-msg">'+tipconfirm+'</div>';
				var resapane 	= '<div id="'+this.eids.resa+'" class="e-msg" style=""></div>'; // filled with chosen resa info
				var change2 	= '<div class="e-msg" style="text-align:right; margin:1em 0 1em 0; width:100%; max-width:40em;">'+this.buttons.change2.display({caption:C_XL.w('modify options'), css:'e-button'})+'</div>';
			var confipane = '<div id="'+this.eids.panes.p4+'" class="e-msg" class="step-pane">'+plsconfirm+resapane+change2+'</div>';
		var s4_confirm = s4+confipane;
		
		
		// pane 5 - goodbye
		
			var s5 	= '<div class="" style="">'+this.controls.progress.display(5)+'</div>';	
					var note = mobminder.context.surfer.eresaNote.htmlize();
				var confirmmsg 	= note?'<div id="'+this.eids.msgs.confirmsg+'" class="" style="display:none; margin-top:1em;">'+note+'</div>':'';
				var goodbye = '<div id="'+this.eids.goodbye+'" class="" style="display:none; margin-top:1em;">'+C_XL.w('e-goodbye')+'</div>';
			var thankpane = '<div id="'+this.eids.panes.p5+'" class="e-msg" class="step-pane">'+confirmmsg+goodbye+'</div>';

		var s5_thanks = s5+thankpane;

		
		var outset = '<div class="container" id="'+this.eids.outset+'">'+s1_ident+s2_options+s3_choose+s4_confirm+s5_thanks+'</div>';
		
		return outset;
	},
	activate: function() {
		this.elements.collect(this.eids);
			this.state.initializing = true;
		this.controls.activate('C_eProcess');
		this.buttons.activate();
		this.workcodeSelect([this.controls.eperf.value()]);
		this.paneset(1);
			this.state.initializing = false;
		
		this.controls.auth.focus();
	},
	reload: function() { // called from newresasaved() and from done()
		C_iSLOT.flush();
		if(vbs) vlog('unsubscribe.js','C_eProcess','reload',''); 
		if(this.callbacks.ondone) this.callbacks.ondone.cb();
		$(this.elements.goodbye).hide();
		this.paneset(1).controls.progress.step(1).caption(1); 
		if(!this.callbacks.ondone) this.controls.progress.slideto(1); // if the callback is defined, it will probably hide this section and take care of the scrolling
		this.controls.checkin.reset();
		$(this.elements.checkin).show();
	},
	
	// private functions
	paneset: function(steps) { // opens a section under a step bullet, close all other sections
		var args = new Array(); for(var x=0; x<arguments.length; x++) args.push(arguments[x]);
		if(vbs) vlog('unsubscribe.js','C_eProcess','paneset','steps:'+args.join('-')); 
		for(var p in this.elements.panes.get) { 
			var e = this.elements.panes[p]; 
			var i = p[1]|0; 
			if(arrayHAS(args,i)) $(e).show(); else $(e).hide();
		}
		return this;
	},
	
	// event handling
	staff: function() { if(vbs) vlog('unsubscribe.js','C_eProcess','staff',''); this.controls.continued.set(0); },
	ampm: function() { if(vbs) vlog('unsubscribe.js','C_eProcess','ampm',''); if(this.controls) this.controls.continued.set(0); },
	before: function(date,option) { 
		var fulldate = C_XL.date(date,{abreviation:'full',weekday:true});
		switch(option|0) {
			case 0: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots from today')+'&nbsp;'+fulldate; break;
			case 1: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots from tomorrow')+'&nbsp;'+fulldate; break;
			default: this.elements.msgs.slotshere.innerHTML = C_XL.w('slots as from')+'&nbsp;'+fulldate; 
		}
		if(this.state.initializing) return; // this function is called during this.controls.activate process, so do not jump to step 2 now
			else this.change();
	},
	duration: function() {  },
	workcodeSelect: function(workcodeIdsArray) { // a workcode has been checked or unchecked
	
		var cnt = C_dS_workcode.has({eresa:true});
		
		if(vbs) vlog('unsubscribe.js','C_eProcess','workcodeSelect',workcodeIdsArray); 
		var resourceIdsArrays = new Array(), timeboxingIds = new Array();
		var duration = 0; var staffsize = 1;
		
		if(!this.state.wkcnt) return; // this account has no e-resa workcodes
			
		for(var x in workcodeIdsArray) {
			
			var wkId = workcodeIdsArray[x];
			var dS_wk = C_dS_workcode.get(wkId);
			duration += dS_wk.duration;
			staffsize = Math.max(dS_wk.staffing, staffsize);
			resourceIdsArrays.push(dS_wk.expertsIds());
			timeboxingIds.push(arrayKEYS(dS_wk.tboxingIds()));
		}
		
		this.controls.duration.set(duration);
		var commonResources = arrayAND(resourceIdsArrays); // only the common resources to all workcodes
		this.controls.staff.resetstaff(commonResources).setsize(staffsize).prevent();

		
		// show the notice that is linked with the selected workcode
		if(dS_wk.note) {
			$(this.elements.msgs.wkwarning).show();
			$(this.elements.msgs.wkname).html(dS_wk.name.htmlize()+' :').show();
			$(this.elements.msgs.wknotice).html(dS_wk.note.htmlize()).show();
		} else {
			$(this.elements.msgs.wkwarning).hide();
			}

		var commonTimeboxings = arrayAND(timeboxingIds); // only the common resources to all workcodes, if not compatible, all are selected
		this.controls.tboxing.set(commonTimeboxings.join('!')||'-');
		this.controls.progress.caption(2,dS_wk.name);
		this.controls.continued.set(0);
	},
	
	
	authenticated: function(email, mobile) {
		if(vbs) vlog('unsubscribe.js','C_eProcess','authenticated','email:'+email+', mobile:'+mobile); 
		
		this.controls.checkin.set(email, mobile);
		$(this.elements.auth).hide();
		$(this.elements.checkin).show();
		this.controls.checkin.focus();
		
		// visiId is the id of a previously existing visitor or the id of a newly created visitor.
		
	},		
	
	identified: function(vids, firstsignin) { // one or many visitors are indentified to be the assignees of the appointment
	
		if(vbs) vlog('unsubscribe.js','C_eProcess','identified','vids:'+vids.count+', firstsignin:'+firstsignin); 
		
		// vids are the ids of a previously existing visitor or the id of a newly created visitor.
		
		this.controls.capps.appload(vids); // ajax call filling this.elements.capps with current appointment, call back to this.cappsloaded()
		$(this.elements.checkin).hide();
		
		
	},	
	cappsloaded: function(visitors) {
		
		if(this.controls.checkin.state.firstsignin) return this.moreapp(); // When it is your first sign in, you definitely wish to take an appointment, so skip this 
		if(!this.controls.capps.vappscount()) return this.moreapp(); // if your have no appointment at all, you directly go the reservation process
		
		// else show current appointments for the list of visitors identified
			
		$(this.elements.capps).show();
			$(this.elements.slots).hide();
			$(this.elements.msgs.moreapp).show();
			var maybookmore = true;
		this.buttons.moredone.enable({left:maybookmore});
		
		
		if(is.tactile) document.activeElement.blur(); // lets the soft keyboard disappear on touch devices
		
		// else we have no valid visitor identified => this means that online registration is not allowed
		// this.done();
		
	}, // current appointments are loaded
	moreapp: function() { // the surfer has chosen to take one more appointment
		
		if(vbs) vlog('unsubscribe.js','C_eProcess','moreapp',''); 
		$(this.elements.msgs.moreapp).hide();
		$(this.elements.capps).hide();
		
			var vids = this.controls.checkin.visitors();
			var vc = 0; for(var vid in vids) vc++;
		this.controls.vselect.set(vids);
		
		if(vc>1)
			$(this.elements.vslct).show();
		else 
			this.vselected(vids); // there is only one visitor, no need to offer selection through a list
	},
	vselected: function(visitors) { // shows current reservations and check against max allowed apps
	
		var caption = function(visitors) { // replace the caption 'identify yourself' with the names of selected people to appoint for
			var list = '';
			for(var vid in visitors) {
				var dS_v = visitors[vid];
				list += ''+C_XL.gender(dS_v.gender, dS_v.language)+'&nbsp;'+dS_v.firstname+'&nbsp;'+dS_v.lastname+',<br/>';
			}
			return list;
		};
		
		if(vbs) vlog('unsubscribe.js','C_eProcess','vselected',''); 
		this.controls.progress.caption(1,caption(visitors));
		
		
		$(this.elements.slots).show();
		return this.searchoptions();
		
	},
	searchoptions: function() { // STEP 2: display search options	
	
		var dSvisitor = this.controls.capps.ds();
		var msg = C_XL.w('pls options');
		this.elements.msgs.options.innerHTML = msg;
		$(this.elements.msgs.options).show();
		
		if(vbs) vlog('unsubscribe.js','C_eProcess','searchoptions',''); 
		this.controls.ampm.and(dSvisitor.prefAMPM);
		this.paneset(2).controls.progress.step(2).slideto(1);
		$(this.elements.options).show();
		$(this.elements.msgs.change1).hide();
		this.elements.slots.innerHTML = '';
		return true;
	},
	search: function(continued) { // the 'search' button was hit
	
		this.buttons.search.busy(true);
		this.controls.visitor.set(this.controls.capps.ds().id);
		
		if(this.days) { // there is a limit date (introduced  exceptionally for h4d, check this.days )
			
				this.controls.continued.set(0); // by the end of the story, h4d wants to never see what is beyond the 2 days window... :)
			
			var c = this.controls.continued.value(); // console.log('continued:'+c); // that is a Unix stamp
			var b = this.controls.before.getjsdate(); if(c) { b = new Date(c*1000); }
			
						// console.log('not before:'+b.getUnixTime());
			b.increment({d:this.days-1}); 
						// console.log('not after:'+b.getUnixTime());
			this.controls.limitdate.set(b.stamp());
			if(c) this.controls.continued.set(c-3600); // -3600 because at search.php side, the continued stamp gets moved to midnight next date
		}
		
			var noampm = !mobminder.context.surfer.eresaWithAMPM;
		if(noampm) this.controls.ampm.resetampm({callback:false}); // forces the search to ignore the visitor's own ampm preference
		// console.log(bitmap(this.controls.ampm.state.encoded));
			var c = this.controls.continued.value();
			var ampm = bitmap(this.controls.ampm.state.encoded);
		if(vbs) vlog('unsubscribe.js','C_eProcess','search','continued:'+c+', ampm:'+ampm+', days:'+this.days+', AMPM display:'+(!noampm)); 

		var names = {
			vselect:'visitors', eperf:'workcodes', duration:'duration', before:'before', ampm:'ampm'
			, continued:'continued', limit:'limit', limitdate:'limitdate', tboxing:'tboxing'
			, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals', size:'staffsize' }
			, options:{exceptional:'exceptional', overdays:'overdays', aggregate:'aggregate', sameday:'sameday' }
		};
		mobminder.app.post(this.controls, names, './queries/search.php', new A_cb(this,this.slotsfresh), new A_cb(this, this.connfailed));
		C_iSLOT.flush();
	}, 
	slotclick: function(resa) {
		
		this.paneset(4).controls.progress.step(4, undefined, 3);
		
			var eresa = new C_eRESA(resa, { saved:new A_cb(this,this.newresasaved) } );
		this.controls.progress.caption(3, eresa.summary()).slideto(2);
			
		this.elements.slots.innerHTML = '';
		this.elements.resa.innerHTML = eresa.display(); // note field with confirm button
		eresa.activate();
	},
	newresasaved: function(dataSets) { // SCREEN STEP 5
		// 
		this.paneset(5).controls.progress.step(5).slideto(1);
		this.controls.progress.caption(4,C_XL.w('confirmed',{cap:1}));
		this.state.duplicate = false;
		
		var resa = false;
		for(id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
			// var dSvisitor = this.controls.capps.ds();
		// dSvisitor.apps[id] = resa;
		
		$(this.elements.goodbye).hide();
		$(this.elements.msgs.confirmsg).show();
		$(this.elements.checkin).hide();
				var notelen = mobminder.context.surfer.eresaNote.length; 
				var readtime = notelen?(notelen*80+1000):2500; // the note stays on the screen for a time that is proportional to its readable length
		var handler = new A_hn({reload:new A_cb(this, this.appsummary)}); setTimeout(handler.reload, readtime);
	},
	appsummary: function() { // heads back to step 1 after a new appointment was taken
		
		this.paneset(1).controls.progress.step(1).caption(2).caption(3).caption(4).caption(5).slideto(1);
		
	},

	appdeleted: function() {
		if(vbs) vlog('unsubscribe.js','C_eProcess','appdeleted',''); 
	},
	done: function() {  // SCREEN STEP 5 // the surfer has chosen NOT to take more appointment
		if(vbs) vlog('unsubscribe.js','C_eProcess','done',''); 
		$(this.elements.msgs.moreapp).hide();
		this.paneset(5).controls.progress.step(5).slideto(5);
		$(this.elements.goodbye).show();
		$(this.elements.msgs.confirmsg).hide();
		var handler = new A_hn({reload:new A_cb(this, this.reload)}); setTimeout(handler.reload, 8000);
	},
	change: function() {
		if(vbs) vlog('unsubscribe.js','C_eProcess','change',''); 
		$(this.elements.options).show();
		this.elements.slots.innerHTML = '';
		this.paneset(2).controls.progress.step(2).slideto(1);
		this.controls.continued.set(0);
	},
	
	// ajax callbacks
	connfailed: function() {
		this.buttons.search.busy(false);
	},
	slotsfresh: function(inlineDataSets) { // this is where we display this stuff on the slots pad
		this.buttons.search.busy(false);
		$(this.elements.msgs.options).hide();
		$(this.elements.options).hide();
		
		this.paneset(2,3).controls.progress.step(3).caption(3).slideto(3);
		
		var virtualid = -1, cueLast = 0;
		for(id in inlineDataSets['C_dS_reservation']) {
			//this.state.duplicate = { replan:replan, note:resa.note, ccsscolor:resa.cssColor, ccsspattern:resa.cssPattern };
			var resa = inlineDataSets['C_dS_reservation'][id];
			if(this.state.duplicate) {
				resa.note = this.state.duplicate.note;
				resa.cssColor = this.state.duplicate.ccsscolor;
				resa.cssPattern = this.state.duplicate.ccsspattern;
				resa.replan = this.state.duplicate.replan;
			}
			// relink visitor (there is always a visitor via web, at least one)
			var va = this.controls.vselect.getpost().split('!');
			for(var x in va) {
				var dS_attv = new C_dS_att_visitor('slots', [virtualid--, id, class_visitor, va[x]]);
				console.log(dS_attv);
			}
			
			// relink workcode
			if(this.state.wkcnt)
				new C_dS_performance('slots', [virtualid--, id, this.controls.eperf.value(), this.controls.capps.ds().id ]);
			
			resa.rmeta();
			new C_iSLOT(this.eids.slots, resa, { selected:new A_cb(this, this.slotclick) } );
			if(resa.cueIn>cueLast) cueLast = resa.cueIn;
		}
			
		if(this.days) { 
				var c = this.controls.continued.value(); 
				var b = this.controls.before.getpost(); 
				var s = c ? c+3600 : b;
			s += 86400*(this.days); // covers the case where no result comes from the search but still you want to search further
			s = new Date(s*1000); s.toMidnight();
				// console.log('setting continued to :'+s.getUnixTime());
			this.controls.continued.set(s.stamp()); 
		}
		else {
			this.controls.continued.set(cueLast); // this is the usual case
		}
			
		
		this.elements.slots.innerHTML = C_iSLOT.display();
		$(this.elements.slots).show();
		$(this.elements.msgs.change1).show();
		C_iSLOT.activate();
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    A P P    S T A R T E R   
//
e_UNSUBSCRIBE = function e_MOB(accid, demo, language, key) {

	if(vbs) vlog('unsubscribe.js','e_MOB','constructor','key:'+keyId); 
	this.state = { accid:accid, key:key };
	mobminder.app = this;
	mobminder.demo = demo;
	
	this.eids = { desk:'desk', dfa:'dfa', buttons:'buttons'
					, sections: { h1:'s-h1', img:'s-img', info:'s-info', action:'s-action', directions:'s-directions', footer:'s-footer'} // Must stay compliant with static html built from e-resa.php
				};
	this.elements = new A_el();
	this.elements.collect({body:'body'});
		
		var bodymode = is.tactile ? 'touch' : 'mouse';
	$("body").addClass(bodymode).noContext();
	
	let FA2_input = new C_iFIELD(this.eids.dfa, { onfchange:new A_cb(this, this.on2fa_type, this.state.key, false, 1000 ), onenterkey:new A_cb(this, this.on2fa_enter, this.state.key ) }, { digits:'', type:INPUT_NUMER, mandatory:true, placeholder:'copy code here', max:8 });

	// this.controls = new A_ct( { book:book, cancel:cancel } );
	this.controls = new A_ct( { FA2_input:FA2_input } );
		
	this.display();
	this.activate();
}
e_UNSUBSCRIBE.prototype = {
	display: function() {
		if(vbs) vlog('unsubscribe.js','e_MOB','display','');
			let gd1 = '<div class="">'+'We sent an email to you with a 2FA code, please copy this code here:'+'</div>';
			let fa2 = this.controls.FA2_input.display('alpha10');
			let cnt = '<div class="container">'+gd1+fa2+'</div>';
		let desk = '<section id="'+this.eids.desk+'" class="s-desk" style="display:block; margin-top:2em;">'+cnt+'</section>';
		$('#s-footer').before(desk);
		
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 1000);
	},
	activate: function() {
		if(vbs) vlog('unsubscribe.js','e_MOB','activate',''); 
		this.controls.activate('e_UNSUBSCRIBE');
		this.elements.collect(this.eids);
		// this.getconfig();
	},
	
	on2fa_type: function() {
			let names = {FA2_input:'cc'};
		mobminder.app.post(this.controls, names, './codecheck.php', new A_cb(this, this.codecheck) );
	},
	on2fa_enter: function() {
		
	},
	
	post: function(controls, names, target, success, failure) { // failure is called in case of timeout OR if a command is received
			let ajaxfeedback = new A_cb(this, this.ajaxfeedback, { success:success, failure:failure });
			let ajaxtimeout = new A_cb(this, this.ajaxtimeout, failure);
			
			if('key' in names) // keep names, do not use ('key' in controls) as controls may have been modified once already
			{ /* this specific post is passing a key (see e.g. the login process) (*40*) */ }
			else { let key = new C_iPASS(this.state.key); names['key'] = 'k'; controls['key'] = key; } // then work with the one that came through the configuration
			
		var post = new A_ps(controls, names, target, {onreply:ajaxfeedback, ontimeout:ajaxtimeout} );
	},
	
	// ajax feedbacks
	codecheck: function(k, stream) {
		let sortout = stream.extract('<data>','</data>').match;
		let r = sortout|0;
		
		console.log(sortout);
		console.log(r);
		console.log(k);
	},
	
	ajaxfeedback: function(callbacks, stream) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		
		var dscode = stream.extract('<code>','</code>').match; 
		var command = stream.extract('<command>','</command>').match;  
		
			if(vbs) vlog('mobminder.js','e_MOB','ajaxfeedback','command:'+command);
			
		var datasets = false;
		if(dscode) datasets = C_inlineStreaming.createDataSets(dscode);
		
		if(command) switch(command) {
			case 'logoff': 
				// this.controls.top.logout(); 
				// if(callbacks.failure) callbacks.failure.cb(command); return; 
				break;
		}
		if(callbacks.success) callbacks.success.cb(datasets, stream);
	},	
	ajaxtimeout: function(failure) { // called when the date is change from the TOP menu, applies jsdate on current planning screen
		if(vbs) vlog('unsubscribe.js','e_MOB','ajaxtimeout','');
		// new C_iMSG(C_XL.w('connection failed'));
		// if(failure) failure.cb();
	},	
	
	// private
	getconfig: function() {
		if(vbs) vlog('unsubscribe.js','e_MOB','getconfig','');
		var key = new C_iPASS(this.state.key);
		// mobminder.app.post({key:key}, {key:'k'}, './eresa2/e-config.php' );
	},
	start: function() { // config has been received from the server
		if(vbs) vlog('unsubscribe.js','e_MOB','start','account:'+mobminder.account.name); 
		
		$(this.elements.desk).show();
		$(this.elements.sections.img).hide();
		$(this.elements.sections.info).hide();
		$(this.elements.sections.action).hide();
		$(this.elements.sections.directions).hide();
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 1000);
		
			var remote = new C_eProcess(this.eids.remote, {ondone:new A_cb(this, this.ondone)});
		
		this.elements.desk.innerHTML = remote.display();
		
		remote.activate('e_MOB::config()');
		
	},
	
	// controls callbacks
	onbook: function() {
		if(vbs) vlog('unsubscribe.js','e_MOB','onbook','');
		this.start();
	},
	oncancel: function() {
		if(vbs) vlog('unsubscribe.js','e_MOB','oncancel','');
		this.start();
	},
	ondone: function() { // a reservation is complete
		
		$(this.elements.desk).hide();
		$(this.elements.sections.img).show();
		$(this.elements.sections.info).show();
		$(this.elements.sections.action).show();
		$(this.elements.sections.directions).show();
		$('html, body').animate({ scrollTop:$('#body').offset().top }, 1000);
	}
};



