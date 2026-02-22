
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



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   R E S E R V A T I O N     S U M M A R Y     L I N E 
//
function C_iRPOP(eid, dS_resa, onClick, preset) { // used by M_RESA and M_VISI to display lists of reservations
	this.resa = dS_resa;
	this.id = dS_resa.id;
	let positive = this.id<0 ? this.id*-1 : this.id;
	
	this.eids = { row:eid+'_'+positive+'_row', time:eid+'_'+positive+'_time', date:eid+'_'+positive+'_date' };
	this.elements = new A_el();
	this.callbacks = { onClick:onClick };
	this.state = C_iRPOP.defauts.align(preset);
	
	let dpop = new C_iDPpop(this.eids.date, this.resa.jsDateIn, { setdate:mobminder.app.setdate }, { abreviation:'abr', weekday:true, yearfirst:true, year:true, tip:{text:C_XL.w('C_iRPOP_date_tip'),css:'help-tip'} } );
	// let time = new C_iCLIK(this.eids.time, { click:new A_cb(this, this.time) } , { tag:'a', ui:this.resa.text.time.cin, tip:{text:C_XL.w('C_iRPOP_time_tip'),css:'help-tip'} } );
	
	let time = new C_iCLIK(this.eids.time, { click:new A_cb(this, this.time) } , { tag:'a', ui:this.resa.text.time.cin, tip:{text:C_XL.w('C_iRPOP_time_tip'),css:'help-tip'} } );
	
	this.controls = new A_ct({rowtip:false, time:time, dpop:dpop});
}
C_iRPOP.defauts = new A_df( { enabled:true, css:'', tip:false } );
C_iRPOP.prototype = { 
	// public
	display: function(index, rtypescount) { // returns a <tr></tr>
		const trs = new Array();
		const css = this.resa.deletorId ? ' resa-deleted' : '';
		if(is.newtouch) {
				
				let x = ''; if(index) x =  '<span>'+index+'.&nbsp;'+'</span>';
				const l = '<span class="bullet">'+this.resa.resabullet()+'</span>';
				const d = '<span>'+this.controls.dpop.display()+'</span>';
				const t = '<span>'+this.controls.time.display()+'</span>';
			trs.push('<tr class="resapop-row nextitem'+css+'"><td width="5%">'+x+l+'</td><td>'+d+t+'</td></tr>');
			
					let any = this.resa.text.workcodes!='';
				let w = ''; if(mobminder.account.has.workcodes) w = '<span>'+this.resa.text.workcodes+'</span>';
			if(any) trs.push('<tr class="resapop-row workcodes'+css+'"><td></td><td style="overflow:hidden;">'+w+'</td></tr>');
			
						any = 0;
				let b = ''; if(!mobminder.account.single) { b = '<span>'+this.resa.text.resources.b+'</span>'; any++; }
				let u = ''; if(mobminder.account.has.uCal) { u = '<span>'+this.resa.text.resources.u+'</span>'; any++; }
				let f = ''; if(mobminder.account.has.fCal) { f = '<span>'+this.resa.text.resources.f+'</span>'; any++; }
			if(any) trs.push('<tr class="resapop-row note'+css+'"><td></td><td style="overflow:hidden;">'+b+u+f+'</td></tr>');
			
				
				let n = ''; if(this.resa.note) n = '<span>'+this.resa.note.split('\n').join(' ')+'</span>';
			if(n) trs.push('<tr class="resapop-row note'+css+'"><td></td><td>'+n+'</td></tr>');
			
		} else { // mouse webApp
			const x = index ? '<td>'+index+'.&nbsp;'+'</td>' : '';
			const l = '<td class="bullet">'+this.resa.resabullet()+'</td>';
			const d = '<td>'+this.controls.dpop.display()+'</td>';
			const t = '<td>'+this.controls.time.display()+'</td>';
			let b = ''; if(!mobminder.account.single) b = '<td>'+this.resa.text.resources.b+'</td>'; // does not display the resource name when only one resource exists
			let u = ''; if(mobminder.account.has.uCal) u = '<td>'+this.resa.text.resources.u+'</td>';
			let f = ''; if(mobminder.account.has.fCal) f = '<td>'+this.resa.text.resources.f+'</td>';
			let w = ''; if(mobminder.account.has.workcodes) w = '<td>'+this.resa.text.workcodes+'</td>';
			
			let n = ''; let nl = this.resa.note.length; let cntinue = '';
			
			if(rtypescount<3) {
				const maxchars = 50;
				n = this.resa.note.substr(0,maxchars);
				if(nl>maxchars) cntinue = '...';
				n = '<td style="max-width:16em; overflow:hidden;">'+n+cntinue+'</td>';
			}
			
			trs.push('<tr id="'+this.eids.row+'" class="resapop-row'+css+'">'+x+l+d+t+b+u+f+w+n+'</tr>');
			this.controls.add1( new C_iTIP(this.eids.row,{text:this.resa.rtip(),css:'sticker-tip resa '+this.resa.tipcss,delay:500}), 'rowtip');
		}
		return trs.join('');
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
C_iRPOP.display = function(pops, options) { // displays an array of resaPops, they are activated by the caller after display in M_RESA & M_VISI
	
		options = options || { numbering:false, reversed:false };
	if(!pops.length) return '<div style="margin:1em 0 1em 0;">'+C_XL.w('none')+'<div>';
	let rtypescount = 1 + (mobminder.account.has.uCal?1:0) + (mobminder.account.has.fCal?1:0); // there is at least always one bCal
	
	// headers
	let th = ''; if(!is.newtouch) { // no headers on smartphones
		let l = '<th>'+'&nbsp;'+'</th>'; // bullet
		let d = '<th style="padding-left:.8em;">'+C_XL.w('date')+'</th>';
		let t = '<th style="padding-left:.8em;">'+C_XL.w('time')+'</th>';
		let b = ''; if(!mobminder.account.single) b = '<th>'+mobminder.account.nameof.bCal+'</th>';
		let u = ''; if(mobminder.account.has.uCal) u = '<th>'+mobminder.account.nameof.uCal+'</th>';
		let f = ''; if(mobminder.account.has.fCal) f = '<th>'+mobminder.account.nameof.fCal+'</th>';
		let w = ''; if(mobminder.account.has.workcodes) w = '<th>'+C_XL.w('workcodes')+'</th>';
		let n = ''; if(rtypescount<3) n = '<th>'+C_XL.w('note')+'</th>';
			th = '<tr class="resapop-row">'+l+d+t+b+u+f+w+n+'</tr>';
	}
	
	// appointments
	let trs = new Array();
	for(let x in pops) {
			let index = 1+(x|0); if(options.reversed) index = pops.length-index+1; if(!options.numbering) index = 0;
		trs.push(pops[x].display(index, rtypescount)); // from C_iRPOP.prototype{}
	}
	trs = trs.join('');
	
	// layout
	return '<table summary="resa pops" class="resapop-table">'+th+trs+'</table>';
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//   M O D A L     W I N D O W S 
//
function M_details(dS, callbacks, preset) { // Modal display: This is where the user selects fields to be displayed in C_iARRAY
	preset = preset || {};
	this.dS = dS;
	this.callbacks = callbacks || {}; // { saved:o_callback };
	this.state = M_details.defaults.align(preset);

	let b = 'dtls'+'_';
	this.eids = { buttons:b+'butns', tabs:b+'tabs', order:b+'order', viewers:b+'vwrs', v:b+'Vflds', h:b+'Hflds', t:b+'Lflds', wd:b+'wd', showdel:b+'shdl' };
	this.elements = new A_el();
	
	let cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false } );
	
	let passtype = new C_iPASS({rsctype:this.state.rsctype, orientation:this.state.orientation});
		
		let onchange = new A_cb(this, this.changed);
	let vfields = new C_iDETAILS(this.eids.v, {onchange:onchange}, { mode:planning.vertical, rsctype:this.state.rsctype } );
	let hfields = new C_iDETAILS(this.eids.h, {onchange:onchange}, { mode:planning.horizontal, rsctype:this.state.rsctype } );
	let tfields = new C_iDETAILS(this.eids.t, {onchange:onchange}, { mode:planning.text, rsctype:this.state.rsctype } );

	let weekdays = new C_iAMPM(this.eids.wd, {onampm:new A_cb(this, this.wdchanged)}, {showpm:false, mode:1, encoded:(1+4+16+64)} );

	let showdel = new C_iCLIK(this.eids.showdel, { click:new A_cb(this, this.showdeleted) }
		, { enabled:true, tip:C_XL.w('tip-showhides deleted'), css:'click modal-button fa fa-trash touch-orange', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.alpha.d+C_KEY.code.s.ctrl /* Ctrl + d */] });
		
	// display order
	order = new C_iPLUS(this.eids.order, {}, { plusclass:new C_dS_resource.plus(this.state.rsctype), reorder:true, plusallow:false });
	
	// logins to which we apply changes
		let logins = {}; logins[mobminder.context.surfer.id]=true;
		let vbp = '<div class="blueprint left" style="padding:0 0 1em 4em; max-width:50em; margin:0 auto 0 0;">'+C_XL.w('bp4 m-details')+'</div>';
	let viewers = new C_iUSERS(this.eids.viewers, {}, {blueprint:vbp}, logins );

	// tabs
		let tabslabels = C_XL.w(planning.names); tabslabels[7] = C_XL.w('display order'); tabslabels[8] = C_XL.w('users'); tabslabels[9] = C_XL.w('week screen');
	let tabs	= new C_iTABS(this.eids.tabs, tabslabels, false, {current:this.state.orientation} );

	this.controls 	= new A_ct( { passtype:passtype, cartouche:cartouche, tabs:tabs
		, vfields:vfields, hfields:hfields, tfields:tfields, weekdays:weekdays
		, order:order, viewers:viewers, showdel:showdel } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:680, y:300}, moves:true } );
	this.activate();
}
M_details.defaults = new A_df({rsctype:class_bCal, orientation:planning.horizontal });
M_details.prototype = {
	// private
	header: function() {
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let showdel = '<td class="cartouche">'+this.controls.showdel.display()+'</td>';
			let title = '<td class="mheader"><h1 class="modal-details">'+C_XL.w('display details')+'</h1></td>';
			let row = '<tr>'+buttons+showdel+title+'</tr>';
		let header = '<table summary="details" style="width:100%; padding:0 0 1em 0;">'+row+'</table>';
		
			let rsctype = C_XL.w(this.state.rsctype, {cap:0} );
			let bp = '<div class="blueprint centered" style="width:80%; margin:0 auto;">'+C_XL.w('bp1 m-details')+rsctype+'</div>';
				bp += '<div class="blueprint centered" style="width:80%; margin:0 auto;">'+C_XL.w('bp2 m-details')+'</div>';
		
		let divTabs = '<div style="text-align:center; margin-top:1em">'+this.controls.tabs.display()+'</div>';
		return header+bp+divTabs;
	},
	body: function(css) {
	
		// tab 1 vertical view
		let vfields = this.controls.vfields.display();
		let tab1 = this.controls.tabs.container(planning.vertical, vfields);
		this.controls.tabs.hide(1, this.state.orientation!=planning.vertical);
		
		// tab 2 horizontal view
		let hfields = this.controls.hfields.display();
		let tab2 = this.controls.tabs.container(planning.horizontal, hfields);
		this.controls.tabs.hide(2, this.state.orientation!=planning.horizontal);
	
		// tab 3 list view
		let lfields = this.controls.tfields.display();
		let tab3 = this.controls.tabs.container(planning.text, lfields);
		this.controls.tabs.hide(3, this.state.orientation!=planning.text);
		
		// tab 7 display order
				let order = '<td>'+this.controls.order.display()+'</td>';
				let bp = '<td class="blueprint right top" style="width:40%; padding-left:4em;">'+C_XL.w('bp3 m-details')+'</td>';
				let wrapstyle = 'display:flex; flex-direction:row; flex-wrap:nowrap; justify-content:space-around;';
			let dowrap = '<table style="margin:0 auto;"><tr>'+bp+order+'</tr></table>';
		let tab7 = this.controls.tabs.container(7, dowrap);
		this.controls.tabs.hide(7, this.state.orientation!=planning.horizontal);
		
		// tab 8 list of logins to which the settings should be applied
			let users = this.controls.viewers.display();
		let tab8 = this.controls.tabs.container(8, users);
		
		// tab 9 week view
				let wd = '<td>'+this.controls.weekdays.display()+'</td>';
				let wbp = '<td class="blueprint right top" style="width:60%; padding:.6em 2em 0 6em">'+C_XL.w('bp5 m-details')+'</td>';
			let wvwrap = '<table style="margin:0 auto;"><tr>'+wbp+wd+'</tr></table>';
		let tab9 = this.controls.tabs.container(9, wvwrap);
		this.controls.tabs.hide(9, this.state.orientation!=planning.vertical);
		
		return tab1+tab2+tab3+tab7+tab8+tab9;
	},
	activate: function() {
		this.controls.activate('M_details');
		this.setshowdelete();
	},
	
	// private
	setshowdelete: function() { // sets the right css so to reflect the state of mobminder.app.hidedeleted
		this.controls.showdel.set(false,mobminder.app.hidedeleted?'text-disabled':'fa-gray');
		return this;
	},

	// event handling
	showdeleted: function() {
		mobminder.app.showdeleted();
		this.setshowdelete();
	},
	save: function() {
		this.modal.busy(true);
		let names = { passtype:{rsctype:'resourceType', orientation:'orientation'}, vfields:'v-details', hfields:'h-details', tfields:'t-details', order:'order', viewers:'viewers', weekdays:'weekdays'};
		mobminder.app.post(this.controls, names, './post/details.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	saved: function() { if(this.callbacks.saved) this.callbacks.saved.cb(); this.quit(); },
	changed: function(mode, encoded) { 
		mode = mode|0;
		
		if(mode!=this.state.orientation) return; 
		if(this.callbacks.changed) this.callbacks.changed.cb(encoded); 
	},
	wdchanged: function(encoded, selections) {
		// monday 	:1
		// tuesday 	:2
		// wednesday:4
		// thursday :8
		// friday 	:16
		// saturday :32
		// sunday 	:64
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	failed: function() { this.modal.busy(false); }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    R E S O U R C E S
//


function M_RESC(dataSet, callbacks, preset) { // Account resource
	preset = preset || { tab:0, tabrestrict:false }; // tab specifies which tab appears selected when the modal window opens up. 0 = identification, 1 = calendar
	this.dS = dataSet;
	this.state = M_RESC.defaults.align(preset);

	this.callbacks = callbacks; // { saved:o_callback };
	let b = 'resc'+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons' /* cartouche */
		, name:b+'name', sign:b+'sign', comm:b+'comm', reserv:b+'reserv', color:b+'color', tag:b+'tag', note:b+'note', guide:b+'gdlns' /* identification */
		, year:b+'year' /* calendar */, viewfor:b+'v4'
		, hourlies:b+'hrlies', hourluseryes:b+'hrlyusr_yes', hourlusertod:b+'hrlyusr_tod', hourlusertom:b+'hrlyusr_tom'
		, ical:b+'ical' /* hourlies */, see_gdl:b+'see_gdl' , more_gdl:b+'more_gdl'
		, own: { h1:b+'h1' } 
		};
	this.elements = new A_el();
	this.events = { saved:new A_cb(this, this.resasaved), escaped:new A_cb(this, this.resaabort), failed:new A_cb(this, this.resaabort), deleted:new A_cb(this, this.resadeleted) };
	this.is = { bCal:(this.dS.resourceType==agClass.bCal), fCal:(this.dS.resourceType == agClass.fCal), 
		not:{ bCal:(this.dS.resourceType!=agClass.bCal), fCal:(this.dS.resourceType!=agClass.fCal) } };
	
			let mayremove = false, maysave = true; 
		if(this.dS.id>0 && mobminder.context.surfer.accessLevel>=aLevel.seller && mobminder.app.screen == screens.preferences) mayremove = true;
		if(this.is.bCal) { let bcals = C_dS_resource.count(agClass.bCal); if(bcals<2) mayremove = false; } // check also (*xcr*)
		if(preset.tabrestrict==2) { mayremove = false; maysave = false; }
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit), deletemsg:new A_cb(this, this.deletemsg)}, { remove:mayremove, save:maysave } );

		const seegdltip = { text:C_XL.w('M_RESC tip see guideline', { cap:true, nested:{rscname:this.dS.name} } ) };
	const seegdl 	= new C_iCLIK(this.eids.see_gdl, { click:new A_cb(this, this.onseegdl) }
		, { enabled:true, tip:seegdltip, css:'modal-button fa fa-gray fa-book-user touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.g /*d like duplicate*/] });
		
		const moregdltip = { text:C_XL.w('M_RESC tip create guideline', { cap:true, nested:{rscname:this.dS.name} } ) };
	const moregdl 	= new C_iCLIK(this.eids.more_gdl, { click:new A_cb(this, this.onmoregdl) }
		, { enabled:true, tip:moregdltip, css:'modal-button fa fa-gray fa-book-medical touch-green', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.alpha.g /*d like duplicate*/] });

		// identification 
		
		let maysetup = permissions.may(pc.ac_setup); // only for logins that are allowed to access the setup page
	const id			= new C_iPASS({ id:this.dS.id, type:this.dS.resourceType });
	
		const ntyping = new A_cb(this, this.nametyping, null, null, 800);
	const name 		= new C_iFIELD(this.eids.name, { onfchange:ntyping }, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name'), enabled:maysetup }); 
	const sign 		= new C_iFIELD(this.eids.sign, false, { digits:this.dS.signature, type:INPUT_TEXT, mandatory:false, focus:false, placeholder:C_XL.w('signature plhold'), enabled:maysetup }); 
	const comm		= new C_iDDWN(this.eids.comm, {}, { labels:C_XL.w({ 0:'default disabled', 1:'default enabled' })}, { value:this.dS.sendComms, enabled:true, hidden:this.is.not.bCal, enabled:maysetup } );			
	const color		= new C_iSKIN(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { type:skin.color, value:this.dS.color, enabled:maysetup } /*preset hidden:this.is.not.bCal */ );
	const tag		= new C_iSKIN(this.eids.tag, { select:new A_cb(this, this.ontagselect) } , { type:skin.rsctag, value:this.dS.tag, allownone:true, css:'tagbig', enabled:maysetup } /*preset*/ );
	
		const guides = C_dS_guidelines.options();
		const gdlhandlers = { onselect:new A_cb(this, this.ongdlselect, null, null, 400) };
		const gdloptions = { hidden:(guides.count==1), maxcols:1, maxrows:12, value:this.dS.guideId, enabled:maysetup, fallsbackonoriginalname:C_dS_guidelines };
	const guide		= new C_iDDWN(this.eids.guide, gdlhandlers, guides, gdloptions );
	const reserv 	= new C_iDDWN(this.eids.reserv, { }, { labels:C_XL.w({ 0:'scheduled', 1:'allday', 2:'time buffer' }) }, { hidden:this.is.not.fCal, value:this.dS.reservability, enabled:maysetup } );

	const note 		= new C_iNOTE(this.eids.note, this.dS.note, { enabled:maysetup }); 
	
		// other tabs
	
		const tabscaptions = C_XL.w({0:'identification', 1:'calendar', 2:'hourlies', 3:'view', 9:'audit'});
		tabscaptions[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
		
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	const year		= new C_iYEAR(this.eids.year, { select:new A_cb(this, this.free), onresa:new A_cb(this, this.resa) }, { rescid:this.dS.id } );
	const hourlies 	= new C_iPLUS(this.eids.hourlies, { select:new A_cb(this, this.hourly) }, { plusclass:new C_dS_hourly.plus(this.dS.id) });
	const hourluseryes = new C_iPLUS(this.eids.hourluseryes, { select:new A_cb(this, this.hourlyuser) }, { plusclass:new C_dS_hourlyuser.plus(this.dS.id,'past'), numbering:false });
	const hourlusertod = new C_iPLUS(this.eids.hourlusertod, { select:new A_cb(this, this.hourlyuser) }, { plusclass:new C_dS_hourlyuser.plus(this.dS.id,'today'), numbering:false });
	const hourlusertom = new C_iPLUS(this.eids.hourlusertom, { select:new A_cb(this, this.hourlyuser) }, { plusclass:new C_dS_hourlyuser.plus(this.dS.id,'future'), numbering:false });

	// view allocation for this resource (which login may see this resource)
			let granted = {}; // granted[mobminder.context.surfer.id]= {checked:true, locked:true };
			let keys = C_dS_accesskey.byaccount('config'); // lists logins from the config
		for(let kid in keys) {
				let checked = false;
					let dS_accesskey = keys[kid];
					let lid = dS_accesskey.groupId; // access keys group to a login
					let dS_login = C_dS_loggable.get(lid);
					let lock = (lid==mobminder.context.loginId) || (dS_login.accessLevel >= aLevel.seller) || (mobminder.account.single);
				if(lock) {
					granted[lid] = new C_iTEM.preset({checked:true, locked:true }); // the logged login may not remove the resource from its own view
					continue;
				}
					let view;
				switch(this.dS.resourceType) {
					case class_bCal: view = dS_accesskey.bCals; break;
					case class_uCal: view = dS_accesskey.uCals; break;
					case class_fCal: view = dS_accesskey.fCals; break;
				} if(view) view = view.split('!'); else view = false;
			if(!view) checked = true; // when no view is defined, the login see all resources of the given type
			else for(let x in view) if(view[x]==this.dS.id) { checked=true; break; } // else check if this login has the concerned resource in his view

			granted[lid] = new C_iTEM.preset({checked:checked, locked:false }); // you may not disallow a login that has only one key. If you want this, you must delete the login.
		}	
		
	const viewfor	= new C_iUSERS(this.eids.viewfor, {}, { title:C_XL.w('access allowance'),maxrows:11 }, granted);  // see (*va01*)


		const grpid = mobminder.context.groupId, logid = mobminder.context.loginId, keyid = mobminder.context.keyId;
		// let icalink = 'http://'+window.location.hostname+'/ical.php?r='+this.dS.id+'&g='+grpid+'&l='+logid;
		const icalink = 'http://ical.mobminder.com/'+grpid+'/'+logid+'/'+this.dS.id;
	const ical = new C_iFIELD(this.eids.ical, false, { digits:icalink, type:INPUT_TEXT, mandatory:false, enabled:false }); 
		// let ipadlink = 'http://'+window.location.hostname+'/index.php?lid='+mobminder.context.loginId+'&aid='+grpid+'&kid='+mobminder.context.keyId;
		const ipadlink = 'http://login.mobminder.com/'+grpid+'/'+logid+'/'+keyid;
	const ipad = new C_iFIELD(this.eids.ical, false, { digits:ipadlink, type:INPUT_TEXT, mandatory:false, enabled:false }); 
	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche
		, name:name, sign:sign, comm:comm, color:color, tag:tag, reserv:reserv, note:note, guide:guide
		, year:year, viewfor:viewfor, moregdl:moregdl, seegdl:seegdl
		, hourlies:hourlies, hourluseryes:hourluseryes, hourlusertod:hourlusertod, hourlusertom:hourlusertom, ical:ical, ipad:ipad } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:940,maxy:500,miny:400}, moves:true, morecss: { outlet:'M_RESC' } } );
	this.activate();
}
M_RESC.defaults = new A_df( { tabrestrict:false, tab:0, parent:false } );
M_RESC.prototype = { 
	// private
	header: function() {
		
			let hasguideline = this.controls.guide.value();
			let gdlsee = '<td class="cartouche">'+this.controls.seegdl.display()+'</td>';
			let gdlmore = '<td class="cartouche">'+this.controls.moregdl.display()+'</td>';
			let padder = '<td style="width:2em: min-width:2em">'+'</td>';
		
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let title = '<td class="mheader"><h1 id="'+this.eids.own.h1+'" class="modal-resource">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+padder+gdlsee+gdlmore+title+'</tr>';
		let divHeader = '<div style="padding:1em 1em 2em 1em;"><table summary="header layout" style="width:100%;">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// coordinates left side
		const name 	= '<tr>'+this.controls.name.labelled('name')+'</tr>';
		const sign 	= '<tr>'+this.controls.sign.labelled('signature', 'alpha32')+'</tr>';
		const comm 	= '<tr>'+this.controls.comm.labelled('comms autotrigger', 'alpha14')+'</tr>';
		const color 	= '<tr>'+this.controls.color.labelled('color', 'alpha12')+'</tr>';
		const tag 	= '<tr>'+this.controls.tag.labelled('tag')+'</tr>';
		const reserv 	= '<tr>'+this.controls.reserv.labelled('reservability', 'alpha16')+'</tr>';
		const note 	= '<tr>'+this.controls.note.labelled('note', 'alpha32')+'</tr>';
		const guide 	= '<tr>'+this.controls.guide.labelled('guidelines', 'alpha16')+'</tr>';
			
		const ident = '<table class="coords">'+name+sign+comm+color+tag+reserv+note+guide+'</table>';
		const tab0 = this.controls.tabs.container(0, ident);
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(0, this.state.tabrestrict!=0); };

		// calendar
		const calendar = this.controls.year.display();
		const tab1 = this.controls.tabs.container(1, calendar);
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(1, this.state.tabrestrict!=1); };
		
		// hourlies
			const wrap = true; // allows word-wrap inside the label
			const rescname = this.dS.getrscname();
		
		const hheaders = '<th style="min-width:50%; padding:0 0 1em 1.6em;"><h2>'+C_XL.w('hourlies modif')+'</h2></th>'+'<th style="padding:0 0 1em 1.6em;"><h2>'+C_XL.w('hourlies')+'</h2></th>';
		
		const hourlies = this.controls.hourlies.display('hourlies','','textcolor-light wrap', wrap); // is a <table>
			const icon = '<div class="fa fa-11x fa-sliders-v"></div>';
		const hroulybp1 = '<div class="blueprint" style="padding:2em 1em 1em 1em;">'+C_XL.w('M_RESC_bp_hourly_list', {nested:{rescname:rescname}} )+'</div>';
		let hroulybp2 = '';
		let hroulybp3 = '';
		
		switch(mobminder.app.screen) {
			case screens.hourly:
			hroulybp2 = '<div class="blueprint" style="padding:0em 1em 1em 1em;">'+C_XL.w('M_RESC_bp_hourly_create_from_hourly', {nested:{icon:icon}} )+'</div>';
			hroulybp3 = '<div class="blueprint" style="padding:0em 1em 1em 1em;">'+C_XL.w('M_RESC_bp_hourly_display_from_hourly', {nested:{icon:icon, rescname:rescname}} )+'</div>';
				break;
			default:
			hroulybp2 = '<div class="blueprint" style="padding:0em 1em 1em 1em;">'+C_XL.w('M_RESC_bp_hourly_create', {nested:{icon:icon}} )+'</div>';
			hroulybp3 = '<div class="blueprint" style="padding:0em 1em 1em 1em;">'+C_XL.w('M_RESC_bp_hourly_display', {nested:{icon:icon, rescname:rescname}} )+'</div>';
		}
		
		const hourlusertom = this.controls.hourlusertom.display('hourlies modif','','textcolor-light wrap', wrap); // is a <table>
		const hourlusertod = this.controls.hourlusertod.display('hourlies modif','','textcolor-light wrap', wrap); // is a <table>
		const hourluseryes = this.controls.hourluseryes.display('hourlies modif','','textcolor-light wrap', wrap); // is a <table>
		
			const toptrtitle = '<tr><td><h3 style="padding:.5em 0 0.5em 1em;">'+C_XL.w('next apps')+'</h3></td>'+'<td rowspan=6 style="padding:0 1em; vertical-align:top;">'+hourlies+hroulybp1+hroulybp2+hroulybp3+'</td>'+'</tr>';
			const toptr = '<tr><td style="padding:0 1em;">'+hourlusertom+'</td>'+'</tr>';
			
			const middletrtitle = '<tr><td style="padding:0 1em;"><h3>'+C_XL.w('today')+'</h3></td>'+'</tr>';
			const middletr = '<tr><td style="padding:0 1em;">'+hourlusertod+'</td>'+'</tr>';
			
			const bottomtrtitle = '<tr><td style="padding:0 1em;"><h3>'+C_XL.w('prev apps')+'</h3></td>'+'</tr>';
			const bottomtr = '<tr><td style="padding:0 1em;">'+hourluseryes+'</td>'+'</tr>';
			
		const hourlytable = '<table summary="hourly" class="" style=""><tr>'+hheaders+'</tr>'+toptrtitle+toptr+middletrtitle+middletr+bottomtrtitle+bottomtr+'</table>';
		
		const tab2 = this.controls.tabs.container(2, hourlytable);
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(2, this.state.tabrestrict!=2); };
		
		// view
			// const viewfor = '<tr><td>'+this.controls.viewfor.display()+'</td></tr>';
				// viewfor = '<div><table summary="view allocation" style="margin-top:2em;">'+viewfor+'</table></div>';
			const viewfor = this.controls.viewfor.display();
		
			const hideviewtab = (!mobminder.context.surfer.is.atleast.seller)||(mobminder.account.single);
		const tab3 = this.controls.tabs.container(3, viewfor); this.controls.tabs.hide(3,hideviewtab); // see (*va01*)
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(3, this.state.tabrestrict!=3); };
		
		
		const tab9 = this.controls.tabs.container(9, this.tracking() );
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(9, this.state.tabrestrict!=9); };
		
		return tab0+tab1+tab2+tab3+tab9;
	},
	activate: function() {
		this.controls.activate('M_RESC');
		this.elements.collect(this.eids.own);
		$(this.controls.ical.elements.ui).removeClass('disabled');
		$(this.controls.ipad.elements.ui).removeClass('disabled');
		this.oncolorselect(this.dS.color);
		this.ongdlselect();
	},
	
	// private
	title: function() {
		let name = this.controls.name.value(), tagcode = this.controls.tag.value();
		if(this.dS.id <= 0 && name == '') name = C_XL.w('new');
		let tag = '';
		if(tagcode) tag = '<div class="fa fa-13x '+C_iSKIN.tagcss(tagcode)+'" style="padding-left:.6em; min-width:1.4em;"></div>';
		const title = C_XL.w('single'+this.dS.resourceType)+': '+name+tag;
		return title;
	},
	tracking: function() {
		const tracking = this.dS.tracking();
		const ical = '<tr>'+this.controls.ical.labelled('ical link', 'alpha28')+'</tr>';
		const ipad = '<tr>'+this.controls.ipad.labelled('ipad link', 'alpha32')+'</tr>';
			const links = '<table style="margin:1em 0;">'+ical+ipad+'</table>';
		return tracking+links;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		const names = { id:{id:'id', type:'resourceType' }, viewfor:'viewfor'
			, name:'name', sign:'signature', comm:'sendComms', color:'color', tag:'tag', note:'note', reserv:'reservability', guide:'guideId'};
		mobminder.app.post(this.controls, names, './post/resource.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		const names = { id:{id:'id'} };
		mobminder.app.post(this.controls, names, './delete/resource.php', new A_cb(this,this.deleted), new A_cb(this,this.failed), {timeout:120000}); // 120 secs = 2mins
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	oncolorselect: function(ccode) {
		if(ccode==0) // the default color was selected
			this.modal.setmborder(0);
		if(vbs) vlog('modals.js', 'M_RESC', 'oncolorselect', 'ccode:'+ccode);
		this.modal.setmborder(ccode);
		return this;
	},
	ontagselect: function(tcode) {
		setTimeout( () => { this.elements.h1.innerHTML = this.title(); }, 500 );
		if(vbs) vlog('modals.js', 'M_RESC', 'ontagselect', 'tcode:'+tcode);
	},
	nametyping: function(digits) {
		this.elements.h1.innerHTML = this.title();
	},
	onseegdl: function() { 
			const gdlid = this.controls.guide.value()|0; // !! anything retrieved from the DOM is string, we need to cast it to integer
			const dS = C_dS_guidelines.get(gdlid);
			const gdlsaved = new A_cb(this, this.gdlsaved);
			const gdlremoved = new A_cb(this, this.gdlremoved);
		const modal = new M_GDLNS(dS, {saved:gdlsaved, deleted:gdlremoved});
	},
	onmoregdl: function() { 
			const dS = new C_dS_guidelines(C_dS_trackingCC.tnew(0, mobminder.account.id).concat([this.dS.name,'','','','belgium']));	
			const gdlsaved = new A_cb(this, this.gdlsaved);
			const gdlremoved = new A_cb(this, this.gdlremoved);
		const modal = new M_GDLNS(dS, {saved:gdlsaved, deleted:gdlremoved});
	},
	ongdlselect: function(v) { 
		v = v|0 || this.controls.guide.value()|0; // !! anything retrieved from the DOM is string, we need to cast it to integer
		const isreplica = this.dS.id > 0; // only existing resources can have linked guidelines
		this.controls.seegdl.visible(isreplica&&!!v&&!this.state.tabrestrict); // tab restrict is used when opening this modal from the hourly view: you see only the hourlies tab.
		this.controls.moregdl.visible(isreplica&&!v&&!this.state.tabrestrict);
	},
	deletemsg: function() { // returns a custom message to be displayed on the C_iMSG warning and asks for confirmation
				
				const triangle = '<td style="width:60px; max-width:50px; font-size:2.4em;"><div class="fad fa-exclamation-triangle" style="">'+'</div></td>';
		
				const msg1 = '<table><tr>'+triangle+'<td style="width:479px; max-width:479px; line-height:2em;">'+C_XL.w('delete confirm resource')+'</td>'+triangle+'</tr></table>';
				const msg2 = C_XL.w('delete confirm resource warning');
			const div1 = '<div class="orange center bold bigger">'+msg1+'</div>';
			const div2 = '<div class="black center airtop bold bigger">'+this.dS.name+'</div>';
			const div3 = '<div class="black center airtop airunder notbold bigger" style="line-height:1.8em;">'+msg2+'</div>';
		
		return div1+div2+div3;
	},
	
	// ajax callback
	saved: function(inlineDataSets) { // resource data saved
		if(this.dS.id <= 0) mobminder.context.ctxtmeta();
		const dataSets = inlineDataSets['C_dS_resource'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; } // picks first in line
		if(this.callbacks.saved) this.callbacks.saved.cb(dataSet);
		this.quit();
	},
	deleted: function() {
		if(this.callbacks.saved) this.callbacks.deleted.cb(this.dataSet);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	free: function(ordered, eid) { // YEAR PLANNING: dragging over free cells
		if(!permissions.may(pc.ch_calendar)) return this.controls.year.draggingdone();
		const handlers = { select:new A_cb(this, this.customcss, ordered), escaped:new A_cb(this, this.resaabort) };
		this.controls.css = new C_iCSS(eid, handlers, { cssclass:resaclass.event, csstype:ccsstype.color, blind:true, idle:true, value:0, enabled:true } /*preset*/ );
		if(this.controls.css.optcount() > 1)
			return this.controls.css.activate().drop(); // many possible css, let first choose
		this.customcss(ordered, this.controls.css.optfirst());
	}, 
	customcss: function(ordered, css) { // clicking from the menu showing possible colors for a new off day
		if(vbs) vlog('modals.js', 'M_RESC', 'customcss', 'css:'+css);
		// console.log('modals.js', 'M_RESC', 'customcss', 'css:'+css);

		this.controls.css.close();
		rmems.flush('slots');
		const id = 0;
		const attendee = new C_dS_attendee('slots',[0, id, this.dS.resourceType, this.dS.id]); // is recorded into C_dS_attendee register, under bank 'slots'
		const dayOut = ordered.out.jsDate.clone().addDay(1);
			// const defaults = [ordered.cin.stmp, dayOut.stamp()];
				const oursetup = C_dS_reservation.defaults.array({cueIn:ordered.cin.stmp, cueOut:dayOut.stamp(), cssColor:css|0, note:'' }); // definition of A_df.array() see (*df02*)
			const members = C_dS_trackingCCD.tnew(id, mobminder.account.id).concat(oursetup); // which is an array[] with all setup values and tracking
		const resa = new C_dS_reservation('slots', members); // see (*cp01*)
		
		// as we are triggered from a modal-pad, this one needs to start after the animation delay
		setTimeout( function(that, resa, events) { new M_RESA(resa, events, { tab:0 } ); }, C_iMODAL.animationdelay, this, resa, this.events );
	},
	resa: function(resa) { // clicking a reserved day off on the year calendar
		new M_RESA(resa, this.events, {tab:0} );
	},
	resasaved: function(resa) { // YEAR PLANNING: day off saved on year planning
		this.controls.year.draggingdone();
		this.controls.year.set();
		mobminder.app.refresh();
	},	
	resadeleted: function(jsDate) { // YEAR PLANNING: day off deleted from year planning
		this.controls.year.set();
		mobminder.app.refresh();
	},
	resaabort: function() { // escaping a dayoff selection on the year planning
		this.controls.year.draggingdone();
	},
	hourly: function(dS_hourly) { // opens an hourly
		if(dS_hourly.id == 0) return; // the default "No hourly" hourly can not be opened
		if(permissions.may(pc.ch_hourly)) 
			new M_Hourly(dS_hourly, { saved:new A_cb(this, this.hourlysaved), removed:new A_cb(this, this.hourlyremoved) }, { tab:0 } );
		return;
	},
	hourlysaved: function hourlysaved(dataset) { 
		this.controls.hourlies.refresh();	
		this.controls.hourlusertom.refresh();	
		this.controls.hourlusertod.refresh();	
		this.controls.hourluseryes.refresh();	
	},
	hourlyuser: function(dS_hourlyuser) { if(permissions.may(pc.ch_hourly)) return new M_Huser(dS_hourlyuser, { saved:new A_cb(this, this.hourlyusersaved), removed:new A_cb(this, this.huserremoved) }, { tab:0 } ); },
	hourlyusersaved: function hourlysaved(dataset) { 
		this.controls.hourlies.refresh();	
		this.controls.hourlusertom.refresh();	
		this.controls.hourlusertod.refresh();	
		this.controls.hourluseryes.refresh();	
	},
	hourlyremoved: function hourlysaved(dataset) { 
		this.controls.hourlies.refresh();	
		this.controls.hourlusertom.refresh();	
		this.controls.hourlusertod.refresh();	
		this.controls.hourluseryes.refresh();	
	},
	huserremoved: function hourlysaved(dataset) { 
		this.controls.hourlies.refresh();	
		this.controls.hourlusertom.refresh();	
		this.controls.hourlusertod.refresh();	
		this.controls.hourluseryes.refresh();	
		mobminder.app.refresh({callserver:true});
	},
	gdlsaved: function(datasets) {
		mobminder.sounds.done.play();
		if(this.state.parent) this.state.parent.controls.guidelines.refresh(); // resets the plus list on the C_backPREFS.guidelines display
		
		let dS_guidelines = false;
		for(let x in datasets['C_dS_guidelines']) { dS_guidelines = datasets['C_dS_guidelines'][x]; break; }
		
		// console.log('gdlsaved id:', dS_guidelines.id, ', name:' ,dS_guidelines.name);
		if(dS_guidelines) {
			const guides = C_dS_guidelines.options(); // let's make sure we have this newbie in the list of options inside this.controls.guide dropdown
			this.controls.guide.options = guides;
			this.controls.guide.set(dS_guidelines.id);
			if(this.state.parent) this.state.parent.controls.guidelines.refresh(); // resets the plus list on the C_backPREFS.guidelines display
		}
		
	},
	gdlremoved: function(dS_guidelines) {
		// dS_guidelines is a copy of the just removed object
		this.controls.guide.set(0);
		if(this.state.parent) this.state.parent.controls.guidelines.refresh(); // resets the plus list on the C_backPREFS.guidelines display
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//    H O U R L I E S      M A N A G E M E N T 
//

function Pad_iHUSER_Action(position, callbacks, preset) { // used by planning.js::P_hourly, never called for virtuals (id<=0)

		preset = preset || {}; // preset like { tab:tab, tabrestrict:tab }
	this.eids = { ui:'Pad_iHUSER_Action'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { saved:new A_cb(this, this.refresh) } 
			
	this.state = Pad_iHUSER_Action.defaults.align(preset);
		if(vbs) vlog('modals.js','Pad_iHUSER_Action','constructor','');

	const menu = new C_iMENU(this.eids.ui, { onlabel:new A_cb(this, this.select) }, this.setoptions(), { } )
	
	this.controls = new A_ct( {menu:menu} );
	
		const header = this.header();
		const body = menu.display('Pad_iHUSER_Action actioncut');
		
		// position: see (*sh01*) should trigger just right off the mouse pointer position
		
	this.modal = new C_iMODAL({header:header, body:body}, {  }, { style:'message', flies:true, position:position, size:{maxy:'28em', maxx:'20em'}, moves:false, morecss:{ outlet:'Pad_iHUSER_Action', inset:'actionpad' } } );
	this.activate();
}
Pad_iHUSER_Action.defaults = new A_df( { date:0, rscId:0, hourlyset:0, resource:0 } );
Pad_iHUSER_Action.prototype = {
	// publiceresaUrl
	activate: function() { // must be called after display
		this.elements.collect(this.eids);
		this.controls.activate('Pad_iHUSER_Action');
		return this;
	},
	reset: function(o) { return this; },
	
	// private
	header: function() {
		let date = new Date(this.state.date);
		let fulldate = C_XL.date(date, {abreviation:'full', weekday:true, cap:1 });
		let ishchange = this.state.hourlyset.dayIn == date.stamp();
		let isexcphourly = false;
		let csscolor = 'mob-txt-gray_m';
		if(this.dS_hourlyuser) { // was set by this.setoptions();
			isexcphourly = this.dS_hourly.periodicity==0; // this.hourly was set by this.setoptions();
		}
		if(ishchange) {
			if(isexcphourly) { csscolor = 'mob-txt-lime-thick'; fulldate = fulldate+' <span style="font-size:80%;">( '+C_XL.w('exceptional_hourly')+' )<span>'; }
			else { // new recurring hourly
				let recurring = '<div class="fas fa-sync fa-09x"></div>';
				let hourlychange = '<span style="font-size:80%;"> : '+C_XL.w('hourly change')+'<span>';
				let newhourlyname = '<br/><span style="font-size:100%;" class="">'+C_XL.w('from_thisday_on')+':&nbsp;&nbsp;'+recurring+'&nbsp;&nbsp;'+this.dS_hourly.name+' <span>';
				csscolor = 'mob-txt-blue'; fulldate = fulldate+hourlychange+newhourlyname;
			}
		} else { // recurring hourly or no hourly at all
			if(this.dS_hourly) {
				let recurring = '<div class="fas fa-sync fa-09x"></div>';
				fulldate = fulldate+' <span style="font-size:80%;">( '+recurring+' '+this.dS_hourly.name+' )<span>';
			} else {
				fulldate = fulldate+' <span style="font-size:80%;">( '+C_XL.w('no_hourly')+' )<span>';
			}
		}
		return '<h2 style="padding:0 0 .4em .6em;" class="'+csscolor+'">'+fulldate+'</h2>';
	},
	setoptions: function() {

		let labels = [];
		let hourlyset = this.state.hourlyset;
		let date = new Date(this.state.date);
		let rscId = this.state.rscId;
		this.dS_hourlyuser = C_dS_hourlyuser.registers.bydayin.get(rscId, hourlyset.dayIn);
		
		let isexcphourly, rotation, fulldate, ifoffday;
		if(this.dS_hourlyuser) {
			this.dS_hourly = this.dS_hourlyuser.hourly();
				let daycode = this.dS_hourly.dayCode(date);
			this.dS_shadow = C_dS_shadow.get4Hourly(this.dS_hourly.id,daycode,1); // requests for only one (the first) dS_shadow, might be undefined in 0-24h accounts, see (*hr11*)
			
			isexcphourly = this.dS_hourly.periodicity==0; // this hourly applies only on that day
			let ismultiweek = this.dS_hourly.periodicity>1 ? this.dS_hourly.periodicity : 0; // rotates on 2, 3 or 4 weeks
			rotation = ''; if(ismultiweek) rotation = ' (1/'+ismultiweek+')';
			
			fulldate = C_XL.date(date, {abreviation:'full', weekday:true, cap:0 });
				
			if(this.dS_shadow) { // in a 0-24h account, there might never exist a first shadow, because start and end of day shadows do not exist there
				ifoffday = (this.dS_shadow.cueIn==0)&&(this.dS_shadow.cueOut==86400);
			} else ifoffday = false;
		}
		
		let customhourliescount = C_dS_hourly.registers.byid.ends()-1; // there is a default hourly in this collection with id:0. We check only on custom hourlies.
		if(hourlyset.dayIn == date.stamp()) { // then there is already a change in the hourly right on this date
		
				let previous = this.dS_hourlyuser.previous({periodic:true}); // checks if there is a previous periodic hourlyuser in the past, with identical id
				let isbridge = (previous.hourlyId==this.dS_hourly.id); // this is a bridge over a one or few exceptional husers
				if(isexcphourly) {
					if(!isbridge) labels[881] = C_XL.w('huser_backto_recurring');
					if(ifoffday)
						labels[663] = C_XL.w('shadow_open_this_day', {nested:{fulldate:fulldate}} ); // 'open only on this day $fulldate$'
					else
						labels[662] = C_XL.w('shadow_close_this_day');
				}
				else {
					if(!isbridge) labels[882] = C_XL.w('huser_backto_previous_hourly');
					let dayname = C_XL.weekday( date.getPHPday(), 'every', undefined, 0);
					if(this.dS_hourly.id) // default hourly 0 can not open nor close every daycode
						if(ifoffday) {
							labels[664] = C_XL.w('shadow_open_every', {nested:{dayname:dayname,rotation:rotation} } ); // 'open every $dayname$ in the hourly $rotation$'
						} else {
							labels[666] = C_XL.w('shadow_close_every', {nested:{dayname:dayname,rotation:rotation}}); // 'close every $dayname$ in the hourly $rotation$'
						}
				}
				labels[883] = C_XL.w('huser_see_all_properties'); // opens up the M_Huser() without shortcut
				
				
				
		} else {  // M_NewHourly business, the dat is in the range where is possible to introduce new hourlies, or re-use hourlies
		
			if(customhourliescount) { // is there any available hourly in this account?
				labels[884] = C_XL.w('huser_make_new_hourly');
				labels[885] = C_XL.w('huser_reuse_an_hourly');
			} else { // else this on is the very first
				labels[884] = C_XL.w('huser_make_very_first_hourly');
			}
			
			// let's see what we can do for open and closed days and turning exceptionals into recurrent
			if(this.dS_hourlyuser) { // there is a running hourly
				
				if(isexcphourly) {
					if(ifoffday)
						labels[663] = C_XL.w('shadow_open_this_day', {nested:{fulldate:fulldate}} ); // 'open only on this day $fulldate$'
					else
						labels[662] = C_XL.w('shadow_close_this_day');
				} else {
					let dayname = C_XL.weekday( date.getPHPday(), 'every', undefined, 0);
					if(this.dS_hourly.id) // default hourly 0 can not open nor close every daycode
						if(ifoffday) {
							labels[663] = C_XL.w('shadow_open_this_day', {nested:{fulldate:fulldate}} ); // 'open only on this day $fulldate$'
							labels[664] = C_XL.w('shadow_open_every', {nested:{dayname:dayname,rotation:rotation}} ); // 'open every $dayname$ in the hourly $rotation$'
						} else {
							labels[665] = C_XL.w('shadow_make_exception');
							labels[666] = C_XL.w('shadow_close_every', {nested:{dayname:dayname,rotation:rotation}}); // 'close every $dayname$ in the hourly $rotation$'
							labels[667] = C_XL.w('shadow_close_only_this_day', { nested:{fulldate:fulldate} } ); // 'open only on this day $fulldate$'
						}
				}
			} else {
				// this date is in a period where no hourly is running
				
			}
		}
		if(customhourliescount) labels[888] = C_XL.w('huser_manage_hourlies'); // opens up the M_RESC() without shortcut, and 
		
		let order = []; for(let v in labels) order.push(v); // which follows the order set by labels[]
		return { order:order, labels:labels };
		
	},
	escape: function() { // called by C_iMODAL
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		return true; // return true causes modal to get removed from screen
	},
	
	// callbacks
	select: function(value) {  // C_iMENU event handler, option picked from the pad, can be called inline before activation
		value = value|0; // turns from string to integer
		let date = new Date(this.state.date);
		let resource = this.state.resource;
		
		if(vbs) vlog('modals.js','Pad_iHUSER_Action','select','value:'+value);
		// console.log('Command = '+value);
		
		this.modal.close();
		let command = '', tab = 0; // this M_SHADOW might need to open in auto-save, or auto-delete mode.
		switch(value) {
				// M_Huser
			case 881: command = 'huser_backto_recurring'; break; // is going to remove the C_dS_hourlyuser
			case 882: command = 'huser_backto_previous_hourly'; break; // is also going to remove the C_dS_hourlyuser
			case 883: command = 'huser_see_all_properties'; break; // opens up the M_Huser
			
				// M_NewHourly
			case 884: command = 'huser_make_new_hourly'; break; // 
			case 885: command = 'huser_reuse_an_hourly'; tab = 1; break; // 
			
				// M_SHADOW
			case 662: command = 'shadow_close_this_day'; break; // 
			case 663: command = 'shadow_open_this_day'; break; // 
			case 664: command = 'shadow_open_every'; break; // 
			case 665: command = 'shadow_make_exception'; break; // 
			case 666: command = 'shadow_close_every'; break; // 
			case 667: command = 'shadow_close_only_this_day'; break; // 
		}
		
		switch(value) { // now open the right modal according to context allowability
			case 881: 
			case 882: 
			case 883: 
				return new M_Huser(this.dS_hourlyuser, this.callbacks, { tab:tab, command:command } ); // that transfers all the callbacks back to the caller layer
			
			case 884: // new hourly: tab 0
			case 885: // reuse hourly: tab 1
				return new M_NewHourly( this.callbacks, { tab:tab, resource:resource, date:date, command:command } ); // opens and keep open the legacy  where almost everything is possible :)
			
			case 888:
				return new M_RESC(resource, {}, { tab:2, tabrestrict:2 } ); // opens up the "hourlies" tab on the M_RESC.
			
			case 662: 
			case 663: 
			case 664: 
			case 665: 
			case 666: 
			case 667: 
				let dS_shadow = this.dS_shadow;
				if(!dS_shadow) { // this can only happen on a 0-24h display range, see (*hr11*) 
					// console.log('Missing a dS_shadow, improvising...');
					dS_shadow = new C_dS_shadow(); // a zero 
					dS_shadow.id = -9999;
					dS_shadow.cueIn = 0;
					dS_shadow.cueOut = 3600; // is a coded way to prepare /post/shadow to an operation where no shadow is created. see (*hr10*)
				}
				return new M_SHADOW( dS_shadow, this.dS_hourlyuser, date, resource.id, this.callbacks, { tab:0, tabrestrict:0, command:command } );
		}
	}
	// more callbakcs
	
}


function M_Huser(dS_hourlyuser, callbacks, preset) { // Hourly change modal

	preset = preset || {};
	this.state = M_Huser.defaults.align(preset);		

	this.dataSet = dS_hourlyuser;
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const base = 'hrly'+'_';
	this.eids = { 
		id:base+'id', tabs:base+'tabs', buttons:base+'buttons', 
		dayin:base+'name', hourly:base+'reserv' };
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit), deletemsg:new A_cb(this, this.deletemsg)}, { save:false } );
	
	const pass	= new C_iPASS( { id:dS_hourlyuser.id } );
	const dayin 	= new C_iDP(this.eids.dayin, {dayclick:new A_cb(this, this.dayin)}, { stmp:this.dataSet.dayIn, display:{abreviation:'full', weekday:true}, enabled:false } );	
	const hourly 	= new C_iDDWN(this.eids.hourly, {onselect:new A_cb(this, this.hourly)}, C_dS_hourly.options(), { value:this.dataSet.hourlyId, enabled:false, tag:'div' } ); 
	
		const tabscaptions = C_XL.w({0:'hourly', 1:'audit'});
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls 	= new A_ct( { pass:pass, tabs:tabs, cartouche:cartouche, dayin:dayin, hourly:hourly } );
	
		const visiblemode = (this.state.command=='huser_see_all_properties'||this.state.command==0);
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:600}, moves:true, invisible:!visiblemode } );
	this.activate();
	if(this.state.command) {
		switch(this.state.command) {
			case 'huser_backto_recurring':
			case 'huser_backto_previous_hourly': this.remove(); break;
			case 'huser_see_all_properties': break; 
		}		
	}
}
M_Huser.defaults = new A_df( { command:'' } );
M_Huser.prototype = {
	// private
	header: function() {
			let dS_hourly = this.dataSet.hourly();
		let isexceptional = (dS_hourly.periodicity==0);
		
		// buttons and tittle
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let title = '<td><h1>'+C_XL.w(isexceptional?'exceptional_hourly':'hourly change')+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';				
		
		// blue information
				let indate = C_XL.date(this.dataSet.dayIn, {abreviation:'full', weekday:true, cap:0});
			header += '<tr>'+'<td colspan=2; style="padding-bottom:1em;"><h1>'+C_XL.w('ondate')+' '+indate+'</h1></td>'+'</tr>';
			
		// green information
		if(isexceptional) {
			header += '<tr><td colspan=2; style="align:left;"><h2>'+C_XL.w('ex hourly change')+'&nbsp;'+indate+'</h2></td>'+'</tr>';
		} else {
			let recurring = '<div class="fas fa-sync fa-08x"></div>';
			header += '<tr><td colspan=2; style="align:left;"><h2>'+C_XL.w('new hourly')+': '+dS_hourly.name+'&nbsp;&nbsp;'+recurring+'</h2></td>'+'</tr>';
			header += '<tr><td colspan=2; style="align:left;"><h2>'+C_XL.w('enters into force')+': '+indate+'</h2></td>'+'</tr>';
		}

		// pack up
		let divHeader = '<div style="padding:1em 2em;"><table summary="M_Huser header" style="width:100%;">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// tab 0 schedule & hourly
		let dayin = '<tr>'+this.controls.dayin.labelled('enters into force','alpha20')+'</tr>';
		let hourly = '<tr>'+this.controls.hourly.labelled('new hourly','alpha20 like-input')+'</tr>';
		let ident = '<table style="margin: 2em auto;" class="coords">'+hourly+dayin+'</table>';
		let tab0 = this.controls.tabs.container(0, ident);

		// tab 1 
		let tracking = 'tracking';
		let tab1 = this.controls.tabs.container(1, tracking);
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_Huser');
	},
	
	// private

	// event handling
	dayin: function(stamp) {
		if(vbs) vlog('modals.js','M_Huser','saved','stamp='+stamp);
	},
	hourly: function(date) {
		if(vbs) vlog('modals.js','M_Huser','hourly','date='+date.sortable);
	},
	save: function() {
		if(!this.controls.validation()) return;
		let names = { pass:{id:'id'}, hourly:'hourlyId', dayin:'dayIn'};
		mobminder.app.post(this.controls, names, './post/hourlyusr.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() { 
		this.modal.busy(true);
		let names = { pass:{id:'id'} };
		mobminder.app.post(this.controls, names, './delete/hourlyusr.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
			let rscId = this.dataSet.groupId; 
		C_dS_hourlyuser.del({rscId:rscId});
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	
	// ajax callback
	saved: function(inlineDataSets) {
		let dataSets = inlineDataSets['C_dS_hourlyuser'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; }
		if(vbs) vlog('modals.js','M_Huser','saved','id='+dataSet.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(dataSet);
		this.quit();
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_Huser','removed','id='+this.dataSet.id);
		// C_dS_hourlyuser.del({id:this.dataSet.id});
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	deletemsg: function() {
		let msg = C_XL.w('huser_backto_previous_hourly'); // this translation is used elsewhere
		return msg;
	}
}


function M_Hourly(dS_hourly, callbacks, preset) { // Hourly modal from the resource modal "hourlies" tab
	preset = preset || {};
	this.dataSet = dS_hourly;
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const base = 'hrly'+'_';
	this.eids = { 
		id:base+'id', tabs:base+'tabs', buttons:base+'buttons', 
		name:base+'name', reserv:base+'reserv', note:base+'note', 
		colorOff:base+'coloff', colorExcp:base+'colexcp', colorAbs:base+'colabs', 
		period:base+'period',
		usage:base+'usg',
		own:{ period_bp:base+'period_bp'}	};
	this.elements = new A_el();

	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:false } );
	
		const monday = this.dataSet.monday;
		if(!monday) { const d = new Date(); this.dataSet.monday = d.monday().toMidnight().stamp(); }
	const pass		= new C_iPASS( { id:this.dataSet.id, monday:this.dataSet.monday } );
	
		mobminder.app.post({p:pass}, {p:{id:'id'}}, './queries/hourlydeletable.php', new A_cb(this,this.deletable));
	
	const name 		= new C_iFIELD(this.eids.name, false, { digits:dS_hourly.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
	const period 	= new C_iDDWN(this.eids.period, { onselect:new A_cb(this, this.onperiod) }, {labels:C_XL.w({ 1:'weekly', 2:'2 weeks', 3:'3 weeks', 4:'4 weeks' })}, { value:this.dataSet.periodicity } );
	
	const colorExcp	= new C_iSKIN(this.eids.colorExcp, {} /*callbacks*/, { type:skin.color, value:dS_hourly.colorExcp } /*preset*/ );
	const colorOff	= new C_iSKIN(this.eids.colorOff, {} /*callbacks*/, { type:skin.color, value:dS_hourly.colorOff } /*preset*/ );
	const colorAbs	= new C_iSKIN(this.eids.colorAbs, {} /*callbacks*/, { type:skin.color, value:dS_hourly.colorAbsent } /*preset*/ );
	const note 		= new C_iNOTE(this.eids.note, ''); 
	
		const tabscaptions = C_XL.w({0:'definition', 1:'usage', 2:'audit'});
		tabscaptions[2] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls 	= new A_ct( { pass:pass, tabs:tabs, cartouche:cartouche, name:name, period:period, colorOff:colorOff, colorExcp:colorExcp, colorAbs:colorAbs, note:note} );
	
	this.usages	= new A_ct(agClassMatrix(new A_ct(),new A_ct(),new A_ct())); // reserved for hourly usage display
	const usages = this.dataSet.usage(); 
	for(let type in usages) {
		let rscrs = usages[type];
		for(let rid in rscrs) {
			let rescr = C_dS_resource.get(rid)
				let eid = this.eids.usage+'_'+type+'_'+rid;
			let usage = this.usages[type].add1(new C_iPLUS(eid, { select:false }, { plusclass:usages[type][rid] }), rid);
		}
	} // output like this.usages[type][rid] = C_iPLUS
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:700, miny:300, maxy:440}, moves:true, morecss:{ outlet:'M_Hourly' } } );
	this.activate();
}
M_Hourly.prototype = {
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-hourly">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div style="padding:1em 1em 2em 1em;"><table summary="header layout" style="width:100%;">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// tab 0 ( schedule and colors )
		// let name = '<tr>'+this.controls.name.labelled('name')+'</tr>';
		// let period = this.controls.period.labelled('periodicity');
		// let colorOff = '<tr>'+this.controls.colorOff.labelled('color off', 'alpha12')+'</tr>';
		// let colorExcp = '<tr>'+this.controls.colorExcp.labelled('color excp', 'alpha12')+'</tr>';
		// let colorAbs = '<tr>'+this.controls.colorAbs.labelled('color absent', 'alpha12')+'</tr>';
		// let note = '<tr>'+this.controls.note.labelled('note', 'alpha32')+'</tr>';

		let padder = '<tr><td colspan=3>'+'&nbsp;'+'</td></tr>';
		let name = '<tr>'+this.controls.name.labelled('name')+'<td class="blueprint">'+C_XL.w('m_newhourly_name')+'</td>'+'</tr>';
		let period = '<tr>'+this.controls.period.labelled('periodicity')+'<td class="blueprint" id="'+this.eids.own.period_bp+'">'+'</td>'+'</tr>';
		
		let colortitle = '<tr><td></td><td colspan=2 class="" style="text-align:left; padding:0 0 .6em 0;">'+C_XL.w('colors')+':'+'</td></tr>';
		let colorExcp = '<tr>'+this.controls.colorExcp.labelled('color excp', 'alpha12')+'<td class="blueprint" rowspan=3>'+C_XL.w('m_newhourly_colors')+'</td>'+'</tr>';
		let colorOff = '<tr>'+this.controls.colorOff.labelled('color off', 'alpha12')+'</tr>';
		let colorAbs = '<tr>'+this.controls.colorAbs.labelled('color absent', 'alpha12')+'</tr>';
		
		let note = '<tr>'+this.controls.note.labelled('note', '', {colspan:2})+'<td></td>'+'</tr>';
				
			let ident = '<table summary="new hourly" style="margin:0 auto; max-width:calc(100% - 40px);" class="coords">'+name+period+padder+colortitle+colorExcp+colorOff+colorAbs+padder+note+'</table>';
		let tab0 = this.controls.tabs.container(0, ident);

		// tab 1 
			let trs = new Array();
			for(let type in this.usages.get) {
				let plusses = this.usages[type];
				for(let rid in plusses.get) {
					let rescr = C_dS_resource.get(rid);
					let plus = plusses[rid];
					trs.push('<tr style="margin-top:2em;"><td class="bold right top">'+rescr.name+'</td><td class="pad">'+plus.display()+'</td></tr>');
				}
			}
		let usage = '<table style="margin:1em auto;">'+trs.join('')+'</table>';
		let tab1 = this.controls.tabs.container(1, usage);

		// tab 2 
		let tab2 = this.controls.tabs.container(2, this.dataSet.tracking());
		
		return tab0+tab1+tab2;
	},
	activate: function() {
		this.controls.activate('M_Hourly');
		this.usages.activate('M_Hourly');
		this.elements.collect(this.eids.own);
		this.controls.period.set(this.dataSet.periodicity); // that calls back the this.onperiod() function that will set up the blueprint
	},
	
	// private
	title: function() {	
		let title = C_XL.w('hourly')+': '+this.dataSet.name;
		return title;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		
		this.modal.busy(true);
		let names = { pass:{id:'id', monday:'monday'}, name:'name', period:'periodicity', colorOff:'colorOff', colorExcp:'colorExcp', colorAbs:'colorAbsent', note:'note'};
		
		if(vbs) vlog('modals.js','M_Hourly','save','id='+this.dataSet.id+', periodicity:'+this.controls.period.value() );
		C_dS_shadow.del(this.dataSet.id);
		mobminder.app.post(this.controls, names, './post/hourly.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() { // allowed only when the hourly is not currently active in any resource of the account
		this.modal.busy(true);
		let names = { pass:{id:'id'} };
		mobminder.app.post(this.controls, names, './delete/hourly.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
		C_dS_hourlyuser.reset();
		C_dS_hourly.del(this.dataSet.id);
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	onperiod: function(selection) {
		let periodbp = C_XL.w('m_newhourly_period', {nested:{recweeks:selection}}); // finds $recweeks$ in the translation and replaces it
		this.elements.period_bp.innerHTML = periodbp;
	},
	
	// ajax callback event handlers
	deletable: function(dSets, stream) { // hourlies are allowed deletion only when they are not used by any account resource any more
		let parts = stream.split('##');
		let inuse = parts.shift()|0;
		this.controls.cartouche.enable(!inuse, 'remove');
	},
	saved: function(inlineDataSets) {
		if(vbs) vlog('modals.js','M_Hourly','saved','id='+this.dataSet.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(inlineDataSets);
		mobminder.app.refresh();
		this.quit();
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_Hourly','removed','id='+this.dataSet.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	}
}


function M_NewHourly(callbacks, preset) { // New hourly and hourly change on the hourly view
	preset = preset || {};
	this.state = M_NewHourly.defaults.align(preset);		
	this.state.current = this.state.resource.schedule(this.state.date); // query the hourly that is currently used at the clicked date
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const base = 'sched'+'_';
	this.eids = { 
		id:base+'id', tabs:base+'tabs', buttons:base+'buttons', 
		name:base+'name', reserv:base+'reserv', note:base+'note', 
		colorOff:base+'coloff', colorExcp:base+'colexcp', colorAbs:base+'colabs', period:base+'period',
		dpFrom:base+'dpFrom', hourlies:base+'hourlies', 
		dpIn:base+'dpIn', dpOut:base+'dpOut', skip:base+'skip', back:base+'back',
		own: { period_bp:base+'period_bp', colors_bp:base+'colors_bp' }		};
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, { onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:false } );
	
		const currentHid = this.state.current?this.state.current.hourly.id:0; // when clicking in a period where no hourly is applied
	const pass		= new C_iPASS( { rscId:preset.resource.id, current:currentHid , dayIn:preset.date.stamp(), monday:preset.date.clone().monday().stamp() } );
	
			const changedate = C_XL.date(this.state.date, {abreviation:'full', weekday:false, year:true });
		const digits = this.state.resource.name+' '+C_XL.w('from_apd', { cap:0 })+' '+changedate;
	const name 		= new C_iFIELD(this.eids.name, false, { digits:digits, type:INPUT_TEXT, mandatory:true, focus:true }); 
	const period 	= new C_iDDWN(this.eids.period, { onselect:new A_cb(this, this.onperiod) }, {labels:C_XL.w({ 1:'weekly', 2:'2 weeks', 3:'3 weeks', 4:'4 weeks' })}, { value:1 } );
	
	// create a brand new hourly
	const scheme1 = { colorOff:173, colorExcp:172, colorAbs:174 }; // for color codes, see colors_2023.css, 174 is css class .c174
	const scheme2 = { colorOff:143, colorExcp:285, colorAbs:144 };
	let scheme = scheme1; if(this.state.current.hourly.colorOff == scheme1.colorOff) scheme = scheme2; // alternate color scheme
		const colorOff	= new C_iSKIN(this.eids.colorOff, {} /*callbacks*/, { type:skin.color, value:scheme.colorOff } /*preset*/ );
		const colorExcp	= new C_iSKIN(this.eids.colorExcp, {} /*callbacks*/, { type:skin.color, value:scheme.colorExcp } /*preset*/ );
		const colorAbs	= new C_iSKIN(this.eids.colorAbs, {} /*callbacks*/, { type:skin.color, value:scheme.colorAbs } /*preset*/ );
		const note 		= new C_iNOTE(this.eids.note, ''); 
	
	// continue with another hourly
	const dpFrom  	= new C_iDP(this.eids.dpFrom, {dayclick:new A_cb(this, this.dpFrom)}, { enabled:false, jsdate:preset.date, display:{abreviation:'full', weekday:true} } );
	
		const options1 = C_dS_hourly.options({exceptional:false, exclude:this.state.current.hourly.id });
		const v1 = options1.order[0]; // the first one from the list
	const hourlies 	= new C_iDDWN(this.eids.hourlies, {}, options1, { value:v1, tag:'div', maxrows:0 } ); 
	
	// insert an hourly skip
	const dpIn  = new C_iDP(this.eids.dpIn, {dayclick:new A_cb(this, this.dpIn)}, { enabled:false, jsdate:preset.date, display:{abreviation:'full', weekday:true} } );
		const hourlyback = this.state.resource.schedule(preset.date);
		const nextday = preset.date.clone().increment({d:1});
			while(this.state.resource.schedule(nextday).hourly.periodicity==0) nextday.increment({d:1});
	const dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { mindate:nextday, jsdate:nextday, display:{abreviation:'full', weekday:true} } );

		const options2 = C_dS_hourly.options({exceptional:false, exclude:this.state.current.hourly.id});
		const v2 = options2.order[0]; // the first one from the list
	const skip  = new C_iDDWN(this.eids.skip, {}, options2, {value:v2, tag:'div', maxrows:0} ); 
	const back  = new C_iDDWN(this.eids.back, {}, C_dS_hourly.options({exceptional:false}), {value:hourlyback.hourly.id, tag:'div', maxrows:0} ); 
	
	const tabs		= new C_iTABS(this.eids.tabs, C_XL.w({0:'new hourly', 1:'change hourly', 2:'hourly skip'}), false, {current:preset.tab||0} );

	this.controls 	= new A_ct( { pass:pass, tabs:tabs, cartouche:cartouche
		, name:name, period:period, colorOff:colorOff, colorExcp:colorExcp, colorAbs:colorAbs, note:note
		, hourlies:hourlies, dpFrom:dpFrom
		, dpIn:dpIn, dpOut:dpOut, skip:skip, back:back } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:740}, moves:true, morecss:{ outlet:'M_NewHourly' } } );
	this.activate();
	if(this.state.command) {
		switch(this.state.command) {
			case 'huser_make_new_hourly':
			case 'huser_reuse_an_hourly':
			break; 
		}		
	}
}
M_NewHourly.defaults = new A_df( {resource:0, current:false, date:0, command:'' } );
M_NewHourly.prototype = {
	// private
	header: function() {
	
		// buttons and tittle
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let title = '<td><h1>'+C_XL.w('hourly change')+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		
		// blue information
			let changedate = C_XL.date(this.state.date, {abreviation:'full', weekday:true});
		header += '<tr>'+'<td colspan=2; ><h1>'+C_XL.w('ondate')+' '+changedate+'</h1></td>'+'</tr>';
			
		// green information
			let hashourly = !!this.state.current.hourly.id;
			let recurring = hashourly?'<div class="fas fa-sync fa-08x"></div>':''; // the "no hourly" hourly has id = 0
			let h2 = '<h2>'+C_XL.w('current schedule')+': '+this.state.current.hourly.name+'&nbsp;&nbsp;&nbsp;'+recurring+'</h2>';
		header += '<tr><td colspan=2; style="align:left;">'+h2+'</td>'+'</tr>';
			let indate = C_XL.date(this.state.current.dayIn, {abreviation:'full', weekday:true});
		if(hashourly)
			header += '<tr><td colspan=2; style="align:left;"><h2>'+C_XL.w('entered into force')+': '+indate+'</h2></td>'+'</tr>';
			
		// pack up
			header = '<table summary="header layout" style="width:100%;">'+header+'</table>';
		let divHeader = '<div style="padding:1em 2em;">'+header+'</div>';
		let divTabs = '<div style="text-align:center; padding-top:1em;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// tab 0 create a brand new hourly
				let padder = '<tr><td colspan=2>'+'&nbsp;'+'</td></tr>';
				
					let namebp = '<div class="blueprint" style="padding:.4em 10em 1em .4em;">'+C_XL.w('m_newhourly_name')+'</div>';
				let name = '<tr>'+this.controls.name.labelled('name', 'alpha32', { xl:true }, namebp )+'</tr>';
					
					let pbp = '<div class="blueprint" style="padding:0 0 0 .8em;" id="'+this.eids.own.period_bp+'">'+'</div>';
				let period = '<tr>'+this.controls.period.labelled('periodicity', '', undefined, pbp)+'</tr>';
				
				// let colortitle = '<tr><td></td><td colspan=2 class="" style="text-align:left; padding:0 0 .6em 0;">'+C_XL.w('colors')+':'+'</td></tr>';
				// let colortitle = '<tr><td></td><td class="" style="text-align:left; padding:0 0 .6em 0;">'+C_XL.w('colors')+':'+'</td></tr>';
					let colorsbp = '<td class="blueprint" rowspan=3 id="'+this.eids.own.colors_bp+'">'+C_XL.w('m_newhourly_colors')+'</td>';
					let colorExcp = '<tr>'+this.controls.colorExcp.labelled('color excp', 'alpha12')+colorsbp+'</tr>';
						// let colorExcp = '<tr>'+this.controls.colorExcp.labelled('color excp', 'alpha12')+'</tr>';
						let colorOff = '<tr>'+this.controls.colorOff.labelled('color off', 'alpha12')+'</tr>';
						let colorAbs = '<tr>'+this.controls.colorAbs.labelled('color absent', 'alpha12')+'</tr>';
					let colorstable = '<table>'+colorExcp+colorOff+colorAbs+'</table>';
					// let note = '<tr>'+this.controls.note.labelled('note', '', {colspan:2})+'<td></td>'+'</tr>';
				let colorstr = '<td style="min-width:8em;">&nbsp;</td>'+'<td>'+colorstable+'</td>'+'</tr>';
				
				let note = '<tr>'+this.controls.note.labelled('note', '')+'<td></td>'+'</tr>';
				
			let ident = '<table summary="new hourly" style="margin:0 auto; max-width:calc(100% - 10px);" class="coords">'+name+period+padder+colorstr+padder+note+'</table>';
		let tab0 = this.controls.tabs.container(0, ident);
		let customhourliescount = C_dS_hourly.registers.byid.ends()-1; // there is a default hourly in this collection with id:0. We check only on custom hourlies.

		// tab 1 continue with another existing hourly
			let fromever = '<tr>'+this.controls.dpFrom.labelled('from date','alpha20')+'</tr>';
			let hourlybp = '<tr>'+'<td></td>'+'<td class="blueprint" style="max-width:28em; padding:1em 0 .6em 0;">'+C_XL.w('m_newhourly_reuse_hourly')+'</td>'+'</tr>';
			let hourly 	= '<tr>'+this.controls.hourlies.labelled('existing_hourlies','alpha20 like-input')+'</tr>';
			let existing = '<table summary="reuse hourly" style="margin:1em auto;" class="coords">'+fromever+hourlybp+hourly+'</table>';
		let tab1 = this.controls.tabs.container(1, existing);
		this.controls.tabs.hide(1,customhourliescount==0);
		
		// tab 2 insert an hourly skip
			let from = '<tr>'+this.controls.dpIn.labelled('from date','alpha20')+'</tr>';
			let skip = '<tr>'+this.controls.skip.labelled('hourly_switch','alpha20 like-input')+'</tr>';
			let pad  = '<tr><td colspan=2 style="line-height:1em">&nbsp;</td></tr>';
			let blueprint  = '<tr><td></td><td style="padding:0 0 0 0;" class="blueprint"><h3>'+C_XL.w('then')+'</h3></td></tr>';
			let back = '<tr>'+this.controls.dpOut.labelled('from date','alpha20')+'</tr>';
			let to 	 = '<tr>'+this.controls.back.labelled('back to hourly','alpha20 like-input')+'</tr>';
			skip = '<table summary="hourly skip" style="margin:1em auto;" class="coords">'+from+skip+blueprint+back+to+'</table>';
		let tab2 = this.controls.tabs.container(2, skip);
		this.controls.tabs.hide(2,customhourliescount<2); // there is no hourly skip possible when you do not have at least 2 distinct hourlies.
		
		return tab0+tab1+tab2;
	},
	activate: function() {
		this.controls.activate('M_NewHourly');
		this.elements.collect(this.eids.own);
		this.controls.period.set(1);
	},
	
	// private
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { pass:{dayIn:'dayIn', rscId:'rscId', current:'current', monday:'monday'}
			, tabs:'tabs', name:'name', period:'periodicity', colorOff:'colorOff', colorExcp:'colorExcp', colorAbs:'colorAbsent', note:'note'
			, hourlies:'hourlyId' /* switch to a given hourly */
			, skip:'skipTo', dpOut:'dayOut', back:'skipBack' /* skip hourly */};
		mobminder.app.post(this.controls, names, './post/schedule.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		C_dS_hourlyuser.del({rscId:this.state.resource.id});
	},
	remove: function() { },
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	dpIn: function(jsdate, stmp) {
		if(vbs) vlog('modals.js','M_NewHourly','dpIn','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
		if(stmp > this.controls.dpOut.stamp()) this.controls.dpOut.set(stmp, nofeedback);
	},
	dpOut: function(jsdate, stmp) {
		if(vbs) vlog('modals.js','M_NewHourly','dpOut','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
		let hourlyback = this.state.resource.schedule(jsdate);
		this.controls.back.set(hourlyback.hourly.id);
	},
	dpFrom: function(jsdate, stmp) {
		if(vbs) vlog('modals.js','M_NewHourly','dpFrom','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
	},
	onperiod: function(selection) {
		let periodbp = C_XL.w('m_newhourly_period', {nested:{recweeks:selection}}); // finds $recweeks$ in the translation and replaces it
		this.elements.period_bp.innerHTML = periodbp;
	},
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		if(this.callbacks.saved) this.callbacks.saved.cb(inlineDataSets);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	}
}





function Pad_iSHADOW_SLICE_Action(dS_shadow, schedule, date, rscId, callbacks, preset) { // used by planning.js::P_hourly, never called for virtuals (id<=0)
		preset = preset || {}; // preset like { tab:tab, tabrestrict:tab }
	this.dS_shadow = dS_shadow; // has either properties of a C_dS_shadow or C_dS_timebox
	this.dS_hourly = schedule.hourly;
	this.schedule = schedule; // C_dS_hourlyuser
	this.date = date;
	this.rscId = rscId;
	this.span =  dS_shadow.cueOut - dS_shadow.cueIn; // which is a number of seconds, 3600 is an hour
	this.eids = { ui:'Pad_iSHADOW_SLICE_Action'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { saved:new A_cb(this, this.refresh) } 
			
	this.state = Pad_iSHADOW_SLICE_Action.defaults.align(preset);
		if(vbs) vlog('modals.js','Pad_iSHADOW_SLICE_Action','constructor','');

		const isunavailability = ((dS_shadow.cueIn!=0)&&(dS_shadow.cueOut!=86400));
	this.is = { AMshadow:(dS_shadow.cueIn==0) , PMshadow:(dS_shadow.cueOut==86400), offday:((dS_shadow.cueIn==0)&&(dS_shadow.cueOut==86400)), isunavailability:isunavailability, r024:mobminder.account.is.range024 };

	switch(this.state.tab) {
		case 1: this.state.objectitle = C_XL.w('shadow_timebox',{cap:0}); break;
		case 0:
			if(this.is.offday) this.state.objectitle = C_XL.w('shadow_offday',{cap:0});
			else if(this.is.AMshadow) this.state.objectitle = C_XL.w('shadow_daystart',{cap:0});
			else if(this.is.PMshadow) this.state.objectitle = C_XL.w('shadow_dayfinish',{cap:0});
			else this.state.objectitle = C_XL.w('shadow_unavailability',{cap:0});
			break;
	}

	const menu = new C_iMENU(this.eids.ui, { onlabel:new A_cb(this, this.select) }, this.setoptions(this.dS_shadow), { } )
	
	this.controls = new A_ct( {menu:menu} );
	
		let header = '';
		let body = menu.display('Pad_iSHADOW_SLICE_Action actioncut');
		let position = preset.position; // see (*sh01*) should trigger just right off the mouse pointer position
		// escape:new A_cb(this, this.escape)
	this.modal = new C_iMODAL({header:header, body:body}, {  }, { style:'message', flies:true, position:position, size:{maxy:'28em', maxx:'20em'}, moves:false, morecss:{ outlet:'Pad_iSHADOW_SLICE_Action', inset:'actionpad' } } );
	this.activate();
}
Pad_iSHADOW_SLICE_Action.defaults = new A_df( { tab:tab, tabrestrict:tab, objectitle:'', position:false } );
Pad_iSHADOW_SLICE_Action.prototype = {
	// publiceresaUrl
	activate: function() { // must be called after display
		this.elements.collect(this.eids);
		this.controls.activate('Pad_iSHADOW_SLICE_Action');
		return this;
	},
	reset: function(o) { return this; },
	
	// private
	setoptions: function(dS_shadow) {
		
			let sl_1 = C_XL.w('action_timebox_slice', {nested:{minutes:60}} ); // '60mn', 
			let sl_2 = C_XL.w('action_timebox_slice', {nested:{minutes:30}} ); // '30mn', 
			let sl_3 = C_XL.w('action_timebox_slice', {nested:{minutes:20}} ); // '20mn', 
			let sl_4 = C_XL.w('action_timebox_slice', {nested:{minutes:15}} ); // '15mn', 
			let sl_6 = C_XL.w('action_timebox_slice', {nested:{minutes:10}} ); // '10mn', 
			let sl_12 = C_XL.w('action_timebox_slice', {nested:{minutes:5}} ); // '5mn', 
			let sl_40 = C_XL.w('action_timebox_slice', {nested:{minutes:40}} ); // '40mn', 
			let sl_45 = C_XL.w('action_timebox_slice', {nested:{minutes:45}} ); // '45mn' };
			
		let subslices = { 
			1: sl_1, // '60mn', 
			2: sl_2, // '30mn', 
			3: sl_3, // '20mn', 
			4: sl_4, // '15mn', 
			6: sl_6, // '10mn', 
			12: sl_12, // '5mn', 
			40: sl_40, // '40mn', 
			45: sl_45, // '45mn' };
		}
		let order = [ 1,45,40,2,3,4,6,12 ];
		switch(mobminder.account.timeSlice) {
			case 1: subslices = { 1:sl_1 }; order = [ 1 ]; break; 
			case 2: subslices = { 1:sl_1, 2:sl_2 }; order = [ 1,2 ]; break;
			case 3: subslices = { 1:sl_1, 40:sl_40, 3:sl_3 }; order = [ 1,40,3 ]; break;
			case 4: subslices = { 1:sl_1, 45:sl_45, 2:sl_2, 4:sl_4 }; order = [ 1,45,2,4 ]; break;
			case 6: delete subslices[4]; delete subslices[12]; order = [ 1,40,2,3,6 ]; break;
			case 12: break;
		}
		
		
		return { order:order, labels:subslices };
	},
	escape: function() { // called by C_iMODAL
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		return true; // return true causes modal to get removed from screen
	},
	
	// callbacks
	select: function(value) {  // C_iMENU event handler, option picked from the pad, can be called inline before activation
		value = value|0; // turns from string to integer
		if(vbs) vlog('modals.js','Pad_iSHADOW_SLICE_Action','select','value:'+value);
		this.modal.close();
		let command = 'shadow_slice_timebox'; // this M_SHADOW might need to open in auto-save, or auto-delete mode.
		let setslicing = value | 0; // which is one of [ 1,45,40,2,3,4,6,12 ]
		new M_SHADOW( this.dS_shadow, this.schedule, this.date, this.rscId, this.callbacks, { tab:this.state.tab, tabrestrict:this.state.tab, command:command, setslicing:setslicing } );
	},
	
	// more private
}



function Pad_iNEW_SHADOW_Action(dS_shadow, schedule, date, rscId, callbacks, preset) { // used by planning.js::P_hourly, never called for virtuals (id<=0)
		preset = preset || {}; // preset like { tab:tab, tabrestrict:tab, position: }
	this.dS_shadow = dS_shadow; // has either properties of a C_dS_shadow or C_dS_timebox
	this.dS_hourly = schedule.hourly;
	this.schedule = schedule; // C_dS_hourlyuser
	this.date = date;
	this.rscId = rscId;
	this.span =  dS_shadow.cueOut - dS_shadow.cueIn; // which is a number of seconds, 3600 is an hour
	this.eids = { ui:'Pad_iNEW_SHADOW_Action'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { saved:new A_cb(this, this.refresh) } 
	
	
	const tb = mobminder.account.has.timeboxing;
	if(!tb)
		return new M_SHADOW( this.dS_shadow, this.schedule, this.date, this.rscId, this.callbacks, { tab:0, tabrestrict:0, command:'' } );

	
	this.state = Pad_iNEW_SHADOW_Action.defaults.align(preset);
		if(vbs) vlog('modals.js','Pad_iNEW_SHADOW_Action','constructor','');

		const isunavailability = ((dS_shadow.cueIn!=0)&&(dS_shadow.cueOut!=86400));
	this.is = { AMshadow:(dS_shadow.cueIn==0) , PMshadow:(dS_shadow.cueOut==86400), offday:((dS_shadow.cueIn==0)&&(dS_shadow.cueOut==86400)), isunavailability:isunavailability, r024:mobminder.account.is.range024 };


	const menu = new C_iMENU(this.eids.ui, { onlabel:new A_cb(this, this.select) }, this.setoptions(this.dS_shadow), { } )
	
	this.controls = new A_ct( {menu:menu} );
	
		const header = '';
		const body = menu.display('Pad_iNEW_SHADOW_Action actioncut');
		const position = preset.position; // see (*sh01*) should trigger just right off the mouse pointer position
		
	this.modal = new C_iMODAL({header:header, body:body}, { escape:new A_cb(this, this.escape) }, { style:'message', flies:true, position:position, size:{maxy:'28em', maxx:'20em'}, moves:false, morecss:{ outlet:'Pad_iNEW_SHADOW_Action', inset:'actionpad' } } );
	this.activate();
}
Pad_iNEW_SHADOW_Action.defaults = new A_df( { tab:tab, tabrestrict:tab, position:false } );
Pad_iNEW_SHADOW_Action.prototype = {
	// publiceresaUrl
	activate: function() { // must be called after display
		this.elements.collect(this.eids);
		this.controls.activate('Pad_iNEW_SHADOW_Action');
		return this;
	},
	reset: function(o) { return this; },
	
	// private
	setoptions: function(dS_shadow) {
		
		// else we offer to choose between unavailability and timeboxing
		let labels = { 0: C_XL.w('unavailability'), 1: C_XL.w('timeboxing') };
		let order = [ 0,1 ];
			
		return { order:order, labels:labels };
	},
	escape: function() { // called by C_iMODAL
		if(this.callbacks.escaped) this.callbacks.escaped.cb(); // see (*sh04*), this removes the drawing in case of new shadow
		return true; // return true causes modal to get removed from screen
	},
	
	// callbacks
	select: function(selection, specialkeys, mousevent) {  // C_iMENU event handler, option picked from the pad, can be called inline before activation
		selection = selection|0; // turns from string to integer
		if(vbs) vlog('modals.js','Pad_iNEW_SHADOW_Action','select','value:'+selection);
		this.modal.close();
		
		switch(selection) {	
			default:
			new M_SHADOW( this.dS_shadow, this.schedule, this.date, this.rscId, this.callbacks, { tab:selection, tabrestrict:selection, command:'' } );
		}
	},
	
	// more private
}



function Pad_iSHADOW_Action(dS_shadow, schedule, date, rscId, callbacks, preset) { // used by planning.js::P_hourly, never called for virtuals (id<=0)
		preset = preset || {}; // preset like { tab:tab, tabrestrict:tab, position: }
	this.dS_shadow = dS_shadow; // has either properties of a C_dS_shadow or C_dS_timebox
	this.dS_hourly = schedule.hourly;
	this.schedule = schedule; // C_dS_hourlyuser
	this.date = date;
	this.rscId = rscId;
	this.span =  dS_shadow.cueOut - dS_shadow.cueIn; // which is a number of seconds, 3600 is an hour
	this.eids = { ui:'Pad_iSHADOW_Action'};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { saved:new A_cb(this, this.refresh) } 
			
	this.state = Pad_iSHADOW_Action.defaults.align(preset);
		if(vbs) vlog('modals.js','Pad_iSHADOW_Action','constructor','');

		const isunavailability = ((dS_shadow.cueIn!=0)&&(dS_shadow.cueOut!=86400));
	this.is = { AMshadow:(dS_shadow.cueIn==0) , PMshadow:(dS_shadow.cueOut==86400), offday:((dS_shadow.cueIn==0)&&(dS_shadow.cueOut==86400)), isunavailability:isunavailability, r024:mobminder.account.is.range024 };

	switch(this.state.tab) {
		case 1: this.state.objectitle = C_XL.w('shadow_timebox',{cap:0}); break;
		case 0:
			if(this.is.offday) this.state.objectitle = C_XL.w('shadow_offday',{cap:0});
			else if(this.is.AMshadow) this.state.objectitle = C_XL.w('shadow_daystart',{cap:0});
			else if(this.is.PMshadow) this.state.objectitle = C_XL.w('shadow_dayfinish',{cap:0});
			else this.state.objectitle = C_XL.w('shadow_unavailability',{cap:0});
			break;
	}

	const menu = new C_iMENU(this.eids.ui, { onlabel:new A_cb(this, this.select) }, this.setoptions(this.dS_shadow), { } )
	
	this.controls = new A_ct( {menu:menu} );
	
		const header = '';
		const body = menu.display('Pad_iSHADOW_Action actioncut');
		const position = preset.position; // see (*sh01*) should trigger just right off the mouse pointer position
		// escape:new A_cb(this, this.escape)
	this.modal = new C_iMODAL({header:header, body:body}, {  }, { style:'message', flies:true, position:position, size:{maxy:'28em', maxx:'20em'}, moves:false, morecss:{ outlet:'Pad_iSHADOW_Action', inset:'actionpad' } } );
	this.activate();
}
Pad_iSHADOW_Action.defaults = new A_df( { tab:tab, tabrestrict:tab, objectitle:'', position:false } );
Pad_iSHADOW_Action.prototype = {
	// publiceresaUrl
	activate: function() { // must be called after display
		this.elements.collect(this.eids);
		this.controls.activate('Pad_iSHADOW_Action');
		return this;
	},
	reset: function(o) { return this; },
	
	// private
	setoptions: function(dS_shadow) {
		
		let isexcphourly = this.dS_hourly.periodicity==0; // this hourly applies only on that day
		let ismultiweek = this.dS_hourly.periodicity>1 ? this.dS_hourly.periodicity : 0; // rotates on 2, 3 or 4 weeks
		let rotation = ''; if(ismultiweek) rotation = ' (1/'+ismultiweek+')';
		let labels = [];
		let AMorPMshadow = this.is.AMshadow || this.is.PMshadow;
		switch(this.state.tab) { // this switch defines what action is possible in function of the hit object
			case 0: // shadow
				if(this.is.isunavailability) labels[661] = C_XL.w('shadow_delete_this', {nested:{objectitle:this.state.objectitle}});
				let fulldate = C_XL.date(this.date, {abreviation:'full', weekday:true, cap:0});
				if(isexcphourly) {
					if(this.is.offday)
						labels[663] = C_XL.w('shadow_open_this_day', {nested:{fulldate:fulldate}} ); // 'open only on this day $fulldate$'
					else
						labels[662] = C_XL.w('shadow_close_this_day');
				} else {
					let dayname = C_XL.weekday(this.date.getPHPday(), 'every', undefined, 0);
					if(this.is.offday) {
						labels[663] = C_XL.w('shadow_open_this_day', {nested:{fulldate:fulldate}} ); // 'open only on this day $fulldate$'
						labels[664] = C_XL.w('shadow_open_every', {nested:{dayname:dayname,rotation:rotation}} ); // 'open every $dayname$ in the hourly $rotation$'
					} else {
						// labels[665] = C_XL.w('shadow_make_exception'); // we keep this one for the header date menu
						labels[666] = C_XL.w('shadow_close_every', {nested:{dayname:dayname,rotation:rotation}}); // 'close every $dayname$ in the hourly $rotation$'
					}
				}
				labels[669] = C_XL.w('shadow_see_all_properties', {nested:{objectitle:this.state.objectitle}});
				break;
			case 1: // timebox (easier because starting from a timebox, it is not possible to turn a day hourly into an exceptional day hourly)
				labels[771] = C_XL.w('shadow_delete_this', {nested:{objectitle:this.state.objectitle}});
				
						let oneslice = 3600 / mobminder.account.timeSlice;
					let cangosmaller = oneslice < this.span; // if this element span is equal to the span of one slice, then it is not possible to divide it further...
				if(cangosmaller) labels[772] = C_XL.w('shadow_slice_timebox');
				if(isexcphourly) {
					
				} else {
					// labels[773] = C_XL.w('shadow_make_exception'); // we keep this one for the header date menu
				}
				labels[778] = C_XL.w('shadow_delete_all_of_timeboxes');
				labels[779] = C_XL.w('shadow_see_all_properties', {nested:{objectitle:this.state.objectitle}});
				break;
		}
		let order = [];
		for(let v in labels) order.push(v); // which follows the order set by labels[]
		
		return { order:order, labels:labels };
	},
	escape: function() { // called by C_iMODAL
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		return true; // return true causes modal to get removed from screen
	},
	
	// callbacks
	select: function(value, ctrlkey, mousevent) {  // C_iMENU event handler, option picked from the pad, can be called inline before activation
		value = value|0; // turns from string to integer
		if(vbs) vlog('modals.js','Pad_iSHADOW_Action','select','value:'+value);
		this.modal.close();
		let command = ''; // this M_SHADOW might need to open in auto-save, or auto-delete mode.
		switch(value) {
			case 661: command = 'shadow_delete_this'; break; // shadow_delete_this
			case 662: command = 'shadow_close_this_day'; break; // shadow_close_this_day
			case 663: command = 'shadow_open_this_day'; break; // shadow_open_this_day
			case 664: command = 'shadow_open_every'; break; // shadow_open_every
			case 665: command = 'shadow_make_exception'; break; // shadow_make_exception
			case 666: command = 'shadow_close_every'; break; // shadow_close_every
			
			case 771: command = 'shadow_delete_this'; break; // shadow_delete_this
			case 772: command = 'shadow_slice_timebox'; break; // shadow_slice_timebox
			case 773: command = 'shadow_make_exception'; break; // shadow_make_exception
			case 778: command = 'shadow_delete_all_of_timeboxes'; break; // shadow_delete_all_of_timeboxes
			
			case 669: case 779: // opens and keep open the legacy M_SHADOW where almost everything is possible :)
				break;
		}
		switch(value) {	
			case 772:
					let position = { mouse:{event:mousevent}, offset:{x:-80, y:-40}};// see (*sh01*)
				new Pad_iSHADOW_SLICE_Action( this.dS_shadow, this.schedule, this.date, this.rscId, this.callbacks, { position:position, tab:this.state.tab, tabrestrict:this.state.tab, command:command } );
				break;
			default:
			new M_SHADOW( this.dS_shadow, this.schedule, this.date, this.rscId, this.callbacks, { tab:this.state.tab, tabrestrict:this.state.tab, command:command } );
		}
	},
	
	// more private
}



function M_SHADOW(shadow, schedule, date, rscId, callbacks, preset) { // Changing shadows or time boxes of an hourly on the hourly view
	preset = preset || {};
	this.state = M_SHADOW.defaults.align(preset);
	this.callbacks = callbacks || {}; // { saved:o_callback };
	this.hourly = typeof schedule.hourly === 'function' ? schedule.hourly() : schedule.hourly; // so we can accept calls from P_sticker and calls from Pad_iSHADOW_Action
	this.schedule = schedule;
	this.rscId = rscId; // C_dS_hourlyuser group to a resourceId
	this.shadow = shadow;
	this.daycode = this.hourly.dayCode(date);
	this.date = date;
		let b = 'shad'+'_';
	this.eids = { tabs:b+'tabs', buttons:b+'buttons', which:b+'which', inout:b+'inout', every:b+'evry', tboxing:b+'tboxing', slicing:b+'slicing', slicingbp:b+'slicingbp', tabs:b+'tabs' };
	this.is = { AMshadow:(shadow.cueIn==0) , PMshadow:(shadow.cueOut==86400), offday:((shadow.cueIn==0)&&(shadow.cueOut==86400)), r024:mobminder.account.is.range024, isnew:(shadow.id<=0) };
		
	this.elements = new A_el();
			 
		let remove = true; if(this.is.isnew) remove=false; else if(this.is.r024||this.is.offday) remove=true; else if(this.is.AMshadow||this.is.PMshadow) remove=false;
		const save = this.is.offday?false:true;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:remove, save:save } );

		const name = C_XL.date(this.date, {abreviation:'full', weekday:false, year:false})+' '+C_XL.w('excp'); // this exceptional hourly change gets the date as name
	const pass = new C_iPASS( { id:shadow.id, hourlyId:this.hourly.id, dayIn:date.getPHPstamp(), dayCode:this.daycode, cueIn:0, cueOut:86400, rscId:this.rscId, name:name, allofthem:0 } );
	
		const optionspreset = []; optionspreset[shadow.exceptional|0] = {checked:true};
		if(this.is.AMshadow || this.is.PMshadow) optionspreset[1] = {locked:true};
		if(this.is.offday) optionspreset[0] = {locked:true};
	const which = new C_iCRESTA(this.eids.which, {}, { labels:C_XL.w({ 0:'unavailable', 1:'exc available', 5:'closed day' }), presets:optionspreset }, { skin:0, mode:-1, title:false } );

			const sps = mobminder.account.secondsPerSlice;
			const accountIn = mobminder.account.rangeIn;
			const accountOut = mobminder.account.rangeOut;
			const prev = this.hourly.previous(this.daycode, shadow.cueIn, this.shadow.id);
			const next = this.hourly.next(this.daycode, shadow.cueIn, this.shadow.id);
			
		let min = prev?prev.cueOut+sps:false; if(!min) min = accountIn;
		let max = next?next.cueIn-sps:false; if(!max) max = accountOut;

if(vbs) vlog('modals.js','M_SHADOW','construction','date:'+date.sortable()+', shadow:'+time(shadow.cueIn)+'-'+time(shadow.cueOut)+', min:'+time(min)+', max:'+time(max));

	// header IN-OUT	
	let inout;
	if(this.is.AMshadow) inout = new C_iCUE(this.eids.inout, false, { slice:shadow.cueOut/sps, rangein:min/sps+1, rangeout:max/sps } );
	else if(this.is.PMshadow) inout = new C_iCUE(this.eids.inout, false, { slice:shadow.cueIn/sps, rangein:min/sps, rangeout:max/sps-1 } );
		else inout = new C_iRANGE(this.eids.inout, {}, { setin:shadow.cueIn, setout:shadow.cueOut, min:min, max:max } );
			
			const everyweekday = C_XL.w('every weekday')+'&nbsp;'+C_XL.weekday(this.date.getPHPday())+'&nbsp;'+C_XL.w('in this hourly', {cap:0}); 
			const onlyon = C_XL.w('ex hourly change')+C_XL.date(this.date, {abreviation:'full', weekday:true}); 
		let options = { order:[0,1], labels:{ 0:onlyon, 1:everyweekday }, count:2}, value = 1;
		if(this.hourly.periodicity==0) value = 0; // that is an exceptional hourly
	const every = new C_iCRESTA(this.eids.every, { onchange:new A_cb(this, this.every) }, options, { skin:0, mode:-1, value:value } );
	
	// time boxing
		const tbxpreset = []; if(this.shadow.timeboxingId) tbxpreset[this.shadow.timeboxingId] = 1;
			options = C_dS_timeboxing.cresta(tbxpreset);
	const tboxing = new C_iCRESTA(this.eids.tboxing, {}, options, { skin:0, mode:-1, title:false } );
			
			const noslicing = C_XL.w('no slicing');
		let subslices = { 0:noslicing, 1:'60mn', 2:'30mn', 3:'20mn', 4:'15mn', 6:'10mn', 12:'5mn', 40:'40mn', 45:'45mn' };
		let order = [ 0,1,45,40,2,3,4,6,12 ];
		switch(mobminder.account.timeSlice) {
			case 1: subslices = { 0:noslicing, 1:'60mn' }; order = [ 0,1 ]; break; 
			case 2: subslices = { 0:noslicing, 1:'60mn', 2:'30mn' }; order = [ 0,1,2 ]; break;
			case 3: subslices = { 0:noslicing, 1:'60mn', 40:'40mn', 3:'20mn' }; order = [ 0,1,40,3 ]; break;
			case 4: subslices = { 0:noslicing, 1:'60mn', 45:'45mn', 2:'30mn', 4:'15mn' }; order = [ 0,1,45,2,4 ]; break;
			case 6: delete subslices[4]; delete subslices[12]; order = [ 0,1,40,2,3,6 ]; break;
			case 12: break;
		}
	const slicing		= new C_iDDWN(this.eids.slicing, { onselect:new A_cb(this, this.onslicing) },  { labels:subslices, order:order }, { value:0 } );
	
		const tabscaptions = C_XL.w({0:'unavailability', 1:'time boxing'});
		// tabscaptions[2] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs = new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );
	this.controls = new A_ct( { pass:pass, tabs:tabs, cartouche:cartouche, which:which, inout:inout, every:every, tboxing:tboxing, slicing:slicing } );
	
		const visiblemode = this.state.command==0;// (this.state.command=='shadow_slice_timebox'||this.state.command==0);
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:680}, moves:true, invisible:!visiblemode } );
	this.activate();
	if(this.state.command) {
		// console.log('M_SHADOW Command: '+this.state.command);
		switch(this.state.command) {
			case 'shadow_delete_this': 		this.remove(); break; // shadow_delete_this
			case 'shadow_close_this_day': 	this.controls.every.docheck(0); this.controls.which.docheck(5); this.save(); break; // shadow_close_this_day by setting exceptional as selection in this.controls.which
			case 'shadow_open_this_day': 	this.controls.every.docheck(0); this.remove(); break; // shadow_open_this_day
			case 'shadow_open_every': 		this.remove(); break; // shadow_open_every
			case 'shadow_make_exception': 	this.controls.every.docheck(0); this.save(); break; // shadow_make_exception
			case 'shadow_close_every': 		this.controls.which.docheck(5); this.save(); break; // shadow_close_every
			case 'shadow_close_only_this_day': 	this.controls.every.docheck(0); this.controls.which.docheck(5); this.save(); break; // shadow_close_every
			
			case 'shadow_slice_timebox': 	this.controls.slicing.set(preset.setslicing); this.save(); break; // shadow_slice_timebox
			case 'shadow_delete_all_of_timeboxes': this.controls.pass.items.allofthem = 1; this.remove(); break; // shadow_delete_all_of_timeboxes
			case 'shadow_backto_recurring': this.removeexceptionalday(); break; // shadow_delete_all_of_timeboxes
			
			case 'shadow_adjust_span': this.save(); break; // this one comes from here (*sh02*)
			
			case 669: case 779: // opens and keep open the legacy M_SHADOW where almost everything is possible :)
				break;
		}		
	}
}
M_SHADOW.defaults = new A_df( {tabrestrict:false, command:'', tab:0, setslicing:0 } );
M_SHADOW.prototype = {
	// private
	header: function() {
		let isexc = this.hourly.periodicity==0;
		let isdayin = this.date.stamp() == this.schedule.dayIn; // this hourly starts on this.date
		// buttons
				let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
				let title = '<td class="mheader"><h1 class="modal-shadow">'+this.title()+'</h1></td>';
			let header = '<tr>'+buttons+title+'</tr>';
		let divButtons = '<div class="buttons"><table summary="buttons" style="width:100%">'+header+'</table></div>';
		
		// info
		let recurring = isexc?'':'<div class="fas fa-sync fa-08x"></div>';
			let info = '<tr><td style="align:left;"><h2>'+C_XL.w('in current schedule')+': '+this.hourly.name+'&nbsp;&nbsp;&nbsp;'+recurring+'</h2></td>'+'</tr>';
			if(!isexc) {
				let indate = C_XL.date(this.schedule.dayIn, {abreviation:'full', weekday:true});
				info += '<tr><td style="align:left;"><h2>'+C_XL.w('entered into force')+': '+indate+'</h2></td>'+'</tr>';
			}
		let divInfo = '<div style="padding:0 0 1em 1em;"><table summary="info" style="width:100%">'+info+'</table></div>';
		
		// schedule
			let inout = '';
				if(!this.is.offday) {
					inout = this.controls.inout.display('alphaCUE');
					if(this.is.AMshadow) inout =  '&nbsp;'+C_XL.w('absent before')+' '+inout;
					else if(this.is.PMshadow) inout =  '&nbsp;'+C_XL.w('absent after')+' '+inout;
					else inout = '&nbsp;'+inout; // add timing specification when not a complete day
				}
				let every = ''; if(!isdayin) every = this.controls.every.display(); // displays a choice between recurring change or exceptional change
			let cells = '<tr>'+'<td>'+inout+'</td>'+'<td style="text-align:left; padding-left:1em;">'+every+'</td></tr>';
			let table = '<table summary="schedule" style="text-align:center; margin:0 auto;">'+cells+'</table>';
		let divSchedule = '<div style="padding:0 0 1.6em 0;">'+table+'</div>';
		
		// tabs
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		
		return divButtons+divInfo+divSchedule+divTabs;
	},
	body: function(css) {
	
		// tab 0 ( hourly )
			let which = '<tr>'+'<td>'+this.controls.which.display()+'</td>'+'</tr>';
			let ident = '<table summary="shadow box" style="margin:0 auto;">'+which+'</table>';
		let tab0 = this.controls.tabs.container(0, ident);
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(0, this.state.tabrestrict!=0); };

		// tab 1 ( time-boxing )
			let tboxing = '<tr>'+'<td colspan=2>'+this.controls.tboxing.display()+'</td>'+'</tr>'
			let padder = '<tr>'+'<td colspan=2>'+'&nbsp;'+'</td>'+'</tr>';
			let slicing = '<tr style="">'+this.controls.slicing.labelled('time box slicing')+'</tr>';
			let slicingbp = '<tr>'+'<td colspan=2 id="'+this.eids.slicingbp+'" style="min-height:2em; padding-top:.6em;" class="blueprint">'+'&nbsp;'+'</td>'+'</tr>'; // &nbsp;
				tboxing = '<table summary="time boxing" style="margin:0 auto;">'+tboxing+padder+slicing+slicingbp+'</table>';
		let tab1 = this.controls.tabs.container(1, tboxing);
		if(this.controls.tboxing.countX()==0) { this.controls.tabs.hide(1, true); };
		if(this.state.tabrestrict!==false) { this.controls.tabs.hide(1, this.state.tabrestrict!=1); };
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_SHADOW');
		this.elements.collect(this.eids); 
		if(this.shadow.id <= 0) this.controls.tboxing.reset(); // auto select the first option
	},
	
	// private
	title: function() {	return (this.shadow.id>0) ? C_XL.w('adjust schedule') : C_XL.w('define schedule'); },

	// event handling
	save: function() {
		if(!this.controls.validation()) { 
			console.log('some controls are not valid:',this.controls); 
			return this;
		}
		this.modal.busy(true); 
		
		let cues = this.controls.inout.getpost({seconds:true}); // when inout is a C_RANGE, the cues = { cin:cueIn, out:cueOut }, else cues are seconds
		if(this.is.AMshadow) this.controls.pass.items.cueOut = cues;
			else if (this.is.PMshadow)  this.controls.pass.items.cueIn = cues;
				else { this.controls.pass.items.cueIn = cues.cin; this.controls.pass.items.cueOut = cues.out; }
		
		let names = { pass:{ id:'id', hourlyId:'hourlyId', dayIn:'dayIn', dayCode:'dayCode', cueIn:'cueIn', cueOut:'cueOut', rscId:'rscId', name:'name' }, 
			tabs:'tabs', which:'exceptional', tboxing:'timeboxingId', slicing:'slicing', every:'every' };
		mobminder.app.post(this.controls, names, './post/shadow.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		
		//  /post/shadow.php manages both C_dS_timeboxings and C_dS_shadows, it makes the difference thanks to the value of tabs: 0 for shadows & 1 for timeboxes
		//
			
		let closeoff = (this.controls.which.getvalue() == 5);
		let shadows = (this.controls.tabs.current() == 0);
		let timeboxes = (this.controls.tabs.current() == 1);
		let everydate = (this.controls.every.getvalue() == 1);
		let requestExcp = !everydate;
		let currentisexcp = (this.hourly.periodicity == 0);
		let currentisperiodic = !currentisexcp;
		let ondateyet = (this.schedule.dayIn==this.date.stamp()); // there is already an hourly change on the clicked date
		let dayinchangeyet = (this.schedule.dayIn==this.date.stamp());
		let yettoExcp = dayinchangeyet&&currentisexcp;
		let isnewexcp = requestExcp&&currentisperiodic;
		let id = this.controls.pass.items.id;
		let slicing = this.controls.slicing.value();
		
		// prepare local side for new dSets coming from server
		if(timeboxes&&(id>0)&&slicing) { // case of an exiting timebox that get sliced, 
			let cueIn = this.controls.pass.items.cueIn;
			let cueOut = this.controls.pass.items.cueOut;
			C_dS_timebox.drop1(id); // in this case we have to remove the existing timebox
		}
		
		if(shadows&&closeoff&&currentisexcp) {
			this.hourly.dropshadows(this.daycode); // after saving the only remaining shadow will have .exceptional == 5
			this.hourly.droptboxes(this.daycode);
		}
		if(shadows&&closeoff&&everydate) {
			this.hourly.dropshadows(this.daycode); // the only remaining shadow will have .exceptional == 5
			this.hourly.droptboxes(this.daycode);
		}
		if(requestExcp) { // then, may be an hourly change is set alreay on this date, remove it (will be replaced by a new one)
			C_dS_hourlyuser.del({rscId:this.rscId});
		}
		return this;
	},
	remove: function(allof = false) { // like shadow_delete_all_of_timeboxes
		this.modal.busy(true);
		let names = { pass:{ id:'id', hourlyId:'hourlyId', dayIn:'dayIn', dayCode:'dayCode', rscId:'rscId', name:'name', allofthem:'allofthem' }, tabs:'tabs', which:'exceptional', every:'every' };
		mobminder.app.post(this.controls, names, './delete/shadow.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		
		let shadows = (this.controls.tabs.current() == 0);
		let singledate = (this.controls.every.getvalue() == 0);
		let regularhourly = (this.hourly.periodicity > 0);
		let isnewexcp = (regularhourly&&singledate); // this post implies making a new exceptional hourly
			
			let id = this.controls.pass.items.id;
		if(vbs) vlog('modals.js','M_SHADOW','remove','id:'+id+', shadows:'+shadows+', singledate:'+singledate+', isnewexcp:'+isnewexcp);
		if(!isnewexcp) {
			if(shadows) { this.hourly.dropshadows(this.daycode); } 
				else this.hourly.droptboxes(this.daycode);
		}
		if(singledate) {
			C_dS_hourlyuser.del({rscId:this.rscId});
		}
	},
	quit: function() { if(this.callbacks.escaped) this.callbacks.escaped.cb(); this.modal.close(); },
	escape: function() { if(this.callbacks.escaped) this.callbacks.escaped.cb(); return true; },
	every: function() { },
	onslicing: function(v) { // a slicing option was just chosen
		v = v|0; // makes it integer
		let bpe = this.elements.slicingbp;
		let bpt = '&nbsp;';
		if(v) {
			let m = 60/v; if(v>12) m = v;
			bpt = C_XL.w('bp_hrl_slicing', { cap:true, nested:{mn:m} }); // calls translation with a nested variable : $mn$ to be found in the translations.
		}
		bpe.innerHTML = bpt;
	},
	
	// ajax callback event handlers
	saved: function() {
		if(vbs) vlog('modals.js','M_SHADOW','saved','');
		this.hourly.link(); // the <code> has created the dataSet but we need to relink this dataSet to the hourly
		if(this.callbacks.saved) this.callbacks.saved.cb();
		this.modal.close();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	deleted: function() {
		if(vbs) vlog('modals.js','M_SHADOW','deleted','');
		this.saved();
	}
}


function M_TBOXING(dataSet, callbacks, preset) { // General setup : Specify Time Boxing name, color, pattern, tags, ...
	preset = preset || {};
	this.dataSet = dataSet;
if(vbs) vlog('modals.js','M_TBOXING','constructor','id='+this.dataSet.id);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'ccss'+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', tabs:b+'tabs' , name:b+'name'
			, exclusive:b+'exclu', reserv:b+'reserv', color:b+'clr', pattern:b+'ptrn', tag:b+'tag', note:b+'note'
			, own: { h1:b+'h1' } };
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:(this.dataSet.id>0) } );

	const id			= new C_iPASS({id:this.dataSet.id});
		const ntyping = new A_cb(this, this.nametyping, null, null, 800);
	const name 		= new C_iFIELD(this.eids.name, {onfchange:ntyping}, { digits:this.dataSet.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
	const exclusive 	= new M_TBOXING.options(this.eids.exclusive, this.dataSet.exclusive);
	const color		= new C_iSKIN(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { type:ccsstype.color, value:this.dataSet.color, allownone:false } /*preset*/ );
	const pattern		= new C_iSKIN(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { type:ccsstype.pattern, value:this.dataSet.pattern, allownone:true } /*preset*/ );
	const tag			= new C_iSKIN(this.eids.tag, {select:new A_cb(this, this.ontagselect)}, { type:skin.tbxtag, value:this.dataSet.tag, allownone:true, css:'tagbig' } /*preset*/ );

	const note 		= new C_iNOTE(this.eids.note, this.dataSet.note, { rows:2} ); 
	
		const tabscaptions = C_XL.w({ 0:'definition', 1:'audit' });
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );
	
	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, name:name, exclusive:exclusive, color:color, pattern:pattern, tag:tag, note:note } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:580}, moves:true, morecss: { outlet:'M_TBOXING' } } );
	this.activate();
}
M_TBOXING.prototype = { 
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 id="'+this.eids.own.h1+'" class="modal-timeboxing">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div class="buttons air"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
			let name = '<tr>'+this.controls.name.labelled('name','alpha20')+'<td>'+this.controls.exclusive.display()+'</td>'+'</tr>';
			let color = '<tr>'+this.controls.color.labelled('color', 'alpha12')+'<td></td>'+'</tr>';
			let pattern = '<tr>'+this.controls.pattern.labelled('pattern', 'alpha12')+'<td></td>'+'</tr>';
			let tag = '<tr>'+this.controls.tag.labelled('tag')+'<td></td>'+'</tr>';
			let note = '<tr>'+this.controls.note.labelled('note', 'ta24')+'<td></td>'+'</tr>';
			let layout = '<table class="coords" summary="custom css" style="margin:0 auto">'+name+color+pattern+tag+note+'</table>';
		let tab0 = this.controls.tabs.container(0, layout);
		
		let tab1 = this.controls.tabs.container(1, this.dataSet.tracking());
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_TBOXING');
		this.elements.collect(this.eids.own);
		this.oncolorselect(this.dataSet.color);
		this.onpatternselect(this.dataSet.pattern);
	},
	
	// private
	title: function() {
		let tag = '', tagcode = this.controls.tag.value(), name = this.controls.name.value();
		let title = C_XL.w('timeboxing');
		if(tagcode) tag = '<div class="fa fa-15x '+C_iSKIN.tagcss(tagcode)+'" style="padding-left:.6em; min-width:1.4em;"></div>';
		if(this.dataSet.id <= 0 && name == '') title += ': '+C_XL.w('new');
			else title = name+tag;
		return title;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{id:'id'}, name:'name', color:'color', pattern:'pattern', tag:'tag', note:'note', exclusive:{exclusive:'exclusive'} };
		mobminder.app.post(this.controls, names, './post/timeboxing.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{id:'id'} };
		mobminder.app.post(this.controls, names, './delete/timeboxing.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	oncolorselect: function(ccode) {
		if(ccode==0) // the default color was selected
			this.modal.setmborder(0);
		if(vbs) vlog('modals.js', 'M_TBOXING', 'oncolorselect', 'ccode:'+ccode);
		this.modal.setmborder(ccode);
	},
	onpatternselect: function(pcode) {
		if(pcode==0) // the default color was selected
			this.modal.setmpattern(0);
		if(vbs) vlog('modals.js', 'M_TBOXING', 'onpatternselect', 'pcode:'+pcode);
		this.modal.setmpattern(pcode);
	},
	ontagselect: function(tcode) {
		setTimeout( () => { this.elements.h1.innerHTML = this.title(); }, 500 );
		if(vbs) vlog('modals.js', 'M_RESC', 'ontagselect', 'tcode:'+tcode);
	},
	nametyping: function(digits) {
		this.elements.h1.innerHTML = this.title();
	},

	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dataSets = inlineDataSets['C_dS_timeboxing'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; };
if(vbs) vlog('modals.js','M_TBOXING','saved','id='+dataSet.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(dataSet);
		mobminder.account.has.timeboxing = C_dS_timeboxing.has();
		this.quit();
	},
	removed: function() {
if(vbs) vlog('modals.js','M_TBOXING','removed','id='+this.dataSet.id);
		C_dS_timeboxing.del(this.dataSet.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		mobminder.account.has.timeboxing = C_dS_timeboxing.has();
		this.quit();
	},
	failed: function() {
		this.modal.busy(false);
	}
}
M_TBOXING.options = function(eid, exclusive) {
	this.picker = new C_iCRESTA(eid, {}, { labels:C_XL.w({exclusive:'exclusive tboxing'}), presets:{exclusive:!!exclusive} }, { skin:1, mode:0, title:false } );
	this.activate = function() { return this.picker.activate() };
	this.display = function(css) { return this.picker.display(css); };
	this.getpost = function() { return this.picker.setting(); };
}


function M_SWAP(eid, callbacks, preset) { // switching planning between two resources

	// PVH 2020 : drag and drop of entire lines is never asked and has been made obsolete, see (*rdd01*)
	
	const e = eid+'_modal_swap_'+C_iMODAL.layer;
	this.eids = { buttons:e+'_btns', futureinc:e+'_pckr' };
	const handler = new A_cb(this, this.click);
	const cancel = new C_iBUTTON.standard(this.eids.buttons, handler, 'cancel');
	const confirm = new C_iBUTTON.standard(this.eids.buttons, handler, 'confirm');
	const futureinc = new C_iCRESTA(this.eids.futureinc, {}, { labels:C_XL.w({future:'swap future'}), presets:{future:true} }, { skin:1, mode:0, title:false } );
	
	this.controls = new A_ct( { cancel:cancel, confirm:confirm, futureinc:futureinc } );
	this.callbacks = callbacks;  // like { swapped };
	this.state = M_SWAP.defauts.align(preset);
	
	// display
					const name1 = C_dS_resource.get(this.state.fromId).name;
					const name2 = C_dS_resource.get(this.state.toId).name;
				const msg = C_XL.w('swaping from')+'<br/><b>'+name1+'</b><br/>'+C_XL.w('swaping to')+'<br/><b>'+name2+'</b>?';
			const message = '<div class="modal-msg '+(this.state.css.body||'')+'" style="margin:1em 0;">'+msg+'</div>';
			const buttons = '<div style="text-align:center">'+cancel.display()+confirm.display()+'</div>';
			const finc	= '<div style="padding-top:1em">'+futureinc.display()+'</div>';
		const left = '<td><div style="min-width:80px; min-height:80px;"></div></td>';
		const right = '<td>'+message+buttons+finc+'</td>';
	const layout = '<table style="width:100%;" class="'+(this.state.css.image||'')+'"><tr>'+left+right+'</tr></table>';
	
	// activate
	this.modal = new C_iMODAL({body:layout}, { escape:new A_cb(this, this.escape) }, { size:this.state.size } );
	this.controls.activate('M_SWAP');
}
M_SWAP.defauts = new A_df( { css:{image:'img-question', body:false}, size:{x:480,y:''}, fromId:0, toId:0, fromStamp:0 } );
M_SWAP.prototype = {
	click: function(state) { // o_easyBUTTON.state
		
		if(state.value|0) {
			this.modal.busy(true); 
			let futureinc = this.controls.futureinc.setting().future;
			let pass = new C_iPASS({ fromstamp:this.state.fromStamp, from:this.state.fromId, to:this.state.toId, futureinc:futureinc});
			let names = { pass:{fromstamp:'fromstamp', from:'fromId', to:'toId', futureinc:'futureinc'}};
			mobminder.app.post({pass:pass}, names, './queries/swap.php', new A_cb(this,this.swapped), new A_cb(this,this.swapfailed));
		} else {
			this.modal.close(); 
		}
	},
	escape: function() { return true; },
	swapped: function(){
		this.modal.close(); 
		if(vbs) vlog('modals.js','P_htype','swapped','');
		if(this.callbacks.swapped) this.callbacks.swapped.cb();
		this.modal.close(); 
	},
	swapfailed: function(){
		if(vbs) vlog('modals.js','P_htype','swapfailed','');
	},
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//   C U S T O M    C S S 
//
//


function M_CCSS(dataSet, callbacks, preset) { // custom CSS, see C_dS_customCss
	preset = preset || {};
	this.dataSet = dataSet;
if(vbs) vlog('modals.js','M_CCSS','constructor','id='+this.dataSet.id+', type='+this.dataSet.cssType+', class='+this.dataSet.resaClass);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'ccss'+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', name:b+'name', reserv:b+'reserv', css:b+'css', tabs:b+'tabs', note:b+'note', isdefault:b+'def', ctrlshift:b+'ctrlshft'
				, own: { bpctrlshift:b+'bp_ctrlshft', bpisdefault:b+'bp_isdef', h1:b+'h1' } 
				};
	this.elements = new A_el();
	
			const permitted = permissions.may(pc.ch_ccss);
		const mayremove = (this.dataSet.id>0) && permitted;
		const maysave = permitted;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );

	const id			= new C_iPASS({id:this.dataSet.id, type:this.dataSet.cssType, oclass:this.dataSet.resaClass});
	const name 		= new C_iFIELD(this.eids.name, false, { digits:this.dataSet.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
	
		const d = mobminder.account.defaultCcss(this.dataSet.cssType,this.dataSet.resaClass, this.dataSet.id); // true is this dataSet is listed as default
		const cresta = new C_iCRESTA(this.eids.isdefault, { onchange:new A_cb(this,this.ondefault) }, { labels:C_XL.w({isdefault:'default'}), presets:{isdefault:d} }, { skin:1, mode:0, title:false } );
	const isdefault 	= new M_CCSS.isdefault(cresta);
		
			const cspresets = {1:!!(this.dataSet.ctrlshift&1), 2:!!(this.dataSet.ctrlshift&2)}; // must be a boolean, see (*cc02*)
			const cslabels = C_XL.w({1:'ctrlshift_ctrl', 2:'ctrlshift_shift'});
		const cscresta = new C_iCRESTA(this.eids.ctrlshift, { onchange:new A_cb(this,this.onctrlshift) }, { labels:cslabels, presets:cspresets }, { skin:1, mode:0, title:false } );
	const ctrlshift 	= new M_CCSS.ctrlshift(cscresta);
	
		let css=''; if(this.dataSet.cssType == skin.tag) css='tagbig';
			const skinmode = this.dataSet.cssType;
			// if(this.dataSet.resaClass==class_product&&this.dataSet.cssType==ccsstype.tag) skinmode = skin.prdtag; // see(*sk01*) PVH2025 I decided that tags for product are going to be the usual ones, only the main tag of the product uses the 'product' tags collection
			
			const clientclass = this.dataSet.resaClass; // gives C_iSKIN an insight on the client resaClass, so it is inside C_iSKIN possible to defined that the skin (let's say pattern) applies to class class_product. So we can display a different subset of the pattern options. See (*ip01*).
		const csstrl = new C_iSKIN(this.eids.css, { select:new A_cb(this, this.onselect) }, { type:skinmode, value:this.dataSet.css, css:css, clientclass:clientclass } /*preset*/ );

	const note 		= new C_iNOTE(this.eids.note, this.dataSet.note, {rows:4} ); 
	
		let tabslabels = { 0:'definition', 1:'keyboard', 2:'audit' }; // which are textual basics,
		// we now replace the textuals by iconic forms 
		let fawcss; switch(this.dataSet.cssType) {
			case ccsstype.color: fawcss = 'fa-paint-roller'; break;
			case ccsstype.pattern: fawcss = 'fa-swatchbook'; break;
			case ccsstype.tag: fawcss = 'fa-pencil-paintbrush'; break;
			default: fawcss = 'fa-id-card';
		}
			const iconstyle = 'width:3em; min-width:3em; font-size:1.4em; line-height:1.6em;';
		tabslabels[0] = '<div style="'+iconstyle+'" class="fa fa-gray '+fawcss+'">'+'</div>'; // some id card looking symbol
		tabslabels[1] = '<div style="'+iconstyle+'" class="fa fa-gray fa-keyboard">'+'</div>'; // some id card looking symbol
		tabslabels[2] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
		
	const tabs		= new C_iTABS(this.eids.tabs, tabslabels, false, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, name:name, css:csstrl, note:note, isdefault:isdefault, ctrlshift:ctrlshift } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:660}, moves:true, morecss: { outlet:'M_CCSS' } } );
	this.activate();
}
M_CCSS.prototype = {
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const h1css = geth1css(this.dataSet.resaClass); // see (*cs55*)
		const title = '<td class="mheader"><h1 id='+this.eids.own.h1+' class="'+h1css+'">'+this.title()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons air"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('M_CCSS')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		// coordinates left side
					const c = ccssclasses; // definiton, see (*cs02*)
					let start = ''; 
					switch(this.dataSet.resaClass) {
						case c.appointment: start = C_XL.w('when new appointment'); break; // e.g. 'for new appointments'
						case c.event: 
						case c.fcal: start = C_XL.w('when new offday'); break; 
						case c.visitor: start = C_XL.w('when new visitor'); break;
						case c.note: start = C_XL.w('when new note'); break; 
						case c.task: start = C_XL.w('when new task'); break; 
						case c.chat: start = C_XL.w('when new chat'); break; 
						case c.file: start = C_XL.w('when new file'); break;
						case c.product: start = C_XL.w('when new product'); break;
						default: start = 'what object do you actually mean?'; // PVH2025-03: this was usefull ;)
					}
					let end = '';
					switch(this.dataSet.cssType) {
						case ccsstype.color: end = C_XL.w('bp-ccss color bydefault', { cap:0 }); break;
						case ccsstype.pattern: end = C_XL.w('bp-ccss pattern bydefault', { cap:0 }); break;
						case ccsstype.tag: end = C_XL.w('bp-ccss tag bydefault', { cap:0 }); break;
						default: end = 'is there a new skin class?';
					} 
				const bp = start+', '+end;
				const bpdiv = '<div id='+this.eids.own.bpisdefault+' class="blueprint" style="padding-left:.6em; display:none;">'+bp+'</div>';
			const isdefault = '<td rowspan="3" style="vertical-align:top; width:12em; max-width:12em; padding-left:1em;">'+this.controls.isdefault.display('color')+bpdiv+'</td>';
			
			const name = '<tr>'+this.controls.name.labelled('name','alpha24')+isdefault+'</tr>';
			
				const label = C_XL.ccss(this.dataSet.resaClass, this.dataSet.cssType, {typeonly:true, plural:false, translate:false});
			const ccss = '<tr style="min-height:5em;">'+this.controls.css.labelled(label)+'</tr>';
			const note = '<tr style="min-height:7em;">'+this.controls.note.labelled('note', 'ta24')+'</tr>';
			
			const layout = '<table class="coords" style="margin:0 auto;">'+name+ccss+note+'</table>';
		const tab0 = this.controls.tabs.container(0, layout);		
		
				const csbp = 'Hello, i am the new blueprint';
				const bpctrlshift = '<div id='+this.eids.own.bpctrlshift+' class="blueprint airtop" style="padding:0 15%; display:block; height:5em; min-height:5em;">'+csbp+'</div>';
				const cscondition = this.dataSet.resaClass == c.appointment; // this feature exists only for appointments
				const cscresta = this.controls.ctrlshift.display(); // which is a <table class="C_iTABLE color cresta-table checks"> 
			const ctrshift = '<div style="margin:0 auto; text-align:center; display:flex; justify-content: center;">'+cscresta+'</div>';
		const tab1 = this.controls.tabs.container(1, ctrshift+bpctrlshift);
					 this.controls.tabs.hide(1,!cscondition); // this feature is available only for appointments, in 2025
		
		const tab2 = this.controls.tabs.container(2, this.dataSet.tracking());
		
		return tab0+tab1+tab2;
		
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('M_CCSS');
		this.onselect(this.dataSet.css);
		this.ondefault().onctrlshift(); 
	},
	
	// private
	title: function(tagcode) {
		let title = C_XL.ccss(this.dataSet.resaClass, this.dataSet.cssType);
		if(this.dataSet.id < 0) title += ': '+C_XL.w('new');
		let fafont = '';
		switch(tagcode) {
			case 1042: case 1044: 
				fafont = 'fab'; break;
			default: fafont = 'fa';
		}
		
		if(tagcode) title += '<div class="'+fafont+' fa-15x '+C_iSKIN.tagcss(tagcode)+'" style="padding-left:.6em; min-width:1.4em;"></div>';
		return title;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		const names = { id:{ id:'id', type:'cssType', oclass:'resaClass'}, name:'name', css:'css', note:'note', isdefault:{isdefault:'isdefault'}, ctrlshift:'ctrlshift'};
		mobminder.app.post(this.controls, names, './post/customcss.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id', type:'cssType', oclass:'resaClass'} };
		mobminder.app.post(this.controls, names, './delete/customcss.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	onselect: function(ccode) {
		if(this.dataSet.cssType!=ccsstype.color) {
			
		}
		switch(this.dataSet.cssType) {
			case ccsstype.color:	// colors
				if(ccode==0) // the default color was selected
					this.modal.setmborder(0);
				if(vbs) vlog('modals.js', 'M_CCSS', 'oncolorselect', 'ccode:'+ccode);
				this.modal.setmborder(ccode);
				return this;
			case ccsstype.pattern:	// pattern
				if(ccode==0) // the default pattern was selected
					this.modal.setmpattern(0);
				if(vbs) vlog('modals.js', 'M_CCSS', 'onpatternselect', 'pcode:'+ccode);
				this.modal.setmpattern(ccode);
				// this.modal.setmborder(ccode);
				return this;
			case ccsstype.tag:	// pattern
				// this.elements.h1.innerHTML = this.title(ccode);
				setTimeout( () => { this.elements.h1.innerHTML = this.title(ccode); }, 500 );
				if(vbs) vlog('modals.js', 'M_CCSS', 'ontagselect', 'tcode:'+ccode);
				return this;
		}
	},
	ondefault: function(v) {
		if(v===undefined) {
			let gp = this.controls.isdefault.getpost(); // arrives like an Array[isdefault:1(or 0)]
			let ison = gp['isdefault'];
			if(ison) v = 'isdefault';
		}
		let turnon = v == 'isdefault';
		if(vbs) vlog('modals.js', 'M_CCSS', 'ondefault', 'v:'+v+', turnon:'+(turnon?'yes':'nope'));
		if(turnon) $(this.elements.bpisdefault).show();
		else $(this.elements.bpisdefault).hide();
		return this;
	},
	onctrlshift: function(rray) {
		let bptxt;
		let csb = 0; // control shift code in binary format
		if(rray) for(let i in rray) csb += rray[i]|0; // arrives as array of string values when C_iCRESTA triggers an onchange callback
			else csb = this.dataSet.ctrlshift; // initialization from activate();
		switch(csb) {
			case 0: bptxt = 'bp_ctrlshift_none'; break;
			case 1: bptxt = 'bp_ctrlshift_ctrl'; break;
			case 2: bptxt = 'bp_ctrlshift_shift'; break;
			case 3: bptxt = 'bp_ctrlshift_ctrlshift'; break; // both bits are raised :)
		}		
		let csstype; switch(this.dataSet.cssType) {
			case ccsstype.color: csstype = C_XL.w('color', { cap:0 }); bptxt += '_color'; break;
			case ccsstype.pattern: csstype = C_XL.w('pattern', { cap:0 }); break;
			case ccsstype.tag: csstype = C_XL.w('tag', { cap:0 }); break;
		} 
		const bp = C_XL.w(bptxt, { cap:true, nested:{ cssType:csstype} });
		this.elements.bpctrlshift.innerHTML = bp;
		return this;
	},
	
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		
		let dataSets = inlineDataSets['C_dS_customCss'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; };
		let isdefault = this.controls.isdefault.getpost(); isdefault = isdefault['isdefault'];
			
		mobminder.account = C_dS_group.get(mobminder.account.id); // inlineDataSets contains a freshly streamed version of C_dS_group that we need to relink to mobminder.account
		mobminder.account.acmeta();
		
		if(vbs) vlog('modals.js','M_CCSS','saved','id='+dataSet.id+', type:'+dataSet.cssType+', class:'+dataSet.resaClass+', default:'+isdefault);

		if(this.callbacks.saved) this.callbacks.saved.cb(dataSet); // intended to further refresh the plus list
		this.quit();
		
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_CCSS','removed','id='+this.dataSet.id+', type:'+this.dataSet.cssType+', class:'+this.dataSet.resaClass);
		C_dS_customCss.del(this.dataSet.id); // remove this dS locally
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		this.quit();
	},
	failed: function() {
		this.modal.busy(false);
	}
}
M_CCSS.isdefault = function(cresta) {
	this.picker = cresta;
	this.activate = function() { return this.picker.activate() };
	this.display = function(css) { return this.picker.display(css); };
	this.getpost = function() { return this.picker.setting(); }; // this is the very good reason for having this pseudo control: it posts like 'default:1' or 'default:0' from a CRESTA
}
M_CCSS.ctrlshift = function(cresta) {
	this.picker = cresta;
	this.activate = function() { return this.picker.activate() };
	this.display = function(css) { return this.picker.display(css); };
	this.getpost = function() { 
		const setting = this.picker.setting(); // this is the very good reason for having this pseudo control: it posts like 'default:1' or 'default:0' from a CRESTA
		let binary = 0;	for(let v in setting) binary+=setting[v]?(v|0):0;
		return binary;
	};
}





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//    E M A I L S ,   S  M S ,   N O T I F I C A T I O N S 
//


function M_EMLT(dS, callbacks, preset) { // Email template
	preset = preset || {};
	this.dS = dS;
	this.callbacks = callbacks; // { saved:o_callback };
	const base = 'smst'+'_';
	this.eids = { id:base+'id', tabs:base+'tabs', buttons:base+'buttons', name:base+'name', triggers:base+'trig'
				, subj:base+'subj', msg:base+'msg'
				, subj1:base+'subj1', alt1:base+'alt1', msg1:base+'msg1'
				, subj2:base+'subj2', alt2:base+'alt2', msg2:base+'msg2', tags:base+'tags' 
				, wrappers: { delivt:base+'_wrp_dt', actions:base+'_wrp_act', logins:base+'_wrp_lgs', resources:base+'_wrp_rsc', autosend:base+'_wrp_asn' } 
			};

			const permitted = permissions.may(pc.ch_comm);	
		const mayremove = (this.dS.id>0) && permitted;
		const maysave = permitted;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );
	
	// schedule
	const id		= new C_iPASS({ id:this.dS.id, triggerClass:class_resa_any, advance:0 });
	const name 	= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') });

	const triggers = new C_iTRIGGER( this.eids.triggers, {}, this.dS, {} );

	// message
		const msgfocus = new A_cb(this, this.msgfocus);
	const subj 	= new C_iFIELD(this.eids.subj, false, { digits:this.dS.subject, type:INPUT_TEXT, mandatory:true, focus:false });
	const subj1 	= new C_iFIELD(this.eids.subj1, false, { digits:this.dS.altSubject1, type:INPUT_TEXT, mandatory:false, focus:false });
	const subj2 	= new C_iFIELD(this.eids.subj2, false, { digits:this.dS.altSubject2, type:INPUT_TEXT, mandatory:false, focus:false });
	
	const msg 	= new C_iFIELD(this.eids.msg, { onffocus:msgfocus }, { digits:this.dS.message, type:INPUT_ML_MAIL, rows:7, mandatory:true });
	const msg1 	= new C_iFIELD(this.eids.msg1, { onffocus:msgfocus }, { digits:this.dS.altMessage1, type:INPUT_ML_MAIL, rows:7, mandatory:false });
	const msg2 	= new C_iFIELD(this.eids.msg2, { onffocus:msgfocus }, { digits:this.dS.altMessage2, type:INPUT_ML_MAIL, rows:7, mandatory:false });

		msg.language = mobminder.account.language; msg1.language = this.dS.altLanguage1; msg2.language = this.dS.altLanguage2;
		
	const lang1	= new C_iSPEAK(this.eids.alt1, { onselect:new A_cb(this, this.onlang, msg1) }, { value:this.dS.altLanguage1, maynone:true } );
	const lang2	= new C_iSPEAK(this.eids.alt2, { onselect:new A_cb(this, this.onlang, msg2) }, { value:this.dS.altLanguage2, maynone:true }  );
	
	const tags	= new C_iTAGS(this.eids.tags, { ontag:new A_cb(this, this.ontag), ontemplate:new A_cb(this, this.ontemplate) }, { medium:msgmedium.email })
	
	//tabs
		const tabscaptions = C_XL.w({0:'timing and trigger', 1:'message', 2:'audit'});
		tabscaptions[2] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
		
	const tabs = new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );
	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, name:name, triggers:triggers
									, subj:subj, msg:msg, lang1:lang1, subj1:subj1, msg1:msg1, lang2:lang2, subj2:subj2, msg2:msg2, tags:tags} );
	this.state = { msgfocus:msg }

	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:960, y:640}, moves:true } );
	this.activate();
}
M_EMLT.prototype = { 
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-email-template">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div style="padding:0 0 2em 0;"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// timing
		let name = '<tr>'+this.controls.name.labelled('name', 'vmarged')+'</tr>';
		let triggers = '<tr><td colspan=2>'+this.controls.triggers.display()+'</td></tr>';
			
		let scheduling = '<table class="coords">'+name+triggers+'</table>';
		let tab0 = this.controls.tabs.container(0, scheduling);

		// message
		let subj = '<tr>'+this.controls.subj.labelled('email subject', 'alpha32')+'</tr>';
		let msg = '<tr>'+this.controls.msg.labelled('email message', 'ta32')+'</tr>';
		let lang1 = '<tr>'+this.controls.lang1.labelled('alt message in', 'alpha10')+'</tr>';
		let subj1 = '<tr>'+this.controls.subj1.labelled('email subject', 'alpha32')+'</tr>';
		let msg1 = '<tr>'+this.controls.msg1.labelled('email message', 'ta32')+'</tr>';
		let lang2 = '<tr>'+this.controls.lang2.labelled('alt message in', 'alpha10')+'</tr>';
		let subj2 = '<tr>'+this.controls.subj2.labelled('email subject', 'alpha32')+'</tr>';
		let msg2 = '<tr>'+this.controls.msg2.labelled('email message', 'ta32')+'</tr>';
		let padding = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		let compiling = '<table summary="compiling" style="display:inline-block;">'+subj+msg+padding+lang1+subj1+msg1+padding+lang2+subj2+msg2+'</table>';
		let msgwizard = this.controls.tags.display();
		let tab1 = this.controls.tabs.container(1, compiling+msgwizard);
		
		// tracking
		let tab2 = this.controls.tabs.container(2, this.tracking() );
		
		return tab0+tab1+tab2;
	},
	activate: function() {
		this.controls.activate('M_EMLT');
	},
	
	// private
	title: function() {
		if(this.dS.id < 0) return C_XL.w('email template')+': '+C_XL.w('new');
		let title = C_XL.w('email template')+': '+this.dS.name;
		return title;
	},
	tracking: function() {
		let tracking = this.dS.tracking();
		return tracking;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{id:'id', advance:'advance', triggerClass:'triggerClass' }
			, name:'name', triggers:{
				autosend:'sendComms', target:'target', trigger:'triggerId', deliv:'deliveryTime', delay:'deliveryDelay', ahead:'advance'
				, factions:'filterOnActions', flogins:'filterOnLogins', fresources:'filterOnResources'
				, actions:'actions', logins:'logins', resources:'resources' }
			, subj:'subject', msg:'message'
			, lang1:'altLanguage1', subj1:'altSubject1', msg1:'altMessage1'
			, lang2:'altLanguage2', subj2:'altSubject2', msg2:'altMessage2' };
		mobminder.app.post(this.controls, names, './post/emlt.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id'} };
		mobminder.app.post(this.controls, names, './delete/emlt.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	onlang: function(field, which) { field.language = which; field.focus(true); },
	msgfocus: function(field) { this.state.msgfocus = field; },
	ontag: function(tag) { this.state.msgfocus.insert(mobtags.fusion[tag]); },
	ontemplate: function(template) { this.state.msgfocus.set(C_XL.w(template, {language:this.state.msgfocus.language})); },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) { // resource data saved
if(vbs) vlog('modals.js','M_EMLT','saved','id='+this.dS.id);
		let dSs = inlineDataSets['C_dS_emailTemplate'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.quit();
	},
	removed: function() {
if(vbs) vlog('modals.js','M_EMLT','removed','id='+this.dS.id);
		C_dS_emailTemplate.del(this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	}
}




function M_NOTIF_Template(dS, callbacks, preset) { // notif template
	preset = preset || {};
	this.dS = dS;
	this.callbacks = callbacks; // { saved:o_callback };
	let base = 'smst'+'_';
	this.eids = { id:base+'id', tabs:base+'tabs', buttons:base+'buttons', name:base+'name', triggers:base+'trig'
				, subj:base+'subj', msg:base+'msg'
				, subj1:base+'subj1', alt1:base+'alt1', msg1:base+'msg1'
				, subj2:base+'subj2', alt2:base+'alt2', msg2:base+'msg2', tags:base+'tags' 
				, wrappers: { delivt:base+'_wrp_dt', actions:base+'_wrp_act', logins:base+'_wrp_lgs', resources:base+'_wrp_rsc', autosend:base+'_wrp_asn' } 
			};

			let permitted = permissions.may(pc.ch_comm);	
		let mayremove = (this.dS.id>0) && permitted;
		let maysave = permitted;
	let cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );
	
	// schedule
	let id		= new C_iPASS({ id:this.dS.id, triggerClass:class_resa_any, advance:0 });
	let name 	= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') });

	let triggers = new C_iTRIGGER( this.eids.triggers, {}, this.dS, {} );

	// message
		let msgfocus = new A_cb(this, this.msgfocus);
	let subj 	= new C_iFIELD(this.eids.subj, false, { digits:this.dS.title, type:INPUT_TEXT, mandatory:true, focus:false });
	let subj1 	= new C_iFIELD(this.eids.subj1, false, { digits:this.dS.altTitle1, type:INPUT_TEXT, mandatory:false, focus:false });
	let subj2 	= new C_iFIELD(this.eids.subj2, false, { digits:this.dS.altTitle2, type:INPUT_TEXT, mandatory:false, focus:false });
	
	let msg 	= new C_iFIELD(this.eids.msg, { onffocus:msgfocus }, { digits:this.dS.message, type:INPUT_TEXT, rows:7, mandatory:true });
	let msg1 	= new C_iFIELD(this.eids.msg1, { onffocus:msgfocus }, { digits:this.dS.altMessage1, type:INPUT_TEXT, rows:7, mandatory:false });
	let msg2 	= new C_iFIELD(this.eids.msg2, { onffocus:msgfocus }, { digits:this.dS.altMessage2, type:INPUT_TEXT, rows:7, mandatory:false });

		msg.language = mobminder.account.language; msg1.language = this.dS.altLanguage1; msg2.language = this.dS.altLanguage2;
		
	let lang1	= new C_iSPEAK(this.eids.alt1, { onselect:new A_cb(this, this.onlang, msg1) }, { value:this.dS.altLanguage1, maynone:true } );
	let lang2	= new C_iSPEAK(this.eids.alt2, { onselect:new A_cb(this, this.onlang, msg2) }, { value:this.dS.altLanguage2, maynone:true }  );
	
	let tags	= new C_iTAGS(this.eids.tags, { ontag:new A_cb(this, this.ontag), ontemplate:new A_cb(this, this.ontemplate) }, { medium:msgmedium.notif })
	
	//tabs
		const tabscaptions = C_XL.w({0:'timing and trigger', 1:'message', 2:'audit'});
		tabscaptions[2] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
		
	let tabs = new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );
	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, name:name, triggers:triggers
									, subj:subj, msg:msg, lang1:lang1, subj1:subj1, msg1:msg1, lang2:lang2, subj2:subj2, msg2:msg2, tags:tags} );
	this.state = { msgfocus:msg }

	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:960, y:640}, moves:true } );
	this.activate();
}
M_NOTIF_Template.prototype = { 
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-notif-template">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div style="padding:0 0 2em 0;"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// timing
		let name = '<tr>'+this.controls.name.labelled('name', 'vmarged')+'</tr>';
		let triggers = '<tr><td colspan=2>'+this.controls.triggers.display()+'</td></tr>';
			
		let scheduling = '<table class="coords">'+name+triggers+'</table>';
		let tab0 = this.controls.tabs.container(0, scheduling);

		// message
		let subj = '<tr>'+this.controls.subj.labelled('notif subject', 'alpha32')+'</tr>';
		let msg = '<tr>'+this.controls.msg.labelled('notif message', 'ta32')+'</tr>';
		let lang1 = '<tr>'+this.controls.lang1.labelled('alt message in', 'alpha10')+'</tr>';
		let subj1 = '<tr>'+this.controls.subj1.labelled('notif subject', 'alpha32')+'</tr>';
		let msg1 = '<tr>'+this.controls.msg1.labelled('notif message', 'ta32')+'</tr>';
		let lang2 = '<tr>'+this.controls.lang2.labelled('alt message in', 'alpha10')+'</tr>';
		let subj2 = '<tr>'+this.controls.subj2.labelled('notif subject', 'alpha32')+'</tr>';
		let msg2 = '<tr>'+this.controls.msg2.labelled('notif message', 'ta32')+'</tr>';
		let padding = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
		let compiling = '<table summary="compiling" style="display:inline-block;">'+subj+msg+padding+lang1+subj1+msg1+padding+lang2+subj2+msg2+'</table>';
		let msgwizard = this.controls.tags.display();
		let tab1 = this.controls.tabs.container(1, compiling+msgwizard);
		
		// tracking
		let tab2 = this.controls.tabs.container(2, this.tracking() );
		
		return tab0+tab1+tab2;
	},
	activate: function() {
		this.controls.activate('M_NOTIF_Template');
	},
	
	// private
	title: function() {
		if(this.dS.id < 0) return C_XL.w('notif template')+': '+C_XL.w('new');
		let title = C_XL.w('notif template')+': '+this.dS.name;
		return title;
	},
	tracking: function() {
		let tracking = this.dS.tracking();
		return tracking;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{id:'id', advance:'advance', triggerClass:'triggerClass' }
			, name:'name', triggers:{
				autosend:'sendComms', target:'target', trigger:'triggerId', deliv:'deliveryTime', delay:'deliveryDelay', ahead:'advance'
				, factions:'filterOnActions', flogins:'filterOnLogins', fresources:'filterOnResources'
				, actions:'actions', logins:'logins', resources:'resources' }
			, subj:'title', msg:'message'
			, lang1:'altLanguage1', subj1:'altTitle1', msg1:'altMessage1'
			, lang2:'altLanguage2', subj2:'altTitle2', msg2:'altMessage2' };
		mobminder.app.post(this.controls, names, './post/notiftemplate.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id'} };
		mobminder.app.post(this.controls, names, './delete/notiftemplate.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	onlang: function(field, which) { field.language = which; field.focus(true); },
	msgfocus: function(field) { this.state.msgfocus = field; },
	ontag: function(tag) { this.state.msgfocus.insert(mobtags.fusion[tag]); },
	ontemplate: function(template) { this.state.msgfocus.set(C_XL.w(template, {language:this.state.msgfocus.language})); },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) { // resource data saved
if(vbs) vlog('modals.js','M_NOTIF_Template','saved','id='+this.dS.id);
		let dSs = inlineDataSets['C_dS_notifTemplate'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.quit();
	},
	removed: function() {
if(vbs) vlog('modals.js','M_NOTIF_Template','removed','id='+this.dS.id);
		C_dS_notifTemplate.del(this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	}
}




function M_SMST(dS, callbacks, preset) { // SMS template
	preset = preset || {};
	this.dS = dS;
	this.callbacks = callbacks; // { saved:o_callback };
	const base = 'smst'+'_';
	this.eids = { id:base+'id', tabs:base+'tabs', buttons:base+'buttons', name:base+'name', triggers:base+'trig', smsga:base+'sga'
				, msgs: { 0:base+'msg', 1:base+'msg1', 2:base+'msg2' }, alt1:base+'alt1', alt2:base+'alt2', tags:base+'tags'
				, own: { counters:{ 0:base+'c_msg_0', 1:base+'c_msg_1', 2:base+'c_msg_2' } }
			};
	this.elements = new A_el();
	
			const permitted = permissions.may(pc.ch_comm);
		const mayremove = (this.dS.id>0) && permitted;
		const maysave = permitted;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );
	
	// schedule, triggers and filters
	const id		= new C_iPASS({ id:this.dS.id, triggerClass:class_resa_any, advance:0 });
	const name 	= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') });
	
	const triggers = new C_iTRIGGER( this.eids.triggers, {}, this.dS, {} );
		const smsgapreset = { maynone:false, smsgateaway:dS.smsgateaway, encoding:dS.encoding, priority:dS.priority, mpage:dS.pages, inboundaction:dS.inboundaction, autoreplymsg:dS.autoreplymsg };
		// dS.pages, see (*mp01*)
	const smsga	= new C_iSMSGateAway(this.eids.smsga, { onsmsga:new A_cb(this, this.onsmsga), onsmstest:new A_cb(this, this.onsmstest) }, smsgapreset );

	// messages	
	const msg0 	= new C_iFIELD(this.eids.msgs[0], 	{ onffocus:new A_cb(this, this.msgfocus, 0), onfchange:new A_cb(this, this.msgchange, 0) }, { digits:this.dS.message, 	 type:INPUT_ML_SMS, mandatory:true, 	max:140, rows:6 }); // (*m11*)  we limit the size here to 140 so to anticipate the magnification of fusion fields
	const msg1 	= new C_iFIELD(this.eids.msgs[1], 	{ onffocus:new A_cb(this, this.msgfocus, 1), onfchange:new A_cb(this, this.msgchange, 1) }, { digits:this.dS.altMessage1, type:INPUT_ML_SMS, mandatory:false, 	max:140, rows:6 });
	const msg2 	= new C_iFIELD(this.eids.msgs[2], 	{ onffocus:new A_cb(this, this.msgfocus, 2), onfchange:new A_cb(this, this.msgchange, 2) }, { digits:this.dS.altMessage2, type:INPUT_ML_SMS, mandatory:false, 	max:140, rows:6 });
		
		msg0.language = mobminder.account.language; msg1.language = this.dS.altLanguage1; msg2.language = this.dS.altLanguage2; 
		
	const lang1	= new C_iSPEAK(this.eids.alt1, { onselect:new A_cb(this, this.onlang, msg1) }, { value:this.dS.altLanguage1, maynone:true } );
	const lang2	= new C_iSPEAK(this.eids.alt2, { onselect:new A_cb(this, this.onlang, msg2) }, { value:this.dS.altLanguage2, maynone:true }  );
	
	const tags	= new C_iTAGS(this.eids.tags, { ontag:new A_cb(this, this.ontag), ontemplate:new A_cb(this, this.ontemplate) }, {})
	
	//tabs
		const tabscaptions = C_XL.w({0:'timing and trigger', 1:'message', 2:'sms gateaway', 3:'audit'});
		tabscaptions[3] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs = new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );
	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, name:name, triggers:triggers, smsga:smsga
								, msgs:new A_ct({ 0:msg0, 1:msg1, 2:msg2 }), lang1:lang1, lang2:lang2, tags:tags } );
	this.state = { msgfocus:msg0 }
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:960, y:540}, moves:true } );
	this.activate();
}
M_SMST.prototype = { 
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-sms-template">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div style="padding:0 0 2em 0;"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// triggers & timing
			let name = '<tr>'+this.controls.name.labelled('name', 'vmarged alpha18')+'</tr>';
			let triggers = '<tr><td colspan=2>'+this.controls.triggers.display()+'</td></tr>';
			
			let scheduling = '<table style="margin:0 auto;">'+name+triggers+'</table>';
		let tab0 = this.controls.tabs.container(0, scheduling);

		// note
						let padder = '<tr><td>&nbsp;</td><td>&nbsp;</td></tr>';
						let cstyle = 'width:3em; vertical-align:top; padding-top:.1em; padding-left:.2em; color:rgba(0,0,0,.5); font-size:80%';
					let msg0 = '<tr>'+this.controls.msgs[0].labelled('standard message', 'ta28')+'<td id="'+this.eids.own.counters[0]+'" style="'+cstyle+'"></td>'+'</tr>';
					let lang1 = '<tr>'+this.controls.lang1.labelled('alt message in', 'alpha10')+'<td></td>'+'</tr>';
					let msg1 = '<tr>'+this.controls.msgs[1].labelled('message', 'ta28')+'<td id="'+this.eids.own.counters[1]+'" style="'+cstyle+'"></td>'+'</tr>';
					let lang2 = '<tr>'+this.controls.lang2.labelled('alt message in', 'alpha10')+'<td></td>'+'</tr>';
					let msg2 = '<tr>'+this.controls.msgs[2].labelled('message', 'ta28')+'<td id="'+this.eids.own.counters[2]+'" style="'+cstyle+'"></td>'+'</tr>';
				let altlanguages = '<table summary="compiling" style="display:inline-block;">'+msg0+padder+lang1+msg1+padder+lang2+msg2+'</table>';
			
			let compiling = '<div style="">'+altlanguages+'</div>';
			
				let wiztitle = '<h2>'+C_XL.w('substitution placeholders')+':</h2>';
				let wiztags = '<div style="max-height:440px; height:440px; overflow-y:auto; padding-right:10px;">'+this.controls.tags.display()+'</div>';
			let msgwizard = '<div>'+wiztitle+wiztags+'</div>';
		
			let msgdiv = '<div style="display:flex; flex-wrap:nowrap; align-content:top; justify-content:space-around;">'+compiling+msgwizard+'</div>';
		let tab1 = this.controls.tabs.container(1, msgdiv);
		
		
		// sms gateaway ( only visible by account managers )
			let smsga = '<div>'+this.controls.smsga.display()+'</div>';
		let tab2 = this.controls.tabs.container(2, smsga);
		
			let showsmsga = mobminder.context.surfer.is.atleast.seller;
		this.controls.tabs.hide(2, !showsmsga);
		
		
		// tracking
		let tab3 = this.controls.tabs.container(3, this.tracking() );
		
		return tab0+tab1+tab2+tab3;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('M_SMST');
		for(let which in this.controls.msgs.get) this.setcounter(which); // sets initial position for counters
	},
	
	// private
	title: function() {
		if(this.dS.id < 0) return C_XL.w('sms template')+': '+C_XL.w('new');
		let title = C_XL.w('sms template')+': '+this.dS.name;
		return title;
	},
	tracking: function() {
		let tracking = this.dS.tracking();
		return tracking;
	},
	setcounter: function(which) {
			let c = this.controls.msgs[which];
			let r = c.remains();
		this.elements.counters[which].innerHTML = r.positive+' / '+r.max;
		return c;
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{id:'id', advance:'advance', triggerClass:'triggerClass' }, name:'name'
			, smsga:{ smsga:'smsgateaway', encod:'encoding', prior:'priority', mpage:'pages', inbactn:'inboundaction', automsg:'autoreplymsg' }
			, triggers:{ 
				  autosend:'sendComms', target:'target', trigger:'triggerId', deliv:'deliveryTime'
				, delay:'deliveryDelay', ahead:'advance', prelist:'presenceList'
				, factions:'filterOnActions', flogins:'filterOnLogins', fresources:'filterOnResources'
				, actions:'actions', logins:'logins', resources:'resources' }
				, msgs: { 0:'message', 1:'altMessage1', 2:'altMessage2' }
				, lang1:'altLanguage1', lang2:'altLanguage2' 
			};
		mobminder.app.post(this.controls, names, './post/smst.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	onsmstest: function() {
		if(!this.controls.validation()) return;
		let names = { id:{id:'id', advance:'advance', triggerClass:'triggerClass' }, name:'name'
			, smsga:{ smsga:'smsgateaway', encod:'encoding', prior:'priority', mpage:'pages', inbactn:'inboundaction', automsg:'autoreplymsg', testwhich:'testwhich' }
			, triggers:{ 
				  autosend:'sendComms', target:'target', trigger:'triggerId', deliv:'deliveryTime'
				, delay:'deliveryDelay', ahead:'advance', prelist:'presenceList'
				, factions:'filterOnActions', flogins:'filterOnLogins', fresources:'filterOnResources'
				, actions:'actions', logins:'logins', resources:'resources' }
				, msgs: { 0:'message', 1:'altMessage1', 2:'altMessage2' }
				, lang1:'altLanguage1', lang2:'altLanguage2' 
			};
		mobminder.app.post(this.controls, names, './post/smstemplatetest.php', new A_cb(this,this.testok), new A_cb(this,this.testfailed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id'} };
		mobminder.app.post(this.controls, names, './delete/smst.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	onlang: function(field, which) { field.language = which; field.focus(true); },
	msgfocus: function(which, field) { this.state.msgfocus = field;	},
	msgchange: function(which, digits) { this.setcounter(which);	},
	ontag: function(tag) { this.state.msgfocus.insert(mobtags.fusion[tag]); },
	onsmsga: function(maxchars) { 
		for(let l in this.controls.msgs.get) { this.controls.msgs[l].setmax(maxchars); this.setcounter(l); }
	},
	ontemplate: function(template) { this.state.msgfocus.set(C_XL.w(template, {language:this.state.msgfocus.language} )); },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) { // resource data saved
if(vbs) vlog('modals.js','M_SMST','saved','id='+this.dS.id);
		let dSs = inlineDataSets['C_dS_smsTemplate'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.quit();
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_SMST','removed','id='+this.dS.id);
		C_dS_smsTemplate.del(this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.quit();
	},
	testok: function() { this.controls.smsga.testok(); },
	failed: function() { this.modal.busy(false); },
	testfailed: function() { this.controls.smsga.testok(); }
}




//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     W O R K C O D E S
//
//


function M_WRKCD(dataSet, callbacks) { // Workcodes -> they turn into performances (DB table) when used on appointments
	this.dS = dataSet; // expects a C_dS_workcode
	this.callbacks = callbacks || {}; // like { saved:, deleted: }
	const b = 'wrkcd'+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', duplicate:b+'duplic'
		, name:b+'name', code:b+'code', price:b+'price', deposit:b+'depst', color:b+'color', pattern:b+'patt', tag:b+'tag', tags:b+'tags'
		, note:b+'note', secretarynote:b+'snote', webpagenote:b+'wnote', commsnote:b+'cnote'
		
		, lang1:b+'lang1', lang2:b+'lang2', note1:b+'note1', note2:b+'note2', comm1:b+'comm1', comm2:b+'comm2', name1:b+'name1', name2:b+'name2'
		, eres:b+'eres'
		, duration:b+'dur', experts:b+'exp', tboxing:b+'tbx'
		, own: { langwrap1a: b+'lwrp_1a', langwrap1b: b+'lwrp_1b', langwrap2a: b+'lwrp_2a', langwrap2b: b+'lwrp_2b', h1:b+'h1'
				, wraps: { tags:b+'wtags' }
			}
	};
	this.elements = new A_el();
	
			const permitted = permissions.may(pc.ch_wrkc);
		const mayremove = (this.dS.id>0) && permitted;
		const maysave = permitted;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );
	
	const duplicate 	= new C_iCLIK(this.eids.duplicate, { click:new A_cb(this, this.duplicate) }
		, { enabled:true, tip:C_XL.w('tip duplicate'), css:'modal-button fa fa-gray fa-copy touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.d /*d like duplicate*/] });

	const id			= new C_iPASS(this.dS.id);

		const ntyping = new A_cb(this, this.nametyping, null, null, 1200);	
	const name 		= new C_iFIELD(this.eids.name, { onfchange:ntyping }, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') });
	const code 		= new C_iFIELD(this.eids.code, false, { digits:this.dS.code, type:INPUT_TEXT, mandatory:false, focus:false });
	
	const price 		= new C_iFIELD(this.eids.price, false, { digits:this.dS.price, type:INPUT_PRICE, mandatory:false, focus:false, units:C_XL.w('euros'), min:100 });
	const deposit 	= new C_iFIELD(this.eids.deposit, false, { digits:this.dS.deposit, type:INPUT_PRICE, mandatory:false, focus:false, units:C_XL.w('euros'), min:100 });
	
	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:resaclass.appointment, csstype:ccsstype.color, value:this.dS.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:resaclass.appointment, csstype:ccsstype.pattern, value:this.dS.cssPattern, enabled:true } /*preset*/ );
	const tag			= new C_iSKIN(this.eids.tag, { select:new A_cb(this, this.ontagselect) }, { type:skin.wkctag, value:this.dS.tag, allownone:true, css:'tagbig' } /*preset*/ );
	const tags		= new C_iCSS(this.eids.tags, {}, { cssclass:resaclass.appointment, csstype:ccsstype.tag, value:this.dS.tags, enabled:true } /*preset*/ ); // see (*wk01*)

	const note 		= new C_iNOTE(this.eids.note, this.dS.note, {rows:3});
	const note_s 		= new C_iNOTE(this.eids.secretarynote, this.dS.secretarynote, {rows:4});
	const note_w		= new C_iNOTE(this.eids.webpagenote, this.dS.webpagenote, {rows:4, type:INPUT_ML_HTML});
	const note_c		= new C_iNOTE(this.eids.commsnote, this.dS.communicnote, {rows:4, type:INPUT_ML_HTML});
	
	const eres 		= new M_WRKCD.options(this.eids.eres, this.dS.ereservable);

	const duration 	= new C_iDUR(this.eids.duration, {}, { duration:this.dS.duration } );
	
		// const precheck = (this.dS.id <= 0) ? true : this.dS.resources(); // true will check everything
			const resources = this.dS.resources();
		const precheck = (!resources) ? true : resources; // true will check everything
	const experts 	= new C_iSTAFF(this.eids.experts, 'staffing', new A_cb(this,this.staff), precheck, { size:this.dS.staffing });
	
		const tbxpreset = this.dS.tboxingIds();
		const options = C_dS_timeboxing.cresta(tbxpreset);
	const tboxing 	= new C_iCRESTA(this.eids.tboxing, {}, options, { mode:0, title:C_XL.w('timeboxings') } );


	// message
		const msgfocus = new A_cb(this, this.msgfocus);
		
	const name1 	= new C_iFIELD(this.eids.name1, false, { digits:this.dS.altName1, type:INPUT_TEXT, mandatory:false, focus:false, nickname:'name1' }); // (*wk10*)
	const name2 	= new C_iFIELD(this.eids.name2, false, { digits:this.dS.altName2, type:INPUT_TEXT, mandatory:false, focus:false, nickname:'name2' });
	
	const note1 	= new C_iNOTE(this.eids.note1, this.dS.altwebpagenote1, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	const note2 	= new C_iNOTE(this.eids.note2, this.dS.altwebpagenote2, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	
	const comm1 	= new C_iNOTE(this.eids.comm1, this.dS.altcommunicnote1, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	const comm2 	= new C_iNOTE(this.eids.comm2, this.dS.altcommunicnote2, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });

		
	const lang1	= new C_iSPEAK(this.eids.lang1, { onselect:new A_cb(this, this.onlang, name1 /* (*wk10*) */) }, { value:this.dS.altLanguage1, maynone:true, language:mobminder.context.surfer.language } );
	const lang2	= new C_iSPEAK(this.eids.lang2, { onselect:new A_cb(this, this.onlang, name2) }, { value:this.dS.altLanguage2, maynone:true, language:mobminder.context.surfer.language } );
	
		const tabscaptions = C_XL.w({0:'identification', 1:'experts', 2:'timeboxings', 3:'communication', 4:'languages', 99:'audit'});
		tabscaptions[99] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, duplicate:duplicate, name:name, code:code, price:price, deposit:deposit, color:color
				, pattern:pattern, tag:tag, tags:tags, note:note, note_s:note_s, note_c:note_c, note_w:note_w
				, name1:name1, name2:name2, note1:note1, note2:note2, comm1:comm1, comm2:comm2, lang1:lang1, lang2:lang2
				, eres:eres, duration:duration, experts:experts, tboxing:tboxing } );
				
			const tilt = this.dS.id <= 0 ? -100 : 0;
		const position = { style:'', offset:{x:tilt, y:tilt}};
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { position:position, size:{x:800}, moves:true, morecss: { outlet:'M_WRKCD' } } );
	
	if(vbs) vlog('modals.js','M_WRKCD','constructor','eid:'+this.eids.id+', name:'+this.dS.name);
	this.activate();
}
M_WRKCD.prototype = {
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
				let maycopy = this.dS.id>0;	let permitted = permissions.may(pc.ch_wrkc);

			let duplicate = (maycopy&&permitted) ?'<td class="cartouche" style="padding-left:2em;">'+this.controls.duplicate.display()+'</td>':'';
		let title = '<td class="mheader"><h1 id="'+this.eids.own.h1+'" class="modal-workcode">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+duplicate+title+'</tr>';
		let divHeader = '<div class="buttons air"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-workcode')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// identification left side
					let eres 		= '<div>'+this.controls.eres.display('textcolor-light')+'</div>';
					let duration 	= '<div style="margin-top:1em;">'+this.controls.duration.display('textcolor-light')+'</div>';
				let right = '<td style="vertical-align:top;  padding:1em 0em 0em 2em;">'+eres+duration+'</td>';
						
					let name = '<tr>'+this.controls.name.labelled('name', 'alpha24')+'</tr>';
					let code = '<tr>'+this.controls.code.labelled('code')+'</tr>';
						let price = '<tr>'+this.controls.price.labelled('price', 'alpha06')+'</tr>';
						let deposit = '<tr>'+this.controls.deposit.labelled('deposit', 'alpha06')+'</tr>';
						
					let tag = '<tr>'+this.controls.tag.labelled('tag')+'</tr>';
					let note = '<tr>'+this.controls.note.labelled('note','ta24')+'</tr>';
				let left = '<td style="vertical-align:top;"><table class="coords">'+name+code+price+deposit+tag+note+'</table></td>';
			let identification = '<div><table>'+left+right+'</table></div>';

						let tags = '<tr>'+this.controls.tags.labelled('tags','','blueprint wk tags')+'</tr>'; // see (*wk01*)
					tags = '<td colspan="2" style="vertical-align:top;"><table>'+tags+'</table></td>';
				tags = '<table style="margin:1em auto;">'+tags+'</table>';
			let pushtags = '<div id="'+this.eids.own.wraps.tags+'" style="display:none;">'+tags+'</div>';

			// colors and patterns
							let hascolors = this.controls.color.hasany();
							let haspattern = this.controls.pattern.hasany();
						let color = hascolors?'<tr>'+this.controls.color.labelled('color', 'alpha10')+'</tr>':'<tr><td></td><td></td></tr>';
						let pattern = haspattern?'<tr>'+this.controls.pattern.labelled('status', 'alpha10')+'</tr>':'<tr><td></td><td></td></tr>';
					let ccss = '<table class="" style="border-spacing: 0px 10px; border-collapse:separate; border-top:none;">'+color+pattern+'</table>';
						let bp = C_XL.w('blueprint wk ccss');
					let blueprint = '<div style="display:inline-block; padding:10px 0 0 2em;" class="blueprint">'+bp+'</div>';
				let ccsstable = '<table><tr><td style="padding-left:5em;">'+ccss+'</td><td style="vertical-align:top;">'+blueprint+'</td></table>';
				
			let pushcolors = '<div>'+ccsstable+'</div>';
			
		let tab0 = this.controls.tabs.container(0, identification+pushtags+pushcolors);

		// experts
		let experts = '<td style="vertical-align:top;">'+this.controls.experts.display('textcolor-light')+'</td>';
		let expertsbp = '<td class="blueprint" style="vertical-align:top; padding:.6em 2em 0 2em; max-width:320px; min-width:220px;">'+C_XL.w('wkcd_blueprint experts')+'</td>';
		let divexperts = '<div><table class="staff-layout"><tr>'+expertsbp+experts+'</tr></table></div>';
		let tab1 = this.controls.tabs.container(1, divexperts);
		this.controls.tabs.hide(1, mobminder.account.single);
		
		// timeboxing
		let tboxing = '<td style="vertical-align:top;">'+this.controls.tboxing.display()+'</td>';
		let tboxingbp = '<td class="blueprint" style="vertical-align:top; padding:.6em 2em 0 2em; max-width:320px; min-width:220px;">'+C_XL.w('wkcd_blueprint timeboxes')+'</td>';
		let divtboxing = '<div><table style="margin:0 auto;"><tr>'+tboxingbp+tboxing+'</tr></table></div>';
		let tab2 = this.controls.tabs.container(2, divtboxing);
		this.controls.tabs.hide(2, !mobminder.account.has.timeboxing);
		
			let trpaddy = 'style="border-bottom:1em solid transparent;"';
		
		// communication (to visitors and secretary)
			let note_s = '<tr>'+this.controls.note_s.labelled('note_secr','ta32', {tip:'note_secr_tip', xl:true})+'</tr>'; // when at least one guideline exists in this account setup
			let note_c = '<tr>'+this.controls.note_c.labelled('note_comm','ta32', {tip:'note_comm_tip', xl:true})+'</tr>'; // when at least one sms or email exists in this account setup
			let note_w = !this.dS.ereservable?'':'<tr>'+this.controls.note_w.labelled('note_webp','ta32', {tip:'note_webp_tip', xl:true})+'</tr>'; // when at least one webpage exists in this account setup
		let divcomms = '<div style="padding-top:1em;"><table>'+note_w+note_c+note_s+'</table></div>';
		let tab4 = this.controls.tabs.container(3, divcomms);
		this.controls.tabs.hide(3, false);
		
		// web page options and alternative languages
				let padding = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
				
				let lang1 = '<tr '+trpaddy+'>'+this.controls.lang1.labelled('alt message in', 'alpha10')+'</tr>';
				let name1 = '<tr '+trpaddy+'>'+this.controls.name1.labelled('name', 'alpha32')+'</tr>';
				let note1 = !this.dS.ereservable?'':'<tr id="'+this.eids.own.langwrap1a+'">'+this.controls.note1.labelled('note_webp', 'ta32', {tip:'note_webp_tip', xl:true})+'</tr>';
				let comm1 = '<tr id="'+this.eids.own.langwrap1b+'">'+this.controls.comm1.labelled('note_comm', 'ta32', {tip:'note_comm_tip', xl:true})+'</tr>';
				
				let lang2 = '<tr '+trpaddy+'>'+this.controls.lang2.labelled('alt message in', 'alpha10')+'</tr>';
				let name2 = '<tr '+trpaddy+'>'+this.controls.name2.labelled('name', 'alpha32')+'</tr>';
				let note2 = !this.dS.ereservable?'':'<tr id="'+this.eids.own.langwrap2a+'">'+this.controls.note2.labelled('note_webp', 'ta32', {tip:'note_webp_tip', xl:true})+'</tr>';
				let comm2 = '<tr id="'+this.eids.own.langwrap2b+'">'+this.controls.comm2.labelled('note_comm', 'ta32', {tip:'note_comm_tip', xl:true})+'</tr>';
			
			let compiling = '<table style="display:inline-block;">'+lang1+name1+note1+comm1+padding+lang2+name2+note2+comm2+'</table>';
				compiling = '<div style="padding-top:1em;">'+compiling+'</div>';
		let tab3 = this.controls.tabs.container(4, compiling);
		// this.controls.tabs.hide(4, !this.dS.ereservable); // instead we also 

		
		// audit
		let tab99 = this.controls.tabs.container(99, this.dS.tracking());
				
		return tab0+tab1+tab2+tab3+tab4+tab99;
	},
	activate: function() {
		this.controls.activate('M_WRKCD');
		this.elements.collect(this.eids.own);
		this.onlang(this.controls.name1, this.dS.altLanguage1);
		this.onlang(this.controls.name2, this.dS.altLanguage2);
		this.hideccss();
		this.oncolorselect(this.dS.cssColor);
		this.onpatternselect(this.dS.cssPattern);
		if(vbs) vlog('modals.js','M_WRKCD','activate','eid:'+this.eids.id);
	},
	
	// private
	title: function() {
		let name = this.controls.name.value(), tagcode = this.controls.tag.value();
		if(this.dS.id <= 0 && name == '') name = C_XL.w('workcode')+': '+C_XL.w('new');
		let tag = '';
		if(tagcode) tag = '<div class="fa fa-13x '+C_iSKIN.tagcss(tagcode)+'" style="padding-left:.6em; min-width:1.4em;"></div>';
		const title = name+tag;
		return title;
	},
	hideccss: function() {
		let anytag = this.controls.tags.hasany();
		if(vbs) vlog('modals.js','M_WRKCD','staff','anytag:'+anytag);
		if(anytag) $(this.elements.wraps.tags).show(); else $(this.elements.wraps.tags).hide();
		return this;
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:'id', name:'name', code:'code', price:'price', deposit:'deposit', color:'cssColor', pattern:'cssPattern', tag:'tag', tags:'tags'
				, note:'note', note_s:'secretarynote', note_c:'communicnote', note_w:'webpagenote', eres:{ereservable:'ereservable'}, duration:'duration'
				, experts:{ bCals:'bCals', uCals:'uCals', fCals:'fCals', size:'staffing' }, tboxing:'tboxing'
				, name1:'altName1', name2:'altName2', note1:'altwebpagenote1', note2:'altwebpagenote2', comm1:'altcommunicnote1', comm2:'altcommunicnote2', lang1:'altLanguage1', lang2:'altLanguage2'
				};
		mobminder.app.post(this.controls, names, './post/workcode.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		
		// if(this.dS.id>0) C_dS_workcode.del(this.dS.id);
		C_dS_workcode.del(this.dS.id); // cleans up virtuals as well as actual stuff
		
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:'id'};
		mobminder.app.post(this.controls, names, './delete/workcode.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		if(this.dS.id>0) C_dS_workcode.del(this.dS.id);
	},
	quit: function(options) { 
		this.modal.close(options);
		if(this.dS.id<=0) C_dS_workcode.del(this.dS.id); // case of a workcode under creation (id<=0), we want to clean up the C_dS_workexpert registery
	},
	escape: function() { 
		if(this.dS.id<=0) C_dS_workcode.del(this.dS.id); 
		return true;
	},
	duplicate: function() {
		this.quit({slow:1000});
		if(this.callbacks.duplicate) this.callbacks.duplicate.cb();
	},
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_WRKCD','staff','typechanged:'+typechanged);
	},  
	msgfocus: function(field) {  }, // field is the control that got the focus (C_iFIELD);
	onlang: function(field, which) { 
		let newlanguage = which;
		let label = 'name';
		if(newlanguage != 255) label = which+'-version';
		field.setlabel(label); // field is the control identified here (*wk10*), it provides access to this.controls.name1 or this.controls.name2 of C_iFIELD
		
		if(newlanguage == 255)
			switch(field.state.nickname) {
				case 'name1': $(this.elements.langwrap1a).hide(); $(this.elements.langwrap1b).hide(); break;
				case 'name2': $(this.elements.langwrap2a).hide(); $(this.elements.langwrap2b).hide(); break;
			}
		else 
			switch(field.state.nickname) {
				case 'name1': $(this.elements.langwrap1a).show(); $(this.elements.langwrap1b).show(); break;
				case 'name2': $(this.elements.langwrap2a).show(); $(this.elements.langwrap2b).show(); break;
			}
	},
	oncolorselect: function(cssid) {
		
		// this.dS.cssColor = cssid;
		if(cssid==0) // the default color was selected
			this.modal.setmborder(0);
			
			const dS_customCss = C_dS_customCss.get(cssid);
		const ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		const cclass = dS_customCss.resaClass;
		const ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_WRKCD', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		// this.dS.cssPattern = cssid;
		if(cssid==0) // the default color was selected
			this.modal.setmpattern(0);
			
			const dS_customCss = C_dS_customCss.get(cssid);
		const pcode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		const cclass = dS_customCss.resaClass;
		const ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_WRKCD', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	ontagselect: function(tcode) {
		setTimeout( () => { this.elements.h1.innerHTML = this.title(); }, 500 );
		if(vbs) vlog('modals.js', 'M_RESC', 'ontagselect', 'tcode:'+tcode);
	},
	nametyping: function(digits) {
		this.elements.h1.innerHTML = this.title();
	},

	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dataset = inlineDataSets['C_dS_workcode'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
		mobminder.account.has.workcodes = C_dS_workcode.has();
		this.quit();
	},	
	deleted: function() {
		mobminder.account.has.workcodes = C_dS_workcode.has();
		this.quit();
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dS);
	},
	failed: function() { 
		this.modal.busy(false);
	}
}
M_WRKCD.options = function(eid, ereservable) {
	this.picker = new C_iCRESTA(eid, {}, { labels:C_XL.w({ereservable:'e-reservable'}), presets:{ereservable:!!ereservable} }, { skin:1, mode:0, title:false } );
	this.activate = function() { return this.picker.activate() };
	this.display = function() { return this.picker.display(); };
	this.getpost = function() { return this.picker.setting(); };
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    P R O D U C T S    &    S T O C K T A K I N G S 
//


function M_PRODUCT(dataSet, callbacks) { // Products -> they turn into goods (DB table) when used on appointments
	this.dS = dataSet; // expects a C_dS_product
	this.callbacks = callbacks || {}; // like { saved:, deleted: }
	const b = 'prdct'+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', duplicate:b+'duplic'
		, name:b+'name', code:b+'code', price:b+'price', deposit:b+'depst', color:b+'color', pattern:b+'patt', tag:b+'tag', tags:b+'tags'
		, note:b+'note', secretarynote:b+'snote', webpagenote:b+'wnote', commsnote:b+'cnote'
		
		, lang1:b+'lang1', lang2:b+'lang2', note1:b+'note1', note2:b+'note2', comm1:b+'comm1', comm2:b+'comm2', name1:b+'name1', name2:b+'name2'
		, eres:b+'eres', stocktakings:b+'sttng'
		, experts:b+'exp'
		, own: { langwrap1a: b+'lwrp_1a', langwrap1b: b+'lwrp_1b', langwrap2a: b+'lwrp_2a', langwrap2b: b+'lwrp_2b', stockremain:b+'stkrmn'
				, wraps: { tags:b+'wtags', h1:b+'h1' }
			}
	};
	this.elements = new A_el();
	
			const permitted = permissions.may(pc.ch_wrkc);
		const mayremove = (this.dS.id>0) && permitted;
		const maysave = permitted;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );
	
	const duplicate 	= new C_iCLIK(this.eids.duplicate, { click:new A_cb(this, this.duplicate) }
		, { enabled:true, tip:C_XL.w('tip duplicate'), css:'modal-button fa fa-gray fa-copy touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.d /*d like duplicate*/] });

	const id			= new C_iPASS(this.dS.id);
	
		const ntyping = new A_cb(this, this.nametyping, null, null, 700);
	const name 		= new C_iFIELD(this.eids.name, { onfchange:ntyping }, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') });
	const code 		= new C_iFIELD(this.eids.code, false, { digits:this.dS.code, type:INPUT_TEXT, mandatory:false, focus:false });
	
	const price 		= new C_iFIELD(this.eids.price, false, { digits:this.dS.price, type:INPUT_PRICE, mandatory:false, focus:false, units:C_XL.w('euros'), min:100 });
	const deposit 	= new C_iFIELD(this.eids.deposit, false, { digits:this.dS.deposit, type:INPUT_PRICE, mandatory:false, focus:false, units:C_XL.w('euros'), min:100 });
	
	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:class_product, csstype:ccsstype.color, value:this.dS.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:class_product, csstype:ccsstype.pattern, value:this.dS.cssPattern, enabled:true } /*preset*/ );
	const tag			= new C_iSKIN(this.eids.tag, { select:new A_cb(this, this.ontagselect) }, { type:skin.prdtag, value:this.dS.tag, allownone:true, css:'tagbig' } /*preset*/ );
	const tags		= new C_iCSS(this.eids.tags, {}, { cssclass:class_product, csstype:ccsstype.tag, value:this.dS.tags, enabled:true } /*preset*/ ); // see (*wk01*)

	const note 		= new C_iNOTE(this.eids.note, this.dS.note, {rows:5});
	const note_s 		= new C_iNOTE(this.eids.secretarynote, this.dS.secretarynote, {rows:4});
	const note_w		= new C_iNOTE(this.eids.webpagenote, this.dS.webpagenote, {rows:4, type:INPUT_ML_HTML});
	const note_c		= new C_iNOTE(this.eids.commsnote, this.dS.communicnote, {rows:4, type:INPUT_ML_HTML});
	
	const eres 		= new M_PRODUCT.options(this.eids.eres, this.dS.ereservable);

	const stocktakings = new C_iPLUS(this.eids.stocktakings, { select:new A_cb(this, this.onstock) }, { plusclass:new C_dS_stocktaking.plus({productId:this.dS.id}), twocolumns:12, reversed:true });
	
		// let precheck = (this.dS.id <= 0) ? true : this.dS.resources(); // true will check everything
			const resources = this.dS.resources();
		const precheck = (!resources) ? true : resources; // true will check everything
	const experts 	= new C_iSTAFF(this.eids.experts, 'staffing', new A_cb(this,this.staff), precheck, { size:this.dS.staffing });
	

	// message
		let msgfocus = new A_cb(this, this.msgfocus);
		
	const name1 	= new C_iFIELD(this.eids.name1, false, { digits:this.dS.altName1, type:INPUT_TEXT, mandatory:false, focus:false, nickname:'name1' }); // (*wk10*)
	const name2 	= new C_iFIELD(this.eids.name2, false, { digits:this.dS.altName2, type:INPUT_TEXT, mandatory:false, focus:false, nickname:'name2' });
	
	const note1 	= new C_iNOTE(this.eids.note1, this.dS.altwebpagenote1, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	const note2 	= new C_iNOTE(this.eids.note2, this.dS.altwebpagenote2, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	
	const comm1 	= new C_iNOTE(this.eids.comm1, this.dS.altcommunicnote1, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });
	const comm2 	= new C_iNOTE(this.eids.comm2, this.dS.altcommunicnote2, { rows:4, type:INPUT_ML_HTML }, { onffocus:msgfocus });

		
	const lang1	= new C_iSPEAK(this.eids.lang1, { onselect:new A_cb(this, this.onlang, name1 /* (*wk10*) */) }, { value:this.dS.altLanguage1, maynone:true, language:mobminder.context.surfer.language } );
	const lang2	= new C_iSPEAK(this.eids.lang2, { onselect:new A_cb(this, this.onlang, name2) }, { value:this.dS.altLanguage2, maynone:true, language:mobminder.context.surfer.language } );
	
		const tabscaptions = C_XL.w({0:'identification', 1:'experts', 3:'communication', 4:'languages', 11:'stocktakings', 99:'audit'});
		tabscaptions[99] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, duplicate:duplicate, name:name, code:code, price:price, deposit:deposit, color:color
				, pattern:pattern, tag:tag, tags:tags, note:note, note_s:note_s, note_c:note_c, note_w:note_w
				, name1:name1, name2:name2, note1:note1, note2:note2, comm1:comm1, comm2:comm2, lang1:lang1, lang2:lang2
				, eres:eres, stocktakings:stocktakings, experts:experts } );
				
			const tilt = this.dS.id <= 0 ? -100 : 0;
		const position = { style:'', offset:{x:tilt, y:tilt}};
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { position:position, size:{x:740}, moves:true, morecss: { outlet:'M_PRODUCT' } } );
	
	if(vbs) vlog('modals.js','M_PRODUCT','constructor','eid:'+this.eids.id+', name:'+this.dS.name);
	this.activate();
	
	if(this.dS.id>0) { // fetch info about existing stocktakings
		
		mobminder.app.post(this.controls, {id:'prdid'}, './queries/stocktakings.php', new A_cb(this,this.stocktakings), new A_cb(this,this.stocktakingsfailed));
	}

}
M_PRODUCT.prototype = {
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
				let maycopy = this.dS.id>0;	let permitted = permissions.may(pc.ch_wrkc);

				let duplicate = (maycopy&&permitted) ?'<td class="cartouche" style="padding-left:2em;">'+this.controls.duplicate.display()+'</td>':'';
			let title = '<td class="mheader"><h1 id="'+this.eids.own.wraps.h1+'" class="modal-product">'+this.title()+'</h1></td>';
			let header = '<tr>'+buttons+duplicate+title+'</tr>';
				let stock = '<div id="'+this.eids.own.stockremain+'" class="deltarea f-lato mindertext" style="font-weight:bold; bottom:30px; left:0px; opacity:.4;">'+'000'+'</div>';
			let stockremain = '<tr><td colspan=3 class="">'+stock+'</td></tr>';
		let divHeader = '<div class="buttons airplus"><table style="width:100%;" summary="header layout">'+header+stockremain+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-product')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// identification left side
					let eres 		= '<div>'+this.controls.eres.display('textcolor-light')+'</div>';
				let right = '<td style="vertical-align:top; padding:1em 0em 0em 2em;">'+eres+'</td>';
						
					let name = '<tr>'+this.controls.name.labelled('product name', 'alpha24')+'</tr>';
					let code = '<tr>'+this.controls.code.labelled('code')+'</tr>';
						let price = '<tr>'+this.controls.price.labelled('price', 'alpha06')+'</tr>';
						let deposit = '<tr>'+this.controls.deposit.labelled('deposit', 'alpha06')+'</tr>';


								let hascolors = this.controls.color.hasany();
								let haspattern = this.controls.pattern.hasany();
							let color = hascolors?'<tr>'+this.controls.color.labelled('color', 'alpha10')+'</tr>':'<tr><td></td><td></td></tr>';
							let pattern = haspattern?'<tr>'+this.controls.pattern.labelled('status', 'alpha10')+'</tr>':'<tr><td></td><td></td></tr>';
						let ccss = '<td style="padding-left:2em;">'+'<table class="coords">'+color+pattern+'</table>'+'</td>';
						let innertagtbl = '<table style="margin-left:auto; margin-right:0;">'+'<tr>'+'<td>'+this.controls.tag.labelled('tag')+'</td>'+ccss+'</tr>'+'</table>';
					let tag = '<tr><td></td><td>'+innertagtbl+'</td>'+'</tr>';
					let note = '<tr>'+this.controls.note.labelled('note','ta24')+'</tr>';
				let left = '<td style="vertical-align:top;"><table class="coords" style="margin-bottom:0;">'+name+code+price+deposit+tag+note+'</table></td>';
			let identification = '<div><table summary="identification" style="margin:0 auto;">'+'<tr>'+left+right+'</tr>'+'</table></div>';

						let tags = '<tr>'+this.controls.tags.labelled('tags','','blueprint prd tags')+'</tr>'; // see (*wk01*)
					tags = '<td colspan="2" style="vertical-align:top;"><table>'+tags+'</table></td>';
				tags = '<table summary="pushtags" style="margin:1em auto;">'+tags+'</table>';
			let pushtags = '<div id="'+this.eids.own.wraps.tags+'" style="display:none;">'+tags+'</div>';

			// colors and patterns
			
		let tab0 = this.controls.tabs.container(0, identification+pushtags);

		// experts
		let experts = '<td>'+this.controls.experts.display('textcolor-light')+'</td>';
		let divexperts = '<div style="min-height:10em;"><table class="staff-layout" summary="staff layout">'+experts+'</table></div>';
		let tab1 = this.controls.tabs.container(1, divexperts);
		this.controls.tabs.hide(1, mobminder.account.single);
		
		
			let trpaddy = 'style="border-bottom:1em solid transparent;"'
		
		// communication (to visitors and secretary)
			let note_s = '<tr>'+this.controls.note_s.labelled('note_secr','ta32', {tip:'prdct_note_secr_tip', xl:true})+'</tr>'; // when at least one guideline exists in this account setup
			let note_c = '<tr>'+this.controls.note_c.labelled('note_comm','ta32', {tip:'prdct_note_comm_tip', xl:true})+'</tr>'; // when at least one sms or email exists in this account setup
			let note_w = !this.dS.ereservable?'':'<tr>'+this.controls.note_w.labelled('note_webp','ta32', {tip:'prdct_note_webp_tip', xl:true})+'</tr>'; // when at least one webpage exists in this account setup
		let divcomms = '<div style="padding-top:1em;"><table summary="communication">'+note_w+note_c+note_s+'</table></div>';
		let tab4 = this.controls.tabs.container(3, divcomms);
		this.controls.tabs.hide(3, false);
		
		// web page options and alternative languages
				let padding = '<tr>'+'<td>&nbsp;</td><td>&nbsp;</td>'+'</tr>';
				
				let lang1 = '<tr '+trpaddy+'>'+this.controls.lang1.labelled('alt message in', 'alpha10')+'</tr>';
				let name1 = '<tr '+trpaddy+'>'+this.controls.name1.labelled('name', 'alpha32')+'</tr>';
				let note1 = !this.dS.ereservable?'':'<tr id="'+this.eids.own.langwrap1a+'">'+this.controls.note1.labelled('note_webp', 'ta32', {tip:'prdct_note_webp_tip', xl:true})+'</tr>';
				let comm1 = '<tr id="'+this.eids.own.langwrap1b+'">'+this.controls.comm1.labelled('note_comm', 'ta32', {tip:'prdct_note_comm_tip', xl:true})+'</tr>';
				
				let lang2 = '<tr '+trpaddy+'>'+this.controls.lang2.labelled('alt message in', 'alpha10')+'</tr>';
				let name2 = '<tr '+trpaddy+'>'+this.controls.name2.labelled('name', 'alpha32')+'</tr>';
				let note2 = !this.dS.ereservable?'':'<tr id="'+this.eids.own.langwrap2a+'">'+this.controls.note2.labelled('note_webp', 'ta32', {tip:'prdct_note_webp_tip', xl:true})+'</tr>';
				let comm2 = '<tr id="'+this.eids.own.langwrap2b+'">'+this.controls.comm2.labelled('note_comm', 'ta32', {tip:'prdct_note_comm_tip', xl:true})+'</tr>';
			
			let compiling = '<table summary="web language" style="display:inline-block;" summary="languages">'+lang1+name1+note1+comm1+padding+lang2+name2+note2+comm2+'</table>';
				compiling = '<div style="padding-top:1em;">'+compiling+'</div>';
		let tab3 = this.controls.tabs.container(4, compiling);
		// this.controls.tabs.hide(4, !this.dS.ereservable); // instead we also 

		// stocktakings
				let plustock = '<table class="centered"><tr>'+this.controls.stocktakings.prefixed(C_XL.w('stocktakings'))+'</tr></table>';
			let stocktakings = '<div style="padding:1em; min-height:10em;">'+plustock+'</div>';
		let tab11 = this.controls.tabs.container(11, stocktakings);
		this.controls.tabs.hide(11, this.dS.id <= 0); // items under creation can not have stocktakings already
		
		// audit
		let tab99 = this.controls.tabs.container(99, this.dS.tracking());
				
		return tab0+tab1+tab3+tab4+tab11+tab99;
	},
	activate: function() {
		this.controls.activate('M_PRODUCT');
		this.elements.collect(this.eids.own);
		this.onlang(this.controls.name1, this.dS.altLanguage1);
		this.onlang(this.controls.name2, this.dS.altLanguage2);
		this.hideccss();
		this.setnumberof();
		this.oncolorselect(this.dS.cssColor);
		this.onpatternselect(this.dS.cssPattern);
		if(vbs) vlog('modals.js','M_PRODUCT','activate','eid:'+this.eids.id);
	},
	
	// private
	title: function() {
		let name = this.controls.name.value(), tagcode = this.controls.tag.value();
		if(this.dS.id <= 0 && name == '') name = C_XL.w('new product');
		let tag = '';
		if(tagcode) tag = '<div class="fa fa-13x '+C_iSKIN.tagcss(tagcode)+'" style="padding-left:.6em; min-width:1.4em;"></div>';
		const title = name+tag;
		return title;
	},
	hideccss: function() {
		let anytag = this.controls.tags.hasany();
		if(vbs) vlog('modals.js','M_PRODUCT','staff','anytag:'+anytag);
		if(anytag) $(this.elements.wraps.tags).show(); else $(this.elements.wraps.tags).hide();
		return this;
	},
	setnumberof: function() {
		let numberof = this.dS.stockremain; 
		let calculate = '<div style="margin-left:.6em;" class="fad fa-calculator fa-15x"></div>';
		let stockremain = '<div style="display:inline-block; padding-left:.4em; font-size:1.8em;">'+numberof+'</div>';
		this.elements.stockremain.innerHTML = calculate+stockremain;
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:'id', name:'name', code:'code', price:'price', deposit:'deposit', color:'cssColor', pattern:'cssPattern', tag:'tag', tags:'tags'
				, note:'note', note_s:'secretarynote', note_c:'communicnote', note_w:'webpagenote', eres:{ereservable:'ereservable'}, stockremain:'stockremain'
				, experts:{ bCals:'bCals', uCals:'uCals', fCals:'fCals', size:'staffing' }
				, name1:'altName1', name2:'altName2', note1:'altwebpagenote1', note2:'altwebpagenote2', comm1:'altcommunicnote1', comm2:'altcommunicnote2', lang1:'altLanguage1', lang2:'altLanguage2'
				};
		mobminder.app.post(this.controls, names, './post/product.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		
		// if(this.dS.id>0) C_dS_product.del(this.dS.id);
		C_dS_product.del(this.dS.id); // cleans up virtuals as well as actual stuff
		
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:'id'};
		mobminder.app.post(this.controls, names, './delete/product.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		if(this.dS.id>0) C_dS_product.del(this.dS.id);
	},
	quit: function(options) { 
		this.modal.close(options);
		if(this.dS.id<=0) C_dS_product.del(this.dS.id); // case of a product under creation (id<=0), we want to clean up the C_dS_workexpert registery
	},
	escape: function() { 
		if(this.dS.id<=0) C_dS_product.del(this.dS.id); 
		return true;
	},
	duplicate: function() {
		this.quit({slow:1000});
		if(this.callbacks.duplicate) this.callbacks.duplicate.cb();
	},
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_PRODUCT','staff','typechanged:'+typechanged);
	},  
	msgfocus: function(field) {  }, // field is the control that got the focus (C_iFIELD);
	onlang: function(field, which) { 
		let newlanguage = which;
		let label = 'name';
		if(newlanguage != 255) label = which+'-version';
		field.setlabel(label); // field is the control identified here (*wk10*), it provides access to this.controls.name1 or this.controls.name2 of C_iFIELD
		
		if(newlanguage == 255)
			switch(field.state.nickname) {
				case 'name1': $(this.elements.langwrap1a).hide(); $(this.elements.langwrap1b).hide(); break;
				case 'name2': $(this.elements.langwrap2a).hide(); $(this.elements.langwrap2b).hide(); break;
			}
		else 
			switch(field.state.nickname) {
				case 'name1': $(this.elements.langwrap1a).show(); $(this.elements.langwrap1b).show(); break;
				case 'name2': $(this.elements.langwrap2a).show(); $(this.elements.langwrap2b).show(); break;
			}
	},
	oncolorselect: function(cssid) {
		
		this.dS.cssColor = cssid;
		if(cssid==0) // the default color was selected
			this.modal.setmborder(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_PRODUCT', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		this.dS.cssPattern = cssid;
		if(cssid==0) // the default color was selected
			this.modal.setmpattern(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_PRODUCT', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	ontagselect: function(tcode) {
		setTimeout( () => { this.elements.wraps.h1.innerHTML = this.title(); }, 500 );
		if(vbs) vlog('modals.js', 'M_RESC', 'ontagselect', 'tcode:'+tcode);
	},
	nametyping: function(digits) {
		this.elements.wraps.h1.innerHTML = this.title();
	},
	onstock: function(dS_stocktaking) {
		dS_stocktaking.groupId = this.dS.id;
		// if(permissions.may(pc.ch_stocktakings)) 
			new M_STOCKTAKING(dS_stocktaking, { saved:new A_cb(this, this.stocktakingsaved), removed:new A_cb(this, this.stocktakingremoved) }, { tab:0 } );
			
		return;
	},

	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dataset = inlineDataSets['C_dS_product'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
		mobminder.account.has.products = C_dS_product.has();
		this.quit();
	},	
	deleted: function() {
		mobminder.account.has.products = C_dS_product.has();
		this.quit();
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dS);
	},
	failed: function() { 
		this.modal.busy(false);
	},
	stocktakingsaved: function(dS_stocktaking) {
		this.dS.stockremain = this.dS.stockremain + dS_stocktaking.delta; if(this.dS.stockremain<0) this.dS.stockremain = 0;
		this.controls.stocktakings.refresh();
		this.setnumberof();
	},
	stocktakingremoved: function(dS_product) {
		this.dS.stockremain = dS_product.stockremain;
		this.controls.stocktakings.refresh();
		this.setnumberof();
	},
	stocktakings: function(inlineDataSets) { // sets up stock takings list (for stocktakings tab)
		let dataSets = inlineDataSets['C_dS_stocktaking'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; };
		this.controls.stocktakings.refresh();
	},
	stocktakingsfailed: function() {
		
	}
}
M_PRODUCT.options = function(eid, ereservable) {
	this.picker = new C_iCRESTA(eid, {}, { labels:C_XL.w({ereservable:'e-reservable'}), presets:{ereservable:!!ereservable} }, { skin:1, mode:0, title:false } );
	this.activate = function() { return this.picker.activate() };
	this.display = function() { return this.picker.display(); };
	this.getpost = function() { return this.picker.setting(); };
}



function M_STOCKTAKING(dataSet, callbacks, preset) { // custom CSS
	preset = preset || {};
	this.dS = dataSet; // that is a C_dS_stocktaking
	this.dS_product = C_dS_product.get(this.dS.groupId); // C_dS_stocktaking's group to C_dS_stocktaking
if(vbs) vlog('modals.js','M_STOCKTAKING','constructor','id='+this.dS.id+', date='+this.dS.created);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'sttt'+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', numberof:b+'nbrf', tobeadded:b+'tbadd', addmore:b+'addmr', substract:b+'retrv', note:b+'note'
			, own:{ delta:b+'delta', moving:b+'moving'}
	};
	this.elements = new A_el();
	
		const mayremove = (this.dS.id>0) && this.dS.youarelast; // Only the latest created stocktaking may be removed (otherwise, the history of stocktakings will be screwed up)
		const maysave = this.dS.id<=0;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );

	const pass		= new C_iPASS({id:this.dS.id, delta:this.dS.delta, movingtotal:this.dS.movingtotal, productId:this.dS_product.id});
	
		// note: the user can choose to write a new flat number of items as counted from the stock
		//			OR he can add some quantities, like 3 x 100 items when eg. 3 new boxes were delivered
		
	const numberof 	= new C_iFIELD(this.eids.numberof, { onfchange:new A_cb(this, this.onnumber, null, null, 400) }, { digits:this.dS_product.stockremain.toString(), type:INPUT_NUMER, mandatory:true, focus:true, placeholder:'150' }); 
	
	const addmore 	= new C_iCLIK(this.eids.addmore, { click:new A_cb(this, this.add)}, { tag:'div', ui:C_XL.w('sttk more'), style:'' } );
	
		const zero = 0;
	const tobeadded 	= new C_iFIELD(this.eids.tobeadded, false, { digits:zero.toString(), type:INPUT_NUMER, mandatory:false, focus:false, placeholder:'100' }); 
	const substract 	= new C_iCLIK(this.eids.substract, { click:new A_cb(this, this.substract)}, { tag:'div', ui:C_XL.w('sttk less'), style:'' } );

	const note 		= new C_iNOTE(this.eids.note, this.dS.takingnote, {rows:6} ); 
	
		const tabscaptions = C_XL.w({ 0:'stocktaking', 1:'audit' });
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls = new A_ct( { pass:pass, cartouche:cartouche, tabs:tabs, numberof:numberof, addmore:addmore, tobeadded:tobeadded, substract:substract, note:note } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:600}, moves:true } );
	this.activate();
}
M_STOCKTAKING.prototype = {
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-stocktaking">'+this.title()+'</h1></td>';
		let headertr = '<tr>'+buttons+title+'</tr>';
			let delta = '<div id="'+this.eids.own.delta+'" class="deltarea f-lato mobtext" style="font-weight:bold; bottom:0px; left:0px; opacity:.6;">'+'000'+'</div>';
			let movingtotal = '<div id="'+this.eids.own.moving+'" class="deltarea f-lato mindertext" style="font-weight:bold; bottom:2px; right:10px; opacity:.6;">'+'000'+'</div>';
		let deltatr = '<tr><td colspan=2 class="">'+delta+movingtotal+'</td></tr>';
		let divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+headertr+deltatr+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		let numberof = '';
		let morecombo = '';
		if(this.dS.id<=0) { // the user may not change any past stocktaking, only the last one can be edited or deleted
		
				let nbrofbp = C_XL.w('sttck_numberof');
			numberof = '<tr>'+this.controls.numberof.labelled('sttk numberof','alpha06')+'<td class="blueprint" style="width:80%; padding:.4em .8em;">'+nbrofbp+'</td></tr>';
			
				let mrlssbp = C_XL.w('sttck_moreorless');
					let more = this.controls.addmore.display('button button-stocktaking alpha10');
					let howmuch = '<div style="margin:auto auto 0 auto; text-align:center;">'+this.controls.tobeadded.display('alpha04')+'</div>';
					let less = this.controls.substract.display('button button-stocktaking alpha10');
				let moretable = '<div style="display:flex; width:100%;margin-top:1em;">'+less+howmuch+more+'</div>';
			morecombo = '<tr><td></td><td colspan=2>'+moretable+'</td></tr>';
			morecombo = morecombo+'<tr><td></td><td colspan=2 class="blueprint">'+mrlssbp+'</td></tr>';
		}
		
		let note = '<tr>'+this.controls.note.labelled('note', 'ta28')+'</tr>';
		
		let layout = '<table summary="stocktaking" class="stocktaking-layout" style="margin:0 auto; max-width:520px;">'+numberof+morecombo+'</table>';
			layout = layout+'<table summary="stocktaking" class="stocktaking-layout" style="margin:2em auto 0em auto;">'+note+'</table>';
		let tab0 = this.controls.tabs.container(0, layout);		
		
		let tab1 = this.controls.tabs.container(1, this.dS.tracking());
		
		return tab0+tab1;
		
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('M_STOCKTAKING');
		this.setdelta().setmovingtotal(this.dS.id<=0?this.dS_product.stockremain:this.dS.movingtotal);
	},
	
	// private
	title: function() { // inner text for the h1 modal title
		let title = C_XL.w('stocktaking');
		if(this.dS.id <= 0) title += ': '+C_XL.w('new');
		if(this.dS.deleted) title += ': '+C_XL.w('deleted');
		title += '<br/>'+this.dS_product.name;
		return title;
	},
	newdelta: function() { // calculates the new delta
		let newtotal = this.dS.movingtotal; if(this.dS.id<=0) newtotal = this.controls.numberof.value()|0;
		let priortotal = this.dS_product.stockremain|0;
		let newdelta = newtotal-priortotal; // so it is positive if items were added, neg if removed
		this.controls.pass.items.delta = newdelta;
		this.controls.pass.items.movingtotal = newtotal;
		this.setdelta().setmovingtotal(newtotal);
	},
	setdelta: function() {
		let delta = this.controls.pass.items.delta; 
				let chart = '<div style="margin-left:.6em;" class="fad fa-arrow-alt-right fa-16x fa-rotate-45"></div>'; // going up
		if(delta>0) chart = '<div style="margin-left:.6em;" class="fad fa-arrow-alt-right fa-16x fa-rotate-315"></div>';// going down
		if(delta==0) chart = '<div style="margin-left:.6em;" class="fad fa-arrow-alt-right fa-16x"></div>'; // going flat
		
		let signeddelta = delta; if(delta>0) signeddelta = '+'+delta;
		let divdelta = '<div style="display:inline-block; padding-left:.6em;">'+signeddelta+'</div>';
		this.elements.delta.innerHTML = chart+divdelta;
		return this;
	},
	setmovingtotal: function(movingtotal) {
		let calculate = '<div style="margin-left:.6em;" class="fad fa-calculator fa-12x"></div>';
			movingtotal = '<div style="display:inline-block; padding-left:.4em; font-size:1.4em;">'+movingtotal+'</div>';
		this.elements.moving.innerHTML = calculate+movingtotal;
		return this;
	},

	// events handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { pass:{ id:'id', productId:'productId', delta:'delta'}, numberof:'stockremain', note:'takingnote' };
		mobminder.app.post(this.controls, names, './post/stocktaking.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { pass:{ id:'id'}, note:'takingnote' }; // note we do not pass the delta nor numberof when deleting an tiem
		mobminder.app.post(this.controls, names, './delete/stocktaking.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
		C_dS_stocktaking.del(this.dS.id); // remove this dS locally
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },

	onnumber: function(digits) {
		this.newdelta();
	},
	add: function() {
		let current = +this.controls.numberof.value(); // + is for casting the inner string into an integer
		let addsome = +this.controls.tobeadded.value(); // + is for casting the inner string into an integer
		let newtotal = current+addsome;
		if(vbs) vlog('modals.js', 'M_STOCKTAKING', 'add', 'newtotal:'+newtotal);
		this.controls.numberof.set(newtotal); // propagates to this.onnumber() through the onfchange() callback
		return this;
	},
	substract: function() {
		let current = +this.controls.numberof.value(); // + is for casting the inner string into an integer
		let remsome = +this.controls.tobeadded.value(); // + is for casting the inner string into an integer
		let newtotal = current-remsome; if(newtotal<0) newtotal = 0;
		if(vbs) vlog('modals.js', 'M_STOCKTAKING', 'substract', 'newtotal:'+newtotal);
		this.controls.numberof.set(newtotal); // propagates to this.onnumber() through the onfchange() callback
	},
	
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		
		let dataSets = inlineDataSets['C_dS_stocktaking'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; };
		
		if(vbs) vlog('modals.js','M_STOCKTAKING','saved','id='+dataSet.id+', type:'+dataSet.cssType+', class:'+dataSet.resaClass+', default:'+isdefault);

		if(this.callbacks.saved) this.callbacks.saved.cb(dataSet); // intended to further display refresh of the plus list
		this.quit();
		
	},
	removed: function(inlineDataSets) {
		
		let dataSets = inlineDataSets['C_dS_product'];
		let dataSet; for(let id in dataSets) { dataSet = dataSets[id]; break; }; // retrieve the dataset with updated deletorId/deleted date tracking
		if(vbs) vlog('modals.js','M_STOCKTAKING','removed','id='+dataSet.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(dataSet); // which is a C_dS_product
		this.quit();
	},
	failed: function() {
		this.modal.busy(false);
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//   E - R E S E R V A T I O N     S E T T I N G S 
//


function C_iEINFO(eid, callbacks, preset) {  // e-reservation content management 
	
	let b = eid+'_einfo'+'_'; // base sub eid
	this.eids = { 
		  controls: { title:b+'ttl', url:b+'psturl', hourlies:b+'ehrly', directions:b+'edirec', link1:b+'lnk1', link2:b+'lnk2', dirlink:b+'dirlnk' }
		, own : {}
		}
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iEINFO.defaults.align(preset); // preset like { dS:mandatory dS_login }
	this.dS = preset.dS;

	let title 	= new C_iFIELD(this.eids.controls.title, false, { digits:this.dS.eresaTitle, type:INPUT_TEXT, mandatory:false, placeholder:C_XL.w('optional') });
	let url 	= new C_iFIELD(this.eids.controls.url, false, { digits:this.dS.eresaUrl, type:INPUT_TOKEN, mandatory:preset.mandatory, loginId:this.dS.id });
	
	let link1 	= new C_iURL(this.eids.controls.link1, {}, { label:this.dS.eresaLink1label, url:this.dS.eresaLink1url, placeholder:'optional' });
	let link2 	= new C_iURL(this.eids.controls.link2, {}, { label:this.dS.eresaLink2label, url:this.dS.eresaLink2url, placeholder:'optional' });

	let hourlies = new C_iNOTE(this.eids.controls.hourlies, this.dS.eresaHourlies, { rows:8, placeholder:C_XL.w('optional'), type:INPUT_ML_HTML } );
	let directions = new C_iNOTE(this.eids.controls.directions, this.dS.eresaDirections, { rows:8, placeholder:C_XL.w('optional'), type:INPUT_ML_HTML } );
	
	let dirlink = new C_iURL(this.eids.controls.dirlink, {}, { label:this.dS.eresaDirLabel, url:this.dS.eresaDirUrl, placeholder:'optional' });
	
	this.controls = new A_ct({title:title, url:url, link1:link1, link2:link2, hourlies:hourlies, directions:directions, dirlink:dirlink});
}
C_iEINFO.defaults = new A_df({  });
C_iEINFO.prototype = {
	display1: function(css) { 
		css = css || '';
		let title = this.controls.title.display('alpha40','e-title')+'<br/>&nbsp;';
		
			let tdlabel = function(l) { return '<td class="textcolor-light">'+l+'</td>'; };
			let purl = this.controls.url.labelled('e-url');
		let urls = '<table summary="e-resa url" >'+purl+'</table>'+'<br/>&nbsp;';
		
			let linkH = '<tr><td></td>'+tdlabel(C_XL.w('e-hlinklabel'))+tdlabel(C_XL.w('link url'))+'</tr>';
			let link1 = '<tr>'+tdlabel('1&nbsp;')+this.controls.link1.display()+'</tr>';
			let link2 = '<tr>'+tdlabel('2&nbsp;')+this.controls.link2.display()+'</tr>';
		let links = '<table summary="e-resa parameters" >'+linkH+link1+link2+'</table>';

		let html = title+urls+links;
		return html;
	},
	display2: function(css) { 
		css = css || '';
			let ehourlies = this.controls.hourlies.display('textcolor-light','alpha20','e-hourlies');
			let edirections = this.controls.directions.display('textcolor-light','alpha20','e-direction');
			let tr = '<tr><td>'+ehourlies+'</td><td>&nbsp;&nbsp;</td><td>'+edirections+'</td></tr>';
		let infoareas = '<table summary="hourlies and directions" style="text-align:left; vertical-align:top;">'+tr+'</table>'+'<br/>&nbsp;';
			
		let dirlink = this.controls.dirlink.labelled('e-googlemaps')+'<br/>&nbsp;';
		
		return infoareas+dirlink;
	},
	activate: function() { 
		this.elements.collect(this.eids.own);
		this.controls.activate();
	},
	getpost: function() { 
			let title 	= this.controls.title.getpost();
			let purl 	= this.controls.url.getpost(); // postfix url ( comes into agenda.mobminder.com/postfixurl that leads to the web reservation page )
			let l1 		= this.controls.link1.getpost();
			let l2 		= this.controls.link2.getpost();
			let h 		= this.controls.hourlies.getpost();
			let d 		= this.controls.directions.getpost();
			let dlnk 	= this.controls.dirlink.getpost();
		let post = { title:title, purl:purl, l1label:l1.label, l1url:l1.url, l2label:l2.label, l2url:l2.url, hourlies:h, directions:d, dirlinkLabel:dlnk.label, dirlinkUrl:dlnk.url };		
		return post;
	},
	valid: function() {
		return this.controls.validation(true /* is a sub */);
	}
}


function C_iEBOOK(eid, callbacks, preset) {  // e-reservation booking parameters 
	
	let b = eid+'_ebook'+'_'; // base sub eid
	this.eids = { 
		  controls: { max:b+'max', limit:b+'lmt', before:b+'bfr', sameday:b+'sdy'
					, sign:b+'sign', cancel:b+'cancl', auth:b+'authn', withampm:b+'wampm'
					, aggr:b+'skin', amode:b+'eaggr', rscs:b+'ersct', note:b+'enote', allownote:b+'alwn' }
		, own:{ hideaggrmode:b+'hideagg', hideRescType:b+'hidersct', hidesameday:b+'hidesday' } 
	};	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iEBOOK.defaults.align(preset); // preset like { dS:mandatory dS_login }
	this.dS = preset.dS;
	
	let limit	= new C_iDDWN(this.eids.controls.limit, {}, {labels:{ 0:C_XL.w('automatic'), 6:'6', 12:'12', 24:'24', 48:'48' }}, { value:this.dS.eresaLimit, enabled:true } );
	let before 	= new C_iBEFORE(this.eids.controls.before, {onbefore:new A_cb(this,this.before)}, { mode:'checker', maxrows:6, selection:this.dS.eresaBefore, eresa:true, soonest:'current day' } );
		
		let h = ' '+C_XL.w('hours');
	let sameday = new C_iDDWN(this.eids.controls.sameday, { onselect: new A_cb(this, this.sameday) }, { labels:{ 0:C_XL.w('no delay'), 1:'1 '+C_XL.w('hour'), 2:'2'+h, 3:'3'+h, 4:'4'+h, 5:'5'+h , 6:'6'+h }}, { value:this.dS.eresaSameday, enabled:true } );
	
	let sign	= new C_iDDWN(this.eids.controls.sign, {}, {labels:C_XL.w({ 0:'not allowed', 1:'allowed' })}, { value:this.dS.eresaSignin, enabled:true } );	
	let auth 	= new C_iDDWN(this.eids.controls.auth, {}, {labels:C_XL.w({ 0:'auth-kiosk', 1:'auth-email', 2:'auth-mobile', 3:'auth-operator' })}, { value:this.dS.eresaAuthent, enabled:true } );
	
		let cancellabels = C_XL.w({ 0:'not allowed', 1:'e-resa cancel 1h', 12:'e-resa cancel 12h', 24:'e-resa cancel 24h', 48:'e-resa cancel 48h', 72:'e-resa cancel 72h', 168:'e-resa cancel 1week' })
	let cancel	= new C_iDDWN(this.eids.controls.cancel, {}, {labels:cancellabels}, { value:this.dS.eresaCancel, enabled:true } );
	
	let aggr	= new C_iDDWN(this.eids.controls.aggr, {onselect:new A_cb(this, this.aggrswitch)}, {labels:C_XL.w({ 0:'no', 1:'yes' })}, { value:(this.dS.eresaAggregate?1:0), enabled:true } );
	let amode	= new C_iDDWN(this.eids.controls.amode, {}, {labels:C_XL.w({0:'none',1:'fill soon', 2:'fill late', 3:'fill both' }), presets:{0:{hidden:true}}}, { value:this.dS.eresaAggregate, enabled:true } );
	let max		= new C_iDDWN(this.eids.controls.max, {}, {labels:C_XL.w({ 0:'unlimited', 1:'one', 2:'two', 3:'three', 4:'four' })}, { value:this.dS.eresaMax, enabled:true } );

	let allownote 	= new C_iONOFF(this.eids.controls.allownote, {}, { state:this.dS.eresaAllowNote } );
	let withampm 	= new C_iONOFF(this.eids.controls.withampm, {}, { state:this.dS.eresaWithAMPM } );
	let note 		= new C_iNOTE(this.eids.controls.note, this.dS.eresaNote, {rows:5, type:INPUT_ML_HTML} );
	
	let blacklist	= new C_iCSS(this.eids.blacklist, {}, { cssclass:class_visitor, csstype:ccsstype.color, value:this.dS.eresaBlacklist, enabled:true } /*preset*/ );

	
		let rbitmap = this.dS.eresaRescType;
		let rlabels = {2:class_bCal}; 
			if(C_dS_resource.count(class_uCal)) rlabels[1] = class_uCal;
			if(C_dS_resource.count(class_fCal)) rlabels[4] = class_fCal;
		let rpresets = {2:{checked:!!(rbitmap&class_bCal)}, 1:{checked:!!(rbitmap&class_uCal)}, 4:{checked:!!(rbitmap&class_fCal)}};
	let rscs	= new C_iCRESTA(this.eids.controls.rscs, {}, {labels:C_XL.w(rlabels), presets:rpresets}, { mode:0, emptypost:0, postmode:'bitmap' } );
	
	this.controls = new A_ct({max:max, limit:limit, before:before, sameday:sameday, sign:sign, cancel:cancel, aggr:aggr, amode:amode, rscs:rscs, auth:auth, note:note, allownote:allownote, withampm:withampm, blacklist:blacklist });
}
C_iEBOOK.defaults = new A_df({  });
C_iEBOOK.prototype = {
	display: function(css) { 
		css = css || '';
				let paddy = '<tr>'+'<td colspan=2>&nbsp;</td>'+'</tr>';
				let step = function(s) { return '<div style="display:inline-block; min-width:1.1em; text-align:center; border: .15em solid #85A5BF; border-radius:50%; margin-right:.6em;">'+s+'</div>'; };
				let steptitle = function(s,e) { return '<h3 class="bold">'+step(s)+C_XL.w(e)+'</h3>'; }
				let stepdiv = function(t) { return '<div style="margin-left:2.5em;">'+t+'</div>'; }
		
			let s1		= steptitle(1,'identification');
			let auth 	= '<tr>'+this.controls.auth.labelled('authentication', 'alpha20')+'</tr>';
			let sign 	= '<tr>'+this.controls.sign.labelled('e-signin', 'alpha20')+'</tr>';
			let cancel 	= '<tr>'+this.controls.cancel.labelled('e-cancel', 'alpha20')+'</tr>';
			let blackl 	= this.controls.blacklist.hasany()?'<tr>'+this.controls.blacklist.labelled('e-blacklist', 'alpha10')+'</tr>':'';
		let step1 = s1+stepdiv('<table class="coords">'+auth+sign+cancel+'</table>'+'<table>'+blackl+'</table>');
		
			let s2		= steptitle(2,'search options');
			let single = (C_dS_resource.count()==1);
			let rscs = single?'':'<tr id="'+this.eids.own.hideRescType+'">'+this.controls.rscs.labelled('offer choices from')+'</tr>';
			let before = this.controls.before.display(); // is a table 
			let wampm 	= '<tr>'+this.controls.withampm.labelled('e-withAMPM', 'alpha10')+'<td style="width:90%;">&nbsp;</td></tr>';
		let step2 = s2+stepdiv('<table>'+paddy+rscs+'</table>'+before+'<table>'+wampm+'</table>');

			let s3		= steptitle(3,'availabilities');
			let sameday = '<tr id="'+this.eids.own.hidesameday+'">'+this.controls.sameday.labelled('e-sameday')+'</tr>';
			let limit 	= '<tr>'+this.controls.limit.labelled('e-limit')+'</tr>';
			let aggr 	= '<tr>'+this.controls.aggr.labelled('aggregate search')+'</tr>';
			let amode 	= '<tr id="'+this.eids.own.hideaggrmode+'">'+this.controls.amode.labelled('if day is empty', 'alpha20')+'</tr>';
		let step3 = s3+stepdiv('<table summary="e-resa step3" class="coords" >'+sameday+limit+aggr+amode+'</table>');
		
			let s4		= steptitle(4,'confirmation');
			let note 	= '<tr><td colspan=3 style="padding-bottom:1em;">'+this.controls.note.display('','alpha40','e-confirm')+'<td></tr>';
			let anote 	= '<tr>'+this.controls.allownote.labelled('e-allownote', 'alpha10')+'<td style="width:90%;">&nbsp;</td></tr>';
		let step4 = s4+stepdiv('<table summary="e-resa step4">'+note+anote+'</table>');

			let s5		= steptitle(5,'greetings');
			let max 	= '<tr>'+this.controls.max.labelled('e-max')+'</tr>';
		let step5 = s5+stepdiv('<table summary="e-resa step5">'+max+paddy+paddy+'</table>');

		return step1+step2+step3+step4+step5;
	},
	activate: function() { 
		this.elements.collect(this.eids.own);
		this.controls.activate();
		this.aggrswitch();
		this.before();
	},
	getpost: function() { 
			let auth 	= this.controls.auth.getpost();
			let max 	= this.controls.max.getpost();
			let limit 	= this.controls.limit.getpost();
			let before 	= this.controls.before.getpost();
			let sameday = this.controls.sameday.getpost();
			let sign 	= this.controls.sign.getpost();
			let cancel 	= this.controls.cancel.getpost();
			let aggr 	= this.controls.amode.getpost(); // amode is chosen on purpose!
			let rscs 	= this.controls.rscs.getpost();
			let note 	= this.controls.note.getpost();
			let anote 	= this.controls.allownote.getpost();
			let ampm 	= this.controls.withampm.getpost();
			let blackl 	= this.controls.blacklist.getpost();
		let post = { auth:auth, max:max, limit:limit, before:before, sameday:sameday, sign:sign, cancel:cancel, aggr:aggr, rscs:rscs, note:note, anote:anote, ampm:ampm, blacklist:blackl };		
		return post;
	},
	
	// private
	before: function(setting) { // setting change on this.controls.before
		// setting is an array like [ "0","3","12","15","20","40"], see C_iBEFORE.store for values definition
			let mode = (setting?setting[0]|0:undefined) || (this.controls.before.value()[0]|0); 
		if(vbs) vlog('modals.js','C_iEBOOK','before','setting:'+setting+', sameday:'+mode);
		if(mode===0) $(this.elements.hidesameday).show(); else $(this.elements.hidesameday).hide(); // only on selected "same day" option, we let this.controls.sameday appear, else we hide it
	},
	
	// event handling	
	aggrswitch: function(aggregate) {
			aggregate = (aggregate|0) || (this.controls.aggr.value()|0);
			let mode = this.controls.amode.value();
		if(vbs) vlog('modals.js','C_iEBOOK','aggrmode','aggregate:'+aggregate+', mode:'+mode);
		if(!aggregate) this.controls.amode.set(0); else if(mode==0) this.controls.amode.set(3); // when first turned on, propose option 3
		if(aggregate) $(this.elements.hideaggrmode).show(); else $(this.elements.hideaggrmode).hide();
	},
	sameday: function(setting) { 
		if(vbs) vlog('modals.js','C_iEBOOK','sameday','setting:'+setting);
	}
}


function C_iEPREV(eid, callbacks, preset) {  // e-reservation page preview 
	
	let b = eid+'_eprev'+'_'; // base sub eid
	this.eids = { 
		  controls: { titlefont:b+'fttl', textfont:b+'ftxt', imagepicker:b+'imgpkr', image:b+'img', palette:b+'pltt', ccss:b+'ccss', clogo:b+'clogo', glogo:b+'glogo' }
		, own : {
			preview:{ title:b+'e-titl', info:b+'e-info', img:b+'e-img' }
		}
	};	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iEPREV.defaults.align(preset); // preset like { dS:mandatory dS_login, keyid: mandatory }
	this.dS = preset.dS; // dS_login
	this.keyid = preset.keyid || 0;
	this.trigger=0;
	if(is.dev) this.state.relpath = '.'; // var is = {} is defined in mobframe.js
	
	let titlefont	= new C_iFONT(this.eids.controls.titlefont, { onselect:new A_cb(this, this.titlefont) }, { value:this.dS.eresaFontTitle, fonttype:fonts.title, allownone:true } /*preset*/ ); 
	let textfont	= new C_iFONT(this.eids.controls.textfont, { onselect:new A_cb(this, this.textfont) }, { value:this.dS.eresaFontText, fonttype:fonts.text, allownone:true } /*preset*/ );
	let imagepicker	= new C_iSKIN(this.eids.controls.imagepicker, { select:new A_cb(this, this.image) }, { type:skin.eresa, allownone:true } /*preset*/ ); imagepicker.state.value = this.dS.eresaSkin /* forces state to accept a '' value */;
	let customcss 	= new C_iNOTE(this.eids.controls.ccss, this.dS.eresaCcss, { rows:28, placeholder:C_XL.w('write css here'), type:INPUT_ML_CSS } );
		
		let imgstyle = 'height:12em; max-height:12em; width:35%; max-width:35%; text-align:center; vertical-align:middle; padding:0;';
	let customlogo	= new C_iCLIK(this.eids.controls.clogo, { click:new A_cb(this, this.onlogo, this.dS.id)}, { tag:'td', ui:this.getlogolabel(this.dS.id), style:imgstyle } );
	let globallogo	= new C_iCLIK(this.eids.controls.glogo, { click:new A_cb(this, this.onlogo, 'account')}, { tag:'td', ui:this.getlogolabel('account'), style:imgstyle } );
	
		let palettes = {medical:'pal-medical',zen:'pal-zen', gold:'pal-gold', blueviolet:'pal-blueviolet', bio:'pal-bio' };
	let palette	= new C_iDDWN(this.eids.controls.palette, {}, {labels:C_XL.w(palettes), presets:{0:{hidden:true}}}, { value:this.dS.eresaPalette, enabled:true } );

		let i = this.getimage();
	let image = new C_iIMG(this.eids.controls.image, {}, { path:i.path, file:i.file, size:'60%' } )
	
	this.controls = new A_ct({titlefont:titlefont, textfont:textfont, palette:palette, imagepicker:imagepicker, customcss:customcss, customlogo:customlogo, globallogo:globallogo, image:image });
}
C_iEPREV.defaults = new A_df({ relpath:'..' }); // relpath is ['.' or '..'] and leads to the right folder depending on if you are in dev or in prod
C_iEPREV.prototype = {
	display: function(css) { 
		css = css || '';
		
		// controls
		
			let titlefont = '<tr>'+this.controls.titlefont.labelled('e-titlefont')+'</tr>';
			let textfont = '<tr>'+this.controls.textfont.labelled('e-textfont')+'</tr>';
			let palette = '<tr>'+this.controls.palette.labelled('e-palette')+'</tr>';
				
			
		let fonts = '<table summary="e-resa information" style="width:80%;">'+titlefont+textfont+palette+'</table>';
			
		let custom = '';
		let wpc = C_dS_loggable.webpagecount(); // web page count
		
				let imagepicker = '<tr>'+this.controls.imagepicker.labelled('e-image','e-skin')+'<td></td>'+'</tr>';
			
				let icon = symbol('jpg', 'fa-15x', 'padding-right:.6em;');
				let glogo = this.controls.globallogo.display();
				let slogo = wpc>1?this.controls.customlogo.display():'<td></td>';
				
				let glabel = '<td class="textcolor-light">'+icon+C_XL.w('global logo')+'</td>';
				let slabel = wpc>1?'<td class="textcolor-light">'+icon+C_XL.w('specific logo')+'</td>':'<td style="width:20%;"></td>';
				
			let headers = '<tr><td></td>'+glabel+slabel+'</tr>';
			let logos = '<tr><td class="label textcolor-light">'+C_XL.w('custom logo')+'</td>'+glogo+slogo+'</tr>';
			
			let customcss = this.controls.customcss.display('label textcolor-light','wide100 smaller','e-ccss');
			
		if(mobminder.context.surfer.accessLevel>=aLevel.seller) 
			custom = '<table summary="e-resa information" style="width:100%; border-top:10px solid transparent;">'+headers+logos+imagepicker+'</table>'+customcss;
		
		// page preview
				// main info
						let infoicon = '<div style="text-align:left;" class="fa fa-2x fa-info-circle"></div>';
					let maininfo = infoicon+'<div style="text-align:center;">'+this.dS.note.htmlize()+'</div>';
				
				// eye catcher
						let buttonstyle = 'vertical-align:middle; border-radius:0.3em; color:white; background:gray; padding:0.2em 1em;';
						let iconbook = '<div style="padding-right:.6em;" class="fa fa-11x fa-search-plus"></div>';
						let iconremove = '<div style="padding-right:.6em;" class="fa fa-11x fa-times"></div>';
						let booktd = '<td><div style="'+buttonstyle+'">'+iconbook+C_XL.w('book now')+'</div></td>';
						let removetd = '<td><div style="'+buttonstyle+'">'+iconremove+C_XL.w('cancel resa')+'</div></td>';
						let buttons = '<div style="text-align:center; margin-top:0.5em;"><table style="margin:0 auto;">'+booktd+'<td>&nbsp;&nbsp;</td>'+removetd+'</table></div>';
				// hourlies and direction
							let hicon = '<th style="width:50%; text-align:left;"><div class="fa fa-2x fa-calendar"></div></th>';
							let hourly = '<td style="width:50%; text-align:left;">'+this.dS.eresaHourlies.htmlize()+'</td>';
							let dicon = '<th style="width:50%; text-align:right;"><div class="fa fa-3x fa-map-marker"></div></th>';
							let directions = '<td style="width:50%; text-align:right;">'+this.dS.eresaDirections.htmlize()+'</td>';
						let iconstr = '<tr style="vertical-align:bottom;">'+hicon+dicon+'</tr>';
						let dinfotr = '<tr style="vertical-align:top;">'+hourly+directions+'</tr>';
					let subinfo = '<table style="width:100%;">'+iconstr+dinfotr+'</table>';
				let info = '<div id="'+this.eids.own.preview.info+'" style="width:80%; margin:0 auto; text-align:center; font-size:120%">'+maininfo+buttons+subinfo+'</div>'; // textual content
			
				let label = '<div style="margin-top:2em; margin-bottom:.5em;" class="textcolor-light">'+C_XL.w('preview')+'</div>';
				let title = '<div id="'+this.eids.own.preview.title+'" style="text-align:center; line-height:2em;">'+mobminder.account.name+'</div>';
				let img = '<div style="text-align:center;">'+this.controls.image.display()+'</div>';
			let prevdiv = label+'<div style="min-height:30em; vertical-align:top;" class="like-input">'+title+img+info+'</div>'; // web page preview delimiter (grayed solid border)
			
		return fonts+prevdiv+custom;
	},
	activate: function() { 
		this.elements.collect(this.eids.own);
		this.controls.activate();
		this.titlefont(this.dS.eresaFontTitle, fonts.title);
		this.textfont(this.dS.eresaFontText, fonts.text);
	},
	getpost: function() { 
		let post = { titlefont:this.controls.titlefont.getpost()
					, textfont:this.controls.textfont.getpost()
					, eresaCcss:this.controls.customcss.getpost()
					, palette:this.controls.palette.getpost()
					, image:this.controls.imagepicker.getpost() };		
		return post;
	},
	
	// private
	getimage: function(which) {					
			let dS_logo = C_dS_logo.get(this.dS.id) || C_dS_logo.get(0) || false;
			let setupimage = this.dS.eresaSkin; // used for initialization 
		if(which!==undefined) setupimage = which; // this is the selection from the C_iSKIN control in e-resa mode
		
			let path = '', file = '';
		if(dS_logo) { // from uploaded custom image
			path = this.state.relpath+'/queries/logo.php';
				let aid = mobminder.context.groupId, lid = this.dS.id, keyid = this.keyid;
			file = '?lid='+lid+'&aid='+aid+'&kid='+keyid+'&t='+(this.trigger++); // trigger is used to force image refresh in the preview div
		} else
			if(setupimage) { // from image picker
				path = this.state.relpath+'/themes/default/e-resa/';
				file = setupimage+'.jpg';
			}  
		return { path:path, file:file };
	},
	getlogolabel: function(loginId) {
	
		let dS, aid = mobminder.context.groupId, lid = this.dS.id, keyid = this.keyid;

		if(this.dS.id<=0) { // new web page login
			if(loginId=='account') { lid = mobminder.context.surfer.id; keyid = mobminder.context.keyId; dS = C_dS_logo.get(0); } // account logo through surfer id and key
			else return C_XL.w('upload own logo'); // no specific logo can exist yet
		} else { // existing login
			if(loginId=='account') dS = C_dS_logo.get(0);
			else dS = C_dS_logo.get(loginId);
		}

		if(!dS) return C_XL.w('upload own logo');
			let path = this.state.relpath+'/queries/logo.php'+'?lid='+lid+'&aid='+aid+'&kid='+keyid+'&gid='+dS.id;
		let img = '<img style="max-width:200px; max-height:150px; border:none;" src="'+path+'" summary=""/>';
		return img;
	},
	
	
	// event handling
	titlefont: function(which, fontype) {
		if(vbs) vlog('modals.js','C_iEPREV','titlefont','type:'+fontype+', value:'+which);
		$(this.elements.preview.title).removeClass().addClass('f-'+which);
	},
	textfont: function(which, fontype) {
		if(vbs) vlog('modals.js','C_iEPREV','textfont','type:'+fontype+', value:'+which);
		$(this.elements.preview.info).removeClass().addClass('f-'+which);
	},
	image: function(which) { // changes the currently displayed image with another
		if(vbs) vlog('modals.js','C_iEPREV','image','image:'+which);
		let imagepathfile = this.getimage(which);
		if(imagepathfile.path) this.controls.image.setfile(imagepathfile.file, imagepathfile.path).hide(false);  // (*f09*)
			else this.controls.image.hide(true);
	},
	onlogo: function(id) {
		
		
		let dS; // if no specific logo was defined for this login, the common logo is return. If no common logo is defined, dS is undefined;
		if(id=='account') dS = C_dS_logo.get(0);
			else if(this.dS.id) dS = C_dS_logo.get(id);
				else return false; // You cannot attach a custom logo to a login that is not yet recorded in DB (has no loginId)
		
		if(!dS) dS = new C_dS_logo([0,mobminder.account.id,id]);
		// if(!dS) dS = new C_dS_logo(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([id])); // version with tracking
		
			let logochanged = new A_cb(this, this.logochanged);
		let modal = new M_logo(dS, {saved:logochanged, removed:logochanged}, { tab:0 });
	},	
	
	// feedback
	logochanged: function(dataSets) {
		if(vbs) vlog('modals.js','C_iEPREV','filesaved',''); 
		this.controls.customlogo.set(this.getlogolabel(this.dS.id));
		this.controls.globallogo.set(this.getlogolabel('account'));
		this.image();
	}
}


function C_iSEO(eid, callbacks, preset) {  // e-reservation SEO setting
	
	let b = eid+'_eSeo'+'_'; // base sub eid
	this.eids = { 
		  controls: { eresamode:b+'mode', indexability:b+'index', canonicalink:b+'canon', metatitle:b+'mtitle'
					, metadescript:b+'mdescr', seocomment:b+'comnt', idmode:b+'idmode' }
		, own:{ metacount:{ metatitle:b+'c_mta', metadescript:b+'c_dsc' }  // see (*seo01*)
		} 
	};	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSEO.defaults.align(preset); // preset like { dS:mandatory dS_login }
	this.dS = preset.dS;

	let idmode			= new C_iDDWN(this.eids.controls.idmode, {}, {labels:C_XL.w({ 0:'ident email based', 1:'ident family shared' })}, { value:this.dS.eresaIdentMode, enabled:true } );	
	let eresamode		= new C_iDDWN(this.eids.controls.eresamode, {}, {labels:{ '99':'Private appointment', '98':'Classroom filling' }}, { value:this.dS.eresaFillingMode, enabled:true } );
	let indexability 	= new C_iONOFF(this.eids.controls.indexability, {}, { state:this.dS.seoIndexable } );

		let metatitleph = '{brand} {company} in {zipcode} {city}';
	let metatitle 		= new C_iFIELD(this.eids.controls.metatitle,  {onfchange:new A_cb(this, this.msgchange, 'metatitle')}, { digits:this.dS.seoMetaTitle, type:INPUT_TEXT, mandatory:false, placeholder:metatitleph });
				
				let what = this.dS.lastname+' '+this.dS.firstname
				this.inplace = C_XL.w('e- in_place', {language:this.dS.language, cap:false});
				let address = this.dS.residence+' '+this.dS.address+' '+this.in+' '+this.dS.city
			let defaultdescr = 'make an app with {brand} {company}, {residence} {address} in {city}';
		let metadescrph = defaultdescr;
	let metadescript 	= new C_iFIELD(this.eids.controls.metadescript, {onfchange:new A_cb(this, this.msgchange, 'metadescript')}, { digits:this.dS.seoMetaDescr, type:INPUT_TEXT, mandatory:false, placeholder:metadescrph });
	let canonicalink 	= new C_iFIELD(this.eids.controls.canonicalink, {}, { digits:this.dS.seoMetaCanon, type:INPUT_URL, mandatory:false, placeholder:'www.doctorsleep.be' });
	
	let seocomment 		= new C_iNOTE(this.eids.controls.seocomment, this.dS.seoComment, {rows:6} );
	
	this.controls = new A_ct({idmode:idmode, eresamode:eresamode, indexability:indexability
							, metas:new A_ct({metatitle:metatitle, metadescript:metadescript}) // see (*seo01*)
							, canonicalink:canonicalink, seocomment:seocomment});
}
C_iSEO.defaults = new A_df({  });
C_iSEO.prototype = {
	display: function() {
				let paddy = '<tr>'+'<td colspan=2>&nbsp;</td>'+'</tr>';
				let step = function(s) { return '<span style="min-width:1.1em; text-align:center; margin-right:.6em;">'+s+'</span>'; };
				let steptitle = function(s,e) { return '<h3 class="bold">'+step(s)+e+'</h3>'; }
				let stepdiv = function(t) { return '<div style="margin-left:2.5em;">'+t+'</div>'; }
				let bullet = '<div style="display:inline-block;" class="fa fa-play"></div>';
				
		// section 1
			let s1	= steptitle(bullet,'Reservation mode & options'); 
			let idmode 		= '<tr>'+this.controls.idmode.labelled('identification mode', 'alpha20')+'</tr>';
			let eresamode 	= '<tr>'+this.controls.eresamode.labelled('Eresa process', 'alpha20', {xl:false})+'</tr>';
			let padabit		= '<tr><td></td><td class="padplus">&nbsp;</td></tr>';
				let bpindex = 'Off-indexability leaves this page NOT indexed by any search engines or robots.';
			let indexability 	= '<tr>'+this.controls.indexability.labelled('Indexable by search engines', '', {xl:false})+'</tr>'+'<tr><td></td><td class="mobtext">'+bpindex+'</td></tr>';
		let step1 = s1+stepdiv('<table class="coords">'+idmode+eresamode+padabit+indexability+'</table>');
		
		// section 2
					let cstyle = 'vertical-align:top; padding-top:.1em; padding-left:.2em; color:red; font-size:80%'; //rgba(0,0,0,.5)
			let s2	= steptitle(bullet,'Meta tags'); 
			
				let metatitletitle = '<tr><td class="mobtext pad right">'+'meta-title'+'</td><td></td></tr>';
							let deftitle = this.dS.firstname+' '+this.dS.lastname+' '+this.inplace+' '+this.dS.zipCode+' '+this.dS.city+' - Online appointment';
						let titledefault = deftitle;
					let bptitle = '&nbsp;<br/>Name of the web page as displayed in search engine results. Optimum: 50-60 characters. Most important keywords in the beginning. Do not duplicate keywords. One unique meta title per page. No carriage return.<br/>Example: Michelle Dupont dentist in Namur - Online appointment';
				let metatitlecounter = '<tr>'+'<td></td>'+'<td id="'+this.eids.own.metacount.metatitle+'" style="'+cstyle+'"></td>'+'</tr>';
				let metatitlefield = '<tr id="'+this.eids.own.metatitle+'">'+this.controls.metas.metatitle.labelled('specific version', 'alpha48', {xl:false})+'</tr>';
				let metatitledef = '<tr><td class="label textcolor-light padplus">default</td><td>'+titledefault+'</td></tr>';
				let metatitlebp = '<tr><td></td><td class="mobtext padplus">'+bptitle+'</td></tr>';
			let metatitlepackage = metatitletitle+metatitledef+metatitlecounter+metatitlefield+metatitlebp;

				let metadescrtitle = '<tr><td class="mobtext pad right">'+'meta-description'+'</td><td></td></tr>';		
						let what = this.dS.firstname+' '+this.dS.lastname;
						let address = this.dS.residence+' '+this.dS.address+' '+this.inplace+' '+this.dS.city;
					let defaultdescr = C_XL.w('e- make an app with', {language:this.dS.language})+' '+what+', '+address+' - Online appointment';
					let bpdescr = '&nbsp;<br/>A concise description of the page content as displayed in search engine results. Optimum: 50-160 characters. Use only alphanumeric characters. No carriage return.<br/>Example: Quickly make an appointment online with dentist Michelle Dupont at Dental practice Dupont, 28 street de la Dent Cron in Namur.';
				let metadescrcounter = '<tr>'+'<td></td>'+'<td id="'+this.eids.own.metacount.metadescript+'" style="'+cstyle+'"></td>'+'</tr>';
				let metadescriptfield 	= '<tr>'+this.controls.metas.metadescript.labelled('specific version', 'alpha48', {xl:false})+'</tr>';
				let metadescrdef = '<tr><td class="label textcolor-light padplus">default</td><td>'+defaultdescr+'</td></tr>';
				let metadescrbp = '<tr><td></td><td class="mobtext padplus">'+bpdescr+'</td></tr>';
			let metadescriptionpackage = metadescrtitle+metadescrdef+metadescrcounter+metadescriptfield+metadescrbp;
			
				let bpcanon = 'The URL that is indexed by the robot for this page. If the customer has a mobminder hosted URL (like www.doctor-dupont.be) then use this one.s No carriage return.';
			let canonicalink = '<tr>'+this.controls.canonicalink.labelled('meta-canonicalink', 'alpha32', {xl:false, labelcss:'mobtext'})+'</tr>';
			let canonicalbp = '<tr><td></td><td class="mobtext padplus">'+bpcanon+'</td></tr>';
		let step2 = s2+stepdiv('<table>'+metatitlepackage+metadescriptionpackage+canonicalink+canonicalbp+'</table>');

		// section 3
			let s3	= steptitle(bullet,'Follow-up comment'); 
			let seocomment 	= '<tr><td colspan=3 style="padding-bottom:1em;">'+this.controls.seocomment.labelled('comment<br/>&nbsp;<br/>(for internal use only,<br/>this tab is visible by<br/>account managers only)','alpha40', {xl:false})+'<td></tr>';
		let step3 = s3+stepdiv('<table summary="e-resa step4">'+seocomment+'</table>');

		return step1+step2+step3;
	},
	activate: function() { 
		this.elements.collect(this.eids.own);  // see (*seo01*)
		this.controls.activate();
		for(let which in this.controls.metas.get) this.setcounter(which); // sets initial position for counters
	},
	getpost: function() { 
			let idmode 	= this.controls.idmode.getpost();
			let eresamode 	= this.controls.eresamode.getpost();
			let indexability 	= this.controls.indexability.getpost();
			let metatitle 	= this.controls.metas.metatitle.getpost();
			let metadescript 	= this.controls.metas.metadescript.getpost();
			let canonicalink = this.controls.canonicalink.getpost();
			let seocomment 	= this.controls.seocomment.getpost();
		let post = { idmode:idmode, eresamode:eresamode, indexability:indexability, metatitle:metatitle, metadescript:metadescript, canonicalink:canonicalink, seocomment:seocomment };		
		return post;
	},
	
	// private
	setcounter: function(which) { // which is one of [metatitle,metadescript], that must match the element id name AND the control name, see (*seo01*)
			let c = this.controls.metas[which];
			let r = c.remains(); // is an object like { over:false, remains:1, positive:1, max:this.state.max }, see C_iFIELD prototype
		this.elements.metacount[which].innerHTML = r.positive; 
		return c;
	},
	
	// event handling
	msgchange: function(which, digits) { this.setcounter(which); },

}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    M _ L O G I N
//

function M_LOGIN(dataSet, callbacks, preset) {
	
	this.state = M_LOGIN.defaults.align(preset = preset || {});
	
		if(!dataSet) dataSet = new C_dS_login('config');
	this.dS = dataSet;
	
	this.dSclone = Object.assign(Object.create(Object.getPrototypeOf(this.dS)), this.dS); // see (*st01*)
	
	this.is = {   self:(this.dS.id==mobminder.context.surfer.id)
				, human:!(this.dS.accessLevel<=aLevel.operator) // one of human logins having access to the account
				, admin:(this.dS.accessLevel==aLevel.admin)
				, surfer:(mobminder.context.surfer.is)
				, eresa:(this.dS.accessLevel==aLevel.eresa)
				, sync:(this.dS.accessLevel==aLevel.synchro)
				, single:(C_dS_resource.count()==1)
				, atleast:{	
						operator: (this.dS.accessLevel>=aLevel.operator),
						supervisor: (this.dS.accessLevel>=aLevel.supervisor),
						manager: (this.dS.accessLevel>=aLevel.manager),
						seller: (this.dS.accessLevel>=aLevel.seller),
						admin: (this.dS.accessLevel>=aLevel.admin)
					}
				, connected:!!C_dS_loggedIn.get(this.dS.id)
				}
				
	this.callbacks = callbacks || {}; // like { saved:, deleted: }
	const b = 'login'+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', duplicate:b+'duplic', connect:b+'connect'
		, company:b+'comp', gender:b+'gender', fname:b+'fname', lname:b+'lname', mobile:b+'mobile', lang:b+'lang'
		, login:b+'login', pass:b+'pass', disbl:b+'disbl', sendmsg:b+'sndmsg', logsug:b+'lsug', psssug:b+'psug'
		, resid:b+'resid', addr:b+'addr', zip:b+'zip', city:b+'city', country:b+'country', phone:b+'phone', email:b+'email', prof:b+'prof',  note:b+'note'
		, eresaInfo:b+'info', eresaPreview:b+'prvw', eresaBooking:b+'book'
		, view:b+'view', watchover:b+'wovr', notbyme:b+'notbme', popups:b+'popups'
		, alevel:b+'alvl', gmt:b+'gmt', weeknumb:b+'wnb', color:b+'clr', tag:b+'tag', akeys:b+'akeys', permissions:b+'prms'
		, syncwhat:b+'swhat' , syncwhich:b+'swhch' , synccss:b+'synccss'
		, ical:b+'ical', ipad:b+'ipad', workcodes:b+'wkds', sndvol:b+'sndvol'
		, own : { title:b+'ttl', subtitle:b+'sttl', ltag:b+'ltag',
					credshelps: { 
						login: { smalls:b+'ch_l_smalls', caps:b+'ch_l_caps', figures:b+'ch_l_figrs', specials:b+'ch_l_specials', size:b+'ch_l_size', reserved:b+'ch_l_resrvd' },
						pass: { smalls:b+'ch_p_smalls', caps:b+'ch_p_caps', figures:b+'ch_p_figrs', specials:b+'ch_p_specials', size:b+'ch_p_size', duplicate:b+'ch_p_duplct' },
						locked: b+'ch_lkd_bp'
					}
				}
		, decision:b+'decis', aienabled:b+'aion'
		};
	this.elements = new A_el();
		
			const notloggedIn = !this.is.connected;
			const permitted = permissions.may(pc.ch_logins);
		const mayremove = (this.dS.id>0) && permitted && notloggedIn;
		const maysave = permitted||preset.maysave;
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );

	const duplicate 	= new C_iCLIK(this.eids.duplicate, { click:new A_cb(this, this.duplicate) }
		, { enabled:true, tip:{ text:C_XL.w('tip duplicate')}, css:'modal-button fa fa-gray fa-copy touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.d /*d like duplicate*/] });
		

	const modified = new A_cb(this,this.modified);
	
	// meta
	const id			= new C_iPASS({id:this.dS.id});
	
	// coordinates
	const company		= new C_iFIELD(this.eids.company, {onfchange:modified}, { digits:this.dS.company, type:INPUT_NAMES, mandatory:false });
	const gender		= new C_iDDWN(this.eids.gender, {onselect:modified}, { labels:C_XL.w(genders.english) }, { value:this.dS.gender, maxcols:1, maxrows:1 } );
	const fname 		= new C_iFIELD(this.eids.fname, { onfchange:new A_cb(this, this.onname, 'fname', null, 1000) }, { digits:this.dS.firstname, type:INPUT_NAMES, mandatory:true, focus:true });
	const lname 		= new C_iFIELD(this.eids.lname, { onfchange:new A_cb(this, this.onname, 'lname', null, 1000) }, { digits:this.dS.lastname, type:INPUT_NAMES, mandatory:true });
	const mobile 		= new C_iFIELD(this.eids.mobile, { onfchange:new A_cb(this, this.identvalid) } , { digits:this.dS.mobile, type:INPUT_MOBILE, mandatory:this.is.atleast.manager });
	const lang		= new C_iSPEAK(this.eids.lang, {onselect:modified}, { value:this.dS.language } );

	const residence	= new C_iFIELD(this.eids.resid, {onfchange:modified}, { digits:this.dS.residence, type:INPUT_NAMES, mandatory:false });
	const addr 		= new C_iFIELD(this.eids.addr, {onfchange:modified}, { digits:this.dS.address, type:INPUT_NAMES, mandatory:false });
	const zip 		= new C_iFIELD(this.eids.zip, {onfchange:modified}, { digits:this.dS.zipCode, type:INPUT_NAMES, mandatory:false });
	const city 		= new C_iFIELD(this.eids.city, {onfchange:modified}, { digits:this.dS.city, type:INPUT_NAMES, mandatory:false });
	const country		= new C_iFIELD(this.eids.country, {onfchange:modified}, { digits:this.dS.country, type:INPUT_NAMES, mandatory:false });
	const phone 		= new C_iFIELD(this.eids.phone, {onfchange:modified}, { digits:this.dS.phone, type:INPUT_PHONE, mandatory:false });
	const email 		= new C_iFIELD(this.eids.email, {onfchange:new A_cb(this, this.identvalid)}, { digits:this.dS.email, type:INPUT_EMAIL, mandatory:this.is.atleast.supervisor });
	const prof		= new C_iPRO(this.eids.prof, {onselect:modified}, { value:this.dS.profession, mandatory:!(this.is.eresa||this.is.sync) });
	const note 		= new C_iNOTE(this.eids.note, this.dS.note, { rows:(this.is.eresa?16:3), type:INPUT_ML_HTML }, {onfchange:modified} );
		
	// resources view
		const keys = this.dS.getKeys();
		let kid; let key = { getView:function() { return true; }, getWatchovers:function() {} }; // if the login is new, no key is defined yet;
		if(keys) for(kid in keys) if(keys[kid].accountId==mobminder.account.id) { key = keys[kid]; break; }; // select that key belonging to the login that opens the current account (logins may have many keys)

		const slocked = (this.dS.accessLevel>=aLevel.seller); // sellers and admins are not allowed to reduce their view
	const staff = new C_iSTAFF(this.eids.view, 'empty', new A_cb(this,this.staff), key.getView(), { locked:slocked });
	
	// notifications watch overs
			const bCalsComm = C_dS_emailTemplate.targetCount(class_bCal)+C_dS_smsTemplate.targetCount(class_bCal)+C_dS_notifTemplate.targetCount(class_bCal);
			const uCalsComm = C_dS_emailTemplate.targetCount(class_uCal)+C_dS_smsTemplate.targetCount(class_uCal)+C_dS_notifTemplate.targetCount(class_uCal);
			const fCalsComm = C_dS_emailTemplate.targetCount(class_fCal)+C_dS_smsTemplate.targetCount(class_fCal)+C_dS_notifTemplate.targetCount(class_fCal);
		this.showatchovers = {bCals:bCalsComm, uCals:uCalsComm, fCals:fCalsComm}; // wether the notifications tab should appear or not
	const watchover = new C_iSTAFF(this.eids.watchover, 'empty', new A_cb(this,this.watchovers), key.getWatchovers(), {postmode:'merged', validation:'none', show:this.showatchovers });
	const notbyme 	= new C_iONOFF(this.eids.notbyme, { onswitch:new A_cb(this, this.onnotbyme) }, { state:this.dS.notbyme } );
	const popups 	= new C_iONOFF(this.eids.popups, { onswitch:new A_cb(this, this.onsecretarypopups) }, { state:this.dS.secretarypopups } );
	const sndvolume	= new C_iDDWN(this.eids.sndvol, {onselect:modified},  { labels:{ 0:'0 (muted)', 1:'1 / 10', 2:'2 / 10', 3:'3 / 10', 4:'4 / 10', 5:'5 / 10', 6:'6 / 10', 7:'7 / 10', 8:'8 / 10', 9:'9 / 10', 10:'10 / 10' }}, { value:this.dS.soundsVolume, enabled:true, menucss:'nowrap' } );
	
	// workcodes view (for e-resa)
		const hidewrkc = !(mobminder.account.has.eworkcodes)&&(this.is.eresa); // does take e-workcodes only into consideration
	const workcodes = new C_iACPICK(this.eids.workcodes, C_dS_workcode, { changed:false, cleared:false }, { placeholder:C_XL.w('workcodes'), bullets:true, ids:this.dS.eworkcodes(), hidden:hidewrkc, eWorkcodes:true, emptypost:'', leadclass:{resources:staff.value()},  });
		
	// access level
		const alevels = []; // access level can not be modified for sync accesses or web accesses
			alevels[aLevel.operator] = aLevel.name(aLevel.operator);
			alevels[aLevel.supervisor] = aLevel.name(aLevel.supervisor);
			alevels[aLevel.manager] = aLevel.name(aLevel.manager);
		if(this.is.surfer.atleast.seller) alevels[aLevel.seller] = aLevel.name(aLevel.seller);
		if(this.is.surfer.atleast.admin) alevels[aLevel.admin] = aLevel.name(aLevel.admin);
		const alevelmay = (this.is.surfer.atleast.manager)&&(this.dS.accessLevel<aLevel.seller); // sellers mays not change their access levels

	const alevel 	= new C_iDDWN(this.eids.alevel, { onselect:new A_cb(this, this.onalevel) }, {labels:C_XL.w(alevels)}, { value:this.dS.accessLevel, enabled:(alevelmay||this.is.surfer.supervised) } );
	
	const gmt = new C_iGMT(this.eids.gmt, {onselect:modified}, { value:this.dS.GMT } );
	const weeknumb = new C_iONOFF(this.eids.weeknumb, {onswitch:modified}, { state:this.dS.weeknumb } );
	const color = new C_iSKIN(this.eids.color, { select:new A_cb(this, this.color) }, { type:skin.color, value:this.dS.color, allownone:true } );
	const tag	= new C_iSKIN(this.eids.tag, { select:new A_cb(this, this.tag) }, { type:skin.logtag, value:this.dS.tag, allownone:true, css:'tagbig' } /*preset*/ );
	
	// e-reservation	
	const eresaInforma = new C_iEINFO(this.eids.eresaInfo, {} , { dS:this.dS, mandatory:this.is.eresa } );
	const eresaBooking = new C_iEBOOK(this.eids.eresaBooking, {} , { dS:this.dS } );
	const eresaPreview = new C_iEPREV(this.eids.eresaPreview, {} , { dS:this.dS, keyid:kid } );
	const eresaSEO 	 = new C_iSEO(this.eids.eresaSEO, {} , { dS:this.dS } );

	// synchronization options
	const syncwhat 	= new C_iSYOPT(this.eids.syncwhat, false, {syncwhat:this.dS.syncwhat });
		let keyid = 0; /*const keys = this.dS.getKeys();*/ if(keys) for(keyid in keys) break; // takes the first (and normally only key id)
	const syncwhich 	= new C_iSYRSC(this.eids.syncwhich, false, {keyid:keyid});
	const synccss 	= new C_iSYCSS(this.eids.synccss, false, {keyid:keyid});

	// access keys
	const akeys 		= new C_iAKEYS(this.eids.akeys, false, {mentor:this.dS.id, loginId:this.dS.id});

			const grpid = mobminder.account.id, logid = mobminder.context.loginId;
		const icalink = 'https://ical.mobminder.com/'+grpid+'/'+this.dS.id;
	const ical = new C_iFIELD(this.eids.ical, false, { digits:icalink, type:INPUT_TEXT, mandatory:false, enabled:false }); 
		
		// this is the auto-login url for this login
		this.ipadlink = this.dS.url(akeys.getaccesskey());
		
	const ipad = new C_iFIELD(this.eids.ipad, false, { digits:this.ipadlink, type:INPUT_TEXT, mandatory:false, enabled:false }); 
	
	// connection magic
		let ctip = '', faw = 'fa-question';
		switch(this.dS.accessLevel) {
			case aLevel.synchro: ctip = C_XL.w('tip connect synchro'); faw = 'fa-server'; break;  // jumps to the api specification related to this login authorisation
			case aLevel.eresa: ctip = C_XL.w('tip connect eresa')+'<br/>'+this.ipadlink; faw = 'fa-globe'; break;  // opens a webpage in the next tab
			default:
				faw = 'fa-sign-in';
				ctip = C_XL.w('tip connect login'); // connect a human login to the webapp
		}
	const connect 	= new C_iCLIK(this.eids.connect, { click:new A_cb(this, this.connect) }
		, { enabled:true, tip:ctip, css:'modal-button fa fa-gray '+faw+' touch-orange', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.l /*l like log in */] });
		
	
	// permissions
	const perms	= new C_iPERM(this.eids.permissions, {onchange:modified}, {permissions:this.dS.permissions, forced:this.is.admin||this.is.self} );
	
	// credential
	const login 	= new C_iFIELD(this.eids.login, { onfchange:new A_cb(this, this.credscheck, 'login', null, 600), onfreelogin:new A_cb(this, this.isfreelogin) }, { digits:this.dS.login, type:INPUT_LOGIN, mandatory:!this.is.eresa, loginId:this.dS.id });
	const pass 	= new C_iFIELD(this.eids.pass, { onfchange:new A_cb(this, this.credscheck, 'pass', null, 600) }, { digits:this.dS.password, type:INPUT_PASSWD, mandatory:!this.is.eresa });
	const locked  = new C_iONOFF(this.eids.disbl, { onswitch:new A_cb(this, this.onlock) }, { state:this.dS.locked, morecss:'orange' } );
	const logsug 	= new C_iCREDS(this.eids.logsug, { preset:new A_cb(this, this.credssuggestionpreset), select:new A_cb(this, this.lpsuggselect, login ) }, {} );
	const psssug 	= new C_iCREDS(this.eids.psssug, { preset:new A_cb(this, this.credssuggestionpreset), select:new A_cb(this, this.lpsuggselect, pass ) }, {credstype:'pass'} );
	const duplic	= new C_iPASS({id:this.dS.id}); duplic.valid = () => { return this.is.eresa?true:login.value()!=pass.value(); }; // this control is used only for its capability of comparing login and password, and act as a valid() condition at save() time
	const sendmsg	= new C_iSENDmsg(this.eids.sendmsg, { preset:new A_cb(this, this.getmsgmediums), select:new A_cb(this, this.onmediumselect) }, {} );
	
	// tracking
	const decision = new C_iONOFF(this.eids.decision, { onswitch:new A_cb(this, this.ondecision) }, { state:this.dS.decision, morecss:'green' } );
	const aienabled = new C_iONOFF(this.eids.aienabled, { onswitch:new A_cb(this, this.onaienable) }, { state:this.dS.aienabled, morecss:'green' } );
	
	
	// tabs
		const tab0caption = this.is.eresa?'e-home':'coordinates';
		const tabscaptions = C_XL.w({0:tab0caption, 1:'booking options', 2:'e-graphchart', 3:'synchro', 4:'view', 5:'notifications', 6:'access keys', 7:'permissions', 8:'credentials', 9:'audit'});
		tabscaptions[10] = 'SEO'; // this one is not translated
		tabscaptions[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions, {ontab:new A_cb(this, this.ontab)}, {current:preset.tab||0});

	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, duplicate:duplicate, connect:connect
		, company:company, gender:gender, lang:lang
		, ident: new A_ct({ fname:fname, lname:lname, mobile:mobile, email:email }) // we want to execute isvalid() on this subset of controls
		, creds: new A_ct({ login:login, pass:pass, locked:locked, sendmsg:sendmsg, logsug:logsug, psssug:psssug, duplic:duplic }) // we want to execute isvalid() on this subset of controls
		, residence:residence, addr:addr, zip:zip, city:city, country:country, phone:phone, prof:prof, note:note
		, staff:staff, watchover:watchover, notbyme:notbyme, popups:popups, sndvolume:sndvolume, workcodes:workcodes
		, eresaInforma:eresaInforma, eresaBooking:eresaBooking, eresaPreview:eresaPreview, eresaSEO:eresaSEO
		, syncwhat:syncwhat, syncwhich:syncwhich,  synccss:synccss /* synchronisation */
		, alevel:alevel, gmt:gmt, weeknumb:weeknumb, color:color, tag:tag, akeys:akeys, permissions:perms, ical:ical, ipad:ipad
		, decision:decision, aienabled:aienabled /* tracking */ } );
		let pxheight = 400, pxwidth = 740; if(this.is.eresa) { pxheight = 560; pxwidth = 900; }
		
				const tilt = this.dS.id <= 0 ? -50 : 0;
			const position = { style:'', offset:{x:tilt, y:tilt}};
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { position:position, size:{x:pxwidth,y:pxheight}, moves:true, morecss:{ outlet:'M_LOGIN' } } );
	this.activate().restore();
}
M_LOGIN.defaults = new A_df( { modified:false, tab:0, reduced:false } );
M_LOGIN.prototype = { 
	// private
	header: function() {
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
				let maycopy = (this.dS.id>0)&&(this.dS.accessLevel == aLevel.eresa);
				let permitted = permissions.may(pc.ch_logins);
				
			let padder = '<td style="width:2em: min-width:2em">'+'</td>';
			let duplicate = (maycopy&&permitted) ? '<td class="cartouche">'+this.controls.duplicate.display()+'</td>':'';	
			let connect = (this.dS.id>0&&!this.is.connected) ? '<td class="cartouche">'+this.controls.connect.display()+'</td>':'';

			let title = '<td class="mheader"><h1 id="'+this.eids.own.title+'" class="">'+'</h1><h2 id="'+this.eids.own.subtitle+'" class="right">'+'</h2></td>';
			let ltag = '<td id="'+this.eids.own.ltag+'" class="mheader">'+'</td>';
		let header = '<tr>'+buttons+padder+duplicate+connect+title+ltag+'</tr>';
		let divHeader = '<div class="buttons air"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		if(vbs) vlog('modals.js','M_LOGIN','body','display');
		
			// coordinates left side
					let company = this.is.eresa?'':'<tr>'+this.controls.company.labelled('company')+'</tr>';
					let gender 	= (this.is.eresa||this.is.sync)?'':this.controls.gender.labelled('gender', 'alpha06');
						let l2 	= 'firstname'; if(this.is.eresa) l2 = 'brand'; if(this.is.sync) l2 = 'program name';
					let fname 	= '<tr>'+this.controls.ident.fname.labelled(l2)+'</tr>';
						let l1 	= 'lastname'; if(this.is.eresa) l1 = 'company'; if(this.is.sync) l1 = 'contact person';
					let lname 	= '<tr>'+this.controls.ident.lname.labelled(l1)+'</tr>';
					let mobile 	= '<tr>'+this.controls.ident.mobile.labelled('mobile')+'</tr>';
					let lang 	= this.controls.lang.labelled('language', 'alpha10');
					let prof = (this.is.sync)?'':'<tr>'+this.controls.prof.labelled('profession')+'</tr>';
					
			// coordinates right side
					let residence = '<tr>'+this.controls.residence.labelled('residence')+'</tr>';
					let addr = '<tr>'+this.controls.addr.labelled('address')+'</tr>';
					let zip = '<tr>'+this.controls.zip.labelled('zipCode')+'</tr>';
					let city = '<tr>'+this.controls.city.labelled('city')+'</tr>';
					let country = '<tr>'+this.controls.country.labelled('country')+'</tr>';
					let phone = '<tr>'+this.controls.phone.labelled('phone')+'</tr>';
					let email = '<tr>'+this.controls.ident.email.labelled('email')+'</tr>';
				
			
			// merging left and right sides
				let coordsLeft = '<table>'+company+gender+fname+lname+mobile+lang+prof+'</table>';
				let coordsRight = '<table>'+residence+addr+city+zip+country+phone+email+'</table>';
					let left = '<td style="vertical-align:top;">'+coordsLeft+'</td>';
					let right = '<td style="vertical-align:top;">'+coordsRight+'</td>';
			let coords = '<table class="coords" style="text-align:left;"><tr>'+left+right+'</tr>'+'</table>';
		
			// other infos (only visible for e-resa logins)
			
			let note = this.controls.note.display('textcolor-light','alpha40',this.is.eresa?'e-header':'note');
			
			let eheader = '', einfos = '', homep = '', coord = '', infos = ''; 
			if(this.is.eresa) {
				homep = '<h3 class="bold">'+C_XL.w('e-homepage')+'</h3>';
				eheader = this.controls.eresaInforma.display1();
				coord = '<h3 class="bold">'+C_XL.w('coordinates')+'</h3>';
				infos = '<h3 class="bold">'+C_XL.w('e-infos')+'</h3>';
				einfos = this.controls.eresaInforma.display2();
			}
			let wrap = '<div class="fiesta" style="display:table; margin:0 auto;">'+homep+eheader+coord+coords+infos+note+einfos+'</div>';
		let tab0 = this.controls.tabs.container(0, wrap);
		
		// e-reservation booking steps options (only visible for e-resa logins)
			let esteps = '<div class="fiesta" style="display:table; margin:0 auto;">'+this.controls.eresaBooking.display()+'</div>';
		let tab1 = this.controls.tabs.container(1, esteps);
		if(!this.is.eresa) this.controls.tabs.hide(1, true);

		// e-reservation graphical chart preview (only visible for e-resa logins)				
			let epreview = this.controls.eresaPreview.display();
		let tab2 = this.controls.tabs.container(2, epreview, 'wide');
		if(!this.is.eresa) this.controls.tabs.hide(2, true);

		// sync options (only visible for sync logins)
				let whattitle = '<div class="label textcolor-light" style="white-space:nowrap; margin-bottom:0.5em;">'+C_XL.w('options')+'</div>'
			let syncwhat = '<td style="vertical-align:top; padding-top:1em;">'+whattitle+this.controls.syncwhat.display()+'</td>';
			let syncwhich = '<td style="padding-left:3em;">'+this.controls.syncwhich.display()+'</td>';
			let syncpad = '<td>'+'</td>';
			let synccss = '<td style="padding-left:3em;">'+this.controls.synccss.display()+'</td>';
			let divsync = '<div><table summary="sync options"><tr>'+syncwhat+syncwhich+'</tr><tr>'+syncpad+synccss+'</tr></table></div>';
		let tab3 = this.controls.tabs.container(3, divsync);
		if(!this.is.sync) this.controls.tabs.hide(3, true);


		// view TAB
				let hidestaff = ''; if(mobminder.account.single) hidestaff = 'display:none;';
			let staff = '<tr style="'+hidestaff+'"><td>'+this.controls.staff.display('textcolor-light')+'</td></tr>';
			let workcodes = this.is.eresa?'<tr><td style="height:8em; min-height:8em; padding-top:2em; vertical-align:top;">'+this.controls.workcodes.display()+'</td></tr>':'';
			let pad = 	'<tr>'+'<td>&nbsp;</td>'+'<td>&nbsp;</td>'+'</td></tr>';
			let staffnote = '<div  style="'+hidestaff+'" class="mobtext pad airtop">'+C_XL.w(this.is.eresa?'blueprint eresa login view':'blueprint human login view')+'</div>';
			let staffcontrol = '<div><table summary="view staff">'+staff+workcodes+'</table></div>';

		let divstaff = staffnote+staffcontrol; // mobminder.account.single
		
			let alevel = ''; if(this.is.atleast.operator) alevel = '<tr>'+this.controls.alevel.labelled('access level', 'alpha10')+'</tr>';
			
			let color = '', tag = ''; if(this.is.atleast.operator) { // this feature is reserved for human logins
				color = '<tr>'+this.controls.color.labelled('color', 'alpha4')+'</tr>';
				tag = '<tr>'+this.controls.tag.labelled('tag')+'</tr>';
			}
			let gmt = '<tr>'+this.controls.gmt.labelled('time zone', 'alpha28')+'</tr>';
			
			let disable = (!this.is.eresa)?'':'<tr>'+this.controls.creds.locked.labelled('disable webpage')+'</tr>'; // logins other than eresa do use their own version
			let weeknumb = (this.is.sync)?'':'<tr>'+this.controls.weeknumb.labelled('display weeknumb')+'</tr>';
			
		let viewoptions = '<div><table summary="view options" style="margin-top:1em; border-collapse:separate; border-spacing:.3em;">'+alevel+color+tag+disable+gmt+weeknumb+'</table></div>';
					
			let popnote = '<div class="mobtext pad airtop">'+C_XL.w('logins wk popups note')+'</div>';
			let popups = this.controls.popups.labelled('popups on wk selection', '', {xl:true, table:true, reverse:true});
		if(this.is.eresa||this.is.sync) { popnote=''; popups='';  }
			
		let sounds = ''; if(this.is.atleast.operator) { // this feature is reserved for human logins
			let sndvolnote = '<div class="mobtext pad airtop">'+C_XL.w('blueprint sound volume')+'</div>';
			let sndvolume = '<table><tr>'+this.controls.sndvolume.labelled('sounds volume', 'alpha10')+'</tr></table>';
			sounds = sndvolnote+sndvolume;
		}
	
		let links = ''; if(this.is.atleast.operator) { // this feature is reserved for human logins
			let ical = (this.is.eresa||this.is.sync)?'':'<tr>'+this.controls.ical.labelled('ical link', 'alpha28')+'</tr>';
			let ipad = (this.is.eresa||this.is.sync)?'':'<tr>'+this.controls.ipad.labelled('ipad link', 'alpha28')+'</tr>';
			links = '<div class="pad airtop"><table class="coords" summary="links" style="margin-top:1em; border-collapse:separate; border-spacing:.3em;">'+ical+ipad+'</table></div>';
		}
		
		let tab4 = this.controls.tabs.container(4, viewoptions+divstaff+popnote+popups+sounds+links, 'margins'); 
		
		
		
		// watchovers for notifications (not displayed if this account has no communication triggered by a resource class target)
				let watch = this.controls.watchover.display('textcolor-light');
			let watchnote = '<div class="mobtext pad airtop">'+C_XL.w('logins watchover note')+'</div>';
			let watchdiv = '<div>'+watch+'</div>';
			let notbyme = this.controls.notbyme.labelled('not on own actions', '', {xl:true, table:true, reverse:true});
			
		let tab5 = this.controls.tabs.container(5, watchnote+watchdiv+notbyme, 'margins');
			let showatchovers = this.showatchovers.bCals+this.showatchovers.uCals+this.showatchovers.fCals;
		
		if(!showatchovers) this.controls.tabs.hide(5, true);
		if(this.is.eresa||this.is.sync) this.controls.tabs.hide(5, true);
		
		
		// accesskeys (not displayed if this login has only one key)
			let akeys = '<td>'+this.controls.akeys.display('textcolor-light')+'</td>';
			let divakeys = '<div><table summary="accesskeys"><tr>'+akeys+'</tr></table></div>';
		let tab6 = this.controls.tabs.container(6, divakeys);
		if(this.controls.akeys.count()<2) { this.controls.tabs.hide(6, true); };
		if(this.is.eresa||this.is.sync) this.controls.tabs.hide(6, true);
		
		
		// permissions
			let permissions = this.controls.permissions.display();
		let tab7 = this.controls.tabs.container(7, permissions);
		this.controls.tabs.hide(7, this.is.eresa||this.is.sync);
		
		// credentials
				let lintro = C_XL.w('ch l intro')+' ';
				let pintro = C_XL.w('ch p intro')+' ';
				let smalls = C_XL.w('ch smalls',{cap:0})+', ';
				let caps = C_XL.w('ch uppers',{cap:0})+', ';
				let specials = C_XL.w('ch specials',{cap:0})+', ';
				let figures = C_XL.w('ch figures',{cap:0})+', ';
				let size = C_XL.w('ch size',{cap:0});
				let lsugg = this.controls.creds.logsug.display();
				let psugg = this.controls.creds.psssug.display();
				let sendmsg = this.controls.creds.sendmsg.display();
				let eids = this.eids.own.credshelps;
			
				// here we build a 3 columns table

				let login = '<tr style="border-bottom:10px solid transparent;">'+this.controls.creds.login.labelled('login', 'alpha24 f-consola')+'<td>'+lsugg+'</td></tr>';
					let loginhelp = lintro+'<span id="'+eids.login.smalls+'">'+smalls+'</span>'+'<span id="'+eids.login.caps+'">'+caps+'</span>'+'<span id="'+eids.login.figures+'">'+figures+'</span>'+'<span id="'+eids.login.specials+'">'+specials+'</span>'+'<span id="'+eids.login.size+'">'+size+'</span>';
				let lh = '<tr><td colspan="3" class="blueprint big" style="max-width:100%;">'+loginhelp+'</td></tr>';
				let lr = '<tr><td colspan="3" id="'+eids.login.reserved+'" class="alpha32 transparent">'+C_XL.w('ch l reserved')+'</td></tr>';
				let air = '<tr><td colspan="3"><div style="height:5px;"></div></td></tr>';
			
			let loginarea = login+lh+lr+air;
			
				let pass = '<tr style="border-bottom:10px solid transparent;">'+this.controls.creds.pass.labelled('pass', 'alpha24 f-consola')+'<td>'+psugg+'</td></tr>';
					// let passhelp = pintro+'<span id="'+eids.pass.smalls+'">'+smalls+'</span>'+'<span id="'+eids.pass.caps+'">'+caps+'</span>'+'<span id="'+eids.pass.figures+'">'+figures+'</span>'+'<span id="'+eids.pass.specials+'">'+specials+'</span>'+'<span id="'+eids.pass.size+'">'+size+'</span>';
					let passhelp = pintro+'<span id="'+eids.pass.smalls+'">'+smalls+'</span>'+'<span id="'+eids.pass.figures+'">'+figures+'</span>'+'<span id="'+eids.pass.size+'">'+size+'</span>';
				let ph = '<tr><td colspan="3" class="blueprint big" style="max-width:100%;">'+passhelp+'</td></tr>';
				let pd = '<tr><td colspan="3" id="'+eids.pass.duplicate+'" class="alpha32 transparent">'+C_XL.w('ch p duplicate')+'</td></tr>';
				
			let passarea = pass+ph+pd+air;
				
				sendmsg = '<td>'+sendmsg+'</td>';
			let locked = (this.is.eresa)?'':'<tr>'+this.controls.creds.locked.labelled('lock access')+sendmsg+'</tr>'; // eresa has its own version
				let bplocked = '<td id="'+eids.locked+'" class="blueprint">'+C_XL.w('bp locked')+'</td>';
			let lockedbp = '<tr>'+'<td></td>'+bplocked+'<td></td>'+'</tr>';

		// let passwords = '<div style="min-height:330px; height:330px; border:1px solid red;"><table class="coords" style="max-width:44em;">'+loginarea+passarea+locked+lockedbp+'</table></div>';
		let passwords = '<div style=""><table class="coords" style="max-width:44em;">'+loginarea+passarea+locked+lockedbp+'</table></div>';
		let tab8 = this.controls.tabs.container(8, passwords);
		this.controls.tabs.hide(8, this.is.eresa);
		
		// tracking
			let tracking = this.dS.tracking();
			let key = this.controls.akeys.audit();
			
			let accmanagment = '';
			if(mobminder.context.surfer.is.atleast.seller&&!this.is.eresa&&!this.is.sync) {
				let decision = '<tr>'+this.controls.decision.labelled('is a decision maker')+'</tr>';
				let aienabled = '<tr>'+this.controls.aienabled.labelled('has AI assistant enabled')+'</tr>';
				accmanagment = '<div>'+'<table style="margin:1em auto;">'+decision+aienabled+'</table>'+'</div>';
			}		
			
		let tab9 = this.controls.tabs.container(9, tracking+key+accmanagment);
		
		
		// SEO (not displayed if this login is under seller accessLevel)				
			let eSeo = this.controls.eresaSEO.display();
		let tab10 = this.controls.tabs.container(10, eSeo);
		if(!this.is.eresa) this.controls.tabs.hide(10, true);
		if(!this.is.surfer.atleast.seller) this.controls.tabs.hide(10, true);
		
		if(this.state.reduced) { // popping up from T_bar after a feedback from M_iSECURITY, see (*cr02*)
			// in reduced mode, the user can only fix their creds or coordinates
			this.controls.tabs.hide(0, false); // coordinates
			this.controls.tabs.hide(1, true);
			this.controls.tabs.hide(2, true);
			this.controls.tabs.hide(3, true);
			this.controls.tabs.hide(4, true); 
			this.controls.tabs.hide(5, true);
			this.controls.tabs.hide(6, true);
			this.controls.tabs.hide(7, true);
			this.controls.tabs.hide(8, false); // creds
			this.controls.tabs.hide(9, true);
			this.controls.tabs.hide(10, true);
		}
		
		return tab0+tab1+tab2+tab3+tab4+tab5+tab6+tab7+tab8+tab9+tab10;
	},
	activate: function() {
		if(vbs) vlog('modals.js','M_LOGIN','activate','activate');
		this.controls.activate('M_LOGIN');
		this.elements.collect(this.eids.own);
		this.settitle();
		this.setlockedbp();
		$(this.controls.ical.elements.ui).removeClass('disabled');
		$(this.controls.ipad.elements.ui).removeClass('disabled');
		this.color(this.dS.color,{norecord:true});
		this.credscheck('login',undefined,{norecord:true}).credscheck('pass',undefined,{norecord:true}); // updates blueprints higlight acording to initial field content
		this.controls.creds.locked.enable(mobminder.context.surfer.is.atleast.manager&&!this.is.connected);
		this.ontab(this.state.tab);
		return this;
	},
	
	// private
	settitle: function() {
			let title = '', subtitle = '', bullet = '';
			let level = ' - '+C_XL.w(aLevel.name(this.dSclone.accessLevel));
		if(this.dSclone.id <= 0) title = C_XL.w('new login')+level;
		else {
			switch(this.dSclone.accessLevel) {
				case aLevel.synchro: title = this.dSclone.firstname+level; break;
				case aLevel.eresa: title = this.dSclone.url(); break;
				default:
					let connected = ''; if(this.is.connected) connected = C_XL.w('logged in');
					let phylactag = C_dS_loggable.phylactag(this.dSclone, 'big');
					let initials = this.dSclone.firstname[0]+'. '+this.dSclone.lastname;
					title = C_XL.w('login')+': '+initials+level;
					subtitle = connected;
					bullet = '<div style="padding-left:1.6em; font-size:1.6em;">'+phylactag.bullet+'</div>';
			}
		}
		this.elements.title.innerHTML = title;
		this.elements.subtitle.innerHTML = subtitle;
		this.elements.ltag.innerHTML = bullet;
	},
	cleanup: function() {
		if(this.dS.id>0) {
			
			// logo
			if(this.dS.accessLevel==aLevel.eresa) {
				let dS_logo = C_dS_logo.get(this.dS.id); // (we always keep the account logo, only specific logos are removed)
				if(dS_logo) C_dS_logo.del(dS_logo.id);
			}
			
			// config
			C_dS_loggable.del(this.dS.id);
			if(this.is.connected) C_dS_loggedIn.del(this.dS.id); // then this login was currently logged on
		}
	},	
	checkout: function() { // checks if you are attempting to quit while the user modified some fields
		if(this.state.modified) {
				let defaultmsg = C_XL.w('checkout confirm');
				let msg = defaultmsg;
			new C_iMSG(msg, { onChoice:new A_cb(this, this.quitChoice) }, { interactivity:'confirm' } );
			return false;
		}
		return true; // go close

	},
	checkin: function() {
		let data = new C_iPASS({l:this.dS.login, p:this.dS.password});
		new A_ps({data:data}, {data:{l:'l', p:'p'}}, './queries/checkin.php', {onreply:new A_cb(this,this.checkedin), ontimeout:new A_cb(this,this.failed)});
		mobminder.sounds.openup.play();
		return this;
	},
	setlockedbp: function() {
			let lbp = this.elements.credshelps.locked;
			let locktip = C_XL.w('bp locktip');
			
				let fn = this.controls.ident.fname.value();
				let ln = this.controls.ident.lname.value();
				let fnorln = !!(fn+ln);
			let locked = fn+' '+ln+' '+C_XL.w('bp locked', {cap:!fnorln});
			
		setTimeout( () => { lbp.innerHTML = this.dS.locked ? locked : locktip; lbp.className = this.dS.locked ? 'orange' : 'blueprint'; }, 600);
	},
	restore: function() {
		
		if(this.dS.id<=0) return this; // new logins have no existing login/pass
		if(this.dS.accessLevel==aLevel.eresa) return this; // web pages have no login/pass
		
		values = this.wdname; names = 'lid';
			const p = new C_iPASS(this.dS.id);
		mobminder.app.post({p:p}, {p:'lid'}, './queries/taycan.php', new A_cb(this,this.restored),new A_cb(this,this.failed));
		return this;
	},
	
	// events handling
	save: function() {
		
		if(mobminder.context.surfer.accessLevel<aLevel.seller) if(!this.controls.validation()) return;
		// there is no check anymore for account managers and admins, they can adapt a login anyway they need
		
		this.modal.busy(true);
		let names = { id:{id:'id'}, 
			company:'company', gender:'gender', lang:'language', residence:'residence', addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone', prof:'profession', note:'note',
			ident: { fname:'firstname', lname:'lastname', mobile:'mobile', email:'email' },
			creds: { login:'login', pass:'password', locked:'locked' },
			staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }, 
			watchover:'watchover', notbyme:'notbyme', sndvolume:'soundsVolume', popups:'secretarypopups',
			alevel:'accessLevel', gmt:'GMT', weeknumb:'weeknumb', color:'color', tag:'tag', workcodes:'eresaWorkcodes',
			eresaInforma: { title:'eresaTitle', purl:'eresaUrl', l1label:'eresaLink1label', l1url:'eresaLink1url', l2label:'eresaLink2label', l2url:'eresaLink2url', hourlies:'eresaHourlies', directions:'eresaDirections', dirlinkLabel:'eresaDirLabel', dirlinkUrl:'eresaDirUrl'},
			eresaPreview: { palette:'eresaPalette', titlefont:'eresaFontTitle', textfont:'eresaFontText', eresaCcss:'eresaCcss', image:'eresaSkin'},
			eresaBooking: { anote:'eresaAllowNote', note:'eresaNote', auth:'eresaAuthent', blacklist:'eresaBlacklist', max:'eresaMax', limit:'eresaLimit', before:'eresaBefore', ampm:'eresaWithAMPM', sameday:'eresaSameday', sign:'eresaSignin', cancel:'eresaCancel', aggr:'eresaAggregate', rscs:'eresaRescType'},
			eresaSEO: { idmode:'eresaIdentMode', eresamode:'eresaFillingMode', indexability:'seoIndexable', canonicalink:'seoMetaCanon', metatitle:'seoMetaTitle', metadescript:'seoMetaDescr', seocomment:'seoComment'},
			syncwhat:'syncwhat', syncwhich:{bCals:'sbCals', uCals:'suCals', fCals:'sfCals' }, synccss:{ evnt:'scss_resa', resa:'scss_event', visi:'scss_visi' },
			permissions:'permissions', decision:'decision', aienabled:'aienabled' };
		mobminder.app.post(this.controls, names, './post/login.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		this.cleanup();
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:{id:'id'}};
		mobminder.app.post(this.controls, names, './delete/login.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
	},
	quit: function(options) { 
		options = options || {};
			let co = this.checkout();
		if(co) this.close(options);
		else return false;
	},
	close: function(options) { 
		options = options || {};
		this.modal.close();
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
	},
	escape: function() { // is triggered by using ESC key or a click beside the window
		let co = this.checkout();
		if(co) {
			if(this.callbacks.escaped) this.callbacks.escaped.cb();
			return true;
		}
		return false;
	},
	quitChoice: function(v) { // confirmation response
		if(v=='1') this.close(); // user confirmed to quit
		return false;
	},
	duplicate: function() {
		this.quit({slow:1000});
		if(this.callbacks.duplicate) this.callbacks.duplicate.cb();
	},
	connect: function() {
		if(vbs) vlog('modals.js','M_LOGIN','connect','this.ipadlink');
		if(this.is.eresa||this.is.sync)
			window.open(this.ipadlink, '_blank').focus(); // opens up the webpage
		else {
			this.close();
			return this.checkin(); // connects the user
		}
	},
	staff: function(selections, typechanged) {
		this.modified();
		if(vbs) vlog('modals.js','M_LOGIN','staff','typechanged:'+typechanged);
	},
	watchovers: function(selections, typechanged) {
		this.modified();
		if(vbs) vlog('modals.js','M_LOGIN','watchovers','typechanged:'+typechanged);
	},
	onname: function(which,digits) {
		if(vbs) vlog('modals.js','M_LOGIN','onname','which:'+which+', selection:'+digits);
			let lastname = this.controls.ident.lname.value();
			let firstname = this.controls.ident.fname.value();
		this.dSclone.lastname = lastname;
		this.dSclone.firstname = firstname;
		if(lastname&&firstname) this.settitle();
		this.setlockedbp(); // this blueprint uses the firstname and lastname to build a phrase
		return this.identvalid();
	},
	identvalid: function() {
		this.modified();
		this.controls.tabs.highlight(0,!this.controls.ident.isvalid()); // goes red if this subset of controls is not ok
		return this;
	},
	onlock: function(state) {
		this.dS.locked = state|0;
		this.modified().setlockedbp();
		if(vbs) vlog('modals.js','M_LOGIN','onlock','state:'+state);
	},	
	ontab: function(which) { 
		this.modal.mrefresh();
		if(vbs) vlog('modals.js','M_LOGIN','ontab','which:'+which);
		let focusinvalid = (tabid, ctls) => { 			
			for(let x in ctls.get) {
				let ctl = ctls.get[x];
				if(ctl.focus&&ctl.valid) if(!ctl.valid()) { ctl.focus(true); break; } // puts focus on first empty identification field
			} 
			this.controls.tabs.highlight(tabid,!ctls.isvalid()); // sets tab highlight for this group of controls if any is not correctly formated
		};
		switch(which=which|0) {
			case 0: focusinvalid(which, this.controls.ident); break; // coordinates
			case 8: focusinvalid(which, this.controls.creds); break; // credentials
		};
	},
	ondecision: function(state) {
		this.modified();
		if(vbs) vlog('modals.js','M_LOGIN','ondecision','state:'+state);
	},
	onaienable: function(state) {
		this.modified();
		if(vbs) vlog('modals.js','M_LOGIN','onaienable','state:'+state);
	},	

	
	// server feedbacks
	isfreelogin: function(isfree) { // that is an asynchronous feedback from the server where unicity of login is checked
		if(vbs) vlog('modals.js','M_LOGIN','isfreelogin','is free:'+isfree);
		let bpel = this.elements.credshelps.login; // credential help blueprint elements, which we are goign to highlight
		if(isfree) $(bpel.reserved).addClass('transparent').removeClass('orange'); else $(bpel.reserved).addClass('orange').removeClass('transparent');
	},
	
	credscheck: function(which,digits,options) { // checks the typed digits against our password format policy
		if(vbs) vlog('modals.js','M_LOGIN','credscheck','which:'+which+', selection:'+digits);
		options = options || {}; // like {norecord:true}
		let field = false, is = { login:false, pass:false };
		switch(which) {
			case 'login': is.login = true; field = this.controls.creds.login; break;
			case 'pass': is.pass = true; field = this.controls.creds.pass; break;
		}
		digits = digits || field.value(); // which is what is written inside the field, we get it from the callback arguments except when triggered from the 
		let bpels = this.elements.credshelps[which]; // credential help blueprint elements, which we are goign to highlight
	
		let twolowers = /^(?=(.*[a-zØ-öø-ÿ]){2}).{1,64}$/; // this should stay aligned with (*cr11*)
		let twouppers = /^(?=(.*[A-ZÀ-Ö]){2}).{1,64}$/;
		let twofigres = /^(?=(.*\d){2}).{1,64}$/;
		let twospcils = /^(?=(.*[\s\[\]\/+\-='€?_,.:;(){}!@$%&*]){2}).{1,64}$/; // ' is authorized but not encouraged by the blue print, as Apple keyboards use many types of different single quotes, that would be confusing
	
		if(!twolowers.test(digits)) $(bpels.smalls).addClass('orange'); 	else $(bpels.smalls).removeClass('orange');
		if(!twofigres.test(digits)) $(bpels.figures).addClass('orange'); 	else $(bpels.figures).removeClass('orange');
		if(digits.length<9||digits.length>32) $(bpels.size).addClass('orange'); else $(bpels.size).removeClass('orange');
		
		if(is.login) if(!twouppers.test(digits)) $(bpels.caps).addClass('orange'); 		else $(bpels.caps).removeClass('orange');
		if(is.login) if(!twospcils.test(digits)) $(bpels.specials).addClass('orange'); 	else $(bpels.specials).removeClass('orange');
		
			let duplicate = this.controls.creds.login.value() == this.controls.creds.pass.value();
			let pde = this.elements.credshelps.pass.duplicate;
		if(!duplicate) $(pde).addClass('transparent').removeClass('orange'); else $(pde).addClass('orange').removeClass('transparent');
		
			let allvalid = this.controls.creds.isvalid();
		this.controls.tabs.highlight(8,!allvalid); // goes red if this subset of controls is not ok
		this.controls.creds.sendmsg.disable(!allvalid); // it is not possible to send a message until all controls are ok
		if(!options.norecord) this.modified();
		return this;
	},
	color: function(ccode,options) {
		if(vbs) vlog('modals.js','M_LOGIN','color','selection:'+ccode);
		options = options || {}; // like {norecord:true}

		if(ccode==0) // the none color was selected
			this.modal.setmborder(0);
		this.modal.setmborder(ccode);		
		
		this.dSclone.color = this.controls.color.value()|0;
		if(!options.norecord) this.modified();
		return this.settitle();	
	},
	tag: function(t) {
		if(vbs) vlog('modals.js','M_LOGIN','tag','selection:'+t);
		this.dSclone.tag = this.controls.tag.value()|0;
		this.modified();
		return setTimeout( () => this.settitle(), 1000); // if that ain't smart code :P
	},
	onnotbyme: function(p) { // p is [1 or 0]
		if(vbs) vlog('modals.js','M_LOGIN','onnotbyme','selection:'+p);
		this.modified();
	},
	onalevel: function(s) {
		if(vbs) vlog('modals.js','M_LOGIN','onalevel','selection:'+s);
		this.modified();
	},
	onsecretarypopups: function(s) {
		if(vbs) vlog('modals.js','M_LOGIN','onsecretarypopups','selection:'+s);
		this.modified();
	},
	
	checkedin: function(stream) {
		const key = stream.split('!').shift()|0;
		if(vbs) vlog('modals.js','M_LOGIN','checkedin','key='+key); 
		if(key) { // valid login case
			mobminder.app.controls.top.loginok(key);
		} 
	},
	restored: function(inlineDataSets, stream) {
		const io = stream.extract('<in>','</out>').match;
		
		const s = io.split('|');
		const l = s[0], p = s[1];
		this.dS.restore(mobminder.context.keyId, l, p); // see (*cr50*)
		
		this.controls.creds.login.ui(this.dS.login).changed(false,{propagate:false}); // ui() skips propagation, set() offers propagation and other options
		this.controls.creds.pass.ui(this.dS.password).changed(false,{propagate:false});
		
		// we skipped the propagation through the regular handler because it is delayed, and we need this.state.modified to stay false
		this.credscheck('login',undefined,{norecord:true}).credscheck('pass',undefined,{norecord:true}); // updates blueprints higlight acording to initial field content		
		
		// this.state.modified = false; // is accomplished through {norecord:true}
		return this;
	},
	
	
	// callbacks
	credssuggestionpreset: function() {
			let fn = this.controls.ident.fname.value();
			let ln = this.controls.ident.lname.value();
			let mb = this.controls.ident.mobile.value();
			let ml = this.controls.ident.email.value();
				let pf = this.controls.prof.getpost();
			pf = this.controls.prof.options.labels[pf];
		return { firstname:fn, lastname:ln , mobile:mb , email:ml , profession:pf };
	},
	getmsgmediums: function() {
			let mb = this.controls.ident.mobile.value();
			let ml = this.controls.ident.email.value();
			let lg = this.controls.creds.login.value();
			let ps = this.controls.creds.pass.value();
		return { mobile:mb, email:ml, login:lg, pass:ps };
	},
	lpsuggselect: function(ctl, sugg) { 
		if(sugg.value == 999) {
			this.controls.tabs.set(0); // jumps to coordinates tab see (*ch03*)
			for(let x in this.controls.ident.get) {
				let ctl = this.controls.ident.get[x];
				if(ctl.value()=='') { ctl.focus(true); break; } // puts focus on first empty identification field
			}
		}
		else ctl.set(sugg.label); // writes choosen suggestion into the login or pass field ( ctl indicates which control to target )
	}, // pushes the suggestion select into the appropriate login or pass field
	onmediumselect: function(choice) { 
		if(choice.value == 999) {
			this.controls.tabs.set(0); // jumps to coordinates tab see (*ch08*)
			for(let x in this.controls.ident.get) {
				let ctl = this.controls.ident.get[x];
				if(ctl.value()=='') { ctl.focus(true); break; } // puts focus on first empty identification field
			}
		}
	},
	modified: function() {
		this.state.modified = true;
		// console.log('M_LOGIN::modified()');
		return this;
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		// generic part
		let dataset = inlineDataSets['C_dS_login'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
		this.close();
	},	
	deleted: function(inlineDataSets, stream) {
		this.quit();
		let split = stream.split('##');
		if(split.shift()=='0') return; // error code, the deletion was not successful
		this.cleanup(); // removes the login from local data
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dS);
	},
	failed: function() { 
		this.modal.busy(false);
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    M _ V I S I 
//

function M_VISI(dS_visitor, callbacks, preset) {

		if(!dS_visitor) dS_visitor = new C_dS_visitor(); 
	this.dataSet = dS_visitor;
	this.state = M_VISI.defaults.align(preset = preset || {});
	this.state.extended = !!(this.dataSet.company.length+this.dataSet.residence.length+this.dataSet.reference.length);
		
	this.callbacks = callbacks || {}; // like { saved:A_cb, escaped:A_cb, merged:A_cb, failed:A_cb };
	const b = 'visi_L'+C_iMODAL.layer+'_'+this.dataSet.id+'_';
	const w = b+'_wrap_';
	this.eids = { id:b+'id', tabs:b+'tabs'
		, company:b+'comp', fname:b+'fname', lname:b+'lname', gender:b+'gender', mobile:b+'mobile', lang:b+'lang', bdate:b+'bdate'
		, color:b+'color', pattern:b+'pattern', tags:b+'tags'
		, addr:b+'addrss', resid:b+'resid', zip:b+'zip', city:b+'city', country:b+'country', phone:b+'phone', email:b+'email', regist:b+'regist', refer:b+'refer'
		, extend:b+'xtnd', ntctabs:b+'ntc', vcopy:b+'vcpy'
		, info:b+'info', resas:b+'resas', dupli:b+'dupli', vical:b+'vical', duplimsg:b+'duplimsg', ampm:b+'ampm', flplus:b+'flpl'
		, buttons:{ note:b+'b_nts', task:b+'b_tsk', chat:b+'b_cht', dqs:b+'b_dqs', aeject:b+'ajct' }
		, iarrays:{ notes:b+'rr_nts', tasks:b+'rr_tsk', chats:b+'rr_cht', files:b+'rr_fls'}
		, wrappers:{ 
			  fllist:w+'fllist', extend:w+'wxtnd', company:w+'wcmp', residence:w+'wres', refer:w+'rfer', fbprint: w+'fbprnt'
			, vcopy:w+'wvcpy', pastappscnt:w+'pappscnt', age:w+'age', avatar:w+'avatar', cake:w+'cake', tags:w+'tags' }
			, visiapps: { plannedapps: w+'plndapps', sremv:w+'sremv', smail:w+'smail', print:w+'print' }
		};
	this.elements = new A_el();
	
	this.icons = C_dS_visitor.icons;
	
	const cartouche	= new C_iDQS(this.eids.buttons.dqs, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:false/*(this.dataSet.id>0)*/ });
	const id			= new C_iPASS(this.dataSet.id);
	
		let lastname = this.dataSet.lastname;
		let firstname = this.dataSet.firstname;
		let mobilenbr = this.dataSet.mobile;
		let registra = this.dataSet.registration;
	if(this.dataSet.id<=0) if(preset.digits) { // retrieve name, mobile and registration from digits typed in the AC field
			let parsed = this.parsevdigits(preset.digits);
		lastname = parsed.lastname;
		firstname = parsed.firstname;
		mobilenbr = parsed.mobile;
		registra = parsed.registra;
	}
	const modified = new A_cb(this,this.modified);
	const addressmodified = new A_cb(this,this.addressmodified);
		
	const note = mobminder.account.usenotes ? new C_iCLIK(this.eids.buttons.note, { click:new A_cb(this, this.newnote) }
		, { enabled:this.state.remove, tip:C_XL.w('tip newnote'), css:'modal-button fa fa-gray fa-tags touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.alt+C_KEY.code.alpha.n /*n like note*/] }) : false;
		
	const task = mobminder.account.usetasks ? new C_iCLIK(this.eids.buttons.task, { click:new A_cb(this, this.newtask) }
		, { enabled:this.state.remove, tip:C_XL.w('tip newtask'), css:'modal-button fa fa-gray fa-thumbtack touch-orange', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.alt+C_KEY.code.alpha.t /*t like chat*/] }) : false;

	const chat = mobminder.account.usechat ? new C_iCLIK(this.eids.buttons.chat, { click:new A_cb(this, this.newchat) }
		, { enabled:this.state.remove, tip:C_XL.w('tip newchat'), css:'modal-button fa fa-gray fa-comments touch-orange', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.alt+C_KEY.code.alpha.m /*m like message*/] }) : false;
		
	const company		= new C_iFIELD(this.eids.company, {onfchange:modified}, { digits:this.dataSet.company, type:INPUT_NAMES, mandatory:false, focus:false });
	
	let lname;
	if(this.dataSet.id>0 || is.tactile || is.newtouch) lname = new C_iFIELD(this.eids.lname, {onfchange:modified}, { digits:lastname, type:INPUT_NAMES, mandatory:true, focus:true });
		else // this auto-complete help applies only for mouse devices and when the dS is new
			lname = new C_iAC(this.eids.lname, C_lastname, { acselect:new A_cb(this,this.lnacselect) }, { inputtype:INPUT_NAMES, digits:lastname, autoclose:true, mandatory:true, postlabel:true, tabselect:false, focus:false, placeholder:C_XL.w('lastname') } );
	
	const fname 		= new C_iFIELD(this.eids.fname, {onfchange:new A_cb(this, this.fname, null, modified, 1000)}, { digits:firstname, type:INPUT_NAMES, mandatory:true });
	const gender		= new C_iGENDER(this.eids.gender, {select:modified}, { gender:this.dataSet.gender, force:(this.dataSet.id == 0) } );
	const mobile 		= new C_iFIELD(this.eids.mobile, {onfchange:new A_cb(this, this.mobile, null, modified, 1000)}, { digits:mobilenbr, type:INPUT_MOBILE, mandatory:false });
	const lang			= new C_iSPEAK(this.eids.lang, {}, { value:this.dataSet.language } );
	const bdate 		= new C_iFIELD(this.eids.bdate, {onfchange:new A_cb(this, this.onbd, null, modified, 1000)}, { digits:this.dataSet.birthday, type:INPUT_BDATE, mandatory:false, placeholder:C_XL.w('dd-mm-yyyy',{cap:0}) });
	
	const color			= new C_iCSS(this.eids.color, {select:new A_cb(this, this.oncolorselect)}, { cssclass:class_visitor, csstype:ccsstype.color, value:this.dataSet.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, {select:new A_cb(this, this.onpatternselect)}, { cssclass:class_visitor, csstype:ccsstype.pattern, value:this.dataSet.cssPattern, enabled:true } /*preset*/ );
	
	// address, zip, city, country
	const aeject = new C_iCLIK(this.eids.buttons.aeject, { click:new A_cb(this, this.onaeject) } // address fields cleanup (zip, address, city, country)
		, { enabled:true, tip:{text:C_XL.w('tip clear address')}, css:'field-button fa-gray fa fa-eject fa-rotate-90 touch-red', style:'margin-left:.6em;', ui:'', tag:'div'
		, keys:[] } );
	let addr;
	if ([32,33,352].includes(mobminder.account.phoneRegion)) { // PVH2025 so far our stat_addresses table contains only lu, be and fr addresses
			const ph = ''; // C_XL.w('find an address');
			const dg = this.dataSet.address;
			const zcb = new A_cb(this, this.getzipvalue); // when our auto-complete needs to over-query filter using current zip value, it calls this callback
		const preset = { inputtype:INPUT_ADDRESSES, digits:dg, autoclose:true, mandatory:false, postlabel:true, tabselect:false, focus:false, placeholder:ph, zipgetcb:zcb };
		addr 		= new C_iAC(this.eids.addr, C_dS_stat_address, { acselect:new A_cb(this,this.adrssselect), onfchange:addressmodified }, preset );
	} else 
		addr 		= new C_iFIELD(this.eids.addr, {onfchange:addressmodified}, { digits:this.dataSet.address, type:INPUT_NAMES, mandatory:false });	
	
	const residence	= new C_iFIELD(this.eids.resid, {onfchange:addressmodified}, { digits:this.dataSet.residence, type:INPUT_NAMES, mandatory:false });
	
	// let zip 		= new C_iFIELD(this.eids.zip, {onfchange:modified}, { digits:this.dataSet.zipCode, type:INPUT_NAMES, mandatory:false });
		const zipreset = { inputtype:INPUT_NAMES, digits:this.dataSet.zipCode, autoclose:true, mandatory:false, postlabel:true, tabselect:false, focus:false , buttons:{eject:aeject} };
	const zip 		= new C_iAC(this.eids.zip, C_dS_stat_zip, { acselect:new A_cb(this,this.zipselect), onfchange:addressmodified }, zipreset );
	
	const city 		= new C_iFIELD(this.eids.city, {onfchange:addressmodified}, { digits:this.dataSet.city, type:INPUT_NAMES, mandatory:false });
	const country		= new C_iFIELD(this.eids.country, {onfchange:addressmodified}, { digits:this.dataSet.country, type:INPUT_NAMES, mandatory:false });

	// miscellaneous
	const phone 		= new C_iFIELD(this.eids.phone, {onfchange:new A_cb(this, this.phone, null, modified, 1000)}, { digits:this.dataSet.phone, type:INPUT_PHONE, mandatory:false });
	const email 		= new C_iFIELD(this.eids.email, {onfchange:modified}, { digits:this.dataSet.email, type:INPUT_EMAIL, mandatory:false });
	const refer			= new C_iFIELD(this.eids.refer, {onfchange:modified}, { digits:this.dataSet.reference, type:INPUT_TEXT, mandatory:false });
	const regist		= new C_iFIELD(this.eids.regist, {onfchange:modified}, { digits:registra, type:INPUT_TEXT, mandatory:false });
	
	
	// extends to international coordinates: displays residence, reference, and miscellaneous info fields
	// let extend 		= new C_iBUTTON.standard(this.eids.extend, new A_cb(this, this.extend), 'plus' ); 
				const extstyle = 'height:1.3em; text-align:right; padding-right:.2em; line-height:1.3em;';
		const extlook = { tag:'div', ui:'', css:'fad fa-17x fa-sort-size-up-alt mob-txt-blue', style:extstyle, tip:C_XL.w('visimodal more fields'), enabled:true };
	const extend = new C_iCLIK(this.eids.extend, { click:new A_cb(this, this.extend) }, extlook );

	
	const visicopy 	= new C_iAC(this.eids.vcopy, C_dS_visitor, { acselect:new A_cb(this, this.vselect), acclear:new A_cb(this, this.vclear)},  { focus:true, placeholder:C_XL.w('copy from visitor')} );

	const ampm 		= new C_iAMPM(this.eids.ampm, {}, {encoded:this.dataSet.prefAMPM} );
	
		// let rows = 12+(mobminder.account.usefiles?6:0); if(is.newtouch) rows = 8;
		let rows = 17; if(is.newtouch) rows = 8;
	const info 		= new C_iNOTE(this.eids.info, this.dataSet.note, {rows:rows}, { onfchange:modified } );
	const tags		= new C_iCSS(this.eids.tags, { select:new A_cb(this, this.ontags, null, modified, 300) }, { cssclass:class_visitor, csstype:ccsstype.tag, value:this.dataSet.cssTags, enabled:true } /*preset*/ );
	
	const duplicates 	= new C_iACPICK(this.eids.dupli, C_dS_visitor, { changed:new A_cb(this, this.dupliselect), cleared:new A_cb(this, this.dupliclear) },  { placeholder:C_XL.w('vduplicate'), exclude:this.dataSet.id, ismulti:true } );
	const vical 		= new C_iFIELD(this.eids.vical, false, { digits:this.dataSet.vical(), type:INPUT_TEXT, mandatory:false, enabled:false }); 

	// button for adding files
	// let flplus 		= new C_iBUTTON.standard(this.eids.flplus, new A_cb(this, this.flplus), 'plus' );
				const flstyle = ''; // 'height:1.3em; text-align:center; width:10em; line-height:1.3em;';
				const fltip = {text:C_XL.w('visimodal more file')};
		const flpluslook = { tag:'div', ui:'', css:'modal-button fa fa-17x fa-layer-plus mob-txt-lime touch-blue', style:flstyle, tip:fltip, enabled:true };
	const flplus = new C_iCLIK(this.eids.flplus, { click:new A_cb(this, this.flplus) }, flpluslook );

			const tabsnames = {0:'coordinates', 1:'info', 2:'appointments', 4:'folder', 5:'notes', 6:'tasks', 7:'chats', 9:'audit'}; // tab 3 (references) should not change of id, see (*vntc01*)
		let tabslabels = C_XL.w(tabsnames); if(is.newtouch) tabslabels = symbols(tabsnames, '', 'padding:0 .5em 0 .5em;');
		
			// PVH2025 - let's remove textual caps and replace most of them with faws icons (reduce space taken on tabs line)
			tabslabels[0] = '<div style="display:inline-block; width:3em; min-width:3em; position:relative; top:2px; font-size:1.4em;" class="fa fa-gray fa-id-card">'+'</div>'; // some id card looking symbol
			tabslabels[5] = this.ntc_symbol('fa-tags',0,'notes-blink-color');
			tabslabels[6] = this.ntc_symbol('fa-thumbtack fa-rotate-315',0,'tasks-blink-color');
			tabslabels[7] = this.ntc_symbol('fa-comments',0,'chats-blink-color');
			tabslabels[4] = this.ntc_symbol('fa-file-alt',0,'');
			tabslabels[1] = this.ntc_symbol('fa-edit',0,'');
			tabslabels[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
		 
		
		const helptip = C_XL.w('tip modal visi p1')+'<hr>'+C_XL.w('tip modal visi p2')+'</div>';
	const tabs = new C_iTABS(this.eids.tabs, tabslabels, { ontab:new A_cb(this, this.ontab) }, { tip:helptip, current:preset.tab||0 } );


		// const ntcxls = C_XL.w({ notes:'notes', tasks:'tasks', chats:'chats' });
	// const ntctabs 	= new C_iTABS(this.eids.ntctabs, ntcxls, { ontab:new A_cb(this, this.onntctab )} );
	
	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, note:note, task:task, chat:chat
		, company:company, lname:lname, fname:fname, gender:gender, mobile:mobile, bdate:bdate, color:color, pattern:pattern, lang:lang
		, residence:residence, addr:addr, zip:zip, city:city, country:country, phone:phone, email:email, regist:regist, refer:refer
		, extend:extend, visicopy:visicopy, sendemail:false, aeject:aeject
		, info:info, tags:tags, ampm:ampm, duplicates:duplicates, vical:vical, flplus:flplus } );
	
	this.set_ntc_counters(); // changes captions into iconic display

			let rtypescount = 1 + (mobminder.account.has.uCal?1:0) + (mobminder.account.has.fCal?1:0); // there is at least always one bCal, that ranges [1,2,3]
			let xsize = 800 + rtypescount*40; // ranges [ 840, 880, 920]
				
			let width = xsize; if(mobminder.account.usefiles) width+=40; // makes room for all the tabs...
			
			let height = 310; if(mobminder.account.usefiles) height+=20;
		let size = {x:width, miny:height, maxy:height+100};
	
	if(is.newtouch)
		this.modal = new C_tMODAL({header:this.header(), body:this.body()}, {}, { position:{top:'9em'} });
	else {
		this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:size, moves:true, morecss:{ outlet:'M_VISI' } } );
		tabs.state.helpeid = this.modal.eids.outset; // keep this line before activate
		this.activate(); // autopop is true by default in C_iMODAL
	}
	
	if(this.dataSet.id<=0) if(preset.digits) this.fname(firstname);
	
	this.rrchats = new C_iARRAY(this.eids.iarrays.chats, new C_catalyst(C_dS_chat_thread.catalyst_visitab), {onrow:new A_cb(this, this.onchat)}, {count:true, endoflist:true } ); 
	this.rrnotes = new C_iARRAY(this.eids.iarrays.notes, new C_catalyst(C_dS_note_detail.catalyst_visitab), {onrow:new A_cb(this, this.onnote)}, {count:true, endoflist:true } ); 
	this.rrtasks = new C_iARRAY(this.eids.iarrays.tasks, new C_catalyst(C_dS_task_description.catalyst_visitab), {onrow:new A_cb(this, this.ontask)}, {count:true, endoflist:true } ); 
	
		let c = C_dS_file.catalyst_visitab;
			c.object = this.dataSet; // (*ct02*)
	this.rrfiles = new C_iARRAY(this.eids.iarrays.files, new C_catalyst(c), {onrow:new A_cb(this, this.onfile)}, {count:true, endoflist:true, style:'width:calc(100% - 28px); max-width:calc(100% - 28px);' } ); 

	if(this.dataSet.id>0) this.callforapps();
	
}
M_VISI.defaults = new A_df( { digits:'', parent:false, extended:false, embedded:false, modified:false, visitorapps:0, plannedappssortdir:1 } );
M_VISI.prototype = { 
	// private
	parsevdigits: function(digits) {
		let lastname = '', firstname = '', mobile = '', registra = ''; 
		let dsplit = digits.split(', ');
		let left = dsplit.shift() || false;
		let right = dsplit.shift() || false;
		if(left) if(left.composition()=='alpha') lastname = left.replace(/ /gi, '').capitalize(); // lastname, may contain particules
			else right = left; else right = left;
		if(right) { // can be smth like 'Jean-Noël 0497401626 JDK998' or '0497401626 JDK998'
			let p1, p2, p3, t1, t2, t3, rightsplit = right.split(' ');
			p1 = rightsplit.shift() || false; if(p1) t1 = p1.composition(); else t1 = false; // see (*mv01*)
			p2 = rightsplit.shift() || false; if(p2) t2 = p2.composition(); else t2 = false;
			p3 = rightsplit.shift() || false; if(p3) t3 = p3.composition(); else t3 = false;
			switch(t3) { case'alpha':firstname=p3.capitalize(); break; case'num':mobile=p3; break; case'alphanum':registra=p3; break; }
			switch(t2) { case'alpha':firstname=p2.capitalize(); break; case'num':mobile=p2; break; case'alphanum':registra=p2; break; }
			switch(t1) { case'alpha':firstname=p1.capitalize(); break; case'num':mobile=p1; break; case'alphanum':registra=p1; break; }
		}
		return { lastname:lastname, firstname:firstname, mobile:mobile, registra:registra }
	},
	header: function() {
		
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let note 	= this.controls.note ? this.controls.note.display() : '';
			let task 	= this.controls.task ? this.controls.task.display() : '';
			let chat 	= this.controls.chat ? this.controls.chat.display() : '';
			let anyntc 	= (!!note||!!task||!!chat)&&this.dataSet.id>0; // no task or note creation for a visitor under creation process
		let ntc = anyntc?'<td class="cartouche">'+note+task+chat+'</td>':'';
			
		if(is.small&&is.portrait) {
			let divTitle = '<h1 class="modal-visi" style="">'+this.title()+'</h1>'; // class modal-visi on h1, see (*mc02*)
				let padtd = '<td width=90%></td>'; // makes the wide blank space between buttons and blue title
			let divButtons = '<div class="buttons"><table summary="header layout" style="width:100%;"><tr>'+buttons+padtd+'</tr></table></div>';
			let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('blue')+'</div>';
			return divTitle+divButtons+divTabs;
			
		} else { // mouse webApp
						let pstyle = 'width:90%; text-align:center; font-weight:bold; bottom:-6px; left:0px; opacity:.4;';
					let pastappscnt = '<div id="'+this.eids.wrappers.pastappscnt+'" class="deltarea max f-lato mobtext" style="'+pstyle+'">'+''+'</div>';
					
					let title = '<td class="" style="padding-left:2em; vertical-align:top;"><h1 class="modal-visi">'+this.title()+'</h1></td>'; // td3
				let table = '<table summary="header layout" style="width:100%; margin-bottom:1em; min-height:4.8em;"><tr>'+buttons+ntc+title+'</tr>'+'</table>';
			
			let divHeader = '<div class="buttons" style="padding-bottom:0;">'+table+'</div>';
			let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-visi', { tdstyle:'', lefter:pastappscnt })+'</div>'; // class modal-visi, see (*mc01*)
			return divHeader+divTabs;
		}
	},
	body: function(css) {

				const mobilabel = this.makeatel('mobile',this.controls.mobile.getpost());
				const phonelabel = this.makeatel('phone',this.controls.phone.getpost());
				const isnew = this.dataSet.id <= 0;
				
			// coordinates left side
			const company = '<tr id="'+this.eids.wrappers.company+'" style="display:none">'+this.controls.company.labelled('company')+'</tr>';
			const lname = '<tr>'+this.controls.lname.labelled('lastname')+'</tr>';
			const fname = '<tr>'+this.controls.fname.labelled('firstname')+'</tr>';
			const gender = this.controls.gender.labelled('gender', 'alpha06');
			const mobile = '<tr>'+this.controls.mobile.labelled(mobilabel,'',{xl:false})+'</tr>';
			const lang = this.controls.lang.labelled('language', 'alpha10');
			const bdate = '<tr>'+this.controls.bdate.labelled('birthdate', 'alpha10')+'</tr>';
			const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha14')+'</tr>':'';
			const pattern = this.controls.pattern.hasany()?'<tr>'+this.controls.pattern.labelled('status', 'alpha14')+'</tr>':'';
			
			// coordinates right side
			const residence = '<tr id="'+this.eids.wrappers.residence+'" style="display:none">'+this.controls.residence.labelled('residence')+'</tr>';
			const addr = '<tr>'+this.controls.addr.labelled('address','alpha20')+'</tr>';
			const city = '<tr>'+this.controls.city.labelled('city')+'</tr>';
			const zip = '<tr>'+this.controls.zip.labelled('zipCode','alpha12')+'</tr>';
			const country = '<tr>'+this.controls.country.labelled('country')+'</tr>';
			const phone = '<tr>'+this.controls.phone.labelled(phonelabel,'',{xl:false})+'</tr>';
			const email = '<tr>'+this.controls.email.labelled('email','alpha20')+'</tr>';
			const refer = '<tr id="'+this.eids.wrappers.refer+'" style="display:none">'+this.controls.refer.labelled('reference')+'</tr>';
			const regist = '<tr>'+this.controls.regist.labelled('registration','alpha20')+'</tr>';
			
			const extend = '<tr id="'+this.eids.wrappers.extend+'" style="height:3em"><td></td><td style="text-align:right;">&nbsp;'+this.controls.extend.display()+'</td></tr>';
		
		let coord = '';
		let visicopy = ''; if(this.dataSet.id==0) visicopy = '<div id="'+this.eids.wrappers.vcopy+'">'+this.controls.visicopy.display('alpha28')+'</div>';
		if(is.small) {
				let margin = is.newtouch?'':' margin-top:2em;';
			coord = '<table class="coords" style="text-align:left;'+margin+'">'+company+lname+fname+gender+mobile+lang+bdate+refer+color+pattern+residence+addr+city+zip+country+phone+email+regist+extend+'</table>';
		} else {
				let coordsLeft = '<td style="vertical-align:top"><table>'+company+lname+fname+gender+mobile+lang+bdate+refer+color+pattern+'</table></td>';
				let coordsRight = '<td style="vertical-align:top"><table>'+zip+city+residence+addr+country+phone+email+regist+extend+'</table></td>';
			coord = '<table class="coords" style="text-align:left; margin-top:1em;"><tr>'+coordsLeft+'<td style="width:5%;">&nbsp;</td>'+coordsRight+'</tr></table>';
		}
		
		let tab0 = this.controls.tabs.container(0, visicopy+coord);

		// patient information
		
			let n = this.controls.info.display('textcolor-light','alpha080','visitor info');
			let t = this.controls.tags.display();
			let pi = '';
			
			if(is.newtouch) {
					let note = '<div>'+n+'</div>';
					let tags = '<div>'+t+'</div>';
				pi = note + tags;
			} else {
					let info = '<td style="width:100%;">'+n+'</td>';
					let tags = '<td style="vertical-align:top; padding-left:2em; padding-top:1em; max-width:150px; overflow:hidden;">'+t+'</td>';
				pi = '<table summary="visitor note and tags" style="width:90%; margin:0 auto;"><tr>'+info+tags+'</tr></table>';
			}
		let tab1 = this.controls.tabs.container(1, pi);
		
		let tab2 = this.controls.tabs.container(2, C_XL.w('loading'));
			if(isnew) this.controls.tabs.hide(2, true);
		
		
		// patient references in notes, tasks and chats
		//
		// 5:'notes', 6:'tasks', 7:'chats'
		//
				let unotes = mobminder.account.usenotes, utasks = mobminder.account.usetasks, uchats = mobminder.account.usechat;
				let unone = !(unotes||utasks||uchats);
			const tab5 = this.controls.tabs.container(5, 'this updates shortly', 'wide deep' ); // empty, filled by this.freshdata()
			const tab6 = this.controls.tabs.container(6, 'this updates shortly', 'wide deep' );
			const tab7 = this.controls.tabs.container(7, 'this updates shortly', 'wide deep' );
			this.controls.tabs.hide(5, !unotes||isnew);
			this.controls.tabs.hide(6, !utasks||isnew);
			this.controls.tabs.hide(7, !uchats||isnew);

		// files 
					let ufiles = mobminder.account.usefiles;
				let fbp = '<div id="'+this.eids.wrappers.fbprint+'" class="blueprint" style="max-width:70%;">'+''+'</div>'; //+'<div>&nbsp;</div>';
			let bpstyle = 'display:flex; align-content:top; justify-content:space-between; margin:0; text-align:right; padding:0 10%;';
		let flplus = '<div style="'+bpstyle+'">'+this.controls.flplus.display()+fbp+'</div>';
		let fllist = '<div id="'+this.eids.wrappers.fllist+'"></div>';
		let tab4 = this.controls.tabs.container(4, flplus+fllist);
		this.controls.tabs.hide(4, (!ufiles)||isnew);
		
		// file tracking
				let tracking = '<td style="vertical-align:top;">'+this.dataSet.tracking()+'</td>'; // that is a <table>
				let ampmprefs = '<td rowspan=2 style="vertical-align:top; padding-left:2em">'+C_XL.w('preferences')+':'+this.controls.ampm.display()+'</td>';
				
				let duplicates = '';
				if(!isnew) {
					let dupli = '<tr><td style="height:3.4em; min-height:3.4em; vertical-align:top;">'+this.controls.duplicates.display()+'</td></tr>';
					let warning = '<tr><td style="height:5em; min-height:5em; vertical-align:top;"><div id="'+this.eids.duplimsg+'" class="blueprint" style="display:none;">'+C_XL.w('dupli resolution')+'</div></td></tr>';
					duplicates = '<table style="width:36em; margin:2em 0 0 0;">'+dupli+warning+'</table>';
				}
				duplicates = '<tr><td>'+duplicates+'</td></tr>';
				
				let vical = '<tr><td colspan=2>'+'<table style="margin-top:1em;"><tr>'+this.controls.vical.labelled('ical link', 'alpha32')+'</tr></table>'+'</td></tr>';
			
			let audit = '<table style="margin:2em auto;"><tr>'+tracking+ampmprefs+'</tr>'+duplicates+vical+'</table>'
		let tab9 = this.controls.tabs.container(9, audit);
		
		// return '<div>'+tab0+tab1+tab2+tab3+tab4+tab9+'</div>'; // this div is the target of IScroll when running on touch devices
		return '<div>'+tab0+tab1+tab2+tab4+tab5+tab6+tab7+tab9+'</div>'; // this div is the target of IScroll when running on touch devices
	},
	activate: function() {	
		this.elements.collect(this.eids); 
		this.controls.activate('M_VISI'); 
		$(this.controls.vical.elements.ui).removeClass('disabled');
		this.modal.mposition().mrefresh();
		if(this.state.extended) this.extend();
		this.oncolorselect(this.dataSet.cssColor);
		this.onpatternselect(this.dataSet.cssPattern);
		this.setage();
		this.addressmodified(true);
		new C_KEY([C_KEY.code.alpha.d+C_KEY.code.s.ctrl], new A_cb(this, this.ctrlD), 'M_VISI::'+this.eids.eid); // Deleted items
		return this;	
	},
	
	// private
	title: function() { // upper right h1 title on the modal header
			let xlo = { cap:true };
		
		let i = this.icons.usernew;
		let n = C_XL.w('new visitor');
		if(this.dataSet.id > 0) {
			i = this.icons.userdefault;
			n = this.dataSet.vname();
		}
			
					let astyle = 'width:100%; text-align:center; font-weight:bold; bottom:-1.6em; left:0px; opacity:.4;';
				let age = '<div id="'+this.eids.wrappers.age+'" class="deltarea min f-lato mobtext" style="'+astyle+'">'+''+'</div>';
				let avatar = '<div style="" id="'+this.eids.wrappers.avatar+'">'+i+'</div>';
				let cake = '<div style="padding-right:.6em; display:none; line-height:.9em;" id="'+this.eids.wrappers.cake+'" class="fad fa-birthday-cake fa-15x">'+'</div>';
			
				let combo = '<div style="display:inline-block; position:relative; width:2.4em; height:1.4em; text-align:center; line-height:1.2em;">'+avatar+age+'</div>';
				let tags = '<div style="padding-right:60px; font-size:9pt; line-height:14pt;" id="'+this.eids.wrappers.tags+'">'+this.dataSet.vtags({marginbetween:'6px'})+'</div>'; // initialized with what is found in the dataSet
			let name = '<div style="display:inline-block; padding-right:.4em;">'+cake+n+'</div>'+combo+tags;
		if(this.dataSet.deletorId) name = C_XL.w('merged',xlo)+symbol('user-deleted');
		
		let title = name;
		return title;
	},
	callforapps: function() { // fetch info about previous and future appointments
		if(this.dataSet.id <= 0) return; 
		
		mobminder.app.post(this.controls, {id:'id'}, './queries/visitorapps.php', new A_cb(this,this.visitorapps), new A_cb(this,this.visitorappsfailed));
		C_dS_file.register.flush();
		C_dS_resafile.register.flush();
		rmems.flush('visiapps');
		ntmems.flush('visitab');
		cmems.flush('visitab');
	},
	ntc_symbol: function(faw_name, counter, color) {
		let symbol = '<div style="font-size:1.3em; display:inline-block; width:1.6em; min-width:1.6em;" class="fa fa-gray '+faw_name+'">'+'</div>';
		let relative = counter?'<span class="'+color+' label smaller mobcolor" style="position:absolute; bottom:-3px; right:-1px;">'+counter+'</span>':'';
		return '<div class="centered" style="min-width:3em; position:relative;">'+symbol+relative+'</div>';
	},
	set_ntc_counters: function() { // we got the feedback from /query/visitorapps.php, let's update the counters
		
		// 5:'notes', 6:'tasks', 7:'chats'
		//
		let aggregated = [];
		if(mobminder.account.usenotes) {
			let plusclass = new C_dS_note_detail.plus(); 
			let items = plusclass.count(this.dataSet.id); // focus on this visitor notes // see (*nc01*)
			let s = C_XL.w('notes');
				aggregated.push(s = this.ntc_symbol('fa-tags',items,'notes-blink-color'));
			this.controls.tabs.label(5,s);
		}
		if(mobminder.account.usetasks) {
			let plusclass = new C_dS_task_description.plus();
			let items = plusclass.count(this.dataSet.id); // focus on this visitor tasks
			let s = C_XL.w('tasks');
				aggregated.push(s = this.ntc_symbol('fa-thumbtack fa-rotate-315',items,'tasks-blink-color'));
			this.controls.tabs.label(6,s);
		}
		if(mobminder.account.usechat) {
			let plusclass = new C_dS_chat_thread.plus();
			let items = plusclass.count(this.dataSet.id); // focus on this visitor chats
			let s = C_XL.w('chats');
				aggregated.push(s = this.ntc_symbol('fa-comments',items,'chats-blink-color'));
			this.controls.tabs.label(7,s);
		}
	},
	setfiletab: function() { // updates the files counter
		if(!mobminder.account.usefiles) return this;
		if(this.dataSet.id<=0) return this;
		let ends = C_dS_file.ends(this.dataSet.id);
		let cap = this.ntc_symbol('fa-file-alt',ends,'');
		this.controls.tabs.label(4,cap);
		// mobminder.app.refresh(); // no impact on graphical view
		return this;
	},
	checkout: function() { // checks if you are attempting to quit while the user modified some fields
		if(this.state.modified) {
				let defaultmsg = C_XL.w('checkout confirm');
				let msg = defaultmsg;
			new C_iMSG(msg, { onChoice:new A_cb(this, this.quitChoice) }, { interactivity:'confirm' } );
			return false;
		}
		return true; // go close

	},
	setage: function() {
		const bd = this.controls.bdate.getpost();
		this.elements.wrappers.avatar.innerHTML = this.icons.userdefault; // which is the default display
		
		if(!this.controls.bdate.valid()||bd=='') {
			this.elements.wrappers.age.innerHTML = '';
			return this;
		}
		
		// Parse out year, month (0-based), and day
		const year  = parseInt(bd.slice(0, 4), 10);
		const month = parseInt(bd.slice(4, 6), 10) - 1;  // JS months are 0–11
		const day   = parseInt(bd.slice(6, 8), 10);

		const today = new Date();
		let age = today.getFullYear() - year;

		// If today's month/day is before the birth month/day, subtract 1
		const monthDiff = today.getMonth() - month;
		if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) age--;
	
		if(bd) {
			if(age<19) this.elements.wrappers.avatar.innerHTML = this.icons.userchild;
			if(age<5) this.elements.wrappers.avatar.innerHTML = this.icons.userbaby;
			this.elements.wrappers.age.innerHTML = age;
		}
		
		if(this.elements.wrappers.cake) {// is today the birthday?
			const isToday = (
				today.getMonth() === month &&
				today.getDate()  === day
			);
			$(this.elements.wrappers.cake).hide(); if(isToday) $(this.elements.wrappers.cake).show();
		} else	
			console.log('Ouups :D');
	},
	makeatel: function(label,number) {
		let xltl = C_XL.w(label);
		let color = number?'color:rgb(var(--mob-txt-blue));':'color:transparent;';
		switch(label) {
			case 'mobile': 	xltl = '<div class="fa fa-phone fa-flip-horizontal" style="padding:0 .8em;'+color+'"></div>'+ xltl; break;
			case 'phone': 	xltl = '<div class="fa fa-phone-rotary" style="padding:0 .8em;'+color+'"></div>'+ xltl; break;
		}
		
		if(number) {
			return '<a href="tel:'+number+'" style="padding:.3em 0;">'+xltl+'</a>';
		} else 
			return xltl;
	},

	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:'id', company:'company', lname:'lastname', fname:'firstname', gender:'gender', mobile:'mobile', lang:'language', bdate:'birthday', color:'cssColor', pattern:'cssPattern'
				, residence:'residence', addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone', email:'email', regist:'registration', refer:'reference'
				, info:'note', tags:'cssTags', ampm:'prefAMPM', duplicates:'duplicates' };
		mobminder.app.post(this.controls, names, './post/visitor.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},	
	remove: function() { },
	quit: function(options) { // triggered by the [X] button
		options = options || {};
			let co = this.checkout();
		if(co) this.close(options);
		else return false;
	},
	close: function(options) { options = options || {};
		this.modal.close();
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		if(options.all) if(this.state.parent) this.state.parent.quit(options); 
	},
	escape: function() { // is triggered by using ESC key or a click beside the window
		let co = this.checkout();
		if(co) {
			if(this.callbacks.escaped) this.callbacks.escaped.cb();
			return true;
		}
		return false;
	},
	addressmodified: function(silent) {
			const res = this.controls.residence.getpost();
			const zip = this.controls.zip.getpost();
			const city = this.controls.city.getpost();
			const country = this.controls.country.getpost();
			const addr = this.controls.addr.getpost();
		this.aejectshow(!!zip|!!city|!!country|!!addr|!!res); // shows up if any of address field is not ''
		if(!silent) this.state.modified = true;
	},
	
	// event handling
	onaeject: function() { // zip eject button was hit
		this.controls.zip.set('', { propagate:false });
		this.controls.city.set('', { propagate:false });
		this.controls.addr.set('', { propagate:false } );
		this.controls.country.set('', { propagate:false });
		this.controls.residence.set('', { propagate:false });
		this.controls.zip.focus(true);
		this.aejectshow(false);
		return this;
	},
	aejectshow: function(doshow) { // delayed hide for the eject button
		if(doshow) return this.controls.aeject.hide(false);
		const aeject = this.controls.aeject;
		setTimeout( function(){ return aeject.hide(true) }, 600);
	},
	quitChoice: function(v) { // confirmation response
		if(v=='1') this.close(); // user confirmed to quit
		return false;
	},
	getzipvalue: function() { // { zip:zip, country:country, city:city } as the current fields are set
			const zip = this.controls.zip.getpost();
			const city = this.controls.city.getpost();
			const country = this.controls.country.getpost();
		return { zip:zip, country:country, city:city };
	},
	lnacselect: function() { this.controls.fname.focus(true); },
	adrssselect: function(id) { 
	
		// console.log('adrssselect ',id);
		const dS_stat_address = C_dS_stat_address.register[id];
		this.controls.zip.set(dS_stat_address.zip, { propagate:false });
		this.controls.city.set(dS_stat_address.city, { propagate:false });
		this.controls.addr.set(dS_stat_address.street+', ', { propagate:false } );
			const c = C_XL.duallettercountrycode(dS_stat_address.country); // dS_stat_zip.country is the 2 digits country code, like 'ch' for Switzerland
		this.controls.country.set(c, { propagate:false });
		
		// this.controls.phone.focus(true); // keeps the focus on address, on purpose! the user still needs to write the house number
		this.addressmodified();
	},
	zipselect: function(id) { 	
		const dS_stat_zip = C_dS_stat_zip.register[id];
		this.controls.zip.set(dS_stat_zip.zip, { propagate:false });
		this.controls.city.set(dS_stat_zip.city, { propagate:false });
			const c = C_XL.duallettercountrycode(dS_stat_zip.country); // dS_stat_zip.country is the 2 digits country code, like 'ch' for Switzerland
		this.controls.country.set(c, { propagate:false });
		
		this.controls.addr.focus(true);
		this.addressmodified();
	},
	resa: function(dS_resa) { // a reservation has been clicked from the list of planned / history resas
		if(!permissions.may(pc.op_resas)) return false;
		if(this.state.embedded) { if(this.callbacks.resaclick) this.callbacks.resaclick.cb(dS_resa); }
			else {
				new M_RESA(dS_resa, { saved: new A_cb(this, this.resasaved), deleted:new A_cb(this, this.resadeleted) }, { parent:this } );
				if(dS_resa.id>0) dS_resa.unregister();
				if(dS_resa.serieId) // this resa was part of a serie
					if(this.state.parent) // there is a parent, see (*rs05*)
						if(this.state.parent.dS.serieId) // this parent has a serieId (so the parent modal is hostoing a C_dS_reservation, it is a M_RESA
							if(this.state.parent.dS.serieId==dS_resa.serieId) // both serieId match, which means the serie displayed on the parent M_RESA is the serie we modify a reservation from
								this.refreshparent = 1; // in this case, launch a refresh of the M_RESA serie Tab.
			}
	
	},
	dupliselect: function() {
		let any = this.controls.duplicates.value().length; // is an array of ids
		if(!!any) $(this.elements.duplimsg).show(); else $(this.elements.duplimsg).hide();
	},
	dupliclear: function() {},
	fname: function(digits) { this.controls.gender.digits(digits);	}, // first name has been changed
	ontab: function(which) { 
		switch(which|0) {
			case 0: this.controls.lname.focus(true); break;
			case 1: this.controls.info.focus(true); break;
			case 9: this.controls.duplicates.focus(true); break;
		}
		this.modal.mrefresh(); 
	},	
	onntctab: function(which) {
		if(vbs) vlog('modals.js','M_VISI','onntctab','tab:'+which); 
	},
	onnote: function(id) {
		let dS = ntmems['visitab'].notes.get(id);
		let notesaved = new A_cb(this, this.notesaved);
		let modal = new M_NOTE(dS, {saved:notesaved, removed:notesaved});
	},
	ontask: function(id) {
		let dS = ntmems['visitab'].tasks.get(id);
		let tasksaved = new A_cb(this, this.tasksaved);
		let modal = new M_TASK(dS, {saved:tasksaved, removed:tasksaved});
	},
	onchat: function(id) { 
		let dS = cmems['visitab'].chats.get(id);
		let chatsaved = new A_cb(this, this.chatsaved);
		let modal = new M_chat(dS, {saved:chatsaved, removed:chatsaved}, { tab:0 });
	},		
	onfile: function(id, evnt) {
			let ctrlkey = evnt.ctrlKey;
			let shiftkey = evnt.shiftKey;
		let command = ''; 
		if(shiftkey) { // shift + click
			command = 'download';
		} else {} // simple click
		let dS = C_dS_file.register.byid.get(id);
		let filesaved = new A_cb(this, this.filesaved);
		let modal = new M_file(dS, {saved:filesaved, removed:filesaved}, { tab:0,command:command });
	},	
	flplus: function(id) {
			let dS = new C_dS_file(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([this.dataSet.id]));
			let filesaved = new A_cb(this, this.filesaved);
		let modal = new M_file(dS, {saved:filesaved}, { tab:0 });
	},	
	extend: function() {
		$(this.elements.wrappers.company).show();
		$(this.elements.wrappers.residence).show();
		$(this.elements.wrappers.refer).show();
		$(this.elements.wrappers.extend).hide();
	},
	vselect: function(vid) { // this control appears only for new visitors and allows copying from another in existing account visitors, applies for family
		let dS_visitor = C_dS_visitor.get(vid);
		
		this.controls.company.set(dS_visitor.company, {propagate:false});
		this.controls.lname.set(dS_visitor.lastname, {propagate:false}); // calls in C_iAC when new (id<=0)
		// this.controls.fname.set(dS_visitor.firstname); // !! not copied, family members have different firstnames
		// this.controls.gender.set(dS_visitor.gender);
		this.controls.mobile.set(dS_visitor.mobile);
		this.controls.lang.set(dS_visitor.language);
		// if(dS_visitor.birthday) { // !! not copied, family members have different birth dates
			// let bd = dS_visitor.birthday.toString();
			// let yyyy = bd.slice(0,4);
			// let mm = bd.substring(4,6);
			// let dd = bd.slice(-2);
			// this.controls.bdate.set(dd+'-'+mm+'-'+yyyy);
		// }
		this.controls.color.set(dS_visitor.cssColor);
		this.controls.pattern.set(dS_visitor.cssPattern);
		
		this.controls.residence.set(dS_visitor.residence);
		this.controls.addr.set(dS_visitor.address);
		this.controls.zip.set(dS_visitor.zipCode);
		this.controls.city.set(dS_visitor.city);
		this.controls.country.set(dS_visitor.country);
		this.controls.phone.set(dS_visitor.phone);
		this.controls.email.set(dS_visitor.email);
		this.controls.regist.set(dS_visitor.registration);
		
		$(this.elements.wrappers.vcopy).hide();
	},
	vclear: function() { // this control appears only for new visitors
		
	},
	oncolorselect: function(cssid) {
		if(this.dataSet.cssColor != cssid) {
			this.dataSet.cssColor = cssid;
			this.modified();
		}
		if(cssid==0) { // the default color was selected
			this.modal.setmborder(0);
			return this;
		}
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_VISI', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		if(this.dataSet.cssPattern != cssid) {
			this.dataSet.cssPattern = cssid;
			this.modified();
		}
		if(cssid==0) { // the default color was selected
			this.modal.setmpattern(0); // a none pattern was intentionaly selected and stored
			return this;
		}
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 801, those are defined here (*mb01*)
			let cclass = dS_customCss.resaClass;
			let ctype = dS_customCss.cssType;
			let cname = dS_customCss.name;
		if(vbs) vlog('modals.js', 'M_VISI', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass+', name:'+cname);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	ontags: function(values) {
		this.elements.wrappers.tags.innerHTML = this.dataSet.vtags({marginbetween:'6px', those:values});
		return true;
	},
	modified: function() {
		this.state.modified = true;
	},
	plannedappssortdir: function() { // on series display, when the list title "next apps" is clicked, we change the sort order of the list ;)
		this.state.plannedappssortdir = -this.state.plannedappssortdir;
		this.visitorapps(this.state.visitorapps); // redraws an identical screen but with changed list order, that is why we kept a pointer to this data when here (*rs01*)
	},
	onbd: function(bd,state) { // birthday has been edited
		this.setage();
	},
	ctrlD: function() {
		mobminder.app.showdeleted();
		if(this.state.visitorapps) this.visitorapps(this.state.visitorapps);		
		return false; // do not propagate or you might open some fancy menu from the browser
	},
	mobile: function() {
		let n = 0;
		if(this.controls.mobile.valid()) n = this.controls.mobile.getpost();
		newlabel = this.makeatel('mobile',n);
		this.controls.mobile.setlabel(newlabel,{xl:false});
	},
	phone: function() {
		let n = 0;
		if(this.controls.phone.valid()) n = this.controls.phone.getpost();
		newlabel = this.makeatel('phone',n);
		this.controls.phone.setlabel(newlabel,{xl:false});
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		if(this.callbacks.saved) this.callbacks.saved.cb(inlineDataSets);
		this.close();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	visitorapps: function(inlineDataSets) { // we fall here after an async call to the server on visitorapps.php, note that visitor files list arrives here too.
		
		// an identical architecture is used in M_RESA::seriedata(), after a server call the data is updated on the modal tab
		if(!this.modal) return; // first check if the modal is still open 
		
		// split past and future reservations, and sort them
		let apps = { past:new Array(), future:new Array(), now:new Array() };
		let pops = { past:new Array(), future:new Array(), now:new Array() };
		let cnts = { past:0, future:0, now:0 }; // counts the not-deleted reservations
		let date = new Date(); let timesplit = date.getPHPstamp();
		for(let resaId in inlineDataSets['C_dS_reservation']) {
			let dS_reservation = inlineDataSets['C_dS_reservation'][resaId];
			if(dS_reservation.cueIn > timesplit) { // begins in the future
				apps.future.push(dS_reservation);
			} else { // now and past
				if(dS_reservation.cueOut < timesplit) { // fully finished in the past
					apps.past.push(dS_reservation);
				} else { // ongoing now
					apps.now.push(dS_reservation);
				}
			}
		}
		apps.past.sort(function(a,b){return b.cueIn-a.cueIn; });
		if(this.state.plannedappssortdir==1) { // long future ahead first in list
			apps.future.sort(function(a,b){return b.cueIn-a.cueIn; });
		} else { // this.state.plannedappssortdir==-1, first to come appointment first in list
			apps.future.sort(function(a,b){return a.cueIn-b.cueIn; });
		}
		// and there is no sorting for the presently ongoing resas
		
		for(let m in apps)
			for(let x=0; x<(apps[m].length); x++) {
				let dS_resa = apps[m][x];
				let isdeleted = !!dS_resa.deletorId;
				if(!isdeleted) cnts[m]++; // only a not deleted condition will let the counter increment
				let display = !(isdeleted&&mobminder.app.hidedeleted);
				if(display) pops[m][x] = new C_iRPOP(this.eids.resas, dS_resa, new A_cb(this, this.resa), {});
			}
		
		let remaining = cnts.future;
		let done = cnts.past;
		let ongoing = cnts.now;
		let total = remaining + done + ongoing;
		
		
		// deleting future appointments
			let renabled = false; // for(let x in apps.future) if(apps.future[x].deletorId == 0) renabled = true; // enables bin button only if some resas remain to delete
		let remove 	= new C_iCLIK(this.eids.visiapps.sremv, { click:new A_cb(this, this.sfuturedelete, apps.future.length) }
			, { enabled:renabled, tip:{ text:C_XL.w('del future apps')}, css:'modal-button fa fa-gray fa-trash touch-black', tag:'div'});
			let penabled = false; for(let x in apps.future) if(apps.future[x].deletorId == 0) penabled = true; // enables bin button only if some resas remain to delete
		let print 	= new C_iCLIK(this.eids.visiapps.print, { click:new A_cb(this, this.resasprint, apps) }
			, { enabled:penabled, tip:{ text:C_XL.w('tip print planned appointments')}, css:'modal-button fa fa-gray fa-print touch-green', tag:'div'});
			
				let hasemail = false; // !!this.dataSet.email;
			let mailenbl = false; for(let x in apps.future) if(apps.future[x].deletorId == 0) mailenbl = hasemail; // enables bin button only if some resas remain to delete
		this.controls.sendemail = new C_iCLIK(this.eids.visiapps.smail, { click:new A_cb(this, this.resasmail, apps) }
			, { enabled:mailenbl, tip:{ text:C_XL.w('tip email planned appointments')}, css:'modal-button fa fa-gray fa-at touch-blue', tag:'div'});
		
			let plappsui = '<h2>'+'<div style="padding-right:.5em; color:rgba(200,200,200,.7);" class="fa-11x fas fa-sort-alt">'+'</div>'+C_XL.w('next apps')+': '+remaining+'/'+total+'</h2>';
		let plannedapps = new C_iCLIK(this.eids.visiapps.plannedapps, { click:new A_cb(this, this.plannedappssortdir) } // makes possible to change the sort order of the list of planned appointments.
			, { enabled:true, tip:{text:C_XL.w('C_iRPOP_orderdir_tip'),css:'help-tip'}, css:'', style:'padding:1em 2em; margin:0 0 1em 0;', ui:plappsui, tag:'div'
			, keys:[C_KEY.code.s.up_arrow /*  */, C_KEY.code.s.down_arrow /*  */ ] } );
		
		// display reservations
		
			let futurebp = '<div class="blueprint center" style="padding:0 1em;">'+C_XL.w('C_iRPOP_timedate_bp')+'</div>';
			let buttons = plannedapps.display()+futurebp+this.controls.sendemail.display()+print.display()+remove.display();
		let futureheader = '<div style="display:flex; justify-content: space-between; align-items:top; padding-right:30px;">'+buttons+'</div>';
		let future = '<section style="margin:0 0 0 0;">'+futureheader+C_iRPOP.display(pops.future)+'</section>';
		
		let past = '<section style="margin:2em 0 0 0;">'+'<h2 style="padding:0 0 .8em 1em;">'+C_XL.w('prev apps')+': '+done+'/'+total+'</h2>'+C_iRPOP.display(pops.past)+'</section>';
			let nowsection = '<section style="margin:3em 0 0 0;">'+'<h2 style="padding:0 0 .8em 1em;">'+C_XL.w('now')+': '+ongoing+'</h2>'+C_iRPOP.display(pops.now)+'</section>';
		let onair = ongoing?nowsection:'';

			let handshake = '<div class="fad fa-handshake-alt"></div>';
		this.elements.wrappers.pastappscnt.innerHTML = (done>0)?done:handshake;
		this.controls.tabs.html(2, future+onair+past);

		for(let m in pops) for(let x in pops[m]) pops[m][x].activate(); 
		remove.activate(); print.activate(); plannedapps.activate(); this.controls.sendemail.activate();
		this.state.visitorapps = inlineDataSets; // wraps around here (*rs01*)
		
		// display notes, tasks and chats
		this.set_ntc_counters(); // displays blinking values down right of notes, tasks, chats buttons
		
		this.controls.tabs.html(5,this.rrnotes.display('notes-archive'));
		this.controls.tabs.html(6,this.rrtasks.display('tasks-archive'));
		this.controls.tabs.html(7,this.rrchats.display('chats-archive'));
		
		// let's setup the "files" tab
		// console.log(C_dS_file.register.byid.keys());
			let fbprint = C_XL.w('blueprint_files_iARRAY_plus', { nested:{icon:'<div class="fa fa-15x fa-layer-plus"></div>',fileclass:'RDV'}});
			if(C_dS_file.register.byid.ends()) fbprint = C_XL.w('blueprint_files_iARRAY');
		this.elements.wrappers.fbprint.innerHTML = fbprint;
		this.elements.wrappers.fllist.innerHTML = this.rrfiles.display('files-archive');
		
		// a ray of activation
		this.rrnotes.activate(); 
		this.rrtasks.activate(); 
		this.rrchats.activate(); 
		this.rrfiles.activate(); 
		
		this.setfiletab();
	},
	visitorappsfailed: function() { },
	resasaved: function(dataSets) { 
		let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('modals.js','M_VISI','resasaved','date:'+resa.jsDateIn.sortable({y:true})); 
		mobminder.app.setdate.cb(resa.jsDateIn); // switch to change date and updates desk window
		this.callforapps(); // updates also the list inside the tab
		if(this.refreshparent) this.state.parent.loadserie(); // in this case, launch a refresh of the M_RESA serie Tab.
	},
	resadeleted: function(jsDate) {
		if(vbs) vlog('modals.js','M_VISI','resadeleted','date:'+jsDate.sortable({y:true})); 	
		mobminder.app.setdate.cb(jsDate); // switch to change date and updates desk window
		this.callforapps(); // updates also the list inside the tab
	},
	notesaved: function(dataSets) {
		if(vbs) vlog('modals.js','M_VISI','notesaved',''); 
		mobminder.app.refresh();
		this.callforapps(); // updates also the list inside the tab
	},	
	newnote: function(id) {
		if(vbs) vlog('modals.js','M_VISI','newnote',''); 
			let plusclass = new C_dS_note_detail.plus();
			let notesaved = new A_cb(this, this.notesaved);
			let visirefs = new Array(); visirefs[this.dataSet.id] = true;
			
			let addrlogins = C_dS_loggable.getbyAccLevel([aLevel.manager]); // medical call centers are using aLevel.manager for the operators so we include them all straight away
				addrlogins[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
				
		let modal = new M_NOTE(plusclass.plus(), {saved:notesaved, removed:notesaved}, { visirefs:visirefs, tab:1, addrlogins:addrlogins });
		return false;
	},
	newtask: function(id) {
		if(vbs) vlog('modals.js','M_VISI','newtask',''); 
			let plusclass = new C_dS_task_description.plus();
			let tasksaved = new A_cb(this, this.tasksaved);
			let visirefs = new Array(); visirefs[this.dataSet.id] = true;
			
			let asslogins = C_dS_loggable.getbyAccLevel([aLevel.manager]); // medical call centers are using aLevel.manager for the operators so we include them all straight away
				asslogins[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation

		let modal = new M_TASK(plusclass.plus(), {saved:tasksaved, removed:tasksaved}, { visirefs:visirefs, tab:1, asslogins:asslogins });
		return false;
	},
	newchat: function(id) {
		if(vbs) vlog('modals.js','M_VISI','newchat',''); 
			let plusclass = new C_dS_chat_thread.plus();
			let chatsaved = new A_cb(this, this.chatsaved);
			let visirefs = new Array(); visirefs[this.dataSet.id] = true;
			
			let participants = C_dS_loggable.getbyAccLevel([aLevel.supervisor]); // medical call centers are using aLevel.supervisor for the operators so we include them all straight away
				participants[mobminder.context.surfer.id] = true; // in any case, the surfer who actionned the new chat request is always included in the conversation
		
		let modal = new M_chat(plusclass.plus(), {saved:chatsaved, removed:chatsaved}, { visirefs:visirefs, tab:1, plogins:participants });
		return false;
	},	
	tasksaved: function(dataSets) {
		if(vbs) vlog('modals.js','M_VISI','tasksaved',''); 
		mobminder.app.refresh();
		this.callforapps(); // updates also the list inside the tab
	},
	chatsaved: function(dataSets) {
		if(vbs) vlog('modals.js','M_VISI','chatsaved',''); 
		mobminder.app.refresh();
		this.callforapps(); // updates also the list inside the tab
	},
	filesaved: function(dataSets) {
		if(vbs) vlog('modals.js','M_VISI','filesaved',''); 
		// mobminder.app.refresh();
		this.callforapps(); // updates also the list inside the tab
	},
	sfuturedelete: function(cnt) {
			let texto = C_XL.w('planned apps',{cap:1})+': <b>'+cnt+'</b><br/>'+C_XL.w('delete all confirm');
		new C_iMSG(texto, { onChoice:new A_cb(this, this.sfuturedelchoice) }, { interactivity:'confirm' } );
		return false;
	},
	sfuturedelchoice: function(v) {
		if(v=='0') return false;
		let post = new C_iPASS({id:this.dataSet.id, side:'future' });
		let names = { post:{id:'id', side:'side'} };
		mobminder.app.post({post:post}, names, './delete/visitorapps.php', new A_cb(this,this.sdeleted), new A_cb(this,this.failed));
	},
	sdeleted: function(inlineDataSets) {		
		this.visitorapps(inlineDataSets); // displays any change
		if(this.callbacks.seriedeleted) this.callbacks.seriedeleted.cb();
	},
	resasprint: function(apps) {
		let vid = this.dataSet.id;
		const newTab = window.open('print_appointments.php?vid='+vid+'&sid=0', '_blank', 'noopener');
		if(newTab) newTab.focus();
	},
	resasmail: function(apps) {
		// console.log('resasmail');
		// console.log(apps);
	}

}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    M _ R E S A
//

function M_RESA(dS, callbacks, preset) {

	this.state = M_RESA.defauts.align(preset = preset || {});
	this.dS = dS;
	this.clone = this.dS.clone('slots'); // used for simulation of new title and new display, keeping this.dS untouched
	this.clone.id = this.dS.id;
	this.state.assess = this.dS.assess;
	this.callbacks = callbacks; // like { saved:A_cb, escaped:A_cb, failed:A_cb };
		const b = 'resa_L'+C_iMODAL.layer+'_'+dS.id+'_';
	this.eids = { 	  tabs:b+'tabs', schedule:b+'cues', title:b+'titl'
					, buttons:b+'buttons',  visitors:b+'visi', plus:b+'plus'
					, workcodes:b+'work', products:b+'prdct', note:b+'note', wlist:b+'wlist'
					, color:b+'color', pattern:b+'pattern', tags:b+'tags', staff:b+'staff', sms:b+'sms', mail:b+'mail'
					, duplicate:b+'dup', replan:b+'rpl', unlink:b+'unlk'
					, /* series */ recurr:b+'prd', stitle:b+'sttl', fremv:b+'frmv', smail:b+'smail', print:b+'print', plannedapps:b+'plndapps', seriepops:b+'seriepops', seriesddwn:b+'seriesddwn'
					, own:{peer:b+'peer', doc:b+'doc', serietotal:b+'stotl' }
					, wraps: { fllist:b+'fllist', color:b+'wcol', pattern:b+'wpat', tags:b+'wtags', mins:b+'mins', existingseries:b+'exsrs', fbprint:b+'fbpr', titletime:b+'tttm' }
					, iarrays:{ files:b+'rr_fls'}, flplus:b+'flpl'
					, epay: { bill:b+'bill', am:b+'am' }	};
	this.elements 	= new A_el();
	
	if(vbs) vlog('modals.js', 'M_RESA', 'constructor', 'resaId:'+this.dS.id);
	
		let mayremove = (this.dS.id>0) && (this.dS.deletorId==0); // object must be existing and not being deleted yet
		let maysave = true;
		
		if(this.dS.is.calendar) { // full calendar day (taken from yearly view) // // returns the number of entire days 
			maysave = permissions.may(pc.ch_calendar);
			mayremove = mayremove && permissions.may(pc.ch_calendar);
		} else {
			maysave = permissions.may(pc.cr_resas);
			mayremove = mayremove && permissions.may(pc.cr_resas);
		}
		
		if(this.dS.is.prebooking) mayremove = maysave = false; // deletion of a reservation under prebooking is not allowed, that reservation is in paiement processing online
		
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit), deletemsg:new A_cb(this, this.deletemsg)}, { remove:mayremove, save:maysave });
	
		let mayreplan = this.dS.id>0 && this.dS.deletorId==0;
		if(this.state.parent) if(this.state.parent instanceof C_backFIND) mayreplan = false; // from the search & find view, you do not want to replan nor copy reservations
	
	const duplicate 	= new C_iCLIK(this.eids.duplicate, { click:new A_cb(this, this.duplicate) }
		, { enabled:mayreplan, tip:{ text:C_XL.w('tip duplicate esc')}, css:'modal-button fa fa-gray fa-copy touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.d /*d like duplicate*/] });

	const replan 	= new C_iCLIK(this.eids.replan, { click:new A_cb(this, this.replan) }
		, { enabled:mayreplan, tip:{ text:C_XL.w('tip replan')}, css:'modal-button fa fa-gray fa-share-square touch-orange', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.r /*r like replan*/] });

		let tip = 'tip unlink';
		switch(this.dS.assess) {
			case resaclass.appointment: tip = 'tip unlink appointment'; break;
			default: tip = 'tip unlink event';
		}
	const unlink 	= new C_iCLIK(this.eids.unlink, { click:new A_cb(this, this.unlink) }
		, { enabled:!!this.dS.serieId, tip:{ text:C_XL.w(tip)}, css:'modal-button fa fa-gray fa-unlink touch-green', tag:'div', style:'font-size:1.4em;'
		, keys:[] });

	const id = new C_iPASS({ id:this.dS.id, archived:this.dS.archived, peerId:this.dS.peerId, removePeer:0
			, replan:this.dS.replan||'-', staffchanged:0, confirm:0, bank:this.state.bank
			, serieId:this.dS.serieId });
	const parts = new C_iPASS(this.dS.partspost());
	
	let schedule; const cues = { cin:this.dS.jsDateIn.clone(), out:this.dS.jsDateOut.clone() }
		const isnew024 = (this.dS.id<=0 && mobminder.account.is.range024);
		const isfCalwide = (this.dS.assess==resaclass.fcalwide);
		const sameday = this.dS.is.sameday;
	if(this.dS.is.calendar) schedule = new C_iOFFD(this.eids.schedule, {}, cues ); // displays a double date picker, for full off days selection (resource yearly calendar)
		else if(isfCalwide||isnew024||!sameday) schedule = new C_iSPAN(this.eids.schedule, {}, cues ); // then user may change date and time
			else schedule = new C_iINOUT(this.eids.schedule, {setdate:mobminder.app.setdate, onspanchange:new A_cb(this, this.spanchanged)}, cues ); // most usual display - time reservation is inside the day 0 to 24h
	
	const plus = new C_iCLIK(this.eids.plus, { click:new A_cb(this, this.newvisitor) } 
		, { enabled:true, tip:{text:C_XL.w('tip plus visitor'),css:'help-tip'}, css:'field-button fa-gray fa fa-user-plus touch-blue', style:'display:inline-block; margin-left:.6em;', ui:'', tag:'div'
		, keys:[C_KEY.code.s.ctrl + C_KEY.code.alpha.n /* Ctrl + n */, C_KEY.code.kpad.add /* Numpad plus key */ ] } );
		
		const cbacks 	= { changed:new A_cb(this, this.visitorSelect), added:new A_cb(this, this.visitorAdded), cleared:new A_cb(this, this.visitorsCleared), acxtrapass:new A_cb(this, this.vacxtrapass)};
		const acprest 	= { 
			focus:(preset.focus=='onvisitors'), placeholder:C_XL.w('visitors'), ids:this.dS.visitors, buttons:{plus:plus}
			, onlabelclick:new A_cb(this, this.visiClick), ismulti:true, achideselected:true, tipwithbp:true
		};
	
	const visitors = new C_iACPICK(this.eids.visitors, C_dS_visitor, cbacks, acprest );

	const workcodes = new C_iACPICK(this.eids.workcodes, C_dS_workcode, { changed:new A_cb(this, this.workcodeSelect), cleared:new A_cb(this, this.workcodesCleared)}
		, { placeholder:C_XL.w('workcodes'), ids:this.dS.performances, leadclass:{resources:this.dS.resources}, tip:true, trigger:false } ); /* hidden:hidewrkc */
	
	const products = new C_iACSUMS(this.eids.products, C_dS_product, { changed:new A_cb(this, this.productSelect), cleared:new A_cb(this, this.productsCleared)}
		, { placeholder:C_XL.w('products'), ids:this.dS.goods, resaid:this.dS.id, leadclass:{resources:this.dS.resources}, tip:true, trigger:false } ); /* hidden:hidewrkc */
	
	const note 		= new C_iNOTE(this.eids.note,  this.dS.note, { focus:(preset.focus=='onnote'), rows:(is.newtouch?8:6) });
	const tags		= new C_iCSS(this.eids.tags, { select:new A_cb(this, this.ontags, null, null, 300) }, { cssclass:this.dS.assess, csstype:ccsstype.tag, value:this.dS.cssTags, enabled:true } /*preset*/ );
	const staff 	= new C_iSTAFF(this.eids.staff, 'empty', new A_cb(this,this.staff), this.dS.resources);

	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:this.dS.assess, csstype:ccsstype.color, value:this.dS.cssColor, enabled:true } /*preset*/ );
	const pattern	= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:this.dS.assess, csstype:ccsstype.pattern, value:this.dS.cssPattern, enabled:true } /*preset*/ );
	
		const wlist = new C_iONOFF(this.eids.wlist, { onswitch:new A_cb(this, this.wlselect) }, { value:1, state:!!this.dS.waitingList, morecss:'orange' } );	

	const sms	= new C_iCOMM(this.eids.sms, this.dS, C_dS_smsTemplate, new A_cb(this, this.sms));
	const mails	= new C_iCOMM(this.eids.mail, this.dS, C_dS_emailTemplate, new A_cb(this, this.email));

	const bill 	= new C_iBILL(this.eids.epay.bill, this.dS, { onbillamount:new A_cb(this, this.onbillamount) }, {} );
	
	
		const url = 'www.mobminder.com/'+mobminder.context.surfer.languageabr()+'/pay.php';
		const tipwww = C_XL.w('tip-iam-www', { cap:true } )+'<br/>'+url; 
		const caption = 'www.mobminder.com';
	const accman	= new C_iAManager(this.eids.epay.am, {}, { additionalink:{caption:caption, url:url, tip:tipwww } } );
	
	// recurrent reservations (series)
	const recurr 	= new C_iRECUR(this.eids.recurr, { resumed:new A_cb(this, this.recresumed, undefined, false, 500 ), onpreview:mobminder.app.setdate }, { cue:this.dS.cueIn } );
	
	const stitle 	= new C_iFIELD(this.eids.stitle, { onfchange:false }, { digits:this.dS.serie.stitle /* check (*s01*) */, type:INPUT_TEXT, mandatory:false, focus:false, placeholder:C_XL.w('pls name serie') });

	// button for adding files
	// const flplus 		= new C_iBUTTON.standard(this.eids.flplus, new A_cb(this, this.flplus), 'plus' );
				const flstyle = ''; // 'height:1.3em; text-align:center; width:10em; line-height:1.3em;';
				const fltip = {text:C_XL.w('visimodal more file')};
		const flpluslook = { tag:'div', ui:'', css:'modal-button fa fa-17x fa-layer-plus mob-txt-lime touch-green', style:flstyle, tip:fltip, enabled:true };
	const flplus = new C_iCLIK(this.eids.flplus, { click:new A_cb(this, this.flplus) }, flpluslook );
	
		const c = C_dS_resafile.catalyst; c.object = this.dS; // (*ct02*)
	this.rrfiles = new C_iARRAY(this.eids.iarrays.files, new C_catalyst(c), {onrow:new A_cb(this, this.onfile)}, {count:true, endoflist:true, style:'width:calc(100% - 28px); max-width:calc(100% - 28px);' } ); 

	// misc
			const tabsnames = {0:'details', 1:'sections', 2:'resources', 3:'resa_sms_list', 4:'resa_emails_list', 5:'payment', 6:'resa serie', 7:'resa serie', 8:'folder', 9:'audit'};
		const tabslabels = C_XL.w(tabsnames); if(is.newtouch) tabslabels = symbols(tabsnames, '', 'padding:0 .5em 0 .5em;');
		
			tabslabels[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
			
		const helptip = C_XL.w('tip modal resa')+'<div class="fa fa-13x fa-cogs"></div>';
	const tabs = new C_iTABS(this.eids.tabs, tabslabels, { ontab:new A_cb(this, this.ontab) }, { tip:helptip, current:preset.tab||0 } );

	
	this.controls 	= new A_ct( { tabs:tabs, cartouche:cartouche, duplicate:duplicate, replan:replan, unlink:unlink, id:id
								, parts:parts, schedule:schedule, visitors:visitors, plus:plus, workcodes:workcodes, products:products, note:note
								, wlist:wlist, tags:tags, color:color, pattern:pattern
								, staff:staff, sms:sms, mails:mails, dpops:new A_ct({})
								, recurr:recurr, stitle:stitle, sendemail:false
								, bill:bill, accman:accman, existingseries:false, flplus:flplus } );
								
	this.handlers	= new A_hn( { peer:new A_cb(this, this.onpeer), doc:new A_cb(this, this.ondoc) } )
	
	this.attendees().assess();
	
	if(is.newtouch)
		this.modal = new C_tMODAL({header:this.header(), body:this.body()}, {}, { position:{top:'13em'} });
	else {
			// const size = {x:mobminder.account.single?640:700,miny:'360px'};
			const rtypescount = 1 + (mobminder.account.has.uCal?1:0) + (mobminder.account.has.fCal?1:0); // there is at least always one bCal, that ranges [1,2,3]
			let xsize = 740 + rtypescount*40; // ranges [ 780, 820, 860 ]
				if(this.dS.serieId) xsize += 60;
			
			const size = {x:xsize,miny:'320px',maxy:'540px'};
		this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:size, moves:true, morecss:{ outlet:'M_RESA' } } );
		
		tabs.state.helpeid = this.modal.eids.outset; // keep this line before activate
		
		this.state.performances = this.controls.workcodes.value(); // because this.resetCcss() needs this.state.performances to be set.
		this.state.products = this.controls.products.value();// because this.resetCcss() needs this.state.products to be set.

		this.activate().performances().products(); // autopop is true by default in C_iMODAL // .performances() needs activation complete
	}
	
		const isnew = this.dS.id<=0;
		const isslicy = this.controls.schedule.getduration()==1; // this reservation is only one slice clicked
	this.state.isslicy = isnew && isslicy; // keep a record that this reservation was drawn new with a single slice duration

	if(!isnew) { // fetch info about transmitted communication
		this.callforcommunication();
		if(this.dS.is.fromserie) this.loadserie(); // loads all the serie and displays it on the "serie" tab
	} 
}	
M_RESA.defauts = new A_df( { focus:'onnote', peerRemove:false, assess:false, attendees:false, performances:false, products:false
					, parent:false, bank:'slots', embedded:false
					, isslicy:false // this resa was drawn by clicking only one slice
					, plannedapps:1, seriedata:0, selectedserie:0, emails:'' // sorting direction for future appointments, can be [1, -1]
					} );
M_RESA.prototype = { 
	// public
	changestaff: function(from ,to) { // add or replace resources
		this.controls.staff.change(from,to);
		return this;
	},
	tab: function(tabid) { // switch to a given tab
		this.controls.tabs.set(tabid);
		return this;
	},
	setemails: function() { // relates to this.resasmail() and this.seriedata()
		
		this.state.emails = '';
		let ids = this.controls.visitors.value();
		let emails = [];
		for(let id in ids) { 
			let dS_visi = C_dS_visitor.get(id);
			emails.push(dS_visi.anglemail());
		};
		this.state.emails = emails.join(', ');
		if(this.controls.sendemail) this.controls.sendemail.enable(!!this.state.emails);
		return this;		
	},
	
	body: function(css) { 
		
		const tabs = new Array();
		const isnew = this.dS.id<=0;
		
		// tab 0 
			const v = this.controls.visitors.display();
			const w = this.controls.workcodes.display();
			const k = this.controls.products.display();
			const s = this.controls.wlist.labelled('on standby list','', {table:true, xl:true});
			const c = this.controls.color.labelled('color', 'alpha12');
			const p = this.controls.pattern.labelled('status', 'alpha12');
			const t = this.controls.tags.display();			
			const n = this.controls.note.display('textcolor-light','','note');
			
			let tab0 = '';
		
		if(is.newtouch) {
			
			const visitors = this.dS.is.calendar ? '' : '<div>'+v+'</div>';
			const workcodes = '<div>'+w+'</div>';
			const note = '<div>'+n+'</div>';
			const tags = '<div id="'+this.eids.wraps.tags+'" style="text-align:left;">'+t+'</div>';
			const color = '<div id="'+this.eids.wraps.color+'">'+c+'</div>';
			const pattern = '<div id="'+this.eids.wraps.pattern+'">'+p+'</div>';
			const wlist = '<div>'+(this.dS.is.calendar ? '' : s)+'</div>';
			
			tab0 = visitors+workcodes+note+tags+wlist; 

		} else {
				const visitors = this.dS.is.calendar ? '' : '<div style="min-height:5em; padding-bottom:10px;">'+v+'</div>';
				let workcodes = '<div style="min-height:5em; padding-bottom:10px;">'+w+'</div>';
					let hidewrkc = !(mobminder.account.has.workcodes); // does not take e-workcodes into consideration
					let pc = 0; for(let pid in this.dS.performances) pc++; if(pc) hidewrkc = false; // looks like an eresa-workcode was introduced through the web
				if(hidewrkc) workcodes = '';
				
				let products = '<div style="min-height:5em; padding-bottom:10px;">'+k+'</div>';
					let hideproducts = !(mobminder.account.has.products); // does not take e-products into consideration
					let kc = 0; for(let pid in this.dS.products) kc++; if(kc) hideproducts = false; // looks like an eresa-workcode was introduced through the web
				if(hideproducts) products = '';
				
			tab0 = '<div class="centered"><div style="display:inline-block; margin:0 auto;">'+visitors+workcodes+products+n+this.peer()+'</div></div>'; // this section in the center

					const color = '<tr id="'+this.eids.wraps.color+'">'+c+'</tr>';
					const pattern = '<tr id="'+this.eids.wraps.pattern+'">'+p+'</tr>';
				const cuscss = '<table class="coords" style="margin:0 0 0 auto;">'+color+pattern+'</table>';
				
					const wlist = this.dS.is.calendar ? '' : '<div style="text-align:right; padding:1em 0 0 0;">'+s+'</div>';
					const tags = '<div id="'+this.eids.wraps.tags+'" style="padding-bottom:2em;">'+t+'</div>';
		
			const bottom = '<tr><td style="vertical-align:top; padding-right:1em;">'+tags+'</td><td style="vertical-align:top; text-align:right;">'+cuscss+wlist+'</td></tr>';
			const thefinal = '<table summary="tags and colors" style="margin:2em auto 1em auto;">'+bottom+'</table>';
			
			tab0 += thefinal;
		}
		
		tabs.push(this.controls.tabs.container(0, tab0));
		
		// tab 1 (optional)
		let parts = this.parts();
		if(parts === false) { parts = ''; this.controls.tabs.hide(1, true); }
		tabs.push(this.controls.tabs.container(1, parts));
		
		// tab 2 - staffing
		const staff = '<tr>'+'<td>'+this.controls.staff.display('textcolor-light')+'</td>'+'</tr>';
		const divStaff = '<div><table class="staff-layout" summary="staff layout">'+staff+'</table></div>';
		tabs.push(this.controls.tabs.container(2, divStaff)); if(mobminder.account.single) this.controls.tabs.hide(2, true);
		
		// tabs 3 & 4  - communication
		const sms = this.controls.sms.display('textcolor-light', this.state.attendees );
		const mails = this.controls.mails.display('textcolor-light', this.state.attendees );
		tabs.push(this.controls.tabs.container(3, sms)); 
		tabs.push(this.controls.tabs.container(4, mails)); 
		
		this.hidenotificationstab();
		
		// tab 5 - displaying epayment data
			let epayment = '';
			if(!mobminder.account.has.epay.active) { // advertising for this feature
				const dS_accman = this.controls.accman.dS;
							const bcard = '<img src="./assets/imgs/paymeans/bcard.png" style="width:90px; min-width:90px; height:auto;"/>';
							const cash = '<img src="./assets/imgs/paymeans/cash.png" style="width:90px; min-width:90px; height:auto;"/>';
							const payco = '<img src="./assets/imgs/paymeans/payconiq.png" style="width:90px; min-width:90px; height:auto;"/>';
							const qrcode = '<img src="./assets/imgs/paymeans/qrcode.png" style="width:90px; min-width:90px; height:auto;"/>';
							const istyles = 'style="padding-top:20px;"';
							const lstyles = 'style="padding:0 1em;"';
						const uprow = '<tr><td '+istyles+'>'+cash+'</td><td '+istyles+'>'+payco+'</td></tr>';
						const uprowlabels = '<tr><td '+lstyles+'>'+C_XL.w('eptab-cash')+'</td><td '+lstyles+'>'+C_XL.w('eptab-payco')+'</td></tr>';
						const dwrow = '<tr><td '+istyles+'>'+qrcode+'</td><td '+istyles+'>'+bcard+'</td></tr>';
						const dwrowlabels = '<tr><td '+lstyles+'>'+C_XL.w('eptab-SEPA')+'</td><td '+lstyles+'>'+C_XL.w('eptab-bcards')+'</td></tr>';
					const pmeans = '<table style="text-align:center; width:300px; margin:0 4em 0 2em;">'+uprow+uprowlabels+dwrow+dwrowlabels+'</table>';
					
					// 'Sur place lors du RDV ou en ligne à la réservation'.
					
						const title = '<div class="txt-gray_d" style="font-weight:bold; font-size:110%; text-align:center; padding-bottom:2em;">'+C_XL.w('eptab-title')+'</div>';
						const msg = '<div style="font-weight:normal; text-align:center; padding-bottom:1em;">'+C_XL.w('epctab-contact')+': <strong>'+dS_accman.lname({})+'</strong></div>';
					const pcontact = title+msg+this.controls.accman.display({orientation:'vertical'});
				
				epayment = '<table style="margin:0 auto 5em auto;"><tr>'+'<td>'+pmeans+'</td>'+'<td style="border-right:2em solid transparent;">'+pcontact+'</td>'+'</tr></table>';
			}
			else epayment = this.controls.bill.display();
		tabs.push(this.controls.tabs.container(5, epayment /*, 'wide deep'*/));
			
		this.controls.tabs.hide(5, isnew||(this.state.assess!=resaclass.appointment)); // we do not hide it during the promotion of the payment module
		// this.controls.tabs.hide(5, !mobminder.account.has.epay.active); // we do not hide it during the promotion of the payment module
		
		
		const iscopypaste = mobminder.app.state.duplicate; // (*cp02*)
		
		// tab 6 - making a new serie
			const calendar1day = this.dS.is.sameday || (this.dS.is.calendar==1);
		const noserie = this.dS.id>0 || mobminder.account.is.range024 || !calendar1day; // series are not allowed on 024 configs
		let innerserie = '<div id="'+this.eids.wraps.existingseries+'" style=""></div>';
		if(this.dS.id<=0) {
			const recurr = this.controls.recurr.display();
			const stitle = '<table style="margin:0 auto;"><tr>'+this.controls.stitle.labelled('new serie', 'alpha24')+'</tr></table>';
			innerserie = innerserie+stitle+recurr;
		}
		tabs.push(this.controls.tabs.container(6, innerserie));
		this.controls.tabs.hide(6, noserie||iscopypaste);
		// this.controls.tabs.hide(5, true); // while developping
		
		
		// tab 7 - displaying existing serie
				recurr = 'Waiting for data...';
		tabs.push(this.controls.tabs.container(7, recurr /*, 'wide deep'*/));
			const tab7hide = !this.dS.is.fromserie || iscopypaste;
		this.controls.tabs.hide(7, tab7hide); // is filled in when serie data is loaded, see this::seriedata() and this::seriesdata()
		
		// files 			
					const ufiles = mobminder.account.usefiles;
				const fbp = '<div id="'+this.eids.wraps.fbprint+'" class="blueprint" style="max-width:70%;">'+''+'</div>'; //+'<div>&nbsp;</div>';
			const bpstyle = 'display:flex; align-content:top; justify-content:space-between; margin:0; text-align:right; padding:0 10%;';
		const flplus = '<div style="'+bpstyle+'">'+this.controls.flplus.display()+fbp+'</div>';
		const fllist = '<div id="'+this.eids.wraps.fllist+'"></div>';
		this.controls.tabs.hide(8, (!ufiles)||(isnew));
		tabs.push(this.controls.tabs.container(8, flplus+fllist));
		
		// tabs 10 - tracking
		tabs.push(this.controls.tabs.container(9, this.dS.tracking() ));
		
		if(vbs) vlog('modals.js', 'M_RESA', 'body', 'color:'+this.dS.cssColor+', pattern:'+this.dS.cssPattern);
		return '<div style="">'+tabs.join('')+'</div>'; // this div is the target of iScroll when running on touch devices
	},
	activate: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'activate', 'resaId:'+this.dS.id);
		this.controls.activate('M_RESA');
		this.elements.collect(this.eids);
		
		this.modal.mposition().mrefresh();
		this.hideccss();
		let isnew = this.dS.id<=0;
		if(isnew) { // we need to write the setting of color and pattern into this.dS, according to selected workcodes
			this.resetCcss({soft:true});
			this.settags(); // see (*wk04*)
		}
		if(!is.tactile) { $(this.elements.own.peer).click(this.handlers.peer); }
		if(!is.tactile) $(this.elements.own.doc).click(this.handlers.doc);
		this.oncolorselect(this.dS.cssColor);
		this.onpatternselect(this.dS.cssPattern);
		if(vbs) vlog('modals.js', 'M_RESA', 'activated', '');
		this.tick(); // gimme a tick, it will tick tock...
		this.lookupseries('activate').setemails();
		new C_KEY([C_KEY.code.alpha.d+C_KEY.code.s.ctrl], new A_cb(this, this.ctrlD), 'M_RESA::'+this.eids.eid); // Deleted items
		// this.setfiletab(); / already achieved through this.callforcommunication();
		return this;	
	},

	// private	
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			const mayreplan = (this.dS.id>0)&&(this.state.assess!=resaclass.fcalwide)&&(!this.dS.is.calendar)&&(!this.dS.is.prebooking);
		const duplicate = mayreplan ?'<td class="cartouche" style="padding-left:2em;">'+this.controls.duplicate.display()+this.controls.replan.display()+this.controls.unlink.display()+'</td>':'<td></td>';
		
		const title = '<td class="mheader"><h1 class="modal-resa" id="'+this.eids.title+'">'+this.title()+'</h1></td>'; // see (*M01*)
		
			const duration = this.dS.parts?'<span style="font-weight:bold;">'+this.dS.text.time.duration+'&nbsp;</span>':'';
		const schedule = '<tr>'+'<td>'+this.controls.schedule.display(duration)+'</td></tr>';
		
			const total = '<span id="'+this.eids.own.serietotal+'"></span>';
			let scaption = '<b>'+C_XL.w('resa serie')+': </b>'+this.dS.serie.stitle+total; // serie caption
			if(!this.dS.serie.stitle) scaption = '<b>'+C_XL.w('from resa serie')+'</b>'+total;
		const serie = '<tr>'+'<td>'+scaption+'</td></tr>';

		if(is.small&&is.portrait) {
			const divTitle 	= '<div style="padding:0 0 0em 0;"><table summary="title" style="width:100%">'+'<tr>'+title+'</tr>'+'</table></div>';
				const padtd = '<td width=90%></td>';
			const divButtons 	= '<div style="padding:0 0 0em 0;"><table summary="buttons" style="width:100%">'+'<tr>'+buttons+padtd+'</tr>'+'</table></div>';
			const divSchedule = '<div style="padding:.5em 0 .5em 0;"><table summary="sched layout" style="text-align:center; margin:0 auto;">'+schedule+'</table></div>';
			const divSerie 	= this.dS.is.fromserie?'<div style="padding:.3em 0 .3em 0;"><table summary="sched layout" style="text-align:center; margin:0 auto;">'+serie+'</table></div>':'';
			const divTabs 	= '<div style="text-align:center; padding:1em 0 0 0;">'+this.controls.tabs.display('modal-resa')+'</div>';
			return divTitle+divButtons+divSchedule+divSerie+divTabs;
		
		} else { // mouse webApp
			
				const mins = '<div id="'+this.eids.wraps.mins+'" class="deltarea max f-lato mindertext" style="width:90%; text-align:center; font-weight:bold; bottom:-6px; left:0px; opacity:.4;">'+'</div>';

			const divButtons 	= '<div class="buttons"><table summary="layout" style="width:100%">'+'<tr>'+buttons+duplicate+title+'</tr>'+''+'</table></div>';
			
			const divSchedule = '<div style="padding:0 0 .6em 0;"><table summary="sched layout" style="text-align:center; margin:0 auto;">'+schedule+'</table></div>';
			const divSerie 	= this.dS.is.fromserie?'<div style="padding:.3em 0 .3em 0;"><table summary="sched layout" style="text-align:center; margin:0 auto;">'+serie+'</table></div>':'';
			const divTabs 	= '<div style="text-align:center; padding:1em 0 0 0;">'+this.controls.tabs.display('modal-resa', {lefter:mins} )+'</div>'; // mins is inserted inside the lefter pad of the tabs serie
			return divButtons+divSchedule+divSerie+divTabs;
			
		}
	},	
	title: function(forcetime = false) {
		
				const rtitle = this.clone.rtitle();
			if(this.dS.is.midnight) return rtitle; // dates have no start time
			
			const time = forcetime ? forcetime : this.dS.text.time.starttime; // see (*mr03*)
			const span = '<span style="padding-right:1.4em;" id="'+this.eids.wraps.titletime+'">'+time+'</span>';
			// console.log('title() ',' rtitle:',rtitle,' time:',time);
			
		return span+rtitle; // displays HH:MM followed by time reservation type ( event, offday, appointment, ...) and a nice pictogram
	},	
	loadserie: function() { // fetch data about other appointments belonging to this appopintment same serieId
		// if(id <= 0) return; 
		if(!this.dS.serieId) return this;
		
				const pass = new C_iPASS({ sid:this.dS.serie.id });
			const ctrl = new A_ct( {pass:pass} );
			
		mobminder.app.post(ctrl, {pass:{sid:'sid'}}, './queries/serie.php', new A_cb(this,this.seriedata), new A_cb(this,this.failed));
		rmems.flush('visiapps');
		ntmems.flush('visitab');
		return this;
	},
	lookupseries: function(caller) { // fetches series where the selected visitors are involved (this query is limited to current appointments table)
		
		// console.log(caller+'->lookupseries()');
		
		// if(this.dS.id<=0) return this; // new reservations display only the brand new serie setup tab
		if(this.dS.serieId) return this; // this reservation is already attached to a serie. this.loadserie() will take the realy and fills the "serie" tab.
		
		const ids = this.controls.visitors.value();
		const vidsr = [];
		for(let id in ids) { // builds a list of visitorids, like '11336949!11623831'
			const dS_visi = C_dS_visitor.get(id);
			vidsr.push(dS_visi.id);
		};
		const vids = vidsr.join('!');	
		
		if(vids) { // then we call for fresh data
			let pass = new C_iPASS({ vids:vids });
			let ctrl = new A_ct( {pass:pass} );
			
			mobminder.app.post(ctrl, {pass:{vids:'vids'}}, './queries/series.php', new A_cb(this,this.seriesdata), new A_cb(this,this.failed));
			rmems.flush('visiapps');
			ntmems.flush('visitab');
		}
		return this;
	},

	peer: function() {
		if(!this.dS.peerId) return '';
		if(this.dS.id<=0) return '';
		let peer = this.dS.peer(); //C_dS_reservation.get(this.dS.peerId); // comes from the same rmem
		let label = '<span class="select-header textcolor-light"><br/>'+C_XL.w('linked resa')+': </span>';
		let link = '<div>'+label+'<a id="'+this.eids.own.peer+'"><b>'+peer.title()+'</b></a></div>';
		if(this.dS.assess != resaclass.fcalwide) return link;
		if(mobminder.account.fCalsName != C_dS_resource.names.cars) return link;
		let label2 = '<span class="select-header textcolor-light">'+C_XL.w('linked doc')+': </span>';
		link += '<div>'+label2+'<a id="'+this.eids.own.doc+'"><b>'+C_XL.w('car contract')+'</b></a></div>';
		return link;
	},
	attendees: function() { // return all ids like attendeesIds[class][x] = id
		let attendeesIds = this.controls.staff.value();
		attendeesIds[class_visitor] = []; 
		vitems = this.controls.visitors.value(); for(let vid in vitems) attendeesIds[class_visitor].push(vid);
		
		if(vbs) vlog('modals.js', 'M_RESA', 'attendees', 'bCal:'+attendeesIds[class_bCal]+', uCal:'+attendeesIds[class_uCal]+', fCal:'+attendeesIds[class_fCal]+', visi:'+attendeesIds[class_visitor]);
		this.state.attendees = attendeesIds;
		return this;
	},
	performances: function(perfs) { //
			perfs = perfs || this.controls.workcodes.value();
		this.state.performances = perfs;
			
			const ids = []; for(let id in perfs) ids.push(id);
		if(vbs) vlog('modals.js', 'M_RESA', 'performances', 'ids:'+ids.joint(',')+', totprice:'+totprice);
		
		return this.makebilltotal(perfs, false);
	},
	products: function(prdcts) { //
			prdcts = prdcts || this.controls.products.value();
		this.state.products = prdcts;
		
			const ids = []; for(let id in prdcts) ids.push(id);
		if(vbs) vlog('modals.js', 'M_RESA', 'products', 'ids:'+ids.joint(',')+', totprice:'+totprice);
		
		return this.makebilltotal(false, prdcts);
	},
	makebilltotal: function(perfs, prdcts) {
			perfs = perfs || this.controls.workcodes.value();
			prdcts = prdcts || this.controls.products.value();
		let totprice = 0;
		for(let pid in perfs) totprice+= perfs[pid].price;
		for(let pid in prdcts) {
			const p = prdcts[pid]; // smth like { dS:leadclass dS, q:numberof }
			const q = p.q;
			totprice+= q*p.dS.price;
		}
		// console.log('-')
		// console.log('modals.js', 'M_RESA', 'products', 'ids:'+ids+', totprice:'+totprice);
		this.controls.bill.resettotal(totprice); // (*mr01*)	
		return this;
	},
	settags: function(perfs, hit) { // turn on tags according to selected workcodes setting, it is always a superposition of all workcode tags combined
		perfs = perfs || this.controls.workcodes.value();
		// calling this function without passing any parameter should set up the tags according to all workcodes, see (*wk04*)
		// calling instead with a value for hit should activate the tags for workcode id hit only, see (*wk03*)
		let values = []; // those values from C_iCRESTA are our tag ids
		let p = false, c = 0;
		for(let id in perfs) { 
			p = perfs[id]; c++;
			if(hit!==undefined) if(id!=hit) continue; // this process applies only for the very last selected item, unless hit enters as undefined.
			if(p.tags) { // turns on tags according to workcode settings, see (*wk01*)
				// let split = p.tags.slice(1,p.tags.length-1).split('!'); // trims heading and trailing exclams ! not applicable anymore but we keep that beauty of a line of code as an example
				let split = p.tags.split('!');
				for(let x in split) { let v = split[x]; values.push(v); }
				this.controls.tags.docheck(split,{callback:true});
			}
		}
		if(vbs) {
			values = values.join(',');
			vlog('modals.js', 'M_RESA', 'settags', 'tags:'+values);
		}
	},
	assess: function() {
		let assess = resaclass.event;
		if(this.state.attendees[class_visitor].length)
			if(this.state.attendees[class_bCal].length) assess = resaclass.appointment;
				else assess = resaclass.fcalwide;
		this.state.assess = assess; // contains newest assessment whatever it comes from clone or thid.dS
		this.clone.assess = assess; 
		// console.log('NEW ASSES: '+resaclass.names[assess]+' ('+assess+')');
		if(vbs) vlog('modals.js', 'M_RESA', 'assess', 'assess:'+resaclass.name(this.state.assess));
		return this;
	},
	hidenotificationstab: function() {

			const fcalwide = this.state.assess==resaclass.fcalwide;
			const anysms = !!this.controls.sms.any(); // does the account has SMS configured
			const anymail = !!this.controls.mails.any(); // doesthe account has no email configured
			const isappointment = this.state.assess == resaclass.appointment;
			const iscalendarday = !!this.dS.is.calendar;
			
		const hidesms = (!anysms) || fcalwide || iscalendarday || !isappointment;
		const hideeml = (!anymail) || fcalwide || iscalendarday || !isappointment;
		
		// console.log('hidenotificationstab() ');
		// console.log('     - fcalwide:',fcalwide,' anysms:',anysms,' anymail:',anymail,' iscalendarday:',iscalendarday);
		// console.log('     - isappointment:',isappointment,' hidesms:',hidesms,' hideeml:',hideeml);
		
		this.controls.tabs.hide(3, hidesms);
		this.controls.tabs.hide(4, hideeml);
		
		return this;
	},
	resetCommplan: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'resetCommplan', '');
		this.controls.tabs
			.html(3, this.controls.sms.display('textcolor-light', this.state.attendees ))
			.html(4, this.controls.mails.display('textcolor-light', this.state.attendees ));
		this.controls.sms.activate();
		this.controls.mails.activate();
		return this;
	},
	resetCcss: function(o = {soft:false}) {
		
		// We clone the dataSet because the user might escape the modal! Changing inside this.dS would leave the resa fucked up on the planning rmem if escape is chosen.
			
			// when busy on a new dS_reservation, the id might be zero, see (*mr30*) 
			const prevassess = this.clone.assess;
		this.clone.changeattendance(this.state.attendees).changeperformance(this.state.performances).rmeta(); // changes this.clone.assess
		
			const classchanged = prevassess!=this.clone.assess;
			const soft = o.soft;
			
		if(soft) { // keeps arriving settings intact( copy/paste operations, see (*cp02*) and (*cp01*)
		
			// why this option? when creating a day off from the year calendar in the M_RESC, 
			// the cssColor is chosen from a pad and that launches this M_RESA with pre-set cssColor
			
			// if(!this.dS.cssColor) this.clone.cssColor = mobminder.account.defCcss[ccsstype.color][this.clone.assess];
			// if(!this.dS.cssPattern) this.clone.cssPattern = mobminder.account.defCcss[ccsstype.pattern][this.clone.assess];
			// if(!this.dS.cssTags) this.clone.cssTags = mobminder.account.defCcss[ccsstype.tag][this.clone.assess];	
			
		} else {
			
			// disregards the eventual arriving settings, in terms of colors, patterns and tags
			this.clone.cssColor = mobminder.account.defCcss[ccsstype.color][this.clone.assess];
			this.clone.cssPattern = mobminder.account.defCcss[ccsstype.pattern][this.clone.assess];
			this.clone.cssTags = mobminder.account.defCcss[ccsstype.tag][this.clone.assess];	
		}
		
		
		if(this.state.assess == resaclass.appointment) { // in this case, workcodes color and patterns are applicable
			
			perfs = this.controls.workcodes.value(); // returns only the list of selected workcodes
			for(let id in perfs) { 
				const p = perfs[id];
				
				if(soft) { // needed for copy/paste operations
					if(!this.dS.cssColor) if(p.cssColor) this.clone.cssColor = p.cssColor;
					if(!this.dS.cssPattern) if(p.cssPattern) this.clone.cssPattern = p.cssPattern;
					// if(!this.dS.cssTags) if(p.cssTags) this.clone.cssTags = p.cssTags;
				} else {
					if(p.cssColor) this.clone.cssColor = p.cssColor;
					if(p.cssPattern) this.clone.cssPattern = p.cssPattern;
					// if(p.cssTags) this.clone.cssTags = p.cssTags;
				}
			}
			
		}
		
		this.controls.color.setCcssClass(this.state.assess, this.clone.cssColor);
		this.controls.pattern.setCcssClass(this.state.assess, this.clone.cssPattern);
		this.controls.tags.setCcssClass(this.state.assess, this.clone.cssTags, this.clone.assess);
	
		// console.log('resetCcss() cssTags='+this.clone.cssTags+', classchanged'+classchanged);
		
		this.oncolorselect(this.clone.cssColor); // writes into this.cssColor
		this.onpatternselect(this.clone.cssPattern); // writes into this.cssPattern
		
		
		if(vbs) vlog('modals.js', 'M_RESA', 'resetCcss', 'soft:'+(o.soft?'YES':'nope')+', color:'+this.clone.cssColor+', pattern:'+this.clone.cssPattern+', clone assess:'+resaclass.name(this.state.assess));
		
		this.hideccss(); // appointments might have color and pattern while events have only color, so we need to re-hide-show 
		
		// animate title
		this.elements.title.innerHTML = ''; 
			const cin = this.controls.schedule.getpost().cin;
			const jsdate = new Date(cin*1000); // let the modal title display 'appointment' or 'unavailability' according to assess, see (*M01*)
		setTimeout( () => {  this.elements.title.innerHTML = this.title(jsdate.HHmm(0,'')); }, 1200 ); // title time update with a little delay for the style ;) // see (*mr03*)

	},
	parts: function() {
		let parts = this.dS.iscluster;
		if(!parts) return false;
		let trs = new Array(), count = 1;
		let sorted = new Array();
		for(let midnight in parts) for(partId in parts[midnight]) sorted.push(parts[midnight][partId]);
		sorted.sort(function(a,b){return a.cueIn-b.cueIn; });
		for(let x in sorted){
			let o_resapart = sorted[x];
			let dpop = new C_iDPpop(this.eids.schedule+'_part_'+x, o_resapart.jsDateIn, {setdate:mobminder.app.setdate} );
			let cueIn = ' '+o_resapart.text.time.cin;
			let cueOut = ' '+o_resapart.text.time.out;
			let dur = o_resapart.text.time.duration;
			this.controls.dpops.add1(dpop, x);
			
			let u = '<td style="font-weight:bold">'+dur+'&nbsp;'+'</td>';
			let o = '<td>'+C_XL.w('ondate')+'&nbsp;</td>';
			let d = '<td style="text-align:right; font-weight:bold">'+dpop.display()+'&nbsp;</td>';
			let f = '<td>&nbsp;'+C_XL.w('fromtime',{cap:0})+'&nbsp;</td>';
			let ti = '<td>'+cueIn+'&nbsp;</td>';
			let tt = '<td>'+C_XL.w('to',{cap:0})+'&nbsp;</td>';
			let to = '<td>'+cueOut+'</td>';
			trs.push('<tr>'+u+o+d+f+ti+tt+to+'</tr>');
		}
		let d = '<div style="padding-top:1em; font-weight:bold">'+this.dS.duration()+' '+C_XL.w('in total')+'</div>';
		return '<table>'+trs.join('')+'</table>'+d;
	},
	fixclass: function() { // must be called when number of attendees has chaged, checks resa class, if changed, reset/adapt ccss menus (colors/tags/patterns are different for unavalabilities and appointments)
		let prevassess = this.state.assess;
		this.attendees().assess().hidenotificationstab(); // this will update this.state.assess
		let changed = prevassess != this.state.assess;
		if(changed) {
			this.resetCcss(); 			
			if(this.state.assess==resaclass.appointment) // we're going to appointment, let's check if some workcode is selected
				this.controls.workcodes.tilt(); // if a workcode was seleted, it will callback this.workcodeSelect() programmaticaly. See (*md19*)
		}
		if(vbs) vlog('modals.js', 'M_RESA', 'fixclass', ' resa class changed:'+changed+', class:'+resaclass.name(this.state.assess));
		this.resetCommplan();
		return this;
	},
	hideccss: function() { // hides irrelevant controls according to account setup. 
			if(this.controls.color.hasany()) $(this.elements.wraps.color).show(); else $(this.elements.wraps.color).hide();
			if(this.controls.pattern.hasany()) $(this.elements.wraps.pattern).show(); else $(this.elements.wraps.pattern).hide();
			if(this.controls.tags.hasany()) $(this.elements.wraps.tags).show(); else $(this.elements.wraps.tags).hide();
		return this;
	},
	callforcommunication: function() {
		mobminder.app.post({id:this.controls.id}, {id:{id:'id',bank:'bank'}}, './queries/communication.php', new A_cb(this,this.communication), new A_cb(this,this.communicationfailed));
		
		C_dS_file.register.flush();
		C_dS_resafile.register.flush();
		C_dS_cToggle.drop(this.dS.id);		
	},

	setfiletab: function() { // updates the files counter
		
		// update tab caption to indicate preview number of files attached
		if(!mobminder.account.usefiles) return this;
		if(this.dS.id<=0) return this;
		let ends = C_dS_resafile.ends(this.dS.id);
		let endscap = ends ? ' <span style="position:relative; top:2px;" class="label smaller mobcolor">'+ends+'</span>' : '';
		let cap = C_XL.w('folder')+endscap;
		this.controls.tabs.label(8,cap);
		
		// updates the graphical screen so to let appear the paperclips on the stickers (thanks to css .hasfile and .hasfiles from planning.css
		this.dS.resetCssclass(); // some new, see (*pc01*)
		mobminder.app.refresh({callserver:false}); // only redraws the screen, does not download anything from server AND does not replay the C_dS_reservation::rmeta() that builds the css (paperclip) property of dS_reservation
		return this;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { schedule:{cin:'cueIn',out:'cueOut'}
					, id:{id:'id',archived:'archived',peerId:'peerId', replan:'replan', staffchanged:'staffchanged', confirm:'confirm', bank:'bank', serieId:'serieId' }
					, visitors:'visitors', workcodes:'workcodes', products:'products', note:'note', wlist:'waitingList'
					, color:'cssColor', pattern:'cssPattern', tags:'cssTags', staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }
					, sms:'sms', mails:'mails', parts:'parts', recurr:'recurr', stitle:'stitle'
					, bill:{ tobepaid:'billamount' }
					};
		mobminder.app.post(this.controls, names, './post/reservation.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dS.id>0) this.dS.unregister();
		// this.clone.unregister();
		if(mobminder.app.state.duplicate) { // see (*cp02*)
			mobminder.app.state.duplicate.changeperformance(this.state.performances); // if new performances were added on the copy-paste way, they compound 
			mobminder.app.state.duplicate.changegoods(this.state.products); // same for goods
		}
		this.controls.bill.stoppolling();
		if(vbs) vlog('modals.js', 'M_RESA', 'save', '');
	},
	deletemsg: function() {
		let msg = '';
		switch(this.state.assess) {
			case resaclass.event: msg = C_XL.w('delete confirm event'); break;
			case resaclass.appointment: msg = C_XL.w('delete confirm appointment'); break;
			default: 
				msg = C_XL.w('delete confirm');
		}
			let bp = C_XL.w('delete blueprint');
		return msg+'<div class="orange center blueprint airtop airunder notbold">'+bp+'</div>';
	},
	remove: function() {
		if(this.dS.peerId && !this.state.peerRemove) {
			const msg = C_XL.w('remove peer?')+'<br/>'+this.dS.peer().title();
			this.state.peerRemove = new C_iMSG(msg, {onChoice:new A_cb(this, this.remove)}, { interactivity:'yesno' });
			return; // note that the modal callback is a call to this same function
		}
		if(this.state.peerRemove)
			if(this.state.peerRemove.state.result) // covers an escape scenario
				if(this.state.peerRemove.state.result.value)
					this.controls.id.items.removePeer = 1;
		this.modal.busy(true);
		const names = {id:{id:'id', archived:'archived', peerId:'peerId', removePeer:'removePeer', bank:'bank'}
					, note:'note', color:'cssColor', pattern:'cssPattern', sms:'sms', mails:'mails' }; // bank: see (*mr20*)
		
		if(this.dS.id>0) this.dS.unregister(); // (*mr04*)
		// this.clone.unregister();
		mobminder.app.post(this.controls, names, './delete/reservation.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
		this.deleting = this.dS.midnight*1000;
		this.controls.bill.stoppolling();
		if(vbs) vlog('modals.js', 'M_RESA', 'remove', '');
	},
	quit: function(options) { options = options || {};
		this.modal.close();
		// this.clone.unregister();
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		if(options.all) if(this.state.parent) this.state.parent.quit(options);
		this.controls.bill.stoppolling();
		if(vbs) vlog('modals.js', 'M_RESA', 'quit', '');
	},
	escape: function() { 
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		this.controls.bill.stoppolling();
		if(vbs) vlog('modals.js', 'M_RESA', 'escape', '');
		return true;
	},
	onpeer: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'onpeer', '');
		this.modal.close();
		if(!permissions.may(pc.op_resas)) return false;
		new M_RESA(this.dS.peer(), this.callbacks);
	},
	onserieresa: function(dS_resa) { // a reservation from the serie list has been clicked
		if(vbs) vlog('modals.js', 'M_RESA', 'onserieresa', '');
		if(!permissions.may(pc.op_resas)) return false;
		if(this.state.embedded) { if(this.callbacks.resaclick) this.callbacks.resaclick.cb(dS_resa); }
			else {
				if(dS_resa.id == this.dS.id)
					new C_iMSG(C_XL.w('you are already viewing this appointment'), { }, { } );
				else {
					new M_RESA(dS_resa, { saved: new A_cb(this, this.serieresasaved), deleted:new A_cb(this, this.serieresadeleted) }, { parent:this } ); // parent? see (*rs05*)
					this.state.dS_serieresa = dS_resa; // we keep track of the last selected one, see this.serieresadeleted() to discover why.
				}
			}
	},
	onserie: function(sid) { // the user selected a serie from the dropdown showing possible serie rattachment, on the "serie" tab.
		this.controls.id.items.serieId = sid; // that value is ready for posting and comes right in the C_dS_reservation instance throught _POST[], see /post/reservation.php
		let sname = this.state.serie
		this.controls.stitle.enable(!sid); // zero when 'no' is selected
		this.state.selectedserie = sid;
	},
	ondoc: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'ondoc', '');
		window.open('carrental.php?rid='+this.dS.id);
	},
	ontab: function(which) { this.modal.mrefresh(); },
	onbillamount: function(v) {
		if(vbs) vlog('modals.js', 'M_RESA', 'onbillamount', 'billamount:'+v);
		
		// this.dS.billamount = v; // see (*ba01*) pvh 2024-11 : this would write into dS even if the user finaly decides to cancel using the cross button
		
	},
	tick: function() { // time out recursive function keeps the chronograph up to date
		let s = this.controls.schedule.getpost();
		let cin = s.cin, cout = s.out; // it is important to take those values from the control and not from the dS
		let date = new Date(), now = date.stamp();  // exactly now in Unix UTC
		let span = cout-cin;
		let ongoing = now > cin && now <= cout;
		let ispast = now > cout;
		let mins = span/60; // the duration of this time reservation, in minutes
		let mowmins = now-(now%60); // integer number of minutes
		if(ongoing) mins = mins- (mowmins-cin)/60; // remaining number of minutes for this apppointment will be displayed
		
		let m = '';
		if(mins<=360) { // for offdays or wide time reservations, we do not want the counter.
			m = mins;
			if(ongoing) m = '<span class="orange">'+mins+'</span>';
			if(mins<=5) m = '<span class="red">'+mins+'</span>';
			if(ispast) m = '<span class="mob-txt-gray_l">'+mins+'</span>';
		}
		this.elements.wraps.mins.innerHTML = m; // chronograph
					
		if(!this.modal.isclosed()) setTimeout( () =>  { return this.tick(); }, 3000); // wraps around every second
		return mins; // then the cycling is broken
	},
	onfile: function(id, evnt) {
			let ctrlkey = evnt.ctrlKey;
			let shiftkey = evnt.shiftKey;
		// console.log('ctrlkey:'+ctrlkey+', shiftkey:'+shiftkey);
		let command = ''; 
		if(shiftkey) { // shift + click
			command = 'download';
		} else {} // simple click
		
		let dS = C_dS_resafile.register.byid.get(id);
		let filesaved = new A_cb(this, this.filesaved);
		let modal = new M_resafile(dS, {saved:filesaved, removed:filesaved}, { tab:0, command:command });
	},	
	flplus: function(id) {
			let dS = new C_dS_resafile(C_dS_trackingCCD.tnew(0, mobminder.account.id).concat([this.dS.id]));
			let filesaved = new A_cb(this, this.filesaved);
		let modal = new M_resafile(dS, {saved:filesaved}, { tab:0 });
	},	
	
	// callbacks
	visitorSelect: function(ids) { // adding or selecting using checkbox
		let list = [], c = 0; for(let id in ids) { list.push(id); c++; }; list.join(',');
		if(vbs) vlog('modals.js', 'M_RESA', 'visitorSelect', c+' visitors, ids:'+list);
		this.fixclass();
		if(mobminder.account.has.workcodes) {
			let w = this.controls.workcodes.value(); // an array indexed by id and pointing to C_dS_workcodes objects
			let wc = w.length;
			if(!wc) setTimeout(function(t, wc) { // pops up the workcode selector only if none is yet selected
				t.controls.workcodes.focus(true);
			}, 300, this, wc);
			else this.controls.note.focus(true); // some workcode is already selected
		}
		else this.controls.note.focus(true); // the account has no workcodes
		this.lookupseries('visitorSelect').setemails();
	},
	workcodeSelect: function(perfs, hitid) {
		
		// pop up for secretary
			let dS_wkc = perfs[hitid]; // the dS_workcode that was just chosen
			let turnon = hitid in perfs; // the hit item is an activation (going from unchecked to check)
		if(turnon) 
			if(mobminder.context.surfer.secretarypopups)
			if(!mobminder.app.duplicate) { // no pop up during a copy/paste operation
				dS_wkc.scretarymsg(); // see C_dS_workcode.prototype, see (*md19*)
			}
		
		// apply color and pattern if any are set in the workcode
		if(turnon) {
			if(this.state.assess==resaclass.appointment) { // it is possible to select a workcode on a resaclass.event, but that should not adapt the color
				if(dS_wkc.cssColor) this.controls.color.set(dS_wkc.cssColor);
				if(dS_wkc.cssPattern) this.controls.pattern.set(dS_wkc.cssPattern);
				this.settags(perfs, hitid); // see (*wk03*)
			}
		} else {
			if(perfs.length==0) { // the last workcode was just unselected, which means no workcode remains selected
				this.resetCcss();
			}
		}
		
		// adjust reservation duration
			let isnew = this.dS.id<=0; // new reservation
			let duration = 0;
		if(isnew) { // only for new reservations when the user did not draw on the planning, we adapt the duration according to selected workcodes
			if(this.state.isslicy) { // only for reservations where the user did not click and drag an own chosen duration
				for(let id in perfs) { // many workcodes can be selected on the workcode selection control
					let dS_wkc = perfs[id];
					duration += dS_wkc.duration; // sum up durations of all workcodes
				}
				if(duration) this.controls.schedule.setduration(duration);
			}
		}
		
		// workcodes
		this.performances(perfs); // pvh2023 .resetCcss();
		
		// ergonomy
		this.controls.note.focus(true);
		
		if(vbs) {
			let ids = []; for(let id in perfs) ids.push(id);
			vlog('modals.js', 'M_RESA', 'workcodeSelect', 'ids:'+ids+', hit:'+hitid+', turnon:'+(turnon?'on':'off')+', duration set:'+(duration?duration:'no change'));
		}
	},
	workcodesCleared: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'workcodesCleared', '');
		this.controls.tags.reset();
		this.performances().resetCcss({force:true});
	},
	productSelect: function(prdcts, hitid) {
		
		// pop up for secretary
			let dS_prdct = prdcts[hitid]; // the dS_prdct that was just chosen
			let turnon = hitid in prdcts; // the hit item is an activation (going from unchecked to check)
		if(turnon) 
			if(mobminder.context.surfer.secretarypopups)
			if(!mobminder.app.duplicate) { // no pop up during a copy/paste operation
				dS_prdct.scretarymsg(); // see C_dS_product.prototype, see (*md19*)
			}
		
		// workcodes
		this.products(prdcts);
		
		// ergonomy
		// this.controls.note.focus(true);
		
		if(vbs) { // vbs
			let ids = []; for(let id in prdcts) ids.push(id);
			vlog('modals.js', 'M_RESA', 'productSelect', 'ids:'+ids+', hit:'+hitid+', turnon:'+(turnon?'on':'off'));
		}
	},
	productsCleared: function() {
		if(vbs) vlog('modals.js', 'M_RESA', 'workcodesCleared', '');
		// this.controls.tags.reset();
		this.products();
	},
	visitorAdded: function(id) { // called only when adding to the list
		if(vbs) vlog('modals.js', 'M_RESA', 'visitorAdded', 'id:'+id);
		this.fixclass();
		// this.lookupseries().setemails();
	},
	visitorsCleared: function() { 
		if(vbs) vlog('modals.js', 'M_RESA', 'visitorsCleared', '');
		this.fixclass();
		this.lookupseries('visitorsCleared').setemails();
	},
	vacxtrapass: function() { // (*v01*)
			let s = this.controls.schedule.getpost();
		return { cueIn:s.cin, cueOut:s.out };
	},
	oncolorselect: function(cssid) {
		
		
		this.dS.cssColor = cssid;
		if(cssid==0) { // when no color explicitely is assigned, the M_RESA takes the color of the agenda line
			if(this.state.assess == resaclass.appointment) this.modal.setmborder(this.dS.bCal.color);
			else this.modal.setmborder(0);
			if(vbs) vlog('modals.js', 'M_RESA', 'oncolorselect', 'cssid:'+cssid+', ccode:'+this.dS.bCal.color+' (this.dS_resa.bCal.color), assess:'+resaclass.name(this.state.assess));
			return this;
		}
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 223, those are defined here (*mb01*)
			let cclass = dS_customCss.resaClass;
			let ctype = dS_customCss.cssType;
			let cname = dS_customCss.name;
		if(vbs) vlog('modals.js', 'M_RESA', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass+', name:'+cname);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		this.dS.cssPattern = cssid;
		if(cssid==0) { // the default pattern (which is no pattern) was selected
			this.modal.setmpattern(0);
			return this;
		}
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 801, those are defined here (*mb01*)
			let cclass = dS_customCss.resaClass;
			let ctype = dS_customCss.cssType;
			let cname = dS_customCss.name;
		if(vbs) vlog('modals.js', 'M_RESA', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass+', name:'+cname);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	ontags: function(values) {
		// console.log('M_RESA',values);
		const dS_instance = this.clone;
		this.elements.title.innerHTML = dS_instance.rtitle({ cap:true, that:false, icon:true },{ thosetags:values });
		return true;
	},
	staff: function(ids, type) { 
		this.fixclass();
		this.controls.recurr.resume();
		this.controls.id.items.staffchanged = 1;
		if(vbs) vlog('modals.js', 'M_RESA', 'staff', 'type:'+type+', ids:'+ids);
	},
	spanchanged: function(cinout) { // time in or time out has been changed
		const jsdate = new Date(cinout.cin*1000); 
		this.elements.title.innerHTML = ''; 
		setTimeout( () => {  this.elements.title.innerHTML = this.title(jsdate.HHmm(0,'')); }, 660 ); // title time update with a little delay for the style ;) // see (*mr03*)
		this.controls.recurr.resume(cinout.cin);
	},
	newvisitor: function() { // plus button clicked
		let digits = this.controls.visitors.digits();
		if(vbs) vlog('modals.js','M_RESA','newvisitor','digits:'+digits); 
		if(this.state.embedded) { if(this.callbacks.newvisitor) this.callbacks.newvisitor.cb(digits); }
		else new M_VISI(false, { saved:new A_cb(this, this.newvisitorsaved)}, { parent:this, digits:digits } );
	},
	newvisitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('modals.js','M_RESA','newvisitorsaved','id:'+id); 
		this.controls.visitors.add(id);
		this.setemails();
	},
	visiClick: function(visitorId, ctrlshift, event) { // a selected visitor is clicked

		// console.log(visitorId, ctrlshift, event);
	
		const dS_visitor = C_dS_visitor.get(visitorId);
				let opentab = ctrlshift.shiftkey ? 1 : 0; // shift+click opens the modal on the note tab
			if(ctrlshift.ctrlkey) opentab =  2; // ctrl+click opens the modal on the history tab
		if(this.state.embedded) { if(this.callbacks.visiclick) this.callbacks.visiclick.cb(dS_visitor); }
		else new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved)}, { parent:this, tab:opentab });
		return false; 
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('modals.js','M_RESA','visitorsaved','id:'+id); 
		this.controls.visitors.refresh(id);
		this.setemails();
	},
	sms: function(templId, addrId) { this.controls.sms.displayMSG(templId, addrId);	},	
	email: function(templId, addrId) { this.controls.mails.displayMSG(templId, addrId); },
	duplicate: function() {
		
		switch(mobminder.app.screen) { // the behaviour varies depending on which screen you are
			case screens.search: mobminder.app.search.duplicate(this.clone, false /* no cut */); break;
			case screens.week: break; // no search engine on this screen
			default: break;
		}
		this.quit({all:true});
		let cpds = this.dS; // takes over any current modification in the modal ( here you do not pass this.clone !! )
		mobminder.app.copypaste(cpds, { cut:false }); // so to be sure that we don't fuck up a reservation on the planning
	},
	replan: function() { 
		switch(mobminder.app.screen) { // the behaviour varies depending on which screen you are
			case screens.search: mobminder.app.search.duplicate(this.dS, true /* cut */); break;
			case screens.week: break; // no search engine on this screen
			default: break;
		}
		this.quit({all:true});
		mobminder.app.copypaste(this.dS, { cut:true }); // so to be sure that we don't fuck up a reservation on the planning
	},
	recresumed: function(cues) {
		let names = { schedule:{cin:'cueIn',out:'cueOut'}, id:{id:'id'}
					, staff:{ bCals:'bCals', uCals:'uCals' , fCals:'fCals' }
					, recurr:'recurr', stitle:'stitle' };
		mobminder.app.post(this.controls, names, './queries/overbooking.php', new A_cb(this,this.overbooking), new A_cb(this,this.failed));
		
		this.seriesdata(this.state.seriedata); // wraps around here (*rs02*)
	},
	wlselect: function() { return this; },
	plannedapps: function() { // on series display, when the list title "next apps" is clicked, we change the sort order of the list ;)
		this.state.plannedapps = -this.state.plannedapps;
		this.seriedata(this.state.seriedata); // redraws an identical screen but with changed list order, that is why we kept a pointer to this data when here (*rs01*)
	},
	unlink: function() { // the user wants to unlink this reservation from the dS_resa_serie it belongs to
		this.controls.id.items.serieId = 0; // this will unlink the reservation from the serie.
		return this.save();
	},
	ctrlD: function() {
		mobminder.app.showdeleted();
		if(this.state.seriedata) this.seriedata(this.state.seriedata);
		return false; // do not propagate or you might open some fancy menu from the browser
	},

	// ajax callback event handlers
	saved: function(dataSets, stream) {
		if(dataSets) {
			this.quit();
			if(this.callbacks.saved) this.callbacks.saved.cb(dataSets); 
		}
		else {
			// no dataSet was sent back from the post script, check details
			this.modal.busy(false);
			
			let parts = stream.split('!'); parts.shift(); // this protocol is built at server side, see (*20*)
			let servernow = parts.shift()|0;
			let cueIns = parts.shift().split(','); for(let x in cueIns) cueIns[x] = cueIns[x]|0;
			let surfers = parts.shift().split(',');
			let stamps = parts.shift().split(','); for(let x in stamps) stamps[x] = stamps[x]|0;
			let resas = parts.shift().split(',');
			
			let msg = '<h2>'+C_XL.w('you overload the agenda')+'</h2><br/>';
			
			if(cueIns.length > 1) msg += '<b>'+surfers.length+' '+C_XL.w('reservations are covered')+'</b><br/>'+'<br/>';
				else
					msg += '<b>'+C_XL.w('another reservation is covered')+'</b><br/>'+'<br/>';
			
			for(let x in cueIns) {
				let c = ''; if(cueIns.length>1) c = ((x|0)+1)+'. '; // shows a counter only when multiple items are covered
				let cin  = new Date(cueIns[x]*1000); din = C_XL.date(cin,{abreviation:'abr'}); tin = cin.HHmm();
				let chn  = new Date(stamps[x]*1000); tchn = chn.HHmm();
				let delta = (servernow-stamps[x]); let recent = (delta*delta)<360000; // recent is true when the overloaded resa has been created in the preceding 10 minutes

				msg += c+C_XL.w('ondate')+' <b>'+din+'</b> '+C_XL.w('at',{cap:0})+' <b>'+tin+'</b>';
				if(recent) msg+= ' ( '+C_XL.w('changer')+' <b>'+surfers[x]+'</b> '+C_XL.w('at',{cap:0})+' <b>'+tchn+'</b> )';
				msg += '<br/>';
			}
			msg+='<br/>';
			msg = '<div style="text-align:left; display:inline-block; margin:0 auto;">'+msg+'</div>';
			new C_iMSG(msg, { onChoice:new A_cb(this, this.overloadconfirmed) }, { interactivity:'confirm', size:{x:600, y:''}, sound:'note' });
		}
	},
	overloadconfirmed: function(v) {
		if(v=='1') // state is the C_iBUTTON.state
			{ this.controls.id.items.confirm = 1; this.save(); }
	},
	deleted: function() {
		let jsDate = new Date(this.deleting); // note that we passed the resa midnight stamp in the busy status
		this.quit();
		if(this.callbacks.deleted) this.callbacks.deleted.cb(jsDate);
	},
	failed: function(command) { 
		this.modal.busy(false); 
		if(this.callbacks.failed) this.callbacks.failed.cb();
		if(command) this.quit();
	},
	communication: function(stream) { 
		this.resetCommplan(); 
		// and refresh the files list in case any would have changed.
		// console.log(C_dS_resafile.register.byid.keys());
			let fbprint = C_XL.w('blueprint_files_iARRAY_plus', { nested:{icon:'<div class="fa fa-15x fa-layer-plus"></div>',fileclass:'RDV'}});
		if(C_dS_resafile.register.byid.ends()) fbprint = C_XL.w('blueprint_files_iARRAY');
		this.elements.wraps.fbprint.innerHTML = fbprint;
		this.elements.wraps.fllist.innerHTML = this.rrfiles.display('files-archive');
		this.rrfiles.activate();
		
		this.setfiletab();
	},
	communicationfailed: function() { },
	seriesdata: function(inlineDataSets) { // series where current visitors are involved
		
		if(!inlineDataSets) return this;
		
		// let's also change the singular/plural text of the series names dropdown
		let iterations = this.controls.recurr.iterationscount();
		let leftlabel = (iterations-1) ? 'choose from series many' : 'choose from series';
		
		// now let's define options
		let labels = [], order = [];
			labels[0] = C_XL.w('no'); order.push(0);
		for(let sId in inlineDataSets['C_dS_resa_serie']) {
			let dS_serie = inlineDataSets['C_dS_resa_serie'][sId];
			let total = 0;
			const cleaned = dS_serie.stitle.replace(/<([^>]+)>/g, (_, inner) => {total = inner; return '';} ); // "My serie<1>" goes "My serie", "<49>" goes "";
		
			if(cleaned)
				labels[sId] = cleaned+' ('+total+'+'+iterations+')';
			else {
				let date = new Date(dS_serie.created);
				let ddisplay = C_XL.date(date, {abreviation:'full', weekday:false, cap:0 })
				labels[sId] = C_XL.w('a serie created on')+' '+ddisplay+' ('+total+'+'+iterations+')';
			}
			order.push(sId);		
		}
		
			let options = { order:order, labels:labels, count:order.length };
			let css = 'alpha32';
			this.controls.existingseries = new C_iDDWN(this.eids.seriesddwn, { onselect:new A_cb(this, this.onserie) }, options, { maxcols:1, value:this.state.selectedserie } );
		let choose = '<table style="margin:1em auto 2em auto; max-width:90%; vertical-align:top;"><tr>'+this.controls.existingseries.labelled(leftlabel, css);+'</tr></table>';
		
		if(options.count>1) {
			this.elements.wraps.existingseries.innerHTML = choose; // skip the default 'no' option
			this.controls.tabs.hide(6, false);
			this.controls.existingseries.activate();
		}
		else
			this.elements.wraps.existingseries.innerHTML = '';
		
		
		this.state.seriedata = inlineDataSets; // wraps around here (*rs02*)
		
		return this;
	},
	seriedata: function(inlineDataSets) {  // all data related to one given serie
		// displays all appointments of the serie, as this data is asynchronously fetched from the server,
		// this function is called on /query/series.php return.
		// an identical architecture is used in M_VISI::visitorapps(), after a server call the data is updated on the modal tab
		
		if(this.modal.isclosed()) return; // first check if the modal is still open (we fall here after an async call to the server)
		
		// split past and future reservations, and sort them
		let apps = { past:new Array(), future:new Array() };
		let pops = { past:new Array(), future:new Array() };
		let cnts = { past:0, future:0 }; // counts the not-deleted reservations
		let date = new Date(); let timesplit = date.getPHPstamp();
		for(let resaId in inlineDataSets['C_dS_reservation']) {
			let dS_resa = inlineDataSets['C_dS_reservation'][resaId];
			
			// This is tricky : NOT NEEDED, we solved all this by working with C_dS_resafile.register and C_dS_file.register
			//
			// This.dS_reservation is part of the serie. 
			// So when we arrive here, the this.dS_reservation::contructor() has been re-executed.
			// Which makes this.dS_reservation.files be re-initialized to a new C_regS, see (*mr02*) in datasets.js
			// So we use this.dS.id and this.rememberfiles to re-attach the files to the newly created dS_reservation.
			// if(this.dS.id == dS_resa.id) dS_resa.files = this.rememberfiles;

			if(dS_resa.cueIn > timesplit) apps.future.push(dS_resa); else apps.past.push(dS_resa); // indexing of those arrays is integer [0,1,2,3,4,...]
		}
		apps.past.sort(function(a,b){return b.cueIn-a.cueIn; });
		if(this.state.plannedapps==1) { // long future ahead first in list
			apps.future.sort(function(a,b){return b.cueIn-a.cueIn; });
		} else { // this.state.plannedapps==-1, first to come appointment first in list
			apps.future.sort(function(a,b){return a.cueIn-b.cueIn; });
		}
		
		for(let m in apps) // so m can be [past,or future]
			for(let x=0; x<(apps[m].length); x++) {
				let dS_resa = apps[m][x];
				let isdeleted = !!dS_resa.deletorId;
				if(!isdeleted) cnts[m]++; // only a not deleted condition will let the counter increment
				let display = !(isdeleted&&mobminder.app.hidedeleted);
				if(display) pops[m][x] = new C_iRPOP(this.eids.seriepops, dS_resa, new A_cb(this, this.onserieresa), {}); // one resa in each POP. C_iRPOP is used in M_RESA and M_VISI
			}
			
		let remaining = cnts.future;
		let done = cnts.past;
		let total = remaining + done;
		
		// deleting future appointments
			let renabled = false; for(let x in apps.future) if(apps.future[x].deletorId == 0) renabled = true; // enables bin button only if some resas remain to delete
		let remove 	= new C_iCLIK(this.eids.fremv, { click:new A_cb(this, this.sfuturedelete, apps.future.length) }
			, { enabled:renabled, tip:{ text:C_XL.w('del future apps')}, css:'modal-button fa fa-gray fa-trash touch-black', tag:'div'});
			let penabled = false; for(let x in apps.future) if(apps.future[x].deletorId == 0) penabled = true; // enables bin button only if some resas remain to delete
		
		let print 	= new C_iCLIK(this.eids.print, { click:new A_cb(this, this.resasprint, apps) }
			, { enabled:penabled, tip:{ text:C_XL.w('tip print planned appointments')}, css:'modal-button fa fa-gray fa-print touch-green', tag:'div'});
				let hasemail = false; // !!this.state.emails;
			let mailenbl = false; for(let x in apps.future) if(apps.future[x].deletorId == 0) mailenbl = hasemail; // enables bin button only if some resas remain to delete
		
		this.controls.sendemail = new C_iCLIK(this.eids.smail, { click:new A_cb(this, this.resasmail, apps) }
			, { enabled:mailenbl, tip:{ text:C_XL.w('tip email planned appointments')}, css:'modal-button fa fa-gray fa-at touch-blue', tag:'div'});

			let plappsui = '<h2>'+'<div style="padding-right:.5em; color:rgba(200,200,200,.7);" class="fa-11x fas fa-sort-alt">'+'</div>'+C_XL.w('next apps')+': '+remaining+'/'+total+'</h2>';
		let plannedapps = new C_iCLIK(this.eids.plannedapps, { click:new A_cb(this, this.plannedapps) } // makes possible to change the sort order of the list of planned appointments.
			, { enabled:true, tip:{text:C_XL.w('C_iRPOP_orderdir_tip'),css:'help-tip'}, css:'', style:'padding:1em 2em;', ui:plappsui, tag:'div'
			, keys:[C_KEY.code.s.up_arrow /*  */, C_KEY.code.s.down_arrow /*  */ ] } );
		
		// C_iFIELD for choosing or changing the serie name
		let stitle = '<table style="margin:1em auto;"><tr>'+this.controls.stitle.labelled('title', 'alpha24')+'</tr></table>';
		

		// now display reservations
		
			let futurebp = '<div class="blueprint center" style="padding:0 1em;">'+C_XL.w('C_iRPOP_timedate_bp')+'</div>';
			let buttons = plannedapps.display()+futurebp+this.controls.sendemail.display()+print.display()+remove.display();
			
			let fstyle = 'display:flex; justify-content: space-between; align-items:center; padding-right:30px; margin-bottom:1em;';
		let futureheader = '<div style="'+fstyle+'">'+buttons+'</div>';

		let future = '<section style="margin:0 0;">'+futureheader+C_iRPOP.display(pops.future)+'</section>';
		let past = '<section style="margin:3em 0 0 0;">'+'<h2 style="padding:0 0 .8em 1em;">'+C_XL.w('prev apps')+': '+done+'/'+total+'</h2>'+C_iRPOP.display(pops.past)+'</section>';

		this.elements.own.serietotal.innerHTML = ' ('+total+')';
		this.controls.tabs.html(7, stitle+future+past);
		
		for(let m in pops) for(let x in pops[m]) pops[m][x].activate(); 
		this.controls.stitle.activate(); this.controls.sendemail.activate();
		remove.activate(); print.activate(); plannedapps.activate();
		
		this.state.seriedata = inlineDataSets;
	},
	serieresasaved: function(dataSets) { 
		let resa = false;
		for(let id in dataSets['C_dS_reservation']) { resa = dataSets['C_dS_reservation'][id]; break; /*anyway, this brings a single resa back*/ }
		if(vbs) vlog('modals.js','M_RESA','resasaved','date:'+resa.jsDateIn.sortable({y:true})); 
		mobminder.app.setdate.cb(resa.jsDateIn); // switch to change date and updates desk window
		this.loadserie(); // updates also the list inside the tab
	},
	serieresadeleted: function(jsDate) {
		if(vbs) vlog('modals.js','M_RESA','resadeleted','date:'+jsDate.sortable({y:true})); 	
		mobminder.app.setdate.cb(jsDate); // switch to change date and updates desk window
		if(this.state.dS_serieresa.id == this.dS.id) // if the upper RESA_MODAL is deleted and is that same dS_resa we have here, we close this window as wel.
			this.quit({all:true}); // dS_resa was identical
		else
			this.loadserie(); // updates now the list inside the tab
	},	
	filesaved: function(dataSets) {
		if(vbs) vlog('modals.js','M_VISI','filesaved',''); 
		// mobminder.app.refresh();
		this.callforcommunication(); // updates also the list inside the tab
	},
	
	// serie deletion button callbacks
	sfuturedelete: function(cnt) {
			let texto = C_XL.w('planned apps',{cap:1})+': <b>'+cnt+'</b><br/>'+C_XL.w('delete all confirm');
		new C_iMSG(texto, { onChoice:new A_cb(this, this.sfuturedelchoice) }, { interactivity:'confirm' } );
		return false;
	},
	sfuturedelchoice: function(v) {
		if(v=='0') return false;

		let post = new C_iPASS({id:this.dS.serie.id, archived:this.dS.archived, side:'future' });
		let names = { post:{id:'id', archived:'archived', side:'side'} };
		mobminder.app.post({post:post}, names, './delete/serie.php', new A_cb(this,this.sdeleted), new A_cb(this,this.failed));
		this.deleting = this.dS.midnight*1000;
		// if(this.dS.id>0) this.dS.unregister();
	},
	sdeleted: function(inlineDataSets) {		
		this.seriedata(inlineDataSets);
		let jsDate = new Date(this.deleting); // note that we passed the resa midnight stamp in the busy status
		if(this.callbacks.deleted) this.callbacks.deleted.cb(jsDate);
		for(let resaId in inlineDataSets['C_dS_reservation']) 
			if(resaId==this.dS.id) 
				if(inlineDataSets['C_dS_reservation'][resaId].deletorId) // then we have removed that deleted reservation for which the modal is opened.
					{ let that = this; setTimeout(function() { return that.quit() }, 1000); } // close the window
	},
	overbooking: function(dSets, stream) {
		let ovbks = stream.extract('<array>','</array>').match.split(newline); ovbks.shift(); ovbks.pop();
		let bycue = new Array(); for(let x in ovbks){
			let split = ovbks[x].split('!'); let cuein = split[0]; let rids = split[1].split(',');
			bycue[cuein] = rids;
		}
		let cues = new Array(); for(let cuein in bycue) cues.push(cuein);
		this.controls.recurr.prevdisplay(bycue);
	},
	
	resasprint: function(apps) {
		let ids = this.controls.visitors.value();
		let vids = [];
		for(let vid in ids) vids.push(vid);
		vids = vids.join('!');
		let sid = this.controls.id.items.serieId;
		const newTab = window.open('print_appointments.php?vid='+vids+'&sid='+sid+'', '_blank', 'noopener');
		if(newTab) newTab.focus();
	},
	resasmail: function(apps) {
		// console.log('resasmail');
		// console.log(apps);
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//
//    M _ P A Y M E N T
//

function M_PAYMENT(dataSets, callbacks, preset) {
	
	this.dS = dataSets.dS_payment; // instance of C_dS_payment, see (*ep07*)
	this.dS_resa = dataSets.dS_reservation; // instance of C_dS_payment
	this.state = M_PAYMENT.defaults.align(preset); // preset like { see M_PAYMENT.defaults }
	
	this.callbacks = callbacks || {}; // like { saved:, deleted: }
	const b = 'payments'+'_'+this.dS.id+'_';
	this.eids = { 
		own: { paymean:b+'pymn', summary:b+'smry', tabs:b+'tbsdiv', title:b+'title', qrcodewrap:b+'qrcwrp', qrcode:b+'qrc', cardsst:b+'cst', qrcface:b+'qrcfce', qrcstatus:b+'qrcst', dsaudit:b+'dsodt', txtst:b+'txtst' },
		ctrls: { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', paymean:b+'pmean', pstatus:b+'pstts', qrcode:b+'pqrc'
		, hname:b+'hname', iban:b+'iban', transid:b+'tsid', ostts:b+'ostts', price:b+'price', color:b+'color', pattern:b+'patt', tag:b+'tag', note:b+'note', check:b+'check' }
		};
	this.elements = new A_el();
	
		const is = this.dS.is();
		// const disabled = is.payco||is.cards;
		const disabled = true;
		
		const maysave =  is.cash || is.mobqr;
		const maydelete =  (is.cash || is.mobqr)&&!is.anew;
	const cartouche	= new C_iDQS(this.eids.ctrls.buttons, { onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:maydelete, save:maysave } );

	const pass		= new C_iPASS({id:this.dS.id, rid:this.dS.groupId, paymean:this.dS.paymean, billamount:this.state.billamount, bank:this.dS_resa.rmem}); // invariant during the process of this payment

		let commtext = this.dS.transnote; if(is.anew) commtext = this.dS_resa.getpaycomm(this.dS.paymean); // sets the default comment that we write in the notes
	const note 	= new C_iFIELD(this.eids.ctrls.note, { onfchange:false }, { digits:commtext, type:INPUT_ML_TEXT, rows:3, focus:false, enabled:is.cash }); 
	const price 	= new C_iFIELD(this.eids.ctrls.price, { onfchange:false }, { digits:this.dS.amount, units:C_XL.w('euros'), type:INPUT_PRICE, mandatory:false, focus:false, enabled:is.cash });
		
	const holder 		= new C_iFIELD(this.eids.ctrls.hname, false, { digits:this.dS.accountholder, type:INPUT_TEXT, mandatory:false, focus:false, enabled:false });
	const iban 		= new C_iFIELD(this.eids.ctrls.iban, false, { digits:this.dS.accountIBAN, type:INPUT_TEXT, mandatory:false, focus:false, enabled:false });
	const transid 	= new C_iFIELD(this.eids.ctrls.transid, false, { digits:this.dS.transid, type:INPUT_TEXT, mandatory:false, focus:false, enabled:false });
	const opstatus 	= new C_iFIELD(this.eids.ctrls.ostts, false, { digits:this.dS.opstatus, type:INPUT_TEXT, mandatory:false, focus:false, enabled:false });
	
		const slabels = C_dS_payment.status.options(this.dS.paymean);
		// this.autostatus();
	
	if(is.anew)
		if(is.cash||is.mobqr) {
			this.dS.transtatus = C_dS_payment.status.code.pending; // displays as "pending"
		}
	
	this.state.previous = this.dS.transtatus; // important for polled items, that we know the previous status (so to identify some step ups)
		
	// we set the dorp down ready to save as "success", but the dataSet keeps running in isnew state until we save()
	const pstatus	= new C_iDDWN(this.eids.ctrls.pstatus, { onselect:new A_cb(this, this.onstatus) },  { labels:slabels }, { value:this.dS.transtatus, enabled:!disabled } );	
				
	const paymean = new C_iPAY(this.eids.ctrls.paymean, this.dS_resa, { onpaymean:new A_cb(this, this.onpaymean) }, preset);
		paymean.restrict(this.dS.amount);
		
		const tip = C_XL.w('ep-tip qrcode zoom');
		const qrnest = '<div id="'+this.eids.own.qrcode+'"></div>';
	const qrcode = new C_iCLIK(this.eids.ctrls.qrcode, { click:new A_cb(this, this.onqrcode) }, { ui:qrnest, enabled:true, tip:tip, tag:'div', style:'padding:10px;', css:'' } );
	
		const tabscaptions = C_XL.w({0:'ep-tab overview', 1:'ep-tab qrcode', 2:'ep-tab status', 9:'audit'});
		tabscaptions[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs	= new C_iTABS(this.eids.ctrls.tabs, tabscaptions );

	this.controls = new A_ct( { pass:pass, tabs:tabs, cartouche:cartouche, paymean:paymean, qrcode:qrcode, holder:holder, iban:iban, transid:transid, opstatus:opstatus, price:price, note:note, pstatus:pstatus } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:500}, moves:true } );
	
	this.activate();
}
M_PAYMENT.defaults = new A_df( { activated:false, darkenedoverlay:false, previous:false, billamount:0 } );
M_PAYMENT.prototype = {  
	// private
	header: function() {
					let buttons = '<td class="cartouche" style="width:30%;">'+this.controls.cartouche.display()+'</td>';
					let title 	= '<td class="mheader" style="padding-bottom:1em;" id="'+this.eids.own.title+'">'+this.title()+'</td>';
				let header 		= '<tr>'+buttons+title+'</tr>';
			let divHeader 	= '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
			let divTabs  = '<div id="'+this.eids.own.tabs+'" style="display:none; text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		let html = '';
		let is = this.dS.is();
		
		// choose from payment means
			let choosepaymean = this.controls.paymean.display();
		html += '<div id="'+this.eids.own.paymean+'" style="display:none; justify-content:center; padding:3em 1em; display:flex;">'+choosepaymean+'</div>';
		
				let price = '<tr>'+this.controls.price.labelled('amount', 'alpha06 idle')+'</tr>';
				let pstatus = '<tr>'+this.controls.pstatus.labelled('status')+'</tr>';
					let notecaption = 'ep-communication'; if(is.cash) notecaption = 'note';
				let note = '<tr>'+this.controls.note.labelled(notecaption,'ta24 idle')+'</tr>';
				
			let identification = '<table class="coords" summary="identification">'+price+pstatus+note+'</table>';
		
		// payment summary
			let tab0 = this.controls.tabs.container(0, identification);
			
			
		// QRcode
				let qrcode = this.controls.qrcode.display();
			let tab1 = this.controls.tabs.container(1, qrcode);
				let hide_t1 = is.endstate||(!is.qrcode); // for polled paymeans, we rely on tab2 (status display)
			this.controls.tabs.hide(1, hide_t1); // No QR code for cash or cards transactions
			
			
		// Status
				let fad = '<div class="fad fa-10x fa-file txt-gray_m" style="width:300px; line-height:200px; text-align:center;"></div>';
				let eided = '<div id="'+this.eids.own.cardsst+'">'+fad+'</div>';
			let tab2 = this.controls.tabs.container(2, eided);
				let hide_t2 = is.endstate||(!is.cards);
			this.controls.tabs.hide(2, hide_t2); // display of status is reserved for polled mayment means (which is bank cards based)
			
		// audit
				let iban = '', holder = '', transid = '', opstatus = '', more = '';
				if(is.payco||is.cards) {
					iban = '<tr>'+this.controls.iban.labelled('ep-counterparty', 'alpha20 idle')+'</tr>';
					holder = '<tr>'+this.controls.holder.labelled('ep-account holder', 'alpha20 idle')+'</tr>';
					transid = '<tr>'+this.controls.transid.labelled('ep-operator transid', 'alpha20 idle')+'</tr>';
					opstatus = '<tr>'+this.controls.opstatus.labelled('ep-operator status', 'alpha20 idle')+'</tr>';
					more = '<div style="margin:2em auto;"><table class="coords" summary="transaction meta data">'+holder+iban+transid+opstatus+'</table></div>';
				}
			let tracking = '<div style="justify-content:center; padding:1em; display:flex;">'+this.dS.tracking()+'</div>';
				
			let dataset = '<div id="'+this.eids.own.dsaudit+'" style="margin:2em auto;"></div>';
			
			let tabA = this.controls.tabs.container(9, more+tracking+dataset);
		
		html += '<div id="'+this.eids.own.summary+'" style="display:none;">'+tab0+tab1+tab2+tabA+'</div>';
				
		return html;
	},
	activate: function() {
		if(vbs) vlog('modals.js','M_PAYMENT','activate','');
		this.elements.collect(this.eids.own);
		this.controls.activate('M_PAYMENT');
		
		let is = this.dS.is();
			let unlockedstatus = is.cash||is.mobqr;
		this.controls.pstatus.enable(unlockedstatus);
	
		this.displayswitch();

			let reads = 'Welcome to Mobminder';
		if(this.dS.qrcodestring) reads = this.dS.qrcodestring;
		this.setqrcode(reads);
		
		// if(this.dS.id <=0 && this.dS_resa.billamount)
		if(is.anew) {
			if(is.qrcode) this.controls.tabs.set(1); // QR code display.
			if(is.cards) this.controls.tabs.set(2); // status display.
			this.autosave();
			if(is.mobqr||is.cash) this.controls.pstatus.set(C_dS_payment.status.code.success); // prepares the dropdown to save as a success
		} else
			if(is.pending) {
				if(is.payco) this.controls.tabs.set(1); // status or qr code display.
				if(is.cards) this.controls.tabs.set(2); // status display.
			}
		
		this.setaudit();
		this.refreshdisplay();
	},
	refreshdisplay: function() {
		if(vbs) vlog('modals.js','M_PAYMENT','refreshdisplay','');
		this.pollfeedback();
	},
	
	// private
	title: function() {
		let paymean = ''; // applies for new payments when the payment mean is not yet known
		switch(this.dS.paymean) {
			
			case C_dS_payment.type.notset: 		paymean = 'ep-paytype not set'; 	break; // see (*ep13*)
			case C_dS_payment.type.cash: 		paymean = 'ep-paytype cash'; 		break;
			case C_dS_payment.type.mobqrcode: 	paymean = 'ep-paytype sepa qr'; 	break;
			case C_dS_payment.type.payconiq: 	paymean = 'ep-paytype payconiq'; 	break;
			case C_dS_payment.type.cards: 		paymean = 'ep-paytype cards'; 		break;
			case C_dS_payment.type.softpos: 	paymean = 'ep-paytype softpos'; 	break;
			case C_dS_payment.type.hardpos: 	paymean = 'ep-paytype hardpos'; 	break;
			case C_dS_payment.type.onlinepayco: 		paymean = 'ep-paytype onlinepayco'; break;
			case C_dS_payment.type.onlinecards: 		paymean = 'ep-paytype onlinecards'; break;
			case C_dS_payment.type.onlinebancontact: 	paymean = 'ep-paytype onlinebancontact'; break;
		}
		let title = '<h1 class="modal-payment" style="display:flex; justify-content:right; align-items:center;">'+C_XL.w(paymean)+' '+this.dS.pbullet({display:'modaltitle'})+'</h1>';
			let amount = C_iEDIT.ergoprice(this.dS.amount);
			
		if(this.dS.paymean == C_dS_payment.type.notset) return title; // new payment, no status line needed
			
		let status = '<h1 style="font-size:1.3em; opacity:.7; line-height:2em;">('+amount+' '+C_XL.w('euros')+', <span id="'+this.eids.own.txtst+'">'+this.dS.pstatus()+'</span>'+')</h1>';
		return title+status;
	},
	displayswitch: function() { // switches from payment mean choice display to casual modal look when paymean is defined already
	
			let haspaymean = this.dS.paymean !== C_dS_payment.type.notset;
		if(haspaymean) {
			$(this.elements.summary).show();
			$(this.elements.tabs).show();
			$(this.elements.paymean).hide();
		}
		else {
			$(this.elements.summary).hide();
			$(this.elements.tabs).hide();
			$(this.elements.paymean).show();
		}
		this.elements.title.innerHTML = this.title();
		this.elements.collect(this.eids.own); // again, because displayswitch() re-writes the title() while we need to use this.elements.onw.txtst during this.pollfeedback() execution
		
		return this;
	},

	setqrcode: function(reads) { // takes a string in input and drops it under the form of a qr code into this.elements.qrcode
		
		this.elements.qrcode.innerHTML = '';
		let options = {
			
			render: 'canvas', // render method: 'canvas', 'image' or 'div'
			minVersion: 5, maxVersion: 40, // version range somewhere in 1 .. 40
		
			ecLevel: 'Q', // error correction level: 'L', 'M', 'Q' or 'H'
			left: 0, top: 0, // offset in pixel if drawn onto existing canvas
			size: 300, // size in pixel
			fill: '#7595AF', // code color or image element
			background: null, // background color or image element, null for transparent background
		
			// content
			text:reads,
		
			radius: 0.1, // corner radius relative to module width: 0.0 .. 0.5
			quiet: 0, // quiet zone in modules
			mode: 0, // [ 0: normal, 1: label strip, 2: label box, 3: image strip, 4: image box ]
		
			mSize: 0.3, // logo size (percent)
			mPosX: 0.5,mPosY: 0.5, // logo position (percent)
			
			label: 'no label', fontname: 'sans', fontcolor: '#000',
			image: null
		};

		$(this.elements.qrcode).qrcode(options); // we get the qrcode image from a jquery library, see /jquery/qrcodes/mobqrcodelib.js
	},
	setaudit: function() {
		
				let classandstyle = 'class="textcolor-light" style="text-align:right; padding-right:1em"';
			let id 			= '<tr><td '+classandstyle+'>id:</td><td>'+this.dS.id+'</td></tr>';
			let amount 		= '<tr><td '+classandstyle+'>amount:</td><td>'+this.dS.amount+'</td></tr>';
			let transtatus 	= '<tr><td '+classandstyle+'>mobstatus:</td><td>'+this.dS.transtatus+' '+this.dS.pstatus()+'</td></tr>';
			let oopstatus 	= '<tr><td '+classandstyle+'>opstatus:</td><td>'+this.dS.opstatus+'</td></tr>';
			let qrcode 		= '<tr><td '+classandstyle+'>qrcode:</td><td>'+this.dS.qrcodestring+'</td></tr>';
		let dataset = '<table class="coords" summary="transaction meta data">'+id+amount+transtatus+oopstatus+qrcode+'</table>';
		this.elements.dsaudit.innerHTML = dataset;
		return this;
	},
	newds: function(freshdataset) { // new dataset received from server (this behaviour is very specific from this modal)
		this.dS = freshdataset; 
		this.setaudit();
		this.controls.pass = new C_iPASS({id:this.dS.id, rid:this.dS.groupId, paymean:this.dS.paymean, billamount:this.dS_resa.billamount, bank:this.dS_resa.rmem});
		return this;
	},
	autosave: function() { // calls the server and saves the data BUT does not close the modal, this is only for certain payment means
		if(this.controls.price.value()) 
			switch(this.dS.paymean) {
				case C_dS_payment.type.mobqrcode:
				case C_dS_payment.type.payconiq:
				case C_dS_payment.type.softpos:
				case C_dS_payment.type.hardpos: 
					if(vbs) vlog('modals.js','M_PAYMENT',' a u t o s a v e ','pid: '+this.dS.id);
					this.save(true); break; // saves but do not quit the modal, see (*uq01*)
			}
			
		// for cash payments, there is no auto-save nor auto-close
		return this;
	},
	autoclose: function() {
			
			let success = (this.dS.transtatus==C_dS_payment.status.code.success); // auto-close the payment modal when success is achieved on polling payments
		if(!success) return;
		
		if(vbs) vlog('modals.js','M_PAYMENT','autoclose','pid: '+pid);
		let is = this.dS.is(); if(!is.polled) return;
			let that = this;
		this.timer = setTimeout( function(){ that.quit(); }, 2000); // leaves the display open for 2 more seconds ( indicating 'success' ), then auto-closes the modal
	},
	abort: function() { // here we manage a quit() or escape() impact on payment
		
		if(this.dS.id<=0) C_dS_payment.del(this.dS.id, this.dS_resa.rmem); // a newly made item is abandonned by quitting the modal on escape keyboard key
			
			let is = this.dS.is();
		
		if(is.cash&&is.anew) { // there is no auto-save for cash stuff, so we just remove this item from local
			C_dS_payment.del(this.dS.id, this.dS_resa.rmem); // a newly made item is abandonned by quitting the modal through quit cartouche button [X] or Esc key
		}
		
		if(is.mobqr&&is.pending) { 
			this.controls.pstatus.set(C_dS_payment.status.code.cancelled); // saves to DB with status "cancelled"
			this.dS.transtatus = C_dS_payment.status.code.cancelled; // that will reflect on the C_iBILL list, through the call to this.callbacks.escaped()
			this.autosave(); // records to server that this item gets cancelled by user
		}
		
		if(vbs) vlog('modals.js','M_PAYMENT',' a b o r t ','id='+this.dS.id+', pmean:'+this.dS.paymean+', status:'+this.dS.transtatus);
		
	},
	
	// polling feedback
	//
	pollfeedback: function() { // this one handles one payment at a time, see (*ep08*) and is called by the C_iBILL watchdog process
			let pid = this.dS.id;
		
		if(pid>0) dS_payment = C_dS_payment.get(pid, this.dS_resa.rmem); // seek from the right bank
			else dS_payment = this.dS; // this is the case of a brand new item before the auto-save.
		
			let is = this.dS.is();
		if(!is.polled) return; // cash and mobqr do NOT go through here
			
		if(vbs) vlog('modals.js','M_PAYMENT','pollfeedback','pid: '+pid);
		
		// update status display in the modal header, and on the overview tab
		this.elements.txtst.innerHTML = dS_payment.pstatus(); // updates modal title
		this.controls.pstatus.set(dS_payment.transtatus); // updates dropdown display
		this.setaudit();
		
		let sound = false;
		
		let display = '', color='';
		switch(dS_payment.transtatus) {
			case C_dS_payment.status.code.success: 		display = 'fa-check'; 				color = 'mob-txt-lime'; sound = mobminder.sounds.success; break;
			case C_dS_payment.status.code.failed: 		display = 'fa-exclamation-triangle';color = 'orange'; 		sound = mobminder.sounds.failure; break;
			case C_dS_payment.status.code.cancelled: 	display = 'fa-times';				color = 'mob-txt-blue'; sound = mobminder.sounds.failure; break;
			case C_dS_payment.status.code.expired: 		display = 'fa-hourglass-end';		color = 'orange'; 		sound = mobminder.sounds.failure; break;
			case C_dS_payment.status.code.unauthorized: display = 'fa-ban';					color = 'orange'; 		sound = mobminder.sounds.failure; break;
			
			case C_dS_payment.status.code.pending: 		if(is.cards) display = 'fa-random'; color = 'mob-txt-blue-soft'; break;
			case C_dS_payment.status.code.identified: 	break;
			case C_dS_payment.status.code.isnew: 		break;
		}
		if(display) { // replace the QRcode drawing with an iconic result status display
			let fad = '<div class="fad fa-10x '+display+' '+color+'" style="width:300px; line-height:200px; text-align:center;"></div>';
			let caption = '<div class="'+color+'" style="line-height:100px; text-align:center; font-size:200%">'+C_XL.w(C_dS_payment.status.translate[dS_payment.transtatus])+'</div>';
			if(is.cards) this.elements.cardsst.innerHTML = fad+caption;
				else this.elements.qrcode.innerHTML = fad+caption;
		}
		
			let stepup = this.state.previous != dS_payment.transtatus;
		if(stepup) { // there is a change compared to previous polling
			
			if(sound)  sound.play();
			
				let success = (dS_payment.transtatus==C_dS_payment.status.code.success);
				let that = this;
				
			if(success) 
				this.timer = setTimeout( function(){ 
					if(that.modal.isclosed()) return; // during the timer ticking, the modal was manually escape or quit by the user
					if(that.callbacks.escaped) that.callbacks.escaped.cb(that.dS);
					that.modal.close(); 
				}, 2000); // leaves the display open for 2 more seconds ( indicating 'success' ), then auto-closes the modal
		}
		
		this.state.previous = dS_payment.transtatus;
		return; // returning false will pause the polling
	},
	
	// events handling
	//
	save: function(unquit) { // if unquit is true, the modal doesn't close during execution of self::saved()
			unquit = unquit||false;
		this.controls.price.pushprice(); // turns decimal-less integer input ( e.g. 30 ) into a proper price expressed in cents ( e.g. 30.00 )
		if(!this.controls.validation()) return;
		this.modal.busy(!unquit); 
		this.controls.pass.poke('paymean',this.dS.paymean);
		let names = { pass:{id:'id', rid:'groupId', paymean:'paymean', billamount:'billamount', bank:'bank'}
					, name:'name', price:'amount', note:'transnote', pstatus:'transtatus' };
		mobminder.app.post(this.controls, names, './post/payment.php', new A_cb(this,this.saved, unquit), new A_cb(this,this.failed));
		return this;
	},
	remove: function() { 
		this.modal.busy(true);
		let names = { pass:{id:'id', rid:'groupId', paymean:'paymean', bank:'bank'}, name:'name', price:'amount', note:'transnote', pstatus:'transtatus' };
		mobminder.app.post(this.controls, names, './delete/payment.php', new A_cb(this,this.deleted), new A_cb(this,this.failed));
	},
	quit: function() { 
		if(vbs) vlog('modals.js','M_PAYMENT','quit','id='+this.dS.id+', pmean:'+this.dS.paymean);	
		
		this.abort();
		if(this.callbacks.escaped) this.callbacks.escaped.cb(this.dS);
		this.modal.close(); 
	},
	escape: function() { 
		if(vbs) vlog('modals.js','M_PAYMENT','escape','id='+this.dS.id+', pmean:'+this.dS.paymean);
		
		this.abort();
		if(this.callbacks.escaped) this.callbacks.escaped.cb(this.dS);
		return true;
	},
	onpaymean: function(pmean) { // you reach here only from the paymean choice display when the (+) button of C_iBILL is touched
		if(vbs) vlog('modals.js','M_PAYMENT','onpaymean','id='+this.dS.id+', pmean:'+pmean);
		this.dS.paymean = pmean;
			
				let is = this.dS.is();
			let unlockedstatus = is.cash||is.mobqr;
		this.controls.pstatus.enable(unlockedstatus);
	
		this.displayswitch();
		
			let maysave =  is.cash || is.mobqr;
		this.controls.cartouche.visible('save', maysave).enable(maysave, 'save');

		this.setqrcode('New from the plus list');
		
		if(is.qrcode) this.controls.tabs.set(1); // QR code display.
		if(is.cards) this.controls.tabs.set(2); // status display.
		this.autosave();
		if(is.mobqr||is.cash) this.controls.pstatus.set(C_dS_payment.status.code.success); // prepares the dropdown to save as a success
	
			let hide_t1 = !is.qrcode; // for polled paymeans, we rely on tab2 (status display)
		this.controls.tabs.hide(1, hide_t1); // No QR code for cash or cards transactions
			
			let hide_t2 = !is.cards;
		this.controls.tabs.hide(2, hide_t2); // display of status is reserved for polled mayment means (which is bank cards based)
		
		this.setaudit();
		this.refreshdisplay();
		if(this.callbacks.newitem) this.callbacks.newitem.cb(this.dS);
	},
	onqrcode: function(pmean) { // payment mean is chosen from inside a newly made payment modal
		if(vbs) vlog('modals.js','M_PAYMENT','onqrcode','');
		this.modal.darkenoverlay(this.state.darkenedoverlay=!this.state.darkenedoverlay);
	},
	onstatus: function(which) {
		if(vbs) vlog('modals.js','M_PAYMENT','onstatus','which:'+which);
	},	
		
	// ajax callbacks event handlers
	saved: function(unquit, inlineDataSets) {
		let dataset = inlineDataSets['C_dS_payment']; for(let id in dataset) { dataset = dataset[id]; break; } // retrieve the only one dS_payment streamed by server
		if(vbs) vlog('modals.js','M_PAYMENT','saved','id='+dataset.id+', pmean:'+dataset.paymean+', unquit:'+unquit);
		
		if(this.dS.id == 0) if(this.dS.id != dataset.id) { // This happens for new items (original id is zero and new id is assigned by DB autoincrement)
			C_dS_payment.del(this.dS.id, this.dS_resa.rmem); // remove this older version from the payments register
			this.controls.note.set(dataset.transnote);
		}
			
		this.dS = dataset; // unlinks the original this.dS setting, previously set in the constructor (*ep07*)
		
		if(dataset.qrcodestring) {
			this.setqrcode(dataset.qrcodestring);
		}
		
		if(unquit) { // keeps this modal open (e.g. for a QRcode that should be scanned)
			// you end up here only for payments needing an auto-save at dS creation; see (*uq01*) in this.autosave();
			this.newds(dataset);
			this.pollfeedback(); // refreshes the modal display, this one is needed so that a payment in status 'new' will immediately display 'pending' after autosave();
			this.modal.busy(false); 
		} else {
			if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
			this.modal.close(); 
		}
	},	
	deleted: function(inlineDataSets) {
		let dataset = inlineDataSets['C_dS_payment'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		this.dS = dataset;
		if(vbs) vlog('modals.js','M_PAYMENT','deleted','id='+this.dS.id+', pmean:'+this.dS.paymean+', status:'+this.dS.transtatus);
		this.modal.close(); 
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dS);
	},
	failed: function() { 
		this.modal.busy(false);
	}
}



function M_iPairGoCrypto(dS_account, callbacks, preset) { // custom CSS
	preset = preset || {};
	this.dS = dS_account; 
	let paired = mobminder.account.has.epay.epayhard;
		// !!this.dS.ePayHardPayClientId &&
		// !!this.dS.ePayHardPayClientSecret;
		// !!this.dS.ePayHardPayToken; 
	this.is = { paired:paired, unpaired:!paired }
	
if(vbs) vlog('modals.js','M_iPairGoCrypto','constructor','id='+this.dS.id+', type='+this.dS.cssType+', class='+this.dS.resaClass);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	let b = 'pair'+'_';
	this.eids = { id:b+'id', cartouche:b+'dqs', tabs:b+'tabs', otp:b+'otp', name:b+'name', dopair:b+'pair', dounpair:b+'unpair' };
	this.elements = new A_el();
	
		let mayremove = false;
		let maysave = false;
	let cartouche	= new C_iDQS(this.eids.cartouche, { onquit:new A_cb(this, this.quit)}, { remove:mayremove, save:maysave } );

	let id	= new C_iPASS({id:this.dS.id});
	let name = new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose a name') }); 
	let otp = new C_iFIELD(this.eids.otp, false, { digits:'', type:INPUT_TEXT, mandatory:true, focus:false, placeholder:C_XL.w('ep-copy here OTP') }); 
	
		let ipair = symbol('pair', 'fa-2x', 'padding:20px');
	let dopair = new C_iCLIK(this.eids.dopair, { click:new A_cb(this, this.dopair) }, { ui:ipair, enabled:true, tip:false, tag:'div', style:'' } );
	
		let iunpair = symbol('unpair', 'fa-2x', 'padding:20px');
	let dounpair = new C_iCLIK(this.eids.dounpair, { click:new A_cb(this, this.dounpair) }, { ui:iunpair, enabled:true, tip:false, tag:'div', style:'' } );


	let tabs		= new C_iTABS(this.eids.tabs, C_XL.w({ 0:'ep-pair', 1:'ep-unpair' }), false, {current:preset.tab||0} ); // see (*hp10*)

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, otp:otp, name:name, dopair:dopair, dounpair:dounpair } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:560}, moves:true } );
	this.activate();
}
M_iPairGoCrypto.prototype = {
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-pairgocrypto">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
				let name = '<tr>'+this.controls.name.labelled('ep-terminal name','alpha12')+'</tr>';
				let otp = '<tr>'+this.controls.otp.labelled('ep-OTP','alpha12')+'</tr>';
				let dopair = '<tr><td class="label textcolor-light">'+C_XL.w('ep-pair')+'</td><td>'+this.controls.dopair.display('button')+'</td></tr>';
			let layout0 = '<table summary="pairing HPOS" class="coords" style="margin:0 auto">'+name+otp+dopair+'</table>';
		
		let tab0 = this.controls.tabs.container(0, layout0);
		this.controls.tabs.hide(0, this.is.paired); // hide if already paired
		
				let dounpair = '<tr><td class="label textcolor-light">'+C_XL.w('ep-unpair')+'</td><td>'+this.controls.dounpair.display('button')+'</td></tr>';
			let layout1 = '<table summary="unpairing HPOS" class="coords" style="margin:0 auto">'+dounpair+'</table>';
		
		let tab1 = this.controls.tabs.container(1, layout1);		
		this.controls.tabs.hide(1, this.is.unpaired); // hide if un-paired
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_iPairGoCrypto');
		this.controls.tabs.set(this.is.paired?1:0);
	},
	
	// private
	title: function() {
		return 'GoCrypto Pair/Unpair Terminal';
	},

	// event handling
	dopair: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { tabs:'tabs', id:{ id:'id'}, otp:'otp', name:'name' };
		mobminder.app.post(this.controls, names, './post/HPOSpair.php', new A_cb(this,this.paired), new A_cb(this,this.failed));
	},
	dounpair: function() {
		this.modal.busy(true);
		let names = { tabs:'tabs', id:{ id:'id'} };
		mobminder.app.post(this.controls, names, './post/HPOSpair.php', new A_cb(this,this.unpaired), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); }, // see (*md01*)
	escape: function() { return true; },
	
	// ajax callback event handlers
	paired: function(inlineDataSets) {
		
		let dSs = inlineDataSets['C_dS_group'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; }; // which is a C_dS_group	
		
		this.dS.ePayHardPayClientId = dS.ePayHardPayClientId; // writes right through mobminder.account
		this.dS.ePayHardPayClientSecret = dS.ePayHardPayClientSecret;
		this.dS.ePayHardPayToken = dS.ePayHardPayToken;
		
		if(vbs) vlog('modals.js','M_iPairGoCrypto','paired','account id='+dS.id);

		if(this.callbacks.paired) this.callbacks.paired.cb(this.dS); // intended to further refresh the display of keys
		
		this.modal.busy(false).close();
		
	},
	unpaired: function(inlineDataSets) {
		
		let dSs = inlineDataSets['C_dS_group'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; }; // which is a C_dS_group	
		
		this.dS.ePayHardPayClientId = dS.ePayHardPayClientId; // writes right through mobminder.account
		this.dS.ePayHardPayClientSecret = dS.ePayHardPayClientSecret;
		this.dS.ePayHardPayToken = dS.ePayHardPayToken;
		
		if(vbs) vlog('modals.js','M_iPairGoCrypto','unpaired','account id='+dS.id);

		if(this.callbacks.paired) this.callbacks.unpaired.cb(this.dS); // intended to further refresh the display of keys
		
		this.modal.busy(false).close();
	},
	failed: function() {
		this.modal.busy(false).close();
	}
}
M_iPairGoCrypto.isdefault = function(eid, set) {
	this.picker = new C_iCRESTA(eid, {}, { labels:C_XL.w({isdefault:'default'}), presets:{isdefault:set} }, { skin:1, mode:0, title:false } );
	this.activate = function() { return this.picker.activate() };
	this.display = function(css) { return this.picker.display(css); };
	this.getpost = function() { return this.picker.setting(); };
}







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//     T A S K S ,   N O T E S ,   C H A T S 
//

function M_TASK(dataSet, callbacks, preset) { // dataSet is a C_dS_task_description()
		preset = preset || { visirefs:new Array() };
	this.dataSet = dataSet;
	this.callbacks = callbacks || {}; // like { saved:, removed: }
	const b = 'task'+'_L'+C_iMODAL.layer+'_'+this.dataSet.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', archive:b+'arch'
		, title:b+'title', color:b+'color', pattern:b+'patt', visiref:b+'vrefs', note:b+'note', midnIn:b+'mdnin'
		, assignees:b+'addr', progrs:b+'progr', overview:b+'ovrvw'
		, own:{ htitle:b+'htitle' } };
	this.elements = new A_el();
		
		const loginId = mobminder.context.loginId;
		const remove = (this.dataSet.id>0) && (mobminder.context.surfer.accessLevel>=aLevel.supervisor);
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:remove });
	
	const archive 	= new C_iCLIK(this.eids.archive, { click:new A_cb(this, this.archive) }
		, { enabled:true, tip:{ text:C_XL.w('archive')}, css:'modal-button fa fa-gray fa-archive touch-blue', tag:'div', style:'font-size:1.4em;'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.a /* a like archive, you guess? I do ... */] });
	
	const id		= new C_iPASS(this.dataSet.id);
	
		const visirefs = this.dataSet.id>0 ? this.dataSet.visirefs.byid.get() : preset.visirefs;
		const mandatitle = !this.dataSet.visirefs.byid.ends(); // a title must be specified if there is no referenced visitors
	const title 	= new C_iFIELD(this.eids.title, { onfchange:new A_cb(this, this.tchange) }, { digits:this.dataSet.title, type:INPUT_TEXT, mandatory:mandatitle, focus:true });
	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:class_task, csstype:ccsstype.color, value:this.dataSet.cssColor, enabled:true } /*preset*/ );
	const visiref 	= new C_iACPICK(this.eids.visiref, C_dS_visitor, { changed:new A_cb(this, this.vselect), added:new A_cb(this, this.vadd), cleared:new A_cb(this, this.vclear)}, { focus:false, placeholder:C_XL.w('visitors'), ids:visirefs, onlabelclick:new A_cb(this, this.visiref)} );

	const note 	= new C_iNOTE(this.eids.note, this.dataSet.description, {rows:12} );
	const midnIn 	= new C_iDP(this.eids.midnIn, {dayclick:new A_cb(this, this.midnIn)}, { stmp:this.dataSet.midnIn, display:{abreviation:'full', weekday:true} } );
	
	
	let assignees = this.dataSet.assignees.bylogin.get(); // array like assignees[loginId] = o_dS_task_assignee
		if(this.dataSet.id<=0) { 
			assignees = preset.asslogins || []; // chat participants identified by their logins
			assignees[loginId] = true; // assigns the current login by default
		} 
		assignees 	= new C_iUSERS(this.eids.assignees, {}, {}, assignees); 
		
		this.assigned = this.dataSet.assignees.bylogin.get(loginId) || new C_dS_task_assignee(this.dataSet.bank,[0, this.dataSet.id, loginId]); // new task
		// this.assigned is the dS_task_assignee that links to the currently logged user
	const progrs 	= new C_iTDONE(this.eids.progrs, {}, { midnOut:this.assigned.midnOut } );
	const pattern	= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:class_task, csstype:ccsstype.pattern, value:this.assigned.cssPattern, enabled:true } /*preset*/ );
	
		const catalyst = new C_catalyst(C_dS_task_assignee.catalyst_taskmodal);
		catalyst.dS_task_id = this.dataSet.id;
	const overview = new C_iARRAY(this.eids.overview, catalyst, { onrow:false } ); 
	
		const tabscaptions = C_XL.w({0:'details', 1:'assignees', 2:'to archive', 3:'progress', 4:'audit'});
		tabscaptions[4] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions, {}, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, archive:archive, title:title, color:color, visiref:visiref, pattern:pattern, note:note, midnIn:midnIn, assignees:assignees, progrs:progrs, overview:overview } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:740, miny:'320px'}, moves:true, morecss:{ outlet:'M_TASK' } } );
	this.activate();
}
M_TASK.prototype = {  
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			const archivedyet = this.dataSet.assignees.bylogin.get(mobminder.context.loginId).midnOut;
			const mayarchive = (this.dataSet.id>0 && !(archivedyet));
		const archive = mayarchive ?'<td style="padding-right:1em; width=5%; vertical-align:top;">'+this.controls.archive.display()+'</td>':'';
		const title = '<td class="mheader"><h1 class="modal-task" id="'+this.eids.own.htitle+'">'+this.htitle()+'</h1></td>';
		const header = '<tr>'+archive+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table summary="header layout" style="width:100%">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-task')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// details tab
			const title = '<tr>'+this.controls.title.labelled('title', 'alpha24')+'</tr>';
			const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha10')+'</tr>':'';
				const visilabel = '<td style="vertical-align:top; line-height:1.7em;" class="label textcolor-light">'+C_XL.w('references')+'</td>';
			const visiref = '<tr>'+visilabel+'<td>'+this.controls.visiref.display()+'</td></tr>';
			const note = '<tr>'+this.controls.note.labelled('note','alpha32')+'</tr>';
			const midnIn = '<tr>'+this.controls.midnIn.labelled('task schedule','alpha24')+'</tr>';

			const identification = '<table summary="task details" class="coords">'+title+color+visiref+note+midnIn+'</table>';
		const tab0 = this.controls.tabs.container(0, identification);

		// assignees
			const assignees = '<td>'+this.controls.assignees.display()+'</td>';
			const divassignees = '<div><table class="staff-layout" summary="staff layout">'+assignees+'</table></div>';
		const tab1 = this.controls.tabs.container(1, divassignees);
		
		// archive
				const loginname = C_dS_loggable.getname(mobminder.context.loginId);
				const lname = '<h2 style="margin-bottom:1em;">'+C_XL.w('assignee')+': '+loginname+'</h2>';
				let pattern = '<tr>'+this.controls.pattern.labelled('status', 'alpha10')+'</tr>';
					pattern = this.controls.pattern.hasany()?'<table summary="progress" style="margin-bottom:1em;">'+pattern+'</table>':'';
				const progrs = this.controls.progrs.display();
			const progress = lname+pattern+progrs;
		const tab2 = this.controls.tabs.container(2, progress);
		if(this.dataSet.id <= 0) this.controls.tabs.hide(2, true);
		
		// progress
				const table = this.controls.overview.display();
			const overview = '<table summary="overview" style="margin-bottom:1em;">'+table+'</table>';
		const tab3 = this.controls.tabs.container(3, overview);
		if(this.dataSet.id <= 0) this.controls.tabs.hide(3, true);
		
		// tracking
		const tab4 = this.controls.tabs.container(4, this.dataSet.tracking());
				
		return tab0+tab1+tab2+tab3+tab4;
	},
	activate: function() {
		this.controls.activate('M_TASK');
		this.elements.collect(this.eids.own);
		this.deftitle(); // initializes placeholder and mandatoriness for the title controls
		
		this.oncolorselect(this.dataSet.cssColor);
		this.onpatternselect(this.assigned.cssPattern);
	},
	
	// private
	htitle: function() { // window header title
		// whatch out, this function is based on controls values, and hence is diffrent from C_dS_task_description::htitle()
		let htitle = '';
		let dstitle = this.controls.title.value();
		let names = C_dS_visitor.currentnames(this.controls.visiref.value());
		if(this.dataSet.id <= 0) htitle = C_XL.w('new task');
			else if(dstitle) htitle = dstitle;
				else if(names) htitle = names;
		htitle = C_XL.w('task')+': '+htitle;
		if(vbs) vlog('modals.js','M_TASK','htitle','names: '+names+', dS title:'+dstitle+', header: '+htitle);
		return htitle+symbol('task');
	},
	htitleset: function() { // re-set the header title
		this.elements.htitle.innerHTML = this.htitle();
	},
	deftitle: function(names) { // sets a default for the title and mandatory of the title controls
		if(names===undefined) names = C_dS_visitor.currentnames(this.controls.visiref.value());
		let ph = names||C_XL.w('alt mandatory');
		if(vbs) vlog('modals.js','M_TASK','deftitle','title by default: '+names+', placeholder: '+ph);
		this.controls.title.placeholder(ph);
		this.controls.title.mandatory(!names);
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:'id', title:'title', color:'cssColor', visiref:'visiref', pattern:'cssPattern', note:'description'
				, assignees:'assignees', midnIn:'midnIn', progrs:{ midnOut:'midnOut', f4all:'f4all' } };
		mobminder.app.post(this.controls, names, './post/task.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_task_description.del(this.dataSet.id);
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:'id'};
		mobminder.app.post(this.controls, names, './delete/task.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	archive: function() {
		this.controls.progrs.set({archive:true});
		this.save();
	},
	
	escape: function() { return true; },
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_TASK','staff','typechanged:'+typechanged);
	}, 
	midnIn: function() {},
	visiref: function(visitorId) { // selected visitor is clicked
		let dS_visitor = C_dS_visitor.get(visitorId);
		let easyVISI = new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved)}, { parent:this });
		return false; 
	},
	vselect: function(visitors) { // change in the list of referenced visitors
		let list = [], c = 0, id; for(id in visitors) { list.push(id); c++; }; list.join(',');
		if(vbs) vlog('modals.js','M_TASK','vselect', c+' visitors, ids:'+list);
		let names = C_dS_visitor.currentnames(visitors);
		this.deftitle(names);
		this.htitleset();
		return false; 
	},
	vadd: function(id) { // a new visitor was added
		if(vbs) vlog('modals.js','M_TASK','vadd','added visitor id:'+id);
		return false; 
	},
	vclear: function() { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_TASK','vclear','the list is cleared');
		this.deftitle('');
		this.htitleset();
		return false; 
	},
	tchange: function(digits) { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_TASK','tchange','title:'+digits);
		this.htitleset();
		return false; 
	},
	oncolorselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmborder(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_TASK', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmpattern(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 801, those are defined here (*mb01*)
			let cclass = dS_customCss.resaClass;
			let ctype = dS_customCss.cssType;
			let cname = dS_customCss.name;
		if(vbs) vlog('modals.js', 'M_TASK', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass+', name:'+cname);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dataset = inlineDataSets['C_dS_task_description'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		if(this.dataSet.id == 0) C_dS_task_description.del(0); // removes the virtual new task
		if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
		this.quit();
	},	
	removed: function() {
		C_dS_task_description.del(this.dataSet.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('modals.js','M_TASK','visitorsaved','id:'+id); 
		this.controls.visiref.refresh(id); 
	}
}


function M_NOTE(dataSet, callbacks, preset) {
		preset = preset || { visirefs:new Array() };
	this.dataSet = dataSet;
	this.callbacks = callbacks || {}; // like { saved:, removed: }
	const b = 'note'+'_L'+C_iMODAL.layer+'_'+this.dataSet.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons'
		, title:b+'title', color:b+'color', pattern:b+'patt', visiref:b+'vref', note:b+'note'
		, addressees:b+'addr', period:b+'period'
		, own:{ htitle:b+'htitle' } };
	this.elements = new A_el();
	
		const remove = (this.dataSet.id>0);
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:remove });

	const id			= new C_iPASS(this.dataSet.id);
		
		const visirefs = this.dataSet.id>0 ? this.dataSet.visirefs.byid.get() : preset.visirefs;
		const mandatitle = !this.dataSet.visirefs.byid.ends(); // a title must be specified if there is no referenced visitors
	const title 		= new C_iFIELD(this.eids.title, { onfchange:new A_cb(this, this.tchange) }, { digits:this.dataSet.title, type:INPUT_TEXT, mandatory:mandatitle, focus:true });
	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:class_note, csstype:ccsstype.color, value:this.dataSet.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:class_note, csstype:ccsstype.pattern, value:this.dataSet.cssPattern, enabled:true } /*preset*/ );
	const note 		= new C_iNOTE(this.eids.note, this.dataSet.note, {rows:12});
	const visiref 	= new C_iACPICK(this.eids.visiref, C_dS_visitor, { changed:new A_cb(this, this.vselect), added:new A_cb(this, this.vadd), cleared:new A_cb(this, this.vclear)},  { focus:false, placeholder:C_XL.w('visitors'), ids:visirefs, onlabelclick:new A_cb(this, this.visiref)} );

	let addrlogins = [];
		if(this.dataSet.id<=0) {
			addrlogins = preset.addrlogins || []; // chat participants identified by their logins
			addrlogins[mobminder.context.surfer.id] = true; // assigns the current login by default
		} else addrlogins = this.dataSet.addressees.bylogin.get(); // select previous setting for non new item
		
	const addressees 	= new C_iUSERS(this.eids.addressees, {}, {}, addrlogins );
	const period 		= new C_iPERIOD(this.eids.period, {}, { midnIn:this.dataSet.midnIn, midnOut:this.dataSet.midnOut } );
	
		const tabscaptions = C_XL.w({0:'details', 1:'addressees', 2:'visibility', 3:'audit'});
		tabscaptions[3] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions, {}, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, title:title, color:color, pattern:pattern, visiref:visiref, note:note, addressees:addressees, period:period } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:740, miny:'320px'}, moves:true, morecss:{ outlet:'M_NOTE' } } );
	this.activate();
}
M_NOTE.prototype = {  
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const title = '<td class="mheader"><h1 class="modal-note" id="'+this.eids.own.htitle+'">'+this.htitle()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table summary="header layout" style="width:100%">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-note')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// note details tab
				const title = '<tr>'+this.controls.title.labelled('title', 'alpha24')+'</tr>';
				const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha10')+'</tr>':'';
				const pattern = this.controls.pattern.hasany()?'<tr>'+this.controls.pattern.labelled('status', 'alpha10')+'</tr>':'';
					const visilabel = '<td style="vertical-align:top; line-height:1.7em;" class="label textcolor-light">'+C_XL.w('references')+'</td>';
				const visiref = '<tr>'+visilabel+'<td>'+this.controls.visiref.display()+'</td></tr>';	
				const note = '<tr>'+this.controls.note.labelled('note','alpha32')+'</tr>';

			const identification = '<table summary="note details" class="coords">'+title+color+pattern+visiref+note+'</table>';
		const tab0 = this.controls.tabs.container(0, identification);

		// addressees tab
			const addressees = '<tr><td>'+this.controls.addressees.display()+'</td></tr>';
			const divaddressees = '<div><table class="staff-layout" summary="staff layout">'+addressees+'</table></div>';
		const tab1 = this.controls.tabs.container(1, divaddressees);
		
		// visibility tab
			const period = this.controls.period.display();
		const tab2 = this.controls.tabs.container(2, period);
		
		// audit tab
		const tab3 = this.controls.tabs.container(3, this.dataSet.tracking());
				
		return tab0+tab1+tab2+tab3;
	},
	activate: function() {
		this.controls.activate('M_NOTE');
		this.elements.collect(this.eids.own);
		this.deftitle(); // initializes placeholder and mandatoriness for the title controls
		this.oncolorselect(this.dataSet.cssColor);
		this.onpatternselect(this.dataSet.cssPattern);
	},
	
	// private
	htitle: function() {
		// whatch out, this function is based on controls values, and hence is diffrent from C_dS_task_description::htitle()
		let htitle = '';
		let dstitle = this.controls.title.value();
		let names = C_dS_visitor.currentnames(this.controls.visiref.value());
		if(this.dataSet.id <= 0) htitle = C_XL.w('new note');
			else if(dstitle) htitle = dstitle;
				else if(names) htitle = names;
		htitle = C_XL.w('note')+': '+htitle;
		if(vbs) vlog('modals.js','M_NOTE','htitle','names: '+names+', dS title:'+dstitle+', header: '+htitle);
		return htitle+symbol('note');
	},
	htitleset: function() { // re-set the header title
		this.elements.htitle.innerHTML = this.htitle();
	},
	deftitle: function(names) { // sets a default for the title and mandatory of the title controls
		if(names===undefined) names = C_dS_visitor.currentnames(this.controls.visiref.value());
		let ph = names||C_XL.w('alt mandatory');
		if(vbs) vlog('modals.js','M_NOTE','deftitle','title by default: '+names+', placeholder: '+ph);
		this.controls.title.placeholder(ph);
		this.controls.title.mandatory(!names);
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:'id', title:'title', color:'cssColor', pattern:'cssPattern', visiref:'visiref', note:'note'
				, addressees:'addressees', period:{midnIn:'midnIn',midnOut:'midnOut'} };
		mobminder.app.post(this.controls, names, './post/note.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_note_detail.del(this.dataSet.id);
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:'id'};
		mobminder.app.post(this.controls, names, './delete/note.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_NOTE','staff','typechanged:'+typechanged);
	}, 
	visiref: function(visitorId) { // selected visitor is clicked
		let dS_visitor = C_dS_visitor.get(visitorId);
		let easyVISI = new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved)}, { parent:this });
		return false; 
	}, 
	vselect: function(visitors) { // change in the list of referenced visitors
		let list = [], c = 0, id; for(id in visitors) { list.push(id); c++; }; list.join(',');
		if(vbs) vlog('modals.js','M_NOTE','vselect', c+' visitors, ids:'+list);
		let names = C_dS_visitor.currentnames(visitors);
		this.deftitle(names);
		this.htitleset();
		return false; 
	},
	vadd: function(id) { // a new visitor was added
		if(vbs) vlog('modals.js','M_NOTE','vadd','added visitor id:'+id);
		return false; 
	},
	vclear: function() { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_NOTE','vclear','the list is cleared');
		this.deftitle('');
		this.htitleset();
		return false; 
	},
	tchange: function(digits) { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_NOTE','tchange','title:'+digits);
		this.htitleset();
		return false; 
	},
	oncolorselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmborder(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_NOTE', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmpattern(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 801, those are defined here (*mb01*)
			let cclass = dS_customCss.resaClass;
			let ctype = dS_customCss.cssType;
			let cname = dS_customCss.name;
		if(vbs) vlog('modals.js', 'M_NOTE', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass+', name:'+cname);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dataset = inlineDataSets['C_dS_note_detail'];
		for(let id in dataset) { dataset = dataset[id]; break; }
		if(this.callbacks.saved) this.callbacks.saved.cb(dataset);
		this.quit();
	},	
	removed: function() {
		C_dS_note_detail.del(this.dataSet.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		this.quit();
	},
	failed: function() { 
		this.modal.busy(false);
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('modals.js','M_NOTE','visitorsaved','id:'+id); 
		this.controls.visiref.refresh(id);
	}
}


function M_chat(dataSet, callbacks, preset) {
	this.dataSet = dataSet; // is a C_dS_chat_thread
	this.callbacks = callbacks || {}; // like { saved:, removed:, escaped:, seen: }
	this.state = M_chat.defaults.align(preset=(preset||{ visirefs:new Array() }));
	const b = 'chat'+'_L'+C_iMODAL.layer+'_'+this.dataSet.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons', chatquit:b+'quit', chatarch:b+'arch'
		, title:b+'title', color:b+'color', pattern:b+'patt', visiref:b+'vref', note:b+'note'
		, participants:b+'addr', chat:b+'chat'
		, own:{ htitle:b+'htitle' } };
	this.elements = new A_el();
	
		const mayremove = (this.dataSet.id>0) && (mobminder.context.surfer.accessLevel>=aLevel.supervisor) && (this.dataSet.deletorId==0);
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:mayremove });
	
	const chatquit 	= new C_iCLIK(this.eids.chatquit, { click:new A_cb(this, this.chatquit) }
		, { enabled:true, tip:C_XL.w('tip chatquit'), css:'modal-button fa fa-gray fa-sign-out fa-rotate-180 touch-red', tag:'div'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.x] });
	
		const enablechatarchive = !this.dataSet.archived && !this.dataSet.deletorId; // you may action that archive button only when still live chat
	const chatarch 	= new C_iCLIK(this.eids.chatarch, { click:new A_cb(this, this.chatarchive) }
		, { enabled:enablechatarchive, tip:C_XL.w('tip chat archive'), css:'modal-button fa fa-gray fa-archive touch-orange', tag:'div'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.shift+C_KEY.code.alpha.a] });
	
	const id	= new C_iPASS({id:this.dataSet.id, bank:this.dataSet.bank});
	
		const visirefs = this.dataSet.id>0 ? this.dataSet.visirefs.byid.get() : preset.visirefs;
		const mandatitle = !this.dataSet.visirefs.byid.ends(); // a title must be specified if there is no referenced visitors
	const title 		= new C_iFIELD(this.eids.title, { onfchange:new A_cb(this, this.tchange) }, { digits:this.dataSet.title, type:INPUT_TEXT, mandatory:mandatitle, focus:true });
	const color		= new C_iCSS(this.eids.color, { select:new A_cb(this, this.oncolorselect) }, { cssclass:class_chat, csstype:ccsstype.color, value:this.dataSet.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, { select:new A_cb(this, this.onpatternselect) }, { cssclass:class_chat, csstype:ccsstype.pattern, value:this.dataSet.cssPattern, enabled:true } /*preset*/ );
	const tags		= new C_iCSS(this.eids.tags, {}, { cssclass:class_chat, csstype:ccsstype.tag, value:this.dataSet.cssTags, enabled:true } /*preset*/ );

	const note 		= new C_iNOTE(this.eids.note, this.dataSet.note, {rows:12});
	const visiref 	= new C_iACPICK(this.eids.visiref, C_dS_visitor, { changed:new A_cb(this, this.vselect), added:new A_cb(this, this.vadd), cleared:new A_cb(this, this.vclear)}, { focus:false, placeholder:C_XL.w('visitors'), ids:visirefs, onlabelclick:new A_cb(this, this.visiref)} );
	
		const plogins = preset.plogins || []; // chat participants identified by their logins
		if(this.dataSet.id==0) {} // plogins = plogins[mobminder.context.surfer.id]=true;
			else { 
				const everbeen = this.dataSet.participants.bylogin.get(); 
				for(const pid in everbeen) if(!everbeen[pid].cueOut) plogins[pid] = true;
			}
	const participants = new C_iUSERS(this.eids.participants, {}, { maxrows:16 }, plogins );
	const chat 		 = new C_iCHAT(this.eids.chat, { seen:new A_cb(this, this.seen) }, { chat:this.dataSet } );
	
		const tabscaptions = C_XL.w({0:'summary', 1:'participants', 2:'conversation', 3:'audit'});
		tabscaptions[3] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs	= new C_iTABS(this.eids.tabs, tabscaptions, { ontab:new A_cb(this, this.ontab) }, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche, chatquit:chatquit, chatarch:chatarch, title:title, color:color, pattern:pattern, tags:tags, visiref:visiref, note:note, participants:participants, chat:chat } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:840, maxy:600 /* keep this height defined so the chat does scroll */}, moves:true, morecss:{ outlet:'M_chat' } } );
	this.activate();
}
M_chat.defaults = new A_df( { tab:2, visirefs:false, refreshparticipants:false, evacuated:false } ); // (*c03*)
M_chat.prototype = {  
	// private
	header: function() {

		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const chatquit = this.mayquit() ?'<td style="padding-right:1em; width:1%; vertical-align:top;">'+this.controls.chatquit.display()+'</td>':'';
			const title = '<td class="mheader"><h1 class="modal-chat" id="'+this.eids.own.htitle+'">'+this.htitle()+'</h1></td>';
			const header = '<tr>'+chatquit+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display('modal-chat')+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// note details tab
			const title = '<tr>'+this.controls.title.labelled('title', 'alpha24')+'</tr>';
			const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha10')+'</tr>':'';
			const pattern = this.controls.pattern.hasany()?'<tr>'+this.controls.pattern.labelled('status', 'alpha10')+'</tr>':'';
				const visilabel = '<td style="vertical-align:top; line-height:1.7em;" class="label textcolor-light">'+C_XL.w('references')+'</td>';
			const visiref = '<tr>'+visilabel+'<td>'+this.controls.visiref.display()+'</td></tr>';	
				const notelabel = this.dataSet.id==0 ? 'message':'note';
			const note = '<tr>'+this.controls.note.labelled(notelabel,'alpha32')+'</tr>';
			const tags = '<tr><td></td><td style="padding-top:1em;">'+this.controls.tags.display()+'</td></tr>';

			const identification = '<table summary="identification" class="coords">'+title+color+pattern+visiref+note+tags+'</table>';
		const tab0 = this.controls.tabs.container(0, identification);

		// participants tab
			const chatarchive = this.mayarchive() ?'<tr><td style="text-align:left; padding-left:10em;">'+this.controls.chatarch.display()+'</td></tr>':'';
			const participants = '<tr><td>'+this.controls.participants.display()+'</td></tr>';
			const divparticipants = '<div><table class="staff-layout" summary="staff layout">'+chatarchive+participants+'</table></div>';
		const tab1 = this.controls.tabs.container(1, divparticipants);
		
		// chat tab
			const chat = this.controls.chat.display();
		const tab2 = this.controls.tabs.container(2, chat /*, 'wide'*/);
		if(this.dataSet.id <=0 ) { this.controls.tabs.hide(2, true); }
		
		// audit tab
		const tab3 = this.controls.tabs.container(3, this.dataSet.tracking());
				
		// return chat;
		return '<div>'+tab0+tab1+tab2+tab3+'</div>'; // this div is the target of iScroll when running on touch devices
	},
	activate: function() {
		// this.elements.collect(this.eids);
		this.controls.activate('M_chat');
		this.elements.collect(this.eids.own);
		this.modal.mposition().mrefresh();
		this.deftitle(); // initializes placeholder and mandatoriness for the title controls
		this.ontab(this.state.tab);
		this.oncolorselect(this.dataSet.cssColor);
		this.onpatternselect(this.dataSet.cssPattern);
	},
	phyrefresh: function() { // called from C_iTHREADS::warning() when the server reports new phylacteries
		if(!this.state.evacuated)
			return this.controls.chat.fetchphylas();
	},
	partrefresh: function() { // (*c03*) called from C_iTHREADS::chitems() when the server reports a participants change
		if(this.dataSet) // see scenario (*c1.*)
			if(this.state.refreshparticipants) {
				let ps = this.dataSet.participants.bylogin.get(), v, onOff;
				for(let lid in ps) {
					let isin = !ps[lid].cueOut;
					this.controls.participants.check(lid,isin);
				}
				this.state.refreshparticipants = false;
			}
			return this;
	},
	evacuate: function() { // called from C_iTHREADS::warning() when the server reports indication that the current surfer has been excluded from the conversation
		this.state.evacuated = true;
		let msg = new C_iMSG(C_XL.w('chat ban evacuate'), {onChoice:new A_cb(this, this.evacuateok)}, {} );
	},
	rehook: function() {
		if(this.state.evacuated) return this;

		let cbank = this.dataSet.bank;
		this.dataSet = cmems[cbank].chats.get(this.dataSet.id); // refresh the dataSet pointer in this modal, absolutely needed after a chitems		
		if(this.dataSet)
			this.controls.chat.state.chat = this.dataSet; // hook to the newly received dS_thread, occurs when chitems was called while the chat modal is opened
		// this dataSet might be undefined, see scenario (*c1.*)
		if(vbs)
			if(this.dataSet) vlog('modals.js','M_chat', 'rehook', 'bank:'+this.dataSet.bank);		
			else vlog('modals.js','M_chat', 'rehook', 'we were excluded from this chat');
		return this;
	},
	
	// private
	htitle: function() {// window header title
		
		// whatch out, this function is based on controls values, and hence is diffrent from C_dS_task_description::htitle()
			const  xlo = { cap:true };
		let htitle = '';
		const dstitle = this.controls.title.value();
		let names = C_dS_visitor.currentnames(this.controls.visiref.value());

		if(this.dataSet.id <= 0) htitle = C_XL.w('new chat',xlo);
			else if(dstitle) htitle = dstitle;
				else if(names) htitle = names;
		// htitle = C_XL.w('chat',xlo)+': '+htitle;
		if(vbs) vlog('modals.js','M_chat','htitle','names: '+names+', dS title:'+dstitle+', header: '+htitle);
		let sym = symbol('chat'); if(this.dataSet.archived) sym = symbol('archbox'); if(this.dataSet.deletorId) sym = symbol('trash');
		return htitle+sym;
	},
	htitleset: function() { // re-set the header title
		this.elements.htitle.innerHTML = this.htitle();
	},
	deftitle: function(names) { // sets a default for the title and mandatory of the title controls
		if(names===undefined) names = C_dS_visitor.currentnames(this.controls.visiref.value());
		let ph = names||C_XL.w('alt mandatory');
		if(vbs) vlog('modals.js','M_chat','deftitle','title by default: '+names+', placeholder: '+ph);
		this.controls.title.placeholder(ph);
		this.controls.title.mandatory(!names);
	},
	mayquit: function() {
		
				let surferparticipates = this.dataSet.participants.bylogin.get(mobminder.context.loginId); // if not undefined, surferparticipates is a dS_chat_participant
				let novirtualchat = this.dataSet.id>0;
				let notquityet = surferparticipates?(!surferparticipates.cueOut):0;
			let mayquitchat = novirtualchat&&surferparticipates&&notquityet;
		return mayquitchat;
	},	
	mayarchive: function() {
				let participants = this.dataSet.participants.bylogin.get(); 
				let remaining = 0;
				for(let lid in participants) if(!participants[lid].cueOut) remaining++; // here we count participants who did not leave the conversation
				let novirtualchat = this.dataSet.id>0;
			let mayarchive = novirtualchat&&!!remaining;
		return mayarchive;
	},
	checkunsent: function(backtofunction) {
		// this function is called from any spot where you can quit the chat window (save, remove, quit, escape key, archive and chatquit)
		// backtofunction is provided by the caller and will be called after a choice was made by the user, wether to stay or quit anyway
		// when returning to the calling function, with a user choice to 'exit anyaway', we pass a 'force' parameter in such a way that the present check is not executed anymore
		let hasunsentmsg = this.controls.chat.state.launchpad;
		if(hasunsentmsg) {
			this.controls.tabs.set(2); 
				let interact = { 'quit':'quit anyway', 'stay':'chat stay' };
				let msg = C_XL.w('chat unsent msg on launch pad', { cap:1 } );
			new C_iMSG(msg, { onChoice:new A_cb(this, this.hasunsentmsg, backtofunction) }, { interactivity:interact, size:{x:'',y:''} } );
			return false; // not clear situation, the user forget some unsent bla in the write field. // return value will trigger modal close at .escape() caller side (*11)
		}
		else return true; // clear situation // return value will trigger modal close at .escape() caller side (*11)
	},
	
	// event handling
	hasunsentmsg: function(backtofunction, userchoice) { // feedback function of checkunsent that checks if you try to leave the window with unsent text on the phylactery write field
		switch(userchoice) {
			case 'quit': let cb = new A_cb(this,backtofunction); let force = 1; return cb.cb(force,force); // important to keep (force,force) because the callback of C_iCLICK returns this as first parameter. So for chatquit() and chatarchive(), we need to find the force parameter on position 2 !
			case 'stay': return false; // signal to stay and show the conversation screen (*12)
		}
	},
	save: function(force) { // save is a callback from the C_iDQS object
		if(!this.controls.validation()) return;
		if(!force) { let clear = this.checkunsent(this.save); if(!clear) return; }
		this.modal.busy(true);
		let names = { id:{id:'id', bank:'bank'}, title:'title', color:'cssColor', pattern:'cssPattern', tags:'cssTags', visiref:'visiref', note:'note', participants:'participants' };
		mobminder.app.post(this.controls, names, './post/chat.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_chat_thread.del(this.dataSet.id);
	},
	remove: function(force) { // remove is a callback from the C_iDQS object
		if(!force) { let clear = this.checkunsent(this.remove); if(!clear) return; }
		this.modal.busy(true);
		let names = { id:{id:'id', bank:'bank'} };
		mobminder.app.post(this.controls, names, './delete/chat.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_chat_thread.del(this.dataSet.id);
	},
	quit: function(force) { // quit is a callback from the C_iDQS object
		if(!force) { let clear = this.checkunsent(this.quit); if(!clear) return; }
		this.modal.close();
		if(this.callbacks.escaped) this.callbacks.escaped.cb();
		return; // (*11)
	},
	escape: function(force) { 
		
		// escape is a callback from the C_iMODAL object (the user did not use a button from the cartouche, he used Esc or clicked away from modal border)
		// this escape() function should never call this.modal.close(); because this will double de-indent the window frame on the screen (!!)
		// 
		if(force) { // callback from this.checkunsent(this.escape); when "force quit" was chosen by user
			this.modal.close();
			if(this.callbacks.escaped) this.callbacks.escaped.cb();
			return;
		}
		else { // first call to escape 
			let clear = this.checkunsent(this.escape);
			if(clear) { // no unsent messages remaining in the intervention field
				// this.modal.close(); // is performed by caller c_iMODAL
				if(this.callbacks.escaped) this.callbacks.escaped.cb();
				return true;
			}  else {
				// stay and show the conversation screen (*12)
				return false;
			}
		}
		
	},
	chatquit: function(oclick, force) {
		if(!force) { let clear = this.checkunsent(this.chatquit); if(!clear) return true; }
		this.modal.busy(true);
		let names = { id:{id:'id',bank:'bank'} };
		mobminder.app.post(this.controls, names, './post/chatquit.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_chat_thread.del(this.dataSet.id);
	},
	chatarchive: function(oclick, force) {
		if(!force) { let clear = this.checkunsent(this.chatarchive); if(!clear) return true; }
		this.modal.busy(true);
		let names = { id:{id:'id',bank:'bank'} };
		let participants = this.dataSet.participants.bylogin.get();
			let now = new Date(); now = now.getPHPstamp();
		for(let lid in participants) participants[lid].cueOut = now;
		mobminder.app.post(this.controls, names, './post/chatarchive.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
		if(this.dataSet.id>0) C_dS_chat_thread.del(this.dataSet.id);
	},
	oncolorselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmborder(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let ccode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_chat', 'oncolorselect', 'cssid:'+cssid+', ccode:'+ccode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmborder(ccode);
		return this;
	},
	onpatternselect: function(cssid) {
		
		if(cssid==0) // the default color was selected
			this.modal.setmpattern(0);
			
		dS_customCss = C_dS_customCss.get(cssid);
		let pcode = dS_customCss.css; // something like 110, those are defined here (*mb01*)
		let cclass = dS_customCss.resaClass;
		let ctype = dS_customCss.cssType;
		if(vbs) vlog('modals.js', 'M_chat', 'onpatternselect', 'cssid:'+cssid+', pcode:'+pcode+', ctype:'+ctype+', cclass:'+cclass);
		
		this.modal.setmpattern(pcode);
		return this;
	},
	
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_chat','staff','typechanged:'+typechanged);
	}, 
	visiref: function(visitorId) { // selected visitor is clicked
		let dS_visitor = C_dS_visitor.get(visitorId);
		let easyVISI = new M_VISI(dS_visitor, { saved:new A_cb(this, this.visitorsaved)}, { parent:this });
		return false;
	}, 
	vselect: function(visitors) { // change in the list of referenced visitors
		let list = [], c = 0, id; for(id in visitors) { list.push(id); c++; }; list.join(',');
		if(vbs) vlog('modals.js','M_chat','vselect', c+' visitors, ids:'+list);
		let names = C_dS_visitor.currentnames(visitors);
		this.deftitle(names);
		this.htitleset();
		return false; 
	},
	vadd: function(id) { // a new visitor was added
		if(vbs) vlog('modals.js','M_chat','vadd','added visitor id:'+id);
		return false; 
	},
	vclear: function() { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_chat','vclear','the list is cleared');
		this.deftitle('');
		this.htitleset();
		return false; 
	},
	tchange: function(digits) { // the list of visitors has been cleared
		if(vbs) vlog('modals.js','M_chat','tchange','title:'+digits);
		this.htitleset();
		return false; 
	},
	ontab: function(which) {
		if(vbs) vlog('modals.js','M_chat','ontab','which:'+which);
		this.state.tab = which;
		if(which==2) {
			this.modal.mrefresh();
			let el = this.controls.chat.focus();
			if(el) this.modal.scrollto(el, { axis:'y' });
		}
		return this;
	},
	seen: function(chatid, physseen) {
	
		if(vbs) vlog('modals.js','M_chat','seen','chatid:'+chatid+', physseen:'+physseen);
		this.modal.mrefresh();
			let el = this.controls.chat.focus(true);
		if(el) this.modal.scrollto(el, { axis:'y', duration:1000 }); // when consulting from archives, if the surfer is off the conversation then this.controls.chat.controls.interv is not displayed.
		
		if(this.callbacks.seen) this.callbacks.seen.cb(chatid, physseen);
	},
	evacuateok: function() {
		let force = 1; return this.quit(force);
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets, stream) {
		let dataset = inlineDataSets['C_dS_chat_thread'];
		let id; for(id in dataset) { dataset = dataset[id]; break; } // catch the dataSet received from the server
		let force = 1; 
		if(this.dataSet.id > 0) { // normal close and quit
			if(this.callbacks.saved) this.callbacks.saved.cb(dataset); 
			this.quit(force);
		}
		else { // freshly new wriggling chat: keep the modal open, assign new id and show the chat tab
			if(this.controls.note.getpost()) { 
				// the surfer who posted this new chat has written a note which became the first philactery. We can close the window.
				if(this.callbacks.saved) this.callbacks.saved.cb(dataset); 
				return this.quit(force);
			}
			this.controls.id.items.id = this.dataSet.id = id|0; // assign the new id to the virtual dataSet that had id = 0;
			this.rehook();
			this.modal.busy(false);
			this.controls.chat = new C_iCHAT(this.eids.chat, { seen:new A_cb(this, this.seen) }, { chat:dataset } );
			this.controls.tabs.hide(2, false).set(2).html(2,this.controls.chat.display());
			this.controls.chat.activate();
			this.htitleset();
		}
	},	
	removed: function() {
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dataSet);
		let force = 1; return this.quit(force);
	},
	failed: function() { 
		this.modal.busy(false);
	},
	visitorsaved: function(inlineDataSets) {
		let id; for(id in inlineDataSets['C_dS_visitor']) break;
		if(vbs) vlog('modals.js','M_chat','visitorsaved','id:'+id); 
		this.controls.visiref.refresh(id); 
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    
//

function M_GDLNS(o_dS_guidelines, callbacks, preset) {

	this.state = M_GDLNS.defauts.align(preset = preset || {});
	if(!o_dS_guidelines) this.dataSet = new C_dS_guidelines(); 
		else this.dataSet = o_dS_guidelines;
	this.callbacks = callbacks ||{}; // like { saved: , deleted: }
	const b = 'gdl_L'+C_iMODAL.layer+'_'+this.dataSet.id+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', buttons:b+'buttons'
		, name:b+'name', addr:b+'addr', zip:b+'zip', city:b+'city', country:b+'country'
		, lang:b+'lang', mobile:b+'mobile', phone:b+'phone', email:b+'email', regist:b+'regist'
		, directions:b+'dir'
		, newvisi:b+'nvisi', appguide:b+'app', reqguide:b+'req', neverdo:b+'nevr', tipstricks:b+'tips' };
	this.elements = new A_el();
	
		const allowremove = (!preset.consultonly) && (this.dataSet.id>0 && mobminder.context.surfer.accessLevel>=aLevel.supervisor);
		const allowsave = (!preset.consultonly) && (mobminder.context.surfer.accessLevel>=aLevel.operator);
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:allowremove, save:allowsave });
	const id		= new C_iPASS(this.dataSet.id);
		
	const name 		= new C_iFIELD(this.eids.name, false, { digits:this.dataSet.name, type:INPUT_TEXT, mandatory:true, focus:true });
	const mobile 	= new C_iFIELD(this.eids.mobile, false, { digits:this.dataSet.mobile, type:INPUT_MOBILE, mandatory:false });
	const lang		= new C_iSPEAK(this.eids.lang, {}, { value:this.dataSet.language } );

	const addr 		= new C_iFIELD(this.eids.addr, false, { digits:this.dataSet.address, type:INPUT_TEXT, mandatory:false });
	const zip 		= new C_iFIELD(this.eids.zip, false, { digits:this.dataSet.zipCode, type:INPUT_TEXT, mandatory:false });
	const city 		= new C_iFIELD(this.eids.city, false, { digits:this.dataSet.city, type:INPUT_TEXT, mandatory:false });
	const country	= new C_iFIELD(this.eids.country, false, { digits:this.dataSet.country, type:INPUT_TEXT, mandatory:false });
	const phone 	= new C_iFIELD(this.eids.phone, false, { digits:this.dataSet.phone, type:INPUT_PHONE, mandatory:false });
	const email 	= new C_iFIELD(this.eids.email, false, { digits:this.dataSet.email, type:INPUT_EMAIL, mandatory:false });
	const regist	= new C_iFIELD(this.eids.regist, false, { digits:this.dataSet.registration, type:INPUT_TEXT, mandatory:false });
	
	const directions = new C_iNOTE(this.eids.directions, this.dataSet.directions, {rows:8}); // how to get to this place
	
	const newvisi 	= new C_iNOTE(this.eids.newvisi, this.dataSet.newvisi, {rows:16} ); // new visitor guidelines
	const appguide 	= new C_iNOTE(this.eids.appguide, this.dataSet.appguide, {rows:16}); // appointments guidelines
	const reqguide 	= new C_iNOTE(this.eids.reqguide, this.dataSet.reqguide, {rows:16}); // requests guidelines
	const neverdo 	= new C_iNOTE(this.eids.neverdo, this.dataSet.neverdo, {rows:16}); // never do
	const tipstricks = new C_iNOTE(this.eids.tipstricks, this.dataSet.tipstricks, {rows:16}); // tips and tricks
	
		const tabscaptions = C_XL.w({0:'coordinates', 1:'new visitor', 2:'appointments', 3:'gdl requests', 4:'gdl never', 5:'gdl tips', 9:'audit'});
		tabscaptions[9] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol

	const tabs = new C_iTABS(this.eids.tabs, tabscaptions );

	this.controls = new A_ct( { id:id, tabs:tabs, cartouche:cartouche
		, name:name, addr:addr, zip:zip, city:city, country:country
		, lang:lang, mobile:mobile, phone:phone, email:email, regist:regist
		, directions:directions
		, newvisi:newvisi, appguide:appguide, reqguide:reqguide, neverdo:neverdo, tipstricks:tipstricks } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:900}, moves:true } );
	this.activate();
}
M_GDLNS.defauts = new A_df( { digits:'', parent:false } );
M_GDLNS.prototype = { 
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const title = '<td class="mheader"><h1 class="modal-guidelines">'+this.title()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table summary="header layout" style="width:100%;">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
			// coordinates left side
				const name = '<tr>'+this.controls.name.labelled('lastname')+'</tr>';
				const addr = '<tr>'+this.controls.addr.labelled('address')+'</tr>';
				const zip = '<tr>'+this.controls.zip.labelled('zipCode')+'</tr>';
				const city = '<tr>'+this.controls.city.labelled('city')+'</tr>';
				const country = '<tr>'+this.controls.country.labelled('country')+'</tr>';
			
			// coordinates right side
				const lang = this.controls.lang.labelled('language', 'alpha10');
				const mobile = '<tr>'+this.controls.mobile.labelled('mobile')+'</tr>';
				const phone = '<tr>'+this.controls.phone.labelled('phone')+'</tr>';
				const email = '<tr>'+this.controls.email.labelled('email')+'</tr>';
				const regist = '<tr>'+this.controls.regist.labelled('registration')+'</tr>';
				const pad = '<tr>'+'<td></td>'+'<td></td>'+'</tr>';
				
			// directions
			const directions = '<tr><td colspan=2>'+this.controls.directions.display('textcolor-light','alpha40','directions')+'</td></tr>';
			
			const coordsLeft = '<td style="vertical-align:top"><table>'+name+addr+zip+city+country+'</table></td>';
			const coordsRight = '<td style="vertical-align:top"><table>'+lang+mobile+phone+email+regist+'</table></td>';
			const coordsAll = '<tr>'+coordsLeft+coordsRight+'</tr>';
	
			const coords = '<table class="coords" style="text-align:left;">'+coordsAll+directions+'</table>';
		const tab0 = this.controls.tabs.container(0, coords);

			const newvisi = '<td>'+this.controls.newvisi.display('textcolor-light','alpha40','gdlns 4 new visitors')+'</td>';
			const tnewvisi = '<table class="coords" style="text-align:left;"><tr>'+newvisi+'</tr></table>';
		const tab1 = this.controls.tabs.container(1, tnewvisi);

			const appguide = '<td>'+this.controls.appguide.display('textcolor-light','alpha40','gdlns 4 appointment')+'</td>';
			const tappguide = '<table class="coords" style="text-align:left;"><tr>'+appguide+'</tr></table>';		
		const tab2 = this.controls.tabs.container(2, tappguide);

			const reqguide = '<td>'+this.controls.reqguide.display('textcolor-light','alpha40','gdlns 4 requests')+'</td>';
			const treqguide = '<table class="coords" style="text-align:left;"><tr>'+reqguide+'</tr></table>';		
		const tab3 = this.controls.tabs.container(3, treqguide);

			const neverdo = '<td>'+this.controls.neverdo.display('textcolor-light','alpha40','gdlns 4 dont')+'</td>';
			const tneverdo = '<table class="coords" style="text-align:left;"><tr>'+neverdo+'</tr></table>';		
		const tab4 = this.controls.tabs.container(4, tneverdo);

			const tipstricks = '<td>'+this.controls.tipstricks.display('textcolor-light','alpha40','gdlns 4 tips')+'</td>';
			const ttipstricks = '<table class="coords" style="text-align:left;"><tr>'+tipstricks+'</tr></table>';		
		const tab5 = this.controls.tabs.container(5, ttipstricks);

			const tracking = this.dataSet.tracking();
		const tab9 = this.controls.tabs.container(9, tracking);

		return tab0+tab1+tab2+tab3+tab4+tab5+tab9;
	},
	activate: function() {	this.elements.collect(this.eids); this.controls.activate('M_GDLNS'); return this;	},
	
	// private
	title: function() {
		if(this.dataSet.id <= 0) return C_XL.w('new guidelines');
		let title = C_XL.w('guidelines')+': '+this.dataSet.name;
		return title;
	},
	
	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true); // 
		let names = { id:'id', name:'name', mobile:'mobile', lang:'language'
				, addr:'address', zip:'zipCode', city:'city', country:'country', phone:'phone', email:'email', regist:'registration'
				, directions:'directions'
				, newvisi:'newvisi', appguide:'appguide', reqguide:'reqguide', neverdo:'neverdo', tipstricks:'tipstricks' };
		mobminder.app.post(this.controls, names, './post/guidelines.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() { 
		this.modal.busy(true);
		let names = {id:'id'};
		mobminder.app.post(this.controls, names, './delete/guidelines.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function(options) { options = options || {};
		this.modal.close(); 
		if(options.all) if(this.state.parent) this.state.parent.quit(options); 
	},
	escape: function() { return true; },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		if(this.callbacks.saved) this.callbacks.saved.cb(inlineDataSets);
		this.quit();
	},
	removed: function() {
		C_dS_guidelines.del(this.dataSet.id);
		if(this.callbacks.deleted) this.callbacks.deleted.cb(this.dataSet);
		this.quit();
	},

	failed: function() { 
		this.modal.busy(false);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    
//

function M_Conxion(dataSet, callbacks) { // gives figures about a given user's connection
	this.dS = dataSet;
	this.callbacks = callbacks || {}; // like { saved:, removed: }
	let b = 'cnx'+'_';
	this.eids = { id:b+'id', tabs:b+'tabs', tabs1:b+'tabs1', tabs2:b+'tabs2', buttons:b+'buttons'
		, title:b+'title', progrs:b+'progr'};
	this.elements = new A_el();
		
	let cartouche	= new C_iDQS(this.eids.buttons, { onquit:new A_cb(this, this.quit)}, { remove:false, save:false });
	
	let id		= new C_iPASS(this.dS.id);
	
	let tabs	= new C_iTABS(this.eids.tabs, C_XL.w({ 0:'profile', 1:'activity', 2:'access rights' }) );
	let tabs1	= new C_iTABS(this.eids.tabs1, C_XL.w({ 11:'cnx-queries', 12:'cnx-posts', 13:'cnx-deletes' }) );
	let tabs2	= new C_iTABS(this.eids.tabs2, C_XL.w({ 21:'access level', 22:'axs keys' }) );

	this.controls = new A_ct( { id:id, tabs:tabs, tabs1:tabs1, tabs2:tabs2, cartouche:cartouche } );
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:800}, moves:true } );
	this.activate();
}
M_Conxion.prototype = {  
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-connexion">'+this.title()+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div class="buttons"><table summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		// profile
				let trs = new Array();
				trs.push('<tr>'+this.labelled('surfer','cnx-surfer')+'</tr>');
				trs.push('<tr>'+this.labelled('account','cnx-account')+'</tr>');
				trs.push('<tr>'+this.labelled('logintime','cnx-logintime')+'</tr>');
				trs.push('<tr>'+this.labelled('ip','cnx-ip')+'</tr>');
				trs.push('<tr>'+this.labelled('activity','cnx-activity')+'</tr>');
				trs.push('<tr>'+this.labelled('watchdog','cnx-watchdog')+'</tr>');
				trs.push('<tr>'+this.labelled('reloads','cnx-reloads')+'</tr>');
				trs.push('<tr>'+this.labelled('switchTos','cnx-switchtos')+'</tr>');
				trs.push('<tr>'+this.labelled('agent','cnx-agent')+'</tr>');
				trs.push('<tr>'+this.labelled('sessionId','cnx-sessionId')+'</tr>');
			let profile = '<table summary="profile">'+trs.join('')+'</table>';
		let tab0 = this.controls.tabs.container(0, profile);

		// actions
					trs = new Array();
						let unitnone = '<td></td>';
						let unitms = '<td class="unit">ms</td>';
					let cnt_head 	= '<th colspan=2>'+C_XL.w('cnx-allqueries')+'</th>'+'<th colspan=2>'+C_XL.w('cnx-allposts')+'</th>'+'<th colspan=2>'+C_XL.w('cnx-alldeletes')+'</th>';
					let cnt_all 	= '<td>'+this.dS.cnt_q_all+'</td>'+unitnone	+'<td>'+this.dS.cnt_p_all+'</td>'+unitnone+'<td>'	+this.dS.cnt_d_all+'</td>'+unitnone;
					let perf_acc 	= '<td>'+this.dS.perf_q_acc+'</td>'+unitms	+'<td>'+this.dS.perf_p_acc+'</td>'+unitms+'<td>'	+this.dS.perf_d_acc+'</td>'+unitms;
					let perf_mean	= '<td>'+this.dS.perf_q_mean+'</td>'+unitms	+'<td>'+this.dS.perf_p_mean+'</td>'+unitms+'<td>'	+this.dS.perf_d_mean+'</td>'+unitms;
					let perf_pk 	= '<td>'+this.dS.perf_q_pk+'</td>'+unitms	+'<td>'+this.dS.perf_p_pk+'</td>'+unitms+'<td>'		+this.dS.perf_d_pk+'</td>'+unitms;
				trs.push('<tr>'+'<th></th>'+cnt_head+'</tr>');
				trs.push('<tr>'+'<th>'+C_XL.w('cnx-cntall')+'</th>'+cnt_all+'</tr>');
				trs.push('<tr>'+'<th>'+C_XL.w('cnx-perfacc')+'</th>'+perf_acc+'</tr>');
				trs.push('<tr>'+'<th>'+C_XL.w('cnx-perfmean')+'</th>'+perf_mean+'</tr>');
				trs.push('<tr>'+'<th>'+C_XL.w('cnx-perfpk')+'</th>'+perf_pk+'</tr>');
			let sumcnt = '<table summary="summary of counters" class="cnx-sumcnt">'+trs.join('')+'</table>';
			let tabs1x = '<div style="text-align:center;">'+this.controls.tabs1.display()+'</div>';
			let cont1x = this.actions();
		let tab1 = this.controls.tabs.container(1, sumcnt+tabs1x+cont1x);
		
		// access rights
			let tabs2x = '<div style="text-align:center;">'+this.controls.tabs2.display()+'</div>';
			let cont2x = this.accrights();
		let tab2 = this.controls.tabs.container(2, tabs2x+cont2x);
		
		// deletes
			// let deletes = '<table summary="deletes">'+'TBD'+'</table>';
		// let tab3 = this.controls.tabs.container(2, deletes);
				
		return tab0+tab1+tab2;
	},
	actions: function() {
		let unitnone = '<td></td>';
		let unitms = '<td class="unit">ms</td>';
		let that = this;
		let peekrow = function(action, item) {
			let cnt = '<td>'+that.dS['cnt_'+action+'_'+item]+'</td>'+unitnone;
			let pk = '<td>'+that.dS['perf_'+action+'_'+item+'_pk']+'</td>'+unitms;
			let th = '<th style="text-align:left;">'+item+'</th>';
			return '<tr>'+cnt+th+pk+'</tr>';
		}
		let peekrows = function(action, items) {
			let trs = new Array();
			for(let x in items) { let i = items[x]; trs.push(peekrow(action,i)) }
				let operations = '<th colspan=2 style="max-width:10em;">'+C_XL.w('cnx-operations')+'</th>';
				let peak = '<th colspan=2 style="max-width:10em;">'+C_XL.w('cnx-perfpk')+'</th>';
				let empty = '<th></th>';
			trs.unshift('<tr>'+operations+empty+peak+'</tr>');
			return '<table summary="queries" class="cnx-sumcnt">'+trs.join('')+'</table>';
		}
		
			let queries = peekrows('q',['config','plitems','search','visitors','remote','visiapps','swap','alphatab','stats','orphans','login','gender','emerg']);
		let t11 = this.controls.tabs1.container(11, queries);
		
			let posts = peekrows('p',['config','visitor','resa','rsc','schedule','shadow','task','note','chat','newacc','login','huser','tboxing','hourly','gdlns','smst','emlt','details','ccss','account','wrkc']);
		let t12 = this.controls.tabs1.container(12, posts);
		
			let deletes = peekrows('d',['account','resa','rsc','shadow','task','note','chat','login','huser','tboxing','gdlns','smst','emlt','ccss','account','wrkc']);
		let t13 = this.controls.tabs1.container(13, deletes);
		
		return t11+t12+t13;
	},
	accrights: function() {
	
			let acclevel = '<table summary="queries">'+'TBD'+'</table>';
		let t21 = this.controls.tabs2.container(21, acclevel);
		
			let acckeys = '<table summary="queries">'+'TBD'+'</table>';
		let t22 = this.controls.tabs2.container(22, acckeys);
		
		return t21+t22;
	},
	activate: function() {
		this.controls.activate('M_Conxion');
	},
	
	// private
	title: function() {
		let title = C_XL.w('connection')+': '+this.dS.surfer;
		return title;
	},
	labelled: function(member, english) {
			let label = '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td>';
			let value = '<td>'+this.dS.uivalue(member)+'</td>';
		return label+value;
	},
	
	// event handling
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	
	// ajax callback event handlers
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//    
//

function M_logo(dS, callbacks, preset) { // expects a C_dS_logo instance
	preset = preset || {};
	this.dS = dS;
	if(vbs) vlog('modals.js','M_logo','constructor','C_dS_logo id='+this.dS.id);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'logo_L'+C_iMODAL.layer+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', note:b+'note', file:b+'file' };
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:(this.dS.id>0) } );

	const id			= new C_iPASS({id:this.dS.id, loginId:this.dS.loginId });
	const note 		= new C_iNOTE(this.eids.note, this.dS.note, {rows:2} ); 
	const file 		= new C_iFILE(this.eids.file, this.dS, { uploading:new A_cb(this, this.uploading), uploaded:new A_cb(this, this.uploaded) }, { key:mobminder.context.keyId,  baseline:mobminder.app.baseline, fileclass:'C_dS_logo' } ); 
	
		const tabscaptions = C_XL.w({ 0:'description', 1:'audit' });
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, note:note, file:file } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:600}, moves:true } );
	this.activate();
}
M_logo.prototype = {
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const title = '<td class="mheader"><h1 class="modal-logo">'+this.title()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		// coordinates left side
			const note = '<tr>'+this.controls.note.labelled('note', 'ta24')+'</tr>';
			const file = '<tr>'+this.controls.file.labelled('file')+'</tr>';

		const layout = '<table summary="file modal" style="margin:0 auto">'+note+file+'</table>';
		const tab0 = this.controls.tabs.container(0, layout);	
		
		const tab1 = this.controls.tabs.container(1, 'Future tracking comes here.'); // tracking if ever needed
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_logo');
		if(this.dS.id <=0) this.controls.cartouche.hide('save', true);
	},
	
	// private
	title: function() {
		let title = C_XL.w('e-logo');
		if(this.dS.id <= 0) title += ': '+C_XL.w('new');
		
		let subt = 'global logo'; if(this.dS.loginId) subt = 'specific logo';
		subt = '<br/><span style="color:grey; font-size:smaller; padding-right:3em;">'+C_XL.w(subt)+'</span>';
		
			let fxt = this.dS.fextension()||'file';
		return title+symbol(fxt,'fa-13x','padding:0 .2em 0 .7em;')+subt;
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{ id:'id', loginId:'loginId' }, note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/logodesc.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id', loginId:'loginId' } };
		mobminder.app.post(this.controls, names, './delete/logodesc.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { 
		this.cancel().modal.close(); 
	},
	escape: function() { 
		this.cancel(); 
		return true; 
	},
	cancel: function() { // call the server with a cancel signal
		this.controls.id.poke('id',-99999301270);	// see (*ld01*) // the server side will clean up a possibly uploaded file, that the users wishes to cancel keeping
		let names = { id:{ id:'id', loginId:'loginId' }, note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/logodesc.php', false /*no feedback required*/, new A_cb(this,this.failed));
		return this;
	},
	
	fpreupload: function(fname) { 
		if(vbs) vlog('modals.js','M_logo','pre-uploading','filename:'+fname);
	},
	uploading: function(name) { 
		if(vbs) vlog('modals.js','M_logo','uploading','');
		this.controls.cartouche.enable(false); // no interactivity possible while uploading
	},
	uploaded: function(name, error) {
		if(vbs) vlog('modals.js','M_logo','uploaded','error:'+error);
		this.controls.cartouche.enable(true);
		if(!error) {
			// if(!this.controls.name.digits()) this.controls.name.set(name); 
			this.controls.cartouche.hide('save', false);
		} else {
			// the C_iFILE control displays a msg and re-initializes by itself
		}
	},
	onpicker: function() { return true; },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dSs = inlineDataSets['C_dS_logo'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; };
		if(vbs) vlog('modals.js','M_logo','saved','id='+dS.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.modal.close(); 
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_logo','removed','id='+this.dS.id+', fname:'+this.dS.filename);
		this.controls.file.reset(); // resets the dom element 
		C_dS_logo.del(this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.modal.close(); 
	},
	failed: function() {
		this.modal.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    F I L E S
//

function M_file(dS, callbacks, preset) { // expects a C_dS_file instance
	preset = preset || {};
	this.dS = dS;
	
	if(vbs) vlog('modals.js','M_file','constructor','id='+this.dS.id);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'file_L'+C_iMODAL.layer+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', name:b+'name', color:b+'color', pattern:b+'pattern', note:b+'note', file:b+'file' };
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:(this.dS.id>0) } );

	const id		= new C_iPASS({id:this.dS.id, visitorId:this.dS.visitorId, fileclass:'C_dS_visitor' });
	const name 		= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
	const color		= new C_iCSS(this.eids.color, {}, { cssclass:class_file, csstype:ccsstype.color, value:this.dS.cssColor, enabled:true } /*preset*/ );
	const pattern	= new C_iCSS(this.eids.pattern, {}, { cssclass:class_file, csstype:ccsstype.pattern, value:this.dS.cssPattern, enabled:true } /*preset*/ );
	const note 		= new C_iNOTE(this.eids.note, this.dS.note, {rows:5} ); 
	const file 		= new C_iFILE(this.eids.file, this.dS, { uploading:new A_cb(this, this.uploading), uploaded:new A_cb(this, this.uploaded) }, { key:mobminder.context.keyId,  baseline:mobminder.app.baseline, fileclass:'C_dS_visitor' } ); 
	
		const tabscaptions = C_XL.w({ 0:'description', 1:'audit' });
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, name:name, color:color, pattern:pattern, note:note, file:file } );
	
		const visiblemode = !preset.command; // visible if there is no command
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:700}, moves:true, invisible:!visiblemode } );
	this.activate();
	if(preset.command) {
		switch(preset.command) {
			case 'download': this.controls.file.download(); break;
		}
	}
}
M_file.prototype = {
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const title = '<td class="mheader"><h1 class="modal-file">'+this.title()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		// coordinates left side
		const name = '<tr>'+this.controls.name.labelled('name','alpha32')+'</tr>';
		const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha14')+'</tr>':'';
		const pattern = this.controls.pattern.hasany()?'<tr>'+this.controls.pattern.labelled('status', 'alpha14')+'</tr>':'';
		const note = '<tr>'+this.controls.note.labelled('note', 'ta32')+'</tr>';
		
			const isnew = this.dS.id <= 0;
			const label = isnew?'pick up a file':'retrieve the file';
 		const file = '<tr>'+this.controls.file.labelled(label)+'</tr>';
		
		const layout = '<table summary="file modal" style="margin:0 auto" class="coords">'+name+color+pattern+note+file+'</table>';
		const tab0 = this.controls.tabs.container(0, layout);	
		
		const tab1 = this.controls.tabs.container(1, this.dS.tracking());
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_file');
		if(this.dS.id <=0) this.controls.cartouche.hide('save', true);
	},
	
	// private
	title: function() {
		let title = C_XL.w('document');
		if(this.dS.id <= 0) title += ': '+C_XL.w('new');
			else title = this.dS.name;
		
		let fxt = this.dS.fextension()||'file';
		return title+symbol(fxt,'fa-13x','padding:0 .2em 0 .7em;');
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{ id:'id', visitorId:'visitorId' }, name:'name', color:'cssColor', pattern:'cssPattern', note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/filedesc.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id', visitorId:'visitorId', fileclass:'c' } };
		mobminder.app.post(this.controls, names, './delete/filedesc.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { 
		this.cancel().modal.close();
	},
	escape: function() {
		this.cancel();  
		return true;
	},
	cancel: function() { // call the server with a cancel signal
		this.controls.id.poke('id',-99999301270);  // see (*ld02*) // the server side will clean up a possibly uploaded file, that the users wishes to cancel keeping
		let names = { id:{ id:'id', visitorId:'visitorId' }, name:'name', color:'cssColor', pattern:'cssPattern', note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/filedesc.php', false /*no feedback required*/, new A_cb(this,this.failed));
		return this;
	},
	
	fpreupload: function(fname) { 
		if(vbs) vlog('modals.js','M_file','pre-uploading','filename:'+fname);
	},
	uploading: function(name) { 
		if(vbs) vlog('modals.js','M_file','uploading','');
		this.controls.cartouche.enable(false); // no interactivity possible while uploading
	},
	uploaded: function(name, error) {
		if(vbs) vlog('modals.js','M_file','uploaded','error:'+error);
		this.controls.cartouche.enable(true);
		if(!error) {
			if(!this.controls.name.digits()) this.controls.name.set(name); 
			this.controls.cartouche.hide('save', false);
		} else {
			// the C_iFILE control displays a msg and re-initializes by itself
		}
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dSs = inlineDataSets['C_dS_file'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; };
		if(vbs) vlog('modals.js','M_file','saved','id='+dS.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.modal.close();
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_file','removed','id='+this.dS.id+'visitorid='+this.dS.visitorId+', fname:'+this.dS.filename);
		this.controls.file.reset(); // resets the dom element 
		C_dS_file.del(this.dS.visitorId, this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.modal.close();
	},
	failed: function() {
		this.modal.busy(false);
	}
}




function M_resafile(dS, callbacks, preset) { // expects a C_dS_resafile instance
	preset = preset || {};
	this.dS = dS;
	
	if(vbs) vlog('modals.js','M_resafile','constructor','id='+this.dS.id);
	
	this.callbacks = callbacks || {}; // { saved:o_callback };
	const b = 'rfile_L'+C_iMODAL.layer+'_'+this.dS.id+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', name:b+'name', color:b+'color', pattern:b+'pattern', note:b+'note', file:b+'file' };
	this.elements = new A_el();
	
	const cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), ondelete:new A_cb(this, this.remove), onquit:new A_cb(this, this.quit)}, { remove:(this.dS.id>0) } );

	const id			= new C_iPASS({id:this.dS.id, reservationId:this.dS.reservationId, fileclass:'C_dS_reservation' });
	const name 		= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
	const color		= new C_iCSS(this.eids.color, {}, { cssclass:class_file, csstype:ccsstype.color, value:this.dS.cssColor, enabled:true } /*preset*/ );
	const pattern		= new C_iCSS(this.eids.pattern, {}, { cssclass:class_file, csstype:ccsstype.pattern, value:this.dS.cssPattern, enabled:true } /*preset*/ );
	const note 		= new C_iNOTE(this.eids.note, this.dS.note, {rows:4} ); 
	const file 		= new C_iFILE(this.eids.file, this.dS, { uploading:new A_cb(this, this.uploading), uploaded:new A_cb(this, this.uploaded) }, { key:mobminder.context.keyId,  baseline:mobminder.app.baseline, fileclass:'C_dS_reservation' } ); 
	
		const tabscaptions = C_XL.w({ 0:'description', 1:'audit' });
		tabscaptions[1] = '<div class="audit fa fa-gray fa-analytics">'+'</div>'; // some tracking looking symbol
	
	const tabs		= new C_iTABS(this.eids.tabs, tabscaptions, false, {current:preset.tab||0} );

	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, name:name, color:color, pattern:pattern, note:note, file:file } );
	
		const visiblemode = !preset.command; // visible if there is no command
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:700}, moves:true, invisible:!visiblemode } );
	this.activate();
	if(preset.command) {
		switch(preset.command) {
			case 'download': this.controls.file.download(); break;
		}
	}
}
M_resafile.prototype = {
	// private
	header: function() {
		const buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		const title = '<td class="mheader"><h1 class="modal-file">'+this.title()+'</h1></td>';
		const header = '<tr>'+buttons+title+'</tr>';
		const divHeader = '<div class="buttons"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		const divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
		// coordinates left side
		const name = '<tr>'+this.controls.name.labelled('name','alpha32')+'</tr>';
		const color = this.controls.color.hasany()?'<tr>'+this.controls.color.labelled('color', 'alpha14')+'</tr>':'';
		const pattern = this.controls.pattern.hasany()?'<tr>'+this.controls.pattern.labelled('status', 'alpha14')+'</tr>':'';
		const note = '<tr>'+this.controls.note.labelled('note', 'ta32')+'</tr>';
		
			const isnew = this.dS.id <= 0;
			const label = isnew?'pick up a file':'retrieve the file';
 		const file = '<tr>'+this.controls.file.labelled(label)+'</tr>';
		
		const layout = '<table summary="file modal" style="margin:0 auto" class="coords">'+name+color+pattern+note+file+'</table>';
		const tab0 = this.controls.tabs.container(0, layout);	
		
		const tab1 = this.controls.tabs.container(1, this.dS.tracking());
		
		return tab0+tab1;
	},
	activate: function() {
		this.controls.activate('M_resafile');
		if(this.dS.id <=0) this.controls.cartouche.hide('save', true);
	},
	
	// private
	title: function() {
		let title = C_XL.w('document');
		if(this.dS.id <= 0) title += ': '+C_XL.w('new');
			else title = this.dS.name;
		
		let fxt = this.dS.fextension()||'file';
		return title+symbol(fxt,'fa-13x','padding:0 .2em 0 .7em;');
	},

	// event handling
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { id:{ id:'id', reservationId:'reservationId' }, name:'name', color:'cssColor', pattern:'cssPattern', note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/resafiledesc.php', new A_cb(this,this.saved), new A_cb(this,this.failed));
	},
	remove: function() {
		this.modal.busy(true);
		let names = { id:{ id:'id', reservationId:'reservationId', fileclass:'c' } };
		mobminder.app.post(this.controls, names, './delete/resafiledesc.php', new A_cb(this,this.removed), new A_cb(this,this.failed));
	},
	quit: function() { 
		this.cancel().modal.close();
	},
	escape: function() {
		this.cancel();  
		return true;
	},
	cancel: function() { // call the server with a cancel signal
		this.controls.id.poke('id',-99999301270);  // see (*ld02*) // the server side will clean up a possibly uploaded file, that the users wishes to cancel keeping
		let names = { id:{ id:'id', reservationId:'reservationId' }, name:'name', color:'cssColor', pattern:'cssPattern', note:'note', file:'filename' };
		mobminder.app.post(this.controls, names, './post/resafiledesc.php', false /*no feedback required*/, new A_cb(this,this.failed));
		return this;
	},
	
	fpreupload: function(fname) { 
		if(vbs) vlog('modals.js','M_resafile','pre-uploading','filename:'+fname);
	},
	uploading: function(name) { 
		if(vbs) vlog('modals.js','M_resafile','uploading','');
		this.controls.cartouche.enable(false); // no interactivity possible while uploading
	},
	uploaded: function(name, error) {
		if(vbs) vlog('modals.js','M_resafile','uploaded','error:'+error);
		this.controls.cartouche.enable(true);
		if(!error) {
			if(!this.controls.name.digits()) this.controls.name.set(name); 
			this.controls.cartouche.hide('save', false);
		} else {
			// the C_iFILE control displays a msg and re-initializes by itself
		}
	},
	
	// ajax callback event handlers
	saved: function(inlineDataSets) {
		let dSs = inlineDataSets['C_dS_file'];
		let dS; for(let id in dSs) { dS = dSs[id]; break; };
		if(vbs) vlog('modals.js','M_resafile','saved','id='+dS.id);
		if(this.callbacks.saved) this.callbacks.saved.cb(dS);
		this.modal.close();
	},
	removed: function() {
		if(vbs) vlog('modals.js','M_resafile','removed','id='+this.dS.id+'visitorid='+this.dS.visitorId+', fname:'+this.dS.filename);
		this.controls.file.reset(); // resets the dom element 
		C_dS_resafile.del(this.dS.reservationId, this.dS.id);
		if(this.callbacks.removed) this.callbacks.removed.cb(this.dS);
		this.modal.close();
	},
	failed: function() {
		this.modal.busy(false);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    
//

function M_duplacc(dataSet, callbacks, preset) { // Account dupplication options modal. The mobminder account manager can select here some copy options.
	preset = preset || {};
	this.dS = dataSet;
if(vbs) vlog('modals.js','M_duplacc','constructor','id='+this.dS.id);
	
	this.callbacks = callbacks || {}; // { saved:A_cb };
	let b = 'ccss'+'_';
	this.eids = { id:b+'id', buttons:b+'buttons', tabs:b+'tabs' , name:b+'name', inclusive:b+'incl', reserv:b+'reserv'
				, color:b+'clr', pattern:b+'ptrn', note:b+'note', acckeys4:b+'ak4', rscmove:b+'move', visicopymode:b+'vcm', resascopymode:b+'rcm', targetmode:b+'tgm'
				, targacc:b+'acg'
				, own:{ resascopymode:b+'rss', visicopymode:b+'pss', newaccdata:b+'nad', targetacc:b+'tacc', } };
	this.elements = new A_el();
	
	// tab 0 - re-define account name, color and pattern
	let cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false } );

		let labels = C_XL.w({0:'make a new account', 1:'target an existing account'});
		let presets = { 0:true };
	let targetmode  = new C_iCRESTA(this.eids.targetmode, { onchange:new A_cb(this,this.targmodechange) }, { labels:labels, presets:presets }, { skin:0, mode:-1, title:C_XL.w('accopy target mode') } );


	let id			= new C_iPASS({id:this.dS.id, dup:1 });
	let name 		= new C_iFIELD(this.eids.name, false, { digits:this.dS.name, type:INPUT_TEXT, mandatory:true, focus:true, placeholder:C_XL.w('choose name') }); 
		let color		= new C_iSKIN(this.eids.color, {} /*callbacks*/, { type:ccsstype.color, value:this.dS.color, allownone:false } /*preset*/ );
	let pattern		= new C_iSKIN(this.eids.pattern, {} /*callbacks*/, { type:ccsstype.pattern, value:this.dS.pattern, allownone:true } /*preset*/ );
	let note 		= new C_iNOTE(this.eids.note, this.dS.note, { rows:8 } ); 

	let targacc = new C_iAC(this.eids.targacc, C_dS_group, { acselect:new A_cb(this, this.targacc), acclear:new A_cb(this, this.targaccclear) }, { placeholder:'target account' } );

	
	// tab 1 - choose data sets classes to be copied
		labels = C_XL.w({colors:'colors&status', communications:'comms', agendas:'agendas', hourlies:'hourlies', timeboxing:'timeboxing', workcodes:'workcodes', visitors:'visitors', reservations:'reservations', guidelines:'guidelines'});
		presets = { colors:true, communications:true, agendas:false, hourlies:false, timeboxing:false, workcodes:false, visitors:false, reservations:false };
	let inclusive  = new C_iCRESTA(this.eids.inclusive, { onchange:new A_cb(this,this.incluchanged) }, { labels:labels, presets:presets }, { skin:1, mode:0, title:C_XL.w('inclusive') } );
		
		labels = C_XL.w({0:'copy all visitors', 1:'copy appointed visitors'});
		presets = { 0:true };
	let visicopymode  = new C_iCRESTA(this.eids.visicopymode, { onchange:false }, { labels:labels, presets:presets }, { skin:0, mode:-1, title:C_XL.w('visitors copy mode') } );


		labels = C_XL.w({0:'copy resa current', 1:'include archived resas'});
		presets = { 0:true };
	let resascopymode  = new C_iCRESTA(this.eids.resascopymode, { onchange:false }, { labels:labels, presets:presets }, { skin:0, mode:-1, title:C_XL.w('reservations copy mode') } );


	
	// tab 2 - choose account resources to be copied / moved
		labels = C_XL.w({0:'copy rscs to new acc', 1:'move rscs to new acc'});
		presets = { 0:true };
	let rscmove  = new C_iCRESTA(this.eids.rscmove, { onchange:new A_cb(this,this.rscmove) }, { labels:labels, presets:presets }, { skin:0, mode:-1, title:C_XL.w('rscs copy mode') } );
	
		let precheck = true; // true will check everything
	let staff 	= new C_iSTAFF(this.eids.experts, 'atleast' /*mode*/, new A_cb(this,this.staff), precheck, {postmode:'merged', validation:'none' });
	
	
	// tab 6 - access allocation

			let accesspreset = new Array(); accesspreset[mobminder.context.loginId] = true; // assigns the current login by default
	let acckeys4 	= new C_iUSERS(this.eids.acckeys4, {}, {}, accesspreset); 
		acckeys4.lock(mobminder.context.loginId, true); // disallow current login from having no access to the copy
	
	let tabs		= new C_iTABS(this.eids.tabs, C_XL.w({ 0:'definition', 1:'inclusive', 2:'resources', 6:'access keys' }), false, {current:preset.tab||0} );
	
	this.controls = new A_ct( { id:id, cartouche:cartouche, tabs:tabs, name:name, inclusive:inclusive, staff:staff, color:color, pattern:pattern, note:note
								, acckeys4:acckeys4, rscmove:rscmove, resascopymode:resascopymode, visicopymode:visicopymode, targetmode:targetmode, targacc:targacc } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:680}, moves:true } );
	this.activate();
}
M_duplacc.prototype = { 
	// private
	header: function() {
		let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
		let title = '<td class="mheader"><h1 class="modal-duplicate">'+C_XL.w('duplicate account')+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div class="buttons air"><table style="width:100%;" summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
			// target mode choice
			let targetmode = '<div style="margin:2em;">'+this.controls.targetmode.display()+'</div>';

			// new acc mode : data
			let name = '<tr>'+this.controls.name.labelled('name','alpha16')+'</tr>';
			let color = '<tr>'+this.controls.color.labelled('color', 'alpha12')+'</tr>';
			let pattern = '<tr>'+this.controls.pattern.labelled('pattern', 'alpha12')+'</tr>';
			let note = '<tr>'+this.controls.note.labelled('note', 'ta32')+'</tr>';
			let definition = '<table id="'+this.eids.own.newaccdata+'" summary="duplicate definition" style="margin:2 auto">'+name+color+pattern+note+'</table>';
			
			// target account mode, choose account
				let targacc = this.controls.targacc.labelled('account','alpha32 warning bold');
			let rowtacc = '<tr style="vertical-align:top;">'+targacc+'<tr>';
			let target = '<table id="'+this.eids.own.targetacc+'" summary="duplicate definition" style="margin:2 auto; display:none;">'+rowtacc+'</table>';
		
		let tab0 = this.controls.tabs.container(0, targetmode+definition+target);
		
			// account attributes (visitors, reservations, communications, etc...)
			let include = '<td>'+this.controls.inclusive.display()+'</td>';
			let options = '<table summary="duplicate options" style="margin:0 auto">'+include+'</table>';
			let visicopymode = '<div id="'+this.eids.own.visicopymode+'" style="display:none;">'+this.controls.visicopymode.display()+'</div>';
			let resascopymode = '<div id="'+this.eids.own.resascopymode+'" style="display:none;">'+this.controls.resascopymode.display()+'</div>';
			
		let tab1 = this.controls.tabs.container(1, options+visicopymode+resascopymode);
		
			// account resources to be implied in the copy
			let staff = '<tr><td>'+this.controls.staff.display()+'</td></tr>';
			let rscmove = '<tr><td>'+this.controls.rscmove.display()+'</td></tr>';
				options = '<table summary="resources options" style="margin:0 auto">'+rscmove+staff+'</table>';
		let tab2 = this.controls.tabs.container(2, options); this.controls.tabs.hide(2,true);
			
			// access keys
			let acckeys4 = '<tr><td>'+this.controls.acckeys4.display()+'</td></tr>';
			let divak4 = '<div><table summary="access allocation">'+acckeys4+'</table></div>';
		let tab6 = this.controls.tabs.container(6, divak4);

		return tab0+tab1+tab2+tab6;
	},
	activate: function() {
		this.elements.collect(this.eids.own);
		this.controls.activate('M_duplacc');
	},
	
	// private

	// event handling
	incluchanged: function(slcts) {
		if(vbs) vlog('controls.js','M_duplacc','incluchanged', 'selections:'+slcts); 
		
			let showtab2 = slcts.includes('agendas') && !this.dS.single; // for single account, of course the only resource is included and of course it's a copy
		this.controls.tabs.hide(2, !showtab2);
			
			let showpatientsplit = slcts.includes('visitors') && slcts.includes('agendas'); // for single account, of course the only resource is included and of course it's a copy
			let ejq = $(this.elements.visicopymode);
		if(showpatientsplit) ejq.show(); else ejq.hide();
			
			let showresascmode = slcts.includes('reservations') && slcts.includes('agendas'); // for single account, of course the only resource is included and of course it's a copy
				ejq = $(this.elements.resascopymode);
		if(showresascmode) ejq.show(); else ejq.hide();
	},  
	targmodechange: function(sel) {
		if(vbs) vlog('controls.js','M_duplacc','targmodechange', 'selection:'+sel); 
		
			let naccel = $(this.elements.newaccdata);
			let taracc = $(this.elements.targetacc);
		if(sel=='0') { 
			naccel.show(); taracc.hide();
			this.controls.cartouche.enable(true,'save');
		} 
		else { 
			if(this.controls.targacc.getpost()) this.controls.cartouche.enable(true,'save');
				else this.controls.cartouche.enable(false,'save');
			naccel.hide(); taracc.show();
		}
	}, 
	targacc: function(which) { // a target account has been selected
		this.controls.cartouche.enable(!!which,'save');
	}, 
	targaccclear: function() { // the target account field has been cleared
		this.controls.cartouche.enable(false,'save');
	},
	staff: function(selections, typechanged) {
		if(vbs) vlog('modals.js','M_duplacc','staff','typechanged:'+typechanged);
	},  
	rscmove: function(selections) {
		if(vbs) vlog('modals.js','M_duplacc','rscmove','selections:'+selections);
	},  
	save: function() {
		if(!this.controls.validation()) return;
		this.modal.busy(true);
		let names = { 
			targetmode:'targetexisting', targacc:'targaccid', 
			id:{id:'id', dup:'dup'}, name:'name', color:'color', pattern:'pattern', note:'note', acckeys4:'acckeys4'
			, inclusive:'inclusive', staff:'resources', rscmove:'rscmove', visicopymode:'visicopymode', resascopymode:'resascopymode'
		};
		mobminder.app.post(this.controls, names, './post/account.php', new A_cb(this,this.saved), new A_cb(this,this.failed), { timeout:240000/*ms*/ }); // allows up to 2 minutes copying time (for big accounts)
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; },
	
	// ajax callback event handlers
	saved: function(inlineDataSets) { // retrieves a new key
		let dataSets = inlineDataSets['C_dS_accesskey'];
		let kid, dataSet; for(kid in dataSets) { dataSet = dataSets[kid]; break; };
if(vbs) vlog('modals.js','M_duplacc','saved','id='+dataSet.id);
		this.quit();
		if(this.callbacks.saved) this.callbacks.saved.cb(kid);
	},
	failed: function() {
		this.modal.busy(false);
	}
}



function M_POP_msg(preset, callbacks) { // see (*pu01*) pop up message at login, opening up an iframe that seeks its content from the mobminder.com host
	this.callbacks = callbacks || {}; // like { saved:, removed: }
	this.status = M_POP_msg.defauts.align(preset);
	this.handlers = new A_hn( { escape:new A_cb(this, this.escape)} );
	let b = 'pop_';
	this.eids = { overlay:b+'overlay', outset:b+'outset', inset:b+'inset'};
	this.elements = new A_el();
	
	this.pop();
}
M_POP_msg.defauts = new A_df({zindex:300});
M_POP_msg.prototype = {  
	// private
	pop: function() {
		
			let overindex = this.status.zindex; let outindex = overindex+1;
				let hpx = 0.80*C_iWIN.size.h;
			let outsize = 'top:10%; bottom:20%; left:15%; width:70%;';
			let outstyle = 'position:absolute; z-index:'+outindex+'; '+outsize+' overflow:hidden;';
		let outset = '<div class="pop-outset" id="'+this.eids.outset+'" style="'+outstyle+'">'+'</div>';
			
			let overstyle = 'position:absolute; z-index:'+overindex+'; top:0; bottom:0; left:0; width:100%; min-height:'+C_iWIN.size.h+'px;';
		let overlay = '<div class="pop-overlay" id="'+this.eids.overlay+'" style="'+overstyle+'"></div>';
		
			let istyle = 'position:absolute; z-index:'+overindex+'; top:0; bottom:0; left:0; width:100%; height:100%; border:none; background:none;';
			let ifroptions = 'allowTransparency="true" frameBorder="0" allowfullscreen="true"';
		let iframe = '<iframe style="'+istyle+'" src="https://maintenance.mobminder.com/fr/affiliate.php" '+ifroptions+'></iframe>';
		
		// display:
		$("body").append(iframe);
		
		// activate
		this.elements.collect(this.eids);
		$(this.elements.overlay).click(this.handlers.escape);
		new C_KEY(C_KEY.code.s.escape, this.handlers.escape, 'M_POP_msg::overlay');
		
		return this;
	},
	
	// private
	remove: function() {
		C_KEY.unbind(C_KEY.code.s.escape, this.handlers.escape);
		
		$(this.elements.outset).remove();
		$(this.elements.overlay).unbind('click', C_iMODAL.click).remove();
	},
	
	
	// event handling
	quit: function() { },
	escape: function() {  this.remove(); },
	
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   
//  C O N F I R M     P O P     U P     M O D A L 
//
function M_iSECURITY(dS, callbacks, preset) { // callbacks like { onChoice } , this modal is set up by T_bar in mobminder.js, see (*cr02*)

		let base = 'info_layer'+C_iMODAL.layer+'_';
	this.eids = { buttons:'modal_msg_layer_'+C_iMODAL.layer, b0:base+'b0', b1:base+'b1', am:base+'am' };
	this.callbacks = callbacks || {};
	this.state = M_iSECURITY.defauts.align(preset=preset||{});

	let custominteract = this.state.interactivity instanceof Object;
	let interactivity = { '1':'secur-action' }; // this is the default value: a single "ok" button
	if(custominteract) {
		interactivity = this.state.interactivity; // as defined by user, e.g. let interact = { 'quit':'quit anyway', 'stay':'chat stay' };
	} else
		switch(this.state.interactivity) { // here we have some common standard options, preset like { interactivity:'ok' }
			case 'confirm':	interactivity = { '0':'cancel', '1':'confirm' }; break;
			case 'yesno': 	interactivity = { '0':'no', 1:'yes' }; break;
			case 'yes': 	interactivity = { '0':'yes' }; break;
		} 
		
		
	// make meta data from chosen interactivity
		let cssclass = 'button-msg'; 
		let divstyle = 'padding:1em 1em; margin:1em 1em; display:inline-block; min-width:14em;';
	
		this.controls = [];
	for(let v in interactivity) {
			let m = interactivity[v];
			let bpreset = { tag:'div', css:cssclass, style:divstyle, ui:C_XL.w(m, {cap:1} ) };
		let b = new C_iCLIK(base+'_'+v, { click:new A_cb(this, this.click, v ) }, bpreset);
		this.controls[v] = b;
	}


	// display
	let  ribbon = '<div class="ribbon ribbon-top-left"><span class=""><i class="bold fas fa-shield-check fa-1d5x centered"></i></span></div>';

		let logoimg = '<img class="mobminder" width="300px" src="./themes/logos/mob-logo.png" alt="mobminder logo"/>';
    // let logo = '<div class="" style="display:flex; justify-content:center;"><a href="https://mobminder.com" rel="noopener nofollow" target="_blank">'+logoimg+'</a></div>';
    let logo = '<div class="" style="display:flex; justify-content:center;">'+logoimg+'</div>';
	
		let h2txt = dS.firstname+', '+C_XL.w('secur-h2', {cap:0});
	let h2 = '<h2 class="mob-txt-gray_l centered" style="text-wrap:balance;">'+h2txt+'</h2>';

		let msgstyle = 'margin:1em 0; text-wrap:balance;';
	let divmsg = '<div class="orange centered f-calibri-bold'+(this.state.css.body||'')+'" style="'+msgstyle+'">'+C_XL.w('secur-msg')+'</div>';
	
	
	
		let accman = new C_iAManager(this.eids.am, {}, {} );
			this.controls['accman'] = accman;
		let dS_accman = this.controls.accman.dS;
		let mobile = C_iEDIT.ergophone(dS_accman.mobile, 3);
	let aminfo = '<div class="right" style="padding:10px 40px;">'+dS_accman.lname({})+', '+mobile+'</div>';
	let guy = '<div class=""><div>'+accman.photography()+'</div></div>';
	
		let buttons = ''; for(let v in interactivity)
			buttons += this.controls[v].display();
	let divbuttons = '<div style="margin:0; border:1px solid transparent; text-align:center;">'+buttons+'</div>';
			
		let layout = ribbon+'<div class="message-box" style="padding:20px 120px 20px 120px; max-width:600px;">'+logo+h2+divmsg+divbuttons+aminfo+guy+'</div>';
	
	// activate
	this.modal = new C_iMODAL({body:layout}, { escape:new A_cb(this, this.escape) }, { style:'info', size:this.state.size, fullscreen:is.newtouch, morecss:{ outlet:this.state.css.borders } } );
	if(this.state.sound) mobminder.sounds[this.state.sound].play();
	
	for(let c in this.controls) this.controls[c].activate();
}
M_iSECURITY.defauts = new A_df( { interactivity:'ok', sound:'please' // see (*snds01*)
							, css:new A_df({image:'comment-exclamation', body:false, borders:'mmborder-none' })
							, size:{x:'',y:''}, result:false} );
M_iSECURITY.prototype = {
	// public
	close: function(v) { // programmatic close command
		this.modal.close({slow:1000}); 
		this.state.result = v||0; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(this.state.result);
	},
	
	// callbacks
	click: function(value) { // one of the buttons has been clicked
		this.modal.close({slow:1000}); 
		this.state.result = value; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(value); 
	},
	escape: function() { // the modal has been escaped 
		this.state.result = 0; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(0); 
		return true; 
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   
//  C O N F I R M     P O P     U P     M O D A L 
//
function M_iLOGIN(eid, callbacks, preset) { // callbacks like { onChoice } 

	// generic
	this.eids = { buttons:eid+'_btts', eid:eid, login:eid+'_log', pass:eid+'_pss', imobile:eid+'_imbl', logmein:eid+'_login', sendsms:eid+'_send', o:eid+'_obf', r:eid+'_rmnd', c:eid+'_clsh' };
	this.own = { login:eid+'_lgin', obfs:eid+'_obfs', remind:eid+'_remind', mobile:eid+'_mobile', reminder:eid+'_rmdr', logpass:eid+'_lgpss' };
	this.elements = new A_el();
	this.ownelements = new A_el();
	this.callbacks = callbacks || {}; // like { loginok:,  }
	this.state = M_iLOGIN.defaults.align(preset); // like { css:{ modalcss:'airy' }, mode:'inapp' or 'welcome' }

	let cartouche	= new C_iDQS(this.eids.buttons, { onquit:new A_cb(this, this.quit)}, { save:false, remove:false } );

	let login 	= new C_iFIELD(this.eids.login, { onfchange:new A_cb(this, this.lptyped, false, false, 600) }, { digits:'', type:INPUT_LOGIN, mandatory:true, showvalid:false});
	let pass 	= new C_iFIELD(this.eids.pass, { onfchange:new A_cb(this, this.lptyped, false, false, 600) }, { digits:'', type:INPUT_PASSWD, mandatory:true, showvalid:false});
	
		let pr = mobminder.app.phoneRegion; // something like [ 31, 32, 33, 34, 44, ... ], see C_iMOB and geocheck.php
	let imobile = new C_iFIELD(this.eids.imobile, { onfchange:new A_cb(this, this.mtyped, false, false, 600) }, { digits:'', type:INPUT_MOBILE, mandatory:true, showvalid:true, placeholder:pr });
	
	// builds now the log in button caption
			this.login = '<div class="fa fa-15x fa-sign-in-alt"></div>';
			this.lonok = '<div class="fa fa-15x fa-times orange"></div>';
			this.logok = '<div class="fa fa-15x fa-check"></div>';
			let cstyle = 'height:1.6em; display:flex; justify-content:center; gap:2em; place-items:center; padding:.3em;';
		let caption = '<div id="'+this.own.login+'" style="'+cstyle+'">'+this.login+'</div>';	
	let logmein = new C_iSPIN(this.eids.logmein, { click:new A_cb(this, this.logmein) }, {  caption:caption, visible:true } );

				this.see = '<div class="fa fa-13x fa-low-vision"></div>';
				this.hide = '<div class="fa fa-13x fa-user-secret"></div>';
				let ostyle = 'height:1.6em; display:flex; justify-content:center; gap:2em; place-items:center; padding:.3em;';
			let ocaption = '<div id="'+this.own.obfs+'" style="'+cstyle+'">'+this.see+'</div>';
			
			let smallbuttonstyle = 'position:relative; z-index:+0; padding:0; width:4em;';
			
		let oclickpreset = { tag:'div', ui:ocaption, css:'', style:smallbuttonstyle, tip:'Shows / Hides your password.', visible:false } 	
	let obfuscate = new C_iCLIK(this.eids.o, { click:new A_cb(this, this.obfuscate) }, oclickpreset  );

				let phone = '<div class="fa fa-13x fa-phone-rotary"></div>';
				let rostyle = 'height:1.6em; display:flex; justify-content:center; gap:2em; place-items:center; padding:.3em;';
			let rcaption = '<div id="'+this.own.remind+'" style="'+cstyle+'">'+phone+'</div>';
			
			let mayhelp = this.state.mode=='inapp' ? false : true;
		let rclickpreset = { tag:'div', ui:rcaption, css:'', style:smallbuttonstyle, tip:'Reminder over your credentials', visible:mayhelp } 	
	let help = new C_iCLIK(this.eids.r, { click:new A_cb(this, this.help) }, rclickpreset  );
			
				let close = '<div class="fa fa-13x fa-times"></div>';
			let closecaption = '<div id="'+this.own.remind+'" style="'+cstyle+'">'+close+'</div>';
		let cclickpreset = { tag:'div', ui:closecaption, css:'', style:smallbuttonstyle, tip:'Return to login pass screen' } 	
	let closehelp = new C_iCLIK(this.eids.c, { click:new A_cb(this, this.closehelp) }, cclickpreset  );


	// builds now the log in button caption
			this.mobiledo = '<div class="fa fa-15x fa-arrow-alt-right"></div><div class="fa fa-15x fa-mobile"></div>';
			this.mobileok = '</div><div class="fa fa-15x fa-mobile"></div><div class="fa fa-15x fa-check"></div>';
			let sstyle = 'height:1.6em; display:flex; justify-content:center; gap:1em; place-items:center; padding:.3em;';
		let scaption = '<div id="'+this.own.mobile+'" style="'+sstyle+'">'+this.mobiledo+'</div>';
	let sendsms = new C_iSPIN(this.eids.sendsms, { click:new A_cb(this, this.sendsms) }, {  caption:scaption, visible:true } );
	
	

	//

	this.controls = new A_ct({cartouche:cartouche, logmein:logmein, obfuscate:obfuscate, help:help, login:login, pass:pass, imobile:imobile, sendsms:sendsms, closehelp:closehelp});
	
	this.keys = { enter:new A_cb(this, this.enterkey) }; // note that the logmein button has an own enter key system
			
	// build display
	
				let ltds = this.controls.login.labelled('login', 'alpha24 f-consola welcome')+'<td></td>'; // which is 3 td's like <td>label</td><td>field</td><td>nothing</td>
			let loginarea = '<tr style="border-bottom:10px solid transparent; border-top:5px solid transparent;">'+ltds+'</tr>';
				let ptds = this.controls.pass.labelled('pass', 'alpha24 f-consola welcome')+'<td>'+this.controls.obfuscate.display()+'</td>'; // which is 3 td's like <td>label</td><td>field</td><td>obfuscator command</td>
			let passarea = '<tr style="border-bottom:20px solid transparent;">'+ptds+'</tr>';		
			let action = '<tr style="border-bottom:0px solid transparent;"><td></td><td style="">'+this.controls.logmein.display()+'</td><td>'+this.controls.help.display()+'</td></tr>'; // 
		
		let logpass = '<table id="'+this.own.logpass+'" style="padding:0; margin:0 auto;">'+loginarea+passarea+action+'</table>';
		
		
				let mobile = this.controls.imobile.labelled('mobile', 'alpha12 f-consola welcome centered overead')+'<td>'+this.controls.closehelp.display()+'</td>'; // which is 3 td's like <td>label</td><td>field</td><td>nothing</td>
			let mobilearea = '<tr style="border-bottom:10px solid transparent; border-top:5px solid transparent;">'+mobile+'</tr>';
			let raction = '<tr style="border-bottom:0px solid transparent;"><td></td><td style="">'+this.controls.sendsms.display()+'</td><td></td></tr>'; // 
		
		let reminder = '<table id="'+this.own.reminder+'" style="display:none; padding:0; margin:0 auto;">'+mobilearea+raction+'</table>';
	
	let layout = '<div class="" style="padding:20px 120px 20px 120px; max-width:50em;">'+logpass+reminder+'</div>';

	// activate
		let yoff = this.state.mode=='inapp' ? -100 : +40; // y offset positionning
	this.modal = new C_iMODAL({header:this.header(), body:layout}, { escape:new A_cb(this, this.escape) }
		, { style:'info', size:this.state.size, position:{ drop:false, offset:{x:0,y:yoff} }, fullscreen:is.newtouch, morecss:{ outlet:this.state.css.modalcss } } );
	
	if(this.state.sound) mobminder.sounds[this.state.sound].play();
	
	this.activate();
	
}
M_iLOGIN.defaults = new A_df({ mode:'inapp', css:new A_df({ modalcss:'' }), size:{x:'56em',y:''}, obfuscated:true, title:'connect one user' });
M_iLOGIN.prototype = {
	// public
	close: function(v) { // programmatic close command
		this.modal.close({slow:1000}); 
	},
	
	// private	
	header: function() {
		
		if(this.state.mode == 'welcome') return '';
		
			let buttons = '<td class="cartouche">'+this.controls.cartouche.display()+'</td>';
			let title = '<td class="mheader"><h1 class="centered">'+C_XL.w(this.state.title)+'</h1></td>';
			let row = '<tr>'+buttons+title+'</tr>';
		let header = '<table summary="login" style="width:100%; margin:1em;">'+row+'</table>';
		
		return header;
	},

	activate: function() {
		this.elements.collect(this.eids);
		this.ownelements.collect(this.own);
		this.controls.reset().activate('M_iLOGIN');
			C_KEY.unbind(C_KEY.code.s.enter, this.keys.enter, 'M_iLOGIN::'+this.eids.eid); 
		new C_KEY(C_KEY.code.s.enter, this.keys.enter, 'M_iLOGIN::'+this.eids.eid);
		C_iTIP.handlers.quit();
		
		this.controls.login.focus(true);
		this.controls.pass.obfuscate(this.state.obfuscated);
		mobminder.orientation.check();
	},
	checkin: function(l,p) {
		let data = new C_iPASS({l:l, p:p});
		new A_ps({data:data}, {data:{l:'l', p:'p'}}, './queries/checkin.php', {onreply:new A_cb(this,this.validated), ontimeout:new A_cb(this,this.failed)});
		mobminder.sounds.openup.play();
	},
	
	
	// callbacks
	quit: function() { this.modal.close(); },	
	escape: function() { // the modal has been escaped 
		this.state.result = 0; 
		return this.state.mode == 'inapp'; // makes the modal be real modal mode (it is not possible to close it by clicking aside the window)
	},
	enterkey: function() { this.controls.logmein.go(); return false; },
	logmein: function() { // control button hit or ENTER key	
		let l = this.controls.login.digits();
		let p = this.controls.pass.digits();
		if(!(l&&p)) return true; // cancels the hit, see (*cr20*)
		this.checkin(l,p);
		return false;
	},
	obfuscate: function() { // that is a toggle
		this.state.obfuscated = !this.state.obfuscated;
		this.controls.obfuscate.visible(false);
		setTimeout(()=>{
			this.ownelements.obfs.innerHTML = this.state.obfuscated?this.see:this.hide;
			this.controls.obfuscate.visible(true);
		},1000);
		this.controls.pass.obfuscate(this.state.obfuscated);
	},
	help: function() { // that is a toggle
		$(this.ownelements.reminder).show();
		$(this.ownelements.logpass).hide();
		this.controls.imobile.focus(true);
	},
	closehelp: function() { // that is a toggle
		$(this.ownelements.reminder).hide();
		$(this.ownelements.logpass).show();
		this.controls.login.focus(true);
	},
	sendsms: function() { // that is a toggle
		let cancel = false;
		let recepient = this.controls.imobile.value(); // which is already screened on format validity
		if(this.controls.imobile.valid()) { // in case the surfer did play crazy with bottons
			let data = new C_iPASS({to:recepient}); // login and pass set to zero triggers a search on the mobile and sends creds only for this valid mobile number
			mobminder.app.post({data:data}, {data:{to:'to'}}, './post/credshelp.php', new A_cb(this,this.credssent), new A_cb(this,this.failed));
		} else cancel = true;
		return cancel; // mandatory value used here (*cr20*) to cancel/validate the action
	},
	lptyped: function() {
		let l = !!this.controls.login.value(); // is there something written here?
		let p = !!this.controls.pass.value(); // is there something written here?
		// this.controls.logmein.visible(l&&p); // cancels the hit, see (*cr20*)
		this.controls.obfuscate.visible(p); // keeps obfuscate option hidden when nothing is written in password field
	},
	mtyped: function() {
		let l = !!this.controls.imobile.value(); // is there something written here?
		// this.controls.sendsms.visible(l); // cancels the hit, see (*cr20*)
	},
	
	// ajax feedback
	validated: function(stream) { // ajax feedback
		let key = stream.split('!').shift()|0;
		if(vbs) vlog('mobminder.js','T_logged','validated','key='+key); 
		if(key) { // valid login case
			C_KEY.unbind(C_KEY.code.s.enter, this.keys.enter); 
			this.ownelements.login.innerHTML = this.logok;
			this.controls.logmein.done();
			if(this.callbacks.loginok) this.callbacks.loginok.cb(key);
			setTimeout( () => {
				this.close();
			}, 1000); // during this time, the check symbol appears in the button
			return;
		} 
		
		// else: invalid login case
		
		this.ownelements.login.innerHTML = this.lonok;
			this.controls.login.focus(true);
		
		setTimeout( () => {
			this.controls.login.clear();
			this.controls.pass.clear();
			this.ownelements.login.innerHTML = this.login;
			this.controls.logmein.done();
		}, 200);
		return;
		
	},
	credssent: function() {
		this.ownelements.mobile.innerHTML = this.mobileok;
		this.controls.sendsms.done();
		setTimeout( () => { 
			this.ownelements.mobile.innerHTML = this.mobiledo;
			this.closehelp();
		}, 3000);
	},
	failed: function() {		
		this.controls.logmein.done();
		// return new C_iMSG(C_XL.w('connection failed'));
	}
}








