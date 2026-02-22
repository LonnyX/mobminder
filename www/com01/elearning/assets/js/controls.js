
//////////////////////////////////////////////////////////////////////////////////////////////
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


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   M E N U   is a list of C_iCLICK controls
//
//   no checkbox nor radio buttons, check C_iCRESTA if you need that 
//
function C_iMENU(eid, callbacks, options, preset) { // options is { labels:{}, order:{}, presets:{}, count: } 
		preset = preset || {};
	this.state = C_iMENU.defauts.align(preset); 
		if(this.state.ismulti) this.state.multiselect = new Array();
	this.eids = { eid:eid, title:eid+'_titl' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onlabel: }
	this.labels = new A_ct();
	
	// options are expected like { count:5, order:[0:v1, 1:v2, ...], labels:[v1:'label1', v2:'label2, ...], presets:[v1:{highlight:true, locked:false}, v2:,...] }
	// Only options.labels: is really required
	//
		if(!options.order) { options.order = []; for(let i in options.labels) options.order.push(i); } // then make the order from the labels list (depending on the browser, the creation sequence in labels is OR IS NOT respected)
		if(!options.count) options.count = options.order.length;
		if(!options.presets) options.presets = {};
	for(let x in options.order) { 
			let v = options.order[x];
			let l = options.labels[v]; // note that the same value can come many times in the menu, using different labels
			let p = options.presets[v] || {};
			let morep = { value:v, ui:l, tag:'td', css:'menu-label', position:x };
		let label = new C_iCLIK(eid, { click: new A_cb(this,this.onlabel) }, omerge(p,morep) );
		this.labels.add1(label, x);
		if(label.state.selected) this.state.selected = x;
		if(this.state.ismulti) if(label.state.selected) this.state.multiselect[x] = v;
	}
	this.options = options; 
	
		let title = this.state.title?new C_iCLIK(this.eids.title,{click:new A_cb(this, this.ontitle)},{ui:this.state.title, tag:'div'}):false;
		let table = new C_iTABLE(this.eids.eid, this.labels, {maxrows:preset.maxrows, maxcols:preset.maxcols});

	this.controls = new A_ct({title:title, table:table});
	
	if(preset.value!==undefined) this.select(preset.value, true, {reset:true}); // place a selection css on one label
}
C_iMENU.defauts = new A_df({ 
	  maxcols:4, maxrows:12, title:false, cssclass:'menu-table', tabselect:false, ismulti:false // preset options
	, arrowed:false, highlighted:false, selected:false, multiselect:false // state machine
});
C_iMENU.prototype = {
	display: function(css) {
		// this.labels.reset();
		if(!this.options.count) return ''; // removes also the title when no items to display
				css = css||'';
			let table = this.controls.table.display(this.state.cssclass+' '+css);
			let title = this.controls.title? this.controls.title.display('select-header textcolor-light '+(css||'')) : '';
		
		return title+table;
	},
	activate: function() { 
		this.elements.collect(this.eids);
		let isdisplayed = this.controls.table.isdisplayed(); 
		
		if(vbs) vlog('controls.js','C_iMENU','activate',this.eids.eid+', labels count:'+this.options.count+', tab:'+this.state.tabselect+', displayed:'+isdisplayed);
		
		if(!isdisplayed) return this; // not yet displayed
		
		// this.labels.activate(); 
		if(this.controls.title) this.controls.title.activate();
		this.controls.table.activate();
		if(this.state.tabselect)
			new C_KEY([C_KEY.code.s.up_arrow, C_KEY.code.s.down_arrow, C_KEY.code.s.tab, C_KEY.code.s.enter, C_KEY.code.s.ctrl+C_KEY.code.s.enter], new A_cb(this, this.arrows), 'C_iMENU::'+this.eids.eid);
	},
	getelement: function(value) { // used for scrolling to a given element, see (*e01*)
		for(let x in this.options.order) if(this.options.order[x]==value) return this.labels[x].element();
		return false;
	},
	select: function(value, onoff, options) { // options like { reset:true }
		if(options) if(options.reset) {
			for(let x in this.options.order) this.labels[x].select(false);
			this.state.selected = false;
		}
		for(let x in this.options.order) if(this.options.order[x]==value) {
			this.labels[x].select(onoff);
			this.state.highlighted = false; 
			this.state.selected = x;
		}
		return this;
	},
	highlight: function(value, onoff, options) {
		if(options) if(options.reset) for(let x in this.options.order) this.labels[x].highlight(false);
		for(let x in this.options.order) if(this.options.order[x]==value) this.labels[x].highlight(onoff);
	},
	lock: function(values, onoff, options) {
		if(options) if(options.reset) for(let x in this.options.order) this.labels[x].lock(false);
		if(!(values instanceof Array)) values = [values];
		for(let i in values)
			for(let x in this.options.order) 
				if(this.options.order[x]==values[i]) this.labels[x].lock(onoff);
	},
	count: function() { return this.options.order.length; },
	show: function(which, onoff) { // which is one value or an array of value like [ v1, v2, v3 ]
		if(!which) for(let x in this.options.order) this.labels[x].hide(!onoff);
			else {
				if(typeof which !== 'object') which = [which];
				for(let y in which) { 
					let v = which[y]; // value to show/hide
					for(let x in this.options.order) 
						if(this.options.order[x]==v) this.labels[x].hide(!onoff);
				}
			}
		return this;
	},
	subset: function(letters) { // highlights letters if found in labels, and hides all other labels
	
		if(!letters) return this.show(false,true); // shows them all
		
		letters = letters.split(''); // (*ac01*)
		let spaced = letters.join('[ \'-]*'); // ignore spaces, minus, and simple quote // covers the case of pre-fixed names like 'Da Costa' or 'de-Roy'
			
			// if your letters arrived like "lho", they are turned into "l[ -']*h[ -']*o"
			// console.log(spaced);
			
			spaced = spaced.replace(/\//g,'\\/'); // in case you enter a brithday with slashes,  back slashes for slashes e.g. '/95', '/' must be slashed for the regexp to work (registration field allows this character)
		let regexp = '('+spaced+')(?![^<>]*<\/|[^><]*>)'; // (?![^<>]*<\/|[^><]*>) does not search inside html tags (used e.g. for bullets...)
			regexp = new RegExp(regexp, 'gi'); // g = global search, i = case insensitive
		
		let matchcount = 0;
		for(let x in this.labels.get)
			matchcount += this.labels.get[x].inlabel(regexp, { elsehide:true } );
			
		return matchcount;
	},
	
	// private
	skip: function(labelindex) { // when arrow keys are used, this function defines which item are skipped when rotating with the arrows
		let label = this.labels.get[labelindex];
		let skip = label.state.hidden || label.state.section || label.state.selected || (!label.state.enabled);
		return skip;
	},
	next: function() { // highlights the next not hidden item in the list of options
			let current = this.state.highlighted; 
			let len = this.options.count;
			
			if(current === false) { // there has been no arrowing yet on this menu
				current = -1; // value of the currently highlighted label, or the first one
				if(this.state.selected !== false) current = this.state.selected|0;
			}
			else this.labels.get[current].highlight(false); // one item was highlighted, turn it off
			
			let s = current+1; s%=len; // keep it in range 
			let round = 0; 
		
		while(this.skip(s) && round<len) { round++; s++; s%=len; }; // step to the next not hidden item, whose position is s
			
			if(round==len) this.state.highlighted = this.state.arrowed = false; // a round-over did not discovered any not hidden item
			else {
				this.labels.get[s].highlight(true); // highlights the newly found next item
				this.state.highlighted = s;
				this.state.arrowed = true; 
			}
		if(vbs) vlog('controls.js','C_iMENU','next','selected:'+this.state.selected+', current:'+current+', new highlight:'+this.state.highlighted);
		
	},
	previous: function() { // highlights the previous not hidden item in the list of options
			let current = this.state.highlighted; 
			let len = this.options.count;
			
			if(current === false) { // there has been no arrowing yet on this menu
				current = 0; // value of the currently highlighted label, or the first one
				if(this.state.selected !== false) current = this.state.selected|0;
			}
			else this.labels.get[current].highlight(false); // one item was highlighted, turn it off
			
			let s = current-1; s+=len; s%=len; // keep it in range 
			let round = 0; 
			
		while(this.skip(s) && round<len) { round++; s--; if(s<0)s=len-1; }; // step to the next not hidden item, whose position is s
			
			if(round==len) this.state.highlighted = this.state.arrowed = false; // a round-over did not discovered any not hidden item
			else {
				this.labels.get[s].highlight(true); // highlights the newly found next item
				this.state.highlighted = s;
				this.state.arrowed = true; 
			}
		if(vbs) vlog('controls.js','C_iMENU','previous','selected:'+this.state.selected+', current:'+current+', new highlight:'+this.state.highlighted);
	},
	
	// events
	onlabel: function(o, ctrlkey) { // one of menu options was clicked/touched
		// o is an instance of 
		if(vbs) vlog('controls.js','C_iMENU','onlabel',this.eids.eid+', labels count:'+this.options.count+', tab:'+this.state.tabselect+', ctrlkey:'+ctrlkey);
		if(ctrlkey&&this.state.ismulti) { // keep this control 
				let v = o.state.value;
			if(o.state.position in this.state.multiselect)	{ // was selected already
				this.state.multiselect.splice(o.state.position, 1); // revert to not selected, index based pop out the element
				o.highlight(false);
			} else {
				this.state.multiselect[o.state.position] = v;
				o.highlight(true);
			}
		} else 
			if(this.callbacks.onlabel) this.callbacks.onlabel.cb(o.state.value, ctrlkey);
	},
	ontitle: function() {
		if(this.callbacks.ontitle) this.callbacks.ontitle.cb();
	},
	arrows: function(keycode) {
		switch(keycode) {
			case C_KEY.code.s.down_arrow: this.next(); break;
			case C_KEY.code.s.up_arrow: this.previous(); break;
			case C_KEY.code.s.ctrl+C_KEY.code.s.enter: 
			case C_KEY.code.s.enter: 
				if(this.state.ismulti) {		
					if(vbs) vlog('controls.js','C_iMENU','arrows',this.eids.eid+', ismulti:true',this.state.multiselect);
					if(this.callbacks.onmulti) this.callbacks.onmulti.cb(this.state.multiselect);
					break; // this break is under if condition!
				}
			case C_KEY.code.s.tab: 
				if(!this.state.arrowed) { 
					// you must have used up or down arrow keys before being able to select using tab. If arrow keys were not used, we propagate true and the browser will skip the focus to the next input.
					if(this.callbacks.onarrow) this.callbacks.onarrow.cb(false, false);
					return true; 
				} 
				let high = this.state.highlighted;
				this.labels.get[high].highlight(false); // turn it off
				if(this.callbacks.onlabel) this.callbacks.onlabel.cb(this.options.order[high]);
				this.state.selected = high;
				this.state.highlighted = false;
				return false; // do not propagate
		}
		let high = this.state.highlighted;
		if(high !== false)
			if(this.callbacks.onarrow) this.callbacks.onarrow.cb(this.options.order[high], this.getelement(high) );
		return false;
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//  C O M M E N T S
//
function C_iCOMMENT(eid, callbacks, preset) {
	this.state = C_iCOMMENT.defauts.align(preset); 
	this.eids = { label:eid+'_'+this.state.value+'_lbl', comment:eid+'_'+this.state.value+'_cmnt' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onlabel: }	
	
	let comment = new C_iFIELD(this.eids.comment, { onfchange:new A_cb(this, this.fchange), onfclear:false}, { digits:this.state.comment, type:this.state.inputype, placeholder:this.state.placeholder });
	this.controls = new A_ct({comment:comment});

}
C_iCOMMENT.defauts = new A_df({ value:0, label:'', comment:'', placeholder:'', locked:false, inputype:INPUT_ALPHA });
C_iCOMMENT.prototype = {

	// PUBLIC: initialize
	display: function() {
		let label = '<td id="'+this.eids.label+'" class="label" style="white-space:nowrap;">'+this.state.label+'</td>';
		let input = '<td>'+this.controls.comment.display()+'</td>';
		return label+input;
	},
	activate: function() { 
		this.controls.activate();
	},
	getpost: function() {
		return this.state.value+'!'+this.controls.comment.getpost();
	},
	
	// changing state PRIVATE
	lock: function(locked) { // 
		return this;
	},
	
	// callbacks
	fchange: function(d) {
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.state.value,d);
	}
}	



//////////////////////////////////////////////////////////////////////////////////////////////
//
//  L I S T    O F   I N P U T    F I E L D S 
//
function C_iTXTA(eid, callbacks, options, preset) { // options is { labels:{}, order:{}, presets:{}, count: } 
		preset = preset || {};
	this.state = C_iTXTA.defauts.align(preset); 
	this.eids = { eid:eid, title:eid+'_titl' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onlabel: }
	this.items = new A_ct();
	
	// options are expected like { count:5, order:[0:v1, 1:v2, ...], labels:[v1:'label1', v2:'label2, ...], presets:[v1:{digits:'hello', locked:false}, v2:,...] }
	// Only options.labels: is really required
	//
		if(!options.order) { options.order = []; for(let i in options.labels) options.order.push(i); } // then make the order from the labels list (depending on the browser, the creation sequence in labels is OR IS NOT respected)
		if(!options.count) options.count = options.order.length;
		if(!options.presets) options.presets = {};
	for(let x in options.order) { 
		let v = options.order[x];
		let l = options.labels[v];
		let c = options.presets[v]||'';
		let item = new C_iCOMMENT(eid, this.callbacks, { value:v, label:l, comment:c});
		this.items.add1(item, x);
	}
	this.options = options; 
	
		let title = this.state.title?new C_iCLIK(this.eids.title,{click:new A_cb(this, this.ontitle)},{ui:this.state.title, tag:'div'}):false;
		let table = new C_iTABLE(this.eids.eid, this.items, {maxrows:preset.maxrows, maxcols:preset.maxcols});
	this.controls = new A_ct({title:title, table:table});	
}
C_iTXTA.defauts = new A_df({ maxcols:4, maxrows:12, title:false, cssclass:'menu-table' });
C_iTXTA.prototype = {
	display: function(css) {
		this.items.reset();
		if(!this.options.count) return '';
		
			let title = this.controls.title? this.controls.title.display('select-header textcolor-light'+' '+(css||'')) : '';
			let table = this.controls.table.display(this.state.cssclass+' '+(css||''));
		
		return title+table;
	},
	activate: function() { 
		if(vbs) vlog('controls.js','C_iTXTA','activate','items count:'+this.options.count);
		// this.items.activate(); 
		this.controls.activate(); 
	},
	lock: function(values, onoff, options) {
		if(options) if(options.reset) for(let x in this.options.order) this.items[x].lock(false);
		if(!(values instanceof Array)) values = [values];
		for(let i in values)
			for(let x in this.options.order) 
				if(this.options.order[x]==values[i]) this.items[x].lock(onoff);
	},
	count: function() { return this.options.order.length; },
	getpost: function() {
		let suite = new Array();
		for(let x in this.options.order) 
			suite.push(this.items[x].getpost());
		return suite.join('|');
	},
	
	// events
	ontitle: function() {
		if(this.callbacks.ontitle) this.callbacks.ontitle.cb();
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//  S E L E C T O R S  (have checkbox or radio ahead the label)
//
function C_iTEM(eid, callbacks, c /*correlator*/, label, preset) { 
		preset = preset || {};
		if(typeof preset === 'boolean') preset = { checked:true }; // preset can be a boolean or a detailed object matching the C_iTEM.defauts
	this.state = C_iTEM.defauts.align(preset); 
	this.c = c;
		let base = eid+'_'+c+'_';
	this.eids = { label:base+'lb', check:base+'ck', tip:'tip', own:{ wrappy:base+'wp'}  };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onlabel:, oncheck: }
	this.tip = false; // C_iTIP
	
			let ruby = '&nbsp;<ruby style="position:absolute; top:20%; left:0.6em;">'+'</ruby>'; // the checker container
		let check = new C_iCLIK(this.eids.check, { down:new A_cb(this, this.cdown), click:new A_cb(this, this.cclick)} , { tag:'td', ui:ruby , css:'cresta-check', style:'position:relative; padding-left:1.6em;' } );
		label = new C_iCLIK(this.eids.label, { down:new A_cb(this, this.ldown), click:new A_cb(this, this.lclick)} , { tag:'td', ui:label, css:'cresta-label', style:'width:99%;' } );

	this.controls = new A_ct({check:check, label:label}); 
}
C_iTEM.preset = function(values) { // values like { checked:false, highlight:false, locked:false, tip:false, hidden:false }
	for(let v in values) this[v] = values[v];
	// this class is made so that you can figure out what kind of value you get as argument for presetting items of a C_iCRESTA, see the case of C_dS_loggable.cresta
}; 
C_iTEM.defauts = new A_df({ checked:false, highlight:false, locked:false, tip:false, hidden:false, flip:false });
C_iTEM.state = { down:false } // static status
C_iTEM.prototype = {

	// PUBLIC: initialize
	display: function() {
		
		if(this.state.tip) this.settip();
		
		let label = this.controls.label.caption()?this.controls.label.display():'';
		let check = this.controls.check.display();
			
			let inset = '<table style="width:100%">'+'<tr>'+(this.state.flip?label+check:check+label)+'</tr>'+'</table>';
		return '<div id="'+this.eids.own.wrappy+'" style="">'+inset+'</div>'; // classes added to this are highlight, disabled
	},
	activate: function() { 
		if(vbs) vlog('controls.js','C_iTEM', 'activate', 'c:'+this.c);
		this.elements.collect(this.eids.own);
		if(this.elements.wrappy) { // do nothing if this control was not displayed
			
			if(this.state.checked) this.check(this.state.checked);
			if(this.state.highlight) this.highlight(this.state.highlight);
			if(this.state.hidden) this.hide(this.state.hidden);
			if(this.tip) this.tip.activate();
			this.lock(this.state.locked);
		}
		this.controls.activate('C_iTEM'); 
	},
	reset: function() { return this.controls.reset(); },
	highlight: function(on) {
		if(vbs) vlog('controls.js','C_iTEM','highlight','c:'+this.c+', on:'+on);
		if(on) $(this.elements.wrappy).addClass('highlight'); else $(this.elements.wrappy).removeClass('highlight'); // ruled by controls.css, see see (*C01*)
		this.state.highlight = on;
		return this;
	},	
	check: function(on) {
		if(vbs) vlog('controls.js','C_iTEM','check','c:'+this.c+', on:'+on);
		if(on) $(this.elements.wrappy).addClass('selected'); else $(this.elements.wrappy).removeClass('selected'); // ruled by controls.css, see see (*C01*)
		this.state.checked = on;
		return this;
	},
	settip: function(tip) { // change tip
		
		if(tip===undefined) tip = this.state.tip; // no parameter passed
			else this.state.tip = tip; // new tip or false passed
		if(this.tip) { this.tip.remove(); this.tip = false; }
		if(!tip) return this; // tip === false
		
		if(this.state.tip) { // this allows to pass a tip preset or just a string
			if(typeof(this.state.tip)==='string')
				this.tip = new C_iTIP(this.eids.own.wrappy, {text:this.state.tip, css:'tip'}); // easy case, some text was passed, to be displayed in standard tip format
			else
				if(typeof(this.state.tip)==='object') 
					if(this.state.tip.text&&this.state.tip.css)
						this.tip = new C_iTIP(this.eids.own.wrappy, this.state.tip); // a tip preset like { text:'blabla' ans css:'sticker-tip'} was passed
		}
		return this;
	},
	newtip: function(tip) { this.settip(tip); if(!this.elements.wrappy) return this; if(this.tip) this.tip.activate(); return this; },
	setlabel: function(label) { // change label
		if(label==undefined) return this;
		this.controls.label.caption(label);
		return this;
	},
	lock: function(locked) { // elements must exist in the DOM
		if(vbs) vlog('controls.js','C_iTEM', 'lock', '  - label: '+this.controls.label.caption()+' '+(locked?'locked':'unlocked'));
		if(locked) $(this.elements.wrappy).addClass('disabled'); else $(this.elements.wrappy).removeClass('disabled'); 
		this.state.locked = locked;
		return this;
	},
	hide: function(hidden) { 
		if(hidden) $(this.elements.wrappy).hide(); else $(this.elements.wrappy).show();
		this.state.hidden = hidden;
		return this; 
	},

	// sub controls callbacks
	ldown: function() { return true; /* propagates to screen scrolling */ },
	lclick: function() { 
		if(this.tip) this.tip.quit();
		if(this.state.locked) { if(this.callbacks.onlocked) this.callbacks.onlocked.cb(this.c); } // click on a locked item 
			else if(this.callbacks.onlabel) this.callbacks.onlabel.cb(this.c); 
	},
	cdown: function() { return true; /* propagates to screen scrolling */ },
	cclick: function() { 
		if(this.tip) this.tip.quit(); 
		if(this.state.locked) { if(this.callbacks.onlocked) this.callbacks.onlocked.cb(this.c); } // click on a locked item 
			else if(this.callbacks.onlabel) this.callbacks.oncheck.cb(this.c); 
	}
}




function C_iCRESTA(eid, callbacks, options, preset) { // multiple or single selection according to mode
	
	// preset.skin: [ 0 = radios, 1 = checkboxes ]
	// preset.mode: [0 = empty may, 1 = empty may not, -1 = only one must]
	// preset.reset: [0 = clear all, 1 = set all] defines the reset() function behaviour, weather it checks all or none, depending on mode
	// preset.emptypost: [free value] defines the return value of the getpost() when nothing is selected
	
	// options are expected like { count:5, order:[0:v1, 1:v2, ...], labels:[v1:'label1', v2:'label2, ...], presets:[v1:{checked:true, highlight:true, locked:false}, v2:,...] }	
	// options presets can be boolean or detailed { v1:{checked:true, highlight:true, locked:false}, v2:true, v3: , ... }
	// 

	this.state = C_iCRESTA.defauts.align(preset = preset||{}); 
	this.eids = { eid:eid, title:eid+'_title' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onchange: }
	this.items = new A_ct(); // we fill this A_ct with one instance of C_iTEM for each option
	this.options = this.makeitems(options, preset.value); 
	let title = this.state.title?new C_iCLIK(this.eids.title,{click:new A_cb(this, this.ontitle)},{ui:this.state.title, tag:'div'}):false;
	let table = new C_iTABLE(this.eids.eid, this.items, {maxrows:preset.maxrows, maxcols:preset.maxcols});
	this.controls = new A_ct({title:title, table:table});
	if(this.state.locked) this.lock(undefined, this.state.locked); // locks all options
}
C_iCRESTA.defauts = new A_df({ locked:false, reset:0, emptypost:'-', postmode:'join', skin:1, mode:1, maxcols:4, maxrows:12, title:false, flip:false });
C_iCRESTA.prototype = {
	// public
	display: function(css) { // display with top/bottom mode: <div>title</div><table>control</table>
		this.items.reset();
		
		if(vbs) vlog('controls.js','C_iCRESTA','display','title:'+this.state.title);
		css = css||'';
		// prepare the title
		let title = this.controls.title? this.controls.title.display('select-header textcolor-light '+css) : '';
		
		return title+this.table(css);
	},
	labelled: function(english, css) { // an alternative way to display by returning <td>title</td><td>control</td>
		let control = '<td>'+this.table(css)+'</td>';
		let label = '<td class="label textcolor-light" style="white-space:nowrap; text-align:right; vertical-align:top;">'+C_XL.w(english)+'</td>';
		return label+control;
	},
	activate: function() { 
		if(vbs) vlog('controls.js','C_iCRESTA','activate','title:'+this.state.title+', labels count:'+this.options.count+', value:'+this.getpost());
		// this.items.activate();
		this.controls.activate();
		this.elements.collect(this.eids);
		return this;
	},
	lock: function(v, onoff) {
		if(!v) 
			for(let x in this.options.order) this.items[x].lock(onoff); // lock every options
		else 
			for(let x in this.options.order) if(this.options.order[x]==v) this.items[x].lock(onoff); // loop is necessary as multiple labels may have the same value
		return this;
	},
	enable: function(v) { return this.lock(v, false); },
	disable: function(v) { return this.lock(v, true); },
	docheck: function(v, onoff, options) { // value is a scalar value OR an array of values like [32, 45, 64]
		
		options = options || { callback:true, reset:false };
		
		let feedbacked = true;
		if(this.state.mode==-1) { // only one value, set this value
			for(let x in this.options.order) 
				if(this.options.order[x]==v)
					{ this.oncheck(x); feedbacked = false; break; } 
			if(vbs) vlog('controls.js','C_iCRESTA','docheck','title:'+this.state.title+', mode:'+this.state.mode+', onoff:'+onoff+', unique value:'+v);
		} else {
		
			if(onoff !== undefined) onoff = !!onoff; 
			// so you can pass 5, 6, or 0, but also true or false, if you pass nothing, it acts like if you push the checker
			if(typeof(v) != 'object') v = [v];
			if(options) if(options.reset) this.reset();
			
				let verbose = [];
			for(let i in v) {
				verbose.push(v[i]);
				for(let x in this.options.order) if(this.options.order[x]==v[i]) 
					switch(onoff) {
						case undefined: this.oncheck(x); feedbacked = false; break;
						case true: case false: this.check(x, onoff); break;
					}
			}
			if(vbs) vlog('controls.js','C_iCRESTA','docheck','title:'+this.state.title+', mode:'+this.state.mode+', onoff:'+onoff+', values:'+verbose.join(','));
		}
		if(feedbacked) if(options.callback) if(this.callbacks.onchange) this.callbacks.onchange.cb(this.getvalue());
		return this;
	},
	highlight: function(v, onoff, options) {
		if(vbs) vlog('controls.js','C_iCRESTA','highlight','title:'+this.state.title+', onoff:'+onoff, v);
		if(typeof(v) != 'object') v = [v];
		for(let i in v)
			for(let x in this.options.order) if(this.options.order[x]==v[i]) 
				switch(onoff) {
					case undefined: case true: this.high(x, true); break;
					case false: this.high(x, false); break;
				}
	},
	reset: function(newvalues, options) {
		
		options = options || { callback:true };
		
		// the behaviour of this reset() is ruled by the state.reset option and the state.mode option
		this.highall(false);
		
		let vnv = false; // valid new values (check that at least one 'to check' value is part of the options)
		for(let i in newvalues) {
			let nv = newvalues[i];
			for(let x in this.options.order) 
				if(this.options.order[x]==nv) { vnv = true; break; }
			if(vnv) break;
		} 
			let verbose = []; for(let i in newvalues) verbose.push(newvalues[i]);
			if(vbs) vlog('controls.js','C_iCRESTA','reset','title:'+this.state.title+', mode:'+this.state.mode+', values:'+(verbose.length?verbose.join(','):'none'));
		
		if(vnv) {
			this.checkall(false);
			return this.docheck(newvalues, true, options);
		}
		
		if(this.state.reset == 1) // sets all in case of reset (but does not overule the mode)
			switch(this.state.mode) { 
				case 0: case 1: this.checkall(true); break;
				case -1: if(this.options.order.length) this.check(0,true); break;
			}
		if(this.state.reset == 0) // reset all in case of reset (but does not overule the mode)
			switch(this.state.mode) { 
				case 0: this.checkall(false); break;
				case 1: case -1: 
					this.checkall(false);
					if(this.options.order.length) this.check(0,true);
					break;
			}
		if(options.callback) if(this.callbacks.onchange) this.callbacks.onchange.cb(this.getvalue());
	},
	prevent: function() { // only checked options remain enabled, others are disabled
		if(vbs) vlog('controls.js','C_iCRESTA','prevent','title:'+this.state.title+', mode:'+this.state.mode);
		for(let x in this.options.order) this.items[x].lock(!this.isckecked(x));
	},
	hide: function(v, dohide) {
		if(vbs) vlog('controls.js','C_iCRESTA','hide','title:'+this.state.title+', onoff:'+onoff, v);
		if(typeof(v) != 'object') v = [v];
		for(let i in v)
			for(let x in this.options.order) if(this.options.order[x]==v[i]) 
				switch(onoff) {
					case undefined: case true: this.hide(x, true); break;
					case false: this.hide(x, false); break;
				}		
	},
	
	// public: read status
	getpost: function(names) {
		
		if(names) { // names like {0:'urgent', 1:'vip'}  
			let post = {};
			for(let x in names) 
				if(x in this.options.order) // x is the position <=> scary when options are sorted ! see (*gv*)
					post[names[x]] = this.isckecked(x) ? 1 : 0;
			return post; // like ['urgent'=>1, 'vip'=>0]
		}
		let checked = this.getvalue(); 
		if(this.state.mode==-1) return checked; // only one value may and must;
		if(checked.length==0) return this.state.emptypost; // none option selected
		switch(this.state.postmode) {
			case 'bitmap': let bm=0; for(let x in checked) bm|=checked[x]; return bm;
			case 'join': return checked.join('!'); // like '6532!4587!6587' which is the list of checked values
		}
	},
	getstates: function(names) { // names is an array like ['smodexcp','smodeovd'], returns check value according to order, see (*gv*)
		let post = {};
		if(names) { // returns checked state for given names only, return like { smodexcp: 0 }
			for(let y in names) 
				for(let x in this.options.order) 
					if(this.options.order[x]==names[y])
						post[names[y]] = this.isckecked(x) ? 1 : 0;
			return post; // like ['urgent'=>1, 'vip'=>0]
		} 
		else { // returns checked state for all control options, return like { smodexcp: 0, smodeovd: 0, smodeagg: 0 }
			for(let x in this.options.order) 
				post[this.options.order[x]] = this.isckecked(x) ? 1 : 0;
			return post;
		}
	},
	getvalue: function(v) {
		if(this.state.mode==-1) // only one value is selected, return this value
			for(let x in this.items.get) if(this.isckecked(x)) return this.options.order[x];
			
		if(v!==undefined) { // v is the only value of concern for the caller
			for(let x in this.options.order) if(this.options.order[x]==v) return this.isckecked(x);
			return undefined;
		}
		
		// for all other cases, return an array with checked values
		let checked = new Array(); 
		for(let x in this.items.get) if(this.items[x].state.checked) checked.push(this.options.order[x]);
		return checked; // like [v1, v4, v5] (a regular array indexed from 0, with array values being the checked values)
	},
	setting: function(options) { // returns all setting, like { valueA:1, valueB:0, valueC:1 } or (if options.byorder == true) like { 0:1, 1:0, 2:1 }
		options = options||{};
		let setting = [];
		if(options.byorder) for(let x in this.options.order) setting[x] = this.isckecked(x)?1:0;
		else for(let x in this.options.order) setting[this.options.order[x]] = this.isckecked(x)?1:0;
		return setting;
	},
	hasvalue: function(v) {
		return (v in this.options.labels); 
	},
	count: function(v) { return this.options.count; },
	
	// public: modify the control options after it was displayed
	add: function(value, label, optionpreset) { // add one more label
		optionpreset = optionpreset || {}; // like { tip:C_iTIP, onlabel:A_cb, sortrule:function(a,b) { return (labels[a]>labels[b])?1:-1; }; }
		this.options.order.push(value);
		this.options.labels[value] = label;
		this.options.count = this.options.order.length;
			let position = this.options.count-1; // adds this new option in last position
		this.additem(value, label, position, optionpreset);
		if(vbs) vlog('controls.js','C_iCRESTA', 'add','label:'+label+', value:'+value+', position:'+position);
		this.refresh();
	},
	clear: function(newoptions) { // remove all options, if newoptions are passed it puts the new options in place
		if(vbs) vlog('controls.js', 'C_iCRESTA', 'clear','');
		this.options = { labels:[], order:[], presets:[], count:0 };
		this.items = new A_ct();
		if(newoptions) this.options = this.makeitems(newoptions);
		this.controls.table.refresh(this.items);
	},
	
	// private 
	
	table: function(css) { // displays the checker control part (not the title)
		let skin = this.state.skin ? 'checks' : 'radios';
		let flipped = this.state.flip ? ' flipped' : '';
			css = css || '';
		let table = this.controls.table.display(css+' '+'cresta-table '+skin+flipped);
		return table;
	},
	
	count1: function() { let c = 0; for(let i in this.items.get) if(this.items[i].state.checked) c++; return c; },
	count0: function() { let c = 0; for(let i in this.items.get) if(!this.items[i].state.checked) c++; return c; },
	count2: function() { let c = 0; for(let i in this.items.get) if(this.items[i].state.highlight) c++; return c; },
	countX: function() { let c = 0; for(let i in this.items.get) c++; return c; }, // why not this.options.order.length ?
	
	// private
	countactives: function() { let c = 0; for(let i in this.items.get) if(this.items[i].state.checked && !this.items[i].state.locked) c++; return c; },
	checkall: function(onoff) {	for(let i in this.items.get) this.check(i, onoff); return this; },
	check: function(x, onoff) { if(this.islocked(x)) return this; this.items[x].check(onoff); return this; },
	high: function(x, onoff) { this.items[x].highlight(onoff); return this; },
	hide: function(x, onoff) { this.items[x].hide(onoff); return this; },
	highall: function(onoff) { for(let i in this.items.get) this.items[i].highlight(onoff); return this; },
	islocked: function(x) { return this.items[x].state.locked; },
	isckecked: function(x) { return this.items[x].state.checked; },
	
	// private: add options and display refresh
	makeitems:function(options, value) {
	
		// fix simple options 
		if(!options.order) { options.order = []; for(let i in options.labels) options.order.push(i); } // then make the order from the labels list (depending on the browser, the creation sequence in labels is OR IS NOT respected)
		if(!options.count) options.count = options.order.length;

		// presets
		if(!options.presets) // presets are not existing under this form
			if(this.state.mode==-1) // one only must
				if(value!==undefined) // this preset comes through a member 'value'
					{ options.presets = [], options.presets[value] = true; }
		options.presets = options.presets || {};
			
		// controls	
		for(let x in options.order) { 
				let v = options.order[x];
				let l = options.labels[v];
			this.additem(v, l, x, options.presets[v]||{} ); // options.presets[v] can be a boolean of a preset object like 
		}
		return options;
	},
	additem: function(v, l, x, optionpreset) {
		optionpreset = optionpreset || {}; // like { tip:C_iTIP, onlabel:A_cb, sortrule:function(a,b) { return (labels[a]>labels[b])?1:-1; }; }
			if(!(typeof optionpreset === 'boolean'))
				if(!(skin in optionpreset)) optionpreset.skin = this.state.skin;
			let onlabel = optionpreset.onlabel || new A_cb(this, this.onlabel); // specifying an own event on label overrules the standard behaviour
		if(this.state.flip) optionpreset.flip = true;
		let label = new C_iTEM(this.eids.eid, { onlabel:onlabel, oncheck:new A_cb(this, this.oncheck), onlocked:optionpreset.onlocked }, x, l, optionpreset);
		this.items.add1(label, x);
	},
	refresh: function(only) { // optional when you want to refresh a label: {id:id, label:label, tip:tip}
		only = only||{};
		if(vbs) vlog('controls.js', 'C_iCRESTA', 'refresh','id:'+(only.id?only.id:'none'));
		if(only.id) { // you pass here when the user clicked an item, so opened a modal, and he saves it
			this.options.labels[only.id] = only.label; // fix this.options
			let items = this.items.get;
			for(let x in this.options.order) 
				if(this.options.order[x] == only.id) items[x].setlabel(only.label).newtip(only.tip);
			return;
		}
		this.controls.table.refresh();
	},
	
	// callbacks
	ontitle: function() {
		let c = this.count1();
		switch(this.state.mode) {
			case 0: this.checkall(!c); break;
			case 1: this.checkall(!(c-1)); if(!this.count1()) this.check(0,true); break;
			case -1: this.checkall(false).check(0,true); break;
		}
		if(vbs) vlog('controls.js','C_iCRESTA','ontitle','mode:'+this.state.mode);
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.getvalue(),'title');
	},
	onlabel: function(x) {
		let v = this.options.order[x];
		this.checkall(false).check(x,true);
		if(vbs) vlog('controls.js','C_iCRESTA', tab+'onlabel','index:'+x+', value:'+v+', mode:'+this.state.mode);
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.getvalue(), 'label', v);
	},
	oncheck: function(x) {
		let v = this.options.order[x];
		switch(this.state.mode) {
			case -1: return this.onlabel(x);
			case 1: if(this.count1()==1 && this.isckecked(x)) break; // you do not remove the last stander
			case 0: this.check(x, !this.isckecked(x)); break;
		}
		if(vbs) vlog('controls.js','C_iCRESTA','oncheck','index:'+x+', value:'+v+', mode:'+this.state.mode);
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.getvalue(), 'checker', v);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   
//  C O N F I R M     P O P     U P     M O D A L 
//
function C_iMSG(message, callbacks, preset) { // callbacks like { onChoice } 

		let base = 'msg_layer'+C_iMODAL.layer+'_';
	this.eids = { buttons:'modal_msg_layer_'+C_iMODAL.layer, b0:base+'b0', b1:base+'b1' };
	this.callbacks = callbacks || {};
	this.state = C_iMSG.defauts.align(preset);

	let custominteract = this.state.interactivity instanceof Object;
	let interactivity = { '1':'ok' }; // this is the default value: a single "ok" button
	if(custominteract) {
		interactivity = this.state.interactivity; // as defined by user, e.g. let interact = { 'quit':'quit anyway', 'stay':'chat stay' };
	} else
		switch(this.state.interactivity) { // here we have some common standard options
			case 'confirm':	interactivity = { '0':'cancel', '1':'confirm' }; break;
			case 'yesno': 	interactivity = { '0':'no', 1:'yes' }; break;
		} 
		
		
	// make meta data from chosen interactivity
		let cssclass = 'button-msg'; 
		let divstyle = 'padding:1em 1em; margin:1em 1em;';
	
		this.controls = [];
	for(let v in interactivity) {
			let m = interactivity[v];
			let bpreset = { tag:'div', css:cssclass, style:divstyle, ui:C_XL.w(m, {cap:1} ) };
		let b = new C_iCLIK(base+'_'+v, { click:new A_cb(this, this.click, v ) }, bpreset);
		this.controls[v] = b;
		
	}

	// display
	message = '<div class="modal-msg '+(this.state.css.body||'')+'" style="margin:0 0 2em 0;">'+message+'</div>';
	let buttons = '';
	
	for(let v in interactivity)
		buttons += this.controls[v].display();
	
	
	// final layout
			let left = '<td><div class="" style="min-width:80px; min-height:84px;"></div></td>';
			let right = '<td style="width:90%;">'+message+buttons+'</td>';
		
		let layout = '<table style="width:100%;" class="'+(this.state.css.image||'')+'"><tr>'+left+right+'</tr></table>';
	
	// activate
	this.modal = new C_iMODAL({body:layout}, { escape:new A_cb(this, this.escape) }, { size:this.state.size, fullscreen:is.newtouch } );
	
	for(let v in interactivity) this.controls[v].activate();
}
C_iMSG.defauts = new A_df( { interactivity:'ok', css:{image:'img-attention', body:false}, size:{x:400,y:''}, result:false} );
C_iMSG.prototype = {
	// public
	close: function(v) { // programmatic close command
		this.modal.close(); 
		this.state.result = v||0; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(this.state.result);
	},
	
	// callbacks
	click: function(value) { // one of the buttons has been clicked
		this.modal.close(); 
		this.state.result = value; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(value); 
	},
	escape: function() { // the modal has been escaped 
		this.state.result = 0; 
		if(this.callbacks.onChoice) this.callbacks.onChoice.cb(0); 
		return true; 
	}
}



// POPPING A MODAL FROM ANY ELEMENT (e.g. from a date <td> in a calendar <table>)
//
function C_iPOP(eid, callbacks, preset) { // pops a C_modal from a clickable item
	this.eids = { eid:eid, ui:eid+'_ui', label:eid+'_label', tds:{face:eid+'_td_face', label:eid+'_td_label'}
				/* is.newtouch */ , cartouche:eid+'_cart', overlay:eid+'_ovlay', report:eid+'_rpt' };
	this.elements = new A_el();
	this.callbacks = callbacks;
	this.state = C_iPOP.defaults.align(preset);
	
	let face = new C_iCLIK(this.eids.ui, { click:new A_cb(this, this.drop), dblclick:this.callbacks.dblclick }, preset  );
			
	this.controls = new A_ct({face:face});
	
	this.handlers = new A_hn();
	this.modal = false;	
}
C_iPOP.defaults = new A_df( { css:'', blind:false, position:{ side:{ui:false}, offset:{x:5,y:-50} } } );
C_iPOP.prototype = {
	display: function(css) {
		return this.controls.face.display(css);
	},
	labelled: function(english, css) {
			css = this.state.css+' '+(css||'');
		let range = '<td id="'+this.eids.tds.label+'">'+this.controls.face.display(css)+'</td>';
		let label = '<td id="'+this.eids.tds.face+'" class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td>';
		return label+range;
	},
	set:function(html, css) {
		if(!this.state.blind) this.controls.face.set(html, css);
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iPOP');
		this.state.position.side.ui = this.state.blind ? this.elements.eid : this.controls.face.elements.ui;
		return this;
	},
	close: function() {
		if(this.modal) this.modal.close();
		this.modal = false;
		if(is.newtouch) {
			$(this.elements.overlay).remove();
			if(this.callbacks.escape) this.callbacks.escape.cb();
		}
		return this;
	},
	scrollto: function(elm, options) {
		if(is.newtouch)
			$(this.elements.viewport).scrollTo(elm, options);
		else
			this.modal.scrollto(elm, options); // (*e01*) // webapp
		
	},
	
	//events
	drop: function() {
		let html = this.callbacks.enter.cb(); // html = { header:'html', body:'html'} fetch this part from instanciator object
		
		if(is.newtouch) { // touch device. We display options on a the full screen
			
			let cartouche = new C_iDQS(this.eids.cartouche, { onquit:new A_cb(this, this.close), onconfirm:new A_cb(this, this.confirmed) }, { remove:false, save:false } );
			
							let c = '<td id="'+this.eids.report+'">'+cartouche.display()+'</td>';
						let h1 = this.state.placeholder?this.state.placeholder:(this.state.label?C_XL.w(this.state.label):'');
					let title = '<td style="align:right;"><h1>'+h1+'</h1></td>';
				let row = '<tr>'+c+title+'</tr>';
			header = '<table summary="details" style="width:100%; padding:0 0 1em 0;">'+row+'</table>';
			
					let ovstyle = 'z-index:20; position:absolute; top:2.5em; bottom:0; width:100%; overflow:hidden;';
				let overlay = '<div class="touchdev-overlay" id="'+this.eids.overlay+'" style="'+ovstyle+'">'+header+'</div>';
			$('#body').append(overlay);
			
			this.elements.collect(this.eids);
			
			// display in a droppy that hangs at the input field corner
				let inner = '&nbsp;'; if(html.body) inner = html.body; // when inner is empty, the body div does not repond to the height:100% css rule
			this.modal = new C_iMODAL(
				{ body:inner, header:'' }, // header is intentionnally not empty, that forces the control to display it
				{ escape:new A_cb(this, this.close) }, 
				{ css:'touchdev', position:{ drop:{ui:this.elements.report}, offset:{x:0,y:5} } } 
			);

			cartouche.activate(); cartouche.enable(this.state.valid, 'confrm');

		} else { // web app
			
			this.modal = new C_iMODAL(
				{ header:html.header, body:html.body}, 
				{ escape:this.callbacks.escape }, 
				{ css:'pad', position:this.state.position, size:{maxy:'16em'} } 
			);
		}
		
		this.callbacks.popped.cb();
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   B U T T O N
//
function C_iBUTTON(eid, onpush, preset) {
	this.eids = { button:eid };
	this.callbacks = { onpush:onpush };
	this.elements = new A_el();
	this.handlers = new A_hn({down:new A_cb(this, this.down), up:new A_cb(this, this.up), leave:new A_cb(this, this.leave), enter:new A_cb(this, this.enter), onfocus:new A_cb(this, this.onfocus), blur:new A_cb(this, this.blur)});
	this.keys = { enter:new A_cb(this, this.enterkey) };
	this.controls = new A_ct({});
	this.state = new A_df(C_iBUTTON.defauts.align(preset)); // new A_df makes it an object that we can re-aling (see display function)
}
C_iBUTTON.track = false;
C_iBUTTON.defauts = new A_df( { enabled:true, hidden:false, focus:false, value:0, caption:'my button'
								, width:false, height:false, css:'', tabindex:false, busy:false, tip:false } );
C_iBUTTON.prototype = {
	display: function(preset) { // preset like {caption:'caption', width:4, height:4, css:'acss', tabindex:2, tip:'tiptext' }
		// this.state = this.state.align(preset);
			preset = preset||{};
			if(preset.caption) this.state.caption = preset.caption;
			if(preset.width) this.state.width = preset.width;
			if(preset.height) this.state.height = preset.height;
			if(preset.css) this.state.css = preset.css;
			if(preset.tip) this.state.tip = preset.tip;
		
		if(this.state.tip) this.controls.add1(new C_iTIP(this.eids.button, {text:this.state.tip, css:'tip'} ), 'tip');
		let tabindex = (this.state.tabindex) ? 'tabindex="'+this.state.tabindex+'"' : '';
		let css = 'button '+this.state.css;
		let width = this.state.width ? ' width:'+this.state.width+'em;' : '';
		let height = this.state.height ? ' height:'+this.state.height+'em;' : '';
		let hidden = this.state.hidden ? ' display:none;' : '';
		let button = '<input '+tabindex+' id="'+this.eids.button+'" type="button" value="'+this.state.caption+'" style="'+width+height+hidden+'" class="'+css+'"/>';
		return button;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.enable(this.state.enabled);
		this.controls.activate('C_iBUTTON');
	},	
	enable: function(onOff) { // can be called before or after activation
		this.state.enabled = !!onOff;
		if(this.elements.undefined('button')) return this;
		
		if(vbs) vlog('controls.js','C_iBUTTON','enable','caption='+this.state.caption+', enabled='+this.state.enabled); 
		
		$(this.elements.button).addClass('disabled');
		if(is.tactile) { this.elements.button.ontouchstart = undefined; this.elements.button.ontouchend = undefined; }
			else $(this.elements.button).unbind('mousedown').unbind('mouseup');
		C_KEY.unbind(C_KEY.code.s.enter, this.keys.enter);
			
		if(!this.state.enabled) return this;
		
		$(this.elements.button).removeClass('disabled');
		if(is.tactile) { this.elements.button.ontouchstart = this.handlers.down; this.elements.button.ontouchend = this.handlers.up; }
			else { $(this.elements.button).mouseup(this.handlers.up).mousedown(this.handlers.down).focus(this.handlers.onfocus).blur(this.handlers.blur); }			
		
		return this;
	},	
	busy: function(onOff) {
		this.state.busy = !!onOff;
		// this.enable(!onOff);
		if(!this.elements.button) return this; // not yet activated
		$(this.elements.button).removeClass('button-busy').attr('value', this.state.caption);
		if(onOff)
			$(this.elements.button).addClass('button-busy').attr('value', ' ');
		return this;
	},
	show: function(on) {
		if(on) $(this.elements.button).show(); else $(this.elements.button).hide();
		return this;
	},
	caption: function(caption) {
		if(this.elements.button) this.elements.button.value = caption;
		this.state.caption = caption;
		return this;
	},
	focus: function() {
		if(this.elements.button) $(this.elements.button).focus();
		return this;
	},
	
	// event handling
	down: function(e) { 
		if(this.state.busy) return false;
		$(this.elements.button).addClass('button-pushed'); 
		C_iBUTTON.track = this;
		if(is.tactile) return e.preventDefault();
			else $(this.elements.button).mouseleave(this.handlers.leave); 
		return false;
	},
	up: function(e) {
		if(this.state.busy) return false;
		if(is.tactile) e.preventDefault();
			else $(this.elements.button).unbind('mouseleave').unbind('mouseenter'); 
		if(C_iBUTTON.track) $(C_iBUTTON.track.elements.button).removeClass('button-pushed');	
		if(C_iBUTTON.track != this) return; // down and up are not on the same target
		C_iBUTTON.track = false;
		C_iTIP.handlers.quit();
		if(this.callbacks.onpush) this.callbacks.onpush.cb(this.state);
	},
	leave: function() {	// ensures coherent button animation
		$(this.elements.button).removeClass('button-pushed').mouseenter(this.handlers.enter); 
	},
	enter: function(e) { // ensures coherent button animation
		if(this.state.busy) return false;
		$(this.elements.button).unbind('mouseenter'); 
		if(C_iBUTTON.track==this) this.down(e);
	},
	enterkey: function() { C_iBUTTON.track=this; this.up(); },
	onfocus: function() { 
		if(this.state.enabled) new C_KEY(C_KEY.code.s.enter, this.keys.enter, 'C_iBUTTON::'+this.eids.button); 
		if(vbs) vlog('controls.js','C_iBUTTON','onfocus','caption='+this.state.caption+', enabled='+this.state.enabled); 
	},
	blur: function() { 
		C_KEY.unbind(C_KEY.code.s.enter, this.keys.enter); 
		if(vbs) vlog('controls.js','C_iBUTTON','blur','caption='+this.state.caption+', enabled='+this.state.enabled); 
	}
}

// some default buttons
C_iBUTTON.standard = function(eid, onpush, caption) {
	let preset = {};
	switch(caption) {

		/* Still in use, but should be replaced by a simple C_iCLIK */
		case 'archive': 	preset = { enabled:true, focus:false, caption:C_XL.w('archive')[0], width:2, height:1.8, css:'button-cartouche c98', tabindex:false, busy:false, tip:C_XL.w('archive') }; break;
		case 'chatquit': 	preset = { enabled:true, focus:false, caption:C_XL.w('chatquit')[0], width:2, height:1.8, css:'button-cartouche c98', tabindex:false, busy:false, tip:C_XL.w('chatquit') }; break;
		
		case 'plus': 		preset = { enabled:true, focus:false, caption:'+', width:2, height:1.8, css:'button-cartouche button-plus', tabindex:false, busy:false, tip:C_XL.w('add') }; break;
		
		default: 			preset = { enabled:true, focus:false, caption:C_XL.w('caption')[0], width:2, height:1.8, css:'button-cartouche button-'+caption, tabindex:false, busy:false, tip:C_XL.w('caption') }; break;
	}
	C_iBUTTON.call(this, eid+'_'+caption, onpush, preset); // inheritage
}
C_iBUTTON.standard.prototype = C_iBUTTON.prototype;




//////////////////////////////////////////////////////////////////////////////////////////////
//   O N - O F F      B U T T O N
//
function C_iONOFF(eid, callbacks, preset) {
	this.eids = { onoff:eid+'_onoff' };
	this.callbacks = callbacks; // { onswitch: }
	this.elements = new A_el();
	this.status = C_iONOFF.defaults.align(preset);
	
	// let cursor = '<div class="cursor fa fa-13x fa-circle"></div>';
		let cursor = '<div class="cursor"></div>';
	let onoff 	= new C_iCLIK(this.eids.onoff, { click:new A_cb(this, this.onswitch) }
		, { enabled:preset.enabled, tip:preset.tip||false, css:'switch', ui:cursor, tag:'div' });

	this.controls = new A_ct({onoff:onoff});
}
C_iONOFF.defaults =  new A_df( { value:1, state:true, mandatory:false } );
C_iONOFF.prototype = {
	
	// public
	display: function(css) {
		let onoff = this.controls.onoff.display(css||'');
		return onoff;
	},
	labelled: function(label, css, options) { // css applies to label
		css = css || '';
		options = options || { table:false, reverse:false, xl:true, cap:true };
		label = options.xl?C_XL.w(label, {cap:options.cap}):label;
		
		let range = '<td>'+this.controls.onoff.display()+'</td>';
		let caption = '<td class="label textcolor-light '+css+'" style="white-space:nowrap; text-align:right;">'+label+'</td>';
		let packg = options.reverse?range+caption:caption+range; // setting followed by caption or caption followed by setting
		if(options.table) return '<table style="display:inline-block;"><tr>'+packg+'</tr></table>';
		else return packg;
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iONOFF','activate','eid:'+this.eids.onoff);
		this.controls.activate('C_iONOFF');
		this.set();
	},
	enable: function(enabled) {
		if(vbs) vlog('controls.js','C_iONOFF','enable','enabled:'+enabled);
		this.controls.onoff.enable(enabled);
		return this;
	},
	value: function() { return this.status.state?this.status.value:0; },
	getpost: function() { return this.status.state?this.status.value:0; },
	
	// private
	set: function(onoff) {
		if(onoff!==undefined) this.status.state = onoff;
		if(this.status.state) this.controls.onoff.set(false,'switch-on');
			else this.controls.onoff.set(false,'switch-off');
		if(this.status.mandatory) this.controls.onoff.setvalid(this.status.state);
		if(this.callbacks.onswitch) this.callbacks.onswitch.cb(this.value());
		if(vbs) vlog('controls.js','C_iONOFF','set','status:'+this.status.state);
		return this;
	},
	
	// event handlers
	onswitch: function() {
		this.status.state = !this.status.state;
		if(vbs) vlog('controls.js','C_iONOFF','onswitch','status:'+this.status.state);
		this.set();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   D E L E T E    -   Q U I T    -   S A V E  -  V A L I D 
//
function C_iDQS(eid, callbacks, preset) {
	this.eids = { remv:eid+'_rmv', quit:eid+'_qt', save:eid+'_sav', confrm:eid+'_cfm' };
	this.callbacks = callbacks; // { onsave: , ondelete:, onquit:, onconfrm: }
	this.elements = new A_el();
	this.state = C_iDQS.defaults.align(preset);
	
	
		let removekbshorcut = this.state.removekbshorcut ? [C_KEY.code.s.ctrl+C_KEY.code.s.backspace /*MAC standard*/] : false; 
	
	let remove 	= new C_iCLIK(this.eids.remv, { click:new A_cb(this, this.remove) }
		, { enabled:this.state.remove, tip:C_XL.w('tip delete'), css:'modal-button fa fa-gray fa-trash-alt touch-black', tag:'div', style:''
		, keys:removekbshorcut });
		
	let quit 	= new C_iCLIK(this.eids.quit, { click:new A_cb(this, this.quit) }
		, { enabled:this.state.quit, tip:C_XL.w('tip quit'), css:'modal-button fa fa-gray fa-close touch-red', tag:'div'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.z /*Windows standard*/, C_KEY.code.s.ctrl+C_KEY.code.alpha.q] /* escape is already defined by modal! */ });
	
	let save 	= new C_iCLIK(this.eids.save, { click:new A_cb(this, this.save) }
		, { enabled:this.state.save, tip:C_XL.w('tip save'), css:'modal-button fa fa-gray fa-cloud-upload touch-green', tag:'div'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.enter, C_KEY.code.s.ctrl+C_KEY.code.alpha.s /*Windows standard*/] });
		
	let confrm 	= new C_iCLIK(this.eids.confrm, { click:new A_cb(this, this.confirmed) }
		, { enabled:this.state.confrm, tip:C_XL.w('tip confrm'), css:'modal-button fa fa-gray fa-check touch-green', tag:'div'
		, keys:[C_KEY.code.s.ctrl+C_KEY.code.s.enter] });
	
	this.controls = new A_ct({ remove:remove, quit:quit, save:save, confrm:confrm });
}
C_iDQS.defaults =  new A_df( { remove:true, quit:true, save:true, confrm:false, removekbshorcut:true } );
C_iDQS.prototype = {
	// public
	display: function() {
		this.controls.reset();
		
			let remove = this.controls.remove.display();
			let quit = this.controls.quit.display();
			let save = this.controls.save.display();
			let confrm = this.controls.confrm.display();
		return remove+quit+save+confrm;
	},
	activate: function() {
		this.controls.activate('C_iDQS');
	},
	enable: function(onOff, which) { // global disabling for all buttons, enabling restores the setting in this.status
		if(which)
			switch(which) { // is used to change the initial setting of buttons
				case 'remove': this.controls.remove.enable(this.state.remove = onOff); return this;
				case 'quit': this.controls.quit.enable(this.state.remove = onOff); return this;
				case 'save': this.controls.save.enable(this.state.save = onOff); return this;
				case 'confrm': this.controls.confrm.enable(this.state.confrm = onOff); return this;
				default: return this;
			}
		else { // is used while a modal is busy, so not to trigger those buttons while programmatic is ongoing
			
			let buttons = this.controls.get;
			if(onOff===undefined) for(let c in buttons) buttons[c].enable(this.state[c]); // enables according to initial state
			else for(let c in buttons) buttons[c].enable(onOff&&this.state[c]); // enables all according to provided onOff
		}
	},
	failuremsg: function() {
		return new C_iMSG(C_XL.w('connection failed'));
	},
	hide: function(which, onOff) {
		
		if(which in this.controls.get) this.controls.get[which].show(!onOff);
	},
	
	// event handlers
	remove: function() {
		new C_iMSG(C_XL.w('delete confirm'), { onChoice:new A_cb(this, this.removeChoice) }, { interactivity:'confirm' } );
		return false;
	},
	removeChoice: function(v) { // confirmation response
		if(v=='1') if(this.callbacks.ondelete) this.callbacks.ondelete.cb();
		return false;
	},
	
	quit: function() {
		if(this.callbacks.onquit) this.callbacks.onquit.cb();
		return false;
	},
	save: function() {
		if(this.callbacks.onsave) this.callbacks.onsave.cb();
		return false;
	},
	confirmed: function() {
		if(this.callbacks.onconfirm) this.callbacks.onconfirm.cb();
		return false;
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   D R O P     D O W N     M E N U    (using C_iMENU and C_iCLIK, no check box possible)
//
function C_iDDWN(eid, callbacks, options, preset) {
		preset  = preset || {};
	this.eids = { face:eid+'_face', menu:eid+'_mnu', tdlabel:eid+'_lbl', tdddwn:eid+'_drp'
					/* is.newtouch */ , cartouche:eid+'_cart', overlay:eid+'_ovlay', report:eid+'_rpt'	};	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onselect, dblclick }
	this.state = C_iDDWN.defaults.align(preset);
	this.options = options;
		let ui; 
		if(this.state.frozenui) {  // in frozen ui mode, the chosen value label does not display on the control face
			ui = this.state.frozenui; preset.tag = preset.tag || 'span'; 
		}
		else ui = options.labels[this.state.value] || this.state.invite; 
		
		let face = new C_iCLIK(this.eids.face, { down:new A_cb(this, this.facedown), click:new A_cb(this, this.drop), dblclick:this.callbacks.dblclick }, { tip:preset.tip, enabled:preset.enabled, tag:(preset.tag||'input'), css:preset.css, style:preset.style, ui:ui }  );
		let menu = new C_iMENU(this.eids.menu, { onlabel:new A_cb(this, this.onlabel), onarrow:new A_cb(this, this.onarrow) }, options, { value:preset.value, maxcols:preset.maxcols, maxrows:preset.maxrows, title:false, tabselect:true } );
	this.controls = new A_ct({face:face, menu:menu});
}
C_iDDWN.defaults = new A_df({ value:undefined, highlight:false, autoclose:true, mandatory:false, hidden:false, invite:'?', frozenui:false, escape:'feedback', nested:false });
C_iDDWN.prototype = {
	// public
	display: function(css) {
		return this.controls.face.display(css||'');
	},
	labelled: function(label, css, options) {
		options = options || { xl:true, cap:true };
		label = options.xl?C_XL.w(label, {cap:options.cap}):label;

		let range = '<td id="'+this.eids.tdlabel+'">'+this.controls.face.display(css||'alpha12')+'</td>';
		let caption = '<td id="'+this.eids.tdddwn+'" class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+label+'</td>';
		return caption+range;
	},
	activate: function() {
		this.controls.activate();
		this.elements.collect(this.eids);
		if(this.state.mandatory) this.setvalid();
		this.hide(this.state.hidden);
	},
	getpost: function() { return this.state.value; },
	value: function() { return this.state.value; },
	set: function(value, nofeedback) { 
		let ui;
		if(!this.state.frozenui) {
			if(!(value in this.options.labels)) {
				value = undefined; 
				ui = this.state.invite;
			} else
				ui = this.options.labels[value];
			this.controls.face.set(ui);
		}
		this.state.value = value;
		if(value) this.controls.menu.select(value, true, {reset:true});
		if(!nofeedback) if(this.callbacks.onselect) this.callbacks.onselect.cb(value);
		return this;
	},
	lock: function(values, on, options) { // options like {reset:true}
		this.controls.menu.lock(values, on, options);
	},
	enable: function(onoff) {
		this.controls.face.enable(onoff);
		return this;
	},
	isopen: function() { return !!this.modal; },
	busy: function(onoff) { // face field appears "busy"
		this.controls.face.busy(onoff); return this;
	},
	hide: function(dohide) {
		let td1 = this.elements.tdlabel;
		if(dohide) $(td1).parents('tr').hide(); else $(td1).parents('tr').show();
	},
	
	// private
	facedown:function() { return false; /*!this.state.nested; /* prevents propagation, nested should be true when this control is nested inside another C_iCLIK */	},
	drop:function() { // why is this not included in the C_iMENU  ?? 
		
		if(is.newtouch) { // touch device. We display options on a the full screen
			
			let cartouche = new C_iDQS(this.eids.cartouche, { onquit:new A_cb(this, this.quit)}, { remove:false, save:false } );
			
							let c = '<td id="'+this.eids.report+'">'+cartouche.display()+'</td>';
						let h1 = this.state.placeholder?this.state.placeholder:(this.state.label?C_XL.w(this.state.label):'');
					let title = '<td style="align:right;"><h1>'+h1+'</h1></td>';
				let row = '<tr>'+c+title+'</tr>';
			header = '<table summary="details" style="width:100%; padding:0 0 1em 0;">'+row+'</table>';
			
					let ovstyle = 'z-index:20; position:absolute; top:2.5em; bottom:0; width:100%; overflow:hidden;';
				let overlay = '<div class="touchdev-overlay" id="'+this.eids.overlay+'" style="'+ovstyle+'">'+header+'</div>';
			$('#body').append(overlay);
			
			this.elements.collect(this.eids);
			
			// display in a droppy that hangs at the input field corner
			this.modal = new C_iMODAL(
				{ body:this.controls.menu.display() }, // header is intentionnally not empty, that forces the control to display it
				{ escape:new A_cb(this, this.escape) }, 
				{ css:'touchdev', position:{ drop:{ui:this.elements.report}, offset:{x:0,y:5} }, size:{maxy:'18em'} } 
			);

			cartouche.activate(); cartouche.enable(this.state.valid, 'confrm');

		} else { // web app
		
			this.modal = new C_iMODAL(
				{ body:this.controls.menu.display() }, 
				{ escape:new A_cb(this, this.escape), scrollstart:new A_cb(this, this.scrollstart) }, 
				{ css:'pad', 
				  position:{ drop:{ui:this.controls.face.elements.ui}, offset:{x:1,y:1} }, 
				  size:{maxy:'15em'} 
				 } 
			);
		}
		
		this.controls.menu.activate();
		if(this.state.value) this.controls.menu.select(this.state.value, true);
		this.scrollto(this.state.value);
	},
	scrollto: function(value) {
		let el = this.controls.menu.getelement(value); // (*e01*)
		if(el) this.modal.scrollto(el, { axis:'y', offset:-100 });
		return this;
	},
	setvalid: function() {
		let onoff = true;
		if(typeof(this.state.mandatory)==='function') onoff = this.state.mandatory(this.state.value);
		else if(this.state.mandatory instanceof A_cb) onoff = this.state.mandatory.cb(this.state.value);
			else onoff = !!this.state.value; // valid when different from zero
		this.controls.face.setvalid(onoff);
	},
	quit: function() { // only on smartphones
		this.modal.close();
		return this.escape();
	}, 
	escape: function() {
		if(vbs) vlog('controls.js','C_iDDWN','escape','');
		if(is.newtouch) $(this.elements.overlay).remove();
		if(this.state.escape=='feedback') this.feedback();
		this.modal = false;
		return true;
	},
	scrollstart: function() {
		if(vbs) vlog('controls.js','C_iDDWN','scrollstart','');
		// C_iCLIK.state.down = false; /* cancels an option click if your finger slides over an option td */ 
	},
	onarrow: function(v,el) { 
		if(v!==false) return this.scrollto(v); 
		else if(this.modal) this.modal.close();
	},
	feedback: function() {
		if(this.callbacks.onselect) this.callbacks.onselect.cb(this.state.value);
	},
	onlabel: function(value) {
		this.controls.menu.select(this.state.value=value, true, {reset:true});
			let ui = this.options.labels[this.state.value] || '?';
		if(!this.state.frozenui) this.controls.face.set(ui); 
		if(this.state.mandatory) this.setvalid();
		if(this.state.autoclose) { 
				if(this.modal) this.modal.close(); 
				this.modal = false; 
				if(is.newtouch) $(this.elements.overlay).remove();
				this.feedback(); 
			}
			else if(this.callbacks.onselect) this.callbacks.onselect.cb(value);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G    A    L A N G U A G E
//
function C_iSPEAK(eid, callbacks, preset) {
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSPEAK.defaults.align(preset);
	
		let options = C_iSPEAK.options(preset);
	let ddwn = new C_iDDWN(this.eids.ddwn, callbacks, options, preset );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iSPEAK.defaults = new A_df({});
C_iSPEAK.prototype = {
	// public
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	set: function(v) { if(v in mobminder.language.names) this.controls.ddwn.set(v); return this; },
	getpost: function() { return this.controls.ddwn.getpost(); }
}
C_iSPEAK.options = function(preset) { // miscellaneous like { exclude:screen to be excluded from list, include:[misc options] }
	
	let labels = mobminder.language.names; // (*ml*)
	let presets = [];
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);

	if(preset.maynone) {
		labels = omerge(labels, { 255:C_XL.w('none') } ); // in this case you may select "none" for the language (see alternative language in sms and email templates)
		order.push(255); // put this option at bottom of list
	}
	
	let count = order.length;
	
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G    A N    S M S  G A T E A W A Y 
//
function C_iSMSGateAway(eid, callbacks, preset) {
		preset  = preset || {}; // like maynone:false, smsgateaway:'shortcode', encoding:'ascii7', priority:0
		let b = eid+'_smsga'+'_';
	this.eids = { smsga:b+'_sga', encod:b+'_enc', prior:b+'_pri', mpage:b+'_pgs', iact:b+'_iact', auto:b+'_iamsg'
				, own: { mcounter:b+'_mcnt' } 
				, buttons: { outbound:b+'_out', inautorep:b+'_in' } };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSMSGateAway.defaults.align(preset);
	
	// outbound
	let o;
		o = C_iSMSGateAway.options(preset);
	let smsga = new C_iDDWN(this.eids.smsga, { onselect:new A_cb(this, this.onsmsga) }, o, { value:preset.smsgateaway } );
	
			let a7tip = '<b>Specials chars are limited to the following:</b></br>&nbsp;<br/>'; // +ascii7.tip;
		o = { labels:{ ascii7:'ascii7 (153 chars/page)', ucs2:'ucs2 (67 chars/page)' }, presets: { ascii7:{tip:a7tip}, ucs2:{tip:'allows any exotic chars including emoji\'s'} } };
	let encod = new C_iDDWN(this.eids.encod, { onselect:new A_cb(this, this.onencoding) }, o, { value:preset.encoding } );
	
		o = { labels:{ 0:'normal', 1:'high' } }
	let prior = new C_iDDWN(this.eids.prior, { onselect:new A_cb(this, this.onpriority) }, o, { value:preset.priority } );
	
		// mpage is the max number allowed SMS pages. It is stored in DB table along with other SMS template settings. See (*mp01*)
		
		o = { labels:{ 1:'1 page', 2:'2 pages', 3:'3 pages', 4:'4 pages', 6:'6 pages', 8:'8 pages', 10:'10 pages' } }
	let mpage = new C_iDDWN(this.eids.mpage, { onselect:new A_cb(this, this.onmpage) }, o, { value:preset.mpage, enabled:mobminder.context.surfer.is.atleast.seller } );
	
	// let mpage = new C_iONOFF(this.eids.mpage, { onswitch:new A_cb(this, this.onmpage) }, { state:preset.mpage, enabled:mobminder.context.surfer.is.atleast.seller } );

	// inbound
		o = { labels:{ ignore:'Discard and ignore', frwdemail:'Forward to account email', frwdmobile:'Forward to account mobile' } } // see (*sg08*)
	let inbactn = new C_iDDWN(this.eids.iact, { onselect:new A_cb(this, this.onaction) }, o, { value:preset.inboundaction } );
	
		let p = { digits:preset.autoreplymsg, type:INPUT_SMSAREA, mandatory:false };
	let automsg = new C_iFIELD(this.eids.auto, 	{ onffocus:new A_cb(this, this.msgfocus), onfchange:new A_cb(this, this.msgchange) }, p); // (*m11*)  we limit the size here to 140 so to anticipate the mgnification of fusion fields

	// test buttons
	
			let recepient = mobminder.context.surfer.mobile;
			let enabled = true;  if(!recepient) { recepient = 'no mobile in login';  enabled = false; }
			let iconrow = '<tr><td style="vertical-align:bottom;"><div class="fa-gray fa-17x fa fa-broadcast-tower"></div></td></tr>';
			let captrow = '<tr><td style="vertical-align:top;" class="small" id="'+this.eids.stblistcaption+'">'+recepient+'</td></tr>';
		let caption = '<table style="height:100%; width:100%;">'+iconrow+captrow+'</table>';
	let outbound = new C_iCLIK(this.eids.buttons.outbound, { click:new A_cb(this, this.smstest, 'outbound') }
		, {   tip:'send a test message', css:'button opaline', style:'width:10em; height:4em; display:inline-block;'
			, ui:caption, tag:'div', hidden:false, keys:[], enabled:enabled } );
	let inautorep = new C_iCLIK(this.eids.buttons.inautorep, { click:new A_cb(this, this.smstest, 'inautorep') }
		, {   tip:'send a test message', css:'button opaline', style:'width:10em; height:4em; display:inline-block;'
			, ui:caption, tag:'div', hidden:false, keys:[], enabled:enabled } );
	let testwhich = new C_iPASS('outbound'); // can be 'outbound' or 'inautorep'
			
	this.controls = new A_ct({encod:encod, smsga:smsga, prior:prior, mpage:mpage, inbactn:inbactn, automsg:automsg,testwhich:testwhich });
	this.buttons = new A_ct({outbound:outbound, inautorep:inautorep});

}
C_iSMSGateAway.defaults = new A_df({ smsgateaway:'shortcode', encoding:'ascii7', priority:0 });
C_iSMSGateAway.prototype = {
	// public
	display: function(css) { 
		css = css ? (' '+css) : '';
		let cntrcolumn = '<td></td>';
		
				let test = '<td class="label textcolor-light right">'+C_XL.w('send test msg')+'</td>';
		
			let t1 = '<tr><td colspan=3><h2 style="line-height:3em;">'+C_XL.w('sms gateaway title')+'</h2></td></tr>';
			let enc = '<tr>'+this.controls.encod.labelled('sms encoding', 'alpha12'+css)+cntrcolumn+'</tr>';
			let g = '<tr>'+this.controls.smsga.labelled('sms gateaway', 'alpha12'+css)+cntrcolumn+'</tr>';
			let p = '<tr>'+this.controls.prior.labelled('sms priority', 'alpha12'+css)+cntrcolumn+'</tr>';
			let n = '<tr>'+this.controls.mpage.labelled('multipage sms')+cntrcolumn+'</tr>'; 
			let t = '<tr>'+test+'<td style="text-align:left;">'+this.buttons.outbound.display()+'</td>'+cntrcolumn+'</tr>'; 
		
			let t2 = '<tr><td colspan=3><h2 style="line-height:3em; margin-top:1em;">'+C_XL.w('inbound sms title')+'</h2></td></tr>';
			let a = '<tr>'+this.controls.inbactn.labelled('inbound action', 'alpha16'+css)+cntrcolumn+'</tr>';
				let cstyle = 'width:3em; vertical-align:top; padding-top:.1em; padding-left:.2em; color:rgba(0,0,0,.5); font-size:80%';
			let m = '<tr>'+this.controls.automsg.labelled('autoreply msg', 'ta24')+'<td id="'+this.eids.own.mcounter+'" style="'+cstyle+'"></td>'+'</tr>';
			let u = '<tr>'+test+'<td style="text-align:left;">'+this.buttons.inautorep.display()+'</td>'+cntrcolumn+'</tr>'; 
			
		let tbl = '<table class="coords">'+t1+enc+g+p+n+t+t2+a+m+u+'</table>';
		
		return tbl;
	},
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, css); },
	activate:function() { 
		this.elements.collect(this.eids.own);
		this.controls.activate();	
		this.buttons.activate();
		this.setmaxchars(); // for automatic answer message this.controls.automsg to display credit as from initialization
	},
	setmaxchars: function() { // calculates the max numbers of chars allowed in the message, according to user chosen options
		let maxpages = 10;   // longest allowed on mobminder smsgateaway
		let charsperpage = 153;
			let encod = this.controls.encod.getpost();
		switch(encod) {
			case 'ucs2': 	charsperpage = 67; break; // according to pdu, it is (140-6)/2 = 67
			case 'ascii7': 	charsperpage = 153; break; // according to pdu, it is (160-7)
		}
			let smsga = this.controls.smsga.getpost(); 
		switch(smsga) {
			case 'cluster2020': maxpages = 10; break;
			case 'shortcode': 	maxpages = 4; break;
		}
			let allowedpages = this.controls.mpage.getpost(); // chosen on admin gui (Gateaway tab of M_SMST modal)
		if(maxpages>allowedpages) maxpages = allowedpages;
		
		let maxchars = allowedpages * charsperpage; // according to encoding, gateaway limitation and admin allowed pages
		
		if(this.callbacks.onsmsga) this.callbacks.onsmsga.cb(maxchars); // calls parent layer so it can display the counters
		this.controls.automsg.setmax(maxchars);
		this.setcounter(); // in this control, we have the automatic answer message that can be set
	},
	set: function(v) { if(v in mobminder.language.names) this.controls.ddwn.set(v); return this; },
	getpost: function() { return this.controls.getpost(); },
	msgchange: function(digits) { this.setcounter(); },
	msgfocus: function(field) {},
	setcounter: function() {
			let r = this.controls.automsg.remains();
		this.elements.mcounter.innerHTML = r.positive+' / '+r.max;
	},
	onmpage: function(onoff) { 	this.setmaxchars();	}, 
	onsmsga: function(which) { 
		if(which=='shortcode') {
			this.controls.encod.set('ascii7', nofeedback=true);
			this.controls.encod.lock('ucs2', true);
		} else
			this.controls.encod.lock('ucs2', false); // only ascii7 is possible on shortcode
		this.setmaxchars();	
	}, 
	onencoding: function() { 	this.setmaxchars();	}, 
	onpriority: function() { },
	onaction: function(which) {},
	smstest: function(which) { 
		this.controls.testwhich.set(which);
		let tbutton = this.buttons.outbound.enable(false).busy(true);
		if(this.callbacks.onsmstest) this.callbacks.onsmstest.cb();
	},
	testok: function(tbutton) {
		this.buttons.outbound.enable(true).busy(false);
		this.buttons.inautorep.enable(true).busy(false);
	}
	
}
C_iSMSGateAway.options = function(preset) { // miscellaneous like { exclude:screen to be excluded from list, include:[misc options] }
	
	let labels = { shortcode:	'Shortcode' 	// keep coherence with smsgateaway.queues table definition and with dispatching code. see (*sg03*)
				/* , medicenters:	'be Clinics'
				, osteos:		'be Osteopathy'
				, medicus:		'be Medical'
				, wellness:		'be Wellness' 
				, dentists:		'be Dentists' 
				, miscellaneous:'be Others' */ // PVH 2021 - those options were finaly removed as we use one giant cluster that allows the best repartition of the traffic amongs all SIM's
				, cluster2020:	'be Cluster 2020' 
				};
		let isbe = mobminder.account.phoneRegion == 32;
		let betip = isbe?'Use own Mobminder infrastructure':'Only available for accounts in Belgium';
	let presets = 
		{ 
			shortcode: 		{ tip:'Use national operator servers entry points<br/>International mobile recipients will default to this mode.', enabled:true, hidden:false },
			/* medicenters:	{ tip:betip, enabled:isbe, hidden:false }, 
			osteos: 		{ tip:betip, enabled:isbe, hidden:false }, 
			medicus: 		{ tip:betip, enabled:isbe, hidden:false }, 
			wellness: 		{ tip:betip, enabled:isbe, hidden:false }, 
			dentists: 		{ tip:betip, enabled:isbe, hidden:false },
			miscellaneous: 	{ tip:betip, enabled:isbe, hidden:false }, */
			cluster2020: 	{ tip:betip, enabled:isbe, hidden:false }  //  keep coherence (*sg03*)
		}
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; // order.sort(sortrule); keep them in the labels order

	if(preset.maynone) {
		labels = omerge(labels, { 255:C_XL.w('none') } ); // in this case you may select "none" for the language (see alternative language in sms and email templates)
		order.push(255); // put this option at bottom of list
	}
	
	let count = order.length;
	
	return { order:order, labels:labels, presets:presets, count:count };
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   D R O P     D O W N     M E N U    W I T H    M U L T I P L E    S E L E C T I O N 
//
function C_iDDSTACK(eid, leadclass, callbacks, preset) {
		let b = eid+'_';
	this.eids = { ddwn:b+'ddwn', stack:b+'stck', wrp:b+'wrp' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { changed, cleared }
	this.state = C_iDDSTACK.defaults.align(preset=preset||{});
	this.leadclass = leadclass;
	
	let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:new A_cb(this, this.onddwn), dblclick:new A_cb(this, this.ddwncleared) }, leadclass.options(preset), { value:0, tag:'div', invite:preset.invite, maxrows:0 } );

		let optpreset = {};
		
		// presetting the picker preset options (items of type leadclass)
		let labels = [], order=[], presets = [];
		let onlabel = this.state.onlabelclick ? new A_cb(this, this.onlabel) : false;
		for(let id in this.state.ids) {
			if(this.leadclass.get(id)) {
				labels[id] = this.leadclass.ACoptions.label(id);
				order.push(id);
					let tip = this.leadclass.ACoptions.tip ? this.leadclass.ACoptions.tip(id) : false; // checks first if the function is defined in ACoptions
				presets[id] = { checked:true, tip:tip, onlabel:onlabel }
			}
		}
		this.sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(this.sortrule);
			optpreset = { order:order, labels:labels, presets:presets, count:order.length };

	let stack = new C_iCRESTA(this.eids.stack, { onchange:new A_cb(this, this.onchecks) }, optpreset, { emptypost:preset.emptypost, skin:1, mode:0, title:false } );	
	
	this.controls = new A_ct({ddwn:ddwn, stack:stack});
}
C_iDDSTACK.defaults = new A_df({ ids:false, hidden:false });
C_iDDSTACK.prototype = {
	// public
	display: function(css) {
			css = css || { ddwn:'', stack:'' };
		let ddwn 	= '<tr><td>'+this.controls.ddwn.display('alpha20 textcolor-light like-input '+(css.ddwn||''))+'</td></tr>';
		let stack 	= '<tr><td>'+this.controls.stack.display(css.stack||'')+'</td></tr>';
		let table 	= '<table id="'+this.eids.wrp+'" class="">'+ddwn+stack+'</table>';
		return table;
	},
	labelled: function(english, css) {
		return '';
	},
	activate: function() {
		this.controls.activate('C_iDDSTACK');
		this.elements.collect(this.eids);
		this.hide(this.state.hidden);
	},
	more: function(optionsIdArray, unset) {
		for(let x in optionsIdArray) {
			let id = optionsIdArray[x];
			this.onddwn(id, { unset:unset||false} );
		}
	},
	getpost: function() { return this.controls.stack.getpost(); },
	add: function(id, options) { // adds an option to the picker, default selected
		if(vbs) vlog('controls.js','C_iDDSTACK','add','eid'+this.eids.stack+', id:'+id); 
		this.onddwn(id, options);
	},
	value: function() { 
		let checked = this.controls.stack.getvalue();
		let items = [];
		for(let x in checked) {
			let id = checked[x];
			items[id] = this.leadclass.get(id);
		}
		return items; // an array indexed by id and pointing to leadclass objects
	},
	clear: function() {
		if(vbs) vlog('controls.js','C_iDDSTACK','clear','eid:'+this.eids.ddwn); 
		this.controls.stack.clear();
	},
	remove: function(id) { // removes an option from the picker, default selected
		this.controls.stack.clear(id);
	},
	refresh: function(id) { // label refresh, if this id belongs to the displayed list
		if(!this.leadclass.get(id)) return; // this id is not present locally in dbAccess
		if(!this.controls.stack.hasvalue(id)) return; // the given id is not displayed
		let options = this.leadclass.options();
			let tip = options.presets[id] ? (options.presets[id].tip||false) : false; // checks first if the function is defined in ACoptions
			let label = options.labels[id];
		this.controls.stack.refresh({id:id, label:label, tip:tip});
		if(vbs) vlog('controls.js','C_iDDSTACK','refresh','eid'+this.eids.ddwn+', id:'+id); 
	},
	blur: function() {
		this.controls.ddwn.blur();
	},
	hide: function(dohide) {
		if(this.elements.wrp)
			if(dohide) $(this.elements.wrp).hide(); else $(this.elements.wrp).show();
	},
	
	// private
	
	
	// callbacks
	onchecks: function(ids) {
		if(vbs) vlog('controls.js','C_iDDSTACK','onchecks', 'ids:'+ids+', eid:'+this.eids.ddwn); 
		if(this.callbacks.changed) this.callbacks.changed.cb(this.value());
	},
	onlabel: function(x) {
		let id = this.controls.stack.options.order[x];
		if(vbs) vlog('controls.js','C_iDDSTACK','onlabel','eid'+this.eids.stack+', x:'+x+', id:'+id); 
		if(this.state.onlabel) this.state.onlabel.cb(id);
	},
	onddwn: function(id, options) {
		if(vbs) vlog('controls.js', 'C_iDDSTACK', 'onddwn', 'value:'+id);		
		options = options || {};
		let doptions = this.controls.ddwn.options; // drop options
		if(!(id in doptions.labels)) return; // this id is not present locally in dbAccess
		let tip = doptions.presets[id] ? (doptions.presets[id].tip||false) : false; // checks first if the function is defined in ACoptions
			let check = options.unset?(!options.unset):true;
		this.controls.ddwn.set(); // goes back to invite mode
		if(!this.controls.stack.hasvalue(id)) { // prevent adding twice the same id in the list
				let onlabel = this.state.onlabelclick ? new A_cb(this, this.onlabel) : false;
			this.controls.stack.add(id, doptions.labels[id], { checked:check, tip:tip, onlabel:onlabel } );
			if(this.callbacks.added) this.callbacks.added.cb(id, check); // report items addition to the existing list
			if(this.callbacks.changed) this.callbacks.changed.cb(this.value()); // passes array like [id1=>leadclassobject, id2=>leadclassobject]
		} else { // this choice is already in the list
			this.controls.stack.docheck(id, check);
			if(this.callbacks.changed) this.callbacks.changed.cb(this.value()); // passes array like [id1=>leadclassobject, id2=>leadclassobject]
		}
	},
	ddwncleared: function() {
		if(vbs) vlog('controls.js','C_iDDSTACK','ddwncleared','eid:'+this.eids.ddwn); 
		this.clear();
		if(this.callbacks.cleared) this.callbacks.cleared.cb(); // report clearance event
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   T O O L   T I P 
//
function C_iTIP(eid, preset) { 
	if(is.tactile) return { activate:function() {}, remove: function() {}, quit: function() {} }; // void behaviour for touch devices
	this.eids = { anchor:eid };
	this.elements = new A_el(); // DOM element to which the tip hangs
	this.status = C_iTIP.defauts.align(preset);
}
C_iTIP.defauts = new A_df( { text:false, css:'tip', size:{x:'',y:''}, offset:{x:0, y:0} /* positive values go right bottom */
		/* state machine*/ , actualsize:{x:200,y:20} } );
C_iTIP.prototype = {
	// public
	activate: function(eid) { // eid can be set at activation
		if(eid) this.eids.anchor = eid;
		this.elements.collect(this.eids);
		if(!this.elements.anchor) return;
		C_iTIP.register[this.eids.anchor] = this;
		$(this.elements.anchor).mouseenter(C_iTIP.handlers.enter);
	},
	remove: function() {
		C_iTIP.handlers.quit();
		$(this.elements.anchor).unbind('mouseenter').unbind('mousemove').unbind('mouseleave');
		return false;
	},
	
	// private
	tipSet: function() {
		$(C_iTIP.elements.inset).width(this.status.size.x).height(this.status.size.y).html(this.status.text);
		$(C_iTIP.elements.outset).removeClass().addClass(this.status.css).css({left:0, top:0}).show(); // show() is mandatory to be able to measure the size of the div
		
		this.status.actualsize.x = $(C_iTIP.elements.outset).width()|0; // now that the content is in, we can measure the tip size
		this.status.actualsize.y = $(C_iTIP.elements.outset).height()|0;
		C_iTIP.status.limit.x = C_iWIN.size.w - (this.status.actualsize.x + this.status.offset.x + C_iTIP.pointerSize.x) - 0;
		C_iTIP.status.limit.y = C_iTIP.elements.body.clientHeight - (this.status.actualsize.y + this.status.offset.y + C_iTIP.pointerSize.y); // when scrolled
		return this;
	},
	tipSwap: function() { // called while you move the mouse pointer
		let x = C_iTIP.status.mouse.x; let y = C_iTIP.status.mouse.y;
		
		
		//	 ----------------------------------------    <= screen, unswapped case (normal case, the usual one, for little tips)
		//  |                                        |
		//  |                                        |
		//  |        mouse pointer                   |
		//  |        |                               |
		//  |        X --------------------          |
		//  |         |                    |         |
		//  |         |    normal tip      |         |
		//  |         |    position        |         |
		//  |         |                    |         |
		//  |         |                    |         |		
		//  |          --------------------          |
		//  |                                        |
		//	 ----------------------------------------

		
		
		// change tooltip position so to swap it if the mouse is out visibility limits
		// 
		if (x>C_iTIP.status.limit.x) x = x - this.status.actualsize.x - this.status.offset.x - 2; // (X swapped case)
			else x = x + this.status.offset.x + C_iTIP.pointerSize.x; 
		
		//	 ----------------------------------------    <= screen, x swapped case
		//  |                                        |		the mouse pointer was slided too far to the right
		//  |                                        |
		//  |                    mouse pointer       |
		//  |                     |                  |
		//  | ------------------- X                  |
		//  ||                    |                  |
		//  ||    normal tip      |                  |
		//  ||    position        |                  |
		//  ||                    |                  |
		//  ||                    |                  |		
		//  | --------------------                   |
		//  |                                        |
		//	 ----------------------------------------
		
			
			let yswapped = false;
		if (y>C_iTIP.status.limit.y) { y = y - this.status.actualsize.y - this.status.offset.y - 2; yswapped = true; } // (Y swapped case)
			else y = y + this.status.offset.y + C_iTIP.pointerSize.y; 
		
		//	 ----------------------------------------    <= screen, Y swapped case
		//  |                                        |  	the mouse pointer was closing too far to the bottom
		//  |          --------------------          |
		//  |         |                    |         |   
		//  |         |    normal tip      |         |
		//  |         |    position        |         |
		//  |         |                    |         |
		//  |         |                    |         |	
		//  |        X --------------------          |
		//  |        |                               |
		//  |        mouse pointer                   |
		//  |                                        |
		//  |                                        |
		//  |                                        |
		//	 ----------------------------------------

		
		// the tip has a mandatory limited size of 50% in width, see (*i01*)
		// so it can grow in the vertical direction. If the tall swapped tip goes off the upper screen limit, anchor it to the screen top edge (Y edged case)
		
		if(y<0) y = 5; // never display the tooltip off screen, note that this condition is only possible if the tip was higher than 50% of screen heigth
			
		//	 ----------------------------------------    <= screen, Y edged case
		//  |          --------------------          |      if the content is higher than 50% screen height, 
		//  |         |                    |         |		and the swap has pushed the tip top edge off screen
		//  |         |    normal tip      |         |		then we anchor the upper tip edge at the top of the screen
		//  |         |    position        |         |
		//  |   mouse |                    |         |
		//  | pointer |                    |         |	
		//  |        X|                    |         |
		//  |         |                    |         |
		//  |         |                    |         |
		//  |          --------------------          |
		//  |                                        |
		//  |                                        |
		//  |                                        |
		//	 ----------------------------------------

		
		if($(C_iTIP.elements.outset).height()>$(window).height()) 
			$(C_iTIP.elements.outset).css({top:5, left:'5%', 'max-width':'90%'});
		
			//	 ----------------------------------------    <= screen, Giant case
			//  |     -----------------------------      |      if the content is higher than 100% screen height, 
			//  |    |                             |     |		then we enlarge the max-width to 90% (instead of 50 default) and fix the lefter tip position at 5% of screen width
			//  |    |    normal tip               |     |		
			//  |    |    position                 |     |
			//  |    |                             |     |
			//  |    |                             |     |	
			//  |    |      X                      |     |
			//  |    |        mouse                |     |
			//  |    |        pointer              |     |
			//  |    |                             |     |
			//  |    |                             |     |
			//  |    |                             |     |
			//  |     -----------------------------      |
			//	 ----------------------------------------
		
		
		
		else $(C_iTIP.elements.outset).css({left:x, top:y});
		
		return this;
	},
	tipShow: function() {
		$(C_iTIP.elements.outset).show();
		if(vbs) vlog('controls.js','C_iTIP','tipShow','offset x:'+this.status.offset.x+', offset y:'+this.status.offset.y+', size x:'+this.status.actualsize.x+', size y:'+this.status.actualsize.y+', limit x:'+C_iTIP.status.limit.x+', limit y:'+C_iTIP.status.limit.y);
		return this;
	},
	write: function(text, css) {
		this.status.text = text; 
		if(css) this.status.css = css; else this.status.css = C_iTIP.defauts.css;
	},
	quit: function() { C_iTIP.handlers.quit(); }
};

// private
C_iTIP.eids = { outset:'tipOutset', inset:'tipInset', body:'body' }; // watch out, has dependance in style sheet: #tipInset and #tipOutset
C_iTIP.elements = new A_el();
C_iTIP.pointerSize = { x:12, y:22 }; // (0,0) is the upper left finger of the hand cursor
C_iTIP.status = { visible:false, eids:{current:false}, limit:{ x:0, y:0 }, mouse:{ x:0, y:0 }, timer:false };
C_iTIP.register = new Array();

$(document).ready(function() {
	if(!C_iTIP.elements.outset) {
		let inset = '<div id="'+C_iTIP.eids.inset+'" style=""></div>';
		let outset = '<div id="'+C_iTIP.eids.outset+'" style="pointer-events:none; position:absolute; display:none; z-index:200; max-width:50%;">'+inset+'</div>'; // (*i01*) max-width relates to screen width
		$('#body').append(outset);
		C_iTIP.elements.collect(C_iTIP.eids); // Tooltip div
	}
});

// events handling
C_iTIP.handlers = {
	enter:function(event) {
		C_iTIP.status.mouse = {x:event.pageX, y:event.pageY};
		C_iTIP.status.eids.current = this.id;
		$(this).mouseleave(C_iTIP.handlers.leave).mousemove(C_iTIP.handlers.move);
		C_iTIP.status.timer = setTimeout(C_iTIP.handlers.delayed, 1000, this.id);
	},
	delayed:function(eid) {
		if(eid != C_iTIP.status.eids.current) return; // do nothing, the mouse spot has changed
		let tip = C_iTIP.register[C_iTIP.status.eids.current];
		if(!tip) return; // do nothing, the object is not on the page anymore
		C_iTIP.status.visible = tip;
		tip.tipSet().tipSwap().tipShow();
	},
	leave:function() {
		$(this).unbind('mousemove', C_iTIP.handlers.move).unbind('mouseleave', C_iTIP.handlers.leave);
		C_iTIP.handlers.quit();
	},
	quit:function() {
		if(is.tactile) return;
		C_iTIP.status.eids.current = false;
		C_iTIP.status.visible = false;
		clearTimeout(C_iTIP.status.timer);
		if(C_iTIP.elements.outset) C_iTIP.elements.outset.style.display='none';
		$(C_iTIP.elements.outset).css({'max-width':'50%'}); // (*i01*)
	},
	move:function(event){
		C_iTIP.status.mouse = {x:event.pageX, y:event.pageY};
		if(C_iTIP.status.visible) C_iTIP.status.visible.tipSwap(); // the tip is currently visible, swap it according to new mouse position
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//  T A B S     P A G I N G 
//

function C_iTAB(eid, callbacks, preset) {
	this.state = C_iTAB.defaults.align(preset);
	this.eids = { f:eid+'_f', b:eid+'_b', c:eid+'_c', busy:eid+'_busy' };
		let b = new C_iCLIK(this.eids.b, { click:callbacks.ontab }, { value:preset.value, tag:'div', ui:preset.label, css:'inner' });
	this.controls = new A_ct({b:b});
	this.elements = new A_el();
}
C_iTAB.defaults = new A_df( { selected:false, busy:false } );
C_iTAB.prototype = {
	td_front:function() { 
		return '<td id="'+this.eids.f+'" class="tab">'+this.controls.b.display()+'</td>'; 
	},
	div_container:function(html, css) { 
			css = css||'';
		return '<div id="'+this.eids.c+'" class="tab-container '+css+'" style="display:none; position:relative;">'+html+'</div>';
	},
	activate:function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		this.select(this.state.selected).hide(this.hidden());
	},
	hide: function(dohide) {
		this.controls.b.hide(dohide);
		if(this.elements.f)
			if(dohide) $(this.elements.f).hide(); else $(this.elements.f).show();
	},
	select: function(selected) {
		this.state.selected = selected;
		if(selected) {
			$(this.elements.c).show();
			$(this.elements.f).addClass('tab-selected');
		} else {
			$(this.elements.c).hide();
			$(this.elements.f).removeClass('tab-selected');
		}
		return this;
	},
	html: function(html) { this.elements.c.innerHTML = html; return this; },
	busy:function(onoff) {
		let el = document.getElementById(this.eids.busy);
		if(onoff && !el) {
			let style = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden;';
			let overlay = '<div class="tab-busy" id="'+this.eids.busy+'" style="'+style+'"></div>';
			$(this.elements.wrapper).append(overlay);
		} else 
			if(onoff==false && el) $(el).remove();
		return this;
	},
	hidden: function() { return this.controls.b.hidden(); }
}

function C_iTABS(eid, options, callbacks, preset) { 	// options like { 0:'tab1', 1:'tab2', 2:'tab3' }
	this.options = options;
	this.state = C_iTABS.defaults.align(preset);
	this.controls = new A_ct();
	this.callbacks = callbacks || {};
	let cb = new A_cb(this, this.ontab);
	for(let v in this.options) {
				let label = this.options[v];
				let tid = eid+'_'+v;
			let b = new C_iTAB(tid, { ontab:cb }, { value:v, label:label });
		this.controls.add1(b, v); 
	}
}
C_iTABS.defaults = new A_df( { current:false } );
C_iTABS.prototype = {
	// public
	display: function(css, options) { // displays the upper control part, which are the tabs themselves
			options = options || {}; // like {iconic:true}
			css = css||''; // this.controls.tabs.display('tabs-squeeze');
		let ftds = []; 
		for(let v in this.controls.get)
			ftds.push(this.controls.get[v].td_front());
			
			let side = '<td width=30% class="tab-side">&nbsp;</td>'; 
		ftds.unshift(side); ftds.push(side);

		let ftable = '<table width=100% class="tabs '+css+'" style=""><tr>'+ftds.join('')+'</tr></table>';
		return ftable;
	},
	container: function(v, html, css) { // displays one container
		if(!(v in this.controls)) { warning('controls.js','C_iTABS','container','v:'+v+' (type '+typeof(v)+') is not defined in this.controls'); return false; } 
		return this.controls[v].div_container(html, css);
	},
	activate: function() {
		
		this.controls.activate('C_iTABS'); 
		
		let v = this.state.current; 
		if(this.state.current===false) 
			for(v in this.options) if(!this.controls.get[v].hidden()) break; // by default, show the first not hidden tab	
		
		this.controls.get[this.state.current = v].select(true);
		return this;
	},
	set: function(v) { // switch to a given tab
		this.swap(v);
		if(this.callbacks.ontab) this.callbacks.ontab.cb(v);
		return this;
	},
	html: function(v, html) { // replace the content of a container
		if(v in this.controls.get) this.controls.get[v].html(html);
		return this;
	},
	busy: function(v, onoff) { // shows the container as busy
		if(v in this.controls.get) this.controls.get[v].busy(onoff);
		return this;
	},
	hide: function(v, dohide) { // hides one tab
		if(v in this.controls.get) this.controls.get[v].hide(dohide);
		return this;
	},
	current: function() { return this.state.current; },
	getpost: function() { return this.state.current; },
	
	// privates
	swap: function(v) {
		if(v===this.state.current) return this;
		this.controls.get[this.state.current].select(false);
		this.controls.get[v].select(true);
		this.state.current = v;
		return this;
	},
	ontab: function(o) { 
		let which = o.value(); // o is the C_iCLIK instance nested in the C_iTAB
		this.swap(which);
		if(this.callbacks.ontab) this.callbacks.ontab.cb(which);
	}
}

 

 
//////////////////////////////////////////////////////////////////////////////////////////////
//   D R A G    A N D    D R O P 
//
function C_iDRAG(el, preset) {
	this.eids = { draggy:el.id };
	this.state = C_iDRAG.defaults.align(preset);
	this.elements = { draggy:el };
	if(!C_iDRAG.div) {
		// note: css pointer-events:none makes the element transparent to mouse events;
		$('body').append('<div id="drag" style="display:none; position: absolute; z-index:1000; pointer-events:none;"></div>');
		C_iDRAG.div = document.getElementById('drag');	
	}
	
	$(this.elements.draggy).mousedown(C_iDRAG.handlers.down);
	C_iDRAG.register[this.eids.draggy] = this;
	
	if(vbs) vlog('controls.js','C_iDRAG','constructor','eid:'+this.eids.draggy); 
}
C_iDRAG.defaults = new A_df( 
	{ movable:{x:true, y:true}, family:0, value:0
	, image:true 	// image can be { css:'aclass', offx:'10', offy:'20' /*pixels*/ } 
	, replace:false // replace = true: the dragged object can be dropped back to its place, triggering the callback function
	, fartrigger: 10 // pixels. the drag action is considered and can trigger when you have moved the mouse pointer at least 10px far from the pick down spot (can be specified for smaller objects)
	, cursor:'dragging-vertical' } ); 
	
C_iDRAG.register = new Array();
C_iDRAG.div = false;
C_iDRAG.init = function() { return { dragging:false, click:{eid:false, far:0, mouse:{x:0,y:0}, target:{x:0,y:0}, offset:{x:0,y:0}} }};
C_iDRAG.state = C_iDRAG.init();
C_iDRAG.picked = false;
C_iDRAG.prototype = { 
	done: function() { C_iDRAG.handlers.done() },
	free: function() { C_iDRAG.handlers.free() },
	picked: function() { return C_iDRAG.picked; },
	image: function(onOff) { this.state.image=!!onOff; }
}
C_iDRAG.handlers = {
	down: function(e) {
	
		C_iDRAG.state.click.eid = this.id;
		C_iDROP.state.dropped = false;
		
		$(document).mousemove(C_iDRAG.handlers.move).mouseup(C_iDRAG.handlers.anywhere); // this covers any case of dropping above a non droppable area on the screen
			
			let draggy = C_iDRAG.register[this.id];
		if(vbs) vlog('controls.js','C_iDRAG','down','value:'+draggy.state.value); 
		C_iDRAG.state.click.mouse.x = e.pageX; 
		C_iDRAG.state.click.mouse.y = e.pageY;
		
		let position = $(this).offset(); // catch the clicked object  position
		C_iDRAG.state.click.target.x = position.left; 
		C_iDRAG.state.click.target.y = position.top;
		
		// checking out position of the dragged object versus the mouse position
		C_iDRAG.state.click.offset.x = e.pageX - position.left; // catch the clicked object  position
		C_iDRAG.state.click.offset.y = e.pageY - position.top;
		
		// the drag element must now apes the clicked object
		let clicked = { width:$(this).width(), height:$(this).height(), inner:this.innerHTML, css:$(this).attr('class') }
				
		C_iDRAG.picked = this;
		$(C_iDRAG.div).width(clicked.width).height(clicked.height).removeClass().addClass(clicked.css).html(clicked.inner);
		return  C_iDRAG.handlers.move(e);
	},
	move: function(e) {
		
		// see if we drifted far enough to call this a drag and drop
			let deltax = C_iDRAG.state.click.mouse.x - e.pageX; 
			let deltay = C_iDRAG.state.click.mouse.y - e.pageY; 
			let draggy = C_iDRAG.register[C_iDRAG.state.click.eid];
			
			let far = deltax*deltax+deltay*deltay; // we do not sqrt() this figure because we compare to 10^2
			let farenough = draggy.state.fartrigger*draggy.state.fartrigger;
	
		if(far<farenough) return true; // you do not drag far enough (this is to avoid confusion with a single click or a long click)
			else if(!C_iDRAG.state.click.far) { // first time you move out of the proximity area
				C_iDRAG.state.click.far = true;
				C_iDRAG.state.dragging = draggy; // watch the execution context
				C_iWIN.cursor(C_iDRAG.state.dragging.state.cursor);
				C_iCLIK.inhibit(); // C_iCLIK.state.down = false; // cancel any click or hold in the C_iCLIK
			}
		
		if(!draggy.state.image) return true;
		
		// else use the smoothly moving image
		let x = draggy.state.movable.x ? e.pageX-C_iDRAG.state.click.offset.x : C_iDRAG.state.click.target.x;
		let y = draggy.state.movable.y ? e.pageY-C_iDRAG.state.click.offset.y : C_iDRAG.state.click.target.y;
		let offx = draggy.state.image.offx||0; let offy = draggy.state.image.offy||0;
		$(C_iDRAG.div).css({top:y+offy, left:x+offx}).addClass(draggy.state.image.css||'').show();
		return true;
	},
	anywhere: function() {
		if(vbs) vlog('controls.js','C_iDRAG','anywhere',''); 
		$(document).unbind('mousemove', C_iDRAG.handlers.move).unbind('mouseup', C_iDRAG.handlers.anywhere);
		C_iWIN.cursor();
		if(!C_iDROP.state.dropped) { // the draggy has been dropped anywhere but on a drop place
			C_iDRAG.handlers.done(); // when dropped on a valid recipent, it's up to the handler to .free() the dragging css
			C_iDRAG.handlers.free();
		}
		return true;
	},
	done: function() { 
		if(vbs) vlog('controls.js','C_iDRAG','done',''); 
		$(C_iDRAG.div).removeClass().hide();
		C_iDRAG.state = C_iDRAG.init();
		// C_iDRAG.state.dragging = false;
		// C_iDRAG.state.click = {eid:false, far:0, mouse:{x:0,y:0}, target:{x:0,y:0}, offset:{x:0,y:0}};
		return true;
	},
	free: function() { 
		if(vbs) vlog('controls.js','C_iDRAG','free',''); 
		if(!C_iDRAG.picked) return;
		$(C_iDRAG.picked).removeClass('easy-dragging');
		C_iDRAG.picked = false;
		return true;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
function C_iDROP(el, callbacks, preset) {
	
	this.eids = { droppy:el.id };
	this.state = C_iDROP.defaults.align(preset);
	this.elements = { droppy:el };
	this.callbacks = callbacks; // { dropped:o_callback, enter:o_callback, leave:o_callback }
	
	if(C_iDROP.register[this.eids.droppy]) 
		$(this.elements.droppy).unbind('mouseup',C_iDROP.handlers.up).unbind('mouseenter',C_iDROP.handlers.enter).unbind('mouseleave',C_iDROP.handlers.leave);
	else C_iDROP.register[this.eids.droppy] = new Array(); // prepare for welcoming many families
	$(this.elements.droppy).mouseup(C_iDROP.handlers.up).mouseenter(C_iDROP.handlers.enter).mouseleave(C_iDROP.handlers.leave);
	
	C_iDROP.register[this.eids.droppy][this.state.family] = this;	
}
C_iDROP.defaults = new A_df( { family:0, value:0 } );
C_iDROP.register = new Array(); // array like C_iDROP.register[eid][family] = o_easyDRop
C_iDROP.state = { dropped:false };
C_iDROP.handlers = {
	up: function(e) {
		if(!C_iDRAG.state.dragging) return true;
		
		// catch the context
		let draggy = C_iDRAG.state.dragging;
		let drops = C_iDROP.register[this.id]; 
		let droppy = drops[draggy.state.family];
		if(!droppy) return true; // the type of the dragged object does not fit in this recepient
		if(!draggy.state.replace) if(draggy.state.value == droppy.state.value) return true; // dropped on the orignal location
		
		// getting here means that you dropped on a valid recepient, inside a value that is not your origin value
		if(vbs) vlog('controls.js','C_iDROP','drop','drag:'+draggy.state.value+', drop:'+droppy.state.value+', family:'+draggy.state.family+', replace:'+(draggy.state.replace?'yes':'no')); 
		
		C_iDROP.state.dropped = droppy; // checked by the anywhere(), prevents the done() and free() when dropping on a valid drop zone
		if(droppy.callbacks.drop) return droppy.callbacks.drop.cb(draggy, droppy);
	},
	enter: function() {
		if(!C_iDRAG.state.dragging) return true; 
		let draggy = C_iDRAG.state.dragging;
		let droppy = C_iDROP.register[this.id][draggy.state.family];
		
			if(vbs) vlog('controls.js','C_iDROP','enter','family:'+draggy.state.family+', replace:'+(draggy.state.replace?'yes':'no')); 
			
		if(!droppy) return true; // dragging over a drop of a different family
		if(!draggy.state.replace) if(draggy.state.value == droppy.state.value) return true;


		$(C_iDRAG.picked).addClass('easy-dragging');
		if(droppy.callbacks.enter) droppy.callbacks.enter.cb(draggy, droppy);
		C_iWIN.cursor(); C_iWIN.cursor(draggy.state.cursor);
		return true;
	},
	leave: function() {
		if(!C_iDRAG.state.dragging) return true; 
		C_iWIN.cursor(); C_iWIN.cursor('dragging-notallowed');
		let draggy = C_iDRAG.state.dragging;
		let droppy = C_iDROP.register[this.id][draggy.state.family];
		if(!droppy) return true; // dragging over a drop of a different family
		if(draggy.state.value == droppy.state.value) return true;
		if(droppy.callbacks.leave) droppy.callbacks.leave.cb(draggy, droppy);
		return true;
	}
}

var color_code_event = 99;
var css_pattern_none = 999;
var css_color_none = 999;
var css_tag_none = 1000;

var ccsstype = { color:80, pattern:81, tag:82 }; // DB values
var ccssclasses = { appointment:resaclass.appointment , event:resaclass.event, fcal:resaclass.fcalwide, visitor:class_visitor, note:class_note, task:class_task, chat:class_chat, file:class_file };
var ccsstag = function(clas, type) { return type+'_'+clas; };
var skin = { color:ccsstype.color, pattern:ccsstype.pattern, tag:ccsstype.tag, acctag:83, rsctag:84, tbxtag:85, wkctag:86, logtag:87, eresa:89 };


/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//              A  P  P  L  I  C  A  T  I  O  N       C  O  N  T  R  O  L  S 
//
//


//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     C O L O R S    O R    P A T T E R N S   O R    T A G S
//
//   This control is used to make custom css out of numerous colors, patterns or tags
//
function C_iSKIN(eid, callbacks, preset) { // TBD =>  Use C_iCLIK here, No reaction on iPad !!
	this.eids = { ui:eid+'_pop', options:eid+'_opts' };
	this.callbacks = callbacks;
	this.elements = new A_el();
	this.state = C_iSKIN.defaults.align(preset);
		let css = preset.css||'skin-face alpha12 like-input';
		let poppreset = { tag:'div', ui:'', css:css, enabled:this.state.enabled } 
	let pop = new C_iPOP(this.eids.ui, { escape:new A_cb(this, this.escape), enter:new A_cb(this, this.enter), popped:new A_cb(this, this.popped) }, poppreset );
	this.controls = new A_ct( {pop:pop} );
	this.handlers = new A_hn();
}
C_iSKIN.defaults = new A_df( { type:skin.color, value:90, allownone:false, enabled:true } ); // allownone adds one more choice corresponding to "no choice"
C_iSKIN.prototype = {
	// public
	display: function(css) { return this.controls.pop.display(css); },
	labelled: function(english, css) { return this.controls.pop.labelled(english, css); },
	activate: function() {
		this.controls.activate('C_iSKIN');
		let css = '', text = '', value = this.state.value, preset = this.state.value;
		switch(this.state.type) {
			case skin.color: 	css = 'c'+value; preset = css; text = '&nbsp;'; break;
			case skin.pattern: 	css = 'p'+value; preset = css; text = '&nbsp;'; break;
			case skin.eresa: 	css = 'e-'+(value||'none'); text = C_XL.w(this.state.value||'none'); break;
			case skin.tag:
			case skin.acctag:
			case skin.rsctag:
			case skin.tbxtag:
			case skin.logtag:
			case skin.wkctag: css = C_iSKIN.tagcss(this.state.value); preset = css; break;
		}
		this.controls.pop.set(text, css);
		C_iSKIN.options.selected(this.elements.options, preset);
	},	
	getpost: function() { return this.state.value; },
	value: function() { return this.state.value; },
	
	// private
	enter: function() {  // event handler, ui hit, lets the pad appears
		let options = C_iSKIN.options.display(this.state.type, this.eids.options, this.state.allownone);
		let title = '';
		switch(this.state.type) {
			case skin.color: title = 'colors'; break;
			case skin.pattern: title = 'patterns'; break;
			case skin.eresa: title = 'skins'; break;
			case skin.tag: 
			case skin.acctag:
			case skin.rsctag:
			case skin.tbxtag:
			case skin.logtag:
			case skin.wkctag: title = 'tags'; break;
		}
		let header = '<h1 style="text-align:left; padding:.5em;">'+C_XL.w(title)+'</h1>';
		return { header:header, body:options };
	},
	
	// events
	popped: function(modal) {
		this.elements.collect(this.eids);
		let select = this.handlers.add('select', new A_cb(this, this.select));
		let selectedcss;
		switch(this.state.type) {
			case skin.color: 	selectedcss = 'c'+this.state.value; break;
			case skin.pattern: 	selectedcss = 'p'+this.state.value; break;
			case skin.eresa: 	selectedcss = this.state.value; break;
			case skin.tag:
			case skin.acctag:
			case skin.rsctag:
			case skin.tbxtag:
			case skin.logtag:
			case skin.wkctag: selectedcss = C_iSKIN.tagcss(this.state.value); break;
		}
		C_iSKIN.options.activate(this.elements.options, selectedcss, select);
	},
	escape: function() { return true; },
	select: function(value) { // callback from element click
		let css = '', text = '';
		switch(this.state.type) {
			case skin.color: 	this.state.value = value.substr(1); css = value; text = ''; break;
			case skin.pattern: 	this.state.value = value.substr(1); css = value; text = ''; break;
			case skin.eresa: 	this.state.value = value; css = 'e-'+(value||'none'); text = C_XL.w(this.state.value||'none'); break;
			case skin.tag:
			case skin.acctag:
			case skin.rsctag:
			case skin.tbxtag:
			case skin.logtag:
			case skin.wkctag: 	this.state.value = value; css = C_iSKIN.tagcss(value); text = ''; break;
		}
		this.controls.pop.set(text, css);
		C_iSKIN.options.selected(this.elements.options, css);
		if(this.callbacks.select) this.callbacks.select.cb(this.state.value);
		this.controls.pop.close();
	}
}
C_iSKIN.tagcss = function(dbcode) { return C_iSKIN.bank[dbcode]; }
C_iSKIN.bank = Array(); // like C_iSKIN.bank[dbcode] = 'css class name';
C_iSKIN.csstags = {
	//			V I S I T O R S   /   A P P O I N T M E N T S   /  T A S K S    /  N O T E S   
	//
	//		PEOPLE							ORGANS							SMILEYS								MISC SYMBOLS						MONEY									COMMUNICATION						GENDER									ANIMALS
agenda:[
[{c:'fa fa-male',v:'1001'}			,{c:'fa fa-tooth',v:'1010'}			,{c:'fa fa-grin',v:'1020'}			,{c:'fa fa-ban',v:'1024'}			,{c:'fa fa-warning',v:'1027'}			,{c:'fa fa-at',v:'1028'}			,{c:'fa fa-birthday-cake',v:'1008'}	,{c:'fa fa-cat',v:'1070'}		],
[{c:'fa fa-female',v:'1002'}		,{c:'fa fa-wheelchair',v:'1011'}	,{c:'fa fa-smile',v:'1021'}			,{c:'fa fa-calculator',v:'1031'}	,{c:'fa fa-closed-captioning',v:'1041'}	,{c:'fa fa-stethoscope',v:'1051'}	,{c:'fa fa-venus',v:'1061'}			,{c:'fa fa-dog',v:'1071'}		],
[{c:'fa fa-child',v:'1003'}			,{c:'fa fa-eye',v:'1012'}			,{c:'fa fa-frown',v:'1022'}			,{c:'fa fa-calendar',v:'1032'}		,{c:'fab fa-cc-mastercard',v:'1042'}	,{c:'fa fa-thumbs-up',v:'1025'}		,{c:'fa fa-mars',v:'1062'}			,{c:'fa fa-crow',v:'1072'}		],
[{c:'fa fa-users',v:'1004'}			,{c:'fa fa-heartbeat',v:'1013'}		,{c:'fa fa-meh',v:'1023'}			,{c:'fa fa-paperclip',v:'1033'}		,{c:'fa fa-sync',v:'1043'}				,{c:'fa fa-thumbs-down',v:'1026'}	,{c:'fa fa-venus-mars',v:'1063'}	,{c:'fa fa-horse',v:'1073'}		],
[{c:'fa fa-person-carry',v:'1000'}	,{c:'fa fa-ear',v:'1014'}			,{c:'fa fa-flushed',v:'1124'}		,{c:'fa fa-pencil',v:'1034'}		,{c:'fab fa-cc-visa',v:'1044'}			,{c:'fa fa-hand-point-up',v:'1054'}	,{c:'fa fa-venus-double',v:'1064'}	,{c:'fa fa-ram',v:'1074'}		],
[{c:'fa fa-user',v:'1005'}			,{c:'fa fa-link',v:'1015'}			,{c:'fa fa-grimace',v:'1125'}		,{c:'fa fa-tag',v:'1035'}			,{c:'fa fa-credit-card',v:'1045'}		,{c:'fa fa-university',v:'1055'}	,{c:'fa fa-mars-double',v:'1065'}	,{c:'fa fa-monkey',v:'1075'}	],
[{c:'fa fa-user-md',v:'1006'}		,{c:'fa fa-smoking',v:'1016'}		,{c:'fa fa-angry',v:'1126'}			,{c:'fa fa-biohazard',v:'1036'}		,{c:'fa fa-money-bill',v:'1046'}		,{c:'fa fa-flask',v:'1057'}			,{c:'fa fa-mercury',v:'1066'}		,{c:'fa fa-cow',v:'1076'}		],
[{c:'fa fa-baby',v:'1007'}			,{c:'fa fa-utensils',v:'1017'}		,{c:'fa fa-dizzy',v:'1127'}			,{c:'fa fa-envelope',v:'1037'}		,{c:'fa fa-euro-sign',v:'1047'}			,{c:'fa fa-tablet-alt ',v:'1069'}	,{c:'fa fa-transgender',v:'1067'}	,{c:'fa fa-pig',v:'1077'}		],
[{c:'fa fa-procedures',v:'1108'}	,{c:'fa fa-wine-glass-alt',v:'1018'},{c:'fa fa-grin-beam-sweat',v:'1128'},{c:'fa fa-edit',v:'1038'}			,{c:'fa fa-dollar-sign',v:'1048'}		,{c:'fa fa-phone',v:'1058'}			,{c:'fa fa-neuter',v:'1068'}		,{c:'fa fa-fish',v:'1078'}		],
[{c:'fa fa-user-friends',v:'1109'}	,{c:'fa fa-pills',v:'1019'}			,{c:'fa fa-smile-wink',v:'1129'}	,{c:'fa fa-camera-alt',v:'1039'}	,{c:'fa fa-ticket-alt',v:'1049'}		,{c:'fa fa-mobile-alt',v:'1059'}	,{c:'fa fa-recycle',v:'1056'}		,{c:'fa fa-rabbit',v:'1079'}	],
[{c:'fa fa-street-view',v:'1100'}	,{c:'fa fa-kidneys',v:'1110'}		,{c:'fa fa-grin-alt',v:'1120'}		,{c:'fa fa-coffin ',v:'1130'}		,{c:'fa fa-file-signature',v:'1140'}	,{c:'fa fa-sms',v:'1150'}			,{c:'fa fa-yin-yang',v:'1160'}		,{c:'fa fa-unicorn',v:'1170'}	],
[{c:'fa fa-people-arrows',v:'1101'}	,{c:'fa fa-virus',v:'1111'}			,{c:'fa fa-toolbox',v:'1121'}		,{c:'fa fa-calendar-edit',v:'1131'}	,{c:'fa fa-photo-video',v:'1141'}		,{c:'fa fa-phone-office',v:'1151'}	,{c:'fa fa-head-side-mask',v:'1161'},{c:'fa fa-snake',v:'1171'}		],
[{c:'fa fa-user-check',v:'1102'}	,{c:'fa fa-allergies',v:'1112'}		,{c:'fa fa-user-injured',v:'1122'}	,{c:'fa fa-sunglasses ',v:'1132'}	,{c:'fa fa-wrench',v:'1142'}			,{c:'fa fa-phone-slash',v:'1152'}	,{c:'fa fa-analytics',v:'1162'}		,{c:'fa fa-turtle',v:'1172'}	]
],
account:[
	//			A C C O U N T S  
	//
	//		COMPANY SIZE					PROFESSIONAL						SECTOR									SYMBOLS										STATUS
[{c:'fa fa-home',v:'3000'}			,{c:'fa fa-tooth',v:'3010'}			,{c:'fa fa-person-booth',v:'3020'}		,{c:'fa fa-times-square',v:'3030'}			,{c:'fa fa-lock-open-alt',v:'3040'}		],
[{c:'fa fa-industry-alt',v:'3001'}	,{c:'fa fa-wheelchair',v:'3011'}	,{c:'fa fa-chalkboard-teacher',v:'3021'},{c:'fa fa-times-octagon',v:'3031'}			,{c:'fa fa-lock-alt',v:'3041'}			],
[{c:'fa fa-hospital-alt',v:'3002'}	,{c:'fa fa-medkit',v:'3012'} 		,{c:'fa fa-car-mechanic',v:'3022'}		,{c:'fa fa-exclamation-triangle',v:'3032'}	,{c:'fa fa-arrow-square-up',v:'3042'}	],
[{c:'fa fa-hospital',v:'3003'}		,{c:'fa fa-user-graduate',v:'3013'}	,{c:'fa fa-bicycle',v:'3023'}			,{c:'fa fa-exclamation-circle',v:'3033'}	,{c:'fa fa-comments',v:'3043'}			],
[{c:'fa fa-building',v:'3004'}		,{c:'fa fa-user-secret',v:'3014'}	,{c:'fa fa-paw',v:'3024'}				,{c:'fa fa-pause',v:'3034'}					,{c:'fa fa-glasses',v:'3044'}			],
[{c:'fa fa-city',v:'3005'}			,{c:'fa fa-user-md',v:'3015'}		,{c:'fa fa-balance-scale-left',v:'3025'},{c:'fa fa-recycle',v:'3035'}				,{c:'fa fa-ruler-triangle',v:'3055'}	],
[{c:'fa fa-hotel',v:'3006'}			,{c:'fa fa-head-vr',v:'3016'}		,{c:'fa fa-spa',v:'3026'}				,{c:'fa fa-minus-square',v:'3036'}			,{c:'fa fa-highlighter',v:'3066'}		],
[{c:'fa fa-landmark',v:'3007'}		,{c:'fa fa-low-vision',v:'3017'}	,{c:'fa fa-cut',v:'3027'}				,{c:'fa fa-stop-circle',v:'3037'}			,{c:'fa fa-handshake',v:'3077'}			],
[{c:'fa fa-car-building',v:'3008'}	,{c:'fa fa-user-hard-hat',v:'3018'}	,{c:'fa fa-ambulance',v:'3028'}			,{c:'fa fa-weight',v:'3038'}				,{c:'fa fa-brain',v:'3048'}				],
[{c:'fa fa-cars',v:'3009'}			,{c:'fa fa-toolbox',v:'3019'}		,{c:'fa fa-shuttle-van',v:'3029'}		,{c:'fa fa-heartbeat',v:'3039'}				,{c:'fa fa-baby',v:'3049'}				]
],
resources:[

	//			R E S O U R C E S  
	//
	//			PEOPLE							MED SPECIALIST						PROFESSIONAL							WHEELS									STATUS and MISC
[{c:'fa fa-user',v:'4000'}		,{c:'fa fa-tooth',v:'4010'}		,{c:'fa fa-person-booth',v:'4020'}		,{c:'fa fa-truck',v:'4030'}				,{c:'fa fa-lock-open-alt',v:'4040'}	],
[{c:'fa fa-users',v:'4001'}		,{c:'fa fa-eye',v:'4011'}		,{c:'fa fa-booth-curtain',v:'4021'}		,{c:'fa fa-car',v:'4031'}				,{c:'fa fa-lock-alt',v:'4041'}		],
[{c:'fa fa-user-md',v:'4002'}	,{c:'fa fa-ear',v:'4012'} 		,{c:'fa fa-users-class',v:'4022'}		,{c:'fa fa-taxi',v:'4032'}				,{c:'fa fa-flask',v:'4042'}			],
[{c:'fa fa-user-tie',v:'4003'}	,{c:'fa fa-lungs',v:'4013'}		,{c:'fa fa-user-chart',v:'4023'}		,{c:'fa fa-digital-tachograph',v:'4033'},{c:'fa fa-vials',v:'4043'}			],
[{c:'fa fa-user-cog',v:'4004'}	,{c:'fa fa-stomach',v:'4014'}	,{c:'fa fa-chalkboard-teacher',v:'4024'},{c:'fa fa-car-mechanic',v:'4034'}		,{c:'fa fa-glasses',v:'4044'}		],
[{c:'fa fa-user-plus',v:'4005'}	,{c:'fa fa-heartbeat',v:'4015'}	,{c:'fa fa-chair',v:'4025'}				,{c:'fa fa-recycle',v:'4035'}			,{c:'fa fa-hammer',v:'4045'}		],
[{c:'fa fa-user-tag',v:'4006'}	,{c:'fa fa-brain',v:'4016'}		,{c:'fa fa-chair-office',v:'4026'}		,{c:'fa fa-comments-alt',v:'4036'}		,{c:'fa fa-syringe',v:'4046'}		],
[{c:'fa fa-user-lock',v:'4007'}	,{c:'fa fa-briefcase',v:'4017'}	,{c:'fa fa-person-carry',v:'4027'}		,{c:'fa fa-charging-station',v:'4037'}	,{c:'fa fa-handshake',v:'4047'}		],
[{c:'fa fa-user-hard-hat',v:'4008'}	,{c:'fa fa-users-medical',v:'4018'}	,{c:'fa fa-projector',v:'4028'}		,{c:'fa fa-weight',v:'4038'}		,{c:'fa fa-user-nurse',v:'4048'}	],
[{c:'fa fa-people-arrows',v:'4009'}	,{c:'fa fa-user-headset',v:'4019'}	,{c:'fa fa-shuttle-van',v:'4029'}	,{c:'fa fa-heartbeat',v:'4039'}		,{c:'fa fa-baby',v:'4049'}			]
],
workcodes:[
	//			W O R K   C O D E S 
	//
	//		PLACE								ORGANS							PAPER WORK								MISC SYMBOLS								TOOLS										ACTION									PEOPLE
[{c:'fa fa-car-side',v:'6000'}		,{c:'fa fa-tooth',v:'6010'}		,{c:'fa fa-id-card',v:'6020'}			,{c:'fa fa-times-square',v:'6030'}			,{c:'fa fa-cut',v:'6040'}					,{c:'fa fa-monitor-heart-rate',v:'6050'},{c:'fa fa-street-view',v:'6060'}	],
[{c:'fa fa-home',v:'6001'}			,{c:'fa fa-eye',v:'6011'}		,{c:'fa fa-file-invoice',v:'6021'}		,{c:'fa fa-radiation',v:'6031'}				,{c:'fa fa-car-mechanic',v:'6041'}			,{c:'fa fa-phone-volume',v:'6051'}		,{c:'fa fa-user',v:'6061'}			],
[{c:'fa fa-hospital-alt',v:'6002'}	,{c:'fa fa-ear',v:'6012'} 		,{c:'fa fa-file-signature',v:'6022'}	,{c:'fa fa-exclamation-triangle',v:'6032'}	,{c:'fa fa-scalpel-path',v:'6042'}			,{c:'fa fa-chalkboard-teacher',v:'6052'},{c:'fa fa-users',v:'6062'}			],
[{c:'fa fa-hospital',v:'6003'}		,{c:'fa fa-lungs',v:'6013'}		,{c:'fa fa-ballot-check',v:'6023'}		,{c:'fa fa-at',v:'6033'}					,{c:'fa fa-eye-dropper',v:'6043'}			,{c:'fa fa-shipping-fast',v:'6053'}		,{c:'fa fa-user-tie',v:'6063'}		],
[{c:'fa fa-chair',v:'6004'}			,{c:'fa fa-stomach',v:'6014'}	,{c:'fa fa-layer-plus',v:'6024'}		,{c:'fa fa-arrow-square-up',v:'6034'}		,{c:'fa fa-stethoscope',v:'6044'}			,{c:'fa fa-tasks',v:'6054'}				,{c:'fa fa-female',v:'6064'}	],
[{c:'fa fa-chair-office',v:'6005'}	,{c:'fa fa-heartbeat',v:'6015'}	,{c:'fa fa-file-prescription',v:'6025'} ,{c:'fa fa-map-marker-plus',v:'6035'}		,{c:'fa fa-video',v:'6045'}					,{c:'fa fa-hammer',v:'6055'}			,{c:'fa fa-child',v:'6065'}	],
[{c:'fa fa-briefcase',v:'6006'}		,{c:'fa fa-brain',v:'6016'}		,{c:'fa fa-notes-medical',v:'6026'}		,{c:'fa fa-minus-square',v:'6036'}			,{c:'fa fa-highlighter',v:'6046'}			,{c:'fa fa-hands-helping',v:'6056'}		,{c:'fa fa-baby',v:'6066'}			],
[{c:'fa fa-procedures ',v:'6007'}	,{c:'fa fa-hand-paper',v:'6017'},{c:'fa fa-file-medical-alt',v:'6027'}	,{c:'fa fa-stop-circle',v:'6037'}			,{c:'fa fa-prescription-bottle',v:'6047'}	,{c:'fa fa-handshake',v:'6057'}			,{c:'fa fa-restroom',v:'6067'}		],
[{c:'fa fa-warehouse-alt',v:'6008'}	,{c:'fa fa-kidneys',v:'6018'}	,{c:'fa fa-envelope',v:'6028'}			,{c:'fa fa-exclamation',v:'6038'}			,{c:'fa fa-pen',v:'6048'}					,{c:'fa fa-weight',v:'6058'}			,{c:'fa fa-user-friends',v:'6068'}	],
[{c:'fa fa-flask-poison ',v:'6009'}	,{c:'fa fa-virus',v:'6019'}		,{c:'fa fa-toolbox',v:'6029'}			,{c:'fa fa-calendar-edit',v:'6039'}			,{c:'fa fa-photo-video',v:'6049'}			,{c:'fa fa-head-side-mask',v:'6059'}	,{c:'fa fa-people-arrows',v:'6069'}	],
[{c:'fa fa-syringe',v:'6100'}		,{c:'fa fa-allergies',v:'6200'}	,{c:'fa fa-phone-slash',v:'6300'}		,{c:'fa fa-sunglasses',v:'6400'}			,{c:'fa fa-wrench',v:'6500'}				,{c:'fa fa-user-injured',v:'6600'}		,{c:'fa fa-user-check',v:'6700'}	]
],
timeboxing:[
	//			T I M E   B O X I N G
	//
	//          WHERE						CONDITION							 TOOLS									TIME								ACTIVITY								SYMBOL
[{c:'fa fa-car-side',v:'5000'}		,{c:'fa fa-child',v:'5010'}			,{c:'fa fa-person-booth',v:'5020'}		,{c:'fa fa-hourglass-half',v:'5030'},{c:'fa fa-highlighter',v:'5040'}		,{c:'fa fa-recycle',v:'5050'}				],
[{c:'fa fa-home',v:'5001'}			,{c:'fa fa-baby',v:'5011'}			,{c:'fa fa-hammer',v:'5021'}			,{c:'fa fa-play',v:'5031'}			,{c:'fa fa-coffee',v:'5041'}			,{c:'fa fa-shapes',v:'5051'}				],
[{c:'fa fa-hospital-alt',v:'5002'}	,{c:'fa fa-users',v:'5012'} 		,{c:'fa fa-car-mechanic',v:'5022'}		,{c:'fa fa-stop',v:'5032'}			,{c:'fa fa-chalkboard-teacher',v:'5042'},{c:'fa fa-info',v:'5052'}					],
[{c:'fa fa-hospital',v:'5003'}		,{c:'fa fa-user-tie',v:'5013'}		,{c:'fa fa-medkit',v:'5023'}			,{c:'fa fa-infinity',v:'5033'}		,{c:'fa fa-glass-cheers',v:'5043'}		,{c:'fa fa-exclamation-triangle',v:'5053'}	],
[{c:'fa fa-chair',v:'5004'}			,{c:'fa fa-user-friends',v:'5014'}	,{c:'fa fa-stethoscope ',v:'5024'}		,{c:'fa fa-pause',v:'5034'}			,{c:'fa fa-phone-volume',v:'5044'}		,{c:'fa fa-lightbulb-exclamation',v:'5054'}	],
[{c:'fa fa-person-carry',v:'5005'}	,{c:'fa fa-user-md',v:'5015'}		,{c:'fa fa-balance-scale',v:'5025'}		,{c:'fa fa-stopwatch',v:'5035'}		,{c:'fa fa-lock-open-alt',v:'5045'}		,{c:'fa fa-ban',v:'5055'}					],
[{c:'fa fa-procedures',v:'5006'}	,{c:'fa fa-users-cog',v:'5016'}		,{c:'fa fa-spa',v:'5026'}				,{c:'fa fa-watch ',v:'5036'}		,{c:'fa fa-lock-alt',v:'5046'}			,{c:'fa fa-arrow-square-up',v:'5056'}		],
[{c:'fa fa-warehouse-alt',v:'5007'}	,{c:'fa fa-users-class',v:'5017'}	,{c:'fa fa-video',v:'5027'}				,{c:'fa fa-sync',v:'5037'}			,{c:'fa fa-handshake',v:'5047'}			,{c:'fa fa-at',v:'5057'}					],
[{c:'fa fa-school ',v:'5008'}		,{c:'fa fa-user-clock',v:'5018'}	,{c:'fa fa-laptop',v:'5028'}			,{c:'fa fa-clock',v:'5038'}			,{c:'fa fa-hands',v:'5048'}				,{c:'fa fa-tasks',v:'5058'}					],
[{c:'fa fa-inbox-in ',v:'5009'}		,{c:'fa fa-users-medical',v:'5019'}	,{c:'fa fa-projector',v:'5029'}			,{c:'fa fa-redo',v:'5039'}			,{c:'fa fa-random',v:'5049'}			,{c:'fa fa-bells',v:'5059'}					],
[{c:'fa fa-inbox-out ',v:'5100'}	,{c:'fa fa-user-headset',v:'5200'}	,{c:'fa fa-shuttle-van',v:'5300'}		,{c:'fa fa-repeat-1',v:'5400'}		,{c:'fa fa-baby',v:'5500'}				,{c:'fa fa-comment-exclamation',v:'5600'}					]
],
logins:[
	//			L O G I N S   ( tag visible in chat )
	//
	//          USER 1						USER'S							 		GENDER 									SMILEY 1							Symbols								Objects									FUN
[{c:'fa fa-user',v:'7000'}			,{c:'fa fa-user-headset',v:'7010'}		,{c:'fa fa-user-friends',v:'7020'}		,{c:'fa fa-smile',v:'7030'}				,{c:'fa fa-heart',v:'7040'}		,{c:'fa fa-key',v:'7050'}			,{c:'fa fa-paw',v:'7060'}				,{c:'fa fa-tooth',v:'7070'}				],
[{c:'fa fa-user-times',v:'7001'}	,{c:'fa fa-user-shield',v:'7011'}		,{c:'fa fa-users',v:'7021'}				,{c:'fa fa-grin',v:'7031'}				,{c:'fa fa-spade',v:'7041'}		,{c:'fa fa-sunglasses',v:'7051'}	,{c:'fa fa-anchor',v:'7061'}			,{c:'fa fa-medkit',v:'7071'}			],
[{c:'fa fa-user-check',v:'7002'}	,{c:'fa fa-user-graduate',v:'7012'} 	,{c:'fa fa-users-class',v:'7022'}		,{c:'fa fa-grin-tongue-wink',v:'7032'}	,{c:'fa fa-diamond',v:'7042'}	,{c:'fa fa-cocktail',v:'7052'}		,{c:'fa fa-fish',v:'7062'}				,{c:'fa fa-cut',v:'7072'}				],
[{c:'fa fa-user-minus',v:'7003'}	,{c:'fa fa-user-md',v:'7013'}			,{c:'fa fa-users-cog',v:'7023'}			,{c:'fa fa-grin-beam',v:'7033'}			,{c:'fa fa-club',v:'7043'}		,{c:'fa fa-plane',v:'7053'}			,{c:'fa fa-at',v:'7063'}				,{c:'fa fa-low-vision',v:'7073'}		],
[{c:'fa fa-user-cog',v:'7004'}		,{c:'fa fa-user-visor',v:'7014'}		,{c:'fa fa-users-medical',v:'7024'}		,{c:'fa fa-grin-beam-sweat',v:'7034'}	,{c:'fa fa-hexagon',v:'7044'}	,{c:'fa fa-gem',v:'7054'}			,{c:'fa fa-gingerbread-man',v:'7064'}	,{c:'fa fa-balance-scale-left',v:'7074'}],
[{c:'fa fa-user-plus',v:'7005'}		,{c:'fa fa-user-chart',v:'7015'}		,{c:'fa fa-people-arrows',v:'7025'}		,{c:'fa fa-kiss-wink-heart',v:'7035'}	,{c:'fa fa-play',v:'7045'}		,{c:'fa fa-thumbtack',v:'7055'}		,{c:'fa fa-apple-alt',v:'7065'}			,{c:'fa fa-car-mechanic',v:'7075'}		],
[{c:'fa fa-user-tag',v:'7006'}		,{c:'fa fa-chalkboard-teacher',v:'7016'},{c:'fa fa-house-user',v:'7026'}		,{c:'fa fa-laugh-squint ',v:'7036'}		,{c:'fa fa-bookmark',v:'7046'}	,{c:'fa fa-paperclip',v:'7056'}		,{c:'fa fa-mask',v:'7066'}				,{c:'fa fa-wheelchair',v:'7076'}		],
[{c:'fa fa-user-edit',v:'7007'}		,{c:'fa fa-user-tie',v:'7017'}			,{c:'fa fa-hospital-user',v:'7027'}		,{c:'fa fa-smile-beam',v:'7037'}		,{c:'fa fa-star',v:'7047'}		,{c:'fa fa-cube',v:'7057'}			,{c:'fa fa-infinity',v:'7067'}			,{c:'fa fa-head-vr',v:'7077'}			],
[{c:'fa fa-user-clock ',v:'7008'}	,{c:'fa fa-user-nurse',v:'7018'}		,{c:'fa fa-user-alien',v:'7028'}		,{c:'fa fa-smile-wink',v:'7038'}		,{c:'fa fa-comment',v:'7048'}	,{c:'fa fa-flower',v:'7058'}		,{c:'fa fa-spa',v:'7068'}				,{c:'fa fa-glasses',v:'7078'}			],
[{c:'fa fa-user-crown ',v:'7009'}	,{c:'fa fa-user-cowboy',v:'7019'}		,{c:'fa fa-alien',v:'7029'}				,{c:'fa fa-grin-tongue',v:'7039'}		,{c:'fa fa-omega',v:'7049'}		,{c:'fa fa-snowflake',v:'7059'}		,{c:'fa fa-pencil',v:'7069'}			,{c:'fa fa-user-secret',v:'7079'}		]
]
};
(C_iSKIN.tagsreset = function() { // sets up C_iSKIN.bank from C_iSKIN.csstags
	C_iSKIN.bank[0] = 'tag-none';
	for(let category in C_iSKIN.csstags)
		for(let x in C_iSKIN.csstags[category]) {
			let line = C_iSKIN.csstags[category][x];
			for(let item in line) { let pair = line[item]; C_iSKIN.bank[pair.v] = pair.c; }
		}
})();

C_iSKIN.options = {
	colors: function(eid, allownone) {
		let tds = new Array, table;
		let colspan = 9;
		if(allownone) {
			tds.push('<td class="allownone" style="visibility:hidden" colspan='+(colspan-3)+'></td><td colspan=3><css>c0 allownone</css><val>c0</val>'+C_XL.w('none ff')+'</td>');
			tds.push('<th colspan='+colspan+' class="header">&nbsp;</th>');
		}
		tds.push('<td>c111</td><td>c104</td><td>c108</td><td>c106</td><td>c100</td><td>c107</td><td>c101</td><td>c103</td><td>c110</td>');
		tds.push('<th colspan='+colspan+' class="header">&nbsp;</th>');
		tds.push('<td>c90</td><td>c120</td><td>c130</td><td>c140</td><td>c150</td><td>c160</td><td>c170</td><td>c180</td><td>c113</td>');
		tds.push('<td>c91</td><td>c121</td><td>c131</td><td>c141</td><td>c151</td><td>c161</td><td>c171</td><td>c181</td><td>c102</td>');
		tds.push('<td>c97</td><td>c122</td><td>c132</td><td>c142</td><td>c152</td><td>c162</td><td>c172</td><td>c182</td><td>c105</td>');
		tds.push('<td>c98</td><td>c123</td><td>c133</td><td>c143</td><td>c153</td><td>c163</td><td>c173</td><td>c183</td><td>c109</td>');
		tds.push('<td>c99</td><td>c124</td><td>c134</td><td>c144</td><td>c154</td><td>c164</td><td>c174</td><td>c184</td><td>c114</td>');
		tds.push('<th colspan='+colspan+' class="header">&nbsp;</th>');
		tds.push('<td>c210</td><td>c220</td><td>c230</td><td>c240</td><td>c250</td><td>c260</td><td>c270</td><td>c280</td><td>c290</td>');
		tds.push('<td>c211</td><td>c221</td><td>c231</td><td>c241</td><td>c251</td><td>c261</td><td>c271</td><td>c281</td><td>c291</td>');
		tds.push('<td>c212</td><td>c222</td><td>c232</td><td>c242</td><td>c252</td><td>c262</td><td>c272</td><td>c282</td><td>c292</td>');
		tds.push('<td>c213</td><td>c223</td><td>c233</td><td>c243</td><td>c253</td><td>c263</td><td>c273</td><td>c283</td><td>c293</td>');
		tds.push('<td>c214</td><td>c224</td><td>c234</td><td>c244</td><td>c254</td><td>c264</td><td>c274</td><td>c284</td><td>c294</td>');
		tds.push('<td>c215</td><td>c225</td><td>c235</td><td>c245</td><td>c255</td><td>c265</td><td>c275</td><td>c285</td><td>c295</td>');
		tds.push('<td>c216</td><td>c226</td><td>c236</td><td>c246</td><td>c256</td><td>c266</td><td>c276</td><td>c286</td><td>c296</td>');
		tds.push('<td>c217</td><td>c227</td><td>c237</td><td>c247</td><td>c257</td><td>c267</td><td>c277</td><td>c287</td><td>c297</td>');
		
		table = '<table id="'+eid+'" class="skin-picker colors">'+'<tr>'+tds.join('</tr><tr>')+'</tr>'+'</table>';
		return table;
	},
	patterns: function(eid, allownone) {
		let tds = new Array, trs, table;
		let colspan = 4;
		if(allownone) {
			tds.push('<td class="allownone" style="visibility:hidden" colspan='+(colspan-2)+'></td><td colspan=2><css>p0 allownone</css><val>p0</val>'+C_XL.w('none')+'</td>');
		}
		tds.push('<th colspan='+colspan+' class="header">&nbsp;</th>');
		tds.push('<td>p800</td><td>p801</td><td>p802</td><td>p803</td>');
		tds.push('<td>p804</td><td>p805</td><td>p806</td><td>p807</td>');
		tds.push('<td>p810</td><td>p811</td><td>p812</td><td>p813</td>');
		tds.push('<td>p820</td><td>p821</td><td>p822</td><td>p823</td>');
		tds.push('<td>p900</td><td>p901</td><td>p902</td><td>p903</td>');
		tds.push('<td>p910</td><td>p911</td><td>p912</td><td>p913</td>');
		table = '<table id="'+eid+'" class="skin-picker patterns">'+'<tr>'+tds.join('</tr><tr>')+'</tr>'+'</table>';
		return table;
	},
	eskins: function(eid, allownone) {
		let trs = new Array, table;
		trs.push('<th colspan=2 class="header">&nbsp;</th>');
		if(allownone) {	trs.push('<tr><td colspan=2>'+C_XL.w('none')+'<css>none</css><val></val></td></tr>'); }
		let td = function(v) { return '<td>'+C_XL.w(v)	+'<css>'+v+'</css>	<val>'+v+'</val></td>'; } 
		let tr = function(l,r) { return '<tr>'+td(l)+td(r)+'</tr>'; }
		let left = [ 'mobminder', 'business', 'doctors', 'mecas', 	'edoc', 	'doctortie', 'handpeople', 	'stoneleaves', 	'flowers' ];
		let right = [ 'medminder', 'clinics', 'lawyers', 'wellness','emedical', 'stetosblue', 'caduceus', 	'bambstones', 	'flowerpetals' ];
		for(let x in left) trs.push(tr(left[x], right[x])); // like '<td>'+C_XL.w('business')	+'<css>business</css>	<val>business</val></td>'
		table = '<table id="'+eid+'" class="skin-picker e-skins">'+trs.join('')+'</table>';
		return table;
	},
	tags: function(eid, bank, allownone) {
		let trs = new Array;
			let dress = function(cvarray) {
				let l = []; for(let x in cvarray) {
					let css = cvarray[x].c, value = cvarray[x].v;
					l.push('<css>'+css+'</css><val>'+value+'</val>');
				}
				return '<td>'+l.join('</td><td>')+'</td>';
			}
		
		if(allownone) {
			let colspan = bank[0].length;
			trs.push('<td class="allownone" style="visibility:hidden" colspan='+(colspan-2)+'></td><td colspan=2><css>allownone</css><val>0</val>'+C_XL.w('none')+'</td>');
		}
		for(let x in bank) { let line = bank[x]; trs.push(dress(line));	}
		
		let table = '<table id="'+eid+'" class="skin-picker tags">'+'<tr style="white-space:nowrap;">'+trs.join('</tr><tr style="white-space:nowrap;">')+'</tr>'+'</table>';
		return table;
	},
	display: function(skinmode, eid, allownone) {
		let that = C_iSKIN.options;
		switch(skinmode) {
			case skin.color: 	return that.colors(eid, allownone);
			case skin.pattern: 	return that.patterns(eid, allownone);
			case skin.eresa: 	return that.eskins(eid, allownone);
			case skin.tag: 		return that.tags(eid, C_iSKIN.csstags.agenda, allownone);
			case skin.acctag: 	return that.tags(eid, C_iSKIN.csstags.account, allownone);
			case skin.rsctag: 	return that.tags(eid, C_iSKIN.csstags.resources, allownone);
			case skin.tbxtag: 	return that.tags(eid, C_iSKIN.csstags.timeboxing, allownone);
			case skin.wkctag: 	return that.tags(eid, C_iSKIN.csstags.workcodes, allownone);
			case skin.logtag: 	return that.tags(eid, C_iSKIN.csstags.logins, allownone);
		}
	},
	activate: function(table, selected /*must be the css value*/, onclick) {
		if(vbs) vlog('controls.js','C_iSKIN','options.activate','selected='+selected); 
		$(table).find('td').each(
			function(){
				$(this).mouseover( function(){ $(this).addClass('point');} ).mouseout(function(){ $(this).removeClass('point');} );
				let i = this.innerHTML; // which is the content of the cell as built so far
				if(i.search('<css>')==-1) { // treating here tds having no <css></css><val></val> structure
					$(this).addClass(i); // inner HTML is together the css class AND the value to be returned when clicked (case for colors, patterns)
					if(i == selected) $(this).addClass('selected');
					$(this).click(function() { return onclick(this.innerHTML) } );
					
				} else { // then we have different indications for css class and for value  (case for tags, acctags)
						let css = i.between('<css>','</css>'); $(this).addClass(css);
						let val = i.between('<val>','</val>'); $(this).click(function() { return onclick(val) } );
					if(val == selected) $(this).addClass('selected');
					this.innerHTML = i.excise('<css>','</css>').rest.excise('<val>','</val>').rest;
				}  
			}
		);
	},
	selected: function(table, css) {
		if(vbs) vlog('controls.js','C_iSKIN','options.selected','css='+css); 
		$(table).find('td').removeClass('selected');
		$(table).find('.'+css).addClass('selected');
	}
}



function C_iIMG(eid, callbacks, preset) {  // inserting an image that can be changed and resized
	
	let b = eid+'_img'+'_'; // base sub eid
	this.eids = { wrap:b+'wrp', img:b+'img'	};	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onclick }
	this.state = C_iIMG.defaults.align(preset);
	this.image = new Image();
	let that = this; this.image.onload = function() { that.setsize(); }; // image  has been loaded
	this.image.src = this.getpathfile();
}
C_iIMG.defaults = new A_df({ path:'../themes/default/', file:'moblogo25.jpg', size:'80%' });
C_iIMG.prototype = {
	display: function() {
			let path = 'src="'+this.getpathfile()+'"';
		return '<div id="'+this.eids.wrap+'"><img id="'+this.eids.img+'" style="" '+path+' summary="" class=""/></div>';
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.setsize();
	},
	setsize: function(size) {
		size = size||this.state.size; this.state.size = size;
		let img = this.elements.img;
		if(!img) return;
		let s = { w:img.naturalWidth, h:img.naturalHeight }; // original image size in pixels
		let spc = this.state.size.slice(0, -1)|0; // turns 69% into 69
		let ns = { w:s.w*spc/100|0, h:s.h*spc/100|0 } // new image size in pixels
		if(vbs) vlog('mobminder.js','C_iIMG','setsize','image:'+this.state.file+', size:'+size+' ('+ns.w+'px/'+ns.h+'px) from ('+s.w+'px/'+s.h+'px)');
		this.elements.img.setAttribute('style', 'height:'+ns.h+'px; width:'+ns.w+'; max-width:100%; max-height:20em;');
	},
	setfile: function(file, path) { // programmaticaly/dynamicaly change the image source see (*f09*)
		file = file||this.state.file; this.state.file = file;
		path = path||this.state.path; this.state.path = path;
		let pathfile = this.getpathfile();
		this.image.src = pathfile;
		if(vbs) vlog('mobminder.js','C_iIMG','setfile','image:'+pathfile);
		if(path) if(file) this.elements.img.setAttribute('src', pathfile);
		return this;
	},
	hide: function(hidden) {
		if(vbs) vlog('mobminder.js','C_iIMG','hide','hide:'+(hidden?'yes':'no')+' on image:'+this.state.file);
		if(!!hidden) this.elements.wrap.setAttribute('style', 'display:none');
			else this.elements.wrap.setAttribute('style', 'display:block');
		return this;
	},
	
	// privates
	getpathfile: function() {
		return this.state.path+this.state.file;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     C U S T O M    C S S 
//

function C_iCSS(eid, callbacks, preset) { // preset like { enabled:true, hidden:false, cssclass:class_chat, csstype:color, value:0, span:false }
		preset = preset || {};
	let csstype = preset.csstype, cssclass = preset.cssclass;
	this.eids = { ui:eid+'_ui', checks:eid+'_cks' };
	this.elements = new A_el();
	this.callbacks = callbacks; // like { select:o_callback, escaped:o_callback } 
	let popui = preset.blind ? eid : this.eids.ui; // when used on C_iDAY, pops from a day square like [16]
		let css = 'skin-face alpha12 like-input';
		let poppreset = { tag:'div', ui:'', css:css, blind:preset.blind } 
	let pop; 
	switch(csstype) {
		case ccsstype.color: 
		case ccsstype.pattern: 
				this.options = C_dS_customCss.options(cssclass, csstype);
			pop = new C_iPOP(popui, { escape:new A_cb(this, this.escape), enter:new A_cb(this, this.enter), popped:new A_cb(this, this.popped) }, poppreset );
			break;
		case ccsstype.tag:
					let precheck = preset.value?preset.value.split('!'):false;
				this.options = C_dS_customCss.options(cssclass, csstype, precheck);
			pop = new C_iCRESTA(this.eids.checks, { onchange:new A_cb(this, this.onchecks) }, this.options, { skin:1, mode:0, title:false /*C_XL.w('tags')*/, emptypost:'' } );
			break;
	}
	this.controls = new A_ct( {pop:pop} );
	this.modal = false;
	this.state = C_iCSS.defaults.align(preset);
		if(vbs) vlog('controls.js','C_iCSS','constructor','type:'+this.state.csstype+', cssclass:'+cssclass+', value:'+this.state.value);
	this.menu = false;
}
C_iCSS.defaults = new A_df( { enabled:true, hidden:false, cssclass:false, csstype:false, value:false, span:false } );
C_iCSS.prototype = {
	// public
	hasany: function() { 
		switch(this.state.csstype) {
			case ccsstype.color: 
			case ccsstype.pattern: 
				return (this.options.count-1);
			case ccsstype.tag:
				return (this.options.count); // there is no "default" option for tags
		}
	 }, // minus one is the default color
	display: function(css) { return this.controls.pop.display(css);},	
	labelled: function(english, css) { return this.controls.pop.labelled(english, css);},
	activate: function() { // must be called after display
		this.elements.collect(this.eids);
		this.controls.activate('C_iCSS');
		this.setvalue(this.state.value);
		return this;
	},
	set: function(value) {
		if(vbs) vlog('controls.js','C_iCSS','set','type:'+this.state.csstype+', value:'+value);
		this.setvalue(value);
		if(this.menu) this.menu.select(value, true, {reset:true});
		if(this.callbacks.select) this.callbacks.select.cb(value);
	},
	lock: function(options, locked) {
		// this.options.lock(options, locked);
	},
	value: function() { return this.state.value; },
	getpost: function() { return this.state.value; },
	drop: function() { this.controls.pop.drop(); return this; }, // for idle controls, programmaticaly drops the menu
	close: function() { this.controls.pop.close(); return this; }, // programmaticaly closes the menu
	optcount: function() { return this.options.count; },
	optfirst: function() { return this.options.top; },
	setCcssClass: function(ccssClass, value) { // changes the set of options according to ccssClass
			let tagspreset=0; if(this.controls.pop instanceof C_iCRESTA) tagspreset = value.split('!');
			this.state.cssclass = ccssClass;
		this.options = C_dS_customCss.options(ccssClass, this.state.csstype, tagspreset);
		this.setvalue(value);
		if(vbs) vlog('controls.js','C_iCSS','setCcssClass','type:'+this.state.csstype+', ccssClass:'+ccssClass+', value:'+value);
	},

	// private
	setvalue: function(value) {
		if(vbs) vlog('controls.js','C_iCSS','setvalue','type:'+this.state.csstype+', value:'+value);
		if(this.controls.pop instanceof C_iPOP)
			if(value in this.options.labels) {
				this.state.value = value;
				let dS = C_dS_customCss.getByType(this.state.cssclass, this.state.csstype, value); 
				this.controls.pop.set(dS.name, dS.cssName); // changes the displayed choice on the control face
			}
		if(this.controls.pop instanceof C_iCRESTA)
			this.controls.pop.clear(this.options); // changes the options appearing on the screen
		return this;
	},
	scrollto: function(value) {
		this.controls.pop.scrollto(this.menu.getelement(value), { axis:'y', offset:-100 }); // (*e01*)
	},
	enter: function(e) {  // C_iPOP event handler, ui hit, lets the pad appear
		this.menu = new C_iMENU(this.eids.ui, { onlabel:new A_cb(this, this.select) }, this.options, { maxcols:1, value:this.state.value } )
		return { body:this.menu.display() };
	},
	popped: function(e) {  // C_iPOP event handler, ui hit, lets the pad appear
		this.menu.activate();
		this.scrollto(this.state.value);
	},
	escape: function() { if(this.callbacks.escaped) this.callbacks.escaped.cb(); return true; },
	
	// callbacks
	onchecks: function(value) { // C_iCRESTA only for tags, in case of tags, there is multi selection allowed, value can be e.g.'5521,5426,5526'
		if(vbs) vlog('controls.js','C_iCSS','onchecks','type:'+this.state.csstype+', value:'+value);
		this.state.value = value.join('!'); // so to be in post format, like '5521!5426!5526'
	},
	select: function(value) {  // C_iMENU event handler, option picked from the pad, can be called inline before activation
		if(vbs) vlog('controls.js','C_iCSS','select','type:'+this.state.csstype+', value:'+this.state.value);
		this.setvalue(value);
		if(this.callbacks.select) this.callbacks.select.cb(value);
		this.controls.pop.close();
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F    G E N D E R
//
function C_iGENDER(eid, callbacks, preset) {
	this.state = C_iGENDER.defaults.align(preset);
		if(this.state.force == false) this.state.match = true; // we assume you preset a valid value
		
	let gender = new C_iDDWN(eid, { onselect:new A_cb(this, this.select) }, { labels:C_XL.w(genders.english) }, { value:this.state.gender, maxcols:1, maxrows:1, mandatory:new A_cb(this, this.valid) } );
	this.controls = new A_ct({gender:gender});
}
C_iGENDER.defaults = new A_df( { gender:1, selected:false, force:false, match:false } );
C_iGENDER.prototype = {
	display: function(css) { return this.controls.gender.display(css);	},
	labelled: function(english, css) { return this.controls.gender.labelled(english, css);	},
	activate: function() { this.controls.activate(); this.controls.gender.setvalid(); },
	digits: function(digits) {
		this.state.selected = false; // as soon as you use digits to determine the value of gender, you loose de "selected" status
		this.state.force = true; // as soon as you change the digits, you cancel the initial condition that was assumed ok
		this.state.match = false; // guessed() will determine if you entered matching stuff
		this.controls.gender.setvalid();
		if(!digits) return;
		let post = new C_iPASS({digits:digits});
		mobminder.app.post({post:post}, {post:{digits:'name'}}, './queries/gender.php', new A_cb(this, this.guessed, digits) );
		this.controls.gender.busy(true);
	},
	set: function(v) { if(v in genders.english) this.controls.gender.set(v); return this; },
	guessed: function(digits, dS, stream) {
		this.controls.gender.busy(false);
		let gender = stream.split('##').shift();
		if(gender == 'x') {
			this.state.match = false; 
		} else {
			this.controls.gender.set(gender|0);
			this.state.match = true; 
		}
		this.controls.gender.setvalid(); 
	},
	select: function(value) {
		this.state.selected = true;
		this.controls.gender.setvalid(true); 
	},
	valid: function() {
		let valid; 
		if(this.state.force) valid = this.state.match || this.state.selected; // when in "force" mode, the user must enter a matching string, or choose himself a value.
			else valid = true;
		return valid;
	},
	getpost: function() { return this.controls.gender.getpost(); }
	
	// callbacks from sub controls
}




function C_iNOTE(eid, textpreset, preset) {
	this.state = C_iNOTE.defauts.align(preset = preset || {});
	this.field = new C_iFIELD(eid, false, { digits:textpreset, type:preset.type||INPUT_TEXTAREA, placeholder:preset.placeholder, rows:preset.rows, focus:preset.focus, dblclick:false, enabled:preset.enabled }); 
}
C_iNOTE.defauts = new A_df( { rows:5 } );
C_iNOTE.prototype = {
	display: function(cssTitle, cssField, label, options) {
		return this.field.display(cssField, label, cssTitle, options);
	},
	labelled: function(label, css, options) {		
		options = options || { xl:true };
		label = options.xl?C_XL.w(label):label;
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+label+'</td><td>'+this.field.display(css)+'</td>';
	},
	activate: function() { this.field.activate(); },
	insert: function(i) { return this.field.insert(i); },
	focus: function(set) { return this.field.focus(set); },
	getpost: function() { return this.field.getpost(); }
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F    F U S I O N     T A G
//
function C_iTAGS(eid, callbacks, preset) {
	this.state = C_iTAGS.defauts.align( preset = preset||{} );
	this.eids = { options:eid+'_ops', ui:eid+'_ui', scroll:eid+'_scroll' };
	this.callbacks = callbacks || {}; // like { ontag:, ontemplate: };
	let captions = C_XL.w(mobtags.fusion); //  mobtags.fusion (*T01*) in language.js, see also C_iTAGS
	let clicks = []; 
	for(let m in captions) {
		let caption = captions[m];
		clicks[m] = new C_iCLIK(this.eids.options+'_'+m, { click:new A_cb(this, this.ontag, m) }, { tag:'li', ui:caption } );
	}
	this.controls = new A_ct(clicks);
}
C_iTAGS.defauts = new A_df( { medium:msgmedium.sms } );
C_iTAGS.prototype = {
	display: function(cssTitle, css) {
		
		let isemail = (this.state.medium==msgmedium.email)
		
		let lis = { templ:[], resa:[], visi:[], att:[] };
		lis.templ.push(this.controls.tmp_confirm.display());
		lis.templ.push(this.controls.tmp_eve.display());
		lis.templ.push(this.controls.tmp_oneweek.display());
		
		lis.visi.push(this.controls.dear.display());
		lis.visi.push(this.controls.gender.display());
		lis.visi.push(this.controls.firstname.display());
		lis.visi.push(this.controls.lastname.display());
		lis.visi.push(this.controls.company.display());
		lis.visi.push(this.controls.mobile.display());
		if(isemail) lis.visi.push(this.controls.info.display());
		lis.visi.push(this.controls.registration.display());
		lis.visi.push(this.controls.address.display());
		
		lis.resa.push(this.controls.resadate.display());
		lis.resa.push(this.controls.resaday.display());
		lis.resa.push(this.controls.cuein.display());
		lis.resa.push(this.controls.resanote.display());
		lis.resa.push(this.controls.bookingcode.display());
			let haswk = mobminder.account.has.workcodes||mobminder.account.has.eworkcodes;
		if(haswk) lis.resa.push(this.controls.perf.display());
		if(haswk) if(isemail) lis.resa.push(this.controls.perfnote.display());
		
		lis.att.push(this.controls.business.display());
		lis.att.push(this.controls.bcal.display());
		if(mobminder.account.has.uCal) lis.att.push(this.controls.ucal.display());
		if(mobminder.account.has.fCal) lis.att.push(this.controls.fcal.display());
		lis.att.push(this.controls.participants.display());

		// set up all this in a table
		let rows = new Array();
		rows[0] = '<td class="label">'+C_XL.w('predefined')+'</td><td><ul>'+lis.templ.join('')+'</ul></td>';
		rows[1] = '<td class="label">'+C_XL.w('visitor')+'</td><td><ul>'+lis.visi.join('')+'</ul></td>';
		rows[2] = '<td class="label">'+C_XL.w('appointment')+'</td><td><ul>'+lis.resa.join('')+'</ul></td>';
		rows[3] = '<td class="label">'+C_XL.w('attendee')+'</td><td><ul>'+lis.att.join('')+'</ul></td>';
		let rowsAll = '<tr>'+rows.join('</tr><tr>')+'</tr>';
		return '<table summary="message tokens" style="display:inline-block; margin-left:1em;">'+rowsAll+'</table>';
	},
	activate: function() { this.controls.activate(); },
	ontag: function(tag) {
		switch(tag) {
			case 'tmp_confirm': 
			case 'tmp_eve':
			case 'tmp_oneweek':
				if(this.callbacks.ontemplate) this.callbacks.ontemplate.cb(tag);
				break;
			default:
				if(this.callbacks.ontag) this.callbacks.ontag.cb(tag);
		}
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   S E L E C T I O N   F I L T E R
//
function C_iAC(eid, leadClass, callbacks, preset) { // in here you select ONLY ONE OPTION by typing letters in an alphanum field
	//
	// Leadclass required features:
	//
	// a function named options() that returns an object like { value1: label1, value2: label2, ...} through a A_cb feedback
	// a function named optionlabel that returns the label to be displayed on the ui field when a preset value is given at preset
	//
	this.leadClass = leadClass;
	this.eids = { ops:eid+'_ops', ui:eid+'_ui', scroll:eid+'_scroll', button:eid+'_buttn', noref:eid+'_noref' };
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { typing:, acselect:, acclear:, acxtrapass: }; // acxtrapass are sent to the server on ACoptions.fetch() executions
	this.ACoptions = typeof(this.leadClass.ACoptions)==='function' ? new this.leadClass.ACoptions(preset) : this.leadClass.ACoptions;
	this.state = C_iAC.defauts.align(preset=preset||{});
	let digits = this.state.value ? this.ACoptions.label(this.state.value) : '';
		if(preset.digits) digits = preset.digits;
		
		let typing = new A_cb(this, this.typing);
	let ui = new C_iFIELD(this.eids.ui, 
							{ 	onfclick:new A_cb(this, this.clicked), 
								onffocus:new A_cb(this, this.focused), 
								onfchange:new A_cb(this, this.changed, null, typing, 800), 
								onfclear:new A_cb(this, this.cleared), 
								onfcancel:new A_cb(this, this.close)	// only for touch devices, when hitting the cancel X button
								}, 
							{ focus:preset.focus, digits:digits, 
								type:INPUT_AC, 
								placeholder:preset.placeholder, 
								mandatory:preset.mandatory 	}
						); 
	
	this.options = false;
	this.menu = false;
	this.controls = new A_ct({ ui:ui });
	this.ui = ui; // the field used to drive the ac filtering (is the one of the modal in modal mode)
	this.buttons = new A_ct(); // this one is not activated here, it has to be activated from the caller controls
	
	// this.state.trigger: It sets how many digits must be typed before options are displayed
	this.state.trigger = this.ACoptions.trigger; // trigger is ruled by the genesis class
	if(this.state.trigger==0) { // automatic adaptative trigger (default when not ruled by genesis class)
			let c = this.ACoptions.count(); // see (*ac10*)
		if(c>=50) this.state.trigger = 1; // the more options can be the more filter digits are required before a call is made to the options bank
		if(c>=100) this.state.trigger = 2;
		if(c>=200) this.state.trigger = 3;
	}
	
	if(preset.buttons) 
		for(let bname in preset.buttons)
			this.buttons.add1(preset.buttons[bname], bname);
}
C_iAC.defauts = new A_df( { 
/* mode */ 	  value:'', button:false, exclude:false, autoclose:false, postlabel:false, css:false, trigger:3, placeholder:'', ismulti:false
/* state */ , queried:''
} );
C_iAC.prototype = {

	// public functions
	display: function(css) {	
		this.state.css = css||'';
		let face = this.controls.ui.display(this.state.css);
		let buttons = ''; for(let bname in this.buttons.get) buttons += this.buttons[bname].display();
			
		// let button = this.controls.button ? this.controls.button.display() : '';
		return face+buttons;
	},
	labelled: function(english, css) {
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.display(css||'alpha16')+'</td>';
	},
	activate: function() {
		// C_iAC.register[this.eids.ui] = this;
		this.elements.collect(this.eids);
		this.controls.activate(); 
	},
	enable: function(onOff) { // can be called before or after activation
		this.controls.ui.enable(onOff);
		return this;
	},
	hide: function(onOff) { // can be called before or after activation
		this.controls.ui.hide(onOff);
		return this;
	},
	clear: function() { 
		if(vbs) vlog('controls.js','C_iAC', 'clear', '');
		this.controls.ui.clear({ propagate:false });
		this.close();
		this.state.value = ''; 
	},
	blur:function() {
		this.controls.ui.blur(); return this;
	},
	focus: function(set) { // can be called before or after activation
		this.controls.ui.focus(set); return this;
	},
	getpost: function() { 
		if(this.state.postlabel) return this.controls.ui.getpost();
		else return this.state.value; 
	},
	valid: function() { return this.ui.valid(); },
	digits: function() { return this.ui.digits(); },
	isopen: function() { return !!(this.droppy); },
	set: function(digits) { this.controls.ui.set(digits); return this; },
	
	// private event handling
	scrollto: function(value) {
		let td = this.menu.getelement(value); // (*e01*)
		if(td) this.droppy.scrollto(td, { axis:'y', offset:-100 });
	},
	load: function(digits, options, presets) {  // lets the pad appear

			let labels = options;
				presets = presets || []; // they contain the tooltip indications
			let order = new Array(); for(let x in labels) order.push(x);
			let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
			let count = order.length;
		if(vbs) vlog('controls.js','C_iAC', 'load', 'digits:'+digits+', items found:'+count);
		
			this.options =  { order:order, labels:labels, presets:presets, count:count };
			let menupreset = { maxcols:1, tabselect:true, ismulti:this.state.ismulti };
		this.menu = new C_iMENU(this.eids.ops, { onarrow:new A_cb(this, this.onarrow), onlabel:new A_cb(this, this.select), onmulti:new A_cb(this, this.multiselect) }, this.options, menupreset);
		
		this.changed(); // now that this.options is defined, the changed() function will drop the modal
		this.ui.removeClass('loading');
	},
	drop: function() { // when used in drop mode (not appropriate for small touch devices)
	
		if(vbs) vlog('controls.js','C_iAC', 'drop', 'droppping the modal');
		if(!is.tactile) if(!this.ui.isfocused()) { return false; } // AC has lost the focus in the meanwhile of looping to the server
		
		let body = this.menu.display();
		// display in a droppy that hangs at the input field corner
			let css = 'pad'; if(is.newtouch) css = 'touchdev';
		this.droppy = new C_iMODAL(
			{ body:body, header:'-' }, // header is intentionnally not empty, that forces the control to display it
			{ escape:new A_cb(this, this.escape) }, 
			{ css:css, position:{ drop:{ui:this.ui.elements.ui}, offset:{x:0,y:5} }, size:{maxy:'24em'} } 
		);
		this.menu.activate(); 
		this.changed(); // now that we have options and a dropped menu, this call will display a subset of the options
	},
	close: function() {
		if(vbs) vlog('controls.js','C_iAC', 'close', 'droppy:'+(!!this.droppy)+', modal:'+(!!this.modal));
		if(this.droppy) this.droppy.close();
		this.options = false;
		this.menu = false;
		this.droppy = false;
		return this;
	},
	subset: function() {
		
		let digits = this.ui.state.digits; // we take the actual ui digits because some users continue on typing to select a firstname further in the list
			digits = digits.replace(/\./gi,''); // remove the . that was optionaly used to specify an exact name
		let remains = this.menu.subset(digits); // displays in the list of options only the subset that contains the given digits
		
		if(vbs) vlog('controls.js','C_iAC', 'subset', 'digits:'+digits+', remains:'+remains+', autoclose:'+this.state.autoclose);
		if(remains) { 
			this.scrollto(this.state.highlighted); 
			this.droppy.html({header:''});
			return;
		};
		
		// arrived here, the list is empty and we display a message in the header, stating so OR we just close up
		if(this.state.autoclose) return this.close();
		
		let msg = C_XL.w('no reference for')+' <b class="match">"'+digits+'"</b>'+'&nbsp;[X]';
		let noref = new C_iCLIK(this.eids.noref, { click:new A_cb(this, this.close)}, { tag:'a', ui:msg } );
		this.droppy.html({header:noref.display()});
		noref.activate();
	},
	select: function(value, ctrlkey) {  // event handler, option picked from the pad, can be called inline before activation
		
		if(vbs) vlog('controls.js','C_iAC', 'select', 'value:'+value+', ctrlkey:'+ctrlkey);
		if(value) {
			this.state.value = value;
			this.ui.set(this.options.labels[value], { propagate:false });
		}
		
			this.ui.focus(true); // keeps the focus on this control (keep this statement before close() and clear(), because this.focused() is called back from C_iFIELD, the field should not be empty when we call this function back )
			this.close();
			this.ui.modalquit(); // newtouch
			
		if(this.callbacks.acselect) this.callbacks.acselect.cb(value);
	},
	multiselect: function(values) {  // event handler, option picked from the pad, can be called inline before activation
		
		if(vbs) vlog('controls.js','C_iAC', 'multiselect', 'ismulti:'+this.state.ismulti, values);
		if(this.callbacks.acmulti) this.callbacks.acmulti.cb(values); // value sis an array like [ x:v1, x:v2, x:v3 ] where x was the position in the list and v are the values of options
	},
	typing: function() {
		if(this.callbacks.typing) this.callbacks.typing.cb();
	},
	changed: function(digits) {  // event handler, any change typed in to the input ui field
		if(vbs) vlog('controls.js','C_iAC', 'changed', 'digits:'+digits);
		if(!digits) digits = this.ui.state.digits;
		this.state.value = false; // no selection 
		let query = digits.replace(/[ ,\-]/gi,''); 
			// dot is allowed for exact match request, and should be counted as a trigger character
			// white spaces, slashes and - are also allowed for birth date but are not counted for triggering a search
			// spaces, comas, minus ARE SENT to the server for query.
			// 
		let length = query.length; // takes into account only the number of valid letters, special chars are ignored
		let trigger = this.state.trigger;
		let figspattern = new RegExp(/[0-9]/); let figures = figspattern.test(query); if(figures) trigger+=2;
		if(length<trigger) {
			this.ui.removeClass('loading');
			this.close(); // keep the list closed as long as we don't have enough digits
			if(vbs) vlog('controls.js','C_iAC', 'changed', 'query:'+query+', length:'+length+', trigger:'+trigger+', too short');
			return;
		}
		if(length>=trigger && !this.options) { // if no pad is displayed yet
			this.ui.addClass('loading');
			this.state.queried = query;
			if(vbs) vlog('controls.js','C_iAC', 'changed', 'digits:'+digits+', query:'+query+', first fetch');
				let x = this.callbacks.acxtrapass ? this.callbacks.acxtrapass.cb() : undefined;
			return this.ACoptions.fetch(digits, new A_cb(this, this.load), this.state.exclude, x); // calls for options then drops the pad
		}
		if(length>=trigger && length<this.state.queried.length) { // when you reduce the number of digits from which were fetched yet
			this.ui.addClass('loading');
			this.state.queried = query;
			this.close();
			if(vbs) vlog('controls.js','C_iAC', 'changed', 'query:'+query+', last query:'+this.state.queried+', shortened');
				let x = this.callbacks.acxtrapass ? this.callbacks.acxtrapass.cb() : undefined;
			return this.ACoptions.fetch(digits, new A_cb(this, this.load), this.state.exclude, x); // trigger a new query
		}
		// if(this.options && !this.menu.elements.menu) { // provoque boucle infinie en mode normal
		if(this.options && !this.droppy) {
			if(vbs) vlog('controls.js','C_iAC', 'changed', 'digits:'+digits+', dropping');
			return this.drop();
		}
		if(this.options) {
			if(vbs) vlog('controls.js','C_iAC', 'changed', 'digits:'+digits+', subset scoping');
			return this.subset(); // displays in the list of options only the subset that contains the given digits
		}
	},
	cleared: function() {
		if(this.callbacks.acclear) this.callbacks.acclear.cb();
	},
	focused: function() {
		if(vbs) vlog('controls.js','C_iAC', 'focused', 'trigger:'+this.state.trigger);
		if(this.state.trigger==0) this.changed();
	},
	clicked: function() {			
		if(vbs) vlog('controls.js','C_iAC', 'clicked', 'trigger:'+this.state.trigger);
		if(this.state.trigger==0) this.changed();
	},
	
	// callbacks
	escape: function() { // the modal has been closed by the esc or layer click action
	
		let layerclick = !this.controls.ui.isfocused(); // the modal was escaped by a layer click (alternative is using the Esc keyboard key)
		if(vbs) vlog('controls.js','C_iAC', 'escape', 'layerclick:'+layerclick);
		if(this.state.trigger&&layerclick) {
			// this.clear(); // !! bug rapporté par Keevin / Séverine
			this.controls.ui.focus(true); // gives back the focus to the field, !! the call back comes to this.focused() once the current function thread is over
		}
		this.droppy = false; 
		this.close();
		return true;
	},
	onarrow: function(v,el) { 
		if(v!==false) return this.scrollto(v); 
		else this.close(); 
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   PICK OUT FROM An AUTO-COMPLETE that APPENDS OPTIONS TO A PICKER
//
function C_iACPICK(eid, leadclass, callbacks, preset) {
	preset=preset||{};
	this.leadclass = leadclass;
	this.eids = { checks:eid+'_pk', ac:eid+'_ac', wrapper:eid+'_wrpr' };
	this.callbacks = callbacks || {}; // like { changed:, cleared:, added:, acxtrapass };
	this.elements = new A_el();
	this.state = C_iACPICK.defauts.align(preset);
		
		let accallbacks = { acselect:new A_cb(this, this.acSelect), acmulti:new A_cb(this, this.acmulti), acclear:new A_cb(this, this.ACcleared), typing:this.callbacks.typing, acxtrapass:this.callbacks.acxtrapass };
	
	let ac = new C_iAC(this.eids.ac, this.leadclass, accallbacks
		, preset /*{ buttons:preset.buttons, placeholder:preset.placeholder, exclude:preset.exclude, focus:preset.focus, ismulti:[true/false] }*/ );
	
	let optpreset = {};
	
	// presetting the picker preset options (items of type leadclass)
	let labels = [], order=[], presets = [];
	let onlabel = this.state.onlabelclick ? new A_cb(this, this.onlabel) : false;
	for(let id in this.state.ids) {
		if(this.leadclass.get(id)) {
			labels[id] = ac.ACoptions.label(id);
			order.push(id);
				let tip = ac.ACoptions.tip ? ac.ACoptions.tip(id) : false; // checks first if the function is defined in ACoptions
			presets[id] = { checked:true, tip:tip, onlabel:onlabel }
		}
	}
	this.sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(this.sortrule);
		optpreset = { order:order, labels:labels, presets:presets, count:order.length };
	
	if(this.state.achideselected) ac.state.exclude = order;
	
	let checks = new C_iCRESTA(this.eids.checks, { onchange:new A_cb(this, this.onchecks) }, optpreset, { emptypost:preset.emptypost, skin:1, mode:0, title:false } );
	this.controls = new A_ct({checks:checks, ac:ac});
}
C_iACPICK.defauts = new A_df({ ids:false, onlabelclick:false, title:false, hidden:false, achideselected:false }); // achideselected hides from ac search stream al items already selected on the CRESTA
C_iACPICK.prototype = {

	// public
	display: function() {
		if(vbs) vlog('controls.js','C_iACPICK','display','options count:'+this.controls.checks.options.count);
		let ac = this.controls.ac.display(this.controls.ac.ACoptions.css); 
		let checks = this.controls.checks.display();
		return '<table id="'+this.eids.wrapper+'" style="text-align:left;"><tr><td style="white-space:nowrap; vertical-align:middle;">'+ac+'&nbsp;</td></tr><tr><td>'+checks+'</td></tr></table>';
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iACPICK','activate','title:'+this.controls.checks.state.title);
		this.elements.collect(this.eids);
		this.controls.activate('C_iACPICK'); 
		this.hide(this.state.hidden);
	},
	more: function(optionsIdArray, unset) {
		for(let x in optionsIdArray) {
			let id = optionsIdArray[x];
			this.acSelect(id, { unset:unset||false} );
		}
	},
	value: function() { // read currently checked options
		let checked = this.controls.checks.getvalue();
		let items = [];
		for(let x in checked) {
			let id = checked[x];
			items[id] = this.leadclass.get(id);
		}
		return items; // an array indexed by id and pointing to leadclass objects
	},
	digits: function() { return this.controls.ac.digits(); },
	clear: function() {
		if(vbs) vlog('controls.js','C_iACPICK','clear','eid:'+this.eids.ac); 
		this.controls.checks.clear();
		if(this.state.achideselected) this.controls.ac.state.exclude = false;
		return this;
	},
	getpost: function() { return this.controls.checks.getpost(); },
	add: function(id, options) { // adds an option to the picker, default selected
		if(vbs) vlog('controls.js','C_iACPICK','add','eid'+this.eids.checks+', id:'+id); 
		this.acSelect(id, options);
	},
	remove: function(id) { // removes an option from the picker, default selected
		this.controls.checks.clear(id);
	},
	refresh: function(id) { // label refresh, if this id belongs to the displayed list
		
		if(!this.leadclass.get(id)) return; // this id is not present locally in dbAccess
		if(!this.controls.checks.hasvalue(id)) return; // the given id is not displayed
			let tip = this.controls.ac.ACoptions.tip ? this.controls.ac.ACoptions.tip(id) : false; // checks first if the function is defined in ACoptions
			let label = this.controls.ac.ACoptions.label(id);
		this.controls.checks.refresh({id:id, label:label, tip:tip});
		
		if(vbs) vlog('controls.js','C_iACPICK','refresh','eid'+this.eids.checks+', id:'+id); 
	},
	blur: function() {
		this.controls.ac.blur();
	},
	focus: function(set) { // can be called before or after activation
		this.controls.ac.focus(set); return this;
	},
	hide: function(dohide) {
		if(this.elements.wrapper)
			if(dohide) $(this.elements.wrapper).hide(); else $(this.elements.wrapper).show();
	},
	isopen: function() { return this.controls.ac.isopen(); },
	set: function(digits) { this.controls.ac.set(digits); return this; },
	
	// private
	
	// private event handlers
	onchecks: function(ids) {
		if(vbs) vlog('controls.js','C_iACPICK','onchecks','ids:'+ids+', eid:'+this.eids.ac); 
		if(this.callbacks.changed) this.callbacks.changed.cb(this.value());
		if(this.state.achideselected) this.controls.ac.state.exclude = this.controls.checks.getvalue(); // puts an array in ac.state.exclude containing current selection
	},
	onlabel: function(x) {
		let id = this.controls.checks.options.order[x];
		if(vbs) vlog('controls.js','C_iACPICK','onlabel','eid'+this.eids.checks+', x:'+x+', id:'+id); 
		if(this.state.onlabelclick) this.state.onlabelclick.cb(id);
	},
	acmulti: function(values) {
		if(vbs) vlog('controls.js','C_iACPICK','acmulti','eid'+this.eids.checks+'ids:',values); 
		this.controls.ac.clear();
		if(!values.length) return false;
		for(let x in values) {
			let v = values[x];
			this.addone(v);
		}
	},
	addone: function(id, options) { options = options || {};
	
			let check = options.unset?(!options.unset):true;
			let tip = this.controls.ac.ACoptions.tip ? this.controls.ac.ACoptions.tip(id) : false; // checks first if the function is defined in ACoptions
		if(!this.controls.checks.hasvalue(id)) { // prevent adding twice the same id in the list
			let onlabel = this.state.onlabelclick ? new A_cb(this, this.onlabel) : false;
			this.controls.checks.add(id, this.controls.ac.ACoptions.label(id), { checked:check, tip:tip, onlabel:onlabel } );
			if(this.callbacks.added) this.callbacks.added.cb(id, check); // report items addition to the existing list
			if(this.callbacks.changed) this.callbacks.changed.cb(this.value()); // passes array like [id1=>leadclassobject, id2=>leadclassobject]
			if(this.state.achideselected) this.controls.ac.state.exclude = this.controls.checks.getvalue(); // puts an array in ac.state.exclude containing current selection
		} else { 
			this.controls.checks.docheck(id, check); // re-check in case it was unchecked
			if(this.callbacks.changed) this.callbacks.changed.cb(this.value()); // passes array like [id1=>leadclassobject, id2=>leadclassobject]
		}
	},
	acSelect: function(id, options) { options = options || {};
		if(vbs) vlog('controls.js','C_iACPICK','acSelect','eid:'+this.eids.ac+', id:'+id); 
		
		if(!this.leadclass.get(id)) return; // this id is not present locally in dbAccess
		this.controls.ac.clear();
		this.addone(id, options);
	},
	ACcleared: function() {
		if(vbs) vlog('controls.js','C_iACPICK','ACcleared','eid:'+this.eids.ac); 
		this.clear();
		if(this.callbacks.cleared) this.callbacks.cleared.cb(); // report clearance event
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   P I C K    O U T    F R O M    A C C E S S    K E Y S 
//
function C_iAKEYS(eid, callbacks, preset) { 
		preset  = preset || {};
	this.eids = { akeys:eid+'_akeys' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iAKEYS.defaults.align(preset);
	
		let options = C_dS_accesskey.accounts(this.state.loginId);
	let akeys = new C_iMENU(this.eids.akeys, {  }, options, { maxcols:this.state.maxcols, maxrows:this.state.maxrows, title:C_XL.w('accounts') } );
	this.controls = new A_ct({akeys:akeys});
	this.forloggedaccount = C_dS_accesskey.toaccount(this.state.loginId, mobminder.account.id);
}
C_iAKEYS.defaults = new A_df({ loginId:0, mentor:0, maxcols:3, maxrows:10 });
C_iAKEYS.prototype = {
	// public
	display: function(css) { 
		let akeys = this.controls.akeys.display();
		return akeys;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	count: function() { return this.controls.akeys.count();	},
	audit: function() {
		let d = this.forloggedaccount;
		let count = '<tr><td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w('akeys count')+'</td><td>'+d.count+'</td></tr>';
		let related = '<tr><td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w('akey related')+'</td><td>'+d.akey.id+'</td></tr>';
		let account = '<tr><td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w('account id')+'</td><td>'+mobminder.account.id+'</td></tr>';
		let audit = '<table summary="keys" class="" style="margin-top:1em;">'+count+related+account+'</table>';
		return audit;
	}, 
	getaccesskey: function() { // returns access key id for the current account, and the login in this.state
		return this.forloggedaccount.akey.id;
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   A C C E S S    K E Y S    G R A N T I N G 
//
function C_iALLOW(eid, callbacks, preset) { 
		preset  = preset || {};
	this.eids = { wrappy:eid+'_wrpy', granting:eid+'_allw' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iALLOW.defaults.align(preset);
	this.setupcontrols();
}
C_iALLOW.defaults = new A_df({ });
C_iALLOW.prototype = {
	// public
	display: function(css) { 
		let granting = this.controls.granting.display();
		let wrappy = '<div id="'+this.eids.wrappy+'">'+granting+'</div>';
		return wrappy;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		this.onchange(); // applies the admins rule (at least one admin should always keep an access to an account)
	},
	refresh: function() {
		// create the necessary controls
		this.setupcontrols();
		
		if(!this.elements.wrappy) return this; // the control was never displayed, so why refreshing it ;)
		this.elements.wrappy.innerHTML = this.controls.granting.display();
		this.activate();
		return this;
	},
	getpost: function() {
	
		// disallowed (they loose their access to this account)
			let disallowed = '-';
			let loggable = C_dS_loggable.get(); // array like loggable[lid] = o_dS_login;
			let currents = []; for(let lid in loggable) if(loggable[lid].accessLevel>=aLevel.operator) currents.push(lid);
			let selected = this.controls.granting.value([aLevel.operator,aLevel.supervisor,aLevel.manager,aLevel.seller,aLevel.admin]);
			for(let x in selected) { let lid = selected[x]; for(let y in currents) if(currents[y]==lid) { currents.splice(y,1); break; }; };
			let remains = currents.length; if(remains) disallowed = currents.join('!');
		
		// granted: they gain an access to this account
			let granted = '-';
			let candidates = this.controls.granting.value([0/*guests*/]);
			let elligibles = []; for(let x in candidates) { 
				let lid = candidates[x]; 
				let akeys = C_dS_accesskey.toaccount(lid, mobminder.account.id).count;
				if(akeys==0) elligibles.push(lid); // you can be granted access if you have no access yet
			}
			if(elligibles.length) granted = elligibles.join('!');
		
		return { granted:granted, disallowed:disallowed };
	},	
	valid: function() {
		return !(this.controls.granting.getpost()==''); // may not be empty
	},
	
	// private
	setupcontrols: function() {
			let granted = {}; // granted[mobminder.context.surfer.id]= {checked:true, locked:true };
			let loggables = C_dS_accesskey.get('config');
		for(let lid in loggables) {
				let keyscount = 0; for(let kid in loggables[lid]) keyscount++;
			granted[lid] = new C_iTEM.preset({checked:true, locked:(keyscount==1) }); // you may not disallow a login that has only one key. If you want this, you must delete the login.
		}	
		let granting = new C_iUSERS(this.eids.granting, { changed:new A_cb(this, this.onchange) }, { title:C_XL.w('access allowance'), orientation:'vertical', guests:true }, granted );
		this.controls = new A_ct({granting:granting});
	},
	
	// callbacks
	
	// asynchronous callbacks
	onchange: function() {
	
		let admins = this.controls.granting.value([aLevel.seller,aLevel.admin]); // restricts to the concerned access levels
		let guestslogged = this.controls.granting.value([0/*guests*/]); // restricts to the concerned access levels
		for(let x in guestslogged) {
			let lid = guestslogged[x];
			if(C_dS_loggedIn.get(lid).accessLevel>=aLevel.seller) admins.push(lid);
		}
		if(admins.length==1)
			this.controls.granting.lock(admins[0],true); // lock the remaining one (at least one admin or seller must keep a key to this account)
		else {
			this.controls.granting.lock(undefined,false,[0/*guests*/,aLevel.seller,aLevel.admin]);
		}
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   P I C K   O U T   F R O M   G R O U P   L O G I N S  
//
function C_iUSERS(eid, callbacks, preset, optionspreset) {
	this.eids = { picker:eid+'_usrs' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { changed:(applies for CRESTA mode), onuser:(applies for menu mode) }
	this.state = C_iUSERS.defaults.align(preset);
	
		let bylevel = new Array();
		let bulletoption = {}; // {bullet:{css:'small'}};
	for(let l in aLevel.names) { // one list by access level = l
		if(this.state.hide) { let hidden = arrayINVERT(this.state.hide); if(l in hidden) continue; }
			let options = C_dS_loggable.cresta(l, optionspreset, bulletoption); if(options.count==0) continue; // see (*us01*)
			let eid = this.eids.picker+'_'+l;
			let title = C_XL.w(aLevel.name(l));
		if(this.state.menu) bylevel[l] = new C_iMENU(eid, { onlabel:new A_cb(this, this.onuser), ontitle:new A_cb(this, this.ontitle, l) }, options, { title:title } );
			else bylevel[l] = new C_iCRESTA(eid, { onchange:new A_cb(this, this.onchange) }, options, { skin:1, mode:0, title:title } );
	}
	if(this.state.guests) { // this options lists also logins that are connected on this session, and having no access yet to the logged account (Access tab of account preferences)
			let eid = this.eids.picker+'_g';
			let options = C_dS_loggedIn.cresta(optionspreset, {excludeloggables:true, excludelevels:[aLevel.synchro,aLevel.eresa]}, bulletoption ); 
		if(options.count)
			bylevel[0] = new C_iCRESTA(eid, { onchange:new A_cb(this, this.onchange) }, options, { skin:1, mode:0, title:C_XL.w('guests') } );
	}
	this.controls = new A_ct(bylevel);
}
C_iUSERS.defaults = new A_df({menu:false, titlecss:'select-header', tablecss:'align-top', title:'', orientation:'horizontal', guests:false, validation:'yes', hide:[aLevel.eresa, aLevel.synchro] });
C_iUSERS.prototype = {
	// public
	display: function(options) { // options  like { titlescss, tablecss, }
		options = C_iUSERS.defaults.align(options);
			let logins = new Array();
		
		let rows = {rXin:'',rXout:'',r1in:'<tr>',r1out:'</tr>'}; if(this.state.orientation == 'vertical') rows = {rXin:'<tr style="border-top:1em solid transparent;">',rXout:'</tr>',r1in:'',r1out:''};
			for(let l in this.controls.get) 
				logins[l] = rows.rXin+'<td style="padding-right:2em">'+this.controls[l].display(options.titlecss)+'</td>'+rows.rXout;
		
		logins = '<table summary="users by aLevel" class="'+options.tablecss+'" >'+rows.r1in+logins.join('')+rows.r1out+'</table>';
		
		let title = ''; if(this.state.title) title = '<h2 style="margin:0 0 1em 0">'+this.state.title+'</h2>';
		return title+logins;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	lock: function(v, onoff, alevels) {
		if(alevels) {
			for(let x in alevels) { let al = alevels[x]; if(al in this.controls.get) this.controls.get[al].lock(v, onoff); }
			return;
		}
		for(let l in this.controls.get) this.controls.get[l].lock(v, onoff);
	},
	getpost: function(alevels) { // will post '-' for none selected and '4589!4578!4365!4277' when some logins are selected
		let users = '-', collect = this.value(alevels);
		if(collect.length) users = collect.join('!');
		return users;
	},	
	valid: function() {
		if(this.state.validation=='none') return true;
		if(this.getpost()=='-') return false;
		return true;
	},
	value: function(alevels) { // alevels is an optional array like [aLevel.seller,aLevel.admin]
		collect = new Array();
		if(alevels) {
			let regs = [];
			for(let x in alevels) { let al = alevels[x]; if(al in this.controls.get) regs = regs.concat(this.controls[al].getvalue()); }
			return regs;
		}
		for(let l in this.controls.get) collect = collect.concat(this.controls[l].getvalue());
		return collect;
	},
	check: function(v, onoff, alevels) { // (*c03*)
		if(alevels) {
			for(let x in alevels) { let al = alevels[x]; if(al in this.controls.get) this.controls.get[al].lock(v, onoff); }
			return;
		}
		for(let l in this.controls.get) this.controls.get[l].docheck(v, onoff);	
	},
	// private
	
	// callbacks
	onuser: function(uid) {
		if(this.callbacks.onuser) this.callbacks.onuser.cb(uid);
	},
	ontitle: function(alevel) {
		if(this.callbacks.onalevel) this.callbacks.onalevel.cb(alevel);
	},
	onchange: function() {
		if(this.callbacks.changed) this.callbacks.changed.cb();
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   P I C K   O U T   F R O M   G R O U P   R E S O U R C E S 
//
function C_iSTAFF(eid, mode, onSelect, optcheck, preset) { // mode can be 'staffing', 'empty', or 'multi' 

	this.eids = { staffsize:eid+'_s', bCal:eid+'_bCal', uCal:eid+'_uCal', fCal:eid+'_fCal' }
	this.mode = mode;
	this.callbacks = { onSelect:onSelect };
	this.elements = new A_el();
	
	preset = preset || {}; 
	optcheck = optcheck || {}; if(optcheck===true) { optcheck = agClassMatrix(true,true,false); }
	
		let bcount = C_dS_resource.count(class_bCal);
		let ucount = C_dS_resource.count(class_uCal);
		let fcount = C_dS_resource.count(class_fCal);
		
			let buftotal = bcount+ucount+fcount; 
		if(!preset.maxrows) // when no fixed size is preset for the column appearance, we apply an automatic setting that keeps the display in a correct proportion
			if(buftotal>20) preset.maxrows = 26; 
			else if(buftotal>46) preset.maxrows = 38;
	
	this.state = C_iSTAFF.defaults.align(preset);

	this.controls = new A_ct({});
	let selmode = {
		 'staffing':{ bCal:1, uCal:1, fCal:0 } // when some experts must be chosen out of available resources (used by M_WRKCD and search assistant)
		,'empty':	{ bCal:0, uCal:0, fCal:0 }
		,'multi':	{ bCal:1, uCal:1, fCal:0 } // used by M_LOGIN for view definition: no staffing number display - when all resources are selected, post is ""
		,'atleast':	{ bCal:1, uCal:0, fCal:0 } // used by M_duplacc (account duplication/split) at least one resource must be selected from bCals, the rest is free
	}
			
			
	this.has = { bCals:bcount, uCals:ucount , fCals:fcount, size:(ucount && mode=='staffing'), any:bcount+ucount+fcount };
	if(this.has.bCals) this.controls.add1(new C_iCRESTA(this.eids.bCal, {onchange:new A_cb(this,this.select,class_bCal)}, C_dS_resource.options(class_bCal, optcheck[class_bCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].bCal, title:C_XL.w(class_bCal), reset:1 }), class_bCal);
	if(this.has.uCals) this.controls.add1(new C_iCRESTA(this.eids.uCal, {onchange:new A_cb(this,this.select,class_uCal)}, C_dS_resource.options(class_uCal, optcheck[class_uCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].uCal, title:C_XL.w(class_uCal), reset:1 }), class_uCal);
	if(this.has.fCals) this.controls.add1(new C_iCRESTA(this.eids.fCal, {onchange:new A_cb(this,this.select,class_fCal)}, C_dS_resource.options(class_fCal, optcheck[class_fCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].fCal, title:C_XL.w(class_fCal)}), class_fCal);
	
	if(this.has.uCals && mode=='staffing') { // then we need a staff size selector
		let o = {labels:[]}, t = C_dS_resource.count(class_uCal); for(let c = 1; c<=t; c++) o.labels[c] = c;
		let s = new C_iCRESTA(this.eids.staffsize, {}, o, { title:C_XL.w('staffing')+'&nbsp;', skin:0, mode:-1, maxrows:12, value:preset.size||1 });
		this.controls.add1(s, 'staffsize');
	}
}
C_iSTAFF.defaults = new A_df( { show:{bCals:true, uCals:true, fCals:true, contingent:true}, postmode:'split', validation:'yes', maxrows:13 } );
C_iSTAFF.prototype = {
	// public
	display: function(css) {
		css = css || '';
		let bCal = '', uCal = '', fCal = '', s = ''; 
		if(class_bCal in this.controls) bCal = this.state.show.bCals?'<td>'+this.controls[class_bCal].display()+'</td>':'';
		if(class_uCal in this.controls) uCal = this.state.show.uCals?'<td>'+this.controls[class_uCal].display()+'</td>':'';
		if('staffsize' in this.controls) s = this.state.show.contingent?'<td>'+this.controls.staffsize.display(css)+'</td>':'';
		if(class_fCal in this.controls) fCal = this.state.show.fCals?'<td>'+this.controls[class_fCal].display()+'</td>':'';
		return '<table style="text-align:left;"><tr style="vertical-align:top">'+bCal+fCal+s+uCal+'</tr></table>';
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iSTAFF','activate','');

		this.elements.collect(this.eids);
		this.controls.activate('C_iSTAFF');
		if(this.has.size) this.gaugesize();
	},
	change: function(from ,to) {
			if(vbs) vlog('controls.js','C_iSTAFF','change','from:'+from+', to:'+to);
		this.more([to]); this.highlight([from]);
		if(this.type(from)==this.type(to)) this.remove([from]); // drag and drop in the same category must appear like a 'move'
	},
	reset: function(valuesArray) {
				let verbose = []; for(let i in valuesArray) verbose.push(valuesArray[i]);
			if(vbs) vlog('controls.js','C_iSTAFF','reset','values:'+(verbose.length?verbose.join(','):'none'));
		if(this.has.bCals) this.controls[class_bCal].enable().reset(valuesArray);
		if(this.has.uCals) this.controls[class_uCal].enable().reset(valuesArray);
		if(this.has.fCals) this.controls[class_fCal].enable().reset(valuesArray);
		return this;
	},
	setsize: function(size) {
		if(!this.has.size) return this;
		this.controls.staffsize.docheck(size);
		this.gaugesize();
		return this;
	},
	prevent: function() { // items that are not currently selected become disabled (used for e-performance)
		let rtypes = [class_bCal, class_uCal, class_fCal];
		for(let x in rtypes) {
			let c = rtypes[x];
			if(c in this.controls) this.controls[c].prevent(); // only selected items remain enabled
		}
	},
	value: function() { // reads the setting of subcontrols and return an array like array[class][x] = id
		let values = new Array();
		if(this.controls[class_bCal]) values[class_bCal] = this.controls[class_bCal].getvalue(); else values[class_bCal] = new Array();
		if(this.controls[class_uCal]) values[class_uCal] = this.controls[class_uCal].getvalue(); else values[class_uCal] = new Array();
		if(this.controls[class_fCal]) values[class_fCal] = this.controls[class_fCal].getvalue(); else values[class_fCal] = new Array();
		return values;
	},
	getpost: function() { 
	
		if(mobminder.account.single) if(this.state.postmode=='split') return { bCals:mobminder.account.single, uCals:'' , fCals:'', size:1 };
		
		let post = { bCals:'', uCals:'' , fCals:'', size:1 };
		let checked = { b: 0, u: 0, f: 0 };
		let count = { b: 0, u: 0, f: 0 };
			if(this.has.bCals) { checked.b = this.controls[class_bCal].getvalue(); count.b = checked.b.length; if(count.b) post.bCals = checked.b.join('!'); else post.bCals = '-'; }
			if(this.has.uCals) { checked.u = this.controls[class_uCal].getvalue(); count.u = checked.u.length; if(count.u) post.uCals = checked.u.join('!'); else post.uCals = '-'; }
			if(this.has.fCals) { checked.f = this.controls[class_fCal].getvalue(); count.f = checked.f.length; if(count.f) post.fCals = checked.f.join('!'); else post.fCals = '-'; }
		// there is a bCal in every account configuration, minimum requirement, but new accounts may still not have resources when logins are created
		
		if(this.controls['staffsize']) post.size = this.controls['staffsize'].getpost();
		
		if(this.mode=='multi') { // then, when all are selected, we post an empty string
			if(this.has.bCals) if(count.b == this.has.bCals) post.bCals = '';
			if(this.has.uCals) if(count.u == this.has.uCals) post.uCals = '';
			if(this.has.fCals) if(count.f == this.has.fCals) post.fCals = '';
		}
		if(this.state.postmode=='merged') {
			let merged = [];
			if(this.has.bCals) if(count.b) merged.push(post.bCals);
			if(this.has.uCals) if(count.u) merged.push(post.uCals);
			if(this.has.fCals) if(count.f) merged.push(post.fCals);
			merged = merged.join('!');
			post = merged;
		}
		return post; // like {  bCals:"id1!id2!id3", uCals:"id4", fCals:"id5!id6", size:'staffing' } OR "id1!id2!id3!id4!id5!id6" in merged mode
	},
	valid: function() {
		if(this.state.validation == 'none') return true;
		if(!this.has.any) return true; // there is nothing to select
		let count = 0;
		if(this.controls[class_bCal]) { let b = this.controls[class_bCal].getvalue(); count += b.length; }
		if(this.controls[class_uCal]) { let u = this.controls[class_uCal].getvalue(); count += u.length; }
		if(this.controls[class_fCal]) { let f = this.controls[class_fCal].getvalue(); count += f.length; }
		return !!count;
	},
	
	// private
	type: function(id) { if(C_dS_resource.get(id)) return C_dS_resource.get(id).resourceType; else return false; },
	more: function(ids) { 
		// e.g when visitor's preferences are loaded, staff preferences are higlighted through this function
		for(let x in ids) {
			let type = this.type(ids[x]);
			if(type in this.controls) // in case of single config, the control is not displayed
				this.controls[type].docheck(ids[x], true);
		}
		return this;
	},
	highlight: function(ids) { 
		// e.g when visitor's preferences are loaded, staff preferences are higlighted through this function
		for(let x in ids) {
			let type = this.type(ids[x]);
			if(type)
				if(type in this.controls) // in case of single config, the control is not displayed
					this.controls[type].highlight(ids[x], true);
		}
		return this;
	},
	remove: function(ids) {
		for(let x in ids) this.controls[this.type(ids[x])].docheck(ids[x], false);
	},
	gaugesize: function() { // reduce the staffing size to the staffing selection
		if(!this.has.size) return this;
		let countSelected = this.controls[class_uCal].getvalue().length;
		let countOptions = this.controls.staffsize.count();
		let sizeSeleted = this.controls.staffsize.getvalue();
		this.controls.staffsize.enable(); // enable all options
		if( (sizeSeleted|0) > countSelected) { this.controls.staffsize.docheck(countSelected); } // adjust setting
		for(let i=(countSelected+1); i<=countOptions; i++) 
			this.controls.staffsize.disable(i); // disable options that have no sense (e.g if 2 staff resources are selected, you can't ask for having 3 resources on the performance)
		return this;
	},
	
	// event handling
	select: function(type) {
		if(this.callbacks.onSelect) this.callbacks.onSelect.cb(this.value(), type); // returns an array of group resources ids
		if(this.has.size) this.gaugesize();
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    M S G S     T A R G E T S ,  T I M I N G   A N D   T R I G G E R S 
//
function C_iTRIGGER(eid, callbacks, dS, preset) {

		let base = eid+'_';
	this.eids = { autosend:base+'auto'
				, deliv:base+'deliv', delay:base+'delay', ahead:base+'ahead', target:base+'target', trigger:base+'trigger'
				, prelist:base+'plist', factions:base+'fact', actions:base+'act', flogins:base+'flg', logins:base+'alg', fresc:base+'frs', resources:base+'rsc'
				, wrappers: { delivt:base+'_wrp_dt', delay:base+'_wrp_dly', ahead:base+'_wrp_ahd'
							, prelist:base+'_wrp_plist', prelistnote:base+'_wrp_plnote'
							, actions:base+'_wrp_act', logins:base+'_wrp_lgs', resources:base+'_wrp_rsc', autosend:base+'_wrp_asn' 
							, targetnote:base+'_wrp_trgnote',  triggernote:base+'_wrp_trinote', disablednote:base+'_wrp_disnote', indaynote:base+'_wrp_indaynote'
							} 
				};
	this.dS = dS;
	this.callbacks = callbacks || {};
	this.status = C_iTRIGGER.defauts.align(preset);
	this.elements = new A_el();

	let autosend	= new C_iDDWN(this.eids.autosend, { onselect:new A_cb(this, this.onautosend) }, { labels:C_XL.w({ 0:'default disabled', 1:'default enabled', 2:'in day enabled' })}, { value:this.dS.sendComms } );	// (*as01*)		

		let sps = mobminder.account.secondsPerSlice;
	let deliv 	= new C_iCUE(this.eids.deliv, false, { seconds:this.dS.deliveryTime, rangein:(6*3600/sps), rangeout:(21*3600/sps), increment:'hour' } );
		
		let delays = { 0:C_XL.w('no delay'), 5:'5 mn', 10:'10 mn', 15:'15 mn', 20:'20 mn', 30:'30 mn', 45:'45 mn', 60:'60 mn', 90:'90 mn', 120:'120 mn'}
	let delay	= new C_iDDWN(this.eids.delay, { onselect:new A_cb(this, this.ondelay) }, { labels:delays }, { value:this.dS.deliveryDelay, maxcols:1 } );
	
		let aheads = { 0:C_XL.w('on time'), 5:'5 mn', 10:'10 mn', 15:'15 mn', 20:'20 mn', 30:'30 mn', 45:'45 mn', 60:'60 mn', 90:'90 mn', 120:'2 h', 180:'3 h', 240:'4 h', 480:'8 h'}
	let ahead	= new C_iDDWN(this.eids.ahead, { onselect:new A_cb(this, this.onahead) }, { labels:aheads }, { value:this.dS.advance, maxcols:1 } );
	
			let watchoverlabel = function(rsctype) { return C_XL.w('logins watching over')+' '+C_XL.w(rsctype); }
		let targets = []; targets[class_visitor]=C_XL.w('visitors'); targets[class_bCal] = watchoverlabel(class_bCal);
			if(mobminder.account.has.uCal) targets[class_uCal] = watchoverlabel(class_uCal);
			if(mobminder.account.has.fCal) targets[class_fCal] = watchoverlabel(class_fCal);
	let target	= new C_iDDWN(this.eids.target, { onselect:new A_cb(this, this.ontarget) }, { labels:targets }, { value:this.dS.target } );
	
	let trigger	= new C_iDDWN(this.eids.trigger, { onselect:new A_cb(this, this.ontrigger) }, mobminder.communication.triggers(), { value:this.dS.triggerId, maxcols:1 } );
	
	let prelist = new C_iONOFF(this.eids.prelist, { onswitch:new A_cb(this, this.onprelist) }, { state:this.dS.presenceList } );

	let factions = new C_iONOFF(this.eids.factions, { onswitch:new A_cb(this, this.onfactions) }, { state:this.dS.filterOnActions } );
	let actions = new C_iACTIONS(this.eids.actions, {}, { actions:this.dS.actions } );
	
	let flogins = new C_iONOFF(this.eids.flogins, { onswitch:new A_cb(this, this.onflogins) }, { state:!!this.dS.filterOnLogins } );
	let logins 	= new C_iUSERS(this.eids.logins, {}, {validation:'none', hide:[aLevel.synchro]}, arrayINVERT(this.dS.logins.split('!')) ); // limit this message to reservations taken by given logins
	
	let fresources = new C_iONOFF(this.eids.fresc, { onswitch:new A_cb(this, this.onfresources) }, { state:!!this.dS.filterOnResources } );
		let precheck = [], ids = arrayINVERT(this.dS.resources.split('!'));
			precheck[class_bCal] = precheck[class_uCal] = precheck[class_fCal] = ids;
	let resources = new C_iSTAFF(this.eids.resources, 'empty', false, precheck, {postmode:'merged', validation:'none' });

	this.controls = new A_ct({	autosend:autosend, deliv:deliv, delay:delay, ahead:ahead, target:target, trigger:trigger
								, prelist:prelist, factions:factions, actions:actions
								, flogins:flogins, logins:logins
								, fresources:fresources, resources:resources});	
}
C_iTRIGGER.defauts = new A_df( {} );
C_iTRIGGER.prototype = {
	// public
	display: function() {
			let target = '<tr>'+this.controls.target.labelled('delivery target', 'alpha24')+'</tr>';
			let targetnote = '<tr id="'+this.eids.wrappers.targetnote+'"><td></td><td><div class="alpha24 mobtext pad">'+C_XL.w('logins target note')+'</div></td></tr>';
		let t = target+targetnote;
		
			let trigger = '<tr>'+this.controls.trigger.labelled('delivery trigger', 'alpha24')+'</tr>';
			let triggernote = '<tr id="'+this.eids.wrappers.triggernote+'"><td></td><td><div class="alpha24 mobtext pad">'+C_XL.w('action default note')+'</div></td></tr>';
		let r = trigger+triggernote;
		
			let deliv = '<tr id="'+this.eids.wrappers.delivt+'">'+this.controls.deliv.labelled('delivery time', 'alphaCUE')+'</tr>';
			let delay = '<tr id="'+this.eids.wrappers.delay+'">'+this.controls.delay.labelled('delivery delay', 'alpha14')+'</tr>';
			let ahead = '<tr id="'+this.eids.wrappers.ahead+'">'+this.controls.ahead.labelled('delivery ahead', 'alpha14')+'</tr>';
		let d = deliv+delay+ahead;
		
			let autosend = '<tr id="'+this.eids.wrappers.autosend+'">'+this.controls.autosend.labelled('comm autotrigger', 'alpha24')+'</tr>';	
			let disablednote = '<tr id="'+this.eids.wrappers.disablednote+'"><td></td><td><div class="alpha24 mobtext pad">'+C_XL.w('com default disabled note')+'</div></td></tr>';
			let indaynote = '<tr id="'+this.eids.wrappers.indaynote+'"><td></td><td><div class="alpha24 mobtext pad">'+C_XL.w('com in day enabled note')+'</div></td></tr>';
		let a = autosend+disablednote+indaynote;
		
			let paddy = '<tr><td colspan=2>&nbsp;</td></tr>';
			
			let prelist = '<tr id="'+this.eids.wrappers.prelist+'">'+this.controls.prelist.labelled('presence list')+'</tr>';
			let prelistnote = '<tr id="'+this.eids.wrappers.prelistnote+'"><td></td><td><div class="alpha24 mobtext pad">'+C_XL.w('presence list note')+'</div></td></tr>';	
		let p = prelist+prelistnote;
		
			let factions = '<tr>'+this.controls.factions.labelled('filter on actions')+'</tr>';	
			let actions = '<tr id="'+this.eids.wrappers.actions+'"><td></td><td style="padding-bottom:1em;">'+this.controls.actions.display()+'</td></tr>';
		let fa = factions+actions;
			
			let flogins = '<tr>'+this.controls.flogins.labelled('filter on logins')+'</tr>';	
			let logins = '<tr id="'+this.eids.wrappers.logins+'"><td width=50%></td><td style="padding-bottom:1em;">'+this.controls.logins.display()+'</td></tr>'; 
		let fl = flogins+logins;
				
			let fresources = mobminder.account.single?'':'<tr>'+this.controls.fresources.labelled('filter on resources')+'</tr>';	
			let resources = '<tr id="'+this.eids.wrappers.resources+'"><td width=50%></td><td style="padding-bottom:1em;">'+this.controls.resources.display()+'</td></tr>';
		let fr = fresources+resources;
			
		let triggers = '<table summary="triggers" style="">'+t+r+d+a+paddy+p+fa+fl+fr+'</table>';
		return triggers;
	},
	activate: function() {
		this.controls.activate('C_iTRIGGER');
		this.elements.collect(this.eids.wrappers);
		this.ontarget(); this.ontrigger(); this.onautosend(); this.onfactions(); this.onflogins(); this.onfresources(); // pre-sets the hiding of controls
	},
	getpost: function() { 
		return this.controls.getposts();
	},
	
	// private
	dshow: function(e, d) { // delayed element show (for a cool ergonomy)
		d = d||600;
		setTimeout( function(){$(e).show(); }, d);
	},
	
	// controls callbacks
	ondelay: function(v) {	},
	onahead: function(v) {	},	
	onprelist: function(v) {
		let note = this.elements.prelistnote;
		if(v) { this.dshow(note); }
		else { // no usage of presence list feature
			$(note).hide();
		}
	},
	onfactions: function(v) {
		if(v===undefined) v = this.controls.factions.value(); v = v|0;
		let e = this.elements.actions;
		let note = this.elements.triggernote;
		if(v) { $(note).hide(); this.dshow(e); }
		else { // no filter on actions
			$(e).hide();
			let t = this.controls.trigger.value(); t = t|0;
			if(t == 0) $(note).show();
		}
	},
	onflogins: function(v) {
		if(v===undefined) v = this.controls.flogins.value();
		let e = this.elements.logins;
		if(v) this.dshow(e); else $(e).hide();
	},
	onfresources: function(v) {
		if(v===undefined) v = this.controls.fresources.value(); v = v|0;
		let e = this.elements.resources;
		if(v) this.dshow(e); else $(e).hide();
	},	
	ontarget: function(v) {
		if(v===undefined) v = this.controls.target.value(); v = v|0;
		let e = this.elements.targetnote;
		if(v!=class_visitor) this.dshow(e); else $(e).hide();
	},
	onautosend: function(v) {
		if(v===undefined) v = this.controls.autosend.value(); v = v|0; // call from this.activate() in order to set the comment
			let e = this.elements.disablednote; $(e).hide();
			let i = this.elements.indaynote; 	$(i).hide();
		if(v==0) this.dshow(e);
		if(v==2) this.dshow(i);
	},
	ontrigger: function(v) { 	// see (*mt01*)
			if(vbs) vlog('mobminder.js','C_iTRIGGER','ontrigger','trigger='+v);
		if(v===undefined) v = this.controls.trigger.value(); v = v|0;
		
			let time = this.elements.delivt; 
			let delay = this.elements.delay;
			let ahead = this.elements.ahead;
			let trinote = this.elements.triggernote;
			let prelist = this.elements.prelist;
		 
		if(v==msgtrigger.notification_manual) { // manual notification
			this.controls.flogins.set(false).enable(false); 
			this.controls.fresources.set(false).enable(false); 
			this.controls.autosend.set(0).enable(false); 
			this.controls.factions.set(false).enable(false); 
		}
		else if(v==msgtrigger.notification_onBirthday) { // visitor's birthday
			this.controls.flogins.set(false).enable(false); 
			this.controls.fresources.set(false).enable(false); 
			this.controls.factions.set(false).enable(false); 
		}
		else if(v==msgtrigger.notification_onVisitor) { // visitor's file record
			this.controls.fresources.set(false).enable(false); 
		}
		else { // any other 
			this.controls.flogins.set(this.dS.filterOnLogins).enable(true); 
			this.controls.fresources.set(this.dS.filterOnResources).enable(true); 
			this.controls.autosend.set(this.dS.sendComms).enable(true);
			this.controls.factions.set(this.dS.filterOnActions).enable(true);
		}
		
		if( v == msgtrigger.notification_on_action 
			|| v==msgtrigger.notification_manual 
			|| v==msgtrigger.notification_onVisitor 
			|| v==msgtrigger.notification_HminusX 
			|| v==msgtrigger.notification_onBirthday) { // any not scheduled mode
			
			$(prelist).hide(); this.controls.prelist.set(false).enable(false);
			$(time).hide();
			
		} else { // scheduled communication
			
			this.dshow(prelist); this.controls.prelist.set(this.dS.presenceList).enable(true);
		}
		
		switch(v) {
			case msgtrigger.notification_on_action: // communication after action
				$(ahead).hide(); this.dshow(delay); 
				let a = this.controls.factions.value(); a = a|0;
				if(a == 0) this.dshow(trinote);
				break;
				
			case msgtrigger.notification_manual: // manual communication
				$(trinote).hide(); $(ahead).hide(); $(delay).hide(); break; 
				
			case msgtrigger.notification_onVisitor: // on visitor's file record
				$(trinote).hide(); $(ahead).hide(); this.dshow(delay); break; 
				
			case msgtrigger.notification_HminusX: // hour - X reminder
				$(trinote).hide(); $(delay).hide(); this.dshow(ahead); break; 
				
			case msgtrigger.notification_onBirthday: // on visitor's birthday
			default: // scheduled communication
				$(ahead).hide(); $(delay).hide(); $(trinote).hide(); this.dshow(time);
				
		}
	},
}
C_iTRIGGER.deliveryStatus = function(dS_template, dS_resa, dS_target, enabled) { // applies only for SMS
	
	// a unique entry in DB table mobminder.sms is defined by [ resaId, templateId, targetId ].
	// the target can be a reservation visitor OR a login
	// note that in mobminder.sms, targetId is read as resourceId (that should be fixed)
	
		let time = dS_template.deliveryTime; // is a number of seconds counted from midnight
		let advance = dS_template.advance; // is a number of minutes counted from the reservation cueIn
		let delay = dS_template.deliveryDelay;
		let actions = dS_template.filterOnActions; // { 1:'creation', 2:'modification', 4:'deletion' }
		let triggerId = dS_template.triggerId;
		let visicreation = jsDateFromUnixTime(dS_target.created);
		let visichange = jsDateFromUnixTime(dS_target.changed);
		let resacreation = jsDateFromUnixTime(dS_resa.created);
		let resachange = jsDateFromUnixTime(dS_resa.changed);
		let resadeleted = jsDateFromUnixTime(dS_resa.deleted);
		let resaInDate = dS_resa.jsDateIn.clone({midnight:1});
		let leadclass = (dS_template instanceof C_dS_emailTemplate) ? C_dS_emailTemplate : C_dS_smsTemplate;
		let recipient = leadclass.recepient(dS_target); // depending on the leadclass, is a mobile number or an email address
		let now = new Date(); let yesterday = now.clone().increment({d:-1, midnight:1});
	
			if(enabled===undefined) enabled = dS_template.isEnabled(dS_resa, dS_target.id);
		
		if(vbs) vlog('controls.js', 'C_iTRIGGER', 'deliveryStatus', 'tmplId:'+dS_template.id+', triggerId:'+triggerId+', time:'+time+', recipient:'+recipient+', delay:'+delay+', actions:'+actions+', enabled:'+enabled);
	
		
	let planned = false; // now we define a planned date for the message
	
	switch(triggerId) { // see (*mt01*)
	
		case msgtrigger.notification_on_action: // communication after action  ( creation, change or delete )
			if(actions==0) planned = C_XL.w('on resa change'); // should be 'on resa creation or change'
			if(actions&2) planned = C_XL.w('on resa change');
			if(actions&1) if(!dS_resa.created) planned = C_XL.w('on resa creation'); else planned = C_XL.w('on resa change');
			if(actions&4) planned = C_XL.w('on resa deletion');
			break;
			
		case msgtrigger.notification_manual: // manual communication ( action triggered )
			planned = C_XL.w('on activation');
			break; 
			
		case msgtrigger.notification_onVisitor: // on visitor's file record ( action triggered )
			break; 
			
		case msgtrigger.notification_onBirthday: // on visitor's birthday (deliveryTime rules the delivery time on that visitor's birthday)
			planned = false; // TBD
			break;
			
		case msgtrigger.notification_HminusX: // hour - X reminder ( advance rules the number of minutes ahead of cueIn )
			planned = new Date(dS_resa.cueIn*1000-advance*60*1000); // is the date and time of the reservation as scheduled
			break; 
			
		default: // scheduled communication (triggerId represents a number of days, and deliveryTime rules the delivery time on the given date)
			planned = new Date(dS_resa.cueIn*1000); // is the date and time of the reservation as scheduled
			planned.addDay(-triggerId).toMidnight().setMilliseconds(time*1000); // move ahead to date and time of communication 
	}
	
		let sent = false; 
		let statustime = new Date(); 
		let status = C_dS_sms.status.sms_nosms; 
		let route = ''; if(leadclass.childs===C_dS_sms) route = '('+dS_template.smsgateaway+')';
		let message = '',title = '', id = '(na)';
		let msg = false; 
	
	if(dS_target) { // then the target is known, we need to check if the MSG was actually sent already
		
		msg = leadclass.childs.get(dS_resa.id, dS_target.id, dS_template.id); // checks if we have something in DB
		// msg is false or an instance of C_dS_sms or C_dS_email or C_dS_notification
		
		// console.log('EXAMPLE 1',jsDateFromUnixTime('2022-03-31 08:29:00', verbose = 0));
		// console.log('EXAMPLE 2',jsDateFromUnixTime('2022-06-30 00:00:00', verbose = 0));
		// console.log('EXAMPLE 3',jsDateFromUnixTime('2022-07-01 10:00:00', verbose = 0));
		// console.log('------------------------')
		
		if(msg) { // the message was sent, use actual values found in DB
		
			// console.log('MSG:', msg);
			
			id = msg.id;
			sent = jsDateFromUnixTime(msg.created);
			statustime = jsDateFromUnixTime(msg.changed);
			status = msg.status;
			title = msg.title();
			message = msg.message();
			
			if(leadclass.childs===C_dS_sms)  // (*sg03*) maintain coherence
			
				if(dS_template.smsgateaway!='shortcode') { // an alternative smsgateaway was planned
					
					// console.log('________________________________')
					// console.log('msg.id',msg.id);
					// console.log('msg.status',msg.status);
					// console.log('msg.changed',msg.changed);
					// console.log('msg.r2status',msg.r2status);
					// console.log('msg.r2statusChangeStamp',msg.r2statusChangeStamp);
					
					if(msg.status!=C_dS_sms.status.sms_created) route = '(shortcode)'; // which is the fallback, that route was finally used, we show that status
					else {
						
						status = msg.r2status // then this sms was sent using an alternative route first, show this status
						statustime = msg.r2statusChangeStamp?new Date(msg.r2statusChangeStamp*1000):statustime;
						route = '('+dS_template.smsgateaway+')';
					}
			}
				
			
		} else { // the message was NOT SENT yet. 
		
			
			if(!recipient) {	// because there is no recipient ?
				status = C_dS_sms.status.sms_nomobile;
			}
			else if(planned instanceof Date) { // planned is a well defined date
				
				if(planned.isbefore(visicreation)) { // the target was created after the reservation reminder should have been sent
					status = C_dS_sms.status.sms_outdated; statustime = visicreation;
				} 
					else if(planned.isbefore(resacreation)) { // the message is outdated 
						status = C_dS_sms.status.sms_outdated; statustime = resacreation; // e.g. the resa is created at say j-2 while the template triggers at j-7
					}
						else if(planned.isbefore(yesterday)) { // there is a planned date that relies in the past, still the message was not sent
							
							if(planned.isafter(resaInDate)) { status = C_dS_sms.status.sms_outdated; statustime = now; } // revival communiation was not sent when the target has appointed in the meanwhile
							if(planned.isbefore(visichange)) { status = C_dS_sms.status.sms_outdated; statustime = visichange; } // the recepient has most probably been added to the login or visitor record after the planned date for the message
							if(planned.isbefore(resachange)) { status = C_dS_sms.status.sms_outdated; statustime = resachange; } // the target has probably been added in the appointment after the planned date for the message
							
						}
							else { status = C_dS_sms.status.sms_created; } // the msg should leave 30min after resa deletion, that deletion did happen, we are under delay counting. That is max 24hours.
						
				
			} else if(planned) {  // planned is a textual information explaining what action should send the message
				
				// the message is not yet planned, e.g. it should leave after resa deletion while this deletion did not happen yet
				status = C_dS_sms.status.sms_created;
				
			} else { // planned is not defined
				
			}
			
			// we need to forecast the message, because it was not sent yet
			title = dS_template.subject;
			message = C_dS_msgTemplate.msgMerge(dS_template, dS_resa, dS_target);
		}
		
	} // if(dS_target)
	
	
		// Now turn miscellaneous numeric info into verbose info
		
		let datedisplay = function(date) {
			if(date instanceof Date)
				return C_XL.w('ondate')+' '+C_XL.date(date, {abreviation:'abr', weekday:false})+' '+C_XL.w('at',{cap:0})+' '+date.HHmm();
			else return date;
		}
		
		if(sent) 
			sent = datedisplay(sent);
		else {
			if(status == C_dS_sms.status.sms_nomobile) { 
				sent = C_XL.w('will not be sent'); 
				now = new Date(); 
				if(now.isbefore(planned)) statustime = now; // there is still time to record a recipient on the target
					else statustime = planned; // too late, there was no recipient when the message should have been sent
			}
			else switch(dS_template.triggerId) { // the msg is still not sent
				case msgtrigger.notification_on_action: // immediate sending at reservation creation time
					sent = C_XL.w('not yet sent');
					break;
				case msgtrigger.notification_onBirthday: // on visitor's birthday
					sent = C_XL.w('should be actioned'); // TO BE DONE
					break;
				case msgtrigger.notification_manual: // notification_manual (*)
				case msgtrigger.notification_onVisitor: // on visitor's file record
					sent = C_XL.w('should be actioned');
					break;
				default:
					sent = C_XL.w('not yet sent'); 
						if(status == C_dS_sms.status.sms_outdated) sent = C_XL.w('will not be sent'); 
			}
		}
	planned = datedisplay(planned);
	statustring = leadclass.childs.status.string[status]; if(verboseOn) if(msg) status = '('+msg.id+') '+status;
	statustime = datedisplay(statustime);
	if(!enabled) { statustring = C_XL.w('disabled'); status = C_dS_sms.status.sms_disabled; }
	
	return { title:title, message:message, planned:planned, sent:sent, status:status, statustring:statustring, statustime:statustime, route:route, id:id };
 }






//////////////////////////////////////////////////////////////////////////////////////////////
//
//   S E L E C T     C O M M U N I C A T I O N    T O     B E     S E N T 
//

var reminder_target_visitor 	= class_visitor;
var reminder_target_bCal 		= class_bCal;
var reminder_target_uCal 		= class_uCal;
var reminder_target_fCal 		= class_fCal;

function C_iCOMM(eidPost, dS_reservation, leadClass, onMsg) { // one instance of this ctrl by msg_medium
	
	this.leadClass = leadClass; // leadClass is C_dS_smsTemplate or C_dS_emailTemplate or C_dS_notifTemplate
	this.msgMedium = leadClass.msgMedium;
	this.msgClass = leadClass.childs; // will be C_dS_sms or C_dS_email or C_dS_notif
	this.templates = leadClass.byTrigger(class_resa_any); // take only the templates that are triggered by a reservation scheduling
	this.resa = dS_reservation;
	this.callbacks = { onMsg:onMsg };
	
	this.eids = { post:eidPost , target: new Array() }
	this.eids.target[class_bCal] = eidPost+'_bCal';
	this.eids.target[class_uCal] = eidPost+'_uCal';
	this.eids.target[class_fCal] = eidPost+'_fCal';
	this.eids.target[class_visitor] = eidPost+'_visi';
	this.elements = new A_el();
}
C_iCOMM.prototype = {
	// public
	any: function() { // tells if any communicatin of the given leadClass exists
		let c=0; for(let tc in this.templates) for(let templId in this.templates[tc]) c++;
		return c; 
	},
	display: function(css, attendees) {
		this.setaddressees(attendees);
		this.controls = new A_ct({}); // added through the picker function
		css = css || '';
		
		let b = this.picker(class_bCal, css);
		let u = this.picker(class_uCal, css);
		let f = this.picker(class_fCal, css);
		let v = this.picker(class_visitor, css);
		return v+b+u+f;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iCOMM');
	},
	more: function(ids, action) {
		for(let x in ids) this.controls[this.resctype(ids[x])].set(ids[x], action || true);
	},
	reset: function(valuesArray, action) {
		this.controls[class_bCal].reset(valuesArray,action);
		if(this.controls[class_uCal]) this.controls[class_uCal].reset(valuesArray,action);
		if(this.controls[class_fCal]) this.controls[class_fCal].reset(valuesArray,action);
		return this;
	},
	getpost: function() {
		let bundles = new Array(); //like ["2502-1201180-0","2502-7805-1","templId-rscId-onoff"] where onoff is the user chosen setting
		
		for(let templId in this.controls.get) { // for each template that was displayed
				
				let checked_rids = this.controls.get[templId].getvalue(); // only checked resource ids appear here, like [1201180, 1201190]
				let dS_template = this.usedTemplates[templId];
				let tc = dS_template.target; // ranges [ class_visitor, bCal, uCal, fCal ]
				let autosend = dS_template.isautosend(this.resa); // [0 = disabled by default, 1 = enabled by default] default setting according to template
				
				// arrayLOG(checked_rids, ' --- C_iCOMM::checked_rids, template id '+dS_template.id+' / '+this.msgMedium+'');
				
				let toggled = arrayREMOVE(this.addresseesIds[tc],checked_rids); // if the template is disabled by default, then the checked items represent toggled items
				
				if(!autosend) // if the template is enabled by default, then the unchecked items are in normal operation
					toggled = checked_rids; // let's keep only the unchecked as they differ from normal behaviour
				
				// arrayLOG(toggled, ' --- C_iCOMM::toggled, template id '+dS_template.id+' / '+this.msgMedium+'');
				
			for(let x in toggled) {  // we store only toggled communications
				let onoff = 1-autosend; // flip 0 to 1 or 1 to 0
				let rscId = toggled[x];
				let bundle = templId+'-'+rscId+'-'+onoff; // this bundle is like "2502-1201180-1" and is unleashed here (*bu1*), 
				bundles.push(bundle); 
			}
		}
		return bundles.length ? bundles.join('!') : '-';
	},
	displayMSG: function(templId, addresseeId) { // triggered when you click a message status
		
			let dS_template = this.usedTemplates[templId];
			let dS_target = this.addressees[dS_template.target][addresseeId];
			let enabled = this.controls[templId].setting()[addresseeId];
			let is = { email:this.msgMedium == msgmedium.email }

		let d = C_iTRIGGER.deliveryStatus(dS_template, this.resa, dS_target, enabled); // delivery is like { title: , message: , planned: , sent: , status: , statustime:  }
		
		if(vbs) vlog('controls.js', 'C_iCOMM', 'displayMSG', 'templId:'+templId+', targetId:'+addresseeId+', planned:'+d.planned+', sent:'+d.sent+', status:'+d.status);
		
		let title = '';
		let labeltd = '<td class="label textcolor-light">';
		let tr = '<tr style="vertical-align:top;">';
		if(is.email) 
			title	= tr+labeltd+C_XL.w('title')+'</td>'+'<td style="text-align:left;">'+d.title+'</td></tr>';
		message 	= tr+labeltd+C_XL.w('message')+'</td>'+'<td style="text-align:left;">'+d.message+'</td></tr>';
		planned 	= tr+labeltd+C_XL.w('planned on')+'</td>'+'<td style="text-align:left;">'+d.planned+'</td></tr>';
		senton 		= tr+labeltd+C_XL.w('sent on')+'</td>'+'<td style="text-align:left;">'+d.sent+'</td></tr>';
		status 		= tr+labeltd+C_XL.w('status')+'</td>'+'<td style="text-align:left;">'+d.statustring+' '+d.statustime+' '+d.route+'</td></tr>';
		id 			= tr+labeltd+C_XL.w('data id')+'</td>'+'<td style="text-align:left;">'+d.id+'</td></tr>';
		
		paddy 		= tr+labeltd+'&nbsp;</td>'+'<td style="text-align:left;">&nbsp;</td></tr>';
		
			let table = '<table>'+title+message+paddy+planned+senton+status+id+'</table>';
			
		new C_iMSG(table, false, { css:{image:this.msgClass.getImgCss() }, size:{x:600,y:''} } );
	},
	
	// private
	setaddressees: function(attendees) { // set up the list of adressees based on list of attendees = array[class][x] = resource id
	
		this.attendees = attendees;
		this.addressees = []; // array like this.addressees[rescClass][rescId] = label (the name of the resource or visitor)
		this.addresseesIds = []; // array like this.addresseesIds[rescClass][x] = visitorId or loginId
		for(let tc in attendees) { // for each different class of adressee
			this.addressees[tc] = [];
			this.addresseesIds[tc] = [];
			switch(tc|0) {
				case class_visitor: 
					let visitors = attendees[tc];
					for(let x in visitors) {
						let vid = visitors[x];
						this.addressees[tc][vid] = C_dS_visitor.get(vid);
						this.addresseesIds[tc].push(vid); 
					} break;
				default: // that is bCal, uCal and fCal: in those cases, addressees are the 'watching over logins'
					let resources = attendees[tc];
					for(let x in resources) {
						let rid = resources[x]; // is the appointment attendeee, an account resource
						let watchovers = C_dS_loggable.getWatchovers(rid); // are the logins defined to get notifications for this resource
						for(let lid in watchovers) {
							let dS_login = watchovers[lid];
							this.addressees[tc][lid] = dS_login;
							this.addresseesIds[tc].push(lid);
						}
					}
			}		
		}
		
		// now let's set up the preset for check boxes
		this.commPreset = []; // array like this.commPreset[rescClass][msgTemplateId][rescId] = { checked:true, locked:true }
		
		for(let tc in this.addresseesIds) { // for each different class of adressee (tc can be class_visitor, class_bCal, class_uCal, class_fCal)
			
			this.commPreset[tc] = [];
			for(let templId in this.templates[tc]) { // for each template
			
				this.commPreset[tc][templId] = [];
				let dS_template = this.templates[tc][templId];
				let autosend = dS_template.isautosend(this.resa); // is a dS_template setting [0=default de-activated, 1=default activated, 2=activated if dS_resa.cueIn is in the current day]
				
				for(let x in this.addresseesIds[tc]) { // for each attendee of the concerned target class (target class is defined by the template)
					
					let tid = this.addresseesIds[tc][x]; // target adressee id (id of a visitor or of a login - those logins being watchovers for the agenda resource )
						let active = autosend;
						// let notbyme = dS_template.notbyme(tid); // returns 0 if communication should be inhibited, 1 if communication goes through
					// active = active&&notbyme;
			
						let onitem = new A_cb(this, this.onslabel, {templId:templId, addrId:tid});
					let preset = { checked:active, locked:false, onlocked:onitem, onlabel:onitem };
					
					if(this.resa.id >0) { // existing resa, been saved with possibly some disabled communication
						preset.checked = dS_template.isEnabled(this.resa, tid); // this communication was possibly manually disabled or enabled in the past
					} else 
						{ // new resa, keep default comm sending in consideration
						let p = true;
						for(let x in attendees[class_bCal]) { // only bCals have the setting that disables the comm by default, keep in mind that only one bCal can be invited on an appointment
								let rid = attendees[class_bCal][x];
								let dS_rsc = C_dS_resource.get(rid);
							if(dS_rsc.sendComms==0) p = false; // if one of the invited bCal resource has disabled comm by default, the preset goes to "not set"
							preset.checked = p;
						}
						if(active==0) preset.checked = false; // if the template has disabled comm by default, the preset goes to "not set"
					}
					if(this.msgClass.get(this.resa.id, tid, templId)) { // a message was already sent for this combination of resa id, target id and template id
						switch(dS_template.triggerId) {
							case msgtrigger.notification_manual: break; // they can be sent multiple times
							default : preset.locked = true; // was sent, not possible to choose on scheduling anymore
						}
						
					}; 
					if(!dS_template.notbyme(tid)) { preset.locked = true; }; // this template is inactive for own actions (notbyme setting in login)
					
					this.commPreset[tc][templId][tid] = preset;
				}
			}
		}
		
		
		this.commStatus = []; // array like this.commStatus[rescClass][msgTemplateId][vid or lid]
		for(let tc in this.addresseesIds) { // for each different class of adressee
			this.commStatus[tc] = [];
			
			for(let templId in this.templates[tc]) { // many templates may define the same given target class
				this.commStatus[tc][templId] = [];
				let dS_template = this.templates[tc][templId]; 
				switch(tc|0) {
					case class_visitor:
						for(let x in this.addresseesIds[tc]) {	// many visitors might be addressees	
							let vid = this.addresseesIds[tc][x];
							let dS_target = C_dS_visitor.get(vid); // that is a dS_visitor
							let preset = this.commPreset[tc][templId][vid];
							this.commStatus[tc][templId][vid] = C_iTRIGGER.deliveryStatus(dS_template, this.resa, dS_target, preset.checked);
						} break;
					default: // that is bCal, uCal and fCal: in those cases, addressees are the 'watching over logins'
						for(let x in this.addresseesIds[tc]) {	// many logins might be addressees
							let lid = this.addresseesIds[tc][x];
							let dS_target = C_dS_loggable.get(lid); // if dS_target is undefined, you might have read an accesskey while the dS_login is not available in the config query (this has been fixed in the query/config by not sending accesskeys of higher accessLevel than the logged in level)
							let preset = this.commPreset[tc][templId][lid];
							this.commStatus[tc][templId][lid] = C_iTRIGGER.deliveryStatus(dS_template, this.resa, dS_target, preset.checked);
						}
				}
			}
		}
		
		this.usedTemplates = []; // this.usedTemplates[msgTemplateId] = o_dS_template
	},
	resctype: function(id) { return C_dS_resource.get(id).resourceType; },
	candidates: function(tc) {
		// check if we have templates of communication for this class of target
		// and check if we have candidates of the given target class 
		if(tc in this.templates)
			if(this.templates[tc].length)
				if(this.addressees[tc].length) return true;
		return false;
	},
	picker: function(tc, css) {
	
		if(!this.candidates(tc)) return '';
		let tds = new Array();
		
		// display names of attendees in the first left column
			let labels = [], addressees = this.addressees[tc];
			switch(tc|0) {
				case class_visitor: for(let id in addressees) labels[id] = addressees[id].vname(); break;
				default: for(let id in addressees) labels[id] = addressees[id].lname();
			}
		let o_control = new C_iMENU(this.eids.target[tc], {}, { labels:labels }, { title:C_XL.w(tc) } );
		tds.push(o_control.display()); // this control is left not activated with intention
		
		// display communication settings on the right part of this screen
		for(let templId in this.templates[tc]) { 
			let dS_template = this.templates[tc][templId]; 
			
			// check if some agenda restrictions apply for this template
			//
			if(dS_template.resources) { // we do this only if the template defines restrictions on certain resources
					let ronly = dS_template.resources.split('!'); for(let x in ronly) ronly[x] = ronly[x]|0;
					let byclass = this.attendees; let byid = new Array(); 
				for(let ac in byclass) if(ac == class_visitor) continue; else for(let x in byclass[ac]) byid.push(byclass[ac][x]); // all attendees in a flat array
				let applies = false; for(let k in ronly) for(let x in byid) if(byid[x]==ronly[k]) { applies = true; break; } // find a match of resa attendees in temaplate restricted resources
				if(!applies) { continue; } // will not display: because in this case the control makes no sense here because the template is restricted to account resources that are not implied in this reservation
			}
			
				// now create one control for each template in the given target group
				let onpicker = new A_cb(this, this.onpicker, templId);
			this.usedTemplates[dS_template.id] = dS_template; // keep this for getpost function operation
				let title = dS_template.tname();
				let eid = this.eids.target[tc]+'_'+dS_template.id;
				let labels = []; for(let id in this.commStatus[tc][templId]) labels[id] = this.commStatus[tc][templId][id].statustring;
				let options = { labels:labels, presets:this.commPreset[tc][templId] };
				
			let o_control = new C_iCRESTA(eid, { onchange:onpicker }, options, { title:title, mode:0 });
			this.controls.add1(o_control, dS_template.id);
			tds.push(o_control.display());
		}
		let td = '<td style="padding-right:2em;">';
		return '<div><table style="margin:1em auto 1em 1em;"><tr>'+td+tds.join('</td>'+td)+'</td></tr></table></div>';
	},
	
	// event handling
	select: function() {},
	onpicker: function(templId, selections, spot, hitvalue) { // the user wants to de-activate or activate a message
		
		let ctrl = this.controls[templId];
		let addrId = hitvalue; // addressee id, is undefined if you clicked the control title
		let dS_template = this.usedTemplates[templId];
		
		if(!addrId) { // control header was clicked, we need to execute this function for each possible addressee
			
			let targets = this.addressees[dS_template.target];
			for(let tid in targets) this.onpicker(templId, selections, spot, tid); 
			return;
		}
		
		let enabled = ctrl.setting()[hitvalue];		
		if(vbs) vlog('controls.js', 'C_iCOMM', 'onpicker', 'templId:'+templId+', addrId:'+addrId+', enabled:'+enabled);
				
				let dS_target = this.addressees[dS_template.target][addrId];
			let delivery = C_iTRIGGER.deliveryStatus(dS_template, this.resa, dS_target, enabled);
			let label = delivery.statustring; // display the real status
		ctrl.refresh({id:hitvalue, label:label});
	},
	onslabel: function(ids) {
		if(vbs) vlog('controls.js', 'C_iCOMM', 'onslabel', 'templId:'+ids.templId+', rescId:'+ids.addrId);
		if(this.callbacks.onMsg) this.callbacks.onMsg.cb(ids.templId, ids.addrId);
	}
}
C_iCOMM.smsSema = function(css) { // displays SMS status legend
	let s = 'question';
	switch(css) {
		case 'sms_nomobile': 	s = 'fa-fax'; 				c='font-size:1.2em; margin-top:0.1em;';  break;
		case 'sms_disabled': 	s = 'fa-power-off';			c='font-size:1.3em;';  break;
		case 'sms_outdated': 	s = 'fa-sync';				c='font-size:1.3em;';  break;
		case 'sms_nosms': 		s = 'fa-close';				c='font-size:1.3em;';  break;
		case 'sms_created': 	s = 'fa-clock';				c='font-size:1.3em;';  break;
		case 'sms_retry': 		s = 'fa-recycle';			c='font-size:1.3em;';  break;
		case 'sms_handled': 	s = 'fa-hourglass-end';		c='font-size:1.2em; 	margin-top:0.1em;';  break;
		case 'sms_pending': 	s = 'fa-hourglass-half';		c='font-size:1.2em; margin-top:0.1em;';  break;
		case 'sms_delivered': 	s = 'fa-thumbs-up';				c='font-size:1.3em;';  break;
		case 'sms_discarded': 	s = 'fa-thumbs-down';			c='font-size:1.3em;';  break;
		case 'sms_retained': 	s = 'fa-exclamation-triangle';	c='font-size:1.3em;';  break;
		case 'sms_iso': 		s = 'fa-rotate-left';			c='font-size:1.3em;';  break;
		case 'sms_error': 		s = 'fa-minus-circle';			c='font-size:1.3em;';  break;
		case 'sms_dead_numb': 	s = 'fa-phone-slash';			c='font-size:1.3em;';  break;
	}
		let sema = '<div style="line-height:1.2em; '+c+'" class="sms-sema '+css+' fa '+s+'"></div>';
	return sema;
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S E    A    D U R A T I O N
//
function C_iDUR(eid, callbacks, preset) { // preset = { duration:slices }
	preset = preset||{};
	this.eids = { radio:eid+'_pk', drop:eid+'_drop' };
	this.callbacks = callbacks || {}; // like { ondur: }
	this.elements = new A_el();
	this.state = { slice:mobminder.account.durationShortest, preset:preset.duration }; // inits with the first slice selected
	
	let options = { radio:{ labels:{}, presets:{} }, drop:{} };
	let s, t;
	for(s=mobminder.account.durationShortest; s<=mobminder.account.durationLongest; s+=mobminder.account.durationSteps) options.radio.labels[s] = this.slice(s);
	for(t=s; s<=(mobminder.account.durationLongest*3); s+=mobminder.account.durationSteps) options.drop[s] = this.slice(s);
	
	let presets = { radio:new Array() };
	options.radio.presets[this.state.slice] = { checked:true }; // specifies which radio to set at init time
	
	
	let drop = new C_iDDWN(this.eids.drop, { onselect:new A_cb(this, this.drop) }, {labels:options.drop}, {tag:'span', value:t, maxrows:0, nested:true } );
	options.radio.labels['drop'] = drop.display('dur-more')+' +'; // add the drop ui as last option of the radio picker
	
	let radio = new C_iCRESTA(this.eids.radio, { onchange:new A_cb(this, this.radio) }, options.radio, { title:C_XL.w('duration'), skin:0, mode:-1 } );

	this.controls = new A_ct({radio:radio, drop:drop});
}
C_iDUR.prototype = {
	// public

	display: function(css) {
		let radio = this.controls.radio.display(); 
		return '<table style="text-align:left; layout:fixed"><tr><td>'+radio+'</td></tr></table>';
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iDUR','activate','title:'+this.controls.radio.state.title);
		this.elements.collect(this.eids);
		this.controls.activate('C_iDUR');
		if(this.state.preset) this.set(this.state.preset); // we want this setting to feedback on this.radio, so we keep this statement after activate()
	},
	set: function(s) {
		if(s>mobminder.account.durationLongest) { // then set the drop
			this.controls.radio.docheck('drop');
			this.controls.drop.set(s);
			return;
		}
		this.controls.radio.docheck(s);
	},
	getpost: function() { 
		return this.state.slice; 
	},

	// private
	slice: function(s) {
		let seconds = (mobminder.account.secondsPerSlice*s)|0;
		let h = 0; while(seconds>3599) { seconds-=3600; h++; };
		let m = 0; while(seconds>59) { seconds-=60; m++; }; if(m<10) m = '0'+m;
		if(h) return h+':'+m;
		return m+' '+C_XL.w('min',{cap:0});
	},
	
	// callbacks
	radio: function(slice) {
		if(vbs) vlog('controls.js','C_iDUR','radio','slice:'+slice);
		if(slice=='drop') this.state.slice = this.controls.drop.state.value;
			else this.state.slice = slice;
		if(this.callbacks.ondur) this.callbacks.ondur.cb(slice);
	},
	drop: function(slice) {
		if(vbs) vlog('controls.js','C_iDUR','drop','slice:'+slice);
		this.state.slice = slice;
		this.controls.radio.docheck('drop');
		if(this.callbacks.ondur) this.callbacks.ondur.cb(slice);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S E    D I S P L A Y     D E T A I L S 
//

var planning = { 
		vertical:1, 	horizontal:2, 		text:3, 	hourly:4, 
		css:	{	1:'v-', 			2:'h-', 				3:'t-', 		4:'h-' 			},
		names:	{	1:'vertical view', 	2:'horizontal view', 	3:'list view'  }
	}
	

function C_iDETAILS(eid, callbacks, preset) { // see (*dt*)
	this.eids = { eid:eid, mresa:eid+'_resa', mvisi:eid+'_visi', mmisc:eid+'_msc' };
	this.state = C_iDETAILS.defauts.align(preset); 
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onchange: }
	
	let is = { v:this.state.mode==planning.vertical, h:this.state.mode==planning.horizontal, t:this.state.mode==planning.text }
	let onchange = new A_cb(this, this.changed);
	let order, labels, presets, options;
		preset = C_dS_details.get(this.state.mode, this.state.rsctype).details; 
	
		let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; // alphabetical order
		
	// options for resa attributes
		order = [], labels = [], presets = {};
		labels[details.schedule] 	= C_XL.w('schedule');
		labels[details.duration] 	= C_XL.w('duration');
		labels[details.resanote] 	= C_XL.w('note');
		labels[details.visitor] 	= C_XL.w('visitor name');
		labels[details.workcodes] 	= C_XL.w('workcodes');
		if(mobminder.account.has.resa.color+mobminder.account.has.resa.pattern) labels[details.color] = C_XL.w('color');
		labels[details.attendance] 	= C_XL.w('attendance');
		if(mobminder.account.has.resa.tag) labels[details.rtags] = C_XL.w('tags');
		if(is.t) labels[details.smsstatus] 	= C_XL.w('sms status');
		for(let x in labels) order.push(x);
		for(let bit in labels) if(preset&bit) presets[bit] = { checked:true };
			options = { order:order.sort(sortrule), labels:labels, presets:presets, count:order.length };
		let mresa = new C_iCRESTA(this.eids.mresa, {onchange:onchange}, options, { mode:0, title:C_XL.w('reservation'), maxcols:3, maxrows:10 });
	
	// options for visitor attributes
		order = [], labels = [], presets = {};
		labels[details.mobile] 				= C_XL.w('mobile');
		labels[details.visitorNote] 		= C_XL.w('visitor info');
		labels[details.birthdate] 			= C_XL.w('visitor birth');
		labels[details.registration] 		= C_XL.w('registration');
		if(!is.t) labels[details.zipcode] 	= C_XL.w('zipCode');
		if(is.t) labels[details.address] 	= C_XL.w('address');
		if(is.t) labels[details.fixline] 	= C_XL.w('phone');
		if(is.t) labels[details.reference] 	= C_XL.w('reference');
		if(is.t) labels[details.language] 	= C_XL.w('language');
		if(mobminder.account.has.visi.color+mobminder.account.has.visi.pattern) labels[details.color] = C_XL.w('color');
		if(mobminder.account.has.visi.tag) labels[details.vtags] = C_XL.w('tags');
		for(let x in labels) order.push(x);
		for(let bit in labels) if(preset&bit) presets[bit] = { checked:true };
			options = { order:order.sort(sortrule), labels:labels, presets:presets, count:order.length };
		let mvisi = new C_iCRESTA(this.eids.mvisi, {onchange:onchange}, options, { mode:0, title:C_XL.w('visitor'), maxcols:3, maxrows:10 });
	
	// options for the display mode
		order = [], labels = [], presets = {};
		if(this.state.rsctype==class_bCal) {
			if(!is.t) labels[details.disbltips] 	= C_XL.w('disable tips');
			if(!is.t) labels[details.hidesrchasst] 	= C_XL.w('hide search');
		}
		if(is.h) labels[details.hidesection] 	= C_XL.w('hide section');
		if(is.h) labels[details.hideoffdays] 	= C_XL.w('hide offdays');
		if(is.t) labels[details.extraspace] 	= C_XL.w('extra space');
		if(!is.t) labels[details.timeboxing] 	= C_XL.w('timeboxing labels');
		if(!is.t) labels[details.adaptative] 	= C_XL.w('adaptative scale');
		if(is.t) labels[details.emptytboxes] 	= C_XL.w('show empty tboxes');
		for(let x in labels) order.push(x);
		for(let bit in labels) if(preset&bit) presets[bit] = { checked:true };
			options = { order:order.sort(sortrule), labels:labels, presets:presets, count:order.length };
		let mmisc = new C_iCRESTA(this.eids.mmisc, {onchange:onchange}, options, { mode:0, title:C_XL.w('miscellaneous'), maxcols:3, maxrows:10 });
	
	this.controls = new A_ct({ mresa:mresa, mvisi:mvisi, mmisc:mmisc });
}
C_iDETAILS.defauts = new A_df({ rsctype:class_bCal, mode:planning.vertical });
C_iDETAILS.prototype = {
	// public
	display: function(css) { 
		let mresa = '<td>'+this.controls.mresa.display()+'</td>';
		let mvisi = '<td>'+this.controls.mvisi.display()+'</td>';
		let mmisc = '<td>'+this.controls.mmisc.display()+'</td>';
		
		let t = '<table><tr style="vertical-align:top;">'+mresa+mvisi+mmisc+'</tr></table>';
		return t;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	getpost: function() {
		let checked, encoded = 0;
			checked = this.controls.mresa.getvalue(); for(let x in checked) encoded += checked[x]|0;
			checked = this.controls.mvisi.getvalue(); for(let x in checked) encoded += checked[x]|0;
			checked = this.controls.mmisc.getvalue(); for(let x in checked) encoded += checked[x]|0;
		return encoded;
	},	
	
	// feedbacks
	changed: function() {
		let encoded = this.getpost();
		C_dS_details.set(this.state.mode, this.state.rsctype, encoded); 
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.state.mode, encoded);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//    S T A T E    T H E    P R O G R E S S   O F    A    T A S K   
//
function C_iTDONE(eid, callbacks, preset) {
	this.eids = { progr:eid+'_progr', f4all:eid+'_f4all', dpOut:eid+'_dpOut'};
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { notesaved: }
	this.state = C_iTDONE.defaults.align(preset);
	this.state.status = (this.state.midnOut|0) ? 1 : 0;
		
	let progr = new C_iCRESTA(this.eids.progr, { onchange:new A_cb(this, this.progr) }, { order:[0,1], labels:C_XL.w({ 0:'in progress', 1:'archived on' }), count:2 }, { skin:0, mode:-1, value:this.state.status } );
	let dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { stmp:this.state.midnOut, display:{abreviation:'full', weekday:true} } );
	let f4all = new C_iCRESTA(this.eids.f4all, { onchange:new A_cb(this, this.f4all) }, { order:[1], labels:{1:C_XL.w('4all assignees')}, presets:{}, count:1 }, { mode:0 } );

	this.controls = new A_ct({progr:progr, dpOut:dpOut, f4all:f4all });
}
C_iTDONE.defaults = new A_df({ status:0, midnOut:0 });
C_iTDONE.prototype = {

	display: function(css) {
		let progr = '<td style="width:10em; padding:0 1em;">'+this.controls.progr.display()+'</td>';
		let dpOut = '<td style="width:26em; text-align:left;">'+this.controls.dpOut.display('bold alpha20')+'</td>';
		let f4all = '<td style="width:15em; text-align:left;">'+this.controls.f4all.display()+'</td>';
		let table = '<table style=""><tr style="vertical-align:bottom">'+progr+dpOut+f4all+'</tr></table>';
		return table;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		this.enableDPs(); 
		return this;
	},	
	getpost: function() { 
		let midnOut = 0;
		if(this.state.status&1) midnOut = this.state.midnOut;
		let f4all = this.controls.f4all.getvalue(1); f4all = f4all ? 1 : 0;
		return { midnOut:midnOut, f4all:f4all }; 
	},
	set: function(options) {
		options = options || {};
		if(options.archive!==undefined)
			if(options.archive==true)
				this.controls.progr.docheck(1); // 1 is the value for archived
	},
	
	// private
	enableDPs: function() {
		this.controls.dpOut.set(this.state.midnOut);
		this.controls.dpOut.enable(this.state.status&1);// right side DP active
	},
	
	// callbacks
	progr: function(which) {
		if(vbs) vlog('controls.js','C_iTDONE','progr','which:'+which);
		this.state.status = which;
		this.enableDPs();
	},
	dpOut: function(jsdate, stmp) {
		if(vbs) vlog('controls.js','C_iTDONE','dpOut','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
		this.state.midnOut = stmp;
	},
	f4all: function() {}
	
	// handlers:
}




//////////////////////////////////////////////////////////////////////////////////////////////
//    P L U S    L I S T   
//
function C_iPLUS(eid, callbacks, preset) {
	this.eids = { click:eid+'_clik', table:eid+'_table', plus:eid+'_plus' }
	this.elements = new A_el();
	this.state = C_iPLUS.defaults.align(preset);
	this.callbacks = callbacks || {}; // like { select:o_callback }
		let plus = new C_iBUTTON.standard(this.eids.plus, new A_cb(this, this.plus), 'plus' );
	this.controls = new A_ct({plus:plus});
}
C_iPLUS.defaults = new A_df( { plusclass:false, plusallow:true, reorder:false } );
C_iPLUS.prototype = {
	// public
	display: function(css) {
		let table = '<table class="plus '+(css||'')+'" id="'+this.eids.table+'">'+'</table>';
		return table;
	},
	labelled: function(english, css) {
		return '<td class="textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.display(css)+'</td>';
	},
	prefixed: function(prefix, css) {
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right; vertical-align:top;">'+prefix+'</td><td>'+this.display(css)+'</td>';
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.refresh();
	},
	plusallow: function(yesno) { // changes the plusallow state, must be followed by a refresh()
		this.state.plusallow = !!yesno;
	},
	refresh: function() {
		let trs = new Array();
		let pluslist = this.state.plusclass.list();
		this.order = pluslist.order;
		for(let x in this.order) {
			let id = this.order[x], number = (x|0)+1;
			let label = pluslist.labels[id];
			let eid = this.eids.click+this.state.plusclass.eid+'_'+x;
			let click = new C_iCLIK(eid, { down:new A_cb(this, this.down), click:new A_cb(this, this.item, id) } , { tag:'td', ui:label, style:'' } );
			this.controls.add1(click, x);
			trs.push('<tr><td style="text-align:right; vertical-align:middle;">'+number+'.</td>'+click.display()+'</tr>'); // starts by listing all options, each on ONE row
		}
		if(!trs.length) trs.push('<tr><td colspan=2 style="text-align:left; padding-left:0.5em;">'+C_XL.w('none')+'</td></tr>');
		if(this.state.plusallow && this.state.plusclass.plusmay) { trs.push('<tr><td colspan=2 class="plus-do">'+this.controls.plus.display()+'</td></tr>'); };
		this.elements.table.innerHTML = trs.join('');
		this.controls.reset().activate('C_iPLUS');
		
		if(this.state.reorder) {
			for(let x in this.order) {
				new C_iDROP(this.controls.get[x].element(), { enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), drop:new A_cb(this, this.drop) }, { family:this.eids.click, value:x} );
				new C_iDRAG(this.controls.get[x].element(), { movable:{x:false, y:true}, family:this.eids.click, value:x, image:false, hand:false, replace:true, fartrigger:2 } );
			}
		}
		if(vbs) vlog('controls.js','C_iPLUS', 'refresh', 'items count:'+trs.length);
	},
	hasany: function() { return this.state.plusclass.ends(); },
	getpost: function() { // used to post the ordering
		return this.order.join('!');
	},
	
	// callbacks
	item: function(id) { // an existing item is clicked/touched
		if(vbs) vlog('controls.js','C_iPLUS', 'item', 'id:'+id);
		let item = this.state.plusclass.get(id);
		if(item!==undefined) if(this.callbacks.select) this.callbacks.select.cb(item);
	},
	down: function() { return true; },  // authorizes propagation to the C_iDRAG instance
	plus: function() {
		if(vbs) vlog('controls.js','C_iPLUS', 'plus', '');
		let newitem = this.state.plusclass.plus();
		if(this.callbacks.select) return this.callbacks.select.cb(newitem); // overrules callback to select()
	},
	
	// drag-drop
	enter: function(draggy, droppy) {
		
		if(!draggy.state.hand) { // first droppy we are dragging over
			if(vbs) vlog('controls.js','C_iPLUS', 'enter', 'first droppy, draggy:'+draggy.state.value+', droppy:'+droppy.state.value);
			
			let t = draggy.elements.draggy.innerHTML;
			draggy.elements.draggy.innerHTML = droppy.elements.droppy.innerHTML;
			droppy.elements.droppy.innerHTML = t;
			
			let a = draggy.state.value, b = droppy.state.value, k = this.order[a]; this.order[a] = this.order[b]; this.order[b] = k;
			
		} else { // not the first droppy we drag over
			if(vbs) vlog('controls.js','C_iPLUS', 'enter', 'more droppy, draggy:'+draggy.state.value+', droppy:'+droppy.state.value);
			
			let t = draggy.state.hand.elements.droppy.innerHTML;
			draggy.state.hand.elements.droppy.innerHTML = droppy.elements.droppy.innerHTML;
			droppy.elements.droppy.innerHTML = t;
			
			let a = draggy.state.hand.state.value, b = droppy.state.value, k = this.order[a]; this.order[a] = this.order[b]; this.order[b] = k;
		}
		draggy.state.hand = droppy;
	},
	leave: function(draggy, droppy) {
		// if(vbs) vlog('controls.js','C_iPLUS', 'leave', 'draggy:'+draggy.state.value+', droppy:'+droppy.state.value);
	},
	drop: function(draggy, droppy) {
		draggy.done();
		draggy.state.hand = false;
		if(vbs) vlog('controls.js','C_iPLUS', 'drop', 'new order:'+this.order);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   P E R M I S S I O N S 
//
function C_iPERM(eid, callbacks, preset) {
	this.eids = { eid:eid, usage:eid+'_usage', setup:eid+'_setup' };
	this.state = C_iPERM.defauts.align(preset); 
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onchange: }
	
	let onchange = new A_cb(this, this.changed);

		let usage = parseInt('0000FFFFF', 16);
		let setup = parseInt('FFFF00000', 16);
		
			let owned = mobminder.context.surfer.permissions; // a given surfer may not grant persmissions he does not own
				preset = this.state.permissions;
				if(mobminder.context.surfer.accessLevel==aLevel.admin) owned = usage|setup; // admins must keep all permissions
				if(this.state.forced) preset = usage|setup; // admins are forced to keep all permissions
		usage = new C_iCRESTA(this.eids.usage, {onchange:onchange}, permissions.options(owned&usage, preset), { mode:0, title:C_XL.w('reg usage'), 	locked:this.state.forced, maxrows:20 });
		setup = new C_iCRESTA(this.eids.setup, {onchange:onchange}, permissions.options(owned&setup, preset), { mode:0, title:C_XL.w('setup'), 		locked:this.state.forced, maxrows:20 });
		
	this.controls = new A_ct({ usage:usage, setup:setup });
}
C_iPERM.defauts = new A_df({ permissions:0, forced:false });
C_iPERM.prototype = {
	// public
	display: function(css) { 
			let usage = '<td>'+this.controls.usage.display()+'</td>';
			let setup = '<td>'+this.controls.setup.display()+'</td>';
		let t = '<table><tr style="vertical-align:top;">'+usage+setup+'</tr></table>';
		return t;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
	},
	getpost: function() {
		let checked, encoded = 0;
			checked = this.controls.usage.getvalue(); for(let x in checked) encoded += checked[x]|0;
			checked = this.controls.setup.getvalue(); for(let x in checked) encoded += checked[x]|0;
		return encoded;
	},	
	
	// feedbacks
	changed: function() {
		let encoded = this.getpost();
		if(this.callbacks.onchange) this.callbacks.onchange.cb(encoded);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   A R R A Y     D I S P L A Y    ( dataSets to appear in a table )
//
function C_iARROW(eid, callbacks, preset) { // one array row
	preset = preset||{};
	this.eids = { tr:eid+'_tr', selector:eid+'_sel' };
	this.state = C_iARROW.defaults.align(preset); 
	this.callbacks = callbacks || {}; // like { click:, enter:, leave, down: }
	this.elements = new A_el();
	this.controls = new A_ct({});
}
C_iARROW.defaults = new A_df( { selected:false, enabled:true, correlator:false } );
C_iARROW.state = { down:false } // allows higher level control to cancel the touch when e.g. a scroll is starting
C_iARROW.prototype = {
	// public
	display: function(values, rowcss) { // compare this function with the one that pushes data in the file export (*ct03*)
		let tds = new Array();
	// console.log(values);
		for(let m in values) { // is either cueIn, dateIn, visitors, bCals, company, residence, etc... ( object member name )
			let o = values[m]; // is an object like { c:1, t:'', v:{0:v}, d:{0:html} } with count, type, values array, and optional html display format
				let csstype = o.t=='"'?'text':'figure';
				let d = o.v; if(o.d) d = o.d; // when html display value is defined, choose this one
				else { // o.v is an array, let's check for multiline display
					if(o.c == 0) d = '';
					else if(o.c == 1) { if(d instanceof Object) d = d[0]; else d = d; } // is either a flat value or an array
					else { // multi lines display
						d = '';
						for(let x in o.v) d += '<div>'+o.v[x]+'</div>';
					}
				}
			tds.push('<td class="'+csstype+' '+m+'">'+d+'</td>'); // d is the display value (html when applicable)
		}
			rowcss = rowcss?' class="'+rowcss+'"':'';
		return '<tr id="'+this.eids.tr+'"'+rowcss+'>'+tds.join('')+'</tr>';
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.enable(this.state.enabled);
		this.controls.activate();
		return this;
	},
	enable: function(onOff) { // can be called before or after activation
		this.state.enabled = !!onOff;
		if(this.elements.undefined('tr')) return; // control is not activated yet
		// classes
		$(this.elements.tr).addClass('disabled'); if(this.state.enabled) $(this.elements.tr).removeClass('disabled');
		
		// handlers
		if(is.tactile) { 
			this.elements.tr.ontouchstart = this.elements.tr.ontouchend = undefined;
			if(this.state.enabled) {
				let handlers = new A_hn({tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend)});
				this.elements.tr.ontouchstart = handlers.tstart;
				this.elements.tr.ontouchend = handlers.tend;
			}
		} 
		else {
			$(this.elements.tr).unbind('mousedown').unbind('mouseup').unbind('mouseenter').unbind('mouseleave');
			if(this.state.enabled) {
				let handlers = new A_hn({down:new A_cb(this, this.down), up:new A_cb(this, this.up), enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave)});
				$(this.elements.tr).mousedown(handlers.down).mouseup(handlers.up).mouseenter(handlers.enter).mouseleave(handlers.leave);
			}
		}
	},
		
	//private event handlers
	down: function() { // switch highlights to the new selection
		if(this.callbacks.down) this.callbacks.down.cb(this);
		C_iARROW.state.down = this.eids.td;
	},
	up: function() { 
		if(this.callbacks.up) this.callbacks.up.cb(this);
		if(C_iARROW.state.down == this.eids.td)
			if(this.callbacks.click) this.callbacks.click.cb(this);
	},
	enter: function() {
		$(this.elements.td).addClass('hover'); 
		if(this.callbacks.enter) this.callbacks.enter.cb(this);
	},
	leave: function() {
		$(this.elements.td).removeClass('hover'); 
		if(this.callbacks.leave) this.callbacks.leave.cb(this);
	},
	tstart: function(e) { e.preventDefault(); return this.down(); },
	tend: function(e) { e.preventDefault();	return this.up(); }
}


function C_iARRAY(eid, catalyst, callbacks, preset) { 
		// preset like { ids: /* when specific ids should be used, default is to use the catalyst.keys() */}
		// other presets see C_iARRAY.defaults
	preset = preset||{};
	this.state = C_iARRAY.defaults.align(preset); 
	this.eids = { wrapper:eid+'_wrp', headers:eid+'_hd', rows:eid+'_row', busy:eid+'_busy'
				, xport: { xpwrp:eid+'_xpwrp', xpagnt:eid+'_xpagnt'} };
	
	this.callbacks = callbacks || {}; // like { onrow: }
	this.elements = new A_el();
	this.elxport = new A_el();
	this.semicols = {}; // for eids of semicolumns
	this.catalyst = catalyst; 
	
	if(!this.state.viewset) if(catalyst.defview) catalyst.defview(); // (*ct01*) // if(catalyst.defview) ensures compatibility with older C_dS_anyclass.catalyst = function() format
	
	this.headers = this.catalyst.labels({ abr:true, flat:true });
	
	this.controls = new A_ct({});
	this.heads = new A_ct({});
	
	this.round = 0; // helps replacing eid with a different eid each time you click a header
	
	this.exportlabel = { busy: '<a class="button" id="'+this.eids.xport.xpagnt+'"><div class="fa fa-spinner fa-spin fa-15x"></div>&nbsp;&nbsp;'+C_XL.w('export iArray')+'</a>'
						, ready: '<a class="button" id="'+this.eids.xport.xpagnt+'"><div class="fa fa-file-download fa-15x"></div>&nbsp;&nbsp;'+C_XL.w('export iArray')+'</a>' }
}
C_iARRAY.defaults = new A_df( { ids:false, sum:false, max:false, count:false, viewset:false, xport:false, endoflist:false, width:'50em;' } );
C_iARRAY.prototype = {
	// public
	setids: function(ids) { this.state.ids = ids; return this; },
	display: function(c) {
			let xport = '', endoflist = '';
			
			if(this.state.xport) {
				// xport = '<div id="'+this.eids.xpwrp+'" style="margin:1em 0; text-align:center;">'+this.controls.xport.display()+xpagnt+'</div>';
				xport = '<div id="'+this.eids.xport.xpwrp+'" style="margin:1em 0; text-align:center;">'+this.exportlabel.busy+'</div>';
			}
			if(this.state.endoflist) endoflist = '<div style="margin:1em 0; text-align:center;">'+C_XL.w('end of list')+'</div>';
		return '<div style="position:relative;" class="i-array '+(c||'standard')+'" id="'+this.eids.wrapper+'">'+'</div>'+endoflist+xport;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.elxport.collect(this.eids.xport);
		this.controls.activate();
		this.refresh();
		return this;
	},
	
	// private
	busy:function(onoff) {
		let el = document.getElementById(this.eids.busy);
		if(onoff && !el) {
					let style = 'z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden;';
				let overlay = '<div class="array-busy" id="'+this.eids.busy+'" style="'+style+'"></div>';
			$(this.elements.wrapper).append(overlay);
		} else 
			if(onoff==false && el) $(el).remove();
		return this;
	},
	header: function(onidx) { let optidx = this.catalyst.on[onidx];	return this.headers[optidx];	},
	headline: function(options) { // options like {file:true}
		options = options||{};
		
		let ths = new Array();
		let trs = new Array();
		
		if(options.file) {
			for(let x in this.catalyst.on) ths.push(''+this.header(x));
			trs.push(''+ths.join(';')+newline);
			return trs;
		}
		
		this.heads = new A_ct({});
			let cols = new Array(), eids = new Array(), dds = new Array();
			
			let drop = function(eid, right) {
				let floaty = '<div id="'+eid+'" style="width:2em; height:100%; float:right;"></div>';
				let absolute = '<div style="position:absolute; bottom:0px; height:100%; width:1em; '+(right||'')+' border:none;">'+floaty+'</div>';
				return absolute;
			}
			let last = this.catalyst.on.length-1;
			this.round^=1;
		for(let x in this.catalyst.on) {
			let csssorting = '', sortorder = '', member = this.catalyst.on[x]; 
				if(this.catalyst.sorton.key == member) {
					csssorting = 'sorting';
					if(this.catalyst.sorton.order == 1) sortorder = C_XL.w('bullet up');
					if(this.catalyst.sorton.order == -1) sortorder = C_XL.w('bullet down');
				}
			let eid = this.eids.headers+'_'+x+'_'+this.round;
			let callbacks = { click:new A_cb(this, this.onheader, x), hold:new A_cb(this, this.viewset, x), down:new A_cb(this, this.downheader) };
			let iclik = new C_iCLIK(eid, callbacks, { ui:(this.header(x)+sortorder), tag:'th', css:csssorting } );
			
					let eidL = eid+'_L', eidR = eid+'_R';
				// ths.push('<th id="'+eid+'" class="'+csssorting+'">'+iclik.display()+'</th>');
				ths.push(iclik.display());
					let drops = drop(eidR); if(x==last) drops+=drop(eidL,'right:-1em;');
				dds.push('<th>'+drops+'</th>');
					eids[x] = { th:iclik.eids.ui, dL:eidL, dR:eidR }; // th is the header, dL is the drop left zone, dR is the drop right zone
				cols.push('<col class="'+member+'">'); // for css (shading of odd columns)
			this.heads.add1(iclik, x);
		}
		this.semicols = eids;
		
		trs.push('<tr class="dds">'+dds.join('')+'</tr>');
		trs.push('<colgroup>'+cols.join('')+'</colgroup>');
		trs.push('<tr class="see">'+ths.join('')+'</tr>');
					
		// return dds+cols+ths;
		return trs;
	},
	refresh: function() {
		
		this.busy(false);
		
		// headers
		let trs = this.headline();
let perf = false; if(perf) perf = new microperf('iArray');
		// values display
		let controws = new A_ct({});
		let ids = this.catalyst.sort(this.state.ids); // sorts according to catalyst options, this is not sorting on id
if(perf) perf.cue('done with sorting');

		for(let x in ids) {
				let values = this.catalyst.dSui(ids[x]); // is an array like [ 0:val1, 1:val2, 2:val3, 3:val4, ...]
				let row = new C_iARROW(this.eids.rows+'_'+ids[x], { click:new A_cb(this, this.onrow) }, { selected:false, correlator:ids[x] } );
				let rowcss = this.catalyst.dScss?this.catalyst.dScss(ids[x]):undefined;
			trs.push(row.display(values, rowcss));
			controws.add1(row, ids[x]);
		}
if(perf) perf.cue('done with creating rows');
		
		// sum and max (older style like C_dS_xmon_actual.catalyst)
		if(this.state.sum||this.state.max) {
			if(this.catalyst.sum) {
				let sumandmax = this.catalyst.sum(ids);
				if(this.state.max) {
					let tds = [], values = sumandmax.max;
					for(let m in values) tds.push('<td class="max">'+values[m].v+'</td>'); 
					trs.unshift('<tr>'+tds.join('')+'</tr>');
				}
				if(this.state.sum) {
					let tds = [], values = sumandmax.sum;
					for(let m in values) tds.push('<td class="sum">'+values[m].v+'</td>'); 
					trs.unshift('<tr>'+tds.join('')+'</tr>');
				}
			}
		}
			
if(perf) perf.cue('done with summing');

		// counting (new style C_catalyst)
		if(this.state.count) 
			if(this.catalyst.count) {
				let count = this.catalyst.count(ids);
				let tds = [], values = count.counters;
				for(let m in values) tds.push('<td class="count">'+values[m]+'</td>');
				trs.unshift('<tr class="counters">'+tds.join('')+'</tr>');
			}
if(perf) perf.cue('done with counting');
		
		let table = '<table style="position:relative; width:'+this.state.width+';">'+trs.join('')+'</table>';
		this.elements.wrapper.innerHTML = table;
		this.heads.activate();
		controws.activate();
if(perf) perf.cue('done with displaying');

		// drag drop intractivity on columns
		let family = this.eids.headers;
		let elems = new A_el(this.semicols);
		for(let x in elems.get) { x = x|0;
			let CLRels = elems[x];
			new C_iDRAG(CLRels.th, { family:family, value:x, image:{css:'list-header-dragging mobcolor', offy:-16}, replace:true, movable:{x:1,y:0}, hand:this, cursor:'dragging-horizontal-insert' });
			if(CLRels.dL) new C_iDROP(CLRels.dL, { enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), drop:new A_cb(this, this.drop) }, { family:family, value:x+1 } );
			new C_iDROP(CLRels.dR, { enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), drop:new A_cb(this, this.drop) }, { family:family, value:x } );
		}
if(perf) perf.cue('done with drag and drops');
if(perf) perf.report('C_iARRAY::refresh()');

		if(this.state.xport) {
			this.xport(); // prepares the export link according to downloaded/or arranged data
		}
		
		return this;
	},	
	file: function() { // compare this function with the one that displays the data on screen (*ct03*)
			
		let nl = newline;
		
		// headers
		let trs = this.headline({file:true});
		
		// values display
		let ids = this.catalyst.sort(this.state.ids);
		for(let x in ids) { // scan each line
			
				let values = this.catalyst.dSui(ids[x]); // setting file to true will insert newline ( char(10) ) between subsequent data line, while <div></div> are used for html display // see (*ft02*)
				let tds = new Array();
				
			for(let m in values) { // scan each column
				let o = values[m]; // is an object like { c:2, t:'"', v:array[] } where c is the number of inner values, t is '' or '"' depending on the value type, and v is a single value or an array
				let x = ''; // final exported value
				let v = o.v;
				let t = o.t; // can be '"' for strings or '' for numbers
				// o.v is an array, let's check for multiline display
				if(o.c == 0) x = '';
				else if(o.c == 1) { if(v instanceof Object) x = t+v[0]+t; else x = t+v+t; } // is either a flat value or an array
				else { // multi lines display
					let a = [];
					for(let x in o.v) a.push(v[x]);
					x = '"'+a.join(nl)+'"'; // quotes nesting is mandatory in csv standard when multilines are present
				}
				tds.push(x); // x is the csv exported value
			}	
			trs.push(''+tds.join(';')+nl);
		}
		
		// sum and max
		if(this.state.sum||this.state.max) 
			if(this.catalyst.sum) {
				let sumandmax = this.catalyst.sum(ids);
				if(this.state.max) {
					let tds = [], values = sumandmax.max;
					for(let m in values) tds.push(''+values[m]+';'); 
					trs.unshift(''+tds.join('')+crlf);
				}
				if(this.state.sum) {
					let tds = [], values = sumandmax.sum;
					for(let m in values) tds.push(''+values[m]+';'); 
					trs.unshift(''+tds.join('')+crlf);
				}
			}
			
		// counting
		if(this.state.count) 
			if(this.catalyst.count) {
				let count = this.catalyst.count(ids);
				let tds = [], values = count.counters;
				for(let m in values) tds.push(''+values[m]+';');
				trs.unshift(''+tds.join('')+nl);
			}
		
		let table = ''+trs.join('')+'';
		return table;
	},
	onheader: function(idx) { // set the order to happen on this header, or change the order direction
		let key = this.catalyst.on[idx]; 
		if(vbs) vlog('controls.js','C_iARRAY','onheader','idx='+idx+', key='+key+', current key='+this.catalyst.sorton.key);
		if(this.catalyst.sorton.key == key) this.catalyst.sorton.order = -this.catalyst.sorton.order;
			else this.catalyst.sorton.key = key;
		
		if(this.catalyst.post) this.catalyst.post();
		if(this.state.ids.length > 999) { this.busy(true); let that = this; setTimeout(function() { return that.refresh() },100); }
			else this.refresh();
		return true;
	},
	downheader: function() {
		return true; // propagates to the C_iDRAG
	},
	viewset: function(idx) { // long touch on header label: opens a modal for fields selection
		if(permissions.may(pc.ac_disprefs)) // this same permission applies on display details preferences for the planning graphical view
		if(this.state.viewset)
			new C_iARRAY.fields(this.catalyst, {saved:new A_cb(this, this.fields)}, {});
	},

	// Events
	xport: function() {
		
		this.elxport.xpwrp.innerHTML = this.exportlabel.busy;
		
		if(vbs) vlog('controls.js','C_iARRAY','xport','');
	
			let uri = 'data:text/xlsx;charset=utf-8,'+encodeURIComponent(this.file());
			
		this.elxport.xpwrp.innerHTML = this.exportlabel.ready;
		
		this.elxport.collect(this.eids.xport);
		this.elxport.xpagnt.href = uri;
		this.elxport.xpagnt.download = C_XL.w(this.catalyst.title)+'.csv';
		
	},
	
	// Drag & drop actions
	//
	enter: function(draggy, droppy) {	},
	leave: function(draggy, droppy) {	},
	drop: function(draggy, droppy) { // change columns display order
		this.leave(draggy, droppy);
			let dragIdx = draggy.state.value|0, dropIdx = droppy.state.value|0;
		if(vbs) vlog('controls.js','C_iARRAY','drop','dragId:'+dragIdx+', dropId:'+dropIdx); 
		draggy.done();
		if(dropIdx==dragIdx || dropIdx==(dragIdx+1)) return; // no re-ordering
		
		let neworder = new Array();
		for(let x in this.catalyst.on) 
			if(x==dragIdx) continue; 
				else if(x==dropIdx) { neworder.push(this.catalyst.on[dragIdx]); neworder.push(this.catalyst.on[x]); }
					else { neworder.push(this.catalyst.on[x]); };
		if(dropIdx==this.catalyst.on.length) neworder.push(this.catalyst.on[dragIdx]);
		this.catalyst.on = neworder;
		this.refresh();
		if(this.catalyst.post) this.catalyst.post();
	},
	
	// Callbacks
	onrow: function(arrow) {
		if(vbs) vlog('controls.js','C_iARRAY','onrow','id:'+arrow.state.correlator); 
		if(this.callbacks.onrow) this.callbacks.onrow.cb(arrow.state.correlator);
	},
	fields: function(fieldson) { 
		if(vbs) vlog('controls.js','C_iARRAY','fields','fieldson:'+fieldson); 
		this.refresh(); if(this.catalyst.post) this.catalyst.post();  
	}
}


C_iARRAY.fields = function(catalyst, callbacks, preset) { // Modal display: Select fields to be displayed in C_iARRAY
	preset = preset || {};
	this.catalyst = catalyst;
	this.callbacks = callbacks || {}; // { saved:o_callback };
	this.state = C_iARRAY.fields.defaults.align(preset);

	let base = 'flds'+'_';
	this.eids = { buttons:base+'butns', tabs:base+'tabs', panes:base+'flds' };
	this.elements = new A_el();
	
	let cartouche	= new C_iDQS(this.eids.buttons, {onsave:new A_cb(this, this.save), onquit:new A_cb(this, this.quit)}, { remove:false } );
	
	let pass	= new C_iPASS( {} );
	
	let options = this.catalyst.cresta();
	
	// options is a collection of cresta options and settings, like 
	// {
	// 		cat1 : { count:order.length, order:order, labels:category, presets:preset },
	// 		cat2 : { count:order.length, order:order, labels:category, presets:preset },
	// 		cat3 : { count:order.length, order:order, labels:category, presets:preset }
	// }
	// each category should appear as a separate pane on the menu window
	// categories are defined in foptions, e.g. C_dS_reservation.catalyst.foptions
	// when no categories are defined in foptions, only one pane appears.
	
	this.panes = new A_ct();
	let tabs = new Array();
	let mode = 1; // at least one column should be displayed, or you will never reach back in this options modal
	for(let c in options) { // loop on category
			let title = c=='0' ? C_XL.w('options') : C_XL.w(c);
		let pane = new C_iCRESTA(this.eids.panes+'_'+c, {}, options[c], { maxcols:3, maxrows:10, title:title, mode:mode } );
		this.panes.add1(pane,c);
		tabs[c] = title;
		mode = 0; // only the first category has one mandatory option checked
	}
	let ft; for(ft in options) break; // pick first from tabs
	
		tabs = new C_iTABS(this.eids.tabs, tabs, false, {current:preset.tab||ft} );
	this.controls = new A_ct( { pass:pass, cartouche:cartouche, tabs:tabs } );
	
	this.modal = new C_iMODAL({header:this.header(), body:this.body()}, { escape:new A_cb(this, this.escape) }, { size:{x:600}, moves:true } );
	this.activate();
}
C_iARRAY.fields.defaults = new A_df({});
C_iARRAY.fields.prototype = {
	// private
	header: function() {
		let buttons = '<td>'+this.controls.cartouche.display()+'</td>';
		let title = '<td style="align:right;"><h1>'+this.title()+': '+C_XL.w('display in table')+'</h1></td>';
		let header = '<tr>'+buttons+title+'</tr>';
		let divHeader = '<div style="padding:0 0 1em 0;"><table summary="header layout">'+header+'</table></div>';
		let divTabs = '<div style="text-align:center;">'+this.controls.tabs.display()+'</div>';
		return divHeader+divTabs;
	},
	body: function(css) {
	
		let tabs = '';
		for(let pane in this.panes.get) {
			let html = this.panes.get[pane].display(); // which is an html table
			tabs += this.controls.tabs.container(pane,html); 
		}
		return tabs;
	},
	activate: function() {
		this.controls.activate('C_iARRAY.fields.controls');
		this.panes.activate('C_iARRAY.fields.panes');
	},
	
	// private
	title: function() {	return C_XL.w(this.catalyst.title); },
	encoded: function() { return 0; },

	// event handling
	save: function() {
		// feature: we want to keep the display order that is written in this.catalyst.on but absent in checked
		
		let checked = new Array();
		
		for(let pane in this.panes.get) { // let's gather all the checked options into a single array
			let panechecked = this.panes.get[pane].getvalue();
			for(let x in panechecked) { // add new fields at the end
				let i = panechecked[x];
				checked[i] = i;
			}
		}
		
		for(let x in checked) { // add new fields at the end
			let f = checked[x];
			if(arrayHAS(this.catalyst.on,f)) continue; 
			this.catalyst.on.push(f);
		}
		let clear = true; while(clear) {
			clear = false;
			for(let x in this.catalyst.on) { // remove unwished fields
				let uf = this.catalyst.on[x];
				if(arrayHAS(checked,uf)) continue; 
				this.catalyst.on.splice(x,1); 
				clear = true; // splice on the array scanned!!
			}
		}

		if(this.callbacks.saved) this.callbacks.saved.cb(this.catalyst.on);
		this.modal.close();
	},
	quit: function() { this.modal.close(); },
	escape: function() { return true; }
}




////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//               T  I  M  E       A  N  D      D  A  T  E      C  O  N  T  R  O  L  S 
//
//


//////////////////////////////////////////////////////////////////////////////////////////////
//    T I M E   S E T T I N G
//
function C_iCUE(eid, onSelect, preset) { // displays all resources

	this.callbacks = { onSelect:onSelect };
	this.state = C_iCUE.defaults.align(preset); // preset like { jsdate: OR slice: OR seconds }
	if(this.state.iscueout) this.state.iscueout = 86400/mobminder.account.secondsPerSlice; // the biggest possible value for slice in a 24h day
	
	// options
	let labels = { };
		let increment = (preset.increment=='hour')?(mobminder.account.timeSlice):1;
		let padding = (preset.increment=='hour')?0:1;
		
		let start = this.state.rangein-padding; /*-increment;*/
		let stop = this.state.rangeout+padding; /*+increment;*/ // <= bugs when C_iSPAN cues push the limit outside the visible range, to be solved!
	for(let s=start; s<=stop; s+=increment) // rangein and rangeout are in slices
		labels[s] = C_iCUE.options[s];
	
	
	// drop preset
	let slice = preset.slice || this.state.rangein; // select first option by default
	if(preset.jsdate) { slice = preset.jsdate.getSlice(); if(slice==0 && this.state.iscueout) slice = this.state.iscueout; }
	if(preset.seconds!=undefined) slice = preset.seconds/mobminder.account.secondsPerSlice; // can be zero
	
	if(vbs) vlog('controls.js','C_iCUE','constructor','rangein:'+this.state.rangein+', rangeout:'+this.state.rangeout+', preset:'+slice+', iscueout:'+this.state.iscueout); 
		let order = []; for(let x in labels) order.push(x);
		cueoptions = { order:order, labels:labels, presets:{}, count:order.length };
		
	let drop = new C_iDDWN(eid, { onselect:new A_cb(this, this.select) }, cueoptions, { maxcols:1, value:slice /*preset*/ }  );
		// drop.lock( { before:this.state.rangein, after:this.state.rangeout }, true);

	this.controls = new A_ct({drop:drop});
}
C_iCUE.defaults = new A_df( { rangein:false, rangeout:false, increment:'slice', iscueout:false } ); // rangein and rangeout are in slices!
C_iCUE.prototype = {
	// public
	display: function(css) {
		return this.controls.drop.display(css || ''); 
	},	
	labelled: function(english, css) {
		return this.controls.drop.labelled(english, css);
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iCUE','activate','');
		this.controls.activate('C_iCUE');
	},	
	slice: function() { return this.controls.drop.value()|0; },
	setSlice: function(slice) { 
		if(vbs) vlog('controls.js','C_iCUE','setSlice','slice:'+slice);
		this.controls.drop.set(slice); 
	},
	setSeconds: function(sec) { let slice = (sec/mobminder.account.secondsPerSlice)|0; this.setSlice(slice); },
	setJsDate: function(jsdate) { this.setSeconds(jsdate.getHours()*3600 + jsdate.getMinutes()*60); },
	setPHPstamp: function(stamp) { this.setJsDate(new Date(stamp*1000)); },
	sliceslock: function(options, locked) {
		
		if(options && typeof(options)=='object') {
			let order = this.controls.drop.options.order;
			let tobelocked = [];
			if(options.before) { // locks any options in the sequence before the given value, exclusive this value
				for(let x in order) {
					if(order[x]==options.before) break;
					tobelocked.push(order[x]);
				}
			}
			if(options.after) { // locks any options in the sequence after the given value, exclusive this value
				let dont = true;
				for(let x in order) {
					if(order[x]==options.after) { dont = false; continue; }
					if(dont) continue;
					tobelocked.push(order[x]);
				}
			}
			this.controls.drop.lock(tobelocked, true, {reset:true});
			return;
		} 
	},
	getpost: function(options) { 
		options = options || { seconds:true };
		let slices = this.controls.drop.getpost();
		if(options.seconds)	{ 
			let seconds = slices*mobminder.account.secondsPerSlice;
			return seconds;
		}
		else return slices;
	},
	
	// private
	
	// event handling
	select: function(s) {
		this.state.slice = s;
		if(this.callbacks.onSelect) this.callbacks.onSelect.cb(s|0 /*slice*/, s*mobminder.account.secondsPerSlice /*seconds*/);
	}
}
C_iCUE.init = function() { // called at account config setting - dependance with account time slicing
	C_iCUE.options = new Array();
	C_iCUE.defaults['rangein'] = mobminder.account.sliceIn; 
	C_iCUE.defaults['rangeout'] = mobminder.account.sliceOut; 
	let sliceSec = mobminder.account.secondsPerSlice;
	for(let seconds=0, slice=0; seconds<=86400; seconds+=sliceSec, slice++) 
		C_iCUE.options[slice] = time(seconds);
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   T I M E    S P A N    ( DOUBLE C_iCUE with INTERACTIVITY )
//
function C_iRANGE(eid, callbacks, preset) {
	this.eids = { rangein:eid+'_in', rangeout:eid+'_out' }
	this.callbacks = callbacks; // like {}
	this.state = C_iRANGE.defaults.align(preset);
	this.increment = (this.state.increment=='hour')?(mobminder.account.timeSlice):1;
	preset.setin = preset.setin||0;
	
		let sps = mobminder.account.secondsPerSlice;
		let accountIn = (mobminder.account.rangeIn/sps);
		let accountOut = (mobminder.account.rangeOut/sps);
	
	let min, max;
	if(this.state.units=='seconds') {
		min = (preset.min!==undefined)?(preset.min/sps):accountIn; // min & max are in slices
		max = preset.max?(preset.max/sps):accountOut;
	} else { // units=='slices'
		min = preset.min||accountIn; // min & max are in slices
		max = preset.max||accountOut;
		preset.setin = preset.setin*sps;
		preset.setout = preset.setout*sps;
	}
	
if(vbs) vlog('controls.js','C_iRANGE','construction','units:'+this.state.units+', cueIn:'+time(preset.setin)+', cueOut:'+time(preset.setout)+', min:'+time(min*sps)+', max:'+time(max*sps));

	let rangein = new C_iCUE(this.eids.rangein, new A_cb(this, this.rangein), { seconds:preset.setin, rangein:min, rangeout:max, increment:this.state.increment } );
	let rangeout = new C_iCUE(this.eids.rangeout, new A_cb(this, this.rangeout), { seconds:preset.setout, rangein:min, rangeout:max, increment:this.state.increment } );

	this.controls = new A_ct({rangein:rangein, rangeout:rangeout });
}
C_iRANGE.defaults = new A_df({units:'seconds', increment:'slices', lockafter:false, lockbefore:false });
C_iRANGE.prototype = {
	display: function(css) {
		css = css||'alphaCUE';
		let rangein = this.controls.rangein.display(css||'');
		let rangeout = this.controls.rangeout.display(css||'');
		let range = C_XL.w('fromtime',{cap:0})+' '+rangein+' '+C_XL.w('to',{cap:0})+' '+rangeout;
		return range;
	},
	labelled: function(english, css) {
		let range = '<td>'+this.display(css||'alphaCUE')+'</td>';
		let label = '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td>';
		return '<tr>'+label+range+'</tr>';
	},
	activate: function() {
		this.controls.activate();
		this.rangein(this.controls.rangein.slice());
		this.rangeout(this.controls.rangeout.slice());
	},
	getpost: function() {
			let seconds = this.state.units=='seconds';
		let cueIn = this.controls.rangein.getpost({seconds:seconds});
		let cueOut = this.controls.rangeout.getpost({seconds:seconds});
		return { cin:cueIn, out:cueOut }; 
	},	
	
	// callbacks
	rangein: function(s) { // changing rangein => adjust rangeout
		let slicesec = mobminder.account.secondsPerSlice;
		// if(this.state.lockbefore) if(s<this.state.lockbefore) s=this.state.lockbefore;
		let lockbefore = (s|0)+this.increment; 
		this.controls.rangeout.sliceslock({before:lockbefore}, true);
		if(vbs) vlog('planning.js','C_iRANGE','rangein','select:'+time(s*slicesec)+', locks range out before:'+time(lockbefore*slicesec));
	},
	rangeout: function(s) { // changing rangeout
		let slicesec = mobminder.account.secondsPerSlice;
		// if(this.state.lockafter) if(s>this.state.lockafter) s=this.state.lockafter;
		let lockafter = (s|0)-this.increment;
		this.controls.rangein.sliceslock( {after:lockafter },true);
		if(vbs) vlog('planning.js','C_iRANGE','rangeout','select:'+time(s*slicesec)+', locks range in after:'+time(lockafter*slicesec));
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//    C H O O S E     A    C A L E N D A R    P E R I O D     (Full days)
//
function C_iOFFD(eid, callbacks, preset) {
		let b = eid+'_';
	this.eids = { dpIn:b+'dpIn', dpOut:b+'dpOut'};
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { notesaved: }
	this.state = C_iOFFD.defaults.align(preset);
		this.state.cin.toMidnight();
		this.state.out.toMidnight().addDay(-1);
	if(this.state.out.stamp()<this.state.cin.stamp()) this.state.out = this.state.cin.clone();
	
	let dpIn  = new C_iDP(this.eids.dpIn, {dayclick:new A_cb(this, this.dpIn)}, { jsdate:this.state.cin, display:{abreviation:'abr', weekday:true} } );
	let dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { jsdate:this.state.out, display:{abreviation:'abr', weekday:true} } );

	if(vbs) vlog('controls.js','C_iOFFD','constructor','in:'+this.state.cin+', out:'+this.state.out); 
	
	this.controls = new A_ct({dpIn:dpIn, dpOut:dpOut });
}
C_iOFFD.defaults = new A_df({ cin:0, out:0 });
C_iOFFD.prototype = {

	display: function(css) {
		let dateIn = this.controls.dpIn.display('bold');
		let dateOut = this.controls.dpOut.display('bold');
		return C_XL.w('fromdate')+' '+dateIn+' '+C_XL.w('todate')+' '+dateOut+' '+C_XL.w('date included');
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		return this;
	},	
	getpost: function() { 
		let midnOut = this.state.out.clone().addDay(1).stamp();
		let midnIn = this.state.cin.stamp();
		return { cin:(midnIn), out:(midnOut) }; 
	},
	setduration: function(s) { // dumb function for interface compatibility with C_iINOUT, see usage in M_RESA
	},
	getduration: function() {	// dumb function for interface compatibility with C_iINOUT, see usage in M_RESA
		return 1;
	},
	// private
	
	// callbacks
	dpIn: function(jsdate, stmp) {
		this.state.cin = jsdate.clone();
		if(stmp > this.controls.dpOut.stamp()) this.controls.dpOut.set(stmp);
		if(vbs) vlog('controls.js','C_iOFFD','dpIn','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr());
	},
	dpOut: function(jsdate, stmp) {
		this.state.out = jsdate.clone();
		if(stmp < this.controls.dpIn.stamp()) this.controls.dpIn.set(stmp);
		if(vbs) vlog('controls.js','C_iOFFD','dpOut','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr());
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//    C H O O S E     A    C A L E N D A R    A N D    T I M E    P E R I O D  (over days, specifying time)
//
function C_iSPAN(eid, callbacks, preset) {
		let b = eid+'_';
	this.eids = { dpIn:b+'dpIn', dpOut:b+'dpOut', cueIn:b+'cIn', cueOut:b+'cOut'};
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { notesaved: }
	this.state = C_iSPAN.defaults.align(preset);
	
	let dpIn  = new C_iDP(this.eids.dpIn, {dayclick:new A_cb(this, this.dpIn)}, { jsdate:this.state.cin, display:{abreviation:'abr', weekday:true} } );
	let dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { jsdate:this.state.out, display:{abreviation:'abr', weekday:true} } );
	
	let cueIn = new C_iCUE(this.eids.cueIn, new A_cb(this, this.cueIn), { jsdate:this.state.cin } );
	let cueOut = new C_iCUE(this.eids.cueOut, new A_cb(this, this.cueOut), { jsdate:this.state.out } );		

	if(vbs) vlog('controls.js','C_iSPAN','constructor','in:'+this.state.cin+', out:'+this.state.out); 

	this.controls = new A_ct({dpIn:dpIn, dpOut:dpOut, cueIn:cueIn, cueOut:cueOut });
}
C_iSPAN.defaults = new A_df({ cin:0, out:0 });
C_iSPAN.prototype = {

	display: function(css) {
		let cueIn = this.controls.cueIn ? this.controls.cueIn.display('bold alphaCUE') : '';
		let cueOut = this.controls.cueOut ? this.controls.cueOut.display('bold alphaCUE') : '';
		let dateIn = this.controls.dpIn.display('bold');
		let dateOut = this.controls.dpOut.display('bold');
		return C_XL.w('fromdate')+' '+dateIn+' '+C_XL.w('at',{cap:0})+' '+cueIn+' '+C_XL.w('todate')+' '+dateOut+' '+C_XL.w('at',{cap:0})+' '+cueOut;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		return this;
	},	
	getpost: function() { 
		let midnOut = this.controls.dpOut.getpost();
		let midnIn = this.controls.dpIn.getpost();
		let cueOut = this.controls.dpOut.jsdate().timeshift()+this.controls.cueOut.getpost({seconds:true});
		let cueIn = this.controls.dpIn.jsdate().timeshift()+this.controls.cueIn.getpost({seconds:true});
		return { cin:(midnIn+cueIn), out:(midnOut+cueOut) }; 
	},
	setduration: function(s) { // dumb function for interface compatibility with C_iINOUT, see usage in M_RESA
	},
	getduration: function() { // dumb function for interface compatibility with C_iINOUT, see usage in M_RESA
		return 1;
	},
	// private
	
	// callbacks
	//
	dpIn: function(jsdate, stmp) { 		// date cueIn has changed
		this.state.cin = jsdate.clone().seconds(this.state.cin.seconds());
		let sameday = this.state.cin.sameday(this.state.out);
		if(sameday)
			if(this.state.cin.getSlice()>=this.controls.cueOut.slice())
				this.controls.cueOut.setSlice(this.state.cin.getSlice()+1);
		if(stmp > this.controls.dpOut.stamp()) this.controls.dpOut.set(stmp);
		if(vbs) vlog('controls.js','C_iSPAN','dpIn','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr());
	},
	dpOut: function(jsdate, stmp) {		// date cueOut has changed
		this.state.out = jsdate.clone().seconds(this.state.out.seconds());
		let sameday = this.state.cin.sameday(this.state.out);
		if(sameday)
			if(this.state.out.getSlice()<=this.controls.cueIn.slice())
				this.controls.cueIn.setSlice(this.state.out.getSlice()-1);
		if(stmp < this.controls.dpIn.stamp()) this.controls.dpIn.set(stmp);
		if(vbs) vlog('controls.js','C_iSPAN','dpOut','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr());
	},
	
	cueIn: function(slice, seconds) { 	// time cueIn has changed
		this.state.cin.seconds(seconds);
		let sameday = this.state.cin.sameday(this.state.out);
		let lastslice = seconds==86400;
		if(sameday&&!lastslice)
			if(slice>=this.controls.cueOut.slice())
				this.controls.cueOut.setSlice(slice+1);
		if(vbs) vlog('controls.js','C_iSPAN','cueIn','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr()+', sameday:'+sameday);
	},
	cueOut: function(slice, seconds) { 	// time cueOut has changed
		this.state.out.seconds(seconds);
		let sameday = this.state.out.sameday(this.state.cin);
		if(slice&&sameday)
			if(slice<=this.controls.cueIn.slice())
				this.controls.cueIn.setSlice(slice-1);
		if(vbs) vlog('controls.js','C_iSPAN','cueOut','in:'+this.state.cin.datetimestr()+' out:'+this.state.out.datetimestr()+', sameday:'+sameday);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   T I M E    S P A N    I N S I D E    A    D A Y   ( DOUBLE C_iCUE with special INTERACTIVITY)
//
//   ! This control is not appropriate if cin and cout are not inside the same day
//
function C_iINOUT(eid, callbacks, preset) { // preset like { cin:jsDateIn, out:jsDateOut }
	let b = eid+'_';
	this.eids = { cueIn:b+'cIn', cueOut:b+'cOut', dateIn:b+'dateIn', dateOut:b+'dateOut', label:b+'label' };
	this.callbacks = callbacks; // like { setdate, onspanchange };
	this.elements = new A_el();
	this.state = C_iINOUT.defaults.align(preset); 
	if(!preset.cin) this.state.cin = new Date(); else this.state.cin = preset.cin.clone(); this.state.cin.tilt();
	if(!preset.out) this.state.out = new Date(); else this.state.out = preset.out.clone(); this.state.out.tilt();
	this.state.span = preset.cin.sliceSpan(preset.out);
	
	// meta data
	let secondsIn = preset.cin.seconds();
	let secondsOut = preset.out.seconds();
	let fulldays = (!secondsIn && !secondsOut);
	this.is = { sameday:this.state.cin.sameday(this.state.out), fulldays:fulldays }
	
	// time display controls
	let cueIn = false, cueOut = false;
	if(this.is.fulldays) { // when cueIn and cueOut are midnight ( =0 ) there is no time display
		this.state.out.addDay(-1);
	} else { 
	
		let s = this.state.out.getSlice(); if(s==0) this.state.out.addDay(-1);
	
		cueIn = new C_iCUE(this.eids.cueIn, new A_cb(this, this.cueIn), { jsdate:this.state.cin } );
		cueIn.sliceslock( { after:this.after() }, true);
		if(this.state.cues.min) cueIn.sliceslock( {	before:this.state.cues.min}, true);
			
		cueOut = new C_iCUE(this.eids.cueOut, new A_cb(this, this.cueOut), { jsdate:this.state.out, iscueout:true } );	// cueOut may be hour 24.
		cueOut.sliceslock(	{	before:this.before() }, true);
		if(this.state.cues.max) cueOut.sliceslock( {after:this.state.cues.max},	true);
	}
	
	if(vbs) vlog('controls.js','C_iINOUT','constructor','in:'+this.state.cin+', out:'+this.state.out+', sameday:'+this.is.sameday+', fulldays:'+this.is.fulldays); 
	
	// date display controls
	let dateIn = new C_iDPpop(this.eids.dateIn, this.state.cin, this.callbacks, { abreviation:'full', weekday:true } );
	let dateOut = new C_iDPpop(this.eids.dateOut, this.state.out, this.callbacks, { abreviation:'full', weekday:true } );
	
	this.controls = new A_ct({cueIn:cueIn, cueOut:cueOut, dateIn:dateIn, dateOut:dateOut});
}
C_iINOUT.defaults = new A_df( { 
	span:0, // in & out are jsDates, span is in slices
	display:{date:true}, cues:{min:false, max:false} } ); // cues are in slices 
C_iINOUT.prototype = {
	// public
	display: function(prefix) {
			let timeIn = this.controls.cueIn ? this.controls.cueIn.display('bold alphaCUE') : '';
			let timeOut = this.controls.cueOut ? this.controls.cueOut.display('bold alphaCUE') : '';
			let dateIn = this.controls.dateIn.display('bold');
			let dateOut = this.is.sameday ? '' : this.controls.dateOut.display('bold');
		prefix = prefix || '';
		
			let splitline = is.newtouch ? '<br/>' : ' ';

		
		if(!this.state.display.date) // no date display
			return prefix+C_XL.w('fromtime',{cap:0})+' '+timeIn+' '+C_XL.w('to',{cap:0})+' '+timeOut;
		if(this.is.fulldays)
			return prefix+C_XL.w('fromdate')+' '+dateIn+splitline+C_XL.w('todate')+' '+dateOut;
		if(this.is.sameday)
			return prefix+C_XL.w('ondate')+' '+dateIn+splitline+C_XL.w('fromtime',{cap:0})+' '+timeIn+' '+C_XL.w('to',{cap:0})+' '+timeOut;
		
		// case: different in and out dates with flexible time choices
		return prefix+C_XL.w('fromdate')+' '+dateIn+' '+C_XL.w('at',{cap:0})+' '+timeIn+splitline+C_XL.w('todate')+' '+dateOut+' '+C_XL.w('at',{cap:0})+' '+timeOut;
	},	
	labelled: function(english) {
		return '<td id="'+this.eids.label+'" class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.display()+'</td>';
	},
	activate: function() {
		this.controls.activate('C_iINOUT');
	},	
	getpost: function() { 
		let cueIn = 0;
		let cueOut = 0;
		let dateOut = this.controls.dateOut.getpost().clone().toMidnight();
		let dateIn = this.controls.dateIn.getpost().clone().toMidnight();
		if(this.is.fulldays) {
			dateOut.addDay(1);
		} else {
				let cin = this.controls.cueIn.getpost({seconds:true});
				let cout = this.controls.cueOut.getpost({seconds:true});
			cueIn = dateIn.timeshift()+cin;
			cueOut = dateOut.timeshift()+cout;
		}
		return { cin:(dateIn.stamp()+cueIn), out:(dateOut.stamp()+cueOut) }; 
	},
	getcues: function() {
		let cueIn = this.controls.cueIn.getpost({seconds:true});
		let cueOut = this.controls.cueOut.getpost({seconds:true});
		return { cin:cueIn, out:cueOut }; 
	},
	setduration: function(s) { // impacts only cueOut, s is a number of slices
			let neverlater = mobminder.account.sliceOut;
			let out = this.controls.cueIn.slice()+s;
		if(out>neverlater) { out = neverlater; s = neverlater-this.controls.cueIn.slice(); }
		this.state.span = s;
		this.controls.cueOut.setSlice(out);
		this.controls.cueIn.sliceslock( {before:this.state.cues.min, after:this.after() },true);
		return this;
	},
	getduration: function() { // returns the duration is number of slices
			let cueIn = this.controls.cueIn.getpost({seconds:false});
			let cueOut = this.controls.cueOut.getpost({seconds:false});
		return cueOut-cueIn;
	},

	// private
	after: function() {
		let neverlater = mobminder.account.sliceOut-this.state.span;
		let maxspan = this.state.cues.max ? this.state.cues.max-this.state.span : mobminder.account.rangeOut;
		let after = neverlater < maxspan ? neverlater : maxspan;
		return after;
	},
	before: function() {
		return this.state.cin.getSlice()+1; // cueOut stays after cueIn
	},
	
	// event handling
	cueIn: function(s, sec) { // changing cueIn DOES NOT CHANGE THE DURATION => cueOut will be adjusted
		let out = (s|0)+this.state.span;
		this.controls.cueOut.setSlice(out); this.state.cin.seconds(sec);
		this.controls.cueOut.sliceslock({before:this.before()}, true);
		if(this.state.cues.max) this.controls.cueOut.sliceslock( {after:this.state.cues.max}, true);
		// if(this.callbacks.onspanchange) this.callbacks.onspanchange.cb(this.getpost()); // changing cueIn changes cueOut, this line is commented to avoid double onspachange() callback
	},
	cueOut: function(s) { // changing cueOut allows to MODIFY the DURATION
		this.state.span = (s|0)-this.controls.cueIn.slice();
		this.controls.cueIn.sliceslock( {before:this.state.cues.min, after:this.after() },true);
		if(this.callbacks.onspanchange) this.callbacks.onspanchange.cb(this.getpost());
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   D A T E     P I C K E R 
//

function C_iDAY(eid, jsDate, index, callbacks, preset) {
	// note that this class is used by C_iMONTH ( date picker) and by C_iYEAR ( yearly view ) 
	this.jsDate = new Date(jsDate);
	this.stmp = jsDate.stamp();
	this.index = index;
	this.eids = { td:eid+'_'+this.stmp };
	this.elements = new A_el();
	this.handlers = new A_hn({down:new A_cb(this, this.down), up:new A_cb(this, this.up), enter:new A_cb(this, this.enter), leave:new A_cb(this, this.leave), tstart:new A_cb(this, this.tstart), tend:new A_cb(this, this.tend) });
	this.callbacks = callbacks; // like { enter:o_callback, leave:, down:, up:, click:, sticker: };
	this.state = C_iDAY.defaults.align(preset);
	this.label = jsDate.getDate();
}
C_iDAY.defaults = new A_df( {enabled:true, sticker:false, css:'' } );
C_iDAY.state = { down:false }
C_iDAY.prototype = {
	td: function(css) { 
		this.state.css = css;
		return '<td class="dpicker-date '+css+'" id='+this.eids.td+'>'+this.label+'</td>' 
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.enable(this.state.enabled);
	},
	enable: function(onOff) { // can be called before or after activation
		this.state.enabled = !!onOff;
		if(this.elements.undefined('td')) return; // control is not activated yet
		// classes
		$(this.elements.td).addClass('disabled'); if(this.state.enabled) $(this.elements.td).removeClass('disabled');
		
		// handlers
		if(is.tactile) { 
			this.elements.td.ontouchstart = this.elements.td.ontouchend = undefined;
			if(this.state.enabled) {
				this.elements.td.ontouchstart =  this.handlers.tstart; // would be better not to use a this.handlers, see what has been made in C_iARROW
				this.elements.td.ontouchend = this.handlers.tend;
			}
		} 
		else {
			$(this.elements.td).unbind('mousedown').unbind('mouseup').unbind('mouseenter').unbind('mouseleave');
			if(this.state.enabled) 
				$(this.elements.td).mousedown(this.handlers.down).mouseup(this.handlers.up).mouseenter(this.handlers.enter).mouseleave(this.handlers.leave);
		}
	},
	sticker: function(css, obj ) { // used on the yearly calendar to display off days
		this.state.sticker = { css:css, obj:obj };
		$(this.elements.td).removeClass().addClass(css);
	},
	resetcss: function() {
		$(this.elements.td).removeClass().addClass(this.state.css);
	},
	
	//private event handlers
	down: function() { // switch highlights to the new selection
		if(this.state.sticker)
			if(this.callbacks.sticker) return this.callbacks.sticker.cb(this.state.sticker.obj);
		if(this.callbacks.down) this.callbacks.down.cb(this);
		C_iDAY.state.down = this.eids.td; 
		
	},
	up: function() { 
		if(this.callbacks.up) this.callbacks.up.cb(this);
		if(C_iDAY.state.down == this.eids.td)
			if(this.callbacks.click) this.callbacks.click.cb(this);
	},
	enter: function() {
		if(this.callbacks.enter) this.callbacks.enter.cb(this);
	},
	leave: function() {
		if(this.callbacks.leave) this.callbacks.leave.cb(this);
	},
	tstart: function(e) { e.preventDefault(); return this.down(); },
	tend: function(e) { e.preventDefault();	return this.up(); }
}

////////////////////

function C_iMONTH(eidNest, scope, callbacks, preset) {
	this.scope = scope.clone(); 
	let y = this.scope.y; let m = this.scope.m+1;
	this.eids = { table:eidNest+'_'+y+'_'+m, nest:eidNest };
	this.elements = new A_el();	
	this.callbacks = callbacks; // like { dayclick: };
	this.notActivated = new Array(); // an array of not activated o_DAY's
	this.state = C_iMONTH.defaults.align(preset);
}
C_iMONTH.defaults = new A_df( {
		mindate:false, maxdate:false, 
		weekdays:false, /* or an array like [0,6], 0 is sunday, only those daycodes are then allowed */ 
		weeknumb:false
		} );
C_iMONTH.prototype = {
	display: function(today) { // returns a <table>, today must be a PHP stamp
		let tds = new Array(new Array, new Array, new Array, new Array, new Array, new Array); // months are displayed on 5 rows most often, but sometime 6 are needed, very exceptionally 4 are sufficient (february 2015)

		let tableCss = 'dpicker-month';
		let enabled, istoday, iscurrentweek = 0;
			
		let css = function(daycode, istoday) {  
			let css = 'daycode'+daycode%7; 
			if(istoday) css += ' today'; 
			return css; 
		}
		let dayclick = new A_cb(this,this.dayclick);
		
		let row, col, cell; // row[0-5], col[0-6], cell[0-41]  <= those counters run accross the heading, filling and trailing loops
		let wn = this.scope.range.wn1; // weeknumber of first row
		let dwn = this.state.weeknumb; // display week number
		// empty heading cells (first row)
		//
		for(row=0, col=0, cell=0; col<this.scope.range.dayCode1; col++, cell++) 
			tds[row][col] = '<td class="'+css(col,0)+'"></td>';
		if(dwn) tds[0][7] = this.th_wnumber(wn);
		
		// cells having a date inside (finishing first row, then some rows are full, then begin of last row)
		//		
		let date = new Date(this.scope.range.date1);
		let stop = this.scope.range.day31;
		for(let d = 0;  d<stop  ; d++, col++, cell++, col%=7) {
			
				let o_DAY = new C_iDAY(this.eids.nest, date, 0, { click:dayclick }, {enabled:this.allow(date,col)});
				
				istoday = (o_DAY.stmp==today);
				iscurrentweek += istoday;
				if(col==4) wn = date.getWeekNumber().wn; // peek the right week number on thursday
			tds[row][col] = o_DAY.td( css(col, istoday) ); 
			if(o_DAY.stmp == today) tableCss += ' todaymonth';
			this.notActivated.push(o_DAY); 
			
			if(col==6) { // last cell of the row has been treated
				if(dwn) tds[row][7] = this.th_wnumber(wn, iscurrentweek);
				wn = ((++wn)%53)||1;
				row++; iscurrentweek = 0;
			}
			date.addDay(1);
		}
		if(dwn) if(!tds[row][7]) if(tds[row][0]) tds[row][7] = this.th_wnumber(wn, iscurrentweek); // this row ends up before column 6
		
		// empty trailing cells (last row)
		//
		while(cell < 42&&col!=0) { // 6*7 = 42 
			tds[row][col] = '<td class="'+css(col,0)+'"></td>';
			if(col==6) break;
			col++,cell++; 
		} 
		
		// join tds that belong to one row, do it for each row
		//
		for(let r in tds) tds[r] = tds[r].join(''); // for each row, join tds into an html list of tds
		
		// join rows
		//
		let rows = '<tr>'+tds.join('</tr><tr>')+'</tr>';
		
		// month name and weekdays names header
		//
		let wnpadding = dwn ? '<th></th>' : ''; // there is one additionnal column on screen when weeknumbers are displayed
		let monthname = '<tr><th colspan=7 class="dpicker-monthname">'+this.name()+' '+this.scope.y+'</th>'+wnpadding+'</tr>';
		let daynames = new Array(); // build day names column headers
		for(let daycode=6;daycode<13;daycode++) daynames.push(C_XL.weekday(1+daycode%7,'min'));
		daynames = '<tr class="dpicker-dayname"><th>'+daynames.join('</th><th>')+wnpadding+'</th></tr>';
		
		
		return '<table style="table-layout:fixed" class="'+tableCss+'" id="'+this.eids.table+'">'+monthname+daynames+rows+'</table>';
	},
	name: function() { return C_XL.month(this.scope.m+1); },
	activate: function() {
		this.elements.collect(this.eids);
		for(let o_DAY; o_DAY = this.notActivated.shift(); o_DAY.activate());
	},
	
	// private
	th_wnumber: function(wn, current) { 
		if(current) current = ' today'; else current = '';
		let oddeven = wn%2 ? ' odd' : ' even';
		return '<th class="dpicker-weeknumber'+oddeven+current+'">'+(wn++)+'</th>'; 
	},
	allow: function(date, daycode) { 
		let allow = true, preset = this.state;
		if(preset.mindate) if(date < preset.mindate) allow = false;
		if(preset.maxdate) if(date > preset.maxdate) allow = false;
		if(preset.weekdays) if(arrayGETKEY(preset.weekdays,daycode)===false) { allow = false; }
		return allow; 
	},	
	
	// callbacks
	dayclick: function(o_easyDAY) {
		if(this.callbacks.dayclick) this.callbacks.dayclick.cb(this, o_easyDAY.jsDate.clone());
	}
}
C_iMONTH.scope = function(PHPstmp) { // a sub object that contains only the time related variables of a given month
	this.PHPstmp = PHPstmp; 
	let date = new Date(PHPstmp*1000); 
	this.y = date.getFullYear(); 	// year
	this.m = date.getMonth(); 		// m[0-11]
	return this.setRange();
}
C_iMONTH.scope.prototype = {
	// private
	next:function() { if(++this.m>11) { this.y++; this.m=0;} },
	prev:function() { if(--this.m<0) { this.y--; this.m=11;} },
	// public
	drilldown:function(r) { return this.decMonth(this.m%r); }, // align on e.g quarters (r=3) or semesters (r=6)
	incMonth:function(i) { while(i--) this.next(); return this.setRange() },
	decMonth:function(d) { while(d--) this.prev(); return this.setRange() },
	setRange:function() {
			let date1 = new Date(this.y, this.m, 1);
			let date31= new Date(this.y, this.m+1, 1); date31.setDate(date31.getDate()-1);
			let wnumb = date1.getWeekNumber().wn; // week number according to ISO-8601
			let daycode1 = date1.getDay(); // day of the week for the first date
		this.range = { date1:date1, date31:date31, day31:date31.getDate(), dayCode1:daycode1, wn1:wnumb } 
		this.PHPstmp = date1.getPHPstamp();
		return this;
	},
	cin:function(stmp) {
		let date = new Date(stmp*1000);
		return date >= this.range.date1 && date <= this.range.date31; 
	},
	clone:function() { return new C_iMONTH.scope(this.PHPstmp); },
}

////////////////////

function C_iCAL(eid, callbacks, preset) {
		preset = preset || {};
	this.eids = { table:eid+'_cal', busytr:eid+'_bztr' };
	this.elements = new A_el();
	this.callbacks = callbacks||{}; // like { dayclick:, incremented }
	this.frame = { first:false, nexton:false, selected:false, today:false  }; //
	this.months = new C_regS('all'); // like [year, month, C_iMONTH]
	this.notActivated = new Array();
	this.state = C_iCAL.defauts.align(preset);
	this.set(preset.jsdate||preset.stmp, true /*no feedback*/);
}
C_iCAL.defauts = new A_df( { jsdate:false, stmp:0, hidden:false, mpr:2, rows:4, pastrows:1
	, mindate:false, maxdate:false, weekdays:false /* or an array like [0,6] 0 is sunday */
	, weeknumb:false /* displays weeknumbers ( like 1-52 ) */
	, now:{ midnight:(function(){ let d=new Date(); return d.toMidnight().stamp(); })() }	} );
C_iCAL.prototype = {
	// public
	display: function() {
		let rows2display = this.state.rows, mpr = this.state.mpr; // months per row
		let monthsDisplayed = rows2display * mpr; // that is a multiple of an entire row
		this.frame.first = new C_iMONTH.scope(this.state.stmp);
		this.frame.first.drilldown(mpr).decMonth(this.state.pastrows*mpr); // we display 1 months row ahead the preset date month
		this.frame.nexton = this.frame.first.clone().incMonth(monthsDisplayed); // we display a range of 12 months
		let rows = this.rows(rows2display, this.frame.first); // e.g 6 rows makes 12 months display
		return '<table class="dpicker-layout" id="'+this.eids.table+'">'+rows+'</table>';
	},
	activate: function() {
		this.elements.collect(this.eids);
		for(let o_DAY; o_DAY = this.notActivated.shift(); o_DAY.activate());
		this.highlight();
	},
	set: function(date, nofeedback) { 
		let jsdate;
		if(!date) jsdate = new Date();
			else if(typeof date == 'number') jsdate = new Date(date*1000); // date is a PHP stamp
				else jsdate = date.clone(); // date is a Date instance
		this.frame.selected = this.months.all.get(jsdate.getFullYear(), jsdate.getMonth());
		this.setPost(jsdate).highlight();
		if(!nofeedback) if(this.callbacks.dayclick) this.callbacks.dayclick.cb(jsdate);
	},
	getcurrentelement: function() { // used for scrolling a div to the current element of the calendar
		return this.frame.selected.elements.table;
	},
	getcurrentcoord: function() { // used for scrolling a div to the current element of the calendar, using pages (snap feature of iScroll)
		let td = $(this.frame.selected.elements.table).parent('td');
		let row = $(td).parent('tr');
		let rowIndex = row[0].sectionRowIndex; // [0] to access the DOM element (because we work here with jquery objects)
		let cellIndex = td[0].cellIndex;
		return { row:rowIndex, col:cellIndex };
	},
	
	getfirstelement: function() {
		return this.months.all.get(this.frame.first.y, this.frame.first.m).elements.table;
	},
	getlastelement: function() {
		return this.months.all.get(this.frame.first.y, this.frame.first.m).elements.table;
	},
	increment: function(i, options) { // options like {feedback:false}
		options = options || {feedback:true};
		this.state.jsdate.increment(i);
		let y = this.state.jsdate.getFullYear();
		let m = this.state.jsdate.getMonth();
		this.changed(this.months.all.get(y,m), this.state.jsdate);
		if(options.feedback) this.feedback({inc:true});
	},
	stamp: function() { return this.state.stmp; },
	jsdate: function() { return this.state.jsdate.clone(); },
	
	// private
	monthDisplay: function(scope) { // offset is a number of month, defaults to 0
			let presets = {mindate:this.state.mindate, maxdate:this.state.maxdate, weekdays:this.state.weekdays, weeknumb:this.state.weeknumb};
		let o_MONTH = new C_iMONTH(this.eids.table, scope, {dayclick:new A_cb(this,this.dayclick)}, presets);
		if(o_MONTH.scope.cin(this.state.stmp)) { this.frame.selected = o_MONTH; }
		if(o_MONTH.scope.cin(this.state.now.midnight)) { this.frame.today = o_MONTH; }
		this.notActivated.push(o_MONTH);
		this.months.all.add(o_MONTH.scope.y, o_MONTH.scope.m, o_MONTH); // keep an access to those elements
		return o_MONTH.display(this.state.now.midnight);
	},
	rows: function(howmany, from) { // returns howmany rows arranged in trs, each tr holding mpr months
		let mpr = this.state.mpr;
		let current = from.clone();
		let tds = new Array;
		let row, col, stp, r, m;
		for(row=0;row<howmany;row++) tds[row] = new Array;
		let stop = stp=howmany*mpr;
		for(row=0, col=0, m=0; m<stp; m++, current.incMonth(1), col++, row+=!!(col==mpr), col%=mpr) { //each row gets to cells, each of one gets a month display table
			tds[row][col] = '<td>'+this.monthDisplay(current)+'</td>';
		}
		for(r in tds) tds[r] = tds[r].join(''); // join tds into an html list of tds
		return '<tr class="agrow">'+tds.join('</tr><tr class="agrow">')+'</tr>';
	},
	setPost: function(jsdate) {
		this.state.jsdate = (jsdate||new Date()).clone({midnight:1});
		this.state.stmp = this.state.jsdate.stamp();
		return this;
	},
	highlight: function() {
		// highlight selected date on calendar
		let year = this.state.jsdate.getFullYear();
		let month = this.state.jsdate.getMonth()+1;
		let stamp = this.state.jsdate.stamp();
		$(this.elements.table).find('table.dpicker-month').removeClass('selectmonth');
		$(this.elements.table).find('table.dpicker-month[id$="_'+year+'_'+month+'"]').addClass('selectmonth');
		$(this.elements.table).find('td.dpicker-date').removeClass('selectday');
		$(this.elements.table).find('td.dpicker-date[id$="_'+stamp+'"]').addClass('selectday');
	},
	busy: function(where) {
		let div = '<div class="busy" style="min-height:5em;">&nbsp;</div>';
		let tr = '<tr id="'+this.eids.busytr+'">'+'<td colspan='+this.state.mpr+' style="">'+div+'</td>'+'</tr>';
		switch(where) {
			case 'top': $(this.elements.table).prepend(tr); break;
			case 'bottom': $(this.elements.table).append(tr); break;
		}
		return this;
	},
	notbusy: function() {
		$('#'+this.eids.busytr).remove();
		return this;
	},
	changed: function(o_easyMONTH, jsdate) {
		this.frame.selected = o_easyMONTH;
		this.setPost(jsdate).highlight();
	},
	feedback: function(is) { // inc: the change comes from programmatic incremmentation
		
		// if(is) if(is.inc) 
			// if(this.callbacks.incremented) { // PVH 2022 only used from smart.php through smart.js, this code is obsolete since we have the flutter smart app
				// this.callbacks.incremented.dcb(600 /*delay in ms*/, this.state.jsdate, this.state.stmp);
				// return;
			// }
			
		// you land here each time a click occurs on >|, >>| or |<, |<<, or any control capable of changing the displayed agenda grid
			let servercalldelay = 250; // before we call the server, we give the user a chance to ribbon on the button
		if(this.callbacks.dayclick) this.callbacks.dayclick.dcb(servercalldelay /*delay in ms*/, this.state.jsdate, this.state.stmp);
	},
	
	// callbacks
	dayclick: function(o_easyMONTH, jsdate) { 
		this.changed(o_easyMONTH, jsdate);
		this.feedback();
	},
	moretop: function(rows) { 
			let rows2display = (rows||2);
			let keepscrollon = this.getfirstelement(); 
			let monthsDisplayed = rows2display * this.state.mpr; // that is a multiple of an entire row
		$(this.elements.table).prepend(this.rows(rows2display, this.frame.first.decMonth(monthsDisplayed) )); // display
		for(let o_DAY; o_DAY = this.notActivated.shift(); o_DAY.activate()); // activate
		return keepscrollon; // to avoid an ugly spurt effect, the caller should scroll to this keepscrollon element
	},
	morebottom: function(rows) {
			let rows2display = (rows||2);
			let monthsDisplayed = rows2display * this.state.mpr; // that is a multiple of an entire row
		$(this.elements.table).append(this.rows(rows2display, this.frame.nexton)); // display
		for(let o_DAY; o_DAY = this.notActivated.shift(); o_DAY.activate()); // activate
		this.frame.nexton.incMonth(monthsDisplayed);
		return this.getlastelement();
	}
}
	
//////////////////////////

function C_iDP(eid, callbacks, preset) { // preset like { display:{abreviation:'abr', weekday:true}, mindate:jsdate, maxdate:jsdate, enabled:true, stmp:astamp }
	preset = preset||{};
	this.eids = { ui:eid+'_ui', cal:eid+'_cal' };
	this.elements = new A_el();
	this.callbacks = callbacks||{}; // like { dayclick: }
		
	// setting up dates business
	this.month = { first:false, nexton:false, selected:false, today:false  }; // pointers to o_MONTHs
	this.notActivated = new Array();
	this.state = C_iDP.defauts.align(preset);
	
	if(preset.jsdate) this.setPost(preset.jsdate); 
		else if(preset.stmp) this.setPost(new Date(preset.stmp*1000)); 
			else this.setPost();
	
	if(vbs) vlog('controls.js','C_iDP','constructor','tag:'+this.state.display.tag); 
	
	let ui = new C_iCLIK(this.eids.ui, { down:new A_cb(this, this.facedown), click:new A_cb(this, this.pop) } , { tag:this.state.display.tag, ui:'X', enabled:preset.enabled } );	
	this.controls = new A_ct({ui:ui});
}
C_iDP.defauts = new A_df( { jsdate:false, stmp:0, hidden:false, mpr:2, nested:false
	, display: new A_df({ abreviation:'full', weekday:true, tag:'input' }), mindate:false, maxdate:false, weekdays:false /* or an array like [0,6] 0 is sunday */
	, pop:{ css:'' }
	, now:{ midnight:(function(){ let d=new Date(); return d.toMidnight().stamp(); })() }		} );
C_iDP.prototype = {

	// public
	display: function(css) {return this.controls.ui.display(css||''); },
	labelled: function(english, css) {
		let l = C_XL.w(english, {cap:true});
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+l+'</td><td>'+this.display(css)+'</td>';
	},
	
	activate: function() { // activates the label 
		this.elements.collect(this.eids);
		this.controls.activate('C_iDP');
		this.setPost(this.state.jsdate);
		this.displayDate();
	},
	enable: function(onOff) { // can be called before or after activation
		this.controls.ui.enable(onOff);
		return this;
	},
	set: function(date, nofeedback) { 
		let jsdate;
		if(!date) jsdate = new Date();
			else if(typeof date == 'number') jsdate = new Date(date*1000); // date is a PHP stamp
				else jsdate = date.clone(); // date is a Date instance
		this.setPost(jsdate).displayDate();
		if(!nofeedback) if(this.callbacks.dayclick) this.callbacks.dayclick.cb(jsdate, this.state.stmp);
	},
	today: function() { return this.increment({h:true, midnight:true}) },
	stamp: function() { return this.state.stmp; },
	jsdate: function() { return this.state.jsdate.clone(); },
	getpost: function() { return this.stamp(); },
	isopen: function() { return !!this.modal; },
	close: function() {
		if(this.modal) this.modal.close();
		return this.modal = false; 
	}, 
	
	// private
	setPost: function(jsdate) {
		this.state.jsdate = (jsdate||new Date()).clone({midnight:1});
		this.state.stmp = this.state.jsdate.stamp();
		return this;
	},
	displayDate: function() { // on the ui
		let abreviation = this.state.display.abreviation;
		let weekday = this.state.display.weekday;
		let html = C_XL.date(this.state.jsdate, {abreviation:abreviation, weekday:weekday});
		this.controls.ui.set(html);
	},
	dayclick: function(jsdate) { 
		this.setPost(jsdate).displayDate();
		if(this.modal) { this.modal.close(); this.modal = false; }
		if(this.callbacks.dayclick) this.callbacks.dayclick.cb(jsdate, this.state.stmp);
	},
	pop: function() { 
		if(this.modal) { this.modal.close(); this.modal = false; return; }
		
		// the modal was closed
		let cal = new C_iCAL(this.eids.cal, {dayclick:new A_cb(this, this.dayclick)}, { jsdate:this.state.jsdate, mpr:2, rows:6, pastrows:1, mindate:this.state.mindate, maxdate:this.state.maxdate, weekdays:this.state.weekdays });
		this.controls.add1(cal, 'cal');
		let position = { drop:{ui:this.controls.ui.elements.ui}, offset:{x:0,y:5} };
		this.modal = new C_iMODAL(
			{ body:this.controls.cal.display() }, 
			{ escape:new A_cb(this, this.escape), top:new A_cb(this, this.top), bottom:new A_cb(this, this.bottom), scrollstart:new A_cb(this, this.scrollstart) }, 
			{ css:this.state.pop.css||'dp', position:position }
		);
		this.controls.cal.activate();
		this.modal.scrollto(this.controls.cal.getcurrentelement(), {axis:'y', duration:0} );
		return true;
	},
	top: function() { 
		if(vbs) vlog('controls.js','C_iDP','top','');
		let keepscrollon = this.controls.cal.moretop();
		this.modal.scrollto(keepscrollon, {axis:'y', duration:0});
		if(is.tactile) if(this.scrolly) this.scrolly.refresh();
	},
	bottom: function() {
		if(vbs) vlog('controls.js','C_iDP','bottom','');
		this.controls.cal.morebottom();
		if(is.tactile) if(this.scrolly) this.scrolly.refresh();
	},

	
	// event handling
	facedown:function() { return !this.state.nested; /* prevents propagation, nested should be true when this control is nested inside another C_iCLIK */	},
	scrollstart: function() { // for touch devices only
		C_iDAY.state.down = false; /* cancels a date click if your finger slides from a date td */ 
	}, 
	escape: function() { // modal ESC key pressed
		this.modal = false;
		return true;
	},
}
					
//////////////////////////

function C_iDPpop(eid, jsdate, callbacks, preset) { // preset like {abreviation:'abr', weekday:true, year:false }

	// if(vbs) vlog('controls.js','C_iDPpop','constructor','jsdate:'+jsdate); 
		preset = preset || {};
	
	this.midnight = jsdate.clone().toMidnight();
	this.jsdate = jsdate.clone();
	
	this.eids = { date:eid+'_DPpop' };
	this.callbacks = callbacks; // like { setdate };
	this.state = C_iDPpop.defauts.align(preset);
		let date = C_XL.date(jsdate, preset||{abreviation:'abr', weekday:true, year:false } );
	let ui = new C_iCLIK(this.eids.date, { click:new A_cb(this, this.click)} , { ui:date, tag:preset.tag, tip:preset.tip } );
	this.controls = new A_ct({ui:ui});
}
C_iDPpop.defauts = new A_df( { display:{abreviation:'abr', weekday:true, year:false, time:false } } );
C_iDPpop.prototype = { 
	// public
	display: function(css) { 
		let date = this.controls.ui.display(css);
		return date; 
	},
	activate: function() { this.controls.activate('C_iDPpop'); },
	reset: function() { this.controls.reset(); return this; },
	getpost: function() { return this.jsdate; }, // contains time indication if any was present aside the date
	
	// event handling
	click: function() { if(this.callbacks.setdate) this.callbacks.setdate.cb(this.midnight, this.jsdate); }
}




//////////////////////////////////////////////////////////////////////////////////////////////
//    D I S P L A Y S     A     F U L L    Y E A R    P L A N N I N G   
//
function C_iYEAR(eid, callbacks, preset) { // element id of the container element in which we build this control

	this.eid = eid;
	let base = eid+'_' ;
	this.eids = { planning:base+'plan', months:base+'months', grid:base+'grid', left:base+'left', right:base+'right', year:base+'year', post:base+'post', busy:base+'busy', stats:base+'stats' }
	this.elements = new A_el();
	this.callbacks = callbacks; // like { select:o_callback, onresa:o_callback }
	this.state = C_iYEAR.defaults.align(preset);
	
	let now = new Date();
	this.now = { y:now.getFullYear(), m:now.getMonth(), d:now.getDate(), first:new Date(this.y, this.m, 1), midnight:0 };
	this.now.midnight = new Date(this.now.y, this.now.m, this.now.d); this.now.midnight = this.now.midnight.stamp(); 
	
		let labels = []; for(let y=this.now.y-2; y<(this.now.y+5); y++) labels[y] = y;
		let order = []; for(let x in labels) order.push(x);
		let yoptions =  { order:order, labels:labels, presets:{}, count:order.length };
	let year = new C_iDDWN(this.eids.year, { onselect:new A_cb(this, this.year) }, yoptions, { maxcols:1, maxrows:1, value:this.now.y } );

	
	this.controls = new A_ct({year:year, days:new A_ct()});
	this.events = { enter:new A_cb(this, this.dayenter), leave:new A_cb(this, this.dayleave), down:new A_cb(this, this.daydown), up:new A_cb(this, this.dayup), sticker:new A_cb(this, this.onresa) };
	this.handlers = new A_hn({anyup:new A_cb(this, this.anyup)});
}
C_iYEAR.defaults = new A_df( { year:false, rescid:0, busy:false, days:false, dragging:{ busy:false, cin:0, out:0 } } );
C_iYEAR.register = new Array();
C_iYEAR.yearChange = function(eid, value) { C_iYEAR.register[eid].yearChange(value) }
C_iYEAR.prototype = {

	// public
	display: function() {
		const left = '<td id="'+this.eids.left+'" style="width:1%">'+this.months(this.eids.months)+'</td>';
		const right = '<td id="'+this.eids.right+'"></td>';
		const grid = '<div style="position:relative;" id="'+this.eids.grid+'"><table class="year-"><tr>'+left+right+'</tr></table></div>';
		const stats = '<div id="'+this.eids.stats+'">stats:</div>';
		return grid+stats;
	}, 
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate('C_iYEAR');
		this.set(this.now.y);
	},
	query: function() {
		if(this.state.rescid <= 0) return; // no plitems for resources under creation process
		this.busy(true);
		let date = new Date(this.state.year, 0, 1);
		let post = new C_iPASS({key:mobminder.context.keyId,stamp:date.stamp(), days:365, rescId:this.state.rescid, fulldays:1, sms:0, peers:0 });
		let names = {post:{key:'k',stamp:'stamp',days:'days',rescId:'rescId',fulldays:'fulldays',sms:'sms', peers:'peers'}};
		mobminder.app.post({post:post}, names, './queries/plitems.php', new A_cb(this,this.plitems), new A_cb(this,this.plitemsfailed) );
	},
	draggingdone: function() {
		this.cleanup('dragging');
	},
	set: function(year) {
		this.state.year = year || this.state.year;
		this.query();
		if(year) {
			let table = this.planning(this.eids.planning);
			$(this.elements.right).html(table);
			this.elements.collect(this.eids);
			this.controls.days.activate();
		} else {
			this.cleanup();
		}
		return this;
	},	
	
	// private
	planning: function(eid) {
		let trs = new Array;
		let tds;
		let stmp, i, j,date31, day31, dayCode1, tri;
		let date = new Date(this.state.year, 0, 1); // initialized to january 1st
		let index = 0; // days count ranges [0 - 364]
		this.state.days = new Array();
		let o_calday;
		for(let m=0;m<12;m++) {
			let tds = new Array;
			date31 = new Date(date); date31.setMonth(m+1); date31.setDate(date31.getDate()-1); // select last day of this month
			day31 = date31.getDate(); // that is not always 31, it can be 27, 28, 30 or 31
			dayCode1 = date.getDay(); // for the month first day, returns the weekday index that ranges [0 to 6]
			
			for(i=0,j=0;i<dayCode1;i++, j++) tds[j] = '<td class="'+this.css(j,0)+'">'; // skip those empty cells
			for(i=0; i<day31; i++, j++, date.addDay(1)) { // note that j was not re-initialized in this second loop
				let stmp = date.stamp();
				let o_calday = new C_iDAY(this.eid, date, index++, this.events );
				tds[j] = o_calday.td(this.css(j, stmp));
				this.controls.days.add1(o_calday, stmp);
				this.state.days.push(o_calday);
			}
			while(j<37) { tds[j] = '<td class="'+this.css(j,0)+'">'; j++; } // 6*7-5 = 37 - // pad with trailing empty cells
			trs.push('<tr class="'+this.trimester(m)+'">'+tds.join('')+'</tr>');
		}
		return '<table id="'+eid+'" style="" class="year-planning"><tr>'+this.weekdays()+'</tr>'+trs.join('')+'</table>';
	},
	weekdays: function() { // column headers = weekday abreviations
		let tds = new Array, j, k;
		for(j=0, k=6; j<37; j++, k++) // 6*7-5 = 37 is the minimum number of columns needed to display a complete month starting left on the right week day
			tds.push('<th class="'+this.css(j,0)+'">'+C_XL.weekday(1+(k%7), 'min')+'</th>');
		let tr = tds.join('');
		return tr;
	},	
	months: function(eid) { // months names left heading grid rows
		const trs = new Array('<tr><th>'+this.controls.year.display('alpha04 boldy')+'</th></tr>');
		for(let m=0;m<12;m++) {
			trs.push('<tr class="'+this.trimester(m)+'"><td>'+C_XL.month(1+m)+'</td></tr>');
		}
		return '<table id="'+eid+'" class="year-months">'+trs.join('')+'</table>';
	},
	trimester: function(m) { return ((m/3)|0)%2 ? 'trimester-odd' : 'trimester-even'; },
	css: function(j, stmp) {
		const css = 'daycode'+j%7;
		if(stmp == this.now.midnight) css+=' today'; 
		return css;
	}, 
	crossCss: function(td) { // returns references to 2 DOM objects
		const row = $(td).parent("tr");
		const rowIndex = row[0].sectionRowIndex-1;
		const cellIndex = td.cellIndex;
		return $('#'+this.eids.planning+' tbody th:eq('+cellIndex+'), #'+this.eids.months+' tbody td:eq('+rowIndex+')');
	},
	fill: function(o_easyDAYin, o_easyDAYout, css, options) {
		if(options)
			if(options.cleanfirst) this.cleanup(css);
		let ordered = this.order(o_easyDAYin, o_easyDAYout);
		for(let x = ordered.cin.index; x<= ordered.out.index; x++ ) // no dragging allowed over stickers
			if(this.state.days[x].state.sticker) { this.state.dragging.busy = false; return; };
		for(let x = ordered.cin.index; x<= ordered.out.index; x++ )
			$(this.state.days[x].elements.td).addClass(css);
	},
	cleanup: function(css) {
		if(css)
			return $(this.elements.planning).find('td.'+css).removeClass(css);
		for(let x in this.state.days) this.state.days[x].resetcss();
	},
	order: function(o_easyDAYin, o_easyDAYout) {
		let xin = o_easyDAYin;
		let xout = o_easyDAYout;
		if(xout.index<xin.index) { let x = xout; xout = xin, xin = x; }
		return { cin:xin, out:xout }
	},
	busy: function(onoff) {
		if(onoff && !this.state.busy) {
			let overlay = '<div class="modal-busy" id="'+this.eids.busy+'" style="z-index:20; position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden;"></div>';
			$(this.elements.grid).append(overlay);
		} else if(onoff==false && this.state.busy) {
			let element = document.getElementById(this.eids.busy);
			if(element) $(element).remove();
		}
		this.state.busy = onoff;
		return this;
	},
	stats: function(colors) {
		let trs = new Array();
		for(let id in colors.labels) {
			let name = colors.labels[id];
			let counter = colors.counters[id];
			trs.push('<tr><td style="text-align:right; font-weight:bold; padding-right:0.6em;">'+counter+'</td><td style="text-align:left;">'+name+'</td></tr>');
		}
		let table = '<table class="year-stats">'+trs.join('')+'</table>';
		this.elements.stats.innerHTML = table;
	},
	
	// events
	dayenter: function(o_easyDAY) {
		if(vbs) vlog('controls.js','C_iYEAR','dayenter','dragging.busy='+this.state.dragging.busy);
		$(this.crossCss(o_easyDAY.elements.td)).addClass('highlight');
		if(this.state.dragging.busy) { 
			this.state.dragging.out = o_easyDAY;
			this.fill(this.state.dragging.cin, this.state.dragging.out, 'dragging', {cleanfirst:true});
		}
	},
	dayleave: function(o_easyDAY) {
		if(vbs) vlog('controls.js','C_iYEAR','dayleave','dragging.busy='+this.state.dragging.busy);
		$(this.crossCss(o_easyDAY.elements.td)).removeClass('highlight');
	},
	daydown: function(o_easyDAY) {
		if(vbs) vlog('controls.js','C_iYEAR','daydown','dragging.busy='+this.state.dragging.busy);
		this.state.dragging.busy = true;
		this.state.dragging.cin = o_easyDAY;
		this.dayenter(o_easyDAY);
		$(document).mouseup(this.handlers.anyup);
	},
	dayup: function(o_easyDAY) {
		if(vbs) vlog('controls.js','C_iYEAR','dayup','dragging.busy='+this.state.dragging.busy);
		if(this.state.dragging.busy) {
			const ordered = this.order(this.state.dragging.cin, this.state.dragging.out);
			if(this.callbacks.select) {  this.callbacks.select.cb(ordered, o_easyDAY.eids.td); }
		}
		this.state.dragging.busy = false;
	},
	anyup: function() {
		if(vbs) vlog('controls.js','C_iYEAR','anyup','dragging.busy='+this.state.dragging.busy);
		$(document).unbind('mouseup', this.handlers.anyup);
		if(this.state.dragging.busy) this.draggingdone();
		this.state.dragging.busy = false;
	},
	onresa: function(resa) {
		if(this.callbacks.onresa) this.callbacks.onresa.cb(resa);
	},
	year: function(which) {
		if(which == this.state.year) return;
		this.set(which|0);
	},
	
	// ajax feedback
	plitems: function(dataSets) {
		this.busy(false);
		let attendees = dataSets['C_dS_attendee'];
		let reservations = dataSets['C_dS_reservation'];
		let newyearsday = new Date(this.state.year, 0, 1); let nyStamp = newyearsday.stamp();
		let newyearseve = new Date(this.state.year+1, 0, 1); let eveStamp = newyearseve.stamp();
		let colors = C_dS_customCss.options(resaclass.event, ccsstype.color);
	if(vbs) vlog('controls.js','C_iYEAR','plitems','newyearsday:'+newyearsday.sortable()+'newyearseve:'+newyearseve.sortable()); 
		let id, x;
			colors.counters = []; for(id in colors.labels) colors.counters[id] = 0; // initialize counters
		for(id in attendees) {
			let attendee = attendees[id];
			if(attendee.resourceType == class_visitor) continue;
			if(attendee.resourceId != this.state.rescid) continue;
			let resa = reservations[attendee.resaId];
			if(resa.deletorId) continue; // we do not show deleted stuff
			let parts = resa.getparts();
			for(x in parts) {
				let part = parts[x];
				let midnight = part.midnight; 
				if(midnight < nyStamp) continue;
				if(midnight >= eveStamp) continue;
				if(part.cueOut == part.midnight) continue; // zero length trailer part, forget
				if(resa.cssColor in colors.labels) colors.counters[resa.cssColor]++; // off days counter
				this.controls.days[midnight].sticker(resa.css, resa);
			}
		}
		this.stats(colors);
	},
	plitemsfailed: function() { this.busy(false); }
}


//////////////////////////////////////////////////////////////////////////////////////////////
//    C H O O S E     A    C A L E N D A R    R E C U R R E N C E   
//
function C_iRECUR(eid, callbacks, preset) {
		let b = eid+'_';
	this.eids = { rmode:b+'rmd'
				, drepete:b+'drp', wrepete:b+'wrp', mrepete:b+'mrp', yrepete:b+'yrp', ydate:b+'ydt', wdays:b+'wds', mwdays:b+'mwd', mpattern:b+'mfr'
				, iterate:b+'itr', dpOut:b+'dpOut'
				, own:{ prvws:b+'prvw' }
				, wrappers:{ rmode: {daily:b+'rmd_d', weekly:b+'rmd_w', monthly:b+'rmd_m', monthframe:b+'rmd_mf', yearly:b+'rmd_a' }
							, mpattern: { mdate:b+'mfr_dt', mwdays:b+'mfr_wd', mlast:b+'mfr_lt' } }
				, xcludes:b+'xcl_', xcluded:b+'xcld_', icludes:b+'icl_'
				};
				
	this.elements = { wrappers:new A_el(), own:new A_el() };
	this.callbacks = callbacks || {}; // like { resumed:A_cb, onpreview:A_cb }
	this.state = C_iRECUR.defaults.align(preset);
		let din  = new Date(this.state.midnIn*1000 ); this.state.midnIn  = din.toMidnight().getPHPstamp();
	
		// recurrence mode
			let rmodopt = C_XL.w({ daily:'daily', weekly:'weekly', monthly:'monthly', yearly:'yearly' });
	let rmode = new C_iDDWN(this.eids.rmode, { onselect:new A_cb(this, this.onrmode) }, { labels:rmodopt }, { value:'weekly' } );
	
		// daily repetition (step)
			let drepopt = C_XL.w({ 1:'every day' });
			for(let x = 2; x<15; x++) drepopt[x] = C_XL.w('every')+' '+x+' '+C_XL.w('days');
	let drepete = new C_iDDWN(this.eids.drepete, { onselect:new A_cb(this, this.ondrepete) }, { labels:drepopt }, { value:1 } );
	
		// weekly pattern
			let wrepopt = C_XL.w({ 1:'every week' });
			for(let x = 2; x<27; x++) wrepopt[x] = C_XL.w('every -f')+' '+x+' '+C_XL.w('weeks');
	let wrepete = new C_iDDWN(this.eids.wrepete, { onselect:new A_cb(this, this.onwrepete) }, { labels:wrepopt }, { value:1 } );
	
			let jsdate = new Date(this.state.cue*1000); let encoday = 1<<(jsdate.getPHPday()-1);
	let wdays = new C_iWDAYs(this.eids.wdays, { onwdays:new A_cb(this, this.onwdays) }, { encoded:encoday, disabled:encoday } );
	
		// monthly pattern
			let mrepopt = C_XL.w({ 1:'every month' });
			for(let x = 2; x<12; x++) mrepopt[x] = C_XL.w('every')+' '+x+' '+C_XL.w('months');
	let mrepete = new C_iDDWN(this.eids.mrepete, { onselect:new A_cb(this, this.onmrepete) }, { labels:mrepopt }, { value:1 } );
	let mwdays = new C_iWDAYs(this.eids.mwdays, { onwdays:new A_cb(this, this.onmwdays) }, { encoded:encoday, disabled:encoday } );
	
		let mwpopts = C_XL.w({ 1:'on first', 2:'on second', 3:'on third', 4:'on fourth', 9:'on the last' });
			let jsdpos = jsdate.daypos();
			let jsdposlast = jsdate.dayposlast();
			let jsddatelast = jsdate.datelast();
	
		let mpatopts = { 0:C_XL.w('on a date')+':&nbsp;'+C_XL.w('ondate')+'&nbsp;'+jsdate.getDate() };
		if(jsdpos<5) mpatopts[jsdpos] = mwpopts[jsdpos];
		if(jsdposlast==-1) mpatopts[9] = mwpopts[9];
		
				let mlastopt = C_XL.w({ 1:'on last day', 2:'penulti day' });
			for(let x = 3; x<=10; x++) mlastopt[x] = x+' '+C_XL.w('days before eom');
		if(jsddatelast>=-10) mpatopts[jsddatelast] = mlastopt[-jsddatelast];
	
	let mpattern = new C_iCRESTA(this.eids.mpattern, { onchange:new A_cb(this,this.onmpattern)}, { labels:mpatopts }, { skin:0, title:false, mode:-1, value:0 });

		// yearly
			let yrepopt = C_XL.w({ 1:'every year' });
			for(let x = 2; x<6; x++) yrepopt[x] = C_XL.w('every')+' '+x+' '+C_XL.w('years');
	let yrepete = new C_iDDWN(this.eids.yrepete, { onselect:new A_cb(this, this.onyrepete) }, { labels:yrepopt }, { value:1 } );
	let ydate = new C_iDPpop(this.eids.ydate, jsdate, { setdate:false }, { abreviation:'full', weekday:false, year:false } );
	
		// iterations
			let iteropt = C_XL.w({ 1:'one time' });
			for(let x = 2; x<53; x++) iteropt[x] = x+' '+C_XL.w('x times');
	let iterate = new C_iDDWN(this.eids.iterate, { onselect:new A_cb(this, this.oniterate) }, { labels:iteropt }, { value:1 } );
	
	let dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { stmp:this.state.cue, display:{abreviation:'full', weekday:true} } );

	this.xcluded = new Array();
	this.dpoptions = { abreviation:'full', weekday:true, year:true, time:true, tag:'td', tip:C_XL.w('tip click to switch to date') };
		
	this.controls = new A_ct({ dpOut:dpOut, rmode:rmode, drepete:drepete, wrepete:wrepete, mrepete:mrepete, yrepete:yrepete
							, ydate:ydate, iterate:iterate, wdays:wdays, mpattern:mpattern, mwdays:mwdays
							, previews:new A_ct(), xcludes:new A_ct(), xcluded:new A_ct(), icludes:new A_ct() });
}
C_iRECUR.defaults = new A_df({ cue:0, drive:'iterate', recurrence:'weekly' });
C_iRECUR.prototype = {

	display: function(css) {
			let rmode = '<tr>'+this.controls.rmode.labelled('recurrence')+'<td></td></tr>';
			let drepete = '<tr id='+this.eids.wrappers.rmode.daily+'>'+this.controls.drepete.labelled('repeats every')+'<td></td></tr>';
			let wrepete = '<tr id='+this.eids.wrappers.rmode.weekly+'>'+this.controls.wrepete.labelled('repeats every')+'<td>'+this.controls.wdays.display()+'</td></tr>';
			let mrepete = '<tr id='+this.eids.wrappers.rmode.monthly+'>'+this.controls.mrepete.labelled('repeats every')+'<td></td></tr>';
				let mwdays 	= '<td id='+this.eids.wrappers.mpattern.mwdays+'>'+this.controls.mwdays.display()+'</td>';
				let mdate 	= '<td id='+this.eids.wrappers.mpattern.mdate+' class="vtop">'+'</td>'; // returns a double <td> inside a table
				let mlast 	= '<td id='+this.eids.wrappers.mpattern.mlast+' class="vbottom">'+'</td>'; // there is no further choice here
			let mpattern 	= '<tr id='+this.eids.wrappers.rmode.monthframe+'><td></td><td>'+this.controls.mpattern.display()+'</td>'+mwdays+mdate+mlast+'</tr>';
			let yrepete = '<tr id='+this.eids.wrappers.rmode.yearly+'>'+this.controls.yrepete.labelled('repeats every')+'<td>'+'&nbsp;'+C_XL.w('ondate')+this.controls.ydate.display()+'</td></tr>';
			
			let iterate = '<tr>'+this.controls.iterate.labelled('happens xt')+'<td></td></tr>';
			let dpOut = '<td></td>'+this.controls.dpOut.labelled('up to date','bold alpha18');
			
		let recur = '<table style="margin:1em 0;">'+rmode+drepete+wrepete+mrepete+mpattern+yrepete+iterate+dpOut+'</table>';	
		
			let preview = '<div class="textcolor-light">'+C_XL.w('preview')+'</div>';
			let inner = '<div id="'+this.eids.own.prvws+'" class="" style="border:1px solid rgba(0,0,0, 0.1); border-radius:3px; padding:1em; width:44em; min-height:10em; margin-bottom:1em;">'+'</div>';
		let outer = '<div class="wide100" style="min-height:10em; height:10em; overflow-y;visible;">'+preview+inner+'</div>';
		
		return recur+outer;
	},
	activate: function() {
		this.elements.wrappers.collect(this.eids.wrappers);
		this.elements.own.collect(this.eids.own);
		this.controls.activate();
		// this.controls.dpOut.set(this.state.midnOut);
		this.controls.rmode.set('weekly'); // triggers the wrappers show/hide
		this.controls.mpattern.docheck(0); // triggers the wrappers show/hide
		return this;
	},	
	getpost: function() { 
		let post = new Array();
		let dates = this.controls.previews.getpost();
		for(let x in dates) post.push(dates[x].stamp());
		return post.join('!'); 
	},
	isopen: function() {
		let midnIn = this.controls.dpIn.isopen();
		let midnOut = this.controls.dpOut.isopen();
		return midnIn||midnOut;
	},
	
	// private
	resume: function(cue) { // displays a preview of all generated dates according to user settings
	
		if(cue) this.state.cue = cue;
		
		let d = this.state.drive;	// what let the serie stop [ iterate, or date (dpout) ]
		let r = this.state.recurrence;	// the mode of reccurence [ daily, weekly, monthly, yearly ]
			let i = this.controls.iterate.value()|0; // number of times the appointment should happen (relevant if drive is iterate)
			let t = this.controls.dpOut.jsdate(); // jsdate term date to stop the serie (relevant if drive is dpout)
		let s = 1; 	// the stepping (every 2 weeks eg.)
		let w = [];	// the concerned weekdays
		let m = this.controls.mpattern.getvalue()|0; // m is negative to reach last days of the months, is 0 for a specific date, is positive for the x'th week of the month and is 9 for the last week of the month
		
		// define the stepping
		let c; switch(r) {
			case 'daily': c = this.controls.get.drepete; break;
			case 'weekly': c = this.controls.get.wrepete; w = this.controls.wdays.value(); break;
			case 'monthly': c = this.controls.get.mrepete; w = this.controls.mwdays.value(); break;
			case 'yearly': c = this.controls.get.yrepete; break;
		}; 
		s = c.value()|0;
		
		if(vbs) vlog('controls.js','C_iRECUR','resume','drive:'+d+', recur:'+r+', step:'+s+', iterates:'+i+', wdays:'+w.join('|'));
		
		if(!this.elements.own.prvws) return this;
		
		// define the first occurance
		let jsd = new Date(this.state.cue*1000); // initial date
			t.seconds(jsd.seconds()+1); // t comes from a date picker and has no time setting 
		switch(r) {
			case 'daily': break; // jsd is the first occurance in this case
			
		}
		let first = new C_iDPpop(this.eids.own.prvws+'_0', jsd, { setdate:new A_cb(this, this.onpreview, 1) }, this.dpoptions );
		let previews = new A_ct({}); 
			previews.add1(first,jsd.stamp()); // the date selected on the planning is the first an mandatory step.

		// produce iterations
			let o = 1; // occurance
				let goon; switch(d) { // defines if more iterations must be found, depends on the drive
					case 'iterate': goon = function(o,j) { return o<i;  }; break;
					case 'dpout': goon = function(o,j) { return j.isbefore(t); }; break;
				}
				let increment; switch(r) { // defines how the next iteration is computed, depends on the reccurence mode
						case 'daily': increment = function(jsd) { jsd.increment({d:s}); }; break;
						case 'yearly': increment = function(jsd) { jsd.increment({y:s}); }; break;
						case 'weekly': increment = function(jsd) { jsd.increment({wd:w, ws:s}); }; break;
						case 'monthly': 
								increment = function(jsd) { jsd.increment({m:s}); } // every s months on the same date
								if(m>0) increment = function(jsd) { jsd.increment({wd:w, wp:(m==9?-1:m), ms:s}) }; // week days pattern cases
								if(m<0) increment = function(jsd) { jsd.increment({nm:s+1,d:m}); } // m days before the end of the month
							break;
				}
			let iterate = function(o,d,x) { 
				// o is the occurance number, d is a jsdate to be incremented, x is an array indexed by xcluded cues
				do increment(d); while(x[d.stamp()]); // skip the cues that are selected for xclusion through the preview interactivity
				return goon(o,d); 
			};
			let jsdi = jsd.clone(), lastmidnite = first.midnight, iterpop;
		while(iterate(o++,jsdi,this.xcluded)) { 
			iterpop = new C_iDPpop(this.eids.own.prvws+'_'+o, jsdi.clone(), { setdate:new A_cb(this, this.onpreview, o) }, this.dpoptions );
			previews.add1(iterpop, jsdi.stamp());
			lastmidnite = iterpop.midnight;
		} o--;
		
	
		// feedback the drive date on the iteration controls
		switch(d) { // depends on the drive
			case 'iterate': this.controls.dpOut.set(lastmidnite, true); break; // watch the nofeedback parameter
			case 'dpout': this.controls.iterate.set(o>52?52:o, o<=52); break; // watch the on purpose not set nofeedback parameter
			// when dpout is the drive, the resume function is called again if the iteration number defined is bigger than 52
			// this is because the iterate control has a higher limit (which is 52)
		}
		this.controls.previews = previews;
		if(this.callbacks.resumed) this.callbacks.resumed.cb(this.getpost());
		
		
		this.prevdisplay();
	},
	prevdisplay: function(warnings) {
		
		warnings = warnings||[];
		let el = this.elements.own.prvws; el.innerHTML = '';
		let warnicon = '<div style="font-size:1.2em; display:inline-block;" class="orange fa fa-gray fa-warning"></div>';
		
		// display preview
		this.controls.previews.reset();
		this.controls.xcludes = new A_ct(); // gives the opportunity to exclude a cue
		this.controls.xcluded = new A_ct(); // shows already excluded cues 
		this.controls.icludes = new A_ct(); // gives the opportunity to re-include a cue
		
		
		// excluded dates rows
		let trsX = {}; // Xcluded
		for(let c in this.xcluded) {
				let jsd = new Date(c*1000);
			let dppop = new C_iDPpop(this.eids.xcluded+'_'+c, jsd, { setdate:new A_cb(this, this.onexcluded) }, this.dpoptions );
			let date = dppop.display('textcolor-light');
				let cue = jsd.stamp();
			this.controls.xcluded.add1(dppop,cue);
			let index = '<td>'+'</td>'; // no index for excluded items
					let bin = '<div style="font-size:1.4em; display:inline-block;" class="fa fa-gray fa-recycle"></div>';
				let incl = new C_iCLIK(this.eids.icludes+c+'_clk', { click:new A_cb(this, this.reinclude, cue) }, { ui:bin+' '+C_XL.w('include date'), visible:false, enabled:true, tip:C_XL.w('tip include this date'), css:'', tag:'td' });
				this.controls.icludes.add1(incl,cue);
			let warning = '<td class="textcolor-light" style="text-align:right;">('+C_XL.w('excluded')+')</td>';
			let include = incl.display();
			trsX[cue] = '<tr>'+warning+index+date+include+'</tr>';
		}
		
		// preview dates as calculated by the resume() 
		let trsP = {}; // Preview
		let o = 1; 
		for(let c in this.controls.previews.get) { 
			let dppop = this.controls.previews.get[c];
			let date = dppop.display();
			let index = '<td style="text-align:right; padding-left:1em;">'+o+++'. </td>';
				let cue = dppop.jsdate.stamp();
			let warning = (cue in warnings)?'<td>('+C_XL.w('overbooking')+') '+warnicon+'</td>':'<td></td>';
					let bin = '<div style="font-size:1.4em; display:inline-block;" class="fa fa-gray fa-trash"></div>';
				let xcl = new C_iCLIK(this.eids.xcludes+cue+'_clk', { click:new A_cb(this, this.xclude, cue) }, { ui:bin+' '+C_XL.w('xclude date'), visible:false, enabled:true, tip:C_XL.w('tip xclude this date'), css:'', tag:'td' });
				this.controls.xcludes.add1(xcl,cue);
			let exclude = xcl.display();
			trsP[cue] = '<tr>'+warning+index+date+exclude+'</tr>';
		}
		
		// merged rows 
		let trs = new Array(); for(let c in trsX) trs.push(c); for(let c in trsP) trs.push(c); trs.sort(); for(let x in trs) trs[x] = trsP[trs[x]]||trsX[trs[x]];
		el.innerHTML = '<table>'+trs.join('')+'</table>';
		
		this.controls.previews.activate();
		this.controls.xcludes.activate();
		this.controls.xcluded.activate();
		this.controls.icludes.activate();
	},
	
	// callbacks
	onrmode: function(which) {
		if(vbs) vlog('controls.js','C_iRECUR','onrmode','which:'+which);
			let els = this.elements.wrappers.rmode.get;
		for(let x in els) $(els[x]).hide(); $(els[which]).show();
		if(which=='monthly') $(els.monthframe).show();
		this.state.recurrence = which;
		this.resume();
	},
	ondrepete: function(which) { if(vbs) vlog('controls.js','C_iRECUR','ondrepete','which:'+which); this.resume();	},
	onwrepete: function(which) { if(vbs) vlog('controls.js','C_iRECUR','onwrepete','which:'+which); this.resume();	},
	onmrepete: function(which) { if(vbs) vlog('controls.js','C_iRECUR','onmrepete','which:'+which); this.resume();	},
	onyrepete: function(which) { if(vbs) vlog('controls.js','C_iRECUR','onyrepete','which:'+which); this.resume();	},
	onmpattern: function(which) {
				which = which|0;
			let els = this.elements.wrappers.mpattern.get; 
		let wrapper = 'mwdays'; 
			if(which==0) wrapper = 'mdate';
			if(which<0) wrapper = 'mlast';
		for(let x in els) $(els[x]).hide(); $(els[wrapper]).show();
		if(vbs) vlog('controls.js','C_iRECUR','onmpattern','which:'+which+', wrapper:'+wrapper);
		this.resume();
	},
	onwdays: function(coded) { if(vbs) vlog('controls.js','C_iRECUR','onwdays','coded:'+coded); this.resume(); },
	onmwdays: function(coded) { if(vbs) vlog('controls.js','C_iRECUR','onmwdays','coded:'+coded); this.resume(); },
	onmlast: function(date) { if(vbs) vlog('controls.js','C_iRECUR','onmlast','date:'+date); this.resume(); },
	oniterate: function(which) { if(vbs) vlog('controls.js','C_iRECUR','oniterate','which:'+which); this.state.drive = 'iterate'; this.resume(); },
	dpOut: function(jsdate, stmp) { if(vbs) vlog('controls.js','C_iRECUR','dpOut','jsdate:'+jsdate.sortable()+', stmp:'+stmp); this.state.drive = 'dpout'; this.resume(); },
	
	onpreview: function(o,m,j) {
		if(vbs) vlog('controls.js','C_iRECUR','onpreview','jsdate:'+j.datetimestr()+', midnight:'+m.sortable());
		if(this.callbacks.onpreview) this.callbacks.onpreview.cb(m);
			let cue = j.stamp();
		if(o!=1) // the first one may not be excluded
			this.controls.xcludes.get[cue].visible(true);
	},
	onexcluded: function(m,j) {
		if(vbs) vlog('controls.js','C_iRECUR','onexcluded','jsdate:'+j.datetimestr()+', midnight:'+m.sortable());
		if(this.callbacks.onpreview) this.callbacks.onpreview.cb(m);
			let cue = j.stamp();
		this.controls.icludes.get[cue].visible(true);
	},
	xclude: function(cue) {
		if(vbs) vlog('controls.js','C_iRECUR','xclude','xclude this cue:'+cue);
		this.xcluded[cue] = 1;
		this.resume();
	},
	reinclude: function(cue) {
		if(vbs) vlog('controls.js','C_iRECUR','reinclude','re-include this cue:'+cue);
		this.xcluded.splice(cue,1);
		this.resume();
	}
	// handlers:
}



//////////////////////////////////////////////////////////////////////////////////////////////
//    C H O O S E     A    C A L E N D A R     P E R I O D  
//
function C_iPERIOD(eid, callbacks, preset) {
	this.eids = { picker:eid+'_pickr', dpIn:eid+'_dpIn', dpOut:eid+'_dpOut'};
				
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { pchange:A_cb }
	this.state = C_iPERIOD.defaults.align(preset);
	this.state.mode = this.mode(); // decodes the DB setting
		// let din  = new Date(this.state.midnIn*1000 ); this.state.midnIn  = din.toMidnight().getPHPstamp();
		// let dout = new Date(this.state.midnOut*1000); this.state.midnOut = dout.toMidnight().getPHPstamp();
	if(this.state.midnOut<this.state.midnIn) this.state.midnOut = this.state.midnIn;
	
		if(preset.options) options = preset.options; else options = { 0:'always', 1:'up to date', 2:'from date', 3:'in period', 6:'single day' };
	let picker = new C_iCRESTA(this.eids.picker, { onchange:new A_cb(this,this.onpicker)}, { labels:C_XL.w(options) }, { skin:0, title:false, mode:-1, value:this.state.mode });
	
	let dpIn  = new C_iDP(this.eids.dpIn, {dayclick:new A_cb(this, this.dpIn)}, { stmp:this.state.midnIn, display:{abreviation:'full', weekday:true} } );
	let dpOut = new C_iDP(this.eids.dpOut, {dayclick:new A_cb(this, this.dpOut)}, { stmp:this.state.midnOut, display:{abreviation:'full', weekday:true} } );

	this.controls = new A_ct({picker:picker, dpIn:dpIn, dpOut:dpOut });
}
C_iPERIOD.defaults = new A_df({ midnIn:0, midnOut:0, mode:1 });
C_iPERIOD.prototype = {

	display: function(css, style) {
			css = css||''; style = style||'';
		let dpIn = '<td style="width:20em; text-align:right;">'+this.controls.dpIn.display('bold alpha16 right')+'</td>';
		let picker = '<td style="width:10em; padding:0 1em;">'+this.controls.picker.display()+'</td>';
		let dpOut = '<td style="width:20em; text-align:left;">'+this.controls.dpOut.display('bold alpha16')+'</td>';
			if(css) css=' class="'+css+'"'; if(style) style='style="'+style+'"';
		let table = '<table '+style+css+'><tr>'+dpIn+picker+dpOut+'</tr></table>';
		return table;
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		this.enableDPs(); 
		return this;
	},	
	getpost: function() { 
		let midnIn = 0, midnOut = 0; // takes care of the BD protocol
		if(this.state.mode&2) midnIn = this.state.midnIn;
		if(this.state.mode&1) midnOut = this.state.midnOut;
		if(this.state.mode&4) midnOut = midnIn = this.state.midnIn;
		return { midnIn:midnIn, midnOut:midnOut }; 
	},
	isopen: function() {
		let midnIn = this.controls.dpIn.isopen();
		let midnOut = this.controls.dpOut.isopen();
		return midnIn||midnOut;
	},
	
	// private
	mode: function() { // bit map: 00b = always, 01b = up to, 10b = from, 11b = period, 110b = 1day
		let upto = this.state.midnOut ? 1 : 0;
		let from = this.state.midnIn  ? 1 : 0;
		let none = !(upto+from);
		if(none) return 0;
		let aday = this.state.midnOut==this.state.midnIn;
		if(aday) return parseInt('110',2); else return (upto<<0)|(from<<1);
	},
	enableDPs: function() {
		this.controls.dpIn.set(this.state.midnIn);
		this.controls.dpOut.set(this.state.midnOut);
		this.controls.dpIn.enable(this.state.mode&2);// right side DP active
		this.controls.dpOut.enable(this.state.mode&1);// right side DP active
	},
	
	// callbacks
	onpicker: function(which) {
		if(vbs) vlog('controls.js','C_iPERIOD','onpicker','which:'+which);
		this.state.mode = which;
		this.enableDPs();
		if(this.callbacks.pchange) this.callbacks.pchange.cb(this.state.midnIn, this.state.midnOut);
	},
	dpIn: function(jsdate, stmp) {
		if(vbs) vlog('controls.js','C_iPERIOD','dpIn','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
		if(stmp > this.controls.dpOut.stamp()) this.controls.dpOut.set(stmp, nofeedback);
		this.state.midnIn = stmp;
		if(this.callbacks.pchange) this.callbacks.pchange.cb(this.state.midnIn, this.state.midnOut);
	},
	dpOut: function(jsdate, stmp) {
		if(vbs) vlog('controls.js','C_iPERIOD','dpOut','jsdate:'+jsdate.sortable()+', stmp:'+stmp);
		if(stmp < this.controls.dpIn.stamp()) this.controls.dpIn.set(stmp, nofeedback);
		this.state.midnOut = stmp;
		if(this.callbacks.pchange) this.callbacks.pchange.cb(this.state.midnIn, this.state.midnOut);
	}
	
	// handlers:
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F    C A L E N D A R     T E R M
//
function C_iBEFORE(eid, callbacks, preset) { // pick out from a list of future dates

	// This control runs in different mode and different purposes:
	// - presetting choices: it appears like a multi checker
	// - search dashboard in agenda mode: it allows 'urgent' and a custom date picker
	// - e-reservation: it does not allow 'urgent' but 'tomorrow' instead, and there is no date picker
	//
		preset=preset||{};
	this.eids = { radio:eid+'_pk', dp:eid+'_dp' };
	this.callbacks = callbacks || {}; // like { onbefore: };
	this.state = C_iBEFORE.defauts.align(preset); this.state.jsDate = new Date();
		let withdp = (this.state.mode=='radio')&&(this.state.eresa==false);
	this.is = { withdp:withdp, presetmode:(this.state.mode=='checker') }; // mode = 'multi' is foreseen for backoffice choosing of 'not before' options
	this.elements = new A_el();
	let presets = new Array(); // specifies which radio to set at init time
	let yesterday = new Date(); yesterday.increment( {d:-1} );
	
		let precheck = false, which = preset.selection||C_iBEFORE.encode([10, 11, 12, 13, 20, 21, 23, 26]); // default setting for run mode
		if(this.is.presetmode) { which = false; precheck = preset.selection; } // setting for preset mode ( e.g. C_backPREFS, all possible options are shown )
		
		this.enlabels = C_iBEFORE.store.align({}); this.enlabels[0] = this.state.soonest;
	let options = C_iBEFORE.options(which, precheck, { eresa:this.state.eresa }, this.enlabels); // translates the block of options in one shot
	let controls = {};
	if(this.is.withdp) {
		let dp = new C_iDP(this.eids.dp, {dayclick:new A_cb(this, this.dpSelect)}, { display:{abreviation:'abr', weekday:true, tag:'span'}, mindate:yesterday, nested:true } );
		options.labels[99] = dp.display('-'); // css = '-' prevents the default "click" class of C_iCLICK, we do not want this css here
		options.count++;
		options.order.push(99);
		controls = {dp:dp};
	}
	this.controls = new A_ct(controls);
		let mode = (this.state.mode=='radio')?-1:1, skin = (this.state.mode=='radio')?0:1;
	let radio = new C_iCRESTA(this.eids.radio, { onchange:new A_cb(this, this.onselect) }, options, { title:C_XL.w(this.state.title), skin:skin, mode:mode, maxrows:(preset.maxrows||12) } );
	this.controls.add({radio:radio});
}
C_iBEFORE.defauts = new A_df( {jsDate:false, mode:'radio', eresa:false, soonest:'urgent', title:'not before' } );
C_iBEFORE.store = new A_df( { 0:'urgent', 1:'tomorrow', 2:'after tomorrow', 3:'within 3 days', 10:'next week', 11:'one week', 12:'two weeks', 13:'three weeks', 15:'five weeks', 16:'six weeks', 
				20:'next month', 21:'one month', 22:'two months', 23:'three months', 24:'four months', 25:'five months', 26:'six months', 28:'eight months', 29:'nine months', 
				40:'one year' } );
				
C_iBEFORE.increments = { 0:{h:1}, 	 1:{d:1},  	 2:{d:2},  	 3:{d:3},  	10:{nw:1}, 	11:{d:7}, 	12:{d:14}, 	13:{d:21}, 	15:{d:35}, 	16:{d:42},  	
						20:{nm:1}, 	21:{m:1},   22:{m:2},   23:{m:3},   24:{m:4},   25:{m:5},   26:{m:6},   
						28:{m:8},   29:{m:9}, 	40:{y:1} 	
						};
C_iBEFORE.bits 	 	 = { 	 1:0x000001, 10:0x000002, 11:0x000004,	12:0X000008, 	13:0X000010, 			   15:0X000040, 16:0X000080, 	/* byte 1 of 8 */
							20:0X000100, 21:0X000200, 22:0x000400, 23:0x000800, 	24:0x001000, 25:0x002000, 			    26:0x008000, 	/* byte 2 of 8 */
							28:0x020000, 29:0x040000, 								 2:0X100000,  3:0X200000,				40:0X800000, 	/* byte 3 of 8 */
							 0:0X08000000 /* byte 4 of 8 */
						};
						
C_iBEFORE.encode = function(values) { let bits = 0; for(let x in values) bits|=C_iBEFORE.bits[values[x]]; return bits; }

C_iBEFORE.options = function(which, precheck, mode, enlabels) { // only bitmaps in here
	
	// which is the list of choices that should appear on the control
	// when running in checker mode, which must be false and all possible choices will appear on the control
	// in checker mode, wich is false and precheck is mandatory
	
	mode = mode || {};
	let presets = {}, labels = {};
		
	if(which) { // radio mode, applies where the surfer must choose one option only.
	
	} else { // checker mode: all possible options are proposed, that is for setup
		which = [];
		for(let i in C_iBEFORE.bits) which |= C_iBEFORE.bits[i];
	}
	
	if(vbs) vlog('controls.js','C_iBEFORE','options','which:'+bitmap(which)+', precheck:'+bitmap(precheck));
	
	for(let i in C_iBEFORE.bits) {
		let checkbit = C_iBEFORE.bits[i];
		if(which) if(!(which&checkbit)) continue; // labels and preset are ok for i == 0
		labels[i] = enlabels[i];
			let date = new Date(); date.increment(C_iBEFORE.increments[i]);
		presets[i] = { tip:C_XL.date(date,{abreviation:'abr',weekday:true}), checked:!!(precheck&checkbit) };
	}
	let order = new Array(); for(let i in labels) order.push(i);
	
	return { order:order, labels:C_XL.w(labels), presets:presets, count:order.length };
};
C_iBEFORE.prototype = {
	// public
	display: function(css) {
		let radio = this.controls.radio.display(); 
		return '<table style="text-align:left; layout:fixed"><tr><td>'+radio+'</td></tr></table>';
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iBEFORE','activate','title:'+this.controls.radio.state.title);
	
		this.elements.collect(this.eids);
		this.controls.activate('C_iBEFORE');
		
		if(!this.is.presetmode) this.controls.radio.reset();
	},
	reset: function() {
		this.controls.radio.reset();
		return this;
	},
	getpost: function() { 
		if(this.is.presetmode) { // checker mode for recording setup preferences
			let bits = C_iBEFORE.encode(this.controls.radio.getvalue());
			if(vbs) vlog('controls.js','C_iBEFORE','getpost','mode:preset'+', bits:'+bitmap(bits));
			return bits;
		}
		else return this.state.jsdate.getPHPstamp(); // radio mode (is the user mode)
	},
	getjsdate: function() {
		if(this.is.presetmode) return false;
		return this.state.jsdate.clone();
	},
	value: function() {
		if(this.is.presetmode) { // checker mode for recording setup preferences
			return this.controls.radio.getvalue(); // returns an array like [ "0","3","12","15","20","40"] according to C_iBEFORE.store indexes
		}
		else return this.state.jsdate.getPHPstamp(); // radio mode (is the user mode)
	},
	
	// private
	
	// private event handlers
	onselect: function(option) {
		if(this.is.presetmode) { // case of check boxes
			if(this.callbacks.onbefore) {
				let setting = option;
				this.callbacks.onbefore.cb(setting);
			}
			return; 
		}
		let date = new Date();
		if(option=='99') { // date picker
			this.state.jsdate = this.controls.dp.state.jsdate; // click on radio button
		} else { // other radios
			date.increment(C_iBEFORE.increments[option]);
			this.state.jsdate = date;
			if(option!='0') this.state.jsdate.toMidnight();
		}
		if(vbs) vlog('controls.js','C_iBEFORE','onselect','option:'+option+', jsdate:'+this.state.jsdate.sortable());
		if(this.callbacks.onbefore) this.callbacks.onbefore.cb(date,option);
	},
	dpSelect: function(jsdate) {
		if(vbs) vlog('controls.js','C_iBEFORE','dpSelect','jsdate:'+jsdate.sortable());
		this.state.jsdate = jsdate;
		this.controls.radio.docheck(99);
		if(this.callbacks.onbefore) this.callbacks.onbefore.cb(jsdate);
	}
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     W E E K     D A Y S
//
function C_iWDAYs(eid, callbacks, preset) { // AM PM preferences

	this.eids = { days:eid+'_dys', own:{} };
	this.callbacks = callbacks || {}; // callbacks like { onwdays:onwdays };
	this.elements = new A_el();
	this.state = C_iWDAYs.defaults.align(preset); // preset like { encodedAMPM: }
	
			let a = this.state.abreviation;
		let owd = { labels:{ 1:C_XL.weekday(1,a), 2:C_XL.weekday(2,a), 4:C_XL.weekday(3,a), 8:C_XL.weekday(4,a), 16:C_XL.weekday(5,a), 32:C_XL.weekday(6,a), 64:C_XL.weekday(7,a) } };
	let wd = new C_iCRESTA(this.eids.days, { onchange:new A_cb(this, this.onselect) }, owd, { mode:1, skin:1, title:false /*C_XL.w('weekdays')*/, cssclass:'' } );
	
	this.controls = new A_ct({ wd:wd });
	this.set(this.state.encoded||C_iWDAYs.resetValue, {nocallback:true});
	if(preset.disabled) this.lock(preset.disabled, true); // preset.disabled must be bit encoded
}
C_iWDAYs.resetValue = parseInt('7F', 16); // 16 is the binary base
C_iWDAYs.defaults = new A_df({ encoded:C_iWDAYs.resetValue, progchange:false, abreviation:'full' }); // 16 is the binary base
C_iWDAYs.prototype = {

	// public
	display: function(css) {
		return this.controls.wd.display(''); 
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iWDAYs','activate','');
		this.elements.collect(this.eids.own);
		this.controls.activate('C_iWDAYs');
	},
	reset: function() {
		this.state.encoded = C_iWDAYs.resetValue;
		this.controls.wd.reset([1,2,4,8,16,32,64]);
	},
	getpost: function() { 
		if(vbs) vlog('controls.js','C_iWDAYs','getpost','encoded:'+this.state.encoded);
		return this.state.encoded; 
	},
	value: function() { 
		let vs = this.controls.wd.getvalue();
		let ds = []; for(let x in vs) {
			let v = vs[x];
			for(let s = parseInt('10000000', 2), p=7; s>>=1; p--) if(v&s) ds.push(p%7); // jsDate 0 is sunday, 1 is monday to 6 saturday
		}
		if(vbs) vlog('controls.js','C_iWDAYs','value','encoded:'+this.state.encoded);
		return ds; 
	},
	
	// private
	set: function(setting, options) {
			options = options||{};
		this.progchange = true;
		
		this.state.encoded = setting;
			let nv = []; 
		for(let s = parseInt('10000000', 2); s>>=1; ) if(setting&s) nv.push(s); // jsDate 0 is sunday, 1 is monday to 6 saturday
		this.controls.wd.reset(nv);
		
		this.progchange = false;
		if(vbs) vlog('controls.js','C_iWDAYs','set','setting:'+this.bits(this.state.encoded));
		if(this.callbacks.onwdays) if(options.nocallback!==true) this.callbacks.onwdays.cb(this.state.encoded); 
	},
	lock: function(encoded, onoff) {	
		for(let s = parseInt('10000000', 2); s>>=1; ) // jsDate 0 is sunday, 1 is monday to 6 saturday
			if(encoded&s) this.controls.wd.lock(s, onoff);
	},
	bits: function(value) { // display in bit map format
		// return '';
		let bits = value&parseInt('7F',16), bytie = '';
		for(let scan=parseInt('80',16); scan; scan>>=1) bytie += (scan&bits ? '1' : '0');
		return '|'+bytie+'|';
	},
	
	// private event handlers
	onselect: function(selections) { 
		if(this.progchange) return; // no flooding while the set() function is working bit by bit
		this.state.encoded = 0;
		for(let x in selections) this.state.encoded += (selections[x]|0); // set corresponding bits
		if(vbs) vlog('controls.js','C_iWDAYs','onselect','selections:'+selections+', encoded:'+this.bits(this.state.encoded)); 
		if(this.callbacks.onwdays) this.callbacks.onwdays.cb(this.state.encoded);
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     A M  / P M   over a week
//
function C_iAMPM(eid, callbacks, preset) { // AM PM preferences

	this.eids = { tbl:eid, am:eid+'_am', pm:eid+'_pm', days:eid+'_days' };
	this.callbacks = callbacks || {}; // callbacks like { onampm:onampm };
	this.elements = new A_el();
	this.state = C_iAMPM.defaults.align(preset); // preset like { encodedAMPM: }
	
		let a = this.state.abreviation;
	let options = { 
		am:{labels:{ 1:'', 2:'', 4:'', 8:'', 16:'', 32:'', 64:'' }}, 
		wd:{labels:{ 1:C_XL.weekday(1,a), 2:C_XL.weekday(2,a), 4:C_XL.weekday(3,a), 8:C_XL.weekday(4,a), 16:C_XL.weekday(5,a), 32:C_XL.weekday(6,a), 64:C_XL.weekday(7,a) }}, 
		pm:{labels:{ 1:'', 2:'', 4:'', 8:'', 16:'', 32:'', 64:'' }} 
	};
		let am = false,wd = false;
		let m = this.state.mode;
		let pm = this.state.showpm;
	
	if(pm) {
		am = new C_iCRESTA(this.eids.am, {onchange:new A_cb(this, this.selectAM)}, options.am, { mode:m, title:'AM' } );
		wd = new C_iMENU(this.eids.days, {onlabel:new A_cb(this, this.selectWD), ontitle:new A_cb(this, this.onmaintitle)}, options.wd, { mode:m, skin:'none', title:C_XL.w('weekdays') } );
		pm = new C_iCRESTA(this.eids.pm, {onchange:new A_cb(this, this.selectPM)}, options.pm, { mode:m, title:'PM' } );
	} else {
		wd = new C_iCRESTA(this.eids.days, { onchange:new A_cb(this, this.WDchanged) }, options.wd, { mode:m, skin:'none', title:C_XL.w('weekdays') } );
	}
	
	
	this.controls = new A_ct({ am:am, wd:wd, pm:pm });
	// this.state.encoded&=C_iAMPM.resetValue; // flushes all left and right bits that were sooner used for "exceptional preferences")
	//
	// parseInt('00FF0000', 16); // bit map for am values
	// parseInt('0000FF00', 16); // bit map for pm values
	// parseInt('000000FF', 16); // bit map for wd values
	
	this.set(this.state.encoded||C_iAMPM.resetValue);
}
C_iAMPM.resetValue = parseInt('00FFFF00', 16); // 16 is the binary base
C_iAMPM.defaults = new A_df({ encoded:C_iAMPM.resetValue, progchange:false, abreviation:'full', showpm:true, mode:0 }); // 16 is the binary base
C_iAMPM.prototype = {

	// public
	display: function(css) {
			let am = '',wd = '',pm = '';
		if(this.state.showpm) {
			am = this.controls.am.display('centered'); 
			wd = this.controls.wd.display('centered'); 
			pm = this.controls.pm.display('centered'); 
			return '<table id="'+this.eids.tbl+'" style="margin-right:2em; layout:fixed"><tr><td>'+am+'</td><td style="vertical-align:top;">'+wd+'</td><td>'+pm+'</td></tr></table>';
		} else {
			wd = this.controls.wd.display(); 
			return wd;
		}
		
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iAMPM','activate','');
		this.elements.collect(this.eids);
		this.controls.activate('C_iAMPM');
	},
	and: function(encoded) {
		if(vbs) vlog('controls.js','C_iAMPM','and','encoded:'+encoded+' or '+this.bits(encoded)+', state:'+this.bits(this.state.encoded));
		let newsetting = encoded&this.state.encoded;
		if(newsetting==0) newsetting = C_iAMPM.resetValue;
		this.set(newsetting); // keep days that are common to both settings (<= for multiple visitors selection)
	},
	reset: function(options) { // sets all days on, am and pm
		
		options = options || { callback:true };
		
		this.state.encoded = C_iAMPM.resetValue;
		if(this.state.showpm) {
			this.controls.am.reset([1,2,4,8,16,32,64],{ callback:options.callback });
			this.controls.pm.reset([1,2,4,8,16,32,64],{ callback:options.callback });
		} 
	},
	getpost: function() { 
		if(vbs) vlog('controls.js','C_iAMPM','getpost','encoded:'+this.state.encoded);
		return this.state.encoded; 
	},
	
	// private
	set: function(setting) {
		this.progchange = true;
		if(this.state.showpm) {
			this.state.encoded = setting;
			let AMmask = parseInt('00010000',16); // 16 is the hex base
			let PMmask = parseInt('00000100',16);
			this.controls.am.reset();
			this.controls.pm.reset();
			for (let v=1, encoded = setting|0; v<=64; v<<=1, encoded>>= 1) {
				if(AMmask&encoded) this.controls.am.docheck(v);
				if(PMmask&encoded) this.controls.pm.docheck(v);
			}
		} else {
			let WKmask = parseInt('00000001',16);
			for (let v=1, encoded = setting|0; v<=64; v<<=1, encoded>>= 1) {
				if(WKmask&encoded) this.controls.wd.docheck(v);
					else this.controls.wd.docheck(v,false);
			}
		}
		this.progchange = false;
		if(this.callbacks.onampm) this.callbacks.onampm.cb();
	},
	bits: function(value) { // display in bit map format
		// return '';
		let bits = { pm:(value&parseInt('0000FF00',16))>>8, am:(value&parseInt('00FF0000',16))>>16 };
		let byteAM = '', bytePM = '';
		for(let scan=parseInt('80',16); scan; scan>>=1) byteAM += (scan&bits.am ? '1' : '0');
		for(let scan=parseInt('80',16); scan; scan>>=1) bytePM += (scan&bits.pm ? '1' : '0');
		return byteAM+'|'+bytePM;
	},
	
	WDchanged: function(selections) {
		this.state.encoded = 0;
		for(let x in selections) this.state.encoded += (selections[x]|0); // set bits in WD byte
		if(this.callbacks.onampm) this.callbacks.onampm.cb(this.state.encoded, selections);
	},
	
	// private event handlers (apply only in am/pm mode)
	onmaintitle: function() { 
		this.reset();
		if(vbs) vlog('controls.js','C_iAMPM','onmaintitle','encoded:'+this.bits(this.state.encoded)); 
	},
	selectAM: function(selections) { 
		if(this.progchange) return;
		this.state.encoded &= parseInt('0000FF00',16); // keeps PM part intact
		for(let x in selections) this.state.encoded += (selections[x]|0)<<16; // set bits in AM byte
		if(this.callbacks.onampm) this.callbacks.onampm.cb();
		if(vbs) vlog('controls.js','C_iAMPM','selectAM','selections:'+selections+', encoded:'+this.bits(this.state.encoded)); 
	},
	selectWD: function(value) { // single selection of a given day
		this.progchange = true; // put object in programmatic change mode (no feedback to parent)
			this.controls.am.reset(); 
			this.controls.pm.reset();
			this.controls.am.docheck(value);
			this.controls.pm.docheck(value);
			this.state.encoded = 0;
			this.state.encoded |= (value|0)<<8;
			this.state.encoded |= (value|0)<<16;
		this.progchange = false;
		if(this.callbacks.onampm) this.callbacks.onampm.cb();
		
		if(vbs) vlog('controls.js','C_iAMPM','selectWD','value:'+value+', encoded:'+this.bits(this.state.encoded)); 
	},
	selectPM: function(selections, target, value) { 
		if(this.progchange) return;
		this.state.encoded &= parseInt('00FF0000',16); // keeps AM part intact
		for(let x in selections) this.state.encoded += (selections[x]|0)<<8; // set bits in PM byte
		if(this.callbacks.onampm) this.callbacks.onampm.cb();
		if(vbs) vlog('controls.js','C_iAMPM','selectPM','selections:'+selections+', hit:'+value+', encoded:'+this.bits(this.state.encoded)); 
	}
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//
//              M  I  S  C      C  O  N  T  R  O  L  S 
//
//


//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F   C U S T O M    D A T E    O R    T O D A Y     D A T E 
//
C_iDATEPRESET = function(eid, callbacks, preset) { // pick out from a list of future dates

	this.eids = { radio:eid+'_pk', dp:eid+'_dp' };
	this.callbacks = callbacks || {}; // like { onchange: };
	this.state = C_iDATEPRESET.defauts.align(preset);
	this.elements = new A_el();
	// preset = new Array(); preset[0] = { set:true }; // specifies which radio to set at init time
	
		let yesterday = new Date(); yesterday.increment( {d:-1} );
	let dp = new C_iDP(this.eids.dp, {dayclick:new A_cb(this, this.dpSelect)}, { display:{abreviation:'abr', weekday:true, tag:'span'}, mindate:yesterday, jsdate:this.state.jsdate } );
	
		let options = { labels:{ 0:C_XL.w('current date'), 99:dp.display('-') }, order:[0, 99], count:2 }; // translates the block of options in one shot
	let radio = new C_iCRESTA(this.eids.radio, { onchange:new A_cb(this, this.radioSelect) }, options, { title:C_XL.w('upper left date'), skin:0, mode:-1, value:(this.state.jsdate?99:0) } );
	this.controls = new A_ct({dp:dp, radio:radio});
	
}
C_iDATEPRESET.defauts = new A_df( { jsdate:false } );
C_iDATEPRESET.prototype = {
	// public
	display: function(css) {
		let radio = this.controls.radio.display('select-header '+(css || '')); 
		return '<table style="text-align:left; layout:fixed"><tr><td>'+radio+'</td></tr></table>';
	},
	activate: function() {
		if(vbs) vlog('controls.js','C_iDATEPRESET','activate','title:'+this.controls.radio.state.title);
	
		this.elements.collect(this.eids);
		this.controls.activate('C_iDATEPRESET');
	},
	reset: function() {
		this.controls.radio.set('0');
		return this;
	},
	getpost: function() { 
		if(this.state.jsdate == 0) return 0;
		let utstmp = this.state.jsdate.getUnixTime();
		return utstmp;
	},
	
	// controls callbacks
	radioSelect: function(option) {
		if(vbs) vlog('controls.js','C_iDATEPRESET','radioSelect','option:'+option); 
		switch(option) {
			case 99: this.state.jsdate = this.controls.dp.state.jsdate; break; // click on radio button without changing the date
			case 0: this.state.jsdate = 0; break;
		}
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.state.jsdate);
	},
	dpSelect: function(jsdate) {
		if(vbs) vlog('controls.js','C_iDATEPRESET','dpSelect','jsdate:'+jsdate.sortable());
		this.state.jsdate = jsdate;
		if(this.callbacks.onchange) this.callbacks.onchange.cb(jsdate);
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T     L O G I N S    A N D    T H E I R    A C T I O N S
//
function C_iACTIONS(eid, callbacks, preset) { // pick out from a list of future dates

	this.eids = { filter:eid+'_fil' };
	this.callbacks = callbacks || {}; // like { onchange:A_cb }
	this.state = C_iACTIONS.defauts.align(preset);

		let filters = C_XL.w({ 1:'creation', 2:'modification', 4:'deletion' });
		let forder = [1,2,4];
		let presets = { 1:{checked:this.state.actions&1}, 2:{checked:this.state.actions&2}, 4:{checked:this.state.actions&4} };
		let options = { order:forder, labels:filters, presets:presets, count:forder.length };
	let filter = new C_iCRESTA(this.eids.filter, { onchange:new A_cb(this, this.filter) }, options, { skin:1, mode:1, title:this.state.title, postmode:'bitmap' } );

	this.controls = new A_ct({filter:filter});	
}
C_iACTIONS.defauts = new A_df( { actions:0, title:false } );
C_iACTIONS.prototype = {
	// public
	display: function() {
		return this.controls.filter.display();
	},
	activate: function() {
		this.controls.activate('C_iACTIONS');
	},
	getpost: function() { 
		return this.controls.filter.getpost();
	},
	
	// controls callbacks
	filter: function(values) {
		if(vbs) vlog('controls.js','C_iACTIONS','onswitches','value:'+values.join('&'));
		if(this.callbacks.onchange) this.callbacks.onchange.cb(this.controls.filter.getvalue());
	}
}






//////////////////////////////////////////////////////////////////////////////////////////////
//   B A R     G R A P H     D R A W I N G 
//
C_iBAR = function(eid, points, scale, options) { // points like { 0:{measure:13, css:'css1'}, 1:{measure:5, css:'css2'} }
	this.options = C_iBAR.defaults.align(options||{});
	this.eids = { div:eid+'_div' };
	this.scale = scale;
	this.segments = new Array();
	for(let x in points) { this.segments.push(new C_iBAR.segment(points[x].measure, (points[x].label||''), points[x].css, this.scale, this.options)); }
	this.element = new A_el();
}
C_iBAR.defaults = new A_df({ 
			  barSkinCss:'mobbar', barHeight:'1.2em', valueDisplay:'inbar', labelDisplay:'inbar' /* [inbar, offbar] */
			, barTextVertical:'middle'
			, legend:false, legendDisplay:'front' /* [front, inbar, fixfront] */
			, total:false });

C_iBAR.tblstyle = 'style="width: 100%; border-collapse:collapse"';
C_iBAR.prototype = {
	display : function(css) {
		let tdLegend = '', tdLegendPad = '';
		let tdTotal = '', tdTotalPad = '';
		if(this.options.legend) { 
			switch(this.options.legendDisplay) {
				case 'front': tdLegend = '<td style="width:1%;">'+this.options.legend+'&nbsp;</td>'; tdLegendPad = '<td style="width:1%;"></td>'; break;
				case 'inbar': tdLegend = '<td style="width:0px;"><div style="width:0px; max-width:0px; white-space:nowrap;">&nbsp;'+this.options.legend+'</div></td>'; tdLegendPad = '<td style="width:0px;"></td>'; break;
				case 'fixfront': 
					let inner = '<div style="position:absolute; right:0; bottom:0; text-align:right; white-space:nowrap;">'+this.options.legend+'&nbsp;</div>';
					let outer = '<div style="width:100%; position:relative">&nbsp;'+inner+'</div>'; // &nbsp; forces div to have an height, to witch the absolute positionning refers
					tdLegend = '<td style="width:10em; position:relative;">'+outer+'</td>';
					tdLegendPad = '<td style="width:10em;"></td>'; 
					break;
			}
		}
		if(this.options.total !== false) { tdTotal = '<td style="width:1%; font-size:110%; font-weight:bold;">&nbsp;'+this.options.total+'</td>'; tdTotalPad = '<td style="width:1%;"></td>'; }
		
		let tdVals = '', tdBars = '', tdLabels = '';
		let tableLabels = '', tableValues = '';
		for(let x in this.segments) {
			if(this.options.labelDisplay!='inbar') tdLabels += this.segments[x].tdLabel();
			if(this.options.valueDisplay!='inbar') tdVals += this.segments[x].tdVal();
			tdBars += this.segments[x].tdBar();
		}
		if(this.options.labelDisplay!='inbar') {
			let graph = '<table class="iBAR-labels '+(css||'')+'" '+C_iBAR.tblstyle+'><tr>'+tdLabels+'<td style="width:auto;"></td></tr></table>';
			tableLabels = '<tr>'+tdLegendPad+'<td>'+graph+'</td>'+tdTotalPad+'</tr>';
		}
			
		if(this.options.valueDisplay!='inbar') {
			let graph = '<table class="iBAR-values '+(css||'')+'" '+C_iBAR.tblstyle+'><tr>'+tdVals+'<td style="width:auto;"></td></tr></table>';
			tableValues = '<tr>'+tdLegendPad+'<td>'+graph+'</td>'+tdTotalPad+'</tr>';
		}
			let graph = '<table class="iBAR-bars '+(css||'')+'"   '+C_iBAR.tblstyle+'><tr>'+tdBars+'<td style="width:auto;"></td></tr></table>';
		let tableBars 	= '<tr>'+tdLegend+'<td>'+graph+'</td>'+tdTotal+'</tr>';
		
		
		return '<table class="iBAR-table '+(css||'')+'" style="width:100%;">'+tableLabels+tableValues+tableBars+'</table>';
	}
}

C_iBAR.segment = function(value, label, css, scale, options) {
	this.value = value;
	this.label = label || '';
	this.options = options;
	this.css = css;
	this.width = (value/scale*100)|0;
	if(this.width) this.width += '%'; else this.width = '1px';
}
C_iBAR.segment.tdstyle = 'padding:0 0.3em; text-align:right; line-height:90%;';
C_iBAR.segment.prototype = {
	tdBar : function() { 
		let style = 'style="'+C_iBAR.segment.tdstyle+' vertical-align:'+this.options.barTextVertical+'; width:'+this.width+'; height:'+this.options.barHeight+';"';
		let cclass = 'class="'+this.options.barSkinCss+' '+this.css+'"';
		let value = '', label = '';
		if(this.options.valueDisplay=='inbar') value = '<span style="font-weight:bold;">'+this.value+'</span>';
		if(this.options.labelDisplay=='inbar') label = '<span style="font-size:90%; letter-spacing:-1px;">'+this.label+'</span>';
		return '<td '+style+' '+cclass+'>'+label+' '+value+'</td>';
	},
	tdVal : function() { 
		return '<td style="width:'+this.width+';'+C_iBAR.segment.tdstyle+'">'+this.value+'.</td>'; 
	},
	tdLabel : function() { 
		return '<td style="width:'+this.width+';'+C_iBAR.segment.tdstyle+'">'+this.label+'</td>'; 
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   U R L    W I T H     I T S     A S S O C I A T E D     L A B E L
//
C_iURL = function(eid, callbacks, preset) {
		
		preset  = preset || {}; // like { placeholder:, label:, url: }
	this.eids = { url:eid+'_url', lbl:eid+'_lbl' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onselect }
	this.state = C_iURL.defaults.align(preset);
	
	let lbl 	= new C_iFIELD(this.eids.lbl, { onfchange:new A_cb(this, this.linklabel, null, null, 500) }, { digits:preset.label||'', type:INPUT_TEXT, mandatory:this.state.mandatory, placeholder:C_XL.w(this.state.placeholder) });
	let url 	= new C_iFIELD(this.eids.url, false, { digits:preset.url||'', type:INPUT_URL, mandatory:false, placeholder:C_XL.w('link url') });

	this.controls = new A_ct({lbl:lbl, url:url});
}
C_iURL.defaults = new A_df({ placeholder:'link label', mandatory:false, label:'' });
C_iURL.prototype = {
	display: function(css) {
		let tdtd = '<td>'+this.controls.lbl.display('alpha14')+'</td><td>'+this.controls.url.display('alpha28')+'</td>';
		return tdtd; 
	},
	labelled: function(english) {
			let linktr = '<tr>'+this.display()+'</tr>';
			let label = '<tr><td colspan=2 class="textcolor-light">'+C_XL.w(english)+'</td></tr>';
		let html = '<table summary="directions link">'+label+linktr+'</table>';
		return html; 
	},
	activate:function() { 
		this.controls.activate();
		this.linklabel(0, this.state.label);
	},
	getpost: function() { 
		let lbl = this.controls.lbl.getpost();
		let url = this.controls.url.getpost();
		let post = { url:url, label:lbl };		
		return post;
	},	
	// private
	
	// event handling
	linklabel: function(l, d) { 	
		this.controls.url.mandatory(!!d);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     F O N T S
//
//   This control is intimately linked to the file fonts.css
//
fonts = { title:1, text:15 }

C_iFONT = function(eid, callbacks, preset) {
		preset  = preset || {}; // like { value:, allownone:, fonttype }
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { onselect }
	this.state = C_iFONT.defaults.align(preset);
	
	let options = C_iFONT.options(preset);
		let value = preset.value==''?0: preset.value; // js objects do not accept negative values as member name
	let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:new A_cb(this, this.selected) }, options, { maxcols:1, maxrows:0, value:value } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iFONT.defaults = new A_df({ fonttype:fonts.title });
C_iFONT.prototype = {
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let value = this.controls.ddwn.getpost();
		if(value==0) return ''; else return value;
	},
	selected: function(which) { 
		if(this.callbacks.onselect) this.callbacks.onselect.cb(which, this.state.fonttype );
	}
}
C_iFONT.options = function(options) {
	options=options||{fonttype:fonts.title};
	let lists = Array();
	lists[fonts.title] = {  //  item name will be set as class f-itemname on document : 'value is as displayed in the dropdown box' on the page setup options
		harlow:'harlow',
		hightower:'hightower',
		imprint:'imprint',
		grouser:'grouser',
		fedservice:'fedservice',
		staravenue:'staravenue',
		orbitron:'orbitron',
		sportsnight:'sportsnight',
		highland:'highland',
		rocko:'rocko',
		normal:'normal',
		kingthings:'kingthings',
		airstrike:'airstrike',
		vinylcuts:'vinylcuts',
		hollowpoint:'hollowpoint',
		covertops:'covertops',
		glyceride:'glyceride',
		organo:'organo',
		instruction:'instruction',
		timesfive:'timesfive',
		alpine:'alpine',
		polo:'polo',
		junegull:'junegull',
		masque:'masque',
		nougat:'nougat',
		chopin:'chopin',
		vibes:'vibes',
		montserratbold:'montserrat'
	};
	lists[fonts.text] = { 
		calibri:'calibri',
		candara:'candara',
		comic:'comic',
		corbel:'corbel',
		corsiva:'corsiva',
		eras:'eras',
		gil:'gil',
		gothic:'gothic',
		goudy:'goudy',
		maiandra:'maiandra',
		papyrus:'papyrus',
		perpetua:'perpetua',
		rockwell:'rockwell',
		segoe:'segoe',
		times:'times',
		tunga:'tunga',
		montserrat:'montserrat'
	};
	let labels = lists[options.fonttype];
	let order = new Array(); for(let x in labels) order.push(x);
	let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	if(options.allownone) { order.unshift(0); labels[0]='standard'; } // keep this after the sorting
	let count = order.length;
	return { order:order, labels:labels, presets:{}, count:count };
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H O O S I N G    F R O M    P A Y M E N T    M E A N S
//
C_iPAY = function(eid, dS_group, callbacks, preset) {
		
		this.dS = dS_group; 
		let b = eid+'_';
	this.eids = { cash:b+'cash', sepa:b+'sepa', payco:b+'payco', cards:b+'cards' };
	this.callbacks = callbacks || {}; // like { onpaymean:new A_cb() }
	
	// choosing from payment means
		let tip = C_XL.w('ep-tip start payment');
			let dstyles = 'text-align:center; flex-grow:1; padding:1em;';
			let spanstyles = 'opacity:.6;';
			let istyles = 'padding:.3em .2em; min-width:1.5em; text-align:center; flex-grow:1;';
			let iclasses = 'mobtext fa fa-gray fa-2x';
		let cash 	= '<i style="'+istyles+'" class="'+iclasses+' fa-coins"></i><br/><span style="'+spanstyles+'">Cash</span>';
	cash = new C_iCLIK(this.eids.cash, 	{ click:new A_cb(this, this.onpaymean, C_dS_payment.type.cash ) }, { ui:cash, enabled:true, tip:tip, tag:'div', style:dstyles } );
	
		let sepa 	= '<i style="'+istyles+'" class="'+iclasses+' fa-qrcode"></i><br/><span style="'+spanstyles+'">Sepa</span>';
	sepa = new C_iCLIK(this.eids.sepa, 	{ click:new A_cb(this, this.onpaymean, C_dS_payment.type.mobqrcode ) }, { ui:sepa, enabled:true, tip:tip, tag:'div', style:dstyles } );
	
		let payco 	= '<i style="'+istyles+'" class="'+iclasses+' fa-infinity"></i><br/><span style="'+spanstyles+'">Payconiq</span>';
	payco = new C_iCLIK(this.eids.payco, 	{ click:new A_cb(this, this.onpaymean, C_dS_payment.type.payconiq ) }, { ui:payco, enabled:true, tip:tip, tag:'div', style:dstyles } );
	
		let cards 	= '<i style="'+istyles+'" class="'+iclasses+' fa-credit-card"></i><br/><span style="'+spanstyles+'">Cartes</span>';
	cards = new C_iCLIK(this.eids.cards, 	{ click:new A_cb(this, this.onpaymean, C_dS_payment.type.cards ) }, { ui:cards, enabled:true, tip:tip, tag:'div', style:dstyles } );
	
	// let transactions = new C_iPLUS(this.eids.trans, { select:new A_cb(this, this.resetbalance) }, { plusclass:new C_dS_payment.plus(this.dS), plusallow:true, reorder:false });
	
	this.controls = new A_ct( { cash:cash, sepa:sepa, payco:payco, cards:cards } );
}
C_iPAY.defaults = new A_df({});
C_iPAY.prototype = {
	display: function(css) { 
			let cash = ''; if(mobminder.account.has.epayment) cash = this.controls.cash.display();
			let sepa = ''; if(mobminder.account.has.epmobsepa) sepa = this.controls.sepa.display();
			let payco = ''; if(mobminder.account.has.epayconiq) payco = this.controls.payco.display();
			let cards = ''; if(mobminder.account.has.epaymarkt) cards = this.controls.cards.display();
		return cash+sepa+payco+cards; 
	},
	activate:function() { this.controls.activate('C_iPAY');	},
	getpost: function() { return false; },
	
	// events handling
	
	// subcontrols feedback
	onpaymean: function(pmean) { // an item from the plus list has been touched
		if(vbs) vlog('controls.js','C_iPAY', 'onpaymean', 'pmean:'+pmean);
		if(this.callbacks.onpaymean) this.callbacks.onpaymean.cb(pmean);
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//
//   E S T A B L I S H I N G    A N D    M A N A G I N G     T H E    R E S A    B I L L
//
C_iBILL = function(eid, dS_resa, callbacks, preset) {
		preset  = preset || {};
		this.dS = dS_resa; 
		let b = eid+'_';
	this.eids = { 
			subcontrols:{perfstot:b+'ptot', tobepaid:b+'tbpaid', alrdpaid:b+'alrpaid', balance:b+'balance', trans:b+'trns', paymean:b+'pmean'}
			, own: { eplist:b+'eplst', meandiv:b+'pmdiv' }
		};
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iBILL.defaults.align(preset);
	
	// let options = C_iBILL.options();
		// let value = (preset.value|0)<=0 ? 'n'+(-(preset.value|0)) : preset.value; // js objects do not accept negative values as member name
	// let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:false }, options, { maxcols:1, maxrows:0, value:value } );
		
		let totprice = 9999; // in case the upper level doesn't trigger calculations in this class, then you read 99.99€ in all fields
	let perfstotal = new C_iFIELD(this.eids.subcontrols.perfstot, false, { digits:0, type:INPUT_PRICE, units:C_XL.w('euros'), mandatory:false, focus:false, enabled:false });
	let tobepaid = new C_iFIELD(this.eids.subcontrols.tobepaid, { onfchange:new A_cb(this, this.ontobepaid, 0, false, 800 ) }, { digits:this.dS.billamount, type:INPUT_PRICE, units:C_XL.w('euros'), mandatory:false, focus:false, enabled:true });
	let alrdpaid = new C_iFIELD(this.eids.subcontrols.alrdpaid, false, { digits:0, type:INPUT_PRICE, units:C_XL.w('euros'), mandatory:false, focus:false, enabled:false });
	let balance = new C_iFIELD(this.eids.subcontrols.balance, false, { digits:0, type:INPUT_PRICE, units:C_XL.w('euros'), mandatory:false, focus:false, enabled:false });
	
	let paymean = new C_iPAY(this.eids.subcontrols.paymean, mobminder.account /* that is dS_group */, { onpaymean:new A_cb(this, this.onpaymean) }, preset);
	

	this.controls = new A_ct({ perfstotal:perfstotal, tobepaid:tobepaid, alrdpaid:alrdpaid, balance:balance, paymean:paymean, transactions:false });
}
C_iBILL.defaults = new A_df({});
C_iBILL.prototype = {
	display: function(css) { 
	
			let perfstotal = '<tr>'+this.controls.perfstotal.labelled('ep-perfs total', 'alpha06 idle')+'</tr>';
			let tobepaid = '<tr>'+this.controls.tobepaid.labelled('ep-charged', 'alpha06')+'</tr>';
			let alrdpaid = '<tr>'+this.controls.alrdpaid.labelled('ep-already paid', 'alpha06 idle')+'</tr>';
			let balance = '<tr>'+this.controls.balance.labelled('ep-balance', 'alpha06 idle')+'</tr>';
		let ticket = '<td style="vertical-align:top;"><table class="coords" summary="eticket" style="">'+perfstotal+tobepaid+alrdpaid+balance+'</table></td>';
			
			
		let payments = '<td style="vertical-align:top;" id="'+this.eids.own.eplist+'">'+''+'</td>'; // filled later with data received from a query, see (*ib01*)

		let epayment = '<div style="margin-top:2em;"><table class="" summary="epayment" style="margin:0 auto;"><tr>'+ticket+payments+'</tr></table></div>';
		let paymean = '<div id="'+this.eids.own.meandiv+'" style="justify-content:center; padding:1em; display:flex;">'+this.controls.paymean.display()+'</div>';
		
		return epayment+paymean; 
	},
	activate:function() { this.elements.collect(this.eids.own); this.controls.activate();	},
	resettotal: function(totprice) { // total according to workcodes selection, called from here (*mr01*)
		if(vbs) vlog('controls.js','C_iBILL', 'resettotal', 'totprice='+totprice+', dS.billamount='+this.dS.billamount);
		this.controls.perfstotal.set(totprice, { propagate:false }); // workcodes total price
		if(this.dS.billamount==0) {
			this.controls.tobepaid.set(totprice, { propagate:false });
			this.resetbalance();
		}
	},
	resetpayments: function() { // re-calculate payments based on existing records in DB
		
		if(vbs) vlog('controls.js','C_iBILL', 'resetpayments', '');
		this.controls.transactions = new C_iPLUS(this.eids.trans, { select:new A_cb(this, this.onpayitem) }, { plusclass:new C_dS_payment.plus(this.dS), plusallow:true, reorder:false });
		let isreplica = this.dS.id>0;
		let haspayment = !!this.dS.haspayment();
		if(isreplica&&haspayment) {
					let styles = 'margin-left:4em;';
					let classes = '';
				let transactions = this.controls.transactions.prefixed( C_XL.w('ep-payments-list') );
			this.elements.eplist.innerHTML = '<table class="'+classes+'" style="'+styles+'"><tr>'+transactions+'</tr></table>'; //  see (*ib01*)
			this.controls.transactions.activate();
		}
		
			let paid = this.dS.getpaidsum(); // units are cents
		this.controls.alrdpaid.set(paid, { propagate:false }); // payments total
		this.resetbalance();
	},
	resetbalance: function() {
		
			let ispaid = this.dS.getpaidsum();
			let tbpaid = this.controls.tobepaid.value();
			let balance = tbpaid-ispaid;
			
		if(vbs) vlog('controls.js','C_iBILL', 'resetbalance', 'tbpaid='+tbpaid+', balance='+balance);
		
			this.controls.balance.removeClass('redtext');
		if(balance) this.controls.balance.addClass('redtext');
			
			$(this.elements.meandiv).show();
		if(balance<=0 || tbpaid==0) $(this.elements.meandiv).hide();
		
		this.controls.balance.set(balance, { propagate:false }); // payments total
	},
	getpost: function() { 			
			let tobepaid = this.controls.tobepaid.getpost();
		let post = { tobepaid:tobepaid };		
		return post;
	},
	
	// events handling
	ontobepaid: function(d) {
		let v = this.controls.tobepaid.value();
		this.dS.billamount = v; // writes immediately to dataSet
		if(vbs) vlog('controls.js','C_iBILL', 'ontobepaid', 'digits:'+d+', value:'+v);
		this.resetbalance();
	},
	onpayitem: function(dS_payment) { // an item from the plus list has been touched
		if(dS_payment.id<=0) {
			dS_payment.amount = this.controls.balance.value();
			this.controls.tobepaid.pushprice(); // turns decimal-less integer input ( e.g. 30 ) into a proper price expressed in cents ( e.g. 30.00 )
		}
		if(vbs) vlog('controls.js','C_iBILL', 'onpayitem', 'id:'+dS_payment.id+', amount:'+dS_payment.amount);
		new M_PAYMENT({dS_payment:dS_payment, dS_reservation:this.dS}, { saved:new A_cb(this, this.paysaved), deleted:new A_cb(this, this.paydeleted)  }, { tab:0 });
	},
	onpaymean: function(pmean) { // an item from the list of payment means was hit
		if(vbs) vlog('controls.js','C_iBILL', 'onpaymean', 'pmean:'+pmean);
		if(this.callbacks.onpaymean) this.callbacks.onpaymean.cb(pmean);
		this.controls.tobepaid.pushprice(); // turns decimal-less integer input ( e.g. 30 ) into a proper price expressed in cents ( e.g. 30.00 )
		let dS_payment = new C_dS_payment(this.dS.rmem, C_dS_trackingCC.tnew(0, this.dS.id).concat([pmean, this.controls.balance.value() /*amount*/]));
		new M_PAYMENT({dS_payment:dS_payment, dS_reservation:this.dS}, { saved:new A_cb(this, this.paysaved), deleted:new A_cb(this, this.paydeleted)  }, { tab:0 });
	},
	
	// subcontrols feedback
	
	paysaved: function(dS_payment) {
		if(vbs) vlog('controls.js','C_iBILL', 'paysaved', 'id:'+dS_payment.id);
		this.resetpayments();
	},
	paydeleted: function(dS_payment) {
		if(vbs) vlog('controls.js','C_iBILL', 'paydeleted', 'id:'+dS_payment.id);
		this.resetpayments();
	}
}

C_iBILL.options = function() { // TBD
	let labels = { 
	};
	let order = new Array(); for(let x in labels) order.push(x);
	// let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	let count = order.length;
	return { order:order, labels:labels, presets:{}, count:count };
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     G M T     O F F S E T 
//
C_iGMT = function(eid, callbacks, preset) {
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iGMT.defaults.align(preset);
	
	let options = C_iGMT.options();
		let value = (preset.value|0)<=0 ? 'n'+(-(preset.value|0)) : preset.value; // js objects do not accept negative values as member name
	let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:false }, options, { maxcols:1, maxrows:0, value:value } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iGMT.defaults = new A_df({});
C_iGMT.prototype = {
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, css); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let value = this.controls.ddwn.getpost()+'';
		value = value.replace('n','-');
		return value|0; 
	}
}

C_iGMT.options = function() {
	let labels = { 
		n43200:'(GMT -12:00) Eniwetok, Kwajalein',
		n39600:'(GMT -11:00) Midway Island, Samoa',
		n36000:'(GMT -10:00) Hawaii',
		n32400:'(GMT -9:00) Alaska',
		n28800:'(GMT -8:00) Pacific Time (US &amp; Canada)',
		n25200:'(GMT -7:00) Mountain Time (US &amp; Canada)',
		n21600:'(GMT -6:00) Central Time (US &amp; Canada), Mexico City',
		n18000:'(GMT -5:00) Eastern Time (US &amp; Canada), Bogota, Lima',
		n14400:'(GMT -4:00) Atlantic Time (Canada), Caracas, La Paz',
		n12600:'(GMT -3:30) Newfoundland',
		n10800:'(GMT -3:00) Brazil, Buenos Aires, Georgetown',
		n7200:'(GMT -2:00) Mid-Atlantic',
		n3600:'(GMT -1:00 hour) Azores, Cape Verde Islands',
		n0:'(GMT +0:00) Western Europe Time, London, Lisbon, Casablanca',
		3600:'(GMT +1:00 hour) Brussels, Copenhagen, Madrid, Paris',
		7200:'(GMT +2:00) Kaliningrad, South Africa',
		10800:'(GMT +3:00) Baghdad, Riyadh, Moscow, St. Petersburg',
		12600:'(GMT +3:30) Tehran',
		14400:'(GMT +4:00) Abu Dhabi, Muscat, Baku, Tbilisi',
		16200:'(GMT +4:30) Kabul',
		18000:'(GMT +5:00) Ekaterinburg, Islamabad, Karachi, Tashkent',
		19800:'(GMT +5:30) Bombay, Calcutta, Madras, New Delhi',
		20700:'(GMT +5:45) Kathmandu',
		21600:'(GMT +6:00) Almaty, Dhaka, Colombo',
		25200:'(GMT +7:00) Bangkok, Hanoi, Jakarta',
		28800:'(GMT +8:00) Beijing, Perth, Singapore, Hong Kong',
		32400:'(GMT +9:00) Tokyo, Seoul, Osaka, Sapporo, Yakutsk',
		34200:'(GMT +9:30) Adelaide, Darwin',
		36000:'(GMT +10:00) Eastern Australia, Guam, Vladivostok',
		39600:'(GMT +11:00) Magadan, Solomon Islands, New Caledonia',
		43200:'(GMT +12:00) Auckland, Wellington, Fiji, Kamchatka'
	};
	let order = new Array(); for(let x in labels) order.push(x);
	// let sortrule = function(a,b) { return (labels[a]>labels[b])?1:-1; }; order.sort(sortrule);
	let count = order.length;
	return { order:order, labels:labels, presets:{}, count:count };
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     P R O F E S S I O N 
//
C_iPRO = function(eid, callbacks, preset) {
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iPRO.defaults.align(preset);
	
	let options = C_iPRO.options();
		let mandatory = preset.mandatory ? new A_cb(this, this.isvalid) : false;
	let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:false }, options, { maxcols:1, maxrows:0, value:preset.value, mandatory:mandatory } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iPRO.defaults = new A_df({mandatory:false});
C_iPRO.prototype = {
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, (css||'')+' alpha16'); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let value = this.controls.ddwn.getpost();
		return value|0; 
	},	
	valid: function() {
		if(!this.state.mandatory) return true;
		let valid = this.controls.ddwn.value()!==0;
		return valid;
	},
	
	// callback
	isvalid: function(v) { return v!=0; }
}
C_iPRO.options = function() {
	let sections = C_XL.w({ 100:'dentistry', 200:'doctors', 300:'alt medicines', 400:'psychology', 500:'wellness and aesthetic', 800:'agences & services' });
	let labels = { 
		100: C_XL.w({ 
				101:'dental surgeon',
				102:'dentist',
				103:'orthodontist',
				104:'dental prosthetist' }),
		200: C_XL.w({ 			
				201:'generalist',
				202:'surgeon',
				203:'cardiologist',
				204:'cosmetic surgeon',
				205:'dermatologist',
				206:'gastroenterologist',
				207:'gynecologist',
				208:'physiotherapist',
				209:'speech therapist',
				210:'oculist',
				211:'ophthalmologist',
				212:'orthopedic',
				213:'ear nose and throat',
				214:'pediatrician',
				215:'podiatrist',
				216:'lung specialist',
				217:'phlebologist',
				218:'rheumatologist',
				219:'urologist',
				220:'senologist',
				221:'radiologist',
				222:'audiologist',
				223:'sports doctor',
				224:'neurologist',
				225:'anesthetist',
				226:'sexologist',
				227:'endocrinologist',
				228:'nephrologist',
				229:'oncologist',
				
				296:'veterinary',
				297:'bandagist',
				298:'nurse',
				299:'specialist'
				}),
		300: C_XL.w({ 			
				301:'acupuncturist',
				302:'chiropractor',
				303:'dietitian',
				304:'homeopath',
				305:'kinesiologist',
				306:'osteopath',
				307:'sophrologist',
				308:'art-therapist' }),
		400: C_XL.w({ 			
				401:'psychiatrist',
				402:'psychomotor',
				403:'psychologist',
				404:'psychotherapist',
				405:'psychoanalyst' }),
		500: C_XL.w({ 			
				501:'beautician',
				502:'hairdresser',
				503:'masseur',
				504:'pedicure',
				505:'tattooist'

				}),
		800: C_XL.w({ 			
				801:'assistant',
				802:'nurse',
				803:'secretary',
				804:'realtor',
				805:'agent',
				806:'technician',
				807:'broker',
				808:'manager',
				809:'consultant',
				810:'expert',
				811:'lawyer',
				812:'judge',
				813:'notary',
				814:'salesperson',
				815:'teacher',
				
				899:'other pro' })
		}
	
	let order = { 100:new Array(),200:new Array(),300:new Array(),400:new Array(),500:new Array(),800:new Array() }; 			
	for(let s in labels) { // s is the section id
		for(let x in labels[s]) order[s].push(x);
		
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
		order[s].sort(sortrule);
	}
	
	let labelsmerge = {};
	for(let s in sections) {
		labelsmerge[s] = sections[s];
		for(let i in labels[s]) labelsmerge[i] = labels[s][i];
	}
	
	let ordermerge = new Array();
	for(let s in order) {
		ordermerge.push(s);
		for(let i in order[s]) ordermerge.push(order[s][i]);
	}
	
	let count = ordermerge.length;
		let bullet = C_XL.w('b2');
	let lockies = { 100:{section:bullet}, 200:{section:bullet}, 300:{section:bullet}, 400:{section:bullet}, 500:{section:bullet}, 800:{section:bullet} };
	return { order:ordermerge, labels:labelsmerge, presets:lockies, count:count };
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   C H O O S I N G    O U T    O F     P R O F E S S I O N A L     S E C T O R 
//
C_iSEC = function(eid, callbacks, preset) { // mobminder.account.profsector
		preset  = preset || {};
	this.eids = { ddwn:eid+'_ddwn' };	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like {  }
	this.state = C_iSEC.defaults.align(preset);
	
		let options = C_iSEC.options();
		let mandatory = preset.mandatory ? new A_cb(this, this.isvalid) : false;
	let ddwn = new C_iDDWN(this.eids.ddwn, { onselect:false }, options, { maxcols:1, maxrows:0, value:preset.value, mandatory:mandatory } );
	this.controls = new A_ct({ddwn:ddwn});
}
C_iSEC.defaults = new A_df({mandatory:false});
C_iSEC.prototype = {
	display: function(css) { return this.controls.ddwn.display(css); },
	labelled: function(english, css) { return this.controls.ddwn.labelled(english, (css||'')+' alpha16'); },
	activate:function() { this.controls.activate();	},
	getpost: function() { 
		let value = this.controls.ddwn.getpost();
		return value|0; 
	},	
	valid: function() {
		let valid = this.controls.ddwn.value()!==0;
		return valid;
	},
	
	// callback
	isvalid: function(v) { return v!=0; }
}
C_iSEC.options = function() {
	
	let sections = C_XL.w({ 10:'medical sector', 20:'wellness and aesthetic', 30:'agences & services', 40:'financial', 50:'building' });

	let labels = { 
	
		10: C_XL.w({ // Medical
			11:'general medecine',
			12:'specialized medecine',
			13:'dental clinic',
			14:'private practice',
			15:'laboratory',
			17:'medical secretariat',
			18:'multidis clinic',
			19:'hospital' }),
		
		20: C_XL.w({ // Wellness
			21:'alternative medicine',
			22:'psychology',
			23:'aesthetic & wellness',
			24:'fitness',
			24:'clairvoyance' }),
		
		30: C_XL.w({ // Agencies & services
			31:'legal sector',
			32:'real estate',
			33:'outplacement',	
			34:'recruitment',	
			35:'gaming',	
			36:'consultancy',
			37:'commercial division',	
			38:'automotive maintenance',	
			38:'public service' }),
		
		40: C_XL.w({ // Financial	
			41:'insurance',	
			42:'bank',	
			44:'fiscal',	
			45:'accounting' 	}),
		
		50: C_XL.w({ // Building	
			51:'structural',	
			52:'completion',	
			53:'heating',	
			54:'electricity'	})
			
		};
	
	
	let order = { 10:new Array(),20:new Array(),30:new Array(),40:new Array(),50:new Array() }; 			
	for(let s in labels) { // s is the section id
		for(let x in labels[s]) order[s].push(x);
		
			let sortrule = function(a,b) { return (labels[s][a]>labels[s][b])?1:-1; }; 
		order[s].sort(sortrule);
	}
	
	let labelsmerge = {};
	for(let s in sections) {
		labelsmerge[s] = sections[s];
		for(let i in labels[s]) labelsmerge[i] = labels[s][i];
	}
	
	let ordermerge = new Array();
	for(let s in order) {
		ordermerge.push(s);
		for(let i in order[s]) ordermerge.push(order[s][i]);
	}	
		let bullet = C_XL.w('a2');
	let lockies = { 10:{section:bullet}, 20:{section:bullet}, 30:{section:bullet}, 40:{section:bullet}, 50:{section:bullet} };
	return { order:ordermerge, labels:labelsmerge, presets:lockies, count:ordermerge.length };
}





//////////////////////////////////////////////////////////////////////////////////////////////
//
//   C H A T    D I S P L A Y    (is used by M_chat )
//
C_iCHAT = function(eid, callbacks, preset) {
		preset  = preset || {};
	let b = eid+'_'; this.eids = { conv:b+'conv', interv:b+'interv', bsend:b+'bsnd', bcpy:b+'bcpy', phyls:b+'phy_' };
	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { seen:A_cb }
	this.state = C_iCHAT.defaults.align(preset);
	
	
		let bpreset = { tag:'div', css:'button steel', style:'' };
		let ui = '<div style="width:5em; height:4em; display:table-cell; vertical-align:middle; text-align:center;">'+symbol('send msg')+'</div>';
	let bsend 	= new C_iCLIK(this.eids.bsend, { click:new A_cb(this, this.onsend) }, omerge(bpreset, { ui:ui, tip:C_XL.w('tip send phylac'), keys:[C_KEY.code.s.shift+C_KEY.code.s.enter] }));
	
			ui = '<div style="width:3em; height:4em; display:table-cell; vertical-align:middle; text-align:center;">'+symbol('to clipboard')+'</div>';
	let bclip 	= new C_iCLIK(this.eids.bcpy, { click:new A_cb(this, this.oncopy) }, omerge(bpreset, { ui:ui, tip:C_XL.w('tip to clipboard'), keys:[C_KEY.code.s.ctrl+C_KEY.code.alpha.c] }));
	
		let onphyltype = new A_cb(this, this.onphyltype, null, null, 200);
	let interv 	= new C_iFIELD(this.eids.interv, { onfchange:onphyltype }, { digits:'', type:INPUT_TEXTAREA, rows:3, placeholder:'', dblclick:false } );
	
	this.controls = new A_ct({ bsend:bsend, interv:interv, bclip:bclip });
	
		let dS_chat_participant = this.state.chat.participants.bylogin.get(mobminder.context.loginId);
	this.surferparticipates = !!dS_chat_participant;
	this.partid = dS_chat_participant?dS_chat_participant.id:0;
	this.parthasquit = dS_chat_participant?dS_chat_participant.cueOut:0;
}
C_iCHAT.defaults = new A_df({chat:false, launchpad:false}); // chat is a C_dS_chat_thread
C_iCHAT.prototype = {
	display: function(css) { 
		
		let convdiv = '<tr style="height:30em; vertical-align:bottom;"><td>'+this.phylacteries()+'</td></tr>';

		let interv = '';
		if(this.state.chat.archived||this.state.chat.deletorId) {

		}
		else {
			interv = C_XL.w('chat never been');
			if(this.surferparticipates)
				if(this.parthasquit) interv = C_XL.w('chat you quit')+' ('+datetime(this.parthasquit)+')';// you have ever been in the chat
					else interv = this.intervention(); // then you may talk	
		}
		
		interv = '<tr><td style="text-align:center; padding-top:1em;" class="">'+interv+'</td></tr>'; // chat intervention form
		
		return '<table style="width:100%;">'+convdiv+interv+'</table>';
	},
	activate:function() { 
		this.controls.activate();
		this.elements.collect(this.eids);
		this.fetchphylas();
	},
	focus: function() {
		let el = this.controls.interv.elements.ui;
		if(is.tactile) return el; // no keyboard invasion on tablettes
		this.controls.interv.focus(true);
		return el;
	},
	getpost: function() { return 0; },
	prefresh: function() { // phylacteries refresh
		if(!this.state.chat) return; // preset missing
		if(!this.state.chat.id) return; // new chat
			this.phyclicks = new A_ct(); // instances of C_iCLICK that produce interactivity on phylacteries
			let phylas = this.state.chat.phylacteries.bycue.get();
			let trs = new Array();
			let talker = 0; // a login id
		// for(let cue in phylas) { talker = phylas[cue].who; break; }
		let cue;
		for(cue in phylas) {
			let dS_phyla = phylas[cue];
			let newtalker = dS_phyla.who!=talker; // indication of who takes a word displays only once before first phylactery he inserts
			if(newtalker) talker = dS_phyla.who;
			trs.push(this.phylisplay(dS_phyla, newtalker));
		}
		this.elements.conv.innerHTML = trs.join('');
		this.phyclicks.activate();
		
			let physseen = 0;
			if(this.surferparticipates) {
				let dS_chat_participant = this.state.chat.participants.bylogin.get(mobminder.context.surfer.id);
				physseen = dS_chat_participant.physseen; // freshly updated by the fetchphylas()
			}
		if(this.callbacks.seen) this.callbacks.seen.cb(this.state.chat.id, physseen);
		let ph = C_XL.w('start chat'); if(cue) ph = C_XL.w('answer here'); this.controls.interv.placeholder(ph); 
		return true;
	},
	
	// private: 
	fetchphylas: function() {
			let chatid = this.state.chat.id;
		if(chatid<=0) return;
		let p = new C_iPASS({chatid:chatid, partid:this.partid, bank:this.state.chat.bank }); // bank: helps bringing back phylacteries in the same mem bank as where the C_dS_chat_thread is stored
		mobminder.app.post({p:p}, {p:{chatid:'chatid', partid:'partid', bank:'bank' }}, './queries/phylacteries.php', new A_cb(this,this.freshphylas), new A_cb(this,this.phylasfailed));
	},
	intervention: function() { // a string of controls that allow intervention in a chat
		let interv = '<td style="">'+this.controls.interv.display()+'</td>';
		let bipost = '<td style="padding-left:1em;">'+this.controls.bsend.display();+'</td>';
		let bclip = navigator.clipboard?'<td style="padding-left:1em;">'+this.controls.bclip.display()+'</td>':'';
			// the width specified here will define the width of the global frame inside the container tab
		return '<table style="width:48em; margin:0 auto;" class=""><tr>'+interv+bipost+bclip+'</tr></table>';
	},
	phylacteries: function() {
		let t = '<table id="'+this.eids.conv+'" style="width:100%;" class="chat-phyls">'+'</table>';
		return t;
	},
	phylisplay: function(dS, newtalker) { // returns one <tr></tr>, dS is a dS_chat_phylactery
	
			let innerth = '';
			let align = dS.who==mobminder.context.surfer.id?'right':'left'; // surfer speaks right, other participants speak left
			let bullet = '', talkername = '';
			let who = C_dS_loggable.phylactag(dS.who); // returns { initials:item.initials(), css:item.lcss(), name:item.lname(), bullet:item.lbullet() }

			if(newtalker) {
					// who = '<div class="'+who.css+'">'+who.nickname+'</div>';
				bullet = who.bullet;
				talkername = who.name;
			}
			
		let wholeft = '<th style="width:1%;" class="who-left">'+(align=='left'?bullet:'')+'</th>'; 
		let whoright = '<th style="width:1%;" class="who-right">'+(align=='right'?bullet:'')+'</th>';
		
				let d = new Date(dS.cue*1000); // indicates local time at client's side
					let timefull = C_XL.date(d,{ abreviation:'full', weekday:true, time:true, split:false, year:true, weeknumb:false },mobminder.context.surfer.language);
					let htmlbla = dS.bla.htmlize();
					let tip = '<div style="text-align:center; background:rgba(255,255,255,0.5);">'+timefull+'</div>'+'<b>'+who.name+':</b>'+'<br/>&nbsp;<br/>'+htmlbla;
					
					let fpreset = { ui:htmlbla, tip:tip, tag:'span', css:'phy '+who.css  };
				let face = new C_iCLIK(this.eids.phyls+dS.id, { hold:new A_cb(this, this.onphylact, dS) }, fpreset  );
				
					let timerelative = C_XL.daterelative(d,{abreviation:'full'},mobminder.context.surfer.language);
			let when = '<span class="when">&nbsp;'+timerelative+'&nbsp;</span>';
			
			// let phyla = '<span class="phy '+who.css+'">'+dS.bla+'</span>';
				let phyla = face.display();
				let whotlk = talkername?'<span style="display:block;" class="who">'+talkername+'</span>':'';
			let says = '<td class="who-says"><div class="'+align+'">'+whotlk+phyla+when+'</div></td>';
		let tr = '<tr>'+wholeft+says+whoright+'</tr>';
		
			let click = []; click[dS.cue] = face;
		this.phyclicks.add(click);
		return tr;
	},
	
	// callback
	onphylact: function(dS_phylactery) { // interactivity on phylacteries: copy, remove, edit
		// console.log(dS_phylactery);
	},
	onsend: function() {
			let bla = this.controls.interv.getpost();
			let chatid = this.state.chat.id;
			let cue = new Date();
			let who = mobminder.context.surfer.id;
			if(!bla.length) return;
		this.controls.bsend.busy(true);
		let p = new C_iPASS({chatid:chatid, partid:this.partid, cue:cue.stamp(), who:who, bla:bla });
		mobminder.app.post({p:p}, {p:{chatid:'chatid', partid:'partid', cue:'cue', who:'who', bla:'bla' }}, './post/phylactery.php', new A_cb(this,this.posted), new A_cb(this,this.failed));
		this.controls.interv.set(''); // feeds back to here (*12)
	},
	oncopy: function() {
		
		let phyltext = function(dS) { // returns a raw text version of the philactery, dS is an o_dS_chat_phylactery
		
			let nl = String.fromCharCode(10)+String.fromCharCode(13);
			
				let dS_login = C_dS_loggable.get(dS.who);
				let who = dS_login.firstname+' '+dS_login.lastname;
			
					let d = new Date(dS.cue*1000);
				let when = d.datetimestr();
			let tr = '('+when+') '+who+':'+nl+dS.bla+nl+nl;
			return tr;
		}
		
			let phylas = this.state.chat.phylacteries.bycue.get();
			let lines = new Array();
		for(let cue in phylas) lines.push(phyltext(phylas[cue]));
		
			let summary = lines.join('');
		this.toclipboard(summary); 
	},
	onphyltype: function(t) { // keyboard typing and (*12) trigger here
		if(t) this.state.launchpad = true; else this.state.launchpad = false;
	},
	
	// ajax feedbacks
	posted: function() { this.controls.bsend.busy(false); this.controls.interv.focus(true); this.prefresh(); },
	failed: function() { this.controls.bsend.busy(false); },
	freshphylas: function(dSets, stream) { this.prefresh();	},
	phylasfailed: function() {  },
	
	// private
	fb_toclipboard: function(text) { // fallback solution for browsers having no navigator.clipboard, we don't use this solution
		let textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		try {
			let successful = document.execCommand('copy');
			let msg = successful ? 'successful' : 'unsuccessful';
			// console.log('Fallback: Copying text command was ' + msg);
		} catch (err) {
			// console.error('Fallback: Oops, unable to copy', err);
		}

		document.body.removeChild(textArea);
	},
	toclipboard: function(text) {
		if(!text) return;
		if(!navigator.clipboard) {
			fb_toclipboard(text);
			return;
		}
		navigator.clipboard.writeText(text).then( function() {
			// console.log('Async: Copying to clipboard was successful!');
		}, function(err) {
			// console.error('Async: Could not copy text: ', err);
		});
	}
}




//////////////////////////////////////////////////////////////////////////////////////////////
//   S O U N D S 
//
// usage: 
//		walle: new C_iPLAY({path:'./themes/default/'}, 'soundfile1.wav', 'fallbacksound.mp3', 'fallbacksound2.ogg', etc.. );
//		walle.play();
//
C_iPLAY = function(presets, altformats) { // provide alternative formats for browsers portability
	this.state = C_iPLAY.defaults.align(presets);
	this.audio = document.createElement('audio');
	if(!this.audio.canPlayType) { this.audio = false; return this; } //check support for HTML5 audio
	for (let i=1; i<arguments.length; i++){
		let filename = this.state.path+arguments[i];
		let sourceel = document.createElement('source'); sourceel.setAttribute('src', filename)
		if(filename.match(/\.(\w+)$/i)) sourceel.setAttribute('type', this.audiotypes[RegExp.$1]); // greps the extension of the file
		this.audio.appendChild(sourceel);
	}
	this.audio.load();
}
C_iPLAY.defaults = new A_df({ path:'' });
C_iPLAY.prototype = {
	// public
	play: function() {
		if(!this.audio) return;
		this.audio.pause();
		this.audio.currentTime=0;
		this.audio.play();
	},
	stop: function() {
		if(!this.audio) return;
		this.audio.pause();
	},
	
	// private
	audiotypes: { //define list of audio file extensions and their associated audio types. Add to it if your specified audio file isn't on this list:
		'mp3': 'audio/mpeg',
		'mp4': 'audio/mp4',
		'ogg': 'audio/ogg',
		'wav': 'audio/wav'
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   F I L E S
//
C_iFILE = function(eid, dS, callbacks, presets) { 

	this.state = C_iFILE.defaults.align(presets);
		let b = eid+'_'; 
	this.eids = { finput:b+'finput', droppy:b+'droppy' };
	this.dS = dS;
	
	// meta
	this.is = { newfile:(dS.id<=0) };
	this.state.codename = dS.codename();
	if(!this.is.newfile) this.state.fname = dS.filename;
	
	this.elements = new A_el();
	this.callbacks = callbacks || {}; // like { preupload, uploading, uploaded }
	
		let msg = this.is.newfile ? this.finvite():this.filenexticon();
		let dcss = this.is.newfile ? 'ifile ifile-new':'ifile'; 
		
	let droppy = new C_iCLIK(this.eids.droppy, { click:new A_cb(this, this.ondroppy)}, { tag:'div', ui:msg, css:dcss, style:'display:inline-block; text-align:center;', tip:this.state.tip }  );
	
	this.controls = new A_ct({ droppy:droppy });
	this.handlers = new A_hn({
		  /* drop zone */ dragenter:new A_cb(this, this.dragenter), dragover:new A_cb(this, this.dragover), ondrop:new A_cb(this, this.ondrop),
		  /* file select */ fselect: new A_cb(this, this.fselect),
		  /* file upload */ fprogress: new A_cb(this, this.fprogress), uploadover: new A_cb(this, this.uploadover), uploadtimeout: new A_cb(this, this.uploadfailed)
	});
}
C_iFILE.defaults = new A_df({ enabled:true, key:0, baseline:0, codename:'no code', busy:false, fname:false, uploaded:false, postpath:'./post/file.php', querypath:'./queries/file.php', fileclass:'C_dS_file', tip:false, timeoutseconds:20 });
C_iFILE.prototype = {
	
	// public
	display: function(css) {
		if(vbs) vlog('controls.js','C_iFILE','display','eid:'+this.eids.droppy);
		let droppy = this.controls.droppy.display();
		let input = '<input style="display:none" type="file" id='+this.eids.finput+'>'; // display:none; (used for the file selection window open interactivity)
		return droppy+input;
	},
	labelled: function(english, css) {
		return '<td class="label textcolor-light" style="">'+C_XL.w(english)+'</td><td>'+this.display(css)+'</td>';
	},
	activate: function() {
		this.elements.collect(this.eids);
		this.controls.activate();
		$(this.elements.finput).change(this.handlers.fselect);
		
		if(!is.tactile)
			if(this.is.newfile) { // allow the drag and drop interaction on computer screens
				this.controls.droppy.element().addEventListener('dragenter', this.handlers.dragenter, false);
				this.controls.droppy.element().addEventListener('dragover', this.handlers.dragover, false);
				this.controls.droppy.element().addEventListener('drop', this.handlers.ondrop, false);
			}
	},
	getpost: function() {
		return this.state.fname;
	},
	valid: function() {
		if(this.is.newfile) return this.state.uploaded;
			else return true;
	},
	reset: function() { // prepare for next upload usage
		if(vbs) vlog('controls.js','C_iFILE','reset','');
		this.busy(false);
		this.state.uploaded = false;
		this.state.fname = false;
		this.controls.droppy.set(this.finvite());
	},
	
	// private 
	upload: function(file) { // not used anymore but kept here for documental reason (replaced by mupload for multi-part content sending)
		
		// file { lastModifiedDate:jsdate, mozFullPath:"path\path\file.ext", name:"file.ext", path:"", size:5236, type:"text/plain" }
		// type can be : 
		// 		application/pdf
		// 		image/jpeg
		// 		...
		
		let name = file.name;
		if(this.callbacks.uploading) this.callbacks.uploading.cb(name);
		this.state.fname = name;
		this.busy(true);
		let fuploaded = new A_cb(this, this.fuploaded);
		
		let fd = new FormData();	
			fd.append(this.state.codename, file); // leaves client with postname like 3038_824420_0  [groupId_visiId_fId]
		let xhr = new XMLHttpRequest();
			xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
			xhr.open('POST', this.state.postpath, true);
			xhr.onreadystatechange = function() { fuploaded.cb(this.status, this.readyState, this.responseText) };
			xhr.upload.onprogress = this.handlers.fprogress;
			xhr.send(fd);
		this.uploadtimer = setTimeout(this.handlers.uploadtimeout, 20000);
		this.percents(0);
	},
	mupload: function(file) { // multipart upload. Before posting, this function grabs from its parent some post parameter through a call to this.callbacks.preupload()
		let name = file.name;
		if(this.callbacks.uploading) this.callbacks.uploading.cb(name);
		this.state.fname = name;
		this.busy(true);
		let fuploaded = new A_cb(this, this.fuploaded);
		
		let pre = {}; // specifies form data that you want to upload along with the file (e.g. login parameters)
		if(this.callbacks.preupload) pre = this.callbacks.preupload.cb(name); // must return an object like { login:'pascal', pass:'mypass' } or false to abort the upload
		if (pre === false) return this.busy(false); // abort signal has been given by preupload
		if(this.state.key) { pre['k'] = this.state.key; pre['b'] = this.state.baseline; pre['c'] = this.state.fileclass; } // posting a pre-set key or correlator along with the file
		let fd = new FormData();
			if(typeof pre == 'object') for(postname in pre) fd.append(postname, pre[postname]) 
			fd.append(this.state.codename, file); // leaves client with postname like 3038_824420_0  [groupId_visiId_fId], see (*F01*) to track this
			
		let xhr = new XMLHttpRequest();
			xhr.open('POST', this.state.postpath, true);
			xhr.onreadystatechange = function() { fuploaded.cb(this.status, this.readyState, this.responseText) };
			xhr.upload.onprogress = this.handlers.fprogress;
			xhr.send(fd);
			let ms = this.state.timeoutseconds*10000;

		this.uploadtimer = setTimeout(this.handlers.uploadtimeout, ms);
		this.percents(0);
	},
	download: function() {
		if(vbs) vlog('controls.js','C_iFILE','download','');
		let key=''; if(this.state.key) key = '&k='+this.state.key+'&b='+this.state.baseline;
		let uri = this.state.querypath+'?id='+this.dS.id+'&c='+this.state.fileclass+key;
		let el = document.createElement('a'); el.href = uri; el.download = this.state.fname;
		document.body.appendChild(el); el.click(); document.body.removeChild(el);
	},
	busy: function(onoff) {
		onoff = !!onoff;
		let changed = this.state.busy != onoff;
		this.state.busy = onoff;
		if(changed)
			if(onoff) $(this.controls.droppy.element()).addClass('busy-64');
			else $(this.controls.droppy.element()).removeClass('busy-64');
	},
	percents: function(pc) {
		let tilt = (pc==100) ? '' : '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		this.controls.droppy.set(this.innerbox(pc+' %'+tilt));
	},
	innerbox: function(msg, fextension) { // check here how to center a piece of text inside a div (using table)
		fextension = fextension||'file'; msg = msg||C_XL.w('drop file here');
			let s = '<td>'+symbol(fextension,'fa-2x','padding-right:0.3em;')+'</td>';
			let n = '<td style="line-height:1.1em; font-size:85%; white-space:normal; max-width:12em; text-align:left; vertical-align:middle;">'+msg+'</td>';
		return '<div style="width:18em; height:6em; display:table-cell; vertical-align:middle;"><table style="margin:0 auto;"><tr>'+s+n+'</tr></table></div>';
	},
	finvite: function() { return this.innerbox(C_XL.w('drop file here')); },
	filenexticon: function() { return this.innerbox(this.state.fname,this.dS.fextension()); },
	
	// events
	fselect: function() { // OS file selection tool has been used
		if(vbs) vlog('controls.js','C_iFILE','fselect','');
		let files = this.elements.finput.files; // when using input of type = file
		let file = files[0];
		this.mupload(file);
	},
	
	// callbacks
	ondroppy: function() {
		if(vbs) vlog('controls.js','C_iFILE','ondroppy','new:'+this.is.newfile);
		if(this.is.newfile) // allow to upload a file by opening the device selection tool
			this.elements.finput.click();
		else // download the file
			this.download();
	},
	
	// handlers
	dragenter: function(e) {
		if(vbs) vlog('controls.js','C_iFILE','dragenter','');
		e.stopPropagation();
		e.preventDefault();
	},
	dragover: function(e) {
		if(vbs) vlog('controls.js','C_iFILE','dragover','');
		e.stopPropagation();
		e.preventDefault();
	},
	ondrop: function(e) { // file has been mouse dropped onto the drop area
		if(vbs) vlog('controls.js','C_iFILE','ondrop','');
		e.stopPropagation();
		e.preventDefault();
		
		let dt = e.dataTransfer;
		let files = dt.files;
		let file = files[0]; 
		this.mupload(file);
	},
	fprogress: function(e) {
		if(vbs) vlog('controls.js','C_iFILE','fprogress','');
		if (e.lengthComputable) {
			let p = Math.round((e.loaded*100)/e.total);
			this.percents(p);
		}
	},
	fuploaded: function(status, ready, stream) {
		if(vbs) vlog('controls.js','C_iFILE','fuploaded','status:'+status+', ready:'+ready);
		if(status!=200) return;
		if(ready!=4) return;
		clearTimeout(this.uploadtimer);
		let split = stream.split('##'); let msgs = split.shift();
		let errcode = split.shift()|0;
		let errmsg = split.shift();
		if(this.callbacks.uploaded) this.callbacks.uploaded.cb(this.state.fname, errcode, msgs, errmsg);
		this.state.uploaded = !errcode;
		if(this.state.uploaded) {
			this.percents(100);
			this.busy(false);
			setTimeout(this.handlers.uploadover, 2000); 
		} else {
			this.uploadfailed();
		}
	},
	uploadover: function() {
		if(vbs) vlog('controls.js','C_iFILE','uploadover','successful upload');
		this.controls.droppy.set(this.filenexticon());
	},
	uploadfailed: function() {
		if(vbs) vlog('controls.js','C_iFILE','uploadfailed','');
		this.busy(false);
		new C_iMSG(C_XL.w('upload failed'));
		this.reset();
	}

}




//////////////////////////////////////////////////////////////////////////////////////////////
//
//    L O G I N      P A S S      Q U I C K      C H E C K E R    
//
C_iCHECKIN = function(eid, preset, callbacks) { // callbacks like { checkin:A_cb } 
	this.state = C_iCHECKIN.defaults.align(preset=preset||{});
	this.callbacks = callbacks||{};
	this.eids = { login:eid+'_login', pass:eid+'_pass', wrapper:eid+'_wrp' };
	this.elements = new A_el();
	
		let lpchanged = new A_cb(this, this.lpchanged, null, null, 1000);
		let lpcleared = new A_cb(this, this.lpcleared);
	let login = new C_iFIELD(this.eids.login, { onfchange:lpchanged, onfclear:lpcleared}, { focus:true, digits:'', type:INPUT_ALPHA, placeholder:'Login' }); 
	let pass = new C_iFIELD(this.eids.pass, { onfchange:lpchanged, onfclear:lpcleared}, { focus:false, digits:'', type:INPUT_ALPHA, placeholder:'Password' }); 
	
	this.controls = new A_ct( { login:login, pass:pass } );
}
C_iCHECKIN.defaults = new A_df( { xpectedalevel:0, key:0, login:0, account:0, language:0 });
C_iCHECKIN.prototype = {
	// public
	display: function() { 
		// do not call this function from inside the callback call, use instead the return value of the callbacks.dogstream() to turn of further watchdog
		if(vbs) vlog('smstest.js','C_iCHECKIN','display','');
		
		let login = '<tr>'+this.controls.login.labelled('login')+'</tr>';
		let pass = '<tr>'+this.controls.pass.labelled('pass')+'</tr>';
		
		return login+pass;
	},
	activate: function() {
		if(vbs) vlog('smstest.js','C_iCHECKIN','activate',''); 
		this.elements.collect(this.eids);
		this.controls.activate('C_iCHECKIN');
	},
	getlp: function() {
		let login = this.controls.login.value();
		let pass = this.controls.pass.value();
		if(!this.state.key) { login = false; pass = false; }
		return { login:login, pass:pass };
	},

	// callbacks from sub controls
	lpchanged: function(digits) { 
		let login = this.controls.login.value();
		let pass = this.controls.pass.value();
		if(vbs) vlog('smstest.js','C_iCHECKIN','lpchanged','login:'+login+', pass:'+pass);
		if(!(login&&pass)) return;
		this.controls.pass.busy(true);
		this.checkin(login,pass);
	},
	lpcleared: function() { 
		if(vbs) vlog('smstest.js','C_iCHECKIN','lpcleared','');
		this.state.key = 0;
		if(this.callbacks.checkin) this.callbacks.checkin.cb(0);
	},
	
	// private
	checkin: function(login, pass) {
		let data = new C_iPASS({l:login, p:pass, x:this.state.xpectedalevel});
		new A_ps({data:data}, {data:{l:'l', p:'p', x:'x'}}, './queries/checkin.php', { onreply:new A_cb(this,this.lpvalidation), ontimeout:new A_cb(this,this.failed) } );
		this.controls.pass.busy(true);
	},
	
	// ajax feedbacks
	lpvalidation: function(stream) { // ajax feedback
		this.controls.pass.busy(false);
			let split = stream.split('!');
		let key = split.shift()|0;
		let login = split.shift()|0;
		let account = split.shift()|0;
		let language = split.shift()|0;
		if(vbs) vlog('smstest.js','C_iCHECKIN','lpvalidation','key='+key+', login='+login+', account='+account+', language='+language); 
		this.state.key = key|0;
		this.state.login = login|0;
		this.state.account = account|0;
		this.state.language = language|0;
		if(this.callbacks.checkin) this.callbacks.checkin.cb(key, login, account, language);
	},
	failed: function() { this.controls.pass.busy(false); }
}





//////////////////////////////////////////////////////////////////////////////////////////////
//   W A T C H D O G S
//
C_iWatchdog = function(preset, callbacks, name) { // callbacks like { dogstream:A_cb, predog:A_cb } 
	this.state = C_iWatchdog.defaults.align(preset=preset||{});
	this.callbacks = callbacks||{};
	this.timer = false;
		let now = new Date();
	this.wdname = name||('dog'+now.HHmm());
	this.init();
	if(vbs) vlog('controls.js','C_iWatchdog','new','name:'+this.wdname+', suspended:'+this.state.suspend+', wait:'+this.state.wait);
}
C_iWatchdog.defaults = new A_df( { url:'./queries/watchdog.php', rythm:(60*30) , suspend:false, post:false, wait:0  });  // post like {values:{a:1,b:2}, names:{a:'a',b:'b'}}
C_iWatchdog.prototype = {
	// public
	suspend: function(on, wait) { 
		// do not call this function from inside the callback call, use instead the return value of the callbacks.dogstream() to turn of further watchdog
		if(vbs) vlog('controls.js','C_iWatchdog','suspend','name:'+this.wdname+', suspended:'+on);
		this.state.suspend = !!on; 
		this.state.wait = wait|0;
		if(this.state.suspend == true) { 
			if(this.timer) { clearTimeout(this.timer); this.timer = false; } 
		}
		else
			if(!this.timer) this.init(); // you reactivate the timer (this will take care of a wait pre-timer)
	},
	trigger: function(post) {  // post like {values:{a:1,b:2}, names:{a:'a',b:'b'}}
		
		if(vbs) vlog('controls.js','C_iWatchdog','trigger','name:'+this.wdname+', suspended:'+this.state.suspend);

		if(post) this.state.post = post;
		if(this.timer) clearTimeout(this.timer);
		this.again();
	},

	// private
	init: function() {
		if(vbs) vlog('controls.js','C_iWatchdog','init','name:'+this.wdname+', suspended:'+this.state.suspend+', wait:'+this.state.wait);
		if(this.state.suspend) return false;
		if(!this.state.wait) return this.again();
			let that = this; 
		this.timer = setTimeout(function(){ return that.again()}, this.state.wait*1000); 
		this.state.wait = 0;
	},
	tempo: function() {
			let that = this;
		if(this.state.suspend) return;
		this.timer = setTimeout(function(){ return that.again()}, this.state.rythm*1000);
	},
	again: function() {
		this.timer = false;
			let docall = true; if(this.callbacks.predog) docall = this.callbacks.predog.cb();
		if(docall!==false) { 
			if(typeof docall === 'object') { // like { values:{date:o.date,ics:o.ics,tcs:o.tcs}, names:{date:'date',ics:'ics',tcs:'tcs'} }
				if(docall.values&&docall.names) { 
					let p = new C_iPASS(docall.values); // values and names are defined by docall return values
					mobminder.app.post({p:p}, {p:docall.names}, this.state.url, new A_cb(this,this.feedback));
				}
			}
			else { // docall is true or an integer
				if(this.state.post) { values = this.state.post.values; names = this.state.post.names; }
					else { values = this.wdname; names = 'wdname'; }
				let p = new C_iPASS(values);
				mobminder.app.post({p:p}, {p:names}, this.state.url, new A_cb(this,this.feedback));
			}
		}
		// else return this.state.suspend = true;
		else {
			this.tempo();
			return true; // simply skip the server call, but keep running
		}
	},
	feedback: function(dS, s) {
		if(vbs) vlog('controls.js','C_iWatchdog','feedback','name:'+this.wdname+'');
		if(this.callbacks.dogstream) this.state.suspend = this.callbacks.dogstream.cb(dS, s);
		this.tempo();
	},
}



//////////////////////////////////////////////////////////////////////////////////////////////
//   B L I N K I N G    S T U F F S 
//
function blink(speed) {

    if (speed) { // initialization
        if (document.getElementsByTagName('blink')) setInterval('blink()', speed*2000); return; 
    }

    let blinkies = document.getElementsByTagName('blink');
    for (let i=0; i<blinkies.length; i++) {
        blinkies[i].style.visibility = blinkies[i].style.visibility == '' ? 'hidden' : ''; // toggles the visibility attribute
    }
}
setTimeout( function(){ return blink(0.5) }, 60*1000); // delays the blinking by 30 seconds so not to disturb call centers operators



