
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
// © Copyright 2007-2026 - PASCAL VANHOVE - 70.12.30-097.72 - Belgium


//////////////////////////////////////////////////////////////////////////////////////////////
//
//   M E N U   is a list of C_iCLICK controls
//
//   no checkbox nor radio buttons, check C_iCRESTA if you need that 
//
function C_iMENU(eid, callbacks, options, preset) { // options is { labels:{}, order:{}, presets:{}, count: } 
		preset = preset || {};
	this.state = C_iMENU.defauts.align(preset); 
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
			let morep = { value:v, ui:l, tag:'td', css:'menu-label'};
		let label = new C_iCLIK(eid, { click: new A_cb(this,this.onlabel) }, omerge(p,morep) );
		this.labels.add1(label, x);
		if(label.state.selected) this.state.selected = x;
	}
	this.options = options; 
	
		let title = this.state.title?new C_iCLIK(this.eids.title,{click:new A_cb(this, this.ontitle)},{ui:this.state.title, tag:'div'}):false;
		let table = new C_iTABLE(this.eids.eid, this.labels, {maxrows:preset.maxrows, maxcols:preset.maxcols});

	this.controls = new A_ct({title:title, table:table});
	
	if(preset.value!==undefined) this.select(preset.value, true, {reset:true}); // place a selection css on one label
}
C_iMENU.defauts = new A_df({ 
	  maxcols:4, maxrows:12, title:false, cssclass:'menu-table', tabselect:false // preset options
	, arrowed:false, highlighted:false, selected:false // state machine
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
			new C_KEY([C_KEY.code.s.up_arrow, C_KEY.code.s.down_arrow, C_KEY.code.s.tab], new A_cb(this, this.arrows), 'C_iMENU::'+this.eids.eid);
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
	onlabel: function(o) {
		if(this.callbacks.onlabel) this.callbacks.onlabel.cb(o.state.value);
	},
	ontitle: function() {
		if(this.callbacks.ontitle) this.callbacks.ontitle.cb();
	},
	arrows: function(keycode) {
		switch(keycode) {
			case C_KEY.code.s.down_arrow: this.next(); break;
			case C_KEY.code.s.up_arrow: this.previous(); break;
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
	let	title = this.state.title?new C_iCLIK(this.eids.title,{click:new A_cb(this, this.ontitle)},{ui:this.state.title,tag:'div',idle:this.state.disabletitleclick}):false;

	let table = new C_iTABLE(this.eids.eid, this.items, {maxrows:preset.maxrows, maxcols:preset.maxcols});
	this.controls = new A_ct({title:title, table:table});
	if(this.state.locked) this.lock(undefined, this.state.locked); // locks all options
}
C_iCRESTA.defauts = new A_df({ locked:false, reset:0, emptypost:'-', postmode:'join', skin:1, mode:1, maxcols:4, maxrows:12, title:false, flip:false,disabletitleclick:false });
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
								, width:false, height:false, css:'', tabindex:false, busy:false, tip:false,solid:false } );
C_iBUTTON.prototype = {
	display: function(preset) { // preset like {caption:'caption', width:4, height:4, css:'acss', tabindex:2, tip:'tiptext' }
		// this.state = this.state.align(preset);
			preset = preset||{};
			if(preset.caption) this.state.caption = preset.caption;
			if(preset.width) this.state.width = preset.width;
			if(preset.height) this.state.height = preset.height;
			if(preset.css) this.state.css = preset.css;
			if(preset.tip) this.state.tip = preset.tip;
			if(preset.tag) this.state.tag = preset.tag;
			if(preset.solid) this.state.solid = preset.solid;
		
		if(this.state.tip) this.controls.add1(new C_iTIP(this.eids.button, {text:this.state.tip, css:'tip'} ), 'tip');
		let tabindex = (this.state.tabindex) ? 'tabindex="'+this.state.tabindex+'"' : '';
		let css = 'button '+this.state.css;
		let width = this.state.width ? ' width:'+this.state.width+'em;' : '';
		if(width.includes("%")) width=width.replace('em',''); //DEV : allow % instead of em values
		let height = this.state.height ? ' height:'+this.state.height+'em;' : '';
		let hidden = this.state.hidden ? ' display:none;' : '';
		
		//let button = '<input '+tabindex+' id="'+this.eids.button+'" type="button" value="'+this.state.caption+'" style="'+width+height+hidden+'" class="'+css+'"/>';
		
		let caption=(this.state.tag?this.state.tag+' ':'')+this.state.caption;
		//&#xf35b;
		//let caption2 = '<i style="padding-right:10px;" class="fa fa-arrow-alt-circle-up fa-1d5x"></i>';
		let button = '<input '+tabindex+' id="'+this.eids.button+'" type="button" value="'+caption+'" style="'+width+height+hidden
		+'" class="'+(this.state.tag?(this.state.solid?'fa-input-solid ':'fa-input '):'')+css+'"/>';
		//console.log("button="+button);
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

		
		//let caption= (this.state.tag?this.state.tag+' ':'')+this.state.caption;

		$(this.elements.button).removeClass('button-busy'); //.attr('value', caption);
		//$(this.elements.button).removeClass('button-busy').attr('value', this.state.caption);
		if(onOff)
		{
			$(this.elements.button).addClass('button-busy'); //.attr('value', ' ');
		}
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
	labelled: function(english, css, options) { // css applies to label
			css = css || '';
			options = options || { table:false, reverse:false };
		let range = '<td>'+this.controls.onoff.display()+'</td>';
		let label = '<td class="label textcolor-light '+css+'" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td>';
		let packg = options.reverse?range+label:label+range; // setting followed by lable or label followed by setting
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
		if(x>C_iTIP.status.limit.x) x = x - this.status.actualsize.x - this.status.offset.x - 2; // (X swapped case)
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
		if(y>C_iTIP.status.limit.y) { y = y - this.status.actualsize.y - this.status.offset.y - 2; yswapped = true; } // (Y swapped case)
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
		C_iTIP.status.timer = setTimeout(C_iTIP.handlers.delayed, 350, this.id);
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






function C_iNOTE(eid, textpreset, preset) {
	this.state = C_iNOTE.defauts.align(preset = preset || {});
	this.field = new C_iFIELD(eid, false, {max:1024, digits:textpreset, type:preset.type||INPUT_ML_TEXT, placeholder:preset.placeholder, rows:preset.rows, focus:preset.focus, dblclick:false, enabled:preset.enabled }); 
}
C_iNOTE.defauts = new A_df( { rows:5 } );
C_iNOTE.prototype = {
	display: function(cssTitle, cssField, label) {
		return this.field.display(cssField, label, cssTitle);
	},
	labelled: function(english, css) {		
		return '<td class="label textcolor-light" style="white-space:nowrap; text-align:right;">'+C_XL.w(english)+'</td><td>'+this.field.display(css)+'</td>';
	},
	activate: function() { this.field.activate(); },
	insert: function(i) { return this.field.insert(i); },
	focus: function(set) { return this.field.focus(set); },
	getpost: function() { return this.field.getpost(); }
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
	//DEV : disabletitleclick:true => disable click event on title, no more used
	if(this.has.bCals) this.controls.add1(new C_iCRESTA(this.eids.bCal, {onchange:new A_cb(this,this.select,class_bCal)}, C_dS_resource.options(class_bCal, optcheck[class_bCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].bCal, title:C_XL.w(class_bCal), reset:1,disabletitleclick:true }), class_bCal);
	if(this.has.uCals) this.controls.add1(new C_iCRESTA(this.eids.uCal, {onchange:new A_cb(this,this.select,class_uCal)}, C_dS_resource.options(class_uCal, optcheck[class_uCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].uCal, title:C_XL.w(class_uCal), reset:1,disabletitleclick:true }), class_uCal);
	if(this.has.fCals) this.controls.add1(new C_iCRESTA(this.eids.fCal, {onchange:new A_cb(this,this.select,class_fCal)}, C_dS_resource.options(class_fCal, optcheck[class_fCal]), { maxrows:this.state.maxrows, locked:preset.locked, mode:selmode[mode].fCal, title:C_XL.w(class_fCal), disabletitleclick:true }), class_fCal);
	
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
		
		/*if(class_bCal in this.controls) bCal = this.state.show.bCals?'<td>'+this.controls[class_bCal].display()+'</td>':'';
		if(class_uCal in this.controls) uCal = this.state.show.uCals?'<td>'+this.controls[class_uCal].display()+'</td>':'';
		if('staffsize' in this.controls) s = this.state.show.contingent?'<td>'+this.controls.staffsize.display(css)+'</td>':'';
		if(class_fCal in this.controls) fCal = this.state.show.fCals?'<td>'+this.controls[class_fCal].display()+'</td>':'';
		return '<table style="text-align:left;"><tr style="vertical-align:top">'+bCal+fCal+s+uCal+'</tr></table>';*/

		if(class_bCal in this.controls) bCal = this.state.show.bCals?'<div style="display:block; flex-grow:1;"><td>'+this.controls[class_bCal].display()+'</td></div>':'';
		if(class_uCal in this.controls) uCal = this.state.show.uCals?'<div style="display:block; flex-grow:1;"><td>'+this.controls[class_uCal].display()+'</td></div>':'';
		/*if('staffsize' in this.controls) s = this.state.show.contingent?<td>'+this.controls.staffsize.display(css)+'</td>':''; A enlever car utile seulement pour la webapp*/
		if(class_fCal in this.controls) fCal = this.state.show.fCals?'<div style="display:block; flex-grow:1;"><td>'+this.controls[class_fCal].display()+'</td></div>':'';
		return '<div style="text-align:left; display:flex; flex-wrap:wrap; gap:0.5em;">'+bCal+fCal+uCal+'</div>'; 

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
	let radio = new C_iCRESTA(this.eids.radio, { onchange:new A_cb(this, this.onselect) }, options, { title:C_XL.w(this.state.title), skin:skin, mode:mode,maxcols:(is.small?1:2), maxrows:(is.small?false:(preset.maxrows||12)),disabletitleclick:true } );
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
		//BSP 2024-05-15 : add "search as from before date in radiobutton tooltip"
		presets[i] = { tip:C_XL.w('search as from')+' '+ C_XL.date(date,{abreviation:'abr',weekday:true}), checked:!!(precheck&checkbit) };
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
			const that = this; 
		this.timer = setTimeout(function(){ return that.again()}, this.state.wait*1000); 
		this.state.wait = 0;
	},
	tempo: function() {
			const that = this;
		if(this.state.suspend) return;
		this.timer = setTimeout(function(){ return that.again()}, this.state.rythm*1000);
	},
	again: function() {
		this.timer = false;
			let docall = true; if(this.callbacks.predog) docall = this.callbacks.predog.cb();
		if(docall!==false) { 
			if(typeof docall === 'object') { // like { values:{date:o.date,ics:o.ics,tcs:o.tcs}, names:{date:'date',ics:'ics',tcs:'tcs'} }
				if(docall.values&&docall.names) { 
					const p = new C_iPASS(docall.values); // values and names are defined by docall return values
					mobminder.app.post({p:p}, {p:docall.names}, this.state.url, new A_cb(this,this.feedback));
				}
			}
			else { // docall is true or an integer
				if(this.state.post) { values = this.state.post.values; names = this.state.post.names; }
					else { values = this.wdname; names = 'wdname'; }
					const p = new C_iPASS(values);
				mobminder.app.post({p:p}, {p:names}, this.state.url, new A_cb(this,this.feedback),new A_cb(this,this.failure));
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
	failure: function(){
		if(vbs) vlog('controls.js','C_iWatchdog','failure','name:'+this.wdname+'');
		if(this.callbacks.failure) this.state.suspend = this.callbacks.failure.cb();
		this.tempo();
	}
}
